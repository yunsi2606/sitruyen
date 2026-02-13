
import Link from "next/link";

const FooterSkeleton = () => (
    <footer className="w-full bg-[#0f0f0f] pt-16 pb-8 border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div className="space-y-6">
                    <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
                    <div className="flex gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />)}
                    </div>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-3">
                        <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
                        <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    </footer>
);

export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen bg-[#141414] text-foreground font-sans">
            <div className="w-full max-w-[1280px] mx-auto px-6 py-12 space-y-12">
                <div className="w-full h-[420px] bg-white/5 rounded-3xl animate-pulse ring-1 ring-white/10" />
                <div className="w-full h-[300px] bg-white/5 rounded-2xl animate-pulse ring-1 ring-white/10" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
            <FooterSkeleton />
        </div>
    );
}
