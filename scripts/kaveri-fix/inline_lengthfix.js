'use strict';
/**
 * One-off: fix the 9 inline_quiz questions flagged by quiz_validate.js where the
 * correct option is > 1.3× the longest distractor (a visible length giveaway).
 * For each, replace ONE distractor (matched by a unique ascii needle) with a
 * longer, plausible distractor. The correct option and its position are untouched.
 * Writes a backup of the originals → reversible with --rollback.
 *
 *   node scripts/kaveri-fix/inline_lengthfix.js [--write|--rollback]   (default: dry)
 */
const fs = require('fs');
const { withBook, savePageBlocks } = require('./_lib');
const WRITE = process.argv.includes('--write');
const ROLLBACK = process.argv.includes('--rollback');
const BACKUP = 'scripts/kaveri-fix/_inline_lengthfix_backup.json';

const FIXES = [
  { id: '16f3e424-562d-4744-b250-00af57ead95d', needle: 'gives a magazine', to: 'She gives an old magazine and the narrator gives back a school textbook' },
  { id: '209f7a52-b4a6-4ea2-b9d6-6c748e3fce18', needle: 'soft echo of onomatopoeia', to: 'the soft echo of onomatopoeia running through nearly every line' },
  { id: 'c4ps-q1', needle: 'three different times', to: 'Only the sense of sight, repeated across three separate stanzas' },
  { id: 'c4ps-q2', needle: 'which is more polite', to: 'It hides the real feelings of the writer behind polite, formal-sounding language' },
  { id: 'c4ps-q3', needle: 'forgotten what she looked', to: 'He has simply forgotten what his mother looked like, and the poem means nothing more by it' },
  { id: 'a97f1d1e-33c8-42aa-94f5-7de27047ea41', needle: 'rhyme', to: 'personification' },
  { id: 'c6ls-q2', needle: 'does not actually enjoy', to: 'She is worried she has not practised the fusion piece nearly enough' },
  { id: 'c7pv-q2', needle: 'type of flower', to: 'The outward beauty or showy appearance of a thing' },
  { id: 'c7pv-q3', needle: 'about gardening, not language', to: 'It suggests the poem is really about gardens and farming rather than how people speak' },
];
const byId = new Map(FIXES.map((f) => [f.id, f]));

(async () => {
  await withBook(async ({ pages, allPages }) => {
    if (ROLLBACK) {
      if (!fs.existsSync(BACKUP)) { console.log('No backup — nothing to roll back.'); return; }
      const orig = JSON.parse(fs.readFileSync(BACKUP, 'utf8'));
      let n = 0; const touched = new Set();
      for (const p of allPages) { let dirty = false;
        for (const b of p.blocks || []) { if (b.type !== 'inline_quiz') continue;
          for (const q of b.questions || []) { if (orig[q.id]) { q.options = orig[q.id]; n++; dirty = true; } } }
        if (dirty) { touched.add(p._id); await savePageBlocks(pages, p._id, p.blocks); } }
      console.log(`Rolled back ${n} questions across ${touched.size} pages.`); return;
    }

    const backup = {}; const touched = new Set(); let applied = 0; const misses = [];
    for (const p of allPages) { let dirty = false;
      for (const b of p.blocks || []) { if (b.type !== 'inline_quiz') continue;
        for (const q of b.questions || []) {
          const f = byId.get(q.id); if (!f) continue;
          const k = q.options.findIndex((o, idx) => idx !== q.correct_index && String(o).includes(f.needle));
          if (k === -1) { misses.push(`${q.id}: needle "${f.needle}" not found in a distractor`); continue; }
          console.log(`${q.id}: "${q.options[k]}" (${q.options[k].length}) → "${f.to}" (${f.to.length})`);
          backup[q.id] = q.options.slice();
          q.options = q.options.map((o, idx) => (idx === k ? f.to : o));
          applied++; dirty = true;
        } }
      if (dirty) { touched.add(p._id); if (WRITE) await savePageBlocks(pages, p._id, p.blocks); } }

    console.log(`\n${WRITE ? 'Applied' : '[dry] would apply'} ${applied}/${FIXES.length} fixes across ${touched.size} pages.`);
    if (misses.length) console.log('MISSES:\n  ' + misses.join('\n  '));
    if (WRITE && applied) fs.writeFileSync(BACKUP, JSON.stringify(backup, null, 0), 'utf8');
  });
})().catch((e) => { console.error(e); process.exit(1); });
