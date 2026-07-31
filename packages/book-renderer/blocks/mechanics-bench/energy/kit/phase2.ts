/*
 * energy/kit/phase2.ts — the Phase-2 authoring contract, shared by BOTH families.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM — the archetype libraries and the verifier both import
 * it, and the verifier is a plain node script.
 *
 * ⚠ WHY THIS LIVES UNDER `energy/`. Phase 2 owns exactly two directories,
 * `energy/**` and `rotation/**`; `mechanics-bench/lib/**` is the frozen E1
 * engine and is not ours to extend. So the kit that both families share sits
 * under `energy/kit/` and `rotation/` imports it from there. When the engine
 * directories are next unfrozen this should be promoted to
 * `mechanics-bench/kit/` — the import in `archetypes.rotation.ts` is the only
 * thing that has to change.
 *
 * ── WHAT THIS ADDS TO THE E1 ARCHETYPE SHAPE, AND WHY ────────────────────────
 * `MechanicsArchetype` (types.ts) is frozen and its `buildScene` returns an E1
 * `Scene` — bodies, contacts, strings. That is exactly right for an FBD and
 * exactly wrong for an orbit: there is no contact to name and no string to walk.
 * So a Phase-2 `buildScene` returns a `Phase2Spec` instead — a discriminated
 * union over the bench it drives.
 *
 * ⚠ THE FIELD IS STILL CALLED `buildScene`, DELIBERATELY. It is what
 * `scripts/audit-sim-archetypes.mjs` calls to score authorability, and what
 * `MechanicsArchetype` calls it. Keeping the name means the standing auditor
 * picks these up with no special case; the RETURN type differing is what stops
 * a Phase-2 rung from being merged into `MECHANICS_ARCHETYPES` by accident —
 * that merge is a compile error until the block grows the two new modes, which
 * is the correct place for it to fail.
 *
 * Everything else keeps the SAME field names as `MechanicsArchetype` (`id`,
 * `title`, `summary`, `mode`, `params`, `defaultSteps`) so the admin editor's
 * param-driven form works on these unchanged.
 *
 * Three fields are new, and each one exists because the Phase-1 pedagogy audit
 * (PHYSICS_SIM_QA_2026-07-29.md) found it missing:
 *
 *  • `targets`  — the NAMED misconception this rung attacks. §8 of the audit:
 *                 twenty-two `targets` codes sat in archetype data wired to
 *                 nothing, and two of the four sims could show a student ZERO
 *                 named misconceptions. Here the code is not decoration: the
 *                 bench renders `MISCONCEPTION[targets]` as a card, and the
 *                 verifier asserts every archetype declares one.
 *
 *  • `predict`  — with `per_option` feedback. The audit's §3.4 finding was that
 *                 three distinct classic misconceptions received BYTE-IDENTICAL
 *                 feedback: "that is right/wrong scoring with a shared
 *                 paragraph, not diagnosis." `per_option` is required, one
 *                 string per option, and the verifier fails a rung that ships
 *                 without it.
 *
 *  • `family`   — which of the two libraries defined it, so a duplicate id
 *                 across the two files is caught rather than silently
 *                 overwriting an already-authored page (the same reasoning as
 *                 the throw in `archetypes.ts`).
 */

import type { TrackPoint } from '../lib/track';
import type { RollShape } from '../../rotation/lib/inertia';
import type { Load } from '../../rotation/lib/torque';

// ── The misconception vocabulary ─────────────────────────────────────────────
// Every code here is `targets` on at least one archetype AND has copy in
// `MISCONCEPTION` below. Both directions are asserted by the verifier, because
// the audit found four E1 codes that could never fire and one whose copy was
// displaced by a different code's heading.

export type EnergyMisconception =
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
  | 'faster_means_lower_orbit';

export type RotationMisconception =
  | 'heavier_rolls_faster'
  | 'bigger_radius_rolls_faster'
  | 'rolling_energy_all_translational'
  | 'torque_ignores_the_angle'
  | 'balance_means_equal_masses'
  | 'contact_point_moves_with_the_wheel'
  | 'top_of_the_wheel_moves_at_v'
  | 'l_conserved_means_ke_conserved'
  | 'spinning_faster_is_free';

