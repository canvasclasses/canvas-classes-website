// Ch.4 (p-Block) · Page 9 · Phosphine (NCERT §7.7).
// Preparation (Ca3P2 + water/HCl; P4 + NaOH), purification via PH4I, properties
// and uses — transcribed faithfully from NCERT. Hosts NCERT Example 7.6
// ("Prove that PH3 is basic" → PH3 + HI -> PH4I). Enrichment in "Exam Point" callouts.
module.exports = {
  page_number: 9,
  chapter: 4,
  slug: 'phosphine',
  title: 'Phosphine',
  subtitle: 'The rotten-fish-smelling hydride of phosphorus — how it is made and purified, why it explodes near oxidisers, and the Holme’s-signal use that lights up the sea.',
  tags: ['p-block', 'group-15', 'phosphine', 'phosphorus', 'hydride'],
  reading_time_min: 6,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. Central motif: a trigonal-pyramidal phosphine (PH3) molecule (phosphorus at the apex with a visible lone pair, three hydrogen atoms below) drawn like a chalk-and-coloured-pencil textbook sketch, beside a small flask of calcium phosphide reacting with water releasing gas bubbles. A faint silhouette of a buoy or float on the sea in the background hinting at Holme’s signals. Clean inorganic-chemistry plate. Landscape, desktop-friendly.',
      '16:9',
      'Phosphine (PH₃) — a pyramidal, foul-smelling gas that ignites near oxidisers.'
    ),

    h.heading('Preparation', 'Describe the laboratory preparation of phosphine and how the impure gas is purified.'),
    h.text(
      'Phosphine is prepared by the reaction of **calcium phosphide with water or dilute HCl**.\n\n' +
      '$$\\ce{Ca3P2 + 6H2O -> 3Ca(OH)2 + 2PH3}$$\n' +
      '$$\\ce{Ca3P2 + 6HCl -> 3CaCl2 + 2PH3}$$\n\n' +
      'In the laboratory, it is prepared by **heating white phosphorus with concentrated NaOH solution in an inert atmosphere of $\\ce{CO2}$**.\n\n' +
      '$$\\ce{P4 + 3NaOH + 3H2O -> PH3 + 3NaH2PO2}\\ \\text{(sodium hypophosphite)}$$'
    ),
    h.text(
      '**Purification.** When pure, it is **non-inflammable** but becomes inflammable owing to the presence of $\\ce{P2H4}$ or $\\ce{P4}$ vapours. To purify it from the impurities, it is **absorbed in HI to form phosphonium iodide ($\\ce{PH4I}$)** which on treating with KOH gives off phosphine.\n\n' +
      '$$\\ce{PH4I + KOH -> KI + H2O + PH3}$$'
    ),
    h.callout('exam_tip', 'Exam Point — pure vs impure phosphine',
      '- **Pure $\\ce{PH3}$ is non-inflammable.** The spontaneous ignition seen in many demos is due to traces of **diphosphine $\\ce{P2H4}$** (or $\\ce{P4}$ vapour) carried along with it.\n' +
      '- The **purification trick** is a classic: absorb in **HI → $\\ce{PH4I}$ (phosphonium iodide)**, then liberate clean $\\ce{PH3}$ with KOH.'),

    h.heading('Properties', 'List the physical properties and the key reactions of phosphine, including its weakly basic character.'),
    h.text(
      '**Physical properties**\n\n' +
      '- Colourless gas with a **rotten-fish smell** and **highly poisonous**.\n' +
      '- **It explodes in contact with traces of oxidising agents** like $\\ce{HNO3}$, $\\ce{Cl2}$ and $\\ce{Br2}$ vapours.\n' +
      '- It is **slightly soluble in water**. The solution of $\\ce{PH3}$ in water decomposes in the presence of light, giving red phosphorus and $\\ce{H2}$.'
    ),
    h.text('**Chemical properties**'),
    h.text(
      '**Reacts with metal salt solutions.** When absorbed in copper sulphate or mercuric chloride solution, the corresponding phosphides are obtained.\n\n' +
      '$$\\ce{3CuSO4 + 2PH3 -> Cu3P2 + 3H2SO4}$$\n' +
      '$$\\ce{3HgCl2 + 2PH3 -> Hg3P2 + 6HCl}$$'
    ),
    h.text(
      '**Weakly basic.** Phosphine is weakly basic and, like ammonia, gives phosphonium compounds with acids, e.g.,\n\n' +
      '$$\\ce{PH3 + HBr -> PH4Br}$$'
    ),
    h.callout('exam_tip', 'Exam Point — PH₃ vs NH₃ basicity',
      'Both $\\ce{PH3}$ and $\\ce{NH3}$ donate the lone pair on the central atom to form $\\ce{MH4+}$ salts, so both are basic. But **$\\ce{PH3}$ is a much weaker base than $\\ce{NH3}$**: the lone pair on the larger P atom is more diffuse and less available. Down the group basicity falls $\\ce{NH3} > \\ce{PH3} > \\ce{AsH3} > \\ce{SbH3} > \\ce{BiH3}$.'),

    h.worked('NCERT Example 7.6', 'solved_example',
      'In what way can it be proved that $\\ce{PH3}$ is basic in nature?',
      '$\\ce{PH3}$ reacts with acids like HI to form $\\ce{PH4I}$ which shows that it is basic in nature.\n\n$$\\ce{PH3 + HI -> PH4I}$$\n\nDue to the lone pair on the phosphorus atom, $\\ce{PH3}$ is acting as a Lewis base in the above reaction.'),

    h.heading('Uses'),
    h.text(
      'The **spontaneous combustion** of phosphine is technically used in **Holme’s signals**. Containers containing calcium carbide and calcium phosphide are pierced and thrown in the sea; when the gases evolved burn, they serve as a signal. It is also used in **smoke screens**.'
    ),

    h.recap([
      { label: 'Made by', text: '$\\ce{Ca3P2}$ + water or dil. HCl → $\\ce{PH3}$; or white P + conc. NaOH (inert $\\ce{CO2}$) → $\\ce{PH3}$ + $\\ce{NaH2PO2}$.' },
      { label: 'Purified by', text: 'Absorb impure gas in **HI → $\\ce{PH4I}$**, then liberate pure $\\ce{PH3}$ with KOH. (Pure $\\ce{PH3}$ is non-inflammable; $\\ce{P2H4}$/$\\ce{P4}$ traces make it catch fire.)' },
      { label: 'Properties', text: 'Colourless, rotten-fish smell, poisonous; **explodes with oxidisers** ($\\ce{HNO3}$, $\\ce{Cl2}$, $\\ce{Br2}$); slightly water-soluble; gives phosphides with $\\ce{CuSO4}$ / $\\ce{HgCl2}$.' },
      { label: 'Basic character', text: 'Weakly basic — forms phosphonium salts: $\\ce{PH3 + HBr -> PH4Br}$ (weaker base than $\\ce{NH3}$).' },
      { label: 'Uses', text: 'Holme’s signals (spontaneous combustion at sea) and smoke screens.' },
    ]),

    h.quiz([
      {
        question: 'Phosphine is conveniently prepared in the laboratory by:',
        options: [
          'burning white phosphorus in air',
          'heating white phosphorus with concentrated NaOH in an inert atmosphere of CO₂',
          'passing dry chlorine over heated phosphorus',
          'heating red phosphorus in a sealed tube',
        ],
        correct_index: 1,
        explanation: 'In the lab $\\ce{PH3}$ is made by heating white phosphorus with conc. NaOH in an inert $\\ce{CO2}$ atmosphere: $\\ce{P4 + 3NaOH + 3H2O -> PH3 + 3NaH2PO2}$.',
      },
      {
        question: 'Pure phosphine is non-inflammable, but the gas usually catches fire spontaneously because of the presence of:',
        options: [
          'water vapour',
          'traces of P₂H₄ (diphosphine) or P₄ vapours',
          'dissolved oxygen',
          'phosphonium iodide',
        ],
        correct_index: 1,
        explanation: 'Pure $\\ce{PH3}$ is non-inflammable. The spontaneous ignition is caused by traces of $\\ce{P2H4}$ (or $\\ce{P4}$ vapour) present as impurity.',
      },
      {
        question: 'Impure phosphine is purified by absorbing it in HI to form, and then treating with KOH:',
        options: [
          'phosphonium iodide, PH₄I',
          'phosphorus trichloride, PCl₃',
          'sodium hypophosphite, NaH₂PO₂',
          'calcium phosphide, Ca₃P₂',
        ],
        correct_index: 0,
        explanation: 'Phosphine is absorbed in HI to give phosphonium iodide $\\ce{PH4I}$, which on treatment with KOH gives off pure phosphine: $\\ce{PH4I + KOH -> KI + H2O + PH3}$.',
      },
      {
        question: 'That $\\ce{PH3}$ is basic in nature is best proved by the fact that it:',
        options: [
          'has a rotten-fish smell',
          'is slightly soluble in water',
          'reacts with acids like HI to form PH₄I',
          'decomposes in light to red phosphorus and H₂',
        ],
        correct_index: 2,
        explanation: 'Reacting with an acid to form a phosphonium salt ($\\ce{PH3 + HI -> PH4I}$) shows $\\ce{PH3}$ donating its lone pair — i.e., acting as a base.',
      },
      {
        question: 'Phosphine is known to explode on contact with traces of:',
        options: [
          'nitrogen and argon',
          'oxidising agents such as HNO₃, Cl₂ and Br₂ vapours',
          'sodium hydroxide',
          'carbon dioxide',
        ],
        correct_index: 1,
        explanation: 'Phosphine explodes in contact with traces of oxidising agents like $\\ce{HNO3}$, $\\ce{Cl2}$ and $\\ce{Br2}$ vapours — which is why it is handled in an inert atmosphere.',
      },
      {
        question: 'The spontaneous combustion of phosphine is technically used in:',
        options: [
          'the Haber process',
          'the Ostwald process',
          'Holme’s signals',
          'the brown-ring test',
        ],
        correct_index: 2,
        explanation: 'Holme’s signals use the spontaneous combustion of phosphine: containers of calcium carbide and calcium phosphide are pierced and thrown in the sea, and the burning evolved gases serve as a signal.',
      },
    ], 0.6),
  ],
};
