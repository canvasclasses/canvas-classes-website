/*
 * motion-lab/graphs/lib/kinematics.ts — ONE dataset, three views.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM, no imports outside the engine — so
 * `scripts/verify-graphs.mjs` runs every claim below with a plain node call.
 *
 * ── THE ONE MODEL ───────────────────────────────────────────────────────────
 * The single source of truth for x–t, v–t and a–t is a PIECEWISE-LINEAR v(t)
 * given by node velocities at node times, plus a starting position. Everything
 * else is derived, exactly:
 *
 *      v(t)  piecewise LINEAR      ← the model
 *      a(t)  piecewise CONSTANT    = the slope of each v segment
 *      x(t)  piecewise QUADRATIC   = x₀ + ∫v dt
 *
 * That choice is what makes the triple view honest rather than three drawings
 * that happen to agree. Slope of x–t IS v because x was built by integrating
 * that v; area under v–t IS the displacement because the displacement was
 * computed as that area. The verifier round-trips both directions to 1e-6 and
 * the point of the round trip is that it proves the three panels are one
 * dataset.
 *
 * ── WHY IT INTEGRATES SEGMENT BY SEGMENT ────────────────────────────────────
 * `lib/integrate.ts` (RK4, frozen) is reused rather than a second integrator
 * being written — the brief is explicit about that, and RK4 is EXACT for a
 * quadratic solution, which is what a constant a gives. But RK4's four
 * acceleration samples per step land at t, t+dt/2, t+dt/2 and t+dt, so a step
 * that STRADDLES a node would average two different accelerations with Simpson
 * weights and lose the exactness. So each segment is integrated on its own with
 * a genuinely constant `AccelFn` and a dt that divides its duration exactly,
 * and the segments are chained. That is the difference between agreeing to
 * 1e-15 and agreeing to 1e-3 at a kink.
 *
 * 1-D motion is carried on the engine's x axis with y pinned at 0, so the
 * engine's `MotionState` / `Trajectory` / `sampleAt` all apply unchanged and a
 * released body could be handed between this module and the projectile module
 * without a conversion (design law #4).
 */

import { integrate } from '../../lib/integrate';
import type { AccelFn, MotionState } from '../../types';

// ── The model ────────────────────────────────────────────────────────────────

export interface VtModel {
  /** Node times, strictly increasing, seconds. At least two. */
  ts: number[];
  /** Velocity at each node, m/s. Same length as `ts`. */
  vs: number[];
  /** Position at `ts[0]`, metres. */
  x0: number;
}

/** One instant of the one dataset. Every panel and every readout reads these. */
export interface Sample {
  t: number;
  /** m */
  x: number;
  /** m/s */
  v: number;
  /** m/s² — the segment's constant value, right-handed at an interior node. */
  a: number;
  /** Index of the v-segment this sample belongs to. */
  seg: number;
}

const EPS = 1e-12;

export const clampNum = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, v));

/** Segment count. A model with n nodes has n − 1 segments. */
export const segCount = (m: VtModel): number => Math.max(0, m.ts.length - 1);

export const tStart = (m: VtModel): number => m.ts[0] ?? 0;
export const tEnd = (m: VtModel): number => m.ts[m.ts.length - 1] ?? 0;
export const duration = (m: VtModel): number => Math.max(EPS, tEnd(m) - tStart(m));

/**
 * Acceleration on segment `i` — the slope of that v segment, and therefore the
 * height of bar `i` on the a–t panel. Nothing else defines a in this module.
 */
export function segAccel(m: VtModel, i: number): number {
  const dt = m.ts[i + 1] - m.ts[i];
  if (!(dt > EPS)) return 0;
  return (m.vs[i + 1] - m.vs[i]) / dt;
}

