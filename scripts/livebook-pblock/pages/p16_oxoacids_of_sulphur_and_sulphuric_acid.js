// Ch.4 (p-Block) · Page 16 · Oxoacids of Sulphur & Sulphuric Acid
// (NCERT §7.16 + §7.17). Hero img → oxoacids list + structures (Fig 7.6 img)
// → sulphuric acid manufacture (Contact process, Fig 7.7 img) → properties
// (bullets + bold-labeled reactions: ionisation, dehydrating, oxidising) →
// uses. NCERT transcribed faithfully; notes-enrichment in `exam_tip`.
// Hosts In-text Questions 7.23, 7.24, 7.25.
module.exports = {
  page_number: 16,
  chapter: 4,
  slug: 'oxoacids-of-sulphur-and-sulphuric-acid',
  title: 'Oxoacids of Sulphur & Sulphuric Acid',
  subtitle: 'The family of sulphur oxoacids and their structures — then the Contact process that makes sulphuric acid, and its three personalities: a strong acid, a dehydrating agent, and an oxidising agent.',
  tags: ['p-block', 'group-16', 'sulphuric-acid', 'oxoacids', 'contact-process'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Central motif: a tetrahedral sulphuric acid (H₂SO₄) molecule drawn as a chalk-and-coloured-pencil textbook sketch (a central S with two double-bonded O and two O–H), beside a small industrial Contact-process tower with SO₂ and O₂ arrows feeding in over a V₂O₅ catalyst bed. Clean inorganic plate, landscape, desktop-friendly.',
      '16:9',
      'Sulphuric acid — "the king of chemicals" — made by the Contact process.'
    ),

    h.heading('Oxoacids of Sulphur', 'List the important oxoacids of sulphur and describe their structures.'),
    h.text(
      'Sulphur forms a number of oxoacids such as $\\ce{H2SO3}$, $\\ce{H2SO4}$, $\\ce{H2S2O4}$, $\\ce{H2S2O5}$, $\\ce{H2S_{x}O6}$ (x = 2 to 5), $\\ce{H2SO5}$, $\\ce{H2S2O8}$. Some of these acids are unstable and cannot be isolated. They are known in aqueous solution or in the form of their salts. Structures of some important oxoacids are shown in Fig. 7.6.'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure plate on a deep charcoal (#121316) background, muted earthy palette, no glow. Four sulphur oxoacid structures in a row, each drawn as a chalk-and-coloured-pencil ball-and-stick sketch with atoms labelled: (1) Sulphurous acid H₂SO₃ — S with one lone pair, one S=O, two S–OH; (2) Sulphuric acid H₂SO₄ — tetrahedral S with two S=O and two S–OH; (3) Peroxodisulphuric acid H₂S₂O₈ — two SO₃(OH) units bridged by a peroxide O–O linkage; (4) Pyrosulphuric acid (oleum) H₂S₂O₇ — two SO₃(OH) units bridged by a single S–O–S oxygen. Clean inorganic textbook diagram, each labelled with name and formula.',
      '16:9',
      'Fig. 7.6 — Structures of some important oxoacids of sulphur.'
    ),
    h.callout('exam_tip', 'Exam Point — spot the bridge: peroxo vs pyro',
      'Two look-alike disulphur oxoacids are favourite traps:\n\n' +
      '- **Peroxodisulphuric acid $\\ce{H2S2O8}$** has a **peroxide O–O linkage** (–O–O–) bridging the two sulphurs.\n' +
      '- **Pyrosulphuric acid / oleum $\\ce{H2S2O7}$** has a **single S–O–S oxygen bridge** (no O–O).\n\n' +
      'In oxoacids, sulphur is **tetrahedrally surrounded**; each contains at least one S=O and (in the acids) S–OH bonds.'),

    h.heading('Sulphuric Acid — Manufacture', 'Describe the Contact process for manufacturing sulphuric acid and the conditions for maximum yield.'),
    h.text(
      'Sulphuric acid is one of the most important industrial chemicals worldwide. Sulphuric acid is manufactured by the **Contact Process** which involves three steps:\n\n' +
      '**(i)** burning of sulphur or sulphide ores in air to generate $\\ce{SO2}$.\n\n' +
      '**(ii)** conversion of $\\ce{SO2}$ to $\\ce{SO3}$ by the reaction with oxygen in the presence of a catalyst ($\\ce{V2O5}$), and\n\n' +
      '**(iii)** absorption of $\\ce{SO3}$ in $\\ce{H2SO4}$ to give Oleum ($\\ce{H2S2O7}$).\n\n' +
      'The $\\ce{SO2}$ produced is purified by removing dust and other impurities such as arsenic compounds. The key step in the manufacture of $\\ce{H2SO4}$ is the **catalytic oxidation of $\\ce{SO2}$ with $\\ce{O2}$ to give $\\ce{SO3}$** in the presence of $\\ce{V2O5}$ (catalyst).\n\n' +
      '$$\\ce{2SO2(g) + O2(g) ->[\\ce{V2O5}] 2SO3(g)} \\qquad \\Delta_r H^\\ominus = -196.6\\ \\text{kJ mol}^{-1}$$\n\n' +
      'The reaction is **exothermic, reversible and the forward reaction leads to a decrease in volume**. Therefore, **low temperature and high pressure** are the favourable conditions for maximum yield. But the temperature should not be very low otherwise rate of reaction will become slow.\n\n' +
      'In practice, the plant is operated at a pressure of **2 bar** and a temperature of **720 K**. The $\\ce{SO3}$ gas from the catalytic converter is absorbed in concentrated $\\ce{H2SO4}$ to produce oleum. Dilution of oleum with water gives $\\ce{H2SO4}$ of the desired concentration.\n\n' +
      '$$\\ce{SO3 + H2SO4 -> H2S2O7} \\quad \\text{(Oleum)}$$\n\n' +
      'The sulphuric acid obtained by Contact process is **96–98% pure**.'
    ),
    h.img(
      'A hand-drawn coloured flow-chart diagram on a deep charcoal (#121316) background, muted earthy palette, no glow. The Contact process for sulphuric acid: labelled boxes from left to right — "Sulphur burner" (sulphur + air in, impure SO₂+O₂ out), "Dust precipitator", "Washing & cooling tower" (water spray), "Drying tower" (conc. H₂SO₄ spray, dry SO₂+O₂ out), "Arsenic purifier (gelatinous hydrated ferric oxide)", "Preheater", "Catalytic converter (V₂O₅)" producing SO₃, and an absorption tower packed with quartz where conc. H₂SO₄ absorbs SO₃ to give Oleum (H₂S₂O₇). Textbook flow-chart style with arrows. Landscape.',
      '16:9',
      'Fig. 7.7 — Flow diagram for the manufacture of sulphuric acid.'
    ),

    h.heading('Sulphuric Acid — Properties', 'Relate the structure and high oxidation state of sulphuric acid to its strong acidic, dehydrating and oxidising behaviour.'),
    h.text(
      '**Physical properties**\n\n' +
      '- Colourless, dense, oily liquid with a specific gravity of **1.84 at 298 K**.\n' +
      '- The acid freezes at **283 K** and boils at **611 K**.\n' +
      '- It dissolves in water with the evolution of a large quantity of heat. Hence, care must be taken while preparing sulphuric acid solution from concentrated sulphuric acid — the concentrated acid must be added **slowly into water with constant stirring**.'
    ),
    h.text(
      'The chemical reactions of sulphuric acid are as a result of the following characteristics: **(a) low volatility (b) strong acidic character (c) strong affinity for water and (d) ability to act as an oxidising agent.**'
    ),
    h.text('**Chemical properties**'),
    h.text(
      '**Strong acid — ionises in two steps.** In aqueous solution, sulphuric acid ionises in two steps:\n\n' +
      '$$\\ce{H2SO4(aq) + H2O(l) -> H3O+(aq) + HSO4^{-}(aq)}; \\quad K_{a_1} = \\text{very large}\\ (K_{a_1} > 10)$$\n' +
      '$$\\ce{HSO4^{-}(aq) + H2O(l) -> H3O+(aq) + SO4^{2-}(aq)}; \\quad K_{a_2} = 1.2 \\times 10^{-2}$$\n\n' +
      'The larger value of $K_{a_1}$ ($K_{a_1} > 10$) means that $\\ce{H2SO4}$ is largely dissociated into $\\ce{H+}$ and $\\ce{HSO4-}$. The acid forms two series of salts: **normal sulphates** (such as sodium sulphate and copper sulphate) and **acid sulphates** (e.g., sodium hydrogen sulphate).'
    ),
    h.text(
      '**Low volatility — displaces more volatile acids.** Sulphuric acid, because of its low volatility, can be used to manufacture more volatile acids from their corresponding salts.\n\n' +
      '$$\\ce{2MX + H2SO4 -> 2HX + M2SO4} \\quad (\\text{X = F, Cl, NO3; M = Metal})$$'
    ),
    h.text(
      '**Strong dehydrating agent.** Concentrated sulphuric acid is a strong dehydrating agent. Many wet gases can be dried by passing them through sulphuric acid, provided the gases do not react with the acid. Sulphuric acid removes water from organic compounds; it is evident by its charring action on carbohydrates.\n\n' +
      '$$\\ce{C12H22O11 ->[\\ce{H2SO4}] 12C + 11H2O}$$'
    ),
    h.text(
      '**Oxidising agent.** Hot concentrated sulphuric acid is a moderately strong oxidising agent. In this respect, it is intermediate between phosphoric and nitric acids. Both metals and non-metals are oxidised by concentrated sulphuric acid, which is reduced to $\\ce{SO2}$.\n\n' +
      '$$\\ce{Cu + 2H2SO4(conc.) -> CuSO4 + SO2 + 2H2O}$$\n' +
      '$$\\ce{3S + 2H2SO4(conc.) -> 3SO2 + 2H2O}$$\n' +
      '$$\\ce{C + 2H2SO4(conc.) -> CO2 + 2SO2 + 2H2O}$$'
    ),

    h.worked('In-text Question 7.23', 'ncert_intext',
      'Mention three areas in which $\\ce{H2SO4}$ plays an important role.',
      'Sulphuric acid is used in: **(i)** the manufacture of fertilisers (e.g. ammonium sulphate, superphosphate); **(ii)** petroleum refining; and **(iii)** the manufacture of pigments, paints and dyestuff intermediates. (Other areas: the detergent industry, metallurgical applications, storage batteries and as a laboratory reagent.)'),
    h.worked('In-text Question 7.24', 'ncert_intext',
      'Write the conditions to maximise the yield of $\\ce{H2SO4}$ by Contact process.',
      'The key step $\\ce{2SO2 + O2 <=> 2SO3}$ is exothermic and proceeds with a decrease in volume, so by Le Chatelier’s principle the yield is favoured by a **low temperature** and **high pressure**. The temperature must not be too low, however, or the rate becomes very slow; in practice the plant runs at about **720 K** and **2 bar**, with a $\\ce{V2O5}$ catalyst.'),
    h.worked('In-text Question 7.25', 'ncert_intext',
      'Why is $K_{a_2} \\ll K_{a_1}$ for $\\ce{H2SO4}$ in water?',
      'The first ionisation removes $\\ce{H+}$ from neutral $\\ce{H2SO4}$, which is easy ($K_{a_1}$ very large). The second ionisation must remove a positively-attracted $\\ce{H+}$ from the **negatively charged $\\ce{HSO4-}$** ion; this is far harder because of the electrostatic attraction between the proton and the anion. Hence the second dissociation is much weaker, so $K_{a_2} \\ll K_{a_1}$.'),

    h.heading('Uses'),
    h.text(
      'Sulphuric acid is a very important industrial chemical. A nation’s industrial strength can be judged by the quantity of sulphuric acid it produces and consumes. The bulk of sulphuric acid produced is used in the manufacture of fertilisers (e.g., ammonium sulphate, superphosphate). Other uses are in: (a) petroleum refining (b) manufacture of pigments, paints and dyestuff intermediates (c) detergent industry (d) metallurgical applications (e.g., cleansing metals before enameling, electroplating and galvanising) (e) storage batteries (f) the manufacture of nitrocellulose products and (g) as a laboratory reagent.'
    ),

    h.recap([
      { label: 'Oxoacids of S', text: '$\\ce{H2SO3}$, $\\ce{H2SO4}$, **peroxodisulphuric $\\ce{H2S2O8}$ (O–O bridge)**, **pyrosulphuric/oleum $\\ce{H2S2O7}$ (S–O–S bridge)**; S is tetrahedral, ≥1 S=O + S–OH.' },
      { label: 'Contact process', text: '(1) S → $\\ce{SO2}$; (2) $\\ce{2SO2 + O2 ->[\\ce{V2O5}] 2SO3}$ (exothermic, ΔH = −196.6 kJ mol⁻¹); (3) $\\ce{SO3}$ + $\\ce{H2SO4}$ → oleum. Best yield: **low T, high P**; run at ~720 K, 2 bar; 96–98% pure.' },
      { label: 'Acid strength', text: 'two-step ionisation; $K_{a_1}$ very large, $K_{a_2} = 1.2\\times10^{-2}$ ($\\ll K_{a_1}$ — removing $\\ce{H+}$ from $\\ce{HSO4-}$ is hard).' },
      { label: 'Three personalities', text: '**dehydrating** (chars sugar, $\\ce{C12H22O11 -> 12C + 11H2O}$); **oxidising** when hot/conc ($\\ce{Cu, S, C}$ → $\\ce{SO2}$); **low volatility** → displaces $\\ce{HCl}$, $\\ce{HF}$, $\\ce{HNO3}$ from salts.' },
    ]),

    h.quiz([
      {
        question: 'Which oxoacid of sulphur contains a peroxide (–O–O–) linkage?',
        options: [
          'Peroxodisulphuric acid, H₂S₂O₈',
          'Pyrosulphuric acid, H₂S₂O₇',
          'Sulphurous acid, H₂SO₃',
          'Sulphuric acid, H₂SO₄',
        ],
        correct_index: 0,
        explanation: 'Peroxodisulphuric acid $\\ce{H2S2O8}$ has a peroxide O–O bridge between the two sulphurs; oleum $\\ce{H2S2O7}$ has an S–O–S bridge instead.',
      },
      {
        question: 'The catalyst used in the key step of the Contact process is:',
        options: ['Fe with K₂O/Al₂O₃', 'Pt gauze', 'V₂O₅', 'MnO₂'],
        correct_index: 2,
        explanation: 'The catalytic oxidation $\\ce{2SO2 + O2 -> 2SO3}$ uses vanadium(V) oxide, $\\ce{V2O5}$.',
      },
      {
        question: 'The conditions favouring maximum yield of SO₃ in the Contact process are:',
        options: [
          'high temperature and low pressure',
          'low temperature and high pressure',
          'high temperature and high pressure',
          'low temperature and low pressure',
        ],
        correct_index: 1,
        explanation: 'The reaction is exothermic and decreases volume, so by Le Chatelier’s principle low temperature and high pressure favour the yield (in practice ~720 K, 2 bar, to keep the rate workable).',
      },
      {
        question: 'The charring of sugar by concentrated sulphuric acid demonstrates that H₂SO₄ is a:',
        options: [
          'reducing agent',
          'volatile acid',
          'weak acid',
          'strong dehydrating agent',
        ],
        correct_index: 3,
        explanation: 'Concentrated $\\ce{H2SO4}$ removes water from carbohydrates, $\\ce{C12H22O11 -> 12C + 11H2O}$ — a dehydrating action shown by the charring.',
      },
      {
        question: 'When hot concentrated sulphuric acid reacts with copper, it is reduced to:',
        options: ['H₂', 'SO₂', 'H₂S', 'S'],
        correct_index: 1,
        explanation: 'Hot concentrated $\\ce{H2SO4}$ acts as an oxidising agent and is reduced to $\\ce{SO2}$: $\\ce{Cu + 2H2SO4(conc.) -> CuSO4 + SO2 + 2H2O}$.',
      },
      {
        question: 'For sulphuric acid in water, K_a₂ is much smaller than K_a₁ because:',
        options: [
          'the second proton must be removed from the negatively charged HSO₄⁻ ion',
          'H₂SO₄ is a weak acid',
          'the first ionisation is endothermic',
          'water is a poor solvent for it',
        ],
        correct_index: 0,
        explanation: 'Pulling $\\ce{H+}$ off the negatively charged $\\ce{HSO4-}$ ion is opposed by electrostatic attraction, so the second ionisation is much weaker: $K_{a_2} \\ll K_{a_1}$.',
      },
    ], 0.6),
  ],
};
