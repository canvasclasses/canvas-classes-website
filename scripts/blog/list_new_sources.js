#!/usr/bin/env node
/*
 * Lists unscored RSS items the daily cron workflow should triage.
 * Outputs JSON to stdout so the scheduled-task prompt can pipe it through
 * Claude Code's reasoning.
 *
 * Usage:
 *   node scripts/blog/list_new_sources.js            # status=new, max 40
 *   node scripts/blog/list_new_sources.js --limit 20
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1); }

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 40;

const BlogSourceSchema = new mongoose.Schema({}, { strict: false, collection: 'blog_sources', _id: false });
const BlogSource = mongoose.models.BlogSource || mongoose.model('BlogSource', BlogSourceSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const rows = await BlogSource.find({ status: 'new' })
    .sort({ fetched_at: -1 })
    .limit(limit)
    .lean();
  console.log(JSON.stringify(rows, null, 2));
  await mongoose.disconnect();
}
main().catch(err => { console.error(err); process.exit(1); });
