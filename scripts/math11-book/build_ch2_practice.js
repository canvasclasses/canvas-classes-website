'use strict';
/* Class 11 Math · Ch.2 Relations and Functions — the end-of-chapter PRACTICE page.
   A single practice_bank block holding ALL 36 NCERT Ch.2 exercises (2.1, 2.2, 2.3
   and the Miscellaneous Exercise), sourced verbatim from the NCERT PDF, regrouped
   from the textbook's running order into 5 revision THEMES, each question given a
   full worked solution in the book's plain teacher voice (the solution IS the
   product — a student who gets a question wrong learns the whole idea from it).
   Additive + idempotent (skip-if-exists by slug). published:false.
   Run: node scripts/math11-book/build_ch2_practice.js */
const { b, ensureBookAndChapter, insertPages, withDb } = require('./_book');
const { v4: uuidv4 } = require('uuid');

/* item helpers — every id is a fresh uuid */
const num = (source_label, prompt, answer, solution) =>
  ({ id: uuidv4(), kind: 'numerical', source: 'ncert_exercise', source_label, prompt, answer, solution });
const sec = (title, blurb, items) => ({ id: uuidv4(), title, blurb, items });

/* ── Section 1 — Cartesian products & ordered pairs (NCERT Exercise 2.1) ──── */
const s1 = sec(
  'Cartesian products & ordered pairs',
  'Ex 2.1 — pairing two sets, counting the pairs, and reading a product backwards.',
  [
    num('NCERT Ex 2.1 · Q1',
      'If $ \\left(\\frac{x}{3} + 1,\\ y - \\frac{2}{3}\\right) = \\left(\\frac{5}{3},\\ \\frac{1}{3}\\right) $, find the values of $ x $ and $ y $.',
      '$ x = 2,\\ y = 1 $',
      'Two ordered pairs are equal only when the first parts match **and** the second parts match. So compare them slot by slot.\n\n' +
      'First slots: $ \\frac{x}{3} + 1 = \\frac{5}{3} $, so $ \\frac{x}{3} = \\frac{5}{3} - 1 = \\frac{2}{3} $, giving $ x = 2 $.\n\n' +
      'Second slots: $ y - \\frac{2}{3} = \\frac{1}{3} $, so $ y = \\frac{1}{3} + \\frac{2}{3} = 1 $.\n\n' +
      'So $ x = 2 $ and $ y = 1 $.'),
    num('NCERT Ex 2.1 · Q2',
      'If the set A has 3 elements and the set B $ = \\{3, 4, 5\\} $, then find the number of elements in $ (A \\times B) $.',
      '9',
      'Every element of A can be paired with every element of B, so the count just multiplies: $ n(A \\times B) = n(A) \\times n(B) $.\n\n' +
      'Here $ n(A) = 3 $ and $ n(B) = 3 $, so $ n(A \\times B) = 3 \\times 3 = 9 $.'),
    num('NCERT Ex 2.1 · Q3',
      'If G $ = \\{7, 8\\} $ and H $ = \\{5, 4, 2\\} $, find $ G \\times H $ and $ H \\times G $.',
      '$ G \\times H $ has 6 pairs; $ H \\times G $ has 6 pairs (different pairs)',
      'For $ G \\times H $ the first slot comes from G, the second from H:\n\n' +
      '$ G \\times H = \\{(7,5), (7,4), (7,2), (8,5), (8,4), (8,2)\\} $.\n\n' +
      'For $ H \\times G $ swap the roles — first slot from H, second from G:\n\n' +
      '$ H \\times G = \\{(5,7), (5,8), (4,7), (4,8), (2,7), (2,8)\\} $.\n\n' +
      'Both have 6 pairs, but the pairs themselves are different — order matters, so $ G \\times H \\ne H \\times G $.'),
    num('NCERT Ex 2.1 · Q4',
      'State whether each statement is true or false. If false, rewrite it correctly.\n\n' +
      '(i) If P $ = \\{m, n\\} $ and Q $ = \\{n, m\\} $, then $ P \\times Q = \\{(m,n), (n,m)\\} $.\n\n' +
      '(ii) If A and B are non-empty sets, then $ A \\times B $ is a non-empty set of ordered pairs $ (x, y) $ such that $ x \\in A $ and $ y \\in B $.\n\n' +
      '(iii) If A $ = \\{1, 2\\} $, B $ = \\{3, 4\\} $, then $ A \\times (B \\cap \\phi) = \\phi $.',
      '(i) False  (ii) True  (iii) True',
      '**(i) False.** P and Q are actually the same set $ \\{m, n\\} $, so $ P \\times Q $ must list **all four** pairings, not two. Correct statement: $ P \\times Q = \\{(m,m), (m,n), (n,m), (n,n)\\} $.\n\n' +
      '**(ii) True.** That is exactly the definition of the Cartesian product, and if both sets have elements the product cannot be empty.\n\n' +
      '**(iii) True.** $ B \\cap \\phi = \\phi $ (nothing is common with the empty set), and pairing anything with the empty set gives the empty set: $ A \\times \\phi = \\phi $.'),
    num('NCERT Ex 2.1 · Q5',
      'If A $ = \\{-1, 1\\} $, find $ A \\times A \\times A $.',
      '8 ordered triplets',
      'This is the set of all **triplets** $ (a, b, c) $ where each of $ a, b, c $ is chosen from $ \\{-1, 1\\} $. With 2 choices in each of 3 slots you get $ 2 \\times 2 \\times 2 = 8 $ triplets:\n\n' +
      '$ A \\times A \\times A = \\{(-1,-1,-1),\\ (-1,-1,1),\\ (-1,1,-1),\\ (-1,1,1),\\ (1,-1,-1),\\ (1,-1,1),\\ (1,1,-1),\\ (1,1,1)\\} $.'),
    num('NCERT Ex 2.1 · Q6',
      'If $ A \\times B = \\{(a,x), (a,y), (b,x), (b,y)\\} $, find A and B.',
      'A $ = \\{a, b\\} $, B $ = \\{x, y\\} $',
      'In a product $ A \\times B $, the **first** entries of the pairs are the elements of A, and the **second** entries are the elements of B.\n\n' +
      'First entries here: $ a, a, b, b $ → so A $ = \\{a, b\\} $.\n\n' +
      'Second entries: $ x, y, x, y $ → so B $ = \\{x, y\\} $.'),
    num('NCERT Ex 2.1 · Q7',
      'Let A $ = \\{1, 2\\} $, B $ = \\{1, 2, 3, 4\\} $, C $ = \\{5, 6\\} $ and D $ = \\{5, 6, 7, 8\\} $. Verify that\n\n' +
      '(i) $ A \\times (B \\cap C) = (A \\times B) \\cap (A \\times C) $.\n\n' +
      '(ii) $ A \\times C $ is a subset of $ B \\times D $.',
      'Both statements hold',
      '**(i)** B and C share nothing, so $ B \\cap C = \\phi $, which makes the left side $ A \\times \\phi = \\phi $.\n\n' +
      'On the right, the pairs of $ A \\times B $ have second entries from $ \\{1,2,3,4\\} $, while those of $ A \\times C $ have second entries from $ \\{5,6\\} $ — no pair can be in both, so the intersection is also $ \\phi $. Left $ = $ right. ✓\n\n' +
      '**(ii)** $ A \\times C = \\{(1,5), (1,6), (2,5), (2,6)\\} $. Check each against $ B \\times D $: every first entry $ (1, 2) $ lives in B, and every second entry $ (5, 6) $ lives in D. So each pair belongs to $ B \\times D $ — hence $ A \\times C \\subseteq B \\times D $. ✓'),
    num('NCERT Ex 2.1 · Q8',
      'Let A $ = \\{1, 2\\} $ and B $ = \\{3, 4\\} $. Write $ A \\times B $. How many subsets will $ A \\times B $ have? List them.',
      '$ A \\times B $ has 4 pairs → $ 2^4 = 16 $ subsets',
      '$ A \\times B = \\{(1,3), (1,4), (2,3), (2,4)\\} $ — a set of **4** elements.\n\n' +
      'A set of $ n $ elements has $ 2^n $ subsets, so here there are $ 2^4 = 16 $ subsets.\n\n' +
      'Writing $ p = (1,3),\\ q = (1,4),\\ r = (2,3),\\ s = (2,4) $, the 16 subsets are:\n\n' +
      '$ \\phi $; the four singletons $ \\{p\\}, \\{q\\}, \\{r\\}, \\{s\\} $; the six pairs $ \\{p,q\\}, \\{p,r\\}, \\{p,s\\}, \\{q,r\\}, \\{q,s\\}, \\{r,s\\} $; the four triples $ \\{p,q,r\\}, \\{p,q,s\\}, \\{p,r,s\\}, \\{q,r,s\\} $; and the whole set $ \\{p,q,r,s\\} $.'),
    num('NCERT Ex 2.1 · Q9',
      'Let A and B be two sets such that $ n(A) = 3 $ and $ n(B) = 2 $. If $ (x,1), (y,2), (z,1) $ are in $ A \\times B $, find A and B, where $ x, y $ and $ z $ are distinct elements.',
      'A $ = \\{x, y, z\\} $, B $ = \\{1, 2\\} $',
      'First entries of pairs always come from A. The given pairs have first entries $ x, y, z $, which are 3 distinct elements — and A has exactly 3 elements — so A $ = \\{x, y, z\\} $.\n\n' +
      'Second entries come from B. Here they are $ 1, 2, 1 $, i.e. the values $ 1 $ and $ 2 $, and B has 2 elements, so B $ = \\{1, 2\\} $.'),
    num('NCERT Ex 2.1 · Q10',
      'The Cartesian product $ A \\times A $ has 9 elements among which are found $ (-1, 0) $ and $ (0, 1) $. Find the set A and the remaining elements of $ A \\times A $.',
      'A $ = \\{-1, 0, 1\\} $; 7 remaining pairs',
      '$ n(A \\times A) = n(A)^2 = 9 $, so $ n(A) = 3 $.\n\n' +
      'The pairs $ (-1, 0) $ and $ (0, 1) $ tell us the elements $ -1, 0 $ and $ 1 $ all belong to A. That is already 3 elements, so A $ = \\{-1, 0, 1\\} $.\n\n' +
      'Now $ A \\times A $ is all 9 pairs from these three numbers. Removing the two we were given, the **remaining 7** are:\n\n' +
      '$ (-1,-1),\\ (-1,1),\\ (0,-1),\\ (0,0),\\ (1,-1),\\ (1,0),\\ (1,1) $.'),
  ],
);

