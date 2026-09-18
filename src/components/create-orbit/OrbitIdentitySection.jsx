'use client';

import { useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import TextArea from '@/components/ui/TextArea';
import SelectDropdown from '@/components/ui/SelectDropdown';
import FileUploadInput from '@/components/ui/FileUploadInput';

const CATEGORY_OPTIONS = [
{ label: 'Technology', value: 'Technology' },
{ label: 'Design', value: 'Design' },
{ label: 'Gaming', value: 'Gaming' },
{ label: 'Science', value: 'Science' },
{ label: 'Entertainment', value: 'Entertainment' },
{ label: 'General Discussion', value: 'General Discussion' },
];

export default function OrbitIdentitySection({ formData, onChange }) {
const [uploadError, setUploadError] = useState('');

const handleIconChange = (fileData, errorMsg) => {
    if (errorMsg) {
    setUploadError(errorMsg);
    return;
    }

    setUploadError('');
    // Save file payload to parent form state
    onChange('icon', fileData);
};

// Derive preview URL for the live Avatar component
const avatarPreview =
    formData.icon?.dataUrl ||
    formData.icon?.preview ||
    (typeof formData.icon === 'string' ? formData.icon : null);

return (
    <div className="p-6 rounded-3xl bg-[--bg-surface] border border-[--border-subtle] flex flex-col gap-5">
    <h2 className="text-base font-bold text-[--text-primary] border-b border-[--border-subtle] pb-3">
        1. Identity & Visuals
    </h2>

    {/* Live Avatar Preview + File Upload Input */}
    <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-[--text-primary]">
        Orbit Icon / Avatar
        </label>
        
        <div className="flex items-center gap-4">
        <Avatar
            src={avatarPreview}
            alt={formData.name || 'Orbit'}
            size="lg"
            className="w-16 h-16 text-lg border-2 border-[--border-subtle] shrink-0"
        />

        <div className="flex-1">
            <FileUploadInput
            value={formData.icon}
            onChange={handleIconChange}
            placeholder="Upload Orbit Icon"
            error={uploadError}
            />
        </div>
        </div>
    </div>

    {/* Orbit Name Field */}
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-[--text-primary] flex items-center justify-between">
        <span>Orbit Name</span>
        <span className="text-[10px] text-[--text-secondary]">Cannot be changed later</span>
        </label>
        <div className="relative flex items-center">
        <span className="absolute left-3.5 text-xs font-bold text-[--text-secondary]">
            r/
        </span>
        <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="community_name"
            maxLength={21}
            required
            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[--bg-surface] border border-[--border-subtle] text-xs font-semibold text-[--text-primary] placeholder-[--text-secondary] focus:outline-none focus:border-[--accent-warm] transition-colors"
        />
        </div>
        <p className="text-[10px] text-[--text-secondary]">
        Max 21 characters. Letters, numbers, and underscores only.
        </p>
    </div>

    {/* Category Selection */}
    <SelectDropdown
        label="Category"
        options={CATEGORY_OPTIONS}
        value={formData.category}
        onChange={(val) => onChange('category', val)}
        placeholder="Select a category"
    />

    {/* Description Field */}
    <TextArea
        label="Description"
        value={formData.description}
        onChange={(val) => onChange('description', val)}
        placeholder="What is this orbit about? Tell future members..."
        maxLength={300}
    />
    </div>
);
}