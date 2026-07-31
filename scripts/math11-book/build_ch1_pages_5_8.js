'use strict';
/* Class 11 Math · Ch.1 Sets — pages 5–8 (Venn diagrams, operations on sets,
   complement + De Morgan's laws, practical counting problems).
   Source: NCERT Class 11 Mathematics, Ch.1 "Sets" (Reprint 2026-27 print).
   Page 8 ("practical problems") is flagged supplementary — see
   _agents/plans/MATH_CH1_SETS_PLAN.md §A: this NCERT print has no
   practical-problems section, so its worked examples are own-numbered,
   never attributed to NCERT.
   Additive + idempotent. Run: node scripts/math11-book/build_ch1_pages_5_8.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch1');

/* ── Page 5 — Venn Diagrams (NCERT 1.8) ──────────────────────────────────── */
const p5 = [
  b('image', 0, {
    src: '', alt: 'A rectangle labelled U with two overlapping glowing circles inside it, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A large glowing rectangle outline containing two overlapping ' +
      'circles, one sky-blue and one amber, their overlap glowing violet, with a handful of small dots ' +
      'scattered inside each region. Deep near-black background, elegant technical-diagram style, no text.',
  }),
  b('text', 1, {
    markdown:
      'Most relationships between sets are easiest to *see*, not read. A **Venn diagram** (named after the ' +
      'English logician **John Venn, 1834–1883**) draws the universal set $ U $ as a rectangle, and every ' +
      'set inside it as a circle — with the actual elements written as dots inside their circle.',
  }),
  b('image', 2, {
    src: '', alt: 'A rectangle U with numbers 1 to 10 scattered inside, and a circle A containing the even numbers',
    caption: 'NCERT Illustration 1 — U = {1, 2, …, 10} is the universal set of which A = {2, 4, 6, 8, 10} is a subset.',
    width: 'three_quarter', aspect_ratio: '4:3',
    generation_prompt:
      'A clean technical Venn diagram on a deep near-black background: a large rectangle labelled U (top ' +
      'left corner) containing the glowing dots 1, 3, 5, 7, 9 scattered loosely outside a circle, and the ' +
      'dots 2, 4, 6, 8, 10 inside a violet-outlined circle labelled A. Amber dots outside the circle, sky-blue ' +
      'dots inside it, minimalist textbook-figure style.',
  }),
  b('text', 3, {
    markdown:
      'Read it like this: **everything inside the circle belongs to $ A $**; everything inside the rectangle ' +
      'but *outside* every circle belongs to $ U $ but not to any of the labelled subsets.',
  }),
  b('image', 4, {
    src: '', alt: 'A rectangle U containing a large circle A, which itself contains a smaller circle B, both filled with numbered dots',
    caption: 'NCERT Illustration 2 — U = {1, 2, …, 10}, A = {2, 4, 6, 8, 10}, B = {4, 6}, and B ⊂ A.',
    width: 'three_quarter', aspect_ratio: '4:3',
    generation_prompt:
      'A clean technical Venn diagram on a deep near-black background: a large rectangle labelled U, ' +
      'containing a violet-outlined circle labelled A with a smaller amber-outlined circle labelled B nested ' +
      'fully inside it, glowing dots scattered in each region (a couple outside A, several inside A but ' +
      'outside B, a couple inside B), minimalist textbook-figure style.',
  }),
  b('reasoning_prompt', 5, {
    reasoning_type: 'spatial',
    prompt: 'In a Venn diagram, one circle B is drawn entirely inside another circle A. What does that picture say?',
    options: ['B and A are disjoint', 'B ⊂ A — every element of B is also in A', 'A ⊂ B', 'A and B are equal'],
    reveal: 'A smaller circle fully nested inside a bigger one is exactly how you draw B ⊂ A — every dot inside B is also inside A. Disjoint sets would be drawn as two circles that don’t touch at all.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 6, {
    pass_threshold: 0.67,
    questions: [
      q('In a Venn diagram, the rectangle represents…',
        ['A subset', 'The universal set', 'The empty set', 'The complement'],
        1,
        'The rectangle is always the universal set U, the background against which every other set is drawn. Subsets are drawn as circles inside it.',
        1),
      q('A dot is drawn inside the rectangle but outside every circle. What can you say about it?',
        ['It belongs to no set being discussed except U', 'It belongs to every circle', 'It is not a real element', 'It belongs to the empty set'],
        0,
        'Being inside the rectangle but outside all circles means it is in U but not in any of the labelled subsets — a perfectly ordinary element that just isn’t part of the sets under discussion.',
        1),
      q('Two circles in a Venn diagram overlap in a small region. What does the overlap represent?',
        ['Elements in neither set', 'Elements in both sets at once', 'Elements only in the first set', 'The universal set'],
        1,
        'The overlapping region is where the two circles share space — exactly the elements that belong to both sets simultaneously.',
        1),
      q('Which pair of sets would be drawn as two circles that do NOT touch at all?',
        ['Two disjoint sets', 'Two equal sets', 'A set and its superset', 'A set and its power set'],
        0,
        'Disjoint sets share no elements, so there is no overlap to draw — the two circles sit apart. Equal sets would be drawn as the same circle; a superset relationship nests one circle inside the other.',
        2),
    ],
  }),
  b('text', 7, {
    markdown:
      'A picture like this is nice for *reading* a relationship — but the real power of Venn diagrams shows ' +
      'up once you start **combining** sets: joining them together, keeping only what overlaps, or taking ' +
      'what’s left over.',
  }),
];

