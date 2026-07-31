'use strict';
/* Class 11 Math · Ch.5 Linear Inequalities — PRACTICE PAGE RECONCILIATION.
   The real NCERT PDF (rationalised 2023-24 edition) became available after the
   chapter was first built without it. This script REPLACES the practice_bank
   block's items with the REAL, COMPLETE, verbatim NCERT exercise set:
     - Exercise 5.1  (26 questions, Q1-Q26)
     - Miscellaneous Exercise on Chapter 5 (14 questions, Q1-Q14)
   = 40 real ncert_exercise items, up from the 23 hand-authored-but-honestly-labelled
   items in the original build (see chapter plan doc §A/§G for that history).

   KEY FINDING (see plan doc update): the rationalised 2023-24 NCERT Ch.5 has NO
   "graphical solution of linear inequalities in two variables" or "system of
   inequalities in two variables" section at all — those were cut in the
   rationalisation. The real chapter is ONLY: 5.1 Introduction, 5.2 Inequalities
   (definitions), 5.3 Algebraic Solutions of Linear Inequalities in One Variable
   and their Graphical Representation (one-variable, number-line only), then
   Miscellaneous Examples/Exercise (systems of ONE-variable inequalities, unit
   conversion, mixture word problems). So every real exercise question is a
   one-variable (or double/compound one-variable) inequality or word problem —
   there is no real two-variable-graphing exercise to source, which is why
   sections 3-4 of the original build (single-region graphs, systems of two/three)
   are dropped from the practice bank entirely rather than "reconciled" — there is
   nothing genuine to reconcile them against. That lesson content itself (pages
   2-4) is left in place as clearly-labelled enrichment (see the syllabus-note
   callout added to page 2), per CLAUDE.md §0.6 (never delete founder content).

   Every number below was independently re-derived by hand from the verbatim
   question text (Rule 0 anti-hallucination gate) and cross-checked against the
   long-standing published NCERT answer key before being written down.

   Uses book-writer.savePage directly (NOT insertPages) since this EDITS an
   existing page rather than creating a new one. Idempotent-by-construction:
   running it again just re-saves the same target content (harmless).
   Run: node scripts/math11-book/reconcile_ch5_practice.js */
const bw = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const num = (source_label, prompt, answer, solution) =>
  ({ id: uuidv4(), kind: 'numerical', source: 'ncert_exercise', source_label, prompt, answer, solution });
const sec = (title, blurb, items) => ({ id: uuidv4(), title, blurb, items });

/* ══════════════════════════════════════════════════════════════════════════
   EXERCISE 5.1 — Inequalities in One Variable (26 questions, verbatim)
   ══════════════════════════════════════════════════════════════════════════ */
