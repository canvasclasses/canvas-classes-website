'use client';

/*
 * pulley/PulleyCanvas.tsx — the SVG stage.
 * ─────────────────────────────────────────────────────────────────────────────
 * LABEL OVERLAP RULE (BOOK_PAGE_WORKFLOW §4E): this canvas carries exactly ONE
 * <text> element — the status line pinned to the top-left corner, structurally
 * unable to collide with anything because bodies are fitted inside a 58 px
 * padding. Every name, mass, acceleration and tension lives in the colour-keyed
 * legend below. That is not a discipline someone has to remember; there is no
 * code path here that emits a second label.
 *
 * Body identity without text: a body's OUTLINE is stroked with the same style
 * (width / opacity / dash) as its term in the constraint equation and the rope
 * segments bound to it. Solid box ↔ solid rope ↔ solid swatch in the equation.
 * One identity, three places, one accent colour.
 *
 * Interaction is pointer-event based (works on a phone) and is NOT gated on any
 * animation clock — a previous sim shipped with drag silently broken because a
 * `t > 0` guard sat in front of it.
 */

import * as React from 'react';
import type { Body, Scene } from '../types';
import {
  CANVAS_H, CANVAS_W, type View, arrow, fitView, screenSegment, toScreen,
} from './geometry';
import type { SegmentDraw, SegStyle, TermGroup } from './ledger';
import { NEUTRAL_STYLE } from './ledger';

const MAX_DRAG_M = 0.45;

export interface PulleyCanvasProps {
  /** Undisplaced scene — fixes the view so the diagram never jumps mid-drag. */
  baseScene: Scene;
  /** Scene with the current drag applied — what actually gets drawn. */
  scene: Scene;
  draws: SegmentDraw[];
  groups: TermGroup[];
  /** body id → signed acceleration along its dof axis. null before the solve
   *  step: nothing is on screen before it has been explained. */
  accelerations: Record<string, number> | null;
  accent: string;
  accent2: string;
  /** The single canvas text element. */
  hint: string;
  /** Term key hovered in the ledger — its segments and body light up. */
  highlight: string | null;
  onDrag: (bodyId: string, delta: number) => void;
  onDragEnd: () => void;
  draggable: boolean;
  /**
   * viewBox units per CSS pixel, measured off the rendered column. Every
   * invisible drag target below is sized in units × this factor, so a handle
   * stays the same number of REAL pixels whether the board is 660 px wide on a
   * desktop or 330 px on a phone. Sizing them in viewBox units alone halves
   * every touch target the moment the column narrows.
   */
  hitScale?: number;
}

/** Minimum touch target, CSS px — the phone figure, not the mouse one. */
const HIT_PX = 44;

function styleForBody(groups: TermGroup[], bodyId: string): SegStyle | null {
  const g = groups.find((x) => x.bodyId === bodyId);
  return g ? g.style : null;
}
function groupKeyForBody(groups: TermGroup[], bodyId: string): string | null {
  return groups.find((x) => x.bodyId === bodyId)?.key ?? null;
}

/** Blocks grow with mass so a 6 kg load reads as heavier than a 2 kg one —
 *  cube-root so a 20 kg load doesn't fill the frame. */
function massScale(mass: number): number {
  if (!mass) return 1;
  return Math.max(0.78, Math.min(1.55, Math.cbrt(mass / 3)));
}

