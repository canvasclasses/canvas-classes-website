'use client';

/*
 * fbd/CutStage.tsx — the system boundary. The killer feature.
 * ─────────────────────────────────────────────────────────────────────────────
 * The student drags a dotted boundary around any subset of the bodies. Then:
 *
 *   • forces that CROSS the boundary survive, and go bold — they are external;
 *   • forces wholly INSIDE cancel in third-law pairs and vanish;
 *   • what is left is one composite body of mass Σm.
 *
 * The cancellation is the whole point, so it is not instant and it is not
 * automatic: each click removes exactly ONE pair, both members fading and
 * shrinking together, with the pair named underneath. Watching N₁₂ and N₂₁ leave
 * the diagram holding hands is the moment a two-body problem stops being a
 * memorised case and becomes a method.
 *
 * Guided, never auto-playing: nothing is cut until the student draws a boundary
 * and presses cut, and no pair disappears until they cancel it.
 */

import React, { useMemo, useRef, useState } from 'react';
import type { Scene, TrueForce, CutResult, SolveResult, Vec2 } from '../types';
import { cutSystem } from '../lib/cut';
import { trueForcesFor } from '../lib/scene';
import { worldToScreen, screenToWorld } from '../lib/svg';
import SceneView, { WorldArrow } from './SceneView';
import {
  FORCE_STYLE, PRIMARY, SECONDARY, TEXT, accentTint, nPerPx, arrowRefPx,
} from './theme';
import {
  StagePanels, useStageBox, useFittedView, sceneWorldBounds, mixedBounds, FIT_PAD,
} from './canvas';
import type { Spur } from './canvas';
import { findBody } from './sceneEdit';
import { Card, Pill, ActionButton, Legend, usePointerDrag } from './ui';
import type { LegendRow } from './ui';
import { fmtN, fillMagnitudes } from './forces';
import { TYPE } from '../../simulations/_shared';

/**
 * The boundary box, stored in WORLD metres rather than screen pixels. It has to
 * be: the camera is fitted, so a resize (or the admin editor's split pane being
 * dragged) would otherwise slide the drawn box off the bodies it encloses while
 * `insideIds` kept reporting the old answer.
 */
interface Rect { x0: number; y0: number; x1: number; y1: number }

const norm = (r: Rect) => ({
  x: Math.min(r.x0, r.x1), y: Math.min(r.y0, r.y1),
  w: Math.abs(r.x1 - r.x0), h: Math.abs(r.y1 - r.y0),
});

/**
 * Where a force is anchored in the world. `applicationPoint` is a WORLD-frame
 * offset from the centre of mass (lib/scene `offsetPoint`), so it is added, not
 * rotated — rotating it again would walk contact arrows off their surfaces on
 * every tilted body.
 */
function anchorOf(scene: Scene, f: TrueForce): Vec2 {
  const b = findBody(scene, f.onBody);
  if (!b) return { x: 0, y: 0 };
  return f.applicationPoint
    ? { x: b.pos.x + f.applicationPoint.x, y: b.pos.y + f.applicationPoint.y }
    : b.pos;
}

