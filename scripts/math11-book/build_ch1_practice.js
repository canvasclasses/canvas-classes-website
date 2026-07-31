'use strict';
/* Class 11 Math · Ch.1 Sets — the end-of-chapter PRACTICE page.
   A single practice_bank block holding ALL 49 NCERT Ch.1 exercise questions
   (Exercise 1.1, 1.2, 1.3, 1.4, 1.5, and the Miscellaneous Exercise), sourced
   verbatim from the source PDF (…/Math Books/NCERT Class 11 Maths/Ch1 - Sets.pdf,
   Reprint 2026-27 print — read in full before writing, per Rule 0). This print
   has NO Exercise 1.6 (the "Practical Problems" section was dropped from the
   current NCERT syllabus — see MATH_CH1_SETS_PLAN.md §A), so the six sections
   below map 1:1 onto the six graded question-sets that actually exist in the
   book: Ex 1.1 through 1.5, plus the Miscellaneous Exercise.
   Additive + idempotent (skip-if-exists by slug). published:false.
   Run: node scripts/math11-book/build_ch1_practice.js */
const { b, ensureBookAndChapter, insertPages, withDb } = require('./_book_ch1');
const { v4: uuidv4 } = require('uuid');

/* item helpers — every id is a fresh uuid */
const num = (source_label, prompt, answer, solution) =>
  ({ id: uuidv4(), kind: 'numerical', source: 'ncert_exercise', source_label, prompt, answer, solution });
const sec = (title, blurb, items) => ({ id: uuidv4(), title, blurb, items });

/* ── Section 1 — Well-defined collections, roster & set-builder form (Ex 1.1) */
const s1 = sec(
  'Sets, roster form & set-builder form',
  'Ex 1.1 — deciding what counts as a set, and moving between the two ways of writing one down.',
  [
    num('NCERT Ex 1.1 · Q1',
      'Which of the following are sets? Justify your answer.\n\n' +
      '(i) The collection of all months of a year beginning with the letter J.\n\n' +
      '(ii) The collection of ten most talented writers of India.\n\n' +
      '(iii) A team of eleven best cricket batsmen of the world.\n\n' +
      '(iv) The collection of all boys in your class.\n\n' +
      '(v) The collection of all natural numbers less than 100.\n\n' +
      '(vi) A collection of novels written by the writer Munshi Prem Chand.\n\n' +
      '(vii) The collection of all even integers.\n\n' +
      '(viii) The collection of questions in this Chapter.\n\n' +
      '(ix) A collection of most dangerous animals of the world.',
      '(i), (iv), (v), (vi), (vii), (viii) are sets; (ii), (iii), (ix) are not',
      'A collection is a set only when you can say, for certain, whether any given object belongs or not.\n\n' +
      '**(i) Set.** Only three months begin with J — January, June, July — a fixed, checkable list.\n\n' +
      '**(ii) Not a set.** “Most talented” is a matter of opinion; different people would name different writers.\n\n' +
      '**(iii) Not a set.** “Best” batsmen is opinion-based, not a checkable fact.\n\n' +
      '**(iv) Set.** Whether a particular boy is in your class is a definite fact.\n\n' +
      '**(v) Set.** Any natural number can be checked against “less than 100” with a definite yes or no.\n\n' +
      '**(vi) Set.** Munshi Prem Chand’s novels are a fixed, historical, checkable list — even if you don’t ' +
      'personally know every title, the collection itself is well-defined.\n\n' +
      '**(vii) Set.** Any integer is checkably even or not.\n\n' +
      '**(viii) Set.** The questions in this chapter are a fixed, countable, checkable list.\n\n' +
      '**(ix) Not a set.** “Most dangerous” depends on opinion (dangerous how, and to whom).'),
    num('NCERT Ex 1.1 · Q2',
      'Let $ A = \\{1, 2, 3, 4, 5, 6\\} $. Insert the appropriate symbol $ \\in $ or $ \\notin $ in the blank ' +
      'spaces:\n\n(i) $ 5 \\dots A $  (ii) $ 8 \\dots A $  (iii) $ 0 \\dots A $  (iv) $ 4 \\dots A $  ' +
      '(v) $ 2 \\dots A $  (vi) $ 10 \\dots A $',
      '(i) ∈ (ii) ∉ (iii) ∉ (iv) ∈ (v) ∈ (vi) ∉',
      'Just check each number against the list $ \\{1,2,3,4,5,6\\} $:\n\n' +
      '(i) 5 is in the list → $ 5 \\in A $. (ii) 8 is not → $ 8 \\notin A $. (iii) 0 is not → $ 0 \\notin A $. ' +
      '(iv) 4 is in the list → $ 4 \\in A $. (v) 2 is in the list → $ 2 \\in A $. (vi) 10 is not → $ 10 \\notin A $.'),
    num('NCERT Ex 1.1 · Q3',
      'Write the following sets in roster form:\n\n' +
      '(i) $ A = \\{x : x \\text{ is an integer and } -3 \\le x < 7\\} $\n\n' +
      '(ii) $ B = \\{x : x \\text{ is a natural number less than } 6\\} $\n\n' +
      '(iii) $ C = \\{x : x \\text{ is a two-digit natural number such that the sum of its digits is } 8\\} $\n\n' +
      '(iv) $ D = \\{x : x \\text{ is a prime number which is a divisor of } 60\\} $\n\n' +
      '(v) $ E = $ the set of all letters in the word TRIGONOMETRY\n\n' +
      '(vi) $ F = $ the set of all letters in the word BETTER',
      '(i) {−3,−2,−1,0,1,2,3,4,5,6} (ii) {1,2,3,4,5} (iii) {17,26,35,44,53,62,71,80} (iv) {2,3,5} ' +
      '(v) {T,R,I,G,O,N,M,E,Y} (vi) {B,E,T,R}',
      '(i) Every integer from $ -3 $ up to (but not including) $ 7 $: $ \\{-3,-2,-1,0,1,2,3,4,5,6\\} $.\n\n' +
      '(ii) Naturals below 6: $ \\{1,2,3,4,5\\} $.\n\n' +
      '(iii) Two-digit numbers whose digits add to 8: $ 17, 26, 35, 44, 53, 62, 71, 80 $.\n\n' +
      '(iv) Divisors of 60 are $ 1,2,3,4,5,6,10,12,15,20,30,60 $; the prime ones among them are $ 2, 3, 5 $.\n\n' +
      '(v) Spelling out T-R-I-G-O-N-O-M-E-T-R-Y and keeping each letter only once: $ \\{T,R,I,G,O,N,M,E,Y\\} $ ' +
      '(9 distinct letters — T, R and O each appear twice in the word but are listed once).\n\n' +
      '(vi) B-E-T-T-E-R has repeated E and T; the distinct letters are $ \\{B,E,T,R\\} $.'),
    num('NCERT Ex 1.1 · Q4',
      'Write the following sets in the set-builder form:\n\n' +
      '(i) $ \\{3, 6, 9, 12\\} $  (ii) $ \\{2, 4, 8, 16, 32\\} $  (iii) $ \\{5, 25, 125, 625\\} $  ' +
      '(iv) $ \\{2, 4, 6, \\dots\\} $  (v) $ \\{1, 4, 9, \\dots, 100\\} $',
      '(i) {x : x = 3n, n∈N, n≤4} (ii) {x : x = 2ⁿ, n∈N, n≤5} (iii) {x : x = 5ⁿ, n∈N, n≤4} ' +
      '(iv) {x : x is an even natural number} (v) {x : x = n², n∈N, n≤10}',
      'Look for the pattern behind each list, then describe it as a rule.\n\n' +
      '(i) Each term is 3 times a counting number from 1 to 4: $ \\{x : x = 3n,\\ n \\in \\mathbb{N},\\ n \\le 4\\} $.\n\n' +
      '(ii) Each term doubles the last, starting from $ 2^1 $ up to $ 2^5 $: $ \\{x : x = 2^n,\\ n \\in \\mathbb{N},\\ n \\le 5\\} $.\n\n' +
      '(iii) Each term is a power of 5, from $ 5^1 $ to $ 5^4 $: $ \\{x : x = 5^n,\\ n \\in \\mathbb{N},\\ n \\le 4\\} $.\n\n' +
      '(iv) This never stops — it is every even natural number: $ \\{x : x \\text{ is an even natural number}\\} $.\n\n' +
      '(v) These are perfect squares from $ 1^2 $ to $ 10^2 = 100 $: $ \\{x : x = n^2,\\ n \\in \\mathbb{N},\\ n \\le 10\\} $.'),
    num('NCERT Ex 1.1 · Q5',
      'List all the elements of the following sets:\n\n' +
      '(i) $ A = \\{x : x \\text{ is an odd natural number}\\} $\n\n' +
      '(ii) $ B = \\{x : x \\text{ is an integer},\\ -\\frac{1}{2} < x < \\frac{9}{2}\\} $\n\n' +
      '(iii) $ C = \\{x : x \\text{ is an integer},\\ x^2 \\le 4\\} $\n\n' +
      '(iv) $ D = \\{x : x \\text{ is a letter in the word “LOYAL”}\\} $\n\n' +
      '(v) $ E = \\{x : x \\text{ is a month of a year not having 31 days}\\} $\n\n' +
      '(vi) $ F = \\{x : x \\text{ is a consonant in the English alphabet which precedes } k\\} $',
      '(i) {1,3,5,7,9,…} (ii) {0,1,2,3,4} (iii) {−2,−1,0,1,2} (iv) {L,O,Y,A} ' +
      '(v) {February, April, June, September, November} (vi) {b,c,d,f,g,h,j}',
      '(i) Odd natural numbers never stop, so — exactly the ellipsis idea from “finite and infinite sets” — you ' +
      'list the pattern, not every element: $ A = \\{1, 3, 5, 7, 9, \\dots\\} $, an infinite set.\n\n' +
      '(ii) Integers strictly between $ -0.5 $ and $ 4.5 $: $ \\{0, 1, 2, 3, 4\\} $.\n\n' +
      '(iii) $ x^2 \\le 4 \\Rightarrow -2 \\le x \\le 2 $, so the integers are $ \\{-2, -1, 0, 1, 2\\} $.\n\n' +
      '(iv) L-O-Y-A-L repeats the letter L; the distinct letters are $ \\{L, O, Y, A\\} $.\n\n' +
      '(v) The months without 31 days: February (28/29), and April, June, September, November (each 30).\n\n' +
      '(vi) The letters before $ k $ in the alphabet are $ a,b,c,d,e,f,g,h,i,j $; removing the vowels ' +
      '$ a, e, i $ leaves the consonants $ \\{b, c, d, f, g, h, j\\} $.'),
    num('NCERT Ex 1.1 · Q6',
      'Match each of the set on the left in the roster form with the same set on the right described in ' +
      'set-builder form:\n\n' +
      '(i) $ \\{1, 2, 3, 6\\} $  (ii) $ \\{2, 3\\} $  (iii) $ \\{M, A, T, H, E, I, C, S\\} $  ' +
      '(iv) $ \\{1, 3, 5, 7, 9\\} $\n\n' +
      '(a) $ \\{x : x \\text{ is a prime number and a divisor of } 6\\} $\n\n' +
      '(b) $ \\{x : x \\text{ is an odd natural number less than } 10\\} $\n\n' +
      '(c) $ \\{x : x \\text{ is a natural number and a divisor of } 6\\} $\n\n' +
      '(d) $ \\{x : x \\text{ is a letter of the word MATHEMATICS}\\} $',
      '(i)–(c), (ii)–(a), (iii)–(d), (iv)–(b)',
      'The divisors of 6 are $ 1, 2, 3, 6 $ — matching **(i) with (c)**. The *prime* divisors of 6 are just ' +
      '$ 2, 3 $ — matching **(ii) with (a)**. The distinct letters of MATHEMATICS are ' +
      '$ \\{M, A, T, H, E, I, C, S\\} $ (8 letters) — matching **(iii) with (d)**. The odd naturals below 10 are ' +
      '$ 1, 3, 5, 7, 9 $ — matching **(iv) with (b)**.'),
  ],
);

