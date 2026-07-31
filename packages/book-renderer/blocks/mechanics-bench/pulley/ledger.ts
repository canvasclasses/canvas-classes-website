'use client';

/*
 * pulley/ledger.ts — the segment ↔ term binding, and virtual displacement.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. This is the heart of Pulley Lab: it decides which rope segment on the
 * canvas belongs to which term in the derived constraint equation, and gives
 * that pairing a single visual identity so the two can be recognised as the
 * same thing.
 *
 * ── Why there is no rainbow ──────────────────────────────────────────────────
 * The design rule is ONE primary accent plus at most one secondary (workflow
 * §3). A colour-per-segment scheme would need six. So a term's identity is
 * carried by STROKE STYLE inside a single accent — weight, opacity and dash
 * pattern — and the ledger renders each term's swatch by drawing a mini-line
 * with byte-identical stroke attributes. It is literally the same ink.
 *
 * The coefficient comes out of this for free, and it is the best thing in the
 * whole component: a term with coefficient 2 has TWO segments bound to it, so
 * its swatch draws two mini-lines. "2aₚ" and the two ropes holding the movable
 * pulley are visibly, countably the same fact. Nobody has to be told.
 */

import type { ConstraintEquation, Scene, SolveResult } from '../types';
import { SystemBuilder } from '../lib/linalg';
import {
  type DrawSegment, accelSymbol, dofWord, movableBodies, segmentsOf, displaceScene,
} from './geometry';

// ── Stroke-style ladder ──────────────────────────────────────────────────────
// Six distinguishable identities in one hue. Ordered so the first two — the
// ones a beginner rung actually uses — are the two most obviously different
// things a line can be: solid and dashed.

export interface SegStyle {
  width: number;
  opacity: number;
  dash?: string;
}

export const SEG_STYLES: SegStyle[] = [
  { width: 3.4, opacity: 1.0 },
  { width: 3.4, opacity: 1.0, dash: '10 6' },
  { width: 3.4, opacity: 0.8, dash: '2 6' },
  { width: 2.0, opacity: 0.95 },
  { width: 2.0, opacity: 0.9, dash: '7 5' },
  { width: 2.0, opacity: 0.75, dash: '1.5 5' },
];

/** Segments that belong to no solved term — a run between two fixed anchors. */
export const GHOST_STYLE: SegStyle = { width: 1.6, opacity: 0.28, dash: '4 5' };

/** Before the ledger is revealed, everything is drawn as one anonymous rope.
 *  Nothing on screen has an identity it has not been given a reason for. */
export const NEUTRAL_STYLE: SegStyle = { width: 2.6, opacity: 0.55 };

export const styleAt = (i: number): SegStyle => SEG_STYLES[i % SEG_STYLES.length];

/**
 * How a coefficient is shown. A term of magnitude 1 prints nothing (that is
 * what "a₁" means), and anything within 0.01 of a whole number prints as that
 * whole number.
 *
 * The snap is not cosmetic sugar over a wrong answer. Segment directions are
 * computed from real tangent geometry, so a block and tackle whose sheaves are
 * 3 cm across returns 3.99947 rather than 4 — a 0.013% artefact of drawing the
 * blocks at a finite size, sitting well inside the inextensible-massless-rope
 * idealisation the whole model already assumes. A genuinely non-integer
 * coefficient (a rope at 40° to a body's axis) is far outside the tolerance and
 * prints its real value.
 */
export function coeffLabel(coeff: number): string {
  const a = Math.abs(coeff);
  const whole = Math.round(a);
  const v = Math.abs(a - whole) < 0.01 ? whole : Math.round(a * 100) / 100;
  return v === 1 ? '' : String(v);
}

// ── The model the canvas and the ledger panel share ──────────────────────────

export interface TermGroup {
  /** `${constraintId}:${bodyId}` */
  key: string;
  constraintId: string;
  bodyId: string;
  /** The coefficient the DERIVER produced. Never computed here. */
  coeff: number;
  /** How many rope segments produced this term — the number of mini-lines the
   *  swatch draws. Taken from the deriver's own per-segment contribution list,
   *  so it is a count of real segments, not a reading of the coefficient. */
  segCount: number;
  /** 'a₁', 'aₚ' */
  symbol: string;
  /** 'm₁', 'P' */
  bodyLabel: string;
  style: SegStyle;
  /** Drawn-segment ids bound to this term. Its length is the visual proof of
   *  the coefficient — and when the two disagree, that is a real engine bug we
   *  want visible, so it is surfaced rather than reconciled. */
  segmentIds: string[];
}

