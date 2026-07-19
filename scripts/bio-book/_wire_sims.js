'use strict';
// Additively embed the 4 book-embeddable biology 3D sims into their best-fit
// Class 11 chapters. Each insertion adds a short lead-in `text` block + a
// `simulation` block (referencing an id already registered in EXTRA_SIMULATORS)
// right after the page's 2D diagram (or before the closing quiz for the capstone).
// Purely additive → the content-loss guard passes. Writes through book-writer.savePage.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { v4: uuid } = require('uuid');
const { MongoClient } = require('mongodb');
const bw = require('../lib/book-writer');

const BOOK_SLUG = 'class11-biology';

const PLACEMENTS = [
  {
    slug: 'circulatory-pathways-and-the-heart', sim: 'heart-3d',
    at: 'after_interactive_image',
    title: 'The Human Heart — 3D',
    lead: "🫀 **Now open the real heart in 3D.** Rotate it, look inside all four chambers, and trace a drop of blood past the valves you just labelled — right ventricle → pulmonary artery, left ventricle → aorta.",
  },
  {
    slug: 'types-of-movement-and-muscle-types', sim: 'muscular-system',
    at: 'after_interactive_image',
    title: 'The Muscular System — 3D',
    lead: "💪 **See the body's muscles in 3D.** Rotate the model and peel through the muscle layers — the skeletal muscles here are the striated, voluntary type you just met.",
  },
  {
    slug: 'the-skeletal-system', sim: 'skeleton-3d',
    at: 'after_interactive_image',
    title: 'The Skeletal System — 3D',
    lead: "🦴 **Explore all 206 bones in 3D.** Spin the skeleton and pick out the axial bones (skull, vertebral column, ribs, sternum) and the appendicular bones (limbs and girdles) you just learned.",
  },
  {
    slug: 'joints-and-skeletal-disorders', sim: 'anatomy-explorer',
    at: 'before_inline_quiz',
    title: 'Anatomy Explorer — Full Body 3D',
    lead: "🧭 **Capstone — explore the whole body.** Now that you know muscles, bones and joints, peel the layers of the entire human body in one model: skeleton, muscles, organs, nerves and vessels.",
  },
];

function makeBlocks(sim, lead, title) {
  return [
    { id: uuid(), type: 'text', markdown: lead },
    { id: uuid(), type: 'simulation', simulation_id: sim, title },
  ];
}

function insertAt(blocks, newPair, mode) {
  const out = blocks.slice();
  let idx;
  if (mode === 'after_interactive_image') {
    const i = out.findIndex((b) => b.type === 'interactive_image');
    idx = i >= 0 ? i + 1 : out.length - 1; // fallback: before last block
  } else if (mode === 'before_inline_quiz') {
    const i = out.findIndex((b) => b.type === 'inline_quiz');
    idx = i >= 0 ? i : out.length;
  } else {
    idx = out.length;
  }
  out.splice(idx, 0, ...newPair);
  return out.map((b, i) => ({ ...b, order: i })); // renumber orders 0..N
}

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const books = db.collection('books');
  const pages = db.collection('book_pages');
  const book = await books.findOne({ slug: BOOK_SLUG });
  const bookId = String(book._id);

  for (const p of PLACEMENTS) {
    const page = await pages.findOne({ book_id: bookId, slug: p.slug });
    if (!page) { console.log(`  SKIP  ${p.slug} — page not found`); continue; }
    // Idempotency: skip if this sim is already embedded on the page.
    if ((page.blocks || []).some((b) => b.type === 'simulation' && b.simulation_id === p.sim)) {
      console.log(`  skip  ${p.slug} — ${p.sim} already embedded`);
      continue;
    }
    const newPair = makeBlocks(p.sim, p.lead, p.title);
    const newBlocks = insertAt(page.blocks, newPair, p.at);
    await bw.savePage(db, { pageId: page._id }, newBlocks, {
      author: 'agent',
      summary: `embed ${p.sim} 3D simulation into ${p.slug}`,
    });
    console.log(`  wired ${p.sim} → ${p.slug} (${page.blocks.length} → ${newBlocks.length} blocks)`);
  }
  await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
