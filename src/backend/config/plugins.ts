export default () => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                baseUrl: process.env.CDN_URL,
                s3Options: {
                    credentials: {
                        accessKeyId: process.env.B2_KEY_ID,
                        secretAccessKey: process.env.B2_APP_KEY,
                    },
                    region: process.env.B2_REGION,
                    endpoint: process.env.B2_ENDPOINT,
                    params: {
                        Bucket: process.env.B2_BUCKET_NAME,
                    },
                },
            },
        },
    },
});
