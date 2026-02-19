'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  label?: string;
}

export default function AudioPlayer({ src, label = 'Audio Solution' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => { setIsPlaying(false); setProgress(0); setCurrentTime(0); };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); } else { audio.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // 20 bars for waveform animation
  const bars = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className="shrink-0 w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition shadow-lg shadow-purple-900/40"
      >
        {isPlaying
          ? <Pause size={14} className="text-white" />
          : <Play size={14} className="text-white ml-0.5" />}
      </button>

      {/* Waveform bars */}
      <div className="flex items-center gap-[2px] h-8 shrink-0">
        {bars.map((i) => {
          const heights = [40, 70, 55, 85, 45, 90, 60, 75, 50, 95, 65, 80, 45, 70, 55, 85, 50, 75, 60, 40];
          const h = heights[i % heights.length];
          return (
            <div
              key={i}
              className={`w-[3px] rounded-full transition-all ${
                isPlaying
                  ? 'bg-purple-400'
                  : 'bg-purple-600/50'
              }`}
              style={{
                height: `${h}%`,
                animationName: isPlaying ? 'waveBar' : 'none',
                animationDuration: `${0.4 + (i % 5) * 0.1}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationDelay: `${(i % 7) * 0.05}s`,
              }}
            />
          );
        })}
      </div>

      {/* Progress bar + label */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-purple-300 font-medium flex items-center gap-1">
            <Volume2 size={10} /> {label}
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            {fmt(currentTime)} / {fmt(duration)}
          </span>
        </div>
        <div
          className="h-1.5 bg-gray-700/60 rounded-full cursor-pointer overflow-hidden"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes waveBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      ` }} />
    </div>
  );
}
