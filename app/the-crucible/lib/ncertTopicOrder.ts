// NCERT topic ordering for The Crucible browse mode.
//
// Each chapter's tag IDs are listed in the order they appear in the NCERT
// textbook for that chapter. Browse mode sorts questions by the position of
// their primary tag in this array, so a student studying a chapter sees
// questions in the same logical flow as the textbook.
//
// IMPORTANT: This is editorial NCERT-flow data, NOT a list of all tags. If a
// chapter has no entry here, browse mode falls back to display_id ordering
// (the previous behaviour). If a question's primary tag isn't in its chapter's
// order array, that question is sorted to the end of the chapter.
//
// Tag IDs match exactly with `metadata.tags[].tag_id` in MongoDB and with the
// taxonomy in app/crucible/admin/taxonomy/taxonomyData_from_csv.ts.

export const NCERT_TOPIC_ORDER: Record<string, string[]> = {
    // ─── Class 11 ─────────────────────────────────────────────────────────────

    // Ch 1: Some Basic Concepts (Mole Concept) — NCERT flow:
    // Laws of Chemical Combination → Mole Basics → Empirical/Molecular Formula
    // → Stoichiometry → Limiting Reagent → Concentration → Equivalent Concept
    // → Eudiometry. Equivalent and Eudiometry are JEE/NEET-only extensions.
    ch11_mole: [
        'tag_mole_1',  // Laws of Chemical Combination, Sig. Fig, Accuracy
        'tag_mole_7',  // Mole Basics (Mass/Vol/Part)
        'tag_mole_3',  // Empirical/Molecular Formula
        'tag_mole_8',  // Stoichiometry & Analysis
        'tag_mole_6',  // Limiting Reagent
        'tag_mole_2',  // Concentration Units & Solution Concepts
        'tag_mole_4',  // Equivalent Concept & n-factor
        'tag_mole_5',  // Eudiometry (Gas Analysis)
    ],

    // Ch 2: Structure of Atom — NCERT flow:
    // Subatomic particles → Thomson/Rutherford → EM radiation & Planck →
    // Photoelectric & BBR → Bohr → De Broglie/Heisenberg → Quantum mechanical
    // model → Wave function/probability → Quantum numbers/electronic config.
    // Multi-concept questions go last.
    ch11_atom: [
        'tag_atom_1',   // Sub-atomic Particles & Discovery
        'tag_atom_2',   // Atomic Models (Thomson, Rutherford)
        'tag_atom_4',   // EM Radiation & Planck's Quantum Theory
        'tag_atom_5',   // Photoelectric Effect & BBR
        'tag_atom_6',   // Bohr's Model & Hydrogen Spectrum
        'tag_atom_8',   // De-Broglie Theory & Uncertainty Principle
        'tag_atom_3',   // Quantum Mechanical Model of the Atom
        'tag_atom_9',   // Wave function & Probability Graphs
        'tag_atom_7',   // Quantum Numbers & Electronic Configuration
        'tag_atom_10',  // Multi Concept
    ],

    // Ch 3: Classification of Elements & Periodicity — NCERT flow:
    // Modern Periodic Law → Electronic Configuration (basis for trends) →
    // Atomic/Ionic Radii → IE/EA/EN → Other Trends → Valency/Diagonal →
    // Nature of Oxides (chemical periodicity ends the chapter).
    ch11_periodic: [
        'tag_periodic_1',  // Modern Periodic Law & IUPAC Nomenclature (Z > 100)
        'tag_periodic_7',  // Electronic Configuration of Atoms
        'tag_periodic_2',  // Atomic & Ionic Radii Trends
        'tag_periodic_3',  // Periodic Trends (I.E., E.A., E.N.)
        'tag_periodic_4',  // Other Periodic Trends
        'tag_periodic_6',  // Valency & Diagonal Relationship
        'tag_periodic_5',  // Nature of Oxides
    ],

    // Ch 4: Chemical Bonding — NCERT flow:
    // Kossel-Lewis (octet, formal charge) → Ionic Bond → Bond parameters &
    // resonance → Polarity/Dipole → Fajan's Rule → VSEPR → VBT/Hybridization
    // → MOT → Hydrogen Bonding. "Additional concepts" goes last.
    ch11_bonding: [
        'tag_bonding_2',   // Basics, Octet Rule, Formal Charge
        'tag_bonding_1',   // Ionic Bonding & Lattice Energy
        'tag_bonding_9',   // Molecular Properties (bond length/strength/angle) & Resonance
        'tag_bonding_3',   // Dipole Moment & Polarity
        'tag_bonding_4',   // Fajan's Rule & Covalent Character
        'tag_bonding_6',   // VSEPR & Geometry
        'tag_bonding_10',  // VBT and Hybridization
        'tag_bonding_8',   // Molecular Orbital Theory (MOT)
        'tag_bonding_5',   // Hydrogen Bonding & Intermolecular Forces
        'tag_bonding_7',   // Additional Concepts
    ],

    // Ch 5: Thermodynamics — NCERT flow:
    // Basic Terms → Work & Heat → First Law → Internal Energy & Enthalpy →
    // Calorimetry → Thermochemistry/Hess's Law → Entropy/Second Law →
    // Gibbs Free Energy. Multi-concept last.
    ch11_thermo: [
        'tag_thermo_1',   // Basic Terms and Definitions
        'tag_thermo_8',   // Work & Heat
        'tag_thermo_7',   // First Law and Internal Energy
        'tag_thermo_4',   // Internal Energy & Enthalpy change
        'tag_thermo_2',   // Calorimetry & Heat Capacity
        'tag_thermo_3',   // Thermochemistry & Hess's Law
        'tag_thermo_5',   // Entropy & Second Law
        'tag_thermo_6',   // Gibbs Free Energy & Spontaneity
        'tag_thermo_10',  // Multi Concept
    ],

    // Ch 6 (part 1): Chemical Equilibrium — NCERT flow:
    // Physical & Chemical Equilibrium intro → Law of Mass Action / Kp/Kc →
    // Calculation of Kp/Kc/Kx → Reaction Quotient → Le Chatelier's Principle.
    // Vapour density/dissociation is an applied/JEE-extension topic.
    ch11_chem_eq: [
        'tag_chem_eq_4',  // Physical & Chemical Equilibrium
        'tag_chem_eq_1',  // Law of Mass Action & Equilibrium Constants (Kp, Kc)
        'tag_chem_eq_3',  // Calculation of Kp, Kc, Kx
        'tag_chem_eq_6',  // Reaction Quotient & applications
        'tag_chem_eq_2',  // Le Chatelier's Principle
        'tag_chem_eq_5',  // Vapour Density & Degree of dissociation
    ],

    // Ch 6 (part 2): Ionic Equilibrium — NCERT flow:
    // Acid/Base theories (Arrhenius, B-L, Lewis, Ostwald) → Ionic Product of
    // water & pH → pH of acids/bases → Buffers → Salt Hydrolysis →
    // Hydrolysis & pH → Solubility Product → Titrations & Indicators.
    ch11_ionic_eq: [
        'tag_ionic_eq_7',  // Theories of Acid/Base & Ostwald Law
        'tag_ionic_eq_6',  // Ionic Product of water and pH scale
        'tag_ionic_eq_4',  // pH Calculation (Acids/Bases)
        'tag_ionic_eq_1',  // Buffer Solutions
        'tag_ionic_eq_2',  // Salt Hydrolysis
        'tag_ionic_eq_5',  // Hydrolysis and pH calculation
        'tag_ionic_eq_3',  // Solubility Product (Ksp)
        'tag_ionic_eq_8',  // Titrations and Indicators
    ],

    // Ch 7: Redox Reactions — NCERT flow:
    // Oxidation/Reduction definitions & Oxidation Number → Types of redox →
    // Balancing → Redox Titrations.
    ch11_redox: [
        'tag_redox_2',  // Oxidation, Reduction and Oxidation Number
        'tag_redox_4',  // Types of Redox Reactions
        'tag_redox_1',  // Balancing of Redox Reactions
        'tag_redox_3',  // Redox Titrations
    ],

    // Ch 11 (combined Boron + Carbon families): P Block (Class 11) — NCERT flow:
    // General Property Trends → Group 13 (Boron family + compounds) →
    // Group 14 (Carbon family + allotropes + Si compounds).
    ch11_pblock: [
        'tag_pblock11_1',  // Property Trends (general intro)
        'tag_pblock11_4',  // Properties & Reactions of Boron family
        'tag_pblock11_3',  // Compounds of Boron (B2H6, Borax, Boric acid)
        'tag_pblock11_5',  // Properties & Reactions of Carbon Family
        'tag_pblock11_2',  // Allotropes & Compounds of Carbon
        'tag_pblock11_6',  // Silicates, Silicones and Zeolites
    ],

    // Ch 12: GOC (Organic Chemistry: Basic Principles & Techniques) — NCERT flow:
    // Classification & IUPAC → Reactive species (electrophiles/nucleophiles) →
    // Reaction intermediates → Electronic effects (I, R, hyperconjugation) →
    // Acidity/Basicity → Aromaticity → Structural isomerism → Geometric →
    // Optical → Conformational → Special cases.
    ch11_goc: [
        'tag_goc_1',   // Classification & IUPAC Naming
        'tag_goc_5',   // Electrophiles, Nucleophiles & Basic Terms
        'tag_goc_4',   // Reaction Intermediates
        'tag_goc_2',   // Electronic Effects
        'tag_goc_3',   // Acidity & Basicity
        'tag_goc_10',  // Huckel's Rule & Aromaticity
        'tag_goc_6',   // Structural Isomerism & Tautomerism
        'tag_goc_7',   // Geometrical Isomerism
        'tag_goc_8',   // Optical Isomerism & Chirality
        'tag_goc_9',   // Conformational Isomerism
        'tag_goc_11',  // Allenes, Atropisomers & Spiro Compounds
    ],

    // Ch 13: Hydrocarbons — NCERT flow:
    // Alkanes → Alkenes (addition) → Alkene oxidation → Alkynes → Benzene
    // preparation/structure → Aromatic Substitution (SEAr/SNAr).
    ch11_hydrocarbon: [
        'tag_hydrocarbon_1',  // Preparation & Properties of Alkanes
        'tag_hydrocarbon_2',  // Preparation & Addition Reactions of Alkenes
        'tag_hydrocarbon_5',  // Oxidation Reactions of Alkenes
        'tag_hydrocarbon_3',  // Alkynes — Acidity & Reactions
        'tag_hydrocarbon_6',  // Preparation & Reactions of Benzene
        'tag_hydrocarbon_7',  // Aromatic Substitution SEAr & SNAr
    ],

    // Practical Organic Chemistry — flow follows the analytical workflow:
    // Purification → Element detection → Quantitative analysis → Functional
    // group tests in NCERT order (unsaturation → -OH → C=O/-COOH → -NH2).
    ch11_prac_org: [
        'tag_prac_org_1',  // Purification Methods
        'tag_prac_org_2',  // Detection of Elements (Lassaigne's Test)
        'tag_prac_org_3',  // Quantitative Analysis
        'tag_prac_org_4',  // Tests for Unsaturation
        'tag_prac_org_5',  // Tests for Hydroxyl Group
        'tag_prac_org_6',  // Tests for Carbonyl & Carboxyl Groups
        'tag_prac_org_7',  // Tests for Amines
    ],

    // ─── Class 12 ─────────────────────────────────────────────────────────────

    // Ch 1 (latest NCERT): Solutions — NCERT flow:
    // Types of solutions (Basics) → Concentration terms → Solubility/Henry's
    // Law → Raoult's Law → Vapour pressure & RLVP → BP elevation/FP depression
    // → Osmotic pressure & Van't Hoff factor (abnormal molar mass).
    ch12_solutions: [
        'tag_solutions_2',  // Basics & Definitions
        'tag_solutions_4',  // Concentration Terms
        'tag_solutions_7',  // Solubility & Henry's Law
        'tag_solutions_3',  // Raoult's Law (Ideal & Non-ideal soln)
        'tag_solutions_1',  // Vapour Pressure & RLVP
        'tag_solutions_5',  // Elevation in BP / Depression in FP
        'tag_solutions_6',  // Osmotic Pressure & Van't Hoff Factor
    ],

    // Ch 2 (latest NCERT): Electrochemistry — NCERT flow:
    // Galvanic cells → Electrochemical series → Nernst equation → Conductance
    // & Kohlrausch → Electrolysis & Faraday's Laws → Batteries/Fuel
    // cells/Corrosion. Multi-concept last.
    ch12_electrochem: [
        'tag_electrochem_4',  // Electrode Potential and Galvanic Cell
        'tag_electrochem_3',  // Electrochemical Series & its Applications
        'tag_electrochem_6',  // Nernst Equation & Latimer Diagram
        'tag_electrochem_2',  // Conductance & Kohlrausch Law
        'tag_electrochem_5',  // Electrolysis & Faraday's Laws
        'tag_electrochem_1',  // Batteries, Fuel Cells & Corrosion
        'tag_electrochem_7',  // Multi-Concept
    ],

    // Ch 3 (latest NCERT): Chemical Kinetics — NCERT flow:
    // Rate of reaction & factors → Rate law/order/molecularity → Integrated
    // rate equations (Zero order → First order) → Arrhenius/activation energy
    // → Mechanisms & catalysis → Complex reactions → Radioactive decay
    // (JEE/NEET extension).
    ch12_kinetics: [
        'tag_kinetics_5',  // Rate of Reactions and Factors affecting it
        'tag_kinetics_4',  // Rate Law, Order of Reaction, Molecularity
        'tag_kinetics_7',  // Zero Order Reactions
        'tag_kinetics_8',  // First Order Reactions & Special cases
        'tag_kinetics_1',  // Arrhenius Eq & Activation Energy
        'tag_kinetics_6',  // Reaction Mechanisms & Catalysis
        'tag_kinetics_2',  // Complex Reactions
        'tag_kinetics_3',  // Radioactive Decay
    ],

    // Ch 7 (latest NCERT): P-Block (Class 12) — NCERT flow:
    // General intro → Group 15 (N-family + N compounds + P compounds) →
    // Group 16 (O-family + S compounds) → Group 17 (Halogens + halides) →
    // Group 18 (Noble gases). Maintains group-by-group structure of NCERT.
    ch12_pblock: [
        'tag_pblock12_1',  // Properties of P-Block (general)
        'tag_pblock12_8',  // Properties of Nitrogen Family
        'tag_pblock12_3',  // Compounds of Nitrogen
        'tag_pblock12_4',  // Compounds of Phosphorus
        'tag_pblock12_9',  // Properties of Oxygen Family
        'tag_pblock12_5',  // Compounds of Sulphur
        'tag_pblock12_7',  // Properties of Halogens
        'tag_pblock12_2',  // Compounds of Halides
        'tag_pblock12_6',  // Noble gases and their Reactions
    ],

    // Ch 8 (latest NCERT): d & f Block — NCERT flow:
    // Electronic configuration → Physical properties → Atomic properties
    // (IE, oxidation states, SRP) → Magnetic & Color → Catalytic & oxides →
    // Reactions → Important compounds (KMnO4, K2Cr2O7) → f-block last.
    ch12_dblock: [
        'tag_dblock_2',  // Electronic Config. and Exceptions
        'tag_dblock_7',  // Physical Properties of Transition metals
        'tag_dblock_3',  // I.E., Oxidation states, SRP
        'tag_dblock_5',  // Magnetic properties & Colour
        'tag_dblock_6',  // Oxides, Catalytic Properties
        'tag_dblock_1',  // Reactions of Transition Metals
        'tag_dblock_4',  // Preparation & Properties of KMnO4 & K2Cr2O7
        'tag_dblock_8',  // Properties of F block elements
    ],

    // Ch 9 (latest NCERT): Coordination Compounds — NCERT flow (validated):
    // Werner's theory → Definitions/ligands → Nomenclature → Isomerism →
    // VBT → CFT → Color/Magnetic → Stability/Applications → Metal carbonyls
    // & EAN → Organometallics/Bioinorganic.
    ch12_coord: [
        'tag_coord_9',   // Werner's Theory
        'tag_coord_1',   // Basic Definitions & Ligands
        'tag_coord_4',   // IUPAC Nomenclature
        'tag_coord_5',   // Isomerism (Structural/Stereo)
        'tag_coord_8',   // Valence Bond Theory (VBT)
        'tag_coord_3',   // Crystal Field Theory (CFT)
        'tag_coord_2',   // Color & Magnetic Properties
        'tag_coord_7',   // Stability & Applications
        'tag_coord_6',   // Metal Carbonyls & EAN
        'tag_coord_10',  // Organometallics & Bioinorganic Applications
    ],

    // Ch 10 (latest NCERT): Haloalkanes & Haloarenes — NCERT flow:
    // Preparation → Physical Properties → Nucleophilicity/leaving group →
    // SN1/SN2 → SNi/NGP → E1/E2 → Substitution vs Elimination → Aryl halides.
    ch12_haloalkanes: [
        'tag_haloalkanes_2',  // Preparation of Haloalkanes
        'tag_haloalkanes_1',  // Physical Properties of Haloalkanes
        'tag_haloalkanes_3',  // Nucleophilicity, Basicity & Leaving Group Ability
        'tag_haloalkanes_4',  // SN1 & SN2 Mechanisms
        'tag_haloalkanes_5',  // SNi & Neighbouring Group Participation (NGP)
        'tag_haloalkanes_6',  // Elimination Reactions (E1 & E2)
        'tag_haloalkanes_7',  // Substitution vs Elimination — Selectivity
        'tag_haloalkanes_8',  // Aryl Halides & Their Reactions
    ],

    // Ch 11 (latest NCERT): Alcohols, Phenols & Ethers — NCERT flow:
    // Alcohol preparation → Other reactions of alcohols → Dehydration/Oxidation
    // → Phenol preparation/acidity → Phenol reactions (Reimer-Tiemann/Kolbe)
    // → SEAr of Phenols/Ethers → Ethers & Epoxides.
    ch12_alcohols: [
        'tag_alcohols_1',                    // Alcohols Preparation (Grignard, Reduction)
        'tag_alcohols_6',                    // Other Reactions of Alcohols
        'tag_alcohols_2',                    // Dehydration & Oxidation of Alcohols
        'tag_alcohols_3',                    // Phenols Preparation & Acidic Nature
        'tag_alcohols_4',                    // Phenol Reactions (Reimer-Tiemann, Kolbe etc)
        'tag_ch12_alcohols_1771659358099',   // SEAr Reactions of Phenols & Ethers
        'tag_alcohols_5',                    // Reactions of ethers, epoxides
    ],

    // Ch 12 (latest NCERT): Aldehydes, Ketones & Carboxylic Acids — NCERT flow:
    // Carbonyls first: Nucleophilic addition (core) → Grignard → Reduction/
    // Condensation → Oxidation/Reduction → α-carbon (enolate) reactions →
    // Tests → Aromatic carbonyls. Then carboxylic acids: Preparation → Name
    // reactions → Acid derivatives → Aromatic carboxylic acids.
    ch12_carbonyl: [
        'tag_aldehydes_6',                      // Nucleophilic Addition Reactions
        'tag_aldehydes_1',                      // Advanced Grignard Reactions
        'tag_aldehydes_3',                      // Reduction & Condensation Reactions
        'tag_aldehydes_7',                      // Oxidation & Reduction of Carbonyls
        'tag_aldehydes_2',                      // Enolate & α-Carbon Reactions
        'tag_aldehydes_5',                      // Chemical Tests for Carbonyls
        'tag_ch12_aldehydes_1771659373017',     // Aromatic Aldehydes & Ketones
        'tag_carboxylic_4',                     // Preparation of Carboxylic Acids
        'tag_carboxylic_3',                     // Carboxylic Acid Name Reactions
        'tag_carboxylic_1',                     // Acid Derivatives & Their Reactions
        'tag_ch12_carboxylic_1771659384907',    // Aromatic Carboxylic Acids
    ],

    // Ch 13 (latest NCERT): Amines — NCERT flow:
    // Preparation → Basicity → Aliphatic reactions/tests → Aromatic amines →
    // Diazonium salts (the chapter ends with diazonium chemistry).
    ch12_amines: [
        'tag_amines_5',                       // Amine Preparation Methods
        'tag_amines_3',                       // Basicity of Amines
        'tag_amines_1',                       // Aliphatic Amine Reactions & Tests
        'tag_ch12_amines_1771659399884',      // Aromatic Amines (Aniline & Nitrobenzene)
        'tag_amines_4',                       // Diazonium Salts & Coupling Reactions
    ],

    // Ch 14 (latest NCERT): Biomolecules — NCERT flow:
    // Carbohydrates (mono → di/poly) → Proteins/Amino acids → Vitamins/Enzymes
    // → Nucleic Acids. Tests are placed at the end as a synthesis topic.
    ch12_biomolecules: [
        'tag_biomolecules_1',  // Carbohydrates (Glucose Structure & Reactions)
        'tag_biomolecules_3',  // Di and Polysaccharides
        'tag_biomolecules_5',  // Proteins & Amino Acids
        'tag_biomolecules_6',  // Vitamins & Enzymes
        'tag_biomolecules_4',  // Nucleic Acids (DNA/RNA)
        'tag_biomolecules_2',  // Tests for Biomolecules
    ],

    // Salt Analysis — practical analytical workflow:
    // Solubility/colour observations → Dry tests → Anion analysis (Dil H2SO4
    // group → Conc H2SO4 group → Special) → Cation analysis in Group 0→VI
    // order (NH4+ first as it's tested independently from the filtrate, then
    // standard separation Group I → VI).
    ch12_salt: [
        'tag_salt_14',  // Solubility Rules & Precipitation Colors
        'tag_salt_13',  // Dry Tests (Flame/Borax)
        'tag_salt_1',   // Anion Analysis (general)
        'tag_salt_4',   // Anions: Dil. H2SO4 Group
        'tag_salt_3',   // Anions: Conc. H2SO4 Group
        'tag_salt_5',   // Anions: Special Group (SO4, PO4)
        'tag_salt_2',   // Cation Analysis (general)
        'tag_salt_12',  // Cations: Zero Group (NH4+)
        'tag_salt_6',   // Cations: Group I (Pb, Ag, Hg)
        'tag_salt_7',   // Cations: Group II (Cu, As, etc)
        'tag_salt_8',   // Cations: Group III (Fe, Al, Cr)
        'tag_salt_9',   // Cations: Group IV (Zn, Mn, Ni, Co)
        'tag_salt_10',  // Cations: Group V (Ba, Sr, Ca)
        'tag_salt_11',  // Cations: Group VI (Mg)
    ],

    // Practical Physical Chemistry — flow from foundation to applied techniques:
    ch12_prac_phys: [
        'tag_prac_phys_1',  // Laboratory Apparatus & Errors in Measurement
        'tag_prac_phys_2',  // Acid-Base Titration & Indicators
        'tag_prac_phys_3',  // Redox Titrations (KMnO4 / Oxalic Acid / Mohr's Salt)
        'tag_prac_phys_4',  // Iodometric vs Iodimetric Titrations
        'tag_prac_phys_5',  // Hardness of Water (EDTA Titration)
        'tag_prac_phys_6',  // Surface Chemistry Practicals
    ],
};

