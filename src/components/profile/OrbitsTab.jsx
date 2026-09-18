// components/profile/OrbitsTab.jsx
'use client';

import Link from 'next/link';
import { Plus, Users, Globe2, Compass } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

export default function OrbitsTab({ orbits = [], isOwnProfile = false }) {
// 1. EMPTY STATE
if (!orbits || orbits.length === 0) {
    return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[--border-subtle] rounded-2xl bg-[--bg-surface] min-h-75">
        {/* Graphic Illustration */}
        <div className="w-16 h-16 rounded-3xl bg-[--accent-warm]/10 flex items-center justify-center text-[--accent-warm] mb-4 shadow-inner">
        <Compass className="w-8 h-8 animate-pulse" />
        </div>
        
        <h3 className="font-bold text-base text-[--text-primary]">No Orbits Yet</h3>
        <p className="text-xs text-[--text-secondary] max-w-sm mt-1 mb-6">
        {isOwnProfile
            ? "You haven't created any communities yet. Start your own Orbit to build a custom space for discussions."
            : "This user hasn't created or joined any public Orbits yet."}
        </p>

        {isOwnProfile && (
        <Link
            href="/orbits/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-[--accent-warm] hover:opacity-90 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
            <Plus className="w-4 h-4" />
            Create Orbit
        </Link>
        )}
    </div>
    );
}

// 2. POPULATED STATE
return (
    <div className="flex flex-col gap-4">
    {/* Tab Header with Create Orbit CTA button for owner */}
    {isOwnProfile && (
        <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-semibold text-[--text-secondary]">
            Your Orbits ({orbits.length})
        </span>
        <Link
            href="/orbits/create"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[--accent-warm] hover:opacity-90 text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-95"
        >
            <Plus className="w-4 h-4" />
            <span>Create Orbit</span>
        </Link>
        </div>
    )}

    {/* Orbit Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orbits.map((orbit) => (
        <Link
            key={orbit.id || orbit.name}
            href={`/r/${orbit.name}`}
            className="flex flex-col justify-between p-4 bg-[--bg-surface] hover:bg-[--bg-surface-hover] border border-[--border-subtle] rounded-2xl transition-all shadow-sm hover:shadow-md group"
        >
            <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
                <Avatar src={orbit.iconUrl || orbit.bannerUrl} alt={orbit.name} size="md" />
                <div>
                <h4 className="text-sm font-bold text-[--text-primary] group-hover:text-[--accent-warm] transition-colors">
                    r/{orbit.name}
                </h4>
                <p className="text-[11px] text-[--text-secondary] line-clamp-1">
                    {orbit.description || 'No description provided.'}
                </p>
                {orbit.membership?.role && (
                    <p className="mt-1 text-[10px] font-semibold uppercase text-[--accent-warm]">
                    {orbit.membership.role.toLowerCase()}
                    </p>
                )}
                </div>
            </div>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[--border-subtle] text-[11px] text-[--text-secondary]">
            <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {orbit.memberCount ?? orbit._count?.members ?? 0} members
            </span>
            <span className="flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                {orbit.isPrivate ? 'Private' : 'Public'}
            </span>
            </div>
        </Link>
        ))}
    </div>
    </div>
);
}
