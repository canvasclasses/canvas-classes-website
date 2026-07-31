/*
 * mechanics-bench/lib/scene.ts — ground-truth force derivation.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM, no dependencies. Verifiable by a plain node script
 * (`node scripts/verify-mechanics-bench.mjs`).
 *
 * This module answers exactly one question: **given a scene, what forces really
 * act on this body?** Everything downstream — the FBD grader, the cut tool, the
 * ΣF = ma assembler — reads its ground truth from here, so a misconception like
 * "you forgot the normal" is DERIVED from the contact list rather than
 * hardcoded per exercise. That is what makes the engine general.
 *
 * CONVENTION (inherited from vector-lab/lib/vectorMath.ts): physics coordinates
 * — x right, y UP, angles in degrees CCW from +x. SI units. The SVG layer is the
 * only place that flips y.
 *
 * See _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §2 (design law) and §5.1.
 */

import type {
  Body, Contact, Scene, StringLink, TrueForce, Vec2,
} from '../types';
import { WORLD } from '../types';
import { dir, norm360, round } from './linalg';

// ── Small symbol helpers (shared with constraints.ts / dynamics.ts) ──────────

const SUBSCRIPT_DIGITS = '₀₁₂₃₄₅₆₇₈₉';

/** '1' → '₁'. Used for the printed force labels: m₁g, N₂, T₁. */
export function subscript(s: string): string {
  return s.replace(/[0-9]/g, (d) => SUBSCRIPT_DIGITS[Number(d)]);
}

/** The trailing digits of an id, if it has any: 'm1' → '1', 'block' → ''. */
function idIndex(id: string): string {
  const m = /(\d+)$/.exec(id);
  return m ? m[1] : '';
}

/** 'm1' → 'm₁'; 'block' → 'm(block)'. The mass symbol used in force labels. */
export function massSymbol(b: Body): string {
  const n = idIndex(b.id);
  return n ? `m${subscript(n)}` : `m(${b.id})`;
}

/** Plain-text acceleration symbol: 'm1' → 'a₁'; 'block' → 'a(block)'. */
export function accelSymbol(b: Body | string): string {
  // Prefer the AUTHORED LABEL, then the shape, and only then the id.
  //
  // Keying off digits in the id alone (the original behaviour) produced two
  // student-visible defects, both sitting directly beneath a correct equation
  // chip in the Pulley Lab ledger:
  //
  //   • `double-atwood` printed  a₂ − 2a₂ + a₃ = 0  because bodies `m2` and
  //     `p2` both contain a "2" and so collapsed onto one symbol — on the one
  //     rung whose entire lesson is that the movable sheave is a body of its
  //     OWN. The chips read a₂ − 2aₚ + a₃ correctly; only the prose lied.
  //   • `movable-pulley` leaked the raw id as  2a(pm).
  //
  // `pulley/geometry.ts` already had the right idea for the chips; this brings
  // the prose into line so the two can never disagree again.
  if (typeof b !== 'string') {
    // A label like 'm₂' carries the subscript the author intended.
    const labelDigits = (b.label ?? '').replace(/[^₀-₉]/g, '');
    if (labelDigits) return `a${labelDigits}`;
    // A sheave is plain 'aₚ' — distinct from every numbered block, and byte-for
    // byte what `pulley/geometry.ts` puts on the chips. Matching the chips is
    // the requirement: prose and chips disagreeing is the bug, in either
    // direction. KNOWN LIMIT, shared with geometry.ts: two MOVABLE sheaves in
    // one scene would both read 'aₚ'. No current archetype has two (a fixed
    // sheave is not an unknown, so it never appears in a constraint term). If
    // one is ever authored, fix both functions together — they must stay in
    // lockstep or the ledger starts contradicting itself again.
    if (b.shape === 'pulley') return 'aₚ';
  }
  const id = typeof b === 'string' ? b : b.id;
  const n = idIndex(id);
  return n ? `a${subscript(n)}` : `a(${id})`;
}

