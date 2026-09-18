'use client';

import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-(--border-subtle) bg-(--bg-surface) p-5 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                <div className="mb-4 flex items-center justify-between gap-4">
                    {title ? (
                        <h2 id="modal-title" className="text-sm font-bold text-(--text-primary)">
                            {title}
                        </h2>
                    ) : (
                        <span />
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-1.5 text-(--text-secondary) transition-colors hover:bg-(--bg-main) hover:text-(--text-primary)"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}