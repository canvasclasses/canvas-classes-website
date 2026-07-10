// Ch.5 (d- & f-Block) · Page 10 · Magnetic Properties (NCERT §8.3.9) — HIGH-YIELD.
// NCERT content transcribed faithfully (same language/equations/numbers);
// enrichment from the founder's notes is confined to the "Exam Point" callouts.
// Carries the two chapter devices:
//   • "🔍 Decode This" — paramagnetism ⇐ unpaired electrons, as an A–R question.
//   • "🏛️ Exam Vault" — an answer-verified JEE Main magnetic-moment PYQ (DNF-010)
//     shown next to the NCERT line it comes from.
// Ends with a Quick Recap + a textbook quiz in real exam formats (incl. A–R).
module.exports = {
  page_number: 10,
  chapter: 5,
  slug: 'magnetic-properties',
  title: 'Magnetic Properties',
  subtitle: 'Why most transition-metal ions are paramagnetic, how the spin-only formula turns "number of unpaired electrons" into a measurable magnetic moment, and how examiners run it backwards — from μ to the ion.',
  tags: ['d-block', 'transition-metals', 'magnetic-properties', 'spin-only', 'high-yield'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: a horseshoe magnet on the left with field lines reaching toward a small labelled box of "5 unpaired electrons" drawn as five upward arrows; below it the spin-only formula mu = root n(n+2) written like chalk on a slate. To the right, a rising staircase of five steps labelled 1.73, 2.83, 3.87, 4.90, 5.92 BM, each step a slightly stronger muted colour, with a tiny ion symbol resting on a couple of the steps. Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'More unpaired electrons → a larger magnetic moment. The spin-only formula is the bridge.'
    ),

    h.text(
      'When a magnetic field is applied to substances, mainly two types of magnetic behaviour are observed: **diamagnetism** and **paramagnetism**. Diamagnetic substances are repelled by the applied field while the paramagnetic substances are attracted. Substances which are attracted very strongly are said to be **ferromagnetic**. In fact, ferromagnetism is an extreme form of paramagnetism. Many of the transition metal ions are paramagnetic.'
    ),

    h.heading('The spin-only formula', 'State how the magnetic moment of a first-row transition-metal ion is calculated from the number of unpaired electrons.'),
    h.text(
      'Paramagnetism arises from the presence of **unpaired electrons**, each such electron having a magnetic moment associated with its spin angular momentum and orbital angular momentum. For the compounds of the first series of transition metals, the contribution of the orbital angular momentum is effectively quenched and hence is of no significance. For these, the magnetic moment is determined by the number of unpaired electrons and is calculated by using the ‘spin-only’ formula, i.e.,\n\n' +
      '$$\\mu = \\sqrt{n(n+2)}$$\n\n' +
      'where $n$ is the number of unpaired electrons and $\\mu$ is the magnetic moment in units of Bohr magneton (BM). A single unpaired electron has a magnetic moment of **1.73 Bohr magnetons (BM)**.'
    ),
    h.text(
      'The magnetic moment increases with the increasing number of unpaired electrons. Thus, the observed magnetic moment gives a useful indication about the number of unpaired electrons present in the atom, molecule or ion. The magnetic moments calculated from the ‘spin-only’ formula and those derived experimentally for some ions of the first row transition elements are given in Table 8.7. The experimental data are mainly for hydrated ions in solution or in the solid state.'
    ),

    h.table(
      ['Ion', 'Configuration', 'Unpaired electron(s)', 'μ (calculated)', 'μ (observed)'],
      [
        ['$\\ce{Sc^{3+}}$', '$3d^0$', '0', '0', '0'],
        ['$\\ce{Ti^{3+}}$', '$3d^1$', '1', '1.73', '1.75'],
        ['$\\ce{Ti^{2+}}$', '$3d^2$', '2', '2.84', '2.76'],
        ['$\\ce{V^{2+}}$', '$3d^3$', '3', '3.87', '3.86'],
        ['$\\ce{Cr^{2+}}$', '$3d^4$', '4', '4.90', '4.80'],
        ['$\\ce{Mn^{2+}}$', '$3d^5$', '5', '5.92', '5.96'],
        ['$\\ce{Fe^{2+}}$', '$3d^6$', '4', '4.90', '5.3 – 5.5'],
        ['$\\ce{Co^{2+}}$', '$3d^7$', '3', '3.87', '4.4 – 5.2'],
        ['$\\ce{Ni^{2+}}$', '$3d^8$', '2', '2.84', '2.9 – 3.4'],
        ['$\\ce{Cu^{2+}}$', '$3d^9$', '1', '1.73', '1.8 – 2.2'],
        ['$\\ce{Zn^{2+}}$', '$3d^{10}$', '0', '0', '0'],
      ],
      'Table 8.7 — Calculated and observed magnetic moments (BM). The calculated values use the spin-only formula; observed values are for hydrated ions in solution or the solid state.'
    ),

    h.callout('exam_tip', 'Exam Point — the μ ↔ unpaired-electrons ↔ ion ladder (the reverse-lookup examiners use)',
      'Examiners rarely ask you to *compute* $\\mu$ from $n$. They give you a value of $\\mu$ and ask **which ion** it is — so memorise the five rungs and one example ion per rung. Read it both ways: $n \\to \\mu$ (forward), and $\\mu \\to n \\to$ ion (reverse).\n\n' +
      '- $n = 1 \\Rightarrow \\mu = \\sqrt{1\\cdot 3} = \\mathbf{1.73}$ BM — e.g. $\\ce{Cu^{2+}}$ ($3d^9$), $\\ce{Ti^{3+}}$ ($3d^1$)\n' +
      '- $n = 2 \\Rightarrow \\mu = \\sqrt{2\\cdot 4} = \\mathbf{2.83}$ BM — e.g. $\\ce{Ni^{2+}}$ ($3d^8$), $\\ce{Ti^{2+}}$ ($3d^2$)\n' +
      '- $n = 3 \\Rightarrow \\mu = \\sqrt{3\\cdot 5} = \\mathbf{3.87}$ BM — e.g. $\\ce{V^{2+}}$ ($3d^3$), $\\ce{Cr^{3+}}$ ($3d^3$)\n' +
      '- $n = 4 \\Rightarrow \\mu = \\sqrt{4\\cdot 6} = \\mathbf{4.90}$ BM — e.g. $\\ce{Cr^{2+}}$ ($3d^4$), $\\ce{Fe^{2+}}$ ($3d^6$)\n' +
      '- $n = 5 \\Rightarrow \\mu = \\sqrt{5\\cdot 7} = \\mathbf{5.92}$ BM — e.g. $\\ce{Mn^{2+}}$ ($3d^5$), $\\ce{Fe^{3+}}$ ($3d^5$)\n\n' +
      '(NCERT writes 2.84 for $n=2$; $\\sqrt{8} = 2.83$ — same number, rounded. A value near 3.87 BM almost always means a $d^3$ ion such as $\\ce{V^{2+}}$.)'),

    h.worked('NCERT Example 8.8', 'solved_example',
      'Calculate the magnetic moment of a divalent ion in aqueous solution if its atomic number is 25.',
      'With atomic number 25, the divalent ion in aqueous solution will have $d^5$ configuration (five unpaired electrons). The magnetic moment, $\\mu$ is\n\n' +
      '$$\\mu = \\sqrt{5(5+2)} = 5.92\\ \\text{BM}$$\n\n' +
      '($Z = 25$ is Mn; $\\ce{Mn^{2+}}$ is $[\\ce{Ar}]\\,3d^5$ with five unpaired electrons — the maximum for the first series, hence the largest spin-only $\\mu$.)'),
    h.worked('NCERT In-text Question 8.8', 'ncert_intext',
      'Calculate the ‘spin only’ magnetic moment of $\\ce{M^{2+}}_{(aq)}$ ion ($Z = 27$).',
      '$Z = 27$ is cobalt. $\\ce{Co^{2+}}$ is $[\\ce{Ar}]\\,3d^7$, which has **three** unpaired electrons ($n = 3$). Therefore\n\n' +
      '$$\\mu = \\sqrt{n(n+2)} = \\sqrt{3(3+2)} = \\sqrt{15} = 3.87\\ \\text{BM}.$$'),

    // ── DEVICE: turn an NCERT statement+reason pair into an A–R question ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"Many of the transition metal ions are paramagnetic."*\n' +
      '> **NCERT (reason):** *"Paramagnetism arises from the presence of unpaired electrons."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Most transition-metal ions are paramagnetic.\n' +
      '- **Reason (R):** Transition-metal ions have unpaired electrons in their partially filled $d$ orbitals.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.** (The exceptions — $\\ce{Sc^{3+}}$, $\\ce{Zn^{2+}}$ — are $d^0$/$d^{10}$, have *no* unpaired electrons, and so are diamagnetic.)\n\n' +
      '**Your move:** whenever NCERT says *"X happens **because** Y"*, read it as a ready-made Assertion–Reason question — A = X, R = Y.'),

    // ── DEVICE: a real, answer-verified PYQ next to its NCERT line ──
    h.worked('🏛️ Exam Vault · JEE Main 2023 (PYQ)', 'solved_example',
      'The magnetic moment of a transition metal compound has been calculated to be 3.87 BM. The metal ion is:\n\n(1) $\\ce{Cr^{2+}}$  (2) $\\ce{Mn^{2+}}$  (3) $\\ce{V^{2+}}$  (4) $\\ce{Ti^{2+}}$',
      '**Answer: (3) $\\ce{V^{2+}}$.** Run the spin-only formula backwards: $\\mu = \\sqrt{n(n+2)} = 3.87$ gives $n(n+2) \\approx 15$, so $n = 3$. Now find the ion with **three** unpaired electrons in the +2 state — $\\ce{V^{2+}}$ is $[\\ce{Ar}]\\,3d^3$ (3 unpaired) ✓. The traps: $\\ce{Cr^{2+}}$ ($3d^4$, 4 unpaired, $\\mu = 4.90$), $\\ce{Mn^{2+}}$ ($3d^5$, 5 unpaired, $\\mu = 5.92$), $\\ce{Ti^{2+}}$ ($3d^2$, 2 unpaired, $\\mu = 2.84$).\n\n' +
      '**Notice:** this is just Table 8.7 read in reverse — the $3.87$ BM row is exactly NCERT\'s $\\ce{V^{2+}}$ ($3d^3$) entry. Learn the ladder and the PYQ is one line.'),

    h.recap([
      { label: 'Two behaviours', text: '**Diamagnetic** (no unpaired electrons) are *repelled* by a magnetic field; **paramagnetic** (unpaired electrons) are *attracted*. Most transition-metal ions are paramagnetic.' },
      { label: 'The formula', text: 'For first-row ions the orbital contribution is quenched, so $\\mu = \\sqrt{n(n+2)}$ BM, where $n$ = number of unpaired electrons. One unpaired electron → **1.73 BM**.' },
      { label: 'The ladder', text: '$n$ = 1,2,3,4,5 → $\\mu$ = **1.73, 2.83, 3.87, 4.90, 5.92** BM. Memorise it both ways — examiners give $\\mu$ and ask for the ion.' },
      { label: 'The peak', text: '$\\ce{Mn^{2+}}$ ($3d^5$, 5 unpaired) has the **largest** spin-only moment of the series, 5.92 BM.' },
      { label: 'The zeros', text: '$\\ce{Sc^{3+}}$ ($3d^0$) and $\\ce{Zn^{2+}}$ ($3d^{10}$) have no unpaired electrons → $\\mu = 0$, diamagnetic.' },
    ]),

    h.quiz([
      {
        question: 'The spin-only magnetic moment of a first-row transition-metal ion is given by:',
        options: [
          '$\\mu = \\sqrt{n(n+2)}$, where $n$ is the number of unpaired electrons',
          '$\\mu = \\sqrt{n(n+1)}$, where $n$ is the total number of electrons',
          '$\\mu = n(n+2)$ BM directly',
          '$\\mu = \\sqrt{l(l+1)}$, where $l$ is the orbital quantum number',
        ],
        correct_index: 0,
        explanation: 'For first-row ions the orbital contribution is quenched, so only spin counts: $\\mu = \\sqrt{n(n+2)}$ with $n$ = unpaired electrons. It is not a function of total electrons, it is a square root (not $n(n+2)$ directly), and the orbital term $\\sqrt{l(l+1)}$ does not apply here.',
      },
      {
        question: 'A divalent first-row transition-metal ion has a spin-only magnetic moment of 5.92 BM. The ion is:',
        options: ['$\\ce{Cr^{2+}}$', '$\\ce{Fe^{2+}}$', '$\\ce{Mn^{2+}}$', '$\\ce{Ni^{2+}}$'],
        correct_index: 2,
        explanation: '5.92 BM needs $n = 5$ ($\\sqrt{35}$). $\\ce{Mn^{2+}}$ is $3d^5$ with 5 unpaired electrons. $\\ce{Cr^{2+}}$ ($3d^4$) gives 4.90, $\\ce{Fe^{2+}}$ ($3d^6$) also 4.90, and $\\ce{Ni^{2+}}$ ($3d^8$) gives 2.84.',
      },
      {
        question: 'Which of the following ions is diamagnetic (μ = 0)?',
        options: ['$\\ce{Ti^{3+}}$', '$\\ce{Cu^{2+}}$', '$\\ce{V^{2+}}$', '$\\ce{Zn^{2+}}$'],
        correct_index: 3,
        explanation: '$\\ce{Zn^{2+}}$ is $3d^{10}$ — all $d$ orbitals filled, no unpaired electrons, so $\\mu = 0$ and it is diamagnetic. $\\ce{Ti^{3+}}$ ($3d^1$), $\\ce{Cu^{2+}}$ ($3d^9$) and $\\ce{V^{2+}}$ ($3d^3$) all have unpaired electrons and are paramagnetic.',
      },
      {
        question: 'A first-row transition metal in its +2 oxidation state has a spin-only magnetic moment of 3.87 BM. The number of unpaired electrons and the ion are:',
        options: [
          '2 unpaired electrons; $\\ce{Ni^{2+}}$',
          '3 unpaired electrons; $\\ce{V^{2+}}$',
          '4 unpaired electrons; $\\ce{Cr^{2+}}$',
          '5 unpaired electrons; $\\ce{Mn^{2+}}$',
        ],
        correct_index: 1,
        explanation: '$3.87 = \\sqrt{n(n+2)}$ gives $n = 3$. The +2 ion with three unpaired electrons is $\\ce{V^{2+}}$ ($3d^3$). The 2-electron answer (2.84 BM) is $\\ce{Ni^{2+}}$, the 4-electron answer (4.90 BM) is $\\ce{Cr^{2+}}$, and the 5-electron answer (5.92 BM) is $\\ce{Mn^{2+}}$ — all different moments.',
      },
      {
        question: 'Assertion (A): The observed magnetic moment of a transition-metal ion gives a useful indication of the number of unpaired electrons present.\nReason (R): For first-row transition-metal compounds the orbital contribution to the magnetic moment is effectively quenched.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are true and R explains A: precisely because the orbital contribution is quenched, the magnetic moment depends only on spin (the unpaired electrons), so measuring $\\mu$ tells you $n$ directly via $\\mu = \\sqrt{n(n+2)}$.',
      },
      {
        question: 'A single unpaired electron contributes a spin-only magnetic moment of:',
        options: ['1.73 BM', '2.83 BM', '0.87 BM', '3.46 BM'],
        correct_index: 0,
        explanation: 'For $n = 1$, $\\mu = \\sqrt{1(1+2)} = \\sqrt{3} = 1.73$ BM — NCERT states this explicitly. 2.83 BM corresponds to two unpaired electrons, not one.',
      },
    ], 0.6),
  ],
};
