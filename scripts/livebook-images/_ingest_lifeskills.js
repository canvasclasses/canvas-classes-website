'use strict';
/**
 * Ingest generated Focus-module images into their blocks.
 *
 * Same compression (cwebp -q42) + R2 upload path as ingest.js, but writes the
 * block `src` through scripts/lib/book-writer.js (versioned + content-loss
 * guarded + audited) AND handles images nested inside `section` columns — which
 * the stock ingest.js positional-arrayFilter update cannot reach.
 *
 * Mapping is passed inline (verified 1:1 on-screen before running). Idempotent:
 * only fills an empty src; skips a block that already has one.
 *
 * Run: node scripts/livebook-images/_ingest_lifeskills.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env.local') });
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('../lib/book-writer');

const CWEBP_QUALITY = 42;
const BOOK_SLUG = 'life-skills-class-9';
const CHAPTER = 1;

// Verified mapping — each PNG opened and content-matched 1:1 to its block.
// Batch 2 (images 16-28), all verified 2026-07-04.
const D = '/Users/CanvasClasses/Downloads';
const JOBS = [
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_19_04 PM.png`, blockId: '67d89b90-e198-4b89-8c9b-0d4186412761', what: 'p6 hero — lungs as ocean waves + BREATH dial (16:5)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_19_10 PM.png`, blockId: '0d57d964-8731-4557-9a86-9a53c62df0cd', what: 'p6 side — sealed HEART/SWEAT/STOMACH dials + BREATH dial (4:3)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_19_16 PM.png`, blockId: '53817ef7-d452-47f9-9962-582e315161aa', what: 'p6 side — 4-4-6 breathing curve (4:3)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_19_23 PM.png`, blockId: '8d0e8870-d73d-4249-afc5-b1fe648cb836', what: 'p7 hero — cluttered desk vs calm desk (16:5)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_19_37 PM.png`, blockId: '4dc21960-118c-4120-92cd-3f7526788af2', what: 'p7 side — attention threads to phone/calendar/snacks (4:3)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_19_43 PM.png`, blockId: 'e9d62937-ff30-4411-8a81-51a83cf36383', what: 'p7 side — one step to book, 5 steps to phone (4:3)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_19_50 PM.png`, blockId: 'c51623c0-2844-4f41-ad79-05d845ebd563', what: 'p8 hero — hourglass + notebook + PARKING LOT (16:5)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_19_55 PM.png`, blockId: 'c178bc3e-a662-4dce-8dd0-98d40715a5c4', what: 'p8 side — runner on track marked 25 (4:3)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_19_59 PM.png`, blockId: '3d4cdba4-a396-40bc-83e2-6ef2365151a4', what: 'p8 side — paper-bird thoughts on parking list (4:3)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_20_05 PM.png`, blockId: '32f66346-f7bd-48e3-b7a4-92f1df54264b', what: 'p9 hero — sleeping student + librarian + PERMANENT shelf (16:5)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_20_11 PM.png`, blockId: 'ab6e1709-e9f8-4d76-b2a5-de9099ca427c', what: 'p9 side — ROUGH WORK → PERMANENT LEDGER (4:3)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_20_16 PM.png`, blockId: '8f41b285-f888-4f42-bcf8-0f3e28393dfe', what: 'p9 side — phone-thief with SLEEP / STOLEN PAGES sacks (4:3)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 04_20_37 PM.png`, blockId: 'b3365368-fcac-4314-893b-336e14d6fe94', what: 'p10 hero — seven stepping stones toward sunrise (16:5)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 05_24_28 PM.png`, blockId: '064894cc-64f0-4ba7-ac8f-4a450946eb27', what: 'p10 side — TOOLS FOR THE JOURNEY toolbox (4:3)' },
  { file: `${D}/ChatGPT Image Jul 4, 2026, 05_24_33 PM.png`, blockId: '497a9567-6bfc-4b73-8fdc-40b455c57e6e', what: 'p10 side — 7-box MON-SUN tracker with restart arrow (4:3)' },
];

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

async function uploadWebp(file, bookId, blockId) {
  const tmp = path.join(os.tmpdir(), `ls_${blockId}_${process.pid}.webp`);
  execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-quiet', file, '-o', tmp]);
  const webp = fs.readFileSync(tmp); fs.unlinkSync(tmp);
  const origKB = Math.round(fs.statSync(file).size / 1024), newKB = Math.round(webp.length / 1024);
  const bucket = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const base = process.env.R2_PUBLIC_URL || `https://${bucket}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
  const key = `books/${bookId}/ch${CHAPTER}/${blockId}_gen.webp`;
  await r2.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: webp, ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'lifeskills-focus' } }));
  return { url: `${base}/${key}`, origKB, newKB };
}

// Deep-set src on a block by id — top-level OR nested in a section column. Returns
// {found, alreadyHad, newBlocks}. Never mutates the input.
function setSrcDeep(blocks, blockId, url) {
  let found = false, alreadyHad = false;
  const doImg = (b) => {
    if (b.id !== blockId) return b;
    found = true;
    if (typeof b.src === 'string' && b.src.trim()) { alreadyHad = true; return b; }
    return { ...b, src: url };
  };
  const newBlocks = blocks.map((b) => {
    if (b.type === 'image') return doImg(b);
    if (b.type === 'section' && Array.isArray(b.columns)) {
      return { ...b, columns: b.columns.map((col) => col.map((cb) => (cb.type === 'image' ? doImg(cb) : cb))) };
    }
    return b;
  });
  return { found, alreadyHad, newBlocks };
}

async function main() {
  for (const f of JOBS) if (!fs.existsSync(f.file)) throw new Error(`missing file: ${f.file}`);
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book not found');
    for (const job of JOBS) {
      // Re-fetch fresh EACH iteration — multiple images can live on one page, and
      // a stale copy would silently drop a sibling image written moments earlier
      // (the content-loss guard blocks exactly that). Scan with the deep probe to
      // handle section-column-nested blocks (array-of-arrays).
      const allPages = await db.collection('book_pages').find({ book_id: String(book._id) }).toArray();
      const page = allPages.find((p) => setSrcDeep(p.blocks, job.blockId, '__probe__').found);
      if (!page) { console.error(`✗ ${job.what}: no page holds block ${job.blockId.slice(0, 8)}`); continue; }
      const probe = setSrcDeep(page.blocks, job.blockId, '__probe__');
      if (probe.alreadyHad) { console.log(`⤷ ${job.what}: already has src — skipping`); continue; }

      const { url, origKB, newKB } = await uploadWebp(job.file, String(book._id), job.blockId);
      const { newBlocks } = setSrcDeep(page.blocks, job.blockId, url);
      const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
        author: 'agent', summary: `ingest image ${job.blockId.slice(0, 8)} (${job.what})`,
      });
      console.log(`✓ ${job.what}: v${res.version} · ${origKB}KB→${newKB}KB · ${url}`);
    }
  });
  console.log('\n✅ Ingest complete.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