export type Phase2Misconception = EnergyMisconception | RotationMisconception;

export interface MisconceptionCopy {
  /** The wrong belief, said out loud in the student's own words. */
  heading: string;
  /** What actually happens, and why the belief feels right. Never "wrong". */
  body: string;
}

/**
 * The diagnostic copy. Each entry NAMES the belief before correcting it, which
 * is the pattern `lib/grade.ts` established for FBD Studio and the one surface
 * of Phase 1 the audit rated as genuinely teaching.
 */
export const MISCONCEPTION: Record<Phase2Misconception, MisconceptionCopy> = {
  friction_destroys_energy: {
    heading: '“Friction destroys energy.”',
    body: 'Nothing was destroyed — watch the third bar. Every joule that left KE and PE arrived in HEAT, and the total never moved by so much as a millijoule. Friction is a transfer, not a leak. The reason it feels like a loss is that heat is spread thinly over the track and the block, so you cannot get it back as motion.',
  },
  speed_depends_on_path: {
    heading: '“The steeper drop gives more speed.”',
    body: 'Both tracks end at the same speed, because gravity only ever cares about the CHANGE IN HEIGHT — not the route. The steep one gets there sooner, which is a different question. Drop height decides speed; shape decides timing.',
  },
  heat_is_not_energy: {
    heading: '“Heat is what is left over, not energy.”',
    body: 'The heat bar is measured in joules, exactly like the other two. μmgΔx is a quantity of energy sitting in the warmed track and the warmed block. Put a thermometer on a slide at the end of a hot afternoon of children and you can feel this number.',
  },
  loop_top_only_needs_to_arrive: {
    heading: '“As long as it reaches the top, it makes it round.”',
    body: 'At the top, the track is ABOVE the car, so the track can only push DOWN. Gravity also points down. Both point at the centre, and the smallest total they can add up to is mg alone — which needs v² = gr. A car that crawls over the top with v ≈ 0 left the track long before it got there. This is exactly the Circular Arena’s critical-speed result, reached from the energy side.',
  },
  mass_changes_the_loop: {
    heading: '“A heavier car needs a bigger drop.”',
    body: 'Set the mass to anything you like — the verdict does not change. Every term in the energy equation carries an m, so m divides out: h ≥ 2.5r has no mass in it. What DOES change with mass is the force the rails have to take, which is why a real coaster is engineered for a full train, not for the physics.',
  },
  equal_mass_elastic_both_move: {
    heading: '“They share it — both move off at half speed.”',
    body: 'Sharing conserves momentum but destroys kinetic energy, so it can only happen if the collision is inelastic. For an elastic hit between EQUAL masses the only solution that keeps both books balanced is a straight swap: the shooter stops dead and the target leaves at the shooter’s speed. Every carrom and snooker player knows this and almost no one can say why.',
  },
  momentum_lost_when_they_stick: {
    heading: '“When they stick together, momentum is lost too.”',
    body: 'Momentum is conserved in EVERY collision, at every value of e — check the momentum row: it does not move. What is lost is kinetic energy, and only kinetic energy, and the amount is exactly ½·μ_reduced·v_rel². Two different books, two different rules.',
  },
  ke_conserved_in_every_collision: {
    heading: '“Energy is always conserved, so KE is always conserved.”',
    body: 'Energy IS always conserved — but it does not have to stay kinetic. Drag e down and watch: the momentum row holds, and the KE row drops by ½·μ_reduced·(1−e²)·v_rel², into deformation, sound and heat. e = 1 is the special case where none of it leaves.',
  },
  com_frame_changes_the_physics: {
    heading: '“Looking from a moving frame changes what happens.”',
    body: 'It changes the numbers, never the event. In the centre-of-mass frame the two momenta are equal and opposite BEFORE and AFTER, so an elastic collision can only reverse both velocities — every elastic collision, without exception, is that same symmetric bounce. Ride the CoM frame and a hard 2-D problem becomes a picture.',
  },
  work_is_force_times_distance_always: {
    heading: '“Work is force × distance, so it is F·x.”',
    body: 'Only when the force is CONSTANT. The spring pushed back with nothing at the start and 20 N at the end — multiplying by the final force counts every millimetre as if it were the hardest one. The area under the F–x graph is what “force × distance” means when the force will not hold still, and here it is exactly half your answer.',
  },
  spring_work_is_always_half_kx2: {
    heading: '“Spring work is ½kx². I know that one.”',
    body: 'For an IDEAL spring, yes — because the F–x graph is a triangle and ½kx² is its area. Switch to the stiffening band and the graph curves; the triangle formula misses the extra 2 J entirely, but the AREA is still the work. One of these is a formula and the other is the idea.',
  },
  orbit_has_no_gravity: {
    heading: '“There is no gravity up there — that is why they float.”',
    body: 'At 400 km, g is still about 8.7 m/s², nearly 90% of its value at your feet. The station and everything in it are FALLING, all the time, and missing the Earth because they are moving sideways fast enough. Turn the launch speed down and watch the same curve become an ordinary cannonball’s.',
  },
  escape_means_gravity_ends: {
    heading: '“Escape velocity is where gravity stops.”',
    body: 'Gravity never stops — it only ever becomes small. Escape speed is the point where the object’s kinetic energy exactly matches the potential well: ½v² = GM/r. Above it, it keeps slowing forever and never quite comes back; below it, it always does. And it is exactly √2 times the circular speed at that radius, which is why the number is so easy to remember.',
  },
  faster_means_lower_orbit: {
    heading: '“Fire it faster and it hugs the ground more.”',
    body: 'The opposite. A horizontal shot makes the launch point an apsis: below circular speed it is the HIGH point (and the far side dips into the ground), above it, it is the LOW point and the far side climbs. Faster means a bigger, slower orbit — the piece of orbital mechanics that catches everyone the first time.',
  },

  heavier_rolls_faster: {
    heading: '“The heavy one wins.”',
    body: 'Load the dice: make the sphere the heaviest thing on the ramp and the hoop the lightest. The order does not move. Every term in mg sin θ − f = ma and in f·r = Iα carries the mass, so it divides out and leaves a = g sin θ/(1 + k), where k depends only on SHAPE.',
  },
  bigger_radius_rolls_faster: {
    heading: '“The bigger wheel gets there first.”',
    body: 'r divides out too — it appears once in the torque and twice in I = k·m·r², and the α = a/r rolling condition cancels the difference exactly. A marble and a cannonball, both solid spheres, tie. What decides the race is where the mass sits relative to the axis, and nothing else.',
  },
  rolling_energy_all_translational: {
    heading: '“All the drop energy becomes speed.”',
    body: 'Only the 1/(1+k) share of it. The rest is spinning: mgh = ½mv²(1+k). A hoop puts HALF of everything it gains into rotation and arrives with only √(1/2) of a slider’s speed, which is the same fact as its acceleration being half.',
  },
  torque_ignores_the_angle: {
    heading: '“Torque is force times distance.”',
    body: 'Force times PERPENDICULAR distance. Swing the pull round to 30° and the beam barely responds even though the force and the distance are untouched — τ = F·r·sin φ has halved. Pull straight along the beam and it does nothing at all, at any distance.',
  },
  balance_means_equal_masses: {
    heading: '“To balance, the two sides must weigh the same.”',
    body: 'They must have the same TORQUE. 3 kg at 40 cm balances 2 kg at 60 cm, because 3 × 0.4 = 2 × 0.6. A see-saw is not a weighing scale; it is a comparison of products, which is why a small child can lift an adult by sitting further out.',
  },
  contact_point_moves_with_the_wheel: {
    heading: '“The bottom of the tyre moves with the car.”',
    body: 'Look at the arrow there — it has no length. For rolling without slipping, the contact point is momentarily AT REST relative to the road; that is what “without slipping” means, and it is why a rolling wheel leaves no skid mark. The moment that arrow grows, you are skidding.',
  },
  top_of_the_wheel_moves_at_v: {
    heading: '“Every part of the wheel moves at the car’s speed.”',
    body: 'The centre does. The top does 2v, and the bottom does zero. The rim point is carried forward by the whole wheel AND swung by the spin, and at the top those two add while at the bottom they cancel. This is why the top of a spinning bicycle wheel is a blur while the contact patch looks sharp.',
  },
  l_conserved_means_ke_conserved: {
    heading: '“Angular momentum is conserved, so energy is too.”',
    body: 'L = Iω is conserved because no external torque acts. KE = ½Iω² = L²/2I is NOT, because I changed — and with L fixed, halving I DOUBLES the kinetic energy. A conservation law is a statement about one quantity, and generalising it to a second one is the single most expensive habit in this chapter.',
  },
  spinning_faster_is_free: {
    heading: '“The extra spin came from nowhere.”',
    body: 'It came from your arms. The weights are going in circles, so something must pull them inward; dragging them to a smaller radius means that inward pull acts through a distance, and that is work. The joules you supply are exactly the joules the kinetic energy gained. Let them back out and you get every one of them returned — you can feel them pulling your arms straight.',
  },
};

