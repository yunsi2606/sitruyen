"use client";

import { Crown, Check, QrCode, Clock, ArrowRight, CheckCircle2, XCircle, Loader2, Shield, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { auth } from "@/lib/auth";
import { vipOrderService } from "@/services/api";

// Plan Config
const PLANS = [
    {
        id: "1month",
        label: "1 Month",
        price: 49000,
        priceLabel: "49,000đ",
        perDay: "~1,600đ/day",
        popular: false,
    },
    {
        id: "3months",
        label: "3 Months",
        price: 129000,
        priceLabel: "129,000đ",
        perDay: "~1,430đ/day",
        popular: true,
        badge: "Most Popular",
    },
    {
        id: "6months",
        label: "6 Months",
        price: 229000,
        priceLabel: "229,000đ",
        perDay: "~1,270đ/day",
        popular: false,
        badge: "Best Value",
    },
];

// Page States
type PageState = "select" | "payment" | "success" | "error";

interface OrderData {
    order_code: string;
    amount: number;
    duration_days: number;
    note: string;
}

interface BankData {
    bank_id: string;
    account_number: string;
    account_name: string;
    amount: number;
    content: string;
    qr_url: string;
}

export default function VipUpgradePage() {
    const [pageState, setPageState] = useState<PageState>("select");
    const [selectedPlan, setSelectedPlan] = useState<string>("3months");
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [bankData, setBankData] = useState<BankData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [countdown, setCountdown] = useState(1800); // 30 min
    const [copied, setCopied] = useState(false);
    const pollRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    const user = auth.getUser();
    const token = auth.getToken();

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    // Format VND
    const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

    // Copy to clipboard
    const copyText = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    // Create Order
    const handlePurchase = async () => {
        if (!token || !user) {
            setError("Vui lòng đăng nhập trước khi mua VIP.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await vipOrderService.createOrder(selectedPlan, token);
            setOrderData(res.order);
            setBankData(res.bank);
            setPageState("payment");
            setCountdown(1800);

            // Start polling every 5 seconds
            pollRef.current = setInterval(async () => {
                try {
                    const status = await vipOrderService.checkStatus(res.order.order_code);
                    if (status.status === "paid") {
                        clearInterval(pollRef.current!);
                        clearInterval(countdownRef.current!);
                        setPageState("success");

                        // Refresh user data in cookie
                        const updatedUser = { ...user, plan: "vip" };
                        document.cookie = `user=${JSON.stringify(updatedUser)};path=/;SameSite=Lax;max-age=${30 * 24 * 60 * 60}`;

                        // Auto reload after 3s so entire site reflects VIP status
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 3000);
                    } else if (status.status === "expired" || status.status === "cancelled") {
                        clearInterval(pollRef.current!);
                        clearInterval(countdownRef.current!);
                        setError("Đơn hàng đã hết hạn. Vui lòng thử lại.");
                        setPageState("select");
                    }
                } catch (e) {
                    // Polling errors are silent
                }
            }, 5000);

            // Start countdown
            countdownRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownRef.current!);
                        clearInterval(pollRef.current!);
                        setError("Đơn hàng đã hết hạn. Vui lòng thử lại.");
                        setPageState("select");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Format countdown
    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    // RENDER: Success State
    if (pageState === "success") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
                <div className="max-w-md w-full text-center space-y-6 animate-in fade-in-up duration-500">
                    <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center ring-2 ring-green-500/20">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white">Upgrade Successful!</h1>
                    <p className="text-muted text-lg">
                        You are now a VIP member. Enjoy unlimited reading experience!
                    </p>
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                        <p className="text-green-500 font-semibold text-sm">
                            Plan: {orderData?.note} • Code: {orderData?.order_code}
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:shadow-yellow-500/20 hover:-translate-y-1 transition-all"
                    >
                        <Crown className="w-5 h-5 fill-current" />
                        Start Reading
                    </Link>
                    <p className="text-xs text-muted animate-pulse">Redirecting in 3 seconds...</p>
                </div>
            </div>
        );
    }

    // RENDER: Payment State (QR + Bank info)
    if (pageState === "payment" && orderData && bankData) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 bg-background flex flex-col items-center">
                <div className="max-w-lg w-full space-y-6 animate-in fade-in-up duration-500">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-bold uppercase tracking-wider">
                            <QrCode className="w-3.5 h-3.5" />
                            Bank Transfer
                        </div>
                        <h1 className="text-2xl font-extrabold text-white">Scan QR to Pay</h1>
                        <p className="text-sm text-muted">
                            After transfer, system will auto-confirm within <strong className="text-white">10 seconds</strong>.
                        </p>
                    </div>

                    {/* QR Code Card */}
                    <div className="relative bg-white rounded-2xl p-6 flex flex-col items-center shadow-2xl">
                        <Image
                            src={bankData.qr_url}
                            alt="Payment QR Code"
                            width={280}
                            height={280}
                            className="rounded-lg"
                            unoptimized
                        />
                        <p className="mt-3 text-xs text-gray-500 text-center">
                            Open Bank App → Scan QR → Confirm
                        </p>
                    </div>

                    {/* Bank Info */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Shield className="w-4 h-4 text-yellow-500" />
                            Transfer Details
                        </h3>

                        <div className="space-y-3">
                            <InfoRow label="Bank" value={bankData.bank_id} />
                            <InfoRow label="Account No." value={bankData.account_number} onCopy={() => copyText(bankData.account_number)} />
                            <InfoRow label="Account Name" value={bankData.account_name} />
                            <InfoRow label="Amount" value={formatVND(bankData.amount)} highlight />
                            <InfoRow label="Content (Memo)" value={bankData.content} onCopy={() => copyText(bankData.content)} highlight />
                        </div>

                        <div className="mt-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                            <p className="text-[11px] text-red-400 font-medium">
                                ⚠️ Please ensure <strong>exact transfer content (memo)</strong> for auto-confirmation. Do not change amount or content.
                            </p>
                        </div>
                    </div>

                    {/* Status Polling Indicator */}
                    <div className="bg-surface border border-white/5 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                                    <div className="absolute inset-0 w-5 h-5 rounded-full bg-yellow-500/20 animate-ping" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Waiting for payment...</p>
                                    <p className="text-[11px] text-muted">Auto-confirm when funds received</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted">
                                <Clock className="w-4 h-4" />
                                <span className={`text-sm font-mono font-bold ${countdown < 300 ? 'text-red-400' : 'text-white'}`}>
                                    {formatTime(countdown)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cancel */}
                    <button
                        onClick={() => {
                            if (pollRef.current) clearInterval(pollRef.current);
                            if (countdownRef.current) clearInterval(countdownRef.current);
                            setPageState("select");
                        }}
                        className="w-full text-center text-sm text-muted hover:text-white transition-colors py-2"
                    >
                        ← Back to Plans
                    </button>
                </div>

                {/* Copied toast */}
                {copied && (
                    <div className="fixed bottom-8 right-8 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg animate-in slide-in-from-bottom-2 z-50">
                        ✓ Copied
                    </div>
                )}
            </div>
        );
    }

    // RENDER: Plan Selection
    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-background flex flex-col items-center">
            {/* Hero */}
            <div className="text-center space-y-4 mb-12 animate-in fade-in-down duration-700">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold text-sm uppercase tracking-wider">
                    <Crown className="w-4 h-4" />
                    Premium Access
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    Upgrade to VIP
                </h1>
                <p className="text-lg text-muted max-w-xl mx-auto">
                    Read the latest chapters instantly, no waiting. Support translation teams and website development.
                </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full mb-12">
                {[
                    { icon: "⚡", label: "Instant Access" },
                    { icon: "🔓", label: "Unlock All VIP" },
                    { icon: "💎", label: "Exclusive Badge" },
                    { icon: "❤️", label: "Support Us" },
                ].map((b, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface border border-white/5 text-center">
                        <span className="text-2xl">{b.icon}</span>
                        <span className="text-xs font-medium text-muted">{b.label}</span>
                    </div>
                ))}
            </div>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl w-full mb-8">
                {PLANS.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                        <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 ${isSelected
                                ? "border-yellow-500 bg-yellow-500/5 shadow-lg shadow-yellow-500/10 scale-[1.02]"
                                : "border-white/10 bg-surface hover:border-white/20 hover:bg-surface/80"
                                }`}
                        >
                            {plan.badge && (
                                <span className={`absolute -top-3 left-4 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${plan.popular
                                    ? "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg"
                                    : "bg-white/10 text-muted border border-white/10"
                                    }`}>
                                    {plan.badge}
                                </span>
                            )}

                            <h3 className="text-lg font-bold text-white mb-1">{plan.label}</h3>
                            <p className="text-2xl font-extrabold text-yellow-500 mb-1">{plan.priceLabel}</p>
                            <p className="text-xs text-muted">{plan.perDay}</p>

                            {/* Radio indicator */}
                            <div className={`absolute top-6 right-6 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-yellow-500 bg-yellow-500" : "border-white/20"
                                }`}>
                                {isSelected && <Check className="w-3 h-3 text-black" />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Error */}
            {error && (
                <div className="max-w-3xl w-full mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {/* CTA */}
            <div className="max-w-3xl w-full space-y-3">
                {!user ? (
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all text-lg"
                    >
                        Login to Purchase VIP
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                ) : (
                    <button
                        onClick={handlePurchase}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Order...
                            </>
                        ) : (
                            <>
                                <Crown className="w-5 h-5 fill-current" />
                                Get VIP – {PLANS.find(p => p.id === selectedPlan)?.priceLabel}
                            </>
                        )}
                    </button>
                )}
                <p className="text-xs text-center text-muted">
                    Secure Bank Transfer • Auto-confirmation in 10s
                </p>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl w-full mt-16 space-y-4">
                <h2 className="text-xl font-bold text-white text-center mb-6">Frequently Asked Questions</h2>
                <FaqItem
                    q="How do I pay?"
                    a="After selecting a plan, a QR code will be generated. Open your banking app, scan the QR code to transfer. The system will auto-confirm within 10 seconds."
                />
                <FaqItem
                    q="I paid but VIP is not active?"
                    a="Please ensure you entered the exact transfer content (memo). If it's not active after 5 minutes, please contact admin via fanpage."
                />
                <FaqItem
                    q="What are VIP benefits?"
                    a="VIP members can read the latest chapters immediately upon release, no 7-day wait. Plus an exclusive VIP badge on your profile."
                />
                <FaqItem
                    q="Can I extend my VIP plan?"
                    a="Yes! If you buy another plan while your current one is active, the duration will be stacked automatically."
                />
            </div>
        </div>
    );
}

// Sub-components

function InfoRow({ label, value, highlight, onCopy }: { label: string; value: string; highlight?: boolean; onCopy?: () => void }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${highlight ? "text-yellow-500" : "text-white"}`}>{value}</span>
                {onCopy && (
                    <button onClick={onCopy} className="p-1 hover:bg-white/10 rounded transition-colors" title="Sao chép">
                        <Copy className="w-3.5 h-3.5 text-muted hover:text-white" />
                    </button>
                )}
            </div>
        </div>
    );
}

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-xl border border-white/5 bg-surface overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-sm font-semibold text-white">{q}</span>
                <span className={`text-muted transition-transform ${open ? "rotate-45" : ""}`}>+</span>
            </button>
            {open && (
                <div className="px-4 pb-4 text-sm text-muted animate-in fade-in slide-in-from-top-1 duration-200">
                    {a}
                </div>
            )}
        </div>
    );
}
