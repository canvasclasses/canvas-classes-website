'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FocusGameBlock } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';
import { readPractice, writePractice } from './practiceStorage';

/**
 * "The Steady Flame" — a self-caught mind-wandering (Trataka) focus meter.
 *
 * Design intent (founder redesign 2026-07-04, replacing the earlier gradCPT
 * tapping version whose abstract 0-100 score didn't make a student *feel* the
 * problem):
 *  - One candle flame, breathing. The student's only job: keep their attention
 *    on it. The instant they catch their mind wandering, they tap.
 *  - A timer counts UP beside the flame showing the CURRENT unbroken hold. Each
 *    tap logs a "slip", resets that timer to zero (the visceral moment — you
 *    watch your own focus fall back to 0), and the flame flickers.
 *  - The reveal does the pedagogy: the student's LONGEST unbroken hold is almost
 *    always shockingly short (20-40s), and we extrapolate it to a 45-min class.
 *    The small number is the wake-up call the rest of the chapter answers.
 *  - This is a validated paradigm (self-caught mind-wandering), not a game. No
 *    points, no combos, no juice. Honest copy: it MEASURES focus and is one rep
 *    of the notice-and-return skill; it is not a standalone "focus trainer".
 *  - Vedic bridge: steady flame-gazing IS Trataka (त्राटक) — an ancient
 *    concentration practice, here turned into a measurable self-test.
 */

// Shared calm Live Books accent (globals.css --book-accent). The candle FLAME
// keeps its own warm literals below — only the UI chrome uses the accent.
const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_BG = 'var(--book-accent-bg, rgba(159,178,212,0.12))';
const ACCENT_BORDER = 'var(--book-accent-border, rgba(159,178,212,0.4))';
const EMERALD = '#10b981';
const LECTURE_SEC = 45 * 60; // a 45-minute class, for the urgency extrapolation

type RunSummary = {
  longest: number;    // longest unbroken hold, seconds
  avgStreak: number;  // mean hold length, seconds
  drifts: number;     // number of slips (taps)
  streaks: number[];  // every hold length, seconds (last one is the final segment)
  at: string;
};
type Store = { baseline: RunSummary | null; last: RunSummary | null };

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

function summarise(streaks: number[]): RunSummary {
  const longest = streaks.length ? Math.max(...streaks) : 0;
  return {
    longest,
    avgStreak: mean(streaks),
    drifts: Math.max(0, streaks.length - 1),
    streaks,
    at: new Date().toISOString(),
  };
}

// ── Realistic candle flame — soft-gradient, self-glowing; everything but the
//    flame fades into the dark. Breathes gently; dips sharply on a slip. ────────
function Diya({ flicker }: { flicker: boolean }) {
  return (
    <svg viewBox="0 0 200 300" width="104" height="156" aria-hidden="true">
      <defs>
        {/* ambient light the flame throws — soft, radial, fading to black */}
        <radialGradient id="sfg-glow" cx="50%" cy="52%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
          <stop offset="42%" stopColor="#b45309" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        {/* flame body — hot yellow up top, deepening to amber at the base */}
        <linearGradient id="sfg-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="30%" stopColor="#fbbf24" />
          <stop offset="64%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        {/* bright inner core — white hot centre bleeding to yellow */}
        <radialGradient id="sfg-core" cx="50%" cy="64%" r="46%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="42%" stopColor="#fff7e6" />
          <stop offset="78%" stopColor="#fde68a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="sfg-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="sfg-softer" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* soft ambient glow (no hard rings) */}
      <ellipse cx="100" cy="150" rx="66" ry="96" fill="url(#sfg-glow)" filter="url(#sfg-softer)" />

      {/* the flame — breathes gently, or dips hard on a slip */}
      <g className={flicker ? 'sf-drift' : 'sf-breathe'} style={{ transformOrigin: '100px 208px' }}>
        {/* outer body, soft edges */}
        <path d="M100 40 C144 110 132 176 100 206 C68 176 56 110 100 40 Z"
          fill="url(#sfg-body)" filter="url(#sfg-soft)" opacity="0.96" />
        {/* bright inner core */}
        <path d="M100 96 C124 138 117 180 100 202 C83 180 76 138 100 96 Z"
          fill="url(#sfg-core)" />
        {/* white-hot spot just above the wick */}
        <ellipse cx="100" cy="182" rx="9" ry="19" fill="#fff7e6" opacity="0.92" filter="url(#sfg-soft)" />
        {/* faint blue at the very base — real combustion */}
        <ellipse cx="100" cy="201" rx="7" ry="11" fill="#60a5fa" opacity="0.22" filter="url(#sfg-soft)" />
      </g>

      {/* wick — barely there, fading into the dark */}
      <rect x="97" y="200" width="6" height="15" rx="3" fill="#2a1e12" opacity="0.65" filter="url(#sfg-soft)" />
    </svg>
  );
}

