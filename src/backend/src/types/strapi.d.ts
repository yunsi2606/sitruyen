/**
 * Shared domain types for the SiTruyen Strapi backend.
 * Import these instead of using `any` in controllers/services/lifecycles.
 */

// Media

export interface StrapiMedia {
    id: number;
    url: string;
    name?: string;
    mime?: string;
    width?: number;
    height?: number;
}

// Category

export interface Category {
    id: number;
    documentId?: string;
    name: string;
    slug: string;
}

// Story

export interface Story {
    id: number;
    documentId?: string;
    title: string;
    slug: string;
    author?: string;
    description_text?: string;
    cover?: StrapiMedia | null;
    view_count?: string | number | bigint;
    follow_count?: number;
    rating?: number;
    total_chapters?: number;
    story_status?: 'ongoing' | 'completed' | 'hiatus';
    is_featured?: boolean;
    is_trending?: boolean;
    categories?: Category[];
    chapters?: Chapter[];
    createdAt?: string;
    updatedAt?: string;
}

// Chapter

export interface Chapter {
    id: number;
    documentId?: string;
    title: string;
    slug?: string;
    chapter_number?: number;
    view_count?: string | number | bigint;
    is_vip_only?: boolean;
    chap_published_at?: string;
    story?: Story;
    content?: unknown;
    images?: StrapiMedia[];
    createdAt?: string;
    updatedAt?: string;
}

// User (users-permissions)

export interface StrapiUser {
    id: number;
    documentId?: string;
    username: string;
    email: string;
    plan?: 'free' | 'vip';
    vip_expired_at?: string | null;
    exp?: number;
    level?: number;
    avatar_frame?: string | null;
    name_color?: string | null;
    last_daily_exp?: string | null;
}

// Reading History

export interface ReadingHistory {
    id: number;
    user?: StrapiUser | number;
    story?: Story | number;
    chapter?: Chapter | number;
    history_updated_at?: Date | string;
}

// VIP Order

export type VipPlan = '1month' | '3months' | '6months';
export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'expired';

export interface VipOrder {
    id: number;
    documentId?: string;
    order_code: string;
    amount: number;
    duration_days: number;
    status: OrderStatus;
    buyer?: StrapiUser | number;
    note?: string;
    paid_at?: string | null;
    sepay_transaction_id?: string | null;
    sepay_reference?: string | null;
    createdAt?: string;
}

// SePay Webhook Payload

export interface SepayWebhookBody {
    id: string | number;
    gateway?: string;
    transactionDate?: string;
    accountNumber?: string;
    content?: string;
    transferType?: 'in' | 'out';
    transferAmount: number;
    accumulated?: number;
    subAccount?: string | null;
    referenceCode?: string;
    code?: string;
    description?: string;
}

// Meilisearch Story Document

export interface MeiliStoryDocument {
    id: number;
    title: string;
    slug: string;
    author: string;
    description_text: string;
    cover: string | null;
    view_count: number;
    follow_count: number;
    rating: number;
    status: string;
    updatedAt: string | undefined;
    createdAt: string | undefined;
    categories: string[];
    categories_names: string;
}

// Level Config

export interface LevelConfig {
    level: number;
    expRequired: number;
    frame: string;
    frameImage: string | null;
    nameColor: string;
    title: string;
    badge: string;
}

export interface GrantExpResult {
    userId: number;
    oldLevel: number;
    newLevel: number;
    totalExp: number;
    expGained: number;
    leveledUp: boolean;
    rewards: {
        frame: string;
        frameImage: string | null;
        nameColor: string;
        title: string;
        badge: string;
    } | null;
}
