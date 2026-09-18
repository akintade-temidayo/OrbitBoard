'use client';

import { useState, useEffect, use, useRef } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Loader2, Search, Users } from 'lucide-react';
import { orbitService } from '@/services/orbitService';
import { postService } from '@/services/postService';
import { searchService } from '@/services/searchService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

import OrbitHeader from '@/components/orbit/OrbitHeader';
import OrbitFeed from '@/components/orbit/OrbitFeed';
import OrbitInfoModal from '@/components/orbit/OrbitInfoModal';
import CreatePostDrawer from '@/components/feed/CreatePostDrawer';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

export default function OrbitCommunityPage({ params }) {
const resolvedParams = use(params);
const orbitName = resolvedParams.orbitName;
const router = useRouter();
const { user, updateUser } = useAuth();
const joinedOrbitIds = user?.joinedOrbitIds;

const [orbit, setOrbit] = useState(null);
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

const [isJoined, setIsJoined] = useState(false);
const [isOwner, setIsOwner] = useState(false);
const [isJoinPending, setIsJoinPending] = useState(false);
const [isExitModalOpen, setIsExitModalOpen] = useState(false);
const [isLeaving, setIsLeaving] = useState(false);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false);
const [memberSearchQuery, setMemberSearchQuery] = useState('');
const [memberSearchResults, setMemberSearchResults] = useState([]);
const [isSearchingMembers, setIsSearchingMembers] = useState(false);
const [memberRole, setMemberRole] = useState('MEMBER');
const [addingMemberIds, setAddingMemberIds] = useState([]);
const [activeTab, setActiveTab] = useState('posts');

const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
const [activeModal, setActiveModal] = useState(null);
const infoMenuRef = useRef(null);

useEffect(() => {
    if (!orbitName || orbitName === 'undefined') {
    router.replace('/explore');
    return;
    }

    async function fetchOrbitData() {
    setLoading(true);

    try {
        const orbitData = await orbitService.getOrbitByName(orbitName);

        if (!orbitData) {
        notFound();
        return;
        }

        setOrbit(orbitData);

        const memberList = orbitData.members || [];
        const isUserMember =
        orbitData.isJoined ||
        joinedOrbitIds?.includes(orbitData.id) ||
        memberList.some((m) => m.userId === user?.id);

        setIsJoined(Boolean(isUserMember));
        const currentMembership = memberList.find((member) => member.userId === user?.id);
        setIsOwner(
        orbitData.creatorId === user?.id ||
            orbitData.creator?.id === user?.id ||
            currentMembership?.role?.toUpperCase() === 'ADMIN'
        );

        const fetchedPosts = await orbitService.getOrbitPosts(orbitName);
        setPosts(fetchedPosts || []);
    } catch (err) {
        console.error('Failed to load orbit data:', err);
        notFound();
    } finally {
        setLoading(false);
    }
    }

    fetchOrbitData();
}, [orbitName, joinedOrbitIds, router, user?.id]);

useEffect(() => {
    function handleClickOutside(event) {
    if (infoMenuRef.current && !infoMenuRef.current.contains(event.target)) {
        setIsInfoMenuOpen(false);
    }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

useEffect(() => {
    if (!isAddPeopleOpen || !memberSearchQuery.trim()) {
    return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
    setIsSearchingMembers(true);
    try {
        const { users } = await searchService.searchAll(memberSearchQuery);
        if (!cancelled) setMemberSearchResults(users || []);
    } catch (err) {
        if (!cancelled) {
        console.error('Failed to search users:', err);
        setMemberSearchResults([]);
        }
    } finally {
        if (!cancelled) setIsSearchingMembers(false);
    }
    }, 300);

    return () => {
    cancelled = true;
    clearTimeout(timer);
    };
}, [isAddPeopleOpen, memberSearchQuery]);

const handleToggleJoin = async () => {
    if (!orbit) return;

    if (isJoinPending) {
    toast('Your request is waiting for an Orbit moderator.');
    return;
    }

    if (isJoined) {
    setIsExitModalOpen(true);
    return;
    }

    try {
    const res = await orbitService.joinOrbit(orbit.id);

    if (res?.joinRequest) {
        setIsJoinPending(true);
        toast.success(`Join request sent to the moderators of ${orbit.name}.`);
        return;
    }

    updateUser?.({
        joinedOrbitIds: [...new Set([...(user?.joinedOrbitIds || []), orbit.id])],
    });
    setIsJoined(true);
    setOrbit((prev) => ({
        ...prev,
        memberCount: (prev.memberCount || 0) + 1,
        _count: { ...prev._count, members: (prev._count?.members || 0) + 1 },
    }));
    toast.success(`Joined ${orbit.name}!`);
    } catch (err) {
    console.error('Failed to toggle membership:', err);
    toast.error('Failed to join Orbit.');
    }
};

const handleConfirmLeave = async () => {
    if (!orbit || isLeaving) return;

    setIsLeaving(true);
    try {
    await orbitService.leaveOrbit(orbit.id);
    updateUser?.({
        joinedOrbitIds: (user?.joinedOrbitIds || []).filter((id) => id !== orbit.id),
    });
    setIsJoined(false);
    setOrbit((prev) => ({
        ...prev,
        memberCount: Math.max((prev.memberCount || 1) - 1, 0),
        _count: { ...prev._count, members: Math.max((prev._count?.members || 1) - 1, 0) },
    }));
    setIsExitModalOpen(false);
    toast.success(`Left ${orbit.name}`);
    } catch (err) {
    console.error('Failed to leave orbit:', err);
    toast.error('Failed to leave Orbit.');
    } finally {
    setIsLeaving(false);
    }
};

const handleVote = async (postId, direction) => {
    try {
    const updatedPost = await postService.votePost(postId, direction);
    setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, ...updatedPost } : p))
    );
    } catch (err) {
    console.error('Failed to vote on post:', err);
    }
};

