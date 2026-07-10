// Ch.5 (d- & f-Block) · Page 15 · Potassium Permanganate KMnO4 (NCERT §8.4).
// HIGH-YIELD. Every preparation and oxidising half-reaction transcribed
// verbatim from NCERT (same language/equations/numbers). Enrichment confined
// to "Exam Point" callouts. Carries both chapter devices: "🔍 Decode This"
// (statement→reason→A-R) and "🏛️ Exam Vault" (a verified kmno4 PYQ next to the
// NCERT line it comes from). Ends with a Quick Recap + a textbook quiz.
module.exports = {
  page_number: 11,
  chapter: 5,
  slug: 'potassium-permanganate',
  title: 'Potassium Permanganate KMnO₄',
  subtitle: 'How MnO₂ becomes green manganate and then purple permanganate, why the green ion disproportionates the moment the medium turns acidic, and the acid/neutral/alkaline half-reactions that make KMnO₄ the exam-favourite oxidant.',
  tags: ['d-block', 'transition-metals', 'manganese', 'potassium-permanganate', 'oxidising-agent', 'high-yield'],
  reading_time_min: 9,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon, no 3D. Central motif: a left-to-right pipeline of three small beakers — a brown-black "MnO2" powder beaker, an arrow labelled "fuse with KOH + air/KNO3" to a dark green "K2MnO4 (manganate)" beaker, then an arrow labelled "oxidation" to a deep purple "KMnO4 (permanganate)" beaker. A small side note reads "green K2MnO4 disproportionates in acid". Faint chalk drawing of a tetrahedral MnO4 ion at the corner. Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Brown MnO₂ → dark-green manganate → deep-purple permanganate: two oxidation steps up the manganese ladder.'
    ),

    h.text(
      'Potassium permanganate is prepared by fusion of $\\ce{MnO2}$ with an alkali metal hydroxide and an oxidising agent like $\\ce{KNO3}$. This produces the dark green $\\ce{K2MnO4}$ which disproportionates in a neutral or acidic solution to give permanganate.'
    ),
    h.text(
      '$$\\ce{2MnO2 + 4KOH + O2 -> 2K2MnO4 + 2H2O}$$\n\n' +
      '$$\\ce{3MnO4^{2-} + 4H+ -> 2MnO4^{-} + MnO2 + 2H2O}$$'
    ),
    h.text(
      'Commercially it is prepared by the alkaline oxidative fusion of $\\ce{MnO2}$ followed by the electrolytic oxidation of manganate (VI).\n\n' +
      '$$\\underset{\\text{(manganese dioxide)}}{\\ce{MnO2}} \\xrightarrow[\\text{air or KNO3}]{\\text{Fused with KOH, oxidised with}} \\underset{\\text{manganate ion}}{\\ce{MnO4^{2-}}} \\xrightarrow[\\text{alkaline solution}]{\\text{Electrolytic oxidation in}} \\underset{\\text{permanganate ion}}{\\ce{MnO4^{-}}}$$'
    ),
    h.text(
      'In the laboratory, a manganese (II) ion salt is oxidised by peroxodisulphate to permanganate.'
    ),
    h.text(
      '$$\\ce{2Mn^{2+} + 5S2O8^{2-} + 8H2O -> 2MnO4^{-} + 10SO4^{2-} + 16H+}$$'
    ),
    h.text(
      'Potassium permanganate forms dark purple (almost black) crystals which are isostructural with those of $\\ce{KClO4}$. The salt is not very soluble in water (6.4 g/100 g of water at 293 K), but when heated it decomposes at 513 K.'
    ),
    h.text(
      '$$\\ce{2KMnO4 -> K2MnO4 + MnO2 + O2}$$'
    ),

    h.heading('Structure of manganate and permanganate', 'Compare the colour, magnetism and bonding of the tetrahedral manganate and permanganate ions.'),
    h.img(
      'A hand-drawn coloured chemistry structure diagram on a deep charcoal (#121316) background, muted earthy palette, no glow or neon, no 3D. Left: the tetrahedral manganate ion MnO4^2- drawn as a central Mn bonded to four O at tetrahedron corners, tinted green, labelled "Tetrahedral manganate (green) ion — 1 unpaired electron, paramagnetic". Right: the tetrahedral permanganate ion MnO4^- drawn the same way but tinted purple, labelled "Tetrahedral permanganate (purple) ion — diamagnetic". A faint annotation between them reads "pi-bonding: overlap of p orbitals of oxygen with d orbitals of manganese". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Both ions are tetrahedral — green manganate has one unpaired electron (paramagnetic); purple permanganate has none (diamagnetic).'
    ),
    h.text(
      'The manganate and permanganate ions are tetrahedral; the green manganate is paramagnetic with one unpaired electron but the permanganate is diamagnetic. **The π-bonding takes place by overlap of $p$ orbitals of oxygen with $d$ orbitals of manganese.**'
    ),

    h.heading('KMnO₄ as an oxidising agent — the medium decides', 'Write the reduction of permanganate in acid, neutral and alkaline media and the half-reactions of the species it oxidises.'),
    h.text(
      'If we represent the reduction of permanganate to manganate, manganese dioxide and manganese(II) salt by half-reactions:'
    ),
    h.text(
      '$$\\ce{MnO4^{-} + e- -> MnO4^{2-}} \\qquad (E^{\\ominus} = +0.56\\,\\text{V})$$\n\n' +
      '$$\\ce{MnO4^{-} + 4H+ + 3e- -> MnO2 + 2H2O} \\qquad (E^{\\ominus} = +1.69\\,\\text{V})$$\n\n' +
      '$$\\ce{MnO4^{-} + 8H+ + 5e- -> Mn^{2+} + 4H2O} \\qquad (E^{\\ominus} = +1.52\\,\\text{V})$$'
    ),
    h.text(
      'We can very well see that the hydrogen ion concentration of the solution plays an important part in influencing the reaction. Although many reactions can be understood by consideration of redox potential, kinetics of the reaction is also an important factor. Permanganate at $[\\ce{H+}] = 1$ should oxidise water but in practice the reaction is extremely slow unless either manganese(II) ions are present or the temperature is raised.'
    ),

    h.text(
      '**1. In acid solutions** — a few important oxidising reactions of $\\ce{KMnO4}$:\n\n' +
      '**(a)** Iodide is oxidised to iodine:\n\n' +
      '$$\\ce{10I- + 2MnO4^{-} + 16H+ -> 2Mn^{2+} + 8H2O + 5I2}$$\n\n' +
      '**(b)** Iron(II) (green) is converted to iron(III) (yellow):\n\n' +
      '$$\\ce{5Fe^{2+} + MnO4^{-} + 8H+ -> Mn^{2+} + 4H2O + 5Fe^{3+}}$$\n\n' +
      '**(c)** Oxalate ion or oxalic acid is oxidised at 333 K:\n\n' +
      '$$\\ce{5C2O4^{2-} + 2MnO4^{-} + 16H+ -> 2Mn^{2+} + 8H2O + 10CO2}$$\n\n' +
      '**(d)** Hydrogen sulphide is oxidised, sulphur being precipitated:\n\n' +
      '$$\\ce{H2S -> 2H+ + S^{2-}}$$\n\n' +
      '$$\\ce{5S^{2-} + 2MnO4^{-} + 16H+ -> 2Mn^{2+} + 8H2O + 5S}$$\n\n' +
      '**(e)** Sulphurous acid or sulphite is oxidised to a sulphate or sulphuric acid:\n\n' +
      '$$\\ce{5SO3^{2-} + 2MnO4^{-} + 6H+ -> 2Mn^{2+} + 3H2O + 5SO4^{2-}}$$\n\n' +
      '**(f)** Nitrite is oxidised to nitrate:\n\n' +
      '$$\\ce{5NO2^{-} + 2MnO4^{-} + 6H+ -> 2Mn^{2+} + 5NO3^{-} + 3H2O}$$'
    ),
    h.text(
      '**2. In neutral or faintly alkaline solutions:**\n\n' +
      '**(a)** A notable reaction is the oxidation of iodide to iodate:\n\n' +
      '$$\\ce{2MnO4^{-} + H2O + I- -> 2MnO2 + 2OH- + IO3^{-}}$$\n\n' +
      '**(b)** Thiosulphate is oxidised almost quantitatively to sulphate:\n\n' +
      '$$\\ce{8MnO4^{-} + 3S2O3^{2-} + H2O -> 8MnO2 + 6SO4^{2-} + 2OH-}$$\n\n' +
      '**(c)** Manganous salt is oxidised to $\\ce{MnO2}$; the presence of zinc sulphate or zinc oxide catalyses the oxidation:\n\n' +
      '$$\\ce{2MnO4^{-} + 3Mn^{2+} + 2H2O -> 5MnO2 + 4H+}$$'
    ),
    h.callout('warning', 'Note — never titrate permanganate with HCl present',
      'Permanganate titrations in presence of hydrochloric acid are unsatisfactory since hydrochloric acid is oxidised to chlorine. Always use dilute sulphuric acid as the medium for $\\ce{KMnO4}$ titrations.'),

    h.callout('exam_tip', 'Exam Point — KMnO₄ changes n-factor with the medium',
      'The whole page hinges on **what the medium reduces Mn to**:\n\n' +
      '- **Acidic:** $\\ce{MnO4^{-}}$ (+7) → $\\ce{Mn^{2+}}$ (+2), gain of **5 e⁻** → **n-factor 5**, $E^{\\ominus} = +1.52$ V. (The purple colour disappears.)\n' +
      '- **Neutral / faintly alkaline:** $\\ce{MnO4^{-}}$ (+7) → $\\ce{MnO2}$ (+4), gain of **3 e⁻** → **n-factor 3**, $E^{\\ominus} = +1.69$ V. (Brown $\\ce{MnO2}$ precipitate.)\n' +
      '- **Strongly alkaline:** $\\ce{MnO4^{-}}$ (+7) → $\\ce{MnO4^{2-}}$ (+6), gain of **1 e⁻** → **n-factor 1**, $E^{\\ominus} = +0.56$ V. (Green manganate.)\n\n' +
      'So the **same** oxidant has equivalent weight $M/5$, $M/3$ or $M/1$ — the medium picks the number.'),

    h.callout('fun_fact', '⭐ Uses — KMnO₄, the organic chemist\'s favourite oxidant',
      'Besides its use in analytical chemistry, potassium permanganate is used as a **favourite oxidant in preparative organic chemistry**. Its uses for the **bleaching** of wool, cotton, silk and other textile fibres and for the decolourisation of oils are also dependent on its strong oxidising power.'),

    // ── DEVICE: the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"...the dark green $\\ce{K2MnO4}$ which disproportionates in a neutral or acidic solution to give permanganate."*\n' +
      '> **NCERT (reason, from the equation):** *"$\\ce{3MnO4^{2-} + 4H+ -> 2MnO4^{-} + MnO2 + 2H2O}$."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Green $\\ce{K2MnO4}$ is unstable in acidic or neutral solution and turns into purple permanganate.\n' +
      '- **Reason (R):** In acid, $\\ce{Mn^{VI}}$ disproportionates — some Mn goes up to $\\ce{Mn^{VII}}$ ($\\ce{MnO4-}$) and some down to $\\ce{Mn^{IV}}$ ($\\ce{MnO2}$).\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** when NCERT says a species *"disproportionates"*, picture the same element ending in **two** oxidation states (one up, one down) and write the balanced split — that single equation answers the whole question.'),

    // ── DEVICE: a real PYQ next to the NCERT line it came from ──
    h.worked('🏛️ Exam Vault · JEE Main 2024 (PYQ)', 'solved_example',
      'Given below are two statements:\n\n**Statement (I):** Fusion of $\\ce{MnO2}$ with KOH and an oxidising agent gives dark green $\\ce{K2MnO4}$.\n**Statement (II):** Manganate ion on electrolytic oxidation in alkaline medium gives permanganate ion.\n\nChoose the correct answer:\n\n(1) Statement I is true but Statement II is false  (2) Both Statement I and Statement II are false  (3) Statement I is false but Statement II is true  (4) Both Statement I and Statement II are true',
      '**Answer: (4) Both Statement I and Statement II are true.** Both come straight from NCERT\'s preparation of $\\ce{KMnO4}$:\n\n' +
      '- **Statement I** is the alkaline oxidative fusion: $\\ce{2MnO2 + 4KOH + O2 -> 2K2MnO4 + 2H2O}$ — gives dark green manganate ($\\ce{Mn^{VI}}$). **True.**\n' +
      '- **Statement II** is the second commercial step: $\\ce{MnO4^{2-}}$ → $\\ce{MnO4^{-}}$ by **electrolytic oxidation in alkaline solution** ($\\ce{Mn^{VI}}$ → $\\ce{Mn^{VII}}$). **True.**\n\n' +
      '**Notice:** these are NCERT\'s two preparation steps, almost word for word. Learn the prep pipeline ($\\ce{MnO2}$ → manganate → permanganate) and both statements are obviously true.'),

    h.recap([
      { label: 'Preparation', text: 'Fuse $\\ce{MnO2}$ with KOH + oxidiser ($\\ce{KNO3}$/air) → green $\\ce{K2MnO4}$: $\\ce{2MnO2 + 4KOH + O2 -> 2K2MnO4 + 2H2O}$. Then oxidise manganate → permanganate (commercially by **electrolytic oxidation**).' },
      { label: 'Disproportionation', text: 'Green $\\ce{K2MnO4}$ is unstable in neutral/acid: $\\ce{3MnO4^{2-} + 4H+ -> 2MnO4^{-} + MnO2 + 2H2O}$ — $\\ce{Mn^{VI}}$ splits to $\\ce{Mn^{VII}}$ + $\\ce{Mn^{IV}}$.' },
      { label: 'Lab prep', text: 'Oxidise $\\ce{Mn^{2+}}$ with peroxodisulphate: $\\ce{2Mn^{2+} + 5S2O8^{2-} + 8H2O -> 2MnO4^{-} + 10SO4^{2-} + 16H+}$.' },
      { label: 'Structure', text: 'Both ions **tetrahedral**. Green manganate $\\ce{MnO4^{2-}}$ = **1 unpaired e⁻, paramagnetic**; purple permanganate $\\ce{MnO4^{-}}$ = **diamagnetic**. π-bonding by O $p$–Mn $d$ overlap.' },
      { label: 'Medium decides', text: 'Acid: $\\ce{MnO4-}$→$\\ce{Mn^{2+}}$ (5 e⁻, $+1.52$ V). Neutral/alkaline: →$\\ce{MnO2}$ (3 e⁻, $+1.69$ V). Strong base: →$\\ce{MnO4^{2-}}$ (1 e⁻, $+0.56$ V).' },
      { label: 'Uses', text: 'Favourite oxidant in **preparative organic chemistry**; bleaching of textile fibres; never titrate with HCl present (Cl⁻ → $\\ce{Cl2}$).' },
    ]),

    h.quiz([
      {
        question: 'The dark green $\\ce{K2MnO4}$ formed by fusing $\\ce{MnO2}$ with KOH and an oxidiser turns into purple permanganate in neutral or acidic solution. This change is a:',
        options: [
          'simple acid–base neutralisation with no change of oxidation state',
          'disproportionation: $\\ce{Mn^{VI}}$ goes partly to $\\ce{Mn^{VII}}$ and partly to $\\ce{Mn^{IV}}$',
          'reduction of all the manganese to $\\ce{Mn^{2+}}$',
          'oxidation of all the manganese to $\\ce{Mn^{VII}}$ only',
        ],
        correct_index: 1,
        explanation: 'NCERT: $\\ce{3MnO4^{2-} + 4H+ -> 2MnO4^{-} + MnO2 + 2H2O}$. The +6 Mn disproportionates — some rises to +7 (permanganate) and some falls to +4 ($\\ce{MnO2}$). It is not a neutralisation, and the manganese does not all go to one state.',
      },
      {
        question: 'In strongly acidic medium, permanganate is reduced to $\\ce{Mn^{2+}}$. The number of electrons gained per $\\ce{MnO4^{-}}$ (the n-factor) is:',
        options: ['1', '3', '5', '7'],
        correct_index: 2,
        explanation: 'In acid: $\\ce{MnO4^{-} + 8H+ + 5e- -> Mn^{2+} + 4H2O}$. Manganese falls from +7 to +2, a change of 5, so n-factor = 5 (equivalent weight M/5). n-factor 1 is the strongly-alkaline case (→$\\ce{MnO4^{2-}}$) and 3 is the neutral case (→$\\ce{MnO2}$).',
      },
      {
        question: 'Which statement about the manganate and permanganate ions is correct?',
        options: [
          'manganate is purple and diamagnetic; permanganate is green and paramagnetic',
          'both ions are octahedral',
          'manganate $\\ce{MnO4^{2-}}$ is green and paramagnetic (1 unpaired e⁻); permanganate $\\ce{MnO4^{-}}$ is purple and diamagnetic',
          'both ions are colourless because manganese is in a high oxidation state',
        ],
        correct_index: 2,
        explanation: 'NCERT: both ions are tetrahedral. The green manganate ($\\ce{Mn^{VI}}$, $d^1$) has one unpaired electron so it is paramagnetic; the purple permanganate ($\\ce{Mn^{VII}}$, $d^0$) has none so it is diamagnetic. Option 1 swaps the two; they are not octahedral or colourless.',
      },
      {
        question: 'Why are permanganate titrations carried out in dilute sulphuric acid rather than hydrochloric acid?',
        options: [
          'because $\\ce{H2SO4}$ reduces permanganate to manganate',
          'because hydrochloric acid is itself oxidised by $\\ce{KMnO4}$ to chlorine, consuming the oxidant',
          'because $\\ce{KMnO4}$ does not dissolve in HCl',
          'because HCl turns the solution green before the end-point',
        ],
        correct_index: 1,
        explanation: 'NCERT\'s note: in the presence of HCl, the chloride is oxidised to $\\ce{Cl2}$, so some permanganate is wasted oxidising $\\ce{Cl-}$ instead of the analyte — the titre is unreliable. Dilute $\\ce{H2SO4}$ is not oxidised, so it is the safe medium.',
      },
      {
        question: 'In neutral or faintly alkaline solution, $\\ce{KMnO4}$ oxidises iodide. The product is:',
        options: [
          'iodine $\\ce{I2}$, the same as in acidic medium',
          'iodate $\\ce{IO3^{-}}$, with $\\ce{MnO2}$ formed alongside',
          'iodide is not oxidised at all in neutral medium',
          'periodate $\\ce{IO4^{-}}$',
        ],
        correct_index: 1,
        explanation: 'NCERT: $\\ce{2MnO4^{-} + H2O + I- -> 2MnO2 + 2OH- + IO3^{-}}$ — in neutral/faintly alkaline medium iodide goes all the way to iodate, and permanganate is reduced to brown $\\ce{MnO2}$. In acid the iodide stops at $\\ce{I2}$ ($\\ce{10I- + 2MnO4^{-} + 16H+ -> 2Mn^{2+} + 8H2O + 5I2}$).',
      },
      {
        question: 'Assertion (A): The same $\\ce{KMnO4}$ can have an equivalent weight of M/5, M/3 or M/1.\nReason (R): The hydrogen-ion concentration (the medium) decides whether manganese is reduced to $\\ce{Mn^{2+}}$, $\\ce{MnO2}$ or $\\ce{MnO4^{2-}}$.\nChoose the correct option:',
        options: [
          'A is true but R is false',
          'A is false but R is true',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are true and R explains A: NCERT states the hydrogen-ion concentration plays an important part. Acid → $\\ce{Mn^{2+}}$ (5 e⁻, M/5), neutral/alkaline → $\\ce{MnO2}$ (3 e⁻, M/3), strong base → $\\ce{MnO4^{2-}}$ (1 e⁻, M/1). The medium picks the n-factor, hence the equivalent weight.',
      },
    ], 0.6),
  ],
};
