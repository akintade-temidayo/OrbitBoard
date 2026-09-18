'use client';

export default function Avatar({ src, alt, size = 'md', className = '' }) {
// Ensure alt is safely resolved to a string
const safeAlt = typeof alt === 'string' && alt.trim() ? alt : 'User';
const initial = safeAlt.charAt(0).toUpperCase();

const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-base',
};

return (
    <div
    className={`relative rounded-full overflow-hidden bg-[--bg-surface-hover] flex items-center justify-center shrink-0 border border-[--border-subtle] ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
    {src ? (
        <img src={src} alt={safeAlt} className="w-full h-full object-cover" />
    ) : (
        <div className="w-full h-full flex items-center justify-center font-bold text-[--text-secondary]">
        {initial}
        </div>
    )}
    </div>
);
}