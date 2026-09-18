'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import SidebarLeft from '@/components/layout/SidebarLeft';
import SidebarRight from '@/components/layout/SidebarRight';
import MobileBottomBar from '@/components/layout/MobileBottomBar';
import ChatNotifications from '@/components/chat/ChatNotifications';

export default function MainLayout({ children }) {
const [activeTab, setActiveTab] = useState('hot');

return (
    <div className="h-[100dvh] w-full min-w-0 overflow-hidden bg-[--bg-main] text-[--text-primary] flex flex-col">
    {/* Sticky Top Navbar */}
    <Navbar />
    <ChatNotifications />

    {/* 3-Column Independent Scroll Area */}
    <div className="flex-1 flex w-full min-w-0 max-w-7xl mx-auto overflow-hidden">
        {/* Left Sidebar */}
        <SidebarLeft activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Center Main Content */}
        <main className="flex-1 min-w-0 h-[calc(100dvh-4rem)] overflow-y-auto">
        {children}
        </main>

        {/* Right Sidebar */}
        <SidebarRight />
    </div>

    {/* Mobile Bottom Navigation Bar */}
    <MobileBottomBar />
    </div>
);
}
