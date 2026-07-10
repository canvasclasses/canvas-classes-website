// Ch.4 (p-Block) · Page 19 · Hydrogen Chloride (NCERT §7.20).
// Compound page: preparation (NaCl + conc H2SO4), properties (colourless pungent
// gas, hydrochloric acid, reaction with NH3, aqua regia, decomposition of weaker
// acid salts), uses. NCERT content transcribed faithfully; notes-enrichment in
// "Exam Point" callouts. Hosts NCERT Example 7.18 (HCl + Fe -> FeCl2, not FeCl3).
module.exports = {
  page_number: 19,
  chapter: 4,
  slug: 'hydrogen-chloride',
  title: 'Hydrogen Chloride',
  subtitle: 'The colourless, pungent gas that becomes hydrochloric acid — and the 3:1 acid mixture (aqua regia) that dissolves gold.',
  tags: ['p-block', 'group-17', 'hydrogen-chloride', 'aqua-regia', 'halogens'],
  reading_time_min: 5,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A flask of common salt being heated with concentrated sulphuric acid, releasing colourless hydrogen chloride gas that forms white fumes of ammonium chloride when it meets ammonia vapour from a nearby bottle. A small inset shows a gold nugget dissolving in a beaker of orange aqua regia (3 HCl : 1 HNO3). Clean inorganic textbook plate, landscape, desktop-friendly.',
      '16:9',
      'Hydrogen chloride — white fumes with ammonia; in aqua regia (with nitric acid) it even dissolves gold.'
    ),

    h.text(
      'Glauber prepared this acid in 1648 by heating common salt with concentrated sulphuric acid. Davy in 1810 showed that it is a compound of hydrogen and chlorine.'
    ),

    h.heading('Preparation', 'Write the laboratory preparation of hydrogen chloride and how the gas is dried.'),
    h.text(
      'In laboratory, it is prepared by heating sodium chloride with concentrated sulphuric acid.\n\n' +
      '$$\\ce{NaCl + H2SO4 ->[\\text{420 K}] NaHSO4 + HCl}$$\n' +
      '$$\\ce{NaHSO4 + NaCl ->[\\text{823 K}] Na2SO4 + HCl}$$\n\n' +
      '$\\ce{HCl}$ gas can be dried by passing through concentrated sulphuric acid.'
    ),

    h.heading('Properties', 'Describe the physical properties of hydrogen chloride, its behaviour as hydrochloric acid, the formation of aqua regia, and its reaction with salts of weaker acids.'),
    h.text(
      '**Physical properties**\n\n' +
      '- It is a **colourless** and **pungent smelling gas**.\n' +
      '- It is **easily liquefied** to a colourless liquid (b.p. 189 K) and **freezes** to a white crystalline solid (f.p. 159 K).\n' +
      '- It is **extremely soluble in water** and ionises as below.\n\n' +
      '$$\\ce{HCl(g) + H2O(l) -> H3O^{+}(aq) + Cl^{-}(aq)} \\qquad K_a = 10^{7}$$\n\n' +
      'Its aqueous solution is called **hydrochloric acid**. The high value of the dissociation constant ($K_a$) indicates that it is a **strong acid** in water.'
    ),
    h.text('**Chemical properties**'),
    h.text(
      '**Reacts with $\\ce{NH3}$** and gives white fumes of $\\ce{NH4Cl}$.\n\n' +
      '$$\\ce{NH3 + HCl -> NH4Cl}$$'
    ),
    h.text(
      '**Forms aqua regia.** When **three parts of concentrated $\\ce{HCl}$ and one part of concentrated $\\ce{HNO3}$** are mixed, **aqua regia** is formed, which is used for dissolving noble metals, e.g., gold, platinum.\n\n' +
      '$$\\ce{Au + 4H^{+} + NO3^{-} + 4Cl^{-} -> AuCl4^{-} + NO + 2H2O}$$\n' +
      '$$\\ce{3Pt + 16H^{+} + 4NO3^{-} + 18Cl^{-} -> 3PtCl6^{2-} + 4NO + 8H2O}$$'
    ),
    h.callout('exam_tip', 'Exam Point — aqua regia (royal water)',
      'Aqua regia = **3 volumes conc. HCl : 1 volume conc. HNO₃** ("3 : 1"). Neither acid alone touches gold or platinum, but together they do:\n\n' +
      '- $\\ce{HNO3}$ supplies the **oxidising power** (oxidises the metal).\n' +
      '- $\\ce{HCl}$ supplies $\\ce{Cl^-}$ that **complexes** the metal ion ($\\ce{AuCl4^-}$, $\\ce{PtCl6^{2-}}$), pulling the equilibrium forward.\n\n' +
      'Remember the **3 : 1 ratio** and that it dissolves the noble metals gold and platinum.'),
    h.text(
      '**Decomposes salts of weaker acids.** Hydrochloric acid decomposes salts of weaker acids, e.g., carbonates, hydrogencarbonates, sulphites, etc.\n\n' +
      '$$\\ce{Na2CO3 + 2HCl -> 2NaCl + H2O + CO2}$$\n' +
      '$$\\ce{NaHCO3 + HCl -> NaCl + H2O + CO2}$$\n' +
      '$$\\ce{Na2SO3 + 2HCl -> 2NaCl + H2O + SO2}$$'
    ),

    h.worked('NCERT Example 7.18', 'solved_example',
      'When $\\ce{HCl}$ reacts with finely powdered iron, it forms ferrous chloride and not ferric chloride. Why?',
      'Its reaction with iron produces $\\ce{H2}$.\n\n$$\\ce{Fe + 2HCl -> FeCl2 + H2}$$\n\nLiberation of hydrogen prevents the formation of ferric chloride.'),

    h.heading('Uses'),
    h.text(
      'It is used (i) in the manufacture of chlorine, $\\ce{NH4Cl}$ and glucose (from corn starch), (ii) for extracting glue from bones and purifying bone black, (iii) in medicine and as a laboratory reagent.'
    ),

    h.recap([
      { label: 'Made by', text: 'heating $\\ce{NaCl}$ with conc. $\\ce{H2SO4}$ — $\\ce{NaCl + H2SO4 ->[420 K] NaHSO4 + HCl}$ then $\\ce{NaHSO4 + NaCl ->[823 K] Na2SO4 + HCl}$. Dried over conc. $\\ce{H2SO4}$.' },
      { label: 'Physical', text: 'colourless, pungent gas; b.p. 189 K, f.p. 159 K; extremely soluble in water → **hydrochloric acid** (strong acid, $K_a = 10^7$).' },
      { label: 'With ammonia', text: '$\\ce{NH3 + HCl -> NH4Cl}$ — **white fumes** (classic identification test).' },
      { label: 'Aqua regia', text: '**3 conc. HCl : 1 conc. HNO₃**; dissolves **gold and platinum** ($\\ce{AuCl4^-}$, $\\ce{PtCl6^{2-}}$).' },
      { label: 'With salts', text: 'displaces weaker acids from carbonates/bicarbonates ($\\ce{CO2}$) and sulphites ($\\ce{SO2}$).' },
      { label: 'With iron', text: '$\\ce{Fe + 2HCl -> FeCl2 + H2}$ — gives **ferrous** (not ferric) chloride; the $\\ce{H2}$ liberated prevents oxidation to $\\ce{Fe^{3+}}$.' },
    ]),

    h.quiz([
      {
        question: 'Aqua regia, used to dissolve gold and platinum, is a mixture of:',
        options: [
          '3 parts conc. HNO3 and 1 part conc. HCl',
          '3 parts conc. HCl and 1 part conc. HNO3',
          'equal volumes of HCl and H2SO4',
          '1 part conc. HCl and 3 parts conc. H2SO4',
        ],
        correct_index: 1,
        explanation: 'Aqua regia is 3 volumes of concentrated $\\ce{HCl}$ to 1 volume of concentrated $\\ce{HNO3}$. The $\\ce{HNO3}$ oxidises the metal and the $\\ce{Cl^-}$ complexes the ion ($\\ce{AuCl4^-}$, $\\ce{PtCl6^{2-}}$).',
      },
      {
        question: 'When HCl reacts with finely powdered iron, the product is:',
        options: [
          '$\\ce{FeCl3}$ and $\\ce{H2}$',
          '$\\ce{FeCl2}$ and $\\ce{H2}$',
          '$\\ce{FeCl2}$ and $\\ce{Cl2}$',
          '$\\ce{Fe(OH)2}$ and $\\ce{H2}$',
        ],
        correct_index: 1,
        explanation: '$\\ce{Fe + 2HCl -> FeCl2 + H2}$. The hydrogen liberated prevents oxidation of iron to the +3 state, so ferrous (not ferric) chloride forms.',
      },
      {
        question: 'In the laboratory, hydrogen chloride gas is prepared by heating sodium chloride with:',
        options: [
          'concentrated nitric acid',
          'concentrated sulphuric acid',
          'dilute hydrochloric acid',
          'sodium hydroxide',
        ],
        correct_index: 1,
        explanation: '$\\ce{NaCl + H2SO4 ->[420 K] NaHSO4 + HCl}$, then $\\ce{NaHSO4 + NaCl ->[823 K] Na2SO4 + HCl}$. The gas is dried over concentrated $\\ce{H2SO4}$.',
      },
      {
        question: 'White fumes are seen when hydrogen chloride gas meets:',
        options: [
          'water vapour',
          'oxygen',
          'ammonia',
          'carbon dioxide',
        ],
        correct_index: 2,
        explanation: '$\\ce{NH3 + HCl -> NH4Cl}$ — solid ammonium chloride forms as a white fume, a classic test for either gas.',
      },
      {
        question: 'An aqueous solution of hydrogen chloride (hydrochloric acid) is a strong acid because:',
        options: [
          'it has a very small dissociation constant',
          'it is only slightly soluble in water',
          'it has a high dissociation constant ($K_a = 10^7$), so it is almost fully ionised',
          'it does not ionise in water',
        ],
        correct_index: 2,
        explanation: 'The large $K_a$ ($10^7$) shows $\\ce{HCl}$ is almost completely ionised into $\\ce{H3O+}$ and $\\ce{Cl^-}$ in water, making it a strong acid.',
      },
    ], 0.6),
  ],
};
