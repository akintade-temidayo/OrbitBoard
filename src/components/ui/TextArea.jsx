'use client';

import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function TextArea({
value = '',
onChange,
placeholder = 'Type a message...',
maxLength = 500,
label,
}) {
const [isExpanded, setIsExpanded] = useState(false);
const textareaRef = useRef(null);

const safeValue = value || '';

// Auto-grow height calculation
useEffect(() => {
    if (textareaRef.current && !isExpanded) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
}, [safeValue, isExpanded]);

return (
    <div className="w-full flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-[--text-secondary]">{label}</label>}

    <div
        style={{ backgroundColor: 'var(--bg-surface)' }}
        className="relative w-full rounded-xl border border-[--border-subtle] focus-within:border-[--accent-warm] transition-all"
    >
        <textarea
        ref={textareaRef}
        value={safeValue}
        maxLength={maxLength}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={1}
        className={`w-full px-4 py-3 bg-transparent text-sm text-[--text-primary] placeholder-[--text-secondary] outline-none resize-none transition-all ${
            isExpanded ? 'h-64' : 'min-h-11'
        }`}
        />

        <div className="flex items-center justify-between px-3 py-2 border-t border-[--border-subtle]/50 text-xs text-[--text-secondary]">
        <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 hover:text-[--text-primary] transition-colors"
        >
            {isExpanded ? (
            <>
                <Minimize2 className="w-3.5 h-3.5" /> Collapse
            </>
            ) : (
            <>
                <Maximize2 className="w-3.5 h-3.5" /> Expand Focus
            </>
            )}
        </button>

        <span>
            {safeValue.length} / {maxLength}
        </span>
        </div>
    </div>
    </div>
);
}