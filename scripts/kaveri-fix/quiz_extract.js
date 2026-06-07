'use strict';
/** Extract every inline_quiz question per chapter for the distractor rewrite. */
const fs = require('fs');
const { withBook, sectionTag, pieceTag } = require('./_lib');

(async () => {
  await withBook(async ({ allPages }) => {
    const byCh = {};
    for (const p of allPages) {
      for (const b of p.blocks || []) {
        if (b.type !== 'inline_quiz') continue;
        (b.questions || []).forEach((q, i) => {
          const row = {
            page_slug: p.slug,
            chapter: p.chapter_number,
            page_number: p.page_number,
            page_title: p.title,
            section: sectionTag(p).replace('kaveri_section:', ''),
            piece: pieceTag(p).replace('kaveri_piece:', ''),
            block_id: b.id,
            question_id: q.id,
            position: i + 1, // 1=recall, 2=comprehension, 3=interpretation (intended)
            question: q.question,
            options: q.options,
            correct_index: q.correct_index,
            correct_text: q.options[q.correct_index],
            explanation: q.explanation || '',
          };
          (byCh[p.chapter_number] ||= []).push(row);
        });
      }
    }
    for (const ch of Object.keys(byCh)) {
      const file = `scripts/kaveri-fix/_ch${ch}_quiz.json`;
      fs.writeFileSync(file, JSON.stringify(byCh[ch], null, 1));
      console.log(`Ch${ch}: ${byCh[ch].length} questions -> ${file}`);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
