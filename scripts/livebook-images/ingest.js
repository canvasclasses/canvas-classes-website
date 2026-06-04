// Ingest ONE generated image into a Livebook block:
//   1. Compress  -> WebP via `cwebp -q 42`, NO resize. This reproduces the user's
//                   XnConvert preset to within ~100 bytes (calibrated against two
//                   real XnConvert outputs: 1774x887->76.97KiB and 1254x1254->50.69KiB,
//                   both = cwebp q42). Same libwebp engine XnConvert uses -> identical quality.
//   2. Upload    -> Cloudflare R2 at books/{book}/ch{n}/{block}_gen.webp
//   3. Write back-> set the block's src/image_src in book_pages (only if still empty)
//   4. Journal   -> append to _journal.jsonl for exact rollback
//
// Usage (called once per image by the run-loop):
//   node scripts/livebook-images/ingest.js \
//     --file /tmp/dalle_download.png \
//     --page <pageId> --block <blockId> --field src \
//     --lang en --book <bookId> --chapter 2 [--alt "alt text"]
//
// Talks to R2 directly via @aws-sdk (r2-storage.ts is server-only and can't be
// required from a plain script) using the same config the app uses.
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// XnConvert-equivalent compression: libwebp at quality 42, no resize.
const CWEBP_QUALITY = 42;

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const file = arg('file');
const pageId = arg('page');
const blockId = arg('block');
const field = arg('field'); // 'src' | 'image_src'
const lang = arg('lang', 'en'); // 'en' -> blocks, 'hi' -> hinglish_blocks
const bookId = arg('book');
const chapter = arg('chapter');
const altText = arg('alt');
const suffix = arg('suffix');           // filename variant (e.g. 'v2') -> new URL, busts cache
const force = process.argv.includes('--force'); // overwrite even if the block already has an image

if (!file || !pageId || !blockId || !field || !bookId || !chapter) {
  console.error('Missing required arg. Need --file --page --block --field --book --chapter');
  process.exit(2);
}
if (!['src', 'image_src'].includes(field)) {
  console.error(`--field must be 'src' or 'image_src', got '${field}'`);
  process.exit(2);
}
if (!fs.existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(2);
}

const arrayField = lang === 'hi' ? 'hinglish_blocks' : 'blocks';
const journalPath = path.join(__dirname, '_journal.jsonl');

(async () => {
  // 1. COMPRESS (cwebp -q 42, no resize = user's XnConvert preset) -------------
  const tmpOut = path.join(os.tmpdir(), `lbimg_${blockId}_${Date.now()}.webp`);
  execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-quiet', file, '-o', tmpOut]);
  const webp = fs.readFileSync(tmpOut);
  fs.unlinkSync(tmpOut);
  const origKB = Math.round(fs.statSync(file).size / 1024);
  const newKB = Math.round(webp.length / 1024);

  // 2. UPLOAD -----------------------------------------------------------------
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${accountId}.r2.dev`;
  const storagePath = `books/${bookId}/ch${chapter}/${blockId}_gen${suffix ? '_' + suffix : ''}.webp`;

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: storagePath,
    Body: webp,
    ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), 'origin': 'livebook-image-automation' },
  }));
  const url = `${publicBase}/${storagePath}`;

  // 3. WRITE BACK -------------------------------------------------------------
  // Guarded by default (only fill if still empty); --force overwrites an existing image (redo).
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const setOps = { [`${arrayField}.$[b].${field}`]: url };
  // fill alt only when caller passes one and only for image blocks
  if (altText && field === 'src') setOps[`${arrayField}.$[b].alt`] = altText;

  const blockFilter = force
    ? { 'b.id': blockId }
    : { 'b.id': blockId, $or: [{ [`b.${field}`]: '' }, { [`b.${field}`]: { $exists: false } }, { [`b.${field}`]: null }] };

  const res = await db.collection('book_pages').updateOne(
    { _id: pageId },
    { $set: setOps },
    { arrayFilters: [blockFilter] }
  );

  if (res.matchedCount === 0) {
    console.error(`WARN: page ${pageId} not found.`);
  } else if (res.modifiedCount === 0) {
    console.error(`SKIP: block ${blockId} already had a ${field} (not overwritten). Image uploaded to ${url} but DB untouched.`);
  } else {
    // 4. JOURNAL --------------------------------------------------------------
    fs.appendFileSync(journalPath, JSON.stringify({
      ts: new Date().toISOString(), pageId, lang, arrayField, blockId, field, url, storagePath,
    }) + '\n');
    console.log(`OK  ${blockId.slice(0, 8)} ${field}  (${origKB}KB -> ${newKB}KB webp)  ${url}`);
  }

  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
