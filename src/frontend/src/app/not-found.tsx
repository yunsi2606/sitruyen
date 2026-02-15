import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { NotFoundAnimation } from "@/components/NotFoundAnimation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Page Not Found | SiTruyen",
    description: "The page you are looking for does not exist.",
};

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-2xl w-full relative z-10 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">

                {/* Lottie Animation Container */}
                <div className="w-full flex justify-center py-4">
                    <NotFoundAnimation />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                        Page Not Found
                    </h1>
                    <p className="text-lg md:text-xl text-muted max-w-lg mx-auto leading-relaxed">
                        Oops! It seems you've ventured into unrelated territory. The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:bg-accent/90 hover:shadow-accent/30 hover:-translate-y-1 transition-all duration-300 group"
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Go Home
                    </Link>


                    <Link
                        href="/browse"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-surface border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Browse Manga
                    </Link>
                </div>

            </div>

            <div className="absolute bottom-8 text-xs text-muted/40">
                &copy; SiTruyen 2026. All rights reserved.
            </div>
        </div>
    );
}
