---
description: Standard prompt template for question ingestion requests
---

# INGESTION REQUEST TEMPLATE

> Copy this template, fill in the CAPS fields, and paste it as your prompt to the agent.
> All chapter-specific constants are pre-filled — the agent needs zero lookup.

---

## TEMPLATE (copy from here)

```
INGESTION REQUEST
═══════════════════════════════════════════════════════

CHAPTER:        [CHAPTER NAME]
CHAPTER_ID:     [e.g. ch12_alcohols]
PREFIX:         [e.g. ALCO]
NEXT_ID_START:  [e.g. ALCO-179]  ← confirm via: node scripts/check_next_id.js

TAGS AVAILABLE:
  [tag_id_1] — [tag name]
  [tag_id_2] — [tag name]
  [tag_id_3] — [tag name]
  ... (copy from chapter block below)

MODE: [FULL / TEXT-ONLY]
  FULL      = extract text + generate solutions + map answer key
  TEXT-ONLY = extract text only, solution: null, no answer key mapping

ANSWER KEY: [ATTACHED / NOT ATTACHED]

QUESTIONS TO EXTRACT: Q[first] to Q[last] (total: [N])

SOURCE IMAGES: [N] images attached

BATCH SIZE: 7 questions per batch

═══════════════════════════════════════════════════════
INSTRUCTIONS FOR AGENT:
1. Run Phase 1 ONLY first (extraction). Do not write any scripts yet.
2. Output the EXTRACTION SUMMARY block.
3. Wait for my confirmation before starting Phase 2.
4. In Phase 2, write insertion scripts in batches of 7.
5. Run each batch and confirm insertion before proceeding to next.
═══════════════════════════════════════════════════════
```

---

## PRE-FILLED CHAPTER BLOCKS

Copy the relevant block into your TAGS AVAILABLE section.

### ch11_mole — Some Basic Concepts (Mole Concept) | PREFIX: MOLE
```
tag_mole_1 — Laws of Chemical Combination, Sig. Fig, Accuracy
tag_mole_2 — Concentration Terms (M, m, X)
tag_mole_3 — Empirical/Molecular Formula
tag_mole_4 — Equivalent Concept & n-factor
tag_mole_5 — Eudiometry (Gas Analysis)
tag_mole_6 — Limiting Reagent
tag_mole_7 — Mole Basics (Mass/Vol/Part)
tag_mole_8 — Stoichiometry & Analysis
```

### ch11_atom — Structure of Atom | PREFIX: ATOM
```
tag_atom_1 — Sub-atomic Particles & Discovery
tag_atom_2 — Atomic Models (Thomson, Rutherford)
tag_atom_3 — Quantum Mechanical Model of the Atom
tag_atom_4 — EM Radiation & Planck's Quantum Theory
tag_atom_5 — Photoelectric Effect & BBR
tag_atom_6 — Bohr's Model & Hydrogen Spectrum
tag_atom_7 — Quantum Numbers & Electronic Configuration
tag_atom_8 — De-Broglie Theory & Uncertainty Principle
tag_atom_9 — Wave function & Probability Graphs
tag_atom_10 — Multi Concept
```

### ch11_periodic — Classification of Elements | PREFIX: PERI
```
tag_periodic_1 — Modern Periodic Law & IUPAC Nomenclature (Z > 100)
tag_periodic_2 — Atomic & Ionic Radii Trends
tag_periodic_3 — Periodic Trends (I.E., E.A., E.N.)
tag_periodic_4 — Other Periodic Trends
tag_periodic_5 — Nature of Oxides
tag_periodic_6 — Valency & Diagonal Relationship
tag_periodic_7 — Multi-Concept
```

### ch11_bonding — Chemical Bonding | PREFIX: BOND
```
tag_bonding_1  — Ionic Bonding & Lattice Energy
tag_bonding_2  — Basics, Octet Rule, Formal Charge
tag_bonding_3  — Dipole Moment & Polarity
tag_bonding_4  — Fajan's Rule & Covalent Character
tag_bonding_5  — Hydrogen Bonding & Intermolecular Forces
tag_bonding_6  — VSEPR & Geometry
tag_bonding_7  — Misc. Concepts
tag_bonding_8  — Molecular Orbital Theory (MOT)
tag_bonding_9  — Molecular Properties (bond length, strength, angle) & Resonance
tag_bonding_10 — VBT and Hybridization
```

