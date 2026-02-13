"use client";

import Image from "next/image";
import Link from "next/link";
import { Manga } from "@/types";
import { Star, Clock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MangaCardProps {
    manga: Manga;
    className?: string; // Allow external styling
}

export function MangaCard({ manga, className }: MangaCardProps) {
    const isOngoing = manga.status === "Ongoing";

    return (
        <Link
            href={`/manga/${manga.slug}`}
            className={cn(
                "group relative flex flex-col rounded-2xl bg-card border border-border shadow-sm overflow-hidden card-hover h-full",
                className
            )}
        >
            {/* Cover Image Wrapper - 3:4 Ratio */}
            <div className="relative w-full aspect-[3/4] bg-surface overflow-hidden">
                <Image
                    src={manga.cover}
                    alt={manga.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Status Badge */}
                <div className={cn(
                    "absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md text-white ring-1 ring-white/10",
                    isOngoing ? "bg-green-500/90" : "bg-blue-500/90"
                )}>
                    {manga.status}
                </div>

                {/* Gradient Overlay for subtle text contrast if needed, mostly clean though */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 space-y-2">
                <h3 className="text-base font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                    {manga.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                    <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">{manga.rating}</span>
                    </div>

                    <div className="flex items-center gap-1 truncate max-w-[60%]">
                        <span className="truncate">{manga.genres[0]}</span>
                        {manga.genres.length > 1 && <span className="text-[10px]">+ more</span>}
                    </div>
                </div>
            </div>
        </Link>
    );
}
