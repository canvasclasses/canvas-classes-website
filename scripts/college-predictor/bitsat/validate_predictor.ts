/**
 * BITSAT Predictor — QA validation harness.
 *
 * Three suites in one run:
 *
 *   A. INVARIANTS  — pure-logic contracts that must always hold:
 *      IN-1  Score 0 → no Safe results (all unlikely if forced)
 *      IN-2  Score = max → every result is Safe
 *      IN-3  Monotonicity: raising the score never demotes a result's bucket
 *      IN-4  Probability monotonicity: raising the score never lowers % chance
 *      IN-5  Regime isolation: modern query touches only max_score=390 docs;
 *            legacy touches only max_score=450 docs
 *      IN-6  Sort order: Safe before Target before Reach (always)
 *      IN-7  Bucket math: recomputing z from (score, projected, sigma) lands
 *            in the same bucket the predictor reported
 *      IN-8  Filter idempotence: empty filter == no filter
 *      IN-9  Programme-code completeness: every returned programme_code is in
 *            the catalog
 *
 *   B. SPOT-CHECKS — 12 random (year, campus, programme) tuples in Mongo must
 *      match the scraped JSON from bitsadmission.com.
 *
 *   C. HINDSIGHT BACKTEST — for AY 2024 and AY 2025, predict using only
 *      prior years' data (via the predictor's `asOfYear` hook) and check
 *      bucket calls against the actual realised cutoff. Reports a hit-rate
 *      table per bucket.
 *
 * Output:
 *   scripts/college-predictor/bitsat/BITSAT_VALIDATION_REPORT.md
 *
 * Run:
 *   npx tsx scripts/college-predictor/bitsat/validate_predictor.ts
 */

import 'dotenv/config';   // .env at repo root; redundant with .env.local but root .env carries MONGODB_URI
import * as fs from 'node:fs';
import * as path from 'node:path';
import mongoose from 'mongoose';
import {
  predictBitsat,
  REGIME_MAX_SCORE,
  type BitsatPredictorResult,
  type BitsatRegime,
  type BitsatBucket,
} from '../../../apps/student/features/college-predictor/bitsat/predictor';
import {
  BITSAT_PROGRAMMES,
  BITSAT_PROGRAMME_BY_CODE,
  type BitsatProgrammeCode,
} from '../../../packages/data/bitsat/programmes';

