
export default function Loading() {
    return (
        <div className="w-full max-w-[1280px] mx-auto space-y-12 py-8 px-6 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
                {/* Cover Skeleton */}
                <div className="w-full md:w-[300px] flex-shrink-0 mx-auto md:mx-0 max-w-[300px]">
                    <div className="aspect-[3/4] rounded-2xl bg-white/5 ring-1 ring-white/10" />
                </div>

                {/* Info Skeleton */}
                <div className="flex-1 space-y-8 py-2 w-full">
                    <div className="space-y-4">
                        <div className="h-12 w-3/4 bg-white/10 rounded-lg" />
                        <div className="flex gap-3">
                            <div className="h-8 w-20 bg-white/5 rounded-full" />
                            <div className="h-8 w-24 bg-white/5 rounded-full" />
                            <div className="h-8 w-24 bg-white/5 rounded-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-white/5 rounded" />
                        <div className="h-4 w-full bg-white/5 rounded" />
                        <div className="h-4 w-2/3 bg-white/5 rounded" />
                    </div>
                    <div className="flex gap-4 pt-2">
                        <div className="h-14 w-40 bg-white/10 rounded-xl" />
                        <div className="h-14 w-40 bg-white/5 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Chapters Skeleton */}
            <div className="space-y-8 border-t border-white/10 pt-16">
                <div className="h-8 w-40 bg-white/10 rounded-lg" />
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-[400px]" />
            </div>
        </div>
    );
}