/** Which segment contains `t`. Clamped, so a sample exactly at the end is valid. */
export function segAt(m: VtModel, t: number): number {
  const n = segCount(m);
  if (n <= 0) return 0;
  for (let i = 0; i < n; i++) {
    if (t < m.ts[i + 1] - EPS) return i;
  }
  return n - 1;
}

/** v(t) by linear interpolation between nodes — the model itself. */
export function vAt(m: VtModel, t: number): number {
  const i = segAt(m, t);
  const dt = m.ts[i + 1] - m.ts[i];
  if (!(dt > EPS)) return m.vs[i];
  const f = clampNum((t - m.ts[i]) / dt, 0, 1);
  return m.vs[i] + (m.vs[i + 1] - m.vs[i]) * f;
}

/** a(t) — piecewise constant. Right-handed at an interior node. */
export const aAt = (m: VtModel, t: number): number => segAccel(m, segAt(m, t));

/**
 * Position at each node, by cumulative trapezoid.
 *
 * The trapezoid rule is EXACT for a piecewise-linear v — ∫ over a segment of a
 * straight line is exactly the trapezoid — so this is not an approximation and
 * it is the second, independent route the verifier checks the RK4 path against.
 */
export function nodePositions(m: VtModel): number[] {
  const out = [m.x0];
  for (let i = 0; i < segCount(m); i++) {
    const dt = m.ts[i + 1] - m.ts[i];
    out.push(out[i] + 0.5 * (m.vs[i] + m.vs[i + 1]) * dt);
  }
  return out;
}

/** x(t) in closed form: x_i + v_i·τ + ½a_i·τ². Exact, no integration. */
export function xAt(m: VtModel, t: number): number {
  const nodes = nodePositions(m);
  const i = segAt(m, t);
  const tau = clampNum(t - m.ts[i], 0, m.ts[i + 1] - m.ts[i]);
  return nodes[i] + m.vs[i] * tau + 0.5 * segAccel(m, i) * tau * tau;
}

// ── The sampled dataset ──────────────────────────────────────────────────────

/**
 * Build the dense dataset by RK4-integrating each segment with the frozen
 * engine integrator, chained end to end.
 *
 * `perSeg` sub-steps per segment. 24 is plenty: the exact solution is a
 * quadratic and RK4 reproduces a quadratic exactly, so the sample count only
 * controls how smooth the drawn curve is, never how right it is. The dataset is
 * emitted as ONE array with strictly increasing t, so `sampleAt` over it is the
 * single sampler the three panels share.
 */
export function buildSamples(m: VtModel, perSeg = 24): Sample[] {
  const n = segCount(m);
  const out: Sample[] = [];
  if (n <= 0) {
    return [{ t: tStart(m), x: m.x0, v: m.vs[0] ?? 0, a: 0, seg: 0 }];
  }

  let state: MotionState = {
    t: m.ts[0],
    pos: { x: m.x0, y: 0 },
    vel: { x: m.vs[0], y: 0 },
  };

  for (let i = 0; i < n; i++) {
    const segDur = m.ts[i + 1] - m.ts[i];
    const a = segAccel(m, i);
    // A genuinely constant AccelFn — see the file header on why this is not
    // `s => ({ x: aAt(m, s.t), y: 0 })`.
    const accel: AccelFn = () => ({ x: a, y: 0 });

    if (!(segDur > EPS)) {
      // A zero-duration segment is how an author retires a phase. Emit nothing
      // and carry the state (the node velocity may still jump, which the model
      // treats as the next segment's starting v).
      state = { t: m.ts[i + 1], pos: state.pos, vel: { x: m.vs[i + 1], y: 0 } };
      continue;
    }

    const steps = Math.max(1, Math.round(perSeg));
    const tr = integrate(state, accel, { dt: segDur / steps, maxSteps: steps });
    const pts = tr.points;

    for (let k = 0; k < pts.length; k++) {
      // Skip the shared node between two segments so t stays strictly
      // increasing; the previous segment already emitted it with ITS a, and the
      // a–t staircase needs exactly one value per instant.
      if (k === 0 && out.length > 0) continue;
      out.push({ t: pts[k].t, x: pts[k].pos.x, v: pts[k].vel.x, a, seg: i });
    }

    state = pts[pts.length - 1];
  }

  return out;
}

