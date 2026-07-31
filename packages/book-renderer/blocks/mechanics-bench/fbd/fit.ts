/*
 * fbd/fit.ts — the pure camera math: what a board draws, and how big it is.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE, and in a .ts rather than canvas.tsx for a specific reason: Node strips
 * TypeScript types natively but does NOT transform JSX, so anything a verifier
 * needs to execute has to live outside a .tsx. `scripts/verify-fbd-fill.mjs`
 * imports this module to MEASURE every archetype's canvas fill instead of
 * eyeballing it — the same "verifiable outside React" rule
 * PHYSICS_SIMULATION_PROGRAM.md §9 applies to the physics, applied to layout.
 *
 * ⚠ ONE SCALE FOR BOTH AXES, ALWAYS. `fitView` never fits x and y
 *   independently: a stretched axis would make a 30° incline look like 60° and
 *   silently contradict the readout next to it. That is a correctness
 *   constraint, not a style choice.
 */

import type { Scene, Vec2 } from '../types';
import { WORLD } from '../types';
import { boundsOf, unionBounds, fitView } from '../lib/svg';
import type { Bounds } from '../lib/svg';
import { sceneBounds, DEG } from './sceneEdit';

// ── The responsive decision ──────────────────────────────────────────────────

/** Below this CONTAINER width the board stacks above the panels. Deliberately
 *  not a viewport breakpoint: this block also renders inside the admin editor's
 *  narrow split-pane preview, where the viewport is wide and the block is not. */
export const NARROW_PX = 640;

/**
 * Is this stage narrow enough to stack? Pure, so it can be executed rather than
 * read — `scripts/verify-fbd-fill.mjs` asserts the 375px stage against it.
 *
 * ⚠ AN UNMEASURED STAGE (width 0) IS NARROW. The first version wrote
 * `w > 0 && w < NARROW_PX`, which quietly means "a stage I have not measured
 * yet is a DESKTOP" — so any path that left the width at 0 (a detached node, a
 * dropped ResizeObserver notification, a measurement that lands after the first
 * paint) rendered two columns on a phone and stayed there. A 375px stage kept a
 * two-column grid and the canvas collapsed to 48% of the stage.
 *
 * Defaulting the other way is strictly safer: a stacked board on a desktop for
 * one frame is invisible, whereas a two-column board on a phone is the bug.
 */
export const isNarrowStage = (containerW: number): boolean => containerW < NARROW_PX;

/** The grid template for a stage of this width. One column when narrow. */
export const stageColumns = (containerW: number): string =>
  isNarrowStage(containerW) ? 'minmax(0, 1fr)' : 'minmax(0, 7fr) minmax(0, 5fr)';

/** The board's aspect ratio at this stage width. A free-body diagram runs
 *  VERTICALLY (weight down, normal up), so height is the generous axis. */
export const stageAspect = (containerW: number): string =>
  isNarrowStage(containerW) ? '4 / 3' : '3 / 2';

// ── Arrow lengths ────────────────────────────────────────────────────────────
// These live here rather than in theme.ts because theme.ts pulls the shared
// token module, which re-exports JSX — and a verifier that cannot import the
// arrow-length rule cannot measure whether the arrows fit. theme.ts re-exports
// all three, so there is still exactly one definition of each.

/**
 * How long a REFERENCE arrow (one whose magnitude equals the scene's heaviest
 * weight) should be, on a board of this size.
 *
 * It was a flat 95px before the boards became responsive. Two things break
 * that: on a 375px phone canvas one arrow ate a quarter of the width, and on a
 * wide short board a weight-plus-normal pair (both vertical, 95px each way) ate
 * the whole HEIGHT and squeezed the body between them to nothing. So the
 * reference tracks the SMALLER dimension — which is the axis a free-body
 * diagram actually runs along — and lands on ~94px at the desktop board size,
 * which is where it always was.
 */
export const arrowRefPx = (canvasW: number, canvasH: number): number =>
  Math.max(44, Math.min(112, Math.min(canvasW, canvasH) * 0.23));

/**
 * Newtons drawn per pixel of arrow, so `mg` renders at `refPx`. The mapping is
 * used in BOTH directions — magnitude → length when drawing, length → magnitude
 * when the student drags an arrow head — so changing `refPx` rescales the
 * picture without moving a single newton.
 */
