/**
 * Chapter Concept Taxonomy
 * Maps Chapter Names to specific Concept Tags (Primary Tags).
 * Used to filter the "Primary Tag" dropdown in the Admin Panel.
 */

export interface ConceptTag {
    id: string;
    name: string;
}

// Fallback tags if no chapter is selected or not found
export const GENERIC_TAGS: ConceptTag[] = [
    { id: 'TAG_SKILL_CALCULATION', name: 'Calculation Intensive' },
    { id: 'TAG_SKILL_CONCEPTUAL', name: 'Conceptual Understanding' },
    { id: 'TAG_SKILL_VISUAL', name: 'Data/Graph Analysis' },
    { id: 'TAG_MISC', name: 'Miscellaneous' }
];

// Mapping of Chapter Name -> Concept Tags
export const CHAPTER_CONCEPT_MAP: Record<string, ConceptTag[]> = {
    // Physical Chemistry
    "Some Basic Concepts of Chemistry": [
        { id: 'TAG_MOLE_BASICS', name: 'Mole Basics (Mass/Vol/Part)' },
        { id: 'TAG_MOLE_STOICHIOMETRY', name: 'Stoichiometry & Analysis' },
        { id: 'TAG_MOLE_LIMITING_REAGENT', name: 'Limiting Reagent' },
        { id: 'TAG_MOLE_CONCENTRATIONS', name: 'Concentration Terms (M, m, X)' },
        { id: 'TAG_MOLE_EQUIVALENT', name: 'Equivalent Concept & n-factor' },
        { id: 'TAG_MOLE_TITRATIONS', name: 'Titrations (Redox/Acid-Base)' },
        { id: 'TAG_MOLE_EMPIRICAL', name: 'Empirical/Molecular Formula' },
        { id: 'TAG_MOLE_EUDIOMETRY', name: 'Eudiometry (Gas Analysis)' }
    ],
    "Structure of Atom": [
        { id: 'TAG_ATOM_MODELS', name: 'Bohr Model & Transitions' },
        { id: 'TAG_ATOM_NUMBER', name: 'Quantum Numbers' },
        { id: 'TAG_ATOM_CONFIG', name: 'Electronic Configuration' },
        { id: 'TAG_ATOM_WAVE', name: 'De Broglie & Heisenberg' },
        { id: 'TAG_ATOM_PHOTOELECTRIC', name: 'Photoelectric Effect' },
        { id: 'TAG_ATOM_NODES', name: 'Nodes & Orbital Shapes' }
    ],
    "Chemical Bonding and Molecular Structure": [
        { id: 'TAG_BOND_IONIC', name: 'Ionic Bonding & Lattice Energy' },
        { id: 'TAG_BOND_VSEPR', name: 'VSEPR & Geometry' },
        { id: 'TAG_BOND_HYBRID', name: 'Hybridization' },
        { id: 'TAG_BOND_MOT', name: 'Molecular Orbital Theory (MOT)' },
        { id: 'TAG_BOND_DIPOLE', name: 'Dipole Moment & Polarity' },
        { id: 'TAG_BOND_FAJANS', name: 'Fajan\'s Rule & Covalent Character' },
        { id: 'TAG_BOND_H_BOND', name: 'Hydrogen Bonding' }
    ],
    "Thermodynamics": [
        { id: 'TAG_THERMO_FFL', name: 'First Law & Work/Heat' },
        { id: 'TAG_THERMO_ENTHALPY', name: 'Enthalpy (H) & Internal Energy (U)' },
        { id: 'TAG_THERMO_HESS', name: 'Thermochemistry & Hess Law' },
        { id: 'TAG_THERMO_ENTROPY', name: 'Entropy (S) & Second Law' },
        { id: 'TAG_THERMO_GIBBS', name: 'Gibbs Energy (G) & Spontaneity' },
        { id: 'TAG_THERMO_CYCLE', name: 'Carnot Cycle & Efficiency' }
    ],
    "Equilibrium": [
        { id: 'TAG_EQ_KC_KP', name: 'Kp, Kc & Reaction Quotient' },
        { id: 'TAG_EQ_LE_CHATELIER', name: 'Le Chatelier\'s Principle' },
        { id: 'TAG_EQ_PH', name: 'pH Calculation (Acids/Bases)' },
        { id: 'TAG_EQ_BUFFER', name: 'Buffer Solutions' },
        { id: 'TAG_EQ_SALT_HYDRO', name: 'Salt Hydrolysis' },
        { id: 'TAG_EQ_SOLUBILITY', name: 'Solubility Product (Ksp)' }
    ],
    "Electrochemistry": [
        { id: 'TAG_ELECTRO_NERNST', name: 'Nernst Equation & Cell Potential' },
        { id: 'TAG_ELECTRO_CONDUCTANCE', name: 'Conductance & Kohlrausch Law' },
        { id: 'TAG_ELECTRO_ELECTROLYSIS', name: 'Electrolysis & Faraday\'s Laws' },
        { id: 'TAG_ELECTRO_BATTERIES', name: 'Batteries & Fuel Cells' }
    ],
    "Chemical Kinetics": [
        { id: 'TAG_KINETICS_RATE', name: 'Rate Law & Order' },
        { id: 'TAG_KINETICS_INTEGRATED', name: 'Integrated Rate Equations' },
        { id: 'TAG_KINETICS_ARRHENIUS', name: 'Arrhenius Eq & Activation Energy' },
        { id: 'TAG_KINETICS_MECHANISM', name: 'Reaction Mechanisms' }
    ],
    "Solutions": [
        { id: 'TAG_SOLN_CONCENTRATION', name: 'Concentration Units' },
        { id: 'TAG_SOLN_HENRY', name: 'Henry\'s Law & Raoult\'s Law' },
        { id: 'TAG_SOLN_BP_FP', name: 'Elevation in BP / Depression in FP' },
        { id: 'TAG_SOLN_OSMOTIC', name: 'Osmotic Pressure' },
        { id: 'TAG_SOLN_VANT_HOFF', name: 'Van\'t Hoff Factor' }
    ],

    // Inorganic Chemistry
    "Classification of Elements and Periodicity in Properties": [
        { id: 'TAG_PERIODIC_RADIUS', name: 'Atomic/Ionic Radius' },
        { id: 'TAG_PERIODIC_IONIZATION', name: 'Ionization Enthalpy' },
        { id: 'TAG_PERIODIC_ELECTRON_GAIN', name: 'Electron Gain Enthalpy' },
        { id: 'TAG_PERIODIC_ELECTRONEG', name: 'Electronegativity & Acidic/Basic' }
    ],
    "Coordination Compounds": [
        { id: 'TAG_COORD_IUPAC', name: 'IUPAC Nomenclature' },
        { id: 'TAG_COORD_WERNER', name: 'Werner\'s Theory' },
        { id: 'TAG_COORD_ISOMERISM', name: 'Isomerism (Structural/Stereo)' },
        { id: 'TAG_COORD_VBT', name: 'Valence Bond Theory (VBT)' },
        { id: 'TAG_COORD_CFT', name: 'Crystal Field Theory (CFT)' },
        { id: 'TAG_COORD_COLORS', name: 'Color & Magnetic Properties' },
        { id: 'TAG_COORD_METAL_CARBONYLS', name: 'Metal Carbonyls & EAN' }
    ],
    "Salt Analysis": [
        { id: 'TAG_SALT_DRY', name: 'Dry Tests (Flame/Borax)' },
        { id: 'TAG_SALT_WET_ANION_1', name: 'Anions: Dil. H2SO4 Group' },
        { id: 'TAG_SALT_WET_ANION_2', name: 'Anions: Conc. H2SO4 Group' },
        { id: 'TAG_SALT_WET_ANION_3', name: 'Anions: Special Group (SO4, PO4)' },
        { id: 'TAG_SALT_WET_CATION_0', name: 'Cations: Zero Group (NH4+)' },
        { id: 'TAG_SALT_WET_CATION_1', name: 'Cations: Group I (Pb, Ag, Hg)' },
        { id: 'TAG_SALT_WET_CATION_2', name: 'Cations: Group II (Cu, As, etc)' },
        { id: 'TAG_SALT_WET_CATION_3', name: 'Cations: Group III (Fe, Al, Cr)' },
        { id: 'TAG_SALT_WET_CATION_4', name: 'Cations: Group IV (Zn, Mn, Ni, Co)' },
        { id: 'TAG_SALT_WET_CATION_5', name: 'Cations: Group V (Ba, Sr, Ca)' },
        { id: 'TAG_SALT_WET_CATION_6', name: 'Cations: Group VI (Mg)' }
    ],

    // Organic Chemistry
    "General Organic Chemistry": [
        { id: 'TAG_GOC_EFFECTS', name: 'Electronic Effects (I, R, H)' },
        { id: 'TAG_GOC_ACID_BASE', name: 'Acidity & Basicity' },
        { id: 'TAG_GOC_INTERMEDIATES', name: 'Intermediates (C+, C-, Radicals)' },
        { id: 'TAG_GOC_ISOMERISM_STR', name: 'Structural Isomerism' },
        { id: 'TAG_GOC_ISOMERISM_STEREO', name: 'Stereoisomerism (Geometrical/Optical)' },
        { id: 'TAG_GOC_PURIFICATION', name: 'Purification & Analysis (POC)' }
    ],
    "Hydrocarbons": [
        { id: 'TAG_HC_ALKANES', name: 'Alkanes (Wurtz, Halogenation)' },
        { id: 'TAG_HC_ALKENES', name: 'Alkenes (Prep & Electrophilic Addn)' },
        { id: 'TAG_HC_ALKYNES', name: 'Alkynes (Acidity & Rxns)' },
        { id: 'TAG_HC_AROMATIC', name: 'Aromaticity & Benzene Reactions' },
        { id: 'TAG_HC_EAS', name: 'Electrophilic Aromatic Substitution' }
    ],
    "Haloalkanes and Haloarenes": [
        { id: 'TAG_HALO_SN1_SN2', name: 'SN1 vs SN2 Mechanisms' },
        { id: 'TAG_HALO_E1_E2', name: 'E1 vs E2 Elimination' },
        { id: 'TAG_HALO_GRIGNARD', name: 'Grignard & Metals' },
        { id: 'TAG_HALO_ARENES', name: 'Nucleophilic Subst. in Arenes' }
    ],
    "Alcohols, Phenols and Ethers": [
        { id: 'TAG_OH_PREP', name: 'Preparation of Alcohols' },
        { id: 'TAG_OH_RXNS', name: 'Reactions (Oxidation, Dehydration)' },
        { id: 'TAG_PHENOL_REIMER', name: 'Phenol Specific (Reimer-Tiemann, etc)' },
        { id: 'TAG_ETHER_WILLIAMSON', name: 'Ethers & Williamson Synthesis' }
    ],
    "Aldehydes, Ketones and Carboxylic Acids": [
        { id: 'TAG_AK_NAM', name: 'Nucleophilic Addition Mechanism' },
        { id: 'TAG_AK_ALDOL', name: 'Aldol & Cannizzaro' },
        { id: 'TAG_AK_TESTS', name: 'Distinction Tests (Tollens, Fehling)' },
        { id: 'TAG_CARB_DERIV', name: 'Carboxylic Acid Derivatives' },
        { id: 'TAG_CARB_DECARB', name: 'Decarboxylation & HVZ' }
    ],
    "Amines": [
        { id: 'TAG_AMINES_BASICITY', name: 'Basicity of Amines' },
        { id: 'TAG_AMINES_HOFMANN', name: 'Hofmann Bromamide & Carbylamine' },
        { id: 'TAG_AMINES_DIAZO', name: 'Diazonium Salts' }
    ],
    "Biomolecules": [
        { id: 'TAG_BIO_CARBS', name: 'Carbohydrates & Glycosidic Link' },
        { id: 'TAG_BIO_AMINO_ACIDS', name: 'Proteins & Amino Acids' },
        { id: 'TAG_BIO_NUCLEIC', name: 'Nucleic Acids (DNA/RNA)' },
        { id: 'TAG_BIO_VITAMINS', name: 'Vitamins & Enzymes' }
    ]
};