// ── Reporter ─────────────────────────────────────────────────────────────────
const checks: { id: string; name: string; pass: boolean; detail?: string }[] = [];
function record(id: string, name: string, pass: boolean, detail?: string) {
  checks.push({ id, name, pass, detail });
  const tick = pass ? '✓' : '✗';
  const padded = id.padEnd(6);
  console.log(`  ${tick} ${padded} ${name}${detail ? '  — ' + detail : ''}`);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const BUCKET_RANK: Record<BitsatBucket, number> = { safe: 0, target: 1, reach: 2, unlikely: 3 };

function reapplyZ(score: number, projected: number, sigma: number): BitsatBucket {
  const z = (score - projected) / sigma;
  if (z > 1) return 'safe';
  if (z >= -1) return 'target';
  if (z >= -2) return 'reach';
  return 'unlikely';
}

// ── A. Invariants ────────────────────────────────────────────────────────────
async function runInvariants() {
  console.log('\n=== A. INVARIANTS ===\n');

  // IN-1: Score 0 with include_unlikely should return rows but none are safe.
  {
    const rows = await predictBitsat({ score: 0, regime: 'modern', include_unlikely: true });
    const anySafe = rows.some((r) => r.bucket === 'safe');
    record('IN-1', 'Score 0 (modern) yields no Safe results', !anySafe,
      `rows=${rows.length} safe=${rows.filter(r => r.bucket === 'safe').length}`);
  }

  // IN-2: Score = max should mark every programme Safe.
  {
    const rows = await predictBitsat({ score: 390, regime: 'modern' });
    const allSafe = rows.length > 0 && rows.every((r) => r.bucket === 'safe');
    record('IN-2', 'Score 390 (modern) yields all Safe', allSafe,
      `rows=${rows.length} non-safe=${rows.filter(r => r.bucket !== 'safe').length}`);
  }

  // IN-3 + IN-4: Sweep scores 100..380 and confirm bucket and probability
  //              are monotonically non-worsening per (campus, programme).
  {
    const samples = [100, 150, 200, 240, 270, 300, 330, 380];
    const rowsByScore: Record<number, BitsatPredictorResult[]> = {};
    for (const s of samples) {
      rowsByScore[s] = await predictBitsat({ score: s, regime: 'modern', include_unlikely: true });
    }
    // Build a key→bucket-history map across the sweep.
    let bucketViolations = 0;
    let probViolations = 0;
    const all = new Map<string, { score: number; bucket: BitsatBucket; prob: number }[]>();
    for (const s of samples) {
      for (const r of rowsByScore[s]) {
        const key = `${r.campus_id}::${r.programme_code}`;
        if (!all.has(key)) all.set(key, []);
        all.get(key)!.push({ score: s, bucket: r.bucket, prob: r.probability_pct });
      }
    }
    let violationSample: string | null = null;
    for (const [key, history] of all) {
      const sorted = history.slice().sort((a, b) => a.score - b.score);
      for (let i = 1; i < sorted.length; i++) {
        // Bucket must not get strictly worse as score rises (rank-order metric).
        if (BUCKET_RANK[sorted[i].bucket] > BUCKET_RANK[sorted[i - 1].bucket]) {
          bucketViolations++;
          if (!violationSample) violationSample = `${key} ${sorted[i - 1].score}:${sorted[i - 1].bucket} → ${sorted[i].score}:${sorted[i].bucket}`;
        }
        // Probability must not drop as score rises.
        if (sorted[i].prob < sorted[i - 1].prob) probViolations++;
      }
    }
    record('IN-3', 'Bucket monotonic in score', bucketViolations === 0,
      `${bucketViolations} violations${violationSample ? ' e.g. ' + violationSample : ''}`);
    record('IN-4', 'Probability monotonic in score', probViolations === 0,
      `${probViolations} violations`);
  }

  // IN-5: Regime isolation.
  {
    const modernRows = await predictBitsat({ score: 300, regime: 'modern' });
    const legacyRows = await predictBitsat({ score: 350, regime: 'legacy' });
    const modernOk = modernRows.every((r) => r.max_score === 390);
    const legacyOk = legacyRows.every((r) => r.max_score === 450);
    record('IN-5a', 'Modern regime returns only max_score=390 rows', modernOk,
      `rows=${modernRows.length}`);
    record('IN-5b', 'Legacy regime returns only max_score=450 rows', legacyOk,
      `rows=${legacyRows.length}`);
  }

  // IN-6: Sort order — within result list, buckets are non-decreasing.
  {
    const rows = await predictBitsat({ score: 280, regime: 'modern', include_unlikely: true });
    let sortViolations = 0;
    for (let i = 1; i < rows.length; i++) {
      if (BUCKET_RANK[rows[i].bucket] < BUCKET_RANK[rows[i - 1].bucket]) sortViolations++;
    }
    record('IN-6', 'Result list sorted Safe → Target → Reach → Unlikely', sortViolations === 0,
      `${sortViolations} out-of-order pairs over ${rows.length} rows`);
  }

  // IN-7: Bucket math — recompute bucket from historical + projected.
  {
    const rows = await predictBitsat({ score: 270, regime: 'modern', include_unlikely: true });
    let mathViolations = 0;
    let badSample: string | null = null;
    for (const r of rows) {
      // Reconstruct sigma from the bucket boundary the predictor must have used.
      // We don't expose sigma directly, so this is a coarse re-derivation:
      // compute weighted-mean + variance the same way the engine does.
      const sorted = [...r.historical].sort((a, b) => b.year - a.year);
      if (sorted.length < 2) continue; // single-year fallback uses different sigma
      const mean = sorted.reduce((a, x) => a + x.cutoff_score, 0) / sorted.length;
      const variance = sorted.reduce((a, x) => a + (x.cutoff_score - mean) ** 2, 0) / sorted.length;
      const sigma = Math.max(Math.sqrt(variance), r.projected_cutoff_score * 0.05, 4);
      // Hard-safe override fires when score >= max(history) — skip those rows
      // since the analytic bucket from z may disagree.
      const maxHist = Math.max(...sorted.map((x) => x.cutoff_score));
      if (270 >= maxHist) continue;
      const expected = reapplyZ(270, r.projected_cutoff_score, sigma);
      if (expected !== r.bucket) {
        mathViolations++;
        if (!badSample) badSample = `${r.campus_name} ${r.programme_code} got=${r.bucket} expected=${expected} proj=${r.projected_cutoff_score} sigma=${sigma.toFixed(1)}`;
      }
    }
    record('IN-7', 'Bucket math reconstructible from (score, projected, σ)', mathViolations === 0,
      `${mathViolations} mismatches${badSample ? ' e.g. ' + badSample : ''}`);
  }

  // IN-8: Filter idempotence — empty filter same as unset filter.
  {
    const a = await predictBitsat({ score: 280, regime: 'modern' });
    const b = await predictBitsat({ score: 280, regime: 'modern', campuses: [], programmes: [] });
    const equal = JSON.stringify(a) === JSON.stringify(b);
    record('IN-8', 'Empty filter equals unset filter', equal,
      `a=${a.length} rows, b=${b.length} rows`);
  }

  // IN-9: Programme-code completeness.
  {
    const rows = await predictBitsat({ score: 250, regime: 'modern', include_unlikely: true });
    const catalogCodes = new Set(BITSAT_PROGRAMMES.map((p) => p.code));
    let outOfCatalog = 0;
    for (const r of rows) if (!catalogCodes.has(r.programme_code)) outOfCatalog++;
    record('IN-9', 'Every returned programme_code is in the catalog', outOfCatalog === 0,
      `${outOfCatalog} stray codes over ${rows.length} rows`);
  }
}

// ── B. Spot-checks against the scraped source JSON ──────────────────────────
async function runSpotChecks() {
  console.log('\n=== B. SPOT-CHECKS vs SOURCE ===\n');

  const sourcePath = path.join(__dirname, 'data', 'bitsat_cutoffs.json');
  if (!fs.existsSync(sourcePath)) {
    record('SP-0', 'Source JSON present at ' + sourcePath, false, 'missing — run fetch first');
    return;
  }
  const source: { year: number; campus: string; programme_code: string; cutoff_score: number }[] =
    JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  // Pick 12 random rows from across years/campuses.
  const sampleSize = 12;
  const rng = (() => { let s = 42; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })();
  const picks = [...source].sort(() => rng() - 0.5).slice(0, sampleSize);

  // Connect once.
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    record('SP-1', 'MONGODB_URI present', false, 'aborting spot-checks');
    return;
  }
  await mongoose.connect(uri);

  const col = mongoose.connection.db!.collection('bitsat_cutoffs');
  let matches = 0;
  for (const p of picks) {
    const doc = await col.findOne({ campus: p.campus, programme_code: p.programme_code, year: p.year });
    const ok = !!doc && doc.cutoff_score === p.cutoff_score;
    if (ok) matches++;
    else console.log(`     · MISS ${p.year} ${p.campus} ${p.programme_code}: source=${p.cutoff_score} mongo=${doc?.cutoff_score ?? 'none'}`);
  }
  record('SP-1', `${sampleSize} random rows match source ↔ Mongo`, matches === sampleSize,
    `${matches}/${sampleSize} matched`);
}

