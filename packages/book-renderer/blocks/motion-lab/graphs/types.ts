/*
 * motion-lab/graphs/types.ts — the Unit-1 graphs vocabulary.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE types + data. No React, no DOM, node-loadable.
 *
 * ── WHY A LOCAL MISCONCEPTION VOCABULARY ────────────────────────────────────
 * `motion-lab/types.ts` is the FROZEN E2 contract and its `MotionMisconception`
 * union is nine kinematics codes about apexes, frames, 45° ranges and radial
 * departure. NOT ONE of them describes the two errors this module exists to
 * attack:
 *
 *   • "a > 0 means it is speeding up"  — false the moment v < 0
 *   • "a flat x–t line means constant velocity" — it means AT REST
 *
 * The build brief asserted both were already in the union; they are not (the
 * QA report says so too — `PHYSICS_SIM_QA_2026-07-29.md` §5 item 5 lists "the
 * sign of a vs the direction of v" as attacked by NO surface anywhere, and
 * assigns it to Motion Graph Studio, which did not exist). Rather than force
 * one of these into `coupled_components` — which would corrupt the eventual
 * analytics on what students actually get wrong, and would put the wrong
 * sentence on a student's screen today — Phase 2's precedent is followed:
 * declare the vocabulary here, carry the copy alongside the code, and ask for
 * the codes to be hoisted into the shared enum. See `waves/types.ts`, whose
 * header argues the same case, and whose `MisconceptionSpec` / `PredictSpec`
 * records and `attacking()` helper are imported rather than re-declared.
 *
 * `frame_confusion` IS in the shared union and IS the right code for the
 * frame-swap archetype, so that one is used verbatim from upstream.
 *
 * ── WHY `attacks` IS A RECORD, NOT A BARE CODE ──────────────────────────────
 * Phase 1 shipped twenty-two `targets` codes wired to nothing. A bare enum
 * makes that easy: declare the code, render nothing, fail nothing. So an
 * archetype here must supply the wrong belief IN THE STUDENT'S OWN WORDS and
 * the sentence that breaks it; the renderer's misconception card takes those
 * strings directly, and `scripts/verify-graphs.mjs` asserts `targets ===
 * attacks.code` on every entry plus that every declared code is reachable from
 * a bench.
 */

import type { MotionArchetype, MotionMisconception } from '../types';
import type { MisconceptionSpec, PredictSpec } from '../waves/types';
import { attacking } from '../waves/types';

export type { MisconceptionSpec, PredictSpec };
export { attacking };

// ── The vocabulary ───────────────────────────────────────────────────────────

/**
 * Every code below is WIRED: the bench that renders the archetype reads
 * `attacks.belief` / `attacks.attack` into a card that fires only after the
 * evidence is on screen. The four marked ★ are the ones the QA report named as
 * uncovered by any existing surface.
 */
export type GraphsMisconception =
  /** ★ "a is positive so it must be speeding up." Not when v < 0. */
  | 'positive_a_means_speeding_up'
  /** ★ "Retardation means the acceleration is negative." It means a opposes v. */
  | 'retardation_is_negative_acceleration'
  /** ★ "A flat x–t line means it is moving steadily." It means at rest. */
  | 'flat_xt_means_constant_velocity'
  /** "Higher on the x–t graph means faster." Height is where, slope is how fast. */
  | 'steeper_means_higher_up'
  /** "The x–t curve is a picture of the path it took." It is a schedule, not a map. */
  | 'xt_curve_is_the_path'
  /** "The area under v–t is the speed / the velocity." It is the displacement. */
  | 'area_under_vt_is_speed'
  /** "Distance and displacement are the same number." Only if you never turn back. */
  | 'distance_equals_displacement'
  /** "Average velocity is (u + v)/2." Only under uniform acceleration. */
  | 'average_v_is_mean_of_endpoints'
  /** "Average velocity and velocity are the same thing." Chord vs tangent. */
  | 'avg_equals_instantaneous'
  /** "v = 0, so a = 0." The turning point of every thrown object says otherwise. */
  | 'at_rest_means_zero_acceleration'
  /** "Relative speed is just the two speeds added." Only when they oppose. */
  | 'relative_velocity_adds_scalars'
  /** "Aim upstream — it is always the best way across." Not for minimum TIME. */
  | 'river_crossing_min_time_equals_min_drift'
  /** "The rain is slanting, so tilt the umbrella back." It slants because YOU move. */
  | 'rain_direction_is_absolute';

