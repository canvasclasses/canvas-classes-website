/*
 * mechanics-bench/lib/grade.ts — the misconception engine.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM, no dependencies.
 *
 * Design law #2 (PHYSICS_SIMULATION_PROGRAM.md §2): the sim must be able to say
 * "you drew a forward force on this block — name the object pushing it", not
 * just "wrong". Every wrong answer maps to a NAMED misconception, and the
 * feedback attacks that specific misconception and hands the reasoning back to
 * the student rather than supplying the answer.
 *
 * The numbers inside the messages (the 30°, the 12 N, the mg cos θ) are all
 * computed from the scene and the solve — nothing is hardcoded into a string,
 * because the whole point is that the student built this scene themselves.
 *
 * Implements the table in PHYSICS_SIMULATION_PROGRAM.md §5.1.
 */

import type {
  Contact, ForceKind, GradeIssue, GradeResult, MisconceptionCode, Scene,
  StudentForce, TrueForce,
} from '../types';
import { angleDiff, norm360, round } from './linalg';
import { bodyById, isWorldId, normalizeScene } from './scene';
import { solveScene, solvedForcesFor } from './dynamics';

export interface GradeOptions {
  /** Require the student to have named the agent of every force they drew. */
  requireAgent?: boolean;
  /** Default 8°. */
  angleToleranceDeg?: number;
  /** Default 0.05 (5%). */
  magToleranceFrac?: number;
}

const DEFAULTS = { requireAgent: false, angleToleranceDeg: 8, magToleranceFrac: 0.05 };

const n1 = (v: number): string => round(v, 1).toFixed(1);
const n2 = (v: number): string => round(v, 2).toFixed(2);

/** Human name for a force kind, used inside the diagnostic sentences. */
const KIND_WORD: Record<ForceKind, string> = {
  weight: 'weight', normal: 'normal', friction: 'friction', tension: 'tension',
  applied: 'applied force', spring: 'spring force', pseudo: 'pseudo-force',
};

/** How the agent of a force reads in a sentence: 'world:ground' → 'the ground'. */
function agentWord(id: string): string {
  if (!id) return 'something unnamed';
  if (id.startsWith('world:')) return `the ${id.slice(6)}`;
  if (id.startsWith('frame:')) return 'the accelerating frame';
  return `"${id}"`;
}

function issue(
  code: MisconceptionCode,
  message: string,
  extra: Partial<GradeIssue> = {},
): GradeIssue {
  return { code, severity: 'error', message, ...extra };
}

// ── Matching ─────────────────────────────────────────────────────────────────

interface Pair { sf: StudentForce; tf: TrueForce }

/**
 * Pair student arrows with ground truth by KIND first, direction second.
 *
 * Kind-first is deliberate: a normal drawn vertically on an incline must still
 * be recognised as the student's attempt at the normal, otherwise it would be
 * reported as a ghost force and the real misconception
 * (`normal_not_perpendicular`) would never be named.
 */
function matchForces(
  drawn: StudentForce[], truth: TrueForce[], tolDeg: number,
): { pairs: Pair[]; unmatchedStudent: StudentForce[]; unmatchedTruth: TrueForce[] } {
  // Score every compatible (arrow, truth) pair, then assign best-first. Doing
  // it globally rather than in drawing order matters: if a student draws BOTH
  // halves of an action–reaction pair, the correctly-aimed arrow must claim the
  // real normal so the other one is left over and gets diagnosed as
  // `third_law_pair_same_body` — otherwise the diagnosis would depend on which
  // arrow happened to be drawn first.
  const candidates: { sf: StudentForce; tf: TrueForce; score: number }[] = [];
  for (const sf of drawn) {
    for (const tf of truth) {
      if (sf.kind !== 'unknown' && tf.kind !== sf.kind) continue;
      // A force whose direction was never determined (static friction) cannot
      // be scored on direction — kind alone is the whole match.
      const score = tf.directionKnown ? angleDiff(sf.angleDeg, tf.angleDeg) : 0;
      // An unlabelled arrow only counts as an attempt at a force if it actually
      // points that way; otherwise it is something the student invented.
      if (sf.kind === 'unknown' && tf.directionKnown && score > tolDeg) continue;
      candidates.push({ sf, tf, score });
    }
  }
  candidates.sort((a, b) => a.score - b.score);

  const usedTruth = new Set<string>();
  const usedStudent = new Set<string>();
  const pairs: Pair[] = [];
  for (const c of candidates) {
    if (usedTruth.has(c.tf.id) || usedStudent.has(c.sf.id)) continue;
    usedTruth.add(c.tf.id);
    usedStudent.add(c.sf.id);
    pairs.push({ sf: c.sf, tf: c.tf });
  }

  return {
    pairs,
    unmatchedStudent: drawn.filter((f) => !usedStudent.has(f.id)),
    unmatchedTruth: truth.filter((t) => !usedTruth.has(t.id)),
  };
}

