// Ch.4 (p-Block) · Page 2 · Group 15 — The Nitrogen Family (NCERT §7.1.1–7.1.6).
// GROUP-OPENER pilot: opens with the interactive `group_elements` card strip
// (N P As Sb Bi → detail cards), then the NCERT occurrence + periodic trends +
// physical properties, with the `periodic-trends-explorer` sim on the trends
// section. NCERT content transcribed faithfully; notes-enrichment in callouts.
// Chemical properties (7.1.7) live on the next page.
module.exports = {
  page_number: 2,
  chapter: 4,
  slug: 'group-15-nitrogen-family',
  title: 'Group 15 — The Nitrogen Family',
  subtitle: 'Meet nitrogen, phosphorus, arsenic, antimony and bismuth — and watch the non-metal → metal shift unfold down the group.',
  tags: ['p-block', 'group-15', 'nitrogen-family', 'periodic-trends'],
  reading_time_min: 7,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A vertical "family portrait" of the Group 15 elements from top to bottom — nitrogen (a wisp of gas), phosphorus (a waxy solid lump), arsenic and antimony (metalloid grey crystals), bismuth (an iridescent stair-step metal crystal) — with a subtle arrow down the side labelled "non-metal → metalloid → metal". Textbook plate style, landscape, desktop-friendly.',
      '16:9',
      'Group 15: a family that drifts from non-metal (N) to true metal (Bi) as you go down.'
    ),

    h.groupElements(
      'Group 15 — The Nitrogen Family',
      'Tap any element to explore its electronic configuration, atomic & ionic radii, ionisation enthalpy, oxidation states, anomalies (JEE-tagged) and key reactions — a fast way to revise the whole family at a glance.',
      ['N', 'P', 'As', 'Sb', 'Bi']
    ),

    h.text(
      'Group 15 includes **nitrogen, phosphorus, arsenic, antimony and bismuth**. As we go down the group, there is a shift from non-metallic to metallic through metalloidic character. Nitrogen and phosphorus are non-metals, arsenic and antimony metalloids, and bismuth is a typical metal.'
    ),

    h.heading('Occurrence', 'State where the Group 15 elements are found in nature.'),
    h.text(
      'Molecular nitrogen comprises **78% by volume** of the atmosphere. In the earth’s crust, it occurs as sodium nitrate, $\\ce{NaNO3}$ (called Chile saltpetre) and potassium nitrate (Indian saltpetre). It is found in the form of proteins in plants and animals.\n\n' +
      'Phosphorus occurs in minerals of the apatite family, $\\ce{Ca9(PO4)6.CaX2}$ (X = F, Cl or OH) — e.g., fluorapatite $\\ce{Ca9(PO4)6.CaF2}$ — which are the main components of phosphate rocks. Phosphorus is an essential constituent of animal and plant matter; it is present in bones as well as in living cells. Arsenic, antimony and bismuth are found mainly as sulphide minerals.'
    ),

    h.heading('Atomic & Physical Trends', 'Describe and explain the trends in atomic/ionic radii, ionisation enthalpy and electronegativity down Group 15.'),
    h.sim('periodic-trends-explorer', 'Explore the periodic trends',
      {
        prompt: 'Down Group 15 (N → Bi), how do you expect the first ionisation enthalpy to change?',
        options: ['It decreases', 'It increases', 'It stays the same'],
        reveal_after: true,
      }),
    h.text(
      'The valence shell electronic configuration of these elements is $ns^2np^3$. The $s$ orbital is completely filled and the $p$ orbitals are **half-filled**, making the configuration extra stable.\n\n' +
      '**Atomic and ionic radii** increase in size down the group. There is a considerable increase in covalent radius from N to P; however, from As to Bi only a small increase is observed, due to the presence of completely filled $d$ and/or $f$ orbitals in the heavier members.'
    ),
    h.text(
      '**Ionisation enthalpy** decreases down the group due to the gradual increase in atomic size. Because of the extra-stable half-filled $p$ orbitals and smaller size, the ionisation enthalpy of the group 15 elements is **much greater than that of group 14** elements in the corresponding periods. The order of successive ionisation enthalpies, as expected, is $\\Delta_i H_1 < \\Delta_i H_2 < \\Delta_i H_3$.\n\n' +
      '**Electronegativity**, in general, decreases down the group with increasing atomic size. However, amongst the heavier elements the difference is not that pronounced.'
    ),
    h.callout('exam_tip', 'Exam Point — the trends (and their wobbles)',
      '- **Half-filled $np^3$ is extra stable** → Group 15 ionisation enthalpies are *higher* than the neighbouring Group 14 (and even Group 16) elements. A classic comparison question.\n' +
      '- Covalent radius: **big jump N → P, then small As → Sb → Bi** (filled $d$/$f$ orbitals).\n' +
      '- $\\ce{Bi^{3+}}$ is more stable than $\\ce{Bi^{5+}}$ — the **inert-pair effect** strengthens down the group.'),

    h.heading('Physical Properties', 'List the physical-property trends, including the melting/boiling point pattern and allotropy.'),
    h.text(
      'All the elements of this group are **polyatomic**. Dinitrogen is a diatomic gas while all others are solids. **Metallic character increases** down the group (decreasing ionisation enthalpy, increasing atomic size).\n\n' +
      'The **boiling points**, in general, increase from top to bottom, but the **melting point increases up to arsenic and then decreases** up to bismuth. **Except nitrogen, all the elements show allotropy.**'
    ),
    h.table(
      ['Property', 'N', 'P', 'As', 'Sb', 'Bi'],
      [
        ['Atomic number', '7', '15', '33', '51', '83'],
        ['Electronic configuration', '[He]2s²2p³', '[Ne]3s²3p³', '[Ar]3d¹⁰4s²4p³', '[Kr]4d¹⁰5s²5p³', '[Xe]4f¹⁴5d¹⁰6s²6p³'],
        ['Covalent radius / pm', '70', '110', '121', '141', '148'],
        ['Electronegativity', '3.0', '2.1', '2.0', '1.9', '1.9'],
        ['ΔᵢH₁ / kJ mol⁻¹', '1402', '1012', '947', '834', '703'],
      ],
      'Table 7.1 — Atomic and physical properties of Group 15 elements (key rows).'
    ),

    h.callout('remember', '⚡ Quick Recap',
      '- **Members:** N, P (non-metals) · As, Sb (metalloids) · Bi (metal) — **non-metal → metal down the group**.\n' +
      '- **Config:** $ns^2np^3$ (half-filled $p$ → extra stable → high ionisation enthalpy).\n' +
      '- **Down the group:** radius ↑, ionisation enthalpy ↓, electronegativity ↓, metallic character ↑.\n' +
      '- **Radius jump:** large N → P, small As → Bi (filled $d/f$).\n' +
      '- **m.p.** rises to As then falls; **b.p.** generally rises; **allotropy** in all except N.'),

    h.quiz([
      {
        question: 'Down Group 15 (N → Bi), the first ionisation enthalpy generally:',
        options: ['increases', 'decreases', 'stays constant', 'first increases then decreases'],
        correct_index: 1,
        explanation: 'As atomic size increases down the group, the outer electron is less tightly held, so the ionisation enthalpy decreases (N has the highest, Bi the lowest).',
      },
      {
        question: 'Why is the ionisation enthalpy of Group 15 elements higher than that of the neighbouring Group 14 elements?',
        options: [
          'because they are metals',
          'because of their larger atomic size',
          'because of the extra-stable half-filled np³ configuration',
          'because they have completely filled p orbitals',
        ],
        correct_index: 2,
        explanation: 'The half-filled $np^3$ configuration is extra stable, so removing an electron from a Group 15 atom needs more energy than from the corresponding Group 14 atom.',
      },
      {
        question: 'The increase in covalent radius is much smaller from As to Bi than from N to P because:',
        options: [
          'the heavier elements have completely filled d and/or f orbitals',
          'arsenic is a metalloid',
          'bismuth is radioactive',
          'nitrogen forms multiple bonds',
        ],
        correct_index: 0,
        explanation: 'Completely filled $d$ and/or $f$ orbitals in the heavier members shield the nucleus poorly, so the size increases only slightly from As to Bi.',
      },
      {
        question: 'Which statement about the physical properties of Group 15 elements is correct?',
        options: [
          'all five elements are gases at room temperature',
          'the melting point increases continuously down the group',
          'every element shows allotropy',
          'dinitrogen is a gas while the others are solids, and all except nitrogen show allotropy',
        ],
        correct_index: 3,
        explanation: 'Dinitrogen is a diatomic gas; P, As, Sb and Bi are solids. Allotropy is shown by all the elements except nitrogen. (m.p. rises only up to As, then falls.)',
      },
      {
        question: 'As we move down Group 15, the character of the elements changes as:',
        options: [
          'metal → metalloid → non-metal',
          'non-metal → metalloid → metal',
          'metalloid → metal → non-metal',
          'it stays non-metallic throughout',
        ],
        correct_index: 1,
        explanation: 'N and P are non-metals, As and Sb are metalloids, and Bi is a typical metal — metallic character increases down the group.',
      },
      {
        question: 'The valence-shell electronic configuration common to all Group 15 elements is:',
        options: ['ns²np³', 'ns²np²', 'ns²np⁴', 'ns²np⁶'],
        correct_index: 0,
        explanation: 'All Group 15 elements have $ns^2np^3$ — a filled $s$ subshell and a half-filled $p$ subshell.',
      },
    ], 0.6),
  ],
};
