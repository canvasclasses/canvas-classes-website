"use client";

import { useEffect } from 'react';
import { X, LogIn } from 'lucide-react';
import Link from 'next/link';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const PLACEHOLDER = { streak: 14, attempted: 1205, totalQ: 2530, mastered: 4, masteredOf: 28, accuracy: 72, activeDays: [0, 1, 2, 3, 4] };

interface ProgressPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

export default function ProgressPanel({ isOpen, onClose, isLoggedIn }: ProgressPanelProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const p = PLACEHOLDER;
  const pct = Math.round((p.attempted / p.totalQ) * 100);
  const R = 44;
  const C = 2 * Math.PI * R;

  const stats = [
    { val: p.attempted.toLocaleString(), label: 'Solved', color: '#a78bfa' },
    { val: p.totalQ.toLocaleString(), label: 'Total Qs', color: '#38bdf8' },
    { val: `${p.mastered}/${p.masteredOf}`, label: 'Ch Mastered', color: '#34d399' },
    { val: `${p.accuracy}%`, label: 'Accuracy', color: '#fbbf24' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-lg animate-[fadeIn_0.2s_ease]"
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] z-[81] bg-[#050505] border-l border-white/[0.06] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] flex flex-col animate-[slideInRight_0.3s_ease-out] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-[18px] px-5 border-b border-white/[0.06] shrink-0">
          <h2 className="text-[17px] font-semibold text-zinc-50 m-0 tracking-tight">
            My Progress
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-300/80 cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 px-5 relative">
          {/* Blur overlay for logged-out users */}
          {!isLoggedIn && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] p-6">
              <div className="text-center">
                <h3 className="text-base font-semibold text-zinc-50 mb-2 tracking-tight">
                  Login to track progress
                </h3>
                <p className="text-xs text-slate-400/80 mb-5 leading-relaxed font-normal">
                  Sign in to save your progress and track streaks.
                </p>
                <Link
                  href="/login?next=/the-crucible"
                  className="inline-flex items-center gap-2 p-[11px] px-6 bg-blue-500/10 border border-blue-500/25 rounded-[10px] text-blue-400 text-[13px] font-semibold no-underline backdrop-blur-xl transition-all duration-150 hover:bg-blue-500/12"
                >
                  <LogIn className="w-4 h-4" /> Log in
                </Link>
              </div>
            </div>
          )}

          <div className={`${isLoggedIn ? '' : 'blur-[6px] opacity-40 pointer-events-none'}`}>
            {/* Ring chart */}
            <div className="flex justify-center mb-7">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r={R} fill="none"
                  stroke="url(#progress-grad)"
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - pct / 100)}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
                />
                <defs>
                  <linearGradient id="progress-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="monospace">{pct}%</text>
                <text x="60" y="72" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="sans-serif">complete</text>
              </svg>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {stats.map(({ val, label, color }) => (
                <div key={label} className="bg-white/[0.02] border border-white/[0.06] rounded-[10px] p-3.5 px-4 text-center backdrop-blur-xl">
                  <div className="text-[22px] font-bold leading-none" style={{ color }}>
                    {val}
                  </div>
                  <div className="text-[10px] text-slate-400/70 mt-1.5 font-medium">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Streak section */}
            <div className="bg-orange-600/[0.06] border border-orange-600/15 rounded-xl p-4 px-[18px] backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-orange-400 tracking-tight">
                  {String.fromCodePoint(0x1F525)} {p.streak} day streak
                </span>
                <span className="text-[10px] text-slate-400/60 font-medium uppercase tracking-wider">
                  This week
                </span>
              </div>
              <div className="flex gap-1.5 justify-between">
                {DAYS.map((d, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 aspect-square max-w-[40px] rounded-lg border flex items-center justify-center text-[11px] font-semibold transition-all duration-150 ${
                      p.activeDays.includes(i)
                        ? 'bg-orange-600/15 border-orange-600/30 text-orange-400'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400/40'
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
