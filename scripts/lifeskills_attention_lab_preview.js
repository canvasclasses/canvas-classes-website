'use strict';
/**
 * Attention Lab — REVIEW preview page (2026-07-24). Appends ONE unpublished page
 * to the Focus chapter holding the new lab instruments so the founder can play
 * them on their dev server and approve the visual direction before the rest are
 * built + distributed to real pages. Insert-only (additive, safe §0.6). Idempotent.
 * Remove later with: db.book_pages soft-delete + pull from page_ids (or re-run --remove).
 *
 * Run: node scripts/lifeskills_attention_lab_preview.js
 */
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const SLUG = 'attention-lab-preview';

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const books = db.collection('books');
  const pages = db.collection('book_pages');
  const book = await books.findOne({ slug: 'life-skills-class-9' });
  const chapter = book.chapters.find((c) => c.slug === 'focus-and-attention');

  const existing = await pages.findOne({ slug: SLUG });
  if (existing) { console.log('preview page already exists:', existing._id); await client.close(); return; }

  let o = 0;
  const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', order: o++, text, level });
  const text = (markdown) => ({ id: uuidv4(), type: 'text', order: o++, markdown });
  const sim = (simulation_id) => ({ id: uuidv4(), type: 'simulation', order: o++, simulation_id });

  const blocks = [
    heading('🧪 Attention Lab — Preview'),
    text('_These are new interactive instruments for your review — the two flagships that set the visual language for the whole set. **This page is not part of the chapter** and will be removed once the direction is approved and the instruments are placed on their real pages._'),
    heading('1 · The Crossover — mind–body coordination', 3),
    text('The anti-phase finger-tapping challenge you described. Hands up, follow the beat, tap the button the moment your hands snap to the easy pattern.'),
    sim('the-crossover'),
    heading('2 · Stroop — selective attention', 3),
    text('Name the ink colour, not the word. It measures, in milliseconds, your own attention being hijacked.'),
    sim('stroop-spotlight'),
  ];

  const maxPn = await pages.find({ book_id: book._id, chapter_number: 1, deleted_at: null }).sort({ page_number: -1 }).limit(1).toArray();
  const pn = (maxPn[0]?.page_number ?? 9) + 1;

  const now = new Date();
  const doc = {
    _id: uuidv4(), book_id: book._id, chapter_number: chapter.number ?? 1,
    page_number: pn, slug: SLUG, title: 'Attention Lab — Preview',
    subtitle: 'New instruments for review · not part of the chapter',
    blocks, published: false, deleted_at: null, created_at: now, updated_at: now,
  };
  await pages.insertOne(doc);
  await books.updateOne({ _id: book._id, 'chapters.slug': 'focus-and-attention' },
    { $push: { 'chapters.$.page_ids': doc._id } });
  console.log('preview page inserted:', doc._id, '| page_number', pn, '| slug', SLUG);
  await client.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
