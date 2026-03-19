"use client";

import { useState } from 'react';

export type DifficultyMix = 'balanced' | 'easy' | 'hard' | 'pyq';
export type QuestionSort = 'random' | 'difficulty' | 'topic';

const MIX_OPTIONS: { id: DifficultyMix; label: string; desc: string; color: string }[] = [
  { id: 'balanced', label: 'Balanced', desc: 'Mix of Easy · Medium · Hard', color: '#a78bfa' },
  { id: 'easy',     label: 'Warm Up',  desc: 'Mostly Easy + Medium',        color: '#34d399' },
  { id: 'hard',     label: 'Challenge',desc: 'Mostly Medium + Hard',         color: '#f87171' },
  { id: 'pyq',      label: 'PYQ Only', desc: 'Previous Year Questions',      color: '#fbbf24' },
];

const SORT_OPTIONS: { id: QuestionSort; label: string; desc: string }[] = [
  { id: 'random', label: 'Random', desc: 'Shuffled order' },
  { id: 'difficulty', label: 'Easy → Hard', desc: 'Gradual progression' },
  { id: 'topic', label: 'By Topic', desc: 'Grouped by concept' },
];

export default function TestConfigModal({ maxQ, starQuestionCount = 0, onStart, onClose }: {
  maxQ: number;
  starQuestionCount?: number;
  onStart: (count: number, mix: DifficultyMix, sort: QuestionSort, useStarOnly?: boolean) => void;
  onClose: () => void;
}) {
  const presets = [10, 20, 30].filter(n => n <= maxQ);
  if (maxQ >= 40 && !presets.includes(40)) presets.push(Math.min(40, maxQ));
  if (maxQ > 40 && !presets.includes(maxQ)) presets.push(maxQ);
  const [count, setCount] = useState(Math.min(20, maxQ));
  const [mix, setMix] = useState<DifficultyMix>('balanced');
  const [sort, setSort] = useState<QuestionSort>('random');
  const [useStarOnly, setUseStarOnly] = useState(false);
  
  // Check if star filter is valid for selected count
  const canUseStarFilter = starQuestionCount >= count;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#12141f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px 20px 0 0', padding: '20px 20px 36px', maxWidth: 480, width: '100%', boxShadow: '0 -20px 60px rgba(0,0,0,0.7)' }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.15)', margin: '0 auto 18px' }} />

        <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 3 }}>Configure Test</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 18 }}>
          Questions are picked fresh each session — unseen ones first, then by difficulty.
        </div>

        {/* Question count */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>How many questions?</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {presets.map(n => (
            <button key={n} onClick={() => setCount(n)}
              style={{ flex: 1, minWidth: 52, padding: '10px 6px', borderRadius: 10, border: `1.5px solid ${count === n ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`, background: count === n ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', color: count === n ? '#a78bfa' : 'rgba(255,255,255,0.55)', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'monospace' }}>
              {n}
            </button>
          ))}
        </div>

        {/* Difficulty mix */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Difficulty mix</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {MIX_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setMix(opt.id)}
              style={{ padding: '10px 12px', borderRadius: 12, border: `1.5px solid ${mix === opt.id ? opt.color : 'rgba(255,255,255,0.09)'}`, background: mix === opt.id ? `${opt.color}18` : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: mix === opt.id ? opt.color : '#fff', marginBottom: 2 }}>{opt.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{opt.desc}</div>
            </button>
          ))}
        </div>

        {/* Question order */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Question order</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setSort(opt.id)}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${sort === opt.id ? '#3b82f6' : 'rgba(255,255,255,0.09)'}`, background: sort === opt.id ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: sort === opt.id ? '#60a5fa' : '#fff', marginBottom: 2 }}>{opt.label}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{opt.desc}</div>
            </button>
          ))}
        </div>

        {/* Star-marked questions filter */}
        {starQuestionCount > 0 && (
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => canUseStarFilter && setUseStarOnly(!useStarOnly)}
              disabled={!canUseStarFilter}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                border: `1.5px solid ${useStarOnly ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.09)'}`,
                background: useStarOnly ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.03)',
                cursor: canUseStarFilter ? 'pointer' : 'not-allowed',
                opacity: canUseStarFilter ? 1 : 0.5,
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                border: `2px solid ${useStarOnly ? '#fbbf24' : 'rgba(255,255,255,0.2)'}`,
                background: useStarOnly ? 'rgba(251,191,36,0.25)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}>
                {useStarOnly && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: useStarOnly ? '#fbbf24' : '#fff', marginBottom: 2 }}>
                  Use only star-marked questions
                </div>
                <div style={{ fontSize: 10, color: useStarOnly ? 'rgba(251,191,36,0.7)' : 'rgba(255,255,255,0.4)' }}>
                  {canUseStarFilter ? `${starQuestionCount} hand-picked questions available` : `Need at least ${count} star questions (only ${starQuestionCount} available)`}
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Time estimate */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 18, border: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Estimated time</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{Math.ceil(count * 1.5)} min</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onStart(count, mix, sort, useStarOnly)} style={{ flex: 2, padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.45)' }}>
            Start Test →
          </button>
        </div>
      </div>
    </div>
  );
}
