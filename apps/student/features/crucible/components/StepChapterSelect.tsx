"use client";

import { useState, useEffect } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { Chapter } from './types';

const CAT_COLOR: Record<string, string> = { Physical: '#3b82f6', Organic: '#8b5cf6', Inorganic: '#10b981', Practical: '#f59e0b' };
const CAT_ORDER = ['Physical', 'Inorganic', 'Organic', 'Practical'];

interface StepChapterSelectProps {
  chapters: Chapter[];
  selectedChapters: Set<string>;
  onToggle: (id: string) => void;
  onSelectAllClass: (level: number) => void;
  onClearClass: (level: number) => void;
  onClearAll: () => void;
  onContinue: () => void;
  mode: 'browse' | 'test';
  jeeMode: 'mains' | 'advanced';
  onJeeModeChange: (mode: 'mains' | 'advanced') => void;
  topPYQFilter: boolean;
  onTopPYQFilterChange: (value: boolean) => void;
  onBack: () => void;
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="bg-white/[0.08] rounded-full h-0.5 overflow-hidden w-full">
      <div 
        className="h-full rounded-full transition-[width] duration-[400ms] ease-out"
        style={{ 
          width: `${Math.max(value > 0 ? 2 : 0, value)}%`, 
          background: color 
        }} 
      />
    </div>
  );
}

