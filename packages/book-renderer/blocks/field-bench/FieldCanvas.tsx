'use client';

/*
 * field-bench/FieldCanvas.tsx — the stage.
 * ─────────────────────────────────────────────────────────────────────────────
 * ONE SVG holds the whole scene: field lines, equipotentials, sampled vectors,
 * the Gauss surface, the sources, the integrated paths and the particles.
 *
 * ── ZERO <text> ELEMENTS ────────────────────────────────────────────────────
 * The label-overlap rule (SIMULATION_DESIGN_WORKFLOW §4E) allows one. This
 * canvas uses none: charge signs are drawn as bars, ⊗/⊙ as strokes, and every
 * name, value and unit lives in the colour-keyed legend and the readouts below.
 * A field-line diagram is the worst possible place for floating labels — the
 * lines move as the student drags, so any label would either chase them or be
 * crossed out by them.
 *
 * ── POINTER EVENTS, AND THE HIT TEST DOES NOT WAIT FOR REACT ────────────────
 * `onPointerDown` resolves the drag target from the props it can see AT THAT
 * INSTANT and stores it in a ref. It never reads state that a re-render is
 * about to set, and it never gates on an animation clock: dragging works while
 * a path is playing, paused, finished or never started. Pointer capture means
 * the drag survives the cursor leaving the SVG, and `touchAction: none` stops a
 * drag from scrolling the page on a phone — which is what makes a draggable
 * Gauss surface feel fluid rather than fought-with.
 *
 * ── Colour ──────────────────────────────────────────────────────────────────
 * violet ACCENT = field. amber ACCENT_B = potential / surfaces / B glyphs.
 * POS / NEG = the charge identity pair (ui.tsx). Nothing else.
 */

import * as React from 'react';
import type { Equipotential, FieldLine, FieldSource, GaussSurface, Vec2 } from './types';
import type { View } from './lib/view';
import { worldToScreen, screenToWorld } from '../mechanics-bench/lib/svg';
import { ACCENT, TEXT, accentTint } from '../simulations/_shared';
import { ACCENT_B, chargeColour, NEG, POS } from './ui';

export interface VectorSample { at: Vec2; dir: Vec2; frac: number }
export interface BGlyph { at: Vec2; sign: number }
export interface DrawnPath { id: string; pts: Vec2[]; color: string; dashed?: boolean }
export interface Particle {
  id: string; at: Vec2; charge: number;
  vel?: Vec2 | null; force?: Vec2 | null; radiusPx?: number;
}

export type DragKind = 'source' | 'particle' | 'surface';

export interface FieldCanvasProps {
  view: View;
  w: number;
  h: number;
  lines: FieldLine[];
  equipotentials: Equipotential[];
  vectors: VectorSample[];
  sources: FieldSource[];
  bGlyphs: BGlyph[];
  surface: GaussSurface | null;
  paths: DrawnPath[];
  particles: Particle[];
  /** Which categories accept a drag right now. */
  draggable: { sources: boolean; particles: boolean; surface: boolean };
  onDrag?: (kind: DragKind, id: string, world: Vec2) => void;
  onDragEnd?: (kind: DragKind, id: string) => void;
}

const PATH_PRECISION = 1;

/** Polyline in screen space. */
function toPath(pts: Vec2[], view: View): string {
  if (pts.length < 2) return '';
  let d = '';
  for (let i = 0; i < pts.length; i++) {
    const p = worldToScreen(pts[i], view);
    d += `${i ? 'L' : 'M'}${p.x.toFixed(PATH_PRECISION)},${p.y.toFixed(PATH_PRECISION)}`;
  }
  return d;
}

/** A shaft plus a filled head, both already in screen space. */
function Arrow({ x1, y1, x2, y2, color, width = 2, opacity = 1 }:
  { x1: number; y1: number; x2: number; y2: number; color: string; width?: number; opacity?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (!Number.isFinite(len) || len < 2) return null;
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(9, Math.max(4, len * 0.34));
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const px = -uy;
  const py = ux;
  return (
    <g opacity={opacity} style={{ pointerEvents: 'none' }}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon fill={color}
        points={`${x2},${y2} ${bx + px * head * 0.46},${by + py * head * 0.46} ${bx - px * head * 0.46},${by - py * head * 0.46}`} />
    </g>
  );
}

/** Arrowheads part-way along a field line, so direction reads without labels. */
function LineHeads({ pts, view, color }: { pts: Vec2[]; view: View; color: string }) {
  if (pts.length < 6) return null;
  const marks: React.ReactNode[] = [];
  for (const f of [0.42, 0.78]) {
    const i = Math.min(pts.length - 2, Math.max(1, Math.round(f * (pts.length - 1))));
    const a = worldToScreen(pts[i], view);
    const b = worldToScreen(pts[i + 1], view);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) continue;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const s = 5;
    marks.push(
      <polygon key={f} fill={color} opacity={0.9}
        points={`${a.x + ux * s},${a.y + uy * s} ${a.x - ux * s + px * s * 0.6},${a.y - uy * s + py * s * 0.6} ${a.x - ux * s - px * s * 0.6},${a.y - uy * s - py * s * 0.6}`} />,
    );
  }
  return <g style={{ pointerEvents: 'none' }}>{marks}</g>;
}

