'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal'; // Adjust path as needed

export default function DeactivateModal({
isOpen,
onClose,
username,
onConfirm,
isDeactivating,
}) {
return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deactivate Account">
    <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-red-500">
        <div className="p-2 bg-red-500/10 rounded-full shrink-0">
            <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-xs text-(--text-secondary) leading-relaxed">
            Are you sure you want to deactivate{' '}
            <strong className="text-(--text-primary)">u/{username}</strong>? This
            action will disable your account and log you out immediately.
        </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-(--border-subtle)">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-main) transition-colors"
            disabled={isDeactivating}
        >
            Cancel
        </button>
        <button
            type="button"
            onClick={onConfirm}
            disabled={isDeactivating}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
        >
            {isDeactivating ? 'Deactivating...' : 'Confirm Deactivation'}
        </button>
        </div>
    </div>
    </Modal>
);
}