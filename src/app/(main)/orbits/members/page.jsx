// app/(main)/orbits/members/page.jsx
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MoreVertical, Shield, ShieldOff, UserX, Crown, ArrowLeft, Loader2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { orbitService } from '@/services/orbitService';

function MembersContent() {
const searchParams = useSearchParams();
const router = useRouter();
const orbitName = searchParams.get('orbit');

const [members, setMembers] = useState([]);
const [loading, setLoading] = useState(true);
const [activeMenuId, setActiveMenuId] = useState(null);
const menuRef = useRef(null);

// Fetch members when orbitName changes. State updates occur asynchronously
// after the external request resolves, rather than in the effect body.
useEffect(() => {
    if (!orbitName) return;

    let cancelled = false;

    orbitService.getMembers(orbitName)
    .then((data) => {
        if (!cancelled) setMembers(data);
    })
    .catch((err) => {
        console.error('Failed to load members:', err);
    })
    .finally(() => {
        if (!cancelled) setLoading(false);
    });

    return () => {
    cancelled = true;
    };
}, [orbitName]);

// Handle clicking outside of active action dropdown
useEffect(() => {
    function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
    }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

const handleUpdateRole = async (userId, newRole) => {
    try {
    await orbitService.updateMemberRole(orbitName, userId, newRole);
    setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
    );
    setActiveMenuId(null);
    } catch (err) {
    console.error('Failed to update role:', err);
    }
};

const handleRemoveMember = async (userId) => {
    try {
    await orbitService.removeMember(orbitName, userId);
    setMembers((prev) => prev.filter((m) => m.id !== userId));
    setActiveMenuId(null);
    } catch (err) {
    console.error('Failed to remove member:', err);
    }
};

return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
    <div className="bg-[--bg-surface] border border-[--border-subtle] rounded-3xl overflow-hidden shadow-sm">
        {/* Header Bar */}
        <div className="p-5 border-b border-[--border-subtle] flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-[--bg-surface-hover] text-[--text-secondary] hover:text-[--text-primary] transition-colors border border-[--border-subtle]"
            aria-label="Go back"
            >
            <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
            <h3 className="text-base font-bold text-[--text-primary]">Community Members</h3>
            <p className="text-xs text-[--text-secondary]">
                r/{orbitName || 'community'} • {members.length} members
            </p>
            </div>
        </div>
        </div>

        {/* Member List */}
        <div className="p-4 flex flex-col gap-2.5 min-h-75">
        {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-[--text-secondary]">
            <Loader2 className="w-6 h-6 animate-spin text-[--accent-warm]" />
            <span className="text-xs">Loading community members...</span>
            </div>
        ) : members.length === 0 ? (
            <div className="py-16 text-center text-xs text-[--text-secondary]">
            No members found in this orbit.
            </div>
        ) : (
            members.map((member) => (
            <div
                key={member.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[--bg-surface-hover] border border-[--border-subtle] relative"
            >
                <div className="flex items-center gap-3 min-w-0">
                <Avatar src={member.avatarUrl} alt={member.name} size="md" />
                <div className="flex flex-col truncate">
                    <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[--text-primary] truncate">
                        {member.name}
                    </span>
                    {member.role === 'admin' && (
                        <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    {member.role === 'moderator' && (
                        <Shield className="w-3.5 h-3.5 text-[--accent-warm]" />
                    )}
                    </div>
                    <span className="text-[10px] text-[--text-secondary]">
                    @{member.username}
                    </span>
                </div>
                </div>

                {/* Action Menu */}
                {member.role !== 'admin' && (
                <div className="relative">
                    <button
                    onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                    className="p-2 rounded-xl hover:bg-[--bg-surface] text-[--text-secondary] hover:text-[--text-primary] transition-colors"
                    >
                    <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === member.id && (
                    <div
                        ref={menuRef}
                        className="absolute right-0 mt-1 w-48 rounded-2xl border border-[--border-subtle] bg-[--bg-surface] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    >
                        {member.role === 'moderator' ? (
                        <button
                            onClick={() => handleUpdateRole(member.id, 'member')}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-500 hover:bg-[--bg-surface-hover] rounded-xl transition-colors"
                        >
                            <ShieldOff className="w-4 h-4" /> Demote to Member
                        </button>
                        ) : (
                        <button
                            onClick={() => handleUpdateRole(member.id, 'moderator')}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-[--text-primary] hover:bg-[--bg-surface-hover] rounded-xl transition-colors"
                        >
                            <Shield className="w-4 h-4 text-[--accent-warm]" /> Make Moderator
                        </button>
                        )}

                        <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors mt-0.5"
                        >
                        <UserX className="w-4 h-4" /> Remove Member
                        </button>
                    </div>
                    )}
                </div>
                )}
            </div>
            ))
        )}
        </div>
    </div>
    </div>
);
}

export default function OrbitMembersPage() {
return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading page...</div>}>
    <MembersContent />
    </Suspense>
);
}