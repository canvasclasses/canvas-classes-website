// NCERT textbook end-of-chapter EXERCISES 7.1–7.40 — Class 12 Chemistry, Unit 7 (The p-Block Elements)
// from "12th - P Block.pdf", pages 42–44 (book pages 207–208).
// Question stems transcribed verbatim from the NCERT chapter PDF.
// Every item is a tap-to-reveal numerical (`kind:'numerical'`). Item shape mirrors
// the Solutions sibling scripts/practice-sol/ncert_sol.js.
// Items are grouped by the family the question is most about:
//   group-15 (N, P, As, Sb, Bi) | group-16 (O, S, Se, Te) | group-17 (F, Cl, Br, I) | group-18 (noble gases).
// The chapter PDF prints answers only for SOME intext questions; these were used as
// cross-checks where applicable. All exercise answers below were written by hand from
// standard NCERT content.

module.exports = {
  'group-15': [
    {
      kind: 'numerical',
      id: 'pb-ncert-7-1',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.1',
      prompt:
        'Discuss the general characteristics of Group 15 elements with reference to their electronic configuration, oxidation state, atomic size, ionisation enthalpy and electronegativity.',
      solution:
        '**Electronic configuration:** Group 15 elements (N, P, As, Sb, Bi) have the general valence-shell configuration $ ns^2 np^3 $. The half-filled $ np^3 $ sub-shell is extra-stable.\n\n' +
        '**Oxidation states:** They show oxidation states of $ -3, +3 $ and $ +5 $. The stability of the $ +5 $ state decreases and that of $ +3 $ increases down the group due to the **inert-pair effect**. The $ -3 $ state becomes less stable down the group (only N and P readily show it).\n\n' +
        '**Atomic size:** Covalent and ionic radii **increase down the group**. The increase from N to P is large, but is smaller thereafter because of the presence of completely filled $ d $ (and later $ f $) orbitals in the heavier elements.\n\n' +
        '**Ionisation enthalpy:** It **decreases down the group** because atomic size increases. Group 15 elements have higher ionisation enthalpies than the corresponding Group 14 and Group 16 elements because of the extra-stable half-filled $ np^3 $ configuration.\n\n' +
        '**Electronegativity:** It **decreases down the group** as atomic size increases, the decrease being gradual after phosphorus.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-2',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.2',
      prompt: 'Why does the reactivity of nitrogen differ from phosphorus?',
      solution:
        'Nitrogen exists as a diatomic molecule $\\ce{N2}$ in which the two atoms are joined by a very strong **triple bond** ($ \\ce{N#N} $, bond enthalpy $ \\approx 941\\ \\text{kJ mol}^{-1} $), formed by effective $ p\\pi$–$p\\pi $ overlap possible only for the small second-period atom. This makes $\\ce{N2}$ extremely inert at ordinary temperatures.\n\n' +
        'Phosphorus, being a larger atom, cannot form effective $ p\\pi$–$p\\pi $ bonds, so it exists as a **tetrahedral $\\ce{P4}$ molecule** held by weaker single P–P bonds. These weaker bonds break easily, making phosphorus far **more reactive** than nitrogen.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-3',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.3',
      prompt: 'Discuss the trends in chemical reactivity of group 15 elements.',
      solution:
        '**Reactivity towards hydrogen:** Group 15 elements form hydrides of type $\\ce{EH3}$ ($\\ce{NH3, PH3, AsH3, SbH3, BiH3}$). Stability, ease of formation, basicity and reducing... thermal stability **decrease** down the group; reducing character **increases** down the group. Basic strength order: $\\ce{NH3 > PH3 > AsH3 > SbH3 >= BiH3}$.\n\n' +
        '**Reactivity towards oxygen:** They form oxides of type $\\ce{E2O3}$ and $\\ce{E2O5}$. The acidic character of the oxides **decreases** (and basic character increases) down the group: $\\ce{N2O3}$ and $\\ce{P2O3}$ are acidic, $\\ce{As2O3}$ and $\\ce{Sb2O3}$ are amphoteric, and $\\ce{Bi2O3}$ is basic. For a given element, the higher oxide ($\\ce{E2O5}$) is more acidic than the lower ($\\ce{E2O3}$).\n\n' +
        '**Reactivity towards halogens:** They form trihalides $\\ce{EX3}$ (mostly covalent, except those of bismuth which are ionic) and pentahalides $\\ce{EX5}$. The $ +3 $ state becomes more stable than $ +5 $ down the group due to the inert-pair effect.\n\n' +
        '**Reactivity towards metals:** They react with metals to form binary compounds in the $ -3 $ oxidation state, e.g. $\\ce{Ca3N2}$, $\\ce{Ca3P2}$.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-4',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.4',
      prompt: 'Why does $\\ce{NH3}$ form hydrogen bond but $\\ce{PH3}$ does not?',
      solution:
        'Nitrogen is much more **electronegative** and **smaller** than phosphorus. In $\\ce{NH3}$ the high electronegativity of N makes the N–H bonds strongly polar, so the N atom develops a large partial negative charge and the H atoms a large partial positive charge, allowing **hydrogen bonding** ($\\ce{N-H\\bond{...}N}$).\n\n' +
        'In $\\ce{PH3}$, phosphorus has low electronegativity (close to that of hydrogen), so the P–H bonds are almost non-polar. The charge separation is too small to form hydrogen bonds. Hence $\\ce{NH3}$ is hydrogen-bonded (higher boiling point) while $\\ce{PH3}$ is not.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-5',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.5',
      prompt:
        'How is nitrogen prepared in the laboratory? Write the chemical equations of the reactions involved.',
      solution:
        'In the laboratory, dinitrogen is prepared by gently warming an aqueous solution of **ammonium chloride with sodium nitrite**:\n\n' +
        '$$\\ce{NH4Cl(aq) + NaNO2(aq) ->[\\Delta] N2(g) + 2H2O(l) + NaCl(aq)}$$\n\n' +
        'Small amounts of $\\ce{NO}$ and $\\ce{HNO3}$ are also formed; these impurities are removed by passing the gas through aqueous sulphuric acid containing potassium dichromate.\n\n' +
        'Very pure nitrogen can be obtained by the **thermal decomposition of ammonium dichromate** or of sodium/barium azide:\n\n' +
        '$$\\ce{(NH4)2Cr2O7 ->[\\Delta] N2 + 4H2O + Cr2O3}$$\n' +
        '$$\\ce{Ba(N3)2 ->[\\Delta] Ba + 3N2}$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-6',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.6',
      prompt: 'How is ammonia manufactured industrially?',
      solution:
        'Ammonia is manufactured industrially by the **Haber process**, in which dinitrogen and dihydrogen combine directly:\n\n' +
        '$$\\ce{N2(g) + 3H2(g) <=> 2NH3(g)} \\qquad \\Delta_f H^\\circ = -46.1\\ \\text{kJ mol}^{-1}$$\n\n' +
        'The forward reaction is exothermic and proceeds with a decrease in moles, so (by Le Chatelier\'s principle) it is favoured by **low temperature and high pressure**. Optimum conditions are:\n\n' +
        '- **Pressure:** about $ 200 \\times 10^5\\ \\text{Pa} $ (~200 atm)\n' +
        '- **Temperature:** about $ 700\\ \\text{K} $ (a compromise — low enough for good yield, high enough for a reasonable rate)\n' +
        '- **Catalyst:** finely divided **iron** with a small amount of $\\ce{K2O}$ and $\\ce{Al2O3}$ as promoters to increase the rate.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-7',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.7',
      prompt:
        'Illustrate how copper metal can give different products on reaction with $\\ce{HNO3}$.',
      solution:
        'The product depends on the **concentration** of nitric acid.\n\n' +
        'With **dilute** $\\ce{HNO3}$, copper gives nitric oxide ($\\ce{NO}$):\n\n' +
        '$$\\ce{3Cu + 8HNO3(dilute) -> 3Cu(NO3)2 + 2NO + 4H2O}$$\n\n' +
        'With **concentrated** $\\ce{HNO3}$, copper gives nitrogen dioxide ($\\ce{NO2}$):\n\n' +
        '$$\\ce{Cu + 4HNO3(conc.) -> Cu(NO3)2 + 2NO2 + 2H2O}$$\n\n' +
        'Thus the same metal yields different reduction products of nitrogen depending on the concentration of the acid.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-8',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.8',
      prompt: 'Give the resonating structures of $\\ce{NO2}$ and $\\ce{N2O5}$.',
      solution:
        '**$\\ce{NO2}$:** The molecule is bent (O–N–O). The single and double N–O bonds are interchanged between the two oxygen atoms, giving two equivalent resonance structures:\n\n' +
        '$$\\ce{O=N-O <-> O-N=O}$$\n\n' +
        'so both N–O bonds are identical (bond order $ 1.5 $), with the odd electron on nitrogen.\n\n' +
        '**$\\ce{N2O5}$:** It has the structure $\\ce{O2N-O-NO2}$ (two $\\ce{NO2}$ groups joined through a bridging oxygen). On each nitrogen the N=O and N–O bonds resonate between the terminal oxygens, giving resonance structures in which the terminal N–O bonds are equivalent. The covalence of nitrogen is **four** in $\\ce{N2O5}$.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-9',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.9',
      prompt:
        'The HNH angle value is higher than HPH, HAsH and HSbH angles. Why? [Hint: Can be explained on the basis of $ sp^3 $ hybridisation in $\\ce{NH3}$ and only $ s$–$p $ bonding between hydrogen and other elements of the group].',
      solution:
        'In $\\ce{NH3}$ the nitrogen atom is **$ sp^3 $ hybridised**; the three N–H bonds use $ sp^3 $ orbitals, giving an H–N–H angle of about $ 107^\\circ $ (close to the tetrahedral angle, slightly reduced by lone-pair repulsion).\n\n' +
        'In $\\ce{PH3}$, $\\ce{AsH3}$ and $\\ce{SbH3}$ the central atom is **larger and less electronegative**, and bonding occurs essentially through **pure $ p $ orbitals** (little or no hybridisation). Pure $ p $ orbitals are at $ 90^\\circ $, so the bond angles are close to that value and **decrease** down the group:\n\n' +
        '$$\\ce{NH3}\\ (107^\\circ) > \\ce{PH3}\\ (\\sim 93.6^\\circ) > \\ce{AsH3}\\ (\\sim 91.8^\\circ) > \\ce{SbH3}\\ (\\sim 91.3^\\circ)$$\n\n' +
        'Hence the HNH angle is the largest of the four.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-10',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.10',
      prompt: 'Why does $\\ce{R3P=O}$ exist but $\\ce{R3N=O}$ does not (R = alkyl group)?',
      solution:
        'In $\\ce{R3P=O}$ the P=O bond involves a $ p\\pi$–$d\\pi $ interaction: phosphorus has **vacant $ 3d $ orbitals** into which the oxygen lone-pair electrons can be donated, so phosphorus can expand its valence shell beyond an octet and form the additional $\\pi$ bond.\n\n' +
        'Nitrogen, being a second-period element, **has no $ d $ orbitals** in its valence shell, so it cannot expand its octet to form the extra $\\pi$ bond required for $\\ce{R3N=O}$. Hence $\\ce{R3P=O}$ exists but $\\ce{R3N=O}$ does not.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-11',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.11',
      prompt: 'Explain why $\\ce{NH3}$ is basic while $\\ce{BiH3}$ is only feebly basic.',
      solution:
        'The basicity of Group 15 hydrides arises from the **lone pair on the central atom** being available for donation.\n\n' +
        'In $\\ce{NH3}$ the nitrogen atom is small, so the lone pair is concentrated in a small region — it is **easily available** for donation, making $\\ce{NH3}$ a good base. Down the group the atomic size increases, the lone pair occupies a larger and more diffuse orbital, and the electron density (and donating ability) falls.\n\n' +
        'In $\\ce{BiH3}$ bismuth is the **largest** atom of the group; its lone pair is highly diffuse and only weakly available for donation, so $\\ce{BiH3}$ is only **feebly basic**. Basic strength order: $\\ce{NH3 > PH3 > AsH3 > SbH3 >= BiH3}$.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-12',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.12',
      prompt: 'Nitrogen exists as diatomic molecule and phosphorus as $\\ce{P4}$. Why?',
      solution:
        'Nitrogen is a **small** second-period atom that can form strong **$ p\\pi$–$p\\pi $ multiple bonds**. Two nitrogen atoms therefore combine through a strong **triple bond** to give the very stable diatomic molecule $\\ce{N#N}$ (bond enthalpy $ \\approx 941\\ \\text{kJ mol}^{-1} $).\n\n' +
        'Phosphorus is a **larger** atom and cannot form effective $ p\\pi$–$p\\pi $ bonds because of poor orbital overlap. Instead, each phosphorus atom forms **three single (sigma) P–P bonds**, giving a tetrahedral **$\\ce{P4}$** molecule. The three single bonds per atom release more energy overall than a hypothetical P≡P would, so $\\ce{P4}$ (not $\\ce{P2}$) is the stable form.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-13',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.13',
      prompt:
        'Write main differences between the properties of white phosphorus and red phosphorus.',
      solution:
        '| Property | White phosphorus | Red phosphorus |\n' +
        '|---|---|---|\n' +
        '| Appearance | Translucent white waxy solid | Iron-grey lustrous powder |\n' +
        '| Structure | Discrete tetrahedral $\\ce{P4}$ molecules | Polymeric — chains of $\\ce{P4}$ units linked together |\n' +
        '| Reactivity | Very reactive (strained $ 60^\\circ $ bond angles) | Much less reactive |\n' +
        '| Toxicity | Poisonous | Non-poisonous |\n' +
        '| Air | Spontaneously inflammable; glows in dark (chemiluminescence) | Stable in air; does not glow |\n' +
        '| Solubility | Insoluble in water, soluble in $\\ce{CS2}$ | Insoluble in both water and $\\ce{CS2}$ |\n' +
        '| Storage | Kept under water | Kept in air |\n\n' +
        'White phosphorus is converted to red phosphorus on heating to about $ 573\\ \\text{K} $ in an inert atmosphere.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-14',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.14',
      prompt: 'Why does nitrogen show catenation properties less than phosphorus?',
      solution:
        'Catenation (the tendency of an element to form chains by self-linking) depends on the **strength of the element–element single bond**.\n\n' +
        'The **N–N single bond is weak** (bond enthalpy $ \\approx 159\\ \\text{kJ mol}^{-1} $) because the two small nitrogen atoms come close together and the **lone pairs on adjacent atoms repel each other strongly** (inter-electronic repulsion). The **P–P single bond is stronger** ($ \\approx 213\\ \\text{kJ mol}^{-1} $) since phosphorus is larger and the lone-pair repulsions are smaller.\n\n' +
        'Because the N–N bond is weaker than the P–P bond, nitrogen shows catenation to a **smaller extent** than phosphorus.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-15',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.15',
      prompt: 'Give the disproportionation reaction of $\\ce{H3PO3}$.',
      solution:
        'On heating, orthophosphorous acid ($\\ce{H3PO3}$, phosphorus in the $ +3 $ state) **disproportionates** into phosphoric acid ($ +5 $) and phosphine ($ -3 $):\n\n' +
        '$$\\ce{4H3PO3 ->[\\Delta] 3H3PO4 + PH3}$$\n\n' +
        'Here phosphorus is simultaneously oxidised (from $ +3 $ to $ +5 $ in $\\ce{H3PO4}$) and reduced (from $ +3 $ to $ -3 $ in $\\ce{PH3}$), which is the definition of a disproportionation reaction.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-16',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.16',
      prompt: 'Can $\\ce{PCl5}$ act as an oxidising as well as a reducing agent? Justify.',
      solution:
        'In $\\ce{PCl5}$ phosphorus is in its **highest oxidation state, $ +5 $**, and chlorine is in its lowest state, $ -1 $.\n\n' +
        '**As an oxidising agent:** Since phosphorus is already at $ +5 $, it can only go **down** in oxidation state, so $\\ce{PCl5}$ can act as an oxidising agent, e.g. it oxidises metals to their chlorides:\n\n' +
        '$$\\ce{2Ag + PCl5 -> 2AgCl + PCl3}$$\n' +
        '$$\\ce{Sn + 2PCl5 -> SnCl4 + 2PCl3}$$\n\n' +
        '**It cannot act as a reducing agent through phosphorus**, because phosphorus is already in its maximum ($ +5 $) state and cannot be oxidised further. (Thus, considering phosphorus, $\\ce{PCl5}$ behaves only as an oxidising agent, not as a reducing agent.)',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-31',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.31',
      prompt:
        'What are the oxidation states of phosphorus in the following:\n\n(i) $\\ce{H3PO3}$\n\n(ii) $\\ce{PCl3}$\n\n(iii) $\\ce{Ca3P2}$\n\n(iv) $\\ce{Na3PO4}$\n\n(v) $\\ce{POF3}$?',
      answer:
        '(i) +3, (ii) +3, (iii) −3, (iv) +5, (v) +5.',
      solution:
        '**(i) $\\ce{H3PO3}$:** $ 3(+1) + x + 3(-2) = 0 \\Rightarrow x = +3 $.\n\n' +
        '**(ii) $\\ce{PCl3}$:** $ x + 3(-1) = 0 \\Rightarrow x = +3 $.\n\n' +
        '**(iii) $\\ce{Ca3P2}$:** $ 3(+2) + 2x = 0 \\Rightarrow x = -3 $.\n\n' +
        '**(iv) $\\ce{Na3PO4}$:** $ 3(+1) + x + 4(-2) = 0 \\Rightarrow x = +5 $.\n\n' +
        '**(v) $\\ce{POF3}$:** $ x + (-2) + 3(-1) = 0 \\Rightarrow x = +5 $.',
    },
  ],

  'group-16': [
    {
      kind: 'numerical',
      id: 'pb-ncert-7-17',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.17',
      prompt:
        'Justify the placement of O, S, Se, Te and Po in the same group of the periodic table in terms of electronic configuration, oxidation state and hydride formation.',
      solution:
        '**Electronic configuration:** All of these elements have the same valence-shell configuration $ ns^2 np^4 $ (six valence electrons), which is why they are placed together in Group 16 (the chalcogens).\n\n' +
        '**Oxidation states:** They show common oxidation states of $ -2, +2, +4 $ and $ +6 $. Oxygen, being highly electronegative and lacking $ d $ orbitals, shows mainly $ -2 $ (and $ -1 $ in peroxides). The heavier elements show $ +4 $ and $ +6 $ as well; the stability of $ +6 $ decreases and that of $ +4 $ increases down the group (inert-pair effect).\n\n' +
        '**Hydride formation:** All form hydrides of the type $\\ce{H2E}$ — $\\ce{H2O, H2S, H2Se, H2Te, H2Po}$. Their thermal stability **decreases** and reducing/acidic character **increases** down the group. This common formula and gradation in properties justify their placement in one group.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-18',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.18',
      prompt: 'Why is dioxygen a gas but sulphur a solid?',
      solution:
        'Oxygen is a small second-period atom that forms strong **$ p\\pi$–$p\\pi $ double bonds**, so it exists as discrete diatomic $\\ce{O2}$ molecules. The only forces between these small non-polar molecules are weak **van der Waals forces**, so very little energy is needed to keep them apart — $\\ce{O2}$ is a **gas** at room temperature.\n\n' +
        'Sulphur is a larger atom that does **not** form effective $ p\\pi$–$p\\pi $ bonds; instead it catenates through single S–S bonds to form large **$\\ce{S8}$ puckered-ring molecules** (and polymeric chains). These big molecules have much stronger van der Waals forces, so sulphur is a **solid** at room temperature.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-19',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.19',
      prompt:
        'Knowing the electron gain enthalpy values for $\\ce{O -> O^-}$ and $\\ce{O -> O^{2-}}$ as $ -141 $ and $ 702\\ \\text{kJ mol}^{-1} $ respectively, how can you account for the formation of a large number of oxides having $\\ce{O^{2-}}$ species and not $\\ce{O^-}$? (Hint: Consider lattice energy factor in the formation of compounds).',
      solution:
        'Forming $\\ce{O^{2-}}$ from a gaseous O atom is **overall endothermic**: the first electron gain releases $ 141\\ \\text{kJ mol}^{-1} $, but adding the second electron must overcome the repulsion of the existing negative charge and **requires** $ 702\\ \\text{kJ mol}^{-1} $, so the net energy to form $\\ce{O^{2-}} $ is about $ +561\\ \\text{kJ mol}^{-1} $.\n\n' +
        'Despite this, most metal oxides contain $\\ce{O^{2-}}$ rather than $\\ce{O^-}$. The reason is the **lattice energy**. A doubly charged $\\ce{O^{2-}}$ ion forms a much more stable ionic lattice (lattice energy $ \\propto $ product of ionic charges) than a singly charged $\\ce{O^-}$ ion. The large lattice energy released on forming the $\\ce{O^{2-}}$ lattice **more than compensates** for the energy needed to make $\\ce{O^{2-}}$, making oxides of $\\ce{O^{2-}}$ energetically favourable overall.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-20',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.20',
      prompt: 'Which aerosols deplete ozone?',
      solution:
        '**Chlorofluorocarbons (CFCs / freons)** — used as propellants in aerosol sprays, refrigerants and foam-blowing agents — are responsible for ozone depletion.\n\n' +
        'In the stratosphere, UV radiation breaks the C–Cl bonds of CFCs, releasing **chlorine free radicals ($\\ce{Cl^.}$)**, which catalytically destroy ozone:\n\n' +
        '$$\\ce{Cl^. + O3 -> ClO^. + O2}$$\n' +
        '$$\\ce{ClO^. + O -> Cl^. + O2}$$\n\n' +
        'The $\\ce{Cl^.}$ is regenerated, so each chlorine atom destroys many ozone molecules.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-21',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.21',
      prompt: 'Describe the manufacture of $\\ce{H2SO4}$ by contact process?',
      solution:
        'Sulphuric acid is manufactured by the **Contact Process** in three stages.\n\n' +
        '**1. Burning of sulphur/sulphide ore** to give $\\ce{SO2}$:\n' +
        '$$\\ce{S + O2 -> SO2} \\qquad \\ce{4FeS2 + 11O2 -> 2Fe2O3 + 8SO2}$$\n\n' +
        '**2. Catalytic oxidation of $\\ce{SO2}$ to $\\ce{SO3}$** (the key, reversible step), using $\\ce{V2O5}$ catalyst at about $ 720\\ \\text{K} $ and 2 atm:\n' +
        '$$\\ce{2SO2 + O2 <=>[V2O5] 2SO3} \\qquad \\Delta H = -196\\ \\text{kJ mol}^{-1}$$\n' +
        'Being exothermic with a decrease in moles, the yield is favoured by **moderate temperature and high pressure**.\n\n' +
        '**3. Absorption of $\\ce{SO3}$ in conc. $\\ce{H2SO4}$** to give oleum, which is then diluted:\n' +
        '$$\\ce{SO3 + H2SO4 -> H2S2O7\\ (oleum)}$$\n' +
        '$$\\ce{H2S2O7 + H2O -> 2H2SO4}$$\n\n' +
        '($\\ce{SO3}$ is not absorbed directly in water because it forms a dense, hard-to-condense acid mist.) The process gives sulphuric acid of about $ 96$–$98\\% $ purity.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-22',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.22',
      prompt: 'How is $\\ce{SO2}$ an air pollutant?',
      solution:
        '$\\ce{SO2}$ is released into the atmosphere mainly from the burning of sulphur-containing fossil fuels and the roasting of sulphide ores. It is an air pollutant for several reasons:\n\n' +
        '- It is **toxic** to both humans and plants — even low concentrations cause irritation of the respiratory tract, throat and eyes, and can cause breathlessness.\n' +
        '- It damages plants by causing **chlorosis** (loss of chlorophyll) and stiffness/falling of leaves.\n' +
        '- In moist air it is oxidised to $\\ce{SO3}$ and dissolves to form **sulphuric acid**, a major component of **acid rain**:\n' +
        '$$\\ce{2SO2 + O2 -> 2SO3} \\qquad \\ce{SO3 + H2O -> H2SO4}$$\n' +
        'Acid rain corrodes buildings (especially marble — "stone leprosy"), damages metal structures and harms aquatic life.',
    },
  ],

  'group-17': [
    {
      kind: 'numerical',
      id: 'pb-ncert-7-23',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.23',
      prompt: 'Why are halogens strong oxidising agents?',
      solution:
        'Halogens have the valence configuration $ ns^2 np^5 $ — they need just **one electron** to complete the stable octet of the next noble gas. They have **high electronegativity, high electron gain enthalpy, small atomic size and low bond-dissociation enthalpy** (of the X–X bond), so they have a strong tendency to gain an electron and be reduced to $\\ce{X^-}$:\n\n' +
        '$$\\ce{X2 + 2e^- -> 2X^-}$$\n\n' +
        'By accepting electrons so readily, halogens oxidise other species — hence they are **strong oxidising agents**. The oxidising power **decreases** down the group ($\\ce{F2 > Cl2 > Br2 > I2}$); fluorine is the strongest oxidising agent of all elements.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-24',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.24',
      prompt: 'Explain why fluorine forms only one oxoacid, HOF.',
      solution:
        'Fluorine forms only **one oxoacid, hypofluorous acid $\\ce{HOF}$**, in which fluorine is in the $ +1 $ state.\n\n' +
        'This is because fluorine is the **most electronegative** element and a second-period atom with **no $ d $ orbitals**. It cannot expand its octet or show positive oxidation states higher than $ +1 $. The other halogens form several oxoacids ($\\ce{HXO, HXO2, HXO3, HXO4}$) using their available $ d $ orbitals to reach $ +1, +3, +5, +7 $ states — but fluorine, lacking $ d $ orbitals and being more electronegative than oxygen, is restricted to $\\ce{HOF}$ alone.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-25',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.25',
      prompt:
        'Explain why inspite of nearly the same electronegativity, oxygen forms hydrogen bonding while chlorine does not.',
      solution:
        'Although oxygen and chlorine have **nearly the same electronegativity** (~3.0–3.5), the strength of hydrogen bonding depends not only on electronegativity but also on the **size** of the atom carrying the lone pairs.\n\n' +
        'Oxygen is a **small** atom, so its negative charge (and lone pairs) is concentrated in a small region of high charge density — this allows strong **hydrogen bonding** ($\\ce{O-H\\bond{...}O}$).\n\n' +
        'Chlorine is a **much larger** atom; its charge is spread over a bigger, more diffuse volume, giving low charge density. The lone pairs are too diffuse to attract hydrogen strongly, so chlorine does **not** form hydrogen bonds effectively.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-26',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.26',
      prompt: 'Write two uses of $\\ce{ClO2}$.',
      solution:
        '$\\ce{ClO2}$ (chlorine dioxide) is used:\n\n' +
        '1. As a **bleaching agent** for paper pulp, textiles, flour and oils.\n' +
        '2. For the **purification/sterilisation of water** (as a disinfectant), since it kills bacteria and other micro-organisms.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-27',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.27',
      prompt: 'Why are halogens coloured?',
      solution:
        'Halogen molecules absorb radiation in the **visible region** of the spectrum. This energy **excites the outer (valence) electrons to higher energy levels**; the molecule absorbs certain wavelengths of visible light and transmits the rest, so it appears coloured (the colour seen is complementary to the absorbed light).\n\n' +
        'Down the group the energy gap for excitation **decreases** (electrons are more loosely held), so the absorbed light shifts to longer wavelengths and the colour deepens: $\\ce{F2}$ (pale yellow) $\\to \\ce{Cl2}$ (greenish-yellow) $\\to \\ce{Br2}$ (reddish-brown) $\\to \\ce{I2}$ (violet).',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-28',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.28',
      prompt: 'Write the reactions of $\\ce{F2}$ and $\\ce{Cl2}$ with water.',
      solution:
        '**Fluorine** is a very strong oxidising agent and **oxidises water** to oxygen (and some ozone); it does not simply dissolve:\n\n' +
        '$$\\ce{2F2 + 2H2O -> 4HF + O2}$$\n' +
        '$$\\ce{3F2 + 3H2O -> 6HF + O3}$$\n\n' +
        '**Chlorine** dissolves in water and **disproportionates**, forming hydrochloric and hypochlorous acids ("chlorine water"):\n\n' +
        '$$\\ce{Cl2 + H2O -> HCl + HOCl}$$\n\n' +
        'The hypochlorous acid ($\\ce{HOCl}$) slowly decomposes to release nascent oxygen, which is responsible for the bleaching and oxidising action of chlorine water.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-29',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.29',
      prompt:
        'How can you prepare $\\ce{Cl2}$ from HCl and HCl from $\\ce{Cl2}$? Write reactions only.',
      solution:
        '**$\\ce{Cl2}$ from $\\ce{HCl}$** — oxidise concentrated HCl with a strong oxidising agent such as $\\ce{MnO2}$ or $\\ce{KMnO4}$:\n\n' +
        '$$\\ce{MnO2 + 4HCl -> MnCl2 + Cl2 + 2H2O}$$\n' +
        '$$\\ce{2KMnO4 + 16HCl -> 2KCl + 2MnCl2 + 5Cl2 + 8H2O}$$\n\n' +
        '**$\\ce{HCl}$ from $\\ce{Cl2}$** — combine chlorine directly with hydrogen:\n\n' +
        '$$\\ce{H2 + Cl2 -> 2HCl}$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-32',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.32',
      prompt:
        'Write balanced equations for the following:\n\n(i) NaCl is heated with sulphuric acid in the presence of $\\ce{MnO2}$.\n\n(ii) Chlorine gas is passed into a solution of NaI in water.',
      solution:
        '**(i)** Heating NaCl with conc. $\\ce{H2SO4}$ in the presence of $\\ce{MnO2}$ liberates chlorine (the $\\ce{MnO2}$ oxidises the HCl formed in situ):\n\n' +
        '$$\\ce{4NaCl + 4H2SO4 + MnO2 -> 4NaHSO4 + MnCl2 + Cl2 + 2H2O}$$\n' +
        '(equivalently $\\ce{2NaCl + 2H2SO4 + MnO2 -> Na2SO4 + MnSO4 + Cl2 + 2H2O}$).\n\n' +
        '**(ii)** Chlorine is a stronger oxidising agent than iodine, so it **displaces iodine** from sodium iodide:\n\n' +
        '$$\\ce{Cl2 + 2NaI -> 2NaCl + I2}$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-36',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.36',
      prompt:
        'Arrange the following in the order of property indicated for each set:\n\n(i) $\\ce{F2, Cl2, Br2, I2}$ — increasing bond dissociation enthalpy.\n\n(ii) HF, HCl, HBr, HI — increasing acid strength.\n\n(iii) $\\ce{NH3, PH3, AsH3, SbH3, BiH3}$ — increasing base strength.',
      answer:
        '(i) $\\ce{I2 < F2 < Br2 < Cl2}$; (ii) $\\ce{HF < HCl < HBr < HI}$; (iii) $\\ce{BiH3 < SbH3 < AsH3 < PH3 < NH3}$.',
      solution:
        '**(i) Increasing bond dissociation enthalpy:** $\\ce{I2 < F2 < Br2 < Cl2}$.\n' +
        'Normally it should decrease down the group, but $\\ce{F2}$ is **anomalously low** because the small fluorine atoms force their lone pairs very close together, causing strong inter-electronic repulsion that weakens the F–F bond. Hence $\\ce{Cl2}$ has the highest value and $\\ce{F2}$ lies between $\\ce{Br2}$ and $\\ce{I2}$.\n\n' +
        '**(ii) Increasing acid strength:** $\\ce{HF < HCl < HBr < HI}$.\n' +
        'Acid strength of hydrogen halides increases down the group as the H–X bond becomes weaker (bond enthalpy decreases with increasing size), so the H is released more easily.\n\n' +
        '**(iii) Increasing base strength:** $\\ce{BiH3 < SbH3 < AsH3 < PH3 < NH3}$.\n' +
        'Down Group 15 the size of the central atom increases and the lone pair becomes more diffuse and less available for donation, so basic strength decreases down the group — $\\ce{NH3}$ is the strongest base and $\\ce{BiH3}$ the weakest.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-38',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.38',
      prompt:
        'Give the formula and describe the structure of a noble gas species which is isostructural with:\n\n(i) $\\ce{ICl4^-}$\n\n(ii) $\\ce{IBr2^-}$\n\n(iii) $\\ce{BrO3^-}$.',
      answer:
        '(i) $\\ce{XeF4}$ — square planar; (ii) $\\ce{XeF2}$ — linear; (iii) $\\ce{XeO3}$ — pyramidal.',
      solution:
        '**(i) Isostructural with $\\ce{ICl4^-}$ → $\\ce{XeF4}$.** Both have a central atom with **6 electron pairs (4 bond pairs + 2 lone pairs)**, i.e. $ sp^3 d^2 $ hybridisation. The two lone pairs occupy opposite axial positions, giving a **square planar** shape.\n\n' +
        '**(ii) Isostructural with $\\ce{IBr2^-}$ → $\\ce{XeF2}$.** Both have **5 electron pairs (2 bond pairs + 3 lone pairs)**, i.e. $ sp^3 d $ hybridisation. The three lone pairs occupy the equatorial positions, giving a **linear** shape.\n\n' +
        '**(iii) Isostructural with $\\ce{BrO3^-}$ → $\\ce{XeO3}$.** Both have **4 electron pairs (3 bond pairs + 1 lone pair)**, i.e. $ sp^3 $ hybridisation, giving a **pyramidal (trigonal pyramidal)** shape.',
    },
  ],

  'group-18': [
    {
      kind: 'numerical',
      id: 'pb-ncert-7-30',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.30',
      prompt:
        'What inspired N. Bartlett for carrying out reaction between Xe and $\\ce{PtF6}$?',
      solution:
        'Neil Bartlett had earlier prepared the compound **$\\ce{O2^+[PtF6]^-}$** (dioxygenyl hexafluoroplatinate) by reacting molecular oxygen with $\\ce{PtF6}$ — showing that $\\ce{PtF6}$ is a powerful enough oxidant to remove an electron from $\\ce{O2}$.\n\n' +
        'He then noticed that the **first ionisation enthalpy of xenon ($ 1170\\ \\text{kJ mol}^{-1} $) is very close to that of molecular oxygen ($ 1175\\ \\text{kJ mol}^{-1} $)**. Reasoning that if $\\ce{PtF6}$ could oxidise $\\ce{O2}$ it should likewise oxidise Xe, he reacted xenon with $\\ce{PtF6}$ and obtained the first noble-gas compound, originally formulated as $\\ce{Xe^+[PtF6]^-}$:\n\n' +
        '$$\\ce{Xe + PtF6 -> Xe^+[PtF6]^-}$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-33',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.33',
      prompt: 'How are xenon fluorides $\\ce{XeF2}$, $\\ce{XeF4}$ and $\\ce{XeF6}$ obtained?',
      solution:
        'The three xenon fluorides are obtained by the **direct combination of xenon with fluorine** under different conditions of temperature, pressure and Xe:F₂ ratio (heated in a sealed nickel vessel at about $ 673\\ \\text{K} $, $ 1\\ \\text{bar} $):\n\n' +
        '$$\\ce{Xe + F2 ->[673\\ K,\\ 1\\ bar][Xe:F2\\ =\\ 1:5] XeF2}$$\n' +
        '$$\\ce{Xe + 2F2 ->[873\\ K,\\ 7\\ bar][Xe:F2\\ =\\ 1:5] XeF4}$$\n' +
        '$$\\ce{Xe + 3F2 ->[573\\ K,\\ 60\\text{-}70\\ bar][Xe:F2\\ =\\ 1:20] XeF6}$$\n\n' +
        'In short: a **low** proportion of fluorine (and moderate conditions) gives $\\ce{XeF2}$; a **higher** proportion gives $\\ce{XeF4}$; and a **large excess** of fluorine at high pressure gives $\\ce{XeF6}$.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-34',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.34',
      prompt:
        'With what neutral molecule is $\\ce{ClO^-}$ isoelectronic? Is that molecule a Lewis base?',
      solution:
        '$\\ce{ClO^-}$ has $ 17 + 8 + 1 = 26 $ electrons. The neutral molecule with 26 electrons and the same number of atoms is **$\\ce{ClF}$** ($ 17 + 9 = 26 $ electrons). So $\\ce{ClO^-}$ is **isoelectronic with $\\ce{ClF}$**.\n\n' +
        '**Yes, $\\ce{ClF}$ can act as a Lewis base** — it possesses lone pairs of electrons on the chlorine (and fluorine) atom that can be donated to a suitable electron-pair acceptor.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-35',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.35',
      prompt: 'How are $\\ce{XeO3}$ and $\\ce{XeOF4}$ prepared?',
      solution:
        '**$\\ce{XeO3}$** is prepared by the **hydrolysis** of $\\ce{XeF4}$ or $\\ce{XeF6}$:\n\n' +
        '$$\\ce{6XeF4 + 12H2O -> 4Xe + 2XeO3 + 24HF + 3O2}$$\n' +
        '$$\\ce{XeF6 + 3H2O -> XeO3 + 6HF}$$\n\n' +
        '**$\\ce{XeOF4}$** is prepared by the **partial (controlled) hydrolysis** of $\\ce{XeF6}$:\n\n' +
        '$$\\ce{XeF6 + H2O -> XeOF4 + 2HF}$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-37',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.37',
      prompt:
        'Which one of the following does not exist?\n\n(i) $\\ce{XeOF4}$\n\n(ii) $\\ce{NeF2}$\n\n(iii) $\\ce{XeF2}$\n\n(iv) $\\ce{XeF6}$',
      answer: '(ii) $\\ce{NeF2}$ does not exist.',
      solution:
        '**$\\ce{NeF2}$ does not exist.**\n\n' +
        'Neon is the smallest noble gas (after He) with a very **high ionisation enthalpy** and **no available $ d $ orbitals** in its valence shell, so it cannot be oxidised or expand its octet to form bonds with fluorine. Hence neon forms no fluoride.\n\n' +
        'Xenon, being larger with a much lower ionisation enthalpy and accessible $ d $ orbitals, readily forms $\\ce{XeF2}$, $\\ce{XeF6}$ and $\\ce{XeOF4}$ — these all exist.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-39',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.39',
      prompt: 'Why do noble gases have comparatively large atomic sizes?',
      solution:
        'Noble gases are **monatomic** and have **completely filled valence shells** ($ ns^2 np^6 $), so unlike other elements there is no chemical bonding between their atoms. Therefore the atomic radius of a noble gas is measured as its **van der Waals radius** (half the distance between the nuclei of two non-bonded, just-touching atoms).\n\n' +
        'For other elements, the atomic radius is usually the **covalent radius** (half the distance between two *bonded* atoms), which is inherently smaller because bonding pulls the atoms closer. Since a van der Waals radius is always larger than a covalent radius, noble gases appear to have **comparatively large atomic sizes**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ncert-7-40',
      source: 'ncert_exercise',
      source_label: 'NCERT 7.40',
      prompt: 'List the uses of neon and argon gases.',
      solution:
        '**Uses of neon:**\n' +
        '- In **discharge tubes and fluorescent bulbs** for advertisement signs (glowing neon signs).\n' +
        '- In **safety devices** for protecting electrical instruments such as voltage stabilisers and metre testers from high voltages.\n' +
        '- In **beacon lights** for safety of air navigation (its glow penetrates fog).\n\n' +
        '**Uses of argon:**\n' +
        '- To provide an **inert atmosphere** in high-temperature metallurgical processes (arc welding of metals/alloys) and for filling electric (incandescent) bulbs, where it prevents oxidation of the filament.\n' +
        '- In **laboratories** for handling air-sensitive substances under an inert atmosphere.',
    },
  ],
};
