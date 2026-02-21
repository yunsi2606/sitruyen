
export default {
    routes: [
        // Full-text search via Meilisearch
        {
            method: 'GET',
            path: '/stories/search',
            handler: 'story.search',
            config: { auth: false },
        },
        // Autocomplete suggestions (fast, returns top 8)
        {
            method: 'GET',
            path: '/stories/autocomplete',
            handler: 'story.autocomplete',
            config: { auth: false },
        },
        // Hot/Trending searches from Redis
        {
            method: 'GET',
            path: '/stories/hot-searches',
            handler: 'story.hotSearches',
            config: { auth: false },
        },
        // Log a search keyword to Redis (called fire-and-forget from frontend)
        {
            method: 'POST',
            path: '/stories/search-log',
            handler: 'story.logSearch',
            config: { auth: false },
        },
    ],
};
