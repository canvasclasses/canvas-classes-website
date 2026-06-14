#!/usr/bin/env node
// classify-atom.js — applies the hand-built ATOM→NCERT section map, tallies, and
// emits a grouped report. Flags any display_id in the dump that wasn't mapped.
// Usage: node scripts/ncert/classify-atom.js /tmp/atom-dump.json

const dump = require(process.argv[2] || '/tmp/atom-dump.json');
const { SECTIONS, MAP } = require('./atom-section-map');

// NCERT Cl-11 Unit 2 sections (printed pages)

// display_id -> [sectionCode, tier]

const ids = dump.questions.map(q => q.display_id);
const unmapped = ids.filter(id => !MAP[id]);
const extra = Object.keys(MAP).filter(id => !ids.includes(id));

const tierCount = { A:0, B:0, C:0 };
const bySection = {};
for (const id of ids) {
  const m = MAP[id]; if (!m) continue;
  const [sec, tier] = m;
  tierCount[tier]++;
  (bySection[sec] = bySection[sec] || []).push({ id, tier });
}

console.log('TOTAL:', ids.length);
console.log('UNMAPPED:', unmapped.length, unmapped.join(',') || '(none)');
console.log('MAP-IDs-not-in-dump:', extra.length, extra.join(',') || '(none)');
console.log('\nTIER TOTALS:', JSON.stringify(tierCount),
  `→ citable (A+B) = ${tierCount.A + tierCount.B} / ${ids.length} = ${Math.round((tierCount.A+tierCount.B)/ids.length*100)}%`);
console.log('\nBY SECTION (count | A/B/C):');
const order = ['S1','S221','S222','S223','S225','S231','S232','S233','S24','S251','S252','S26','S262','S263','S264','S265','S266','XC'];
for (const sec of order) {
  const arr = bySection[sec] || [];
  const a = arr.filter(x=>x.tier==='A').length, b = arr.filter(x=>x.tier==='B').length, c = arr.filter(x=>x.tier==='C').length;
  console.log(`\n${sec}  [${arr.length}]  (A:${a} B:${b} C:${c})  ${SECTIONS[sec].title}  · p.${SECTIONS[sec].page}`);
  console.log('   ' + arr.map(x=>x.id.replace('ATOM-','')+x.tier).join(' '));
}
