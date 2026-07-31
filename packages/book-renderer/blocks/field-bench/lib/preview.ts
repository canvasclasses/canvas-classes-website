/*
 * field-bench/lib/preview.ts — the timescale, and what the camera must contain.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ⚠ THE COMPONENT AND THE VERIFIER MUST FRAME THE SAME PICTURE. `FieldLab`
 * calls `previewPaths` to decide what the camera has to hold, and
 * `verify-field-bench.mjs` calls the SAME function to measure how much of the
 * board the picture fills. If the two computed their own extents, the fill
 * check would be measuring a diagram nobody ever sees — which is how a
 * "verified" layout ends up cropped in production.
 *
 * ── Why the timescale is derived, never hardcoded ───────────────────────────
 * The archetypes span fourteen orders of magnitude in time: a bead in a 2 T
 * field circles in ~3 s, a satellite in ~97 min. One hardcoded `dt` would
 * either take 40 000 steps to move a satellite a pixel or step a bead clean
 * through its own orbit. So each scene states its own natural period and the
 * step is a fixed fraction of it — which also fixes the integration accuracy at
 * a constant ~2000 steps per orbit whatever the archetype, and that is what
 * lets the verifier demand |v| constant to 1e-9 without tuning per scene.
 */

import type { FieldScene, TestCharge, Vec2 } from '../types';
import type { Trajectory } from '../../motion-lab/types';
import { G_NEWTON } from './constants';
import { sampleE, sampleBz, sampleG, hasMagnetic } from './field';
import { traceCharge, cyclotronPeriod, type TraceOptions } from './trace';

/** Steps per natural period. 2000 puts RK4's speed drift around 1e-14. */
export const STEPS_PER_PERIOD = 2000;

/** How many natural periods a preview path runs for. */
export const PREVIEW_PERIODS = 2;

/**
 * The natural time for a scene, seconds.
 *
 *   magnetic  → the cyclotron period 2πm/(qB), exactly
 *   gravity   → the Kepler period 2π√(r³/GM) of the launch radius
 *   electric  → the time to fall the scene's own size under the starting
 *               acceleration, √(2L/a) — the projectile answer, reused
 */
export function naturalPeriod(scene: FieldScene, tc: TestCharge): number {
  if (hasMagnetic(scene.sources)) {
    const bz = sampleBz(scene.sources, tc.pos);
    if (bz !== 0 && tc.charge !== 0) return cyclotronPeriod(tc.mass, tc.charge, bz);
  }

  if (scene.kind === 'gravitational') {
    const planet = scene.sources.find((s) => s.kind === 'point-mass');
    if (planet) {
      const r = Math.hypot(tc.pos.x - planet.pos.x, tc.pos.y - planet.pos.y);
      if (r > 0) return 2 * Math.PI * Math.sqrt((r * r * r) / (G_NEWTON * planet.strength));
    }
  }

  const e = sampleE(scene.sources, tc.pos).field;
  const g = sampleG(scene.sources, tc.pos).field;
  const a = scene.kind === 'gravitational'
    ? Math.hypot(g.x, g.y)
    : (Math.abs(tc.charge) / Math.max(tc.mass, 1e-30)) * Math.hypot(e.x, e.y);

  const L = sceneSpan(scene);
  if (a > 0) return Math.sqrt((2 * L) / a);
  const v = Math.hypot(tc.vel?.x ?? 0, tc.vel?.y ?? 0);
  return v > 0 ? L / v : 1;
}

/** A characteristic size for the scene, metres — the largest separation among
 *  the things it contains, never zero. */
export function sceneSpan(scene: FieldScene): number {
  const pts: Vec2[] = [
    ...scene.sources.map((s) => s.pos),
    ...(scene.testCharges ?? []).map((t) => t.pos),
    ...(scene.surfaces ?? []).map((g) => g.centre),
  ];
  let span = 0;
  for (const s of scene.sources) span = Math.max(span, (s.radius ?? 0) * 2);
  for (const g of scene.surfaces ?? []) {
    span = Math.max(span, (g.radius ?? 0) * 2, g.size?.w ?? 0, g.size?.h ?? 0);
  }
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      span = Math.max(span, Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y));
    }
  }
  return span > 0 ? span : 1;
}

/** Integration settings for one test charge in one scene. */
export function traceOptionsFor(scene: FieldScene, tc: TestCharge, periods = PREVIEW_PERIODS): TraceOptions {
  const T = naturalPeriod(scene, tc);
  const L = sceneSpan(scene);
  const centre = scene.sources[0]?.pos ?? { x: 0, y: 0 };
  const reach = Math.max(L * 3, Math.hypot(tc.pos.x - centre.x, tc.pos.y - centre.y) * 3);
  return {
    dt: T / STEPS_PER_PERIOD,
    maxSteps: Math.round(STEPS_PER_PERIOD * periods),
    bounds: {
      minX: centre.x - reach, maxX: centre.x + reach,
      minY: centre.y - reach, maxY: centre.y + reach,
    },
    // A charge that reaches a source has arrived; without this the integrator
    // whips it through the singularity at absurd speed and draws a spike.
    captureRadius: L * 0.02,
  };
}

export interface PreviewPath {
  id: string;
  charge: number;
  trajectory: Trajectory;
  points: Vec2[];
}

/** Integrated paths for every test charge in a trajectory-mode scene. */
export function previewPaths(scene: FieldScene, mode: string): PreviewPath[] {
  if (mode !== 'trajectory') return [];
  return (scene.testCharges ?? []).map((tc) => {
    const tr = traceCharge(scene, tc, traceOptionsFor(scene, tc));
    return { id: tc.id, charge: tc.charge, trajectory: tr, points: tr.points.map((p) => p.pos) };
  });
}

/** Every point the camera must contain beyond the scene's own objects. */
export const previewExtras = (scene: FieldScene, mode: string): Vec2[] =>
  previewPaths(scene, mode).flatMap((p) => p.points);
