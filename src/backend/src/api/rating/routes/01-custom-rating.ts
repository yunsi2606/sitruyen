export default {
    routes: [
        {
            method: 'POST',
            path: '/ratings/upsert',
            handler: 'rating.upsertRating',
            config: {
                policies: [],
            },
        },
        {
            method: 'GET',
            path: '/ratings/story/:documentId',
            handler: 'rating.findByStory',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};
