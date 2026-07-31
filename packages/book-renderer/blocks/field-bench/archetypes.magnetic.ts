/*
 * field-bench/archetypes.magnetic.ts — the Magnetic Force Playground.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ── The headline: qv×B DOES NO WORK ─────────────────────────────────────────
 * The magnetic force is perpendicular to the velocity at every instant, so it
 * can never have a component along the motion, so it can never change the
 * speed. It bends, it never pushes. Every archetype here is built to make that
 * measurable rather than assertable: the speed readout is live, and
 * `verify-field-bench.mjs` holds |v| constant to 1e-9 over a whole orbit
 * integrated with motion-lab's RK4 — the same integrator that flies a
 * projectile, so the claim cannot hide behind a bespoke solver.
 *
 * ── B is out of the page, and that is physics ───────────────────────────────
 * F = qv×B with v in the page and B in the page points OUT of the page, and
 * the particle would leave the plane. A 2-D sim with in-plane B would be
 * showing a projection of a motion it is not computing. Out-of-page B keeps
 * planar motion exactly planar, which is why every magnetic source in this
 * engine produces B along ±ẑ and the canvas draws ⊗/⊙ glyphs rather than
 * arrows. See `lib/sources.ts`.
 *
 * ── The bead ────────────────────────────────────────────────────────────────
 * A 1 µC, 1 mg bead. Real SI numbers throughout, chosen so radii land in the
 * tens of centimetres and periods in seconds — an electron in the same field
 * would complete its orbit in nanoseconds, which is correct and unwatchable.
 */

import type { FieldArchetype, FieldScene } from './types';
import { num, uC, type ParamBag } from './lib/params';

/** The bead: 1 µC, 1 mg. r = mv/(qB) = 0.2 m at v = 0.4 m/s, B = 2 T. */
const BEAD_Q = uC(1);
const BEAD_M = 1e-6;

