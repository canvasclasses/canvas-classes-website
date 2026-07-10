'use strict';
// Founder request (2026-07-09): swap both page 6 and page 8 heroes again.
// Page 6 (rivers-waterfalls-meanders-and-deltas): founder renamed a file
// "Hero, page 6.jpg" in Downloads and said to use it directly — a sunset
// plunge waterfall — replacing the current Jog Falls, Karnataka hero.
// Page 8 (glacial-landforms-and-moraines): founder confirmed (AskUserQuestion)
// to use Pangong Lake as the new hero instead of the just-set Kashmir glacier
// photo — Kashmir glacier stays in the gallery unchanged, Pangong Lake's
// gallery item is removed (now redundant with the hero).
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

async function uploadLocal(file, keyPrefix) {
  const srcPath = path.join(DOWNLOADS, file);
  const tmpOut = path.join(os.tmpdir(), `hero_${Date.now()}.webp`);
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
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'founder-provided' },
  }));
  const url = `${publicBase}/${storagePath}`;
  console.log(`  ✓ ${file} -> ${Math.round(webp.length / 1024)}KB webp`);
  return url;
}

async function main() {
  await bw.withDb(async (db) => {
    // ─── Page 6: Jog Falls hero -> founder's sunset waterfall photo ───────
    const waterfallHeroUrl = await uploadLocal('Hero, page 6.jpg', 'hero-waterfall-sunset');
    const page6 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'rivers-waterfalls-meanders-and-deltas' });
    const updated6 = page6.blocks.map((b, i) => {
      if (i !== 0) return b;
      const { generation_prompt, ...rest } = b;
      return { ...rest, src: waterfallHeroUrl, alt: 'A tall plunge waterfall cascading over a mossy cliff into a green valley at sunset', caption: 'A plunge waterfall at sunset.' };
    });
    const res6 = await bw.savePage(db, { slug: 'rivers-waterfalls-meanders-and-deltas' }, updated6, {
      author: 'agent',
      summary: 'Swapped the hero (Jog Falls -> founder-provided sunset plunge waterfall photo, "Hero, page 6.jpg")',
      allowContentLoss: true,
      lossReason: 'Founder explicit instruction: renamed the file "Hero, page 6.jpg" and said to use it directly. Old Jog Falls hero asset unlinked, not deleted from R2.',
    });
    console.log(`✓ rivers-waterfalls-meanders-and-deltas — hero swapped (v${res6.version})`);

    // ─── Page 8: Kashmir glacier hero -> Pangong Lake (already uploaded) ──
    const page8 = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'glacial-landforms-and-moraines' });
    const galleryIdx = page8.blocks.findIndex((b) => b.type === 'gallery' && b.items.some((it) => it.alt.includes('Pangong')));
    const pangongItem = page8.blocks[galleryIdx].items.find((it) => it.alt.includes('Pangong'));
    const pangongUrl = pangongItem.src;

    const updated8 = page8.blocks.map((b, i) => {
      if (i === 0) {
        const { generation_prompt, ...rest } = b;
        return { ...rest, src: pangongUrl, alt: 'Pangong Lake, a real high-altitude lake in the Himalayas, Ladakh, India', caption: 'Pangong Lake, Ladakh, India.' };
      }
      if (i === galleryIdx) {
        return { ...b, items: b.items.filter((it) => !it.alt.includes('Pangong')) };
      }
      return b;
    });
    const res8 = await bw.savePage(db, { slug: 'glacial-landforms-and-moraines' }, updated8, {
      author: 'agent',
      summary: 'Swapped the hero (Kashmir glacier -> Pangong Lake, reusing the already-uploaded gallery asset) and removed the now-redundant Pangong Lake item from the gallery; Kashmir glacier stays in the gallery unchanged',
      allowContentLoss: true,
      lossReason: 'Founder explicit instruction (AskUserQuestion): "use pangong lake as hero image and keep kashmir glacier in gallery." Old Kashmir-glacier hero image reference unlinked from the hero slot (still present in the gallery), no R2 asset deleted.',
    });
    console.log(`✓ glacial-landforms-and-moraines — hero swapped (v${res8.version})`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
