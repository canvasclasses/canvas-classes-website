/*
 * motion-lab/lib/circular.ts — circular-motion physics. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM, no imports outside the frozen type contract — so every
 * claim this file makes can be checked by a plain node script, exactly like
 * vector-lab/lib/vectorMath.ts. If a number appears on screen in the Circular
 * Motion Arena, it came from here.
 *
 * ── ANGLE CONVENTION (the one thing to internalise) ──────────────────────────
 * `theta` is the angular position measured FROM THE TOP of the circle, in
 * radians, increasing IN THE DIRECTION OF TRAVEL.
 *
 *      theta = 0      → top          (12 o'clock)
 *      theta = π/2    → quarter turn later
 *      theta = π      → bottom       (6 o'clock)
 *
 * This is deliberately not "CCW from +x": every vertical-circle result a
 * student meets (T = mv²/r − mg cos θ, v_top = √(gr)) is quoted from the top,
 * and re-deriving it in a different convention is how sign errors get shipped.
 *
 * Height above the centre is r cos θ; height above the BOTTOM is r(1 + cos θ).
 * The component of weight pointing toward the centre is mg cos θ — full weight
 * inward at the top (θ=0), full weight outward at the bottom (θ=π). That single
 * fact generates the entire vertical-circle module.
 *
 * ── SPEED MODEL ──────────────────────────────────────────────────────────────
 * `spec.omega` is the angular velocity at the REFERENCE point — the BOTTOM for
 * a loop on a string/rod/inside track, the TOP for an outside track (a bridge
 * crest), θ=0 for a horizontal circle. See `refAngle` for why. A vertical circle
 * cannot have constant speed — gravity does work on the way up — so the speed at
 * any other angle comes from energy conservation, not from ω·r. Pretending
 * otherwise is the most common way a "circular motion" sim quietly lies.
 *
 *      v(θ)² = v_ref² − 2 g r (cos θ − cos θ_ref)      (vertical, gravity)
 *      v(θ)² += 2 α r (θ − θ_ref)                       (a driven tangential α)
 *
 * SI units throughout: metres, kilograms, seconds, newtons, radians here and
 * degrees only where a human types them (bank angle, cone half-angle).
 *
 * Sources for the standing results (SIMULATION_DESIGN_WORKFLOW §7 gate):
 *   • NCERT Physics Class 11, Ch. 5 "Laws of Motion" §5.10–5.11 — circular
 *     motion, motion in a vertical circle, motion of a car on a level and on a
 *     banked road. v_max on a banked road with friction, v_min at the top of a
 *     vertical loop = √(gr), and the conical-pendulum relations are all from
 *     that chapter's worked treatment.
 */

import type {
  CircularSpec,
  CircularReadout,
  MotionState,
  Vec2,
  HandoffEnvelope,
} from '../types';

export const DEG = Math.PI / 180;
/** m/s² — the value used everywhere in the Class 11 book. */
export const G_EARTH = 9.8;

const ORIGIN: Vec2 = { x: 0, y: 0 };

// ── Geometry ─────────────────────────────────────────────────────────────────

/** +1 when the body runs counter-clockwise (omega ≥ 0), −1 when clockwise. */
export const dirOf = (spec: CircularSpec): 1 | -1 => (spec.omega >= 0 ? 1 : -1);

/** Position at angle θ (physics coordinates: x right, y UP). */
export function posAt(spec: CircularSpec, theta: number, centre: Vec2 = ORIGIN): Vec2 {
  const d = dirOf(spec);
  return {
    x: centre.x - d * spec.radius * Math.sin(theta),
    y: centre.y + spec.radius * Math.cos(theta),
  };
}

/** Unit vector along the direction of travel (the tangent). */
export function tangentAt(spec: CircularSpec, theta: number): Vec2 {
  const d = dirOf(spec);
  return { x: -d * Math.cos(theta), y: -Math.sin(theta) };
}

/** Unit vector from the body TOWARD the centre. */
export function inwardAt(spec: CircularSpec, theta: number): Vec2 {
  const d = dirOf(spec);
  return { x: d * Math.sin(theta), y: -Math.cos(theta) };
}

/** Height of the body above the LOWEST point of the circle, in metres. */
export const heightAboveBottom = (spec: CircularSpec, theta: number): number =>
  spec.radius * (1 + Math.cos(theta));

