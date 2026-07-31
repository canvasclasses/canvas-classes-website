'use client';

/*
 * motion-lab/circular/parts.tsx — the small pieces the Arena's faces share.
 * ─────────────────────────────────────────────────────────────────────────────
 * COLOUR (SIMULATION_DESIGN_WORKFLOW §3, two-colour rule):
 *   MOTION  = the primary accent, violet. Velocity, tangent, trail, the body.
 *   FORCE   = the one secondary accent, amber. Centripetal / agent force /
 *             acceleration — a genuine second axis (kinematics vs dynamics),
 *             and the axis this whole sim is about.
 * Everything else is white/gray from TEXT. OK/BAD appear only as right-vs-wrong
 * feedback on a prediction, marked `// sim-lint-ok` at the usage site.
 *
 * LABELS (§4E): nothing here writes a name next to an arrow. Arrows are colour-
 * keyed and named ONCE in <Legend>, below the canvas. The canvas is allowed a
 * single status text element and the Arena spends it on the state word.
 */

import * as React from 'react';
import {
  ACCENTS, TEXT, BORDER, TYPE, OK, BAD, accentTint, fmt,
} from '../../simulations/_shared';
import InlineMarkdown from '../../InlineMarkdown';

// ── Palette ──────────────────────────────────────────────────────────────────
export const MOTION = ACCENTS.violet;   // primary accent
export const FORCE = ACCENTS.amber;     // the one secondary accent
/*
 * The de-emphasised ink — the weight arrow, guide rays, and the "what most
 * students predict" dashed path.
 *
 * ALPHA RAISED 0.35 → 0.60 (2026-07-30, browser contrast audit). This value is
 * not only a stroke: `Legend` renders each row's numeric value in its row
 * colour, because the canvas carries one text element and the legend is where
 * every number actually lives. At 0.35 it composited to rgb(88,92,99) — a
 * 2.82:1 ratio on the card, i.e. a force in newtons that a student has to
 * squint at. 0.60 clears 4.5:1 on every surface a sim paints, including the
 * accent-tinted active card, while still reading as clearly secondary to the
 * full-strength MOTION and FORCE inks.
 *
 * Do not re-dim this at the usage site with an `opacity` — that reintroduces
 * exactly the bug this comment documents.
 */
export const GHOST = 'rgba(226,232,240,0.60)';

// ── Canvas geometry ──────────────────────────────────────────────────────────
// A FIXED viewBox. The SVG is never height:100% inside the flex row — a sidebar
// growing by one line would otherwise resize the canvas and make the circle
// visibly breathe while a student drags (the bug the vector boards shipped with).
export const VIEW = { w: 600, h: 470 };

export interface Screen { x: number; y: number }

/** Physics coords (y UP, metres) → SVG coords (y down, px). */
export const project = (
  p: { x: number; y: number },
  cx: number,
  cy: number,
  scale: number
): Screen => ({ x: cx + p.x * scale, y: cy - p.y * scale });

// ── Arrow ────────────────────────────────────────────────────────────────────

