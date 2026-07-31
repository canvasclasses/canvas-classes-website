// frame.ts — decides how big the drawing is and where the origin sits.
//
// WHY THIS IS ITS OWN FILE: it is pure (no React, no DOM), so it is
// node-testable and the space audit can import the REAL function instead of a
// copy that silently drifts out of sync.
//
// HISTORY — read before changing the model.
//
// v1 was "anchor + reach": pick a point on the canvas, assume the drawing
// extends symmetrically around it by `reach` units, scale = room / reach.
// It wasted the canvas badly, because `reach` was guessed from the SUM of the
// seed magnitudes (plus a full `max_mag` allowance whenever anything was
// draggable) while the drawing's real extent is far smaller — a 6 N and a 5 N
// vector at 60° span 8.1 units, not 11. Measured across all 9 archetypes the
// median ink coverage was 5% of the canvas, and every archetype could have been
// ≥50% bigger. Founder, 2026-07-29: "we are working in only one quadrant… the
// rest of the three quadrants (75% of the space) are being wasted."
//
// v2 (this file) is "fit the content box": run the archetype's own pure
// `build()` at the final step, take the bounding box of everything it actually
// draws, add a fixed drag headroom, then fit that box to the canvas and centre
// it. `max_mag` is then DERIVED FROM the frame rather than the frame from
// `max_mag`, so a dragged tip can never leave the visible area.
//
// INVARIANT — the box is computed from the STATIC seed vectors, never from the
// live dragged ones. Recomputing per-frame is what made the goal ring appear to
// change size mid-drag (fixed once already; do not reintroduce).

import type { VectorSpec, VectorTarget } from '@canvas/data/types/books';
import type { ArchetypeDef } from './archetypes';
import { seedVectors } from './archetypes';

export const VIEW = { w: 460, h: 420 };

/** px of breathing room for arrowheads and on-canvas labels. */
const PAD = 44;
/** Fraction of the content box kept free so a drag has somewhere to go. */
const DRAG_HEADROOM = 0.34;
/** Hard limits — below 10 the grid is unreadable, above 70 a nudge is enormous. */
const SCALE_MIN = 10;
const SCALE_MAX = 70;

export interface Frame {
  originX: number;
  originY: number;
  scale: number;
}

