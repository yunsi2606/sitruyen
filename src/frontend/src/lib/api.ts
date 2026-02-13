
export const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

// Get full image URL
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
    return `${API_URL}${url}`;
};

// Fetch API
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

        // Build URL
        const queryString = Object.keys(urlParamsObject)
            .map(key => `${key}=${urlParamsObject[key as keyof typeof urlParamsObject]}`)
            .join('&');

        const requestUrl = `${API_URL}/api${path}${queryString ? `?${queryString}` : ""}`;

        // Fetch data
        const response = await fetch(requestUrl, mergedOptions);
        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Fetch API Error:", error);
        throw new Error(`Please check if your server is running and you set all the environment variables.`);
    }
}
