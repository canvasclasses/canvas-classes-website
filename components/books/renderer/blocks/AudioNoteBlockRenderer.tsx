'use client';

import { useState, useRef } from 'react';
import { AudioNoteBlock } from '@/types/books';

const VARIANT_ICONS: Record<string, string> = {
  'Teacher note': '👨‍🏫',
  'Exam tip': '🎯',
  'Important': '⚡',
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioNoteBlockRenderer({ block }: { block: AudioNoteBlock }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    const d = audioRef.current.duration || block.duration_sec;
    setCurrentTime(t);
    setProgress((t / d) * 100);
  };

  const onEnded = () => {
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newTime = ratio * (audioRef.current.duration || block.duration_sec);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const icon = VARIANT_ICONS[block.label] ?? '🎙️';

  return (
    <div className="my-3 flex items-center gap-3 p-3 bg-[#151E32] border border-white/10 rounded-xl">
      <audio
        ref={audioRef}
        src={block.src}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        preload="metadata"
      />

      {/* Play/pause button */}
      <button
        onClick={toggle}
        className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500
          flex items-center justify-center text-black font-bold text-lg hover:scale-105 transition-transform"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? '⏸' : '▶'}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm">{icon}</span>
          <span className="text-sm font-medium text-white/80 truncate">{block.label}</span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer"
          onClick={seek}
        >
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between mt-0.5 text-xs text-white/40">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(block.duration_sec)}</span>
        </div>
      </div>
    </div>
  );
}
