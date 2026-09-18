import { apiRequest, unwrapData } from '@/services/apiClient';

export const modService = {
async removeContent(targetId, targetType) {
    const path = targetType === 'comment'
    ? `/api/mod/comments/${targetId}`
    : `/api/mod/orbits/posts/${targetId}`;
    return unwrapData(await apiRequest(path, { method: 'DELETE' }));
},

async banUser(orbitId, userId) {
    return unwrapData(await apiRequest(`/api/mod/orbits/${orbitId}/ban`, {
    method: 'POST',
    body: { userId },
    }));
},

async updateMemberRole(orbitId, userId, role) {
    return unwrapData(await apiRequest(`/api/mod/orbits/${orbitId}/role`, {
    method: 'PUT',
    body: { userId, role: role.toUpperCase() },
    }));
},

async getPendingReports() {
    throw new Error('Report queues are not available in the current API contract.');
},

async dismissReport() {
    throw new Error('Report queues are not available in the current API contract.');
},

async getJoinRequests() {
    throw new Error('Join requests are not available in the current API contract.');
},

async getJoinRequestStatus() {
    throw new Error('Join requests are not available in the current API contract.');
},

async createJoinRequest() {
    throw new Error('Join requests are not available in the current API contract.');
},

async resolveJoinRequest() {
    throw new Error('Join requests are not available in the current API contract.');
},
};
