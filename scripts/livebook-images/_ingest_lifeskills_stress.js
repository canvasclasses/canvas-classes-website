'use strict';
/**
 * Ingest generated Stress-module (Ch.2) images into their blocks.
 *
 * Same compression (cwebp -q42) + R2 upload path as ingest.js, but writes the
 * block `src` through scripts/lib/book-writer.js (versioned + content-loss
 * guarded + audited) AND handles images nested inside `section` columns — which
 * the stock ingest.js positional-arrayFilter update cannot reach.
 *
 * Mapping was built by opening EVERY downloaded PNG and content-matching it to
 * its block (founder downloaded manually, not in generation order — 2 files
 * turned out to be from an unrelated Social Science batch mixed into the same
 * Downloads folder and were excluded; block-order-4's image was downloaded
 * last, out of sequence). Idempotent: only fills an empty src; skips a block
 * that already has one.
 *
 * Run: node scripts/livebook-images/_ingest_lifeskills_stress.js
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
const CHAPTER = 2;

const D = '/Users/CanvasClasses/Downloads';
const JOBS = [
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_20_28 AM.png`, blockId: '138e4b52-ef3f-47b1-ab27-f101de2e27d5', what: 'p1 hero — lighthouse keeper watching storm (16:5)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_20_39 AM.png`, blockId: 'c600b4d2-8169-4bc1-b6df-25eb7ddfab7d', what: 'p1 side — brass alarm bell + exam clock, ONE SWITCH ONE ALARM (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_20_48 AM.png`, blockId: '3e2b0c1c-4586-47df-9aed-621c4dd08578', what: 'p1 side — student + adult, warm thread of light (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_21_04 AM.png`, blockId: '04368187-78cf-4c55-a00b-2229eee3d7a6', what: 'p2 hero — chest control room, two figures at heart/lung levers (16:5)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_37_30 AM.png`, blockId: '7e55f7f5-2abf-451d-824a-5dec7f2e363b', what: 'p2 side — brain lightning-bolt to heart and stomach (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_27_23 AM.png`, blockId: '37657341-86a9-4b28-b682-1c992db35628', what: 'p2 side — ancient hunters vs exam student, matching alarm marks (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_27_47 AM.png`, blockId: 'e2d313d4-18cf-43c2-8990-b29fb917b867', what: 'p3 hero — tightrope walker between calm and chaotic towers (16:5)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_27_57 AM.png`, blockId: '661005d6-a6d6-48c1-9fa5-d79fd68ec91c', what: 'p3 side — performance curve, low/high stress faces (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_32_32 AM.png`, blockId: '9f75cc67-fd62-496e-b90f-57df34eeded7', what: 'p3 side — archer centred amid cheering/jeering crowd (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_32_53 AM.png`, blockId: '77054dcf-d494-456b-823a-bf0a08325c31', what: 'p4 hero — smoke detector blaring in undamaged household (16:5)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_33_05 AM.png`, blockId: 'a0dada54-7d6a-457b-b97a-3edafcf55fec', what: 'p4 side — weightlifters, one resting one straining (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_33_17 AM.png`, blockId: '5d0bd420-f38f-45c2-a103-9af00165dd41', what: 'p4 side — two potted plants, healthy vs wilting (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_33_34 AM.png`, blockId: '3b738f06-f7fe-4dd8-9636-ee8e0f71e3cb', what: 'p5 hero — lungs as ocean waves + heart + BREATH/SPIKE dials (16:5)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_33_43 AM.png`, blockId: 'd379e1b6-1dbd-4b03-b945-4a033ab97dd1', what: 'p5 side — control dial, CALM PRACTICE / SUDDEN SPIKE (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_33_54 AM.png`, blockId: '686de34d-feec-4669-b790-de6114e2a30d', what: 'p5 side — hand tucking breathing card into blazer pocket (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_34_21 AM.png`, blockId: '73ad0877-8b9f-4860-87ba-00cccb036969', what: 'p6 hero — two birds on branch, one eating one watching (16:5)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_34_43 AM.png`, blockId: '03e50525-8524-4580-b2b4-6808c486455b', what: 'p6 side — tangled yarn vs SAGE/CLAY/DUSKY BLUE spools (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_34_53 AM.png`, blockId: 'd7892427-74ff-4af2-b70b-eaeed915f282', what: 'p6 side — calm figure watching a worry thought-cloud (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_35_06 AM.png`, blockId: 'd6093358-3c96-4c59-a28d-dcc96b78b2b8', what: 'p7 hero — boulder unmoved in rushing river (16:5)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_35_20 AM.png`, blockId: '3ee5d721-1504-474f-b5c6-ff74557134af', what: 'p7 side — tally counter/dumbbell split with boulder in stream (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_35_35 AM.png`, blockId: 'b69de06f-21ca-4b61-ae9f-770042083ed7', what: 'p7 side — boulder under divided rain/sunshine sky (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_35_47 AM.png`, blockId: '706756e3-118e-45a9-bdae-e6d97d0d3a76', what: 'p8 hero — calm-down kit toolbox, candle/note/phone (16:5)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_35_58 AM.png`, blockId: '442ca7e6-6727-4dd8-9115-8bd887bb26bc', what: 'p8 side — fire extinguisher, Be Ready Stay Calm sign (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_36_16 AM.png`, blockId: '3a86f8f8-4138-4c01-b0d7-f61cd7e505b1', what: 'p8 side — student and mentor on park bench (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_36_27 AM.png`, blockId: '51e80fc0-a5e3-4730-881d-5055ebf6befd', what: 'p9 hero — boulder + 7-stone cairn, dawn light (16:5)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_36_43 AM.png`, blockId: '6eb9905b-e2d7-4124-b0b3-3e179560bd29', what: 'p9 side — toolbox keepsakes: dial charm, thread spool, stone charm (4:3)' },
  { file: `${D}/ChatGPT Image Jul 9, 2026, 08_36_54 AM.png`, blockId: 'd0780d91-e52d-4684-acd7-837dbc341d14', what: 'p9 side — hand placing a stone back onto the cairn (4:3)' },
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
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'lifeskills-stress' } }));
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
