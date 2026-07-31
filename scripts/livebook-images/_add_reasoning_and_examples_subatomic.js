'use strict';
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('../lib/book-writer');

const PAGE_ID = 'd654823c-cae2-4f82-b5db-6adcb0956743';

const REASONING_PROMPT = {
  id: uuidv4(),
  order: 13, // inserted right after the discharge-tube concept block (old order 12), before "Thomson's e/m Ratio"
  type: 'reasoning_prompt',
  reasoning_type: 'logical',
  prompt:
    'Cathode rays only appear in a narrow pressure range — roughly 0.01 mm Hg. If you pump the tube down further, toward a ' +
    'near-perfect vacuum, the glow actually disappears and no current flows at all — even though "more vacuum" sounds like it ' +
    'should make cathode rays even easier to produce. What explains this?',
  options: [
    'At near-perfect vacuum there are too few gas molecules left to ionise and sustain the initial current — some gas is needed to start conduction, even though excess gas is what stops the rays from crossing the tube',
    'A perfect vacuum makes the glass tube itself become the conductor, absorbing the electrons before they can form a beam',
    'Near-perfect vacuum reverses the charge on the cathode, so it stops emitting electrons',
    'The fluorescent screen only glows in the presence of trace gas molecules striking it directly, unrelated to the electron beam',
  ],
  reveal:
    'A discharge tube needs gas for two competing reasons pulling in opposite directions. Some gas must remain so a few ' +
    "molecules near the cathode can be ionised and start the current flowing — with zero gas, there's nothing to ionise and no " +
    'conduction path exists. But too much gas means ejected electrons collide constantly with gas molecules before they can be ' +
    'accelerated to a useful speed, so no organised beam ever crosses the tube. Only in a narrow low-pressure window ' +
    '(~0.01 mm Hg) is there enough gas to start the discharge but little enough that electrons travel the tube largely ' +
    'uninterrupted — exactly the pressure Crookes and Thomson operated at.',
  difficulty_level: 4,
};

