/*
 * motion-lab/graphs/lib/grade.ts — Match-the-Motion, graded.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Node-verifiable, which matters more here than
 * anywhere else in the module: a grader that says "correct" to a wrong sketch is
 * worse than no grader, and a grader that says "wrong" to a right one destroys
 * the exercise. Both directions are asserted in `scripts/verify-graphs.mjs`.
 *
 * ── WHY THE DIAGNOSIS IS NOT A PERCENTAGE ───────────────────────────────────
 * The Class-9 `MatchTheMotionSim` already reports a match percentage, and a
 * percentage is exactly the "right/wrong scoring wearing a diagnosis costume"
 * the Phase-1 QA report called out. 87% tells a student nothing they can act on.
 *
 * So this grader returns WHERE and HOW the attempt differs, in the vocabulary of
 * the mistake:
 *   • a constant offset          → "your whole graph sits too high"
 *   • the right shape, mistimed  → "the right moves, in the wrong order"
 *   • a sign error               → "you went the other way"
 *   • one bad phase              → the interval, named
 * and the pass/fail decision is a MAX-ERROR band, not an average, because an
 * average lets a student be badly wrong for one second of ten and still pass.
 */

import { sampleAt, buildSamples, type Sample, type VtModel } from './kinematics';

export type MatchAxis = 'v' | 'x';

export interface MatchReport {
  /** The decision: max |error| within tolerance everywhere. */
  pass: boolean;
  /** Largest absolute error, in the graded quantity's units. */
  maxErr: number;
  /** Time at which the largest error occurs — where to look. */
  worstT: number;
  /** Root-mean-square error, reported but never the pass criterion. */
  rms: number;
  /** Mean signed error. A large one with a small spread is a pure offset. */
  bias: number;
  /** 0…1, for the progress bar only. */
  score: number;
  /** The named diagnosis. */
  fault: MatchFault;
  /** The interval that carries the worst error, when it is localised. */
  window: { t0: number; t1: number } | null;
}

export type MatchFault =
  | 'match'
  /** Right shape, wrong height — a constant offset. */
  | 'offset'
  /** Mirror image — the signs are inverted. */
  | 'sign-flipped'
  /** Right pieces, wrong order or wrong instants. */
  | 'mistimed'
  /** One phase is wrong and the rest is right. */
  | 'one-phase'
  /** Nothing lines up. */
  | 'unrelated';

const EPS = 1e-12;

/** Common time grid. Fine enough that a single-sample spike cannot hide. */
export function gradeGrid(t0: number, t1: number, n = 240): number[] {
  const out: number[] = [];
  const count = Math.max(4, Math.round(n));
  for (let i = 0; i <= count; i++) out.push(t0 + ((t1 - t0) * i) / count);
  return out;
}

const pickOf = (axis: MatchAxis) => (s: Sample): number => (axis === 'v' ? s.v : s.x);

/**
 * Grade an attempt against a target.
 *
 * Both are `VtModel`s, so the comparison happens on the SAME dataset machinery
 * the panels draw — there is no second definition of "what the student's graph
 * says" that could drift from the one on screen.
 */
export function gradeMatch(
  target: VtModel,
  attempt: VtModel,
  tolerance: number,
  axis: MatchAxis = 'v'
): MatchReport {
  const pick = pickOf(axis);
  const t0 = Math.max(target.ts[0], attempt.ts[0]);
  const t1 = Math.min(target.ts[target.ts.length - 1], attempt.ts[attempt.ts.length - 1]);
  const grid = gradeGrid(t0, t1);

  const tgt = buildSamples(target);
  const att = buildSamples(attempt);

  let maxErr = 0;
  let worstT = t0;
  let sumSq = 0;
  let sum = 0;
  let tgtSumSq = 0;
  const errs: { t: number; e: number }[] = [];

  for (const t of grid) {
    const a = pick(sampleAt(att, t));
    const b = pick(sampleAt(tgt, t));
    const e = a - b;
    errs.push({ t, e });
    sum += e;
    sumSq += e * e;
    tgtSumSq += b * b;
    if (Math.abs(e) > maxErr) { maxErr = Math.abs(e); worstT = t; }
  }

  const n = errs.length;
  const rms = Math.sqrt(sumSq / n);
  const bias = sum / n;
  const tol = Math.max(1e-6, tolerance);
  const pass = maxErr <= tol;

  // Score is for the bar only. Clamped RMS against the tolerance so "inside the
  // band everywhere" reads as full marks rather than as 97%.
  const score = pass ? 1 : Math.max(0, 1 - (maxErr - tol) / Math.max(tol, 1e-6) / 3);

  return {
    pass,
    maxErr,
    worstT,
    rms,
    bias,
    score: Math.min(1, score),
    fault: pass ? 'match' : diagnose(errs, tgt, att, pick, tol, bias, rms, tgtSumSq / n),
    window: pass ? null : worstWindow(errs, tol),
  };
}

/**
 * Name the mistake.
 *
 * Order matters: the cheap structural explanations are tested first so a student
 * whose graph is simply 3 m/s too high is told THAT, rather than being told
 * their shape is unrelated because a max-error test happened to be large.
 */
