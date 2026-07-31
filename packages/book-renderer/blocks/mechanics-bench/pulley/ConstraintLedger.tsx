'use client';

/*
 * pulley/ConstraintLedger.tsx — THE panel.
 * ─────────────────────────────────────────────────────────────────────────────
 * Students cannot write constraint equations. Not "find them hard" — cannot,
 * because no textbook can show where they come from: the derivation is a
 * statement about a rope changing shape, and a printed figure has one shape.
 *
 * So this panel does three things, in this order:
 *
 *   1. Renders the DERIVED equation with each term's swatch drawn in exactly
 *      the stroke style its rope segments carry on the canvas. Term ↔ rope,
 *      same ink. A coefficient of 2 draws TWO mini-lines, because two segments
 *      are bound to it — the number and the picture are the same fact.
 *   2. Prints the deriver's own `derivation` sentence underneath, so the
 *      equation arrives as English before it arrives as algebra.
 *   3. Measures, live, what the student's drag did to every segment — which
 *      grew, which shrank, and the total sitting still at the bottom. That last
 *      row is the constraint. Everything above it is bookkeeping.
 *
 * Nothing in this file computes physics. Every coefficient comes from
 * `deriveConstraints`; every length change is measured off the moved scene.
 */

import * as React from 'react';
import type { ConstraintEquation } from '../types';
import { BORDER, TEXT, TYPE, accentTint, fmt } from '../../simulations/_shared';
import type { SegmentDelta, SegStyle, TermGroup } from './ledger';
import { coeffLabel } from './ledger';

/**
 * The τ = Iα story for one sheave that carries rotational inertia.
 *
 * This is NOT a rope constraint and never will be — `deriveConstraints` walks
 * string length and knows nothing about torque, so the row lives on
 * `SolveResult.constraints`, which is where `lib/dynamics` puts it. Until this
 * was rendered, the one rung whose entire purpose is to break "the tension is
 * the same on both sides of a pulley" printed two different numbers and no
 * reason for them — the largest coverage hole in the pulley ladder.
 *
 * Every number here is read off the solve. Nothing is recomputed.
 */
export interface TorqueFact {
  id: string;
  sheaveLabel: string;
  ropeLabel: string;
  /** N, the run arriving at the sheave. */
  t1: number;
  /** N, the run leaving it. */
  t2: number;
  /** m */
  radius: number;
  /** kg m² */
  inertia: number;
  /** The engine's own derivation sentence, including the no-slip assumption. */
  derivation: string;
}

// ── The swatch — the whole colour-matching mechanism in 20 lines ─────────────
// `count` mini-lines drawn with byte-identical stroke attributes to the rope on
// the canvas. Draw two of them and the "2" in 2aₚ has been explained.

export function SegSwatch({ style, count, accent, w = 26 }:
  { style: SegStyle; count: number; accent: string; w?: number }) {
  const n = Math.max(1, Math.min(6, count));
  const gap = 4.5;
  const h = (n - 1) * gap + Math.max(3, style.width);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      {Array.from({ length: n }, (_, i) => (
        <line key={i}
          x1={1} y1={h / 2 + (i - (n - 1) / 2) * gap}
          x2={w - 1} y2={h / 2 + (i - (n - 1) / 2) * gap}
          stroke={accent} strokeWidth={style.width} strokeDasharray={style.dash}
          strokeLinecap="round" opacity={style.opacity} />
      ))}
    </svg>
  );
}

const cm = (m: number) => `${(m * 100).toFixed(1)} cm`;

export interface ConstraintLedgerProps {
  constraints: ConstraintEquation[];
  groups: TermGroup[];
  /** Per-segment measured length change for the current drag. */
  deltas: SegmentDelta[];
  /** string id → summed change. Should be ~0; shown either way. */
  totals: Record<string, number>;
  /** string id → the rope's author-given name, for the total row. */
  stringLabels: Record<string, string>;
  mismatches: string[];
  dragged: boolean;
  accent: string;
  highlight: string | null;
  onHighlight: (key: string | null) => void;
  /** Massive-sheave torque rows, once the system has been solved. */
  torque?: TorqueFact[];
}