export default function FocusGameRenderer({ block }: { block: FocusGameBlock }) {
  const totalSec = block.duration_sec ?? 120;
  const durationMs = totalSec * 1000;
  const storeKey = `focus:${block.test_id}`;

  const [mode, setMode] = useState<'intro' | 'playing' | 'done'>('intro');
  const [holdMs, setHoldMs] = useState(0);       // current unbroken hold
  const [drifts, setDrifts] = useState(0);       // slips so far (live)
  const [longestSoFar, setLongestSoFar] = useState(0);
  const [secsLeft, setSecsLeft] = useState(totalSec);
  const [flicker, setFlicker] = useState(false);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [baseline, setBaseline] = useState<RunSummary | null>(null);

  const streaksRef = useRef<number[]>([]);
  const lastResetRef = useRef(0);
  const longestRef = useRef(0);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flickerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setBaseline(readPractice<Store>(storeKey)?.baseline ?? null);
  }, [storeKey]);

  const clearAll = useCallback(() => {
    [tickTimer, secondTimer].forEach((t) => t.current && clearInterval(t.current));
    [endTimer, flickerTimer].forEach((t) => t.current && clearTimeout(t.current));
  }, []);
  useEffect(() => clearAll, [clearAll]);

  const finish = useCallback(() => {
    clearAll();
    // close out the final in-progress hold
    const finalStreak = (performance.now() - lastResetRef.current) / 1000;
    streaksRef.current.push(finalStreak);
    const s = summarise(streaksRef.current);
    setSummary(s);
    const prev = readPractice<Store>(storeKey) ?? { baseline: null, last: null };
    const next: Store =
      block.role === 'baseline' ? { baseline: s, last: s } : { baseline: prev.baseline, last: s };
    writePractice<Store>(storeKey, next);
    if (block.role === 'retest') setBaseline(prev.baseline);
    setMode('done');
  }, [block.role, clearAll, storeKey]);

  const start = useCallback(() => {
    streaksRef.current = [];
    lastResetRef.current = performance.now();
    longestRef.current = 0;
    setHoldMs(0);
    setDrifts(0);
    setLongestSoFar(0);
    setSecsLeft(totalSec);
    setMode('playing');
    tickTimer.current = setInterval(() => {
      const held = performance.now() - lastResetRef.current;
      setHoldMs(held);
      if (held / 1000 > longestRef.current) {
        longestRef.current = held / 1000;
        setLongestSoFar(held / 1000);
      }
    }, 100);
    secondTimer.current = setInterval(() => setSecsLeft((s) => Math.max(0, s - 1)), 1000);
    endTimer.current = setTimeout(finish, durationMs);
  }, [durationMs, finish, totalSec]);

  // A tap = "I caught my mind wandering." Log the hold, reset to zero, flicker.
  const slip = useCallback(() => {
    if (mode !== 'playing') return;
    const streak = (performance.now() - lastResetRef.current) / 1000;
    streaksRef.current.push(streak);
    lastResetRef.current = performance.now();
    setDrifts((d) => d + 1);
    setHoldMs(0);
    setFlicker(true);
    if (flickerTimer.current) clearTimeout(flickerTimer.current);
    flickerTimer.current = setTimeout(() => setFlicker(false), 500);
  }, [mode]);

  // Spacebar slips too (desktop).
  useEffect(() => {
    if (mode !== 'playing') return;
    const onKey = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); slip(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, slip]);

  const delta =
    summary && baseline ? Math.round(summary.longest) - Math.round(baseline.longest) : null;
  const resets =
    summary && summary.avgStreak > 0 ? Math.round(LECTURE_SEC / summary.avgStreak) : null;

  return (
    <div
      className="my-8 rounded-2xl px-5 py-5 sm:px-6"
      style={{ background: 'var(--book-surface, #181A21)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <style>{`
        @keyframes sf-breathe{0%,100%{transform:scaleY(1) scaleX(1) skewX(0deg)}20%{transform:scaleY(1.06) scaleX(0.96) skewX(1.4deg)}45%{transform:scaleY(0.97) scaleX(1.03) skewX(-1deg)}70%{transform:scaleY(1.04) scaleX(0.98) skewX(0.8deg)}}
        @keyframes sf-drift{0%{transform:scaleY(1);opacity:1}30%{transform:scaleY(0.45) scaleX(1.15) skewX(4deg);opacity:0.4}100%{transform:scaleY(1);opacity:1}}
        .sf-breathe{animation:sf-breathe 3.6s ease-in-out infinite}
        .sf-drift{animation:sf-drift 0.5s ease-out}
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: ACCENT_BG, color: ACCENT }}>
          Focus Meter
        </span>
        <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">
          {block.role === 'retest' ? 'Round 2' : block.role === 'baseline' ? 'Baseline' : 'Focus Check'} · {totalSec}s
        </span>
      </div>
      <h3 className="text-lg font-bold text-white/90 mb-1">{block.title}</h3>

      {/* Intro */}
      {mode === 'intro' && (
        <div>
          {block.intro && (
            <div className="mb-3">
              <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/55">{block.intro}</InlineMarkdown>
            </div>
          )}
          <ul className="mb-4 flex flex-col gap-1.5 text-sm text-white/70">
            <li className="flex gap-2"><span style={{ color: ACCENT_STRONG }}>•</span> One flame. Your only job: <b>keep your attention on it.</b></li>
            <li className="flex gap-2"><span style={{ color: ACCENT_STRONG }}>•</span> <span>The moment you catch your mind wandering — a thought, an itch to look away — <b>tap.</b> (Spacebar works too.)</span></li>
            <li className="flex gap-2"><span style={{ color: ACCENT_STRONG }}>•</span> <span>The timer shows how long you held. Each tap <b>resets it to zero</b> — that&rsquo;s one slip.</span></li>
            <li className="flex gap-2"><span style={{ color: ACCENT_STRONG }}>•</span> Be honest. The tap is just between you and you.</li>
          </ul>
          <button onClick={start}
            className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
            style={{ background: ACCENT_BG, color: ACCENT, border: `1.5px solid ${ACCENT_STRONG}` }}>
            {block.role === 'retest' ? 'Watch the flame again' : 'Light the flame'}
          </button>
          {baseline && block.role === 'retest' && (
            <span className="ml-3 text-xs text-white/30">Your page-1 longest hold was {Math.round(baseline.longest)}s.</span>
          )}
        </div>
      )}

      {/* Playing */}
      {mode === 'playing' && (
        <div>
          <div
            onPointerDown={slip}
            role="button"
            tabIndex={0}
            aria-label="Tap the moment your mind wanders"
            className="relative flex items-center rounded-xl select-none cursor-pointer touch-none px-3 sm:px-5 max-w-md mx-auto"
            style={{ minHeight: 340, background: 'radial-gradient(circle at 50% 44%, #14100a 0%, #060504 82%)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* left spacer keeps the flame optically centred while the timer sits far right */}
            <div className="w-16 sm:w-24 shrink-0" aria-hidden="true" />

            {/* flame — the only thing that glows */}
            <div className="flex-1 flex justify-center"><Diya flicker={flicker} /></div>

            {/* timer — far right, deliberately dim so it never pulls your eye off the flame */}
            <div className="w-16 sm:w-24 shrink-0 text-right leading-none">
              <div className="text-[9px] uppercase tracking-widest text-white/25 mb-1">Holding for</div>
              <div className="text-3xl sm:text-4xl font-semibold tabular-nums text-white/55">
                {(holdMs / 1000).toFixed(1)}<span className="text-lg text-white/25">s</span>
              </div>
              <div className="mt-3 flex flex-col gap-0.5 text-[10px] text-white/25 tabular-nums">
                <span>Longest {longestSoFar.toFixed(1)}s</span>
                <span>Slips {drifts}</span>
              </div>
            </div>

            <span className="absolute bottom-2.5 left-0 right-0 text-center text-[11px] tracking-widest uppercase text-white/20">
              Tap the moment your mind wanders
            </span>
          </div>

          {/* total-time bar */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/30 uppercase tracking-widest">Stay with the flame</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: ACCENT }}>
              {Math.floor(secsLeft / 60)}:{String(secsLeft % 60).padStart(2, '0')}
            </span>
          </div>
          <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full" style={{ background: ACCENT_STRONG, width: `${(1 - secsLeft / totalSec) * 100}%`, transition: 'width 1s linear' }} />
          </div>
        </div>
      )}

      {/* Done */}
      {mode === 'done' && summary && (
        <div>
          {/* Headline: longest unbroken hold */}
          <div className="flex items-end gap-4 mb-1">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-0.5">Your longest unbroken focus</div>
              <div className="text-5xl font-bold tabular-nums" style={{ color: ACCENT }}>
                {Math.round(summary.longest)}<span className="text-2xl text-white/40">s</span>
              </div>
            </div>
            {delta != null && (
              <div className="pb-1.5">
                <span className="text-sm font-semibold px-2.5 py-1 rounded-lg tabular-nums"
                  style={{ background: delta >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: delta >= 0 ? EMERALD : 'rgba(255,255,255,0.55)' }}>
                  {delta >= 0 ? '▲ +' : '▼ '}{delta}s vs your page-1 hold of {Math.round(baseline!.longest)}s
                </span>
              </div>
            )}
          </div>

          {/* Honest breakdown */}
          <div className="grid grid-cols-3 gap-2 mt-4 mb-4 text-center">
            {[
              { label: 'Longest hold', val: `${Math.round(summary.longest)}s` },
              { label: 'Times you slipped', val: `${summary.drifts}` },
              { label: 'Average hold', val: `${summary.avgStreak.toFixed(1)}s` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-lg font-bold tabular-nums text-white/85">{s.val}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/30">{s.label}</div>
              </div>
            ))}
          </div>

          {/* The urgency line — extrapolate to a real class */}
          {summary.drifts === 0 ? (
            <p className="text-sm leading-relaxed mb-3" style={{ color: EMERALD }}>
              You held the whole time without a single slip. Either your focus is genuinely strong today — or your mind wandered and you didn&rsquo;t catch it. Be honest with yourself and try once more.
            </p>
          ) : resets != null && (
            <div className="rounded-xl px-4 py-3 mb-3" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}` }}>
              <p className="text-sm leading-relaxed text-white/80">
                At that pace, in a <b>45-minute class</b> your attention would quietly reset about{' '}
                <b style={{ color: ACCENT }}>{resets} times</b>. That&rsquo;s the real problem — and it&rsquo;s exactly what the rest of this chapter helps you fix.
              </p>
            </div>
          )}

          {block.completion_note && (
            <div className="mb-3">
              <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/65">{block.completion_note}</InlineMarkdown>
            </div>
          )}
          {block.role === 'baseline' && (
            <p className="text-xs text-white/40 italic mb-3">This is your starting line — not a good or bad number. You&rsquo;ll watch the same flame on the last page and see how much longer you can hold.</p>
          )}
          <button onClick={() => setMode('intro')} className="text-xs font-semibold px-4 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {block.role === 'retest' ? 'Watch once more' : 'Try again'}
          </button>
        </div>
      )}
    </div>
  );
}