// ── The grader ───────────────────────────────────────────────────────────────

/**
 * Grade one free-body diagram.
 *
 * `correct` is true only when there are no error-severity issues, nothing was
 * missed, and nothing spurious was drawn. Warnings (an unnamed agent, say) do
 * not fail the diagram.
 */
export function gradeFbd(
  scene: Scene,
  bodyId: string,
  drawn: StudentForce[],
  opts: GradeOptions = {},
): GradeResult {
  const o = { ...DEFAULTS, ...opts };
  const s = normalizeScene(scene);
  const body = bodyById(s, bodyId);
  const g = s.g ?? 9.8;
  const inertial = (s.frame ?? { kind: 'inertial' }).kind === 'inertial';

  const truth = body ? solvedForcesFor(s, bodyId) : [];
  const solved = solveScene(s);
  const contactById = new Map<string, Contact>(s.contacts.map((c) => [c.id, c]));
  const knownIds = new Set<string>([
    ...s.bodies.map((b) => b.id),
    ...Object.values({ earth: 'world:earth', ground: 'world:ground', wall: 'world:wall', ceiling: 'world:ceiling', hand: 'world:hand' }),
    ...s.strings.map((x) => x.id),
    ...(s.springs ?? []).map((x) => x.id),
    ...(s.applied ?? []).map((x) => x.from),
  ]);

  const issues: GradeIssue[] = [];
  const matched: Record<string, string> = {};
  const missing: string[] = [];
  const spurious: string[] = [];

  if (!body) {
    return {
      correct: false,
      issues: [issue('extra_force', `There is no body called "${bodyId}" in this scene.`)],
      matched, missing, spurious,
    };
  }

  const { pairs, unmatchedStudent, unmatchedTruth } =
    matchForces(drawn, truth, o.angleToleranceDeg);

  // ── Paired arrows: geometry, then magnitude, then agent. ─────────────────
  for (const { sf, tf } of pairs) {
    let accepted = true;

    // — Direction. Never judged when the truth's own direction is undetermined:
    //   static friction's sense is not fixed until the system is solved, and
    //   marking it wrong would be a false negative the student cannot answer.
    if (tf.directionKnown) {
      const diff = angleDiff(sf.angleDeg, tf.angleDeg);
      if (diff > o.angleToleranceDeg) {
        accepted = false;
        const surfaceTilt = round(angleDiff(tf.angleDeg, 90), 1);
        switch (tf.kind) {
          case 'normal':
            issues.push(issue('normal_not_perpendicular',
              `Normal is perpendicular to the *surface*, not to the ground. This `
              + `surface is tilted ${n1(surfaceTilt)}°, so the normal from `
              + `${agentWord(tf.fromBody)} points along ${n1(tf.angleDeg)}° — you drew `
              + `${n1(sf.angleDeg)}°. Which surface is actually doing the pushing?`,
              { forceId: sf.id, trueForceId: tf.id,
                hint: 'Turn the page until the slope looks flat. Where does the normal point now?' }));
            break;
          case 'weight':
            issues.push(issue('weight_not_vertical',
              `Weight always points straight down at 270°, toward the centre of the `
              + `Earth. You drew it at ${n1(sf.angleDeg)}°, which is `
              + `${n1(diff)}° off. Tilting your axes does not tilt gravity — the `
              + `weight is what gets resolved, not redirected.`,
              { forceId: sf.id, trueForceId: tf.id,
                hint: 'Does the Earth know which way you drew your axes?' }));
            break;
          case 'tension':
            if (diff > 180 - o.angleToleranceDeg) {
              issues.push(issue('tension_wrong_direction',
                `A string can only PULL. You drew this tension pushing the body away `
                + `from ${agentWord(tf.fromBody)}; it must point from the body toward `
                + `${agentWord(tf.fromBody)}, along ${n1(tf.angleDeg)}°. `
                + `What would a string have to do to push something?`,
                { forceId: sf.id, trueForceId: tf.id }));
            } else {
              issues.push(issue('tension_wrong_direction',
                `Tension acts along the string. This segment runs at `
                + `${n1(tf.angleDeg)}°, but you drew the arrow at ${n1(sf.angleDeg)}°. `
                + `Trace the string with your finger — which way does it pull?`,
                { forceId: sf.id, trueForceId: tf.id }));
            }
            break;
          case 'friction':
            issues.push(issue('friction_wrong_sense',
              `Friction opposes the relative SLIDING at the contact, not the motion `
              + `you expect. Here the contact slides such that friction on `
              + `"${bodyId}" acts along ${n1(tf.angleDeg)}° — you drew `
              + `${n1(sf.angleDeg)}°. Which way is this surface sliding over the other?`,
              { forceId: sf.id, trueForceId: tf.id }));
            break;
          default:
            // No geometry code exists for an applied/spring/pseudo arrow this
            // far off — it is not that force at all, so treat it as invented.
            issues.push(issue('extra_force',
              `${agentWord(tf.fromBody)} applies its ${KIND_WORD[tf.kind]} along `
              + `${n1(tf.angleDeg)}°, but you drew this arrow at ${n1(sf.angleDeg)}°. `
              + `Nothing acts in the direction you drew.`,
              { forceId: sf.id, trueForceId: tf.id }));
        }
      }
    }

    // — Magnitude.
    if (sf.magnitude !== undefined && tf.magnitude !== undefined && accepted) {
      const c = tf.sourceId ? contactById.get(tf.sourceId) : undefined;

      if (tf.kind === 'friction' && c) {
        const mu = c.mu_s ?? c.mu_k ?? 0;
        const N = solved.normals[c.id] ?? 0;
        const cap = mu * N;
        if (sf.magnitude > cap * (1 + o.magToleranceFrac) + 1e-6) {
          accepted = false;
          issues.push(issue('friction_exceeds_max',
            `Static friction is a RANGE, capped at μₛN = ${n2(mu)} × ${n1(N)} N = `
            + `${n1(cap)} N. You drew ${n1(sf.magnitude)} N. Below that cap friction `
            + `takes whatever value keeps the surfaces from sliding — it is not a `
            + `fixed number you compute first. What would have to change for it to `
            + `reach ${n1(sf.magnitude)} N?`,
            { forceId: sf.id, trueForceId: tf.id,
              hint: `Only two things raise the cap: a rougher surface (bigger μₛ) or a harder press (bigger N).` }));
        }
      }

      if (accepted && tf.kind === 'normal' && c) {
        const tilt = angleDiff(c.normalDeg, 90);
        const mg = body.mass * g;
        const relToMg = mg > 0 ? Math.abs(sf.magnitude - mg) / mg : 1;
        const relToTrue = tf.magnitude > 0 ? Math.abs(sf.magnitude - tf.magnitude) / tf.magnitude : 1;
        if (tilt > 1 && relToMg <= o.magToleranceFrac && relToTrue > o.magToleranceFrac) {
          accepted = false;
          issues.push(issue('normal_equals_mg_on_incline',
            `You set N = mg = ${n1(mg)} N. On a surface tilted ${n1(tilt)}° only the `
            + `component of weight PERPENDICULAR to the surface presses into it, so `
            + `N = mg·cos ${n1(tilt)}° = ${n1(tf.magnitude)} N. Resolve the weight along `
            + `and across the slope, and ask which piece the normal has to balance.`,
            { forceId: sf.id, trueForceId: tf.id,
              hint: 'If N were still mg, what would be left over to push the block down the slope?' }));
        }
      }

      if (accepted && tf.magnitude > 0) {
        const rel = Math.abs(sf.magnitude - tf.magnitude) / tf.magnitude;
        if (rel > o.magToleranceFrac) {
          accepted = false;
          issues.push(issue('magnitude_wrong',
            `The direction of this ${KIND_WORD[tf.kind]} is right, but the size is `
            + `not: ${tf.magSymbol} = ${n1(tf.magnitude)} N and you drew `
            + `${n1(sf.magnitude)} N. Re-run the equation that fixes this one.`,
            { forceId: sf.id, trueForceId: tf.id }));
        }
      }
    }

    // — Agent. "Name the object applying this force" is the anti-ghost drill;
    //   a force with no nameable agent is not a force.
    if (o.requireAgent) {
      const claimed = (sf.claimedFrom ?? '').trim();
      const ok = claimed !== ''
        && (claimed === tf.fromBody || claimed === tf.sourceId
          || (tf.kind === 'weight' && /earth|gravity/i.test(claimed)));
      if (!ok) {
        issues.push({
          // Its OWN code, not `extra_force`: this arrow is CORRECT and only its
          // agent is unstated or misnamed. Filing it under "extra force" headed
          // the student's feedback panel with an accusation that the arrow
          // shouldn't be there at all — the opposite of what happened.
          code: 'force_agent_unnamed',
          severity: 'warning',
          forceId: sf.id,
          trueForceId: tf.id,
          message: claimed === ''
            ? `This ${KIND_WORD[tf.kind]} arrow is right, but you have not said what `
              + `applies it. Every force has an agent — this one is `
              + `${agentWord(tf.fromBody)}.`
            : `You named ${agentWord(claimed)} as the agent of this `
              + `${KIND_WORD[tf.kind]}, but it is ${agentWord(tf.fromBody)}.`,
        });
      }
    }

    if (accepted) matched[sf.id] = tf.id;
  }

  // ── Omissions. ───────────────────────────────────────────────────────────
  for (const tf of unmatchedTruth) {
    missing.push(tf.id);
    switch (tf.kind) {
      case 'weight':
        issues.push(issue('missing_weight',
          `Every body with mass is pulled by the Earth — always, moving or not, `
          + `touching something or not. "${bodyId}" has m = ${n2(body.mass)} kg, so a `
          + `${n1(tf.magnitude ?? 0)} N force straight down is missing from this diagram.`,
          { trueForceId: tf.id, hint: 'The agent is the Earth. It never lets go.' }));
        break;
      case 'normal':
        issues.push(issue('missing_normal',
          `This body is touching ${agentWord(tf.fromBody)}. Every contact pushes — a `
          + `surface cannot let a body sink into it. Which force is missing, and `
          + `which way must it point relative to that surface?`,
          { trueForceId: tf.id,
            hint: `Perpendicular to the surface, i.e. along ${n1(tf.angleDeg)}°.` }));
        break;
      case 'tension':
        issues.push(issue('missing_tension',
          `A string runs from this body to ${agentWord(tf.fromBody)}, and a taut `
          + `string always pulls. The tension along ${n1(tf.angleDeg)}° is missing.`,
          { trueForceId: tf.id }));
        break;
      case 'friction':
        issues.push(issue('missing_friction',
          `This contact with ${agentWord(tf.fromBody)} is rough `
          + `(μ = ${n2(contactById.get(tf.sourceId ?? '')?.mu_s
            ?? contactById.get(tf.sourceId ?? '')?.mu_k ?? 0)}), so friction acts along `
          + `the surface and you have left it out. Which way does it point, and why?`,
          { trueForceId: tf.id,
            hint: 'Friction opposes the relative sliding at the contact — decide which way that sliding goes first.' }));
        break;
      case 'pseudo':
        issues.push(issue('missing_pseudo_in_noninertial',
          `You are drawing this diagram in a NON-inertial frame, and in a `
          + `non-inertial frame Newton's second law only works once the pseudo-force `
          + `is included. A ${n1(tf.magnitude ?? 0)} N pseudo-force along `
          + `${n1(tf.angleDeg)}° is missing. Which way does the frame accelerate?`,
          { trueForceId: tf.id,
            hint: 'The pseudo-force points opposite the frame\'s acceleration.' }));
        break;
      default:
        // `missing_applied` / `missing_spring` were added to MisconceptionCode
        // after this module was first written, precisely so an omitted push or
        // spring force is not mis-filed as a missing tension — the codes drive
        // later analytics on which misconception a student actually has.
        issues.push(issue(tf.kind === 'spring' ? 'missing_spring' : 'missing_applied',
          `${agentWord(tf.fromBody)} applies a ${KIND_WORD[tf.kind]} of `
          + `${n1(tf.magnitude ?? 0)} N along ${n1(tf.angleDeg)}° to this body, and it `
          + `is not on your diagram. A force does not stop existing because it is `
          + `inconvenient.`,
          { trueForceId: tf.id }));
    }
  }

  // ── Inventions. ──────────────────────────────────────────────────────────
  for (const sf of unmatchedStudent) {
    spurious.push(sf.id);
    const label = `${sf.label ?? ''} ${sf.claimedFrom ?? ''}`.trim();

    // (a) Both halves of a third-law pair drawn on one body — the reaction to
    //     a real force on this body points exactly the other way.
    const reactionOf = truth.find((t) =>
      (t.kind === 'normal' || t.kind === 'friction')
      && t.directionKnown
      && angleDiff(sf.angleDeg, t.angleDeg + 180) <= o.angleToleranceDeg
      && (sf.kind === 'unknown' || sf.kind === t.kind));
    if (reactionOf) {
      issues.push(issue('third_law_pair_same_body',
        `These two are an action–reaction pair: ${agentWord(reactionOf.fromBody)} pushes `
        + `"${bodyId}" along ${n1(reactionOf.angleDeg)}°, and "${bodyId}" pushes back on `
        + `${agentWord(reactionOf.fromBody)} along ${n1(norm360(reactionOf.angleDeg + 180))}°. `
        + `They act on DIFFERENT bodies, so they can never both appear on one `
        + `free-body diagram. Move this one onto ${agentWord(reactionOf.fromBody)}.`,
        { forceId: sf.id, trueForceId: reactionOf.id,
          hint: 'If both were on this body they would cancel, and nothing would ever accelerate.' }));
      continue;
    }

    // (b) Pseudo-forces, and the centrifugal special case.
    const looksCentrifugal = /centrifugal|outward|centrifugal force/i.test(label);
    if (sf.kind === 'pseudo' || looksCentrifugal) {
      if (inertial && looksCentrifugal) {
        issues.push(issue('ghost_centrifugal',
          `You are working in the GROUND frame, and in the ground frame there is no `
          + `outward force — nothing is pulling the body away from the centre. The `
          + `inward pull is the only radial force there is. Switch to the rotating `
          + `frame first, or delete this arrow. If you cut the string, which way `
          + `would the body actually go?`,
          { forceId: sf.id,
            hint: 'Tangentially, in a straight line — because no force was pushing it outward.' }));
      } else if (inertial) {
        issues.push(issue('pseudo_in_inertial_frame',
          `This scene is set in an inertial (ground) frame, so no pseudo-force exists `
          + `here. A pseudo-force is the price you pay for choosing an accelerating `
          + `frame — it appears only after you make that choice. Which frame are you `
          + `standing in?`,
          { forceId: sf.id }));
      } else {
        issues.push(issue('extra_force',
          `The frame's pseudo-force is already accounted for. There is no second one `
          + `along ${n1(sf.angleDeg)}° — name the object that would apply it.`,
          { forceId: sf.id }));
      }
      continue;
    }

    // (c) Ghost force: an arrow with no nameable agent, and nothing acting that
    //     way. This is "the force of the throw" / "the force of motion".
    const claimed = (sf.claimedFrom ?? '').trim();
    const namedRealAgent = claimed !== '' && knownIds.has(claimed);
    const somethingActsThatWay = truth.some((t) =>
      t.kind !== 'weight' && t.kind !== 'pseudo'
      && angleDiff(t.angleDeg, sf.angleDeg) < 60);
    if (!namedRealAgent && !somethingActsThatWay) {
      issues.push(issue('ghost_motion_force',
        `Name the object applying this force. Nothing is in contact along `
        + `${n1(sf.angleDeg)}° — this force does not exist. Motion doesn't need a `
        + `force to continue; a body already moving keeps moving on its own.`,
        { forceId: sf.id,
          hint: 'Newton\'s first law: a force changes velocity. It is not needed to maintain one.' }));
      continue;
    }

    // (d) Everything else the student invented.
    issues.push(issue('extra_force',
      `Nothing in this scene produces a ${sf.kind === 'unknown' ? 'force' : KIND_WORD[sf.kind]} `
      + `along ${n1(sf.angleDeg)}° on "${bodyId}"`
      + `${claimed ? `, and ${agentWord(claimed)} is not touching or connected to it` : ''}. `
      + `Walk the scene: what is in contact with this body, what is tied to it, and `
      + `what is pulling it from a distance? That list is the whole diagram.`,
      { forceId: sf.id }));
  }

  const correct = issues.every((i) => i.severity !== 'error')
    && missing.length === 0
    && spurious.length === 0;

  return { correct, issues, matched, missing, spurious };
}

/** Exported so a UI can show "what should have been there" beside the issues. */
export function expectedForces(scene: Scene, bodyId: string): TrueForce[] {
  return solvedForcesFor(normalizeScene(scene), bodyId);
}

export { isWorldId };