/* ── Section 2 — Empty, finite, infinite & equal sets (Ex 1.2) ────────────── */
const s2 = sec(
  'Empty, finite, infinite & equal sets',
  'Ex 1.2 — sets with nothing in them, sets that never end, and telling two sets are really the same set.',
  [
    num('NCERT Ex 1.2 · Q1',
      'Which of the following are examples of the null set?\n\n' +
      '(i) Set of odd natural numbers divisible by 2\n\n' +
      '(ii) Set of even prime numbers\n\n' +
      '(iii) $ \\{x : x \\text{ is a natural number}, x < 5 \\text{ and } x > 7\\} $\n\n' +
      '(iv) $ \\{y : y \\text{ is a point common to any two parallel lines}\\} $',
      '(i), (iii), (iv) are null sets; (ii) is not — it equals {2}',
      '(i) An odd number can never be divisible by 2, so no such number exists — **null set**.\n\n' +
      '(ii) 2 is both even and prime, so this set is $ \\{2\\} $ — **not null**, it has one element.\n\n' +
      '(iii) No natural number is simultaneously less than 5 and greater than 7 — **null set**.\n\n' +
      '(iv) Parallel lines never meet, so they share no common point — **null set**.'),
    num('NCERT Ex 1.2 · Q2',
      'Which of the following sets are finite or infinite?\n\n' +
      '(i) The set of months of a year\n\n(ii) $ \\{1, 2, 3, \\dots\\} $\n\n' +
      '(iii) $ \\{1, 2, 3, \\dots, 99, 100\\} $\n\n(iv) The set of positive integers greater than 100\n\n' +
      '(v) The set of prime numbers less than 99',
      '(i) finite (ii) infinite (iii) finite (iv) infinite (v) finite',
      '(i) There are exactly 12 months — **finite**.\n\n' +
      '(ii) The dots mean “and so on forever” — **infinite**.\n\n' +
      '(iii) Stops at 100 — a definite, countable list — **finite**.\n\n' +
      '(iv) “Greater than 100” never stops climbing — **infinite**.\n\n' +
      '(v) Primes below 99 are a fixed, countable list (2, 3, 5, …, 97) — **finite**.'),
    num('NCERT Ex 1.2 · Q3',
      'State whether each of the following set is finite or infinite:\n\n' +
      '(i) The set of lines which are parallel to the x-axis\n\n' +
      '(ii) The set of letters in the English alphabet\n\n' +
      '(iii) The set of numbers which are multiple of 5\n\n' +
      '(iv) The set of animals living on the earth\n\n' +
      '(v) The set of circles passing through the origin (0,0)',
      '(i) infinite (ii) finite (iii) infinite (iv) finite (v) infinite',
      '(i) Infinitely many horizontal lines can be drawn, one at every height — **infinite**.\n\n' +
      '(ii) Exactly 26 letters — **finite**.\n\n' +
      '(iii) Multiples of 5 go on forever — **infinite**.\n\n' +
      '(iv) Enormous, but at any moment it is a definite, countable number of animals — **finite**.\n\n' +
      '(v) Infinitely many circles of every possible radius can pass through one fixed point — **infinite**.'),
    num('NCERT Ex 1.2 · Q4',
      'In the following, state whether $ A = B $ or not:\n\n' +
      '(i) $ A = \\{a, b, c, d\\} $  $ B = \\{d, c, b, a\\} $\n\n' +
      '(ii) $ A = \\{4, 8, 12, 16\\} $  $ B = \\{8, 4, 16, 18\\} $\n\n' +
      '(iii) $ A = \\{2, 4, 6, 8, 10\\} $  $ B = \\{x : x \\text{ is positive even integer and } x \\le 10\\} $\n\n' +
      '(iv) $ A = \\{x : x \\text{ is a multiple of } 10\\} $, $ B = \\{10, 15, 20, 25, 30, \\dots\\} $',
      '(i) A = B (ii) A ≠ B (iii) A = B (iv) A ≠ B',
      '(i) Same four letters, just listed in a different order — order never matters, so **A = B**.\n\n' +
      '(ii) A has 12; B has 18 instead — the two sets differ, so **A ≠ B**.\n\n' +
      '(iii) Writing B out fully gives exactly $ \\{2,4,6,8,10\\} $ — the same as A, so **A = B**.\n\n' +
      '(iv) A is $ \\{10, 20, 30, \\dots\\} $ (only multiples of 10); B also includes 15 and 25, which are not ' +
      'multiples of 10 — so **A ≠ B**.'),
    num('NCERT Ex 1.2 · Q5',
      'Are the following pair of sets equal? Give reasons.\n\n' +
      '(i) $ A = \\{2, 3\\} $, $ B = \\{x : x \\text{ is solution of } x^2 + 5x + 6 = 0\\} $\n\n' +
      '(ii) $ A = \\{x : x \\text{ is a letter in the word FOLLOW}\\} $, $ B = \\{y : y \\text{ is a letter in ' +
      'the word WOLF}\\} $',
      '(i) Not equal (ii) Equal',
      '(i) Solve $ x^2 + 5x + 6 = (x+2)(x+3) = 0 $, giving $ x = -2, -3 $, so $ B = \\{-2, -3\\} $ — the signs ' +
      'don’t match $ A = \\{2, 3\\} $, so **not equal**.\n\n' +
      '(ii) The distinct letters of FOLLOW are $ \\{F, O, L, W\\} $, and the distinct letters of WOLF are also ' +
      '$ \\{W, O, L, F\\} $ — same four letters, so **equal**.'),
    num('NCERT Ex 1.2 · Q6',
      'From the sets given below, select equal sets:\n\n' +
      '$ A = \\{2, 4, 8, 12\\} $, $ B = \\{1, 2, 3, 4\\} $, $ C = \\{4, 8, 12, 14\\} $, $ D = \\{3, 1, 4, 2\\} $, ' +
      '$ E = \\{-1, 1\\} $, $ F = \\{0, a\\} $, $ G = \\{1, -1\\} $, $ H = \\{0, 1\\} $',
      'B = D, and E = G',
      '$ B = \\{1,2,3,4\\} $ and $ D = \\{3,1,4,2\\} $ are the same four numbers, just reordered — **$ B = D $**.\n\n' +
      '$ E = \\{-1, 1\\} $ and $ G = \\{1, -1\\} $ are the same two numbers reordered — **$ E = G $**.\n\n' +
      'Checking the rest: $ A $ has 2 but not 14 (while $ C $ has 14 but not 2), so $ A \\ne C $; $ F = \\{0, a\\} $ ' +
      'has the symbol $ a $, not the number 1, so $ F \\ne H $. No other pair matches.'),
  ],
);

