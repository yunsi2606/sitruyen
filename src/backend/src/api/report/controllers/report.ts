/**
 * report controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::report.report', ({ strapi }) => ({
    async create(ctx) {
        // Ensure data object exists
        if (!ctx.request.body.data) {
            ctx.request.body.data = {};
        }

        // Check if user is logged in
        const user = ctx.state.user;

        if (user) {
            // If logged in, attach user to 'reporter'
            ctx.request.body.data.reporter = user.id;
        }

        // Call default create logic
        const response = await super.create(ctx);
        return response;
    }
}));
