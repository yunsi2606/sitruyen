"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    locationContext?: string; // Optional context like "Chapter 10" or "Manga ABC"
}

export function ReportModal({ isOpen, onClose, locationContext }: ReportModalProps) {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [type, setType] = useState("image_broken");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent scrolling and Handle Escape key
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.key === "Esc") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Check auth token if available (client side)
            let token = "";
            const match = document.cookie.match(new RegExp('(^| )user=([^;]+)'));
            if (match) {
                try {
                    const userData = JSON.parse(decodeURIComponent(match[2]));
                    if (userData && userData.jwt) {
                        token = userData.jwt;
                    }
                } catch (e) {
                    console.error("Failed to parse user cookie", e);
                }
            }

            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetchAPI("/reports", {}, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    data: {
                        title: `Report: [${type}] - ${locationContext || "User Feedback"}`,
                        type,
                        description,
                        location_url: window.location.href,
                        contact_email: email,
                    }
                })
            });

            if (res.error) throw new Error(res.error.message || "Failed to submit report");

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setDescription("");
                setEmail("");
                setType("image_broken");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to submit report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-accent" />
                        Report Issue / Feedback
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5 text-muted hover:text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-2xl text-green-500">✓</span>
                            </div>
                            <h4 className="text-xl font-bold text-white">Report Submitted!</h4>
                            <p className="text-sm text-muted">Thank you for your feedback. We will check it soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Type */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Issue Type</label>
                                <div className="relative">
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-red-500/50 outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors"
                                    >
                                        <option value="image_broken">Broken Image / Not Loading</option>
                                        <option value="wrong_content">Wrong Content / Chapter</option>
                                        <option value="translation_issue">Translation Error / Typos</option>
                                        <option value="website_bug">UI / Feature Bug</option>
                                        <option value="vip_issue">VIP Account Issue</option>
                                        <option value="other">Other Feedback</option>
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none">
                                        <span className="text-muted text-xs">▼</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Description <span className="text-red-400">*</span></label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please describe the issue you encountered..."
                                    required
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/50 focus:border-red-500/50 outline-none resize-none hover:border-white/20 transition-colors"
                                />
                            </div>

                            {/* Email (Optional) */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-300">Contact Email (Optional)</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="For admin to contact you (if needed)"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted/50 focus:border-red-500/50 outline-none hover:border-white/20 transition-colors"
                                />
                            </div>

                            {/* Error Msg */}
                            {error && (
                                <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                                    {error}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-muted hover:bg-white/5 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </span>
                                    ) : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