export interface SegmentDraw {
  seg: DrawSegment;
  style: SegStyle;
  /** null for a segment no term claimed. */
  groupKey: string | null;
  /** Perpendicular offset in px, so overlapping runs stay countable. */
  laneOffset: number;
}

export interface LedgerModel {
  groups: TermGroup[];
  draws: SegmentDraw[];
  /** Terms the deriver produced whose coefficient does not match the number of
   *  segments we could bind. Shown as a warning, never hidden. */
  mismatches: string[];
}

/**
 * Bind every constraint term to the rope segments that produced it.
 *
 * Preference order:
 *   1. `ConstraintEquation.segments` — the deriver told us which string each
 *      term came from. Narrow to that string, then to segments touching the
 *      body. This is the intended path.
 *   2. Adjacency only — any segment with this body as an endpoint. Used when a
 *      deriver omits the optional `segments` field, so the ledger degrades to
 *      "still correct, slightly less specific" instead of going blank.
 */
export function buildLedger(
  scene: Scene,
  constraints: ConstraintEquation[],
  segments: DrawSegment[],
): LedgerModel {
  const movable = movableBodies(scene);
  const indexOf = new Map(movable.map((b, i) => [b.id, i]));

  const groups: TermGroup[] = [];
  const mismatches: string[] = [];
  const claims = new Map<string, string[]>();   // segment id → group keys, in order

  let styleIndex = 0;

  for (const c of constraints) {
    for (const term of c.terms) {
      if (term.coeff === 0) continue;
      const body = scene.bodies.find((b) => b.id === term.bodyId);
      if (!body) continue;

      const hinted = c.segments?.filter((s) => s.bodyId === term.bodyId) ?? [];
      const allowedStrings = hinted.length ? new Set(hinted.map((s) => s.stringId)) : null;

      const bound = segments.filter((s) =>
        (s.fromNode === term.bodyId || s.toNode === term.bodyId) &&
        (!allowedStrings || allowedStrings.has(s.stringId)));

      const key = `${c.id}:${term.bodyId}`;
      const segCount = hinted.length || Math.max(1, Math.round(Math.abs(term.coeff)));
      const group: TermGroup = {
        key,
        constraintId: c.id,
        bodyId: term.bodyId,
        coeff: term.coeff,
        segCount,
        symbol: accelSymbol(body, indexOf.get(body.id) ?? 0),
        bodyLabel: body.label ?? body.id,
        style: styleAt(styleIndex++),
        segmentIds: bound.map((s) => s.id),
      };
      groups.push(group);

      // Only worth surfacing when the picture and the equation genuinely
      // disagree — i.e. we could not find on the canvas the segments the
      // deriver says it walked. That would be an engine or authoring bug.
      if (bound.length !== segCount) {
        mismatches.push(
          `${group.symbol}: the derivation walked ${segCount} rope segment`
          + `${segCount === 1 ? '' : 's'} at ${body.label ?? body.id}, but `
          + `${bound.length} could be matched on the diagram.`,
        );
      }
      for (const s of bound) {
        const list = claims.get(s.id) ?? [];
        list.push(key);
        claims.set(s.id, list);
      }
    }
  }

  const byKey = new Map(groups.map((g) => [g.key, g]));
  const draws: SegmentDraw[] = [];
  for (const seg of segments) {
    const keys = claims.get(seg.id) ?? [];
    if (keys.length === 0) {
      draws.push({ seg, style: GHOST_STYLE, groupKey: null, laneOffset: seg.lane * 5 });
      continue;
    }
    // A segment claimed by two terms (a rope running between two bodies that
    // both move) is drawn twice, offset — both terms are true of it.
    keys.forEach((k, i) => {
      const g = byKey.get(k);
      if (!g) return;
      draws.push({
        seg,
        style: g.style,
        groupKey: k,
        laneOffset: seg.lane * 5 + i * 3.5,
      });
    });
  }

  return { groups, draws, mismatches };
}

