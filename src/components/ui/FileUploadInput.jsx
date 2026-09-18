'use client';

import { useState, useRef } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';

export default function FileUploadInput({
value,
onChange,
accept = 'image/*',
placeholder = 'Upload image',
error,
}) {
const [isDragging, setIsDragging] = useState(false);
const fileInputRef = useRef(null);

// Helper to handle file selection
const handleFile = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
    onChange?.(null, 'Please choose a file smaller than 5MB.');
    return;
    }

    const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Unable to read the selected image.'));
        reader.readAsDataURL(file);
    });

    // Data URLs survive navigation and JSON/localStorage serialization.
    onChange?.({ name: file.name, type: file.type, size: file.size, dataUrl });
};

const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
    handleFile(droppedFile);
    }
};

const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
};

const handleDragLeave = () => {
    setIsDragging(false);
};

const handleRemove = (e) => {
    e.stopPropagation();
    onChange?.(null);
    if (fileInputRef.current) {
    fileInputRef.current.value = '';
    }
};

const isImage = value?.type?.startsWith('image/') || (typeof value === 'string' && value);
const imagePreviewUrl = isImage
    ? value?.dataUrl || value?.preview || (typeof value === 'string' ? value : null)
    : null;

return (
    <div className="w-full flex flex-col gap-1">
    <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
    />

    <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full cursor-pointer rounded-2xl border-2 border-dashed p-4 transition-all duration-200 flex items-center justify-between bg-(--bg-surface) ${
        isDragging
            ? 'border-(--accent-warm) bg-(--accent-warm)/5'
            : error
            ? 'border-red-500'
            : 'border-(--border-subtle) hover:border-(--accent-warm)/60'
        }`}
    >
        {value?.dataUrl || imagePreviewUrl ? (
        // Preview state when image is uploaded
        <div className="flex items-center gap-3 w-full">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-(--border-subtle) bg-black/10 shrink-0">
            {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Uploaded file preview" className="h-full w-full object-cover" />
            ) : (
                <FileText className="w-5 h-5 m-auto text-(--accent-warm)" />
            )}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-(--text-primary) truncate">
                {value?.name || 'Uploaded picture'}
            </span>
            <span className="text-[10px] text-(--text-secondary)">
                Click to replace image
            </span>
            </div>

            <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors shrink-0"
            title="Remove picture"
            >
            <X className="w-4 h-4" />
            </button>
        </div>
        ) : (
        // Default state asking for upload
        <div className="flex items-center gap-3 w-full py-1">
            <div className="w-10 h-10 rounded-xl bg-(--accent-warm)/10 text-(--accent-warm) flex items-center justify-center shrink-0">
            <UploadCloud className="w-5 h-5" />
            </div>

            <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-(--text-primary)">
                {placeholder}
            </span>
            <span className="text-[10px] text-(--text-secondary)">
                PNG, JPG or WEBP (max. 5MB)
            </span>
            </div>
        </div>
        )}
    </div>

    {error && (
        <span className="text-xs text-red-500 font-medium px-1">{error}</span>
    )}
    </div>
);
}
