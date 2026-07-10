'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    for (const chapter of [1, 2]) {
      const pages = await db.collection('book_pages').find({ book_id: BOOK_ID, chapter_number: chapter }).sort({ page_number: 1 }).toArray();
      console.log(`\n=== Chapter ${chapter} ===`);
      for (const p of pages) {
        const orders = p.blocks.map((b) => b.order);
        const orderOk = orders.every((o, i) => o === i);
        const last = p.blocks[p.blocks.length - 1];
        const quizOk = last.type === 'inline_quiz' && last.questions.length === 3;
        const guidedReveals = p.blocks.filter((b) => b.type === 'guided_reveal');
        const timelines = p.blocks.filter((b) => b.type === 'timeline');
        const images = p.blocks.filter((b) => b.type === 'image');
        // Validate guided_reveal / timeline internal shape.
        const grIssues = guidedReveals.flatMap((gr) => {
          const issues = [];
          if (!gr.title) issues.push('missing title');
          if (!Array.isArray(gr.steps) || gr.steps.length < 2 || gr.steps.length > 20) issues.push(`bad steps length ${gr.steps?.length}`);
          gr.steps?.forEach((s, i) => { if (!s.headline) issues.push(`step ${i} missing headline`); if (s.kind !== 'point' && s.kind !== 'cost_checker') issues.push(`step ${i} bad kind`); });
          return issues;
        });
        const tlIssues = timelines.flatMap((tl) => {
          const issues = [];
          if (!['horizontal', 'vertical'].includes(tl.orientation)) issues.push('bad orientation');
          if (!Array.isArray(tl.events) || tl.events.length === 0) issues.push('no events');
          tl.events?.forEach((e, i) => { if (!e.label) issues.push(`event ${i} missing label`); });
          return issues;
        });
        const blockCountOk = p.blocks.length <= 18;
        const ok = orderOk && quizOk && blockCountOk && grIssues.length === 0 && tlIssues.length === 0;
        console.log(`${ok ? '✓' : '❌'} ${p.slug}: ${p.blocks.length}blk orderOk=${orderOk} quizOk=${quizOk} images=${images.length} guidedReveals=${guidedReveals.length} timelines=${timelines.length}${grIssues.length ? ' grIssues=' + JSON.stringify(grIssues) : ''}${tlIssues.length ? ' tlIssues=' + JSON.stringify(tlIssues) : ''}`);
      }
    }
  } finally { await client.close(); }
}
main().catch((e) => { console.error(e); process.exit(1); });
