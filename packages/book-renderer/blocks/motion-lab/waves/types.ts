/*
 * motion-lab/waves/types.ts — Phase-2 archetype vocabulary.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE types + data. No React, no DOM.
 *
 * ── WHY A LOCAL ARCHETYPE TYPE INSTEAD OF EXTENDING THE ENGINE'S ────────────
 * `motion-lab/types.ts` is the FROZEN E2 contract and its `MotionMisconception`
 * union is a closed list of nine kinematics codes — none of which describes
 * "a standing wave is one wave" or "work is path-independent". Rather than
 * edit a frozen surface, Phase 2 declares its own misconception vocabulary
 * here and carries it on an `attacks` field.
 *
 * `WavesArchetype extends MotionArchetype`, so `Record<string, WavesArchetype>`
 * is assignable to the engine's `MotionArchetypeMap` and the two new maps can
 * be dropped into `archetypes.ts`'s `mergeArchetypes` call with a two-line
 * change and no type edits at all. `scenario` is narrowed to the engine's
 * existing `'graphs'` value for the same reason. See the build report for the
 * (small) shared-type additions that would let these declare themselves
 * properly.
 *
 * ── WHY `attacks` IS A RECORD, NOT A BARE CODE ──────────────────────────────
 * The Phase-1 QA audit found twenty-two `targets` codes sitting in archetype
 * data wired to nothing, and four codes in the FBD grader that could not fire
 * at all. A bare enum makes that easy: the code is declared, nobody renders it,
 * nothing fails. So here the archetype must supply the WRONG BELIEF in the
 * student's own words and the SENTENCE THAT ATTACKS IT, and the renderer's
 * misconception card takes those strings directly. An unwired archetype is
 * then visibly missing its copy rather than silently missing its behaviour —
 * and `verify-motion-phase2.mjs` asserts every archetype carries both.
 */

import type { MotionArchetype } from '../types';

// ── The Phase-2 misconception vocabulary ────────────────────────────────────

/**
 * `MotionMisconception` in the frozen `motion-lab/types.ts` is the KINEMATICS
 * set — nine codes about apexes, frames and 45° ranges. There is nothing in it
 * for "a standing wave travels", "work is path-independent" or "pressure rises
 * where the pipe narrows", and forcing one of those into `coupled_components`
 * would corrupt the later analytics on what students actually get wrong.
 *
 * So Phase 2 declares its own vocabulary here and the build report asks for
 * these codes to be added to the shared enum. Every code below is WIRED: the
 * bench that renders the archetype reads `attacks.belief` / `attacks.attack`
 * into a misconception card that fires after the evidence. Phase 1 shipped 22
 * declared-but-dead codes; `verify-motion-phase2.mjs` asserts that cannot
 * happen here by checking `targets === attacks.code` on every entry and that
 * every code is reachable from a bench.
 */
export type WavesMisconception =
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
  | 'resonance_amplitude_independent_of_damping';

export interface MisconceptionSpec<C extends string = string> {
  /** Stable id, used in reporting and (later) in Crucible deep-links. */
  code: C;
  /** The wrong idea, phrased the way a student would actually say it. */
  belief: string;
  /** The sentence that contradicts it, delivered AFTER the evidence is on
   *  screen — never as a preamble (design law #5). */
  attack: string;
}

/**
 * Declare the misconception ONCE and get both fields.
 *
 * `targets` is what the standing design-law scorer
 * (`scripts/audit-sim-archetypes.mjs`) reads; `attacks` is what the bench
 * renders. Returning them together makes it structurally impossible for an
 * archetype to declare one code and display another — which is the failure the
 * Phase-1 audit found four times over in the FBD grader.
 */
export const attacking = <C extends string>(code: C, belief: string, attack: string): {
  targets: C;
  attacks: MisconceptionSpec<C>;
} => ({ targets: code, attacks: { code, belief, attack } });

// ── Predict-first gates with PER-OPTION feedback ────────────────────────────

/**
 * The Phase-1 audit's sharpest finding about prediction: the Circular Arena
 * offered three distinct classic wrong answers and gave all three BYTE-IDENTICAL
 * feedback. That is right/wrong scoring wearing a diagnosis costume.
 *
 * So a Phase-2 predict gate carries one response per option. Getting it wrong
 * in different ways has to produce different sentences, or the gate is not
 * grading reasoning (design law #2).
 */
export interface PredictSpec {
  prompt: string;
  options: string[];
  answerIndex: number;
  /** One line per option, same length as `options`. The line for the correct
   *  answer explains WHY it is right, not merely that it is. */
  responses: string[];
}

// ── Waves ────────────────────────────────────────────────────────────────────

/** Which bench renders an archetype. The engine dispatches on `block.scenario`,
 *  which Phase 2 cannot extend, so the archetype names its own bench. */
