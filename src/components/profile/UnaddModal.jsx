'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function UnaddModal({ isOpen, onClose, username, onConfirm }) {
return (
    <Modal isOpen={isOpen} onClose={onClose} title="Remove Friend">
    <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-xs text-[--text-secondary]">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
        <p>
            Are you sure you want to remove <span className="font-semibold text-[--text-primary]">u/{username}</span> from your friends list? You will no longer be able to message them directly.
        </p>
        </div>
        <div className="flex justify-end gap-2.5 mt-2">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[--border-subtle] text-[--text-primary] hover:bg-[--bg-main] transition-colors"
        >
            Cancel
        </button>
        <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
            Unadd Friend
        </button>
        </div>
    </div>
    </Modal>
);
}