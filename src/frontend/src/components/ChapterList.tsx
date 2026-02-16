"use client";

import { Chapter, User } from "@/types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Clock, Eye, Lock, Sparkles, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";

interface ChapterListProps {
    chapters: Chapter[];
    mangaSlug: string;
}

export function ChapterList({ chapters, mangaSlug }: ChapterListProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user from cookie/local storage
        const fetchedUser = auth.getUser();
        setUser(fetchedUser);
        setLoading(false);
    }, []);

    // Helper: Check if user has access to VIP chapter
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

    if (loading) return null; // or skeleton

    const hasLockedChapters = chapters.some(c => !hasAccess(c));

    return (
        <div className="w-full space-y-3">
            {hasLockedChapters && (
                <Link href="/vip-upgrade" className="block mb-4 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 hover:border-yellow-500/40 transition-all group">
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

            {chapters.map((chapter) => {
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
                                : "bg-card border-border hover:border-primary/50 hover:bg-surface/50 hover:shadow-sm cursor-pointer"
                            }
                        `}
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-base font-medium transition-colors line-clamp-1
                                    ${isLocked ? "text-muted-foreground" : "group-hover:text-primary"}
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
                                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors bg-surface px-3 py-1 rounded-full border border-border group-hover:border-primary/20">
                                        Read
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </div>
                    </LinkComponent>
                );
            })}
        </div>
    );
}