/** Linear interpolation of the dataset at `t`. The ONE sampler. */
export function sampleAt(s: Sample[], t: number): Sample {
  if (!s.length) return { t, x: 0, v: 0, a: 0, seg: 0 };
  const first = s[0];
  const last = s[s.length - 1];
  if (t <= first.t) return first;
  if (t >= last.t) return last;

  let lo = 0;
  let hi = s.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (s[mid].t <= t) lo = mid;
    else hi = mid;
  }
  const a = s[lo];
  const b = s[hi];
  const span = b.t - a.t;
  const f = span > EPS ? (t - a.t) / span : 0;
  return {
    t,
    x: a.x + (b.x - a.x) * f,
    v: a.v + (b.v - a.v) * f,
    // a is piecewise CONSTANT, so interpolating it would invent a ramp that the
    // model does not contain. Take the left sample's value.
    a: a.a,
    seg: a.seg,
  };
}

// ── Differentiation and integration of the SAMPLED series ────────────────────

export interface Derivative {
  t: number;
  /** Central-difference slope, or null where the stencil straddles a kink. */
  d: number | null;
}

/**
 * Central-difference derivative of a sampled series.
 *
 * `null` at the two endpoints and at any point whose stencil straddles a
 * discontinuity in a — because a central difference across a kink is not a
 * derivative of anything and reporting a number there would be a lie the
 * verifier would then have to be loosened to accept. Everywhere else the
 * central difference of a quadratic (x) or a straight line (v) is EXACT, which
 * is why the round trip below can be demanded to 1e-6 rather than to a fudge.
 */
export function derivativeSeries(s: Sample[], pick: (p: Sample) => number): Derivative[] {
  const out: Derivative[] = [];
  for (let i = 0; i < s.length; i++) {
    if (i === 0 || i === s.length - 1) {
      out.push({ t: s[i].t, d: null });
      continue;
    }
    const straddles = s[i - 1].a !== s[i + 1].a;
    if (straddles) {
      out.push({ t: s[i].t, d: null });
      continue;
    }
    const h = s[i + 1].t - s[i - 1].t;
    out.push({ t: s[i].t, d: h > EPS ? (pick(s[i + 1]) - pick(s[i - 1])) / h : null });
  }
  return out;
}

/**
 * Cumulative trapezoid integral of a sampled series, starting at `y0`.
 *
 * Exact for the v series (piecewise linear between samples by construction),
 * which is what lets the verifier assert the integral of v–t reproduces the
 * RK4-built x–t to 1e-6 — the check that proves the two panels are one dataset
 * and not two drawings.
 */
export function cumulativeIntegral(s: Sample[], pick: (p: Sample) => number, y0: number): { t: number; y: number }[] {
  const out: { t: number; y: number }[] = [];
  let acc = y0;
  for (let i = 0; i < s.length; i++) {
    if (i > 0) acc += 0.5 * (pick(s[i]) + pick(s[i - 1])) * (s[i].t - s[i - 1].t);
    out.push({ t: s[i].t, y: acc });
  }
  return out;
}

// ── Signed area, distance, and the sub-polygons that shade them ──────────────

export interface AreaPiece {
  t0: number;
  t1: number;
  v0: number;
  v1: number;
  /** +1 forward (above the axis), −1 backward (below it). */
  sign: 1 | -1;
  /** The signed contribution to displacement, m. */
  area: number;
}

/**
 * Split the v–t graph into pieces of constant sign, cutting each segment
 * exactly at its zero crossing.
 *
 * This is what makes the shading honest: the negative lobe is a genuinely
 * separate polygon, drawn in the secondary accent, and its area SUBTRACTS from
 * the running displacement in front of the student. A single shaded region
 * would let "area under v–t is displacement" be read as "area is distance",
 * which is the misconception.
 */
