'use strict';
/**
 * Augmentation toolkit for the "finish Science" pass — brings the older
 * built-but-unpublished chapters (7,8,9,10,13) up to the Ch11/12 gold bar by
 * ADDING the experience layer to each existing page, never overwriting prose.
 *
 * Per page it injects, around the existing blocks:
 *   • a curiosity_prompt hook  → new block 0
 *   • a hero image (16:5)      → new block 1
 *   • (optional) a labelled diagram image, placed before the reasoning prompt
 *   • a reasoning_prompt        → inserted right before the quiz (after concept)
 *   • a 3-question inline_quiz  → REPLACES an existing 2-Q quiz's questions
 *                                 (keeps the block id) or is appended if none
 *
 * Existing text/heading/callout/table/worked_example blocks are preserved
 * verbatim and re-ordered around the injections. Net block count only grows.
 * Raw updateOne (same pattern as scripts/science-ch12) — additive, so the
 * content-loss guard is not tripped.
 *
 *   applyAug([{ slug, subtitle?, hook, hero, diagram?, reasoning, quiz:[q,q,q] }], CH)
 *   pass --dry to preview block order without writing.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-science';
const uid = () => crypto.randomUUID();

// ── block factories (match packages/data/books/schemas.ts) ────────────────────
const img = (alt, generation_prompt, aspect_ratio = '16:5') =>
  ({ type: 'image', src: '', alt, caption: '', width: 'full', aspect_ratio, generation_prompt });
const txt = (markdown) => ({ type: 'text', markdown });
const h = (text, objective) => ({ type: 'heading', level: 2, text, ...(objective ? { objective } : {}) });
const cur = (prompt, hint, reveal) => ({ type: 'curiosity_prompt', prompt, hint, reveal });
const callout = (variant, title, markdown) => ({ type: 'callout', variant, title, markdown });
const reason = (reasoning_type, prompt, options, correct_index, reveal, difficulty_level) =>
  ({ type: 'reasoning_prompt', reasoning_type, prompt, options, correct_index, reveal, difficulty_level });
const q = (question, options, correct_index, explanation, difficulty_level) =>
  ({ id: uid(), question, options, correct_index, explanation, difficulty_level });

async function applyAug(updates, CH) {
  const DRY = process.argv.includes('--dry');
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book not found');
    const col = db.collection('book_pages');
    for (const u of updates) {
      const page = await col.findOne({ book_id: String(book._id), chapter_number: CH, slug: u.slug });
      if (!page) { console.log(`❌ not found: ${u.slug}`); continue; }
      const E = (page.blocks || []).map((b) => ({ ...b }));
      const qi = E.findIndex((b) => b.type === 'inline_quiz');
      const head = [u.hook, u.hero];
      const mid = u.diagram ? [u.diagram] : [];
      const reasoningBlk = u.reasoning || u.reason;
      let out;
      if (qi >= 0) {
        const quizBlk = { ...E[qi], questions: u.quiz, pass_threshold: 0.67 };
        out = [...head, ...E.slice(0, qi), ...mid, reasoningBlk, quizBlk, ...E.slice(qi + 1)];
      } else {
        const quizBlk = { type: 'inline_quiz', pass_threshold: 0.67, questions: u.quiz };
        out = [...head, ...E, ...mid, reasoningBlk, quizBlk];
      }
      // assign ids + order; injected blocks get fresh ids, existing keep theirs
      const seq = out.map((b, i) => ({ id: b.id || uid(), ...b, order: i }));
      const before = E.length, after = seq.length;
      console.log(`\np${page.page_number} ${u.slug} — ${before}→${after} blocks: ${seq.map((b) => b.type).join(' → ')}`);
      if (DRY) continue;
      const set = { blocks: seq, updated_at: new Date() };
      if (u.subtitle) set.subtitle = u.subtitle;
      await col.updateOne({ _id: page._id }, { $set: set });
      console.log(`  ✅ written (published stays ${page.published})`);
    }
    if (DRY) console.log('\n[dry run] no writes performed.');
  } finally { await client.close(); }
}

module.exports = { img, txt, h, cur, callout, reason, q, applyAug, uid };
