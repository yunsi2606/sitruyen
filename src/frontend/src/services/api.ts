
import { fetchAPI } from "@/lib/api";

type StrapiResponse<T> = {
    data: T | null;
    error?: any;
};

// Comment Types
export interface Comment {
    id: number;
    documentId?: string;
    content?: string;
    createdAt?: string;
    updatedAt?: string;
    // Relations (flattened or nested depending on strapi version)
    user?: any;
    chapter?: any;
    parent?: any;
    children?: any;
    story?: any;
    // v4 fallback
    attributes?: any;
}

export interface CreateCommentPayload {
    data: {
        content: string;
        story?: { connect: [{ documentId: string }] };
        chapter?: { connect: [{ documentId: string }] };
        parent?: { connect: [{ documentId: string }] };
        user?: { connect: [{ id: number }] };
        // Fallback for direct ID assignment if needed
        [key: string]: any;
    }
}

export const commentService = {
    // Get list of comments
    async getComments(storyId?: number, chapterId?: number, limit = 100): Promise<Comment[]> {
        let query = `/comments?sort=createdAt:desc&populate[0]=user&populate[1]=chapter&populate[2]=parent`;

        if (chapterId) {
            query += `&filters[chapter][id][$eq]=${chapterId}`;
        } else if (storyId) {
            query += `&filters[story][id][$eq]=${storyId}`;
        }

        query += `&pagination[limit]=${limit}`;

        try {
            const res = await fetchAPI(query);
            return res.data || [];
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    },

    // Create a new comment
    async createComment(payload: CreateCommentPayload, token: string): Promise<StrapiResponse<Comment>> {
        return await fetchAPI('/comments', {}, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });
    }
};

export const storyService = {
    // Get basic story info (specifically documentId for relations)
    async getStoryDocumentId(storyId: number): Promise<string | null> {
        try {
            const res = await fetchAPI(`/stories?filters[id][$eq]=${storyId}&fields[0]=documentId`);
            if (res.data && res.data[0]) {
                return res.data[0].documentId;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching story ${storyId}:`, error);
            return null;
        }
    },

    // Get stories for homepage (featured/latest)
    async getHomepageStories(): Promise<any> {
        const res = await fetchAPI("/stories/homepage");
        return res;
    },

    // Get full story details by slug
    async getBySlug(slug: string): Promise<any> {
        const query = `?filters[slug][$eq]=${slug}&populate=*`;
        const res = await fetchAPI(`/stories${query}`);
        return res.data?.[0] || null;
    },

    // Search/Filter stories
    async search(queryParams: string): Promise<any> {
        const res = await fetchAPI(queryParams);
        return res;
    }
};

export const chapterService = {
    // Get basic chapter info (specifically documentId for relations)
    async getChapterDocumentId(chapterId: number): Promise<string | null> {
        try {
            const res = await fetchAPI(`/chapters?filters[id][$eq]=${chapterId}&fields[0]=documentId`);
            if (res.data && res.data[0]) {
                return res.data[0].documentId;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching chapter ${chapterId}:`, error);
            return null;
        }
    },

    // Get chapter by slug
    async getBySlug(slug: string): Promise<any> {
        const query = `?filters[slug][$eq]=${slug}&populate=*`; // Adjust populate as needed
        const res = await fetchAPI(`/chapters${query}`);
        return res.data?.[0] || null;
    },

    // Mark chapter as read
    async markAsRead(chapterId: number): Promise<void> {
        try {
            await fetchAPI(`/chapters/${chapterId}/read`, {}, { method: 'POST' });
        } catch (error) {
            console.error(`Error marking chapter ${chapterId} as read:`, error);
        }
    },

    // Get chapter with details (images, story, siblings)
    async getChapterWithDetails(storySlug: string, chapterSlug: string): Promise<any> {
        const query = `?filters[slug][$eq]=${chapterSlug}&filters[story][slug][$eq]=${storySlug}&populate[images][fields][0]=url&populate[story][fields][0]=title&populate[story][fields][1]=slug&populate[story][populate][chapters][fields][0]=title&populate[story][populate][chapters][fields][1]=slug&populate[story][populate][chapters][fields][2]=chapter_number&populate[story][populate][chapters][sort][0]=chapter_number:desc`;
        const res = await fetchAPI(`/chapters${query}`);
        return res.data?.[0] || null;
    }
};

export const categoryService = {
    // Get all categories
    async getAll(limit = 100): Promise<any[]> {
        try {
            const query = `/categories?sort=name:asc&pagination[limit]=${limit}`;
            const res = await fetchAPI(query);
            return res.data || [];
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    }
};