export const MAGNETIC_ARCHETYPES: Record<string, FieldArchetype> = {
  // ── 11 ─────────────────────────────────────────────────────────────────────
  'uniform-B-circular': {
    id: 'uniform-B-circular',
    title: 'A magnetic field bends, it never pushes',
    summary:
      'A charged bead fired across a uniform field into the page. It curls into a perfect circle — and the '
      + 'speed readout does not move by a single digit, because the force is always sideways.',
    mode: 'trajectory',
    kind: 'magnetic',
    targets: 'magnetic_force_does_work',
    params: [
      { key: 'B', label: 'Field strength', kind: 'number', default: 2, min: 0.5, max: 5, step: 0.1, unit: 'T' },
      { key: 'speed', label: 'Launch speed', kind: 'number', default: 0.4, min: 0.1, max: 0.8, step: 0.02, unit: 'm/s' },
      { key: 'charge', label: 'Charge', kind: 'number', default: 1, min: -2, max: 2, step: 0.1, unit: 'µC' },
    ],
    build(p?: ParamBag): FieldScene {
      const B = num(p, 'B', 2);
      const v = num(p, 'speed', 0.4);
      const q = uC(num(p, 'charge', 1));
      const r = Math.abs(q) > 0 ? (BEAD_M * v) / Math.abs(q * B) : 0.2;
      return {
        kind: 'magnetic',
        sources: [
          { id: 'B', kind: 'uniform-B', pos: { x: 0, y: 0 }, strength: B, label: 'uniform B, out of the page' },
        ],
        // Started on the circle it will draw, so the frame is the orbit itself.
        testCharges: [
          { id: 'bead', pos: { x: -r, y: 0 }, vel: { x: 0, y: v }, charge: q, mass: BEAD_M, label: 'charged bead' },
        ],
      };
    },
    defaultSteps: [
      { say: 'A uniform magnetic field fills the page, pointing out of it. A charged bead is about to be fired straight up through it. **Predict:** does it speed up, slow down, or neither?', cta: 'Fire it' },
      { say: 'A circle. Now watch the two readouts as it goes round: the direction changes continuously and the **speed does not change at all** — not slowly, not slightly. Exactly not.', cta: 'Check the work done' },
      { say: 'Work done: zero, to the last digit the integrator can hold. F = qv×B is perpendicular to v at every instant, and a force at 90° to the motion can never add or remove energy.', cta: 'Change the speed' },
      { say: 'A faster bead draws a bigger circle — r = mv/(qB) — but it still never gains or loses a joule. Speed sets the size of the circle, the field sets how sharply it turns.', cta: 'Done' },
    ],
  },

  // ── 12 ─────────────────────────────────────────────────────────────────────
  'velocity-selector': {
    id: 'velocity-selector',
    title: 'The velocity selector — one speed gets through',
    summary:
      'Crossed electric and magnetic fields. The electric force is fixed; the magnetic force grows with '
      + 'speed. They balance at exactly one speed, v = E/B — and it does not depend on charge or mass.',
    mode: 'trajectory',
    kind: 'magnetic',
    targets: 'magnetic_force_does_work',
    params: [
      { key: 'B', label: 'Magnetic field', kind: 'number', default: 2, min: 0.5, max: 4, step: 0.1, unit: 'T' },
      { key: 'E', label: 'Electric field', kind: 'number', default: 0.8, min: 0.1, max: 2, step: 0.05, unit: 'V/m' },
      { key: 'speed', label: 'Entry speed', kind: 'number', default: 0.4, min: 0.1, max: 0.8, step: 0.01, unit: 'm/s' },
      { key: 'charge', label: 'Charge', kind: 'number', default: 1, min: 0.2, max: 2, step: 0.1, unit: 'µC' },
    ],
    build(p?: ParamBag): FieldScene {
      const B = num(p, 'B', 2);
      const E = num(p, 'E', 0.8);
      return {
        kind: 'magnetic',
        sources: [
          // E points up (+y); qv×B for a positive charge moving +x in a +z field
          // points down. Balanced at v = E/B, and nothing here is special-cased.
          { id: 'E', kind: 'uniform-E', pos: { x: 0, y: 0 }, strength: E, angleDeg: 90, label: 'electric field, up' },
          { id: 'B', kind: 'uniform-B', pos: { x: 0, y: 0 }, strength: B, label: 'magnetic field, out of the page' },
        ],
        testCharges: [
          {
            id: 'bead', pos: { x: -0.30, y: 0 }, vel: { x: num(p, 'speed', 0.4), y: 0 },
            charge: uC(num(p, 'charge', 1)), mass: BEAD_M, label: 'entering bead',
          },
        ],
      };
    },
    defaultSteps: [
      { say: 'An electric field pushing up, and a magnetic field out of the page. A bead enters from the left. **Predict:** which way does it bend?', cta: 'Send it through' },
      { say: 'Look at the two force arrows. The electric one is the same whatever the speed. The magnetic one is qvB — it grows as the bead goes faster.', cta: 'Tune the speed until it goes straight' },
      { say: 'Dead straight at exactly v = E/B. Faster and the magnetic force wins and it bends down; slower and the electric force wins and it bends up.', cta: 'Change the charge' },
      { say: 'Change the charge — even the sign — and the same speed still gets through. Both forces scale with q, so q cancels out of the balance. That is why a selector selects SPEED and nothing else.', cta: 'Done' },
    ],
  },

  // ── 13 ─────────────────────────────────────────────────────────────────────
  cyclotron: {
    id: 'cyclotron',
    title: 'The cyclotron — a bigger circle in the same time',
    summary:
      'Two beads, same charge and mass, launched together at different speeds. The fast one sweeps a much '
      + 'bigger circle and gets back at exactly the same moment: T = 2πm/(qB) has no v in it.',
    mode: 'trajectory',
    kind: 'magnetic',
    targets: 'magnetic_force_does_work',
    params: [
      { key: 'B', label: 'Field strength', kind: 'number', default: 2, min: 0.5, max: 5, step: 0.1, unit: 'T' },
      { key: 'slow', label: 'Slow bead', kind: 'number', default: 0.25, min: 0.05, max: 0.5, step: 0.01, unit: 'm/s' },
      { key: 'fast', label: 'Fast bead', kind: 'number', default: 0.5, min: 0.1, max: 0.9, step: 0.01, unit: 'm/s' },
    ],
    build(p?: ParamBag): FieldScene {
      const B = num(p, 'B', 2);
      return {
        kind: 'magnetic',
        sources: [
          { id: 'B', kind: 'uniform-B', pos: { x: 0, y: 0 }, strength: B, label: 'uniform B, out of the page' },
        ],
        testCharges: [
          { id: 'slow', pos: { x: 0, y: 0 }, vel: { x: 0, y: num(p, 'slow', 0.25) }, charge: BEAD_Q, mass: BEAD_M, label: 'slow bead' },
          { id: 'fast', pos: { x: 0, y: 0 }, vel: { x: 0, y: num(p, 'fast', 0.5) }, charge: BEAD_Q, mass: BEAD_M, label: 'fast bead' },
        ],
      };
    },
    defaultSteps: [
      { say: 'Two identical beads leave the same point at the same instant, one twice as fast as the other. **Predict:** which one gets back first?', cta: 'Launch them both' },
      { say: 'Together. The fast bead has twice the radius, so twice the distance — at twice the speed. The two factors cancel and the periods are identical.', cta: 'Read the period' },
      { say: 'T = 2πm/(qB). No v anywhere in it. That is the whole reason a cyclotron can work: one fixed-frequency voltage keeps kicking the particle in step as its orbit grows.', cta: 'Turn the field up' },
      { say: 'Raise B and both circles shrink and both periods shorten — together, still. Only the field and the particle itself are in the timing.', cta: 'Done' },
    ],
  },
};