// ── Speed ────────────────────────────────────────────────────────────────────

/**
 * The angle the speed model treats as "where omega was measured".
 *
 *  • vertical + string / rod / track-inside → the BOTTOM (θ=π). This is the
 *    loop-the-loop framing: the ball is launched from the lowest point and the
 *    question is whether it survives the top.
 *  • vertical + track-outside → the TOP (θ=0). This is the crest framing: a car
 *    crosses the bridge at speed v, or a ball starts from rest on top of a
 *    sphere. Both quote the speed at the top, and both leave the surface there
 *    or just after — measuring from the bottom would be meaningless.
 *  • horizontal → θ=0; nothing changes the speed anyway unless α is set.
 */
const refAngle = (spec: CircularSpec): number =>
  spec.plane === 'vertical' && spec.agent !== 'track-outside' ? Math.PI : 0;

/**
 * Speed at angle θ. Returns 0 (not NaN, not a negative root) when the body
 * cannot physically reach θ — the caller reads `released` from `readout()` to
 * find out that it never got there.
 */
export function speedAt(spec: CircularSpec, theta: number, g: number = G_EARTH): number {
  const r = spec.radius;
  const vRef = Math.abs(spec.omega) * r;
  const ref = refAngle(spec);
  let v2 = vRef * vRef;
  // Energy: v² falls by 2g·Δh, where Δh = r(cos θ − cos θ_ref) is the rise
  // above the reference point (height above the centre is r cos θ).
  if (spec.plane === 'vertical') v2 -= 2 * g * r * (Math.cos(theta) - Math.cos(ref));
  if (spec.alphaTangential) v2 += 2 * spec.alphaTangential * r * (theta - ref);
  return v2 <= 0 ? 0 : Math.sqrt(v2);
}

// ── The standing results ─────────────────────────────────────────────────────

/**
 * Minimum speed AT THE TOP of a vertical circle held by a string or by the
 * inside of a track: at that speed the string tension is exactly zero and
 * gravity alone supplies mv²/r, so mg = mv²/r → v = √(gr).
 *
 * Note this is the speed at the TOP, not the speed at the bottom — the bottom
 * speed needed to *get* there is √(5gr), which is a different number and the
 * one students most often confuse it with. See `vMinAtBottom`.
 */
export const vMinAtTop = (radius: number, g: number = G_EARTH): number =>
  Math.sqrt(g * radius);

/** Speed needed at the BOTTOM to just complete the loop: √(5gr). */
export const vMinAtBottom = (radius: number, g: number = G_EARTH): number =>
  Math.sqrt(5 * g * radius);

/**
 * The safe speed band on a banked road of radius r, bank angle θ, friction μ.
 *
 *      v_min² = g r (tan θ − μ) / (1 + μ tan θ)
 *      v_max² = g r (tan θ + μ) / (1 − μ tan θ)
 *
 * Two honest edge cases the UI must be able to show:
 *   • tan θ ≤ μ → v_min is 0: friction alone holds the car, it may crawl or stop.
 *   • μ tan θ ≥ 1 → v_max is Infinity: the geometry can never overturn the
 *     friction budget, so there is no upper limit from this model.
 */
export function bankedSafeBand(
  radius: number,
  bankDeg: number,
  mu: number,
  g: number = G_EARTH
): { vMin: number; vMax: number } {
  const t = Math.tan(bankDeg * DEG);
  const lowNum = t - mu;
  const vMin = lowNum <= 0 ? 0 : Math.sqrt((g * radius * lowNum) / (1 + mu * t));
  const highDen = 1 - mu * t;
  const vMax = highDen <= 0 ? Infinity : Math.sqrt((g * radius * (t + mu)) / highDen);
  return { vMin, vMax };
}

/**
 * Conical pendulum: a bob on a string of length L swung so the string traces a
 * cone of half-angle θ from the vertical.
 *
 *      T cos θ = m g          (vertical: the string holds the bob up)
 *      T sin θ = m ω² L sin θ (horizontal: the rest of the tension turns it)
 *   →  ω = √( g / (L cos θ) ),  T = m g / cos θ,  r = L sin θ
 *
 * `tension` is returned PER KILOGRAM of bob (N/kg) because the caller supplies
 * the mass — multiply by m for newtons. Note ω does not depend on the mass at
 * all, which is the surprise worth showing.
 */