/**
 * LaTeX acceleration symbol: 'm1' → 'a_{1}'; a sheave → 'a_{p}'.
 *
 * Must stay in lockstep with `accelSymbol` above — the chip and the prose sit
 * inches apart in the Pulley Lab ledger, and the plain form was fixed first,
 * which briefly left the LaTeX rendering `a_{2} - 2a_{2} + a_{3}` under a plain
 * line correctly reading `a₂ − 2aₚ + a₃`. Same precedence: label, then shape,
 * then id.
 */
export function accelLatex(b: Body | string): string {
  if (typeof b !== 'string') {
    const labelDigits = (b.label ?? '').replace(/[^₀-₉]/g, '');
    if (labelDigits) return `a_{${plainDigits(labelDigits)}}`;
    if (b.shape === 'pulley') return 'a_{p}';
  }
  const id = typeof b === 'string' ? b : b.id;
  const n = idIndex(id);
  return n ? `a_{${n}}` : `a_{\\text{${id}}}`;
}

/** '₂' → '2'. LaTeX subscripts take ASCII, not the Unicode subscript block. */
function plainDigits(sub: string): string {
  const SUBS = '₀₁₂₃₄₅₆₇₈₉';
  return [...sub].map((ch) => {
    const i = SUBS.indexOf(ch);
    return i >= 0 ? String(i) : ch;
  }).join('');
}

// ── Lookups ──────────────────────────────────────────────────────────────────

export function bodyById(scene: Scene, id: string): Body | undefined {
  return scene.bodies.find((b) => b.id === id);
}

/** Every contact this body participates in, as bodyA OR as bodyB. */
export function contactsFor(scene: Scene, bodyId: string): Contact[] {
  return scene.contacts.filter((c) => c.bodyA === bodyId || c.bodyB === bodyId);
}

/** Every string whose path runs to, from, or over this body. */
export function stringsTouching(scene: Scene, bodyId: string): StringLink[] {
  return scene.strings.filter((s) => s.path.includes(bodyId));
}

/** True for the reserved non-body agent ids ('world:earth', 'world:ground', …). */
export function isWorldId(id: string): boolean {
  return id.startsWith('world:');
}

// ── Geometry of string paths ─────────────────────────────────────────────────

/**
 * Where a path node sits in world coordinates. Bodies carry their own position;
 * the reserved WORLD.* anchors do not exist as bodies, so they fall back to a
 * direction convention (ceiling above, ground below, wall to the left). An
 * archetype that cares should model the anchor as a `fixed: true` body — that is
 * always exact, and this fallback only keeps a sloppy scene from crashing.
 */
export function nodePos(scene: Scene, id: string): Vec2 {
  const b = bodyById(scene, id);
  if (b) return b.pos;
  if (id === WORLD.ceiling) return { x: 0, y: 10 };
  if (id === WORLD.ground) return { x: 0, y: -10 };
  if (id === WORLD.wall) return { x: -10, y: 0 };
  return { x: 0, y: 10 };
}

