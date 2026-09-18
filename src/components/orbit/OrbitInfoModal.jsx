'use client';

import { Info, Shield } from 'lucide-react';
import Modal from '@/components/ui/Modal'; 

export default function OrbitInfoModal({ activeModal, orbit, onClose }) {
if (!activeModal || !orbit) return null;

const isAbout = activeModal === 'about';
const modalTitle = isAbout ? `About r/${orbit.name}` : `r/${orbit.name} Rules`;
const memberCount = orbit.memberCount ?? orbit._count?.members ?? orbit.members?.length ?? 0;

return (
    <Modal isOpen={Boolean(activeModal)} onClose={onClose} title={modalTitle}>
    {isAbout ? (
        <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[--accent-warm]">
            <Info className="w-5 h-5" />
            <span className="font-semibold text-xs text-[--text-secondary]">Community Overview</span>
        </div>
        <p className="text-xs text-[--text-secondary] leading-relaxed">
            {orbit.description || 'Welcome to our space. Connect, share, and discuss with members.'}
        </p>
        <div className="border-t border-[--border-subtle] pt-3 text-xs mt-2">
            <div>
            <span className="font-bold text-[--text-primary] block">
                {memberCount}
            </span>
            <span className="text-[10px] text-[--text-secondary]">{memberCount === 1 ? 'Member' : 'Members'}</span>
            </div>
            <div className="hidden">
            <span className="font-bold text-emerald-500 block">● {orbit.onlineCount || 42}</span>
            <span className="text-[10px] text-[--text-secondary]">Online</span>
            </div>
        </div>
        </div>
    ) : (
        <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[--accent-warm]">
            <Shield className="w-5 h-5" />
            <span className="font-semibold text-xs text-[--text-secondary]">Guidelines</span>
        </div>
        <ol className="flex flex-col gap-2.5 text-xs text-[--text-primary] list-decimal list-inside font-medium mt-1">
            {orbit.rules && orbit.rules.length > 0 ? (
            orbit.rules.map((rule, idx) => (
                <li key={rule.id || idx} className="pb-2 border-b border-[--border-subtle]/50 last:border-b-0">
                <span className="font-bold">{typeof rule === 'object' ? rule.title : rule}</span>
                {typeof rule === 'object' && rule.description && (
                    <p className="text-[11px] text-[--text-secondary] font-normal pl-4 mt-0.5">
                    {rule.description}
                    </p>
                )}
                </li>
            ))
            ) : (
            <>
                <li className="pb-2 border-b border-[--border-subtle]/50">Be respectful and constructive</li>
                <li className="pb-2 border-b border-[--border-subtle]/50">No spam or self-promotion</li>
                <li>Use descriptive titles</li>
            </>
            )}
        </ol>
        </div>
    )}
    </Modal>
);
}