export default function ConstraintLedger({
  constraints, groups, deltas, totals, stringLabels, mismatches, dragged,
  accent, highlight, onHighlight, torque = [],
}: ConstraintLedgerProps) {
  const deltaById = React.useMemo(() => {
    const m = new Map<string, SegmentDelta>();
    for (const d of deltas) m.set(d.id, d);
    return m;
  }, [deltas]);

  const groupDelta = (g: TermGroup) =>
    g.segmentIds.reduce((acc, id) => acc + (deltaById.get(id)?.change ?? 0), 0);

  if (constraints.length === 0) {
    return (
      <p className={TYPE.body} style={{ color: TEXT.ghost }}>
        No rope constraint has been derived for this scene yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {constraints.map((c) => {
        const terms = groups.filter((g) => g.constraintId === c.id);
        return (
          <div key={c.id} className="flex flex-col gap-2.5">
            {/* ── The equation, term by term ───────────────────────────── */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
              {terms.map((g, i) => {
                const neg = g.coeff < 0;
                const label = coeffLabel(g.coeff);
                return (
                  <React.Fragment key={g.key}>
                    {i > 0 && (
                      <span style={{ color: TEXT.ghost, fontSize: 17, margin: '0 2px' }}>
                        {neg ? '−' : '+'}
                      </span>
                    )}
                    {i === 0 && neg && (
                      <span style={{ color: TEXT.ghost, fontSize: 17 }}>−</span>
                    )}
                    <button
                      onPointerEnter={() => onHighlight(g.key)}
                      onPointerLeave={() => onHighlight(null)}
                      onFocus={() => onHighlight(g.key)}
                      onBlur={() => onHighlight(null)}
                      onClick={() => onHighlight(highlight === g.key ? null : g.key)}
                      className="flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-all"
                      style={{
                        background: highlight === g.key ? accentTint(accent, 0.14) : 'transparent',
                        border: `1px solid ${highlight === g.key ? accentTint(accent, 0.35) : 'transparent'}`,
                        outline: 'none', cursor: 'pointer',
                      }}
                      aria-label={`${label || 'one'} times ${g.symbol}, from ${g.segCount} rope segment${g.segCount === 1 ? '' : 's'} at ${g.bodyLabel}`}
                    >
                      <SegSwatch style={g.style} count={g.segCount} accent={accent} />
                      <span style={{ color: accent, fontSize: 18, fontWeight: 700 }}>
                        {label}
                        <span style={{ fontStyle: 'italic' }}>{g.symbol}</span>
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
              <span style={{ color: TEXT.ghost, fontSize: 17, margin: '0 4px' }}>=</span>
              <span style={{ color: TEXT.primary, fontSize: 18, fontWeight: 700 }}
                className="tabular-nums">
                {c.rhs === 0 ? '0' : c.rhs}
              </span>
            </div>

            {/* ── Where it came from, in English ────────────────────────── */}
            {c.derivation && (
              <p className={TYPE.body} style={{ color: TEXT.secondary }}>
                {c.derivation}
              </p>
            )}
          </div>
        );
      })}

      {/* ── The live measurement ─────────────────────────────────────────── */}
      <div className="pt-3" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
        <div className={TYPE.sectionLabel} style={{ color: TEXT.secondary }}>
          What the rope is doing
        </div>
        <p className={`${TYPE.body} mt-1`} style={{ color: TEXT.ghost }}>
          {dragged
            ? 'Segments bound to each term, measured off the moved diagram.'
            : 'Drag any block on the diagram. These numbers are measured, not predicted.'}
        </p>

        <div className="mt-2.5 flex flex-col">
          {groups.map((g) => {
            const d = groupDelta(g);
            const grew = d > 1e-5, shrank = d < -1e-5;
            return (
              <button key={`row:${g.key}`}
                onPointerEnter={() => onHighlight(g.key)}
                onPointerLeave={() => onHighlight(null)}
                onClick={() => onHighlight(highlight === g.key ? null : g.key)}
                className="flex items-center gap-2.5 py-1.5 text-left transition-all"
                style={{
                  background: highlight === g.key ? accentTint(accent, 0.1) : 'transparent',
                  borderBottom: `1px solid ${BORDER.hairline}`,
                  outline: 'none', cursor: 'pointer',
                }}>
                <SegSwatch style={g.style} count={g.segCount} accent={accent} w={22} />
                <span className="flex-1 text-sm" style={{ color: TEXT.secondary }}>
                  {g.segmentIds.length === 1 ? 'segment at ' : `${g.segmentIds.length} segments at `}
                  <span style={{ color: TEXT.primary, fontWeight: 600 }}>{g.bodyLabel}</span>
                </span>
                <span className="tabular-nums text-sm" style={{
                  minWidth: 92, textAlign: 'right', fontWeight: 600,
                  color: grew || shrank ? TEXT.primary : TEXT.muted,
                }}>
                  {grew ? '▲ +' : shrank ? '▼ −' : ''}
                  {grew || shrank ? cm(Math.abs(d)) : '—'}
                </span>
              </button>
            );
          })}

          {/* The row that IS the constraint. */}
          {Object.entries(totals).map(([sid, total]) => (
            <div key={`tot:${sid}`} className="flex items-center gap-2.5 pt-2.5">
              <span className="flex-1 text-sm font-semibold" style={{ color: TEXT.primary }}>
                Total length of {stringLabels[sid] ?? 'the rope'}
              </span>
              <span className="tabular-nums text-sm font-semibold" style={{
                minWidth: 92, textAlign: 'right',
                color: Math.abs(total) < 5e-4 ? accent : TEXT.primary,
              }}>
                {Math.abs(total) < 5e-4 ? 'unchanged' : `${total > 0 ? '+' : '−'}${cm(Math.abs(total))}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── The other reason a rope can be doing two different things ────── */}
      {torque.map((t) => {
        const dT = t.t1 - t.t2;
        const tau = dT * t.radius;
        return (
          <div key={t.id} className="pt-3" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <div className={TYPE.sectionLabel} style={{ color: accent }}>
              Why the two tensions differ
            </div>

            {/* The equation, then the three numbers that satisfy it. */}
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2"
              style={{ color: TEXT.primary, fontSize: 17, fontWeight: 700 }}>
              <span>(</span>
              <span style={{ color: accent, fontStyle: 'italic' }}>T₁</span>
              <span style={{ color: TEXT.ghost }}>−</span>
              <span style={{ color: accent, fontStyle: 'italic' }}>T₂</span>
              <span>)</span>
              <span style={{ fontStyle: 'italic' }}>·r</span>
              <span style={{ color: TEXT.ghost }}>=</span>
              <span style={{ fontStyle: 'italic' }}>Iα</span>
            </div>

            <div className="mt-2 flex flex-col">
              <div className="flex items-baseline gap-2.5 py-1"
                style={{ borderBottom: `1px solid ${BORDER.hairline}` }}>
                <span className="flex-1 text-sm" style={{ color: TEXT.secondary }}>
                  The two sides of {t.ropeLabel}, either side of {t.sheaveLabel}
                </span>
                <span className="tabular-nums text-sm font-semibold" style={{ color: accent }}>
                  {fmt(Math.abs(t.t1), 2)} N &nbsp;vs&nbsp; {fmt(Math.abs(t.t2), 2)} N
                </span>
              </div>
              <div className="flex items-baseline gap-2.5 py-1"
                style={{ borderBottom: `1px solid ${BORDER.hairline}` }}>
                <span className="flex-1 text-sm" style={{ color: TEXT.secondary }}>
                  The difference, T₁ − T₂
                </span>
                <span className="tabular-nums text-sm font-semibold" style={{ color: TEXT.primary }}>
                  {fmt(dT, 3)} N
                </span>
              </div>
              <div className="flex items-baseline gap-2.5 py-1"
                style={{ borderBottom: `1px solid ${BORDER.hairline}` }}>
                <span className="flex-1 text-sm" style={{ color: TEXT.secondary }}>
                  …acting at radius {fmt(t.radius, 2)} m, so the net torque on the sheave is
                </span>
                <span className="tabular-nums text-sm font-semibold" style={{ color: accent }}>
                  {fmt(tau, 3)} N m
                </span>
              </div>
              <div className="flex items-baseline gap-2.5 py-1">
                <span className="flex-1 text-sm" style={{ color: TEXT.secondary }}>
                  …which is exactly what it takes to spin up I
                </span>
                <span className="tabular-nums text-sm font-semibold" style={{ color: TEXT.primary }}>
                  {fmt(t.inertia, 4)} kg m²
                </span>
              </div>
            </div>

            <p className={`${TYPE.body} mt-2`} style={{ color: TEXT.secondary }}>
              {t.derivation}
            </p>

            <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.ghost }}>
              Set the pulley mass back to zero and watch this whole section
              disappear — with I = 0 the torque needed is zero, so the two
              tensions collapse back onto one number. That is all &ldquo;tension
              is the same throughout&rdquo; ever meant.
            </p>
          </div>
        );
      })}

      {mismatches.length > 0 && (
        <div className="pt-2" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
          <div className={TYPE.sectionLabel} style={{ color: TEXT.ghost }}>
            Engine note
          </div>
          {mismatches.map((m, i) => (
            <p key={i} className={TYPE.body} style={{ color: TEXT.ghost }}>{m}</p>
          ))}
        </div>
      )}
    </div>
  );
}
