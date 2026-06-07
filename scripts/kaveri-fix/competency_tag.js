'use strict';
/**
 * Fix #7 — tag every Kaveri page with the NCF-SE 2023 competency it builds.
 * Sets page.competency = {code,label} + adds a `competency:<code>` tag. Makes the
 * "NCERT-competency-aligned" claim verifiable + queryable for progress analytics.
 *   node scripts/kaveri-fix/competency_tag.js [--dry]
 */
const { withBook, savePageBlocks } = require('./_lib');
const DRY = process.argv.includes('--dry');

const COMP = {
  C1: 'Read & Comprehend',
  C2: 'Interpret & Infer',
  C3: 'Speak & Write for Real Purposes',
  C4: 'Appreciate Literary Craft',
  C5: 'Vocabulary & Grammar in Use',
  C6: 'Appreciate Writers & Diversity',
  C7: 'Consolidate & Apply',
};
// Kaveri section -> competency code
const SECTION_TO_CODE = {
  reflect_and_respond: 'C1', reflect_and_respond_poem: 'C1',
  reading_for_meaning_part_1: 'C1', reading_for_meaning_part_2: 'C1', reading_for_meaning_part_3: 'C1',
  reading_for_appreciation: 'C1',
  characters: 'C2', themes: 'C2', poem_themes: 'C2', working_with_text: 'C2',
  poem_devices: 'C4', poem_craft: 'C4',
  vocabulary_structures: 'C5', vocabulary_in_context_poem: 'C5',
  listening_speaking: 'C3', writing: 'C3', speaking_writing_poem: 'C3',
  about_the_author: 'C6', about_the_poet: 'C6', companion_text: 'C6',
  practice: 'C7',
};

(async () => {
  await withBook(async ({ pages, allPages }) => {
    let tagged = 0; const unmapped = new Set(); const dist = {};
    for (const p of allPages) {
      const sec = (p.tags || []).find((t) => t.startsWith('kaveri_section:'))?.replace('kaveri_section:', '');
      const code = SECTION_TO_CODE[sec];
      if (!code) { if (sec) unmapped.add(sec); continue; }
      dist[code] = (dist[code] || 0) + 1;
      const competency = { code, label: COMP[code] };
      const tags = (p.tags || []).filter((t) => !t.startsWith('competency:'));
      tags.push(`competency:${code}`);
      tagged++;
      if (!DRY) await pages.updateOne({ _id: p._id }, { $set: { competency, tags, updated_at: new Date() } });
    }
    console.log(`${DRY ? '[DRY] ' : ''}tagged ${tagged} pages`);
    console.log('distribution:', JSON.stringify(dist));
    if (unmapped.size) console.log('⚠ unmapped sections:', [...unmapped]);
  });
})().catch((e) => { console.error(e); process.exit(1); });
