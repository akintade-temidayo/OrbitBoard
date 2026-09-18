'use client';

import { Phone, Video, MoreVertical, ArrowLeft, UsersRound } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

export default function ChatHeader({
user,
conversation,
onOpenProfile,
onBack,
onCall,
onVideoCall,
onMoreClick,
onManageGroup,
}) {
return (
    <div className="flex items-center justify-between px-4 py-3 bg-[--bg-surface] border-b border-[--border-subtle] w-full shrink-0">
    {/* Left side: Back button (for mobile) & User info trigger */}
    <div className="flex items-center gap-3 min-w-0">
        {onBack && (
        <button
            type="button"
            onClick={onBack}
            className="sm:hidden p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-main] transition-colors"
            aria-label="Go back"
        >
            <ArrowLeft className="w-5 h-5" />
        </button>
        )}

        {/* Clickable Profile Trigger (Avatar + Info) */}
        <button
        type="button"
        onClick={onOpenProfile}
        className="flex items-center gap-3 text-left p-1 -m-1 rounded-xl hover:bg-[--bg-main]/60 transition-colors group min-w-0"
        >
        <div className="relative shrink-0">
            <Avatar src={user?.avatarUrl} alt={user?.username || conversation?.name} size="md" />
            {user?.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[--bg-surface]" />
            )}
        </div>

        <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-semibold text-[--text-primary] truncate group-hover:text-sky-400 transition-colors">
            {conversation?.name || user?.name || user?.username || 'User'}
            </h2>
            <span className="text-[11px] text-[--text-secondary] truncate">
            {conversation?.type === 'orbit'
            ? `${conversation.participants?.length || 0} members`
            : conversation?.type === 'group'
                ? `${conversation.participants?.length || 0} members`
                : user?.isOnline ? 'Online' : user?.lastSeen || 'Offline'}
            </span>
        </div>
        </button>
    </div>

    {/* Right side: Action Quick Buttons */}
    <div className="flex items-center gap-1 shrink-0">
        {onCall && (
        <button
            type="button"
            onClick={onCall}
            className="p-2 rounded-xl text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-main] transition-colors"
            title="Audio Call"
        >
            <Phone className="w-4 h-4" />
        </button>
        )}

        {onVideoCall && (
        <button
            type="button"
            onClick={onVideoCall}
            className="p-2 rounded-xl text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-main] transition-colors"
            title="Video Call"
        >
            <Video className="w-4 h-4" />
        </button>
        )}

        {onManageGroup && (
        <button
            type="button"
            onClick={onManageGroup}
            className="p-2 rounded-xl text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-main] transition-colors"
            title="Manage Group Members"
        >
            <UsersRound className="w-4 h-4" />
        </button>
        )}

        {onMoreClick && (
        <button
            type="button"
            onClick={onMoreClick}
            className="p-2 rounded-xl text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-main] transition-colors"
            title="More Options"
        >
            <MoreVertical className="w-4 h-4" />
        </button>
        )}
    </div>
    </div>
);
}