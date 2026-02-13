import { MangaReader } from "@/components/MangaReader";
import { notFound } from "next/navigation";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import { Manga, Chapter } from "@/types";
import { Metadata } from "next";

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
        // Fetch Chapter with images and related story
        // Filter by chapter slug AND story slug to ensure correctness
        const query = `?filters[slug][$eq]=${chapterSlug}&filters[story][slug][$eq]=${slug}&populate[images][fields][0]=url&populate[story][fields][0]=title&populate[story][fields][1]=slug&populate[story][populate][chapters][fields][0]=title&populate[story][populate][chapters][fields][1]=slug&populate[story][populate][chapters][fields][2]=chapter_number&populate[story][populate][chapters][sort][0]=chapter_number:desc`;

        const response = await fetchAPI(`/chapters${query}`);

        if (!response.data || response.data.length === 0) {
            return null;
        }

        const item = response.data[0];
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
            createdAt: c.attributes?.createdAt || c.createdAt
        })).sort((a: any, b: any) => b.number - a.number);

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
                createdAt: attrs.createdAt
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

    return (
        <MangaReader manga={manga} chapter={chapter} />
    );
}
