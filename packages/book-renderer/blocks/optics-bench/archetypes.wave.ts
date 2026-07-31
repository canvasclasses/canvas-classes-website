/*
 * optics-bench/archetypes.wave.ts — where the ray model runs out.
 * ─────────────────────────────────────────────────────────────────────────────
 * Two archetypes, and their job is partly to fail. A ray tracer predicts two
 * bright lines behind a double slit and a sharp-edged shadow behind a single
 * one. Both predictions are wrong, and being able to state exactly what the ray
 * model predicts is what makes the real pattern mean something.
 *
 * These are `mode: 'wave'`, so `WaveBench` computes intensity from path
 * difference (`lib/wave.ts`) instead of tracing. Nothing is bent round a
 * corner — diffraction is not refraction, and a sim that draws it as bending
 * teaches a lie that survives to the exam hall.
 *
 * Pure — no React, no DOM.
 */

import type { Bench, OpticsMisconception } from './types';
import type { OpticsArchetypeEx, OpticsArchetypeMap } from './archetypes.bench';

type P = Record<string, number | string | boolean> | undefined;
const num = (p: P, k: string, d: number): number => {
  const v = p?.[k];
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
};

/**
 * The wave archetypes still return a Bench, because the contract says `build`
 * returns one and because the geometry (slit plane, screen distance) is real
 * bench geometry. `WaveBench` reads the numbers off the elements rather than
 * tracing them, and `lib/wave.ts` does the physics.
 *
 * `aperture` on the grating carries the SLIT SEPARATION in mm and `apexDeg`
 * carries the slit WIDTH in mm — both documented at every use site, both
 * otherwise-dead fields on a grating.
 *
 * A single slit has no separation, and storing that as `aperture: 0` is a
 * foot-gun: an aperture of zero on any other element blocks the entire bundle,
 * and nothing stops a later refactor from treating a grating the same way. So a
 * one-slit bench stores the slit WIDTH there instead. `WaveBench` reads d from
 * the params (where it is forced to 0 for one slit), never from this field, so
 * the physics is unaffected either way.
 */
function slitBench(dMm: number, aMm: number, Dcm: number, lambdaNm: number, slits: number): Bench {
  return {
    nMedium: 1,
    elements: [
      { id: 'SLITS', kind: 'grating', x: 0, aperture: dMm > 0 ? dMm : aMm, apexDeg: aMm, n: slits, label: 'Slits' },
      { id: 'SCREEN', kind: 'screen', x: Dcm, aperture: 8, label: 'Screen' },
    ],
    sources: [{ id: 'S', x: -12, y: 0, kind: 'parallel-beam', beamAngleDeg: 0, rayCount: 5, wavelength: lambdaNm }],
  };
}

// ── 16. Young's double slit ──────────────────────────────────────────────────

const ydse: OpticsArchetypeEx = {
  id: 'ydse',
  title: "Young's double slit — path difference is the only variable",
  summary:
    'Two slits, one screen, and a row of bright and dark bands where a ray model says there should be exactly two bright lines. Change λ, the separation, or the screen distance and the fringes respond to just one combination of them: λD/d.',
  mode: 'wave',
  targets: 'rays_are_only_three' as OpticsMisconception,
  params: [
    { key: 'lambda', label: 'Wavelength', kind: 'number', default: 600, min: 400, max: 700, step: 5, unit: 'nm' },
    { key: 'd', label: 'Slit separation', kind: 'number', default: 0.5, min: 0.1, max: 2, step: 0.05, unit: 'mm' },
    { key: 'a', label: 'Slit width', kind: 'number', default: 0.1, min: 0.02, max: 0.5, step: 0.01, unit: 'mm' },
    { key: 'D', label: 'Screen distance', kind: 'number', default: 100, min: 30, max: 250, step: 10, unit: 'cm' },
    { key: 'slits', label: 'Number of slits', kind: 'number', default: 2, min: 2, max: 8, step: 1 },
  ],
  build(p): Bench {
    return slitBench(
      num(p, 'd', 0.5), num(p, 'a', 0.1), num(p, 'D', 100),
      num(p, 'lambda', 600), Math.round(num(p, 'slits', 2)),
    );
  },
  defaultSteps: [
    { say: 'Two narrow slits, lit by one colour. Before anything is computed: what does a RAY model predict on the screen? Two bright lines, one behind each slit, and darkness everywhere else.', cta: 'Show what really happens' },
    { say: 'Instead there is a whole row of evenly spaced bands, including a bright one at the centre where the ray model says nothing should be at all. Light arriving from two places can cancel.', cta: 'Show the path difference' },
    { say: 'The only thing that varies across the screen is the difference in distance from the two slits. Where that difference is a whole number of wavelengths the waves arrive in step and add; where it is a half-integer they arrive opposed and cancel.', cta: 'Change the settings' },
    { say: 'Now change λ, d and D one at a time. Every fringe spacing you can produce comes out of the single combination β = λD/d — nothing else about the apparatus matters.', cta: 'Done' },
  ],
  probe: {
    afterStep: 1,
    prompt: 'The centre of the screen is bright. It is equidistant from both slits — so what makes it bright?',
    options: [
      'Both slits are in line with it, so twice as much light lands there',
      'The path difference is zero, so the two waves arrive exactly in step whatever the wavelength',
      'It is the shadow of the gap between the slits',
      'The slits are narrow, so the light spreads to the middle',
    ],
    answerIndex: 1,
    perOption: [
      'Twice the light would be true if waves just piled up. They do not — a few millimetres away is a DARK fringe, where twice as much light arrives and the result is nothing at all. Adding light can give darkness, and that is the discovery.',
      'Right, and notice the consequence: the central fringe is bright for every colour, which is why the centre of a white-light pattern is white and only the fringes further out are coloured.',
      'A shadow is a ray-model idea. The bright centre sits exactly where the ray model predicts darkness.',
      'The spreading is real and it is what lets the two beams overlap at all — but overlapping is not the same as being bright. Whether the overlap is bright or dark depends on the path difference.',
    ],
    reveal:
      'Interference is decided by path difference and nothing else. Rays cannot describe this because a ray has no phase — it is a line with a direction, and two lines crossing cannot cancel. That is not a flaw in your diagram; it is the boundary of the model, and it is exactly where wave optics starts.',
  },
};