const EXAMPLES = [
  {
    id: uuidv4(),
    type: 'worked_example',
    label: 'Example — e/m Ratio of a Proton to an α-Particle',
    variant: 'solved_example',
    problem:
      'What is the ratio of the $e/m$ values of a proton and an $\\alpha$-particle?\n\n(a) $2:1$\n\n(b) $1:1$\n\n(c) $1:2$\n\n(d) $1:4$',
    solution:
      '**Charge and mass of each particle** (in atomic units, taking $e$ as the elementary charge and mass in u):\n\n' +
      '- Proton: charge $=+e$, mass $\\approx 1$ u $\\Rightarrow (e/m)_p = \\dfrac{e}{1} = e$\n' +
      '- $\\alpha$-particle (a helium nucleus, 2 protons $+$ 2 neutrons): charge $=+2e$, mass $\\approx 4$ u $\\Rightarrow (e/m)_\\alpha = \\dfrac{2e}{4} = \\dfrac{e}{2}$\n\n' +
      '**Take the ratio:**\n$$\\frac{(e/m)_p}{(e/m)_\\alpha} = \\frac{e}{e/2} = 2$$\n\n' +
      'So $(e/m)_p : (e/m)_\\alpha = 2:1$.\n\n**Answer: (a) $2:1$.**\n\n' +
      "**Why this is worth noticing:** the $\\alpha$-particle has *twice* the charge of a proton but *four times* the mass — the mass grows faster than the charge, so its specific charge ends up smaller, not larger.",
    reveal_mode: 'tap_to_reveal',
  },
  {
    id: uuidv4(),
    type: 'worked_example',
    label: 'Example — The Reaction That Discovered the Neutron',
    variant: 'solved_example',
    problem:
      'Which of the following nuclear reactions led to the discovery of the neutron?\n\n' +
      '(a) $\\ce{^{14}_{6}C + ^{1}_{1}p -> ^{14}_{7}N + ^{1}_{0}n}$\n\n' +
      '(b) $\\ce{^{11}_{5}B + ^{2}_{1}D -> ^{12}_{6}C + ^{1}_{0}n}$\n\n' +
      '(c) $\\ce{^{9}_{4}Be + ^{4}_{2}He -> ^{12}_{6}C + ^{1}_{0}n}$\n\n' +
      '(d) $\\ce{^{8}_{4}Be + ^{4}_{2}He -> ^{11}_{6}C + ^{1}_{0}n}$',
    solution:
      '**Check each option for mass-number and atomic-number balance first** — a nuclear equation can only be real chemistry if both totals match on both sides.\n\n' +
      '| Option | Mass no. balance | Atomic no. balance |\n|---|---|---|\n' +
      '| (a) | $14+1=15=14+1$ ✓ | $6+1=7=7+0$ ✓ |\n' +
      '| (b) | $11+2=13=12+1$ ✓ | $5+1=6=6+0$ ✓ |\n' +
      '| (c) | $9+4=13=12+1$ ✓ | $4+2=6=6+0$ ✓ |\n' +
      '| (d) | $8+4=12=11+1$ ✓ | $4+2=6=6+0$ ✓ |\n\n' +
      "All four are individually balanced — so balance alone can't pick the answer. **You need to know which reaction Chadwick actually performed (1932).**\n\n" +
      'Chadwick bombarded a thin sheet of **beryllium-9** ($\\ce{^{9}_{4}Be}$, the naturally occurring, stable isotope) with **alpha particles** ($\\ce{^{4}_{2}He}$). ' +
      'The collision produced carbon-12 and a new neutral particle — the neutron:\n' +
      '$$\\ce{^{9}_{4}Be + ^{4}_{2}He -> ^{12}_{6}C + ^{1}_{0}n}$$\n\n**Answer: (c).**\n\n' +
      "**Why the other balanced options are traps:** (a) and (b) are real nuclear reactions too (transmutation reactions used elsewhere in nuclear chemistry), just not the neutron-discovery one. (d) uses beryllium-**8**, an isotope that isn't the one Chadwick used — swapping the isotope keeps the arithmetic balanced but changes the actual chemistry.",
    reveal_mode: 'tap_to_reveal',
  },
  {
    id: uuidv4(),
    type: 'worked_example',
    label: 'Example — Spotting Identical e/m Pairs',
    variant: 'solved_example',
    problem:
      'Which of the following pairs have identical values of $e/m$?\n\n' +
      '(a) A proton and a neutron\n\n(b) A proton and deuterium\n\n(c) Deuterium and an $\\alpha$-particle\n\n(d) An electron and $\\gamma$-rays',
    solution:
      '**Work out $e/m$ for every species involved** (charge in units of $e$, mass in u):\n\n' +
      '- Proton: $1/1 = 1$\n' +
      '- Neutron: $0/1 = 0$ (no charge, so $e/m = 0$)\n' +
      '- Deuterium (a deuteron, $\\ce{^2_1D}$ — one proton $+$ one neutron): $1/2 = 0.5$\n' +
      '- $\\alpha$-particle: $2/4 = 0.5$\n' +
      '- Electron: charge $1$, mass $\\approx 1/1836$ u $\\Rightarrow e/m \\approx 1836$ (enormous compared to any nucleus)\n' +
      "- $\\gamma$-rays: uncharged, massless photons — $e/m$ isn't a meaningful ratio here (no charge *and* no rest mass)\n\n" +
      '**Check each option:**\n' +
      '(a) proton ($1$) vs. neutron ($0$) — not equal.\n' +
      '(b) proton ($1$) vs. deuterium ($0.5$) — not equal.\n' +
      '(c) deuterium ($0.5$) vs. $\\alpha$-particle ($0.5$) — **equal!**\n' +
      '(d) electron ($\\approx 1836$) vs. $\\gamma$-rays (undefined/zero) — nowhere close.\n\n' +
      '**Answer: (c).**\n\n' +
      '**The pattern to notice:** both deuterium and the $\\alpha$-particle are made of equal numbers of protons and neutrons (1+1, and 2+2), so in both cases exactly *half* the nucleon count carries charge — that\'s why their $e/m$ values land on the same number even though neither their charge nor their mass alone match.',
    reveal_mode: 'tap_to_reveal',
  },
  {
    id: uuidv4(),
    type: 'worked_example',
    label: 'Example — Ranking Four Particles by e/m',
    variant: 'solved_example',
    problem:
      'Which of the following is a correct arrangement of increasing value of $e/m$?\n\n' +
      '(a) $n < \\alpha < p < e$\n\n(b) $e < p < \\alpha < n$\n\n(c) $n < p < e < \\alpha$\n\n(d) $p < n < \\alpha < e$',
    solution:
      '**Reuse the values from the previous example** — this question asks you to hold all four in your head at once instead of comparing just two:\n\n' +
      '$$n:\\ 0 \\qquad \\alpha:\\ 0.5 \\qquad p:\\ 1 \\qquad e:\\ \\approx 1836$$\n\n' +
      '**Order them from smallest to largest:**\n$$n\\ (0) \\;<\\; \\alpha\\ (0.5) \\;<\\; p\\ (1) \\;<\\; e\\ (\\approx 1836)$$\n\n' +
      '**Answer: (a).**\n\n' +
      "**The trap to watch for:** it's tempting to rank by mass alone and get lucky here — but $e/m$ depends on *both* charge and mass together, and the electron's tiny mass makes its $e/m$ jump by three orders of magnitude past every nucleus. A ranking exercise like this only works if you actually compute the ratio for each particle, not just eyeball 'heavier things go first'.",
    reveal_mode: 'tap_to_reveal',
  },
];

(async () => {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ _id: PAGE_ID });
    const existing = page.blocks || [];

    // Step 1: shift everything from old order >= 13 up by 1, insert reasoning_prompt at 13.
    const beforeReasoning = existing.filter((b) => b.order < 13);
    const afterReasoning = existing.filter((b) => b.order >= 13).map((b) => ({ ...b, order: b.order + 1 }));
    let blocks = [...beforeReasoning, REASONING_PROMPT, ...afterReasoning];

    // Step 2: insert the 4 worked examples right before the inline_quiz (now shifted).
    const quiz = blocks.find((b) => b.type === 'inline_quiz');
    const beforeQuiz = blocks.filter((b) => b.order < quiz.order);
    const examplesWithOrder = EXAMPLES.map((ex, i) => ({ ...ex, order: quiz.order + i }));
    const shiftedQuiz = { ...quiz, order: quiz.order + EXAMPLES.length };
    blocks = [...beforeQuiz, ...examplesWithOrder, shiftedQuiz].sort((a, b) => a.order - b.order);

    const dry = await bw.savePage(db, { pageId: page._id }, blocks, { dryRun: true });
    console.log('DRY RUN diff:', JSON.stringify(dry.diff, null, 2));
    if (dry.wouldBlock) { console.log('BLOCKED — not writing.'); return; }

    const res = await bw.savePage(db, { pageId: page._id }, blocks, {
      author: 'agent',
      summary: 'Add reasoning_prompt (discharge tube pressure window) + 4 worked examples on e/m and neutron discovery, easiest to hardest',
    });
    console.log(`Saved -> version ${res.version}, blocks ${existing.length} -> ${blocks.length}`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
