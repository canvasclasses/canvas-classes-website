/*
 * nuclear/lib/decay.ts — the decay law, and where it comes from.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Deterministic: the stochastic population is driven by
 * a SEEDED generator, so the same seed gives the same run in the browser and in
 * the verifier. A random walk that cannot be reproduced cannot be checked.
 *
 * ── THE MISCONCEPTION THIS FILE IS BUILT AROUND ─────────────────────────────
 * "Half-life means half the time until it is all gone." Two half-lives would
 * then finish the job. It does not: after two half-lives a QUARTER is left,
 * after three an eighth, and there is no n for which the answer is zero. The
 * exercise puts (1/2)ⁿ on screen for n = 1…6 next to the student's own count.
 *
 * ── WHY A STOCHASTIC POPULATION SITS BESIDE THE SMOOTH CURVE ────────────────
 * The exponential is not a law imposed on the nuclei. It is what you get when
 * every nucleus independently has the same probability λ·dt of decaying in the
 * next instant and nothing remembers how long it has waited. Simulating that
 * one rule on 400 nuclei and watching the count land on the curve — noisily at
 * first, then convincingly — is the difference between deriving the law and
 * being handed it. So this file provides BOTH and never draws one without the
 * other.
 *
 *      λ = ln2 / t½          (the decay constant)
 *      N(t) = N₀ e^(−λt)     (the law)
 *      A(t) = λ N(t)         (activity — what a Geiger counter reads)
 *      τ = 1/λ = t½/ln2      (mean lifetime, ~1.44 × the half-life)
 *
 * Every one of those four is asserted in `scripts/verify-modern-physics.mjs`,
 * including the fact that after exactly n half-lives the survivor fraction is
 * exactly 2^−n to floating-point precision.
 */

import { AVOGADRO, BQ_PER_CURIE, LN2 } from './constants';
import { type Nuclide, nuclide } from './nuclides';

/** λ = ln2/t½, per second. */
export const decayConstant = (halfLifeSeconds: number): number => LN2 / halfLifeSeconds;

/** t½ = ln2/λ, seconds. The inverse, so a lab that measures λ can quote t½. */
export const halfLifeFrom = (lambda: number): number => LN2 / lambda;

/** Mean lifetime τ = 1/λ. Longer than the half-life by 1/ln2 ≈ 1.4427 — a
 *  distinction JEE asks about directly. */
export const meanLifetime = (halfLifeSeconds: number): number => halfLifeSeconds / LN2;

/** N(t) = N₀ e^(−λt). */
export const survivors = (n0: number, halfLifeSeconds: number, t: number): number =>
  n0 * Math.exp(-decayConstant(halfLifeSeconds) * t);

/** The fraction left after `n` half-lives — exactly 2^−n, for any real n. */
export const fractionAfterHalfLives = (n: number): number => Math.pow(0.5, n);

/** Activity A = λN, in becquerels (decays per second). */
export const activity = (n: number, halfLifeSeconds: number): number =>
  decayConstant(halfLifeSeconds) * n;

export const toCuries = (bq: number): number => bq / BQ_PER_CURIE;

/**
 * How many nuclei are in a sample of a given mass.
 *
 * Uses the mass number as grams per mole, which is right to about 0.01% — the
 * molar mass of ¹³⁷Cs is 136.907 g/mol, not 137. The bench never quotes a
 * population past three significant figures, so the approximation is invisible;
 * it is flagged here rather than left for someone to discover.
 */
export const populationOf = (grams: number, massNumber: number): number =>
  (grams / massNumber) * AVOGADRO;

/**
 * Half-lives elapsed to reach a given remaining fraction.
 *
 *      n = −log₂(f)
 *
 * The dating equation, which is the same law read backwards: a sample with 25%
 * of its carbon-14 left is two half-lives — 11 400 years — old.
 */
export const halfLivesElapsed = (fraction: number): number =>
  fraction > 0 ? -Math.log2(fraction) : Number.POSITIVE_INFINITY;

/** Age from a measured remaining fraction, seconds. */
export const ageFromFraction = (fraction: number, halfLifeSeconds: number): number =>
  halfLivesElapsed(fraction) * halfLifeSeconds;

// ── The smooth curve ─────────────────────────────────────────────────────────

export interface DecayPoint {
  /** Time in HALF-LIVES, not seconds — the x-axis that makes the law universal.
   *  Plotted in half-lives, carbon-14 and iodine-131 give the identical curve,
   *  which is the point. */
  halfLives: number;
  /** N(t), same units as n0. */
  remaining: number;
  /** A(t) = λN, in units of the initial activity, so the two curves can share
   *  one axis and be seen to be the SAME shape. */
  activityFraction: number;
}

/** The exponential, sampled for drawing. */
export function decayCurve(n0: number, span = 6, steps = 240): DecayPoint[] {
  const out: DecayPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const hl = (span * i) / steps;
    const f = fractionAfterHalfLives(hl);
    out.push({ halfLives: hl, remaining: n0 * f, activityFraction: f });
  }
  return out;
}

// ── The stochastic population ────────────────────────────────────────────────

/**
 * Seeded 32-bit generator (mulberry32). Copied deliberately rather than
 * imported from `simulations/_shared/mulberry32`: that module is a client
 * bundle entry point and this file must stay importable by a plain node script
 * with no React in the graph. Nine lines is a cheaper price than a pure module
 * that cannot be verified.
 */
