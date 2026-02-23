/**
 * Chapter Configuration - 36 Chapters for JEE/NEET Chemistry
 * Maps chapter IDs to short prefixes for clean question IDs
 */

export interface ChapterConfig {
  id: string;           // Full chapter ID (e.g., "chapter_atomic_structure")
  prefix: string;       // Short prefix for IDs (e.g., "atom")
  name: string;         // Display name
  branch: 'physical' | 'inorganic' | 'organic';
  class: 11 | 12;
  order: number;        // Sequence in curriculum
}

// 36 Chapters - Class 11 and 12 Chemistry
export const CHAPTERS: ChapterConfig[] = [
  // Class 11 - Physical Chemistry (5)
  { id: 'chapter_some_basic_concepts', prefix: 'mole', name: 'Some Basic Concepts of Chemistry', branch: 'physical', class: 11, order: 1 },
  { id: 'chapter_structure_of_atom', prefix: 'atom', name: 'Structure of Atom', branch: 'physical', class: 11, order: 2 },
  { id: 'chapter_states_of_matter', prefix: 'gas', name: 'States of Matter', branch: 'physical', class: 11, order: 6 },
  { id: 'chapter_thermodynamics', prefix: 'thermo', name: 'Thermodynamics', branch: 'physical', class: 11, order: 10 },
  { id: 'chapter_equilibrium', prefix: 'equil', name: 'Equilibrium', branch: 'physical', class: 11, order: 11 },
  
  // Class 11 - Inorganic Chemistry (4)
  { id: 'chapter_classification_of_elements', prefix: 'periodic', name: 'Classification of Elements', branch: 'inorganic', class: 11, order: 3 },
  { id: 'chapter_chemical_bonding', prefix: 'bond', name: 'Chemical Bonding', branch: 'inorganic', class: 11, order: 4 },
  { id: 'chapter_hydrogen', prefix: 'h2', name: 'Hydrogen', branch: 'inorganic', class: 11, order: 7 },
  { id: 'chapter_s_block', prefix: 'sblock', name: 's-Block Elements', branch: 'inorganic', class: 11, order: 8 },
  { id: 'chapter_p_block_11', prefix: 'pblock11', name: 'p-Block Elements (Group 13-14)', branch: 'inorganic', class: 11, order: 9 },
  
  // Class 11 - Organic Chemistry (3)
  { id: 'chapter_organic_chemistry_basic', prefix: 'goc', name: 'Organic Chemistry - Basic Principles', branch: 'organic', class: 11, order: 5 },
  { id: 'chapter_hydrocarbons', prefix: 'hc', name: 'Hydrocarbons', branch: 'organic', class: 11, order: 12 },
  { id: 'chapter_environmental_chemistry', prefix: 'env', name: 'Environmental Chemistry', branch: 'organic', class: 11, order: 13 },
  
  // Class 12 - Physical Chemistry (7)
  { id: 'chapter_solutions', prefix: 'soln', name: 'Solutions', branch: 'physical', class: 12, order: 1 },
  { id: 'chapter_electrochemistry', prefix: 'electro', name: 'Electrochemistry', branch: 'physical', class: 12, order: 2 },
  { id: 'chapter_chemical_kinetics', prefix: 'kinetics', name: 'Chemical Kinetics', branch: 'physical', class: 12, order: 3 },
  { id: 'chapter_surface_chemistry', prefix: 'surface', name: 'Surface Chemistry', branch: 'physical', class: 12, order: 4 },
  { id: 'chapter_general_principles_processes', prefix: 'metallurgy', name: 'General Principles of Metallurgy', branch: 'physical', class: 12, order: 5 },
  { id: 'chapter_p_block_12', prefix: 'pblock15', name: 'p-Block Elements (Group 15-18)', branch: 'inorganic', class: 12, order: 6 },
  { id: 'chapter_d_f_block', prefix: 'dfblock', name: 'd and f Block Elements', branch: 'inorganic', class: 12, order: 7 },
  { id: 'chapter_coordination_compounds', prefix: 'coord', name: 'Coordination Compounds', branch: 'inorganic', class: 12, order: 8 },
  
  // Class 12 - Organic Chemistry (9)
  { id: 'chapter_haloalkanes_haloarenes', prefix: 'halo', name: 'Haloalkanes and Haloarenes', branch: 'organic', class: 12, order: 9 },
  { id: 'chapter_alcohols_phenols_ethers', prefix: 'alcohol', name: 'Alcohols, Phenols and Ethers', branch: 'organic', class: 12, order: 10 },
  { id: 'chapter_aldehydes_ketones', prefix: 'carbonyl', name: 'Aldehydes, Ketones and Carboxylic Acids', branch: 'organic', class: 12, order: 11 },
  { id: 'chapter_amines', prefix: 'amine', name: 'Amines', branch: 'organic', class: 12, order: 12 },
  { id: 'chapter_biomolecules', prefix: 'bio', name: 'Biomolecules', branch: 'organic', class: 12, order: 13 },
  { id: 'chapter_polymers', prefix: 'poly', name: 'Polymers', branch: 'organic', class: 12, order: 14 },
  { id: 'chapter_chemistry_everyday_life', prefix: 'daily', name: 'Chemistry in Everyday Life', branch: 'organic', class: 12, order: 15 },
  
  // Additional important chapters
  { id: 'chapter_salt_analysis', prefix: 'salt', name: 'Salt Analysis', branch: 'inorganic', class: 12, order: 99 },
  { id: 'chapter_stereochemistry', prefix: 'stereo', name: 'Stereochemistry', branch: 'organic', class: 12, order: 99 },
  { id: 'chapter_aromatic_compounds', prefix: 'aromatic', name: 'Aromatic Compounds', branch: 'organic', class: 12, order: 99 },
  { id: 'chapter_redox_reactions', prefix: 'redox', name: 'Redox Reactions', branch: 'physical', class: 11, order: 99 },
  { id: 'chapter_ionic_equilibrium', prefix: 'ion', name: 'Ionic Equilibrium', branch: 'physical', class: 11, order: 99 },
];

