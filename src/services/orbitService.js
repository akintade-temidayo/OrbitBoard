import { apiRequest, unwrapData } from '@/services/apiClient';
import { normalizePost } from '@/services/postService';

const listFrom = (payload) => {
  const data = unwrapData(payload);
  return Array.isArray(data) ? data : data?.orbits || data?.items || [];
};

const normalizeOrbit = (orbit) => {
  if (!orbit) return orbit;

  return {
    ...orbit,
    // The current API persists one visual URL as bannerUrl, so use it for the
    // avatar too until the backend exposes a dedicated iconUrl field.
    iconUrl: orbit.iconUrl ?? orbit.avatarUrl ?? orbit.imageUrl ?? orbit.bannerUrl ?? null,
    coverUrl: orbit.coverUrl ?? orbit.bannerUrl ?? null,
    tagline: orbit.tagline ?? orbit.description ?? '',
    memberCount: orbit.memberCount ?? orbit._count?.members ?? 0,
  };
};

export const orbitService = {
  async getAllOrbits(page = 1, limit = 10) {
    return listFrom(await apiRequest(`/api/orbits?page=${page}&limit=${limit}`)).map(normalizeOrbit);
  },

  async getAllAvailableOrbits() {
    const limit = 100;
    const firstPayload = await apiRequest(`/api/orbits?page=1&limit=${limit}`);
    const firstData = unwrapData(firstPayload);
    const firstPage = (Array.isArray(firstData) ? firstData : firstData?.orbits || []).map(normalizeOrbit);
    const totalPages = Math.max(Number(firstData?.meta?.totalPages) || 1, 1);

    if (totalPages === 1) return firstPage;

    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) => apiRequest(`/api/orbits?page=${index + 2}&limit=${limit}`))
    );

    return remainingPages.reduce(
      (orbits, payload) => [...orbits, ...listFrom(payload).map(normalizeOrbit)],
      firstPage
    );
  },

  async getOrbitByName(identifier) {
    const encodedIdentifier = encodeURIComponent(identifier);
    const data = unwrapData(await apiRequest(`/api/orbits/${encodedIdentifier}`));
    return normalizeOrbit(data?.orbit ?? data);
  },

  async getOrbitPosts(identifier) {
    const data = unwrapData(
      await apiRequest(`/api/orbits/${encodeURIComponent(identifier)}/posts`)
    );
    const posts = Array.isArray(data) ? data : data?.posts || [];
    return posts.map(normalizePost);
  },

  async createOrbit({ name, description, bannerUrl, isPrivate }) {
    const data = unwrapData(
      await apiRequest('/api/orbits', {
        method: 'POST',
        body: { name, description, bannerUrl, isPrivate: Boolean(isPrivate) },
      })
    );
    return normalizeOrbit(data?.orbit ?? data);
  },

  async joinOrbit(orbitId) {
    return unwrapData(await apiRequest(`/api/orbits/${orbitId}/join`, { method: 'POST' }));
  },

  async leaveOrbit(orbitId) {
    return unwrapData(await apiRequest(`/api/orbits/${orbitId}/leave`, { method: 'DELETE' }));
  },

  async handleJoinRequest(orbitId, requestId, action) {
    return unwrapData(
      await apiRequest(`/api/orbits/${orbitId}/join-requests/${requestId}/respond`, {
        method: 'POST',
        body: { action },
      })
    );
  },

  async addMember(orbitId, targetUserId, role = 'MEMBER') {
    return unwrapData(
      await apiRequest(`/api/orbits/${orbitId}/members`, {
        method: 'POST',
        body: { targetUserId, role },
      })
    );
  },
};
