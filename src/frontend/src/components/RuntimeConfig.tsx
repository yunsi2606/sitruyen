/**
 * RuntimeConfig — Server Component
 * 
 * Inject runtime environment variables into the client via a <script> tag.
 * This solves the Next.js problem where NEXT_PUBLIC_* vars are baked in at build time.
 * 
 * IMPORTANT: We use STRAPI_PUBLIC_URL (without NEXT_PUBLIC_ prefix) because
 * Next.js compiler inlines ALL process.env.NEXT_PUBLIC_* at build time,
 * even in Server Components! Only non-NEXT_PUBLIC_ vars are read at true runtime.
 * 
 * To change API URL: set STRAPI_PUBLIC_URL env var and restart — no rebuild needed.
 */
export function RuntimeConfig() {
    // STRAPI_PUBLIC_URL (không có NEXT_PUBLIC_ prefix) => đọc tại RUNTIME, không bị bake-in
    const config = {
        STRAPI_URL: process.env.STRAPI_PUBLIC_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "",
    };

    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `window.__ENV__ = ${JSON.stringify(config)};`,
            }}
        />
    );
}
