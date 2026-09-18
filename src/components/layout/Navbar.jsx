'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { Search, Sun, Moon, MessageSquare, User, LogOut, Shield, Plus } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';

export default function Navbar() {
const { theme, toggleTheme } = useTheme();
const { user, logout } = useAuth();
const [isProfileOpen, setIsProfileOpen] = useState(false);

const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
);

return (
    <header className="h-16 shrink-0 w-full border-b border-[--border-subtle] bg-[--bg-surface]/80 backdrop-blur-md z-40 sticky top-0">
    <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[--text-primary]">
        <div className="w-8 h-8 rounded-full bg-[--accent-warm] flex items-center justify-center text-white text-sm font-extrabold">
            O
        </div>
        <span>Orbit<span className="text-[--accent-warm]">Board</span></span>
        </Link>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-3">
        {/* Create Post Button - Hidden on mobile, flex on desktop */}
        <Link
            href="/submit"
            className="hidden md:flex p-2.5 rounded-full border border-[--border-subtle] bg-[--bg-surface] text-[--text-secondary] hover:text-[--text-primary] hover:border-[--accent-warm] transition-all min-w-9.5 min-h-9.5 items-center justify-center"
            title="Create Post"
        >
            <Plus className="w-4 h-4" />
        </Link>

        {/* Search Trigger Button */}
        <Link
            href="/search"
            className="p-2.5 rounded-full border border-[--border-subtle] bg-[--bg-surface] text-[--text-secondary] hover:text-[--text-primary] hover:border-[--accent-warm] transition-all min-w-9.5 min-h-9.5 flex items-center justify-center"
            title="Search"
            aria-label="Search Orbits and users"
        >
            <Search className="w-4 h-4" />
        </Link>
        
        {/* Theme Toggle Button */}
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-[--border-subtle] bg-[--bg-surface] text-[--text-secondary] hover:text-[--text-primary] hover:border-[--accent-warm] transition-all min-w-9.5 min-h-9.5 flex items-center justify-center"
            aria-label="Toggle theme"
        >
            {!mounted ? (
            <div className="w-4 h-4" />
            ) : theme === 'blue-dark' || theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
            ) : (
            <Moon className="w-4 h-4" />
            )}
        </button>

        {user ? (
            <>
            {/* Chat Button - Hidden on mobile, flex on desktop */}
            <Link
                href="/messages"
                className="hidden md:flex p-2.5 rounded-full border border-[--border-subtle] bg-[--bg-surface] text-[--text-secondary] hover:text-[--text-primary] hover:border-[--accent-warm] transition-all relative min-w-9.5 min-h-9.5 items-center justify-center"
            >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[--accent-warm] rounded-full animate-pulse" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
                <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-[--border-subtle] hover:border-[--accent-warm] transition-all"
                >
                <Avatar src={user.avatarUrl} alt={user.username} size="sm" />
                </button>

                {isProfileOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-[--border-subtle] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 bg-[--bg-surface]"
                    style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                    <div className="px-3 py-2 border-b border-[--border-subtle] mb-1">
                    <p className="text-sm font-bold text-[--text-primary]">{user.username}</p>
                    <p className="text-xs text-[--text-secondary] truncate">{user.email}</p>
                    <div className="mt-1 text-[10px] font-semibold text-[--accent-warm] uppercase tracking-wider">
                        Karma: {user.karma}
                    </div>
                    </div>

                    <Link
                    href={`/profile/${user.username}`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[--text-primary] hover:bg-[--bg-surface-hover] rounded-xl transition-colors"
                    >
                    <User className="w-4 h-4 text-[--text-secondary]" /> My Profile
                    </Link>

                    {(user.role === 'admin' || user.moderatedOrbitIds?.length > 0) && (
                    <Link
                        href="/mod"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-[--bg-surface-hover] rounded-xl transition-colors"
                    >
                        <Shield className="w-4 h-4" /> Moderation Desk
                    </Link>
                    )}

                    <button
                    onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                    >
                    <LogOut className="w-4 h-4" /> Log Out
                    </button>
                </div>
                )}
            </div>
            </>
        ) : (
            <Link
            href="/onboarding"
            className="px-4 py-2 text-xs font-semibold bg-[--accent-warm] text-white rounded-xl hover:opacity-90 transition-opacity"
            >
            Log In
            </Link>
        )}
        </div>
    </div>
    </header>
);
}