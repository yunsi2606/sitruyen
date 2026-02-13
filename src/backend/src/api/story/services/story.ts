
/**
 * story service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::story.story', ({ strapi }) => ({
    async getHomePageData() {
        // Execute all queries in parallel for better performance
        const [heroSlider, trending, latest, popular, genres] = await Promise.all([
            // Hero Slider
            strapi.entityService.findMany('api::story.story', {
                filters: { is_featured: true } as any, // Cast due to dynamic schema update
                limit: 5,
                populate: ['cover', 'categories'],
                sort: { updatedAt: 'desc' },
            }),
            // Trending
            strapi.entityService.findMany('api::story.story', {
                filters: { is_trending: true } as any, // Cast due to dynamic schema update
                limit: 6,
                populate: ['cover'],
                sort: { view_count: 'desc' },
            }),
            // Latest Updates
            strapi.entityService.findMany('api::story.story', {
                limit: 10,
                populate: ['cover', 'categories', 'chapters'],
                sort: { updatedAt: 'desc' },
            }),
            // Popular
            strapi.entityService.findMany('api::story.story', {
                limit: 6,
                populate: ['cover'],
                sort: { view_count: 'desc' },
            }),
            // Genres
            strapi.entityService.findMany('api::category.category', {
                limit: 12,
                sort: { name: 'asc' },
            }),
        ]);

        return {
            heroSlider,
            trending,
            latest,
            popular,
            genres,
        };
    },
}));
