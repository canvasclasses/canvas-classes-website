'use strict';
// Founder request (2026-07-09): remove the "How a Headland Becomes a Sea Stack"
// horizontal timeline on page 7 (coastal-landforms-beaches-cliffs-and-stacks) —
// a video or infographic would work better there. The cliff→cave→arch→stack
// process is still fully described in the page's own text block, so no
// information is lost; only the visual timeline block is removed.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'coastal-landforms-beaches-cliffs-and-stacks' });
    const idx = page.blocks.findIndex((b) => b.type === 'timeline' && b.title === 'How a Headland Becomes a Sea Stack');
    if (idx === -1) throw new Error('sea-stack timeline block not found');
    const updated = page.blocks.filter((_, i) => i !== idx).map((b, i) => ({ ...b, order: i }));
    const res = await bw.savePage(db, { slug: 'coastal-landforms-beaches-cliffs-and-stacks' }, updated, {
      author: 'agent',
      summary: 'Removed the "How a Headland Becomes a Sea Stack" horizontal timeline — founder wants a video/infographic here instead. Process is still covered in the page text.',
      allowContentLoss: true,
      lossReason: 'Founder explicitly asked to remove this section ("remove this section, its better to add a video or infographic here"). The cliff→cave→arch→stack sequence remains fully described in the page\'s text block — no information lost, only the visual timeline.',
    });
    console.log(`✓ coastal-landforms-beaches-cliffs-and-stacks — sea-stack timeline removed (v${res.version}), page now ${updated.length} blocks`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
