"use client";

import { useState } from 'react';
import { ChevronLeft, LayoutGrid, Clock, Zap } from 'lucide-react';
import { Chapter } from './types';

export type DifficultyMix = 'balanced' | 'easy' | 'hard' | 'pyq';

const MIX_OPTIONS: { id: DifficultyMix; label: string; desc: string; color: string; icon: string }[] = [
  { id: 'balanced', label: 'Balanced',  desc: 'Easy + Medium + Hard mix', color: '#a78bfa', icon: '⚖️' },
  { id: 'easy',     label: 'Warm Up',   desc: 'Mostly Easy + Medium',     color: '#34d399', icon: '🌱' },
  { id: 'hard',     label: 'Challenge', desc: 'Mostly Medium + Hard',     color: '#f87171', icon: '🔥' },
  { id: 'pyq',      label: 'PYQ Only',  desc: 'Previous Year Questions',  color: '#fbbf24', icon: '⭐' },
];

interface StepConfirmLaunchProps {
  mode: 'browse' | 'test';
  chapters: Chapter[];
  selectedChapters: Set<string>;
  jeeMode: 'mains' | 'advanced';
  onLaunch: (count?: number, mix?: DifficultyMix) => void;
  onBack: () => void;
  loading: boolean;
}

export default function StepConfirmLaunch({
  mode, chapters, selectedChapters, jeeMode, onLaunch, onBack, loading,
}: StepConfirmLaunchProps) {
  const selChapters = chapters.filter(c => selectedChapters.has(c.id));
  const selQ = selChapters.reduce((s, c) => s + (c.question_count ?? 0), 0);

  // Test config state
  const presets = [10, 20, 30].filter(n => n <= selQ);
  if (selQ >= 40 && !presets.includes(40)) presets.push(Math.min(40, selQ));
  if (selQ > 40 && !presets.includes(selQ)) presets.push(selQ);
  const [count, setCount] = useState(Math.min(20, selQ));
  const [mix, setMix] = useState<DifficultyMix>('balanced');

  // Group selected chapters by class
  const class11Sel = selChapters.filter(c => c.class_level === 11);
  const class12Sel = selChapters.filter(c => c.class_level === 12);

  return (
    <div className="animate-[fadeUp_0.5s_ease-out_0.15s_backwards]">
      {/* Summary header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-zinc-50 m-0 mb-1 tracking-tight">
          {mode === 'browse' ? 'Ready to Practice' : 'Configure Your Test'}
        </h2>
        <p className="text-xs text-slate-400/80 m-0 font-normal">
          {mode === 'browse'
            ? 'Review your selection and start browsing'
            : 'Set parameters and launch your test'}
        </p>
      </div>

      {/* Selection summary card */}
      <div className="p-4 px-[18px] rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4 backdrop-blur-xl">
        {/* Stats row */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 p-3 px-3.5 rounded-[10px] bg-purple-500/8 border border-purple-500/15 text-center">
            <div className="text-[22px] font-bold text-purple-400 leading-none">{selChapters.length}</div>
            <div className="text-[10px] text-slate-400/70 mt-1.5 font-medium">Chapters</div>
          </div>
          <div className="flex-1 p-3 px-3.5 rounded-[10px] bg-blue-500/8 border border-blue-500/15 text-center">
            <div className="text-[22px] font-bold text-blue-400 leading-none">{selQ.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400/70 mt-1.5 font-medium">Questions</div>
          </div>
          <div className={`flex-1 p-3 px-3.5 rounded-[10px] border text-center ${
            jeeMode === 'mains'
              ? 'bg-blue-500/8 border-blue-500/15'
              : 'bg-purple-500/8 border-purple-500/15'
          }`}>
            <div className={`text-[13px] font-bold mt-0.5 ${
              jeeMode === 'mains' ? 'text-blue-400' : 'text-purple-400'
            }`}>
              {jeeMode === 'mains' ? 'JEE Mains' : 'JEE Adv'}
            </div>
            <div className="text-[10px] text-slate-400/70 mt-1.5 font-medium">Exam Level</div>
          </div>
        </div>

        {/* Chapter list preview */}
        <div className="text-[10px] text-slate-400/60 mb-1.5 font-medium">Selected chapters:</div>
        <div className="flex flex-wrap gap-1.5">
          {class11Sel.length > 0 && (
            <span className="text-[10px] px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
              Class 11: {class11Sel.length}
            </span>
          )}
          {class12Sel.length > 0 && (
            <span className="text-[10px] px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold">
              Class 12: {class12Sel.length}
            </span>
          )}
          {selChapters.slice(0, 5).map(ch => (
            <span key={ch.id} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] text-slate-300/80 font-medium border border-white/[0.06]">
              {ch.name.length > 20 ? ch.name.slice(0, 20) + '…' : ch.name}
            </span>
          ))}
          {selChapters.length > 5 && (
            <span className="text-[10px] text-slate-400/60 px-2 py-1 font-medium">
              +{selChapters.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Test configuration (only for test mode) */}
      {mode === 'test' && (
        <>
          {/* Question count */}
          <div className="mb-4">
            <div className="text-[11px] font-medium text-slate-400/70 mb-2 uppercase tracking-wider">
              Question Count
            </div>
            <div className="flex gap-2 flex-wrap">
              {presets.map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 min-w-[52px] p-3 px-2 rounded-lg border backdrop-blur-xl text-base font-semibold cursor-pointer transition-all duration-150 ${
                    count === n
                      ? 'border-blue-500/25 bg-blue-500/12 text-blue-400'
                      : 'border-white/[0.06] bg-white/[0.02] text-slate-300/70'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty mix */}
          <div className="mb-4">
            <div className="text-[11px] font-medium text-slate-400/70 mb-2 uppercase tracking-wider">
              Difficulty Mix
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MIX_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMix(opt.id)}
                  className="p-2.5 px-3 rounded-[10px] border backdrop-blur-xl cursor-pointer text-left transition-all duration-150 text-white"
                  style={{
                    borderColor: mix === opt.id ? `${opt.color}40` : 'rgba(255,255,255,0.06)',
                    background: mix === opt.id ? `${opt.color}12` : 'rgba(255,255,255,0.02)'
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm">{opt.icon}</span>
                    <span 
                      className="text-[13px] font-semibold"
                      style={{ color: mix === opt.id ? opt.color : '#fafafa' }}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400/70 font-normal leading-tight">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time estimate */}
          <div className="flex items-center justify-between p-2.5 px-3.5 bg-white/[0.02] rounded-[10px] mb-4 border border-white/[0.06] backdrop-blur-xl">
            <span className="text-xs text-slate-400/80 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" /> Estimated time
            </span>
            <span className="text-[15px] font-semibold text-blue-400 px-2.5 py-0.5 bg-blue-500/12 rounded-md border border-blue-500/20">
              {Math.ceil(count * 1.5)} min
            </span>
          </div>
        </>
      )}

      {/* Action buttons */}
      <div className="flex gap-2.5">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-[10px] border border-white/[0.06] bg-transparent text-slate-300/80 text-[13px] font-medium cursor-pointer shrink-0 flex items-center gap-1.5 transition-all duration-150 hover:bg-white/[0.04] hover:border-white/12"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => mode === 'test' ? onLaunch(count, mix) : onLaunch()}
          disabled={loading}
          className={`flex-1 px-[18px] py-3 rounded-[10px] border backdrop-blur-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 ${
            loading
              ? 'border-white/[0.06] bg-white/[0.02] text-slate-400/50 cursor-not-allowed'
              : mode === 'browse'
                ? 'border-blue-500/25 bg-blue-500/10 text-blue-400 cursor-pointer hover:bg-blue-500/12'
                : 'border-orange-600/25 bg-orange-600/10 text-orange-400 cursor-pointer hover:bg-orange-600/12'
          }`}
        >
          {loading ? (
            <>Loading...</>
          ) : mode === 'browse' ? (
            <>
              <LayoutGrid className="w-[18px] h-[18px]" />
              Start Browsing
            </>
          ) : (
            <>
              <Zap className="w-[18px] h-[18px]" />
              Start Test — {count} Questions
            </>
          )}
        </button>
      </div>
    </div>
  );
}
