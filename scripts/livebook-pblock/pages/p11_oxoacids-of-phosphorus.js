// Ch.4 (p-Block) · Page 11 · Oxoacids of Phosphorus (NCERT §7.9, Table 7.5).
// The oxoacid table (name/formula/oxidation state/characteristic bonds/prep),
// the count-of-P-H-bonds → basicity & reducing-power rule, H3PO2 as a reducing
// agent, and the 4H3PO3 -> 3H3PO4 + PH3 disproportionation. Structures (Fig 7.4)
// as dark hand-drawn `h.img`. Hosts NCERT Example 7.9 + In-text Questions 7.11, 7.12.
module.exports = {
  page_number: 11,
  chapter: 4,
  slug: 'oxoacids-of-phosphorus',
  title: 'Oxoacids of Phosphorus',
  subtitle: 'A family of acids where one simple rule — count the P–H bonds — tells you the basicity and the reducing power at a glance.',
  tags: ['p-block', 'group-15', 'phosphorus', 'oxoacids', 'basicity'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A textbook plate showing three phosphorus oxoacid molecules in a row, each with a tetrahedral phosphorus centre: H3PO4 (three P–OH, one P=O), H3PO3 (two P–OH, one P–H, one P=O), and H3PO2 (one P–OH, two P–H, one P=O), with the P–H bonds drawn in a contrasting colour and a small label "count the P–H bonds". Clean inorganic-chemistry plate. Landscape, desktop-friendly.',
      '16:9',
      'Phosphorus oxoacids — the number of P–H bonds is the key to basicity and reducing power.'
    ),

    h.text(
      'Phosphorus forms a number of oxoacids. The important oxoacids of phosphorus with their formulas, methods of preparation and the presence of some characteristic bonds in their structures are given in Table 7.5.'
    ),
    h.table(
      ['Name', 'Formula', 'Oxid. state of P', 'Characteristic bonds & their number', 'Preparation'],
      [
        ['Hypophosphorous (Phosphinic)', 'H₃PO₂', '+1', 'One P–OH, Two P–H, One P=O', 'white P₄ + alkali'],
        ['Orthophosphorous (Phosphonic)', 'H₃PO₃', '+3', 'Two P–OH, One P–H, One P=O', 'P₂O₃ + H₂O'],
        ['Pyrophosphorous', 'H₄P₂O₅', '+3', 'Two P–OH, Two P–H, Two P=O', 'PCl₃ + H₃PO₃'],
        ['Hypophosphoric', 'H₄P₂O₆', '+4', 'Four P–OH, Two P=O, One P–P', 'red P₄ + alkali'],
        ['Orthophosphoric', 'H₃PO₄', '+5', 'Three P–OH, One P=O', 'P₄O₁₀ + H₂O'],
        ['Pyrophosphoric', 'H₄P₂O₇', '+5', 'Four P–OH, Two P=O, One P–O–P', 'heat phosphoric acid'],
        ['Metaphosphoric*', '(HPO₃)ₙ', '+5', 'Three P–OH, Three P=O, Three P–O–P', 'phosphoric acid + Br₂, heat in sealed tube'],
      ],
      'Table 7.5 — Oxoacids of phosphorus. *Metaphosphoric acid exists in polymeric forms only; the bonds quoted are for (HPO₃)₃.'
    ),

    h.img(
      'A hand-drawn coloured molecular-structure plate on a deep charcoal (#121316) background, muted earthy palette, no glow. Four phosphorus oxoacid structures labelled below each: "H3PO4 Orthophosphoric acid" (P with one P=O at top and three P–OH), "H4P2O7 Pyrophosphoric acid" (two P tetrahedra joined by a bridging P–O–P oxygen, each with P=O and P–OH groups), "H3PO3 Orthophosphorous acid" (P with one P=O, two P–OH and one P–H, the P–H drawn in contrasting colour), and "H3PO2 Hypophosphorous acid" (P with one P=O, one P–OH and two P–H drawn in contrasting colour). Clean inorganic textbook diagrams in a 2x2 grid. Landscape.',
      '16:9',
      'Fig. 7.4 — Structures of some important oxoacids of phosphorus (note the P–H bonds in H₃PO₃ and H₃PO₂).'
    ),

    h.heading('Structure and the P–H bond rule', 'Use the number of P=O, P–OH and P–H bonds to predict basicity and reducing behaviour.'),
    h.text(
      'In oxoacids phosphorus is **tetrahedrally surrounded** by other atoms. All these acids contain **one P=O and at least one P–OH bond**. The oxoacids in which phosphorus has lower oxidation state (less than +5) contain, in addition to P=O and P–OH bonds, **either P–P (e.g., in $\\ce{H4P2O6}$) or P–H (e.g., in $\\ce{H3PO2}$) bonds but not both**.\n\n' +
      'These acids in **+3 oxidation state** of phosphorus tend to **disproportionate** to higher and lower oxidation states. For example, orthophosphorous acid (or phosphorous acid) on heating disproportionates to give orthophosphoric acid (or phosphoric acid) and phosphine.\n\n' +
      '$$\\ce{4H3PO3 -> 3H3PO4 + PH3}$$'
    ),
    h.text(
      'The **acids which contain P–H bonds have strong reducing properties**. Thus, hypophosphorous acid is a good reducing agent as it contains two P–H bonds and reduces, for example, $\\ce{AgNO3}$ to metallic silver.\n\n' +
      '$$\\ce{4AgNO3 + 2H2O + H3PO2 -> 4Ag + 4HNO3 + H3PO4}$$\n\n' +
      'These **P–H bonds are not ionisable** to give $\\ce{H+}$ and do not play any role in basicity. Only those H atoms which are **attached with oxygen in P–OH form are ionisable** and cause the basicity. Thus, $\\ce{H3PO3}$ and $\\ce{H3PO4}$ are **dibasic** and **tribasic** respectively, as the structure of $\\ce{H3PO3}$ has two P–OH bonds and $\\ce{H3PO4}$ three.'
    ),
    h.callout('exam_tip', 'Exam Point — count the P–H bonds',
      'One rule unlocks the whole family:\n\n' +
      '- **Basicity = number of P–OH bonds** (the P–H hydrogens are *not* ionisable). So $\\ce{H3PO2}$ is **monobasic** (1 P–OH), $\\ce{H3PO3}$ **dibasic** (2 P–OH), $\\ce{H3PO4}$ **tribasic** (3 P–OH) — even though all three are "$\\ce{H3PO_x}$".\n' +
      '- **Reducing power ∝ number of P–H bonds.** $\\ce{H3PO2}$ (two P–H) is the strongest reducer (reduces $\\ce{AgNO3}$ → Ag); $\\ce{H3PO3}$ (one P–H) is a weaker reducer; $\\ce{H3PO4}$ (no P–H) is **not** a reducing agent.\n' +
      '- **+3 acids disproportionate** on heating: $\\ce{4H3PO3 -> 3H3PO4 + PH3}$.'),

    h.worked('NCERT Example 7.9', 'solved_example',
      'How do you account for the reducing behaviour of $\\ce{H3PO2}$ on the basis of its structure?',
      'In $\\ce{H3PO2}$, two H atoms are bonded directly to the P atom, which imparts reducing character to the acid.'),
    h.worked('In-text Question 7.11', 'ncert_intext',
      'What is the basicity of $\\ce{H3PO4}$?',
      'The basicity of an oxoacid equals the number of ionisable **P–OH** (oxygen-attached) hydrogens. Orthophosphoric acid $\\ce{H3PO4}$ has **three P–OH bonds**, so its basicity is **three — it is tribasic**.'),
    h.worked('In-text Question 7.12', 'ncert_intext',
      'What happens when $\\ce{H3PO3}$ is heated?',
      'Phosphorous acid is a +3 oxoacid, so on heating it **disproportionates** to a higher (+5) and a lower (−3) oxidation state, giving orthophosphoric acid and phosphine:\n\n$$\\ce{4H3PO3 -> 3H3PO4 + PH3}$$'),

    h.recap([
      { label: 'Common features', text: 'All P oxoacids have phosphorus **tetrahedrally surrounded**, with **one P=O and at least one P–OH** bond. Lower-oxidation-state acids also have **P–P or P–H (not both)**.' },
      { label: 'Basicity', text: '= number of **P–OH** bonds (P–H hydrogens are non-ionisable). $\\ce{H3PO2}$ monobasic · $\\ce{H3PO3}$ dibasic · $\\ce{H3PO4}$ tribasic.' },
      { label: 'Reducing power', text: '∝ number of **P–H** bonds. $\\ce{H3PO2}$ (2 P–H) > $\\ce{H3PO3}$ (1 P–H); $\\ce{H3PO4}$ (no P–H) is not reducing. $\\ce{H3PO2}$ reduces $\\ce{AgNO3}$ → Ag.' },
      { label: 'Disproportionation', text: '+3 acids disproportionate on heating: $\\ce{4H3PO3 -> 3H3PO4 + PH3}$.' },
    ]),

    h.quiz([
      {
        question: 'The basicity of an oxoacid of phosphorus is decided by the number of:',
        options: [
          'P=O bonds',
          'P–H bonds',
          'P–OH bonds',
          'P–P bonds',
        ],
        correct_index: 2,
        explanation: 'Only the H atoms in P–OH groups are ionisable. The basicity equals the number of P–OH bonds; P–H hydrogens are not ionisable.',
      },
      {
        question: 'Among H₃PO₂, H₃PO₃ and H₃PO₄, the order of basicity is:',
        options: [
          'H₃PO₂ < H₃PO₃ < H₃PO₄ (1, 2 and 3 respectively)',
          'H₃PO₄ < H₃PO₃ < H₃PO₂',
          'all are tribasic',
          'all are monobasic',
        ],
        correct_index: 0,
        explanation: '$\\ce{H3PO2}$ has one P–OH (monobasic), $\\ce{H3PO3}$ two (dibasic) and $\\ce{H3PO4}$ three (tribasic) — basicity increases in that order.',
      },
      {
        question: 'Hypophosphorous acid (H₃PO₂) is a good reducing agent because it contains:',
        options: [
          'three P–OH bonds',
          'two P–H bonds',
          'a P–P bond',
          'no P=O bond',
        ],
        correct_index: 1,
        explanation: 'The reducing power comes from P–H bonds. $\\ce{H3PO2}$ has two P–H bonds, making it the strongest reducer among the common P oxoacids (it reduces $\\ce{AgNO3}$ to Ag).',
      },
      {
        question: 'Which of the following oxoacids of phosphorus is NOT a reducing agent?',
        options: ['H₃PO₂', 'H₃PO₃', 'H₃PO₄', 'H₄P₂O₅'],
        correct_index: 2,
        explanation: 'Orthophosphoric acid $\\ce{H3PO4}$ has no P–H bond (three P–OH and one P=O), so it is not a reducing agent. The others contain P–H bonds.',
      },
      {
        question: 'When phosphorous acid (H₃PO₃) is heated, it:',
        options: [
          'sublimes unchanged',
          'disproportionates to H₃PO₄ and PH₃',
          'forms only PH₃',
          'is oxidised to H₄P₂O₇',
        ],
        correct_index: 1,
        explanation: 'Being a +3 acid, $\\ce{H3PO3}$ disproportionates on heating: $\\ce{4H3PO3 -> 3H3PO4 + PH3}$ (P goes to +5 and −3).',
      },
      {
        question: 'A feature common to ALL the oxoacids of phosphorus is the presence of:',
        options: [
          'at least one P–H bond',
          'a P–P bond',
          'one P=O and at least one P–OH bond',
          'three P–OH bonds',
        ],
        correct_index: 2,
        explanation: 'In every phosphorus oxoacid the phosphorus is tetrahedrally surrounded and carries one P=O and at least one P–OH bond; P–H and P–P bonds appear only in the lower-oxidation-state acids.',
      },
    ], 0.6),
  ],
};
