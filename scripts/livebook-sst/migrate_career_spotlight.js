'use strict';
// Migrate the 2 existing career_spotlight callouts (dense-paragraph shape) to
// the new dedicated `career_spotlight` block type (structured role list) —
// founder feedback, 2026-07-08: a wall of text buries the actual list of
// professions. Reuses each block's existing id (same conceptual block,
// restructured) so the content-loss guard doesn't flag it as a removal.
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

async function replaceBlockKeepingId(db, slug, blockId, newBlock, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  if (!page) throw new Error(`page not found: ${slug}`);
  const idx = page.blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) throw new Error(`block ${blockId} not found on ${slug}`);
  const updated = page.blocks.map((b, i) => (i === idx ? { ...newBlock, id: blockId, order: b.order } : b));
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary });
  console.log(`✓ ${slug} — migrated block ${blockId.slice(0, 8)} to career_spotlight (v${res.version})`);
}

async function main() {
  await bw.withDb(async (db) => {
    await replaceBlockKeepingId(db, 'why-social-science-matters', 'f1cfb958-451a-4ea5-bed0-29b6c53a5b4e', {
      type: 'career_spotlight',
      title: 'Four Disciplines, Real Jobs',
      intro: 'Every discipline in this chapter has a real, present-day career built on it.',
      careers: [
        { id: uuid(), role: 'Geographers & GIS analysts', description: "Use tools like ISRO's Bhuvan to plan cities, track floods and manage disasters." },
        { id: uuid(), role: 'Historians & archivists', description: 'Work in institutions like the National Archives of India and state archaeology departments, piecing together exactly the kind of evidence this chapter described.' },
        { id: uuid(), role: 'Civil servants', description: 'Run the governance systems this chapter traced back to the Panchayati Raj — many enter through exams like the UPSC.' },
        { id: uuid(), role: 'Economists', description: "At the Reserve Bank of India, NITI Aayog, and private companies, make the resource-allocation decisions this chapter's family-budget example was really about." },
      ],
      closing: "None of these are historical curiosities — they're active job titles in India today.",
    }, 'Migrated career_spotlight from a dense-paragraph callout to the new structured block type');

    await replaceBlockKeepingId(db, 'shaping-the-earths-surface-toolkit', '08631878-89ad-4e28-901c-51b87a41d0b3', {
      type: 'career_spotlight',
      title: 'Who Studies These Forces For a Living',
      intro: "Every force in this chapter is someone's actual job.",
      careers: [
        { id: uuid(), role: 'Seismologists', description: 'At the National Center for Seismology and the Geological Survey of India, monitor plate movement and earthquake risk.' },
        { id: uuid(), role: 'Disaster management officers', description: "Coordinated through the National Disaster Management Authority (NDMA), plan the exact kind of evacuation and rescue operations this chapter's Chamoli and Cyclone Fani examples describe." },
        { id: uuid(), role: 'Hydrologists & geomorphologists', description: 'Study how rivers, glaciers and groundwater reshape land, often working with satellite data from ISRO.' },
        { id: uuid(), role: 'Civil & geotechnical engineers', description: 'Use everything in this chapter — rock types, weathering, slope stability — before a single road or building goes up in the hills.' },
      ],
    }, 'Migrated career_spotlight from a dense-paragraph callout to the new structured block type');
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
