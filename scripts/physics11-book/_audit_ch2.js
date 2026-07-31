'use strict';
/**
 * Read-only audit of Class 11 Physics Ch.2 "Motion in One Dimension".
 * Measures the things a page-by-page eyeball review misses:
 *   • answer-position balance and length-tells across every MCQ
 *   • difficulty-tag coverage
 *   • the action-gated ratio (the HC Verma house-rule metric)
 *   • exposition runs longer than the ~120-word cap between practice items
 *   • per-page practice counts, so thin pages are visible
 *
 * Run: node scripts/physics11-book/_audit_ch2.js
 */
const { withDb } = require('../lib/book-writer');

const INTERACTIVE = new Set([
  'step_solver', 'inline_quiz', 'practice_bank', 'classify_exercise',
  'reasoning_prompt', 'curiosity_prompt', 'simulation', 'mind_map',
]);
const words = (s) => (s || '').replace(/\$[^$]*\$/g, ' ').split(/\s+/).filter(Boolean).length;

/**
 * A length-tell that a student could actually exploit: the correct option is the
 * longest AND is at least 25% longer than the next longest. A bare "is it the
 * longest?" test is useless here — it fires on "candela" (7 chars) against
 * "newton" (6), which no student on earth reads as a hint.
 */
const isTell = (options, ci) => {
  if (!options || options.length !== 4) return false;
  const lens = options.map((o) => o.length);
  const mine = lens[ci];
  const others = lens.filter((_, i) => i !== ci);
  const runnerUp = Math.max(...others);
  return mine > runnerUp && mine >= runnerUp * 1.25;
};

/**
 * Words of EXPOSITION — continuous prose the student reads before the next thing
 * to do. The ~120-word house rule is about prose, so a reference table is not
 * counted: a student scans a lookup table, they do not read it top to bottom.
 * (Counting table cells was making a 20-row dimensional-formula table look like
 * a 230-word lecture, which sent the first pass chasing a phantom.)
 */
const blockWords = (b) => {
  if (b.type === 'table') return 0;
  let n = 0;
  for (const k of ['markdown', 'text', 'intro', 'caption']) n += words(b[k]);
  if (b.type === 'comparison_card') n += (b.columns || []).reduce((a, c) => a + (c.points || []).reduce((x, p) => x + words(p), 0), 0);
  return n;
};

withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class11-physics' });
  const pages = await db.collection('book_pages')
    .find({ book_id: book._id, chapter_number: 2, deleted_at: null }).toArray();
  pages.sort((a, b) => a.page_number - b.page_number);

  const pos = [0, 0, 0, 0];
  let lengthTell = 0, mcqTotal = 0, untagged = 0, quizTotal = 0;
  let gated = 0, passive = 0;
  const longRuns = [];
  const perPage = [];

  for (const p of pages) {
    // A chapter opener has no practice by design — it is a cover page.
    const isOpener = p.page_type === 'chapter_opener';
    let items = 0, ss = 0, ssChecks = 0, nyt = 0, bankItems = 0, quizQs = 0;
    let run = 0, runStart = null;

    for (const b of p.blocks) {
      if (INTERACTIVE.has(b.type)) {
        if (run > 120 && !isOpener) longRuns.push({ page: p.page_number, slug: p.slug, words: run, from: runStart });
        run = 0; runStart = null;
      } else {
        if (run === 0) runStart = b.type;
        run += blockWords(b);
      }

      if (b.type === 'step_solver') {
        ss++; items++;
        for (const s of b.steps || []) if (s.check) { ssChecks++; gated++; }
        if (b.now_you_try) { nyt++; gated++; }
      }
      if (b.type === 'inline_quiz') {
        for (const q of b.questions || []) {
          quizQs++; quizTotal++; gated++; items++;
          if (q.difficulty_level == null) untagged++;
          if (q.options && q.options.length === 4) {
            mcqTotal++; pos[q.correct_index]++;
            if (isTell(q.options, q.correct_index)) lengthTell++;
          }
        }
      }
      if (b.type === 'practice_bank') {
        for (const sec of b.sections || []) for (const it of sec.items || []) {
          bankItems++; items++; gated++;
          if (it.kind === 'mcq' && it.options && it.options.length === 4) {
            mcqTotal++; pos[it.correct_index]++;
            if (isTell(it.options, it.correct_index)) lengthTell++;
          }
        }
      }
      if (b.type === 'classify_exercise') { items += (b.rows || []).length; gated += (b.rows || []).length; }
      if (b.type === 'reasoning_prompt' || b.type === 'curiosity_prompt') { items++; gated++; }
      if (b.type === 'worked_example') passive++;
    }
    if (run > 120 && !isOpener) longRuns.push({ page: p.page_number, slug: p.slug, words: run, from: runStart });

    perPage.push({ n: p.page_number, slug: p.slug, items, ss, ssChecks, nyt, bankItems, quizQs,
      blocks: p.blocks.length, mins: p.reading_time_min });
  }

  console.log('\n=== PER-PAGE ===');
  console.log('pg  items  stepSolvers(checks)  nowYouTry  bank  quizQ  blocks');
  for (const r of perPage) {
    console.log(
      String(r.n).padEnd(4),
      String(r.items).padEnd(6),
      `${r.ss}(${r.ssChecks})`.padEnd(20),
      String(r.nyt).padEnd(10),
      String(r.bankItems).padEnd(5),
      String(r.quizQs).padEnd(6),
      r.blocks, ' ', r.slug,
    );
  }

  const totalItems = perPage.reduce((a, r) => a + r.items, 0);
  console.log('\n=== CHAPTER TOTALS ===');
  console.log('pages:', pages.length, '| practice items:', totalItems);
  console.log('action-gated:', gated, '| passive worked_example:', passive,
    '| gated ratio:', ((gated / (gated + passive)) * 100).toFixed(1) + '%');
  console.log('\n=== QUIZ HYGIENE ===');
  console.log('4-option MCQs:', mcqTotal, '| answer positions A/B/C/D:', pos.join(' / '),
    '(ideal ~' + Math.round(mcqTotal / 4) + ' each)');
  console.log('length-tells (correct option is the longest):', lengthTell,
    `(${((lengthTell / mcqTotal) * 100).toFixed(0)}%)`);
  console.log('inline-quiz questions:', quizTotal, '| untagged for difficulty:', untagged);

  console.log('\n=== EXPOSITION RUNS OVER 120 WORDS ===');
  if (!longRuns.length) console.log('none — every run of prose is under the cap');
  for (const r of longRuns) console.log(`  p${r.page} ${r.slug}: ${r.words} words (starts at a ${r.from} block)`);
  console.log('');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
