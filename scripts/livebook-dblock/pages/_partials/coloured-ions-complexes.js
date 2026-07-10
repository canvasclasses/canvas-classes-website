// Ch.5 (d- & f-Block) · Page 11 · Coloured Ions & Complex Formation
// (NCERT §8.3.10 + §8.3.11) — HIGH-YIELD.
// NCERT content transcribed faithfully (Table 8.8 colours reproduced exactly);
// enrichment from the founder's notes is confined to the "Exam Point" callouts.
// Carries the two chapter devices:
//   • "🔍 Decode This" — ions are coloured BECAUSE of a d–d transition (A–R).
//   • "🏛️ Exam Vault" — an answer-verified JEE Main colour PYQ (DNF-017)
//     shown next to the NCERT line it comes from.
// Ends with a Quick Recap + a textbook quiz in real exam formats (incl. A–R).
module.exports = {
  page_number: 11,
  chapter: 5,
  slug: 'coloured-ions-complexes',
  title: 'Coloured Ions & Complex Formation',
  subtitle: 'Why hydrated transition-metal ions are coloured (a d–d transition), why the colour you see is the complement of the light absorbed, why d⁰ and d¹⁰ ions are colourless, and why these metals form so many complexes.',
  tags: ['d-block', 'transition-metals', 'coloured-ions', 'd-d-transition', 'complexes', 'high-yield'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette, no glow or neon. Central motif: a row of seven small round-bottomed flasks on a bench, each holding a differently tinted aqueous solution — dusty teal, muted pink, pale violet, soft yellow, dull blue — labelled underneath with ion symbols like V2+, V3+, Mn2+, Fe3+, Co2+, Ni2+, Cu2+. To the left, a tiny energy-level diagram of two d levels with an electron jumping from the lower to the upper level and an absorbed light ray, captioned "d-d transition". Two faint colourless flasks (Sc3+, Zn2+) at the far end drawn as clear water. Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'A d-electron jumps between split d levels, absorbs visible light — and the ion shows the complementary colour.'
    ),

    h.heading('Formation of Coloured Ions', 'Explain why hydrated transition-metal ions are coloured and why the colour observed is the complement of the light absorbed.'),
    h.text(
      'When an electron from a lower energy $d$ orbital is excited to a higher energy $d$ orbital, the energy of excitation corresponds to the frequency of light absorbed. This frequency generally lies in the visible region. The **colour observed corresponds to the complementary colour of the light absorbed.** The frequency of the light absorbed is determined by the nature of the ligand. In aqueous solutions where water molecules are the ligands, the colours of the ions observed are listed in Table 8.8.'
    ),

    h.table(
      ['Configuration', 'Example', 'Colour'],
      [
        ['$3d^0$', '$\\ce{Sc^{3+}}$', 'colourless'],
        ['$3d^0$', '$\\ce{Ti^{4+}}$', 'colourless'],
        ['$3d^1$', '$\\ce{Ti^{3+}}$', 'purple'],
        ['$3d^1$', '$\\ce{V^{4+}}$', 'blue'],
        ['$3d^2$', '$\\ce{V^{3+}}$', 'green'],
        ['$3d^3$', '$\\ce{V^{2+}}$', 'violet'],
        ['$3d^3$', '$\\ce{Cr^{3+}}$', 'violet'],
        ['$3d^4$', '$\\ce{Mn^{3+}}$', 'violet'],
        ['$3d^4$', '$\\ce{Cr^{2+}}$', 'blue'],
        ['$3d^5$', '$\\ce{Mn^{2+}}$', 'pink'],
        ['$3d^5$', '$\\ce{Fe^{3+}}$', 'yellow'],
        ['$3d^6$', '$\\ce{Fe^{2+}}$', 'green'],
        ['$3d^6, 3d^7$', '$\\ce{Co^{3+}}, \\ce{Co^{2+}}$', 'blue, pink'],
        ['$3d^8$', '$\\ce{Ni^{2+}}$', 'green'],
        ['$3d^9$', '$\\ce{Cu^{2+}}$', 'blue'],
        ['$3d^{10}$', '$\\ce{Zn^{2+}}$', 'colourless'],
      ],
      'Table 8.8 — Colours of some of the first row (aquated) transition metal ions. Note the two ends: $3d^0$ ($\\ce{Sc^{3+}}$, $\\ce{Ti^{4+}}$) and $3d^{10}$ ($\\ce{Zn^{2+}}$) are colourless.'
    ),

    h.callout('exam_tip', 'Exam Point — the colourless-ends rule (and a way to remember the rest)',
      '**The single most-tested line on this topic:** an ion is coloured *only if it has a partially filled $d$ subshell* ($d^1$ to $d^9$), because colour comes from a $d$–$d$ transition. If a $d$ orbital has **no electrons to promote** ($d^0$) or **no empty $d$ level to promote into** ($d^{10}$), there is no $d$–$d$ transition → **colourless**.\n\n' +
      '- **Colourless ($d^0$):** $\\ce{Sc^{3+}}$, $\\ce{Ti^{4+}}$, $\\ce{V^{5+}}$, $\\ce{Cr^{6+}}$, $\\ce{Mn^{7+}}$ — and $\\ce{Cu^+}$ ($d^{10}$), $\\ce{Zn^{2+}}$ ($d^{10}$).\n' +
      '- **Coloured ($d^1$–$d^9$):** everything in between — $\\ce{Ti^{3+}}$ purple, $\\ce{V^{3+}}$ green, $\\ce{Cr^{3+}}$ violet, $\\ce{Mn^{2+}}$ pink, $\\ce{Fe^{3+}}$ yellow, $\\ce{Ni^{2+}}$ green, $\\ce{Cu^{2+}}$ blue.\n\n' +
      'Catch the trap: deeply coloured $\\ce{MnO4-}$ (Mn is $d^0$) and $\\ce{Cr2O7^{2-}}$ (Cr is $d^0$) are coloured **not** by a $d$–$d$ transition but by a *charge-transfer* transition — so "$d^0$ is always colourless" applies to the simple hydrated ion, not to these oxoanions.'),

    h.heading('Formation of Complex Compounds', 'List the three features that make transition metals especially good at forming complex compounds, with examples.'),
    h.text(
      'Complex compounds are those in which the metal ions bind a number of anions or neutral molecules giving complex species with characteristic properties. A few examples are: $\\ce{[Fe(CN)6]^{3-}}$, $\\ce{[Fe(CN)6]^{4-}}$, $\\ce{[Cu(NH3)4]^{2+}}$ and $\\ce{[PtCl4]^{2-}}$. (The chemistry of complex compounds is dealt with in detail in Unit 9.) The transition metals form a large number of complex compounds. This is due to the comparatively **smaller sizes of the metal ions, their high ionic charges and the availability of $d$ orbitals for bond formation.**'
    ),

    h.callout('remember', 'Remember — the three reasons transition metals form complexes',
      'NCERT gives exactly three, and exams quote them back:\n\n' +
      '1. **Small size** of the metal ions,\n' +
      '2. **High ionic charge**, and\n' +
      '3. **Availability of $d$ orbitals** for bond formation.\n\n' +
      'Together these let the metal ion pull ligands close and accept their lone pairs into $d$ orbitals.'),

    // ── DEVICE: turn an NCERT statement+reason pair into an A–R question ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"In aqueous solution the ions of the transition metals are coloured."*\n' +
      '> **NCERT (reason):** *"When an electron from a lower energy $d$ orbital is excited to a higher energy $d$ orbital, the energy of excitation corresponds to the frequency of light absorbed."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Most hydrated transition-metal ions are coloured.\n' +
      '- **Reason (R):** They undergo a $d$–$d$ transition, absorbing light in the visible region and showing the complementary colour.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.** (The exceptions $\\ce{Sc^{3+}}$ ($d^0$) and $\\ce{Zn^{2+}}$ ($d^{10}$) are colourless precisely because no $d$–$d$ transition is possible.)\n\n' +
      '**Your move:** whenever NCERT says *"X happens **because** Y"*, read it as a ready-made Assertion–Reason question — A = X, R = Y.'),

    // ── DEVICE: a real, answer-verified PYQ next to its NCERT line ──
    h.worked('🏛️ Exam Vault · JEE Main 2021 (PYQ)', 'solved_example',
      'The set having ions which are coloured **and** paramagnetic both is:\n\n(1) $\\ce{Cu^{2+}}, \\ce{Cr^{3+}}, \\ce{Sc^{+}}$  (2) $\\ce{Cu^{2+}}, \\ce{Zn^{2+}}, \\ce{Mn^{4+}}$  (3) $\\ce{Sc^{3+}}, \\ce{V^{5+}}, \\ce{Ti^{4+}}$  (4) $\\ce{Ni^{2+}}, \\ce{Mn^{7+}}, \\ce{Hg^{2+}}$',
      '**Answer: (1).** Both colour and paramagnetism need a **partially filled $d$ subshell** ($d^1$–$d^9$) — the very same condition. Check option (1): $\\ce{Cu^{2+}}$ ($3d^9$), $\\ce{Cr^{3+}}$ ($3d^3$) and $\\ce{Sc^+}$ (which has $d$/$s$ electrons left) all have unpaired electrons → coloured **and** paramagnetic ✓.\n\n' +
      'Why the others fail: option (2) has $\\ce{Zn^{2+}}$ ($3d^{10}$) — colourless, diamagnetic; option (3) is all $d^0$ ($\\ce{Sc^{3+}}, \\ce{V^{5+}}, \\ce{Ti^{4+}}$) — colourless, diamagnetic; option (4) has $\\ce{Mn^{7+}}$ ($3d^0$) and $\\ce{Hg^{2+}}$ ($5d^{10}$) — both fail the $d$–$d$ test.\n\n' +
      '**Notice:** this is NCERT\'s line in disguise — colour comes from the same partially filled $d$ orbitals that hold the unpaired electrons. One condition, two properties.'),

    h.recap([
      { label: 'Why coloured', text: 'A $d$-electron is excited from a lower to a higher $d$ level (**$d$–$d$ transition**), absorbing visible light; the energy of excitation equals the frequency of light absorbed.' },
      { label: 'Which colour', text: 'The colour you **see** is the **complementary** colour of the light absorbed; the exact frequency absorbed depends on the **ligand**.' },
      { label: 'When colourless', text: '$d^0$ (no electron to promote) and $d^{10}$ (no empty $d$ level) ions are colourless — e.g. $\\ce{Sc^{3+}}$, $\\ce{Ti^{4+}}$, $\\ce{Zn^{2+}}$.' },
      { label: 'Table anchors', text: 'Worth recalling: $\\ce{Ti^{3+}}$ purple, $\\ce{V^{3+}}$ green, $\\ce{Cr^{3+}}$ violet, $\\ce{Mn^{2+}}$ pink, $\\ce{Fe^{3+}}$ yellow, $\\ce{Cu^{2+}}$ blue.' },
      { label: 'Why complexes', text: 'Transition metals form many complexes because of **small ion size, high ionic charge, and available $d$ orbitals** — e.g. $\\ce{[Fe(CN)6]^{3-}}$, $\\ce{[Cu(NH3)4]^{2+}}$.' },
    ]),

    h.quiz([
      {
        question: 'The colour of a hydrated transition-metal ion such as $\\ce{[Cu(H2O)4]^{2+}}$ arises because:',
        options: [
          'an electron is promoted between split $d$ levels (a $d$–$d$ transition), absorbing visible light',
          'the ion emits light of its own characteristic frequency',
          'water molecules are themselves coloured',
          'the metal nucleus fluoresces under ordinary light',
        ],
        correct_index: 0,
        explanation: 'Colour comes from a $d$–$d$ transition: a $d$-electron jumps from a lower to a higher $d$ level, absorbing visible light, and the ion shows the complementary colour. It is absorption (not emission), water is colourless, and the nucleus plays no part.',
      },
      {
        question: 'Which one of the following aquated ions is colourless?',
        options: ['$\\ce{Cr^{3+}}$', '$\\ce{Cu^{2+}}$', '$\\ce{Sc^{3+}}$', '$\\ce{Ni^{2+}}$'],
        correct_index: 2,
        explanation: '$\\ce{Sc^{3+}}$ is $3d^0$ — there is no $d$-electron to promote, so no $d$–$d$ transition and the ion is colourless. $\\ce{Cr^{3+}}$ (violet), $\\ce{Cu^{2+}}$ (blue) and $\\ce{Ni^{2+}}$ (green) all have partially filled $d$ orbitals.',
      },
      {
        question: 'According to NCERT, the colour observed for a transition-metal ion in solution is:',
        options: [
          'the same colour as the light it absorbs',
          'the complementary colour of the light absorbed',
          'always violet, regardless of the ion',
          'determined only by the charge on the metal, not the ligand',
        ],
        correct_index: 1,
        explanation: 'The observed colour is the **complementary** colour of the light absorbed. It is not the absorbed colour itself, it varies from ion to ion, and the exact frequency absorbed is set by the nature of the ligand.',
      },
      {
        question: 'NCERT attributes the strong tendency of transition metals to form complex compounds to three factors. Which set lists them correctly?',
        options: [
          'large ion size, low charge, and absence of $d$ orbitals',
          'small ion size, high ionic charge, and availability of $d$ orbitals',
          'high melting point, metallic lustre, and variable density',
          'low ionisation energy, large radius, and full $d$ subshell',
        ],
        correct_index: 1,
        explanation: 'NCERT names exactly three: comparatively **small size** of the metal ions, their **high ionic charge**, and the **availability of $d$ orbitals** for bond formation. The other options mix in unrelated or opposite properties.',
      },
      {
        question: 'Assertion (A): $\\ce{Zn^{2+}}$ salts are white (colourless) in aqueous solution.\nReason (R): $\\ce{Zn^{2+}}$ has a completely filled $3d^{10}$ configuration, so no $d$–$d$ transition is possible.\nChoose the correct option:',
        options: [
          'A is true but R is false',
          'A is false but R is true',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are true and R explains A: with $3d^{10}$ there is no empty $d$ level to promote an electron into, so no $d$–$d$ transition, no absorption of visible light, and hence no colour. The same logic makes $\\ce{Sc^{3+}}$ ($3d^0$) colourless.',
      },
      {
        question: 'A set of ions that are **all** coloured in aqueous solution is:',
        options: [
          '$\\ce{Ti^{3+}}, \\ce{Cu^{2+}}, \\ce{Fe^{3+}}$',
          '$\\ce{Sc^{3+}}, \\ce{Ti^{4+}}, \\ce{Zn^{2+}}$',
          '$\\ce{V^{5+}}, \\ce{Zn^{2+}}, \\ce{Sc^{3+}}$',
          '$\\ce{Cu^{2+}}, \\ce{Zn^{2+}}, \\ce{Ti^{4+}}$',
        ],
        correct_index: 0,
        explanation: '$\\ce{Ti^{3+}}$ ($3d^1$, purple), $\\ce{Cu^{2+}}$ ($3d^9$, blue) and $\\ce{Fe^{3+}}$ ($3d^5$, yellow) are all partially filled and coloured. The other sets each contain a $d^0$ or $d^{10}$ ion ($\\ce{Sc^{3+}}, \\ce{Ti^{4+}}, \\ce{V^{5+}}, \\ce{Zn^{2+}}$), which are colourless.',
      },
    ], 0.6),
  ],
};
