'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { chatService } from '@/services/chatService';
import { useAuth } from '@/hooks/useAuth';
import ConversationList from '@/components/chat/ConversationList';
import CreateGroupModal from '@/components/chat/CreateGroupModal';

export default function MessagesLayout({ children }) {
const { user } = useAuth();
const router = useRouter();
const params = useParams();
const activeId = params?.conversationId;

const [conversations, setConversations] = useState([]);
const [loading, setLoading] = useState(true);
const [isCollapsed, setIsCollapsed] = useState(() => Boolean(activeId));
const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
const [isCreatingGroup, setIsCreatingGroup] = useState(false);

const unreadCountsFromStorage = () => {
    try {
    return JSON.parse(localStorage.getItem('orbitboard_unread_messages') || '{}');
    } catch {
    return {};
    }
};

const sortByLatestMessage = (items) => [...items].sort((first, second) => (
    new Date(second.updatedAt || second.lastMessage?.createdAt || 0).getTime() -
    new Date(first.updatedAt || first.lastMessage?.createdAt || 0).getTime()
));

useEffect(() => {
    async function fetchConversations() {
    try {
        setLoading(true);
        const data = await chatService.getConversations();
        const unreadCounts = unreadCountsFromStorage();
        const normalizedData = (data || []).map((conv) => ({
        ...conv,
        unreadCount: unreadCounts[conv.id] ?? conv.unreadCount ?? 0,
        lastMessage: conv.lastMessage?.text || conv.lastMessage,
        }));
        setConversations(sortByLatestMessage(normalizedData));
    } catch (err) {
        console.error('Failed to load conversations:', err);
    } finally {
        setLoading(false);
    }
    }
    fetchConversations();
}, [user?.id]);

useEffect(() => {
    const moveConversationToTop = (event) => {
    const { conversationId, lastMessage, updatedAt, unreadCount } = event.detail || {};
    if (!conversationId) return;

    setConversations((previous) => {
        const conversation = previous.find((item) => item.id === conversationId);
        if (!conversation) return previous;

        const updatedConversation = {
        ...conversation,
        lastMessage: lastMessage ?? conversation.lastMessage,
        updatedAt: updatedAt ?? conversation.updatedAt,
        unreadCount: unreadCount ?? conversation.unreadCount ?? 0,
        };
        return [updatedConversation, ...previous.filter((item) => item.id !== conversationId)];
    });
    };

    window.addEventListener('conversation_updated', moveConversationToTop);
    return () => window.removeEventListener('conversation_updated', moveConversationToTop);
}, []);

useEffect(() => {
    const handleLiveMessage = (event) => {
    const message = event.detail?.message;
    if (!message?.conversationId) return;

    const isActive = event.detail?.isActive || message.conversationId === activeId;
    const preview = message.content || message.text || (message.attachments?.length ? 'Sent an attachment' : 'New message');

    setConversations((previous) => {
        const conversation = previous.find((item) => item.id === message.conversationId);
        if (!conversation) return previous;

        const unreadCount = isActive ? 0 : (conversation.unreadCount || 0) + 1;
        const updatedConversation = {
        ...conversation,
        lastMessage: message,
        updatedAt: message.createdAt || new Date().toISOString(),
        unreadCount,
        };

        return [updatedConversation, ...previous.filter((item) => item.id !== message.conversationId)];
    });
    };

    const handleConversationRead = (event) => {
    const conversationId = event.detail?.conversationId;
    if (!conversationId) return;
    setConversations((previous) => previous.map((conversation) => (
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
    )));
    };

    window.addEventListener('orbitboard_chat_message', handleLiveMessage);
    window.addEventListener('orbitboard_chat_read', handleConversationRead);
    return () => {
    window.removeEventListener('orbitboard_chat_message', handleLiveMessage);
    window.removeEventListener('orbitboard_chat_read', handleConversationRead);
    };
}, [activeId]);

const handleSelectConversation = (conversation) => {
    // Automatically collapse sidebar on selecting a chat
    setIsCollapsed(true);
    router.push(`/messages/${conversation.id}`);
};

const handleStartNewChat = (username) => {
    const existing = conversations.find((c) =>
    c.participants?.some((p) => p.username.toLowerCase() === username.toLowerCase())
    );

    setIsCollapsed(true);

    if (existing) {
    router.push(`/messages/${existing.id}`);
    } else {
    chatService.createDirectConversation(username)
        .then((newConversation) => router.push(`/messages/${newConversation.conversationId || newConversation.id}`))
        .catch((error) => console.error('Failed to create direct conversation:', error));
    }
};

const handleCreateGroup = async ({ name, participantIds }) => {
    if (!user?.id) return false;

    setIsCreatingGroup(true);
    try {
    const newGroup = await chatService.createGroup({ name, participantIds });
    setConversations((prev) => [newGroup, ...prev]);
    setIsCollapsed(true);
    router.push(`/messages/${newGroup.id}`);
    return true;
    } catch (err) {
    console.error('Failed to create group chat:', err);
    return false;
    } finally {
    setIsCreatingGroup(false);
    }
};

return (
    <div className="flex h-full min-h-0 w-full min-w-0 overflow-hidden bg-[--bg-surface]">
    {/* Sidebar - Toggles between full w-72 and compact w-16 */}
    <div
        className={`${
        activeId ? 'hidden md:flex' : 'flex'
        } ${
        isCollapsed ? 'md:w-16' : 'md:w-72'
        } w-full flex-col border-r border-[--border-subtle] h-full shrink-0 transition-all duration-200 ease-in-out`}
    >
        <ConversationList
        conversations={conversations}
        activeId={activeId}
        currentUserId={user?.id}
        onSelect={handleSelectConversation}
        onStartNewChat={handleStartNewChat}
        onStartNewGroup={() => setIsGroupModalOpen(true)}
        loading={loading}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
    </div>

    {/* Main Chat Area Workspace */}
    <div
        className={`${
        !activeId ? 'hidden md:flex' : 'flex'
        } flex-1 flex-col h-full overflow-hidden min-w-0`}
    >
        {children}
    </div>

    <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onCreate={handleCreateGroup}
        isCreating={isCreatingGroup}
    />
    </div>
);
}