export interface Box {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const num = (p: Record<string, number | string | boolean> | undefined, k: string, d: number) =>
  typeof p?.[k] === 'number' ? (p[k] as number) : d;

/**
 * The world-space bounding box of everything the archetype draws at its final
 * step, using the seed vectors. Includes the origin, every arrow endpoint,
 * every guide endpoint and the resultant.
 */
export function computeContentBox(
  def: ArchetypeDef | undefined,
  specs: VectorSpec[],
  params?: Record<string, number | string | boolean>
): Box {
  const pts: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  if (def) {
    const steps = def.defaultSteps?.length ?? 1;
    try {
      const res = def.build({
        vecs: seedVectors(specs),
        specs,
        units: '',
        params: params ?? {},
        step: steps + 1,
        t: 1,
        show: { grid: true, axes: true, components: true, angleArc: true, readout: true, formula: true, compass: false },
      } as never) as {
        arrows?: { from: { x: number; y: number }; to: { x: number; y: number } }[];
        guides?: { from: { x: number; y: number }; to: { x: number; y: number } }[];
        resultant?: { x: number; y: number };
      };
      for (const a of res.arrows ?? []) pts.push(a.from, a.to);
      for (const g of res.guides ?? []) pts.push(g.from, g.to);
      if (res.resultant) pts.push(res.resultant);
    } catch {
      // A build that throws on synthetic input must not break rendering — fall
      // back to the seed tips, which is always enough to frame something sane.
    }
  }
  // Also include each seed vector's own tail and tip, so a board whose `build`
  // returns nothing still gets framed. This MUST mirror `tailOf` exactly: a
  // 'chain' vector starts at the running sum of its predecessors, everything
  // else starts at the origin. Getting this wrong over-reserves badly — pushing
  // a chained vector as if it also came from the origin inflated
  // polygon-equilibrium's box from 5.0×4.3 to 7.5×8.7 and halved its scale.
  const seeds = seedVectors(specs);
  let running = { x: 0, y: 0 };
  seeds.forEach((v, i) => {
    const chained = specs[i]?.tail === 'chain';
    const tail = chained ? running : { x: 0, y: 0 };
    const tip = { x: tail.x + v.x, y: tail.y + v.y };
    pts.push(tail, tip);
    running = { x: running.x + v.x, y: running.y + v.y };
  });

  const xs = pts.map((p) => p.x).filter(Number.isFinite);
  const ys = pts.map((p) => p.y).filter(Number.isFinite);
  return {
    minX: Math.min(...xs, 0),
    maxX: Math.max(...xs, 0),
    minY: Math.min(...ys, 0),
    maxY: Math.max(...ys, 0),
  };
}

/**
 * Fit the content box to the canvas and centre it. `defaultFrame` on an
 * archetype, or explicit `origin_x`/`origin_y`/`scale` params, still win — an
 * author who has hand-placed a board keeps that placement.
 */
export function computeFrame(
  def: ArchetypeDef | undefined,
  specs: VectorSpec[],
  params: Record<string, number | string | boolean> | undefined,
  tgt?: VectorTarget
): Frame {
  if (def?.defaultFrame) {
    return {
      originX: num(params, 'origin_x', def.defaultFrame.originX),
      originY: num(params, 'origin_y', def.defaultFrame.originY),
      scale: num(params, 'scale', def.defaultFrame.scale),
    };
  }

  let box = computeContentBox(def, specs, params);

  // A `target` exercise draws a goal ring of this radius about the origin, so it
  // has to be inside the frame or the student cannot see what they are aiming at.
  if (tgt?.resultant_mag) {
    const r = tgt.resultant_mag;
    box = { minX: Math.min(box.minX, -r), maxX: Math.max(box.maxX, r), minY: Math.min(box.minY, -r), maxY: Math.max(box.maxY, r) };
  }

  let w = box.maxX - box.minX;
  let h = box.maxY - box.minY;

  // Drag headroom, applied about the box centre — so a student who swings a
  // vector out still has canvas to swing into, without reserving the full
  // symmetric worst case the old model paid for.
  if (specs.some((s) => s.draggable)) {
    const gx = (w || 1) * DRAG_HEADROOM;
    const gy = (h || 1) * DRAG_HEADROOM;
    box = { minX: box.minX - gx / 2, maxX: box.maxX + gx / 2, minY: box.minY - gy / 2, maxY: box.maxY + gy / 2 };
    w = box.maxX - box.minX;
    h = box.maxY - box.minY;
  }

  const usableW = VIEW.w - 2 * PAD;
  const usableH = VIEW.h - 2 * PAD;
  const fit = Math.min(usableW / Math.max(w, 0.5), usableH / Math.max(h, 0.5));
  const scale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, fit));

  // Centre the box: place the world origin so the box's midpoint lands on the
  // canvas midpoint. y is flipped (screen y grows downward).
  const midX = (box.minX + box.maxX) / 2;
  const midY = (box.minY + box.maxY) / 2;

  return {
    originX: num(params, 'origin_x', VIEW.w / 2 - midX * scale),
    originY: num(params, 'origin_y', VIEW.h / 2 + midY * scale),
    scale: num(params, 'scale', scale),
  };
}

/**
 * The largest magnitude a vector with this tail can take before its tip leaves
 * the padded canvas. Derived FROM the frame, so tight framing can never let a
 * drag escape the view. Callers pass it to `DraggableHead` as `maxMag`.
 */
export function maxMagForTail(frame: Frame, tail: { x: number; y: number }): number {
  const tx = frame.originX + tail.x * frame.scale;
  const ty = frame.originY - tail.y * frame.scale;
  const room = Math.min(
    VIEW.w - PAD - tx,   // right
    tx - PAD,            // left
    ty - PAD,            // up (screen y decreases)
    VIEW.h - PAD - ty    // down
  );
  // Never return a uselessly small cap; 2 units is the floor at which a board
  // is still draggable at all.
  return Math.max(2, room / frame.scale);
}
