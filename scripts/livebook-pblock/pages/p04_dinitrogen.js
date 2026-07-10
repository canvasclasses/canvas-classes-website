// Ch.4 (p-Block) · Page 4 · Dinitrogen (NCERT §7.2).
// Compound page: preparation (commercial fractional distillation + lab NH4Cl/
// NaNO2 + thermal decomposition of (NH4)2Cr2O7 and azides) → physical & chemical
// properties (inert N≡N, reactions with metals, H2 Haber, O2 at 2000 K) → uses.
// Hosts NCERT Example 7.3 + In-text Question 7.3. NCERT transcribed faithfully.
module.exports = {
  page_number: 4,
  chapter: 4,
  slug: 'dinitrogen',
  title: 'Dinitrogen',
  subtitle: 'How nitrogen gas is made, why its triple bond makes it so unreactive, and the few reactions it does undergo at high temperature.',
  tags: ['p-block', 'group-15', 'dinitrogen', 'nitrogen'],
  reading_time_min: 6,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Centre: a single dinitrogen molecule drawn as two nitrogen atoms joined by a bold triple bond (N≡N) with the label "N≡N, very high bond enthalpy 941.4 kJ/mol". To the side, a small fractional-distillation column of liquid air with "liquid N2, b.p. 77.2 K" tapped off above "liquid O2, b.p. 90 K". Textbook plate style, landscape, desktop-friendly.',
      '16:9',
      'Dinitrogen — 78% of the air we breathe, locked behind one of the strongest bonds in chemistry.'
    ),

    h.heading('Preparation', 'Describe the commercial and laboratory methods of preparing dinitrogen, including how impurities are removed.'),
    h.text(
      'Dinitrogen is produced commercially by the **liquefaction and fractional distillation of air**. Liquid dinitrogen (b.p. 77.2 K) distils out first, leaving behind liquid oxygen (b.p. 90 K).\n\n' +
      'In the laboratory, dinitrogen is prepared by treating an aqueous solution of ammonium chloride with sodium nitrite.\n\n' +
      '$$\\ce{NH4Cl(aq) + NaNO2(aq) -> N2(g) + 2H2O(l) + NaCl(aq)}$$\n\n' +
      'Small amounts of $\\ce{NO}$ and $\\ce{HNO3}$ are also formed in this reaction; these impurities can be removed by passing the gas through aqueous sulphuric acid containing potassium dichromate.'
    ),
    h.text(
      'It can also be obtained by the **thermal decomposition of ammonium dichromate**.\n\n' +
      '$$\\ce{(NH4)2Cr2O7 ->[\\Delta] N2 + 4H2O + Cr2O3}$$\n\n' +
      'Very pure nitrogen can be obtained by the **thermal decomposition of sodium or barium azide**.\n\n' +
      '$$\\ce{Ba(N3)2 -> Ba + 3N2}$$'
    ),

    h.heading('Properties', 'Relate the inertness of dinitrogen to its bond enthalpy and list its reactions with metals, hydrogen and oxygen.'),
    h.text(
      '**Physical properties**\n\n' +
      '- Colourless, odourless, tasteless and **non-toxic** gas.\n' +
      '- Has two stable isotopes: $\\ce{^{14}N}$ and $\\ce{^{15}N}$.\n' +
      '- **Very low solubility** in water ($23.2\\ \\text{cm}^3$ per litre of water at 273 K and 1 bar pressure) and low freezing and boiling points.'
    ),
    h.text('**Chemical properties**'),
    h.text(
      '**Rather inert at room temperature** because of the high bond enthalpy of the $\\ce{N#N}$ bond. Reactivity, however, increases rapidly with rise in temperature.'
    ),
    h.text(
      '**Combines with metals** at high temperatures to form predominantly ionic nitrides:\n\n' +
      '$$\\ce{6Li + N2 ->[\\Delta] 2Li3N}$$\n' +
      '$$\\ce{3Mg + N2 ->[\\Delta] Mg3N2}$$'
    ),
    h.text(
      '**Combines with hydrogen** at about 773 K in the presence of a catalyst (Haber’s Process) to form ammonia:\n\n' +
      '$$\\ce{N2(g) + 3H2(g) <=>[773\\ K] 2NH3(g)} \\qquad \\Delta_f H^\\ominus = -46.1\\ \\text{kJ mol}^{-1}$$'
    ),
    h.text(
      '**Combines with dioxygen** only at very high temperature (at about 2000 K) to form nitric oxide, $\\ce{NO}$:\n\n' +
      '$$\\ce{N2(g) + O2(g) <=>[\\Delta] 2NO(g)}$$'
    ),
    h.callout('exam_tip', 'Exam Point — why dinitrogen is so unreactive',
      'The entire chemistry of dinitrogen turns on **one number**: the $\\ce{N#N}$ triple-bond enthalpy of **941.4 kJ/mol** — among the highest of any diatomic. Breaking it costs so much energy that $\\ce{N2}$ stays inert at room temperature and reacts only when forced hot (metals at high $T$, Haber at 773 K, $\\ce{O2}$ at ~2000 K). This is exactly why $\\ce{N2}$ is used as an **inert atmosphere**.'),

    h.worked('NCERT Example 7.3', 'solved_example',
      'Write the reaction of thermal decomposition of sodium azide.',
      'Thermal decomposition of sodium azide gives dinitrogen gas:\n\n$$\\ce{2NaN3 -> 2Na + 3N2}$$'),

    h.worked('In-text Question 7.3', 'ncert_intext',
      'Why is $\\ce{N2}$ less reactive at room temperature?',
      'In dinitrogen the two nitrogen atoms are held by a **triple bond** ($\\ce{N#N}$) whose bond dissociation enthalpy is very high ($941.4\\ \\text{kJ mol}^{-1}$). So much energy is needed to break this bond that $\\ce{N2}$ does not react readily at room temperature; its reactivity rises only as the temperature is raised.'),

    h.heading('Uses', 'List the main uses of dinitrogen.'),
    h.text(
      'The main use of dinitrogen is in the **manufacture of ammonia** and other industrial chemicals containing nitrogen (e.g., calcium cyanamide). It also finds use **where an inert atmosphere is required** (e.g., in iron and steel industry, and as an inert diluent for reactive chemicals). **Liquid dinitrogen** is used as a refrigerant to preserve biological materials, food items and in cryosurgery.'
    ),

    h.recap([
      { label: 'Made by', text: 'Commercially: **fractional distillation of liquid air** ($\\ce{N2}$ b.p. 77.2 K out first). Lab: $\\ce{NH4Cl + NaNO2 -> N2 + 2H2O + NaCl}$. Pure $\\ce{N2}$: heat azides — $\\ce{Ba(N3)2 -> Ba + 3N2}$.' },
      { label: 'Why inert', text: 'The $\\ce{N#N}$ bond enthalpy is very high (941.4 kJ/mol) — so $\\ce{N2}$ is unreactive at room temperature.' },
      { label: 'Reactions', text: 'With metals → ionic nitrides ($\\ce{Li3N}$, $\\ce{Mg3N2}$); with $\\ce{H2}$ → $\\ce{NH3}$ (Haber, 773 K); with $\\ce{O2}$ → $\\ce{NO}$ (only at ~2000 K).' },
      { label: 'Uses', text: '$\\ce{NH3}$ manufacture, inert atmosphere (steel industry), and **liquid $\\ce{N2}$** as a refrigerant/cryogen.' },
    ]),

    h.quiz([
      {
        question: 'In the fractional distillation of liquid air, dinitrogen distils out first because:',
        options: [
          'it has a higher boiling point than oxygen',
          'it has a lower boiling point (77.2 K) than oxygen (90 K)',
          'it is denser than oxygen',
          'it dissolves in liquid oxygen',
        ],
        correct_index: 1,
        explanation: 'Liquid $\\ce{N2}$ boils at 77.2 K and liquid $\\ce{O2}$ at 90 K; the lower-boiling nitrogen evaporates off first.',
      },
      {
        question: 'The very low reactivity of dinitrogen at room temperature is due to:',
        options: [
          'its low molecular mass',
          'the high bond enthalpy of the N≡N triple bond',
          'the presence of d orbitals',
          'its diamagnetic character',
        ],
        correct_index: 1,
        explanation: 'The $\\ce{N#N}$ bond enthalpy (941.4 kJ/mol) is very high, so dinitrogen is rather inert at room temperature and reacts only on strong heating.',
      },
      {
        question: 'Which reagents are used to prepare dinitrogen in the laboratory?',
        options: [
          'ammonium chloride and sodium nitrite',
          'sodium nitrate and sulphuric acid',
          'ammonia and oxygen',
          'calcium and nitrogen',
        ],
        correct_index: 0,
        explanation: 'In the lab, $\\ce{NH4Cl(aq) + NaNO2(aq) -> N2(g) + 2H2O(l) + NaCl(aq)}$; the $\\ce{NO}$/$\\ce{HNO3}$ impurities are removed with acidified $\\ce{K2Cr2O7}$.',
      },
      {
        question: 'Very pure dinitrogen is obtained by the thermal decomposition of:',
        options: [
          'ammonium chloride',
          'sodium nitrate',
          'sodium or barium azide',
          'ammonia',
        ],
        correct_index: 2,
        explanation: 'Heating an azide gives pure nitrogen, e.g. $\\ce{Ba(N3)2 -> Ba + 3N2}$ (and $\\ce{2NaN3 -> 2Na + 3N2}$).',
      },
      {
        question: 'Dinitrogen combines with dioxygen to form nitric oxide only:',
        options: [
          'at room temperature',
          'in the presence of an iron catalyst',
          'at very high temperature (about 2000 K)',
          'on dissolving in water',
        ],
        correct_index: 2,
        explanation: '$\\ce{N2(g) + O2(g) <=> 2NO(g)}$ proceeds only at about 2000 K, because of the strong $\\ce{N#N}$ bond.',
      },
      {
        question: 'Liquid dinitrogen is most commonly used as a:',
        options: [
          'fuel',
          'refrigerant / cryogen',
          'bleaching agent',
          'oxidising agent',
        ],
        correct_index: 1,
        explanation: 'Liquid $\\ce{N2}$ is used as a refrigerant to preserve biological materials and food, and in cryosurgery; gaseous $\\ce{N2}$ provides an inert atmosphere.',
      },
    ], 0.6),
  ],
};
