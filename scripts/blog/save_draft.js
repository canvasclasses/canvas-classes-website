#!/usr/bin/env node
/*
 * Saves a draft blog post directly to MongoDB. Used by the daily scheduled
 * workflow to persist drafts into status='review'. Reads the JSON payload
 * from stdin (so newlines/backticks in the MDX body don't explode the shell).
 *
 * Usage:
 *   cat draft.json | node scripts/blog/save_draft.js
 *   node scripts/blog/save_draft.js < draft.json
 *
 * Expected JSON shape:
 *   {
 *     "title": "...",
 *     "slug": "optional-slug-or-auto",
 *     "excerpt": "...",
 *     "content": "markdown/MDX body",
 *     "tags": ["JEE", "NEET"],
 *     "source": "rss" | "idea" | "manual",
 *     "source_refs": ["<BlogSource _id>"],
 *     "idea_id": "<BlogIdea _id>",              // optional
 *     "cover_image": { "url": "...", "alt": "" } // optional
 *   }
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI missing'); process.exit(1); }

const BlogPostSchema = new mongoose.Schema({
  _id: String,
  slug: { type: String, unique: true },
  title: String,
  excerpt: String,
  content: String,
  cover_image: { url: String, alt: String },
  tags: [String],
  author: String,
  status: String,
  source: String,
  source_refs: [String],
  idea_id: String,
  scheduled_for: Date,
  published_at: Date,
  seo: { title: String, description: String, keywords: [String] },
  version: Number,
  created_at: Date,
  updated_at: Date,
  created_by: String,
  updated_by: String,
  deleted_at: Date,
}, { collection: 'blog_posts', _id: false });
const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

const BlogSourceSchema = new mongoose.Schema({}, { strict: false, collection: 'blog_sources', _id: false });
const BlogSource = mongoose.models.BlogSource || mongoose.model('BlogSource', BlogSourceSchema);

const BlogIdeaSchema = new mongoose.Schema({}, { strict: false, collection: 'blog_ideas', _id: false });
const BlogIdea = mongoose.models.BlogIdea || mongoose.model('BlogIdea', BlogIdeaSchema);

function slugify(t) {
  return (t || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);
}

async function readStdin() {
  return new Promise((resolve, reject) => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', c => { buf += c; });
    process.stdin.on('end', () => resolve(buf));
    process.stdin.on('error', reject);
  });
}

async function main() {
  const raw = await readStdin();
  if (!raw.trim()) { console.error('No JSON on stdin'); process.exit(1); }

  let payload;
  try { payload = JSON.parse(raw); } catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(1);
  }

  if (!payload.title || !payload.content) {
    console.error('title and content are required');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const baseSlug = slugify(payload.slug || payload.title);
  let slug = baseSlug;
  let n = 0;
  while (await BlogPost.findOne({ slug }).lean()) {
    n += 1;
    slug = `${baseSlug}-${n}`;
    if (n > 30) break;
  }

  const now = new Date();
  const doc = new BlogPost({
    _id: uuidv4(),
    slug,
    title: String(payload.title).trim().slice(0, 240),
    excerpt: (payload.excerpt || payload.title).toString().slice(0, 500),
    content: String(payload.content),
    cover_image: payload.cover_image && payload.cover_image.url
      ? { url: payload.cover_image.url, alt: payload.cover_image.alt || '' }
      : undefined,
    tags: Array.isArray(payload.tags) ? payload.tags.slice(0, 20) : [],
    author: payload.author || 'Canvas Classes',
    status: 'review',
    source: ['manual', 'rss', 'idea'].includes(payload.source) ? payload.source : 'rss',
    source_refs: Array.isArray(payload.source_refs) ? payload.source_refs.slice(0, 10) : [],
    idea_id: payload.idea_id || null,
    seo: payload.seo || { keywords: [] },
    version: 1,
    created_at: now,
    updated_at: now,
    created_by: payload.created_by || 'daily-cron',
    updated_by: payload.created_by || 'daily-cron',
    deleted_at: null,
  });
  await doc.save();

  // Mark referenced sources as drafted
  if (Array.isArray(payload.source_refs)) {
    for (const sid of payload.source_refs) {
      await BlogSource.updateOne({ _id: sid }, { $set: { status: 'drafted', used_in_post: doc._id } });
    }
  }

  // Mark idea as drafted
  if (payload.idea_id) {
    await BlogIdea.updateOne({ _id: payload.idea_id }, { $set: { status: 'drafted', drafted_post_id: doc._id } });
  }

  console.log(JSON.stringify({ success: true, id: doc._id, slug: doc.slug }));
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