/* ── Section 2 — Relations: roster form, domain & range (NCERT Exercise 2.2) ─ */
const s2 = sec(
  'Relations: roster form, domain & range',
  'Ex 2.2 — pick out the pairs a rule allows, then read off the domain and range.',
  [
    num('NCERT Ex 2.2 · Q1',
      'Let A $ = \\{1, 2, 3, \\dots, 14\\} $. Define a relation R from A to A by $ R = \\{(x, y) : 3x - y = 0,\\ \\text{where } x, y \\in A\\} $. Write down its domain, codomain and range.',
      'Domain $ = \\{1,2,3,4\\} $, codomain $ = A $, range $ = \\{3,6,9,12\\} $',
      'The rule $ 3x - y = 0 $ means $ y = 3x $. Keep only the pairs where **both** $ x $ and $ y = 3x $ stay inside A $ = \\{1, \\dots, 14\\} $:\n\n' +
      '$ x = 1 \\to y = 3,\\ \\ x = 2 \\to 6,\\ \\ x = 3 \\to 9,\\ \\ x = 4 \\to 12 $. At $ x = 5 $, $ y = 15 $ leaves A, so stop.\n\n' +
      '$ R = \\{(1,3), (2,6), (3,9), (4,12)\\} $.\n\n' +
      '**Domain** (first entries) $ = \\{1, 2, 3, 4\\} $. **Range** (second entries) $ = \\{3, 6, 9, 12\\} $. The **codomain** is the whole arrival set A $ = \\{1, 2, \\dots, 14\\} $.'),
    num('NCERT Ex 2.2 · Q2',
      'Define a relation R on the set N of natural numbers by $ R = \\{(x, y) : y = x + 5,\\ x \\text{ is a natural number less than } 4;\\ x, y \\in N\\} $. Depict this relationship using roster form. Write down the domain and the range.',
      '$ R = \\{(1,6), (2,7), (3,8)\\} $; domain $ = \\{1,2,3\\} $, range $ = \\{6,7,8\\} $',
      'The allowed inputs are natural numbers less than 4, i.e. $ x = 1, 2, 3 $. For each, $ y = x + 5 $:\n\n' +
      '$ x = 1 \\to y = 6,\\ \\ x = 2 \\to 7,\\ \\ x = 3 \\to 8 $.\n\n' +
      '$ R = \\{(1,6), (2,7), (3,8)\\} $. **Domain** $ = \\{1, 2, 3\\} $, **range** $ = \\{6, 7, 8\\} $.'),
    num('NCERT Ex 2.2 · Q3',
      'A $ = \\{1, 2, 3, 5\\} $ and B $ = \\{4, 6, 9\\} $. Define a relation R from A to B by $ R = \\{(x, y) : \\text{the difference between } x \\text{ and } y \\text{ is odd};\\ x \\in A, y \\in B\\} $. Write R in roster form.',
      '$ R = \\{(1,4), (1,6), (2,9), (3,4), (3,6), (5,4), (5,6)\\} $',
      'For every $ x $ in A, test each $ y $ in B and keep the pair only when $ |x - y| $ is odd (odd minus even, or even minus odd):\n\n' +
      '$ x = 1 $: $ |1-4| = 3 $ ✓, $ |1-6| = 5 $ ✓, $ |1-9| = 8 $ ✗\n\n' +
      '$ x = 2 $: $ |2-4| = 2 $ ✗, $ |2-6| = 4 $ ✗, $ |2-9| = 7 $ ✓\n\n' +
      '$ x = 3 $: $ |3-4| = 1 $ ✓, $ |3-6| = 3 $ ✓, $ |3-9| = 6 $ ✗\n\n' +
      '$ x = 5 $: $ |5-4| = 1 $ ✓, $ |5-6| = 1 $ ✓, $ |5-9| = 4 $ ✗\n\n' +
      '$ R = \\{(1,4), (1,6), (2,9), (3,4), (3,6), (5,4), (5,6)\\} $.'),
    num('NCERT Ex 2.2 · Q4',
      'The figure (Fig 2.7) shows a relationship between the sets P $ = \\{5, 6, 7\\} $ and Q $ = \\{3, 4, 5\\} $, with arrows $ 5 \\to 3 $, $ 6 \\to 4 $, $ 7 \\to 5 $. Write this relation (i) in set-builder form (ii) in roster form. What is its domain and range?',
      'Rule $ y = x - 2 $; $ R = \\{(5,3), (6,4), (7,5)\\} $; domain $ = \\{5,6,7\\} $, range $ = \\{3,4,5\\} $',
      'Each arrow drops the input by 2: $ 5 \\to 3 $, $ 6 \\to 4 $, $ 7 \\to 5 $ — so the rule is $ y = x - 2 $.\n\n' +
      '**(i) Set-builder:** $ R = \\{(x, y) : y = x - 2,\\ x \\in P\\} $.\n\n' +
      '**(ii) Roster:** $ R = \\{(5,3), (6,4), (7,5)\\} $.\n\n' +
      '**Domain** $ = \\{5, 6, 7\\} $, **range** $ = \\{3, 4, 5\\} $.'),
    num('NCERT Ex 2.2 · Q5',
      'Let A $ = \\{1, 2, 3, 4, 6\\} $. Let R be the relation on A defined by $ \\{(a, b) : a, b \\in A,\\ b \\text{ is exactly divisible by } a\\} $. (i) Write R in roster form. (ii) Find the domain of R. (iii) Find the range of R.',
      'Domain $ = \\{1,2,3,4,6\\} $, range $ = \\{1,2,3,4,6\\} $',
      'For each $ a $, list the $ b $ in A that $ a $ divides exactly:\n\n' +
      '$ a = 1 $: divides everything → $ (1,1), (1,2), (1,3), (1,4), (1,6) $\n\n' +
      '$ a = 2 $: $ (2,2), (2,4), (2,6) $\n\n' +
      '$ a = 3 $: $ (3,3), (3,6) $\n\n' +
      '$ a = 4 $: $ (4,4) $\n\n' +
      '$ a = 6 $: $ (6,6) $\n\n' +
      '**(i)** $ R = \\{(1,1),(1,2),(1,3),(1,4),(1,6),(2,2),(2,4),(2,6),(3,3),(3,6),(4,4),(6,6)\\} $.\n\n' +
      '**(ii) Domain** (the $ a $ values used) $ = \\{1, 2, 3, 4, 6\\} $.\n\n' +
      '**(iii) Range** (the $ b $ values reached) $ = \\{1, 2, 3, 4, 6\\} $.'),
    num('NCERT Ex 2.2 · Q6',
      'Determine the domain and range of the relation R defined by $ R = \\{(x,\\ x + 5) : x \\in \\{0, 1, 2, 3, 4, 5\\}\\} $.',
      'Domain $ = \\{0,1,2,3,4,5\\} $, range $ = \\{5,6,7,8,9,10\\} $',
      'The inputs are given directly: $ x \\in \\{0, 1, 2, 3, 4, 5\\} $ — that is the **domain**.\n\n' +
      'Each output is $ x + 5 $: $ 0 \\to 5,\\ 1 \\to 6,\\ 2 \\to 7,\\ 3 \\to 8,\\ 4 \\to 9,\\ 5 \\to 10 $. So the **range** $ = \\{5, 6, 7, 8, 9, 10\\} $.'),
    num('NCERT Ex 2.2 · Q7',
      'Write the relation $ R = \\{(x,\\ x^3) : x \\text{ is a prime number less than } 10\\} $ in roster form.',
      '$ R = \\{(2,8), (3,27), (5,125), (7,343)\\} $',
      'The primes below 10 are $ 2, 3, 5, 7 $. Cube each one:\n\n' +
      '$ 2^3 = 8,\\ \\ 3^3 = 27,\\ \\ 5^3 = 125,\\ \\ 7^3 = 343 $.\n\n' +
      '$ R = \\{(2,8), (3,27), (5,125), (7,343)\\} $.'),
    num('NCERT Ex 2.2 · Q8',
      'Let A $ = \\{x, y, z\\} $ and B $ = \\{1, 2\\} $. Find the number of relations from A to B.',
      '64',
      'A relation from A to B is any **subset** of $ A \\times B $. First count $ A \\times B $: $ n(A) \\times n(B) = 3 \\times 2 = 6 $ pairs.\n\n' +
      'A 6-element set has $ 2^6 $ subsets, so the number of relations is $ 2^6 = 64 $.'),
    num('NCERT Ex 2.2 · Q9',
      'Let R be the relation on Z defined by $ R = \\{(a, b) : a, b \\in Z,\\ a - b \\text{ is an integer}\\} $. Find the domain and range of R.',
      'Domain $ = Z $, range $ = Z $',
      'For any two integers $ a $ and $ b $, the difference $ a - b $ is **always** an integer. So the rule never rejects a pair — every integer can appear as a first entry and every integer as a second entry.\n\n' +
      'Hence R is the whole of $ Z \\times Z $: **domain** $ = Z $ and **range** $ = Z $.'),
  ],
);

