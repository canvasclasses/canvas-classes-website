'use strict';
/* Class 11 Math · Ch.4 Complex Numbers and Quadratic Equations — SYLLABUS-SCOPE
   HONESTY NOTE, founder-approved 2026-07-24.

   The real NCERT PDF (rationalised 2023-24 edition), read for the first time this
   session, shows the chapter's actual spine is only:
     4.1 Introduction · 4.2 Complex Numbers · 4.3 Algebra of Complex Numbers
     4.4 The Modulus and the Conjugate of a Complex Number · 4.5 Argand Plane
     Miscellaneous Examples/Exercise · Summary · Historical Note
   There is NO section on quadratic equations with complex roots (despite the
   chapter's retained title) and NO polar-form content (no r(cosθ+isinθ), no
   argument) in the current print — 4.5's heading still reads "Argand Plane and
   Polar Representation" as a holdover from the pre-rationalisation edition, but
   the body only covers plotting points and distance.

   Founder decision (asked directly, 2026-07-24): KEEP pages 5 ("Polar
   Representation") and 6 ("Quadratic Equations — Complex Roots") as deliberate
   JEE-relevant enrichment rather than trim them — both topics remain standard
   competitive-exam material and fit the chapter's retained title. This script
   just makes that scope decision honest on the page itself, mirroring the
   pattern already used for Ch.5 (reconcile_ch5_syllabus_note.js).

   Per CLAUDE.md §0.6 nothing is deleted — purely additive (one new callout
   block per page). Idempotent: skips a page if its note is already present.
   Run: node scripts/math11-book/reconcile_ch4_syllabus_note.js */
const bw = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const NOTES = [
  {
    slug: 'polar-representation',
    markdown:
      'A quick heads-up on scope: the current **rationalised NCERT textbook (2023-24 edition)** dropped ' +
      'polar form from this chapter entirely — section 4.5\'s heading still says "Argand Plane and Polar ' +
      'Representation" (a holdover from the older edition), but the actual printed content only covers ' +
      'plotting points and distance on the Argand plane, nothing on $ r(\\cos\\theta + i\\sin\\theta) $ or the ' +
      'argument. We have kept this page as a **deliberate extension**, because polar form is standard ' +
      'JEE-level material and a natural next step once you can plot a complex number. Nothing here is ' +
      'fabricated NCERT content — it is just clearly **beyond** the current textbook, which is why you will ' +
      'not find matching NCERT exercise numbers for it in the practice bank at the end of this chapter.',
  },
  {
    slug: 'quadratic-equations-complex-roots',
    markdown:
      'A quick heads-up on scope: despite the chapter\'s full title, the current **rationalised NCERT ' +
      'textbook (2023-24 edition)** does **not** contain a section on solving quadratic equations with ' +
      'complex roots — that content was trimmed out in the rationalisation. We have kept this page as a ' +
      '**deliberate extension**, because it is the single most direct application of everything you just ' +
      'learned about $ i $, and it is standard JEE-level material. Nothing here is fabricated NCERT content — ' +
      'it is just clearly **beyond** the current textbook, which is why you will not find matching NCERT ' +
      'exercise numbers for it in the practice bank at the end of this chapter.',
  },
];

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    for (const { slug, markdown } of NOTES) {
      const cur = await pages.findOne({ slug });
      if (!cur) { console.log('page not found, skipping:', slug); continue; }

      const already = (cur.blocks || []).some(
        (blk) => blk.type === 'callout' && /rationalised NCERT textbook/.test(blk.markdown || ''),
      );
      if (already) { console.log(slug, ': note already present — skipping (idempotent).'); continue; }

      const sorted = [...(cur.blocks || [])].sort((a, b) => a.order - b.order);
      const insertAfterIdx = sorted.findIndex((blk) => blk.type === 'text' && blk.order === 1);
      if (insertAfterIdx === -1) { console.log(slug, ': expected text block at order 1 not found — aborting to avoid a blind insert'); continue; }

      const noteBlock = {
        id: uuidv4(), type: 'callout', variant: 'note', title: 'A Note on Scope', markdown,
      };

      const withNote = [
        ...sorted.slice(0, insertAfterIdx + 1),
        noteBlock,
        ...sorted.slice(insertAfterIdx + 1),
      ];
      const newBlocks = withNote.map((blk, i) => ({ ...blk, order: i }));

      const res = await bw.savePage(db, { slug }, newBlocks, {
        author: 'agent',
        summary: 'Added an honest syllabus-scope callout clarifying this page is a deliberate JEE-relevant ' +
          'extension beyond the rationalised 2023-24 NCERT Ch.4, which no longer contains this section — ' +
          'founder-approved 2026-07-24 after reading the real source PDF for the first time.',
      });
      console.log('SAVED', res.slug, 'version', res.version, 'blocks:', newBlocks.length);
    }
  });
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
