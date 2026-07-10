'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SelfExperimentBlock } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';
import { readPractice, writePractice } from './practiceStorage';

/**
 * "Self Experiment" — do a small real-world experiment (e.g. 5 minutes without
 * reaching for your phone), then tick which urges/sensations showed up from a
 * fixed list; each selected option reveals a tailored plain-English explanation
 * of what that signal means. Turns a passive "sit and watch" into an active
 * notice → pinpoint → learn loop. Reusable across the strand (focus/stress/health).
 *
 * Content-driven: intro, steps, options + explanations all live in the DB block.
 * Selections persist per-device. See LIFE_SKILLS_WORKFLOW.md §5.3.3 and
 * SelfExperimentBlock in types/books.ts.
 *
 * Visual identity (founder decision 2026-07-05): this block — and only this
 * block, deliberately scoped — gets its own warm, colourful character instead of
 * the strand's flat calm --book-accent: a soft ambient glow behind the card, and
 * each checklist option tinted with its own soft colour drawn from the SAME
 * earthy palette already used in the book's illustrations (coral/sage/honey/
 * rose/indigo), not a new candy-pastel set. Motion is slow and ambient (never
 * fast/attention-grabbing — this is a focus-training book) and the drifting glow
 * is gated behind prefers-reduced-motion. The badge/timer/header keep the shared
 * --book-accent so the block still reads as part of the family.
 */

const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_BG = 'var(--book-accent-bg, rgba(159,178,212,0.12))';
const ACCENT_BORDER = 'var(--book-accent-border, rgba(159,178,212,0.4))';
const EMERALD = '#10b981';

// Earthy pastel option identity — same hue family as the book's own illustrations.
// Cycled by option index so authors never have to assign a colour by hand.
const PALETTE = [
  { fg: '#f6c4ac', accent: '#f2a685', bgOn: 'rgba(242,166,133,0.10)', bgOff: 'rgba(242,166,133,0.035)', borderOn: 'rgba(242,166,133,0.42)', borderOff: 'rgba(242,166,133,0.22)', glow: 'rgba(242,166,133,0.10)' },
  { fg: '#bfe0cc', accent: '#9bcbaa', bgOn: 'rgba(155,203,170,0.10)', bgOff: 'rgba(155,203,170,0.035)', borderOn: 'rgba(155,203,170,0.42)', borderOff: 'rgba(155,203,170,0.22)', glow: 'rgba(155,203,170,0.10)' },
  { fg: '#f0d9a8', accent: '#e8c07d', bgOn: 'rgba(232,192,125,0.10)', bgOff: 'rgba(232,192,125,0.035)', borderOn: 'rgba(232,192,125,0.42)', borderOff: 'rgba(232,192,125,0.22)', glow: 'rgba(232,192,125,0.09)' },
  { fg: '#eab8bf', accent: '#d98a94', bgOn: 'rgba(217,138,148,0.10)', bgOff: 'rgba(217,138,148,0.035)', borderOn: 'rgba(217,138,148,0.42)', borderOff: 'rgba(217,138,148,0.22)', glow: 'rgba(217,138,148,0.10)' },
  { fg: '#b9c6ea', accent: '#93a8d9', bgOn: 'rgba(147,168,217,0.10)', bgOff: 'rgba(147,168,217,0.035)', borderOn: 'rgba(147,168,217,0.42)', borderOff: 'rgba(147,168,217,0.22)', glow: 'rgba(147,168,217,0.10)' },
];

type Store = { selected: string[]; done: number; at: string };

