'use strict';
/**
 * Update the stored generation_prompt on Ch7's 24 image blocks to the approved
 * new hand-drawn-dark style (from _ch7_newstyle.json), so the DB record matches
 * the images we actually generated. Metadata-only (no content removed). --dry to preview.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const NEW = require('./_ch7_newstyle.json');
const BOOK = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
const CH = 7;
const DRY = process.argv.includes('--dry');
const byBlock = new Map(NEW.map((e) => [e.blockId, e.prompt]));

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  try {
    const col = c.db('crucible').collection('book_pages');
    const pages = await col.find({ book_id: BOOK, chapter_number: CH }).toArray();
    let updated = 0, blocks = 0;
    for (const p of pages) {
      let changed = false;
      const out = (p.blocks || []).map((b) => {
        if (b.type === 'image' && byBlock.has(b.id)) {
          changed = true; blocks++;
          return { ...b, generation_prompt: byBlock.get(b.id) };
        }
        return b;
      });
      if (!changed) continue;
      console.log(`p${p.page_number} ${p.slug} — prompts updated`);
      if (!DRY) await col.updateOne({ _id: p._id }, { $set: { blocks: out, updated_at: new Date() } });
      updated++;
    }
    console.log(`\n${DRY ? '[dry] ' : ''}${blocks} image-block prompts on ${updated} pages.`);
  } finally { await c.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
