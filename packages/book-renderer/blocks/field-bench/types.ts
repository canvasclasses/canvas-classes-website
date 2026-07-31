/*
 * field-bench/types.ts — E5 ENGINE CONTRACT. Frozen surface.
 * ─────────────────────────────────────────────────────────────────────────────
 * A scalar/vector field sampler, a test-charge tracer, and closed surfaces for
 * flux. Serves electrostatics, magnetism, gravitation and the photoelectric
 * effect — anything where the teaching object is a FIELD rather than a body.
 *
 * The two invisible steps this exists to show (§4, units 9 and 11):
 *   • field lines are perpendicular to equipotentials — always, everywhere;
 *   • flux through a closed surface depends ONLY on the enclosed charge, which
 *     you learn by dragging the surface around and watching it not change.
 *
 * Trajectories are integrated by motion-lab's RK4, not by a second integrator
 * here — a charge released in a field is the same physics as a projectile, and
 * sharing the integrator is what makes that claim true rather than rhetorical.
 *
 * Pure — no React, no DOM. SI units.
 */

import type { Vec2 } from '../mechanics-bench/types';
export type { Vec2 };

// ── Sources ──────────────────────────────────────────────────────────────────

export type SourceKind =
  | 'point-charge' | 'dipole' | 'line-charge' | 'sheet-charge' | 'ring-charge'
  | 'point-mass' | 'current-wire' | 'current-loop' | 'solenoid' | 'bar-magnet'
  | 'uniform-E' | 'uniform-B';

export interface FieldSource {
  id: string;
  kind: SourceKind;
  pos: Vec2;
  /**
   * Coulombs for charges, kilograms for masses, amperes for currents,
   * or the field magnitude (V/m, T) for the two uniform kinds.
   */
  strength: number;
  /** Degrees CCW from +x — orientation for dipoles, wires, uniform fields. */
  angleDeg?: number;
  /** m — radius for rings, loops and solenoids; half-length for a finite line. */
  radius?: number;
  length?: number;
  label?: string;
  /** Fixed sources cannot be dragged by the student. */
  fixed?: boolean;
}

export type FieldKind = 'electric' | 'magnetic' | 'gravitational';

export interface FieldScene {
  kind: FieldKind;
  sources: FieldSource[];
  /** Test particles released into the field; their paths come from motion-lab. */
  testCharges?: TestCharge[];
  /** Closed surfaces for the Gauss exercise. */
  surfaces?: GaussSurface[];
}

export interface TestCharge {
  id: string;
  pos: Vec2;
  vel?: Vec2;
  /** C (electric) or kg (gravitational). Sign matters and is the point. */
  charge: number;
  mass: number;
  label?: string;
}

// ── Sampling ─────────────────────────────────────────────────────────────────

/** The field and potential at a point. `potential` is null for magnetic fields —
 *  there is no scalar magnetic potential, and pretending otherwise would teach
 *  a falsehood, so the type forbids it rather than returning 0. */
export interface FieldSample {
  at: Vec2;
  field: Vec2;
  magnitude: number;
  potential: number | null;
}

export interface FieldLine {
  points: Vec2[];
  /** Which source it started on, and whether it left the scene or terminated. */
  fromSourceId?: string;
  end: 'sink' | 'escaped' | 'max-steps';
}

export interface Equipotential {
  /** The constant value this contour traces (V, or J/kg for gravity). */
  value: number;
  loops: Vec2[][];
}

// ── Gauss ────────────────────────────────────────────────────────────────────

export interface GaussSurface {
  id: string;
  shape: 'circle' | 'rectangle';
  /** Centre and size (m). A "sphere" in this 2-D engine is a circle whose flux
   *  is computed per unit length — stated explicitly in the UI, never fudged. */
  centre: Vec2;
  radius?: number;
  size?: { w: number; h: number };
  label?: string;
}

export interface FluxResult {
  surfaceId: string;
  /** N·m²/C per unit length in this 2-D reduction. */
  flux: number;
  /** Total source strength strictly inside the surface. */
  enclosed: number;
  /** flux vs enclosed/ε₀ — these must agree, and showing them agreeing while
   *  the surface is dragged IS the lesson. */
  predictedFlux: number;
  /** Sources sitting on the boundary make the answer ill-defined; say so
   *  rather than silently counting or dropping them. */
  onBoundary: string[];
}

