"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { User, Mail, Calendar, Clock, Edit2, LogOut, ShieldCheck, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { historyService } from "@/services/api";
import { getStrapiMedia } from "@/lib/api";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [recentHistory, setRecentHistory] = useState<any[]>([]);

    useEffect(() => {
        // Double check auth even though middleware handles it
        const currentUser = auth.getUser();
        if (!currentUser) {
            router.push("/login");
            return;
        }
        setUser(currentUser);

        // Fetch History
        const fetchHistory = async () => {
            const token = auth.getToken();
            if (currentUser && token) {
                try {
                    const data = await historyService.getHistory(currentUser.id, token, 1, 5);
                    setRecentHistory(data);
                } catch (err) {
                    console.error("Failed to fetch history", err);
                }
            }
            setLoading(false);
        };

        fetchHistory();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/10" />
                    <div className="h-4 w-32 rounded bg-white/10" />
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-[1280px] mx-auto px-6 py-12 animate-in fade-in-up duration-500">
            {/* Header / Cover Area */}
            <div className="relative mb-24">
                {/* Banner */}
                <div className="h-48 md:h-64 w-full rounded-3xl overflow-hidden bg-gradient-to-r from-accent/20 to-accent-2/20 border border-white/5 relative">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                </div>

                {/* Profile Card Overlay */}
                <div className="absolute -bottom-16 left-6 md:left-12 flex items-end gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background bg-surface shadow-xl flex items-center justify-center overflow-hidden">
                            {/* Placeholder Avatar */}
                            <div className="w-full h-full bg-accent flex items-center justify-center text-4xl font-bold text-white uppercase">
                                {user.username?.[0] || "U"}
                            </div>
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-surface text-white rounded-full border border-white/10 hover:bg-white/10 transition-colors shadow-lg">
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="mb-4 space-y-1">
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">{user.username}</h1>
                        <p className="text-muted flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" /> {user.email}
                        </p>
                    </div>
                </div>

                {/* Action Buttons (Top Right of container, below banner) */}
                <div className="absolute -bottom-12 right-0 hidden md:flex items-center gap-3">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Security
                    </button>
                    <button
                        onClick={() => {
                            auth.logout();
                            router.push("/login");
                        }}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-sm font-medium text-red-500 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">

                {/* Left Sidebar: Stats & Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-accent" /> Account Info
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-white/5">
                                <span className="text-sm text-muted">Join Date</span>
                                <span className="text-sm font-medium text-white flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-white/5">
                                <span className="text-sm text-muted">Role</span>
                                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20 uppercase">
                                    Member
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-white/5">
                                <span className="text-sm text-muted">Status</span>
                                <span className="text-sm font-medium text-green-500 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content: Reading History / Lists */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Reading History Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <History className="w-5 h-5 text-accent" /> Recent History
                            </h2>
                            <Link href="/history" className="text-sm text-muted hover:text-white transition-colors">
                                View All
                            </Link>
                        </div>

                        {recentHistory.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {recentHistory.map((item) => {
                                    const story = item.story?.data?.attributes || item.story;
                                    if (!story) return null;
                                    const chapter = item.chapter?.data?.attributes || item.chapter;
                                    const coverUrl = getStrapiMedia(story.cover?.data?.attributes?.url || story.cover?.url);

                                    return (
                                        <div key={item.id} className="group flex gap-4 bg-surface border border-white/5 p-3 rounded-xl hover:border-accent/50 transition-all">
                                            <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/10">
                                                <Image
                                                    src={coverUrl || "https://placehold.co/100x150"}
                                                    alt={story.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center gap-1.5">
                                                <h4 className="font-bold text-white group-hover:text-accent transition-colors line-clamp-1">{story.title}</h4>
                                                <div className="text-sm text-muted flex items-center gap-3">
                                                    {chapter && (
                                                        <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white text-xs font-medium">
                                                            Ch. {chapter.chapter_number}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-muted/60 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {item.history_updated_at ? format(new Date(item.history_updated_at), 'MMM dd') : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            {chapter && (
                                                <Link
                                                    href={`/read/${story.slug}/${chapter.slug}`}
                                                    className="self-center px-4 py-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white rounded-lg text-sm font-bold transition-all shadow-sm"
                                                >
                                                    Read
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Placeholder Empty State */
                            <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-muted">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-white">No reading history yet</h3>
                                    <p className="text-muted text-sm mt-1">Start reading to track your progress automatically.</p>
                                </div>
                                <Link
                                    href="/"
                                    className="inline-block mt-4 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
                                >
                                    Explore Manga
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
