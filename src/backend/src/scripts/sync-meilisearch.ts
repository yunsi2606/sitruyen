/**
 * Meilisearch Index Sync Script
 * Run: npx ts-node -e "require('./src/scripts/sync-meilisearch').syncStories()"
 * Or via Strapi bootstrap / cron
 *
 * Syncs all stories to Meilisearch index with correct ranking rules.
 */

import type { Core } from '@strapi/strapi';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MeiliSearch } = require('meilisearch');


const MEILI_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
const MEILI_KEY = process.env.MEILISEARCH_KEY || '';
const INDEX_NAME = 'stories';

export async function syncStories(strapi: Core.Strapi) {
    const client = new MeiliSearch({ host: MEILI_HOST, apiKey: MEILI_KEY });

    strapi.log.info('[MeiliSync] Starting story sync...');

    // Configure index settings
    const index = client.index(INDEX_NAME);

    await index.updateSettings({
        // Fields Meilisearch uses for search relevance
        searchableAttributes: ['title', 'author', 'description_text', 'categories_names'],

        // Fields that can be used for filtering
        filterableAttributes: ['status', 'categories', 'author'],

        // Fields available for sorting
        sortableAttributes: ['view_count', 'rating', 'follow_count', 'updatedAt', 'createdAt'],

        /**
         * Ranking Rules (order matters!):
         * 1. words – matches with more query words rank higher
         * 2. typo – fewer typos rank higher
         * 3. proximity – query words close together rank higher
         * 4. attribute – matches in searchableAttributes order rank higher
         * 5. sort – user-specified sort (view_count:desc by default)
         * 6. exactness – exact match ranks higher
         */
        rankingRules: [
            'words',
            'typo',
            'proximity',
            'attribute',
            'sort',
            'exactness',
        ],

        // Remove stop words for Vietnamese/English mixed content
        stopWords: ['và', 'của', 'là', 'có', 'the', 'a', 'an', 'in', 'of'],
    });

    strapi.log.info('[MeiliSync] Index settings configured.');

    // Fetch all stories
    let page = 1;
    const pageSize = 100;
    let totalSynced = 0;

    while (true) {
        const stories: any[] = await strapi.db.query('api::story.story').findMany({
            populate: { cover: { fields: ['url'] }, categories: { fields: ['name', 'slug'] } },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            orderBy: { id: 'asc' },
        });

        if (!stories || stories.length === 0) break;

        // Transform to Meilisearch document format
        const documents = stories.map((s) => ({
            id: s.id,
            title: s.title || '',
            slug: s.slug || '',
            author: typeof s.author === 'string' ? s.author : '',
            description_text: s.description_text || '',
            cover: s.cover?.url || null,
            view_count: Number(s.view_count) || 0,
            follow_count: Number(s.follow_count) || 0,
            rating: Number(s.rating) || 0,
            status: s.story_status || 'ongoing',
            updatedAt: s.updatedAt,
            createdAt: s.createdAt,
            // Flatten categories for filterableAttributes
            categories: (s.categories || []).map((c: any) => c.slug).filter(Boolean),
            categories_names: (s.categories || []).map((c: any) => c.name).filter(Boolean).join(' '),
        }));

        await index.addDocuments(documents, { primaryKey: 'id' });

        totalSynced += documents.length;
        strapi.log.info(`[MeiliSync] Synced ${totalSynced} stories...`);

        if (stories.length < pageSize) break;
        page++;
    }

    strapi.log.info(`[MeiliSync] ✅ Sync complete. Total: ${totalSynced} stories.`);
    return totalSynced;
}
