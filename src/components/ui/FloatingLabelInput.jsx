'use client';

import { useState } from 'react';

export default function FloatingLabelInput({
label,
value = '',
onChange,
type = 'text',
error,
maxLength,
rightElement,
...props
}) {
const [isFocused, setIsFocused] = useState(false);
const isFloating = isFocused || (value && value.toString().length > 0);

return (
<div className="w-full flex flex-col gap-1">
    <div className="relative w-full">
    <input
        {...props}
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`peer w-full px-4 py-3 rounded-xl border bg-(--bg-surface) text-(--text-primary)] transition-all duration-200 outline-none ${
        error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-[--border-subtle] focus:border-(--accent-warm) focus:ring-2 focus:ring-(--accent-warm)/20'
        } ${rightElement ? 'pr-12' : ''}`}
    />

    {/* Floating Label sitting on top border */}
    <label
        className={`absolute pointer-events-none transition-all duration-200 px-1.5 bg-(--bg-surface) rounded ${
        isFloating
            ? '-top-2.5 left-3 text-xs font-semibold text-(--accent-warm)'
            : 'top-3.5 left-4 text-sm text-(--text-secondary)'
        } ${error && isFloating ? 'text-red-500' : ''}`}
    >
        {label}
    </label>

    {/* Optional Icon / Action Button on the Right */}
    {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
        {rightElement}
        </div>
    )}
    </div>

    {/* Error Message */}
    {error && <span className="text-xs text-red-500 font-medium px-1">{error}</span>}
</div>
);
}