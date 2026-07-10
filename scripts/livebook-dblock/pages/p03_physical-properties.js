// Ch.5 (d- & f-Block) · Page 3 · Physical Properties & Metallic Character (NCERT §8.3.1).
// NCERT content transcribed faithfully (lattice-structure table, Fig 8.1/8.2 as diagrams, same numbers).
// Devices: "🔍 Decode This" (m.p. max at d⁵ as A–R). Examples 8.2 + In-text 8.2 placed at section.
// Ends with a Quick Recap + a textbook quiz in real exam formats.
module.exports = {
  page_number: 3,
  chapter: 5,
  slug: 'physical-properties',
  title: 'Physical Properties & Metallic Character',
  subtitle: 'Why transition metals are hard, high-melting and lustrous, why the melting point peaks in the middle of each series (at d⁵), and why Zn, Cd, Hg and Mn refuse to follow the crowd.',
  tags: ['d-block', 'physical-properties', 'melting-point', 'enthalpy-of-atomisation', 'metallic'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon, no 3D. Central motif: a gentle hill-shaped curve drawn in chalk, peaking in the middle, with the elements Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn marked along the base and the y-axis labelled "melting point" — the peak near the centre (around Cr/d⁵), with Mn drawn as a small dip below the curve to show it as an anomaly, and Zn at the far right drawn low. To one side, small lattice motifs labelled bcc, hcp, ccp drawn as packed-sphere sketches. A glinting metal bar suggests metallic lustre. Landscape, desktop-friendly textbook plate.',
      '16:9',
      'Melting points rise to a maximum near the middle of each series (around d⁵), with Mn dipping as an anomaly.'
    ),

    h.heading('8.3.1 Physical Properties', 'Describe the metallic character and lattice structures of the transition metals and explain the trend in their melting points.'),
    h.text(
      'Nearly all the transition elements display typical metallic properties such as high tensile strength, ductility, malleability, high thermal and electrical conductivity and metallic lustre.'
    ),

    h.callout('note', 'The structure exceptions (keep this NCERT line word for word)',
      '> *"With the exceptions of Zn, Cd, Hg and Mn, they have one or more typical metallic structures at normal temperatures."*\n\n' +
      'The typical metallic structures are bcc (body centred cubic), hcp (hexagonal close packed) and ccp (cubic close packed). For the four exceptions, NCERT marks the structure as **X** = a typical metal structure.'),

    h.table(
      ['Series', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'],
      [
        ['3d', 'hcp (bcc)', 'hcp (bcc)', 'bcc', 'bcc (bcc, ccp)', 'X (hcp)', 'bcc (hcp)', 'ccp', 'ccp', 'ccp', 'X (hcp)'],
      ],
      'Lattice Structures of Transition Metals — 1st series. (bcc = body centred cubic; hcp = hexagonal close packed; ccp = cubic close packed; X = a typical metal structure.)'
    ),
    h.table(
      ['Series', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd'],
      [
        ['4d', 'hcp (bcc)', 'hcp (bcc)', 'bcc', 'bcc', 'hcp', 'hcp', 'ccp', 'ccp', 'ccp', 'X (hcp)'],
      ],
      'Lattice Structures of Transition Metals — 2nd series.'
    ),
    h.table(
      ['Series', 'La', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg'],
      [
        ['5d', 'hcp (ccp, bcc)', 'hcp (bcc)', 'bcc', 'bcc', 'hcp', 'hcp', 'ccp', 'ccp', 'ccp', 'X'],
      ],
      'Lattice Structures of Transition Metals — 3rd series.'
    ),

    h.heading('Melting points and enthalpies of atomisation', 'Explain why the melting points and enthalpies of atomisation rise to a maximum in the middle of each transition series.'),
    h.text(
      'The transition metals (with the exception of Zn, Cd and Hg) are very much hard and have low volatility. Their melting and boiling points are high. Fig. 8.1 depicts the melting points of the $3d$, $4d$ and $5d$ transition metals. The high melting points of these metals are attributed to the involvement of greater number of electrons from $(n-1)d$ in addition to the $ns$ electrons in the interatomic metallic bonding.'
    ),
    h.text(
      'In any row the melting points of these metals rise to a maximum at $d^5$ except for anomalous values of Mn and Tc and fall regularly as the atomic number increases. They have high enthalpies of atomisation which are shown in Fig. 8.2. The maxima at about the middle of each series indicate that one unpaired electron per $d$ orbital is particularly favourable for strong interatomic interaction. In general, greater the number of valence electrons, stronger is the resultant bonding.'
    ),

    h.img(
      'A hand-drawn coloured line-graph plate on a deep charcoal (#121316) background, muted earthy palette, no glow or neon, no 3D. Three overlapping curves (3d, 4d, 5d series) of melting point (y-axis, "M.p./10³ K", roughly 1 to 4) versus atomic number (x-axis), each curve rising to a hump near the middle of its series and falling off at both ends. The 5d curve (W, Re highest) sits on top peaking near W; the 3d curve lowest with a clear dip at Mn. Element labels (Ti, V, Cr, Mn, Fe…; Zr, Nb, Mo…; Hf, Ta, W, Re, Os…) along the curves. Chalk-and-coloured-pencil style. Landscape.',
      '16:9',
      'Fig. 8.1 — Trends in melting points of transition elements: a maximum near the middle of each series, with Mn (and Tc) as anomalies.'
    ),
    h.img(
      'A hand-drawn coloured line-graph plate on a deep charcoal (#121316) background, muted earthy palette, no glow or neon, no 3D. Three labelled curves (Series 1, Series 2, Series 3) of enthalpy of atomisation (y-axis, "ΔH /kJ mol⁻¹", roughly 0 to 900) versus atomic number (x-axis). Each curve rises to a broad maximum about the middle and falls at the ends; Series 3 (top) peaks highest, Series 1 (bottom) lowest with a dip near Mn. Chalk-and-coloured-pencil style. Landscape.',
      '16:9',
      'Fig. 8.2 — Trends in enthalpies of atomisation of transition elements: maxima at the middle of each series (one unpaired electron per d orbital favours strong bonding).'
    ),

    h.text(
      'Since the enthalpy of atomisation is an important factor in determining the standard electrode potential of a metal, metals with very high enthalpy of atomisation (i.e., very high boiling point) tend to be noble in their reactions. Another generalisation that may be drawn is that the metals of the second and third series have greater enthalpies of atomisation than the corresponding elements of the first series; this is an important factor in accounting for the occurrence of much more frequent metal–metal bonding in compounds of the heavy transition metals.'
    ),

    h.callout('exam_tip', 'Exam Point — read the melting-point curve like a hill',
      'Picture each series as a **hill that peaks in the middle**:\n\n' +
      '- **Maximum melting point near $d^5$** — the most unpaired $d$ electrons → strongest metallic bonding.\n' +
      '- **Mn and Tc dip below the curve** — these are the named anomalies (Mn\'s half-filled $d^5$ resists pooling its electrons into the metallic bond).\n' +
      '- **Zn, Cd, Hg are low-melting and soft** — their $d^{10}$ shell contributes nothing to bonding, so only the two $s$ electrons hold the lattice. Hg is even liquid at room temperature.\n\n' +
      'The $5d$ series (W, Re) tops every curve — which is why the metals of the heavy series form so much metal–metal bonding.'),

    h.worked('NCERT Example 8.2', 'solved_example',
      'Why do the transition elements exhibit higher enthalpies of atomisation?',
      'Because of large number of unpaired electrons in their atoms they have stronger interatomic interaction and hence stronger bonding between atoms resulting in higher enthalpies of atomisation.'),

    h.worked('NCERT In-text Question 8.2', 'ncert_intext',
      'In the series Sc ($Z = 21$) to Zn ($Z = 30$), the enthalpy of atomisation of zinc is the lowest, i.e., $126$ kJ mol⁻¹. Why?',
      'In zinc the $3d$ sub-shell is completely filled ($3d^{10}$), so the $d$ electrons are not available for metallic bonding — only the two $4s$ electrons take part. With no unpaired electrons to strengthen the interatomic interaction, the metallic bonding is the weakest in the series and the enthalpy of atomisation is the lowest ($126$ kJ mol⁻¹).'),

    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT pairs a **fact** with its **reason**, and examiners lift that pair into an **Assertion–Reason** question:\n\n' +
      '> **NCERT (fact):** *"In any row the melting points of these metals rise to a maximum at $d^5$ … and fall regularly as the atomic number increases."*\n' +
      '> **NCERT (reason):** *"The maxima at about the middle of each series indicate that one unpaired electron per $d$ orbital is particularly favourable for strong interatomic interaction."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** The melting points of the transition metals reach a maximum about the middle of each series (around $d^5$).\n' +
      '- **Reason (R):** Near the middle there is one unpaired electron per $d$ orbital, giving the maximum number of electrons for strong interatomic (metallic) bonding.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** when NCERT pairs a *trend* with the *electron-count reason* behind it, that is a ready-made A–R question — A = the trend, R = the electron-count cause.'),

    h.recap([
      { label: 'Metallic character', text: 'High tensile strength, ductility, malleability, high thermal/electrical conductivity and lustre — typical metals.' },
      { label: 'Structures', text: 'Most adopt bcc, hcp or ccp lattices — **except Zn, Cd, Hg and Mn**, which take an X (a typical metal) structure.' },
      { label: 'Melting point trend', text: 'Rises to a **maximum at $d^5$** in each row (most unpaired $d$ electrons → strongest bonding), then falls; **Mn and Tc are anomalies**.' },
      { label: 'Atomisation enthalpy', text: 'Maximum near the middle (one unpaired electron per $d$ orbital). The **2nd & 3rd series exceed the 1st**, favouring metal–metal bonding.' },
      { label: 'Zinc the loner', text: 'Zn is $3d^{10}$ — no $d$ electrons for bonding, so its enthalpy of atomisation is the **lowest** ($126$ kJ mol⁻¹) and it is soft/low-melting.' },
    ]),

    h.quiz([
      {
        question: 'In each transition series the melting points rise to a maximum at which configuration before falling off?',
        options: ['$d^1$', '$d^5$', '$d^{10}$', '$d^3$'],
        correct_index: 1,
        explanation: 'The maximum sits around $d^5$, where the number of unpaired $d$ electrons (and hence electrons available for metallic bonding) is greatest. $d^{10}$ (e.g. Zn) gives the weakest bonding and lowest melting point.',
      },
      {
        question: 'Among the first-series transition metals, which has the LOWEST enthalpy of atomisation and why?',
        options: [
          'Chromium, because of its half-filled $3d^5$ sub-shell',
          'Manganese, because it lies in the middle of the series',
          'Zinc, because its $3d^{10}$ shell contributes no electrons to metallic bonding',
          'Scandium, because it has only one $3d$ electron',
        ],
        correct_index: 2,
        explanation: 'Zn has the lowest value ($126$ kJ mol⁻¹): with a filled $3d^{10}$ shell only the two $4s$ electrons bond, giving the weakest interatomic interaction. Cr, with the most unpaired electrons, has a high (not low) value.',
      },
      {
        question: 'According to NCERT, which set of metals does NOT adopt one of the typical metallic (bcc/hcp/ccp) structures?',
        options: [
          'Sc, Ti, V and Cr',
          'Fe, Co, Ni and Cu',
          'Zn, Cd, Hg and Mn',
          'Y, Zr, Nb and Mo',
        ],
        correct_index: 2,
        explanation: 'NCERT explicitly names Zn, Cd, Hg and Mn as the exceptions whose structure is marked X (a typical metal structure). The other listed metals do take recognisable bcc/hcp/ccp lattices.',
      },
      {
        question: 'Why do the metals of the second and third transition series form metal–metal bonds more often than those of the first series?',
        options: [
          'They have smaller atomic radii',
          'They have greater enthalpies of atomisation than the corresponding first-series elements',
          'They are all radioactive',
          'Their $d$ orbitals are completely filled',
        ],
        correct_index: 1,
        explanation: 'NCERT links the more frequent metal–metal bonding of the heavy transition metals to their greater enthalpies of atomisation compared with the matching first-series elements. Radius is not the stated cause, and their $d$ orbitals are partly filled.',
      },
      {
        question: 'Assertion (A): The enthalpy of atomisation is greatest near the middle of each transition series.\nReason (R): Around the middle there is roughly one unpaired electron per $d$ orbital, which favours strong interatomic bonding.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'NCERT directly attributes the mid-series maximum to having one unpaired electron per $d$ orbital, which strengthens the metallic bonding — so both are true and R explains A.',
      },
      {
        question: 'The high melting and boiling points of transition metals are attributed mainly to:',
        options: [
          'the involvement of $(n-1)d$ electrons in addition to $ns$ electrons in metallic bonding',
          'the inert pair effect',
          'their completely filled $d$ orbitals',
          'weak van der Waals forces between the atoms',
        ],
        correct_index: 0,
        explanation: 'NCERT attributes the high melting points to the participation of the inner $(n-1)d$ electrons alongside the $ns$ electrons in the metallic bond — more bonding electrons means stronger, higher-melting metals. The inert pair effect is a p-block idea, and filled $d$ shells (Zn) actually lower the melting point.',
      },
    ], 0.6),
  ],
};
