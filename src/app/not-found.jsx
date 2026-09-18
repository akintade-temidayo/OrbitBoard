'use client';

import Link from 'next/link';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
return (
    <div className="min-h-screen w-full bg-[--bg-main] flex flex-col items-center justify-center p-6 text-center">
    {/* Decorative Glow Icon */}
    <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-[--bg-surface] border border-[--border-subtle] flex items-center justify-center text-[--accent-warm] shadow-lg">
        <Compass className="w-12 h-12 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[--accent-warm] text-white text-[10px] font-bold uppercase tracking-wider">
        404
        </div>
    </div>

    {/* Main Message */}
    <div className="flex flex-col gap-2 max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-[--text-primary]">
        Lost in Space?
        </h1>
        <p className="text-xs md:text-sm text-[--text-secondary] leading-relaxed">
        The page, Orbit, or user profile you are looking for has drifted out of reach or doesn&apos;t exist in our galaxy.
        </p>
    </div>

    {/* Action CTA Buttons */}
    <div className="flex items-center gap-3 mt-8">
        <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[--border-subtle] bg-[--bg-surface] text-[--text-primary] text-xs font-semibold hover:bg-[--bg-surface-hover] transition-all"
        >
        <ArrowLeft className="w-4 h-4" />
        <span>Go Back</span>
        </button>

        <Link
        href="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        style={{ backgroundColor: 'var(--accent-warm)' }}
        >
        <Home className="w-4 h-4" />
        <span>Return Home</span>
        </Link>
    </div>
    </div>
);
}