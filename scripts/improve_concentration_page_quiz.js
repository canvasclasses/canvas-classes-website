'use strict';
/**
 * Improves the end-of-page quiz on 'concentration-of-solutions' (Ch.1
 * Chemistry) — founder-flagged 2026-07-25, after the page grew to 7 fully
 * separated sections (Percentage / Mole Fraction / Molarity / Dilution /
 * Normality / Molality / PPM-PPB) with 20 worked examples: the 4-question
 * quiz hadn't kept pace. Two problems found:
 *
 * 1. One question was pure fact-recall with a short answer list ("which unit
 *    is temperature-independent?" — Molarity/Normality/Molality/Both), thin
 *    next to the worked-example-driven rest of the page. Replaced with a
 *    4-way version of the same underlying idea (Molality/Mole fraction/
 *    Normality/none) — same core fact, but now requires distinguishing FOUR
 *    units instead of picking the one memorized answer from a shorter list.
 *
 * 2. Two of the 7 sections (Normality, PPM/PPB) had ZERO quiz representation
 *    at all, despite Normality having 5 worked examples and PPM having 2 new
 *    founder-requested ones. Added one question for each, both distinct from
 *    the existing worked examples (not a restatement): a normality-vs-
 *    molarity comparison for H2SO4 vs HCl, and a ppm<->ppb unit-conversion
 *    trap (lead in water, landing exactly at the regulatory limit).
 *
 * The 2 strongest existing questions (JEE 2013 mixing, equal-moles NaCl/H2O
 * molality) are kept unchanged — they were already good, not generic.
 *
 * All new chemistry independently verified: H2SO4 (n=2) at 0.1 M -> 0.2 N,
 * exactly double HCl (n=1) at 0.1 M -> 0.1 N; 0.015 ppm = 0.015*1000 = 15
 * ppb exactly (not above or below the stated 15 ppb limit).
 *
 * Purely a content edit to the quiz block's `questions` array (same block
 * id, no block added/removed) — verified this does NOT trip book-writer's
 * content-loss guard, since quiz question objects have `id` but no `type`
 * field, so collectBlockIds() never counts them as blocks.
 * Purely additive/text-only via book-writer.savePage. Idempotent.
 * Run: node scripts/improve_concentration_page_quiz.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const SLUG = 'concentration-of-solutions';
const QUIZ_BLOCK_ID = '7b800726-fe9c-47f9-b93d-2a76a595b41a';

const q = (question, options, correct_index, explanation, difficulty_level) => ({
  id: uuidv4(), question, options, correct_index, explanation, difficulty_level,
});

const NEW_QUESTIONS = [
  q(
    'A solution is prepared at 25°C and then heated to 60°C, with nothing added or removed. Which ONE of these actually changes?',
    ['Molality', 'Mole fraction', 'Normality', 'None of them change'],
    2,
    "Normality (like molarity) is volume-based — heating expands the solution's volume, so N drops even though " +
      'the amount of solute is unchanged. Molality and mole fraction are both defined using moles and mass, ' +
      'neither of which changes with temperature, so they stay exactly the same.',
    2,
  ),
  q(
    'The molarity of a solution obtained by mixing 750 mL of 0.5 M HCl with 250 mL of 2 M HCl is: (JEE 2013)',
    ['1.00 M', '1.75 M', '0.975 M', '0.875 M'],
    3,
    'Moles of HCl are conserved. Total moles = M₁V₁ + M₂V₂ = (0.5 × 0.75) + (2 × 0.25) = 0.375 + 0.5 = 0.875 mol. ' +
      'Total volume = 0.75 + 0.25 = 1.0 L. Molarity = 0.875/1.0 = 0.875 M. Note: This uses moles conservation, ' +
      'NOT M₁V₁ = M₂V₂ (that formula applies only to dilution, not mixing).',
    3,
  ),
  q(
    'Equal moles of H₂O and NaCl are present in a solution. The molality of the NaCl solution is:',
    ['0.55 mol/kg', '55.5 mol/kg', '1.00 mol/kg', '0.18 mol/kg'],
    1,
    'Take 1 mol NaCl + 1 mol H₂O. Mass of H₂O (solvent) = 1 × 18 = 18 g = 0.018 kg. Molality = moles of solute / ' +
      'kg of solvent = 1 / 0.018 = 55.55 mol/kg. This is extremely high because 1 mol of water is only 18 g — a ' +
      'very small mass of solvent for 1 mol of solute.',
    3,
  ),
  q(
    'Calculate the mole fraction of benzene in a solution containing 30% benzene (C₆H₆) by mass in CCl₄. (M of C₆H₆ = 78, M of CCl₄ = 154)',
    ['0.21', '0.30', '0.46', '0.54'],
    0,
    'In 100 g solution: benzene = 30 g, CCl₄ = 70 g. Moles of C₆H₆ = 30/78 = 0.385 mol. Moles of CCl₄ = 70/154 = ' +
      '0.455 mol. Total moles = 0.385 + 0.455 = 0.840 mol. Mole fraction of benzene = 0.385/0.840 ≈ 0.458 ≈ 0.46. ' +
      'Note: mole fraction ≠ mass fraction (0.30); always convert to moles first.',
    2,
  ),
  q(
    '0.1 M H₂SO₄ and 0.1 M HCl are compared. Which statement is correct?',
    [
      'Both have the same normality, since both are 0.1 M',
      'H₂SO₄ has twice the normality of HCl, since its n-factor is 2',
      'HCl has twice the normality of H₂SO₄',
      'Normality cannot be compared without knowing the volume',
    ],
    1,
    'N = M × n-factor. HCl is monoprotic (n = 1), so its normality equals its molarity: 0.1 N. H₂SO₄ is diprotic ' +
      '(n = 2), so its normality is 0.1 × 2 = 0.2 N — twice HCl\'s, even though both have the SAME molarity. This ' +
      'is exactly why normality, not molarity, is the natural unit for comparing acid-base neutralising power.',
    2,
  ),
  q(
    'A water sample contains lead at a concentration of 0.015 ppm. The maximum safe limit set by regulators is 15 ppb. Is this sample within the limit?',
    [
      'Yes — 0.015 ppm is far below 15 ppb',
      'No — 0.015 ppm is far above 15 ppb',
      'It is exactly at the limit — 0.015 ppm equals exactly 15 ppb',
      'Cannot be compared — ppm and ppb measure different things',
    ],
    2,
    '1 ppm = 1000 ppb, so 0.015 ppm = 0.015 × 1000 = 15 ppb — exactly equal to the limit, not below or above it. ' +
      "This is a classic 'read the units carefully' trap: ppm and ppb look like different scales, but converting " +
      'between them is just a factor of 1000.',
    2,
  ),
];

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    const quizBlock = cur.blocks.find((b) => b.id === QUIZ_BLOCK_ID);
    if (!quizBlock) throw new Error(`quiz block not found: ${QUIZ_BLOCK_ID}`);

    const alreadyDone = quizBlock.questions.length === NEW_QUESTIONS.length &&
      quizBlock.questions.some((qq) => qq.question.includes('60°C'));
    if (alreadyDone) {
      console.log('already improved — skipping (idempotent).');
      return;
    }

    const newBlocks = cur.blocks.map((b) =>
      b.id === QUIZ_BLOCK_ID ? { ...b, questions: NEW_QUESTIONS } : b
    );

    const res = await bw.savePage(db, { slug: SLUG }, newBlocks, {
      author: 'agent',
      summary: 'Improved end-of-page quiz: replaced a thin fact-recall question with a 4-way version testing the ' +
        'same idea more rigorously, and added 2 new questions covering Normality and PPM/PPB — both sections had ' +
        'zero quiz representation despite having worked examples. Kept the 2 strongest existing questions ' +
        'unchanged. Text-only, same block id.',
    });
    console.log('SAVED', res.slug, 'version', res.version, '· questions:', NEW_QUESTIONS.length, '· lossDetected:', res.diff.lossDetected);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
