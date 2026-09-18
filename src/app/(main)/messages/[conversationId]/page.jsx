'use client';

import { useState, useEffect, useRef, use } from 'react';
import { chatService } from '@/services/chatService';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/hooks/useAuth';
import { uploadImage } from '@/services/uploadService';
import ChatWindow from '@/components/chat/ChatWindow';
import GroupMembersModal from '@/components/chat/GroupMembersModal';

export default function ChatPage({ params: paramsPromise }) {
// Unwrap params using React `use()` for Next.js 15+ compatibility
const params = use(paramsPromise);
const conversationId = params.conversationId;

const { user, token } = useAuth();
const { socket, isConnected } = useSocket();

const [conversation, setConversation] = useState(null);
const [loadingThread, setLoadingThread] = useState(true);
const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

const activeIdRef = useRef(conversationId);
useEffect(() => {
    activeIdRef.current = conversationId;
}, [conversationId]);

const markConversationRead = async (id) => {
    if (!id || typeof window === 'undefined') return;

    try {
    await chatService.markConversationRead(id);
    } catch (error) {
    console.error('Failed to mark conversation as read:', error);
    }

    const unreadCounts = (() => {
    try {
        return JSON.parse(localStorage.getItem('orbitboard_unread_messages') || '{}');
    } catch {
        return {};
    }
    })();
    delete unreadCounts[id];
    localStorage.setItem('orbitboard_unread_messages', JSON.stringify(unreadCounts));
    window.dispatchEvent(new CustomEvent('orbitboard_chat_read', { detail: { conversationId: id } }));
};

// Load message thread for the active URL route
useEffect(() => {
    async function loadThread() {
    if (!conversationId) return;
    try {
        setLoadingThread(true);
        const [rawMessages, conversationDetails] = await Promise.all([
        chatService.getMessagesByConversationId(conversationId),
        chatService.getConversationById(conversationId),
        ]);

        const normalizedMessages = (rawMessages || []).map((msg) => ({
        ...msg,
        content: msg.content || msg.text,
        }));

        setConversation({
        ...conversationDetails,
        id: conversationId,
        participants: conversationDetails?.participants || [],
        participant: conversationDetails?.participant,
        messages: normalizedMessages,
        });
        markConversationRead(conversationId);
    } catch (err) {
        console.error('Failed to load conversation messages:', err);
    } finally {
        setLoadingThread(false);
    }
    }

    loadThread();
}, [conversationId]);

// Notify parent/sidebar state about updated lastMessage
const updateSidebarLastMessage = (text, conversationId) => {
    if (typeof window !== 'undefined') {
    window.dispatchEvent(
        new CustomEvent('conversation_updated', {
        detail: {
            conversationId,
            lastMessage: text,
            updatedAt: new Date().toISOString(),
        },
        })
    );
    }
};

// Listen for real-time socket events for this thread
useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
    if (activeIdRef.current === newMessage.conversationId) {
        const message = chatService.normalizeMessage(newMessage);
        const textContent = message.content || message.text || 'Sent an attachment';

        setConversation((prev) => ({
        ...prev,
        messages: [
            ...(prev?.messages || []),
            { ...message, content: textContent },
        ],
        }));

        updateSidebarLastMessage(textContent, newMessage.conversationId);
        markConversationRead(newMessage.conversationId);
    }
    };

    socket.emit('chat:join', conversationId);
    socket.on('chat:message', handleNewMessage);
    return () => {
    socket.off('chat:message', handleNewMessage);
    };
}, [conversationId, socket]);

// Send message action
const handleSendMessage = async (payload) => {
    const textContent = typeof payload === 'string' ? payload : payload?.text || '';
    const attachments = typeof payload === 'object' ? payload?.attachments || [] : [];

    if (!conversationId || (!textContent.trim() && attachments.length === 0)) {
    return;
    }

    const displayText = textContent || (attachments.length ? 'Sent an attachment' : '');

    try {
    const firstAttachment = attachments[0];
    const mediaUrl = firstAttachment
        ? await uploadImage({
            dataUrl: firstAttachment.dataUrl || firstAttachment.url,
            fileName: firstAttachment.fileName || 'chat-attachment',
            token,
        })
        : null;

    const messagePayload = {
        conversationId,
        senderId: user?.id,
        content: textContent,
        mediaUrl,
    };

    updateSidebarLastMessage(displayText, conversationId);
    const sentMessage = await chatService.sendMessageViaSocket(socket, messagePayload);
    return sentMessage;
    } catch (err) {
    console.error('Failed to send message:', err);
    }
};

const handleUpdateGroup = async ({ action, participant }) => {
    if (!conversation || conversation.type !== 'group' || conversation.ownerId !== user?.id) return null;

    try {
    const updated = await chatService.updateGroupParticipants({
        conversationId,
        participant,
        action,
    });
    setConversation((prev) => ({ ...prev, participants: updated.participants }));
    return updated;
    } catch (err) {
    console.error('Failed to update group members:', err);
    return null;
    }
};

return (
    <>
    <ChatWindow
    conversation={conversation}
    currentUser={user}
    onSendMessage={handleSendMessage}
    loading={loadingThread}
    isConnected={isConnected}
    onManageGroup={conversation?.type === 'group' && conversation.ownerId === user?.id
        ? () => setIsMembersModalOpen(true)
        : undefined}
    />

    <GroupMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        conversation={conversation}
        currentUser={user}
        onUpdate={handleUpdateGroup}
    />
    </>
);
}
