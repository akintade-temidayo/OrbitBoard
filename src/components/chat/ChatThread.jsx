'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import EmojiPickerPopover from '@/components/ui/EmojiPickerPopover';
import Image from 'next/image';
import { formatTimeAgo } from '@/utils/formatTime';

export default function ChatThread({ recipient, initialMessages = [], currentUser, onSendMessage }) {
const [messages, setMessages] = useState(initialMessages);
const [inputText, setInputText] = useState('');
const bottomRef = useRef(null);

useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
    id: `msg-${Date.now()}`,
    senderId: currentUser?.id || 'me',
    text: inputText,
    timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    if (onSendMessage) onSendMessage(inputText);
    setInputText('');
};

return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl border border-[--border-subtle] bg-[--bg-surface] overflow-hidden shadow-sm">
    
    {/* Chat Header */}
    <div className="p-3.5 border-b border-[--border-subtle] flex items-center gap-3 bg-[--bg-surface]">
        <Avatar src={recipient?.avatarUrl} alt={recipient?.username} size="sm" />
        <div>
        <h3 className="font-bold text-xs sm:text-sm text-[--text-primary]">u/{recipient?.username || 'User'}</h3>
        <span className="text-[10px] text-emerald-500 font-medium">● Online</span>
        </div>
    </div>

    {/* Messages Scroll Area */}
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[--bg-main]/30">
        {messages.map((msg) => {
        const isMe = msg.senderId === (currentUser?.id || 'me');
        return (
            <div
            key={msg.id}
            className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
            {!isMe && <Avatar src={recipient?.avatarUrl} alt={recipient?.username} size="sm" />}
            <div
                className={`p-3 rounded-2xl text-xs sm:text-sm ${
                isMe
                    ? 'bg-[--accent-warm] text-white rounded-br-none'
                    : 'bg-[--bg-surface] text-[--text-primary] border border-[--border-subtle] rounded-bl-none'
                }`}
            >
                <p className="leading-relaxed">{msg.text}</p>
                <span
                className={`text-[9px] block mt-1 text-right ${
                    isMe ? 'text-white/70' : 'text-[--text-secondary]'
                }`}
                >
                {formatTimeAgo(msg.timestamp)}
                </span>
            </div>
            </div>
        );
        })}
        <div ref={bottomRef} />
    </div>

    {/* Chat Input Bar */}
    <form onSubmit={handleSend} className="p-3 border-t border-[--border-subtle] bg-[--bg-surface] flex items-center gap-2">
        <EmojiPickerPopover onSelectEmoji={(emoji) => setInputText((prev) => prev + emoji)} />
        
        <button
        type="button"
        className="p-1.5 text-[--text-secondary] hover:text-[--text-primary] rounded-lg hover:bg-[--bg-surface-hover] transition-colors"
        >
        <Image 
        src={src}
        alt={alt}
        fill
        sizes={`${pixelSizes[size]}px`}
        className="w-4 
        h-4" />
        </button>

        <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={`Message u/${recipient?.username || 'user'}...`}
        className="flex-1 bg-[--bg-main] text-xs sm:text-sm text-[--text-primary] placeholder-[--text-secondary] px-3.5 py-2 rounded-xl border border-[--border-subtle] outline-none focus:border-[--accent-warm] transition-colors"
        />

        <Button type="submit" variant="primary" size="sm" disabled={!inputText.trim()}>
        <Send className="w-3.5 h-3.5" />
        </Button>
    </form>
    </div>
);
}