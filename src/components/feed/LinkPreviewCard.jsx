'use client';

import { ExternalLink, Globe } from 'lucide-react';
import Image from 'next/image';

export default function LinkPreviewCard({ url, title, description, image }) {
if (!url) return null;
const domain = new URL(url).hostname.replace('www.', '');

return (
    <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col sm:flex-row rounded-2xl border border-[--border-subtle] bg-[--bg-main] overflow-hidden hover:border-[--accent-warm] transition-all shadow-sm my-2"
    >
    {image && (
        <div className="sm:w-44 h-36 sm:h-auto shrink-0 relative bg-black/5 overflow-hidden">
        <Image src={image} alt={title || 'Link'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" width={176} height={144} />
        </div>
    )}

    <div className="p-3.5 flex flex-col justify-between gap-2 flex-1">
        <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-[10px] font-bold text-[--text-secondary] uppercase">
            <Globe className="w-3.5 h-3.5 text-[--accent-warm]" />
            <span>{domain}</span>
        </div>

        <h4 className="text-xs sm:text-sm font-bold text-[--text-primary] group-hover:text-[--accent-warm] transition-colors line-clamp-2">
            {title || url}
        </h4>

        {description && (
            <p className="text-xs text-[--text-secondary] line-clamp-2 leading-relaxed">
            {description}
            </p>
        )}
        </div>

        <div className="flex items-center gap-1 text-[10px] font-semibold text-[--accent-warm]">
        <span>Visit link</span>
        <ExternalLink className="w-3 h-3" />
        </div>
    </div>
    </a>
);
}