// NCERT Exemplar — Class 12 Chemistry, Unit 7 (The p-Block Elements), Q1–Q72.
// Question stems + options transcribed from 12-Chemistry-Exemplar-Chapter-7.pdf.
// Worked answers/solutions from 12-Chemistry-Exemplar-Chapter-7-answer.pdf, verified
// independently. Item shape mirrors the Solutions sibling scripts/practice-sol/exemplar_sol.js.
//
// Sections are by group within the p-block (the chapter is organised group-by-group):
//   group-15 = N / P family,  group-16 = O / S family,
//   group-17 = halogens,      group-18 = noble gases.
// Items are ordered by question number within each section.
//
// CORRECTIONS to the official answer key (used corrected answer, flagged in explanation):
//   - Q36 (Type-II, multi-correct): key prints only (ii). Reaction (iii)
//     Cu + 2H2SO4 -> CuSO4 + SO2 + 2H2O ALSO uses conc. H2SO4 as an OXIDISING agent
//     (Cu: 0 -> +2, S: +6 -> +4). So the correct answer is (ii) AND (iii). CORRECTED.
//
// Notes on two debatable multi-correct items (kept the published key, flagged in solution):
//   - Q31: key gives (i),(iii),(iv). Statement (ii) ("leaving F-F, all halogens have
//     weaker X-X than X-X' in interhalogens") is also defensible; key excludes it.
//   - Q35: key gives (i),(ii). Statement (iii) (Fe + Al2O3 + K2O catalyst in Haber's
//     process) is chemically correct; key excludes it as out-of-scope detail.
//
// Multi-correct Type-II questions (Q28–Q37) are encoded as kind:'numerical' because the
// MCQ renderer is single-correct only.

const ASSERTION_REASON_OPTIONS = [
  'Assertion and reason both are correct statements, and reason is the correct explanation of the assertion.',
  'Assertion and reason both are correct statements, but reason is not the correct explanation of the assertion.',
  'Assertion is correct, but reason is wrong statement.',
  'Assertion is wrong but reason is correct statement.',
  'Both assertion and reason are wrong statements.',
];

