'use client';

import { useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/utils/formatTime';
import { FileText, Download, Check, X, Trash2 } from 'lucide-react';
import MessageActionMenu from './MessageActionMenu';
import AudioPlayer from '@/components/ui/AudioPlayer';
import Modal from '@/components/ui/Modal'; // Adjust path if needed

export default function MessageBubble({
message,
isMe,
sender,
onEdit,
onDelete,
onReply,
onJumpToMessage,
}) {
const [isEditing, setIsEditing] = useState(false);
const [editText, setEditText] = useState(message?.content || message?.text || '');
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

const textContent = message?.content || message?.text || '';
const attachments = message?.attachments || [];

// Check if the message contains voice note / audio attachments
const isVoiceNote = attachments.some(
    (att) => att.type === 'audio' || att.isAudio || att.mimeType?.startsWith('audio/')
);

const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
};

const handleSaveEdit = () => {
    if (!editText.trim()) return;
    if (onEdit) {
    onEdit(message.id, editText);
    }
    setIsEditing(false);
};

const handleConfirmDelete = () => {
    if (onDelete) {
    onDelete(message.id);
    }
    setIsDeleteModalOpen(false);
};

return (
    <>
    <div
        id={`msg-${message.id}`}
        className={`group relative flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${
        isMe ? 'self-end flex-row-reverse' : 'self-start'
        }`}
    >
        {!isMe && <Avatar src={sender?.avatarUrl} alt={sender?.username} size="sm" />}

        <div
        className={`relative p-3 rounded-2xl text-xs sm:text-sm transition-colors flex flex-col gap-2 ${
            isMe
            ? 'bg-[#0c4a6e] text-white rounded-br-none shadow-sm dark:bg-[#0c4a6e]'
            : 'bg-[--bg-surface] text-[--text-primary] border border-[--border-subtle] rounded-bl-none shadow-sm'
        }`}
        >
        {/* Replied Message Preview Block */}
        {message.replyTo && (
            <div
            onClick={() => onJumpToMessage && onJumpToMessage(message.replyTo.id)}
            className={`p-2 rounded-lg border-l-4 text-xs cursor-pointer mb-1 transition-opacity hover:opacity-80 ${
                isMe
                ? 'bg-black/20 border-white/60 text-white/90'
                : 'bg-[--bg-main]/60 border-sky-500 text-[--text-secondary]'
            }`}
            >
            <p className="font-semibold text-[10px] opacity-90">
                {message.replyTo.senderId === isMe ? 'You' : sender?.username || 'User'}
            </p>
            <p className="truncate">{message.replyTo.content || 'Attachment'}</p>
            </div>
        )}

        {/* Attachments Preview */}
        {attachments.length > 0 && (
            <div className="flex flex-col gap-2">
            {attachments.map((att, idx) => {
                if (att.type === 'image') {
                return (
                    <div key={idx} className="rounded-lg overflow-hidden max-w-xs max-h-60 bg-black/10">
                    <img
                        src={att.url}
                        alt={att.fileName || 'Attachment'}
                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => window.open(att.url, '_blank')}
                    />
                    </div>
                );
                }
                if (att.type === 'video') {
                return (
                    <div key={idx} className="rounded-lg overflow-hidden max-w-xs bg-black/10 relative">
                    <video
                        src={att.url}
                        controls
                        className="w-full h-auto rounded-lg max-h-48 object-cover"
                    />
                    </div>
                );
                }
                if (att.type === 'audio' || att.isAudio || att.mimeType?.startsWith('audio/')) {
                return (
                    <div key={idx} className="w-full min-w-55">
                    <AudioPlayer src={att.url} duration={att.duration} isMe={isMe} />
                    </div>
                );
                }
                return (
                <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                    isMe
                        ? 'bg-white/10 border-white/25 hover:bg-white/20 text-white'
                        : 'bg-[--bg-main]/50 border-[--border-subtle] hover:bg-[--bg-main] text-[--text-primary]'
                    }`}
                >
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                    <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs truncate">{att.fileName || 'Document'}</p>
                    <span className="text-[10px] opacity-75">{att.fileSize || 'File'}</span>
                    </div>
                    <Download className="w-4 h-4 opacity-75 shrink-0" />
                </a>
                );
            })}
            </div>
        )}

        {/* Text Content or Inline Editor */}
        {isEditing ? (
            <div className="flex flex-col gap-2 my-1">
            <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 text-xs rounded bg-black/20 text-white outline-none resize-none"
                rows={2}
            />
            <div className="flex items-center justify-end gap-1.5">
                <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 bg-white/10 rounded hover:bg-white/20 text-[10px] flex items-center gap-1"
                >
                <X className="w-3 h-3" /> Cancel
                </button>
                <button
                type="button"
                onClick={handleSaveEdit}
                className="px-2 py-1 bg-sky-600 rounded hover:bg-sky-500 text-[10px] flex items-center gap-1"
                >
                <Check className="w-3 h-3" /> Save
                </button>
            </div>
            </div>
        ) : (
            textContent && <p className="leading-relaxed whitespace-pre-wrap">{textContent}</p>
        )}

        {/* Metadata & Timestamp */}
        <div className="flex items-center justify-end gap-1.5">
            {message.isEdited && <span className="text-[9px] opacity-70">(edited)</span>}
            <span className={`text-[9px] block ${isMe ? 'text-white/80' : 'text-[--text-secondary]'}`}>
            {formatTimeAgo(message?.createdAt || message?.timestamp)}
            </span>
        </div>
        </div>

        {/* Extracted Message Action Menu */}
        <MessageActionMenu
        isMe={isMe}
        isVoiceNote={isVoiceNote}
        onReply={() => onReply && onReply(message)}
        onCopy={handleCopy}
        onEdit={() => setIsEditing(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
        />
    </div>

    {/* Delete Confirmation Modal */}
    <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Message"
    >
        <div className="flex flex-col gap-4">
        <p className="text-xs text-[--text-secondary] leading-relaxed">
            Are you sure you want to delete this message? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
            <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[--text-secondary] hover:bg-[--bg-main] transition-colors"
            >
            Cancel
            </button>
            <button
            type="button"
            onClick={handleConfirmDelete}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors flex items-center gap-1.5"
            >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
            </button>
        </div>
        </div>
    </Modal>
    </>
);
}