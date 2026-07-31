/*
 * mechanics-bench/lib/constraints.ts — string-length invariance → equations.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM, no dependencies.
 *
 * THE PEDAGOGICAL CENTREPIECE. Students cannot write constraint equations
 * because textbooks present them as results to memorise — "for a movable pulley,
 * a₁ + a₂ = 2a₃" — with no visible derivation. This module derives them the way
 * they are actually derived, by walking the string:
 *
 *   An inextensible string has constant total length L. Sum over its segments:
 *
 *       L = Σ |r_{i+1} − r_i|                                     (definition)
 *      dL/dt = Σ (v_{i+1} − v_i) · û_i = 0                       (length fixed)
 *     d²L/dt² = Σ (a_{i+1} − a_i) · û_i = 0                      (û_i constant)
 *
 *   where û_i is the unit vector along segment i. Each body contributes its
 *   scalar acceleration along its own DOF axis, projected onto û_i.
 *
 * The last step is the standard idealisation: the segment directions are treated
 * as fixed, which is exact for the vertical/along-slope geometries of every
 * Class 11–12 pulley problem. A swinging segment would add an ω²-type term.
 *
 * The factor of 2 in a₁ + a₂ = 2a₃ is NOT special-cased anywhere: a movable
 * pulley simply appears in two segments, so the walk visits it twice. That is
 * the whole point — the ledger shows the student WHERE the 2 came from.
 *
 * See _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §5.2.
 */

import type { ConstraintEquation, Contact, Scene, StringLink, Vec2 } from '../types';
import { dir, round } from './linalg';
import {
  accelLatex, accelSymbol, bodyById, frictionMode, normalizeScene, segmentGeometry,
  tangentDeg,
} from './scene';

/** Below this a coefficient is numerical dust, not a term. */
const COEFF_EPS = 1e-9;

/**
 * The straight pieces a string is made of, in path order, with the true
 * direction of each measured between the real attachment points (tangent points
 * on a pulley, centres elsewhere).
 */
export function stringSegments(
  scene: Scene,
  s: StringLink,
): { from: string; to: string; unitDeg: number }[] {
  const sc = normalizeScene(scene);
  const out: { from: string; to: string; unitDeg: number }[] = [];
  for (let i = 0; i < s.path.length - 1; i++) {
    out.push({
      from: s.path[i],
      to: s.path[i + 1],
      unitDeg: round(segmentGeometry(sc, s.path, i).unitDeg, 9),
    });
  }
  return out;
}

/** A node's acceleration direction, or null if it cannot accelerate. */
function dofUnit(scene: Scene, nodeId: string): Vec2 | null {
  const b = bodyById(scene, nodeId);
  if (!b || b.fixed) return null;        // world anchors and pinned axles: a = 0
  return dir(b.dofDeg ?? 270);
}

function fmtCoeff(c: number): string {
  // SNAP TO A WHOLE NUMBER within 0.01, mirroring `coeffLabel` in
  // pulley/ledger.ts. The two must agree: the ledger's chips snapped and this
  // prose did not, so `block-and-tackle` printed "3.9999aₚ + a₁ = 0" underneath
  // a chip that correctly read "4aₚ".
  //
  // What is being snapped is a known, bounded artefact and NOT a physics fudge:
  // `deriveConstraints` takes each rope segment along the true common tangent of
  // two real circles, so a tackle's falls are a hair off vertical and the
  // coefficient lands within 0.005% of n (n = 6 gives 5.99987). Rounding a
  // 0.005% geometric artefact is honest; a student reading "3.9999" concludes
  // the engine cannot count, which is worse than the rounding.
  //
  // Anything further than 0.01 from an integer is NOT snapped — it prints as it
  // is, because at that distance it is a real result (or a real bug) and hiding
  // it would be the dishonest kind of rounding.
  const whole = Math.round(c);
  const r = Math.abs(c - whole) < 0.01 ? whole : round(c, 4);
  if (Math.abs(r - 1) < 1e-9) return '';
  if (Math.abs(r + 1) < 1e-9) return '-';
  return `${r}`;
}

/**
 * A symbol resolver bound to a scene.
 *
 * `accelSymbol` needs the BODY, not its id: it reads the authored label and the
 * shape to tell a numbered block from a sheave. Handing it a bare id silently
 * fell through to the id-digit path, which is how `double-atwood` came to print
 * "a₂ − 2a₂ + a₃" — `m2` and `p2` both contain a 2 — and how `movable-pulley`
 * leaked "a(pm)". Always build the resolver from the scene.
 */
const symbolIn = (scene: Scene) => (id: string): string =>
  accelSymbol(bodyById(scene, id) ?? id);

/** The LaTeX twin of `symbolIn`, bound the same way and for the same reason. */
const latexIn = (scene: Scene) => (id: string): string =>
  accelLatex(bodyById(scene, id) ?? id);