/* ── Section 3 — When is a relation a function? (Ex 2.3 Q1 + Misc) ────────── */
const s3 = sec(
  'When is a relation a function?',
  'Ex 2.3 & Miscellaneous — the one-output-per-input test, and checking relation properties.',
  [
    num('NCERT Ex 2.3 · Q1',
      'Which of the following relations are functions? Give reasons. If it is a function, determine its domain and range.\n\n' +
      '(i) $ \\{(2,1), (5,1), (8,1), (11,1), (14,1), (17,1)\\} $\n\n' +
      '(ii) $ \\{(2,1), (4,2), (6,3), (8,4), (10,5), (12,6), (14,7)\\} $\n\n' +
      '(iii) $ \\{(1,3), (1,5), (2,5)\\} $',
      '(i) function  (ii) function  (iii) not a function',
      'A relation is a function when **no input is repeated** (each first element has exactly one partner).\n\n' +
      '**(i)** First elements $ 2, 5, 8, 11, 14, 17 $ are all different → **function**. Domain $ = \\{2, 5, 8, 11, 14, 17\\} $, range $ = \\{1\\} $.\n\n' +
      '**(ii)** First elements $ 2, 4, 6, 8, 10, 12, 14 $ all different → **function**. Domain $ = \\{2, 4, 6, 8, 10, 12, 14\\} $, range $ = \\{1, 2, 3, 4, 5, 6, 7\\} $.\n\n' +
      '**(iii)** The input $ 1 $ appears twice — once with $ 3 $ and once with $ 5 $. One input, two outputs → **not a function**.'),
    num('NCERT Misc · Q1',
      'The relation $ f $ is defined by $ f(x) = \\begin{cases} x^2, & 0 \\le x \\le 3 \\\\ 3x, & 3 \\le x \\le 10 \\end{cases} $ and the relation $ g $ is defined by $ g(x) = \\begin{cases} x^2, & 0 \\le x \\le 2 \\\\ 3x, & 2 \\le x \\le 10 \\end{cases} $. Show that $ f $ is a function and $ g $ is not a function.',
      '$ f $ is a function; $ g $ is not (clashes at $ x = 2 $)',
      'The two pieces overlap only at the number where the ranges meet, so check that point carefully.\n\n' +
      '**For $ f $, the join is at $ x = 3 $:** top piece gives $ x^2 = 9 $, bottom piece gives $ 3x = 9 $. **Same value**, so $ x = 3 $ has a single output — $ f $ is a function.\n\n' +
      '**For $ g $, the join is at $ x = 2 $:** top piece gives $ x^2 = 4 $, bottom piece gives $ 3x = 6 $. **Two different outputs** for the single input $ x = 2 $ — so $ g $ is not a function.'),
    num('NCERT Misc · Q9',
      'Let R be a relation from N to N defined by $ R = \\{(a, b) : a, b \\in N \\text{ and } a = b^2\\} $. Are the following true? (i) $ (a, a) \\in R $ for all $ a \\in N $. (ii) $ (a, b) \\in R $ implies $ (b, a) \\in R $. (iii) $ (a, b) \\in R $ and $ (b, c) \\in R $ implies $ (a, c) \\in R $. Justify each answer.',
      'All three are false',
      'The rule is $ a = b^2 $. Test each claim with an actual example.\n\n' +
      '**(i) False.** $ (a, a) \\in R $ would need $ a = a^2 $, which holds only for $ a = 1 $, not for every natural number. E.g. $ (2, 2) $: is $ 2 = 2^2 = 4 $? No.\n\n' +
      '**(ii) False.** Take $ (9, 3) $ — here $ 9 = 3^2 $ ✓. For $ (3, 9) $ we would need $ 3 = 9^2 = 81 $, which is false.\n\n' +
      '**(iii) False.** Take $ (16, 4) $ since $ 16 = 4^2 $, and $ (4, 2) $ since $ 4 = 2^2 $. For $ (16, 2) $ we would need $ 16 = 2^2 = 4 $ — false.'),
    num('NCERT Misc · Q10',
      'Let A $ = \\{1, 2, 3, 4\\} $, B $ = \\{1, 5, 9, 11, 15, 16\\} $ and $ f = \\{(1,5), (2,9), (3,1), (4,5), (2,11)\\} $. Are the following true? (i) $ f $ is a relation from A to B. (ii) $ f $ is a function from A to B. Justify each answer.',
      '(i) True  (ii) False',
      '**(i) True.** In every pair the first entry $ (1, 2, 3, 4, 2) $ is in A and the second $ (5, 9, 1, 5, 11) $ is in B, so $ f $ is a subset of $ A \\times B $ — that makes it a relation from A to B.\n\n' +
      '**(ii) False.** The input $ 2 $ appears twice — $ (2, 9) $ and $ (2, 11) $ — so it has two outputs. A function allows only one output per input, so $ f $ is not a function.'),
    num('NCERT Misc · Q11',
      'Let $ f $ be the subset of $ Z \\times Z $ defined by $ f = \\{(ab,\\ a + b) : a, b \\in Z\\} $. Is $ f $ a function from Z to Z? Justify your answer.',
      'No — $ f $ is not a function',
      'Here the input is the **product** $ ab $ and the output is the **sum** $ a + b $. The trouble is that the same product can come from different pairs with different sums.\n\n' +
      'Take the input $ 6 $. From $ a = 2,\\ b = 3 $: input $ ab = 6 $, output $ a + b = 5 $. From $ a = 1,\\ b = 6 $: input $ ab = 6 $, output $ a + b = 7 $.\n\n' +
      'So the single input $ 6 $ is linked to both $ 5 $ and $ 7 $. One input, two outputs → $ f $ is **not** a function.'),
  ],
);

