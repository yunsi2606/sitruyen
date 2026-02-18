/**
 * user-level routes
 * 
 * Custom routes for the Level / EXP system.
 * Note: These are NOT core Strapi CRUD routes.
 * Permissions must be configured in Strapi Admin Panel.
 */

export default {
    routes: [
        {
            method: "GET",
            path: "/user-levels/me",
            handler: "user-level.getMyLevel",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/user-levels/leaderboard",
            handler: "user-level.getLeaderboard",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/user-levels/config",
            handler: "user-level.getLevelConfig",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "POST",
            path: "/user-levels/daily",
            handler: "user-level.claimDailyLogin",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/user-levels/cosmetics",
            handler: "user-level.getMyCosmetics",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "PUT",
            path: "/user-levels/cosmetics",
            handler: "user-level.updateMyCosmetics",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