/* ── Section 3 — Subsets, intervals & universal sets (Ex 1.3) ─────────────── */
const s3 = sec(
  'Subsets, intervals & universal sets',
  'Ex 1.3 — when one set sits entirely inside another, interval notation, and picking a sensible universal set.',
  [
    num('NCERT Ex 1.3 · Q1',
      'Make correct statements by filling in the symbols $ \\subset $ or $ \\not\\subset $ in the blank ' +
      'spaces:\n\n' +
      '(i) $ \\{2, 3, 4\\} \\dots \\{1, 2, 3, 4, 5\\} $\n\n' +
      '(ii) $ \\{a, b, c\\} \\dots \\{b, c, d\\} $\n\n' +
      '(iii) $ \\{x : x \\text{ is a student of Class XI of your school}\\} \\dots \\{x : x \\text{ is a ' +
      'student of your school}\\} $\n\n' +
      '(iv) $ \\{x : x \\text{ is a circle in the plane}\\} \\dots \\{x : x \\text{ is a circle in the same ' +
      'plane with radius 1 unit}\\} $\n\n' +
      '(v) $ \\{x : x \\text{ is a triangle in a plane}\\} \\dots \\{x : x \\text{ is a rectangle in the ' +
      'plane}\\} $\n\n' +
      '(vi) $ \\{x : x \\text{ is an equilateral triangle in a plane}\\} \\dots \\{x : x \\text{ is a ' +
      'triangle in the same plane}\\} $\n\n' +
      '(vii) $ \\{x : x \\text{ is an even natural number}\\} \\dots \\{x : x \\text{ is an integer}\\} $',
      '(i) ⊂ (ii) ⊄ (iii) ⊂ (iv) ⊄ (v) ⊄ (vi) ⊂ (vii) ⊂',
      '(i) $ 2, 3, 4 $ are all in $ \\{1,\\dots,5\\} $ → **⊂**.\n\n' +
      '(ii) $ a $ is missing from $ \\{b,c,d\\} $ → **⊄**.\n\n' +
      '(iii) Every Class XI student of your school is, of course, also a student of your school → **⊂**.\n\n' +
      '(iv) The set of *every* circle is far bigger than just radius-1 circles — a general circle needn’t have ' +
      'radius 1 → **⊄**.\n\n' +
      '(v) A triangle is never a rectangle → **⊄**.\n\n' +
      '(vi) Every equilateral triangle is, in particular, a triangle → **⊂**.\n\n' +
      '(vii) Every even natural number is an integer → **⊂**.'),
    num('NCERT Ex 1.3 · Q2',
      'Examine whether the following statements are true or false:\n\n' +
      '(i) $ \\{a, b\\} \\not\\subset \\{b, c, a\\} $\n\n' +
      '(ii) $ \\{a, e\\} \\subset \\{x : x \\text{ is a vowel in the English alphabet}\\} $\n\n' +
      '(iii) $ \\{1, 2, 3\\} \\subset \\{1, 3, 5\\} $\n\n' +
      '(iv) $ \\{a\\} \\subset \\{a, b, c\\} $\n\n' +
      '(v) $ \\{a\\} \\in \\{a, b, c\\} $\n\n' +
      '(vi) $ \\{x : x \\text{ is an even natural number less than } 6\\} \\subset \\{x : x \\text{ is a ' +
      'natural number which divides } 36\\} $',
      '(i) False (ii) True (iii) False (iv) True (v) False (vi) True',
      '(i) $ \\{a,b\\} $ actually **is** a subset of $ \\{b,c,a\\} $ (both a and b are present), so the claim ' +
      'that it is NOT a subset is **false**.\n\n' +
      '(ii) $ a $ and $ e $ are both vowels → **true**.\n\n' +
      '(iii) $ 2 \\in \\{1,2,3\\} $ but $ 2 \\notin \\{1,3,5\\} $, so it is not a subset → **false**.\n\n' +
      '(iv) $ a \\in \\{a,b,c\\} $ → **true**.\n\n' +
      '(v) $ \\{a\\} $ is a *set*; the elements of $ \\{a,b,c\\} $ are the individual letters $ a, b, c $ — not ' +
      'the set $ \\{a\\} $ — so this membership claim is **false** (though $ a \\in \\{a,b,c\\} $ would be true).\n\n' +
      '(vi) Even naturals below 6: $ \\{2, 4\\} $; divisors of 36 include both 2 and 4 → **true**.'),
    num('NCERT Ex 1.3 · Q3',
      'Let $ A = \\{1, 2, \\{3, 4\\}, 5\\} $. Which of the following statements are incorrect and why?\n\n' +
      '(i) $ \\{3, 4\\} \\subset A $  (ii) $ \\{3, 4\\} \\in A $  (iii) $ \\{\\{3, 4\\}\\} \\subset A $  ' +
      '(iv) $ 1 \\in A $  (v) $ 1 \\subset A $  (vi) $ \\{1, 2, 5\\} \\subset A $  ' +
      '(vii) $ \\{1, 2, 5\\} \\in A $  (viii) $ \\{1, 2, 3\\} \\subset A $  (ix) $ \\phi \\in A $  ' +
      '(x) $ \\phi \\subset A $  (xi) $ \\{\\phi\\} \\subset A $',
      'Incorrect: (i), (v), (vii), (viii), (ix), (xi). Correct: (ii), (iii), (iv), (vi), (x)',
      '$ A $ has exactly **4 elements**: the numbers $ 1, 2, 5 $, and the *set* $ \\{3,4\\} $ counted as one ' +
      'single element.\n\n' +
      '(i) **Incorrect.** $ \\{3,4\\} \\subset A $ would require 3 and 4 to each be individual elements of A — ' +
      'they aren’t (only the packaged set $ \\{3,4\\} $ is).\n\n' +
      '(ii) **Correct.** $ \\{3,4\\} $ is literally one of A’s four elements.\n\n' +
      '(iii) **Correct.** Since $ \\{3,4\\} \\in A $, the singleton set containing just that element, ' +
      '$ \\{\\{3,4\\}\\} $, is a valid subset of A.\n\n' +
      '(iv) **Correct.** 1 is literally an element of A.\n\n' +
      '(v) **Incorrect.** $ 1 \\subset A $ doesn’t even make sense — 1 is a number, not a set, so “subset” ' +
      'doesn’t apply to it.\n\n' +
      '(vi) **Correct.** 1, 2 and 5 are all individually elements of A, so $ \\{1,2,5\\} \\subset A $.\n\n' +
      '(vii) **Incorrect.** The set $ \\{1,2,5\\} $, as a whole packaged object, is not itself one of A’s four ' +
      'listed elements.\n\n' +
      '(viii) **Incorrect.** 3 is not, by itself, an element of A (only the packaged $ \\{3,4\\} $ is) — so ' +
      '$ \\{1,2,3\\} \\not\\subset A $.\n\n' +
      '(ix) **Incorrect.** $ \\phi $ is not literally one of A’s four listed elements.\n\n' +
      '(x) **Correct.** $ \\phi \\subset A $ always holds, for any set A.\n\n' +
      '(xi) **Incorrect.** This would need $ \\phi $ itself to be an element of A — it isn’t.'),
    num('NCERT Ex 1.3 · Q4',
      'Write down all the subsets of the following sets:\n\n' +
      '(i) $ \\{a\\} $  (ii) $ \\{a, b\\} $  (iii) $ \\{1, 2, 3\\} $  (iv) $ \\phi $',
      '(i) φ, {a} (ii) φ, {a}, {b}, {a,b} (iii) φ, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3} (iv) φ',
      'List every subset by size, remembering $ \\phi $ and the whole set always count.\n\n' +
      '(i) A 1-element set has $ 2^1 = 2 $ subsets: $ \\phi $ and $ \\{a\\} $ itself.\n\n' +
      '(ii) A 2-element set has $ 2^2 = 4 $ subsets: $ \\phi,\\ \\{a\\},\\ \\{b\\},\\ \\{a,b\\} $.\n\n' +
      '(iii) A 3-element set has $ 2^3 = 8 $ subsets: $ \\phi $; the singletons $ \\{1\\},\\{2\\},\\{3\\} $; ' +
      'the pairs $ \\{1,2\\},\\{1,3\\},\\{2,3\\} $; and the whole set $ \\{1,2,3\\} $.\n\n' +
      '(iv) The empty set has exactly **one** subset — itself, $ \\phi $ (never zero — see the Power Set page).'),
    num('NCERT Ex 1.3 · Q5',
      'Write the following as intervals:\n\n' +
      '(i) $ \\{x : x \\in \\mathbb{R}, -4 < x \\le 6\\} $\n\n' +
      '(ii) $ \\{x : x \\in \\mathbb{R}, -12 < x < -10\\} $\n\n' +
      '(iii) $ \\{x : x \\in \\mathbb{R}, 0 \\le x < 7\\} $\n\n' +
      '(iv) $ \\{x : x \\in \\mathbb{R}, 3 \\le x \\le 4\\} $',
      '(i) (−4, 6] (ii) (−12, −10) (iii) [0, 7) (iv) [3, 4]',
      'Match each strict/non-strict inequality to a round/square bracket at that end.\n\n' +
      '(i) $ -4 < x $ (excluded, round bracket) and $ x \\le 6 $ (included, square bracket): $ (-4, 6] $.\n\n' +
      '(ii) Both ends strict: $ (-12, -10) $.\n\n' +
      '(iii) $ 0 \\le x $ (included) and $ x < 7 $ (excluded): $ [0, 7) $.\n\n' +
      '(iv) Both ends non-strict: $ [3, 4] $.'),
    num('NCERT Ex 1.3 · Q6',
      'Write the following intervals in set-builder form:\n\n' +
      '(i) $ (-3, 0) $  (ii) $ [6, 12] $  (iii) $ (6, 12] $  (iv) $ [-23, 5) $',
      '(i) {x∈R : −3<x<0} (ii) {x∈R : 6≤x≤12} (iii) {x∈R : 6<x≤12} (iv) {x∈R : −23≤x<5}',
      'Reverse the bracket rule: round brackets become strict inequalities, square brackets become non-strict ones.\n\n' +
      '(i) $ \\{x \\in \\mathbb{R} : -3 < x < 0\\} $.\n\n' +
      '(ii) $ \\{x \\in \\mathbb{R} : 6 \\le x \\le 12\\} $.\n\n' +
      '(iii) $ \\{x \\in \\mathbb{R} : 6 < x \\le 12\\} $.\n\n' +
      '(iv) $ \\{x \\in \\mathbb{R} : -23 \\le x < 5\\} $.'),
    num('NCERT Ex 1.3 · Q7',
      'What universal set(s) would you propose for each of the following:\n\n' +
      '(i) The set of right triangles.\n\n(ii) The set of isosceles triangles.',
      'The set of all triangles in a plane, for both',
      'A right triangle and an isosceles triangle are each a *special kind* of triangle, so the smallest ' +
      'sensible “big picture” set that comfortably holds either is **the set of all triangles in a plane** — ' +
      'there’s no need to reach for something unrelated like “all polygons”.'),
    num('NCERT Ex 1.3 · Q8',
      'Given the sets $ A = \\{1, 3, 5\\} $, $ B = \\{2, 4, 6\\} $ and $ C = \\{0, 2, 4, 6, 8\\} $, which of ' +
      'the following may be considered as universal set(s) for all the three sets A, B and C:\n\n' +
      '(i) $ \\{0, 1, 2, 3, 4, 5, 6\\} $  (ii) $ \\phi $  (iii) $ \\{0,1,2,3,4,5,6,7,8,9,10\\} $  ' +
      '(iv) $ \\{1,2,3,4,5,6,7,8\\} $',
      'Only (iii)',
      'A valid universal set must contain **every** element of A, B and C — that is, all of ' +
      '$ A \\cup B \\cup C = \\{0,1,2,3,4,5,6,8\\} $.\n\n' +
      '(i) is missing 8 (from C) — **fails**. (ii) is empty — **fails**. (iii) contains every one of those ' +
      'elements (and more, which is fine) — **works**. (iv) is missing 0 (from C) — **fails**. Only **(iii)** ' +
      'qualifies.'),
  ],
);

