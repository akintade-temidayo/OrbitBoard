'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/feed/postCard';
import { postService } from '@/services/postService';

export default function HomeFeedPage({ activeTab = 'hot' }) {
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    async function loadPosts() {
    setLoading(true);
    try {
        const fetchedPosts = await postService.getPosts({ sortBy: activeTab });
        setPosts(fetchedPosts);
    } catch (err) {
        console.error('Failed to fetch posts:', err);
    } finally {
        setLoading(false);
    }
    }

    loadPosts();
}, [activeTab]);

const handleVote = async (postId, direction) => {
    try {
    const updatedPost = await postService.votePost(postId, direction);
    setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, ...updatedPost } : p))
    );
    } catch (err) {
    console.error('Failed to vote:', err);
    }
};

return (
    <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
    {/* Posts Feed */}
    {loading ? (
        <div className="flex flex-col gap-4">
        {[1, 2, 3].map((n) => (
            <div
            key={n}
            className="h-44 w-full bg-[--bg-surface] border border-[--border-subtle] rounded-2xl animate-pulse"
            />
        ))}
        </div>
    ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4 pb-16 md:pb-6">
        {posts.map((post, index) => (
            <PostCard
            key={post.id}
            post={post}
            onVote={handleVote}
            isAboveFold={index === 0}
            />
        ))}
        </div>
    ) : (
        <div className="text-center py-12 bg-[--bg-surface] rounded-2xl border border-[--border-subtle]">
        <p className="text-sm text-[--text-secondary]">
            No posts found in this feed. Be the first to create one!
        </p>
        </div>
    )}
    </div>
);
}