/**
 * story controller
 */

import { factories } from '@strapi/strapi';

// Lazy-init singletons
let meiliClientInstance: any = null;
let redisClientInstance: any = null;
let redisConnecting = false;

function getMeiliClient(log: any) {
    if (meiliClientInstance) return meiliClientInstance;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { MeiliSearch } = require('meilisearch');
        meiliClientInstance = new MeiliSearch({
            host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
            apiKey: process.env.MEILISEARCH_KEY || '',
        });
        return meiliClientInstance;
    } catch {
        log?.warn('[Search] meilisearch package not installed. Using Strapi DB fallback.');
        return null;
    }
}

async function getRedisClient(log: any) {
    if (redisClientInstance?.isOpen) return redisClientInstance;
    if (redisConnecting) return null;
    redisConnecting = true;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { createClient } = require('redis');
        redisClientInstance = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            socket: { connectTimeout: 2000, reconnectStrategy: false },
        });
        redisClientInstance.on('error', () => { /* suppress */ });
        await redisClientInstance.connect();
        return redisClientInstance;
    } catch {
        log?.warn('[Search] Redis not available. Hot search disabled.');
        redisClientInstance = null;
        return null;
    } finally {
        redisConnecting = false;
    }
}

// Log keyword helper (outside controller so _logKeyword isn't a route)
async function logKeyword(keyword: string, log: any) {
    try {
        const redis = await getRedisClient(log);
        if (!redis) return;

        const now = Date.now();
        const DAY_SECONDS = 86400;
        const WEEK_SECONDS = 604800;
        const pipeline = redis.multi();
        pipeline.zIncrBy('hot_searches:24h', 1, keyword);
        pipeline.expireAt('hot_searches:24h', Math.floor(now / 1000) + DAY_SECONDS);
        pipeline.zIncrBy('hot_searches:7d', 1, keyword);
        pipeline.expireAt('hot_searches:7d', Math.floor(now / 1000) + WEEK_SECONDS);
        await pipeline.exec();
    } catch {
        // Non-critical, ignore
    }
}

// Strapi DB fallback search
async function strapiDbSearch(strapi: any, q: string, page: number, limit: number, sort: string) {
    const [sortField, sortOrder] = sort.split(':');
    const offset = (page - 1) * limit;

    const [results, total] = await Promise.all([
        strapi.db.query('api::story.story').findMany({
            where: {
                $or: [
                    { title: { $containsi: q } },
                    { author: { $containsi: q } },
                ],
            },
            populate: { cover: { fields: ['url'] }, categories: { fields: ['name', 'slug'] } },
            orderBy: { [sortField]: (sortOrder || 'desc') as 'asc' | 'desc' },
            limit,
            offset,
        }),
        strapi.db.query('api::story.story').count({
            where: {
                $or: [
                    { title: { $containsi: q } },
                    { author: { $containsi: q } },
                ],
            },
        }),
    ]);

    return { results, total, page, limit };
}

