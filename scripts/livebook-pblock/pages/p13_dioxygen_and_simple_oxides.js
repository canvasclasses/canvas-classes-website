// Ch.4 (p-Block) · Page 13 · Dioxygen & Simple Oxides (NCERT §7.11 + §7.12).
// Compound-page format: hero img → dioxygen preparation (labelled equations)
// → properties (bullets) + reactions (bold-labeled points) → uses → simple
// oxides classification (acidic/basic/amphoteric/neutral). NCERT transcribed
// faithfully; notes-enrichment in `exam_tip`. Hosts In-text Qs 7.16 & 7.17.
module.exports = {
  page_number: 13,
  chapter: 4,
  slug: 'dioxygen-and-simple-oxides',
  title: 'Dioxygen & Simple Oxides',
  subtitle: 'How dioxygen is prepared, why O₂ is paramagnetic, the reactions that build oxides — and how those oxides sort into acidic, basic, amphoteric and neutral.',
  tags: ['p-block', 'group-16', 'dioxygen', 'oxides', 'oxygen'],
  reading_time_min: 6,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Central motif: a pair of bonded oxygen atoms (the O₂ molecule) drawn as a chalk-and-coloured-pencil textbook sketch, surrounded by small labelled vignettes of oxygen reacting — a flame (combustion), a piece of metal rusting, and a tiny "magnet attracting O₂" symbol to hint at paramagnetism. Clean inorganic plate, landscape, desktop-friendly.',
      '16:9',
      'Dioxygen — a colourless, odourless gas that is paramagnetic despite an even number of electrons.'
    ),

    h.heading('Preparation', 'List the laboratory and industrial methods of preparing dioxygen.'),
    h.text(
      'Dioxygen can be obtained in the laboratory by the following ways:\n\n' +
      '**(i) By heating oxygen-containing salts** such as chlorates, nitrates and permanganates.\n\n' +
      '$$\\ce{2KClO3 ->[\\text{Heat}][\\ce{MnO2}] 2KCl + 3O2}$$\n\n' +
      '**(ii) By the thermal decomposition** of the oxides of metals low in the electrochemical series and higher oxides of some metals.\n\n' +
      '$$\\ce{2Ag2O(s) -> 4Ag(s) + O2(g)}$$\n' +
      '$$\\ce{2Pb3O4(s) -> 6PbO(s) + O2(g)}$$\n' +
      '$$\\ce{2HgO(s) -> 2Hg(l) + O2(g)}$$\n' +
      '$$\\ce{2PbO2(s) -> 2PbO(s) + O2(g)}$$\n\n' +
      '**(iii) By decomposing hydrogen peroxide**, which is readily decomposed into water and dioxygen by catalysts such as finely divided metals and manganese dioxide.\n\n' +
      '$$\\ce{2H2O2(aq) -> 2H2O(l) + O2(g)}$$\n\n' +
      '**(iv) On a large scale it can be prepared from water or air.** Electrolysis of water leads to the release of hydrogen at the cathode and oxygen at the anode. Industrially, dioxygen is obtained from air by first removing carbon dioxide and water vapour and then liquefying and fractionally distilling the remaining gases to give dinitrogen and dioxygen.'
    ),

    h.heading('Properties', 'Relate the physical properties of dioxygen — including its paramagnetism — to its behaviour, and describe its reactions with metals and non-metals.'),
    h.text(
      '**Physical properties**\n\n' +
      '- Colourless and odourless gas.\n' +
      '- Solubility in water is to the extent of **3.08 cm³ in 100 cm³ water at 293 K** — just sufficient for the vital support of marine and aquatic life.\n' +
      '- It liquefies at **90 K** and freezes at **55 K**.\n' +
      '- It has three stable isotopes: $\\ce{^{16}O}$, $\\ce{^{17}O}$ and $\\ce{^{18}O}$.\n' +
      '- Molecular oxygen, $\\ce{O2}$, is **paramagnetic** in spite of having an even number of electrons.'
    ),
    h.text('**Chemical properties**'),
    h.text(
      '**Reacts with nearly all metals and non-metals.** Dioxygen directly reacts with nearly all metals and non-metals except some metals (e.g., $\\ce{Au}$, $\\ce{Pt}$) and some noble gases. Its combination with other elements is often strongly **exothermic**, which helps in sustaining the reaction. However, to initiate the reaction, some external heating is required as the bond dissociation enthalpy of the oxygen–oxygen double bond is high (**493.4 kJ mol⁻¹**).\n\n' +
      '$$\\ce{2Ca + O2 -> 2CaO}$$\n' +
      '$$\\ce{4Al + 3O2 -> 2Al2O3}$$\n' +
      '$$\\ce{P4 + 5O2 -> P4O10}$$\n' +
      '$$\\ce{C + O2 -> CO2}$$\n' +
      '$$\\ce{2ZnS + 3O2 -> 2ZnO + 2SO2}$$\n' +
      '$$\\ce{CH4 + 2O2 -> CO2 + 2H2O}$$'
    ),
    h.text(
      '**Some compounds are catalytically oxidised.** For example:\n\n' +
      '$$\\ce{2SO2 + O2 ->[\\ce{V2O5}] 2SO3}$$\n' +
      '$$\\ce{4HCl + O2 ->[\\ce{CuCl2}] 2Cl2 + 2H2O}$$'
    ),
    h.callout('exam_tip', 'Exam Point — why is O₂ paramagnetic?',
      'Molecular orbital theory (Class XI, Unit 4) places the last two electrons of $\\ce{O2}$ singly in the two degenerate $\\pi^*$ antibonding orbitals (Hund’s rule). Those **two unpaired electrons** make $\\ce{O2}$ paramagnetic even though its total electron count is even — a classic "explain the anomaly" question.'),

    h.heading('Uses'),
    h.text(
      'In addition to its importance in normal respiration and combustion processes, oxygen is used in oxyacetylene welding, in the manufacture of many metals, particularly steel. Oxygen cylinders are widely used in hospitals, high altitude flying and in mountaineering. The combustion of fuels, e.g., hydrazines in liquid oxygen, provides tremendous thrust in rockets.'
    ),

    h.worked('In-text Question 7.16', 'ncert_intext',
      'Which of the following does not react with oxygen directly? $\\ce{Zn}$, $\\ce{Ti}$, $\\ce{Pt}$, $\\ce{Fe}$.',
      '**$\\ce{Pt}$ (platinum)** does not react with oxygen directly. Like gold, platinum is a noble metal and is not oxidised by dioxygen; $\\ce{Zn}$, $\\ce{Ti}$ and $\\ce{Fe}$ all form their oxides.'),
    h.worked('In-text Question 7.17', 'ncert_intext',
      'Complete the following reactions:\n(i) $\\ce{C2H4 + O2 ->}$\n(ii) $\\ce{4Al + 3O2 ->}$',
      '(i) Complete combustion of ethene gives carbon dioxide and water:\n\n$$\\ce{C2H4 + 3O2 -> 2CO2 + 2H2O}$$\n\n(ii) Aluminium burns in oxygen to give aluminium oxide:\n\n$$\\ce{4Al + 3O2 -> 2Al2O3}$$'),

    h.heading('Simple Oxides', 'Classify oxides as acidic, basic, amphoteric or neutral, and give examples of each.'),
    h.text(
      'A binary compound of oxygen with another element is called **oxide**. Oxygen reacts with most of the elements of the periodic table to form oxides. In many cases one element forms two or more oxides. The oxides vary widely in their nature and properties. **Oxides can be simple** (e.g., $\\ce{MgO}$, $\\ce{Al2O3}$) **or mixed** ($\\ce{Pb3O4}$, $\\ce{Fe3O4}$). Simple oxides can be classified on the basis of their acidic, basic or amphoteric character.'
    ),
    h.text(
      '**Acidic oxides.** An oxide that combines with water to give an acid is termed acidic oxide (e.g., $\\ce{SO2}$, $\\ce{Cl2O7}$, $\\ce{CO2}$, $\\ce{N2O5}$). For example, $\\ce{SO2}$ combines with water to give $\\ce{H2SO3}$, an acid:\n\n' +
      '$$\\ce{SO2 + H2O -> H2SO3}$$\n\n' +
      'As a general rule, only non-metal oxides are acidic, but oxides of some metals in high oxidation state also have acidic character (e.g., $\\ce{Mn2O7}$, $\\ce{CrO3}$, $\\ce{V2O5}$).'
    ),
    h.text(
      '**Basic oxides.** The oxides which give a base with water are known as basic oxides (e.g., $\\ce{Na2O}$, $\\ce{CaO}$, $\\ce{BaO}$). For example, $\\ce{CaO}$ combines with water to give $\\ce{Ca(OH)2}$, a base:\n\n' +
      '$$\\ce{CaO + H2O -> Ca(OH)2}$$\n\n' +
      'In general, metallic oxides are basic.'
    ),
    h.text(
      '**Amphoteric oxides.** Some metallic oxides exhibit a dual behaviour. They show characteristics of both acidic as well as basic oxides. Such oxides react with acids as well as alkalies. For example, $\\ce{Al2O3}$ reacts with acids as well as alkalies:\n\n' +
      '$$\\ce{Al2O3(s) + 6HCl(aq) + 9H2O(l) -> 2[Al(H2O)6]^{3+}(aq) + 6Cl^{-}(aq)}$$\n' +
      '$$\\ce{Al2O3(s) + 6NaOH(aq) + 3H2O(l) -> 2Na3[Al(OH)6](aq)}$$'
    ),
    h.text(
      '**Neutral oxides.** There are some oxides which are neither acidic nor basic. Such oxides are known as neutral oxides. Examples of neutral oxides are $\\ce{CO}$, $\\ce{NO}$ and $\\ce{N2O}$.'
    ),

    h.recap([
      { label: 'Made by', text: 'heating $\\ce{KClO3}$/$\\ce{MnO2}$; thermal decomposition of $\\ce{Ag2O}$, $\\ce{HgO}$, $\\ce{Pb3O4}$, $\\ce{PbO2}$; decomposing $\\ce{H2O2}$; electrolysis of water / fractional distillation of air.' },
      { label: 'Key facts', text: 'colourless, odourless; b.p. 90 K, m.p. 55 K; isotopes $\\ce{^{16}O}$/$\\ce{^{17}O}$/$\\ce{^{18}O}$; **paramagnetic** (two unpaired $\\pi^*$ electrons); O=O bond enthalpy 493.4 kJ mol⁻¹.' },
      { label: 'Reactions', text: 'oxidises nearly all metals/non-metals (not $\\ce{Au}$, $\\ce{Pt}$, noble gases); catalytic oxidations $\\ce{SO2 -> SO3}$ ($\\ce{V2O5}$), $\\ce{HCl -> Cl2}$ ($\\ce{CuCl2}$).' },
      { label: 'Oxide types', text: '**acidic** ($\\ce{SO2}$, $\\ce{CO2}$, $\\ce{N2O5}$, $\\ce{Mn2O7}$) · **basic** ($\\ce{Na2O}$, $\\ce{CaO}$) · **amphoteric** ($\\ce{Al2O3}$) · **neutral** ($\\ce{CO}$, $\\ce{NO}$, $\\ce{N2O}$).' },
    ]),

    h.quiz([
      {
        question: 'On heating, which reagent (with MnO₂ as catalyst) is a standard laboratory source of dioxygen?',
        options: ['NaCl', 'KClO₃', 'CaCO₃', 'NH₄Cl'],
        correct_index: 1,
        explanation: '$\\ce{2KClO3 ->[\\ce{MnO2}] 2KCl + 3O2}$ — potassium chlorate decomposes on heating to give dioxygen.',
      },
      {
        question: 'Molecular oxygen (O₂) is paramagnetic because:',
        options: [
          'it has an odd number of electrons',
          'it has two unpaired electrons in its π* antibonding orbitals',
          'it contains a double bond',
          'it forms hydrogen bonds',
        ],
        correct_index: 1,
        explanation: 'By MO theory the last two electrons of $\\ce{O2}$ occupy the two degenerate $\\pi^*$ orbitals singly, so $\\ce{O2}$ has two unpaired electrons and is paramagnetic despite an even electron count.',
      },
      {
        question: 'Which metal does NOT react directly with dioxygen?',
        options: ['Calcium', 'Aluminium', 'Platinum', 'Zinc'],
        correct_index: 2,
        explanation: 'Noble metals such as $\\ce{Pt}$ (and $\\ce{Au}$) do not combine directly with dioxygen; Ca, Al and Zn all form their oxides.',
      },
      {
        question: 'An oxide that reacts with both acids and alkalies is called:',
        options: ['an acidic oxide', 'a basic oxide', 'an amphoteric oxide', 'a neutral oxide'],
        correct_index: 2,
        explanation: 'Amphoteric oxides such as $\\ce{Al2O3}$ show dual behaviour, reacting with acids as well as alkalies.',
      },
      {
        question: 'Which of the following is a neutral oxide?',
        options: ['SO₂', 'CaO', 'Al₂O₃', 'N₂O'],
        correct_index: 3,
        explanation: '$\\ce{N2O}$ (like $\\ce{CO}$ and $\\ce{NO}$) is neutral — neither acidic nor basic. $\\ce{SO2}$ is acidic, $\\ce{CaO}$ basic and $\\ce{Al2O3}$ amphoteric.',
      },
      {
        question: 'Even some metal oxides can be acidic. Which set shows acidic metal oxides (high oxidation state)?',
        options: [
          'Na₂O, CaO, BaO',
          'Mn₂O₇, CrO₃, V₂O₅',
          'MgO, Al₂O₃, ZnO',
          'CO, NO, N₂O',
        ],
        correct_index: 1,
        explanation: 'Oxides of metals in a high oxidation state — $\\ce{Mn2O7}$, $\\ce{CrO3}$, $\\ce{V2O5}$ — are acidic, even though metal oxides are generally basic.',
      },
    ], 0.6),
  ],
};
