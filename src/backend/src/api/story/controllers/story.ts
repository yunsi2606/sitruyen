/**
 * story controller
 */

import { factories } from '@strapi/strapi';


export default factories.createCoreController('api::story.story', ({ strapi }) => ({
    async getHomePage(ctx) {
        try {
            // Delegate to service for parallel data fetching
            const data = await strapi.service('api::story.story').getHomePageData();
            return data;
        } catch (err) {
            ctx.throw(500, err);
        }
    },
}));
