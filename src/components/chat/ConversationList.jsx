// src/components/chat/ConversationList.jsx
'use client';

import { useState, useEffect } from 'react';
import { SquarePen, Search, PanelLeftClose, PanelLeftOpen, UsersRound } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

export default function ConversationList({
conversations,
activeId,
currentUserId,
onSelect,
loading,
onStartNewChat,
onStartNewGroup,
isCollapsed = false,
onToggleCollapse,
}) {
const [search, setSearch] = useState('');
const [showNewChat, setShowNewChat] = useState(false);
const [newChatUsername, setNewChatUsername] = useState('');
const [localLastMessages, setLocalLastMessages] = useState({});

useEffect(() => {
    const handleMessagesUpdated = (e) => {
    const { conversationId, messages } = e.detail;
    if (conversationId && messages) {
        const lastMsg = messages[messages.length - 1];
        setLocalLastMessages((prev) => ({
        ...prev,
        [conversationId]: lastMsg,
        }));
    }
    };

    window.addEventListener('orbitboard_messages_updated', handleMessagesUpdated);
    return () => {
    window.removeEventListener('orbitboard_messages_updated', handleMessagesUpdated);
    };
}, []);

const filteredConversations = conversations?.filter((c) =>
    c.participants?.some((p) =>
    p.username?.toLowerCase().includes(search.toLowerCase())
    )
);

const handleCreateChat = (e) => {
    e.preventDefault();
    if (!newChatUsername.trim()) return;

    if (onStartNewChat) {
    onStartNewChat(newChatUsername.trim());
    }
    setNewChatUsername('');
    setShowNewChat(false);
};

const getLastMessagePreview = (conv, partnerId) => {
    const storageKey = `orbitboard_messages_${conv?.id || partnerId}`;
    
    if (conv?.id && localLastMessages[conv.id]) {
    const m = localLastMessages[conv.id];
    return m.content || m.text || (m.attachments?.length ? 'Sent an attachment' : 'No messages yet');
    }
    if (partnerId && localLastMessages[partnerId]) {
    const m = localLastMessages[partnerId];
    return m.content || m.text || (m.attachments?.length ? 'Sent an attachment' : 'No messages yet');
    }

    if (typeof window !== 'undefined') {
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
            const last = parsed[parsed.length - 1];
            return last.content || last.text || (last.attachments?.length ? 'Sent an attachment' : 'No messages yet');
        }
        }
    } catch (err) {
        // fallback
    }
    }

    const lastMsg = conv?.lastMessage;
    if (!lastMsg) return 'No messages yet';
    if (typeof lastMsg === 'string') return lastMsg;
    return lastMsg.content || lastMsg.text || (lastMsg.attachments?.length ? 'Sent an attachment' : 'No messages yet');
};

return (
    <div className="w-full flex flex-col h-full bg-[--bg-surface] transition-all duration-200">
    {/* Header */}
    <div className={`p-3.5 border-b border-[--border-subtle] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <h2 className="font-bold text-sm text-[--text-primary]">Messages</h2>}
        
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'gap-1'}`}>
        {onToggleCollapse && (
            <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-main] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
        )}

        {!isCollapsed && (
            <div className="flex items-center gap-1">
                <button
                onClick={() => setShowNewChat((prev) => !prev)}
                className="p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-main] transition-colors"
                title="New Message"
                >
                <SquarePen className="w-4 h-4" />
                </button>
                <button
                onClick={onStartNewGroup}
                className="p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-main] transition-colors"
                title="Create Group Chat"
                >
                <UsersRound className="w-4 h-4" />
                </button>
            </div>
        )}
        </div>
    </div>

    {/* New Chat Form (Only visible in full view) */}
    {showNewChat && !isCollapsed && (
        <form onSubmit={handleCreateChat} className="p-3 border-b border-[--border-subtle] bg-[--bg-main]/50">
        <div className="flex gap-2">
            <input
            type="text"
            value={newChatUsername}
            onChange={(e) => setNewChatUsername(e.target.value)}
            placeholder="Enter username..."
            className="flex-1 bg-[--bg-surface] text-xs px-3 py-1.5 rounded-lg border border-[--border-subtle] outline-none text-[--text-primary]"
            autoFocus
            />
            <button
            type="submit"
            disabled={!newChatUsername.trim()}
            className="px-2.5 py-1.5 bg-[--accent-warm] text-white rounded-lg text-xs font-medium disabled:opacity-50"
            >
            Start
            </button>
        </div>
        </form>
    )}

    {/* Search Bar (Only visible in full view) */}
    {!isCollapsed && (
        <div className="p-2.5 border-b border-[--border-subtle]">
        <div className="flex items-center gap-2 bg-[--bg-main] px-3 py-1.5 rounded-xl border border-[--border-subtle]">
            <Search className="w-3.5 h-3.5 text-[--text-secondary]" />
            <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="bg-transparent text-xs text-[--text-primary] outline-none w-full"
            />
        </div>
        </div>
    )}

    {/* Conversations Container */}
    <div className="flex-1 overflow-y-auto">
        {loading ? (
        <div className="p-4 text-xs text-center text-[--text-secondary]">
            {isCollapsed ? '...' : 'Loading chats...'}
        </div>
        ) : filteredConversations?.length === 0 ? (
        <div className="p-4 text-xs text-center text-[--text-secondary]">
            {!isCollapsed && 'No conversations found.'}
        </div>
        ) : (
        filteredConversations?.map((conv) => {
            const partner =
            conv.participants?.find((p) => p.id !== (currentUserId || activeId)) ||
            conv.participants?.[0] ||
            conv.participant;

            const isActive = conv.id === activeId;
            const unreadCount = Number(conv.unreadCount || (conv.hasUnread ? 1 : 0));
            const previewText = getLastMessagePreview(conv, partner?.id);
            const isGroupConversation = conv.type === 'group' || conv.type === 'orbit';
            const avatarSource = isGroupConversation ? conv.avatarUrl : partner?.avatarUrl;
            const avatarAlt = isGroupConversation ? conv.name : partner?.username;

            return (
            <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                title={isCollapsed ? (conv.name || `u/${partner?.username || 'user'}`) : undefined}
                className={`w-full p-3 flex items-center border-b border-[--border-subtle]/50 hover:bg-[--bg-main]/50 transition-colors ${
                isActive ? 'bg-[--bg-main]' : ''
                } ${isCollapsed ? 'justify-center px-0' : 'gap-3 text-left'}`}
            >
                {/* Avatar with unread count */}
                <div className="relative shrink-0">
                <Avatar src={avatarSource} alt={avatarAlt} size="sm" />
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-[--accent-warm] text-[9px] font-bold text-white ring-2 ring-[--bg-surface]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
                </div>

                {/* Details (Hidden in Rail view) */}
                {!isCollapsed && (
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold text-xs text-[--text-primary] truncate">
                        {conv.name || `u/${partner?.username || 'user'}`}
                    </span>
                    </div>
                    <p className="text-[11px] text-[--text-secondary] truncate">
                    {previewText}
                    </p>
                </div>
                )}
            </button>
            );
        })
        )}
    </div>
    </div>
);
}