export function areaPieces(m: VtModel): AreaPiece[] {
  const out: AreaPiece[] = [];
  for (let i = 0; i < segCount(m); i++) {
    const t0 = m.ts[i];
    const t1 = m.ts[i + 1];
    const v0 = m.vs[i];
    const v1 = m.vs[i + 1];
    const dt = t1 - t0;
    if (!(dt > EPS)) continue;

    const crosses = (v0 < 0 && v1 > 0) || (v0 > 0 && v1 < 0);
    if (!crosses) {
      const area = 0.5 * (v0 + v1) * dt;
      out.push({ t0, t1, v0, v1, sign: area < 0 || (area === 0 && v0 < 0) ? -1 : 1, area });
      continue;
    }
    // Exact crossing time for a straight line between (t0,v0) and (t1,v1).
    const tc = t0 + dt * (v0 / (v0 - v1));
    out.push({
      t0, t1: tc, v0, v1: 0,
      sign: v0 > 0 ? 1 : -1,
      area: 0.5 * v0 * (tc - t0),
    });
    out.push({
      t0: tc, t1, v0: 0, v1,
      sign: v1 > 0 ? 1 : -1,
      area: 0.5 * v1 * (t1 - tc),
    });
  }
  return out;
}

/** Net displacement = the SIGNED area under v–t. Exact for a PWL v. */
export const signedArea = (m: VtModel): number =>
  areaPieces(m).reduce((s, p) => s + p.area, 0);

/**
 * Total path length = ∫|v| dt — the sum of the MAGNITUDES of the same pieces.
 *
 * Exact, and deliberately computed from the same `areaPieces` split rather than
 * from a dense |v| sum, so the two routes stay independent: the verifier checks
 * this against a dense trapezoid sum of |v| and against a hand-worked triangle
 * pair.
 */
export const pathLength = (m: VtModel): number =>
  areaPieces(m).reduce((s, p) => s + Math.abs(p.area), 0);

/** Δv over the whole motion = the signed area under a–t. */
export function deltaVFromA(m: VtModel): number {
  let acc = 0;
  for (let i = 0; i < segCount(m); i++) acc += segAccel(m, i) * (m.ts[i + 1] - m.ts[i]);
  return acc;
}

// ── Tangent vs chord — average against instantaneous ─────────────────────────

/**
 * Slope of the x–t graph at `t`, i.e. the instantaneous velocity.
 *
 * Read straight off the model rather than from a finite difference of the
 * drawing: the sim's claim is that the tangent's slope IS v, so the tangent
 * that gets drawn must be built from v. Drawing a numerical tangent and then
 * asserting it equals v would be circular in the wrong direction.
 */
export const tangentSlope = (m: VtModel, t: number): number => vAt(m, t);

/** Average velocity between two instants = the chord slope on the x–t graph. */
export function chordSlope(m: VtModel, t1: number, t2: number): number {
  const dt = t2 - t1;
  if (Math.abs(dt) < EPS) return vAt(m, t1);
  return (xAt(m, t2) - xAt(m, t1)) / dt;
}

/**
 * Average SPEED between two instants — path length over time, which is a
 * different number from the chord slope the moment the motion reverses.
 */
export function averageSpeed(m: VtModel, t1: number, t2: number): number {
  const dt = Math.abs(t2 - t1);
  if (dt < EPS) return Math.abs(vAt(m, t1));
  return pathLengthBetween(m, Math.min(t1, t2), Math.max(t1, t2)) / dt;
}

/** ∫|v| dt over a sub-interval, by restricting the model to it. */
export function pathLengthBetween(m: VtModel, t1: number, t2: number): number {
  return pathLength(sliceModel(m, t1, t2));
}

