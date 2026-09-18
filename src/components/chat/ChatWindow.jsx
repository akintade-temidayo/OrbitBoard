// src/components/chat/ChatWindow.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, X, Reply } from 'lucide-react';
import MessageBubble from './MessageBubble';
import RichTextArea from '@/components/ui/RichTextArea';
import ChatHeader from '@/components/chat/ChatHeader'; // Imported custom header

export default function ChatWindow({ conversation, currentUser, onSendMessage, loading, onOpenProfile, onManageGroup }) {
const router = useRouter();
const [messages, setMessages] = useState([]);
const [showScrollBottom, setShowScrollBottom] = useState(false);
const [replyingTo, setReplyingTo] = useState(null);

const messagesEndRef = useRef(null);
const scrollContainerRef = useRef(null);

const recipient = conversation?.participants?.find((p) => p.id !== currentUser?.id) || conversation?.participant;
const displayUser = conversation?.type === 'group' || conversation?.type === 'orbit'
    ? { username: conversation.name, avatarUrl: conversation.avatarUrl }
    : recipient;
const storageKey = `orbitboard_messages_${conversation?.id || recipient?.id || 'default'}`;

const sanitizeMessagesForStorage = (storedMessages) => storedMessages.slice(-100).map((message) => ({
    ...message,
    attachments: (message.attachments || []).map(({ dataUrl, ...attachment }) => attachment).filter((attachment) => (
    typeof attachment.url === 'string' &&
    !attachment.url.startsWith('blob:') &&
    !attachment.url.startsWith('data:')
    )),
}));

const mergeMessages = (...messageLists) => {
    const byId = new Map();
    messageLists.flat().forEach((message) => {
    if (message?.id) byId.set(message.id, message);
    });
    return [...byId.values()].sort((first, second) => (
    new Date(first.createdAt || 0).getTime() - new Date(second.createdAt || 0).getTime()
    ));
};

// Sync messages from localStorage or initial conversation data
useEffect(() => {
    if (!conversation) return;
    const savedMessages = localStorage.getItem(storageKey);
    let cancelled = false;

    queueMicrotask(() => {
    if (cancelled) return;

    if (savedMessages) {
        try {
        const stored = JSON.parse(savedMessages);
        const cleaned = sanitizeMessagesForStorage(stored);
        const merged = mergeMessages(cleaned, conversation.messages || []);
        setMessages(merged);
        if (JSON.stringify(cleaned) !== JSON.stringify(stored)) {
            try {
            localStorage.setItem(storageKey, JSON.stringify(cleaned));
            } catch {
            localStorage.removeItem(storageKey);
            }
        }
        } catch (e) {
        setMessages(conversation.messages || []);
        }
    } else {
        setMessages(conversation.messages || []);
    }
    });

    return () => {
    cancelled = true;
    };
}, [conversation, storageKey]);

const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setShowScrollBottom(false);
}, []);

// Auto-scroll to bottom on initial load
useEffect(() => {
    const frameId = requestAnimationFrame(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    });

    return () => cancelAnimationFrame(frameId);
}, [conversation?.id]);

const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom > 150) {
    setShowScrollBottom(true);
    } else {
    setShowScrollBottom(false);
    }
};

const persistMessages = (updated) => {
    setMessages(updated);
    try {
    localStorage.setItem(storageKey, JSON.stringify(sanitizeMessagesForStorage(updated)));
    } catch (error) {
    // Media remains visible in the active chat but is never allowed to break sending.
    console.warn('Unable to persist chat history locally:', error);
    localStorage.removeItem(storageKey);
    }
    window.dispatchEvent(
    new CustomEvent('orbitboard_messages_updated', {
        detail: { conversationId: conversation?.id || recipient?.id, messages: updated },
    })
    );
};

const handleSendMessagePayload = async ({ text, attachments }) => {
    const temporaryId = `local-${Date.now()}`;
    const newMessage = {
    id: temporaryId,
    senderId: currentUser?.id,
    content: text,
    attachments: attachments || [],
    replyTo: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content || replyingTo.text,
        senderId: replyingTo.senderId
    } : null,
    createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    persistMessages(updatedMessages);
    setReplyingTo(null);

    if (onSendMessage) {
    try {
        const sentMessage = await onSendMessage({ text, attachments });
        if (sentMessage) {
        const remoteAttachments = sentMessage.mediaUrl
            ? (attachments || []).map(({ dataUrl, ...attachment }) => ({ ...attachment, url: sentMessage.mediaUrl }))
            : [];
        persistMessages(updatedMessages.map((message) => (
            message.id === temporaryId
            ? { ...sentMessage, attachments: remoteAttachments, replyTo: message.replyTo }
            : message
        )));
        }
    } catch (error) {
        console.error('Failed to send chat message:', error);
    }
    }

    setTimeout(() => scrollToBottom('smooth'), 50);
};

