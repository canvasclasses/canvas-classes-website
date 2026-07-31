/*
 * energy/lib/ledger.ts — the energy ledger: KE, PE and HEAT along a track.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Node-verifiable, no React.
 *
 * ── THE ONE IDEA THIS FILE EXISTS FOR ────────────────────────────────────────
 * Friction does not "lose" energy. It MOVES it into a third account. The ledger
 * below is written so that the sum
 *
 *      KE(s) + PE(s) + heat(s)
 *
 * is a compile-time constant of the construction, not a number that happens to
 * come out nearly right after an integration. A student watching the heat bar
 * grow by exactly the shortfall is being shown an identity, and the code has to
 * be an identity too, or the claim is a coincidence.
 *
 * ── THE FRICTION MODEL, STATED HONESTLY ──────────────────────────────────────
 * On each straight ramp the normal force is taken as N = mg·cos θ — the standard
 * Class-11 flat-segment result, with NO centripetal correction at the joins
 * between ramps. That is a real modelling choice and it has a beautiful
 * consequence the sim teaches directly:
 *
 *      heat over a ramp = μ·mg·cos θ · L = μ·mg·Δx
 *
 * The heat depends only on the HORIZONTAL RUN, not on how steep the ramp was.
 * On a flat track Δx = L and the whole thing collapses to the familiar μmgd.
 *
 * ── WHAT IS DELIBERATELY OUT OF SCOPE ────────────────────────────────────────
 * One forward pass only. If the body stops on a slope steeper than the friction
 * angle it would slide back; `stalledOnSlope` reports that so the UI can SAY so
 * rather than quietly drawing a body parked on a hill it could not stay on.
 */

import type { TrackPoint, Segment } from './track';
import { segmentsOf, normaliseTrack } from './track';

export interface LedgerOptions {
  /** kg */
  mass: number;
  /** m/s², default 9.8 */
  g?: number;
  /** Coefficient of kinetic friction along the whole track. 0 = smooth. */
  mu?: number;
  /** Launch speed at s = 0, m/s. */
  v0?: number;
  /** Height that counts as PE = 0. Defaults to the LOWEST point of the track,
   *  so PE is never drawn negative — a negative bar in a stacked chart is a
   *  rendering problem masquerading as a physics one. */
  yRef?: number;
}

export interface LedgerSample {
  /** Arc length from the start, m. */
  s: number;
  x: number;
  y: number;
  /** Speed, m/s. Zero once the body has stopped. */
  v: number;
  /** Joules. */
  ke: number;
  pe: number;
  heat: number;
  /** ke + pe + heat. Constant along the whole run, by construction. */
  total: number;
}

export interface LedgerRun {
  samples: LedgerSample[];
  /** Did friction bring it to rest before the end of the track? */
  stopped: boolean;
  /** Arc length where the run ends — the stop point, or the track's end. */
  endS: number;
  /** The conserved total, J. */
  total: number;
  /** Total heat generated over the run, J. */
  heat: number;
  /** Seconds from release to `endS`. */
  duration: number;
  /** True when it stopped on a ramp steeper than the friction angle, i.e. it
   *  would not actually stay there. The UI must say so. */
  stalledOnSlope: boolean;
  /** Largest |total − total(0)| across the samples. The conservation proof. */
  drift: number;
}

const G_DEFAULT = 9.8;

/** The lowest point of a track — the natural PE zero. */
export function lowestY(points: TrackPoint[]): number {
  const pts = normaliseTrack(points);
  return pts.length ? Math.min(...pts.map((p) => p.y)) : 0;
}

/**
 * Deceleration coefficient along a ramp: dKE/du = −m·g·(sin θ + μ·cos θ).
 * Positive means the body is losing kinetic energy along that ramp.
 */
export function keSlope(seg: Segment, o: LedgerOptions): number {
  const g = o.g ?? G_DEFAULT;
  const mu = o.mu ?? 0;
  return o.mass * g * (seg.sin + mu * seg.cos);
}

/** Signed acceleration along +s on a ramp, m/s². */
export function accelOn(seg: Segment, o: LedgerOptions): number {
  const g = o.g ?? G_DEFAULT;
  const mu = o.mu ?? 0;
  return -g * (seg.sin + mu * seg.cos);
}

/**
 * The exact state at arc length `s`.
 *
 * KE is carried forward analytically ramp by ramp; PE and heat are then read
 * straight off the geometry, and `total` is their sum — which is why it cannot
 * drift. Returns the STOP state (v = 0) for any s past where the body halted.
 */
