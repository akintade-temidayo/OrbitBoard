'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import TextInput from '@/components/ui/TextInput';

export default function EnterFullNamePage() {
const router = useRouter();
const [fullName, setFullName] = useState('');
const [error, setError] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
    setError('Full name is required');
    return;
    }
    localStorage.setItem('orbitboard_registration_draft', JSON.stringify({ fullName: fullName.trim() }));
    router.push('/register/enter-username');
};

return (
    <div className="flex flex-col gap-8 w-full">
    {/* Step Header with Progress Indicator */}
    <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[--text-secondary]">
        </div>
        <ProgressBar currentStep={1} totalSteps={4} />
    </div>

    {/* Form Content */}
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[--text-primary] tracking-tight">
            What&apos;s your full name?
        </h1>
        <p className="text-xs sm:text-sm text-[--text-secondary]">
            Let us know how we should address you on Orbit.
        </p>
        </div>

        <div className="mt-2 max-w-md mx-auto w-full">
        <TextInput
            label="Full Name"
            value={fullName}
            onChange={(e) => {
            setFullName(e.target.value);
            setError('');
            }}
            placeholder="e.g. John Doe"
            icon={User}
            error={error}
            autoFocus
        />
        </div>

        <div className="flex flex-col items-center gap-4 mt-2">
        <Button
            type="submit"
            variant="primary"
            className="w-full max-w-xs justify-center py-3.5 rounded-full font-semibold shadow-lg shadow-sky-500/10"
        >
            Next
        </Button>

        <p className="text-xs text-[--text-secondary]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[--accent-warm] hover:underline">
            Log in instead
            </Link>
        </p>
        </div>
    </form>
    </div>
);
}
