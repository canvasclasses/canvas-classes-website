'use strict';
/**
 * Dump full page content (not just block-type lists) for one chapter, so a
 * reviewing agent can read the actual prose/formulas/examples rather than
 * inferring quality from counts.
 *
 * Run: node scripts/physics12-book/_dump_chapter.js <chapterNumber>
 */
const fs = require('fs');
const path = require('path');
const { withDb } = require('../lib/book-writer');

const CH = parseInt(process.argv[2], 10);
if (!CH) { console.error('usage: node _dump_chapter.js <chapterNumber>'); process.exit(1); }

const OUT = path.join(__dirname, `_chapter_dump_${CH}.txt`);

function renderBlock(b) {
  const lines = [`  [${b.type}${b.variant ? ':' + b.variant : ''}]`];
  const skip = new Set(['id', 'type', 'order', 'variant']);
  for (const [k, v] of Object.entries(b)) {
    if (skip.has(k)) continue;
    if (v == null || v === '') continue;
    if (typeof v === 'string') {
      lines.push(`    ${k}: ${v.length > 500 ? v.slice(0, 500) + ' …[truncated]' : v}`);
    } else if (Array.isArray(v)) {
      lines.push(`    ${k}: ${JSON.stringify(v).slice(0, 800)}${JSON.stringify(v).length > 800 ? ' …[truncated]' : ''}`);
    } else if (typeof v === 'object') {
      lines.push(`    ${k}: ${JSON.stringify(v).slice(0, 400)}`);
    } else {
      lines.push(`    ${k}: ${v}`);
    }
  }
  return lines.join('\n');
}

withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class12-physics' });
  const pages = (await db.collection('book_pages')
    .find({ book_id: book._id, deleted_at: null, chapter_number: CH }).toArray())
    .sort((a, c) => a.page_number - c.page_number);

  const out = [];
  out.push(`CHAPTER ${CH} — ${pages[0] ? pages.find((p) => p.page_number === 0)?.title : ''}`);
  out.push(`${pages.length} pages\n`);
  for (const p of pages) {
    out.push('═'.repeat(80));
    out.push(`PAGE ${p.page_number} — ${p.title}${p.subtitle ? ' — ' + p.subtitle : ''}`);
    out.push(`slug: ${p.slug} | page_type: ${p.page_type} | reading_time_min: ${p.reading_time_min} | blocks: ${(p.blocks || []).length}`);
    if (p.glossary && p.glossary.length) {
      out.push(`glossary: ${p.glossary.map((g) => g.term).join(', ')}`);
    }
    out.push('');
    for (const b of (p.blocks || [])) {
      if (b.type === 'practice_bank') {
        out.push(`  [practice_bank] title: ${b.title}`);
        for (const sec of (b.sections || [])) {
          out.push(`    section "${sec.title}" (${(sec.items || []).length} items): `
            + (sec.items || []).slice(0, 2).map((it) => (it.prompt || '').slice(0, 100)).join(' | ')
            + ((sec.items || []).length > 2 ? ` …+${sec.items.length - 2} more` : ''));
        }
        continue;
      }
      out.push(renderBlock(b));
    }
    out.push('');
  }
  fs.writeFileSync(OUT, out.join('\n'));
  console.log(`wrote ${OUT} (${out.join('\n').length} chars, ${pages.length} pages)`);
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