/* ── Page 6 — Operations on Sets: Union, Intersection, Difference (NCERT 1.9) */
const p6 = [
  b('image', 0, {
    src: '', alt: 'Two circles merging into one combined shape, and the same two circles with only their overlap glowing, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5), split into two halves. Left half: two circles, sky-blue and amber, ' +
      'fully glowing together as one combined violet-lit shape (union). Right half: the same two circles, ' +
      'mostly dim, with only their small overlapping lens-shaped region glowing bright violet (intersection). ' +
      'Deep near-black background, elegant diagram style, no text.',
  }),
  b('text', 1, {
    markdown:
      'Just as you add, subtract and multiply numbers, you can combine **sets**. The first operation: the ' +
      '**union** of $ A $ and $ B $ is everything that is in $ A $, or in $ B $, or in both — with shared ' +
      'elements counted only once.',
  }),
  b('latex_block', 2, {
    latex: 'A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}',
    label: 'Union', highlight: true,
  }),
  b('worked_example', 3, {
    label: 'NCERT Example 12', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Let $ A = \\{2, 4, 6, 8\\} $ and $ B = \\{6, 8, 10, 12\\} $. Find $ A \\cup B $.',
    solution:
      'List every element from either set, writing the shared ones $ 6, 8 $ only once:\n\n' +
      '$ A \\cup B = \\{2, 4, 6, 8, 10, 12\\} $.',
  }),
  b('worked_example', 4, {
    label: 'NCERT Example 14', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      'Let $ X = \\{\\text{Ram, Geeta, Akbar}\\} $ be the students of Class XI on the hockey team, and ' +
      '$ Y = \\{\\text{Geeta, David, Ashok}\\} $ be the students on the football team. Find $ X \\cup Y $ and ' +
      'say what it means.',
    solution:
      'Combine both rosters, listing Geeta (who plays both) only once:\n\n' +
      '$ X \\cup Y = \\{\\text{Ram, Geeta, Akbar, David, Ashok}\\} $.\n\n' +
      'This is the set of every Class XI student on **at least one** of the two teams — hockey, football, or ' +
      'both.',
  }),
  b('callout', 5, {
    variant: 'remember', title: 'Properties of Union',
    markdown:
      '$ A \\cup B = B \\cup A $ (commutative) · $ (A \\cup B) \\cup C = A \\cup (B \\cup C) $ (associative) · ' +
      '$ A \\cup \\phi = A $ ($ \\phi $ is the identity element) · $ A \\cup A = A $ (idempotent) · ' +
      '$ U \\cup A = U $.\n\n' +
      'One useful shortcut worth noticing: if $ B \\subset A $, then $ A \\cup B = A $ — union with a subset ' +
      'adds nothing new.',
  }),
  b('text', 6, {
    markdown:
      'The second operation: the **intersection** of $ A $ and $ B $ keeps only the elements common to ' +
      '**both**.',
  }),
  b('latex_block', 7, {
    latex: 'A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}',
    label: 'Intersection', highlight: true,
  }),
  b('worked_example', 8, {
    label: 'NCERT Examples 15 & 17', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      '(a) Using $ A = \\{2, 4, 6, 8\\} $ and $ B = \\{6, 8, 10, 12\\} $ from Example 12, find $ A \\cap B $.\n\n' +
      '(b) Let $ A = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\\} $ and $ B = \\{2, 3, 5, 7\\} $. Find $ A \\cap B $, and ' +
      'notice what happens because $ B \\subset A $.',
    solution:
      '(a) The elements shared by both lists are $ 6 $ and $ 8 $, so $ A \\cap B = \\{6, 8\\} $.\n\n' +
      '(b) Every element of $ B $ already sits inside $ A $ (since $ B \\subset A $), so keeping only the ' +
      'shared elements just gives back $ B $ itself: $ A \\cap B = \\{2, 3, 5, 7\\} = B $. **Whenever ' +
      '$ B \\subset A $, intersecting with $ A $ leaves $ B $ unchanged.**',
  }),
  b('callout', 9, {
    variant: 'remember', title: 'Properties of Intersection',
    markdown:
      '$ A \\cap B = B \\cap A $ (commutative) · $ (A \\cap B) \\cap C = A \\cap (B \\cap C) $ (associative) · ' +
      '$ \\phi \\cap A = \\phi $, $ U \\cap A = A $ · $ A \\cap A = A $ (idempotent) · the **distributive law** ' +
      '$ A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C) $.\n\n' +
      'If $ A \\cap B = \\phi $ (nothing shared), $ A $ and $ B $ are called **disjoint sets**.',
  }),
  b('text', 10, {
    markdown:
      'The third operation: the **difference** $ A - B $ keeps only what’s in $ A $ but **not** in $ B $. ' +
      'Order matters here — $ A - B $ and $ B - A $ are usually different sets.',
  }),
  b('worked_example', 11, {
    label: 'NCERT Examples 18 & 19', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      '(a) Let $ A = \\{1, 2, 3, 4, 5, 6\\} $, $ B = \\{2, 4, 6, 8\\} $. Find $ A - B $ and $ B - A $.\n\n' +
      '(b) Let $ V = \\{a, e, i, o, u\\} $, $ B = \\{a, i, k, u\\} $. Find $ V - B $ and $ B - V $.',
    solution:
      '(a) $ A - B = \\{1, 3, 5\\} $ — these belong to $ A $ and not to $ B $. $ B - A = \\{8\\} $ — this ' +
      'belongs to $ B $ and not to $ A $. Notice $ A - B \\ne B - A $.\n\n' +
      '(b) $ V - B = \\{e, o\\} $ (in $ V $, missing from $ B $). $ B - V = \\{k\\} $ (in $ B $, missing from ' +
      '$ V $). Again, $ V - B \\ne B - V $ — the difference is never symmetric.',
  }),
  b('reasoning_prompt', 12, {
    reasoning_type: 'logical',
    prompt: 'If $ A - B = \\phi $, what does that tell you about A and B?',
    options: ['A and B are disjoint', 'Every element of A is also in B, i.e. A ⊂ B', 'A is empty', 'A and B are equal'],
    reveal: '$ A - B $ collects elements of A missing from B. If nothing is left over, every element of A must already be in B — that’s exactly $ A \\subset B $ (not necessarily A = B, since B could have extra elements too).',
    difficulty_level: 2,
  }),
  b('inline_quiz', 13, {
    pass_threshold: 0.67,
    questions: [
      q('$ A = \\{1, 3, 5\\} $, $ B = \\{1, 2, 3\\} $. What is $ A \\cup B $?',
        ['$ \\{1, 2, 3, 5\\} $', '$ \\{1, 3\\} $', '$ \\{1, 2, 3, 1, 3, 5\\} $', '$ \\phi $'],
        0,
        'Union collects every element from either set, listing the shared ones (1 and 3) only once: $ \\{1,2,3,5\\} $.',
        1),
      q('$ A = \\{2, 4, 6, 8\\} $ and $ B = \\{1, 3, 5, 7\\} $. What is $ A \\cap B $?',
        ['$ \\{2,4,6,8,1,3,5,7\\} $', '$ \\phi $ — A and B are disjoint', '$ \\{1\\} $', 'Cannot be found'],
        1,
        'No number is in both lists — one is all-even, the other all-odd — so nothing survives the intersection. $ A \\cap B = \\phi $, and A, B are disjoint sets.',
        1),
      q('For $ A = \\{1, 2, 3, 4\\} $ and $ B = \\{3, 4, 5\\} $, what is $ A - B $?',
        ['$ \\{1, 2\\} $', '$ \\{5\\} $', '$ \\{3, 4\\} $', '$ \\{1, 2, 3, 4, 5\\} $'],
        0,
        '$ A - B $ keeps elements of A that are NOT in B. 3 and 4 are in B, so they’re removed, leaving $ \\{1, 2\\} $. Answering $ \\{5\\} $ mixes up A − B with B − A.',
        2),
      q('Which law does $ A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C) $ describe?',
        ['Commutative law', 'Associative law', 'Distributive law', 'Idempotent law'],
        2,
        'This is the distributive law — intersection distributes over union, exactly the way multiplication distributes over addition in ordinary arithmetic.',
        2),
    ],
  }),
  b('text', 14, {
    markdown:
      'Union, intersection and difference build new sets from two old ones. There is one more operation that ' +
      'needs only **one** set and the universal set it lives in — the complement.',
  }),
];

