/*
 * field-bench/lib/lines.ts — field lines.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ⚠ THIS FILE DELIBERATELY DOES NOT USE motion-lab's `integrate`.
 *
 * That is not an oversight, it is the entire pedagogical point of the E5
 * engine. A test-charge TRAJECTORY solves
 *
 *        dv/dt = qE/m ,   dr/dt = v          ← second order, in TIME
 *
 * and is integrated by `trace.ts` with motion-lab's RK4, because a charge in a
 * field is the same physics as a projectile. A FIELD LINE solves
 *
 *        dr/ds = Ê(r)                        ← first order, in ARC LENGTH
 *
 * a completely different ODE with no velocity in it at all. Feeding the field
 * direction to the motion integrator would produce a curve that looks like a
 * path and is not one — which is precisely the `field_lines_are_paths`
 * misconception, committed in code. Two ODEs, two steppers, and the difference
 * between them IS the lesson.
 *
 * The stepper below is classical RK4 on the unit direction field, so a line
 * traced through a smooth region is accurate to O(h⁴) and closes on a sink
 * cleanly instead of spiralling.
 */

import type { FieldLine, FieldScene, FieldSource, Vec2 } from '../types';
import type { Bounds } from '../../mechanics-bench/lib/svg';
import { fieldDirection } from './field';
import { isElectricKind, isGravityKind } from './sources';

export interface LineOptions {
  /** Arc-length step, metres. */
  step: number;
  maxSteps: number;
  bounds: Bounds;
  /** A line that gets this close to an opposite-sign source has terminated. */
  sinkRadius: number;
}

const inBounds = (p: Vec2, b: Bounds): boolean =>
  p.x >= b.minX && p.x <= b.maxX && p.y >= b.minY && p.y <= b.maxY;

/**
 * Trace ONE field line from `start`.
 *
 * `direction` is +1 to walk along the field (what you do from a positive
 * charge) and −1 to walk against it (what you do from a negative one, so the
 * stored points still run source → sink and the arrowheads all point the same
 * way along the drawn line).
 */