### ch11_thermo — Thermodynamics | PREFIX: THERMO
```
tag_thermo_1  — Basic Terms and Definitions
tag_thermo_2  — Calorimetry & Heat Capacity
tag_thermo_3  — Thermochemistry & Hess's Law
tag_thermo_4  — Internal Energy & Enthalpy change
tag_thermo_5  — Entropy & Second Law
tag_thermo_6  — Gibbs Free Energy & Spontaneity
tag_thermo_7  — First Law and Internal Energy
tag_thermo_8  — Work & Heat
tag_thermo_9  — Graphical Question
tag_thermo_10 — Multi Concept
```

### ch11_chem_eq — Chemical Equilibrium | PREFIX: CEQ
```
tag_chem_eq_1 — Law of Mass Action & Equilibrium Constants (Kp, Kc)
tag_chem_eq_2 — Le Chatelier's Principle
tag_chem_eq_3 — Calculation of Kp, Kc, Kx
tag_chem_eq_4 — Physical & Chemical Equilibrium
tag_chem_eq_5 — Vapour Density & Degree of dissociation
tag_chem_eq_6 — Reaction Quotient & applications
```

### ch11_ionic_eq — Ionic Equilibrium | PREFIX: IEQ
```
tag_ionic_eq_1 — Buffer Solutions
tag_ionic_eq_2 — Salt Hydrolysis
tag_ionic_eq_3 — Solubility Product (Ksp)
tag_ionic_eq_4 — pH Calculation (Acids/Bases)
tag_ionic_eq_5 — Hydrolysis and pH calculation
tag_ionic_eq_6 — Ionic Product of water and pH scale
tag_ionic_eq_7 — Theories of Acid/base & Ostwald Law
tag_ionic_eq_8 — Titrations and Indicators
```

### ch11_redox — Redox Reactions | PREFIX: RDX
```
tag_redox_1 — Balancing of Redox Reactions
tag_redox_2 — Oxidation, Reduction and Oxidation Number
tag_redox_3 — Redox Titrations
tag_redox_4 — Types of Redox Reactions
```

### ch11_pblock — P Block Class 11 | PREFIX: PB11
```
tag_pblock11_1 — Property Trends
tag_pblock11_2 — Allotropes & Compounds of Carbon
tag_pblock11_3 — Compounds of Boron (B2H6, Borax, Boric acid)
tag_pblock11_4 — Properties & Reactions of Boron family
tag_pblock11_5 — Properties & Reactions of Carbon Family
tag_pblock11_6 — Silicates, Silicones and Zeolites
```

### ch11_goc — GOC | PREFIX: GOC
```
tag_goc_1  — Classification & IUPAC Naming
tag_goc_2  — Acidity & Basicity
tag_goc_3  — Electronic Effects (Inductive, Resonance, Hyperconjugation)
tag_goc_4  — Huckel's Rule & Aromaticity
tag_goc_5  — Misc. Concepts
tag_goc_6  — Reaction Intermediates
tag_goc_7  — Structural Isomerism & Tautomerism
tag_goc_8  — Electrophiles, Nucleophiles & Basic Terms
tag_goc_9  — Stereoisomerism (Geometrical & Optical)
tag_goc_10 — Chirality and Optical Activity
tag_goc_11 — Enantiomers, Diastereomers & Meso Compounds
tag_goc_12 — Conformational Isomerism
tag_goc_13 — Conformations of Cycloalkanes
tag_goc_14 — Geometrical Isomerism (E/Z, Cis/Trans)
tag_goc_15 — Allenes, Atropisomers and Spiro Compounds
```

### ch11_hydrocarbon — Hydrocarbons | PREFIX: HC
```
tag_hydrocarbon_1  — Alkynes (Acidity & Rxns)
tag_hydrocarbon_2  — Electrophilic addition across C=C
tag_hydrocarbon_3  — Misc. Reactions of Hydrocarbons
tag_hydrocarbon_4  — Oxidation Reactions of Alkenes
tag_hydrocarbon_5  — Preparation & properties of benzene
tag_hydrocarbon_6  — Preparation Reactions of Alkanes
tag_hydrocarbon_7  — Preparation and Properties of Alkenes
tag_hydrocarbon_8  — Reactions of Alkanes
tag_hydrocarbon_9  — Reactions of Benzene & Derivatives
tag_hydrocarbon_10 — Multi-Concept
tag_ch11_hydrocarbon_1771659235901 — Electrophilic Aromatic Substitution (SEAr)
```

