'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import NumberInput from '@/components/ui/NumberInput';
import { authService } from '@/services/authService';

const TIMER_DURATION = 60;

function VerifyOtpContent() {
const router = useRouter();
const searchParams = useSearchParams();
const email = searchParams.get('email') || '';

const [{ timer, otp }, setOtpState] = useState({ timer: TIMER_DURATION, otp: '' });
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const canResend = timer <= 0;

const startTimer = useCallback(
    (durationSeconds = TIMER_DURATION) => {
    setOtpState({ timer: durationSeconds, otp: '' });
    },
    []
);

// Interval timer tick — this is a genuine side effect (a running clock),
// not a value we could've computed before the first render.
useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
    setOtpState((prev) => ({
        ...prev,
        timer: prev.timer <= 1 ? 0 : prev.timer - 1,
    }));
    }, 1000);

    return () => clearInterval(interval);
}, [timer]);

const handleOtpChange = (val) => {
    const cleanValue = typeof val === 'string' ? val : val?.target?.value ?? '';
    setOtpState((prev) => ({ ...prev, otp: cleanValue.replace(/\D/g, '').slice(0, 6) }));
    if (error) setError('');
};

const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const digitsOnly = pasteData.replace(/\D/g, '').slice(0, 6);
    if (digitsOnly) {
    setOtpState((prev) => ({ ...prev, otp: digitsOnly }));
    if (error) setError('');
    }
};

const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
    await authService.requestPasswordReset(email);
    startTimer(TIMER_DURATION);
    setError('');
    } catch (err) {
    setError(
        err?.message || 'Failed to resend code. Try again.'
    );
    } finally {
    setLoading(false);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
    setError('Verification code is required');
    return;
    }

    if (otp.length < 6) {
    setError('Please enter the full 6-digit code');
    return;
    }

    setLoading(true);

    try {
    await authService.verifyOtp({ email, otp });
    router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (err) {
    setError(
        err?.message || 'Invalid or expired verification code'
    );
    } finally {
    setLoading(false);
    }
};

return (
    <div className="flex flex-col w-full max-w-md mx-auto">
    {/* Navigation Header */}
    <div className="flex items-center justify-between mb-8 text-xs font-semibold">
        <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[--text-secondary] hover:text-[--text-primary] transition-colors"
        >
        <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <Link href="/login" className="text-[--accent-warm] hover:underline">
        Log in instead
        </Link>
    </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-2xl bg-[--accent-warm]/10 text-[--accent-warm] flex items-center justify-center mb-1">
            <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
            Enter Verification Code
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary]">
            We&apos;ve sent a 6-digit code to{' '}
            <span className="font-semibold text-[--text-primary]">
            {email || 'your email address'}
            </span>
            .
        </p>
        </div>

        <div className="w-full mt-2">
        <NumberInput
            label="6-Digit Code"
            value={otp}
            onChange={handleOtpChange}
            onPaste={handlePaste}
            placeholder="123456"
            maxLength={6}
            error={error}
            autoFocus
        />
        </div>

        <div className="flex flex-col items-center gap-4 mt-2">
        <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full justify-center py-3.5 rounded-2xl font-semibold shadow-lg shadow-sky-500/10"
        >
            {loading ? (
            'Verifying...'
            ) : (
            <>
                Verify Code <ArrowRight className="w-4 h-4 ml-1.5" />
            </>
            )}
        </Button>

        <div className="text-xs text-[--text-secondary] text-center">
            {canResend ? (
            <button
                type="button"
                onClick={handleResendOtp}
                className="font-semibold text-[--accent-warm] hover:underline"
            >
                Resend Code
            </button>
            ) : (
            <span>
                Resend code in{' '}
                <span className="font-semibold text-[--text-primary]">
                {timer}s
                </span>
            </span>
            )}
        </div>
        </div>
    </form>
    </div>
);
}

// Export wrapped in Suspense for Next.js searchParams hydration
export default function VerifyOtpPage() {
return (
    <Suspense fallback={<div className="text-center text-xs text-[--text-secondary]">Loading...</div>}>
    <VerifyOtpContent />
    </Suspense>
);
}
