'use strict';
/** Build a compact per-chapter content digest to ground practice authoring. */
const fs = require('fs');
const { withBook, sectionTag, pieceTag } = require('./_lib');

const txt = (b) => (b.text || b.markdown || b.content || '').toString();

(async () => {
  await withBook(async ({ allPages }) => {
    for (let ch = 2; ch <= 8; ch++) {
      const pages = allPages.filter((p) => p.chapter_number === ch).sort((a, b) => a.page_number - b.page_number);
      const dig = { chapter: ch, story_sentences: [], poem_lines: [], vocab: [], themes: [], worked: [], grammar_focus: [], author: [], devices: [], sections: [] };
      for (const p of pages) {
        const sec = sectionTag(p).replace('kaveri_section:', '');
        const piece = pieceTag(p).replace('kaveri_piece:', '');
        dig.sections.push(`${sec} (${piece}) — ${p.title}`);
        for (const b of p.blocks || []) {
          if (b.type === 'narrated_passage') {
            for (const para of b.paragraphs || [])
              for (const s of para.sentences || []) (piece === 'poetry' ? dig.poem_lines : dig.story_sentences).push(s.text);
          } else if (b.type === 'vocabulary_lab') {
            for (const c of b.cards || []) dig.vocab.push({ word: c.word, meaning: c.meaning, hindi: c.hindi || '' });
          } else if (b.type === 'theme_explorer') {
            for (const t of b.themes || []) dig.themes.push({ title: t.title, description: t.description });
          } else if (b.type === 'worked_example') {
            dig.worked.push({ q: txt(b.problem || b.question || ''), a: txt(b.solution || b.answer || '').slice(0, 240) });
          } else if (b.type === 'heading' && sec.includes('vocabulary')) {
            dig.grammar_focus.push(txt(b));
          } else if (b.type === 'meet_a_scientist') {
            dig.author.push({ name: b.name, contribution: (b.contribution || '').slice(0, 200), connection: (b.connection || '').slice(0, 200) });
          } else if (b.type === 'literary_devices_highlighter') {
            for (const d of b.devices || []) for (const m of d.matches || []) dig.devices.push({ device: d.device, text: m.text });
          }
        }
      }
      // trim noise
      dig.worked = dig.worked.filter((w) => w.q);
      const file = `scripts/kaveri-fix/_ch${ch}_content.json`;
      fs.writeFileSync(file, JSON.stringify(dig, null, 1));
      console.log(`Ch${ch}: ${dig.story_sentences.length} story sents, ${dig.poem_lines.length} poem lines, ${dig.vocab.length} vocab, ${dig.themes.length} themes, ${dig.worked.length} worked, ${dig.author.length} author -> ${file}`);
    }
  });
})().catch((e) => { console.error(e); process.exit(1); });