export type WavesSimId = 'shm-bench' | 'wave-studio' | 'doppler-bench' | 'resonance-rig';

/**
 * `targets` and `scenario` are re-declared rather than inherited: the engine
 * types them as the closed kinematics union and the eight built scenarios
 * respectively, and Phase 2 legitimately needs neither. Everything else —
 * `id`, `title`, `summary`, `params`, `defaultSteps` — is inherited unchanged,
 * so the admin editor's generic `params`-to-form-inputs generator and the
 * archetype picker work on these with no special case.
 */
export interface WavesArchetype extends Omit<MotionArchetype, 'targets' | 'scenario'> {
  /** Narrowed to the engine's existing scenario id — see the header. */
  scenario: 'graphs';
  sim: WavesSimId;
  /** The named misconception, for the design-law scorer. Always `attacks.code`. */
  targets: WavesMisconception;
  /** The same misconception, with the copy the bench actually renders. */
  attacks: MisconceptionSpec<WavesMisconception>;
  /** Predict before you look. Required on the conceptual rungs. */
  predict?: PredictSpec;
  /** The closing note, in the sim's ExpertTip slot. */
  tip: string;
}

export type WavesArchetypeMap = Record<string, WavesArchetype>;

// ── Shared param builders ────────────────────────────────────────────────────
// Repeating a slider's range verbatim across archetypes is how ranges drift.

type Param = NonNullable<MotionArchetype['params']>[number];

export const pNum = (
  key: string, label: string, d: number,
  min: number, max: number, step: number, unit?: string
): Param => ({ key, label, kind: 'number', default: d, min, max, step, unit });

export const pFlag = (key: string, label: string, d = true): Param =>
  ({ key, label, kind: 'boolean', default: d });

export const pPick = (key: string, label: string, d: string, options: string[]): Param =>
  ({ key, label, kind: 'select', default: d, options });

// The oscillator sliders, defined once.
export const pMass = (d = 0.5): Param => pNum('mass', 'Mass', d, 0.05, 5, 0.05, 'kg');
export const pSpring = (d = 20): Param => pNum('k', 'Spring constant', d, 1, 200, 1, 'N/m');
export const pAmplitude = (d = 0.2): Param => pNum('amplitude', 'Amplitude', d, 0.02, 0.6, 0.01, 'm');
export const pLength = (d = 1): Param => pNum('length', 'Pendulum length', d, 0.1, 4, 0.05, 'm');
export const pAngle0 = (d = 10): Param => pNum('theta0', 'Release angle', d, 1, 170, 1, '°');
export const pGravity = (d = 9.8): Param => pNum('g', 'Gravity', d, 1.6, 25, 0.1, 'm/s²');

// The wave sliders.
export const pWaveAmp = (d = 1): Param => pNum('wave_amplitude', 'Amplitude', d, 0.1, 2, 0.05, 'cm');
export const pWavelength = (d = 2): Param => pNum('wavelength', 'Wavelength', d, 0.4, 6, 0.05, 'm');
export const pFrequency = (key = 'frequency', label = 'Frequency', d = 1): Param =>
  pNum(key, label, d, 0.1, 8, 0.05, 'Hz');
export const pStringLength = (d = 4): Param => pNum('length', 'String length', d, 0.5, 8, 0.1, 'm');
export const pTension = (d = 100): Param => pNum('tension', 'Tension', d, 5, 400, 5, 'N');
export const pDensity = (d = 0.01): Param => pNum('mu', 'Mass per metre', d, 0.001, 0.05, 0.001, 'kg/m');
export const pHarmonic = (d = 1): Param => pNum('harmonic', 'Harmonic n', d, 1, 6, 1, '');

// Doppler.
export const pSoundSpeed = (d = 340): Param => pNum('sound_speed', 'Speed of sound', d, 150, 400, 5, 'm/s');
export const pEmitted = (d = 400): Param => pNum('f0', 'Emitted frequency', d, 100, 1200, 10, 'Hz');
export const pSourceV = (d = 0): Param => pNum('vs', 'Source speed →', d, -120, 120, 1, 'm/s');
export const pObserverV = (d = 0): Param => pNum('vo', 'Observer speed →', d, -120, 120, 1, 'm/s');

// Resonance.
export const pDamping = (d = 0.4): Param => pNum('gamma', 'Damping γ', d, 0.02, 4, 0.02, '1/s');
export const pDrive = (d = 1): Param => pNum('drive', 'Drive strength', d, 0.1, 4, 0.1, 'm/s²');
export const pDriveOmega = (d = 3): Param => pNum('omega_drive', 'Drive frequency', d, 0.1, 14, 0.05, 'rad/s');
