/*
 * field-bench/reveal.ts — what appears on which click.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * Design law #5: guided, never auto-playing. The panel states what is about to
 * happen, the student clicks, ONE new thing appears. So every archetype needs
 * to say which layer each of its clicks turns on — and it has to match the
 * words in its own `defaultSteps`, or the script promises a thing the reveal
 * does not deliver.
 *
 * That correspondence is DATA here rather than a shared "vectors then lines
 * then contours" ladder, because the scripts genuinely differ: `single-charge`
 * probes an empty point first and draws the lines second, while `dipole` needs
 * the lines up before it can talk about crossings, and `equipotentials` opens
 * with the contours already on because its first sentence is about them.
 * One hardcoded order would have to be wrong for at least two of the three.
 *
 * Index i = the layers that switch on when the student ARRIVES at step i, so
 * `layersAt(id, step)` is the union of entries 0…step. An unknown id falls back
 * to a sensible per-mode default rather than showing nothing.
 */

export type Layer =
  | 'lines' | 'equipotentials' | 'vectors' | 'probe'
  | 'flux' | 'predicted' | 'path' | 'arrows';

const REVEAL: Record<string, Layer[][]> = {
  // ── sculptor ──────────────────────────────────────────────────────────────
  'single-charge': [[], ['probe', 'vectors'], ['lines'], ['equipotentials']],
  dipole: [[], ['lines'], ['equipotentials'], ['probe', 'vectors']],
  'two-like-charges': [[], ['lines'], ['probe', 'vectors']],
  equipotentials: [['equipotentials'], ['probe', 'vectors'], ['lines']],
  'g-inside-earth': [['probe', 'vectors'], [], [], ['lines']],

  // ── gauss ─────────────────────────────────────────────────────────────────
  'gauss-sphere': [['vectors'], ['flux', 'predicted'], [], []],
  'gauss-drag-me': [['vectors'], ['flux', 'predicted'], []],
  'gauss-off-centre': [['vectors'], ['flux', 'predicted'], []],
  'conductor-cavity': [['vectors'], ['flux', 'predicted'], [], []],

  // ── trajectory ────────────────────────────────────────────────────────────
  'charge-released-from-rest': [[], ['lines'], ['path', 'arrows']],
  'charge-with-sideways-velocity': [['lines'], ['path', 'arrows'], []],
  'uniform-B-circular': [[], ['path', 'arrows'], [], []],
  'velocity-selector': [[], ['path', 'arrows'], [], []],
  cyclotron: [[], ['path', 'arrows'], [], []],
  'orbit-sandbox': [['vectors'], ['path', 'arrows'], [], []],
};

const FALLBACK: Record<string, Layer[]> = {
  sculptor: ['lines', 'equipotentials', 'vectors', 'probe'],
  gauss: ['vectors', 'flux', 'predicted'],
  trajectory: ['lines', 'path', 'arrows', 'vectors'],
  photoelectric: [],
};

/** Everything visible by the time the student has reached `step`. */
export function layersAt(archetypeId: string | undefined, mode: string, step: number): Set<Layer> {
  const script = archetypeId ? REVEAL[archetypeId] : undefined;
  if (!script) return new Set(FALLBACK[mode] ?? FALLBACK.sculptor);
  const out = new Set<Layer>();
  for (let i = 0; i <= Math.min(step, script.length - 1); i++) {
    for (const l of script[i]) out.add(l);
  }
  return out;
}

/** Everything an archetype ever reveals — the state once the script is done or
 *  when the block is authored unguided. */
export function allLayers(archetypeId: string | undefined, mode: string): Set<Layer> {
  const script = archetypeId ? REVEAL[archetypeId] : undefined;
  if (!script) return new Set(FALLBACK[mode] ?? FALLBACK.sculptor);
  const out = new Set<Layer>();
  for (const set of script) for (const l of set) out.add(l);
  // A finished sculptor script always ends with everything available, even if
  // its own narration never needed the contours — the student is now free to
  // explore, and hiding a layer at that point reads as a missing feature.
  if (mode === 'sculptor') { out.add('lines'); out.add('equipotentials'); out.add('probe'); out.add('vectors'); }
  if (mode === 'gauss') { out.add('flux'); out.add('predicted'); out.add('vectors'); }
  if (mode === 'trajectory') { out.add('path'); out.add('arrows'); }
  return out;
}
