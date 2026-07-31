/*
 * pulley/misconceptions.ts — the six constraint-shaped beliefs, said out loud.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM, no JSX — `scripts/verify-pulley-wiring.mjs` is a plain
 * node script and imports this file directly to assert that every code the nine
 * rungs declare actually has copy, and that no copy sits here unreferenced.
 * Keep it that way; the card that renders it lives in `MisconceptionCard.tsx`.
 *
 * ── WHY THIS FILE EXISTS ─────────────────────────────────────────────────────
 * `archetypes.pulley.ts` gives all nine rungs a `targets: MisconceptionCode`,
 * and its header ends with a warning worth repeating: Phase 1 of this program
 * shipped twenty-two codes that were declared and never read by any feedback
 * path. A `targets` value is a promise the UI has to keep. Pulley Lab draws no
 * free-body diagram and never calls `gradeFbd`, so there was no grader to put
 * these sentences in — which is the whole reason they are here instead, wired to
 * the four surfaces Pulley Lab actually has (see `PulleyLab.tsx` §SURFACES).
 *
 * ── THE COPY CONTRACT, COPIED FROM `energy/kit/phase2.ts` ────────────────────
 * That file's `MISCONCEPTION` record is the precedent and the pattern is three
 * moves, in this order:
 *
 *   1. NAME the belief, in the student's own words, as something a person would
 *      actually say. Not "students often think that…" — the sentence itself.
 *   2. Say what ACTUALLY happens, pointed at something on screen the student can
 *      go and check. Never an assertion they have to take on trust.
 *   3. Say why the belief FELT RIGHT. This is the part that does the work: a
 *      belief that is merely contradicted comes back, and a belief whose origin
 *      has been explained does not.
 *
 * The word "wrong" appears nowhere. A student who has just been told their
 * reasoning is wrong has stopped reading, and there is nothing in these six
 * paragraphs that needs the word — every one of them is a correct idea applied
 * one step outside where it holds.
 *
 * Voice: plain, direct, teacher-in-the-room, aimed at a tier-2/3-town Class 11
 * student. `lib/grade.ts` is the other reference for tone.
 *
 * ⚠ EVIDENCE-GATED, ALWAYS. None of this may render as a preamble. Every call
 * site passes `evidence` to `MisconceptionCard`, which returns null without it —
 * see the design-law-#5 note there. A card that appears before the student has
 * committed is a spoiler wearing a diagnosis's clothes.
 */

import type { MisconceptionCode } from '../types';

export interface MisconceptionCopy {
  /** The wrong belief, said out loud in the student's own words. */
  heading: string;
  /** What actually happens, and why the belief feels right. Never "wrong". */
  body: string;
}

/**
 * The six codes the pulley ladder declares. Named here as a tuple rather than
 * inferred from `Object.keys` so the verifier can assert BOTH directions —
 * every rung's `targets` has copy, and every entry of copy is some rung's
 * `targets` — which is how `energy/kit/phase2.ts` caught four E1 codes that
 * could never fire.
 */
export const PULLEY_MISCONCEPTION_CODES = [
  'pulley_multiplies_force',
  'tilt_changes_the_constraint',
  'machine_gives_free_work',
  'tension_equal_across_any_pulley',
  'movable_pulley_is_a_ceiling',
  'accelerations_same_in_every_frame',
] as const;

export type PulleyMisconceptionCode = (typeof PULLEY_MISCONCEPTION_CODES)[number];

