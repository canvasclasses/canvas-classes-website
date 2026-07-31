/*
 * mechanics-bench/lib/dynamics.ts — assemble ΣF = ma + constraints, solve once.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM, no dependencies.
 *
 * Every mechanics problem in this program is ONE linear system. Stacking the
 * ΣF = ma rows with the string-constraint rows and solving them together is
 * what lets Pulley Lab take an arbitrary pulley graph instead of a lookup table
 * of memorised cases.
 *
 * The system is square by construction, and each pairing is a physical fact:
 *
 *   unknown            | the equation that determines it
 *   -------------------|--------------------------------------------------------
 *   a_<body>           | ΣF = ma for that body, along its own DOF axis
 *   N_<contact>        | ΣF = ma ⟂ to the surface (the body cannot sink into it),
 *                      | or the no-interpenetration coupling when the surface
 *                      | pushes ALONG the motion
 *   f_<contact>        | the ride-along assumption (the two do not slide on each
 *                      | other), then checked against μₛN and re-solved if broken
 *   T_<string>         | that string's length-invariance constraint
 *
 * A `fixed: true` body is pinned to the world. It contributes NO acceleration
 * unknown and NO equation of motion; forces on it are settled by whatever it
 * touches, or by its own static balance when nothing that touches it can move.
 *
 * SIGN CONVENTIONS
 *  · a_<body> is the SIGNED scalar acceleration along that body's `dofDeg`.
 *  · N_<contact> is the magnitude of the normal on bodyA, pointing at normalDeg.
 *    A negative solution means the surfaces are being pulled apart — they
 *    separate, and we report it instead of pretending the contact holds.
 *  · f_<contact> is signed along the tangent t̂ = normalDeg − 90°.
 *  · T_<string> is the tension. Negative means the string is pushing, which
 *    strings cannot do — it went slack, and we report that too.
 */

import type {
  Body, ConstraintEquation, Contact, Scene, SolveResult, TrueForce,
} from '../types';
import { SystemBuilder, dir, norm360, round } from './linalg';
import { deriveConstraints, deriveContactCouplings, deriveStringConstraints } from './constraints';
import {
  accelLatex, bodyById, frictionMode, isMassiveSheave, massiveSheaveIndices,
  normalizeScene, segmentGeometry, tangentDeg, tensionRunId, tensionRunIdByForceId,
  trueForcesFor, wrapCounts,
} from './scene';

/** Anything smaller than this is numerical dust. */
const EPS = 1e-7;

// ── LaTeX for the ledger ─────────────────────────────────────────────────────

function tailDigits(id: string): string {
  const m = /(\d+)$/.exec(id);
  return m ? m[1] : '';
}

/** 'T_s1' → 'T_{1}', 'N_c2' → 'N_{2}', 'a_m1' → 'a_{1}'.
 *  A split rope's runs ('T_s1#0', 'T_s1#1') read as T₁ and T₂ — the two sides of
 *  a massive sheave, numbered the way the textbook writes them. */
function unknownLatex(name: string): string {
  const kind = name[0];
  const rest = name.slice(2);
  if (kind === 'a') return accelLatex(rest);
  const hash = rest.indexOf('#');
  if (hash >= 0) return `${kind}_{${Number(rest.slice(hash + 1)) + 1}}`;
  const n = tailDigits(rest);
  const sub = n || `\\text{${rest}}`;
  return `${kind}_{${sub}}`;
}

function fmtNum(v: number): string {
  return round(v, 3).toFixed(3);
}

/** Render 'A + 2B - 0.5C' from a coefficient map, skipping the a-term. */
function latexTerms(coeffs: Record<string, number>, skip: string, leadNumber: number): string {
  const parts: string[] = [];
  if (Math.abs(leadNumber) > EPS) parts.push(fmtNum(leadNumber));
  for (const [name, c] of Object.entries(coeffs)) {
    if (name === skip || Math.abs(c) < EPS) continue;
    const a = Math.abs(round(c, 4));
    const sym = unknownLatex(name);
    const body = Math.abs(a - 1) < 1e-9 ? sym : `${a}\\,${sym}`;
    if (parts.length === 0) parts.push(c < 0 ? `-${body}` : body);
    else parts.push(c < 0 ? `-\\;${body}` : `+\\;${body}`);
  }
  return parts.length ? parts.join(' ') : '0';
}

