// Ch.4 (p-Block) · Page 20 · Oxoacids of Halogens & Interhalogen Compounds
// (NCERT §7.21 + §7.22). NCERT content transcribed faithfully; notes-enrichment
// (interhalogen-hydrolysis rule) confined to "Exam Point" callouts. Hosts NCERT
// Example 7.19 (BrF3 shape via VSEPR) + In-text Question 7.31.
module.exports = {
  page_number: 20,
  chapter: 4,
  slug: 'oxoacids-of-halogens-and-interhalogens',
  title: 'Oxoacids of Halogens & Interhalogen Compounds',
  subtitle: 'Why fluorine makes only one oxoacid, the chlorine-oxoacid family, and the bent-T / square-pyramidal / pentagonal-bipyramidal interhalogens.',
  tags: ['p-block', 'group-17', 'oxoacids', 'interhalogens', 'halogens'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A neat grid of ball-and-stick oxoacid structures of chlorine — hypochlorous acid (H–O–Cl bent), chlorous acid, chloric acid, perchloric acid (Cl surrounded by O atoms and one O–H) — labelled, with a separate panel of interhalogen molecular shapes: a bent-T ClF3, a square-pyramidal IF5 and a pentagonal-bipyramidal IF7. Clean inorganic textbook plate, landscape, desktop-friendly.',
      '16:9',
      'Two families: the oxoacids of the halogens (HOX → HOXO₃) and the interhalogen compounds with their VSEPR shapes.'
    ),

    h.heading('Oxoacids of Halogens', 'State why fluorine forms only one oxoacid, and list the oxoacid series of Cl, Br and I.'),
    h.text(
      'Due to high electronegativity and small size, **fluorine forms only one oxoacid, HOF**, known as fluoric (I) acid or hypofluorous acid. The other halogens form several oxoacids. Most of them cannot be isolated in pure state. They are stable only in aqueous solutions or in the form of their salts. The oxoacids of halogens are given in Table 7.10 and their structures are given in Fig. 7.8.'
    ),
    h.table(
      ['Type', 'F', 'Cl', 'Br', 'I'],
      [
        ['Halic (I) — hypohalous acid', 'HOF', 'HOCl (hypochlorous)', 'HOBr (hypobromous)', 'HOI (hypoiodous)'],
        ['Halic (III) — halous acid', '—', 'HOClO (chlorous)', '—', '—'],
        ['Halic (V) — halic acid', '—', 'HOClO₂ (chloric)', 'HOBrO₂ (bromic)', 'HOIO₂ (iodic)'],
        ['Halic (VII) — perhalic acid', '—', 'HOClO₃ (perchloric)', 'HOBrO₃ (perbromic)', 'HOIO₃ (periodic)'],
      ],
      'Table 7.10 — Oxoacids of the halogens. Fluorine forms only HOF; chlorine forms the full +1/+3/+5/+7 series.'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure plate on a deep charcoal (#121316) background, muted earthy palette, no glow. Four labelled structures of chlorine oxoacids drawn ball-and-stick: (1) Hypochlorous acid H–O–Cl, bent; (2) Chlorous acid with one Cl=O and one Cl–O–H; (3) Chloric acid with two Cl=O and one Cl–O–H; (4) Perchloric acid with three Cl=O and one Cl–O–H, tetrahedral about Cl. Each labelled below. Clean inorganic textbook diagram, landscape.',
      '16:9',
      'Fig. 7.8 — The structures of the oxoacids of chlorine (hypochlorous, chlorous, chloric, perchloric). In every case Cl bears one O–H bond; the rest are Cl=O.'
    ),
    h.callout('exam_tip', 'Exam Point — reading the oxoacid name → oxidation state',
      'In every halogen oxoacid the central halogen carries **one O–H bond**; the remaining oxygens are double-bonded (X=O). The oxidation state of the halogen climbs +1 → +3 → +5 → +7 across the series:\n\n' +
      '- **HOX** (hypohalous, +1) · **HOXO** (halous, +3) · **HOXO₂** (halic, +5) · **HOXO₃** (perhalic, +7).\n\n' +
      'Acid strength rises with the number of terminal O atoms — so **$\\ce{HClO} < \\ce{HClO2} < \\ce{HClO3} < \\ce{HClO4}$** (perchloric acid is the strongest).'),

    h.heading('Interhalogen Compounds', 'Describe the types, preparation, properties, hydrolysis and shapes of the interhalogen compounds.'),
    h.text(
      'When two different halogens react with each other, **inter-halogen compounds** are formed. They can be assigned general compositions as $\\ce{XX\'}$, $\\ce{XX\'3}$, $\\ce{XX\'5}$ and $\\ce{XX\'7}$, where X is the halogen of **larger size** and X′ of **smaller size**, and X is more electropositive than X′. As the ratio between radii of X and X′ increases, the number of atoms per molecule also increases. Thus, iodine (VII) fluoride should have the maximum number of atoms, as the ratio of radii between I and F is maximum — that is why its formula is $\\ce{IF7}$ (having the maximum number of atoms).'
    ),
    h.text(
      '**Preparation.** The inter-halogen compounds can be prepared by the direct combination or by the action of halogen on lower inter-halogen compounds. The product formed depends upon some specific conditions. For example:\n\n' +
      '$$\\ce{Cl2 + F2 ->[\\text{437 K}] 2ClF} \\quad (\\text{equal volume})$$\n' +
      '$$\\ce{Cl2 + 3F2 ->[\\text{573 K}] 2ClF3} \\quad (\\text{F}_2\\ \\text{excess})$$\n' +
      '$$\\ce{I2 + Cl2 -> 2ICl} \\quad (\\text{equimolar})$$\n' +
      '$$\\ce{I2 + 3Cl2 -> 2ICl3} \\quad (\\text{Cl}_2\\ \\text{excess})$$\n' +
      '$$\\ce{Br2 + 3F2 -> 2BrF3} \\quad (\\text{diluted with water})$$\n' +
      '$$\\ce{Br2 + 5F2 -> 2BrF5} \\quad (\\text{F}_2\\ \\text{excess})$$'
    ),
    h.text(
      '**Properties.** These are all **covalent molecules and are diamagnetic in nature**. They are volatile solids or liquids except $\\ce{ClF}$ which is a gas at 298 K. Their physical properties are intermediate between those of the constituent halogens except that their m.p. and b.p. are a little higher than expected.\n\n' +
      'Their chemical reactions can be compared with the individual halogens. In general, **interhalogen compounds are more reactive than halogens** (except fluorine). This is because the **X–X′ bond in interhalogens is weaker than the X–X bond** in halogens except the F–F bond. All these undergo **hydrolysis**, giving the halide ion derived from the **smaller** halogen and a hypohalite (when $\\ce{XX\'}$), halite (when $\\ce{XX\'3}$), halate (when $\\ce{XX\'5}$) and perhalate (when $\\ce{XX\'7}$) anion derived from the **larger** halogen.\n\n' +
      '$$\\ce{XX\' + H2O -> HX\' + HOX}$$\n\n' +
      'Their molecular structures can be explained on the basis of **VSEPR theory** (Example 7.19). The $\\ce{XX\'3}$ compounds have the **bent "T" shape**, $\\ce{XX\'5}$ compounds **square pyramidal**, and $\\ce{IF7}$ has a **pentagonal bipyramidal** structure.'
    ),
    h.table(
      ['Type', 'Examples', 'Physical state & colour', 'Structure'],
      [
        ['XX′', 'ClF, BrF, IF, BrCl, ICl, IBr', 'gases / solids; e.g. ICl ruby-red solid, IBr black solid', '—'],
        ['XX′₃', 'ClF₃, BrF₃, IF₃, ICl₃', 'colourless gas / yellow-green liquid / solids', 'Bent T-shaped'],
        ['XX′₅', 'IF₅, BrF₅, ClF₅', 'colourless gas or liquid', 'Square pyramidal'],
        ['XX′₇', 'IF₇', 'colourless gas', 'Pentagonal bipyramidal'],
      ],
      'Table 7.11 — Some properties of the interhalogen compounds and their VSEPR shapes.'
    ),
    h.callout('exam_tip', 'Exam Point — the hydrolysis rule (who becomes +1, who becomes −1)',
      'On hydrolysis of an interhalogen $\\ce{XX\'}$ (X larger / less electronegative, X′ smaller / more electronegative):\n\n' +
      '- The **bigger, less-electronegative halogen X** takes the **positive** end → goes into the **HOX / oxoanion** ($\\ce{HOX}$, halite, halate, perhalate).\n' +
      '- The **smaller, more-electronegative halogen X′** takes the **−1** end → the **hydrohalide $\\ce{HX\'}$**.\n\n' +
      'e.g. $\\ce{ICl + H2O -> HCl + HOI}$ (Cl is more EN → $\\ce{HCl}$; I is less EN → $\\ce{HOI}$). Match the oxoanion to the type: $\\ce{XX\'3}$ → halite, $\\ce{XX\'5}$ → halate, $\\ce{XX\'7}$ → perhalate.'),
    h.img(
      'A hand-drawn coloured molecular-structure sketch on a deep charcoal (#121316) background, muted earthy palette, no glow. A single BrF3 molecule drawn from VSEPR: a central bromine with three Br–F bonds and two lone pairs occupying equatorial positions of a trigonal bipyramid, the two axial fluorines bent slightly towards the equatorial fluorine — producing a slightly bent "T" shape. Lone pairs shown as lobes. Clean inorganic textbook diagram, large and centred.',
      '4:3',
      'BrF₃ — three bond pairs + two lone pairs in a trigonal bipyramid give a slightly bent "T" shape (Example 7.19).'
    ),

    h.worked('NCERT Example 7.19', 'solved_example',
      'Deduce the molecular shape of $\\ce{BrF3}$ on the basis of VSEPR theory.',
      'The central atom Br has seven electrons in the valence shell. Three of these will form electron-pair bonds with three fluorine atoms leaving behind four electrons. Thus, there are **three bond pairs and two lone pairs**. According to VSEPR theory, these will occupy the corners of a trigonal bipyramid. The two lone pairs will occupy the equatorial positions to minimise lone pair–lone pair and bond pair–lone pair repulsions (which are greater than the bond pair–bond pair repulsions). In addition, the axial fluorine atoms will be bent towards the equatorial fluorine in order to minimise the lone pair–lone pair repulsions. The shape would be that of a **slightly bent "T"**.'),
    h.worked('In-text Question 7.31', 'ncert_intext',
      'Why is $\\ce{ICl}$ more reactive than $\\ce{I2}$?',
      'In general, interhalogen compounds are more reactive than halogens, because the **I–Cl bond in $\\ce{ICl}$ is weaker than the I–I bond in $\\ce{I2}$**. The weaker bond breaks more easily, so $\\ce{ICl}$ is more reactive than $\\ce{I2}$.'),

    h.heading('Uses'),
    h.text(
      'Interhalogen compounds can be used as **non-aqueous solvents**. They are also very useful **fluorinating agents** — $\\ce{ClF3}$ and $\\ce{BrF3}$ are used for the production of $\\ce{UF6}$ in the enrichment of $^{235}\\text{U}$.\n\n' +
      '$$\\ce{U(s) + 3ClF3(l) -> UF6(g) + 3ClF(g)}$$'
    ),

    h.recap([
      { label: 'Fluorine oxoacid', text: 'only **HOF** (hypofluorous acid) — small size + high electronegativity, no positive states.' },
      { label: 'Cl oxoacid series', text: '$\\ce{HOCl}$ (+1) · $\\ce{HOClO}$ (+3) · $\\ce{HOClO2}$ (+5) · $\\ce{HOClO3}$ (+7); strength rises HClO < HClO₂ < HClO₃ < HClO₄.' },
      { label: 'Interhalogen types', text: '$\\ce{XX\'}$, $\\ce{XX\'3}$, $\\ce{XX\'5}$, $\\ce{XX\'7}$ (X larger). Maximum atoms in $\\ce{IF7}$ (biggest radius ratio).' },
      { label: 'Reactivity', text: 'all covalent & diamagnetic; **more reactive than halogens** (except F₂) because the X–X′ bond is weaker.' },
      { label: 'Hydrolysis', text: '$\\ce{XX\' + H2O -> HX\' + HOX}$ — smaller halogen → $\\ce{HX\'}$ (−1); larger halogen → oxoanion (+ve).' },
      { label: 'Shapes', text: '$\\ce{XX\'3}$ bent-T · $\\ce{XX\'5}$ square pyramidal · $\\ce{IF7}$ pentagonal bipyramidal.' },
    ]),

    h.quiz([
      {
        question: 'Fluorine forms only one oxoacid, HOF, because:',
        options: [
          'fluorine is radioactive',
          'fluorine has the largest atomic size',
          'fluorine has high electronegativity and small size, so it cannot show positive oxidation states',
          'fluorine has many available $d$ orbitals',
        ],
        correct_index: 2,
        explanation: 'Being the most electronegative element with a very small size and no $d$ orbitals, fluorine cannot take positive oxidation states, so it forms just the one oxoacid HOF (hypofluorous acid).',
      },
      {
        question: 'The shape of the $\\ce{XX\'3}$ type interhalogen compounds (e.g. $\\ce{ClF3}$, $\\ce{BrF3}$) is:',
        options: [
          'trigonal planar',
          'bent T-shaped',
          'square pyramidal',
          'pentagonal bipyramidal',
        ],
        correct_index: 1,
        explanation: 'In $\\ce{XX\'3}$ the central atom has 3 bond pairs and 2 lone pairs; the lone pairs sit equatorially in a trigonal bipyramid, giving a slightly bent "T" shape.',
      },
      {
        question: 'Which interhalogen compound has the maximum number of atoms, and what is its shape?',
        options: [
          'ClF3, bent T-shaped',
          'BrF5, square pyramidal',
          'IF7, pentagonal bipyramidal',
          'ICl, linear',
        ],
        correct_index: 2,
        explanation: 'The radius ratio is largest for I and F, so the highest atom count occurs in $\\ce{IF7}$ — a pentagonal bipyramidal molecule.',
      },
      {
        question: 'On hydrolysis of $\\ce{ICl}$, the products are:',
        options: [
          '$\\ce{HI}$ and $\\ce{HOCl}$',
          '$\\ce{HCl}$ and $\\ce{HOI}$',
          '$\\ce{HClO3}$ and $\\ce{HI}$',
          '$\\ce{I2}$ and $\\ce{Cl2}$',
        ],
        correct_index: 1,
        explanation: 'The smaller, more electronegative halogen (Cl) becomes the −1 hydrohalide $\\ce{HCl}$; the larger, less electronegative halogen (I) goes to the positive end as $\\ce{HOI}$: $\\ce{ICl + H2O -> HCl + HOI}$.',
      },
      {
        question: 'Interhalogen compounds are generally more reactive than the parent halogens (except fluorine) because:',
        options: [
          'they are ionic and paramagnetic',
          'the X–X′ bond is weaker than the X–X bond',
          'they contain $d$ orbitals',
          'they have higher melting points',
        ],
        correct_index: 1,
        explanation: 'The X–X′ bond in an interhalogen is weaker than the X–X bond in the halogen (except F–F), so it breaks more easily, making interhalogens more reactive.',
      },
      {
        question: 'The correct order of acid strength of the oxoacids of chlorine is:',
        options: [
          '$\\ce{HClO4} < \\ce{HClO3} < \\ce{HClO2} < \\ce{HClO}$',
          '$\\ce{HClO} < \\ce{HClO2} < \\ce{HClO3} < \\ce{HClO4}$',
          '$\\ce{HClO3} < \\ce{HClO} < \\ce{HClO4} < \\ce{HClO2}$',
          'all four have equal acid strength',
        ],
        correct_index: 1,
        explanation: 'Acid strength rises with the number of terminal (X=O) oxygens and the oxidation state of chlorine: $\\ce{HClO} < \\ce{HClO2} < \\ce{HClO3} < \\ce{HClO4}$ — perchloric acid is the strongest.',
      },
    ], 0.6),
  ],
};
