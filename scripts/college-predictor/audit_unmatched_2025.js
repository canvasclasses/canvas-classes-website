#!/usr/bin/env node
/**
 * Audit script — compares the institutes in josaa_2025.csv against the
 * seeded `colleges` collection. Surfaces every unmatched institute with
 * a best-guess classification (IIT / NIT / IIIT / GFTI / other) so we can
 * tell which misses are "expected" (IITs, excluded by design) vs "bugs"
 * (NITs/IIITs/GFTIs we forgot to seed, or slug mismatches).
 *
 * Read-only, no writes. Run after build_josaa_2025.js.
 */

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[,.'()]/g, '')
    .replace(/national institute of technology/g, 'nit')
    .replace(/indian institute of information technology/g, 'iiit')
    .replace(/indian institute of technology/g, 'iit')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function classify(name) {
  const l = name.toLowerCase();
  if (/\biit\b|indian institute of technology/.test(l)) return 'IIT';
  if (/national institute of technology|^nit\b/.test(l)) return 'NIT';
  if (/information technology.*(design|manufacturing)|indian institute of information technology|^iiit\b|iiitdm|iiit-dm|iiitm|abv-iiitm|atal bihari vajpayee indian institute of information technology/.test(l)) return 'IIIT';
  return 'GFTI';
}

(async function main() {
  const csvPath = path.resolve(__dirname, 'data', 'josaa_2025.csv');
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  // Skip header. Institute is the first CSV field (quoted if it contains commas).
  const institutes = new Set();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    let inst;
    if (line.startsWith('"')) {
      const end = line.indexOf('"', 1);
      inst = line.slice(1, end).replace(/""/g, '"');
    } else {
      inst = line.split(',', 1)[0];
    }
    institutes.add(inst);
  }

  console.log(`Institutes in 2025 CSV: ${institutes.size}`);

  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  const CollegeModel = mongoose.models.College
    || mongoose.model('College', new mongoose.Schema({
      _id: String, name: String, short_name: String, type: String,
    }, { collection: 'colleges' }));

  const colleges = await CollegeModel.find({}).lean();
  const seededSlugs = new Set(colleges.map((c) => c._id));
  console.log(`Seeded colleges in DB: ${seededSlugs.size}`);
  const byType = colleges.reduce((a, c) => (a[c.type] = (a[c.type] ?? 0) + 1, a), {});
  console.log('  By type:', byType);
  console.log('');

  const buckets = { IIT: [], NIT: [], IIIT: [], GFTI: [] };
  for (const name of institutes) {
    const slug = slugify(name);
    if (seededSlugs.has(slug)) continue;
    buckets[classify(name)].push({ name, slug });
  }

  for (const [type, list] of Object.entries(buckets)) {
    console.log(`── Unmatched ${type}s (${list.length}) ──`);
    list.sort((a, b) => a.name.localeCompare(b.name));
    list.forEach((x) => console.log(`  ${x.slug.padEnd(50)}  ←  ${x.name}`));
    console.log('');
  }

  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