export function traceFieldLine(
  scene: FieldScene,
  start: Vec2,
  direction: 1 | -1,
  opts: LineOptions,
  fromSourceId?: string,
): FieldLine {
  const { step, maxSteps, bounds, sinkRadius } = opts;
  const points: Vec2[] = [start];
  let p = start;
  let end: FieldLine['end'] = 'max-steps';

  const u = (q: Vec2): Vec2 | null => {
    const d = fieldDirection(scene, q);
    return d ? { x: d.x * direction, y: d.y * direction } : null;
  };

  for (let i = 0; i < maxSteps; i++) {
    const k1 = u(p);
    if (!k1) { end = 'max-steps'; break; }                     // a null point
    const k2 = u({ x: p.x + (step / 2) * k1.x, y: p.y + (step / 2) * k1.y });
    if (!k2) { end = 'max-steps'; break; }
    const k3 = u({ x: p.x + (step / 2) * k2.x, y: p.y + (step / 2) * k2.y });
    if (!k3) { end = 'max-steps'; break; }
    const k4 = u({ x: p.x + step * k3.x, y: p.y + step * k3.y });
    if (!k4) { end = 'max-steps'; break; }

    const next: Vec2 = {
      x: p.x + (step / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
      y: p.y + (step / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
    };
    if (!Number.isFinite(next.x) || !Number.isFinite(next.y)) break;

    points.push(next);
    p = next;

    if (!inBounds(p, bounds)) { end = 'escaped'; break; }

    const sink = nearestSink(scene.sources, p, direction, sinkRadius);
    if (sink) { points.push(sink.pos); end = 'sink'; break; }
  }

  return fromSourceId ? { points, fromSourceId, end } : { points, end };
}

/** The opposite-signed source a line is about to land on, if any. */
function nearestSink(sources: FieldSource[], p: Vec2, direction: 1 | -1, radius: number): FieldSource | null {
  for (const s of sources) {
    if (!isElectricKind(s.kind) && !isGravityKind(s.kind)) continue;
    if (s.kind === 'uniform-E' || s.kind === 'sheet-charge') continue;
    // Walking WITH the field (+1) ends on a negative charge; walking against it
    // ends on a positive one. Gravity has only sinks, so any mass terminates.
    const terminates = isGravityKind(s.kind) || (direction > 0 ? s.strength < 0 : s.strength > 0);
    if (!terminates) continue;
    if (Math.hypot(p.x - s.pos.x, p.y - s.pos.y) <= radius) return s;
  }
  return null;
}

export interface SeedOptions extends LineOptions {
  /** Lines drawn for the weakest non-zero source; stronger ones get more, in
   *  proportion to |strength| — which is what makes "line density ∝ field
   *  strength" true on screen rather than merely asserted in the caption. */
  linesPerUnit: number;
  maxLines: number;
  /** Seed ring radius as a fraction of the scene's short side. */
  seedFrac: number;
}

export const DEFAULT_SEEDS: Omit<SeedOptions, 'bounds' | 'step' | 'sinkRadius'> = {
  maxSteps: 900,
  linesPerUnit: 12,
  maxLines: 220,
  seedFrac: 0.02,
};

/**
 * Every field line for a scene.
 *
 * Point-like sources get a ring of seeds; a `uniform-E` with no point sources
 * gets a rake of parallel lines across the box, because a uniform field has no
 * source on screen to start from and drawing nothing would suggest — wrongly —
 * that there is no field there.
 */
export function buildFieldLines(scene: FieldScene, opts: SeedOptions): FieldLine[] {
  if (scene.kind === 'magnetic') return [];   // out-of-page B has no in-plane line

  const lines: FieldLine[] = [];
  const span = Math.min(opts.bounds.maxX - opts.bounds.minX, opts.bounds.maxY - opts.bounds.minY);
  const seedR = Math.max(span * opts.seedFrac, opts.step);

  const pointy = scene.sources.filter(
    (s) => (isElectricKind(s.kind) || isGravityKind(s.kind))
      && s.kind !== 'uniform-E' && s.kind !== 'sheet-charge' && s.strength !== 0,
  );

  const weakest = pointy.reduce((m, s) => Math.min(m, Math.abs(s.strength)), Infinity);

  for (const s of pointy) {
    const ratio = Number.isFinite(weakest) && weakest > 0 ? Math.abs(s.strength) / weakest : 1;
    const n = Math.max(4, Math.min(28, Math.round(opts.linesPerUnit * ratio)));
    // Negative sources are SINKS: their lines are the ones arriving, already
    // drawn by the positive sources. Seeding them too would double the count on
    // a dipole and quietly break the density-∝-strength claim. They are only
    // seeded when there is no positive source anywhere to start from.
    const outward = isGravityKind(s.kind) ? false : s.strength > 0;
    const anyPositive = pointy.some((q) => !isGravityKind(q.kind) && q.strength > 0);
    if (!outward && anyPositive) continue;

    const dir: 1 | -1 = outward ? 1 : -1;
    // A source with a body — a charged shell, a planet — is seeded just OUTSIDE
    // its own surface. Seeding at the default tiny radius would start the lines
    // at the centre of the Earth and draw them out through the rock, which is a
    // picture of nothing: the interior field is real but it is not what a field
    // -line diagram of a planet is showing.
    const body = s.radius ?? 0;
    const r = body > seedR ? body * 1.02 : seedR;

    for (let i = 0; i < n && lines.length < opts.maxLines; i++) {
      const a = (2 * Math.PI * (i + 0.5)) / n;
      const start = { x: s.pos.x + r * Math.cos(a), y: s.pos.y + r * Math.sin(a) };
      const line = traceFieldLine(scene, start, dir, opts, s.id);
      if (line.points.length > 2) lines.push(line);
    }
  }

  if (!pointy.length) {
    const uni = scene.sources.find((s) => s.kind === 'uniform-E' && s.strength !== 0);
    if (uni) {
      const b = opts.bounds;
      const n = 9;
      for (let i = 0; i < n; i++) {
        const f = (i + 0.5) / n;
        // Rake perpendicular to the field, started at the upwind edge.
        const a = ((uni.angleDeg ?? 0) * Math.PI) / 180;
        const cx = (b.minX + b.maxX) / 2;
        const cy = (b.minY + b.maxY) / 2;
        const half = Math.hypot(b.maxX - b.minX, b.maxY - b.minY) / 2;
        const px = -Math.sin(a);
        const py = Math.cos(a);
        const off = (f - 0.5) * 2 * half * 0.8;
        const start = {
          x: cx + px * off - Math.cos(a) * half,
          y: cy + py * off - Math.sin(a) * half,
        };
        const line = traceFieldLine(scene, start, uni.strength > 0 ? 1 : -1, opts, uni.id);
        if (line.points.length > 2) lines.push(line);
      }
    }
  }

  return lines;
}
