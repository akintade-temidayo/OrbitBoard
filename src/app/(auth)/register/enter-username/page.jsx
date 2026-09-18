'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, AtSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import TextInput from '@/components/ui/TextInput';
import FileUploadInput from '@/components/ui/FileUploadInput';

export default function EnterUsernamePage() {
const router = useRouter();
const [username, setUsername] = useState('');
const [avatar, setAvatar] = useState(null);
const [error, setError] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
    setError('Username is required');
    return;
    }
    if (username.length < 3) {
    setError('Username must be at least 3 characters');
    return;
    }

    const existingDraft = JSON.parse(localStorage.getItem('orbitboard_registration_draft') || '{}');
    localStorage.setItem('orbitboard_registration_draft', JSON.stringify({
        ...existingDraft,
        username: username.trim().toLowerCase(),
        avatarUrl: avatar?.dataUrl || '',
        avatarName: avatar?.name || 'avatar.jpg',
    }));
    router.push('/register/enter-email');
};

return (
    <div className="flex flex-col justify-between h-full">
    <div>
        <div className="flex items-center justify-between mb-6">
        <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-[--text-secondary] hover:text-[--text-primary] transition-colors"
        >
            <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <Link href="/login" className="text-xs font-semibold text-[--accent-warm] hover:underline">
            Log in instead
        </Link>
        </div>
        <ProgressBar currentStep={2} totalSteps={4} />
    </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-auto">
        <div>
        <h2 className="text-xl font-bold text-[--text-primary]">Choose a handle & avatar</h2>
        <p className="text-xs text-[--text-secondary] mt-1">Set up your unique identity across Orbits.</p>
        </div>

        <div className="flex flex-col gap-4 mt-2">
        {/* Avatar Upload */}
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[--text-primary]">Profile Picture</label>
            <FileUploadInput
            accept="image/*"
            value={avatar}
            onChange={(file) => setAvatar(file)}
            placeholder="Upload avatar"
            />
        </div>

        {/* Username Input */}
        <TextInput
            label="Username"
            prefix="u/"
            value={username}
            onChange={(e) => {
            setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
            setError('');
            }}
            placeholder="johndoe"
            icon={AtSign}
            error={error}
            autoFocus
        />
        </div>

        <Button type="submit" variant="primary" className="mt-4 w-full">
        Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
    </form>

    <p className="text-[10px] text-[--text-secondary] text-center mt-6">
        By registering, you agree to our <span className="underline cursor-pointer">Terms of Service</span>.
    </p>
    </div>
);
}
