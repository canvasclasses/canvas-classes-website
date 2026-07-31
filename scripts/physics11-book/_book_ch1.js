'use strict';
/**
 * Shared scaffold for the Class 11 Physics Live Book — Chapter 1,
 * "Units and Dimensions" (NCERT Ch.1 "Units and Measurement"; the title
 * follows the Crucible physics taxonomy, founder decision 2026-07-29).
 *
 * PURELY ADDITIVE + idempotent (matches by slug). Everything is created
 * UNPUBLISHED — nothing reaches students until the founder reviews and
 * publishes in the admin books editor.
 *
 * Plan: _agents/plans/PHYSICS_CH1_UNITS_AND_DIMENSIONS_PLAN.md
 *
 * Sources (Rule 0 — every fact, number and exercise is transcribed from these,
 * never generated from memory):
 *   • NCERT Class 11 Physics Ch.1, rationalised 2026-27 reprint.
 *   • "Units, Dimensions and Error Analysis", Objective Physics Vol.1 ch.1 —
 *     enrichment + problem layer ONLY. Per the standing no-third-party-
 *     attribution rule this book is NEVER named in student-facing text or in
 *     any practice-item source badge.
 */
const { computeReadingTime, computeContentTypes, withDb } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK = { slug: 'class11-physics' };

const CH = {
  number: 1,
  title: 'Units and Dimensions',
  slug: 'units-and-dimensions',
  description:
    'Every measurement is a number, a unit, and an honest admission of how much you do not know. '
    + 'Standard units and the SI seven, scientific notation and order of magnitude, converting between '
    + 'systems, significant figures, errors and how they combine, and then dimensions — what a quantity '
    + 'is made of, and the three things that fact lets you do.',
};

// block factory: b(type, order, extra) → { id, type, order, ...extra }
const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });

/**
 * Deterministic answer-position spreader.
 *
 * WHY THIS EXISTS: authors naturally write the correct option second or third,
 * and a first pass of this chapter came out 12/43/49/20 across A/B/C/D — 74% of
 * answers sat in B or C, which is a guessable pattern. (The same defect has
 * already recurred twice on this platform: Social Science and Math.)
 *
 * Rather than hand-shuffling 124 items, every MCQ factory rotates its options
 * by an amount derived from a stable hash of the question text (or item id).
 * Rotation is deterministic — the same item always lands in the same place, so
 * a rebuild reproduces the book exactly — and it preserves the relative order of
 * the distractors, so option sets that read as a sequence still read sensibly.
 *
 * HARD REQUIREMENT: an explanation must never refer to an option by position
 * ("the first option is the trap"). Reference the option's CONTENT instead.
 * `_hygiene_report_ch1.js` greps for positional wording and will flag any that
 * creep back in.
 */
const rotateHash = (seed) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};
const spread = (options, correct_index, seed) => {
  if (!Array.isArray(options) || options.length !== 4) return { options, correct_index };
  const k = rotateHash(seed) % 4;
  if (k === 0) return { options, correct_index };
  // rotate left by k
  const rotated = options.slice(k).concat(options.slice(0, k));
  return { options: rotated, correct_index: (correct_index - k + 4) % 4 };
};

// quiz-question factory
const q = (question, options, correct_index, explanation, difficulty_level) => {
  const s = spread(options, correct_index, question);
  return { id: uuidv4(), question, options: s.options, correct_index: s.correct_index, explanation, difficulty_level };
};

// step_solver step factory. `check` gates the step behind a micro-interaction —
// that gating is the whole point of the block (VanLehn d≈0.76), so a step
// without a check should be a deliberate choice, not an oversight.
const st = (math, say, extra) => ({ id: uuidv4(), math, say, ...(extra || {}) });

