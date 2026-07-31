'use strict';
/**
 * Quality gate for the Class 12 Physics Live Book.
 *
 * Mechanical checks only — passing this does NOT excuse the qualitative rules
 * (option design, grounding, voice). It catches the defects that have actually
 * recurred on this platform:
 *
 *   1. Answer-position bias      (§4F.1 rule 4 — no position > 40%, none at 0%)
 *   2. Length tell               (§4F.1 rule 5 — key never > 1.3x next-longest)
 *   3. Positional wording        ("the first option…") — breaks under rotation
 *   4. difficulty_level          present, and 1–3 for inline_quiz (§17.6 rule 8)
 *   5. Structure                 heading[2] objectives, ≥1 image, ≤18 blocks,
 *                                a closing quiz, and a glossary
 *
 * Run: node scripts/physics12-book/_hygiene.js [chapterNumber]
 */
const { withDb } = require('../lib/book-writer');

const CHAPTER = process.argv[2] ? Number(process.argv[2]) : null;
const POSITIONAL = /\b(first|second|third|fourth|last)\s+option\b|\boption\s+[A-D]\b|\bchoice\s+[A-D]\b/i;

/**
 * Approximate what the reader actually SEES, so that option lengths and
 * duplicate-detection both behave sensibly on maths-heavy options.
 *
 * Stripping `$…$` wholesale (the first version of this script) turned every
 * pure-maths option into an empty string — which made four distinct options
 * look identical and made every length comparison meaningless. Instead: count
 * each LaTeX command as roughly one rendered glyph and drop the syntax.
 */
