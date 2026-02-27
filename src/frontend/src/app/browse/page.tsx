"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStrapiMedia } from '@/lib/api';
import { categoryService, storyService } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Filter, ChevronDown, List, Grid, Search, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Manga } from '@/types';
import { trackEvent, EVENTS } from '@/lib/gtag';
import { useTranslations, useFormatter } from 'next-intl';
import { Eye } from 'lucide-react';
import { AdultCoverGuard } from '@/components/AdultCoverGuard';

// Localized in component using hooks
const SORT_VALUE_MAP: Record<string, string> = {
    'updatedAt:desc': 'latestUpdate',
    'view_count:desc': 'mostPopular',
    'createdAt:desc': 'newArrivals',
    'title:asc': 'nameAZ'
};

const STATUS_VALUE_MAP: Record<string, string> = {
    '': 'anyStatus',
    'Ongoing': 'ongoing',
    'Completed': 'completed'
};

export default function BrowsePage() {
    const t = useTranslations('browse');
    const tc = useTranslations('common');
    const format = useFormatter();

    const SORT_OPTIONS = [
        { label: t('latestUpdate'), value: 'updatedAt:desc' },
        { label: t('mostPopular'), value: 'view_count:desc' },
        { label: t('newArrivals'), value: 'createdAt:desc' },
        { label: t('nameAZ'), value: 'title:asc' },
    ];

    const STATUS_OPTIONS = [
        { label: t('anyStatus'), value: '' },
        { label: t('ongoing'), value: 'Ongoing' },
        { label: t('completed'), value: 'Completed' },
        { label: t('dropped'), value: 'Dropped' },
    ];
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

    // Sync state with URL search params (e.g., when Header Search changes URL)
    useEffect(() => {
        const q = searchParams.get('q');
        if (q !== null && q !== searchQuery) {
            setSearchQuery(q);
            setPage(1);
        }

        const genre = searchParams.get('genre');
        if (genre !== null && genre !== selectedGenre) {
            setSelectedGenre(genre);
            setPage(1);
        }

        const sort = searchParams.get('sort');
        if (sort !== null && sort !== sortBy) {
            setSortBy(sort);
            setPage(1);
        }

        const status = searchParams.get('status');
        if (status !== null && status !== statusFilter) {
            setStatusFilter(status);
            setPage(1);
        }
    }, [searchParams]);

    // Fetch Genres for Sidebar
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await categoryService.getAll(100);
                setGenres(data);
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
                let formatted: Manga[] = [];
                let paginationData = { page: 1, pageCount: 1, total: 0 };

                if (searchQuery.trim()) {
                    // Use Meilisearch search API
                    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
                    const params = new URLSearchParams({
                        q: searchQuery,
                        page: String(page),
                        limit: '24',
                        sort: sortBy,
                    });
                    if (selectedGenre) params.set('genre', selectedGenre);
                    if (statusFilter) params.set('status', statusFilter.toLowerCase());

                    const res = await fetch(`${STRAPI_URL}/api/stories/search?${params.toString()}`);
                    const data = await res.json();

                    // Meilisearch or DB fallback format
                    const hits = data.results || data.data || [];
                    formatted = hits.map((item: any) => {
                        const attrs = item.attributes || item;
                        return {
                            id: String(attrs.id || item.id),
                            title: attrs.title || '',
                            slug: attrs.slug || '',
                            cover: getStrapiMedia(attrs.cover?.data?.attributes?.url || attrs.cover?.url || attrs.cover || null) || '',
                            description: '',
                            rating: attrs.rating || 0,
                            status: (attrs.story_status || attrs.status)?.toLowerCase() === 'completed' ? 'Completed' : (attrs.story_status || attrs.status)?.toLowerCase() === 'dropped' ? 'Dropped' : 'Ongoing',
                            view_count: Number(attrs.view_count || 0),
                            total_chapters: Number(attrs.total_chapters || 0),
                            isAdultContent: Boolean(attrs.isAdultContent),
                            genres: (attrs.categories || []).map((c: any) => c?.name || c).filter(Boolean),
                            chapters: attrs.chapters ? attrs.chapters.slice(0, 3) : [],
                        };
                    });

                    const total = data.total || formatted.length;
                    paginationData = {
                        page: data.page || page,
                        pageCount: Math.ceil(total / 24) || 1,
                        total,
                    };
                } else {
                    // Use Strapi native browse
                    let query = `/stories?populate[cover][fields][0]=url&populate[categories][fields][0]=name&populate[categories][fields][1]=slug&populate[chapters][fields][0]=chapter_number&populate[chapters][fields][1]=updatedAt&populate[chapters][fields][2]=title&populate[chapters][fields][3]=slug&populate[chapters][sort][0]=chapter_number:desc&sort=${sortBy}&pagination[page]=${page}&pagination[pageSize]=24`;
                    if (selectedGenre) query += `&filters[categories][slug][$eq]=${selectedGenre}`;
                    if (statusFilter) query += `&filters[story_status][$eq]=${statusFilter.toLowerCase()}`;

                    const res = await storyService.search(query);
                    if (res.data) {
                        formatted = res.data.map((item: any) => {
                            const attrs = item.attributes || item;
                            return {
                                id: item.id.toString(),
                                title: attrs.title,
                                slug: attrs.slug,
                                cover: getStrapiMedia(attrs.cover?.data?.attributes?.url || attrs.cover?.url || null) || '',
                                description: '',
                                rating: attrs.rating || 0,
                                status: (attrs.story_status || attrs.status)?.toLowerCase() === 'completed' ? 'Completed' : (attrs.story_status || attrs.status)?.toLowerCase() === 'dropped' ? 'Dropped' : 'Ongoing',
                                isAdultContent: Boolean(attrs.isAdultContent),
                                view_count: Number(attrs.view_count || 0),
                                total_chapters: Number(attrs.total_chapters || 0),
                                genres: (attrs.categories?.data || []).map((c: any) => c.attributes?.name || c.name) || [],
                                chapters: (attrs.chapters?.data || attrs.chapters || [])
                                    .map((chap: any) => {
                                        const cAttrs = chap.attributes || chap;
                                        return {
                                            chapter_number: cAttrs.chapter_number,
                                            updatedAt: cAttrs.updatedAt,
                                            title: cAttrs.title,
                                            slug: cAttrs.slug
                                        };
                                    })
                                    .sort((a: any, b: any) => b.chapter_number - a.chapter_number) // sort by latest locally
                                    .slice(0, 3),
                            };
                        });
                        paginationData = res.meta?.pagination || { page: 1, pageCount: 1, total: 0 };
                    }
                }

                setMangaList(formatted);
                setPagination(paginationData);
            } catch (err) {
                console.error('Failed to fetch manga', err);
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

        // GA4 Tracking
        if (selectedGenre || statusFilter || sortBy !== 'updatedAt:desc' || searchQuery) {
            trackEvent('apply_filter', {
                genre: selectedGenre || 'all',
                status: statusFilter || 'any',
                sort: sortBy,
                query: searchQuery
            });
        }
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
                            <Grid className="w-8 h-8 text-accent" />
                            {searchQuery.trim() ? (
                                <>
                                    {t('searchTitle')}: <span className="text-accent">&ldquo;{searchQuery}&rdquo;</span>
                                </>
                            ) : t('title')}
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-muted text-sm">{t('foundTitles', { count: pagination.total })}</p>
                            {searchQuery.trim() && (
                                <button
                                    onClick={() => { setSearchQuery(''); setPage(1); }}
                                    className="text-xs text-accent hover:underline flex items-center gap-1"
                                >
                                    {t('clearSearch')}
                                </button>
                            )}
                        </div>
                    </div>


                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
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
                                <span>{STATUS_OPTIONS.find(o => o.value === statusFilter)?.label || t('anyStatus')}</span>
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
                                <List className="w-4 h-4 text-accent" /> {t('genres')}
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
                                    {t('all')}
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
                                    <div key={manga.id} className="group relative flex flex-col gap-3">
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface shadow-sm ring-1 ring-white/5 group-hover:ring-accent/50 transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(255,111,97,0.15)] group-hover:-translate-y-1">
                                            <AdultCoverGuard isAdultContent={manga.isAdultContent}>
                                                <>
                                                    <Image
                                                        src={manga.cover || "https://placehold.co/400x600"}
                                                        alt={manga.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                    {/* Labels */}
                                                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md text-white/90",
                                                            manga.status === 'Completed' ? "bg-blue-500/80" : manga.status === 'Dropped' ? "bg-red-500/80" : "bg-green-500/80"
                                                        )}>
                                                            {manga.status === 'Completed' ? tc('completed') : manga.status === 'Dropped' ? tc('dropped') : tc('ongoing')}
                                                        </span>
                                                    </div>

                                                    {/* Rating Badge */}
                                                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                        {manga.rating || 'N/A'}
                                                    </div>

                                                    {/* Overlay Info */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                        <Link href={`/manga/${manga.slug}`} className="px-4 py-2 bg-accent text-white font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">
                                                            {tc("readNow")}
                                                        </Link>
                                                    </div>
                                                </>
                                            </AdultCoverGuard>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-bold text-white text-base leading-tight line-clamp-1 group-hover:text-accent transition-colors">
                                                {manga.title}
                                            </h3>

                                            <div className="flex items-center justify-between mt-1 mb-2 text-xs text-muted">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 font-medium bg-white/5 px-2 py-0.5 rounded-md">
                                                        <Eye className="w-3 h-3 text-accent" />
                                                        {Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(manga.view_count || 0)}
                                                    </div>
                                                    <div className="flex items-center gap-1 font-medium bg-white/5 px-2 py-0.5 rounded-md" title={tc("chapter")}>
                                                        <List className="w-3 h-3 text-muted" />
                                                        {manga.total_chapters || manga.chapters?.length || 0}
                                                    </div>
                                                </div>
                                                <span className="truncate max-w-[80px]">{manga.genres[0]}</span>
                                            </div>

                                            <div className="flex flex-col gap-1 mt-1 border-t border-white/5 pt-2">
                                                {manga.chapters && manga.chapters.length > 0 ? manga.chapters.slice(0, 3).map((chapter: any, chapIdx: number) => (
                                                    <Link key={chapIdx} href={`/read/${manga.slug}/${chapter.slug}`} className="flex items-center justify-between text-[11px] group/chap hover:bg-white/5 p-1 rounded transition-colors -mx-1 px-1">
                                                        <span className="text-muted group-hover/chap:text-accent transition-colors font-medium">Ch. {chapter.chapter_number}</span>
                                                        <span className="text-muted/60">{format.relativeTime(new Date(chapter.updatedAt))}</span>
                                                    </Link>
                                                )) : (
                                                    <span className="text-[11px] text-muted p-1">{tc('nochapter')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-3xl bg-surface/50">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-muted" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{t('noResults')}</h3>
                                <p className="text-muted text-sm mt-2 max-w-md">
                                    {t('noResultsDescription') || "We couldn't find any manga matching your criteria. Try different filters or search keywords."}
                                </p>
                                <button
                                    onClick={() => { setSelectedGenre(''); setSearchQuery(''); setStatusFilter(''); }}
                                    className="mt-6 px-6 py-2 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors"
                                >
                                    {t('clearFilters')}
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
                                    {t('pageOf', { current: page, total: pagination.pageCount })}
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
