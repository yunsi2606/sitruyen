"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, TrendingUp, X, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/api";

// Helper: extract cover URL from various Strapi response formats
function extractCoverUrl(cover: any): string | null {
    if (!cover) return null;
    if (typeof cover === 'string') return cover;
    // Strapi v5 flat: { url: "/uploads/..." }
    if (cover.url) return cover.url;
    // Strapi v4 nested: { data: { attributes: { url: ... } } }
    if (cover.data?.attributes?.url) return cover.data.attributes.url;
    if (cover.data?.url) return cover.data.url;
    return null;
}

// Types
interface Suggestion {
    id: number;
    title: string;
    slug: string;
    cover?: string | null;
    view_count?: number;
    rating?: number;
}

interface HotSearch {
    keyword: string;
    score: number;
}

// API helpers
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

async function fetchAutocomplete(q: string): Promise<Suggestion[]> {
    try {
        const res = await fetch(
            `${STRAPI_URL}/api/stories/autocomplete?q=${encodeURIComponent(q)}&limit=8`,
            { cache: "no-store" }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.suggestions || [];
    } catch {
        return [];
    }
}

async function fetchHotSearches(): Promise<HotSearch[]> {
    try {
        const res = await fetch(`${STRAPI_URL}/api/stories/hot-searches?limit=8&window=24h`, {
            next: { revalidate: 60 }, // Cache 60s on server
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.hot || [];
    } catch {
        return [];
    }
}

function logSearch(keyword: string) {
    // Fire-and-forget: don't await, don't block UI
    fetch(`${STRAPI_URL}/api/stories/search-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
    }).catch(() => { });
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

// Format view count
function fmtViews(n?: number) {
    if (!n) return null;
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

// Component
interface SearchBarProps {
    /** Use "inline" for header bar, "hero" for large center search */
    variant?: "inline" | "hero";
    placeholder?: string;
    className?: string;
}

export function SearchBar({ variant = "inline", placeholder = "Search manga, author...", className = "" }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [hotSearches, setHotSearches] = useState<HotSearch[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 280);

    // Fetch hot searches once on mount
    useEffect(() => {
        fetchHotSearches().then(setHotSearches);
    }, []);

    // Autocomplete when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        fetchAutocomplete(debouncedQuery).then((s) => {
            setSuggestions(s);
            setLoading(false);
            setActiveIdx(-1);
        });
    }, [debouncedQuery]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            const items = query.trim().length >= 2 ? suggestions : [];
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIdx((i) => Math.min(i + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIdx((i) => Math.max(i - 1, -1));
            } else if (e.key === "Enter") {
                if (activeIdx >= 0 && items[activeIdx]) {
                    window.location.href = `/manga/${items[activeIdx].slug}`;
                } else if (query.trim()) {
                    handleSubmit();
                }
            } else if (e.key === "Escape") {
                setOpen(false);
                inputRef.current?.blur();
            }
        },
        [activeIdx, suggestions, query]
    );

    function handleSubmit() {
        const kw = query.trim();
        if (!kw) return;
        logSearch(kw);
        setOpen(false);
        window.location.href = `/browse?q=${encodeURIComponent(kw)}`;
    }

    function handleHotClick(kw: string) {
        setQuery(kw);
        logSearch(kw);
        setOpen(false);
        window.location.href = `/browse?q=${encodeURIComponent(kw)}`;
    }

    function handleClear() {
        setQuery("");
        setSuggestions([]);
        inputRef.current?.focus();
    }

    const showDropdown = open && (hotSearches.length > 0 || suggestions.length > 0 || loading);
    const showSuggestions = query.trim().length >= 2;
    const showHot = !showSuggestions && hotSearches.length > 0;

    // Hero variant
    if (variant === "hero") {
        return (
            <div ref={containerRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
                <div
                    className={`flex items-center gap-3 bg-white/8 backdrop-blur-md rounded-2xl border transition-all duration-200 px-5 py-3.5 ${open ? "border-accent ring-2 ring-accent/20 shadow-lg shadow-accent/10" : "border-white/15 hover:border-white/25"}`}
                >
                    <Search className="w-5 h-5 text-muted flex-shrink-0" />
                    <input
                        ref={inputRef}
                        id="hero-search-input"
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        autoComplete="off"
                        className="flex-1 bg-transparent outline-none text-base text-white placeholder-muted"
                        aria-label="Search manga"
                        aria-autocomplete="list"
                        aria-expanded={showDropdown}
                    />
                    {query && (
                        <button onClick={handleClear} className="p-1 rounded-full hover:bg-white/10 text-muted hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent/90 transition-colors flex-shrink-0"
                    >
                        Search
                    </button>
                </div>
                <SearchDropdown
                    show={showDropdown}
                    loading={loading}
                    showSuggestions={showSuggestions}
                    showHot={showHot}
                    suggestions={suggestions}
                    hotSearches={hotSearches}
                    activeIdx={activeIdx}
                    onHotClick={handleHotClick}
                    onSuggestionClick={() => setOpen(false)}
                />
            </div>
        );
    }

    // Inline variant (header)
    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div
                className={`flex items-center bg-white/5 rounded-full border transition-all duration-200 w-64 h-10 px-4 gap-2 ${open ? "border-accent ring-1 ring-accent/30" : "border-white/10 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent"}`}
            >
                <Search className="w-4 h-4 text-muted flex-shrink-0" />
                <input
                    ref={inputRef}
                    id="header-search-input"
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="bg-transparent border-none outline-none text-sm text-white placeholder-muted w-full h-full"
                    aria-label="Search manga"
                    aria-autocomplete="list"
                    aria-expanded={showDropdown}
                />
                {query && (
                    <button onClick={handleClear} className="text-muted hover:text-white transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            <SearchDropdown
                show={showDropdown}
                loading={loading}
                showSuggestions={showSuggestions}
                showHot={showHot}
                suggestions={suggestions}
                hotSearches={hotSearches}
                activeIdx={activeIdx}
                onHotClick={handleHotClick}
                onSuggestionClick={() => setOpen(false)}
            />
        </div>
    );
}

// Dropdown Panel
interface DropdownProps {
    show: boolean;
    loading: boolean;
    showSuggestions: boolean;
    showHot: boolean;
    suggestions: Suggestion[];
    hotSearches: HotSearch[];
    activeIdx: number;
    onHotClick: (kw: string) => void;
    onSuggestionClick: () => void;
}

function SearchDropdown({
    show,
    loading,
    showSuggestions,
    showHot,
    suggestions,
    hotSearches,
    activeIdx,
    onHotClick,
    onSuggestionClick,
}: DropdownProps) {
    if (!show) return null;

    return (
        <div
            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150"
            role="listbox"
        >
            {/* Autocomplete Suggestions */}
            {showSuggestions && (
                <div>
                    {loading ? (
                        <div className="px-4 py-6 flex items-center justify-center gap-2 text-sm text-muted">
                            <span className="w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
                            Searching...
                        </div>
                    ) : suggestions.length > 0 ? (
                        <ul>
                            {suggestions.map((s, i) => (
                                <li key={s.id} role="option" aria-selected={i === activeIdx}>
                                    <Link
                                        href={`/manga/${s.slug}`}
                                        onClick={onSuggestionClick}
                                        className={`flex items-center gap-3 px-4 py-3 transition-colors group ${i === activeIdx ? "bg-accent/10 text-white" : "hover:bg-white/5 text-muted hover:text-white"}`}
                                    >
                                        {/* Cover thumbnail */}
                                        <div className="w-8 h-10 rounded-md overflow-hidden flex-shrink-0 bg-white/5">
                                            {extractCoverUrl(s.cover) ? (
                                                <Image
                                                    src={getStrapiMedia(extractCoverUrl(s.cover)) || ""}
                                                    alt={s.title}
                                                    width={32}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                                    <Search className="w-3 h-3 text-muted" />
                                                </div>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate text-white">{s.title}</p>
                                            {s.view_count ? (
                                                <p className="text-xs text-muted">{fmtViews(s.view_count)} views</p>
                                            ) : null}
                                        </div>
                                        {/* Rating */}
                                        {s.rating ? (
                                            <span className="text-xs text-yellow-400 font-medium flex-shrink-0">★ {s.rating}</span>
                                        ) : null}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-6 text-sm text-muted text-center">
                            No results found
                        </div>
                    )}
                </div>
            )}

            {/* Hot Searches */}
            {showHot && (
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Trending Searches</span>
                        <span className="ml-auto text-[10px] text-muted">24h</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {hotSearches.map((h, i) => (
                            <button
                                key={h.keyword}
                                onClick={() => onHotClick(h.keyword)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-accent/10 hover:text-accent border border-white/10 hover:border-accent/30 text-sm text-muted transition-all duration-150"
                            >
                                {i < 3 && (
                                    <span className={`text-xs font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-orange-400"}`}>
                                        #{i + 1}
                                    </span>
                                )}
                                {h.keyword}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent searches placeholder (future) */}
            {!showHot && !showSuggestions && !loading && (
                <div className="px-4 py-5 flex items-center gap-2 text-sm text-muted">
                    <Clock className="w-4 h-4" />
                    <span>Start typing to search...</span>
                </div>
            )}
        </div>
    );
}
