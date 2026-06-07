'use strict';
/** Final grapheme-metric bump for 5 borderline practice questions (correct only
 * marginally > 1.3× the longest distractor under fair grapheme counting). Lengthens
 * one distractor a few graphemes. Reversible. node ... [--write|--rollback] */
const fs = require('fs');
const { withBook, savePageBlocks } = require('./_lib');
const WRITE = process.argv.includes('--write'), ROLLBACK = process.argv.includes('--rollback');
const BACKUP = 'scripts/hindi-fix/_giveaway_fix3_backup.json';
const FIX = {
  'h1-pr-14': ['किसी उपसर्ग के जुड़ने से', 'किसी उपसर्ग के जुड़ने के कारण'],
  'h2-pr-24': ['केवल बड़े और प्रसिद्ध लोग ही लिख सकते हैं', 'केवल बड़े और प्रसिद्ध लोग ही कुछ लिख सकते हैं'],
  'h4-pr-24': ['ऐसी अनोखी बातें असल ज़िंदगी में कभी नहीं होतीं', 'ऐसी अनोखी बातें असल ज़िंदगी में तो कभी नहीं होतीं'],
  'h8-pr-20': ['गाँव की खेती-बाड़ी का महत्व', 'गाँव की खेती-बाड़ी का बड़ा महत्व'],
  'h12-pr-20': ['युद्ध के मैदान की अद्भुत वीरता', 'युद्ध के मैदान की अद्भुत वीरता-गाथा'],
};
(async () => { await withBook(async ({ pages, allPages }) => {
  if (ROLLBACK) { if (!fs.existsSync(BACKUP)) { console.log('No backup.'); return; }
    const o = JSON.parse(fs.readFileSync(BACKUP, 'utf8')); let n = 0; const t = new Set();
    for (const p of allPages) { let d = false; for (const b of p.blocks || []) if (b.type === 'chapter_practice') for (const q of b.questions || []) if (o[q.id]) { q.options = o[q.id]; n++; d = true; }
      if (d) { t.add(p._id); await savePageBlocks(pages, p._id, p.blocks); } }
    console.log(`Rolled back ${n}.`); return; }
  const backup = {}; const dirty = new Map(); let applied = 0; const miss = [];
  for (const p of allPages) for (const b of p.blocks || []) { if (b.type !== 'chapter_practice') continue;
    for (const q of b.questions || []) { const f = FIX[q.id]; if (!f) continue; const k = q.options.indexOf(f[0]);
      if (k === -1 || k === q.correct_index) { miss.push(q.id); continue; }
      backup[q.id] = q.options.slice(); q.options[k] = f[1]; applied++; dirty.set(p._id, p); } }
  console.log(`Applied ${applied}/${Object.keys(FIX).length} | misses: ${miss.join(',') || 'none'}`);
  if (!WRITE) { console.log('(dry run)'); return; }
  fs.writeFileSync(BACKUP, JSON.stringify(backup), 'utf8');
  for (const [, p] of dirty) await savePageBlocks(pages, p._id, p.blocks);
  console.log('✅ Applied.');
}); })().catch(e => { console.error(e); process.exit(1); });
