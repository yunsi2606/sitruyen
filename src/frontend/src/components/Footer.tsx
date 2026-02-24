"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations("footer");
    const tc = useTranslations("common");

    return (
        <footer className="bg-[#111] text-white pt-12 pb-6 border-t border-white/5">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <Link href="/" className="text-2xl font-extrabold tracking-tight">
                            Si<span className="text-accent">Truyen</span>
                        </Link>
                        <p className="text-sm text-muted mt-2 leading-relaxed">
                            {t("tagline")}
                        </p>
                    </div>

                    {/* Discover */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">{t("discover")}</h4>
                        <ul className="space-y-2 text-sm text-muted">
                            <li><Link href="/browse?sort=updatedAt:desc" className="hover:text-white transition-colors">{t("latestUpdates")}</Link></li>
                            <li><Link href="/browse?sort=view_count:desc" className="hover:text-white transition-colors">{t("mostPopular")}</Link></li>
                            <li><Link href="/browse?sort=createdAt:desc" className="hover:text-white transition-colors">{t("newArrivals")}</Link></li>
                            <li><Link href="/browse?status=Completed" className="hover:text-white transition-colors">{t("completedSeries")}</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">{t("account")}</h4>
                        <ul className="space-y-2 text-sm text-muted">
                            <li><Link href="/login" className="hover:text-white transition-colors">{t("signInRegister")}</Link></li>
                            <li><Link href="/history" className="hover:text-white transition-colors">{t("readingHistory")}</Link></li>
                        </ul>
                    </div>

                    {/* Stay Updated */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">{t("stayUpdated")}</h4>
                        <form className="flex gap-2 mt-2" onSubmit={e => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder={t("enterEmail")}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-accent text-white placeholder-muted"
                            />
                            <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors">
                                {t("subscribe")}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
                    <p>{t("copyright")}</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">{tc("privacyPolicy")}</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{tc("termsOfService")}</Link>
                        <Link href="/dmca" className="hover:text-white transition-colors">{tc("dmca")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
