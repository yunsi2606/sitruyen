"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { User, Mail, Calendar, Clock, Edit2, LogOut, ShieldCheck, History, Star, Palette, Check, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { historyService, userLevelService } from "@/services/api";
import { getStrapiMedia } from "@/lib/api";
import { AvatarFrame } from "@/components/AvatarFrame";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [recentHistory, setRecentHistory] = useState<any[]>([]);

    // Level System State
    const [levelData, setLevelData] = useState<any>(null);
    const [cosmetics, setCosmetics] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"history" | "cosmetics">("history");
    const [savingCosmetic, setSavingCosmetic] = useState(false);

    useEffect(() => {
        // Double check auth even though middleware handles it
        const currentUser = auth.getUser();
        if (!currentUser) {
            router.push("/login");
            return;
        }
        setUser(currentUser);

        const fetchData = async () => {
            const token = auth.getToken();
            if (currentUser && token) {
                try {
                    // Parallel Fetch
                    const [histData, lvlData, cosResult] = await Promise.all([
                        historyService.getHistory(currentUser.id, token, 1, 5),
                        userLevelService.getMyLevel(token),
                        userLevelService.getMyCosmetics(token)
                    ]);

                    setRecentHistory(histData);
                    setLevelData(lvlData);
                    setCosmetics(cosResult);
                } catch (err) {
                    console.error("Failed to fetch profile data", err);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [router]);

    const handleClaimDaily = async () => {
        const token = auth.getToken();
        if (!token) return;
        try {
            const res = await userLevelService.claimDaily(token);
            if (res) {
                // Refresh Level Data
                const newLevelData = await userLevelService.getMyLevel(token);
                setLevelData(newLevelData);
                alert(res.alreadyClaimed ? "You already claimed today!" : `Claimed! +${res.expGained} EXP`);
            }
        } catch (err) {
            console.error("Claim failed", err);
        }
    };

    const handleEquip = async (type: "frame" | "nameColor", value: string) => {
        setSavingCosmetic(true);
        const token = auth.getToken();
        if (!token) return;

        try {
            const payload = type === "frame" ? { frame: value } : { nameColor: value };
            const res = await userLevelService.updateCosmetics(token, payload.frame, payload.nameColor);

            if (res.data && res.data.success) {
                // Update local state
                setCosmetics((prev: any) => ({
                    ...prev,
                    equipped: res.data.equipped
                }));
                // Also update levelData to reflect immediate changes in header
                setLevelData((prev: any) => ({
                    ...prev,
                    avatarFrame: res.data.equipped.frame,
                    frameImage: res.data.equipped.frameImage,
                    nameColor: res.data.equipped.nameColor
                }));
            }
        } catch (err) {
            console.error("Equip failed", err);
        } finally {
            setSavingCosmetic(false);
        }
    };

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
            <div className="relative mb-32">
                {/* Banner */}
                <div className="h-48 md:h-64 w-full rounded-3xl overflow-hidden bg-gradient-to-r from-accent/20 to-accent-2/20 border border-white/5 relative">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                </div>

                {/* Profile Card Overlay */}
                <div className="absolute -bottom-24 left-6 md:left-12 flex flex-col md:flex-row md:items-end gap-6 w-full max-w-4xl">
                    {/* Avatar Area */}
                    <div className="relative group flex-shrink-0">
                        <AvatarFrame
                            username={user.username}
                            frame={levelData?.avatarFrame || "default"}
                            size={160} // Large size for profile
                            className="drop-shadow-2xl"
                        />
                    </div>

                    <div className="mb-4 space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-white tracking-tight"
                                style={{ color: levelData?.nameColor || "#ffffff" }}
                            >
                                {user.username}
                            </h1>
                            {levelData?.badge && (
                                <span className="px-2 py-0.5 bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase rounded tracking-wider">
                                    {levelData.badge}
                                </span>
                            )}
                        </div>

                        <p className="text-muted flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" /> {user.email}
                        </p>

                        {/* Level Progress */}
                        {levelData && (
                            <div className="w-full max-w-md mt-4 space-y-1.5 bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-md">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                                    <span className="text-accent">Level {levelData.level}</span>
                                    <span className="text-muted">{levelData.exp} / {levelData.nextLevelExp || "MAX"} EXP</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-accent to-purple-500 transition-all duration-1000 ease-out"
                                        style={{ width: `${levelData.progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-[10px] text-muted capitalize">{levelData.title}</span>
                                    {/* Daily Check-in Button */}
                                    <button
                                        onClick={handleClaimDaily}
                                        disabled={levelData.dailyClaimed}
                                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1
                                            ${levelData.dailyClaimed
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20 cursor-default'
                                                : 'bg-accent/10 text-accent border-accent/20 hover:bg-accent hover:text-white animate-pulse'
                                            }`}
                                    >
                                        {levelData.dailyClaimed ? <Check className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                                        {levelData.dailyClaimed ? "Daily Claimed" : "Claim Daily (+20 EXP)"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 md:-bottom-12 md:right-0 flex items-center gap-3">
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

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 border-b border-white/5 mb-8">
                <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "history" ? "border-accent text-white" : "border-transparent text-muted hover:text-white"}`}
                >
                    <History className="w-4 h-4" /> Reading History
                </button>
                <button
                    onClick={() => setActiveTab("cosmetics")}
                    className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "cosmetics" ? "border-accent text-white" : "border-transparent text-muted hover:text-white"}`}
                >
                    <Palette className="w-4 h-4" /> Cosmetics & Rewards
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Sidebar: Stats & Info */}
                <div className="lg:col-span-4 space-y-6 h-fit sticky top-24">
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
                                <span className="text-sm text-muted">Title</span>
                                <span className="text-sm font-medium text-white italic">
                                    {levelData?.title || "Novice"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-white/5">
                                <span className="text-sm text-muted">EXP Multiplier</span>
                                <span className="text-sm font-medium text-accent">1.0x</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-8 space-y-8">

                    {activeTab === "history" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-xl font-bold text-white hidden">Recent History</h2>
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
                                <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center space-y-4">
                                    <Clock className="w-12 h-12 text-muted mx-auto" />
                                    <p className="text-muted">No reading history yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "cosmetics" && cosmetics && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Frame Selector */}
                            <div className="bg-surface border border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-accent" /> Avatar Frames
                                </h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                                    {cosmetics.unlocked.map((item: any) => {
                                        const isEquipped = cosmetics.equipped.frame === item.frame;
                                        return (
                                            <button
                                                key={item.frame}
                                                onClick={() => handleEquip("frame", item.frame)}
                                                disabled={savingCosmetic}
                                                className={`relative flex flex-col items-center gap-3 group p-2 rounded-xl transition-all ${isEquipped ? "bg-accent/10 border border-accent" : "bg-white/5 border border-white/5 hover:border-accent/50"}`}
                                            >
                                                <div className="relative">
                                                    <AvatarFrame
                                                        username={user.username}
                                                        frame={item.frame}
                                                        size={64}
                                                    />
                                                    {isEquipped && (
                                                        <div className="absolute -top-1 -right-1 bg-green-500 text-black p-0.5 rounded-full z-30">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs font-bold text-white capitalize">{item.title}</div>
                                                    <div className="text-[10px] text-muted">Lvl {item.level}</div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Name Color Selector */}
                            <div className="bg-surface border border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Palette className="w-5 h-5 text-accent" /> Name Colors
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {cosmetics.unlocked.filter((i: any) => i.nameColor).map((item: any) => {
                                        const isEquipped = cosmetics.equipped.nameColor === item.nameColor;
                                        return (
                                            <button
                                                key={item.level}
                                                onClick={() => handleEquip("nameColor", item.nameColor)}
                                                disabled={savingCosmetic}
                                                className={`group flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${isEquipped ? "border-accent bg-accent/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-full border border-white/20 shadow-sm"
                                                    style={{ backgroundColor: item.nameColor }}
                                                />
                                                <div className="text-left">
                                                    <div className="text-xs font-bold capitalize" style={{ color: item.nameColor }}>{item.title} Red</div>
                                                    <div className="text-[10px] text-muted">Lvl {item.level}</div>
                                                </div>
                                                {isEquipped && <Check className="w-4 h-4 text-green-500 ml-2" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
