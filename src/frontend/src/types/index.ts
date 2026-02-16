export interface Manga {
    id: string;
    title: string;
    slug: string;
    cover: string;
    description: string;
    genres: string[];
    rating: number;
    status: "Ongoing" | "Completed";
    view_count?: number;
    chapters: Chapter[];
}

export interface Chapter {
    id: string;
    title: string;
    slug: string; // usually chapter number or combined slug
    number: number;
    view_count?: number;
    pages: string[]; // URLs
    createdAt: string;
    is_vip_only?: boolean;
}

export interface User {
    id: number;
    username: string;
    email: string;
    plan: "free" | "vip";
    vip_expired_at?: string;
    blocked: boolean;
    confirmed: boolean;
    createdAt: string;
}

export type ReadingMode = "vertical" | "paginated";
