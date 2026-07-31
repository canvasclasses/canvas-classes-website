/*
 * mechanics-bench/types.ts — E1 ENGINE CONTRACT. Frozen surface.
 * ─────────────────────────────────────────────────────────────────────────────
 * The scene graph, the ground-truth force model, the FBD grading vocabulary,
 * and the constraint/solve result shapes for the mechanics engine.
 *
 * This file is a CONTRACT: FBD Studio, Pulley Lab and every future E1 archetype
 * are written against it. Nothing here imports React or touches the DOM, and
 * every lib/ module that consumes it is a pure function — so the physics can be
 * verified by a plain node script, exactly like vector-lab/lib/vectorMath.ts.
 *
 * CONVENTION (inherited from vectorMath.ts, shared across all five engines):
 * all coordinates are PHYSICS coordinates — x right, y UP, angles in degrees
 * CCW from +x. The SVG layer is the only place that flips y. SI units
 * throughout: metres, kilograms, seconds, newtons.
 *
 * See _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §3 and §5.
 */

export interface Vec2 { x: number; y: number }

// ── Reserved world body ids ──────────────────────────────────────────────────
// Contacts and forces name their agent. These are the non-body agents.
export const WORLD = {
  earth: 'world:earth',      // the agent of weight
  ground: 'world:ground',
  wall: 'world:wall',
  ceiling: 'world:ceiling',
  hand: 'world:hand',        // an external applied force with a named agent
} as const;

// ── Scene graph ──────────────────────────────────────────────────────────────

export type BodyShape = 'block' | 'sphere' | 'wedge' | 'rod' | 'pulley';

export interface Body {
  id: string;
  shape: BodyShape;
  /** kg. 0 means the massless idealisation (ideal pulley, light string node). */
  mass: number;
  /** m, world coordinates of the centre of mass. */
  pos: Vec2;
  /** m. Blocks/wedges use w,h; spheres and pulleys use `radius`. */
  size?: { w: number; h: number };
  radius?: number;
  /** Orientation, degrees CCW from +x. A wedge's `angleDeg` IS its incline angle. */
  angleDeg?: number;
  /** kg m². Only rotating bodies (a pulley WITH mass) need this. */
  inertia?: number;
  /** Pinned to the world — ground, wall, ceiling, a fixed pulley's axle. */
  fixed?: boolean;
  /**
   * The single translational degree of freedom this body is solved along,
   * degrees CCW from +x. A hanging mass is 270 (down-positive is -90/270); a
   * block on a 30° incline is 210 (down-slope). Archetypes set this; the solver
   * reports each body's signed scalar acceleration along its own DOF axis.
   */
  dofDeg?: number;
  label?: string;
}

/**
 * A surface contact between two bodies. EVERY contact contributes exactly one
 * normal force to each participant (Newton's third law), and at most one
 * friction force. The grader derives "you're touching something, so something
 * pushes" directly from this list — which is what makes missing-normal
 * detectable rather than hardcoded.
 */
export interface Contact {
  id: string;
  /** The body whose FBD gains the normal. */
  bodyA: string;
  /** What A rests on / presses against — another body id or a WORLD.* id. */
  bodyB: string;
  /** Direction of the normal force ON bodyA, degrees CCW from +x. */
  normalDeg: number;
  mu_s?: number;
  mu_k?: number;
  /**
   * Relative sliding of A over B along the tangent, as a sign.
   *  0 → not sliding (static friction, magnitude unknown until solved, capped at mu_s*N)
   * ±1 → sliding; kinetic friction opposes it, so its direction is KNOWN.
   * `undefined` → the archetype has not decided; the solver infers it.
   */
  slidingSign?: -1 | 0 | 1;
}

/**
 * An inextensible string. `path` is the ordered list of what it runs between
 * and over: body ids and pulley ids. ['m1','p1','m2'] is a mass, over a pulley,
 * to another mass. The constraint deriver walks this path to build the
 * length-invariance equation — it is NOT a lookup table of known cases.
 */
