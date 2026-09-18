'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabsNav from '@/components/profile/ProfileTabsNav';
import UnaddModal from '@/components/profile/UnaddModal';
import EditProfileModal from '@/components/profile/EditProfileModal';
import DeactivateModal from '@/components/profile/DeactivateModal';
import SettingsTab from '@/components/profile/SettingsTab';
import OrbitsTab from '@/components/profile/OrbitsTab';
import PostCard from '@/components/feed/postCard';
import { userService } from '@/services/userService';
import { chatService } from '@/services/chatService';
import { normalizePost } from '@/services/postService';

export default function UserProfilePage() {
const params = useParams();
const router = useRouter();
const { user: currentUser, logout, updateUser } = useAuth();

const targetUsername = params?.username;
const isOwnProfile = currentUser?.username?.toLowerCase() === targetUsername?.toLowerCase();

const [activeTab, setActiveTab] = useState('orbits');
const [profileData, setProfileData] = useState(null);
const [loading, setLoading] = useState(true);
const [friendStatus, setFriendStatus] = useState('none');
const [error, setError] = useState('');

const [isUnaddModalOpen, setIsUnaddModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
const [isDeactivating, setIsDeactivating] = useState(false);

useEffect(() => {
    async function fetchUserProfile() {
    try {
        setLoading(true);
        setError('');

        if (!targetUsername) {
        notFound();
        return;
        }

        const profile = await userService.getProfile(targetUsername);
        setProfileData(profile);
        const friendship = profile?.friendship;
        setFriendStatus(
        friendship?.status === 'accepted'
            ? 'friends'
            : friendship?.direction === 'outgoing'
                ? 'outgoing'
                : friendship?.direction === 'incoming'
                    ? 'incoming'
                    : 'none'
        );
    } catch (err) {
        console.error('Failed to load profile:', err);
        setError(err.message || 'Unable to load this profile.');
    } finally {
        setLoading(false);
    }
    }

    if (targetUsername) fetchUserProfile();
}, [targetUsername]);

const handleUpdateProfile = async (updatedFields) => {
    if (!isOwnProfile) return;

    const savedProfile = await userService.updateProfile({
    fullName: updatedFields.displayName,
    avatarUrl: updatedFields.avatarUrl,
    bio: updatedFields.bio,
    });
    updateUser(savedProfile);
    setProfileData((prev) => ({ ...prev, ...savedProfile }));
};

const handleFriendAction = async () => {
    if (friendStatus === 'none') {
    await userService.sendFriendRequest(profileData.id);
    setFriendStatus('outgoing');
    }
};

const handleConfirmUnadd = () => {
    setIsUnaddModalOpen(false);
};

const handleStartChat = async () => {
    if (friendStatus !== 'friends') return;
    const conversation = await chatService.createDirectConversation(profileData.id);
    router.push(`/messages/${conversation.id}`);
};

const handleConfirmDeactivate = async () => {
    try {
    setIsDeactivating(true);
    if (logout) await logout();
    router.push('/onboarding');
    } catch (error) {
    console.error('Failed to deactivate account:', error);
    } finally {
    setIsDeactivating(false);
    setIsDeactivateModalOpen(false);
    }
};

if (loading) {
    return (
    <div className="flex-1 flex items-center justify-center p-12 text-xs text-[--text-secondary]">
        Loading profile...
    </div>
    );
}

if (error) {
    return <div className="flex-1 p-12 text-center text-sm text-red-500">{error}</div>;
}

if (!profileData) return null;

const profilePosts = (profileData.posts || []).map(normalizePost);

return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 flex flex-col gap-6">
    <ProfileHeader
        profileData={profileData}
        isOwnProfile={isOwnProfile}
        friendStatus={friendStatus}
        onFriendAction={handleFriendAction}
        onStartChat={handleStartChat}
    />

    <ProfileTabsNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOwnProfile={isOwnProfile}
        orbitsCount={profileData.orbitsCount ?? profileData.orbits?.length ?? 0}
        postsCount={profileData.postsCount ?? 0}
        savedCount={profileData.savedPostsCount ?? 0}
    />

    <div className="flex-1">
        {activeTab === 'orbits' && <OrbitsTab orbits={profileData.orbits || []} isOwnProfile={isOwnProfile} />}
        {activeTab === 'posts' && (profilePosts.length > 0 ? (
        <div className="flex flex-col gap-4">
            {profilePosts.map((post, index) => (
            <PostCard key={post.id} post={post} isAboveFold={index === 0} />
            ))}
        </div>
        ) : (
        <div className="text-center py-12 border border-dashed border-[--border-subtle] rounded-xl text-xs text-[--text-secondary]">
            No posts from u/{profileData.username} yet.
        </div>
        ))}
        {activeTab === 'saved' && isOwnProfile && (
        <div className="text-center py-12 border border-dashed border-[--border-subtle] rounded-xl text-xs text-[--text-secondary]">
            Your saved posts will appear here.
        </div>
        )}
        {activeTab === 'settings' && isOwnProfile && (
        <SettingsTab
            onOpenEditModal={() => setIsEditModalOpen(true)}
            onOpenDeactivateModal={() => setIsDeactivateModalOpen(true)}
        />
        )}
    </div>

    <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={profileData}
        onSave={handleUpdateProfile}
    />

    <UnaddModal
        isOpen={isUnaddModalOpen}
        onClose={() => setIsUnaddModalOpen(false)}
        username={profileData.username}
        onConfirm={handleConfirmUnadd}
    />

    <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        username={currentUser?.username}
        onConfirm={handleConfirmDeactivate}
        isDeactivating={isDeactivating}
    />
    </div>
);
}
