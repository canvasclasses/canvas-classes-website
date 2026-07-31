/*
 * motion-lab/thermo/lib/fluids.ts — continuity, Bernoulli, buoyancy, terminal v.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM; the one import is the FROZEN E2 integrator, reused so
 * the approach to terminal velocity is drawn by the same RK4 every other motion
 * in this engine uses. Checked by `scripts/verify-motion-phase2.mjs`.
 *
 * ── THE ONE IDEA THIS FILE EXISTS FOR ───────────────────────────────────────
 * Pressure DROPS where the flow speeds up. Every intuition says the opposite —
 * squeeze a pipe and surely the fluid presses harder on the walls — and the
 * intuition is wrong because it confuses "how fast it is going" with "how hard
 * it is pushing sideways".
 *
 * The honest way to show it is to make it a consequence rather than a claim:
 *   1. Mass cannot pile up in a rigid pipe, so A₁v₁ = A₂v₂. Narrow ⇒ faster.
 *      This bit everyone already believes.
 *   2. Energy per unit volume is conserved along a streamline, and ½ρv² is one
 *      of its three terms. If the ½ρv² term grows and ρgh has not changed,
 *      then P is the only term left to shrink.
 * So `bernoulliConstant` returns the three terms SEPARATELY. The ledger in the
 * UI shows them as a stacked bar whose total does not move while the pieces
 * trade — which is the argument, drawn.
 *
 * Convention: SI. Densities kg/m³, pressures Pa, areas m², speeds m/s.
 */

import type { MotionState, AccelFn } from '../../types';
import { integrate, DEFAULT_DT } from '../../lib/integrate';

/** m/s² — standard gravity, the value every Indian board question uses. */
export const G0 = 9.8;
/** kg/m³ at 20 °C. */
export const RHO_WATER = 1000;
export const RHO_AIR = 1.2;

// ── Continuity ───────────────────────────────────────────────────────────────

export const areaOfRadius = (r: number): number => Math.PI * r * r;
export const radiusOfArea = (A: number): number => Math.sqrt(Math.max(A, 0) / Math.PI);

/**
 * A₁v₁ = A₂v₂ → v₂ = A₁v₁/A₂.
 *
 * Worth noticing how violent this is: halving the RADIUS quarters the area and
 * so QUADRUPLES the speed. A pipe that narrows by a factor of two in diameter
 * is a factor of sixteen in ½ρv². That fourth power is why a thumb over a hose
 * end is so dramatic, and why the Bernoulli pressure drop at a constriction is
 * far larger than students expect.
 */
export const continuitySpeed = (A1: number, v1: number, A2: number): number =>
  (A1 * v1) / Math.max(A2, 1e-12);

/** Volume flow rate Q = Av, m³/s. Constant everywhere along a rigid pipe — the
 *  single number that ties the whole ledger together. */
export const flowRate = (A: number, v: number): number => A * v;

// ── Bernoulli ────────────────────────────────────────────────────────────────

export interface BernoulliTerms {
  /** Static pressure, Pa. */
  pressure: number;
  /** Dynamic pressure ½ρv², Pa. */
  dynamic: number;
  /** Gravitational term ρgh, Pa. */
  gravity: number;
  /** The sum — constant along a streamline. */
  total: number;
}

/**
 * P + ½ρv² + ρgh, split into its three terms.
 *
 * All three have units of PRESSURE, which is the detail that makes the equation
 * make sense: it is an energy-per-unit-volume balance, so the terms are
 * directly comparable and can be drawn on one bar.
 */
export function bernoulliTerms(P: number, rho: number, v: number, h: number, g = G0): BernoulliTerms {
  const dynamic = 0.5 * rho * v * v;
  const gravity = rho * g * h;
  return { pressure: P, dynamic, gravity, total: P + dynamic + gravity };
}

/** The constant itself. */
export const bernoulliConstant = (P: number, rho: number, v: number, h: number, g = G0): number =>
  bernoulliTerms(P, rho, v, h, g).total;

/**
 * The pressure at station 2, given everything at station 1.
 *
 *      P₂ = P₁ + ½ρ(v₁² − v₂²) + ρg(h₁ − h₂)
 *
 * Note the sign: v₂ > v₁ makes the bracket negative, so P₂ < P₁. The
 * counter-intuitive result is one minus sign, and it is the same minus sign
 * that lifts an aircraft wing and pulls a shower curtain inwards.
 */
export function pressureDownstream(
  P1: number, rho: number, v1: number, h1: number, v2: number, h2: number, g = G0
): number {
  return P1 + 0.5 * rho * (v1 * v1 - v2 * v2) + rho * g * (h1 - h2);
}

