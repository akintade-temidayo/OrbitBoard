import { apiRequest, unwrapData } from '@/services/apiClient';

const listFrom = (payload) => {
  const data = unwrapData(payload);
  return Array.isArray(data) ? data : data?.posts || data?.items || [];
};

export const normalizePost = (post) => {
  if (!post) return post;

  // Extract author safely and map avatarUrl -> avatar
  const authorData = post.author || post.user || (post.authorId ? { id: post.authorId } : undefined);
  const author = authorData
    ? {
        ...authorData,
        avatar: authorData.avatar || authorData.avatarUrl || null,
      }
    : undefined;

  // Safely resolve orbitName from nested orbit object or direct property
  const orbitName =
    post.orbitName ||
    post.orbit?.name ||
    (typeof post.orbit === 'string' ? post.orbit : null) ||
    'general';

  return {
    ...post,
    type: post.type ?? post.mediaType ?? 'text',
    orbitName,
    bodyText: post.bodyText ?? post.content ?? '',
    imageUrl: post.imageUrl ?? post.mediaUrl ?? null,
    linkUrl: post.linkUrl ?? (post.type === 'link' ? post.mediaUrl : null),
    votesCount: post.votesCount ?? post.score ?? post.voteCount ?? 0,
    commentsCount: post.commentsCount ?? post.commentCount ?? post._count?.comments ?? 0,
    author,
  };
};

export const postService = {
  async getPosts({ orbitName = null } = {}) {
    const payload = orbitName
      ? await apiRequest(`/api/posts/orbit/${encodeURIComponent(orbitName)}`)
      : await apiRequest('/api/posts');
    return listFrom(payload).map(normalizePost);
  },

  async getPostsByOrbit(orbitName) {
    return this.getPosts({ orbitName });
  },

  async getPostById(postId) {
    const data = unwrapData(await apiRequest(`/api/posts/${postId}`));
    return normalizePost(data?.post ?? data);
  },

  async votePost(postId, direction) {
    return unwrapData(
      await apiRequest(`/api/posts/${postId}/vote`, {
        method: 'POST',
        body: { value: direction },
      })
    );
  },

  async deletePost(postId) {
    return unwrapData(await apiRequest(`/api/posts/${postId}`, { method: 'DELETE' }));
  },

  async createPost({ orbitId, title, type, bodyText, imageUrl, linkUrl }) {
    const mediaUrl = imageUrl || linkUrl || null;

    const payload = {
      title,
      content: bodyText || title || '',
      type,
      ...(orbitId ? { orbitId } : {}),
      ...(mediaUrl ? { mediaUrl } : { mediaUrl: null }),
    };

    return normalizePost(
      unwrapData(
        await apiRequest('/api/posts', {
          method: 'POST',
          body: payload,
        })
      )
    );
  },
};