// ── Row assembly ─────────────────────────────────────────────────────────────

interface Row {
  coeffs: Record<string, number>;
  rhs: number;
  latex: string;
}

/**
 * Project every force on `body` onto `axisDeg`, splitting them into
 * unknown-coefficient terms and a known numeric sum.
 *
 * `body` may be fixed (a wall being pressed on), in which case there is no
 * acceleration unknown and the row is a pure force balance.
 */
function projectRow(
  body: Body,
  axisDeg: number,
  forces: TrueForce[],
  contactById: Map<string, Contact>,
  undeterminedFriction: Set<string>,
  tensionRuns: Record<string, string>,
): { coeffs: Record<string, number>; known: number } {
  const coeffs: Record<string, number> = {};
  let known = 0;
  const add = (name: string, c: number) => {
    if (Math.abs(c) < 1e-12) return;
    coeffs[name] = (coeffs[name] ?? 0) + c;
  };

  for (const f of forces) {
    const proj = Math.cos(((f.angleDeg - axisDeg) * Math.PI) / 180);
    switch (f.kind) {
      case 'normal':
        add(`N_${f.sourceId}`, proj);
        break;
      case 'tension':
        // Across a MASSIVE sheave the rope's two runs carry different
        // tensions, so the column is the run, not the rope.
        add(`T_${tensionRuns[f.id] ?? f.sourceId}`, proj);
        break;
      case 'friction': {
        const c = contactById.get(f.sourceId ?? '');
        if (!c) break;
        if (undeterminedFriction.has(c.id)) break;   // reported, not modelled
        if (f.directionKnown) {
          // Kinetic: |f| = μₖ N. Unknown magnitude, but rigidly tied to N, so it
          // lands in the N column rather than adding an unknown of its own.
          const mu = c.mu_k ?? c.mu_s ?? 0;
          add(`N_${c.id}`, mu * proj);
        } else {
          // Static: an independent unknown, signed along the tangent.
          add(`f_${c.id}`, proj);
        }
        break;
      }
      default:
        // weight / applied / spring / pseudo — magnitude already known.
        known += (f.magnitude ?? 0) * proj;
    }
  }

  // ΣF_axis = m · (a⃗ · axis). The body's acceleration lives along its DOF, so
  // its component on this axis is a·cos(dof − axis). On the DOF axis itself that
  // factor is 1; perpendicular to it, it is 0 — which is exactly the statement
  // "the block cannot accelerate into the surface".
  if (!body.fixed) {
    const f = Math.cos((((body.dofDeg ?? 270) - axisDeg) * Math.PI) / 180);
    if (Math.abs(f) > 1e-12) coeffs[`a_${body.id}`] = (coeffs[`a_${body.id}`] ?? 0) - body.mass * f;
  }

  return { coeffs, known };
}

function makeRow(
  body: Body,
  axisDeg: number,
  forces: TrueForce[],
  contactById: Map<string, Contact>,
  undeterminedFriction: Set<string>,
  tensionRuns: Record<string, string>,
  label: string,
): Row {
  const { coeffs, known } = projectRow(body, axisDeg, forces, contactById, undeterminedFriction, tensionRuns);
  const aName = `a_${body.id}`;
  const aCoeff = coeffs[aName] ?? 0;
  const lhs = latexTerms(coeffs, aName, known);
  const rhs = Math.abs(aCoeff) < EPS
    ? '0'
    : `${fmtNum(-aCoeff)}\\,${accelLatex(body.id)}`;
  return {
    coeffs,
    rhs: -known,
    latex: `${label}:\\quad ${lhs} = ${rhs}`,
  };
}

// ── The solver ───────────────────────────────────────────────────────────────

/** One pass of the solve, with every sliding/not-sliding assumption taken as
 *  given. `solveScene` wraps this in the assumption-then-test loop. */