/** '+ 2a₃' / '− a₁', with the leading term printed without a '+'. */
function joinTerms(
  terms: { bodyId: string; coeff: number }[],
  sym: (id: string) => string,
): string {
  if (terms.length === 0) return '0';
  return terms
    .map((t, i) => {
      const neg = t.coeff < 0;
      const body = `${fmtCoeff(Math.abs(t.coeff))}${sym(t.bodyId)}`;
      if (i === 0) return neg ? `-${body}` : body;
      return neg ? ` - ${body}` : ` + ${body}`;
    })
    .join('');
}

/**
 * One length-invariance equation per taut string.
 *
 * A slack string constrains nothing (that is what slack MEANS), so it is
 * skipped — which is also why `taut: false` is the vertical-circle moment.
 */
export function deriveStringConstraints(scene: Scene): ConstraintEquation[] {
  const s = normalizeScene(scene);
  const out: ConstraintEquation[] = [];

  for (const link of s.strings) {
    if (!link.taut) continue;

    const segs = stringSegments(s, link);
    // Per-segment contributions, kept unaggregated so the UI can colour-match
    // each string segment to the term it produced. This ledger IS Pulley Lab.
    const contributions: { stringId: string; bodyId: string; coeff: number }[] = [];

    for (const seg of segs) {
      const u = dir(seg.unitDeg);
      // d²L/dt² for this segment = (a_to − a_from) · û.
      const from = dofUnit(s, seg.from);
      const to = dofUnit(s, seg.to);
      if (from) {
        const c = round(-(from.x * u.x + from.y * u.y), 9);
        if (Math.abs(c) > COEFF_EPS) {
          contributions.push({ stringId: link.id, bodyId: seg.from, coeff: c });
        }
      }
      if (to) {
        const c = round(to.x * u.x + to.y * u.y, 9);
        if (Math.abs(c) > COEFF_EPS) {
          contributions.push({ stringId: link.id, bodyId: seg.to, coeff: c });
        }
      }
    }

    // Aggregate into one term per body — a movable pulley visited twice lands
    // here as a single coefficient of 2.
    const byBody = new Map<string, number>();
    for (const c of contributions) {
      byBody.set(c.bodyId, round((byBody.get(c.bodyId) ?? 0) + c.coeff, 9));
    }
    const terms = [...byBody.entries()]
      .filter(([, c]) => Math.abs(c) > COEFF_EPS)
      .map(([bodyId, coeff]) => ({ bodyId, coeff }));

    const plain = `${joinTerms(terms, symbolIn(s))} = 0`;
    const latex = `${joinTerms(terms, latexIn(s))} = 0`;

    const name = link.label ?? link.id;
    const derivation =
      `String "${name}" cannot stretch, so the total of its ${segs.length} `
      + `segment length${segs.length === 1 ? '' : 's'} never changes. Walking the `
      + `string and adding up how fast each segment lengthens gives ${plain} — `
      + `whatever one segment gains, the others must give up.`;

    out.push({
      id: `constraint_${link.id}`,
      terms,
      rhs: 0,
      derivation,
      latex,
      segments: contributions,
    });
  }

  return out;
}

// ── Contact couplings ────────────────────────────────────────────────────────
//
// Strings are not the only thing that ties two accelerations together. A
// CONTACT does it too, in two different ways, and leaving either one out is how
// a solver ends up handing back a confident wrong number:
//
//   · NO-INTERPENETRATION — two bodies pressed face-to-face along their
//     direction of motion cannot pass through each other, so their
//     accelerations along the normal are equal. (Two blocks pushed together.)
//
//   · RIDE-ALONG — a body resting on another is carried by STATIC FRICTION, so
//     as long as that friction has not been beaten it does not slide, and the
//     two share their acceleration ALONG THE SURFACE. (A block on a cart, a
//     crate on a truck bed, one block stacked on another.)
//
// The ride-along one is the invisible middle step of every stacked-body
// problem: students are told "they move together" and never shown that this is
// an ASSUMPTION which friction has to be strong enough to support. It is an
// assumption here too, and `solveScene` tests it against μₛN afterwards.

/** |cos(dof − normal)| above this means the surface pushes ALONG the motion. */
export const NORMAL_ALONG_DOF = 0.05;

export type CouplingKind = 'no-interpenetration' | 'ride-along';

export interface ContactCoupling {
  contactId: string;
  kind: CouplingKind;
  /** null when the coupling carries no information — see `reason`. */
  equation: ConstraintEquation | null;
  reason?: string;
}

/** cos(body's DOF − axis): how much of its acceleration lies along `axis`. */
function dofProjection(scene: Scene, id: string, axisDeg: number): number | null {
  const b = bodyById(scene, id);
  if (!b || b.fixed) return null;    // pinned to the world: a ≡ 0, no unknown
  return Math.cos((((b.dofDeg ?? 270) - axisDeg) * Math.PI) / 180);
}

