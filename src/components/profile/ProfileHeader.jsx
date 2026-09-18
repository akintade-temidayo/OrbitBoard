'use client';

import { Calendar, ShieldCheck } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import FriendActionButton from './FriendActionButton';

export default function ProfileHeader({ profileData, isOwnProfile, friendStatus, onFriendAction, onStartChat }) {
const joinedDate = profileData.createdAt
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(profileData.createdAt))
    : profileData.joinedDate;

return (
    <div className="bg-[--bg-surface] border border-[--border-subtle] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm">
    <div className="flex gap-4 items-center">
        <Avatar src={profileData.avatarUrl} alt={profileData.username} size="lg" className="w-16 h-16" />
        <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[--text-primary]">u/{profileData.username}</h1>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
        </div>
        <p className="text-xs text-[--text-secondary] max-w-md">{profileData.bio}</p>
        <div className="flex items-center gap-4 text-[11px] text-[--text-secondary] mt-1">
            <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Joined {joinedDate || 'recently'}
            </span>
            <span>•</span>
            <span className="font-medium text-[--text-primary]">{profileData.karma} Karma</span>
        </div>
        </div>
    </div>

    {!isOwnProfile && (
        <FriendActionButton
        friendStatus={friendStatus}
        onAction={onFriendAction}
        onStartChat={onStartChat}
        />
    )}
    </div>
);
}
