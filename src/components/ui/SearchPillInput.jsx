'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchPillInput({ value = '', onChange, placeholder = 'Search Orbits or posts...' }) {
const [isOpen, setIsOpen] = useState(false);
const containerRef = useRef(null);
const inputRef = useRef(null);

useEffect(() => {
    if (isOpen && inputRef.current) {
    inputRef.current.focus();
    }
}, [isOpen]);

useEffect(() => {
    function handleClickOutside(event) {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
    }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

return (
    <div className="relative" ref={containerRef}>
    {/* Search Icon Button */}
    <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2.5 rounded-full border transition-all ${
        isOpen
            ? 'border-[--accent-warm] bg-[--bg-surface-hover] text-[--accent-warm]'
            : 'border-[--border-subtle] bg-[--bg-surface] text-[--text-secondary] hover:text-[--text-primary] hover:border-[--accent-warm]'
        }`}
        aria-label="Toggle search"
    >
        <Search className="w-4 h-4" />
    </button>

    {/* Opaque floating panel driven by the shared theme variables. */}
    {isOpen && (
        <div
            className="fixed sm:absolute top-16 sm:top-full left-4 right-4 sm:left-auto sm:right-0 mt-2 sm:w-96 max-w-[calc(100vw-2rem)] p-3 rounded-2xl border border-[--border-subtle] shadow-2xl z-100 animate-in fade-in slide-in-from-top-2 duration-150"
            style={{ backgroundColor: 'var(--bg-surface)' }}
        >
        <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[--border-subtle] focus-within:border-[--accent-warm] transition-all"
            style={{ backgroundColor: 'var(--bg-surface-hover)' }}
        >
            <Search className="w-4 h-4 text-[--accent-warm] shrink-0" />
            <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-[--text-primary] outline-none placeholder-[--text-secondary]"
            />
            {value && (
            <button
                type="button"
                onClick={() => onChange('')}
                className="p-1 text-[--text-secondary] hover:text-[--text-primary]"
            >
                <X className="w-3.5 h-3.5" />
            </button>
            )}
        </div>
        </div>
    )}
    </div>
);
}
