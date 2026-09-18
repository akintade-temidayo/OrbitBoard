'use client';

import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, ChevronDown, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import CommentForm from './CommentForm';
import { formatTimeAgo } from '@/utils/formatTime';

export default function CommentItem({ comment, onAddReply, onDelete, currentUser, depth = 0 }) {
const [isCollapsed, setIsCollapsed] = useState(false);
const [isReplying, setIsReplying] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [votes, setVotes] = useState(comment?.upvotes || 0);
const [userVote, setUserVote] = useState(null);

// Extract author name and avatar safely handling string or object structures
const authorName =
    typeof comment?.author === 'object'
    ? comment.author?.username || 'anonymous'
    : comment?.author || 'anonymous';

const authorAvatar =
    typeof comment?.author === 'object'
    ? comment.author?.avatarUrl
    : comment?.authorAvatar;

const isCommentOwner =
    (currentUser?.id && typeof comment?.author === 'object' && comment.author?.id === currentUser.id) ||
    (currentUser?.username && authorName === currentUser.username);

const handleVote = (direction) => {
    if (userVote === direction) {
    setUserVote(null);
    setVotes((prev) => (direction === 'up' ? prev - 1 : prev + 1));
    } else {
    const diff = userVote ? 2 : 1;
    setVotes((prev) => (direction === 'up' ? prev + diff : prev - diff));
    setUserVote(direction);
    }
};

const handleReplySubmit = (text) => {
    if (onAddReply) {
    onAddReply(comment.id, text);
    }
    setIsReplying(false);
};

const indentClass = depth > 0 ? 'ml-2 sm:ml-5 pl-2 sm:pl-4 border-l-2 border-[--border-subtle]' : '';

return (
    <div className={`flex flex-col gap-2 ${indentClass} transition-all`}>
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[--bg-surface] border border-[--border-subtle]/50 hover:border-[--border-subtle] transition-colors">
        
        {/* Comment Header */}
        <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
            <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[--text-secondary] hover:text-[--text-primary] p-0.5 rounded transition-colors"
            >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <Avatar src={authorAvatar} alt={authorName} size="sm" />
            <span className="font-bold text-[--text-primary] text-xs sm:text-sm">
            u/{authorName}
            </span>
            <span className="text-[--text-secondary]">•</span>
            <span className="text-[--text-secondary] text-[10px] sm:text-xs">
            {formatTimeAgo(comment?.createdAt) || '1h ago'}
            </span>
        </div>

        <div className="relative">
            <button
                type="button"
                aria-label={isCommentOwner ? 'Comment options' : 'More comment options'}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="text-[--text-secondary] hover:text-[--text-primary] p-1 transition-colors"
            >
                <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {isMenuOpen && isCommentOwner && (
            <div className="absolute right-0 top-full z-10 mt-1 min-w-32 rounded-xl border border-[--border-subtle] bg-[--bg-surface] p-1 shadow-lg">
                <button
                type="button"
                onClick={() => {
                    setIsMenuOpen(false);
                    onDelete?.(comment.id);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
            </div>
            )}
        </div>
        </div>

        {/* Collapsed State Summary */}
        {isCollapsed ? (
        <p className="text-xs text-[--text-secondary] italic pl-6">
            Comment collapsed ({comment?.replies?.length || 0} replies hidden)
        </p>
        ) : (
        <>
            <p className="text-xs sm:text-sm text-[--text-primary] leading-relaxed pl-1 sm:pl-6">
            {comment?.content}
            </p>

            {/* Comment Actions */}
            <div className="flex items-center gap-3 pl-1 sm:pl-6 text-xs text-[--text-secondary] pt-1">
            {/* Vote controls */}
            <div className="flex items-center bg-[--bg-surface-hover] rounded-full border border-[--border-subtle] px-1 py-0.5">
                <button
                onClick={() => handleVote('up')}
                className={`p-1 rounded-full transition-colors ${
                    userVote === 'up' ? 'text-emerald-500' : 'hover:text-[--text-primary]'
                }`}
                >
                <ArrowBigUp className="w-4 h-4" />
                </button>
                <span
                className={`px-1.5 font-bold text-xs ${
                    userVote === 'up'
                    ? 'text-emerald-500'
                    : userVote === 'down'
                    ? 'text-red-500'
                    : 'text-[--text-primary]'
                }`}
                >
                {votes}
                </span>
                <button
                onClick={() => handleVote('down')}
                className={`p-1 rounded-full transition-colors ${
                    userVote === 'down' ? 'text-red-500' : 'hover:text-[--text-primary]'
                }`}
                >
                <ArrowBigDown className="w-4 h-4" />
                </button>
            </div>

            {/* Reply Button using UI Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="py-1 px-2.5 rounded-full text-xs flex items-center gap-1.5"
            >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reply</span>
            </Button>
            </div>
        </>
        )}
    </div>

    {/* Inline Reply Form */}
    {isReplying && !isCollapsed && (
        <div className="mt-1 pl-4 sm:pl-6">
        <CommentForm
            onSubmit={handleReplySubmit}
            user={currentUser}
            placeholder={`Replying to u/${authorName}...`}
            autoFocus
            onCancel={() => setIsReplying(false)}
            buttonText="Reply"
        />
        </div>
    )}

    {/* Nested Replies */}
    {!isCollapsed && comment?.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
        {comment.replies.map((reply) => (
            <CommentItem
            key={reply.id}
            comment={reply}
            onAddReply={onAddReply}
            onDelete={onDelete}
            currentUser={currentUser}
            depth={depth + 1}
            />
        ))}
        </div>
    )}
    </div>
);
}