// ── Mechanical advantage: what the coefficient actually BUYS you ─────────────
//
// Everything below is a READ. Not one number here is computed from a formula
// about pulleys — the segment count comes off the deriver's own term, the
// tension and the acceleration come off `solveScene`, and the weight is m·g
// with the scene's own g. `scripts/verify-mechanics-bench.mjs` must still print
// 134/134 after this file changes, and it will, because no physics moved.
//
// WHY IT IS HERE. Rung 0 (`fixed-pulley`) cannot produce a predict-then-reveal
// verdict: the ladder's verdict compares this rung's acceleration against the
// PREVIOUS rung's, and rung 0 has no previous rung. So the rung whose entire
// job is to break "a pulley multiplies force" had no feedback surface at all.
// The one it needs is this: how many lengths of rope are actually holding the
// load, what that does to the force, and what it costs in distance. On a fixed
// sheave the answer is one, one and nothing — which IS the misconception,
// answered with a measurement instead of a sentence.

export interface ForceFacts {
  bodyId: string;
  bodyLabel: string;
  /** 'a₁', 'aₚ' — the same symbol the ledger prints. */
  symbol: string;
  /** The term's stroke identity, so the swatch here is the same ink as the
   *  rope on the canvas and the term in the equation. */
  style: SegStyle;
  /**
   * How many rope lengths hold this body — the deriver's coefficient, rounded.
   * For an ideal machine this IS the mechanical advantage, and it is also
   * exactly the distance ratio, which is why one number can carry both halves
   * of the force-against-distance trade.
   */
  n: number;
  /**
   * m·g in newtons, or null when the body is massless or resting on a surface.
   * On a table or an incline "its weight" is not what the rope is holding (the
   * normal force takes a share), so quoting it beside a tension would invite
   * exactly the comparison that does not hold.
   */
  weight: number | null;
  /**
   * The rope's tension from the solve, or null when the rope at this body is
   * split into runs of DIFFERENT tension. That null is not a gap — a massive
   * sheave genuinely has no single "the" tension, and saying so is that rung's
   * whole lesson. The tension gate and the ledger's τ = Iα rows handle it.
   */
  tension: number | null;
  /** Signed acceleration along the body's own axis, from the solve. */
  accel: number | null;
  /** A sheave that is NOT bolted down — the double-Atwood point. */
  movableSheave: boolean;
}

/**
 * Which term the advantage is read at: the body with the LARGEST coefficient,
 * because that is the body the machine is doing something for. Ties go to
 * `prefer` (the archetype's `defaultBody`), then to the first term.
 *
 * The tie-break matters more than it looks. On a fixed pulley, an Atwood, a
 * table, an incline, a massive sheave and a lift every coefficient is ±1, so
 * `prefer` decides and the panel talks about the body the rung's narration
 * already talks about. On the movable pulley and the tackle the largest
 * coefficient IS `defaultBody`, so the two agree. On the double Atwood they
 * disagree, and the largest coefficient wins — it picks the hanging sheave P
 * over m₁, which is the body whose non-zero acceleration is the entire content
 * of `movable_pulley_is_a_ceiling`.
 */
export function pickFocusTerm(groups: TermGroup[], prefer?: string): TermGroup | null {
  if (groups.length === 0) return null;
  let best = groups[0];
  for (const g of groups) {
    const a = Math.abs(g.coeff);
    const b = Math.abs(best.coeff);
    if (a > b + 1e-6) { best = g; continue; }
    if (Math.abs(a - b) <= 1e-6 && prefer && g.bodyId === prefer && best.bodyId !== prefer) {
      best = g;
    }
  }
  return best;
}

/**
 * Tension keys for the ropes touching `bodyId`, with a bare string id dropped
 * when that same string also reports per-run keys. Same filter as
 * `Readouts.tsx` applies, for the same reason: `s1` and `s1#0` are the same
 * newtons twice, and counting both would report a massless rope as split.
 */
function tensionKeysAt(scene: Scene, solve: SolveResult, bodyId: string): string[] {
  const ropes = (scene.strings ?? []).filter((s) => s.path.includes(bodyId));
  const keys = Object.keys(solve.tensions).filter((k) =>
    ropes.some((s) => k === s.id || k.startsWith(`${s.id}#`)));
  return keys.filter((k) => !ropes.some((s) =>
    k === s.id && keys.some((o) => o.startsWith(`${s.id}#`))));
}

