/*
 * motion-lab/graphs/lib/handles.ts — where the grabbable things are, and what a
 * drag on one MEANS.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. That is the point of the file: hit-testing and the
 * model edit a drag produces are both node-verifiable, so
 * `scripts/verify-graphs.mjs` can assert "a pointer at this pixel sets this
 * velocity" without a browser. A drag whose arithmetic lives inside a component
 * can only be checked by hand, and hand-checking is how the "handles shrink as
 * the axes rescale" class of bug survives a type check.
 *
 * ── TWO RULES THIS FILE EXISTS TO ENFORCE ───────────────────────────────────
 * 1. HANDLE SIZES ARE IN SCREEN PIXELS, NEVER IN DATA UNITS. The viewBox is the
 *    measured CSS pixel box, so a radius of 9 here is 9 px to the finger at
 *    every zoom level and on every axis range. A handle sized in m/s would
 *    silently shrink to a pinprick the moment an archetype used a 60 m/s range.
 * 2. RENDERING AND HIT-TESTING READ THE SAME LIST. The component draws
 *    `handlesFor(...)` and the pointer handler hit-tests `handlesFor(...)`, so a
 *    handle that is drawn is grabbable and a handle that is grabbable is drawn.
 *    Two independent computations of "where the handle is" drift apart under
 *    exactly the resize that makes it hardest to notice.
 */

import type { Stack, Panel, PanelKey } from './plot';
import { sxT, syP, utT, uyP, innerW } from './plot';
import type { DriverAxis } from '../types';
import {
  type VtModel, segCount, segAccel, nodePositions, vAt, xAt,
  setNodeV, setSegAccel, paintNodes, clampNum,
} from './kinematics';

export type HandleKind = 'v-node' | 'a-bar' | 'x-tangent';

export interface Handle {
  kind: HandleKind;
  /** Node index for `v-node` / `x-tangent`; segment index for `a-bar`. */
  index: number;
  panel: PanelKey;
  /** Centre, viewBox px. */
  cx: number;
  cy: number;
  /** Drawn radius, viewBox px = CSS px. */
  r: number;
  /** For `x-tangent`: the stub's other end, so the handle hangs off a line. */
  stub?: { x: number; y: number };
  /** Which side of the node the tangent stub points, +1 right, −1 left. */
  side?: 1 | -1;
}

/** A finger-sized grab radius, in CSS px. Apple HIG asks for 44 px of target;
 *  a 26 px radius is a 52 px circle, and the nearest-handle rule below stops
 *  overlapping circles from becoming ambiguous. */
export const GRAB_PX = 26;

/** How far along the tangent the x-mode handle sits, in CSS px. Long enough to
 *  read the line's direction, short enough to stay inside the panel. */
const STUB_PX = 40;

/** px per second, shared by every panel. */
export const pxPerT = (s: Stack): number => innerW(s) / Math.max(1e-12, s.tMax - s.tMin);

/** px per data unit, for one panel. */
export const pxPerY = (p: Panel): number => p.h / Math.max(1e-12, p.yMax - p.yMin);

/**
 * A data slope, in px/px, on the x–t panel.
 *
 * Negative because SVG y grows downward: a positive velocity draws a line going
 * UP the screen. Forgetting this flip is how a tangent ends up mirrored and the
 * sim quietly claims a body moving forwards is moving back.
 */
export const slopeToPixels = (s: Stack, p: Panel, dataSlope: number): number =>
  -(dataSlope * pxPerY(p)) / Math.max(1e-12, pxPerT(s));

/** The inverse: a dragged pixel direction back to m/s. */
export const pixelsToSlope = (s: Stack, p: Panel, dx: number, dy: number): number => {
  if (Math.abs(dx) < 1e-6) return 0;
  return (-(dy / dx) * pxPerT(s)) / Math.max(1e-12, pxPerY(p));
};

const panelOf = (s: Stack, key: PanelKey): Panel | undefined =>
  s.panels.find((p) => p.key === key);

