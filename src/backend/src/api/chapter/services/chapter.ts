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
}));
