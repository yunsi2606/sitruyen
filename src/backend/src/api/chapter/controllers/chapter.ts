/**
 * chapter controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::chapter.chapter', ({ strapi }) => ({
    async find(ctx) {
        const { user } = ctx.state;
        // Call the default core action
        const { data, meta } = await super.find(ctx);

        // If no data, return early
        if (!data) return { data, meta };

        const isVip = await strapi.service('api::chapter.chapter').isUserVip(user);

        const sanitizedData = data.map((chapter: any) => {
            const attrs = chapter.attributes || chapter; // Handle v4/v5 structure
            if (attrs.is_vip_only && !isVip) {
                // Strip content
                if (chapter.attributes) {
                    chapter.attributes.content = null;
                    chapter.attributes.images = { data: [] };
                } else {
                    chapter.content = null;
                    chapter.images = [];
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

        const attrs = data.attributes || data;
        if (attrs.is_vip_only) {
            const isVip = await strapi.service('api::chapter.chapter').isUserVip(user);
            if (!isVip) {
                if (data.attributes) {
                    data.attributes.content = null;
                    data.attributes.images = { data: [] };
                } else {
                    data.content = null;
                    data.images = [];
                }
            }
        }

        return { data, meta };
    },

    async read(ctx) {
        const { id } = ctx.params;
        const { user } = ctx.state;
        const ip = ctx.request.ip;

        try {
            // Check access first (redundant but safe)
            const chapter: any = await strapi.entityService.findOne('api::chapter.chapter', id);

            if (chapter && chapter.is_vip_only) {
                const isVip = await strapi.service('api::chapter.chapter').isUserVip(user);
                if (!isVip) {
                    return ctx.forbidden('This chapter is VIP-only. Upgrade your plan to read it now, or wait for the free release.');
                }
            }

            const result = await strapi.service('api::chapter.chapter').readChapter(id, user, ip);
            ctx.body = result;
        } catch (err: any) {
            strapi.log.error(`Chapter Read Error [ID: ${id}]: ${err.message}`);

            if (err.message === 'Chapter not found') {
                return ctx.notFound('Chapter not found');
            }
            if (err.message === 'VIP_REQUIRED') {
                return ctx.forbidden('This chapter is VIP-only. Upgrade your plan to read it now, or wait for the free release.');
            }
            ctx.internalServerError("Failed to record view", { error: err.message });
        }
    },
}));
