/**
 * chapter service
 */

import { factories } from '@strapi/strapi';

// Simple in-memory cache to prevent spam
// Key: "ip-IP-chapterId" or "user-UserId-chapterId"
// Value: Timestamp of last view
const viewCache = new Map<string, number>();
const CACHE_DURATION = 10 * 1000; // 10 seconds for testing, increase later

export default factories.createCoreService('api::chapter.chapter', ({ strapi }) => ({
    async readChapter(chapterId: string | number, user: any, ip: string) {
        // Fetch chapter with story relation
        const chapter: any = await strapi.entityService.findOne('api::chapter.chapter', chapterId, {
            populate: ['story'],
        });

        if (!chapter) {
            throw new Error('Chapter not found');
        }

        // VIP Guard: block free users from VIP-only chapters
        if (chapter.is_vip_only) {
            const isVip = await this.isUserVip(user);
            if (!isVip) {
                throw new Error('VIP_REQUIRED');
            }
        }

        const userId = user ? user.id : null;
        const spamKey = userId ? `user-${userId}-${chapterId}` : `ip-${ip}-${chapterId}`;
        const now = Date.now();
        const lastViewTime = viewCache.get(spamKey);

        let viewIncremented = false;

        // Check Spam
        if (!lastViewTime || (now - lastViewTime) > CACHE_DURATION) {
            viewCache.set(spamKey, now);

            const currentChapterViews = chapter.view_count ? Number(chapter.view_count) : 0;
            const newChapterViews = currentChapterViews + 1;

            // Try to update using documentId if available (Strapi 5), else ID
            const whereClause = chapter.documentId ? { documentId: chapter.documentId } : { id: chapter.id };

            await strapi.db.query('api::chapter.chapter').update({
                where: whereClause,
                data: {
                    view_count: newChapterViews,
                },
            });

            // Increment Story View
            if (chapter.story) {
                const currentStoryViews = chapter.story.view_count ? Number(chapter.story.view_count) : 0;
                const newStoryViews = currentStoryViews + 1;
                const storyWhere = chapter.story.documentId ? { documentId: chapter.story.documentId } : { id: chapter.story.id };

                await strapi.db.query('api::story.story').update({
                    where: storyWhere,
                    data: {
                        view_count: newStoryViews,
                    },
                });
            }

            strapi.log.info(`Incremented view for Chapter ${chapterId} -> ${newChapterViews} | Story: ${chapter.story?.id}`);
            viewIncremented = true;
        }

        // User Reading History
        if (userId && chapter.story) {
            // Use internal ID for DB query efficiency/correctness
            const storyInternalId = chapter.story.id;

            const historyItem = await strapi.db.query('api::reading-history.reading-history').findOne({
                where: {
                    user: userId,
                    story: storyInternalId,
                },
            });

            const chapDocId = chapter.documentId || chapter.id;
            const storyDocId = chapter.story.documentId || chapter.story.id;

            if (historyItem) {
                await strapi.entityService.update('api::reading-history.reading-history', historyItem.documentId || historyItem.id, {
                    data: {
                        chapter: chapDocId,
                        history_updated_at: new Date(),
                    },
                });
            } else {
                await strapi.entityService.create('api::reading-history.reading-history', {
                    data: {
                        user: userId,
                        story: storyDocId,
                        chapter: chapDocId,
                        history_updated_at: new Date(),
                    },
                });
            }
        }

        return {
            success: true,
            viewIncremented,
            chapterId,
        };
    },

    /**
     * Check if user has an active VIP plan.
     * Returns true if user is VIP and subscription has not expired.
     */
    async isUserVip(user: any): Promise<boolean> {
        if (!user || !user.id) return false;

        const fullUser: any = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { id: user.id },
        });

        if (!fullUser || fullUser.plan !== 'vip') return false;

        // Check expiration
        if (fullUser.vip_expired_at) {
            return new Date(fullUser.vip_expired_at) > new Date();
        }

        // VIP but no expiration set means lifetime VIP
        return true;
    },

    /**
     * Cron task: unlock chapters that have been VIP-only for 7+ days.
     * Called by the Strapi cron scheduler every hour.
     */
    async unlockExpiredVipChapters() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const vipChapters = await strapi.db.query('api::chapter.chapter').findMany({
            where: {
                is_vip_only: true,
                chap_published_at: { $lte: sevenDaysAgo.toISOString().split('T')[0] },
            },
        });

        if (vipChapters.length === 0) {
            strapi.log.info('[VIP Cron] No chapters to unlock.');
            return;
        }

        for (const chapter of vipChapters) {
            const whereClause = chapter.documentId
                ? { documentId: chapter.documentId }
                : { id: chapter.id };

            await strapi.db.query('api::chapter.chapter').update({
                where: whereClause,
                data: { is_vip_only: false },
            });
        }

        strapi.log.info(`[VIP Cron] Unlocked ${vipChapters.length} chapter(s) after 7-day VIP window.`);
    },
}));
