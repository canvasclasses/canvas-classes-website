#!/usr/bin/env node
/**
 * fetch-question-images — make Crucible question figures legible to an AI agent
 * ============================================================================
 * The Claude vision API accepts JPEG/PNG/GIF/WebP but NOT SVG. Many Crucible
 * questions now carry SVG figures (white-on-transparent) embedded in
 * `question_text.markdown` / option text. An agent that tries to view those R2
 * `.svg` URLs gets "image couldn't be read — try a different format", and the
 * Read tool needs LOCAL files anyway.
 *
 * This tool resolves that: given question display_ids (or a --prefix), it pulls
 * each question's image URLs from the DB, downloads them, rasterises any SVG to
 * a dark-background PNG (white strokes become visible), passes PNG/JPG/WebP
 * through, and writes local files the agent can directly `Read`. It prints a
 * display_id → [local png paths] map.
 *
 * Usage:
 *   node scripts/svg-mapper/fetch-question-images.js NLM-188 NLM-190 SHM-122
 *   node scripts/svg-mapper/fetch-question-images.js --prefix NLM --limit 20
 *   node scripts/svg-mapper/fetch-question-images.js NLM-188 --out /tmp/qfigs
 *
 * Then `Read` the printed PNG paths. Read images in small batches to stay under
 * the per-request image cap.
 *
 * Read-only against the DB; writes only PNGs to the out dir.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local') });
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { MongoClient } = require('mongodb');

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith('--'));
const getFlag = (name) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : undefined; };
const prefix = getFlag('--prefix');
const limit = Number(getFlag('--limit')) || 50;
const outDir = getFlag('--out') || '/tmp/qfigs';

if (!ids.length && !prefix) {
  console.error('Usage: node scripts/svg-mapper/fetch-question-images.js <display_id...> | --prefix <PFX> [--limit N] [--out dir]');
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

// Same extraction fetch-batch.js uses: markdown ![alt](url) + HTML <img src="url">.
function extractImageUrls(text) {
  if (!text) return [];
  const urls = [];
  const md = /!\[[^\]]*\]\(([^)\s]+)/g;
  const html = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = md.exec(text))) urls.push(m[1]);
  while ((m = html.exec(text))) urls.push(m[1]);
  return urls;
}

function extOf(url) {
  const clean = url.split('?')[0];
  const e = (clean.split('.').pop() || '').toLowerCase();
  return ['svg', 'png', 'jpg', 'jpeg', 'webp', 'gif'].includes(e) ? e : '';
}

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const Q = client.db('crucible').collection('questions_v2');

  const filter = ids.length ? { display_id: { $in: ids } } : { display_id: { $regex: `^${prefix}-` } };
  const docs = await Q.find(filter)
    .project({ display_id: 1, 'question_text.markdown': 1, options: 1 })
    .limit(ids.length ? ids.length : limit)
    .toArray();
  await client.close();

  if (!docs.length) { console.error('No questions matched.'); process.exit(1); }

  const result = {};
  for (const d of docs) {
    const urls = [
      ...extractImageUrls(d.question_text && d.question_text.markdown),
      ...(d.options || []).flatMap((o) => extractImageUrls(o.text)),
    ];
    if (!urls.length) { result[d.display_id] = []; continue; }

    const files = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        const res = await fetch(url);
        if (!res.ok) { files.push(`(HTTP ${res.status}) ${url}`); continue; }
        const buf = Buffer.from(await res.arrayBuffer());
        const isSvg = extOf(url) === 'svg' || buf.slice(0, 200).toString('utf8').match(/<svg|<\?xml/i);
        const out = path.join(outDir, `${d.display_id}__${i}.png`);
        if (isSvg) {
          await sharp(buf, { density: 200 }).flatten({ background: '#000000' }).resize(900, 900, { fit: 'inside' }).png().toFile(out);
        } else {
          // raster already — flatten any transparency on black, normalise to PNG
          await sharp(buf).flatten({ background: '#000000' }).resize(900, 900, { fit: 'inside', withoutEnlargement: true }).png().toFile(out);
        }
        files.push(out);
      } catch (e) {
        files.push(`(failed: ${e.message}) ${url}`);
      }
    }
    result[d.display_id] = files;
  }

  // Report: display_id → local PNG paths (Read these).
  console.log(JSON.stringify(result, null, 2));
  const withImgs = Object.values(result).filter((f) => f.length).length;
  const totalPng = Object.values(result).flat().filter((f) => f.endsWith('.png')).length;
  console.error(`\n✓ ${docs.length} questions · ${withImgs} have figures · ${totalPng} PNGs written to ${outDir}`);
  console.error('  Read the .png paths above (in small batches to stay under the image cap).');
}

main().catch((e) => { console.error(e); process.exit(1); });