export default function PulleyCanvas({
  baseScene, scene, draws, groups, accelerations, accent, accent2,
  hint, highlight, onDrag, onDragEnd, draggable, hitScale = 1,
}: PulleyCanvasProps) {
  /** A length in CSS pixels, expressed in viewBox units. */
  const hit = (cssPx: number) => cssPx * hitScale;
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  // The capturing element is remembered so it can release its OWN capture —
  // calling releasePointerCapture on the <svg> (which never captured) throws.
  const dragRef = React.useRef<
    { id: string; x0: number; y0: number; dofDeg: number; el: Element; pid: number } | null
  >(null);

  // The view is fitted to the UNDISPLACED scene, so dragging moves the bodies
  // inside a stationary frame instead of rescaling the world under the pointer.
  const view: View = React.useMemo(() => fitView(baseScene), [baseScene]);

  /** viewBox units per client pixel — the SVG scales with the column width. */
  const unitsPerPx = () => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return 1;
    return CANVAS_W / r.width;
  };

  const handleDown = (b: Body) => (e: React.PointerEvent) => {
    if (!draggable || typeof b.dofDeg !== 'number' || b.fixed) return;
    e.preventDefault();
    const el = e.currentTarget as Element;
    try { el.setPointerCapture?.(e.pointerId); } catch { /* capture is a nicety */ }
    dragRef.current = {
      id: b.id, x0: e.clientX, y0: e.clientY, dofDeg: b.dofDeg, el, pid: e.pointerId,
    };
  };

  const handleMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const k = unitsPerPx();
    // client px → viewBox px → metres, then project onto the body's own axis.
    const dxWorld = ((e.clientX - d.x0) * k) / view.s;
    const dyWorld = -((e.clientY - d.y0) * k) / view.s;
    const r = (d.dofDeg * Math.PI) / 180;
    const along = dxWorld * Math.cos(r) + dyWorld * Math.sin(r);
    onDrag(d.id, Math.max(-MAX_DRAG_M, Math.min(MAX_DRAG_M, along)));
  };

  const handleUp = () => {
    const d = dragRef.current;
    if (!d) return;
    try {
      if (d.el.hasPointerCapture?.(d.pid)) d.el.releasePointerCapture(d.pid);
    } catch { /* already released */ }
    dragRef.current = null;
    onDragEnd();
  };

  const dim = (key: string | null) =>
    highlight && key !== highlight ? 0.32 : 1;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      role="img"
      aria-label="Pulley system diagram. Every value is listed in the panels below."
      style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none' }}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
    >
      {/* ── Fixed structure: ceiling ties, tables, wedges ────────────────── */}
      {scene.bodies.filter((b) => b.fixed && b.shape !== 'pulley').map((b) => {
        if (b.shape === 'wedge') {
          const w = b.size?.w ?? 1, h = b.size?.h ?? 0.5;
          const p1 = toScreen({ x: b.pos.x - w / 2, y: b.pos.y - h / 2 }, view);
          const p2 = toScreen({ x: b.pos.x + w / 2, y: b.pos.y - h / 2 }, view);
          const p3 = toScreen({ x: b.pos.x + w / 2, y: b.pos.y + h / 2 }, view);
          return (
            <polygon key={b.id}
              points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
              fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" strokeWidth={1.5} />
          );
        }
        const w = (b.size?.w ?? 0.4) * view.s;
        const h = Math.max(6, (b.size?.h ?? 0.08) * view.s);
        const c = toScreen(b.pos, view);
        return (
          <g key={b.id}>
            <rect x={c.x - w / 2} y={c.y - h / 2} width={w} height={h} rx={2}
              fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" strokeWidth={1.2} />
            {/* hatching — reads as "bolted to the world", costs no colour */}
            {[0, 1, 2, 3, 4].map((i) => {
              const x = c.x - w / 2 + ((i + 0.5) * w) / 5;
              return <line key={i} x1={x} y1={c.y - h / 2} x2={x - 7} y2={c.y - h / 2 - 8}
                stroke="rgba(255,255,255,0.16)" strokeWidth={1.2} />;
            })}
          </g>
        );
      })}

      {/* ── Rope segments ────────────────────────────────────────────────── */}
      {draws.map((d, i) => {
        const t = screenSegment(d.seg, view, d.laneOffset);
        return (
          <line key={`${d.seg.id}:${d.groupKey ?? 'ghost'}:${i}`}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={accent}
            strokeWidth={d.style.width}
            strokeDasharray={d.style.dash}
            strokeLinecap="round"
            opacity={d.style.opacity * dim(d.groupKey)} />
        );
      })}

      {/* ── Sheaves ──────────────────────────────────────────────────────── */}
      {scene.bodies.filter((b) => b.shape === 'pulley').map((b) => {
        const c = toScreen(b.pos, view);
        // A block-and-tackle's sheaves are physically tiny (that is what keeps
        // its falls parallel and its coefficient a clean n), so give the DRAWN
        // wheel a floor. The rope endpoints are tangent-accurate either way and
        // the sheave is painted over them.
        const r = Math.max((b.radius ?? 0.16) * view.s, 9);
        const st = styleForBody(groups, b.id);
        const key = groupKeyForBody(groups, b.id);
        const movable = !b.fixed;
        // A sheave carrying rotational inertia is the ONE thing the massive-
        // pulley rung adds, and the rope either side of it genuinely solves to
        // two different tensions. Drawn like every other wheel it was the only
        // element on the ladder that arrived invisibly — so it gets a solid,
        // heavy-looking disc and a broad hub. Weight of ink, no new colour, no
        // second text element.
        const massive = (b.inertia ?? 0) > 0;
        return (
          <g key={b.id} opacity={dim(key)}
            style={{ cursor: draggable && movable ? 'grab' : 'default' }}
            onPointerDown={movable ? handleDown(b) : undefined}>
            {/* axle bracket for a fixed sheave */}
            {b.fixed && (
              <line x1={c.x} y1={c.y - r - 14} x2={c.x} y2={c.y}
                stroke="rgba(255,255,255,0.22)" strokeWidth={2.5} strokeLinecap="round" />
            )}
            <circle cx={c.x} cy={c.y} r={r}
              fill={massive ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.05)'}
              stroke={movable && st ? accent : 'rgba(255,255,255,0.3)'}
              strokeWidth={movable && st ? st.width : massive ? 4 : 2}
              strokeDasharray={movable ? st?.dash : undefined}
              opacity={movable && st ? st.opacity : 1} />
            <circle cx={c.x} cy={c.y} r={Math.max(2.5, r * (massive ? 0.34 : 0.2))}
              fill={massive ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.28)'} />
            {/* A movable sheave carries the load: draw the load rigidly under it. */}
            {movable && b.mass > 0 && (() => {
              const bw = 34 * massScale(b.mass), bh = 26 * massScale(b.mass);
              const top = c.y + r + 10;
              return (
                <g>
                  <line x1={c.x} y1={c.y + r} x2={c.x} y2={top}
                    stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} />
                  <rect x={c.x - bw / 2} y={top} width={bw} height={bh} rx={4}
                    fill="rgba(255,255,255,0.06)"
                    stroke={accent} strokeWidth={st?.width ?? 2}
                    strokeDasharray={st?.dash} opacity={st?.opacity ?? 1} />
                </g>
              );
            })()}
            {/* Generous invisible touch targets — one on the sheave itself and
                one over the load it carries, both a real 44 CSS px across at
                any board width. */}
            {movable && draggable && (
              <>
                <circle cx={c.x} cy={c.y} r={Math.max(r + 6, hit(HIT_PX) / 2)}
                  fill="transparent" onPointerDown={handleDown(b)} />
                {b.mass > 0 && (
                  <circle cx={c.x} cy={c.y + r + hit(20)} r={Math.max(30, hit(HIT_PX) / 2)}
                    fill="transparent" onPointerDown={handleDown(b)} />
                )}
              </>
            )}
          </g>
        );
      })}

      {/* ── Blocks ───────────────────────────────────────────────────────── */}
      {scene.bodies.filter((b) => !b.fixed && b.shape !== 'pulley').map((b) => {
        const c = toScreen(b.pos, view);
        const k = massScale(b.mass);
        const w = (b.size?.w ?? 0.34) * view.s * k;
        const h = (b.size?.h ?? 0.34) * view.s * k;
        const st = styleForBody(groups, b.id) ?? NEUTRAL_STYLE;
        const key = groupKeyForBody(groups, b.id);
        return (
          <g key={b.id} opacity={dim(key)}
            style={{ cursor: draggable ? 'grab' : 'default' }}
            onPointerDown={handleDown(b)}>
            <rect x={c.x - w / 2} y={c.y - h / 2} width={w} height={h} rx={5}
              fill="rgba(255,255,255,0.06)"
              stroke={accent} strokeWidth={st.width} strokeDasharray={st.dash}
              opacity={st.opacity} />
            {draggable && (() => {
              // Pad the block out to a real 44 CSS px in each direction, so a
              // 2 kg block on a phone is still catchable with a thumb.
              const padX = Math.max(hit(9), (hit(HIT_PX) - w) / 2);
              const padY = Math.max(hit(9), (hit(HIT_PX) - h) / 2);
              return (
                <rect x={c.x - w / 2 - padX} y={c.y - h / 2 - padY}
                  width={w + 2 * padX} height={h + 2 * padY} fill="transparent" />
              );
            })()}
          </g>
        );
      })}

      {/* ── Acceleration arrows (the second accent; the only other colour) ── */}
      {accelerations && scene.bodies.filter((b) => !b.fixed && typeof b.dofDeg === 'number').map((b) => {
        const a = accelerations[b.id];
        if (a == null || Math.abs(a) < 1e-4) return null;
        const c = toScreen(b.pos, view);
        const half = b.shape === 'pulley'
          ? (b.radius ?? 0.16) * view.s + (b.mass > 0 ? 42 : 8)
          : ((b.size?.h ?? 0.34) * view.s * massScale(b.mass)) / 2 + 6;
        const r = ((b.dofDeg ?? 270) * Math.PI) / 180 + (a < 0 ? Math.PI : 0);
        const ux = Math.cos(r), uy = -Math.sin(r);
        const len = Math.min(58, 14 + Math.abs(a) * 7);
        const x1 = c.x + ux * half, y1 = c.y + uy * half;
        return (
          <path key={`a:${b.id}`}
            d={arrow(x1, y1, x1 + ux * len, y1 + uy * len, 9)}
            stroke={accent2} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        );
      })}

      {/* ── The ONE text element on this canvas. Corner-pinned by design. ─── */}
      <text x={16} y={26} fontSize={13} fontWeight={600}
        fill="rgba(226,232,240,0.62)" style={{ pointerEvents: 'none' }}>
        {hint}
      </text>
    </svg>
  );
}

export { MAX_DRAG_M };
