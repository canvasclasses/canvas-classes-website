/*
 * motion-lab/types.ts — E2 ENGINE CONTRACT. Frozen surface.
 * ─────────────────────────────────────────────────────────────────────────────
 * 2-D kinematics: the integrator, the reference-frame transforms, and the
 * synchronized "strip" model that lets a trajectory be shown beside its own
 * independent x and y movies.
 *
 * Pure — no React, no DOM. Same convention as every other engine: x right,
 * y UP, angles degrees CCW from +x, SI units.
 *
 * Shares `HandoffEnvelope` with mechanics-bench so a body that leaves a
 * circular track or slides off an incline CONTINUES here without a reset.
 * That handoff is design law #4 in PHYSICS_SIMULATION_PROGRAM.md §2.
 */

import type { Vec2, HandoffEnvelope } from '../mechanics-bench/types';

export type { Vec2, HandoffEnvelope };

// ── State and integration ────────────────────────────────────────────────────

export interface MotionState {
  /** s */
  t: number;
  /** m */
  pos: Vec2;
  /** m/s */
  vel: Vec2;
}

/** Acceleration as a function of state — gravity, drag, tension, Lorentz, all
 *  expressed the same way so one integrator serves every E2 archetype. */
export type AccelFn = (s: MotionState) => Vec2;

export interface DragModel {
  /** Drag coefficient. F_drag = -k·v (linear) or -k·|v|·v (quadratic). */
  k: number;
  quadratic?: boolean;
}

export interface IntegratorOptions {
  /** s — fixed step. RK4 at dt = 1/240 is exact enough for every use here. */
  dt: number;
  /** Stop when this returns true (ground hit, target reached, track left). */
  stop?: (s: MotionState) => boolean;
  /** Hard cap on steps, so a never-stopping scene can't hang the tab. */
  maxSteps?: number;
}

/** A fully integrated path plus the events worth marking on it. */
export interface Trajectory {
  points: MotionState[];
  /** Set when `stop` fired; absent when maxSteps ran out. */
  stoppedAt?: MotionState;
  events: TrajectoryEvent[];
}

export interface TrajectoryEvent {
  kind: 'apex' | 'landing' | 'range' | 'max-speed' | 'custom';
  at: MotionState;
  label?: string;
}

// ── Reference frames — the misconception engine for E2 ───────────────────────

/**
 * A frame is defined by how it moves relative to the ground frame. Rendering
 * the SAME trajectory in two frames — parabola vs straight-line-down for a ball
 * dropped from a moving trolley — is the point of the whole projectile module,
 * and the reason centrifugal force can be made to appear and disappear on
 * demand in the circular-motion module.
 */
export type FrameSpec =
  | { kind: 'ground' }
  | { kind: 'translating'; vel: Vec2; origin?: Vec2 }
  | { kind: 'accelerating'; accel: Vec2; vel0?: Vec2; origin?: Vec2 }
  | { kind: 'rotating'; omega: number; centre: Vec2 };

/** Whether a frame is inertial decides whether a pseudo-force is REQUIRED or
 *  is a grading error. Both engines read this flag. */
export const isInertial = (f: FrameSpec): boolean =>
  f.kind === 'ground' || f.kind === 'translating';

// ── The strip model — design law #3 for kinematics ───────────────────────────

/**
 * A "strip" is one synchronized 1-D view of a 2-D motion. Playing the x-strip
 * (constant velocity) and the y-strip (free fall) beside the trajectory, in
 * lockstep, IS the concept of projectile independence — and it is exactly what
 * a printed figure cannot do.
 */
export type StripAxis = 'x' | 'y' | 'speed' | 'vx' | 'vy' | 'ax' | 'ay';

export interface StripSpec {
  axis: StripAxis;
  label: string;
  /** Draw as a moving dot on a number line, or as a value-vs-time graph. */
  mode: 'line' | 'graph';
  unit?: string;
  accent?: 'violet' | 'sky' | 'emerald' | 'amber' | 'pink' | 'orange';
}

// ── Circular motion ──────────────────────────────────────────────────────────

export interface CircularSpec {
  /** m */
  radius: number;
  /** kg */
  mass: number;
  /** rad/s — signed; positive is CCW. */
  omega: number;
  /** Vertical circles feel gravity; horizontal ones (turntable) do not. */
  plane: 'vertical' | 'horizontal';
  /** What provides the centripetal force — decides what "fails" looks like. */
  agent: 'string' | 'rod' | 'track-inside' | 'track-outside' | 'friction' | 'gravity';
  /** For a banked-road archetype. */
  bankDeg?: number;
  mu_s?: number;
  /** Non-uniform circular motion: tangential acceleration, m/s². */
  alphaTangential?: number;
}

