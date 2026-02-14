"use client";

import { Chapter, Manga, ReadingMode } from "@/types";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CommentSection } from "@/components/CommentSection";
import { ReaderControls } from "@/components/ReaderControls";
import { chapterService } from "@/services/api";

interface MangaReaderProps {
    manga: Manga;
    chapter: Chapter;
}

export function MangaReader({ manga, chapter }: MangaReaderProps) {
    const [mode, setMode] = useState<ReadingMode>("vertical");
    const [showHeader, setShowHeader] = useState(true);
    const readerRef = useRef<HTMLDivElement>(null);

    // Scroll handling to hide/show header
    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 100 && currentScrollY > lastScrollY) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Reset scroll when chapter changes
    useEffect(() => {
        if (readerRef.current) readerRef.current.scrollTop = 0;
        window.scrollTo(0, 0);

        // Increment view count
        chapterService.markAsRead(Number(chapter.id));
    }, [chapter.id]);

    return (
        <div className="relative flex flex-col items-center w-full min-h-screen bg-background" ref={readerRef}>
            {/* Header */}
            <div
                className={`
                    fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-transform duration-300
                    ${showHeader ? 'translate-y-0' : '-translate-y-full pointer-events-none opacity-0'}
                `}
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
                                        className="w-full h-auto block"
                                        unoptimized // Important for Strapi local images
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

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <ReaderControls
                    currentChapter={chapter}
                    chapters={manga.chapters}
                    mangaSlug={manga.slug}
                    mode={mode}
                    onModeChange={setMode}
                />
            </div>

            <div className="h-20" /> {/* Spacer for fixed footer */}
        </div>
    );
}
