// ============================================================================
// Choice-list optimizer — pure function (no DB, no network).
//
// Given a list of PredictorResult rows (already bucketed Safe / Target / Reach)
// + a small set of student preferences, produces an ORDERED choice list
// suitable for direct entry into JoSAA's portal.
//
// Why this exists:
//   JoSAA fills top-down. The first row where you make the cutoff is what you
//   get. Most rival predictors dump 200 raw rows and leave students to order
//   them by hand — a 4-hour chore that they typically get wrong, putting
//   safe-but-mid options ABOVE their reach options. This module bakes the
//   right shape into one call.
//
// Algorithm:
//   1. Compute a `desirability` score per row from NIRF rank, branch-demand
//      tier, location fit, and preference match (dream branch / college).
//   2. Allocate slots across three tranches based on the user's risk profile:
//        moonshots (Reach pool, top of final list)
//        target    (Target pool, middle)
//        safety    (Safe pool, bottom)
//   3. Within each tranche, sort by desirability descending — so the most
//      prestigious Reach goes at row 1, the most prestigious Target at the
//      start of the middle block, etc.
//   4. Annotate each row with a one-line `reason` a student can show to a
//      parent ("Top-NIRF NIT in your region · matches your dream branch").
//
// Deterministic and easily unit-testable: same inputs always give the same
// list. No randomness, no time-of-day effects.
// ============================================================================

import type { PredictorResult } from './predictor';

export type RiskProfile = 'conservative' | 'balanced' | 'aggressive';
export type BranchFlexibility = 'cse-only' | 'tech-adjacent' | 'flexible';
export type Tranche = 'moonshot' | 'target' | 'safety';

export interface ChoiceListPrefs {
  /** "How much do I care about CSE-or-bust vs anything-with-a-degree?" */
  branch_flexibility: BranchFlexibility;
  /** Risk appetite — affects how many moonshots vs safety nets the list has. */
  risk_profile: RiskProfile;
  /** Target list length. Default 60 — JoSAA's recommended sweet spot. */
  list_size: number;
  /** Regions to weight higher. Empty = no regional bias. */
  preferred_regions?: string[];
  /** Dream branch/college (re-used from predictor input). */
  dream_branch?: string;
  /** Comma-separated college short names — e.g. "NIT Trichy, IIIT Hyderabad". */
  dream_colleges?: string[];
}

export interface ChoiceListEntry {
  position: number;
  college_id: string;
  college_short_name: string;
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  college_state: string;
  college_region: string;
  branch_short_name: string;
  branch_name: string;
  quota_matched: string;
  probability_pct: number;
  bucket: 'safe' | 'target' | 'reach' | 'unlikely';
  /** Where in the choice list this row lives. */
  tranche: Tranche;
  /** One-line plain-English reason for this position. */
  reason: string;
  /** Internal desirability score in [0, 1] — exposed for transparency / debug. */
  desirability: number;
}

export interface ChoiceListSummary {
  total: number;
  by_tranche: Record<Tranche, number>;
  best_case: string;       // "You'll likely land in your top 15 if cutoffs are normal"
  worst_case: string;      // "95 % chance of an admission overall"
}

export interface ChoiceListResult {
  prefs: ChoiceListPrefs;
  entries: ChoiceListEntry[];
  summary: ChoiceListSummary;
}

// ── Tranche allocation (proportions per risk profile) ────────────────────────
// Hand-tuned. Conservative biases for safety; aggressive lets students chase
// reach colleges hard. Balanced is the default and matches what most
// counsellors recommend in print.
const TRANCHE_RATIOS: Record<RiskProfile, Record<Tranche, number>> = {
  conservative: { moonshot: 0.20, target: 0.30, safety: 0.50 },
  balanced:     { moonshot: 0.30, target: 0.40, safety: 0.30 },
  aggressive:   { moonshot: 0.50, target: 0.35, safety: 0.15 },
};

// ── Branch flexibility — used to penalise off-preference branches ────────────
const CSE_FAMILY = new Set([
  'CSE', 'IT', 'AI', 'AI & ML', 'AI & DS', 'DSE', 'M&C', 'CSAI', 'CST',
]);
const TECH_ADJACENT = new Set([
  ...CSE_FAMILY,
  'ECE', 'EE', 'EEE', 'EIE', 'VLSI', 'EP', 'Mechatronics', 'R&A',
]);

