'use client';

import { useState } from 'react';
import { ReasoningPromptBlock, ReasoningType } from '@/types/books';

// ── Type config ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ReasoningType, { label: string; color: string; dimColor: string }> = {
  logical:      { label: 'Logical Reasoning',     color: '#d97706', dimColor: 'rgba(217,119,6,0.12)' },
  spatial:      { label: 'Spatial Reasoning',      color: '#3b82f6', dimColor: 'rgba(59,130,246,0.12)' },
  quantitative: { label: 'Quantitative Reasoning', color: '#10b981', dimColor: 'rgba(16,185,129,0.12)' },
  analogical:   { label: 'Analogical Reasoning',   color: '#7c3aed', dimColor: 'rgba(124,58,237,0.12)' },
};

const LEVEL_LABEL: Record<number, string> = {
  1: 'Comprehension', 2: 'Application', 3: 'Analysis', 4: 'Evaluation', 5: 'Pattern & Analogy',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReasoningPromptRenderer({ block }: { block: ReasoningPromptBlock }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [committed, setCommitted] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const { color, dimColor, label } = TYPE_CONFIG[block.reasoning_type];
  const hasOptions = block.options && block.options.length > 0;

  function commit() {
    setCommitted(true);
    // Auto-show reveal after a brief pause so the commit registers first
    setTimeout(() => setShowReveal(true), 300);
  }

  return (
    <div className="my-8" style={{ borderLeft: `3px solid ${color}`, paddingLeft: '1.25rem' }}>

      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: dimColor, color }}
        >
          {label}
        </span>
        <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">
          Level {block.difficulty_level} · {LEVEL_LABEL[block.difficulty_level]}
        </span>
      </div>

      {/* Prompt */}
      <p className="text-[15px] leading-relaxed text-white/90 mb-4 font-medium">
        {block.prompt}
      </p>

      {/* MCQ options */}
      {hasOptions && !committed && (
        <div className="flex flex-col gap-2 mb-4">
          {block.options!.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-150"
              style={{
                border: selected === i
                  ? `1.5px solid ${color}`
                  : '1.5px solid rgba(255,255,255,0.07)',
                background: selected === i ? dimColor : 'transparent',
                color: selected === i ? '#f1f5f9' : 'rgba(255,255,255,0.55)',
              }}
            >
              <span className="mr-2" style={{ color: selected === i ? color : 'rgba(255,255,255,0.2)' }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Open-ended prompt (no options) — just a think nudge */}
      {!hasOptions && !committed && (
        <p className="text-sm text-white/35 mb-4 italic">
          Take a moment to form your answer before reading further.
        </p>
      )}

      {/* Commit button */}
      {!committed && (
        <button
          onClick={commit}
          disabled={hasOptions && selected === null}
          className="text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150"
          style={{
            background: (hasOptions && selected === null) ? 'rgba(255,255,255,0.04)' : dimColor,
            color: (hasOptions && selected === null) ? 'rgba(255,255,255,0.2)' : color,
            border: `1.5px solid ${(hasOptions && selected === null) ? 'rgba(255,255,255,0.06)' : color}`,
            cursor: (hasOptions && selected === null) ? 'not-allowed' : 'pointer',
          }}
        >
          {hasOptions ? 'Commit to Answer' : 'I have thought about it'}
        </button>
      )}

      {/* Committed state — show selected answer + reveal */}
      {committed && (
        <div>
          {hasOptions && selected !== null && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-white/35">Your answer:</span>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: dimColor, color }}
              >
                {String.fromCharCode(65 + selected)}. {block.options![selected]}
              </span>
            </div>
          )}

          {showReveal && (
            <div
              className="rounded-xl px-4 py-3 text-sm leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color }}>
                What to notice
              </p>
              {block.reveal}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
