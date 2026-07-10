'use strict';
// Adds a real-photo gallery to the "landforms-and-disasters" page (founder
// request, 2026-07-08): the page names 4 disaster types (landslides,
// avalanches, GLOFs, dust storms) with zero supporting imagery. Rather than 4
// separate image blocks (would push the page past the 18-block convention),
// one `gallery` block with 4 items. Sourced as REAL, openly-licensed
// photographs from Wikimedia Commons (per founder: search free image sites
// first, only generate via ChatGPT for what can't be found) — not AI-generated.
// License/attribution verified per-image before use; required attributions are
// included in each item's caption since the schema has no separate credit field.
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuid } = require('uuid');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const CWEBP_QUALITY = 42; // matches scripts/livebook-images/ingest.js's calibrated setting
const SRC_DIR = '/private/tmp/claude-501/-Users-CanvasClasses-Desktop-canvas/24e69260-bd31-4a25-99c6-bc375898c726/scratchpad/disaster_images';

const ITEMS = [
  {
    file: 'landslide.jpg',
    alt: 'A real landslide in Nagaland, India, showing broken rock and debris on a hillside',
    caption: 'A real landslide in Nagaland, India. Photo: Ganesh Mohan T, Wikimedia Commons, CC BY-SA 4.0.',
  },
  {
    file: 'avalanche.jpg',
    alt: 'A powder snow avalanche cascading down a mountainside in the Himalayas near Mount Everest',
    caption: 'A real powder-snow avalanche in the Himalayas, near Mount Everest. Photo: Ilan Adler, public domain.',
  },
  {
    file: 'glof.jpg',
    alt: "Before-and-after satellite images of Pakistan's Shishpar glacier showing the glacial lake draining in a real GLOF event, 5 and 10 May 2022",
    caption: "A real GLOF at Shishpar glacier, Pakistan — the glacial lake visibly drains between 5 and 10 May 2022. Contains modified Copernicus Sentinel data 2022.",
  },
  {
    file: 'duststorm.jpg',
    alt: 'A wall of dust from a real dust storm approaching the BITS Pilani campus in Rajasthan, India',
    caption: 'A real dust storm approaching BITS Pilani, Rajasthan. Photo: Sanyam.wikime, Wikimedia Commons, CC BY-SA 4.0.',
  },
];

async function main() {
  await bw.withDb(async (db) => {
    const accountId = process.env.R2_ACCOUNT_ID;
    const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
    const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${accountId}.r2.dev`;
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    const galleryId = uuid();
    const items = [];
    for (const item of ITEMS) {
      const srcPath = path.join(SRC_DIR, item.file);
      const tmpOut = path.join(os.tmpdir(), `gallery_${Date.now()}_${item.file}.webp`);
      execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-quiet', srcPath, '-o', tmpOut]);
      const webp = fs.readFileSync(tmpOut);
      fs.unlinkSync(tmpOut);
      const origKB = Math.round(fs.statSync(srcPath).size / 1024);
      const newKB = Math.round(webp.length / 1024);

      const itemId = uuid();
      const storagePath = `books/${BOOK_ID}/ch2/${galleryId}_${itemId}.webp`;
      await client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: storagePath,
        Body: webp,
        ContentType: 'image/webp',
        Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'real-photo-wikimedia-commons' },
      }));
      const url = `${publicBase}/${storagePath}`;
      console.log(`OK  ${item.file}  (${origKB}KB -> ${newKB}KB webp)  ${url}`);
      items.push({ id: itemId, src: url, alt: item.alt, caption: item.caption });
    }

    const galleryBlock = {
      id: galleryId,
      type: 'gallery',
      order: 0,
      items,
      aspect_ratio: '4:3',
    };

    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'landforms-and-disasters' });
    const idx = page.blocks.findIndex((b) => b.id === 'fa2414f7-94d8-46e8-9d85-55bf9a8d879c'); // last disaster-type text block (Dust Storms)
    if (idx === -1) throw new Error('anchor not found');
    const updated = [...page.blocks.slice(0, idx + 1), galleryBlock, ...page.blocks.slice(idx + 1)]
      .map((b, i) => ({ ...b, order: i }));
    const res = await bw.savePage(db, { slug: 'landforms-and-disasters' }, updated, {
      author: 'agent',
      summary: 'Added a 4-item real-photo gallery (landslide, avalanche, GLOF, dust storm) sourced from Wikimedia Commons, right after the four disaster-type text sections',
    });
    console.log(`✓ landforms-and-disasters — inserted gallery with ${items.length} real photos (v${res.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
