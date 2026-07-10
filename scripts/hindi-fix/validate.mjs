// Canonical question-quality gate for the Class 9 Hindi गंगा book.
// Mirrors the Kaveri rubric (ENGLISH_BOOK_PAGE_WORKFLOW.md §4.15), adapted for Hindi.
// Read-only. Exit 0 = PASS (graded banks + answer-position), 1 = FAIL.
//   node scripts/hindi-fix/validate.mjs            # whole book
//   node scripts/hindi-fix/validate.mjs <chapter>
import dotenv from 'dotenv'; import { createRequire } from 'module';
const require = createRequire(import.meta.url); dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const onlyCh = process.argv[2] ? Number(process.argv[2]) : null;
const seg = new Intl.Segmenter('hi', { granularity: 'grapheme' });
const len = (s) => [...seg.segment(String(s))].length;        // grapheme-aware (fair for Devanagari)
const POS = ['A', 'B', 'C', 'D']; const CONCEPTS = ['comprehension', 'vocab_in_context', 'grammar', 'interpretation', 'inference'];
const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
const longest = (o, ci) => { const L = o.map(len); return L[ci] === Math.max(...L); };
const giveaway = (o, ci) => { const L = o.map(len); const r = L.filter((_, k) => k !== ci); return r.length && L[ci] >= 12 && L[ci] > 1.3 * Math.max(...r); }; // floor: a <12-grapheme correct option can't be a visible length tell
const REASON = /(क्यों|कैसे|किस तरह|किस ओर|भाव|आशय|संकेत|दर्शाता|दर्शाती|व्यक्त|प्रतीक|तात्पर्य|उभरती|झलक|समझ|सीख|प्रेरणा)/;

const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
const db = c.db('crucible'); const book = await db.collection('books').findOne({ slug: 'class9-hindi-ganga' });
const pages = await db.collection('book_pages').find({ book_id: String(book._id) }).sort({ chapter_number: 1, page_number: 1 }).toArray();
let FAIL = false;
const allPos = [0, 0, 0, 0];
const inlineByCh = {}, practiceByCh = {};
for (const p of pages) {
  if (onlyCh && p.chapter_number !== onlyCh) continue;
  for (const b of p.blocks || []) {
    const push = (m, q) => { if (q.options && q.correct_index != null) { (m[p.chapter_number] ??= []).push(q); allPos[q.correct_index]++; } };
    if (b.type === 'inline_quiz') for (const q of b.questions || []) push(inlineByCh, q);
    else if (b.type === 'chapter_practice') for (const q of b.questions || []) push(practiceByCh, q);
    else if (b.type === 'comprehension_checkpoint') for (const q of b.questions || []) { if (q.options && q.correct_index != null) allPos[q.correct_index]++; }
    else if (b.type === 'vocabulary_lab') for (const q of b.self_check || []) { if (q.options && q.correct_index != null) allPos[q.correct_index]++; }
    else if (b.type === 'apply_express') for (const q of b.challenges || []) { if (q.kind === 'form_select' && q.options && q.correct_index != null) allPos[q.correct_index]++; }
  }
}
const tot = allPos.reduce((a, b) => a + b, 0);
console.log(`\nWhole-book MCQ answer-position (all surfaces): A ${pct(allPos[0], tot)}% B ${pct(allPos[1], tot)}% C ${pct(allPos[2], tot)}% D ${pct(allPos[3], tot)}%  (chance ≈25%)`);
if (Math.max(...allPos) > tot * 0.4) { FAIL = true; console.log('  ❌ a position exceeds 40% book-wide'); }