/**
 * Build "these two share their acceleration along `axisDeg`" as an equation.
 * A pinned participant simply contributes no term, which turns the statement
 * into "the movable one cannot accelerate along this axis at all" — exactly
 * right for a block that cannot slide on a bolted-down wedge.
 */
function couplingEquation(
  scene: Scene, c: Contact, axisDeg: number, id: string,
  derivation: string,
): ConstraintEquation | null {
  const pa = dofProjection(scene, c.bodyA, axisDeg);
  const pb = dofProjection(scene, c.bodyB, axisDeg);
  const byBody = new Map<string, number>();
  if (pa !== null) byBody.set(c.bodyA, round(pa, 9));
  if (pb !== null) byBody.set(c.bodyB, round((byBody.get(c.bodyB) ?? 0) - pb, 9));

  const terms = [...byBody.entries()]
    .filter(([, v]) => Math.abs(v) > 1e-6)
    .map(([bodyId, coeff]) => ({ bodyId, coeff }));
  if (terms.length === 0) return null;

  const plain = `${joinTerms(terms, symbolIn(scene))} = 0`;
  return {
    id,
    terms,
    rhs: 0,
    derivation: derivation.replace('{eq}', plain),
    latex: `${joinTerms(terms, latexIn(scene))} = 0`,
  };
}

/**
 * Every kinematic coupling the contacts in this scene impose.
 *
 * A contact between two bodies that are BOTH pinned to the world couples
 * nothing — neither can move — so it produces no entry here at all. Its normal
 * and friction are then pure statics, which `solveScene` handles separately.
 */
export function deriveContactCouplings(scene: Scene): ContactCoupling[] {
  const s = normalizeScene(scene);
  const out: ContactCoupling[] = [];

  for (const c of s.contacts) {
    const pA = dofProjection(s, c.bodyA, c.normalDeg);
    const pB = dofProjection(s, c.bodyB, c.normalDeg);
    if (pA === null && pB === null) continue;   // both pinned — nothing to couple

    // (a) Pressed face-to-face along the direction of motion?
    const alongNormal = Math.max(Math.abs(pA ?? 0), Math.abs(pB ?? 0));
    if (alongNormal > NORMAL_ALONG_DOF) {
      out.push({
        contactId: c.id,
        kind: 'no-interpenetration',
        equation: couplingEquation(
          s, c, c.normalDeg, `contact_${c.id}_normal`,
          `The surfaces at contact "${c.id}" press face to face and solid bodies `
          + `cannot pass through each other, so along the normal they must `
          + `accelerate together: {eq}.`,
        ),
      });
    }

    // (b) Held on by static friction that has not been beaten yet?
    if (frictionMode(c) === 'static') {
      const t = tangentDeg(c);
      const eq = couplingEquation(
        s, c, t, `contact_${c.id}_ride`,
        `Static friction at contact "${c.id}" has not been beaten, so neither `
        + `surface slides over the other and along the surface they must have the `
        + `SAME acceleration: {eq}. This is an ASSUMPTION — it holds only while `
        + `the friction it demands stays under μₛN.`,
      );
      out.push({
        contactId: c.id,
        kind: 'ride-along',
        equation: eq,
        reason: eq ? undefined
          : `Neither body at contact "${c.id}" can move along that surface `
            + `(the tangent is perpendicular to both degrees of freedom), so how `
            + `much friction acts there is not decidable from rigid-body mechanics `
            + `— it depends on how the pressure is distributed over the contact. `
            + `The engine reports it as 0 rather than inventing a value.`,
      });
    }
  }

  return out;
}

/**
 * Every constraint in the scene: string length-invariance plus the contact
 * couplings. This is what the ledger panel shows, and it is deliberately one
 * list — to a student "the rope can't stretch" and "they don't slide on each
 * other" are the same kind of statement, and both are the step textbooks skip.
 */
export function deriveConstraints(scene: Scene): ConstraintEquation[] {
  const s = normalizeScene(scene);
  return [
    ...deriveStringConstraints(s),
    ...deriveContactCouplings(s)
      .map((k) => k.equation)
      .filter((e): e is ConstraintEquation => e !== null),
  ];
}

/**
 * Exported for the ledger UI: the world-space endpoints of each segment,
 * already snapped to the pulleys' tangent points so the drawn string matches
 * the string the equations were derived from.
 */
export function segmentEndpoints(
  scene: Scene,
  s: StringLink,
): { from: Vec2; to: Vec2 }[] {
  const sc = normalizeScene(scene);
  const out: { from: Vec2; to: Vec2 }[] = [];
  for (let i = 0; i < s.path.length - 1; i++) {
    const g = segmentGeometry(sc, s.path, i);
    out.push({ from: g.from, to: g.to });
  }
  return out;
}