/**
 * The same motion, restricted to [t1, t2], with nodes inserted at both ends.
 * Used by the sub-interval readouts so they cannot disagree with the whole-
 * motion ones — the restriction is exact for a PWL v.
 */
export function sliceModel(m: VtModel, t1: number, t2: number): VtModel {
  const lo = Math.max(tStart(m), Math.min(t1, t2));
  const hi = Math.min(tEnd(m), Math.max(t1, t2));
  const ts: number[] = [lo];
  const vs: number[] = [vAt(m, lo)];
  for (let i = 0; i < m.ts.length; i++) {
    if (m.ts[i] > lo + EPS && m.ts[i] < hi - EPS) {
      ts.push(m.ts[i]);
      vs.push(m.vs[i]);
    }
  }
  ts.push(hi);
  vs.push(vAt(m, hi));
  return { ts, vs, x0: xAt(m, lo) };
}

// ── Editing the model — one edit per panel, all landing on the SAME nodes ────

/**
 * Set node `i`'s velocity. The v–t panel's drag maps here directly, which is
 * why v–t is the default driver: the gesture and the model are the same thing.
 */
export function setNodeV(m: VtModel, i: number, v: number): VtModel {
  if (i < 0 || i >= m.vs.length) return m;
  const vs = m.vs.slice();
  vs[i] = v;
  return { ...m, vs };
}

/**
 * Set segment `i`'s acceleration — the a–t panel's bar drag.
 *
 * Keeps v_i fixed and moves v_{i+1} to whatever that a demands, then shifts
 * every LATER node by the same amount so the shape after the edited segment is
 * preserved. Without the rigid shift, dragging bar 1 would silently rewrite
 * bars 2 and 3 as well, and the student would be unable to tell which of their
 * own actions changed what.
 */
export function setSegAccel(m: VtModel, i: number, a: number): VtModel {
  const n = segCount(m);
  if (i < 0 || i >= n) return m;
  const dt = m.ts[i + 1] - m.ts[i];
  if (!(dt > EPS)) return m;
  const wanted = m.vs[i] + a * dt;
  const shift = wanted - m.vs[i + 1];
  const vs = m.vs.slice();
  for (let k = i + 1; k < vs.length; k++) vs[k] += shift;
  return { ...m, vs };
}

/**
 * The x–t panel's edit: drag the TANGENT at node `i` to set its slope.
 *
 * Node dragging on x–t was rejected deliberately. Position is not free — it is
 * the accumulation of everything before it — so a handle that promises "move
 * this point to here" would have to move every later point too, and the student
 * would read that as the sim fighting them. Dragging the tangent instead makes
 * the manipulation the lesson: "the slope of x–t IS v" becomes something you
 * do with a finger rather than a sentence you are asked to believe.
 */
export const setTangentSlope = setNodeV;

/**
 * Paint the sketch: set every node inside a pointer sweep to the swept value.
 * `from`/`to` are times; the value ramps linearly between them so a fast drag
 * across three handles leaves a straight ramp rather than three flat steps.
 */
export function paintNodes(m: VtModel, fromT: number, fromV: number, toT: number, toV: number): VtModel {
  const lo = Math.min(fromT, toT);
  const hi = Math.max(fromT, toT);
  const vs = m.vs.slice();
  for (let i = 0; i < m.ts.length; i++) {
    const t = m.ts[i];
    if (t < lo - EPS || t > hi + EPS) continue;
    const span = hi - lo;
    const f = span > EPS ? (t - lo) / span : 0;
    vs[i] = fromT <= toT ? fromV + (toV - fromV) * f : toV + (fromV - toV) * f;
  }
  return { ...m, vs };
}

// ── Closed-form checks the sim shows the student ─────────────────────────────

