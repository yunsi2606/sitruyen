/**
 * user-level controller
 * 
 * API Endpoints:
 *   GET  /api/user-levels/me → Get authenticated user's level info
 *   GET  /api/user-levels/leaderboard → Get top users by EXP
 *   GET  /api/user-levels/config → Get level config table (public)
 *   POST /api/user-levels/daily → Claim daily login EXP bonus
 *   GET  /api/user-levels/cosmetics → Get unlocked cosmetics
 *   PUT  /api/user-levels/cosmetics → Change equipped frame/color
 */

export default {
    /**
     * GET /api/user-levels/me
     * Returns the authenticated user's full level info + progress.
     * Requires: Authenticated user
     */
    async getMyLevel(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You must be logged in to view your level.");
        }

        const levelService = strapi.service("api::user-level.user-level") as any;
        const levelInfo = await levelService.getUserLevelInfo(user.id);

        if (!levelInfo) {
            return ctx.notFound("User not found.");
        }

        return ctx.send({ data: levelInfo });
    },

    /**
     * GET /api/user-levels/leaderboard
     * Returns top users sorted by EXP (public endpoint).
     * Query params: ?limit=10 (default 10, max 50)
     */
    async getLeaderboard(ctx) {
        const limit = Math.min(
            Math.max(parseInt(ctx.query.limit as string) || 10, 1),
            50
        );

        const levelService = strapi.service("api::user-level.user-level") as any;
        const leaderboard = await levelService.getLeaderboard(limit);

        return ctx.send({ data: leaderboard });
    },

    /**
     * GET /api/user-levels/config
     * Returns the level configuration table (public).
     * Frontend uses this to display level badges, progress bars, etc.
     */
    async getLevelConfig(ctx) {
        const levelService = strapi.service("api::user-level.user-level") as any;
        const config = levelService.getLevelConfig();
        const expRewards = levelService.getExpRewards();

        return ctx.send({
            data: {
                levels: config,
                expRewards,
            }
        });
    },

    /**
     * POST /api/user-levels/daily
     * Claim daily login EXP bonus (+20 EXP, once per calendar day).
     * Requires: Authenticated user
     */
    async claimDailyLogin(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You must be logged in to claim daily bonus.");
        }

        const levelService = strapi.service("api::user-level.user-level") as any;
        const result = await levelService.claimDailyLogin(user.id);

        if (!result) {
            return ctx.notFound("User not found.");
        }

        if (result.alreadyClaimed) {
            return ctx.send({ data: { alreadyClaimed: true, message: "You already claimed today's bonus!" } });
        }

        return ctx.send({ data: result });
    },

    /**
     * GET /api/user-levels/cosmetics
     * Returns all unlocked frames, badges, and colors for the authenticated user,
     * plus which ones are currently equipped.
     * Requires: Authenticated user
     */
    async getMyCosmetics(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You must be logged in to view your cosmetics.");
        }

        const levelService = strapi.service("api::user-level.user-level") as any;
        const cosmetics = await levelService.getUnlockedCosmetics(user.id);

        if (!cosmetics) {
            return ctx.notFound("User not found.");
        }

        return ctx.send({ data: cosmetics });
    },

    /**
     * PUT /api/user-levels/cosmetics
     * Change the user's equipped frame and/or name color.
     * Only allows selecting cosmetics from levels already unlocked.
     * 
     * Body: { frame?: string, nameColor?: string }
     * Example: { "frame": "gold", "nameColor": "#a855f7" }
     * 
     * Requires: Authenticated user
     */
    async updateMyCosmetics(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("You must be logged in to change your cosmetics.");
        }

        const { frame, nameColor } = ctx.request.body || {};

        if (frame === undefined && nameColor === undefined) {
            return ctx.badRequest("Please provide at least one of: frame, nameColor");
        }

        const levelService = strapi.service("api::user-level.user-level") as any;
        const result = await levelService.setCosmetics(user.id, { frame, nameColor });

        if (!result.success) {
            return ctx.badRequest(result.error);
        }

        return ctx.send({ data: result });
    },
};
