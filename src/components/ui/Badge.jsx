'use client';

export default function Badge({ children, variant = 'info', className = '' }) {
const variants = {
    info: 'bg-[var(--accent-warm)]/10 text-[var(--accent-warm)] border-[var(--accent-warm)]/20',
    mod: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    admin: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
};

return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
    {children}
    </span>
);
}