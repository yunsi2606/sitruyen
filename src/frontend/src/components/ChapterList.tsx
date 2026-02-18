"use client";

import { Chapter, User } from "@/types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Clock, Eye, Lock, Sparkles, Crown, ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { auth } from "@/lib/auth";

interface ChapterListProps {
    chapters: Chapter[];
    mangaSlug: string;
}

const ITEMS_PER_PAGE = 30;

export function ChapterList({ chapters, mangaSlug }: ChapterListProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchedUser = auth.getUser();
        setUser(fetchedUser);
        setLoading(false);
    }, []);

    // Filter chapters based on search query
    const filteredChapters = useMemo(() => {
        if (!searchQuery.trim()) return chapters;
        const query = searchQuery.toLowerCase();
        return chapters.filter(c =>
            c.title.toLowerCase().includes(query) ||
            c.number?.toString().includes(query)
        );
    }, [chapters, searchQuery]);

    // Reset page on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredChapters.length / ITEMS_PER_PAGE);
    const currentChapters = filteredChapters.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Optional: Scroll to list top
        const listElement = document.getElementById("chapter-list-top");
        if (listElement) {
            listElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const hasAccess = (chapter: Chapter) => {
        if (!chapter.is_vip_only) return true;
        if (!user) return false;
        if (user.plan === 'vip') {
            // ongoing subscription check
            if (user.vip_expired_at) {
                return new Date(user.vip_expired_at) > new Date();
            }
            return true; // lifetime vip
        }
        return false;
    };

    if (loading) return <div className="animate-pulse h-96 bg-white/5 rounded-xl block" />;

    const hasLockedChapters = chapters.some(c => !hasAccess(c));

    // Determine pagination range to show (e.g., 1 ... 4 5 6 ... 10)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="w-full space-y-4" id="chapter-list-top">

            {/* Controls Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search chapter number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-muted/50"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                <div className="text-sm text-muted">
                    Showing <span className="text-white font-bold">{currentChapters.length}</span> of <span className="text-white font-bold">{filteredChapters.length}</span> chapters
                </div>
            </div>

            {/* VIP Banner */}
            {hasLockedChapters && (
                <Link href="/vip-upgrade" className="block p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 hover:border-yellow-500/40 transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-500 group-hover:scale-110 transition-transform">
                            <Crown className="w-5 h-5 fill-current" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm group-hover:text-yellow-400 transition-colors">Contains VIP Chapters</h4>
                            <p className="text-xs text-muted">Get instant access to the latest releases without waiting.</p>
                        </div>
                        <div className="text-xs font-bold text-yellow-500 flex items-center gap-1 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20 group-hover:bg-yellow-500/20">
                            Upgrade <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                </Link>
            )}

            {/* List */}
            <div className="space-y-3">
                {currentChapters.length > 0 ? (
                    currentChapters.map((chapter) => {
                        const isLocked = !hasAccess(chapter);

                        // If locked, disable link interaction
                        const LinkComponent: any = isLocked ? 'div' : Link;
                        const linkProps = isLocked ? {} : { href: `/read/${mangaSlug}/${chapter.slug}` };

                        return (
                            <LinkComponent
                                key={chapter.id}
                                {...linkProps}
                                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                                    ${isLocked
                                        ? "bg-white/5 border-white/5 cursor-not-allowed opacity-75"
                                        : "bg-card border-border hover:border-accent/50 hover:bg-surface/50 hover:shadow-sm cursor-pointer"
                                    }
                                `}
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-base font-medium transition-colors line-clamp-1
                                            ${isLocked ? "text-muted-foreground" : "group-hover:text-accent"}
                                        `}>
                                            {chapter.title}
                                        </span>
                                        {chapter.is_vip_only && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                {isLocked ? <Lock className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                                VIP
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            <span className="capitalize">{formatDistanceToNow(new Date(chapter.createdAt), { addSuffix: true })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Eye className="w-3 h-3" />
                                            <span>{chapter.view_count ? new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(chapter.view_count) : 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {isLocked ? (
                                        <span className="text-xs font-semibold text-muted-foreground/50 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                            Locked
                                        </span>
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground group-hover:text-accent transition-colors bg-surface px-3 py-1 rounded-full border border-border group-hover:border-accent/20">
                                                Read
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </div>
                            </LinkComponent>
                        );
                    })
                ) : (
                    <div className="text-center py-12 text-muted">
                        No chapters found matching "{searchQuery}"
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-white/5">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-white/10 text-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, idx) => (
                            page === "..." ? (
                                <span key={`ellipsis-${idx}`} className="px-3 py-1 text-muted text-sm">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page as number)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                                        ${currentPage === page
                                            ? "bg-accent text-white shadow-lg shadow-accent/20"
                                            : "hover:bg-white/10 text-muted hover:text-white"
                                        }
                                    `}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-white/10 text-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
