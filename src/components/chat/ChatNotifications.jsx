'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { chatService } from '@/services/chatService';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/context/SocketContext';

const UNREAD_STORAGE_KEY = 'orbitboard_unread_messages';
const ALERTS_STORAGE_KEY = 'orbitboard_message_alerts';

const readUnreadCounts = () => {
  try {
    return JSON.parse(localStorage.getItem(UNREAD_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeUnreadCounts = (counts) => {
  localStorage.setItem(UNREAD_STORAGE_KEY, JSON.stringify(counts));
};

export default function ChatNotifications() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const pathname = usePathname();
  const joinedConversationIds = useRef([]);

  useEffect(() => {
    if (!socket || !user?.id) return undefined;

    let cancelled = false;
    async function joinConversations() {
      try {
        const conversations = await chatService.getConversations();
        if (cancelled) return;

        const ids = conversations.map((conversation) => conversation.id).filter(Boolean);
        joinedConversationIds.current = ids;
        ids.forEach((conversationId) => socket.emit('chat:join', conversationId));
      } catch (error) {
        console.error('Failed to subscribe to chat notifications:', error);
      }
    }

    joinConversations();
    return () => {
      cancelled = true;
      joinedConversationIds.current.forEach((conversationId) => socket.emit('chat:leave', conversationId));
      joinedConversationIds.current = [];
    };
  }, [socket, user?.id]);

  useEffect(() => {
    if (!socket || !user?.id) return undefined;

    const handleMessage = (incomingMessage) => {
      if (!incomingMessage?.conversationId || incomingMessage.senderId === user.id) return;

      const activeConversationId = pathname?.startsWith('/messages/')
        ? pathname.split('/')[2]
        : null;
      const isActive = activeConversationId === incomingMessage.conversationId;

      if (isActive) {
        const counts = readUnreadCounts();
        delete counts[incomingMessage.conversationId];
        writeUnreadCounts(counts);
      } else {
        const counts = readUnreadCounts();
        counts[incomingMessage.conversationId] = (counts[incomingMessage.conversationId] || 0) + 1;
        writeUnreadCounts(counts);

        if (localStorage.getItem(ALERTS_STORAGE_KEY) !== 'false') {
          const sender = incomingMessage.sender?.username || 'someone';
          toast(`New message from u/${sender}`);
        }
      }

      window.dispatchEvent(new CustomEvent('orbitboard_chat_message', {
        detail: { message: chatService.normalizeMessage(incomingMessage), isActive },
      }));
    };

    socket.on('chat:message', handleMessage);
    return () => socket.off('chat:message', handleMessage);
  }, [pathname, socket, user?.id]);

  return null;
}
