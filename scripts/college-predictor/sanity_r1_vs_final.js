#!/usr/bin/env node
/**
 * Sanity check for the R1 ingest.
 *
 * Premise: Round 1 cutoffs should close TIGHTER than the final round
 * (lower closing_rank = more selective). If the R1 data we ingested is
 * actually R1 and not mislabeled R6, >80% of matched (college, branch,
 * category, gender, quota) pairs should show R1 tighter than final.
 *
 * No writes.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const S = new mongoose.Schema({}, { collection: 'college_cutoffs', strict: false });
const Cutoff = mongoose.models.CollegeCutoff || mongoose.model('CollegeCutoff', S);

const FINAL_ROUND_BY_YEAR = { 2022: 6, 2023: 6, 2024: 5 };

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const dist = await Cutoff.aggregate([
    { $group: { _id: { year: '$year', round: '$round', is_final: '$is_final_round' }, n: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.round': 1 } },
  ]);
  console.log('Round distribution:');
  dist.forEach((d) => console.log(`  year=${d._id.year} round=${d._id.round} is_final=${d._id.is_final}  rows=${d.n}`));

  for (const year of [2022, 2023, 2024]) {
    const finalRound = FINAL_ROUND_BY_YEAR[year];
    const [r1, rF] = await Promise.all([
      Cutoff.find({ year, round: 1 }).lean(),
      Cutoff.find({ year, round: finalRound }).lean(),
    ]);
    const keyOf = (r) => [r.college_id, r.branch_short_name, r.category, r.gender, r.quota].join('|');
    const rFMap = new Map(rF.map((r) => [keyOf(r), r]));
    let pairs = 0, tighter = 0, equal = 0, looser = 0, sumDelta = 0, sumPct = 0;
    for (const r of r1) {
      const f = rFMap.get(keyOf(r));
      if (!f) continue;
      pairs++;
      if (r.closing_rank < f.closing_rank) tighter++;
      else if (r.closing_rank === f.closing_rank) equal++;
      else looser++;
      sumDelta += f.closing_rank - r.closing_rank;
      sumPct += ((f.closing_rank - r.closing_rank) / f.closing_rank) * 100;
    }
    console.log(`\n${year}: R1 vs R${finalRound}  — ${pairs} matched pairs`);
    console.log(`  R1 closes tighter: ${tighter} (${((tighter / pairs) * 100).toFixed(1)}%)`);
    console.log(`  Equal:             ${equal}`);
    console.log(`  R1 closes looser:  ${looser} (${((looser / pairs) * 100).toFixed(1)}%)`);
    console.log(`  Avg gap (final - R1): ${Math.round(sumDelta / pairs)} ranks`);
    console.log(`  Avg gap as %:         ${(sumPct / pairs).toFixed(1)}%`);
  }

  console.log('\nSpot checks (OPEN / Gender-Neutral):');
  const spots = [
    { college_id: 'nit-trichy', branch_short_name: 'CSE', quota: 'OS' },
    { college_id: 'nit-warangal', branch_short_name: 'CSE', quota: 'OS' },
    { college_id: 'nit-surathkal', branch_short_name: 'CSE', quota: 'OS' },
    { college_id: 'iiit-hyderabad', branch_short_name: 'CSE', quota: 'AI' },
  ];
  for (const s of spots) {
    const rows = await Cutoff.find({ ...s, category: 'OPEN', gender: 'Gender-Neutral' }).lean();
    const by = rows.map((r) => `${r.year}r${r.round}=${r.closing_rank}`).sort();
    console.log(`  ${s.college_id} ${s.branch_short_name} ${s.quota}: ${by.join('  ') || '(no data)'}`);
  }

  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
