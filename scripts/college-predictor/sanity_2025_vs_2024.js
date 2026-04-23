#!/usr/bin/env node
/**
 * Sanity check — compare 2025 final-round cutoffs against 2024 final-round
 * cutoffs for a handful of well-known branches/colleges. Huge year-over-year
 * swings (>30% at the top colleges) likely indicate bad 2025 data or a slug
 * mismatch.
 *
 * Read-only. Run after 2025 ingest completes.
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Curated list: well-known programs where we roughly know the closing rank range.
// The point is "did we accidentally ingest 2024's IIT data as 2025 NIT data" —
// catastrophic bugs, not 50-rank fluctuations.
const CHECKS = [
  { college_id: 'nit-trichy',      branch_short_name: 'CSE',                category: 'OPEN', quota: 'OS', gender: 'Gender-Neutral' },
  { college_id: 'nit-surathkal',   branch_short_name: 'CSE',                category: 'OPEN', quota: 'OS', gender: 'Gender-Neutral' },
  { college_id: 'nit-warangal',    branch_short_name: 'CSE',                category: 'OPEN', quota: 'OS', gender: 'Gender-Neutral' },
  { college_id: 'iiit-allahabad',  branch_short_name: 'IT',                 category: 'OPEN', quota: 'AI', gender: 'Gender-Neutral' },
  { college_id: 'nit-jaipur',      branch_short_name: 'CSE',                category: 'OPEN', quota: 'OS', gender: 'Gender-Neutral' },
  { college_id: 'nit-calicut',     branch_short_name: 'CSE',                category: 'OPEN', quota: 'OS', gender: 'Gender-Neutral' },
  { college_id: 'nit-rourkela',    branch_short_name: 'CSE',                category: 'OPEN', quota: 'OS', gender: 'Gender-Neutral' },
  { college_id: 'nit-delhi',       branch_short_name: 'CSE',                category: 'OPEN', quota: 'OS', gender: 'Gender-Neutral' },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const Cutoff = mongoose.connection.db.collection('college_cutoffs');

  console.log('Final-round closing rank comparison (Gender-Neutral OPEN):');
  console.log('college'.padEnd(18) + 'branch'.padEnd(10) + 'q'.padEnd(4) + '2024'.padStart(8) + '2025'.padStart(8) + '   delta');

  for (const c of CHECKS) {
    const filter2024 = { ...c, year: 2024, is_final_round: true };
    const filter2025 = { ...c, year: 2025, is_final_round: true };
    const [r24, r25] = await Promise.all([
      Cutoff.findOne(filter2024),
      Cutoff.findOne(filter2025),
    ]);
    const v24 = r24?.closing_rank ?? null;
    const v25 = r25?.closing_rank ?? null;
    const delta = (v24 && v25) ? `${Math.round(((v25 - v24) / v24) * 100)}%` : '';
    console.log(
      c.college_id.padEnd(18) +
      c.branch_short_name.padEnd(10) +
      c.quota.padEnd(4) +
      (v24 ?? '—').toString().padStart(8) +
      (v25 ?? '—').toString().padStart(8) +
      '   ' + delta,
    );
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
