'use client';

import { X } from 'lucide-react';
import CreatePostForm from '@/components/post/CreatePostForm';

export default function awer({ isOpen, onClose, orbits }) {
if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
    {/* Container background set via inline style so it always renders opaque */}
    <div
        style={{ backgroundColor: 'black' }}
        className="w-full max-w-lg text-[--text-primary] h-full shadow-2xl p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto border-l border-[--border-subtle]"
    >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[--border-subtle] pb-3 shrink-0">
        <h2 className="text-lg font-bold text-[--text-primary]">Create a Post</h2>
        <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface-hover] transition-colors"
        >
            <X className="w-5 h-5" />
        </button>
        </div>

        {/* Form Body */}
        <div className="flex-1">
        <CreatePostForm onSubmit={() => onClose()} orbits={orbits} />
        </div>
    </div>
    </div>
);
}