export default function StepChapterSelect({
  chapters, selectedChapters, onToggle, onSelectAllClass, onClearClass, onClearAll,
  onContinue, mode, jeeMode, onJeeModeChange, topPYQFilter, onTopPYQFilterChange, onBack,
}: StepChapterSelectProps) {
  const [activeTab, setActiveTab] = useState<11 | 12>(12);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const classChapters = chapters.filter(ch => ch.class_level === activeTab);
  const grouped: Record<string, Chapter[]> = {};
  classChapters.forEach(ch => {
    const cat = ch.category ?? 'Physical';
    (grouped[cat] = grouped[cat] || []).push(ch);
  });

  const selCount = selectedChapters.size;
  const selQ = chapters.filter(c => selectedChapters.has(c.id)).reduce((s, c) => s + (c.question_count ?? 0), 0);
  const classSelCount = classChapters.filter(c => selectedChapters.has(c.id)).length;
  const allClassSelected = classSelCount === classChapters.length && classChapters.length > 0;

  return (
    <div className="animate-[fadeUp_0.5s_ease-out_0.15s_backwards] flex flex-col h-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-50 m-0 mb-1 tracking-tight">
            Select Chapters
          </h2>
          <p className="text-xs text-slate-400/80 m-0 font-normal">
            {mode === 'browse' ? 'Choose chapters to practice' : 'Pick chapters for your test'}
          </p>
        </div>
        {/* JEE Mode toggle */}
        <div className="flex bg-white/[0.02] rounded-lg p-0.5 gap-0.5 border border-white/[0.06]">
          <button
            onClick={() => onJeeModeChange('mains')}
            className={`px-3 py-1.5 rounded-md border-none cursor-pointer transition-all duration-150 whitespace-nowrap text-[11px] font-medium ${
              jeeMode === 'mains' ? 'bg-blue-500/12 text-blue-400' : 'bg-transparent text-slate-400/60'
            }`}
          >
            JEE Mains
          </button>
          <button
            onClick={() => onJeeModeChange('advanced')}
            className={`px-3 py-1.5 rounded-md border-none cursor-pointer transition-all duration-150 whitespace-nowrap text-[11px] font-medium ${
              jeeMode === 'advanced' ? 'bg-purple-500/12 text-purple-400' : 'bg-transparent text-slate-400/60'
            }`}
          >
            JEE Advanced
          </button>
        </div>
      </div>

      {/* Top PYQ Filter toggle */}
      <div
        onClick={() => onTopPYQFilterChange(!topPYQFilter)}
        className={`flex items-center rounded-xl cursor-pointer transition-all duration-150 select-none mb-3.5 border-[1.5px] ${
          isMobile ? 'gap-2 p-2 px-2.5' : 'gap-3 p-[11px] px-4'
        } ${
          topPYQFilter
            ? 'bg-amber-400/10 border-amber-400/40'
            : 'bg-white/[0.04] border-white/[0.08]'
        }`}
      >
        <span className={isMobile ? 'text-sm' : 'text-lg'}>⭐</span>
        <div className="flex-1 min-w-0">
          <div className={`font-extrabold leading-tight ${
            isMobile ? 'text-xs' : 'text-[15px]'
          } ${
            topPYQFilter ? 'text-amber-400' : 'text-white/85'
          }`}>
            Top PYQs only
          </div>
          <div className={`mt-0.5 ${
            isMobile ? 'text-[10px] whitespace-nowrap overflow-hidden text-ellipsis' : 'text-[11px]'
          } ${
            topPYQFilter ? 'text-amber-400/65' : 'text-white/40'
          }`}>
            {topPYQFilter ? 'Active' : isMobile ? 'Hand-picked' : 'Final revision · hand-picked'}
          </div>
        </div>
        <div className={`rounded-full relative transition-colors duration-200 flex-shrink-0 ${
          isMobile ? 'w-8 h-[18px]' : 'w-[38px] h-[22px]'
        } ${
          topPYQFilter ? 'bg-amber-600' : 'bg-white/12'
        }`}>
          <div 
            className={`absolute rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-[left] duration-200 ${
              isMobile ? 'top-0.5 w-3.5 h-3.5' : 'top-[3px] w-4 h-4'
            }`}
            style={{ left: topPYQFilter ? (isMobile ? 16 : 19) : 3 }}
          />
        </div>
      </div>

      {/* Class tabs */}
      <div className="flex bg-white/[0.02] rounded-[10px] p-0.5 gap-0.5 mb-3 border border-white/[0.06]">
        {[11, 12].map(level => {
          const isActive = activeTab === level;
          const lvlChapters = chapters.filter(c => c.class_level === level);
          const lvlSel = lvlChapters.filter(c => selectedChapters.has(c.id)).length;
          const color = level === 11 ? '#38bdf8' : '#a78bfa';
          return (
            <button
              key={level}
              onClick={() => setActiveTab(level as 11 | 12)}
              className={`flex-1 py-2.5 rounded-[10px] border-none cursor-pointer transition-all duration-150 flex items-center justify-center gap-2 text-[13px] font-bold ${
                isActive ? 'bg-white/[0.08] text-white' : 'bg-transparent text-white/40'
              }`}
            >
              <span>Class {level}</span>
              <span className="text-[11px]" style={{ color: isActive ? color : 'rgba(255,255,255,0.3)' }}>
                {lvlChapters.length} ch
              </span>
              {lvlSel > 0 && (
                <span 
                  className="text-[10px] font-extrabold text-black px-1.5 py-px rounded-full min-w-[18px] text-center"
                  style={{ background: color }}
                >
                  {lvlSel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bulk actions */}
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-[11px] font-medium ${
          classSelCount > 0 ? 'text-slate-400/90' : 'text-slate-400/60'
        }`}>
          {classSelCount > 0
            ? `${classSelCount} of ${classChapters.length} selected`
            : 'Select chapters below'}
        </span>
        <div className="flex gap-2.5">
          <button
            onClick={() => allClassSelected ? onClearClass(activeTab) : onSelectAllClass(activeTab)}
            className="text-[11px] bg-none border-none cursor-pointer font-medium transition-all duration-150 px-2 py-1 rounded-md hover:bg-blue-500/8"
            style={{ color: activeTab === 11 ? '#60a5fa' : '#a78bfa' }}
          >
            {allClassSelected ? 'Deselect All' : 'Select All'}
          </button>
          {selCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-400/60 bg-none border-none cursor-pointer font-medium transition-all duration-150 px-2 py-1 rounded-md hover:bg-white/[0.04] hover:text-slate-400/90"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Chapter list */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
        {CAT_ORDER.filter(cat => grouped[cat]?.length).map(cat => (
          <div key={cat}>
            {/* Category header */}
            <div className="py-2 px-3.5 pb-1 flex items-center gap-2 sticky top-0 bg-[rgba(13,15,26,0.97)] backdrop-blur-lg z-[2] border-b border-white/[0.04]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CAT_COLOR[cat] }} />
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: CAT_COLOR[cat] }}>
                {cat}
              </span>
              <span className="text-[10px] text-white/30 ml-auto">
                {grouped[cat].reduce((s, c) => s + (c.question_count ?? 0), 0)} Qs
              </span>
            </div>

            {/* Chapter rows */}
            {grouped[cat].map(ch => {
              const isSel = selectedChapters.has(ch.id);
              const accent = CAT_COLOR[ch.category ?? 'Physical'];
              const qCount = ch.question_count ?? 0;
              return (
                <div
                  key={ch.id}
                  onClick={() => onToggle(ch.id)}
                  className={`flex items-center gap-3 p-2.5 px-3.5 border-b border-white/[0.03] cursor-pointer transition-all duration-150 select-none ${
                    isSel ? 'hover:brightness-110' : 'hover:bg-white/[0.02]'
                  }`}
                  style={{ background: isSel ? `${accent}08` : 'transparent' }}
                >
                  {/* Checkbox */}
                  <div 
                    className="w-[18px] h-[18px] rounded-[5px] flex-shrink-0 border-[1.5px] flex items-center justify-center transition-all duration-150"
                    style={{
                      borderColor: isSel ? accent : 'rgba(255,255,255,0.12)',
                      background: isSel ? accent : 'transparent'
                    }}
                  >
                    {isSel && (
                      <Check className="w-[11px] h-[11px] text-black" style={{ strokeWidth: 2.5 }} />
                    )}
                  </div>

                  {/* Name + bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[13px] leading-snug overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-150 ${
                        isSel ? 'text-zinc-50 font-medium' : 'text-slate-300/90 font-normal'
                      }`}>
                        {ch.name}
                      </span>
                      <span 
                        className="text-[11px] font-semibold ml-2.5 flex-shrink-0 px-1.5 py-0.5 rounded"
                        style={{
                          color: qCount > 0 ? accent : 'rgba(148,163,184,0.4)',
                          background: qCount > 0 ? `${accent}0a` : 'transparent'
                        }}
                      >
                        {qCount > 0 ? `${qCount}` : '—'}
                      </span>
                    </div>
                    <Bar value={qCount > 0 ? Math.min(100, Math.round((qCount / 200) * 100)) : 0} color={accent} />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div className="h-2" />
      </div>

      {/* Bottom sticky bar */}
      <div className="pt-3.5 flex items-center gap-2.5 flex-shrink-0">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-[10px] border border-white/[0.06] bg-transparent text-slate-300/80 text-[13px] font-medium cursor-pointer flex-shrink-0 transition-all duration-150 hover:bg-white/[0.04] hover:border-white/12"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={selCount === 0}
          className={`flex-1 px-[18px] py-3 rounded-[10px] border backdrop-blur-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 ${
            selCount > 0
              ? 'border-blue-500/25 bg-blue-500/10 text-blue-400 cursor-pointer hover:bg-blue-500/12'
              : 'border-white/[0.06] bg-white/[0.02] text-slate-400/50 cursor-not-allowed'
          }`}
        >
          {selCount > 0 ? (
            <>
              <span>Continue</span>
              <span className="text-xs opacity-70">·</span>
              <span className="text-xs opacity-80">{selCount} ch · {selQ.toLocaleString()} Qs</span>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </>
          ) : (
            'Select at least 1 chapter'
          )}
        </button>
      </div>
    </div>
  );
}
