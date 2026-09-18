import { apiRequest, unwrapData } from '@/services/apiClient';

const listFrom = (payload, key) => {
  const data = unwrapData(payload);
  return Array.isArray(data) ? data : data?.[key] || data?.items || [];
};

const normalizeConversation = (conversation) => {
  if (!conversation) return conversation;

  const participants = (conversation.participants || []).map((participant) => (
    participant.user ? { ...participant.user, participantId: participant.id } : participant
  ));

  return {
    ...conversation,
    type: conversation.type?.toLowerCase(),
    participants,
    avatarUrl: conversation.avatarUrl ?? conversation.orbit?.bannerUrl ?? conversation.owner?.avatarUrl ?? participants[0]?.avatarUrl ?? null,
    lastMessage: conversation.lastMessage ?? conversation.messages?.[0] ?? null,
  };
};

const conversationFrom = (payload) => {
  const data = unwrapData(payload);
  return normalizeConversation(data?.conversation ?? data);
};

const attachmentFromMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return [];
  const path = mediaUrl.split('?')[0].toLowerCase();
  const type = /\.(mp3|m4a|wav|ogg|aac|webm)$/.test(path)
    ? 'audio'
    : /\.(png|jpe?g|gif|webp|avif)$/.test(path)
      ? 'image'
      : /\.(mp4|mov|webm)$/.test(path)
        ? 'video'
        : 'document';

  return [{ url: mediaUrl, type }];
};

const normalizeMessage = (message) => ({
  ...message,
  attachments: message?.attachments || attachmentFromMediaUrl(message?.mediaUrl),
});

export const chatService = {
  async getConversations() {
    return listFrom(await apiRequest('/api/chats'), 'conversations').map(normalizeConversation);
  },

  async getConversationById(conversationId) {
    const conversations = await this.getConversations();
    return conversations.find((conversation) => (
      conversation.id === conversationId || conversation.conversationId === conversationId
    )) || null;
  },

  async createDirectConversation(targetUserId) {
    return conversationFrom(await apiRequest('/api/chats/dm', {
      method: 'POST',
      body: { targetUserId },
    }));
  },

  async getMessagesByConversationId(conversationId, options = {}) {
    const query = new URLSearchParams(options).toString();
    const payload = await apiRequest(`/api/chats/${conversationId}/messages${query ? `?${query}` : ''}`);
    return listFrom(payload, 'messages').map(normalizeMessage);
  },

  normalizeMessage,

  sendMessageViaSocket(socket, { conversationId, content, mediaUrl = null }) {
    return new Promise((resolve, reject) => {
      if (!socket?.connected) {
        reject(new Error('Live chat is disconnected. Please wait for it to reconnect.'));
        return;
      }

      socket.timeout(10_000).emit('chat:send', { conversationId, content, mediaUrl }, (error, result) => {
        if (error) {
          reject(new Error('The message was not acknowledged by the chat server.'));
          return;
        }
        if (!result?.ok) {
          reject(new Error(result?.error || 'Unable to send this message.'));
          return;
        }
        resolve(normalizeMessage(result.message));
      });
    });
  },

  async sendMessage({ conversationId, text, content, mediaUrl = null }) {
    const data = unwrapData(await apiRequest(`/api/chats/${conversationId}/messages`, {
      method: 'POST',
      body: { content: content ?? text ?? '', mediaUrl },
    }));
    return data?.message ?? data;
  },

  async markConversationRead(conversationId) {
    return unwrapData(await apiRequest(`/api/chats/${conversationId}/read`, { method: 'PATCH' }));
  },

  async createGroup({ name, participantIds = [] }) {
    return conversationFrom(await apiRequest('/api/chats/group', {
      method: 'POST',
      body: { name, participantIds },
    }));
  },

  async ensureOrbitConversation() {
    throw new Error('Orbit chat creation is not available in the current API contract.');
  },

  async revokeOrbitConversation() {
    throw new Error('Leaving orbit chat is managed by the orbit membership endpoint.');
  },

  async updateGroupParticipants({ conversationId, participant, action }) {
    const userId = participant?.id ?? participant?.userId;
    if (!userId) throw new Error('A user is required to update group members.');

    const path = `/api/chats/${conversationId}/participants/${encodeURIComponent(userId)}`;
    const payload = await apiRequest(
      action === 'remove' ? path : `/api/chats/${conversationId}/participants`,
      action === 'remove'
        ? { method: 'DELETE' }
        : { method: 'POST', body: { userId } }
    );

    return conversationFrom(payload);
  },
};
