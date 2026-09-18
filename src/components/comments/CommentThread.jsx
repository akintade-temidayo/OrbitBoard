'use client';

import { useState } from 'react';
import CommentItem from './CommentItem';

export default function CommentThread({ comments = [], currentUser, postId, onAddReply, onDelete }) {
const [localReplies, setLocalReplies] = useState({});

// Helper function to recursively insert a reply deep into the comment tree
const addReplyToTree = (list, targetId, newReply) => {
    return list.map((item) => {
    const itemId = item.id || item._id;
    if (itemId === targetId) {
        return {
        ...item,
        replies: [newReply, ...(item.replies || [])],
        };
    }
    if (item.replies && item.replies.length > 0) {
        return {
        ...item,
        replies: addReplyToTree(item.replies, targetId, newReply),
        };
    }
    return item;
    });
};

const handleAddReply = (parentId, content) => {
    const newReply = {
    id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    author: currentUser || { username: 'anonymous', avatarUrl: '' },
    content,
    upvotes: 1,
    createdAt: new Date().toISOString(),
    replies: [],
    };

    if (onAddReply) {
    onAddReply(parentId, content);
    } else {
    // Fallback: update tree locally if parent doesn't handle replies
    setLocalReplies((prev) => ({
        ...prev,
        [parentId]: [...(prev[parentId] || []), newReply],
    }));
    }
};

return (
    <div className="flex flex-col gap-4 w-full">
    {comments.length > 0 ? (
        comments.map((comment, index) => {
        // Fallback key assignment to prevent duplicate key console errors
        const commentKey = comment.id || comment._id || comment.commentId || `comment-${index}`;

        return (
            <CommentItem
            key={commentKey}
            comment={comment}
            onAddReply={handleAddReply}
            onDelete={onDelete}
            currentUser={currentUser}
            />
        );
        })
    ) : (
        <div className="text-center py-8 text-xs text-[--text-secondary] border border-dashed border-[--border-subtle] rounded-2xl">
        No comments yet. Be the first to start the conversation!
        </div>
    )}
    </div>
);
}