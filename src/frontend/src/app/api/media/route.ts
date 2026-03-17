import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.MINIO_REGION || "us-east-1",
    endpoint: process.env.MINIO_ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.MINIO_KEY_ID || "",
        secretAccessKey: process.env.MINIO_APP_KEY || "",
    },
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const originalUrl = searchParams.get("url");

    if (!originalUrl) {
        return new NextResponse("Missing file url", { status: 400 });
    }

    try {
        const minioUrl = process.env.MINIO_URL;
        const endpoint = process.env.MINIO_ENDPOINT;
        
        let isS3 = false;
        if (minioUrl && originalUrl.startsWith(minioUrl)) {
            isS3 = true;
        } else if (endpoint && originalUrl.startsWith(endpoint)) {
            isS3 = true;
        }

        // If it's a regular external URL (e.g., Google Avatar), just redirect normally
        if (!isS3) {
            return NextResponse.redirect(originalUrl);
        }

        // Parse the url to extract the S3 Key
        const parsedUrl = new URL(originalUrl);
        let key = parsedUrl.pathname;
        
        // Remove leading slash
        if (key.startsWith("/")) {
            key = key.substring(1);
        }

        // If forcePathStyle is true (like MinIO) or the URL includes the bucket in path
        const bucketName = process.env.MINIO_BUCKET_NAME || "";
        if (bucketName && key.startsWith(bucketName + "/")) {
            key = key.substring(bucketName.length + 1);
        }

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: decodeURIComponent(key), 
        });

        // Generate a URL valid for 1 hour
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        
        return NextResponse.redirect(signedUrl);
    } catch (error) {
        console.error("Error generating presigned URL for:", originalUrl, error);
        // Fallback to original URL in case of error
        return NextResponse.redirect(originalUrl); 
    }
}
