// Ch.5 (d- & f-Block) · Page 12 · Catalysis, Interstitial Compounds & Alloys
// (NCERT §8.3.12 + §8.3.13 + §8.3.14).
// NCERT content transcribed faithfully (the iron(III)/iodide–persulphate example
// and its two-step mechanism kept verbatim; the four interstitial characteristics
// and the alloy definition word-by-word). Enrichment is confined to "Exam Point".
// Carries the two chapter devices:
//   • "🔍 Decode This" — transition metals are good catalysts BECAUSE of variable
//     oxidation states + complex formation (A–R).
//   • "🏛️ Exam Vault" — an answer-verified JEE Main 2024 catalysis PYQ (DNF-046)
//     shown next to the exact NCERT line it comes from.
// Ends with a Quick Recap + a textbook quiz in real exam formats (incl. A–R).
module.exports = {
  page_number: 12,
  chapter: 5,
  slug: 'catalytic-interstitial-alloys',
  title: 'Catalysis, Interstitial Compounds & Alloys',
  subtitle: 'Why transition metals are such good catalysts (and the exact iron(III) example NCERT works out), what interstitial compounds are and their four hallmark properties, and what makes an alloy — with the ferrous alloys, brass and bronze you must know.',
  tags: ['d-block', 'transition-metals', 'catalysis', 'interstitial-compounds', 'alloys'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Three panels gently separated. Left panel: a dull grey metal surface with small molecules sticking to it (adsorption) and an arrow labelled "lower activation energy". Middle panel: a metal crystal lattice drawn as a grid of large atoms with tiny H, C, N atoms tucked into the gaps between them, captioned "interstitial". Right panel: two different coloured metal atoms mixed together in a single solid block labelled "alloy — brass, bronze, steel". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Three jobs the d-block does for materials: catalyse reactions, trap small atoms in their lattices, and blend into alloys.'
    ),

    h.heading('Catalytic Properties', 'Explain why transition metals and their compounds make good catalysts, using NCERT’s iron(III) example.'),
    h.text(
      'The transition metals and their compounds are known for their catalytic activity. This activity is ascribed to their ability to **adopt multiple oxidation states and to form complexes.** Vanadium(V) oxide (in Contact Process), finely divided iron (in Haber’s Process), and nickel (in Catalytic Hydrogenation) are some of the examples. Catalysts at a solid surface involve the formation of bonds between reactant molecules and atoms of the surface of the catalyst (first row transition metals utilise $3d$ and $4s$ electrons for bonding). This has the effect of increasing the concentration of the reactants at the catalyst surface and also weakening of the bonds in the reacting molecules (the activation energy is lowering). Also because the transition metal ions can change their oxidation states, they become more effective as catalysts.'
    ),
    h.text(
      'For example, **iron(III) catalyses the reaction between iodide and persulphate ions.**\n\n' +
      '$$2\\,\\ce{I^-} + \\ce{S2O8^{2-}} \\rightarrow \\ce{I2} + 2\\,\\ce{SO4^{2-}}$$\n\n' +
      'An explanation of this catalytic action can be given as:\n\n' +
      '$$2\\,\\ce{Fe^{3+}} + 2\\,\\ce{I^-} \\rightarrow 2\\,\\ce{Fe^{2+}} + \\ce{I2}$$\n' +
      '$$2\\,\\ce{Fe^{2+}} + \\ce{S2O8^{2-}} \\rightarrow 2\\,\\ce{Fe^{3+}} + 2\\,\\ce{SO4^{2-}}$$'
    ),

    h.callout('exam_tip', 'Exam Point — read the iron(III) cycle as "the metal lends, then gets its electrons back"',
      'The whole point of the two-step mechanism: iron **shuttles between +3 and +2** and comes out unchanged at the end, so it is a true catalyst.\n\n' +
      '- Step 1: $\\ce{Fe^{3+}}$ **oxidises** $\\ce{I^-}$ to $\\ce{I2}$ (Fe goes $+3 \\to +2$).\n' +
      '- Step 2: $\\ce{Fe^{2+}}$ **reduces** $\\ce{S2O8^{2-}}$ to $\\ce{SO4^{2-}}$ (Fe goes back $+2 \\to +3$).\n\n' +
      'Add the two steps and the $\\ce{Fe}$ cancels — you recover the overall reaction $2\\,\\ce{I^-} + \\ce{S2O8^{2-}} \\rightarrow \\ce{I2} + 2\\,\\ce{SO4^{2-}}$. This "variable oxidation state" cycle is exactly why the metal can catalyse it; a metal stuck in one oxidation state could not.'),

    h.heading('Formation of Interstitial Compounds', 'Define interstitial compounds and list their four characteristic properties.'),
    h.text(
      'Interstitial compounds are those which are formed when small atoms like H, C or N are trapped inside the crystal lattices of metals. They are usually non stoichiometric and are neither typically ionic nor covalent, for example, $\\ce{TiC}$, $\\ce{Mn4N}$, $\\ce{Fe3H}$, $\\ce{VH_{0.56}}$ and $\\ce{TiH_{1.7}}$, etc. The formulas quoted do not, of course, correspond to any normal oxidation state of the metal. Because of the nature of their composition, these compounds are referred to as **interstitial** compounds. The principal physical and chemical characteristics of these compounds are as follows:\n\n' +
      '(i) They have **high melting points**, higher than those of pure metals.\n\n' +
      '(ii) They are **very hard**, some borides approach diamond in hardness.\n\n' +
      '(iii) They **retain metallic conductivity**.\n\n' +
      '(iv) They are **chemically inert**.'
    ),

    h.heading('Alloy Formation', 'Define an alloy and recall the important ferrous alloys, brass and bronze.'),
    h.text(
      'An alloy is a blend of metals prepared by mixing the components. Alloys may be homogeneous solid solutions in which the atoms of one metal are distributed randomly among the atoms of the other. Such alloys are formed by atoms with metallic radii that are within about **15 percent** of each other. Because of similar radii and other characteristics of transition metals, alloys are readily formed by these metals. The alloys so formed are hard and have often high melting points. The best known are ferrous alloys: chromium, vanadium, tungsten, molybdenum and manganese are used for the production of a variety of steels and stainless steel. Alloys of transition metals with non transition metals such as **brass (copper-zinc)** and **bronze (copper-tin)**, are also of considerable industrial importance.'
    ),

    // ── DEVICE: turn an NCERT statement+reason pair into an A–R question ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"The transition metals and their compounds are known for their catalytic activity."*\n' +
      '> **NCERT (reason):** *"This activity is ascribed to their ability to adopt multiple oxidation states and to form complexes."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Transition metals and their compounds are good catalysts.\n' +
      '- **Reason (R):** They can adopt variable oxidation states and form complexes (e.g. Fe shuttling between $+3$ and $+2$).\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** whenever NCERT says *"X happens **because** Y"*, read it as a ready-made Assertion–Reason question — A = X, R = Y.'),

    // ── DEVICE: a real, answer-verified PYQ next to its NCERT line ──
    h.worked('🏛️ Exam Vault · JEE Main 2024 (PYQ)', 'solved_example',
      'Iron(III) catalyses the reaction between iodide and persulphate ions, in which:\n\n' +
      'A. $\\ce{Fe^{3+}}$ oxidises the iodide ion\nB. $\\ce{Fe^{3+}}$ oxidises the persulphate ion\nC. $\\ce{Fe^{2+}}$ reduces the iodide ion\nD. $\\ce{Fe^{2+}}$ reduces the persulphate ion\n\n(1) B only  (2) A only  (3) B and C only  (4) A and D only',
      '**Answer: (4) A and D only.** Read the two NCERT steps straight off:\n\n' +
      '- Step 1: $2\\,\\ce{Fe^{3+}} + 2\\,\\ce{I^-} \\rightarrow 2\\,\\ce{Fe^{2+}} + \\ce{I2}$ — here $\\ce{Fe^{3+}}$ **oxidises the iodide ion** → **A is correct**.\n' +
      '- Step 2: $2\\,\\ce{Fe^{2+}} + \\ce{S2O8^{2-}} \\rightarrow 2\\,\\ce{Fe^{3+}} + 2\\,\\ce{SO4^{2-}}$ — here $\\ce{Fe^{2+}}$ **reduces the persulphate ion** → **D is correct**.\n\n' +
      'B is wrong ($\\ce{Fe^{3+}}$ acts on iodide, not persulphate) and C is wrong ($\\ce{Fe^{2+}}$ acts on persulphate, not iodide). So only **A and D**.\n\n' +
      '**Notice:** the two reactions in the question are NCERT\'s two explanation lines, word for word. If you can write the cycle, you have already answered the PYQ.'),

    h.recap([
      { label: 'Why catalysts', text: 'Transition metals catalyse because they can **adopt multiple oxidation states and form complexes**; on a solid surface they adsorb reactants, weaken their bonds and lower the activation energy.' },
      { label: 'The Fe(III) cycle', text: 'Fe shuttles $+3 \\rightleftharpoons +2$: $\\ce{Fe^{3+}}$ oxidises $\\ce{I^-} \\to \\ce{I2}$, then $\\ce{Fe^{2+}}$ reduces $\\ce{S2O8^{2-}} \\to \\ce{SO4^{2-}}$ — adds up to $2\\,\\ce{I^-} + \\ce{S2O8^{2-}} \\to \\ce{I2} + 2\\,\\ce{SO4^{2-}}$.' },
      { label: 'Interstitial = small atoms trapped', text: 'H, C or N caught in the metal lattice (TiC, $\\ce{Mn4N}$, $\\ce{Fe3H}$). Four hallmarks: **high m.p., very hard, retain metallic conductivity, chemically inert.**' },
      { label: 'Alloys', text: 'A blend of metals (random solid solution) formed when metallic radii are within ~**15%**. Ferrous alloys (Cr, V, W, Mo, Mn → steels); brass = Cu-Zn; bronze = Cu-Sn.' },
    ]),

    h.quiz([
      {
        question: 'According to NCERT, the catalytic activity of transition metals is mainly ascribed to:',
        options: [
          'their ability to adopt multiple oxidation states and to form complexes',
          'their low melting points and softness',
          'their fully filled $d$ orbitals',
          'their tendency to form coloured ions',
        ],
        correct_index: 0,
        explanation: 'NCERT attributes catalytic activity to the metals’ ability to adopt **multiple oxidation states** and to **form complexes** — which lets them shuttle electrons (as Fe does between +3 and +2). Low melting points, full $d$ orbitals and colour are unrelated to the catalysis explanation.',
      },
      {
        question: 'In the iron(III)-catalysed reaction $2\\,\\ce{I^-} + \\ce{S2O8^{2-}} \\rightarrow \\ce{I2} + 2\\,\\ce{SO4^{2-}}$, the role of iron is to:',
        options: [
          'stay permanently as $\\ce{Fe^{3+}}$ throughout',
          'cycle between $+3$ and $+2$, oxidising $\\ce{I^-}$ then being re-oxidised by persulphate',
          'be consumed and not regenerated',
          'simply increase the temperature of the mixture',
        ],
        correct_index: 1,
        explanation: 'Fe is a genuine catalyst: $\\ce{Fe^{3+}}$ oxidises $\\ce{I^-}$ to $\\ce{I2}$ (becoming $\\ce{Fe^{2+}}$), then $\\ce{Fe^{2+}}$ reduces $\\ce{S2O8^{2-}}$ and returns to $\\ce{Fe^{3+}}$. It is regenerated, not consumed, and does not simply heat the mixture.',
      },
      {
        question: 'Which statement about interstitial compounds is INCORRECT?',
        options: [
          'They have high melting points, higher than those of pure metals',
          'They are very hard',
          'They are chemically reactive',
          'They retain metallic conductivity',
        ],
        correct_index: 2,
        explanation: 'NCERT lists interstitial compounds as **chemically inert**, not reactive — so the "chemically reactive" statement is the incorrect one. High melting points, great hardness and retained metallic conductivity are all correct hallmarks.',
      },
      {
        question: 'Interstitial compounds such as $\\ce{TiC}$ and $\\ce{Mn4N}$ are formed when:',
        options: [
          'large metal atoms dissolve in a non-metal lattice',
          'two transition metals of equal radius combine',
          'a metal is oxidised by oxygen',
          'small atoms like H, C or N are trapped inside the crystal lattices of metals',
        ],
        correct_index: 3,
        explanation: 'Interstitial compounds form when **small atoms (H, C, N)** lodge in the interstices of a metal lattice. They are non-stoichiometric and their formulas do not correspond to any normal oxidation state of the metal. The other options describe alloys or oxidation, not interstitial formation.',
      },
      {
        question: 'Brass and bronze are industrially important alloys. Their compositions are, respectively:',
        options: [
          'copper-tin and copper-zinc',
          'copper-zinc and copper-tin',
          'iron-carbon and copper-zinc',
          'copper-nickel and copper-tin',
        ],
        correct_index: 1,
        explanation: 'NCERT states brass = **copper-zinc** and bronze = **copper-tin**. Option (1) swaps the two; the others introduce iron-carbon (steel) or copper-nickel, which are not these alloys.',
      },
      {
        question: 'Assertion (A): Transition metals readily form alloys with one another.\nReason (R): Their atoms have similar metallic radii (within about 15% of each other) and similar characteristics.\nChoose the correct option:',
        options: [
          'A is true but R is false',
          'A is false but R is true',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are true and R explains A: alloys (random solid solutions) form easily when metallic radii are within ~15% of each other, and transition metals satisfy this, so they alloy readily and the resulting alloys are hard with high melting points.',
      },
    ], 0.6),
  ],
};
