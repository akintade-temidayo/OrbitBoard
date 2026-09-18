'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import PasswordInput from '@/components/ui/PasswordInput';
import RegistrationSuccessModal from './RegistrationSuccessModal';
import { authService } from '@/services/authService';
import { uploadImage } from '@/services/uploadService';

export default function EnterPasswordPage() {
const router = useRouter();
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errors, setErrors] = useState({});
const [isModalOpen, setIsModalOpen] = useState(false);
const [loading, setLoading] = useState(false);

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

    const draft = JSON.parse(localStorage.getItem('orbitboard_registration_draft') || '{}');
    if (!draft.fullName || !draft.username || !draft.email) {
        setErrors({ general: 'Your registration details are incomplete. Please start again.' });
        return;
    }

    setLoading(true);
    try {
        const registration = await authService.register({ ...draft, password });
        if (draft.avatarUrl?.startsWith('data:') && registration?.token) {
            const avatarUrl = await uploadImage({
                dataUrl: draft.avatarUrl,
                fileName: draft.avatarName,
                token: registration.token,
            });
            await authService.updateProfile({ avatarUrl }, registration.token);
        }
        localStorage.removeItem('orbitboard_registration_draft');
        setIsModalOpen(true);
    } catch (error) {
        setErrors({ general: error?.message || 'Unable to create your account.' });
    } finally {
        setLoading(false);
    }
};

return (
    <>
    <div className="flex flex-col w-full max-w-md mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-4 text-xs font-semibold">
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

        {/* Progress Bar (Step 4 of 4 - 100% Progress) */}
        <ProgressBar currentStep={4} totalSteps={4} />

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
            Set your password
            </h1>
            <p className="text-xs sm:text-sm text-[--text-secondary]">
            Make sure it&apos;s secure and easy to remember.
            </p>
        </div>

        {errors.general && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 text-center font-medium">
            {errors.general}
            </div>
        )}

        <div className="flex flex-col gap-4 w-full mt-2">
            <PasswordInput
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            error={errors.password}
            autoFocus
            />

            <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
            hideRequirements
            />
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4 mt-2">
            <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full justify-center py-3.5 rounded-2xl font-semibold shadow-lg shadow-sky-500/10"
            >
            {loading ? 'Creating account...' : <>Complete Registration <ArrowRight className="w-4 h-4 ml-1.5" /></>}
            </Button>

            <p className="text-[11px] text-[--text-secondary] text-center">
            By registering, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-[--text-primary]">
                Terms of Service
            </Link>
            .
            </p>
        </div>
        </form>
    </div>

    <RegistrationSuccessModal
        isOpen={isModalOpen}
        onLogin={() => router.push('/login')}
        onHome={() => router.push('/')}
    />
    </>
);
}