const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setOrbit((prev) => ({
        ...prev,
        _count: { ...prev._count, posts: (prev._count?.posts || 0) + 1 },
    }));
    setIsDrawerOpen(false);
};

const handleAddMember = async (person) => {
    const targetUserId = person?.id;
    if (!orbit || !targetUserId || addingMemberIds.includes(targetUserId)) return;

    setAddingMemberIds((previous) => [...previous, targetUserId]);
    try {
    const result = await orbitService.addMember(orbit.id, targetUserId, memberRole);
    setOrbit((prev) => ({
        ...prev,
        memberCount: (prev.memberCount || 0) + 1,
        _count: { ...prev._count, members: (prev._count?.members || 0) + 1 },
        members: [
        ...(prev.members || []),
        {
            ...(result?.membership || result?.member || {}),
            userId: targetUserId,
            role: memberRole,
            user: person,
        },
        ],
    }));
    toast.success('Member added to the orbit.');
    } catch (err) {
    console.error('Failed to add member:', err);
    toast.error(err.message || 'Failed to add member.');
    } finally {
    setAddingMemberIds((previous) => previous.filter((id) => id !== targetUserId));
    }
};

if (loading) {
    return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-6 animate-pulse">
        <div className="h-44 w-full bg-[--bg-surface] rounded-2xl border border-[--border-subtle]" />
        <div className="h-16 w-full bg-[--bg-surface] rounded-2xl border border-[--border-subtle]" />
        <div className="flex flex-col gap-4">
        {[1, 2].map((n) => (
            <div key={n} className="h-40 w-full bg-[--bg-surface] rounded-2xl border border-[--border-subtle]" />
        ))}
        </div>
    </div>
    );
}

if (!orbit) return null;

const memberCount = orbit._count?.members ?? orbit.memberCount ?? orbit.members?.length ?? 0;
const postCount = orbit._count?.posts ?? posts.length;
const canViewMembers = isJoined || isOwner;

