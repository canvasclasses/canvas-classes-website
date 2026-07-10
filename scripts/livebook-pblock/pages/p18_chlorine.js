// Ch.4 (p-Block) · Page 18 · Chlorine (NCERT §7.19).
// Compound page: preparation (MnO2/HCl, KMnO4), manufacture (Deacon's process,
// electrolytic), properties (reactions with metals/non-metals/H-compounds/NH3/
// alkalis, bleaching powder, oxidising & bleaching action), uses. NCERT content
// transcribed faithfully; notes-enrichment confined to "Exam Point" callouts.
// Hosts NCERT Example 7.17 + In-text Questions 7.29 & 7.30.
module.exports = {
  page_number: 18,
  chapter: 4,
  slug: 'chlorine',
  title: 'Chlorine',
  subtitle: 'The greenish-yellow gas — how it is made, why it bleaches, the cold-vs-hot alkali disproportionation, and bleaching powder.',
  tags: ['p-block', 'group-17', 'chlorine', 'bleaching-powder', 'halogens'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A round-bottom flask of greenish-yellow chlorine gas being collected by downward delivery (it is heavier than air), with a small inset of black manganese dioxide reacting with concentrated hydrochloric acid. Beside it, a bleached-white strip of cloth next to a coloured strip, hinting at chlorine\'s bleaching action. Clean inorganic textbook plate, landscape, desktop-friendly.',
      '16:9',
      'Chlorine — a greenish-yellow, pungent, 2.5× heavier-than-air gas that bleaches and disinfects.'
    ),

    h.text(
      'Chlorine was discovered in 1774 by Scheele by the action of $\\ce{HCl}$ on $\\ce{MnO2}$. In 1810 Davy established its elementary nature and suggested the name chlorine on account of its colour (Greek, *chloros* = greenish yellow).'
    ),

    h.heading('Preparation', 'Write the laboratory methods of preparing chlorine and the industrial manufacturing routes.'),
    h.text(
      'It can be prepared by any one of the following methods.\n\n' +
      '**(i) By heating manganese dioxide with concentrated hydrochloric acid.**\n\n' +
      '$$\\ce{MnO2 + 4HCl -> MnCl2 + Cl2 + 2H2O}$$\n\n' +
      'However, a mixture of common salt and concentrated $\\ce{H2SO4}$ is used in place of $\\ce{HCl}$.\n\n' +
      '$$\\ce{4NaCl + MnO2 + 4H2SO4 -> MnCl2 + 4NaHSO4 + 2H2O + Cl2}$$\n\n' +
      '**(ii) By the action of $\\ce{HCl}$ on potassium permanganate.**\n\n' +
      '$$\\ce{2KMnO4 + 16HCl -> 2KCl + 2MnCl2 + 8H2O + 5Cl2}$$'
    ),
    h.text(
      '**Manufacture of chlorine**\n\n' +
      '**(i) Deacon\'s process.** By oxidation of hydrogen chloride gas by atmospheric oxygen in the presence of $\\ce{CuCl2}$ (catalyst) at 723 K.\n\n' +
      '$$\\ce{4HCl + O2 ->[\\ce{CuCl2}] 2Cl2 + 2H2O}$$\n\n' +
      '**(ii) Electrolytic process.** Chlorine is obtained by the electrolysis of brine (concentrated $\\ce{NaCl}$ solution). Chlorine is liberated at the anode. It is also obtained as a by-product in many chemical industries.'
    ),

    h.heading('Properties', 'Describe the physical properties of chlorine and its reactions with metals, non-metals, hydrogen compounds, ammonia and alkalis.'),
    h.text(
      '**Physical properties**\n\n' +
      '- It is a **greenish yellow gas** with a **pungent and suffocating odour**.\n' +
      '- It is about **2.5 times heavier than air**.\n' +
      '- It can be **liquefied easily** into a greenish yellow liquid which **boils at 239 K**.\n' +
      '- It is **soluble in water**.'
    ),
    h.text('**Chemical properties**'),
    h.text(
      '**Reacts with metals and non-metals** to form chlorides.\n\n' +
      '$$\\ce{2Al + 3Cl2 -> 2AlCl3}$$\n' +
      '$$\\ce{2Na + Cl2 -> 2NaCl}$$\n' +
      '$$\\ce{2Fe + 3Cl2 -> 2FeCl3}$$\n' +
      '$$\\ce{P4 + 6Cl2 -> 4PCl3}$$\n' +
      '$$\\ce{S8 + 4Cl2 -> 4S2Cl2}$$'
    ),
    h.text(
      '**Great affinity for hydrogen.** It reacts with compounds containing hydrogen to form $\\ce{HCl}$.\n\n' +
      '$$\\ce{H2 + Cl2 -> 2HCl}$$\n' +
      '$$\\ce{H2S + Cl2 -> 2HCl + S}$$\n' +
      '$$\\ce{C10H16 + 8Cl2 -> 16HCl + 10C}$$'
    ),
    h.text(
      '**Reacts with ammonia.** With **excess ammonia**, chlorine gives nitrogen and ammonium chloride, whereas with **excess chlorine**, nitrogen trichloride (explosive) is formed.\n\n' +
      '$$\\ce{8NH3 + 3Cl2 -> 6NH4Cl + N2} \\quad (\\text{NH}_3\\ \\text{excess})$$\n' +
      '$$\\ce{NH3 + 3Cl2 -> NCl3 + 3HCl} \\quad (\\text{Cl}_2\\ \\text{excess})$$'
    ),
    h.text(
      '**Reacts with alkalis.** With **cold and dilute** alkalis chlorine produces a mixture of chloride and hypochlorite, but with **hot and concentrated** alkalis it gives chloride and chlorate.\n\n' +
      '$$\\ce{2NaOH + Cl2 -> NaCl + NaOCl + H2O} \\quad (\\text{cold and dilute})$$\n' +
      '$$\\ce{6NaOH + 3Cl2 -> 5NaCl + NaClO3 + 3H2O} \\quad (\\text{hot and conc.})$$'
    ),
    h.callout('exam_tip', 'Exam Point — cold-vs-hot alkali (disproportionation pair)',
      'Both reactions are **disproportionations** — chlorine (oxidation state 0) goes to both a lower and a higher state at once:\n\n' +
      '- **Cold, dilute NaOH:** $\\ce{Cl2}$ → $\\ce{Cl^-}$ (−1) + $\\ce{OCl^-}$ (+1).\n' +
      '- **Hot, conc. NaOH:** $\\ce{Cl2}$ → $\\ce{Cl^-}$ (−1) + $\\ce{ClO3^-}$ (+5).\n\n' +
      'Same reagents, different temperature → different product. A favourite "spot the disproportionation" question.'),
    h.text(
      '**Reacts with dry slaked lime to give bleaching powder.**\n\n' +
      '$$\\ce{2Ca(OH)2 + 2Cl2 -> Ca(OCl)2 + CaCl2 + 2H2O}$$\n\n' +
      'The composition of bleaching powder is $\\ce{Ca(OCl)2.CaCl2.Ca(OH)2.2H2O}$.'
    ),
    h.text(
      '**Reacts with hydrocarbons** — gives **substitution** products with saturated hydrocarbons and **addition** products with unsaturated hydrocarbons.\n\n' +
      '$$\\ce{CH4 + Cl2 ->[\\text{UV}] CH3Cl + HCl}$$\n' +
      '$$\\ce{C2H4 + Cl2 ->[\\text{room temp.}] C2H4Cl2}$$'
    ),
    h.text(
      '**Oxidising and bleaching action.** Chlorine water on standing loses its yellow colour due to the formation of $\\ce{HCl}$ and $\\ce{HOCl}$. Hypochlorous acid ($\\ce{HOCl}$) so formed gives **nascent oxygen** which is responsible for oxidising and bleaching properties of chlorine.\n\n' +
      '**(i) It oxidises** ferrous to ferric, sulphite to sulphate, sulphur dioxide to sulphuric acid and iodine to iodic acid.\n\n' +
      '$$\\ce{2FeSO4 + H2SO4 + Cl2 -> Fe2(SO4)3 + 2HCl}$$\n' +
      '$$\\ce{Na2SO3 + Cl2 + H2O -> Na2SO4 + 2HCl}$$\n' +
      '$$\\ce{SO2 + 2H2O + Cl2 -> H2SO4 + 2HCl}$$\n' +
      '$$\\ce{I2 + 6H2O + 5Cl2 -> 2HIO3 + 10HCl}$$\n\n' +
      '**(ii) It is a powerful bleaching agent**; bleaching action is due to oxidation.\n\n' +
      '$$\\ce{Cl2 + H2O -> 2HCl + O}$$\n' +
      '$$\\text{Coloured substance} + \\ce{O} \\rightarrow \\text{Colourless substance}$$\n\n' +
      'It bleaches vegetable or organic matter in the presence of moisture. **Bleaching effect of chlorine is permanent.**'
    ),

    h.worked('NCERT Example 7.17', 'solved_example',
      'Write the balanced chemical equation for the reaction of $\\ce{Cl2}$ with hot and concentrated $\\ce{NaOH}$. Is this reaction a disproportionation reaction? Justify.',
      '$$\\ce{3Cl2 + 6NaOH -> 5NaCl + NaClO3 + 3H2O}$$\nYes, chlorine from zero oxidation state is changed to −1 and +5 oxidation states.'),
    h.worked('In-text Question 7.29', 'ncert_intext',
      'Give the reason for bleaching action of $\\ce{Cl2}$.',
      'Chlorine reacts with water to give nascent oxygen: $\\ce{Cl2 + H2O -> 2HCl + O}$. This **nascent oxygen [O]** oxidises the coloured substance to a colourless one (Coloured substance + O → Colourless substance). Because the colour is removed by oxidation, the bleaching action of chlorine is **permanent** and works only in the presence of moisture.'),
    h.worked('In-text Question 7.30', 'ncert_intext',
      'Name two poisonous gases which can be prepared from chlorine gas.',
      'Two poisonous gases prepared from chlorine are **phosgene ($\\ce{COCl2}$)** and **mustard gas ($\\ce{ClCH2CH2SCH2CH2Cl}$)**. (Tear gas, $\\ce{CCl3NO2}$, is another example.)'),

    h.heading('Uses'),
    h.text(
      'Chlorine is used (i) for bleaching woodpulp (required for the manufacture of paper and rayon), bleaching cotton and textiles, (ii) in the extraction of gold and platinum, (iii) in the manufacture of dyes, drugs and organic compounds such as $\\ce{CCl4}$, $\\ce{CHCl3}$, DDT, refrigerants, etc., (iv) in sterilising drinking water and (v) preparation of poisonous gases such as phosgene ($\\ce{COCl2}$), tear gas ($\\ce{CCl3NO2}$) and mustard gas ($\\ce{ClCH2CH2SCH2CH2Cl}$).'
    ),

    h.recap([
      { label: 'Made by', text: 'lab: $\\ce{MnO2 + 4HCl -> MnCl2 + Cl2 + 2H2O}$ or with $\\ce{KMnO4}$. Industry: **Deacon\'s process** ($\\ce{4HCl + O2 ->[\\ce{CuCl2}] 2Cl2 + 2H2O}$, 723 K) and **electrolysis of brine** (anode).' },
      { label: 'Physical', text: 'greenish-yellow, pungent gas; ~2.5× heavier than air; liquefies at 239 K; water-soluble.' },
      { label: 'With alkali', text: '**cold dil.** → $\\ce{NaCl + NaOCl}$ (−1, +1); **hot conc.** → $\\ce{NaCl + NaClO3}$ (−1, +5). Both are disproportionations.' },
      { label: 'With ammonia', text: 'excess $\\ce{NH3}$ → $\\ce{N2 + NH4Cl}$; excess $\\ce{Cl2}$ → explosive $\\ce{NCl3}$.' },
      { label: 'Bleaching powder', text: '$\\ce{2Ca(OH)2 + 2Cl2 -> Ca(OCl)2 + CaCl2 + 2H2O}$; composition $\\ce{Ca(OCl)2.CaCl2.Ca(OH)2.2H2O}$.' },
      { label: 'Bleaching', text: 'oxidising — nascent oxygen from $\\ce{HOCl}$ removes colour; effect is **permanent**, needs moisture.' },
    ]),

    h.quiz([
      {
        question: 'When chlorine reacts with hot and concentrated NaOH, the products are:',
        options: [
          'NaCl and NaOCl',
          'NaCl and NaClO3',
          'NaClO and NaClO3',
          'only NaCl',
        ],
        correct_index: 1,
        explanation: 'With hot, concentrated alkali chlorine disproportionates to chloride (−1) and chlorate (+5): $\\ce{6NaOH + 3Cl2 -> 5NaCl + NaClO3 + 3H2O}$. (Cold, dilute alkali gives chloride + hypochlorite instead.)',
      },
      {
        question: 'The composition of bleaching powder is:',
        options: [
          '$\\ce{CaCl2}$',
          '$\\ce{Ca(OCl)2}$',
          '$\\ce{Ca(OCl)2.CaCl2.Ca(OH)2.2H2O}$',
          '$\\ce{CaOCl2}$ only',
        ],
        correct_index: 2,
        explanation: 'Bleaching powder is made by passing chlorine over dry slaked lime; its full composition is $\\ce{Ca(OCl)2.CaCl2.Ca(OH)2.2H2O}$.',
      },
      {
        question: 'The bleaching action of chlorine is due to:',
        options: [
          'reduction',
          'oxidation by nascent oxygen from $\\ce{HOCl}$',
          'hydrogen bonding',
          'precipitation',
        ],
        correct_index: 1,
        explanation: 'Chlorine + water gives $\\ce{HCl}$ and $\\ce{HOCl}$; the hypochlorous acid releases nascent oxygen [O] that oxidises the coloured matter. The bleaching is therefore permanent and needs moisture.',
      },
      {
        question: 'In Deacon\'s process for the manufacture of chlorine, the catalyst used is:',
        options: [
          '$\\ce{MnO2}$',
          '$\\ce{V2O5}$',
          '$\\ce{CuCl2}$',
          '$\\ce{Fe2O3}$',
        ],
        correct_index: 2,
        explanation: 'Deacon\'s process oxidises $\\ce{HCl}$ with atmospheric oxygen over a $\\ce{CuCl2}$ catalyst at 723 K: $\\ce{4HCl + O2 -> 2Cl2 + 2H2O}$.',
      },
      {
        question: 'When chlorine reacts with an excess of ammonia, the products are:',
        options: [
          'nitrogen and ammonium chloride',
          'nitrogen trichloride and HCl',
          'nitric acid and water',
          'ammonia and hydrogen',
        ],
        correct_index: 0,
        explanation: 'With excess ammonia: $\\ce{8NH3 + 3Cl2 -> 6NH4Cl + N2}$. (With excess chlorine, the explosive nitrogen trichloride $\\ce{NCl3}$ forms instead.)',
      },
      {
        question: 'Which physical property of chlorine is correct?',
        options: [
          'colourless gas, lighter than air',
          'greenish-yellow gas, about 2.5 times heavier than air, boils at 239 K',
          'red liquid, soluble in CCl4 only',
          'violet solid that sublimes',
        ],
        correct_index: 1,
        explanation: 'Chlorine is a greenish-yellow, pungent gas about 2.5 times heavier than air; it liquefies to a greenish-yellow liquid boiling at 239 K and is soluble in water.',
      },
    ], 0.6),
  ],
};
