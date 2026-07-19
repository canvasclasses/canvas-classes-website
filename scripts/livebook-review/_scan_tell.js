// READ-ONLY. Re-checks the "length tell" for reasoning_prompt AND inline_quiz,
// after inspecting the real block schema.
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'ncert-simplified-12', deleted_at: null });
  const pages = await db.collection('book_pages')
    .find({ book_id: book._id, chapter_number: 2, deleted_at: null }).sort({ page_number: 1 }).toArray();

  // Show the raw schema of the first reasoning_prompt
  for (const p of pages) {
    const rp = (p.blocks || []).find((b) => b.type === 'reasoning_prompt');
    if (rp) { console.log('RAW reasoning_prompt keys:', Object.keys(rp)); console.log(JSON.stringify(rp, null, 1).slice(0, 900)); break; }
  }

  const analyse = (arr, getOpts, getCorrect) => {
    let n = 0, longest = 0, topOrTop2 = 0;
    for (const b of arr) {
      const opts = getOpts(b); const ci = getCorrect(b);
      if (!Array.isArray(opts) || typeof ci !== 'number' || !opts[ci]) continue;
      n++;
      const lens = opts.map((o) => (typeof o === 'string' ? o : (o.text || JSON.stringify(o))).length);
      const sorted = [...lens].sort((a, b) => b - a);
      if (lens[ci] === sorted[0]) longest++;
      if (lens[ci] >= sorted[Math.min(1, sorted.length - 1)]) topOrTop2++;
    }
    return { n, longest, topOrTop2 };
  };

  const rpBlocks = [], iqQuestions = [];
  for (const p of pages) for (const b of (p.blocks || [])) {
    if (b.type === 'reasoning_prompt') rpBlocks.push(b);
    if (b.type === 'inline_quiz' && Array.isArray(b.questions)) iqQuestions.push(...b.questions);
  }

  // reasoning_prompt: try common field names
  const rp = analyse(rpBlocks,
    (b) => b.options || b.choices,
    (b) => (typeof b.correct_index === 'number' ? b.correct_index
          : typeof b.answer_index === 'number' ? b.answer_index
          : typeof b.correct === 'number' ? b.correct : null));
  console.log(`\nreasoning_prompt: ${rp.n} scored; correct = LONGEST option in ${rp.longest} (${rp.n ? Math.round(rp.longest / rp.n * 100) : 0}%); correct = top-2 longest in ${rp.topOrTop2}`);

  const iq = analyse(iqQuestions, (q) => q.options, (q) => q.correct_index);
  console.log(`inline_quiz:      ${iq.n} scored; correct = LONGEST option in ${iq.longest} (${iq.n ? Math.round(iq.longest / iq.n * 100) : 0}%); correct = top-2 longest in ${iq.topOrTop2} (${Math.round(iq.topOrTop2 / iq.n * 100)}%)`);

  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