export function buildForceFacts(
  scene: Scene,
  groups: TermGroup[],
  solve: SolveResult | null,
  prefer?: string,
): ForceFacts | null {
  const g = pickFocusTerm(groups, prefer);
  if (!g) return null;
  const body = scene.bodies.find((b) => b.id === g.bodyId);
  if (!body) return null;

  const onSurface = (scene.contacts ?? []).some(
    (c) => c.bodyA === body.id || c.bodyB === body.id);
  const hangs = dofWord(body.dofDeg) === 'downward';

  let tension: number | null = null;
  let accel: number | null = null;
  if (solve && !solve.singular) {
    const runs = tensionKeysAt(scene, solve, body.id);
    tension = runs.length === 1 ? Math.abs(solve.tensions[runs[0]] ?? 0) : null;
    const a = solve.accelerations[body.id];
    accel = typeof a === 'number' && Number.isFinite(a) ? a : null;
  }

  return {
    bodyId: body.id,
    bodyLabel: body.label ?? body.id,
    symbol: g.symbol,
    style: g.style,
    n: Math.max(1, Math.round(Math.abs(g.coeff))),
    // `?? 9.8` is the same default `lib/scene.ts` normalises to and
    // `trueForcesFor` computes weight with, so this number is the one the solve
    // used — not a second opinion about gravity.
    weight: body.mass > 0 && hangs && !onSurface ? body.mass * (scene.g ?? 9.8) : null,
    tension,
    accel,
    movableSheave: body.shape === 'pulley' && !body.fixed,
  };
}

/**
 * Which of the three "how many lengths hold it?" options is the true one.
 * Shared by the gate in `PulleyLab` and by `verify-pulley-wiring.mjs`, so the
 * verifier is checking the answer the student is actually graded against rather
 * than a second copy of the rule that could drift away from it.
 */
export function holdingCountOptionIndex(n: number): number {
  return n <= 1 ? 0 : n === 2 ? 1 : 2;
}

/**
 * Did the engine solve this rope into runs of genuinely different tension?
 *
 * Read off `SolveResult`, never predicted from the pulley's mass: `lib/dynamics`
 * only splits a rope when a sheave has BOTH inertia and radius, and the split is
 * what the τ = Iα row is about. A rung set to M = 0 answers "equal" here, and
 * that is the correct answer to give the student — the massless case is the
 * assumption being named, not an absence of content.
 */
export function tensionsSplit(solve: SolveResult | null): boolean {
  if (!solve || solve.singular) return false;
  if (!solve.constraints.some((c) => c.id.startsWith('torque_'))) return false;
  const byRope = new Map<string, number[]>();
  for (const [key, value] of Object.entries(solve.tensions)) {
    const hash = key.indexOf('#');
    if (hash < 0) continue;
    const id = key.slice(0, hash);
    const list = byRope.get(id) ?? [];
    list.push(Math.abs(value));
    byRope.set(id, list);
  }
  for (const values of byRope.values()) {
    if (values.length > 1 && Math.max(...values) - Math.min(...values) > 1e-3) return true;
  }
  return false;
}

// ── Virtual displacement (the drag) ──────────────────────────────────────────

export interface DisplacementResult {
  deltas: Record<string, number>;
  /** false when nothing but the dragged body could be placed. */
  determinate: boolean;
  /** Bodies deliberately held still because the ropes did not pin them down.
   *  Named in the UI — silently freezing a body would be a lie about the
   *  system's freedom. */
  held: string[];
  reason?: string;
}

/**
 * Drag one body by `delta` metres along its own axis and work out where every
 * other body has to go.
 *
 * The constraint rows are linear in acceleration, and length-invariance is the
 * same linear statement about DISPLACEMENT — so the same coefficients solve
 * both. The right-hand side is taken as zero here: a non-zero rhs comes from a
 * driven support, and the student is not dragging the lift shaft.
 *
 * A system with more freedoms than ropes (double Atwood has four bodies and two
 * ropes) has no unique answer, which is not a bug — it genuinely has two spare
 * degrees of freedom. Rather than refusing to move, we hold the bodies FURTHEST
 * from the one being dragged and solve for the nearest ones, then say which we
 * held. That keeps the demonstration alive and keeps it honest.
 */