// ── C. Hindsight backtest ────────────────────────────────────────────────────
interface BacktestCell {
  bucket: BitsatBucket;
  /** count of predictions in this bucket whose realised cutoff was admissible (score ≥ real cutoff). */
  hit: number;
  /** total predictions in this bucket. */
  total: number;
}

async function runBacktest() {
  console.log('\n=== C. HINDSIGHT BACKTEST ===\n');

  // Connect to Mongo to read realised cutoffs.
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
  const col = mongoose.connection.db!.collection('bitsat_cutoffs');

  // For each target year Y, sweep a representative score grid and bucket every
  // (campus, programme). Then look up the realised cutoff for that (campus,
  // programme, Y) and check if score ≥ realised. Hit rate per bucket is the
  // accuracy of that bucket's contract:
  //   Safe   ≈ "should always close" → expect ≥ 90%
  //   Target ≈ "edge of feasibility" → expect 50-80%
  //   Reach  ≈ "long shot but not impossible" → expect 10-40%
  //   Unlikely ≈ "no" → expect < 10%
  const TARGET_YEARS = [2023, 2024, 2025];
  const SCORE_SWEEP = [220, 240, 260, 280, 300, 320, 340];

  const cells: Record<BitsatBucket, BacktestCell> = {
    safe:     { bucket: 'safe',     hit: 0, total: 0 },
    target:   { bucket: 'target',   hit: 0, total: 0 },
    reach:    { bucket: 'reach',    hit: 0, total: 0 },
    unlikely: { bucket: 'unlikely', hit: 0, total: 0 },
  };

  // Per-year detail for the report
  const yearDetail: Record<number, Record<BitsatBucket, BacktestCell>> = {};

  for (const Y of TARGET_YEARS) {
    const realisedDocs = await col.find({ year: Y, max_score: 390 }).toArray();
    const realised = new Map<string, number>();
    for (const d of realisedDocs) realised.set(`${d.campus}::${d.programme_code}`, d.cutoff_score);
    if (realised.size === 0) {
      console.log(`  year ${Y}: no realised data, skipping`);
      continue;
    }

    yearDetail[Y] = {
      safe:     { bucket: 'safe',     hit: 0, total: 0 },
      target:   { bucket: 'target',   hit: 0, total: 0 },
      reach:    { bucket: 'reach',    hit: 0, total: 0 },
      unlikely: { bucket: 'unlikely', hit: 0, total: 0 },
    };

    for (const score of SCORE_SWEEP) {
      const predicted = await predictBitsat(
        { score, regime: 'modern', include_unlikely: true },
        { asOfYear: Y },
      );
      for (const p of predicted) {
        const key = `${p.campus_name}::${p.programme_code}`;
        const realCutoff = realised.get(key);
        if (realCutoff === undefined) continue; // programme didn't exist that year
        const admitted = score >= realCutoff;
        cells[p.bucket].total++;
        yearDetail[Y][p.bucket].total++;
        if (admitted) {
          cells[p.bucket].hit++;
          yearDetail[Y][p.bucket].hit++;
        }
      }
    }
    const yd = yearDetail[Y];
    console.log(`  year ${Y}: predictions across ${SCORE_SWEEP.length} sample scores`);
    for (const b of ['safe', 'target', 'reach', 'unlikely'] as BitsatBucket[]) {
      const c = yd[b];
      const pct = c.total === 0 ? '–' : `${((c.hit / c.total) * 100).toFixed(0)}%`;
      console.log(`     ${b.padEnd(9)} hit ${c.hit}/${c.total} (${pct})`);
    }
  }

  // Headline aggregate
  console.log('\n  Overall (modern regime, AY 2023–2025):');
  for (const b of ['safe', 'target', 'reach', 'unlikely'] as BitsatBucket[]) {
    const c = cells[b];
    const pct = c.total === 0 ? '–' : `${((c.hit / c.total) * 100).toFixed(1)}%`;
    console.log(`     ${b.padEnd(9)} hit ${c.hit}/${c.total} (${pct})`);
  }

  // Calibration health: Safe should beat Target should beat Reach should beat Unlikely.
  const rates: number[] = (['safe', 'target', 'reach', 'unlikely'] as BitsatBucket[])
    .map((b) => cells[b].total === 0 ? -1 : cells[b].hit / cells[b].total);
  const orderingOk = rates[0] >= rates[1] && rates[1] >= rates[2] && rates[2] >= rates[3];
  record('BT-1', 'Bucket hit rate ordering: Safe ≥ Target ≥ Reach ≥ Unlikely', orderingOk,
    `rates=[${rates.map((r) => r < 0 ? '–' : (r * 100).toFixed(0) + '%').join(', ')}]`);

  // Threshold expectations
  const safeRate = cells.safe.total === 0 ? 0 : cells.safe.hit / cells.safe.total;
  const unlikelyRate = cells.unlikely.total === 0 ? 1 : cells.unlikely.hit / cells.unlikely.total;
  record('BT-2', 'Safe bucket hit rate ≥ 85%', safeRate >= 0.85,
    `${(safeRate * 100).toFixed(1)}%`);
  record('BT-3', 'Unlikely bucket hit rate ≤ 15%', unlikelyRate <= 0.15,
    `${(unlikelyRate * 100).toFixed(1)}%`);

  // Save the report
  writeReport(cells, yearDetail);
}

