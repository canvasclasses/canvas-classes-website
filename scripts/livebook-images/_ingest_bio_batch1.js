// One-off batch ingest for the first 24 Class 11 Biology images (Ch.1 + Ch.2),
// content-matched by hand against each downloaded file before mapping here.
// Mirrors ingest.js's per-image steps, just looped with a hardcoded mapping.
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env.local') });
const mongoose = require('mongoose');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const CWEBP_QUALITY = 42;
const BOOK_ID = 'ed1e97ea-a780-4b8a-84ba-f83249fb51c2';
const DOWNLOADS = '/Users/CanvasClasses/Downloads';

const queue = require('./_bio_queue.json');

const fileMap = {
  1: '12_50_53', 2: '12_51_03', 3: '12_51_08', 4: '12_51_18', 5: '12_51_33',
  6: '12_51_40', 7: '12_51_49', 8: '12_51_55', 9: '12_52_19', 10: '12_52_24',
  11: '12_52_45', 12: '12_52_52', 13: '12_53_00', 14: '12_53_09', 15: '12_53_14',
  16: '02_39_05', 17: '02_39_11', 18: '02_39_18', 19: '02_55_08', 20: '02_55_14',
  21: '02_55_18', 22: '02_55_26', 23: '02_55_32', 24: '02_55_38',
};

function findFile(stamp) {
  const fname = `ChatGPT Image Jul 12, 2026, ${stamp} PM.png`;
  return path.join(DOWNLOADS, fname);
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
const journalPath = path.join(__dirname, '_journal.jsonl');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  for (let i = 1; i <= 24; i++) {
    const item = queue[i - 1];
    const stamp = fileMap[i];
    const file = findFile(stamp);
    if (!fs.existsSync(file)) {
      console.error(`#${i} MISSING FILE: ${file}`);
      continue;
    }
    const tmpOut = path.join(os.tmpdir(), `lbimg_${item.blockId}_${Date.now()}.webp`);
    execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-quiet', file, '-o', tmpOut]);
    const webp = fs.readFileSync(tmpOut);
    fs.unlinkSync(tmpOut);
    const origKB = Math.round(fs.statSync(file).size / 1024);
    const newKB = Math.round(webp.length / 1024);

    const storagePath = `books/${BOOK_ID}/ch${item.chapterNumber}/${item.blockId}_gen.webp`;
    await client.send(new PutObjectCommand({
      Bucket: bucketName, Key: storagePath, Body: webp, ContentType: 'image/webp',
      Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'livebook-image-automation-batch1' },
    }));
    const url = `${publicBase}/${storagePath}`;

    const arrayField = item.lang === 'hi' ? 'hinglish_blocks' : 'blocks';
    const setOps = { [`${arrayField}.$[b].${item.targetField}`]: url };
    if (item.alt && item.targetField === 'src') setOps[`${arrayField}.$[b].alt`] = item.alt;
    const blockFilter = { 'b.id': item.blockId, $or: [{ [`b.${item.targetField}`]: '' }, { [`b.${item.targetField}`]: { $exists: false } }, { [`b.${item.targetField}`]: null }] };

    const res = await db.collection('book_pages').updateOne(
      { _id: item.pageId },
      { $set: setOps },
      { arrayFilters: [blockFilter] }
    );

    if (res.matchedCount === 0) {
      console.error(`#${i} WARN: page ${item.pageId} not found.`);
    } else if (res.modifiedCount === 0) {
      console.error(`#${i} SKIP: block ${item.blockId.slice(0, 8)} already had ${item.targetField} (not overwritten). Uploaded to ${url} anyway.`);
    } else {
      fs.appendFileSync(journalPath, JSON.stringify({
        ts: new Date().toISOString(), pageId: item.pageId, lang: item.lang, arrayField,
        blockId: item.blockId, field: item.targetField, url, storagePath,
      }) + '\n');
      console.log(`#${i} OK  ${item.blockId.slice(0, 8)} ${item.targetField}  (${origKB}KB -> ${newKB}KB)  ${url}`);
    }
  }

  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