/* ── Page 7 — Complement of a Set + De Morgan's Laws (NCERT 1.10) ─────────── */
const p7 = [
  b('image', 0, {
    src: '', alt: 'A rectangle with a glowing circle inside it, and only the region OUTSIDE the circle lit up, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A large rectangle labelled U with a dim, unlit circle A inside it, ' +
      'while the entire region of the rectangle OUTSIDE the circle glows bright amber — the idea of a ' +
      'complement. Deep near-black background, elegant diagram style, no text.',
  }),
  b('text', 1, {
    markdown:
      'Once you have fixed a universal set $ U $, every subset $ A $ has a natural partner: everything in ' +
      "$ U $ that is **not** in $ A $. That partner is the **complement** of $ A $, written $ A' $.",
  }),
  b('latex_block', 2, {
    latex: "A' = U - A = \\{x : x \\in U \\text{ and } x \\notin A\\}",
    label: 'Complement', highlight: true,
  }),
  b('worked_example', 3, {
    label: 'NCERT Example 20', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: "Let $ U = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\\} $ and $ A = \\{1, 3, 5, 7, 9\\} $. Find $ A' $.",
    solution:
      "Take everything in U that isn't in A. The numbers $ 2, 4, 6, 8, 10 $ are the only ones left out of A, so\n\n" +
      "$ A' = \\{2, 4, 6, 8, 10\\} $.",
  }),
  b('worked_example', 4, {
    label: 'NCERT Example 22', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      "Let $ U = \\{1, 2, 3, 4, 5, 6\\} $, $ A = \\{2, 3\\} $, $ B = \\{3, 4, 5\\} $. Find $ A' $, $ B' $, " +
      "$ A' \\cap B' $, $ A \\cup B $, and hence show that $ (A \\cup B)' = A' \\cap B' $.",
    solution:
      "$ A' $ removes $ 2, 3 $ from U: $ A' = \\{1, 4, 5, 6\\} $. $ B' $ removes $ 3, 4, 5 $: $ B' = \\{1, 2, 6\\} $.\n\n" +
      "Their intersection keeps only what's common to both: $ A' \\cap B' = \\{1, 6\\} $.\n\n" +
      "Now $ A \\cup B = \\{2, 3, 4, 5\\} $, so its complement removes those from U: $ (A \\cup B)' = \\{1, 6\\} $.\n\n" +
      "Both sides give $ \\{1, 6\\} $ — confirming $ (A \\cup B)' = A' \\cap B' $ for this example.",
  }),
  b('callout', 5, {
    variant: 'remember', title: 'Complement Laws & De Morgan’s Laws',
    markdown:
      "**Complement laws:** $ A \\cup A' = U $ and $ A \\cap A' = \\phi $ — a set and its complement together " +
      'make up the whole universal set, and share nothing.\n\n' +
      "**De Morgan's laws:** $ (A \\cup B)' = A' \\cap B' $ and $ (A \\cap B)' = A' \\cup B' $ — the complement " +
      'of a union is the intersection of the complements, and vice versa.\n\n' +
      "**Double complement:** $ (A')' = A $. **Extremes:** $ \\phi' = U $ and $ U' = \\phi $.",
  }),
  b('reasoning_prompt', 6, {
    reasoning_type: 'logical',
    prompt: "What is $ A \\cap A' $ always equal to, for any set A?",
    options: ['A', 'U', '$ \\phi $', 'It depends on A'],
    reveal: "A and its complement A′ share nothing by definition — everything in A′ is precisely what’s excluded from A. So $ A \\cap A' = \\phi $, always, for every set A.",
    difficulty_level: 1,
  }),
  b('inline_quiz', 7, {
    pass_threshold: 0.67,
    questions: [
      q("If $ U = \\{1,...,10\\} $ and $ A = \\{2, 4, 6, 8, 10\\} $, what is $ A' $?",
        ['$ \\{1, 3, 5, 7, 9\\} $', '$ \\{2, 4, 6, 8, 10\\} $', '$ U $', '$ \\phi $'],
        0,
        "A′ collects every element of U that is NOT in A. Since A is exactly the even numbers 1–10, A′ is exactly the odd ones.",
        1),
      q("Which of these is $ (A \\cup B)' $ equal to, by De Morgan's law?",
        ["$ A' \\cup B' $", "$ A' \\cap B' $", "$ A \\cap B $", "$ A' - B' $"],
        1,
        "De Morgan's law says the complement of a union is the intersection of the complements: $ (A \\cup B)' = A' \\cap B' $.",
        2),
      q("What is $ (A')' $ (the complement of the complement of A)?",
        ['$ U $', '$ \\phi $', '$ A $', "$ A' $"],
        2,
        "Taking the complement twice undoes itself — everything excluded, then re-included, lands you back where you started: $ (A')' = A $.",
        1),
      q("What is $ U' $ (the complement of the universal set itself)?",
        ['$ U $', '$ \\phi $', 'undefined', '$ A $'],
        1,
        "Every element of U is, trivially, in U — so nothing is left over outside it. $ U' = \\phi $. (And symmetrically, $ \\phi' = U $.)",
        2),
    ],
  }),
  b('text', 8, {
    markdown:
      'Union, intersection, difference and complement are the whole toolkit for combining sets. The last ' +
      'skill is putting that toolkit to work on a very practical question: exactly **how many** things are in ' +
      'a combined set.',
  }),
];

