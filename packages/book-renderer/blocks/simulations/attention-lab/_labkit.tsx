'use client';

import { useEffect, useRef } from 'react';

/**
 * Attention Lab — shared foundation for the Focus & Attention interactive
 * instruments (The Crossover, Stroop, Flanker, Fist-Edge-Palm, …). Exists so the
 * whole set reads as ONE bespoke system, not a pile of generic widgets.
 *
 * Design language (locked here, reused by every lab sim):
 *   - Glass panel over a dark ground with two soft ambient glow blooms
 *     (steel-blue lead + faint warm undertone) — real depth, visible on #12151b.
 *   - Chrome on the strand's calm --book-accent token (LIFE_SKILLS_WORKFLOW §5.3.5);
 *     semantic coral (the sobering) / emerald (the win) / gold (the spark) only.
 *   - Motion is precise and purposeful, never confetti/juice; respects
 *     prefers-reduced-motion.
 */

export const LAB = {
  accent: 'var(--book-accent, #9fb2d4)',
  accentStrong: 'var(--book-accent-strong, #8fa6c9)',
  accentBg: 'var(--book-accent-bg, rgba(159,178,212,0.12))',
  accentBorder: 'var(--book-accent-border, rgba(159,178,212,0.4))',
  coral: '#d98a85',
  coralLight: '#eab5b0',
  green: '#7bb89a',
  greenLight: '#a9d6bf',
  gold: '#c9a86a',
  ink: 'rgba(255,255,255,0.9)',
  inkMid: 'rgba(255,255,255,0.72)',
  inkMute: 'rgba(255,255,255,0.45)',
  mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  serif: 'Georgia, "Times New Roman", serif',
};

/** requestAnimationFrame loop that runs only while `active`; hands back (dt, elapsed) in ms. */
export function useRaf(cb: (dt: number, elapsed: number) => void, active: boolean) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    let start = 0;
    const loop = (ts: number) => {
      if (!start) {
        start = ts;
        last = ts;
      }
      const dt = ts - last;
      last = ts;
      cbRef.current(dt, ts - start);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/** The shared glass-panel frame with ambient glow. Every lab sim renders inside one. */
export function LabFrame({
  eyebrow,
  tone = 'accent',
  children,
}: {
  eyebrow?: string;
  tone?: 'accent' | 'coral' | 'green';
  children: React.ReactNode;
}) {
  const eb = tone === 'coral' ? LAB.coral : tone === 'green' ? LAB.green : LAB.accent;
  return (
    <div className="lab-frame rounded-2xl">
      <div className="lab-glow-a" />
      <div className="lab-glow-b" />
      <div className="lab-content">
        {eyebrow && (
          <div className="lab-eyebrow" style={{ color: eb }}>
            {eyebrow}
          </div>
        )}
        {children}
      </div>
      <style jsx>{`
        .lab-frame {
          position: relative;
          overflow: hidden;
          padding: 28px 24px 30px;
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.012) 60%), #12151b;
          border: 1px solid ${LAB.accentBorder};
          box-shadow: 0 24px 60px -28px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .lab-glow-a {
          position: absolute;
          top: -130px;
          right: -110px;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(159, 178, 212, 0.3), rgba(159, 178, 212, 0) 70%);
          pointer-events: none;
        }
        .lab-glow-b {
          position: absolute;
          bottom: -150px;
          left: -90px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201, 168, 106, 0.13), rgba(201, 168, 106, 0) 70%);
          pointer-events: none;
        }
        .lab-content {
          position: relative;
          z-index: 1;
        }
        .lab-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}

/** A primary lab button — gradient fill, soft lift on hover, accent by default. */
export function LabButton({
  children,
  onClick,
  tone = 'accent',
  disabled,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: 'accent' | 'green';
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const base = tone === 'green' ? LAB.green : LAB.accent;
  const bg =
    tone === 'green'
      ? 'linear-gradient(135deg, rgba(123,184,154,0.18), rgba(123,184,154,0.06))'
      : `linear-gradient(135deg, ${LAB.accentBg}, rgba(159,178,212,0.06))`;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="lab-btn"
      style={{
        fontSize: 14.5,
        fontWeight: 600,
        padding: '12px 22px',
        borderRadius: 12,
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : `${base}66`}`,
        background: disabled ? 'rgba(255,255,255,0.03)' : bg,
        color: disabled ? 'rgba(255,255,255,0.25)' : tone === 'green' ? LAB.greenLight : LAB.accentStrong,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : `0 10px 24px -14px ${base}80`,
        transition: 'transform .15s ease, box-shadow .2s ease, background .2s ease',
        ...style,
      }}
    >
      {children}
      <style jsx>{`
        .lab-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .lab-btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </button>
  );
}
