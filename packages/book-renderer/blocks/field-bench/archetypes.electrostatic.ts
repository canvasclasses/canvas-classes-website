/*
 * field-bench/archetypes.electrostatic.ts — Field Sculptor + released charges.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Every construction is a side-effect-free function of
 * its params, which is what lets `scripts/verify-field-bench.mjs` check the
 * physics of every archetype in a plain node run.
 *
 * ── The pair that carries the headline ──────────────────────────────────────
 * `charge-released-from-rest` and `charge-with-sideways-velocity` share the
 * SAME source — one negative charge, whose field lines are dead straight
 * radial spokes. Released from rest, the test charge runs down a spoke and a
 * student's belief that "a charge follows the field line" is confirmed. Then
 * the second archetype gives that identical charge a sideways nudge and it
 * sweeps an ellipse that crosses every spoke it meets.
 *
 * Same field, same charge, same integrator, one changed initial condition, two
 * opposite outcomes. That is the `field_lines_are_paths` misconception taken
 * apart rather than merely contradicted — and it is why the two archetypes are
 * deliberately not merged into one with a velocity slider hidden in the corner.
 *
 * Units: charges authored in nanocoulombs, distances in metres, the probe a
 * 1 nC bead of mass 1 mg so its accelerations are of order 1 m/s² and the
 * motion is watchable in real time rather than over microseconds.
 */

import type { FieldArchetype, FieldScene } from './types';
import { num, nC, type ParamBag } from './lib/params';

/** The standard probe: 1 nC, 1 mg. a = qE/m ≈ 1 m/s² in these scenes. */
const PROBE_MASS = 1e-6;

