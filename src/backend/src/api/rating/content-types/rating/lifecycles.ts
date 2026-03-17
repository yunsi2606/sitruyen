/**
 * rating lifecycle hooks
 *
 * 1. Grants EXP to the user when they first rate a manga (+3 EXP).
 * 2. Recalculates the story's average `rating` field after create/update/delete.
 *
 * Note: Rating uses an upsert pattern on frontend (one rating per user per story),
 * so afterCreate only fires for the FIRST rating per story — no EXP farming possible.
 * Subsequent score changes trigger UPDATE, not CREATE.
 */

import type { GrantExpResult } from '../../../../types/strapi.d';

interface RatingResult {
    user?: { id: number } | number;
    story?: { id: number } | number;
}

interface LevelService {
    grantExp(userId: number, amount: number, reason: string): Promise<GrantExpResult | null>;
}

/**
 * Recalculate the average rating for a story and update it.
 * Uses raw DB query for performance.
 */
async function recalculateStoryRating(storyId: number) {
    try {
        // Get all ratings for this story
        const ratings = await strapi.db.query('api::rating.rating').findMany({
            where: { story: { id: storyId } },
            select: ['score'],
        });

        if (!ratings || ratings.length === 0) {
            // No ratings left, reset to 0
            await strapi.db.query('api::story.story').update({
                where: { id: storyId },
                data: { rating: 0 },
            });
            return;
        }

        const totalScore = ratings.reduce((sum: number, r: { score: number }) => sum + r.score, 0);
        const avgRating = Math.round((totalScore / ratings.length) * 10) / 10; // 1 decimal

        await strapi.db.query('api::story.story').update({
            where: { id: storyId },
            data: { rating: avgRating },
        });

        strapi.log.debug(`[Rating] Recalculated story #${storyId}: avg=${avgRating} (${ratings.length} ratings)`);
    } catch (error) {
        strapi.log.error(`[Rating] Failed to recalculate story #${storyId}:`, error);
    }
}

/** Extract story ID from a rating event result or params */
function extractStoryId(result: RatingResult, params?: any): number | null {
    // From result (afterCreate, afterUpdate)
    if (result?.story) {
        return typeof result.story === 'object' ? result.story.id : result.story;
    }
    // From params (afterDelete — result may not have populated relations)
    if (params?.where?.id) {
        return null; // Will be handled via beforeDelete
    }
    return null;
}

export default {
    /**
     * Before delete: stash the story ID so afterDelete can recalculate.
     */
    async beforeDelete(event: any) {
        const { where } = event.params;
        if (where?.id) {
            const rating = await strapi.db.query('api::rating.rating').findOne({
                where: { id: where.id },
                populate: ['story'],
            });
            if (rating?.story?.id) {
                // Attach to event state so afterDelete can access it
                (event as any)._storyId = rating.story.id;
            }
        }
    },

    /**
     * After create: grant EXP + recalculate average.
     */
    async afterCreate(event: { result: RatingResult }) {
        const { result } = event;

        try {
            let userId: number | null = null;
            if (result.user) {
                userId = typeof result.user === 'object' ? result.user.id : result.user;
            }

            if (userId) {
                const levelService = strapi.service('api::user-level.user-level') as LevelService;
                const grantResult = await levelService.grantExp(userId, 3, 'rating_given');

                if (grantResult?.leveledUp) {
                    strapi.log.info(
                        `[Level] 🎉 User #${userId} leveled up to ${grantResult.newLevel} after rating!`,
                    );
                }
            }
        } catch (error: unknown) {
            strapi.log.error('[Level] Error granting EXP in rating lifecycle:', error);
        }

        // Recalculate average
        const storyId = extractStoryId(result);
        if (storyId) {
            await recalculateStoryRating(storyId);
        }
    },

    /**
     * After update: recalculate average (score may have changed).
     */
    async afterUpdate(event: { result: RatingResult }) {
        const storyId = extractStoryId(event.result);
        if (storyId) {
            await recalculateStoryRating(storyId);
        }
    },

    /**
     * After delete: recalculate average (uses storyId stashed in beforeDelete).
     */
    async afterDelete(event: any) {
        const storyId = (event as any)._storyId;
        if (storyId) {
            await recalculateStoryRating(storyId);
        }
    },
};
