'use client';

import { useEffect, useState } from 'react';
import { Bell, User, AlertOctagon } from 'lucide-react';

const ALERTS_STORAGE_KEY = 'orbitboard_message_alerts';

export default function SettingsTab({ onOpenEditModal, onOpenDeactivateModal }) {
const [messageAlertsEnabled, setMessageAlertsEnabled] = useState(true);

useEffect(() => {
    queueMicrotask(() => {
        setMessageAlertsEnabled(localStorage.getItem(ALERTS_STORAGE_KEY) !== 'false');
    });
}, []);

const handleMessageAlertsChange = (event) => {
    const enabled = event.target.checked;
    setMessageAlertsEnabled(enabled);
    localStorage.setItem(ALERTS_STORAGE_KEY, String(enabled));
};

return (
    <div className="flex flex-col gap-6 max-w-2xl">
    {/* Account Settings Section */}
    <div className="bg-[--bg-surface] border border-[--border-subtle] rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        <h3 className="text-xs font-bold text-[--text-primary] uppercase tracking-wider">
        Profile Settings
        </h3>
        
        <div className="flex items-center justify-between border-b border-[--border-subtle] pb-4">
        <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-[--text-secondary]" />
            <div className="flex flex-col">
            <span className="text-xs font-semibold text-[--text-primary]">Edit Profile Info</span>
            <span className="text-[11px] text-[--text-secondary]">Change avatar, bio, and display name</span>
            </div>
        </div>

        <label className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-[--text-secondary]" />
            <div className="flex flex-col">
            <span className="text-xs font-semibold text-[--text-primary]">Message alerts</span>
            <span className="text-[11px] text-[--text-secondary]">Show a notification for new messages outside the chat.</span>
            </div>
        </div>
        <input
            type="checkbox"
            checked={messageAlertsEnabled}
            onChange={handleMessageAlertsChange}
            className="h-4 w-4 shrink-0 accent-[--accent-warm]"
            aria-label="Enable message alerts"
        />
        </label>
        <button
            onClick={onOpenEditModal}
            className="px-3.5 py-1.5 text-xs font-semibold border border-[--border-subtle] rounded-xl text-[--text-primary] hover:bg-[--bg-main] transition-colors"
        >
            Edit
        </button>
        </div>
    </div>

    {/* Danger Zone Section */}
    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider">
        Danger Zone
        </h3>

        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <AlertOctagon className="w-4 h-4 text-red-500" />
            <div className="flex flex-col">
            <span className="text-xs font-semibold text-[--text-primary]">Deactivate Account</span>
            <span className="text-[11px] text-[--text-secondary]">Temporarily disable or permanently remove your account</span>
            </div>
        </div>
        <button
            onClick={onOpenDeactivateModal}
            className="px-3.5 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
        >
            Deactivate
        </button>
        </div>
    </div>
    </div>
);
}