// ── Misconceptions ───────────────────────────────────────────────────────────

export type FieldMisconception =
  | 'field_lines_are_paths'          // "a charge follows the field line"
  | 'flux_depends_on_surface_shape'
  | 'flux_depends_on_position_inside'
  | 'field_inside_conductor_nonzero'
  | 'equipotential_not_perpendicular'
  | 'magnetic_force_does_work'       // qv×B does zero work — speed never changes
  | 'field_needs_a_test_charge'      // the field exists without one
  | 'potential_is_potential_energy'
  | 'g_constant_inside_earth'
  // ── Electromagnetic induction (unit 11) ──────────────────────────────────
  // Added when the EMI bench landed. The nine above are electrostatics, Gauss,
  // gravitation and the one magnetism code, and only `magnetic_force_does_work`
  // is honestly reusable for induction — it is exactly right for the rod on
  // rails, where the field brokers the energy and supplies none of it.
  | 'emf_from_flux_not_its_rate'            // a big flux is not a big EMF
  | 'flux_ignores_orientation'              // Φ = B A cos θ, not B A
  | 'induced_current_has_a_fixed_direction' // it reverses when the change reverses
  | 'inductor_opposes_current_not_change'   // steady current, no back-EMF
  | 'steady_current_induces_a_secondary_emf'
  | 'eddy_currents_are_about_being_metal'   // it is the LOOP SIZE, not the metal
  | 'induced_effects_are_free_energy'       // the heat came off whatever pushed
  // ── Nuclear physics (unit 13) ────────────────────────────────────────────
  // Added when the Nuclear Bench landed. Not one of the sixteen above can express
  // a belief about a nucleus: they are about fields, and a nucleus is about mass,
  // energy and probability. `potential_is_potential_energy` was the closest
  // candidate and it is a genuinely DIFFERENT confusion — volts against joules,
  // not mass against energy — so it was left alone rather than stretched.
  | 'bigger_nucleus_more_tightly_bound'     // total BE grows; BE PER NUCLEON decides
  | 'mass_and_energy_are_separate'          // Δm IS the energy, at 931.494 MeV/u
  | 'fission_energy_from_size_not_binding'  // "big things break", not "it moved up the curve"
  | 'fission_and_fusion_are_opposites'      // both climb the SAME curve, from opposite sides
  | 'half_life_is_half_the_lifetime'        // after 2 half-lives a QUARTER is left, not zero
  | 'nucleus_contains_electrons';           // β⁻ CREATES one; a neutron became a proton

export interface FieldIssue {
  code: FieldMisconception;
  /**
   * The wrong belief in the STUDENT'S own words, quoted — "half-life is half the
   * time it takes to decay away".
   *
   * Optional because the original nine codes predate this field and their
   * `message` already opens by naming the belief. Where it IS present the card
   * leads with it, because a student who reads their own thought in quotation
   * marks engages with the correction instead of skimming a paragraph of correct
   * physics they think they already agree with.
   */
  belief?: string;
  message: string;
  hint?: string;
}

// ── Archetypes ───────────────────────────────────────────────────────────────

export interface FieldArchetype {
  id: string;
  title: string;
  summary: string;
  mode: 'sculptor' | 'gauss' | 'trajectory' | 'photoelectric' | 'emi';
  /**
   * Which field this construction is about. Declaring it here is redundant with
   * the built `FieldScene.kind`, and deliberately so: the admin editor groups
   * the catalogue by kind × mode, and without this it has to call `build()`
   * inside a try/catch just to find out what a row is. Metadata a picker needs
   * should be readable without executing the engine.
   */
  kind?: FieldKind;
  params?: {
    key: string; label: string; kind: 'number' | 'boolean' | 'select';
    default: number | boolean | string;
    min?: number; max?: number; step?: number; options?: string[]; unit?: string;
  }[];
  build(params?: Record<string, number | string | boolean>): FieldScene;
  defaultSteps?: { say: string; cta: string }[];
  targets?: FieldMisconception;
}
