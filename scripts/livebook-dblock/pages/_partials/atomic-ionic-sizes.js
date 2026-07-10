// Ch.5 (d- & f-Block) · Page 4 · Variation in Atomic & Ionic Sizes (NCERT §8.3.2).
// NCERT content transcribed faithfully (three highlighted passages verbatim, Table 8.2 data, same numbers).
// Devices: periodic-trends-explorer sim (predict-first); "🔍 Decode This" (Zr≈Hf as A–R);
//          "🏛️ Exam Vault" (verified atomic-radii PYQ, Mo & W). Ends with Quick Recap + textbook quiz.
module.exports = {
  page_number: 4,
  chapter: 5,
  slug: 'atomic-ionic-sizes',
  title: 'Variation in Atomic & Ionic Sizes',
  subtitle: 'Why sizes shrink only gently across a series, why the 5d metals are no bigger than the 4d ones, and the one idea — the Lanthanoid contraction — that ties Zirconium and Hafnium into near-twins.',
  tags: ['d-block', 'atomic-radii', 'ionic-radii', 'lanthanoid-contraction', 'high-yield'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon, no 3D. Central motif: three gently descending dotted curves of atomic radius versus atomic number — one for the 3d series (Sc…Zn, lowest), one for 4d (Y…Cd), and one for 5d (La…Hg) — drawn so that the 4d and 5d curves sit almost on top of each other (nearly overlapping). Two element pairs are circled as near-twins: "Zr 160 pm" and "Hf 159 pm". A faint label reads "Lanthanoid contraction pulls the 5d row down to meet the 4d row". Chalk-and-coloured-pencil textbook plate. Landscape.',
      '16:9',
      'The 4d and 5d radius curves almost coincide — Zr (160 pm) and Hf (159 pm) become near-twins. That is the Lanthanoid contraction.'
    ),

    h.heading('8.3.2 Variation in Atomic and Ionic Sizes of Transition Metals', 'Explain how atomic and ionic radii vary across and down the transition series, and what the Lanthanoid contraction is.'),

    h.callout('note', 'How size changes across a series (keep this NCERT passage word for word)',
      '> *"In general, ions of the same charge in a given series show progressive decrease in radius with increasing atomic number. This is because the new electron enters a $d$ orbital each time the nuclear charge increases by unity. It may be recalled that the shielding effect of a $d$ electron is not that effective, hence the net electrostatic attraction between the nuclear charge and the outermost electron increases and the ionic radius decreases. The same trend is observed in the atomic radii of a given series. However, the variation within a series is quite small."*'),

    h.text(
      'An interesting point emerges when atomic sizes of one series are compared with those of the corresponding elements in the other series. The curves in Fig. 8.3 show an increase from the first ($3d$) to the second ($4d$) series of the elements but the radii of the third ($5d$) series are virtually the same as those of the corresponding members of the second series. This phenomenon is associated with the intervention of the $4f$ orbitals which must be filled before the $5d$ series of elements begin.'
    ),

    h.callout('note', 'Where the Lanthanoid contraction comes from (keep this NCERT line word for word)',
      '> *"The filling of $4f$ before $5d$ orbital results in a regular decrease in atomic radii called **Lanthanoid contraction** which essentially compensates for the expected increase in atomic size with increasing atomic number."*'),

    h.text(
      'The factor responsible for the lanthanoid contraction is somewhat similar to that observed in an ordinary transition series and is attributed to similar cause, i.e., the imperfect shielding of one electron by another in the same set of orbitals. However, the shielding of one $4f$ electron by another is less than that of one $d$ electron by another, and as the nuclear charge increases along the series, there is fairly regular decrease in the size of the entire $4f^n$ orbitals.'
    ),

    h.callout('note', 'The pay-off: Zr ≈ Hf (keep this NCERT line word for word)',
      '> *"The net result of the lanthanoid contraction is that the second and the third $d$ series exhibit similar radii (e.g., Zr 160 pm, Hf 159 pm) and have very similar physical and chemical properties much more than that expected on the basis of usual family relationship."*'),

    h.text(
      'The decrease in metallic radius coupled with increase in atomic mass results in a general increase in the density of these elements. Thus, from titanium ($Z = 22$) to copper ($Z = 29$) the significant increase in the density may be noted (Table 8.2).'
    ),

    h.sim('periodic-trends-explorer', 'Explore the periodic trends', {
      prompt: 'Walk across the 3d series from Sc to Zn. What happens to the atomic radius?',
      options: [
        'It increases steadily — each new electron pushes the outer shell further out',
        'It decreases, but only by a small amount — the rising nuclear charge wins because d electrons shield poorly',
        'It stays exactly constant across the whole series',
        'It first increases sharply, then collapses at Zn',
      ],
      reveal_after: true,
    }),

    h.table(
      ['Property', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'],
      [
        ['Atomic number', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        ['Metallic radius M /pm', '164', '147', '135', '129', '137', '126', '125', '125', '128', '137'],
        ['Ionic radius M²⁺ /pm', '–', '–', '79', '82', '82', '77', '74', '70', '73', '75'],
        ['Ionic radius M³⁺ /pm', '73', '67', '64', '62', '65', '65', '61', '60', '–', '–'],
        ['Density /g cm⁻³', '3.43', '4.1', '6.07', '7.19', '7.21', '7.8', '8.7', '8.9', '8.9', '7.1'],
      ],
      'Table 8.2 (extract) — Metallic/ionic radii and densities of the first-series transition elements. Note how the metallic radius barely changes across the row, while density climbs from Ti to Cu.'
    ),

    h.callout('exam_tip', 'Exam Point — three radius facts that win marks',
      '1. **Across a series:** radius shrinks only **slightly** — the rise in nuclear charge is partly cancelled by poor $d$-electron shielding. (Don\'t say "large decrease".)\n' +
      '2. **Down a group:** $3d \\to 4d$ the radius **increases**, but $4d \\to 5d$ it **stays almost the same** — because the $4f$ electrons of the lanthanoids are slotted in first (lanthanoid contraction).\n' +
      '3. **The headline pair:** $\\ce{Zr}$ (160 pm) and $\\ce{Hf}$ (159 pm) — near-identical, so they are chemically near-twins and notoriously hard to separate. (Mo/W is the same story.)'),

    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT pairs a **fact** with its **reason**, and examiners lift that pair into an **Assertion–Reason** question:\n\n' +
      '> **NCERT (fact):** *"The second and the third $d$ series exhibit similar radii (e.g., Zr 160 pm, Hf 159 pm)."*\n' +
      '> **NCERT (reason):** *"The filling of $4f$ before $5d$ orbital results in a regular decrease in atomic radii called Lanthanoid contraction."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Zr and Hf have almost the same atomic radius (≈160 pm and ≈159 pm).\n' +
      '- **Reason (R):** The lanthanoid contraction — the $4f$ orbitals filling before the $5d$ series begins — cancels the expected size increase from the second to the third series.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** when NCERT gives a *surprising similarity* and then a *named contraction* as the cause, that is a ready-made A–R question — A = the similarity, R = the contraction.'),

    h.worked('🏛️ Exam Vault · JEE Main 2019 (PYQ)', 'solved_example',
      'The pair that has similar atomic radii is:\n\n(1) Mo and W  (2) Sc and Ni  (3) Mn and Re  (4) Ti and Hf',
      '**Answer: (1) Mo and W.** Mo ($4d$ series) and W ($5d$ series) sit one above the other in group 6. Thanks to the **lanthanoid contraction**, the third ($5d$) series shrinks down to match the second ($4d$) series, so a $4d$ metal and the $5d$ metal directly below it have almost the same radius. Sc/Ni and Mn/Re are not vertically paired, and Ti ($3d$) is much smaller than Hf ($5d$).\n\n' +
      '**Notice:** this is NCERT\'s exact point — *"the second and the third $d$ series exhibit similar radii (e.g., Zr 160 pm, Hf 159 pm)."* Mo–W is simply the group-6 version of the Zr–Hf example.'),

    h.recap([
      { label: 'Across a row', text: 'Atomic and ionic radii **decrease slightly** — new electrons enter $d$ orbitals that shield poorly, so the rising nuclear charge pulls the shell in. The change is **small**.' },
      { label: 'Down a group', text: '$3d \\to 4d$: radius **rises**. $4d \\to 5d$: radius is **almost unchanged**, because the $4f$ orbitals fill before the $5d$ series.' },
      { label: 'Lanthanoid contraction', text: 'The regular shrinkage caused by filling $4f$ first — poor $4f$ shielding lets the nucleus pull the shell in — cancels the expected size increase.' },
      { label: 'Zr ≈ Hf', text: '$\\ce{Zr}$ 160 pm and $\\ce{Hf}$ 159 pm: near-identical radii → very similar properties → hard to separate. Mo/W behave the same way.' },
      { label: 'Density', text: 'Smaller radius + heavier atoms → density **rises** across the row, e.g. from Ti ($4.1$) to Cu ($8.9$ g cm⁻³).' },
    ]),

    h.quiz([
      {
        question: 'How do the atomic radii change on moving across a transition series from left to right?',
        options: [
          'They increase steadily as electrons are added',
          'They remain exactly constant',
          'They decrease sharply, by more than in any main-group period',
          'They decrease, but only by a small amount',
        ],
        correct_index: 3,
        explanation: 'NCERT states the variation within a series is "quite small": rising nuclear charge pulls the shell in, but each added electron enters a poorly shielding $d$ orbital, so the net contraction is gentle — not a sharp drop and certainly not an increase.',
      },
      {
        question: 'The atomic radii of the third ($5d$) transition series are almost equal to those of the second ($4d$) series. This is because of:',
        options: [
          'the inert pair effect',
          'the lanthanoid contraction — the $4f$ orbitals filling before the $5d$ series begins',
          'identical nuclear charges in the two series',
          'completely filled $d$ orbitals in all $5d$ metals',
        ],
        correct_index: 1,
        explanation: 'Filling the $4f$ orbitals first causes a steady shrinkage (lanthanoid contraction) that cancels the size increase normally expected from the second to the third series. The inert pair effect is a p-block phenomenon, and the nuclear charges are not identical.',
      },
      {
        question: 'Which pair of elements is correctly described as having nearly identical atomic radii?',
        options: [
          'Sc (164 pm) and Zn (137 pm)',
          'Ti (147 pm) and Cu (128 pm)',
          'Zr (160 pm) and Hf (159 pm)',
          'Mn (137 pm) and Fe (126 pm)',
        ],
        correct_index: 2,
        explanation: 'NCERT gives Zr 160 pm and Hf 159 pm as the textbook example of near-identical radii caused by the lanthanoid contraction. The other pairs differ noticeably in size.',
      },
      {
        question: 'Why does the density of the first transition series generally increase from titanium to copper?',
        options: [
          'because the atomic radius increases while the mass falls',
          'because the metallic radius decreases while the atomic mass increases',
          'because the atoms become radioactive',
          'because the $d$ orbitals empty out across the series',
        ],
        correct_index: 1,
        explanation: 'A smaller metallic radius packs more mass into less volume, and the atomic mass rises across the row — together these push the density up (e.g. Ti $4.1$ to Cu $8.9$ g cm⁻³). The radius shrinks, not grows.',
      },
      {
        question: 'Assertion (A): Zirconium and hafnium are difficult to separate and show very similar chemistry.\nReason (R): They have almost the same atomic radius because of the lanthanoid contraction.\nChoose the correct option:',
        options: [
          'Both A and R are true, and R is the correct explanation of A',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'A is true but R is false',
          'A is false but R is true',
        ],
        correct_index: 0,
        explanation: 'The near-identical radii (Zr 160 pm, Hf 159 pm) produced by the lanthanoid contraction are exactly why their chemistry is so alike and separation is hard — so R is the correct explanation of A.',
      },
      {
        question: 'The poor shielding that drives the lanthanoid contraction is specifically the imperfect shielding of:',
        options: [
          'one $s$ electron by another',
          'a $4f$ electron by a $5d$ electron',
          'the nucleus by the core electrons',
          'one $4f$ electron by another in the same set of orbitals',
        ],
        correct_index: 3,
        explanation: 'NCERT attributes the contraction to the imperfect shielding of one $4f$ electron by another within the same set of orbitals — even weaker than $d$–$d$ shielding — so the nuclear charge steadily pulls the $4f^n$ orbitals inward across the series.',
      },
    ], 0.6),
  ],
};
