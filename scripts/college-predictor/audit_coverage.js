#!/usr/bin/env node
/**
 * Coverage audit — for each college, what fraction of its branches have
 * full 3-year data vs 2-year vs 1-year, and broken out by quota?
 *
 * This is the real question: when a student queries, how confident can we be
 * in the projection? A branch with 1 year of data → low confidence tag.
 *
 * No writes. Pure reporting.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const CutoffSchema = new mongoose.Schema({}, { collection: 'college_cutoffs', strict: false });
const Cutoff = mongoose.models.CollegeCutoff || mongoose.model('CollegeCutoff', CutoffSchema);

(async function () {
  await mongoose.connect(process.env.MONGODB_URI);

  // The predictor groups by (college, branch_short_name, category, gender, quota).
  // Count years of data per such combination — that IS the prediction input.
  const agg = await Cutoff.aggregate([
    { $match: { category: 'OPEN', gender: 'Gender-Neutral' } },
    {
      $group: {
        _id: {
          college: '$college_id',
          branch: '$branch_short_name',
          quota: '$quota',
        },
        years: { $addToSet: '$year' },
      },
    },
    { $project: { college: '$_id.college', branch: '$_id.branch', quota: '$_id.quota', n: { $size: '$years' } } },
  ]);

  const byYears = { 1: 0, 2: 0, 3: 0 };
  for (const r of agg) byYears[r.n]++;
  const total = agg.length;

  console.log('OPEN / Gender-Neutral, grouped by (college, branch, quota):');
  console.log(`  Total groups: ${total}`);
  console.log(`  3 years of data: ${byYears[3]} (${(byYears[3] / total * 100).toFixed(1)}%)  ← high confidence eligible`);
  console.log(`  2 years of data: ${byYears[2]} (${(byYears[2] / total * 100).toFixed(1)}%)  ← medium confidence`);
  console.log(`  1 year of data:  ${byYears[1]} (${(byYears[1] / total * 100).toFixed(1)}%)  ← low confidence only`);

  // Break down by college type
  const College = mongoose.models.College || mongoose.model('College',
    new mongoose.Schema({}, { collection: 'colleges', strict: false }));
  const colleges = await College.find({}).lean();
  const typeById = new Map(colleges.map((c) => [c._id, c.type]));

  const byTypeAndYears = {};
  for (const r of agg) {
    const type = typeById.get(r.college) ?? 'UNKNOWN';
    byTypeAndYears[type] ??= { 1: 0, 2: 0, 3: 0 };
    byTypeAndYears[type][r.n]++;
  }
  console.log('\nBy college type:');
  for (const [type, counts] of Object.entries(byTypeAndYears)) {
    const t = counts[1] + counts[2] + counts[3];
    console.log(`  ${type.padEnd(6)} total=${String(t).padStart(4)}  1yr=${counts[1]}  2yr=${counts[2]}  3yr=${counts[3]}  (${(counts[3] / t * 100).toFixed(0)}% full)`);
  }

  // Flagship branches specifically: CSE, ECE, EE, ME, CE
  console.log('\nFlagship branches (OPEN / GN, across all quotas):');
  const flagship = ['CSE', 'ECE', 'EE', 'ME', 'CE', 'CHE', 'IT'];
  for (const br of flagship) {
    const rows = agg.filter((r) => r.branch === br);
    const counts = { 1: 0, 2: 0, 3: 0 };
    rows.forEach((r) => counts[r.n]++);
    const t = rows.length;
    if (t === 0) { console.log(`  ${br.padEnd(6)} (no data)`); continue; }
    console.log(`  ${br.padEnd(6)} total=${String(t).padStart(4)}  1yr=${counts[1]}  2yr=${counts[2]}  3yr=${counts[3]}  (${(counts[3] / t * 100).toFixed(0)}% full)`);
  }

  // Colleges with WORST coverage — possibly not ingested or very new
  console.log('\nColleges with <50% of their groups at 3-year coverage:');
  const byCollege = {};
  for (const r of agg) {
    byCollege[r.college] ??= { 1: 0, 2: 0, 3: 0 };
    byCollege[r.college][r.n]++;
  }
  const worst = Object.entries(byCollege)
    .map(([c, counts]) => {
      const t = counts[1] + counts[2] + counts[3];
      return { college: c, total: t, full: counts[3], pct: counts[3] / t };
    })
    .filter((x) => x.pct < 0.5 && x.total >= 3)
    .sort((a, b) => a.pct - b.pct);
  worst.forEach((x) => console.log(`  ${x.college.padEnd(28)} ${x.full}/${x.total} (${(x.pct * 100).toFixed(0)}%)`));

  // Colleges with ZERO coverage — seeded but not ingested
  const seeded = new Set(colleges.map((c) => c._id));
  const seenInCutoffs = new Set(agg.map((r) => r.college));
  const missing = [...seeded].filter((id) => !seenInCutoffs.has(id));
  console.log(`\nColleges seeded but with NO OPEN/GN cutoff data (${missing.length}):`);
  missing.forEach((id) => console.log(`  - ${id}`));

  await mongoose.disconnect();
})().catch((err) => { console.error(err); process.exit(1); });