export function Arrow({
  from, to, color, width = 3, dashed = false, opacity = 1, head = 11,
}: {
  from: Screen; to: Screen; color: string; width?: number;
  dashed?: boolean; opacity?: number; head?: number;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 2) return null;
  const ux = dx / len;
  const uy = dy / len;
  const h = Math.min(head, len * 0.45);
  const bx = to.x - ux * h;
  const by = to.y - uy * h;
  const px = -uy * h * 0.46;
  const py = ux * h * 0.46;
  return (
    <g opacity={opacity} style={{ pointerEvents: 'none' }}>
      <line
        x1={from.x} y1={from.y} x2={bx} y2={by}
        stroke={color} strokeWidth={width} strokeLinecap="round"
        strokeDasharray={dashed ? '7 5' : undefined}
      />
      <polygon points={`${to.x},${to.y} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
    </g>
  );
}

// ── Chrome atoms ─────────────────────────────────────────────────────────────

export function Card({
  children, tone = 'plain', className = '',
}: { children: React.ReactNode; tone?: 'plain' | 'warn' | 'good'; className?: string }) {
  const style =
    tone === 'warn'
      ? { background: accentTint(FORCE, 0.09), borderColor: accentTint(FORCE, 0.35) }
      : tone === 'good'
        ? { background: accentTint(OK, 0.08), borderColor: accentTint(OK, 0.3) } // sim-lint-ok
        : { background: 'rgba(255,255,255,0.02)', borderColor: BORDER.card };
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Pill({ tone, children }: { tone: 'ok' | 'no' | 'info' | 'warn'; children: React.ReactNode }) {
  const map = {
    ok: { fg: OK, bd: accentTint(OK, 0.42), bg: accentTint(OK, 0.12) },     // sim-lint-ok
    no: { fg: BAD, bd: accentTint(BAD, 0.42), bg: accentTint(BAD, 0.12) },  // sim-lint-ok
    info: { fg: MOTION, bd: accentTint(MOTION, 0.36), bg: accentTint(MOTION, 0.12) },
    warn: { fg: FORCE, bd: accentTint(FORCE, 0.4), bg: accentTint(FORCE, 0.13) },
  }[tone];
  return (
    <span
      className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{ color: map.fg, border: `1px solid ${map.bd}`, background: map.bg }}
    >
      {children}
    </span>
  );
}

export function ActionButton({
  onClick, children, disabled, tone = 'primary', full = true,
}: {
  onClick: () => void; children: React.ReactNode; disabled?: boolean;
  tone?: 'primary' | 'ghost'; full?: boolean;
}) {
  const on = !disabled;
  const bg = tone === 'primary' && on ? accentTint(MOTION, 0.2) : 'rgba(255,255,255,0.04)';
  const bd = tone === 'primary' && on ? accentTint(MOTION, 0.45) : BORDER.card;
  const fg = !on ? TEXT.muted : tone === 'primary' ? MOTION : TEXT.secondary;
  return (
    <button
      onClick={() => on && onClick()}
      disabled={disabled}
      className={`rounded-lg px-3 py-2 text-[12px] font-semibold uppercase tracking-wider transition-all ${full ? 'w-full' : ''}`}
      style={{ background: bg, border: `1px solid ${bd}`, color: fg, cursor: on ? 'pointer' : 'not-allowed' }}
    >
      {children}
    </button>
  );
}

// ── Legend — where every arrow gets its name (§4E) ───────────────────────────

export interface LegendItem {
  color: string;
  name: string;
  value?: string;
  dashed?: boolean;
  note?: string;
}

export function Legend({ items }: { items: LegendItem[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
      {items.map((it) => (
        <div key={it.name} className="flex items-baseline gap-2">
          <span
            className="inline-block shrink-0 rounded-full"
            style={{
              width: 18, height: 3, background: it.dashed
                ? `repeating-linear-gradient(90deg, ${it.color} 0 4px, transparent 4px 7px)`
                : it.color,
              transform: 'translateY(-3px)',
            }}
          />
          <span className="text-xs" style={{ color: TEXT.secondary }}>{it.name}</span>
          {it.value !== undefined && (
            <span className="text-xs font-semibold tabular-nums" style={{ color: it.color }}>{it.value}</span>
          )}
          {it.note && <span className="text-[11px]" style={{ color: TEXT.muted }}>{it.note}</span>}
        </div>
      ))}
    </div>
  );
}

// ── Readout rows ─────────────────────────────────────────────────────────────

export interface Row { label: string; value: string; color?: string; strong?: boolean }

export function Readouts({ rows }: { rows: Row[] }) {
  return (
    <Card>
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-3 py-[3px]">
          <span className={TYPE.sectionLabel} style={{ color: TEXT.muted }}>{r.label}</span>
          <span
            className="tabular-nums"
            style={{
              color: r.color ?? TEXT.primary,
              fontSize: r.strong ? 16 : 13,
              fontWeight: r.strong ? 800 : 600,
            }}
          >
            {r.value}
          </span>
        </div>
      ))}
    </Card>
  );
}

/** Number + unit, formatted once, everywhere. */
export const num = (v: number, unit: string, digits = 2): string =>
  `${fmt(v, digits)}${unit ? ` ${unit}` : ''}`;

// ── The predict-first gate (design law #5) ───────────────────────────────────

export interface PredictSpec {
  prompt: string;
  options: string[];
  answer_index?: number;
  reveal?: string;
  /**
   * Per-option feedback, parallel to `options`.
   *
   * Design law #2: three genuinely different classic misconceptions must not
   * receive byte-identical feedback. "Straight outward", "curves backwards" and
   * "stops, then falls" are three separate wrong beliefs about what a force
   * does, and a shared paragraph grades them as one. Optional, because an
   * author-supplied `block.predict` may only carry a single reveal.
   */
  per_option?: string[];
}

/**
 * The student must commit to an answer before the interesting button unlocks.
 * A wrong pick is never punished with a lock — it is answered, immediately,
 * with the reveal, and then the sim shows them. The point is the commitment,
 * not the score.
 */
export function PredictGate({
  spec, guess, onGuess,
}: { spec: PredictSpec; guess: number | null; onGuess: (i: number) => void }) {
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2">
        <Pill tone={guess === null ? 'info' : spec.answer_index === undefined ? 'info' : guess === spec.answer_index ? 'ok' : 'no'}>
          {guess === null ? 'Predict first' : spec.answer_index === undefined ? 'Locked in' : guess === spec.answer_index ? 'You had it' : 'Have a look'}
        </Pill>
      </div>
      <p className="text-sm leading-snug" style={{ color: TEXT.primary }}>
        <InlineMarkdown>{spec.prompt}</InlineMarkdown>
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        {spec.options.map((o, i) => {
          const picked = guess === i;
          const right = spec.answer_index === i;
          const revealed = guess !== null && spec.answer_index !== undefined;
          const fg = revealed && right ? OK : revealed && picked ? BAD : TEXT.secondary; // sim-lint-ok
          const bd = revealed && right
            ? accentTint(OK, 0.45)          // sim-lint-ok
            : revealed && picked
              ? accentTint(BAD, 0.45)       // sim-lint-ok
              : picked ? accentTint(MOTION, 0.45) : BORDER.card;
          return (
            <button
              key={o}
              onClick={() => guess === null && onGuess(i)}
              disabled={guess !== null}
              className="rounded-lg border px-2.5 py-1.5 text-left text-[13px] leading-snug transition-all"
              style={{
                background: picked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                borderColor: bd, color: fg, cursor: guess === null ? 'pointer' : 'default',
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {/* What THIS answer implies, before the shared explanation. A wrong pick
          is answered by naming the belief it rests on — not by a paragraph
          every wrong pick shares. */}
      {guess !== null && spec.per_option?.[guess] && (
        <p className="mt-2 text-[13px] font-semibold leading-snug" style={{ color: TEXT.primary }}>
          <InlineMarkdown>{spec.per_option[guess]}</InlineMarkdown>
        </p>
      )}
      {guess !== null && spec.reveal && (
        <p className="mt-2 text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
          <InlineMarkdown>{spec.reveal}</InlineMarkdown>
        </p>
      )}
    </Card>
  );
}

// ── Misconception card ───────────────────────────────────────────────────────

/**
 * Fired only once the sim has SHOWN the thing that contradicts the belief —
 * never as a preamble. Naming the wrong idea out loud is the whole point:
 * design law #2 says feedback must attack a specific misconception rather than
 * report right or wrong. Same shape and same rule as the Projectile
 * Playground's card, so the two read as one system.
 */
export function MisconceptionCard({ heading, body }: { heading: string; body: string }) {
  return (
    <Card tone="warn">
      <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: FORCE }}>
        Watch out
      </div>
      <p className="mt-1 text-sm font-semibold leading-snug" style={{ color: TEXT.primary }}>
        <InlineMarkdown>{heading}</InlineMarkdown>
      </p>
      <div className="mt-1 text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
        <InlineMarkdown>{body}</InlineMarkdown>
      </div>
    </Card>
  );
}

// ── The guided script panel (design law #5) ──────────────────────────────────

export function GuidedPanel({
  steps, step, onAdvance, doneMessage,
}: {
  steps: { say: string; cta: string }[];
  step: number;
  onAdvance: () => void;
  doneMessage: string;
}) {
  const done = step >= steps.length;
  return (
    <div
      className="rounded-xl border px-3 py-3"
      style={{
        background: done ? accentTint(OK, 0.06) : accentTint(MOTION, 0.07),   // sim-lint-ok
        borderColor: done ? accentTint(OK, 0.28) : accentTint(MOTION, 0.28),  // sim-lint-ok
      }}
    >
      <div className="mb-2 flex items-center gap-1.5">
        {steps.map((s, i) => (
          <span
            key={s.cta}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: i < step ? OK : i === step ? MOTION : 'rgba(255,255,255,0.09)' }} // sim-lint-ok
          />
        ))}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: TEXT.primary }}>
        <InlineMarkdown>{done ? doneMessage : steps[step].say}</InlineMarkdown>
      </p>
      {!done && (
        <div className="mt-3">
          <ActionButton onClick={onAdvance}>{steps[step].cta} →</ActionButton>
        </div>
      )}
    </div>
  );
}

// ── The frame toggle — the most prominent control in the whole sim ───────────

/**
 * Deliberately a large segmented control ABOVE the canvas, not a checkbox in a
 * settings row. Choosing a frame is the physics here, so it gets the physics's
 * share of the screen. Ground frame draws no outward force at all; rotating
 * frame raises the banner and only then is centrifugal drawn.
 */
export function FrameToggle({
  rotating, onChange,
}: { rotating: boolean; onChange: (rotating: boolean) => void }) {
  const opts = [
    { on: false, label: 'Ground frame', sub: 'inertial — Newton as written' },
    { on: true, label: 'Rotating frame', sub: 'you turn with the ball' },
  ];
  return (
    <div className="flex gap-2">
      {opts.map((o) => {
        const active = o.on === rotating;
        const accent = o.on ? FORCE : MOTION;
        return (
          <button
            key={o.label}
            onClick={() => onChange(o.on)}
            className="flex-1 rounded-xl border px-3 py-2.5 text-left transition-all"
            style={{
              background: active ? accentTint(accent, 0.14) : 'rgba(255,255,255,0.02)',
              borderColor: active ? accentTint(accent, 0.45) : BORDER.card,
              cursor: 'pointer',
            }}
          >
            <div className="text-sm font-bold" style={{ color: active ? accent : TEXT.secondary }}>
              {o.label}
            </div>
            <div className="text-[11px]" style={{ color: TEXT.muted }}>{o.sub}</div>
          </button>
        );
      })}
    </div>
  );
}

/** The banner that must appear the instant a non-inertial frame is chosen. */
export function NonInertialBanner({ omega }: { omega: number }) {
  return (
    <div
      className="rounded-xl border px-3 py-2"
      style={{ background: accentTint(FORCE, 0.11), borderColor: accentTint(FORCE, 0.4) }}
    >
      <div className="text-[13px] font-bold leading-snug" style={{ color: FORCE }}>
        ⚠ You are now in a non-inertial frame
      </div>
      <div className="text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
        This frame spins at {fmt(Math.abs(omega), 2)} rad/s, so it accelerates. Newton&apos;s laws do not
        hold here as written — to keep using them you must add a fictitious outward force. That
        force is centrifugal force, and it is drawn below. Step back to the ground frame and it
        vanishes, because it was never a real push from any object.
      </div>
    </div>
  );
}

// ── Slider row (thin wrapper: label + live value + range) ────────────────────

export function Slider({
  label, value, min, max, step, onChange, unit, accent = MOTION, format,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; unit?: string; accent?: string;
  format?: (v: number) => string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div style={{ minWidth: 96, fontSize: 12, fontWeight: 600, color: accent }}>{label}</div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="flex-1"
        // minHeight 44: a bare range input renders ~16px tall, well under a
        // finger. The track stays thin; the grabbable ELEMENT does not.
        style={{ accentColor: accent, cursor: 'pointer', touchAction: 'none', minHeight: 44 }}
      />
      <div
        className="tabular-nums"
        style={{ minWidth: 78, textAlign: 'right', fontSize: 13, fontWeight: 700, color: accent }}
      >
        {format ? format(value) : fmt(value, 2)}
        {unit && <span style={{ color: TEXT.ghost, fontWeight: 500 }}> {unit}</span>}
      </div>
    </div>
  );
}