// practice-bank item factories.
// NOTE ON `source`: only 'ncert_exercise' | 'ncert_exemplar' | 'cbse_pyq' |
// 'jee_neet' | 'mcq' are permitted. Items adapted from the objective book use
// 'mcq' (no badge) — never a third-party attribution.
const mcq = (id, prompt, options, correct_index, explanation, source = 'mcq', source_label) => {
  const s = spread(options, correct_index, id);
  return {
    kind: 'mcq', id, source, ...(source_label ? { source_label } : {}),
    prompt, options: s.options, correct_index: s.correct_index, explanation,
  };
};
/**
 * An MCQ whose option ORDER is meaningful and must not be rotated.
 * Assertion–reason items are the case: options (a)–(d) are a fixed rubric
 * ("both true and R explains A", "both true but R does not explain A", …), so
 * shuffling them would destroy the format. Use `mcq` for everything else.
 */
const mcqFixed = (id, prompt, options, correct_index, explanation, source = 'mcq', source_label) => ({
  kind: 'mcq', id, source, ...(source_label ? { source_label } : {}), prompt, options, correct_index, explanation,
});

const num = (id, prompt, answer, solution, source = 'mcq', source_label) => ({
  kind: 'numerical', id, source, ...(source_label ? { source_label } : {}), prompt, answer, solution,
});

async function ensureChapter(db) {
  const books = db.collection('books');
  const now = new Date();
  const book = await books.findOne({ slug: BOOK.slug });
  if (!book) throw new Error('book class11-physics not found — build Ch.0 first');
  if (!book.chapters.some((c) => c.slug === CH.slug)) {
    await books.updateOne({ _id: book._id }, {
      $push: { chapters: { number: CH.number, title: CH.title, slug: CH.slug, page_ids: [], description: CH.description, is_published: false } },
      $set: { updated_at: now },
    });
    console.log('added chapter:', CH.number, CH.title);
  } else {
    console.log('chapter exists:', CH.title);
  }
  return book._id;
}

/**
 * Insert (or update-in-place if the slug already exists) the given pages, then
 * RESET the chapter's page_ids to ALL non-deleted pages ordered by page_number.
 *
 * §0.6 note: this only ever creates or REPLACES the blocks of a page this same
 * script authored. It never deletes a page and never touches another chapter.
 * Re-running is safe and idempotent.
 */
async function upsertPages(db, bookId, pageList) {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const now = new Date();
  for (const p of pageList) {
    const existing = await pages.findOne({ book_id: bookId, chapter_number: CH.number, slug: p.slug });
    // Re-index block.order sequentially from the array position. Hand-maintained
    // order numbers break silently the moment a block is inserted mid-page, and
    // the renderer sorts on this field — so the array IS the source of truth.
    p.blocks.forEach((blk, i) => { blk.order = i; });
    const common = {
      chapter_number: CH.number, page_number: p.page_number,
      title: p.title, subtitle: p.subtitle || undefined,
      blocks: p.blocks,
      glossary: p.glossary || undefined,
      page_type: p.page_type || 'lesson', published: false,
      reading_time_min: computeReadingTime(p.blocks),
      content_types: computeContentTypes(p.blocks),
      updated_at: now,
    };
    if (existing) {
      await pages.updateOne({ _id: existing._id }, { $set: common });
      console.log('  updated page', p.page_number, '·', p.slug, '·', common.reading_time_min, 'min');
    } else {
      await pages.insertOne({
        _id: uuidv4(), book_id: bookId, slug: p.slug, ...common,
        tags: [], deleted_at: null, created_at: now,
      });
      console.log('  created page', p.page_number, '·', p.slug, '·', common.reading_time_min, 'min');
    }
  }
  const all = await pages.find({ book_id: bookId, chapter_number: CH.number, deleted_at: null }, { projection: { _id: 1, page_number: 1 } }).toArray();
  all.sort((a, c) => a.page_number - c.page_number);
  await books.updateOne(
    { _id: bookId, 'chapters.slug': CH.slug },
    { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: now } },
  );
  console.log('  chapter page_ids set:', all.length, 'pages');
}

module.exports = { BOOK, CH, b, q, st, mcq, mcqFixed, num, ensureChapter, upsertPages, withDb };
