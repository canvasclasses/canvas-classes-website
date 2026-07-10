// Ch.4 (p-Block) · Page 17 · Group 17 — The Halogens (NCERT §7.18).
// GROUP-OPENER: opens with the interactive `group_elements` card strip
// (F Cl Br I At), then NCERT occurrence + periodic trends (with the
// `periodic-trends-explorer` sim), physical properties, and chemical
// properties (oxidation states, F2 strongest oxidiser, reactions with water,
// anomalous F, reactivity towards H/O/metals/other halogens). NCERT content
// transcribed faithfully; notes-enrichment confined to "Exam Point" callouts.
// Hosts NCERT Examples 7.14, 7.15, 7.16 + In-text Questions 7.26, 7.27, 7.28.
module.exports = {
  page_number: 17,
  chapter: 4,
  slug: 'group-17-halogens',
  title: 'Group 17 — The Halogens',
  subtitle: 'Meet fluorine, chlorine, bromine, iodine and astatine — the most reactive non-metals, one electron short of a noble gas.',
  tags: ['p-block', 'group-17', 'halogens', 'periodic-trends'],
  reading_time_min: 8,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A vertical "family portrait" of the Group 17 halogens from top to bottom — fluorine (pale yellow gas), chlorine (greenish-yellow gas), bromine (a flask of red-brown liquid with reddish vapour), iodine (dark violet shiny crystals subliming to violet vapour), astatine (a faint radioactive trace) — with a subtle arrow down the side labelled "gas → liquid → solid". Textbook plate style, landscape, desktop-friendly.',
      '16:9',
      'Group 17: the halogens — a smooth gradation from gaseous F2 and Cl2 to liquid Br2 and solid I2.'
    ),

    h.groupElements(
      'Group 17 — The Halogens',
      'Tap any element to explore its electronic configuration, atomic & ionic radii, ionisation and electron-gain enthalpy, oxidation states, anomalies (JEE-tagged) and key reactions — a fast way to revise the whole family at a glance.',
      ['F', 'Cl', 'Br', 'I', 'At']
    ),

    h.text(
      'Fluorine, chlorine, bromine, iodine and astatine are members of Group 17. These are collectively known as the **halogens** (Greek *halo* means salt and *genes* means born i.e., salt producers). The halogens are highly reactive non-metallic elements. Like Groups 1 and 2, the elements of Group 17 show great similarity amongst themselves. That much similarity is not found in the elements of other groups of the periodic table. Also, there is a regular gradation in their physical and chemical properties. **Astatine is a radioactive element.**'
    ),

    h.heading('Occurrence', 'State where the Group 17 elements are found in nature.'),
    h.text(
      'Fluorine and chlorine are fairly abundant while bromine and iodine less so. Fluorine is present mainly as insoluble fluorides — **fluorspar** $\\ce{CaF2}$, **cryolite** $\\ce{Na3AlF6}$ and **fluoroapatite** $\\ce{3Ca3(PO4)2.CaF2}$ — and small quantities are present in soil, river water plants and bones and teeth of animals. **Sea water** contains chlorides, bromides and iodides of sodium, potassium, magnesium and calcium, but is mainly sodium chloride solution (2.5% by mass). The deposits of dried up seas contain these compounds, e.g., sodium chloride and carnallite $\\ce{KCl.MgCl2.6H2O}$. Certain forms of marine life contain iodine in their systems; various seaweeds, for example, contain upto 0.5% of iodine, and Chile saltpetre contains upto 0.2% of sodium iodate.'
    ),

    h.heading('Atomic & Physical Trends', 'Describe and explain the trends in atomic/ionic radii, ionisation enthalpy, electron gain enthalpy and electronegativity down Group 17.'),
    h.sim('periodic-trends-explorer', 'Explore the periodic trends',
      {
        prompt: 'Across a period, the halogen sits just before the noble gas. How do you expect its electron gain enthalpy to compare with neighbouring elements?',
        options: ['It is the most negative (maximum) in the period', 'It is the least negative in the period', 'It is positive (endothermic)'],
        reveal_after: true,
      }),
    h.text(
      '**Electronic configuration.** All these elements have seven electrons in their outermost shell ($ns^2np^5$) which is one electron short of the next noble gas.\n\n' +
      '**Atomic and ionic radii.** The halogens have the **smallest atomic radii** in their respective periods due to maximum effective nuclear charge. The atomic radius of fluorine like the other elements of the second period is extremely small. Atomic and ionic radii increase from fluorine to iodine due to increasing number of quantum shells.'
    ),
    h.text(
      '**Ionisation enthalpy.** They have little tendency to lose electron. Thus they have **very high ionisation enthalpy**. Due to increase in atomic size, ionisation enthalpy decreases down the group.\n\n' +
      '**Electron gain enthalpy.** Halogens have **maximum negative electron gain enthalpy** in the corresponding periods. This is due to the fact that the atoms of these elements have only one electron less than stable noble gas configurations. Electron gain enthalpy of the elements of the group becomes less negative down the group. **However, the negative electron gain enthalpy of fluorine is less than that of chlorine.** It is due to small size of fluorine atom — there are strong interelectronic repulsions in the relatively small $2p$ orbitals of fluorine and thus, the incoming electron does not experience much attraction.\n\n' +
      '**Electronegativity.** They have very high electronegativity. The electronegativity decreases down the group. **Fluorine is the most electronegative element in the periodic table.**'
    ),
    h.callout('exam_tip', 'Exam Point — the anomalous orders to memorise',
      '- **Electron gain enthalpy (most negative first): Cl > F > Br > I.** Fluorine breaks the trend — its tiny $2p$ shell crowds the incoming electron (interelectronic repulsion). A classic "odd one out" question.\n' +
      '- **Bond dissociation enthalpy: Cl₂ > Br₂ > F₂ > I₂.** $\\ce{F2}$ is anomalously low — the lone pairs on the two small F atoms repel each other strongly across the short F–F bond.\n' +
      '- Down the group: atomic radius ↑, ionisation enthalpy ↓, electronegativity ↓.'),

    h.worked('NCERT Example 7.14', 'solved_example',
      'Halogens have maximum negative electron gain enthalpy in the respective periods of the periodic table. Why?',
      'Halogens have the smallest size in their respective periods and therefore high effective nuclear charge. As a consequence, they readily accept one electron to acquire noble gas electronic configuration.'),

    h.heading('Physical Properties', 'Summarise the gradation in physical state, melting/boiling point, colour and solubility down Group 17.'),
    h.text(
      'Halogens display **smooth variations** in their physical properties.\n\n' +
      '- **Physical state:** fluorine and chlorine are gases, bromine is a liquid and iodine is a solid.\n' +
      '- **Melting and boiling points** steadily **increase with atomic number**.\n' +
      '- **Colour:** all halogens are coloured (they absorb radiation in the visible region, exciting outer electrons). $\\ce{F2}$ is **yellow**, $\\ce{Cl2}$ **greenish yellow**, $\\ce{Br2}$ **red** and $\\ce{I2}$ **violet**.\n' +
      '- **Solubility:** fluorine and chlorine react with water; bromine and iodine are only sparingly soluble in water but are soluble in various organic solvents such as chloroform, carbon tetrachloride, carbon disulphide and hydrocarbons to give coloured solutions.\n' +
      '- **Bond dissociation enthalpy anomaly:** the dissociation enthalpy of $\\ce{F2}$ is smaller than that of $\\ce{Cl2}$, whereas from chlorine onwards the X–X bond dissociation enthalpies show the expected trend $\\ce{Cl-Cl} > \\ce{Br-Br} > \\ce{I-I}$. The reason is the relatively large electron-electron repulsion among the lone pairs in $\\ce{F2}$, where they are much closer to each other than in $\\ce{Cl2}$.'
    ),

    h.worked('NCERT Example 7.15', 'solved_example',
      'Although electron gain enthalpy of fluorine is less negative as compared to chlorine, fluorine is a stronger oxidising agent than chlorine. Why?',
      'It is due to (i) low enthalpy of dissociation of the F–F bond and (ii) high hydration enthalpy of $\\ce{F^{-}}$.'),

    h.table(
      ['Property', 'F', 'Cl', 'Br', 'I'],
      [
        ['Atomic number', '9', '17', '35', '53'],
        ['Electronic configuration', '[He]2s²2p⁵', '[Ne]3s²3p⁵', '[Ar]3d¹⁰4s²4p⁵', '[Kr]4d¹⁰5s²5p⁵'],
        ['Covalent radius / pm', '64', '99', '114', '133'],
        ['Ionisation enthalpy / kJ mol⁻¹', '1680', '1256', '1142', '1008'],
        ['Electron gain enthalpy / kJ mol⁻¹', '−333', '−349', '−325', '−296'],
        ['Electronegativity (Pauling)', '4.0', '3.2', '3.0', '2.7'],
        ['Bond diss. enthalpy X₂ / kJ mol⁻¹', '158.8', '242.6', '192.8', '151.1'],
        ['E° / V (½X₂ + e⁻ → X⁻)', '2.87', '1.36', '1.09', '0.54'],
      ],
      'Table 7.8 — Atomic and physical properties of the halogens (key rows). Note the F anomalies in electron gain enthalpy and bond dissociation enthalpy.'
    ),

    h.heading('Chemical Properties', 'Explain the oxidation states, the strong oxidising nature, reactions with water, the anomalous behaviour of fluorine, and reactivity towards hydrogen, oxygen, metals and other halogens.'),
    h.text(
      '**Oxidation states.** All the halogens exhibit **−1 oxidation state**. However, chlorine, bromine and iodine exhibit **+1, +3, +5 and +7** oxidation states also. These higher oxidation states are realised mainly when the halogens are in combination with the small and highly electronegative fluorine and oxygen atoms — e.g., in interhalogens, oxides and oxoacids. The **fluorine atom has no $d$ orbitals** in its valence shell and therefore cannot expand its octet; being the most electronegative, it exhibits only the **−1** oxidation state.'
    ),
    h.img(
      'A hand-drawn coloured orbital-diagram on a deep charcoal (#121316) background, muted earthy palette, no glow. Four rows showing a halogen atom (not fluorine) progressively unpairing its electrons into empty nd orbitals: ground state (1 unpaired electron → −1/+1), first excited state (3 unpaired → +3), second excited state (5 unpaired → +5), third excited state (7 unpaired → +7). Each row shows ns, three np boxes and nd boxes with up/down arrows. Clean inorganic textbook diagram, landscape.',
      '16:9',
      'Promotion of electrons to empty nd orbitals lets Cl, Br and I show +1, +3, +5 and +7 oxidation states. Fluorine, having no d orbitals, stays at −1.'
    ),
    h.text(
      '**Strong oxidising agents.** The ready acceptance of an electron is the reason for the strong oxidising nature of halogens. $\\ce{F2}$ is the **strongest oxidising** halogen and it oxidises other halide ions in solution or even in the solid phase. In general, a halogen oxidises halide ions of higher atomic number.\n\n' +
      '$$\\ce{F2 + 2X^{-} -> 2F^{-} + X2} \\quad (\\text{X = Cl, Br or I})$$\n' +
      '$$\\ce{Cl2 + 2X^{-} -> 2Cl^{-} + X2} \\quad (\\text{X = Br or I})$$\n' +
      '$$\\ce{Br2 + 2I^{-} -> 2Br^{-} + I2}$$\n\n' +
      'The decreasing oxidising ability down the group is evident from the standard electrode potentials: $E^\\ominus$ = +2.87 V ($\\ce{F2}$), +1.36 V ($\\ce{Cl2}$), +1.09 V ($\\ce{Br2}$), +0.54 V ($\\ce{I2}$).'
    ),
    h.callout('exam_tip', 'Exam Point — oxidising power & the displacement rule',
      '- **Oxidising power: $\\ce{F2} > \\ce{Cl2} > \\ce{Br2} > \\ce{I2}$** (E° = 2.87 / 1.36 / 1.09 / 0.54 V).\n' +
      '- **Displacement:** a stronger (smaller) halogen displaces a weaker (larger) one from its salt. $\\ce{F2}$ displaces all; $\\ce{Cl2}$ displaces $\\ce{Br^-}$ and $\\ce{I^-}$; $\\ce{Br2}$ displaces only $\\ce{I^-}$.\n' +
      '- Even though F has a *less* negative electron gain enthalpy than Cl, $\\ce{F2}$ is still the strongest oxidiser — thanks to its **low F–F bond dissociation enthalpy** and the **high hydration enthalpy of $\\ce{F^-}$** (Example 7.15).'),
    h.text(
      '**Reaction with water.** The relative oxidising power is further illustrated by the reactions with water. Fluorine oxidises water to oxygen, whereas chlorine and bromine react with water to form the corresponding hydrohalic and hypohalous acids. The reaction of iodine with water is non-spontaneous; in fact, $\\ce{I^-}$ can be oxidised by oxygen in acidic medium — just the reverse of the reaction observed with fluorine.\n\n' +
      '$$\\ce{2F2(g) + 2H2O(l) -> 4H^{+}(aq) + 4F^{-}(aq) + O2(g)}$$\n' +
      '$$\\ce{X2(g) + H2O(l) -> HX(aq) + HOX(aq)} \\quad (\\text{X = Cl or Br})$$\n' +
      '$$\\ce{4I^{-}(aq) + 4H^{+}(aq) + O2(g) -> 2I2(s) + 2H2O(l)}$$'
    ),
    h.text(
      '**Anomalous behaviour of fluorine.** Like other elements of the $p$-block present in the second period, fluorine is anomalous in many properties. Its ionisation enthalpy, electronegativity, enthalpy of bond dissociation and electrode potential are all higher than expected from the trends set by the other halogens. Also, its ionic and covalent radii, m.p. and b.p. and electron gain enthalpy are quite lower than expected. The anomalous behaviour is due to its **small size, highest electronegativity, low F–F bond dissociation enthalpy, and non-availability of $d$ orbitals** in the valence shell. Most reactions of fluorine are exothermic (due to the small and strong bonds it forms). It forms only **one oxoacid** while the other halogens form a number of oxoacids. **Hydrogen fluoride is a liquid** (b.p. 293 K) due to strong hydrogen bonding; the other hydrogen halides are gases.'
    ),

    h.worked('NCERT Example 7.16', 'solved_example',
      'Fluorine exhibits only −1 oxidation state whereas other halogens exhibit +1, +3, +5 and +7 oxidation states also. Explain.',
      'Fluorine is the most electronegative element and cannot exhibit any positive oxidation state. Other halogens have $d$ orbitals and therefore can expand their octets and show +1, +3, +5 and +7 oxidation states also.'),

    h.text(
      '**(i) Reactivity towards hydrogen.** They all react with hydrogen to give hydrogen halides, but the affinity for hydrogen decreases from fluorine to iodine. The hydrogen halides dissolve in water to form hydrohalic acids. The **acidic strength** of these acids varies in the order $\\ce{HF} < \\ce{HCl} < \\ce{HBr} < \\ce{HI}$. The **stability** of these halides decreases down the group due to decrease in H–X bond dissociation enthalpy in the order $\\ce{H-F} > \\ce{H-Cl} > \\ce{H-Br} > \\ce{H-I}$.'
    ),
    h.table(
      ['Property', 'HF', 'HCl', 'HBr', 'HI'],
      [
        ['Melting point / K', '190', '159', '185', '222'],
        ['Boiling point / K', '293', '189', '206', '238'],
        ['Bond length (H–X) / pm', '91.7', '127.4', '141.4', '160.9'],
        ['Bond diss. enthalpy / kJ mol⁻¹', '574', '432', '363', '295'],
        ['pKₐ', '3.2', '−7.0', '−9.5', '−10.0'],
      ],
      'Table 7.9 — Properties of hydrogen halides. Acid strength rises HF < HCl < HBr < HI; HF is a liquid (H-bonding).'
    ),
    h.callout('exam_tip', 'Exam Point — the hydrogen-halide orders',
      '- **Acidic strength: $\\ce{HF} < \\ce{HCl} < \\ce{HBr} < \\ce{HI}$** (weaker H–X bond → easier to release $\\ce{H+}$). HI is the strongest.\n' +
      '- **Reducing power: $\\ce{HI} > \\ce{HBr} > \\ce{HCl}$** (HI gives up its electron most easily).\n' +
      '- **Boiling point: $\\ce{HCl} < \\ce{HBr} < \\ce{HI} < \\ce{HF}$** — HF sits at the top because of hydrogen bonding (the classic anomaly).'),
    h.text(
      '**(ii) Reactivity towards oxygen.** Halogens form many oxides with oxygen but most of them are unstable. **Fluorine forms two oxides $\\ce{OF2}$ and $\\ce{O2F2}$.** However, only $\\ce{OF2}$ is thermally stable at 298 K. These oxides are essentially **oxygen fluorides** because of the higher electronegativity of fluorine than oxygen. Both are strong fluorinating agents. $\\ce{O2F2}$ oxidises plutonium to $\\ce{PuF6}$, and the reaction is used in removing plutonium as $\\ce{PuF6}$ from spent nuclear fuel.\n\n' +
      'Chlorine, bromine and iodine form oxides in which the oxidation states of these halogens range from +1 to +7. A combination of kinetic and thermodynamic factors leads to the generally decreasing order of stability of oxides formed by halogens, $\\text{I} > \\text{Cl} > \\text{Br}$. The chlorine oxides $\\ce{Cl2O}$, $\\ce{ClO2}$, $\\ce{Cl2O6}$ and $\\ce{Cl2O7}$ are highly reactive oxidising agents and tend to explode. $\\ce{ClO2}$ is used as a bleaching agent for paper pulp and textiles and in water treatment. The iodine oxides ($\\ce{I2O4}$, $\\ce{I2O5}$, $\\ce{I2O7}$) are insoluble solids and decompose on heating; $\\ce{I2O5}$ is a very good oxidising agent and is used in the estimation of carbon monoxide.'
    ),
    h.callout('exam_tip', 'Exam Point — why fluorine forms fluorides, not oxides',
      '$\\ce{OF2}$ and $\\ce{O2F2}$ are written **oxygen fluorides**, not "fluorine oxides", because **fluorine is more electronegative than oxygen** — so in these compounds oxygen carries the positive oxidation state. This is the one place a halogen does NOT take the negative end.'),
    h.text(
      '**(iii) Reactivity towards metals.** Halogens react with metals to form metal halides. For example, bromine reacts with magnesium to give magnesium bromide.\n\n' +
      '$$\\ce{Mg(s) + Br2(l) -> MgBr2(s)}$$\n\n' +
      'The **ionic character** of the halides decreases in the order $\\text{MF} > \\text{MCl} > \\text{MBr} > \\text{MI}$, where M is a monovalent metal. If a metal exhibits more than one oxidation state, the halides in **higher oxidation state will be more covalent** than the one in lower oxidation state. For example, $\\ce{SnCl4}$, $\\ce{PbCl4}$, $\\ce{SbCl5}$ and $\\ce{UF6}$ are more covalent than $\\ce{SnCl2}$, $\\ce{PbCl2}$, $\\ce{SbCl3}$ and $\\ce{UF4}$ respectively.\n\n' +
      '**(iv) Reactivity of halogens towards other halogens.** Halogens combine amongst themselves to form a number of compounds known as **interhalogens** of the types $\\ce{XX\'}$, $\\ce{XX\'3}$, $\\ce{XX\'5}$ and $\\ce{XX\'7}$, where X is a larger size halogen and X′ is a smaller size halogen.'
    ),

    h.worked('In-text Question 7.26', 'ncert_intext',
      'Considering the parameters such as bond dissociation enthalpy, electron gain enthalpy and hydration enthalpy, compare the oxidising power of $\\ce{F2}$ and $\\ce{Cl2}$.',
      'Although the electron gain enthalpy of fluorine ($-333\\ \\text{kJ mol}^{-1}$) is less negative than that of chlorine ($-349\\ \\text{kJ mol}^{-1}$), $\\ce{F2}$ is a stronger oxidising agent than $\\ce{Cl2}$. This is because $\\ce{F2}$ has a much **lower bond dissociation enthalpy** ($158.8$ vs $242.6\\ \\text{kJ mol}^{-1}$, so it splits into atoms easily) and $\\ce{F^-}$ has a much **higher hydration enthalpy** ($515$ vs $381\\ \\text{kJ mol}^{-1}$, so the ion is strongly stabilised in water). Together these outweigh the slightly less favourable electron gain enthalpy, making $\\ce{F2}$ the stronger oxidiser ($E^\\ominus$ = +2.87 V vs +1.36 V).'),
    h.worked('In-text Question 7.27', 'ncert_intext',
      'Give two examples to show the anomalous behaviour of fluorine.',
      '(i) Fluorine forms only **one oxoacid** (HOF, hypofluorous acid) whereas the other halogens form several oxoacids — because of its small size, highest electronegativity and the absence of $d$ orbitals, fluorine cannot exhibit positive oxidation states.\n\n(ii) **Hydrogen fluoride is a liquid** (b.p. 293 K) due to strong hydrogen bonding, whereas $\\ce{HCl}$, $\\ce{HBr}$ and $\\ce{HI}$ are gases.'),
    h.worked('In-text Question 7.28', 'ncert_intext',
      'Sea is the greatest source of some halogens. Comment.',
      'Sea water contains chlorides, bromides and iodides of sodium, potassium, magnesium and calcium — it is mainly sodium chloride solution (2.5% by mass). The deposits of dried-up seas contain compounds such as sodium chloride and carnallite, $\\ce{KCl.MgCl2.6H2O}$. Certain marine organisms (e.g. seaweeds) concentrate iodine. Thus the sea — and the salt deposits it leaves behind — is the greatest natural source of chlorine, bromine and iodine.'),

    h.recap([
      { label: 'Members', text: 'F, Cl, Br, I, **At (radioactive)** — "salt producers"; config $ns^2np^5$ (one electron short of a noble gas).' },
      { label: 'Down the group', text: 'radius ↑, ionisation enthalpy ↓, electronegativity ↓ (F is the most electronegative element).' },
      { label: 'The F anomalies', text: 'electron gain enthalpy **Cl > F**; bond dissociation enthalpy **Cl₂ > Br₂ > F₂ > I₂**; HF is a liquid; F forms only one oxoacid; F shows only −1 (no $d$ orbitals).' },
      { label: 'Oxidising power', text: '$\\ce{F2} > \\ce{Cl2} > \\ce{Br2} > \\ce{I2}$ (E° = 2.87/1.36/1.09/0.54 V). A halogen displaces the larger halide from its salt.' },
      { label: 'Hydrogen halides', text: 'acid strength **HF < HCl < HBr < HI**; stability HF > HCl > HBr > HI; HF highest b.p. (H-bonding).' },
      { label: 'Reaction with water', text: '$\\ce{F2}$ oxidises water to $\\ce{O2}$; $\\ce{Cl2}$/$\\ce{Br2}$ give HX + HOX; $\\ce{I2}$ does not react.' },
    ]),

    h.quiz([
      {
        question: 'The correct order of the (negative) electron gain enthalpy of the halogens is:',
        options: ['F > Cl > Br > I', 'Cl > F > Br > I', 'I > Br > Cl > F', 'Br > Cl > F > I'],
        correct_index: 1,
        explanation: 'Fluorine breaks the trend: its tiny $2p$ shell crowds the incoming electron (interelectronic repulsion), so Cl has the most negative electron gain enthalpy — order Cl > F > Br > I.',
      },
      {
        question: 'Which halogen is the strongest oxidising agent?',
        options: ['Iodine', 'Bromine', 'Chlorine', 'Fluorine'],
        correct_index: 3,
        explanation: '$\\ce{F2}$ has the highest standard electrode potential (+2.87 V) — due to its low F–F bond dissociation enthalpy and the high hydration enthalpy of $\\ce{F^-}$ — so it is the strongest oxidiser and displaces all other halide ions.',
      },
      {
        question: 'The bond dissociation enthalpy of $\\ce{F2}$ is lower than that of $\\ce{Cl2}$ because:',
        options: [
          'fluorine has a larger atomic size than chlorine',
          'there is large electron-electron (lone-pair) repulsion in the small $\\ce{F2}$ molecule',
          'fluorine has available $d$ orbitals',
          'the F–F bond is ionic',
        ],
        correct_index: 1,
        explanation: 'The two F atoms are very small, so the lone pairs lie close together and repel strongly across the short F–F bond, lowering its dissociation enthalpy below that of $\\ce{Cl2}$.',
      },
      {
        question: 'The acidic strength of the hydrogen halides increases in the order:',
        options: [
          'HF < HCl < HBr < HI',
          'HI < HBr < HCl < HF',
          'HCl < HF < HBr < HI',
          'HBr < HI < HF < HCl',
        ],
        correct_index: 0,
        explanation: 'As the H–X bond gets weaker down the group, the proton is released more easily, so acid strength rises HF < HCl < HBr < HI (HI is the strongest).',
      },
      {
        question: 'Why does fluorine exhibit only the −1 oxidation state while Cl, Br and I also show +1, +3, +5 and +7?',
        options: [
          'fluorine is a gas',
          'fluorine has the largest atomic size',
          'fluorine is the most electronegative and has no $d$ orbitals to expand its octet',
          'fluorine is radioactive',
        ],
        correct_index: 2,
        explanation: 'Being the most electronegative element, fluorine cannot take a positive oxidation state, and with no $d$ orbitals in its valence shell it cannot expand its octet — so it is restricted to −1.',
      },
      {
        question: 'The compounds $\\ce{OF2}$ and $\\ce{O2F2}$ are called oxygen fluorides (not fluorine oxides) because:',
        options: [
          'oxygen is more abundant than fluorine',
          'fluorine is more electronegative than oxygen, so oxygen takes the positive oxidation state',
          'they are ionic compounds',
          'fluorine has a larger size than oxygen',
        ],
        correct_index: 1,
        explanation: 'Fluorine is more electronegative than oxygen, so in these compounds oxygen carries the positive oxidation state — making them oxygen fluorides rather than fluorine oxides.',
      },
    ], 0.6),
  ],
};
