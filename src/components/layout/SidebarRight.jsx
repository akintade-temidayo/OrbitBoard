'use client';

import Link from 'next/link';
import { Shield, Sparkles, ExternalLink } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

export default function SidebarRight({ orbit }) {
const currentOrbit = orbit;

if (!currentOrbit) return null;

return (
    <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-5 p-4 h-[calc(100vh-4rem)] overflow-y-auto border-l border-[--border-subtle]">
    {/* Orbit Overview */}
    <div className="p-4 rounded-2xl border border-[--border-subtle] bg-[--bg-surface] flex flex-col gap-3">
        <div className="flex items-center gap-3">
        <Avatar src={currentOrbit.iconUrl} alt={currentOrbit.name} size="lg" />
        <div>
            <h3 className="font-bold text-base text-[--text-primary]">r/{currentOrbit.name}</h3>
            <p className="text-xs text-[--text-secondary]">Created Aug 2026</p>
        </div>
        </div>

        <p className="text-xs text-[--text-secondary] leading-relaxed">
        {currentOrbit.description || 'Welcome to the official community space.'}
        </p>

        <div className="flex items-center justify-between border-t border-[--border-subtle] pt-3 text-xs">
        <div>
            <span className="font-bold text-[--text-primary] block">{(currentOrbit.memberCount / 1000).toFixed(1)}k</span>
            <span className="text-[10px] text-[--text-secondary]">Members</span>
        </div>
        <div>
            <span className="font-bold text-emerald-500 block">● {currentOrbit.onlineCount || 142}</span>
            <span className="text-[10px] text-[--text-secondary]">Online</span>
        </div>
        </div>
    </div>

    {/* Rules */}
    <div className="p-4 rounded-2xl border border-[--border-subtle] bg-[--bg-surface] flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[--text-secondary] flex items-center gap-2">
        <Shield className="w-4 h-4 text-[--accent-warm]" /> Orbit Rules
        </h4>
        <ol className="flex flex-col gap-2.5 text-xs text-[--text-primary] list-decimal list-inside font-medium">
        <li className="pb-2 border-b border-[--border-subtle]/50">Be respectful and constructive</li>
        <li className="pb-2 border-b border-[--border-subtle]/50">No spam or self-promotion</li>
        <li>Use descriptive titles</li>
        </ol>
    </div>

    {/* Trending Topics */}
    <div className="p-4 rounded-2xl border border-[--border-subtle] bg-[--bg-surface] flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[--text-secondary] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" /> Trending Discussions
        </h4>
        <div className="flex flex-col gap-2">
        <Link href="#" className="text-xs text-[--text-primary] font-medium hover:text-[--accent-warm] transition-colors flex items-center justify-between">
            <span>#NextJS15 App Router</span>
            <ExternalLink className="w-3 h-3 text-[--text-secondary]" />
        </Link>
        <Link href="#" className="text-xs text-[--text-primary] font-medium hover:text-[--accent-warm] transition-colors flex items-center justify-between">
            <span>#Tailwind CSS Layouts</span>
            <ExternalLink className="w-3 h-3 text-[--text-secondary]" />
        </Link>
        </div>
    </div>
    </aside>
);
}