export function conicalPendulum(
  length: number,
  thetaDeg: number,
  g: number = G_EARTH
): { omega: number; tension: number; radius: number } {
  const th = Math.min(Math.max(thetaDeg, 0), 89.5) * DEG;
  const c = Math.cos(th);
  return {
    omega: Math.sqrt(g / (length * c)),
    tension: g / c,
    radius: length * Math.sin(th),
  };
}

/**
 * Rotor / "well of death": the wall's normal force supplies the centripetal
 * force N = mv²/r, and vertical friction μN must carry the weight mg.
 *      μ m v² / r ≥ m g  →  v ≥ √(g r / μ)
 * Mass cancels — a heavier rider is not safer, which is the whole point.
 */
export const rotorMinSpeed = (radius: number, mu: number, g: number = G_EARTH): number =>
  mu <= 0 ? Infinity : Math.sqrt((g * radius) / mu);

/**
 * Car over a bridge crest of radius r: N = mg − mv²/r. The wheels leave the
 * road when N reaches 0, i.e. at v = √(gr) — the same number as the top of a
 * vertical circle, because it is the same equation.
 */
export const crestAirborneSpeed = (radius: number, g: number = G_EARTH): number =>
  Math.sqrt(g * radius);

/** A centrifuge/spin-dryer's "g-force": ω²r expressed in multiples of g. */
export const gForceOf = (radius: number, omega: number, g: number = G_EARTH): number =>
  (omega * omega * radius) / g;

// ── The single readout ───────────────────────────────────────────────────────

/**
 * Everything the sim is allowed to display at this instant.
 *
 * The agent force is computed HONESTLY and is never clamped:
 *
 *   string / track-inside (pulls or pushes inward only)
 *        T = m v²/r − m g cos θ
 *        T < 0 would mean the string is pushing outward, which a string cannot
 *        do → it has gone SLACK and the body leaves the circle. `released` is
 *        set; the value is reported as it came out. Silently clamping it to
 *        zero is how a sim hides the exact moment worth teaching.
 *
 *   rod (can push AND pull)
 *        same equation, but a negative value is a real compression — never a
 *        release. This is why a rod-held loop has no minimum speed.
 *
 *   track-outside (a crest, the outside of a sphere — can only push outward)
 *        N = m g cos θ − m v²/r, released when N < 0 (the body goes airborne).
 *
 *   friction on the flat (level road, turntable)
 *        the required centripetal force m v²/r must be within μ_s m g.
 *
 *   banked (bankDeg present)
 *        released when the speed sits outside [v_min, v_max] from
 *        `bankedSafeBand`; agentForce reports the centripetal force required.
 */
export function readout(
  spec: CircularSpec,
  thetaRad: number,
  g: number = G_EARTH
): CircularReadout {
  const { radius: r, mass: m } = spec;
  const v = speedAt(spec, thetaRad, g);
  const centripetal = (v * v) / r;

  // Tangential acceleration = whatever is driving it, plus gravity's share on a
  // vertical circle (g sin θ, which is zero at top and bottom and maximal at
  // the sides — the reason a vertical loop is NEVER uniform circular motion).
  const gravityTangential = spec.plane === 'vertical' ? g * Math.sin(thetaRad) : 0;
  const tangential = (spec.alphaTangential ?? 0) + gravityTangential;

  const cosT = Math.cos(thetaRad);
  const banked = spec.bankDeg !== undefined && spec.plane !== 'vertical';

  let agentForce: number;
  let released = false;

  // Failure must be a STRICTLY negative force, not "negative or a rounding
  // error away from zero". At exactly the critical speed the tension comes out
  // as −4e-16, and calling that "the string went slack" made the sim disagree
  // with the very equation the student had just derived. Caught by the node
  // check, invisible to tsc.
  const eps = 1e-9 * Math.max(1, m * g);

  if (banked) {
    agentForce = m * centripetal;
    const band = bankedSafeBand(r, spec.bankDeg as number, spec.mu_s ?? 0, g);
    released = v < band.vMin - 1e-6 || v > band.vMax + 1e-6;
  } else if (spec.plane === 'vertical' && (spec.agent === 'string' || spec.agent === 'rod' || spec.agent === 'track-inside')) {
    agentForce = m * centripetal - m * g * cosT;
    released = agentForce < -eps && spec.agent !== 'rod';
  } else if (spec.agent === 'track-outside') {
    agentForce = m * g * cosT - m * centripetal;
    released = agentForce < -eps;
  } else if (spec.agent === 'friction') {
    agentForce = m * centripetal;
    const maxStatic = (spec.mu_s ?? 0) * m * g;
    released = agentForce > maxStatic + eps;
  } else {
    // horizontal string / rod / track / gravity (an orbit): the agent simply
    // supplies whatever the circle demands.
    agentForce = m * centripetal;
    released = false;
  }

  // A vertical circle the body cannot physically reach (v² went negative) has
  // already failed further back — say so rather than drawing a stalled ball.
  if (spec.plane === 'vertical' && v === 0 && Math.abs(spec.omega) > 0 && spec.agent !== 'rod') {
    released = true;
  }

  const out: CircularReadout = {
    speed: v,
    centripetal,
    tangential,
    total: Math.hypot(centripetal, tangential),
    agentForce,
    released,
  };

  if (spec.plane === 'vertical' && (spec.agent === 'string' || spec.agent === 'track-inside')) {
    out.vMinTop = vMinAtTop(r, g);
  }
  if (banked) {
    const band = bankedSafeBand(r, spec.bankDeg as number, spec.mu_s ?? 0, g);
    out.vMin = band.vMin;
    out.vMax = band.vMax;
  }
  return out;
}