// ── Bench specifications ─────────────────────────────────────────────────────
// One discriminated union, `bench` as the tag. Each variant is the complete
// input to one simulation, so an exercise really is data all the way down.

export interface LedgerSpec {
  bench: 'ledger';
  track: TrackPoint[];
  mass: number;
  mu: number;
  v0: number;
  g: number;
  /** Can the student drag the control points? Design law #1 — default yes. */
  editable: boolean;
  /** A SECOND track shown for comparison, same endpoints, different shape. */
  compareTrack?: TrackPoint[];
}

export interface CoasterSpec2 {
  bench: 'coaster';
  releaseH: number;
  loopR: number;
  runIn: number;
  mu: number;
  mass: number;
  g: number;
}

export interface CollisionSpec {
  bench: 'collision';
  dim: 1 | 2;
  m1: number;
  m2: number;
  /** m/s. In 2-D these are the x-components; body 2 also gets `u2y`. */
  u1: number;
  u2: number;
  u2y?: number;
  e: number;
  /** 2-D only: impact parameter, m. */
  b?: number;
  r1: number;
  r2: number;
  /** Start in the centre-of-mass frame rather than the ground frame. */
  comFrame: boolean;
}

export interface SpringSpec {
  bench: 'spring';
  k: number;
  /** N/m³ — 0 is an ideal spring, positive is a stiffening band. */
  beta: number;
  /** Extension the bench allows, m. */
  xMax: number;
  /** A block launched into the spring, for the "how far does it compress" rung. */
  mass: number;
  v0: number;
}

