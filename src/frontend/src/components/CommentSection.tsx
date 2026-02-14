"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Reply, Send, User, Loader2, MoreHorizontal, Trash2, Flag } from "lucide-react";
import { auth } from "@/lib/auth";
import { fetchAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

interface User {
    id: number;
    username: string;
    email: string;
}

interface Comment {
    id: number;
    attributes: {
        content: string;
        createdAt: string;
        updatedAt: string;
        user?: {
            data?: {
                id: number;
                attributes: {
                    username: string;
                }
            }
        };
        chapter?: {
            data?: {
                id: number;
                attributes: {
                    chapter_number: number; // or title/slug
                    title: string;
                    slug: string;
                }
            }
        };
        parent?: {
            data?: {
                id: number;
            }
        };
        children?: {
            data?: Comment[];
        }
    }
}

interface CommentSectionProps {
    storyId: number;
    chapterId?: number; // If present, we are in chapter reader. If absent, manga detail.
}

export function CommentSection({ storyId, chapterId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Identify if we are viewing the main story page or a specific chapter
    const [storyDocumentId, setStoryDocumentId] = useState<string | null>(null);
    const [chapterDocumentId, setChapterDocumentId] = useState<string | null>(null);

    // Identify if we are viewing the main story page or a specific chapter
    const isChapterView = !!chapterId;

    useEffect(() => {
        const fetchContextIds = async () => {
            try {
                if (storyId) {
                    const res = await fetchAPI(`/stories?filters[id][$eq]=${storyId}`);
                    if (res.data && res.data[0]) {
                        setStoryDocumentId(res.data[0].documentId);
                    }
                }
                if (chapterId) {
                    const res = await fetchAPI(`/chapters?filters[id][$eq]=${chapterId}`);
                    if (res.data && res.data[0]) {
                        setChapterDocumentId(res.data[0].documentId);
                    }
                }
            } catch (error) {
                // Silent error
            }
        };
        fetchContextIds();
    }, [storyId, chapterId]);

    useEffect(() => {
        // Check auth
        const user = auth.getUser();
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        // Fetch comments
        fetchComments();
    }, [storyId, chapterId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            // Fetch comments with all relations
            let query = `/comments?sort=createdAt:desc&populate[0]=user&populate[1]=chapter&populate[2]=parent`;

            if (isChapterView) {
                // Filter by chapter
                query += `&filters[chapter][id][$eq]=${chapterId}`;
            } else {
                // Filter by story
                query += `&filters[story][id][$eq]=${storyId}`;
            }

            // Pagination limit
            query += `&pagination[limit]=100`;

            const res = await fetchAPI(query);
            if (res.data) {
                setComments(res.data);
            }
        } catch (err) {
            setError("Failed to load comments.");
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!currentUser) return;

        setSubmitting(true);
        setError("");

        try {
            const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
            const authToken = tokenCookie ? tokenCookie.split('=')[1] : null;

            if (!authToken) {
                setError("You must be logged in to comment.");
                setSubmitting(false);
                return;
            }

            if (!storyDocumentId) {
                setError("Story information missing. Please refresh.");
                setSubmitting(false);
                return;
            }

            // Construct payload with relations
            const payload: any = {
                data: {
                    content: newComment,
                    story: { connect: [{ documentId: storyDocumentId }] },
                    user: { connect: [{ id: currentUser.id }] }
                }
            };

            // Chapter Relation
            if (chapterDocumentId) {
                payload.data.chapter = { connect: [{ documentId: chapterDocumentId }] };
            }

            // Parent Comment (Reply) Relation
            if (replyTo) {
                const parentComment = comments.find(c => c.id === replyTo);
                const parentDocId = (parentComment as any)?.documentId;

                if (parentDocId) {
                    payload.data.parent = { connect: [{ documentId: parentDocId }] };
                }
            }

            const res = await fetchAPI('/comments', {}, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload)
            });

            if (res.data) {
                setNewComment("");
                setReplyTo(null);
                fetchComments();
            } else {
                const msg = res.error?.message || res.error?.details?.errors?.[0]?.message || "Failed to post comment.";
                // Specific hint for "Invalid key user"
                if (msg.includes("Invalid key") && msg.includes("user")) {
                    setError("Server rejected 'user' field. Check backend permissions.");
                } else {
                    setError(msg);
                }
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    // Filter root comments and replies
    const getParentId = (c: any) => c.parent?.id || c.parent?.data?.id || c.attributes?.parent?.data?.id;
    const getCreatedAt = (c: any) => c.createdAt || c.attributes?.createdAt;

    const rootComments = comments.filter(c => !getParentId(c));

    const getReplies = (parentId: number) => {
        return comments.filter(c => getParentId(c) === parentId).sort((a: any, b: any) =>
            new Date(getCreatedAt(a)).getTime() - new Date(getCreatedAt(b)).getTime()
        );
    };

    return (
        <div className="w-full space-y-8 bg-surface/30 rounded-3xl p-6 md:p-8 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    Discussion
                    <span className="text-sm font-normal text-muted ml-2">({comments.length})</span>
                </h3>
            </div>

            {/* Comment Form */}
            {currentUser ? (
                <form onSubmit={handlePostComment} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold uppercase">
                        {currentUser.username?.[0] || "U"}
                    </div>
                    <div className="flex-1 space-y-3">
                        {replyTo && (
                            <div className="text-xs text-muted flex items-center gap-2 bg-white/5 p-2 rounded-lg w-fit">
                                Replying to comment #{replyTo}
                                <button type="button" onClick={() => setReplyTo(null)} className="text-white hover:text-red-400 font-bold">✕</button>
                            </div>
                        )}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={replyTo ? "Write a reply..." : "Join the discussion..."}
                            className="w-full bg-background border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent min-h-[100px] resize-y placeholder:text-muted/50"
                            required
                        />
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-accent text-white font-bold rounded-xl text-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Post Comment
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10 border-dashed">
                    <p className="text-muted mb-4">Please log in to join the discussion.</p>
                    <Link href="/login" className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors">
                        Log In / Register
                    </Link>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6 mt-8">
                {loading ? (
                    <div className="text-center py-12 text-muted animate-pulse">Loading comments...</div>
                ) : rootComments.length === 0 ? (
                    <div className="text-center py-12 text-muted">No comments yet. Be the first to share your thoughts!</div>
                ) : (
                    rootComments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            replies={getReplies(comment.id)}
                            onReply={(id) => setReplyTo(id)}
                            currentUser={currentUser}
                            isMangaView={!isChapterView}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function CommentItem({ comment, replies, onReply, currentUser, isMangaView }: {
    comment: any,
    replies: any[],
    onReply: (id: number) => void,
    currentUser: any,
    isMangaView: boolean
}) {
    // Data extractors with fallback
    const attributes = comment.attributes || comment;

    let userObj = attributes.user?.data?.attributes || attributes.user;
    // If user is just an ID (number) or missing, we can't display name
    if (typeof userObj === 'number' || !userObj) {
        userObj = null;
    }

    const chapter = attributes.chapter?.data?.attributes || attributes.chapter;
    const content = attributes.content;
    const createdAt = attributes.createdAt;

    const dateStr = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "Just now";

    // Display name logic
    const displayName = userObj?.username || userObj?.email?.split('@')[0] || "Anonymous";

    return (
        <div className="flex gap-4 group">
            <div className="flex-shrink-0 w-10 h-10 bg-surface border border-white/10 rounded-full flex items-center justify-center text-muted font-bold text-sm uppercase overflow-hidden">
                {displayName?.[0] || "?"}
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{displayName}</span>
                    {chapter && isMangaView && (
                        <Link href={`/read/${chapter.slug}`} className="px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-[10px] text-accent font-medium hover:bg-accent/20 transition-colors">
                            Chapter {chapter.chapter_number || "#"}
                        </Link>
                    )}
                    <span className="text-xs text-muted/60">• {dateStr}</span>
                </div>

                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {content}
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        onClick={() => onReply(comment.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-white transition-colors"
                    >
                        <Reply className="w-3.5 h-3.5" /> Reply
                    </button>
                    {/* Add Like/Dislike later */}
                </div>

                {/* Replies */}
                {replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-white/5 space-y-4">
                        {replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                replies={[]} // Deep nesting check needed if we support > 2 levels
                                onReply={onReply}
                                currentUser={currentUser}
                                isMangaView={isMangaView}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
