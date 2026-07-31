/*
 * rotation/lib/rolling.ts — the point of the tyre that is standing still.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Node-verifiable, no React.
 *
 * ── THE THING NO TEXTBOOK FIGURE CAN SHOW ────────────────────────────────────
 * A wheel rolling without slipping has, at every instant, ONE point that is not
 * moving at all: the point touching the road. The top of the same wheel is
 * moving at 2v. Both facts are printed in every book and believed by almost
 * nobody, because a still photograph cannot distinguish "the contact point is
 * stationary" from "the contact point moves with the wheel".
 *
 * Rendering the velocity of the material point at every angle round the rim,
 * live, is the entire simulation. The zero at the bottom is not annotated — it
 * is drawn as an arrow of length zero, next to an arrow of length 2v at the top.
 *
 * ── THE ALGEBRA ──────────────────────────────────────────────────────────────
 * For a wheel whose centre moves at v x̂ and which spins at ω ẑ (CCW positive),
 * the material point at angle φ on the rim sits at r(cos φ, sin φ) from the
 * centre, and
 *
 *      v_point = v x̂ + ω ẑ × r(cos φ, sin φ) = (v − ω r sin φ, ω r cos φ)
 *
 * Rolling to the RIGHT means spinning CLOCKWISE, so ω = −v/r. At the contact
 * point (φ = 270°, sin φ = −1): v_point = (v − (−v/r)·r·(−1), 0) = (v − v, 0) = 0.
 * At the top (φ = 90°): v_point = (v + v, 0) = 2v. Exactly, not nearly.
 *
 * Slipping is what happens when ω is NOT −v/r, and `slipVelocity` is the single
 * number that says so: it is the contact point's velocity, and it is zero if and
 * only if the wheel is rolling.
 */

const DEG = Math.PI / 180;

export interface Vec2 { x: number; y: number }

/**
 * Velocity of the MATERIAL point currently at angle φ on the rim, m/s.
 * φ is measured CCW from +x about the wheel's centre: 90° is the top, 270° the
 * contact point.
 */
export function rimVelocity(vCentre: number, omega: number, r: number, phiDeg: number): Vec2 {
  const a = phiDeg * DEG;
  return {
    x: vCentre - omega * r * Math.sin(a),
    y: omega * r * Math.cos(a),
  };
}

/** The angular velocity that makes a wheel roll rather than slip: ω = −v/r
 *  (clockwise when moving right). */
export const rollingOmega = (vCentre: number, r: number): number => -vCentre / r;

/**
 * Velocity of the contact point along the road, m/s. Zero ⟺ rolling.
 *
 *   > 0  the wheel is spinning too slowly for its speed → it is SKIDDING
 *        forward (braking lock-up), and friction acts backwards on the contact.
 *   < 0  spinning too fast → it is SPINNING OUT (wheelspin), and friction acts
 *        forwards, which is how a car accelerates at all.
 */
export const slipVelocity = (vCentre: number, omega: number, r: number): number =>
  rimVelocity(vCentre, omega, r, 270).x;

/** Rolling to a stated tolerance. Default 1e-9 m/s — a hair, but not "close
 *  enough": the whole claim is that it is exactly zero. */
export const isPureRolling = (vCentre: number, omega: number, r: number, tol = 1e-9): boolean =>
  Math.abs(slipVelocity(vCentre, omega, r)) <= tol;

/**
 * Slip ratio: contact-point speed ÷ centre speed. 0 = rolling, +1 = fully
 * locked wheel skidding, −1 = wheel spinning at twice the rolling rate.
 */
export function slipRatio(vCentre: number, omega: number, r: number): number {
  const v = Math.abs(vCentre);
  return v < 1e-9 ? 0 : slipVelocity(vCentre, omega, r) / v;
}

/**
 * The position of a marked point on the rim after the wheel has rolled a
 * distance d — the CYCLOID, which is the same statement as "the contact point is
 * momentarily at rest" written as a curve.
 *
 * The cusps where the curve touches the road are the instants that point is the
 * contact point, and its speed there is zero: the curve has a corner because the
 * point has stopped, turned round and set off again.
 */
export function cycloidPoint(r: number, d: number, phi0Deg = 270): Vec2 {
  // Rolling right: the wheel turns clockwise by d/r radians.
  const turn = d / r;
  const a = phi0Deg * DEG - turn;
  return { x: d + r * Math.cos(a), y: r + r * Math.sin(a) };
}

/** Speed of the marked point along the cycloid, m/s — 0 at each cusp, 2v at
 *  each peak. */
export function cycloidSpeed(vCentre: number, r: number, d: number, phi0Deg = 270): number {
  const omega = rollingOmega(vCentre, r);
  const turn = d / r;
  const phi = phi0Deg - (turn * 180) / Math.PI;
  const v = rimVelocity(vCentre, omega, r, phi);
  return Math.hypot(v.x, v.y);
}

/**
 * Kinetic energy of a rolling body split into the two accounts, J.
 *
 * ½mv² + ½Iω², with I = k m r² and ω = v/r, which is ½mv²(1 + k) — the same
 * (1 + k) that decides the MoI race. The two sims are the same physics twice,
 * and sharing this function is how that stays true rather than being asserted.
 */
export function rollingEnergy(mass: number, v: number, kFactor: number)
: { translational: number; rotational: number; total: number } {
  const tr = 0.5 * mass * v * v;
  return { translational: tr, rotational: kFactor * tr, total: tr * (1 + kFactor) };
}
