/*
 * motion-lab/waves/lib/scenes.ts — world-space extents of the SHM rigs.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * These two boxes decide the camera, so they decide how much of its own canvas
 * the drawing fills — and "the diagram is a stamp swimming in whitespace" is a
 * defect tsc, eslint and the physics verifier are all blind to. The Phase-1
 * browser sweep measured an FBD board drawing into 7.7% of its area.
 *
 * Keeping them here, pure, means `scripts/verify-motion-phase2.mjs` can run
 * `fitView` over them at a desktop board AND a phone board and FAIL the build if
 * the fill leaves the 60–75% linear target — the same discipline
 * `verify-fbd-fill.mjs` applies to the mechanics boards.
 */

export interface SceneBox {
  minX: number; maxX: number; minY: number; maxY: number;
  /** Height of the reference circle's centre, when it is on. */
  circleY?: number;
}

/**
 * The spring rig: a wall, a spring, a block sliding on a track through the
 * origin, and (optionally) the circle of reference floating above it.
 *
 * The margins are fractions of the amplitude rather than fixed metres, because
 * A spans 0.02 m to 0.6 m across the slider and a fixed margin would frame a
 * 2 cm oscillation inside a metre of empty air.
 */
export function springScene(A: number, withCircle: boolean): SceneBox {
  const wall = -(A * 1.85 + 0.06);
  const circleY = A + A * 0.55 + 0.12;
  return {
    minX: wall - 0.02,
    maxX: A + A * 0.4 + 0.05,
    minY: -(A * 0.6 + 0.06),
    maxY: withCircle ? circleY + A + 0.04 : A * 0.55 + 0.06,
    circleY: withCircle ? circleY : undefined,
  };
}

/** The pendulum rig: pivot at the origin, bob swinging on a rod of length L. */
export function pendulumScene(L: number): SceneBox {
  return { minX: -L * 1.12, maxX: L * 1.12, minY: -L * 1.2, maxY: L * 0.22 };
}

/** Content width ÷ content height — what the canvas box takes as its shape. */
export const aspectOf = (s: SceneBox): number =>
  (s.maxX - s.minX) / Math.max(s.maxY - s.minY, 1e-6);
