/**
 * rating controller
 * 
 * Custom actions:
 * - upsertRating: Create or update a user's rating for a story (auth required)
 * - findByStory: Get all ratings for a specific story (public)
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::rating.rating', ({ strapi }) => ({
    /**
     * POST /api/ratings/upsert
     * Body: { data: { score: 1-5, review?: string, story: documentId } }
     * Requires Bearer token (user auth)
     */
    async upsertRating(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('You must be logged in to rate a story.');
        }

        const { score, review, story: storyDocumentId } = ctx.request.body?.data || {};

        // Validate score
        if (!score || score < 1 || score > 5) {
            return ctx.badRequest('Score must be between 1 and 5.');
        }

        if (!storyDocumentId) {
            return ctx.badRequest('Story documentId is required.');
        }

        try {
            // Find the story by documentId
            const stories = await strapi.documents('api::story.story').findMany({
                filters: { documentId: storyDocumentId },
                limit: 1,
            });

            if (!stories || stories.length === 0) {
                return ctx.notFound('Story not found.');
            }

            const storyEntry = stories[0];

            // Check if user already rated this story
            const existingRatings = await strapi.documents('api::rating.rating').findMany({
                filters: {
                    user: { id: user.id },
                    story: { id: storyEntry.id },
                },
                limit: 1,
            });

            let result;

            if (existingRatings && existingRatings.length > 0) {
                // UPDATE existing rating
                const existing = existingRatings[0] as any;
                result = await strapi.documents('api::rating.rating').update({
                    documentId: existing.documentId,
                    data: {
                        score,
                        review: review || existing.review || null,
                    },
                    populate: ['user', 'story'],
                });
            } else {
                // CREATE new rating
                result = await strapi.documents('api::rating.rating').create({
                    data: {
                        score,
                        review: review || null,
                        user: user.id,
                        story: storyEntry.id,
                    },
                    populate: ['user', 'story'],
                });
            }

            return { data: result };
        } catch (error) {
            strapi.log.error('[Rating] Upsert error:', error);
            return ctx.internalServerError('Failed to save rating.');
        }
    },

    /**
     * GET /api/ratings/story/:documentId
     * Public endpoint - returns all ratings for a story with user info
     * Query params: page (default 1), pageSize (default 5)
     */
    async findByStory(ctx) {
        const { documentId } = ctx.params;
        const page = parseInt(ctx.query.page as string) || 1;
        const pageSize = parseInt(ctx.query.pageSize as string) || 5;

        if (!documentId) {
            return ctx.badRequest('Story documentId is required.');
        }

        try {
            const ratings = await strapi.documents('api::rating.rating').findMany({
                filters: {
                    story: { documentId: documentId },
                },
                populate: {
                    user: {
                        fields: ['username', 'avatar_frame', 'name_color', 'level'],
                    },
                },
                sort: { createdAt: 'desc' },
                start: (page - 1) * pageSize,
                limit: pageSize,
            });

            // Get total count
            const total = await strapi.db.query('api::rating.rating').count({
                where: {
                    story: {
                        documentId: documentId,
                    },
                },
            });

            return {
                data: ratings,
                meta: {
                    pagination: {
                        page,
                        pageSize,
                        total,
                        pageCount: Math.ceil(total / pageSize),
                    },
                },
            };
        } catch (error) {
            strapi.log.error('[Rating] findByStory error:', error);
            return ctx.internalServerError('Failed to fetch ratings.');
        }
    },
}));
