// Ch.4 (p-Block) · Page 21 · Group 18 — The Noble Gases (NCERT §7.23).
// GROUP-OPENER + compounds: opens with the `group_elements` card strip
// (He Ne Ar Kr Xe Rn), then occurrence, trends (with `periodic-trends-explorer`
// sim), physical & chemical properties (Bartlett, Xe-F compounds + hydrolysis +
// fluoride donor/acceptor, Xe-O compounds), Fig 7.9 structures, uses. NCERT
// content transcribed faithfully; notes-enrichment in "Exam Point" callouts.
// Hosts NCERT Examples 7.20, 7.21, 7.22 + In-text Questions 7.32, 7.33, 7.34.
module.exports = {
  page_number: 21,
  chapter: 4,
  slug: 'noble-gases',
  title: 'Group 18 — The Noble Gases',
  subtitle: 'Helium to radon — the unreactive gases with full octets, the Bartlett breakthrough, and the surprising xenon fluorides and oxides.',
  tags: ['p-block', 'group-18', 'noble-gases', 'xenon-compounds', 'periodic-trends'],
  reading_time_min: 9,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A row of six glowing discharge tubes — helium, neon, argon, krypton, xenon and radon — each lit a slightly different gentle colour, captioned as the noble gases, with a small inset of Neil Bartlett\'s red xenon compound forming from a yellow gas. Clean inorganic textbook plate, landscape, desktop-friendly.',
      '16:9',
      'Group 18: the noble gases — full valence shells make them almost unreactive, until xenon surprised everyone in 1962.'
    ),

    h.groupElements(
      'Group 18 — The Noble Gases',
      'Tap any element to explore its electronic configuration, atomic radius, ionisation enthalpy, electron gain enthalpy, the rare compounds it forms (xenon!) and key facts (JEE-tagged) — a fast way to revise the whole family at a glance.',
      ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn']
    ),

    h.text(
      'Group 18 consists of six elements: **helium, neon, argon, krypton, xenon and radon**. All these are gases and chemically unreactive. They form very few compounds. Because of this they are termed **noble gases**.'
    ),

    h.heading('Occurrence', 'State where the noble gases are found.'),
    h.text(
      'All the noble gases except radon occur in the **atmosphere**. Their atmospheric abundance in dry air is ~1% by volume, of which **argon is the major constituent**. Helium and sometimes neon are found in minerals of radioactive origin e.g., pitchblende, monazite, cleveite. The main commercial source of helium is **natural gas**. Xenon and radon are the rarest elements of the group. Radon is obtained as a decay product of $^{226}\\text{Ra}$.\n\n' +
      '$$\\ce{^{226}_{88}Ra -> ^{222}_{86}Rn + ^{4}_{2}He}$$'
    ),

    h.worked('NCERT Example 7.20', 'solved_example',
      'Why are the elements of Group 18 known as noble gases?',
      'The elements present in Group 18 have their valence shell orbitals completely filled and, therefore, react with a few elements only under certain conditions. Therefore, they are now known as noble gases.'),

    h.heading('Atomic & Physical Trends', 'Describe the electronic configuration and the trends in ionisation enthalpy, atomic radii and electron gain enthalpy down Group 18.'),
    h.sim('periodic-trends-explorer', 'Explore the periodic trends',
      {
        prompt: 'The noble gases have completely filled valence shells. How do you expect their ionisation enthalpy to compare with all other elements in the same period?',
        options: ['Highest in the period', 'Lowest in the period', 'About the same as the halogens'],
        reveal_after: true,
      }),
    h.text(
      '**Electronic configuration.** All noble gases have the general electronic configuration $ns^2np^6$ except **helium which has $1s^2$**. Many of the properties of noble gases, including their inactive nature, are ascribed to their closed-shell structures.\n\n' +
      '**Ionisation enthalpy.** Due to stable electronic configuration these gases exhibit **very high ionisation enthalpy**. However, it decreases down the group with increase in atomic size.\n\n' +
      '**Atomic radii.** Atomic radii increase down the group with increase in atomic number. (Note: these are **van der Waals radii**, which is why noble-gas radii look comparatively large.)\n\n' +
      '**Electron gain enthalpy.** Since noble gases have stable electronic configurations, they have **no tendency to accept the electron** and therefore have **large positive values** of electron gain enthalpy.'
    ),
    h.callout('exam_tip', 'Exam Point — the two trap facts',
      '- **Ionisation enthalpy is the highest in each period** (full shell), but Group 18 also has the **most positive (endothermic) electron gain enthalpy** — adding an electron is strongly unfavourable.\n' +
      '- **$\\ce{O2}$ and Xe have almost identical first ionisation enthalpies** ($1175$ vs $1170\\ \\text{kJ mol}^{-1}$). Bartlett spotted this — having made $\\ce{O2^+PtF6^-}$, he reasoned Xe should behave the same. This near-equality is the whole basis of $\\ce{Xe^+PtF6^-}$.'),

    h.text(
      '**Physical properties.** All the noble gases are **monoatomic**. They are colourless, odourless and tasteless. They are sparingly soluble in water. They have very low melting and boiling points because the only type of interatomic interaction in these elements is **weak dispersion forces**. **Helium has the lowest boiling point (4.2 K)** of any known substance. It has an unusual property of diffusing through most commonly used laboratory materials such as rubber, glass or plastics.'
    ),
    h.table(
      ['Property', 'He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'],
      [
        ['Atomic number', '2', '10', '18', '36', '54', '86'],
        ['Electronic config.', '1s²', '[He]2s²2p⁶', '[Ne]3s²3p⁶', '[Ar]3d¹⁰4s²4p⁶', '[Kr]4d¹⁰5s²5p⁶', '[Xe]4f¹⁴5d¹⁰6s²6p⁶'],
        ['Atomic radius / pm', '120', '160', '190', '200', '220', '—'],
        ['Ionisation enthalpy / kJ mol⁻¹', '2372', '2080', '1520', '1351', '1170', '1037'],
        ['Boiling point / K', '4.2', '27.1', '87.2', '119.7', '165.0', '211'],
        ['Atmospheric content / % vol', '5.24×10⁻⁴', '1.82×10⁻³', '0.934', '1.14×10⁻⁴', '8.7×10⁻⁶', '—'],
      ],
      'Table 7.12 — Atomic and physical properties of the noble gases. IE is highest at He and falls down the group; argon dominates the ~1% of air.'
    ),

    h.worked('NCERT Example 7.21', 'solved_example',
      'Noble gases have very low boiling points. Why?',
      'Noble gases being monoatomic have no interatomic forces except weak dispersion forces and therefore, they are liquefied at very low temperatures. Hence, they have low boiling points.'),

    h.heading('Chemical Properties', 'Explain why noble gases are inert, and describe the xenon-fluorine and xenon-oxygen compounds, their hydrolysis, and their fluoride-donor/acceptor behaviour.'),
    h.text(
      'In general, noble gases are least reactive. Their inertness to chemical reactivity is attributed to the following reasons.\n\n' +
      '**(i)** The noble gases except helium ($1s^2$) have completely filled $ns^2np^6$ electronic configuration in their valence shell.\n\n' +
      '**(ii)** They have high ionisation enthalpy and more positive electron gain enthalpy.\n\n' +
      'The reactivity of noble gases was investigated occasionally, but all attempts to force them to react were unsuccessful for quite a few years. In March 1962, **Neil Bartlett**, then at the University of British Columbia, observed the reaction of a noble gas. First, he prepared a red compound formulated as $\\ce{O2^+PtF6^-}$. He then realised that the first ionisation enthalpy of molecular oxygen ($1175\\ \\text{kJ mol}^{-1}$) was almost identical with that of xenon ($1170\\ \\text{kJ mol}^{-1}$). He made efforts to prepare the same type of compound with Xe and was successful in preparing another red compound $\\ce{Xe^+PtF6^-}$ by mixing $\\ce{PtF6}$ and xenon. After this discovery, a number of xenon compounds mainly with the most electronegative elements like fluorine and oxygen have been synthesised.\n\n' +
      'The compounds of krypton are fewer — only the difluoride $\\ce{KrF2}$ has been studied in detail. Compounds of radon have not been isolated but only identified (e.g., $\\ce{RnF2}$) by radiotracer technique. No true compounds of Ar, Ne or He are yet known.'
    ),
    h.text(
      '**(a) Xenon-fluorine compounds.** Xenon forms three binary fluorides, $\\ce{XeF2}$, $\\ce{XeF4}$ and $\\ce{XeF6}$ by the direct reaction of elements under appropriate experimental conditions.\n\n' +
      '$$\\ce{Xe(g) + F2(g) ->[\\text{673 K, 1 bar}] XeF2(s)} \\quad (\\text{Xe in excess})$$\n' +
      '$$\\ce{Xe(g) + 2F2(g) ->[\\text{873 K, 7 bar}] XeF4(s)} \\quad (1:5\\ \\text{ratio})$$\n' +
      '$$\\ce{Xe(g) + 3F2(g) ->[\\text{573 K, 60-70 bar}] XeF6(s)} \\quad (1:20\\ \\text{ratio})$$\n\n' +
      '$\\ce{XeF6}$ can also be prepared by the interaction of $\\ce{XeF4}$ and $\\ce{O2F2}$ at 143 K.\n\n' +
      '$$\\ce{XeF4 + O2F2 -> XeF6 + O2}$$\n\n' +
      '$\\ce{XeF2}$, $\\ce{XeF4}$ and $\\ce{XeF6}$ are colourless crystalline solids and sublime readily at 298 K. They are powerful fluorinating agents. They are readily hydrolysed even by traces of water. For example, $\\ce{XeF2}$ is hydrolysed to give Xe, HF and $\\ce{O2}$.\n\n' +
      '$$\\ce{2XeF2(s) + 2H2O(l) -> 2Xe(g) + 4HF(aq) + O2(g)}$$'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure plate on a deep charcoal (#121316) background, muted earthy palette, no glow. Three xenon fluoride structures from VSEPR, labelled: (a) XeF2 linear with two axial lone pairs implied; (b) XeF4 square planar with two lone pairs above and below; (c) XeF6 distorted octahedral with one lone pair (7 electron pairs). Lone pairs drawn as small lobes. Clean inorganic textbook diagram, landscape.',
      '16:9',
      'Fig. 7.9 (a–c) — XeF₂ (linear), XeF₄ (square planar) and XeF₆ (distorted octahedral, 6 bond pairs + 1 lone pair).'
    ),
    h.text(
      'The structures of the three xenon fluorides can be deduced from VSEPR and are shown in Fig. 7.9. $\\ce{XeF2}$ and $\\ce{XeF4}$ have **linear** and **square planar** structures respectively. $\\ce{XeF6}$ has seven electron pairs (6 bonding pairs and one lone pair) and would, thus, have a **distorted octahedral** structure as found experimentally in the gas phase.\n\n' +
      '**Fluoride donor / acceptor behaviour.** Xenon fluorides react with **fluoride ion acceptors** to form cationic species and with **fluoride ion donors** to form fluoroanions.\n\n' +
      '$$\\ce{XeF2 + PF5 -> [XeF]^+[PF6]^-}$$\n' +
      '$$\\ce{XeF4 + SbF5 -> [XeF3]^+[SbF6]^-}$$\n' +
      '$$\\ce{XeF6 + MF -> M^+[XeF7]^-} \\quad (\\text{M = Na, K, Rb or Cs})$$'
    ),
    h.text(
      '**(b) Xenon-oxygen compounds.** Hydrolysis of $\\ce{XeF4}$ and $\\ce{XeF6}$ with water gives $\\ce{XeO3}$.\n\n' +
      '$$\\ce{6XeF4 + 12H2O -> 4Xe + 2XeO3 + 24HF + 3O2}$$\n' +
      '$$\\ce{XeF6 + 3H2O -> XeO3 + 6HF}$$\n\n' +
      '**Partial hydrolysis** of $\\ce{XeF6}$ gives oxyfluorides, $\\ce{XeOF4}$ and $\\ce{XeO2F2}$.\n\n' +
      '$$\\ce{XeF6 + H2O -> XeOF4 + 2HF}$$\n' +
      '$$\\ce{XeF6 + 2H2O -> XeO2F2 + 4HF}$$\n\n' +
      '$\\ce{XeO3}$ is a colourless explosive solid and has a **pyramidal** molecular structure (Fig. 7.9). $\\ce{XeOF4}$ is a colourless volatile liquid and has a **square pyramidal** molecular structure (Fig. 7.9).'
    ),
    h.img(
      'A hand-drawn coloured molecular-structure plate on a deep charcoal (#121316) background, muted earthy palette, no glow. Two xenon-oxygen/oxyfluoride structures, labelled: (d) XeOF4 square pyramidal — a central Xe with four equatorial F atoms, one axial double-bonded O, and a lone pair below; (e) XeO3 pyramidal — a central Xe with three Xe=O bonds and one lone pair on top. Lone pairs drawn as small lobes. Clean inorganic textbook diagram, landscape.',
      '16:9',
      'Fig. 7.9 (d–e) — XeOF₄ (square pyramidal) and XeO₃ (pyramidal, an explosive colourless solid).'
    ),
    h.callout('exam_tip', 'Exam Point — XeF₆ hydrolysis: complete vs partial',
      'A favourite trap is matching how much water $\\ce{XeF6}$ meets:\n\n' +
      '- **Complete hydrolysis** (excess water): $\\ce{XeF6 + 3H2O -> XeO3 + 6HF}$ → the **explosive** $\\ce{XeO3}$.\n' +
      '- **Partial hydrolysis (1 H₂O):** $\\ce{XeF6 + H2O -> XeOF4 + 2HF}$.\n' +
      '- **Partial hydrolysis (2 H₂O):** $\\ce{XeF6 + 2H2O -> XeO2F2 + 4HF}$.\n\n' +
      'Note hydrolysis is **not** a redox reaction — Xe stays +6 throughout (Example 7.22).'),

    h.worked('NCERT Example 7.22', 'solved_example',
      'Does the hydrolysis of $\\ce{XeF6}$ lead to a redox reaction?',
      'No, the products of hydrolysis are $\\ce{XeOF4}$ and $\\ce{XeO2F2}$ where the oxidation states of all of the elements remain the same as it was in the reacting state.'),
    h.worked('In-text Question 7.32', 'ncert_intext',
      'Why is helium used in diving apparatus?',
      'Helium is used (mixed with oxygen) in the breathing gas of divers because it is **very sparingly soluble in blood**. Unlike nitrogen, it does not dissolve appreciably under the high pressure experienced at depth, so it avoids the painful "bends" (decompression sickness) caused by gas bubbling out of the blood as the diver surfaces.'),
    h.worked('In-text Question 7.33', 'ncert_intext',
      'Balance the following equation: $\\ce{XeF6 + H2O -> XeO2F2 + HF}$.',
      'This is the partial hydrolysis of $\\ce{XeF6}$ with two molecules of water:\n\n$$\\ce{XeF6 + 2H2O -> XeO2F2 + 4HF}$$'),
    h.worked('In-text Question 7.34', 'ncert_intext',
      'Why has it been difficult to study the chemistry of radon?',
      'Radon is **radioactive with a very short half-life**, which makes the study of the chemistry of radon difficult. (Only $\\ce{RnF2}$ has been identified, by radiotracer technique.)'),

    h.heading('Uses'),
    h.text(
      '**Helium** is a non-inflammable and light gas. Hence, it is used in filling balloons for meteorological observations. It is also used in gas-cooled nuclear reactors. **Liquid helium** (b.p. 4.2 K) is used as a cryogenic agent for low-temperature experiments, and to produce and sustain the powerful superconducting magnets in NMR spectrometers and MRI systems. It is used as a diluent for oxygen in modern diving apparatus because of its very low solubility in blood.\n\n' +
      '**Neon** is used in discharge tubes and fluorescent bulbs for advertisement display purposes. Neon bulbs are used in botanical gardens and green houses.\n\n' +
      '**Argon** is used mainly to provide an inert atmosphere in high-temperature metallurgical processes (arc welding of metals or alloys) and for filling electric bulbs. It is also used in the laboratory for handling air-sensitive substances. There are no significant uses of **xenon and krypton**; they are used in light bulbs designed for special purposes.'
    ),

    h.recap([
      { label: 'Members', text: 'He, Ne, Ar, Kr, Xe, Rn (radioactive); config $ns^2np^6$ except **He = $1s^2$**. ~1% of air, mostly **argon**.' },
      { label: 'Trends', text: 'highest **ionisation enthalpy** in the period (↓ down group); **large positive electron gain enthalpy**; large (van der Waals) atomic radii; He has the lowest b.p. (4.2 K).' },
      { label: 'The Bartlett key', text: '$\\ce{O2}$ and Xe have nearly equal IE (1175 ≈ 1170) → $\\ce{Xe^+PtF6^-}$ (1962), the first noble-gas compound.' },
      { label: 'Xe fluorides', text: '$\\ce{XeF2}$ (linear), $\\ce{XeF4}$ (square planar), $\\ce{XeF6}$ (distorted octahedral); powerful fluorinating agents; fluoride donor/acceptor → $\\ce{[XeF]^+}$, $\\ce{[XeF7]^-}$.' },
      { label: 'Xe oxides', text: '$\\ce{XeO3}$ (pyramidal, explosive) and $\\ce{XeOF4}$ (square pyramidal); $\\ce{XeF6}$ partial hydrolysis → $\\ce{XeOF4}$/$\\ce{XeO2F2}$ (no change in oxidation state).' },
      { label: 'Uses', text: 'He — balloons, cryogenics, MRI, diving; Ne — discharge tubes; Ar — inert atmosphere, welding, bulbs.' },
    ]),

    h.quiz([
      {
        question: 'Which property explains the basis of Bartlett\'s synthesis of the first xenon compound?',
        options: [
          'Xe and Ne have the same atomic radius',
          'the first ionisation enthalpy of $\\ce{O2}$ (1175) is almost equal to that of Xe (1170 kJ mol⁻¹)',
          'Xe has a negative electron gain enthalpy',
          'Xe is the lightest noble gas',
        ],
        correct_index: 1,
        explanation: 'Having made $\\ce{O2^+PtF6^-}$, Bartlett noticed $\\ce{O2}$ and Xe have almost identical first ionisation enthalpies, so he expected (and succeeded) in making $\\ce{Xe^+PtF6^-}$.',
      },
      {
        question: 'The shapes of $\\ce{XeF2}$, $\\ce{XeF4}$ and $\\ce{XeF6}$ are respectively:',
        options: [
          'bent, tetrahedral, octahedral',
          'linear, square planar, distorted octahedral',
          'linear, tetrahedral, pentagonal bipyramidal',
          'angular, square pyramidal, octahedral',
        ],
        correct_index: 1,
        explanation: '$\\ce{XeF2}$ is linear, $\\ce{XeF4}$ is square planar, and $\\ce{XeF6}$ (6 bond pairs + 1 lone pair) is distorted octahedral.',
      },
      {
        question: 'The complete hydrolysis of $\\ce{XeF6}$ with excess water gives:',
        options: [
          '$\\ce{XeOF4}$ and HF',
          '$\\ce{XeO2F2}$ and HF',
          '$\\ce{XeO3}$ and HF',
          '$\\ce{Xe}$ and $\\ce{O2}$',
        ],
        correct_index: 2,
        explanation: 'Complete hydrolysis gives the explosive $\\ce{XeO3}$: $\\ce{XeF6 + 3H2O -> XeO3 + 6HF}$. Partial hydrolysis (1 or 2 water) gives $\\ce{XeOF4}$ or $\\ce{XeO2F2}$ instead.',
      },
      {
        question: 'Which statement about the electron gain enthalpy of the noble gases is correct?',
        options: [
          'it is large and negative',
          'it is large and positive (endothermic)',
          'it is zero',
          'it is the same as that of the halogens',
        ],
        correct_index: 1,
        explanation: 'With completely filled valence shells, noble gases have no tendency to accept an electron, so their electron gain enthalpy is large and positive (endothermic).',
      },
      {
        question: 'Helium is used in modern diving apparatus mainly because it:',
        options: [
          'is heavier than air',
          'is very sparingly soluble in blood',
          'reacts with oxygen',
          'has a high boiling point',
        ],
        correct_index: 1,
        explanation: 'Helium\'s very low solubility in blood means it does not bubble out on decompression, avoiding the "bends"; it is used to dilute oxygen in divers\' breathing gas.',
      },
      {
        question: 'Why is the chemistry of radon difficult to study?',
        options: [
          'it does not occur on Earth',
          'it is radioactive with a very short half-life',
          'it has a completely empty valence shell',
          'it reacts violently with all metals',
        ],
        correct_index: 1,
        explanation: 'Radon is radioactive with a very short half-life, so its compounds (only $\\ce{RnF2}$, by radiotracer technique) are hard to study.',
      },
    ], 0.6),
  ],
};
