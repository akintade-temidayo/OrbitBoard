'use client';

import { createContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
// Keep the server and client's first render identical. Browser storage is read after hydration.
const [session, setSession] = useState({ token: null, user: null });

const [loading, setLoading] = useState(true);

useEffect(() => {
// Read token inside the effect so session.token isn't a missing dependency
const token = typeof window !== 'undefined' ? localStorage.getItem('orbitboard_token') : null;

if (token) {
    let storedUser = null;

    try {
    const storedUserValue = localStorage.getItem('orbitboard_user');
    storedUser = storedUserValue ? JSON.parse(storedUserValue) : null;
    } catch (err) {
    console.error('Failed to parse stored user session:', err);
    }

    queueMicrotask(() => setSession({ token, user: storedUser }));

    authService
    .getCurrentUser()
    .then((currentUser) => {
        setSession((prev) => ({ ...prev, user: currentUser }));
        localStorage.setItem('orbitboard_user', JSON.stringify(currentUser));
    })
    .catch((error) => {
        console.error('Session validation failed on reload:', error);

        if (
        error?.message?.includes('401') ||
        error?.message?.includes('Unauthorized') ||
        error?.message?.includes('jwt expired')
        ) {
        localStorage.removeItem('orbitboard_token');
        localStorage.removeItem('orbitboard_user');
        setSession({ token: null, user: null });
        }
    })
    .finally(() => {
        setLoading(false);
    });
} else {
    // Defer state update to avoid synchronous setState during mount
    queueMicrotask(() => setLoading(false));
}
}, []);

const login = (userData, authToken) => {
    setSession({ token: authToken, user: userData });
    localStorage.setItem('orbitboard_token', authToken);
    localStorage.setItem('orbitboard_user', JSON.stringify(userData));
};

const logout = () => {
    setSession({ token: null, user: null });
    localStorage.removeItem('orbitboard_token');
    localStorage.removeItem('orbitboard_user');
};

const updateUser = (updatedFields) => {
    setSession((prev) => {
    const newUserData = { ...prev.user, ...updatedFields };
    localStorage.setItem('orbitboard_user', JSON.stringify(newUserData));
    return { ...prev, user: newUserData };
    });
};

return (
    <AuthContext.Provider
    value={{
        user: session.user,
        token: session.token,
        loading,
        isAuthenticated: !!session.token,
        login,
        logout,
        updateUser,
    }}
    >
    {children}
    </AuthContext.Provider>
);
}
