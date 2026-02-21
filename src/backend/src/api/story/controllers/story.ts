/**
 * story controller
 */

import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';
import type { Story, Category } from '../../../types/strapi.d';

// Meilisearch / Redis Clients

interface MeiliClient {
    index(name: string): MeiliIndex;
}

interface MeiliSearchParams {
    filter?: string;
    sort?: string[];
    hitsPerPage?: number;
    page?: number;
    attributesToHighlight?: string[];
    highlightPreTag?: string;
    highlightPostTag?: string;
    attributesToRetrieve?: string[];
}

interface MeiliSearchResult {
    hits: Story[];
    totalHits?: number;
    page?: number;
    hitsPerPage?: number;
}

interface MeiliIndex {
    search(query: string, params?: MeiliSearchParams): Promise<MeiliSearchResult>;
}

interface RedisClient {
    isOpen: boolean;
    connect(): Promise<void>;
    on(event: string, handler: () => void): void;
    multi(): RedisPipeline;
    zRangeWithScores(key: string, min: number, max: number, options?: { REV?: boolean }): Promise<Array<{ value: string; score: number }>>;
}

interface RedisPipeline {
    zIncrBy(key: string, increment: number, member: string): this;
    expireAt(key: string, timestamp: number): this;
    exec(): Promise<unknown[]>;
}

// Lazy-init singletons
let meiliClientInstance: MeiliClient | null = null;
let redisClientInstance: RedisClient | null = null;
let redisConnecting = false;

function getMeiliClient(log: Core.Strapi['log']): MeiliClient | null {
    if (meiliClientInstance) return meiliClientInstance;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { MeiliSearch } = require('meilisearch');
        meiliClientInstance = new MeiliSearch({
            host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
            apiKey: process.env.MEILISEARCH_KEY || '',
        }) as MeiliClient;
        return meiliClientInstance;
    } catch {
        log?.warn('[Search] meilisearch package not installed. Using Strapi DB fallback.');
        return null;
    }
}

async function getRedisClient(log: Core.Strapi['log']): Promise<RedisClient | null> {
    if (redisClientInstance?.isOpen) return redisClientInstance;
    if (redisConnecting) return null;
    redisConnecting = true;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { createClient } = require('redis');
        redisClientInstance = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            socket: { connectTimeout: 2000, reconnectStrategy: false },
        }) as RedisClient;
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

// Helpers

// Log keyword helper (outside controller so _logKeyword isn't a route)
async function logKeyword(keyword: string, log: Core.Strapi['log']): Promise<void> {
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

interface DbSearchResult {
    results: Story[];
    total: number;
    page: number;
    limit: number;
}

// Strapi DB fallback search
async function strapiDbSearch(
    strapi: Core.Strapi,
    q: string,
    page: number,
    limit: number,
    sort: string,
): Promise<DbSearchResult> {
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

    return { results: results as Story[], total: total as number, page, limit };
}

// Controller

export default factories.createCoreController('api::story.story', ({ strapi }) => ({

    // Homepage (existing)
    async getHomePage(ctx) {
        try {
            const data = await strapi.service('api::story.story').getHomePageData();
            return data;
        } catch (err: unknown) {
            ctx.throw(500, err);
        }
    },

    // Full search
    async search(ctx) {
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

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            strapi.log.error('[Search] Error:', message);
            const data = await strapiDbSearch(strapi, keyword, Number(page), Number(limit), sort);
            return ctx.send(data);
        }
    },

    // Autocomplete
    async autocomplete(ctx) {
        const { q = '', limit = '8' } = ctx.query as Record<string, string>;
        const keyword = String(q).trim();

        if (!keyword || keyword.length < 2) {
            return ctx.send({ suggestions: [] });
        }

        // Helper: Strapi DB fallback for autocomplete
        const dbFallback = async (): Promise<Story[]> => {
            const results = await strapi.db.query('api::story.story').findMany({
                where: { title: { $containsi: keyword } },
                select: ['id', 'title', 'slug', 'view_count'],
                populate: { cover: { fields: ['url'] } },
                orderBy: { view_count: 'desc' },
                limit: Number(limit),
            });
            return results as Story[];
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

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            strapi.log.error(`[Autocomplete] Meilisearch failed, falling back to DB. Error: ${message}`);
            // Fallback to Strapi DB search instead of returning empty
            try {
                const results = await dbFallback();
                return ctx.send({ suggestions: results, query: keyword });
            } catch (dbErr: unknown) {
                const dbMessage = dbErr instanceof Error ? dbErr.message : String(dbErr);
                strapi.log.error(`[Autocomplete] DB fallback also failed: ${dbMessage}`);
                return ctx.send({ suggestions: [], query: keyword });
            }
        }
    },

    // Hot Searches
    async hotSearches(ctx) {
        const { limit = '10', window: timeWindow = '24h' } = ctx.query as Record<string, string>;

        try {
            const redis = await getRedisClient(strapi.log);

            if (!redis) {
                return ctx.send({ hot: [], window: timeWindow });
            }

            const key = timeWindow === '7d' ? 'hot_searches:7d' : 'hot_searches:24h';
            const raw = await redis.zRangeWithScores(key, 0, Number(limit) - 1, { REV: true });

            const hot = raw.map((item) => ({
                keyword: item.value,
                score: Math.round(item.score),
            }));

            return ctx.send({ hot, window: timeWindow });

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            strapi.log.error('[HotSearch] Error:', message);
            return ctx.send({ hot: [] });
        }
    },

    // Log Search
    async logSearch(ctx) {
        const body = ctx.request.body as { keyword?: string };
        const keyword = String(body?.keyword || '').trim().toLowerCase();

        if (!keyword || keyword.length < 2) {
            return ctx.send({ ok: false });
        }

        await logKeyword(keyword, strapi.log);
        return ctx.send({ ok: true });
    },

}));
