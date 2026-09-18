'use client';

import { ExternalLink, Globe } from 'lucide-react';
import Image from 'next/image';

export default function OpenGraphCard({ ogData }) {
if (!ogData?.url) return null;

// Extract domain name for the badge
const domain = new URL(ogData.url).hostname.replace('www.', '');

return (
    <a
    href={ogData.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col sm:flex-row rounded-2xl border border-[--border-subtle] bg-[--bg-surface] overflow-hidden hover:border-[--accent-warm] transition-all my-2 shadow-sm"
    >
    {ogData.image && (
        <div className="sm:w-48 h-36 sm:h-auto shrink-0 bg-black/5 relative overflow-hidden">
        <Image
            src={ogData.image}
            alt={ogData.title || 'Link preview'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fill
        />
        </div>
    )}

    <div className="p-3.5 sm:p-4 flex flex-col justify-between gap-2 flex-1">
        <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[--text-secondary] uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-[--accent-warm]" />
            <span>{domain}</span>
        </div>

        <h4 className="text-xs sm:text-sm font-bold text-[--text-primary] group-hover:text-[--accent-warm] transition-colors line-clamp-2 leading-snug">
            {ogData.title || ogData.url}
        </h4>

        {ogData.description && (
            <p className="text-xs text-[--text-secondary] line-clamp-2 leading-relaxed">
            {ogData.description}
            </p>
        )}
        </div>

        <div className="flex items-center gap-1 text-[10px] font-semibold text-[--accent-warm] pt-1">
        <span>Visit source</span>
        <ExternalLink className="w-3 h-3" />
        </div>
    </div>
    </a>
);
}