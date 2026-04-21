#!/usr/bin/env node
/*
 * Updates a BlogSource's relevance_score, relevance_reason, and status. Used
 * by the daily scheduled workflow after Claude Code has read the item and
 * formed a judgment.
 *
 * Usage:
 *   node scripts/blog/score_source.js <id> <score 0-1> "<reason>" [new|reviewed|ignored]
 *
 * Example:
 *   node scripts/blog/score_source.js abc123 0.85 "NTA just released official JEE Main 2026 Session 2 dates" reviewed
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1); }

const [id, scoreRaw, reason, statusRaw] = process.argv.slice(2);
if (!id || scoreRaw === undefined) {
  console.error('Usage: score_source.js <id> <score> "<reason>" [status]');
  process.exit(1);
}
const score = Math.min(Math.max(parseFloat(scoreRaw), 0), 1);
const validStatuses = ['new', 'reviewed', 'drafted', 'ignored'];
const status = validStatuses.includes(statusRaw) ? statusRaw : 'reviewed';

const BlogSourceSchema = new mongoose.Schema({}, { strict: false, collection: 'blog_sources', _id: false });
const BlogSource = mongoose.models.BlogSource || mongoose.model('BlogSource', BlogSourceSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const res = await BlogSource.updateOne(
    { _id: id },
    { $set: { relevance_score: score, relevance_reason: (reason || '').slice(0, 500), status } }
  );
  console.log(JSON.stringify({ matched: res.matchedCount, modified: res.modifiedCount }));
  await mongoose.disconnect();
}
main().catch(err => { console.error(err); process.exit(1); });