### ch11_prac_org — Practical Organic Chemistry | PREFIX: POC
```
tag_prac_org_1 — Purification Methods (Distillation, Chromatography, Sublimation)
tag_prac_org_2 — Detection of Elements (Lassaigne's Test: N, S, Halogens)
tag_prac_org_3 — Quantitative Analysis (Dumas, Kjeldahl, Carius Methods)
tag_prac_org_4 — Tests for Unsaturation (Bromine Water, Bayer's Reagent)
tag_prac_org_5 — Tests for Hydroxyl Group (Ceric Ammonium Nitrate, Lucas Test)
tag_prac_org_6 — Tests for Carbonyls & Carboxyls (2,4-DNP, Sodium Bicarbonate, Esterification)
tag_prac_org_7 — Tests for Amines (Hinsberg Test, Azo Dye Test, Carbylamine)
```

### ch12_solutions — Solutions | PREFIX: SOL
```
tag_solutions_1 — Vapour Pressure & RLVP
tag_solutions_2 — Basics & Definitions
tag_solutions_3 — Raoult's Law (Ideal & Non ideal soln)
tag_solutions_4 — Concentration Terms
tag_solutions_5 — Elevation in BP / Depression in FP
tag_solutions_6 — Osmotic Pressure & Van't Hoff Factor
tag_solutions_7 — Solubility & Henry's Law
```

### ch12_electrochem — Electrochemistry | PREFIX: EC
```
tag_electrochem_1 — Batteries, Fuel Cells & Corrosion
tag_electrochem_2 — Conductance & Kohlrausch Law
tag_electrochem_3 — Electrochemical Series & its Applications
tag_electrochem_4 — Electrode Potential and Galvanic Cell
tag_electrochem_5 — Electrolysis & Faraday's Laws
tag_electrochem_6 — Nernst Equation & Latimer Diagram
tag_electrochem_7 — Multi-Concept
```

### ch12_kinetics — Chemical Kinetics | PREFIX: CK
```
tag_kinetics_1 — Arrhenius Eq & Activation Energy
tag_kinetics_2 — Complex Reactions
tag_kinetics_3 — Radioactive Decay
tag_kinetics_4 — Rate Law, Order of Reaction, Molecularity
tag_kinetics_5 — Rate of Reactions and Factors affecting it
tag_kinetics_6 — Reaction Mechanisms & Catalysis
tag_kinetics_7 — Zero Order Reactions
tag_kinetics_8 — First Order Reactions & Special cases
```

### ch12_pblock — P Block Class 12 | PREFIX: PB12
```
tag_pblock12_1 — Properties of P-Block
tag_pblock12_2 — Compounds of Halides
tag_pblock12_3 — Compounds of Nitrogen
tag_pblock12_4 — Compounds of Phosphorus
tag_pblock12_5 — Compounds of Sulphur
tag_pblock12_6 — Noble gases and their Reactions
tag_pblock12_7 — Properties of Halogens
tag_pblock12_8 — Properties of Nitrogen Family
tag_pblock12_9 — Properties of Oxygen Family
```

### ch12_dblock — D & F Block | PREFIX: DNF
```
tag_dblock_1 — Reactions of Transition Metals
tag_dblock_2 — Electronic Config. and Exceptions
tag_dblock_3 — I.E., Oxidation states, SRP
tag_dblock_4 — Preparation & Properties of KMnO4 & K2Cr2O7
tag_dblock_5 — Magnetic properties & Colour
tag_dblock_6 — Oxides, Catalytic Properties
tag_dblock_7 — Physical Properties of Transition metals
tag_dblock_8 — Properties of F block elements
```

