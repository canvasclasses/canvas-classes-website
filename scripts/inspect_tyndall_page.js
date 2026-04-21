'use strict';
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const PAGE_ID = 'f1df84ae-37dc-4f80-8ab9-cdcc0a19c444';

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const pages = db.collection('book_pages');

  const page = await pages.findOne({ _id: PAGE_ID });
  if (!page) throw new Error('Page not found');

  console.log(`Title: ${page.title}`);
  console.log(`Blocks: ${page.blocks.length}\n`);

  for (const b of page.blocks.sort((a, b) => a.order - b.order)) {
    console.log(`[${b.order}] type=${b.type}${b.level ? ` level=${b.level}` : ''}${b.variant ? ` variant=${b.variant}` : ''}`);
    if (b.type === 'heading') console.log(`      text: ${b.text}`);
    if (b.type === 'text') console.log(`      markdown: ${b.markdown?.slice(0, 120)}...`);
    if (b.type === 'image') console.log(`      alt: ${b.alt?.slice(0, 80)}`);
    if (b.type === 'callout') console.log(`      title: ${b.title} | ${b.markdown?.slice(0, 80)}`);
    if (b.type === 'simulation') console.log(`      sim_id: ${b.simulation_id}`);
    if (b.type === 'reasoning_prompt') console.log(`      prompt: ${b.prompt?.slice(0, 80)}`);
    if (b.type === 'inline_quiz') console.log(`      questions: ${b.questions?.length}`);
  }

  await client.close();
}

main().catch(err => { console.error(err); process.exit(1); });
