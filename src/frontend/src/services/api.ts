
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
    sticker?: any;
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
    async getComments(storyId?: number, chapterId?: number, limit = 100, token?: string | null): Promise<Comment[]> {
        let query = `/comments?sort=createdAt:desc&populate[user][fields][0]=username&populate[user][fields][1]=avatar_frame&populate[user][fields][2]=name_color&populate[user][fields][3]=level&populate[chapter][fields][0]=chapter_number&populate[chapter][fields][1]=slug&populate[chapter][fields][2]=title&populate[parent][populate][user][fields][0]=username&populate[sticker][populate][file][fields][0]=url&populate[sticker][populate][file][fields][1]=mime&populate[sticker][populate][file][fields][2]=width&populate[sticker][populate][file][fields][3]=height&populate[sticker][fields][0]=name&populate[sticker][fields][1]=duration&populate[sticker][fields][2]=id&populate[sticker][fields][3]=documentId&populate[story][fields][0]=slug`;

        if (chapterId) {
            query += `&filters[chapter][id][$eq]=${chapterId}`;
        } else if (storyId) {
            query += `&filters[story][id][$eq]=${storyId}`;
        }

        query += `&pagination[limit]=${limit}`;

        try {
            const options: any = {};
            if (token) {
                options.headers = { Authorization: `Bearer ${token}` };
            }
            const res = await fetchAPI(query, {}, options);
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
    async markAsRead(chapterId: number, token?: string | null): Promise<void> {
        try {
            const options: any = { method: 'POST' };
            if (token) {
                options.headers = { Authorization: `Bearer ${token}` };
            }
            await fetchAPI(`/chapters/${chapterId}/read`, {}, options);
        } catch (error) {
            console.error(`Error marking chapter ${chapterId} as read:`, error);
        }
    },

    // Get chapter with details (images, story, siblings)
    async getChapterWithDetails(storySlug: string, chapterSlug: string, token?: string | null): Promise<any> {
        const query = `?filters[slug][$eq]=${chapterSlug}&filters[story][slug][$eq]=${storySlug}&populate[images][fields][0]=url&populate[story][fields][0]=title&populate[story][fields][1]=slug&populate[story][populate][chapters][fields][0]=title&populate[story][populate][chapters][fields][1]=slug&populate[story][populate][chapters][fields][2]=chapter_number&populate[story][populate][chapters][sort][0]=chapter_number:desc`;

        const options: any = {};
        if (token) {
            options.headers = { Authorization: `Bearer ${token}` };
        }

        const res = await fetchAPI(`/chapters${query}`, {}, options);

        if (res.error) {
            throw new Error(res.error.message || "Failed to fetch chapter");
        }

        return res.data?.[0] || null;
    }
};

// Reading History Service
export const historyService = {
    // Get user's reading history
    async getHistory(userId: number, token: string, page = 1, limit = 20): Promise<any[]> {
        try {
            const query = `/reading-histories?filters[user][id][$eq]=${userId}&populate[story][populate][cover][fields][0]=url&populate[chapter][fields][0]=chapter_number&populate[chapter][fields][1]=slug&populate[chapter][fields][2]=title&sort=history_updated_at:desc&pagination[page]=${page}&pagination[pageSize]=${limit}`;

            const res = await fetchAPI(query, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.data || !Array.isArray(res.data)) return [];

            // Normalize Data
            return res.data.map((item: any) => {
                const isV4 = !!item.attributes;
                const data = isV4 ? item.attributes : item;

                // Helper to extract relation
                const getRelation = (rel: any) => {
                    if (!rel) return null;
                    if (rel.data && rel.data.attributes) { // v4 relation
                        return { id: rel.data.id, ...rel.data.attributes };
                    }
                    if (rel.data) return rel.data; // v5 relation wrapper
                    return rel; // flat
                };

                return {
                    id: item.id,
                    ...data,
                    story: getRelation(data.story),
                    chapter: getRelation(data.chapter),
                    history_updated_at: data.history_updated_at || data.updatedAt
                };
            });
        } catch (error) {
            console.error("Error fetching history:", error);
            return [];
        }
    },

    // Save reading progress (Upsert: Create if new, Update if exists)
    async saveHistory(userId: number, storyId: number, chapterId: number, token: string): Promise<void> {
        try {
            // Check if record exists for this User + Story
            const checkQuery = `/reading-histories?filters[user][id][$eq]=${userId}&filters[story][id][$eq]=${storyId}`;
            const existing = await fetchAPI(checkQuery, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const now = new Date().toISOString();

            if (existing.data && existing.data.length > 0) {
                // UPDATE existing record
                const record = existing.data[0];
                const recordId = record.documentId || record.id; // Support v5/v4

                const payload = {
                    data: {
                        chapter: chapterId,
                        history_updated_at: now
                    }
                };

                await fetchAPI(`/reading-histories/${recordId}`, {}, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                // CREATE new record
                const payload = {
                    data: {
                        user: userId,
                        story: storyId,
                        chapter: chapterId,
                        history_updated_at: now
                    }
                };

                await fetchAPI(`/reading-histories`, {}, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            }
        } catch (error) {
            console.error("Error saving reading history:", error);
        }
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

// Sticker Service (Animation/Lottie)
export const stickerService = {
    // Get all sticker packs with full details
    async getStickerPacks(token?: string | null): Promise<any[]> {
        try {
            // Populate: internal stickers, their media files, and pack icon
            const query = `/sticker-packs?populate[stickers][populate][file][fields][0]=url&populate[stickers][populate][file][fields][1]=width&populate[stickers][populate][file][fields][2]=height&populate[stickers][populate][file][fields][3]=mime&populate[stickers][fields][0]=name&populate[stickers][fields][1]=duration&populate[stickers][fields][2]=documentId&populate[stickers][fields][3]=id&populate[icon][fields][0]=url`;

            const options: any = {};
            if (token) {
                options.headers = { Authorization: `Bearer ${token}` };
            }

            const res = await fetchAPI(query, {}, options);
            return res.data || [];
        } catch (error) {
            console.error("Error fetching stickers:", error);
            return [];
        }
    }
};

// VIP Order Service
export const vipOrderService = {
    /**
     * Create a new VIP order. Requires auth token.
     * Returns order details + bank transfer QR info.
     */
    async createOrder(plan: string, token: string) {
        const res = await fetchAPI('/vip-orders/create', {}, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plan }),
        });

        if (res.error) {
            throw new Error(res.error.message || 'Failed to create order');
        }
        return res;
    },

    /**
     * Poll order status by order code.
     * Returns { status: 'pending' | 'paid' | 'expired' | 'cancelled', paid_at }
     */
    async checkStatus(orderCode: string) {
        const res = await fetchAPI(`/vip-orders/check/${orderCode}`);
        if (res.error) {
            throw new Error(res.error.message || 'Failed to check status');
        }
        return res;
    },
};

// User Level Service
export const userLevelService = {
    // Get current user's level info
    async getMyLevel(token: string) {
        const res = await fetchAPI('/user-levels/me', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data; // { userId, exp, level, title, badge, avatarFrame, frameImage, nameColor, dailyClaimed, progress }
    },

    // Get public level config (frames, badges, etc.)
    async getLevelConfig() {
        const res = await fetchAPI('/user-levels/config');
        return res.data; // { levels: [], expRewards: {} }
    },

    // Get unlocked cosmetics
    async getMyCosmetics(token: string) {
        const res = await fetchAPI('/user-levels/cosmetics', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data; // { currentLevel, equipped: {}, unlocked: [] }
    },

    // Update equipped cosmetics
    async updateCosmetics(token: string, frame?: string, nameColor?: string) {
        const res = await fetchAPI('/user-levels/cosmetics', {}, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ frame, nameColor })
        });
        return res;
    },

    // Claim daily EXP
    async claimDaily(token: string) {
        const res = await fetchAPI('/user-levels/daily', {}, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
};
