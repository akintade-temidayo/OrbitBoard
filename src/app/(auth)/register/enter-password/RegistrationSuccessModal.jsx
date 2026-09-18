'use client';

import { CheckCircle2, LayoutDashboard, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function RegistrationSuccessModal({ isOpen, onLogin, onDashboard }) {
if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-[--bg-surface] border border-[--border-subtle] w-full max-w-sm rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
        <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
        <h2 className="text-xl font-bold text-[--text-primary]">You&apos;re all set!</h2>
        <p className="text-xs text-[--text-secondary] mt-1.5 max-w-xs mx-auto leading-relaxed">
            Your account has been created successfully. Where would you like to go next?
        </p>
        </div>

        <div className="w-full flex flex-col gap-2 mt-2">
        {/* Secondary Action: Direct to Login Page */}
        <Button variant="secondary" onClick={onLogin} className="w-full justify-center">
            <LogIn className="w-4 h-4 mr-2" />
            Proceed to Login
        </Button>
        </div>
    </div>
    </div>
);
}