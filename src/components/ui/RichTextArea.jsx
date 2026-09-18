'use client';

import { useState } from 'react';
import { Paperclip, Send, Mic } from 'lucide-react';
import TextArea from './TextArea';
import EmojiPickerPopover from './EmojiPickerPopover';
import AttachmentPreviewBar from './AttachmentPreviewBar';
import VoiceRecorder from './VoiceRecorder';

export default function RichTextArea({
value: controlledValue,
onChange: controlledOnChange,
onSubmit,
placeholder = 'Write something...',
isLoading,
hideSendButton = false,
}) {
const [internalText, setInternalText] = useState('');
const [attachments, setAttachments] = useState([]);
const [isRecordingMode, setIsRecordingMode] = useState(false);

const text = controlledValue !== undefined ? controlledValue : internalText;

const handleTextChange = (val) => {
    if (controlledOnChange) {
    controlledOnChange(val);
    } else {
    setInternalText(val);
    }
};

const handleEmojiSelect = (emoji) => {
    handleTextChange((text || '') + emoji);
};

const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const mapped = await Promise.all(files.map(async (f) => {
    const isAudio = f.type.startsWith('audio/');
    const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error(`Unable to read ${f.name}.`));
        reader.readAsDataURL(f);
    });

    return {
        fileName: f.name,
        fileSize: `${(f.size / 1024).toFixed(0)} KB`,
        size: f.size,
        mimeType: f.type,
        type: f.type.startsWith('image/')
        ? 'image'
        : f.type.startsWith('video/')
        ? 'video'
        : isAudio
        ? 'audio'
        : 'document',
        dataUrl,
        url: dataUrl,
    };
    }));
    setAttachments((prev) => [...prev, ...mapped]);
    e.target.value = '';
};

const handleVoiceNoteRecorded = (voiceAttachment) => {
    setAttachments((prev) => [...prev, voiceAttachment]);
    setIsRecordingMode(false);
};

const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
};

const handleSend = () => {
    if (!(text || '').trim() && attachments.length === 0) return;

    if (onSubmit) {
    onSubmit({ text, attachments });
    }

    setAttachments([]);
    if (controlledOnChange) {
    controlledOnChange('');
    } else {
    setInternalText('');
    }
};

const canSend = Boolean((text || '').trim()) || attachments.length > 0;

return (
    <div className="w-full flex flex-col gap-2">
    <AttachmentPreviewBar attachments={attachments} onRemove={handleRemoveAttachment} />

    {isRecordingMode ? (
        <VoiceRecorder
        onVoiceRecorded={handleVoiceNoteRecorded}
        onCancel={() => setIsRecordingMode(false)}
        />
    ) : (
        <TextArea
        value={text}
        onChange={handleTextChange}
        placeholder={placeholder}
        />
    )}

    <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
        <label className="p-1.5 text-[--text-secondary] hover:text-[--text-primary] rounded-lg hover:bg-[--bg-surface-hover] cursor-pointer transition-colors">
            <Paperclip className="w-4 h-4" />
            <input type="file" multiple onChange={handleFileUpload} className="hidden" />
        </label>

        <EmojiPickerPopover onSelectEmoji={handleEmojiSelect} />

        <button
            type="button"
            onClick={() => setIsRecordingMode((prev) => !prev)}
            className={`p-1.5 rounded-lg transition-colors ${
            isRecordingMode
                ? 'text-red-400 bg-red-500/10'
                : 'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface-hover]'
            }`}
            title={isRecordingMode ? 'Cancel Recording' : 'Record Voice Note'}
        >
            <Mic className="w-4 h-4" />
        </button>
        </div>

        {!hideSendButton && (
        <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || !canSend}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            canSend
                ? 'bg-[--accent-warm] text-white hover:opacity-90 cursor-pointer'
                : 'text-[--text-secondary] opacity-40 cursor-not-allowed'
            }`}
        >
            <Send className="w-3.5 h-3.5" /> Send
        </button>
        )}
    </div>
    </div>
);
}