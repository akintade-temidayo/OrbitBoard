'use client';

import { useState, useRef } from 'react';
import NextImage from 'next/image';
import { Image, Link as LinkIcon, FileText, Upload, X, Film } from 'lucide-react';
import SelectDropdown from '@/components/ui/SelectDropdown';
import RichTextArea from '@/components/ui/RichTextArea';
import FloatingLabelInput from '@/components/ui/FloatingLabelInput';
import Button from '@/components/ui/Button';

export default function CreatePostForm({ onSubmit, orbits = [] }) {
const [selectedOrbit, setSelectedOrbit] = useState('');
const [activeTab, setActiveTab] = useState('text'); // 'text' | 'media' | 'link'
const [title, setTitle] = useState('');
const [bodyText, setBodyText] = useState('');
const [linkUrl, setLinkUrl] = useState('');
const [mediaFiles, setMediaFiles] = useState([]);
const [isSubmitting, setIsSubmitting] = useState(false);
const fileInputRef = useRef(null);

// Format options for SelectDropdown
const dropdownOptions = orbits.map((orbit) => ({
    value: orbit.id || orbit.name,
    label: `r/${orbit.name}`,
}));

const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const formattedFiles = await Promise.all(files.map(async (file) => {
    const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
        reader.readAsDataURL(file);
    });

    return {
        name: file.name,
        size: file.size,
        sizeLabel: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        mimeType: file.type,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        dataUrl,
        previewUrl: dataUrl,
    };
    }));

    setMediaFiles((prev) => [...prev, ...formattedFiles]);
};

const handleRemoveMedia = (index) => {
    setMediaFiles((prev) => {
    const updated = [...prev];
    return updated.filter((_, i) => i !== index);
    });
};

const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim() || !selectedOrbit) return;

    setIsSubmitting(true);

    try {
    if (onSubmit) {
        await onSubmit({
        orbitId: selectedOrbit,
        title,
        type: activeTab,
        bodyText,
        linkUrl,
        mediaFiles,
        });
    }
    } catch (err) {
    console.error('Failed to create post:', err);
    } finally {
    setIsSubmitting(false);
    }
};

return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
    {/* Orbit Selector Dropdown */}
    <div className="flex flex-col gap-1.5">
        <SelectDropdown
        label="CHOOSE AN ORBIT"
        options={dropdownOptions}
        value={selectedOrbit}
        onChange={setSelectedOrbit}
        placeholder="Select a community..."
        />
    </div>

    {/* Post Type Tabs */}
    <div className="flex items-center gap-1 border-b border-[--border-subtle] pb-2">
        <button
        type="button"
        onClick={() => setActiveTab('text')}
        style={activeTab === 'text' ? { backgroundColor: 'var(--accent-warm)' } : undefined}
        className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'text'
            ? 'text-white shadow-sm'
            : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface-hover]'
        }`}
        >
        <FileText className="w-4 h-4" />
        <span>Post</span>
        </button>

        <button
        type="button"
        onClick={() => setActiveTab('media')}
        style={activeTab === 'media' ? { backgroundColor: 'var(--accent-warm)' } : undefined}
        className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'media'
            ? 'text-white shadow-sm'
            : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface-hover]'
        }`}
        >
        <Image className="w-4 h-4" alt="" />
        <span>Images & Video</span>
        </button>

        <button
        type="button"
        onClick={() => setActiveTab('link')}
        style={activeTab === 'link' ? { backgroundColor: 'var(--accent-warm)' } : undefined}
        className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'link'
            ? 'text-white shadow-sm'
            : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface-hover]'
        }`}
        >
        <LinkIcon className="w-4 h-4" />
        <span>Link</span>
        </button>
    </div>

    {/* Title Field */}
    <FloatingLabelInput
        label="Title"
        value={title}
        onChange={(e) => setTitle(typeof e === 'string' ? e : e?.target?.value ?? '')}
        placeholder="An interesting title..."
        required
    />

    {/* Content Inputs Based on Tab */}
    {activeTab === 'text' && (
        <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[--text-secondary]">Text (optional)</label>
        <RichTextArea
            value={bodyText}
            onChange={(val) => setBodyText(val)}
            placeholder="What's on your mind?"
            onSubmit={() => {}}
            hideSendButton
        />
        </div>
    )}

    {activeTab === 'media' && (
        <div className="flex flex-col gap-3">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleMediaUpload}
            accept="image/*,video/*"
            multiple
            className="hidden"
        />

        {/* Upload Dropzone */}
        <div
            onClick={() => fileInputRef.current?.click()}
            style={{ backgroundColor: 'var(--bg-subtle)' }}
            className="border-2 border-dashed border-[--border-subtle] hover:border-[--accent-warm] hover:bg-[--bg-surface-hover] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
        >
            <div
            style={{ backgroundColor: 'var(--bg-surface)' }}
            className="p-3 rounded-full group-hover:scale-110 transition-transform mb-2"
            >
            <Upload className="w-6 h-6 text-[--accent-warm]" />
            </div>
            <p className="text-sm font-semibold text-[--text-primary]">
            Drag and drop images or videos, or <span className="text-[--accent-warm]">Upload</span>
            </p>
            <p className="text-xs text-[--text-secondary] mt-1">Supports PNG, JPG, MP4, WEBM, MOV</p>
        </div>

        {/* Media Previews */}
        {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-1">
            {mediaFiles.map((file, idx) => (
                <div
                key={idx}
                style={{ backgroundColor: 'var(--bg-subtle)' }}
                className="relative group rounded-xl overflow-hidden border border-[--border-subtle] aspect-video flex items-center justify-center"
                >
                {file.type === 'image' ? (
                    <NextImage
                    src={file.previewUrl}
                    alt={file.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1 p-2 text-center">
                    <Film className="w-8 h-8 text-[--accent-warm]" />
                    <span className="text-xs font-medium text-[--text-primary] truncate max-w-30">
                        {file.name}
                    </span>
                    <span className="text-[10px] text-[--text-secondary]">{file.sizeLabel}</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => handleRemoveMedia(idx)}
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
                </div>
            ))}
            </div>
        )}
        </div>
    )}

    {activeTab === 'link' && (
        <FloatingLabelInput
        label="Link URL"
        value={linkUrl}
        onChange={(e) => setLinkUrl(typeof e === 'string' ? e : e?.target?.value ?? '')}
        placeholder="https://example.com"
        />
    )}

    {/* Submit Controls */}
    <div className="pt-2 flex justify-end">
        <Button
        type="submit"
        variant="primary"
        disabled={
            isSubmitting ||
            !title.trim() ||
            !selectedOrbit ||
            (activeTab === 'media' && mediaFiles.length === 0) ||
            (activeTab === 'link' && !linkUrl.trim())
        }
        isLoading={isSubmitting}
        className="px-6 py-2.5 rounded-xl font-semibold text-xs"
        >
        Post to Orbit
        </Button>
    </div>
    </form>
);
}