### ch12_coord — Coordination Compounds | PREFIX: CORD
```
tag_coord_1 — Basic Definitions & Ligands
tag_coord_2 — Color & Magnetic Properties
tag_coord_3 — Crystal Field Theory (CFT)
tag_coord_4 — IUPAC Nomenclature
tag_coord_5 — Isomerism (Structural/Stereo)
tag_coord_6 — Metal Carbonyls & EAN
tag_coord_7 — Stability & Applications
tag_coord_8 — Valence Bond Theory (VBT)
tag_coord_9 — Werner's Theory
```

### ch12_haloalkanes — Haloalkanes & Haloarenes | PREFIX: HALO
```
tag_haloalkanes_1 — Aryl Halides & Their Reactions
tag_haloalkanes_2 — Elimination Reactions
tag_haloalkanes_4 — Nucleophilicity, Basicity & Leaving Group
tag_haloalkanes_5 — Physical properties of Haloalkanes
tag_haloalkanes_6 — SN Reactions (SN1, SN2, SNi) & NGP
tag_haloalkanes_7 — Preparation (From Alcohols, Hydrocarbons)
tag_haloalkanes_8 — Elimination Reactions vs Substitution
tag_haloalkanes_9 — Multi-Concept
```

### ch12_alcohols — Alcohols, Phenols & Ethers | PREFIX: ALCO
```
tag_alcohols_1 — Alcohols Preparation (Grignard, Reduction)
tag_alcohols_2 — Dehydration & Oxidation of Alcohols
tag_alcohols_3 — Phenols Preparation & Acidic Nature
tag_alcohols_4 — Phenol Reactions (Reimer-Tiemann, Kolbe etc)
tag_alcohols_5 — Reactions of ethers, epoxides
tag_alcohols_6 — Other Reactions of Alcohols
tag_ch12_alcohols_1771659358099 — SEAr Reactions of Phenols & Ethers
```

### ch12_carbonyl — Aldehydes, Ketones & Carboxylic Acids | PREFIX: ALDO
```
tag_aldehydes_1 — Grignard Reagent
tag_aldehydes_2 — Name Reactions (Aldol, Cannizzaro, Perkins, Haloform, Claisen etc)
tag_aldehydes_3 — Other name reactions of carbonyl
tag_aldehydes_4 — Preparation reactions of carbonyl
tag_aldehydes_5 — Tests for carbonyl compounds (Tollen's, Fehling, Benedict etc)
tag_aldehydes_6 — Nucleophilic Addition Reactions
tag_aldehydes_7 — Oxidation & Reduction Reactions of Carbonyl
tag_ch12_aldehydes_1771659373017 — Reactions of Aromatic Aldehydes & Ketones
tag_carboxylic_1 — Acid Derivatives (Esters, Anhydrides, Amides)
tag_carboxylic_2 — Acidity Trends & Substituent Effects
tag_carboxylic_3 — Name Reactions (Decarboxylation, HVZ, Arndt Eistert etc.)
tag_carboxylic_4 — Preparation Methods
tag_ch12_carboxylic_1771659384907 — Reactions of Aromatic Acids & Derivatives
```

### ch12_amines — Amines | PREFIX: AMIN
```
tag_amines_1 — Reactions of Aliphatic Amines
tag_amines_2 — Tests for Amines (Hinsberg, Carbylamine, Hoffmann)
tag_amines_3 — Basic Character (Gaseous vs Aqueous Phase)
tag_amines_4 — Diazonium Salts & Coupling Reactions
tag_amines_5 — Gabriel Phthalimide, Hofmann Bromamide & Carbylamine
tag_ch12_amines_1771659399884 — Reactions of Nitrobenzene & Aniline
```

### ch12_biomolecules — Biomolecules | PREFIX: BIO
```
tag_biomolecules_1 — Carbohydrates (Glucose Structure & Reactions)
tag_biomolecules_2 — Tests for Biomolecules
tag_biomolecules_3 — Di and Polysaccharides
tag_biomolecules_4 — Nucleic Acids (DNA/RNA)
tag_biomolecules_5 — Proteins & Amino Acids
tag_biomolecules_6 — Vitamins & Enzymes
```