export interface PipeStation {
  /** Distance along the pipe, m. */
  x: number;
  /** Cross-sectional radius, m. */
  radius: number;
  /** Height of the axis above datum, m. */
  height: number;
  area: number;
  speed: number;
  pressure: number;
  terms: BernoulliTerms;
}

/**
 * Solve a whole pipe from its geometry, one inlet speed and one inlet pressure.
 *
 * Every downstream number is DERIVED — continuity fixes the speed, Bernoulli
 * fixes the pressure — so dragging a cross-section in the UI cannot produce a
 * station whose three numbers disagree with each other. The verifier checks
 * both invariants at every station.
 *
 * Returns `null` for a geometry that would need negative absolute pressure:
 * a constriction so tight that ½ρv² exceeds the available head. That is
 * cavitation, it is real, and reporting it beats drawing an impossible pipe.
 */
export function solvePipe(
  geometry: { x: number; radius: number; height: number }[],
  inletSpeed: number,
  inletPressure: number,
  rho = RHO_WATER,
  g = G0
): PipeStation[] | null {
  if (!geometry.length) return null;
  const A0 = areaOfRadius(geometry[0].radius);
  const Q = A0 * inletSpeed;
  const c = bernoulliConstant(inletPressure, rho, inletSpeed, geometry[0].height, g);

  const out: PipeStation[] = [];
  for (const s of geometry) {
    const area = areaOfRadius(s.radius);
    const speed = Q / Math.max(area, 1e-12);
    const pressure = c - 0.5 * rho * speed * speed - rho * g * s.height;
    if (!Number.isFinite(pressure) || pressure < 0) return null;
    out.push({
      x: s.x, radius: s.radius, height: s.height, area, speed, pressure,
      terms: bernoulliTerms(pressure, rho, speed, s.height, g),
    });
  }
  return out;
}

/** Torricelli: water leaving a hole a depth d below the surface leaves at
 *  √(2gd) — exactly the speed it would have reached by FALLING that far. That
 *  is Bernoulli with both pressures atmospheric, and it is the cleanest
 *  one-line proof that the equation is an energy statement. */
export const effluxSpeed = (depth: number, g = G0): number => Math.sqrt(2 * g * Math.max(depth, 0));

/** A Venturi meter reads the flow rate from the pressure DIFFERENCE alone:
 *  Q = A₂√(2ΔP / ρ(1 − (A₂/A₁)²)). The instrument that turns the lesson into a
 *  measurement. */
export function venturiFlow(A1: number, A2: number, deltaP: number, rho = RHO_WATER): number {
  const ratio = A2 / Math.max(A1, 1e-12);
  const denom = rho * (1 - ratio * ratio);
  if (denom <= 1e-12 || deltaP < 0) return NaN;
  return A2 * Math.sqrt((2 * deltaP) / denom);
}

// ── Buoyancy ─────────────────────────────────────────────────────────────────

/**
 * F_B = ρ_fluid · V_displaced · g.
 *
 * READ THE ARGUMENTS. The object's mass is not among them, and neither is its
 * material, its shape or its surface area. The upthrust is decided entirely by
 * the fluid and by how much of it has been shoved aside — which is why a steel
 * ship floats and a steel bolt does not, and why the answer to "does a heavier
 * object sink faster" is "that is not the question".
 */
export const buoyantForce = (rhoFluid: number, displacedVolume: number, g = G0): number =>
  rhoFluid * displacedVolume * g;

export interface FloatResult {
  /** Fraction of the object's volume below the surface, 0…1. */
  submergedFraction: number;
  floats: boolean;
  /** Upthrust when it has settled, N. */
  buoyancy: number;
  /** Weight, N. */
  weight: number;
  /** Net upward force at the settled state (0 when floating, negative when
   *  sinking — the reading that says WHY it sinks). */
  net: number;
  /** Apparent weight when fully submerged, N. Negative means it accelerates up. */
  apparentWeight: number;
}

/**
 * Where an object settles when released in a fluid.
 *
 * The whole result turns on ONE ratio, ρ_object/ρ_fluid, and nothing else:
 *   < 1 → floats with that exact fraction submerged (ice: 0.917, so 92% under);
 *   = 1 → hovers, neutrally buoyant, at any depth;
 *   > 1 → sinks, and the shortfall is what the scale would read underwater.
 */