export interface StringLink {
  id: string;
  path: string[];
  /** false models a slack string (zero tension) — the vertical-circle moment. */
  taut: boolean;
  /** default true. A heavy string makes tension vary along its length. */
  massless?: boolean;
  label?: string;
}

export interface SpringLink {
  id: string;
  from: string;
  to: string;
  /** N/m */
  k: number;
  /** m */
  naturalLength: number;
  label?: string;
}

/** An externally applied push/pull with a NAMED agent — students must be able
 *  to answer "what is applying this?", so `from` is required. */
export interface AppliedForce {
  id: string;
  body: string;
  from: string;
  /** N */
  mag: number;
  angleDeg: number;
  label?: string;
}

export type ReferenceFrame =
  | { kind: 'inertial' }
  | { kind: 'accelerating'; a: Vec2 }
  | { kind: 'rotating'; omega: number; centre: Vec2 };

export interface Scene {
  bodies: Body[];
  contacts: Contact[];
  strings: StringLink[];
  springs?: SpringLink[];
  applied?: AppliedForce[];
  /** m/s², default 9.8 */
  g?: number;
  /**
   * The frame the FBD is drawn in. This is the whole non-inertial teaching
   * mechanism: in 'inertial' a pseudo-force is a GRADING ERROR; in the other
   * two it is REQUIRED. Same scene, opposite correct answers.
   */
  frame?: ReferenceFrame;
}

// ── Ground-truth forces ──────────────────────────────────────────────────────

export type ForceKind =
  | 'weight' | 'normal' | 'friction' | 'tension' | 'applied' | 'spring' | 'pseudo';

export interface TrueForce {
  id: string;
  kind: ForceKind;
  /** Whose FBD this belongs on. */
  onBody: string;
  /** The agent applying it. Weight's agent is WORLD.earth — always. */
  fromBody: string;
  /** Degrees CCW from +x. Meaningful only when `directionKnown`. */
  angleDeg: number;
  /** Symbolic label: 'mg', 'N₁', 'T', 'f', 'kx'. Rendered before solving. */
  magSymbol: string;
  /** Filled in by the solver. */
  magnitude?: number;
  /** Where on the body it acts (m, body-local). Contact forces act at the contact. */
  applicationPoint?: Vec2;
  /**
   * false for static friction whose sense isn't fixed until the system is
   * solved. The grader must not mark a direction wrong when it was never
   * determined — this flag is what prevents that false negative.
   */
  directionKnown: boolean;
  /** The contact/string/spring this force came from, for the cut tool. */
  sourceId?: string;
}

// ── The student's drawing, and how it is graded ───────────────────────────────

export interface StudentForce {
  id: string;
  /** 'unknown' when the student drew an arrow without labelling it. */
  kind: ForceKind | 'unknown';
  onBody: string;
  angleDeg: number;
  magnitude?: number;
  label?: string;
  /**
   * The agent the student NAMED. The "name the object applying this force"
   * interaction is the whole anti-ghost-force mechanism: a force with no
   * nameable agent is not a force.
   */
  claimedFrom?: string;
  applicationPoint?: Vec2;
}

