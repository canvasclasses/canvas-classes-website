'use strict';
// Founder request (2026-07-08): "add 3 more images to this section, the
// latest ones in my downloads folder" — referring to the labeled "A meander"
// diagram on rivers-waterfalls-meanders-and-deltas. Founder had just
// downloaded 3 real aerial river-meander photos (a Virginia salt marsh, a
// wetlands river with visible erosion/deposition color contrast, and a snowy
// Minnesota meander) — converts the single labeled illustration into a
// gallery: illustration first (keeps the Oxbow lake/Steep bank/River/Bar
// labels, genuinely useful pedagogically), then the 3 real photos. No
// aspect_ratio set — natural per-slide sizing (this session's renderer fix).
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
  const tmpOut = path.join(os.tmpdir(), `meander_${Date.now()}_${Math.random().toString(36).slice(2)}.webp`);
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
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'founder-provided-real-photo' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`  ✓ ${file} -> ${Math.round(webp.length / 1024)}KB webp`);
  return url;
}

async function main() {
  await bw.withDb(async (db) => {
    const marshUrl = await uploadLocal('Aerial view of winding waterways through a vibrant salt marsh in Virginia..jpg', 'meander-virginia-marsh');
    const wetlandsUrl = await uploadLocal('Aerial shot capturing the winding curves of a river through lush wetlands.jpg', 'meander-wetlands');
    const rochesterUrl = await uploadLocal('A mesmerizing aerial shot of a meandering river in a snowy winter landscape near Rochester, MN.jpg', 'meander-rochester-snow');

    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'rivers-waterfalls-meanders-and-deltas' });
    const idx = page.blocks.findIndex((b) => b.id === 'b1e803d7-8128-48b4-8ef7-ae00aa4657f5');
    if (idx === -1) throw new Error('meander image block not found');
    const oldBlock = page.blocks[idx];

    const galleryBlock = {
      id: oldBlock.id,
      type: 'gallery',
      items: [
        {
          id: uuid(),
          src: oldBlock.src,
          alt: oldBlock.alt,
          caption: 'A meander, labeled — oxbow lake, steep bank, river, bar (illustration).',
        },
        {
          id: uuid(),
          src: marshUrl,
          alt: 'Aerial view of winding tidal waterways through a salt marsh, Virginia, USA',
          caption: 'A real network of meandering tidal channels, Virginia salt marsh.',
        },
        {
          id: uuid(),
          src: wetlandsUrl,
          alt: 'Aerial shot of a real meandering river through wetlands, showing sediment colour contrast between the eroding and depositing banks',
          caption: 'A real meandering river — notice the colour contrast between the eroding outer bank and the sediment-depositing inner bank.',
        },
        {
          id: uuid(),
          src: rochesterUrl,
          alt: 'Aerial shot of a real meandering river in a snowy winter landscape near Rochester, Minnesota, USA',
          caption: 'A real meander loop in winter, near Rochester, Minnesota.',
        },
      ],
    };

    const updated = page.blocks.map((b, i) => (i === idx ? galleryBlock : b));
    const res = await bw.savePage(db, { slug: 'rivers-waterfalls-meanders-and-deltas' }, updated, {
      author: 'agent',
      summary: 'Converted the single labeled meander illustration into a 4-item gallery: illustration (kept, has useful oxbow/bank/bar labels) + 3 founder-provided real aerial meander photos. No aspect_ratio set — natural per-slide sizing.',
    });
    console.log(`✓ rivers-waterfalls-meanders-and-deltas — meander gallery built (v${res.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
