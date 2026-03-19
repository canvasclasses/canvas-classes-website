"use client";

import { useState } from 'react';
import { LayoutGrid, Clock, Star, ChevronRight } from 'lucide-react';

interface StepModeSelectProps {
  onSelectMode: (mode: 'browse' | 'test') => void;
  onTopPYQ: () => void;
  onQuickRevision?: () => void;
  starQuestionCount?: number;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

export default function StepModeSelect({ onSelectMode, onTopPYQ, onQuickRevision, starQuestionCount = 0, isLoggedIn, onAuthRequired }: StepModeSelectProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const handleBrowseClick = () => {
    onSelectMode('browse');
  };

  const handleTestClick = () => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    onSelectMode('test');
  };

  return (
    <div className="animate-[fadeUp_0.5s_ease-out_0.15s_backwards]">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-[22px] font-bold font-sans bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-transparent m-0 mb-2 tracking-tight">
          What would you like to do?
        </h2>
        <p className="text-sm text-white/50 m-0 mb-5 font-normal">Choose your learning mode</p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Browse Mode Card */}
        <button
          onClick={handleBrowseClick}
          onMouseEnter={() => setHovered('browse')}
          onMouseLeave={() => setHovered(null)}
          className={`w-full p-5 px-[22px] rounded-xl border backdrop-blur-xl cursor-pointer flex items-center gap-4 transition-all duration-250 ${
            hovered === 'browse'
              ? 'border-blue-500/25 bg-blue-500/8 -translate-y-px'
              : 'border-white/[0.06] bg-white/[0.02] translate-y-0'
          }`}
        >
          <div className={`w-11 h-11 rounded-[10px] border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            hovered === 'browse'
              ? 'bg-blue-500/15 border-blue-500/30'
              : 'bg-blue-500/8 border-blue-500/15'
          }`}>
            <LayoutGrid className={`w-5 h-5 transition-colors duration-200 ${
              hovered === 'browse' ? 'text-blue-400' : 'text-blue-400/80'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-zinc-50 mb-0.5 tracking-tight">
              Browse Mode
            </div>
            <div className="text-xs text-slate-400/80 leading-snug font-normal">
              Practice at your own pace with instant solutions
            </div>
          </div>
          <ChevronRight className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-200 ${
            hovered === 'browse' ? 'text-blue-500/60 translate-x-0.5' : 'text-slate-400/40 translate-x-0'
          }`} />
        </button>

        {/* Quick Revision Card - Only show if chapter has ≥20 star questions */}
        {starQuestionCount >= 20 && onQuickRevision && (
          <button
            onClick={onQuickRevision}
            onMouseEnter={() => setHovered('revision')}
            onMouseLeave={() => setHovered(null)}
            className={`w-full p-5 px-[22px] rounded-xl border backdrop-blur-xl cursor-pointer flex items-center gap-4 transition-all duration-250 ${
              hovered === 'revision'
                ? 'border-amber-500/25 bg-amber-500/8 -translate-y-px'
                : 'border-white/[0.06] bg-white/[0.02] translate-y-0'
            }`}
          >
            <div className={`w-11 h-11 rounded-[10px] border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              hovered === 'revision'
                ? 'bg-amber-500/15 border-amber-500/30'
                : 'bg-amber-500/8 border-amber-500/15'
            }`}>
              <Star className={`w-5 h-5 transition-colors duration-200 ${
                hovered === 'revision' ? 'text-amber-400 fill-amber-400' : 'text-amber-400/80 fill-amber-400/80'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold text-zinc-50 mb-0.5 tracking-tight">
                Quick Revision
              </div>
              <div className="text-xs text-slate-400/80 leading-snug font-normal">
                {starQuestionCount} hand-picked questions for final prep
              </div>
            </div>
            <ChevronRight className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-200 ${
              hovered === 'revision' ? 'text-amber-500/60 translate-x-0.5' : 'text-slate-400/40 translate-x-0'
            }`} />
          </button>
        )}

        {/* Timed Test Card */}
        <button
          onClick={handleTestClick}
          onMouseEnter={() => setHovered('test')}
          onMouseLeave={() => setHovered(null)}
          className={`w-full p-5 px-[22px] rounded-xl border backdrop-blur-xl cursor-pointer flex items-center gap-4 transition-all duration-250 ${
            hovered === 'test'
              ? 'border-blue-500/25 bg-blue-500/8 -translate-y-px'
              : 'border-white/[0.06] bg-white/[0.02] translate-y-0'
          }`}
        >
          <div className={`w-11 h-11 rounded-[10px] border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            hovered === 'test'
              ? 'bg-orange-600/15 border-orange-600/30'
              : 'bg-orange-600/8 border-orange-600/15'
          }`}>
            <Clock className={`w-5 h-5 transition-colors duration-200 ${
              hovered === 'test' ? 'text-orange-400' : 'text-orange-400/80'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-zinc-50 mb-0.5 tracking-tight">
              Timed Test
            </div>
            <div className="text-xs text-slate-400/80 leading-snug font-normal">
              Simulate exam conditions with timer and analytics
            </div>
          </div>
          <ChevronRight className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-200 ${
            hovered === 'test' ? 'text-orange-600/60 translate-x-0.5' : 'text-slate-400/40 translate-x-0'
          }`} />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[11px] text-white/35 tracking-widest uppercase font-medium font-sans">
            Quick Start
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />
        </div>

        {/* Top PYQ Shortcut */}
        <button
          onClick={onTopPYQ}
          onMouseEnter={() => setHovered('pyq')}
          onMouseLeave={() => setHovered(null)}
          className={`w-full p-[18px] px-6 rounded-2xl border-2 cursor-pointer text-left text-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center gap-4 ${
            hovered === 'pyq'
              ? 'border-amber-400/35 bg-gradient-to-br from-amber-400/10 to-amber-400/5 -translate-y-0.5 shadow-[0_8px_24px_-6px_rgba(251,191,36,0.3)]'
              : 'border-amber-400/12 bg-gradient-to-br from-amber-400/5 to-amber-400/[0.02] translate-y-0 shadow-[0_2px_6px_rgba(0,0,0,0.08)]'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/15 to-amber-400/8 flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-out ${
            hovered === 'pyq' ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
          }`}>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold font-sans text-amber-400 tracking-tight">
              Top PYQs · Quick Revision
            </div>
            <div className={`text-xs font-normal mt-0.5 transition-colors duration-200 ${
              hovered === 'pyq' ? 'text-white/55' : 'text-white/45'
            }`}>
              Hand-picked must-solve questions
            </div>
          </div>
          <ChevronRight className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            hovered === 'pyq' ? 'text-amber-400/70 translate-x-[3px]' : 'text-amber-400/30 translate-x-0'
          }`} />
        </button>
      </div>
    </div>
  );
}
