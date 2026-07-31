'use strict';
/**
 * Render the hand-authored Ch.2 SVG figures, upload them to R2, and patch the
 * `src` of the matching `image` block on each page.
 *
 * Matching is by `figure_key`, so this is idempotent and safe to re-run: a
 * re-run overwrites the same R2 object and re-writes the same src.
 *
 * §0.6: this only ever sets `src` on image blocks THIS chapter's build scripts
 * created. It never removes a block, never touches another chapter, and the
 * write goes through the same `book_pages` update the build scripts use.
 *
 * Run: node scripts/physics11-book/svg/publish_ch2_figures.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const pathMod = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { withDb } = require('../../lib/book-writer');
const { FIGURES } = require('./figures_ch2');

const DRY = process.argv.includes('--dry');
const OUT_DIR = pathMod.join(__dirname, 'out');

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');

/** Cheap structural checks. These have each caught a real defect during authoring. */
function lint(key, s) {
  const issues = [];
  if (!s.startsWith('<svg')) issues.push('does not start with <svg');
  if (!s.includes('viewBox=')) issues.push('no viewBox — will not scale');
  if (/NaN|Infinity|undefined/.test(s)) issues.push('contains NaN / Infinity / undefined — a coordinate calculation failed');
  if (!/<title>/.test(s)) issues.push('no <title> — inaccessible');
  // the four sanctioned white tiers only (plus pure accent hexes)
  const badWhite = s.match(/rgba\(255,255,255,0\.(?!85|82|60|45|14|16)\d+\)/g);
  if (badWhite) issues.push('off-scale white: ' + [...new Set(badWhite)].join(', '));
  // no baked-in dark backdrop — the reader has three themes
  if (/<rect[^>]*fill="#(0|1)[0-9a-fA-F]{5}"/.test(s)) issues.push('paints a dark background rect — must stay transparent');
  const font = (s.match(/font-size="(\d+(?:\.\d+)?)"/g) || []).map((m) => Number(m.match(/[\d.]+/)[0]));
  const tooSmall = font.filter((f) => f < 11);
  if (tooSmall.length) issues.push(`font-size below 11 (${tooSmall.join(', ')}) — will not stay sharp`);
  return issues;
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const rendered = {};
  let bad = 0;
  for (const [key, fn] of Object.entries(FIGURES)) {
    let s;
    try { s = fn(); } catch (e) { console.log(`✗ ${key}: threw — ${e.message}`); bad++; continue; }
    const issues = lint(key, s);
    if (issues.length) { console.log(`✗ ${key}: ${issues.join(' · ')}`); bad++; continue; }
    rendered[key] = s;
    fs.writeFileSync(pathMod.join(OUT_DIR, `${key}.svg`), s);
    console.log(`✓ ${key}  (${(s.length / 1024).toFixed(1)} kB)`);
  }
  if (bad) { console.log(`\n❌ ${bad} figure(s) failed the lint gate — nothing uploaded.`); process.exit(1); }
  console.log(`\nrendered ${Object.keys(rendered).length} figures into ${OUT_DIR}`);

  if (DRY) { console.log('\n--dry: stopping before upload.'); process.exit(0); }
  if (!BUCKET || !PUBLIC_URL) { console.log('\n❌ R2_BUCKET_NAME / R2_PUBLIC_URL missing from .env.local'); process.exit(1); }

  await withDb(async (db) => {
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const book = await books.findOne({ slug: 'class11-physics' });
    if (!book) throw new Error('book class11-physics not found');

    const urls = {};
    for (const [key, s] of Object.entries(rendered)) {
      const storagePath = `books/${book._id}/ch2/${key}.svg`;
      await R2.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: storagePath,
        Body: Buffer.from(s, 'utf8'),
        ContentType: 'image/svg+xml',
        CacheControl: 'public, max-age=31536000, immutable',
      }));
      urls[key] = `${PUBLIC_URL}/${storagePath}`;
      console.log('uploaded', storagePath);
    }

    const docs = await pages.find({ book_id: book._id, chapter_number: 2, deleted_at: null }).toArray();
    let patched = 0, missing = [];
    for (const p of docs) {
      let changed = false;
      for (const blk of p.blocks) {
        if (blk.type !== 'image' || !blk.figure_key) continue;
        const url = urls[blk.figure_key];
        if (!url) { missing.push(`p${p.page_number}:${blk.figure_key}`); continue; }
        if (blk.src !== url) { blk.src = url; changed = true; patched++; }
        // A hand-drawn figure is not AI-generated art. Drop the stale prompt so
        // nobody later regenerates over the drawing.
        if (blk.generation_prompt) delete blk.generation_prompt;
      }
      if (changed) {
        await pages.updateOne({ _id: p._id }, { $set: { blocks: p.blocks, updated_at: new Date() } });
        console.log(`  patched p${p.page_number} · ${p.slug}`);
      }
    }
    console.log(`\n✅ ${patched} image block(s) now point at hand-drawn SVG`);
    if (missing.length) console.log('⚠ figure_key with no drawing yet:', missing.join(', '));
  });
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
