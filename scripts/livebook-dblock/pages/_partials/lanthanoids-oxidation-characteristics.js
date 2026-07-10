// Ch.5 (d- & f-Block) · Page 17 · Lanthanoids — Oxidation States & Characteristics
// NCERT §8.5.3 Oxidation States + §8.5.4 General Characteristics (PDF pp.228-230).
// NCERT content transcribed faithfully (same language/numbers/Fig 8.7);
// enrichment from the founder's notes is confined to the "Exam Point" callouts.
// Devices: "🔍 Decode This" (A-R trainer) + "🏛️ Exam Vault" (answer-verified PYQ).
// Places NCERT Example 8.10 (a lanthanoid well known for +4 → Cerium).
// Ends with a Quick Recap + a textbook quiz in real exam formats.
module.exports = {
  page_number: 17,
  chapter: 5,
  slug: 'lanthanoids-oxidation-characteristics',
  title: 'Lanthanoids — Oxidation States & Characteristics',
  subtitle: 'Why +3 rules the lanthanoids, why cerium can climb to +4 and europium can drop to +2, and how their colour, magnetism and reactions all trace back to empty, half-filled and filled f-shells.',
  tags: ['f-block', 'lanthanoids', 'oxidation-states', 'cerium', 'europium', 'high-yield'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: a balance scale. On the heavy, dominant pan sits a large tile labelled "+3" (the predominant lanthanoid state). On a higher left pan a smaller tile "Ce(IV)" drawn as an oxidant arrow pointing down toward "+3"; on a higher right pan a smaller tile "Eu(II)" drawn as a reductant arrow pointing up toward "+3". Faint hand-lettered notes nearby: "f0", "f7", "f14" beside the relevant ions. Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Everything leans back to +3 — Ce(IV) falls to it as an oxidant, Eu(II) rises to it as a reductant.'
    ),

    h.heading('8.5.3 Oxidation States', 'Explain why +3 is the predominant lanthanoid oxidation state and how empty, half-filled and filled f-subshells give the +4 and +2 exceptions.'),
    h.text(
      'In the lanthanoids, **La(III) and Ln(III) compounds are predominant species.** However, occasionally **+2 and +4** ions in solution or in solid compounds are also obtained. This irregularity (as in ionisation enthalpies) arises mainly from the **extra stability of empty, half-filled or filled $f$ subshell.**\n\n' +
      'Thus, the formation of **$\\ce{Ce^{IV}}$** is favoured by its noble gas configuration, but it is a **strong oxidant** reverting to the common +3 state. The $E^{\\ominus}$ value for **$\\ce{Ce^{4+}}/\\ce{Ce^{3+}}$ is $+1.74$ V**, which suggests that it can oxidise water. However, the reaction rate is very slow and hence Ce(IV) is a good analytical reagent. **Pr, Nd, Tb and Dy also exhibit +4 state but only in oxides, $\\ce{MO2}$.**\n\n' +
      '**$\\ce{Eu^{2+}}$** is formed by losing the two $s$ electrons and its $f^7$ configuration accounts for the formation of this ion. However, $\\ce{Eu^{2+}}$ is a **strong reducing agent** changing to the common +3 state. Similarly **$\\ce{Yb^{2+}}$** which has $f^{14}$ configuration is a reductant. **$\\ce{Tb^{IV}}$** has half-filled $f$-orbitals and is an **oxidant.** The behaviour of samarium is very much like europium, exhibiting both +2 and +3 oxidation states.'
    ),

    h.callout('exam_tip', 'Exam Point — predict +4 and +2 from the f-shell',
      'The off-+3 states are not random — they appear whenever the ion can reach an **empty ($f^0$), half-filled ($f^7$) or completely filled ($f^{14}$)** $f$ subshell:\n\n' +
      '- **+4 (an oxidant, falls back to +3):** $\\ce{Ce^{4+}}$ → $4f^0$, $\\ce{Tb^{4+}}$ → $4f^7$ (both reach a stable shell by losing an extra electron).\n' +
      '- **+2 (a reductant, rises to +3):** $\\ce{Eu^{2+}}$ → $4f^7$, $\\ce{Yb^{2+}}$ → $4f^{14}$ (both reach a stable shell by keeping an extra electron).\n\n' +
      'So: if going to +4 lands the ion on $f^0/f^7$, expect a +4 **oxidant**; if going to +2 lands it on $f^7/f^{14}$, expect a +2 **reductant**.'),

    h.heading('8.5.4 General Characteristics', 'Describe the colour, paramagnetism, reactivity and the alloy mischmetall of the lanthanoids.'),
    h.text(
      'All the lanthanoids are **silvery white soft metals** and tarnish rapidly in air. The hardness increases with increasing atomic number, samarium being steel hard. Their melting points range between 1000 to 1200 K but **samarium melts at 1623 K.** They have typical metallic structure and are good conductors of heat and electricity. Density and other properties change smoothly except for Eu and Yb and occasionally for Sm and Tm.\n\n' +
      'Many **trivalent lanthanoid ions are coloured** both in the solid state and in aqueous solutions. Colour of these ions may be attributed to the presence of $f$ electrons. **Neither $\\ce{La^{3+}}$ nor $\\ce{Lu^{3+}}$ ion shows any colour but the rest do so.** However, absorption bands are narrow, probably because of the excitation within $f$ level. The lanthanoid ions other than the $f^0$ type ($\\ce{La^{3+}}$ and $\\ce{Ce^{4+}}$) and the $f^{14}$ type ($\\ce{Yb^{2+}}$ and $\\ce{Lu^{3+}}$) are all **paramagnetic.** The paramagnetism rises to maximum in neodymium.\n\n' +
      'The first ionisation enthalpies of the lanthanoids are around $600\\ \\text{kJ mol}^{-1}$, the second about $1200\\ \\text{kJ mol}^{-1}$ comparable with those of calcium. In their chemical behaviour, in general, the earlier members of the series are quite reactive similar to calcium but, with increasing atomic number, they behave more like aluminium. Values for $E^{\\ominus}$ for the half-reaction:\n\n' +
      '$$\\ce{Ln^{3+}(aq) + 3e^- -> Ln(s)}$$\n\n' +
      'are in the range of $-2.2$ to $-2.4$ V except for Eu for which the value is $-2.0$ V. This is, of course, a small variation.'
    ),
    h.text(
      'The metals combine with hydrogen when gently heated in the gas. The carbides, $\\ce{Ln3C}$, $\\ce{Ln2C3}$ and $\\ce{LnC2}$ are formed when the metals are heated with carbon. They liberate hydrogen from dilute acids and burn in halogens to form halides. They form oxides $\\ce{M2O3}$ and hydroxides $\\ce{M(OH)3}$. The hydroxides are definite compounds, not just hydrated oxides. They are basic like alkaline earth metal oxides and hydroxides.'
    ),
    h.img(
      'A hand-drawn coloured radial reaction diagram on a deep charcoal (#121316) background, muted earthy palette, no glow or neon. A central small circle labelled "Ln" with eight teal arrows radiating outward, each ending in a hand-lettered product and its condition, exactly as NCERT Fig 8.7: "burns in O2 → Ln2O3", "with acids → H2", "with halogens → LnX3", "with H2O → Ln(OH)3 + H2", "with C, 2773 K → LnC2", "heated with N → LnN", "heated with S → Ln2S3". Hand-lettered title "Fig 8.7 — Chemical reactions of the lanthanoids". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Fig 8.7 — Chemical reactions of the lanthanoids: the metal burns, dissolves in acid, and forms halides, oxides, nitrides, sulphides and carbides.'
    ),
    h.text(
      'The best single use of the lanthanoids is for the production of **alloy steels** for plates and pipes. A well known alloy is **mischmetall** which consists of a lanthanoid metal (~95%) and iron (~5%) and traces of S, C, Ca and Al. A good deal of mischmetall is used in Mg-based alloy to produce bullets, shell and lighter flint. Mixed oxides of lanthanoids are employed as catalysts in petroleum cracking. Some individual Ln oxides are used as phosphors in television screens and similar fluorescing surfaces.'
    ),

    // ── NCERT Example 8.10 ──
    h.worked('NCERT Example 8.10', 'solved_example',
      'Name a member of the lanthanoid series which is well known to exhibit +4 oxidation state.',
      '**Cerium ($Z = 58$).** Cerium readily forms $\\ce{Ce^{4+}}$ because removing the extra electron leaves it with the stable noble-gas $4f^0$ configuration. (As NCERT notes, $\\ce{Ce^{4+}}$ is a strong oxidant that reverts to the common +3 state — its $E^{\\ominus}$ for $\\ce{Ce^{4+}}/\\ce{Ce^{3+}}$ is $+1.74$ V.)'),

    // ── 🔍 Decode This — the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"$\\ce{Eu^{2+}}$ is a strong reducing agent changing to the common +3 state."*\n' +
      '> **NCERT (reason):** *"$\\ce{Eu^{2+}}$ is formed by losing the two $s$ electrons and its $f^7$ configuration accounts for the formation of this ion."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** $\\ce{Eu^{2+}}$ acts as a strong reducing agent.\n' +
      '- **Reason (R):** $\\ce{Eu^{2+}}$ has the extra-stable half-filled $4f^7$ configuration, so it forms readily but tends to give up an electron and return to the predominant +3 state.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** whenever NCERT pairs *"$\\ce{Ce^{4+}}$ is an oxidant ($f^0$)"* or *"$\\ce{Eu^{2+}}$ is a reductant ($f^7$)"*, read the $f$-shell as the reason and the oxidant/reductant role as the assertion — A = the role, R = the stable $f^0/f^7/f^{14}$ shell.'),

    // ── 🏛️ Exam Vault — answer-verified PYQ next to the NCERT line ──
    h.worked('🏛️ Exam Vault · JEE Main 2024 (PYQ)', 'solved_example',
      'Which of the following acts as a strong reducing agent? (Atomic number: Ce = 58, Eu = 63, Gd = 64, Lu = 71)\n\n(1) $\\ce{Lu^{3+}}$  (2) $\\ce{Gd^{3+}}$  (3) $\\ce{Eu^{2+}}$  (4) $\\ce{Ce^{4+}}$',
      '**Answer: (3) $\\ce{Eu^{2+}}$.** $\\ce{Eu^{2+}}$ has the half-filled $4f^7$ configuration; it readily loses one electron to reach the predominant, even-more-stable +3 state, so it is a **strong reducing agent**. By contrast $\\ce{Ce^{4+}}$ is an *oxidant* (it gains an electron to fall to +3), while $\\ce{Lu^{3+}}$ ($4f^{14}$) and $\\ce{Gd^{3+}}$ ($4f^7$) are both stable +3 ions with no reducing tendency.\n\n' +
      '**Notice:** this is NCERT\'s line, almost word for word — *"$\\ce{Eu^{2+}}$ is a strong reducing agent changing to the common +3 state."* Learn the NCERT line and you have already answered the exam.'),

    h.recap([
      { label: 'Predominant +3', text: '**La(III) and Ln(III) compounds dominate** — +2 and +4 turn up only occasionally, driven by the stability of empty, half-filled or filled $f$ shells.' },
      { label: 'Ce⁴⁺ — the oxidant', text: '$\\ce{Ce^{4+}}$ ($4f^0$) is favoured by its noble-gas config but is a **strong oxidant**, $E^{\\ominus}(\\ce{Ce^{4+}}/\\ce{Ce^{3+}}) = +1.74$ V; Pr, Nd, Tb, Dy show +4 only in oxides $\\ce{MO2}$.' },
      { label: 'Eu²⁺/Yb²⁺ — reductants', text: '$\\ce{Eu^{2+}}$ ($f^7$) and $\\ce{Yb^{2+}}$ ($f^{14}$) are **strong reducing agents** that revert to +3; $\\ce{Tb^{4+}}$ ($f^7$) is an oxidant; Sm behaves like Eu (+2 and +3).' },
      { label: 'Colour & magnetism', text: 'Most **Ln³⁺ are coloured and paramagnetic** (from $f$ electrons); $\\ce{La^{3+}}$ ($f^0$) and $\\ce{Lu^{3+}}$ ($f^{14}$) are **colourless**; paramagnetism peaks at neodymium.' },
      { label: 'Mischmetall', text: 'Lanthanoids go mostly into **alloy steels**; **mischmetall** = ~95% lanthanoid metal + ~5% iron (traces S, C, Ca, Al), used in flints, bullets and shells.' },
    ]),

    h.quiz([
      {
        question: 'The predominant oxidation state shown by the lanthanoids in their compounds is:',
        options: ['+2', '+3', '+4', '+6'],
        correct_index: 1,
        explanation: 'NCERT states that La(III) and Ln(III) compounds are the predominant species. The +2 and +4 states appear only occasionally, driven by the stability of empty, half-filled or filled f subshells.',
      },
      {
        question: 'Cerium readily exhibits the +4 state. The main reason $\\ce{Ce^{4+}}$ is favoured is that:',
        options: [
          'it acquires a stable noble-gas $4f^0$ configuration',
          'it acquires a half-filled $4f^7$ configuration',
          'the inert pair effect stabilises the +4 state',
          'it acquires a completely filled $4f^{14}$ configuration',
        ],
        correct_index: 0,
        explanation: 'Losing the extra electron leaves Ce with the empty $4f^0$ (noble-gas-like) shell, which is why $\\ce{Ce^{4+}}$ forms. $4f^7$ is the half-filled stability that explains $\\ce{Tb^{4+}}$ and $\\ce{Eu^{2+}}$, and the inert pair effect is a p-block idea.',
      },
      {
        question: 'Which pair of lanthanoid ions are colourless (and hence diamagnetic)?',
        options: [
          '$\\ce{Nd^{3+}}$ and $\\ce{Eu^{3+}}$',
          '$\\ce{La^{3+}}$ ($4f^0$) and $\\ce{Lu^{3+}}$ ($4f^{14}$)',
          '$\\ce{Pr^{3+}}$ and $\\ce{Sm^{3+}}$',
          '$\\ce{Ce^{3+}}$ and $\\ce{Gd^{3+}}$',
        ],
        correct_index: 1,
        explanation: 'NCERT says neither $\\ce{La^{3+}}$ ($f^0$) nor $\\ce{Lu^{3+}}$ ($f^{14}$) shows colour — both have no partly filled $f$ level, so no $f$–$f$ excitation and no unpaired electrons. The other ions listed have partly filled $4f$ shells and are coloured and paramagnetic.',
      },
      {
        question: 'Why is $\\ce{Eu^{2+}}$ a strong reducing agent?',
        options: [
          'It has an empty $4f^0$ shell that it wants to fill',
          'It has a half-filled $4f^7$ shell and easily loses one electron to reach the stable +3 state',
          'It cannot change its oxidation state at all',
          'It is stabilised by the inert pair effect',
        ],
        correct_index: 1,
        explanation: 'Formed by losing its two $s$ electrons, $\\ce{Eu^{2+}}$ sits at $4f^7$; it readily gives up one more electron to revert to the predominant (and stable) +3 state — that electron donation is what makes it a strong reductant. An $f^0$ shell describes oxidants like $\\ce{Ce^{4+}}$, not Eu.',
      },
      {
        question: 'The alloy mischmetall, widely used for lighter flints, consists of:',
        options: [
          'about 95% lanthanoid metal and about 5% iron, with traces of S, C, Ca and Al',
          'equal parts lanthanum and aluminium only',
          'pure cerium with no other metal',
          'about 95% iron and 5% lanthanoid metal',
        ],
        correct_index: 0,
        explanation: 'NCERT gives mischmetall as ~95% lanthanoid metal plus ~5% iron, with traces of S, C, Ca and Al. The iron is the minor component — option (4) reverses the proportions.',
      },
      {
        question: 'Assertion (A): $\\ce{Ce^{4+}}$ is a good analytical oxidising reagent.\nReason (R): The $E^{\\ominus}$ value for $\\ce{Ce^{4+}}/\\ce{Ce^{3+}}$ is $+1.74$ V, but its reaction with water is very slow.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are true and R explains A: the high $+1.74$ V potential makes $\\ce{Ce^{4+}}$ a strong oxidant (in principle even of water), but because that water-oxidation is kinetically very slow, $\\ce{Ce^{4+}}$ survives in solution and is reliable as an analytical reagent.',
      },
    ], 0.6),
  ],
};
