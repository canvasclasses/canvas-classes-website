// CLI: ingest ONE generated image into a Livebook block.
//   compress -> R2 upload -> write back block src/image_src -> journal -> hotspot check.
// The actual steps live in ingest_core.js (ingestImage) — see that file for why,
// and for the entry point future batch-loop scripts should call instead of
// copy-pasting these steps.
//
// Usage (called once per image by the run-loop):
//   node scripts/livebook-images/ingest.js \
//     --file /tmp/dalle_download.png \
//     --page <pageId> --block <blockId> --field src \
//     --lang en --book <bookId> --chapter 2 [--alt "alt text"]
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env.local') });
const mongoose = require('mongoose');
const { ingestImage, printIngestResult } = require('./ingest_core');

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

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const result = await ingestImage({ file, pageId, blockId, field, lang, bookId, chapter, altText, suffix, force, db });
  printIngestResult(blockId.slice(0, 8), result);

  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
