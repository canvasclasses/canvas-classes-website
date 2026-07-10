// Ch.4 (p-Block) · Page 12 · Group 16 — The Oxygen Family (NCERT §7.10).
// GROUP-OPENER: opens with the interactive `group_elements` card strip
// (O S Se Te Po → detail cards), then occurrence, atomic/physical trends
// (with the `periodic-trends-explorer` sim), chemical properties (oxidation
// states, anomalous O, reactivity → H/O₂/halogens) and Table 7.6. NCERT
// content transcribed faithfully; notes-enrichment in `exam_tip` callouts.
// Hosts NCERT Examples 7.10 & 7.11 and In-text Questions 7.13, 7.14, 7.15.
module.exports = {
  page_number: 12,
  chapter: 4,
  slug: 'group-16-oxygen-family',
  title: 'Group 16 — The Oxygen Family',
  subtitle: 'Meet the chalcogens — oxygen, sulphur, selenium, tellurium and polonium — and the trends that run from the most electronegative non-metal to a radioactive metal.',
  tags: ['p-block', 'group-16', 'oxygen-family', 'chalcogens', 'periodic-trends'],
  reading_time_min: 8,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A vertical "family portrait" of the Group 16 elements from top to bottom — oxygen (a wisp of pale gas), sulphur (a bright yellow crystal lump), selenium (a dark grey lustrous solid), tellurium (a silvery metalloid crystal), polonium (a faintly glowing radioactive metal) — with a subtle arrow down the side labelled "non-metal → metalloid → metal". Textbook plate style, landscape, desktop-friendly.',
      '16:9',
      'Group 16 — the chalcogens: from non-metal oxygen at the top to metallic, radioactive polonium at the bottom.'
    ),

    h.groupElements(
      'Group 16 — The Oxygen Family',
      'Tap any element to explore its electronic configuration, atomic & ionic radii, ionisation enthalpy, electron gain enthalpy, oxidation states, anomalies (JEE-tagged) and key reactions — a fast way to revise the whole chalcogen family at a glance.',
      ['O', 'S', 'Se', 'Te', 'Po']
    ),

    h.text(
      'Oxygen, sulphur, selenium, tellurium and polonium constitute **Group 16** of the periodic table. This is sometimes known as group of **chalcogens**. The name is derived from the Greek word for brass and points to the association of sulphur and its congeners with copper. Most copper minerals contain either oxygen or sulphur and frequently the other members of the group.'
    ),

    h.heading('Occurrence', 'State where the Group 16 elements are found in nature.'),
    h.text(
      'Oxygen is the most abundant of all the elements on earth. Oxygen forms about **46.6% by mass** of earth’s crust. Dry air contains **20.946% oxygen by volume**.\n\n' +
      'However, the abundance of sulphur in the earth’s crust is only **0.03–0.1%**. Combined sulphur exists primarily as sulphates such as gypsum $\\ce{CaSO4.2H2O}$, epsom salt $\\ce{MgSO4.7H2O}$, baryte $\\ce{BaSO4}$ and sulphides such as galena $\\ce{PbS}$, zinc blende $\\ce{ZnS}$, copper pyrites $\\ce{CuFeS2}$. Traces of sulphur occur as hydrogen sulphide in volcanoes. Organic materials such as eggs, proteins, garlic, onion, mustard, hair and wool contain sulphur.\n\n' +
      'Selenium and tellurium are also found as metal selenides and tellurides in sulphide ores. Polonium occurs in nature as a decay product of thorium and uranium minerals.'
    ),

    h.heading('Atomic & Physical Trends', 'Describe and explain the trends in atomic/ionic radii, ionisation enthalpy, electron gain enthalpy and electronegativity down Group 16.'),
    h.sim('periodic-trends-explorer', 'Explore the periodic trends',
      {
        prompt: 'Compared with Group 15 in the same period, how do you expect the first ionisation enthalpy of a Group 16 element to be?',
        options: ['Higher than Group 15', 'Lower than Group 15', 'Exactly the same'],
        reveal_after: true,
      }),
    h.text(
      'The elements of Group 16 have **six electrons** in the outermost shell and have $ns^2np^4$ general electronic configuration.\n\n' +
      '**Atomic and ionic radii** increase from top to bottom in the group, due to the increase in the number of shells. The size of the oxygen atom is, however, exceptionally small.'
    ),
    h.text(
      '**Ionisation enthalpy** decreases down the group. It is due to increase in size. However, the elements of this group have **lower ionisation enthalpy values compared to those of Group 15** in the corresponding periods. This is due to the fact that Group 15 elements have extra stable half-filled $p$ orbitals electronic configurations.\n\n' +
      '**Electron gain enthalpy:** because of the compact nature of the oxygen atom, it has **less negative electron gain enthalpy than sulphur**. However, from sulphur onwards the value again becomes less negative upto polonium.\n\n' +
      '**Electronegativity:** next to fluorine, oxygen has the highest electronegativity value amongst the elements. Within the group, electronegativity decreases with an increase in atomic number. This implies that the metallic character increases from oxygen to polonium.'
    ),
    h.callout('exam_tip', 'Exam Point — the trends (and the O anomalies)',
      '- **Group 16 ionisation enthalpy is *lower* than the neighbouring Group 15** — because Group 15’s half-filled $np^3$ is extra stable. A favourite comparison question (see Example 7.10).\n' +
      '- **Electron gain enthalpy of O is *less negative* than S** (the O atom is so small that incoming-electron repulsion is high). So the most negative $\\Delta_{eg}H$ in the group belongs to **S, not O**.\n' +
      '- **m.p./b.p. rise down to Te, then fall** to Po.'),

    h.worked('NCERT Example 7.10', 'solved_example',
      'Elements of Group 16 generally show lower value of first ionisation enthalpy compared to the corresponding periods of group 15. Why?',
      'Due to extra stable half-filled $p$ orbitals electronic configurations of Group 15 elements, larger amount of energy is required to remove electrons compared to Group 16 elements.'),

    h.heading('Physical Properties', 'List the physical-property trends, including atomicity, metallic character and the m.p./b.p. pattern.'),
    h.text(
      '- Oxygen and sulphur are **non-metals**, selenium and tellurium are **metalloids**, whereas **polonium is a metal**.\n' +
      '- Polonium is **radioactive** and is short lived (half-life 13.8 days).\n' +
      '- **All these elements exhibit allotropy.**\n' +
      '- The **melting and boiling points increase** with an increase in atomic number down the group.\n' +
      '- The large difference between the melting and boiling points of oxygen and sulphur may be explained on the basis of their **atomicity**: oxygen exists as a diatomic molecule ($\\ce{O2}$) whereas sulphur exists as a **polyatomic molecule** ($\\ce{S8}$).'
    ),
    h.table(
      ['Property', 'O', 'S', 'Se', 'Te', 'Po'],
      [
        ['Atomic number', '8', '16', '34', '52', '84'],
        ['Electronic configuration', '[He]2s²2p⁴', '[Ne]3s²3p⁴', '[Ar]3d¹⁰4s²4p⁴', '[Kr]4d¹⁰5s²5p⁴', '[Xe]4f¹⁴5d¹⁰6s²6p⁴'],
        ['Covalent radius / pm', '66', '104', '117', '137', '146'],
        ['Electron gain enthalpy / kJ mol⁻¹', '−141', '−200', '−195', '−190', '−174'],
        ['Ionisation enthalpy (ΔᵢH₁) / kJ mol⁻¹', '1314', '1000', '941', '869', '813'],
        ['Electronegativity', '3.50', '2.44', '2.48', '2.01', '1.76'],
        ['Melting point / K', '55', '393', '490', '725', '520'],
        ['Boiling point / K', '90', '718', '958', '1260', '1235'],
        ['Oxidation states', '−2,−1,1,2', '−2,2,4,6', '−2,2,4,6', '−2,2,4,6', '2,4'],
      ],
      'Table 7.6 — Some physical properties of Group 16 elements (key rows). Oxygen shows +2 and +1 in the fluorides $\\ce{OF2}$ and $\\ce{O2F2}$ respectively.'
    ),

    h.heading('Chemical Properties', 'Account for the oxidation states of Group 16 and the anomalous behaviour of oxygen, and describe the reactions with hydrogen, oxygen and the halogens.'),
    h.text('**Oxidation states and trends in chemical reactivity**'),
    h.text(
      'The elements of Group 16 exhibit a number of oxidation states. The stability of **−2 oxidation state decreases down the group**. Polonium hardly shows −2 oxidation state. Since electronegativity of oxygen is very high, it shows only negative oxidation state as **−2** except in the case of $\\ce{OF2}$ where its oxidation state is **+2**. Other elements of the group exhibit **+2, +4, +6** oxidation states but +4 and +6 are more common. Sulphur, selenium and tellurium usually show +4 oxidation state in their compounds with oxygen and +6 with fluorine. The stability of **+6 oxidation state decreases** down the group and stability of **+4 oxidation state increases** (inert pair effect). Bonding in +4 and +6 oxidation states are primarily covalent.'
    ),
    h.text('**Anomalous behaviour of oxygen**'),
    h.text(
      'The anomalous behaviour of oxygen, like other members of $p$-block present in second period, is due to its **small size and high electronegativity**. One typical example of effects of small size and high electronegativity is the presence of strong hydrogen bonding in $\\ce{H2O}$ which is not found in $\\ce{H2S}$.\n\n' +
      'The **absence of $d$ orbitals in oxygen** limits its covalency to four and in practice, rarely exceeds two. On the other hand, in case of other elements of the group, the valence shells can be expanded and covalence exceeds four.'
    ),
    h.text(
      '**Reactivity with hydrogen.** All the elements of Group 16 form hydrides of the type $\\ce{H2E}$ (E = O, S, Se, Te, Po). Their **acidic character increases from $\\ce{H2O}$ to $\\ce{H2Te}$**. The increase in acidic character can be explained in terms of decrease in bond (H–E) dissociation enthalpy down the group. Owing to the decrease in bond (H–E) dissociation enthalpy down the group, the **thermal stability of hydrides also decreases from $\\ce{H2O}$ to $\\ce{H2Po}$**. All the hydrides except water possess **reducing property** and this character increases from $\\ce{H2S}$ to $\\ce{H2Te}$.'
    ),
    h.table(
      ['Property', 'H₂O', 'H₂S', 'H₂Se', 'H₂Te'],
      [
        ['m.p. / K', '273', '188', '208', '222'],
        ['b.p. / K', '373', '213', '232', '269'],
        ['H–E distance / pm', '96', '134', '146', '169'],
        ['H–E–H angle / °', '104', '92', '91', '90'],
        ['ΔfH / kJ mol⁻¹', '−286', '−20', '73', '100'],
      ],
      'Table 7.7 — Properties of hydrides of Group 16 elements (key rows).'
    ),
    h.callout('exam_tip', 'Exam Point — the four hydride orderings to memorise',
      'These $\\ce{H2E}$ orderings are repeatedly tested:\n\n' +
      '- **Acidity:** $\\ce{H2O} < \\ce{H2S} < \\ce{H2Se} < \\ce{H2Te}$ (bond enthalpy falls down the group).\n' +
      '- **Thermal stability:** $\\ce{H2O} > \\ce{H2S} > \\ce{H2Se} > \\ce{H2Te}$.\n' +
      '- **Reducing power:** increases $\\ce{H2S} \\to \\ce{H2Te}$ (all except $\\ce{H2O}$ are reducing).\n' +
      '- **Bond angle:** $104° > 92° > 91° > 90°$; **$\\ce{H2O}$ has the highest m.p./b.p.** because of hydrogen bonding.'),

    h.worked('NCERT Example 7.11', 'solved_example',
      '$\\ce{H2S}$ is less acidic than $\\ce{H2Te}$. Why?',
      'Due to the decrease in bond (E–H) dissociation enthalpy down the group, acidic character increases. Since the H–Te bond is weaker than the H–S bond, $\\ce{H2Te}$ releases $\\ce{H+}$ more readily and is therefore more acidic than $\\ce{H2S}$.'),

    h.text(
      '**Reactivity with oxygen.** All these elements form oxides of the $\\ce{EO2}$ and $\\ce{EO3}$ types where E = S, Se, Te or Po. Ozone ($\\ce{O3}$) and sulphur dioxide ($\\ce{SO2}$) are gases while selenium dioxide ($\\ce{SeO2}$) is solid. **Reducing property of dioxide decreases from $\\ce{SO2}$ to $\\ce{TeO2}$;** $\\ce{SO2}$ is reducing while $\\ce{TeO2}$ is an oxidising agent. Besides $\\ce{EO2}$ type, sulphur, selenium and tellurium also form $\\ce{EO3}$ type oxides ($\\ce{SO3}$, $\\ce{SeO3}$, $\\ce{TeO3}$). Both types of oxides are **acidic** in nature.'
    ),
    h.text(
      '**Reactivity towards the halogens.** Elements of Group 16 form a large number of halides of the type $\\ce{EX6}$, $\\ce{EX4}$ and $\\ce{EX2}$ where E is an element of the group and X is a halogen. The stability of the halides decreases in the order $\\ce{F- > Cl- > Br- > I-}$. Amongst hexahalides, **hexafluorides are the only stable halides**. All hexafluorides are gaseous in nature. They have **octahedral** structure. Sulphur hexafluoride, **$\\ce{SF6}$, is exceptionally stable for steric reasons.**\n\n' +
      'Amongst tetrafluorides, $\\ce{SF4}$ is a gas, $\\ce{SeF4}$ a liquid and $\\ce{TeF4}$ a solid. These fluorides have $sp^3d$ hybridisation and thus, have trigonal bipyramidal structures in which one of the equatorial positions is occupied by a lone pair of electrons. This geometry is also regarded as **see-saw** geometry.'
    ),

    h.worked('In-text Question 7.13', 'ncert_intext',
      'List the important sources of sulphur.',
      'Combined sulphur occurs as **sulphates** such as gypsum $\\ce{CaSO4.2H2O}$, epsom salt $\\ce{MgSO4.7H2O}$ and baryte $\\ce{BaSO4}$, and as **sulphides** such as galena $\\ce{PbS}$, zinc blende $\\ce{ZnS}$ and copper pyrites $\\ce{CuFeS2}$. Traces of sulphur occur as **hydrogen sulphide** in volcanoes, and organic materials like eggs, proteins, garlic, onion, mustard, hair and wool contain sulphur.'),
    h.worked('In-text Question 7.14', 'ncert_intext',
      'Write the order of thermal stability of the hydrides of Group 16 elements.',
      'Thermal stability **decreases** down the group as the H–E bond weakens:\n\n$$\\ce{H2O} > \\ce{H2S} > \\ce{H2Se} > \\ce{H2Te} > \\ce{H2Po}$$'),
    h.worked('In-text Question 7.15', 'ncert_intext',
      'Why is $\\ce{H2O}$ a liquid and $\\ce{H2S}$ a gas?',
      'Oxygen is small and highly electronegative, so $\\ce{H2O}$ molecules are strongly associated through **hydrogen bonding**, raising its melting and boiling points so that it is a liquid at room temperature. Sulphur is larger and much less electronegative, so $\\ce{H2S}$ has no significant hydrogen bonding — only weak van der Waals forces — and remains a gas.'),

    h.recap([
      { label: 'Members', text: 'O, S (non-metals) · Se, Te (metalloids) · Po (radioactive metal). Called **chalcogens**; config $ns^2np^4$.' },
      { label: 'Down the group', text: 'radius ↑, ionisation enthalpy ↓, electronegativity ↓, metallic character ↑; m.p./b.p. rise to Te then fall.' },
      { label: 'O anomalies', text: 'Group 16 IE **lower** than Group 15 (no extra-stable half-filled $p$); $\\Delta_{eg}H$ of **S more negative than O** (O atom too compact); O has no $d$ orbitals (covalency ≤ 4, usually 2).' },
      { label: 'Hydrides $\\ce{H2E}$', text: 'acidity $\\ce{H2O}<\\ce{H2S}<\\ce{H2Se}<\\ce{H2Te}$; stability the reverse; bond angle $104°{>}92°{>}91°{>}90°$; all but $\\ce{H2O}$ reducing.' },
      { label: 'Halides', text: 'only **hexafluorides** ($\\ce{SF6}$ etc.) stable & octahedral; $\\ce{SF6}$ inert (steric); tetrafluorides ($sp^3d$) are **see-saw**.' },
    ]),

    h.quiz([
      {
        question: 'Why do Group 16 elements have lower first ionisation enthalpy than the corresponding Group 15 elements?',
        options: [
          'because Group 16 atoms are smaller',
          'because Group 15 elements have an extra-stable half-filled np³ configuration',
          'because Group 16 elements are metals',
          'because Group 16 has completely filled p orbitals',
        ],
        correct_index: 1,
        explanation: 'Group 15 has the extra-stable half-filled $np^3$ configuration, so removing an electron from a Group 15 atom needs more energy than from the neighbouring Group 16 atom.',
      },
      {
        question: 'The electron gain enthalpy of oxygen is less negative than that of sulphur because:',
        options: [
          'oxygen is a metal',
          'sulphur has a larger nuclear charge',
          'the oxygen atom is very compact, so incoming-electron repulsion is high',
          'oxygen has vacant d orbitals',
        ],
        correct_index: 2,
        explanation: 'The oxygen atom is so small that adding an electron causes strong inter-electron repulsion, making $\\Delta_{eg}H$ of O less negative than that of S.',
      },
      {
        question: 'The general valence-shell electronic configuration of Group 16 elements is:',
        options: ['ns²np³', 'ns²np⁴', 'ns²np⁵', 'ns²np⁶'],
        correct_index: 1,
        explanation: 'Group 16 (chalcogens) have six valence electrons: $ns^2np^4$.',
      },
      {
        question: 'The large difference between the melting and boiling points of oxygen and sulphur is mainly because:',
        options: [
          'oxygen is diatomic (O₂) while sulphur is polyatomic (S₈)',
          'oxygen is a metal and sulphur a non-metal',
          'sulphur is radioactive',
          'oxygen has a higher atomic number',
        ],
        correct_index: 0,
        explanation: 'Oxygen exists as small $\\ce{O2}$ molecules with weak forces, whereas sulphur exists as large $\\ce{S8}$ molecules with much stronger forces, giving sulphur far higher m.p./b.p.',
      },
      {
        question: 'Which order correctly shows the acidic character of Group 16 hydrides?',
        options: [
          'H₂O > H₂S > H₂Se > H₂Te',
          'H₂Te < H₂Se < H₂S < H₂O',
          'H₂O < H₂S < H₂Se < H₂Te',
          'H₂S < H₂O < H₂Se < H₂Te',
        ],
        correct_index: 2,
        explanation: 'Acidic character increases down the group as the H–E bond dissociation enthalpy falls: $\\ce{H2O} < \\ce{H2S} < \\ce{H2Se} < \\ce{H2Te}$.',
      },
      {
        question: 'Amongst the hexahalides of Group 16, the only stable ones are the:',
        options: [
          'hexachlorides',
          'hexabromides',
          'hexafluorides (e.g. SF₆), which are octahedral',
          'hexaiodides',
        ],
        correct_index: 2,
        explanation: 'Stability falls $\\ce{F- > Cl- > Br- > I-}$; only the hexafluorides are stable, are gaseous and octahedral, with $\\ce{SF6}$ exceptionally inert for steric reasons.',
      },
    ], 0.6),
  ],
};
