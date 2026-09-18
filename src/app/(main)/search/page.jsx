'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2, Compass, User as UserIcon, X, CornerDownLeft } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { searchService } from '@/services/searchService';

export default function SearchPage() {
const [query, setQuery] = useState('');
const [results, setResults] = useState({ orbits: [], users: [] });
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const timer = setTimeout(async () => {
    setIsLoading(true);
    try {
        const data = await searchService.searchAll(trimmedQuery);
        setResults(data);
    } catch (err) {
        console.error('Search error:', err);
    } finally {
        setIsLoading(false);
    }
    }, 300);

    return () => clearTimeout(timer);
}, [query]);

const hasResults = results.orbits.length > 0 || results.users.length > 0;

const handleSearchSubmit = (e) => {
    e.preventDefault();
};

return (
    <div className="max-w-4xl mx-auto px-4 py-8">
    {/* Search Input Form */}
    <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-8">
        <Search className="w-5 h-5 absolute left-4 text-[--text-secondary] pointer-events-none" />
        
        <input
        type="text"
        value={query}
        onChange={(e) => {
            const nextQuery = e.target.value;
            setQuery(nextQuery);
            if (!nextQuery.trim()) {
            setResults({ orbits: [], users: [] });
            }
        }}
        placeholder="Search Orbits by name or users by handle..."
        autoFocus
        className="w-full h-12 pl-12 pr-24 bg-[--bg-surface] border border-[--border-subtle] focus:border-[--accent-warm] rounded-2xl text-sm text-[--text-primary] placeholder-[--text-secondary] focus:outline-none transition-all shadow-sm"
        />

        <div className="absolute right-3 flex items-center gap-2">
        {isLoading ? (
            <Loader2 className="w-5 h-5 text-[--text-secondary] animate-spin" />
        ) : query ? (
            <button
            type="button"
            onClick={() => {
                setQuery('');
                setResults({ orbits: [], users: [] });
            }}
            className="p-1 text-[--text-secondary] hover:text-[--text-primary] transition-colors"
            title="Clear search"
            >
            <X className="w-5 h-5" />
            </button>
        ) : null}

        {/* Submit / Enter Action Button */}
        <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[--accent-warm] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            style={{ backgroundColor: 'var(--accent-warm)' }}
            title="Search or press Enter"
        >
            <span>Search</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
        </div>
    </form>

    {/* Results View */}
    {query.trim() && !isLoading && !hasResults && (
        <div className="text-center py-16 text-sm text-[--text-secondary] bg-[--bg-surface] rounded-2xl border border-[--border-subtle]">
        No Orbits or users found matching &quot;{query}&quot;. Press <kbd className="px-1.5 py-0.5 rounded bg-[--bg-surface-hover] border border-[--border-subtle] text-xs font-mono">Enter</kbd> to view details.
        </div>
    )}

    <div className="space-y-8">
        {/* Orbits Category */}
        {results.orbits.length > 0 && (
        <section>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-[--text-secondary]">
            <Compass className="w-4 h-4 text-[--accent-warm]" />
            <span>Orbits ({results.orbits.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.orbits.map((orbit) => (
                <Link
                key={orbit.id}
                href={`/r/${orbit.name}`}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-[--bg-surface] border border-[--border-subtle] hover:border-[--accent-warm] transition-all group"
                >
                <Avatar src={orbit.iconUrl} alt={orbit.name} size="md" />
                <div className="truncate">
                    <p className="text-sm font-semibold text-[--text-primary] group-hover:text-[--accent-warm] transition-colors">
                    r/{orbit.name}
                    </p>
                    <p className="text-xs text-[--text-secondary] truncate">{orbit.description || `${orbit.memberCount || 0} members`}</p>
                </div>
                </Link>
            ))}
            </div>
        </section>
        )}

        {/* Users Category */}
        {results.users.length > 0 && (
        <section>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-[--text-secondary]">
            <UserIcon className="w-4 h-4 text-[--accent-warm]" />
            <span>Users ({results.users.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.users.map((u) => (
                <Link
                key={u.id}
                href={`/profile/${u.username}`}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-[--bg-surface] border border-[--border-subtle] hover:border-[--accent-warm] transition-all group"
                >
                <Avatar src={u.avatarUrl} alt={u.username} size="md" />
                <div className="truncate">
                    <p className="text-sm font-semibold text-[--text-primary] group-hover:text-[--accent-warm] transition-colors">
                    u/{u.username}
                    </p>
                    <p className="text-xs text-[--text-secondary] truncate">{u.fullName || u.bio || 'OrbitBoard member'}</p>
                </div>
                </Link>
            ))}
            </div>
        </section>
        )}
    </div>
    </div>
);
}