export interface OrbitSpec {
  bench: 'orbit';
  GM: number;
  /** Planet radius, m. */
  R: number;
  /** Launch radius from the centre, m. */
  r0: number;
  /** Launch speed as a MULTIPLE of the circular speed — the only scale a
   *  student can reason in, and the one the whole ladder is written in. */
  vFactor: number;
}

export interface MoiSpec {
  bench: 'moi';
  shapes: RollShape[];
  thetaDeg: number;
  /** Distance along the slope, m. */
  distance: number;
  /** Per-shape overrides so the student can load the dice. */
  masses: Partial<Record<RollShape, number>>;
  radii: Partial<Record<RollShape, number>>;
  /** Race a frictionless slider alongside — the "where did it go" control. */
  withSlider: boolean;
  g: number;
}

export interface TorqueSpec {
  bench: 'torque';
  beamLength: number;
  pivotX: number;
  loads: Load[];
  /** Include the beam's own weight as a load at its centre. */
  beamMass: number;
  g: number;
}

export interface RollingSpec {
  bench: 'rolling';
  /** Centre speed, m/s. */
  v: number;
  radius: number;
  /** Slip: 0 = pure rolling, +1 = locked skid, −1 = wheelspin at 2×. */
  slip: number;
  /** Draw the cycloid a marked rim point traces. */
  showCycloid: boolean;
}

export interface ChairSpec {
  bench: 'chair';
  coreInertia: number;
  weightMass: number;
  armLength: number;
  /** rad/s */
  omega0: number;
  /** Where the "pull in" handle starts, m. */
  pulledArm: number;
}

export type Phase2Spec =
  | LedgerSpec | CoasterSpec2 | CollisionSpec | SpringSpec | OrbitSpec
  | MoiSpec | TorqueSpec | RollingSpec | ChairSpec;

// ── The archetype shape ──────────────────────────────────────────────────────

