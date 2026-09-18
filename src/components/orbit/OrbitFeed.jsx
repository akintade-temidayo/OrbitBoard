'use client';

import PostCard from '@/components/feed/postCard';
import Button from '@/components/ui/Button';

export default function OrbitFeed({ posts, onVote, onOpenDrawer, orbitName }) {
return (
    <div className="flex-1 flex flex-col gap-4">
    {/* Posts List */}
    {posts.length > 0 ? (
        posts.map((post, index) => (
        <PostCard
            key={post.id}
            post={{ ...post, orbitName: post.orbitName || orbitName }}
            onVote={onVote}
            isAboveFold={index === 0}
        />
        ))
    ) : (
        <div className="text-center py-12 px-4 rounded-2xl bg-[--bg-surface] border border-[--border-subtle]">
        <p className="text-sm text-[--text-secondary]">
            No posts in r/{orbitName} yet. Be the first to share something!
        </p>
        <Button
            variant="primary"
            size="sm"
            onClick={onOpenDrawer}
            className="mt-4 rounded-xl text-xs"
        >
            Create First Post
        </Button>
        </div>
    )}
    </div>
);
}