/* ── Section 4 — Union, intersection & difference (Ex 1.4) ────────────────── */
const s4 = sec(
  'Union, intersection & difference',
  'Ex 1.4 — combining two sets three different ways, and reading which elements survive each operation.',
  [
    num('NCERT Ex 1.4 · Q1',
      'Find the union of each of the following pairs of sets:\n\n' +
      '(i) $ X = \\{1, 3, 5\\} $  $ Y = \\{1, 2, 3\\} $\n\n' +
      '(ii) $ A = \\{a, e, i, o, u\\} $  $ B = \\{a, b, c\\} $\n\n' +
      '(iii) $ A = \\{x : x \\text{ is a natural number and multiple of } 3\\} $  ' +
      '$ B = \\{x : x \\text{ is a natural number less than } 6\\} $\n\n' +
      '(iv) $ A = \\{x : x \\text{ is a natural number and } 1 < x \\le 6\\} $  ' +
      '$ B = \\{x : x \\text{ is a natural number and } 6 < x < 10\\} $\n\n' +
      '(v) $ A = \\{1, 2, 3\\} $, $ B = \\phi $',
      '(i) {1,2,3,5} (ii) {a,b,c,e,i,o,u} (iii) {1,2,3,4,5,6,9,12,15,…} (iv) {2,3,4,5,6,7,8,9} (v) {1,2,3}',
      '(i) Combine and drop the repeats (1 and 3): $ \\{1,2,3,5\\} $.\n\n' +
      '(ii) Combine both: $ \\{a,e,i,o,u,b,c\\} $.\n\n' +
      '(iii) $ A = \\{3,6,9,12,\\dots\\} $ (multiples of 3), $ B = \\{1,2,3,4,5\\} $. Union keeps every number ' +
      'below 6, plus every multiple of 3 from 6 onward: $ \\{1,2,3,4,5,6,9,12,15,\\dots\\} $.\n\n' +
      '(iv) $ A = \\{2,3,4,5,6\\} $, $ B = \\{7,8,9\\} $ — these don’t overlap, so the union is just everything: ' +
      '$ \\{2,3,4,5,6,7,8,9\\} $.\n\n' +
      '(v) Unioning with the empty set changes nothing: $ \\{1,2,3\\} $.'),
    num('NCERT Ex 1.4 · Q2',
      'Let $ A = \\{a, b\\} $, $ B = \\{a, b, c\\} $. Is $ A \\subset B $? What is $ A \\cup B $?',
      'Yes, A ⊂ B; A ∪ B = {a, b, c}',
      'Both elements of A ($ a, b $) are in B, so **$ A \\subset B $**. And whenever a subset is unioned with ' +
      'its parent, nothing new is added — $ A \\cup B = B = \\{a, b, c\\} $.'),
    num('NCERT Ex 1.4 · Q3',
      'If A and B are two sets such that $ A \\subset B $, then what is $ A \\cup B $?',
      'A ∪ B = B',
      'Since every element of A is already inside B, throwing A’s elements into the union adds nothing beyond ' +
      'B itself — so $ A \\cup B = B $ whenever $ A \\subset B $.'),
    num('NCERT Ex 1.4 · Q4',
      'If $ A = \\{1, 2, 3, 4\\} $, $ B = \\{3, 4, 5, 6\\} $, $ C = \\{5, 6, 7, 8\\} $ and $ D = \\{7, 8, 9, 10\\} $; find\n\n' +
      '(i) $ A \\cup B $  (ii) $ A \\cup C $  (iii) $ B \\cup C $  (iv) $ B \\cup D $  (v) $ A \\cup B \\cup C $  ' +
      '(vi) $ A \\cup B \\cup D $  (vii) $ B \\cup C \\cup D $',
      '(i) {1,2,3,4,5,6} (ii) {1,2,3,4,5,6,7,8} (iii) {3,4,5,6,7,8} (iv) {3,4,5,6,7,8,9,10} ' +
      '(v) {1,2,3,4,5,6,7,8} (vi) {1,2,3,4,5,6,7,8,9,10} (vii) {3,4,5,6,7,8,9,10}',
      'Just merge the lists each time, dropping repeats.\n\n' +
      '(i) A, B share nothing to drop: $ \\{1,2,3,4,5,6\\} $.\n\n' +
      '(ii) A and C share nothing: $ \\{1,2,3,4,5,6,7,8\\} $.\n\n' +
      '(iii) B and C share nothing: $ \\{3,4,5,6,7,8\\} $.\n\n' +
      '(iv) B and D share nothing: $ \\{3,4,5,6,7,8,9,10\\} $.\n\n' +
      '(v) Merge all three: $ \\{1,2,3,4,5,6,7,8\\} $.\n\n' +
      '(vi) Merge A, B, D: $ \\{1,2,3,4,5,6,9,10,7,8\\} = \\{1,2,3,4,5,6,7,8,9,10\\} $.\n\n' +
      '(vii) Merge B, C, D: $ \\{3,4,5,6,7,8,9,10\\} $.'),
    num('NCERT Ex 1.4 · Q5',
      'Find the intersection of each pair of sets of question 1 above.',
      '(i) {1,3} (ii) {a} (iii) {3} (iv) φ (v) φ',
      'Keep only what both sets in each pair share.\n\n' +
      '(i) $ X \\cap Y $: shared elements of $ \\{1,3,5\\} $ and $ \\{1,2,3\\} $ are $ 1, 3 $.\n\n' +
      '(ii) $ A \\cap B $: only $ a $ is in both $ \\{a,e,i,o,u\\} $ and $ \\{a,b,c\\} $.\n\n' +
      '(iii) Multiples of 3 meet naturals-below-6 only at $ 3 $: $ \\{3\\} $.\n\n' +
      '(iv) $ \\{2,\\dots,6\\} $ and $ \\{7,8,9\\} $ share nothing: $ \\phi $ (disjoint sets).\n\n' +
      '(v) Intersecting with the empty set always gives $ \\phi $.'),
    num('NCERT Ex 1.4 · Q6',
      'If $ A = \\{3, 5, 7, 9, 11\\} $, $ B = \\{7, 9, 11, 13\\} $, $ C = \\{11, 13, 15\\} $ and ' +
      '$ D = \\{15, 17\\} $; find\n\n' +
      '(i) $ A \\cap B $  (ii) $ B \\cap C $  (iii) $ A \\cap C \\cap D $  (iv) $ A \\cap C $  ' +
      '(v) $ B \\cap D $  (vi) $ A \\cap (B \\cup C) $  (vii) $ A \\cap D $  (viii) $ A \\cap (B \\cup D) $  ' +
      '(ix) $ (A \\cap B) \\cap (B \\cup C) $  (x) $ (A \\cup D) \\cap (B \\cup C) $',
      '(i) {7,9,11} (ii) {11,13} (iii) φ (iv) {11} (v) φ (vi) {7,9,11} (vii) φ (viii) {7,9,11} ' +
      '(ix) {7,9,11} (x) {7,9,11,15}',
      '(i) A, B share $ 7, 9, 11 $.\n\n' +
      '(ii) B, C share $ 11, 13 $.\n\n' +
      '(iii) $ A \\cap C = \\{11\\} $, and $ 11 \\notin D $, so the triple intersection is $ \\phi $.\n\n' +
      '(iv) A, C share only $ 11 $.\n\n' +
      '(v) B has no elements of D at all: $ \\phi $.\n\n' +
      '(vi) $ B \\cup C = \\{7,9,11,13,15\\} $; intersecting with A keeps $ \\{7,9,11\\} $ (13, 15 aren’t in A).\n\n' +
      '(vii) A and D share nothing: $ \\phi $.\n\n' +
      '(viii) $ B \\cup D = \\{7,9,11,13,15,17\\} $; intersecting with A again gives $ \\{7,9,11\\} $.\n\n' +
      '(ix) $ A \\cap B = \\{7,9,11\\} $; $ B \\cup C = \\{7,9,11,13,15\\} $; their intersection is $ \\{7,9,11\\} $.\n\n' +
      '(x) $ A \\cup D = \\{3,5,7,9,11,15,17\\} $; $ B \\cup C = \\{7,9,11,13,15\\} $; intersecting keeps ' +
      '$ \\{7,9,11,15\\} $.'),
    num('NCERT Ex 1.4 · Q7',
      'If $ A = \\{x : x \\text{ is a natural number}\\} $, $ B = \\{x : x \\text{ is an even natural number}\\} $, ' +
      '$ C = \\{x : x \\text{ is an odd natural number}\\} $ and $ D = \\{x : x \\text{ is a prime number}\\} $, find\n\n' +
      '(i) $ A \\cap B $  (ii) $ A \\cap C $  (iii) $ A \\cap D $  (iv) $ B \\cap C $  (v) $ B \\cap D $  ' +
      '(vi) $ C \\cap D $',
      '(i) B (ii) C (iii) D (iv) φ (v) {2} (vi) the set of odd primes',
      'A is *every* natural number, so intersecting A with any of the others just gives that other set back: ' +
      '**(i) $ A \\cap B = B $, (ii) $ A \\cap C = C $, (iii) $ A \\cap D = D $.**\n\n' +
      '(iv) No number is both even and odd at once — **$ \\phi $**.\n\n' +
      '(v) The only even number that is also prime is 2 — every other prime is odd — so **$ B \\cap D = \\{2\\} $**.\n\n' +
      '(vi) Odd numbers that are also prime — every prime except 2 — the **set of odd primes** ' +
      '$ \\{3, 5, 7, 11, \\dots\\} $.'),
    num('NCERT Ex 1.4 · Q8',
      'Which of the following pairs of sets are disjoint?\n\n' +
      '(i) $ \\{1, 2, 3, 4\\} $ and $ \\{x : x \\text{ is a natural number and } 4 \\le x \\le 6\\} $\n\n' +
      '(ii) $ \\{a, e, i, o, u\\} $ and $ \\{c, d, e, f\\} $\n\n' +
      '(iii) $ \\{x : x \\text{ is an even integer}\\} $ and $ \\{x : x \\text{ is an odd integer}\\} $',
      '(i) not disjoint — share 4 (ii) not disjoint — share e (iii) disjoint',
      '(i) The second set is $ \\{4,5,6\\} $, and 4 is common to both — **not disjoint**.\n\n' +
      '(ii) Both sets contain $ e $ — **not disjoint**.\n\n' +
      '(iii) No integer is simultaneously even and odd — nothing shared — **disjoint**.'),
    num('NCERT Ex 1.4 · Q9',
      'If $ A = \\{3, 6, 9, 12, 15, 18, 21\\} $, $ B = \\{4, 8, 12, 16, 20\\} $, ' +
      '$ C = \\{2, 4, 6, 8, 10, 12, 14, 16\\} $, $ D = \\{5, 10, 15, 20\\} $; find\n\n' +
      '(i) $ A - B $  (ii) $ A - C $  (iii) $ A - D $  (iv) $ B - A $  (v) $ C - A $  (vi) $ D - A $  ' +
      '(vii) $ B - C $  (viii) $ B - D $  (ix) $ C - B $  (x) $ D - B $  (xi) $ C - D $  (xii) $ D - C $',
      '(i) {3,6,9,15,18,21} (ii) {3,9,15,18,21} (iii) {3,6,9,12,18,21} (iv) {4,8,16,20} ' +
      '(v) {2,4,8,10,14,16} (vi) {5,10,20} (vii) {20} (viii) {4,8,12,16} (ix) {2,6,10,14} ' +
      '(x) {5,10,15} (xi) {2,4,6,8,12,14,16} (xii) {5,15,20}',
      'For each, remove from the first set whatever also appears in the second.\n\n' +
      '(i) A minus B’s shared element (12): $ \\{3,6,9,15,18,21\\} $.\n\n' +
      '(ii) A minus C’s shared elements (6, 12): $ \\{3,9,15,18,21\\} $.\n\n' +
      '(iii) A minus D’s shared element (15): $ \\{3,6,9,12,18,21\\} $.\n\n' +
      '(iv) B minus A’s shared element (12): $ \\{4,8,16,20\\} $.\n\n' +
      '(v) C minus A’s shared elements (6, 12): $ \\{2,4,8,10,14,16\\} $.\n\n' +
      '(vi) D minus A’s shared element (15): $ \\{5,10,20\\} $.\n\n' +
      '(vii) B minus C’s shared elements (4, 8, 12, 16 — everything in B except 20): $ \\{20\\} $.\n\n' +
      '(viii) B minus D’s shared element (20): $ \\{4,8,12,16\\} $.\n\n' +
      '(ix) C minus B’s shared elements (4, 8, 12, 16): $ \\{2,6,10,14\\} $.\n\n' +
      '(x) D minus B’s shared element (20): $ \\{5,10,15\\} $.\n\n' +
      '(xi) C minus D’s shared element (10): $ \\{2,4,6,8,12,14,16\\} $.\n\n' +
      '(xii) D minus C’s shared elements (5, 15, 20 are NOT in C, so nothing is removed): $ \\{5,15,20\\} $.'),
    num('NCERT Ex 1.4 · Q10',
      'If $ X = \\{a, b, c, d\\} $ and $ Y = \\{f, b, d, g\\} $, find\n\n' +
      '(i) $ X - Y $  (ii) $ Y - X $  (iii) $ X \\cap Y $',
      '(i) {a,c} (ii) {f,g} (iii) {b,d}',
      '(i) Remove $ b, d $ (shared with Y) from X: $ \\{a, c\\} $.\n\n' +
      '(ii) Remove $ b, d $ (shared with X) from Y: $ \\{f, g\\} $.\n\n' +
      '(iii) The elements common to both: $ \\{b, d\\} $.'),
    num('NCERT Ex 1.4 · Q11',
      'If $ \\mathbb{R} $ is the set of real numbers and $ \\mathbb{Q} $ is the set of rational numbers, ' +
      'then what is $ \\mathbb{R} - \\mathbb{Q} $?',
      'The set of irrational numbers',
      '$ \\mathbb{R} - \\mathbb{Q} $ keeps every real number that is **not** rational — by definition, that is ' +
      'exactly the irrational numbers $ \\mathbb{T} $ (numbers like $ \\sqrt{2} $ and $ \\pi $).'),
    num('NCERT Ex 1.4 · Q12',
      'State whether each of the following statement is true or false. Justify your answer.\n\n' +
      '(i) $ \\{2, 3, 4, 5\\} $ and $ \\{3, 6\\} $ are disjoint sets.\n\n' +
      '(ii) $ \\{a, e, i, o, u\\} $ and $ \\{a, b, c, d\\} $ are disjoint sets.\n\n' +
      '(iii) $ \\{2, 6, 10, 14\\} $ and $ \\{3, 7, 11, 15\\} $ are disjoint sets.\n\n' +
      '(iv) $ \\{2, 6, 10\\} $ and $ \\{3, 7, 11\\} $ are disjoint sets.',
      '(i) False (ii) False (iii) True (iv) True',
      '(i) Both contain 3 — **not disjoint**, so **false**.\n\n' +
      '(ii) Both contain $ a $ — **not disjoint**, so **false**.\n\n' +
      '(iii) One set is all $ \\equiv 2 \\pmod 4 $, the other all $ \\equiv 3 \\pmod 4 $ — nothing shared — ' +
      '**true**.\n\n' +
      '(iv) No overlap between the two lists — **true**.'),
  ],
);

