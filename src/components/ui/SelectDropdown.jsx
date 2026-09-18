'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function SelectDropdown({ options = [], value, onChange, placeholder = 'Select Option', label }) {
const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useRef(null);

const selectedOption = options.find((opt) => opt.value === value);

useEffect(() => {
    const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
    }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

return (
    <div className="relative w-full" ref={dropdownRef}>
    {label && <label className="block text-xs font-semibold text-(--text-secondary) mb-1">{label}</label>}

    <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-(--border-subtle) bg-(--bg-surface) text-left text-sm text-(--text-primary) flex items-center justify-between transition-all hover:border-(--accent-warm)"
    >
        <span className={selectedOption ? 'font-medium' : 'text-(--text-secondary)'}>
        {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-(--text-secondary) transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>

    {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-(--border-subtle) bg-(--bg-surface) shadow-lg py-1.5 overflow-hidden max-h-60 overflow-y-auto">
        {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
            <button
                key={opt.value}
                type="button"
                onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
                }}
                className="group w-full px-4 py-2.5 text-left text-sm text-(--text-primary) hover:bg-(--bg-surface-hover) flex items-center justify-between transition-colors"
            >
                <span>{opt.label}</span>
                <Check
                className={`w-4 h-4 text-(--accent-warm) transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`}
                />
            </button>
            );
        })}
        </div>
    )}
    </div>
);
}