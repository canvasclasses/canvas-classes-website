'use client';

/*
 * fbd/SolveStage.tsx — stage 4: choose the axes, then do the algebra.
 * ─────────────────────────────────────────────────────────────────────────────
 * Unlocked only once the free-body diagram is correct, because algebra on a
 * wrong diagram teaches a student to trust arithmetic over physics.
 *
 * THE POINT OF THIS STAGE is not ΣF = ma. Every textbook has ΣF = ma. The point
 * is the choice that comes BEFORE it: which way do the axes go. The student
 * flips between "along the incline" and "horizontal / vertical" and the algebra
 * panel REWRITES ITSELF — same physics, same answer, three lines versus eight.
 * The cost of the wrong choice is shown as a live number, not asserted in prose.
 *
 * Every term shown here is derived from the engine's own ground-truth forces and
 * the solver's own answer. Nothing on this panel is hand-written physics.
 */

import React, { useMemo, useState } from 'react';
import type { Scene, Body, TrueForce, SolveResult } from '../types';
import type { MechanicsNumeric } from '@canvas/data/types/books';
import InlineMarkdown from '../../InlineMarkdown';
import { worldToScreen } from '../lib/svg';
import type { View } from '../lib/svg';
import { solvedForcesFor } from '../lib/dynamics';
import {
  FORCE_STYLE, PRIMARY, SECONDARY, TEXT, accentTint, nPerPx, arrowRefPx,
} from './theme';
import {
  StagePanels, useStageBox, useFittedView, mixedBounds, localBounds, boardSvgStyle, FIT_PAD,
} from './canvas';
import type { Spur } from './canvas';
import { localOutline, bodyRadius, DEG } from './sceneEdit';
import { Arrow } from './SceneView';
import { Card, Pill, ActionButton, Legend } from './ui';
import type { LegendRow } from './ui';
import { fmtN, resolveOnAxes, needsSplitting, fillMagnitudes } from './forces';
import { TYPE, OK, BAD, BORDER } from '../../simulations/_shared';

type AxisMode = 'cartesian' | 'slope';

/** A term in one ΣF line, as LaTeX. `0` terms are dropped — that omission IS the
 *  saving the axis choice buys, so it has to be visible. */
function termFor(f: TrueForce, axisDeg: number, perp: boolean): string | null {
  const rel = ((f.angleDeg - axisDeg - (perp ? 90 : 0)) % 360 + 360) % 360;
  const c = Math.cos(rel * DEG);
  if (Math.abs(c) < 0.005) return null;
  const sym = f.magSymbol || FORCE_STYLE[f.kind].label;
  const sign = c < 0 ? '-' : '+';
  const mag = Math.abs(c);
  if (mag > 0.999) return `${sign} ${sym}`;
  // Keep the trig visible rather than collapsing it to a decimal: the whole
  // lesson is that a tilted axis turns cos θ into 1.
  const deg = Math.round(Math.min(rel, 360 - rel));
  return `${sign} ${sym}\\cos ${deg}^\\circ`;
}

function sumLine(forces: TrueForce[], axisDeg: number, perp: boolean, rhs: string): string {
  const terms = forces.map((f) => termFor(f, axisDeg, perp)).filter(Boolean) as string[];
  if (terms.length === 0) return `$ 0 = ${rhs} $`;
  const body = terms.join(' ').replace(/^\+\s*/, '');
  return `$ ${body} = ${rhs} $`;
}

/** How many written lines this axis choice costs. */
function lineCost(forces: TrueForce[], axisDeg: number): number {
  const splits = forces.filter((f) => needsSplitting(f.angleDeg, axisDeg)).length;
  return 2 + splits * 2;   // two ΣF lines, plus a sin/cos pair per split force
}

