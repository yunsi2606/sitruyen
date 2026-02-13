/**
 * chapter controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::chapter.chapter', ({ strapi }) => ({
    async read(ctx) {
        const { id } = ctx.params;
        const { user } = ctx.state;
        const ip = ctx.request.ip; // user IP address

        try {
            const result = await strapi.service('api::chapter.chapter').readChapter(id, user, ip);
            ctx.body = result;
        } catch (err: any) {
            strapi.log.error(`Chapter Read Error [ID: ${id}]: ${err.message}`);

            if (err.message === 'Chapter not found') {
                return ctx.notFound('Chapter not found');
            }
            ctx.internalServerError("Failed to record view", { error: err.message });
        }
    },
}));
