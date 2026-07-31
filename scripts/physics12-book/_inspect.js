'use strict';
const { withDb } = require('../lib/book-writer');
withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class12-physics' });
  const pages = (await db.collection('book_pages')
    .find({ book_id: book._id, deleted_at: null }).toArray())
    .sort((a, c) => a.chapter_number - c.chapter_number || a.page_number - c.page_number);
  const byChapter = {};
  for (const p of pages) {
    byChapter[p.chapter_number] = byChapter[p.chapter_number] || [];
    const wc = (p.blocks || []).filter((b) => b.type === 'worked_example').length;
    const rc = (p.blocks || []).filter((b) => b.type === 'reasoning_prompt').length;
    const bankItems = (p.blocks || [])
      .filter((b) => b.type === 'practice_bank')
      .reduce((sum, b) => sum + (b.sections || []).reduce((s2, sec) => s2 + (sec.items || []).length, 0), 0);
    const ncertItems = (p.blocks || [])
      .filter((b) => b.type === 'practice_bank')
      .reduce((sum, b) => sum + (b.sections || []).reduce((s2, sec) =>
        s2 + (sec.items || []).filter((it) => it.source === 'ncert_exercise').length, 0), 0);
    byChapter[p.chapter_number].push({
      n: p.page_number, slug: p.slug, title: p.title, wc, rc,
      blocks: (p.blocks || []).length, bankItems, ncertItems,
    });
  }
  let totWc = 0, totRc = 0, totNcert = 0, totBank = 0;
  for (const ch of Object.keys(byChapter).sort((a, b) => a - b)) {
    console.log(`\n=== Chapter ${ch} (${byChapter[ch].length} pages) ===`);
    let chWc = 0, chRc = 0, chNcert = 0, chBank = 0;
    byChapter[ch].forEach((p) => {
      chWc += p.wc; chRc += p.rc; chNcert += p.ncertItems; chBank += p.bankItems;
      console.log(`  p${p.n}  ${p.slug}  — ${p.title}  [worked_ex:${p.wc} reasoning:${p.rc}${p.bankItems ? ` bank_items:${p.bankItems} (ncert:${p.ncertItems})` : ''}]`);
    });
    console.log(`  --- Ch${ch} totals: worked_example=${chWc}  reasoning_prompt=${chRc}  practice_bank_items=${chBank}  (ncert_exercise=${chNcert}) ---`);
    totWc += chWc; totRc += chRc; totNcert += chNcert; totBank += chBank;
  }
  console.log(`\n=== BOOK TOTALS: worked_example=${totWc}  reasoning_prompt=${totRc}  practice_bank_items=${totBank}  (ncert_exercise=${totNcert}) ===`);
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
