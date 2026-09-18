'use client';

import { useState, useEffect, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Plus } from 'lucide-react';

import { postService } from '@/services/postService';
import { commentService } from '@/services/commentService';

import PostCard from '@/components/feed/postCard';
import CommentForm from '@/components/comments/CommentForm';
import CommentThread from '@/components/comments/CommentThread';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function PostDetailPage({ params }) {
const resolvedParams = use(params);
const { orbitName, postId } = resolvedParams;
const { user } = useAuth();
const router = useRouter();

const [post, setPost] = useState(null);
const [comments, setComments] = useState([]);
const [loading, setLoading] = useState(true);
const [showCommentForm, setShowCommentForm] = useState(false);

useEffect(() => {
    async function fetchPostAndComments() {
    setLoading(true);
    try {
        const fetchedPost = await postService.getPostById(postId);
        if (!fetchedPost) {
        notFound();
        return;
        }
        setPost({ ...fetchedPost, orbitName: fetchedPost.orbit?.name || orbitName });

        const fetchedComments = await commentService.getCommentsByPostId(postId);
        setComments(fetchedComments || []);
    } catch (err) {
        console.error('Failed to load post details:', err);
    } finally {
        setLoading(false);
    }
    }

    if (postId) {
    fetchPostAndComments();
    }
}, [orbitName, postId]);

const handleVote = async (targetPostId, direction) => {
    try {
    const updatedPost = await postService.votePost(targetPostId, direction);
    setPost((prev) => (prev ? { ...prev, ...updatedPost } : prev));
    } catch (err) {
    console.error('Failed to vote on post:', err);
    }
};

const handleBack = () => {
    if (window.history.length > 1) {
    router.back();
    return;
    }

    router.replace(`/o/${orbitName}`);
};

const handleAddComment = async (content) => {
    try {
    const newComment = await commentService.createComment({
        postId,
        content,
        author: user,
    });
    setComments((prev) => [newComment, ...prev]);
    setPost((prev) => (prev ? { ...prev, _count: { ...prev._count, comments: (prev._count?.comments || 0) + 1 } } : prev));
    setShowCommentForm(false);
    } catch (err) {
    console.error('Failed to add comment:', err);
    }
};

const removeCommentFromTree = (commentList, commentId) =>
    commentList
    .filter((comment) => comment.id !== commentId)
    .map((comment) => ({
        ...comment,
        replies: comment.replies ? removeCommentFromTree(comment.replies, commentId) : comment.replies,
    }));

const handleDeleteComment = async (commentId) => {
    if (!user) return;

    try {
    const { deletedCount = 1 } = await commentService.deleteComment(commentId, user);
    setComments((prev) => removeCommentFromTree(prev, commentId));
    setPost((prev) => (
        prev ? { ...prev, _count: { ...prev._count, comments: Math.max((prev._count?.comments || 1) - deletedCount, 0) } } : prev
    ));
    } catch (err) {
    console.error('Failed to delete comment:', err);
    }
};

if (loading) {
    return (
    <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full flex flex-col gap-4 animate-pulse">
        <div className="h-10 w-24 bg-[--bg-surface] rounded-xl border border-[--border-subtle]" />
        <div className="h-64 w-full bg-[--bg-surface] rounded-2xl border border-[--border-subtle]" />
        <div className="h-32 w-full bg-[--bg-surface] rounded-2xl border border-[--border-subtle]" />
    </div>
    );
}

if (!post) return null;

return (
    <div className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full flex flex-col gap-6 pb-20 md:pb-6">
    {/* Navigation */}
    <div className="flex items-center justify-between">
        <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[--bg-surface] border border-[--border-subtle] text-xs font-semibold text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface-hover] transition-colors"
        >
        <ArrowLeft className="w-4 h-4" /> Back
        </button>
    </div>

    {/* Main Post Card */}
    <PostCard
        post={post}
        onVote={handleVote}
        isAboveFold={true}
        onCommentClick={() => setShowCommentForm((prev) => !prev)}
    />

    {/* Comments Header Bar */}
    <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[--text-primary] flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-[--accent-warm]" />
        Comments ({comments.length})
        </h2>

        {!showCommentForm && (
        <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCommentForm(true)}
            className="rounded-xl flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5"
        >
            <Plus className="w-3.5 h-3.5" />
            Add Comment
        </Button>
        )}
    </div>

    {/* Expandable Comment Input Form */}
    {showCommentForm && (
        <div className="p-4 rounded-2xl border border-[--border-subtle] bg-[--bg-surface] animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[--text-secondary]">
            New Comment
            </span>
            <button
            onClick={() => setShowCommentForm(false)}
            className="text-xs text-[--text-secondary] hover:text-[--text-primary]"
            >
            Cancel
            </button>
        </div>
        <CommentForm onSubmit={handleAddComment} postId={postId} user={user} />
        </div>
    )}

    {/* Comments Thread / Empty State */}
    {comments.length > 0 ? (
        <CommentThread comments={comments} postId={postId} currentUser={user} onDelete={handleDeleteComment} />
    ) : (
        <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-[--border-subtle] bg-[--bg-surface]">
        <p className="text-xs text-[--text-secondary]">
            No comments yet. Be the first to start the conversation!
        </p>
        </div>
    )}
    </div>
);
}