/** What the sim reports at the current instant — every number the student can
 *  see must come from here, so there is one source of truth on screen. */
export interface CircularReadout {
  /** m/s */
  speed: number;
  /** m/s² */
  centripetal: number;
  tangential: number;
  total: number;
  /** N — the force from `agent`. Negative means it would have to PULL outward,
   *  i.e. a string has gone slack and the body leaves the track. */
  agentForce: number;
  /** True when the constraint has failed at this instant. */
  released: boolean;
  /** Speed below which a vertical circle cannot be completed: √(gr) at the top. */
  vMinTop?: number;
  /** Banked-road safe band. */
  vMin?: number;
  vMax?: number;
}

// ── Archetypes ───────────────────────────────────────────────────────────────

export type MotionScenarioId =
  | 'projectile' | 'projectile-incline' | 'monkey-hunter' | 'relative'
  | 'circular' | 'vertical-circle' | 'banked-road' | 'graphs';

export interface MotionArchetype {
  id: string;
  title: string;
  summary: string;
  scenario: MotionScenarioId;
  params?: {
    key: string;
    label: string;
    kind: 'number' | 'boolean' | 'select';
    default: number | boolean | string;
    min?: number; max?: number; step?: number;
    options?: string[];
    unit?: string;
  }[];
  defaultSteps?: { say: string; cta: string }[];
  /** The misconception this construction is built to attack. */
  targets?: MotionMisconception;
}

// ── Exercise/grading vocabulary shared by E2 archetypes ──────────────────────

export type MotionMisconception =
  | 'radial_departure'          // "it flies outward when the string is cut"
  | 'centrifugal_in_ground'     // outward force in the ground frame
  | 'velocity_zero_at_apex'     // "everything is zero at the top"
  | 'accel_zero_at_apex'        // g never switches off
  | 'coupled_components'        // "horizontal motion slows because it rises"
  | 'heavier_falls_faster'
  | 'range_always_max_at_45'    // false with release height or drag
  | 'speed_constant_in_ucm_means_no_accel'
  | 'frame_confusion'
  // ── Unit 1: motion graphs and relative motion (added 2026-07-30) ───────────
  // The two starred ones are the headline errors of the whole kinematics unit
  // and, until the Motion Graph Studio was built, were attacked by NO surface
  // anywhere in the program — PHYSICS_SIM_QA_2026-07-29.md §5 item 5 says so.
  | 'positive_a_means_speeding_up'            // ★ not when v < 0 — a does not give direction
  | 'retardation_is_negative_acceleration'    // ★ retardation means a OPPOSES v
  | 'flat_xt_means_constant_velocity'         // a flat x–t line is AT REST
  | 'steeper_means_higher_up'                 // height is where, slope is how fast
  | 'xt_curve_is_the_path'                    // an x–t curve is a schedule, not a map
  | 'area_under_vt_is_speed'                  // it is the displacement
  | 'distance_equals_displacement'            // only if you never turn back
  | 'average_v_is_mean_of_endpoints'          // only under uniform acceleration
  | 'avg_equals_instantaneous'
  | 'at_rest_means_zero_acceleration'         // v = 0 at a turning point, a ≠ 0
  | 'relative_velocity_adds_scalars'
  | 'river_crossing_min_time_equals_min_drift'
  | 'rain_direction_is_absolute'
  // ── Unit 6: oscillations and waves (added 2026-07-30) ──────────────────────
  | 'shm_period_depends_on_amplitude'
  | 'shm_and_circular_motion_unrelated'
  | 'shm_v_and_a_peak_together'
  | 'pendulum_period_depends_on_mass'
  | 'pendulum_always_simple_harmonic'
  | 'shm_energy_lost_at_centre'
  | 'waves_destroy_each_other'
  | 'beat_frequency_is_half_the_difference'
  | 'standing_wave_is_a_single_wave'
  | 'string_pitch_depends_on_length_only'
  | 'doppler_only_relative_speed_matters'
  | 'resonance_amplitude_independent_of_damping'
  // ── Units 7–8: thermodynamics, kinetic theory and fluids (added 2026-07-30) ─
  | 'work_is_p_times_delta_v_always'
  | 'adiabatic_means_constant_temperature'
  | 'internal_energy_is_path_dependent'
  | 'cycle_does_no_work_because_it_returns'
  | 'efficiency_can_reach_one'
  | 'better_fuel_means_better_efficiency'
  | 'fridge_creates_cold'
  | 'all_molecules_move_at_the_same_speed'
  | 'heavier_gas_moves_faster_at_same_temperature'
  | 'narrow_pipe_means_higher_pressure'
  | 'buoyancy_depends_on_object_mass'
  | 'terminal_velocity_means_no_forces';

export interface MotionIssue {
  code: MotionMisconception;
  message: string;
  hint?: string;
}
