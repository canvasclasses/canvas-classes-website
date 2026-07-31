/*
 * fbd/forces.ts — presentation helpers for ground-truth forces.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No physics is computed here — `lib/scene` derives which forces exist and
 * `lib/dynamics` solves for their magnitudes. This file only decides how a force
 * is NAMED and NUMBERED for the legend, and it enforces one rule that matters
 * pedagogically more than it looks:
 *
 *   A magnitude is never shown before the student has been shown where it comes
 *   from. Until the FBD is graded correct (or the author sets `show.values`),
 *   every row shows the SYMBOL — `mg`, `N`, `T`, `f` — and nothing else.
 */

import type {
  Scene, TrueForce, SolveResult, StudentForce, ForceKind, Vec2, Body,
} from '../types';
import { findBody } from './sceneEdit';

export const fmtN = (n: number): string =>
  Math.abs(n) >= 100 ? n.toFixed(0) : Math.abs(n) >= 10 ? n.toFixed(1) : n.toFixed(2);

/**
 * Fill in each force's magnitude from a solved scene.
 *
 * Weight and a named applied force are known without solving; normals,
 * frictions and tensions come from the solver, keyed by the `sourceId` the
 * engine stamped on the force when it derived it from a contact/string.
 */
export function fillMagnitudes(
  scene: Scene, forces: TrueForce[], solve: SolveResult | null
): TrueForce[] {
  const g = scene.g ?? 9.8;
  return forces.map((f) => {
    if (f.magnitude !== undefined) return f;
    let mag: number | undefined;
    switch (f.kind) {
      case 'weight': {
        const b = findBody(scene, f.onBody);
        mag = b ? b.mass * g : undefined;
        break;
      }
      case 'applied': {
        const a = (scene.applied ?? []).find((x) => x.id === f.sourceId || x.body === f.onBody);
        mag = a?.mag;
        break;
      }
      case 'normal':
        mag = f.sourceId && solve ? Math.abs(solve.normals[f.sourceId]) : undefined;
        break;
      case 'friction':
        mag = f.sourceId && solve ? Math.abs(solve.frictions[f.sourceId]) : undefined;
        break;
      case 'tension':
        mag = f.sourceId && solve ? Math.abs(solve.tensions[f.sourceId]) : undefined;
        break;
      case 'pseudo': {
        const b = findBody(scene, f.onBody);
        const fr = scene.frame;
        if (b && fr && fr.kind === 'accelerating') mag = b.mass * Math.hypot(fr.a.x, fr.a.y);
        break;
      }
      default: break;
    }
    return mag === undefined || !Number.isFinite(mag) ? f : { ...f, magnitude: mag };
  });
}

/** Resolve a force onto a pair of perpendicular axes rotated by `axisDeg`. */
export function resolveOnAxes(
  angleDeg: number, magnitude: number, axisDeg: number
): { along: number; perp: number } {
  const d = (angleDeg - axisDeg) * (Math.PI / 180);
  return { along: magnitude * Math.cos(d), perp: magnitude * Math.sin(d) };
}

/** Whether a force has to be SPLIT on these axes (i.e. costs extra algebra). */
export const needsSplitting = (angleDeg: number, axisDeg: number): boolean => {
  const d = Math.abs((((angleDeg - axisDeg) % 90) + 90) % 90);
  return Math.min(d, 90 - d) > 1.5;
};

// ── The student's drawing ────────────────────────────────────────────────────
// These live here rather than in DrawStage.tsx so a plain node script can build
// a drawing, hand it to `lib/grade`, and assert which misconception fires —
// PHYSICS_SIMULATION_PROGRAM.md §9's "verifiable outside React" applied to the
// grader's REACHABILITY, not just to the physics. Node strips TS types natively
// but does not transform JSX, so anything a verifier needs has to be in a .ts.

