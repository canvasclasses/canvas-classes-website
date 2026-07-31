#!/usr/bin/env node
/**
 * Insert physics practice-corpus blocks into a Live Book page.
 *
 * Append-only. Goes through scripts/lib/book-writer.js (CLAUDE.md §0.6), so every
 * insert is version-snapshotted, content-loss-guarded and audit-logged. It never
 * removes or rewrites an existing block, so the guard can never trip.
 *
 * usage:
 *   # see what a chapter file holds
 *   node scripts/hcv-bank/insert-blocks.js --chapter 3 --list
 *
 *   # dry run (prints the diff, writes nothing)
 *   node scripts/hcv-bank/insert-blocks.js --chapter 3 --page <slug|pageId> --what bank --dry
 *
 *   # append the whole practice bank to a page
 *   node scripts/hcv-bank/insert-blocks.js --chapter 3 --page kinematics-practice --what bank
 *
 *   # append only two sections of the bank
 *   node scripts/hcv-bank/insert-blocks.js --chapter 3 --page <slug> --what bank --sections projectile,relative
 *
 *   # append specific worked examples
 *   node scripts/hcv-bank/insert-blocks.js --chapter 3 --page <slug> --what worked --only 1,4,7
 */
const fs = require('fs');
const path = require('path');
const { withDb, savePage } = require('../lib/book-writer');

const DIR = path.join(__dirname, '..', '..', '_agents', 'question-banks', 'physics-hcv', 'chapters');

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith('--') ? true : v;
}

const chapter = arg('chapter');
if (!chapter) { console.error('--chapter <n> is required'); process.exit(1); }

const file = path.join(DIR, `ch${String(chapter).padStart(2, '0')}.json`);
if (!fs.existsSync(file)) { console.error(`no corpus file at ${file}`); process.exit(1); }
const doc = JSON.parse(fs.readFileSync(file, 'utf8'));

if (arg('list')) {
  console.log(`\nHCV ch${doc.hcv_chapter} — ${doc.hcv_title}`);
  console.log(`NCERT target: ${doc.ncert.class ? 'Class ' + doc.ncert.class : '?'} — ${doc.ncert.chapter_hint}`);
  const pb = doc.blocks.practice_bank;
  console.log(`\npractice_bank "${pb.id}" — ${pb.sections.length} section(s), ${pb.sections.reduce((s, x) => s + x.items.length, 0)} items`);
  pb.sections.forEach(s => console.log(`   ${s.id.padEnd(28)} ${String(s.items.length).padStart(3)} items   ${s.title}`));
  console.log(`\nworked_examples — ${doc.blocks.worked_examples.length}`);
  doc.blocks.worked_examples.forEach((w, i) => console.log(`   ${String(i + 1).padStart(2)}. ${w.id.padEnd(16)} ${w.label}`));
  console.log();
  process.exit(0);
}

const page = arg('page');
const what = arg('what', 'bank');
const dry = !!arg('dry');
if (!page) { console.error('--page <slug|pageId> is required (or use --list)'); process.exit(1); }

// ── choose the blocks to append ──────────────────────────────────────────────
let toAppend = [];
if (what === 'bank' || what === 'all') {
  const pb = JSON.parse(JSON.stringify(doc.blocks.practice_bank));
  const only = arg('sections');
  if (typeof only === 'string') {
    const want = only.split(',').map(s => s.trim());
    pb.sections = pb.sections.filter(s => want.includes(s.id));
    const missing = want.filter(w => !doc.blocks.practice_bank.sections.some(s => s.id === w));
    if (missing.length) { console.error(`unknown section id(s): ${missing.join(', ')}`); process.exit(1); }
    if (!pb.sections.length) { console.error('no sections matched'); process.exit(1); }
  }
  toAppend.push(pb);
}
if (what === 'worked' || what === 'all') {
  let wes = doc.blocks.worked_examples;
  const only = arg('only');
  if (typeof only === 'string') {
    const idx = only.split(',').map(s => parseInt(s.trim(), 10));
    const bad = idx.filter(i => !(i >= 1 && i <= wes.length));
    if (bad.length) { console.error(`--only out of range: ${bad.join(', ')} (have 1..${wes.length})`); process.exit(1); }
    wes = idx.map(i => wes[i - 1]);
  }
  toAppend.push(...JSON.parse(JSON.stringify(wes)));
}
if (!toAppend.length) { console.error(`--what must be one of: bank, worked, all`); process.exit(1); }

withDb(async (db) => {
  const selector = /^[0-9a-f-]{36}$/i.test(String(page)) ? { pageId: page } : { slug: page };
  const cur = await db.collection('book_pages').findOne(
    selector.pageId ? { _id: selector.pageId } : { slug: selector.slug }
  );
  if (!cur) { console.error(`page not found: ${JSON.stringify(selector)}`); process.exit(1); }

  const existing = Array.isArray(cur.blocks) ? cur.blocks : [];
  const existingIds = new Set(existing.map(b => b && b.id).filter(Boolean));

  // Block ids must be unique within a page; suffix on collision rather than clobber.
  const renamed = [];
  for (const b of toAppend) {
    if (existingIds.has(b.id)) {
      let n = 2, id = `${b.id}-${n}`;
      while (existingIds.has(id)) id = `${b.id}-${++n}`;
      renamed.push(`${b.id} -> ${id}`);
      b.id = id;
    }
    existingIds.add(b.id);
  }

  // order is positional within the page — renumber the whole array so it stays dense.
  const next = [...existing, ...toAppend].map((b, i) => ({ ...b, order: i }));

  console.log(`\npage "${cur.slug}"  blocks ${existing.length} -> ${next.length}`);
  toAppend.forEach(b => {
    const detail = b.type === 'practice_bank'
      ? `${b.sections.length} section(s), ${b.sections.reduce((s, x) => s + x.items.length, 0)} items`
      : b.label;
    console.log(`   + ${b.type.padEnd(16)} ${b.id.padEnd(18)} ${detail}`);
  });
  if (renamed.length) console.log(`   (id collisions renamed: ${renamed.join(', ')})`);

  const res = await savePage(db, selector, next, {
    author: 'hcv-bank/insert-blocks',
    summary: `append ${toAppend.map(b => b.type).join('+')} from physics corpus ch${chapter}`,
    dryRun: dry,
  });

  if (dry) {
    console.log(`\nDRY RUN — nothing written. wouldBlock=${res.wouldBlock}`);
    console.log(`   added: ${res.diff.addedBlockIds.join(', ') || '(none)'}`);
    console.log(`   removed: ${res.diff.removedBlockIds.join(', ') || '(none)'}\n`);
  } else {
    console.log(`\n✓ saved. version snapshot #${res.version}\n`);
  }
}).catch(e => { console.error('\n' + e.message + '\n'); process.exit(1); });
