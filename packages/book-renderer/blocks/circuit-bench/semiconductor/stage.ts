/*
 * semiconductor/stage.ts — how tall a stage should be at a measured width.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM — so the verifier can measure canvas fill at the exact
 * sizes the components use.
 *
 * ⚠ A FIXED HEIGHT LETTERBOXES. A stage with a hardcoded height shrinks its
 * drawing to fit the container's width while keeping its own full height, leaving
 * a small diagram in a tall empty frame — measured at 8.8% of a phone canvas on
 * Projectile Playground before the rebuild. Deriving the height from the MEASURED
 * container width removes the dead bands.
 *
 * ⚠ AND AN UNMEASURED WIDTH IS NARROW, NOT DESKTOP. `useStageWidth` reports 0
 * until the first ResizeObserver callback. `min` is returned for that case, which
 * is correct at every width (merely roomier than needed on a desktop), whereas
 * assuming desktop ships one frame of a broken layout onto a phone.
 */

export function stageHeightFor(
  containerWidth: number, aspect = 0.55, max = 380, min = 220,
): number {
  if (containerWidth <= 0) return min;
  return Math.max(min, Math.min(max, Math.round(containerWidth * aspect)));
}
