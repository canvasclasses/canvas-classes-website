'use strict';
/**
 * Shared toolkit for building Class 9 Science Ch.12
 * "Patterns in Life: Diversity and Classification" pages.
 * Block factories match packages/data/books/schemas.ts exactly. Pages are
 * updated IN PLACE by slug (the 14 stub pages already exist + are published:false).
 * Copied from scripts/science-ch11/_lib.js with CH = 12.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-science';
const CH = 12;
const uid = () => crypto.randomUUID();
const seq = (blocks) => blocks.map((b, i) => ({ id: uid(), order: i, ...b }));

// ── block factories ───────────────────────────────────────────────────────────
const img = (alt, generation_prompt, aspect_ratio = '16:5') =>
  ({ type: 'image', src: '', alt, caption: '', width: 'full', aspect_ratio, generation_prompt });
const txt = (markdown) => ({ type: 'text', markdown });
const h = (text, objective) => ({ type: 'heading', level: 2, text, ...(objective ? { objective } : {}) });
const h3 = (text) => ({ type: 'heading', level: 3, text });
const cur = (prompt, hint, reveal) => ({ type: 'curiosity_prompt', prompt, hint, reveal });
const callout = (variant, title, markdown) => ({ type: 'callout', variant, title, markdown });
const cmp = (title, columns) => ({ type: 'comparison_card', title, columns });
const table = (caption, headers, rows) => ({ type: 'table', caption, headers, rows });
const timeline = (title, orientation, events) => ({ type: 'timeline', title, orientation, events });
const reason = (reasoning_type, prompt, options, correct_index, reveal, difficulty_level) =>
  ({ type: 'reasoning_prompt', reasoning_type, prompt, options, correct_index, reveal, difficulty_level });
const worked = (label, problem, solution, variant = 'solved_example') =>
  ({ type: 'worked_example', label, variant, problem, solution, reveal_mode: 'tap_to_reveal' });
const q = (question, options, correct_index, explanation, difficulty_level) =>
  ({ id: uid(), question, options, correct_index, explanation, difficulty_level });
const quiz = (questions) => ({ type: 'inline_quiz', pass_threshold: 0.67, questions });

/**
 * applyPages([{ slug, subtitle, blocks, title? }]) — updates each page in place.
 * Pass --dry on argv to print the plan without writing. published is untouched.
 */
async function applyPages(updates) {
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
      if (!page) { console.log(`❌ stub not found: ${u.slug}`); continue; }
      const blocks = seq(u.blocks);
      console.log(`\np${page.page_number} ${u.slug} — ${blocks.length} blocks: ${blocks.map(b => b.type).join(' → ')}`);
      if (DRY) continue;
      const set = { blocks, subtitle: u.subtitle, updated_at: new Date() };
      if (u.title) set.title = u.title;
      await col.updateOne({ _id: page._id }, { $set: set });
      console.log(`  ✅ written (published stays ${page.published})`);
    }
    if (DRY) console.log('\n[dry run] no writes performed.');
  } finally { await client.close(); }
}

module.exports = { img, txt, h, h3, cur, callout, cmp, table, timeline, reason, worked, q, quiz, applyPages, uid, seq };
