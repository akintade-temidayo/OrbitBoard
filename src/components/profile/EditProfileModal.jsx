'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';
import FileUploadInput from '@/components/ui/FileUploadInput';
import TextInput from '@/components/ui/TextInput';
import TextArea from '@/components/ui/TextArea';

const AVATAR_PRESETS = [
'alex_dev',
'jordan_tech',
'taylor_code',
'sam_ui',
'morgan_next',
'riley_css',
];

function EditProfileForm({ isOpen, onClose, currentProfile, onSave }) {
const [displayName, setDisplayName] = useState(currentProfile?.fullName || currentProfile?.displayName || '');
const [bio, setBio] = useState(currentProfile?.bio || '');
const [selectedAvatar, setSelectedAvatar] = useState(currentProfile?.avatarUrl || '');
const [fileUpload, setFileUpload] = useState(() => (
    currentProfile?.avatarUrl && !currentProfile.avatarUrl.includes('dicebear.com')
    ? { dataUrl: currentProfile.avatarUrl }
    : null
));
const [isSaving, setIsSaving] = useState(false);

const handleSelectPreset = (seed) => {
    const presetUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setSelectedAvatar(presetUrl);
    setFileUpload(null); // Clear custom upload selection when a preset is chosen
};

const handleFileUploadChange = (file) => {
    setFileUpload(file);
    if (file?.dataUrl) {
    setSelectedAvatar(file.dataUrl); // Use custom upload data URL as selected avatar
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    setIsSaving(true);
    
    const updatedData = {
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: fileUpload?.dataUrl || selectedAvatar,
    };

    await onSave(updatedData);
    onClose();
    } catch (error) {
    console.error('Failed to update profile:', error);
    } finally {
    setIsSaving(false);
    }
};

return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Profile Picture Section */}
        <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-[--text-primary]">
            Profile Picture
        </label>
        
        <div className="flex items-center gap-4">
            {/* Live Preview */}
            <Avatar src={selectedAvatar} alt="Preview" size="lg" className="w-16 h-16 border border-[--border-subtle] shrink-0" />

            {/* Avatar Presets */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <span className="text-[11px] font-medium text-[--text-secondary]">Choose an avatar preset:</span>
            <div className="flex items-center gap-2 flex-wrap">
                {AVATAR_PRESETS.map((seed) => {
                const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                const isSelected = selectedAvatar === url && !fileUpload;

                return (
                    <button
                    key={seed}
                    type="button"
                    onClick={() => handleSelectPreset(seed)}
                    className={`relative rounded-full p-0.5 border-2 transition-all ${
                        isSelected ? 'border-[--accent-warm] scale-105' : 'border-transparent hover:border-[--border-subtle]'
                    }`}
                    >
                    <Avatar src={url} alt={seed} className="w-8 h-8" />
                    {isSelected && (
                        <div className="absolute -bottom-1 -right-1 bg-[--accent-warm] text-white rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5" />
                        </div>
                    )}
                    </button>
                );
                })}
            </div>
            </div>
        </div>

        {/* Upload Custom Image Option */}
        <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-[11px] font-medium text-[--text-secondary]">Or upload custom image:</span>
            <FileUploadInput
            accept="image/*"
            value={fileUpload}
            onChange={handleFileUploadChange}
            placeholder="Upload custom picture"
            />
        </div>
        </div>

        {/* Display Name using TextInput */}
        <TextInput
        label="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Enter display name"
        />

        {/* Bio using TextArea */}
        <TextArea
        label="Bio"
        value={bio}
        onChange={(newVal) => setBio(newVal)}
        placeholder="Tell the community about yourself..."
        maxLength={160}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2.5 mt-2">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[--border-subtle] text-[--text-primary] hover:bg-[--bg-main] transition-colors"
        >
            Cancel
        </button>
        <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[--accent-warm] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
            {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        </div>
    </form>
    </Modal>
);
}

export default function EditProfileModal(props) {
    const { isOpen, currentProfile } = props;
    const profileKey = currentProfile
        ? `${currentProfile.fullName || currentProfile.displayName || ''}-${currentProfile.avatarUrl || ''}-${currentProfile.bio || ''}`
        : 'empty';

    return <EditProfileForm key={`${isOpen}-${profileKey}`} {...props} />;
}
