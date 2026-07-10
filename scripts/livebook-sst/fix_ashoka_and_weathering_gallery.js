'use strict';
// Founder feedback (2026-07-08, screenshot review):
// 1. The Ashoka Pillar photo (broken pillar remains, still at the Sarnath site,
//    in a fenced pit) read as confusing without context — swapping for the
//    Lion Capital of Ashoka at the Sarnath Museum, India's national emblem,
//    far more instantly recognizable. Real photo, CC0, verified before use.
// 2. Founder wants the ORIGINAL AI-illustrated "three types of weathering"
//    composite kept as the FIRST image in that gallery, before the 3 real
//    photos — recovered from book_page_versions (v5, pre-gallery-conversion);
//    the R2 asset was never deleted (platform never deletes on unlink), still
//    live, so no regeneration needed.
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
  const srcPath = path.join('/private/tmp/claude-501/-Users-CanvasClasses-Desktop-canvas/24e69260-bd31-4a25-99c6-bc375898c726/scratchpad', file);
  const tmpOut = path.join(os.tmpdir(), `fix_${Date.now()}.webp`);
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
  const storagePath = `books/${BOOK_ID}/ch1/${keyPrefix}-${uuid()}.webp`;
  await client.send(new PutObjectCommand({
    Bucket: bucketName, Key: storagePath, Body: webp, ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'real-photo-wikimedia-commons-fix' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`  ✓ ${file} -> ${Math.round(webp.length / 1024)}KB webp`);
  return url;
}

async function main() {
  await bw.withDb(async (db) => {
    // ─── 1. Swap Ashoka Pillar (Sarnath site remains) → Lion Capital (museum) ─
    const lionCapitalUrl = await uploadLocal('lion_capital.jpg', 'lion-capital-ashoka');
    const page1 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'indias-roots-in-social-thinking' });
    const idx1 = page1.blocks.findIndex((b) => b.alt && b.alt.includes('Ashoka Pillar'));
    if (idx1 === -1) throw new Error('Ashoka pillar block not found');
    const updated1 = page1.blocks.map((b, i) => (i === idx1 ? {
      ...b,
      src: lionCapitalUrl,
      alt: "The real Lion Capital of Ashoka, India's national emblem, at the Sarnath Museum",
      caption: "The Lion Capital of Ashoka — India's national emblem, carved during the Mauryan era discussed on this page. Photo: Apurv013, CC0.",
    } : b));
    const res1 = await bw.savePage(db, { slug: 'indias-roots-in-social-thinking' }, updated1, {
      author: 'agent',
      summary: 'Swapped the Ashoka Pillar site-remains photo (confusing without context) for the Lion Capital of Ashoka at Sarnath Museum — India\'s national emblem, far more recognizable',
      allowContentLoss: true,
      lossReason: 'Founder feedback: the broken-pillar-in-a-pit photo read as confusing; replacing with the iconic, instantly recognizable Lion Capital (same Mauryan/Ashoka subject, same page).',
    });
    console.log(`✓ indias-roots-in-social-thinking — swapped to Lion Capital (v${res1.version})`);

    // ─── 2. Prepend the original AI-illustrated weathering composite ────────
    const page2 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'weathering-breaking-rock-in-place' });
    const idx2 = page2.blocks.findIndex((b) => b.id === '7b121487-4b65-4b69-9506-ae44266c61c3');
    if (idx2 === -1) throw new Error('weathering gallery block not found');
    const galleryBlock = page2.blocks[idx2];
    const illustratedFirst = {
      id: uuid(),
      src: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/books/a60d142c-c96b-48cc-ba72-e68d71d83802/ch2/7b121487-4b65-4b69-9506-ae44266c61c3_gen.webp',
      alt: 'Illustrated diagram showing physical, chemical and biological weathering side by side',
      caption: 'All three types of weathering, side by side (illustration).',
    };
    const updatedGallery = { ...galleryBlock, items: [illustratedFirst, ...galleryBlock.items] };
    const updated2 = page2.blocks.map((b, i) => (i === idx2 ? updatedGallery : b));
    const res2 = await bw.savePage(db, { slug: 'weathering-breaking-rock-in-place' }, updated2, {
      author: 'agent',
      summary: 'Restored the original AI-illustrated "three types of weathering" composite as the first image in the gallery, ahead of the 3 real photos (recovered from book_page_versions v5 — R2 asset was never deleted)',
    });
    console.log(`✓ weathering-breaking-rock-in-place — prepended illustrated composite (v${res2.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