export default function SolveStage({
  scene, body, forces, solve, numeric, showComponents, showEquations,
}: {
  scene: Scene;
  body: Body;
  forces: TrueForce[];
  solve: SolveResult | null;
  numeric?: MechanicsNumeric;
  showComponents?: boolean;
  showEquations?: boolean;
}) {
  const [mode, setMode] = useState<AxisMode>('cartesian');
  const [entry, setEntry] = useState('');
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const g = scene.g ?? 9.8;
  // Prefer the engine's own solved forces — it also resolves the SENSE of static
  // friction, which `trueForcesFor` deliberately leaves undetermined. Falling
  // back keeps a degenerate student-composed scene renderable.
  const filled = useMemo(() => {
    try {
      const solved = solvedForcesFor(scene, body.id);
      if (solved.length) return solved;
    } catch { /* fall through to the local fill */ }
    return fillMagnitudes(scene, forces, solve);
  }, [scene, body.id, forces, solve]);

  // The natural slope axis for this body: perpendicular to whatever it rests on.
  const contact = scene.contacts.find((c) => c.bodyA === body.id);
  const slopeDeg = contact ? contact.normalDeg - 90 : 0;
  const axisDeg = mode === 'slope' ? slopeDeg : 0;

  const costCartesian = lineCost(filled, 0);
  const costSlope = lineCost(filled, slopeDeg);
  const tilted = Math.abs(((slopeDeg % 180) + 180) % 180) > 0.5;

  // Same isolation view as the Draw stage: the centre of mass sits at the
  // origin, so everything on this panel is an OFFSET, not a place. The board
  // measures itself and the camera is fitted to it — see fbd/canvas.tsx.
  const box = useStageBox();
  const { w, h } = box;
  const refPx = arrowRefPx(w || 430, h || 360);
  const refN = Math.max(10, ...scene.bodies.map((b) => b.mass * g));
  const perPx = nPerPx(refN, refPx);
  const arrowPx = React.useCallback(
    (f: TrueForce) => (f.magnitude !== undefined
      ? Math.max(refPx * 0.34, Math.min(refPx * 1.58, f.magnitude / perPx))
      : refPx * 0.63),
    [refPx, perPx]
  );

  const rot = body.shape === 'wedge' ? 0 : (body.angleDeg ?? 0) * DEG;
  const rotate = React.useCallback((p: { x: number; y: number }) => ({
    x: p.x * Math.cos(rot) - p.y * Math.sin(rot),
    y: p.x * Math.sin(rot) + p.y * Math.cos(rot),
  }), [rot]);

  // Fit to the body AND every resolved force arrow. The axes are decoration and
  // are deliberately left out — they run to the board's edges, so letting them
  // drive the fit would shrink the diagram they are annotating.
  const forceKey = JSON.stringify(filled.map((f) => [f.id, f.angleDeg, f.magnitude,
    f.applicationPoint?.x, f.applicationPoint?.y]));
  const bounds = useMemo(() => {
    const world = localBounds(localOutline(body).map(rotate), bodyRadius(body));
    const spurs: Spur[] = filled.map((f) => ({
      at: f.applicationPoint ?? { x: 0, y: 0 }, angleDeg: f.angleDeg, px: arrowPx(f),
    }));
    return mixedBounds(world, spurs, w, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceKey, body.id, rotate, w, h, arrowPx]);

  const view: View = useFittedView(bounds, w, h, false, FIT_PAD, 1600);
  const toScreen = (offset: { x: number; y: number }) => worldToScreen(offset, view);
  const outline = localOutline(body).map(rotate).map(toScreen);
  const centre = toScreen({ x: 0, y: 0 });

  // The unknown: this body's signed acceleration along its own DOF axis.
  const answer = solve && !solve.singular ? solve.accelerations[body.id] : undefined;
  const entryVal = parseFloat(entry);
  const tol = numeric?.tolerance ?? 0.05;
  const numericOk = numeric && checked && Number.isFinite(entryVal)
    ? Math.abs(entryVal - numeric.answer) <= tol : false;
  const canSeeAnswer = revealed || numericOk;

  const rows: LegendRow[] = filled.map((f) => {
    const res = resolveOnAxes(f.angleDeg, f.magnitude ?? 0, axisDeg);
    return {
      id: f.id,
      color: FORCE_STYLE[f.kind].color,
      name: FORCE_STYLE[f.kind].label,
      detail: needsSplitting(f.angleDeg, axisDeg) ? 'has to be split' : 'lies on an axis',
      value: f.magnitude !== undefined
        ? `${fmtN(res.along)} ∥ · ${fmtN(res.perp)} ⟂`
        : f.magSymbol,
      dashed: FORCE_STYLE[f.kind].dashed,
    };
  });

  // The axes are conceptually infinite; drawing them to the board's far corner
  // and letting the SVG clip them is more honest than a stub, and keeps them out
  // of the fit.
  const axLen = Math.hypot(w, h);
  const axis = (deg: number) => ({
    x1: centre.x - axLen * Math.cos(deg * DEG), y1: centre.y + axLen * Math.sin(deg * DEG),
    x2: centre.x + axLen * Math.cos(deg * DEG), y2: centre.y - axLen * Math.sin(deg * DEG),
  });

  const footer = (
    <div className="flex flex-wrap items-center gap-2" style={{ minHeight: 34 }}>
      <ActionButton active={mode === 'cartesian'} onClick={() => setMode('cartesian')}>
        Horizontal / vertical
      </ActionButton>
      <ActionButton active={mode === 'slope'} onClick={() => setMode('slope')} disabled={!tilted}
        title={tilted ? undefined : 'Nothing is tilted in this scene — the two choices are the same.'}>
        Along the surface
      </ActionButton>
    </div>
  );

  return (
    <StagePanels box={box} footer={footer} side={
      <>
        {/* The live cost of the choice. */}
        <Card tone="accent">
          <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: PRIMARY }}>What the axes cost you</div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="text-[12px]" style={{ color: mode === 'cartesian' ? TEXT.primary : TEXT.ghost }}>
              Horizontal / vertical
            </span>
            <span className="tabular-nums text-[13px] font-semibold"
              style={{ color: costCartesian <= costSlope ? OK : BAD }}>
              {costCartesian} lines
            </span>
          </div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="text-[12px]" style={{ color: mode === 'slope' ? TEXT.primary : TEXT.ghost }}>
              Along the surface
            </span>
            <span className="tabular-nums text-[13px] font-semibold"
              style={{ color: costSlope <= costCartesian ? OK : BAD }}>
              {tilted ? `${costSlope} lines` : 'same'}
            </span>
          </div>
          {tilted && (
            <p className="mt-1.5 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
              Same physics, same answer. Tilting the axes puts the acceleration entirely on one of them, so
              every force that was awkward becomes either a whole term or a zero.
            </p>
          )}
        </Card>

        {showEquations !== false && (
          <Card>
            <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>
              {mode === 'slope' ? 'Along and across the surface' : 'Horizontally and vertically'}
            </div>
            <div className="text-[13px]" style={{ color: TEXT.primary }}>
              <div className="overflow-x-auto py-[3px]">
                <InlineMarkdown>{sumLine(filled, axisDeg, false, 'm\\,a_\\parallel')}</InlineMarkdown>
              </div>
              <div className="overflow-x-auto py-[3px]">
                <InlineMarkdown>{sumLine(filled, axisDeg, true, mode === 'slope' ? '0' : 'm\\,a_\\perp')}</InlineMarkdown>
              </div>
            </div>
            {mode === 'slope' && (
              <p className="mt-1.5 text-[11px] leading-snug" style={{ color: TEXT.ghost }}>
                The second line is zero because the block cannot leave the surface — that is what makes this
                axis choice worth making.
              </p>
            )}
          </Card>
        )}

        <Legend title={`Components on these axes`} rows={rows}
          empty="No forces to resolve." />

        {/* The unknown. Asked before it is shown. */}
        <Card>
          <p className="mb-2 text-[13px] leading-snug" style={{ color: TEXT.primary }}>
            {numeric?.prompt ?? 'What is this body’s acceleration along its own direction of motion?'}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input type="number" inputMode="decimal" value={entry}
              onChange={(e) => { setEntry(e.target.value); setChecked(false); }}
              placeholder="answer"
              className="w-24 rounded-lg px-2.5 py-1.5 text-sm tabular-nums outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER.card}`, color: TEXT.primary }} />
            <span className="text-[11px] font-semibold" style={{ color: TEXT.ghost }}>
              {numeric?.unit ?? 'm s⁻²'}
            </span>
            <ActionButton onClick={() => setChecked(true)} disabled={entry === ''}>Check</ActionButton>
            {checked && <Pill tone={numericOk ? 'ok' : 'bad'}>{numericOk ? 'Correct' : 'Not yet'}</Pill>}
            {!canSeeAnswer && checked && !numericOk && (
              <ActionButton onClick={() => setRevealed(true)}>Show me</ActionButton>
            )}
          </div>

          {canSeeAnswer && (
            <div className="mt-2.5">
              {solve?.singular ? (
                <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  This scene does not pin down a single answer — there are more unknowns than equations. Add a
                  constraint (a string, a surface) and try again.
                </p>
              ) : (
                <>
                  <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>
                    <b className="tabular-nums" style={{ color: OK }}>
                      {answer !== undefined ? `${fmtN(answer)} m s⁻²` : '—'}
                    </b>{' '}
                    along this body&rsquo;s own direction of motion.
                  </p>
                  {numeric?.worked_reveal && (
                    <div className="mt-1.5 text-[12px]" style={{ color: TEXT.secondary }}>
                      <InlineMarkdown>{numeric.worked_reveal}</InlineMarkdown>
                    </div>
                  )}
                  {(solve?.equations ?? []).length > 0 && (
                    <div className="mt-2">
                      <div className={`${TYPE.sectionLabel} mb-1`} style={{ color: TEXT.secondary }}>
                        The lines the solver wrote
                      </div>
                      {solve!.equations.map((eq, i) => (
                        <div key={i} className="overflow-x-auto py-[2px] text-[12px]" style={{ color: TEXT.secondary }}>
                          <InlineMarkdown>{eq.includes('$') ? eq : `$ ${eq} $`}</InlineMarkdown>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {(solve?.warnings ?? []).length > 0 && (
            <p className="mt-2 text-[11px] leading-snug" style={{ color: TEXT.ghost }}>
              {solve!.warnings.join(' · ')}
            </p>
          )}
        </Card>
      </>
    }>
      {box.ready && (
        <svg viewBox={`0 0 ${w} ${h}`} style={boardSvgStyle}>
          {/* The chosen axes. They rotate as one, so the shift is felt as a
              rotation of the WHOLE frame, not two independent lines moving. */}
          <g style={{ transition: 'opacity 300ms ease' }}>
            {[axisDeg, axisDeg + 90].map((d, i) => {
              const a = axis(d);
              return (
                <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
                  stroke={SECONDARY} strokeWidth={1.6} strokeDasharray="7 6" opacity={0.75} />
              );
            })}
          </g>

          {outline.length ? (
            <polygon points={outline.map((p) => `${p.x},${p.y}`).join(' ')}
              fill={accentTint(PRIMARY, 0.2)} stroke={PRIMARY} strokeWidth={2.4} strokeLinejoin="round" />
          ) : (
            <circle cx={centre.x} cy={centre.y} r={(body.radius ?? 0.25) * view.scale}
              fill={accentTint(PRIMARY, 0.2)} stroke={PRIMARY} strokeWidth={2.4} />
          )}

          {filled.map((f) => {
            // `applicationPoint` is already a world-frame offset from the
            // centre of mass (lib/scene `offsetPoint`), so it is NOT rotated
            // again here — only the body's own outline is.
            const anchor = toScreen(f.applicationPoint ?? { x: 0, y: 0 });
            const len = arrowPx(f);
            const to = {
              x: anchor.x + len * Math.cos(f.angleDeg * DEG),
              y: anchor.y - len * Math.sin(f.angleDeg * DEG),
            };
            const split = needsSplitting(f.angleDeg, axisDeg);
            return (
              <g key={f.id}>
                {/* Component construction lines — only for forces that this
                    axis choice actually forces you to split. */}
                {showComponents !== false && split && (() => {
                  const res = resolveOnAxes(f.angleDeg, len, axisDeg);
                  const ux = { x: Math.cos(axisDeg * DEG), y: -Math.sin(axisDeg * DEG) };
                  const uy = { x: Math.cos((axisDeg + 90) * DEG), y: -Math.sin((axisDeg + 90) * DEG) };
                  const alongEnd = { x: anchor.x + ux.x * res.along, y: anchor.y + ux.y * res.along };
                  const perpEnd = { x: anchor.x + uy.x * res.perp, y: anchor.y + uy.y * res.perp };
                  return (
                    <g opacity={0.6}>
                      <line x1={alongEnd.x} y1={alongEnd.y} x2={to.x} y2={to.y}
                        stroke={FORCE_STYLE[f.kind].color} strokeWidth={1.3} strokeDasharray="4 4" />
                      <line x1={perpEnd.x} y1={perpEnd.y} x2={to.x} y2={to.y}
                        stroke={FORCE_STYLE[f.kind].color} strokeWidth={1.3} strokeDasharray="4 4" />
                    </g>
                  );
                })()}
                <Arrow from={anchor} to={to} color={FORCE_STYLE[f.kind].color}
                  dashed={FORCE_STYLE[f.kind].dashed} width={3.4} />
              </g>
            );
          })}
        </svg>
      )}
    </StagePanels>
  );
}