const plain = (s) => String(s || '')
  // Each LaTeX command becomes its first two letters: short enough to stand in
  // for one rendered glyph, but distinct — mapping them all to a single 'x'
  // made \sin and \cos identical and produced phantom duplicate-option reports.
  .replace(/\\([a-zA-Z]+)/g, (_, name) => name.slice(0, 2))
  .replace(/[${}\\*_`^]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

// Below this many visible characters, option length carries no real signal —
// "$ m/q $" vs "$ \sqrt{m/q} $" trips a 1.3x ratio on a 1-character difference.
const LENGTH_TELL_FLOOR = 14;

function checkOptions(where, prompt, options, correct_index, explanation, out, tally) {
  if (!Array.isArray(options) || options.length !== 4) {
    if (Array.isArray(options) && options.length !== 4) out.push(`${where}: has ${options.length} options, expected 4`);
    return;
  }
  if (correct_index == null || correct_index < 0 || correct_index > 3) {
    out.push(`${where}: correct_index out of range (${correct_index})`);
    return;
  }
  tally[correct_index]++;

  // duplicate options — case-SENSITIVE, because r and R are different symbols
  const seen = new Set(options.map((o) => plain(o)));
  if (seen.size !== 4) out.push(`${where}: duplicate/near-duplicate option text`);

  // length tell
  const lens = options.map((o) => plain(o).length);
  const keyLen = lens[correct_index];
  const otherMax = Math.max(...lens.filter((_, i) => i !== correct_index));
  if (otherMax >= LENGTH_TELL_FLOOR && keyLen > 1.3 * otherMax) {
    out.push(`${where}: LENGTH TELL — key is ${keyLen} chars vs next-longest ${otherMax}`);
  }

  // positional wording anywhere in the item
  const blob = `${prompt || ''} ${explanation || ''}`;
  if (POSITIONAL.test(blob)) out.push(`${where}: POSITIONAL WORDING in prompt/explanation`);
}

withDb(async (db) => {
  const book = await db.collection('books').findOne({ slug: 'class12-physics' });
  if (!book) { console.log('book not found'); return; }
  const filter = { book_id: book._id, deleted_at: null };
  if (CHAPTER != null) filter.chapter_number = CHAPTER;
  const pages = (await db.collection('book_pages').find(filter).toArray())
    .sort((a, c) => a.chapter_number - c.chapter_number || a.page_number - c.page_number);

  const problems = [];
  const tally = [0, 0, 0, 0];
  let quizItems = 0;
  let bankItems = 0;
  let reasonItems = 0;

  for (const p of pages) {
    const where0 = `ch${p.chapter_number} p${p.page_number} ${p.slug}`;
    const blocks = p.blocks || [];
    if (p.page_type === 'chapter_opener') continue;

    // ── structure ────────────────────────────────────────────────────────
    if (blocks.length > 18) problems.push(`${where0}: ${blocks.length} blocks (>18, §15.8 says split)`);
    const types = blocks.map((x) => x.type);
    if (!types.includes('image') && !types.includes('practice_bank')) {
      problems.push(`${where0}: no image block`);
    }
    if (!types.includes('inline_quiz') && !types.includes('practice_bank')) {
      problems.push(`${where0}: no closing quiz`);
    }
    const midCheck = types.includes('reasoning_prompt') || types.includes('step_solver')
      || types.filter((t) => t === 'inline_quiz').length > 1;
    if (!midCheck && !types.includes('practice_bank')) {
      problems.push(`${where0}: no mid-page check (§15.3)`);
    }
    if (!p.glossary && !types.includes('practice_bank')) {
      problems.push(`${where0}: no glossary terms (§15.9)`);
    }
    for (const h of blocks.filter((x) => x.type === 'heading' && x.level === 2)) {
      if (!h.objective) problems.push(`${where0}: heading "${h.text}" has no objective (§15.2)`);
    }

    // ── quiz + bank hygiene ──────────────────────────────────────────────
    for (const blk of blocks) {
      if (blk.type === 'inline_quiz') {
        for (const it of blk.questions || []) {
          quizItems++;
          const where = `${where0} quiz "${plain(it.question).slice(0, 40)}"`;
          checkOptions(where, it.question, it.options, it.correct_index, it.explanation, problems, tally);
          if (it.difficulty_level == null) problems.push(`${where}: missing difficulty_level`);
          else if (![1, 2, 3].includes(it.difficulty_level)) problems.push(`${where}: difficulty_level ${it.difficulty_level} (must be 1–3)`);
        }
      }
      if (blk.type === 'practice_bank') {
        for (const sec of blk.sections || []) {
          for (const it of sec.items || []) {
            if (it.kind !== 'mcq') continue;
            bankItems++;
            const where = `${where0} bank ${it.id}`;
            checkOptions(where, it.prompt, it.options, it.correct_index, it.explanation, problems, tally);
          }
        }
      }
      if (blk.type === 'reasoning_prompt' && Array.isArray(blk.options)) {
        const blob = `${blk.prompt} ${blk.reveal}`;
        if (POSITIONAL.test(blob)) problems.push(`${where0} reasoning_prompt: POSITIONAL WORDING`);
        // These were a BLIND SPOT until 2026-07-31: reasoning prompts carry four
        // options and a correct answer, but were never tallied here, so nothing
        // stopped the answer drifting to position A — it reached 94% across the
        // book (option D was never correct) before anyone noticed. They are
        // counted now. A block with no `correct_index` cannot be checked at all,
        // which is itself worth reporting, since the reader also cannot mark the
        // student right or wrong without it.
        if (blk.options.length === 4) {
          if (typeof blk.correct_index !== 'number') {
            problems.push(`${where0} reasoning_prompt "${plain(blk.prompt).slice(0, 40)}": no correct_index `
              + '— reader shows no verdict, and answer-position cannot be checked');
          } else {
            reasonItems++;
            checkOptions(`${where0} reasoning "${plain(blk.prompt).slice(0, 40)}"`,
              blk.prompt, blk.options, blk.correct_index, blk.reveal, problems, tally);
          }
        }
      }
    }
  }

  const total = tally.reduce((a, c) => a + c, 0);
  console.log(`\n── Answer-position spread (${total} four-option items: ${quizItems} quiz + ${bankItems} bank + ${reasonItems} reasoning)`);
  ['A', 'B', 'C', 'D'].forEach((L, i) => {
    const pct = total ? ((tally[i] / total) * 100).toFixed(1) : '0.0';
    const flag = total && (tally[i] / total > 0.4 ? '  ← OVER 40%' : (tally[i] === 0 ? '  ← ZERO' : ''));
    console.log(`   ${L}: ${String(tally[i]).padStart(3)}  ${String(pct).padStart(5)}%${flag}`);
  });

  console.log(`\n── Findings (${problems.length})`);
  if (problems.length === 0) console.log('   ✅ none');
  else problems.forEach((s) => console.log(`   • ${s}`));
  console.log('');
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