export function solveDisplacement(
  scene: Scene,
  constraints: ConstraintEquation[],
  drivenId: string,
  delta: number,
): DisplacementResult {
  const movable = movableBodies(scene).map((b) => b.id);
  const others = movable.filter((id) => id !== drivenId);
  const deltas: Record<string, number> = { [drivenId]: delta };
  for (const id of others) deltas[id] = 0;

  if (others.length === 0) return { deltas, determinate: true, held: [] };

  const usable = constraints.filter((c) =>
    c.terms.some((t) => others.includes(t.bodyId) && t.coeff !== 0));
  if (usable.length === 0) {
    return {
      deltas, determinate: false, held: others,
      reason: 'No rope ties the other bodies to this one, so only it moved.',
    };
  }

  // Breadth-first from the dragged body across shared ropes, so when we do have
  // to choose, we free the bodies the rope reaches first.
  const order: string[] = [];
  const seenBody = new Set<string>([drivenId]);
  let frontier = [drivenId];
  const remaining = [...usable];
  while (frontier.length && remaining.length) {
    const next: string[] = [];
    for (let i = remaining.length - 1; i >= 0; i--) {
      const c = remaining[i];
      if (!c.terms.some((t) => frontier.includes(t.bodyId))) continue;
      remaining.splice(i, 1);
      for (const t of c.terms) {
        if (t.coeff === 0 || seenBody.has(t.bodyId) || !others.includes(t.bodyId)) continue;
        seenBody.add(t.bodyId);
        order.push(t.bodyId);
        next.push(t.bodyId);
      }
    }
    frontier = next;
  }
  for (const id of others) if (!seenBody.has(id)) order.push(id);

  // Match ONE free body to each rope, rope by rope. Picking bodies without
  // reference to which rope needs them produces rows with no variable in them —
  // a contradictory system that solves to "nothing moved", which is how the
  // double-Atwood drag silently died the first time this was written.
  const free: string[] = [];
  const rows: ConstraintEquation[] = [];
  const taken = new Set<string>();
  const unmatched: string[] = [];
  for (const c of usable) {
    const pick = order.find((id) =>
      !taken.has(id) && c.terms.some((t) => t.bodyId === id && t.coeff !== 0));
    if (!pick) { unmatched.push(c.id); continue; }
    taken.add(pick);
    free.push(pick);
    rows.push(c);
  }
  const held = others.filter((id) => !free.includes(id));

  if (free.length === 0) {
    return {
      deltas, determinate: false, held: others,
      reason: 'Nothing else on this rope is free to move, so only the body you dragged did.',
    };
  }

  const sb = new SystemBuilder();
  for (const id of free) sb.unknown(`d_${id}`);
  for (const c of rows) {
    const coeffs: Record<string, number> = {};
    let rhs = 0;
    for (const t of c.terms) {
      if (t.bodyId === drivenId) rhs -= t.coeff * delta;
      else if (free.includes(t.bodyId)) {
        coeffs[`d_${t.bodyId}`] = (coeffs[`d_${t.bodyId}`] ?? 0) + t.coeff;
      }
      // A held body contributes nothing: its displacement is pinned to zero.
    }
    sb.equation(coeffs, rhs, c.id);
  }

  const sol = sb.solve();
  if (sol.singular) {
    return { deltas, determinate: false, held: others, reason: sol.reason };
  }
  for (const id of free) deltas[id] = sol.values[`d_${id}`] ?? 0;

  const notes: string[] = [];
  if (held.length) {
    notes.push(
      `This system is free in more than one way, so ${held.join(', ')} `
      + `${held.length === 1 ? 'is' : 'are'} held still while you drag. `
      + `Drag ${held.length === 1 ? 'it' : 'one of them'} instead to see the other freedom.`,
    );
  }
  if (unmatched.length) {
    notes.push(`Rope ${unmatched.join(', ')} could not be kept at constant length by this drag.`);
  }

  return { deltas, determinate: true, held, reason: notes.join(' ') || undefined };
}

/**
 * Per-segment length change for a set of displacements, measured — not
 * predicted — by re-walking the rope over the moved bodies.
 */
export interface SegmentDelta {
  id: string;
  before: number;
  after: number;
  change: number;
}

export function measureSegments(
  scene: Scene,
  deltas: Record<string, number>,
): { rows: SegmentDelta[]; totals: Record<string, number> } {
  const before = segmentsOf(scene);
  const after = segmentsOf(displaceScene(scene, deltas));
  const rows: SegmentDelta[] = before.map((b, i) => ({
    id: b.id,
    before: b.length,
    after: after[i]?.length ?? b.length,
    change: (after[i]?.length ?? b.length) - b.length,
  }));
  const totals: Record<string, number> = {};
  for (let i = 0; i < before.length; i++) {
    const sid = before[i].stringId;
    totals[sid] = (totals[sid] ?? 0) + rows[i].change;
  }
  return { rows, totals };
}
