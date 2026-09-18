'use client';

import { useState } from 'react';
import { Shield, Ban, VolumeX, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function UserModActions({ username, onBan, onMute }) {
const [isBanModalOpen, setIsBanModalOpen] = useState(false);

const handleConfirmBan = () => {
    onBan(username);
    setIsBanModalOpen(false);
};

return (
    <>
    <div className="flex items-center gap-2 p-3 rounded-2xl border border-[--border-subtle] bg-[--bg-surface]">
        <Shield className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-bold text-[--text-primary] flex-1">Mod Tools: u/{username}</span>

        <Button variant="secondary" size="sm" onClick={() => onMute(username)}>
        <VolumeX className="w-3.5 h-3.5" /> Mute
        </Button>

        <Button variant="danger" size="sm" onClick={() => setIsBanModalOpen(true)}>
        <Ban className="w-3.5 h-3.5" /> Ban
        </Button>
    </div>

    {/* Confirmation Modal for Ban Action */}
    <Modal isOpen={isBanModalOpen} onClose={() => setIsBanModalOpen(false)}>
        <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-red-500">
            <div className="p-2 rounded-xl bg-red-500/10">
            <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[--text-primary]">Confirm Ban</h3>
        </div>

        <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed">
            Are you sure you want to ban <strong className="text-[--text-primary]">u/{username}</strong>? They will no longer be able to post or comment in this orbit.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[--border-subtle]">
            <Button variant="ghost" size="sm" onClick={() => setIsBanModalOpen(false)}>
            Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmBan}>
            Yes, Ban User
            </Button>
        </div>
        </div>
    </Modal>
    </>
);
}