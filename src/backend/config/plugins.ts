export default () => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                baseUrl: process.env.MINIO_URL,
                s3Options: {
                    credentials: {
                        accessKeyId: process.env.MINIO_KEY_ID,
                        secretAccessKey: process.env.MINIO_APP_KEY,
                    },
                    region: process.env.MINIO_REGION,
                    endpoint: process.env.MINIO_ENDPOINT,
                    forcePathStyle: true,
                    params: {
                        Bucket: process.env.MINIO_BUCKET_NAME,
                    },
                },
            },
        },
    },
});