export const nPerPx = (weightN: number, refPx = 95): number =>
  Math.max(0.02, weightN / refPx);

/** The length of a composed "push" arrow on the world canvas. Same shape as the
 *  original (24 + 2.2 N, capped at 120px), rescaled with the board. */
export const appliedArrowPx = (mag: number, refPx = 95): number =>
  (refPx / 95) * Math.min(120, 24 + mag * 2.2);

/**
 * A fixed-PIXEL spur off a world point: a force arrow, whose root is in metres
 * but whose length is in pixels (it encodes newtons via `nPerPx`).
 */
export interface Spur { at: Vec2; angleDeg: number; px: number }

/**
 * The breathing room left around the fitted content, as a fraction of the board
 * on each side. 0.12 puts the drawn content at ~76% of the board on whichever
 * axis binds — the 60–75% the design brief asks for, with enough margin left
 * that a selected arrow's 46px head handle still lands inside the board.
 *
 * Every fit in this folder shares this number. `mixedBounds` solves for a scale
 * and `useFittedView` then applies one; if the two used different padding the
 * solved fixed point would be the wrong one.
 */
export const FIT_PAD = 0.12;

/**
 * Content bounds for a diagram that mixes world geometry with pixel-length
 * arrows.
 *
 * The arrow tips depend on the scale, and the scale depends on the tips, so this
 * iterates. The map s ↦ K·s/(R·s + L) is a contraction whenever the arrows are
 * shorter than the viewport (they always are), with fixed point s = (K − L)/R,
 * so three passes land within a fraction of a percent. Doing it this way rather
 * than reserving a worst-case margin is what keeps the fill high when only two
 * short arrows are on the board.
 */
export function mixedBounds(
  world: Bounds,
  spurs: Spur[],
  w: number,
  h: number,
  headroomPx = 14,
  padFrac = FIT_PAD,
): Bounds {
  if (!spurs.length || w < 40 || h < 40) return world;
  let out = world;
  for (let pass = 0; pass < 3; pass++) {
    const v = fitView(out, w, h, { padFrac, quantise: false, maxScale: 4000, minScale: 1 });
    const tips: Vec2[] = [];
    for (const s of spurs) {
      const L = (s.px + headroomPx) / v.scale;
      tips.push({
        x: s.at.x + L * Math.cos(s.angleDeg * DEG),
        y: s.at.y + L * Math.sin(s.angleDeg * DEG),
      });
    }
    out = unionBounds(world, boundsOf(tips)) ?? world;
  }
  return out;
}

/**
 * Everything the world canvas draws, in metres: every body's outline, the ground
 * line, the ceiling line the strings hang from, and the wall. The fixtures are
 * derived from the SAME expressions `SceneView` renders them at, so the fit and
 * the drawing can never disagree about where the ceiling is.
 */
export function sceneWorldBounds(scene: Scene): Bounds {
  const b = sceneBounds(scene);
  const pts: Vec2[] = [
    { x: b.minX, y: b.minY }, { x: b.maxX, y: b.maxY },
  ];

  const used = new Set<string>();
  for (const c of scene.contacts) used.add(c.bodyB);
  for (const s of scene.strings) for (const p of s.path) used.add(p);

  if (used.has(WORLD.ground)) pts.push({ x: b.minX, y: 0 }, { x: b.maxX, y: 0 });
  if (used.has(WORLD.ceiling)) pts.push({ x: b.minX, y: b.maxY + 0.45 });
  if (used.has(WORLD.wall)) pts.push({ x: b.minX - 0.25, y: b.minY });

  return boundsOf(pts) ?? { minX: -1, minY: -1, maxX: 1, maxY: 1 };
}

/** A body's own outline in BODY-LOCAL metres, as bounds. Spheres and pulleys
 *  have no polygon, so they contribute their circle's box. */
export function localBounds(points: Vec2[], radius: number): Bounds {
  const pts = points.length
    ? points
    : [{ x: -radius, y: -radius }, { x: radius, y: radius }];
  return boundsOf(pts) ?? { minX: -radius, minY: -radius, maxX: radius, maxY: radius };
}

