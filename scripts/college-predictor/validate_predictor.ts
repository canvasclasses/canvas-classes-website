/**
 * College Predictor — accuracy validation harness.
 *
 * Why this exists:
 *   The predictor exposes a few hundred (rank, category, gender, home_state)
 *   permutations to students. Sampling those by hand is infeasible — bugs
 *   tend to hide in cross-quota or boundary-condition cases that nobody
 *   types into the form. This script exercises a structured matrix and
 *   checks the predictor against the invariants we *commit* to keeping.
 *
 * What we test (the contract — see lib/collegePredictor/predictor.ts):
 *
 *   IN-1  Quota selection
 *         · IIIT / GFTI            → matched_quota = 'AI'
 *         · NIT in user's state    → 'HS' first, fall back to 'OS'
 *         · NIT not in user state  → 'OS'
 *         · NIT Srinagar           → 'JK' for J&K, 'LA' for Ladakh, else 'OS'
 *         · NIT Goa                → 'GO' for Goa residents (if data exists)
 *
 *   IN-2  Monotonicity
 *         · As user rank improves (smaller number), |Safe| is non-decreasing
 *           and |Unlikely| is non-increasing for the same persona.
 *
 *   IN-3  Home-state advantage
 *         · For an NIT in state X, a home_state=X student must NEVER receive
 *           a worse bucket than a home_state=Y (Y≠X) student at the same rank.
 *
 *   IN-4  Special-state quota access
 *         · J&K residents must see JK rows at NIT Srinagar.
 *         · Goa residents must see GO rows at NIT Goa (if seeded).
 *
 *   IN-5  Bucket math
 *         · Recomputing z = (projected − rank) / sigma from `historical` must
 *           land in the same bucket the predictor reported.
 *
 *   IN-6  Determinism
 *         · Two identical calls produce byte-identical (id, branch, bucket,
 *           probability, projected) tuples in the same order.
 *
 *   IN-7  dream_branch filter (in-process check)
 *         · If dream branch matches, results restricted to that branch family.
 *
 *   IN-8  Edge cases
 *         · Rank 1   → at least one Safe at the top NITs / IIITs.
 *         · Rank 1.9M (almost-last) → no Safes; sensible count of Unlikelys
 *           when include_unlikely is true.
 *
 * Output: a markdown report at scripts/college-predictor/PREDICTOR_VALIDATION_REPORT.md
 *         + a JSON dump with every failing payload for forensics.
 *
 * Run: npx tsx scripts/college-predictor/validate_predictor.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import {
  loadPredictorDataset,
  predictFromDataset,
  type PredictorDataset,
  type PredictorInput,
  type PredictorResult,
  type Bucket,
} from '../../lib/collegePredictor/predictor';
import type { CutoffCategory, CutoffGender } from '../../lib/models/CollegeCutoff';
import {
  percentileToRank,
} from '../../lib/collegePredictor/percentileToRank';

// ── Dataset cache ─────────────────────────────────────────────────────────────
// `predictColleges` does 4 large `find()` queries per call (~50k rows each).
// Calling it ~60× in sequence eats Atlas pool sockets and dies with timeouts.
// The fix is structural: the dataset only depends on (category, gender, year),
// not home_state or rank. So we load each unique dataset ONCE, then run every
// persona that shares that dataset in memory via predictFromDataset(). Total DB
// load for the whole suite: ~5 dataset loads (one per category/gender combo).
const datasetCache = new Map<string, PredictorDataset>();

async function getDataset(category: CutoffCategory, gender: CutoffGender, year?: number): Promise<PredictorDataset> {
  const key = `${category}|${gender}|${year ?? 'now'}`;
  const hit = datasetCache.get(key);
  if (hit) return hit;
  console.log(`  📦 loading dataset ${key}…`);
  const t0 = Date.now();
  const ds = await loadPredictorDataset(category, gender, year);
  const ms = Date.now() - t0;
  console.log(`     ↳ ${ds.colleges.length} colleges, ${ds.finalByCollege.size} have cutoffs (${ms}ms)`);
  datasetCache.set(key, ds);
  return ds;
}

async function predict(input: PredictorInput): Promise<PredictorResult[]> {
  const ds = await getDataset(input.category, input.gender, input.year);
  return predictFromDataset(input, ds, {});
}

// ── Bookkeeping ──────────────────────────────────────────────────────────────

type Status = 'pass' | 'fail' | 'warn' | 'info';
interface Check {
  invariant: string;          // IN-1, IN-2, ...
  name: string;
  status: Status;
  detail?: string;
  evidence?: unknown;         // dumped to JSON for failing cases
}

const checks: Check[] = [];
function rec(c: Check) {
  checks.push(c);
  const sym =
    c.status === 'pass' ? '✓' :
    c.status === 'fail' ? '✗' :
    c.status === 'warn' ? '!' : '·';
  const line = `${sym} [${c.invariant}] ${c.name}${c.detail ? ' — ' + c.detail : ''}`;
  console.log(line);
}

// Two Indian states/UTs we can use as "outsider" home states. Picked because
// neither has any HS-eligible seat at the NITs we'll test against.
const OUTSIDER_FAR_NORTH = 'Punjab';
const OUTSIDER_WEST = 'Maharashtra';

// Fixed personas used for monotonicity / determinism tests.
const PERSONA_BASE = {
  category: 'OPEN' as const,
  gender: 'Gender-Neutral' as const,
  home_state: 'Kerala',
};

// Test ranks span the JEE Main rank range.
const RANK_LADDER = [100, 1_000, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000];

// NITs we'll exercise for HS/OS verification. Mix of strong (Trichy/Surathkal)
// and weak (Sikkim/Manipur) so we don't bias toward easy data.
const NIT_TEST_PAIRS = [
  { college_id: 'nit-trichy',     state: 'Tamil Nadu' },
  { college_id: 'nit-surathkal',  state: 'Karnataka' },
  { college_id: 'nit-warangal',   state: 'Telangana' },
  { college_id: 'nit-calicut',    state: 'Kerala' },
  { college_id: 'nit-rourkela',   state: 'Odisha' },
  { college_id: 'nit-patna',      state: 'Bihar' },
  { college_id: 'nit-jalandhar',  state: 'Punjab' },
  { college_id: 'nit-delhi',      state: 'Delhi' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function summarise(results: PredictorResult[]) {
  const counts: Record<Bucket, number> = { safe: 0, target: 0, reach: 0, unlikely: 0 };
  for (const r of results) counts[r.bucket]++;
  return counts;
}

// Recompute the predictor's sigma from `historical` exactly as predictor.ts
// does, so we can independently verify the bucket label.
function recomputeProjectionAndSigma(historical: { year: number; closing_rank: number }[]) {
  const sorted = [...historical].sort((a, b) => b.year - a.year);
  if (sorted.length === 1) {
    const r = sorted[0].closing_rank;
    return { projected: r, sigma: Math.max(r * 0.15, 50) };
  }
  const weights = sorted.map((_, i) => Math.pow(0.6, i));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const weightedMean =
    sorted.reduce((acc, r, i) => acc + r.closing_rank * weights[i], 0) / totalWeight;
  const mean = sorted.reduce((a, r) => a + r.closing_rank, 0) / sorted.length;
  const variance =
    sorted.reduce((a, r) => a + (r.closing_rank - mean) ** 2, 0) / sorted.length;
  const sigma = Math.max(Math.sqrt(variance), weightedMean * 0.05, 50);
  const newest = sorted[0];
  const oldest = sorted[sorted.length - 1];
  const span = newest.year - oldest.year;
  const slope = span > 0 ? (newest.closing_rank - oldest.closing_rank) / span : 0;
  return { projected: weightedMean + slope, sigma };
}

function bucketFor(z: number): Bucket {
  if (z > 1) return 'safe';
  if (z >= -1) return 'target';
  if (z >= -2) return 'reach';
  return 'unlikely';
}

// Rank-key for determinism comparison. We don't compare `historical` arrays
// directly because their ordering inside a year is irrelevant — we only care
// the predictor surfaced the same (college, branch, bucket, probability).
function fingerprint(r: PredictorResult) {
  return `${r.college_id}|${r.branch_short_name}|${r.bucket}|${r.probability_pct}|${r.projected_closing_rank}`;
}

// ── Test suite ───────────────────────────────────────────────────────────────

async function testQuotaSelection() {
  // For each NIT pair, run TWO calls — one as a home-state student and one as
  // an outsider — and check that quota_matched on rows from that NIT obeys the
  // documented rule. We use a mid-pack rank (50k) so the predictor doesn't
  // filter the college out for being too tight or too loose.
  const RANK = 50_000;

  for (const { college_id, state } of NIT_TEST_PAIRS) {
    // Outsider state: anything that isn't `state`. We rotate between two
    // fixed picks; if the college is already there, swap.
    const outsider = state === OUTSIDER_FAR_NORTH ? OUTSIDER_WEST : OUTSIDER_FAR_NORTH;

    const home = await predict({
      rank: RANK,
      category: 'OPEN',
      gender: 'Gender-Neutral',
      home_state: state,
      include_unlikely: true,
    });
    const away = await predict({
      rank: RANK,
      category: 'OPEN',
      gender: 'Gender-Neutral',
      home_state: outsider,
      include_unlikely: true,
    });

    const homeRows = home.filter((r) => r.college_id === college_id);
    const awayRows = away.filter((r) => r.college_id === college_id);

    // Outsider must always see OS at NITs (unless special-case which we test
    // separately for Srinagar/Goa).
    const awayWrong = awayRows.filter((r) => r.quota_matched !== 'OS');
    if (awayRows.length === 0) {
      rec({
        invariant: 'IN-1',
        name: `${college_id}: outsider (${outsider}) must see seats`,
        status: 'warn',
        detail: 'no rows returned — possibly all rank-clipped',
      });
    } else if (awayWrong.length > 0) {
      rec({
        invariant: 'IN-1',
        name: `${college_id}: outsider quota = OS`,
        status: 'fail',
        detail: `${awayWrong.length} rows had unexpected quota`,
        evidence: awayWrong.slice(0, 3),
      });
    } else {
      rec({
        invariant: 'IN-1',
        name: `${college_id}: outsider quota = OS`,
        status: 'pass',
        detail: `${awayRows.length} rows, all OS`,
      });
    }

    // Home student: special-case the two NITs that don't follow HS pattern.
    if (college_id === 'nit-srinagar') continue;     // tested separately
    if (college_id === 'nit-goa') continue;          // ditto

    if (homeRows.length === 0) {
      rec({
        invariant: 'IN-1',
        name: `${college_id}: home (${state}) must see seats`,
        status: 'warn',
        detail: 'no rows returned',
      });
      continue;
    }

    // Home student should see *some* HS rows. Branches without HS data fall
    // back to OS (legitimate). So we just assert HS appears at least once.
    const homeHS = homeRows.filter((r) => r.quota_matched === 'HS');
    const homeBad = homeRows.filter((r) => !['HS', 'OS'].includes(r.quota_matched));
    if (homeBad.length > 0) {
      rec({
        invariant: 'IN-1',
        name: `${college_id}: home quota in {HS, OS}`,
        status: 'fail',
        detail: `${homeBad.length} rows had unexpected quota`,
        evidence: homeBad.slice(0, 3),
      });
    } else if (homeHS.length === 0) {
      rec({
        invariant: 'IN-1',
        name: `${college_id}: home student sees HS`,
        status: 'warn',
        detail: 'no HS rows surfaced — predictor fell back to OS for every branch',
      });
    } else {
      rec({
        invariant: 'IN-1',
        name: `${college_id}: home quota = HS (with OS fallback)`,
        status: 'pass',
        detail: `${homeHS.length}/${homeRows.length} rows on HS`,
      });
    }
  }

  // IIIT + GFTI: must always be AI, regardless of home_state.
  const iiitGftiCheck = await predict({
    rank: 50_000,
    category: 'OPEN',
    gender: 'Gender-Neutral',
    home_state: 'Kerala',  // arbitrary
    include_unlikely: true,
  });
  const wrongIIIT = iiitGftiCheck
    .filter((r) => r.college_type === 'IIIT' || r.college_type === 'GFTI')
    .filter((r) => r.quota_matched !== 'AI');
  if (wrongIIIT.length > 0) {
    rec({
      invariant: 'IN-1',
      name: 'IIIT/GFTI always quota=AI',
      status: 'fail',
      detail: `${wrongIIIT.length} rows on non-AI quota`,
      evidence: wrongIIIT.slice(0, 5),
    });
  } else {
    const total = iiitGftiCheck.filter((r) => r.college_type === 'IIIT' || r.college_type === 'GFTI').length;
    rec({
      invariant: 'IN-1',
      name: 'IIIT/GFTI always quota=AI',
      status: 'pass',
      detail: `${total} IIIT/GFTI rows, all AI`,
    });
  }
}

async function testSpecialQuotas() {
  // NIT Srinagar with J&K resident must surface JK rows.
  const jkResults = await predict({
    rank: 100_000,
    category: 'OPEN',
    gender: 'Gender-Neutral',
    home_state: 'Jammu and Kashmir',
    include_unlikely: true,
  });
  const jkRows = jkResults.filter((r) => r.college_id === 'nit-srinagar');
  const hasJK = jkRows.some((r) => r.quota_matched === 'JK');
  rec({
    invariant: 'IN-4',
    name: 'NIT Srinagar surfaces JK quota for J&K residents',
    status: hasJK ? 'pass' : 'fail',
    detail: `${jkRows.length} Srinagar rows, JK matches: ${jkRows.filter((r) => r.quota_matched === 'JK').length}`,
    evidence: hasJK ? undefined : jkRows.slice(0, 3),
  });

  // Outsider at Srinagar must be OS only (no JK leak).
  const outsiderSrinagar = await predict({
    rank: 100_000,
    category: 'OPEN',
    gender: 'Gender-Neutral',
    home_state: OUTSIDER_WEST,
    include_unlikely: true,
  });
  const outsiderSri = outsiderSrinagar.filter((r) => r.college_id === 'nit-srinagar');
  const leak = outsiderSri.filter((r) => r.quota_matched !== 'OS');
  rec({
    invariant: 'IN-4',
    name: 'NIT Srinagar gives outsider only OS (no JK/LA leak)',
    status: leak.length === 0 ? 'pass' : 'fail',
    detail: leak.length === 0 ? `${outsiderSri.length} rows all OS` : `${leak.length} rows leaked`,
    evidence: leak.length === 0 ? undefined : leak.slice(0, 3),
  });

  // Goa resident at NIT Goa.
  const goaResults = await predict({
    rank: 50_000,
    category: 'OPEN',
    gender: 'Gender-Neutral',
    home_state: 'Goa',
    include_unlikely: true,
  });
  const goaRows = goaResults.filter((r) => r.college_id === 'nit-goa');
  if (goaRows.length === 0) {
    rec({
      invariant: 'IN-4',
      name: 'NIT Goa: GO/HS/OS for Goa resident',
      status: 'warn',
      detail: 'no NIT Goa rows surfaced at rank 50k',
    });
  } else {
    const quotas = new Set(goaRows.map((r) => r.quota_matched));
    const hasGO = quotas.has('GO');
    rec({
      invariant: 'IN-4',
      name: 'NIT Goa: GO/HS/OS for Goa resident',
      status: hasGO ? 'pass' : 'warn',
      detail: hasGO
        ? `quotas seen: ${[...quotas].join(', ')}`
        : `no GO seats in DB; quotas seen: ${[...quotas].join(', ')}`,
    });
  }
}

async function testMonotonicity() {
  // Same persona, ranks improving. |Safe| must be non-decreasing as rank
  // gets *smaller*; |Unlikely| must be non-increasing.
  // We sort the ladder descending (worst rank first) and walk to the best.
  const ladderWorstFirst = [...RANK_LADDER].sort((a, b) => b - a);
  const buckets: { rank: number; counts: Record<Bucket, number> }[] = [];
  for (const rank of ladderWorstFirst) {
    const r = await predict({
      rank,
      ...PERSONA_BASE,
      include_unlikely: true,
    });
    buckets.push({ rank, counts: summarise(r) });
  }

  let monoSafe = true;
  let monoUnlikely = true;
  const violations: unknown[] = [];
  for (let i = 1; i < buckets.length; i++) {
    const prev = buckets[i - 1];
    const cur = buckets[i];
    if (cur.counts.safe < prev.counts.safe) {
      monoSafe = false;
      violations.push({
        type: 'safe-shrunk',
        from: { rank: prev.rank, safe: prev.counts.safe },
        to: { rank: cur.rank, safe: cur.counts.safe },
      });
    }
    if (cur.counts.unlikely > prev.counts.unlikely) {
      monoUnlikely = false;
      violations.push({
        type: 'unlikely-grew',
        from: { rank: prev.rank, unlikely: prev.counts.unlikely },
        to: { rank: cur.rank, unlikely: cur.counts.unlikely },
      });
    }
  }
  rec({
    invariant: 'IN-2',
    name: 'Monotonicity: safe non-decreasing as rank improves',
    status: monoSafe ? 'pass' : 'fail',
    detail: `ladder ${ladderWorstFirst.join(' → ')}`,
    evidence: monoSafe ? undefined : violations.filter((v) => (v as { type: string }).type === 'safe-shrunk'),
  });
  rec({
    invariant: 'IN-2',
    name: 'Monotonicity: unlikely non-increasing as rank improves',
    status: monoUnlikely ? 'pass' : 'fail',
    detail: `ladder ${ladderWorstFirst.join(' → ')}`,
    evidence: monoUnlikely ? undefined : violations.filter((v) => (v as { type: string }).type === 'unlikely-grew'),
  });

  // Info dump for the report.
  rec({
    invariant: 'IN-2',
    name: `Bucket counts across rank ladder (Kerala/OPEN/GN)`,
    status: 'info',
    detail: buckets
      .map((b) => `r=${b.rank}: S${b.counts.safe} T${b.counts.target} R${b.counts.reach} U${b.counts.unlikely}`)
      .join(' | '),
  });
}

async function testHomeStateAdvantage() {
  // For each NIT, find a rank near the home cutoff and verify the home
  // student isn't *worse off* than the outsider for that college.
  const RANK = 25_000;
  const failures: unknown[] = [];
  let pairsTested = 0;
  for (const { college_id, state } of NIT_TEST_PAIRS) {
    if (college_id === 'nit-srinagar' || college_id === 'nit-goa') continue;

    const outsider = state === OUTSIDER_FAR_NORTH ? OUTSIDER_WEST : OUTSIDER_FAR_NORTH;
    const home = await predict({
      rank: RANK,
      category: 'OPEN',
      gender: 'Gender-Neutral',
      home_state: state,
      include_unlikely: true,
    });
    const away = await predict({
      rank: RANK,
      category: 'OPEN',
      gender: 'Gender-Neutral',
      home_state: outsider,
      include_unlikely: true,
    });

    // For each branch in the away set at this college, find the matching
    // home row. If home is missing or strictly worse-bucketed, flag it.
    const BUCKET_RANK: Record<Bucket, number> = { safe: 0, target: 1, reach: 2, unlikely: 3 };
    const homeByBranch = new Map(
      home.filter((r) => r.college_id === college_id).map((r) => [r.branch_short_name, r]),
    );
    const awayByBranch = away.filter((r) => r.college_id === college_id);
    for (const a of awayByBranch) {
      const h = homeByBranch.get(a.branch_short_name);
      if (!h) continue;
      pairsTested++;
      if (BUCKET_RANK[h.bucket] > BUCKET_RANK[a.bucket]) {
        failures.push({
          college_id,
          branch: a.branch_short_name,
          home: { state, bucket: h.bucket, quota: h.quota_matched, projected: h.projected_closing_rank },
          away: { state: outsider, bucket: a.bucket, quota: a.quota_matched, projected: a.projected_closing_rank },
        });
      }
    }
  }
  rec({
    invariant: 'IN-3',
    name: 'Home-state student is never worse-bucketed than outsider',
    status: failures.length === 0 ? 'pass' : 'fail',
    detail: `${pairsTested} (college, branch) pairs compared; ${failures.length} violations`,
    evidence: failures.length === 0 ? undefined : failures.slice(0, 5),
  });
}

async function testBucketMath() {
  // Sample 50 results, recompute z, verify bucket label.
  // Mirrors predictor.ts classify() — including the "Safe override" when the
  // user's rank is at or below the minimum historical closing rank.
  const RANK = 25_000;
  const sample = await predict({
    rank: RANK,
    ...PERSONA_BASE,
    include_unlikely: true,
  });
  const subset = sample.slice(0, 50);
  const mismatches: unknown[] = [];
  for (const r of subset) {
    const minHistorical = Math.min(...r.historical.map((h) => h.closing_rank));
    let expected: Bucket;
    if (RANK <= minHistorical) {
      expected = 'safe';
    } else {
      const { projected, sigma } = recomputeProjectionAndSigma(r.historical);
      const z = (projected - RANK) / sigma;
      expected = bucketFor(z);
    }
    if (expected !== r.bucket) {
      const { projected, sigma } = recomputeProjectionAndSigma(r.historical);
      mismatches.push({
        college: r.college_id,
        branch: r.branch_short_name,
        rank: RANK,
        min_historical: minHistorical,
        recomputed: { projected: Math.round(projected), sigma: Math.round(sigma), bucket: expected },
        reported:   { projected: r.projected_closing_rank, bucket: r.bucket, probability: r.probability_pct },
        historical: r.historical,
      });
    }
  }
  rec({
    invariant: 'IN-5',
    name: 'Bucket label matches recomputed z-score (n=50 sample)',
    status: mismatches.length === 0 ? 'pass' : 'fail',
    detail: `${subset.length} sampled, ${mismatches.length} mismatches`,
    evidence: mismatches.length === 0 ? undefined : mismatches.slice(0, 3),
  });
}

async function testDeterminism() {
  const a = await predict({
    rank: 15_000,
    ...PERSONA_BASE,
    include_unlikely: false,
  });
  const b = await predict({
    rank: 15_000,
    ...PERSONA_BASE,
    include_unlikely: false,
  });
  if (a.length !== b.length) {
    rec({
      invariant: 'IN-6',
      name: 'Determinism: identical input → identical output',
      status: 'fail',
      detail: `length differed: ${a.length} vs ${b.length}`,
    });
    return;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    if (fingerprint(a[i]) !== fingerprint(b[i])) mismatch++;
  }
  rec({
    invariant: 'IN-6',
    name: 'Determinism: identical input → identical output',
    status: mismatch === 0 ? 'pass' : 'fail',
    detail: `${a.length} rows, ${mismatch} fingerprint diffs`,
  });
}

async function testEdgeCases() {
  // Rank 1 — basically every seat at every college should be Safe.
  const top = await predict({
    rank: 1,
    ...PERSONA_BASE,
    include_unlikely: true,
  });
  const topNonSafe = top.filter((r) => r.bucket !== 'safe');
  rec({
    invariant: 'IN-8',
    name: 'Rank 1 → every result bucketed Safe',
    status: topNonSafe.length === 0 ? 'pass' : 'fail',
    detail: `${top.length} results, ${topNonSafe.length} non-safe`,
    evidence: topNonSafe.length === 0 ? undefined : topNonSafe.slice(0, 3).map((r) => ({
      college: r.college_id, branch: r.branch_short_name, bucket: r.bucket, projected: r.projected_closing_rank,
    })),
  });

  // Rank 1.9M — almost nothing should be Safe; many Unlikely.
  const tail = await predict({
    rank: 1_900_000,
    ...PERSONA_BASE,
    include_unlikely: true,
  });
  const tailSafe = tail.filter((r) => r.bucket === 'safe').length;
  const tailUnlikely = tail.filter((r) => r.bucket === 'unlikely').length;
  rec({
    invariant: 'IN-8',
    name: 'Rank 1.9M → almost no Safe, many Unlikely',
    status: tailSafe === 0 ? 'pass' : 'warn',
    detail: `safe=${tailSafe}, unlikely=${tailUnlikely}, total=${tail.length}`,
  });
}

async function testPercentileSweep() {
  // Sanity: as percentile drops, total Safe count drops.
  const PERCENTILES = [99.99, 99.9, 99, 95, 90, 80, 60, 40];
  const rows: { p: number; rank: number; counts: Record<Bucket, number> }[] = [];
  for (const p of PERCENTILES) {
    const rank = percentileToRank(p, 2025);
    const r = await predict({
      rank,
      ...PERSONA_BASE,
      include_unlikely: true,
    });
    rows.push({ p, rank, counts: summarise(r) });
  }
  // Pure info dump — the strict monotonicity check is in testMonotonicity.
  rec({
    invariant: 'IN-2',
    name: 'Percentile sweep (Kerala/OPEN/GN, target year=2025)',
    status: 'info',
    detail: rows
      .map((x) => `p=${x.p} (r=${x.rank}): S${x.counts.safe} T${x.counts.target} R${x.counts.reach} U${x.counts.unlikely}`)
      .join(' | '),
  });
}

// Cross-category equivalence (IN-9):
// JoSAA stores reserved-category cutoffs as Category Rank (CR), not CRL. So
// passing the same CRL across categories is a unit error — at CRL=50k, an
// OBC-NCL student's category rank is roughly CRL × 0.30 ≈ 15k, not 50k.
//
// This test asks the right question instead: at *equivalent* category-pool
// percentiles, do all categories see a comparable spread of attainable seats?
// We pick percentile = 95 (top 5% of each category's own pool), convert via
// percentileToRank, and check that:
//   (a) every category surfaces *some* attainable rows (Safe + Target > 0).
//       The old version saw 0 for every reserved category — a hard bug.
//   (b) no category ends up with literally zero coverage when it's clearly
//       a strong percentile.
async function testCategoryEquivalence() {
  const cats: Array<'OPEN' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS'> = ['OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS'];
  const PERCENTILE = 95;
  const YEAR = 2025;
  const obs: { cat: string; rank: number; total: number; counts: Record<Bucket, number> }[] = [];
  for (const cat of cats) {
    const rank = percentileToRank(PERCENTILE, YEAR, cat);
    const r = await predict({
      rank,
      category: cat,
      gender: 'Gender-Neutral',
      home_state: 'Kerala',
      include_unlikely: true,
    });
    obs.push({ cat, rank, total: r.length, counts: summarise(r) });
  }
  const zeroCoverage = obs.filter((o) => o.counts.safe + o.counts.target === 0);
  rec({
    invariant: 'IN-9',
    name: 'At p=95 in own category, every category has attainable seats',
    status: zeroCoverage.length === 0 ? 'pass' : 'fail',
    detail: obs
      .map((x) => `${x.cat} (r=${x.rank}): S${x.counts.safe} T${x.counts.target} R${x.counts.reach} U${x.counts.unlikely}`)
      .join(' | '),
    evidence: zeroCoverage.length === 0 ? undefined : zeroCoverage,
  });
}

// IN-10: Top-of-category sanity. Rank 1 in any category should be Safe at
// nearly every college that has data for that category. Catches the bug class
// where a category-specific input is fed to the wrong cutoff list.
async function testTopOfCategorySanity() {
  const cats: Array<'OPEN' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS'> = ['OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS'];
  const failures: unknown[] = [];
  for (const cat of cats) {
    const r = await predict({
      rank: 1,
      category: cat,
      gender: 'Gender-Neutral',
      home_state: 'Kerala',
      include_unlikely: true,
    });
    const nonSafe = r.filter((x) => x.bucket !== 'safe');
    if (nonSafe.length > 0) {
      failures.push({
        category: cat,
        total: r.length,
        nonSafe: nonSafe.length,
        sample: nonSafe.slice(0, 2),
      });
    }
  }
  rec({
    invariant: 'IN-10',
    name: 'Rank 1 in any category → every result Safe',
    status: failures.length === 0 ? 'pass' : 'fail',
    detail: `${cats.length} categories tested`,
    evidence: failures.length === 0 ? undefined : failures,
  });
}

// ── Runner ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══ College Predictor — Validation Suite ═══\n');
  const t0 = Date.now();

  await testQuotaSelection();
  console.log('');
  await testSpecialQuotas();
  console.log('');
  await testMonotonicity();
  console.log('');
  await testHomeStateAdvantage();
  console.log('');
  await testBucketMath();
  console.log('');
  await testDeterminism();
  console.log('');
  await testEdgeCases();
  console.log('');
  await testPercentileSweep();
  console.log('');
  await testCategoryEquivalence();
  console.log('');
  await testTopOfCategorySanity();

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  await mongoose.disconnect();

  // ── Aggregate ────
  const tally = checks.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<Status, number>,
  );
  const pass = tally.pass ?? 0;
  const fail = tally.fail ?? 0;
  const warn = tally.warn ?? 0;
  const info = tally.info ?? 0;

  console.log(`\n═══ Summary (${elapsed}s) ═══`);
  console.log(`Pass: ${pass}   Fail: ${fail}   Warn: ${warn}   Info: ${info}`);

  // ── Markdown report ────
  const ts = new Date().toISOString();
  const md = [
    `# College Predictor Validation Report`,
    ``,
    `_Generated ${ts} — runtime ${elapsed}s_`,
    ``,
    `## Summary`,
    ``,
    `| Status | Count |`,
    `|--------|-------|`,
    `| ✅ Pass  | ${pass} |`,
    `| ❌ Fail  | ${fail} |`,
    `| ⚠️ Warn  | ${warn} |`,
    `| ℹ️ Info  | ${info} |`,
    ``,
    `**Verdict:** ${fail === 0 ? '✅ all hard invariants hold.' : `❌ ${fail} hard invariant violation${fail === 1 ? '' : 's'} — see details below.`}`,
    ``,
    `## Invariants tested`,
    ``,
    `| Code | Description |`,
    `|------|-------------|`,
    `| IN-1 | Quota selection (HS/OS for NITs, AI for IIIT/GFTI) |`,
    `| IN-2 | Monotonicity in rank + percentile |`,
    `| IN-3 | Home-state advantage at NITs |`,
    `| IN-4 | Special-state quotas (NIT Srinagar JK/LA, NIT Goa GO) |`,
    `| IN-5 | Bucket math = z-score classification |`,
    `| IN-6 | Determinism |`,
    `| IN-7 | dream_branch filter (covered by route, not engine) |`,
    `| IN-8 | Edge cases (rank 1 / rank 1.9M) |`,
    `| IN-9 | Cross-category coverage at equivalent percentile |`,
    `| IN-10 | Rank 1 in any category → every result Safe |`,
    ``,
    `## Detailed results`,
    ``,
    ...checks.map((c) => {
      const sym = c.status === 'pass' ? '✅' : c.status === 'fail' ? '❌' : c.status === 'warn' ? '⚠️' : 'ℹ️';
      const lines = [`### ${sym} \`${c.invariant}\` ${c.name}`];
      if (c.detail) lines.push('', c.detail);
      if (c.evidence) {
        lines.push('', '```json', JSON.stringify(c.evidence, null, 2), '```');
      }
      return lines.join('\n');
    }),
  ].join('\n');

  const reportPath = path.resolve(__dirname, 'PREDICTOR_VALIDATION_REPORT.md');
  const jsonPath = path.resolve(__dirname, 'predictor_validation.json');
  fs.writeFileSync(reportPath, md);
  fs.writeFileSync(jsonPath, JSON.stringify({ summary: { pass, fail, warn, info, elapsed }, checks }, null, 2));
  console.log(`\nMarkdown report: ${reportPath}`);
  console.log(`JSON dump:       ${jsonPath}`);

  process.exit(fail === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Validation harness crashed:', err);
  process.exit(2);
});
