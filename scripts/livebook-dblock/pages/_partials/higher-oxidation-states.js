// Ch.5 (d- & f-Block) · Page 8 · Stability of Higher Oxidation States (NCERT §8.3.7).
// NCERT content transcribed faithfully (Table 8.5 halides, Table 8.6 oxides, the oxide /
// fluorine stabilisation paragraph, Cu(I) disproportionation, the Cu2+ stability line,
// the Mn2O7 bridge, Example 8.5, In-text 8.6); enrichment only in "Exam Point" callouts.
// Device: 🔍 Decode This (highest fluoride MnF4 vs highest oxide Mn2O7). Recap + quiz.
module.exports = {
  page_number: 8,
  chapter: 5,
  slug: 'higher-oxidation-states',
  title: 'Stability of Higher Oxidation States',
  subtitle: 'Which halides and oxides actually reach the high oxidation numbers, why fluorine and oxygen are the two elements that pin a metal at its top state, why Mn₂O₇ goes only as high as oxygen lets it, and why Cu²⁺ wins over Cu⁺ in water.',
  tags: ['d-block', 'transition-metals', 'higher-oxidation-states', 'oxides', 'halides', 'high-yield'],
  reading_time_min: 8,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: two facing "ladders" for manganese — on the left a fluorine ladder topping out at a rung labelled "MnF4 (+4)", on the right an oxygen ladder climbing higher to a rung labelled "Mn2O7 (+7)", with a small green oily drop drawn at the very top. Between them, a tiny molecular sketch of Mn2O7 showing two tetrahedra of oxygen joined by a bridging O (a Mn–O–Mn bridge). A faint caption space at the base reading "oxygen reaches higher than fluorine". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Fluorine takes Mn only to MnF₄, but oxygen takes it all the way to Mn₂O₇ (+7) — oxygen, with its ability to form multiple bonds, stabilises the highest states.'
    ),

    h.text(
      'A transition metal can reach a high oxidation number only when the right partner element is bonded to it. In practice two elements do this job — **fluorine** and **oxygen**. This page looks at the stable halides (Table 8.5) and oxides (Table 8.6) of the 3d metals to see exactly how high each state climbs, and why.'
    ),

    h.heading('Higher oxidation states in the halides', 'Use Table 8.5 to identify the highest oxidation numbers reached in the halides and explain why fluorine is special.'),
    h.text(
      'Table 8.5 shows the stable halides of the 3d series of transition metals. The highest oxidation numbers are achieved in $\\ce{TiX4}$ (tetrahalides), $\\ce{VF5}$ and $\\ce{CrF6}$. The +7 state for Mn is not represented in simple halides but $\\ce{MnO3F}$ is known, and beyond Mn no metal has a trihalide except $\\ce{FeX3}$ and $\\ce{CoF3}$. **The ability of fluorine to stabilise the highest oxidation state is due to either higher lattice energy as in the case of $\\ce{CoF3}$, or higher bond enthalpy terms for the higher covalent compounds, e.g., $\\ce{VF5}$ and $\\ce{CrF6}$.**'
    ),
    h.text(
      'Although $\\ce{V^V}$ is represented only by $\\ce{VF5}$, the other halides, however, undergo hydrolysis to give oxohalides, $\\ce{VOX3}$. Another feature of fluorides is their instability in the low oxidation states e.g., $\\ce{VX2}$ ($\\ce{X}$ = Cl, Br or I) and the same applies to CuX. On the other hand, all $\\ce{Cu^{II}}$ halides are known except the iodide. In this case, $\\ce{Cu^2+}$ oxidises $\\ce{I-}$ to $\\ce{I2}$:\n\n$$\\ce{2Cu^2+ + 4I- -> Cu2I2(s) + I2}$$'
    ),

    h.table(
      ['O.N.', '4 (Ti)', '5 (V)', '6 (Cr)', '7 (Mn)', '8 (Fe)', '9 (Co)', '10 (Ni)', '11 (Cu)', '12 (Zn)'],
      [
        ['+6', '', '', '$\\ce{CrF6}$', '', '', '', '', '', ''],
        ['+5', '', '$\\ce{VF5}$', '$\\ce{CrF5}$', '', '', '', '', '', ''],
        ['+4', '$\\ce{TiX4}$', '$\\ce{VX^I4}$', '$\\ce{CrX4}$', '$\\ce{MnF4}$', '', '', '', '', ''],
        ['+3', '$\\ce{TiX3}$', '$\\ce{VX3}$', '$\\ce{CrX3}$', '$\\ce{MnF3}$', '$\\ce{FeX^I3}$', '$\\ce{CoF3}$', '', '', ''],
        ['+2', '$\\ce{TiX^{III}2}$', '$\\ce{VX2}$', '$\\ce{CrX2}$', '$\\ce{MnX2}$', '$\\ce{FeX2}$', '$\\ce{CoX2}$', '$\\ce{NiX2}$', '$\\ce{CuX^{II}2}$', '$\\ce{ZnX2}$'],
        ['+1', '', '', '', '', '', '', '', '$\\ce{CuX^{III}}$', ''],
      ],
      'Table 8.5 — Formulas of Halides of 3d Metals. Key: X = F → I; Xᴵ = F → Br; Xᴵᴵ = F, Cl; Xᴵᴵᴵ = Cl → I.'
    ),

    h.text(
      'However, many copper (I) compounds are unstable in aqueous solution and undergo **disproportionation**:\n\n$$\\ce{2Cu^+ -> Cu^2+ + Cu}$$\n\n**The stability of $\\ce{Cu^2+}(aq)$ rather than $\\ce{Cu^+}(aq)$ is due to the much more negative $\\Delta_{hyd}H^\\ominus$ of $\\ce{Cu^2+}(aq)$ than $\\ce{Cu^+}$, which more than compensates for the second ionisation enthalpy of Cu.**'
    ),

    h.heading('Higher oxidation states in the oxides', 'Use Table 8.6 to show how oxygen stabilises the highest oxidation states, and describe the structure of Mn₂O₇.'),
    h.text(
      '**The ability of oxygen to stabilise the highest oxidation state is demonstrated in the oxides.** The highest oxidation number in the oxides coincides with the group number and is attained in $\\ce{Sc2O3}$ to $\\ce{Mn2O7}$. Beyond Group 7, no higher oxides of Fe above $\\ce{Fe2O3}$ are known, although ferrates (VI) $\\ce{(FeO4)^{2-}}$ are formed in alkaline media but they readily decompose to $\\ce{Fe2O3}$ and $\\ce{O2}$. Besides the oxides, oxocations stabilise $\\ce{V^V}$ as $\\ce{VO2+}$, $\\ce{V^{IV}}$ as $\\ce{VO^2+}$ and $\\ce{Ti^{IV}}$ as $\\ce{TiO^2+}$.'
    ),
    h.text(
      'The ability of oxygen to stabilise these high oxidation states exceeds that of fluorine. Thus the highest Mn fluoride is $\\ce{MnF4}$ whereas the highest Mn oxide is $\\ce{Mn2O7}$. The ability of oxygen to form multiple bonds to metals explains its superiority. **In the covalent oxide $\\ce{Mn2O7}$, each Mn is tetrahedrally surrounded by O\'s including a Mn–O–Mn bridge.** The tetrahedral $\\ce{[MO4]^{n-}}$ ions are known for $\\ce{V^V}$, $\\ce{Cr^{VI}}$, $\\ce{Mn^V}$, $\\ce{Mn^{VI}}$ and $\\ce{Mn^{VII}}$.'
    ),

    h.table(
      ['O.N.', '3 (Sc)', '4 (Ti)', '5 (V)', '6 (Cr)', '7 (Mn)', '8 (Fe)', '9 (Co)', '10 (Ni)', '11 (Cu)', '12 (Zn)'],
      [
        ['+7', '', '', '', '', '$\\ce{Mn2O7}$', '', '', '', '', ''],
        ['+6', '', '', '', '$\\ce{CrO3}$', '', '', '', '', '', ''],
        ['+5', '', '', '$\\ce{V2O5}$', '', '', '', '', '', '', ''],
        ['+4', '', '$\\ce{TiO2}$', '$\\ce{V2O4}$', '$\\ce{CrO2}$', '$\\ce{MnO2}$', '', '', '', '', ''],
        ['+3', '$\\ce{Sc2O3}$', '$\\ce{Ti2O3}$', '$\\ce{V2O3}$', '$\\ce{Cr2O3}$', '$\\ce{Mn2O3}$, $\\ce{Mn3O4}^*$', '$\\ce{Fe2O3}$, $\\ce{Fe3O4}^*$', '$\\ce{Co3O4}^*$', '', '', ''],
        ['+2', '', '$\\ce{TiO}$', '$\\ce{VO}$', '$(\\ce{CrO})$', '$\\ce{MnO}$', '$\\ce{FeO}$', '$\\ce{CoO}$', '$\\ce{NiO}$', '$\\ce{CuO}$', '$\\ce{ZnO}$'],
        ['+1', '', '', '', '', '', '', '', '', '$\\ce{Cu2O}$', ''],
      ],
      'Table 8.6 — Oxides of 3d Metals. (* = mixed oxides.)'
    ),

    h.callout('exam_tip', 'Exam Point — fluorine vs oxygen, in one line',
      'Both fluorine and oxygen stabilise high oxidation states, **but oxygen goes higher**:\n\n' +
      '- **Fluorine** wins by **σ-bonding** — high lattice energy ($\\ce{CoF3}$) or strong covalent bonds ($\\ce{VF5}$, $\\ce{CrF6}$).\n' +
      '- **Oxygen** wins **and beats fluorine** because it can also form **multiple (π) bonds** to the metal. That extra bonding is why the highest Mn fluoride stops at $\\ce{MnF4}$ but the highest Mn oxide reaches $\\ce{Mn2O7}$ (+7).\n\n' +
      'One-line takeaway: **F → high; O → highest** (oxygen, thanks to multiple bonding).'),

    h.worked('NCERT Example 8.5', 'solved_example',
      'How would you account for the increasing oxidising power in the series $\\ce{VO2+}$ < $\\ce{Cr2O7^{2-}}$ < $\\ce{MnO4-}$?',
      'This is due to the increasing stability of the lower species to which they are reduced.'),
    h.worked('NCERT In-text Question 8.6', 'ncert_intext',
      'Why is the highest oxidation state of a metal exhibited in its oxide or fluoride only?',
      'Oxygen and fluorine are small, highly electronegative atoms, so they can oxidise the metal to its top state. Fluorine does it through high lattice energy or strong covalent ($\\sigma$) bonds; oxygen does it the same way **and** through its ability to form multiple (π) bonds to the metal. Because these two elements supply the extra bonding energy needed, the very highest oxidation states (e.g. Mn as $\\ce{Mn2O7}$, Cr as $\\ce{CrF6}$ and $\\ce{CrO3}$) appear **only** in the oxides and fluorides — and oxygen reaches even higher than fluorine.'),

    // ── DEVICE: the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT often hides a comparison inside one sentence. Here it pins manganese twice — once for fluorine, once for oxygen:\n\n' +
      '> **NCERT (fact):** *"The highest Mn fluoride is $\\ce{MnF4}$ whereas the highest Mn oxide is $\\ce{Mn2O7}$."*\n' +
      '> **NCERT (reason):** *"The ability of oxygen to form multiple bonds to metals explains its superiority."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** Manganese reaches +7 in its oxide ($\\ce{Mn2O7}$) but only +4 in its highest fluoride ($\\ce{MnF4}$).\n' +
      '- **Reason (R):** Oxygen can form multiple bonds to the metal, so it stabilises higher oxidation states than fluorine can.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** whenever NCERT contrasts the *highest fluoride* with the *highest oxide*, expect "oxide goes higher, because oxygen makes multiple bonds." That single fact ($\\ce{MnF4}$ vs $\\ce{Mn2O7}$) is the favourite exam example.'),

    h.recap([
      { label: 'Top halides', text: 'Highest halide states: $\\ce{TiX4}$, $\\ce{VF5}$, $\\ce{CrF6}$. Mn\'s +7 is **not** a simple halide (but $\\ce{MnO3F}$ exists); beyond Mn only $\\ce{FeX3}$ and $\\ce{CoF3}$ are trihalides.' },
      { label: 'Why fluorine', text: 'Fluorine stabilises the top state through **high lattice energy** ($\\ce{CoF3}$) or **strong covalent bonds** ($\\ce{VF5}$, $\\ce{CrF6}$).' },
      { label: 'Why oxygen beats it', text: 'Oxygen stabilises high states **and exceeds fluorine** because it can form **multiple bonds**: highest Mn fluoride is $\\ce{MnF4}$, but highest Mn oxide is $\\ce{Mn2O7}$.' },
      { label: 'Mn₂O₇ structure', text: 'In the covalent oxide $\\ce{Mn2O7}$, **each Mn is tetrahedrally surrounded by O\'s, including a Mn–O–Mn bridge**. Tetrahedral $\\ce{[MO4]^{n-}}$ ions exist for $\\ce{V^V}$, $\\ce{Cr^{VI}}$, $\\ce{Mn^V}$, $\\ce{Mn^{VI}}$, $\\ce{Mn^{VII}}$.' },
      { label: 'Oxidising-power order', text: '$\\ce{VO2+}$ < $\\ce{Cr2O7^{2-}}$ < $\\ce{MnO4-}$ — the order follows the **increasing stability of the lower species** each is reduced to.' },
      { label: 'Cu²⁺ over Cu⁺', text: '$\\ce{Cu^+}$ disproportionates ($\\ce{2Cu^+ -> Cu^2+ + Cu}$). $\\ce{Cu^2+}(aq)$ wins because its **much more negative $\\Delta_{hyd}H^\\ominus$** more than compensates for the second ionisation enthalpy.' },
    ]),

    h.quiz([
      {
        question: 'The highest oxidation state of manganese is found in:',
        options: [
          'its fluoride $\\ce{MnF4}$',
          'its oxide $\\ce{Mn2O7}$',
          'its chloride $\\ce{MnCl4}$',
          'its sulphide $\\ce{MnS}$',
        ],
        correct_index: 1,
        explanation: 'Mn reaches its top state, +7, only in $\\ce{Mn2O7}$. Its highest fluoride is just $\\ce{MnF4}$ (+4) — oxygen, by forming multiple bonds, stabilises a higher state than fluorine can.',
      },
      {
        question: 'In the covalent oxide $\\ce{Mn2O7}$, each manganese atom is:',
        options: [
          'octahedrally surrounded by six oxygens',
          'square-planar with four oxygens',
          'tetrahedrally surrounded by oxygens, including a Mn–O–Mn bridge',
          'linearly bonded to two oxygens only',
        ],
        correct_index: 2,
        explanation: 'NCERT states each Mn in $\\ce{Mn2O7}$ is tetrahedrally surrounded by O\'s with a bridging Mn–O–Mn oxygen joining the two tetrahedra. It is not octahedral, square-planar or linear.',
      },
      {
        question: 'Fluorine stabilises the highest oxidation state of a metal mainly because of:',
        options: [
          'its ability to form multiple (π) bonds to the metal',
          'its very large atomic size',
          'its tendency to lower the oxidation number by hydrolysis',
          'its high lattice energy or high bond enthalpy in the higher covalent compounds',
        ],
        correct_index: 3,
        explanation: 'For fluorine the stabilising factor is high lattice energy (e.g. $\\ce{CoF3}$) or strong covalent bonds (e.g. $\\ce{VF5}$, $\\ce{CrF6}$). Multiple-bond (π) ability is oxygen\'s advantage — that is why oxygen reaches even higher states than fluorine.',
      },
      {
        question: 'Assertion (A): The highest oxidation state of a 3d metal appears only in its oxide or fluoride.\nReason (R): Oxygen and fluorine are highly electronegative and supply the extra bonding (high lattice/bond energy, and π-bonding for oxygen) needed to reach the top state.\nChoose the correct option:',
        options: [
          'Both A and R are true, and R is the correct explanation of A',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'A is true but R is false',
          'A is false but R is true',
        ],
        correct_index: 0,
        explanation: 'Both are true and R explains A: only the small, electronegative O and F can supply the lattice/bond energy (and, for oxygen, multiple bonding) needed to pin the metal at its highest state — so those top states show up only in oxides and fluorides.',
      },
      {
        question: 'The oxidising power increases in the order $\\ce{VO2+}$ < $\\ce{Cr2O7^{2-}}$ < $\\ce{MnO4-}$. The reason is:',
        options: [
          'the increasing number of oxygen atoms in the formula',
          'the decreasing electronegativity of the central metal',
          'the increasing stability of the lower species to which each is reduced',
          'the increasing size of the central metal ion',
        ],
        correct_index: 2,
        explanation: 'NCERT (Example 8.5) attributes the rising oxidising power to the increasing stability of the reduced (lower) species formed. The count of oxygens, metal size and electronegativity are not the stated reason.',
      },
      {
        question: 'Why is $\\ce{Cu^2+}(aq)$ more stable than $\\ce{Cu^+}(aq)$, so that $\\ce{Cu^+}$ disproportionates in water?',
        options: [
          'the first ionisation enthalpy of Cu is unusually low',
          'the much more negative hydration enthalpy of $\\ce{Cu^2+}$ more than compensates for the second ionisation enthalpy',
          '$\\ce{Cu^+}$ is coloured while $\\ce{Cu^2+}$ is colourless',
          '$\\ce{Cu^2+}$ has a stable half-filled $d^5$ configuration',
        ],
        correct_index: 1,
        explanation: 'The strongly negative $\\Delta_{hyd}H^\\ominus$ of $\\ce{Cu^2+}$ outweighs the energy cost of the second ionisation, so $\\ce{Cu^2+}(aq)$ wins and $\\ce{Cu^+}$ disproportionates ($\\ce{2Cu^+ -> Cu^2+ + Cu}$). Cu²⁺ is $3d^9$ (not $d^5$) and is the coloured ion.',
      },
    ], 0.6),
  ],
};
