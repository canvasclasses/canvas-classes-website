'use client';

import { useState } from 'react';

/**
 * "The Shrinking Window" — the student drags across the years (2004 → today) and
 * watches measured attention on a single screen collapse from ~2.5 minutes to
 * ~47 seconds. Discovery, not a printed stat. Ends by inviting them to place
 * their own flame-test result beside it.
 *
 * Data: Gloria Mark et al.'s directly-observed attention-span measures — ~150s
 * (2004), ~75s (2012), ~47s (recent, replicated). Mainstream-consensus (clears
 * LIFE_SKILLS_WORKFLOW.md §7). Calm steel-blue --book-accent; a semantic coral
 * appears only once the window is under a minute.
 *
 * Zero-prop sim registered as `shrinking-window` in SimulationBlockRenderer.
 */

const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const CORAL = '#d98a85';

function secondsForYear(y: number): number {
  if (y <= 2004) return 150;
  if (y <= 2012) return 150 + ((75 - 150) * (y - 2004)) / (2012 - 2004);
  if (y <= 2023) return 75 + ((47 - 75) * (y - 2012)) / (2023 - 2012);
  return 47;
}

export default function ShrinkingWindowSim() {
  const [year, setYear] = useState(2004);
  const secs = secondsForYear(year);
  const pct = Math.max(6, (secs / 150) * 100);
  const short = secs <= 55;

  const ctx =
    year <= 2005
      ? '2004: two and a half minutes on one screen before the mind jumped. This is where your parents’ Class 9 lived.'
      : year <= 2013
      ? 'By 2012 it had already halved — to about 75 seconds. The smartphone had arrived.'
      : year < 2024
      ? 'Closing on 47 seconds — and other labs found the same. Less than a single minute of unbroken focus, on average.'
      : '~47 seconds. Now put your own flame-test number beside it. You are not weak — the water you swim in changed.';

  return (
    <div
      className="rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(159,178,212,0.28)', padding: '26px 22px 28px' }}
    >
      <div className="text-center">
        <div
          className="uppercase tracking-[0.15em]"
          style={{ fontSize: 14, color: ACCENT, fontFamily: 'ui-monospace, monospace' }}
        >
          {year >= 2024 ? 'Today' : year}
        </div>
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 600,
            fontSize: 'clamp(44px, 11vw, 72px)',
            lineHeight: 1,
            color: short ? CORAL : 'rgba(255,255,255,0.92)',
            fontVariantNumeric: 'tabular-nums',
            transition: 'color .25s ease',
            marginTop: 4,
          }}
        >
          {Math.round(secs)}
        </div>
        <div
          className="uppercase tracking-[0.1em] mt-1.5"
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', fontFamily: 'ui-monospace, monospace' }}
        >
          seconds of focus on one screen, before switching
        </div>
      </div>

      <div
        className="mx-auto mt-6"
        style={{
          maxWidth: 540,
          height: 42,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${pct}%`,
            background: short
              ? `linear-gradient(90deg, ${CORAL}, #e6b0ab)`
              : `linear-gradient(90deg, ${ACCENT_STRONG}, ${ACCENT})`,
            transition: 'width .2s ease, background .2s ease',
          }}
        />
      </div>
      <input
        type="range"
        min={2004}
        max={2026}
        step={1}
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        aria-label="Drag across the years"
        className="block mx-auto mt-5 w-full"
        style={{ maxWidth: 540, accentColor: '#9fb2d4' }}
      />
      <div
        className="flex justify-between mx-auto mt-2"
        style={{ maxWidth: 540, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace' }}
      >
        <span>2004</span>
        <span>2012</span>
        <span>Today</span>
      </div>

      <p
        className="mx-auto mt-5 text-center"
        style={{ maxWidth: 520, fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', minHeight: 44 }}
      >
        {ctx}
      </p>
    </div>
  );
}
