'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Ban, EyeOff, UserPlus, X } from 'lucide-react';
import { modService } from '@/services/modService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import ReportQueueCard from '@/components/mod/ReportQueueCard';
import UserModActions from '@/components/mod/UserModActions';

export default function ModDeskPage() {
const { user } = useAuth();
const [reports, setReports] = useState([]);
const [joinRequests, setJoinRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedUser, setSelectedUser] = useState(null);

useEffect(() => {
    async function fetchReports() {
    try {
        setLoading(true);
        const [reportData, requestData] = await Promise.all([
        modService.getPendingReports(),
        modService.getJoinRequests({
            userId: user?.id,
            orbitIds: user?.role === 'admin' ? undefined : user?.moderatedOrbitIds || [],
        }),
        ]);
        setReports(reportData || []);
        setJoinRequests(requestData || []);
    } catch (err) {
        console.error('Failed to load moderation queue:', err);
    } finally {
        setLoading(false);
    }
    }
    fetchReports();
}, [user]);

const handleJoinRequest = async (request, action) => {
    try {
    const resolved = await modService.resolveJoinRequest(request.id, action);
    setJoinRequests((prev) => prev.filter((item) => item.id !== request.id));
    toast.success(action === 'approved' ? `u/${resolved.requester?.username} was approved.` : 'Join request denied.');
    } catch (err) {
    console.error('Failed to resolve join request:', err);
    toast.error('Unable to resolve that join request.');
    }
};

const handleApproveContent = async (reportId) => {
    try {
    await modService.dismissReport(reportId);
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
    console.error('Failed to dismiss report:', err);
    }
};

const handleRemoveContent = async (reportId, targetId, targetType) => {
    try {
    await modService.removeContent(targetId, targetType);
    await modService.dismissReport(reportId);
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
    console.error('Failed to remove content:', err);
    }
};

const handleBanUser = async (userId, reason) => {
    try {
    await modService.banUser(userId, reason);
    setSelectedUser(null);
    } catch (err) {
    console.error('Failed to ban user:', err);
    }
};

return (
    <div className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6 pb-20 md:pb-6">
    {/* Moderation Desk Header */}
    <div className="flex flex-col gap-2 p-6 rounded-3xl bg-[--bg-surface] border border-[--border-subtle]">
        <div className="flex items-center gap-2 text-red-500">
        <ShieldAlert className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Mod Queue</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[--text-primary]">
        Moderation Desk
        </h1>
        <p className="text-xs md:text-sm text-[--text-secondary]">
        Review reported posts, comments, and user flags across your Orbits.
        </p>
    </div>

    {/* Reports Queue List */}
    <div className="flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[--text-primary] uppercase tracking-wider">
        Join Requests ({joinRequests.length})
        </h2>
        {joinRequests.length > 0 ? joinRequests.map((request) => (
        <div key={request.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-sky-500/30 bg-[--bg-surface]">
            <div className="flex items-center gap-3 min-w-0">
            <UserPlus className="w-5 h-5 text-sky-500 shrink-0" />
            <div className="min-w-0">
                <p className="text-xs font-semibold text-[--text-primary] truncate">
                u/{request.requester?.username || 'user'} wants to join r/{request.orbitName}
                </p>
                <p className="text-[11px] text-[--text-secondary]">Review this private Orbit request.</p>
            </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
            <button
                type="button"
                onClick={() => handleJoinRequest(request, 'denied')}
                className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
                title="Deny request"
            >
                <X className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => handleJoinRequest(request, 'approved')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:opacity-90"
            >
                Approve
            </button>
            </div>
        </div>
        )) : (
        <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-[--border-subtle] bg-[--bg-surface]">
            <p className="text-xs text-[--text-secondary]">No pending private Orbit requests.</p>
        </div>
        )}
    </div>

    <div className="flex flex-col gap-4">
        <h2 className="text-sm font-bold text-[--text-primary] uppercase tracking-wider">
        Pending Reports ({reports.length})
        </h2>

        {loading ? (
        <div className="flex flex-col gap-3 animate-pulse">
            {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[--bg-surface] rounded-2xl border border-[--border-subtle]" />
            ))}
        </div>
        ) : reports.length > 0 ? (
        <div className="flex flex-col gap-3">
            {reports.map((report) => (
            <ReportQueueCard
                key={report.id}
                report={report}
                onApprove={() => handleApproveContent(report.id)}
                onRemove={() => handleRemoveContent(report.id, report.targetId, report.targetType)}
                onSelectUser={(user) => setSelectedUser(user)}
            />
            ))}
        </div>
        ) : (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[--border-subtle] bg-[--bg-surface]">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-[--text-primary]">Queue is clear!</p>
            <p className="text-[11px] text-[--text-secondary]">No pending reports to review.</p>
        </div>
        )}
    </div>

    {/* Modal / Panel for Actioning Users */}
    {selectedUser && (
        <UserModActions
        user={selectedUser}
        onBan={(reason) => handleBanUser(selectedUser.id, reason)}
        onClose={() => setSelectedUser(null)}
        />
    )}
    </div>
);
}