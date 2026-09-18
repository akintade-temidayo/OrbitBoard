'use client';

import {
createContext,
useContext,
useCallback,
useEffect,
useRef,
useSyncExternalStore,
} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
const { user, token } = useAuth();

// External store references for live socket instance and connection status
const socketRef = useRef(null);
const isConnectedRef = useRef(false);
const listenersRef = useRef(new Set());

// Notify every useSyncExternalStore subscriber when the store changes
const emitChange = useCallback(() => {
    for (const listener of listenersRef.current) {
    listener();
    }
}, []);

const subscribe = useCallback((listener) => {
    listenersRef.current.add(listener);
    return () => {
    listenersRef.current.delete(listener);
    };
}, []);

const getSocketSnapshot = useCallback(() => socketRef.current, []);
const getIsConnectedSnapshot = useCallback(() => isConnectedRef.current, []);

// Server-side snapshots for Next.js SSR & Hydration
const getSocketServerSnapshot = useCallback(() => null, []);
const getIsConnectedServerSnapshot = useCallback(() => false, []);

useEffect(() => {
    // Teardown if unauthenticated
    if (!user || !token) {
    if (socketRef.current) {
        socketRef.current.disconnect();
    }
    socketRef.current = null;
    isConnectedRef.current = false;
    emitChange();
    return;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://orbitboard-backend.onrender.com';

    const socketInstance = io(SOCKET_URL, {
    auth: { token: `Bearer ${token.replace(/^Bearer\s+/i, '')}` },
    autoConnect: true,
    reconnectionAttempts: 5,
    transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
    isConnectedRef.current = true;
    emitChange();
    });

    socketInstance.on('disconnect', () => {
    isConnectedRef.current = false;
    emitChange();
    });

    socketRef.current = socketInstance;
    emitChange();

    return () => {
    socketInstance.disconnect();
    socketRef.current = null;
    isConnectedRef.current = false;
    emitChange();
    };
}, [user, token, emitChange]);

const socket = useSyncExternalStore(
    subscribe,
    getSocketSnapshot,
    getSocketServerSnapshot
);

const isConnected = useSyncExternalStore(
    subscribe,
    getIsConnectedSnapshot,
    getIsConnectedServerSnapshot
);

return (
    <SocketContext.Provider value={{ socket, isConnected }}>
    {children}
    </SocketContext.Provider>
);
}

// Custom hook for convenient consumption across components
export function useSocket() {
const context = useContext(SocketContext);
if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
}
return context;
}