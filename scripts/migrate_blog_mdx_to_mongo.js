#!/usr/bin/env node
/*
 * One-off migration: read every .mdx file in content/blog/ and insert it into
 * the blog_posts collection with status='published'. Idempotent — skips posts
 * whose slug already exists.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI missing from .env.local');
  process.exit(1);
}

const BlogPostSchema = new mongoose.Schema({
  _id: String,
  slug: String,
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

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected');

  const blogDir = path.join(process.cwd(), 'content', 'blog');
  if (!fs.existsSync(blogDir)) {
    console.log('No content/blog directory — nothing to migrate.');
    await mongoose.disconnect();
    return;
  }

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));
  console.log(`Found ${files.length} MDX files`);

  let inserted = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '');
    const existing = await BlogPost.findOne({ slug }).lean();
    if (existing) {
      console.log(`  ↳ skip (exists): ${slug}`);
      skipped += 1;
      continue;
    }

    const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const { data, content } = matter(raw);

    const now = new Date();
    const publishedAt = data.date ? new Date(data.date) : now;

    const doc = new BlogPost({
      _id: uuidv4(),
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || '',
      content,
      cover_image: data.image ? { url: data.image, alt: data.title || '' } : undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author || 'Canvas Classes',
      status: 'published',
      source: 'manual',
      source_refs: [],
      published_at: publishedAt,
      created_at: publishedAt,
      updated_at: now,
      created_by: 'migration',
      updated_by: 'migration',
      version: 1,
      deleted_at: null,
      seo: { keywords: [] },
    });
    await doc.save();
    console.log(`  ✓ inserted: ${slug}`);
    inserted += 1;
  }

  console.log(`\nDone. Inserted ${inserted}, skipped ${skipped}.`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
