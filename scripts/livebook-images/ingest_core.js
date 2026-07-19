// Shared core for "ingest one generated image into a Livebook block":
//   compress -> R2 upload -> write block field -> journal -> hotspot check.
//
// WHY THIS IS ITS OWN MODULE: one-off batch-ingest scripts for individual
// chapters (_ch6_ingest_run.js, _ch7_ingest_run.js, _ch8_ingest_run.js, ...)
// have historically copy-pasted ingest.js's compress/upload/write-back steps
// instead of calling it, because ingest.js was a CLI script, not a library.
// That means any check added only inside ingest.js's CLI body (like the
// hotspot-alignment check) silently would NOT apply to the next hand-rolled
// batch script written the same way — exactly the kind of gap that let the
// 2026-07-12 hotspot mispositioning ship unnoticed.
//
// Fix: this is the ONE place the actual ingest steps live. `ingest.js` (CLI,
// one image at a time) and any future batch-loop script both call
// `ingestImage()` from here — copy-pasting the steps again is the wrong move.
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env.local') });
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { checkHotspots } = require('./hotspot_check');

const CWEBP_QUALITY = 42;

function r2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * @param {object} opts
 * @param {string} opts.file - local path to the downloaded PNG/etc.
 * @param {string} opts.pageId
 * @param {string} opts.blockId
 * @param {'src'|'image_src'} opts.field
 * @param {'en'|'hi'} [opts.lang]
 * @param {string} opts.bookId
 * @param {number|string} opts.chapter
 * @param {string} [opts.altText]
 * @param {string} [opts.suffix] - filename variant, busts cache
 * @param {boolean} [opts.force] - overwrite even if the block already has an image
 * @param {import('mongodb').Db} opts.db - already-connected mongoose.connection.db
 * @returns {Promise<{status:'ok'|'skip'|'not_found', url:string, hotspotReport?: object}>}
 */
async function ingestImage({ file, pageId, blockId, field, lang = 'en', bookId, chapter, altText, suffix, force = false, db }) {
  if (!['src', 'image_src'].includes(field)) throw new Error(`field must be 'src' or 'image_src', got '${field}'`);
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`);

  // 1. COMPRESS ---------------------------------------------------------------
  const tmpOut = path.join(os.tmpdir(), `lbimg_${blockId}_${Date.now()}.webp`);
  execFileSync('cwebp', ['-q', String(CWEBP_QUALITY), '-quiet', file, '-o', tmpOut]);
  const webp = fs.readFileSync(tmpOut);
  fs.unlinkSync(tmpOut);
  const origKB = Math.round(fs.statSync(file).size / 1024);
  const newKB = Math.round(webp.length / 1024);

  // 2. UPLOAD -------------------------------------------------------------------
  const bucketName = process.env.R2_BUCKET_NAME || 'canvas-chemistry-assets';
  const publicBase = process.env.R2_PUBLIC_URL || `https://${bucketName}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
  const storagePath = `books/${bookId}/ch${chapter}/${blockId}_gen${suffix ? '_' + suffix : ''}.webp`;

  await r2Client().send(new PutObjectCommand({
    Bucket: bucketName,
    Key: storagePath,
    Body: webp,
    ContentType: 'image/webp',
    Metadata: { 'uploaded-at': new Date().toISOString(), origin: 'livebook-image-automation' },
  }));
  const url = `${publicBase}/${storagePath}`;

  // 3. WRITE BACK -----------------------------------------------------------
  const arrayField = lang === 'hi' ? 'hinglish_blocks' : 'blocks';
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

  let status;
  if (res.matchedCount === 0) {
    status = 'not_found';
  } else if (res.modifiedCount === 0) {
    status = 'skip';
  } else {
    status = 'ok';
    // 4. JOURNAL --------------------------------------------------------------
    fs.appendFileSync(path.join(__dirname, '_journal.jsonl'), JSON.stringify({
      ts: new Date().toISOString(), pageId, lang, arrayField, blockId, field, url, storagePath,
    }) + '\n');
  }

  // 5. HOTSPOT ALIGNMENT CHECK -------------------------------------------------
  // See hotspot_check.js. Runs on EVERY ingest of an interactive_image src,
  // regardless of which caller invoked this function — that's the point.
  let hotspotReport;
  if (field === 'src') {
    const freshPage = await db.collection('book_pages').findOne({ _id: pageId }, { projection: { [arrayField]: 1 } });
    const block = freshPage?.[arrayField]?.find((b) => b.id === blockId);
    if (block?.hotspots?.length) {
      const { results } = await checkHotspots(webp, block.hotspots);
      const fails = results.filter((r) => !r.pass);
      hotspotReport = { results, fails };
      if (fails.length > 0) {
        const flagDir = path.join(__dirname, '..', '..', '_agents', 'livebook-hotspot-flags');
        fs.mkdirSync(flagDir, { recursive: true });
        const flagFile = path.join(flagDir, `${bookId}-ch${chapter}.md`);
        if (!fs.existsSync(flagFile)) {
          fs.writeFileSync(flagFile,
            `# Hotspot alignment flags — book ${bookId}, chapter ${chapter}\n\n` +
            `Auto-detected by the pixel hit-test in ingest_core.js: these hotspots don't land\n` +
            `on visible artwork in the generated image. Fix the x/y via the admin editor or a\n` +
            `book-writer.savePage script, then delete the resolved entry.\n\n---\n\n`
          );
        }
        fs.appendFileSync(flagFile,
          `## block \`${blockId}\`  (page \`${pageId}\`)\n` +
          `- **Detected:** ${new Date().toISOString()}\n- **Image:** ${url}\n` +
          fails.map((f) => `- **"${f.label}"** at x=${f.x}, y=${f.y}` +
            (f.suggestedNear ? ` — nearest artwork found near x=${f.suggestedNear.x}, y=${f.suggestedNear.y}` : ' — no nearby artwork found within search radius')
          ).join('\n') +
          `\n\n---\n\n`
        );
      }
    }
  }

  return { status, url, origKB, newKB, hotspotReport };
}

function printIngestResult(label, r) {
  if (r.status === 'not_found') {
    console.error(`${label} WARN: page not found.`);
  } else if (r.status === 'skip') {
    console.error(`${label} SKIP: block already had this field (not overwritten). Uploaded to ${r.url} but DB untouched.`);
  } else {
    console.log(`${label} OK  (${r.origKB}KB -> ${r.newKB}KB webp)  ${r.url}`);
  }
  if (r.hotspotReport) {
    const { results, fails } = r.hotspotReport;
    if (fails.length === 0) {
      console.log(`    hotspots: ${results.length}/${results.length} aligned ✓`);
    } else {
      console.log(`\n    ⚠️  HOTSPOT ALIGNMENT: ${results.length - fails.length}/${results.length} aligned — ${fails.length} MISPLACED:`);
      for (const f of fails) {
        const near = f.suggestedNear ? ` (try near x=${f.suggestedNear.x}, y=${f.suggestedNear.y}?)` : '';
        console.log(`       ✗ "${f.label}" at x=${f.x}, y=${f.y} — no artwork under/around this point${near}`);
      }
      console.log(`    Fix via book-writer.savePage before calling this page done — do not leave silently.\n`);
    }
  }
}

module.exports = { ingestImage, printIngestResult };
