"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, Trash2, Calendar } from "lucide-react";
import { getStrapiMedia } from "@/lib/api";
import { historyService } from "@/services/api";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Function to check auth and fetch data
        const init = async () => {
            // Give a small delay for cookie availability
            await new Promise(r => setTimeout(r, 100));

            const token = auth.getToken();
            const user = auth.getUser();

            if (!token || !user) {
                setLoading(false);
                return;
            }

            try {
                const data = await historyService.getHistory(user.id, token);
                setHistory(data);
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setLoading(false);
            }
        };

        if (typeof window !== "undefined") {
            init();
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white pb-20">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-muted animate-pulse">Loading reading history...</p>
            </div>
        );
    }

    if (!auth.isAuthenticated()) {
        return (
            <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white gap-6 pb-20 px-4 text-center animate-in fade-in duration-500">
                <div className="bg-white/5 p-6 rounded-full border border-white/10">
                    <Clock className="w-16 h-16 text-muted" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Login Required</h1>
                <p className="text-muted max-w-md text-lg">
                    Please log in to track your reading history and pick up exactly where you left off across all your devices.
                </p>
                <div className="flex gap-4">
                    <Link href="/login?redirect=/history" className="px-8 py-3 bg-accent hover:bg-accent/90 rounded-xl font-bold transition-all shadow-lg hover:shadow-accent/25 hover:scale-105 active:scale-95">
                        Log In
                    </Link>
                    <Link href="/" className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95">
                        Back Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="pt-24 px-6 max-w-[1280px] mx-auto mb-12 border-b border-white/5 pb-8">
                <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 mb-2">
                    <Clock className="w-10 h-10 text-accent" /> Reading History
                </h1>
                <p className="text-muted text-lg pl-14">
                    Continue reading your favorite stories.
                </p>
            </div>

            {/* Grid */}
            <div className="px-6 max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                {history.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-6 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                        <BookOpen className="w-16 h-16 text-muted opacity-50" />
                        <div>
                            <p className="text-xl font-bold text-white mb-2">No history yet</p>
                            <p className="text-muted mb-6">Start reading stories to build your library.</p>
                            <Link href="/browse" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors">
                                Browse Manga
                            </Link>
                        </div>
                    </div>
                ) : (
                    history.map((item) => {
                        // Robust data extraction for Strapi v4/v5/Populate structures
                        const story = item.story?.data?.attributes || item.story;
                        if (!story) return null; // Logic skip

                        const chapter = item.chapter?.data?.attributes || item.chapter;

                        // Cover logic
                        const coverData = story.cover?.data?.attributes || story.cover;
                        const coverUrl = getStrapiMedia(coverData?.url);

                        const lastRead = item.history_updated_at || item.updatedAt;

                        return (
                            <div key={item.id} className="group relative flex flex-col gap-3">
                                {/* Cover Card */}
                                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-white/5 bg-surface group-hover:border-accent/50 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-accent/10">
                                    <Image
                                        src={coverUrl || "https://placehold.co/400x600?text=No+Cover"}
                                        alt={story.title || "Manga"}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                    {/* Overlay Button */}
                                    {chapter && (
                                        <Link
                                            href={`/read/${story.slug}/${chapter.slug}`}
                                            className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]"
                                        >
                                            <span className="px-5 py-2.5 bg-accent text-white rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                Continue
                                            </span>
                                        </Link>
                                    )}

                                    {/* Mobile Chapter Badge (Always visible) */}
                                    {chapter && (
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] md:text-xs font-bold text-white/90 z-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                                                Chapter {chapter.chapter_number}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info Block */}
                                <div className="space-y-1">
                                    <h3 className="font-bold text-base text-white/90 line-clamp-1 group-hover:text-accent transition-colors" title={story.title}>
                                        {story.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-xs text-muted font-medium">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            {lastRead ? new Date(lastRead).toLocaleDateString() : 'Recently'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
