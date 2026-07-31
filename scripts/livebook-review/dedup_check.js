// Checks a chapter's new NCERT-exercises module for near-duplicate questions
// against that chapter's existing inline_quiz/reasoning_prompt questions.
// Usage: node dedup_check.js <chapterNumber>
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const path = require('path');
const strip = s => String(s || '').replace(/[*_`#>]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const shingles = (s, n) => { const w = strip(s).split(' ').filter(Boolean); const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' ')); return out; };
const ch = Number(process.argv[2]);
(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class11-biology' });
  const pages = await db.collection('book_pages').find({ book_id: book._id, chapter_number: ch, deleted_at: null }).toArray();
  const existingQuestions = [];
  for (const p of pages) for (const b of (p.blocks || [])) {
    if (b.type === 'inline_quiz') for (const q of (b.questions || [])) existingQuestions.push({ slug: p.slug, kind: 'quiz', text: q.question });
    if (b.type === 'reasoning_prompt') existingQuestions.push({ slug: p.slug, kind: 'reasoning', text: b.prompt });
  }
  const mod = require(path.join(__dirname, '..', 'bio-book', '_practice', `ch${ch}.js`));
  const pb = mod.blocks.find(b => b.type === 'practice_bank');
  const newItems = pb.sections.flatMap(s => s.items.map(it => ({ label: it.source_label, text: it.prompt })));
  console.log(`ch${ch}: existing quiz/reasoning questions:`, existingQuestions.length, '| new exercise items:', newItems.length);
  const N = 5;
  let flagged = 0;
  for (const ni of newItems) {
    const niShingles = shingles(ni.text, N);
    for (const eq of existingQuestions) {
      const eqShingles = shingles(eq.text, N);
      let hit = 0; for (const g of niShingles) if (eqShingles.has(g)) hit++;
      const overlap = niShingles.size ? hit / niShingles.size : 0;
      if (overlap > 0.3) { flagged++; console.log(`  FLAG ${ni.label} vs ${eq.slug}/${eq.kind}: ${(overlap * 100).toFixed(0)}% overlap`); }
    }
  }
  console.log(`ch${ch}: flagged near-duplicates (>30% 5-gram overlap):`, flagged);
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
