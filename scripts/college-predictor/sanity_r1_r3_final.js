#!/usr/bin/env node
/**
 * Quick spot-check: for a handful of (college, branch, quota) pairs, print R1
 * / R3 / Final closing ranks across 2022–2024. R1 should be tightest
 * (smallest), Final loosest.
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const S = new mongoose.Schema({}, { collection: 'college_cutoffs', strict: false });
const Cutoff = mongoose.models.CollegeCutoff || mongoose.model('CollegeCutoff', S);

const FINAL = { 2022: 6, 2023: 6, 2024: 5 };

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const spots = [
    ['nit-trichy', 'CSE', 'OS'],
    ['nit-warangal', 'CSE', 'OS'],
    ['nit-surathkal', 'CSE', 'OS'],
    ['iiit-hyderabad', 'CSE', 'AI'],
    ['mnit-jaipur', 'ME', 'OS'],
  ];

  for (const [cid, branch, quota] of spots) {
    console.log(`\n${cid} ${branch} ${quota} (OPEN, Gender-Neutral):`);
    for (const year of [2022, 2023, 2024]) {
      const rounds = [1, 3, FINAL[year]];
      const cells = [];
      for (const rd of rounds) {
        const row = await Cutoff.findOne({
          college_id: cid,
          branch_short_name: branch,
          quota,
          category: 'OPEN',
          gender: 'Gender-Neutral',
          year,
          round: rd,
        }).lean();
        const label = rd === 1 ? 'R1' : rd === 3 ? 'R3' : 'Fin';
        cells.push(`${label}=${row ? row.closing_rank : '—'}`);
      }
      console.log(`  ${year}: ${cells.join('  ')}`);
    }
  }

  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
