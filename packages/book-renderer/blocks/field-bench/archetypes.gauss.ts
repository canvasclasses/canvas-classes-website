/*
 * field-bench/archetypes.gauss.ts — the Gauss Surface Lab.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ⚠ EVERY SOURCE HERE IS A LINE OR A SHELL, NEVER A POINT. That is not a
 * modelling shortcut, it is the only way this lab can be honest on a flat page.
 * A closed CURVE is the cross-section of a cylinder of unit length, so
 * ∮E·n̂ dl = λ_enc/ε₀ holds EXACTLY — the measured integral and the theorem's
 * prediction agree to the last digit while the student drags the surface
 * around. The flux of a 1/r² point-charge field through a circle genuinely does
 * depend on the radius, so putting a point charge in here would break the
 * lesson with a real physical effect, not a bug. See `lib/sources.ts`.
 *
 * All readouts are therefore PER METRE of length, and the UI says so out loud
 * rather than dropping the unit and hoping nobody checks.
 *
 * `conductor-cavity` is the one that repays the whole construction: a charge in
 * a cavity, an induced −q on the inner wall and +q on the outer wall, all three
 * modelled as real sources. The field inside the metal then comes out as
 * EXACTLY zero from superposition — computed, not drawn — and a Gauss surface
 * placed in the metal reads zero flux for the reason the chapter gives.
 */

import type { FieldArchetype, FieldScene } from './types';
import { num, nC, type ParamBag } from './lib/params';