// Build a fast lookup map: chapter_id → (tag_id → sort_index).
// Memoised at module load so sort doesn't pay the indexOf cost per question.
const TAG_SORT_INDEX: Record<string, Record<string, number>> = (() => {
    const result: Record<string, Record<string, number>> = {};
    for (const [chapterId, tags] of Object.entries(NCERT_TOPIC_ORDER)) {
        result[chapterId] = {};
        tags.forEach((tagId, idx) => {
            result[chapterId][tagId] = idx;
        });
    }
    return result;
})();

// Returns the NCERT-flow sort index for a question's primary tag in its
// chapter. Lower index = earlier in the chapter. Returns Infinity when the
// chapter has no defined order, or when the question has no primary tag, or
// when the primary tag isn't in the chapter's order array — these questions
// fall to the end of the sorted list.
//
// Primary tag = tags[0]. The ingestion convention sets the most-relevant tag
// first; weight values are not consistently distinct across questions so we
// don't use them.
export function getTopicSortKey(
    chapterId: string,
    tags: Array<{ tag_id: string; weight: number }> | undefined,
): number {
    const chapterIndex = TAG_SORT_INDEX[chapterId];
    if (!chapterIndex) return Infinity;
    if (!tags || tags.length === 0) return Infinity;
    const primaryTagId = tags[0]?.tag_id;
    if (!primaryTagId) return Infinity;
    const idx = chapterIndex[primaryTagId];
    return idx === undefined ? Infinity : idx;
}

// Whether a chapter has a defined NCERT order. Used to decide between
// topic-sort vs. fall-back display_id sort.
export function hasNcertOrder(chapterId: string): boolean {
    return chapterId in NCERT_TOPIC_ORDER;
}
