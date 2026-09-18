'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, MailCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import EmailInput from '@/components/ui/EmailInput';
import { authService } from '@/services/authService';

export default function ForgotPasswordPage() {
const router = useRouter();
const [email, setEmail] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [isSent, setIsSent] = useState(false);

const handleEmailChange = (e) => {
    const val = typeof e === 'string' ? e : e?.target?.value ?? '';
    setEmail(val);
    setError('');
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
    setError('Email address is required');
    return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
    setError('Please enter a valid email address');
    return;
    }

    setLoading(true);

    try {
    await authService.requestPasswordReset(email.trim());
    
    // Navigate straight to the OTP verification page with email pre-filled in query
    router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
    setError(
        err?.message ||
        'Something went wrong. Please try again later.'
    );
    setLoading(false);
    }
};

return (
    <div className="flex flex-col w-full max-w-md mx-auto">
    {/* Top Navigation */}
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

    {isSent ? (
        /* Sent Confirmation View */
        <div className="flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[--accent-warm]/10 text-[--accent-warm] flex items-center justify-center">
            <MailCheck className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
            Check your email
            </h1>
            <p className="text-xs sm:text-sm text-[--text-secondary]">
            We&apos;ve sent a 6-digit verification code to{' '}
            <span className="font-semibold text-[--text-primary]">
                {email}
            </span>
            .
            </p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full mt-2">
            <Button
            type="button"
            variant="primary"
            onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(email)}`)}
            className="w-full justify-center py-3.5 rounded-2xl font-semibold shadow-lg shadow-sky-500/10"
            >
            Enter Verification Code <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="text-xs text-[--text-secondary] hover:text-[--text-primary] transition-colors"
            >
            Didn&apos;t receive the code?{' '}
            <span className="font-semibold text-[--accent-warm] underline">
                Resend code
            </span>
            </button>
        </div>
        </div>
    ) : (
        /* Request Reset Form */
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
            Reset your password
            </h1>
            <p className="text-xs sm:text-sm text-[--text-secondary]">
            Enter your registered email address and we&apos;ll send you a 6-digit code to reset your password.
            </p>
        </div>

        <div className="w-full mt-2">
            <EmailInput
            label="Email Address"
            value={email}
            onChange={handleEmailChange}
            placeholder="john@example.com"
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
                'Sending code...'
            ) : (
                <>
                Send Verification Code <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
            )}
            </Button>

            <p className="text-xs text-[--text-secondary]">
            Remembered your password?{' '}
            <Link
                href="/login"
                className="font-semibold text-[--accent-warm] hover:underline"
            >
                Log in
            </Link>
            </p>
        </div>
        </form>
    )}
    </div>
);
}