/* ── Section 4 — Domain & range of real functions (Ex 2.3 + Misc) ────────── */
const s4 = sec(
  'Domain & range of real functions',
  'The exam workhorse — where is the function allowed to live, and what values can it reach?',
  [
    num('NCERT Ex 2.3 · Q2',
      'Find the domain and range of the following real functions:\n\n' +
      '(i) $ f(x) = -\\,|x| $\n\n' +
      '(ii) $ f(x) = \\sqrt{9 - x^2} $',
      '(i) domain $ R $, range $ (-\\infty, 0] $  (ii) domain $ [-3, 3] $, range $ [0, 3] $',
      '**(i)** $ |x| $ is defined for every real $ x $, so the **domain is all of $ R $**. Since $ |x| \\ge 0 $, the negative $ -|x| $ is always $ \\le 0 $, and it reaches every such value. **Range** $ = (-\\infty, 0] $.\n\n' +
      '**(ii)** A square root needs its inside $ \\ge 0 $: $ 9 - x^2 \\ge 0 \\Rightarrow x^2 \\le 9 \\Rightarrow -3 \\le x \\le 3 $. So the **domain** is $ [-3, 3] $. As $ x $ runs over this interval, $ 9 - x^2 $ runs from $ 0 $ (at $ x = \\pm 3 $) up to $ 9 $ (at $ x = 0 $), so the root runs from $ 0 $ to $ 3 $. **Range** $ = [0, 3] $.'),
    num('NCERT Ex 2.3 · Q5',
      'Find the range of each of the following functions:\n\n' +
      '(i) $ f(x) = 2 - 3x,\\ x \\in R,\\ x > 0 $\n\n' +
      '(ii) $ f(x) = x^2 + 2,\\ x \\text{ a real number} $\n\n' +
      '(iii) $ f(x) = x,\\ x \\text{ a real number} $',
      '(i) $ (-\\infty, 2) $  (ii) $ [2, \\infty) $  (iii) $ R $',
      '**(i)** For $ x > 0 $, $ 3x > 0 $, so $ 2 - 3x < 2 $. As $ x $ approaches $ 0 $ the value approaches (but never reaches) $ 2 $; as $ x $ grows the value falls without bound. **Range** $ = (-\\infty, 2) $.\n\n' +
      '**(ii)** $ x^2 \\ge 0 $ for every real $ x $, so $ x^2 + 2 \\ge 2 $, with the smallest value $ 2 $ at $ x = 0 $. **Range** $ = [2, \\infty) $.\n\n' +
      '**(iii)** The identity function outputs exactly what it takes in, and $ x $ can be any real number. **Range** $ = R $.'),
    num('NCERT Misc · Q3',
      'Find the domain of the function $ f(x) = \\frac{x^2 + 2x + 1}{x^2 - 8x + 12} $.',
      'Domain $ = R - \\{2, 6\\} $',
      'A fraction is undefined only where the **bottom is zero**, so find those $ x $ and throw them out.\n\n' +
      'Factor the denominator: $ x^2 - 8x + 12 = (x - 2)(x - 6) $, which is $ 0 $ at $ x = 2 $ and $ x = 6 $.\n\n' +
      'Everywhere else the function is fine, so the **domain** $ = R - \\{2, 6\\} $.'),
    num('NCERT Misc · Q4',
      'Find the domain and the range of the real function $ f $ defined by $ f(x) = \\sqrt{x - 1} $.',
      'Domain $ = [1, \\infty) $, range $ = [0, \\infty) $',
      'The inside of the square root must be $ \\ge 0 $: $ x - 1 \\ge 0 \\Rightarrow x \\ge 1 $. So the **domain** $ = [1, \\infty) $.\n\n' +
      'As $ x $ goes from $ 1 $ upward, $ x - 1 $ goes from $ 0 $ upward, so its square root also runs from $ 0 $ upward. **Range** $ = [0, \\infty) $.'),
    num('NCERT Misc · Q5',
      'Find the domain and the range of the real function $ f $ defined by $ f(x) = |x - 1| $.',
      'Domain $ = R $, range $ = [0, \\infty) $',
      'The absolute value works for every real number, so the **domain** $ = R $.\n\n' +
      'An absolute value is never negative, and $ |x - 1| $ hits $ 0 $ at $ x = 1 $ and grows as $ x $ moves away from $ 1 $. So it reaches every value from $ 0 $ up. **Range** $ = [0, \\infty) $.'),
    num('NCERT Misc · Q6',
      'Let $ f = \\left\\{\\left(x,\\ \\frac{x^2}{1 + x^2}\\right) : x \\in R\\right\\} $ be a function from R into R. Determine the range of $ f $.',
      'Range $ = [0, 1) $',
      'Write $ y = \\frac{x^2}{1 + x^2} $ and solve for $ x^2 $ to see which $ y $ are actually reachable.\n\n' +
      '$ y(1 + x^2) = x^2 \\Rightarrow y = x^2(1 - y) \\Rightarrow x^2 = \\frac{y}{1 - y} $.\n\n' +
      'For a real $ x $ we need $ x^2 \\ge 0 $, so $ \\frac{y}{1 - y} \\ge 0 $, which holds for $ 0 \\le y < 1 $ (and $ y = 1 $ is impossible — it would need dividing by zero).\n\n' +
      'Check the ends: $ x = 0 $ gives $ y = 0 $ (reached); as $ x \\to \\infty $, $ y \\to 1 $ but never equals it. **Range** $ = [0, 1) $.'),
    num('NCERT Misc · Q12',
      'Let A $ = \\{9, 10, 11, 12, 13\\} $ and let $ f : A \\to N $ be defined by $ f(n) = $ the highest prime factor of $ n $. Find the range of $ f $.',
      'Range $ = \\{3, 5, 11, 13\\} $',
      'Break each input into primes and take the biggest prime that appears:\n\n' +
      '$ 9 = 3 \\times 3 \\to 3 $;  $ 10 = 2 \\times 5 \\to 5 $;  $ 11 $ is prime $ \\to 11 $;  $ 12 = 2^2 \\times 3 \\to 3 $;  $ 13 $ is prime $ \\to 13 $.\n\n' +
      'Collecting the distinct outputs, the **range** $ = \\{3, 5, 11, 13\\} $. (Note $ 9 $ and $ 12 $ both give $ 3 $, so $ 3 $ is listed once.)'),
  ],
);

