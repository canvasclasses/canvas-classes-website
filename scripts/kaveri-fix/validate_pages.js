'use strict';
/** Structural validation of authored page files against the block schemas. */
const fs = require('fs');
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const QUIZ = (q, w, e) => { if (!q.id || !q.question) e.push(`${w}: quiz id/question`); if (!Array.isArray(q.options) || q.options.length < 2) e.push(`${w}: <2 options`); if (typeof q.correct_index !== 'number' || q.correct_index < 0 || q.correct_index >= (q.options || []).length) e.push(`${w}: correct_index`); };

function vBlock(b, i, e) {
  const w = `block ${i} (${b.type})`;
  if (!b.id || typeof b.order !== 'number') e.push(`${w}: id/order`);
  switch (b.type) {
    case 'image': if (typeof b.src !== 'string' || !b.alt) e.push(`${w}: src/alt`); break;
    case 'text': if (!b.markdown) e.push(`${w}: markdown`); break;
    case 'heading': if (!b.text || ![1, 2, 3].includes(b.level)) e.push(`${w}: text/level`); break;
    case 'pronunciation_drill':
      if (!Array.isArray(b.words) || b.words.length < 1 || b.words.length > 12) e.push(`${w}: words 1-12`);
      (b.words || []).forEach((x, k) => { if (!x.id || !x.word) e.push(`${w}.word${k}`); }); break;
    case 'dialogue_role_play':
      if (!['dialogue', 'debate'].includes(b.mode)) e.push(`${w}: mode`);
      if (!Array.isArray(b.characters) || b.characters.length < 2) e.push(`${w}: <2 characters`);
      (b.lines || []).forEach((l, k) => { if (!l.id || !l.character_id || !l.text) e.push(`${w}.line${k}`); }); break;
    case 'reasoning_prompt':
      if (!['logical', 'spatial', 'quantitative', 'analogical'].includes(b.reasoning_type)) e.push(`${w}: reasoning_type`);
      if (!b.prompt || !b.reveal) e.push(`${w}: prompt/reveal`);
      if (![1, 2, 3, 4, 5].includes(b.difficulty_level)) e.push(`${w}: difficulty_level`); break;
    case 'inline_quiz':
      if (typeof b.pass_threshold !== 'number') e.push(`${w}: pass_threshold`);
      if (!Array.isArray(b.questions) || b.questions.length < 1) e.push(`${w}: questions`);
      (b.questions || []).forEach((q, k) => QUIZ(q, `${w}.q${k}`, e)); break;
    case 'writing_scaffold':
      if (!b.task || !['letter', 'paragraph', 'essay', 'dialogue', 'diary_entry', 'speech', 'notice'].includes(b.format)) e.push(`${w}: task/format`);
      if (!Array.isArray(b.model_parts) || b.model_parts.length < 1) e.push(`${w}: model_parts`);
      (b.model_parts || []).forEach((m, k) => { if (!m.id || !m.label || !m.text || !m.annotation) e.push(`${w}.part${k}`); }); break;
    case 'vocabulary_lab':
      if (!['flashcards', 'binomials', 'affixes', 'idioms'].includes(b.mode)) e.push(`${w}: mode`);
      if (!Array.isArray(b.cards) || b.cards.length < 1) e.push(`${w}: cards`);
      (b.cards || []).forEach((c, k) => { if (!c.id || !c.word || !c.pos || !c.meaning || !c.example) e.push(`${w}.card${k} (need id/word/pos/meaning/example)`); });
      (b.self_check || []).forEach((q, k) => QUIZ(q, `${w}.sc${k}`, e)); break;
    case 'comprehension_checkpoint':
      if (!Array.isArray(b.questions) || b.questions.length < 1 || b.questions.length > 3) e.push(`${w}: questions 1-3`);
      (b.questions || []).forEach((q, k) => { if (!q.id || !q.question || !q.explanation) e.push(`${w}.q${k} (need id/question/explanation)`); if (q.options && (!Array.isArray(q.options) || q.options.length < 2)) e.push(`${w}.q${k} options`); }); break;
    default: e.push(`${w}: unknown type`);
  }
}

let total = 0;
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const e = [];
  if (!data.chapter_number || !data.after_slug || !data.slug || !data.title) e.push('missing page meta');
  (data.blocks || []).forEach((b, i) => vBlock(b, i, e));
  // order must be 0..n-1
  const orders = (data.blocks || []).map((b) => b.order);
  if (JSON.stringify(orders) !== JSON.stringify(orders.map((_, i) => i))) e.push(`orders not 0..n: ${orders}`);
  if (e.length) { total += e.length; console.log(`✗ ${data.slug}:`); e.forEach((x) => console.log('   ', x)); }
  else console.log(`✓ ${data.slug}: ${data.blocks.length} blocks OK (insert after ${data.after_slug})`);
}
if (total) { console.error(`\n${total} errors`); process.exit(1); }
console.log('\nAll pages valid.');
