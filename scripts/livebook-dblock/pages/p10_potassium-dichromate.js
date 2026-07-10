// Ch.5 (d- & f-Block) · Page 14 · Potassium Dichromate K2Cr2O7 (NCERT §8.4).
// HIGH-YIELD. Every preparation and oxidising half-reaction transcribed
// verbatim from NCERT (same language/equations/numbers). Enrichment confined
// to "Exam Point" callouts. Carries both chapter devices: "🔍 Decode This"
// (statement→reason→A-R) and "🏛️ Exam Vault" (a verified k2cr2o7 PYQ next to
// the NCERT line it comes from). Ends with a Quick Recap + a textbook quiz.
module.exports = {
  page_number: 10,
  chapter: 5,
  slug: 'potassium-dichromate',
  title: 'Potassium Dichromate K₂Cr₂O₇',
  subtitle: 'How orange K₂Cr₂O₇ is built from chromite ore, why a drop of acid or base flips chromate ⇌ dichromate (with chromium staying +6 throughout), and the half-reaction that makes it the exam-favourite oxidant.',
  tags: ['d-block', 'transition-metals', 'chromium', 'potassium-dichromate', 'oxidising-agent', 'high-yield'],
  reading_time_min: 8,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon, no 3D. Central motif: a flask of orange K2Cr2O7 crystals in the middle, with a left arrow to a pale yellow beaker labelled "chromate CrO4^2- (add OH-)" and a right arrow to an orange beaker labelled "dichromate Cr2O7^2- (add H+)", showing the pH see-saw. Below, a small chalk diagram of a tetrahedral chromate ion next to two tetrahedra sharing one corner (dichromate) with a faint "126 degrees" angle label at the Cr-O-Cr bridge. A small banner reads "Cr stays +6". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Add acid and it turns orange (dichromate); add base and it turns yellow (chromate) — but chromium never leaves +6.'
    ),

    h.text(
      'Potassium dichromate is a very important chemical used in leather industry and as an oxidant for preparation of many azo compounds. Dichromates are generally prepared from chromate, which in turn are obtained by the fusion of chromite ore ($\\ce{FeCr2O4}$) with sodium or potassium carbonate in free access of air. The reaction with sodium carbonate occurs as follows:'
    ),
    h.text(
      '$$\\ce{4FeCr2O4 + 8Na2CO3 + 7O2 -> 8Na2CrO4 + 2Fe2O3 + 8CO2}$$'
    ),
    h.text(
      'The yellow solution of sodium chromate is filtered and acidified with sulphuric acid to give a solution from which orange sodium dichromate, $\\ce{Na2Cr2O7.2H2O}$ can be crystallised.'
    ),
    h.text(
      '$$\\ce{2Na2CrO4 + 2H+ -> Na2Cr2O7 + 2Na+ + H2O}$$'
    ),
    h.text(
      'Sodium dichromate is more soluble than potassium dichromate. The latter is therefore, prepared by treating the solution of sodium dichromate with potassium chloride.'
    ),
    h.text(
      '$$\\ce{Na2Cr2O7 + 2KCl -> K2Cr2O7 + 2NaCl}$$'
    ),
    h.text(
      'Orange crystals of potassium dichromate crystallise out.'
    ),

    h.heading('Chromate ⇌ dichromate: a pH see-saw', 'Explain how chromate and dichromate interconvert with pH while chromium stays in the +6 state.'),
    h.text(
      'The chromates and dichromates are interconvertible in aqueous solution depending upon pH of the solution. **The oxidation state of chromium in chromate and dichromate is the same.**'
    ),
    h.text(
      '$$\\ce{2CrO4^{2-} + 2H+ -> Cr2O7^{2-} + H2O}$$\n\n' +
      '$$\\ce{Cr2O7^{2-} + 2OH- -> 2CrO4^{2-} + H2O}$$'
    ),

    h.img(
      'A hand-drawn coloured chemistry structure diagram on a deep charcoal (#121316) background, muted earthy palette (ochre for oxygen, dusty teal for chromium), no glow or neon, no 3D. Left: the chromate ion CrO4^2- drawn as a single tetrahedron — one central Cr atom bonded to four O atoms at the corners, labelled "Chromate ion (tetrahedral)". Right: the dichromate ion Cr2O7^2- drawn as TWO tetrahedra joined at one shared corner oxygen (Cr-O-Cr bridge), with the bridge angle clearly labelled "126 degrees" and a faint "Cr-O 163 pm / 179 pm" note. Labelled "Dichromate ion — two tetrahedra sharing a corner". Overall charge "2-" shown in square brackets around each. Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Chromate is one tetrahedron; dichromate is two tetrahedra sharing a corner O, with the Cr–O–Cr bridge bent at 126°.'
    ),
    h.text(
      'The structures of chromate ion, $\\ce{CrO4^{2-}}$ and the dichromate ion, $\\ce{Cr2O7^{2-}}$ are shown above. **The chromate ion is tetrahedral whereas the dichromate ion consists of two tetrahedra sharing one corner with Cr–O–Cr bond angle of 126°.**'
    ),

    h.heading('K₂Cr₂O₇ as an oxidising agent', 'Write the reduction half-reaction of dichromate in acid and the half-reactions of the species it oxidises.'),
    h.text(
      'Sodium and potassium dichromates are strong oxidising agents; the sodium salt has a greater solubility in water and is extensively used as an oxidising agent in organic chemistry. Potassium dichromate is used as a primary standard in volumetric analysis. In acidic solution, its oxidising action can be represented as follows:'
    ),
    h.text(
      '$$\\ce{Cr2O7^{2-} + 14H+ + 6e- -> 2Cr^{3+} + 7H2O} \\qquad (E^{\\ominus} = 1.33\\,\\text{V})$$'
    ),
    h.text(
      'Thus, acidified potassium dichromate will oxidise iodides to iodine, sulphides to sulphur, tin(II) to tin(IV) and iron(II) salts to iron(III). The half-reactions are noted below:'
    ),
    h.text(
      '$$\\ce{6I- -> 3I2 + 6e-}$$\n\n' +
      '$$\\ce{3Sn^{2+} -> 3Sn^{4+} + 6e-}$$\n\n' +
      '$$\\ce{3H2S -> 6H+ + 3S + 6e-}$$\n\n' +
      '$$\\ce{6Fe^{2+} -> 6Fe^{3+} + 6e-}$$'
    ),
    h.text(
      'The full ionic equation may be obtained by adding the half-reaction for potassium dichromate to the half-reaction for the reducing agent, for e.g., with iron(II):'
    ),
    h.text(
      '$$\\ce{Cr2O7^{2-} + 14H+ + 6Fe^{2+} -> 2Cr^{3+} + 6Fe^{3+} + 7H2O}$$'
    ),

    h.callout('exam_tip', 'Exam Point — the n-factor of K₂Cr₂O₇ is always 6',
      'In the acidic reduction $\\ce{Cr2O7^{2-} + 14H+ + 6e- -> 2Cr^{3+} + 7H2O}$, **two** Cr atoms each fall from +6 to +3, so the dichromate accepts **6 electrons** per formula unit.\n\n' +
      '- **n-factor of $\\ce{K2Cr2O7}$ = 6** → equivalent weight $= \\dfrac{M}{6}$.\n' +
      '- Remember the orange→green colour change: $\\ce{Cr2O7^{2-}}$ (orange) → $\\ce{Cr^{3+}}$ (green) signals the end-point.\n' +
      '- The "14 $\\ce{H+}$" tells you the medium **must be acidic** — this oxidation does not run in base.'),

    // ── DEVICE: the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"The chromates and dichromates are interconvertible in aqueous solution depending upon pH of the solution."*\n' +
      '> **NCERT (fact, highlighted):** *"The oxidation state of chromium in chromate and dichromate is the same."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Yellow $\\ce{CrO4^{2-}}$ turns to orange $\\ce{Cr2O7^{2-}}$ on adding acid, and back on adding base.\n' +
      '- **Reason (R):** The oxidation state of chromium changes from +3 to +6 during this interconversion.\n\n' +
      '**Answer:** A is **true**, but R is **false** — the interconversion is a pH-driven condensation; **chromium stays +6 in both** ions. So the correct option is *"A is true but R is false."*\n\n' +
      '**Your move:** when an A–R pairs a true observation with a tempting-but-wrong "oxidation state changes" reason, check the actual O.N. on both sides. Here both are +6 — the trap is assuming colour change means redox.'),

    // ── DEVICE: a real PYQ next to the NCERT line it came from ──
    h.worked('🏛️ Exam Vault · JEE Main 2023 (PYQ)', 'solved_example',
      'Potassium dichromate acts as a strong oxidizing agent in acidic solution. During this process, the oxidation state changes from:\n\n(1) +3 to +1  (2) +6 to +3  (3) +2 to +1  (4) +6 to +2',
      '**Answer: (2) +6 to +3.** In acid, dichromate is reduced by the NCERT half-reaction $\\ce{Cr2O7^{2-} + 14H+ + 6e- -> 2Cr^{3+} + 7H2O}$. Chromium in $\\ce{Cr2O7^{2-}}$ is **+6**; in $\\ce{Cr^{3+}}$ it is **+3** — a fall of 3 per Cr, 6 electrons total for the two Cr atoms. The orange solution turns green as $\\ce{Cr^{3+}}$ forms.\n\n' +
      '**Notice:** this is NCERT\'s exact oxidising half-reaction, $E^{\\ominus} = 1.33$ V. Learn that one line and you have already answered the exam.'),

    h.recap([
      { label: 'Source', text: 'Made from **chromite ore $\\ce{FeCr2O4}$**: roast with $\\ce{Na2CO3}$ + air → $\\ce{Na2CrO4}$ (yellow); acidify → $\\ce{Na2Cr2O7}$ (orange); then + KCl → $\\ce{K2Cr2O7}$.' },
      { label: 'The pH see-saw', text: 'Acid: $\\ce{2CrO4^{2-} + 2H+ -> Cr2O7^{2-} + H2O}$ (yellow→orange). Base: $\\ce{Cr2O7^{2-} + 2OH- -> 2CrO4^{2-} + H2O}$ (orange→yellow). **Cr stays +6 in both.**' },
      { label: 'Structure', text: 'Chromate $\\ce{CrO4^{2-}}$ is a single **tetrahedron**; dichromate $\\ce{Cr2O7^{2-}}$ is **two tetrahedra sharing a corner**, Cr–O–Cr angle **126°**.' },
      { label: 'Oxidising action', text: 'In acid: $\\ce{Cr2O7^{2-} + 14H+ + 6e- -> 2Cr^{3+} + 7H2O}$, $E^{\\ominus} = 1.33$ V. **n-factor = 6.**' },
      { label: 'What it oxidises', text: '$\\ce{I-}$→$\\ce{I2}$, $\\ce{Sn^{2+}}$→$\\ce{Sn^{4+}}$, $\\ce{H2S}$→S, $\\ce{Fe^{2+}}$→$\\ce{Fe^{3+}}$ (full: $\\ce{Cr2O7^{2-} + 14H+ + 6Fe^{2+} -> 2Cr^{3+} + 6Fe^{3+} + 7H2O}$).' },
    ]),

    h.quiz([
      {
        question: 'Potassium dichromate is finally obtained from sodium dichromate by treating it with KCl. Why is this final step needed at all?',
        options: [
          'because chromium changes oxidation state during the step',
          'because sodium dichromate is more soluble than potassium dichromate, so KCl is added to crystallise out the less-soluble $\\ce{K2Cr2O7}$',
          'because KCl reduces dichromate to chromate',
          'because $\\ce{Na2Cr2O7}$ cannot exist in the solid state',
        ],
        correct_index: 1,
        explanation: 'NCERT notes sodium dichromate is more soluble than potassium dichromate, so $\\ce{Na2Cr2O7 + 2KCl -> K2Cr2O7 + 2NaCl}$ lets the less-soluble orange $\\ce{K2Cr2O7}$ crystallise out. No redox occurs — chromium stays +6 throughout.',
      },
      {
        question: 'When acid is added to a yellow chromate solution it turns orange. The correct ionic equation and the oxidation state of Cr are:',
        options: [
          '$\\ce{2CrO4^{2-} + 2H+ -> Cr2O7^{2-} + H2O}$; Cr goes from +3 to +6',
          '$\\ce{2CrO4^{2-} + 2H+ -> Cr2O7^{2-} + H2O}$; Cr stays +6 in both ions',
          '$\\ce{Cr2O7^{2-} + 2OH- -> 2CrO4^{2-} + H2O}$; Cr stays +6 in both ions',
          '$\\ce{Cr2O7^{2-} + 14H+ + 6e- -> 2Cr^{3+} + 7H2O}$; Cr goes from +6 to +3',
        ],
        correct_index: 1,
        explanation: 'Adding $\\ce{H+}$ drives chromate → dichromate: $\\ce{2CrO4^{2-} + 2H+ -> Cr2O7^{2-} + H2O}$. It is a pH-driven condensation, not a redox — chromium is +6 on both sides. Option 3 is the reverse (base) reaction; option 4 is the separate oxidising half-reaction.',
      },
      {
        question: 'In the structure of the dichromate ion $\\ce{Cr2O7^{2-}}$, the two tetrahedra are joined such that the Cr–O–Cr bridge is:',
        options: [
          'a linear bridge at 180°',
          'a bent bridge with a bond angle of 126°',
          'absent — the ion is a single tetrahedron like chromate',
          'a square-planar arrangement',
        ],
        correct_index: 1,
        explanation: 'NCERT: the dichromate ion is two tetrahedra sharing one corner oxygen, with a bent Cr–O–Cr bond angle of 126°. The chromate ion (single tetrahedron) is the one that is one tetrahedron — dichromate is the linked pair.',
      },
      {
        question: 'In the acidic oxidising half-reaction $\\ce{Cr2O7^{2-} + 14H+ + 6e- -> 2Cr^{3+} + 7H2O}$, how many electrons does one dichromate ion accept, and what is the n-factor of $\\ce{K2Cr2O7}$?',
        options: [
          '3 electrons; n-factor 3',
          '6 electrons; n-factor 6',
          '2 electrons; n-factor 2',
          '14 electrons; n-factor 14',
        ],
        correct_index: 1,
        explanation: 'Two Cr atoms each fall from +6 to +3, a change of 3 each, so the ion gains 6 electrons. The n-factor is therefore 6 and the equivalent weight is M/6. The 14 in the equation is the number of $\\ce{H+}$, not electrons.',
      },
      {
        question: 'Which of these is NOT one of the species that acidified $\\ce{K2Cr2O7}$ oxidises (per NCERT\'s listed half-reactions)?',
        options: [
          'iodide $\\ce{I-}$ to iodine $\\ce{I2}$',
          'iron(II) $\\ce{Fe^{2+}}$ to iron(III) $\\ce{Fe^{3+}}$',
          'tin(II) $\\ce{Sn^{2+}}$ to tin(IV) $\\ce{Sn^{4+}}$',
          'fluoride $\\ce{F-}$ to fluorine $\\ce{F2}$',
        ],
        correct_index: 3,
        explanation: 'NCERT lists $\\ce{I-}$→$\\ce{I2}$, $\\ce{H2S}$→S, $\\ce{Sn^{2+}}$→$\\ce{Sn^{4+}}$ and $\\ce{Fe^{2+}}$→$\\ce{Fe^{3+}}$. Fluoride is not oxidised — $\\ce{F2}$ is itself the strongest oxidant, so dichromate cannot take electrons from $\\ce{F-}$.',
      },
      {
        question: 'Assertion (A): Sodium dichromate is preferred over potassium dichromate as an oxidising agent in organic chemistry.\nReason (R): The sodium salt has a greater solubility in water than the potassium salt.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, and R is the correct explanation of A',
          'Both A and R are true, but R is NOT the correct explanation of A',
        ],
        correct_index: 2,
        explanation: 'Both are NCERT statements and R explains A: because sodium dichromate is more soluble, it is the more convenient (extensively used) oxidising agent in organic chemistry, while the less-soluble potassium salt is the primary standard in volumetric analysis.',
      },
    ], 0.6),
  ],
};