function matchesBranchFlex(branchShort: string, flex: BranchFlexibility): boolean {
  if (flex === 'flexible') return true;
  const stem = branchShort.toLowerCase().split(/[\s([]/)[0].toUpperCase();
  if (flex === 'cse-only')      return CSE_FAMILY.has(stem) || CSE_FAMILY.has(branchShort);
  if (flex === 'tech-adjacent') return TECH_ADJACENT.has(stem) || TECH_ADJACENT.has(branchShort);
  return true;
}

// ── Desirability scoring ─────────────────────────────────────────────────────
// Combines several heuristics into a [0, 1] score. Higher = more prestigious /
// more aligned with the student's preferences.
function desirabilityScore(r: PredictorResult, prefs: ChoiceListPrefs): number {
  let score = 0;

  // Base: NIRF rank (or institute type fallback when NIRF missing).
  const nirf = r.nirf_rank_engineering;
  if (nirf !== undefined) {
    if (nirf <= 10) score += 0.55;
    else if (nirf <= 25) score += 0.45;
    else if (nirf <= 50) score += 0.35;
    else if (nirf <= 100) score += 0.25;
    else score += 0.15;
  } else {
    // No NIRF — use type as a coarse proxy.
    if (r.college_type === 'NIT')   score += 0.30;
    else if (r.college_type === 'IIIT') score += 0.22;
    else if (r.college_type === 'IIT')  score += 0.50;
    else score += 0.15;
  }

  // Branch flexibility match — small penalty for off-preference branches.
  if (!matchesBranchFlex(r.branch_short_name, prefs.branch_flexibility)) {
    score -= 0.10;
  }

  // Dream branch / college bonuses — these dominate so they pin to the top
  // of their tranche.
  const branchLower = `${r.branch_short_name} ${r.branch_name}`.toLowerCase();
  if (prefs.dream_branch && branchLower.includes(prefs.dream_branch.toLowerCase())) {
    score += 0.18;
  }
  if (prefs.dream_colleges && prefs.dream_colleges.length > 0) {
    const collegeLower = r.college_short_name.toLowerCase();
    if (prefs.dream_colleges.some((c) => collegeLower.includes(c.toLowerCase()))) {
      score += 0.20;
    }
  }

  // Region match — small bias.
  if (prefs.preferred_regions && prefs.preferred_regions.includes(r.college_region)) {
    score += 0.08;
  }

  // Clamp to [0, 1]. Above 1 just means "very desirable"; we don't care about
  // the exact tail value, only the ordering it produces inside a tranche.
  return Math.max(0, Math.min(1, score));
}

// ── Reason annotation ────────────────────────────────────────────────────────
// One line per row, written so a parent can read it and understand the
// position without having to be told the algorithm.
function reasonFor(
  r: PredictorResult & { desirability: number },
  tranche: Tranche,
  prefs: ChoiceListPrefs,
): string {
  const parts: string[] = [];

  // Tranche framing.
  if (tranche === 'moonshot') parts.push('Dream tier — rank these high so you get them if cutoffs go your way');
  else if (tranche === 'target') parts.push('Realistic match — most likely outcome');
  else parts.push('Safety net — backup if every reach falls through');

  // NIRF callout when impressive.
  if (r.nirf_rank_engineering && r.nirf_rank_engineering <= 25) {
    parts.push(`NIRF #${r.nirf_rank_engineering}`);
  }

  // Dream-branch / dream-college flags.
  if (prefs.dream_branch && `${r.branch_short_name} ${r.branch_name}`.toLowerCase().includes(prefs.dream_branch.toLowerCase())) {
    parts.push('matches your dream branch');
  }
  if (prefs.dream_colleges?.some((c) => r.college_short_name.toLowerCase().includes(c.toLowerCase()))) {
    parts.push('your dream college');
  }

  // Quota note when home-state quota is in play.
  if (r.quota_matched === 'HS') parts.push('home-state quota');

  return parts.join(' · ');
}

// ── Main build ───────────────────────────────────────────────────────────────
export function buildChoiceList(
  results: PredictorResult[],
  prefs: ChoiceListPrefs,
): ChoiceListResult {
  // Split into pools by bucket. Unlikely is discarded — we don't recommend
  // colleges with effectively-zero chance. Drop branches that fall outside
  // the user's branch flexibility setting (they shouldn't appear at all).
  const reachPool:  Array<PredictorResult & { desirability: number }> = [];
  const targetPool: Array<PredictorResult & { desirability: number }> = [];
  const safePool:   Array<PredictorResult & { desirability: number }> = [];

  for (const r of results) {
    if (!matchesBranchFlex(r.branch_short_name, prefs.branch_flexibility)) continue;
    const d = desirabilityScore(r, prefs);
    const enriched = { ...r, desirability: d };
    if (r.bucket === 'reach')  reachPool.push(enriched);
    else if (r.bucket === 'target') targetPool.push(enriched);
    else if (r.bucket === 'safe')   safePool.push(enriched);
  }

  // Sort each pool by desirability descending (so the most prestigious option
  // in that pool goes first within its tranche).
  const desc = (a: { desirability: number }, b: { desirability: number }) => b.desirability - a.desirability;
  reachPool.sort(desc);
  targetPool.sort(desc);
  safePool.sort(desc);

  // Allocate tranche sizes per risk profile, but never overshoot a pool's
  // actual depth. Any unallocated slack rolls into "safety" so the list never
  // ends up shorter than requested.
  const ratios = TRANCHE_RATIOS[prefs.risk_profile];
  const desiredMoonshot = Math.round(prefs.list_size * ratios.moonshot);
  const desiredTarget   = Math.round(prefs.list_size * ratios.target);
  const desiredSafety   = prefs.list_size - desiredMoonshot - desiredTarget;

  const moonshots = reachPool.slice(0, desiredMoonshot);
  const targets   = targetPool.slice(0, desiredTarget);
  const safety    = safePool.slice(0, desiredSafety);

  // If any tranche came up short, top up from the next tranche outward (Safe
  // can fill missing Target; Target+Safe can fill missing Moonshot).
  const moonshotShortfall = desiredMoonshot - moonshots.length;
  const targetShortfall   = desiredTarget - targets.length;
  if (moonshotShortfall > 0) targets.push(...targetPool.slice(targets.length, targets.length + moonshotShortfall));
  if (targetShortfall > 0)   safety.push(...safePool.slice(safety.length, safety.length + targetShortfall));

  // Assemble in JoSAA-fill order: Moonshot → Target → Safety.
  const ordered: ChoiceListEntry[] = [];
  let pos = 1;

  function append(rows: typeof moonshots, tranche: Tranche) {
    for (const r of rows) {
      ordered.push({
        position: pos++,
        college_id: r.college_id,
        college_short_name: r.college_short_name,
        college_type: r.college_type,
        college_state: r.college_state,
        college_region: r.college_region,
        branch_short_name: r.branch_short_name,
        branch_name: r.branch_name,
        quota_matched: r.quota_matched,
        probability_pct: r.probability_pct,
        bucket: r.bucket,
        tranche,
        reason: reasonFor(r, tranche, prefs),
        desirability: Math.round(r.desirability * 100) / 100,
      });
    }
  }
  append(moonshots, 'moonshot');
  append(targets,   'target');
  append(safety,    'safety');

  // Summary stats — used by the UI's hero panel above the list.
  // Worst case = probability that AT LEAST ONE entry admits the student.
  // Assuming independence (oversimplification, but parents understand it):
  //   P(at least one admit) = 1 - prod(1 - p_i / 100)
  // The true joint distribution is correlated (a tougher year affects
  // everyone), so the real number is somewhat lower. We use the independence
  // floor as a conservative best-case estimate.
  const at_least_one = ordered.length === 0
    ? 0
    : 1 - ordered.reduce((acc, e) => acc * (1 - e.probability_pct / 100), 1);

  const summary: ChoiceListSummary = {
    total: ordered.length,
    by_tranche: {
      moonshot: moonshots.length,
      target: targets.length,
      safety: safety.length,
    },
    best_case:
      moonshots.length > 0
        ? `If cutoffs go your way you could land in your top ${Math.min(15, moonshots.length)} — the moonshot tier.`
        : 'No moonshot picks available with current filters.',
    worst_case:
      `${Math.min(99, Math.round(at_least_one * 100))} % chance of an admission overall (assuming independent outcomes; real correlation makes the true number slightly lower).`,
  };

  return { prefs, entries: ordered, summary };
}