export function floatOrSink(
  massKg: number, volume: number, rhoFluid: number, g = G0
): FloatResult {
  const rhoObj = massKg / Math.max(volume, 1e-12);
  const weight = massKg * g;
  const fullBuoyancy = buoyantForce(rhoFluid, volume, g);
  const floats = rhoObj < rhoFluid;
  const submergedFraction = floats ? rhoObj / rhoFluid : 1;
  const buoyancy = buoyantForce(rhoFluid, volume * submergedFraction, g);
  return {
    submergedFraction,
    floats,
    buoyancy,
    weight,
    net: buoyancy - weight,
    apparentWeight: weight - fullBuoyancy,
  };
}

export const densityOf = (massKg: number, volume: number): number => massKg / Math.max(volume, 1e-12);

// ── Terminal velocity — the moment the free-body diagram balances ────────────

/**
 * Stokes drag on a sphere: F = 6πηrv, opposing the motion.
 *
 * Valid at low Reynolds number — a ball bearing in glycerine, a raindrop the
 * size of mist. A cricket ball in air is nowhere near this regime, which is
 * why the projectile module uses a quadratic law instead. Naming the regime is
 * part of the physics, not a footnote.
 */
export const stokesDrag = (eta: number, radius: number, v: number): number =>
  6 * Math.PI * eta * radius * v;

/**
 * TERMINAL VELOCITY IS NOT A PROPERTY OF THE BALL. It is the speed at which
 * the free-body diagram closes:
 *
 *      weight (down)  =  buoyancy (up)  +  drag (up)
 *      mg             =  ρ_f V g        +  6πηr·v_t
 *      ⇒  v_t = (mg − ρ_f V g) / 6πηr
 *
 * Everything above the fraction line is the NET downward pull the fluid has
 * not already cancelled; everything below is how hard the fluid resists per
 * unit speed. Change either and v_t moves — which is the FBD Studio idea
 * (PHYSICS_SIMULATION_PROGRAM.md §5.1) applied to a fluid: the balance point
 * is the answer, and the answer is only ever the balance point.
 */
export function terminalVelocityStokes(
  massKg: number, volume: number, radius: number, eta: number, rhoFluid: number, g = G0
): number {
  const net = massKg * g - rhoFluid * volume * g;
  return net / (6 * Math.PI * eta * Math.max(radius, 1e-9));
}

/** The same balance with a quadratic drag law F = kv²: v_t = √(net/k). */
export const terminalVelocityQuadratic = (netForce: number, k: number): number =>
  Math.sqrt(Math.max(netForce, 0) / Math.max(k, 1e-12));

export interface FallState {
  t: number;
  /** Depth fallen, m (positive downward). */
  depth: number;
  /** Downward speed, m/s. */
  speed: number;
  /** Net downward force at this instant, N — reaches zero AT v_t. */
  net: number;
}

/**
 * The approach to terminal velocity, integrated with the FROZEN E2 RK4.
 *
 * Packed into the y channel: `pos.y` is depth, `vel.y` is downward speed. The
 * exact solution is v(t) = v_t(1 − e^{−t/τ}) with τ = m/6πηr, so the verifier
 * has a closed form to check the integration against — and the sim can honestly
 * say "it never quite arrives, it just stops being distinguishable".
 */
export function fallToTerminal(
  massKg: number, volume: number, radius: number, eta: number, rhoFluid: number,
  tMax: number, g = G0, dt = DEFAULT_DT
): FallState[] {
  const netGravity = massKg * g - rhoFluid * volume * g;
  const b = 6 * Math.PI * eta * Math.max(radius, 1e-9);
  const accel: AccelFn = (s: MotionState) => ({ x: 0, y: (netGravity - b * s.vel.y) / massKg });
  const tr = integrate({ t: 0, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 } }, accel, {
    dt,
    stop: (s) => s.t >= tMax,
    maxSteps: Math.ceil(tMax / dt) + 8,
  });
  return tr.points.map((s) => ({
    t: s.t, depth: s.pos.y, speed: s.vel.y, net: netGravity - b * s.vel.y,
  }));
}

/** Time constant τ = m/6πηr. After 3τ the ball is within 5% of terminal, after
 *  5τ within 0.7% — the honest answer to "how long does it take". */
export const terminalTimeConstant = (massKg: number, radius: number, eta: number): number =>
  massKg / (6 * Math.PI * eta * Math.max(radius, 1e-9));

/** v(t) = v_t(1 − e^{−t/τ}) — the closed form the integration is checked against. */
export const terminalApproach = (vt: number, tau: number, t: number): number =>
  vt * (1 - Math.exp(-t / tau));
