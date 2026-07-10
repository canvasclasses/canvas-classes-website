// Ch.4 (p-Block) · Page 7 · Nitric Acid (NCERT §7.5).
// Compound page: lab prep + Ostwald's process → properties (strong acid +
// oxidising agent: Cu/Zn dil-vs-conc product matrix, passivation of Cr/Al,
// oxidation of non-metals) → Brown Ring Test → uses. No NCERT Example / In-text
// Question falls in §7.5. NCERT transcribed faithfully; notes in exam_tip.
module.exports = {
  page_number: 7,
  chapter: 4,
  slug: 'nitric-acid',
  title: 'Nitric Acid',
  subtitle: 'Made industrially by Ostwald’s process, nitric acid is both a strong acid and a powerful oxidising agent — its products depend on concentration, temperature and the metal.',
  tags: ['p-block', 'group-15', 'nitric-acid', 'ostwald-process', 'brown-ring-test'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Centre-left: a planar nitric acid (HNO3) molecule with the bond parameters marked (H–O 96 pm, 102° angle, N–O 121 pm, 130° angle, 140.6 pm). Centre-right: a small Ostwald-process flow with "NH3 + O2 over Pt/Rh gauze, 500 K, 9 bar" leading through NO and NO2 to "HNO3". Textbook plate style, landscape, desktop-friendly.',
      '16:9',
      'Nitric acid — the planar HNO₃ molecule, and the Ostwald route that makes it on an industrial scale.'
    ),

    h.text(
      'Nitrogen forms oxoacids such as $\\ce{H2N2O2}$ (hyponitrous acid), $\\ce{HNO2}$ (nitrous acid) and $\\ce{HNO3}$ (nitric acid). Amongst them **$\\ce{HNO3}$ is the most important**.'
    ),

    h.heading('Preparation', 'Describe the laboratory preparation and the industrial Ostwald’s process for nitric acid.'),
    h.text(
      'In the laboratory, nitric acid is prepared by heating $\\ce{KNO3}$ or $\\ce{NaNO3}$ and concentrated $\\ce{H2SO4}$ in a glass retort.\n\n' +
      '$$\\ce{NaNO3 + H2SO4 -> NaHSO4 + HNO3}$$'
    ),
    h.text(
      'On a large scale it is prepared mainly by **Ostwald’s process**. This method is based upon the **catalytic oxidation of $\\ce{NH3}$** by atmospheric oxygen.\n\n' +
      '$$\\ce{4NH3(g) + 5O2(g) ->[Pt/Rh\\ gauze][500\\ K,\\ 9\\ bar] 4NO(g) + 6H2O(g)}$$\n\n' +
      'Nitric oxide thus formed combines with oxygen giving $\\ce{NO2}$:\n\n' +
      '$$\\ce{2NO(g) + O2(g) <=> 2NO2(g)}$$\n\n' +
      'Nitrogen dioxide so formed dissolves in water to give $\\ce{HNO3}$:\n\n' +
      '$$\\ce{3NO2(g) + H2O(l) -> 2HNO3(aq) + NO(g)}$$\n\n' +
      'The $\\ce{NO}$ thus formed is recycled and the aqueous $\\ce{HNO3}$ can be concentrated by distillation up to ~68% by mass. Further concentration to 98% can be achieved by dehydration with concentrated $\\ce{H2SO4}$.'
    ),
    h.callout('exam_tip', 'Exam Point — the Ostwald sequence (write all three steps)',
      'Examiners ask for the **full chain** $\\ce{NH3 -> NO -> NO2 -> HNO3}$:\n\n' +
      '1. $\\ce{4NH3 + 5O2 ->[Pt/Rh] 4NO + 6H2O}$ (catalytic oxidation, 500 K, 9 bar).\n' +
      '2. $\\ce{2NO + O2 -> 2NO2}$.\n' +
      '3. $\\ce{3NO2 + H2O -> 2HNO3 + NO}$ — and the $\\ce{NO}$ is **recycled**.\n\n' +
      'Note the link to the previous compound: ammonia (made by Haber) feeds straight into nitric acid (made by Ostwald).'),

    h.heading('Properties', 'Describe nitric acid as a strong acid and a strong oxidising agent, including its products with Cu and Zn and its action on non-metals.'),
    h.text(
      '**Physical properties**\n\n' +
      '- A **colourless liquid** (f.p. 231.4 K and b.p. 355.6 K).\n' +
      '- Laboratory grade nitric acid contains ~68% of the $\\ce{HNO3}$ by mass and has a specific gravity of 1.504.\n' +
      '- In the gaseous state, $\\ce{HNO3}$ exists as a **planar molecule**.'
    ),
    h.text('**Chemical properties**'),
    h.text(
      '**Behaves as a strong acid** in aqueous solution, giving hydronium and nitrate ions:\n\n' +
      '$$\\ce{HNO3(aq) + H2O(l) -> H3O+(aq) + NO3^{-}(aq)}$$'
    ),
    h.text(
      '**Is a strong oxidising agent.** Concentrated nitric acid attacks most metals except noble metals such as gold and platinum. The products of oxidation depend upon the concentration of the acid, the temperature and the nature of the material undergoing oxidation.\n\n' +
      '$$\\ce{3Cu + 8HNO3(dilute) -> 3Cu(NO3)2 + 2NO + 4H2O}$$\n' +
      '$$\\ce{Cu + 4HNO3(conc.) -> Cu(NO3)2 + 2NO2 + 2H2O}$$'
    ),
    h.text(
      'Zinc reacts with **dilute** nitric acid to give $\\ce{N2O}$ and with **concentrated** acid to give $\\ce{NO2}$:\n\n' +
      '$$\\ce{4Zn + 10HNO3(dilute) -> 4Zn(NO3)2 + 5H2O + N2O}$$\n' +
      '$$\\ce{Zn + 4HNO3(conc.) -> Zn(NO3)2 + 2H2O + 2NO2}$$'
    ),
    h.text(
      '**Passivation.** Some metals (e.g., Cr, Al) do not dissolve in concentrated nitric acid because of the formation of a **passive film of oxide** on the surface.'
    ),
    h.text(
      '**Oxidises non-metals** and their compounds. Iodine is oxidised to iodic acid, carbon to carbon dioxide, sulphur to $\\ce{H2SO4}$, and phosphorus to phosphoric acid:\n\n' +
      '$$\\ce{I2 + 10HNO3 -> 2HIO3 + 10NO2 + 4H2O}$$\n' +
      '$$\\ce{C + 4HNO3 -> CO2 + 2H2O + 4NO2}$$\n' +
      '$$\\ce{S8 + 48HNO3(conc.) -> 8H2SO4 + 48NO2 + 16H2O}$$\n' +
      '$$\\ce{P4 + 20HNO3(conc.) -> 4H3PO4 + 20NO2 + 4H2O}$$'
    ),
    h.callout('exam_tip', 'Exam Point — the Cu/Zn × dilute/conc product matrix (high-yield)',
      'Memorise which **reduction product of $\\ce{HNO3}$** appears:\n\n' +
      '- **Cu + dilute $\\ce{HNO3}$ → $\\ce{NO}$** · **Cu + conc. $\\ce{HNO3}$ → $\\ce{NO2}$**.\n' +
      '- **Zn + dilute $\\ce{HNO3}$ → $\\ce{N2O}$** · **Zn + conc. $\\ce{HNO3}$ → $\\ce{NO2}$**.\n\n' +
      'Also remember: **Cr and Al are passivated** (protective oxide film) by conc. $\\ce{HNO3}$, and **Au, Pt are not attacked** at all.'),

    h.heading('Brown Ring Test', 'Explain the brown ring test for nitrates and write the reactions involved.'),
    h.text(
      'The familiar **brown ring test for nitrates** depends on the ability of $\\ce{Fe^{2+}}$ to reduce nitrates to nitric oxide, which reacts with $\\ce{Fe^{2+}}$ to form a brown coloured complex. The test is usually carried out by adding dilute ferrous sulphate solution to an aqueous solution containing nitrate ion, and then carefully adding concentrated sulphuric acid along the sides of the test tube. A **brown ring at the interface** between the solution and the sulphuric acid layers indicates the presence of nitrate ion in solution.\n\n' +
      '$$\\ce{NO3^{-} + 3Fe^{2+} + 4H+ -> NO + 3Fe^{3+} + 2H2O}$$\n' +
      '$$\\ce{[Fe(H2O)6]^{2+} + NO -> [Fe(H2O)5(NO)]^{2+} + H2O}\\ \\text{(brown)}$$'
    ),

    h.heading('Uses', 'List the major uses of nitric acid.'),
    h.text(
      'The major use of nitric acid is in the **manufacture of ammonium nitrate** for fertilisers and other nitrates for use in explosives and pyrotechnics. It is also used for the preparation of nitroglycerin, trinitrotoluene and other organic nitro compounds. Other major uses are in the **pickling of stainless steel**, etching of metals and as an oxidiser in rocket fuels.'
    ),

    h.recap([
      { label: 'Made by', text: 'Lab: $\\ce{NaNO3 + H2SO4 -> NaHSO4 + HNO3}$. Industry: **Ostwald’s process** $\\ce{NH3 -> NO -> NO2 -> HNO3}$ over Pt/Rh gauze.' },
      { label: 'As an acid', text: 'Strong acid: $\\ce{HNO3 + H2O -> H3O+ + NO3^-}$.' },
      { label: 'As an oxidiser', text: 'Cu: dil → $\\ce{NO}$, conc → $\\ce{NO2}$. Zn: dil → $\\ce{N2O}$, conc → $\\ce{NO2}$. Cr/Al **passivated**; Au/Pt untouched. Oxidises $\\ce{I2}$, C, $\\ce{S8}$, $\\ce{P4}$.' },
      { label: 'Brown ring test', text: 'Nitrate test: brown ring of $\\ce{[Fe(H2O)5(NO)]^{2+}}$ at the interface with conc. $\\ce{H2SO4}$.' },
      { label: 'Uses', text: 'Ammonium nitrate / explosives, nitroglycerin & TNT, pickling stainless steel, rocket-fuel oxidiser.' },
    ]),

    h.quiz([
      {
        question: 'In Ostwald’s process, the first step is the catalytic oxidation of ammonia over a Pt/Rh gauze to give:',
        options: ['NO₂ and water', 'NO and water', 'N₂ and water', 'N₂O and water'],
        correct_index: 1,
        explanation: 'Step 1 is $\\ce{4NH3 + 5O2 ->[Pt/Rh] 4NO + 6H2O}$; the $\\ce{NO}$ is then oxidised to $\\ce{NO2}$ and absorbed in water to give $\\ce{HNO3}$.',
      },
      {
        question: 'Copper reacts with dilute nitric acid to give which nitrogen-containing product?',
        options: ['NO₂', 'NO', 'N₂O', 'NH₃'],
        correct_index: 1,
        explanation: '$\\ce{3Cu + 8HNO3(dilute) -> 3Cu(NO3)2 + 2NO + 4H2O}$. With concentrated acid, copper gives $\\ce{NO2}$ instead.',
      },
      {
        question: 'Chromium and aluminium do not dissolve in concentrated nitric acid because:',
        options: [
          'they are noble metals',
          'a passive film of oxide forms on the surface',
          'they react only with dilute acid',
          'they form soluble nitrates instantly',
        ],
        correct_index: 1,
        explanation: 'Conc. $\\ce{HNO3}$ forms a protective passive oxide film on Cr and Al, so they stop reacting (passivation).',
      },
      {
        question: 'In the brown ring test for nitrate, the brown ring is due to the complex:',
        options: [
          '[Fe(H₂O)₆]²⁺',
          'Fe₂O₃·xH₂O',
          '[Fe(H₂O)₅(NO)]²⁺',
          '[Cu(NH₃)₄]²⁺',
        ],
        correct_index: 2,
        explanation: '$\\ce{Fe^{2+}}$ reduces nitrate to $\\ce{NO}$, which then forms the brown complex $\\ce{[Fe(H2O)5(NO)]^{2+}}$ at the interface.',
      },
      {
        question: 'Zinc reacts with concentrated nitric acid to give:',
        options: ['N₂O', 'NO', 'NO₂', 'NH₃'],
        correct_index: 2,
        explanation: 'Zn + conc. $\\ce{HNO3}$ → $\\ce{NO2}$ ($\\ce{Zn + 4HNO3(conc.) -> Zn(NO3)2 + 2H2O + 2NO2}$); with dilute acid Zn gives $\\ce{N2O}$.',
      },
      {
        question: 'Which metals are NOT attacked by concentrated nitric acid?',
        options: [
          'copper and zinc',
          'gold and platinum',
          'iron and chromium',
          'sodium and potassium',
        ],
        correct_index: 1,
        explanation: 'Concentrated $\\ce{HNO3}$ attacks most metals except the noble metals gold and platinum (Cr and Al are merely passivated).',
      },
    ], 0.6),
  ],
};
