"use client";

import { Chapter } from "@/types";
import { ChevronLeft, ChevronRight, Settings, Flag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ReportModal } from "./ReportModal";

interface ReaderControlsProps {
    currentChapter: Chapter;
    chapters: Chapter[];
    mangaSlug: string;
    onModeChange: (mode: "vertical" | "paginated") => void;
    mode: "vertical" | "paginated";
}

export function ReaderControls({ currentChapter, chapters, mangaSlug, onModeChange, mode }: ReaderControlsProps) {
    const currentIndex = chapters.findIndex((c) => c.slug === currentChapter.slug);
    const prevChapter = chapters[currentIndex - 1];
    const nextChapter = chapters[currentIndex + 1];
    const [showSettings, setShowSettings] = useState(false);
    const [showReport, setShowReport] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border p-4 flex items-center justify-between shadow-[0_-5px_10px_rgba(0,0,0,0.1)] transition-transform duration-300">
            <div className="flex items-center space-x-4">
                <Link
                    href={prevChapter ? `/read/${mangaSlug}/${prevChapter.slug}` : "#"}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md bg-surface hover:bg-surface/80 transition-colors ${!prevChapter ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                </Link>
                <span className="text-sm font-medium truncate max-w-[150px] sm:max-w-xs text-foreground">
                    {currentChapter.title}
                </span>
                <Link
                    href={nextChapter ? `/read/${mangaSlug}/${nextChapter.slug}` : "#"}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors ${!nextChapter ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="relative">
                <button
                    onClick={() => setShowReport(true)}
                    className="p-2 rounded-full hover:bg-surface transition-colors"
                    title="Report Issue"
                >
                    <Flag className="h-5 w-5 text-secondary hover:text-red-400 transition-colors" />
                </button>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-full hover:bg-surface transition-colors"
                >
                    <Settings className="h-5 w-5 text-secondary" />
                </button>

                {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-surface rounded-lg shadow-xl border border-border p-2 animate-in slide-in-from-bottom-2">
                        <h4 className="text-xs font-semibold text-secondary uppercase px-2 py-1 mb-1">Reading Mode</h4>
                        <button
                            onClick={() => { onModeChange('vertical'); setShowSettings(false); }}
                            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${mode === 'vertical' ? 'bg-primary text-white' : 'hover:bg-background'}`}
                        >
                            Vertical Scroll
                        </button>
                        <button
                            // Paginated logic would be more complex, just toggle for now
                            onClick={() => { onModeChange('paginated'); setShowSettings(false); }}
                            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${mode === 'paginated' ? 'bg-primary text-white' : 'hover:bg-background'}`}
                        >
                            Paginated (BETA)
                        </button>
                    </div>
                )}
            </div>

            <ReportModal
                isOpen={showReport}
                onClose={() => setShowReport(false)}
                locationContext={`Chapter: ${currentChapter.title}`}
            />
        </div>
    );
}