const ex51 = sec(
  'Exercise 5.1 — Inequalities in One Variable',
  'The full, real NCERT exercise, verbatim from the textbook — 26 questions on solving one-variable inequalities, restricted domains, number-line graphs, and word problems.',
  [
    num('NCERT Ex 5.1 · Q1',
      'Solve $ 24x < 100 $, when (i) $ x $ is a natural number, (ii) $ x $ is an integer.',
      '(i) $ x \\in \\{1, 2, 3, 4\\} $  (ii) $ x \\in \\{\\ldots, -2, -1, 0, 1, 2, 3, 4\\} $',
      'Divide both sides by $ 24 $ — positive, sign stays:\n\n$ x < \\frac{100}{24} = \\frac{25}{6} \\approx 4.17 $\n\n' +
      '**(i) Natural numbers** less than $ 4.17 $: $ x \\in \\{1, 2, 3, 4\\} $.\n\n' +
      '**(ii) Integers** less than $ 4.17 $: every integer up to $ 4 $ works, running off unboundedly in the ' +
      'negative direction: $ x \\in \\{\\ldots, -2, -1, 0, 1, 2, 3, 4\\} $.'),
    num('NCERT Ex 5.1 · Q2',
      'Solve $ -12x > 30 $, when (i) $ x $ is a natural number, (ii) $ x $ is an integer.',
      '(i) No solution  (ii) $ x \\in \\{\\ldots, -5, -4, -3\\} $',
      'Divide both sides by $ -12 $ — **negative**, so the sign flips from $ > $ to $ < $:\n\n' +
      '$ x < \\frac{30}{-12} = -2.5 $\n\n' +
      '**(i) Natural numbers** are $ 1, 2, 3, \\ldots $ — all positive, so **none** of them can be less than ' +
      '$ -2.5 $. There is **no solution** in the naturals.\n\n' +
      '**(ii) Integers** less than $ -2.5 $: $ x \\in \\{\\ldots, -5, -4, -3\\} $.'),
    num('NCERT Ex 5.1 · Q3',
      'Solve $ 5x - 3 < 7 $, when (i) $ x $ is an integer, (ii) $ x $ is a real number.',
      '(i) $ x \\in \\{\\ldots, -1, 0, 1\\} $  (ii) $ x \\in (-\\infty, 2) $',
      'Add $ 3 $ to both sides:\n\n$ 5x < 10 $\n\n' +
      'Divide by $ 5 $ — positive:\n\n$ x < 2 $\n\n' +
      '**(i) Integers** less than $ 2 $: $ x \\in \\{\\ldots, -2, -1, 0, 1\\} $.\n\n' +
      '**(ii) Reals**: every real number less than $ 2 $, i.e. $ x \\in (-\\infty, 2) $.'),
    num('NCERT Ex 5.1 · Q4',
      'Solve $ 3x + 8 > 2 $, when (i) $ x $ is an integer, (ii) $ x $ is a real number.',
      '(i) $ x \\in \\{-1, 0, 1, 2, \\ldots\\} $  (ii) $ x \\in (-2, \\infty) $',
      'Subtract $ 8 $ from both sides:\n\n$ 3x > -6 $\n\n' +
      'Divide by $ 3 $ — positive:\n\n$ x > -2 $\n\n' +
      '**(i) Integers** greater than $ -2 $: $ x \\in \\{-1, 0, 1, 2, \\ldots\\} $, unbounded above.\n\n' +
      '**(ii) Reals**: $ x \\in (-2, \\infty) $.'),
    num('NCERT Ex 5.1 · Q5',
      'Solve for real $ x $: $ 4x + 3 < 5x + 7 $.',
      '$ x > -4 $',
      'Subtract $ 5x $ from both sides:\n\n$ -x + 3 < 7 $\n\n' +
      'Subtract $ 3 $:\n\n$ -x < 4 $\n\n' +
      'Multiply by $ -1 $ — **flip**:\n\n$ x > -4 $.'),
    num('NCERT Ex 5.1 · Q6',
      'Solve for real $ x $: $ 3x - 7 > 5x - 1 $.',
      '$ x < -3 $',
      'Subtract $ 3x $ from both sides:\n\n$ -7 > 2x - 1 $\n\n' +
      'Add $ 1 $:\n\n$ -6 > 2x $\n\n' +
      'Divide by $ 2 $ — positive:\n\n$ -3 > x $, i.e. $ x < -3 $.'),
    num('NCERT Ex 5.1 · Q7',
      'Solve for real $ x $: $ 3(x - 1) \\leq 2(x - 3) $.',
      '$ x \\leq -3 $',
      'Expand both sides:\n\n$ 3x - 3 \\leq 2x - 6 $\n\n' +
      'Subtract $ 2x $:\n\n$ x - 3 \\leq -6 $\n\n' +
      'Add $ 3 $:\n\n$ x \\leq -3 $.'),
    num('NCERT Ex 5.1 · Q8',
      'Solve for real $ x $: $ 3(2 - x) \\geq 2(1 - x) $.',
      '$ x \\leq 4 $',
      'Expand both sides:\n\n$ 6 - 3x \\geq 2 - 2x $\n\n' +
      'Add $ 2x $:\n\n$ 6 - x \\geq 2 $\n\n' +
      'Subtract $ 6 $:\n\n$ -x \\geq -4 $\n\n' +
      'Multiply by $ -1 $ — **flip**:\n\n$ x \\leq 4 $.'),
    num('NCERT Ex 5.1 · Q9',
      'Solve for real $ x $: $ x + \\frac{x}{2} + \\frac{x}{3} < 11 $.',
      '$ x < 6 $',
      'Clear the fractions by multiplying every term by the LCD, $ 6 $ (positive, sign stays):\n\n' +
      '$ 6x + 3x + 2x < 66 $\n\n' +
      '$ 11x < 66 $\n\n' +
      'Divide by $ 11 $:\n\n$ x < 6 $.'),
    num('NCERT Ex 5.1 · Q10',
      'Solve for real $ x $: $ \\frac{x}{3} > \\frac{x}{2} + 1 $.',
      '$ x < -6 $',
      'Multiply every term by $ 6 $ (the LCD, positive):\n\n$ 2x > 3x + 6 $\n\n' +
      'Subtract $ 3x $:\n\n$ -x > 6 $\n\n' +
      'Multiply by $ -1 $ — **flip**:\n\n$ x < -6 $.'),
    num('NCERT Ex 5.1 · Q11',
      'Solve for real $ x $: $ \\frac{3(x-2)}{5} \\leq \\frac{5(2-x)}{3} $.',
      '$ x \\leq 2 $',
      'Multiply both sides by $ 15 $ (positive, clears both denominators):\n\n' +
      '$ 9(x-2) \\leq 25(2-x) $\n\n' +
      '$ 9x - 18 \\leq 50 - 25x $\n\n' +
      'Add $ 25x $:\n\n$ 34x - 18 \\leq 50 $\n\n' +
      'Add $ 18 $:\n\n$ 34x \\leq 68 $\n\n' +
      'Divide by $ 34 $:\n\n$ x \\leq 2 $.'),
    num('NCERT Ex 5.1 · Q12',
      'Solve for real $ x $: $ \\frac{1}{2}\\left(\\frac{3x}{5} + 4\\right) \\geq \\frac{1}{3}(x - 6) $.',
      '$ x \\leq 120 $',
      'Multiply both sides by $ 30 $ (positive, clears every denominator at once):\n\n' +
      '$ 9x + 60 \\geq 10(x - 6) $\n\n' +
      '$ 9x + 60 \\geq 10x - 60 $\n\n' +
      'Subtract $ 9x $:\n\n$ 60 \\geq x - 60 $\n\n' +
      'Add $ 60 $:\n\n$ 120 \\geq x $, i.e. $ x \\leq 120 $.'),
    num('NCERT Ex 5.1 · Q13',
      'Solve for real $ x $: $ 2(2x + 3) - 10 < 6(x - 2) $.',
      '$ x > 4 $',
      'Expand both sides:\n\n$ 4x + 6 - 10 < 6x - 12 $\n\n$ 4x - 4 < 6x - 12 $\n\n' +
      'Subtract $ 4x $:\n\n$ -4 < 2x - 12 $\n\n' +
      'Add $ 12 $:\n\n$ 8 < 2x $\n\n' +
      'Divide by $ 2 $:\n\n$ 4 < x $, i.e. $ x > 4 $.'),
    num('NCERT Ex 5.1 · Q14',
      'Solve for real $ x $: $ 37 - (3x + 5) \\geq 9x - 8(x - 3) $.',
      '$ x \\leq 2 $',
      'Simplify the left side: $ 37 - 3x - 5 = 32 - 3x $.\n\n' +
      'Simplify the right side: $ 9x - 8x + 24 = x + 24 $.\n\n' +
      'So: $ 32 - 3x \\geq x + 24 $\n\n' +
      'Subtract $ x $ and $ 24 $ from both sides:\n\n$ 8 \\geq 4x $\n\n' +
      'Divide by $ 4 $:\n\n$ 2 \\geq x $, i.e. $ x \\leq 2 $.'),
    num('NCERT Ex 5.1 · Q15',
      'Solve for real $ x $: $ \\frac{x}{4} < \\frac{5x - 2}{3} - \\frac{7x - 3}{5} $.',
      '$ x > 4 $',
      'Multiply every term by $ 60 $, the LCD of $ 4, 3, 5 $ (positive, sign stays):\n\n' +
      '$ 15x < 20(5x - 2) - 12(7x - 3) $\n\n' +
      '$ 15x < (100x - 40) - (84x - 36) $\n\n' +
      '$ 15x < 16x - 4 $\n\n' +
      'Subtract $ 16x $:\n\n$ -x < -4 $\n\n' +
      'Multiply by $ -1 $ — **flip**:\n\n$ x > 4 $.'),
    num('NCERT Ex 5.1 · Q16',
      'Solve for real $ x $: $ \\frac{2x - 1}{3} \\geq \\frac{3x - 2}{4} - \\frac{2 - x}{5} $.',
      '$ x \\leq 2 $',
      'Multiply every term by $ 60 $, the LCD of $ 3, 4, 5 $ (positive, sign stays):\n\n' +
      '$ 20(2x - 1) \\geq 15(3x - 2) - 12(2 - x) $\n\n' +
      '$ 40x - 20 \\geq (45x - 30) - (24 - 12x) $\n\n' +
      '$ 40x - 20 \\geq 57x - 54 $\n\n' +
      'Subtract $ 40x $ and add $ 54 $:\n\n$ 34 \\geq 17x $\n\n' +
      'Divide by $ 17 $:\n\n$ 2 \\geq x $, i.e. $ x \\leq 2 $.'),
    num('NCERT Ex 5.1 · Q17',
      'Solve $ 3x - 2 < 2x + 1 $ and show the graph of the solution on the number line.',
      '$ x < 3 $ — open circle at $ 3 $, ray shaded to the left',
      'Subtract $ 2x $:\n\n$ x - 2 < 1 $\n\n' +
      'Add $ 2 $:\n\n$ x < 3 $\n\n' +
      'On the number line: an **open** circle at $ 3 $ (not included, strict $ < $), with the ray to its left shaded.'),
    num('NCERT Ex 5.1 · Q18',
      'Solve $ 5x - 3 \\geq 3x - 5 $ and show the graph of the solution on the number line.',
      '$ x \\geq -1 $ — solid dot at $ -1 $, ray shaded to the right',
      'Subtract $ 3x $:\n\n$ 2x - 3 \\geq -5 $\n\n' +
      'Add $ 3 $:\n\n$ 2x \\geq -2 $\n\n' +
      'Divide by $ 2 $:\n\n$ x \\geq -1 $\n\n' +
      'On the number line: a **solid (filled)** dot at $ -1 $ (included, since $ \\geq $), with the ray to its right shaded.'),
    num('NCERT Ex 5.1 · Q19',
      'Solve $ 3(1 - x) < 2(x + 4) $ and show the graph of the solution on the number line.',
      '$ x > -1 $ — open circle at $ -1 $, ray shaded to the right',
      'Expand both sides:\n\n$ 3 - 3x < 2x + 8 $\n\n' +
      'Subtract $ 2x $ and $ 3 $:\n\n$ -5x < 5 $\n\n' +
      'Divide by $ -5 $ — **flip**:\n\n$ x > -1 $\n\n' +
      'On the number line: an **open** circle at $ -1 $, with the ray to its right shaded.'),
    num('NCERT Ex 5.1 · Q20',
      'Solve $ \\frac{x}{2} \\geq \\frac{5x - 2}{3} - \\frac{7x - 3}{5} $ and show the graph of the solution on the number line.',
      '$ x \\geq -\\frac{2}{7} $ — solid dot at $ -\\frac{2}{7} $, ray shaded to the right',
      'Multiply every term by $ 30 $, the LCD of $ 2, 3, 5 $ (positive, sign stays):\n\n' +
      '$ 15x \\geq 10(5x - 2) - 6(7x - 3) $\n\n' +
      '$ 15x \\geq (50x - 20) - (42x - 18) $\n\n' +
      '$ 15x \\geq 8x - 2 $\n\n' +
      'Subtract $ 8x $:\n\n$ 7x \\geq -2 $\n\n' +
      'Divide by $ 7 $:\n\n$ x \\geq -\\frac{2}{7} $\n\n' +
      'On the number line: a **solid** dot at $ -\\frac{2}{7} $, with the ray to its right shaded.'),
    num('NCERT Ex 5.1 · Q21',
      'Ravi obtained 70 and 75 marks in the first two unit tests. Find the minimum marks he should get in the third test to have an average of at least 60 marks.',
      'At least $ 35 $ marks',
      'Let his third-test score be $ x $. The average of all three tests must be at least $ 60 $:\n\n' +
      '$ \\frac{70 + 75 + x}{3} \\geq 60 $\n\n' +
      'Multiply by $ 3 $:\n\n$ 145 + x \\geq 180 $\n\n' +
      'Subtract $ 145 $:\n\n$ x \\geq 35 $\n\n' +
      'Ravi needs **at least 35 marks** in the third test.'),
    num('NCERT Ex 5.1 · Q22',
      'To receive Grade \'A\' in a course, one must obtain an average of 90 marks or more in five examinations (each of 100 marks). If Sunita\'s marks in the first four examinations are 87, 92, 94 and 95, find the minimum marks she must obtain in the fifth examination to get grade \'A\' in the course.',
      'At least $ 82 $ marks',
      'Let her fifth-exam score be $ x $. The average of all five must be at least $ 90 $:\n\n' +
      '$ \\frac{87 + 92 + 94 + 95 + x}{5} \\geq 90 $\n\n' +
      'The first four add to $ 368 $, so:\n\n$ \\frac{368 + x}{5} \\geq 90 $\n\n' +
      'Multiply by $ 5 $:\n\n$ 368 + x \\geq 450 $\n\n' +
      'Subtract $ 368 $:\n\n$ x \\geq 82 $\n\n' +
      'Sunita needs **at least 82 marks** in the fifth examination.'),
    num('NCERT Ex 5.1 · Q23',
      'Find all pairs of consecutive odd positive integers, both of which are smaller than 10, such that their sum is more than 11.',
      '$ (5, 7) $ and $ (7, 9) $',
      'Let the smaller odd integer be $ x $, so the next consecutive odd integer is $ x + 2 $.\n\n' +
      '**Both smaller than 10:** since the larger one is $ x+2 $, we need $ x + 2 < 10 $, i.e. $ x < 8 $.\n\n' +
      '**Sum more than 11:** $ x + (x + 2) > 11 \\Rightarrow 2x + 2 > 11 \\Rightarrow 2x > 9 \\Rightarrow x > 4.5 $.\n\n' +
      'So $ x $ is an odd positive integer with $ 4.5 < x < 8 $: only $ x = 5 $ and $ x = 7 $ qualify.\n\n' +
      'The pairs are $ (5, 7) $ and $ (7, 9) $. (Check the last: both $ 7 $ and $ 9 $ are $ < 10 $ ✓, sum $ = 16 > 11 $ ✓.)'),
    num('NCERT Ex 5.1 · Q24',
      'Find all pairs of consecutive even positive integers, both of which are larger than 5, such that their sum is less than 23.',
      '$ (6, 8),\\ (8, 10),\\ (10, 12) $',
      'Let the smaller even integer be $ x $, so the next consecutive even integer is $ x + 2 $.\n\n' +
      '**Both larger than 5:** since $ x $ is even and positive, the smallest allowed value is $ x = 6 $.\n\n' +
      '**Sum less than 23:** $ x + (x + 2) < 23 \\Rightarrow 2x + 2 < 23 \\Rightarrow 2x < 21 \\Rightarrow x < 10.5 $.\n\n' +
      'So $ x $ is an even integer with $ 5 < x < 10.5 $: $ x \\in \\{6, 8, 10\\} $.\n\n' +
      'The pairs are $ (6, 8),\\ (8, 10),\\ (10, 12) $. (Check the last: both $ >5 $ ✓, sum $ = 22 < 23 $ ✓.)'),
    num('NCERT Ex 5.1 · Q25',
      'The longest side of a triangle is 3 times the shortest side and the third side is 2 cm shorter than the longest side. If the perimeter of the triangle is at least 61 cm, find the minimum length of the shortest side.',
      'At least $ 9 $ cm',
      'Let the shortest side be $ x $ cm. Then the longest side is $ 3x $, and the third side is $ 3x - 2 $.\n\n' +
      'The perimeter must be at least $ 61 $:\n\n$ x + 3x + (3x - 2) \\geq 61 $\n\n' +
      '$ 7x - 2 \\geq 61 $\n\n' +
      'Add $ 2 $:\n\n$ 7x \\geq 63 $\n\n' +
      'Divide by $ 7 $:\n\n$ x \\geq 9 $\n\n' +
      'The shortest side must be **at least 9 cm**.'),
    num('NCERT Ex 5.1 · Q26',
      'A man wants to cut three lengths from a single piece of board of length 91 cm. The second length is to be 3 cm longer than the shortest, and the third length is to be twice as long as the shortest. What are the possible lengths of the shortest board if the third piece is to be at least 5 cm longer than the second?\n\n' +
      '[Hint: If $ x $ is the length of the shortest board, then $ x $, $ (x+3) $ and $ 2x $ are the lengths of the second and third piece, respectively. Thus $ x + (x+3) + 2x \\leq 91 $ and $ 2x \\geq (x+3) + 5 $.]',
      '$ 8 \\leq x \\leq 22 $ (in cm)',
      'Two conditions apply at once.\n\n' +
      '**Total board length condition:** $ x + (x+3) + 2x \\leq 91 \\Rightarrow 4x + 3 \\leq 91 \\Rightarrow 4x \\leq 88 \\Rightarrow x \\leq 22 $.\n\n' +
      '**Third-piece condition:** $ 2x \\geq (x+3) + 5 \\Rightarrow 2x \\geq x + 8 \\Rightarrow x \\geq 8 $.\n\n' +
      'Both must hold together: $ 8 \\leq x \\leq 22 $. The shortest board can be **anywhere from 8 cm to 22 cm**.'),
  ],
);

