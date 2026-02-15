import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="pt-24 px-6 max-w-[1280px] mx-auto mb-12 border-b border-white/5 pb-8">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-4 mb-4 text-white">
                    <ShieldCheck className="w-10 h-10 md:w-14 md:h-14 text-accent" /> Privacy Policy
                </h1>
                <p className="text-muted text-lg md:pl-[4.5rem] opacity-80 max-w-2xl">
                    We value your privacy. This policy explains how we collect, use, and protect your personal information.
                </p>
            </div>

            {/* Content Section */}
            <div className="px-6 max-w-[900px] mx-auto space-y-12 text-gray-300 leading-relaxed text-base md:text-lg">

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        1. Introduction
                    </h2>
                    <p>
                        Welcome to <strong>SiTruyen</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to our website and all related services (collectively, the "Service"). By accessing or using our Service, you agree to the terms of this Privacy Policy.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        2. Information We Collect
                    </h2>
                    <p>
                        We collect information that you provide securely to us. This may include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                        <li><strong>Personal Information:</strong> Name, email address, password, and other registration details.</li>
                        <li><strong>Usage Data:</strong> Information on how you interact with the Service, such as reading history, bookmarks, and preferences.</li>
                        <li><strong>Device Information:</strong> IP address, browser type, and operating system for security and analytics purposes.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        3. How We Use Your Information
                    </h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-accent">
                        <li>Provide, operate, and maintain our Service.</li>
                        <li>Sync your reading progress and bookmarks across devices.</li>
                        <li>Send you updates, security alerts, and support messages.</li>
                        <li>Monitor usage patterns to improve user experience and performance.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        4. Data Sharing and Security
                    </h2>
                    <p>
                        We do not sell your personal data to third parties. We assume no ownership of your data but process it to provide the Service. We implement appropriate technical security measures to protect your personal information against unauthorized access, alteration, or destruction. However, no method of transmission over the Internet is 100% secure.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        5. Cookies and Tracking
                    </h2>
                    <p>
                        We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                </section>

                <section className="space-y-4 pb-12">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                        6. Contact Us
                    </h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@sitruyen.com" className="text-accent hover:underline">support@sitruyen.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
