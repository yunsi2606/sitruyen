import { MangaReader } from "@/components/MangaReader";
import { notFound } from "next/navigation";
import { getStrapiMedia } from "@/lib/api";
import { chapterService } from "@/services/api";
import { Manga, Chapter } from "@/types";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Lock, Crown } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering since we depend on params
export const dynamic = 'force-dynamic';

interface Params {
    params: Promise<{
        slug: string;
        chapter: string;
    }>;
}

// Fetch chapter details
async function getChapterData(slug: string, chapterSlug: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const item = await chapterService.getChapterWithDetails(slug, chapterSlug, token);

        if (!item) {
            return null;
        }
        const attrs = item.attributes || item;
        const storyData = attrs.story?.data?.attributes || attrs.story;

        if (!storyData) return null;

        // Map Chapter Images
        const images = (attrs.images?.data || attrs.images || []).map((img: any) =>
            getStrapiMedia(img.attributes?.url || img.url)
        ).filter(Boolean);

        // Map Sibling Chapters for Navigation
        const chaptersList = (storyData.chapters?.data || storyData.chapters || []).map((c: any) => ({
            id: c.id.toString(),
            title: c.attributes?.title || c.title,
            slug: c.attributes?.slug || c.slug,
            number: c.attributes?.chapter_number || c.chapter_number,
            pages: [],
            createdAt: c.attributes?.createdAt || c.createdAt,
            is_vip_only: c.attributes?.is_vip_only || c.is_vip_only
        })).sort((a: any, b: any) => a.number - b.number);

        return {
            manga: {
                id: storyData.id?.toString() || "0",
                title: storyData.title,
                slug: storyData.slug,
                cover: "", // Not needed here
                description: "",
                genres: [],
                rating: 0,
                status: "Ongoing", // Default
                chapters: chaptersList
            } as Manga,
            chapter: {
                id: item.id.toString(),
                title: attrs.title,
                slug: attrs.slug,
                number: attrs.chapter_number,
                pages: images,
                createdAt: attrs.createdAt,
                is_vip_only: attrs.is_vip_only
            } as Chapter
        };

    } catch (error) {
        console.error("Error fetching chapter:", error);
        return null;
    }
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const data = await getChapterData(params.slug, params.chapter);
    if (!data) return {};

    return {
        title: `${data.chapter.title} - ${data.manga.title} - SiTruyen`,
        description: `Read ${data.chapter.title} of ${data.manga.title}`,
    };
}

export default async function ReaderPage(props: Params) {
    const params = await props.params;
    const data = await getChapterData(params.slug, params.chapter);

    if (!data) {
        notFound();
    }

    const { manga, chapter } = data;

    // Check if access is denied (VIP only but no content)
    if (chapter.is_vip_only && chapter.pages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
                <div className="p-6 bg-yellow-500/10 rounded-full ring-1 ring-yellow-500/20">
                    <Lock className="w-12 h-12 text-yellow-500" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h1 className="text-3xl font-bold text-white">VIP Access Required</h1>
                    <p className="text-muted text-lg">
                        This chapter is exclusive to VIP members. Upgrade your plan to unlock instant access to the latest releases!
                    </p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <Link
                        href="/vip-upgrade" // Placeholder link
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-0.5 transition-all"
                    >
                        <Crown className="w-5 h-5 fill-current" />
                        Upgrade to VIP
                    </Link>
                    <Link
                        href={`/manga/${params.slug}`}
                        className="text-sm text-muted hover:text-white transition-colors"
                    >
                        Back to Manga
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <MangaReader manga={manga} chapter={chapter} />
    );
}
