/**
 * story service
 */

import { factories } from '@strapi/strapi';
import type { Story, Category } from '../../../types/strapi.d';

interface HomePageData {
    heroSlider: Story[];
    trending: Story[];
    latest: Story[];
    popular: Story[];
    genres: Category[];
}

export default factories.createCoreService('api::story.story', ({ strapi }) => ({
    async getHomePageData(): Promise<HomePageData> {
        // Execute all queries in parallel for better performance
        const [heroSlider, trending, latest, popular, genres] = await Promise.all([
            // Hero Slider
            strapi.entityService.findMany('api::story.story', {
                filters: { is_featured: true } as Record<string, unknown>,
                limit: 5,
                populate: ['cover', 'categories'],
                sort: { updatedAt: 'desc' },
            }),
            // Trending
            strapi.entityService.findMany('api::story.story', {
                filters: { is_trending: true } as Record<string, unknown>,
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
            heroSlider: heroSlider as unknown as Story[],
            trending: trending as unknown as Story[],
            latest: latest as unknown as Story[],
            popular: popular as unknown as Story[],
            genres: genres as unknown as Category[],
        };
    },
}));
