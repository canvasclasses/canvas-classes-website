'use strict';
// Founder generated + downloaded the final 2 pending images (evidence_pack
// callout illustrations, ChatGPT-generated, matching their prompts exactly —
// verified visually before use):
// 1. "Three Clues, One Village" (how-historians-know-the-past, Ch.1) —
//    ChatGPT Image Jul 9, 2026, 06_41_28 AM.png
// 2. "Three Signals Before the Flood" (glacial-landforms-and-moraines, Ch.2) —
//    ChatGPT Image Jul 9, 2026, 08_22_17 AM.png
// This closes out the last 2 of the original 4 pending image slots.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const DOWNLOADS = '/Users/CanvasClasses/Downloads';
const CWEBP_QUALITY = 42;

async function uploadLocal(file, keyPrefix, chapterDir) {
  const srcPath = path.join(DOWNLOADS, file);
  const tmpOut = path.join(os.tmpdir(), `final_${Date.now()}.webp`);
  execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-quiet', srcPath, '-o', tmpOut]);
  const webp = fs.readFileSync(tmpOut);
  fs.unlinkSync(tmpOut);
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
  });
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
  const storagePath = `books/${BOOK_ID}/${chapterDir}/${keyPrefix}-${uuid()}.webp`;
  await client.send(new PutObjectCommand({
    Bucket: bucketName, Key: storagePath, Body: webp, ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'chatgpt-generation' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`  ✓ ${file} -> ${Math.round(webp.length / 1024)}KB webp`);
  return url;
}

async function main() {
  await bw.withDb(async (db) => {
    // ─── 1. Three Clues, One Village (Ch.1) ────────────────────────────────
    const cluesUrl = await uploadLocal('ChatGPT Image Jul 9, 2026, 06_41_28 AM.png', 'three-clues-village', 'ch1');
    const page1 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'how-historians-know-the-past' });
    const idx1 = page1.blocks.findIndex((b) => b.type === 'callout' && b.title === 'Three Clues, One Village');
    if (idx1 === -1) throw new Error('Three Clues callout not found');
    const updated1 = page1.blocks.map((b, i) => (i === idx1 ? { ...b, image_src: cluesUrl } : b));
    const res1 = await bw.savePage(db, { slug: 'how-historians-know-the-past' }, updated1, {
      author: 'agent',
      summary: 'Ingested the ChatGPT-generated "Three Clues, One Village" image into the pending evidence_pack callout image_src slot',
    });
    console.log(`✓ how-historians-know-the-past — image set (v${res1.version})`);

    // ─── 2. Three Signals Before the Flood (Ch.2) ──────────────────────────
    const signalsUrl = await uploadLocal('ChatGPT Image Jul 9, 2026, 08_22_17 AM.png', 'three-signals-flood', 'ch2');
    const page2 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'glacial-landforms-and-moraines' });
    const idx2 = page2.blocks.findIndex((b) => b.type === 'callout' && b.title === 'Three Signals Before the Flood');
    if (idx2 === -1) throw new Error('Three Signals callout not found');
    const updated2 = page2.blocks.map((b, i) => (i === idx2 ? { ...b, image_src: signalsUrl } : b));
    const res2 = await bw.savePage(db, { slug: 'glacial-landforms-and-moraines' }, updated2, {
      author: 'agent',
      summary: 'Ingested the ChatGPT-generated "Three Signals Before the Flood" image into the pending evidence_pack callout image_src slot — this closes out the last of the 4 originally-pending image slots',
    });
    console.log(`✓ glacial-landforms-and-moraines — image set (v${res2.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
