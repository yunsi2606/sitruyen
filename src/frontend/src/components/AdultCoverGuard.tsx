"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

export function AdultCoverGuard({
    isAdultContent,
    children,
}: {
    isAdultContent?: boolean;
    children: React.ReactNode;
}) {
    const t = useTranslations("common");
    const [isVerified, setIsVerified] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (Cookies.get("is_adult_confirmed") === "true") {
            setIsVerified(true);
        }
    }, []);

    // If not adult content, render normally
    if (!isAdultContent) {
        return <>{children}</>;
    }

    // SSR or Initial Client Render of adult content without verification
    if (!isClient || !isVerified) {

        return (
            <>
                <div
                    className="relative w-full h-full cursor-pointer overflow-hidden rounded-[inherit] group/adult"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowModal(true);
                    }}
                >
                    <div className="w-full h-full blur-xl scale-110 pointer-events-none transition-all duration-500">
                        {children}
                    </div>
                    <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center p-4 transition-colors group-hover/adult:bg-black/50">
                        <div className="bg-surface/95 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/10 flex flex-col items-center gap-1 backdrop-blur-md shadow-lg pointer-events-none transform transition-transform group-hover/adult:scale-105">
                            <span className="text-accent text-base flex items-center gap-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                18+
                            </span>
                            <span className="text-[10px] text-muted uppercase tracking-wider">{t("audultWarning")}</span>
                        </div>
                    </div>
                </div>

                {showModal && isClient && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}>
                        <div className="bg-surface border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                            {/* Decorative blur blob */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 blur-3xl rounded-full pointer-events-none"></div>

                            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto mb-5 text-2xl font-black shadow-[0_0_15px_rgba(255,111,97,0.1)]">
                                18+
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 text-center">{t("audultWarning")}</h3>
                            <p className="text-muted text-sm mb-8 text-center leading-relaxed">
                                {t("audultWarningDescription")}
                            </p>
                            <div className="flex gap-3 relative z-10">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowModal(false);
                                    }}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-background border border-white/10 text-white font-medium hover:bg-white/5 active:scale-95 transition-all"
                                >
                                    {t("audultWarningButtonCancel")}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        Cookies.set("is_adult_confirmed", "true", { expires: 30 });
                                        setIsVerified(true);
                                        setShowModal(false);
                                    }}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 active:scale-95 transition-all shadow-[0_4px_14px_rgba(255,111,97,0.3)]"
                                >
                                    {t("audultWarningButton")}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </>
        );
    }

    return <>{children}</>;
}