const handleEditMessage = (messageId, newContent) => {
    const updated = messages.map((msg) =>
    msg.id === messageId ? { ...msg, content: newContent, isEdited: true } : msg
    );
    persistMessages(updated);
};

const handleDeleteMessage = (messageId) => {
    const updated = messages.filter((msg) => msg.id !== messageId);
    persistMessages(updated);
};

const handleJumpToMessage = (messageId) => {
    const targetElement = document.getElementById(`msg-${messageId}`);
    if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetElement.classList.add('ring-2', 'ring-sky-400', 'transition-all');
    setTimeout(() => {
        targetElement.classList.remove('ring-2', 'ring-sky-400');
    }, 1500);
    }
};

const handleProfileClick = () => {
    if (conversation?.type === 'orbit' && conversation.orbit?.name) {
    router.push(`/r/${conversation.orbit.name}`);
    return;
    }

    const profileUser = conversation?.type === 'group'
    ? conversation.owner || recipient
    : recipient;

    if (onOpenProfile) {
    onOpenProfile(profileUser);
    } else if (profileUser?.username) {
    router.push(`/profile/${profileUser.username}`);
    }
};

if (loading) {
    return (
    <div className="flex-1 flex items-center justify-center text-xs text-[--text-secondary]">
        Loading messages...
    </div>
    );
}

if (!conversation) {
    return (
    <div className="flex-1 flex items-center justify-center text-xs text-[--text-secondary] border border-dashed border-[--border-subtle] rounded-2xl p-6">
        Select a conversation to start chatting
    </div>
    );
}

return (
    <div className="flex flex-col h-full min-h-0 w-full min-w-0 bg-[--bg-surface] overflow-hidden flex-1 relative pb-16 md:pb-0">
    {/* Interactive Chat Header */}
    <ChatHeader
        user={displayUser}
        conversation={conversation}
        onOpenProfile={handleProfileClick}
        onManageGroup={onManageGroup}
        onBack={() => router.push('/messages')}
    />

    {/* Messages Thread container */}
    <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3 bg-[--bg-main]/30 relative"
    >
        {messages.map((msg, index) => (
        <MessageBubble
            key={msg.id || `message-${index}`}
            message={msg}
            isMe={msg.senderId === currentUser?.id}
            sender={recipient}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
            onReply={setReplyingTo}
            onJumpToMessage={handleJumpToMessage}
        />
        ))}
        <div ref={messagesEndRef} />

        {/* Floating Scroll to Bottom Button */}
        {showScrollBottom && (
        <button
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[--bg-surface] border border-[--border-subtle] shadow-lg rounded-full px-3 py-1.5 text-xs text-[--text-primary] flex items-center gap-1.5 hover:bg-[--bg-surface-hover] transition-all z-20"
        >
            <ArrowDown className="w-3.5 h-3.5 text-sky-500" />
        </button>
        )}
    </div>

    {/* Input Form & Active Reply Banner */}
    <div className="p-3 border-t border-[--border-subtle] bg-[--bg-surface] shrink-0 sticky bottom-0 z-10 flex flex-col gap-2">
        {replyingTo && (
        <div className="flex items-center justify-between bg-[--bg-main]/50 border-l-4 border-sky-500 px-3 py-2 rounded-lg text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
            <Reply className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <div className="truncate">
                <p className="font-semibold text-[10px] text-[--text-secondary]">
                Replying to {replyingTo.senderId === currentUser?.id ? 'yourself' : recipient?.username || 'User'}
                </p>
                <p className="text-[--text-primary] truncate">{replyingTo.content || 'Attachment'}</p>
            </div>
            </div>
            <button
            onClick={() => setReplyingTo(null)}
            className="p-1 hover:bg-[--bg-surface-hover] rounded text-[--text-secondary]"
            >
            <X className="w-4 h-4" />
            </button>
        </div>
        )}

        <RichTextArea
        onSubmit={handleSendMessagePayload}
        placeholder="Write a message..."
        />
    </div>
    </div>
);
}
