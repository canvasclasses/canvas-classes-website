// Ch.5 (d- & f-Block) · Page 13 · Oxides and Oxoanions of Metals (NCERT §8.4.1).
// NCERT content transcribed faithfully (same language/equations/numbers/table);
// enrichment from the founder's notes is confined to the "Exam Point" callouts.
// Carries the two chapter devices: "🔍 Decode This" (statement→reason→A-R) and
// (no clean Exam Vault PYQ for this sub-section — Decode This is mandatory,
// Exam Vault is optional). Ends with a Quick Recap + a textbook quiz.
module.exports = {
  page_number: 13,
  chapter: 5,
  slug: 'oxides-oxoanions',
  title: 'Oxides and Oxoanions of Metals',
  subtitle: 'Why the highest oxide number climbs from Sc₂O₃ to Mn₂O₇, why rising oxidation number makes an oxide more covalent (Mn₂O₇ is a green oil!), and how an acidic–basic–amphoteric pattern hides inside one table.',
  tags: ['d-block', 'transition-metals', 'oxides', 'oxoanions', 'manganese', 'chromium'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon, no 3D. Central motif: a horizontal shelf of small labelled oxide jars rising in oxidation number from left to right — a pale powdery "Sc2O3" jar at +3 on the left, climbing through "TiO2", "V2O5", "CrO3", up to a dark covalent green oil drop labelled "Mn2O7" at +7 on the right, with a small arrow above reading "ionic → covalent as O.N. rises". Faint tag lines: "CrO basic", "Cr2O3 amphoteric", "V2O5 amphoteric". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'As the metal climbs in oxidation number, its oxide turns from an ionic powder into a covalent green oil.'
    ),

    h.text(
      'These oxides are generally formed by the reaction of metals with oxygen at high temperatures. All the metals except scandium form $\\ce{MO}$ oxides which are ionic. **The highest oxidation number in the oxides, coincides with the group number and is attained in $\\ce{Sc2O3}$ to $\\ce{Mn2O7}$.** Beyond group 7, no higher oxides of iron above $\\ce{Fe2O3}$ are known. Besides the oxides, the oxocations stabilise $\\ce{V^{V}}$ as $\\ce{VO2+}$, $\\ce{V^{IV}}$ as $\\ce{VO^{2+}}$ and $\\ce{Ti^{IV}}$ as $\\ce{TiO^{2+}}$.'
    ),

    h.heading('How the oxides change character', 'Explain why rising oxidation number makes a metal oxide more covalent and shifts it from basic toward acidic/amphoteric.'),
    h.text(
      '**As the oxidation number of a metal increases, ionic character decreases.** In the case of Mn, $\\ce{Mn2O7}$ is a covalent green oil. Even $\\ce{CrO3}$ and $\\ce{V2O5}$ have low melting points. In these higher oxides, the acidic character is predominant.'
    ),
    h.text(
      'Thus, $\\ce{Mn2O7}$ gives $\\ce{HMnO4}$ and $\\ce{CrO3}$ gives $\\ce{H2CrO4}$ and $\\ce{H2Cr2O7}$. $\\ce{V2O5}$ is, however, amphoteric though mainly acidic and it gives $\\ce{VO4^{3-}}$ as well as $\\ce{VO2+}$ salts. In vanadium there is gradual change from the basic $\\ce{V2O3}$ to less basic $\\ce{V2O4}$ and to amphoteric $\\ce{V2O5}$. $\\ce{V2O4}$ dissolves in acids to give $\\ce{VO^{2+}}$ salts. Similarly, $\\ce{V2O5}$ reacts with alkalies as well as acids to give $\\ce{VO4^{3-}}$ and $\\ce{VO2+}$ respectively. The well characterised CrO is basic but $\\ce{Cr2O3}$ is amphoteric.'
    ),

    h.table(
      ['O.N.', 'Gp 3', 'Gp 4', 'Gp 5', 'Gp 6', 'Gp 7', 'Gp 8', 'Gp 9', 'Gp 10', 'Gp 11', 'Gp 12'],
      [
        ['+7', '', '', '', '', '$\\ce{Mn2O7}$', '', '', '', '', ''],
        ['+6', '', '', '', '$\\ce{CrO3}$', '', '', '', '', '', ''],
        ['+5', '', '', '$\\ce{V2O5}$', '', '', '', '', '', '', ''],
        ['+4', '', '$\\ce{TiO2}$', '$\\ce{V2O4}$', '$\\ce{CrO2}$', '$\\ce{MnO2}$', '', '', '', '', ''],
        ['+3', '$\\ce{Sc2O3}$', '$\\ce{Ti2O3}$', '$\\ce{V2O3}$', '$\\ce{Cr2O3}$', '$\\ce{Mn2O3}$, $\\ce{Mn3O4}$*', '$\\ce{Fe2O3}$, $\\ce{Fe3O4}$*', '$\\ce{Co3O4}$*', '', '', ''],
        ['+2', '', 'TiO', 'VO', '(CrO)', 'MnO', 'FeO', 'CoO', 'NiO', 'CuO', 'ZnO'],
        ['+1', '', '', '', '', '', '', '', '', '$\\ce{Cu2O}$', ''],
      ],
      'Table 8.6 — Oxides of 3d metals, arranged by oxidation number (rows) and group (columns). * marks mixed oxides. The highest oxide rises step-by-step from $\\ce{Sc2O3}$ (+3) up to $\\ce{Mn2O7}$ (+7).'
    ),

    h.callout('exam_tip', 'Exam Point — read the table as three diagonal bands',
      'Table 8.6 hides a clean pattern examiners love:\n\n' +
      '- **The top-right corner** ($\\ce{Mn2O7}$, $\\ce{CrO3}$, $\\ce{V2O5}$) holds the **high oxidation numbers** → **covalent, low-melting, acidic** oxides.\n' +
      '- **The bottom-left to bottom-right floor** ($\\ce{MnO}$, $\\ce{FeO}$, $\\ce{CuO}$, $\\ce{ZnO}$) holds the **low oxidation numbers** → **ionic, basic** oxides.\n' +
      '- **The middle** ($\\ce{Cr2O3}$, $\\ce{V2O5}$, $\\ce{Al-like}$) is where **amphoteric** behaviour shows up.\n\n' +
      'One sentence to carry it all: *"As O.N. rises, the oxide goes ionic-and-basic → amphoteric → covalent-and-acidic."*'),

    h.worked('NCERT Example 8.9', 'solved_example',
      'What is meant by ‘disproportionation’ of an oxidation state? Give an example.',
      'When a particular oxidation state becomes less stable relative to other oxidation states, one higher, one lower, it is said to undergo **disproportionation**. For example, manganese(VI) becomes unstable relative to manganese(VII) and manganese(IV) in acidic solution:\n\n' +
      '$$\\ce{3MnO4^{2-} + 4H+ -> 2MnO4^{-} + MnO2 + 2H2O}$$\n\n' +
      'Here the $\\ce{Mn^{VI}}$ in $\\ce{MnO4^{2-}}$ splits: some Mn goes **up** to $\\ce{Mn^{VII}}$ (in $\\ce{MnO4-}$) and some goes **down** to $\\ce{Mn^{IV}}$ (in $\\ce{MnO2}$) — the same element ending in two different oxidation states.'),

    // ── DEVICE: the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"$\\ce{Mn2O7}$ is a covalent green oil... in these higher oxides, the acidic character is predominant."*\n' +
      '> **NCERT (reason):** *"As the oxidation number of a metal increases, ionic character decreases."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** $\\ce{Mn2O7}$ (Mn in +7) is a covalent, low-melting, acidic oxide.\n' +
      '- **Reason (R):** As the oxidation number of a metal increases, the ionic character of its oxide decreases.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** whenever NCERT says *"X happens **because** Y"*, read it as a ready-made Assertion–Reason question — A = X, R = Y. The single line *"O.N. up → ionic character down"* answers a whole family of these.'),

    h.recap([
      { label: 'How they form', text: 'Metal + $\\ce{O2}$ at high temperature. All metals except Sc form ionic $\\ce{MO}$ oxides.' },
      { label: 'Highest oxide', text: 'The highest oxidation number in the oxides **equals the group number**, attained from $\\ce{Sc2O3}$ (+3) up to $\\ce{Mn2O7}$ (+7). Beyond group 7 no oxide higher than $\\ce{Fe2O3}$ is known.' },
      { label: 'The key rule', text: '**As oxidation number rises, ionic character falls.** $\\ce{Mn2O7}$ is a covalent green oil; $\\ce{CrO3}$ and $\\ce{V2O5}$ are low-melting — all acidic.' },
      { label: 'Acid–base character', text: 'CrO is **basic**, $\\ce{Cr2O3}$ is **amphoteric**; $\\ce{V2O5}$ is **amphoteric** (mainly acidic); $\\ce{Mn2O7}$→$\\ce{HMnO4}$ and $\\ce{CrO3}$→$\\ce{H2CrO4}$/$\\ce{H2Cr2O7}$ are acidic.' },
      { label: 'Disproportionation', text: '$\\ce{Mn^{VI}}$ is unstable in acid: $\\ce{3MnO4^{2-} + 4H+ -> 2MnO4^{-} + MnO2 + 2H2O}$ — Mn goes both up (+7) and down (+4).' },
    ]),

    h.quiz([
      {
        question: 'In the oxides of the 3d metals, the highest oxidation number coincides with the group number and is attained in the range:',
        options: [
          '$\\ce{TiO2}$ to $\\ce{Fe2O3}$',
          '$\\ce{Sc2O3}$ to $\\ce{Mn2O7}$',
          '$\\ce{V2O5}$ to $\\ce{Cu2O}$',
          '$\\ce{CrO3}$ to $\\ce{ZnO}$',
        ],
        correct_index: 1,
        explanation: 'NCERT states the highest oxide number coincides with the group number and is attained from $\\ce{Sc2O3}$ (+3, group 3) up to $\\ce{Mn2O7}$ (+7, group 7). Beyond group 7 no oxide higher than $\\ce{Fe2O3}$ exists, so the other ranges do not capture this climb.',
      },
      {
        question: 'Why is $\\ce{Mn2O7}$ a covalent green oil rather than a hard ionic solid?',
        options: [
          'because manganese is the lightest 3d metal',
          'because oxygen always forms covalent oxides',
          'because as the oxidation number of the metal increases, the ionic character of the oxide decreases',
          'because $\\ce{Mn2O7}$ has fewer oxygen atoms than $\\ce{MnO}$',
        ],
        correct_index: 2,
        explanation: 'NCERT\'s rule is that ionic character falls as oxidation number rises. Mn in $\\ce{Mn2O7}$ is in its very high +7 state, so the oxide is strongly covalent — a low-melting green oil. The other options misstate the cause; $\\ce{MnO}$ (Mn in +2) is the ionic basic oxide.',
      },
      {
        question: 'Which statement about the acid–base nature of these oxides is correct?',
        options: [
          'CrO is amphoteric while $\\ce{Cr2O3}$ is basic',
          'CrO is basic while $\\ce{Cr2O3}$ is amphoteric',
          'both CrO and $\\ce{Cr2O3}$ are purely acidic',
          'both CrO and $\\ce{Cr2O3}$ are purely basic',
        ],
        correct_index: 1,
        explanation: 'NCERT states the well-characterised CrO (Cr in +2, lower O.N.) is **basic**, but $\\ce{Cr2O3}$ (Cr in +3, higher O.N.) is **amphoteric**. The rising oxidation number shifts the oxide away from purely basic — so the first option reverses the truth.',
      },
      {
        question: 'In the disproportionation $\\ce{3MnO4^{2-} + 4H+ -> 2MnO4^{-} + MnO2 + 2H2O}$, the manganese in $\\ce{MnO4^{2-}}$ (+6) ends up as:',
        options: [
          'only +7 (in $\\ce{MnO4-}$)',
          'only +4 (in $\\ce{MnO2}$)',
          'both +7 (in $\\ce{MnO4-}$) and +4 (in $\\ce{MnO2}$)',
          'only +2 (as $\\ce{Mn^{2+}}$)',
        ],
        correct_index: 2,
        explanation: 'Disproportionation means one oxidation state splits into a higher and a lower one. The +6 Mn goes partly up to +7 ($\\ce{MnO4-}$) and partly down to +4 ($\\ce{MnO2}$) — both at once. There is no $\\ce{Mn^{2+}}$ in this equation.',
      },
      {
        question: 'Assertion (A): $\\ce{CrO3}$ and $\\ce{V2O5}$ have low melting points and are mainly acidic.\nReason (R): In the higher oxides of the 3d metals the acidic, covalent character is predominant.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are NCERT statements and R explains A: in the higher oxides the acidic, covalent character dominates (ionic character falls as O.N. rises), which is exactly why $\\ce{CrO3}$ and $\\ce{V2O5}$ are low-melting and acidic.',
      },
      {
        question: 'Vanadium\'s oxides show a gradual change in character down the oxidation-number ladder. The correct order from most basic to amphoteric is:',
        options: [
          '$\\ce{V2O5}$ (basic) → $\\ce{V2O4}$ → $\\ce{V2O3}$ (amphoteric)',
          '$\\ce{V2O3}$ (basic) → $\\ce{V2O4}$ (less basic) → $\\ce{V2O5}$ (amphoteric)',
          'all three vanadium oxides are equally acidic',
          '$\\ce{V2O4}$ (basic) → $\\ce{V2O5}$ → $\\ce{V2O3}$ (amphoteric)',
        ],
        correct_index: 1,
        explanation: 'NCERT describes a gradual change from the basic $\\ce{V2O3}$ (V in +3) to less basic $\\ce{V2O4}$ (+4) to amphoteric $\\ce{V2O5}$ (+5) — basicity falls as the oxidation number rises, the same rule seen across the whole table.',
      },
    ], 0.6),
  ],
};
