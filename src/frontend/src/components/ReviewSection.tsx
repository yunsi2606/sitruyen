"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Star, Loader2, Send, MessageSquarePlus } from "lucide-react";
import { auth } from "@/lib/auth";
import { ratingService } from "@/services/api";
import { AvatarFrame } from "./AvatarFrame";

interface ReviewSectionProps {
    storyDocumentId: string;
    storyId: number;
}

/** Max reviews shown inline on the manga detail page */
const PREVIEW_LIMIT = 5;

export function ReviewSection({ storyDocumentId, storyId }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    const [currentUser, setCurrentUser] = useState<any>(null);
    const [myRating, setMyRating] = useState<any>(null);

    // Form state
    const [hoverScore, setHoverScore] = useState(0);
    const [selectedScore, setSelectedScore] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState("");

    // Init user
    useEffect(() => {
        const user = auth.getUser();
        setCurrentUser(user);
    }, []);

    // Fetch reviews for the story
    useEffect(() => {
        fetchReviews();
    }, [storyDocumentId]);

    // Fetch current user's existing rating
    useEffect(() => {
        if (currentUser && storyId) {
            const token = auth.getToken();
            if (token) {
                ratingService.getMyRating(storyId, currentUser.id, token).then((existing) => {
                    if (existing) {
                        setMyRating(existing);
                        setSelectedScore(existing.score || 0);
                        setReviewText(existing.review || "");
                    }
                });
            }
        }
    }, [currentUser, storyId]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await ratingService.getStoryRatings(storyDocumentId, 1, PREVIEW_LIMIT);
            setReviews(res.data || []);
            setTotalReviews(res.meta?.pagination?.total || 0);
        } catch (err) {
            console.error("Failed to load reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedScore === 0) {
            setError("Please select a star rating.");
            return;
        }

        setSubmitting(true);
        setError("");
        setSubmitSuccess(false);

        try {
            const token = auth.getToken();
            if (!token) throw new Error("Not authenticated");

            await ratingService.upsertRating(
                storyDocumentId,
                selectedScore,
                reviewText.trim() || null,
                token
            );

            setSubmitSuccess(true);
            setMyRating({ score: selectedScore, review: reviewText.trim() });

            // Refresh the review list
            setTimeout(() => {
                fetchReviews();
                setSubmitSuccess(false);
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    // Compute display average from loaded reviews (approximation for preview)
    const avgScore = reviews.length > 0
        ? (reviews.reduce((sum: number, r: any) => sum + (r.score || 0), 0) / reviews.length)
        : 0;

    return (
        <div className="w-full space-y-8 bg-surface/30 rounded-3xl p-6 md:p-8 border border-white/5 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    Reviews
                    <span className="text-sm font-normal text-muted ml-2">({totalReviews})</span>
                </h3>
                {avgScore > 0 && (
                    <div className="flex items-center gap-2 text-yellow-500">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-4 h-4 ${s <= Math.round(avgScore) ? "fill-current" : "text-white/20"}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-white">{avgScore.toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* Rating Form */}
            {currentUser ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted">
                            {myRating ? "Update your rating:" : "Your rating:"}
                        </span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverScore(star)}
                                    onMouseLeave={() => setHoverScore(0)}
                                    onClick={() => setSelectedScore(star)}
                                    className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
                                >
                                    <Star
                                        className={`w-7 h-7 transition-colors duration-150 ${
                                            star <= (hoverScore || selectedScore)
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-white/20"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {selectedScore > 0 && (
                            <span className="text-xs text-yellow-500 font-medium">
                                {selectedScore}/5
                            </span>
                        )}
                    </div>

                    <div className="bg-background border border-white/10 rounded-xl focus-within:ring-1 focus-within:ring-accent transition-all">
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your review (optional, max 500 characters)..."
                            maxLength={500}
                            className="w-full bg-transparent p-4 text-sm text-white focus:outline-none min-h-[80px] resize-y placeholder:text-muted/50"
                        />
                        <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 bg-white/[0.02]">
                            <span className="text-xs text-muted">{reviewText.length}/500</span>
                        </div>
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}
                    {submitSuccess && (
                        <p className="text-xs text-green-400 animate-in fade-in">
                            ✓ {myRating ? "Review updated!" : "Review submitted!"} Rating is being recalculated.
                        </p>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || selectedScore === 0}
                            className="px-6 py-2 bg-accent text-white font-bold rounded-xl text-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-accent/20"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            {myRating ? "Update Review" : "Submit Review"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10 border-dashed">
                    <p className="text-muted mb-4">Log in to leave a review and rate this story.</p>
                    <Link
                        href="/login"
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                        Log In / Register
                    </Link>
                </div>
            )}

            {/* Review List */}
            <div className="space-y-5 mt-6">
                {loading ? (
                    <div className="text-center py-8 text-muted animate-pulse">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8 text-muted">
                        <MessageSquarePlus className="w-8 h-8 mx-auto mb-3 text-white/10" />
                        No reviews yet. Be the first to review!
                    </div>
                ) : (
                    reviews.map((review) => (
                        <ReviewItem key={review.id || review.documentId} review={review} />
                    ))
                )}
            </div>

            {/* "See All" link if more reviews exist */}
            {totalReviews > PREVIEW_LIMIT && (
                <div className="text-center pt-2">
                    <Link
                        href={`/manga/${storyDocumentId}/reviews`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                        View all {totalReviews} reviews →
                    </Link>
                </div>
            )}
        </div>
    );
}

function ReviewItem({ review }: { review: any }) {
    const userObj = review.user;
    const displayName =
        (typeof userObj === "object" ? userObj?.username : null) || "Anonymous";
    const avatarFrame = userObj?.avatar_frame || "default";
    const nameColor = userObj?.name_color || "#ffffff";

    return (
        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex-shrink-0 pt-1">
                <AvatarFrame username={displayName} frame={avatarFrame} size={40} />
            </div>
            <div className="flex-1 space-y-1.5">
                <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold text-sm" style={{ color: nameColor }}>
                        {displayName}
                    </span>

                    {/* Star score */}
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`w-3 h-3 ${
                                    s <= (review.score || 0)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-white/15"
                                }`}
                            />
                        ))}
                    </div>

                    <span className="text-xs text-muted/60">
                        •{" "}
                        {review.createdAt
                            ? formatDistanceToNow(new Date(review.createdAt), {
                                  addSuffix: true,
                              })
                            : "Just now"}
                    </span>
                </div>

                {review.review && (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {review.review}
                    </p>
                )}
            </div>
        </div>
    );
}
