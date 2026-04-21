/**
 * Coordination Compounds Flashcards — Refinement Migration
 *
 * Purpose: Replace the existing 70 cards (chapter.id = 'ch12_coordination')
 * with a fully rewritten, BITSAT/JEE-optimized set. Source material: NCERT
 * Class 12 Ch 9 (24 pages, all read) + JEE-level extensions from chemistry
 * expertise.
 *
 * Key changes vs existing cards:
 *   - All LaTeX normalized to single-$ inline math (existing cards had $$ everywhere)
 *   - Deduplicated (existing set had ~8 duplicates of anhydrous CuSO4, naming, etc.)
 *   - New topics: Spectrochemical Series & Colour, CFT-Tetrahedral & Spin,
 *     Magnetic Behaviour split from VBT, Applications expanded
 *   - Added worked-example cards with numerical answers (spin-only moment,
 *     CFSE, β_n calculations)
 *   - Added MA3B3 fac/mer, [M(AA)2X2] chirality, square-planar [MABXL] (3 isomers)
 *   - Added linkage-colour pair (red nitro vs yellow nitrito) with Jørgensen ref
 *   - Image-requiring cards flagged with tag `needs_image`
 *
 * Usage:
 *   node scripts/refine_coordination_flashcards.js            # preview only
 *   node scripts/refine_coordination_flashcards.js --apply    # soft-delete old + insert new
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const CHAPTER = { id: 'ch12_coordination', name: 'Coordination Compounds', category: 'Inorganic Chemistry' };

const TOPICS = [
  { name: "Werner's Theory & Double Salts", order: 1 },
  { name: 'Definitions & Terminology', order: 2 },
  { name: 'Ligands & Denticity', order: 3 },
  { name: 'Ambidentate Ligands & Chelate Effect', order: 4 },
  { name: 'IUPAC Nomenclature Rules', order: 5 },
  { name: 'IUPAC Naming Practice', order: 6 },
  { name: 'Oxidation State & Coordination Number', order: 7 },
  { name: 'Structural Isomerism', order: 8 },
  { name: 'Geometrical Isomerism', order: 9 },
  { name: 'Optical Isomerism', order: 10 },
  { name: 'Valence Bond Theory (VBT)', order: 11 },
  { name: 'VBT — Example Complexes', order: 12 },
  { name: 'Crystal Field Theory — Octahedral', order: 13 },
  { name: 'CFT — Tetrahedral & Spin State', order: 14 },
  { name: 'Spectrochemical Series & Colour', order: 15 },
  { name: 'Magnetic Behaviour', order: 16 },
  { name: 'Metal Carbonyls & Synergic Bonding', order: 17 },
  { name: 'Stability Constants & Chelate Effect', order: 18 },
  { name: 'Applications & Bioinorganic', order: 19 },
];

const c = (topic, difficulty, q, a, tags = []) => ({ topic, difficulty, q, a, tags });

const CARDS = [
  // ============================================================
  // 1. Werner's Theory & Double Salts
  // ============================================================
  c("Werner's Theory & Double Salts", 'easy',
    "In Werner's theory, what do primary and secondary valencies correspond to in modern terminology?",
    "Primary valency = oxidation number (ionisable, satisfied by negative ions). Secondary valency = coordination number (non-ionisable, satisfied by neutral or negative ligands, fixed for a given metal and has directional/geometric character)."),
  c("Werner's Theory & Double Salts", 'medium',
    "Complete Werner's data table for $CoCl_3 \\cdot xNH_3$: match the formula to its colour, secondary valency satisfaction and electrolyte type.",
    "Yellow $[Co(NH_3)_6]Cl_3$ (1:3 electrolyte, 3 ionisable $Cl^-$); Purple $[Co(NH_3)_5Cl]Cl_2$ (1:2, 2 ionisable $Cl^-$); Green trans-$[Co(NH_3)_4Cl_2]Cl$ (1:1); Violet cis-$[Co(NH_3)_4Cl_2]Cl$ (1:1)."),
  c("Werner's Theory & Double Salts", 'medium',
    "What is the fundamental difference between a double salt and a coordination complex?",
    "A double salt (e.g. Mohr's salt $FeSO_4(NH_4)_2SO_4\\cdot 6H_2O$, carnallite $KCl\\cdot MgCl_2\\cdot 6H_2O$) dissociates completely into its simple ions in water. A coordination complex (e.g. $K_4[Fe(CN)_6]$) keeps the complex ion intact and does not give tests for its constituent ions ($Fe^{2+}, CN^-$)."),
  c("Werner's Theory & Double Salts", 'medium',
    "Assign the secondary valency of the metal in: (i) $PdCl_2\\cdot 4NH_3$, (ii) $NiCl_2\\cdot 6H_2O$, (iii) $PtCl_4\\cdot 2HCl$, (iv) $CoCl_3\\cdot 4NH_3$, (v) $PtCl_2\\cdot 2NH_3$.",
    "(i) 4 — $[Pd(NH_3)_4]Cl_2$; (ii) 6 — $[Ni(H_2O)_6]Cl_2$; (iii) 6 — $H_2[PtCl_6]$; (iv) 6 — $[Co(NH_3)_4Cl_2]Cl$; (v) 4 — $[Pt(NH_3)_2Cl_2]$."),
  c("Werner's Theory & Double Salts", 'medium',
    "A solution of $CoCl_3\\cdot 5NH_3$ gives 2 mol of AgCl per mol with excess $AgNO_3$. Write its Werner formulation and predict its conductivity.",
    "$[Co(NH_3)_5Cl]Cl_2$ — the two $Cl^-$ outside the sphere give AgCl. It is a 1:2 electrolyte (gives 3 ions in solution: 1 complex cation + 2 $Cl^-$)."),
  c("Werner's Theory & Double Salts", 'medium',
    "Arrange these complexes in increasing order of molar conductivity: $[Co(NH_3)_3Cl_3]$, $[Co(NH_3)_4Cl_2]Cl$, $[Co(NH_3)_5Cl]Cl_2$, $[Co(NH_3)_6]Cl_3$.",
    "$[Co(NH_3)_3Cl_3]$ (non-electrolyte, 0 ions) $<$ $[Co(NH_3)_4Cl_2]Cl$ (1:1, 2 ions) $<$ $[Co(NH_3)_5Cl]Cl_2$ (1:2, 3 ions) $<$ $[Co(NH_3)_6]Cl_3$ (1:3, 4 ions). Conductivity rises with the number of ions produced."),
  c("Werner's Theory & Double Salts", 'hard',
    "Which Werner postulate explains why $[Co(NH_3)_4Cl_2]Cl$ exists as two distinct coloured isomers (violet and green)?",
    "The postulate that secondary valencies have fixed directional arrangements in space (i.e. a definite coordination polyhedron). An octahedral $MA_4B_2$ geometry admits two spatial arrangements — cis (violet) and trans (green) — proving that bonding is directional."),

  // ============================================================
  // 2. Definitions & Terminology
  // ============================================================
  c('Definitions & Terminology', 'easy',
    'Define "coordination entity" and give the central atom for $[Fe(CN)_6]^{4-}$ and $[Co(NH_3)_6]^{3+}$.',
    "A coordination entity is a central metal atom/ion bonded to a fixed number of ions or molecules. Central atom: $Fe^{2+}$ in $[Fe(CN)_6]^{4-}$; $Co^{3+}$ in $[Co(NH_3)_6]^{3+}$."),
  c('Definitions & Terminology', 'easy',
    'What is the coordination sphere and what are counter ions? Illustrate with $K_4[Fe(CN)_6]$.',
    "The coordination sphere is the central atom plus its attached ligands, written inside square brackets. Counter ions are ions outside the brackets. In $K_4[Fe(CN)_6]$: coordination sphere $= [Fe(CN)_6]^{4-}$; counter ions $= 4 K^+$."),
  c('Definitions & Terminology', 'medium',
    "Differentiate homoleptic and heteroleptic complexes with examples.",
    "Homoleptic — metal bound to only one type of donor ligand (e.g. $[Co(NH_3)_6]^{3+}$, $[Ni(CO)_4]$). Heteroleptic — metal bound to more than one type of donor ligand (e.g. $[Co(NH_3)_4Cl_2]^+$, $[Pt(NH_3)_2Cl_2]$)."),
  c('Definitions & Terminology', 'medium',
    "How is coordination number defined for the central metal? Do $\\pi$-bonds count?",
    "Coordination number = number of $\\sigma$-bonds formed by ligand donor atoms to the metal. Only $\\sigma$-bonds are counted; any $\\pi$-bonds (as in metal carbonyls) do not add to the coordination number."),
  c('Definitions & Terminology', 'easy',
    "List the five common coordination polyhedra with a sample coordination number each.",
    "Tetrahedral (CN 4), Square planar (CN 4), Trigonal bipyramidal (CN 5), Square pyramidal (CN 5), Octahedral (CN 6).",
    ['needs_image']),
  c('Definitions & Terminology', 'medium',
    "Why are central metal atoms in coordination entities called Lewis acids?",
    "They accept lone pairs from ligand donor atoms (Lewis bases) to form coordinate covalent bonds. In e.g. $[Ni(H_2O)_6]^{2+}$, $Ni^{2+}$ accepts six lone pairs from six water molecules."),
  c('Definitions & Terminology', 'medium',
    "Find the coordination number of the central atom in (i) $[Co(en)_3]^{3+}$, (ii) $[Fe(C_2O_4)_3]^{3-}$, (iii) $[Ni(DMG)_2]$.",
    "(i) 6 — en is bidentate, $3\\times 2$. (ii) 6 — oxalate is bidentate, $3\\times 2$. (iii) 4 — DMG is bidentate, $2\\times 2$ with square-planar geometry."),

  // ============================================================
  // 3. Ligands & Denticity
  // ============================================================
  c('Ligands & Denticity', 'easy',
    "Define unidentate, bidentate, and polydentate ligands with one example each.",
    "Unidentate: one donor atom (e.g. $NH_3$, $H_2O$, $Cl^-$). Bidentate: two donor atoms (e.g. ethylenediamine $en$, oxalate $C_2O_4^{2-}$). Polydentate: multiple donors (e.g. EDTA^{4-}, hexadentate)."),
  c('Ligands & Denticity', 'medium',
    "What is the denticity and charge of the EDTA ligand, and what donor atoms does it use?",
    "Denticity = 6 (hexadentate). Charge = $-4$ (ethylenediaminetetraacetate, EDTA^{4-}). Donor atoms: 2 N (amine) and 4 O (from four deprotonated carboxylate groups)."),
  c('Ligands & Denticity', 'medium',
    "Write the IUPAC names (ligand forms) of the neutral ligands: $H_2O$, $NH_3$, $CO$, $NO$.",
    "$H_2O$ = aqua; $NH_3$ = ammine (double m); $CO$ = carbonyl; $NO$ = nitrosyl."),
  c('Ligands & Denticity', 'medium',
    "Give the 2004 IUPAC names of the common anionic ligands: $Cl^-$, $Br^-$, $F^-$, $CN^-$, $OH^-$, $O^{2-}$, $C_2O_4^{2-}$.",
    "$Cl^-$ = chlorido; $Br^-$ = bromido; $F^-$ = fluorido; $CN^-$ = cyanido (classical: cyano); $OH^-$ = hydroxido; $O^{2-}$ = oxido; $C_2O_4^{2-}$ = oxalato."),
  c('Ligands & Denticity', 'medium',
    "Name three common chelating ligands used in laboratory analysis and give their denticity.",
    "Ethylenediamine (en) — bidentate; oxalate ($C_2O_4^{2-}$) — bidentate; dimethylglyoxime (DMG) — bidentate; EDTA$^{4-}$ — hexadentate; $\\alpha$-nitroso-$\\beta$-naphthol — bidentate."),
  c('Ligands & Denticity', 'medium',
    "Draw/describe the structure of the EDTA ligand and explain why it wraps around a metal ion.",
    "EDTA is $(HOOC-CH_2)_2N-CH_2CH_2-N(CH_2-COOH)_2$. On deprotonation it becomes EDTA$^{4-}$ with 2 amine N lone pairs and 4 carboxylate O$^-$ lone pairs — six donors that wrap around one $M^{n+}$ to form a very stable 1:1 octahedral chelate.",
    ['needs_image']),
  c('Ligands & Denticity', 'medium',
    "Why are chelate complexes generally more stable than analogous complexes with monodentate ligands?",
    "Chelation leads to a large increase in entropy during complex formation ($\\Delta S > 0$): e.g. $M(H_2O)_6^{n+} + 3\\,en \\to [M(en)_3]^{n+} + 6H_2O$ releases 6 particles but consumes only 3, so $\\Delta G = \\Delta H - T\\Delta S$ becomes more negative. This is the chelate effect."),

  // ============================================================
  // 4. Ambidentate Ligands & Chelate Effect
  // ============================================================
  c('Ambidentate Ligands & Chelate Effect', 'easy',
    "What is an ambidentate ligand? Name the four important examples.",
    "A monodentate ligand that has more than one donor atom and can bind via either. Examples: $NO_2^-$ (nitrito-N via N vs nitrito-O via O), $SCN^-$ (thiocyanato-S vs isothiocyanato-N), $CN^-$ (cyanido-C vs isocyanido-N)."),
  c('Ambidentate Ligands & Chelate Effect', 'medium',
    "Distinguish nitro and nitrito linkage in IUPAC 2004 naming.",
    "$-NO_2$ bound through N is written nitrito-$\\kappa$N (older: nitro-). Bound through O it is nitrito-$\\kappa$O (older: nitrito-). In the latest IUPAC form both are called nitrito with the donor atom specified by $\\kappa$N or $\\kappa$O."),
  c('Ambidentate Ligands & Chelate Effect', 'medium',
    "Jørgensen prepared two complexes of formula $[Co(NH_3)_5(NO_2)]Cl_2$. Identify them, their colours, and the type of isomerism.",
    "Red form: $[Co(NH_3)_5(NO_2-\\kappa N)]Cl_2$ — bound through N. Yellow form: $[Co(NH_3)_5(ONO-\\kappa O)]Cl_2$ — bound through O. This is linkage isomerism (arising from an ambidentate ligand)."),
  c('Ambidentate Ligands & Chelate Effect', 'medium',
    "Define the chelate effect in one sentence, and state whether it is enthalpy- or entropy-driven.",
    "The chelate effect is the extra thermodynamic stability of a complex with a chelating (multidentate) ligand relative to an otherwise identical complex with analogous monodentate ligands. It is primarily entropy-driven."),
  c('Ambidentate Ligands & Chelate Effect', 'medium',
    "Which is more stable and why: $[Ni(NH_3)_6]^{2+}$ or $[Ni(en)_3]^{2+}$?",
    "$[Ni(en)_3]^{2+}$. Same donor atom (N) in both, but replacing 6 $NH_3$ by 3 en releases 6 water ligands while binding 3 new ligands — net increase in particle count raises entropy, giving $[Ni(en)_3]^{2+}$ a much larger $\\beta$."),

  // ============================================================
  // 5. IUPAC Nomenclature Rules
  // ============================================================
  c('IUPAC Nomenclature Rules', 'easy',
    "State the overall order of naming in a coordination compound (2004 IUPAC rules).",
    "Cation first, anion second (regardless of charge). Inside the sphere: ligands alphabetically, then metal, then oxidation state in Roman numerals in parentheses. Anionic complexes end in '-ate'."),
  c('IUPAC Nomenclature Rules', 'medium',
    "Which multiplier prefixes are used when a ligand name already contains a numerical prefix, and why?",
    "bis (2), tris (3), tetrakis (4), pentakis (5), hexakis (6). Used when the ligand name itself contains di-, tri-, or a complex substituent (e.g. ethylenediamine → tris(ethane-1,2-diamine)), to avoid confusion with the ligand's own count."),
  c('IUPAC Nomenclature Rules', 'medium',
    "When writing a formula, what is the order of ligands inside the square bracket?",
    "Alphabetical order of the ligand symbols/names, regardless of charge. Polydentate ligands are also alphabetised. The central atom symbol comes first inside the bracket, ligands follow."),
  c('IUPAC Nomenclature Rules', 'medium',
    "Give the Latin 'ate' names used for these metals in anionic complexes: Fe, Cu, Ag, Au, Sn, Pb, Hg.",
    "Ferrate (Fe), cuprate (Cu), argentate (Ag), aurate (Au), stannate (Sn), plumbate (Pb), mercurate (Hg)."),
  c('IUPAC Nomenclature Rules', 'medium',
    "Under 2004 IUPAC rules, how are the endings changed for anionic ligands?",
    "Classical '-ide' → '-ido' (chloride → chlorido); '-ate' → '-ato' (sulfate → sulfato); '-ite' → '-ito' (sulfite → sulfito). Exceptions: CN$^-$ still often seen as cyano in textbooks; this older form is retained in many Indian syllabi."),
  c('IUPAC Nomenclature Rules', 'medium',
    "How is the oxidation state of the metal determined in a coordination entity like $[Cu(CN)_4]^{3-}$?",
    "Sum of charges of all ligands plus oxidation state of metal = overall charge of entity. In $[Cu(CN)_4]^{3-}$: $x + 4(-1) = -3 \\Rightarrow x = +1$, so it is named cuprate(I) and written Cu(I)."),
  c('IUPAC Nomenclature Rules', 'medium',
    "State the rule for bridging ligands in polynuclear complexes.",
    "A bridging ligand that connects two metal centres is indicated by the prefix $\\mu$- before its name (e.g. $\\mu$-oxido, $\\mu$-hydroxido). The number of bridges of the same type is shown by di-$\\mu$-, tri-$\\mu$-, etc."),
  c('IUPAC Nomenclature Rules', 'medium',
    "What does the use of enclosing marks — ( ), [ ], { } — indicate in IUPAC formulae and names?",
    "Square brackets $[\\,]$ enclose the entire coordination entity (ligands + metal). Round brackets $(\\,)$ enclose a polyatomic or abbreviated ligand, or the oxidation state. Curly braces $\\{\\,\\}$ are used for the outermost enclosure in very complex names."),

  // ============================================================
  // 6. IUPAC Naming Practice
  // ============================================================
  c('IUPAC Naming Practice', 'medium',
    "Write the IUPAC name of $[Cr(NH_3)_3(H_2O)_3]Cl_3$.",
    "Triamminetriaquachromium(III) chloride. Ligands alphabetised: ammine (a) before aqua (a) — use second letter 'm' vs 'q'; all three Cl$^-$ are counter ions."),
  c('IUPAC Naming Practice', 'medium',
    "Write the IUPAC name of $[Co(en)_3]_2(SO_4)_3$.",
    "Tris(ethane-1,2-diamine)cobalt(III) sulphate. en is a chelating ligand with a compound name, so 'tris' is used. Cobalt oxidation state: $2x + 3(-2) = 0$ when combined, but inside the cation $[Co(en)_3]^{3+}$, $x = +3$."),
  c('IUPAC Naming Practice', 'medium',
    "Give the IUPAC name of $[Ag(NH_3)_2][Ag(CN)_2]$.",
    "Diamminesilver(I) dicyanidoargentate(I). Note the same metal (Ag) appears in both cation and anion but uses different names because of the '-ate' ending for the anionic complex."),
  c('IUPAC Naming Practice', 'medium',
    "Write the formulae for: (i) potassium trioxalatoaluminate(III); (ii) dichloridobis(ethane-1,2-diamine)cobalt(III); (iii) mercury tetrathiocyanatocobaltate(III).",
    "(i) $K_3[Al(C_2O_4)_3]$; (ii) $[CoCl_2(en)_2]^+$ (commonly as chloride: $[CoCl_2(en)_2]Cl$); (iii) $Hg[Co(SCN)_4]$."),
  c('IUPAC Naming Practice', 'medium',
    "Name $[Pt(NH_3)_2Cl(NO_2)]$ unambiguously.",
    "Diamminechlorido(nitrito-$\\kappa$N)platinum(II). Nitrito-$\\kappa$N specifies N-bonded ambidentate $NO_2^-$ (older name: nitro). Ligands alphabetised: ammine, chlorido, nitrito."),
  c('IUPAC Naming Practice', 'medium',
    "IUPAC-name $[Co(NH_3)_5(CO_3)]Cl$.",
    "Pentaamminecarbonatocobalt(III) chloride. Cobalt's oxidation state: $x + 0(5) + (-2) + 0 = +1$ (overall cation charge); so $x = +3$."),
  c('IUPAC Naming Practice', 'medium',
    "Name $K_2[Zn(OH)_4]$ and $[Co(NH_3)_6][Cr(CN)_6]$.",
    "$K_2[Zn(OH)_4]$ = potassium tetrahydroxidozincate(II). $[Co(NH_3)_6][Cr(CN)_6]$ = hexaamminecobalt(III) hexacyanidochromate(III)."),

  // ============================================================
  // 7. Oxidation State & Coordination Number
  // ============================================================
  c('Oxidation State & Coordination Number', 'easy',
    "Give the oxidation state of the metal in (i) $[Ni(CO)_4]$; (ii) $[Fe(CN)_6]^{3-}$; (iii) $[Cr(H_2O)_6]^{3+}$; (iv) $[MnO_4]^-$.",
    "(i) Ni = 0 (CO is neutral). (ii) Fe: $x + 6(-1) = -3 \\Rightarrow x = +3$. (iii) Cr = +3. (iv) Mn: $x + 4(-2) = -1 \\Rightarrow x = +7$."),
  c('Oxidation State & Coordination Number', 'medium',
    "Find the coordination number and oxidation state in $K_3[Co(C_2O_4)_3]$ and cis-$[Cr(en)_2Cl_2]Cl$.",
    "$K_3[Co(C_2O_4)_3]$: oxalate is bidentate, CN = 6; Co is $+3$. $[Cr(en)_2Cl_2]Cl$: en is bidentate, CN = $2\\times 2 + 2 = 6$; Cr is $+3$."),
  c('Oxidation State & Coordination Number', 'medium',
    "Ni in $[Ni(CO)_4]$ has oxidation state 0 but is not a free atom — why is the complex still diamagnetic?",
    "In Ni(0) the configuration is $3d^{10}4s^0$ — all d-electrons paired. CO is a strong-field ligand that promotes $sp^3$ hybridisation using empty $4s/4p$ orbitals, and no unpaired electrons remain."),
  c('Oxidation State & Coordination Number', 'medium',
    "For $[Pt(NH_3)_2Cl(NH_2CH_3)]Cl$ determine (i) charge of complex cation, (ii) oxidation state of Pt, (iii) CN.",
    "(i) $+1$ (one Cl$^-$ outside). (ii) Pt $+2$ ($x + 0 + 0 + (-1) = +1 \\Rightarrow x=+2$). (iii) 4 (two ammines, one chlorido, one methylamine — all monodentate)."),
  c('Oxidation State & Coordination Number', 'hard',
    "In $[Pt(NH_3)_4Br(NO_2)]SO_4$ the sulfate is counter ion. Give Pt oxidation state and the overall spin state/geometry expected.",
    "Complex cation charge: $+2$ (balances $SO_4^{2-}$). Pt: $x + 4(0) + (-1) + (-1) = +2 \\Rightarrow x = +4$. $Pt^{4+}$ is $5d^6$ and with strong-field ligands forms low-spin $d^2sp^3$ octahedral, diamagnetic."),

  // ============================================================
  // 8. Structural Isomerism
  // ============================================================
  c('Structural Isomerism', 'easy',
    "List the four types of structural isomerism observed in coordination compounds.",
    "(i) Ionisation isomerism; (ii) Linkage isomerism; (iii) Coordination isomerism; (iv) Solvate (hydrate) isomerism."),
  c('Structural Isomerism', 'medium',
    "Identify and name the isomerism: $[Co(NH_3)_5SO_4]Br$ vs $[Co(NH_3)_5Br]SO_4$.",
    "Ionisation isomerism. Counter ions and one ligand swap between the coordination and ionisation spheres. The first gives a $Br^-$ test with $AgNO_3$; the second gives a $SO_4^{2-}$ test with $BaCl_2$."),
  c('Structural Isomerism', 'medium',
    "Identify the isomerism in violet $[Cr(H_2O)_6]Cl_3$ vs grey-green $[Cr(H_2O)_5Cl]Cl_2\\cdot H_2O$ vs green $[Cr(H_2O)_4Cl_2]Cl\\cdot 2H_2O$.",
    "Solvate (hydrate) isomerism — arises when water molecules move between the coordination sphere and the lattice. All three have the same empirical formula $CrCl_3\\cdot 6H_2O$ but differ in structure, colour, and the number of Cl$^-$ precipitated by $AgNO_3$ (3, 2, 1 respectively)."),
  c('Structural Isomerism', 'medium',
    "Give an example of coordination isomerism and explain the phenomenon.",
    "$[Co(NH_3)_6][Cr(CN)_6]$ and $[Cr(NH_3)_6][Co(CN)_6]$. Occurs in compounds where both cation and anion are complex ions — the ligands exchange between the two metal centres."),
  c('Structural Isomerism', 'medium',
    "Why does $[Co(NH_3)_6][Cr(CN)_6]$ show coordination isomerism but $[Cr(NH_3)_6][Cr(CN)_6]$ does not?",
    "Coordination isomerism requires the two metal centres to be different elements (or in different oxidation states). In $[Cr(NH_3)_6][Cr(CN)_6]$ both metals are Cr(III); exchanging ligands gives back the same compound."),
  c('Structural Isomerism', 'medium',
    "Isomer A ($CoSO_4Cl\\cdot 5NH_3$) gives a white ppt with $AgNO_3$ but none with $BaCl_2$. Isomer B gives no AgCl but a white ppt with $BaCl_2$. Write both formulae.",
    "A: $[Co(NH_3)_5(SO_4)]Cl$ — Cl$^-$ is free (ionisable), $SO_4^{2-}$ is inside the sphere. B: $[Co(NH_3)_5Cl]SO_4$ — $SO_4^{2-}$ is free, Cl$^-$ is inside the sphere. They are ionisation isomers."),
  c('Structural Isomerism', 'hard',
    "How many total isomers (structural + geometrical + optical) can $[Co(NH_3)_5(NO_2)](NO_3)_2$ show?",
    "Two linkage isomers: $[Co(NH_3)_5(NO_2-\\kappa N)]^{2+}$ (red, nitro) and $[Co(NH_3)_5(ONO-\\kappa O)]^{2+}$ (yellow, nitrito). Ionisation isomerism is also possible if the $NO_3^-$ and $NO_2^-$/$ONO^-$ swap positions: $[Co(NH_3)_5(NO_3)](NO_2)_2$ etc., giving a richer family."),
  c('Structural Isomerism', 'medium',
    "Predict whether $[Pt(NH_3)_2(H_2O)_2]Br_2$ and $[Pt(NH_3)_2(H_2O)Br]Br\\cdot H_2O$ are solvate or ionisation isomers.",
    "Both — it's a hydrate/solvate isomerism because an $H_2O$ molecule has moved from the coordination sphere to the lattice; simultaneously a $Br^-$ has come in, which also qualifies as ionisation isomerism. Textbooks classify such pairs under solvate isomerism."),

  // ============================================================
  // 9. Geometrical Isomerism
  // ============================================================
  c('Geometrical Isomerism', 'easy',
    "In which geometries is geometrical isomerism observed for coordination entities, and in which is it not?",
    "Observed in square-planar ($MA_2B_2$, $MA_2BC$, $MABCD$) and octahedral ($MA_4B_2$, $MA_3B_3$, $M(AA)_2B_2$) complexes. Not observed in tetrahedral complexes because all four positions are equivalent and adjacent to each other.",
    ['needs_image']),
  c('Geometrical Isomerism', 'medium',
    "Draw/describe the cis and trans isomers of $[Pt(NH_3)_2Cl_2]$. Which is cisplatin and what is its use?",
    "Square-planar geometry. Cis: the two $Cl^-$ occupy adjacent (90°) positions; trans: opposite (180°). Cis-$[Pt(NH_3)_2Cl_2]$ is cisplatin, an important anti-cancer drug (binds DNA cross-link). The trans isomer is clinically inactive.",
    ['needs_image']),
  c('Geometrical Isomerism', 'medium',
    "A square-planar complex of the type $[M(AB)_2]$ where AB is an unsymmetrical bidentate ligand. Does it show geometrical isomerism?",
    "Yes — cis (both A's together) and trans (A's across). Example: $[Pt(gly)_2]$ where glycinate coordinates through N and O."),
  c('Geometrical Isomerism', 'medium',
    "How many geometrical isomers does square-planar $[Pt(NH_3)(Br)(Cl)(py)]$ have?",
    "Three. For an $MABCD$ square planar complex, the three isomers are defined by which ligand is trans to which; the three distinct pairings give 3 geometrical isomers."),
  c('Geometrical Isomerism', 'medium',
    "Give the number and type of geometrical isomers for octahedral $[Co(NH_3)_3(NO_2)_3]$.",
    "Two — the facial (fac) isomer with all three similar ligands on one triangular face and the meridional (mer) isomer with the three similar ligands along a meridian. This is a $MA_3B_3$ type.",
    ['needs_image']),
  c('Geometrical Isomerism', 'medium',
    "State the geometrical isomers of $[CoCl_2(en)_2]^+$ and explain how they arise.",
    "Cis (two Cl's adjacent, 90°) and trans (Cl's opposite, 180°). Bidentate en bridges two adjacent positions, leaving the two unidentate Cl's to choose cis or trans arrangements.",
    ['needs_image']),
  c('Geometrical Isomerism', 'hard',
    "Can $[Co(en)_3]^{3+}$ show geometrical isomerism?",
    "No — all three bidentate en ligands are identical and occupy equivalent positions. Only optical isomerism (d and l) is possible for $[M(AA)_3]$ type."),
  c('Geometrical Isomerism', 'medium',
    "Draw/describe the cis and trans isomers of $[Fe(NH_3)_2(CN)_4]^-$.",
    "Octahedral $MA_2B_4$ type. Cis: two $NH_3$ adjacent (90°); trans: two $NH_3$ opposite (180°). The four $CN^-$ fill the other four sites.",
    ['needs_image']),

  // ============================================================
  // 10. Optical Isomerism
  // ============================================================
  c('Optical Isomerism', 'easy',
    "What is the necessary and sufficient condition for a coordination compound to be optically active?",
    "The complex must be chiral — non-superimposable on its mirror image. In practice, this means it lacks any plane of symmetry, centre of symmetry, or improper rotation axis ($S_n$)."),
  c('Optical Isomerism', 'medium',
    "Why is $[Co(en)_3]^{3+}$ optically active but $[Co(NH_3)_6]^{3+}$ is not?",
    "$[Co(en)_3]^{3+}$ is a tris-chelate with a three-blade-propeller geometry, having no plane or centre of symmetry — it forms $\\Lambda$ and $\\Delta$ enantiomers. $[Co(NH_3)_6]^{3+}$ is a regular octahedron with multiple symmetry planes — achiral.",
    ['needs_image']),
  c('Optical Isomerism', 'medium',
    "For $[M(AA)_2X_2]^{n+}$ type octahedral complexes, which geometrical isomer is optically active?",
    "The cis-isomer is chiral (no plane of symmetry) and shows optical activity; the trans-isomer has a plane of symmetry containing the two X ligands and the $M(AA)_2$ frame, hence is optically inactive."),
  c('Optical Isomerism', 'medium',
    "Out of cis-$[CrCl_2(ox)_2]^{3-}$ and trans-$[CrCl_2(ox)_2]^{3-}$, which is chiral?",
    "Only the cis form is chiral (no symmetry plane). The trans form has a symmetry plane that contains both Cl's and bisects the two oxalato rings, making it optically inactive."),
  c('Optical Isomerism', 'medium',
    "How many optical isomers does tetrahedral $[M(abcd)]$ possess and why?",
    "Two. With four different ligands around a single metal centre, a tetrahedral complex is chiral (analogous to a carbon with four different substituents). Such complexes are rare because easy inversion often racemises them."),
  c('Optical Isomerism', 'medium',
    "Define dextro and laevo isomers in terms of polarised-light rotation.",
    "Dextrorotatory (d or +): rotates the plane of plane-polarised light clockwise (to the right) when viewed towards the source. Laevorotatory (l or $-$): rotates the plane anticlockwise (to the left). A 1:1 mixture is a racemate (optically inactive)."),
  c('Optical Isomerism', 'hard',
    "Which of the following are chiral: (i) trans-$[Pt(en)_2Cl_2]^{2+}$; (ii) cis-$[Pt(en)_2Cl_2]^{2+}$; (iii) $[Co(en)_3]^{3+}$; (iv) $[PtCl_4]^{2-}$?",
    "Only (ii) cis-$[Pt(en)_2Cl_2]^{2+}$ and (iii) $[Co(en)_3]^{3+}$. (i) trans has a symmetry plane. (iv) square-planar $[PtCl_4]^{2-}$ is highly symmetric and achiral."),

  // ============================================================
  // 11. Valence Bond Theory (VBT)
  // ============================================================
  c('Valence Bond Theory (VBT)', 'easy',
    "Complete the VBT table: hybridisation ↔ geometry for CN = 4, 5, 6.",
    "CN 4 — $sp^3$ (tetrahedral), $dsp^2$ (square planar); CN 5 — $sp^3d$ (trigonal bipyramidal); CN 6 — $d^2sp^3$ (inner orbital, octahedral) and $sp^3d^2$ (outer orbital, octahedral)."),
  c('Valence Bond Theory (VBT)', 'medium',
    "Define inner-orbital vs outer-orbital complexes in VBT language.",
    "Inner-orbital (low-spin): uses $(n-1)d$ orbitals for hybridisation (e.g. $d^2sp^3$). Typically formed with strong-field ligands that force pairing. Outer-orbital (high-spin): uses $nd$ orbitals (e.g. $sp^3d^2$). Formed with weak-field ligands; no pairing."),
  c('Valence Bond Theory (VBT)', 'medium',
    "State the spin-only magnetic moment formula and evaluate it for 0, 1, 2, 3, 4, 5 unpaired electrons.",
    "$\\mu = \\sqrt{n(n+2)}$ BM. $n=0 \\to 0$; $n=1 \\to 1.73$; $n=2 \\to 2.83$; $n=3 \\to 3.87$; $n=4 \\to 4.90$; $n=5 \\to 5.92$ BM."),
  c('Valence Bond Theory (VBT)', 'medium',
    "List the main limitations of Valence Bond Theory.",
    "(i) Makes many qualitative assumptions. (ii) No quantitative explanation of magnetic data. (iii) Cannot explain the colour of complexes (no excited-state treatment). (iv) No thermodynamic/kinetic stability predictions. (v) Cannot distinguish a priori between weak and strong ligands. (vi) Cannot always predict whether a 4-coordinate complex will be tetrahedral or square planar."),
  c('Valence Bond Theory (VBT)', 'medium',
    "Predict the hybridisation and geometry of $[MnBr_4]^{2-}$ given that its $\\mu_{so} = 5.9$ BM.",
    "$\\mu_{so} \\approx 5.9$ BM ⇒ 5 unpaired electrons. $Mn^{2+}$ is $3d^5$; five unpaired implies a high-spin configuration. The hybridisation is $sp^3$ and the geometry tetrahedral (square planar $dsp^2$ would require pairing, leaving only 1 unpaired)."),
  c('Valence Bond Theory (VBT)', 'medium',
    "For $[Ni(CN)_4]^{2-}$ give hybridisation, geometry, and magnetic behaviour with reasoning.",
    "$Ni^{2+}$ is $3d^8$. With strong-field $CN^-$, the two $3d$ electrons pair up, freeing one 3d orbital. Hybridisation $dsp^2$, square-planar geometry, diamagnetic (0 unpaired electrons)."),
  c('Valence Bond Theory (VBT)', 'medium',
    "Why is $[Ni(CO)_4]$ tetrahedral and diamagnetic while $[NiCl_4]^{2-}$ is tetrahedral and paramagnetic?",
    "In $[Ni(CO)_4]$ nickel is Ni(0), $3d^{10}4s^0$ — all paired; $sp^3$ tetrahedral, diamagnetic. In $[NiCl_4]^{2-}$ nickel is $Ni^{2+}$, $3d^8$; $Cl^-$ is weak-field and cannot force pairing — $sp^3$ tetrahedral but with 2 unpaired electrons, paramagnetic."),
  c('Valence Bond Theory (VBT)', 'hard',
    "Explain the VBT description of $[Co(NH_3)_6]^{3+}$ and $[CoF_6]^{3-}$, including hybridisation, spin state, and colour expectation.",
    "$Co^{3+}$ is $3d^6$. With $NH_3$ (strong field), electrons pair → $d^2sp^3$ (inner orbital), diamagnetic, low-spin, yellow-orange (large $\\Delta$). With $F^-$ (weak field), no pairing → $sp^3d^2$ (outer orbital), paramagnetic with 4 unpaired electrons, pale blue (small $\\Delta$)."),
  c('Valence Bond Theory (VBT)', 'hard',
    "Explain, with an orbital diagram logic, why $[Fe(CN)_6]^{3-}$ is weakly paramagnetic.",
    "$Fe^{3+}$ is $3d^5$. $CN^-$ (strong field) pairs four of the five d-electrons, leaving exactly one unpaired in a $t_{2g}$ orbital. Hybridisation $d^2sp^3$; $\\mu_{so} = \\sqrt{1\\cdot 3} = 1.73$ BM — a weakly paramagnetic, low-spin complex."),

  // ============================================================
  // 12. VBT — Example Complexes
  // ============================================================
  c('VBT — Example Complexes', 'medium',
    "Apply VBT to $[Cr(NH_3)_6]^{3+}$: hybridisation, spin, $\\mu$.",
    "$Cr^{3+}$: $3d^3$. Three unpaired electrons singly occupy $t_{2g}$ orbitals; two empty 3d orbitals are available. Hybridisation $d^2sp^3$ (inner orbital), paramagnetic; $\\mu_{so} = \\sqrt{3\\cdot 5} = 3.87$ BM."),
  c('VBT — Example Complexes', 'medium',
    "For $[MnCl_6]^{3-}$ and $[Mn(CN)_6]^{3-}$, give the spin state and magnetic moment.",
    "$Mn^{3+}$: $3d^4$. With Cl$^-$ (weak): high spin, 4 unpaired, $\\mu \\approx 4.9$ BM. With CN$^-$ (strong): low spin, 2 unpaired (one in $e_g$ promoted back, and pairing in $t_{2g}$), $\\mu \\approx 2.83$ BM."),
  c('VBT — Example Complexes', 'medium',
    "Show the VBT picture for $[PtCl_4]^{2-}$. Why is it diamagnetic?",
    "$Pt^{2+}$: $5d^8$. In the strong ligand field, all 8 d-electrons pair into four of the 5d orbitals, leaving one 5d empty. Hybridisation $dsp^2$ (using $5d$, $6s$, $6p_x$, $6p_y$); square planar, diamagnetic."),
  c('VBT — Example Complexes', 'medium',
    "Ni(II) dimethylglyoximate $[Ni(DMG)_2]$ — give geometry, hybridisation, magnetic nature, and the special feature of its structure.",
    "Square planar, $dsp^2$, diamagnetic ($Ni^{2+}$ is $3d^8$, paired). Two DMG ligands chelate Ni in trans fashion; two intramolecular H-bonds between the two DMG units form additional 6-membered pseudo-rings, giving the rosy-red $[Ni(DMG)_2]$ its characteristic stability used in qualitative analysis.",
    ['needs_image']),
  c('VBT — Example Complexes', 'medium',
    "Work out whether $[Fe(H_2O)_6]^{2+}$ is high-spin or low-spin. Give $\\mu_{so}$.",
    "$Fe^{2+}$: $3d^6$. $H_2O$ is a weak/moderate ligand (below the spin-pairing threshold for Fe^{2+}). High-spin, 4 unpaired, $\\mu_{so} = \\sqrt{4\\cdot 6} = 4.9$ BM. Hybridisation $sp^3d^2$, outer orbital, paramagnetic."),
  c('VBT — Example Complexes', 'medium',
    "$[Co(C_2O_4)_3]^{3-}$: is the complex inner or outer orbital? Explain.",
    "$Co^{3+}$: $3d^6$. Oxalate is just above $H_2O$ in the spectrochemical series and is strong enough (with $+3$ metal charge favouring pairing) to force low-spin. Inner orbital $d^2sp^3$ — diamagnetic (0 unpaired)."),
  c('VBT — Example Complexes', 'medium',
    "Predict the structure and $\\mu$ for $[Ni(NH_3)_6]^{2+}$.",
    "$Ni^{2+}$: $3d^8$. With $NH_3$ the complex is octahedral $sp^3d^2$ (outer orbital — 3d has only 1 vacancy, not 2). 2 unpaired electrons in $e_g$-analogue; $\\mu \\approx 2.83$ BM, paramagnetic."),
  c('VBT — Example Complexes', 'hard',
    "Why is $[NiCl_4]^{2-}$ tetrahedral but $[Ni(CN)_4]^{2-}$ square planar?",
    "Both are $Ni^{2+}$ ($3d^8$). Cl$^-$ is weak-field: no pairing, two unpaired in d-orbitals, $sp^3$ hybridisation ⇒ tetrahedral. CN$^-$ is strong-field: forces pairing, one 3d orbital freed, $dsp^2$ hybridisation ⇒ square planar."),

  // ============================================================
  // 13. Crystal Field Theory — Octahedral
  // ============================================================
  c('Crystal Field Theory — Octahedral', 'easy',
    "In an octahedral crystal field, how do the five $d$ orbitals split and which set has the higher energy?",
    "Splits into lower-energy $t_{2g}$ ($d_{xy}, d_{yz}, d_{zx}$) stabilised by $-\\frac{2}{5}\\Delta_o$ and higher-energy $e_g$ ($d_{x^2-y^2}, d_{z^2}$) destabilised by $+\\frac{3}{5}\\Delta_o$. The $e_g$ set is higher because these orbitals point directly at the six ligands along the axes.",
    ['needs_image']),
  c('Crystal Field Theory — Octahedral', 'medium',
    "Define crystal field splitting energy ($\\Delta_o$). What two factors determine its magnitude for a given metal?",
    "$\\Delta_o$ is the energy gap between $t_{2g}$ and $e_g$ sets in an octahedral complex. Magnitude depends on (i) nature and charge of the ligand (spectrochemical series) and (ii) oxidation state and identity of the metal (higher oxidation state and heavier transition series give larger $\\Delta_o$)."),
  c('Crystal Field Theory — Octahedral', 'medium',
    "State the condition in terms of $\\Delta_o$ and pairing energy P for a high-spin vs low-spin octahedral complex.",
    "If $\\Delta_o < P$: 4th electron occupies $e_g$ rather than pairing ⇒ weak field, high-spin. If $\\Delta_o > P$: 4th electron pairs in $t_{2g}$ ⇒ strong field, low-spin. For $d^1, d^2, d^3, d^8, d^9, d^{10}$ the distinction does not arise."),
  c('Crystal Field Theory — Octahedral', 'medium',
    "Calculate the CFSE (in $\\Delta_o$ units) for high-spin $d^5$ and low-spin $d^5$ octahedral configurations.",
    "High-spin $d^5$: $t_{2g}^3 e_g^2 \\Rightarrow 3(-\\tfrac{2}{5}) + 2(+\\tfrac{3}{5}) = 0 \\Delta_o$. Low-spin $d^5$: $t_{2g}^5 e_g^0 \\Rightarrow 5(-\\tfrac{2}{5}) = -2.0 \\Delta_o$ (plus 2P for the extra pairings)."),
  c('Crystal Field Theory — Octahedral', 'medium',
    "Write the ground-state $t_{2g}/e_g$ configurations and $\\mu_{so}$ for $[Fe(CN)_6]^{3-}$ and $[Fe(H_2O)_6]^{3+}$.",
    "$Fe^{3+}$ is $d^5$. $[Fe(CN)_6]^{3-}$: strong field, $t_{2g}^5 e_g^0$, 1 unpaired, $\\mu = 1.73$ BM. $[Fe(H_2O)_6]^{3+}$: weak field, $t_{2g}^3 e_g^2$, 5 unpaired, $\\mu = 5.92$ BM."),
  c('Crystal Field Theory — Octahedral', 'medium',
    "Give the configuration of $[CoF_6]^{3-}$ ($Co^{3+}$, $d^6$) in CFT terms and state its spin.",
    "$F^-$ is a weak-field ligand, $\\Delta_o < P$ ⇒ high-spin $d^6$: $t_{2g}^4 e_g^2$, four unpaired electrons, paramagnetic, $\\mu \\approx 4.9$ BM."),
  c('Crystal Field Theory — Octahedral', 'hard',
    "CFSE of $[CoCl_6]^{4-}$ is reported as 18,000 cm$^{-1}$. Estimate the CFSE of $[CoCl_4]^{2-}$.",
    "$\\Delta_t \\approx \\frac{4}{9} \\Delta_o$, so CFSE scales similarly: $\\frac{4}{9}\\times 18000 \\approx 8000$ cm$^{-1}$."),

  // ============================================================
  // 14. CFT — Tetrahedral & Spin State
  // ============================================================
  c('CFT — Tetrahedral & Spin State', 'easy',
    "How are d-orbitals split in a tetrahedral crystal field and what is the relation to octahedral splitting?",
    "The splitting is inverted: lower-energy $e$ set ($d_{x^2-y^2}, d_{z^2}$) and higher-energy $t_2$ set ($d_{xy}, d_{yz}, d_{zx}$). $\\Delta_t \\approx \\tfrac{4}{9}\\Delta_o$ (for same metal, ligand, M–L distance).",
    ['needs_image']),
  c('CFT — Tetrahedral & Spin State', 'medium',
    "Why are low-spin tetrahedral complexes rarely observed?",
    "$\\Delta_t \\approx \\tfrac{4}{9}\\Delta_o$ is usually much smaller than the pairing energy P. So $\\Delta_t < P$ nearly always, and electrons occupy higher levels singly before pairing — high-spin is the norm for tetrahedral."),
  c('CFT — Tetrahedral & Spin State', 'medium',
    "List the five limitations of Crystal Field Theory.",
    "(i) Treats M-L bond as purely ionic; ignores covalent character. (ii) Places anionic ligands (which should exert the strongest field on a point-charge model) low in the spectrochemical series — contrary to fact. (iii) Cannot explain nephelauxetic effect. (iv) No satisfactory explanation for π-bonding or synergic donation. (v) Quantitative predictions require adjustable parameters (10 Dq)."),
  c('CFT — Tetrahedral & Spin State', 'medium',
    "For a $d^7$ ion in octahedral field, compare CFSE of high-spin and low-spin configurations.",
    "High-spin $d^7$: $t_{2g}^5 e_g^2 \\Rightarrow 5(-\\tfrac{2}{5}) + 2(+\\tfrac{3}{5}) = -\\tfrac{4}{5}\\Delta_o$ ($-0.8\\Delta_o$). Low-spin $d^7$: $t_{2g}^6 e_g^1 \\Rightarrow 6(-\\tfrac{2}{5}) + 1(+\\tfrac{3}{5}) = -\\tfrac{9}{5}\\Delta_o$ ($-1.8\\Delta_o$, plus P for the extra pair)."),
  c('CFT — Tetrahedral & Spin State', 'medium',
    "Give an electronic explanation for why $Cu^{2+}$ hexaaqua is blue but $Zn^{2+}$ hexaaqua is colourless.",
    "$Cu^{2+}$ is $d^9$; the single $e_g$ hole allows a d–d transition (promotes an electron from $t_{2g}$ to $e_g$) absorbing in the red, giving a blue complementary colour. $Zn^{2+}$ is $d^{10}$ — no empty d-orbital available for a d–d transition — colourless."),
  c('CFT — Tetrahedral & Spin State', 'medium',
    "Why does the hexaaqua manganese(II) ion contain five unpaired electrons while hexacyanomanganate(II) has only one?",
    "$Mn^{2+}$ is $d^5$. $H_2O$ is weak-field: $\\Delta_o < P$, high-spin $t_{2g}^3 e_g^2$, 5 unpaired. $CN^-$ is strong-field: $\\Delta_o > P$, low-spin $t_{2g}^5 e_g^0$, 1 unpaired."),

  // ============================================================
  // 15. Spectrochemical Series & Colour
  // ============================================================
  c('Spectrochemical Series & Colour', 'easy',
    "Write the abbreviated spectrochemical series from weakest to strongest ligand.",
    "$I^- < Br^- < SCN^- < Cl^- < S^{2-} < F^- < OH^- < C_2O_4^{2-} < H_2O < NCS^- < EDTA^{4-} < NH_3 < en < CN^- < CO$."),
  c('Spectrochemical Series & Colour', 'medium',
    "Why is the colour of a complex complementary to the wavelength it absorbs?",
    "Visible white light contains all wavelengths. When a complex absorbs one wavelength (corresponding to $\\Delta_o$ for a d-d transition), the transmitted light is the white minus the absorbed colour — appearing as the complementary colour."),
  c('Spectrochemical Series & Colour', 'medium',
    "From the table: $[Ti(H_2O)_6]^{3+}$ absorbs ~498 nm (blue-green) and looks purple; $[Co(NH_3)_6]^{3+}$ absorbs ~475 nm (blue) and looks yellow-orange. Rank these two by $\\Delta_o$.",
    "Shorter absorption wavelength ⇒ higher energy ⇒ larger $\\Delta_o$. So $\\Delta_o([Co(NH_3)_6]^{3+}) > \\Delta_o([Ti(H_2O)_6]^{3+})$."),
  c('Spectrochemical Series & Colour', 'medium',
    "Arrange $[Co(NH_3)_6]^{3+}$, $[Co(CN)_6]^{3-}$, and $[Co(H_2O)_6]^{3+}$ in increasing $\\Delta_o$ and decreasing wavelength of maximum absorption.",
    "Increasing $\\Delta_o$: $[Co(H_2O)_6]^{3+} < [Co(NH_3)_6]^{3+} < [Co(CN)_6]^{3-}$. Therefore, decreasing $\\lambda_{abs}$ follows the same order (largest gap absorbs shortest wavelength): $[Co(H_2O)_6]^{3+} > [Co(NH_3)_6]^{3+} > [Co(CN)_6]^{3-}$."),
  c('Spectrochemical Series & Colour', 'medium',
    "Why is anhydrous $CuSO_4$ white while $CuSO_4\\cdot 5H_2O$ is blue?",
    "In anhydrous $CuSO_4$ no ligand surrounds $Cu^{2+}$ to cause crystal-field splitting — no d–d transition possible. In the pentahydrate, four $H_2O$ occupy the square plane of $Cu^{2+}$, splitting the d-orbitals and enabling a d–d absorption (orange-red), giving the complementary blue colour."),
  c('Spectrochemical Series & Colour', 'medium',
    "Describe the colour change as en is progressively added to $[Ni(H_2O)_6]^{2+}$.",
    "$[Ni(H_2O)_6]^{2+}$ is green. Successive substitution gives $[Ni(H_2O)_4(en)]^{2+}$ pale blue, $[Ni(H_2O)_2(en)_2]^{2+}$ blue-purple, and finally $[Ni(en)_3]^{2+}$ violet. The shift reflects increasing $\\Delta_o$ as $H_2O$ is replaced by the stronger-field en.",
    ['needs_image']),
  c('Spectrochemical Series & Colour', 'medium',
    "Why is $[Ti(H_2O)_6]^{3+}$ coloured while $[Sc(H_2O)_6]^{3+}$ is colourless?",
    "Ti$^{3+}$ is $3d^1$ — one d-electron can undergo a $t_{2g} \\to e_g$ d–d transition absorbing visible light. Sc$^{3+}$ is $3d^0$ — no d-electrons, no d–d transition possible, so colourless."),
  c('Spectrochemical Series & Colour', 'medium',
    "What is the origin of the intense violet colour of $KMnO_4$? Is it a d–d transition?",
    "No — $Mn^{7+}$ is $d^0$ so there are no d-electrons for a d–d transition. The intense colour arises from a ligand-to-metal charge-transfer (LMCT) transition (O$^{2-}$ $\\to$ $Mn^{7+}$), which is much more intense than a typical d–d absorption."),

  // ============================================================
  // 16. Magnetic Behaviour
  // ============================================================
  c('Magnetic Behaviour', 'easy',
    "Define paramagnetic and diamagnetic behaviour in terms of electronic configuration.",
    "Paramagnetic: has one or more unpaired electrons; is weakly attracted by a magnetic field. Diamagnetic: all electrons paired; is weakly repelled by a magnetic field."),
  c('Magnetic Behaviour', 'medium',
    "Compute the spin-only magnetic moment and predict the colour (coloured/colourless) for $[Fe(H_2O)_6]^{3+}$ and $[Co(CN)_6]^{3-}$.",
    "$[Fe(H_2O)_6]^{3+}$: $d^5$ high-spin, 5 unpaired, $\\mu = 5.92$ BM, coloured. $[Co(CN)_6]^{3-}$: $d^6$ low-spin, 0 unpaired, $\\mu = 0$ BM — coloured (d–d $t_{2g}\\to e_g$ possible) but diamagnetic."),
  c('Magnetic Behaviour', 'medium',
    "Of $[MnCl_6]^{3-}$, $[FeF_6]^{3-}$, $[CoF_6]^{3-}$, $[Mn(CN)_6]^{3-}$, $[Fe(CN)_6]^{3-}$ and $[Co(C_2O_4)_3]^{3-}$: give unpaired electron count for each.",
    "Weak-field hexahalides: $[MnCl_6]^{3-}$ ($d^4$ HS) = 4; $[FeF_6]^{3-}$ ($d^5$ HS) = 5; $[CoF_6]^{3-}$ ($d^6$ HS) = 4. Strong-field cyanides/oxalates: $[Mn(CN)_6]^{3-}$ ($d^4$ LS) = 2; $[Fe(CN)_6]^{3-}$ ($d^5$ LS) = 1; $[Co(C_2O_4)_3]^{3-}$ ($d^6$ LS) = 0."),
  c('Magnetic Behaviour', 'medium',
    "Why is VBT's magnetic prediction only qualitative?",
    "VBT counts unpaired electrons correctly but provides no quantitative expression for $\\Delta$, no temperature dependence of susceptibility, and cannot explain anomalies such as orbital contributions to $\\mu$ (T-states in Co(II), low-symmetry distortions) — CFT and LFT handle these."),
  c('Magnetic Behaviour', 'medium',
    "Why is $[Cr(NH_3)_6]^{3+}$ paramagnetic regardless of ligand field strength?",
    "$Cr^{3+}$ is $d^3$. Three electrons occupy the three $t_{2g}$ orbitals singly and there is no opportunity for pairing (Hund's rule). The configuration, hence $\\mu \\approx 3.87$ BM, is the same for weak- or strong-field ligands."),
  c('Magnetic Behaviour', 'medium',
    "Rank $[Cr(H_2O)_6]^{3+}$, $[Fe(H_2O)_6]^{2+}$, $[Zn(H_2O)_6]^{2+}$ in decreasing magnetic moment.",
    "$[Fe(H_2O)_6]^{2+}$ ($d^6$ HS, 4 unpaired, 4.9 BM) $>$ $[Cr(H_2O)_6]^{3+}$ ($d^3$, 3 unpaired, 3.87 BM) $>$ $[Zn(H_2O)_6]^{2+}$ ($d^{10}$, 0 unpaired, diamagnetic)."),
  c('Magnetic Behaviour', 'hard',
    "The observed magnetic moment of $[Ni(H_2O)_6]^{2+}$ is slightly higher than the spin-only value. Why?",
    "For $d^8$ in an octahedral field, some orbital angular momentum is 'quenched' by the ligand field but not entirely — a small orbital contribution adds to $\\mu_{so}$. Observed $\\mu \\approx 3.2$ BM vs $\\mu_{so} = 2.83$ BM."),

  // ============================================================
  // 17. Metal Carbonyls & Synergic Bonding
  // ============================================================
  c('Metal Carbonyls & Synergic Bonding', 'easy',
    "State the geometries and oxidation states of Ni, Fe, Cr in their common homoleptic carbonyls.",
    "$[Ni(CO)_4]$: tetrahedral, Ni(0), $sp^3$. $[Fe(CO)_5]$: trigonal bipyramidal, Fe(0), $dsp^3$. $[Cr(CO)_6]$: octahedral, Cr(0), $d^2sp^3$.",
    ['needs_image']),
  c('Metal Carbonyls & Synergic Bonding', 'medium',
    "Describe the two components of synergic bonding between a metal and CO.",
    "(i) $\\sigma$-donation: the CO lone pair on C donates into an empty hybrid orbital of the metal (M $\\leftarrow$ C). (ii) $\\pi$-back-donation: a filled metal $d$-orbital donates into the empty $\\pi^*$(CO) antibonding orbital (M $\\to$ C). The two reinforce each other, strengthening the M–C bond while weakening the C–O bond.",
    ['needs_image']),
  c('Metal Carbonyls & Synergic Bonding', 'medium',
    "What is the effect of synergic back-bonding on (i) C–O bond length, (ii) C–O stretching frequency?",
    "Back-bonding populates the $\\pi^*$(CO) antibonding orbital. (i) C–O bond lengthens (bond order decreases from 3 toward 2.5). (ii) $\\nu(C-O)$ IR stretch shifts to lower wavenumber (from ~2143 cm$^{-1}$ in free CO to ~2000 cm$^{-1}$ in many carbonyls)."),
  c('Metal Carbonyls & Synergic Bonding', 'medium',
    "Describe the polynuclear carbonyls $Mn_2(CO)_{10}$ and $Co_2(CO)_8$.",
    "$Mn_2(CO)_{10}$: two square-pyramidal Mn(CO)$_5$ fragments joined by an Mn–Mn bond; all 10 carbonyls are terminal. $Co_2(CO)_8$: in the solid, two Co(CO)$_3$ units bridged by two $\\mu$-CO groups plus a Co–Co bond; in solution the non-bridged isomer with a direct Co–Co bond also exists.",
    ['needs_image']),
  c('Metal Carbonyls & Synergic Bonding', 'medium',
    "Why are metals in homoleptic carbonyls typically in very low oxidation states (0 or $-1$)?",
    "CO is a weak $\\sigma$-donor but an excellent $\\pi$-acceptor. Efficient back-donation requires filled d-orbitals on the metal, i.e. electron-rich, low oxidation states. In higher oxidation states the d-orbitals are less populated and M $\\to \\pi^*$ back-donation is ineffective."),
  c('Metal Carbonyls & Synergic Bonding', 'medium',
    "Rank CO, $CN^-$ and $NO^+$ as $\\pi$-acceptors and justify.",
    "$NO^+ > CO > CN^-$. $NO^+$ is cationic with the lowest-lying empty $\\pi^*$, strongest $\\pi$-acceptor. CO is neutral, moderate. $CN^-$ is anionic, highest $\\pi^*$ energy, poorest $\\pi$-acceptor (but an excellent $\\sigma$-donor and hence still a very strong-field ligand in the spectrochemical series)."),
  c('Metal Carbonyls & Synergic Bonding', 'hard',
    "Predict the effect of replacing CO by a more electron-donating phosphine PR$_3$ in a series M(CO)$_{n-1}$(PR$_3$) on the remaining C–O stretch.",
    "PR$_3$ is a better $\\sigma$-donor than CO, making the metal more electron-rich. Back-donation into the remaining CO ligands strengthens, populating $\\pi^*$(CO) more, so remaining $\\nu(C-O)$ shifts to lower wavenumbers."),

  // ============================================================
  // 18. Stability Constants & Chelate Effect
  // ============================================================
  c('Stability Constants & Chelate Effect', 'easy',
    "Define stepwise ($K_n$) and overall ($\\beta_n$) formation constants.",
    "For a metal M binding ligands L one by one: $K_n = \\dfrac{[ML_n]}{[ML_{n-1}][L]}$ (stepwise). The overall $\\beta_n = \\dfrac{[ML_n]}{[M][L]^n}$. Relation: $\\beta_n = K_1 \\cdot K_2 \\cdot \\ldots \\cdot K_n$."),
  c('Stability Constants & Chelate Effect', 'medium',
    "For $Cu^{2+} + 4 NH_3 \\rightleftharpoons [Cu(NH_3)_4]^{2+}$: $\\log K_1, K_2, K_3, K_4 = 4.0, 3.2, 2.7, 2.0$. Find $\\log \\beta_4$ and comment on the stepwise trend.",
    "$\\log \\beta_4 = 4.0 + 3.2 + 2.7 + 2.0 = 11.9$, so $\\beta_4 \\approx 10^{11.9}$. The successive $K_n$ decrease because statistical factors and increasing steric/electrostatic repulsion reduce each additional binding constant."),
  c('Stability Constants & Chelate Effect', 'medium',
    "The overall formation constant for $[Cu(NH_3)_4]^{2+}$ is $\\beta_4 = 2.1\\times 10^{13}$. Calculate the instability (dissociation) constant.",
    "Instability constant $= 1/\\beta_4 = 1/(2.1\\times 10^{13}) \\approx 4.8\\times 10^{-14}$."),
  c('Stability Constants & Chelate Effect', 'medium',
    "List three factors that increase the stability constant of a complex.",
    "(i) Higher charge on the central metal ion. (ii) Smaller size of the metal ion (higher charge density). (iii) Stronger Lewis-basicity of the ligand, and crucially, chelation — polydentate/chelating ligands greatly enhance stability."),
  c('Stability Constants & Chelate Effect', 'medium',
    "Why is $[Cu(en)_2]^{2+}$ much more stable than $[Cu(NH_3)_4]^{2+}$ despite both having four Cu–N bonds?",
    "Chelate effect. Replacing four $NH_3$ by two en releases the metal from four monodentate ligands (4 particles) and binds two bidentate ligands (2 particles) — a gain in entropy. $\\Delta S > 0$ makes $\\Delta G$ more negative, raising $\\beta$."),
  c('Stability Constants & Chelate Effect', 'medium',
    "Rank $[Cu(NH_3)_4]^{2+}$, $[Cu(en)_2]^{2+}$, $[Cu(CN)_4]^{2-}$ in increasing $\\log \\beta$.",
    "$[Cu(NH_3)_4]^{2+}$ ($\\log \\beta \\approx 12$) $<$ $[Cu(en)_2]^{2+}$ ($\\log \\beta \\approx 20$) $<$ $[Cu(CN)_4]^{2-}$ ($\\log \\beta \\approx 27$). $CN^-$ is a much stronger $\\sigma$-donor and strong-field ligand."),
  c('Stability Constants & Chelate Effect', 'hard',
    "Why does $FeSO_4 + (NH_4)_2SO_4$ solution give tests for $Fe^{2+}$ but $CuSO_4 + NH_3$ solution does not give tests for $Cu^{2+}$?",
    "Mohr's salt ($FeSO_4\\cdot (NH_4)_2SO_4\\cdot 6H_2O$) is a double salt that dissociates fully, releasing free $Fe^{2+}$ — detected by $K_3[Fe(CN)_6]$. With $NH_3$, copper forms the deep-blue complex $[Cu(NH_3)_4]^{2+}$ with very high $\\beta_4$, so free $Cu^{2+}$ is essentially absent and does not give the usual $Cu^{2+}$ tests."),

  // ============================================================
  // 19. Applications & Bioinorganic
  // ============================================================
  c('Applications & Bioinorganic', 'easy',
    "Name the coordination compound at the centre of (i) chlorophyll, (ii) haemoglobin, (iii) vitamin $B_{12}$.",
    "(i) A porphyrin complex of $Mg^{2+}$. (ii) An iron porphyrin (haem) — Fe(II) bonded to the porphyrin ring and one axial histidine from the globin. (iii) A cobalt corrin ring — $Co^{3+}$ with a CN$^-$ axial ligand (cyanocobalamin)."),
  c('Applications & Bioinorganic', 'easy',
    "Why is EDTA used in the treatment of lead poisoning and how is it administered safely?",
    "$Pb^{2+}$ forms a very stable [Pb-EDTA]$^{2-}$ chelate that is water-soluble and excreted through urine. To avoid depleting body $Ca^{2+}$, the drug is administered as the calcium complex $[Ca(EDTA)]^{2-}$; the weaker Ca binding is displaced by the far stronger Pb binding."),
  c('Applications & Bioinorganic', 'medium',
    "Describe the cyanide (Mac Arthur–Forrest) process for gold extraction, including the role of the coordination complex.",
    "Crushed gold ore is leached with dilute NaCN in the presence of air: $4\\,Au + 8\\,CN^- + O_2 + 2\\,H_2O \\to 4\\,[Au(CN)_2]^- + 4\\,OH^-$. Gold is displaced from the soluble $[Au(CN)_2]^-$ by adding Zn: $2[Au(CN)_2]^- + Zn \\to [Zn(CN)_4]^{2-} + 2\\,Au$."),
  c('Applications & Bioinorganic', 'medium',
    "Explain how hypo ($Na_2S_2O_3$) fixes a photographic film using coordination chemistry.",
    "Undeveloped $AgBr$ on the film is removed by forming the soluble complex $[Ag(S_2O_3)_2]^{3-}$: $AgBr + 2\\,S_2O_3^{2-} \\to [Ag(S_2O_3)_2]^{3-} + Br^-$. This washes away unreduced silver halide and 'fixes' the image."),
  c('Applications & Bioinorganic', 'medium',
    "How is hardness of water estimated by complexometric titration?",
    "The sample is titrated against standard disodium EDTA at pH ~10 (ammonia buffer) using Eriochrome Black T (EBT) as indicator. EBT forms a wine-red complex with $Ca^{2+}/Mg^{2+}$; EDTA displaces it (free EBT is blue) at the end point. Total mmol of EDTA used equals total mmol of $Ca^{2+} + Mg^{2+}$."),
  c('Applications & Bioinorganic', 'medium',
    "Name Wilkinson's catalyst and state its main industrial use.",
    "$[(PPh_3)_3RhCl]$ — chloridotris(triphenylphosphine)rhodium(I). Used for the homogeneous hydrogenation of terminal and unhindered internal alkenes at room temperature and pressure."),
  c('Applications & Bioinorganic', 'medium',
    "Explain the Mond process for purification of nickel via a coordination compound.",
    "Impure Ni is heated with CO at ~60 °C to form volatile $[Ni(CO)_4]$: $Ni + 4\\,CO \\to [Ni(CO)_4]$. The carbonyl is separated from impurities and thermally decomposed at ~200 °C to give pure Ni: $[Ni(CO)_4] \\to Ni + 4\\,CO$."),
  c('Applications & Bioinorganic', 'medium',
    "State the biological role of carboxypeptidase A and carbonic anhydrase.",
    "Both are zinc metalloenzymes. Carboxypeptidase A hydrolyses C-terminal peptide bonds in proteins. Carbonic anhydrase catalyses the reversible hydration of $CO_2$ to $HCO_3^-$ in red blood cells; Zn$^{2+}$ polarises a bound water to make it a nucleophilic OH$^-$."),
  c('Applications & Bioinorganic', 'medium',
    "Why is DMG a selective reagent for Ni(II) in qualitative analysis?",
    "Ni(II) in ammoniacal solution reacts with two DMG molecules to give rosy-red square-planar $[Ni(DMG)_2]$, stabilised by two intramolecular H-bonds between oxime OH and O$^-$. The colour and insolubility in water are diagnostic; Pd(II) gives a similar yellow complex at low pH."),
  c('Applications & Bioinorganic', 'medium',
    "List three examples of coordination chemistry in industrial electroplating.",
    "(i) Silver plating uses $[Ag(CN)_2]^-$ rather than $AgNO_3$ — gives a smoother, more adherent coat. (ii) Gold plating uses $[Au(CN)_2]^-$. (iii) Copper plating on steel uses $[Cu(CN)_3]^{2-}$. The complex ensures slow, uniform deposition at low free $M^{n+}$ concentration."),
];

// ===================================================================
//  DOC BUILDER
// ===================================================================

function buildDocs() {
  const topicMap = new Map(TOPICS.map(t => [t.name, t.order]));
  for (const card of CARDS) {
    if (!topicMap.has(card.topic)) {
      throw new Error(`Unknown topic in card: "${card.topic}"`);
    }
  }
  const sortedCards = [...CARDS].sort((a, b) => {
    const ta = topicMap.get(a.topic);
    const tb = topicMap.get(b.topic);
    if (ta !== tb) return ta - tb;
    return 0;
  });

  const docs = sortedCards.map((card, i) => {
    const num = String(i + 1).padStart(3, '0');
    return {
      flashcard_id: `COORD-${num}`,
      _id: uuidv4(),
      chapter: CHAPTER,
      topic: { name: card.topic, order: topicMap.get(card.topic) },
      question: card.q.trim(),
      answer: card.a.trim(),
      metadata: {
        difficulty: card.difficulty,
        tags: ['bitsat', 'jee', 'ncert', ...card.tags],
        source: 'NCERT Class 12 Ch 9',
        class_num: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      deleted_at: null,
    };
  });
  return docs;
}

function lintCard(card) {
  const issues = [];
  const txt = card.question + '\n' + card.answer;
  if (txt.includes('$$')) issues.push('contains $$ (prohibited — use single $)');
  const dollars = (txt.match(/\$/g) || []).length;
  if (dollars % 2 !== 0) issues.push(`odd number of $ delimiters (${dollars})`);
  if (/\?\./.test(card.question)) issues.push('question has "?." — trailing period after ?');
  return issues;
}

// ===================================================================
//  MAIN
// ===================================================================

async function main() {
  const apply = process.argv.includes('--apply');
  const docs = buildDocs();

  let lintErrors = 0;
  for (const d of docs) {
    const issues = lintCard({ question: d.question, answer: d.answer });
    if (issues.length) {
      console.log(`LINT ${d.flashcard_id} [${d.topic.name}]: ${issues.join('; ')}`);
      lintErrors += issues.length;
    }
  }
  if (lintErrors > 0) {
    console.error(`\n✗ Lint failed with ${lintErrors} issues. Fix before applying.`);
    if (apply) process.exit(1);
  } else {
    console.log('✓ Lint clean — no LaTeX or formatting errors detected.');
  }

  const byTopic = {};
  for (const d of docs) {
    byTopic[d.topic.name] ??= 0;
    byTopic[d.topic.name]++;
  }

  console.log('\n--- Refined Coordination Compounds set ---');
  console.log(`Total cards: ${docs.length}`);
  console.log(`Topics: ${Object.keys(byTopic).length}`);
  for (const t of TOPICS) {
    console.log(`  ${String(t.order).padStart(2, ' ')}. ${t.name}: ${byTopic[t.name] || 0} cards`);
  }

  const needsImage = docs.filter(d => d.metadata.tags.includes('needs_image'));
  console.log(`\nCards flagged "needs_image": ${needsImage.length}`);
  for (const d of needsImage) {
    console.log(`  - ${d.flashcard_id} [${d.topic.name}]: ${d.question.slice(0, 70)}...`);
  }

  const previewPath = path.join(__dirname, 'coordination_refined_preview.json');
  fs.writeFileSync(previewPath, JSON.stringify(docs, null, 2));
  console.log(`\nPreview JSON written to ${previewPath}`);

  if (!apply) {
    console.log('\nDRY RUN. Re-run with --apply to write to MongoDB.');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set in .env.local');
    process.exit(1);
  }

  console.log('\nConnecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  // Revive Date objects in the docs (already Date in memory but safe)
  for (const d of docs) {
    if (typeof d.metadata.created_at === 'string') d.metadata.created_at = new Date(d.metadata.created_at);
    if (typeof d.metadata.updated_at === 'string') d.metadata.updated_at = new Date(d.metadata.updated_at);
  }

  // Safety: soft-delete existing ch12_coordination active cards
  const softDeleteRes = await coll.updateMany(
    { 'chapter.id': 'ch12_coordination', deleted_at: null },
    { $set: { deleted_at: new Date() } }
  );
  console.log(`Soft-deleted ${softDeleteRes.modifiedCount} existing Coordination cards.`);

  // Duplicate check
  const incomingIds = docs.map(d => d.flashcard_id);
  const dup = await coll.find({ flashcard_id: { $in: incomingIds } }).project({ flashcard_id: 1 }).toArray();
  if (dup.length) {
    console.error(`ERROR: ${dup.length} incoming flashcard_ids already exist in DB:`, dup.slice(0, 5).map(d => d.flashcard_id));
    await mongoose.disconnect();
    process.exit(1);
  }

  // Raw driver insert — avoids Mongoose casting _id to ObjectId
  const insertRes = await coll.insertMany(docs, { ordered: true });
  console.log(`Inserted ${insertRes.insertedCount} refined Coordination cards.`);

  const active = await coll.countDocuments({ 'chapter.id': 'ch12_coordination', deleted_at: null });
  const deleted = await coll.countDocuments({ 'chapter.id': 'ch12_coordination', deleted_at: { $ne: null } });
  console.log(`Post-apply state: active=${active}, soft-deleted=${deleted}`);

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
