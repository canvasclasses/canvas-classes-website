'use client';

import { useState } from 'react';
import { AttentionXrayBlock } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';

/**
 * "The Notification Autopsy" — an interactive reveal that every innocent-looking
 * part of a phone screen is a deliberate, tested design choice built to keep you
 * scrolling. The student taps each card to flip it (innocent → hidden intent);
 * once all are flipped, the closing panel unlocks the business-model reveal
 * (your attention is the product) and lands on agency, not fear.
 *
 * Content-driven: every card + the closing copy live in the DB block, so the
 * founder can retune wording without touching this renderer. See
 * LIFE_SKILLS_WORKFLOW.md §5.3.2 and AttentionXrayBlock in types/books.ts.
 */

// Shared calm Live Books accent — steel-blue (globals.css --book-accent). This
// block was the first to adopt it; now tokenised so it retunes with the rest.
const ACCENT = 'var(--book-accent, #9fb2d4)';                       // labels / headings
const SURFACE_ON = 'var(--book-accent-bg, rgba(159,178,212,0.12))'; // flipped / revealed card background
const BORDER_ON = 'var(--book-accent-border, rgba(159,178,212,0.4))'; // flipped / revealed card border

export default function AttentionXrayRenderer({ block }: { block: AttentionXrayBlock }) {
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const allFlipped = flipped.size >= block.cards.length;

  const flip = (id: string) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  return (
    <div
      className="my-8 rounded-2xl px-5 py-5 sm:px-6"
      style={{ background: 'var(--book-surface, #181A21)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: SURFACE_ON, color: ACCENT }}>
          The Machine
        </span>
        <span className="text-[11px] text-white/30 font-medium uppercase tracking-widest tabular-nums">
          {flipped.size} / {block.cards.length} revealed
        </span>
      </div>
      <h3 className="text-xl font-bold text-white/90 mb-1.5">{block.title}</h3>
      {block.intro && (
        <div className="mb-5">
          <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/60">{block.intro}</InlineMarkdown>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {block.cards.map((card) => {
          const isFlipped = flipped.has(card.id);
          return (
            <button
              key={card.id}
              onClick={() => flip(card.id)}
              disabled={isFlipped}
              className="text-left rounded-xl p-4 transition-all duration-200 min-h-[148px] flex flex-col"
              style={{
                background: isFlipped ? SURFACE_ON : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isFlipped ? BORDER_ON : 'rgba(255,255,255,0.08)'}`,
                cursor: isFlipped ? 'default' : 'pointer',
              }}
            >
              {!isFlipped ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center gap-2">
                  <span className="text-3xl leading-none">{card.front}</span>
                  <span className="text-[15px] font-semibold text-white/75 leading-tight">{card.label}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mt-0.5">Tap to reveal</span>
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: ACCENT }}>
                    {card.label}
                  </span>
                  <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/75">{card.reveal}</InlineMarkdown>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Gated closing reveal */}
      <div className="mt-5">
        {!allFlipped ? (
          <p className="text-[13px] text-white/35 italic text-center py-2">
            Flip all {block.cards.length} to see <span className="text-white/55">why</span> they go to all this trouble →
          </p>
        ) : (
          <div className="rounded-xl px-5 py-4 transition-all duration-300"
            style={{ background: SURFACE_ON, border: `1px solid ${BORDER_ON}` }}>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
              So why do all this?
            </div>
            <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/80 mb-2.5">{block.closing}</InlineMarkdown>
            {block.watch_note && (
              <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <InlineMarkdown paragraphClassName="text-[13px] leading-relaxed text-white/50">{block.watch_note}</InlineMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
