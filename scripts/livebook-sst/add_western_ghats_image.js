'use strict';
// Founder-generated image (2026-07-08): `western ghat.png` in Downloads,
// matching the pending `image_prompt` on the "How Much of the Western Ghats
// Should Be Protected?" perspective_scenario block exactly (aerial Western
// Ghats photo + Gadgil vs. Kasturirangan zone map + 2010-2013 timeline strip).
// This is 1 of the 4 pending AI-image slots identified earlier this session.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuid } = require('uuid');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const CWEBP_QUALITY = 42;

async function uploadLocal(file, keyPrefix) {
  const srcPath = path.join('/Users/CanvasClasses/Downloads', file);
  const tmpOut = path.join(os.tmpdir(), `wg_${Date.now()}.webp`);
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
  const storagePath = `books/${BOOK_ID}/ch2/${keyPrefix}-${uuid()}.webp`;
  await client.send(new PutObjectCommand({
    Bucket: bucketName, Key: storagePath, Body: webp, ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'founder-provided-chatgpt-generation' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`  ✓ ${file} -> ${Math.round(webp.length / 1024)}KB webp`);
  return url;
}

async function main() {
  await bw.withDb(async (db) => {
    const url = await uploadLocal('western ghat.png', 'western-ghats-scenario');
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'landforms-and-disasters' });
    const idx = page.blocks.findIndex((b) => b.id === '15ca8370-d2f0-4cd8-ae92-f1b9513e32bd');
    if (idx === -1) throw new Error('perspective_scenario block not found');
    const updated = page.blocks.map((b, i) => (i === idx ? { ...b, image_src: url } : b));
    const res = await bw.savePage(db, { slug: 'landforms-and-disasters' }, updated, {
      author: 'agent',
      summary: 'Ingested founder-generated Western Ghats scenario image (Gadgil vs. Kasturirangan zone map + timeline) into the pending perspective_scenario image_src slot',
    });
    console.log(`✓ landforms-and-disasters — Western Ghats scenario image set (v${res.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
