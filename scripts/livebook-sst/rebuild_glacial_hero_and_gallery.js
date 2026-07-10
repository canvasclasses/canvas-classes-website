'use strict';
// Founder feedback (2026-07-09, AskUserQuestion): the new labeled
// "Glacial Landforms & Moraines" diagram should join the existing gallery;
// the hero should switch from the AI illustration to a real downloaded
// photo; and "the gallery images on page 8 are not great, replace them with
// my downloaded ones" — the old 3 (Skye arête, Wyoming cirque, Ladakh
// U-valley) are replaced (not appended to) by the diagram + all 5 new real
// photos. Old gallery assets unlinked, not deleted, per platform policy.
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
  const tmpOut = path.join(os.tmpdir(), `glacial_${Date.now()}_${Math.random().toString(36).slice(2)}.webp`);
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
    const diagramUrl = await uploadLocal('ChatGPT Image Jul 9, 2026, 05_35_18 AM.png', 'glacial-landforms-diagram');
    const kashmirUrl = await uploadLocal('glacier in kashmir.jpg', 'glacier-kashmir');
    const franceUrl = await uploadLocal('Dramatic mountain peaks and clouds create a mystical alpine landscape in France.jpg', 'glacier-france-alps');
    const zanskarUrl = await uploadLocal('snow-covered Himalayan mountains and frozen lakes in Zanskar, India.jpg', 'glacier-zanskar');
    const pangongUrl = await uploadLocal('Breathtaking view of Pangong Lake.jpg', 'pangong-lake');
    const icelandGlacierUrl = await uploadLocal('Serene glacier scene under dramatic clouds, showcasing rugged terrain and vibrant colors.jpg', 'glacier-iceland');

    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'glacial-landforms-and-moraines' });

    // ─── Hero: AI illustration → real Kashmir glacier photo ───────────────
    const heroIdx = 0;
    const updatedHero = {
      ...page.blocks[heroIdx],
      src: kashmirUrl,
      alt: 'A real glacier descending through a rocky Himalayan cirque, Kashmir, India',
      caption: 'A real glacier in Kashmir, India, filling a cirque high in the mountains.',
    };
    delete updatedHero.generation_prompt;

    // ─── Gallery: replace old 3 items with diagram + all 5 real photos ────
    const galleryIdx = page.blocks.findIndex((b) => b.type === 'gallery' && b.items?.some((it) => it.alt?.includes('arête')));
    if (galleryIdx === -1) throw new Error('glacial landforms gallery not found');
    const updatedGallery = {
      ...page.blocks[galleryIdx],
      items: [
        {
          id: uuid(),
          src: diagramUrl,
          alt: 'Labeled diagram of glacial landforms (cirque, arête, horn, U-shaped valley, hanging valley) and moraine types (lateral, medial, terminal, ground)',
          caption: 'Glacial landforms and moraines, labeled (illustration).',
        },
        {
          id: uuid(),
          src: kashmirUrl,
          alt: 'A real glacier descending through a rocky Himalayan cirque, Kashmir, India',
          caption: 'A real glacier in Kashmir, India.',
        },
        {
          id: uuid(),
          src: franceUrl,
          alt: 'Dramatic snow-capped alpine peaks and glaciers under clouds, French Alps',
          caption: 'Glacier-carved peaks in the French Alps.',
        },
        {
          id: uuid(),
          src: zanskarUrl,
          alt: 'Snow-covered Himalayan mountains and a frozen glacial lake, Zanskar, India',
          caption: 'A frozen glacial lake in the Zanskar range, Ladakh, India.',
        },
        {
          id: uuid(),
          src: pangongUrl,
          alt: 'Pangong Lake, a real high-altitude lake in the Himalayas, Ladakh, India',
          caption: 'Pangong Lake, Ladakh, India — a high-altitude lake in glacier-carved terrain.',
        },
        {
          id: uuid(),
          src: icelandGlacierUrl,
          alt: 'A real glacier tongue meeting rugged terrain under dramatic clouds',
          caption: 'A glacier tongue meeting the valley floor.',
        },
      ],
    };

    const updatedBlocks = page.blocks.map((b, i) => {
      if (i === heroIdx) return updatedHero;
      if (i === galleryIdx) return updatedGallery;
      return b;
    });

    const res = await bw.savePage(db, { slug: 'glacial-landforms-and-moraines' }, updatedBlocks, {
      author: 'agent',
      summary: 'Rebuilt the hero (AI illustration -> real Kashmir glacier photo) and the glacial-landforms gallery (replaced old 3 items with the new labeled diagram + all 5 founder-provided real photos)',
      allowContentLoss: true,
      lossReason: 'Founder explicit instruction (AskUserQuestion): "change the hero of this page with real pics that i downloaded. also the gallery images on page 8 are not great, replace them with my downloaded ones." Old hero illustration and old 3 gallery photo assets are unlinked, not deleted from R2.',
    });
    console.log(`✓ glacial-landforms-and-moraines — hero + gallery rebuilt (v${res.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
