/**
 * chapter service
 */

import { factories } from '@strapi/strapi';

// Simple in-memory cache to prevent spam
// Key: "ip-IP-chapterId" or "user-UserId-chapterId"
// Value: Timestamp of last view
const viewCache = new Map<string, number>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export default factories.createCoreService('api::chapter.chapter', ({ strapi }) => ({
    async readChapter(chapterId: string | number, user: any, ip: string) {
        // Fetch chapter with story relation
        const chapter: any = await strapi.entityService.findOne('api::chapter.chapter', chapterId, {
            populate: ['story'],
        });

        if (!chapter) {
            throw new Error('Chapter not found');
        }

        const userId = user ? user.id : null;
        const spamKey = userId ? `user-${userId}-${chapterId}` : `ip-${ip}-${chapterId}`;
        const now = Date.now();
        const lastViewTime = viewCache.get(spamKey);

        let viewIncremented = false;

        // Check Spam
        if (!lastViewTime || (now - lastViewTime) > CACHE_DURATION) {
            viewCache.set(spamKey, now);

            // Increment Chapter View (use documentId if available, else id)
            const chapDocId = chapter.documentId || chapter.id;
            const currentChapterViews = chapter.view_count ? Number(chapter.view_count) : 0;

            await strapi.entityService.update('api::chapter.chapter', chapDocId, {
                data: {
                    view_count: (currentChapterViews + 1).toString(),
                },
            });

            // Increment Story View
            if (chapter.story) {
                const storyDocId = chapter.story.documentId || chapter.story.id;
                const currentStoryViews = chapter.story.view_count ? Number(chapter.story.view_count) : 0;

                await strapi.entityService.update('api::story.story', storyDocId, {
                    data: {
                        view_count: (currentStoryViews + 1).toString(),
                    },
                });
            }

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
}));
