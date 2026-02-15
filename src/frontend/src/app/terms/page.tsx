import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="pt-24 px-6 max-w-[1280px] mx-auto mb-12 border-b border-white/5 pb-8">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-4 mb-4 text-white">
                    <FileText className="w-10 h-10 md:w-14 md:h-14 text-accent" /> Terms of Service
                </h1>
                <p className="text-muted text-lg md:pl-[4.5rem] opacity-80 max-w-2xl">
                    Please read these terms carefully before using our services.
                </p>
            </div>

            {/* Content Section */}
            <div className="px-6 max-w-[900px] mx-auto space-y-12 text-gray-300 leading-relaxed text-base md:text-lg">

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        1. Acceptance of Terms
                    </h2>
                    <p>
                        By accessing and using <strong>SiTruyen</strong> (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        2. Description of Service
                    </h2>
                    <p>
                        SiTruyen provides users with access to a rich collection of manga resources. You understand and agree that the Service is provided "AS-IS" and that SiTruyen assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        3. User Conduct
                    </h2>
                    <p>
                        You agree to not use the Service to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                        <li>Upload, post, email, transmit or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, or otherwise objectionable.</li>
                        <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a user or entity.</li>
                        <li>Violate any applicable local, state, national or international law.</li>
                        <li>Engage in any activity that interferes with or disrupts the Service.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        4. Intellectual Property
                    </h2>
                    <p>
                        SiTruyen respects the intellectual property of others, and we ask our users to do the same. The content available on the site is for personal, non-commercial use only. All rights, titles, and interests not expressly granted are reserved.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        5. Termination
                    </h2>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        6. Changes to Terms
                    </h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>
                </section>

                <section className="space-y-4 pb-12">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        7. Contact Us
                    </h2>
                    <p>
                        If you have any questions about these Terms, please contact us at <a href="mailto:terms@sitruyen.com" className="text-accent hover:underline">terms@sitruyen.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
