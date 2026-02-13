export interface Manga {
    id: string;
    title: string;
    slug: string;
    cover: string;
    description: string;
    genres: string[];
    rating: number;
    status: "Ongoing" | "Completed";
    chapters: Chapter[];
}

export interface Chapter {
    id: string;
    title: string;
    slug: string; // usually chapter number or combined slug
    number: number;
    pages: string[]; // URLs
    createdAt: string;
}

export type ReadingMode = "vertical" | "paginated";
