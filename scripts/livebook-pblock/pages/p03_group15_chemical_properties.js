// Ch.4 (p-Block) · Page 3 · Group 15 — Chemical Properties (NCERT §7.1.7).
// Compound/properties page: oxidation states + disproportionation, covalency
// limit of N, anomalous properties of nitrogen (pπ-pπ, no d-orbitals, dπ-pπ in
// heavier), reactivity towards (i) hydrogen [Table 7.2], (ii) oxygen, (iii)
// halogens, (iv) metals. Hosts NCERT Examples 7.1 & 7.2 + In-text Qs 7.1 & 7.2.
// NCERT transcribed faithfully; notes-enrichment confined to exam_tip callouts.
module.exports = {
  page_number: 3,
  chapter: 4,
  slug: 'group-15-chemical-properties',
  title: 'Group 15 — Chemical Properties',
  subtitle: 'Oxidation states and disproportionation, the covalency limit of nitrogen, why nitrogen is anomalous, and how the family reacts with hydrogen, oxygen, halogens and metals.',
  tags: ['p-block', 'group-15', 'chemical-properties', 'nitrogen-anomaly', 'hydrides'],
  reading_time_min: 8,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A central nitrogen atom shown forming a triple bond to a second nitrogen (N≡N) drawn as overlapping p-orbital lobes labelled "pπ–pπ", with smaller faded sketches around it of EH3 hydride, an E2O3 oxide, an EX3 trihalide and a metal nitride — a visual "reactivity map" of Group 15. Textbook plate style, landscape, desktop-friendly.',
      '16:9',
      'Group 15 chemistry: oxidation states from −3 to +5, and a nitrogen that behaves unlike the rest of its family.'
    ),

    h.heading('Oxidation states & trends in chemical reactivity', 'State the common oxidation states of Group 15 and explain how their stability and the tendency to disproportionate vary down the group.'),
    h.text(
      'The common oxidation states of these elements are **−3, +3 and +5**. The tendency to exhibit **−3 oxidation state decreases down the group** due to the increase in size and metallic character. In fact, the last member of the group, bismuth, hardly forms any compound in the −3 oxidation state.\n\n' +
      'The stability of the **+5 oxidation state decreases down the group**. The only well characterised Bi(V) compound is $\\ce{BiF5}$. The stability of the +5 oxidation state decreases and that of the +3 state increases (due to the **inert pair effect**) down the group.\n\n' +
      'Nitrogen exhibits +1, +2, +4 oxidation states also when it reacts with oxygen. Phosphorus also shows +1 and +4 oxidation states in some oxoacids.'
    ),
    h.text(
      'In the case of nitrogen, all oxidation states from +1 to +4 tend to **disproportionate** in acid solution. For example,\n\n' +
      '$$\\ce{3HNO2 -> HNO3 + H2O + 2NO}$$\n\n' +
      'Similarly, in the case of phosphorus nearly all intermediate oxidation states disproportionate into +5 and −3 both in alkali and acid. However, +3 oxidation state in the case of arsenic, antimony and bismuth becomes increasingly stable with respect to disproportionation.'
    ),
    h.callout('exam_tip', 'Exam Point — oxide acidity & the inert-pair effect',
      '- **Oxide character (E₂O₃) down the group:** $\\ce{N2O3}$, $\\ce{P2O3}$ acidic → $\\ce{As2O3}$, $\\ce{Sb2O3}$ amphoteric → $\\ce{Bi2O3}$ basic. The oxide in the **higher** oxidation state is **more acidic** than that in the lower state.\n' +
      '- **Inert-pair effect:** down the group the $ns^2$ pair gets harder to use in bonding, so **+3 grows more stable and +5 less stable** — which is why $\\ce{Bi^{3+}}$ is favoured over $\\ce{Bi^{5+}}$.'),

    h.heading('Covalency limit of nitrogen', 'Explain why nitrogen is restricted to a maximum covalency of four while the heavier elements can exceed it.'),
    h.text(
      'Nitrogen is restricted to a **maximum covalency of 4** since only four (one $s$ and three $p$) orbitals are available for bonding. The heavier elements have vacant $d$ orbitals in the outermost shell which can be used for bonding (covalency) and hence they **expand their covalence**, as in $\\ce{PF6^{-}}$.'
    ),

    h.worked('NCERT Example 7.1', 'solved_example',
      'Though nitrogen exhibits +5 oxidation state, it does not form pentahalide. Give reason.',
      'Nitrogen with $n = 2$ has $s$ and $p$ orbitals only. It does not have $d$ orbitals to expand its covalence beyond four. That is why it does not form pentahalide.'),

    h.heading('Anomalous properties of nitrogen', 'Identify the reasons nitrogen differs from the rest of Group 15 and the consequences (pπ-pπ bonding, weak catenation, no dπ-pπ).'),
    h.text(
      'Nitrogen differs from the rest of the members of this group due to its **smaller size, high electronegativity, high ionisation enthalpy and non-availability of $d$ orbitals**.\n\n' +
      'Nitrogen has a unique ability to form **$p\\pi$–$p\\pi$ multiple bonds** with itself and with other elements having small size and high electronegativity (e.g., C, O). Heavier elements of this group do not form $p\\pi$–$p\\pi$ bonds, as their atomic orbitals are so large and diffuse that they cannot have effective overlapping.\n\n' +
      'Thus, nitrogen exists as a **diatomic molecule with a triple bond** (one $s$ and two $p$) between the two atoms. Consequently, its bond enthalpy ($941.4\\ \\text{kJ mol}^{-1}$) is very high. On the contrary, phosphorus, arsenic and antimony form single bonds as P–P, As–As and Sb–Sb, while bismuth forms metallic bonds in the elemental state.'
    ),
    h.text(
      'However, the **single N–N bond is weaker than the single P–P bond** because of high interelectronic repulsion of the non-bonding electrons, owing to the small bond length. As a result the **catenation tendency is weaker in nitrogen**.\n\n' +
      'Another factor which affects the chemistry of nitrogen is the absence of $d$ orbitals in its valence shell. Besides restricting its covalency to four, nitrogen cannot form **$d\\pi$–$p\\pi$ bond** as the heavier elements can, e.g., $\\ce{R3P=O}$ or $\\ce{R3P=CH2}$ ($R$ = alkyl group). Phosphorus and arsenic can form $d\\pi$–$d\\pi$ bond also with transition metals when their compounds like $\\ce{P(C2H5)3}$ and $\\ce{As(C6H5)3}$ act as ligands.'
    ),
    h.callout('exam_tip', 'Exam Point — why N–N is weaker than P–P (a classic trap)',
      'It looks backwards — the smaller atom usually bonds *more* strongly — but for the **single** N–N bond the small bond length crams the lone pairs on adjacent nitrogens together, and the **high interelectronic (lone-pair) repulsion** weakens the bond. That is exactly why nitrogen catenates poorly while phosphorus catenates better. (The *triple* bond $\\ce{N#N}$ is a different story — it is one of the strongest bonds known.)'),

    h.heading('Reactivity towards hydrogen', 'Describe the hydrides EH₃ and the gradation in their stability, reducing character and basicity.'),
    h.text(
      'All the elements of Group 15 form hydrides of the type $\\ce{EH3}$ where E = N, P, As, Sb or Bi. Some of the properties of these hydrides are shown in Table 7.2. The hydrides show regular gradation in their properties.\n\n' +
      'The **stability of hydrides decreases from $\\ce{NH3}$ to $\\ce{BiH3}$**, which can be observed from their bond dissociation enthalpy. Consequently, the **reducing character of the hydrides increases**. Ammonia is only a mild reducing agent while $\\ce{BiH3}$ is the strongest reducing agent amongst all the hydrides. **Basicity** also decreases in the order $\\ce{NH3} > \\ce{PH3} > \\ce{AsH3} > \\ce{SbH3} \\geq \\ce{BiH3}$.'
    ),
    h.table(
      ['Property', 'NH₃', 'PH₃', 'AsH₃', 'SbH₃', 'BiH₃'],
      [
        ['Melting point / K', '195.2', '139.5', '156.7', '185', '–'],
        ['Boiling point / K', '238.5', '185.5', '210.6', '254.6', '290'],
        ['(E–H) distance / pm', '101.7', '141.9', '151.9', '170.7', '–'],
        ['HEH angle (°)', '107.8', '93.6', '91.8', '91.3', '–'],
        ['ΔfH⦵ / kJ mol⁻¹', '−46.1', '13.4', '66.4', '145.1', '278'],
        ['Δdiss H⦵(E–H) / kJ mol⁻¹', '389', '322', '297', '255', '–'],
      ],
      'Table 7.2 — Properties of the hydrides of Group 15 elements.'
    ),
    h.callout('exam_tip', 'Exam Point — bond angle & boiling-point orderings (memorise)',
      '- **Bond angle:** $\\ce{NH3}$ (107.8°) > $\\ce{PH3}$ (93.6°) > $\\ce{AsH3}$ (91.8°) > $\\ce{SbH3}$ (91.3°). Only $\\ce{NH3}$ is $sp^3$; the heavier hydrides use almost **pure $p$-orbitals** (little hybridisation), so their angles drop toward 90°.\n' +
      '- **Boiling point:** $\\ce{PH3} < \\ce{AsH3} < \\ce{NH3} < \\ce{SbH3} < \\ce{BiH3}$ — $\\ce{NH3}$ is anomalously high for its mass because of **hydrogen bonding**.\n' +
      '- **Stability & basicity ↓**, **reducing power ↑**, both going $\\ce{NH3} \\to \\ce{BiH3}$.'),

    h.worked('NCERT Example 7.2', 'solved_example',
      'PH₃ has lower boiling point than NH₃. Why?',
      'Unlike $\\ce{NH3}$, $\\ce{PH3}$ molecules are not associated through hydrogen bonding in the liquid state. That is why the boiling point of $\\ce{PH3}$ is lower than $\\ce{NH3}$.'),

    h.worked('In-text Question 7.2', 'ncert_intext',
      'Why is $\\ce{BiH3}$ the strongest reducing agent amongst all the hydrides of Group 15 elements?',
      'Down the group the E–H bond dissociation enthalpy decreases, so the **stability of the hydrides decreases** from $\\ce{NH3}$ to $\\ce{BiH3}$. $\\ce{BiH3}$ has the weakest, most easily broken E–H bonds, so it loses hydrogen (and donates electrons) most readily — making it the **strongest reducing agent** among the Group 15 hydrides.'),

    h.heading('Reactivity towards oxygen', 'Give the two oxide types of Group 15 and how their acidic character varies down the group.'),
    h.text(
      'All these elements form **two types of oxides: $\\ce{E2O3}$ and $\\ce{E2O5}$**. The oxide in the higher oxidation state of the element is more acidic than that of the lower oxidation state. Their **acidic character decreases down the group**. The oxides of the type $\\ce{E2O3}$ of nitrogen and phosphorus are purely acidic, that of arsenic and antimony amphoteric, and those of bismuth predominantly basic.'
    ),

    h.heading('Reactivity towards halogens', 'Describe the two series of halides (EX₃, EX₅) and the nitrogen exception.'),
    h.text(
      'These elements react to form two series of halides: **$\\ce{EX3}$ and $\\ce{EX5}$**. Nitrogen does not form pentahalide due to the non-availability of the $d$ orbitals in its valence shell. **Pentahalides are more covalent than trihalides.**\n\n' +
      'All the trihalides of these elements except those of nitrogen are stable. In the case of nitrogen, only $\\ce{NF3}$ is known to be stable. Trihalides except $\\ce{BiF3}$ are predominantly covalent in nature.'
    ),

    h.worked('In-text Question 7.1', 'ncert_intext',
      'Why are pentahalides more covalent than trihalides?',
      'In the pentahalides the central atom is in the **+5 oxidation state** and in the trihalides it is in **+3**. The higher charge of the +5 ion is more **polarising** (Fajans’ rules): it distorts the electron cloud of the halide ions more strongly, giving the bond greater covalent character. Hence pentahalides are more covalent than the corresponding trihalides.'),

    h.heading('Reactivity towards metals', 'State the oxidation state Group 15 elements show with metals and give the binary compounds.'),
    h.text(
      'All these elements react with metals to form their binary compounds exhibiting the **−3 oxidation state**, such as $\\ce{Ca3N2}$ (calcium nitride), $\\ce{Ca3P2}$ (calcium phosphide), $\\ce{Na3As2}$ (sodium arsenide), $\\ce{Zn3Sb2}$ (zinc antimonide) and $\\ce{Mg3Bi2}$ (magnesium bismuthide).'
    ),

    h.recap([
      { label: 'Oxidation states', text: 'Common: **−3, +3, +5**. Down the group **−3 and +5 lose stability, +3 gains it** (inert-pair effect). Bi(V) only well-characterised as $\\ce{BiF5}$.' },
      { label: 'Disproportionation', text: '$\\ce{3HNO2 -> HNO3 + H2O + 2NO}$; phosphorus intermediates disproportionate to +5 and −3; As, Sb, Bi +3 states are stable to it.' },
      { label: 'Nitrogen anomaly', text: 'Small size, high EN, **no $d$-orbitals** → covalency limit 4, $p\\pi$–$p\\pi$ multiple bonds (so $\\ce{N#N}$, BE 941.4 kJ/mol), weak catenation (single N–N weaker than P–P), no $d\\pi$–$p\\pi$.' },
      { label: 'Hydrides EH₃', text: 'Stability & basicity ↓, reducing power ↑ from $\\ce{NH3} \\to \\ce{BiH3}$; bond angle 107.8° → ~91°.' },
      { label: 'With O / X / metals', text: 'Oxides $\\ce{E2O3}$ & $\\ce{E2O5}$ (acidity ↓ down group); halides $\\ce{EX3}$ & $\\ce{EX5}$ (only $\\ce{NF3}$ stable for N); with metals → **−3** nitrides/phosphides etc.' },
    ]),

    h.quiz([
      {
        question: 'Why is the maximum covalency of nitrogen restricted to four?',
        options: [
          'because nitrogen is highly electronegative',
          'because nitrogen has no d orbitals available for bonding',
          'because nitrogen is a diatomic gas',
          'because nitrogen forms only ionic bonds',
        ],
        correct_index: 1,
        explanation: 'Nitrogen ($n=2$) has only one $s$ and three $p$ orbitals (four in all) and no $d$ orbitals, so it cannot expand its covalence beyond four — that is also why it forms no pentahalide.',
      },
      {
        question: 'Which is the correct order of basicity of the Group 15 hydrides?',
        options: [
          'BiH₃ > SbH₃ > AsH₃ > PH₃ > NH₃',
          'NH₃ > PH₃ > AsH₃ > SbH₃ ≥ BiH₃',
          'PH₃ > NH₃ > AsH₃ > SbH₃ > BiH₃',
          'all the hydrides are equally basic',
        ],
        correct_index: 1,
        explanation: 'Basicity decreases down the group: $\\ce{NH3} > \\ce{PH3} > \\ce{AsH3} > \\ce{SbH3} \\geq \\ce{BiH3}$, while reducing power increases in the reverse direction.',
      },
      {
        question: 'The single N–N bond is weaker than the single P–P bond mainly because:',
        options: [
          'nitrogen is less electronegative than phosphorus',
          'phosphorus has d orbitals',
          'of high interelectronic repulsion between the lone pairs at the small N–N bond length',
          'nitrogen forms metallic bonds',
        ],
        correct_index: 2,
        explanation: 'The small N–N bond length brings the non-bonding (lone-pair) electrons close together; the resulting high interelectronic repulsion weakens the single N–N bond, so nitrogen catenates poorly.',
      },
      {
        question: 'Down Group 15, the stability of the +5 oxidation state and of the +3 oxidation state respectively:',
        options: [
          'increases and decreases',
          'decreases and increases',
          'both increase',
          'both decrease',
        ],
        correct_index: 1,
        explanation: 'Because of the inert-pair effect, the +5 state becomes less stable and the +3 state more stable down the group (e.g. the only well-characterised Bi(V) compound is $\\ce{BiF5}$).',
      },
      {
        question: 'When Group 15 elements react with metals, the oxidation state they exhibit is:',
        options: ['+3', '+5', '−3', '+1'],
        correct_index: 2,
        explanation: 'They form binary compounds in the −3 state — e.g. $\\ce{Ca3N2}$, $\\ce{Ca3P2}$, $\\ce{Na3As2}$, $\\ce{Zn3Sb2}$, $\\ce{Mg3Bi2}$.',
      },
      {
        question: 'Which trihalide of nitrogen is stable?',
        options: ['NCl₃', 'NBr₃', 'NF₃', 'NI₃'],
        correct_index: 2,
        explanation: 'Among nitrogen trihalides only $\\ce{NF3}$ is known to be stable; nitrogen forms no pentahalide at all (no $d$ orbitals).',
      },
    ], 0.6),
  ],
};
