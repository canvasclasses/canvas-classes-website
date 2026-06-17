'use strict';
// READ-ONLY: list all R2 media under Class 11 Chem Ch1, flag files not referenced by any current page block.
// Run: node scripts/_list_ch1_r2_media.js
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');

const BOOK_ID = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
const PREFIX = `books/${BOOK_ID}/ch1/`;

(async () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
  });

  // Collect all referenced src URLs across this book's pages.
  const mongo = new MongoClient(process.env.MONGODB_URI);
  await mongo.connect();
  const pages = await mongo.db('crucible').collection('book_pages')
    .find({ book_id: BOOK_ID }).project({ blocks: 1 }).toArray();
  const referenced = new Set();
  for (const p of pages) for (const b of (p.blocks || [])) {
    for (const k of ['src', 'url', 'audio_url']) if (b[k]) referenced.add(String(b[k]).split('/').pop());
  }
  await mongo.close();

  // List R2 objects under the ch1 prefix.
  let token, all = [];
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: bucketName, Prefix: PREFIX, ContinuationToken: token }));
    all.push(...(r.Contents || []));
    token = r.IsTruncated ? r.NextContinuationToken : undefined;
  } while (token);

  console.log(`Bucket=${bucketName}  prefix=${PREFIX}\nTotal objects: ${all.length}\n`);
  const media = all.filter(o => /\.(mp4|webm|mov|m4a|mp3)$/i.test(o.Key));
  console.log('=== VIDEO/AUDIO files (★ = NOT referenced by any current page = likely the deleted one) ===');
  for (const o of media.sort((a,b)=> (a.LastModified>b.LastModified?1:-1))) {
    const name = o.Key.split('/').pop();
    const orphan = referenced.has(name) ? '   ' : ' ★ ';
    const mb = (o.Size/1048576).toFixed(1);
    console.log(`${orphan}${o.LastModified.toISOString().slice(0,10)}  ${mb}MB  ${name}`);
  }
  console.log('\nPublic URL base: https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/' + PREFIX);
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
