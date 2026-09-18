export default function MessagesPlaceholderPage() {
return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[--bg-main]/20">
    <div className="max-w-sm flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-[--bg-surface] border border-[--border-subtle] flex items-center justify-center text-2xl shadow-sm">
        💬
        </div>
        <h3 className="font-bold text-base text-[--text-primary]">Your Messages</h3>
        <p className="text-xs text-[--text-secondary]">
        Select a conversation from the sidebar or start a new chat to begin messaging.
        </p>
    </div>
    </div>
);
}