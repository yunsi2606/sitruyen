const INTERNAL_API_URL = process.env.STRAPI_INTERNAL_URL || "http://strapi:1337";

/**
 * Đọc runtime env var từ window.__ENV__ (được inject bởi RuntimeConfig server component).
 * window.__ENV__ luôn chứa giá trị RUNTIME, không bị bake-in lúc build.
 *
 * → Khi đổi domain: chỉ cần sửa env var trong docker-compose → restart container.
 *   KHÔNG cần rebuild Docker image.
 */
function getRuntimeEnv(key: string): string | undefined {
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
        return (window as any).__ENV__[key] || undefined;
    }
    return undefined;
}

// Cache lại để không phải đọc mỗi lần gọi
let _cachedPublicApiUrl: string | null = null;
function getPublicApiUrl(): string {
    if (_cachedPublicApiUrl) return _cachedPublicApiUrl;

    // 1. Đọc từ runtime config (window.__ENV__) — ưu tiên cao nhất
    const runtimeUrl = getRuntimeEnv("STRAPI_URL");
    if (runtimeUrl && runtimeUrl.trim() !== "") {
        _cachedPublicApiUrl = runtimeUrl;
        return _cachedPublicApiUrl;
    }

    // 2. Fallback: process.env baked-in lúc build (nếu có giá trị hợp lệ)
    const buildTimeUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    if (buildTimeUrl && !buildTimeUrl.includes("localhost") && !buildTimeUrl.includes("127.0.0.1")) {
        _cachedPublicApiUrl = buildTimeUrl;
        return _cachedPublicApiUrl;
    }

    // 3. Dev fallback
    _cachedPublicApiUrl = "http://localhost:1337";
    return _cachedPublicApiUrl;
}

// Dynamic helper to choose the right URL
export function getStrapiURL() {
    // Server-side (Runtime) => dùng internal URL trong Docker network
    if (typeof window === 'undefined') {
        return INTERNAL_API_URL;
    }

    // Client-side => đọc runtime config từ window.__ENV__
    return getPublicApiUrl();
}

// Media helper MUST always use PUBLIC_API_URL because images are loaded by the browser
export const getStrapiMedia = (url: string | null) => {
    if (url == null) {
        return null;
    }
    if (url.startsWith("data:")) {
        return url;
    }
    if (url.startsWith("http") || url.startsWith("//")) {
        return `/api/media?url=${encodeURIComponent(url)}`;
    }

    const publicUrl = typeof window !== 'undefined' ? getPublicApiUrl() : INTERNAL_API_URL;
    return `${publicUrl}${url}`;
};

// Fetch API helper
export async function fetchAPI(
    path: string,
    urlParamsObject = {},
    options = {}
) {
    try {
        // Merge options
        const mergedOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store' as RequestCache,
            ...options,
        };

        // Build Query String
        const queryString = Object.keys(urlParamsObject)
            .map(key => `${key}=${urlParamsObject[key as keyof typeof urlParamsObject]}`)
            .join('&');

        // Determine correct API URL (Internal vs Public)
        const baseUrl = getStrapiURL();
        const requestUrl = `${baseUrl}/api${path}${queryString ? `?${queryString}` : ""}`;

        // Fetch data
        const response = await fetch(requestUrl, mergedOptions);

        if (!response.ok) {
            console.error(`FetchAPI Error: ${response.status} ${response.statusText} at ${requestUrl}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Fetch API Error:", error);
        // Fallback or re-throw depending on strategy, but usually good to know
        throw new Error(`Failed to fetch from Strapi. Check if server is running.`);
    }
}
