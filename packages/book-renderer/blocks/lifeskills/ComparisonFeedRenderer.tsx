'use client';

import { useMemo, useState } from 'react';
import { ComparisonFeedBlock } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';

/**
 * "Comparison Feed" (LS9) — the self-image instrument. A curated highlight-reel
 * feed, a quiet mood meter, and a behind-the-scenes reality under every post.
 *
 * Flow (deterministic + touch-friendly — no hover dependence):
 *   1. The student reads the highlight reel (fronts only).
 *   2. They tap "how do you feel now?" — the meter DROPS. The point: you didn't
 *      decide to feel smaller, the reel did it for you (upward social comparison,
 *      felt, not stated).
 *   3. Flip buttons unlock. Each post flips to its real other half; understanding
 *      pulls the meter back up. Flip them all → the closing lands.
 *
 * Content-driven: posts + closing live in the DB (see ComparisonFeedBlock).
 * Calm steel-blue --book-accent (§5.3.5); the meter uses semantic emerald→amber→
 * coral traffic-light tones (an allowed exception). Motion respects reduce-motion.
 */

const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const ACCENT_BG = 'var(--book-accent-bg, rgba(159,178,212,0.12))';
const ACCENT_BORDER = 'var(--book-accent-border, rgba(159,178,212,0.4))';
const GOOD = '#7bb89a';
const MID = '#c9a86a';
const LOW = '#d98a85';

const DIP_TO = 34;      // where the meter lands after "how do you feel now?"
const PER_FLIP = 15;    // recovery per post flipped
const FINAL = 90;       // meter after every post is flipped

export default function ComparisonFeedRenderer({ block }: { block: ComparisonFeedBlock }) {
  const meterLabel = block.meter_label ?? 'How you feel about your own life';
  const [phase, setPhase] = useState<'reel' | 'dipped'>('reel');
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const allFlipped = flipped.size >= block.posts.length;

  const mood = useMemo(() => {
    if (phase === 'reel') return 100;
    if (allFlipped) return FINAL;
    return Math.min(FINAL, DIP_TO + flipped.size * PER_FLIP);
  }, [phase, flipped, allFlipped, block.posts.length]);

  const moodColor = mood > 74 ? GOOD : mood > 44 ? MID : LOW;
  const moodWord = mood > 74 ? 'fine' : mood > 44 ? 'a little smaller' : 'not enough';

  const note =
    phase === 'reel'
      ? 'Read the feed. Really read it — then tell it how you feel.'
      : allFlipped
      ? "Same people. Same day. Your feed is everyone's best frame — measured against your unedited whole."
      : flipped.size === 0
      ? "Feel that drop? You didn't decide to feel smaller. The highlight reel did it for you."
      : 'There it is — the truth pulls the meter back up. Comparison only works in the dark.';

  function flip(id: string) {
    setFlipped((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <div
      className="rounded-2xl cf-root"
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ACCENT_BORDER}`, padding: '24px 22px 26px' }}
    >
      {block.title && (
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: ACCENT }}>
          {block.title}
        </div>
      )}
      {block.intro && (
        <div className="mb-5" style={{ maxWidth: 560 }}>
          <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/82">{block.intro}</InlineMarkdown>
        </div>
      )}

      <div className="cf-grid">
        {/* feed */}
        <div className="flex flex-col gap-3">
          {block.posts.map((p) => {
            const isFlipped = flipped.has(p.id);
            return (
              <div
                key={p.id}
                className="rounded-2xl cf-card"
                style={{
                  border: `1px solid ${isFlipped ? ACCENT_BORDER : 'rgba(255,255,255,0.09)'}`,
                  background: isFlipped
                    ? 'linear-gradient(180deg, rgba(159,178,212,0.10), rgba(255,255,255,0.02))'
                    : 'rgba(255,255,255,0.025)',
                  padding: '16px 16px',
                }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className="cf-ava"
                    style={{ background: 'linear-gradient(135deg, #9fb2d4, #c9a86a)' }}
                    aria-hidden
                  />
                  <span className="text-[14px] font-semibold text-white/85 leading-tight">
                    {p.who}
                    <span className="block text-[11px] font-normal text-white/45" style={{ fontFamily: 'ui-monospace, monospace' }}>
                      {isFlipped ? p.reveal_label ?? 'the other half' : p.meta ?? ''}
                    </span>
                  </span>
                </div>

                {!isFlipped ? (
                  <div className="cf-fade">
                    <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/82">{p.front}</InlineMarkdown>
                    <button
                      type="button"
                      onClick={() => flip(p.id)}
                      disabled={phase === 'reel'}
                      className="cf-flip mt-3 text-[11.5px] uppercase tracking-[0.05em]"
                      style={{
                        color: phase === 'reel' ? 'rgba(255,255,255,0.22)' : ACCENT,
                        cursor: phase === 'reel' ? 'not-allowed' : 'pointer',
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      See behind the post →
                    </button>
                  </div>
                ) : (
                  <div className="cf-fade">
                    <span
                      className="block text-[11px] uppercase tracking-[0.1em] mb-1.5"
                      style={{ color: ACCENT, fontFamily: 'ui-monospace, monospace' }}
                    >
                      {p.reveal_label ?? "What you didn't see"}
                    </span>
                    <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/85">{p.back}</InlineMarkdown>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* mood meter */}
        <aside
          className="rounded-2xl cf-mood"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '18px 16px' }}
        >
          <div className="text-[11px] uppercase tracking-[0.08em] text-white/45" style={{ fontFamily: 'ui-monospace, monospace' }}>
            Quietly tracking
          </div>
          <div className="text-[16px] font-semibold text-white/85 mt-1.5 mb-4" style={{ lineHeight: 1.25 }}>
            {meterLabel}
          </div>
          <div className="cf-meter">
            <div
              className="cf-meter-fill"
              style={{ width: `${mood}%`, background: moodColor }}
            />
          </div>
          <div className="mt-2.5 text-[13px] text-white/60" style={{ fontFamily: 'ui-monospace, monospace' }}>
            {Math.round(mood)}% — {moodWord}
          </div>
          <p className="mt-3.5 text-[13px] italic text-white/45" style={{ lineHeight: 1.5 }}>
            {note}
          </p>

          {phase === 'reel' && (
            <button
              type="button"
              onClick={() => setPhase('dipped')}
              className="mt-4 w-full rounded-xl text-[13px] font-semibold"
              style={{ padding: '9px 12px', border: `1px solid ${ACCENT_BORDER}`, background: ACCENT_BG, color: ACCENT_STRONG }}
            >
              How do you feel now? ▾
            </button>
          )}
        </aside>
      </div>

      {allFlipped && (
        <div
          className="cf-fade mt-5 rounded-2xl"
          style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, padding: '18px 20px' }}
        >
          <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/85">{block.closing}</InlineMarkdown>
        </div>
      )}

      <style jsx>{`
        .cf-grid {
          display: grid;
          grid-template-columns: 1fr 250px;
          gap: 20px;
          align-items: start;
        }
        .cf-ava {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex: 0 0 auto;
          display: block;
        }
        .cf-mood {
          position: sticky;
          top: 16px;
        }
        .cf-meter {
          height: 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }
        .cf-meter-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.55s ease, background 0.55s ease;
        }
        .cf-fade {
          animation: cfFade 0.4s ease;
        }
        @keyframes cfFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (max-width: 640px) {
          .cf-grid {
            grid-template-columns: 1fr;
          }
          .cf-mood {
            position: static;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-fade {
            animation: none;
          }
          .cf-meter-fill {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
