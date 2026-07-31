/*
 * motion-lab/graphs/lib/evidence.ts — when a misconception card is allowed on screen.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. It lives here rather than inside the component for one
 * reason: `scripts/verify-graphs.mjs` can then prove the two properties that
 * matter, for every archetype, without a browser —
 *
 *   1. NO CARD IS A PREAMBLE. With nothing seen and nothing done, every gate is
 *      false. The Phase-1 audit found two projectile cards on screen at t = 0,
 *      telling a student the answer before they had fired a shot; the file header
 *      that forbade it could not stop it because nothing checked.
 *   2. EVERY CARD IS REACHABLE. With the evidence supplied, every gate is true.
 *      Phase 1 shipped four codes that could not fire at all and twenty-two more
 *      wired to no UI. A declared code that never appears is worse than no code:
 *      it reads as coverage in the archetype table.
 *
 * The gates are per code, never a timer, and each one names the specific thing
 * that has to be on screen first. Where a code has no bespoke gate the default is
 * the conservative one — the student must have played the motion through or
 * edited it.
 */

import type { GraphsTarget } from '../types';

export interface EvidenceCtx {
  /** The cursor has reached the end of the run. */
  finished: boolean;
  /** The student has changed the motion. */
  edited: boolean;
  /** Which panels are drawn. */
  reveal: { x: boolean; v: boolean; a: boolean };
  /** The cursor has been in a stretch where a opposes v — the headline evidence. */
  visitedTrend: boolean;
  /** The cursor has been on a turning point (v = 0, a ≠ 0). */
  visitedTurn: boolean;
  /** Both kinds of "flat" have been visited: at rest, and uniform velocity. */
  visitedFlat: { atRest: boolean; uniform: boolean };
  /** A chord marker has been dragged. */
  movedMarkers: boolean;
  /** Distance and |displacement| have measurably separated. */
  diverges: boolean;
  /** Fraction of the run the cursor has reached, 0…1. */
  fracSeen: number;
}

/** Nothing seen, nothing done. Every gate must return false for this. */
export const NO_EVIDENCE: EvidenceCtx = {
  finished: false,
  edited: false,
  reveal: { x: false, v: false, a: false },
  visitedTrend: false,
  visitedTurn: false,
  visitedFlat: { atRest: false, uniform: false },
  movedMarkers: false,
  diverges: false,
  fracSeen: 0,
};

/** Everything seen, everything done. Every gate must return true for this. */
export const FULL_EVIDENCE: EvidenceCtx = {
  finished: true,
  edited: true,
  reveal: { x: true, v: true, a: true },
  visitedTrend: true,
  visitedTurn: true,
  visitedFlat: { atRest: true, uniform: true },
  movedMarkers: true,
  diverges: true,
  fracSeen: 1,
};

/**
 * Should the misconception card be on screen yet, for this target code?
 */
export function evidenceReady(code: GraphsTarget, x: EvidenceCtx): boolean {
  switch (code) {
    case 'positive_a_means_speeding_up':
    case 'retardation_is_negative_acceleration':
      // The student must have SEEN a stretch where a and v disagree. Saying "a
      // positive a can slow you down" before they have watched it happen is the
      // preamble this whole file exists to prevent.
      return x.visitedTrend && x.reveal.v && x.reveal.a;

    case 'flat_xt_means_constant_velocity':
      // Both kinds of flat, or the contrast that IS the lesson has not been made.
      return x.reveal.x && x.reveal.v && x.visitedFlat.atRest && x.visitedFlat.uniform;

    case 'at_rest_means_zero_acceleration':
      return x.visitedTurn && x.reveal.v && x.reveal.a;

    case 'distance_equals_displacement':
      return x.diverges && x.reveal.v && x.fracSeen > 0.35;

    case 'area_under_vt_is_speed':
      return x.reveal.x && x.reveal.v && (x.finished || x.fracSeen > 0.6);

    case 'avg_equals_instantaneous':
    case 'average_v_is_mean_of_endpoints':
      return x.reveal.x && (x.movedMarkers || x.finished);

    case 'xt_curve_is_the_path':
      return x.edited && x.reveal.x;

    case 'steeper_means_higher_up':
      return x.reveal.x && (x.fracSeen > 0.7 || x.edited);

    // The relative-motion codes are gated in `RelativeDeck.tsx` on scene-specific
    // evidence (a heading dragged, a walking speed above zero, two unequal
    // velocities plus a frame switch) because the deck has no cursor and no
    // panels — there is nothing here for those contexts to describe. They still
    // have to satisfy both verifier properties, so they fall through to the
    // conservative default.
    default:
      return x.finished || x.edited;
  }
}
