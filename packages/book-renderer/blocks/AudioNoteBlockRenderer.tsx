'use client';

import { useState, useRef } from 'react';
import { Headphones, Pause, Play } from 'lucide-react';
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
    // Plain row (no card border/fill), matching the quiet nav list. Small
    // headphone glyph instead of a bright icon circle; the progress track only
    // appears once playing so a quiet row stays quiet.
    return (
      <div>
        <audio
          ref={audioRef}
          src={block.src}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          preload="metadata"
        />
        <button
          onClick={toggle}
          className="w-full flex items-center gap-2.5 py-1.5 pl-3 pr-2 rounded-md hover:bg-white/[0.03] transition-colors text-left"
          aria-label={playing ? 'Pause audio' : 'Play audio'}
        >
          <span className="shrink-0 text-sky-400/90">
            {playing ? <Pause size={13} fill="currentColor" /> : <Headphones size={14} />}
          </span>
          <span className="flex-1 text-left text-[14px] font-medium text-white/70 leading-snug line-clamp-2">
            {block.label ?? 'Audio Explanation'}
          </span>
          <span className="text-[12px] text-white/30 tabular-nums shrink-0">
            {formatTime(playing ? currentTime : block.duration_sec)}
          </span>
        </button>
        {playing && (
          <div className="h-0.5 bg-white/8 ml-3 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-100"
              style={{ width: `${progress}%`, background: 'linear-gradient(to right, #38bdf8, #22d3ee)' }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-3 rounded-xl border border-white/10 bg-[#0E1420] overflow-hidden">
      <audio
        ref={audioRef}
        src={block.src}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        preload="metadata"
      />

      {/* Header row is now ONE button — the whole row plays/pauses, not just a small
          disconnected circle. Play/Pause icon moved to the LEFT (the convention every
          media player uses), with a Play triangle — not a Headphones glyph — since a
          triangle is the universal "press this to play" signal. */}
      <button
        onClick={toggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.03] transition-colors"
        aria-label={playing ? 'Pause audio' : 'Play audio'}
      >
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400
          flex items-center justify-center text-black">
          {playing
            ? <Pause size={16} fill="black" />
            : <Play size={16} fill="black" className="ml-0.5" />}
        </div>

        {/* Multicolor waveform — now a secondary visual beside the label, not the
            focal point (the play button is). */}
        <div className="flex items-end gap-[2.5px] shrink-0" style={{ height: 26 }}>
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
            {playing ? 'Playing…' : 'Tap to listen'}
          </p>
        </div>

        <span className="text-[12px] text-white/30 tabular-nums shrink-0">
          {formatTime(playing ? currentTime : block.duration_sec)}
        </span>
      </button>

      {/* Progress bar — kept as a sibling below the button (not nested inside it),
          so seeking never also triggers the play/pause toggle. */}
      <div className="px-4 pb-3.5">
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
