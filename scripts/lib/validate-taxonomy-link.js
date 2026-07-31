'use strict';
/**
 * validate-taxonomy-link.js — enforce the Live Book ↔ Crucible TITLE-consistency
 * rule (founder, 2026-07-27): if a student reads a chapter in a Live Book, the
 * same chapter in Crucible must carry the EXACT same title. "Atomic Structure"
 * here and "Structure of Atom" there is the failure mode this exists to catch.
 *
 * Checks, per book:
 *   1. ERROR — every chapter declares `crucible_chapter_id`, and it resolves to
 *      a real `type: 'chapter'` entry in the taxonomy.
 *   2. ERROR — the Live Book chapter's `title` is byte-for-byte identical to
 *      that taxonomy chapter's `name`.
 *   3. INFO  — which of that Crucible chapter's primary topic tags the book
 *      doesn't obviously mention yet (title-substring match against page
 *      titles — a heuristic prompt for the founder's own review, not a gate).
 *
 * Run:  node scripts/lib/validate-taxonomy-link.js <book-slug>
 */
const path = require('path');
const fs = require('fs');
const { withDb } = require('./book-writer');

const TAX_PATH = path.join(__dirname, '../../packages/data/taxonomy/taxonomyData_from_csv.ts');

function loadTaxonomy() {
  const src = fs.readFileSync(TAX_PATH, 'utf8');
  const chapters = new Map(); // id -> name
  const topics = new Map();   // id -> { name, parent }
  const re = /\{\s*id:\s*'([^']+)'\s*,\s*name:\s*'((?:[^'\\]|\\.)*)'\s*,\s*parent_id:\s*(?:'([^']+)'|null)\s*,\s*type:\s*'(chapter|topic)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const [, id, rawName, parent, type] = m;
    const name = rawName.replace(/\\'/g, "'");
    if (type === 'chapter') chapters.set(id, name);
    else topics.set(id, { name, parent });
  }
  return { chapters, topics };
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('usage: node scripts/lib/validate-taxonomy-link.js <book-slug>');
    process.exit(2);
  }

  const { chapters: taxChapters, topics: taxTopics } = loadTaxonomy();
  let errors = 0;

  await withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug });
    if (!book) { console.error(`book not found: ${slug}`); process.exit(2); }

    console.log(`\n${book.title}  (${slug})`);

    for (const ch of book.chapters || []) {
      const cid = ch.crucible_chapter_id;
      console.log(`\n── Ch.${ch.number} "${ch.title}"`);

      if (!cid) {
        console.log('   ❌ no crucible_chapter_id set — title consistency cannot be checked');
        errors++;
        continue;
      }
      if (!taxChapters.has(cid)) {
        console.log(`   ❌ crucible_chapter_id '${cid}' is not a chapter in the taxonomy`);
        errors++;
        continue;
      }

      const crucibleTitle = taxChapters.get(cid);
      if (ch.title !== crucibleTitle) {
        console.log(`   ❌ TITLE MISMATCH`);
        console.log(`      Live Book: "${ch.title}"`);
        console.log(`      Crucible:  "${crucibleTitle}"  (${cid})`);
        errors++;
      } else {
        console.log(`   ✅ title matches Crucible '${cid}'`);
      }

      // Informational only — a prompt for the founder's own topic-flow review,
      // not something this script blocks on.
      const pages = await db.collection('book_pages')
        .find({ book_id: book._id, chapter_number: ch.number, deleted_at: null })
        .project({ title: 1, subtitle: 1 }).toArray();
      const haystack = pages.map((p) => `${p.title} ${p.subtitle || ''}`.toLowerCase()).join(' | ');

      const chapterTags = [...taxTopics.entries()].filter(([, v]) => v.parent === cid);
      const unmentioned = chapterTags.filter(([, v]) => {
        const keyword = v.name.split(/[—(]/)[0].trim().toLowerCase().split(' ').slice(0, 2).join(' ');
        return keyword.length > 3 && !haystack.includes(keyword);
      });
      if (unmentioned.length) {
        console.log(`   ℹ️  ${unmentioned.length}/${chapterTags.length} primary tags not obviously covered by a page title yet (heuristic — check by hand):`);
        for (const [id, v] of unmentioned) console.log(`      - ${id}  ${v.name}`);
      } else {
        console.log(`   ℹ️  all ${chapterTags.length} primary tags appear covered by page titles`);
      }
    }
  });

  console.log(`\n${errors === 0 ? '✅' : '❌'} ${errors} error(s)\n`);
  process.exit(errors === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