/* ── Section 5 — Complement of a set (Ex 1.5) ─────────────────────────────── */
const s5 = sec(
  'Complement of a set',
  'Ex 1.5 — everything a set leaves out of the universal set, and the complement + De Morgan identities.',
  [
    num('NCERT Ex 1.5 · Q1',
      'Let $ U = \\{1, 2, 3, 4, 5, 6, 7, 8, 9\\} $, $ A = \\{1, 2, 3, 4\\} $, $ B = \\{2, 4, 6, 8\\} $ and ' +
      '$ C = \\{3, 4, 5, 6\\} $. Find\n\n' +
      "(i) $ A' $  (ii) $ B' $  (iii) $ (A \\cup C)' $  (iv) $ (A \\cup B)' $  (v) $ (A')' $  (vi) $ (B - C)' $",
      "(i) {5,6,7,8,9} (ii) {1,3,5,7,9} (iii) {7,8,9} (iv) {5,7,9} (v) {1,2,3,4} (vi) {1,3,4,5,6,7,9}",
      "(i) Remove A's elements from U: $ A' = \\{5,6,7,8,9\\} $.\n\n" +
      "(ii) Remove B's elements from U: $ B' = \\{1,3,5,7,9\\} $.\n\n" +
      '(iii) $ A \\cup C = \\{1,2,3,4,5,6\\} $, so $ (A \\cup C)\' = \\{7,8,9\\} $.\n\n' +
      '(iv) $ A \\cup B = \\{1,2,3,4,6,8\\} $, so $ (A \\cup B)\' = \\{5,7,9\\} $.\n\n' +
      "(v) Complementing twice returns the original set: $ (A')' = A = \\{1,2,3,4\\} $.\n\n" +
      '(vi) $ B - C $ removes C’s shared elements (4, 6) from B, giving $ \\{2, 8\\} $; its complement is ' +
      "everything else in U: $ (B-C)' = \\{1,3,4,5,6,7,9\\} $."),
    num('NCERT Ex 1.5 · Q2',
      'If $ U = \\{a, b, c, d, e, f, g, h\\} $, find the complements of the following sets:\n\n' +
      '(i) $ A = \\{a, b, c\\} $  (ii) $ B = \\{d, e, f, g\\} $  (iii) $ C = \\{a, c, e, g\\} $  ' +
      '(iv) $ D = \\{f, g, h, a\\} $',
      "(i) {d,e,f,g,h} (ii) {a,b,c,h} (iii) {b,d,f,h} (iv) {b,c,d,e}",
      "Remove each set's own letters from the full alphabet U = {a,…,h}, and whatever remains is the complement.\n\n" +
      "(i) $ A' = \\{d,e,f,g,h\\} $.\n\n(ii) $ B' = \\{a,b,c,h\\} $.\n\n(iii) $ C' = \\{b,d,f,h\\} $.\n\n" +
      "(iv) $ D' = \\{b,c,d,e\\} $."),
    num('NCERT Ex 1.5 · Q3',
      'Taking the set of natural numbers as the universal set, write down the complements of the following ' +
      'sets:\n\n' +
      '(i) $ \\{x : x \\text{ is an even natural number}\\} $\n\n' +
      '(ii) $ \\{x : x \\text{ is an odd natural number}\\} $\n\n' +
      '(iii) $ \\{x : x \\text{ is a positive multiple of } 3\\} $\n\n' +
      '(iv) $ \\{x : x \\text{ is a prime number}\\} $\n\n' +
      '(v) $ \\{x : x \\text{ is a natural number divisible by } 3 \\text{ and } 5\\} $\n\n' +
      '(vi) $ \\{x : x \\text{ is a perfect square}\\} $\n\n' +
      '(vii) $ \\{x : x \\text{ is a perfect cube}\\} $\n\n' +
      '(viii) $ \\{x : x + 5 = 8\\} $\n\n' +
      '(ix) $ \\{x : 2x + 5 = 9\\} $\n\n' +
      '(x) $ \\{x : x \\ge 7\\} $\n\n' +
      '(xi) $ \\{x : x \\in \\mathbb{N} \\text{ and } 2x + 1 > 10\\} $',
      '(i) the odd naturals (ii) the even naturals (iii) naturals not divisible by 3 (iv) 1 and every ' +
      'composite number (v) naturals not divisible by 15 (vi) naturals that are not perfect squares ' +
      '(vii) naturals that are not perfect cubes (viii) N − {3} (ix) N − {2} (x) {1,2,3,4,5,6} (xi) {1,2,3,4}',
      '(i) Not-even means **odd**: the odd naturals.\n\n' +
      '(ii) Not-odd means **even**: the even naturals.\n\n' +
      '(iii) Everything except the multiples of 3: naturals not divisible by 3.\n\n' +
      '(iv) Everything that is not prime — that’s 1, plus every **composite** number.\n\n' +
      '(v) “Divisible by 3 and 5” means divisible by 15; the complement is naturals not divisible by 15.\n\n' +
      '(vi) Everything except perfect squares.\n\n' +
      '(vii) Everything except perfect cubes.\n\n' +
      '(viii) $ x + 5 = 8 \\Rightarrow x = 3 $, so the set is $ \\{3\\} $ and its complement is ' +
      '$ \\mathbb{N} - \\{3\\} $.\n\n' +
      '(ix) $ 2x + 5 = 9 \\Rightarrow x = 2 $, so the complement is $ \\mathbb{N} - \\{2\\} $.\n\n' +
      '(x) $ x \\ge 7 $ leaves out $ \\{1,2,3,4,5,6\\} $ as its complement.\n\n' +
      '(xi) $ 2x + 1 > 10 \\Rightarrow x > 4.5 \\Rightarrow x \\ge 5 $ (as a natural number); the complement is ' +
      'therefore $ \\{1,2,3,4\\} $.'),
    num('NCERT Ex 1.5 · Q4',
      'If $ U = \\{1, 2, 3, 4, 5, 6, 7, 8, 9\\} $, $ A = \\{2, 4, 6, 8\\} $ and $ B = \\{2, 3, 5, 7\\} $. ' +
      "Verify that\n\n(i) $ (A \\cup B)' = A' \\cap B' $\n\n(ii) $ (A \\cap B)' = A' \\cup B' $",
      "Both verified: (i) both sides equal {1,9} (ii) both sides equal {1,3,4,5,6,7,8,9}",
      '(i) $ A \\cup B = \\{2,3,4,5,6,7,8\\} $, so $ (A \\cup B)\' = \\{1,9\\} $. Separately, ' +
      "$ A' = \\{1,3,5,7,9\\} $ and $ B' = \\{1,4,6,8,9\\} $, so $ A' \\cap B' = \\{1,9\\} $. Both sides match — " +
      '**verified**.\n\n' +
      "(ii) $ A \\cap B = \\{2\\} $, so $ (A \\cap B)' = \\{1,3,4,5,6,7,8,9\\} $. And " +
      "$ A' \\cup B' = \\{1,3,5,7,9\\} \\cup \\{1,4,6,8,9\\} = \\{1,3,4,5,6,7,8,9\\} $. Both sides match — " +
      '**verified** — confirming both of De Morgan’s laws on this example.'),
    num('NCERT Ex 1.5 · Q5',
      "Draw appropriate Venn diagram for each of the following: (i) $ (A \\cup B)' $, (ii) $ A' \\cap B' $, " +
      "(iii) $ (A \\cap B)' $, (iv) $ A' \\cup B' $",
      'A drawing question — see the solution for what each diagram shades',
      'Draw the usual rectangle U with two overlapping circles A and B.\n\n' +
      '**(i) and (ii)** shade the *same* region: everything OUTSIDE both circles — the part of U touched by ' +
      "neither A nor B. That both pictures match is exactly De Morgan's first law, $ (A \\cup B)' = A' \\cap B' $, " +
      'seen visually rather than proved algebraically.\n\n' +
      '**(iii) and (iv)** also shade the *same* region as each other: everything in U **except** the small ' +
      "overlap lens where A and B meet. That match is De Morgan's second law, $ (A \\cap B)' = A' \\cup B' $."),
    num('NCERT Ex 1.5 · Q6',
      'Let $ U $ be the set of all triangles in a plane. If $ A $ is the set of all triangles with at least ' +
      "one angle different from $ 60° $, what is $ A' $?",
      "A' = the set of all equilateral triangles",
      'A excludes exactly the triangles where **no** angle differs from $ 60° $ — meaning all three angles ' +
      "equal $ 60° $. That is precisely the definition of an **equilateral triangle**, so $ A' $ is the set of " +
      'all equilateral triangles.'),
    num('NCERT Ex 1.5 · Q7',
      'Fill in the blanks to make each of the following a true statement:\n\n' +
      "(i) $ A \\cup A' = \\dots $  (ii) $ \\phi' \\cap A = \\dots $  (iii) $ A \\cap A' = \\dots $  " +
      "(iv) $ U' \\cap A = \\dots $",
      "(i) U (ii) A (iii) φ (iv) φ",
      "(i) A set together with its complement makes up the whole universal set: **$ U $**.\n\n" +
      "(ii) $ \\phi' = U $, so $ \\phi' \\cap A = U \\cap A = $ **$ A $**.\n\n" +
      "(iii) A set and its complement share nothing: **$ \\phi $**.\n\n" +
      "(iv) $ U' = \\phi $, so $ U' \\cap A = \\phi \\cap A = $ **$ \\phi $**."),
  ],
);