module.exports = {
  'group-15': [
    {
      kind: 'mcq',
      id: 'pb-ex-q3',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q3',
      prompt: 'In a cyclotrimetaphosphoric acid molecule, how many single and double bonds are present?',
      options: [
        '3 double bonds; 9 single bonds',
        '6 double bonds; 6 single bonds',
        '3 double bonds; 12 single bonds',
        'Zero double bonds; 12 single bonds',
      ],
      correct_index: 0,
      explanation: 'Cyclotrimetaphosphoric acid $\\ce{(HPO3)3}$ is a six-membered ring of three $\\ce{P}$ and three bridging $\\ce{O}$ atoms. Each $\\ce{P}$ carries **one terminal $\\ce{P=O}$ double bond** (3 doubles in all) and **one $\\ce{P-OH}$** group. The single bonds: 6 ring $\\ce{P-O}$ single bonds (three bridging $\\ce{O}$, each making two $\\ce{P-O}$ bonds) $+$ 3 $\\ce{P-OH}$ single bonds $= 9$ single bonds. So **3 double, 9 single** → option (i).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q4',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q4',
      prompt: 'Which of the following elements can be involved in $p\\pi$–$d\\pi$ bonding?',
      options: [
        'Carbon',
        'Nitrogen',
        'Phosphorus',
        'Boron',
      ],
      correct_index: 2,
      explanation: '$p\\pi$–$d\\pi$ bonding needs **vacant $d$-orbitals** on one of the atoms. Carbon, nitrogen and boron are second-period elements with **no $d$-orbitals**. **Phosphorus** (third period) has accessible $3d$ orbitals, so it can form $p\\pi$–$d\\pi$ bonds → option (iii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q7',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q7',
      prompt: 'Bond dissociation enthalpy of E—H (E = element) bonds is given below. Which of the compounds will act as strongest reducing agent?\n\n| Compound | $\\ce{NH3}$ | $\\ce{PH3}$ | $\\ce{AsH3}$ | $\\ce{SbH3}$ |\n|---|---|---|---|---|\n| $\\Delta_{diss}$ (E—H) / kJ mol$^{-1}$ | 389 | 322 | 297 | 255 |',
      options: [
        '$\\ce{NH3}$',
        '$\\ce{PH3}$',
        '$\\ce{AsH3}$',
        '$\\ce{SbH3}$',
      ],
      correct_index: 3,
      explanation: 'A hydride is a better reducing agent when its **E—H bond is easier to break** (it gives up hydrogen more readily). The **lowest** bond dissociation enthalpy is for $\\ce{SbH3}$ (255 kJ mol$^{-1}$), so $\\ce{SbH3}$ is the **strongest reducing agent** → option (iv).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q8',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q8',
      prompt: 'On heating with concentrated $\\ce{NaOH}$ solution in an inert atmosphere of $\\ce{CO2}$, white phosphorus gives a gas. Which of the following statements is $incorrect$ about the gas?',
      options: [
        'It is highly poisonous and has smell like rotten fish.',
        'Its solution in water decomposes in the presence of light.',
        'It is more basic than $\\ce{NH3}$.',
        'It is less basic than $\\ce{NH3}$.',
      ],
      correct_index: 2,
      explanation: 'The gas is **phosphine $\\ce{PH3}$**. Statements (i), (ii) and (iv) are all true of $\\ce{PH3}$. Statement (iii) is **incorrect**: $\\ce{PH3}$ is **less basic** than $\\ce{NH3}$ (the lone pair on the larger $\\ce{P}$ atom is less available for donation), not more basic → option (iii) is the incorrect statement.',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q9',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q9',
      prompt: 'Which of the following acids forms three series of salts?',
      options: [
        '$\\ce{H3PO2}$',
        '$\\ce{H3BO3}$',
        '$\\ce{H3PO4}$',
        '$\\ce{H3PO3}$',
      ],
      correct_index: 2,
      explanation: 'The number of salt series equals the number of **ionisable (replaceable) $\\ce{O-H}$ hydrogens**. $\\ce{H3PO4}$ is **tribasic** (three $\\ce{P-OH}$ groups), so it forms **three** series of salts (e.g. $\\ce{NaH2PO4}$, $\\ce{Na2HPO4}$, $\\ce{Na3PO4}$) → option (iii). ($\\ce{H3PO2}$ is monobasic, $\\ce{H3PO3}$ dibasic, $\\ce{H3BO3}$ effectively monobasic.)',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q10',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q10',
      prompt: 'Strong reducing behaviour of $\\ce{H3PO2}$ is due to ________.',
      options: [
        'Low oxidation state of phosphorus',
        'Presence of two —OH groups and one P—H bond',
        'Presence of one —OH group and two P—H bonds',
        'High electron gain enthalpy of phosphorus',
      ],
      correct_index: 2,
      explanation: 'In hypophosphorous acid $\\ce{H3PO2}$, phosphorus is bonded to **one $\\ce{O-H}$ group and two $\\ce{P-H}$ bonds**. The **$\\ce{P-H}$ bonds** are responsible for its strong reducing power (they supply hydrogen for reduction) → option (iii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q11',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q11',
      prompt: 'On heating lead nitrate forms oxides of nitrogen and lead. The oxides formed are ________.',
      options: [
        '$\\ce{N2O}$, $\\ce{PbO}$',
        '$\\ce{NO2}$, $\\ce{PbO}$',
        '$\\ce{NO}$, $\\ce{PbO}$',
        '$\\ce{NO}$, $\\ce{PbO2}$',
      ],
      correct_index: 1,
      explanation: 'Heating lead nitrate decomposes it: $2\\ce{Pb(NO3)2} \\rightarrow 2\\ce{PbO} + 4\\ce{NO2} + \\ce{O2}$. The oxides formed are **$\\ce{NO2}$ (brown gas) and $\\ce{PbO}$** → option (ii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q12',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q12',
      prompt: 'Which of the following elements does not show allotropy?',
      options: [
        'Nitrogen',
        'Bismuth',
        'Antimony',
        'Arsenic',
      ],
      correct_index: 0,
      explanation: '$\\ce{P}$, $\\ce{As}$, $\\ce{Sb}$ and $\\ce{Bi}$ all show allotropy (different solid forms). **Nitrogen** is a diatomic gas $\\ce{N2}$ and does **not** show allotropy → option (i).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q13',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q13',
      prompt: 'Maximum covalency of nitrogen is ________.',
      options: [
        '3',
        '5',
        '4',
        '6',
      ],
      correct_index: 2,
      explanation: 'Nitrogen is a second-period element with only **four** orbitals in its valence shell ($2s$ and three $2p$) and **no $d$-orbitals**. So it can form at most **four** bonds (e.g. $\\ce{NH4+}$) — maximum covalency $= 4$ → option (iii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q14',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q14',
      prompt: 'Which of the following statements is wrong?',
      options: [
        'Single N–N bond is stronger than the single P–P bond.',
        '$\\ce{PH3}$ can act as a ligand in the formation of coordination compound with transition elements.',
        '$\\ce{NO2}$ is paramagnetic in nature.',
        'Covalency of nitrogen in $\\ce{N2O5}$ is four.',
      ],
      correct_index: 0,
      explanation: 'Statement (i) is **wrong**. The single **N–N bond is weaker** than the single P–P bond, because the small, close $\\ce{N}$ atoms have strong **lone-pair–lone-pair repulsion** that destabilises the N–N single bond. So the order is reversed → option (i) is the wrong statement. ((ii), (iii), (iv) are all correct.)',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q15',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q15',
      prompt: 'A brown ring is formed in the ring test for $\\ce{NO3^-}$ ion. It is due to the formation of ________.',
      options: [
        '$[\\ce{Fe(H2O)5(NO)}]^{2+}$',
        '$\\ce{FeSO4.NO2}$',
        '$[\\ce{Fe(H2O)4(NO)2}]^{2+}$',
        '$\\ce{FeSO4.HNO3}$',
      ],
      correct_index: 0,
      explanation: 'In the brown-ring test, nitrate is reduced to $\\ce{NO}$, which coordinates to $\\ce{Fe^{2+}}$ to give the brown complex **$[\\ce{Fe(H2O)5(NO)}]^{2+}$** → option (i).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q16',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q16',
      prompt: 'Elements of group-15 form compounds in $+5$ oxidation state. However, bismuth forms only one well characterised compound in $+5$ oxidation state. The compound is ________.',
      options: [
        '$\\ce{Bi2O5}$',
        '$\\ce{BiF5}$',
        '$\\ce{BiCl5}$',
        '$\\ce{Bi2S5}$',
      ],
      correct_index: 1,
      explanation: 'Because of the **inert pair effect**, $\\ce{Bi}$ strongly prefers the $+3$ state and the $+5$ state is highly oxidising. Only the most electronegative ligand, **fluorine**, can stabilise $\\ce{Bi}$ in $+5$, giving **$\\ce{BiF5}$** → option (ii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q17',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q17',
      prompt: 'On heating ammonium dichromate and barium azide separately we get ________.',
      options: [
        '$\\ce{N2}$ in both cases',
        '$\\ce{N2}$ with ammonium dichromate and $\\ce{NO}$ with barium azide',
        '$\\ce{N2O}$ with ammonium dichromate and $\\ce{N2}$ with barium azide',
        '$\\ce{N2O}$ with ammonium dichromate and $\\ce{NO2}$ with barium azide',
      ],
      correct_index: 0,
      explanation: 'Both decompositions give **dinitrogen $\\ce{N2}$**: $\\ce{(NH4)2Cr2O7 -> N2 + Cr2O3 + 4H2O}$ and $\\ce{Ba(N3)2 -> Ba + 3N2}$. So $\\ce{N2}$ in both cases → option (i).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q18',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q18',
      prompt: 'In the preparation of $\\ce{HNO3}$, we get $\\ce{NO}$ gas by catalytic oxidation of ammonia. The moles of $\\ce{NO}$ produced by the oxidation of two moles of $\\ce{NH3}$ will be ________.',
      options: [
        '2',
        '3',
        '4',
        '6',
      ],
      correct_index: 0,
      explanation: 'The catalytic oxidation is $4\\ce{NH3} + 5\\ce{O2} \\rightarrow 4\\ce{NO} + 6\\ce{H2O}$ — a 1:1 ratio of $\\ce{NH3}$ to $\\ce{NO}$. So **2 mol $\\ce{NH3}$ give 2 mol $\\ce{NO}$** → option (i).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q19',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q19',
      prompt: 'The oxidation state of central atom in the anion of compound $\\ce{NaH2PO2}$ will be ________.',
      options: [
        '$+3$',
        '$+5$',
        '$+1$',
        '$-3$',
      ],
      correct_index: 2,
      explanation: 'The anion is $\\ce{H2PO2^-}$. Taking $\\ce{H} = +1$ and $\\ce{O} = -2$: $x + 2(+1) + 2(-2) = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = +1$. So phosphorus is in the **$+1$** state → option (iii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q23',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q23',
      prompt: 'A black compound of manganese reacts with a halogen acid to give greenish yellow gas. When excess of this gas reacts with $\\ce{NH3}$ an unstable trihalide is formed. In this process the oxidation state of nitrogen changes from ________.',
      options: [
        '$-3$ to $+3$',
        '$-3$ to $0$',
        '$-3$ to $+5$',
        '$0$ to $-3$',
      ],
      correct_index: 0,
      explanation: 'The black compound $\\ce{MnO2}$ + $\\ce{HCl}$ gives **$\\ce{Cl2}$** (greenish yellow). Excess $\\ce{Cl2}$ with $\\ce{NH3}$ gives the unstable trihalide **$\\ce{NCl3}$**. Nitrogen goes from $-3$ (in $\\ce{NH3}$) to $+3$ (in $\\ce{NCl3}$, where $\\ce{Cl}$ is more electronegative) → **$-3$ to $+3$** → option (i).',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q30',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q30',
      prompt: 'Which of the following is correct for $\\ce{P4}$ molecule of white phosphorus?\n\n(i) It has 6 lone pairs of electrons.\n\n(ii) It has six P–P single bonds.\n\n(iii) It has three P–P single bonds.\n\n(iv) It has four lone pairs of electrons.\n\n(Note: two or more options may be correct.)',
      answer: '(ii) and (iv)',
      solution: 'White phosphorus is a **tetrahedral $\\ce{P4}$** molecule. Each of the four $\\ce{P}$ atoms sits at a corner and is bonded to the other three.\n\n' +
        '- **Number of P–P bonds:** each edge of the tetrahedron is one bond; a tetrahedron has **6 edges** → **six P–P single bonds** → (ii) correct, (iii) wrong.\n' +
        '- **Lone pairs:** each $\\ce{P}$ uses three of its valence electrons for bonds and keeps **one lone pair**; with four $\\ce{P}$ atoms that is **four lone pairs** → (iv) correct, (i) wrong.\n\n' +
        'So the correct statements are **(ii) and (iv)**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q33',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q33',
      prompt: 'Which of the following statements are correct?\n\n(i) All the three N—O bond lengths in $\\ce{HNO3}$ are equal.\n\n(ii) All P—Cl bond lengths in $\\ce{PCl5}$ molecule in gaseous state are equal.\n\n(iii) $\\ce{P4}$ molecule in white phosphorus have angular strain therefore white phosphorus is very reactive.\n\n(iv) $\\ce{PCl5}$ is ionic in solid state in which cation is tetrahedral and anion is octahedral.\n\n(Note: two or more options may be correct.)',
      answer: '(iii) and (iv)',
      solution: 'Check each statement:\n\n' +
        '- **(i) WRONG:** in $\\ce{HNO3}$ the $\\ce{N-OH}$ bond is a normal single bond and is **longer** than the two equivalent $\\ce{N-O}$ bonds — so the three $\\ce{N-O}$ lengths are **not** all equal.\n' +
        '- **(ii) WRONG:** gaseous $\\ce{PCl5}$ is trigonal bipyramidal, where the **axial** $\\ce{P-Cl}$ bonds are **longer** than the equatorial ones — so they are not all equal.\n' +
        '- **(iii) correct:** $\\ce{P4}$ has $60^{\\circ}$ bond angles, giving **angular (ring) strain**, which makes white phosphorus very reactive.\n' +
        '- **(iv) correct:** solid $\\ce{PCl5}$ is ionic, $[\\ce{PCl4}]^+[\\ce{PCl6}]^-$, with a **tetrahedral** cation and an **octahedral** anion.\n\n' +
        'So the correct statements are **(iii) and (iv)**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q39',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q39',
      prompt: 'Write a balanced chemical equation for the reaction showing catalytic oxidation of $\\ce{NH3}$ by atmospheric oxygen.',
      answer: '4NH3 + 5O2 --(Pt/Rh, 500 K, 9 bar)--> 4NO + 6H2O.',
      solution: 'In the **Ostwald process**, ammonia is oxidised over a **platinum–rhodium gauze catalyst** at about $500\\ \\text{K}$ and $9\\ \\text{bar}$:\n\n' +
        '$$4\\ce{NH3} + 5\\ce{O2} \\xrightarrow[\\text{500 K, 9 bar}]{\\text{Pt/Rh gauze}} 4\\ce{NO} + 6\\ce{H2O}$$\n\n' +
        'The $\\ce{NO}$ formed is further oxidised and absorbed in water to make nitric acid.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q60',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q60',
      prompt: 'Match the formulas of oxides given in Column I with the type of oxide given in Column II and mark the correct option.\n\n' +
        '| Column I (oxide) | Column II (type) |\n' +
        '|---|---|\n' +
        '| (A) $\\ce{Pb3O4}$ | (1) Neutral oxide |\n' +
        '| (B) $\\ce{N2O}$ | (2) Acidic oxide |\n' +
        '| (C) $\\ce{Mn2O7}$ | (3) Basic oxide |\n' +
        '| (D) $\\ce{Bi2O3}$ | (4) Mixed oxide |',
      answer: '(A)-(4), (B)-(1), (C)-(2), (D)-(3)',
      solution: 'Classify each oxide:\n\n' +
        '- **(A) $\\ce{Pb3O4}$ → (4) mixed oxide:** it behaves as $2\\ce{PbO}\\cdot\\ce{PbO2}$ (red lead).\n' +
        '- **(B) $\\ce{N2O}$ → (1) neutral oxide:** nitrous oxide is neither acidic nor basic.\n' +
        '- **(C) $\\ce{Mn2O7}$ → (2) acidic oxide:** the highest oxide of manganese is acidic.\n' +
        '- **(D) $\\ce{Bi2O3}$ → (3) basic oxide:** the heaviest group-15 oxide is basic.\n\n' +
        'This is code (ii) in the exemplar.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q40',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q40',
      prompt: 'Write the structure of pyrophosphoric acid.',
      answer: 'Pyrophosphoric acid is H4P2O7: two PO4 tetrahedra sharing one bridging oxygen, i.e. (HO)2(O=)P—O—P(=O)(OH)2.',
      solution: '**Pyrophosphoric acid $\\ce{H4P2O7}$** is formed by joining two phosphoric-acid units through a bridging oxygen:\n\n' +
        '$$(\\text{HO})_2\\overset{\\displaystyle \\text{O}}{\\underset{\\,}{\\ce{P}}}\\!-\\!\\ce{O}\\!-\\!\\overset{\\displaystyle \\text{O}}{\\underset{\\,}{\\ce{P}}}(\\text{OH})_2$$\n\n' +
        'Each phosphorus is at the centre of a tetrahedron with **one terminal $\\ce{P=O}$**, **two $\\ce{P-OH}$** groups, and shares **one bridging $\\ce{P-O-P}$** oxygen. Total: 4 replaceable $\\ce{O-H}$ hydrogens (tetrabasic acid).',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q41',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q41',
      prompt: '$\\ce{PH3}$ forms bubbles when passed slowly in water but $\\ce{NH3}$ dissolves. Explain why?',
      answer: 'NH3 forms hydrogen bonds with water and so dissolves; PH3 cannot form hydrogen bonds with water, so it does not dissolve and escapes as bubbles.',
      solution: '**$\\ce{NH3}$** has a small, highly electronegative $\\ce{N}$ atom, so it forms strong **hydrogen bonds with water** and **dissolves** readily.\n\n' +
        '**$\\ce{PH3}$** has a larger, much less electronegative $\\ce{P}$ atom, so it **cannot form hydrogen bonds** with water. Being essentially insoluble, it passes through as **bubbles** rather than dissolving.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q42',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q42',
      prompt: 'In $\\ce{PCl5}$, phosphorus is in $sp^3d$ hybridised state but all its five bonds are not equivalent. Justify your answer with reason.',
      answer: 'PCl5 has trigonal bipyramidal geometry: three equatorial bonds (120°) and two axial bonds (90°/180°). The axial bonds are longer and weaker than the equatorial bonds, so the five P–Cl bonds are not equivalent.',
      solution: '$sp^3d$ hybridisation gives $\\ce{PCl5}$ a **trigonal bipyramidal** shape, which has **two kinds of positions**:\n\n' +
        '- **Three equatorial bonds** in a plane at $120^{\\circ}$ to each other.\n' +
        '- **Two axial bonds** perpendicular to that plane (at $90^{\\circ}$ to the equatorial bonds).\n\n' +
        'The **axial bonds experience more repulsion** (each faces three equatorial bonds at $90^{\\circ}$), so they are **longer and weaker** than the equatorial bonds. Because the two sets differ in length and strength, the five $\\ce{P-Cl}$ bonds are **not equivalent**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q43',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q43',
      prompt: 'Why is nitric oxide paramagnetic in gaseous state but the solid obtained on cooling it is diamagnetic?',
      answer: 'Gaseous NO has an odd (unpaired) electron, so it is paramagnetic. On cooling, NO molecules dimerise to N2O4 (pairing the odd electrons), so the solid has no unpaired electrons and is diamagnetic.',
      solution: 'In the **gaseous state**, $\\ce{NO}$ has an **odd number of electrons** — one unpaired electron — so it is **paramagnetic**.\n\n' +
        'On **cooling to the solid**, $\\ce{NO}$ molecules **dimerise** (the two odd electrons pair up to form an $\\ce{N-N}$ bond, giving $\\ce{N2O4}$). With **no unpaired electrons** left, the solid is **diamagnetic**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q48',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q48',
      prompt: 'In the ring test of $\\ce{NO3^-}$ ion, $\\ce{Fe^{2+}}$ ion reduces nitrate ion to nitric oxide, which combines with $\\ce{Fe^{2+}}$(aq) ion to form brown complex. Write the reactions involved in the formation of brown ring.',
      answer: 'NO3^- + 3Fe^2+ + 4H^+ -> NO + 3Fe^3+ + 2H2O; then [Fe(H2O)6]^2+ + NO -> [Fe(H2O)5(NO)]^2+ + H2O (brown complex).',
      solution: 'Two steps form the brown ring:\n\n' +
        '**1. Reduction of nitrate to nitric oxide** by $\\ce{Fe^{2+}}$ in acid:\n' +
        '$$\\ce{NO3^- + 3Fe^{2+} + 4H^+ -> NO + 3Fe^{3+} + 2H2O}$$\n\n' +
        '**2. The $\\ce{NO}$ then coordinates to an aqua-iron(II) ion** to give the brown complex:\n' +
        '$$\\ce{[Fe(H2O)6]^{2+} + NO -> [Fe(H2O)5(NO)]^{2+} + H2O}$$\n\n' +
        'The brown $[\\ce{Fe(H2O)5(NO)}]^{2+}$ appears as a ring at the junction of the two liquid layers.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q51',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q51',
      prompt: '$\\ce{P4O6}$ reacts with water according to equation $\\ce{P4O6 + 6H2O -> 4H3PO3}$. Calculate the volume of $0.1\\ \\text{M}$ $\\ce{NaOH}$ solution required to neutralise the acid formed by dissolving $1.1\\ \\text{g}$ of $\\ce{P4O6}$ in $\\ce{H2O}$.',
      answer: '400 mL of 0.1 M NaOH.',
      solution: '$\\ce{H3PO3}$ is **dibasic**, so $\\ce{H3PO3 + 2NaOH -> Na2HPO3 + 2H2O}$. Combining with the hydrolysis:\n\n' +
        '$$\\ce{P4O6 + 8NaOH -> 4Na2HPO3 + 2H2O}$$\n\n' +
        'So **1 mol $\\ce{P4O6}$ needs 8 mol $\\ce{NaOH}$**.\n\n' +
        'Molar mass of $\\ce{P4O6} = 4(31) + 6(16) = 220\\ \\text{g mol}^{-1}$, so moles $= \\frac{1.1}{220}$.\n\n' +
        'Moles of $\\ce{NaOH}$ needed $= \\frac{1.1}{220} \\times 8$.\n\n' +
        'Volume $= \\frac{\\text{moles}}{\\text{molarity}} = \\frac{(1.1/220)\\times 8}{0.1} = \\frac{1.1 \\times 8}{220 \\times 0.1}\\ \\text{L} = \\frac{88}{220}\\ \\text{L} = 0.4\\ \\text{L} = \\mathbf{400\\ mL}$.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q52',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q52',
      prompt: 'White phosphorus reacts with chlorine and the product hydrolyses in the presence of water. Calculate the mass of $\\ce{HCl}$ obtained by the hydrolysis of the product formed by the reaction of $62\\ \\text{g}$ of white phosphorus with chlorine in the presence of water.',
      answer: '219.0 g of HCl.',
      solution: 'With limited chlorine, white phosphorus gives $\\ce{PCl3}$, which hydrolyses to $\\ce{HCl}$:\n\n' +
        '$$\\ce{P4 + 6Cl2 -> 4PCl3}, \\quad \\ce{PCl3 + 3H2O -> H3PO3 + 3HCl}$$\n\n' +
        'Combining: $\\ce{P4 + 6Cl2 + 12H2O -> 4H3PO3 + 12HCl}$ — so **1 mol $\\ce{P4}$ gives 12 mol $\\ce{HCl}$**.\n\n' +
        'Molar mass of $\\ce{P4} = 124\\ \\text{g mol}^{-1}$, so $62\\ \\text{g} = \\frac{62}{124} = \\frac{1}{2}\\ \\text{mol}$ $\\ce{P4}$.\n\n' +
        'Moles of $\\ce{HCl} = \\frac{1}{2} \\times 12 = 6\\ \\text{mol}$.\n\n' +
        'Mass of $\\ce{HCl} = 6 \\times 36.5 = \\mathbf{219.0\\ g}$.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q53',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q53',
      prompt: 'Name three oxoacids of nitrogen. Write the disproportionation reaction of that oxoacid of nitrogen in which nitrogen is in $+3$ oxidation state.',
      answer: 'Three oxoacids: HNO2 (nitrous acid), HNO3 (nitric acid), H2N2O2 (hyponitrous acid). The +3 acid is HNO2; it disproportionates: 3HNO2 -> HNO3 + H2O + 2NO.',
      solution: '**Three oxoacids of nitrogen:**\n' +
        '- $\\ce{HNO2}$ — nitrous acid (N in $+3$),\n' +
        '- $\\ce{HNO3}$ — nitric acid (N in $+5$),\n' +
        '- $\\ce{H2N2O2}$ — hyponitrous acid (N in $+1$).\n\n' +
        'In **nitrous acid $\\ce{HNO2}$** nitrogen is in $+3$. It **disproportionates** (some N goes up to $+5$, some down to $+2$):\n\n' +
        '$$3\\ce{HNO2} -> \\ce{HNO3} + \\ce{H2O} + 2\\ce{NO}$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q54',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q54',
      prompt: 'Nitric acid forms an oxide of nitrogen on reaction with $\\ce{P4O10}$. Write the reaction involved. Also write the resonating structures of the oxide of nitrogen formed.',
      answer: '4HNO3 + P4O10 -> 4HPO3 + 2N2O5. The oxide is N2O5, which has resonance structures with the negative/positive charges delocalised over the terminal oxygens (O=N–O–N=O framework).',
      solution: '$\\ce{P4O10}$ is a powerful **dehydrating agent**; it removes water from nitric acid to give **dinitrogen pentoxide $\\ce{N2O5}$**:\n\n' +
        '$$4\\ce{HNO3} + \\ce{P4O10} -> 4\\ce{HPO3} + 2\\ce{N2O5}$$\n\n' +
        '**Resonance in $\\ce{N2O5}$:** the structure is $\\ce{O2N-O-NO2}$ (two $\\ce{NO2}$ units joined by a bridging oxygen). Within each $\\ce{NO2}$ unit the $\\ce{N=O}$ double bond is **delocalised** over the two terminal oxygens, giving equivalent resonance forms:\n\n' +
        '$$\\ce{O=N(-O^-)-O-N(=O)O^-} \\leftrightarrow \\ce{^-O-N(=O)-O-N(=O)O^-} \\;(\\text{and symmetry-related forms})$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q55',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q55',
      prompt: 'Phosphorus has three allotropic forms — (i) white phosphorus (ii) red phosphorus and (iii) black phosphorus. Write the difference between white and red phosphorus on the basis of their structure and reactivity.',
      answer: 'White phosphorus is discrete tetrahedral P4 molecules with strained 60° angles, so it is very reactive (and stored under water). Red phosphorus is a polymeric chain of P4 units linked through P–P bonds, has no angular strain, and is much less reactive.',
      solution: '**Structure.**\n' +
        '- **White phosphorus** consists of **discrete $\\ce{P4}$ tetrahedral molecules**; the bond angles are only $60^{\\circ}$, so the molecule is **strained**.\n' +
        '- **Red phosphorus** has a **polymeric chain structure** in which $\\ce{P4}$ tetrahedra are **linked together through $\\ce{P-P}$ bonds** to form long chains.\n\n' +
        '**Reactivity.**\n' +
        '- **White phosphorus is much more reactive** (it even glows and catches fire in air, so it is stored under water) — because of the **angular strain** in the $\\ce{P4}$ molecule.\n' +
        '- **Red phosphorus is far less reactive** and stable in air, as its polymeric structure has **no such strain**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q56',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q56',
      prompt: 'Give an example to show the effect of concentration of nitric acid on the formation of oxidation product.',
      answer: 'With copper: dilute HNO3 gives NO, concentrated HNO3 gives NO2. 3Cu + 8HNO3(dil) -> 3Cu(NO3)2 + 2NO + 4H2O; Cu + 4HNO3(conc) -> Cu(NO3)2 + 2NO2 + 2H2O.',
      solution: 'The **concentration of nitric acid** decides which nitrogen oxide is produced, because the more concentrated acid is the stronger oxidiser. With **copper**:\n\n' +
        '**Dilute $\\ce{HNO3}$** → $\\ce{NO}$:\n' +
        '$$3\\ce{Cu} + 8\\ce{HNO3}(\\text{dil}) -> 3\\ce{Cu(NO3)2} + 2\\ce{NO} + 4\\ce{H2O}$$\n\n' +
        '**Concentrated $\\ce{HNO3}$** → $\\ce{NO2}$:\n' +
        '$$\\ce{Cu} + 4\\ce{HNO3}(\\text{conc}) -> \\ce{Cu(NO3)2} + 2\\ce{NO2} + 2\\ce{H2O}$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q57',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q57',
      prompt: '$\\ce{PCl5}$ reacts with finely divided silver on heating and a white silver salt is obtained, which dissolves on adding excess aqueous $\\ce{NH3}$ solution. Write the reactions involved to explain what happens.',
      answer: 'PCl5 + 2Ag -> 2AgCl + PCl3. The white AgCl dissolves in excess NH3: AgCl + 2NH3(aq) -> [Ag(NH3)2]^+Cl^- (soluble diammine-silver complex).',
      solution: 'On heating, $\\ce{PCl5}$ reacts with silver to give the **white salt silver chloride**:\n\n' +
        '$$\\ce{PCl5 + 2Ag -> 2AgCl + PCl3}$$\n\n' +
        'The white $\\ce{AgCl}$ then **dissolves in excess aqueous ammonia** by forming the soluble **diammine-silver(I) complex**:\n\n' +
        '$$\\ce{AgCl + 2NH3(aq) -> [Ag(NH3)2]^+Cl^-}$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q58',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q58',
      prompt: 'Phosphorus forms a number of oxoacids. Out of these oxoacids phosphinic acid has strong reducing property. Write its structure and also write a reaction showing its reducing behaviour.',
      answer: 'Phosphinic (hypophosphorous) acid is H3PO2: P bonded to one =O, one –OH and two –H. Its reducing behaviour: 4AgNO3 + 2H2O + H3PO2 -> 4Ag + 4HNO3 + H3PO4.',
      solution: '**Structure of phosphinic (hypophosphorous) acid $\\ce{H3PO2}$:** phosphorus is bonded to **one terminal $\\ce{P=O}$**, **one $\\ce{P-OH}$** group, and **two $\\ce{P-H}$** bonds:\n\n' +
        '$$\\ce{H}\\!-\\!\\overset{\\displaystyle \\text{O}}{\\underset{\\displaystyle \\text{H}}{\\ce{P}}}\\!-\\!\\ce{OH}$$\n\n' +
        'The two **$\\ce{P-H}$ bonds** give it strong reducing power. For example, it **reduces silver ions to silver metal**:\n\n' +
        '$$4\\ce{AgNO3} + 2\\ce{H2O} + \\ce{H3PO2} -> 4\\ce{Ag} + 4\\ce{HNO3} + \\ce{H3PO4}$$',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q64',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q64',
      prompt: 'Assertion: $\\ce{N2}$ is less reactive than $\\ce{P4}$.\n\nReason: Nitrogen has more electron gain enthalpy than phosphorus.',
      options: ASSERTION_REASON_OPTIONS,
      correct_index: 2,
      explanation: 'The **assertion is correct**: $\\ce{N2}$ is far less reactive than $\\ce{P4}$ — because of its very strong $\\ce{N#N}$ **triple bond** (high bond dissociation enthalpy). The **reason is wrong**: nitrogen actually has a **less negative (smaller) electron gain enthalpy** than phosphorus, because the incoming electron enters a small, compact $2p$ shell with high electron–electron repulsion. So assertion correct, reason wrong → option (iii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q65',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q65',
      prompt: 'Assertion: $\\ce{HNO3}$ makes iron passive.\n\nReason: $\\ce{HNO3}$ forms a protective layer of ferric nitrate on the surface of iron.',
      options: ASSERTION_REASON_OPTIONS,
      correct_index: 2,
      explanation: 'The **assertion is correct**: concentrated $\\ce{HNO3}$ renders iron **passive** (it stops reacting). The **reason is wrong**: the protective film is a thin layer of **oxide ($\\ce{Fe3O4}$/$\\ce{Fe2O3}$)**, not ferric nitrate. So assertion correct, reason wrong → option (iii).',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q71',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q71',
      prompt: 'On heating lead (II) nitrate gives a brown gas "A". The gas "A" on cooling changes to colourless solid "B". Solid "B" on heating with $\\ce{NO}$ changes to a blue solid "C" and also write reactions involved and draw the structures of "B" and "C".',
      answer: 'A = NO2 (brown gas), B = N2O4 (colourless solid), C = N2O3 (blue solid). 2Pb(NO3)2 -> 2PbO + 4NO2 + O2; 2NO2 <=> N2O4 (on cooling); 2NO + N2O4 -> 2N2O3.',
      solution: '**Identifying A, B, C:**\n' +
        '- Heating lead nitrate gives the **brown gas $\\ce{NO2}$ (A)**:\n' +
        '$$2\\ce{Pb(NO3)2} \\xrightarrow{\\Delta} 2\\ce{PbO} + 4\\ce{NO2} + \\ce{O2}$$\n' +
        '- On cooling, $\\ce{NO2}$ dimerises to the **colourless solid $\\ce{N2O4}$ (B)**:\n' +
        '$$2\\ce{NO2} \\rightleftharpoons \\ce{N2O4}$$\n' +
        '- $\\ce{N2O4}$ with $\\ce{NO}$ gives the **blue solid $\\ce{N2O3}$ (C)**:\n' +
        '$$2\\ce{NO} + \\ce{N2O4} -> 2\\ce{N2O3}$$\n\n' +
        '**Structures.** $\\ce{N2O4}$ (B) is planar $\\ce{O2N-NO2}$ with an $\\ce{N-N}$ bond and two terminal $\\ce{O}$ on each nitrogen. $\\ce{N2O3}$ (C) is $\\ce{O2N-NO}$ — a nitro group joined to a nitroso group through an $\\ce{N-N}$ bond. Both show resonance over their terminal oxygens.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q72',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q72',
      prompt: 'On heating compound (A) gives a gas (B) which is a constituent of air. This gas when treated with 3 mol of hydrogen ($\\ce{H2}$) in the presence of a catalyst gives another gas (C) which is basic in nature. Gas C on further oxidation in moist condition gives a compound (D) which is a part of acid rain. Identify compounds (A) to (D) and also give necessary equations of all the steps involved.',
      answer: 'A = NH4NO2, B = N2, C = NH3, D = HNO3. NH4NO2 -> N2 + 2H2O; N2 + 3H2 -> 2NH3; 4NH3 + 5O2 -> 4NO + 6H2O, 2NO + O2 -> 2NO2, 3NO2 + H2O -> 2HNO3 + NO.',
      solution: '**Identifying the compounds:**\n' +
        '- **A = $\\ce{NH4NO2}$**; on heating it gives **B = $\\ce{N2}$** (a constituent of air):\n' +
        '$$\\ce{NH4NO2 -> N2 + 2H2O}$$\n' +
        '- $\\ce{N2}$ + 3 mol $\\ce{H2}$ (Haber process) gives the basic gas **C = $\\ce{NH3}$**:\n' +
        '$$\\ce{N2 + 3H2 -> 2NH3}$$\n' +
        '- $\\ce{NH3}$ on oxidation in moist air finally gives **D = $\\ce{HNO3}$** (a component of acid rain):\n' +
        '$$4\\ce{NH3} + 5\\ce{O2} -> 4\\ce{NO} + 6\\ce{H2O}$$\n' +
        '$$2\\ce{NO} + \\ce{O2} -> 2\\ce{NO2}$$\n' +
        '$$3\\ce{NO2} + \\ce{H2O} -> 2\\ce{HNO3} + \\ce{NO}$$',
    },
  ],

  'group-16': [
    {
      kind: 'mcq',
      id: 'pb-ex-q2',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q2',
      prompt: 'In qualitative analysis when $\\ce{H2S}$ is passed through an aqueous solution of salt acidified with dil. $\\ce{HCl}$, a black precipitate is obtained. On boiling the precipitate with dil. $\\ce{HNO3}$, it forms a solution of blue colour. Addition of excess of aqueous solution of ammonia to this solution gives ________.',
      options: [
        'deep blue precipitate of $\\ce{Cu(OH)2}$',
        'deep blue solution of $[\\ce{Cu(NH3)4}]^{2+}$',
        'deep blue solution of $\\ce{Cu(NO3)2}$',
        'deep blue solution of $\\ce{Cu(OH)2.Cu(NO3)2}$',
      ],
      correct_index: 1,
      explanation: 'The black sulphide precipitate is $\\ce{CuS}$; boiling with dilute $\\ce{HNO3}$ gives a blue $\\ce{Cu^{2+}}$ solution. With **excess aqueous ammonia**, $\\ce{Cu^{2+}}$ forms the **deep blue tetraamminecopper(II) complex $[\\ce{Cu(NH3)4}]^{2+}$** → option (ii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q20',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q20',
      prompt: 'Which of the following is $not$ tetrahedral in shape?',
      options: [
        '$\\ce{NH4+}$',
        '$\\ce{SiCl4}$',
        '$\\ce{SF4}$',
        '$\\ce{SO4^{2-}}$',
      ],
      correct_index: 2,
      explanation: '$\\ce{NH4+}$, $\\ce{SiCl4}$ and $\\ce{SO4^{2-}}$ all have four bond pairs and no lone pair on the central atom → **tetrahedral**. $\\ce{SF4}$ has four bond pairs **plus one lone pair** ($sp^3d$), giving a **see-saw** shape, not tetrahedral → option (iii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q21',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q21',
      prompt: 'Which of the following are peroxoacids of sulphur?',
      options: [
        '$\\ce{H2SO5}$ and $\\ce{H2S2O8}$',
        '$\\ce{H2SO5}$ and $\\ce{H2S2O7}$',
        '$\\ce{H2S2O7}$ and $\\ce{H2S2O8}$',
        '$\\ce{H2S2O6}$ and $\\ce{H2S2O7}$',
      ],
      correct_index: 0,
      explanation: 'Peroxoacids contain a **peroxide ($\\ce{-O-O-}$) linkage**. **$\\ce{H2SO5}$** (peroxomonosulphuric acid, Caro’s acid) and **$\\ce{H2S2O8}$** (peroxodisulphuric acid, Marshall’s acid) both have an $\\ce{-O-O-}$ group → option (i). ($\\ce{H2S2O7}$ is pyrosulphuric acid — no peroxo link.)',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q22',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q22',
      prompt: 'Hot conc. $\\ce{H2SO4}$ acts as a moderately strong oxidising agent. It oxidises both metals and nonmetals. Which of the following element is oxidised by conc. $\\ce{H2SO4}$ into two gaseous products?',
      options: [
        '$\\ce{Cu}$',
        '$\\ce{S}$',
        '$\\ce{C}$',
        '$\\ce{Zn}$',
      ],
      correct_index: 2,
      explanation: 'Hot conc. $\\ce{H2SO4}$ oxidises **carbon** to give **two gaseous products**, $\\ce{CO2}$ and $\\ce{SO2}$: $\\ce{C + 2H2SO4 -> CO2 + 2SO2 + 2H2O}$ → option (iii). (With $\\ce{Cu}$ or $\\ce{Zn}$ the metal product is a solid sulphate; with $\\ce{S}$ only $\\ce{SO2}$ gas is formed.)',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q32',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q32',
      prompt: 'Which of the following statements are correct for $\\ce{SO2}$ gas?\n\n(i) It acts as bleaching agent in moist conditions.\n\n(ii) Its molecule has linear geometry.\n\n(iii) Its dilute solution is used as disinfectant.\n\n(iv) It can be prepared by the reaction of dilute $\\ce{H2SO4}$ with metal sulphide.\n\n(Note: two or more options may be correct.)',
      answer: '(i) and (iii)',
      solution: 'Check each statement about $\\ce{SO2}$:\n\n' +
        '- **(i) correct:** in moist conditions $\\ce{SO2}$ acts as a **bleaching agent** (by reduction).\n' +
        '- **(ii) WRONG:** $\\ce{SO2}$ has a lone pair on $\\ce{S}$, so it is **bent/angular**, not linear.\n' +
        '- **(iii) correct:** dilute $\\ce{SO2}$ solution is used as a **disinfectant**.\n' +
        '- **(iv) WRONG:** dilute $\\ce{H2SO4}$ on a metal **sulphide** gives **$\\ce{H2S}$**, not $\\ce{SO2}$. ($\\ce{SO2}$ comes from a metal **sulphite** + acid.)\n\n' +
        'So the correct statements are **(i) and (iii)**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q34',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q34',
      prompt: 'Which of the following orders are correct as per the properties mentioned against each?\n\n(i) $\\ce{As2O3} < \\ce{SiO2} < \\ce{P2O3} < \\ce{SO2}$ — Acid strength.\n\n(ii) $\\ce{AsH3} < \\ce{PH3} < \\ce{NH3}$ — Enthalpy of vapourisation.\n\n(iii) $\\ce{S} < \\ce{O} < \\ce{Cl} < \\ce{F}$ — More negative electron gain enthalpy.\n\n(iv) $\\ce{H2O} > \\ce{H2S} > \\ce{H2Se} > \\ce{H2Te}$ — Thermal stability.\n\n(Note: two or more options may be correct.)',
      answer: '(i) and (iv)',
      solution: 'Check each order:\n\n' +
        '- **(i) correct:** acidic strength of oxides increases left-to-right across a period; $\\ce{As2O3}$ is the weakest (amphoteric) and $\\ce{SO2}$ the strongest, so $\\ce{As2O3} < \\ce{SiO2} < \\ce{P2O3} < \\ce{SO2}$ is right.\n' +
        '- **(ii) WRONG:** the correct order of $\\Delta_{vap}H$ is $\\ce{PH3} < \\ce{AsH3} < \\ce{NH3}$ (NH$_3$ highest due to H-bonding; among the others, larger size → larger value, so $\\ce{AsH3} > \\ce{PH3}$).\n' +
        '- **(iii) WRONG:** **chlorine** has the most negative electron gain enthalpy (more than F), so the order should be $\\ce{S} < \\ce{O} < \\ce{F} < \\ce{Cl}$, not as given.\n' +
        '- **(iv) correct:** thermal stability of hydrides falls down the group: $\\ce{H2O} > \\ce{H2S} > \\ce{H2Se} > \\ce{H2Te}$.\n\n' +
        'So the correct orders are **(i) and (iv)**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q35',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q35',
      prompt: 'Which of the following statements are correct?\n\n(i) S–S bond is present in $\\ce{H2S2O6}$.\n\n(ii) In peroxosulphuric acid ($\\ce{H2SO5}$) sulphur is in $+6$ oxidation state.\n\n(iii) Iron powder along with $\\ce{Al2O3}$ and $\\ce{K2O}$ is used as a catalyst in the preparation of $\\ce{NH3}$ by Haber’s process.\n\n(iv) Change in enthalpy is positive for the preparation of $\\ce{SO3}$ by catalytic oxidation of $\\ce{SO2}$.\n\n(Note: two or more options may be correct.)',
      answer: '(i) and (ii)',
      solution: 'Per the official key, the correct statements are **(i) and (ii)**:\n\n' +
        '- **(i) correct:** dithionic acid $\\ce{H2S2O6}$ has a direct **$\\ce{S-S}$ bond**.\n' +
        '- **(ii) correct:** in peroxomonosulphuric acid $\\ce{H2SO5}$ sulphur is in the **$+6$** state (the extra oxygen is in a peroxo linkage, not extra S oxidation).\n' +
        '- **(iv) WRONG:** $\\ce{2SO2 + O2 -> 2SO3}$ is **exothermic** ($\\Delta H$ is negative), so (iv) is false.\n\n' +
        '*Note:* statement **(iii)** (Fe with $\\ce{Al2O3}$ + $\\ce{K2O}$ as the catalyst/promoters in Haber’s process) is chemically correct, but the published key treats it as out of scope and excludes it; we follow the key answer **(i) and (ii)**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q36',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q36',
      prompt: 'In which of the following reactions conc. $\\ce{H2SO4}$ is used as an oxidising reagent?\n\n(i) $\\ce{CaF2 + H2SO4 -> CaSO4 + 2HF}$\n\n(ii) $\\ce{2HI + H2SO4 -> I2 + SO2 + 2H2O}$\n\n(iii) $\\ce{Cu + 2H2SO4 -> CuSO4 + SO2 + 2H2O}$\n\n(iv) $\\ce{NaCl + H2SO4 -> NaHSO4 + HCl}$\n\n(Note: two or more options may be correct.)',
      answer: '(ii) and (iii)',
      solution: 'KEY-CORRECTION: the official key prints only **(ii)**, but that is incomplete. $\\ce{H2SO4}$ acts as an **oxidising agent** only when its sulphur is **reduced** ($+6 \\to +4$, i.e. $\\ce{SO2}$ is formed):\n\n' +
        '- **(ii) correct:** $\\ce{2HI + H2SO4 -> I2 + SO2 + 2H2O}$ — iodide is oxidised to $\\ce{I2}$, S goes $+6 \\to +4$. Oxidising.\n' +
        '- **(iii) correct:** $\\ce{Cu + 2H2SO4 -> CuSO4 + SO2 + 2H2O}$ — copper is oxidised $0 \\to +2$, S goes $+6 \\to +4$. **Also oxidising** — this is the one the key omits.\n' +
        '- (i) and (iv) are simple **acid–base / displacement** reactions (no change in S oxidation state), so $\\ce{H2SO4}$ acts only as an acid there.\n\n' +
        'Correct answer: **(ii) and (iii)**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q38',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q38',
      prompt: 'In the preparation of $\\ce{H2SO4}$ by Contact Process, why is $\\ce{SO3}$ not absorbed directly in water to form $\\ce{H2SO4}$?',
      answer: 'Dissolving SO3 directly in water is highly exothermic and produces a dense acid fog (mist) of H2SO4 that is very difficult to condense. So SO3 is first absorbed in concentrated H2SO4 to form oleum, which is then diluted.',
      solution: 'If $\\ce{SO3}$ is passed directly into water, the reaction $\\ce{SO3 + H2O -> H2SO4}$ is **violently exothermic** and produces a **dense fog (mist) of fine $\\ce{H2SO4}$ droplets** that is **very difficult to condense**.\n\n' +
        'To avoid this, $\\ce{SO3}$ is instead absorbed in **concentrated $\\ce{H2SO4}$** to form **oleum (pyrosulphuric acid, $\\ce{H2S2O7}$)**:\n' +
        '$$\\ce{SO3 + H2SO4 -> H2S2O7}$$\n' +
        'The oleum is then **diluted with water** in a controlled way to give sulphuric acid of the required strength.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q61',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q61',
      prompt: 'Match the items of Columns I and II and mark the correct option.\n\n' +
        '| Column I | Column II |\n' +
        '|---|---|\n' +
        '| (A) $\\ce{H2SO4}$ | (1) Highest electron gain enthalpy |\n' +
        '| (B) $\\ce{CCl3NO2}$ | (2) Chalcogen |\n' +
        '| (C) $\\ce{Cl2}$ | (3) Tear gas |\n' +
        '| (D) Sulphur | (4) Storage batteries |',
      answer: '(A)-(4), (B)-(3), (C)-(1), (D)-(2)',
      solution: 'Match each item:\n\n' +
        '- **(A) $\\ce{H2SO4}$ → (4) storage batteries:** sulphuric acid is the electrolyte in lead storage batteries.\n' +
        '- **(B) $\\ce{CCl3NO2}$ → (3) tear gas:** chloropicrin is used as a tear gas.\n' +
        '- **(C) $\\ce{Cl2}$ → (1) highest electron gain enthalpy:** chlorine has the most negative electron gain enthalpy of all elements.\n' +
        '- **(D) Sulphur → (2) chalcogen:** sulphur is a group-16 (chalcogen) element.\n\n' +
        'This is code (i) in the exemplar.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q45',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q45',
      prompt: 'Out of $\\ce{H2O}$ and $\\ce{H2S}$, which one has higher bond angle and why?',
      answer: 'H2O has the larger bond angle (104.5° vs ~92° for H2S), because oxygen is more electronegative, drawing the bond pairs closer and increasing bond pair–bond pair repulsion.',
      solution: '**$\\ce{H2O}$ has the larger bond angle** ($\\approx 104.5^{\\circ}$ vs $\\approx 92^{\\circ}$ for $\\ce{H2S}$).\n\n' +
        'Oxygen is **more electronegative** than sulphur, so the bonding electron pairs in the $\\ce{O-H}$ bonds are pulled **closer to oxygen**. This brings the bond pairs nearer to each other, so the **bond pair–bond pair repulsion is greater**, pushing the bonds further apart and giving a **larger angle**. In $\\ce{H2S}$ the less electronegative $\\ce{S}$ holds the bond pairs farther away, so they repel less and the angle is smaller.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q46',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q46',
      prompt: '$\\ce{SF6}$ is known but $\\ce{SCl6}$ is not. Why?',
      answer: 'Fluorine is small, so six F atoms can fit around sulphur. Chlorine is larger, so six Cl atoms cannot be accommodated around sulphur without strong interionic/steric repulsion, and SCl6 does not form.',
      solution: 'Fluorine atoms are **small**, so **six** of them can be packed around the central sulphur atom to give $\\ce{SF6}$.\n\n' +
        'Chlorine atoms are **considerably larger**. Six chlorine atoms **cannot be accommodated** around sulphur — they would suffer severe **steric (interatomic) crowding/repulsion** — so $\\ce{SCl6}$ does not exist.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q49',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q49',
      prompt: 'Explain why the stability of oxoacids of chlorine increases in the order given below:\n\n$\\ce{HClO} < \\ce{HClO2} < \\ce{HClO3} < \\ce{HClO4}$',
      answer: 'As the number of oxygen atoms on chlorine increases, the negative charge of the conjugate base is spread over more oxygen atoms (greater delocalisation), making the conjugate base more stable and the acid stronger/more stable.',
      solution: 'Oxygen is more electronegative than chlorine, so each $\\ce{O}$ attached to $\\ce{Cl}$ helps **disperse the negative charge** of the conjugate base ($\\ce{ClO^-}$, $\\ce{ClO2^-}$, $\\ce{ClO3^-}$, $\\ce{ClO4^-}$).\n\n' +
        'As the **number of oxygen atoms increases** from $\\ce{HClO}$ to $\\ce{HClO4}$, the charge is spread over **more oxygen atoms**, so the conjugate base becomes **more stable** ($\\ce{ClO^-} < \\ce{ClO2^-} < \\ce{ClO3^-} < \\ce{ClO4^-}$).\n\n' +
        'A more stable conjugate base means a **more stable (and stronger) acid**, so the stability increases $\\ce{HClO} < \\ce{HClO2} < \\ce{HClO3} < \\ce{HClO4}$.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q50',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q50',
      prompt: 'Explain why ozone is thermodynamically less stable than oxygen.',
      answer: 'The conversion of ozone to oxygen is exothermic (ΔH is negative) and ΔG is negative, so O3 spontaneously decomposes to O2. Ozone has higher energy, hence it is thermodynamically less stable than oxygen.',
      solution: 'Ozone decomposes to oxygen with a **release of energy**:\n\n' +
        '$$2\\ce{O3} -> 3\\ce{O2}, \\quad \\Delta H < 0 \\ (\\text{exothermic, } \\Delta G < 0)$$\n\n' +
        'Because $\\ce{O3}$ has a **higher energy content** than $\\ce{O2}$ and its conversion to $\\ce{O2}$ is spontaneous (negative $\\Delta G$), **ozone is thermodynamically less stable** than oxygen and tends to decompose to it.',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q67',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q67',
      prompt: 'Assertion: Both rhombic and monoclinic sulphur exist as $\\ce{S8}$ but oxygen exists as $\\ce{O2}$.\n\nReason: Oxygen forms $p\\pi$–$p\\pi$ multiple bond due to small size and small bond length but $p\\pi$–$p\\pi$ bonding is not possible in sulphur.',
      options: ASSERTION_REASON_OPTIONS,
      correct_index: 0,
      explanation: 'The **assertion is correct**: sulphur catenates into $\\ce{S8}$ rings, while oxygen exists as diatomic $\\ce{O2}$. The **reason is also correct and explains it**: the small oxygen atom forms strong **$p\\pi$–$p\\pi$ multiple bonds** (the $\\ce{O=O}$ double bond in $\\ce{O2}$), but the larger sulphur atom cannot form effective $p\\pi$–$p\\pi$ bonds, so it forms single bonds and catenates into $\\ce{S8}$ instead. Both correct, reason explains assertion → option (i).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q69',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q69',
      prompt: 'Assertion: $\\ce{SF6}$ cannot be hydrolysed but $\\ce{SF4}$ can be.\n\nReason: Six F atoms in $\\ce{SF6}$ prevent the attack of $\\ce{H2O}$ on sulphur atom of $\\ce{SF6}$.',
      options: ASSERTION_REASON_OPTIONS,
      correct_index: 0,
      explanation: 'The **assertion is correct**: $\\ce{SF6}$ is resistant to hydrolysis, while $\\ce{SF4}$ is readily hydrolysed. The **reason is correct and explains it**: in $\\ce{SF6}$ the sulphur is **completely surrounded and shielded by six fluorine atoms** (a sterically saturated, symmetrical octahedron), so water cannot reach the sulphur. $\\ce{SF4}$ has a lone pair and is less shielded, so water can attack. Both correct, reason explains assertion → option (i).',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q70',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q70',
      prompt: 'An amorphous solid "A" burns in air to form a gas "B" which turns lime water milky. The gas is also produced as a by-product during roasting of sulphide ore. This gas decolourises acidified aqueous $\\ce{KMnO4}$ solution and reduces $\\ce{Fe^{3+}}$ to $\\ce{Fe^{2+}}$. Identify the solid "A" and the gas "B" and write the reactions involved.',
      answer: 'A = sulphur (S8), B = SO2. S8 + 8O2 -> 8SO2; 2MnO4^- + 5SO2 + 2H2O -> 5SO4^2- + 4H^+ + 2Mn^2+ (decolourises KMnO4); 2Fe^3+ + SO2 + 2H2O -> 2Fe^2+ + SO4^2- + 4H^+.',
      solution: '**A is sulphur ($\\ce{S8}$)** and **B is sulphur dioxide ($\\ce{SO2}$)**.\n\n' +
        '- Sulphur burns in air: $\\ce{S8 + 8O2 -> 8SO2}$.\n' +
        '- $\\ce{SO2}$ turns lime water milky and is a by-product of roasting sulphide ores.\n' +
        '- $\\ce{SO2}$ is a reducing agent — it **decolourises acidified $\\ce{KMnO4}$**:\n' +
        '$$2\\ce{MnO4^-} + 5\\ce{SO2} + 2\\ce{H2O} -> 5\\ce{SO4^{2-}} + 4\\ce{H^+} + 2\\ce{Mn^{2+}}$$\n' +
        '- and **reduces $\\ce{Fe^{3+}}$ to $\\ce{Fe^{2+}}$**:\n' +
        '$$2\\ce{Fe^{3+}} + \\ce{SO2} + 2\\ce{H2O} -> 2\\ce{Fe^{2+}} + \\ce{SO4^{2-}} + 4\\ce{H^+}$$',
    },
  ],

  'group-17': [
    {
      kind: 'mcq',
      id: 'pb-ex-q1',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q1',
      prompt: 'On addition of conc. $\\ce{H2SO4}$ to a chloride salt, colourless fumes are evolved but in case of iodide salt, violet fumes come out. This is because ________.',
      options: [
        '$\\ce{H2SO4}$ reduces $\\ce{HI}$ to $\\ce{I2}$',
        '$\\ce{HI}$ is of violet colour',
        '$\\ce{HI}$ gets oxidised to $\\ce{I2}$',
        '$\\ce{HI}$ changes to $\\ce{HIO3}$',
      ],
      correct_index: 2,
      explanation: 'With a chloride, conc. $\\ce{H2SO4}$ just liberates $\\ce{HCl}$ (colourless fumes). But $\\ce{HI}$ is a **strong reducing agent**, so the conc. $\\ce{H2SO4}$ **oxidises $\\ce{HI}$ to $\\ce{I2}$** (violet vapours): $\\ce{8HI + H2SO4 -> 4I2 + H2S + 4H2O}$. So $\\ce{HI}$ gets oxidised to $\\ce{I2}$ → option (iii). (Note option (i) is wrong because it is $\\ce{HI}$ that is oxidised, i.e. $\\ce{H2SO4}$ is the oxidiser, not the reduced species being $\\ce{HI}$.)',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q5',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q5',
      prompt: 'Which of the following pairs of ions are isoelectronic and isostructural?',
      options: [
        '$\\ce{CO3^{2-}}$, $\\ce{NO3^-}$',
        '$\\ce{ClO3^-}$, $\\ce{CO3^{2-}}$',
        '$\\ce{SO3^{2-}}$, $\\ce{NO3^-}$',
        '$\\ce{ClO3^-}$, $\\ce{SO3^{2-}}$',
      ],
      correct_index: 0,
      explanation: 'Isoelectronic species have the **same number of electrons**; isostructural means **same shape**. $\\ce{CO3^{2-}}$ and $\\ce{NO3^-}$ both have **24 electrons** and are both **trigonal planar** ($sp^2$, no lone pair on the central atom) → option (i). (The other pairs differ in electron count and/or shape — e.g. $\\ce{ClO3^-}$ and $\\ce{SO3^{2-}}$ are pyramidal, not planar.)',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q6',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q6',
      prompt: 'Affinity for hydrogen decreases in the group from fluorine to iodine. Which of the halogen acids should have highest bond dissociation enthalpy?',
      options: [
        '$\\ce{HF}$',
        '$\\ce{HCl}$',
        '$\\ce{HBr}$',
        '$\\ce{HI}$',
      ],
      correct_index: 0,
      explanation: 'Bond dissociation enthalpy of $\\ce{H-X}$ **decreases** down the group as the halogen gets larger (longer, weaker bond). The smallest halogen, **fluorine**, gives the **shortest, strongest $\\ce{H-F}$ bond** with the **highest bond dissociation enthalpy** → option (i).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q25',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q25',
      prompt: 'In solid state $\\ce{PCl5}$ is a ________.',
      options: [
        'covalent solid',
        'octahedral structure',
        'ionic solid with $[\\ce{PCl6}]^+$ octahedral and $[\\ce{PCl4}]^-$ tetrahedra',
        'ionic solid with $[\\ce{PCl4}]^+$ tetrahedral and $[\\ce{PCl6}]^-$ octahedra',
      ],
      correct_index: 3,
      explanation: 'Solid $\\ce{PCl5}$ is **ionic**, existing as $[\\ce{PCl4}]^+[\\ce{PCl6}]^-$. The cation $[\\ce{PCl4}]^+$ is **tetrahedral** and the anion $[\\ce{PCl6}]^-$ is **octahedral** → option (iv). (Option (iii) has the charges/shapes assigned to the wrong ions.)',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q26',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q26',
      prompt: 'Reduction potentials of some ions are given below. Arrange them in decreasing order of oxidising power.\n\n| Ion | $\\ce{ClO4^-}$ | $\\ce{IO4^-}$ | $\\ce{BrO4^-}$ |\n|---|---|---|---|\n| Reduction potential $E^{\\circ}$ / V | $1.19$ | $1.65$ | $1.74$ |',
      options: [
        '$\\ce{ClO4^-} > \\ce{IO4^-} > \\ce{BrO4^-}$',
        '$\\ce{IO4^-} > \\ce{BrO4^-} > \\ce{ClO4^-}$',
        '$\\ce{BrO4^-} > \\ce{IO4^-} > \\ce{ClO4^-}$',
        '$\\ce{BrO4^-} > \\ce{ClO4^-} > \\ce{IO4^-}$',
      ],
      correct_index: 2,
      explanation: 'A **higher (more positive) reduction potential** means a **stronger oxidising agent**. Ordering by $E^{\\circ}$: $\\ce{BrO4^-}(1.74) > \\ce{IO4^-}(1.65) > \\ce{ClO4^-}(1.19)$. So decreasing oxidising power is $\\ce{BrO4^-} > \\ce{IO4^-} > \\ce{ClO4^-}$ → option (iii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q27',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q27',
      prompt: 'Which of the following is isoelectronic pair?',
      options: [
        '$\\ce{ICl2}$, $\\ce{ClO2}$',
        '$\\ce{BrO2^-}$, $\\ce{BrF2^+}$',
        '$\\ce{ClO2}$, $\\ce{BrF}$',
        '$\\ce{CN^-}$, $\\ce{O3}$',
      ],
      correct_index: 1,
      explanation: 'Isoelectronic species have the **same total number of electrons**. **$\\ce{BrO2^-}$** has $35 + 2(8) + 1 = 52$ electrons and **$\\ce{BrF2^+}$** has $35 + 2(9) - 1 = 52$ electrons — equal → option (ii). (The other pairs do not match in electron count.)',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q28',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q28',
      prompt: 'If chlorine gas is passed through hot $\\ce{NaOH}$ solution, two changes are observed in the oxidation number of chlorine during the reaction. These are ________ and ________.\n\n(i) 0 to $+5$\n\n(ii) 0 to $+3$\n\n(iii) 0 to $-1$\n\n(iv) 0 to $+1$\n\n(Note: two or more options may be correct.)',
      answer: '(i) and (iii)',
      solution: 'With **hot** $\\ce{NaOH}$, chlorine **disproportionates**:\n\n' +
        '$$3\\ce{Cl2} + 6\\ce{NaOH} \\xrightarrow{\\text{hot}} 5\\ce{NaCl} + \\ce{NaClO3} + 3\\ce{H2O}$$\n\n' +
        '- Some chlorine is **reduced**: $0 \\to -1$ (in $\\ce{NaCl}$) → option (iii).\n' +
        '- Some chlorine is **oxidised**: $0 \\to +5$ (in $\\ce{NaClO3}$) → option (i).\n\n' +
        'So the two changes are **(i) and (iii)**. ((iv) $0 \\to +1$ would occur with **cold** $\\ce{NaOH}$, giving hypochlorite, not chlorate.)',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q29',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q29',
      prompt: 'Which of the following options are $not$ in accordance with the property mentioned against them?\n\n(i) $\\ce{F2} > \\ce{Cl2} > \\ce{Br2} > \\ce{I2}$ — Oxidising power.\n\n(ii) $\\ce{MI} > \\ce{MBr} > \\ce{MCl} > \\ce{MF}$ — Ionic character of metal halide.\n\n(iii) $\\ce{F2} > \\ce{Cl2} > \\ce{Br2} > \\ce{I2}$ — Bond dissociation enthalpy.\n\n(iv) $\\ce{HI} < \\ce{HBr} < \\ce{HCl} < \\ce{HF}$ — Hydrogen-halogen bond strength.\n\n(Note: two or more options may be correct.)',
      answer: '(ii) and (iii)',
      solution: 'The question asks which orders are **NOT** correct:\n\n' +
        '- **(i) is correct** (so not the answer): oxidising power genuinely falls $\\ce{F2} > \\ce{Cl2} > \\ce{Br2} > \\ce{I2}$.\n' +
        '- **(ii) is NOT correct:** ionic character of a metal halide is **highest for the fluoride** (most electronegative halogen) and lowest for the iodide, so the correct order is $\\ce{MF} > \\ce{MCl} > \\ce{MBr} > \\ce{MI}$ — the reverse of what is given.\n' +
        '- **(iii) is NOT correct:** $\\ce{F2}$ has an **anomalously low** bond dissociation enthalpy (small size → strong lone-pair repulsion), so the real order is $\\ce{Cl2} > \\ce{Br2} > \\ce{F2} > \\ce{I2}$, not $\\ce{F2}$ highest.\n' +
        '- **(iv) is correct** (so not the answer): $\\ce{H-X}$ bond strength rises $\\ce{HI} < \\ce{HBr} < \\ce{HCl} < \\ce{HF}$.\n\n' +
        'So the orders that are **not** in accordance are **(ii) and (iii)**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q31',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q31',
      prompt: 'Which of the following statements are correct?\n\n(i) Among halogens, radius ratio between iodine and fluorine is maximum.\n\n(ii) Leaving F—F bond, all halogens have weaker X—X bond than X—X′ bond in interhalogens.\n\n(iii) Among interhalogen compounds maximum number of atoms are present in iodine fluoride.\n\n(iv) Interhalogen compounds are more reactive than halogen compounds.\n\n(Note: two or more options may be correct.)',
      answer: '(i), (iii) and (iv)',
      solution: 'Per the official key, the correct statements are **(i), (iii) and (iv)**:\n\n' +
        '- **(i) correct:** iodine is the largest and fluorine the smallest halogen, so the $r_{\\ce{I}}/r_{\\ce{F}}$ ratio is the **maximum**.\n' +
        '- **(iii) correct:** the interhalogen with the most atoms is **$\\ce{IF7}$** (iodine heptafluoride) — iodine, being large, accommodates the most fluorines.\n' +
        '- **(iv) correct:** interhalogen compounds are **more reactive** than the parent halogens (the polar, weaker X–X′ bond breaks more easily).\n\n' +
        '*Note:* statement **(ii)** is also defensible (interhalogen X–X′ bonds are generally stronger than X–X bonds, except F–F), but the published key excludes it; we follow the key answer.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q44',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q44',
      prompt: 'Give reason to explain why $\\ce{ClF3}$ exists but $\\ce{FCl3}$ does not exist.',
      answer: 'Chlorine has vacant 3d orbitals and can expand its octet to bond three F atoms (ClF3). Fluorine has no d-orbitals and cannot expand its octet, so it cannot be the central atom bonding three Cl atoms; hence FCl3 does not exist.',
      solution: 'In $\\ce{ClF3}$ the **central atom is chlorine**, which has **vacant $3d$ orbitals**. It can **expand its octet** and form three bonds to fluorine.\n\n' +
        'For $\\ce{FCl3}$ the central atom would have to be **fluorine**, but fluorine is a second-period element with **no $d$-orbitals** and **cannot expand its octet** beyond one bond. So fluorine cannot bond three chlorine atoms, and **$\\ce{FCl3}$ does not exist**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q47',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q47',
      prompt: 'On reaction with $\\ce{Cl2}$, phosphorus forms two types of halides "A" and "B". Halide "A" is yellowish-white powder but halide "B" is colourless oily liquid. Identify "A" and "B" and write the formulas of their hydrolysis products.',
      answer: 'A = PCl5 (yellowish-white powder), B = PCl3 (colourless oily liquid). Hydrolysis: PCl5 + 4H2O -> H3PO4 + 5HCl; PCl3 + 3H2O -> H3PO3 + 3HCl.',
      solution: '**A is $\\ce{PCl5}$** (a yellowish-white powder) and **B is $\\ce{PCl3}$** (a colourless oily liquid):\n\n' +
        '$$\\ce{P4 + 10Cl2 -> 4PCl5}, \\quad \\ce{P4 + 6Cl2 -> 4PCl3}$$\n\n' +
        '**Hydrolysis products:**\n' +
        '$$\\ce{PCl5 + 4H2O -> H3PO4 + 5HCl}$$\n' +
        '$$\\ce{PCl3 + 3H2O -> H3PO3 + 3HCl}$$',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q62',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q62',
      prompt: 'Match the species given in Column I with the shape given in Column II and mark the correct option.\n\n' +
        '| Column I | Column II (shape) |\n' +
        '|---|---|\n' +
        '| (A) $\\ce{SF4}$ | (1) Tetrahedral |\n' +
        '| (B) $\\ce{BrF3}$ | (2) Pyramidal |\n' +
        '| (C) $\\ce{BrO3^-}$ | (3) Sea-saw shaped |\n' +
        '| (D) $\\ce{NH4+}$ | (4) Bent T-shaped |',
      answer: '(A)-(3), (B)-(4), (C)-(2), (D)-(1)',
      solution: 'Use VSEPR to assign each shape:\n\n' +
        '- **(A) $\\ce{SF4}$ → (3) see-saw:** 4 bond pairs + 1 lone pair ($sp^3d$).\n' +
        '- **(B) $\\ce{BrF3}$ → (4) bent T-shaped:** 3 bond pairs + 2 lone pairs ($sp^3d$).\n' +
        '- **(C) $\\ce{BrO3^-}$ → (2) pyramidal:** 3 bond pairs + 1 lone pair ($sp^3$).\n' +
        '- **(D) $\\ce{NH4+}$ → (1) tetrahedral:** 4 bond pairs, no lone pair ($sp^3$).\n\n' +
        'This is code (ii) in the exemplar.',
    },
  ],

  'group-18': [
    {
      kind: 'mcq',
      id: 'pb-ex-q24',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q24',
      prompt: 'In the preparation of compounds of Xe, Bartlett had taken $\\ce{O2^+PtF6^-}$ as a base compound. This is because ________.',
      options: [
        'both $\\ce{O2}$ and $\\ce{Xe}$ have same size.',
        'both $\\ce{O2}$ and $\\ce{Xe}$ have same electron gain enthalpy.',
        'both $\\ce{O2}$ and $\\ce{Xe}$ have almost same ionisation enthalpy.',
        'both $\\ce{Xe}$ and $\\ce{O2}$ are gases.',
      ],
      correct_index: 2,
      explanation: 'Bartlett reasoned that since $\\ce{PtF6}$ could oxidise $\\ce{O2}$ to $\\ce{O2^+}$, it should also oxidise $\\ce{Xe}$ — because the **first ionisation enthalpy of $\\ce{Xe}$ is almost the same as that of $\\ce{O2}$** (1170 vs 1175 kJ mol$^{-1}$). So both have almost the same ionisation enthalpy → option (iii).',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q37',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q37',
      prompt: 'Which of the following statements are true?\n\n(i) Only type of interactions between particles of noble gases are due to weak dispersion forces.\n\n(ii) Ionisation enthalpy of molecular oxygen is very close to that of xenon.\n\n(iii) Hydrolysis of $\\ce{XeF6}$ is a redox reaction.\n\n(iv) Xenon fluorides are not reactive.\n\n(Note: two or more options may be correct.)',
      answer: '(i) and (ii)',
      solution: 'Check each statement:\n\n' +
        '- **(i) true:** noble-gas atoms are monatomic and non-polar, so the only forces between them are **weak London dispersion forces**.\n' +
        '- **(ii) true:** the ionisation enthalpy of $\\ce{O2}$ is very close to that of $\\ce{Xe}$ — exactly the fact Bartlett exploited.\n' +
        '- **(iii) FALSE:** hydrolysis of $\\ce{XeF6}$ (e.g. $\\ce{XeF6 + 3H2O -> XeO3 + 6HF}$) keeps Xe in the **$+6$** state throughout — there is **no change in oxidation state**, so it is **not** a redox reaction.\n' +
        '- **(iv) FALSE:** xenon fluorides are **powerful, reactive** fluorinating/oxidising agents.\n\n' +
        'So the true statements are **(i) and (ii)**.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q59',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q59',
      prompt: 'Match the compounds given in Column I with the hybridisation and shape given in Column II and mark the correct option.\n\n' +
        '| Column I | Column II (hybridisation – shape) |\n' +
        '|---|---|\n' +
        '| (A) $\\ce{XeF6}$ | (1) $sp^3d^3$ – distorted octahedral |\n' +
        '| (B) $\\ce{XeO3}$ | (2) $sp^3d^2$ – square planar |\n' +
        '| (C) $\\ce{XeOF4}$ | (3) $sp^3$ – pyramidal |\n' +
        '| (D) $\\ce{XeF4}$ | (4) $sp^3d^2$ – square pyramidal |',
      answer: '(A)-(1), (B)-(3), (C)-(4), (D)-(2)',
      solution: 'Assign hybridisation and shape for each xenon compound:\n\n' +
        '- **(A) $\\ce{XeF6}$ → (1):** $sp^3d^3$, **distorted octahedral** (6 bond pairs + 1 lone pair).\n' +
        '- **(B) $\\ce{XeO3}$ → (3):** $sp^3$, **pyramidal** (3 bond pairs + 1 lone pair).\n' +
        '- **(C) $\\ce{XeOF4}$ → (4):** $sp^3d^2$, **square pyramidal** (5 bond pairs + 1 lone pair).\n' +
        '- **(D) $\\ce{XeF4}$ → (2):** $sp^3d^2$, **square planar** (4 bond pairs + 2 lone pairs).\n\n' +
        'This is code (i) in the exemplar.',
    },
    {
      kind: 'numerical',
      id: 'pb-ex-q63',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q63',
      prompt: 'Match the items of Columns I and II and mark the correct option.\n\n' +
        '| Column I | Column II |\n' +
        '|---|---|\n' +
        '| (A) Its partial hydrolysis does not change oxidation state of central atom | (1) $\\ce{He}$ |\n' +
        '| (B) It is used in modern diving apparatus | (2) $\\ce{XeF6}$ |\n' +
        '| (C) It is used to provide inert atmosphere for filling electrical bulbs | (3) $\\ce{XeF4}$ |\n' +
        '| (D) Its central atom is in $sp^3d^2$ hybridisation | (4) $\\ce{Ar}$ |',
      answer: '(A)-(2), (B)-(1), (C)-(4), (D)-(3)',
      solution: 'Match each description to the correct noble-gas species:\n\n' +
        '- **(A) → (2) $\\ce{XeF6}$:** its partial hydrolysis ($\\ce{XeF6 + H2O -> XeOF4 + 2HF}$) keeps Xe at $+6$ — **no change in oxidation state**.\n' +
        '- **(B) → (1) $\\ce{He}$:** a helium–oxygen mixture is used in **modern diving apparatus** (helium is less soluble in blood, avoiding "bends").\n' +
        '- **(C) → (4) $\\ce{Ar}$:** **argon** provides the inert atmosphere in **electric bulbs**.\n' +
        '- **(D) → (3) $\\ce{XeF4}$:** its central atom is $sp^3d^2$ hybridised (square planar).\n\n' +
        'This is code (iii) in the exemplar.',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q66',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q66',
      prompt: 'Assertion: $\\ce{HI}$ cannot be prepared by the reaction of $\\ce{KI}$ with concentrated $\\ce{H2SO4}$.\n\nReason: $\\ce{HI}$ has lowest H–X bond strength among halogen acids.',
      options: ASSERTION_REASON_OPTIONS,
      correct_index: 1,
      explanation: 'The **assertion is correct**: $\\ce{HI}$ cannot be made from $\\ce{KI}$ + conc. $\\ce{H2SO4}$, because $\\ce{H2SO4}$ **oxidises the $\\ce{HI}$ to $\\ce{I2}$**. The **reason is also a correct statement** ($\\ce{HI}$ does have the weakest H–X bond), and the weak bond is *why* $\\ce{HI}$ is so easily oxidised — but as a stand-alone reason it does **not directly explain** the assertion (the direct cause is the oxidising action of $\\ce{H2SO4}$). Both correct, reason not the correct explanation → option (ii).',
    },
    {
      kind: 'mcq',
      id: 'pb-ex-q68',
      source: 'ncert_exemplar',
      source_label: 'Exemplar Q68',
      prompt: 'Assertion: $\\ce{NaCl}$ reacts with concentrated $\\ce{H2SO4}$ to give colourless fumes with pungent smell. But on adding $\\ce{MnO2}$ the fumes become greenish yellow.\n\nReason: $\\ce{MnO2}$ oxidises $\\ce{HCl}$ to chlorine gas which is greenish yellow.',
      options: ASSERTION_REASON_OPTIONS,
      correct_index: 0,
      explanation: 'The **assertion is correct**: $\\ce{NaCl}$ + conc. $\\ce{H2SO4}$ gives **colourless, pungent $\\ce{HCl}$ fumes**, and adding $\\ce{MnO2}$ turns them **greenish yellow**. The **reason is correct and explains it**: $\\ce{MnO2}$ **oxidises the $\\ce{HCl}$ to greenish-yellow $\\ce{Cl2}$** ($\\ce{MnO2 + 4HCl -> MnCl2 + Cl2 + 2H2O}$). Both correct, reason explains assertion → option (i).',
    },
  ],
};
