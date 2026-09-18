'use client';

export default function Button({ children, variant = 'primary', size = 'md', isLoading, disabled, className = '', ...props }) {
const variants = {
    primary: 'bg-[var(--accent-warm)] text-white hover:opacity-90 active:scale-[0.98]',
    secondary: 'bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-warm)]',
    outline: 'bg-transparent text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-warm)] hover:bg-[var(--bg-surface-hover)]',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-xl font-semibold',
};

return (
    <button
    {...props}
    disabled={disabled || isLoading}
    className={`font-medium transition-all flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
    >
    {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
);
}