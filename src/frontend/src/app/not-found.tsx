import Link from "next/link";
import { Home, BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
    const t = await getTranslations("errors");
    const tc = await getTranslations("common");

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-in fade-in duration-500">
            {/* Large 404 */}
            <div className="relative mb-6">
                <h1 className="text-[120px] md:text-[180px] font-black text-white/[0.03] tracking-tighter leading-none select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-accent" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-white">
                        {t("pageNotFound")}
                    </p>
                </div>
            </div>

            <p className="text-muted text-lg max-w-md mb-8 leading-relaxed">
                {t("pageNotFoundDescription")}
            </p>

            <div className="flex gap-3">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
                >
                    <Home className="w-4 h-4" /> {tc("goHome")}
                </Link>
                <Link
                    href="/browse"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                    <BookOpen className="w-4 h-4" /> {tc("browseManga")}
                </Link>
            </div>
        </div>
    );
}
