'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function MobileBottomBar() {
const pathname = usePathname();
const { user } = useAuth();

const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Create', href: '/submit', icon: PlusCircle, isPrimary: true },
    { label: 'Chat', href: '/messages', icon: MessageSquare },
    { label: 'Profile', href: user ? `/profile/${user.username}` : '/login', icon: User },
];

return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[--bg-surface]/90 backdrop-blur-lg border-t border-[--border-subtle] px-3 py-2 flex items-center justify-around">
    {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href ? pathname === item.href : false;

        if (item.isPrimary) {
        return (
            <Link
            key={item.label}
            href={item.href}
            className="p-3 bg-[#334155] dark:bg-[#334155] text-white rounded-full shadow-lg hover:opacity-90 transition-transform active:scale-95 -mt-5 border-4 border-[--bg-surface] flex items-center justify-center"
            aria-label="Create Post"
            >
            <Icon className="w-5 h-5 text-white" />
            </Link>
        );
        }

        return (
        <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            isActive ? 'text-blue dark:text-blue font-bold' : 'text-[--text-secondary] hover:text-[--text-primary]'
            }`}
        >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
        </Link>
        );
    })}
    </nav>
);
}