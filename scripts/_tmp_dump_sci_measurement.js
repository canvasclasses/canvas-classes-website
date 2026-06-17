// READ-ONLY: dumps the heading/structure of the scientific-measurement page.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const doc = await mongoose.connection.db
    .collection('book_pages')
    .findOne({ slug: 'scientific-measurement' });
  if (!doc) { console.log('NOT FOUND'); return process.exit(0); }
  console.log('TITLE:', doc.title, '| chapter', doc.chapter_number, '| page', doc.page_number, '| blocks:', (doc.blocks || []).length);
  console.log('---');
  for (const b of (doc.blocks || [])) {
    let label = b.type;
    if (b.type === 'heading') label = `HEADING(${b.level || ''}): ${b.text || b.markdown || ''}`;
    else if (b.type === 'callout') label = `callout[${b.variant}]: ${b.title || ''}`;
    else if (b.type === 'text') label = `text: ${(b.markdown || '').slice(0, 60).replace(/\n/g, ' ')}…`;
    else if (b.type === 'simulation') label = `simulation: ${b.sim_id || b.simulation_id || ''}`;
    else if (b.type === 'quiz' || b.type === 'inline_quiz') label = `quiz`;
    console.log(`${String(b.order).padStart(2)}  ${label}`);
  }
  await mongoose.disconnect();
  process.exit(0);
})();
