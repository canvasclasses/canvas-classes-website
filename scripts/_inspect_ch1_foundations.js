'use strict';
// READ-ONLY: dump headings + callouts of the early Ch.1 pages. Run: node scripts/_inspect_ch1_foundations.js
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const SLUGS = [
  'chapter-1-overview',
  'how-chemistry-began',
  'importance-of-chemistry',
  'introduction-chemistry-matter',
];

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  for (const slug of SLUGS) {
    const p = await db.collection('book_pages').findOne({ slug });
    if (!p) { console.log(`\n### ${slug} — NOT FOUND`); continue; }
    console.log(`\n### ${slug}  | "${p.title}" | sub="${p.subtitle || ''}" | ${p.blocks?.length} blocks`);
    for (const b of (p.blocks || []).slice().sort((a, c) => a.order - c.order)) {
      if (b.type === 'heading') console.log(`   (h${b.level}) ${b.text}`);
      else if (b.type === 'callout') console.log(`   [${b.variant}] ${b.title || ''}`);
      else if (b.type === 'simulation') console.log(`   <sim> ${b.simulation_id || ''}`);
      else if (b.type === 'reasoning_prompt') console.log(`   <reasoning_prompt>`);
      else if (b.type === 'worked_example') console.log(`   <worked_example> ${b.label || ''}`);
    }
  }
  await client.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
