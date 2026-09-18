'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import EmailInput from '@/components/ui/EmailInput';

export default function EnterEmailPage() {
const router = useRouter();
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleEmailChange = (e) => {
    // Safely extracts value whether 'e' is an event object or a direct string
    const val = typeof e === 'string' ? e : e?.target?.value ?? '';
    setEmail(val);
    setError('');
};

const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
    setError('Email address is required');
    return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
    setError('Please enter a valid email address');
    return;
    }

    const existingDraft = JSON.parse(localStorage.getItem('orbitboard_registration_draft') || '{}');
    localStorage.setItem('orbitboard_registration_draft', JSON.stringify({
        ...existingDraft,
        email: email.trim().toLowerCase(),
    }));
    router.push('/register/enter-password');
};

return (
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

    {/* Progress Bar (Step 3 of 4 - 75% Progress) */}
    <ProgressBar currentStep={3} totalSteps={4} />

    {/* Main Form */}
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
            Enter your email
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary]">
            We&apos;ll use this to secure your account access.
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

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4 mt-2">
        <Button
            type="submit"
            variant="primary"
            className="w-full justify-center py-3.5 rounded-2xl font-semibold shadow-lg shadow-sky-500/10"
        >
            Continue <ArrowRight className="w-4 h-4 ml-1.5" />
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
);
}