export const ELECTROSTATIC_ARCHETYPES: Record<string, FieldArchetype> = {
  // ── 1 ──────────────────────────────────────────────────────────────────────
  'single-charge': {
    id: 'single-charge',
    title: 'One charge, and the space around it',
    summary:
      'A single charge and the field it puts into empty space. Move the probe anywhere — the arrow '
      + 'changes because the FIELD is different there, not because the probe is.',
    mode: 'sculptor',
    kind: 'electric',
    targets: 'field_needs_a_test_charge',
    params: [
      { key: 'charge', label: 'Charge', kind: 'number', default: 5, min: -10, max: 10, step: 0.5, unit: 'nC' },
      { key: 'probeX', label: 'Probe x', kind: 'number', default: 0.30, min: -0.4, max: 0.4, step: 0.01, unit: 'm' },
      { key: 'probeY', label: 'Probe y', kind: 'number', default: 0.18, min: -0.4, max: 0.4, step: 0.01, unit: 'm' },
    ],
    build(p?: ParamBag): FieldScene {
      return {
        kind: 'electric',
        sources: [
          { id: 'q1', kind: 'point-charge', pos: { x: 0, y: 0 }, strength: nC(num(p, 'charge', 5)), label: 'source charge' },
        ],
        testCharges: [
          {
            id: 'probe', pos: { x: num(p, 'probeX', 0.30), y: num(p, 'probeY', 0.18) },
            charge: nC(1), mass: PROBE_MASS, label: 'probe',
          },
        ],
      };
    },
    defaultSteps: [
      { say: 'One charge sits at the centre. Before anything is drawn: **is there a field at the empty point over here, where nothing is?**', cta: 'Show the field there' },
      { say: 'There is. The field is a property of the SPACE, made by the source charge. The probe only reveals it — it does not create it, and removing the probe does not remove the field.', cta: 'Draw the field lines' },
      { say: 'Lines point away from a positive charge and crowd together where the field is strong. Drag the probe: near the charge the arrow is long, far away it is short — by the inverse square.', cta: 'Add the equipotentials' },
      { say: 'The rings are the equipotentials. Notice where they cross the lines, and hold that thought — it is the same everywhere, and it is not a coincidence.', cta: 'Done' },
    ],
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  dipole: {
    id: 'dipole',
    title: 'The dipole — lines and equipotentials, always at 90°',
    summary:
      'Equal and opposite charges. Every field line leaves the positive charge, curves across, and lands '
      + 'on the negative one — cutting every equipotential it meets at a right angle.',
    mode: 'sculptor',
    kind: 'electric',
    targets: 'equipotential_not_perpendicular',
    params: [
      { key: 'charge', label: 'Charge', kind: 'number', default: 5, min: 1, max: 10, step: 0.5, unit: 'nC' },
      { key: 'separation', label: 'Separation', kind: 'number', default: 0.30, min: 0.08, max: 0.5, step: 0.01, unit: 'm' },
    ],
    build(p?: ParamBag): FieldScene {
      const q = nC(num(p, 'charge', 5));
      const d = num(p, 'separation', 0.30) / 2;
      return {
        kind: 'electric',
        sources: [
          { id: 'qp', kind: 'point-charge', pos: { x: -d, y: 0 }, strength: q, label: 'positive' },
          { id: 'qn', kind: 'point-charge', pos: { x: d, y: 0 }, strength: -q, label: 'negative' },
        ],
        testCharges: [{ id: 'probe', pos: { x: 0, y: 0.22 }, charge: nC(1), mass: PROBE_MASS, label: 'probe' }],
      };
    },
    defaultSteps: [
      { say: 'Two equal and opposite charges. **Predict:** what shape does the field make halfway between them?', cta: 'Draw the field lines' },
      { say: 'Every line starts on the positive charge and ends on the negative one. None of them cross — if two lines crossed, the field would point two ways at one point, which is impossible.', cta: 'Add the equipotentials' },
      { say: 'Now look at every single crossing. **Field line and equipotential meet at 90°, everywhere, without exception.** That is forced: moving ALONG an equipotential costs no work, so the force can have no component along it.', cta: 'Measure the angle' },
      { say: 'Drag the probe onto any equipotential and read the angle. It stays 90° no matter where you put it — including out in the far corners where the lines look almost straight.', cta: 'Done' },
    ],
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  'two-like-charges': {
    id: 'two-like-charges',
    title: 'Two like charges — and the point where the field is exactly zero',
    summary:
      'Two positive charges push the lines apart. Exactly halfway between them the two contributions '
      + 'cancel, and the field is zero — at a point where there is nothing at all.',
    mode: 'sculptor',
    kind: 'electric',
    targets: 'field_needs_a_test_charge',
    params: [
      { key: 'charge', label: 'Both charges', kind: 'number', default: 5, min: 1, max: 10, step: 0.5, unit: 'nC' },
      { key: 'separation', label: 'Separation', kind: 'number', default: 0.30, min: 0.08, max: 0.5, step: 0.01, unit: 'm' },
    ],
    build(p?: ParamBag): FieldScene {
      const q = nC(num(p, 'charge', 5));
      const d = num(p, 'separation', 0.30) / 2;
      return {
        kind: 'electric',
        sources: [
          { id: 'qa', kind: 'point-charge', pos: { x: -d, y: 0 }, strength: q, label: 'charge A' },
          { id: 'qb', kind: 'point-charge', pos: { x: d, y: 0 }, strength: q, label: 'charge B' },
        ],
        testCharges: [{ id: 'probe', pos: { x: 0, y: 0.14 }, charge: nC(1), mass: PROBE_MASS, label: 'probe' }],
      };
    },
    defaultSteps: [
      { say: 'Two charges, both positive, both the same size. **Predict:** what happens at the exact midpoint?', cta: 'Draw the field lines' },
      { say: 'The lines bend away from each other — neither charge will let a line through. Now drag the probe to the midpoint and watch the readout.', cta: 'Snap the probe to the middle' },
      { say: 'Exactly zero. Not small — zero, because the two contributions are equal and opposite and superposition is a plain sum. There is nothing at that point, and the field there is still a definite value.', cta: 'Done' },
    ],
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  equipotentials: {
    id: 'equipotentials',
    title: 'Potential is not energy — the map before the charge arrives',
    summary:
      'A landscape of potential in volts, drawn before any charge is put into it. Energy only appears '
      + 'when a charge is placed: U = qV, so the same point is worth different energies to different charges.',
    mode: 'sculptor',
    kind: 'electric',
    targets: 'potential_is_potential_energy',
    params: [
      { key: 'qA', label: 'Left charge', kind: 'number', default: 6, min: -10, max: 10, step: 0.5, unit: 'nC' },
      { key: 'qB', label: 'Right charge', kind: 'number', default: -4, min: -10, max: 10, step: 0.5, unit: 'nC' },
      { key: 'probeCharge', label: 'Probe charge', kind: 'number', default: 1, min: -4, max: 4, step: 0.5, unit: 'nC' },
    ],
    build(p?: ParamBag): FieldScene {
      return {
        kind: 'electric',
        sources: [
          { id: 'qa', kind: 'point-charge', pos: { x: -0.18, y: 0 }, strength: nC(num(p, 'qA', 6)), label: 'left charge' },
          { id: 'qb', kind: 'point-charge', pos: { x: 0.16, y: 0.06 }, strength: nC(num(p, 'qB', -4)), label: 'right charge' },
        ],
        testCharges: [
          { id: 'probe', pos: { x: 0.02, y: -0.20 }, charge: nC(num(p, 'probeCharge', 1)), mass: PROBE_MASS, label: 'probe' },
        ],
      };
    },
    defaultSteps: [
      { say: 'These contours are the POTENTIAL — volts at every point in space. No charge has been placed yet, and the map already exists.', cta: 'Place the probe' },
      { say: 'Now there is an energy: U = qV. Read them side by side — V is a property of the point, U is a property of the point AND the charge you put there.', cta: 'Flip the probe negative' },
      { say: 'Same point. Same V. **Opposite U.** If potential and potential energy were the same thing, that could not happen.', cta: 'Done' },
    ],
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  'charge-released-from-rest': {
    id: 'charge-released-from-rest',
    title: 'Released from rest — this time it does follow the line',
    summary:
      'A positive charge let go from rest near a negative one. The field lines here are straight radial '
      + 'spokes, so the charge runs down the spoke it started on — the one case where path and field line agree.',
    mode: 'trajectory',
    kind: 'electric',
    targets: 'field_lines_are_paths',
    params: [
      { key: 'source', label: 'Central charge', kind: 'number', default: -8, min: -12, max: -2, step: 0.5, unit: 'nC' },
      { key: 'startX', label: 'Release distance', kind: 'number', default: 0.25, min: 0.10, max: 0.35, step: 0.01, unit: 'm' },
    ],
    build(p?: ParamBag): FieldScene {
      return {
        kind: 'electric',
        sources: [
          { id: 'q0', kind: 'point-charge', pos: { x: 0, y: 0 }, strength: nC(num(p, 'source', -8)), fixed: true, label: 'fixed charge' },
        ],
        testCharges: [
          {
            id: 'probe', pos: { x: num(p, 'startX', 0.25), y: 0 }, vel: { x: 0, y: 0 },
            charge: nC(1), mass: PROBE_MASS, label: 'released charge',
          },
        ],
      };
    },
    defaultSteps: [
      { say: 'A fixed negative charge, and a positive one held at rest out to the right. **Predict:** when you let go, does it follow the field line it is sitting on?', cta: 'Draw the field lines' },
      { say: 'Straight spokes, all pointing inward. The charge is at rest, so its velocity has no say yet and the first thing it does must be along the force.', cta: 'Release it' },
      { say: 'It runs straight down the spoke. So "a charge follows the field line" holds here — but hold on to exactly what made it hold: it started **at rest**, and the line is **straight**. Break either and it fails.', cta: 'Done' },
    ],
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  'charge-with-sideways-velocity': {
    id: 'charge-with-sideways-velocity',
    title: 'Give it a sideways push — and it cuts straight across the lines',
    summary:
      'Identical field, identical charge, one difference: it is moving sideways when released. It now sweeps '
      + 'a curve that crosses every field line it meets. Field lines show the FORCE, never the path.',
    mode: 'trajectory',
    kind: 'electric',
    targets: 'field_lines_are_paths',
    params: [
      { key: 'source', label: 'Central charge', kind: 'number', default: -8, min: -12, max: -2, step: 0.5, unit: 'nC' },
      { key: 'startX', label: 'Release distance', kind: 'number', default: 0.25, min: 0.10, max: 0.35, step: 0.01, unit: 'm' },
      { key: 'vy', label: 'Sideways speed', kind: 'number', default: 0.35, min: 0, max: 0.85, step: 0.01, unit: 'm/s' },
    ],
    build(p?: ParamBag): FieldScene {
      return {
        kind: 'electric',
        sources: [
          { id: 'q0', kind: 'point-charge', pos: { x: 0, y: 0 }, strength: nC(num(p, 'source', -8)), fixed: true, label: 'fixed charge' },
        ],
        testCharges: [
          {
            id: 'probe', pos: { x: num(p, 'startX', 0.25), y: 0 }, vel: { x: 0, y: num(p, 'vy', 0.35) },
            charge: nC(1), mass: PROBE_MASS, label: 'moving charge',
          },
        ],
      };
    },
    defaultSteps: [
      { say: 'Same charge, same field, same release point. The only change: it is already moving upward when you let go. **Predict:** does it still follow the spoke?', cta: 'Release it' },
      { say: 'It does not. It cuts clean across every line. The field line tells you which way the FORCE points at each instant — and force sets the change in velocity, not the velocity itself.', cta: 'Turn the sideways speed down to zero' },
      { say: 'At zero it collapses back onto the spoke. Wind it up and the curve opens out into an orbit and then escapes. One slider, and "field lines are paths" is finished.', cta: 'Done' },
    ],
  },
};