/* ── Section 6 — Miscellaneous: proofs about set operations (Misc Exercise) ─ */
const s6 = sec(
  'Miscellaneous: proofs about set operations',
  'The Miscellaneous Exercise — short proofs and counterexamples that pull the whole chapter together.',
  [
    num('NCERT Misc · Q1',
      'Decide, among the following sets, which sets are subsets of one and another:\n\n' +
      '$ A = \\{x : x \\in \\mathbb{R} \\text{ and } x \\text{ satisfies } x^2 - 8x + 12 = 0\\} $, ' +
      '$ B = \\{2, 4, 6\\} $, $ C = \\{2, 4, 6, 8, \\dots\\} $, $ D = \\{6\\} $.',
      'D ⊂ A ⊂ B ⊂ C',
      'Solve the quadratic first: $ x^2 - 8x + 12 = (x-2)(x-6) = 0 $, so $ x = 2 $ or $ 6 $, giving ' +
      '$ A = \\{2, 6\\} $. Also $ B = \\{2,4,6\\} $, $ C $ = every positive even integer, $ D = \\{6\\} $.\n\n' +
      'Check nesting: $ D = \\{6\\} \\subset A = \\{2,6\\} $ (6 is in A). $ A = \\{2,6\\} \\subset B = \\{2,4,6\\} $ ' +
      '(both 2, 6 are in B — note $ B \\not\\subset A $, since 4 is missing from A). $ B = \\{2,4,6\\} \\subset C $ ' +
      '(all even). So the chain is $ D \\subset A \\subset B \\subset C $.'),
    num('NCERT Misc · Q2',
      'In each of the following, determine whether the statement is true or false. If it is true, prove it. ' +
      'If it is false, give an example.\n\n' +
      '(i) If $ x \\in A $ and $ A \\in B $, then $ x \\in B $\n\n' +
      '(ii) If $ A \\subset B $ and $ B \\in C $, then $ A \\in C $\n\n' +
      '(iii) If $ A \\subset B $ and $ B \\subset C $, then $ A \\subset C $\n\n' +
      '(iv) If $ A \\not\\subset B $ and $ B \\not\\subset C $, then $ A \\not\\subset C $\n\n' +
      '(v) If $ x \\in A $ and $ A \\not\\subset B $, then $ x \\in B $\n\n' +
      '(vi) If $ A \\subset B $ and $ x \\notin B $, then $ x \\notin A $',
      '(i) False (ii) False (iii) True (iv) False (v) False (vi) True',
      '**(i) False.** Let $ A = \\{1\\} $, $ B = \\{\\{1\\}, 2\\} $. Then $ 1 \\in A $ and $ A \\in B $ ' +
      '(since $ \\{1\\} $ is literally an element of B), but $ 1 \\notin B $ — B’s elements are the *set* ' +
      '$ \\{1\\} $ and the number 2, not the bare number 1.\n\n' +
      '**(ii) False.** Let $ A = \\{1\\} $, $ B = \\{1, 2\\} $, $ C = \\{\\{1,2\\}, 3\\} $. Then $ A \\subset B $ ' +
      'and $ B \\in C $, but $ A \\in C $ would need $ \\{1\\} $ itself to be a listed element of C — it isn’t ' +
      '($ \\{1,2\\} $ is, not $ \\{1\\} $).\n\n' +
      '**(iii) True.** Every element of A is in B (since $ A \\subset B $), and every element of B is in C ' +
      '(since $ B \\subset C $) — so every element of A reaches C too, by chaining the two facts. Hence ' +
      '$ A \\subset C $.\n\n' +
      '**(iv) False.** Let $ A = \\{1,2\\} $, $ B = \\{2,3\\} $, $ C = \\{1,2,4\\} $. Here $ A \\not\\subset B $ ' +
      '(2 is fine but 1 isn’t in B) and $ B \\not\\subset C $ (3 isn’t in C) — yet $ A \\subset C $ actually ' +
      'holds (both 1, 2 are in C), contradicting the claim.\n\n' +
      '**(v) False.** $ A \\not\\subset B $ only says *some* element of A is missing from B — it says nothing ' +
      'about a specific $ x $. Let $ A = \\{1,2\\} $, $ B = \\{1,3\\} $ (so $ A \\not\\subset B $, since ' +
      '$ 2 \\notin B $) and take $ x = 2 \\in A $; then $ x \\notin B $, contradicting the claim that $ x \\in B $.\n\n' +
      '**(vi) True.** This is just the contrapositive of “$ A \\subset B $ means every element of A is in B”: ' +
      'if $ x $ were in A, it would have to land in B too — but $ x \\notin B $, so $ x $ cannot be in A.'),
    num('NCERT Misc · Q3',
      'Let A, B, and C be the sets such that $ A \\cup B = A \\cup C $ and $ A \\cap B = A \\cap C $. Show ' +
      'that $ B = C $.',
      'Proved by showing B ⊂ C and C ⊂ B',
      'Take any $ x \\in B $. Since $ B \\subset A \\cup B $, we have $ x \\in A \\cup B = A \\cup C $, so ' +
      '$ x \\in A $ or $ x \\in C $.\n\n' +
      '**If $ x \\in A $:** then $ x $ is in both A and B, so $ x \\in A \\cap B $. But $ A \\cap B = A \\cap C $, ' +
      'so $ x \\in A \\cap C $, which means $ x \\in C $.\n\n' +
      '**If $ x \\in C $** directly, we’re already done.\n\n' +
      'Either way $ x \\in C $, so **$ B \\subset C $**. Running the identical argument with B and C swapped ' +
      'gives **$ C \\subset B $**. Both inclusions together give $ B = C $.'),
    num('NCERT Misc · Q4',
      'Show that the following four conditions are equivalent:\n\n' +
      "(i) $ A \\subset B $  (ii) $ A - B = \\phi $  (iii) $ A \\cup B = B $  (iv) $ A \\cap B = A $",
      'Proved via the cycle (i) ⟹ (ii) ⟹ (iii) ⟹ (iv) ⟹ (i)',
      'Chain the four implications around in a loop — proving each one is enough to establish all four are ' +
      'equivalent.\n\n' +
      '**(i) ⟹ (ii):** if $ A \\subset B $, every element of A is in B, so nothing is ever left over in ' +
      '$ A - B $ — it must be $ \\phi $.\n\n' +
      '**(ii) ⟹ (iii):** if $ A - B = \\phi $, every element of A is already inside B, so unioning A into B ' +
      'adds nothing new — $ A \\cup B = B $.\n\n' +
      '**(iii) ⟹ (iv):** intersect both sides of $ A \\cup B = B $ with A: the left side, ' +
      '$ A \\cap (A \\cup B) $, always equals $ A $ (absorption — see Misc Q7), so $ A = A \\cap B $.\n\n' +
      '**(iv) ⟹ (i):** if $ A \\cap B = A $, then by the very definition of intersection, every element of A ' +
      'is also in B — that is exactly $ A \\subset B $.\n\n' +
      'The loop closes, so all four conditions say the same thing in different words.'),
    num('NCERT Misc · Q5',
      'Show that if $ A \\subset B $, then $ C - B \\subset C - A $.',
      'Proved directly from the definitions',
      'Take any $ x \\in C - B $. By definition, $ x \\in C $ and $ x \\notin B $.\n\n' +
      'Now suppose, for contradiction, that $ x \\in A $. Since $ A \\subset B $, that would force $ x \\in B $ ' +
      '— but we already know $ x \\notin B $. So $ x \\notin A $.\n\n' +
      'Combining: $ x \\in C $ and $ x \\notin A $, which is exactly the definition of $ x \\in C - A $. Since ' +
      'this holds for every $ x \\in C-B $, we get $ C - B \\subset C - A $.'),
    num('NCERT Misc · Q6',
      'Show that for any sets A and B, $ A = (A \\cap B) \\cup (A - B) $ and ' +
      '$ A \\cup (B - A) = (A \\cup B) $.',
      'Proved by splitting A into two exhaustive, non-overlapping pieces',
      '**First identity.** Every element of A either also sits in B, or it doesn’t — there’s no third option. ' +
      'The ones that do land in $ A \\cap B $; the ones that don’t land in $ A - B $. Between them these two ' +
      'pieces cover all of A exactly once, so $ (A \\cap B) \\cup (A - B) = A $.\n\n' +
      '**Second identity.** $ B - A $ picks up exactly the elements of B that are missing from A. Adding that ' +
      'onto A gives you everything already in A, plus everything in B that wasn’t — which is precisely ' +
      '$ A \\cup B $. So $ A \\cup (B - A) = A \\cup B $.'),
    num('NCERT Misc · Q7',
      'Using properties of sets, show that\n\n' +
      '(i) $ A \\cup (A \\cap B) = A $  (ii) $ A \\cap (A \\cup B) = A $.',
      'Both proved by the absorption laws',
      '**(i)** $ A \\cap B $ is always a subset of A (an intersection can never have more elements than either ' +
      'parent). Unioning A with one of its own subsets adds nothing beyond A itself, so ' +
      '$ A \\cup (A \\cap B) = A $.\n\n' +
      '**(ii)** A is always a subset of $ A \\cup B $ (a union can never have fewer elements than either ' +
      'parent). Intersecting A with a bigger set that already fully contains it just gives back A, so ' +
      '$ A \\cap (A \\cup B) = A $.\n\n' +
      'These two are the **absorption laws** — worth recognising on sight, since they end many longer proofs ' +
      'in one step.'),
    num('NCERT Misc · Q8',
      'Show that $ A \\cap B = A \\cap C $ need not imply $ B = C $.',
      'Disproved with a counterexample: A={1,2}, B={2,3}, C={2,4}',
      'One clean counterexample is enough to show the claim can fail. Let $ A = \\{1, 2\\} $, $ B = \\{2, 3\\} $, ' +
      '$ C = \\{2, 4\\} $.\n\n' +
      'Then $ A \\cap B = \\{2\\} $ and $ A \\cap C = \\{2\\} $ — **equal**, exactly as the hypothesis requires.\n\n' +
      'But $ B = \\{2,3\\} \\ne \\{2,4\\} = C $ — so equal intersections with A do **not** force $ B = C $. What ' +
      'goes wrong outside A (the 3 vs the 4) is invisible to the intersection.'),
    num('NCERT Misc · Q9',
      'Let A and B be sets. If $ A \\cap X = B \\cap X = \\phi $ and $ A \\cup X = B \\cup X $ for some set X, ' +
      'show that $ A = B $. (Hint: $ A = A \\cap (A \\cup X) $, $ B = B \\cap (B \\cup X) $, and use the ' +
      'Distributive law.)',
      'Proved: both A and B equal A ∩ B, so they are equal to each other',
      'Follow the hint. By absorption, $ A = A \\cap (A \\cup X) $. Since $ A \\cup X = B \\cup X $ (given), ' +
      'substitute: $ A = A \\cap (B \\cup X) $.\n\n' +
      'Distribute: $ A = (A \\cap B) \\cup (A \\cap X) $. But $ A \\cap X = \\phi $ (given), so the second piece ' +
      'vanishes: $ A = (A \\cap B) \\cup \\phi = A \\cap B $.\n\n' +
      'Running the identical steps starting from B: $ B = B \\cap (B \\cup X) = B \\cap (A \\cup X) = ' +
      '(B \\cap A) \\cup (B \\cap X) = (A \\cap B) \\cup \\phi = A \\cap B $.\n\n' +
      'Both A and B equal the same set $ A \\cap B $, so **$ A = B $**.'),
    num('NCERT Misc · Q10',
      'Find sets A, B and C such that $ A \\cap B $, $ B \\cap C $ and $ A \\cap C $ are non-empty sets and ' +
      '$ A \\cap B \\cap C = \\phi $.',
      'Example: A = {1,2}, B = {2,3}, C = {1,3}',
      'Any three sets that overlap in *pairs* but never all share one common element will work. Try ' +
      '$ A = \\{1, 2\\} $, $ B = \\{2, 3\\} $, $ C = \\{1, 3\\} $.\n\n' +
      'Check the pairs: $ A \\cap B = \\{2\\} $ (non-empty). $ B \\cap C = \\{3\\} $ (non-empty). ' +
      '$ A \\cap C = \\{1\\} $ (non-empty).\n\n' +
      'Now check all three together: is there an element in A **and** B **and** C at once? $ 2 \\in A, B $ ' +
      'but $ 2 \\notin C $; $ 3 \\in B, C $ but $ 3 \\notin A $; $ 1 \\in A, C $ but $ 1 \\notin B $. Nothing ' +
      'survives all three, so $ A \\cap B \\cap C = \\phi $ — exactly what was needed.'),
  ],
);

