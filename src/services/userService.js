import { apiRequest, unwrapData } from '@/services/apiClient';

export const userService = {
  async getProfile(identifier) {
    const data = unwrapData(await apiRequest(`/api/users/${encodeURIComponent(identifier)}`));
    return data?.user ?? data;
  },

  async updateProfile({ fullName, avatarUrl, bio }) {
    const data = unwrapData(await apiRequest('/api/users/profile', {
      method: 'PUT',
      body: { fullName, avatarUrl, bio },
    }));
    return data?.user ?? data;
  },

  async sendFriendRequest(targetUserId) {
    const data = unwrapData(await apiRequest(`/api/users/friend-request/${encodeURIComponent(targetUserId)}`, {
      method: 'POST',
    }));
    return data?.request ?? data;
  },

  async respondToFriendRequest(requestId, status) {
    return unwrapData(await apiRequest(`/api/users/friend-request/${encodeURIComponent(requestId)}`, {
      method: 'PUT',
      body: { status },
    }));
  },

  async getFriendRequests() {
    return unwrapData(await apiRequest('/api/users/friend-requests'));
  },
};
