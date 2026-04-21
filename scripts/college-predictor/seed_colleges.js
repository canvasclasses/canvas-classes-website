#!/usr/bin/env node
/**
 * Seed the `colleges` collection from scripts/college-predictor/data/josaa_institutes.js.
 *
 * Data lives in the data file, not here — to add/edit a college, edit the
 * institute array there and re-run this script with --apply.
 *
 * Usage:
 *   node scripts/college-predictor/seed_colleges.js           # dry run
 *   node scripts/college-predictor/seed_colleges.js --apply   # upsert
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { INSTITUTES } = require('./data/josaa_institutes');

const APPLY = process.argv.includes('--apply');

const CollegeSchema = new mongoose.Schema({
  _id: String,
  name: String,
  short_name: String,
  type: String,
  institute_code: String,
  state: String,
  city: String,
  region: String,
  established: Number,
  website: String,
  nirf_rank_engineering: Number,
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'colleges' });

const College = mongoose.models.College || mongoose.model('College', CollegeSchema);

// Sanity checks — fail loudly on bad seed data before touching Mongo.
function validate(list) {
  const seen = new Set();
  const errors = [];
  for (const c of list) {
    if (!c._id || !c.name || !c.short_name || !c.type || !c.state || !c.city || !c.region) {
      errors.push(`Missing required field in: ${c._id || c.name || '<unknown>'}`);
      continue;
    }
    if (seen.has(c._id)) errors.push(`Duplicate _id: ${c._id}`);
    seen.add(c._id);
    if (!['NIT', 'IIIT', 'GFTI', 'IIT'].includes(c.type)) {
      errors.push(`Bad type "${c.type}" for ${c._id}`);
    }
    if (!['North', 'South', 'East', 'West', 'Central', 'Northeast'].includes(c.region)) {
      errors.push(`Bad region "${c.region}" for ${c._id}`);
    }
  }
  return errors;
}

(async function () {
  const errors = validate(INSTITUTES);
  if (errors.length) {
    console.error('Seed validation failed:');
    errors.forEach((e) => console.error('  ✗', e));
    process.exit(1);
  }

  const byType = INSTITUTES.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] ?? 0) + 1;
    return acc;
  }, {});
  const byRegion = INSTITUTES.reduce((acc, c) => {
    acc[c.region] = (acc[c.region] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Seed set: ${INSTITUTES.length} institutes`);
  console.log('  By type:  ', byType);
  console.log('  By region:', byRegion);
  console.log('\nSample:', INSTITUTES[0]);

  if (!APPLY) {
    console.log('\nDry run — pass --apply to upsert.');
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  let upserted = 0;
  for (const c of INSTITUTES) {
    await College.updateOne(
      { _id: c._id },
      { $set: { ...c, updated_at: new Date() }, $setOnInsert: { created_at: new Date() } },
      { upsert: true },
    );
    upserted++;
  }
  console.log(`\n✅ Upserted ${upserted} colleges.`);
  await mongoose.disconnect();
})().catch((err) => { console.error(err); process.exit(1); });
