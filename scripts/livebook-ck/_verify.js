'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');

function countDollars(s) {
  // count unescaped single-$ (treat $$ as two) — we just need parity of $ delimiters
  let n = 0;
  for (let i = 0; i < s.length; i++) if (s[i] === '$') n++;
  return n;
}
function braceBalance(s) {
  let b = 0;
  for (const ch of s) { if (ch === '{') b++; else if (ch === '}') b--; if (b < 0) return false; }
  return b === 0;
}

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const db = c.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'ncert-simplified-12' });
  const pages = await db.collection('book_pages')
    .find({ book_id: book._id, chapter_number: 3 })
    .sort({ page_number: 1 }).toArray();

  let problems = 0;
  const note = (m) => { problems++; console.log('  ⚠ ' + m); };

  console.log(`Found ${pages.length} CK pages.\n`);
  for (const p of pages) {
    const types = (p.blocks || []).map((b) => b.type);
    const last = types[types.length - 1];
    const hasHero = p.blocks[0] && p.blocks[0].type === 'image' && p.blocks[0].aspect_ratio === '16:5';
    console.log(`p${p.page_number} ${p.slug}  [${p.blocks.length} blocks] pub=${p.published}`);
    const isPractice = p.blocks.some((b) => b.type === 'practice_bank');
    if (!isPractice && !hasHero) note(`p${p.page_number}: block 0 is not a 16:5 hero image`);
    if (!isPractice && last !== 'inline_quiz') note(`p${p.page_number}: last block is ${last}, not inline_quiz`);

    p.blocks.forEach((b, i) => {
      if (b.type === 'practice_bank') {
        let nItems = 0;
        (b.sections || []).forEach((s, si) => {
          if (!s.id || !s.title) note(`p${p.page_number} bank section ${si}: missing id/title`);
          (s.items || []).forEach((it, ii) => {
            nItems++;
            const where = `p${p.page_number} bank "${s.title}" item ${ii} (${it.kind})`;
            if (!it.id) note(`${where}: missing id`);
            if (!it.source) note(`${where}: missing source`);
            for (const f of ['prompt', 'solution', 'explanation', 'answer']) {
              const v = it[f];
              if (typeof v === 'string') {
                if (countDollars(v) % 2 !== 0) note(`${where}.${f}: odd $ delimiters`);
                if (!braceBalance(v)) note(`${where}.${f}: unbalanced { }`);
              }
            }
            (it.options || []).forEach((o, oi) => {
              if (countDollars(o) % 2 !== 0) note(`${where}.option${oi}: odd $ delimiters`);
              if (!braceBalance(o)) note(`${where}.option${oi}: unbalanced { }`);
            });
            if (it.kind === 'mcq' && (typeof it.correct_index !== 'number' || it.correct_index < 0 || it.correct_index >= (it.options || []).length)) note(`${where}: bad correct_index`);
            if (it.kind === 'numerical' && !it.solution) note(`${where}: missing solution`);
          });
        });
        console.log(`   practice_bank: ${(b.sections || []).length} sections, ${nItems} items`);
        return;
      }
      if (!b.id) note(`p${p.page_number} block ${i}: missing id`);
      if (b.order !== i) note(`p${p.page_number} block ${i}: order=${b.order} != index`);
      const md = b.markdown || b.problem || b.solution || b.prompt || b.reveal || '';
      for (const field of ['markdown', 'problem', 'solution', 'prompt', 'reveal', 'note']) {
        const v = b[field];
        if (typeof v === 'string') {
          if (countDollars(v) % 2 !== 0) note(`p${p.page_number} block ${i} (${b.type}.${field}): odd number of $ delimiters`);
          if (!braceBalance(v)) note(`p${p.page_number} block ${i} (${b.type}.${field}): unbalanced { }`);
        }
      }
      if (b.type === 'latex_block') {
        if (!braceBalance(b.latex || '')) note(`p${p.page_number} block ${i}: latex_block unbalanced { }`);
      }
      if (b.type === 'image' && !b.src && !b.generation_prompt) note(`p${p.page_number} block ${i}: image has no src and no generation_prompt`);
      if (b.type === 'reasoning_prompt') {
        if (!Array.isArray(b.options) || b.options.length !== 4) note(`p${p.page_number} block ${i}: reasoning_prompt needs 4 options`);
        if (!b.reveal) note(`p${p.page_number} block ${i}: reasoning_prompt missing reveal`);
      }
      if (b.type === 'inline_quiz') {
        (b.questions || []).forEach((q, qi) => {
          if (!q.id) note(`p${p.page_number} quiz q${qi}: missing id`);
          if (!Array.isArray(q.options) || q.options.length !== 4) note(`p${p.page_number} quiz q${qi}: needs 4 options`);
          if (typeof q.correct_index !== 'number' || q.correct_index < 0 || q.correct_index > 3) note(`p${p.page_number} quiz q${qi}: bad correct_index`);
          if (!q.explanation) note(`p${p.page_number} quiz q${qi}: missing explanation`);
          if (typeof q.difficulty_level !== 'number') note(`p${p.page_number} quiz q${qi}: missing difficulty_level`);
          // length-tell heuristic on RENDERED length (strip LaTeX so $\ce{NO2}$ counts ~ "NO2")
          const rendered = (o) => o
            .replace(/\\ce\{([^}]*)\}/g, '$1')
            .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
            .replace(/\\[a-zA-Z]+/g, 'x')
            .replace(/[${}^_\\]/g, '')
            .length;
          const lens = q.options.map(rendered);
          const keyLen = lens[q.correct_index];
          const others = lens.filter((_, k) => k !== q.correct_index).sort((a, b) => b - a);
          if (keyLen > 1.3 * others[0]) note(`p${p.page_number} quiz q${qi}: key is >1.3x next-longest option (length tell)`);
        });
      }
    });
  }

  // answer-position balance across all quiz questions in the chapter
  const pos = [0, 0, 0, 0];
  let totalQ = 0;
  for (const p of pages) for (const b of p.blocks) if (b.type === 'inline_quiz') for (const q of b.questions) { pos[q.correct_index]++; totalQ++; }
  console.log(`\nAnswer-position spread across ${totalQ} quiz questions: A=${pos[0]} B=${pos[1]} C=${pos[2]} D=${pos[3]}`);
  pos.forEach((n, i) => { if (n / totalQ > 0.4) note(`position ${'ABCD'[i]} holds ${Math.round(100 * n / totalQ)}% of keys (>40%)`); if (n === 0) note(`position ${'ABCD'[i]} never used`); });

  console.log(problems === 0 ? '\n✅ PASS — no structural problems found.' : `\n❌ ${problems} problem(s) found.`);
  await c.close();
  process.exit(problems === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
