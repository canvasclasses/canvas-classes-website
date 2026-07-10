// Ch.4 (p-Block) · Page 22 · Quick Recap — The p-Block Elements (revision page).
// A scannable night-before-the-exam revision of the whole chapter (Groups 15–18),
// built straight from the founder's notes-enrichment digest (PBLOCK_BUILD §5).
// Each group: trend-ordering h.table(s) + exam_tip/recap callouts for the ★ traps.
// Closes with a short mixed high-yield quiz (answer positions balanced A/B/C/D).
module.exports = {
  page_number: 22,
  chapter: 4,
  slug: 'p-block-quick-recap',
  title: 'Quick Recap — The p-Block Elements',
  subtitle: 'One scannable page for the night before the exam — every high-yield trend ordering and trap across Groups 15, 16, 17 and 18.',
  tags: ['p-block', 'revision', 'recap'],
  reading_time_min: 8,
  build: (h) => [
    h.img(
      'A hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette (ochre, dusty teal, brick red), no glow or neon. A "revision wall" collage of the p-block: four labelled vertical strips for Group 15 (N P As Sb Bi), Group 16 (O S Se Te Po), Group 17 (F Cl Br I At) and Group 18 (He Ne Ar Kr Xe Rn), with little chalk arrows showing trends going down each column. Clean inorganic-chemistry textbook plate, landscape, desktop-friendly.',
      '16:9',
      'The p-block at a glance — Groups 15 to 18 and the trends that run down each.'
    ),
    h.text(
      'This page pulls together the **high-yield orderings and traps** from the whole chapter. Skim the tables for the trends, and the **Exam Point** callouts for the classic mistakes. Groups run **15 → 18**, left to right.'
    ),

    // ───────────────────────────── GROUP 15 ─────────────────────────────
    h.heading('Group 15 — Nitrogen Family', 'Recall the hydride trends and the most-tested anomalies of N, P, As, Sb and Bi.'),
    h.table(
      ['Hydride property', 'Order', 'Note'],
      [
        ['Stability / basicity', '$\\ce{NH3} > \\ce{PH3} > \\ce{AsH3} > \\ce{SbH3} > \\ce{BiH3}$', 'falls down the group'],
        ['Bond angle', '$107.8° > 93.6° > 91.8° > 91.3°$', '$\\ce{NH3}$ is $sp^3$; the rest use ~pure $p$-orbitals (no hybridisation)'],
        ['Boiling point', '$\\ce{PH3} < \\ce{AsH3} < \\ce{NH3} < \\ce{SbH3} < \\ce{BiH3}$', '$\\ce{NH3}$ is anomalously high (H-bonding)'],
        ['Reducing power', '$\\ce{BiH3} > \\ce{SbH3} > \\ce{AsH3} > \\ce{PH3} > \\ce{NH3}$', 'increases down (weaker E–H bond)'],
      ],
      'Group 15 hydrides — basicity, bond angle, boiling point and reducing power.'
    ),
    h.table(
      ['Oxide', 'Nature'],
      [
        ['$\\ce{N2O3}$, $\\ce{P2O3}$', 'acidic'],
        ['$\\ce{As2O3}$, $\\ce{Sb2O3}$', 'amphoteric'],
        ['$\\ce{Bi2O3}$', 'basic'],
      ],
      'Acidic → basic character of the +3 oxides increases down the group.'
    ),
    h.callout('exam_tip', 'Exam Point — Group 15 trap cluster',
      '- **Inert-pair effect:** $\\ce{Bi^{3+}}$ is more stable than $\\ce{Bi^{5+}}$ (the +3 state dominates at the bottom).\n' +
      '- **$\\ce{PCl5}$ in the solid state is ionic — $\\ce{[PCl4]+[PCl6]-}$** (cation $sp^3$ tetrahedral, anion $sp^3d^2$ octahedral). In $\\ce{PCl5}$ vapour, axial P–Cl (240 pm) $>$ equatorial P–Cl (202 pm).\n' +
      '- **Count the P–H bonds** in P-oxoacids to read off reducing/basicity: $\\ce{H3PO2}$ (two P–H, strong reducing) $>$ $\\ce{H3PO3}$ (one P–H) $>$ $\\ce{H3PO4}$ (no P–H, not reducing). Disproportionation: $\\ce{4H3PO3 -> 3H3PO4 + PH3}$.\n' +
      '- **$\\ce{Cu^{2+}}$ + excess $\\ce{NH3}$ → deep-blue $\\ce{[Cu(NH3)4]^{2+}}$** ★ — the classic "identify the ion" cue.\n' +
      '- **Brown-ring test** for $\\ce{NO3-}$: $\\ce{[Fe(H2O)5(NO)]^{2+}}$ (brown ring at the junction with fresh $\\ce{FeSO4}$ + conc. $\\ce{H2SO4}$).'),
    h.callout('warning', '$\\ce{HNO3}$ with Cu and Zn — dilute vs concentrated matrix',
      'A frequently-confused product table — learn it as a $2 \\times 2$ grid:\n\n' +
      '- **Cu + dilute $\\ce{HNO3}$ →** $\\ce{NO}$ (with $\\ce{Cu(NO3)2}$).\n' +
      '- **Cu + conc. $\\ce{HNO3}$ →** $\\ce{NO2}$.\n' +
      '- **Zn + dilute $\\ce{HNO3}$ →** $\\ce{N2O}$.\n' +
      '- **Zn + conc. $\\ce{HNO3}$ →** $\\ce{NO2}$.\n\n' +
      'Rule of thumb: **concentrated $\\ce{HNO3}$ → $\\ce{NO2}$**; dilute gives the more-reduced product, and the more-reactive metal (Zn) reduces it further.'),

    // ───────────────────────────── GROUP 16 ─────────────────────────────
    h.heading('Group 16 — Oxygen Family', 'Recall the hydride orderings and the S/O/ozone traps for O, S, Se, Te and Po.'),
    h.table(
      ['Hydride property', 'Order', 'Note'],
      [
        ['Acidity', '$\\ce{H2O} < \\ce{H2S} < \\ce{H2Se} < \\ce{H2Te}$', 'increases down (weaker, longer E–H bond)'],
        ['Thermal stability', '$\\ce{H2O} > \\ce{H2S} > \\ce{H2Se} > \\ce{H2Te}$', 'the reverse of acidity'],
        ['Bond angle', '$104° > 92° > 91° > 90°$', '$\\ce{H2O}$ highest; the rest near $90°$'],
        ['Reducing power', '$\\ce{H2Te} > \\ce{H2Se} > \\ce{H2S} > \\ce{H2O}$', 'all except $\\ce{H2O}$ are reducing; increases down'],
      ],
      'Group 16 hydrides — acidity, thermal stability, bond angle and reducing power.'
    ),
    h.callout('exam_tip', 'Exam Point — Group 16 trap cluster',
      '- **$\\ce{S2}$ is paramagnetic, exactly like $\\ce{O2}$** ★ (two unpaired electrons in $\\pi^*$). Sulphur vapour at high temperature contains $\\ce{S2}$.\n' +
      '- **Moist $\\ce{SO2}$ is a reducing agent** ★ — it reduces $\\ce{Fe^{3+} -> Fe^{2+}}$ and decolourises acidified $\\ce{MnO4-}$ ($\\ce{Mn^{2+}}$).\n' +
      '- **Ozone is endothermic:** $\\ce{3O2 -> 2O3}$, $\\Delta H = +142\\ \\text{kJ mol}^{-1}$; it is **angular, bond angle $117°$**, and a powerful oxidiser ($\\ce{O3 -> O2 + [O]}$). $\\ce{NO}$ depletes the ozone layer.\n' +
      '- **Sulphur allotropy:** rhombic ($\\alpha$) $\\xrightarrow{369\\ \\text{K}}$ monoclinic ($\\beta$); both contain the $\\ce{S8}$ crown ring ($107°$).\n' +
      '- **Oxoacids — know the linkage:** $\\ce{H2S2O7}$ = pyrosulphuric (oleum), an **S–O–S** bridge; $\\ce{H2S2O8}$ = peroxodisulphuric, an **O–O (peroxo)** linkage. Marshall’s vs Caro’s is a favourite.'),

    // ───────────────────────────── GROUP 17 ─────────────────────────────
    h.heading('Group 17 — The Halogens', 'Recall the four key orderings (EA, bond enthalpy, oxidising power, HX) and the halogen traps.'),
    h.table(
      ['Property', 'Order'],
      [
        ['Electron gain enthalpy (most −ve)', '$\\ce{Cl} > \\ce{F} > \\ce{Br} > \\ce{I}$'],
        ['Bond enthalpy ($\\ce{X2}$)', '$\\ce{Cl2} > \\ce{Br2} > \\ce{F2} > \\ce{I2}$'],
        ['Oxidising power', '$\\ce{F2} > \\ce{Cl2} > \\ce{Br2} > \\ce{I2}$'],
        ['HX acidity', '$\\ce{HF} < \\ce{HCl} < \\ce{HBr} < \\ce{HI}$'],
        ['HX reducing power', '$\\ce{HI} > \\ce{HBr} > \\ce{HCl}$'],
        ['HX boiling point', '$\\ce{HCl} < \\ce{HBr} < \\ce{HI} < \\ce{HF}$'],
      ],
      'The halogen orderings — note F is the anomaly in EA and bond enthalpy.'
    ),
    h.table(
      ['Couple', '$E°\\ (\\ce{X2}/\\ce{X-})$ / V'],
      [
        ['$\\ce{F2}/\\ce{F-}$', '$+2.87$'],
        ['$\\ce{Cl2}/\\ce{Cl-}$', '$+1.36$'],
        ['$\\ce{Br2}/\\ce{Br-}$', '$+1.09$'],
        ['$\\ce{I2}/\\ce{I-}$', '$+0.54$'],
      ],
      'Standard reduction potentials — highest for $\\ce{F2}$ (strongest oxidiser), so $\\ce{F2}$ displaces all other halide ions.'
    ),
    h.callout('exam_tip', 'Exam Point — Group 17 trap cluster',
      '- **Fluorine forms fluorides of oxygen, not oxides** — $\\ce{OF2}$ and $\\ce{O2F2}$ (F is more electronegative than O, so O is the +ve element).\n' +
      '- **Cl₂ with NaOH (disproportionation pair):** with **cold dilute** → $\\ce{NaCl + NaOCl}$; with **hot conc.** → $\\ce{NaCl + NaClO3}$.\n' +
      '- **Bleaching powder** $\\ce{Ca(OCl)2.CaCl2.Ca(OH)2.2H2O}$; bleaches via nascent oxygen ($\\ce{HOCl -> HCl + [O]}$).\n' +
      '- **Aqua regia = 3 HCl : 1 $\\ce{HNO3}$** — dissolves Au and Pt.\n' +
      '- **Interhalogen hydrolysis rule $\\ce{XX\' -> HX\' + HOX}$:** the **bigger / less-electronegative** halogen becomes $+1$ (in $\\ce{HOX}$), the **smaller / more-electronegative** one becomes $-1$ (in $\\ce{HX\'}$).\n' +
      '- **Interhalogen shapes:** $\\ce{XX3}$ bent-T, $\\ce{XX5}$ square-pyramidal, $\\ce{IF7}$ pentagonal-bipyramidal.'),

    // ───────────────────────────── GROUP 18 ─────────────────────────────
    h.heading('Group 18 — The Noble Gases', 'Recall the Xe-compound shapes, the partial-hydrolysis products, and the He/Ne anomalies.'),
    h.table(
      ['Xe species', 'Shape / hybridisation'],
      [
        ['$\\ce{XeF2}$', 'linear ($sp^3d$)'],
        ['$\\ce{XeF4}$', 'square planar ($sp^3d^2$)'],
        ['$\\ce{XeF6}$', 'distorted octahedral ($sp^3d^3$)'],
        ['$\\ce{XeOF4}$', 'square pyramidal'],
        ['$\\ce{XeO3}$', 'pyramidal'],
      ],
      'Shapes of the common xenon compounds — high-yield in VSEPR/structure questions.'
    ),
    h.callout('exam_tip', 'Exam Point — Group 18 trap cluster',
      '- **Xe and $\\ce{O2}$ have almost identical first ionisation enthalpies** (1170 vs 1175 kJ mol⁻¹) ★ — this is the logic Bartlett used: if $\\ce{O2}$ + $\\ce{PtF6}$ works, so should Xe → **$\\ce{Xe[PtF6]}$**, the first noble-gas compound.\n' +
      '- **$\\ce{XeF6}$ partial hydrolysis** ★: with a little water $\\ce{XeF6 + H2O -> XeOF4 + 2HF}$; with more $\\ce{XeF6 + 2H2O -> XeO2F2 + 4HF}$; **complete** hydrolysis gives $\\ce{XeO3}$.\n' +
      '- **He has the lowest boiling point of any element (4.2 K).** Ne has the most endothermic (most +ve) electron gain enthalpy. Ar is ≈ 1% of air by volume.'),

    // ───────────────────────────── RECAP STRIP ─────────────────────────────
    h.recap([
      { label: 'Group 15 hydrides', text: 'Basicity/stability $\\ce{NH3} > \\ce{PH3} > \\ce{AsH3} > \\ce{SbH3} > \\ce{BiH3}$; bond angle $107.8° \\to 91°$ ($\\ce{NH3}$ $sp^3$, rest ~pure $p$).' },
      { label: 'Group 15 traps', text: 'Inert pair $\\ce{Bi^{3+}} > \\ce{Bi^{5+}}$; $\\ce{PCl5}$ solid = $\\ce{[PCl4]+[PCl6]-}$; P–H count = reducing power; $\\ce{Cu^{2+}}$ deep-blue; brown-ring; conc-vs-dil $\\ce{HNO3}$.' },
      { label: 'Group 16 hydrides', text: 'Acidity $\\ce{H2O} < \\ce{H2S} < \\ce{H2Se} < \\ce{H2Te}$; thermal stability the reverse; bond angle $104° \\to 90°$.' },
      { label: 'Group 16 traps', text: '$\\ce{S2}$ paramagnetic like $\\ce{O2}$; moist $\\ce{SO2}$ reducing; ozone endothermic + $117°$; oleum $\\ce{H2S2O7}$ (S–O–S) vs peroxo $\\ce{H2S2O8}$ (O–O).' },
      { label: 'Group 17 orderings', text: 'EA $\\ce{Cl} > \\ce{F} > \\ce{Br} > \\ce{I}$; bond enthalpy $\\ce{Cl2} > \\ce{Br2} > \\ce{F2} > \\ce{I2}$; oxidising $\\ce{F2} > \\ce{Cl2} > \\ce{Br2} > \\ce{I2}$; HX acidity $\\ce{HF} < \\ce{HCl} < \\ce{HBr} < \\ce{HI}$; reducing $\\ce{HI} > \\ce{HBr} > \\ce{HCl}$.' },
      { label: 'Group 17 traps', text: 'F → $\\ce{OF2}/\\ce{O2F2}$; $\\ce{Cl2}$ + cold-dil vs hot-conc NaOH; bleaching powder; aqua regia 3:1; interhalogen $\\ce{XX\' -> HX\' + HOX}$; shapes bent-T / square-pyramidal / pentagonal-bipyramidal.' },
      { label: 'Group 18', text: 'Xe ≈ $\\ce{O2}$ IE → $\\ce{XePtF6}$; $\\ce{XeF6}$ partial hydrolysis → $\\ce{XeOF4}$/$\\ce{XeO2F2}$; shapes $\\ce{XeF2}$ linear, $\\ce{XeF4}$ square-planar, $\\ce{XeF6}$ distorted-oct, $\\ce{XeOF4}$ square-pyramidal, $\\ce{XeO3}$ pyramidal; He lowest b.p.' },
    ]),

    // ───────────────────────────── MIXED QUIZ ─────────────────────────────
    h.quiz([
      {
        question: 'The correct order of basicity of the Group 15 hydrides is:',
        options: [
          '$\\ce{NH3} > \\ce{PH3} > \\ce{AsH3} > \\ce{SbH3} > \\ce{BiH3}$',
          '$\\ce{BiH3} > \\ce{SbH3} > \\ce{AsH3} > \\ce{PH3} > \\ce{NH3}$',
          '$\\ce{PH3} > \\ce{NH3} > \\ce{AsH3} > \\ce{SbH3} > \\ce{BiH3}$',
          '$\\ce{NH3} > \\ce{AsH3} > \\ce{PH3} > \\ce{BiH3} > \\ce{SbH3}$',
        ],
        correct_index: 0,
        explanation: 'Basicity (and stability) falls down the group as the lone pair becomes more diffuse: $\\ce{NH3} > \\ce{PH3} > \\ce{AsH3} > \\ce{SbH3} > \\ce{BiH3}$.',
      },
      {
        question: 'Solid phosphorus pentachloride exists as:',
        options: [
          'discrete trigonal-bipyramidal $\\ce{PCl5}$ molecules',
          'the ionic solid $\\ce{[PCl4]+[PCl6]-}$ ($sp^3$ cation, $sp^3d^2$ anion)',
          'a covalent network of P and Cl atoms',
          'the dimer $\\ce{P2Cl10}$',
        ],
        correct_index: 1,
        explanation: 'In the solid state $\\ce{PCl5}$ is ionic: a tetrahedral $\\ce{[PCl4]+}$ ($sp^3$) and an octahedral $\\ce{[PCl6]-}$ ($sp^3d^2$).',
      },
      {
        question: 'Which pair of species are BOTH paramagnetic?',
        options: [
          '$\\ce{N2}$ and $\\ce{H2O}$',
          '$\\ce{O3}$ and $\\ce{SO2}$',
          '$\\ce{O2}$ and $\\ce{S2}$',
          '$\\ce{NH3}$ and $\\ce{PH3}$',
        ],
        correct_index: 2,
        explanation: 'Both $\\ce{O2}$ and $\\ce{S2}$ have two unpaired electrons in their $\\pi^*$ antibonding orbitals, so both are paramagnetic.',
      },
      {
        question: 'The correct order of acidic strength of the Group 16 hydrides is:',
        options: [
          '$\\ce{H2Te} < \\ce{H2Se} < \\ce{H2S} < \\ce{H2O}$',
          '$\\ce{H2O} < \\ce{H2S} < \\ce{H2Se} < \\ce{H2Te}$',
          '$\\ce{H2S} < \\ce{H2O} < \\ce{H2Te} < \\ce{H2Se}$',
          'all four have equal acidity',
        ],
        correct_index: 1,
        explanation: 'Acidity increases down the group as the E–H bond lengthens and weakens: $\\ce{H2O} < \\ce{H2S} < \\ce{H2Se} < \\ce{H2Te}$ (the reverse of thermal stability).',
      },
      {
        question: 'Which of the following has the highest standard reduction potential $E°(\\ce{X2}/\\ce{X-})$, making it the strongest oxidising halogen?',
        options: [
          '$\\ce{I2}$ ($+0.54$ V)',
          '$\\ce{Br2}$ ($+1.09$ V)',
          '$\\ce{Cl2}$ ($+1.36$ V)',
          '$\\ce{F2}$ ($+2.87$ V)',
        ],
        correct_index: 3,
        explanation: 'Oxidising power follows $\\ce{F2} > \\ce{Cl2} > \\ce{Br2} > \\ce{I2}$; $\\ce{F2}$ has the highest $E°$ ($+2.87$ V) and displaces every other halide ion.',
      },
      {
        question: 'On warming chlorine with HOT, CONCENTRATED NaOH, the products are:',
        options: [
          '$\\ce{NaCl}$ and $\\ce{NaClO3}$',
          '$\\ce{NaCl}$ and $\\ce{NaOCl}$',
          '$\\ce{NaClO4}$ and $\\ce{H2}$',
          '$\\ce{NaCl}$ and $\\ce{NaClO2}$',
        ],
        correct_index: 0,
        explanation: 'Hot conc. NaOH gives chloride + chlorate ($\\ce{NaCl + NaClO3}$); cold dilute NaOH gives chloride + hypochlorite ($\\ce{NaCl + NaOCl}$). Both are disproportionations.',
      },
      {
        question: 'Partial hydrolysis of $\\ce{XeF6}$ with a limited amount of water gives:',
        options: [
          '$\\ce{XeO3}$ only',
          '$\\ce{Xe}$ and $\\ce{O2}$',
          '$\\ce{XeOF4}$ (and HF)',
          '$\\ce{XeF4}$ and $\\ce{F2}$',
        ],
        correct_index: 2,
        explanation: 'Partial hydrolysis: $\\ce{XeF6 + H2O -> XeOF4 + 2HF}$ (and $\\ce{+ 2H2O -> XeO2F2}$); complete hydrolysis gives $\\ce{XeO3}$.',
      },
      {
        question: 'Which statement is correct?',
        options: [
          'Bismuth is most stable in the +5 oxidation state.',
          'Fluorine forms the oxides $\\ce{F2O3}$ and $\\ce{F2O5}$.',
          'Helium has the highest boiling point among the noble gases.',
          'Xenon and $\\ce{O2}$ have almost identical first ionisation enthalpies, the basis of $\\ce{XePtF6}$.',
        ],
        correct_index: 3,
        explanation: 'Xe (1170) and $\\ce{O2}$ (1175 kJ mol⁻¹) have nearly equal IE₁ — Bartlett’s reasoning behind $\\ce{Xe[PtF6]}$. (Bi favours +3 by the inert-pair effect; F forms fluorides of oxygen $\\ce{OF2}/\\ce{O2F2}$, not oxides; He has the LOWEST b.p.)',
      },
    ], 0.6),
  ],
};
