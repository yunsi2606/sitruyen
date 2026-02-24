"use client";

import { Chapter, Manga, ReadingMode } from "@/types";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentSection } from "@/components/CommentSection";
import { ReaderControls } from "@/components/ReaderControls";
import { chapterService, historyService } from "@/services/api";
import { auth } from "@/lib/auth";
import { trackEvent, EVENTS } from "@/lib/gtag";

interface MangaReaderProps {
    manga: Manga;
    chapter: Chapter;
}

export function MangaReader({ manga, chapter }: MangaReaderProps) {
    const [mode, setMode] = useState<ReadingMode>("vertical");
    const [showBars, setShowBars] = useState(true);
    const readerRef = useRef<HTMLDivElement>(null);

    // Scroll-direction-based auto-hide (mobile app style)
    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;
        const THRESHOLD = 10; // px — ignore micro-scrolls to prevent flicker

        const update = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY;
            const atTop = currentScrollY < 60;
            const atBottom = (window.innerHeight + currentScrollY) >= document.body.scrollHeight - 60;

            if (atTop || atBottom) {
                // Always show bars at top/bottom of page
                setShowBars(true);
            } else if (delta > THRESHOLD) {
                // Scrolling DOWN past threshold → hide
                setShowBars(false);
            } else if (delta < -THRESHOLD) {
                // Scrolling UP past threshold → show
                setShowBars(true);
            }
            // If |delta| < THRESHOLD → do nothing (prevents flicker)

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Reset scroll when chapter changes
    useEffect(() => {
        if (readerRef.current) readerRef.current.scrollTop = 0;
        window.scrollTo(0, 0);

        const token = auth.getToken();
        const user = auth.getUser();

        // Increment view count
        chapterService.markAsRead(Number(chapter.id), token);

        // Track GA4 event
        trackEvent(EVENTS.READ_CHAPTER, {
            manga_title: manga.title,
            manga_slug: manga.slug,
            chapter_title: chapter.title,
            chapter_number: chapter.number
        });

        // Save History (if logged in)
        if (user && token) {
            historyService.saveHistory(user.id, Number(manga.id), Number(chapter.id), token);
        }
    }, [chapter.id, manga.id]);

    return (
        <>
            <div className="relative flex flex-col items-center w-full min-h-screen bg-background" ref={readerRef}>
                {/* Header */}
                <div
                    className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
                    style={{
                        transform: showBars ? 'translateY(0)' : 'translateY(-100%)',
                        transition: 'transform 0.3s ease',
                        willChange: 'transform',
                        pointerEvents: showBars ? 'auto' : 'none',
                    }}
                >
                    <div className="max-w-[900px] mx-auto px-4 h-14 flex items-center justify-between">
                        <Link href={`/manga/${manga.slug}`} className="group flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors max-w-[50%]">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold text-sm truncate">{manga.title}</span>
                        </Link>
                        <span className="font-bold text-sm bg-surface px-3 py-1 rounded-full border border-border truncate max-w-[40%]">
                            {chapter.title}
                        </span>
                        <div className="w-5" />
                    </div>
                </div>

                {/* Reader Content */}
                <div className="w-full max-w-[900px] mx-auto py-20 px-0 md:px-4">
                    {mode === 'vertical' ? (
                        <div className="flex flex-col space-y-0">
                            {chapter.pages.length > 0 ? (
                                chapter.pages.map((page, index) => (
                                    <div key={index} className="relative w-full">
                                        <Image
                                            src={page}
                                            alt={`Page ${index + 1}`}
                                            width={900}
                                            height={1200}
                                            className="w-full max-w-full h-auto block"
                                            unoptimized
                                            priority={index < 2}
                                        />
                                        <div className="absolute top-2 right-2 text-[10px] font-mono text-white/50 bg-black/30 px-1.5 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                                            {index + 1}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    No images available for this chapter.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-border mx-4">
                            <p className="text-muted-foreground">Pagination mode coming soon.</p>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="w-full max-w-[900px] mx-auto px-4 py-8 mb-20 animate-in fade-in-up duration-500">
                    <CommentSection storyId={Number(manga.id)} chapterId={Number(chapter.id)} />
                </div>

                <div className="h-20" />
            </div>

            {/* Footer Navigation - outside wrapper for correct fixed positioning */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50"
                style={{
                    transform: showBars ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.3s ease',
                    willChange: 'transform',
                }}
            >
                <ReaderControls
                    currentChapter={chapter}
                    chapters={manga.chapters}
                    mangaSlug={manga.slug}
                    mode={mode}
                    onModeChange={setMode}
                />
            </div>
        </>
    );
}
