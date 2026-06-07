'use strict';
/** Extract every narrated_passage gloss lacking an example (Ch2-8), with a stable locator. */
const fs = require('fs');
const { withBook } = require('./_lib');

(async () => {
  await withBook(async ({ allPages }) => {
    const byCh = {};
    for (const p of allPages) {
      if (p.chapter_number < 2) continue; // Ch1 already has examples
      (p.blocks || []).forEach((b) => {
        if (b.type !== 'narrated_passage') return;
        (b.paragraphs || []).forEach((para, pi) => {
          (para.sentences || []).forEach((s, si) => {
            (s.glosses || []).forEach((g, gi) => {
              if (g.example && String(g.example).trim()) return;
              const row = {
                loc: { page_slug: p.slug, block_id: b.id, pi, si, gi },
                chapter: p.chapter_number,
                word: g.word,
                meaning: g.meaning,
                hindi: g.hindi || '',
                sentence: s.text, // the source sentence the word appears in (context only)
              };
              (byCh[p.chapter_number] ||= []).push(row);
            });
          });
        });
      });
    }
    let total = 0;
    for (const ch of Object.keys(byCh)) {
      const file = `scripts/kaveri-fix/_ch${ch}_gloss.json`;
      fs.writeFileSync(file, JSON.stringify(byCh[ch], null, 1));
      total += byCh[ch].length;
      console.log(`Ch${ch}: ${byCh[ch].length} glosses need examples -> ${file}`);
    }
    console.log('TOTAL:', total);
  });
})().catch((e) => { console.error(e); process.exit(1); });