export interface DrawnForce {
  id: string;
  kind: ForceKind | 'unknown';
  /** Degrees CCW from +x, in WORLD orientation. */
  angleDeg: number;
  /** Newtons. Derived from the drawn length via the body's own weight scale. */
  magnitude: number;
  /**
   * The attachment point, as a metre offset from the centre of mass in the
   * WORLD frame — the same convention `lib/scene` uses for `TrueForce
   * .applicationPoint`, so a drawn arrow and a ground-truth arrow can be
   * compared without either side guessing whose rotation applies.
   */
  anchor: Vec2;
  /** Whatever the student named. '' means they said "nothing applies it". */
  claimedFrom?: string;
  /**
   * FALSE until the student has aimed it.
   *
   * This flag exists because the sim was grading its OWN defaults as if they
   * were the student's beliefs. `place('normal')` drops an arrow at 90° with
   * magnitude mg; on any incline, tapping Normal and pressing Check produced
   * BOTH `normal_not_perpendicular` and `normal_equals_mg_on_incline` from a
   * student who had expressed no opinion whatsoever — they simply had not
   * dragged yet. A misconception panel is an accusation, and accusing someone
   * of a belief the software chose for them is worse than saying nothing.
   *
   * So a freshly placed arrow is a STUB: it is on the body, it is named, and it
   * has no direction or size until the student gives it one. Nothing is graded
   * until every arrow has been aimed.
   */
  aimed?: boolean;
}

/** How far off "straight outward from the spin axis" still counts as the
 *  centrifugal answer. 60° is generous on purpose — the misconception is about
 *  the DIRECTION being away from the centre, not about drawing it neatly. */
const OUTWARD_TOL = Math.cos(60 * (Math.PI / 180));

/**
 * The label a drawn arrow deserves, or undefined.
 *
 * `grade.ts` distinguishes a generic pseudo-force-in-the-wrong-frame from THE
 * centrifugal misconception by regex-matching `StudentForce.label` — and
 * nothing ever set that field, so `ghost_centrifugal` (the named misconception
 * that the entire `rotating-drum` rung is built around) could not fire in any
 * configuration. This is what populates it.
 *
 * A pseudo-force arrow pointing away from the spin axis IS the student saying
 * "something is throwing me outward". That is the belief the code names, so
 * that is exactly when the label is attached — never from a default, since an
 * unaimed arrow has no direction to judge.
 */
export function centrifugalLabel(
  f: DrawnForce, bodyPos: Vec2, spinCentre: Vec2 | null
): string | undefined {
  if (f.kind !== 'pseudo' || !spinCentre || f.aimed === false) return undefined;
  const rx = bodyPos.x - spinCentre.x;
  const ry = bodyPos.y - spinCentre.y;
  const r = Math.hypot(rx, ry);
  if (r < 1e-6) return undefined;
  const rad = f.angleDeg * (Math.PI / 180);
  const outward = (Math.cos(rad) * rx + Math.sin(rad) * ry) / r;
  return outward > OUTWARD_TOL ? 'centrifugal — outward' : undefined;
}

/**
 * Convert the drawing into the engine's grading input.
 *
 * `includeMagnitudes` is the whole reason this takes a flag: `gradeFbd` only
 * checks a length when the student force HAS one, so omitting it is how the
 * first pass stays a physics question instead of an arithmetic one.
 *
 * UNAIMED arrows are dropped entirely. They carry no claim, so they must not
 * produce one — see `DrawnForce.aimed`. (The UI keeps the Check button closed
 * while any arrow is unaimed, so in practice nothing is silently discarded.)
 */
export function toStudentForces(
  drawn: DrawnForce[],
  body: Body,
  includeMagnitudes: boolean,
  spinCentre: Vec2 | null = null,
): StudentForce[] {
  return drawn
    .filter((f) => f.aimed !== false)
    .map((f) => ({
      id: f.id,
      kind: f.kind,
      onBody: body.id,
      angleDeg: f.angleDeg,
      magnitude: includeMagnitudes ? f.magnitude : undefined,
      label: centrifugalLabel(f, body.pos, spinCentre),
      claimedFrom: f.claimedFrom === '' ? undefined : f.claimedFrom,
      applicationPoint: f.anchor,
    }));
}
