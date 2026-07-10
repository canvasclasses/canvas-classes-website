'use strict';
/**
 * Authoring toolkit + idempotent builder for the Class 12 Chemical Kinetics Live Book.
 * Chapter 3 of `ncert-simplified-12`. Pages are inserted as DRAFTS (published:false).
 *
 * New pages are inserted directly into `book_pages`. Re-runs UPDATE an existing page's
 * blocks via book-writer.savePage so the content-protection version history/audit still
 * fires. allowContentLoss is passed only for these agent-authored DRAFT rebuilds in the
 * same build session (the pages are not yet founder content), with a clear reason.
 */
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');

const BOOK_SLUG = 'ncert-simplified-12';
const CH_NUMBER = 3;
const CH_TITLE = 'Ch. 3 | Chemical Kinetics';
const CH_SLUG = 'chemical-kinetics';
const CH_DESC = 'How fast reactions go and what controls their speed — rate, rate law and order, '
  + 'integrated rate laws (zero/first/second order), reaction mechanisms, the Arrhenius equation, '
  + 'collision & transition-state theory, and catalysis. Full NCERT Class 12 Chapter 3, JEE/NEET ready.';

// ─── Block authoring helpers ────────────────────────────────────────────────
const B = {
  hero: (alt, prompt) => ({ type: 'image', src: '', caption: '', width: 'full', aspect_ratio: '16:5', alt, generation_prompt: prompt }),
  img: (alt, caption, prompt, aspect_ratio = '4:3') => ({ type: 'image', src: '', caption, width: 'full', aspect_ratio, alt, generation_prompt: prompt }),
  text: (markdown) => ({ type: 'text', markdown }),
  heading: (text, level = 2) => ({ type: 'heading', level, text }),
  callout: (variant, title, markdown) => ({ type: 'callout', variant, title, markdown }),
  latex: (latex, label, note) => { const b = { type: 'latex_block', latex }; if (label) b.label = label; if (note) b.note = note; return b; },
  table: (caption, headers, rows) => ({ type: 'table', caption, headers, rows }),
  comparison: (title, columns) => ({ type: 'comparison_card', title, columns }),
  // reasoning_prompt is NOT auto-graded: options + reveal only (no correct_index) — matches live schema.
  reason: (reasoning_type, prompt, options, reveal, difficulty_level = 2) => ({ type: 'reasoning_prompt', reasoning_type, prompt, options, reveal, difficulty_level }),
  worked: (label, problem, solution, variant = 'solved_example') => ({ type: 'worked_example', label, variant, problem, solution, reveal_mode: 'tap_to_reveal' }),
  sim: (simulation_id, title, prediction) => { const b = { type: 'simulation', simulation_id, title }; if (prediction) b.prediction = prediction; return b; },
  quiz: (questions) => ({
    type: 'inline_quiz',
    pass_threshold: questions.length === 1 ? 1 : (questions.length <= 3 ? 0.67 : 0.6),
    questions: questions.map((q) => ({ id: uuid(), ...q })),
  }),
  // section-navigated practice bank (matches PracticeBankRenderer)
  bank: (title, intro, sections) => ({ type: 'practice_bank', title, intro, sections }),
};

// practice_bank item + section builders
const pnum = (source_label, prompt, answer, solution, source = 'ncert_exercise') =>
  ({ kind: 'numerical', id: uuid(), source, source_label, prompt, answer, solution });
const pmcq = (source_label, prompt, options, correct_index, explanation, source = 'ncert_exercise') =>
  ({ kind: 'mcq', id: uuid(), source, source_label, prompt, options, correct_index, explanation });
const psec = (id, title, blurb, items) => ({ id, title, blurb, items });

// Assign id + order to every top-level block.
function normalize(blocks) {
  return blocks.map((b, i) => ({ id: b.id || uuid(), order: i, ...b, ...(b.id ? {} : {}), }))
    .map((b, i) => ({ ...b, order: i, id: b.id || uuid() }));
}

// Build a page-definition object.
function page(page_number, slug, title, subtitle, tags, blocks) {
  return { page_number, slug, title, subtitle, tags, blocks: normalize(blocks) };
}

// Deterministically spread inline_quiz answer keys across A/B/C/D.
// Safe because every explanation references option CONTENT, never a letter.
function balanceQuizKeys(pages) {
  let q = 0;
  for (const p of pages) {
    for (const b of p.blocks) {
      if (b.type !== 'inline_quiz') continue;
      for (const question of b.questions) {
        const target = q % 4;
        q++;
        const ci = question.correct_index;
        if (ci === target) continue;
        const opts = question.options;
        [opts[ci], opts[target]] = [opts[target], opts[ci]];
        question.correct_index = target;
      }
    }
  }
}

// ─── Idempotent upsert of the chapter + its pages ───────────────────────────
async function buildPages(pages) {
  balanceQuizKeys(pages);
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  try {
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);

    const page_ids = [];
    for (const p of pages) {
      const existing = await pagesCol.findOne({ book_id: book._id, slug: p.slug });
      if (existing) {
        // Update blocks + meta via book-writer (keeps version history + audit).
        await bw.savePage(db, { pageId: existing._id }, p.blocks, {
          author: 'agent-ck-build',
          summary: `CK pilot rebuild: ${p.slug}`,
          allowContentLoss: true,
          lossReason: 'Agent-authored CK draft rebuild, same build session (founder approved build).',
          extraSet: { title: p.title, subtitle: p.subtitle, tags: p.tags, chapter_number: CH_NUMBER, page_number: p.page_number, published: false },
        });
        page_ids.push(existing._id);
        console.log(`  updated  p${p.page_number}  ${p.slug}  (${p.blocks.length} blocks)`);
      } else {
        const _id = uuid();
        const now = new Date();
        await pagesCol.insertOne({
          _id,
          book_id: book._id,
          chapter_number: CH_NUMBER,
          page_number: p.page_number,
          title: p.title,
          subtitle: p.subtitle,
          slug: p.slug,
          blocks: p.blocks,
          tags: p.tags,
          reading_time_min: bw.computeReadingTime(p.blocks),
          content_types: bw.computeContentTypes(p.blocks),
          published: false,
          created_at: now,
          updated_at: now,
        });
        page_ids.push(_id);
        console.log(`  inserted p${p.page_number}  ${p.slug}  (${p.blocks.length} blocks)`);
      }
    }

    // Ensure the chapter entry exists in book.chapters and its page_ids are wired (merge, preserve order/extras).
    const chapters = Array.isArray(book.chapters) ? [...book.chapters] : [];
    const idx = chapters.findIndex((c) => c.number === CH_NUMBER);
    const existingIds = idx >= 0 && Array.isArray(chapters[idx].page_ids) ? chapters[idx].page_ids : [];
    const mergedIds = [...existingIds];
    for (const id of page_ids) if (!mergedIds.includes(id)) mergedIds.push(id);
    const chapterEntry = {
      number: CH_NUMBER, title: CH_TITLE, slug: CH_SLUG, description: CH_DESC,
      is_published: false, page_ids: mergedIds,
    };
    if (idx >= 0) chapters[idx] = { ...chapters[idx], ...chapterEntry };
    else chapters.push(chapterEntry);
    chapters.sort((a, b) => a.number - b.number);
    await books.updateOne({ _id: book._id }, { $set: { chapters, updated_at: new Date() } });
    console.log(`\nChapter ${CH_NUMBER} wired: ${mergedIds.length} page(s) total in chapter.`);
  } finally {
    await client.close();
  }
}

module.exports = { B, page, buildPages, pnum, pmcq, psec, BOOK_SLUG, CH_NUMBER };
