// Standalone hotspot-alignment audit — checks every interactive_image block's
// hotspots against the ACTUAL uploaded image (not the guess they were authored
// against). Use this:
//   - after finishing an image batch, as a "done" gate (must print 0 fails)
//   - any time to re-check a book/chapter you're not sure about
//   - the ingest.js pipeline already runs this per-image automatically; this
//     is the same check run in bulk, after the fact, over things already live
//
// Usage:
//   node scripts/livebook-images/audit_hotspots.js --book <bookId> [--chapter <n>]
//   node scripts/livebook-images/audit_hotspots.js --book <bookId> --fix-flags   (also (re)writes the flag file)
//
// Exit code: 0 if every hotspot in scope is aligned, 1 if any are misplaced.
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { checkHotspots } = require('./hotspot_check');

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const bookId = arg('book');
const chapter = arg('chapter'); // optional filter
const writeFlags = process.argv.includes('--fix-flags');

if (!bookId) {
  console.error('Missing required arg. Need --book <bookId> [--chapter <n>]');
  process.exit(2);
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const query = { book_id: bookId };
  if (chapter) query.chapter_number = Number(chapter);
  const pages = await db.collection('book_pages').find(query).toArray();

  let totalBlocks = 0, totalHotspots = 0, totalFails = 0;
  const flagsByChapter = {};

  for (const page of pages) {
    for (const arrayField of ['blocks', 'hinglish_blocks']) {
      for (const block of page[arrayField] || []) {
        if (block.type !== 'interactive_image' || !block.src || !block.hotspots?.length) continue;
        totalBlocks++;
        let buf;
        try {
          buf = await fetchBuffer(block.src);
        } catch (e) {
          console.log(`⚠️  ${block.id.slice(0, 8)}  COULD NOT FETCH IMAGE: ${e.message}`);
          continue;
        }
        const { results } = await checkHotspots(buf, block.hotspots);
        totalHotspots += results.length;
        const fails = results.filter((r) => !r.pass);
        const ch = page.chapter_number ?? '?';
        const label = `${arrayField === 'hinglish_blocks' ? '[HI] ' : ''}ch${ch} ${block.id.slice(0, 8)}`;
        if (fails.length === 0) {
          console.log(`✓  ${label}  ${results.length}/${results.length} aligned`);
        } else {
          totalFails += fails.length;
          console.log(`✗  ${label}  ${results.length - fails.length}/${results.length} aligned — MISPLACED: ${fails.map((f) => f.label).join(', ')}`);
          for (const f of fails) {
            const near = f.suggestedNear ? ` (try near x=${f.suggestedNear.x}, y=${f.suggestedNear.y}?)` : '';
            console.log(`      "${f.label}" x=${f.x} y=${f.y}${near}`);
          }
          (flagsByChapter[ch] ??= []).push({ page, block, fails, url: block.src });
        }
      }
    }
  }

  console.log('---');
  console.log(`${totalBlocks} interactive_image blocks checked, ${totalHotspots} hotspots, ${totalFails} misplaced`);

  if (writeFlags) {
    for (const [ch, entries] of Object.entries(flagsByChapter)) {
      const dir = path.join(__dirname, '..', '..', '_agents', 'livebook-hotspot-flags');
      fs.mkdirSync(dir, { recursive: true });
      const flagFile = path.join(dir, `${bookId}-ch${ch}.md`);
      let body = `# Hotspot alignment flags — book ${bookId}, chapter ${ch}\n\n` +
        `Auto-detected by audit_hotspots.js: these hotspots don't land on visible\n` +
        `artwork in the generated image. Fix the x/y via the admin editor or a\n` +
        `book-writer.savePage script, then delete the resolved entry.\n\n---\n\n`;
      for (const { page, block, fails, url } of entries) {
        body += `## block \`${block.id}\`  (page \`${page._id}\`)\n` +
          `- **Detected:** ${new Date().toISOString()}\n- **Image:** ${url}\n` +
          fails.map((f) => `- **"${f.label}"** at x=${f.x}, y=${f.y}` +
            (f.suggestedNear ? ` — nearest artwork found near x=${f.suggestedNear.x}, y=${f.suggestedNear.y}` : ' — no nearby artwork found')
          ).join('\n') + `\n\n---\n\n`;
      }
      fs.writeFileSync(flagFile, body);
      console.log(`Wrote ${flagFile}`);
    }
  }

  await mongoose.disconnect();
  process.exit(totalFails > 0 ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
