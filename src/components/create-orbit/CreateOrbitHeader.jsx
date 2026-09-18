'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CreateOrbitHeader() {
return (
    <div className="flex flex-col gap-4">
    {/* Back Navigation */}
    <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[--text-secondary] hover:text-[--text-primary] transition-colors w-fit"
    >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
    </Link>

    {/* Banner */}
    <div className="flex flex-col gap-2 p-6 rounded-3xl bg-[--bg-surface] border border-[--border-subtle]">
        <div className="flex items-center gap-2 text-[--accent-warm]">
        <Sparkles className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Launchpad</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[--text-primary]">
        Create an Orbit
        </h1>
        <p className="text-xs md:text-sm text-[--text-secondary]">
        Establish a hub for your community, moderate content, and bring people together around shared interests.
        </p>
    </div>
    </div>
);
}