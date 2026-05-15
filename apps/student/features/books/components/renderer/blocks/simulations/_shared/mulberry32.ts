/*
 * mulberry32
 * -----------
 * Deterministic 32-bit PRNG — given the same seed, returns the same sequence
 * of pseudo-random floats in the range [0, 1). Roughly 2^32 period, which is
 * plenty for the scale of particle counts we generate in any single sim.
 *
 * Why this exists in the simulator bundle:
 *
 *   Simulators that use `Math.random()` for their initial particle layout
 *   will produce DIFFERENT output on the server render and the client render,
 *   causing React hydration mismatches. The lint-free workaround the older
 *   sims used was to mount an empty canvas, then `Math.random()` inside an
 *   effect — but that produces a visible pop-in on every mount AND means a
 *   student's "same experiment" doesn't actually start from the same state
 *   twice.
 *
 *   mulberry32 fixes both: seed it from a constant, get a reproducible
 *   layout, no hydration mismatch, no pop-in. Seed it from a sim-specific
 *   counter and you get controlled variety.
 *
 * Reference: Tommy Ettinger's public-domain implementation
 * (https://gist.github.com/tommyettinger/46a3c9fcbf0e25d67c5cfec0d7abe2de)
 */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
