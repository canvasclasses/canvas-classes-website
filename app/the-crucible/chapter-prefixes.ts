// Registry of Chapter Prefixes for Question IDs
// This file is the SOURCE OF TRUTH for generating public Question Codes (e.g. ATOM-101)

export const CHAPTER_PREFIXES: Record<string, string> = {
    // Physical Chemistry
    'chapter_atomic_structure': 'ATOM',
    'chapter_mole_concept': 'MOLE',
    'chapter_basic_concepts_mole_concept': 'MOLE',
    'chapter_gaseous_state': 'GAS',
    'chapter_thermodynamics': 'THERMO',
    'chapter_chemical_equilibrium': 'EQUIL',
    'chapter_ionic_equilibrium': 'IONIC',
    'chapter_redox_reactions': 'REDOX',
    'chapter_solid_state': 'SOLID',
    'chapter_solutions': 'SOL',
    'chapter_electrochemistry': 'ELECT',
    'chapter_chemical_kinetics': 'KINET',
    'chapter_surface_chemistry': 'SURF',

    // Inorganic Chemistry
    'chapter_periodic_properties': 'PERIODIC',
    'chapter_chemical_bonding': 'BOND',
    'chapter_hydrogen': 'HYDRO',
    'chapter_s_block': 'SBLOCK',
    'chapter_p_block_group_13_14': 'PBLOCK1',
    'chapter_p_block_12th': 'PBLOCK2',
    'chapter_d_f_block': 'DFBLOCK',
    'chapter_coordination_compounds': 'COORD',
    'chapter_metallurgy': 'METAL',
    'chapter_salt_analysis': 'SALT',

    // Organic Chemistry
    'chapter_general_organic_chemistry': 'GOC',
    'chapter_isomerism': 'ISOM',
    'chapter_hydrocarbons': 'HYDROC',
    'chapter_haloalkanes_and_haloarenes': 'RX',
    'chapter_alcohols_phenols_and_ethers': 'ROH',
    'chapter_aldehyde_ketone_carboxylic': 'CARB',
    'chapter_amines': 'AMINE',
    'chapter_biomolecules': 'BIO',
    'chapter_polymers': 'POLY',
    'chapter_chemistry_in_everyday_life': 'CHEMLYF',
    'chapter_stereochemistry': 'STEREO',
    'chapter_practical_organic_chemistry': 'POC',

    // Fallback or Generic
    'chapter_physics_basic_math': 'MATH',
    'default': 'GEN'
};

export function getPrefixForChapter(chapterId: string): string {
    return CHAPTER_PREFIXES[chapterId] || 'GEN'; // Default to GEN if unknown
}