function writeReport(
  overall: Record<BitsatBucket, BacktestCell>,
  yearDetail: Record<number, Record<BitsatBucket, BacktestCell>>,
) {
  const lines: string[] = [];
  lines.push('# BITSAT Predictor — Validation Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## A. Invariants');
  lines.push('');
  lines.push('| ID | Name | Pass | Detail |');
  lines.push('|---|---|---|---|');
  for (const c of checks.filter((c) => c.id.startsWith('IN-'))) {
    lines.push(`| ${c.id} | ${c.name} | ${c.pass ? '✅' : '❌'} | ${c.detail ?? ''} |`);
  }
  lines.push('');
  lines.push('## B. Source ↔ Mongo spot-checks');
  lines.push('');
  lines.push('| ID | Name | Pass | Detail |');
  lines.push('|---|---|---|---|');
  for (const c of checks.filter((c) => c.id.startsWith('SP-'))) {
    lines.push(`| ${c.id} | ${c.name} | ${c.pass ? '✅' : '❌'} | ${c.detail ?? ''} |`);
  }
  lines.push('');
  lines.push('## C. Hindsight backtest');
  lines.push('');
  lines.push('For each target year, the predictor was given ONLY data from prior years, then asked');
  lines.push('to bucket every (campus, programme) at scores 220, 240, 260, 280, 300, 320, 340. The');
  lines.push('realised cutoff was then looked up; "hit" = user score actually cleared the realised');
  lines.push('cutoff. Healthy calibration means Safe ≈ near-100%, Reach ≈ 10–40%, Unlikely ≈ near-0%.');
  lines.push('');
  lines.push('### Per-year breakdown');
  lines.push('');
  lines.push('| Year | Bucket | Hits / Total | Hit Rate |');
  lines.push('|---|---|---|---|');
  for (const y of Object.keys(yearDetail).map(Number).sort()) {
    for (const b of ['safe', 'target', 'reach', 'unlikely'] as BitsatBucket[]) {
      const c = yearDetail[y][b];
      const pct = c.total === 0 ? '–' : `${((c.hit / c.total) * 100).toFixed(0)}%`;
      lines.push(`| ${y} | ${b} | ${c.hit} / ${c.total} | ${pct} |`);
    }
  }
  lines.push('');
  lines.push('### Aggregate (all target years)');
  lines.push('');
  lines.push('| Bucket | Hits / Total | Hit Rate |');
  lines.push('|---|---|---|');
  for (const b of ['safe', 'target', 'reach', 'unlikely'] as BitsatBucket[]) {
    const c = overall[b];
    const pct = c.total === 0 ? '–' : `${((c.hit / c.total) * 100).toFixed(1)}%`;
    lines.push(`| ${b} | ${c.hit} / ${c.total} | ${pct} |`);
  }
  lines.push('');
  lines.push('| ID | Name | Pass | Detail |');
  lines.push('|---|---|---|---|');
  for (const c of checks.filter((c) => c.id.startsWith('BT-'))) {
    lines.push(`| ${c.id} | ${c.name} | ${c.pass ? '✅' : '❌'} | ${c.detail ?? ''} |`);
  }
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  const passed = checks.filter((c) => c.pass).length;
  const total = checks.length;
  lines.push(`**${passed} / ${total}** checks passed.`);

  const reportPath = path.join(__dirname, 'BITSAT_VALIDATION_REPORT.md');
  fs.writeFileSync(reportPath, lines.join('\n'));
  console.log(`\n✓ Report written to ${reportPath}`);
}

async function main() {
  try {
    await runInvariants();
    await runSpotChecks();
    await runBacktest();
  } catch (err) {
    console.error('Validation failed:', err);
    process.exitCode = 1;
  } finally {
    try { await mongoose.disconnect(); } catch { /* noop */ }
  }
  const failures = checks.filter((c) => !c.pass);
  console.log(`\n=========================`);
  console.log(`${checks.length - failures.length} / ${checks.length} checks passed.`);
  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const f of failures) console.log(`  - ${f.id} ${f.name}: ${f.detail ?? ''}`);
    process.exitCode = 1;
  }
}

main();
