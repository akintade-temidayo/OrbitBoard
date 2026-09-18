'use client';

import { Settings } from 'lucide-react';

export default function ProfileTabsNav({ activeTab, setActiveTab, isOwnProfile, orbitsCount, postsCount, savedCount }) {
const tabs = [
    { id: 'orbits', label: `Orbits (${orbitsCount})`, visible: true },
    { id: 'posts', label: `Posts (${postsCount})`, visible: true },
    { id: 'saved', label: `Saved (${savedCount})`, visible: isOwnProfile },
    { id: 'settings', label: 'Settings', icon: Settings, visible: isOwnProfile },
];

return (
    <div className="flex border-b border-[--border-subtle] gap-6 text-xs font-medium">
    {tabs.filter((tab) => tab.visible).map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
        <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2.5 transition-colors relative flex items-center gap-1 ${
            isActive ? 'text-[--text-primary] font-bold' : 'text-[--text-secondary] hover:text-[--text-primary]'
            }`}
        >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {tab.label}
            {isActive && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[--accent-warm] rounded-full" />
            )}
        </button>
        );
    })}
    </div>
);
}