// Controller
export default factories.createCoreController('api::story.story', ({ strapi }) => ({

    // Homepage (existing)
    async getHomePage(ctx: any) {
        try {
            const data = await strapi.service('api::story.story').getHomePageData();
            return data;
        } catch (err) {
            ctx.throw(500, err);
        }
    },

    // Full search
    async search(ctx: any) {
        const {
            q = '',
            page = '1',
            limit = '20',
            sort = 'view_count:desc',
            genre,
            status,
        } = ctx.query as Record<string, string>;

        const keyword = String(q).trim();
        if (!keyword) {
            return ctx.send({ results: [], total: 0, page: 1, limit: Number(limit) });
        }

        // Log keyword fire-and-forget
        logKeyword(keyword.toLowerCase(), strapi.log).catch(() => { });

        try {
            const client = getMeiliClient(strapi.log);

            if (!client) {
                const data = await strapiDbSearch(strapi, keyword, Number(page), Number(limit), sort);
                return ctx.send(data);
            }

            const index = client.index('stories');
            const filters: string[] = [];
            if (genre) filters.push(`categories = "${genre}"`);
            if (status) filters.push(`status = "${status}"`);

            const result = await index.search(keyword, {
                filter: filters.length ? filters.join(' AND ') : undefined,
                sort: sort ? [sort] : ['view_count:desc'],
                hitsPerPage: Number(limit),
                page: Number(page),
                attributesToHighlight: ['title'],
                highlightPreTag: '<mark>',
                highlightPostTag: '</mark>',
                attributesToRetrieve: ['id', 'title', 'slug', 'cover', 'view_count', 'rating', 'status', 'categories'],
            });

            return ctx.send({
                results: result.hits,
                total: result.totalHits,
                page: result.page,
                limit: result.hitsPerPage,
                query: keyword,
            });

        } catch (err: any) {
            strapi.log.error('[Search] Error:', err?.message);
            const data = await strapiDbSearch(strapi, keyword, Number(page), Number(limit), sort);
            return ctx.send(data);
        }
    },

    // Autocomplete
    async autocomplete(ctx: any) {
        const { q = '', limit = '8' } = ctx.query as Record<string, string>;
        const keyword = String(q).trim();

        if (!keyword || keyword.length < 2) {
            return ctx.send({ suggestions: [] });
        }

        // Helper: Strapi DB fallback for autocomplete
        const dbFallback = async () => {
            const results = await strapi.db.query('api::story.story').findMany({
                where: { title: { $containsi: keyword } },
                select: ['id', 'title', 'slug', 'view_count'],
                populate: { cover: { fields: ['url'] } },
                orderBy: { view_count: 'desc' },
                limit: Number(limit),
            });
            return results;
        };

        try {
            const client = getMeiliClient(strapi.log);

            if (!client) {
                const results = await dbFallback();
                return ctx.send({ suggestions: results, query: keyword });
            }

            const index = client.index('stories');
            const result = await index.search(keyword, {
                hitsPerPage: Number(limit),
                sort: ['view_count:desc'],
                attributesToRetrieve: ['id', 'title', 'slug', 'cover', 'view_count', 'rating'],
            });

            return ctx.send({ suggestions: result.hits, query: keyword });

        } catch (err: any) {
            strapi.log.error(`[Autocomplete] Meilisearch failed, falling back to DB. Error: ${err?.message || err}`);
            // Fallback to Strapi DB search instead of returning empty
            try {
                const results = await dbFallback();
                return ctx.send({ suggestions: results, query: keyword });
            } catch (dbErr: any) {
                strapi.log.error(`[Autocomplete] DB fallback also failed: ${dbErr?.message || dbErr}`);
                return ctx.send({ suggestions: [], query: keyword });
            }
        }
    },

    // Hot Searches
    async hotSearches(ctx: any) {
        const { limit = '10', window: timeWindow = '24h' } = ctx.query as Record<string, string>;

        try {
            const redis = await getRedisClient(strapi.log);

            if (!redis) {
                return ctx.send({ hot: [], window: timeWindow });
            }

            const key = timeWindow === '7d' ? 'hot_searches:7d' : 'hot_searches:24h';
            const raw = await redis.zRangeWithScores(key, 0, Number(limit) - 1, { REV: true });

            const hot = (raw as Array<{ value: string; score: number }>).map((item) => ({
                keyword: item.value,
                score: Math.round(item.score),
            }));

            return ctx.send({ hot, window: timeWindow });

        } catch (err: any) {
            strapi.log.error('[HotSearch] Error:', err?.message);
            return ctx.send({ hot: [] });
        }
    },

    // Log Search
    async logSearch(ctx: any) {
        const body = ctx.request.body as { keyword?: string };
        const keyword = String(body?.keyword || '').trim().toLowerCase();

        if (!keyword || keyword.length < 2) {
            return ctx.send({ ok: false });
        }

        await logKeyword(keyword, strapi.log);
        return ctx.send({ ok: true });
    },

}));