export interface Phase2Param {
  key: string;
  label: string;
  kind: 'number' | 'boolean' | 'select';
  default: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  unit?: string;
}

/**
 * A predict-first gate with PER-OPTION feedback.
 *
 * `per_option[i]` is what a student who picked option i is told — including the
 * one who picked correctly, who gets told WHY it is right rather than just
 * "correct". The audit's §3.4 finding is the whole reason this is an array and
 * not a single `reveal` string.
 */
export interface Phase2Predict {
  prompt: string;
  options: string[];
  answer_index: number;
  per_option: string[];
  /** The shared closing paragraph, shown under the per-option line. */
  reveal: string;
}

export interface Phase2Archetype {
  id: string;
  title: string;
  summary: string;
  /** Which of the two Phase-2 libraries owns it. */
  family: 'energy' | 'rotation';
  /**
   * The E1 block mode this authors under. Every Phase-2 rung is `'solve'` for
   * now — see the note in `archetypes.energy.ts`: `MechanicsBenchBlock.mode` is
   * a frozen three-way union and Phase 2 does not own it.
   */
  mode: 'fbd' | 'pulley' | 'solve';
  /**
   * The named misconception this rung attacks. Rendered by the bench as a
   * `MISCONCEPTION[targets]` card, not decorative.
   *
   * ⚠ These codes are NOT members of `MisconceptionCode` (types.ts), and that is
   * on purpose. That enum is the FBD/mechanics vocabulary — weight, normal,
   * friction, tension, third-law pairs, pseudo-forces. "Friction destroys
   * energy" and "angular momentum conserved implies KE conserved" are not
   * force-diagram errors and forcing them into that enum would make the codes
   * lie about what they diagnose. The 24 codes below are listed in the Phase-2
   * build report as candidates for extending the shared enum.
   */
  targets: Phase2Misconception;
  params: Phase2Param[];
  defaultSteps: { say: string; cta: string }[];
  predict?: Phase2Predict;
  /** See the ⚠ in the file header: named `buildScene` to match the frozen
   *  archetype shape and the standing auditor; returns a Phase-2 spec. */
  buildScene(params?: Record<string, number | string | boolean>): Phase2Spec;
}

export type Phase2ArchetypeMap = Record<string, Phase2Archetype>;

// ── Param readers ────────────────────────────────────────────────────────────
// Identical in spirit to the ones in archetypes.fbd.ts. Duplicated rather than
// imported because that file is frozen and exports none of them.

export const num = (
  p: Record<string, number | string | boolean> | undefined, k: string, d: number,
): number => (typeof p?.[k] === 'number' && Number.isFinite(p[k] as number) ? (p[k] as number) : d);

export const str = (
  p: Record<string, number | string | boolean> | undefined, k: string, d: string,
): string => (typeof p?.[k] === 'string' ? (p[k] as string) : d);

export const bool = (
  p: Record<string, number | string | boolean> | undefined, k: string, d: boolean,
): boolean => (typeof p?.[k] === 'boolean' ? (p[k] as boolean) : d);

/** Round to 4 dp — keeps authored JSON readable and stops 0.30000000000000004
 *  appearing in a student-facing readout. */
export const r4 = (n: number): number => Math.round(n * 1e4) / 1e4;

/**
 * Merge two archetype maps, throwing on a duplicate id.
 *
 * Same reasoning as `archetypes.ts`: an id is a stable authoring handle stored
 * on saved book pages, so a silent object-spread overwrite would re-point an
 * already-authored exercise at a different construction, with no error and no
 * visible symptom until a student sees the wrong scene.
 */
export function mergePhase2(
  sources: { from: string; map: Phase2ArchetypeMap }[],
): Phase2ArchetypeMap {
  const merged: Phase2ArchetypeMap = {};
  const definedIn: Record<string, string> = {};
  for (const source of sources) {
    for (const [id, a] of Object.entries(source.map)) {
      if (definedIn[id]) {
        throw new Error(
          `mechanics-bench Phase 2: duplicate archetype id "${id}" — defined in `
          + `both ${definedIn[id]} and ${source.from}. Rename one of them.`,
        );
      }
      definedIn[id] = source.from;
      merged[id] = a;
    }
  }
  return merged;
}
