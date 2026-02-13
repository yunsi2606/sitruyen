"use client";

import { Chapter } from "@/types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Clock } from "lucide-react";

interface ChapterListProps {
    chapters: Chapter[];
    mangaSlug: string;
}

export function ChapterList({ chapters, mangaSlug }: ChapterListProps) {
    return (
        <div className="w-full space-y-3">
            {/* Header for list if needed, usually handled by parent page */}
            {chapters.map((chapter) => (
                <Link
                    key={chapter.id}
                    href={`/read/${mangaSlug}/${chapter.slug}`}
                    className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-surface/50 hover:shadow-sm transition-all duration-200"
                >
                    <div className="flex flex-col gap-1">
                        <span className="text-base font-medium group-hover:text-primary transition-colors line-clamp-1">
                            {chapter.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="capitalize">{formatDistanceToNow(new Date(chapter.createdAt), { addSuffix: true })}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors bg-surface px-3 py-1 rounded-full border border-border group-hover:border-primary/20">
                            Read
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                </Link>
            ))}
        </div>
    );
}
