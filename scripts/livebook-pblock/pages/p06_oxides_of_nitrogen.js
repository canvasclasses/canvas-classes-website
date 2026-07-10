// Ch.4 (p-Block) · Page 6 · Oxides of Nitrogen (NCERT §7.4).
// Compound page: the family of nitrogen oxides across oxidation states +1 to +5.
// Table 7.3 (names/formulas/oxidation state/preparation/appearance) rendered via
// h.table; Table 7.4 resonance structures → an h.img placeholder. Hosts NCERT
// Example 7.5 + In-text Question 7.6. NCERT transcribed faithfully.
module.exports = {
  page_number: 6,
  chapter: 4,
  slug: 'oxides-of-nitrogen',
  title: 'Oxides of Nitrogen',
  subtitle: 'Nitrogen forms a whole family of oxides — from +1 in N₂O to +5 in N₂O₅ — each with its own colour, acidity and structure.',
  tags: ['p-block', 'group-15', 'oxides-of-nitrogen', 'nitrogen'],
  reading_time_min: 6,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A horizontal "family line-up" of nitrogen oxides labelled by oxidation state: N2O (+1, colourless gas), NO (+2, colourless gas), N2O3 (+3, blue solid), NO2 (+4, brown gas), N2O4 (+4, colourless), N2O5 (+5, colourless solid) — each drawn as a small labelled molecule with its colour swatch. Textbook plate style, landscape, desktop-friendly.',
      '16:9',
      'Nitrogen oxides — one element, six oxides, oxidation states from +1 to +5.'
    ),

    h.text(
      'Nitrogen forms a number of oxides in **different oxidation states**. The names, formulas, preparation and physical appearance of these oxides are given in Table 7.3.'
    ),
    h.table(
      ['Name', 'Formula', 'Oxidation state of N', 'Common method of preparation', 'Physical appearance & chemical nature'],
      [
        ['Dinitrogen oxide [Nitrogen(I) oxide]', 'N₂O', '+1', '$\\ce{NH4NO3 ->[\\Delta] N2O + 2H2O}$', 'colourless gas, neutral'],
        ['Nitrogen monoxide [Nitrogen(II) oxide]', 'NO', '+2', '$\\ce{2NaNO2 + 2FeSO4 + 3H2SO4 -> Fe2(SO4)3 + 2NaHSO4 + 2H2O + 2NO}$', 'colourless gas, neutral'],
        ['Dinitrogen trioxide [Nitrogen(III) oxide]', 'N₂O₃', '+3', '$\\ce{2NO + N2O4 ->[250\\ K] 2N2O3}$', 'blue solid, acidic'],
        ['Nitrogen dioxide [Nitrogen(IV) oxide]', 'NO₂', '+4', '$\\ce{2Pb(NO3)2 ->[673\\ K] 4NO2 + 2PbO + O2}$', 'brown gas, acidic'],
        ['Dinitrogen tetroxide [Nitrogen(IV) oxide]', 'N₂O₄', '+4', '$\\ce{2NO2 <=>[Cool][Heat] N2O4}$', 'colourless solid/liquid, acidic'],
        ['Dinitrogen pentoxide [Nitrogen(V) oxide]', 'N₂O₅', '+5', '$\\ce{4HNO3 + P4O10 -> 4HPO3 + 2N2O5}$', 'colourless solid, acidic'],
      ],
      'Table 7.3 — Oxides of nitrogen (names, formulas, oxidation states, preparation and appearance).'
    ),

    h.heading('Structures of the oxides', 'Relate the resonance structures of the nitrogen oxides to their bond parameters and geometry.'),
    h.text(
      'Lewis dot main resonance structures and bond parameters of these oxides are given in Table 7.4. Several of these oxides are described by **resonance**: e.g. $\\ce{N2O}$ ($\\ce{N=N=O <-> N#N-O}$) is **linear**, $\\ce{NO2}$ is **angular** (O–N–O 134°), and $\\ce{N2O3}$, $\\ce{N2O4}$ and $\\ce{N2O5}$ are **planar**.'
    ),
    h.img(
      'A hand-drawn coloured chemistry diagram on a deep charcoal (#121316) background, muted earthy palette, no glow. A grid of the main resonance (Lewis-dot) structures of the nitrogen oxides with bond parameters: N2O (N–N–O, linear, 113 pm and 119 pm); NO (N–O 115 pm); N2O3 (planar, angles 105° and 130°, 186 pm N–N); NO2 (angular, O–N–O 134°, 120 pm); N2O4 (planar, 175 pm N–N, 121 pm N–O, 135° angle); N2O5 (planar, O–N–O–N–O backbone, 112° and 134° angles). Clean inorganic textbook plate, large and centred.',
      '4:3',
      'Table 7.4 — Resonance structures and bond parameters of the oxides of nitrogen.'
    ),

    h.worked('NCERT Example 7.5', 'solved_example',
      'Why does $\\ce{NO2}$ dimerise?',
      '$\\ce{NO2}$ contains an odd number of valence electrons. It behaves as a typical odd molecule. On dimerisation, it is converted to the stable $\\ce{N2O4}$ molecule with an even number of electrons.'),

    h.worked('In-text Question 7.6', 'ncert_intext',
      'What is the covalence of nitrogen in $\\ce{N2O5}$?',
      'In $\\ce{N2O5}$ the structure is $\\ce{O2N-O-NO2}$. Each nitrogen is bonded to three oxygens (two terminal N=O/N–O bonds and one bridging N–O). Counting all the N–O linkages, the **covalence of nitrogen is 4** — nitrogen cannot exceed a covalency of four because it has no $d$ orbitals to expand its octet.'),

    h.callout('exam_tip', 'Exam Point — quick facts that get asked',
      '- **Colours:** $\\ce{NO2}$ is **brown**, $\\ce{N2O3}$ is a **blue** solid; $\\ce{N2O}$, $\\ce{NO}$, $\\ce{N2O4}$, $\\ce{N2O5}$ are colourless.\n' +
      '- **Neutral vs acidic:** $\\ce{N2O}$ and $\\ce{NO}$ are **neutral** oxides; $\\ce{N2O3}$, $\\ce{NO2}$, $\\ce{N2O4}$, $\\ce{N2O5}$ are **acidic**.\n' +
      '- **$\\ce{NO2}$ dimerises** to $\\ce{N2O4}$ because $\\ce{NO2}$ is an odd-electron molecule and the dimer has an even electron count.\n' +
      '- **Covalence of N in $\\ce{N2O5}$ is 4** — the no-$d$-orbital covalency limit again.'),

    h.recap([
      { label: 'The family', text: 'Six oxides spanning oxidation states **+1 to +5**: $\\ce{N2O}$(+1), $\\ce{NO}$(+2), $\\ce{N2O3}$(+3), $\\ce{NO2}$/$\\ce{N2O4}$(+4), $\\ce{N2O5}$(+5).' },
      { label: 'Colour & nature', text: '$\\ce{N2O}$, $\\ce{NO}$ — colourless & neutral · $\\ce{N2O3}$ blue solid (acidic) · $\\ce{NO2}$ brown gas (acidic) · $\\ce{N2O5}$ colourless solid (acidic).' },
      { label: 'Shapes', text: '$\\ce{N2O}$ linear · $\\ce{NO2}$ angular (134°) · $\\ce{N2O3}$, $\\ce{N2O4}$, $\\ce{N2O5}$ planar.' },
      { label: 'Key reactions', text: '$\\ce{2NO2 <=> N2O4}$ (dimerisation of the odd-electron $\\ce{NO2}$); covalence of N in $\\ce{N2O5}$ = 4.' },
    ]),

    h.quiz([
      {
        question: 'In which oxide is nitrogen in the +1 oxidation state?',
        options: ['NO', 'N₂O', 'NO₂', 'N₂O₅'],
        correct_index: 1,
        explanation: 'Dinitrogen oxide $\\ce{N2O}$ has nitrogen in the +1 state; $\\ce{NO}$ is +2, $\\ce{NO2}$ is +4 and $\\ce{N2O5}$ is +5.',
      },
      {
        question: 'Why does NO₂ dimerise to N₂O₄?',
        options: [
          'because NO₂ is an odd-electron molecule and the dimer has an even number of electrons',
          'because NO₂ is a strong acid',
          'because NO₂ is coloured',
          'because nitrogen has empty d orbitals',
        ],
        correct_index: 0,
        explanation: '$\\ce{NO2}$ has an odd number of valence electrons (a typical odd molecule); on dimerising it forms stable $\\ce{N2O4}$ with an even electron count.',
      },
      {
        question: 'The covalence of nitrogen in N₂O₅ is:',
        options: ['2', '3', '4', '5'],
        correct_index: 2,
        explanation: 'Nitrogen has no $d$ orbitals, so its maximum covalence is 4 — that is its covalence in $\\ce{N2O5}$ ($\\ce{O2N-O-NO2}$).',
      },
      {
        question: 'Which of the following nitrogen oxides is a neutral oxide?',
        options: ['N₂O₃', 'NO₂', 'NO', 'N₂O₅'],
        correct_index: 2,
        explanation: '$\\ce{N2O}$ and $\\ce{NO}$ are neutral oxides; $\\ce{N2O3}$, $\\ce{NO2}$, $\\ce{N2O4}$ and $\\ce{N2O5}$ are acidic.',
      },
      {
        question: 'Which nitrogen oxide is a brown gas?',
        options: ['N₂O', 'NO', 'NO₂', 'N₂O₅'],
        correct_index: 2,
        explanation: 'Nitrogen dioxide $\\ce{NO2}$ is a brown, acidic gas; $\\ce{N2O3}$ is a blue solid and the others listed are colourless.',
      },
      {
        question: 'The shape of the N₂O molecule is:',
        options: ['angular', 'linear', 'trigonal planar', 'pyramidal'],
        correct_index: 1,
        explanation: '$\\ce{N2O}$ ($\\ce{N=N=O <-> N#N-O}$) is linear; by contrast $\\ce{NO2}$ is angular and $\\ce{N2O3}$/$\\ce{N2O4}$/$\\ce{N2O5}$ are planar.',
      },
    ], 0.6),
  ],
};
