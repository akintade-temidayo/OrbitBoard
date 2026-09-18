'use client';

import { MessageSquare, UserPlus, UserRoundX } from 'lucide-react';

export default function FriendActionButton({ friendStatus, onAction, onStartChat }) {
const isFriend = friendStatus === 'friends';
const isPending = friendStatus === 'outgoing';
const isIncoming = friendStatus === 'incoming';

return (
    <div className="flex items-center gap-2 shrink-0">
    {/* Friend Toggle Button */}
    <button
        onClick={onAction}
        disabled={isFriend || isPending || isIncoming}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
        isFriend
            ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500/50'
            : 'bg-[--bg-surface] border-[--border-subtle] text-[--text-primary] hover:bg-[--bg-main]'
        }`}
    >
        {isFriend ? (
        <>
            <UserRoundX className="w-4 h-4 text-red-500" />
            Friends
        </>
        ) : isPending ? (
        <>
            <UserPlus className="w-4 h-4 text-[--text-secondary]" />
            Request Sent
        </>
        ) : isIncoming ? (
        <>
            <UserPlus className="w-4 h-4 text-[--text-secondary]" />
            Request Received
        </>
        ) : (
        <>
            <UserPlus className="w-4 h-4 text-[--text-secondary]" />
            Add Friend
        </>
        )}
    </button>

    {/* Direct Message Button */}
    <button
        onClick={onStartChat}
        disabled={!isFriend}
        title={!isFriend ? 'Add as friend to send direct messages' : 'Start conversation'}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
        isFriend
            ? 'bg-[--accent-warm] hover:opacity-90 text-white cursor-pointer'
            : 'bg-[--bg-main] text-[--text-secondary] border border-[--border-subtle] opacity-60 cursor-not-allowed'
        }`}
    >
        <MessageSquare className="w-4 h-4" />
        Chat
    </button>
    </div>
);
}
