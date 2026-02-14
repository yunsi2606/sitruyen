import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
            {/* Left: Content/Form Section */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-12 relative z-10">
                <div className="w-full max-w-[420px] space-y-8">
                    {/* Back to Home */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors absolute top-8 left-8 lg:top-12 lg:left-12"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {/* Additional decorative element if needed, but keeping it clean */}
                    <div className="pt-12 lg:pt-0">
                        {children}
                    </div>

                    {/* Footer/Links */}
                    <div className="pt-6 text-center text-xs text-muted/60">
                        <p>
                            By continuing, you agree to our{" "}
                            <Link href="/terms" className="underline hover:text-white transition-colors">Terms of Service</Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Hero Image/Brand Section */}
            <div className="hidden lg:relative lg:flex flex-col items-center justify-center bg-surface border-l border-white/5 overflow-hidden">
                {/* Background Pattern/Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-background to-background z-0" />

                {/* Content */}
                <div className="relative z-10 text-center space-y-6 max-w-lg px-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-accent-2 shadow-2xl shadow-accent/20 mb-6 rotate-3 hover:rotate-6 transition-transform duration-500">
                        <span className="text-4xl font-black text-white">S</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Si<span className="text-accent">Truyen</span>
                    </h2>
                    <p className="text-lg text-muted md:text-xl font-light leading-relaxed">
                        Your ultimate destination for endless manga adventures. Join our community and start your journey today.
                    </p>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-2/5 rounded-full blur-3xl pointer-events-none" />
            </div>
        </div>
    );
}
