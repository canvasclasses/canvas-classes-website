#!/usr/bin/env node
/**
 * Audit distinct branch names across all ingested years.
 *
 * The ingest script pulls a `short_name` out of each row's "Academic Program
 * Name" via heuristic (abbreviation lookup + trim). That heuristic drifts year
 * to year because the source CSVs format program strings differently. This
 * script surfaces the drift so we know what to consolidate.
 *
 * Output:
 *   - For each canonical subject, list the short_name variants observed and
 *     the years they appear in.
 *   - Flag "year-skewed" branches (e.g. a branch that has data in 2024 only).
 *
 * No writes. Pure reporting.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const CutoffSchema = new mongoose.Schema({}, { collection: 'college_cutoffs', strict: false });
const Cutoff = mongoose.models.CollegeCutoff || mongoose.model('CollegeCutoff', CutoffSchema);

(async function () {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);

  // (college_id, branch_short_name) → { years, totalRows, sampleBranchName }
  const agg = await Cutoff.aggregate([
    {
      $group: {
        _id: { college: '$college_id', branch: '$branch_short_name' },
        years: { $addToSet: '$year' },
        count: { $sum: 1 },
        sampleName: { $first: '$branch_name' },
      },
    },
    { $sort: { '_id.college': 1, '_id.branch': 1 } },
  ]);

  // ── Per-college variants: group by college, report short_name variants ────
  const byCollege = new Map();
  for (const r of agg) {
    if (!byCollege.has(r._id.college)) byCollege.set(r._id.college, []);
    byCollege.get(r._id.college).push({
      branch: r._id.branch,
      name: r.sampleName,
      years: r.years.sort(),
      count: r.count,
    });
  }

  // ── Global short_name universe ────────────────────────────────────────────
  const globalShortNames = new Map(); // short_name → Set<year>
  for (const r of agg) {
    if (!globalShortNames.has(r._id.branch)) globalShortNames.set(r._id.branch, new Set());
    r.years.forEach((y) => globalShortNames.get(r._id.branch).add(y));
  }

  console.log('─────────────────────────────────────────────────────────');
  console.log('Distinct (college, branch_short_name) combos:', agg.length);
  console.log('Distinct global short_names:                  ', globalShortNames.size);

  // ── Year coverage for short names ────────────────────────────────────────
  const coverageBuckets = { '1 year only': [], '2 years': [], '3 years': [] };
  for (const [name, years] of globalShortNames) {
    const n = years.size;
    if (n === 1) coverageBuckets['1 year only'].push({ name, years: [...years] });
    else if (n === 2) coverageBuckets['2 years'].push({ name, years: [...years] });
    else coverageBuckets['3 years'].push({ name, years: [...years] });
  }
  console.log('\nCoverage of short_names across years:');
  Object.entries(coverageBuckets).forEach(([k, v]) => console.log(`  ${k}: ${v.length}`));

  console.log('\nShort-names present in ONLY one year (likely normalization issues):');
  coverageBuckets['1 year only']
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(({ name, years }) => console.log(`  [${years.join(',')}] ${name}`));

  // ── Per-college drift report ─────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────────────────────');
  console.log('PER-COLLEGE SHORT-NAME DRIFT (branches that appear under');
  console.log('different short_names across years for the same college):');
  console.log('─────────────────────────────────────────────────────────');

  const driftExamples = [];
  for (const [college, branches] of byCollege) {
    // Two branches at the same college with overlapping/suspiciously similar
    // full names but different short_names = likely drift.
    for (let i = 0; i < branches.length; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        const a = branches[i];
        const b = branches[j];
        if (!a || !b) continue;
        if (a.branch === b.branch) continue;
        // Simple heuristic: their branch_name strings share ≥70% of words
        if (nameSimilarity(a.name, b.name) >= 0.7) {
          const yearsA = new Set(a.years);
          const yearsB = new Set(b.years);
          const overlap = [...yearsA].some((y) => yearsB.has(y));
          if (!overlap) {
            driftExamples.push({ college, a, b });
          }
        }
      }
    }
  }

  // Dedupe by short_name pair
  const seen = new Set();
  const deduped = [];
  for (const d of driftExamples) {
    const key = [d.a.branch, d.b.branch].sort().join('||');
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push({ ...d, key });
    }
  }

  // Count occurrences of each drift pair across colleges
  const pairCounts = new Map();
  for (const d of driftExamples) {
    const key = [d.a.branch, d.b.branch].sort().join('||');
    pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
  }

  console.log(`\nFound ${deduped.length} distinct drift pairs (${driftExamples.length} total occurrences).\n`);

  const sorted = [...pairCounts.entries()].sort((a, b) => b[1] - a[1]);
  sorted.forEach(([key, count]) => {
    const [a, b] = key.split('||');
    const example = driftExamples.find((d) => {
      const k = [d.a.branch, d.b.branch].sort().join('||');
      return k === key;
    });
    if (!example) return;
    console.log(`  [${count}×] "${a}" ⇄ "${b}"`);
    console.log(`         ex: ${example.college}`);
    console.log(`           - "${example.a.branch}" (${example.a.years.join(',')}) ← ${example.a.name}`);
    console.log(`           - "${example.b.branch}" (${example.b.years.join(',')}) ← ${example.b.name}`);
  });

  await mongoose.disconnect();
})().catch((err) => { console.error(err); process.exit(1); });

function nameSimilarity(a, b) {
  const clean = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  const wa = new Set(clean(a));
  const wb = new Set(clean(b));
  if (wa.size === 0 || wb.size === 0) return 0;
  let inter = 0;
  for (const w of wa) if (wb.has(w)) inter++;
  return inter / Math.max(wa.size, wb.size);
}
