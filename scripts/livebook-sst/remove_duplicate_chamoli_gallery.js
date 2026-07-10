'use strict';
// Founder correction (2026-07-08): the 3-image Chamoli overview gallery was
// mistakenly placed on glacial-landforms-and-moraines earlier this session;
// founder confirmed (via AskUserQuestion) it should be removed from there now
// that it's correctly placed on landforms-and-disasters (the actual "Chamoli
// Disaster page"). R2 assets are not deleted — just unlinked from this block.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'glacial-landforms-and-moraines' });
    const idx = page.blocks.findIndex((b) => b.type === 'gallery' && (b.items || []).some((it) => (it.src || '').includes('chamoli-overview')));
    if (idx === -1) throw new Error('Chamoli overview gallery block not found on this page');
    const updated = page.blocks.filter((_, i) => i !== idx);
    const res = await bw.savePage(db, { slug: 'glacial-landforms-and-moraines' }, updated, {
      author: 'agent',
      summary: 'Removed the Chamoli overview gallery — founder confirmed (AskUserQuestion) it should live only on landforms-and-disasters (the actual Chamoli Disaster page), not duplicated here',
      allowContentLoss: true,
      lossReason: 'Founder explicitly confirmed removal via AskUserQuestion after being asked directly: "Remove from glacial-landforms-and-moraines." The gallery itself is not lost — it now lives correctly on landforms-and-disasters; R2 assets are not deleted.',
    });
    console.log(`✓ glacial-landforms-and-moraines — duplicate gallery removed (v${res.version}), page now ${updated.length} blocks`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
