'use client';

import { useCallback, useRef, useState } from 'react';
import { GuidedRevealBlock, GuidedRevealChecker, GuidedRevealStep } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';

/**
 * "Guided Reveal" — a paced, click-to-advance walkthrough (a slide-deck-style
 * build-up). Beats reveal one at a time; past beats settle into a dimmed trail so
 * the whole argument stays visible. Advance by clicking the stage, the Next
 * button, or the keyboard (→/Space forward, ← back). One beat can be a
 * `cost_checker` — a tiny interactive verdict tool.
 *
 * Content-driven: every beat lives in the DB block. Reusable platform-wide (any
 * concept that benefits from a paced reveal). See LIFE_SKILLS_WORKFLOW.md §5.3.4
 * and GuidedRevealBlock in types/books.ts.
 */

// Live Books calm accent — one knob for every interactive block (globals.css
// --book-accent). Steel-blue, deliberately NOT the hot global orange, so it never
// competes with the content for attention on a reading surface.
const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const ACCENT_BG = 'var(--book-accent-bg, rgba(159,178,212,0.12))';
const ACCENT_BORDER = 'var(--book-accent-border, rgba(159,178,212,0.4))';

type Tier = 'high' | 'mild' | 'clear';
const TIER_META: Record<Tier, { label: string; color: string; bg: string; border: string }> = {
  high: { label: 'Big hit', color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.32)' },
  mild: { label: 'Some drag', color: '#fbbf24', bg: 'rgba(217,119,6,0.10)', border: 'rgba(217,119,6,0.32)' },
  clear: { label: 'Go for it', color: '#34d399', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.30)' },
};

function tierFor(taskWeight: number, audioWeight: number): Tier {
  const s = taskWeight * audioWeight;
  if (s >= 4) return 'high';
  if (s >= 2) return 'mild';
  return 'clear';
}

function CostChecker({ checker }: { checker: GuidedRevealChecker }) {
  const [t, setT] = useState(0);
  const [a, setA] = useState(0);
  const tier = tierFor(checker.tasks[t]?.weight ?? 0, checker.audios[a]?.weight ?? 0);
  const meta = TIER_META[tier];
  const stop = (e: React.MouseEvent) => e.stopPropagation(); // don't let control clicks advance the deck

  const Chip = ({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) => (
    <button
      onClick={(e) => { stop(e); onClick(); }}
      className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all duration-150"
      style={{
        background: on ? ACCENT_BG : 'rgba(255,255,255,0.04)',
        color: on ? ACCENT : 'rgba(255,255,255,0.6)',
        border: `1px solid ${on ? ACCENT_BORDER : 'rgba(255,255,255,0.1)'}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <div onClick={stop} className="mt-4 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">{checker.task_label}</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {checker.tasks.map((o, i) => <Chip key={o.id} on={i === t} label={o.label} onClick={() => setT(i)} />)}
      </div>
      <div className="text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">{checker.audio_label}</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {checker.audios.map((o, i) => <Chip key={o.id} on={i === a} label={o.label} onClick={() => setA(i)} />)}
      </div>
      <div className="rounded-lg px-4 py-3 transition-all duration-200" style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5"
          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
          {meta.label}
        </span>
        <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/80">{checker.verdicts[tier]}</InlineMarkdown>
      </div>
    </div>
  );
}

function StepView({ step, active }: { step: GuidedRevealStep; active: boolean }) {
  return (
    <div
      className={`relative pl-4 py-3 transition-all duration-300 ${active ? 'motion-safe:animate-[gr-in_0.42s_ease-out]' : 'opacity-45'}`}
      style={{ borderLeft: `2px solid ${active ? ACCENT_STRONG : 'rgba(255,255,255,0.08)'}` }}
    >
      {step.kicker && (
        <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: active ? ACCENT : 'rgba(255,255,255,0.4)' }}>
          {step.kicker}
        </div>
      )}
      <h4 className="text-lg sm:text-xl font-bold text-white/90 leading-snug mb-1.5">{step.headline}</h4>
      {step.image_src && (
        <img src={step.image_src} alt="" className="rounded-xl my-3 w-full max-w-lg" style={{ border: '1px solid rgba(255,255,255,0.08)' }} />
      )}
      {step.body && (
        <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/70 mb-2">{step.body}</InlineMarkdown>
      )}
      {step.kind === 'cost_checker' && step.checker && <CostChecker checker={step.checker} />}
    </div>
  );
}

export default function GuidedRevealRenderer({ block }: { block: GuidedRevealBlock }) {
  const steps = block.steps;
  const [revealed, setRevealed] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const done = revealed >= steps.length;

  const next = useCallback(() => setRevealed((r) => Math.min(steps.length, r + 1)), [steps.length]);
  const prev = useCallback(() => setRevealed((r) => Math.max(1, r - 1)), []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };

  return (
    <div className="my-8 rounded-2xl px-5 py-5 sm:px-6" style={{ background: 'var(--book-surface, #181A21)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <style>{`@keyframes gr-in{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: ACCENT_BG, color: ACCENT }}>
          Walkthrough
        </span>
        <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest tabular-nums">{Math.min(revealed, steps.length)} / {steps.length}</span>
      </div>
      <h3 className="text-xl font-bold text-white/90 mb-1">{block.title}</h3>
      {block.intro && revealed === 1 && (
        <div className="mb-3"><InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/55">{block.intro}</InlineMarkdown></div>
      )}

      {/* Progress track */}
      <div className="flex gap-1.5 mb-4">
        {steps.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < revealed ? ACCENT_STRONG : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>

      {/* Stage — click to advance */}
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKey}
        onClick={() => { if (!done) next(); }}
        className="outline-none flex flex-col gap-1 select-none"
        style={{ cursor: done ? 'default' : 'pointer' }}
        role="group"
        aria-label={`${block.title} — step ${Math.min(revealed, steps.length)} of ${steps.length}`}
      >
        {steps.slice(0, revealed).map((s, i) => (
          <StepView key={s.id} step={s} active={i === revealed - 1} />
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center gap-3">
        {!done ? (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 ${revealed === 1 ? 'motion-safe:animate-pulse' : ''}`}
              style={{ background: ACCENT_BG, color: ACCENT, border: `1.5px solid ${ACCENT_STRONG}` }}
            >
              {revealed === 1 ? 'Start →' : 'Next →'}
            </button>
            {revealed > 1 && (
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="text-xs text-white/40 hover:text-white/60 underline underline-offset-2">
                ← Back
              </button>
            )}
            <span className="ml-auto text-[11px] text-white/25 hidden sm:block">Tap anywhere, or use ← → keys</span>
          </>
        ) : (
          <div className="w-full">
            {block.outro && (
              <div className="rounded-xl px-4 py-3 mb-3" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}` }}>
                <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/80">{block.outro}</InlineMarkdown>
              </div>
            )}
            <button onClick={() => setRevealed(1)} className="text-xs font-semibold px-4 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              ↺ Walk through it again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