function diagnose(
  errs: { t: number; e: number }[],
  tgt: Sample[],
  att: Sample[],
  pick: (s: Sample) => number,
  tol: number,
  bias: number,
  rms: number,
  targetPower: number
): MatchFault {
  // 1. A pure offset: every error is the same number.
  const spread = Math.sqrt(Math.max(0, rms * rms - bias * bias));
  if (Math.abs(bias) > tol && spread <= tol) return 'offset';

  // 2. Sign flip: the attempt correlates NEGATIVELY with the target, strongly.
  let dot = 0;
  let attPower = 0;
  for (const q of errs) {
    const a = pick(sampleAt(att, q.t));
    const b = pick(sampleAt(tgt, q.t));
    dot += a * b;
    attPower += a * a;
  }
  const norm = Math.sqrt(Math.max(attPower, EPS) * Math.max(targetPower * errs.length, EPS));
  const corr = norm > EPS ? dot / norm : 0;
  if (corr < -0.6) return 'sign-flipped';

  // 3. Mistimed: the two curves have nearly the same SET of values (so the
  //    pieces are right) but not at the same instants. Compared as sorted
  //    samples — a permutation-insensitive test, which is precisely the
  //    question "did they draw the right moves in the wrong order?".
  const sortedA = errs.map((q) => pick(sampleAt(att, q.t))).sort((p, q) => p - q);
  const sortedB = errs.map((q) => pick(sampleAt(tgt, q.t))).sort((p, q) => p - q);
  let sortedMax = 0;
  for (let i = 0; i < sortedA.length; i++) sortedMax = Math.max(sortedMax, Math.abs(sortedA[i] - sortedB[i]));
  if (sortedMax <= tol) return 'mistimed';

  // 4. One bad phase: the error is confined to under a third of the run.
  const bad = errs.filter((q) => Math.abs(q.e) > tol).length;
  if (bad > 0 && bad <= errs.length / 3) return 'one-phase';

  return 'unrelated';
}

/** The contiguous window carrying the worst error, so the UI can shade it. */
function worstWindow(errs: { t: number; e: number }[], tol: number): { t0: number; t1: number } | null {
  let best: { t0: number; t1: number; peak: number } | null = null;
  let run: { t0: number; t1: number; peak: number } | null = null;
  for (const q of errs) {
    if (Math.abs(q.e) > tol) {
      if (!run) run = { t0: q.t, t1: q.t, peak: Math.abs(q.e) };
      else { run.t1 = q.t; run.peak = Math.max(run.peak, Math.abs(q.e)); }
    } else if (run) {
      if (!best || run.peak > best.peak) best = run;
      run = null;
    }
  }
  if (run && (!best || run.peak > best.peak)) best = run;
  return best ? { t0: best.t0, t1: best.t1 } : null;
}

/**
 * The sentence a student reads. Kept beside the grader rather than in the
 * component so the diagnosis and its copy cannot drift apart — the Phase-1
 * failure where `grade.ts` emitted `extra_force` under a heading written for
 * `force_agent_unnamed` came from exactly that separation.
 */
export function faultCopy(r: MatchReport, axis: MatchAxis): { heading: string; body: string } {
  const q = axis === 'v' ? 'velocity' : 'position';
  const u = axis === 'v' ? 'm/s' : 'm';
  const at = `${r.worstT.toFixed(1)} s`;
  switch (r.fault) {
    case 'match':
      return {
        heading: 'Matched.',
        body: `Your ${q} stays inside the band for the whole run — worst gap **${r.maxErr.toFixed(2)} ${u}** at ${at}. Note what that means for the other two panels: they matched as well, and you never touched them.`,
      };
    case 'offset':
      return {
        heading: 'The right shape, at the wrong height.',
        body: `Every instant is out by about **${r.bias.toFixed(2)} ${u}** in the same direction. The shape of your graph is right, so the *changes* are right — it is the starting value that is off. Slide the whole thing ${r.bias > 0 ? 'down' : 'up'}.`,
      };
    case 'sign-flipped':
      return {
        heading: 'You went the other way.',
        body: 'Your graph is the target reflected in the time axis. Above the axis is forward and below it is backward — swapping those does not change the *distance* travelled but it reverses every displacement. Check which side of zero each phase belongs on.',
      };
    case 'mistimed':
      return {
        heading: 'The right moves, in the wrong order.',
        body: `Sort your values and the target's and they agree — so you have built the right phases. They are just not at the right instants; the worst mismatch is at ${at}. Line up where each phase STARTS.`,
      };
    case 'one-phase':
      return {
        heading: 'One phase is wrong; the rest is right.',
        body: `Everything matches except the shaded stretch${r.window ? ` from ${r.window.t0.toFixed(1)} s to ${r.window.t1.toFixed(1)} s` : ''}, where you are out by up to **${r.maxErr.toFixed(2)} ${u}**. Fix that stretch and leave the rest alone.`,
      };
    default:
      return {
        heading: 'Not yet — start from the shape, not the numbers.',
        body: `The largest gap is **${r.maxErr.toFixed(2)} ${u}** at ${at}. Before dragging anything, read the target one phase at a time: is it rising, flat or falling, and is it above or below zero? Get those two answers right for each phase and the numbers follow.`,
      };
  }
}
