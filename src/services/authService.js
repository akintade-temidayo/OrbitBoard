import { apiRequest, unwrapData } from '@/services/apiClient';

export const authService = {
async login({ email, password }) {
        return unwrapData(await apiRequest('/api/auth/login', {
            method: 'POST',
            body: { email: email.trim(), password },
        }));
},

async register({ fullName, username, email, password, avatarUrl = '' }) {
        const body = {
                fullName: fullName.trim(),
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password,
        };

        if (avatarUrl?.startsWith('http')) body.avatar = avatarUrl;

        return unwrapData(await apiRequest('/api/auth/register', {
            method: 'POST',
            body,
        }));
},

async requestPasswordReset(email) {
        return apiRequest('/api/auth/forgot-password', {
            method: 'POST',
            body: { email: email.trim() },
        });
},

async resetPassword({ email, otp, newPassword }) {
        return apiRequest('/api/auth/reset-password', {
            method: 'POST',
                        body: { email, otp, newPassword },
        });
},

async verifyOtp({ email, otp }) {
                return apiRequest('/api/auth/verify-otp', {
                        method: 'POST',
                        body: { email, otp },
                });
},

async updateProfile(fields, token) {
                return unwrapData(await apiRequest('/api/users/profile', {
                        method: 'PUT',
                        body: fields,
                        token,
                }));
},

getCurrentUser: async () => {
const token = typeof window !== 'undefined' ? localStorage.getItem('orbitboard_token') : null;
const data = unwrapData(await apiRequest('/api/auth/me', {
    method: 'GET',
    token,
}));
return data?.user ?? data;
}
};
