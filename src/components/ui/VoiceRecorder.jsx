'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Square, Play, Pause, Trash2, Check } from 'lucide-react';

export default function VoiceRecorder({ onVoiceRecorded, onCancel }) {
const [isRecording, setIsRecording] = useState(false);
const [recordingTime, setRecordingTime] = useState(0);
const [audioUrl, setAudioUrl] = useState(null);
const [isPlaying, setIsPlaying] = useState(false);
const [audioBase64, setAudioBase64] = useState(null);

const mediaRecorderRef = useRef(null);
const audioChunksRef = useRef([]);
const timerRef = useRef(null);
const audioPlayerRef = useRef(null);

const startRecording = useCallback(async () => {
    try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
        }
    };

    mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
        setAudioBase64(reader.result);
        setAudioUrl(reader.result);
        };

        stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
    }, 1000);
    } catch (err) {
    console.error('Microphone access error:', err);
    alert('Unable to access microphone. Please check permissions.');
    if (onCancel) onCancel();
    }
}, [onCancel]);

// Auto-start recording as soon as component renders
useEffect(() => {
    const startTimer = setTimeout(() => {
    startRecording();
    }, 0);

    return () => {
    clearTimeout(startTimer);
    if (timerRef.current) clearInterval(timerRef.current);
    };
}, [startRecording]);

const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    }
};

const togglePlayback = () => {
    if (!audioPlayerRef.current) return;

    if (isPlaying) {
    audioPlayerRef.current.pause();
    setIsPlaying(false);
    } else {
    audioPlayerRef.current.play();
    setIsPlaying(true);
    }
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const handleConfirm = () => {
    if (!audioBase64) return;
    onVoiceRecorded({
    fileName: `Voice Note (${formatTime(recordingTime)})`,
    type: 'audio',
    url: audioBase64,
    duration: recordingTime,
    });
};

return (
    <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[--bg-surface] border border-[--border-subtle] w-full min-h-12.5">
    {isRecording && (
        <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="text-xs font-mono font-medium text-red-400">
            Recording... {formatTime(recordingTime)}
            </span>
        </div>

        <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-semibold transition-colors shrink-0"
        >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
        </button>
        </div>
    )}

    {!isRecording && audioUrl && (
        <div className="flex items-center justify-between w-full gap-2">
        <audio
            ref={audioPlayerRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
        />

        <div className="flex items-center gap-2">
            <button
            type="button"
            onClick={togglePlayback}
            className="p-1.5 rounded-lg bg-[--bg-surface-hover] text-[--text-primary] hover:text-[--accent-warm] transition-colors"
            >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <span className="text-xs font-mono text-[--text-secondary]">
            {formatTime(recordingTime)}
            </span>
        </div>

        <div className="flex items-center gap-1">
            <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-[--text-secondary] hover:text-red-500 rounded-lg hover:bg-[--bg-surface-hover] transition-colors"
            title="Discard"
            >
            <Trash2 className="w-4 h-4" />
            </button>
            <button
            type="button"
            onClick={handleConfirm}
            className="p-1.5 bg-[--accent-warm] text-white rounded-lg hover:opacity-90 transition-opacity"
            title="Attach Voice Note"
            >
            <Check className="w-4 h-4" />
            </button>
        </div>
        </div>
    )}
    </div>
);
}