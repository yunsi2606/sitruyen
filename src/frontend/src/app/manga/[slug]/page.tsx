
import { ChapterList } from "@/components/ChapterList";
import { CommentSection } from "@/components/CommentSection";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Star, Clock, ListChecks, Play, BookOpen, Eye } from "lucide-react";
import { cn } from "@/lib/utils"; // assuming cn utility available or inline
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import { Manga, Chapter } from "@/types";

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

// Helper to fetch manga by slug
async function getManga(slug: string): Promise<Manga | null> {
    try {
        // Fetch fields and relations
        const query = `?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[cover][fields][0]=url&populate[categories][fields][0]=name&populate[categories][fields][1]=slug&populate[chapters][sort][0]=chapter_number:desc`;

        console.log(`Fetching manga with slug: ${slug}, Query: ${query}`);
        const response = await fetchAPI(`/stories${query}`);

        if (!response.data || response.data.length === 0) {
            console.log("No manga found for slug:", slug);
            return null;
        }

        const item = response.data[0];
        const attributes = item.attributes || item;

        // Debug logging enabled to verify data
        console.log("Fetched Manga Title:", attributes.title);
        console.log("Fetched Categories Raw:", JSON.stringify(attributes.categories, null, 2));
        if (attributes.chapters?.data?.length > 0) {
            console.log("First Chapter Sample:", JSON.stringify(attributes.chapters.data[0], null, 2));
        }
        return {
            id: item.id.toString(),
            title: attributes.title,
            slug: attributes.slug,

            description: Array.isArray(attributes.description)
                ? attributes.description.map((block: any) => block.children?.map((child: any) => child.text).join('')).join('\n\n')
                : typeof attributes.description === 'string' ? attributes.description : "",

            cover: getStrapiMedia(attributes.cover?.data?.attributes?.url || attributes.cover?.url || null) || "",
            rating: attributes.rating || 0,
            status: attributes.story_status ? (attributes.story_status === 'completed' ? 'Completed' : 'Ongoing') : 'Ongoing',
            view_count: attributes.view_count ? Number(attributes.view_count) : 0,

            genres: (Array.isArray(attributes.categories) ? attributes.categories : attributes.categories?.data || [])
                .map((c: any) => c.attributes?.name || c.name)
                .filter(Boolean) || [],

            chapters: (Array.isArray(attributes.chapters) ? attributes.chapters : attributes.chapters?.data || [])
                .map((c: any) => {
                    const attrs = c.attributes || c;
                    return {
                        id: c.id.toString(),
                        title: attrs.title,
                        slug: attrs.slug,
                        number: attrs.chapter_number,
                        view_count: attrs.view_count ? Number(attrs.view_count) : 0,
                        pages: [], // Not needed for list
                        createdAt: attrs.createdAt
                    };
                }) || []
        };
    } catch (error) {
        console.error("Error fetching manga:", error);
        return null;
    }
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const manga = await getManga(params.slug);
    if (!manga) return {};

    return {
        title: `${manga.title} - SiTruyen`,
        description: manga.description,
    };
}

export default async function MangaDetail(props: Params) {
    const params = await props.params;
    const manga = await getManga(params.slug);

    if (!manga) {
        notFound();
    }

    // Sort chapters
    const sortedChapters = [...manga.chapters].sort((a, b) => b.number - a.number);

    const latestChapter = sortedChapters[0];
    const firstChapter = sortedChapters[sortedChapters.length - 1];

    return (
        <div className="w-full max-w-[1280px] mx-auto space-y-12 animate-in fade-in-up duration-500 py-8 px-6">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">

                {/* Cover Image - Fixed Width Desktop */}
                <div className="w-full md:w-[300px] flex-shrink-0 mx-auto md:mx-0 max-w-[300px]">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-surface">
                        <Image
                            src={manga.cover || "https://placehold.co/400x600"}
                            alt={manga.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            priority
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none" />
                    </div>
                </div>

                {/* Info Column */}
                <div className="flex-1 space-y-8 py-2">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                            {manga.title}
                        </h1>

                        {/* Meta Badges */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 font-medium text-sm">
                                <Star className="w-4 h-4 fill-current" />
                                {manga.rating || "N/A"}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20 font-medium text-sm">
                                <Eye className="w-4 h-4" />
                                {manga.view_count ? new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(manga.view_count) : 0} Views
                            </div>
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full border font-medium text-sm",
                                manga.status === 'Ongoing'
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            )}>
                                <Clock className="w-4 h-4" />
                                {manga.status}
                            </div>
                            {manga.genres.map((g) => (
                                <span key={g} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-muted hover:text-white text-sm rounded-full border border-white/10 transition-colors cursor-default">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-lg leading-relaxed text-muted max-w-3xl">
                        {manga.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link
                            href={firstChapter ? `/read/${manga.slug}/${firstChapter.slug}` : "#"}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl shadow-lg shadow-accent/25 hover:bg-accent/90 hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Start Reading
                        </Link>

                        {latestChapter && (
                            <Link
                                href={`/read/${manga.slug}/${latestChapter.slug}`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 font-semibold text-lg rounded-xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
                            >
                                <BookOpen className="w-5 h-5" />
                                Read Latest (Ch. {latestChapter.number})
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Chapter List Section */}
            <div className="space-y-8 border-t border-white/10 pt-16">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-white">
                        <ListChecks className="w-8 h-8 text-accent" />
                        Chapters
                    </h2>
                    <span className="text-sm font-medium text-muted bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        Total: {manga.chapters.length}
                    </span>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-sm backdrop-blur-sm">
                    <div className="max-w-4xl">
                        <ChapterList chapters={sortedChapters} mangaSlug={manga.slug} />
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-white/10 pt-16">
                <CommentSection storyId={Number(manga.id)} />
            </div>
        </div>
    );
}
