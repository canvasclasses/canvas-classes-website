// Ch.5 (d- & f-Block) · Page 6 · Oxidation States (NCERT §8.3.4) — PILOT PAGE.
// NCERT content transcribed faithfully (same language/equations/numbers);
// enrichment from the founder's notes is confined to the "Exam Point" callouts.
// Showcases the two new devices for this chapter:
//   • "🔍 Decode This" — turns an NCERT statement+reason pair into an
//     assertion-reason exam question (teaches reading between the lines).
//   • "🏛️ Exam Vault" — a real, answer-verified JEE Main 2024 PYQ (DNF-003 in
//     the Crucible bank) shown next to the NCERT line it comes from.
// Ends with a Quick Recap + a textbook quiz in real exam formats (incl. A–R).
module.exports = {
  page_number: 5,
  chapter: 5,
  slug: 'oxidation-states',
  title: 'Oxidation States',
  subtitle: 'Why a transition metal shows so many oxidation states, why Manganese reaches all of them (+2 to +7), and how every line of this NCERT page becomes an exam question.',
  tags: ['d-block', 'transition-metals', 'oxidation-states', 'manganese', 'high-yield'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: a vertical "oxidation-state ladder" for manganese, with rungs labelled +2, +3, +4, +5, +6, +7 climbing upward, each rung tinted a different muted colour (pale pink at +2 rising to deep violet at +7), and a small purple test tube of KMnO4 sitting at the top rung. To the side, the first transition series Sc to Zn drawn as a faint row, with the middle (Mn) highlighted. Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Manganese climbs the whole ladder — every oxidation state from +2 to +7.'
    ),

    h.text(
      'One of the notable features of a transition element is the great variety of oxidation states it may show in its compounds. Table 8.3 lists the common oxidation states of the first row transition elements.'
    ),

    h.table(
      ['Element', 'Oxidation states observed', 'Most common'],
      [
        ['Sc', '+3', '+3'],
        ['Ti', '+2, +3, +4', '+4'],
        ['V', '+2, +3, +4, +5', '+5'],
        ['Cr', '+2, +3, +4, +5, +6', '+3, +6'],
        ['Mn', '+2, +3, +4, +5, +6, +7', '+2, +7'],
        ['Fe', '+2, +3, +4, +5, +6', '+2, +3'],
        ['Co', '+2, +3, +4', '+2, +3'],
        ['Ni', '+2, +3, +4', '+2'],
        ['Cu', '+1, +2', '+2'],
        ['Zn', '+2', '+2'],
      ],
      'Table 8.3 — Oxidation states of the first row transition metals (the most common ones are shown in the last column).'
    ),

    h.heading('Why so many — and why Manganese reaches them all', 'Explain why the number of oxidation states is greatest in the middle of the 3d series and least at the two ends.'),
    h.text(
      'The elements which give the greatest number of oxidation states occur in or near the middle of the series. **Manganese, for example, exhibits all the oxidation states from +2 to +7.** The lesser number of oxidation states at the extreme ends stems from either too few electrons to lose or share (Sc, Ti) or too many $d$ electrons (hence fewer orbitals available in which to share electrons with others) for higher valence (Cu, Zn).\n\n' +
      'Thus, early in the series scandium(II) is virtually unknown and titanium(IV) is more stable than Ti(III) or Ti(II). At the other end, the only oxidation state of zinc is +2 (no $d$ electrons are involved).'
    ),

    h.callout('exam_tip', 'Exam Point — the "s + d electrons" shortcut for the highest oxidation state',
      'Up to manganese, the **maximum oxidation state of reasonable stability equals the total number of $4s + 3d$ electrons**:\n\n' +
      '- Sc ($3d^1 4s^2$) → **+3**\n' +
      '- Ti ($3d^2 4s^2$) → **+4** (as in $\\ce{TiO2}$)\n' +
      '- V ($3d^3 4s^2$) → **+5** (as in $\\ce{VO2+}$)\n' +
      '- Cr ($3d^5 4s^1$) → **+6** (as in $\\ce{CrO4^{2-}}$)\n' +
      '- Mn ($3d^5 4s^2$) → **+7** (as in $\\ce{MnO4-}$)\n\n' +
      'After Mn the stability of higher states drops abruptly, so the typical species become $\\ce{Fe^{II,III}}$, $\\ce{Co^{II,III}}$, $\\ce{Ni^{II}}$, $\\ce{Cu^{II}}$.'),

    h.text(
      'The variability of oxidation states, a characteristic of transition elements, arises out of incomplete filling of $d$ orbitals in such a way that their oxidation states differ from each other by **unity**, e.g., $\\ce{V^{II}}$, $\\ce{V^{III}}$, $\\ce{V^{IV}}$, $\\ce{V^{V}}$. This is in contrast with the variability of oxidation states of non-transition (p-block) elements, where oxidation states normally differ by **a unit of two**.'
    ),
    h.text(
      'An interesting feature is noticed among the groups (groups 4 through 10). Although in the p-block the lower oxidation states are favoured by the heavier members (due to the inert pair effect), the **opposite is true in the groups of the d-block.** For example, in group 6, Mo(VI) and W(VI) are found to be more stable than Cr(VI). Thus Cr(VI), in the form of dichromate in acidic medium, is a strong oxidising agent, whereas $\\ce{MoO3}$ and $\\ce{WO3}$ are not.'
    ),
    h.text(
      'Low oxidation states are found when a complex compound has ligands capable of accepting electron density from the metal (π-acceptor ligands such as carbon monoxide). For example, in $\\ce{Ni(CO)4}$ and $\\ce{Fe(CO)5}$, the oxidation state of nickel and iron is **zero**.'
    ),

    h.worked('NCERT Example 8.3', 'solved_example',
      'Name a transition element which does not exhibit variable oxidation states.',
      'Scandium ($Z = 21$) does not exhibit variable oxidation states — it shows only +3 (losing its single $3d$ electron together with the two $4s$ electrons gives the noble-gas-like $\\ce{Sc^{3+}}$).'),
    h.worked('NCERT In-text Question 8.3', 'ncert_intext',
      'Which of the 3d series of the transition metals exhibits the largest number of oxidation states and why?',
      'Manganese ($Z = 25$, $[\\ce{Ar}]\\,3d^5 4s^2$) exhibits the largest number of oxidation states. Its atom has the maximum number of electrons available for bonding (five $3d$ + two $4s$ = seven), so it shows every state from +2 to +7.'),

    // ── NEW DEVICE: the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"Manganese exhibits all the oxidation states from +2 to +7."*\n' +
      '> **NCERT (reason):** *"The elements which give the greatest number of oxidation states occur in or near the middle of the series."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Manganese shows the maximum number of oxidation states (+2 to +7) in the 3d series.\n' +
      '- **Reason (R):** Mn lies in the middle of the series, where the maximum number of $(3d + 4s)$ electrons are available for bonding.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** whenever NCERT says *"X happens **because** Y"*, read it as a ready-made Assertion–Reason question — A = X, R = Y. That single habit cracks most inorganic A–R questions.'),

    // ── NEW DEVICE: a real PYQ next to the NCERT line it came from ──
    h.worked('🏛️ Exam Vault · JEE Main 2024 (PYQ)', 'solved_example',
      'The metal that shows highest and maximum number of oxidation states is:\n\n(1) Fe  (2) Mn  (3) Co  (4) Ti',
      '**Answer: (2) Mn.** Manganese is $[\\ce{Ar}]\\,3d^5 4s^2$, so it has **7** electrons ($5 + 2$) available for bonding and shows every state from **+2 to +7** — the widest range in the 3d series (the +7 appears in $\\ce{KMnO4}$). Fe shows up to +6, Ti up to +4, Co up to +3.\n\n' +
      '**Notice:** this is NCERT\'s highlighted sentence, almost word for word — *"Manganese exhibits all the oxidation states from +2 to +7"*. Learn the NCERT line and you have already answered the exam.'),

    h.recap([
      { label: 'The pattern', text: 'Most oxidation states appear in the **middle** of the series — Mn reaches +2 to +7; fewest at the ends (Sc only +3, Zn only +2).' },
      { label: 'Highest state', text: 'Up to Mn, the maximum O.S. = number of $(3d + 4s)$ electrons → Sc +3, Ti +4, V +5, Cr +6, Mn +7. After Mn it falls off sharply.' },
      { label: 'Where it shows', text: 'High oxidation states appear in **oxides, oxoanions and fluorides** — $\\ce{MnO4-}$, $\\ce{CrO4^{2-}}$, $\\ce{Cr2O7^{2-}}$.' },
      { label: 'Steps of one', text: 'Transition-metal oxidation states differ by **one** unit ($\\ce{V^{II}}$,$\\ce{V^{III}}$,$\\ce{V^{IV}}$,$\\ce{V^{V}}$) — p-block elements differ by two.' },
      { label: 'Down a group', text: 'Heavier members favour the **higher** state — Mo(VI), W(VI) are more stable than Cr(VI). Opposite of the p-block inert-pair effect.' },
      { label: 'Zero state', text: '$\\ce{Ni(CO)4}$ and $\\ce{Fe(CO)5}$ — the metal is in the **0** oxidation state (with π-acceptor CO ligands).' },
    ]),

    h.quiz([
      {
        question: 'Which metal of the first transition series exhibits the maximum number of oxidation states (+2 to +7)?',
        options: ['Manganese', 'Iron', 'Chromium', 'Vanadium'],
        correct_index: 0,
        explanation: 'Mn is $3d^5 4s^2$, so all 7 outer electrons can take part in bonding, giving every state from +2 to +7 — the widest range in the series. Cr reaches +6, V +5, Fe +6.',
      },
      {
        question: 'The highest oxidation state of chromium (as in $\\ce{CrO4^{2-}}$ and $\\ce{Cr2O7^{2-}}$) is +6 because:',
        options: [
          'chromium has six unpaired electrons in the ground state',
          'the total number of its $3d$ and $4s$ electrons available for bonding is six',
          'the inert pair effect stabilises the +6 state',
          'oxygen forces a +6 state on every metal it binds',
        ],
        correct_index: 1,
        explanation: 'Up to manganese the maximum oxidation state equals the number of $(3d + 4s)$ electrons. Cr is $3d^5 4s^1$ → 6 electrons → +6. It is not about unpaired electrons, and the inert pair effect is a p-block idea.',
      },
      {
        question: 'Which of the following statements about oxidation states in the 3d series is correct?',
        options: [
          'Scandium shows a wide range of oxidation states like manganese',
          'Zinc shows +2, +4 and +6 in its common compounds',
          'Zinc shows only +2 because no $d$ electrons are involved',
          'Titanium(II) is more stable than titanium(IV)',
        ],
        correct_index: 2,
        explanation: 'Zn ($3d^{10} 4s^2$) loses only its two $4s$ electrons, so the only oxidation state is +2. Sc shows just +3, and Ti(IV) is actually more stable than Ti(II)/Ti(III).',
      },
      {
        question: 'Assertion (A): Mo(VI) and W(VI) are more stable than Cr(VI).\nReason (R): On moving down a group of the d-block, the higher oxidation states become more stable.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both statements are true and R explains A: unlike the p-block (inert pair effect), heavier d-block members favour higher oxidation states, so the group-6 order of stability is Cr(VI) < Mo(VI) < W(VI).',
      },
      {
        question: 'In the complex $\\ce{Ni(CO)4}$, the oxidation state of nickel is:',
        options: ['0', '+2', '+4', '−2'],
        correct_index: 0,
        explanation: 'CO is a neutral π-acceptor ligand, so it contributes no charge; the overall complex is neutral, leaving nickel in the 0 oxidation state. The same is true of iron in $\\ce{Fe(CO)5}$.',
      },
      {
        question: 'The oxidation states of a transition metal usually differ from one another by:',
        options: ['two units', 'one unit', 'three units', 'half a unit'],
        correct_index: 1,
        explanation: 'Because the $d$ orbitals fill one electron at a time, transition-metal oxidation states differ by one (e.g., $\\ce{V^{II}}$,$\\ce{V^{III}}$,$\\ce{V^{IV}}$,$\\ce{V^{V}}$). p-block oxidation states typically differ by two.',
      },
    ], 0.6),
  ],
};
