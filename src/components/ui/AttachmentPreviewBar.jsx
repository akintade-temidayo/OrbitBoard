'use client';

import { X, Paperclip, Image as ImageIcon } from 'lucide-react';

export default function AttachmentPreviewBar({ attachments = [], onRemove }) {
if (attachments.length === 0) return null;

return (
    <div className="flex items-center gap-2 p-2 rounded-xl bg-(--bg-main) border border-(--border-subtle) overflow-x-auto">
    {attachments.map((file, idx) => (
        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-(--bg-surface) border border-(--border-subtle) text-xs text-(--text-primary) shrink-0">
        {file.type === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-(--accent-warm)" /> : <Paperclip className="w-3.5 h-3.5 text-(--accent-warm)" />}
        <span className="max-w-30 truncate font-medium">{file.fileName}</span>
        <button type="button" onClick={() => onRemove(idx)} className="text-(--text-secondary) hover:text-red-400 p-0.5">
            <X className="w-3 h-3" />
        </button>
        </div>
    ))}
    </div>
);
}