function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = a;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export interface StochasticStep {
  /** Time in half-lives at the END of this step. */
  halfLives: number;
  /** How many are still undecayed. An integer — these are individual nuclei. */
  alive: number;
  /** How many decayed DURING this step. This is what a counter clicks on, and
   *  it is visibly noisy while the smooth curve beside it is not. */
  decayedThisStep: number;
  /** The smooth law's prediction at the same instant, for comparison. */
  predicted: number;
}

export interface StochasticRun {
  /** Which nucleus in the grid is still alive, in creation order — so a view can
   *  draw a fixed grid of dots and flip them off one by one. */
  aliveMask: boolean[];
  steps: StochasticStep[];
  n0: number;
  seed: number;
  /** Half-lives covered. */
  span: number;
}

/**
 * Simulate `n0` independent nuclei over `span` half-lives.
 *
 * ONE rule is applied and nothing else: in a time step dt each surviving
 * nucleus decays with probability 1 − e^(−λ·dt), independently of every other
 * nucleus and of how long it has already survived. The exponential is never
 * used to decide anything — it is only carried alongside as `predicted`, so the
 * agreement is an OBSERVATION rather than a construction.
 *
 * `stepsPerHalfLife` at 8 gives a per-step decay probability of 8.3%, small
 * enough that the discrete-time approximation is not what produces the shape
 * (the exact per-step probability is used, so it is not an approximation at all
 * — only the resolution of the recording is discrete).
 */
export function simulateDecay(
  n0: number,
  span = 6,
  seed = 20260730,
  stepsPerHalfLife = 8,
): StochasticRun {
  const rand = mulberry(seed);
  const alive = new Array<boolean>(n0).fill(true);
  const dtInHalfLives = 1 / stepsPerHalfLife;
  // Exact probability of decaying within one step: 1 − e^(−λ dt), with λ dt
  // expressed in half-lives as ln2 × dt.
  const pStep = 1 - Math.exp(-LN2 * dtInHalfLives);

  const steps: StochasticStep[] = [{
    halfLives: 0, alive: n0, decayedThisStep: 0, predicted: n0,
  }];

  const total = Math.round(span * stepsPerHalfLife);
  for (let s = 1; s <= total; s++) {
    let decayed = 0;
    for (let i = 0; i < n0; i++) {
      if (!alive[i]) continue;
      if (rand() < pStep) { alive[i] = false; decayed++; }
    }
    const hl = s * dtInHalfLives;
    steps.push({
      halfLives: hl,
      alive: alive.reduce((c, a) => c + (a ? 1 : 0), 0),
      decayedThisStep: decayed,
      predicted: n0 * fractionAfterHalfLives(hl),
    });
  }

  return { aliveMask: alive, steps, n0, seed, span };
}

/**
 * How far the simulated count strayed from the law, as a fraction of √N.
 *
 * √N is the standard deviation of a Poisson count, so a well-behaved run sits
 * within a couple of √N of the curve at every point. This is the honest way to
 * ask "did the simulation follow the law?" — an absolute tolerance would either
 * pass a broken generator at large N or fail a correct one at small N. The
 * verifier asserts the worst deviation across a run is under 4√N, which a
 * correct simulation clears comfortably and a biased generator does not.
 */
export function worstDeviationInSigmas(run: StochasticRun): number {
  let worst = 0;
  for (const s of run.steps) {
    const sigma = Math.sqrt(Math.max(s.predicted, 1));
    worst = Math.max(worst, Math.abs(s.alive - s.predicted) / sigma);
  }
  return worst;
}

/** The half-life the run itself implies — the step at which the count first
 *  reaches half. Measured from the simulation, so the student can compare their
 *  own noisy measurement against the tabulated value. */
export function measuredHalfLife(run: StochasticRun): number | null {
  const target = run.n0 / 2;
  for (const s of run.steps) if (s.alive <= target) return s.halfLives;
  return null;
}

// ── A whole sample, in real units ────────────────────────────────────────────

export interface SampleState {
  nuclide: Nuclide;
  halfLifeSeconds: number;
  lambda: number;
  /** Mean lifetime, seconds. */
  tau: number;
  grams: number;
  n0: number;
  /** Elapsed time in half-lives, which is how the exercise is parameterised. */
  elapsedHalfLives: number;
  remaining: number;
  fractionRemaining: number;
  activityBq: number;
  initialActivityBq: number;
  activityCi: number;
}

/**
 * The full state of a real sample at a real time.
 *
 * Throws for a stable nuclide rather than dividing by an absent half-life —
 * "the activity of a stable sample" is not a small number, it is not a
 * question, and returning 0 would let a UI display a plausible-looking zero
 * where an author has made a mistake.
 */
export function sampleState(
  id: string,
  grams: number,
  elapsedHalfLives: number,
): SampleState {
  const nuc = nuclide(id);
  if (nuc.halfLife == null) {
    throw new Error(
      `nuclear: ${id} is stable, so it has no half-life and no activity. `
      + 'Pick a nuclide from RADIOACTIVE for a decay exercise.',
    );
  }
  const lambda = decayConstant(nuc.halfLife);
  const n0 = populationOf(grams, nuc.A);
  const fraction = fractionAfterHalfLives(elapsedHalfLives);
  const remaining = n0 * fraction;
  return {
    nuclide: nuc,
    halfLifeSeconds: nuc.halfLife,
    lambda,
    tau: meanLifetime(nuc.halfLife),
    grams,
    n0,
    elapsedHalfLives,
    remaining,
    fractionRemaining: fraction,
    activityBq: lambda * remaining,
    initialActivityBq: lambda * n0,
    activityCi: toCuries(lambda * remaining),
  };
}