export const GAUSS_ARCHETYPES: Record<string, FieldArchetype> = {
  // ── 7 ──────────────────────────────────────────────────────────────────────
  'gauss-sphere': {
    id: 'gauss-sphere',
    title: 'Grow the surface — the flux does not care',
    summary:
      'A long charged wire seen end-on, with a closed surface around it. Drag the radius from tiny to huge '
      + 'and watch the flux sit still, because the enclosed charge sat still.',
    mode: 'gauss',
    kind: 'electric',
    targets: 'flux_depends_on_surface_shape',
    params: [
      { key: 'lambda', label: 'Charge on the wire', kind: 'number', default: 2, min: -6, max: 6, step: 0.5, unit: 'nC/m' },
      { key: 'radius', label: 'Surface radius', kind: 'number', default: 0.20, min: 0.05, max: 0.42, step: 0.01, unit: 'm' },
      { key: 'shape', label: 'Surface shape', kind: 'select', default: 'circle', options: ['circle', 'rectangle'] },
    ],
    build(p?: ParamBag): FieldScene {
      const r = num(p, 'radius', 0.20);
      const rect = (p?.shape ?? 'circle') === 'rectangle';
      return {
        kind: 'electric',
        sources: [
          { id: 'w1', kind: 'line-charge', pos: { x: 0, y: 0 }, strength: nC(num(p, 'lambda', 2)), label: 'charged wire' },
        ],
        surfaces: [
          rect
            ? { id: 'S', shape: 'rectangle', centre: { x: 0, y: 0 }, size: { w: 2 * r, h: 1.6 * r }, label: 'Gauss surface' }
            : { id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: r, label: 'Gauss surface' },
        ],
      };
    },
    defaultSteps: [
      { say: 'A long charged wire, seen end-on, and a closed surface around it. The field on the surface is measured, then E·n̂ is added up all the way round.', cta: 'Measure the flux' },
      { say: 'That number is the real integral, not a formula. Beside it is what Gauss predicts from the enclosed charge alone. **Predict:** what happens to each if you double the radius?', cta: 'Double the radius' },
      { say: 'The field on the surface halved — and the surface got twice as long. The two changes cancel exactly, every time, because that is what 1/r geometry does.', cta: 'Switch to a rectangle' },
      { say: 'A box now, with corners and flat walls and a completely different field on every part of it. Same flux. The surface shape was never in the answer.', cta: 'Done' },
    ],
  },

  // ── 8 ──────────────────────────────────────────────────────────────────────
  'gauss-drag-me': {
    id: 'gauss-drag-me',
    title: 'Drag the surface anywhere — the flux will not move',
    summary:
      'The whole lesson in one gesture. Pick the surface up and drag it around the charge: the flux holds '
      + 'steady while it stays enclosed, and drops to zero the moment the charge is left outside.',
    mode: 'gauss',
    kind: 'electric',
    targets: 'flux_depends_on_position_inside',
    params: [
      { key: 'lambda', label: 'Charge on the wire', kind: 'number', default: 2, min: -6, max: 6, step: 0.5, unit: 'nC/m' },
      { key: 'radius', label: 'Surface radius', kind: 'number', default: 0.18, min: 0.06, max: 0.30, step: 0.01, unit: 'm' },
    ],
    build(p?: ParamBag): FieldScene {
      return {
        kind: 'electric',
        sources: [
          { id: 'w1', kind: 'line-charge', pos: { x: 0, y: 0 }, strength: nC(num(p, 'lambda', 2)), label: 'charged wire' },
        ],
        surfaces: [
          { id: 'S', shape: 'circle', centre: { x: 0.10, y: 0.06 }, radius: num(p, 'radius', 0.18), label: 'drag me' },
        ],
      };
    },
    defaultSteps: [
      { say: 'The charge is off to one side of the surface, not in the middle. **Predict:** is the flux bigger, smaller, or the same as when it was centred?', cta: 'Read the flux' },
      { say: 'The same. Now pick the surface up and drag it around — slowly, and watch the number, not the picture.', cta: 'Drag it right off the charge' },
      { say: 'The instant the charge is outside, the flux falls to zero: every line that enters also leaves. Bring it back in and the old value returns exactly.', cta: 'Done' },
    ],
  },

  // ── 9 ──────────────────────────────────────────────────────────────────────
  'gauss-off-centre': {
    id: 'gauss-off-centre',
    title: 'A charge inside, a charge outside',
    summary:
      'Two identical wires, one enclosed and one not. Both bend the field on the surface; only one shows up '
      + 'in the flux. Outside charges change the FIELD everywhere and the FLUX not at all.',
    mode: 'gauss',
    kind: 'electric',
    targets: 'flux_depends_on_position_inside',
    params: [
      { key: 'lambda', label: 'Both wires', kind: 'number', default: 2, min: -6, max: 6, step: 0.5, unit: 'nC/m' },
      { key: 'offset', label: 'Inside wire offset', kind: 'number', default: 0.08, min: 0, max: 0.18, step: 0.01, unit: 'm' },
      { key: 'radius', label: 'Surface radius', kind: 'number', default: 0.22, min: 0.10, max: 0.30, step: 0.01, unit: 'm' },
    ],
    build(p?: ParamBag): FieldScene {
      const q = nC(num(p, 'lambda', 2));
      const off = num(p, 'offset', 0.08);
      return {
        kind: 'electric',
        sources: [
          { id: 'in', kind: 'line-charge', pos: { x: off, y: -off * 0.5 }, strength: q, label: 'wire inside' },
          { id: 'out', kind: 'line-charge', pos: { x: 0.46, y: 0.20 }, strength: q, label: 'wire outside' },
        ],
        surfaces: [
          { id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: num(p, 'radius', 0.22), label: 'Gauss surface' },
        ],
      };
    },
    defaultSteps: [
      { say: 'Two identical wires. One is inside the surface, one is well outside — and the outside one is definitely bending the field on the surface. **Predict:** does it add to the flux?', cta: 'Read the flux' },
      { say: 'It adds nothing. Its lines go in one side of the surface and out the other, so its net contribution is exactly zero however close it comes.', cta: 'Slide the inside wire around' },
      { say: 'Move the enclosed wire anywhere inside — centre, edge, anywhere. The flux never budges. Only the enclosed charge is in the answer.', cta: 'Done' },
    ],
  },

  // ── 10 ─────────────────────────────────────────────────────────────────────
  'conductor-cavity': {
    id: 'conductor-cavity',
    title: 'Inside the metal, the field is exactly zero',
    summary:
      'A charge in a hollow conductor. The induced charges on the inner and outer walls are real sources '
      + 'here, so the zero field inside the metal is COMPUTED from superposition — not drawn in by hand.',
    mode: 'gauss',
    kind: 'electric',
    targets: 'field_inside_conductor_nonzero',
    params: [
      { key: 'lambda', label: 'Charge in the cavity', kind: 'number', default: 3, min: -6, max: 6, step: 0.5, unit: 'nC/m' },
      { key: 'inner', label: 'Inner wall', kind: 'number', default: 0.12, min: 0.06, max: 0.18, step: 0.01, unit: 'm' },
      { key: 'outer', label: 'Outer wall', kind: 'number', default: 0.22, min: 0.19, max: 0.32, step: 0.01, unit: 'm' },
      { key: 'probe', label: 'Surface radius', kind: 'number', default: 0.17, min: 0.03, max: 0.38, step: 0.01, unit: 'm' },
    ],
    build(p?: ParamBag): FieldScene {
      const q = nC(num(p, 'lambda', 3));
      const a = num(p, 'inner', 0.12);
      const b = Math.max(num(p, 'outer', 0.22), a + 0.02);
      return {
        kind: 'electric',
        sources: [
          { id: 'q0', kind: 'line-charge', pos: { x: 0, y: 0 }, strength: q, label: 'charge in the cavity' },
          { id: 'inner', kind: 'ring-charge', pos: { x: 0, y: 0 }, radius: a, strength: -q, label: 'induced −q, inner wall' },
          { id: 'outer', kind: 'ring-charge', pos: { x: 0, y: 0 }, radius: b, strength: q, label: 'induced +q, outer wall' },
        ],
        surfaces: [
          { id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: num(p, 'probe', 0.17), label: 'Gauss surface' },
        ],
      };
    },
    defaultSteps: [
      { say: 'A charged wire sits in a hollow metal tube. The metal has pulled −q onto its inner wall and pushed +q onto its outer wall — both are real charges in this scene.', cta: 'Put the surface inside the metal' },
      { say: 'The surface now sits in the metal itself. It encloses +q on the wire and −q on the inner wall: **net zero, so zero flux** — and the field measured on it is zero too.', cta: 'Shrink it into the cavity' },
      { say: 'Inside the cavity there is only the wire, so the field is back and the flux is q/ε₀ per metre. The metal was never shielding the cavity from its own charge.', cta: 'Grow it past the outer wall' },
      { say: 'Outside everything, the enclosed charge is +q − q + q = +q again. From out here the tube is invisible — which is exactly why a car is a safe place in a lightning storm.', cta: 'Done' },
    ],
  },
};
