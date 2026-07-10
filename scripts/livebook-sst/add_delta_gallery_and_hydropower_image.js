'use strict';
// Founder-provided images (2026-07-09), 2 of 11 new Downloads files that are
// unambiguous exact matches:
// 1. "Should Hydropower Construction Continue Here?.png" — matches the
//    pending perspective_scenario image_prompt on glacial-landforms-and-moraines
//    exactly (real Himalayan hydropower dam in a glacial valley + 3-branch
//    decision diagram). 2 of 4 remaining pending image slots now filled.
// 2. Two real aerial delta photos (Iceland dendritic delta, a second
//    braided-delta aerial) — the "Deltas" heading on
//    rivers-waterfalls-meanders-and-deltas (block[10]) had NO image at all;
//    new 2-item gallery fills that gap. No aspect_ratio — natural sizing.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuid } = require('uuid');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const DOWNLOADS = '/Users/CanvasClasses/Downloads';
const CWEBP_QUALITY = 42;
const MAX_DIM = 2000;

async function uploadLocal(file, keyPrefix) {
  const srcPath = path.join(DOWNLOADS, file);
  const tmpOut = path.join(os.tmpdir(), `p6p8_${Date.now()}_${Math.random().toString(36).slice(2)}.webp`);
  execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-resize', String(MAX_DIM), '0', '-quiet', srcPath, '-o', tmpOut]);
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
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'founder-provided' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`  ✓ ${file} -> ${Math.round(webp.length / 1024)}KB webp`);
  return url;
}

async function main() {
  await bw.withDb(async (db) => {
    // ─── 1. Hydropower scenario image ──────────────────────────────────────
    const hydroUrl = await uploadLocal('Should Hydropower Construction Continue Here?.png', 'hydropower-scenario');
    const page8 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'glacial-landforms-and-moraines' });
    const idxScenario = page8.blocks.findIndex((b) => b.type === 'perspective_scenario');
    const updated8 = page8.blocks.map((b, i) => (i === idxScenario ? { ...b, image_src: hydroUrl } : b));
    const res8 = await bw.savePage(db, { slug: 'glacial-landforms-and-moraines' }, updated8, {
      author: 'agent',
      summary: 'Ingested founder-generated hydropower-debate scenario image into the pending perspective_scenario image_src slot',
    });
    console.log(`✓ glacial-landforms-and-moraines — hydropower scenario image set (v${res8.version})`);

    // ─── 2. Delta gallery on rivers-waterfalls-meanders-and-deltas ────────
    const deltaIcelandUrl = await uploadLocal("Stunning aerial view of a tranquil river delta merging with a blue body of water in Iceland's rugged landscape..jpg", 'delta-iceland');
    const deltaAerialUrl = await uploadLocal('Stunning aerial photo capturing intricate river patterns and earth textures.jpg', 'delta-braided');

    const page6 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'rivers-waterfalls-meanders-and-deltas' });
    const idxDeltaHeading = page6.blocks.findIndex((b) => b.type === 'heading' && b.text === 'Deltas');
    if (idxDeltaHeading === -1) throw new Error('Deltas heading not found');
    const deltaGallery = {
      id: uuid(),
      order: idxDeltaHeading + 1,
      type: 'gallery',
      items: [
        {
          id: uuid(),
          src: deltaIcelandUrl,
          alt: 'Aerial view of a real dendritic river delta merging with the sea, Iceland',
          caption: 'A real river delta from above — the classic branching, tree-like pattern as the river splits into many channels near the sea.',
        },
        {
          id: uuid(),
          src: deltaAerialUrl,
          alt: 'Aerial view of a real braided delta river system depositing sediment',
          caption: 'A braided delta system, seen from above — sediment deposited in shifting channels as the river loses energy.',
        },
      ],
    };
    // Insert right after the Deltas heading, before its text block.
    const updated6 = [
      ...page6.blocks.slice(0, idxDeltaHeading + 1),
      deltaGallery,
      ...page6.blocks.slice(idxDeltaHeading + 1),
    ].map((b, i) => ({ ...b, order: i }));

    const res6 = await bw.savePage(db, { slug: 'rivers-waterfalls-meanders-and-deltas' }, updated6, {
      author: 'agent',
      summary: 'Added a new 2-item delta gallery (real aerial photos) right after the "Deltas" heading, which previously had no image at all',
    });
    console.log(`✓ rivers-waterfalls-meanders-and-deltas — delta gallery added (v${res6.version}), page now ${updated6.length} blocks`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
