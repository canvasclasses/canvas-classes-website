/*
 * field-bench/lib/constants.ts — SI constants, one place.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM — so `scripts/verify-field-bench.mjs` can check every
 * academic claim with a plain node run (PHYSICS_SIMULATION_PROGRAM.md §9).
 *
 * ⚠ K_E IS DERIVED FROM EPS0, NOT QUOTED SEPARATELY. The Gauss lab shows the
 * measured flux ∮E·n dl beside the predicted q/ε₀ and claims they are the same
 * number. If ε₀ and k were two independently rounded literals, those two
 * readouts would differ in the 5th digit and the lesson would be undermined by
 * our own arithmetic. Deriving one from the other makes the agreement exact to
 * floating point, which is what the verifier demands.
 */

/** Permittivity of free space, F/m (CODATA 2018). */
export const EPS0 = 8.8541878128e-12;

/** Coulomb constant 1/(4πε₀) ≈ 8.988×10⁹ N·m²/C². Derived — see the header. */
export const K_E = 1 / (4 * Math.PI * EPS0);

/** Permeability of free space, T·m/A. Exact by the old definition; the CODATA
 *  2018 value differs in the 10th digit, far below anything a student reads. */
export const MU0 = 4e-7 * Math.PI;

/** Newton's gravitational constant, N·m²/kg². */
export const G_NEWTON = 6.674e-11;

/** Elementary charge, C. Also the joules-per-electronvolt conversion. */
export const ELEMENTARY_CHARGE = 1.602176634e-19;
export const EV_IN_JOULES = ELEMENTARY_CHARGE;

/** Planck's constant, J·s. */
export const PLANCK = 6.62607015e-34;

/** Electron rest mass, kg. */
export const ELECTRON_MASS = 9.1093837015e-31;

/** Earth, for the gravitation archetypes. */
export const EARTH_MASS = 5.972e24;
export const EARTH_RADIUS = 6.371e6;

/**
 * Closest approach used when a sampler would otherwise divide by zero.
 *
 * 1 µm, i.e. five to six orders of magnitude below anything a scene places on
 * screen, so it can never round a number a student reads — it only stops an
 * Infinity from poisoning a path or a contour grid.
 */
export const R_MIN = 1e-6;