/** A charge: filled disc, plus a bar (−) or a cross (+). No <text>. */
function ChargeGlyph({ cx, cy, r, sign, colour }:
  { cx: number; cy: number; r: number; sign: number; colour: string }) {
  const b = r * 0.55;
  return (
    <g style={{ pointerEvents: 'none' }}>
      <circle cx={cx} cy={cy} r={r} fill={accentTint(colour, 0.85)} stroke={colour} strokeWidth={1.5} />
      <line x1={cx - b} y1={cy} x2={cx + b} y2={cy} stroke="#0d1117" strokeWidth={2.2} strokeLinecap="round" />
      {sign >= 0 && (
        <line x1={cx} y1={cy - b} x2={cx} y2={cy + b} stroke="#0d1117" strokeWidth={2.2} strokeLinecap="round" />
      )}
    </g>
  );
}

/** B out of the page (⊙) or into it (⊗) — strokes, never glyph text. */
function FieldIntoPage({ cx, cy, r, out }: { cx: number; cy: number; r: number; out: boolean }) {
  const d = r * 0.62;
  return (
    <g style={{ pointerEvents: 'none' }} opacity={0.55}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ACCENT_B} strokeWidth={1.2} />
      {out ? (
        <circle cx={cx} cy={cy} r={r * 0.28} fill={ACCENT_B} />
      ) : (
        <>
          <line x1={cx - d} y1={cy - d} x2={cx + d} y2={cy + d} stroke={ACCENT_B} strokeWidth={1.2} />
          <line x1={cx - d} y1={cy + d} x2={cx + d} y2={cy - d} stroke={ACCENT_B} strokeWidth={1.2} />
        </>
      )}
    </g>
  );
}