/* ── Page 8 — Practical Problems: Counting with Union & Intersection (flagged
   supplementary — see MATH_CH1_SETS_PLAN.md §A; not an NCERT print section) ── */
const p8 = [
  b('image', 0, {
    src: '', alt: 'Two overlapping circles of glowing dots with a running tally counting the total, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Two overlapping circles of glowing dots, sky-blue and amber, with ' +
      'their shared violet overlap region subtly emphasised, and small numeral tallies hovering near each ' +
      'region as if being counted. Deep near-black background, elegant infographic style, no readable text ' +
      'beyond simple digits.',
  }),
  b('callout', 1, {
    variant: 'note', title: 'Not in the current NCERT print',
    markdown:
      'This counting formula does not have its own numbered section or exercise in this edition of the ' +
      'textbook (older editions had a "Practical Problems" section). It is included here because it is ' +
      'standard, frequently examined material — the worked examples below use their own numbers, never an ' +
      'NCERT attribution.',
  }),
  b('text', 2, {
    markdown:
      'Suppose 25 students play cricket and 20 play football, in a class of 60. Can you say 45 students play ' +
      'at least one sport? Only if **nobody plays both** — anyone who plays both got counted twice. Subtract ' +
      'that double-count back out, and you get the general rule for combining two group sizes.',
  }),
  b('latex_block', 3, {
    latex: 'n(A \\cup B) = n(A) + n(B) - n(A \\cap B)',
    label: 'Counting a union', highlight: true,
  }),
  b('text', 4, {
    markdown:
      'When $ A $ and $ B $ are **disjoint** ($ A \\cap B = \\phi $, so $ n(A \\cap B) = 0 $), the formula ' +
      'simplifies to plain addition: $ n(A \\cup B) = n(A) + n(B) $.',
  }),
  b('worked_example', 5, {
    label: 'Two overlapping groups', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem:
      'In a class of 60 students, 25 play cricket, 20 play football, and 10 play both. How many students play ' +
      'at least one of the two sports? How many play neither?',
    solution:
      'Plug straight into the formula: $ n(A \\cup B) = n(A) + n(B) - n(A \\cap B) = 25 + 20 - 10 = 35 $.\n\n' +
      'So **35 students** play at least one sport. The rest of the class plays neither: ' +
      '$ 60 - 35 = 25 $ students.\n\n' +
      '**Why subtract the 10?** Those 10 students got counted once inside the 25 cricket-players and again ' +
      'inside the 20 football-players — adding $ 25 + 20 $ straight would double-count them, so you take one ' +
      'copy back out.',
  }),
  b('worked_example', 6, {
    label: 'Working backwards from the union', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem:
      'In a survey of 50 people, 30 read newspaper A, 25 read newspaper B, and 40 read at least one of the ' +
      'two. How many read both A and B?',
    solution:
      'The same formula, solved for the piece you don’t yet know:\n\n' +
      '$ n(A \\cup B) = n(A) + n(B) - n(A \\cap B) \\Rightarrow 40 = 30 + 25 - n(A \\cap B) $.\n\n' +
      '$ n(A \\cap B) = 55 - 40 = 15 $. So **15 people** read both newspapers.',
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'quantitative',
    prompt: 'If A and B are disjoint sets with n(A) = 12 and n(B) = 9, what is n(A ∪ B)?',
    options: ['21', '108', '3', 'Cannot be found'],
    reveal: 'Disjoint means n(A ∩ B) = 0, so the formula collapses to plain addition: 12 + 9 = 21. No overlap means no double-counting to subtract.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.67,
    questions: [
      q('40 students like tea, 30 like coffee, 15 like both. How many like at least one?',
        ['70', '55', '40', '25'],
        1,
        'n(A ∪ B) = 40 + 30 − 15 = 55. Adding 40 + 30 without subtracting the 15 who were counted twice gives the wrong total of 70.',
        1),
      q('A and B are disjoint sets. Which formula correctly gives n(A ∪ B)?',
        ['n(A) + n(B) − n(A ∩ B)', 'n(A) + n(B), since n(A ∩ B) = 0', 'n(A) × n(B)', 'n(A) − n(B)'],
        1,
        'For disjoint sets there is nothing to subtract, since n(A ∩ B) = 0 — so the general formula simplifies to plain addition.',
        1),
      q('In a survey, n(A ∪ B) = 40, n(A) = 22, n(B) = 25. What is n(A ∩ B)?',
        ['7', '18', '87', '3'],
        0,
        '40 = 22 + 25 − n(A ∩ B), so n(A ∩ B) = 47 − 40 = 7.',
        2),
      q('60 people were surveyed; 35 read at least one of two papers. How many read NEITHER?',
        ['35', '25', '60', '0'],
        1,
        'If 35 out of 60 read at least one paper, the rest — 60 − 35 = 25 — read neither. "At least one" and "the union" are the same idea.',
        2),
    ],
  }),
  b('text', 9, {
    markdown:
      'You now have the whole toolkit — representing sets, classifying them, subsets and intervals, power and ' +
      'universal sets, Venn diagrams, the four operations, and this counting formula. Time to put all of it ' +
      'to work on the real NCERT exercises.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'venn-diagrams', title: 'Venn Diagrams',
        subtitle: 'Drawing sets as circles inside a rectangle — and reading relationships at a glance.',
        page_number: 5, blocks: p5 },
      { slug: 'operations-on-sets', title: 'Operations on Sets',
        subtitle: 'Union, intersection and difference — three ways to build a new set from two old ones.',
        page_number: 6, blocks: p6 },
      { slug: 'complement-and-de-morgans-laws', title: 'Complement of a Set & De Morgan’s Laws',
        subtitle: 'Everything a set leaves out of the universal set — and the two laws that govern it.',
        page_number: 7, blocks: p7 },
      { slug: 'practical-problems-set-counting', title: 'Practical Problems: Counting with Union & Intersection',
        subtitle: 'How many students play at least one sport? A formula that stops you double-counting.',
        page_number: 8, blocks: p8 },
    ]);
  });
  console.log('pages 5–8 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
