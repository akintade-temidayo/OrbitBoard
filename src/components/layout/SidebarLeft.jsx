'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Compass, PlusCircle } from 'lucide-react';
import { orbitService } from '@/services/orbitService';
import Avatar from '@/components/ui/Avatar';
import FeedFilterTabs from '@/components/feed/FeedFilterTabs';

export default function SidebarLeft({ activeTab, onTabChange }) {
const pathname = usePathname();
const [orbits, setOrbits] = useState([]);

useEffect(() => {
    orbitService.getAllOrbits().then(setOrbits).catch((error) => console.error('Failed to load orbits:', error));
}, []);

const navItems = [
    { label: 'Home Feed', href: '/', icon: Home },
    { label: 'Explore Orbits', href: '/explore', icon: Compass },
];

return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col gap-5 p-4 h-[calc(100vh-4rem)] overflow-y-auto border-r border-[--border-subtle]">
    {/* Primary Navigation */}
    <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
            <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                ? 'bg-[--accent-warm]/10 text-[--accent-warm] font-semibold'
                : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface-hover]'
            }`}
            >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
            </Link>
        );
        })}
    </nav>

    <hr className="border-[--border-subtle]" />

    {/* Feed Filter Controls */}
    <div className="flex flex-col gap-2">
        <span className="px-2 text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
        Feed Filters
        </span>
        <FeedFilterTabs activeFilter={activeTab} onFilterChange={onTabChange} />
    </div>

    <hr className="border-[--border-subtle]" />

    {/* Community Orbits List */}
    <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2 text-xs font-bold text-[--text-secondary] uppercase tracking-wider">
        <span>Your Orbits</span>
        <Link 
            href="/orbits/create" 
            className="text-[--text-secondary] hover:text-[--accent-warm] transition-colors p-0.5 rounded-md hover:bg-[--bg-surface-hover]"
            title="Create an Orbit"
        >
            <PlusCircle className="w-4 h-4" />
        </Link>
        </div>

        <div className="flex flex-col gap-1">
        {orbits.map((orbit) => (
            <Link
            key={orbit.id}
            href={`/r/${orbit.name}`}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[--text-primary] hover:bg-[--bg-surface-hover] transition-colors"
            >
            <Avatar src={orbit.iconUrl} alt={orbit.name} size="sm" />
            <div className="flex flex-col truncate">
                <span className="font-semibold truncate">r/{orbit.name}</span>
                <span className="text-[10px] text-[--text-secondary]">
                {(orbit.memberCount / 1000).toFixed(1)}k members
                </span>
            </div>
            </Link>
        ))}
        </div>
    </div>
    </aside>
);
}