console.log('\n── chapter_practice (graded banks: full rubric) ──');
for (const ch of Object.keys(practiceByCh).sort((a, b) => a - b)) {
  const qs = practiceByCh[ch]; const f = [], w = [];
  if (qs.length < 24) f.push(`size ${qs.length}<24`);
  const tag = Object.fromEntries(CONCEPTS.map(t => [t, 0])); for (const q of qs) if (tag[q.concept_tag] != null) tag[q.concept_tag]++;
  const miss = CONCEPTS.filter(t => tag[t] === 0); if (miss.length) f.push(`missing tags ${miss.join(',')}`);
  const diff = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; for (const q of qs) if (diff[q.difficulty] != null) diff[q.difficulty]++;
  if (Math.max(...Object.values(diff)) > qs.length * 0.5) f.push('a difficulty >50%');
  if (Object.values(diff).some(v => v === 0)) w.push('a difficulty level unused');
  const pos = [0, 0, 0, 0]; for (const q of qs) pos[q.correct_index]++;
  if (Math.max(...pos) > qs.length * 0.4) f.push(`position ${POS[pos.indexOf(Math.max(...pos))]} >40%`);
  if (pos.some(v => v === 0)) f.push('a position unused');
  const give = qs.filter(q => giveaway(q.options, q.correct_index)).length; if (give) f.push(`${give} length-giveaway(s) >1.3×`);
  const lng = qs.filter(q => longest(q.options, q.correct_index)).length; if (pct(lng, qs.length) > 40) w.push(`longest ${pct(lng, qs.length)}%`);
  qs.forEach((q, i) => { if (!Array.isArray(q.options) || q.options.length !== 4) f.push(`q${i + 1} not 4 opts`); const s = new Set(q.options.map(o => String(o).trim())); if (s.size !== q.options.length) f.push(`q${i + 1} dup option`); });
  let content = 0, reas = 0; for (const q of qs) { if (q.concept_tag === 'vocab_in_context' || q.concept_tag === 'grammar') continue; content++; if (q.concept_tag === 'interpretation' || q.concept_tag === 'inference' || REASON.test(q.question || '')) reas++; }
  if (content && pct(reas, content) < 60) w.push(`reasoning ${pct(reas, content)}%<60`);
  if (f.length) FAIL = true;
  console.log(`  Ch${String(ch).padStart(2)} n=${qs.length} ${f.length ? '❌' : '✅'} pos ${pos.join('/')} | concepts ${CONCEPTS.map(t => tag[t]).join('/')} | diff ${[1, 2, 3, 4, 5].map(d => diff[d]).join('/')} | reasoning ${pct(reas, content)}%`);
  f.forEach(x => console.log(`       ❌ ${x}`)); w.forEach(x => console.log(`       ⚠️  ${x}`));
}
console.log('\n── inline_quiz (formative: position AND >1.3× length giveaway are both GATES) ──');
for (const ch of Object.keys(inlineByCh).sort((a, b) => a - b)) {
  const qs = inlineByCh[ch]; const pos = [0, 0, 0, 0]; for (const q of qs) pos[q.correct_index]++;
  const posFail = Math.max(...pos) > qs.length * 0.4 || pos.some(v => v === 0);
  const give = qs.filter(q => giveaway(q.options, q.correct_index)).length;
  if (posFail || give) FAIL = true;          // inline length tell hand-cleared (Ch1–12) → now a hard gate to catch regressions
  console.log(`  Ch${String(ch).padStart(2)} n=${qs.length} pos ${pos.join('/')} ${posFail ? '❌POS' : '✅'} | length-giveaways ${give} ${give ? '❌' : ''}`);
}
// ── ADVISORY: key↔explanation consistency (catches mis-keyed items like the 2026-06 pr-21/pr-23 bug) ──
// On 2026-06 23 graded keys pointed at the WRONG option while the explanation described the RIGHT one;
// the position/length gates passed because the keys were spread, so nothing caught it. This is a
// token-overlap heuristic between the explanation and each option. It CANNOT tell a wrong key from a
// distractor that is the semantic OPPOSITE using shared words, so it is ADVISORY (never fails the build) —
// it just prints a short list to eyeball. Every one of the 23 real bugs would have shown up here.
const wtok = (s) => { const set = new Set(); for (const w of String(s || '').replace(/[।,.\-—()'"’‘:;?!]/g, ' ').split(/\s+/)) if ([...seg.segment(w)].length > 2) set.add(w); return set; };
const wov = (a, b) => { const A = wtok(a), B = wtok(b); let n = 0; for (const t of A) if (B.has(t)) n++; return n; };
const keySuspects = [];
for (const [map, label] of [[practiceByCh, 'practice'], [inlineByCh, 'inline']]) {
  for (const ch of Object.keys(map)) for (const q of map[ch]) {
    if (!q.options || q.correct_index == null || !q.explanation) continue;
    const ov = q.options.map((o) => wov(q.explanation, (o.text ?? o)));
    const mx = Math.max(...ov); const best = ov.indexOf(mx);
    if (best !== q.correct_index && mx - ov[q.correct_index] >= 2 && ov[q.correct_index] <= 1)
      keySuspects.push(`Ch${ch} ${label} ${q.id || '(noid)'}: keyed #${q.correct_index} (ov ${ov[q.correct_index]}) vs explanation best #${best} (ov ${mx})`);
  }
}
console.log('\n── key↔explanation review (ADVISORY — token-overlap heuristic; verify by hand, not a gate) ──');
if (keySuspects.length) { console.log(`  ⚠️ ${keySuspects.length} question(s) to eyeball (key may not match its explanation):`); keySuspects.forEach((s) => console.log(`     ${s}`)); }
else console.log('  ✅ none flagged');

console.log(`\nRESULT: ${FAIL ? '❌ FAIL' : '✅ PASS'}  (gate = graded banks + answer-position + zero >1.3× length giveaways on every surface)`);
await c.close();
process.exit(FAIL ? 1 : 0);
