"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect, useTransition } from "react";
import { Globe } from "lucide-react";

const localeLabels: Record<string, { flag: string; label: string }> = {
    vi: { flag: "🇻🇳", label: "Tiếng Việt" },
    en: { flag: "🇬🇧", label: "English" },
};

export function LanguageSwitcher() {
    const locale = useLocale();
    const t = useTranslations("language");
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const switchLocale = (newLocale: string) => {
        document.cookie = `locale=${newLocale};path=/;max-age=${365 * 24 * 60 * 60}`;
        setOpen(false);
        startTransition(() => {
            window.location.reload();
        });
    };

    const current = localeLabels[locale] || localeLabels.vi;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 p-2 rounded-full hover:bg-white/10 text-muted hover:text-white transition-colors"
                title={t("switchLanguage")}
                aria-label={t("switchLanguage")}
            >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-medium">{current.flag}</span>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-[#1f1f1f] rounded-xl border border-white/10 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {Object.entries(localeLabels).map(([key, { flag, label }]) => (
                        <button
                            key={key}
                            onClick={() => switchLocale(key)}
                            disabled={isPending}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${locale === key
                                    ? "text-accent bg-accent/10 font-bold"
                                    : "text-muted hover:text-white hover:bg-white/5"
                                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <span className="text-base">{flag}</span>
                            <span>{label}</span>
                            {locale === key && (
                                <span className="ml-auto text-accent text-xs">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