/**
 * Sample the agent force all the way round, for the live tension-vs-angle plot.
 * Returns θ from the top (0) round to a full turn (2π). Points the body cannot
 * reach come back with `reachable: false` so the plot can stop drawing rather
 * than invent a curve.
 */
export function agentForceCurve(
  spec: CircularSpec,
  g: number = G_EARTH,
  samples = 180
): { theta: number; force: number; speed: number; reachable: boolean }[] {
  const out: { theta: number; force: number; speed: number; reachable: boolean }[] = [];
  for (let i = 0; i <= samples; i++) {
    const theta = (i / samples) * 2 * Math.PI;
    const rd = readout(spec, theta, g);
    out.push({
      theta,
      force: rd.agentForce,
      speed: rd.speed,
      reachable: rd.speed > 0 || Math.abs(spec.omega) === 0,
    });
  }
  return out;
}

// ── Departure: the handoff into the projectile integrator ────────────────────

/**
 * The state of the body the instant the constraint fails (or the student cuts
 * the string). It leaves along the TANGENT, at the speed it already had — not
 * radially outward, which is what almost every student predicts.
 *
 * `t` is 0: the receiving integrator owns the clock from here.
 */
export function releaseState(
  spec: CircularSpec,
  thetaRad: number,
  centre: Vec2
): MotionState {
  const v = speedAt(spec, thetaRad);
  const tan = tangentAt(spec, thetaRad);
  return {
    t: 0,
    pos: posAt(spec, thetaRad, centre),
    vel: { x: tan.x * v, y: tan.y * v },
  };
}

/**
 * The same departure wrapped in the cross-engine envelope, so mechanics-bench
 * (or anything else) can pick the body up without knowing it came from a
 * circle. Design law #4.
 */
export function releaseEnvelope(
  spec: CircularSpec,
  thetaRad: number,
  centre: Vec2,
  g: number = G_EARTH,
  reason = 'string went slack'
): HandoffEnvelope {
  const s = releaseState(spec, thetaRad, centre);
  return {
    bodies: [{ id: 'ball', pos: s.pos, vel: s.vel, mass: spec.mass, label: 'ball' }],
    t: 0,
    g,
    source: 'motion-lab',
    reason,
  };
}

/**
 * Where the constraint first fails, scanning forward from `fromTheta`. Returns
 * null when the body completes the turn intact. Used to run a vertical circle
 * "until it goes slack" without the UI guessing where that is.
 */
export function firstFailureAngle(
  spec: CircularSpec,
  fromTheta = 0,
  g: number = G_EARTH,
  samples = 720
): number | null {
  for (let i = 0; i <= samples; i++) {
    const theta = fromTheta + (i / samples) * 2 * Math.PI;
    if (readout(spec, theta, g).released) return theta;
  }
  return null;
}

/** Wrap any angle into [0, 2π). */
export const wrapAngle = (theta: number): number => {
  const two = 2 * Math.PI;
  return ((theta % two) + two) % two;
};
