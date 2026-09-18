'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Copy, Edit2, Trash2, Reply } from 'lucide-react';

const MENU_WIDTH = 128; // w-32
const MENU_GAP = 4;
const ITEM_HEIGHT = 34;
const MENU_PADDING = 12;

export default function MessageActionMenu({ isMe, isVoiceNote = false, onReply, onCopy, onEdit, onDelete }) {
const [isOpen, setIsOpen] = useState(false);
const [coords, setCoords] = useState({ top: 0, left: 0 });
const menuRef = useRef(null);
const triggerRef = useRef(null);

// Dynamic item calculation based on permissions
const canEdit = isMe && !isVoiceNote;
let itemCount = 2; 
if (canEdit) itemCount += 1;
if (isMe) itemCount += 1; // Delete

const estimatedMenuHeight = itemCount * ITEM_HEIGHT + MENU_PADDING;

useEffect(() => {
    const handleClickOutside = (event) => {
    if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
    ) {
        setIsOpen(false);
    }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < estimatedMenuHeight + MENU_GAP;

    setCoords({
        top: openUpward
        ? rect.top - estimatedMenuHeight - MENU_GAP
        : rect.bottom + MENU_GAP,
        left: isMe ? rect.right - MENU_WIDTH : rect.left,
    });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
    window.removeEventListener('scroll', updatePosition, true);
    window.removeEventListener('resize', updatePosition);
    };
}, [isOpen, isMe, estimatedMenuHeight]);

return (
    <div className="relative self-center">
    <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1 rounded-full hover:bg-[--bg-surface-hover] text-[--text-secondary] opacity-0 group-hover:opacity-100 transition-opacity"
        title="Message options"
    >
        <MoreVertical className="w-4 h-4" />
    </button>

    {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
        <div
            ref={menuRef}
            style={{
            top: coords.top,
            left: coords.left,
            width: MENU_WIDTH,
            backgroundColor: 'var(--bg-surface)',
            }}
            className="fixed z-[9999] border border-[--border-subtle] rounded-xl shadow-2xl py-1.5 text-xs text-[--text-primary]"
        >
            <button
            onClick={() => {
                onReply();
                setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[--accent-warm] transition-colors"
            >
            <Reply className="w-3.5 h-3.5 text-sky-500" /> Reply
            </button>

            <button
            onClick={() => {
                onCopy();
                setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[--accent-warm] transition-colors"
            >
            <Copy className="w-3.5 h-3.5 text-emerald-500" /> Copy
            </button>

            {/* Edit Option: Only for user's own text/file messages (hidden for Voice Notes) */}
            {canEdit && (
            <button
                onClick={() => {
                onEdit();
                setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[--bg-surface-hover] transition-colors"
            >
                <Edit2 className="w-3.5 h-3.5 text-amber-500" /> Edit
            </button>
            )}

            {/* Delete Option: Available for all user's own messages */}
            {isMe && (
            <button
                onClick={() => {
                onDelete();
                setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[--bg-surface-hover] transition-colors text-red-500"
            >
                <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            )}
        </div>,
        document.body
        )}
    </div>
);
}