// ── 17. Single-slit diffraction ──────────────────────────────────────────────

const singleSlit: OpticsArchetypeEx = {
  id: 'single-slit',
  title: 'Single slit — narrow it and the pattern gets WIDER',
  summary:
    'One slit, and the answer runs backwards to every intuition: squeeze the opening and the bright band spreads out instead of shrinking. The central maximum is 2λD/a wide, so a is on the bottom — which is why you cannot make a beam arbitrarily narrow.',
  mode: 'wave',
  targets: 'rays_are_only_three' as OpticsMisconception,
  params: [
    { key: 'lambda', label: 'Wavelength', kind: 'number', default: 600, min: 400, max: 700, step: 5, unit: 'nm' },
    { key: 'a', label: 'Slit width', kind: 'number', default: 0.15, min: 0.02, max: 0.6, step: 0.01, unit: 'mm' },
    { key: 'D', label: 'Screen distance', kind: 'number', default: 120, min: 30, max: 250, step: 10, unit: 'cm' },
    { key: 'compare', label: 'Show the ray-model prediction', kind: 'boolean', default: true },
  ],
  build(p): Bench {
    return slitBench(0, num(p, 'a', 0.15), num(p, 'D', 120), num(p, 'lambda', 600), 1);
  },
  defaultSteps: [
    { say: 'One slit, 0.15 mm wide. The ray model is unambiguous here: a sharp-edged bright strip 0.15 mm across on the screen, and darkness outside it. That prediction is drawn as the dashed outline.', cta: 'Show the real pattern' },
    { say: 'What actually appears is a broad central band several millimetres wide, with faint fringes either side and dark gaps between them. The edges are not sharp and the light has gone where no ray could take it.', cta: 'Narrow the slit' },
    { say: 'Now make the slit narrower — and the pattern gets WIDER. Squeeze the opening and the light spreads more. The central band is 2λD/a across, with a on the bottom of the fraction.', cta: 'Widen it' },
    { say: 'Open the slit up and the pattern collapses back down towards the geometric strip. That is why ray optics works at all: for everyday apertures a is millions of wavelengths, and the spreading is too small to see.', cta: 'Done' },
  ],
  probe: {
    afterStep: 1,
    prompt: 'You halve the slit width. What happens to the width of the central bright band?',
    options: ['It halves', 'It doubles', 'It stays the same', 'It halves and gets brighter'],
    answerIndex: 1,
    perOption: [
      'That is the ray-model answer — halve the hole, halve the strip of light. Try it on the slider: the band gets wider, not narrower.',
      'Right, and it is worth sitting with how strange that is. Squeezing light makes it spread. The central band is 2λD/a, so halving a doubles it.',
      'The width is set by 2λD/a. Change a and the width must change; only the product λD could keep it fixed.',
      'It gets dimmer, not brighter — half the opening lets half the light through — and it gets wider, not narrower.',
    ],
    reveal:
      'Diffraction spreads light by roughly λ/a radians. It is not the ray model being slightly inaccurate; it is a different model, and the ray model is the limit of it when a ≫ λ. It also sets a hard floor on every optical instrument: a telescope of aperture a can never resolve detail finer than about λ/a, no matter how good the glass is.',
  },
};

export const WAVE_ARCHETYPES: OpticsArchetypeMap = {
  [ydse.id]: ydse,
  [singleSlit.id]: singleSlit,
};

export const WAVE_ARCHETYPE_ORDER = ['ydse', 'single-slit'];
