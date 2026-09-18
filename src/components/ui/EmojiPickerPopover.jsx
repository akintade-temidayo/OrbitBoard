'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Smile } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';

export default function EmojiPickerPopover({ onSelectEmoji }) {
const [isOpen, setIsOpen] = useState(false);
const [position, setPosition] = useState({ openUpward: true, alignLeft: true });
const popoverRef = useRef(null);
const triggerRef = useRef(null);

// Close when clicking outside the popover container
useEffect(() => {
    function handleClickOutside(event) {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
    }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

// Calculate position dynamically relative to viewport
useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const pickerWidth = 300;
    const pickerHeight = 350;

    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceRight = viewportWidth - rect.left;

    setPosition({
        openUpward: spaceAbove >= pickerHeight || spaceAbove > spaceBelow,
        alignLeft: spaceRight >= pickerWidth,
    });
    }
}, [isOpen]);

return (
    <div className="relative inline-block" ref={popoverRef}>
    <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1.5 text-[--text-secondary] hover:text-[--text-primary] rounded-lg hover:bg-[--bg-surface-hover] transition-colors"
        aria-label="Pick an emoji"
    >
        <Smile className="w-4 h-4" />
    </button>

    {isOpen && (
        <div
        className={`absolute z-50 shadow-2xl rounded-2xl overflow-hidden border border-[--border-subtle] bg-[--bg-surface] ${
            position.openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
        } ${position.alignLeft ? 'left-0' : 'right-0'}`}
        >
        <EmojiPicker
            onEmojiClick={(emojiData) => {
            onSelectEmoji(emojiData.emoji);
            // Kept open so the user can select multiple emojis consecutively
            }}
            theme={Theme.AUTO}
            lazyLoadEmojis
            height={320}
            width={280}
        />
        </div>
    )}
    </div>
);
}