export type MisconceptionCode =
  // omissions
  | 'missing_weight'
  | 'missing_normal'
  | 'missing_tension'
  | 'missing_friction'
  | 'missing_applied'
  | 'missing_spring'
  | 'missing_pseudo_in_noninertial'
  // inventions
  | 'ghost_motion_force'          // "force of motion" / "force of the throw"
  | 'ghost_centrifugal'           // outward force drawn in a GROUND frame
  | 'pseudo_in_inertial_frame'
  | 'third_law_pair_same_body'    // N and its reaction both on the block
  | 'extra_force'                 // an arrow with no derivable source
  /**
   * A correctly-drawn arrow the student did not attribute to an agent. This is
   * deliberately its OWN code and only ever a warning: a right arrow that has
   * not been named yet must never be accused of being a ghost force, or the
   * "name the object applying this" prompt would punish correct work.
   */
  | 'force_agent_unnamed'
  // wrong geometry
  | 'normal_not_perpendicular'    // normal drawn vertical on an incline
  | 'weight_not_vertical'         // weight drawn perpendicular to the incline
  | 'tension_wrong_direction'     // tension pushing instead of pulling
  | 'friction_wrong_sense'
  // wrong magnitude
  | 'friction_exceeds_max'        // f > mu_s*N
  | 'normal_equals_mg_on_incline' // N = mg instead of mg cos θ
  | 'magnitude_wrong'
  // ── Phase 2: energy, collisions, rotation, orbits (added 2026-07-30) ───────
  // These arrived with the energy/rotation libraries. They are listed here
  // rather than forced into an FBD-shaped code because a mislabelled
  // misconception corrupts the analytics on what students actually get wrong,
  // which is the only reason this vocabulary exists. Diagnostic copy for each
  // lives in `energy/kit/phase2.ts`.
  | 'friction_destroys_energy'
  | 'speed_depends_on_path'
  | 'heat_is_not_energy'
  | 'loop_top_only_needs_to_arrive'
  | 'mass_changes_the_loop'
  | 'equal_mass_elastic_both_move'
  | 'momentum_lost_when_they_stick'
  | 'ke_conserved_in_every_collision'
  | 'com_frame_changes_the_physics'
  | 'work_is_force_times_distance_always'
  | 'spring_work_is_always_half_kx2'
  | 'orbit_has_no_gravity'
  | 'escape_means_gravity_ends'
  | 'faster_means_lower_orbit'
  | 'heavier_rolls_faster'
  | 'bigger_radius_rolls_faster'
  | 'rolling_energy_all_translational'
  | 'torque_ignores_the_angle'
  | 'balance_means_equal_masses'
  | 'contact_point_moves_with_the_wheel'
  | 'top_of_the_wheel_moves_at_v'
  | 'l_conserved_means_ke_conserved'
  | 'spinning_faster_is_free'
  // ── Pulley Lab: constraint-shaped misconceptions (added 2026-07-30) ────────
  // Added after the Pulley archetypes were deliberately left with `targets`
  // blank rather than filed under `magnitude_wrong` — a constraint error is not
  // "an arrow drawn the wrong size", and filing it there would have poisoned the
  // analytics these codes exist to feed. An honest 4/5 beat a dishonest 5/5.
  | 'pulley_multiplies_force'            // MA = 1 on a fixed sheave; only direction changes
  | 'tilt_changes_the_constraint'        // the rope's length invariance does not care about θ
  | 'machine_gives_free_work'            // force ÷ n, distance × n, work unchanged
  | 'tension_equal_across_any_pulley'    // true only for a MASSLESS sheave
  | 'movable_pulley_is_a_ceiling'        // a movable sheave accelerates; it is another body
  | 'accelerations_same_in_every_frame'; // ground vs the accelerating support

export interface GradeIssue {
  code: MisconceptionCode;
  severity: 'error' | 'warning';
  /** The student arrow at fault, when the issue is about one they drew. */
  forceId?: string;
  /** The ground-truth force they missed, when the issue is an omission. */
  trueForceId?: string;
  /** The diagnostic sentence shown to the student. Names the misconception —
   *  never just "wrong". See PHYSICS_SIMULATION_PROGRAM.md §5.1. */
  message: string;
  /** An optional second-line nudge, revealed on request. */
  hint?: string;
}

export interface GradeResult {
  correct: boolean;
  issues: GradeIssue[];
  /** studentForce.id → trueForce.id for every arrow that was accepted. */
  matched: Record<string, string>;
  /** Ground-truth forces with no student arrow. */
  missing: string[];
  /** Student arrows that matched nothing. */
  spurious: string[];
}

// ── The cut tool: system boundary ────────────────────────────────────────────

export interface CutResult {
  /** Bodies inside the boundary. */
  inside: string[];
  /** Forces crossing the boundary — these survive on the composite FBD. */
  external: TrueForce[];
  /**
   * Forces wholly inside — these cancel in third-law pairs and VANISH. Pairing
   * them up is the point: the UI greys each pair out together.
   */
  internal: { a: TrueForce; b: TrueForce }[];
  /** Total mass of the composite body. */
  totalMass: number;
}

// ── Constraints and solving ──────────────────────────────────────────────────