/* ══════════════════════════════════════════════════════════════════════════
   MISCELLANEOUS EXERCISE ON CHAPTER 5 (14 questions, verbatim)
   ══════════════════════════════════════════════════════════════════════════ */
const misc = sec(
  'Miscellaneous Exercise — Systems, Conversions & Mixtures',
  'The real NCERT Miscellaneous Exercise, verbatim — compound (double) inequalities, systems of two conditions, and three classic word-problem families (temperature conversion, acid dilution, IQ formula).',
  [
    num('NCERT Misc Ex · Q1',
      'Solve the inequality: $ 2 \\leq 3x - 4 \\leq 5 $.',
      '$ x \\in [2, 3] $',
      'Add $ 4 $ to all three parts:\n\n$ 6 \\leq 3x \\leq 9 $\n\n' +
      'Divide all three parts by $ 3 $ — positive, sign stays:\n\n$ 2 \\leq x \\leq 3 $.'),
    num('NCERT Misc Ex · Q2',
      'Solve the inequality: $ 6 \\leq -3(2x - 4) < 12 $.',
      '$ 0 < x \\leq 1 $',
      'Expand: $ -3(2x-4) = -6x + 12 $, so the inequality is $ 6 \\leq -6x + 12 < 12 $.\n\n' +
      'Subtract $ 12 $ from all three parts:\n\n$ -6 \\leq -6x < 0 $\n\n' +
      'Divide all three parts by $ -6 $ — **negative, sign flips AND the chain reverses**:\n\n$ 1 \\geq x > 0 $, i.e. $ 0 < x \\leq 1 $.'),
    num('NCERT Misc Ex · Q3',
      'Solve the inequality: $ -3 \\leq 4 - \\frac{7x}{2} \\leq 18 $.',
      '$ -4 \\leq x \\leq 2 $',
      'Subtract $ 4 $ from all three parts:\n\n$ -7 \\leq -\\frac{7x}{2} \\leq 14 $\n\n' +
      'Multiply all three parts by $ 2 $ (positive):\n\n$ -14 \\leq -7x \\leq 28 $\n\n' +
      'Divide all three parts by $ -7 $ — **negative, flip AND reverse the chain**:\n\n$ 2 \\geq x \\geq -4 $, i.e. $ -4 \\leq x \\leq 2 $.'),
    num('NCERT Misc Ex · Q4',
      'Solve the inequality: $ -15 < \\frac{3(x-2)}{5} \\leq 0 $.',
      '$ -23 < x \\leq 2 $',
      'Multiply all three parts by $ 5 $ (positive):\n\n$ -75 < 3(x-2) \\leq 0 $\n\n' +
      'Divide all three parts by $ 3 $ (positive):\n\n$ -25 < x - 2 \\leq 0 $\n\n' +
      'Add $ 2 $ to all three parts:\n\n$ -23 < x \\leq 2 $.'),
    num('NCERT Misc Ex · Q5',
      'Solve the inequality: $ -12 < 4 - \\frac{3x}{-5} \\leq 2 $.',
      '$ -\\frac{80}{3} < x \\leq -\\frac{10}{3} $',
      'Simplify the middle term first: $ -\\frac{3x}{-5} = \\frac{3x}{5} $, so the inequality is $ -12 < 4 + \\frac{3x}{5} \\leq 2 $.\n\n' +
      'Subtract $ 4 $ from all three parts:\n\n$ -16 < \\frac{3x}{5} \\leq -2 $\n\n' +
      'Multiply all three parts by $ \\frac{5}{3} $ — positive, sign stays:\n\n$ -\\frac{80}{3} < x \\leq -\\frac{10}{3} $.'),
    num('NCERT Misc Ex · Q6',
      'Solve the inequality: $ 7 \\leq \\frac{3x+11}{2} \\leq 11 $.',
      '$ 1 \\leq x \\leq \\frac{11}{3} $',
      'Multiply all three parts by $ 2 $ (positive):\n\n$ 14 \\leq 3x + 11 \\leq 22 $\n\n' +
      'Subtract $ 11 $ from all three parts:\n\n$ 3 \\leq 3x \\leq 11 $\n\n' +
      'Divide all three parts by $ 3 $:\n\n$ 1 \\leq x \\leq \\frac{11}{3} $.'),
    num('NCERT Misc Ex · Q7',
      'Solve the system: $ 5x + 1 > -24 $, $ 5x - 1 < 24 $, and represent the solution graphically on the number line.',
      '$ -5 < x < 5 $',
      '**First:** $ 5x + 1 > -24 \\Rightarrow 5x > -25 \\Rightarrow x > -5 $.\n\n' +
      '**Second:** $ 5x - 1 < 24 \\Rightarrow 5x < 25 \\Rightarrow x < 5 $.\n\n' +
      'Both must hold at once: the overlap on the number line is $ -5 < x < 5 $ — open circles at both $ -5 $ and $ 5 $, the segment between them shaded.'),
    num('NCERT Misc Ex · Q8',
      'Solve the system: $ 2(x-1) < x+5 $, $ 3(x+2) > 2-x $, and represent the solution graphically on the number line.',
      '$ -1 < x < 7 $',
      '**First:** $ 2(x-1) < x+5 \\Rightarrow 2x - 2 < x + 5 \\Rightarrow x < 7 $.\n\n' +
      '**Second:** $ 3(x+2) > 2-x \\Rightarrow 3x + 6 > 2 - x \\Rightarrow 4x > -4 \\Rightarrow x > -1 $.\n\n' +
      'Both must hold at once: $ -1 < x < 7 $ — open circles at $ -1 $ and $ 7 $, the segment between them shaded.'),
    num('NCERT Misc Ex · Q9',
      'Solve the system: $ 3x - 7 > 2(x-6) $, $ 6 - x > 11 - 2x $, and represent the solution graphically on the number line.',
      '$ x > 5 $',
      '**First:** $ 3x - 7 > 2x - 12 \\Rightarrow x > -5 $.\n\n' +
      '**Second:** $ 6 - x > 11 - 2x \\Rightarrow 6 + x > 11 \\Rightarrow x > 5 $.\n\n' +
      'Both must hold at once. Since every $ x > 5 $ is automatically $ > -5 $ too, the **binding** condition is the ' +
      'stricter one: $ x > 5 $ — an open circle at $ 5 $, the ray to its right shaded.'),
    num('NCERT Misc Ex · Q10',
      'Solve the system: $ 5(2x-7) - 3(2x+3) \\leq 0 $, $ 2x + 19 \\leq 6x + 47 $, and represent the solution graphically on the number line.',
      '$ -7 \\leq x \\leq 11 $',
      '**First:** $ 5(2x-7) - 3(2x+3) \\leq 0 \\Rightarrow (10x - 35) - (6x+9) \\leq 0 \\Rightarrow 4x - 44 \\leq 0 \\Rightarrow x \\leq 11 $.\n\n' +
      '**Second:** $ 2x + 19 \\leq 6x + 47 \\Rightarrow -28 \\leq 4x \\Rightarrow x \\geq -7 $.\n\n' +
      'Both must hold at once: $ -7 \\leq x \\leq 11 $ — solid dots at both ends, the segment between them shaded.'),
    num('NCERT Misc Ex · Q11',
      'A solution is to be kept between $ 68\\,°F $ and $ 77\\,°F $. What is the range in temperature in degree Celsius (C) if the Celsius/Fahrenheit (F) conversion formula is given by $ F = \\frac{9}{5}C + 32 $?',
      '$ 20\\,°C \\leq C \\leq 25\\,°C $',
      'Substitute the formula into the given range:\n\n$ 68 \\leq \\frac{9}{5}C + 32 \\leq 77 $\n\n' +
      'Subtract $ 32 $ from all three parts:\n\n$ 36 \\leq \\frac{9}{5}C \\leq 45 $\n\n' +
      'Multiply all three parts by $ \\frac{5}{9} $ — positive, sign stays:\n\n$ 20 \\leq C \\leq 25 $.\n\n' +
      'So the temperature must be kept between **$ 20\\,°C $ and $ 25\\,°C $**.'),
    num('NCERT Misc Ex · Q12',
      'A solution of 8% boric acid is to be diluted by adding a 2% boric acid solution to it. The resulting mixture is to be more than 4% but less than 6% boric acid. If we have 640 litres of the 8% solution, how many litres of the 2% solution will have to be added?',
      'More than $ 320 $ litres but less than $ 1280 $ litres',
      'Let $ x $ litres of the 2% solution be added. The total acid stays the same amount regardless of dilution, ' +
      'so track it directly.\n\n' +
      'Acid contributed: $ 0.08(640) + 0.02x = 51.2 + 0.02x $. Total volume: $ 640 + x $.\n\n' +
      'The final concentration must be **more than 4%**:\n\n' +
      '$ 51.2 + 0.02x > 0.04(640+x) \\Rightarrow 51.2 + 0.02x > 25.6 + 0.04x \\Rightarrow 25.6 > 0.02x \\Rightarrow x < 1280 $.\n\n' +
      'And **less than 6%**:\n\n' +
      '$ 51.2 + 0.02x < 0.06(640+x) \\Rightarrow 51.2 + 0.02x < 38.4 + 0.06x \\Rightarrow 12.8 < 0.04x \\Rightarrow x > 320 $.\n\n' +
      'Both together: **more than 320 litres but less than 1280 litres** of the 2% solution must be added.'),
    num('NCERT Misc Ex · Q13',
      'How many litres of water will have to be added to 1125 litres of the 45% solution of acid so that the resulting mixture will contain more than 25% but less than 30% acid content?',
      'More than $ 562.5 $ litres but less than $ 900 $ litres',
      'Let $ x $ litres of water be added. Water contributes **zero** acid, so the acid amount never changes: ' +
      '$ 0.45 \\times 1125 = 506.25 $ litres of pure acid, in a total volume of $ 1125 + x $.\n\n' +
      'The final concentration must be **more than 25%**:\n\n' +
      '$ 506.25 > 0.25(1125+x) \\Rightarrow 506.25 > 281.25 + 0.25x \\Rightarrow 225 > 0.25x \\Rightarrow x < 900 $.\n\n' +
      'And **less than 30%**:\n\n' +
      '$ 506.25 < 0.30(1125+x) \\Rightarrow 506.25 < 337.5 + 0.3x \\Rightarrow 168.75 < 0.3x \\Rightarrow x > 562.5 $.\n\n' +
      'Both together: **more than 562.5 litres but less than 900 litres** of water must be added.'),
    num('NCERT Misc Ex · Q14',
      'IQ of a person is given by the formula $ IQ = \\frac{MA}{CA} \\times 100 $, where MA is mental age and CA is chronological age. If $ 80 \\leq IQ \\leq 140 $ for a group of 12-year-old children, find the range of their mental age.',
      '$ 9.6 \\leq MA \\leq 16.8 $ (years)',
      'Here $ CA = 12 $. Substitute into the given range:\n\n$ 80 \\leq \\frac{MA}{12} \\times 100 \\leq 140 $\n\n' +
      'Multiply all three parts by $ \\frac{12}{100} $ — positive, sign stays:\n\n$ 80 \\times \\frac{12}{100} \\leq MA \\leq 140 \\times \\frac{12}{100} $\n\n' +
      '$ 9.6 \\leq MA \\leq 16.8 $\n\n' +
      'The mental age of these children ranges from **9.6 to 16.8 years**.'),
  ],
);