/**
 * The two constant-acceleration results, for a SINGLE segment, computed from
 * the algebra rather than from the drawing.
 *
 * `PHYSICS_SIMULATION_PROGRAM.md` and `lib/integrate.ts`'s own header both say
 * the same thing: the integrator draws the path, algebra states the answer.
 * These are the numbers the readout prints; the verifier then demands the
 * integrator agrees with them to 1e-9.
 */
export interface UniformAccel {
  u: number;
  a: number;
  t: number;
  /** v = u + at */
  v: number;
  /** s = ut + ½at² */
  s: number;
  /** v² = u² + 2as, returned as the right-hand side so the two can be diffed. */
  vSquared: number;
  /** The turning point, if the motion reverses inside [0, t]. */
  turnAt: number | null;
}

export function uniformAccel(u: number, a: number, t: number): UniformAccel {
  const v = u + a * t;
  const s = u * t + 0.5 * a * t * t;
  const turn = Math.abs(a) > EPS ? -u / a : null;
  return {
    u, a, t, v, s,
    vSquared: u * u + 2 * a * s,
    turnAt: turn !== null && turn > EPS && turn < t - EPS ? turn : null,
  };
}

/**
 * Is the body speeding up or slowing down right now?
 *
 * THE HEADLINE FUNCTION OF THIS MODULE. Speed grows when a and v point the same
 * way and shrinks when they oppose — the sign of a on its own says nothing
 * about the direction of travel and nothing about whether the body is getting
 * faster. `d|v|/dt = sign(v)·a`, and that one line is the whole misconception.
 */
export type SpeedTrend = 'speeding-up' | 'slowing-down' | 'steady' | 'turning';

/**
 * The instants where v crosses zero — the turning points of the motion.
 *
 * NEEDED because `speedTrend`'s `'turning'` verdict requires |v| ≤ 1e-9, which a
 * cursor moving in finite steps will essentially never land on. Gating the
 * "momentarily at rest, still accelerating" card on that verdict made the card
 * UNREACHABLE — the exact Phase-1 failure this build exists not to repeat, and one
 * the evidence-gate verifier could not catch because it supplies the flag
 * directly. So the sim asks "is the cursor NEAR a turning point" against a
 * physical tolerance in seconds, and this is where the turning points come from.
 *
 * Genuine reversals only: a v segment that sits on zero for its whole length is a
 * body at rest, not a body turning.
 */
export function turningTimes(m: VtModel): number[] {
  const out: number[] = [];
  for (let i = 0; i < segCount(m); i++) {
    const v0 = m.vs[i];
    const v1 = m.vs[i + 1];
    const dt = m.ts[i + 1] - m.ts[i];
    if (!(dt > EPS)) continue;
    if ((v0 < -EPS && v1 > EPS) || (v0 > EPS && v1 < -EPS)) {
      out.push(m.ts[i] + dt * (v0 / (v0 - v1)));
    }
  }
  return out;
}

export function speedTrend(v: number, a: number, tol = 1e-9): SpeedTrend {
  if (Math.abs(v) <= tol) return Math.abs(a) <= tol ? 'steady' : 'turning';
  if (Math.abs(a) <= tol) return 'steady';
  return Math.sign(v) === Math.sign(a) ? 'speeding-up' : 'slowing-down';
}

/** d|v|/dt — positive means the speedometer needle is rising. */
export const speedRate = (v: number, a: number): number => (v === 0 ? Math.abs(a) : Math.sign(v) * a);

/**
 * Is the x–t graph flat here because the body is AT REST, or is a flat v–t
 * graph being misread as a flat x–t one?
 *
 * Returned as a small classification rather than a boolean because the whole
 * point of the archetype is that "flat" means three different things on the
 * three panels, and the copy has to be able to name which panel it is talking
 * about.
 */
export type FlatKind = 'x-flat-at-rest' | 'v-flat-uniform-velocity' | 'a-flat-uniform-accel' | 'none';

