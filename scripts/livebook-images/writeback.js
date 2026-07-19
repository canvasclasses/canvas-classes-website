// Finish the job presign_put.js started: after the browser has confirmed a
// successful direct PUT to R2, write the resulting public URL into the block's
// src/image_src field and journal it — exactly ingest.js steps 3-4, minus the
// local-file compress+upload steps (already done by the browser).
//
// Usage:
//   node writeback.js --url <publicUrl> --page <pageId> --block <blockId> \
//     --field src --lang en --book <bookId> --chapter <n> [--alt "alt text"]
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const url = arg('url');
const pageId = arg('page');
const blockId = arg('block');
const field = arg('field');
const lang = arg('lang', 'en');
const altText = arg('alt');
const force = process.argv.includes('--force');

if (!url || !pageId || !blockId || !field) {
  console.error('Missing required arg. Need --url --page --block --field');
  process.exit(2);
}
if (!['src', 'image_src'].includes(field)) {
  console.error(`--field must be 'src' or 'image_src', got '${field}'`);
  process.exit(2);
}

const arrayField = lang === 'hi' ? 'hinglish_blocks' : 'blocks';
const journalPath = path.join(__dirname, '_journal.jsonl');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const setOps = { [`${arrayField}.$[b].${field}`]: url };
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
    process.exit(1);
  } else if (res.modifiedCount === 0) {
    console.error(`SKIP: block ${blockId} already had a ${field} (not overwritten). URL was ${url}, DB untouched.`);
    process.exit(1);
  } else {
    fs.appendFileSync(journalPath, JSON.stringify({
      ts: new Date().toISOString(), pageId, lang, arrayField, blockId, field, url,
    }) + '\n');
    console.log(`OK  ${blockId.slice(0, 8)} ${field}  ${url}`);
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
