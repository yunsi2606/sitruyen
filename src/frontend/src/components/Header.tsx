"use client";

import { useTheme } from "next-themes";
import Link from 'next/link';
import { Search, Bell, Sun, Moon, User, Menu, ChevronDown, List, Clock, Zap, Star, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";

export function Header() {
    const { theme, setTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [genres, setGenres] = useState<any[]>([]);

    useEffect(() => {
        // Fetch User and Genres
        const initData = async () => {
            const currentUser = auth.getUser();
            setUser(currentUser);

            try {
                const res = await fetchAPI('/categories?sort=name:asc&pagination[limit]=16');
                if (res.data) setGenres(res.data);
            } catch (err) {
                console.error("Failed to load header genres", err);
            }
        };
        initData();
    }, []);

    return (
        <header className="sticky top-0 z-50 h-[72px] bg-[rgba(31,31,31,0.95)] backdrop-blur-sm shadow-sm border-b border-white/5 box-border">
            <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-full">

                {/* Left: Brand + Nav */}
                <div className="flex items-center gap-10">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
                        <span className="text-3xl font-extrabold tracking-tight text-white group-hover:text-accent transition-colors duration-200">
                            Si<span className="text-accent">Truyen</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted hover:text-white transition-colors">
                        <Link href="/" className="hover:text-accent focus:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded px-2 py-1 transition-colors">Home</Link>
                        <Link href="/browse?sort=updatedAt:desc" className="hover:text-accent focus:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded px-2 py-1 transition-colors">Latest</Link>
                        <Link href="/browse?sort=view_count:desc" className="hover:text-accent focus:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded px-2 py-1 transition-colors">Popular</Link>

                        {/* Mega Dropdown Trigger */}
                        <div className="relative group/genres">
                            <button
                                aria-haspopup="true"
                                className="flex items-center gap-1 hover:text-accent focus:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded px-2 py-1 transition-colors"
                            >
                                Genres
                                <ChevronDown className="w-4 h-4 transition-transform group-hover/genres:rotate-180" />
                            </button>

                            {/* Accessible Mega Dropdown Panel */}
                            <div className="invisible opacity-0 translate-y-2 group-hover/genres:visible group-hover/genres:opacity-100 group-hover/genres:translate-y-0 transition-all duration-200 ease-out absolute left-0 top-full mt-2 w-[900px] bg-surface rounded-2xl border border-white/10 shadow-2xl p-6 z-50 grid grid-cols-12 gap-6 bg-[#1f1f1f]">

                                {/* Left: Genre Tiles */}
                                <div className="col-span-8">
                                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <List className="w-4 h-4 text-accent" /> Popular Genres
                                    </h4>
                                    <div className="grid grid-cols-4 gap-3">
                                        {genres.slice(0, 16).map((genre: any) => (
                                            <Link
                                                key={genre.id}
                                                href={`/browse?genre=${genre.attributes?.slug || genre.slug}`}
                                                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-accent/10 hover:text-accent text-sm text-center transition-colors border border-transparent hover:border-accent/20 focus:ring-2 focus:ring-accent focus:outline-none truncate"
                                            >
                                                {genre.attributes?.name || genre.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/10 text-center">
                                        <Link href="/browse" className="text-xs font-semibold text-accent hover:underline">View All Genres →</Link>
                                    </div>
                                </div>

                                /* Middle: Quick Lists */
                                <div className="col-span-4 space-y-6 border-l border-white/10 pl-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-yellow-400" /> Quick Access
                                        </h4>
                                        <ul className="space-y-2 text-sm text-muted">
                                            <li><Link href="/browse?sort=view_count:desc&from=week" className="hover:text-white transition-colors flex items-center justify-between group">Top this week <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></Link></li>
                                            <li><Link href="/browse?sort=createdAt:desc" className="hover:text-white transition-colors flex items-center justify-between group">New Releases <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></Link></li>
                                            <li><Link href="/browse?status=Completed" className="hover:text-white transition-colors flex items-center justify-between group">Completed Series <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></Link></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-3">Featured</h4>
                                        <div className="bg-gradient-to-br from-accent/20 to-accent-2/20 p-4 rounded-xl text-center">
                                            <p className="text-xs text-white font-medium mb-2">Solo Leveling: Ragnarok</p>
                                            <button className="w-full text-xs bg-accent text-white py-1.5 rounded-lg font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">Read Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {/* Expandable Search Input (Skeleton for layout) */}
                    <div className="relative hidden md:flex items-center bg-white/5 rounded-full border border-white/10 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all w-64 h-10 px-4">
                        <Search className="w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="Search manga, author..."
                            className="bg-transparent border-none outline-none text-sm text-white placeholder-muted w-full ml-2 h-full"
                        />
                    </div>

                    {/* Theme Toggle */}
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-white/10 text-muted hover:text-white transition-colors">
                        <Sun className="w-5 h-5 hidden dark:block" />
                        <Moon className="w-5 h-5 block dark:hidden" />
                    </button>

                    {/* Auth / Avatar */}
                    <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                        <button className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-white/10 relative text-muted hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-surface animate-pulse"></span>
                        </button>

                        {user ? (
                            <div className="relative group/user">
                                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 px-4 transition-all">
                                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                        {user.username?.[0] || "U"}
                                    </div>
                                    <span className="text-sm font-medium text-white hidden sm:block max-w-[100px] truncate">
                                        {user.username}
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-muted" />
                                </button>

                                {/* User Dropdown */}
                                <div className="invisible opacity-0 translate-y-2 group-hover/user:visible group-hover/user:opacity-100 group-hover/user:translate-y-0 transition-all duration-200 ease-out absolute right-0 top-full mt-2 w-48 bg-[#1f1f1f] rounded-xl border border-white/10 shadow-xl py-2 z-50">
                                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                                        <p className="text-sm font-medium text-white truncate">{user.username}</p>
                                        <p className="text-xs text-muted truncate">{user.email}</p>
                                    </div>

                                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors">
                                        <User className="w-4 h-4" /> Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            auth.logout();
                                            setUser(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-left"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 px-4 transition-all group">
                                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                                    <User className="w-3 h-3" />
                                </div>
                                <span className="text-sm font-medium text-white hidden sm:block">Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <button className="lg:hidden p-2 text-white" aria-label="Open menu">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
