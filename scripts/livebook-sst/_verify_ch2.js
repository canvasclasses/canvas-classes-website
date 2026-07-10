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
    const pages = await db.collection('book_pages').find({ book_id: BOOK_ID, chapter_number: 2 }).sort({ page_number: 1 }).toArray();

    let issues = 0;
    const positions = { 0: 0, 1: 0, 2: 0, 3: 0 };
    let total = 0;
    for (const p of pages) {
      const orders = p.blocks.map((b) => b.order);
      const orderOk = orders.every((o, i) => o === i);
      const b0 = p.blocks[0];
      const b1 = p.blocks[1];
      const last = p.blocks[p.blocks.length - 1];
      const hasReasoning = p.blocks.some((b) => b.type === 'reasoning_prompt');
      const hasCallout = p.blocks.some((b) => b.type === 'callout' && ['threads_of_curiosity','india_science','bridging_science','quest_continues','what_if'].includes(b.variant));
      const quizOk = last.type === 'inline_quiz' && last.questions.length === 3;
      const imagesOk = p.blocks.filter((b) => b.type === 'image').every((b) => b.src === '' ? !!b.generation_prompt : true);
      const heroOk = b0.type === 'image' && b0.aspect_ratio === '16:5' && b0.caption === '';
      const curiosityOk = b1.type === 'curiosity_prompt' && !b1.options;
      const ok = orderOk && hasReasoning && hasCallout && quizOk && imagesOk && heroOk && curiosityOk;
      if (!ok) { issues++; console.log(`❌ ${p.slug}: orderOk=${orderOk} heroOk=${heroOk} curiosityOk=${curiosityOk} hasReasoning=${hasReasoning} hasCallout=${hasCallout} quizOk=${quizOk} imagesOk=${imagesOk}`); }
      else console.log(`✓ ${p.slug}: ${p.blocks.length} blocks`);

      if (quizOk) {
        for (const q of last.questions) {
          positions[q.correct_index]++;
          total++;
          const lens = q.options.map((o) => o.length);
          const keyLen = lens[q.correct_index];
          const maxOther = Math.max(...lens.filter((_, i) => i !== q.correct_index));
          const isLongest = keyLen === Math.max(...lens);
          const ratio = keyLen / maxOther;
          if (isLongest && ratio > 1.3) console.log(`  ⚠ length-tell: "${q.question.slice(0,50)}..." ratio=${ratio.toFixed(2)}`);
          if (!q.difficulty_level) console.log(`  ⚠ missing difficulty_level`);
        }
      }
    }
    console.log(`\n${pages.length} pages, ${issues} structural issues.`);
    console.log('Position distribution:', positions, `total=${total}`, Object.fromEntries(Object.entries(positions).map(([k,v]) => [k, Math.round(v/total*100)+'%'])));
  } finally { await client.close(); }
}
main().catch((e) => { console.error(e); process.exit(1); });