export default function SelfExperimentRenderer({ block }: { block: SelfExperimentBlock }) {
  const hasTimer = !!block.duration_sec;
  const storeKey = `experiment:${block.id}`;

  const [mode, setMode] = useState<'intro' | 'running' | 'reflect'>('intro');
  const [secsLeft, setSecsLeft] = useState(block.duration_sec ?? 0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [doneCount, setDoneCount] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Returning students see their previous answers.
  useEffect(() => {
    const prev = readPractice<Store>(storeKey);
    if (prev) {
      setSelected(new Set(prev.selected));
      setDoneCount(prev.done);
      if (prev.selected.length) setMode('reflect');
    }
  }, [storeKey]);

  const clearTimer = useCallback(() => { if (timer.current) clearInterval(timer.current); }, []);
  useEffect(() => clearTimer, [clearTimer]);

  const startTimer = useCallback(() => {
    setSecsLeft(block.duration_sec ?? 0);
    setMode('running');
    timer.current = setInterval(() => {
      setSecsLeft((s) => {
        if (s <= 1) { clearTimer(); setMode('reflect'); return 0; }
        return s - 1;
      });
    }, 1000);
  }, [block.duration_sec, clearTimer]);

  const persist = useCallback((sel: Set<string>, done: number) => {
    writePractice<Store>(storeKey, { selected: [...sel], done, at: new Date().toISOString() });
  }, [storeKey]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      // count a completed run the first time they pick anything this session
      const done = doneCount === 0 && next.size > 0 ? 1 : doneCount;
      if (done !== doneCount) setDoneCount(done);
      persist(next, done);
      return next;
    });
  };

  const belowMin = block.min_select != null && selected.size > 0 && selected.size < block.min_select;

  return (
    <div className="relative my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <style>{`
        @keyframes sx-glow-drift{0%{transform:translate(-2%,-1%) scale(1)}50%{transform:translate(2%,2%) scale(1.05)}100%{transform:translate(-2%,-1%) scale(1)}}
        @keyframes sx-pop{0%{transform:scale(0.55)}65%{transform:scale(1.18)}100%{transform:scale(1)}}
        .sx-pop{animation:sx-pop 0.32s cubic-bezier(0.34,1.56,0.64,1)}
        @media (prefers-reduced-motion: no-preference){ .sx-glow{animation:sx-glow-drift 22s ease-in-out infinite} }
      `}</style>

      {/* Ambient warm glow — the block's persistent atmosphere, behind everything, slow + subtle */}
      <div className="sx-glow absolute pointer-events-none" style={{
        inset: '-15%', filter: 'blur(30px)',
        background: 'radial-gradient(circle at 22% 18%, rgba(242,166,133,0.16) 0%, transparent 55%),' +
          'radial-gradient(circle at 85% 82%, rgba(155,203,170,0.13) 0%, transparent 55%),' +
          'radial-gradient(circle at 75% 12%, rgba(232,192,125,0.10) 0%, transparent 50%)',
      }} />

      <div className="relative px-5 py-5 sm:px-6" style={{ background: 'color-mix(in srgb, var(--book-surface, #181A21) 88%, transparent)' }}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: ACCENT_BG, color: ACCENT }}>
            Experiment
          </span>
          {hasTimer && (
            <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">
              {Math.round((block.duration_sec ?? 0) / 60)} min
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white/90 mb-1">{block.title}</h3>

        {/* Intro */}
        {mode === 'intro' && (
          <div>
            <div className="mb-3">
              <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/60">{block.intro}</InlineMarkdown>
            </div>
            {block.steps && block.steps.length > 0 && (
              <ul className="mb-4 flex flex-col gap-1.5 text-sm text-white/70">
                {block.steps.map((s, i) => (
                  <li key={i} className="flex gap-2"><span style={{ color: ACCENT_STRONG }}>•</span> <span>{s}</span></li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {hasTimer ? (
                <>
                  <button onClick={startTimer}
                    className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
                    style={{ background: ACCENT_BG, color: ACCENT, border: `1.5px solid ${ACCENT_STRONG}` }}>
                    Start the {Math.round((block.duration_sec ?? 0) / 60)}-minute timer
                  </button>
                  <button onClick={() => setMode('reflect')} className="text-xs text-white/40 hover:text-white/60 underline underline-offset-2">
                    Skip to what I noticed →
                  </button>
                </>
              ) : (
                <button onClick={() => setMode('reflect')}
                  className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
                  style={{ background: ACCENT_BG, color: ACCENT, border: `1.5px solid ${ACCENT_STRONG}` }}>
                  I&rsquo;ve done it — what I noticed →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Running timer */}
        {mode === 'running' && (
          <div className="flex flex-col items-center py-6">
            <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Phone out of reach. Just notice.</span>
            <span className="text-6xl font-bold tabular-nums leading-none" style={{ color: ACCENT }}>
              {Math.floor(secsLeft / 60)}:{String(secsLeft % 60).padStart(2, '0')}
            </span>
            <button onClick={() => { clearTimer(); setMode('reflect'); }}
              className="mt-5 text-xs text-white/40 hover:text-white/60 underline underline-offset-2">
              I&rsquo;m done early →
            </button>
          </div>
        )}

        {/* Reflect — pinpoint + explain, each option in its own earthy tint */}
        {mode === 'reflect' && (
          <div>
            <div className="mb-3">
              <InlineMarkdown paragraphClassName="text-sm font-semibold leading-relaxed text-white/75">{block.prompt}</InlineMarkdown>
            </div>
            <div className="flex flex-col gap-2">
              {block.options.map((opt, i) => {
                const on = selected.has(opt.id);
                const p = PALETTE[i % PALETTE.length];
                return (
                  <div key={opt.id} className="rounded-xl overflow-hidden transition-all duration-200"
                    style={{
                      background: on ? p.bgOn : p.bgOff,
                      border: `1px solid ${on ? p.borderOn : p.borderOff}`,
                      borderLeft: `3px solid ${on ? p.accent : p.borderOn}`,
                      boxShadow: on ? `0 0 20px ${p.glow}` : 'none',
                    }}>
                    <button onClick={() => toggle(opt.id)} className="w-full text-left flex items-start gap-3 p-3">
                      <span className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center text-[11px] font-bold ${on ? 'sx-pop' : ''}`}
                        style={{ background: on ? p.accent : 'transparent', color: on ? '#1a1210' : 'transparent', border: `1.5px solid ${p.accent}`, opacity: on ? 1 : 0.55 }}>
                        ✓
                      </span>
                      <span className="text-sm leading-snug" style={{ color: p.fg, opacity: on ? 1 : 0.72, fontWeight: on ? 600 : 500 }}>
                        {opt.label}
                      </span>
                    </button>
                    {on && (
                      <div className="px-3 pb-3 pl-10">
                        <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/70">{opt.explanation}</InlineMarkdown>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {belowMin && (
              <p className="text-xs text-white/35 italic mt-2">Tick any that showed up — there&rsquo;s no wrong answer.</p>
            )}

            {selected.size > 0 && block.completion_note && (
              <div className="mt-4 rounded-xl px-4 py-3" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)' }}>
                <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/75">{block.completion_note}</InlineMarkdown>
              </div>
            )}

            <div className="mt-3 flex items-center gap-3">
              {hasTimer && (
                <button onClick={startTimer} className="text-xs font-semibold px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Run it again
                </button>
              )}
              {doneCount > 0 && <span className="text-[11px] text-white/25">Done on this device</span>}
              {selected.size > 0 && <span className="ml-auto text-[11px] tabular-nums" style={{ color: EMERALD }}>{selected.size} noticed</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