/** What an archetype may name — the local set plus the upstream codes that fit. */
export type GraphsTarget = GraphsMisconception | MotionMisconception;

// ── Which bench renders an archetype ─────────────────────────────────────────

/**
 * `MotionLab.tsx` dispatches on `block.scenario`, whose union is part of the
 * frozen contract and has one slot — `'graphs'` — for everything in this
 * module. So the archetype names its own bench here, exactly as waves and
 * thermo do. Three benches, one entry point (`GraphsLab.tsx`).
 */
export type GraphsSimId = 'graph-studio' | 'match-the-motion' | 'relative-deck';

/** Which of the three linked graphs the student edits directly. */
export type DriverAxis = 'x' | 'v' | 'a';

/** Which relative-motion construction the deck shows. */
export type RelativeScene = 'river' | 'rain' | 'trains' | 'frame-swap';

// ── The reveal ladder ────────────────────────────────────────────────────────

/**
 * One thing that can appear on the canvas.
 *
 * `'edit'` is the one that unlocks the handles, and it is a reveal like any
 * other so that "now drag it" is a step the script announces rather than a
 * capability the student has to discover.
 */
export type RevealToken = 'x' | 'v' | 'a' | 'area' | 'tangent' | 'chord' | 'edit';

/**
 * What becomes visible at each guided beat, cumulative.
 *
 * DATA, not a hardcoded order, because the right order genuinely differs per
 * exercise: "the velocity graph is drawn and the position graph above is empty"
 * and "only the top panel is drawn so far" are both correct openings, for
 * different lessons. A single hardcoded ladder would leave several scripts
 * describing something that is not on screen — which is precisely the defect
 * class the Phase-1 QA report called out (guide text instructing an action the
 * interface cannot perform), and the verifier asserts `reveals.length ===
 * defaultSteps.length` and that `'edit'` appears somewhere in every ladder.
 */
export type RevealLadder = RevealToken[][];

// ── The archetype ────────────────────────────────────────────────────────────

/**
 * `targets` and `scenario` are re-declared rather than inherited (the engine
 * types the first as the closed kinematics union and the second as the eight
 * built scenarios). Everything else — `id`, `title`, `summary`, `params`,
 * `defaultSteps` — is inherited unchanged, so the admin editor's generic
 * params-to-form-inputs generator and the archetype picker keep working with no
 * edit at all, and `Record<string, GraphsArchetype>` stays assignable to the
 * engine's `MotionArchetypeMap`.
 */
export interface GraphsArchetype extends Omit<MotionArchetype, 'targets' | 'scenario'> {
  scenario: 'graphs';
  sim: GraphsSimId;
  targets: GraphsTarget;
  attacks: MisconceptionSpec<GraphsTarget>;
  /** Predict-first gate with ONE RESPONSE PER OPTION (QA §3.4: three wrong
   *  answers receiving byte-identical feedback is scoring in a diagnosis
   *  costume). */
  predict?: PredictSpec;
  /**
   * One entry per guided beat. REQUIRED on `graph-studio`, where three panels
   * plus the shading, the tangent and the chord all have to arrive in the order
   * the script describes. `match-the-motion` gates only editing (the target and
   * the student's line are on screen from the first beat, because the task is to
   * compare them) and `relative-deck` reveals arrows rather than panels, so both
   * leave it unset. `verify-graphs.mjs` enforces exactly that split.
   */
  reveals?: RevealLadder;
  /** The closing note. Kept on the archetype so faculty can see it in the
   *  picker rather than it being buried in a switch inside the component. */
  tip: string;
}

export type GraphsArchetypeMap = Record<string, GraphsArchetype>;

