#!/usr/bin/env node
/**
 * Quick sanity check on 2025 Round 1 data (full 2025 ingest may still be
 * running — R1 is the first round upserted). Compares 2025 R1 closing ranks
 * against 2024 R1 for the same well-known programs.
 *
 * A closing rank moving by ±10-20% year over year is normal; a 5x jump
 * usually means a bad slug mapping or column-order regression.
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHECKS = [
  { college_id: 'nit-trichy',     branch: 'CSE',            quota: 'OS' },
  { college_id: 'nit-surathkal',  branch: 'CSE',            quota: 'OS' },
  { college_id: 'nit-warangal',   branch: 'CSE',            quota: 'OS' },
  { college_id: 'iiit-allahabad', branch: 'IT',             quota: 'AI' },
  { college_id: 'nit-jaipur',     branch: 'CSE',            quota: 'OS' },
  { college_id: 'nit-calicut',    branch: 'CSE',            quota: 'OS' },
  { college_id: 'nit-rourkela',   branch: 'CSE',            quota: 'OS' },
  { college_id: 'nit-delhi',      branch: 'CSE',            quota: 'OS' },
  { college_id: 'nit-nagpur',     branch: 'CSE',            quota: 'OS' },
  { college_id: 'nit-bhopal',     branch: 'CSE',            quota: 'OS' },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const Cutoff = mongoose.connection.db.collection('college_cutoffs');

  console.log('R1 closing rank — Gender-Neutral OPEN');
  console.log('college'.padEnd(18) + 'branch'.padEnd(8) + 'q'.padEnd(4) + '2024'.padStart(8) + '2025'.padStart(8) + '   Δ');

  for (const c of CHECKS) {
    const base = {
      college_id: c.college_id,
      branch_short_name: c.branch,
      category: 'OPEN',
      gender: 'Gender-Neutral',
      quota: c.quota,
      round: 1,
    };
    const [r24, r25] = await Promise.all([
      Cutoff.findOne({ ...base, year: 2024 }),
      Cutoff.findOne({ ...base, year: 2025 }),
    ]);
    const v24 = r24?.closing_rank ?? null;
    const v25 = r25?.closing_rank ?? null;
    const delta = (v24 && v25) ? `${Math.round(((v25 - v24) / v24) * 100).toString().padStart(4)}%` : '';
    console.log(
      c.college_id.padEnd(18) +
      c.branch.padEnd(8) +
      c.quota.padEnd(4) +
      (v24 ?? '—').toString().padStart(8) +
      (v25 ?? '—').toString().padStart(8) +
      '   ' + delta,
    );
  }

  console.log('\n2025 GFTI coverage (newly seeded):');
  for (const slug of ['gfti-iust-kashmir','gfti-nielit-ajmer','gfti-nielit-gorakhpur','gfti-nielit-patna','gfti-nielit-ropar','gfti-rgnau-amethi','gfti-sgsits-indore']) {
    const n = await Cutoff.countDocuments({ college_id: slug, year: 2025 });
    console.log(`  ${slug.padEnd(22)} ${n} rows`);
  }

  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
