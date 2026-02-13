
export default {
    routes: [
        {
            method: 'GET',
            path: '/stories/homepage',
            handler: 'story.getHomePage',
            config: {
                auth: false,
            },
        },
    ],
};