function angleBetween(from: Vec2, to: Vec2): number {
  return norm360((Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI);
}

const stepFrom = (c: Vec2, r: number, deg: number): Vec2 => {
  const u = dir(deg);
  return { x: c.x + r * u.x, y: c.y + r * u.y };
};

/** A pulley's radius, or 0 for anything the string does not wrap around. */
function pulleyRadius(scene: Scene, id: string): number {
  const b = bodyById(scene, id);
  return b && b.shape === 'pulley' && b.radius && b.radius > 0 ? b.radius : 0;
}

/**
 * Which way the string wraps this pulley: the sign of (prev−C) × (next−C).
 * 0 when the node is not a wrapping pulley (no radius, or it sits at the end of
 * the path with nothing to wrap between).
 */
function wrapSign(scene: Scene, path: string[], i: number): number {
  if (i <= 0 || i >= path.length - 1) return 0;
  if (pulleyRadius(scene, path[i]) <= 0) return 0;
  const C = nodePos(scene, path[i]);
  const P = nodePos(scene, path[i - 1]);
  const Q = nodePos(scene, path[i + 1]);
  const cross = (P.x - C.x) * (Q.y - C.y) - (P.y - C.y) * (Q.x - C.x);
  return cross === 0 ? 0 : Math.sign(cross);
}

export interface SegmentGeometry {
  /** Where the string physically leaves node i (a tangent point on a pulley). */
  from: Vec2;
  /** Where it arrives at node i+1. */
  to: Vec2;
  /** Direction from → to, degrees CCW from +x. */
  unitDeg: number;
}

/**
 * The true geometry of string segment `i`: a line tangent to whichever of its
 * two endpoints are pulleys.
 *
 * WHY THIS IS NOT JUST "centre to centre". A pulley is not a point — the string
 * leaves it at a tangent, and every constraint coefficient in the engine is the
 * dot product of a body's DOF axis with this segment direction. Model a pulley
 * as a point and the Atwood constraint comes out as 0.93a₁ + 0.93a₂ = 0 instead
 * of a₁ + a₂ = 0, and the 2 in a₁ + a₂ = 2a₃ turns into 1.87. The whole ledger
 * loses its meaning.
 *
 * GEOMETRY. Let ψ be the direction of the line of centres, D its length, θ the
 * direction of the tangent line, and s the wrap sense at the first endpoint.
 * The tangent points are C ± r·n̂ with n̂ ⟂ θ, so requiring the offset endpoints
 * to be collinear with θ gives
 *
 *     D·cos(ψ − θ − s·90°) = q,     θ = ψ − s·(90° − arccos(q/D))
 *
 * where q = r₁ + r₂ when the two pulleys wrap the same way (the tangent passes
 * BETWEEN them — an internal tangent, which is exactly what a movable pulley
 * hanging in a bight produces) and q = r₁ − r₂ when they wrap opposite ways (an
 * external tangent). A non-pulley endpoint is simply a circle of radius 0.
 */
export function segmentGeometry(scene: Scene, path: string[], i: number): SegmentGeometry {
  const CA = nodePos(scene, path[i]);
  const CB = nodePos(scene, path[i + 1]);

  const wA = wrapSign(scene, path, i);
  const wB = wrapSign(scene, path, i + 1);
  const rA = wA !== 0 ? pulleyRadius(scene, path[i]) : 0;
  const rB = wB !== 0 ? pulleyRadius(scene, path[i + 1]) : 0;
  // Wrap sense of each endpoint as seen BY THIS SEGMENT: node i looks forward,
  // node i+1 looks backward, so its sign flips.
  const sA = wA;
  const sB = -wB;

  const dx = CB.x - CA.x;
  const dy = CB.y - CA.y;
  const D = Math.hypot(dx, dy);
  const psi = (Math.atan2(dy, dx) * 180) / Math.PI;

  let theta = psi;
  if (D > 1e-9 && (rA > 0 || rB > 0)) {
    let s = 0;
    let q = 0;
    if (rA > 0 && rB > 0) { s = sA; q = sA === sB ? rA + rB : rA - rB; }
    else if (rA > 0) { s = sA; q = rA; }
    else { s = -sB; q = -rB; }
    const k = (Math.acos(Math.max(-1, Math.min(1, q / D))) * 180) / Math.PI;
    theta = psi - s * (90 - k);
  }

  return {
    from: rA > 0 ? stepFrom(CA, rA, theta + sA * 90) : CA,
    to: rB > 0 ? stepFrom(CB, rB, theta + 180 + sB * 90) : CB,
    unitDeg: norm360(theta),
  };
}

/**
 * Direction of the tension pulling path node `i` toward node `towardIdx`.
 * Exported because dynamics.ts and both renderers need it and must agree to the
 * last degree — a pulley's two tensions are exactly anti-parallel to the
 * segments they belong to, never approximately.
 */
export function segmentDirectionDeg(
  scene: Scene, path: string[], i: number, towardIdx: number,
): number {
  if (towardIdx === i + 1) return segmentGeometry(scene, path, i).unitDeg;
  if (towardIdx === i - 1) return norm360(segmentGeometry(scene, path, i - 1).unitDeg + 180);
  // Non-adjacent nodes are not connected by a single segment; fall back to the
  // straight line between them rather than throwing.
  return angleBetween(nodePos(scene, path[i]), nodePos(scene, path[towardIdx]));
}

// ── Massive sheaves ──────────────────────────────────────────────────────────
//
// "Tension is the same throughout" was never a law. It is what you get when the
// sheave is MASSLESS, because a massless sheave needs no net torque to spin up.
// Give a pulley a moment of inertia and the two sides must differ — the
// difference is precisely what supplies the torque.
//
// Mechanically that means a rope crossing a massive sheave is no longer one
// unknown: it is one unknown PER RUN, where a run is a stretch of rope between
// two massive sheaves (or between a sheave and a rope end). A massless sheave
// does not split anything, so every scene without inertia behaves exactly as
// before — which is the whole reason the split is conditional.

/** A sheave whose rotation has to be solved: it carries inertia AND a radius. */
export function isMassiveSheave(b: Body | undefined): boolean {
  return !!b && (b.inertia ?? 0) > 0 && (b.radius ?? 0) > 0;
}

/** Interior path positions where a rope actually WRAPS a massive sheave. */
export function massiveSheaveIndices(scene: Scene, link: StringLink): number[] {
  const out: number[] = [];
  for (let i = 1; i < link.path.length - 1; i++) {
    if (isMassiveSheave(bodyById(scene, link.path[i]))) out.push(i);
  }
  return out;
}

/** How many times each body is wrapped, as an interior node, by any taut rope. */
export function wrapCounts(scene: Scene): Record<string, number> {
  const out: Record<string, number> = {};
  for (const link of scene.strings) {
    if (link.taut === false) continue;
    for (let i = 1; i < link.path.length - 1; i++) {
      out[link.path[i]] = (out[link.path[i]] ?? 0) + 1;
    }
  }
  return out;
}

/** Which run of the rope segment `segIdx` belongs to (0 before the first sheave). */
export function tensionRunIndex(scene: Scene, link: StringLink, segIdx: number): number {
  let run = 0;
  for (let i = 1; i <= segIdx; i++) {
    if (isMassiveSheave(bodyById(scene, link.path[i]))) run++;
  }
  return run;
}

/**
 * The key the tension in this run is reported under.
 *
 * A rope with no massive sheave keeps its plain string id, byte for byte — so
 * nothing about the massless path moves. Only a rope that genuinely splits gets
 * the `id#run` form.
 */
export function tensionRunId(scene: Scene, link: StringLink, segIdx: number): string {
  if (massiveSheaveIndices(scene, link).length === 0) return link.id;
  return `${link.id}#${tensionRunIndex(scene, link, segIdx)}`;
}

/**
 * tension-force id → the run key that force's magnitude comes from.
 *
 * Deliberately mirrors the tension loop in `trueForcesFor`, so the two cannot
 * drift. `TrueForce.sourceId` stays the STRING id (renderers key off it); this
 * map is how the solver and `solvedForcesFor` find the right run.
 */
export function tensionRunIdByForceId(scene: Scene): Record<string, string> {
  const s = normalizeScene(scene);
  const out: Record<string, string> = {};
  for (const link of s.strings) {
    if (!link.taut) continue;
    link.path.forEach((_node, i) => {
      for (const j of [i - 1, i + 1]) {
        if (j < 0 || j >= link.path.length) continue;
        out[`T_${link.id}_${i}_${j}`] = tensionRunId(s, link, Math.min(i, j));
      }
    });
  }
  return out;
}

// ── Friction mode ────────────────────────────────────────────────────────────

export type FrictionMode = 'none' | 'static' | 'kinetic';

/**
 * Which friction law applies at this contact.
 *
 * `slidingSign` is the sign of A's sliding velocity along the tangent
 * t̂ = normalDeg − 90°. ±1 means the surfaces ARE sliding, so kinetic friction
 * applies and its direction is fixed (opposite the sliding). 0 or undefined
 * means "not sliding / not yet decided": static friction, whose magnitude AND
 * sense only emerge from solving the system — the grader must never mark its
 * direction wrong.
 */
export function frictionMode(c: Contact): FrictionMode {
  const hasMu = (c.mu_s ?? 0) !== 0 || (c.mu_k ?? 0) !== 0;
  if (!hasMu) return 'none';
  return c.slidingSign === 1 || c.slidingSign === -1 ? 'kinetic' : 'static';
}

/** The tangent reference axis of a contact: t̂ = normalDeg − 90°. */
export const tangentDeg = (c: Contact): number => norm360(c.normalDeg - 90);

/**
 * Direction of the KINETIC friction force on bodyA. Friction opposes the
 * relative sliding, so a body sliding along +t̂ (slidingSign = +1) feels the
 * force along −t̂.
 */
export function kineticFrictionDeg(c: Contact): number {
  return norm360(c.slidingSign === 1 ? c.normalDeg + 90 : c.normalDeg - 90);
}

// ── normalizeScene ───────────────────────────────────────────────────────────

/** Pick the more downhill of two opposite directions; ties resolve toward +x. */
function downhillOf(a: number, b: number): number {
  const sa = Math.sin((a * Math.PI) / 180);
  const sb = Math.sin((b * Math.PI) / 180);
  if (Math.abs(sa - sb) < 1e-9) {
    // Level surface — no downhill. Prefer the axis closest to +x so a block on
    // flat ground gets dofDeg = 0 rather than an arbitrary 180.
    const da = Math.abs(Math.cos((a * Math.PI) / 180) - 1);
    const db = Math.abs(Math.cos((b * Math.PI) / 180) - 1);
    return da <= db ? norm360(a) : norm360(b);
  }
  return sa < sb ? norm360(a) : norm360(b);
}

/**
 * Infer the single translational degree of freedom a body is solved along.
 *
 *  1. Resting on a surface → along that surface, pointing DOWN-slope
 *     (a 30° incline whose normal is 120° gives 210°; flat ground gives 0°).
 *  2. Hanging from a string → along the string, pointing away from the anchor
 *     (a mass under a vertical string gives 270°, i.e. down-positive).
 *  3. Only an applied force → along that force.
 *  4. Nothing else to go on → 270° (free fall).
 */
function inferDof(scene: Scene, b: Body): number {
  // Of every surface this body presses on, the one it RESTS on is the one whose
  // normal points most nearly straight up — that is the surface its motion is
  // constrained along. (A block pushed against another block also has a
  // horizontal contact; that one does not define its DOF.)
  const surfaces = scene.contacts.filter((c) => c.bodyA === b.id);
  if (surfaces.length > 0) {
    const onSurface = surfaces.reduce((best, c) =>
      Math.sin((c.normalDeg * Math.PI) / 180) > Math.sin((best.normalDeg * Math.PI) / 180) ? c : best);
    return downhillOf(onSurface.normalDeg - 90, onSurface.normalDeg + 90);
  }

  for (const s of scene.strings) {
    const i = s.path.indexOf(b.id);
    if (i < 0) continue;
    const toward = i > 0 ? i - 1 : i + 1;
    if (toward < 0 || toward >= s.path.length) continue;
    const d = segmentDirectionDeg(scene, s.path, i, toward);
    return downhillOf(d, d + 180);
  }

  const push = scene.applied?.find((a) => a.body === b.id);
  if (push) return norm360(push.angleDeg);

  return 270;
}

/**
 * Fill every default the rest of the engine relies on. Idempotent and pure —
 * every exported function here calls it, so callers never have to.
 */
export function normalizeScene(scene: Scene): Scene {
  const base: Scene = {
    ...scene,
    g: scene.g ?? 9.8,
    frame: scene.frame ?? { kind: 'inertial' },
    strings: scene.strings.map((s) => ({
      ...s,
      taut: s.taut ?? true,
      massless: s.massless ?? true,
    })),
    contacts: [...scene.contacts],
    bodies: [...scene.bodies],
    springs: scene.springs ? [...scene.springs] : undefined,
    applied: scene.applied ? [...scene.applied] : undefined,
  };

  base.bodies = base.bodies.map((b) => ({
    ...b,
    dofDeg: b.fixed ? (b.dofDeg ?? 0) : (b.dofDeg ?? inferDof(base, b)),
  }));

  return base;
}

// ── Ground truth ─────────────────────────────────────────────────────────────

/** Half the body's extent along `angleDeg` — used to place contact arrows. */
function halfExtent(b: Body): number {
  if (b.radius) return b.radius;
  if (b.size) return Math.min(b.size.w, b.size.h) / 2;
  return 0.2;
}

function offsetPoint(b: Body, angleDeg: number): Vec2 {
  const u = dir(angleDeg);
  const r = halfExtent(b);
  return { x: round(u.x * r, 4), y: round(u.y * r, 4) };
}

/**
 * Every force that really acts on `bodyId`, derived from the scene graph.
 *
 * Magnitudes are filled in where they are already known (weight, applied,
 * spring, pseudo); normals, tensions and static friction are left undefined
 * because they only exist once the whole linear system is solved — call
 * `solveScene` and read them off by `sourceId`.
 */
export function trueForcesFor(scene: Scene, bodyId: string): TrueForce[] {
  const s = normalizeScene(scene);
  const body = bodyById(s, bodyId);
  if (!body) return [];
  const g = s.g ?? 9.8;
  const out: TrueForce[] = [];

  // ── Weight. Every massive body, always, straight down, agent = the Earth. ──
  if (body.mass > 0) {
    out.push({
      id: `w_${body.id}`,
      kind: 'weight',
      onBody: body.id,
      fromBody: WORLD.earth,
      angleDeg: 270,
      magSymbol: `${massSymbol(body)}g`,
      magnitude: round(body.mass * g, 6),
      applicationPoint: { x: 0, y: 0 },
      directionKnown: true,
    });
  }

  // ── Contacts. One normal per contact on bodyA, plus the third-law reaction
  //    on bodyB when bodyB is a real body. That reaction is what makes
  //    `third_law_pair_same_body` detectable rather than guessed.
  for (const c of s.contacts) {
    const mode = frictionMode(c);
    const nSym = `N${subscript(idIndex(c.id) || '')}`;

    if (c.bodyA === bodyId) {
      out.push({
        id: `N_${c.id}`,
        kind: 'normal',
        onBody: bodyId,
        fromBody: c.bodyB,
        angleDeg: norm360(c.normalDeg),
        magSymbol: nSym,
        applicationPoint: offsetPoint(body, c.normalDeg + 180),
        directionKnown: true,
        sourceId: c.id,
      });
      if (mode !== 'none') {
        const known = mode === 'kinetic';
        out.push({
          id: `f_${c.id}`,
          kind: 'friction',
          onBody: bodyId,
          fromBody: c.bodyB,
          angleDeg: known ? kineticFrictionDeg(c) : tangentDeg(c),
          magSymbol: known ? 'fₖ' : 'fₛ',
          applicationPoint: offsetPoint(body, c.normalDeg + 180),
          directionKnown: known,
          sourceId: c.id,
        });
      }
    }

    // Newton's third law: the surface is pushed back, on the OTHER body.
    if (c.bodyB === bodyId && !isWorldId(c.bodyA)) {
      out.push({
        id: `N_${c.id}_r`,
        kind: 'normal',
        onBody: bodyId,
        fromBody: c.bodyA,
        angleDeg: norm360(c.normalDeg + 180),
        magSymbol: nSym,
        applicationPoint: offsetPoint(body, c.normalDeg),
        directionKnown: true,
        sourceId: c.id,
      });
      if (mode !== 'none') {
        const known = mode === 'kinetic';
        out.push({
          id: `f_${c.id}_r`,
          kind: 'friction',
          onBody: bodyId,
          fromBody: c.bodyA,
          angleDeg: known ? norm360(kineticFrictionDeg(c) + 180) : norm360(tangentDeg(c) + 180),
          magSymbol: known ? 'fₖ' : 'fₛ',
          applicationPoint: offsetPoint(body, c.normalDeg),
          directionKnown: known,
          sourceId: c.id,
        });
      }
    }
  }

  // ── Tension. A string PULLS, always — toward the next node along its path.
  //    A body sitting mid-path (a pulley) has two neighbours, so it gets two.
  for (const link of s.strings) {
    if (!link.taut) continue;
    link.path.forEach((nodeId, i) => {
      if (nodeId !== bodyId) return;
      const neighbours = [i - 1, i + 1].filter((j) => j >= 0 && j < link.path.length);
      for (const j of neighbours) {
        const angleDeg = segmentDirectionDeg(s, link.path, i, j);
        out.push({
          id: `T_${link.id}_${i}_${j}`,
          kind: 'tension',
          onBody: bodyId,
          // The agent is the node the string runs to. The cut tool needs this
          // to see a tension between two bodies inside the boundary as
          // internal; the UI may present it as "the string" instead.
          fromBody: link.path[j],
          angleDeg,
          magSymbol: `T${subscript(idIndex(link.id) || '')}`,
          applicationPoint: offsetPoint(body, angleDeg),
          directionKnown: true,
          sourceId: link.id,
        });
      }
    });
  }

  // ── Springs. Hooke's law: F = k·x, restoring. Stretched → pulls the two ends
  //    together; compressed → pushes them apart. Direction is known because the
  //    extension follows from the positions already in the scene.
  for (const sp of s.springs ?? []) {
    const mine = sp.from === bodyId ? sp.to : sp.to === bodyId ? sp.from : null;
    if (!mine) continue;
    const here = nodePos(s, bodyId);
    const there = nodePos(s, mine);
    const len = Math.hypot(there.x - here.x, there.y - here.y);
    const ext = len - sp.naturalLength;
    const towardOther = angleBetween(here, there);
    out.push({
      id: `S_${sp.id}_${bodyId}`,
      kind: 'spring',
      onBody: bodyId,
      // Same convention as tension: the agent is the node at the other end, so
      // the cut tool sees a spring between two bodies inside the boundary as
      // internal. The spring itself is named by `sourceId`.
      fromBody: mine,
      angleDeg: ext >= 0 ? towardOther : norm360(towardOther + 180),
      magSymbol: 'kx',
      magnitude: round(Math.abs(sp.k * ext), 6),
      applicationPoint: offsetPoint(body, towardOther),
      directionKnown: true,
      sourceId: sp.id,
    });
  }

  // ── Applied forces pass straight through, keeping their named agent. ───────
  for (const a of s.applied ?? []) {
    if (a.body !== bodyId) continue;
    out.push({
      id: `A_${a.id}`,
      kind: 'applied',
      onBody: bodyId,
      fromBody: a.from,
      angleDeg: norm360(a.angleDeg),
      magSymbol: a.label ?? 'F',
      magnitude: round(a.mag, 6),
      applicationPoint: offsetPoint(body, a.angleDeg + 180),
      directionKnown: true,
      sourceId: a.id,
    });
  }

  // ── Pseudo-force. Exists ONLY in a non-inertial frame. In an inertial frame
  //    a student-drawn one is the misconception `pseudo_in_inertial_frame`;
  //    here it is simply absent, which is what makes that detectable.
  const frame = s.frame ?? { kind: 'inertial' as const };
  if (body.mass > 0 && frame.kind === 'accelerating') {
    // F_pseudo = −m·a_frame (the frame accelerates, so everything in it feels
    // a uniform force the other way).
    const mag = body.mass * Math.hypot(frame.a.x, frame.a.y);
    if (mag > 0) {
      out.push({
        id: `P_${body.id}`,
        kind: 'pseudo',
        onBody: body.id,
        fromBody: 'frame:non-inertial',
        angleDeg: angleBetween({ x: 0, y: 0 }, { x: -frame.a.x, y: -frame.a.y }),
        magSymbol: `${massSymbol(body)}a₀`,
        magnitude: round(mag, 6),
        applicationPoint: { x: 0, y: 0 },
        directionKnown: true,
      });
    }
  } else if (body.mass > 0 && frame.kind === 'rotating') {
    // Centrifugal: +m ω² r, pointing radially OUTWARD from the rotation centre.
    // (Coriolis needs a velocity, which a static scene does not carry.)
    const rx = body.pos.x - frame.centre.x;
    const ry = body.pos.y - frame.centre.y;
    const r = Math.hypot(rx, ry);
    if (r > 0) {
      out.push({
        id: `P_${body.id}`,
        kind: 'pseudo',
        onBody: body.id,
        fromBody: 'frame:non-inertial',
        angleDeg: angleBetween(frame.centre, body.pos),
        magSymbol: `${massSymbol(body)}ω²r`,
        magnitude: round(body.mass * frame.omega * frame.omega * r, 6),
        applicationPoint: { x: 0, y: 0 },
        directionKnown: true,
      });
    }
  }

  return out;
}

/** Ground truth for every body in the scene, keyed by body id. */
export function allTrueForces(scene: Scene): Record<string, TrueForce[]> {
  const s = normalizeScene(scene);
  const out: Record<string, TrueForce[]> = {};
  for (const b of s.bodies) out[b.id] = trueForcesFor(s, b.id);
  return out;
}
