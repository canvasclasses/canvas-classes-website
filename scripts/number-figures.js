'use strict';
/**
 * number-figures.js — assign chapter-relative figure/table/equation numbers (§16).
 *
 * Run ONLY when a chapter's content is finalised. Idempotent: re-run any time
 * content changes and numbers + in-text {fig:key} references re-sync.
 *
 *   node scripts/number-figures.js <bookSlug> <chapterNumber> [--dry]
 *   e.g. node scripts/number-figures.js ncert-simplified 1
 *
 * What it does, walking the chapter's LESSON pages in reading order
 * (page_number asc, then block order), excluding the chapter opener:
 *   • Figures   = image (non-decorative) + gallery   → "Fig. C.N"
 *   • Tables    = table                              → "Table C.N"
 *   • Equations = latex_block WITH a figure_key (opt-in) → "Eq. C.N"
 * Each gets a stable figure_key (auto-slugged from alt/caption if absent),
 * a figure_number ("C.N"), and a cleaned caption (any hard-typed "Fig 1.3 —"
 * / "Table 1.1 —" / leading emoji stripped — the renderer adds the label).
 * The chapter map (key → "Fig. C.N") is written to every page's `figure_refs`
 * so the reader resolves {fig:key} tokens. Reports duplicate keys + dangling refs.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const [bookSlug, chapterArg, ...rest] = process.argv.slice(2);
const DRY = rest.includes('--dry');
if (!bookSlug || !chapterArg) {
  console.error('Usage: node scripts/number-figures.js <bookSlug> <chapterNumber> [--dry]');
  process.exit(1);
}
const chapter = Number(chapterArg);

const WIDE = new Set(['16:5', '21:9']);

function slugify(s, fallback) {
  const out = String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return out || fallback;
}
function cleanCaption(c) {
  if (!c) return c;
  let s = String(c).trim();
  s = s.replace(/^\p{Extended_Pictographic}+\s*/u, '');                          // leading emoji marker
  s = s.replace(/^(?:Fig\.?|Figure|Table|Eq\.?|Equation)\s*\d+(?:\.\d+)?\s*[—:–\-]\s*/i, ''); // hard-typed label
  return s.trim();
}
// Write a cleaned caption WITHOUT introducing a null/undefined value. We write
// blocks back via the raw Mongo driver (no Zod), and an empty/undefined caption
// round-trips to BSON null — which later fails the admin save's Zod check
// (caption is `.optional()`, i.e. accepts undefined but NOT null). So if the
// cleaned caption is empty, DELETE the key instead of assigning a falsy value.
function applyCaption(b) {
  const cc = cleanCaption(b.caption);
  if (cc) b.caption = cc; else delete b.caption;
}
function isDecorativeImage(b) {
  if (b.decorative === true) return true;
  // Auto: a wide, caption-less banner is a hero, not a figure.
  return WIDE.has(b.aspect_ratio) && !String(b.caption || '').trim();
}

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: bookSlug });
  if (!book) { console.error('Book not found:', bookSlug); process.exit(1); }

  const pages = await db.collection('book_pages')
    .find({ book_id: book._id, chapter_number: chapter, page_type: { $ne: 'chapter_opener' } })
    .sort({ page_number: 1 })
    .toArray();
  if (pages.length === 0) { console.error('No lesson pages for chapter', chapter); process.exit(1); }

  let fig = 0, tbl = 0, eq = 0;
  const usedKeys = new Map();   // key -> count (for dedupe)
  const refMap = {};            // key -> "Fig. C.N"
  const assigned = [];          // log rows
  const dupes = [];

  function takeKey(desired, fallback) {
    let key = slugify(desired, fallback);
    if (usedKeys.has(key)) {
      dupes.push(key);
      let n = 2;
      while (usedKeys.has(`${key}-${n}`)) n++;
      key = `${key}-${n}`;
    }
    usedKeys.set(key, true);
    return key;
  }

  for (const page of pages) {
    const blocks = [...(page.blocks || [])].sort((a, b) => a.order - b.order);
    for (const b of blocks) {
      if (b.type === 'image') {
        if (isDecorativeImage(b)) { delete b.figure_number; continue; }
        fig++;
        b.figure_key = b.figure_key || takeKey(cleanCaption(b.alt || b.caption), `fig-${chapter}-${fig}`);
        if (usedKeys.get(b.figure_key) !== true) usedKeys.set(b.figure_key, true);
        b.figure_number = `${chapter}.${fig}`;
        applyCaption(b);
        refMap[b.figure_key] = `Fig. ${b.figure_number}`;
        assigned.push(`Fig. ${b.figure_number}  {${b.figure_key}}  p${page.page_number}  ${(b.alt || '').slice(0, 38)}`);
      } else if (b.type === 'gallery') {
        fig++;
        const firstAlt = (b.items && b.items[0] && b.items[0].alt) || '';
        b.figure_key = b.figure_key || takeKey(firstAlt, `fig-${chapter}-${fig}`);
        usedKeys.set(b.figure_key, true);
        b.figure_number = `${chapter}.${fig}`;
        refMap[b.figure_key] = `Fig. ${b.figure_number}`;
        assigned.push(`Fig. ${b.figure_number}  {${b.figure_key}}  p${page.page_number}  gallery (${(b.items || []).length} panels)`);
      } else if (b.type === 'table') {
        tbl++;
        b.figure_key = b.figure_key || takeKey(cleanCaption(b.caption) || (b.headers || []).join('-'), `table-${chapter}-${tbl}`);
        usedKeys.set(b.figure_key, true);
        b.figure_number = `${chapter}.${tbl}`;
        applyCaption(b);
        refMap[b.figure_key] = `Table ${b.figure_number}`;
        assigned.push(`Table ${b.figure_number}  {${b.figure_key}}  p${page.page_number}  ${(b.caption || '').slice(0, 38)}`);
      } else if (b.type === 'latex_block' && b.figure_key) {
        eq++;
        usedKeys.set(b.figure_key, true);
        b.figure_number = `${chapter}.${eq}`;
        refMap[b.figure_key] = `Eq. ${b.figure_number}`;
        assigned.push(`Eq. ${b.figure_number}  {${b.figure_key}}  p${page.page_number}`);
      }
    }
    page._sortedBlocks = blocks;
  }

  // Dangling {fig:key} references in any text/caption/markdown
  const dangling = new Set();
  const tokenRe = /\{fig:([a-zA-Z0-9_-]+)\}/g;
  for (const page of pages) {
    for (const b of page._sortedBlocks) {
      for (const field of [b.markdown, b.caption, b.side_text]) {
        if (typeof field !== 'string') continue;
        let m; while ((m = tokenRe.exec(field))) if (!refMap[m[1]]) dangling.add(m[1]);
      }
    }
  }

  console.log(`\nChapter ${chapter} of "${book.slug}" — ${pages.length} lesson pages`);
  console.log(`Figures: ${fig} · Tables: ${tbl} · Equations: ${eq}\n`);
  assigned.forEach((r) => console.log('  ' + r));
  if (dupes.length) console.log('\n⚠ duplicate keys auto-suffixed:', [...new Set(dupes)].join(', '));
  if (dangling.size) console.log('\n⚠ in-text {fig:…} referencing UNKNOWN keys:', [...dangling].join(', '));

  if (DRY) { console.log('\n[--dry] no writes.'); await client.close(); return; }

  for (const page of pages) {
    const blocks = page._sortedBlocks.map((b) => { const { _sortedBlocks, ...rest } = b; return rest; });
    await db.collection('book_pages').updateOne(
      { _id: page._id },
      { $set: { blocks, figure_refs: refMap, updated_at: new Date() } }
    );
  }
  console.log(`\n✅ Wrote numbers to ${pages.length} pages + figure_refs map (${Object.keys(refMap).length} keys).`);
  await client.close();
})();
