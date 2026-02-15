import { Scale } from "lucide-react";

export default function DMCAPage() {
    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="pt-24 px-6 max-w-[1280px] mx-auto mb-12 border-b border-white/5 pb-8">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-4 mb-4 text-white">
                    <Scale className="w-10 h-10 md:w-14 md:h-14 text-accent" /> DMCA Copyright
                </h1>
                <p className="text-muted text-lg md:pl-[4.5rem] opacity-80 max-w-2xl">
                    Digital Millennium Copyright Act Notification Guidelines.
                </p>
            </div>

            {/* Content Section */}
            <div className="px-6 max-w-[900px] mx-auto space-y-12 text-gray-300 leading-relaxed text-base md:text-lg">

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        1. DMCA Notice
                    </h2>
                    <p>
                        <strong>SiTruyen</strong> respects the intellectual property rights of others. We comply with the Digital Millennium Copyright Act (DMCA) and other applicable copyright laws. It is our policy to respond to any infringement notices and take appropriate actions under the Digital Millennium Copyright Act and other applicable intellectual property laws.
                    </p>
                    <p>
                        If your copyrighted material has been posted on SiTruyen or if links to your copyrighted material are returned through our search engine and you want this material removed, you must provide a written communication that details the information listed in the following section.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        2. Takedown Procedure
                    </h2>
                    <p>
                        To file a DMCA copyright infringement notification, please send us a written notice containing the following information:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 marker:text-accent border-l-2 border-white/10 ml-2 py-2">
                        <li>Physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                        <li>Identification of the copyrighted work claimed to have been infringed.</li>
                        <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed.</li>
                        <li>Information reasonably sufficient to permit us to contact the complaining party, such as an address, telephone number, and, if available, an electronic mail address.</li>
                        <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        3. Counter-Notification
                    </h2>
                    <p>
                        If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your content, you may send a counter-notice containing the following information to our Copyright Agent:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                        <li>Your physical or electronic signature.</li>
                        <li>Identification of the content that has been removed or to which access has been disabled.</li>
                        <li>Your statement that you have a good faith belief that the content was removed as a result of mistake or a misidentification of the content.</li>
                        <li>Your name, address, telephone number, and e-mail address.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        4. Disclaimer
                    </h2>
                    <p>
                        Please be aware that if you knowingly misrepresent that material or activity on the Website is infringing your copyright, you may be held liable for damages (including costs and attorneys' fees) under Section 512(f) of the DMCA.
                    </p>
                </section>

                <section className="space-y-4 pb-12">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        5. Contact for DMCA
                    </h2>
                    <p>
                        Please send all infringement notices to our designated agent at <a href="mailto:dmca@sitruyen.com" className="text-accent hover:underline">dmca@sitruyen.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
