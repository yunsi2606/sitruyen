"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await auth.register(formData.username, formData.email, formData.password);
            if (res.success) {
                router.push("/");
                router.refresh();
            } else {
                setError(res.error || "Please check your details and try again.");
            }
        } catch (err) {
            setError("Unable to connect. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-white">
                    Create account
                </h1>
                <p className="text-muted text-lg">
                    Start your reading journey today. It's free!
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                {/* Username */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="username"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        placeholder="johndoe"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        autoCapitalize="none"
                        autoCorrect="off"
                        required
                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-white/20 text-white shadow-sm"
                    />
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="m@example.com"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        required
                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-white/20 text-white shadow-sm"
                    />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        autoCapitalize="none"
                        required
                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-white/20 text-white shadow-sm"
                    />
                </div>

                {error && (
                    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500 flex items-center justify-center font-medium animate-in fade-in zoom-in-95 duration-200">
                        {error}
                    </div>
                )}

                <button
                    className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                        "bg-accent text-white hover:bg-accent/90 h-12 px-8 py-2 w-full mt-4 shadow-lg shadow-accent/20 hover:shadow-accent/40 active:scale-[0.98]"
                    )}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-4 text-muted font-medium">
                        Or
                    </span>
                </div>
            </div>

            <p className="px-8 text-center text-sm text-muted">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="underline underline-offset-4 hover:text-accent font-semibold text-white transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
