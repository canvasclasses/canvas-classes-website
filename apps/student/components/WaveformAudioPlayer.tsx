'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

/**
 * WaveformAudioPlayer
 *
 * Custom dark-theme audio player that replaces the browser's default
 * `<audio controls>` widget. The waveform itself is *decorative* — bars are
 * generated deterministically from the audio URL (so each clip has its own
 * stable visual identity) but they don't reflect the real audio amplitude.
 * For sub-2-minute explanation clips this is a defensible trade: real Web
 * Audio analysis would add CORS complexity and a perceptible decode lag for
 * a visual that the student doesn't navigate by anyway.
 *
 * Click anywhere on the waveform to seek. Spacebar toggles play/pause when
 * focused. Time display + volume button on the right.
 *
 * Accent prop drives the active-bar colour so each subject can have its own
 * identity (matches BrowseView / TestView's chapter-accent system).
 */

interface Props {
  src: string;
  /** Hex colour for the played-progress fill. Defaults to a violet that
   *  matches the audio button colour in solution drawers. */
  accent?: string;
  /** Number of waveform bars. Default 56 — fits a typical 2-column layout. */
  barCount?: number;
  /** Optional label shown above the player (e.g. "Audio note 2 of 3"). */
  label?: string;
}

// Deterministic bar-height generator. Same `src` always produces the same
// pattern. Applies a sin-envelope so bars look like a real waveform with
// peaks in the middle rather than a flat noise field.
function generateBars(src: string, count: number): number[] {
  let seed = 0x9e3779b1;
  for (let i = 0; i < src.length; i++) {
    seed = (seed * 31 + src.charCodeAt(i)) >>> 0;
  }
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const noise = (seed % 1000) / 1000;            // 0..1
    const t = (i + 0.5) / count;
    const envelope = Math.sin(t * Math.PI) * 0.55 + 0.45;
    // Min 18% so even quiet bars register; max 100%
    out.push(Math.max(18, Math.round(noise * 100 * envelope)));
  }
  return out;
}

const fmt = (s: number): string => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function WaveformAudioPlayer({
  src,
  accent = '#a855f7',
  barCount = 56,
  label,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  // True while the user is mid-drag on the waveform — pauses progress
  // updates from the audio element so the playhead doesn't snap back.
  const [scrubbing, setScrubbing] = useState(false);

  const bars = useMemo(() => generateBars(src, barCount), [src, barCount]);
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  // Keep state in sync with the underlying <audio> element.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => { if (!scrubbing) setCurrentTime(a.currentTime); };
    const onMeta = () => setDuration(a.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setCurrentTime(0); };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('durationchange', onMeta);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('durationchange', onMeta);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnded);
    };
  }, [scrubbing]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => { /* user gesture required — ignore */ });
    else a.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  }, []);

  const seekFromEvent = useCallback((clientX: number) => {
    const a = audioRef.current;
    const wrap = waveRef.current;
    if (!a || !wrap || !duration) return;
    const rect = wrap.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const target = ratio * duration;
    a.currentTime = target;
    setCurrentTime(target);
  }, [duration]);

  // Drag-to-scrub support — pointer events cover mouse + touch + pen.
  const onPointerDown = (e: React.PointerEvent) => {
    setScrubbing(true);
    seekFromEvent(e.clientX);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!scrubbing) return;
    seekFromEvent(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!scrubbing) return;
    setScrubbing(false);
    seekFromEvent(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowLeft') {
      const a = audioRef.current;
      if (a) a.currentTime = Math.max(0, a.currentTime - 5);
    } else if (e.key === 'ArrowRight') {
      const a = audioRef.current;
      if (a) a.currentTime = Math.min(duration || 0, a.currentTime + 5);
    }
  };

  const filledIdx = Math.floor(progress * bars.length);

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Play / pause */}
      <button
        type="button"
        onClick={togglePlay}
        className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all"
        style={{
          background: playing ? `${accent}33` : `${accent}26`,
          border: `1px solid ${accent}66`,
          color: accent,
          boxShadow: playing ? `0 0 14px -4px ${accent}AA` : 'none',
        }}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Waveform — clickable + draggable for seek */}
      <div
        ref={waveRef}
        role="slider"
        tabIndex={0}
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={currentTime}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setScrubbing(false)}
        onKeyDown={onKeyDown}
        className="flex-1 flex items-center gap-[2px] h-9 cursor-pointer touch-none select-none focus:outline-none"
      >
        {bars.map((h, i) => {
          const filled = i < filledIdx;
          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-colors"
              style={{
                height: `${h}%`,
                background: filled ? accent : 'rgba(255,255,255,0.18)',
                minWidth: 2,
              }}
            />
          );
        })}
      </div>

      {/* Time display */}
      <div className="font-mono text-[11.5px] tabular-nums text-white/65 shrink-0 min-w-[68px] text-right">
        {fmt(currentTime)} <span className="text-white/30">/</span> {fmt(duration)}
      </div>

      {/* Mute */}
      <button
        type="button"
        onClick={toggleMute}
        className="w-8 h-8 rounded-md flex items-center justify-center text-white/55 hover:text-white hover:bg-white/5 transition-colors shrink-0"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Hidden native audio element drives playback */}
      <audio ref={audioRef} preload="metadata" className="sr-only">
        <source src={src} type="audio/webm" />
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {label && (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}
