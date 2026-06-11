'use client';

import { useState, useRef } from 'react';
import { Headphones, Pause } from 'lucide-react';
import { AudioNoteBlock } from '@canvas/data/types/books';

// Waveform bar heights (%) — natural audio silhouette
const WAVE_HEIGHTS = [30, 55, 75, 45, 90, 65, 40, 80, 55, 35, 70, 95, 50, 78, 42, 62, 85, 48, 68, 52];

// Multicolor bar colors cycling: orange → amber → sky
const BAR_COLORS = [
  '#fb923c','#fbbf24','#fcd34d','#bae6fd','#7dd3fc',
  '#fb923c','#fbbf24','#fcd34d','#bae6fd','#7dd3fc',
  '#fb923c','#fbbf24','#fcd34d','#bae6fd','#7dd3fc',
  '#fb923c','#fbbf24','#fcd34d','#bae6fd','#7dd3fc',
];

// Staggered animation durations for alive waveform feel
const BAR_DURATIONS = [0.6,0.8,0.5,0.9,0.7,0.6,0.8,0.5,0.7,0.9,0.6,0.8,0.5,0.7,0.9,0.6,0.8,0.5,0.7,0.6];

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioNoteBlockRenderer({ block, compact = false }: { block: AudioNoteBlock; compact?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(p => !p);
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    const d = audioRef.current.duration || block.duration_sec;
    setCurrentTime(t);
    setProgress(d ? (t / d) * 100 : 0);
  };

  const onEnded = () => { setPlaying(false); setProgress(0); setCurrentTime(0); };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * (audioRef.current.duration || block.duration_sec);
  };

  if (!block.src) return null;

  // ── Compact card (rail "Watch & Listen") — same footprint as a video card,
  //    with a headphones icon so audio reads as audio at a glance. ──
  if (compact) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
        <audio
          ref={audioRef}
          src={block.src}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          preload="metadata"
        />
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
          aria-label={playing ? 'Pause audio' : 'Play audio'}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400
            flex items-center justify-center shrink-0 text-black">
            {playing ? <Pause size={13} fill="black" /> : <Headphones size={15} />}
          </div>
          <span className="flex-1 text-left text-[15px] font-medium text-white/70 leading-snug line-clamp-2">
            {block.label ?? 'Audio Explanation'}
          </span>
          <span className="text-[12px] text-white/30 tabular-nums shrink-0">
            {formatTime(playing ? currentTime : block.duration_sec)}
          </span>
        </button>
        {/* thin progress track at the card foot */}
        <div className="h-0.5 bg-white/8">
          <div
            className="h-full transition-all duration-100"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right, #38bdf8, #22d3ee)' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 p-4 rounded-xl border border-white/10 bg-[#0E1420]">
      <audio
        ref={audioRef}
        src={block.src}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        preload="metadata"
      />

      {/* Header row */}
      <div className="flex items-center gap-3 mb-3.5">

        {/* Multicolor waveform */}
        <div className="flex items-end gap-[2.5px] shrink-0" style={{ height: 32 }}>
          {WAVE_HEIGHTS.map((h, i) => (
            <div
              key={i}
              style={{
                height: `${h}%`,
                backgroundColor: BAR_COLORS[i],
                opacity: playing ? 0.9 : 0.35,
                borderRadius: 2,
                width: 3,
                transformOrigin: 'bottom',
                animation: playing
                  ? `audioWave ${BAR_DURATIONS[i]}s ease-in-out ${i * 35}ms infinite alternate`
                  : 'none',
              }}
            />
          ))}
        </div>

        {/* Labels */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white/80 leading-tight truncate">
            {block.label ?? 'Audio Explanation'}
          </p>
          <p className="text-[11px] text-white/35 mt-0.5">
            Listen to the audio explanation
          </p>
        </div>

        {/* Play / Pause — blue + headphones so audio reads as audio (matches the rail) */}
        <button
          onClick={toggle}
          className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400
            flex items-center justify-center text-black hover:scale-105 transition-transform"
          aria-label={playing ? 'Pause audio' : 'Play audio'}
        >
          {playing
            ? <Pause size={15} fill="black" />
            : <Headphones size={16} />}
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1 bg-white/10 rounded-full cursor-pointer"
        onClick={seek}
      >
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(to right, #38bdf8, #22d3ee)',
          }}
        />
      </div>

      {/* Time */}
      <div className="flex justify-between mt-1.5 text-[11px] text-white/30 tabular-nums">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(block.duration_sec)}</span>
      </div>

      {/* Waveform keyframe */}
      <style>{`
        @keyframes audioWave {
          0%   { transform: scaleY(0.45); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
