// Convert 2-column "List I / List II" tables in physics questions into
// the canonical 4-column MTC format the renderer detects:
//
//   | | List I | | List II |
//   |---|---|---|---|
//   | A | item | I | item |
//
// Strips label prefixes A./(A)/A)/a./(a)/a) from list-I cells, and
// the corresponding I./(I)/i./... from list-II cells.
//
// Idempotent: questions already in 4-col format are skipped (the body
// row filter rejects 4-cell rows so .length===2 check fails and the
// converter returns null).
//
// Usage:
//   node scripts/convert_physics_tables.js           # dry-run, all physics chapters
//   node scripts/convert_physics_tables.js --apply   # write to DB
//   node scripts/convert_physics_tables.js --chapter ph11_thermo  # one chapter only

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');

const LETTERS  = ['A', 'B', 'C', 'D', 'E'];
const NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

function stripListILabel(s) {
  return s.replace(/^\s*\(?[A-Da-d]\)?[.)\s]+/, '').trim();
}
function stripListIILabel(s) {
  return s.replace(/^\s*\(?[IVXivx]+\)?[.)\s]+/, '').trim();
}

function convertMarkdown(md) {
  const re = /\|\s*(List[\s\-()]*[I1][^|]*?)\s*\|\s*(List[\s\-()]*[I1]{2}[^|]*?)\s*\|[ \t]*\n\|[-:\s|]+\|[ \t]*\n((?:\|[^\n]+\|[ \t]*\n?)+)/i;
  const m = md.match(re);
  if (!m) return null;

  const [fullMatch, , , bodyRaw] = m;

  const rows = bodyRaw.trim().split('\n').map(line => {
    const cells = line.split('|').map(c => c.trim());
    return cells.filter((_, i, arr) =>
      !(i === 0 && cells[0] === '') &&
      !(i === arr.length - 1 && cells[cells.length - 1] === '')
    );
  }).filter(r => r.length === 2); // 2-cell rows only — 4-cell rows (already converted) get rejected

  if (rows.length === 0) return null;

  let table = '| | List I | | List II |\n|---|---|---|---|\n';
  for (let i = 0; i < rows.length; i++) {
    const listI  = stripListILabel(rows[i][0]);
    const listII = stripListIILabel(rows[i][1]);
    table += `| ${LETTERS[i] ?? ''} | ${listI} | ${NUMERALS[i] ?? ''} | ${listII} |\n`;
  }

  return md.replace(fullMatch, table);
}

(async () => {
  const args = process.argv.slice(2);
  const APPLY = args.includes('--apply');
  const chapterFlag = args.indexOf('--chapter');
  const chapterFilter = chapterFlag >= 0 ? args[chapterFlag + 1] : null;

  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'crucible' });
  const Q = mongoose.connection.collection('questions_v2');

  const filter = {
    deleted_at: null,
    'metadata.chapter_id': chapterFilter ? chapterFilter : /^ph/,
    'question_text.markdown': /Match.*List|Match.*LIST/i,
  };

  const docs = await Q.find(filter)
    .project({ display_id: 1, 'metadata.chapter_id': 1, 'question_text.markdown': 1 })
    .sort({ display_id: 1 })
    .toArray();

  // Snapshot originals (only on apply runs, to avoid creating noise on dry-runs)
  if (APPLY) {
    const snap = {};
    for (const d of docs) snap[d.display_id] = d.question_text.markdown;
    const snapPath = `/tmp/physics_table_originals_${Date.now()}.json`;
    fs.writeFileSync(snapPath, JSON.stringify(snap, null, 2));
    console.log(`Snapshot: ${snapPath}\n`);
  }

  const byChapter = {};
  let converted = 0, skipped = 0, written = 0;

  for (const d of docs) {
    const chap = d.metadata.chapter_id;
    byChapter[chap] = byChapter[chap] || { converted: 0, skipped: 0 };
    const result = convertMarkdown(d.question_text.markdown);
    if (!result) {
      byChapter[chap].skipped++;
      skipped++;
      continue;
    }
    byChapter[chap].converted++;
    converted++;

    if (APPLY) {
      await Q.updateOne(
        { display_id: d.display_id },
        { $set: { 'question_text.markdown': result } }
      );
      written++;
      console.log(`WROTE ${d.display_id} (${chap})`);
    } else {
      console.log(`WOULD-CONVERT ${d.display_id} (${chap})`);
    }
  }

  console.log(`\n=== ${APPLY ? 'APPLIED' : 'DRY-RUN'} ===`);
  console.log('Chapter breakdown:');
  for (const [chap, n] of Object.entries(byChapter).sort()) {
    console.log(`  ${chap.padEnd(28)} converted=${n.converted}  skipped=${n.skipped}`);
  }
  console.log(`Total converted: ${converted}`);
  console.log(`Total skipped:   ${skipped}`);
  if (APPLY) console.log(`Total written:   ${written}`);

  await mongoose.disconnect();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
