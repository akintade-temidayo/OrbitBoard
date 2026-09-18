import { apiRequest, unwrapData } from '@/services/apiClient';

export const searchService = {
  async searchAll(query) {
    if (!query?.trim()) return { orbits: [], users: [] };

    const data = unwrapData(await apiRequest(`/api/search?q=${encodeURIComponent(query.trim())}`));
    const availableOrbits = data?.orbits || [];
    const availableUsers = data?.users || [];

    return {
      orbits: availableOrbits.map((orbit) => ({
        ...orbit,
        iconUrl: orbit.iconUrl ?? orbit.bannerUrl ?? null,
        memberCount: orbit.memberCount ?? orbit._count?.members ?? 0,
      })),
      users: availableUsers,
    };
  },
};