return (
    <div className="flex-1 flex flex-col min-h-full pb-16 md:pb-6">
    <OrbitHeader
        orbit={orbit}
        isJoined={isJoined}
        isJoinPending={isJoinPending}
        isOwner={isOwner}
        onToggleJoin={handleToggleJoin}
        onAddPeople={() => setIsAddPeopleOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        infoMenuRef={infoMenuRef}
        isInfoMenuOpen={isInfoMenuOpen}
        setIsInfoMenuOpen={setIsInfoMenuOpen}
        onSelectModal={(modal) => setActiveModal(modal)}
    />

    <div className="p-4 md:p-6 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[--border-subtle] bg-[--bg-surface] px-3 py-2">
        <div className="flex items-center gap-1">
            <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'posts' ? 'bg-[--bg-surface-hover] text-[--text-primary]' : 'text-[--text-secondary] hover:text-[--text-primary]'}`}
            >
            Posts
            </button>
            {canViewMembers && (
            <button
                type="button"
                onClick={() => setActiveTab('members')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'members' ? 'bg-[--bg-surface-hover] text-[--text-primary]' : 'text-[--text-secondary] hover:text-[--text-primary]'}`}
            >
                Members
            </button>
            )}
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-[--text-secondary]">
            <span>{postCount} {postCount === 1 ? 'post' : 'posts'}</span>
            <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
        </div>
        </div>

        {activeTab === 'members' && canViewMembers ? (
        <section className="rounded-xl border border-[--border-subtle] bg-[--bg-surface] divide-y divide-[--border-subtle]">
            {(orbit.members || []).length > 0 ? orbit.members.map((member) => {
            const memberUser = member.user || member;
            return (
                <a
                key={member.userId || memberUser.id}
                href={`/profile/${memberUser.username}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[--bg-surface-hover] transition-colors"
                >
                <Avatar src={memberUser.avatarUrl} alt={memberUser.username} size="md" />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[--text-primary]">u/{memberUser.username || 'anonymous'}</p>
                    <p className="text-xs capitalize text-[--text-secondary]">{String(member.role || 'MEMBER').toLowerCase()}</p>
                </div>
                <Users className="h-4 w-4 text-[--text-secondary]" aria-hidden="true" />
                </a>
            );
            }) : (
            <p className="px-4 py-10 text-center text-sm text-[--text-secondary]">No members are available yet.</p>
            )}
        </section>
        ) : (
        <OrbitFeed
            posts={posts}
            onVote={handleVote}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            orbitName={orbit.name}
        />
        )}
    </div>

    <OrbitInfoModal
        activeModal={activeModal}
        orbit={orbit}
        onClose={() => setActiveModal(null)}
    />

    <Modal
        isOpen={isExitModalOpen}
        onClose={() => !isLeaving && setIsExitModalOpen(false)}
        title={`Leave ${orbit.name}?`}
    >
        <p className="text-sm leading-relaxed text-[--text-secondary]">
        Are you sure you want to leave this orbit? You can join again later.
        </p>
        <div className="mt-5 flex justify-end gap-2">
        <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExitModalOpen(false)}
            disabled={isLeaving}
            className="rounded-xl text-xs font-semibold"
        >
            Cancel
        </Button>
        <Button
            variant="primary"
            size="sm"
            onClick={handleConfirmLeave}
            disabled={isLeaving}
            className="rounded-xl bg-red-500 text-xs font-semibold hover:bg-red-600 text-white"
        >
            {isLeaving ? 'Leaving...' : 'Exit Orbit'}
        </Button>
        </div>
    </Modal>

    <Modal
        isOpen={isAddPeopleOpen}
        onClose={() => setIsAddPeopleOpen(false)}
        title={`Add people to r/${orbit.name}`}
    >
        <div className="flex flex-col gap-4">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--text-secondary]" />
            <input
            type="search"
            value={memberSearchQuery}
            onChange={(event) => setMemberSearchQuery(event.target.value)}
            placeholder="Search by username or name"
            autoFocus
            className="w-full rounded-xl border border-[--border-subtle] bg-[--bg-surface-hover] py-2.5 pl-9 pr-9 text-sm text-[--text-primary] outline-none focus:border-[--accent-warm]"
            />
            {isSearchingMembers && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[--accent-warm]" />
            )}
        </div>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-[--text-secondary]">
            Role
            <select
            value={memberRole}
            onChange={(event) => setMemberRole(event.target.value)}
            className="w-full rounded-xl border border-[--border-subtle] bg-[--bg-surface-hover] px-3 py-2.5 text-sm text-[--text-primary] outline-none focus:border-[--accent-warm]"
            >
            <option value="MEMBER">Member</option>
            <option value="MODERATOR">Moderator</option>
            </select>
        </label>

        <div className="max-h-64 overflow-y-auto rounded-xl border border-[--border-subtle]">
            {!memberSearchQuery.trim() ? (
            <p className="px-3 py-8 text-center text-xs text-[--text-secondary]">Search for someone to add.</p>
            ) : !isSearchingMembers && memberSearchResults.filter((person) =>
                person.id !== user?.id && !orbit.members?.some((member) => member.userId === person.id)
            ).length === 0 ? (
            <p className="px-3 py-8 text-center text-xs text-[--text-secondary]">No eligible users found.</p>
            ) : (
            memberSearchResults
                .filter((person) => person.id !== user?.id && !orbit.members?.some((member) => member.userId === person.id))
                .map((person) => (
                <div key={person.id} className="flex items-center gap-3 border-b border-[--border-subtle] px-3 py-2.5 last:border-b-0">
                    <Avatar src={person.avatarUrl} alt={person.username} size="md" />
                    <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[--text-primary]">u/{person.username}</p>
                    <p className="truncate text-xs text-[--text-secondary]">{person.fullName || person.name || 'OrbitBoard member'}</p>
                    </div>
                    <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    disabled={addingMemberIds.includes(person.id)}
                    onClick={() => handleAddMember(person)}
                    >
                    {addingMemberIds.includes(person.id) ? 'Adding...' : 'Add'}
                    </Button>
                </div>
                ))
            )}
        </div>
        </div>
    </Modal>

    <CreatePostDrawer
        isOpen={isDrawerOpen}
        defaultOrbitName={orbit.name}
        onClose={() => setIsDrawerOpen(false)}
        onPostCreated={handlePostCreated}
    />
    </div>
);
}
