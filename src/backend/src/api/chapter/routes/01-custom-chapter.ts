export default {
    routes: [
        {
            method: "POST",
            path: "/chapters/:id/read",
            handler: "chapter.read",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