/**
 * One linear constraint: Σ coeff_i · a_i = rhs, where a_i is body i's signed
 * scalar acceleration along its own `dofDeg` axis.
 *
 * `derivation` and `segments` exist so the UI can SHOW where the equation came
 * from — the string segments colour-matched to their terms. That ledger is the
 * entire pedagogical point of Pulley Lab; a bare equation would be worthless.
 */
export interface ConstraintEquation {
  id: string;
  terms: { bodyId: string; coeff: number }[];
  rhs: number;
  /** Human-readable, e.g. "string s1 has constant length → a₁ + a₂ = 2a₃". */
  derivation: string;
  /** LaTeX form for the ledger panel. */
  latex: string;
  /** Which string segment contributed which term — drives the colour matching. */
  segments?: { stringId: string; bodyId: string; coeff: number }[];
}

export interface SolveResult {
  /** body id → signed scalar acceleration along that body's dofDeg axis (m/s²). */
  accelerations: Record<string, number>;
  /** string id → tension (N). */
  tensions: Record<string, number>;
  /** contact id → normal magnitude (N). */
  normals: Record<string, number>;
  /** contact id → signed friction along the tangent (N). */
  frictions: Record<string, number>;
  /** The constraints that were used, for the ledger. */
  constraints: ConstraintEquation[];
  /** The ΣF = ma lines as LaTeX, one per body per axis, in solve order. */
  equations: string[];
  /** True when the system was under-determined — the UI must say so, not lie. */
  singular: boolean;
  /** Contacts where the solved normal came out negative → surfaces separate. */
  brokenContacts: string[];
  /** Strings where the solved tension came out negative → the string went slack. */
  slackStrings: string[];
  warnings: string[];
}

// ── Archetypes ───────────────────────────────────────────────────────────────

/**
 * A named construction. The engine ships the archetype library as code; every
 * exercise on every page is a `mechanics_bench` block naming one of these plus
 * params. Same contract as vector-board/archetypes.ts — `buildScene` must be
 * PURE so the physics is node-verifiable.
 */
export interface MechanicsArchetype {
  id: string;
  title: string;
  /** One line, shown in the admin picker. */
  summary: string;
  mode: 'fbd' | 'pulley' | 'solve';
  /** Author-tunable knobs, for the admin editor to render as inputs. */
  params?: {
    key: string;
    label: string;
    kind: 'number' | 'boolean' | 'select';
    default: number | boolean | string;
    min?: number; max?: number; step?: number;
    options?: string[];
    unit?: string;
  }[];
  buildScene(params?: Record<string, number | string | boolean>): Scene;
  /** The guided script: each entry states what is about to happen, then the
   *  student clicks and exactly one element appears. */
  defaultSteps?: { say: string; cta: string }[];
  /** Which body the FBD task isolates when the block doesn't say. */
  defaultBody?: string;
  /**
   * The misconception this construction exists to attack.
   *
   * ADDED 2026-07-30. Its absence was a contract gap, not an authoring
   * oversight: `MotionArchetype` had `targets` from the start and every
   * projectile/circular archetype declares one, while the 19 FBD and Pulley
   * archetypes had nowhere to put it — which is exactly why they score 3–4/5
   * on the design-law audit while the motion ones score 5.
   *
   * Declaring it is necessary but NOT sufficient: Phase 1 shipped 22 codes that
   * were declared and then never read by any feedback path. A `targets` value
   * is a promise that the UI must actually keep.
   */
  targets?: MisconceptionCode;
}

// ── Cross-engine handoff (design law #4) ─────────────────────────────────────
// A body that leaves the bench — slides off an incline, or leaves a circular
// track — continues in motion-lab with no reset. Both engines speak this.

export interface HandoffBody {
  id: string;
  pos: Vec2;
  vel: Vec2;
  mass: number;
  label?: string;
}

export interface HandoffEnvelope {
  bodies: HandoffBody[];
  t: number;
  g: number;
  source: 'mechanics-bench' | 'motion-lab' | 'field-bench';
  reason?: string;   // 'string went slack' | 'left the track' | 'left the surface'
}
