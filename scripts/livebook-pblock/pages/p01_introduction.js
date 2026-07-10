// Ch.4 (p-Block) · Page 1 · The p-Block Elements (chapter intro, NCERT Unit 7 opener).
// Lighter orientation page: hero img → NCERT intro text (groups 13–18 recap,
// ns²np¹⁻⁶ valence config) → optional periodic-table-builder sim → a short
// road-map of what's ahead (Groups 15–18) → Quick Recap → 3 short orientation Qs.
// NCERT content transcribed faithfully; no Examples / In-text Questions fall here.
module.exports = {
  page_number: 1,
  chapter: 4,
  slug: 'p-block-introduction',
  title: 'The p-Block Elements',
  subtitle: 'A quick orientation to the p-block — groups 13 to 18, the ns²np¹⁻⁶ valence shell, and the four families (15–18) this chapter explores.',
  tags: ['p-block', 'introduction', 'periodic-table', 'groups-15-18'],
  reading_time_min: 5,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A stylised periodic table with the right-hand p-block (groups 13 to 18) highlighted as a glowing-but-muted column band, the s-block on the far left and the d/f-block in the middle drawn faintly. Small labels float beside the highlighted block: "metals, metalloids and non-metals — all three". Textbook plate style, landscape, desktop-friendly.',
      '16:9',
      'The p-block — the only block of the periodic table that holds metals, metalloids and non-metals together.'
    ),

    h.text(
      'In Class XI, you learnt that the **$p$-block elements** are placed in **groups 13 to 18** of the periodic table. Their valence shell electronic configuration is $ns^2np^{1-6}$ (except He, which has a $1s^2$ configuration). The properties of $p$-block elements, like those of others, are greatly influenced by **atomic sizes, ionisation enthalpy, electron gain enthalpy and electronegativity**.\n\n' +
      'The absence of $d$-orbitals in the second period and the presence of $d$ and/or $f$ orbitals in heavier elements (starting from the third period onwards) have significant effects on the properties of these elements. In addition, the presence of all the three types of elements — **metals, metalloids and non-metals** — brings diversification in the chemistry of these elements.'
    ),

    h.text(
      'Having learnt the chemistry of the elements of **Groups 13 and 14** of the $p$-block in Class XI, in this Unit you will learn the chemistry of the elements of the **subsequent groups — 15, 16, 17 and 18**.'
    ),

    h.sim('periodic-table-builder', 'Build the p-block — place the groups 13 to 18',
      {
        prompt: 'How many electrons can the valence p-subshell of a p-block element hold in total?',
        options: ['Up to 2', 'Up to 6', 'Up to 10'],
        reveal_after: true,
      }),

    h.heading('What lies ahead — the four families', 'Preview the four groups studied in this chapter and their defining members.'),
    h.text(
      'This chapter walks through the right-hand families of the $p$-block, one group at a time:\n\n' +
      '- **Group 15 — the nitrogen family:** nitrogen, phosphorus, arsenic, antimony, bismuth. We study dinitrogen, ammonia, the oxides of nitrogen, nitric acid, and the chemistry of phosphorus.\n' +
      '- **Group 16 — the oxygen family (chalcogens):** oxygen, sulphur, selenium, tellurium, polonium — dioxygen, ozone, sulphur and sulphuric acid.\n' +
      '- **Group 17 — the halogens:** fluorine, chlorine, bromine, iodine, astatine — chlorine, hydrogen chloride, and the oxoacids and interhalogen compounds.\n' +
      '- **Group 18 — the noble gases:** helium, neon, argon, krypton, xenon, radon — including the surprising compounds of xenon.'
    ),
    h.callout('exam_tip', 'Exam Point — why the p-block is special',
      '- It is the **only block** that contains metals, metalloids *and* non-metals together — so it shows the widest variety of chemistry.\n' +
      '- The **second-period elements** (N, O, F) have **no $d$-orbitals**, which is the root cause of nearly every "anomalous behaviour" question in this chapter.\n' +
      '- Down each group the trends are driven by **atomic size, ionisation enthalpy, electron gain enthalpy and electronegativity** — keep these four levers in mind throughout.'),

    h.recap([
      { label: 'Where', text: 'The $p$-block = **groups 13 to 18**, the right-hand side of the periodic table.' },
      { label: 'Valence config', text: '$ns^2np^{1-6}$ (He is the exception, with $1s^2$).' },
      { label: 'What makes it diverse', text: 'It holds **metals, metalloids and non-metals** together; properties are set by atomic size, ionisation enthalpy, electron gain enthalpy and electronegativity.' },
      { label: 'This chapter', text: 'Covers **Groups 15, 16, 17 and 18** (you already did 13 and 14 in Class XI).' },
    ]),

    h.quiz([
      {
        question: 'The p-block of the periodic table consists of:',
        options: ['groups 1 to 2', 'groups 3 to 12', 'groups 13 to 18', 'the lanthanides and actinides'],
        correct_index: 2,
        explanation: 'The $p$-block elements are placed in groups 13 to 18 of the periodic table.',
      },
      {
        question: 'The general valence-shell electronic configuration of the p-block elements (helium excepted) is:',
        options: ['ns²np¹⁻⁶', 'ns¹⁻²', 'ns²np⁷', '(n-1)d¹⁻¹⁰ns²'],
        correct_index: 0,
        explanation: 'Their valence shell configuration is $ns^2np^{1-6}$; helium is the lone exception with $1s^2$.',
      },
      {
        question: 'Which families are studied in this Unit on the p-block elements?',
        options: ['Groups 1, 2, 13 and 14', 'Groups 15, 16, 17 and 18', 'Only the noble gases', 'The transition metals'],
        correct_index: 1,
        explanation: 'Groups 13 and 14 were covered in Class XI; this Unit covers the subsequent groups — 15, 16, 17 and 18.',
      },
    ], 0.6),
  ],
};