// Legacy chapter ID mappings for backwards compatibility
export const CHAPTER_ID_MAPPINGS: Record<string, string> = {
  // Old IDs → New standard IDs
  'chapter_basic_concepts_mole_concept': 'chapter_some_basic_concepts',
  'chapter_atomic_structure': 'chapter_structure_of_atom',
  'chapter_gaseous_state': 'chapter_states_of_matter',
  'chapter_chemical_equilibrium': 'chapter_equilibrium',
  'chapter_periodic_properties': 'chapter_classification_of_elements',
  'chapter_s_block_elements': 'chapter_s_block',
  'chapter_p_block_13_14': 'chapter_p_block_11',
  'chapter_p_block_15_18': 'chapter_p_block_12',
  'chapter_general_organic_chemistry': 'chapter_organic_chemistry_basic',
  'chapter_aldehydes_ketones_and_carboxylic_acids': 'chapter_aldehydes_ketones',
  'chapter_alcohols_phenols_and_ethers': 'chapter_alcohols_phenols_ethers',
  'chapter_d_and_f_block': 'chapter_d_f_block',
  'chapter_haloalkanes_and_haloarenes': 'chapter_haloalkanes_haloarenes',
  'chapter_chemistry_in_everyday_life': 'chapter_chemistry_everyday_life',
};

// Helper functions
export function getChapterById(id: string): ChapterConfig | undefined {
  // Check direct match
  let chapter = CHAPTERS.find(c => c.id === id);
  
  // Check legacy mapping
  if (!chapter && CHAPTER_ID_MAPPINGS[id]) {
    chapter = CHAPTERS.find(c => c.id === CHAPTER_ID_MAPPINGS[id]);
  }
  
  // Check by prefix
  if (!chapter) {
    chapter = CHAPTERS.find(c => c.prefix === id);
  }
  
  return chapter;
}

export function getChapterByPrefix(prefix: string): ChapterConfig | undefined {
  return CHAPTERS.find(c => c.prefix === prefix);
}

export function generateQuestionId(chapterId: string, index: number): string {
  const chapter = getChapterById(chapterId);
  const prefix = chapter?.prefix || chapterId.replace('chapter_', '').substring(0, 8);
  return `${prefix}_${String(index).padStart(3, '0')}`;
}

export function getStandardChapterId(id: string): string {
  return CHAPTER_ID_MAPPINGS[id] || id;
}

// PYQ File to chapter mappings for the parser
export const PYQ_FILE_MAPPINGS: Record<string, string> = {
  'Mole - pyq.md': 'chapter_some_basic_concepts',
  'Atomic Structure - PYQs.md': 'chapter_structure_of_atom',
  'Thermodynamics - PYQ.md': 'chapter_thermodynamics',
  'chem equilibrium - pyq.md': 'chapter_equilibrium',
};

// Export for use in other modules
export default CHAPTERS;
