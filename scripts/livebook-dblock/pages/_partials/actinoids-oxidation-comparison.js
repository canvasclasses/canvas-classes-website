// Ch.5 (d- & f-Block) · Page 19 · Actinoids — Oxidation States & Comparison
// NCERT §8.6.3 Oxidation States + §8.6.4 General Characteristics and Comparison
// with Lanthanoids (PDF pp.231-232).
// NCERT content transcribed faithfully (same language/numbers/Table 8.11);
// enrichment from the founder's notes is confined to the "Exam Point" callouts.
// Devices: "🔍 Decode This" (A-R trainer) + "🏛️ Exam Vault" (answer-verified PYQ).
// Places NCERT In-text Question 8.10 (why actinoid contraction > lanthanoid).
// Ends with a Quick Recap + a textbook quiz in real exam formats.
module.exports = {
  page_number: 19,
  chapter: 5,
  slug: 'actinoids-oxidation-comparison',
  title: 'Actinoids — Oxidation States & Comparison',
  subtitle: 'Why the actinoids show far more oxidation states than the lanthanoids, how the maximum state climbs +4 → +5 → +6 → +7 then falls, and exactly where the two f-block series agree and differ.',
  tags: ['f-block', 'actinoids', 'lanthanoids', 'oxidation-states', 'comparison'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: a rising-then-falling staircase across the early actinoids — steps labelled "Th +4", "Pa +5", "U +6", "Np +7", with the staircase peaking at Np and then a downward arrow showing the maximum state decreasing in later elements. Three faint overlapping energy bands drawn close together labelled "5f", "6d", "7s" with a note "comparable energies". To one side, a small split panel comparing "Lanthanoids: mostly +3" vs "Actinoids: +3 to +7". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'The maximum actinoid oxidation state climbs +4 → +5 → +6 → +7 to neptunium, then falls — because 5f, 6d and 7s lie close in energy.'
    ),

    h.heading('8.6.3 Oxidation States', 'Explain why the actinoids show a greater range of oxidation states than the lanthanoids, and trace the maximum state from Th to Np.'),
    h.text(
      'There is a **greater range of oxidation states**, which is in part attributed to the fact that the **$5f$, $6d$ and $7s$ levels are of comparable energies.** The known oxidation states of actinoids are listed in **Table 8.11**.\n\n' +
      'The actinoids show in general **+3 oxidation state.** The elements, in the first half of the series frequently exhibit higher oxidation states. For example, the maximum oxidation state increases from **+4 in Th to +5, +6 and +7 respectively in Pa, U and Np but decreases in succeeding elements** (Table 8.11). The actinoids resemble the lanthanoids in having more compounds in **+3 state than in the +4 state.** However, +3 and +4 ions tend to hydrolyse. Because the distribution of oxidation states among the actinoids is so uneven and so different for the earlier and latter elements, it is unsatisfactory to review their chemistry in terms of oxidation states.'
    ),

    h.table(
      ['Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr'],
      [
        ['3', '', '3', '3', '3', '3', '3', '3', '3', '3', '3', '3', '3', '3', '3'],
        ['', '4', '4', '4', '4', '4', '4', '4', '4', '', '', '', '', '', ''],
        ['', '', '5', '5', '5', '5', '5', '', '', '', '', '', '', '', ''],
        ['', '', '', '6', '6', '6', '6', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '7', '7', '', '', '', '', '', '', '', '', ''],
      ],
      'Table 8.11 — Oxidation States of Actinium and Actinoids. The +3 state runs throughout; the maximum state rises +4 (Th) → +5 (Pa) → +6 (U) → +7 (Np) and then falls back in the later elements.'
    ),

    h.callout('exam_tip', 'Exam Point — the +4 → +5 → +6 → +7 ladder, then back down',
      'For the **early actinoids**, the maximum oxidation state simply climbs one step at a time and peaks at neptunium:\n\n' +
      '- **Th → +4**, **Pa → +5**, **U → +6**, **Np → +7** (this is the peak).\n' +
      '- After Np the maximum state **decreases** again in Pu, Am, Cm …\n\n' +
      'The reason to quote: $5f$, $6d$ and $7s$ lie at **comparable energies**, so several electrons are easily available — unlike the deeply buried $4f$ of the lanthanoids, which keeps them mostly at +3.'),

    h.heading('8.6.4 General Characteristics and Comparison with Lanthanoids', 'Compare the actinoids and lanthanoids in structure, reactivity, magnetism, ionisation enthalpy and the extent of their contractions.'),
    h.text(
      'The actinoid metals are all **silvery in appearance** but display a variety of structures. The structural variability is obtained due to irregularities in metallic radii which are far greater than in lanthanoids.\n\n' +
      'The actinoids are **highly reactive metals**, especially when finely divided. The action of boiling water on them, for example, gives a mixture of oxide and hydride and combination with most non metals takes place at moderate temperatures. Hydrochloric acid attacks all metals but most are slightly affected by nitric acid owing to the formation of protective oxide layers; alkalies have no action.\n\n' +
      'The **magnetic properties** of the actinoids are more complex than those of the lanthanoids. Although the variation in the magnetic susceptibility of the actinoids with the number of unpaired $5f$ electrons is roughly parallel to the corresponding results for the lanthanoids, **the latter have higher values.**'
    ),
    h.text(
      'It is evident from the behaviour of the actinoids that the **ionisation enthalpies of the early actinoids, though not accurately known, are lower than for the early lanthanoids.** This is quite reasonable since it is to be expected that when $5f$ orbitals are beginning to be occupied, they will penetrate less into the inner core of electrons. The $5f$ electrons, will therefore, be more effectively shielded from the nuclear charge than the $4f$ electrons of the corresponding lanthanoids. Because the outer electrons are less firmly held, they are available for bonding in the actinoids.\n\n' +
      'A comparison of the actinoids with the lanthanoids, with respect to different characteristics as discussed above, reveals that behaviour similar to that of the lanthanoids is not evident until the second half of the actinoid series. However, even the early actinoids resemble the lanthanoids in showing close similarities with each other and in gradual variation in properties which do not entail change in oxidation state. The lanthanoid and actinoid contractions, have extended effects on the sizes, and therefore, the properties of the elements succeeding them in their respective periods. **The lanthanoid contraction is more important because the chemistry of elements succeeding the actinoids are much less known at the present time.**'
    ),

    // ── NCERT In-text Question 8.10 ──
    h.worked('NCERT In-text Question 8.10', 'ncert_intext',
      'Actinoid contraction is greater from element to element than lanthanoid contraction. Why?',
      'In the actinoids the **$5f$ electrons shield the nuclear charge more poorly** than the $4f$ electrons do in the lanthanoids. Because of this weaker shielding, the increasing nuclear charge is felt more strongly from one element to the next, so the atomic / $\\ce{M^{3+}}$ sizes shrink more steeply. Hence the **actinoid contraction is greater, element to element, than the lanthanoid contraction.**'),

    // ── 🔍 Decode This — the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"There is a greater range of oxidation states in the actinoids."*\n' +
      '> **NCERT (reason):** *"…the $5f$, $6d$ and $7s$ levels are of comparable energies."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** The actinoids show a wider range of oxidation states than the lanthanoids.\n' +
      '- **Reason (R):** In the actinoids the $5f$, $6d$ and $7s$ levels lie close in energy, so more electrons are easily available for bonding.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** read "more oxidation states **because** $5f$/$6d$/$7s$ are comparable in energy" straight off as A (the wider range), R (the comparable energy levels). Contrast it with the lanthanoids, whose buried $4f$ keeps them stuck at +3.'),

    // ── 🏛️ Exam Vault — answer-verified PYQ next to the NCERT line ──
    h.worked('🏛️ Exam Vault · JEE Main 2024 (PYQ)', 'solved_example',
      'The number of elements from the following that do NOT belong to the lanthanoids is: Eu, Cm, Er, Tb, Yb and Lu.',
      '**Answer: 1.** Run through the list: **Eu (63), Er (68), Tb (65), Yb (70), Lu (71)** are all lanthanoids (the fourteen elements following lanthanum). **Cm — curium (96)** belongs to the *actinoid* series (Th–Lr), not the lanthanoids. So exactly **one** element does not belong.\n\n' +
      '**Notice:** this rides directly on NCERT\'s two definitions — *"the lanthanoids (the fourteen elements following lanthanum)"* and *"the actinoids include the fourteen elements from Th to Lr."* Knowing which series each symbol sits in is all the question tests.'),

    h.recap([
      { label: 'Wider range', text: 'Actinoids show a **greater range of oxidation states** than lanthanoids because the **$5f$, $6d$ and $7s$ levels are of comparable energies.**' },
      { label: 'General +3', text: 'The **+3 state is general** (more +3 than +4 compounds, as in the lanthanoids); +3 and +4 ions tend to **hydrolyse**.' },
      { label: 'Max-state ladder', text: 'Maximum O.S. climbs **+4 (Th) → +5 (Pa) → +6 (U) → +7 (Np)**, then **decreases** in the later elements.' },
      { label: 'Reactivity & magnetism', text: 'Silvery, **highly reactive** metals; magnetism is more complex than the lanthanoids\' but the **lanthanoids show higher values**; early-actinoid ionisation enthalpies are **lower** than early lanthanoids\'.' },
      { label: 'The two contractions', text: 'Both contract across their series; the **actinoid contraction is greater** (poorer $5f$ shielding), but the **lanthanoid contraction is more important** because the chemistry beyond the actinoids is still little known.' },
    ]),

    h.quiz([
      {
        question: 'The actinoids show a greater range of oxidation states than the lanthanoids mainly because:',
        options: [
          'their $4f$ orbitals are deeply buried',
          'their $5f$, $6d$ and $7s$ levels are of comparable energies',
          'they are all radioactive',
          'the inert pair effect dominates the actinoids',
        ],
        correct_index: 1,
        explanation: 'NCERT attributes the wider range to the $5f$, $6d$ and $7s$ levels lying close in energy, so several electrons are easily available for bonding. The lanthanoids\' buried $4f$ is exactly why they are stuck near +3, and radioactivity does not control oxidation-state range.',
      },
      {
        question: 'Across the early actinoids the maximum oxidation state increases as:',
        options: [
          'Th +4 → Pa +5 → U +6 → Np +7, then decreases',
          'Th +3 → Pa +3 → U +3 → Np +3 throughout',
          'Th +7 → Pa +6 → U +5 → Np +4, rising afterwards',
          'it stays fixed at +6 for every actinoid',
        ],
        correct_index: 0,
        explanation: 'NCERT states the maximum state rises +4 (Th), +5 (Pa), +6 (U), +7 (Np) and then decreases in the succeeding elements. The +3 state is general, but the question asks for the maximum, which peaks at Np.',
      },
      {
        question: 'Which statement comparing the magnetic and ionisation behaviour of the two f-block series is correct?',
        options: [
          'The lanthanoids have higher magnetic values and the early lanthanoids have higher ionisation enthalpies than the early actinoids',
          'The actinoids have higher magnetic values and higher ionisation enthalpies',
          'Both series have identical magnetic and ionisation behaviour',
          'The early actinoids have higher ionisation enthalpies than the early lanthanoids',
        ],
        correct_index: 0,
        explanation: 'NCERT notes the actinoid magnetism roughly parallels the lanthanoids but the lanthanoids have higher values, and that the early actinoids have lower ionisation enthalpies (their $5f$ electrons are better shielded, so the outer electrons are less firmly held).',
      },
      {
        question: 'In which oxidation state do the actinoids, like the lanthanoids, form the greater number of compounds?',
        options: ['+3', '+4', '+6', '+7'],
        correct_index: 0,
        explanation: 'NCERT says the actinoids resemble the lanthanoids in having more compounds in the +3 state than the +4 state. The higher states (+5, +6, +7) appear only among the early actinoids, not as the general rule.',
      },
      {
        question: 'Why is the lanthanoid contraction said to be "more important" than the actinoid contraction, even though the actinoid contraction is the greater of the two?',
        options: [
          'because the lanthanoid contraction is larger element-to-element',
          'because the chemistry of the elements succeeding the actinoids is much less known at present',
          'because the actinoids are not radioactive',
          'because the lanthanoids have no $f$ electrons',
        ],
        correct_index: 1,
        explanation: 'NCERT states the lanthanoid contraction is more important because the chemistry of elements following the actinoids is much less known. The actinoid contraction is in fact greater element-to-element, so option (1) is wrong; the importance is about how far the consequences can be studied.',
      },
      {
        question: 'Assertion (A): The actinoid contraction is greater, element to element, than the lanthanoid contraction.\nReason (R): The $5f$ electrons shield the nuclear charge more poorly than the $4f$ electrons.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both are true and R explains A: poorer $5f$ shielding means the rising nuclear charge is felt more strongly from one actinoid to the next, so the sizes shrink more steeply — a larger contraction than in the lanthanoids, where $4f$ shields somewhat better.',
      },
    ], 0.6),
  ],
};
