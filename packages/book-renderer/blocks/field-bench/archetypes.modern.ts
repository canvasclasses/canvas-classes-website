/*
 * field-bench/archetypes.modern.ts — the Photoelectric Bench.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * The photoelectric effect is in the FIELD engine because what it is really
 * about is the stopping POTENTIAL — a field quantity — and the difference
 * between a potential in volts and an energy in joules. That is the same
 * `potential_is_potential_energy` confusion the electrostatics archetypes
 * attack, met again where it does the most damage: a student who thinks
 * "stopping potential" and "maximum kinetic energy" are the same number cannot
 * read the graph Millikan used to measure h.
 *
 * The bench has no sources — the scene is empty on purpose. Its physics lives
 * entirely in `lib/photoelectric.ts`, which is exact for every quantity a
 * student is asked to read and honest in its comments about the one thing that
 * is modelled (the shape, not the zero, of the retarding branch).
 */

import type { FieldArchetype, FieldScene } from './types';
import { num, str, type ParamBag } from './lib/params';
import { WORK_FUNCTIONS } from './lib/photoelectric';

export const MODERN_ARCHETYPES: Record<string, FieldArchetype> = {
  // ── 14 ─────────────────────────────────────────────────────────────────────
  photoelectric: {
    id: 'photoelectric',
    title: 'Two knobs that do completely different things',
    summary:
      'Brightness and colour, on the same lamp. One changes how many electrons come out; the other changes '
      + 'how much energy each one leaves with — and below the threshold colour, no brightness works at all.',
    mode: 'photoelectric',
    kind: 'electric',
    targets: 'potential_is_potential_energy',
    params: [
      { key: 'metal', label: 'Cathode metal', kind: 'select', default: 'Sodium', options: WORK_FUNCTIONS.map((w) => w.name) },
      { key: 'frequency', label: 'Light frequency', kind: 'number', default: 8, min: 3, max: 16, step: 0.1, unit: '×10¹⁴ Hz' },
      { key: 'intensity', label: 'Brightness', kind: 'number', default: 1, min: 0.2, max: 5, step: 0.1, unit: 'W/m²' },
    ],
    build(p?: ParamBag): FieldScene {
      // Read so a bad param is caught here rather than deep in the renderer.
      const metal = str(p, 'metal', 'Sodium');
      void metal;
      void num(p, 'frequency', 8);
      return { kind: 'electric', sources: [] };
    },
    defaultSteps: [
      { say: 'Sodium cathode, light at 8×10¹⁴ Hz, and a voltage you can run either way. **Predict:** turn the brightness up — what changes on the I–V curve?', cta: 'Turn the brightness up' },
      { say: 'The current rose — more photons, more electrons. But look where the curve meets zero on the left: it has not moved a millimetre. Brightness changed how MANY, not how FAST.', cta: 'Change the colour instead' },
      { say: 'Now the zero crossing moves. Higher frequency, more energy per photon, more energy left over after the work function is paid — a bigger stopping potential.', cta: 'Go below the threshold' },
      { say: 'Nothing. Not a trickle. Wind the brightness to maximum and it is still nothing, because a million photons that are each too weak are still each too weak. Energy arrives one photon at a time.', cta: 'Read the two numbers together' },
      { say: 'Last thing, and it is the one that costs marks: the stopping potential is in VOLTS, the maximum kinetic energy is in joules, and eV₀ = KE_max is what connects them. They are the same fact, not the same quantity.', cta: 'Done' },
    ],
  },
};
