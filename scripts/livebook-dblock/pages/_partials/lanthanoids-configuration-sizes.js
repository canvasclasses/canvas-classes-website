// Ch.5 (d- & f-Block) · Page 16 · The Lanthanoids — Configuration & Sizes
// NCERT §"The Inner Transition Elements (f-block)" intro + §8.5 The Lanthanoids
// + §8.5.1 Electronic Configurations + §8.5.2 Atomic and Ionic Sizes (PDF pp.227-228).
// NCERT content transcribed faithfully (same language/numbers/Table 8.9);
// enrichment from the founder's notes is confined to the "Exam Point" callouts.
// Devices: "🔍 Decode This" (A-R trainer) + "🏛️ Exam Vault" (answer-verified PYQ).
// Ends with a Quick Recap + a textbook quiz in real exam formats.
module.exports = {
  page_number: 16,
  chapter: 5,
  slug: 'lanthanoids-configuration-sizes',
  title: 'The Lanthanoids — Configuration & Sizes',
  subtitle: 'Why the fourteen elements after lanthanum sit in their own row, why their sizes shrink so steadily, and why that tiny shrinkage makes zirconium and hafnium almost impossible to tell apart.',
  tags: ['f-block', 'lanthanoids', 'inner-transition', 'lanthanoid-contraction', 'high-yield'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red, soft violet), no glow or neon. Central motif: a long horizontal row of fourteen small element tiles labelled La, Ce, Pr ... Lu, each tile drawn slightly smaller than the one before it to show a steady shrinking of size from left to right, with a faint downward-pointing 4f sub-shell sketched as a cloud of dots beneath the row. To the right, two nearly identical-sized atoms labelled "Zr" and "Hf" drawn almost on top of each other to show they are the same size. A small banner reads "the lanthanoid contraction". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'The lanthanoids shrink steadily across the row — and that shrinkage makes Zr and Hf almost the same size.'
    ),

    h.text(
      'The $f$-block consists of the two series, **lanthanoids** (the fourteen elements following lanthanum) and **actinoids** (the fourteen elements following actinium). Because lanthanum closely resembles the lanthanoids, it is usually included in any discussion of the lanthanoids, for which the general symbol **Ln** is often used. Similarly, a discussion of the actinoids includes actinium besides the fourteen elements constituting the series.\n\n' +
      'The lanthanoids resemble one another more closely than do the members of ordinary transition elements in any series. They have only **one stable oxidation state**, and their chemistry provides an excellent opportunity to examine the effect of small changes in size and nuclear charge along a series of otherwise similar elements. The chemistry of the actinoids is, on the other hand, much more complicated. The complication arises partly owing to the occurrence of a wide range of oxidation states in these elements and partly because their radioactivity creates special problems in their study; the two series will be considered separately here.'
    ),

    h.heading('8.5 The Lanthanoids', 'State that the lanthanoids are the fourteen elements following lanthanum, share the general symbol Ln, and have a single stable +3 oxidation state.'),
    h.text(
      'The names, symbols, electronic configurations of atomic and some ionic states and atomic and ionic radii of lanthanum and lanthanoids (for which the general symbol **Ln** is used) are given in **Table 8.9**.'
    ),

    h.heading('8.5.1 Electronic Configurations', 'Write the electronic configuration of a lanthanoid and its tripositive ion in the 4fⁿ form.'),
    h.text(
      'It may be noted that atoms of these elements have electronic configuration with **$6s^2$ common** but with variable occupancy of the $4f$ level (Table 8.9). However, the electronic configurations of all the tripositive ions (the most stable oxidation state of all the lanthanoids) are of the form **$4f^{\\,n}$** ($n = 1$ to $14$ with increasing atomic number).'
    ),

    h.table(
      ['Z', 'Name', 'Symbol', 'Ln', 'Ln²⁺', 'Ln³⁺', 'Radius Ln/pm', 'Radius Ln³⁺/pm'],
      [
        ['57', 'Lanthanum', 'La', '$5d^1 6s^2$', '$5d^1$', '$4f^0$', '187', '106'],
        ['58', 'Cerium', 'Ce', '$4f^1 5d^1 6s^2$', '$4f^2$', '$4f^1$', '183', '103'],
        ['59', 'Praseodymium', 'Pr', '$4f^3 6s^2$', '$4f^3$', '$4f^2$', '182', '101'],
        ['60', 'Neodymium', 'Nd', '$4f^4 6s^2$', '$4f^4$', '$4f^3$', '181', '99'],
        ['61', 'Promethium', 'Pm', '$4f^5 6s^2$', '$4f^5$', '$4f^4$', '181', '98'],
        ['62', 'Samarium', 'Sm', '$4f^6 6s^2$', '$4f^6$', '$4f^5$', '180', '96'],
        ['63', 'Europium', 'Eu', '$4f^7 6s^2$', '$4f^7$', '$4f^6$', '199', '95'],
        ['64', 'Gadolinium', 'Gd', '$4f^7 5d^1 6s^2$', '$4f^7 5d^1$', '$4f^7$', '180', '94'],
        ['65', 'Terbium', 'Tb', '$4f^9 6s^2$', '$4f^9$', '$4f^8$', '178', '92'],
        ['66', 'Dysprosium', 'Dy', '$4f^{10} 6s^2$', '$4f^{10}$', '$4f^9$', '177', '91'],
        ['67', 'Holmium', 'Ho', '$4f^{11} 6s^2$', '$4f^{11}$', '$4f^{10}$', '176', '89'],
        ['68', 'Erbium', 'Er', '$4f^{12} 6s^2$', '$4f^{12}$', '$4f^{11}$', '175', '88'],
        ['69', 'Thulium', 'Tm', '$4f^{13} 6s^2$', '$4f^{13}$', '$4f^{12}$', '174', '87'],
        ['70', 'Ytterbium', 'Yb', '$4f^{14} 6s^2$', '$4f^{14}$', '$4f^{13}$', '173', '86'],
        ['71', 'Lutetium', 'Lu', '$4f^{14} 5d^1 6s^2$', '$4f^{14} 5d^1$', '$4f^{14}$', '—', '—'],
      ],
      'Table 8.9 — Electronic Configurations and Radii of Lanthanum and Lanthanoids (only electrons outside the [Xe] core are indicated). Ce⁴⁺ = $4f^0$, Pr⁴⁺ = $4f^1$, Nd⁴⁺ = $4f^2$, Tb⁴⁺ = $4f^7$, Dy⁴⁺ = $4f^8$.'
    ),

    h.callout('exam_tip', 'Exam Point — the Ln³⁺ = 4fⁿ shortcut',
      'For any lanthanoid, the **+3 ion is the most stable state**, and its configuration is simply **$4f^{\\,n}$** where $n$ counts up with atomic number:\n\n' +
      '- La³⁺ → $4f^0$ (empty)\n' +
      '- Gd³⁺ → $4f^7$ (half-filled)\n' +
      '- Lu³⁺ → $4f^{14}$ (completely filled)\n\n' +
      'So to get the unpaired-electron count (and magnetism / colour) of any Ln³⁺, just read off $4f^{\\,n}$ from its place in the row — you never have to memorise fourteen separate ions.'),

    h.heading('8.5.2 Atomic and Ionic Sizes — the Lanthanoid Contraction', 'Define the lanthanoid contraction, give its cause (imperfect shielding by 4f electrons) and its consequences (Zr ≈ Hf; difficulty of separation).'),
    h.text(
      'The overall decrease in atomic and ionic radii from lanthanum to lutetium (the **lanthanoid contraction**) is a unique feature in the chemistry of the lanthanoids. It has far reaching consequences in the chemistry of the third transition series of the elements. The decrease in atomic radii (derived from the structures of metals) is not quite regular as it is regular in $\\ce{M^{3+}}$ ions (Fig. 8.6).\n\n' +
      'This contraction is, of course, **similar to that observed in an ordinary transition series and is attributed to the same cause, the imperfect shielding of one electron by another in the same sub-shell.** However, the shielding of one $4f$ electron by another is less than one $d$ electron by another with the increase in nuclear charge along the series. There is fairly regular decrease in the sizes with increasing atomic number.'
    ),
    h.img(
      'A hand-drawn coloured line graph on a deep charcoal (#121316) background, muted earthy palette, no glow or neon. X-axis labelled "Atomic number" running 57 to 71; Y-axis labelled "Ionic radii / pm" running about 85 to 110. Two gently downward-sloping series of small open circles, drawn as the NCERT Fig 8.6 trend: an upper line of Ln3+ ions descending from La3+ (about 106 pm) down to Lu3+ (about 86 pm), and a couple of outlier points marked Ce4+ and Pr4+ (smaller, lower) and Sm2+, Eu2+, Yb2+ (larger, higher). Hand-lettered title "Fig. 8.6 — Trends in ionic radii of lanthanoids". Chalk-and-coloured-pencil textbook plate. Landscape, desktop-friendly.',
      '16:9',
      'Fig. 8.6 — Trends in ionic radii of lanthanoids: a fairly regular decrease across the M³⁺ series.'
    ),
    h.text(
      'The cumulative effect of the contraction of the lanthanoid series, known as **lanthanoid contraction**, causes the radii of the members of the third transition series to be very similar to those of the corresponding members of the second series. The almost identical radii of **Zr (160 pm) and Hf (159 pm)**, a consequence of the lanthanoid contraction, account for their occurrence together in nature and for the **difficulty faced in their separation**.'
    ),

    // ── 🔍 Decode This — the "read between the lines" trainer ──
    h.callout('note', '🔍 Decode This — turn an NCERT line into an exam question',
      'NCERT keeps pairing a **fact** with its **reason**. Examiners lift that exact pair into an **Assertion–Reason** question. Watch how this page does it:\n\n' +
      '> **NCERT (fact):** *"There is a fairly regular decrease in the sizes (ionic radii) with increasing atomic number across the lanthanoids."*\n' +
      '> **NCERT (reason):** *"This contraction is attributed to the imperfect shielding of one $4f$ electron by another in the same sub-shell."*\n\n' +
      'Reassembled as the exam sees it:\n\n' +
      '- **Assertion (A):** The ionic radii of the lanthanoid $\\ce{M^{3+}}$ ions decrease steadily from La³⁺ to Lu³⁺.\n' +
      '- **Reason (R):** The $4f$ electrons shield one another from the nucleus imperfectly, so the growing nuclear charge pulls the outer shells in.\n\n' +
      '**Answer:** Both A and R are true, **and R is the correct explanation of A.**\n\n' +
      '**Your move:** whenever NCERT says *"sizes decrease **because** shielding is imperfect"*, read it as a ready-made Assertion–Reason question — A = the trend, R = the imperfect $4f$ shielding.'),

    // ── 🏛️ Exam Vault — answer-verified PYQ next to the NCERT line ──
    h.worked('🏛️ Exam Vault · JEE Main 2019 (PYQ)', 'solved_example',
      'The effect of lanthanoid contraction in the lanthanoid series of elements by and large means:\n\n(1) increase in atomic radii and decrease in ionic radii\n(2) decrease in atomic radii and increase in ionic radii\n(3) increase in both atomic and ionic radii\n(4) decrease in both atomic and ionic radii',
      '**Answer: (4) decrease in both atomic and ionic radii.** The lanthanoid contraction is precisely the **overall decrease in atomic and ionic radii from lanthanum to lutetium** — *both* the metallic (atomic) radii and the $\\ce{M^{3+}}$ ionic radii shrink across the series. Options (1)–(3) all keep one of the two radii rising, which contradicts the trend.\n\n' +
      '**Notice:** this is NCERT\'s opening sentence of §8.5.2, almost word for word — *"The overall decrease in atomic and ionic radii from lanthanum to lutetium (the lanthanoid contraction)…"*. Learn the NCERT line and you have already answered the exam.'),

    h.recap([
      { label: 'The f-block', text: 'Two series — **lanthanoids** (14 elements after La) and **actinoids** (14 after Ac). General symbol for a lanthanoid is **Ln**.' },
      { label: 'One stable state', text: 'Lanthanoids have only **one stable oxidation state, +3** — that is what makes them resemble one another so closely.' },
      { label: 'Configurations', text: 'Atoms share **$6s^2$** with variable $4f$ occupancy; every **Ln³⁺ ion is $4f^{\\,n}$** ($n = 1$ to $14$).' },
      { label: 'Lanthanoid contraction', text: 'A steady **decrease in atomic and ionic radii** from La to Lu, caused by the **imperfect shielding of one $4f$ electron by another**.' },
      { label: 'Big consequence', text: '**Zr (160 pm) ≈ Hf (159 pm)** — so the two occur together in nature and are very **difficult to separate**.' },
    ]),

    h.quiz([
      {
        question: 'The general symbol Ln in lanthanoid chemistry stands for any one of the fourteen elements following which element?',
        options: ['Lanthanum', 'Actinium', 'Lutetium', 'Cerium'],
        correct_index: 0,
        explanation: 'The lanthanoids are the fourteen elements that follow lanthanum, and lanthanum so closely resembles them that it is included in the discussion under the general symbol Ln. Actinium heads the actinoids, not the lanthanoids.',
      },
      {
        question: 'The electronic configuration of every tripositive lanthanoid ion (its most stable oxidation state) has the general form:',
        options: ['$5d^{\\,n} 6s^2$', '$4f^{\\,n}$', '$4f^{\\,n} 6s^2$', '$4f^{\\,n} 5d^1 6s^2$'],
        correct_index: 1,
        explanation: 'NCERT states the Ln³⁺ ions are all of the form $4f^{\\,n}$ ($n = 1$ to $14$). The $6s^2$ and any $5d^1$ are lost on forming the +3 ion, so they cannot appear in the ion\'s configuration.',
      },
      {
        question: 'The lanthanoid contraction is attributed to:',
        options: [
          'the imperfect shielding of one $4f$ electron by another in the same sub-shell',
          'the perfect shielding of the nucleus by the $4f$ electrons',
          'the inert pair effect operating in the $6s$ orbital',
          'the increasing number of $5d$ electrons across the series',
        ],
        correct_index: 0,
        explanation: 'Because one $4f$ electron screens another only imperfectly, the rising nuclear charge is felt more strongly across the series and the radii shrink. The $4f$ shielding is poor (not perfect), and the inert pair effect is a p-block idea unrelated to this contraction.',
      },
      {
        question: 'The almost identical atomic radii of Zr (160 pm) and Hf (159 pm) are a direct consequence of the lanthanoid contraction. This leads to:',
        options: [
          'Zr and Hf being very easy to separate from each other',
          'Hf being far larger than Zr',
          'Zr and Hf occurring together in nature and being difficult to separate',
          'Zr and Hf having completely different chemistry',
        ],
        correct_index: 2,
        explanation: 'Because the contraction pulls the third-series radii down to match the second series, Zr and Hf end up nearly the same size — so they occur together in ores and are notoriously difficult to separate. Their near-identical size makes their chemistry very similar, not different.',
      },
      {
        question: 'Assertion (A): The ionic radii of the lanthanoid M³⁺ ions decrease fairly regularly from La³⁺ to Lu³⁺.\nReason (R): The shielding of one $4f$ electron by another is imperfect, so the effective nuclear charge increases across the series.\nChoose the correct option:',
        options: [
          'A is false but R is true',
          'A is true but R is false',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'Both A and R are true, and R is the correct explanation of A',
        ],
        correct_index: 3,
        explanation: 'Both statements are true and R explains A: imperfect $4f$ shielding lets the growing nuclear charge act on the outer shells, producing the steady contraction in M³⁺ radii. This is the textbook cause-and-effect of the lanthanoid contraction.',
      },
      {
        question: 'Which statement about the lanthanoids is correct?',
        options: [
          'They show a wide range of oxidation states like the actinoids',
          'Their M³⁺ ionic radii increase from La to Lu',
          'Lanthanum has nothing in common with the lanthanoids',
          'Their atoms all share a common $6s^2$ outer pair with variable $4f$ occupancy',
        ],
        correct_index: 3,
        explanation: 'NCERT notes the $6s^2$ is common to all the atoms, with the $4f$ level filling variably. The lanthanoids have essentially one stable (+3) state (not a wide range), their M³⁺ radii decrease (not increase) across the series, and La closely resembles them.',
      },
    ], 0.6),
  ],
};