export default function CutStage({ scene, solve, onDone }: {
  scene: Scene;
  solve: SolveResult | null;
  onDone?: () => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [dragging, setDragging] = useState(false);
  const [cut, setCut] = useState<CutResult | null>(null);
  const [cancelled, setCancelled] = useState(0);

  const box = useStageBox();
  const { w, h } = box;
  const refPx = arrowRefPx(w || 430, h || 360);

  // ONE length scale for the whole board, set by the heaviest body — so a 5 N
  // arrow is visibly shorter than a 50 N one instead of every arrow being the
  // same length. Per-force scaling would have made the diagram lie.
  const refN = Math.max(10, ...scene.bodies.map((b) => b.mass * (scene.g ?? 9.8)));
  const perPx = nPerPx(refN, refPx);
  const arrowPx = React.useCallback(
    (f: TrueForce) => (f.magnitude !== undefined
      ? Math.max(refPx * 0.36, Math.min(refPx * 1.58, f.magnitude / perPx))
      : refPx * 0.61),
    [refPx, perPx]
  );

  // Keyed on the scene's shape, not its object identity — the autosaving admin
  // editor rebuilds block objects on every keystroke.
  const geomKey = JSON.stringify(scene.bodies.map(
    (b) => [b.id, b.pos.x, b.pos.y, b.size?.w, b.size?.h, b.radius, b.angleDeg, b.mass]));

  // Fit to EVERY force the scene could put on this board, not just the ones the
  // current cut happens to draw. That keeps the camera identical before and
  // after "Cut here" — which it must be, because the boundary the student drew
  // has to keep enclosing the same bodies once the cut lands.
  const bounds = useMemo(() => {
    const world = sceneWorldBounds(scene);
    const spurs: Spur[] = [];
    for (const b of scene.bodies) {
      let fs: TrueForce[] = [];
      try { fs = fillMagnitudes(scene, trueForcesFor(scene, b.id), solve); } catch { fs = []; }
      for (const f of fs) spurs.push({ at: anchorOf(scene, f), angleDeg: f.angleDeg, px: arrowPx(f) });
    }
    return mixedBounds(world, spurs, w, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geomKey, w, h, arrowPx, solve]);

  const view = useFittedView(bounds, w, h, false, FIT_PAD, 340);

  const start = useRef<{ x: number; y: number } | null>(null);
  const boundaryDrag = usePointerDrag({
    svgRef,
    onStart: (pt) => {
      const p = screenToWorld(pt, view);
      start.current = p;
      setRect({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
      setDragging(true);
      setCut(null);
      setCancelled(0);
    },
    onMove: (pt) => {
      if (!start.current) return;
      const p = screenToWorld(pt, view);
      setRect({ x0: start.current.x, y0: start.current.y, x1: p.x, y1: p.y });
    },
    onEnd: () => setDragging(false),
  });

  // Which bodies the boundary encloses. Centre-in-rect, which is forgiving on a
  // phone and never leaves a body half-cut. Compared in WORLD metres, so it
  // survives a resize.
  const insideIds = useMemo(() => {
    if (!rect) return [];
    const r = norm(rect);
    return scene.bodies.filter((b) =>
      b.pos.x >= r.x && b.pos.x <= r.x + r.w && b.pos.y >= r.y && b.pos.y <= r.y + r.h
    ).map((b) => b.id);
  }, [rect, scene.bodies]);

  const doCut = () => {
    if (insideIds.length === 0) return;
    setCut(cutSystem(scene, insideIds));
    setCancelled(0);
  };

  const external = cut ? fillMagnitudes(scene, cut.external, solve) : [];
  const pairs = cut?.internal ?? [];
  const allCancelled = cut !== null && cancelled >= pairs.length;

  const rows: LegendRow[] = external.map((f) => ({
    id: f.id,
    color: FORCE_STYLE[f.kind].color,
    name: FORCE_STYLE[f.kind].label,
    detail: `crosses the boundary — stays`,
    value: f.magnitude !== undefined ? `${fmtN(f.magnitude)} N` : f.magSymbol,
    dashed: FORCE_STYLE[f.kind].dashed,
  }));
  pairs.forEach((p, i) => rows.push({
    id: `pair-${i}`,
    color: FORCE_STYLE[p.a.kind].color,
    name: `${FORCE_STYLE[p.a.kind].label} pair`,
    detail: i < cancelled ? 'cancelled — internal' : 'both inside — will cancel',
    dashed: true,
    muted: i < cancelled,
  }));

  // World → screen, for drawing only. The stored rect stays in metres.
  const rWorld = rect ? norm(rect) : null;
  const rBox = rWorld ? (() => {
    const a = worldToScreen({ x: rWorld.x, y: rWorld.y + rWorld.h }, view);        // top-left
    const b = worldToScreen({ x: rWorld.x + rWorld.w, y: rWorld.y }, view);        // bottom-right
    return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y };
  })() : null;

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-2" style={{ minHeight: 34 }}>
      <p className="text-[11px] leading-snug" style={{ color: TEXT.muted, maxWidth: '58%' }}>
        {cut
          ? allCancelled
            ? 'Everything left crosses the boundary. That is the composite free-body diagram.'
            : 'Cancel the internal pairs one at a time and watch what is left.'
          : dragging ? 'Release to set the boundary.'
            : 'Drag a box around the bodies you want to treat as ONE system.'}
      </p>
      <ActionButton onClick={() => { setRect(null); setCut(null); setCancelled(0); }}>Clear boundary</ActionButton>
    </div>
  );

  return (
    <StagePanels box={box} footer={footer} side={
      <>
        <Card>
          <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>
            Draw a boundary around any group of bodies. Whatever crosses the line is a force ON your system.
            Whatever is entirely inside is a conversation the system is having with itself — and those always
            come in equal-and-opposite pairs, so they add to nothing.
          </p>
        </Card>

        <div className="flex items-center gap-2">
          <button type="button" onClick={doCut} disabled={insideIds.length === 0 || !!cut}
            className="flex-1 rounded-lg px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider transition-all"
            style={{
              background: insideIds.length && !cut ? accentTint(SECONDARY, 0.2) : 'rgba(255,255,255,0.04)',
              border: `1px solid ${insideIds.length && !cut ? accentTint(SECONDARY, 0.45) : 'rgba(255,255,255,0.07)'}`,
              color: insideIds.length && !cut ? SECONDARY : TEXT.muted,
              cursor: insideIds.length && !cut ? 'pointer' : 'not-allowed',
              touchAction: 'manipulation',
            }}>
            Cut here
          </button>
          {insideIds.length > 0 && <Pill tone="info">{insideIds.length} inside</Pill>}
        </div>

        {cut && (
          <Card tone="accent">
            <div className={`${TYPE.sectionLabel} mb-1`} style={{ color: SECONDARY }}>Your system</div>
            <p className="text-[13px] leading-snug" style={{ color: TEXT.primary }}>
              One composite body of mass{' '}
              <b className="tabular-nums" style={{ color: SECONDARY }}>{fmtN(cut.totalMass)} kg</b>,
              with {external.length} external force{external.length === 1 ? '' : 's'} on it
              {pairs.length > 0 && ` and ${pairs.length} internal pair${pairs.length === 1 ? '' : 's'} to cancel`}.
            </p>
            {pairs.length > 0 && !allCancelled && (
              <button type="button" onClick={() => setCancelled((c) => c + 1)}
                className="mt-2.5 w-full rounded-lg px-3 py-2 text-[12px] font-semibold uppercase tracking-wider"
                style={{
                  background: accentTint(PRIMARY, 0.2),
                  border: `1px solid ${accentTint(PRIMARY, 0.45)}`,
                  color: PRIMARY, touchAction: 'manipulation',
                }}>
                Cancel pair {cancelled + 1} of {pairs.length} →
              </button>
            )}
            {allCancelled && pairs.length > 0 && (
              <p className="mt-2 text-[13px] leading-snug" style={{ color: TEXT.primary }}>
                Every internal pair is gone and the diagram did not change its net force by a single newton.
                That is why you were allowed to treat the group as one block all along — and it is the same
                move, every time, for every connected-body problem you will ever see.
              </p>
            )}
            {allCancelled && onDone && (
              <button type="button" onClick={onDone}
                className="mt-2.5 w-full rounded-lg px-3 py-2 text-[12px] font-semibold uppercase tracking-wider"
                style={{
                  background: accentTint(SECONDARY, 0.2),
                  border: `1px solid ${accentTint(SECONDARY, 0.45)}`,
                  color: SECONDARY, touchAction: 'manipulation',
                }}>
                Take it to the algebra →
              </button>
            )}
          </Card>
        )}

        <Legend title="On the boundary" rows={rows}
          empty="Draw a boundary and press cut to see which forces survive." />
      </>
    }>
      {box.ready && (
        <SceneView scene={scene} view={view} w={w} h={h} arrowRef={refPx}
          svgRef={svgRef}
          dimIds={cut ? scene.bodies.filter((b) => !insideIds.includes(b.id)).map((b) => b.id) : []}
          onBackgroundDown={boundaryDrag}>

          {/* A transparent catcher so a drag can start anywhere, including over
              a body — otherwise the boundary is impossible to draw on a phone. */}
          <rect x={0} y={0} width={w} height={h}
            fill="transparent" style={{ touchAction: 'none' }} onPointerDown={boundaryDrag} />

          {rBox && rBox.w > 4 && rBox.h > 4 && (
            <rect x={rBox.x} y={rBox.y} width={rBox.w} height={rBox.h} rx={14}
              fill={accentTint(SECONDARY, cut ? 0.09 : 0.05)}
              stroke={SECONDARY} strokeWidth={2.4} strokeDasharray="9 7"
              style={{ pointerEvents: 'none' }} />
          )}

          {/* External forces — bold, they survive the cut. */}
          {cut && external.map((f) => (
            <WorldArrow key={f.id} at={anchorOf(scene, f)} angleDeg={f.angleDeg}
              lengthPx={arrowPx(f)}
              view={view} color={FORCE_STYLE[f.kind].color}
              dashed={FORCE_STYLE[f.kind].dashed} width={4.6} halo />
          ))}

          {/* Internal third-law pairs. Both members share one <g> so they fade
              and shrink TOGETHER — the cancellation has to be seen as a pair,
              not as two arrows that happened to leave. CSS transition only. */}
          {cut && pairs.map((p, i) => {
            const gone = i < cancelled;
            const aAt = anchorOf(scene, p.a), bAt = anchorOf(scene, p.b);
            const aS = worldToScreen(aAt, view), bS = worldToScreen(bAt, view);
            return (
              <g key={`pair-${i}`}
                style={{
                  opacity: gone ? 0 : 1,
                  transform: gone ? 'scale(0.55)' : 'scale(1)',
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  transition: 'opacity 700ms ease, transform 700ms ease',
                  pointerEvents: 'none',
                }}>
                <line x1={aS.x} y1={aS.y} x2={bS.x} y2={bS.y}
                  stroke={TEXT.muted} strokeWidth={1.6} strokeDasharray="4 5" opacity={0.7} />
                <WorldArrow at={aAt} angleDeg={p.a.angleDeg} lengthPx={refPx * 0.57} view={view}
                  color={FORCE_STYLE[p.a.kind].color} width={3} opacity={0.85} />
                <WorldArrow at={bAt} angleDeg={p.b.angleDeg} lengthPx={refPx * 0.57} view={view}
                  color={FORCE_STYLE[p.b.kind].color} width={3} opacity={0.85} />
              </g>
            );
          })}
        </SceneView>
      )}
    </StagePanels>
  );
}