/* ── Section 5 — Evaluating & combining functions (Ex 2.3 + Misc) ────────── */
const s5 = sec(
  'Evaluating & combining functions',
  'Feed a value in, read the output; add and subtract functions; recover a linear rule from its points.',
  [
    num('NCERT Ex 2.3 · Q3',
      'A function $ f $ is defined by $ f(x) = 2x - 5 $. Write down the values of (i) $ f(0) $, (ii) $ f(7) $, (iii) $ f(-3) $.',
      '$ f(0) = -5,\\ f(7) = 9,\\ f(-3) = -11 $',
      'Just substitute each input into $ 2x - 5 $:\n\n' +
      '$ f(0) = 2(0) - 5 = -5 $.\n\n' +
      '$ f(7) = 2(7) - 5 = 14 - 5 = 9 $.\n\n' +
      '$ f(-3) = 2(-3) - 5 = -6 - 5 = -11 $.'),
    num('NCERT Ex 2.3 · Q4',
      'The function $ t $ which maps a temperature in degree Celsius into degree Fahrenheit is defined by $ t(C) = \\frac{9C}{5} + 32 $. Find (i) $ t(0) $, (ii) $ t(28) $, (iii) $ t(-10) $, (iv) the value of C when $ t(C) = 212 $.',
      '$ t(0) = 32,\\ t(28) = 82.4,\\ t(-10) = 14,\\ C = 100 $',
      'Substitute into $ t(C) = \\frac{9C}{5} + 32 $:\n\n' +
      '$ t(0) = \\frac{9(0)}{5} + 32 = 32 $.\n\n' +
      '$ t(28) = \\frac{9(28)}{5} + 32 = \\frac{252}{5} + 32 = 50.4 + 32 = 82.4 $.\n\n' +
      '$ t(-10) = \\frac{9(-10)}{5} + 32 = -18 + 32 = 14 $.\n\n' +
      '**(iv)** Set $ \\frac{9C}{5} + 32 = 212 \\Rightarrow \\frac{9C}{5} = 180 \\Rightarrow 9C = 900 \\Rightarrow C = 100 $. (This is the boiling point of water: $ 100\\,°C = 212\\,°F $.)'),
    num('NCERT Misc · Q2',
      'If $ f(x) = x^2 $, find $ \\frac{f(1.1) - f(1)}{(1.1 - 1)} $.',
      '2.1',
      'Work out the two function values first: $ f(1.1) = (1.1)^2 = 1.21 $ and $ f(1) = 1^2 = 1 $.\n\n' +
      'Now the quotient: $ \\frac{1.21 - 1}{1.1 - 1} = \\frac{0.21}{0.1} = 2.1 $.\n\n' +
      '(This "average rate of change" over a tiny step near $ x = 1 $ sits close to $ 2 $ — a first taste of the derivative of $ x^2 $, which is $ 2x = 2 $ at $ x = 1 $.)'),
    num('NCERT Misc · Q7',
      'Let $ f, g : R \\to R $ be defined, respectively, by $ f(x) = x + 1 $, $ g(x) = 2x - 3 $. Find $ f + g $, $ f - g $ and $ \\frac{f}{g} $.',
      '$ (f+g)(x) = 3x - 2,\\ (f-g)(x) = -x + 4,\\ \\left(\\frac{f}{g}\\right)(x) = \\frac{x+1}{2x-3},\\ x \\ne \\frac{3}{2} $',
      'Combine the two formulas at each $ x $:\n\n' +
      '$ (f + g)(x) = (x + 1) + (2x - 3) = 3x - 2 $.\n\n' +
      '$ (f - g)(x) = (x + 1) - (2x - 3) = x + 1 - 2x + 3 = -x + 4 $. (Watch the sign — the minus flips **both** terms of $ g $.)\n\n' +
      '$ \\left(\\frac{f}{g}\\right)(x) = \\frac{x + 1}{2x - 3} $, valid wherever the bottom is not zero, i.e. $ x \\ne \\frac{3}{2} $.'),
    num('NCERT Misc · Q8',
      'Let $ f = \\{(1,1), (2,3), (0,-1), (-1,-3)\\} $ be a function from Z to Z defined by $ f(x) = ax + b $, for some integers $ a, b $. Determine $ a, b $.',
      '$ a = 2,\\ b = -1 $',
      'Pick two known pairs and turn them into equations in $ a $ and $ b $.\n\n' +
      'From $ (0, -1) $: $ f(0) = a(0) + b = b = -1 $, so $ b = -1 $.\n\n' +
      'From $ (1, 1) $: $ f(1) = a + b = 1 $, so $ a + (-1) = 1 \\Rightarrow a = 2 $.\n\n' +
      'So $ f(x) = 2x - 1 $. Quick check on the other points: $ f(2) = 3 $ ✓ and $ f(-1) = -3 $ ✓. Hence $ a = 2,\\ b = -1 $.'),
  ],
);

