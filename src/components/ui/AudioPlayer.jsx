'use client';

import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

export default function AudioPlayer({ src, duration }) {
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [totalDuration, setTotalDuration] = useState(duration || 0);

const audioRef = useRef(null);

const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
    audioRef.current.pause();
    setIsPlaying(false);
    } else {
    audioRef.current.play();
    setIsPlaying(true);
    }
};

const handleLoadedMetadata = () => {
    if (audioRef.current?.duration && !isNaN(audioRef.current.duration)) {
    setTotalDuration(audioRef.current.duration);
    }
};

const handleTimeUpdate = () => {
    if (audioRef.current) {
    setCurrentTime(audioRef.current.currentTime);
    }
};

const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
    audioRef.current.currentTime = time;
    }
};

const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const progressPercent = totalDuration ? (currentTime / totalDuration) * 100 : 0;

return (
    <div className="flex items-center gap-3 p-2 rounded-xl bg-white/10 border border-white/10 w-full min-w-55">
    <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
        setIsPlaying(false);
        setCurrentTime(0);
        }}
        className="hidden"
    />

    {/* Custom Play/Pause Button */}
    <button
        type="button"
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 transition-all active:scale-95"
    >
        {isPlaying ? (
        <Pause className="w-4 h-4 fill-current" />
        ) : (
        <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
    </button>

    {/* Custom Slider & Timers */}
    <div className="flex flex-col flex-1 gap-1 min-w-0">
        <div className="relative w-full flex items-center h-2">
        {/* Track background */}
        <div className="absolute inset-0 rounded-full bg-white/20 overflow-hidden">
            <div
            className="h-full bg-sky-300 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
            />
        </div>

        {/* Invisible Range Input for Seeking */}
        <input
            type="range"
            min="0"
            max={totalDuration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        </div>

        <div className="flex justify-between items-center text-[10px] text-white/80 font-mono tracking-tight">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(totalDuration)}</span>
        </div>
    </div>
    </div>
);
}