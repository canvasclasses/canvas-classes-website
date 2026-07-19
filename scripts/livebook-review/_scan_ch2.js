// READ-ONLY. Verifies the F4 sign issue and scans Ch2 quiz hygiene.
// Usage: node scripts/livebook-review/_scan_ch2.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const BOOK = 'ncert-simplified-12';
const CH = 2;

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: BOOK, deleted_at: null });
  const pages = await db.collection('book_pages')
    .find({ book_id: book._id, chapter_number: CH, deleted_at: null })
    .sort({ page_number: 1 }).toArray();

  // ---- F4: dump every latex_block + any block mentioning 0.82 on pages 22 & 24 ----
  console.log('===== F4: water-potential sign check (pages 22 & 24) =====');
  for (const p of pages) {
    if (![22, 24].includes(p.page_number)) continue;
    console.log(`\n--- PAGE ${p.page_number}: ${p.title} (slug=${p.slug}) ---`);
    (p.blocks || []).forEach((b, i) => {
      const raw = JSON.stringify(b);
      const hitsLatex = (b.type === 'latex_block');
      const hits082 = /0\.82|0\.42|1\.23/.test(raw);
      if (hitsLatex || hits082) {
        console.log(`  [b${i}] type=${b.type}${b.label ? ' label="' + b.label + '"' : ''}`);
        // print any string field that could carry the equation/number
        for (const k of Object.keys(b)) {
          if (typeof b[k] === 'string' && /0\.82|0\.42|1\.23|H2O|O2|\\ce|frac|->/.test(b[k])) {
            console.log(`      ${k}: ${b[k].slice(0, 600)}`);
          }
        }
      }
    });
  }

  // ---- F7 + F9: quiz hygiene across the whole chapter ----
  console.log('\n\n===== F7/F9: quiz hygiene (all 30 pages) =====');
  let totalQ = 0, missingDiff = 0;
  const posCount = {}; // correct_index -> count
  const perPageMissing = [];
  // F6 quantification: reasoning_prompt correct-vs-distractor length
  let rpTotal = 0, rpCorrectLongest = 0;
  for (const p of pages) {
    let pageMissing = 0, pageQ = 0;
    for (const b of (p.blocks || [])) {
      if (b.type === 'inline_quiz' && Array.isArray(b.questions)) {
        for (const q of b.questions) {
          totalQ++; pageQ++;
          if (q.difficulty_level == null) { missingDiff++; pageMissing++; }
          if (typeof q.correct_index === 'number') {
            posCount[q.correct_index] = (posCount[q.correct_index] || 0) + 1;
          }
        }
      }
      if (b.type === 'reasoning_prompt' && Array.isArray(b.options) && typeof b.correct_index === 'number') {
        rpTotal++;
        const lens = b.options.map((o) => (typeof o === 'string' ? o : JSON.stringify(o)).length);
        const maxLen = Math.max(...lens);
        if (lens[b.correct_index] === maxLen) rpCorrectLongest++;
      }
    }
    if (pageMissing > 0) perPageMissing.push(`p${p.page_number}: ${pageMissing}/${pageQ} untagged`);
  }
  console.log(`Total inline-quiz questions: ${totalQ}`);
  console.log(`Missing difficulty_level:    ${missingDiff}  (${Math.round(missingDiff / totalQ * 100)}%)`);
  console.log(`Correct-answer position spread (0=A,1=B,2=C,3=D): ${JSON.stringify(posCount)}`);
  console.log(`\nReasoning prompts: ${rpTotal}; correct answer is the LONGEST option in ${rpCorrectLongest} (${Math.round(rpCorrectLongest / rpTotal * 100)}%)`);
  console.log('\nPages with untagged quiz questions:');
  perPageMissing.forEach((l) => console.log('  ' + l));

  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
