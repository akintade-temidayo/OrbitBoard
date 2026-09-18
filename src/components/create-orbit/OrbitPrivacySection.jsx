'use client';

import { Globe, Lock, CheckCircle2 } from 'lucide-react';

export default function OrbitPrivacySection({ isPrivate, onChange }) {
return (
    <div className="p-6 rounded-3xl bg-[--bg-surface] border border-[--border-subtle] flex flex-col gap-5">
    <h2 className="text-base font-bold text-[--text-primary] border-b border-[--border-subtle] pb-3">
        2. Privacy & Access
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Public Option */}
        <div
        onClick={() => onChange('isPrivate', false)}
        className={`relative p-5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 ${
            !isPrivate
            ? 'bg-[--accent-warm]/10 border-[--accent-warm] shadow-sm'
            : 'bg-[--bg-surface-hover] border-[--border-subtle] opacity-70 hover:opacity-100'
        }`}
        >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[--text-primary] font-bold text-xs">
            <Globe className="w-4 h-4 text-[--accent-warm]" />
            <span>Public Orbit</span>
            </div>
            {!isPrivate && <CheckCircle2 className="w-4 h-4 text-[--accent-warm]" />}
        </div>
        <p className="text-[11px] text-[--text-secondary] leading-relaxed">
            Anyone can view, post, and comment in this community.
        </p>
        </div>

        {/* Private Option */}
        <div
        onClick={() => onChange('isPrivate', true)}
        className={`relative p-5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 ${
            isPrivate
            ? 'bg-[--accent-warm]/10 border-[--accent-warm] shadow-sm'
            : 'bg-[--bg-surface-hover] border-[--border-subtle] opacity-70 hover:opacity-100'
        }`}
        >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[--text-primary] font-bold text-xs">
            <Lock className="w-4 h-4 text-[--accent-warm]" />
            <span>Private Orbit</span>
            </div>
            {isPrivate && <CheckCircle2 className="w-4 h-4 text-[--accent-warm]" />}
        </div>
        <p className="text-[11px] text-[--text-secondary] leading-relaxed">
            Only approved members can view and participate in discussions.
        </p>
        </div>
    </div>
    </div>
);
}