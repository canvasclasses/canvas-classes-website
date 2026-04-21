#!/usr/bin/env node
/*
 * Daily RSS fetcher. Pulls every feed in feeds.json, parses items, and writes
 * new ones to blog_sources (dedupe by URL hash). No LLM calls — this is the
 * deterministic "gather" step. Relevance scoring and drafting happen in a
 * separate stage (either Claude Code's scheduled task or a human-triggered
 * pass).
 *
 * Usage:
 *   node scripts/blog/fetch_rss.js                # last 48h of items
 *   node scripts/blog/fetch_rss.js --hours 72     # last N hours
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Parser = require('rss-parser');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI missing from .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);
const hoursIdx = args.indexOf('--hours');
const lookbackHours = hoursIdx >= 0 ? parseInt(args[hoursIdx + 1], 10) : 48;
const cutoff = Date.now() - lookbackHours * 60 * 60 * 1000;

const BlogSourceSchema = new mongoose.Schema({
  _id: String,
  url: String,
  url_hash: { type: String, unique: true },
  source_name: String,
  title: String,
  summary: String,
  categories: [String],
  fetched_at: Date,
  published_at: Date,
  relevance_score: Number,
  relevance_reason: String,
  status: String,
  used_in_post: String,
}, { collection: 'blog_sources', _id: false });
const BlogSource = mongoose.models.BlogSource || mongoose.model('BlogSource', BlogSourceSchema);

function hashUrl(url) {
  return crypto.createHash('sha256').update(url.trim().toLowerCase()).digest('hex').slice(0, 32);
}

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const feedsPath = path.join(process.cwd(), 'scripts', 'blog', 'feeds.json');
  const feedsConfig = JSON.parse(fs.readFileSync(feedsPath, 'utf8'));
  const feeds = feedsConfig.feeds || [];

  await mongoose.connect(MONGODB_URI);
  console.log(`✓ Connected. Pulling ${feeds.length} feeds (last ${lookbackHours}h)…\n`);

  const parser = new Parser({ timeout: 15000, headers: { 'User-Agent': 'CanvasClassesBot/1.0' } });

  let totalNew = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      let added = 0;
      for (const item of parsed.items || []) {
        const url = item.link || item.guid;
        if (!url) continue;

        const pubDate = item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : null);
        if (pubDate && pubDate.getTime() < cutoff) continue;

        const url_hash = hashUrl(url);
        const existing = await BlogSource.findOne({ url_hash }).lean();
        if (existing) { totalSkipped += 1; continue; }

        const summary = stripHtml(item.contentSnippet || item.content || item.summary || '').slice(0, 1500);

        await new BlogSource({
          _id: uuidv4(),
          url,
          url_hash,
          source_name: feed.name,
          title: stripHtml(item.title || '').slice(0, 400) || url,
          summary,
          categories: feed.categories || [],
          fetched_at: new Date(),
          published_at: pubDate || undefined,
          relevance_score: 0,
          relevance_reason: '',
          status: 'new',
        }).save();

        added += 1;
        totalNew += 1;
      }
      console.log(`  ${feed.name.padEnd(30)} +${added} new`);
    } catch (err) {
      totalFailed += 1;
      console.warn(`  ${feed.name.padEnd(30)} FAILED: ${err.message || err}`);
    }
  }

  console.log(`\nSummary: +${totalNew} new · ${totalSkipped} duplicates · ${totalFailed} failed feeds`);
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
