import { apiRequest, unwrapData } from '@/services/apiClient';
import { buildCommentTree } from '@/utils/treeHelpers';

const listFrom = (payload) => {
const data = unwrapData(payload);
return Array.isArray(data) ? data : data?.comments || data?.items || [];
};

export const commentService = {
async getCommentsByPostId(postId) {
    const comments = listFrom(await apiRequest(`/api/comments/post/${postId}`));
    return buildCommentTree(
    comments.map((comment) => ({
        ...comment,
        content: comment.content ?? comment.body ?? '',
        author: comment.author || comment.user || (comment.authorId ? { id: comment.authorId } : undefined),
    }))
    );
},

async createComment({ postId, parentId = null, content }) {
    return unwrapData(
    await apiRequest('/api/comments', {
        method: 'POST',
        body: {
        postId,
        content,
        parentId: parentId || undefined,
        },
    })
    );
},

async voteComment(commentId, direction) {
    return unwrapData(
    await apiRequest(`/api/comments/${commentId}/vote`, {
        method: 'POST',
        body: { value: direction },
    })
    );
},

async deleteComment(commentId) {
    return unwrapData(await apiRequest(`/api/comments/${commentId}`, { method: 'DELETE' }));
},
};