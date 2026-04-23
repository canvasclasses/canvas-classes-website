#!/usr/bin/env node
/**
 * Audit — summarise college_cutoffs rows per (year, round).
 * Read-only, used to confirm coverage across years before trusting predictor
 * accuracy. Added 2025-04 as part of the 2025 data expansion.
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('college_cutoffs');
  const agg = await coll.aggregate([
    { $group: {
        _id: { year: '$year', round: '$round' },
        count: { $sum: 1 },
        colleges: { $addToSet: '$college_id' },
        is_final: { $max: '$is_final_round' },
    } },
    { $project: { year: '$_id.year', round: '$_id.round', count: 1, n_colleges: { $size: '$colleges' }, is_final: 1, _id: 0 } },
    { $sort: { year: 1, round: 1 } },
  ]).toArray();
  console.log('year  round  rows    colleges  is_final');
  for (const r of agg) {
    console.log(`${r.year}   ${String(r.round).padEnd(5)}  ${String(r.count).padEnd(6)}  ${String(r.n_colleges).padEnd(8)}  ${r.is_final}`);
  }
  const byType = await coll.aggregate([
    { $group: { _id: { year: '$year', type: '$college_type' }, n: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.type': 1 } },
  ]).toArray();
  console.log('\nBy type:');
  for (const r of byType) {
    console.log(`  ${r._id.year}  ${r._id.type.padEnd(5)}  ${r.n}`);
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