/**
 * Every grabbable point for the current driver.
 *
 * Only ONE panel is editable at a time, deliberately. Three simultaneously
 * draggable panels would let a student change x and v inconsistently, and the
 * sim's whole claim is that they cannot be inconsistent — there is one dataset.
 * Which panel is live is a visible, explicit choice.
 */
export function handlesFor(s: Stack, m: VtModel, driver: DriverAxis | null): Handle[] {
  if (!driver) return [];
  const out: Handle[] = [];

  if (driver === 'v') {
    const p = panelOf(s, 'v');
    if (!p) return out;
    // Radius follows the node spacing so a 20-handle sketch does not draw
    // twenty overlapping blobs, with a floor that keeps it visible.
    const spacing = innerW(s) / Math.max(1, m.ts.length - 1);
    const r = clampNum(spacing * 0.32, 4.5, 9);
    for (let i = 0; i < m.ts.length; i++) {
      out.push({ kind: 'v-node', index: i, panel: 'v', cx: sxT(s, m.ts[i]), cy: syP(p, m.vs[i]), r });
    }
    return out;
  }

  if (driver === 'a') {
    const p = panelOf(s, 'a');
    if (!p) return out;
    for (let i = 0; i < segCount(m); i++) {
      const a = segAccel(m, i);
      const mid = (m.ts[i] + m.ts[i + 1]) / 2;
      out.push({ kind: 'a-bar', index: i, panel: 'a', cx: sxT(s, mid), cy: syP(p, a), r: 9 });
    }
    return out;
  }

  // x-mode: the tangent stubs. Node dragging on x–t was rejected — see
  // `setTangentSlope`'s comment in kinematics.ts.
  const p = panelOf(s, 'x');
  if (!p) return out;
  const nodes = nodePositions(m);
  for (let i = 0; i < m.ts.length; i++) {
    const cxNode = sxT(s, m.ts[i]);
    const cyNode = syP(p, nodes[i]);
    // Point the stub into whichever side has room, so the last node's handle
    // does not sit outside the plot where it cannot be grabbed.
    const side: 1 | -1 = cxNode + STUB_PX > s.w - s.pad.r ? -1 : 1;
    const sl = slopeToPixels(s, p, m.vs[i]);
    const len = Math.hypot(1, sl);
    const ux = (side * 1) / len;
    const uy = (side * sl) / len;
    out.push({
      kind: 'x-tangent',
      index: i,
      panel: 'x',
      cx: cxNode + ux * STUB_PX,
      cy: cyNode + uy * STUB_PX,
      r: 8.5,
      stub: { x: cxNode, y: cyNode },
      side,
    });
  }
  return out;
}

/**
 * The NEAREST handle within `radius`, or null.
 *
 * Nearest rather than first-within: at twenty sketch handles on a phone the grab
 * circles overlap, and "first in the array" would make the leftmost handle
 * capture every drag in its neighbourhood.
 */
export function hitTest(handles: Handle[], px: number, py: number, radius = GRAB_PX): Handle | null {
  let best: Handle | null = null;
  let bestD = radius;
  for (const h of handles) {
    const d = Math.hypot(px - h.cx, py - h.cy);
    if (d <= bestD) { bestD = d; best = h; }
  }
  return best;
}

// ── Applying a drag ──────────────────────────────────────────────────────────

export interface DragLimits {
  /** m/s — the velocity range a student may drag into. */
  vMin: number;
  vMax: number;
  /** m/s² */
  aMin: number;
  aMax: number;
}

export const DEFAULT_LIMITS: DragLimits = { vMin: -30, vMax: 30, aMin: -12, aMax: 12 };

/**
 * Apply a pointer position to the model, for the handle being dragged.
 *
 * Pure and total: every branch returns a valid model, so a pointer that strays
 * outside the panel clamps rather than producing a NaN that would blank the
 * whole canvas. The clamp is on the DATA value, which is why the limits are in
 * m/s rather than in pixels — a pixel clamp would change meaning with the axis
 * range.
 */
