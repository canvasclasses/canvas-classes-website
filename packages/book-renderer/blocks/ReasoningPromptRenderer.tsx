'use client';

import { useState } from 'react';
import { ReasoningPromptBlock } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

// ── Section identity — the "Think" family (violet), one consistent look ───────
// All reasoning prompts share a single identity: label "Think It Through",
// violet accent, no difficulty level shown, no per-type colour. The four
// reasoning sub-types (logical / spatial / quantitative / analogical) still
// exist in the data but no longer drive the visuals — see the book colour
// system (Learn=amber, Think=violet, Connect=cyan, Remember=sky).
// Muted lavender — the bright #a78bfa/#8b5cf6 read as neon; these are
// desaturated for an elegant, textbook feel while staying in the violet
// "Think" family. Keep in sync with the legend swatch in ChapterOpener.tsx.
const ACCENT = '#a99bcf';                         // muted lavender — text / borders
const ACCENT_BASE = '#7a6ba8';                    // muted violet — left bar
const ACCENT_DIM = 'rgba(122,107,168,0.16)';      // muted violet — tinted fills
const SECTION_LABEL = 'Think It Through';

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReasoningPromptRenderer({ block }: { block: ReasoningPromptBlock }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [committed, setCommitted] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const hasOptions = block.options && block.options.length > 0;

  function commit() {
    setCommitted(true);
    // Auto-show reveal after a brief pause so the commit registers first
    setTimeout(() => setShowReveal(true), 300);
  }

  return (
    <div className="my-8" style={{ borderLeft: `3px solid ${ACCENT_BASE}`, paddingLeft: '1.25rem' }}>

      {/* Header row — one consistent "Think It Through" signpost, no level */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: ACCENT_DIM, color: ACCENT }}
        >
          {SECTION_LABEL}
        </span>
      </div>

      {/* Prompt */}
      <div className="mb-4">
        <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/82 font-medium">
          {block.prompt}
        </InlineMarkdown>
      </div>

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
                  ? `1.5px solid ${ACCENT}`
                  : '1.5px solid rgba(255,255,255,0.09)',
                background: selected === i ? ACCENT_DIM : 'transparent',
                color: selected === i ? '#f1f5f9' : 'rgba(255,255,255,0.82)',
              }}
            >
              <span className="mr-2" style={{ color: selected === i ? ACCENT : 'rgba(255,255,255,0.4)' }}>
                {String.fromCharCode(65 + i)}.
              </span>
              <InlineMarkdown>{opt}</InlineMarkdown>
            </button>
          ))}
        </div>
      )}

      {/* Open-ended prompt (no options) — just a think nudge */}
      {!hasOptions && !committed && (
        <p className="text-sm text-white/45 mb-4 italic">
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
            background: (hasOptions && selected === null) ? 'rgba(255,255,255,0.04)' : ACCENT_DIM,
            color: (hasOptions && selected === null) ? 'rgba(255,255,255,0.2)' : ACCENT,
            border: `1.5px solid ${(hasOptions && selected === null) ? 'rgba(255,255,255,0.06)' : ACCENT}`,
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
              <span className="text-xs text-white/45">Your answer:</span>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: ACCENT_DIM, color: ACCENT }}
              >
                {String.fromCharCode(65 + selected)}. <InlineMarkdown>{block.options![selected]}</InlineMarkdown>
              </span>
            </div>
          )}

          {showReveal && (
            <div
              className="rounded-xl px-4 py-3 text-sm leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>
                What to notice
              </p>
              <InlineMarkdown paragraphClassName="leading-relaxed mb-2 last:mb-0">{block.reveal}</InlineMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
