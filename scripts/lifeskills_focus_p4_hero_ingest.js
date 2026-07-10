'use strict';
/**
 * Ingest the founder-supplied page-4 hero (the channel-collision image: a student
 * reading with earphones — words rise from the book, music notes from the ears,
 * the two streams tangle at the head). Sets src + fixes aspect_ratio to 16:5
 * (image is 2244×701 = 3.20:1; the block was mislabeled 21:9). Keeps the alt +
 * generation_prompt already set by the reprompt script.
 *
 * cwebp -q42 → R2 → book-writer (versioned). Pure field update on one block.
 *
 * Run: node scripts/lifeskills_focus_p4_hero_ingest.js
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'the-multitasking-myth';
const CHAPTER = 1;
const BLOCK_ID = 'a084e97e-587b-4500-80a4-8c75fea9137b';
const FILE = '/Users/CanvasClasses/Downloads/ChatGPT Image Jul 5, 2026, 01_31_11 AM.png';

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
    if (!target) throw new Error(`hero block ${BLOCK_ID} not found`);
    if (typeof target.src === 'string' && target.src.trim()) { console.log('⤷ already has src — skipping'); return; }

    const { url, origKB, newKB } = await uploadWebp(FILE, String(book._id));
    const newBlocks = page.blocks.map((b) =>
      b.id === BLOCK_ID ? { ...b, src: url, aspect_ratio: '16:5' } : b);

    const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
      author: 'agent',
      summary: 'ingest page-4 channel-collision hero + fix aspect_ratio 21:9→16:5',
    });
    console.log(`✓ p4 hero: v${res.version} · ${origKB}KB→${newKB}KB · ${url}`);
  });
  console.log('\n✅ Page-4 hero ingested.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
