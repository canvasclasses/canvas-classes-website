'use client';

import { useCallback, useRef, useState } from 'react';
import { EstimateRevealBlock } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';

/**
 * "Estimate Reveal" (LS8) — discover a statistic instead of being told it.
 * The student drags a slider to their honest GUESS, locks it in, and only then
 * watches the researched truth count into place. The teaching is the GAP.
 *
 * Content-driven: question, unit, slider range, truth value, source and the
 * reveal line all live in the DB block (see EstimateRevealBlock). The reveal
 * string may use {guess} {truth} {ratio} tokens so the closing line reacts to
 * how far off the student's guess was.
 *
 * Visual identity: the strand's calm steel-blue --book-accent (never the global
 * orange, per LIFE_SKILLS_WORKFLOW.md §5.3.5). The revealed number shifts to a
 * semantic "this is the sobering truth" tone (an allowed traffic-light exception).
 * Count-up animation is gated behind prefers-reduced-motion.
 */

const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const ACCENT_BG = 'var(--book-accent-bg, rgba(159,178,212,0.12))';
const ACCENT_BORDER = 'var(--book-accent-border, rgba(159,178,212,0.4))';
const ALARM = '#d98a85'; // semantic: the sobering revealed figure

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

export default function EstimateRevealRenderer({ block }: { block: EstimateRevealBlock }) {
  const prefersReduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const step = block.step ?? Math.max(1, Math.round((block.max - block.min) / 100));
  const start = block.default_guess ?? Math.round((block.min + block.max) / 2);

  const [guess, setGuess] = useState(start);
  const [display, setDisplay] = useState(start);
  const [locked, setLocked] = useState(false);
  const rafRef = useRef<number | null>(null);

  const onSlide = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (locked) return;
      const v = Number(e.target.value);
      setGuess(v);
      setDisplay(v);
    },
    [locked],
  );

  const reveal = useCallback(() => {
    if (locked) return;
    setLocked(true);
    const from = guess;
    const to = block.truth;
    if (prefersReduce) {
      setDisplay(to);
      return;
    }
    const dur = 1200;
    let t0: number | null = null;
    const tick = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * e);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [locked, guess, block.truth, prefersReduce]);

  const ratio = guess > 0 ? Math.round(block.truth / guess) : null;
  const revealText = block.reveal
    .replace(/\{guess\}/g, fmt(guess))
    .replace(/\{truth\}/g, fmt(block.truth))
    .replace(/\{ratio\}/g, ratio ? String(ratio) : '—');

  return (
    <div
      className="rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${ACCENT_BORDER}`,
        padding: '26px 24px 28px',
      }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
        style={{ color: ACCENT }}
      >
        Guess first
      </div>

      <p
        className="text-center font-medium mx-auto mb-6"
        style={{ fontSize: 19, lineHeight: 1.5, color: 'rgba(255,255,255,0.86)', maxWidth: 500 }}
      >
        {block.question}
      </p>

      <div className="text-center">
        <div
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontWeight: 700,
            fontSize: 'clamp(46px, 12vw, 78px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: locked ? ALARM : ACCENT_STRONG,
            fontVariantNumeric: 'tabular-nums',
            transition: 'color .4s ease',
          }}
        >
          {fmt(display)}
        </div>
        <div
          className="uppercase tracking-[0.1em] mt-2"
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace' }}
        >
          {locked ? block.reveal_unit ?? block.unit : `your guess · ${block.unit}`}
        </div>
      </div>

      <input
        type="range"
        min={block.min}
        max={block.max}
        step={step}
        value={guess}
        onChange={onSlide}
        disabled={locked}
        aria-label={block.question}
        className="block mx-auto mt-6 w-full"
        style={{ maxWidth: 440, accentColor: '#9fb2d4' }}
      />

      {!locked ? (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={reveal}
            className="rounded-xl font-semibold transition-all"
            style={{
              fontSize: 14.5,
              padding: '11px 20px',
              border: `1px solid ${ACCENT_BORDER}`,
              background: ACCENT_BG,
              color: ACCENT_STRONG,
            }}
          >
            Reveal what studies actually found →
          </button>
        </div>
      ) : (
        <div
          className="mx-auto mt-6 text-center"
          style={{ maxWidth: 520, fontSize: 15.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.72)' }}
        >
          <InlineMarkdown paragraphClassName="text-[15.5px] leading-relaxed">{revealText}</InlineMarkdown>
          {block.source && (
            <div
              className="mt-3"
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.34)', fontFamily: 'ui-monospace, monospace' }}
            >
              <InlineMarkdown paragraphClassName="text-xs leading-relaxed">{block.source}</InlineMarkdown>
            </div>
          )}
        </div>
      )}

      {block.caption && (
        <p
          className="mx-auto mt-6 text-center italic"
          style={{ maxWidth: 540, fontSize: 14, color: 'rgba(255,255,255,0.42)' }}
        >
          <InlineMarkdown paragraphClassName="text-sm italic leading-relaxed">{block.caption}</InlineMarkdown>
        </p>
      )}
    </div>
  );
}