// ── Shared param builders ────────────────────────────────────────────────────
//
// Repeated verbatim across sixteen archetypes they would drift, so every
// velocity slider in the library shares one range and one unit. Ranges are set
// so a Class-11 student recognises the numbers: −30…30 m/s covers a walk, a
// cyclist and a highway car; −10…10 m/s² covers hard braking (≈ −8) without
// letting an author build something that is not a road vehicle.

type Param = NonNullable<MotionArchetype['params']>[number];

export const pX0 = (d = 0): Param =>
  ({ key: 'x0', label: 'Start position', kind: 'number', default: d, min: -100, max: 100, step: 1, unit: 'm' });

export const pU = (d = 0): Param =>
  ({ key: 'u', label: 'Starting velocity', kind: 'number', default: d, min: -30, max: 30, step: 0.5, unit: 'm/s' });

/** Segment n's acceleration. Three segments cover every Class-11 journey graph:
 *  a phase at rest, a phase of uniform velocity, and a phase of braking. */
export const pSegA = (n: 1 | 2 | 3, d = 0): Param => ({
  key: `seg${n}_a`,
  label: `Phase ${n} acceleration`,
  kind: 'number',
  default: d,
  min: -10, max: 10, step: 0.25, unit: 'm/s²',
});

/** Segment n's duration. Zero retires the phase, which is how a one-phase or
 *  two-phase journey is authored without a separate "phase count" param. */
export const pSegT = (n: 1 | 2 | 3, d = 4): Param => ({
  key: `seg${n}_t`,
  label: `Phase ${n} duration`,
  kind: 'number',
  default: d,
  min: 0, max: 20, step: 0.5, unit: 's',
});

export const pNodes = (d = 12): Param =>
  ({ key: 'nodes', label: 'Sketch handles', kind: 'number', default: d, min: 4, max: 20, step: 1 });

export const pDriver = (d: DriverAxis = 'v'): Param =>
  ({ key: 'driver', label: 'Graph the student drags', kind: 'select', default: d, options: ['x', 'v', 'a'] });

export const pTolerance = (d = 1.5): Param =>
  ({ key: 'tolerance', label: 'Match tolerance', kind: 'number', default: d, min: 0.2, max: 6, step: 0.1, unit: 'm/s' });

export const pFlag = (key: string, label: string, d = true): Param =>
  ({ key, label, kind: 'boolean', default: d });

// ── Relative-motion params ───────────────────────────────────────────────────

export const pRiverWidth = (d = 100): Param =>
  ({ key: 'width', label: 'River width', kind: 'number', default: d, min: 20, max: 400, step: 5, unit: 'm' });

export const pCurrent = (d = 3): Param =>
  ({ key: 'current', label: 'Current speed', kind: 'number', default: d, min: 0, max: 12, step: 0.1, unit: 'm/s' });

export const pBoat = (d = 5): Param =>
  ({ key: 'boat', label: 'Boat speed in still water', kind: 'number', default: d, min: 0.5, max: 15, step: 0.1, unit: 'm/s' });

export const pHeading = (d = 0): Param =>
  ({ key: 'heading', label: 'Heading (upstream of straight across)', kind: 'number', default: d, min: -80, max: 80, step: 1, unit: '°' });

export const pRainSpeed = (d = 10): Param =>
  ({ key: 'rain', label: 'Rain fall speed', kind: 'number', default: d, min: 1, max: 25, step: 0.5, unit: 'm/s' });

export const pWalkSpeed = (d = 5): Param =>
  ({ key: 'walk', label: 'Your walking speed', kind: 'number', default: d, min: 0, max: 20, step: 0.25, unit: 'm/s' });

export const pTrainV = (which: 'a' | 'b', d: number): Param => ({
  key: `v_${which}`,
  label: `Train ${which.toUpperCase()} velocity`,
  kind: 'number',
  default: d,
  min: -40, max: 40, step: 0.5, unit: 'm/s',
});

export const pTrainL = (which: 'a' | 'b', d: number): Param => ({
  key: `len_${which}`,
  label: `Train ${which.toUpperCase()} length`,
  kind: 'number',
  default: d,
  min: 0, max: 400, step: 5, unit: 'm',
});
