'use strict';
// Attach the founder's downloaded Kosi-flood infographic to the Kosi "You Solve It"
// block on the rivers page (2026-07-10). Compresses with cwebp -q 42 (book standard),
// uploads to R2 (same client/bucket/public-base as every other book image), and sets
// image_src on the you_solve_it block — replacing the placeholder image_prompt state.
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local') });
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const SLUG = 'rivers-waterfalls-meanders-and-deltas';
const SRC = path.join(os.homedir(), 'Downloads', 'kosi river floods in Bihar.png');
const CWEBP_QUALITY = 42;

async function main() {
  if (!fs.existsSync(SRC)) throw new Error('source image not found: ' + SRC);

  // 1) compress -> webp
  const tmpOut = path.join(os.tmpdir(), `kosi-${crypto.randomUUID().slice(0, 8)}.webp`);
  execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-quiet', SRC, '-o', tmpOut]);
  const bytes = fs.readFileSync(tmpOut);
  console.log(`compressed: ${(fs.statSync(SRC).size / 1e6).toFixed(2)}MB PNG -> ${(bytes.length / 1e6).toFixed(2)}MB webp`);

  // 2) upload to R2
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
  const key = `books/${BOOK_ID}/ch2/kosi-flood-infographic-${crypto.randomUUID().slice(0, 8)}.webp`;
  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: bytes,
    ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'founder-provided-infographic' },
  }));
  const url = `${publicBase.replace(/\/$/, '')}/${key}`;
  console.log('uploaded:', url);

  // 3) set image_src on the you_solve_it block
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: SLUG });
    if (!page) throw new Error('page not found');
    let found = false;
    const blocks = page.blocks.map((b) => {
      if (b.type === 'you_solve_it') {
        found = true;
        return {
          ...b,
          image_src: url,
          image_caption: b.image_caption || 'The Kosi floods of Bihar (founder-provided infographic).',
        };
      }
      return b;
    });
    if (!found) throw new Error('no you_solve_it block on ' + SLUG);
    const res = await bw.savePage(db, { slug: SLUG }, blocks, {
      author: 'agent',
      summary: 'Attached founder-provided Kosi-flood infographic to the Kosi You Solve It block (image_src set).',
    });
    console.log(`✓ ${SLUG} saved (v${res.version || '?'}) — Kosi infographic attached`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
