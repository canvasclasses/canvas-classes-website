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
    const book = await db.collection('books').findOne({ _id: BOOK_ID });
    const ch1 = book.chapters.find((c) => c.number === 1);
    console.log(`Chapter 1 page_ids: ${ch1.page_ids.length}`);

    const pages = await db
      .collection('book_pages')
      .find({ book_id: BOOK_ID, chapter_number: 1 })
      .sort({ page_number: 1 })
      .toArray();

    let issues = 0;
    for (const p of pages) {
      const orders = p.blocks.map((b) => b.order);
      const orderOk = orders.every((o, i) => o === i);
      const b0 = p.blocks[0];
      const b1 = p.blocks[1];
      const last = p.blocks[p.blocks.length - 1];
      const hasReasoning = p.blocks.some((b) => b.type === 'reasoning_prompt');
      const hasCallout = p.blocks.some(
        (b) =>
          b.type === 'callout' &&
          ['threads_of_curiosity', 'india_science', 'bridging_science', 'quest_continues', 'what_if'].includes(b.variant)
      );
      const quizOk = last.type === 'inline_quiz' && last.questions.length === 3;
      const imagesOk = p.blocks
        .filter((b) => b.type === 'image')
        .every((b) => b.src === '' ? !!b.generation_prompt : true);
      const heroOk = b0.type === 'image' && b0.aspect_ratio === '16:5' && b0.caption === '';
      const curiosityOk = b1.type === 'curiosity_prompt' && !b1.options;
      const ok = orderOk && hasReasoning && hasCallout && quizOk && imagesOk && heroOk && curiosityOk;
      if (!ok) {
        issues++;
        console.log(`❌ ${p.slug}: orderOk=${orderOk} heroOk=${heroOk} curiosityOk=${curiosityOk} hasReasoning=${hasReasoning} hasCallout=${hasCallout} quizOk=${quizOk} imagesOk=${imagesOk}`);
      } else {
        console.log(`✓ ${p.slug}: ${p.blocks.length} blocks, page_number ${p.page_number}, published=${p.published}`);
      }
    }
    console.log(`\n${pages.length} pages checked, ${issues} with issues.`);
  } finally {
    await client.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