const practicePage = {
  slug: 'sets-practice-ncert',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 49 NCERT questions for this chapter (Exercises 1.1–1.5 and the Miscellaneous Exercise), each with a full worked solution.',
  page_number: 9,
  page_type: 'lesson',
  blocks: [
    b('image', 0, {
      src: '', alt: 'A grid of worked set-theory problems glowing on a dark background', caption: '',
      width: 'full', aspect_ratio: '16:5',
      generation_prompt:
        'Ultra-wide cinematic banner (16:5). A tidy grid of glowing hand-worked set-theory notation — braces ' +
        'with elements, a small Venn diagram, a subset symbol, an interval on a number line — arranged like ' +
        'flash-cards on a deep near-black background, with a pen mid-stroke solving one of them. Violet, amber ' +
        'and sky-blue glow, elegant graphing-poster style, no readable text.',
    }),
    b('text', 1, {
      markdown:
        'You have read the chapter — now **drill it**. Below are **all 49 NCERT questions** for this chapter ' +
        '(Exercises 1.1 through 1.5, and the Miscellaneous Exercise), grouped by the skill each exercise ' +
        'trains.\n\n' +
        'Try every question on paper **first**. Only then tap to open the worked solution — the struggle ' +
        'before you peek is what makes it stick. The solution shows every step, so a question you get wrong ' +
        'becomes a mini-lesson, not just a red cross.',
    }),
    b('practice_bank', 2, {
      title: 'NCERT Exercises · Sets',
      intro:
        'Pick a theme on the left. Each question carries its NCERT source tag; tap a question to reveal a ' +
        'full, step-by-step worked solution in plain language.',
      sections: [s1, s2, s3, s4, s5, s6],
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
    const total = [s1, s2, s3, s4, s5, s6].reduce((n, s) => n + s.items.length, 0);
    console.log(`practice page DONE (unpublished) · ${[s1, s2, s3, s4, s5, s6].length} sections · ${total} questions.`);
  })().catch((e) => { console.error(e); process.exit(1); });
}
