/*
 * optics-bench/lib/index.ts — the engine's public surface.
 * ─────────────────────────────────────────────────────────────────────────────
 * Everything under `lib/` is PURE: no React, no DOM, no browser globals. That
 * is not tidiness — it is what lets `scripts/verify-optics-bench.mjs` run the
 * whole engine in plain node and assert every physics claim against a
 * hand-computed value before any of it reaches a student.
 *
 * Import from here, not from the individual files, so a future re-split does
 * not touch the renderers.
 */

export * from './vec';
export * from './convention';
export * from './formula';
export * from './spectral';
export * from './surfaces';
export * from './image';
export * from './trace';
export * from './instruments';
export * from './wave';
