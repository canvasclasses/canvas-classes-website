/*
 * energy/lib/collide.ts — collisions in 1-D and 2-D, and the CoM frame.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Node-verifiable, no React.
 *
 * ── WHY THE CoM FRAME IS THE WHOLE SIM ───────────────────────────────────────
 * In the centre-of-mass frame the total momentum is ZERO, by definition. So in
 * that frame the two momenta are always equal and opposite — before AND after.
 * For an elastic collision that forces
 *
 *      v'₁ = −v₁ ,   v'₂ = −v₂          (exactly, in the CoM frame)
 *
 * because reversing both is the only way to keep p = 0 and keep KE the same.
 * Every 1-D elastic collision is therefore the same collision, seen from a
 * different moving train. That is the trick that turns 2-D collisions from a
 * simultaneous-equations grind into a picture, and it is invisible in the ground
 * frame — which is exactly the kind of "invisible middle step" this program
 * exists to show (design law #3).
 *
 * ── SIGNS AND CONVENTIONS ────────────────────────────────────────────────────
 * `e` is Newton's coefficient of restitution: separation speed ÷ approach speed
 * along the line of impact. e = 1 elastic, e = 0 perfectly inelastic (they stick).
 * Momentum is conserved for EVERY value of e; kinetic energy only at e = 1.
 */

export interface Vec2 { x: number; y: number }

export interface Pair1D { v1: number; v2: number }

const v_sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
const v_add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
const v_scale = (a: Vec2, k: number): Vec2 => ({ x: a.x * k, y: a.y * k });
const v_dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;

// ── 1-D ──────────────────────────────────────────────────────────────────────

/** Velocity of the centre of mass — the frame in which p = 0. */
export function comVelocity(m1: number, u1: number, m2: number, u2: number): number {
  return (m1 * u1 + m2 * u2) / (m1 + m2);
}

/** Reduced mass μ = m₁m₂/(m₁+m₂). The mass that "does the colliding". */
export function reducedMass(m1: number, m2: number): number {
  return (m1 * m2) / (m1 + m2);
}

/**
 * The general 1-D collision.
 *
 *   v₁ = [(m₁ − e·m₂)u₁ + (1 + e)m₂u₂] / (m₁ + m₂)
 *   v₂ = [(m₂ − e·m₁)u₂ + (1 + e)m₁u₁] / (m₁ + m₂)
 *
 * Two consequences worth knowing before you read the code:
 *   • equal masses, e = 1, u₂ = 0  →  v₁ = 0, v₂ = u₁. They EXCHANGE velocities.
 *   • e = 0  →  v₁ = v₂ = v_com. They ride off together at the CoM velocity.
 */
export function collide1D(m1: number, u1: number, m2: number, u2: number, e: number): Pair1D {
  const M = m1 + m2;
  return {
    v1: ((m1 - e * m2) * u1 + (1 + e) * m2 * u2) / M,
    v2: ((m2 - e * m1) * u2 + (1 + e) * m1 * u1) / M,
  };
}

/**
 * Kinetic energy converted to heat/sound/deformation, J.
 *
 *      ΔKE = ½·μ·(1 − e²)·v_rel²
 *
 * Derived, not curve-fitted: in the CoM frame the total KE is exactly
 * ½μv_rel², and an e-collision keeps e² of it. So the loss is the (1 − e²)
 * share, and it is ZERO at e = 1 and the WHOLE CoM-frame KE at e = 0 — which is
 * the standard "maximum possible loss in a perfectly inelastic collision"
 * result, obtained without a separate formula.
 */
export function keLoss(m1: number, u1: number, m2: number, u2: number, e: number): number {
  const vRel = u1 - u2;
  return 0.5 * reducedMass(m1, m2) * (1 - e * e) * vRel * vRel;
}

export const ke1D = (m: number, v: number): number => 0.5 * m * v * v;
export const p1D = (m: number, v: number): number => m * v;

/** Into the CoM frame: subtract the frame's own velocity from both. */
export function toComFrame(m1: number, u1: number, m2: number, u2: number): Pair1D & { vCom: number } {
  const vCom = comVelocity(m1, u1, m2, u2);
  return { vCom, v1: u1 - vCom, v2: u2 - vCom };
}

/** Back to the ground frame. */
export function fromComFrame(v1: number, v2: number, vCom: number): Pair1D {
  return { v1: v1 + vCom, v2: v2 + vCom };
}

// ── 2-D ──────────────────────────────────────────────────────────────────────

export interface Pair2D { v1: Vec2; v2: Vec2 }

/**
 * A smooth-sphere collision. The impulse acts along the LINE OF CENTRES (the
 * contact normal) and nothing acts along the tangent — so the tangential
 * velocity components pass through untouched and the normal components obey the
 * ordinary 1-D law. Two lines of physics, and the whole of 2-D collisions.
 *
 * `normalDeg` is the direction from body 1's centre to body 2's, degrees CCW
 * from +x.
 */
export function collide2D(
  m1: number, u1: Vec2, m2: number, u2: Vec2, e: number, normalDeg: number,
): Pair2D {
  const a = (normalDeg * Math.PI) / 180;
  const n: Vec2 = { x: Math.cos(a), y: Math.sin(a) };
  const t: Vec2 = { x: -n.y, y: n.x };

  const u1n = v_dot(u1, n), u1t = v_dot(u1, t);
  const u2n = v_dot(u2, n), u2t = v_dot(u2, t);
  const { v1: v1n, v2: v2n } = collide1D(m1, u1n, m2, u2n, e);

  return {
    v1: v_add(v_scale(n, v1n), v_scale(t, u1t)),
    v2: v_add(v_scale(n, v2n), v_scale(t, u2t)),
  };
}

/**
 * The contact-normal direction produced by an impact parameter.
 *
 * `b` is the perpendicular offset between the two centres' lines of travel; the
 * spheres touch when the centre separation is r₁ + r₂, so sin of the angle
 * between the approach direction and the line of centres is b/(r₁+r₂). b = 0 is
 * a head-on hit; b = r₁+r₂ is a graze that does nothing.
 */
export function impactNormalDeg(b: number, r1: number, r2: number, approachDeg = 0): number {
  const sum = Math.max(r1 + r2, 1e-9);
  const s = Math.min(Math.max(b / sum, -1), 1);
  return approachDeg - (Math.asin(s) * 180) / Math.PI;
}

export const ke2D = (m: number, v: Vec2): number => 0.5 * m * (v.x * v.x + v.y * v.y);
export const p2D = (m: number, v: Vec2): Vec2 => ({ x: m * v.x, y: m * v.y });

/** Centre-of-mass velocity in 2-D. */
export function comVelocity2D(m1: number, u1: Vec2, m2: number, u2: Vec2): Vec2 {
  const M = m1 + m2;
  return { x: (m1 * u1.x + m2 * u2.x) / M, y: (m1 * u1.y + m2 * u2.y) / M };
}

/** Angle between two velocity vectors, degrees in [0, 180]. Returns null when
 *  either body is at rest, where "the angle between them" has no meaning. */
export function separationAngleDeg(v1: Vec2, v2: Vec2): number | null {
  const s1 = Math.hypot(v1.x, v1.y);
  const s2 = Math.hypot(v2.x, v2.y);
  if (s1 < 1e-9 || s2 < 1e-9) return null;
  const c = Math.min(Math.max(v_dot(v1, v2) / (s1 * s2), -1), 1);
  return (Math.acos(c) * 180) / Math.PI;
}

export { v_sub, v_add, v_scale, v_dot };
