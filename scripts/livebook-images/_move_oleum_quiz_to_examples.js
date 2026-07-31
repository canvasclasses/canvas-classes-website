'use strict';
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('../lib/book-writer');

const PAGE_ID = 'c9c68076-b77e-48e4-8ea1-67ef640e3c8d';

const EXAMPLE_3 = {
  id: uuidv4(),
  order: 12,
  type: 'worked_example',
  label: 'Example 3',
  variant: 'solved_example',
  problem:
    'Excess water is added to a bottle labelled "112% $\\ce{H2SO4}$", and the resulting acid is reacted with $5.3$ g of ' +
    '$\\ce{Na2CO3}$. Find the volume of $\\ce{CO2}$ evolved at $1$ atm and $300$ K after the reaction is complete.',
  solution:
    '**Set up the reaction.**\n$$\\ce{Na2CO3 + H2SO4 -> Na2SO4 + H2O + CO2 ^}$$\n' +
    "The reaction is $1:1:1$ between $\\ce{Na2CO3}$ and $\\ce{CO2}$ — the exact strength of the diluted acid doesn't matter here, only that there's enough of it (\"excess water\" guarantees excess acid too).\n\n" +
    '**Moles of $\\ce{Na2CO3}$.**\n$$n(\\ce{Na2CO3}) = \\frac{5.3}{106} = 0.05\\text{ mol}$$\n\n' +
    '**Moles of $\\ce{CO2}$ formed.** By the $1:1$ ratio, $n(\\ce{CO2}) = 0.05$ mol.\n\n' +
    '**Volume at 1 atm, 300 K** — use $PV = nRT$:\n$$V = \\frac{nRT}{P} = \\frac{0.05 \\times 0.0821 \\times 300}{1} \\approx 1.23\\text{ L}$$\n\n' +
    '**Answer: 1.23 L.**',
  reveal_mode: 'tap_to_reveal',
};

const EXAMPLE_4 = {
  id: uuidv4(),
  order: 13,
  type: 'worked_example',
  label: 'Example 4',
  variant: 'solved_example',
  problem:
    'Only $9.0$ g of water is added to a $100$ g sample of oleum labelled "$112\\%$ $\\ce{H2SO4}$". How much free $\\ce{SO3}$ ' +
    'remains unreacted in the solution?',
  solution:
    '**What "112%" tells you.** Full dilution of $100$ g of this oleum to pure $\\ce{H2SO4}$ needs $(112-100) = 12$ g of water — that\'s exactly how the label is defined.\n\n' +
    '**Total free $\\ce{SO3}$ present**, from that 12 g figure:\n$$\\ce{SO3 + H2O -> H2SO4}$$\n' +
    '$$n(\\ce{SO3})_{\\text{total}} = n(\\ce{H2O})_{\\text{needed for full dilution}} = \\frac{12}{18} = \\frac{2}{3}\\text{ mol}$$\n\n' +
    '**But only 9 g of water was actually added** — not the full 12 g:\n$$n(\\ce{H2O})_{\\text{added}} = \\frac{9}{18} = \\frac{1}{2}\\text{ mol}$$\n' +
    'Since $\\ce{SO3}$ and $\\ce{H2O}$ react $1:1$, only $\\dfrac{1}{2}$ mol of the $\\ce{SO3}$ gets consumed.\n\n' +
    '**$\\ce{SO3}$ left unreacted:**\n$$n(\\ce{SO3})_{\\text{remaining}} = \\frac{2}{3} - \\frac{1}{2} = \\frac{1}{6}\\text{ mol}$$\n\n' +
    '**In litres at STP** (if needed): $\\dfrac{1}{6}\\times 22.4 \\approx 3.73$ L.\n\n' +
    '**Answer: $\\dfrac{1}{6}$ mol of free $\\ce{SO3}$ remains (≈ 3.73 L at STP).**',
  reveal_mode: 'tap_to_reveal',
};

(async () => {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ _id: PAGE_ID });
    const existing = page.blocks || [];

    const quiz = existing.find((b) => b.type === 'inline_quiz');
    const keepQuestions = quiz.questions.slice(0, 2); // drop the two oleum-specific ones (indices 2,3)
    const newQuiz = { ...quiz, questions: keepQuestions };

    const before = existing.filter((b) => b.order <= 11); // image..Example2, unchanged
    const after = existing
      .filter((b) => b.order >= 12 && b.type !== 'inline_quiz')
      .map((b) => ({ ...b, order: b.order + 2 })); // the callout, shifted
    const shiftedQuiz = { ...newQuiz, order: quiz.order + 2 };

    const newBlocks = [...before, EXAMPLE_3, EXAMPLE_4, ...after, shiftedQuiz].sort((a, b) => a.order - b.order);

    const diffPreview = await bw.savePage(db, { pageId: page._id }, newBlocks, { dryRun: true });
    console.log('DRY RUN diff:', JSON.stringify(diffPreview.diff, null, 2));
    console.log('wouldBlock:', diffPreview.wouldBlock);

    if (diffPreview.wouldBlock) {
      console.log('BLOCKED — not writing. Inspect diff above.');
      return;
    }

    const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
      author: 'agent',
      summary: 'Move the two oleum-specific quiz questions (CO2 volume, free SO3 remaining) into worked examples 3 & 4, before the quiz',
    });
    console.log(`Saved -> version ${res.version}, blocks ${existing.length} -> ${newBlocks.length}, quiz now ${keepQuestions.length} questions`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
