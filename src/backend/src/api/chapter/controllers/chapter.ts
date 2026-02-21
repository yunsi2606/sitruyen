/**
 * chapter controller
 */

import { factories } from '@strapi/strapi';
import type { Chapter } from '../../../types/strapi.d';

export default factories.createCoreController('api::chapter.chapter', ({ strapi }) => ({
    async find(ctx) {
        const { user } = ctx.state;
        // Call the default core action
        const { data, meta } = await super.find(ctx);

        // If no data, return early
        if (!data) return { data, meta };

        const isVip = await strapi.service('api::chapter.chapter').isUserVip(user);

        const sanitizedData = (data as Chapter[]).map((chapter) => {
            const attrs = (chapter as unknown as { attributes?: Chapter }).attributes ?? chapter;
            if (attrs.is_vip_only && !isVip) {
                // Strip content – handle both Strapi v4 (attributes wrapper) and v5 (flat)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const chapterRecord = chapter as any;
                if (chapterRecord.attributes) {
                    chapterRecord.attributes.content = null;
                    chapterRecord.attributes.images = { data: [] };
                } else {
                    chapterRecord.content = null;
                    chapterRecord.images = [];
                }
            }
            return chapter;
        });

        return { data: sanitizedData, meta };
    },

    async findOne(ctx) {
        const { user } = ctx.state;
        const { data, meta } = await super.findOne(ctx);

        if (!data) return { data, meta };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const record = data as any;
        const attrs: Chapter = record.attributes ?? record;
        if (attrs.is_vip_only) {
            const isVip = await strapi.service('api::chapter.chapter').isUserVip(user);
            if (!isVip) {
                if (record.attributes) {
                    record.attributes.content = null;
                    record.attributes.images = { data: [] };
                } else {
                    record.content = null;
                    record.images = [];
                }
            }
        }

        return { data, meta };
    },

    async read(ctx) {
        const { id } = ctx.params as { id: string };
        const { user } = ctx.state;
        const ip: string = ctx.request.ip;

        try {
            // Check access first (redundant but safe)
            const chapter = await strapi.db.query('api::chapter.chapter').findOne({
                where: { id },
            }) as Chapter | null;

            if (chapter && chapter.is_vip_only) {
                const isVip = await strapi.service('api::chapter.chapter').isUserVip(user);
                if (!isVip) {
                    return ctx.forbidden('This chapter is VIP-only. Upgrade your plan to read it now, or wait for the free release.');
                }
            }

            const result = await strapi.service('api::chapter.chapter').readChapter(id, user, ip);
            ctx.body = result;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            strapi.log.error(`Chapter Read Error [ID: ${id}]: ${message}`);

            if (message === 'Chapter not found') {
                return ctx.notFound('Chapter not found');
            }
            if (message === 'VIP_REQUIRED') {
                return ctx.forbidden('This chapter is VIP-only. Upgrade your plan to read it now, or wait for the free release.');
            }
            ctx.internalServerError('Failed to record view', { error: message });
        }
    },
}));