export function stateAtS(points: TrackPoint[], o: LedgerOptions, s: number): LedgerSample | null {
  const segs = segmentsOf(points);
  if (!segs.length) return null;
  const g = o.g ?? G_DEFAULT;
  const mu = o.mu ?? 0;
  const yRef = o.yRef ?? lowestY(points);
  const v0 = o.v0 ?? 0;

  const total = 0.5 * o.mass * v0 * v0 + o.mass * g * (segs[0].from.y - yRef);
  let ke = 0.5 * o.mass * v0 * v0;
  let heat = 0;
  const target = Math.max(0, s);

  /** One sample, with PE read off the geometry so the three always add to
   *  `total` by construction rather than by arithmetic that could drift. */
  const at = (sAt: number, x: number, y: number, keAt: number, heatAt: number): LedgerSample => ({
    s: sAt, x, y,
    v: Math.sqrt(Math.max(0, (2 * keAt) / o.mass)),
    ke: keAt,
    pe: o.mass * g * (y - yRef),
    heat: heatAt,
    total,
  });

  for (const seg of segs) {
    // AT OR BEFORE this ramp's start. This branch is the whole reason the loop
    // is written this way: the first version began with
    // `uMax = clamp(target − s0); if (uMax <= 0) break;`, which at s = 0 broke
    // out on the FIRST ramp and fell through to the end-of-track return — so
    // sample 0 of every run reported the block already at the bottom, and the
    // conservation drift came out as the entire total. Caught by the verifier,
    // invisible to tsc.
    if (target <= seg.s0 + 1e-12) return at(seg.s0, seg.from.x, seg.from.y, ke, heat);

    const uMax = Math.min(target - seg.s0, seg.len);
    const c = keSlope(seg, o);
    const uStop = c > 0 ? ke / c : Infinity;
    const u = Math.min(uMax, uStop);
    const x = seg.from.x + seg.cos * u;
    const y = seg.from.y + seg.sin * u;
    const heatHere = heat + mu * o.mass * g * seg.cos * u;

    // Stopped part-way along this ramp: everything it had is now heat and PE.
    if (u < uMax - 1e-12) return at(seg.s0 + u, x, y, 0, heatHere);

    ke = Math.max(0, ke - c * u);
    heat = heatHere;
    if (target <= seg.s0 + seg.len + 1e-12) return at(seg.s0 + u, x, y, ke, heat);
  }

  const last = segs[segs.length - 1];
  return at(last.s0 + last.len, last.to.x, last.to.y, ke, heat);
}

/** Where the body comes to rest, or the end of the track. */
export function stopArcLength(points: TrackPoint[], o: LedgerOptions): { s: number; stopped: boolean } {
  const segs = segmentsOf(points);
  if (!segs.length) return { s: 0, stopped: true };
  let ke = 0.5 * o.mass * (o.v0 ?? 0) * (o.v0 ?? 0);
  for (const seg of segs) {
    // A downhill ramp has c < 0, so ke grows and it can never stop there.
    const c = keSlope(seg, o);
    if (c > 0 && ke < c * seg.len) return { s: seg.s0 + ke / c, stopped: true };
    ke -= c * seg.len;
  }
  const last = segs[segs.length - 1];
  return { s: last.s0 + last.len, stopped: false };
}

/**
 * Seconds to travel from s = 0 to `s`.
 *
 * Acceleration is constant on each ramp, so this is exact: per ramp, solve
 * u = v·t + ½·a·t² for t. Not an integration — the animation clock and the
 * ledger therefore cannot drift apart, which is the same guarantee the
 * projectile split-screen relies on.
 */
export function timeToS(points: TrackPoint[], o: LedgerOptions, s: number): number {
  const segs = segmentsOf(points);
  if (!segs.length) return 0;
  let t = 0;
  for (const seg of segs) {
    const uMax = Math.min(Math.max(s - seg.s0, 0), seg.len);
    if (uMax <= 0) break;
    const entry = stateAtS(points, o, seg.s0);
    const v = entry?.v ?? 0;
    const a = accelOn(seg, o);
    if (v <= 1e-9 && a <= 0) return t;              // stationary and staying so
    const dt = Math.abs(a) < 1e-9
      ? uMax / Math.max(v, 1e-9)
      : (-v + Math.sqrt(Math.max(0, v * v + 2 * a * uMax))) / a;
    t += Number.isFinite(dt) && dt > 0 ? dt : 0;
    if (uMax < seg.len - 1e-12) break;
  }
  return t;
}

/** Arc length reached at time `t` — the inverse of `timeToS`, by bisection on a
 *  monotone function (s only ever increases). */
export function sAtTime(points: TrackPoint[], o: LedgerOptions, t: number, endS: number): number {
  if (t <= 0) return 0;
  let lo = 0;
  let hi = endS;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (timeToS(points, o, mid) < t) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** The whole run, sampled evenly in arc length. */
export function runTrack(points: TrackPoint[], o: LedgerOptions, n = 160): LedgerRun {
  const segs = segmentsOf(points);
  if (!segs.length) {
    return {
      samples: [], stopped: true, endS: 0, total: 0, heat: 0,
      duration: 0, stalledOnSlope: false, drift: 0,
    };
  }
  const { s: endS, stopped } = stopArcLength(points, o);
  const samples: LedgerSample[] = [];
  for (let i = 0; i <= n; i++) {
    const st = stateAtS(points, o, (endS * i) / n);
    if (st) samples.push(st);
  }
  const total = samples.length ? samples[0].total : 0;
  let drift = 0;
  for (const sm of samples) drift = Math.max(drift, Math.abs(sm.ke + sm.pe + sm.heat - total));

  const endPose = samples[samples.length - 1];
  const seg = segs.find((g) => endS <= g.s0 + g.len + 1e-9) ?? segs[segs.length - 1];
  const mu = o.mu ?? 0;
  const stalledOnSlope = stopped && Math.abs(seg.sin) > mu * seg.cos + 1e-9;

  return {
    samples, stopped, endS, total,
    heat: endPose ? endPose.heat : 0,
    duration: timeToS(points, o, endS),
    stalledOnSlope, drift,
  };
}

/**
 * Heat generated over a horizontal run, J — μ·m·g·Δx.
 *
 * Exposed on its own because it is the claim the sim makes out loud, and a
 * claim the sim makes out loud is a claim the verifier has to be able to call
 * directly rather than infer from a sampled run.
 */
export function frictionHeat(o: LedgerOptions, horizontalRun: number): number {
  return (o.mu ?? 0) * o.mass * (o.g ?? G_DEFAULT) * horizontalRun;
}