export function flatKind(v: number, a: number, tol = 1e-6): FlatKind {
  if (Math.abs(v) <= tol) return 'x-flat-at-rest';
  if (Math.abs(a) <= tol) return 'v-flat-uniform-velocity';
  return 'a-flat-uniform-accel';
}

// ── Building a model from authored scalars ───────────────────────────────────

export interface PhaseSpec {
  /** m/s² */
  a: number;
  /** s — zero retires the phase. */
  t: number;
}

/**
 * Three phases of constant acceleration → the PWL v model.
 *
 * Every journey graph in Class-11 Kinematics is three phases or fewer: pick up
 * speed, hold it, brake. Authoring by (u, and three a/duration pairs) keeps
 * every archetype a handful of scalars, which is what makes an exercise DATA —
 * the admin editor's generic params-to-inputs generator can build the form with
 * no per-archetype code.
 */
export function modelFromPhases(x0: number, u: number, phases: PhaseSpec[]): VtModel {
  const ts = [0];
  const vs = [u];
  let t = 0;
  let v = u;
  for (const p of phases) {
    if (!(p.t > EPS)) continue;
    t += p.t;
    v += p.a * p.t;
    ts.push(t);
    vs.push(v);
  }
  if (ts.length === 1) {
    // Every phase was retired. A model needs a span, so give it one second of
    // whatever velocity was authored rather than returning something degenerate
    // that every consumer then has to guard.
    ts.push(1);
    vs.push(u);
  }
  return { ts, vs, x0 };
}

/**
 * Re-sample a model onto `n` evenly spaced handles over the same span.
 *
 * This is what turns a phase-authored model into a sketchable one. It preserves
 * the motion exactly at the handles, and — because v is piecewise linear —
 * exactly everywhere too WHENEVER the original node times are a subset of the
 * new ones. When they are not (a kink at 4.3 s re-sampled onto whole seconds),
 * the shape is preserved but the kink is rounded, which is honest: the student
 * only has `n` handles, so `n` handles is all the motion they can express.
 */
export function resampleModel(m: VtModel, n: number): VtModel {
  const count = Math.max(2, Math.round(n));
  const t0 = tStart(m);
  const span = duration(m);
  const ts: number[] = [];
  const vs: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = t0 + (span * i) / (count - 1);
    ts.push(t);
    vs.push(vAt(m, t));
  }
  return { ts, vs, x0: m.x0 };
}

/** A flat model — the blank sheet a Match-the-Motion attempt starts from. */
export function flatModel(t0: number, t1: number, n: number, x0 = 0, v = 0): VtModel {
  const count = Math.max(2, Math.round(n));
  const ts: number[] = [];
  const vs: number[] = [];
  for (let i = 0; i < count; i++) {
    ts.push(t0 + ((t1 - t0) * i) / (count - 1));
    vs.push(v);
  }
  return { ts, vs, x0 };
}

// ── Ranges for the three panels ──────────────────────────────────────────────

export interface Ranges {
  x: { min: number; max: number };
  v: { min: number; max: number };
  a: { min: number; max: number };
}

/**
 * A padded, zero-including window for each panel.
 *
 * Zero is always inside every window on purpose. The axis is where the sign
 * lives, and a v–t panel whose window is [4, 12] hides the very fact the module
 * exists to teach — that v has a sign and that crossing the axis is a
 * reversal. `nice()` then rounds outward to a readable number so the two tick
 * labels per panel are values a student would write down.
 */
