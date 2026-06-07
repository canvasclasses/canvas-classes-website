'use strict';
/**
 * Build the end-of-chapter Practice & Mastery page for one science chapter.
 * Reads scripts/science-practice/_ch<N>_practice.json:
 *   { subtitle?, intro?,
 *     chapter_practice: { title?, session_size?, pass_threshold?, questions:[...] },
 *     apply_express?:   { title?, intro?, challenges:[...] } }
 *
 * Builds the page (heading + text + chapter_practice [+ apply_express]), tags it
 * 'science_section:practice', publishes it, and wires its _id into book.chapters.
 * Idempotent by slug ch<N>-practice-mastery.
 *
 *   node scripts/science-practice/practice_build.js <ch> [--dry]
 *
 * Run balance_positions.js BEFORE this, and practice_validate.js AFTER. See §4F.3.
 */
const fs = require('fs');
const crypto = require('crypto');
const { withBook, SCIENCE_CONCEPTS } = require('./_lib');

const arg = process.argv[2];
const DRY = process.argv.includes('--dry');
const uid = () => crypto.randomUUID();
const CONCEPTS = SCIENCE_CONCEPTS;
// Science apply_express kinds (grammar kinds transform/spot_error/form_select are English-only).
const KINDS = ['fill_blank', 'predict_word', 'unscramble', 'sentence_compose'];

function vQuestion(q, where, errs) {
  if (!q.question) errs.push(`${where}: no question`);
  if (!Array.isArray(q.options) || q.options.length !== 4) errs.push(`${where}: needs exactly 4 options`);
  if (typeof q.correct_index !== 'number' || q.correct_index < 0 || q.correct_index >= (q.options || []).length) errs.push(`${where}: bad correct_index`);
  if (!CONCEPTS.includes(q.concept_tag)) errs.push(`${where}: concept_tag ${q.concept_tag} (use ${CONCEPTS.join('/')})`);
  if (![1, 2, 3, 4, 5].includes(q.difficulty)) errs.push(`${where}: difficulty`);
}
function vChallenge(c, where, errs) {
  if (!KINDS.includes(c.kind)) errs.push(`${where}: kind ${c.kind} (science kinds: ${KINDS.join('/')})`);
  if (![1, 2, 3, 4, 5].includes(c.difficulty)) errs.push(`${where}: difficulty`);
  const need = {
    fill_blank: () => /_{4,}/.test(c.prompt || '') && Array.isArray(c.answers) && c.answers.length,
    predict_word: () => c.lead && Array.isArray(c.answers) && c.answers.length,
    unscramble: () => Array.isArray(c.tokens) && c.tokens.length >= 3 && c.answer,
    sentence_compose: () => c.word && c.instruction && Array.isArray(c.rubric) && c.model_answer,
  }[c.kind];
  if (need && !need()) errs.push(`${where}: ${c.kind} missing fields`);
}

async function buildOne(ctx, ch) {
  const { pages, books, book, bookId, allPages } = ctx;
  const data = JSON.parse(fs.readFileSync(`scripts/science-practice/_ch${ch}_practice.json`, 'utf8'));
  const errs = [];
  data.chapter_practice.questions.forEach((q, i) => vQuestion(q, `ch${ch} cp#${i}`, errs));
  (data.apply_express?.challenges || []).forEach((c, i) => vChallenge(c, `ch${ch} ae#${i}`, errs));
  if (errs.length) { errs.forEach((e) => console.log('  ✗', e)); throw new Error(`Ch${ch}: ${errs.length} validation errors`); }

  let order = 2;
  // Note: the Mongo driver stores `undefined` as null, which Zod's optional
  // string fields reject — so only include optional keys when they have a value.
  const cp = {
    id: uid(), type: 'chapter_practice', order: order++,
    title: data.chapter_practice.title || `Chapter ${ch} Practice`,
    ...(data.chapter_practice.intro ? { intro: data.chapter_practice.intro } : {}),
    chapter_number: ch,
    session_size: data.chapter_practice.session_size || 12,
    pass_threshold: data.chapter_practice.pass_threshold || 0.7,
    questions: data.chapter_practice.questions.map((q, i) => ({ id: `ch${ch}-pr-${String(i + 1).padStart(2, '0')}`, ...q })),
  };
  const blocks = [
    { id: uid(), type: 'heading', order: 0, level: 1, text: 'Practice & Mastery' },
    { id: uid(), type: 'text', order: 1, markdown: data.intro || `This is where reading turns into knowing. Work through an adaptive set that mixes every idea from this chapter — concepts, real-world situations, and the numericals — then prove it in the challenges below.` },
    cp,
  ];
  if (data.apply_express?.challenges?.length) {
    blocks.push({
      id: uid(), type: 'apply_express', order: order++,
      title: data.apply_express.title || 'Apply & Express',
      ...(data.apply_express.intro ? { intro: data.apply_express.intro } : {}),
      chapter_number: ch, variant: 'apply',
      challenges: data.apply_express.challenges.map((c, i) => ({ id: `ch${ch}-ae-${String(i + 1).padStart(2, '0')}`, concept_tag: c.concept_tag || 'application', ...c })),
    });
  }

  const slug = `ch${ch}-practice-mastery`;
  const existing = allPages.find((p) => p.slug === slug);
  const aeCount = data.apply_express?.challenges?.length || 0;
  const counts = { cp: cp.questions.length, ae: aeCount, tags: new Set(cp.questions.map((q) => q.concept_tag)).size };
  if (existing) {
    console.log(`Ch${ch}: updating existing ${slug} (cp:${counts.cp} ae:${counts.ae} tags:${counts.tags})`);
    if (!DRY) await pages.updateOne({ _id: existing._id }, { $set: { blocks, tags: ['science_section:practice'], content_types: ['practice'], published: true, subtitle: data.subtitle || existing.subtitle, updated_at: new Date() } });
    return;
  }
  const maxPage = Math.max(...allPages.filter((p) => p.chapter_number === ch).map((p) => p.page_number));
  const doc = {
    _id: uid(), book_id: bookId, chapter_number: ch, page_number: maxPage + 1, slug,
    title: 'Practice & Mastery', subtitle: data.subtitle || 'Bring it all together — and prove it',
    blocks, hinglish_blocks: [], tags: ['science_section:practice'], published: true,
    content_types: ['practice'], created_at: new Date(), updated_at: new Date(),
  };
  console.log(`Ch${ch}: inserting NEW ${slug} as page ${doc.page_number} (cp:${counts.cp} ae:${counts.ae} tags:${counts.tags})`);
  if (!DRY) {
    await pages.insertOne(doc);
    await books.updateOne(
      { _id: book._id },
      { $addToSet: { 'chapters.$[c].page_ids': doc._id }, $set: { updated_at: new Date() } },
      { arrayFilters: [{ 'c.number': ch }] }
    );
  }
}

(async () => {
  await withBook(async (ctx) => {
    if (!arg || arg === 'all') throw new Error('Pass a chapter number, e.g. node practice_build.js 6');
    await buildOne(ctx, Number(arg));
    console.log(DRY ? '\n[DRY] nothing written.' : '\nPractice page saved.');
  });
})().catch((e) => { console.error(e); process.exit(1); });
