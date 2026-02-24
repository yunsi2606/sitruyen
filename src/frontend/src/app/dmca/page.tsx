import { Scale } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DMCAPage() {
    const t = useTranslations("legal.dmca");

    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="pt-24 px-6 max-w-[1280px] mx-auto mb-12 border-b border-white/5 pb-8">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-4 mb-4 text-white">
                    <Scale className="w-10 h-10 md:w-14 md:h-14 text-accent" /> {t("title")}
                </h1>
                <p className="text-muted text-lg md:pl-[4.5rem] opacity-80 max-w-2xl">
                    {t("subtitle")}
                </p>
            </div>

            {/* Content Section */}
            <div className="px-6 max-w-[900px] mx-auto space-y-12 text-gray-300 leading-relaxed text-base md:text-lg">

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        {t("sections.s1.title")}
                    </h2>
                    <p>
                        {t.rich("sections.s1.content1", {
                            strong: (chunks) => <strong>{chunks}</strong>
                        })}
                    </p>
                    <p>
                        {t("sections.s1.content2")}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        {t("sections.s2.title")}
                    </h2>
                    <p>
                        {t("sections.s2.content")}
                    </p>
                    <ul className="list-disc pl-6 space-y-3 marker:text-accent border-l-2 border-white/10 ml-2 py-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <li key={i}>{t(`sections.s2.list.${i}`)}</li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        {t("sections.s3.title")}
                    </h2>
                    <p>
                        {t("sections.s3.content")}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                        {[0, 1, 2, 3].map((i) => (
                            <li key={i}>{t(`sections.s3.list.${i}`)}</li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        {t("sections.s4.title")}
                    </h2>
                    <p>
                        {t("sections.s4.content")}
                    </p>
                </section>

                <section className="space-y-4 pb-12">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        {t("sections.s5.title")}
                    </h2>
                    <p>
                        {t.rich("sections.s5.content", {
                            email: (chunks) => <a href="mailto:dmca@sitruyen.com" className="text-accent hover:underline">{chunks}</a>
                        })}
                    </p>
                </section>
            </div>
        </div>
    );
}
