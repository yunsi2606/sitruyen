"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        alert("This feature is currently under maintenance. Please contact support.");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-white">
                    Forgot Password
                </h1>
                <p className="text-muted text-lg">
                    No worries. We'll help you get back in.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                {/* Email Field */}
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        required
                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-white/20 text-white shadow-sm"
                    />
                </div>

                {/* Submit Button */}
                <button
                    className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                        "bg-accent text-white hover:bg-accent/90 h-12 px-8 py-2 w-full shadow-lg shadow-accent/20 hover:shadow-accent/40 active:scale-[0.98]"
                    )}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>Send Reset Link <ArrowRight className="ml-2 w-4 h-4" /></>
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
                Remember your password?{" "}
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
