'use client';

import { useState } from 'react';
import { ShieldAlert, Check, X, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function ReportQueueCard({ report, onApprove, onDismiss }) {
const [isConfirmOpen, setIsConfirmOpen] = useState(false);

const handleConfirmRemove = () => {
    onApprove(report.id);
    setIsConfirmOpen(false);
};

return (
    <>
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-amber-500/30 bg-[--bg-surface] shadow-sm">
        <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Reported Reason: {report.reason}</span>
        </div>
        <span className="text-[--text-secondary]">{report.reportedAt}</span>
        </div>

        <div className="p-3 rounded-xl bg-[--bg-main] border border-[--border-subtle]">
        <p className="text-xs sm:text-sm font-semibold text-[--text-primary]">{report.targetTitle}</p>
        <p className="text-xs text-[--text-secondary] mt-1 line-clamp-2">{report.targetContent}</p>
        <span className="text-[10px] text-[--text-secondary] mt-2 block">By u/{report.targetAuthor}</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-[--border-subtle]">
        <Button variant="ghost" size="sm" onClick={() => onDismiss(report.id)}>
            <X className="w-3.5 h-3.5" /> Ignore
        </Button>
        <Button variant="danger" size="sm" onClick={() => setIsConfirmOpen(true)}>
            <Check className="w-3.5 h-3.5" /> Remove Post
        </Button>
        </div>
    </div>

    {/* Reusable Confirmation Modal */}
    <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-red-500">
            <div className="p-2 rounded-xl bg-red-500/10">
            <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[--text-primary]">Confirm Post Removal</h3>
        </div>

        <p className="text-xs sm:text-sm text-[--text-secondary] leading-relaxed">
            Are you sure you want to remove this post by <strong className="text-[--text-primary]">u/{report.targetAuthor}</strong>? This action cannot be undone.
        </p>

        <div className="p-3 rounded-xl bg-[--bg-main] border border-[--border-subtle] text-xs font-medium text-[--text-primary] truncate">
            &quot;{report.targetTitle}&quot;
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[--border-subtle]">
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmOpen(false)}>
            Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmRemove}>
            Yes, Remove Post
            </Button>
        </div>
        </div>
    </Modal>
    </>
);
}