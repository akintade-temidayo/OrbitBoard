'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { orbitService } from '@/services/orbitService';
import { uploadImage } from '@/services/uploadService';
import { useAuth } from '@/hooks/useAuth';

// Sub-components
import CreateOrbitHeader from '@/components/create-orbit/CreateOrbitHeader';
import OrbitIdentitySection from '@/components/create-orbit/OrbitIdentitySection';
import OrbitPrivacySection from '@/components/create-orbit/OrbitPrivacySection';

export default function CreateOrbitPage() {
const router = useRouter();
const { user, token, updateUser } = useAuth();
const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technology',
    isPrivate: false,
    icon: null,
    iconUrl: '',
});
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleInputChange = (field, value) => {
    setFormData((prev) => ({
    ...prev,
    [field]: value,
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
    setError('Orbit name is required');
    return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.name)) {
    setError('Orbit name can only contain letters, numbers, and underscores');
    return;
    }

    setLoading(true);

    try {
    const bannerUrl = formData.icon?.dataUrl
        ? await uploadImage({
            dataUrl: formData.icon.dataUrl,
            fileName: formData.icon.name,
            token,
        })
        : formData.iconUrl;
    const orbit = await orbitService.createOrbit({ ...formData, bannerUrl });
    const orbitName = orbit?.name || orbit?.slug;

    if (!orbitName) {
        router.push('/explore');
        return;
    }

    if (orbit?.id) {
        updateUser?.({ joinedOrbitIds: [...new Set([...(user?.joinedOrbitIds || []), orbit.id])] });
    }

    router.push(`/r/${encodeURIComponent(orbitName)}`);
    } catch (err) {
    console.error('Failed to create orbit:', err);
    setError(err.message || 'Something went wrong. Please try again.');
    } finally {
    setLoading(false);
    }
};

return (
    <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full flex flex-col gap-6 pb-20 md:pb-8">
    <CreateOrbitHeader />

    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
            {error}
        </div>
        )}

        {/* Section 1: Icon, Name, Category, Description */}
        <OrbitIdentitySection formData={formData} onChange={handleInputChange} />

        {/* Section 2: Privacy Selection */}
        <OrbitPrivacySection isPrivate={formData.isPrivate} onChange={handleInputChange} />

        {/* Form Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/explore">
            <Button variant="outline" type="button" className="rounded-2xl text-xs font-semibold px-5 py-2.5">
            Cancel
            </Button>
        </Link>
        <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="rounded-2xl text-xs font-semibold px-6 py-2.5 flex items-center gap-2 shadow-md"
        >
            {loading ? 'Launching...' : 'Create Orbit'}
        </Button>
        </div>
    </form>
    </div>
);
}
