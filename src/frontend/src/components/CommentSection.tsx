"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Reply, Send, Loader2, Smile, X } from "lucide-react";
import { auth } from "@/lib/auth";
import { commentService, storyService, chapterService, stickerService, Comment } from "@/services/api";
import { StickerPicker } from "./StickerPicker";
import { StickerDisplay } from "./StickerDisplay";

interface CommentSectionProps {
    storyId: number;
    chapterId?: number;
}

export function CommentSection({ storyId, chapterId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Sticker State
    const [stickerPacks, setStickerPacks] = useState<any[]>([]);
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const [selectedSticker, setSelectedSticker] = useState<any>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Context IDs
    const [storyDocumentId, setStoryDocumentId] = useState<string | null>(null);
    const [chapterDocumentId, setChapterDocumentId] = useState<string | null>(null);
    const isChapterView = !!chapterId;

    useEffect(() => {
        const fetchContextIds = async () => {
            if (storyId) setStoryDocumentId(await storyService.getStoryDocumentId(storyId));
            if (chapterId) setChapterDocumentId(await chapterService.getChapterDocumentId(chapterId));
        };
        fetchContextIds();
    }, [storyId, chapterId]);

    useEffect(() => {
        const user = auth.getUser();
        setCurrentUser(user);

        const token = auth.getToken();
        if (token) {
            stickerService.getStickerPacks(token).then(data => {
                if (data && data.length > 0) setStickerPacks(data);
            });
        }
    }, []);

    useEffect(() => {
        fetchComments();
    }, [storyId, chapterId]);

    // Click outside to close picker
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowStickerPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const token = auth.getToken();
            const data = await commentService.getComments(storyId, chapterId, 100, token);
            setComments(data);
        } catch (err) {
            setError("Failed to load comments.");
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        // Allow posting if text OR sticker is present
        if (!newComment.trim() && !selectedSticker) return;
        if (!currentUser) return;

        setSubmitting(true);
        setError("");

        try {
            const token = auth.getToken();
            if (!token) throw new Error("Login required");
            if (!storyDocumentId) throw new Error("Story context missing");

            const payload: any = {
                data: {
                    content: newComment, // Can be empty string if sticker is present
                    story: { connect: [{ documentId: storyDocumentId }] },
                    user: { connect: [{ id: currentUser.id }] }
                }
            };

            if (chapterDocumentId) payload.data.chapter = { connect: [{ documentId: chapterDocumentId }] };
            if (replyTo) {
                const parentComment = comments.find(c => c.id === replyTo);
                const parentDocId = (parentComment as any)?.documentId;
                if (parentDocId) payload.data.parent = { connect: [{ documentId: parentDocId }] };
            }

            // Sticker Relation
            if (selectedSticker) {
                if (selectedSticker.documentId) {
                    payload.data.sticker = { connect: [{ documentId: selectedSticker.documentId }] };
                } else {
                    payload.data.sticker = { connect: [{ id: selectedSticker.id }] };
                }
            }

            const res = await commentService.createComment(payload, token);

            if (res.data) {
                setNewComment("");
                setSelectedSticker(null);
                setReplyTo(null);
                fetchComments();
            } else {
                throw new Error(res.error?.message || "Failed to post");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    const rootComments = comments.filter(c => !(c as any).parent?.data && !(c as any).parent?.id); // Robust check

    // Recursive render helper or simple 1-level
    const getReplies = (parentId: number) => comments.filter(c => {
        const pId = (c as any).parent?.data?.id || (c as any).parent?.id;
        return pId === parentId;
    }).sort((a: any, b: any) => new Date(a.createdAt).getTime() - b.createdAt);

    return (
        <div className="w-full space-y-8 bg-surface/30 rounded-3xl p-6 md:p-8 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    Discussion <span className="text-sm font-normal text-muted ml-2">({comments.length})</span>
                </h3>
            </div>

            {currentUser ? (
                <form onSubmit={handlePostComment} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold uppercase">
                        {currentUser.username?.[0] || "U"}
                    </div>
                    <div className="flex-1 space-y-3 relative">
                        {replyTo && (
                            <div className="text-xs text-muted flex items-center gap-2 bg-white/5 p-2 rounded-lg w-fit">
                                Replying to #{replyTo}
                                <button type="button" onClick={() => setReplyTo(null)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                            </div>
                        )}

                        <div className="relative bg-background border border-white/10 rounded-xl focus-within:ring-1 focus-within:ring-accent transition-all">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Join the discussion..."
                                className="w-full bg-transparent p-4 text-sm text-white focus:outline-none min-h-[80px] resize-y placeholder:text-muted/50"
                            />

                            {/* Toolbar */}
                            <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 bg-white/[0.02]">
                                <div className="relative" ref={pickerRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowStickerPicker(!showStickerPicker)}
                                        className={`p-2 rounded-lg transition-colors ${showStickerPicker || selectedSticker ? 'text-accent bg-accent/10' : 'text-muted hover:text-white hover:bg-white/5'}`}
                                    >
                                        <Smile className="w-5 h-5" />
                                    </button>

                                    {/* Sticker Picker Popover */}
                                    {showStickerPicker && (
                                        <div className="absolute bottom-12 left-0 z-50">
                                            <StickerPicker
                                                packs={stickerPacks}
                                                onSelect={(sticker) => {
                                                    setSelectedSticker(sticker);
                                                    setShowStickerPicker(false);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-muted">{newComment.length} chars</div>
                            </div>
                        </div>

                        {/* Selected Sticker Preview */}
                        {selectedSticker && (
                            <div className="relative inline-block border border-accent/30 rounded-lg p-2 bg-accent/5">
                                <StickerDisplay sticker={selectedSticker} size={80} autoplay={true} />
                                <button
                                    type="button"
                                    onClick={() => setSelectedSticker(null)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {error && <p className="text-xs text-red-500">{error}</p>}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || (!newComment.trim() && !selectedSticker)}
                                className="px-6 py-2 bg-accent text-white font-bold rounded-xl text-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-accent/20"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Post
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10 border-dashed">
                    <p className="text-muted mb-4">Please log in to join the discussion.</p>
                    <Link href="/login" className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors">Log In / Register</Link>
                </div>
            )}

            <div className="space-y-6 mt-8">
                {loading ? <div className="text-center py-12 text-muted animate-pulse">Loading comments...</div> :
                    rootComments.length === 0 ? <div className="text-center py-12 text-muted">No comments yet.</div> :
                        rootComments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                replies={getReplies(comment.id)}
                                onReply={setReplyTo}
                                currentUser={currentUser}
                                isMangaView={!isChapterView}
                            />
                        ))}
            </div>
        </div>
    );
}

function CommentItem({ comment, replies, onReply, currentUser, isMangaView }: { comment: any, replies: any[], onReply: (id: number) => void, currentUser: any, isMangaView: boolean }) {
    const attributes = comment;
    const userObj = attributes.user;
    const displayName = (typeof userObj === 'object' ? userObj?.username : null) || "Anonymous";

    const chapter = attributes.chapter;
    const story = attributes.story;

    // Sticker (flat object from Strapi v5)
    const sticker = attributes.sticker?.file?.url ? attributes.sticker : null;

    const chapterLink = (story?.slug && chapter?.slug)
        ? `/read/${story.slug}/${chapter.slug}`
        : (chapter?.slug ? `/read/${chapter.slug}` : "#");

    return (
        <div className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex-shrink-0 w-10 h-10 bg-surface border border-white/10 rounded-full flex items-center justify-center text-muted font-bold text-sm uppercase overflow-hidden">
                {displayName[0]}
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{displayName}</span>

                    {/* Chapter Tag - Only show on Manga View if chapter exists */}
                    {chapter && isMangaView && (
                        <Link href={chapterLink} className="px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-[10px] text-accent font-medium hover:bg-accent/20 transition-colors">
                            Chapter {chapter.chapter_number !== undefined ? chapter.chapter_number : "#"}
                        </Link>
                    )}

                    <span className="text-xs text-muted/60">• {attributes.createdAt ? formatDistanceToNow(new Date(attributes.createdAt), { addSuffix: true }) : "Just now"}</span>
                </div>

                {attributes.content && (
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{attributes.content}</div>
                )}

                {/* Render Sticker */}
                {sticker && (
                    <div className="mt-2">
                        <StickerDisplay sticker={sticker} size={100} autoplay={false} />
                    </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                    <button onClick={() => onReply(comment.id)} className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-white transition-colors">
                        <Reply className="w-3.5 h-3.5" /> Reply
                    </button>
                </div>

                {replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-white/5 space-y-4">
                        {replies.map(reply => (
                            <CommentItem key={reply.id} comment={reply} replies={[]} onReply={onReply} currentUser={currentUser} isMangaView={isMangaView} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
