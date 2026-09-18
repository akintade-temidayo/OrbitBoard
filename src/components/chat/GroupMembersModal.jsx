'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, UserPlus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { searchService } from '@/services/searchService';

export default function GroupMembersModal({ isOpen, onClose, conversation, currentUser, onUpdate }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen || !query.trim()) {
            return;
        }
        let cancelled = false;
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const { users } = await searchService.searchAll(query);
                if (!cancelled) setResults(users || []);
            } catch {
                if (!cancelled) setResults([]);
            } finally {
                if (!cancelled) setIsSearching(false);
            }
        }, 300);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [isOpen, query]);

    const handleUpdate = async (action, participant) => {
        setIsSaving(true);
        const updated = await onUpdate({ action, participant });
        setIsSaving(false);
        if (updated && action === 'add') {
            setQuery('');
            setResults([]);
        }
    };

    const existingIds = new Set((conversation?.participants || []).map((participant) => participant.id));
    const availableResults = results.filter((participant) => participant.id !== currentUser?.id && !existingIds.has(participant.id));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={conversation?.name || 'Group members'}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    {conversation?.participants?.map((participant) => (
                        <div key={participant.id} className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <Avatar src={participant.avatarUrl} alt={participant.username} size="sm" />
                                <span className="truncate text-xs font-medium text-(--text-primary)">u/{participant.username}</span>
                                {participant.id === conversation.ownerId && <span className="text-[10px] text-(--accent-warm)">Owner</span>}
                            </div>
                            {participant.id !== currentUser?.id && participant.id !== conversation.ownerId && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleUpdate('remove', participant)} disabled={isSaving} className="text-xs text-red-500">Remove</Button>
                            )}
                        </div>
                    ))}
                </div>
                <div className="border-t border-(--border-subtle) pt-4">
                    <label className="relative block">
                        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-(--text-secondary)" />
                        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people to add" className="w-full rounded-xl border border-(--border-subtle) bg-(--bg-main) py-2 pl-9 pr-3 text-xs outline-none focus:border-(--accent-warm)" />
                    </label>
                    {isSearching && <Loader2 className="mx-auto my-3 h-4 w-4 animate-spin text-(--text-secondary)" />}
                    {!isSearching && query.trim() && <div className="mt-2 max-h-44 overflow-y-auto">{availableResults.map((participant) => (
                        <div key={participant.id} className="flex items-center justify-between gap-3 px-1 py-2">
                            <div className="flex min-w-0 items-center gap-2"><Avatar src={participant.avatarUrl} alt={participant.username} size="sm" /><span className="truncate text-xs font-medium text-(--text-primary)">u/{participant.username}</span></div>
                            <Button type="button" size="sm" onClick={() => handleUpdate('add', participant)} disabled={isSaving}><UserPlus className="h-3.5 w-3.5" /> Add</Button>
                        </div>
                    ))}{availableResults.length === 0 && <p className="py-3 text-center text-xs text-(--text-secondary)">No eligible users found.</p>}</div>}
                </div>
            </div>
        </Modal>
    );
}