export default function FieldCanvas(props: FieldCanvasProps) {
  const {
    view, w, h, lines, equipotentials, vectors, sources, bGlyphs, surface, paths, particles,
    draggable, onDrag, onDragEnd,
  } = props;

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragRef = React.useRef<{ kind: DragKind; id: string; grabPx: number } | null>(null);

  /** Client point → world metres, through the SVG's own box so a CSS-scaled
   *  stage still maps correctly. */
  const toWorld = React.useCallback((clientX: number, clientY: number): Vec2 => {
    const el = svgRef.current;
    if (!el) return { x: 0, y: 0 };
    const box = el.getBoundingClientRect();
    const px = ((clientX - box.left) / Math.max(box.width, 1)) * w;
    const py = ((clientY - box.top) / Math.max(box.height, 1)) * h;
    return screenToWorld({ x: px, y: py }, view);
  }, [view, w, h]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!onDrag) return;
    const world = toWorld(e.clientX, e.clientY);
    const here = worldToScreen(world, view);

    // Collected then reduced rather than tracked in a mutable `best`: a value
    // assigned only inside a closure is invisible to the type narrower, and the
    // resulting `null`-narrowed variable is exactly the kind of thing that
    // compiles today and silently stops matching tomorrow.
    const hits: { kind: DragKind; id: string; d: number }[] = [];
    const consider = (kind: DragKind, id: string, at: Vec2, slop: number) => {
      const s = worldToScreen(at, view);
      const d = Math.hypot(s.x - here.x, s.y - here.y);
      if (d <= slop) hits.push({ kind, id, d });
    };

    if (draggable.particles) for (const p of particles) consider('particle', p.id, p.at, 26);
    if (draggable.sources) {
      for (const s of sources) {
        if (s.fixed) continue;
        if (s.kind === 'uniform-E' || s.kind === 'uniform-B') continue;
        consider('source', s.id, s.pos, 26);
      }
    }

    let best = hits.length ? hits.reduce((a, b) => (b.d < a.d ? b : a)) : null;

    // The surface is grabbed anywhere INSIDE it, not just at its centre — a
    // thin ring is a cruel target on a phone, and the whole lesson depends on
    // this drag feeling effortless. It yields to a charge under the finger.
    if (!best && draggable.surface && surface) {
      const c = worldToScreen(surface.centre, view);
      const rPx = surface.shape === 'circle'
        ? (surface.radius ?? 0) * view.scale
        : Math.max(surface.size?.w ?? 0, surface.size?.h ?? 0) * view.scale * 0.5;
      if (Math.hypot(c.x - here.x, c.y - here.y) <= rPx + 14) {
        best = { kind: 'surface', id: surface.id, d: 0 };
      }
    }

    if (!best) return;
    dragRef.current = { kind: best.kind, id: best.id, grabPx: best.d };
    e.currentTarget.setPointerCapture(e.pointerId);
    onDrag(best.kind, best.id, world);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d || !onDrag) return;
    onDrag(d.kind, d.id, toWorld(e.clientX, e.clientY));
  };

  const endDrag = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && onDragEnd) onDragEnd(d.kind, d.id);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const vecLen = Math.min(38, Math.max(16, Math.min(w, h) * 0.07));
  const chargeR = Math.min(13, Math.max(7, Math.min(w, h) * 0.026));

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      role="img"
      aria-label="Field stage. Names and values are listed in the legend below."
      style={{ display: 'block', touchAction: 'none', cursor: onDrag ? 'grab' : 'default' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* ── B into/out of the page ─────────────────────────────────────── */}
      {bGlyphs.map((g, i) => {
        const s = worldToScreen(g.at, view);
        return <FieldIntoPage key={`b${i}`} cx={s.x} cy={s.y} r={7} out={g.sign > 0} />;
      })}

      {/* ── equipotentials, under the lines so the lines read on top ───── */}
      {equipotentials.map((e, i) => (
        <g key={`eq${i}`} style={{ pointerEvents: 'none' }}>
          {e.loops.map((loop, j) => (
            <path key={j} d={toPath(loop, view)} fill="none" stroke={ACCENT_B}
              strokeWidth={1.4} strokeDasharray="5 4" opacity={0.72} />
          ))}
        </g>
      ))}

      {/* ── field lines ────────────────────────────────────────────────── */}
      {lines.map((l, i) => (
        <g key={`fl${i}`} style={{ pointerEvents: 'none' }}>
          <path d={toPath(l.points, view)} fill="none" stroke={ACCENT} strokeWidth={1.5} opacity={0.78} />
          <LineHeads pts={l.points} view={view} color={ACCENT} />
        </g>
      ))}

      {/* ── sampled vectors ────────────────────────────────────────────── */}
      {vectors.map((v, i) => {
        const s = worldToScreen(v.at, view);
        const len = vecLen * (0.35 + 0.65 * v.frac);
        return (
          <Arrow key={`v${i}`} x1={s.x} y1={s.y}
            x2={s.x + v.dir.x * len} y2={s.y - v.dir.y * len}
            color={ACCENT} width={1.4} opacity={0.35 + 0.45 * v.frac} />
        );
      })}

      {/* ── integrated paths ───────────────────────────────────────────── */}
      {paths.map((p) => (
        <path key={p.id} d={toPath(p.pts, view)} fill="none" stroke={p.color}
          strokeWidth={2.2} strokeLinecap="round" opacity={0.95}
          strokeDasharray={p.dashed ? '6 5' : undefined} style={{ pointerEvents: 'none' }} />
      ))}

      {/* ── the Gauss surface ──────────────────────────────────────────── */}
      {surface && (() => {
        const c = worldToScreen(surface.centre, view);
        const grab = draggable.surface;
        if (surface.shape === 'circle') {
          const r = (surface.radius ?? 0) * view.scale;
          return (
            <g style={{ cursor: grab ? 'grab' : 'default' }}>
              <circle cx={c.x} cy={c.y} r={r} fill={accentTint(ACCENT_B, 0.06)}
                stroke={ACCENT_B} strokeWidth={2.2} strokeDasharray="8 5" />
              <circle cx={c.x} cy={c.y} r={4} fill={ACCENT_B} opacity={grab ? 0.9 : 0.4} />
            </g>
          );
        }
        const wpx = (surface.size?.w ?? 0) * view.scale;
        const hpx = (surface.size?.h ?? 0) * view.scale;
        return (
          <g style={{ cursor: grab ? 'grab' : 'default' }}>
            <rect x={c.x - wpx / 2} y={c.y - hpx / 2} width={wpx} height={hpx}
              fill={accentTint(ACCENT_B, 0.06)} stroke={ACCENT_B} strokeWidth={2.2} strokeDasharray="8 5" />
            <circle cx={c.x} cy={c.y} r={4} fill={ACCENT_B} opacity={grab ? 0.9 : 0.4} />
          </g>
        );
      })()}

      {/* ── sources ────────────────────────────────────────────────────── */}
      {sources.map((s) => {
        const c = worldToScreen(s.pos, view);

        if (s.kind === 'ring-charge' || (s.kind === 'point-mass' && (s.radius ?? 0) > 0)) {
          const r = (s.radius ?? 0) * view.scale;
          const isMass = s.kind === 'point-mass';
          const col = isMass ? TEXT.secondary : chargeColour(s.strength); // sim-lint-ok — real-world identity: sign of the charge
          return (
            <g key={s.id} style={{ pointerEvents: 'none' }}>
              <circle cx={c.x} cy={c.y} r={r}
                fill={isMass ? 'rgba(148,163,184,0.10)' : 'none'}
                stroke={col} strokeWidth={isMass ? 1.6 : 2.4} opacity={isMass ? 0.75 : 0.85} />
            </g>
          );
        }

        if (s.kind === 'uniform-E' || s.kind === 'uniform-B') return null;

        const col = chargeColour(s.strength); // sim-lint-ok — real-world identity: sign of the charge

        if (s.kind === 'sheet-charge') {
          const a = ((s.angleDeg ?? 0) * Math.PI) / 180;
          const L = Math.max(w, h);
          return (
            <line key={s.id} style={{ pointerEvents: 'none' }}
              x1={c.x - Math.cos(a) * L} y1={c.y + Math.sin(a) * L}
              x2={c.x + Math.cos(a) * L} y2={c.y - Math.sin(a) * L}
              stroke={col} strokeWidth={3} opacity={0.75} />
          );
        }

        if (s.kind === 'point-mass') {
          return <circle key={s.id} cx={c.x} cy={c.y} r={chargeR} fill={TEXT.secondary} opacity={0.8} style={{ pointerEvents: 'none' }} />;
        }

        return <ChargeGlyph key={s.id} cx={c.x} cy={c.y} r={chargeR} sign={s.strength} colour={col} />;
      })}

      {/* ── particles, and the two arrows that explain them ────────────── */}
      {particles.map((p) => {
        const c = worldToScreen(p.at, view);
        const col = chargeColour(p.charge); // sim-lint-ok — real-world identity: sign of the charge
        const r = p.radiusPx ?? chargeR * 0.72;
        return (
          <g key={p.id}>
            {p.force && (
              <Arrow x1={c.x} y1={c.y} x2={c.x + p.force.x * vecLen} y2={c.y - p.force.y * vecLen}
                color={ACCENT} width={2.4} />
            )}
            {p.vel && (
              <Arrow x1={c.x} y1={c.y} x2={c.x + p.vel.x * vecLen} y2={c.y - p.vel.y * vecLen}
                color={TEXT.primary} width={2} opacity={0.9} />
            )}
            <circle cx={c.x} cy={c.y} r={r + 4} fill={col} opacity={0.16} />
            <circle cx={c.x} cy={c.y} r={r} fill={col} stroke="#0d1117" strokeWidth={1.2} />
          </g>
        );
      })}

      {/* Charges outrank everything for grabbing: this transparent layer sits
          on top so a drag started on a field line does not steal the gesture. */}
      {(draggable.sources || draggable.particles) && (
        <g fill="transparent" style={{ cursor: 'grab' }}>
          {draggable.particles && particles.map((p) => {
            const c = worldToScreen(p.at, view);
            return <circle key={`hp${p.id}`} cx={c.x} cy={c.y} r={22} />;
          })}
          {draggable.sources && sources.filter((s) => !s.fixed && s.kind !== 'uniform-E' && s.kind !== 'uniform-B').map((s) => {
            const c = worldToScreen(s.pos, view);
            return <circle key={`hs${s.id}`} cx={c.x} cy={c.y} r={22} />;
          })}
        </g>
      )}
    </svg>
  );
}

/** Re-export so the lab does not import the identity pair from two places. */
export { POS, NEG };
