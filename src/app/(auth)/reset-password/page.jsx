'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import { authService } from '@/services/authService';

function ResetPasswordContent() {
const router = useRouter();
const searchParams = useSearchParams();

const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);

const handlePasswordChange = (e) => {
    const val = typeof e === 'string' ? e : e?.target?.value ?? '';
    setPassword(val);
    setErrors((prev) => ({ ...prev, password: null }));
};

const handleConfirmPasswordChange = (e) => {
    const val = typeof e === 'string' ? e : e?.target?.value ?? '';
    setConfirmPassword(val);
    setErrors((prev) => ({ ...prev, confirmPassword: null }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password) {
    newErrors.password = 'Password is required';
    } else if (password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
    }

    setLoading(true);

    try {
    const email = searchParams.get('email');
    const otp = searchParams.get('otp');
    if (!email || !otp) {
        throw new Error('Please verify your email before resetting your password.');
    }

    await authService.resetPassword({ email, otp, newPassword: password });
    setIsSuccess(true);
    } catch (err) {
    setErrors({
        general:
        err?.message ||
        'Failed to reset password. Token may have expired.',
    });
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

    {isSuccess ? (
        /* Success State */
        <div className="flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
            Password updated!
            </h1>
            <p className="text-xs sm:text-sm text-[--text-secondary]">
            Your password has been changed successfully. You can now log in with your new password.
            </p>
        </div>

        <Button
            type="button"
            variant="primary"
            onClick={() => router.push('/login')}
            className="w-full justify-center py-3.5 rounded-2xl font-semibold shadow-lg shadow-sky-500/10 mt-2"
        >
            Go to Login <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
        </div>
    ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
            Create new password
            </h1>
            <p className="text-xs sm:text-sm text-[--text-secondary]">
            Your new password must be different from previous passwords.
            </p>
        </div>

        {errors.general && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 text-center font-medium">
            {errors.general}
            </div>
        )}

        <div className="flex flex-col gap-4 w-full mt-2">
            <PasswordInput
            label="New Password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            error={errors.password}
            autoFocus
            />

            <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
            hideRequirements
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
                'Resetting...'
            ) : (
                <>
                Reset Password <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
            )}
            </Button>
        </div>
        </form>
    )}
    </div>
);
}

export default function ResetPasswordPage() {
return (
    <Suspense fallback={null}>
    <ResetPasswordContent />
    </Suspense>
);
}
