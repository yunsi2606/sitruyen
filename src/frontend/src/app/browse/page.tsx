"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAPI, getStrapiMedia } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Filter, ChevronDown, List, Grid, Search, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Manga } from '@/types';

const SORT_OPTIONS = [
    { label: 'Latest Updates', value: 'updatedAt:desc' },
    { label: 'Most Popular', value: 'view_count:desc' },
    { label: 'New Arrivals', value: 'createdAt:desc' },
    { label: 'Name A-Z', value: 'title:asc' },
];

const STATUS_OPTIONS = [
    { label: 'Any Status', value: '' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Completed', value: 'Completed' },
];

export default function BrowsePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filters State
    const [genres, setGenres] = useState<any[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get('genre') || '');
    const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'updatedAt:desc');
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

    // Data State
    const [mangaList, setMangaList] = useState<Manga[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pageCount: 1, total: 0 });

    // Fetch Genres for Sidebar
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetchAPI('/categories?sort=name:asc&pagination[limit]=100');
                if (res.data) setGenres(res.data);
            } catch (err) {
                console.error("Failed to fetch genres", err);
            }
        };
        fetchGenres();
    }, []);

    // Fetch Manga Logic
    useEffect(() => {
        const fetchManga = async () => {
            setLoading(true);
            try {
                // Construct basic filter
                let query = `/stories?populate=*&sort=${sortBy}&pagination[page]=${page}&pagination[pageSize]=24`;

                // Add genre filter
                if (selectedGenre) {
                    query += `&filters[categories][slug][$eq]=${selectedGenre}`;
                }

                // Add status filter
                if (statusFilter) {
                    query += `&filters[story_status][$eq]=${statusFilter.toLowerCase()}`;
                }

                // Add text search
                if (searchQuery) {
                    query += `&filters[title][$containsi]=${searchQuery}`;
                }

                const res = await fetchAPI(query);

                if (res.data) {
                    const formatted: Manga[] = res.data.map((item: any) => {
                        const attrs = item.attributes || item;
                        return {
                            id: item.id.toString(),
                            title: attrs.title,
                            slug: attrs.slug,
                            cover: getStrapiMedia(attrs.cover?.data?.attributes?.url || attrs.cover?.url || null) || "",
                            description: "", // Not needed for card
                            rating: attrs.rating || 0,
                            status: attrs.story_status === 'completed' ? 'Completed' : 'Ongoing',
                            view_count: Number(attrs.view_count || 0),
                            genres: (attrs.categories?.data || []).map((c: any) => c.attributes?.name || c.name) || [],
                            chapters: [] // Not needed
                        };
                    });
                    setMangaList(formatted);
                    setPagination(res.meta?.pagination || { page: 1, pageCount: 1, total: 0 });
                }
            } catch (err) {
                console.error("Failed to fetch manga", err);
                setMangaList([]);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchManga, 300);
        return () => clearTimeout(timeout);
    }, [page, sortBy, selectedGenre, searchQuery, statusFilter]);

    // Update URL on filter change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (selectedGenre) params.set('genre', selectedGenre);
        if (sortBy) params.set('sort', sortBy);
        if (statusFilter) params.set('status', statusFilter);
        window.history.replaceState(null, '', `/browse?${params.toString()}`);
    }, [searchQuery, selectedGenre, sortBy, statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">

                {/* Header / Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-in fade-in-down duration-500">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <Grid className="w-8 h-8 text-accent" /> Browse Manga
                        </h1>
                        <p className="text-muted text-sm mt-1">Found {pagination.total} titles for you</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                placeholder="Search titles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-surface border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-accent outline-none w-[200px] focus:w-[260px] transition-all duration-300"
                            />
                            <Search className="w-4 h-4 text-muted absolute left-3 top-3 group-focus-within:text-accent transition-colors" />
                        </form>

                        {/* Status Dropdown */}
                        <div className="relative group/status">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-white/10 rounded-xl text-sm font-medium text-white hover:border-white/20 transition-colors">
                                <Filter className="w-4 h-4" />
                                <span>{STATUS_OPTIONS.find(o => o.value === statusFilter)?.label || 'Any Status'}</span>
                                <ChevronDown className="w-4 h-4 text-muted" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-40 bg-surface border border-white/10 rounded-xl shadow-xl py-2 invisible opacity-0 translate-y-2 group-hover/status:visible group-hover/status:opacity-100 group-hover/status:translate-y-0 transition-all z-50">
                                {STATUS_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors",
                                            statusFilter === opt.value ? "text-accent font-medium" : "text-muted"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative group/sort">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-white/10 rounded-xl text-sm font-medium text-white hover:border-white/20 transition-colors">
                                <SlidersHorizontal className="w-4 h-4" />
                                <span>{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                                <ChevronDown className="w-4 h-4 text-muted" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl py-2 invisible opacity-0 translate-y-2 group-hover/sort:visible group-hover/sort:opacity-100 group-hover/sort:translate-y-0 transition-all z-50">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSortBy(opt.value); setPage(1); }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors",
                                            sortBy === opt.value ? "text-accent font-medium" : "text-muted"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 h-fit sticky top-24 animate-in fade-in-left duration-500">
                        <div className="bg-surface rounded-2xl border border-white/5 p-5">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <List className="w-4 h-4 text-accent" /> Genres
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => { setSelectedGenre(''); setPage(1); }}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                                        selectedGenre === ''
                                            ? "bg-accent text-white border-accent"
                                            : "bg-background text-muted border-white/5 hover:border-white/20 hover:text-white"
                                    )}
                                >
                                    All
                                </button>
                                {genres.map((g: any) => (
                                    <button
                                        key={g.id}
                                        onClick={() => { setSelectedGenre(g.attributes?.slug || g.slug); setPage(1); }}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                                            selectedGenre === (g.attributes?.slug || g.slug)
                                                ? "bg-accent text-white border-accent"
                                                : "bg-background text-muted border-white/5 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {g.attributes?.name || g.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4] rounded-2xl bg-surface animate-pulse border border-white/5" />
                                ))}
                            </div>
                        ) : mangaList.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in-up duration-500">
                                {mangaList.map((manga) => (
                                    <div key={manga.id} className="group relative">
                                        <Link href={`/manga/${manga.slug}`} className="block relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface shadow-sm border border-white/5 group-hover:border-accent/50 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl">
                                            <Image
                                                src={manga.cover || "https://placehold.co/400x600"}
                                                alt={manga.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Labels */}
                                            <div className="absolute top-3 left-3 flex flex-col gap-1">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md text-white/90",
                                                    manga.status === 'Completed' ? "bg-blue-500/80" : "bg-green-500/80"
                                                )}>
                                                    {manga.status}
                                                </span>
                                            </div>

                                            {/* Rating Badge */}
                                            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold flex items-center gap-1">
                                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                {manga.rating || 'N/A'}
                                            </div>

                                            {/* Overlay Info */}
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12">
                                                <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                                                    {manga.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                                                    <span className="truncate max-w-[80px]">{manga.genres[0]}</span>
                                                    <span>•</span>
                                                    <span>{manga.chapters?.length || 0} Ch</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-3xl bg-surface/50">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-muted" />
                                </div>
                                <h3 className="text-xl font-bold text-white">No manga found</h3>
                                <p className="text-muted text-sm mt-2 max-w-md">
                                    We couldn't find any manga matching your criteria. Try different filters or search keywords.
                                </p>
                                <button
                                    onClick={() => { setSelectedGenre(''); setSearchQuery(''); setStatusFilter(''); }}
                                    className="mt-6 px-6 py-2 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pageCount > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-12 py-8 border-t border-white/5">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg bg-surface border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <span className="text-sm text-muted font-mono">
                                    Page <span className="text-white font-bold">{page}</span> of {pagination.pageCount}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.pageCount, p + 1))}
                                    disabled={page === pagination.pageCount}
                                    className="p-2 rounded-lg bg-surface border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
