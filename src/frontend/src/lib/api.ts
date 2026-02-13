const INTERNAL_API_URL = process.env.STRAPI_INTERNAL_URL || "http://strapi:1337";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Dynamic helper to choose the right URL
export function getStrapiURL() {
    // Server-side (Runtime)
    if (typeof window === 'undefined') {
        return INTERNAL_API_URL;
    }
    // Client-side (Bundled)
    return PUBLIC_API_URL;
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
        return url;
    }
    return `${PUBLIC_API_URL}${url}`;
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
