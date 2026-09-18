'use client';

import Link from 'next/link';
import { MessageSquare, Share2, Bookmark } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import VoteBox from '@/components/feed/VoteBox';
import LinkPreviewCard from '@/components/feed/LinkPreviewCard';
import { formatTimeAgo } from '@/utils/formatTime';
import Image from 'next/image';

export default function PostCard({ post, onVote, isAboveFold = false }) {
if (!post) return null;

const {
    id,
    orbitName: rawOrbitName,
    title,
    type,
    bodyText,
    imageUrl,
    linkUrl,
    author,
    votesCount = post?.score ?? 0,
    userVote = 0,
    commentsCount = post?.commentCount ?? post?._count?.comments ?? 0,
    createdAt,
} = post;

// Fallback orbit name to prevent /r/undefined URLs
const orbitName = rawOrbitName || post?.orbit?.name || 'general';

return (
    <article className="bg-[--bg-surface] border border-[--border-subtle] rounded-2xl p-4 sm:p-5 hover:border-[--border-subtle]/80 transition-colors shadow-sm flex gap-4">
    {/* Left Vote Column */}
    <div className="shrink-0">
        <VoteBox
        score={votesCount}
        userVote={userVote}
        onVote={(direction) => onVote && onVote(id, direction)}
        />
    </div>

    {/* Main Post Body */}
    <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Post Metadata Header */}
        <div className="flex items-center justify-between text-xs text-[--text-secondary]">
        <div className="flex items-center gap-2 flex-wrap">
            <Link
            href={`/r/${orbitName}`}
            className="font-bold text-[--text-primary] hover:text-[--accent-warm] transition-colors"
            >
            r/{orbitName}
            </Link>
            <span>•</span>
            <div className="flex items-center gap-1.5">
            <Avatar src={author?.avatar} alt={author?.username} size="sm" />
            <Link
                href={`/profile/${author?.username || ''}`}
                className="hover:underline"
            >
                u/{author?.username || 'anonymous'}
            </Link>
            </div>
            <span>•</span>
            <span>{formatTimeAgo(createdAt)}</span>
        </div>
        </div>

        {/* Title */}
        <Link href={`/r/${orbitName}/post/${id}`}>
        <h2 className="text-base sm:text-lg font-bold text-[--text-primary] hover:text-[--accent-warm] transition-colors leading-snug">
            {title}
        </h2>
        </Link>

        {/* Content Types */}
        {type === 'text' && bodyText && (
        <p className="text-xs sm:text-sm text-[--text-secondary] line-clamp-3 leading-relaxed">
            {bodyText}
        </p>
        )}

        {type === 'image' && imageUrl && (
        <div className="relative rounded-xl overflow-hidden max-h-96 bg-black/5 mt-1">
            <Image
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            width={600}
            height={400}
            loading={isAboveFold ? 'eager' : 'lazy'}
            priority={isAboveFold}
            />
        </div>
        )}

        {type === 'link' && linkUrl && (
        <div className="mt-1">
            <LinkPreviewCard url={linkUrl} />
        </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex items-center gap-4 pt-1 text-xs font-medium text-[--text-secondary]">
        <Link
            href={`/r/${orbitName}/post/${id}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[--bg-surface-hover] hover:text-[--text-primary] transition-colors"
        >
            <MessageSquare className="w-4 h-4" />
            <span>{commentsCount} comments</span>
        </Link>

        <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[--bg-surface-hover] hover:text-[--text-primary] transition-colors"
        >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
        </button>

        <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[--bg-surface-hover] hover:text-[--text-primary] transition-colors"
        >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
        </button>
        </div>
    </div>
    </article>
);
}