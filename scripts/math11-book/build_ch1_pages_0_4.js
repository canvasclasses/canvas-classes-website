'use strict';
/* Class 11 Math · Ch.1 Sets — pages 0–4.
   Source: NCERT Class 11 Mathematics, Ch.1 "Sets" (Reprint 2026-27 print),
   read in full from the source PDF before writing (Rule 0). See
   _agents/plans/MATH_CH1_SETS_PLAN.md for the section-spine discovery notes
   (this print has NO Power Set section and NO Practical-Problems section —
   both are flagged supplementary below, never attributed to NCERT).
   Additive + idempotent. Run: node scripts/math11-book/build_ch1_pages_0_4.js */
const { b, q, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch1');

/* ── Page 0 — Chapter opener ─────────────────────────────────────────────── */
const p0 = [
  b('image', 0, {
    src: '', alt: 'Scattered objects sorting themselves into glowing labelled groups, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A scatter of glowing dots, shapes and numerals drifting on ' +
      'the left, and on the right the same objects gathered into a few clean glowing circles — the idea ' +
      'of a "collection" becoming a "set". Warm amber and violet light on a deep near-black background, ' +
      'elegant mathematical-poster style. No text.',
  }),
  b('text', 1, {
    markdown:
      'Long before you plot a single curve, mathematics needs one more basic idea: a precise way to talk ' +
      'about a **collection of things** — numbers, shapes, people, anything — without any ambiguity about ' +
      'what belongs and what doesn’t. That idea is a **set**, and it turns out to be the language *underneath* ' +
      'almost everything else in this book: relations, functions, sequences, probability and geometry all ' +
      'lean on it.\n\n' +
      'The theory was built by the German mathematician **Georg Cantor (1845–1918)**, who stumbled onto it ' +
      'while studying trigonometric series. What looks like the simplest idea in the whole syllabus — “a set ' +
      'is a well-defined collection” — turns out to be exact enough to build every later definition on top of.',
  }),
  b('text', 2, {
    markdown:
      '**What you will be able to do by the end**\n\n' +
      '- Describe a set in **roster form** and **set-builder form**, and move between the two\n' +
      '- Tell an **empty**, **finite**, **infinite** and **equal** set apart\n' +
      '- Test whether one set is a **subset** of another, and read an **interval** on the real line\n' +
      '- Read a **Venn diagram** and use it to reason about sets\n' +
      '- Combine sets with **union, intersection, difference**, and take a set’s **complement**\n' +
      '- Solve real counting problems with the union–intersection formula',
  }),
];

/* ── Page 1 — Sets and Their Representations (NCERT 1.2) ─────────────────── */
const p1 = [
  b('image', 0, {
    src: '', alt: 'A glowing collection of vowels being separated from a jumble of letters, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A jumble of glowing letters on the left, with five of them — ' +
      'a, e, i, o, u — breaking away and gathering inside a bright circle on the right, the idea of picking ' +
      'out a well-defined collection. Amber and violet glow on a deep near-black background, elegant ' +
      'infographic-poster style. No text beyond the letters themselves.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'Not everything you can describe is a set. “The five most talented cricketers in the world” sounds ' +
      'like a list — but talent is a matter of opinion, so two people would build two different collections. ' +
      'NCERT’s own test: for **any** object, can you say for certain whether it belongs or not? If yes, it’s a ' +
      'set. If it’s arguable, it isn’t.',
  }),
  b('text', 2, {
    markdown:
      'A **set** is a **well-defined collection of objects** — well-defined meaning that for any object, you ' +
      'can decide for certain whether it belongs to the collection or not.\n\n' +
      'Sets are usually named with capital letters ($ A, B, X, \\dots $) and their members — also called ' +
      '**elements** — with small letters ($ a, b, x, \\dots $). If $ a $ is an element of $ A $, we write ' +
      '$ a \\in A $ (“$ a $ belongs to $ A $”); if it is not, we write $ a \\notin A $.',
  }),
  b('table', 3, {
    caption: 'The number sets you will use constantly',
    headers: ['Symbol', 'Set'],
    rows: [
      ['$ \\mathbb{N} $', 'all natural numbers'],
      ['$ \\mathbb{Z} $', 'all integers'],
      ['$ \\mathbb{Q} $', 'all rational numbers'],
      ['$ \\mathbb{R} $', 'all real numbers'],
      ['$ \\mathbb{Z}^{+} $', 'positive integers'],
      ['$ \\mathbb{Q}^{+} $', 'positive rational numbers'],
      ['$ \\mathbb{R}^{+} $', 'positive real numbers'],
    ],
  }),
  b('text', 4, {
    markdown:
      'There are two standard ways to write down a set:\n\n' +
      '- **Roster (tabular) form** — list every element, separated by commas, inside braces: ' +
      '$ \\{2, 4, 6\\} $. The **order doesn’t matter** and an element is **never repeated** — ' +
      '$ \\{1, 2, 3\\} $ and $ \\{3, 1, 2\\} $ are the same set.\n' +
      '- **Set-builder form** — describe the *property* every element shares instead of listing them: ' +
      '$ \\{x : x \\text{ is a vowel in the English alphabet}\\} $. Read the colon as “such that”.',
  }),
  b('worked_example', 5, {
    label: 'NCERT Example 1', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Write the solution set of the equation $ x^2 + x - 2 = 0 $ in roster form.',
    solution:
      'Factor first: $ x^2 + x - 2 = (x - 1)(x + 2) = 0 $, so $ x = 1 $ or $ x = -2 $.\n\n' +
      'Both solutions become elements of the set, in roster form:\n\n' +
      '$ \\{1, -2\\} $.',
  }),
  b('worked_example', 6, {
    label: 'NCERT Example 3', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Write the set $ A = \\{1, 4, 9, 16, 25, \\dots\\} $ in set-builder form.',
    solution:
      'Look at the pattern: $ 1 = 1^2,\\ 4 = 2^2,\\ 9 = 3^2,\\ 16 = 4^2,\\ 25 = 5^2 $ — every element is a ' +
      '**perfect square** of a natural number.\n\n' +
      'So $ A = \\{x : x \\text{ is the square of a natural number}\\} $, or equivalently ' +
      '$ A = \\{x : x = n^2, \\text{ where } n \\in \\mathbb{N}\\} $.',
  }),
  b('worked_example', 7, {
    label: 'NCERT Example 5', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      'Match each set on the left (roster form) with the same set on the right (set-builder form):\n\n' +
      '(i) $ \\{P, R, I, N, C, A, L\\} $  (ii) $ \\{0\\} $  (iii) $ \\{1, 2, 3, 6, 9, 18\\} $  (iv) $ \\{3, -3\\} $\n\n' +
      '(a) $ \\{x : x \\text{ is a positive integer and a divisor of } 18\\} $\n\n' +
      '(b) $ \\{x : x \\text{ is an integer and } x^2 - 9 = 0\\} $\n\n' +
      '(c) $ \\{x : x \\text{ is an integer and } x + 1 = 1\\} $\n\n' +
      '(d) $ \\{x : x \\text{ is a letter of the word PRINCIPAL}\\} $',
    solution:
      'Work from whichever clue is easiest to pin down.\n\n' +
      '**(d)** has 9 letters, with P and I each repeated — matching that letter-count is the giveaway that ' +
      '**(i) matches (d)**.\n\n' +
      '**(c)**: $ x + 1 = 1 \\Rightarrow x = 0 $, so **(ii) $ \\{0\\} $ matches (c)**.\n\n' +
      '**(a)**: the positive divisors of 18 are $ 1, 2, 3, 6, 9, 18 $ — exactly **(iii)**.\n\n' +
      '**(b)**: $ x^2 - 9 = 0 \\Rightarrow x = 3, -3 $ — exactly **(iv)**.',
  }),
  b('reasoning_prompt', 8, {
    reasoning_type: 'logical',
    prompt: 'Is $ \\{1, 1, 2, 3\\} $ a valid way to describe the set with elements 1, 2 and 3?',
    options: ['Yes, and it has 4 elements', 'Yes, but it still has only 3 distinct elements', 'No — a set can never repeat an element'],
    reveal: 'It describes the same set as $ \\{1,2,3\\} $ — a set never repeats an element, so writing 1 twice changes nothing. The set still has exactly 3 elements.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 9, {
    pass_threshold: 0.67,
    questions: [
      q('Which of these is a well-defined collection, and therefore a set?',
        ['The collection of the five best novels ever written',
         'The collection of all natural numbers less than 100',
         'The collection of the most talented students in your school',
         'The collection of the tallest buildings in the world'],
        1,
        '“Natural numbers less than 100” has a fixed, checkable rule — anyone can test whether a number belongs. “Best”, “most talented” and “tallest… in the world” all depend on a cut-off or opinion nobody has fixed, so they are not well-defined.',
        1),
      q('$ B = \\{x : x \\text{ is a natural number less than 6}\\} $. Which is the correct roster form?',
        ['$ \\{1, 2, 3, 4, 5, 6\\} $', '$ \\{0, 1, 2, 3, 4, 5\\} $', '$ \\{1, 2, 3, 4, 5\\} $', '$ \\{6\\} $'],
        2,
        '“Less than 6” excludes 6 itself, and natural numbers start at 1 (not 0, by the NCERT convention used here), so the set is $ \\{1,2,3,4,5\\} $. Including 6 is the classic off-by-one slip.',
        1),
      q('For $ A = \\{a, e, i, o, u\\} $, which statement is correct?',
        ['$ p \\in A $', '$ e \\notin A $', '$ i \\in A $', '$ A $ has 4 elements'],
        2,
        '$ i $ is a vowel, so $ i \\in A $. $ p $ is a consonant ($ p \\notin A $), $ e $ IS in A (so “$ e \\notin A $” is false), and A has 5 elements, not 4.',
        1),
      q('Which pair below is the SAME set, just written two different ways?',
        ['$ \\{1, 2, 3\\} $ and $ \\{x : x \\text{ is a natural number} \\le 3\\} $',
         '$ \\{1, 2, 3\\} $ and $ \\{1, 2, 3, 4\\} $',
         '$ \\{x : x^2 = 4\\} $ and $ \\{2\\} $',
         '$ \\{a, b\\} $ and $ \\{a, b, c\\} $'],
        0,
        '$ \\{1,2,3\\} $ is exactly the roster form of “natural numbers $ \\le 3 $” — same set, two notations. $ x^2=4 $ actually gives $ \\{2, -2\\} $, not just $ \\{2\\} $ — a common slip that forgets the negative root.',
        2),
    ],
  }),
  b('text', 10, {
    markdown:
      'Some sets you will meet again and again have **nothing in them at all**, and some go on **forever**. ' +
      'Both are perfectly legal sets — next, we pin down exactly what that means.',
  }),
];

/* ── Page 2 — Empty, Finite, Infinite & Equal Sets (NCERT 1.3–1.5) ────────── */
const p2 = [
  b('image', 0, {
    src: '', alt: 'An empty glowing circle beside an overflowing one, and two identical circles side by side, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). Three glowing circles in a row: one completely empty (a faint ' +
      'outline only), one packed with countless glowing dots trailing off into the distance (suggesting ' +
      'infinity), and two identical smaller circles with matching dots beside each other. Violet and amber ' +
      'glow on a deep near-black background, elegant diagram style. No text.',
  }),
  b('callout', 1, {
    variant: 'fun_fact', title: 'Did You Know',
    markdown:
      'Try listing the set of your classmates who have personally travelled to Mars. That’s the **empty ' +
      'set** in real life — a perfectly well-defined set (you can check, with certainty, that nobody ' +
      'belongs), it simply has nothing in it.',
  }),
  b('text', 2, {
    markdown:
      'A set with **no elements at all** is called the **empty set** (or *null set*, or *void set*), written ' +
      '$ \\phi $ or $ \\{\\ \\} $. For example, $ \\{x : x \\text{ is a natural number}, 1 < x < 2\\} = \\phi $ — ' +
      'no natural number sits strictly between 1 and 2.',
  }),
  b('callout', 3, {
    variant: 'exam_tip', title: 'Quick Recap — the trap everyone falls into',
    markdown:
      '$ \\{0\\} $ is **not** empty — it contains the element $ 0 $. And $ \\{\\phi\\} $ is **not** empty ' +
      'either — it contains the element $ \\phi $ (the empty set, sitting *inside* a bigger set, still counts ' +
      'as one element). Only $ \\phi $ itself has zero elements.',
  }),
  b('text', 4, {
    markdown:
      'The number of distinct elements in a set $ S $ is its **cardinal number**, written $ n(S) $. If ' +
      '$ n(S) $ is a natural number (or $ S = \\phi $, so $ n(S) = 0 $), the set is **finite**; otherwise it ' +
      'is **infinite**. The set of natural numbers $ \\mathbb{N} $ is the classic infinite set — it never ' +
      'stops. You can’t write every element of an infinite set inside braces, so you write enough of the ' +
      'pattern to make it obvious, followed by three dots: $ \\{1, 2, 3, \\dots\\} $.',
  }),
  b('worked_example', 5, {
    label: 'NCERT Example 6', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      'State which of these sets are finite or infinite:\n\n' +
      '(i) $ \\{x \\in \\mathbb{N} : (x-1)(x-2) = 0\\} $  (ii) $ \\{x \\in \\mathbb{N} : x^2 = 4\\} $  ' +
      '(iii) $ \\{x \\in \\mathbb{N} : x \\text{ is prime}\\} $  (iv) $ \\{x \\in \\mathbb{N} : x \\text{ is odd}\\} $',
    solution:
      '(i) The equation gives $ x = 1 $ or $ 2 $, so the set is $ \\{1, 2\\} $ — **finite**.\n\n' +
      '(ii) $ x^2 = 4 $ gives $ x = 2 $ (rejecting $ -2 $, since $ x $ must be a natural number) — set $ = \\{2\\} $ — **finite**.\n\n' +
      '(iii) There are infinitely many prime numbers, so this set is **infinite**.\n\n' +
      '(iv) There are infinitely many odd natural numbers, so this set is **infinite** too.',
  }),
  b('text', 6, {
    markdown:
      'Two sets $ A $ and $ B $ are **equal** ($ A = B $) if they contain **exactly the same elements** — ' +
      'every element of $ A $ is in $ B $ and every element of $ B $ is in $ A $. Order and repetition are ' +
      'irrelevant: $ \\{1, 2, 3\\} = \\{3, 2, 1\\} = \\{2, 1, 3, 3\\} $ — all the same set.',
  }),
  b('worked_example', 7, {
    label: 'NCERT Example 7', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      'Find the pairs of equal sets, if any: $ A = \\{0\\} $, $ B = \\{x : x > 15 \\text{ and } x < 5\\} $, ' +
      '$ C = \\{x : x - 5 = 0\\} $, $ D = \\{x : x^2 = 25\\} $, $ E = \\{x : x \\text{ is an integral positive ' +
      'root of } x^2 - 2x - 15 = 0\\} $.',
    solution:
      'Work each set out first. $ A = \\{0\\} $. $ B = \\phi $ (no number is both $ >15 $ and $ <5 $). ' +
      '$ C = \\{5\\} $. $ D = \\{5, -5\\} $ (from $ x^2 = 25 $). For $ E $: $ x^2 - 2x - 15 = (x-5)(x+3) = 0 $ ' +
      'gives $ x = 5 $ or $ -3 $, and only the **positive** root counts, so $ E = \\{5\\} $.\n\n' +
      'Comparing all five: $ 0 \\in A $ but $ 0 \\notin $ any of $ C, D, E $, so $ A $ matches none of them. ' +
      '$ B $ is empty while none of the others are, so $ B $ matches nothing. That leaves $ C = \\{5\\} $ and ' +
      '$ E = \\{5\\} $ — **$ C = E $** is the only equal pair ($ D $ has the extra element $ -5 $, so ' +
      '$ D \\ne C $).',
  }),
  b('reasoning_prompt', 8, {
    reasoning_type: 'logical',
    prompt: 'Is $ \\{0\\} $ the same set as $ \\phi $ (the empty set)?',
    options: ['Yes — 0 basically means “nothing”', 'No — $ \\{0\\} $ has one element (the number 0); $ \\phi $ has none'],
    reveal: 'No. $ \\{0\\} $ contains the number 0 — that is one element, so $ n(\\{0\\}) = 1 $. The empty set contains nothing at all, so $ n(\\phi) = 0 $. Confusing the *number* zero with *nothing to list* is a very common trap.',
    difficulty_level: 1,
  }),
  b('inline_quiz', 9, {
    pass_threshold: 0.67,
    questions: [
      q('Which of these sets is empty?',
        ['$ \\{x : x \\in \\mathbb{N},\\ x < 5 \\text{ and } x > 7\\} $', '$ \\{0\\} $', '$ \\{\\phi\\} $', '$ \\{x : x \\in \\mathbb{N},\\ x < 1\\} $'],
        0,
        'No natural number can be both less than 5 and greater than 7 at once — that set has nothing in it, so it is $ \\phi $. $ \\{0\\} $ and $ \\{\\phi\\} $ each contain exactly one element, so neither is empty.',
        2),
      q('Which set below is infinite?',
        ['$ \\{1, 2, 3, \\dots, 100\\} $', 'the set of prime numbers less than 99', 'the set of positive integers greater than 100', 'the set of months of a year'],
        2,
        '“Greater than 100” never stops — it goes on forever, so it is infinite. Primes less than 99 is a fixed, countable (finite) list, and so are the other two options.',
        1),
      q('$ A = \\{2, 4, 6, 8, 10\\} $ and $ B = \\{x : x \\text{ is a positive even integer and } x \\le 10\\} $. Are $ A $ and $ B $ equal?',
        ['Yes — they contain exactly the same elements', 'No — B has more elements', 'No — order is different so they can’t be equal', 'Cannot be determined'],
        0,
        'B, written out, is exactly $ \\{2,4,6,8,10\\} $ — the same elements as A. Order never affects equality of sets, so A = B.',
        2),
      q('A set has $ n(S) = 0 $. What does that tell you?',
        ['S has one element, the number 0', 'S is the empty set', 'S is infinite', 'S cannot exist'],
        1,
        '$ n(S) $ counts distinct elements; $ n(S) = 0 $ means there are none to count — that is exactly the definition of the empty set, not a set containing the number 0.',
        1),
    ],
  }),
  b('text', 10, {
    markdown:
      'Now that you can tell sets apart, the next question is how one set can sit **inside** another — and ' +
      'that idea gives you a whole new way to describe a range of real numbers.',
  }),
];

/* ── Page 3 — Subsets & Intervals as Subsets of ℝ (NCERT 1.6, 1.6.1, 1.6.2) ─ */
const p3 = [
  b('image', 0, {
    src: '', alt: 'A small glowing circle nested fully inside a larger circle, and a number line with four interval types, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). On the left, a small glowing circle of dots sitting completely ' +
      'inside a larger circle of dots — the idea of a subset. On the right, a glowing horizontal number line ' +
      'with a thick violet segment between two marked points, one endpoint an open circle and the other a ' +
      'filled circle — the idea of an interval. Amber and violet glow on a deep near-black background, ' +
      'elegant diagram style. No text beyond the number-line tick marks.',
  }),
  b('text', 1, {
    markdown:
      'A set $ A $ is a **subset** of a set $ B $ (written $ A \\subset B $) if **every** element of $ A $ is ' +
      'also an element of $ B $. In symbols: $ A \\subset B $ if $ a \\in A \\Rightarrow a \\in B $.\n\n' +
      'Two facts that follow immediately: **every set is a subset of itself** ($ A \\subset A $), and the ' +
      '**empty set is a subset of every set** ($ \\phi \\subset A $, for any $ A $ — there’s nothing in ' +
      '$ \\phi $ that could fail to be in $ A $).\n\n' +
      'If $ A \\subset B $ but $ A \\ne B $ (something in $ B $ is missing from $ A $), $ A $ is a **proper ' +
      'subset** of $ B $. A set with exactly one element, like $ \\{a\\} $, is called a **singleton set**.',
  }),
  b('worked_example', 2, {
    label: 'NCERT Example 9', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      'Consider the sets $ \\phi $, $ A = \\{1, 3\\} $, $ B = \\{1, 5, 9\\} $, $ C = \\{1, 3, 5, 7, 9\\} $. ' +
      'Insert $ \\subset $ or $ \\not\\subset $ between: (i) $ \\phi \\dots B $ (ii) $ A \\dots B $ (iii) ' +
      '$ A \\dots C $ (iv) $ B \\dots C $.',
    solution:
      '(i) $ \\phi \\subset B $ — the empty set is a subset of every set, no exceptions.\n\n' +
      '(ii) $ A \\not\\subset B $ — because $ 3 \\in A $ but $ 3 \\notin B $. One missing element is enough to break it.\n\n' +
      '(iii) $ A \\subset C $ — both $ 1 $ and $ 3 $ are in $ C $.\n\n' +
      '(iv) $ B \\subset C $ — each of $ 1, 5, 9 $ is in $ C $.',
  }),
  b('worked_example', 3, {
    label: 'NCERT Example 11', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem:
      'Let $ A, B, C $ be three sets. If $ A \\in B $ and $ B \\subset C $, is it true that $ A \\subset C $? ' +
      'If not, give an example.',
    solution:
      '**No.** $ A \\in B $ means $ A $ is one *element* of $ B $ — not that $ A $’s elements sit inside $ B $. ' +
      'That is a completely different relationship from $ A \\subset B $, and the chain can break.\n\n' +
      'Example: let $ A = \\{1\\} $, $ B = \\{\\{1\\}, 2\\} $, $ C = \\{\\{1\\}, 2, 3\\} $. Here $ A \\in B $ ' +
      '(since $ \\{1\\} $ is literally one of the two elements of $ B $) and $ B \\subset C $. But is ' +
      '$ A \\subset C $? That would need $ 1 \\in C $ — and $ 1 $ is **not** an element of $ C $ (only ' +
      '$ \\{1\\}, 2, 3 $ are). So $ A \\not\\subset C $: **belonging to** a set is not the same as **being a ' +
      'subset of** it.',
  }),
  b('text', 4, {
    markdown:
      'The number sets from page 1 nest inside each other: $ \\mathbb{N} \\subset \\mathbb{Z} \\subset ' +
      '\\mathbb{Q} \\subset \\mathbb{R} $. The **irrational numbers** $ \\mathbb{T} $ (real numbers that ' +
      'are not rational, like $ \\sqrt{2} $ and $ \\pi $) are also a subset of $ \\mathbb{R} $, but ' +
      '$ \\mathbb{N} \\not\\subset \\mathbb{T} $ — no natural number is irrational.',
  }),
  b('text', 5, {
    markdown:
      'One especially useful family of subsets of $ \\mathbb{R} $: **intervals**. For real numbers ' +
      '$ a < b $, an interval is the set of every real number between them — and whether the endpoints ' +
      '$ a, b $ themselves are included is exactly what the notation tells you.',
  }),
  b('table', 6, {
    caption: 'The four interval types',
    headers: ['Name', 'Notation', 'Set-builder form', 'Endpoints'],
    rows: [
      ['Open', '$ (a, b) $', '$ \\{x : a < x < b\\} $', 'both excluded'],
      ['Closed', '$ [a, b] $', '$ \\{x : a \\le x \\le b\\} $', 'both included'],
      ['Open–closed', '$ (a, b] $', '$ \\{x : a < x \\le b\\} $', '$ a $ excluded, $ b $ included'],
      ['Closed–open', '$ [a, b) $', '$ \\{x : a \\le x < b\\} $', '$ a $ included, $ b $ excluded'],
    ],
  }),
  b('image', 7, {
    src: '', alt: 'Four number lines each showing a different interval type with open or filled circles at the endpoints',
    caption: 'The four interval types on the real line — a filled dot means “included”, a hollow dot means “excluded”.',
    width: 'full', aspect_ratio: '21:9',
    generation_prompt:
      'A clean technical diagram on a deep near-black background: four horizontal number lines stacked ' +
      'vertically, each with two labelled points a and b joined by a thick violet segment. Line 1: hollow ' +
      'circles at both a and b (open interval). Line 2: filled circles at both a and b (closed interval). ' +
      'Line 3: hollow circle at a, filled circle at b. Line 4: filled circle at a, hollow circle at b. Amber ' +
      'tick marks, sky-blue axis lines, minimalist textbook-figure style, no other text.',
  }),
  b('callout', 8, {
    variant: 'exam_tip', title: 'Quick Recap',
    markdown:
      'The **length** of any of these intervals is simply $ b - a $. An interval contains **infinitely many ' +
      'points** even when it looks short — between any two real numbers there is always another one.',
  }),
  b('reasoning_prompt', 9, {
    reasoning_type: 'quantitative',
    prompt: 'Write $ \\{x : x \\in \\mathbb{R},\\ -5 < x \\le 7\\} $ as an interval.',
    options: ['$ (-5, 7) $', '$ [-5, 7] $', '$ (-5, 7] $', '$ [-5, 7) $'],
    reveal: 'The strict $ < $ at $ -5 $ means it is excluded (round bracket); the $ \\le $ at 7 means it is included (square bracket). So the interval is $ (-5, 7] $.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 10, {
    pass_threshold: 0.67,
    questions: [
      q('If $ A = \\{1, 2\\} $ and $ B = \\{1, 2, 3\\} $, which is true?',
        ['$ A \\subset B $ and $ A \\ne B $, so A is a proper subset of B', '$ B \\subset A $', '$ A = B $', 'Neither is a subset of the other'],
        0,
        'Every element of A (1 and 2) is in B, and B has the extra element 3, so $ A \\subset B $ properly. B is not a subset of A, since $ 3 \\notin A $.',
        1),
      q('Which set is $ \\mathbb{N} $ NOT a subset of?',
        ['$ \\mathbb{Z} $', '$ \\mathbb{Q} $', '$ \\mathbb{R} $', 'the irrational numbers $ \\mathbb{T} $'],
        3,
        'Every natural number is an integer, a rational number and a real number — but no natural number is irrational (they’re all rational), so $ \\mathbb{N} \\not\\subset \\mathbb{T} $.',
        2),
      q('The interval $ [3, 4) $ means…',
        ['$ 3 < x < 4 $', '$ 3 \\le x \\le 4 $', '$ 3 \\le x < 4 $', '$ 3 < x \\le 4 $'],
        2,
        'A square bracket at 3 includes it; a round bracket at 4 excludes it — so $ [3,4) = \\{x : 3 \\le x < 4\\} $.',
        1),
      q('For any set $ A $, which statement is always true?',
        ['$ \\phi \\subset A $', '$ A \\subset \\phi $', '$ A $ has no subsets', '$ \\phi $ has one element'],
        0,
        'The empty set is a subset of every set — there is nothing in $ \\phi $ that could fail to belong to $ A $. The empty set itself has zero elements, and only when $ A = \\phi $ does $ A \\subset \\phi $ hold.',
        1),
    ],
  }),
  b('text', 11, {
    markdown:
      'Subsets let you compare two *specific* sets. Sometimes you want to know **every possible subset at ' +
      'once**, and you also need one “big picture” set to hold a whole discussion inside. Meet both next.',
  }),
];

/* ── Page 4 — Power Set & Universal Set (NCERT 1.7 + flagged supplement) ──── */
const p4 = [
  b('image', 0, {
    src: '', alt: 'A set branching into every one of its possible subsets, arranged like a family tree, dark background',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Ultra-wide cinematic banner (16:5). A small glowing set of three dots at the top, branching downward ' +
      'into every possible smaller grouping of those dots — a family-tree arrangement of subsets, ending in ' +
      'a single empty circle at the bottom. Violet and amber glow on a deep near-black background, elegant ' +
      'diagram style. No text.',
  }),
  b('text', 1, {
    markdown:
      'In any particular discussion, every set you use is usually a subset of one broad, background set. ' +
      'That background set is called the **universal set**, denoted $ U $. Studying whole numbers? $ U $ ' +
      'might be $ \\mathbb{N} $ or $ \\mathbb{Z} $. Studying triangles? $ U $ might be the set of all triangles ' +
      'in a plane. There isn’t one fixed “correct” universal set — you pick the one that comfortably contains ' +
      'everything the discussion needs.',
  }),
  b('callout', 2, {
    variant: 'note', title: 'Not in the current NCERT print',
    markdown:
      'The next idea — the **power set** — is not a numbered section in this edition of the textbook (it was ' +
      'part of an older syllabus). It is included here anyway because it is standard, widely examined ' +
      'material, but the worked example below is **not** an NCERT example — it’s built with its own numbers.',
  }),
  b('text', 3, {
    markdown:
      'The **power set** of a set $ A $, written $ P(A) $, is the set of **all possible subsets of $ A $** — ' +
      'including $ \\phi $ itself and $ A $ itself.\n\n' +
      'If $ A $ has $ n $ elements, then $ A $ has exactly $ 2^{n} $ subsets — so $ n\\big(P(A)\\big) = 2^{n} $. ' +
      'The reason is a simple counting argument: for each element, you independently decide “in” or “out” of a ' +
      'given subset, and $ n $ independent yes/no choices give $ 2^n $ outcomes.',
  }),
  b('latex_block', 4, {
    latex: 'n\\big(P(A)\\big) = 2^{\\,n(A)}',
    label: 'Size of a power set', highlight: true,
  }),
  b('worked_example', 5, {
    label: 'Listing a power set', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
    problem: 'Let $ A = \\{1, 2, 3\\} $. Write out $ P(A) $, and check that it has $ 2^3 = 8 $ elements.',
    solution:
      'List every subset by size, smallest to largest:\n\n' +
      '- **0 elements:** $ \\phi $\n' +
      '- **1 element:** $ \\{1\\},\\ \\{2\\},\\ \\{3\\} $\n' +
      '- **2 elements:** $ \\{1,2\\},\\ \\{1,3\\},\\ \\{2,3\\} $\n' +
      '- **3 elements:** $ \\{1,2,3\\} $ (the whole set, itself a subset of itself)\n\n' +
      'Counting them: $ 1 + 3 + 3 + 1 = 8 = 2^3 $. ✓',
  }),
  b('callout', 6, {
    variant: 'exam_tip', title: 'Quick Recap — a favourite trap',
    markdown:
      '$ P(\\phi) = \\{\\phi\\} $ — the power set of the empty set has **one** element (the empty set itself), ' +
      'not zero. Check with the formula: $ n(\\phi) = 0 $, so $ n(P(\\phi)) = 2^0 = 1 $. ✓\n\n' +
      'Also keep straight: $ 2 \\in A $ says 2 is an *element* of $ A $; $ \\{2\\} \\in P(A) $ says $ \\{2\\} $ ' +
      'is one of the *subsets* — a different kind of statement entirely.',
  }),
  b('reasoning_prompt', 7, {
    reasoning_type: 'quantitative',
    prompt: 'If $ n(A) = 4 $, how many elements does $ P(A) $ have?',
    options: ['8', '16', '4', '12'],
    reveal: '$ n(P(A)) = 2^{n(A)} = 2^4 = 16 $. Doubling the element count (giving 8) is the common slip — the count of subsets doubles for every *extra element*, which compounds multiplicatively, not additively.',
    difficulty_level: 2,
  }),
  b('inline_quiz', 8, {
    pass_threshold: 0.67,
    questions: [
      q('$ P(\\phi) $, the power set of the empty set, equals…',
        ['$ \\phi $', '$ \\{\\phi\\} $', '$ \\{0\\} $', 'It doesn’t exist'],
        1,
        'The empty set has exactly one subset — itself, $ \\phi $ — so $ P(\\phi) = \\{\\phi\\} $, a set with one element. Writing $ P(\\phi) = \\phi $ forgets that “the set of all subsets” is never itself empty, since $ \\phi $ is always one valid subset.',
        2),
      q('For $ A = \\{a, b\\} $, which of these is P(A)?',
        ['$ \\{a, b\\} $', '$ \\{\\phi, \\{a\\}, \\{b\\}, \\{a,b\\}\\} $', '$ \\{\\{a\\}, \\{b\\}\\} $', '$ \\{a, b, \\phi\\} $'],
        1,
        '$ P(A) $ must list every subset, including $ \\phi $ and $ A $ itself — that’s all 4 ($ = 2^2 $) of them. Option (c) forgets $ \\phi $ and $ A $ itself.',
        1),
      q('For the universal set of “all triangles in a plane”, which of these could be a sensible choice of $ A \\subset U $?',
        ['The set of all right triangles', 'The set of all rivers in India', 'The set of all even integers', 'The number 5'],
        0,
        'A universal set only needs to contain every set actually used in the discussion — right triangles are a natural subset of “all triangles”. The other options belong to entirely unrelated universes.',
        1),
      q('If $ n(A) = 6 $, what is $ n(P(A)) $?',
        ['12', '36', '64', '6'],
        2,
        '$ n(P(A)) = 2^{6} = 64 $. Squaring (36) or doubling (12) are both common but wrong shortcuts — it is always a power of 2.',
        2),
    ],
  }),
  b('text', 9, {
    markdown:
      'Reading “$ 2^n $ subsets” off a formula is one thing; **seeing** how sets sit inside a universal set, ' +
      'and overlap with each other, is another. That picture has a name — the Venn diagram.',
  }),
];

(async () => {
  await withDb(async (db) => {
    const bookId = await ensureBookAndChapter(db);
    await insertPages(db, bookId, [
      { slug: 'sets-opener', title: 'Sets',
        subtitle: 'The language underneath every other topic in this book — starting from a well-defined collection.',
        page_number: 0, page_type: 'chapter_opener', blocks: p0 },
      { slug: 'sets-representations', title: 'Sets and Their Representations',
        subtitle: 'Roster form and set-builder form — two ways to write the same set.',
        page_number: 1, blocks: p1 },
      { slug: 'empty-finite-infinite-equal-sets', title: 'Empty, Finite, Infinite & Equal Sets',
        subtitle: 'Sets with nothing in them, sets that never end, and when two sets are really the same set.',
        page_number: 2, blocks: p2 },
      { slug: 'subsets-and-intervals', title: 'Subsets & Intervals as Subsets of ℝ',
        subtitle: 'When one set sits entirely inside another — and the interval notation built on that idea.',
        page_number: 3, blocks: p3 },
      { slug: 'power-set-and-universal-set', title: 'Power Set & Universal Set',
        subtitle: 'Every possible subset at once, and the one big set everything else lives inside.',
        page_number: 4, blocks: p4 },
    ]);
  });
  console.log('pages 0–4 DONE (unpublished).');
})().catch((e) => { console.error(e); process.exit(1); });