function solveOnce(s: Scene): SolveResult {
  const constraints = deriveConstraints(s);
  const couplings = deriveContactCouplings(s);
  const contactById = new Map(s.contacts.map((c) => [c.id, c]));

  // A static-friction contact whose ride-along coupling carries no information
  // leaves its friction genuinely undecidable by rigid-body mechanics. Drop it
  // from the system entirely rather than adding an unknown with no equation —
  // and say so, loudly, in the warnings.
  const undeterminedFriction = new Set<string>();
  const warnings: string[] = [];
  for (const k of couplings) {
    if (k.kind === 'ride-along' && !k.equation) {
      undeterminedFriction.add(k.contactId);
      if (k.reason) warnings.push(k.reason);
    }
  }

  // A rigid sheave has ONE angular acceleration, so a rope wrapping it twice
  // (or two ropes wrapping it) would need its torque rows to agree — which the
  // one-row-per-wrap model cannot guarantee. Refuse rather than guess.
  const wraps = wrapCounts(s);
  const overWrapped = s.bodies.filter((b) => isMassiveSheave(b) && (wraps[b.id] ?? 0) > 1);
  if (overWrapped.length > 0) {
    const accelerations: Record<string, number> = {};
    const tensions: Record<string, number> = {};
    const normals: Record<string, number> = {};
    const frictions: Record<string, number> = {};
    for (const b of s.bodies) accelerations[b.id] = 0;
    for (const c of s.contacts) { normals[c.id] = 0; frictions[c.id] = 0; }
    for (const link of s.strings) tensions[link.id] = 0;
    return {
      accelerations, tensions, normals, frictions,
      constraints: [], equations: [], singular: true,
      brokenContacts: [], slackStrings: [],
      warnings: [
        ...warnings,
        `Sheave "${overWrapped[0].id}" carries inertia and is wrapped `
        + `${wraps[overWrapped[0].id]} times. A rigid sheave has a single angular `
        + `acceleration that every wrap must share, and this engine writes one `
        + `torque row per wrap — so it cannot solve this scene without guessing. `
        + `Model each wrap as its own sheave, or leave this one massless.`,
      ],
    };
  }

  const tensionRuns = tensionRunIdByForceId(s);
  const torqueLedger: ConstraintEquation[] = [];

  const forcesByBody = new Map<string, TrueForce[]>();
  for (const b of s.bodies) forcesByBody.set(b.id, trueForcesFor(s, b.id));

  const sys = new SystemBuilder();
  const equations: string[] = [];
  const addRow = (row: Row) => {
    sys.equation(row.coeffs, row.rhs, row.latex);
    equations.push(row.latex);
  };
  const addCoupling = (eq: ConstraintEquation) => {
    const coeffs: Record<string, number> = {};
    for (const t of eq.terms) coeffs[`a_${t.bodyId}`] = (coeffs[`a_${t.bodyId}`] ?? 0) + t.coeff;
    sys.equation(coeffs, eq.rhs, eq.latex);
    equations.push(eq.latex);
  };

  // ── 1. One ΣF = ma row per MOVABLE body, along its own DOF axis.
  //    A `fixed: true` body is pinned to the world: its acceleration is
  //    identically zero, so it gets no unknown and no equation of motion. Any
  //    force on it is settled by whatever it is in contact with (step 2).
  for (const b of s.bodies) {
    if (b.fixed) continue;
    const axis = b.dofDeg ?? 270;
    sys.unknown(`a_${b.id}`);
    addRow(makeRow(
      b, axis, forcesByBody.get(b.id) ?? [], contactById, undeterminedFriction, tensionRuns,
      `\\Sigma F_{\\parallel}\\ (${b.label ?? b.id},\\ ${round(axis, 1)}^\\circ)`,
    ));
  }

  // ── 2. One row per contact, to determine N. Which row depends on how the
  //    contact sits relative to the bodies' degrees of freedom:
  //
  //    · normal ⟂ DOF (the body RESTS on the surface): ΣF ⟂ to the surface,
  //      with zero acceleration into it. This is what gives N = mg cos θ.
  //    · normal ∥ DOF (the body is PUSHED by the surface): the perpendicular
  //      balance would just restate the ΣF = ma row and the system would go
  //      singular, so the no-interpenetration coupling supplies the row instead.
  //    · both participants pinned (a bolted wedge on the ground): nothing can
  //      move, so this is pure statics — ΣF = 0 for the pinned body.
  const normalCoupling = new Map(
    couplings.filter((k) => k.kind === 'no-interpenetration' && k.equation)
      .map((k) => [k.contactId, k.equation as ConstraintEquation]),
  );
  for (const c of s.contacts) {
    const A = bodyById(s, c.bodyA);
    if (!A) {
      warnings.push(`Contact "${c.id}" names bodyA "${c.bodyA}", which is not in the scene.`);
      continue;
    }
    sys.unknown(`N_${c.id}`);

    const coupled = normalCoupling.get(c.id);
    if (coupled) { addCoupling(coupled); continue; }

    // The row belongs to whichever participant can actually move; if neither
    // can, it is the pinned body's own static balance.
    const B = bodyById(s, c.bodyB);
    const governing = !A.fixed ? A : (B && !B.fixed ? B : A);
    const axis = governing === A ? c.normalDeg : c.normalDeg + 180;
    addRow(makeRow(
      governing, axis, forcesByBody.get(governing.id) ?? [], contactById, undeterminedFriction, tensionRuns,
      `\\Sigma F_{\\perp}\\ (${governing.label ?? governing.id},\\ ${round(norm360(axis), 1)}^\\circ)`,
    ));
  }

  // ── 3. Static friction: assume nothing slides, then TEST the assumption.
  //    Static friction is a RANGE, not a value. The only way to pin it down is
  //    to assume the surfaces stay locked, solve for the friction that requires,
  //    and check it against μₛN — which `solveScene` does, re-solving as kinetic
  //    if the assumption has broken.
  const rideCoupling = new Map(
    couplings.filter((k) => k.kind === 'ride-along' && k.equation)
      .map((k) => [k.contactId, k.equation as ConstraintEquation]),
  );
  for (const c of s.contacts) {
    if (frictionMode(c) !== 'static' || undeterminedFriction.has(c.id)) continue;
    sys.unknown(`f_${c.id}`);

    const ride = rideCoupling.get(c.id);
    if (ride) { addCoupling(ride); continue; }

    // Both participants pinned: friction here is statics, not kinematics.
    const A = bodyById(s, c.bodyA);
    if (!A) continue;
    addRow(makeRow(
      A, tangentDeg(c), forcesByBody.get(A.id) ?? [], contactById, undeterminedFriction, tensionRuns,
      `\\Sigma F_{\\parallel}\\ (${A.label ?? A.id},\\ ${round(tangentDeg(c), 1)}^\\circ`
      + `\\text{, pinned})`,
    ));
  }

  // ── 4. Tension unknowns: one per rope RUN, and one length-invariance row
  //    per taut rope. A rope with no massive sheave has exactly one run, so its
  //    unknown is `T_<id>` exactly as before.
  for (const link of s.strings) {
    if (!link.taut) continue;
    const sheaves = massiveSheaveIndices(s, link);
    for (let run = 0; run <= sheaves.length; run++) {
      sys.unknown(`T_${sheaves.length === 0 ? link.id : `${link.id}#${run}`}`);
    }
    if (link.massless === false) {
      warnings.push(
        `String "${link.id}" is marked as having mass, but the engine models a `
        + `single tension per run. A heavy string (tension varying continuously `
        + `along its length) is not supported yet.`,
      );
    }
  }
  for (const eq of deriveStringConstraints(s)) addCoupling(eq);

  // ── 5. Rotation. A sheave with a moment of inertia has to be SPUN UP, and
  //    the only thing that can supply that torque is a difference between the
  //    tensions on its two sides. This is the row that turns "tension is the
  //    same throughout" from a law back into what it always was: the massless
  //    idealisation.
  //
  //      τ = (T_in − T_out)·r = I·α          (Newton's second law for rotation)
  //      α = L̈/r                             (NO SLIP: rim and rope move together)
  //   ⇒  T_in − T_out = (I/r²)·L̈
  //
  //    where L̈ is the rate at which the ARRIVING segment lengthens — which is
  //    exactly the per-segment contribution the string constraint already
  //    computes, (a_to − a_from)·û. The wrap sense cancels out of the algebra
  //    (it appears once in α and once in τ), so this needs no orientation
  //    bookkeeping and cannot get its sign wrong from the geometry.
  for (const link of s.strings) {
    if (!link.taut) continue;
    for (const p of massiveSheaveIndices(s, link)) {
      const sheave = bodyById(s, link.path[p]);
      if (!sheave) continue;
      const I = sheave.inertia ?? 0;
      const r = sheave.radius ?? 0;

      // L̈ of the segment arriving at the sheave, in acceleration unknowns.
      const seg = segmentGeometry(s, link.path, p - 1);
      const u = dir(seg.unitDeg);
      const coeffs: Record<string, number> = {
        [`T_${tensionRunId(s, link, p - 1)}`]: 1,
        [`T_${tensionRunId(s, link, p)}`]: -1,
      };
      const addLdd = (id: string, sign: number) => {
        const b = bodyById(s, id);
        if (!b || b.fixed) return;
        const d = dir(b.dofDeg ?? 270);
        const c = sign * (d.x * u.x + d.y * u.y) * (I / (r * r));
        if (Math.abs(c) > 1e-12) coeffs[`a_${b.id}`] = (coeffs[`a_${b.id}`] ?? 0) - c;
      };
      addLdd(link.path[p - 1], -1);   // the "from" end of the arriving segment
      addLdd(link.path[p], +1);       // the sheave itself, if it can translate

      const latex =
        `\\tau\\ (${sheave.label ?? sheave.id}):\\quad `
        + `(T_{1} - T_{2})\\,r = I\\alpha,\\ \\ \\alpha = \\ddot{L}/r \\ \\Rightarrow\\ `
        + `${latexTerms(coeffs, '', 0)} = 0`;
      sys.equation(coeffs, 0, latex);
      equations.push(latex);

      // Ledger entry. `terms` is intentionally empty: this row is not of the
      // Σ coeff·a form the field documents, and putting the acceleration
      // coefficients there alone would assert an equation that is false. The
      // derivation carries the physics, which is what the ledger renders.
      torqueLedger.push({
        id: `torque_${link.id}_${sheave.id}`,
        terms: [],
        rhs: 0,
        derivation:
          `The rope does not slip on sheave "${sheave.label ?? sheave.id}", so its rim `
          + `and the rope move together and the sheave's angular acceleration is fixed `
          + `by the rope's linear one: α = a/r. That is an ASSUMPTION — a rope that `
          + `slips on the sheave is a different model, and this one does not describe `
          + `it. Given no slip, spinning up I = ${round(I, 4)} kg m² needs a net torque, `
          + `and the only thing that can supply it is a DIFFERENCE between the two `
          + `tensions: (T₁ − T₂)·r = Iα. That is why "the tension is the same `
          + `throughout" was only ever shorthand for "the pulley is massless".`,
        latex,
        segments: [],
      });
    }
  }

  // ── 6. Solve everything simultaneously. ──────────────────────────────────
  const sol = sys.solve();

  const accelerations: Record<string, number> = {};
  const tensions: Record<string, number> = {};
  const normals: Record<string, number> = {};
  const frictions: Record<string, number> = {};
  const brokenContacts: string[] = [];
  const slackStrings: string[] = [];

  if (sol.singular) {
    if (sol.reason) warnings.push(sol.reason);
    for (const b of s.bodies) accelerations[b.id] = 0;
    for (const c of s.contacts) { normals[c.id] = 0; frictions[c.id] = 0; }
    for (const link of s.strings) tensions[link.id] = 0;
    return {
      accelerations, tensions, normals, frictions,
      constraints, equations, singular: true, brokenContacts, slackStrings, warnings,
    };
  }

  for (const b of s.bodies) {
    accelerations[b.id] = b.fixed ? 0 : round(sol.values[`a_${b.id}`] ?? 0, 6);
  }
  for (const link of s.strings) {
    if (!link.taut) { tensions[link.id] = 0; continue; }
    const sheaves = massiveSheaveIndices(s, link);
    if (sheaves.length === 0) {
      tensions[link.id] = round(sol.values[`T_${link.id}`] ?? 0, 6);
      continue;
    }
    // Split rope: every run is reported under `id#run`, and the plain string id
    // keeps the first run's value so readers that expect one tension per rope
    // still get a real number rather than undefined.
    for (let run = 0; run <= sheaves.length; run++) {
      tensions[`${link.id}#${run}`] = round(sol.values[`T_${link.id}#${run}`] ?? 0, 6);
    }
    tensions[link.id] = tensions[`${link.id}#0`];
  }
  for (const c of s.contacts) {
    normals[c.id] = round(sol.values[`N_${c.id}`] ?? 0, 6);
    const mode = frictionMode(c);
    if (mode === 'none' || undeterminedFriction.has(c.id)) frictions[c.id] = 0;
    else if (mode === 'static') frictions[c.id] = round(sol.values[`f_${c.id}`] ?? 0, 6);
    else {
      // Kinetic: magnitude μₖN, sense opposite the sliding. Reported signed
      // along the tangent reference t̂ = normalDeg − 90°.
      const mu = c.mu_k ?? c.mu_s ?? 0;
      const sgn = c.slidingSign === 1 ? -1 : 1;
      frictions[c.id] = round(sgn * mu * normals[c.id], 6);
    }
  }

  // ── 7. Post-checks. Report, never swallow. ───────────────────────────────
  for (const c of s.contacts) {
    if (normals[c.id] < -EPS) {
      brokenContacts.push(c.id);
      warnings.push(
        `Contact "${c.id}" solves to N = ${fmtNum(normals[c.id])} N. A surface can `
        + `only push, never pull — the two bodies separate here, so this contact `
        + `does not exist in the real motion.`,
      );
    }
  }
  for (const link of s.strings) {
    const runs = massiveSheaveIndices(s, link).length === 0
      ? [tensions[link.id]]
      : massiveSheaveIndices(s, link).map((_x, k) => tensions[`${link.id}#${k}`]).concat(
        tensions[`${link.id}#${massiveSheaveIndices(s, link).length}`]);
    if (link.taut && Math.min(...runs) < -EPS) {
      slackStrings.push(link.id);
      warnings.push(
        `String "${link.id}" solves to T = ${fmtNum(Math.min(...runs))} N. A string `
        + `can only pull, never push — it has gone slack, so set taut: false and `
        + `re-solve (this is the vertical-circle moment).`,
      );
    }
  }

  return {
    accelerations, tensions, normals, frictions,
    constraints: [...constraints, ...torqueLedger],
    equations, singular: false, brokenContacts, slackStrings, warnings,
  };
}

/** A static-friction assumption that the solve has just disproved. */
interface SlippedContact { contact: Contact; required: number; available: number; sign: -1 | 1 }

/**
 * Every contact where the friction the "nothing slides" assumption demands
 * exceeds what μₛN can actually supply.
 *
 * The sliding sense follows from the sign of the demand: if friction had to act
 * along +t̂ to hold the body, then without enough of it the body runs the OTHER
 * way, so it slides along −t̂ — and kinetic friction then acts along +t̂, which
 * is the direction the static solve was already asking for. That consistency is
 * what makes the re-solve converge instead of flapping.
 */
function findSlippedContacts(s: Scene, res: SolveResult): SlippedContact[] {
  const out: SlippedContact[] = [];
  for (const c of s.contacts) {
    if (frictionMode(c) !== 'static') continue;
    const required = Math.abs(res.frictions[c.id] ?? 0);
    const available = Math.max(0, (c.mu_s ?? 0) * (res.normals[c.id] ?? 0));
    if (required > available + 1e-6) {
      out.push({ contact: c, required, available, sign: (res.frictions[c.id] ?? 0) >= 0 ? -1 : 1 });
    }
  }
  return out;
}

/**
 * Solve the whole scene at once: every acceleration, every tension, every
 * normal, every unknown static friction.
 *
 * ASSUMPTION-THEN-TEST. Static friction is a range, so the first pass assumes
 * nothing slides — bodies resting on each other ride along together, bodies on
 * the ground stay put — and solves for the friction that requires. Wherever
 * that demand exceeds μₛN the assumption is disproved: those surfaces really do
 * slide, so the coupling between them is dropped, the contact is re-solved with
 * KINETIC friction, and the whole system is solved again. This is the standard
 * fixed point for Coulomb friction and it is also the pedagogy — "they move
 * together" is a claim that has to be earned, not a given.
 *
 * Nothing is swallowed. A separated surface, a slack string, a broken
 * static-friction assumption, an indeterminate contact, or an under-determined
 * scene all come back as reported facts — an engine that quietly returns a
 * plausible-looking number for a scene it cannot solve is worse than one that
 * says so.
 */
export function solveScene(scene: Scene): SolveResult {
  let working = normalizeScene(scene);
  const carried: string[] = [];
  const MAX_PASSES = 4;

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const res = solveOnce(working);
    if (res.singular) {
      res.warnings = [...carried, ...res.warnings];
      return res;
    }

    const slipped = findSlippedContacts(working, res);
    if (slipped.length === 0) {
      res.warnings = [...carried, ...res.warnings];
      return res;
    }

    for (const sl of slipped) {
      const c = sl.contact;
      carried.push(
        `Contact "${c.id}" needs ${fmtNum(sl.required)} N of static friction to keep `
        + `"${c.bodyA}" from sliding on "${c.bodyB}", but only μₛN = `
        + `${fmtNum(c.mu_s ?? 0)} × ${fmtNum(res.normals[c.id] ?? 0)} = `
        + `${fmtNum(sl.available)} N is available. Static friction is a range with a `
        + `ceiling; past that ceiling the surfaces slide and stop moving together. `
        + `Re-solved with kinetic friction (μₖ = ${fmtNum(c.mu_k ?? c.mu_s ?? 0)}) at `
        + `this contact.`,
      );
    }

    if (pass === MAX_PASSES - 1) {
      carried.push(
        'Coulomb friction did not settle: after several passes the scene still '
        + 'disagrees with itself about which surfaces slide. The values below are '
        + 'from the last pass and should not be trusted.',
      );
      res.warnings = [...carried, ...res.warnings];
      return res;
    }

    const slipping = new Map(slipped.map((sl) => [sl.contact.id, sl.sign]));
    working = {
      ...working,
      contacts: working.contacts.map((c) =>
        slipping.has(c.id) ? { ...c, slidingSign: slipping.get(c.id) } : c),
    };
  }

  // Unreachable — the loop always returns.
  return solveOnce(working);
}

