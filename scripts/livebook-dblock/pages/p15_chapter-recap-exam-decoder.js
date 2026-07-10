// Ch.5 (d- & f-Block) · Page 21 · Chapter Recap & Exam Decoder — the chapter's
// revision-tools hub (the founder's one-page revision station for the whole unit).
// Every fact, colour, magnetic moment and oxidation state below is transcribed
// faithfully from the NCERT chapter (Tables 8.3, 8.6, 8.7, 8.8 + the Summary);
// no value is invented. Enrichment (memory hooks, the "decode" skill) lives only
// in callouts, matching the pilot p06_oxidation-states.js for voice and layout.
module.exports = {
  page_number: 15,
  chapter: 5,
  slug: 'chapter-recap-exam-decoder',
  title: 'Chapter Recap & Exam Decoder',
  subtitle: 'Your one-page revision station for the whole chapter — the colour table, the magnetic-moment ladder, the oxidation-state map, every NCERT exception in one list, and the single skill that turns any NCERT line into the exam question it becomes.',
  tags: ['d-block', 'f-block', 'revision', 'exam-decoder', 'high-yield', 'all-chapter'],
  reading_time_min: 10,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon, no 3D. Central motif: a tidy "revision desk / cheat-sheet" — an open notebook lying flat, its two pages covered in neat chalk-and-coloured-pencil notes: on the left page a small grid of coloured test-tube swatches (pink, violet, blue, green, yellow) labelled like a colour key; on the right page a short vertical ladder of rungs labelled 1.73, 2.83, 3.87, 4.90, 5.92 and a tiny manganese "+2 to +7" staircase in the corner. Around the notebook a few loose index cards pinned with a small magnet, a purple test tube of KMnO4, and a faint row of the Sc-to-Zn elements along the top edge. Calm, organised, textbook-plate feel. Landscape, desktop-friendly.',
      '16:9',
      'One desk, one page — the whole chapter laid out for the night before the exam.'
    ),

    h.text(
      'This is your **revision station**. Everything the chapter asks you to *remember* — the colours, the magnetic moments, the oxidation-state pattern, and every exception NCERT slips into a single sentence — is gathered here in one place, exactly as NCERT states it. The last section teaches the one skill that quietly wins this chapter in the exam: reading an NCERT line and seeing the question it will become.'
    ),

    // ─────────────────────────── COLOUR TABLE (Table 8.8) ───────────────────────────
    h.heading('The colour key (Table 8.8)', 'Recall the colours of the common aquated 3d ions and the reason they are coloured.'),
    h.text(
      'In aqueous solution the water molecules act as ligands, and an electron jumps from a lower-energy $d$ orbital to a higher-energy $d$ orbital — a **d–d transition**. The colour you see is the **complementary** colour of the light absorbed. Ions with an **empty** ($3d^0$) or **completely filled** ($3d^{10}$) $d$ subshell have no such transition, so they are **colourless**.'
    ),
    h.table(
      ['Configuration', 'Example ion', 'Colour'],
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
        ['$3d^6\\,3d^7$', '$\\ce{Co^{3+}}$ $\\ce{Co^{2+}}$', 'bluepink'],
        ['$3d^8$', '$\\ce{Ni^{2+}}$', 'green'],
        ['$3d^9$', '$\\ce{Cu^{2+}}$', 'blue'],
        ['$3d^{10}$', '$\\ce{Zn^{2+}}$', 'colourless'],
      ],
      'Table 8.8 — Colours of some of the first row (aquated) transition metal ions.'
    ),
    h.callout('exam_tip', 'Exam Point — the memory hook for the colour table',
      'Anchor the **two colourless ends and the violet cluster in the middle**, then the rest fall into place:\n\n' +
      '- **Both ends colourless** — $\\ce{Sc^{3+}}$ ($3d^0$) and $\\ce{Zn^{2+}}$ ($3d^{10}$): no $d$ electron to jump, no $d$–$d$ transition, no colour. (Add $\\ce{Ti^{4+}}$, also $3d^0$, to the colourless list.)\n' +
      '- **The violet middle** — $\\ce{V^{2+}}$, $\\ce{Cr^{3+}}$ and $\\ce{Mn^{3+}}$ are all **violet**.\n' +
      '- **The pink–yellow pair at $3d^5$** — $\\ce{Mn^{2+}}$ is **pink**, $\\ce{Fe^{3+}}$ is **yellow**.\n' +
      '- **The two blues** — $\\ce{Cr^{2+}}$ and $\\ce{Cu^{2+}}$.\n\n' +
      'If a question gives you a colour and asks for the ion (or vice-versa), it is reading straight off this table — there is nothing to derive.'),

    // ─────────────────────── MAGNETIC-MOMENT LADDER (Table 8.7) ───────────────────────
    h.heading('The magnetic-moment ladder (Table 8.7)', 'Use the spin-only formula to link the number of unpaired electrons to the magnetic moment, both ways.'),
    h.text(
      'For the first transition series the orbital contribution is effectively quenched, so the magnetic moment depends only on the number of **unpaired electrons** $n$, through the **spin-only formula**:\n\n' +
      '$$\\mu = \\sqrt{n(n+2)}\\ \\text{BM}$$\n\n' +
      'A single unpaired electron gives $\\mu = 1.73$ BM, and $\\mu$ **increases as the number of unpaired electrons increases**. Learn the five rungs of the ladder once and you can answer any "find $\\mu$" or "find the ion from $\\mu$" question.'
    ),
    h.table(
      ['Unpaired $e^-$ ($n$)', '$\\mu = \\sqrt{n(n+2)}$ (BM)', 'Example ion (config)'],
      [
        ['1', '1.73', '$\\ce{Cu^{2+}}$ ($3d^9$)'],
        ['2', '2.83', '$\\ce{Ni^{2+}}$ ($3d^8$)'],
        ['3', '3.87', '$\\ce{V^{2+}}$ / $\\ce{Co^{2+}}$ ($3d^3$ / $3d^7$)'],
        ['4', '4.90', '$\\ce{Cr^{2+}}$ / $\\ce{Fe^{2+}}$ ($3d^4$ / $3d^6$)'],
        ['5', '5.92', '$\\ce{Mn^{2+}}$ / $\\ce{Fe^{3+}}$ ($3d^5$)'],
      ],
      'The spin-only ladder. NCERT Table 8.7 lists the calculated value as 2.84 for $n=2$ — the rounded textbook figure 2.83 is the same value. ($n=0$ → 0 BM, e.g. $\\ce{Sc^{3+}}$, $\\ce{Zn^{2+}}$.)'
    ),
    h.callout('exam_tip', 'Exam Point — how examiners run it backwards (μ given → find the ion)',
      'Most $\\mu$ questions hand you the **number**, not $n$. Reverse the ladder:\n\n' +
      '1. Match the given $\\mu$ to a rung → that gives **$n$** (e.g. $\\mu = 5.92$ BM $\\Rightarrow n = 5$).\n' +
      '2. Find the ion whose $d$-configuration has exactly that many unpaired electrons (five unpaired → $3d^5$ → $\\ce{Mn^{2+}}$ or $\\ce{Fe^{3+}}$).\n\n' +
      'Worked the NCERT way (Example 8.8): a divalent ion with $Z = 25$ is $\\ce{Mn^{2+}}$, $3d^5$, five unpaired electrons, so $\\mu = \\sqrt{5(5+2)} = 5.92$ BM. Same formula, read in whichever direction the question needs.'),

    // ─────────────────────── OXIDATION-STATE MAP (Tables 8.3 & 8.6) ───────────────────────
    h.heading('The oxidation-state map', 'Recall how the maximum oxidation state climbs across the early 3d series and where the high states appear.'),
    h.text(
      'The headline fact: **manganese exhibits all the oxidation states from +2 to +7** — the widest range, because it sits in the middle of the series with the most $(3d + 4s)$ electrons available for bonding. Up to manganese, the **maximum oxidation state of reasonable stability equals the total number of $(3d + 4s)$ electrons**:'
    ),
    h.table(
      ['Element (config)', 'Max O.S.', 'Shown in'],
      [
        ['Sc ($3d^1 4s^2$)', '+3', '$\\ce{Sc2O3}$'],
        ['Ti ($3d^2 4s^2$)', '+4', '$\\ce{TiO2}$ / $\\ce{TiO^{2+}}$'],
        ['V ($3d^3 4s^2$)', '+5', '$\\ce{V2O5}$ / $\\ce{VO2+}$'],
        ['Cr ($3d^5 4s^1$)', '+6', '$\\ce{CrO3}$ / $\\ce{CrO4^{2-}}$'],
        ['Mn ($3d^5 4s^2$)', '+7', '$\\ce{Mn2O7}$ / $\\ce{MnO4-}$'],
      ],
      'The maximum oxidation state = number of $(3d + 4s)$ electrons, up to Mn. After Mn the stability of higher states drops abruptly.'
    ),
    h.text(
      'These **high oxidation states are exhibited in oxides, oxoanions and fluorides** — e.g. $\\ce{MnO4-}$, $\\ce{CrO4^{2-}}$, $\\ce{Cr2O7^{2-}}$. NCERT notes that the ability of **oxygen** to stabilise the highest state runs up to $\\ce{Mn2O7}$, while the highest **fluoride** of Mn is only $\\ce{MnF4}$ — oxygen out-reaches fluorine because it can form multiple bonds to the metal.'
    ),

    // ─────────────────────────── EXCEPTIONS / ANOMALIES ───────────────────────────
    h.heading('The exceptions list — what NCERT slips into single sentences', 'Collect every anomaly the chapter states, since these are the most-asked revision points.'),
    h.callout('remember', '⚠️ The anomalies examiners love (all straight from NCERT)',
      '**Anomalous configurations**\n' +
      '- **Cr** is $3d^5 4s^1$ and **Cu** is $3d^{10} 4s^1$ — not $4s^2$ — because a half-filled ($d^5$) and fully-filled ($d^{10}$) subshell are extra stable.\n\n' +
      '**Copper, the odd metal of the first series**\n' +
      '- Many **Cu(I) compounds are unstable in aqueous solution and disproportionate**: $2\\ce{Cu+} \\rightarrow \\ce{Cu^{2+}} + \\ce{Cu}$. $\\ce{Cu^{2+}}$(aq) is favoured because its much more negative hydration enthalpy more than compensates for the second ionisation enthalpy.\n' +
      '- **Cu has a positive $E^\\ominus$ ($\\ce{Cu^{2+}}/\\ce{Cu} = +0.34$ V)** — the only first-series metal that is **not** oxidised by $1\\,\\text{M}\\ \\ce{H+}$, so it **cannot liberate $\\ce{H2}$** from acids.\n\n' +
      '**The "not transition" metals**\n' +
      '- **Zn, Cd, Hg** ($\\ce{(n-1)}d^{10}\\,ns^2$, i.e. $d^{10}$ ions) are **not regarded as transition elements** — their $d$ subshell is full in both atom and common ion.\n\n' +
      '**Melting points**\n' +
      '- Melting/boiling points peak near the middle of each series (one unpaired electron per $d$ orbital favours strong interatomic bonding); **Mn and Tc are anomalously low** for their position.\n\n' +
      '**Electrode-potential anomalies**\n' +
      '- $E^\\ominus(\\ce{M^{2+}/M})$ for **Mn, Ni and Zn is more negative than expected** — Mn and Zn because of the stability of the half-filled $d^5$ ($\\ce{Mn^{2+}}$) and filled $d^{10}$ ($\\ce{Zn^{2+}}$) subshells, Ni because of its high negative hydration enthalpy.\n' +
      '- **$\\ce{Cr^{2+}}$ is a strong reducing agent** ($d^4 \\rightarrow d^3$, giving the stable $t_{2g}^3$): $2\\ce{Cr^{2+}} + 2\\ce{H+} \\rightarrow 2\\ce{Cr^{3+}} + \\ce{H2}$. **$\\ce{Mn^{3+}}$ is a strong oxidising agent** ($d^4 \\rightarrow d^5$, giving the stable half-filled $\\ce{Mn^{2+}}$) — the $\\ce{Mn^{3+}}/\\ce{Mn^{2+}}$ couple is much more positive than $\\ce{Cr^{3+}}/\\ce{Cr^{2+}}$ or $\\ce{Fe^{3+}}/\\ce{Fe^{2+}}$.\n\n' +
      '**The f-block consequence**\n' +
      '- **Lanthanoid contraction** — the steady size decrease as $4f$ fills — makes the **second and third transition series nearly the same size**, e.g. **$\\ce{Zr} \\approx \\ce{Hf}$** (Zr 160 pm, Hf 159 pm), so they are very hard to separate.\n' +
      '- Among the lanthanoids the predominant state is **+3**; the exceptions are **$\\ce{Ce^{4+}}$ (a strong oxidant**, $f^0$) and **$\\ce{Eu^{2+}}$ / $\\ce{Yb^{2+}}$ (reductants**, $f^7$ / $f^{14}$).'),

    // ─────────────────────────── THE DECODE SKILL ───────────────────────────
    h.heading('🔍 Decode This — the skill, in one place', 'Convert any NCERT statement-and-reason line into the exam question it becomes.'),
    h.callout('note', '🔍 Decode This — how an NCERT line becomes an exam question',
      'NCERT writes in **two patterns**, and examiners turn each into a standard question type. Spot the pattern, pre-write the question.\n\n' +
      '**Pattern 1 — "X because Y" → an Assertion–Reason question.** Take the fact as the **Assertion (A)** and the reason as the **Reason (R)**. Then decide: are both true, and does R actually explain A?\n\n' +
      '> *Mini-example (from this chapter).* NCERT: *"Cu²⁺(aq) is more stable than Cu⁺(aq) because its much more negative hydration enthalpy more than compensates for the second ionisation enthalpy."*\n' +
      '> - **A:** $\\ce{Cu+}$ disproportionates in aqueous solution.\n' +
      '> - **R:** The hydration enthalpy of $\\ce{Cu^{2+}}$ is much more negative than that of $\\ce{Cu+}$.\n' +
      '> - **Answer:** Both true, **and R correctly explains A** — the extra hydration energy released on forming $\\ce{Cu^{2+}}$ outweighs the second ionisation enthalpy, so $2\\ce{Cu+} \\rightarrow \\ce{Cu^{2+}} + \\ce{Cu}$ is favoured.\n\n' +
      '**Pattern 2 — a paragraph of facts → a "which of the following statements is correct" question.** When NCERT lists several properties together, an examiner mixes the true lines with one **flipped** line and asks you to pick the correct (or the wrong) one.\n\n' +
      '> *Mini-example (from this chapter).* NCERT lists: *Mn shows +2 to +7; Zn shows only +2; Sc shows only +3; Ti(IV) is more stable than Ti(II).* An exam turns this into four options, swapping one for a falsehood like *"Zinc shows +2, +4 and +6."* The correct statement is the one that **matches NCERT word-for-word** — here, *"Zinc shows only +2 because no $d$ electrons are involved."*\n\n' +
      '**The habit:** every time NCERT says *"X because Y,"* read it as a ready-made A–R question (A = X, R = Y); every time NCERT lists facts, expect one of them to be flipped. Learn the NCERT line and you have already answered the exam.'),

    // ─────────────────────────── RECAP ───────────────────────────
    h.recap([
      { label: 'Colour', text: 'Colour comes from a **$d$–$d$ transition**; you see the **complementary** colour. $3d^0$ ($\\ce{Sc^{3+}}$, $\\ce{Ti^{4+}}$) and $3d^{10}$ ($\\ce{Zn^{2+}}$) are **colourless**. Anchor: $\\ce{V^{2+}}$/$\\ce{Cr^{3+}}$/$\\ce{Mn^{3+}}$ violet; $\\ce{Mn^{2+}}$ pink, $\\ce{Fe^{3+}}$ yellow.' },
      { label: 'Magnetism', text: '$\\mu = \\sqrt{n(n+2)}$ BM. The ladder: $n = 1,2,3,4,5 \\Rightarrow \\mu = 1.73, 2.83, 3.87, 4.90, 5.92$ BM. Read it backwards to go from a given $\\mu$ to the ion.' },
      { label: 'Oxidation map', text: 'Mn reaches **+2 to +7**; up to Mn the max O.S. = number of $(3d + 4s)$ electrons (Sc +3, Ti +4, V +5, Cr +6, Mn +7). High states live in **oxides, oxoanions, fluorides**.' },
      { label: 'Anomalies', text: 'Cr = $3d^5 4s^1$, Cu = $3d^{10} 4s^1$; $\\ce{Cu+}$ disproportionates; Cu has **positive $E^\\ominus$** (no $\\ce{H2}$); Zn/Cd/Hg not transition; $E^\\ominus$ for Mn, Ni, Zn extra-negative; $\\ce{Cr^{2+}}$ reducing, $\\ce{Mn^{3+}}$ oxidising.' },
      { label: 'f-block', text: 'Lanthanoid contraction → **$\\ce{Zr} \\approx \\ce{Hf}$**. Predominant lanthanoid state +3; $\\ce{Ce^{4+}}$ is an oxidant, $\\ce{Eu^{2+}}$/$\\ce{Yb^{2+}}$ are reductants.' },
      { label: 'The skill', text: 'NCERT *"X because Y"* → an **A–R** question (A = X, R = Y); a paragraph of facts → a **"which statement is correct"** question with one line flipped.' },
    ]),

    // ─────────────────────────── MIXED QUIZ ───────────────────────────
    h.quiz([
      {
        question: 'In aqueous solution, which pair of ions is **colourless** because the $d$ subshell allows no $d$–$d$ transition?',
        options: [
          '$\\ce{Mn^{2+}}$ ($3d^5$) and $\\ce{Fe^{3+}}$ ($3d^5$)',
          '$\\ce{Sc^{3+}}$ ($3d^0$) and $\\ce{Zn^{2+}}$ ($3d^{10}$)',
          '$\\ce{Cr^{3+}}$ ($3d^3$) and $\\ce{Cu^{2+}}$ ($3d^9$)',
          '$\\ce{Ti^{3+}}$ ($3d^1$) and $\\ce{Ni^{2+}}$ ($3d^8$)',
        ],
        correct_index: 1,
        explanation: '$\\ce{Sc^{3+}}$ has an empty $3d$ subshell ($3d^0$) and $\\ce{Zn^{2+}}$ a completely filled one ($3d^{10}$), so no electron can jump between $d$ orbitals — no $d$–$d$ transition, hence colourless. $\\ce{Mn^{2+}}$ is pink and $\\ce{Fe^{3+}}$ yellow; $\\ce{Cr^{3+}}$ violet and $\\ce{Cu^{2+}}$ blue; $\\ce{Ti^{3+}}$ purple and $\\ce{Ni^{2+}}$ green — all coloured.',
      },
      {
        question: 'A divalent first-series ion in aqueous solution has a spin-only magnetic moment of $5.92$ BM. The ion is most likely:',
        options: [
          '$\\ce{Ni^{2+}}$ ($3d^8$)',
          '$\\ce{Cr^{2+}}$ ($3d^4$)',
          '$\\ce{Mn^{2+}}$ ($3d^5$)',
          '$\\ce{Cu^{2+}}$ ($3d^9$)',
        ],
        correct_index: 2,
        explanation: 'Run the ladder backwards: $\\mu = 5.92$ BM corresponds to $n = 5$ unpaired electrons ($\\sqrt{5\\times7} = 5.92$). A divalent ion with five unpaired electrons is $3d^5$ — $\\ce{Mn^{2+}}$. $\\ce{Ni^{2+}}$ ($n=2$) gives 2.83, $\\ce{Cr^{2+}}$ ($n=4$) gives 4.90, $\\ce{Cu^{2+}}$ ($n=1$) gives 1.73 BM.',
      },
      {
        question: 'Up to manganese, the maximum oxidation state of reasonable stability equals the number of $(3d + 4s)$ electrons. For chromium ($3d^5 4s^1$) this maximum state, shown in $\\ce{CrO4^{2-}}$ and $\\ce{Cr2O7^{2-}}$, is:',
        options: ['+7', '+6', '+5', '+3'],
        correct_index: 1,
        explanation: 'Cr is $3d^5 4s^1$, giving $5 + 1 = 6$ electrons available for bonding, so the maximum oxidation state is +6 — exactly the state in $\\ce{CrO4^{2-}}$ and $\\ce{Cr2O7^{2-}}$. +7 belongs to Mn (seven $(3d+4s)$ electrons, as in $\\ce{MnO4-}$); +3 is Cr’s most common but not its maximum.',
      },
      {
        question: 'Which of the following statements is **correct**?',
        options: [
          'Zinc, cadmium and mercury are typical transition elements because they have partly filled $d$ orbitals.',
          'Copper is oxidised by dilute acids and readily liberates $\\ce{H2}$ from them.',
          'Copper has a positive $E^\\ominus$ ($\\ce{Cu^{2+}}/\\ce{Cu}$) and therefore cannot liberate $\\ce{H2}$ from acids.',
          'In the 3d series the maximum oxidation states appear at the two ends and the fewest in the middle.',
        ],
        correct_index: 2,
        explanation: 'Cu alone in the first series has a positive electrode potential ($+0.34$ V), so it is not oxidised by $1\\,\\text{M}\\ \\ce{H+}$ and cannot displace $\\ce{H2}$. Zn/Cd/Hg ($d^{10}$ ions) are **not** regarded as transition elements; the widest range of oxidation states sits in the **middle** of the series (Mn, +2 to +7), not at the ends.',
      },
      {
        question: 'Assertion (A): The second and third transition series have very similar atomic radii — for instance $\\ce{Zr}$ and $\\ce{Hf}$ are almost identical in size.\nReason (R): The lanthanoid contraction, the steady decrease in size as the $4f$ orbitals fill, almost cancels the expected increase down the group.\nChoose the correct option:',
        options: [
          'A is true but R is false',
          'A is false but R is true',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are true and R explains A: the filling of $4f$ (lanthanoid contraction) shrinks the elements that follow, so the third-series atoms end up nearly the same size as the second-series ones above them — Zr (160 pm) $\\approx$ Hf (159 pm), which is why the two are notoriously hard to separate.',
      },
      {
        question: 'Why is $\\ce{Cr^{2+}}$ a strong reducing agent while $\\ce{Mn^{3+}}$ is a strong oxidising agent?',
        options: [
          'Both ions are colourless and so are highly reactive',
          '$\\ce{Cr^{2+}}$ ($d^4$) is oxidised to the stable $d^3$ of $\\ce{Cr^{3+}}$, while $\\ce{Mn^{3+}}$ ($d^4$) is reduced to the stable half-filled $d^5$ of $\\ce{Mn^{2+}}$',
          '$\\ce{Cr^{2+}}$ has a fully filled $d$ subshell and $\\ce{Mn^{3+}}$ an empty one',
          'Chromium lies below manganese in the same group, so their potentials are reversed by the inert pair effect',
        ],
        correct_index: 1,
        explanation: 'Both ions start at $d^4$. $\\ce{Cr^{2+}}$ readily loses an electron to reach the stable $d^3$ ($t_{2g}^3$) of $\\ce{Cr^{3+}}$ — hence a reducing agent ($2\\ce{Cr^{2+}} + 2\\ce{H+} \\rightarrow 2\\ce{Cr^{3+}} + \\ce{H2}$). $\\ce{Mn^{3+}}$ readily gains an electron to reach the stable half-filled $d^5$ of $\\ce{Mn^{2+}}$ — hence an oxidising agent, which is why the $\\ce{Mn^{3+}}/\\ce{Mn^{2+}}$ couple is so positive.',
      },
    ], 0.6),
  ],
};
