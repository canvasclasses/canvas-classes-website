'use strict';
/**
 * Ingest the founder-supplied page-3 infographic into its image block.
 *
 * The founder designed a different image than the planned diptych — an
 * "How social apps pull you back" six-step hook-loop infographic — and wants it
 * inserted. Same compression (cwebp -q42) + R2 path as _ingest_lifeskills.js, but
 * ALSO rewrites the block's `alt` + `generation_prompt` (they still described the
 * abandoned diptych). Single versioned book-writer write; pure field update on one
 * block (no removals) so no content-loss flag is needed.
 *
 * Run: node scripts/lifeskills_focus_p3_image_ingest.js
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'why-reels-feel-impossible-to-stop';
const CHAPTER = 1;
const BLOCK_ID = '2a601bd9-aa0a-4ef3-a29d-6276d192433f';
const FILE = '/Users/CanvasClasses/Downloads/ChatGPT Image Jul 5, 2026, 12_16_44 AM.png';

const NEW_ALT =
  "Infographic titled 'How social apps pull you back': a six-step loop — 1) you drift away, 2) the app notices, " +
  "3) it sends a timed notification, 4) you check, 5) you get tiny variable rewards, 6) you're back in the loop — " +
  "circling a central phone. A side panel, 'The Hook Triad', lists Timing (right moment, right nudge), Curiosity " +
  "(open loops demand closure), and Variable reward (small hits, big impact). Footer: 'Not innocent. Not random. Designed.'";
const NEW_PROMPT =
  "Founder-supplied infographic (designed externally, not agent-generated). Concept: 'How social apps pull you back' — " +
  "a six-step hook loop (drift away → app notices → timed ping → you check → tiny rewards → back in the loop) plus " +
  'The Hook Triad panel (Timing / Curiosity / Variable reward). Replaces the earlier puppet-student|notification-anatomy diptych concept.';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

async function uploadWebp(file, bookId) {
  const tmp = path.join(os.tmpdir(), `ls_${BLOCK_ID}_${process.pid}.webp`);
  execFileSync('cwebp', ['-q', '42', '-quiet', file, '-o', tmp]);
  const webp = fs.readFileSync(tmp); fs.unlinkSync(tmp);
  const origKB = Math.round(fs.statSync(file).size / 1024), newKB = Math.round(webp.length / 1024);
  const bucket = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const base = process.env.R2_PUBLIC_URL || `https://${bucket}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
  const key = `books/${bookId}/ch${CHAPTER}/${BLOCK_ID}_gen.webp`;
  await r2.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: webp, ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'lifeskills-focus' } }));
  return { url: `${base}/${key}`, origKB, newKB };
}

async function main() {
  if (!fs.existsSync(FILE)) throw new Error(`missing file: ${FILE}`);
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book not found');
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
    if (!page) throw new Error('page not found');

    const target = page.blocks.find((b) => b.id === BLOCK_ID);
    if (!target) throw new Error(`block ${BLOCK_ID} not found on page`);
    if (typeof target.src === 'string' && target.src.trim()) { console.log('⤷ already has src — skipping'); return; }

    const { url, origKB, newKB } = await uploadWebp(FILE, String(book._id));
    const newBlocks = page.blocks.map((b) =>
      b.id === BLOCK_ID ? { ...b, src: url, alt: NEW_ALT, caption: '', generation_prompt: NEW_PROMPT } : b);

    const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
      author: 'agent',
      summary: 'ingest founder-supplied page-3 infographic ("How social apps pull you back") + update alt/prompt',
    });
    console.log(`✓ p3 infographic: v${res.version} · ${origKB}KB→${newKB}KB · ${url}`);
  });
  console.log('\n✅ Page-3 image ingested.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