export const PULLEY_MISCONCEPTION: Record<PulleyMisconceptionCode, MisconceptionCopy> = {
  pulley_multiplies_force: {
    heading: '“Put a pulley on it and the load gets lighter.”',
    body: 'Count the lengths of rope actually holding the load. Over a sheave bolted to the ceiling there is exactly one, so that one rope carries the whole weight — the panel above puts the rope’s pull and the load’s own weight side by side, and they are the same number. What the wheel changed is the DIRECTION you pull: down instead of up. That feels like help because for a human body it genuinely is — you can lean back and let your own weight do the hauling instead of lifting against your shoulders. Your posture got easier; the force did not get smaller. The force only drops once the load hangs on more than one length of rope, and that needs a sheave that moves WITH the load.',
  },
  tilt_changes_the_constraint: {
    heading: '“Tilt the surface and the rope’s rule tilts with it.”',
    body: 'Drag either body, at any angle the slider will give you. One segment grows by exactly what the other loses, and the total length of the rope does not shift by a millimetre — that bottom row of the ledger is the constraint, and it is a statement about LENGTH. A rope has no idea which way it is pointing. What the tilt genuinely changes is ΣF = ma: mg sin θ where there used to be mg, so the accelerations move when you turn the slider and the equation above them sits still. The belief is so easy to hold because every tilted figure in the textbook is printed as a fresh problem with a fresh diagram, and because the forces really did change — so it is natural to assume everything did.',
  },
  machine_gives_free_work: {
    heading: '“The machine hands you the extra force for nothing.”',
    body: 'It hands you force and charges you distance, and the bill balances to the last joule. n lengths of rope hold the load, so each one carries a share of it — but the load rises one metre only after you have pulled n metres of rope through your hands. Force divided by n, distance multiplied by n, work unchanged. Drag the load one notch and watch how much rope has to appear on the other side to pay for it. It feels free because force is the only half of the bargain you can feel; nobody notices the rope piling up at their feet.',
  },
  tension_equal_across_any_pulley: {
    heading: '“A rope has one tension. It is the same all the way along.”',
    body: 'True in every problem you have been set so far — and only because every sheave in them was massless. A sheave with mass has to be spun up; spinning it up needs a net torque; and the only thing in the picture that can supply that torque is a DIFFERENCE between the pull on the two sides. That is the whole of (T₁ − T₂)·r = Iα, and the ledger shows the three numbers satisfying it. Pull the pulley-mass slider back to zero and watch the two tensions collapse into one, because with I = 0 the torque needed is nothing. What looked like a law was an assumption wearing a law’s clothes, and it is worth knowing which of the two you have been using.',
  },
  movable_pulley_is_a_ceiling: {
    heading: '“The lower pulley is a fixed point, so its rope is an ordinary Atwood.”',
    body: 'It hangs from a rope that is itself moving, so it has an acceleration of its own — go and read its number in the accelerations list; it is not zero. Setting aₚ = 0 deletes a real unknown, and the arithmetic then closes neatly on an answer this machine never produces. It looks structural because it sits ABOVE the two masses and is drawn exactly like the sheave bolted to the ceiling, and because every pulley you had met until now was in fact bolted down. Height on the page is not the test. Being attached to something that cannot move is.',
  },
  accelerations_same_in_every_frame: {
    heading: '“An acceleration is an acceleration. It cannot matter who is watching.”',
    body: 'Every number this rung reports is measured relative to the PULLEY, and the pulley is riding in the lift. Add the lift’s own A to each of them and you have them relative to the ground — two different answers to two different questions, both correct. Nothing about the constraint changed; it was only ever a statement about the rope. The belief survives because g + A does all the work for you: swap it in, solve exactly as usual, and it never feels like you left the ground frame at all. Choosing the frame was a step you took without noticing you took it.',
  },
};

/**
 * Copy for a `targets` code, or null when the archetype declares none / declares
 * a code from another family (the FBD and Phase-2 vocabularies live in the same
 * `MisconceptionCode` union). Returning null rather than throwing is deliberate:
 * a pulley scene authored against an FBD code should degrade to "no card", never
 * to a crashed reader.
 */
export function pulleyMisconception(
  code: MisconceptionCode | undefined,
): MisconceptionCopy | null {
  if (!code) return null;
  return (PULLEY_MISCONCEPTION as Record<string, MisconceptionCopy>)[code] ?? null;
}