export function rangesOf(samples: Sample[], m: VtModel, pad = 0.12): Ranges {
  const span = (pick: (s: Sample) => number, floor: number) => {
    let lo = 0;
    let hi = 0;
    for (const s of samples) {
      const val = pick(s);
      if (val < lo) lo = val;
      if (val > hi) hi = val;
    }
    const width = Math.max(hi - lo, floor);
    const grow = width * pad;
    return { min: niceFloor(lo - grow), max: niceCeil(hi + grow) };
  };
  // a is piecewise constant, so its extremes are the segment values — reading
  // them off the samples would miss a segment shorter than one sample step.
  let aLo = 0;
  let aHi = 0;
  for (let i = 0; i < segCount(m); i++) {
    const a = segAccel(m, i);
    if (a < aLo) aLo = a;
    if (a > aHi) aHi = a;
  }
  const aWidth = Math.max(aHi - aLo, 1);
  return {
    x: span((s) => s.x, 1),
    v: span((s) => s.v, 1),
    a: { min: niceFloor(aLo - aWidth * pad), max: niceCeil(aHi + aWidth * pad) },
  };
}

/**
 * The mantissa ladder used to round a panel window outward to a readable value.
 *
 * Finer than the usual 1/2/5 on purpose. A v–t window has to include ZERO (the
 * area under the curve is measured from the axis, so an axis off-screen would
 * make the shading a lie), and the coarse ladder then wastes a great deal of the
 * panel: a velocity running 5 → 13 m/s becomes a window of −2 → 20, and the
 * curve fills 36% of its own panel. With 1.5 / 2.5 / 3 / 6 / 8 in the ladder the
 * same case becomes −2 → 15 and fills 76%. `verify-graphs.mjs` measures the fill
 * for every archetype at two board sizes, because "the graph is a flat line in
 * the middle of an empty box" is invisible to a type check.
 */
const MANTISSA = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

/** Largest ladder value ≤ `a`, for a > 0. */
function niceDown(a: number): number {
  const mag = 10 ** Math.floor(Math.log10(a));
  const n = a / mag;
  let step = MANTISSA[0];
  for (const m of MANTISSA) if (m <= n + 1e-12) step = m;
  return step * mag;
}

/** Smallest ladder value ≥ `a`, for a > 0. */
function niceUp(a: number): number {
  const mag = 10 ** Math.floor(Math.log10(a));
  const n = a / mag;
  for (const m of MANTISSA) if (m >= n - 1e-12) return m * mag;
  return 10 * mag;
}

/**
 * Smallest "nice" (1/2/5 × a power of ten) value ≥ `v`, and its mirror.
 *
 * Written out rather than folded into one `Math.sign` expression because the
 * negative branch is NOT the mirror of the positive one: the smallest nice
 * number ≥ −3.7 is −2, which comes from rounding 3.7 DOWN and negating. Getting
 * that backwards silently clips the bottom off every negative-velocity panel —
 * exactly the panel this module is built to show.
 */
export function niceCeil(v: number): number {
  if (v === 0) return 0;
  return v > 0 ? niceUp(v) : -niceDown(-v);
}

/** Largest "nice" value ≤ `v`. */
export function niceFloor(v: number): number {
  if (v === 0) return 0;
  return v > 0 ? niceDown(v) : -niceUp(-v);
}

/** A "nice" step giving at most `want` divisions over `span`. */
export function niceStep(span: number, want: number): number {
  const raw = Math.abs(span) / Math.max(1, want);
  if (!(raw > 0)) return 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n > 5 ? 10 : n > 2 ? 5 : n > 1 ? 2 : 1) * mag;
}

/**
 * Tick values across [lo, hi], at most `maxCount` of them.
 *
 * The count cap is the collision guarantee for the shared time axis: the caller
 * passes `floor(innerWidth / 52)`, and 52 px between labels that are at most
 * four characters of 10 px type cannot overlap. Nothing measures text; the
 * spacing is correct by construction.
 */
export function ticks(lo: number, hi: number, maxCount: number): number[] {
  const step = niceStep(hi - lo, Math.max(1, maxCount));
  const out: number[] = [];
  const first = Math.ceil(lo / step - 1e-9) * step;
  for (let t = first; t <= hi + 1e-9; t += step) {
    out.push(Math.abs(t) < step * 1e-9 ? 0 : t);
    if (out.length > 200) break;
  }
  return out;
}