### ch12_salt — Salt Analysis | PREFIX: SALT
```
tag_salt_1  — Anion Analysis
tag_salt_2  — Cation Analysis
tag_salt_3  — Anions: Conc. H2SO4 Group
tag_salt_4  — Anions: Dil. H2SO4 Group
tag_salt_5  — Anions: Special Group (SO4, PO4)
tag_salt_6  — Cations: Group I (Pb, Ag, Hg)
tag_salt_7  — Cations: Group II (Cu, As, etc)
tag_salt_8  — Cations: Group III (Fe, Al, Cr)
tag_salt_9  — Cations: Group IV (Zn, Mn, Ni, Co)
tag_salt_10 — Cations: Group V (Ba, Sr, Ca)
tag_salt_11 — Cations: Group VI (Mg)
tag_salt_12 — Cations: Zero Group (NH4+)
tag_salt_13 — Dry Tests (Flame/Borax)
tag_salt_14 — Solubility Rules & Precipitation Colors
```

### ch12_prac_phys — Practical Physical Chemistry | PREFIX: PPC
```
tag_prac_phys_1 — Laboratory Apparatus & Errors in Measurement
tag_prac_phys_2 — Acid-Base Titration & Selection of Indicators
tag_prac_phys_3 — Redox Titrations (KMnO4 / Oxalic Acid / Mohr's Salt)
tag_prac_phys_4 — Iodometric vs Iodimetric Titrations (Starch Indicator)
tag_prac_phys_5 — Hardness of Water (EDTA Titration)
tag_prac_phys_6 — Surface Chemistry Practicals (Lyophilic/Lyophobic Sols & Dialysis)
```

---

## FILLED EXAMPLE (Alcohols, TEXT-ONLY, no answer key)

```
INGESTION REQUEST
═══════════════════════════════════════════════════════

CHAPTER:        Alcohols, Phenols & Ethers
CHAPTER_ID:     ch12_alcohols
PREFIX:         ALCO
NEXT_ID_START:  ALCO-179  ← confirmed via check_next_id.js

TAGS AVAILABLE:
  tag_alcohols_1 — Alcohols Preparation (Grignard, Reduction)
  tag_alcohols_2 — Dehydration & Oxidation of Alcohols
  tag_alcohols_3 — Phenols Preparation & Acidic Nature
  tag_alcohols_4 — Phenol Reactions (Reimer-Tiemann, Kolbe etc)
  tag_alcohols_5 — Reactions of ethers, epoxides
  tag_alcohols_6 — Other Reactions of Alcohols
  tag_ch12_alcohols_1771659358099 — SEAr Reactions of Phenols & Ethers

MODE: TEXT-ONLY
ANSWER KEY: NOT ATTACHED
QUESTIONS TO EXTRACT: Q149 to Q176 (total: 28)
SOURCE IMAGES: 4 images attached
BATCH SIZE: 7 questions per batch

═══════════════════════════════════════════════════════
INSTRUCTIONS FOR AGENT:
1. Run Phase 1 ONLY first (extraction). Do not write any scripts yet.
2. Output the EXTRACTION SUMMARY block.
3. Wait for my confirmation before starting Phase 2.
4. In Phase 2, write insertion scripts in batches of 7.
5. Run each batch and confirm insertion before proceeding to next.
═══════════════════════════════════════════════════════
```

---

## COMMON MISTAKES TO AVOID (hand this to collaborators)

| Mistake | What goes wrong | Correct behaviour |
|---------|-----------------|-------------------|
| Mixing Phase 1 and Phase 2 | Context overload → hallucinated questions | Always complete Phase 1 first, get confirmation, then Phase 2 |
| Skipping `check_next_id.js` | Duplicate or gap in display IDs | Always run the pre-flight check before writing the script |
| Batches > 8 questions | Script too long → LaTeX corruption | Keep batches to 6–8 max |
| Using `node -e "..."` | Shell escapes backslashes → broken LaTeX | Write `.js` file, run with `node scripts/file.js` |
| Using `$$...$$` | Renderer breaks | Only `$...$` |
| Using `\dfrac` | Oversized rendering | Only `\frac` |
| Interpreting organic structures | Wrong structures inserted | Use placeholder SVG URL, user uploads later |
| Inventing tag IDs | Wrong tags in DB | Copy tag_id exactly from chapter block above |
| Forgetting `deleted_at: null` | Questions invisible in app | Always include `deleted_at: null` |

---

**Version:** 1.0 | **Last Updated:** 2026-03-01
