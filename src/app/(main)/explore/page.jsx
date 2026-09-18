'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Compass, Users, Plus, Check, Sparkles } from 'lucide-react';
import { orbitService } from '@/services/orbitService';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

const CATEGORIES = ['All', 'Technology', 'Design', 'Gaming', 'Science', 'Entertainment'];

export default function ExploreOrbitsPage() {
const [orbits, setOrbits] = useState([]);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('All');
const [joinedOrbitIds, setJoinedOrbitIds] = useState(new Set());

useEffect(() => {
    async function fetchOrbits() {
    setLoading(true);
    try {
        const data = await orbitService.getAllAvailableOrbits();
        setOrbits(data || []);
    } catch (err) {
        console.error('Failed to load orbits:', err);
    } finally {
        setLoading(false);
    }
    }
    fetchOrbits();
}, []);

const handleToggleJoin = (orbitId) => {
    setJoinedOrbitIds((prev) => {
    const next = new Set(prev);
    if (next.has(orbitId)) {
        next.delete(orbitId);
    } else {
        next.add(orbitId);
    }
    return next;
    });
};

// Filter orbits based on search query and selected category
const filteredOrbits = orbits.filter((orbit) => {
    const matchesSearch =
    orbit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    orbit.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
    selectedCategory === 'All' || orbit.category === selectedCategory;
    return matchesSearch && matchesCategory;
});

return (
    <div className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6 pb-24 md:pb-8 relative">
    {/* Header Banner */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[--bg-surface] border border-[--border-subtle] relative overflow-hidden">
        <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[--accent-warm]">
            <Compass className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Discovery Hub</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[--text-primary]">
            Explore Orbits
        </h1>
        <p className="text-xs md:text-sm text-[--text-secondary] max-w-xl">
            Find and join communities tailored to your interests, or launch your own orbit.
        </p>
        </div>

        <Link href="/orbits/create" className="shrink-0">
        <Button variant="primary" className="rounded-2xl text-xs font-semibold px-4 py-2.5 flex items-center gap-2 shadow-md">
            <Plus className="w-4 h-4" />
            <span>Create Orbit</span>
        </Button>
        </Link>
    </div>

    {/* Controls: Search and Categories */}
    <div className="flex flex-col gap-4">
        <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-secondary]" />
        <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities by name or topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[--bg-surface] border border-[--border-subtle] text-xs text-[--text-primary] placeholder-[--text-secondary] focus:outline-none focus:border-[--accent-warm] transition-colors"
        />
        </div>

        {/* Category Pills */}

    </div>

    {/* Orbits Directory Grid */}
    {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-[--bg-surface] rounded-2xl border border-[--border-subtle]" />
        ))}
        </div>
    ) : filteredOrbits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrbits.map((orbit) => {
            const isJoined = joinedOrbitIds.has(orbit.id);
            return (
            <div
                key={orbit.id}
                className="p-5 rounded-2xl border border-[--border-subtle] bg-[--bg-surface] hover:border-[--text-secondary]/30 transition-all flex flex-col justify-between gap-4"
            >
                <div className="flex items-start gap-3">
                <Avatar src={orbit.iconUrl} alt={orbit.name} size="lg" />
                <div className="flex flex-col flex-1 min-w-0">
                    <Link
                    href={`/r/${orbit.name}`}
                    className="font-extrabold text-sm text-[--text-primary] hover:text-[--accent-warm] truncate transition-colors"
                    >
                    r/{orbit.name}
                    </Link>
                    <div className="flex items-center gap-1.5 text-[10px] text-[--text-secondary] mt-0.5">
                    <Users className="w-3 h-3" />
                    <span>{orbit.memberCount || '1.2k'} members</span>
                    </div>
                    <p className="text-xs text-[--text-secondary] line-clamp-2 mt-2 leading-relaxed">
                    {orbit.description || `The official community for r/${orbit.name}`}
                    </p>
                </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[--border-subtle]/50">
                <Link
                    href={`/r/${orbit.name}`}
                    className="text-xs font-semibold text-[--accent-warm] hover:underline"
                >
                    View Orbit →
                </Link>
                <Button
                    variant={isJoined ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleJoin(orbit.id)}
                    className="rounded-xl flex items-center gap-1.5 text-xs font-semibold px-3 py-1"
                >
                    {isJoined ? (
                    <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Joined
                    </>
                    ) : (
                    <>
                        <Plus className="w-3.5 h-3.5" /> Join
                    </>
                    )}
                </Button>
                </div>
            </div>
            );
        })}
        </div>
    ) : (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[--border-subtle] bg-[--bg-surface] flex flex-col items-center gap-2">
        <Sparkles className="w-6 h-6 text-[--text-secondary]" />
        <p className="text-xs font-semibold text-[--text-primary]">No orbits found</p>
        <p className="text-[11px] text-[--text-secondary]">
            Try adjusting your search query or selecting a different category.
        </p>
        </div>
    )}

    {/* Floating Action Button (FAB) for Mobile & Quick Access */}
    <Link
        href="/orbits/create"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 hover:opacity-90 text-white rounded-full font-semibold text-xs shadow-xl transition-all"
        style={{ backgroundColor: 'var(--accent-warm)' }}
    >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Create Orbit</span>
    </Link>
    </div>
);
}
