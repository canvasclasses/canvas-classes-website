#!/usr/bin/env node
/*
 * Lists pending BlogIdea docs so the daily scheduled task can pick 0-1 to
 * draft alongside the RSS-based drafts.
 *
 * Usage:
 *   node scripts/blog/list_pending_ideas.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1); }

const BlogIdeaSchema = new mongoose.Schema({}, { strict: false, collection: 'blog_ideas', _id: false });
const BlogIdea = mongoose.models.BlogIdea || mongoose.model('BlogIdea', BlogIdeaSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const rows = await BlogIdea.find({ status: 'pending' })
    .sort({ priority: -1, created_at: 1 })
    .limit(20)
    .lean();
  console.log(JSON.stringify(rows, null, 2));
  await mongoose.disconnect();
}
main().catch(err => { console.error(err); process.exit(1); });
