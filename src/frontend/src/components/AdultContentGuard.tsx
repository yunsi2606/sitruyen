"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function AdultContentGuard({ mangaTitle }: { mangaTitle: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
        setIsLoading(true);
        Cookies.set("is_adult_confirmed", "true", { expires: 30 });
        // Refresh the server component to read the new cookie
        router.refresh();
    };

    const handleDecline = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full pointer-events-none w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>

            <div className="max-w-md w-full bg-surface/90 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-[0_0_20px_rgba(255,111,97,0.15)] relative">
                    18+
                    <div className="absolute inset-0 rounded-full border border-accent/30 animate-ping opacity-20 duration-1000"></div>
                </div>

                <h1 className="text-2xl font-black text-white mb-3">Age Restricted Content</h1>
                <p className="text-muted text-base mb-3 leading-relaxed">
                    The manga <strong className="text-white">"{mangaTitle}"</strong> contains mature themes and content not suitable for minors.
                </p>
                <p className="text-muted text-sm mb-8 bg-background p-4 rounded-xl border border-white/5 leading-relaxed">
                    By clicking "I am 18+", you confirm that you are at least 18 years of age and consent to viewing adult material.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="w-full py-4 px-4 rounded-xl bg-accent text-white text-lg font-bold hover:bg-accent/90 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,111,97,0.25)] hover:shadow-[0_4px_25px_rgba(255,111,97,0.4)] disabled:opacity-50 flex items-center justify-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "I am 18+"
                        )}
                    </button>
                    <button
                        onClick={handleDecline}
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-transparent border border-white/10 text-muted font-medium hover:bg-white/5 hover:text-white active:scale-[0.98] transition-all"
                    >
                        Cancel & Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
