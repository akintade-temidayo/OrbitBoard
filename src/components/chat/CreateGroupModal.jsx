'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { searchService } from '@/services/searchService';

export default function CreateGroupModal({ isOpen, onClose, onCreate, isCreating = false }) {
    const [name, setName] = useState('');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

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

    const reset = () => {
        setName('');
        setQuery('');
        setResults([]);
        setSelectedUsers([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim() || selectedUsers.length === 0) return;
        const created = await onCreate({ name: name.trim(), participantIds: selectedUsers.map((user) => user.id) });
        if (created) {
            reset();
            onClose();
        }
    };

    const availableResults = results.filter((user) => !selectedUsers.some((selected) => selected.id === user.id));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create group chat">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-(--text-primary)">
                    Group name
                    <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Project room" className="rounded-xl border border-(--border-subtle) bg-(--bg-main) px-3 py-2 text-sm outline-none focus:border-(--accent-warm)" autoFocus />
                </label>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-(--text-primary)">Add members</label>
                    <div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-(--text-secondary)" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" className="w-full rounded-xl border border-(--border-subtle) bg-(--bg-main) py-2 pl-9 pr-3 text-xs outline-none focus:border-(--accent-warm)" /></div>
                    {selectedUsers.length > 0 && <div className="flex flex-wrap gap-1.5">{selectedUsers.map((user) => <span key={user.id} className="flex items-center gap-1 rounded-lg bg-(--bg-main) px-2 py-1 text-[11px] text-(--text-primary)">u/{user.username}<button type="button" onClick={() => setSelectedUsers((items) => items.filter((item) => item.id !== user.id))} aria-label={`Remove ${user.username}`}><X className="h-3 w-3" /></button></span>)}</div>}
                    {isSearching && <Loader2 className="mx-auto h-4 w-4 animate-spin text-(--text-secondary)" />}
                    {!isSearching && query.trim() && <div className="max-h-36 overflow-y-auto">{availableResults.map((user) => <button key={user.id} type="button" onClick={() => { setSelectedUsers((items) => [...items, user]); setQuery(''); }} className="flex w-full items-center gap-2 rounded-lg px-1 py-2 text-left hover:bg-(--bg-main)"><Avatar src={user.avatarUrl} alt={user.username} size="sm" /><span className="text-xs font-medium text-(--text-primary)">u/{user.username}</span></button>)}{availableResults.length === 0 && <p className="py-2 text-center text-xs text-(--text-secondary)">No users found.</p>}</div>}
                </div>
                <div className="flex justify-end gap-2"><Button type="button" variant="outline" size="sm" onClick={() => { reset(); onClose(); }} disabled={isCreating}>Cancel</Button><Button type="submit" size="sm" disabled={isCreating || !name.trim() || selectedUsers.length === 0}>{isCreating ? 'Creating...' : 'Create group'}</Button></div>
            </form>
        </Modal>
    );
}
