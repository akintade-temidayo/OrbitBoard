'use client';

import Link from 'next/link';
import { Shield, Plus, Check, LogOut, ArrowLeft, Info, UserPlus } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

export default function OrbitHeader({
orbit,
isJoined,
isJoinPending,
isOwner,
onToggleJoin,
onAddPeople,
onOpenDrawer,
infoMenuRef,
isInfoMenuOpen,
setIsInfoMenuOpen,
onSelectModal,
}) {
return (
    <div className="relative w-full">
    {/* Banner / Cover */}
    <div className="h-36 md:h-44 w-full bg-[--bg-surface-hover] relative overflow-visible">
        {orbit.coverUrl ? (
        <img
            src={orbit.coverUrl}
            alt={`${orbit.name} banner`}
            className="w-full h-full object-cover"
        />
        ) : (
        <div className="w-full h-full bg-linear-to-r from-orange-500 via-amber-600 to-purple-700" />
        )}

        {/* Back Button */}
        <Link
        href="/"
        className="absolute top-4 left-4 p-2 rounded-full bg-[--bg-surface] text-[--text-primary] shadow-md hover:bg-[--bg-surface-hover] transition-colors z-10 border border-[--border-subtle]"
        >
        <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Info Menu Dropdown Trigger */}
        <div className="absolute top-4 right-4 z-20" ref={infoMenuRef}>
        <button
            onClick={() => setIsInfoMenuOpen((prev) => !prev)}
            className="p-2 rounded-full bg-[--bg-surface] text-[--text-primary] shadow-md hover:bg-[--bg-surface-hover] transition-colors border border-[--border-subtle]"
            aria-label="Orbit Information"
        >
            <Info className="w-4 h-4" />
        </button>

        {/* Dynamic Theme Dropdown */}
        {isInfoMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[--border-subtle] bg-[--bg-surface] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <button
                onClick={() => {
                setIsInfoMenuOpen(false);
                onSelectModal('about');
                }}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[--text-primary] hover:bg-[--bg-surface-hover] rounded-xl transition-colors"
            >
                <Info className="w-4 h-4 text-[--accent-warm]" /> About Community
            </button>
            <button
                onClick={() => {
                setIsInfoMenuOpen(false);
                onSelectModal('rules');
                }}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[--text-primary] hover:bg-[--bg-surface-hover] rounded-xl transition-colors mt-1"
            >
                <Shield className="w-4 h-4 text-[--accent-warm]" /> Community Rules
            </button>
            </div>
        )}
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-10 md:-bottom-12 left-4 md:left-6 z-10">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-4 ring-[--bg-surface] bg-[--bg-surface] overflow-hidden flex items-center justify-center shadow-md">
            <Avatar src={orbit.iconUrl} alt={orbit.name} size="lg" className="w-full h-full object-cover" />
        </div>
        </div>
    </div>

    {/* Orbit Action Bar */}
    <div className="bg-[--bg-surface] border-b border-[--border-subtle] px-4 md:px-6 pt-12 md:pt-14 pb-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-extrabold text-[--text-primary]">
            r/{orbit.name}
            </h1>
            <p className="text-xs text-[--text-secondary]">
            {orbit.description || orbit.tagline || `The official community for r/${orbit.name}`}
            </p>
        </div>

        <div className="flex items-center gap-3">
            {/* Owners administer their community; other users can manage their membership. */}
            {isOwner ? (
            <Button
                variant="outline"
                size="sm"
                onClick={onAddPeople}
                className="rounded-xl flex items-center gap-1.5 text-xs font-semibold px-4"
            >
                <UserPlus className="w-4 h-4 text-[--accent-warm]" /> Add People
            </Button>
            ) : (
            <Button
                variant={isJoined ? 'outline' : 'primary'}
                size="sm"
                onClick={onToggleJoin}
                className="rounded-xl flex items-center gap-1.5 text-xs font-semibold px-4"
            >
                {isJoinPending ? (
                <>
                    <Check className="w-4 h-4 text-amber-500" /> Request Pending
                </>
                ) : isJoined ? (
                <>
                    <LogOut className="w-4 h-4" /> Exit Orbit
                </>
                ) : (
                <>
                    <Plus className="w-4 h-4" /> Join Orbit
                </>
                )}
            </Button>
            )}

            {/* Post Button: Only visible if user is owner OR has joined */}
            {(isOwner || isJoined) && (
            <Button
                variant="primary"
                size="sm"
                onClick={onOpenDrawer}
                className="rounded-xl flex items-center gap-1.5 text-xs font-semibold px-4"
            >
                <Plus className="w-4 h-4" /> Post
            </Button>
            )}
        </div>
        </div>
    </div>
    </div>
);
}
