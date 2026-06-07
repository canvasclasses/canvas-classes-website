'use strict';
/**
 * Fix #4 — extensive Practice & Mastery page for one chapter (or all).
 * Reads scripts/kaveri-fix/_ch<N>_practice.json:
 *   { subtitle?, intro?, chapter_practice:{ title, session_size, pass_threshold, questions:[...] },
 *     apply_express:{ title, challenges:[...] } }
 * Builds the page (heading + text + chapter_practice + apply_express), tags it
 * 'kaveri_section:practice', publishes it, and wires its _id into book.chapters.
 * Idempotent by slug ch<N>-practice-mastery.  Run: node practice_build.js <ch|all> [--dry]
 */
const fs = require('fs');
const crypto = require('crypto');
const { withBook } = require('./_lib');

const arg = process.argv[2];
const DRY = process.argv.includes('--dry');
const uid = () => crypto.randomUUID();
const CONCEPTS = ['comprehension', 'vocab_in_context', 'grammar', 'interpretation', 'inference'];
const KINDS = ['fill_blank', 'predict_word', 'word_builder', 'sentence_compose', 'unscramble', 'word_match', 'transform', 'spot_error', 'form_select'];

function vQuestion(q, where, errs) {
  if (!q.question) errs.push(`${where}: no question`);
  if (!Array.isArray(q.options) || q.options.length < 2) errs.push(`${where}: <2 options`);
  if (typeof q.correct_index !== 'number' || q.correct_index < 0 || q.correct_index >= (q.options || []).length) errs.push(`${where}: bad correct_index`);
  if (!CONCEPTS.includes(q.concept_tag)) errs.push(`${where}: concept_tag ${q.concept_tag}`);
  if (![1, 2, 3, 4, 5].includes(q.difficulty)) errs.push(`${where}: difficulty`);
}
function vChallenge(c, where, errs) {
  if (!KINDS.includes(c.kind)) errs.push(`${where}: kind ${c.kind}`);
  if (![1, 2, 3, 4, 5].includes(c.difficulty)) errs.push(`${where}: difficulty`);
  const need = {
    fill_blank: () => /_{4,}/.test(c.prompt || '') && Array.isArray(c.answers) && c.answers.length,
    predict_word: () => c.lead && Array.isArray(c.answers) && c.answers.length,
    word_builder: () => c.base && Array.isArray(c.affixes) && c.correct && c.target,
    sentence_compose: () => c.word && c.instruction && Array.isArray(c.rubric) && c.model_answer,
    unscramble: () => Array.isArray(c.tokens) && c.tokens.length >= 3 && c.answer,
    word_match: () => Array.isArray(c.pairs) && c.pairs.length >= 2 && c.pairs.every((p) => p.left && p.right),
    transform: () => c.source && c.instruction && Array.isArray(c.answers) && c.answers.length,
    spot_error: () => Array.isArray(c.tokens) && c.tokens.length >= 3 && typeof c.error_index === 'number' && c.fix,
    form_select: () => (c.prompt || '').includes('____') && Array.isArray(c.options) && c.options.length >= 2 && typeof c.correct_index === 'number',
  }[c.kind];
  if (need && !need()) errs.push(`${where}: ${c.kind} missing fields`);
}

async function buildOne(ctx, ch) {
  const { pages, books, book, bookId, allPages } = ctx;
  const data = JSON.parse(fs.readFileSync(`scripts/kaveri-fix/_ch${ch}_practice.json`, 'utf8'));
  const errs = [];
  data.chapter_practice.questions.forEach((q, i) => vQuestion(q, `ch${ch} cp#${i}`, errs));
  data.apply_express.challenges.forEach((c, i) => vChallenge(c, `ch${ch} ae#${i}`, errs));
  if (errs.length) { errs.forEach((e) => console.log('  ✗', e)); throw new Error(`Ch${ch}: ${errs.length} validation errors`); }

  const cp = {
    id: uid(), type: 'chapter_practice', order: 2,
    title: data.chapter_practice.title || `Chapter ${ch} Practice`,
    intro: data.chapter_practice.intro || undefined,
    chapter_number: ch,
    session_size: data.chapter_practice.session_size || 10,
    pass_threshold: data.chapter_practice.pass_threshold || 0.7,
    questions: data.chapter_practice.questions.map((q, i) => ({ id: `ch${ch}-pr-${String(i + 1).padStart(2, '0')}`, ...q })),
  };
  const ae = {
    id: uid(), type: 'apply_express', order: 3,
    title: data.apply_express.title || 'Apply & Express',
    intro: data.apply_express.intro || undefined,
    chapter_number: ch,
    challenges: data.apply_express.challenges.map((c, i) => ({ id: `ch${ch}-ae-${String(i + 1).padStart(2, '0')}`, concept_tag: c.concept_tag || (['transform', 'spot_error', 'form_select'].includes(c.kind) ? 'grammar' : 'vocab_in_context'), ...c })),
  };
  const blocks = [
    { id: uid(), type: 'heading', order: 0, level: 1, text: 'Practice & Mastery' },
    { id: uid(), type: 'text', order: 1, markdown: data.intro || `This is where reading turns into knowing. Work through an adaptive set that mixes everything from this chapter — the story and the poem, vocabulary, grammar, and the ideas underneath — then prove it in the Apply & Express challenges.` },
    cp, ae,
  ];

  const slug = `ch${ch}-practice-mastery`;
  const existing = allPages.find((p) => p.slug === slug);
  const counts = { cp: cp.questions.length, ae: ae.challenges.length, tags: new Set(cp.questions.map((q) => q.concept_tag)).size };
  if (existing) {
    console.log(`Ch${ch}: updating existing ${slug} (cp:${counts.cp} ae:${counts.ae} tags:${counts.tags})`);
    if (!DRY) await pages.updateOne({ _id: existing._id }, { $set: { blocks, tags: ['kaveri_section:practice'], content_types: ['practice'], published: true, subtitle: data.subtitle || existing.subtitle, updated_at: new Date() } });
    return;
  }
  const maxPage = Math.max(...allPages.filter((p) => p.chapter_number === ch).map((p) => p.page_number));
  const doc = {
    _id: uid(), book_id: bookId, chapter_number: ch, page_number: maxPage + 1, slug,
    title: 'Practice & Mastery', subtitle: data.subtitle || 'Bring it all together — and prove it',
    blocks, hinglish_blocks: [], tags: ['kaveri_section:practice'], published: true,
    content_types: ['practice'], created_at: new Date(), updated_at: new Date(),
  };
  console.log(`Ch${ch}: inserting NEW ${slug} as page ${doc.page_number} (cp:${counts.cp} ae:${counts.ae} tags:${counts.tags})`);
  if (!DRY) {
    await pages.insertOne(doc);
    // Atomic per-chapter append — avoids clobbering sibling chapters' page_ids
    // when several practice pages are built in one run.
    await books.updateOne(
      { _id: book._id },
      { $addToSet: { 'chapters.$[c].page_ids': doc._id }, $set: { updated_at: new Date() } },
      { arrayFilters: [{ 'c.number': ch }] }
    );
  }
}

(async () => {
  await withBook(async (ctx) => {
    const chapters = arg === 'all' ? [2, 3, 4, 5, 6, 7, 8] : [Number(arg)];
    for (const ch of chapters) await buildOne(ctx, ch);
    console.log(DRY ? '\n[DRY] nothing written.' : '\nPractice pages saved.');
  });
})().catch((e) => { console.error(e); process.exit(1); });