/**
 * The ground-truth forces for one body with every magnitude filled in from a
 * solve. Convenience for the renderers — the FBD panel wants labelled arrows
 * with numbers on them, not two lists to zip together.
 */
export function solvedForcesFor(scene: Scene, bodyId: string): TrueForce[] {
  const s = normalizeScene(scene);
  const res = solveScene(s);
  const contactById = new Map(s.contacts.map((c) => [c.id, c]));
  return trueForcesFor(s, bodyId).map((f) => {
    if (f.magnitude !== undefined) return f;
    if (!f.sourceId) return f;
    if (f.kind === 'normal') return { ...f, magnitude: round(Math.abs(res.normals[f.sourceId] ?? 0), 6) };
    if (f.kind === 'tension') {
      const key = tensionRunIdByForceId(s)[f.id] ?? f.sourceId;
      return { ...f, magnitude: round(Math.abs(res.tensions[key] ?? 0), 6) };
    }
    if (f.kind === 'friction') {
      const signed = res.frictions[f.sourceId] ?? 0;
      const c = contactById.get(f.sourceId);
      if (!c) return { ...f, magnitude: Math.abs(signed) };
      // Static friction's sense only becomes known once solved — hand back the
      // resolved direction so the "reveal answer" view can draw it correctly.
      const isReaction = f.id.endsWith('_r');
      const base = signed >= 0 ? tangentDeg(c) : norm360(tangentDeg(c) + 180);
      return {
        ...f,
        magnitude: round(Math.abs(signed), 6),
        angleDeg: f.directionKnown ? f.angleDeg : norm360(base + (isReaction ? 180 : 0)),
      };
    }
    return f;
  });
}

export type { ConstraintEquation };
