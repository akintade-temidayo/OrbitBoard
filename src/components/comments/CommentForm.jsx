'use client';

import { useState } from 'react';
import { Send, Image, Link2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import EmojiPickerPopover from '@/components/ui/EmojiPickerPopover';

export default function CommentForm({
onSubmit,
placeholder = 'What are your thoughts?',
user,
autoFocus = false,
onCancel,
buttonText = 'Comment',
}) {
const [content, setContent] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit(content);
    setContent('');
};

const handleSelectEmoji = (emoji) => {
    setContent((prev) => prev + emoji);
};

return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2.5">
    <div className="flex gap-2.5 sm:gap-3 items-start">
        {user && <Avatar src={user.avatarUrl} alt={user.username} size="sm" className="hidden sm:block mt-1" />}

        <div className="flex-1 rounded-2xl border border-[--border-subtle] bg-[--bg-surface] p-2.5 sm:p-3 focus-within:border-[--accent-warm] transition-all shadow-sm">
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            rows={3}
            className="w-full bg-transparent text-xs sm:text-sm text-[--text-primary] placeholder-[--text-secondary] outline-none resize-none"
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[--border-subtle]/50 mt-1">
            <div className="flex items-center gap-1">
            <EmojiPickerPopover onSelectEmoji={handleSelectEmoji} />
            <button
                type="button"
                aria-label="Add image"
                className="p-1.5 text-[--text-secondary] hover:text-[--text-primary] rounded-lg hover:bg-[--bg-surface-hover] transition-colors"
            >
                <Image className="w-4 h-4" aria-label="Image icon" role="img" />
            </button>
            <button
                type="button"
                aria-label="Add link"
                className="p-1.5 text-[--text-secondary] hover:text-[--text-primary] rounded-lg hover:bg-[--bg-surface-hover] transition-colors"
            >
                <Link2 className="w-4 h-4" aria-label="Link icon" role="img" />
            </button>
            </div>

            <div className="flex items-center gap-2">
            {onCancel && (
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                Cancel
                </Button>
            )}
            <Button type="submit" variant="primary" size="sm" disabled={!content.trim()}>
                <span>{buttonText}</span>
                <Send className="w-3 h-3" />
            </Button>
            </div>
        </div>
        </div>
    </div>
    </form>
);
}