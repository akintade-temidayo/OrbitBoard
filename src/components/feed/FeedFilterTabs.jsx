'use client';

import { Flame, TrendingUp, Clock, ClockArrowUp } from 'lucide-react';

export default function FeedFilterTabs({ activeFilter = 'hot', onFilterChange }) {
const filters = [
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'new', label: 'New', icon: Clock },
    { id: 'top', label: 'Top', icon: TrendingUp },
    { id: 'rising', label: 'Rising', icon: ClockArrowUp },
];

return (
    <nav 
    aria-label="Feed filter tabs"
    className="flex flex-row md:flex-col gap-1.5 w-full overflow-x-auto no-scrollbar py-1"
    >
    {filters.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFilter === tab.id;

        return (
        <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange?.(tab.id)}
            style={isActive ? { backgroundColor: 'var(--accent-warm)', color: '#ffffff' } : undefined}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 md:w-full ${
            isActive
                ? 'font-semibold shadow-xs scale-[1.01]'
                : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface-hover]'
            }`}
        >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
        </button>
        );
    })}
    </nav>
);
}