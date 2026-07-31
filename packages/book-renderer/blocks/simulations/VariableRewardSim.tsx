'use client';

import { useState } from 'react';

/**
 * "Pull the Lever" — the student discovers variable-ratio reinforcement by
 * feeling it. Machine A pays a small reward every pull (predictable). Machine B
 * pays nothing most pulls, then occasionally a big hit (variable/random). Almost
 * everyone finds B harder to stop. The reveal names the mechanism: that "maybe
 * this time" is the exact engine behind pull-to-refresh and infinite scroll.
 *
 * Deliberately un-flashy (LIFE_SKILLS_WORKFLOW.md §5.3.1 ethos): no sound, no
 * confetti, no juice — a flashy reward loop would BE the thing the chapter warns
 * against. Calm steel-blue --book-accent.
 *
 * Zero-prop sim registered as `variable-reward-lever` in SimulationBlockRenderer.
 *
 * Note: uses Math.random for the variable schedule. This runs only client-side
 * inside a user-driven click handler (never during render/SSR), so it is safe.
 */

const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const ACCENT_BG = 'var(--book-accent-bg, rgba(159,178,212,0.12))';
const ACCENT_BORDER = 'var(--book-accent-border, rgba(159,178,212,0.4))';
const GOLD = '#c9a86a';

const REVEAL_AFTER = 5; // pulls on B before the mechanism unlocks

export default function VariableRewardSim() {
  const [aPulls, setAPulls] = useState(0);
  const [bPulls, setBPulls] = useState(0);
  const [aFace, setAFace] = useState('—');
  const [bFace, setBFace] = useState('—');
  const [bJackpots, setBJackpots] = useState(0);

  function pullA() {
    setAPulls((n) => n + 1);
    setAFace('🙂 +1');
  }

  function pullB() {
    setBPulls((n) => n + 1);
    // Variable ratio: ~1 in 5 pulls hits.
    const hit = Math.random() < 0.2;
    if (hit) {
      setBJackpots((n) => n + 1);
      setBFace('✨ BIG WIN');
    } else {
      setBFace('· nothing ·');
    }
  }

  const unlocked = bPulls >= REVEAL_AFTER;

  const machineStyle = (accent: string) =>
    ({
      flex: '1 1 0',
      minWidth: 140,
      borderRadius: 16,
      border: `1px solid ${accent}`,
      background: 'rgba(255,255,255,0.025)',
      padding: '18px 16px',
      textAlign: 'center' as const,
    });

  return (
    <div
      className="rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ACCENT_BORDER}`, padding: '24px 22px 26px' }}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: ACCENT }}>
        Pull the lever
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.7)', marginBottom: 18, maxWidth: 540 }}>
        Two machines. Pull each a few times. Then notice — which one is harder to stop pulling?
      </p>

      <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
        {/* Machine A */}
        <div style={machineStyle('rgba(255,255,255,0.1)')}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
            MACHINE A
          </div>
          <div style={{ fontSize: 22, minHeight: 32, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{aFace}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '6px 0 12px', fontVariantNumeric: 'tabular-nums' }}>
            pays every time · {aPulls} pulls
          </div>
          <button
            type="button"
            onClick={pullA}
            className="w-full rounded-xl font-semibold"
            style={{ padding: '9px 0', fontSize: 14, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.75)' }}
          >
            Pull A
          </button>
        </div>

        {/* Machine B */}
        <div style={machineStyle(ACCENT_BORDER)}>
          <div style={{ fontSize: 12, color: ACCENT, marginBottom: 8 }}>MACHINE B</div>
          <div
            style={{
              fontSize: 22,
              minHeight: 32,
              fontWeight: 600,
              color: bFace.includes('WIN') ? GOLD : 'rgba(255,255,255,0.5)',
            }}
          >
            {bFace}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '6px 0 12px', fontVariantNumeric: 'tabular-nums' }}>
            pays… sometimes · {bPulls} pulls
          </div>
          <button
            type="button"
            onClick={pullB}
            className="w-full rounded-xl font-semibold"
            style={{ padding: '9px 0', fontSize: 14, border: `1px solid ${ACCENT_BORDER}`, background: ACCENT_BG, color: ACCENT_STRONG }}
          >
            Pull B
          </button>
        </div>
      </div>

      {unlocked && (
        <div
          className="rounded-xl"
          style={{ marginTop: 18, background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, padding: '16px 18px' }}
        >
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.82)', margin: 0 }}>
            Machine B paid off just <strong style={{ color: GOLD }}>{bJackpots}</strong> time{bJackpots === 1 ? '' : 's'} in{' '}
            {bPulls} pulls — yet it’s the one your hand keeps reaching for. That “maybe <em>this</em> pull” is{' '}
            <strong style={{ color: '#fff' }}>variable reward</strong>: your brain spikes hardest on rewards it can’t predict.
            It’s the exact engine inside pull-to-refresh, reels, and the notification you keep checking. Not a flaw in you —
            a design choice in them.
          </p>
        </div>
      )}
    </div>
  );
}
