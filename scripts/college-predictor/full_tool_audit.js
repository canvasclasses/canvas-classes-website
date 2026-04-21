#!/usr/bin/env node
/**
 * Full tool audit — probe every known weak spot in the predictor stack and
 * print a structured report. No writes. Pure diagnostic.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const CutoffSchema = new mongoose.Schema({ _id: String }, { collection: 'college_cutoffs', strict: false, _id: false });
const CollegeSchema = new mongoose.Schema({ _id: String }, { collection: 'colleges', strict: false, _id: false });
const Cutoff = mongoose.models.CollegeCutoff || mongoose.model('CollegeCutoff', CutoffSchema);
const College = mongoose.models.College || mongoose.model('College', CollegeSchema);

async function section(title, fn) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' ' + title);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await fn();
}

(async function () {
  await mongoose.connect(process.env.MONGODB_URI);

  // ── 1. Data volume + freshness ────────────────────────────────────────────
  await section('1. DATA VOLUME & FRESHNESS', async () => {
    const byYear = await Cutoff.aggregate([
      { $group: { _id: '$year', n: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    console.log('Rows per year:');
    byYear.forEach((r) => console.log(`  ${r._id}: ${r.n}`));
    const latest = byYear[byYear.length - 1]?._id;
    console.log(`\n  Latest year in DB: ${latest}`);
    console.log(`  Gap to admission year 2026: ${2026 - latest} year(s)`);
    console.log('  ⚠ 2025 JoSAA data not yet ingested — all predictions extrapolate from 2022-2024.');
  });

  // ── 2. Round coverage ─────────────────────────────────────────────────────
  await section('2. ROUND COVERAGE (early rounds = tighter cutoffs)', async () => {
    const byRound = await Cutoff.aggregate([
      { $group: { _id: { year: '$year', round: '$round', is_final: '$is_final_round' }, n: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.round': 1 } },
    ]);
    byRound.forEach((r) => console.log(`  year=${r._id.year} round=${r._id.round} is_final=${r._id.is_final} rows=${r.n}`));
    console.log('\n  ⚠ ONLY final rounds are ingested. Round 1 / Round 3 close much tighter');
    console.log('    and reflect the ranks students actually lock seats at. Projecting off');
    console.log('    final-round data systematically OVERSTATES admission probability.');
  });

  // ── 3. Category coverage ──────────────────────────────────────────────────
  await section('3. CATEGORY COVERAGE (reservation categories should match OPEN)', async () => {
    const byCat = await Cutoff.aggregate([
      { $group: { _id: '$category', n: { $sum: 1 } } },
      { $sort: { n: -1 } },
    ]);
    byCat.forEach((r) => console.log(`  ${String(r._id).padEnd(20)} ${r.n}`));

    // Coverage: how many (college, branch, quota) groups have 3-year data per category?
    console.log('\n  Per-category 3-year coverage (% of groups with full history):');
    for (const cat of ['OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS']) {
      const g = await Cutoff.aggregate([
        { $match: { category: cat, gender: 'Gender-Neutral' } },
        { $group: { _id: { c: '$college_id', b: '$branch_short_name', q: '$quota' }, years: { $addToSet: '$year' } } },
      ]);
      const full = g.filter((x) => x.years.length === 3).length;
      const pct = g.length > 0 ? (full / g.length * 100).toFixed(0) : '—';
      console.log(`    ${cat.padEnd(12)} ${String(full).padStart(4)}/${String(g.length).padEnd(4)} full (${pct}%)`);
    }
  });

  // ── 4. Gender handling ────────────────────────────────────────────────────
  await section('4. GENDER HANDLING (female pool subtlety)', async () => {
    const byGender = await Cutoff.aggregate([
      { $group: { _id: '$gender', n: { $sum: 1 } } },
    ]);
    byGender.forEach((r) => console.log(`  ${String(r._id).padEnd(40)} ${r.n}`));
    console.log('\n  ⚠ A female candidate is ELIGIBLE for BOTH Gender-Neutral AND Female-only seats.');
    console.log('    Predictor currently filters on a single gender choice — if a user selects');
    console.log('    "Female-only (Supernumerary)", they see ONLY that pool, missing the larger');
    console.log('    Gender-Neutral pool they can also access. Should query both and merge.');
  });

  // ── 5. Quota distribution (state-specific quotas not currently modeled) ───
  await section('5. QUOTA DISTRIBUTION', async () => {
    const byQuota = await Cutoff.aggregate([
      { $group: { _id: '$quota', n: { $sum: 1 } } },
      { $sort: { n: -1 } },
    ]);
    byQuota.forEach((r) => console.log(`  ${String(r._id).padEnd(6)} ${r.n}`));
    console.log('\n  Quotas the predictor handles:  AI, HS, OS');
    console.log('  Quotas IGNORED by predictor:   JK (J&K/Ladakh), LA (Ladakh), GO (Goa)');
    console.log('  ⚠ A student from J&K / Ladakh / Goa doesn\'t see their state-specific reserved');
    console.log('    seats. Candidates from these states get the wrong picture.');
  });

  // ── 6. NIRF rank coverage ─────────────────────────────────────────────────
  await section('6. NIRF RANK (used for tiebreak in result ordering)', async () => {
    const colleges = await College.find({}).lean();
    const withNirf = colleges.filter((c) => c.nirf_rank_engineering).length;
    const byType = colleges.reduce((acc, c) => {
      acc[c.type] ??= { total: 0, withNirf: 0 };
      acc[c.type].total++;
      if (c.nirf_rank_engineering) acc[c.type].withNirf++;
      return acc;
    }, {});
    console.log(`  ${withNirf}/${colleges.length} colleges have NIRF rank populated`);
    Object.entries(byType).forEach(([t, v]) => console.log(`    ${t.padEnd(6)} ${v.withNirf}/${v.total}`));
    console.log('\n  ⚠ Colleges without NIRF rank fall back to 9999 in sort — they get buried.');
    console.log('    For new colleges this is fine; for well-known ones we\'re missing curation.');
  });

  // ── 7. State name alignment ───────────────────────────────────────────────
  await section('7. HOME-STATE vs COLLEGE-STATE NAME ALIGNMENT (HS quota matching)', async () => {
    const colleges = await College.find({}).lean();
    const collegeStates = new Set(colleges.map((c) => c.state));
    const userStates = [
      'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh',
      'Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand',
      'Karnataka','Kerala','Ladakh','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
      'Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu',
      'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    ];
    const unmatched = userStates.filter((s) => !collegeStates.has(s));
    console.log(`  User state options: ${userStates.length}`);
    console.log(`  College states:     ${collegeStates.size}`);
    console.log(`  User states with NO matching college state (HS quota will never match): ${unmatched.length}`);
    unmatched.forEach((s) => console.log(`    - ${s}`));
    const collegeOnlyStates = [...collegeStates].filter((s) => !userStates.includes(s));
    if (collegeOnlyStates.length > 0) {
      console.log('\n  College states NOT in user picker (user can\'t claim HS for these NITs):');
      collegeOnlyStates.forEach((s) => console.log(`    - ${s}`));
    }
  });

  // ── 8. Extreme cutoff sanity check ────────────────────────────────────────
  await section('8. SUSPICIOUSLY EXTREME CUTOFFS (possible data errors)', async () => {
    const topTight = await Cutoff.find({ closing_rank: { $lt: 50 } })
      .sort({ closing_rank: 1 })
      .limit(5)
      .lean();
    console.log(`  Rows with closing_rank < 50 (suspect):  ${topTight.length}`);
    topTight.forEach((r) => console.log(`    ${r.year} ${r.college_id} ${r.branch_short_name} ${r.category}/${r.gender}/${r.quota} close=${r.closing_rank}`));
    const tooLoose = await Cutoff.find({ closing_rank: { $gt: 1_500_000 } }).lean();
    console.log(`  Rows with closing_rank > 1.5M (suspect): ${tooLoose.length}`);
    tooLoose.slice(0, 3).forEach((r) => console.log(`    ${r.year} ${r.college_id} ${r.branch_short_name} close=${r.closing_rank}`));
  });

  // ── 9. Branches with only 1 year (post-normalization) ─────────────────────
  await section('9. BRANCHES STILL WITH 1-YEAR COVERAGE (post-normalization)', async () => {
    const groups = await Cutoff.aggregate([
      { $match: { category: 'OPEN', gender: 'Gender-Neutral' } },
      { $group: { _id: { c: '$college_id', b: '$branch_short_name', q: '$quota' }, years: { $addToSet: '$year' } } },
      { $match: { $expr: { $eq: [{ $size: '$years' }, 1] } } },
    ]);
    console.log(`  ${groups.length} groups have exactly 1 year of data.`);
    const byYear = groups.reduce((acc, g) => { const y = g.years[0]; acc[y] = (acc[y] ?? 0) + 1; return acc; }, {});
    console.log('  Distribution:');
    Object.entries(byYear).forEach(([y, n]) => console.log(`    ${y}: ${n}`));
    console.log('  → All of these hit the predictor\'s "low confidence" path with σ = 15% of the rank.');
  });

  // ── 10. Predictor model assumptions ───────────────────────────────────────
  await section('10. MODEL ASSUMPTIONS (code review items, not data)', async () => {
    console.log('  - Weighted mean with 0.6^i decay + linear trend — sensible but');
    console.log('    assumes monotonic trend; reality can be noisy around branch reshuffles.');
    console.log('  - Sigma floor at 5% of projected rank — tight. For a 50,000 rank that\'s ±2,500.');
    console.log('    A branch that jumped from 45k→60k YoY has real σ ~10k; 5% floor underfits.');
    console.log('  - Probability from normal CDF. JoSAA cutoffs are integer ranks of a finite');
    console.log('    seat pool — the "probability" is really an estimator\'s confidence, not');
    console.log('    an admission probability in the frequentist sense. UI should say so.');
    console.log('  - Percentile → rank uses TOTAL_CANDIDATES_BY_YEAR. NTA\'s actual rank comes');
    console.log('    from JEE Main NTA score (normalized across sessions), not raw percentile.');
    console.log('    Our conversion is an approximation; ±1-2 percentile users can be off by');
    console.log('    thousands of ranks in the dense middle band.');
  });

  await mongoose.disconnect();
})().catch((err) => { console.error(err); process.exit(1); });
