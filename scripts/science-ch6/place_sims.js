'use strict';
/**
 * Place audited physics sims onto their Ch6 pages, just before the closing quiz.
 * Idempotent: skips any page that already has the target sim.
 *
 *   node scripts/science-ch6/place_sims.js [--dry]
 */
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const DRY = process.argv.includes('--dry');

const PLACEMENTS = [
  { slug: 'friction', sim: 'friction-explorer', title: 'Friction Explorer' },
  { slug: 'newtons-first-law', sim: 'inertia-sandbox', title: 'Inertia Sandbox' },
];

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI); await c.connect();
  const db = c.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class9-science' });
  const bid = String(book._id);
  for (const { slug, sim, title } of PLACEMENTS) {
    const page = await db.collection('book_pages').findOne({ book_id: bid, slug });
    if (!page) { console.log(`  skip — page ${slug} not found`); continue; }
    if ((page.blocks||[]).some(b => b.type==='simulation' && b.simulation_id===sim)) {
      console.log(`  skip — ${slug} already has ${sim}`); continue;
    }
    const blocks = page.blocks.map(b => ({ ...b }));
    const quizIdx = blocks.findIndex(b => b.type === 'inline_quiz');
    const at = quizIdx === -1 ? blocks.length : quizIdx;
    const simBlock = { id: crypto.randomUUID(), type: 'simulation', order: 0, simulation_id: sim, title };
    blocks.splice(at, 0, simBlock);
    blocks.forEach((b, i) => { b.order = i; });
    const content_types = [...new Set([...(page.content_types||[]), 'simulation'])];
    console.log(`  ${DRY?'[DRY] ':''}placed ${sim} on ${slug} at index ${at} (was ${page.blocks.length} blocks → ${blocks.length})`);
    if (!DRY) {
      await db.collection('book_pages').updateOne({ _id: page._id }, { $set: { blocks, content_types, updated_at: new Date() } });
    }
  }
  await c.close();
})().catch(e=>{console.error('❌',e);process.exit(1)});