export function applyDrag(
  m: VtModel,
  h: Handle,
  s: Stack,
  px: number,
  py: number,
  limits: DragLimits = DEFAULT_LIMITS
): VtModel {
  const p = panelOf(s, h.panel);
  if (!p) return m;

  if (h.kind === 'v-node') {
    return setNodeV(m, h.index, clampNum(uyP(p, py), limits.vMin, limits.vMax));
  }

  if (h.kind === 'a-bar') {
    return setSegAccel(m, h.index, clampNum(uyP(p, py), limits.aMin, limits.aMax));
  }

  // x-tangent: the pointer's offset from the NODE gives the tangent direction,
  // and that direction is the velocity. Reading the offset from the node rather
  // than tracking the handle means the gesture works even if the finger
  // overshoots the stub's length, which it always does.
  const nodes = nodePositions(m);
  const nodeX = sxT(s, m.ts[h.index]);
  const nodeY = syP(p, nodes[h.index]);
  const side = h.side ?? 1;
  let dx = (px - nodeX) * side;
  const dy = (py - nodeY) * side;
  // A vertical drag has no defined slope. Hold a minimum horizontal reach so the
  // gesture degrades to "very steep" instead of snapping to zero or to Infinity.
  if (dx < 6) dx = 6;
  return setNodeV(m, h.index, clampNum(pixelsToSlope(s, p, dx, dy), limits.vMin, limits.vMax));
}

/**
 * The freehand sweep: paint every node between the previous pointer position and
 * this one.
 *
 * Painting a RANGE rather than the nearest node is what makes a fast drag leave
 * a straight ramp instead of three flat steps — at 60 Hz a finger crossing the
 * panel in a third of a second lands on maybe eight of twelve handles, and the
 * four it skipped would be left behind as spikes.
 */
export function applySketch(
  m: VtModel,
  s: Stack,
  from: { x: number; y: number } | null,
  to: { x: number; y: number },
  limits: DragLimits = DEFAULT_LIMITS
): VtModel {
  const p = panelOf(s, 'v');
  if (!p) return m;
  const toT = utT(s, to.x);
  const toV = clampNum(uyP(p, to.y), limits.vMin, limits.vMax);
  if (!from) {
    // A tap: move only the nearest node, so a stray tap cannot flatten a phase.
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < m.ts.length; i++) {
      const d = Math.abs(sxT(s, m.ts[i]) - to.x);
      if (d < bestD) { bestD = d; best = i; }
    }
    return setNodeV(m, best, toV);
  }
  const fromT = utT(s, from.x);
  const fromV = clampNum(uyP(p, from.y), limits.vMin, limits.vMax);
  return paintNodes(m, fromT, fromV, toT, toV);
}

// ── Marker dragging (the chord's two ends) ───────────────────────────────────

/** The two chord markers, as viewBox points on the x–t panel. */
export function markerPoints(s: Stack, m: VtModel, tA: number, tB: number): { a: Handle; b: Handle } | null {
  const p = panelOf(s, 'x');
  if (!p) return null;
  return {
    a: { kind: 'v-node', index: -1, panel: 'x', cx: sxT(s, tA), cy: syP(p, xAt(m, tA)), r: 8 },
    b: { kind: 'v-node', index: -2, panel: 'x', cx: sxT(s, tB), cy: syP(p, xAt(m, tB)), r: 8 },
  };
}

/** Where a marker drag lands, in seconds, clamped to the run. */
export const markerTimeAt = (s: Stack, px: number): number =>
  clampNum(utT(s, px), s.tMin, s.tMax);

/** The slope the tangent should be drawn at, for a given instant. Re-exported so
 *  the component never re-derives it from the drawing. */
export const tangentAt = (m: VtModel, t: number): number => vAt(m, t);
