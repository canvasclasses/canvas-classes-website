// Ch.4 (p-Block) · Page 5 · Ammonia (NCERT §7.3) — PILOT PAGE.
// NCERT content transcribed faithfully (same language/equations); enrichment
// from the founder's notes is confined to the "Exam Point" callouts. Ends with
// a Quick Recap + a textbook-based quiz. Hosts NCERT Example 7.4 + In-text
// Questions 7.4 & 7.5 at their section.
module.exports = {
  page_number: 5,
  chapter: 4,
  slug: 'ammonia',
  title: 'Ammonia',
  subtitle: 'Preparation by Haber’s process, the trigonal-pyramidal molecule, its basic character, and the metal-ion tests that make it an exam favourite.',
  tags: ['p-block', 'group-15', 'ammonia', 'nitrogen', 'habers-process'],
  reading_time_min: 6,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Central motif: a trigonal-pyramidal ammonia molecule (one nitrogen atom at the apex with a visible lone pair, three hydrogen atoms below) drawn like a chalk-and-coloured-pencil textbook sketch, beside a small industrial Haber-process tower with N2 + H2 arrows feeding in and NH3 coming out. Title feel: clean inorganic-chemistry plate. Landscape, desktop-friendly.',
      '16:9',
      'Ammonia — a simple molecule that feeds the world through fertilisers.'
    ),

    h.text(
      'Ammonia is present in small quantities in air and soil where it is formed by the decay of nitrogenous organic matter, e.g., urea.\n\n' +
      '$$\\ce{NH2CONH2 + 2H2O -> (NH4)2CO3 <=> 2NH3 + H2O + CO2}$$'
    ),

    h.heading('Preparation', 'Describe the laboratory and industrial (Haber) preparation of ammonia and the conditions that maximise its yield.'),
    h.text(
      'On a small scale ammonia is obtained from ammonium salts which decompose when treated with caustic soda or lime.\n\n' +
      '$$\\ce{2NH4Cl + Ca(OH)2 -> 2NH3 + 2H2O + CaCl2}$$\n' +
      '$$\\ce{(NH4)2SO4 + 2NaOH -> 2NH3 + 2H2O + Na2SO4}$$\n\n' +
      'On a large scale, ammonia is manufactured by **Haber’s process**.\n\n' +
      '$$\\ce{N2(g) + 3H2(g) <=> 2NH3(g)} \\qquad \\Delta_f H^\\ominus = -46.1\\ \\text{kJ mol}^{-1}$$\n\n' +
      'In accordance with Le Chatelier’s principle, high pressure would favour the formation of ammonia. The optimum conditions for the production of ammonia are a pressure of about $200 \\times 10^5$ Pa (about 200 atm), a temperature of ~700 K, and the use of a catalyst such as iron oxide with small amounts of $\\ce{K2O}$ and $\\ce{Al2O3}$ to increase the rate of attainment of equilibrium.'
    ),
    h.img(
      'A hand-drawn coloured flow-chart diagram on a deep charcoal (#121316) background, muted earthy palette, no glow. Haber process for ammonia: labelled boxes for "Compressor (20 MPa)", "Catalyst iron oxide Al2O3 + K2O at 700 K", a "Pump", with N2 and H2 entering, an unreacted N2 + H2 recycle loop, and liquid NH3 collected at the bottom. Textbook flow-chart style with arrows. Landscape.',
      '16:9',
      'Fig. 7.1 — Flow chart for the manufacture of ammonia.'
    ),
    h.callout('exam_tip', 'Exam Point — Conditions for maximum yield (Haber)',
      'Because the forward reaction is **exothermic** and goes from **4 gas moles → 2**, the yield is favoured by:\n\n' +
      '- **High pressure** (~200 atm) — fewer gas moles on the product side.\n' +
      '- **Low temperature** — but kept moderate (~700 K) so the rate is workable.\n' +
      '- **Catalyst:** iron oxide; **promoters** $\\ce{K2O}$ and $\\ce{Al2O3}$.\n' +
      '- Removing $\\ce{NH3}$ as it forms keeps shifting the equilibrium forward.'),

    h.worked('In-text Question 7.4', 'ncert_intext',
      'Mention the conditions required to maximise the yield of ammonia.',
      'Ammonia is manufactured by Haber’s process: $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$, $\\Delta_f H^\\ominus = -46.1\\ \\text{kJ mol}^{-1}$. Since the forward reaction is exothermic and proceeds with a decrease in the number of gaseous moles, the yield of ammonia is maximised by a **high pressure (~200 atm)**, a **low temperature** (in practice ~700 K, a compromise for a usable rate), and a **catalyst** (iron oxide with $\\ce{K2O}$ and $\\ce{Al2O3}$ as promoters). Continuous removal of ammonia further increases the yield.'),

    h.heading('Properties', 'Relate the structure of ammonia to its physical properties, its basic character, and its reactions as a base and a Lewis base.'),
    h.text(
      '**Physical properties**\n\n' +
      '- Colourless gas with a **pungent odour**.\n' +
      '- Freezing point **198.4 K**, boiling point **239.7 K**.\n' +
      '- In the solid and liquid states it is **associated through hydrogen bonds** (as in water) — this raises its melting and boiling points above the values expected from its molecular mass.\n' +
      '- The molecule is **trigonal pyramidal** with nitrogen at the apex: three bond pairs and **one lone pair** (H–N–H angle **107.8°**, N–H distance 101.7 pm).'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure sketch on a deep charcoal (#121316) background, muted earthy palette, no glow. A single trigonal-pyramidal ammonia (NH3) molecule: nitrogen at the apex showing one lone pair as a small lobe on top, three N–H bonds going down to three hydrogens, the H–N–H angle marked 107.8° and the N–H bond length marked 101.7 pm. Clean inorganic textbook diagram, large and centred.',
      '4:3',
      'The trigonal-pyramidal ammonia molecule (107.8°, lone pair at the apex).'
    ),
    h.text('**Chemical properties**'),
    h.text(
      '**Highly soluble in water; weakly basic.** The aqueous solution gives $\\ce{OH-}$ ions:\n\n' +
      '$$\\ce{NH3(g) + H2O(l) <=> NH4+(aq) + OH^{-}(aq)}$$'
    ),
    h.text(
      '**Forms ammonium salts** with acids — e.g. $\\ce{NH4Cl}$, $\\ce{(NH4)2SO4}$.'
    ),
    h.text(
      '**Precipitates metal hydroxides** (acting as a weak base):\n\n' +
      '$$\\ce{2FeCl3(aq) + 3NH4OH(aq) -> Fe2O3.xH2O(s) + 3NH4Cl(aq)}\\ \\text{(brown ppt.)}$$\n' +
      '$$\\ce{ZnSO4(aq) + 2NH4OH(aq) -> Zn(OH)2(s) + (NH4)2SO4(aq)}\\ \\text{(white ppt.)}$$'
    ),
    h.text(
      '**Acts as a Lewis base.** The lone pair on nitrogen lets it link with metal ions, forming complexes used to detect $\\ce{Cu^{2+}}$ and $\\ce{Ag+}$:\n\n' +
      '$$\\ce{Cu^{2+}(aq) + 4NH3(aq) <=> [Cu(NH3)4]^{2+}(aq)}\\ \\text{(deep blue)}$$\n' +
      '$$\\ce{Ag+(aq) + Cl^{-}(aq) -> AgCl(s)}\\ \\text{(white ppt.)}$$\n' +
      '$$\\ce{AgCl(s) + 2NH3(aq) -> [Ag(NH3)2]Cl(aq)}\\ \\text{(colourless)}$$'
    ),
    h.callout('exam_tip', 'Exam Point — Metal-ion tests (frequently asked)',
      'Ammonia’s reactions are a favourite for "identify the precipitate" questions:\n\n' +
      '- $\\ce{Fe^{3+}}$ → **brown** ppt of hydrated $\\ce{Fe2O3}$.\n' +
      '- $\\ce{Zn^{2+}}$ → **white** ppt of $\\ce{Zn(OH)2}$.\n' +
      '- $\\ce{Cu^{2+}}$ + excess $\\ce{NH3}$ → **deep blue** $\\ce{[Cu(NH3)4]^{2+}}$.\n' +
      '- $\\ce{AgCl}$ dissolves in $\\ce{NH3}$ to give colourless $\\ce{[Ag(NH3)2]Cl}$.'),

    h.worked('NCERT Example 7.4', 'solved_example',
      'Why does $\\ce{NH3}$ act as a Lewis base?',
      'Nitrogen atom in $\\ce{NH3}$ has one lone pair of electrons which is available for donation. Therefore, it acts as a Lewis base.'),
    h.worked('In-text Question 7.5', 'ncert_intext',
      'How does ammonia react with a solution of $\\ce{Cu^{2+}}$?',
      'Ammonia, being a Lewis base, donates its lone pair to the $\\ce{Cu^{2+}}$ ion and forms a deep-blue tetraamminecopper(II) complex:\n\n$$\\ce{Cu^{2+}(aq) + 4NH3(aq) <=> [Cu(NH3)4]^{2+}(aq)}\\ \\text{(deep blue)}$$'),

    h.heading('Uses'),
    h.text(
      'Ammonia is used to produce various nitrogenous fertilisers (ammonium nitrate, urea, ammonium phosphate and ammonium sulphate) and in the manufacture of some inorganic nitrogen compounds, the most important one being nitric acid. Liquid ammonia is also used as a refrigerant.'
    ),

    h.recap([
      { label: 'Made by', text: 'Haber’s process $\\ce{N2 + 3H2 <=> 2NH3}$ (exothermic) — high pressure, ~700 K, Fe catalyst with $\\ce{K2O}$/$\\ce{Al2O3}$ promoters.' },
      { label: 'Structure', text: 'Trigonal pyramidal, one lone pair, bond angle **107.8°**; H-bonded in solid/liquid (high m.p./b.p.).' },
      { label: 'As a base', text: 'Weakly basic in water ($\\ce{NH4+ + OH-}$); precipitates metal hydroxides.' },
      { label: 'Metal-ion tests', text: '$\\ce{Fe^{3+}}$ → **brown** ppt · $\\ce{Zn^{2+}}$ → **white** ppt · $\\ce{Cu^{2+}}$ → **deep-blue** $\\ce{[Cu(NH3)4]^{2+}}$.' },
      { label: 'Uses', text: 'Fertilisers, $\\ce{HNO3}$ manufacture, refrigerant.' },
    ]),

    h.quiz([
      {
        question: 'Which set of conditions gives the maximum yield of ammonia in Haber’s process?',
        options: [
          'High pressure, low (moderate) temperature, iron catalyst',
          'Low pressure, high temperature, iron catalyst',
          'High pressure, high temperature, no catalyst',
          'Low pressure, low temperature, platinum catalyst',
        ],
        correct_index: 0,
        explanation: 'The forward reaction is exothermic and decreases gas moles (4 → 2), so high pressure and a low/moderate temperature favour the yield; the iron catalyst (with $\\ce{K2O}$/$\\ce{Al2O3}$ promoters) speeds up equilibrium.',
      },
      {
        question: 'The ammonia molecule is trigonal pyramidal because the nitrogen atom has:',
        options: [
          'four bond pairs and no lone pair',
          'two bond pairs and two lone pairs',
          'three bond pairs and one lone pair',
          'three bond pairs and no lone pair',
        ],
        correct_index: 2,
        explanation: 'Nitrogen in $\\ce{NH3}$ has three N–H bond pairs and one lone pair; the lone pair pushes the bonds down to a pyramidal shape with an H–N–H angle of 107.8°.',
      },
      {
        question: 'When ammonia is added to an aqueous solution of $\\ce{Cu^{2+}}$ (in excess), the observation is:',
        options: [
          'a brown precipitate of $\\ce{Fe2O3}$',
          'a deep-blue solution of $\\ce{[Cu(NH3)4]^{2+}}$',
          'a white precipitate of $\\ce{Zn(OH)2}$',
          'a colourless solution of $\\ce{[Ag(NH3)2]+}$',
        ],
        correct_index: 1,
        explanation: 'Ammonia (a Lewis base) donates lone pairs to $\\ce{Cu^{2+}}$, forming the deep-blue tetraamminecopper(II) ion $\\ce{[Cu(NH3)4]^{2+}}$ — used to detect $\\ce{Cu^{2+}}$.',
      },
      {
        question: 'Ammonia has a higher boiling point than expected from its molecular mass mainly because:',
        options: [
          'it is a heavier-than-air gas',
          'it has a high molecular mass',
          'it forms covalent network solids',
          'its molecules are associated through hydrogen bonding',
        ],
        correct_index: 3,
        explanation: 'In the solid and liquid states $\\ce{NH3}$ is associated through hydrogen bonds (N is small and electronegative), raising its melting and boiling points above the value expected from its molecular mass.',
      },
      {
        question: 'Which precipitate forms when ammonium hydroxide is added to a solution of $\\ce{Fe^{3+}}$?',
        options: [
          'a brown precipitate of hydrated $\\ce{Fe2O3}$',
          'a white precipitate of $\\ce{Zn(OH)2}$',
          'a deep-blue precipitate',
          'no precipitate; a colourless solution forms',
        ],
        correct_index: 0,
        explanation: 'As a weak base, ammonia precipitates the hydroxide: $\\ce{2FeCl3 + 3NH4OH -> Fe2O3.xH2O (brown) + 3NH4Cl}$.',
      },
      {
        question: 'The single largest use of ammonia is in the manufacture of:',
        options: [
          'refrigerant gases only',
          'bleaching powder',
          'nitrogenous fertilisers',
          'glass and ceramics',
        ],
        correct_index: 2,
        explanation: 'Most ammonia goes into nitrogenous fertilisers (ammonium nitrate, urea, ammonium phosphate, ammonium sulphate); it is also used to make nitric acid and as a refrigerant.',
      },
    ], 0.6),
  ],
};