const practicePage = {
  slug: 'relations-functions-practice-ncert',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 36 NCERT textbook exercises for the chapter (2.1, 2.2, 2.3 and Miscellaneous), regrouped into 5 revision themes, each with a full worked solution.',
  page_number: 10,
  page_type: 'lesson',
  blocks: [
    b('image', 0, {
      src: '', alt: 'A grid of worked mathematics problems glowing on a dark background', caption: '',
      width: 'full', aspect_ratio: '16:5',
      generation_prompt:
        'Ultra-wide cinematic banner (16:5). A tidy grid of glowing hand-worked mathematics — ordered pairs, ' +
        'a small mapping diagram, a square-root and a fraction, a staircase and a straight line — arranged like ' +
        'flash-cards on a deep near-black background, with a pen mid-stroke solving one of them. Violet, amber and ' +
        'sky-blue glow, elegant graphing-poster style, no readable text.',
    }),
    b('text', 1, {
      markdown:
        'You have read the chapter — now **drill it**. Below are **all 36 NCERT exercises** for this chapter ' +
        '(Exercises 2.1, 2.2, 2.3 and the Miscellaneous Exercise), but **regrouped by idea** instead of the ' +
        'textbook’s running order, so each cluster hammers one skill.\n\n' +
        'Try every question on paper **first**. Only then tap to open the worked solution — the struggle before ' +
        'you peek is what makes it stick. The solution shows every step, so a question you get wrong becomes a ' +
        'mini-lesson, not just a red cross.',
    }),
    b('practice_bank', 2, {
      title: 'NCERT Exercises · Relations and Functions',
      intro:
        'Pick a theme on the left. Each question carries its NCERT source tag; tap a question to reveal a full, ' +
        'step-by-step worked solution in plain language.',
      sections: [s1, s2, s3, s4, s5],
    }),
  ],
};

module.exports = { practicePage };

if (require.main === module) {
  (async () => {
    await withDb(async (db) => {
      const bookId = await ensureBookAndChapter(db);
      await insertPages(db, bookId, [practicePage]);
    });
    const total = [s1, s2, s3, s4, s5].reduce((n, s) => n + s.items.length, 0);
    console.log(`practice page DONE (unpublished) · ${[s1, s2, s3, s4, s5].length} sections · ${total} questions.`);
  })().catch((e) => { console.error(e); process.exit(1); });
}
