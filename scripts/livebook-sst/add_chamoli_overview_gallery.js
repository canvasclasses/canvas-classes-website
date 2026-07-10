'use strict';
// Founder-provided Chamoli disaster overview gallery (2026-07-08) — 3
// founder-designed infographic images (overview/facts, downstream path map,
// damage & impact), placed right after the hero on glacial-landforms-and-moraines
// (the page with the most Chamoli content: quest_continues callout, the
// evidence_pack "Three Signals," and the "Should Hydropower Construction
// Continue Here?" perspective_scenario). These are the founder's own assets,
// not sourced by the agent — no external license/attribution needed. Distinct
// from the 2 still-pending placeholder prompts already on this page (Three
// Signals + hydropower debate), which remain pending for a future ChatGPT pass.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuid } = require('uuid');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const CWEBP_QUALITY = 42;
const DOWNLOADS = '/Users/CanvasClasses/Downloads';

async function upload(file, keyPrefix) {
  const srcPath = path.join(DOWNLOADS, file);
  const tmpOut = path.join(os.tmpdir(), `chamoli_${Date.now()}_${Math.random().toString(36).slice(2)}.webp`);
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
  const storagePath = `books/${BOOK_ID}/ch2/chamoli-overview-${keyPrefix}-${uuid()}.webp`;
  await client.send(new PutObjectCommand({
    Bucket: bucketName, Key: storagePath, Body: webp, ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'founder-provided-chamoli-overview' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`  ✓ ${file} -> ${Math.round(webp.length / 1024)}KB webp`);
  return url;
}

async function main() {
  await bw.withDb(async (db) => {
    console.log('Uploading founder-provided Chamoli overview images...');
    const urls = {
      overview: await upload('chamoli 1.png', 'overview'),
      path: await upload('chamoli 2.png', 'path'),
      damage: await upload('chamoli 3.png', 'damage'),
    };

    const gallery = {
      id: uuid(),
      type: 'gallery',
      order: 0,
      items: [
        { id: uuid(), src: urls.overview, alt: '2021 Uttarakhand flood overview: 7 February 2021, Chamoli district, caused by a rock-ice avalanche from Ronti Peak', caption: 'The 2021 Chamoli disaster at a glance.' },
        { id: uuid(), src: urls.path, alt: 'Map of the flood\'s downstream path from Ronti Peak through Rishiganga, Dhauliganga, Reni, Tapovan and Joshimath, via the Alaknanda river', caption: 'How the flood travelled downstream — avalanche → debris flood → flash flood.' },
        { id: uuid(), src: urls.damage, alt: 'Damage and impact of the Chamoli disaster: over 200 killed or missing, the Tapovan Vishnugad hydropower project damaged, 13 villages\' bridge access lost, ₹1,500 crore in losses', caption: 'The real scale of the damage.' },
      ],
      aspect_ratio: '16:9',
    };

    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'glacial-landforms-and-moraines' });
    const idx = page.blocks.findIndex((b) => b.id === 'ee21ef2c-4d98-4f13-8a1d-e55e806acfc1'); // hero
    if (idx === -1) throw new Error('hero not found');
    const updated = [...page.blocks.slice(0, idx + 1), gallery, ...page.blocks.slice(idx + 1)]
      .map((b, i) => ({ ...b, order: i }));
    const res = await bw.savePage(db, { slug: 'glacial-landforms-and-moraines' }, updated, {
      author: 'agent',
      summary: 'Added founder-provided 3-image Chamoli disaster overview gallery right after the hero (overview/facts, downstream path, damage & impact)',
    });
    console.log(`✓ glacial-landforms-and-moraines — inserted Chamoli overview gallery (v${res.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
