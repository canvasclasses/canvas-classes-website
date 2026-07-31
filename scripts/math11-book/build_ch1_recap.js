'use strict';
/* Class 11 Math · Ch.1 Sets — page 10, Chapter Recap (retrieval-only).
   Additive + idempotent. Run: node scripts/math11-book/build_ch1_recap.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch1');

const p10 = [
  b('image', 0, {
    src: '', alt: 'A concept map of set theory ideas glowing on a dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A clean glowing concept map linking the ideas of this chapter — ' +
      'collection → set → subset → power set → Venn diagram → union/intersection/difference → complement — ' +
      'as connected nodes. Violet and amber nodes on a deep near-black background, elegant mind-map style. ' +
      'No text other than a few short node labels.',
  }),
  b('text', 1, {
    markdown:
      'Don’t just re-read — **retrieve**. Cover the answers and try each prompt before you check. The ' +
      'struggle to recall is what makes it stick.\n\n' +
      '**The chapter in one line:** describe a well-defined collection (a *set*) → tell empty, finite, ' +
      'infinite and equal sets apart → nest one set inside another (a *subset*, and the *intervals* built on ' +
      'it) → gather every possible subset (the *power set*) inside one *universal set* → picture it all with ' +
      'a *Venn diagram* → combine sets (*union, intersection, difference*) → and take what’s left out ' +
      '(the *complement*, governed by *De Morgan’s laws*).',
  }),
  b('table', 2, {
    caption: 'The four ways to combine sets, at a glance',
    headers: ['Operation', 'Symbol', 'Keeps…', 'Key property'],
    rows: [
      ['Union', '$ A \\cup B $', 'everything in A, or B, or both', '$ A \\cup A\' = U $'],
      ['Intersection', '$ A \\cap B $', 'only what A and B share', '$ A \\cap A\' = \\phi $'],
      ['Difference', '$ A - B $', 'what’s in A but not in B', '$ A - B \\ne B - A $ in general'],
      ["Complement", "$ A' $", 'everything in U but not in A', "$ (A')' = A $"],
    ],
  }),
  b('table', 3, {
    caption: 'Traps worth memorising',
    headers: ['Don’t confuse…', '…with'],
    rows: [
      ['$ \\{0\\} $ (one element)', '$ \\phi $ (zero elements)'],
      ['$ a \\in A $ (element of)', '$ \\{a\\} \\subset A $ (subset of) — related but not the same claim'],
      ['$ A \\subset B $', '$ A \\in B $ — subset vs. membership are different relationships'],
      ['$ n(P(A)) = 2^n $', 'confusing it with $ 2n $ or $ n^2 $'],
      ["$ (A \\cup B)' = A' \\cap B' $", "$ (A \\cap B)' = A' \\cup B' $ — De Morgan flips the operation"],
      ['$ A - B $', '$ B - A $ — set difference is never symmetric'],
    ],
  }),
  b('reasoning_prompt', 4, {
    reasoning_type: 'logical',
    prompt: 'A friend says “every subset of A is also an element of A.” Are they right?',
    options: ['Yes, always', 'No — a subset is a collection built FROM A’s elements, not necessarily one of A’s own elements', 'Only if A is infinite'],
    reveal: 'No. $ \\{1\\} $ is a subset of $ \\{1, 2\\} $, but $ \\{1\\} $ is not itself listed as an element of $ \\{1,2\\} $ (unless it happens to be, as in trickier sets like $ \\{1, 2, \\{1\\}\\} $). Subset (⊂) and membership (∈) are related but different relationships — mixing them up is the single most common Sets mistake.',
    difficulty_level: 2,
  }),
  b('reasoning_prompt', 5, {
    reasoning_type: 'quantitative',
    prompt: 'Quick recall: if n(A) = 5 and n(B) = 3 with A, B disjoint, what is n(A ∪ B)?',
    options: ['15', '8', '2', 'Cannot be found'],
    reveal: 'Disjoint sets share nothing, so n(A ∩ B) = 0 and the counting formula collapses to plain addition: 5 + 3 = 8.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.7,
    questions: [
      q('Which of these is the empty set?',
        ['$ \\{0\\} $', '$ \\{x : x \\in \\mathbb{N},\\ x < 5 \\text{ and } x > 10\\} $', '$ \\{\\phi\\} $', '$ \\{x : x = x\\} $'],
        1,
        'No natural number can be both less than 5 and greater than 10 — nothing satisfies the rule, so this is $ \\phi $. Both $ \\{0\\} $ and $ \\{\\phi\\} $ have exactly one element.',
        1),
      q('If $ A = \\{1, 2\\} $, how many elements does $ P(A) $ have?',
        ['2', '4', '8', '1'],
        1,
        '$ n(P(A)) = 2^{n(A)} = 2^2 = 4 $: $ \\phi, \\{1\\}, \\{2\\}, \\{1,2\\} $.',
        1),
      q('$ \\{x \\in \\mathbb{R} : 2 \\le x < 9\\} $ is which interval?',
        ['$ (2, 9) $', '$ [2, 9] $', '$ [2, 9) $', '$ (2, 9] $'],
        2,
        'The $ \\le $ at 2 means included (square bracket); the $ < $ at 9 means excluded (round bracket): $ [2, 9) $.',
        1),
      q('For $ A = \\{1, 2, 3\\} $ and $ B = \\{2, 3, 4\\} $, what is $ A - B $?',
        ['$ \\{1\\} $', '$ \\{4\\} $', '$ \\{2, 3\\} $', '$ \\{1,2,3,4\\} $'],
        0,
        '$ A - B $ keeps what’s in A but missing from B. 2 and 3 are in both, so they’re removed, leaving $ \\{1\\} $. Answering $ \\{4\\} $ mixes up A − B with B − A.',
        2),
      q("By De Morgan's law, $ (A \\cap B)' $ equals…",
        ["$ A' \\cap B' $", "$ A' \\cup B' $", "$ A \\cup B $", "A' - B'"],
        1,
        "The complement of an intersection is the UNION of the complements: $ (A \\cap B)' = A' \\cup B' $. Mixing up the union/intersection swap is the classic De Morgan slip.",
        2),
      q('In a class of 50, 30 like tea and 20 like coffee, with 10 liking both. How many like at least one?',
        ['50', '40', '60', '30'],
        1,
        'n(A ∪ B) = 30 + 20 − 10 = 40. Adding without subtracting the 10 double-counted students gives the wrong total of 50.',
        2),
      q('Which pair below is disjoint?',
        ['$ \\{2, 4, 6\\} $ and $ \\{1, 3, 5\\} $', '$ \\{2, 4, 6\\} $ and $ \\{4, 8\\} $', '$ \\{a, b\\} $ and $ \\{b, c\\} $', '$ \\{1, 2\\} $ and $ \\{2, 3\\} $'],
        0,
        'The evens {2,4,6} and odds {1,3,5} share nothing — disjoint. Every other pair listed shares at least one element (4, b, or 2 respectively).',
        1),
      q('$ A = \\{1, 2, \\{3, 4\\}\\} $. How many elements does A have?',
        ['4', '3', '2', '1'],
        1,
        'A has exactly 3 elements: the number 1, the number 2, and the packaged set $ \\{3,4\\} $ counted as ONE element — not two extra elements 3 and 4.',
        3),
    ],
  }),
  b('text', 7, {
    markdown:
      '**Take it to the exercises.** Head back to the **Practice** page for this chapter and work through ' +
      '**Exercise 1.1** (representations), **1.2** (empty/finite/infinite/equal), **1.3** (subsets & ' +
      'intervals), **1.4** (union, intersection, difference), **1.5** (complement) and the **Miscellaneous ' +
      'Exercise**. Mixing question types — rather than doing one kind in a block — is exactly what trains you ' +
      'to *recognise* which idea a problem needs, which is what the exam actually tests.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'sets-recap', title: 'Recap',
        subtitle: 'Retrieve it, don’t re-read it — then take it back to the NCERT exercises.',
        page_number: 10, blocks: p10 },
    ]);
  });
  console.log('page 10 (recap) DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
