'use strict';
/**
 * Round-2 placements after the physics-sim audit.
 * Idempotent.
 *   node scripts/science-ch6/place_round2.js [--dry]
 */
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const DRY = process.argv.includes('--dry');

const PLACEMENTS = [
  { slug: 'newtons-second-law', sim: 'newtons-second-law', title: "F = ma Lab" },
  { slug: 'newtons-third-law',  sim: 'newtons-third-law',  title: "Action–Reaction Pairs" },
  { slug: 'weight-and-gravity', sim: 'weight-on-planets',  title: "Weight on Different Worlds" },
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
    console.log(`  ${DRY?'[DRY] ':''}placed ${sim} on ${slug} at index ${at} (was ${page.blocks.length} → ${blocks.length} blocks)`);
    if (!DRY) await db.collection('book_pages').updateOne({ _id: page._id }, { $set: { blocks, content_types, updated_at: new Date() } });
  }
  await c.close();
})().catch(e=>{console.error('❌',e);process.exit(1)});