const introMarkdown =
  'You have read the chapter — now **drill it**. Below is the **complete, real NCERT practice set for this ' +
  'chapter** — all 26 questions of **Exercise 5.1** plus all 14 questions of the **Miscellaneous Exercise** — ' +
  'transcribed verbatim from the textbook (rationalised 2023-24 edition), 40 questions in total, each with a ' +
  'full worked solution.\n\n' +
  '*A note on scope:* the current rationalised NCERT edition of this chapter covers **one-variable inequalities ' +
  'only** (Ex 5.1 and the Miscellaneous Exercise, both below) — the two-variable graphing and systems content on ' +
  'the earlier pages of this chapter goes beyond what this exercise set covers; see the note on that page.\n\n' +
  'Try every question on paper **first**. Only then tap to open the worked solution — the struggle before you ' +
  'peek is what makes it stick.';

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: 'linear-inequalities-practice-ncert' });
    if (!cur) throw new Error('page not found: linear-inequalities-practice-ncert');

    const newBlocks = (cur.blocks || []).map((blk) => {
      if (blk.type === 'text' && blk.order === 1) {
        return { ...blk, markdown: introMarkdown };
      }
      if (blk.type === 'practice_bank') {
        return {
          ...blk,
          title: 'Practice · Linear Inequalities',
          intro:
            'Two real NCERT sections, in their own textbook order. Tap a question to reveal a full, ' +
            'step-by-step worked solution in plain language.',
          sections: [ex51, misc],
        };
      }
      return blk;
    });

    const total = ex51.items.length + misc.items.length;
    const opts = {
      author: 'agent',
      summary: `Reconciled practice bank against real NCERT PDF: replaced 23 hand-authored items with ${total} verbatim NCERT exercise questions (Ex 5.1 x${ex51.items.length}, Misc Ex x${misc.items.length}).`,
      allowContentLoss: true,
      lossReason: 'Deliberate founder-directed reconciliation against the real NCERT source PDF (task brief, 2026-07-24): replacing invented-but-honestly-labelled practice items with the genuine, complete, verbatim NCERT exercise set now that the source PDF is available. Net items increase 23→40; nothing is silently lost — the prior version is snapshotted per book-writer.',
    };
    if (process.env.DRY_RUN) opts.dryRun = true;
    const res = await bw.savePage(db, { slug: 'linear-inequalities-practice-ncert' }, newBlocks, opts);
    console.log(process.env.DRY_RUN ? 'DRY RUN RESULT:' : 'SAVED', JSON.stringify(res, null, 2).slice(0, 1500));
    if (!process.env.DRY_RUN) console.log('items:', total, '(Ex5.1 x', ex51.items.length, ', Misc x', misc.items.length, ')');
  });
}

if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
