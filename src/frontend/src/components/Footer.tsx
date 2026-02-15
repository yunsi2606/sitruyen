import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-[#0f0f0f] pt-16 pb-8 border-t border-white/5">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-black tracking-tighter text-white">
                            Si<span className="text-accent">Truyen</span>
                        </Link>
                        <p className="text-muted text-sm leading-relaxed max-w-xs">
                            The ultimate destination for manga and webtoon lovers. Read high-quality scans for free, updated daily.
                        </p>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white/5 hover:bg-accent transition-colors cursor-pointer" />)}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Discover</h4>
                        <ul className="space-y-3 text-sm text-muted">
                            <li><Link href="/browse?sort=updatedAt:desc" className="hover:text-accent transition-colors">Latest Updates</Link></li>
                            <li><Link href="/browse?sort=view_count:desc" className="hover:text-accent transition-colors">Most Popular</Link></li>
                            <li><Link href="/browse?sort=createdAt:desc" className="hover:text-accent transition-colors">New Arrivals</Link></li>
                            <li><Link href="/browse?status=Completed" className="hover:text-accent transition-colors">Completed Series</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Account</h4>
                        <ul className="space-y-3 text-sm text-muted">
                            <li><Link href="/login" className="hover:text-accent transition-colors">Sign In / Register</Link></li>
                            <li><Link href="/library" className="hover:text-accent transition-colors">My Library</Link></li>
                            <li><Link href="/history" className="hover:text-accent transition-colors">Reading History</Link></li>
                            <li><Link href="/settings" className="hover:text-accent transition-colors">Settings</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <form className="space-y-3">
                            <input type="email" placeholder="Enter your email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-accent outline-none transition-colors" />
                            <button className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-lg shadow-accent/20">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
                    <p>&copy; 2024 SiTruyen. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                        <Link href="/dmca" className="hover:text-white">DMCA</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
