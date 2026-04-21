#!/usr/bin/env node
/**
 * Dump every unique (branch_short_name, branch_name) pair in college_cutoffs
 * and how many rows reference it. Use the output to decide which aliases to
 * add to BRANCH_ALIASES (and which short-names students are likely to type).
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const S = new mongoose.Schema({}, { collection: 'college_cutoffs', strict: false });
const Cutoff = mongoose.models.CollegeCutoff || mongoose.model('CollegeCutoff', S);

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const agg = await Cutoff.aggregate([
    {
      $group: {
        _id: { short: '$branch_short_name', name: '$branch_name' },
        n: { $sum: 1 },
      },
    },
    { $sort: { n: -1 } },
  ]);

  // Group by short name to see every long-form variant.
  const byShort = new Map();
  for (const row of agg) {
    const s = row._id.short;
    if (!byShort.has(s)) byShort.set(s, { total: 0, names: new Map() });
    const e = byShort.get(s);
    e.total += row.n;
    e.names.set(row._id.name, (e.names.get(row._id.name) ?? 0) + row.n);
  }

  const sorted = [...byShort.entries()].sort((a, b) => b[1].total - a[1].total);
  console.log(`Unique branch_short_name values: ${sorted.length}\n`);
  for (const [short, e] of sorted) {
    console.log(`${short.padEnd(30)} (${e.total} rows)`);
    for (const [name, n] of [...e.names.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`    • ${name} — ${n}`);
    }
  }

  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