// Flattened list of ALL tags for displaying names regardless of chapter context
export const ALL_TAGS = [
    ...Object.values(CHAPTER_CONCEPT_MAP).flat(),
    ...GENERIC_TAGS
];

// Helper to get tags for a chapter (with partial match support)
export function getTagsForChapter(chapterName: string): ConceptTag[] {
    if (!chapterName) return GENERIC_TAGS;

    // Direct match
    if (CHAPTER_CONCEPT_MAP[chapterName]) {
        return CHAPTER_CONCEPT_MAP[chapterName];
    }

    // Fuzzy match / Alias handling
    // e.g. "Mole Concept" might map to "Some Basic Concepts of Chemistry"
    const lower = chapterName.toLowerCase();

    if (lower.includes('mole') || lower.includes('basic concepts'))
        return CHAPTER_CONCEPT_MAP["Some Basic Concepts of Chemistry"];

    if (lower.includes('atom'))
        return CHAPTER_CONCEPT_MAP["Structure of Atom"];

    if (lower.includes('bonding'))
        return CHAPTER_CONCEPT_MAP["Chemical Bonding and Molecular Structure"];

    if (lower.includes('thermo'))
        return CHAPTER_CONCEPT_MAP["Thermodynamics"];

    if (lower.includes('equil'))
        return CHAPTER_CONCEPT_MAP["Equilibrium"];

    if (lower.includes('solu'))
        return CHAPTER_CONCEPT_MAP["Solutions"];

    if (lower.includes('kineti'))
        return CHAPTER_CONCEPT_MAP["Chemical Kinetics"];

    if (lower.includes('electro'))
        return CHAPTER_CONCEPT_MAP["Electrochemistry"];

    if (lower.includes('period') || lower.includes('classif'))
        return CHAPTER_CONCEPT_MAP["Classification of Elements and Periodicity in Properties"];

    if (lower.includes('coord'))
        return CHAPTER_CONCEPT_MAP["Coordination Compounds"];

    if (lower.includes('salt'))
        return CHAPTER_CONCEPT_MAP["Salt Analysis"];

    if (lower.includes('goc') || lower.includes('general organic'))
        return CHAPTER_CONCEPT_MAP["General Organic Chemistry"];

    if (lower.includes('hydro'))
        return CHAPTER_CONCEPT_MAP["Hydrocarbons"];

    if (lower.includes('halo'))
        return CHAPTER_CONCEPT_MAP["Haloalkanes and Haloarenes"];

    if (lower.includes('alcohol') || lower.includes('phenol'))
        return CHAPTER_CONCEPT_MAP["Alcohols, Phenols and Ethers"];

    if (lower.includes('aldehyde') || lower.includes('ketone'))
        return CHAPTER_CONCEPT_MAP["Aldehydes, Ketones and Carboxylic Acids"];

    if (lower.includes('amine'))
        return CHAPTER_CONCEPT_MAP["Amines"];

    if (lower.includes('bio'))
        return CHAPTER_CONCEPT_MAP["Biomolecules"];

    // Default return if no specific mapping found
    return GENERIC_TAGS;
}
