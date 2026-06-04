// Wire interactive simulations into Class 9 ICT pages.
// Idempotent: inserts a `simulation` block just BEFORE the page's inline_quiz
// (so quiz stays last) only if that simulation_id isn't already on the page.
// Re-run after registering each new sim. Grow WIRINGS as sims are built.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-ict';

// page slug → { simulation_id, title }
const WIRINGS = [
  { page: 'meet-scratch',              simulation_id: 'code-the-bot',        title: 'Code the Bot — Computational Thinking Lab' },
  { page: 'logic-and-sequence',        simulation_id: 'logic-gate-lab',      title: 'Logic Gate Lab + Binary Builder' },
  { page: 'scratch-scripting-a-story', simulation_id: 'debug-it',            title: 'Debug It! — Fix the Broken Sequence' },
  { page: 'spotting-email-fraud',      simulation_id: 'phishing-detective',  title: 'Phishing Detective' },
  { page: 'setting-up-email',          simulation_id: 'password-forge',      title: 'Password Strength Forge' },
  { page: 'gimp-getting-started',      simulation_id: 'pixel-layers-studio', title: 'Pixel & Layers Studio' },
  { page: 'web-browsers-and-websites', simulation_id: 'how-the-web-works',   title: 'How the Web Works' },
  { page: 'search-operators-and-bookmarks', simulation_id: 'search-query-builder', title: 'Search Query Builder' },
  { page: 'audacity-recording',        simulation_id: 'sound-wave-studio',   title: 'Sound Wave Studio' },
];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found.`);

    let added = 0, skipped = 0, missing = 0;
    for (const w of WIRINGS) {
      const page = await pages.findOne({ book_id: String(book._id), slug: w.page });
      if (!page) { console.log(`  ⚠ page "${w.page}" not found — skipping.`); missing++; continue; }
      const blocks = page.blocks || [];
      if (blocks.some(b => b.type === 'simulation' && b.simulation_id === w.simulation_id)) {
        console.log(`  ⤷ "${w.page}" already has ${w.simulation_id} — skipping.`); skipped++; continue;
      }
      // Insert before the last inline_quiz (or at end if none).
      const quizIdx = blocks.findIndex(b => b.type === 'inline_quiz');
      const simBlock = { id: uuidv4(), type: 'simulation', order: 0, simulation_id: w.simulation_id, title: w.title };
      const insertAt = quizIdx >= 0 ? quizIdx : blocks.length;
      const next = [...blocks.slice(0, insertAt), simBlock, ...blocks.slice(insertAt)];
      next.forEach((b, i) => { b.order = i; });
      await pages.updateOne({ _id: page._id }, { $set: { blocks: next, updated_at: new Date() } });
      console.log(`  ✓ "${w.page}" ← ${w.simulation_id} (now ${next.length} blocks)`);
      added++;
    }
    console.log(`\n✅ Wiring complete: ${added} added, ${skipped} already present, ${missing} pages missing.`);
  } finally { await client.close(); }
}
main().catch(err => { console.error('❌', err.message); process.exit(1); });
