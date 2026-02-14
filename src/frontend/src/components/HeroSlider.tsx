"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, BookOpen, Star } from "lucide-react";
import { getStrapiMedia } from "@/lib/api";
import { cn } from "@/lib/utils";

interface HeroItem {
    id: number;
    title: string;
    slug: string;
    cover?: { url: string };
    rating?: number;
    [key: string]: any;
}

interface HeroSliderProps {
    items: HeroItem[];
}

// Helper to safely render description from Strapi Blocks or String
function getDescription(description: any): string {
    if (!description) return "Discover this amazing story today. Read the latest chapters and join the community.";
    if (typeof description === 'string') return description;
    if (Array.isArray(description)) {
        return description.map((block: any) =>
            block.children?.map((child: any) => child.text).join('')
        ).join(' ');
    }
    return "Discover this amazing story today.";
}

export function HeroSlider({ items }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    // Auto-slide
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [nextSlide, isPaused]);

    if (!items || items.length === 0) return null;

    return (
        <section className="relative w-full max-w-[1280px] mx-auto px-6 pt-8 pb-12 section-gap animate-in fade-in duration-700">
            <div
                className="relative w-full h-[450px] md:h-[420px] rounded-3xl overflow-hidden bg-surface shadow-2xl group ring-1 ring-white/5"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* SLIDER TRACK */}
                <div
                    className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {items.map((item, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <div key={item.id} className="min-w-full h-full relative">
                                {/* Background Image (Blurred) */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={getStrapiMedia(item.cover?.url || null) || "https://placehold.co/1280x720/png?text=No+Image"}
                                        alt="Hero BG"
                                        fill
                                        className="object-cover opacity-50 blur-sm brightness-50"
                                        priority={index === 0}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent z-10" />
                                </div>

                                {/* Content Container */}
                                <div className="relative z-20 flex items-center h-full px-6 md:px-12 gap-8 md:gap-16">

                                    {/* Poster Image */}
                                    <div
                                        className={cn(
                                            "hidden md:block flex-shrink-0 w-[240px] h-[340px] relative rounded-xl shadow-2xl shadow-black/50 overflow-hidden transform transition-all duration-700 ease-out delay-100",
                                            isActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
                                        )}
                                    >
                                        <Image
                                            src={getStrapiMedia(item.cover?.url || null) || "https://placehold.co/600x900"}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div
                                        className={cn(
                                            "flex-1 space-y-6 max-w-2xl transition-all duration-700 ease-out delay-200",
                                            isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-accent/90 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-accent/25">
                                                Featured
                                            </span>
                                            <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                                <Star className="w-4 h-4 fill-current" /> {item.rating || 4.9}
                                            </span>
                                        </div>

                                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-sm line-clamp-2">
                                            {item.title}
                                        </h1>

                                        <p className="text-muted text-sm md:text-lg line-clamp-3 leading-relaxed max-w-xl drop-shadow-md">
                                            {getDescription(item.description)}
                                        </p>

                                        <div className="flex flex-wrap gap-4 pt-2 md:pt-4">
                                            <Link href={`/manga/${item.slug}`} className="flex items-center gap-2 px-6 md:px-8 py-3 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/30 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all text-sm md:text-base">
                                                <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> Read Now
                                            </Link>
                                            <Link href={`/manga/${item.slug}`} className="flex items-center gap-2 px-6 md:px-8 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm text-sm md:text-base">
                                                <BookOpen className="w-4 h-4 md:w-5 md:h-5" /> View Info
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 text-white/70 hover:bg-accent hover:text-white hover:scale-110 backdrop-blur-sm border border-white/10 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 text-white/70 hover:bg-accent hover:text-white hover:scale-110 backdrop-blur-sm border border-white/10 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                    aria-label="Next Slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots Navigation */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                idx === currentIndex ? "bg-accent w-8" : "bg-white/20 hover:bg-white/40 w-2"
                            )}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Mobile Tap Area Hint (Optional, subtle gradient at edges? No, simple swipe is good but swipe needs library. Buttons visible on mobile? Yes logic hidden md:flex. Let's make arrows visible on mobile too but smaller) */}
                <button
                    onClick={prevSlide}
                    className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white/50 border border-white/5"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={nextSlide}
                    className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white/50 border border-white/5"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}
