// FLASHCARD TAXONOMY - Single Source of Truth
// This is separate from Crucible taxonomy (taxonomyData_from_csv.ts)
// Flashcards have their own chapter structure based on Google Sheets data

export interface FlashcardCategory {
  id: string;
  name: string;
  displayName: string;
  chapters: FlashcardChapter[];
}

export interface FlashcardChapter {
  id: string;
  name: string;
  displayName: string;
  category: string;
  topicCount: number;
  cardCount: number;
  topics: string[];
}

export const FLASHCARD_CATEGORIES: FlashcardCategory[] = [
  {
    id: 'physical_chemistry',
    name: 'Physical Chemistry',
    displayName: 'Physical Chemistry',
    chapters: [
      {
        id: 'fc_solutions',
        name: 'Solutions',
        displayName: 'Solutions',
        category: 'Physical Chemistry',
        topicCount: 8,
        cardCount: 76,
        topics: [
          'Classification of Solutions',
          'Concentration Terms',
          'Elevation in BP and Depression in FP',
          'Henry\'s Law',
          'Osmosis & Osmotic Pressure',
          'Raoult\'s Law',
          'Vapour Pressure',
          'Colligative Properties'
        ]
      },
      {
        id: 'fc_electrochemistry',
        name: 'Electrochemistry',
        displayName: 'Electrochemistry',
        category: 'Physical Chemistry',
        topicCount: 9,
        cardCount: 73,
        topics: [
          'Batteries',
          'Conductance of Solutions',
          'Corrosion',
          'Electrolysis & Faraday\'s Laws',
          'Fuel Cells',
          'Galvanic Cells',
          'Kohlrausch Law',
          'Nernst Equation',
          'Standard Electrode Potential'
        ]
      },
      {
        id: 'fc_chemical_kinetics',
        name: 'Chemical Kinetics',
        displayName: 'Chemical Kinetics',
        category: 'Physical Chemistry',
        topicCount: 7,
        cardCount: 60,
        topics: [
          'Arrhenius Equation',
          'Collision Theory',
          'Factors Influencing Rate',
          'First Order Kinetics',
          'Rate Law & Order of Reaction',
          'Temperature Dependence',
          'Zero Order Kinetics'
        ]
      },
      {
        id: 'fc_solid_state',
        name: 'Solid State',
        displayName: 'Solid State',
        category: 'Physical Chemistry',
        topicCount: 9,
        cardCount: 60,
        topics: [
          'Calculation',
          'Classification of Solids',
          'Defects',
          'Electrical Properties',
          'Magnetic Properties',
          'Crystal Structures',
          'Unit Cells',
          'Packing Efficiency',
          'Imperfections'
        ]
      },
      {
        id: 'fc_surface_chemistry',
        name: 'Surface Chemistry',
        displayName: 'Surface Chemistry',
        category: 'Physical Chemistry',
        topicCount: 10,
        cardCount: 60,
        topics: [
          'Adsorption',
          'Adsorption Isotherms',
          'Catalysis',
          'Coagulation',
          'Colloids',
          'Emulsions',
          'Freundlich Isotherm',
          'Langmuir Isotherm',
          'Micelles',
          'Tyndall Effect'
        ]
      },
      {
        id: 'fc_atomic_structure',
        name: 'Atomic Structure',
        displayName: 'Atomic Structure',
        category: 'Physical Chemistry',
        topicCount: 17,
        cardCount: 60,
        topics: [
          'Atomic Models',
          'Atomic Spectra',
          'Atomic Terms',
          'Bohr\'s Model',
          'Dual Nature',
          'Electronic Configuration',
          'Heisenberg Uncertainty',
          'Photoelectric Effect',
          'Quantum Numbers',
          'Schrodinger Equation'
        ]
      }
    ]
  },
  {
    id: 'organic_chemistry',
    name: 'Organic Chemistry',
    displayName: 'Organic Chemistry',
    chapters: [
      {
        id: 'fc_biomolecules',
        name: 'Biomolecules',
        displayName: 'Biomolecules',
        category: 'Organic Chemistry',
        topicCount: 6,
        cardCount: 101,
        topics: [
          'Carbohydrates',
          'Enzymes',
          'Nucleic Acids',
          'Proteins',
          'Tests for Proteins, Fats & carbohydrates',
          'Vitamins'
        ]
      },
      {
        id: 'fc_haloalkanes',
        name: 'Haloalkanes',
        displayName: 'Haloalkanes',
        category: 'Organic Chemistry',
        topicCount: 9,
        cardCount: 60,
        topics: [
          'Chemical Properties',
          'Classification',
          'Nomenclature',
          'Physical Properties',
          'Polyhalogen Compounds',
          'Preparation',
          'Reactions',
          'SN1 vs SN2',
          'Uses'
        ]
      },
      {
        id: 'fc_alcohols_phenols_ethers',
        name: 'Alcohols, Phenols & ethers',
        displayName: 'Alcohols, Phenols & Ethers',
        category: 'Organic Chemistry',
        topicCount: 14,
        cardCount: 60,
        topics: [
          'Acidity',
          'Chemical Reactions (Alcohols)',
          'Chemical Reactions (Phenols)',
          'Commercial Alcohols',
          'Distinction Tests',
          'Ethers',
          'Lucas Test',
          'Nomenclature',
          'Physical Properties',
          'Preparation'
        ]
      },
      {
        id: 'fc_stereochemistry',
        name: 'Stereochemistry',
        displayName: 'Stereochemistry',
        category: 'Organic Chemistry',
        topicCount: 7,
        cardCount: 99,
        topics: [
          'Chirality & Symmetry',
          'Configuration & Nomenclature',
          'Conformational Isomerism',
          'Geometrical Isomerism',
          'Optical Activity & Isomer Types',
          'R-S Nomenclature',
          'E-Z Nomenclature'
        ]
      },
      {
        id: 'fc_aldehydes_ketones_acids',
        name: 'Aldehydes, Ketones & Acids',
        displayName: 'Aldehydes, Ketones & Carboxylic Acids',
        category: 'Organic Chemistry',
        topicCount: 14,
        cardCount: 60,
        topics: [
          'Acidity',
          'Alpha-Hydrogen',
          'Carboxylic Acids',
          'Chemical Reactions',
          'Electrophilic Subst.',
          'Aldol Condensation',
          'Cannizzaro Reaction',
          'Clemmensen Reduction',
          'Haloform Reaction',
          'Hell-Volhard-Zelinsky'
        ]
      },
      {
        id: 'fc_amines',
        name: 'Amines',
        displayName: 'Amines',
        category: 'Organic Chemistry',
        topicCount: 11,
        cardCount: 109,
        topics: [
          'Basicity of Amines',
          'Chemical Reactions',
          'Diazonium Salts & Reactions',
          'Distinction',
          'Electrophilic Substitution',
          'Gabriel Phthalimide',
          'Hoffmann Bromamide',
          'Nomenclature',
          'Physical Properties',
          'Preparation',
          'Sandmeyer Reaction'
        ]
      },
      {
        id: 'fc_goc_poc',
        name: 'GOC and POC',
        displayName: 'General Organic Chemistry & Purification',
        category: 'Organic Chemistry',
        topicCount: 15,
        cardCount: 120,
        topics: [
          'Bonding',
          'Bonding & Shapes',
          'Chromatography',
          'Classification',
          'Electronic Effects',
          'Hyperconjugation',
          'Inductive Effect',
          'Mesomeric Effect',
          'Purification Methods',
          'Reaction Mechanisms'
        ]
      },
      {
        id: 'fc_organic_name_reactions',
        name: 'Organic Name Reaction',
        displayName: 'Organic Name Reactions',
        category: 'Organic Chemistry',
        topicCount: 2,
        cardCount: 34,
        topics: [
          'Class 11',
          'Class 12'
        ]
      }
    ]
  },
  {
    id: 'inorganic_chemistry',
    name: 'Inorganic Chemistry',
    displayName: 'Inorganic Chemistry',
    chapters: [
      {
        id: 'fc_d_f_block',
        name: 'D & F Block',
        displayName: 'D & F Block Elements',
        category: 'Inorganic Chemistry',
        topicCount: 10,
        cardCount: 65,
        topics: [
          'Chemical Properties of Transition Metals',
          'Complexes, Catalysts & Alloys',
          'Ionisation Enthalpy & Oxidation States',
          'Magnetic Properties & Colour',
          'Physical Properties',
          'Lanthanoids',
          'Actinoids',
          'Inner Transition Elements',
          'f-block Elements',
          'Transition Elements'
        ]
      },
      {
        id: 'fc_coordination_compounds',
        name: 'Coordination Compounds',
        displayName: 'Coordination Compounds',
        category: 'Inorganic Chemistry',
        topicCount: 10,
        cardCount: 70,
        topics: [
          'Applications of Complexes',
          'Classification of Ligands',
          'Colour & Electronic Config',
          'Crystal Field Theory (CFT)',
          'IUPAC Naming',
          'Isomerism',
          'Magnetic Properties',
          'Stability of Complexes',
          'Valence Bond Theory',
          'Werner\'s Theory'
        ]
      },
      {
        id: 'fc_p_block_15_18',
        name: 'P Block elements G15-18',
        displayName: 'P Block Elements (Group 15-18)',
        category: 'Inorganic Chemistry',
        topicCount: 4,
        cardCount: 122,
        topics: [
          'Group 15 Elements',
          'Group 16 Elements',
          'Group 17 Elements',
          'Group 18 Elements'
        ]
      },
      {
        id: 'fc_salt_analysis',
        name: 'Salt analysis',
        displayName: 'Salt Analysis',
        category: 'Inorganic Chemistry',
        topicCount: 17,
        cardCount: 100,
        topics: [
          'Anion Analysis (Conc H2SO4)',
          'Anion Analysis (Dilute H2SO4)',
          'Anion Analysis (Independent)',
          'Cation Analysis (Dry Test)',
          'Cation Analysis (Group 0)',
          'Cation Analysis (Group 1)',
          'Cation Analysis (Group 2)',
          'Cation Analysis (Group 3)',
          'Cation Analysis (Group 4)',
          'Cation Analysis (Group 5)'
        ]
      },
      {
        id: 'fc_metallurgy',
        name: 'Metallurgy',
        displayName: 'Metallurgy',
        category: 'Inorganic Chemistry',
        topicCount: 13,
        cardCount: 60,
        topics: [
          'Concentration',
          'Electrochemical',
          'Extraction of Cu',
          'Extraction of Fe',
          'Extraction of Low Grade Cu',
          'Extraction of Zn',
          'Froth Flotation',
          'Leaching',
          'Refining',
          'Roasting & Calcination'
        ]
      },
      {
        id: 'fc_important_ores',
        name: 'Important Ores',
        displayName: 'Important Ores',
        category: 'Inorganic Chemistry',
        topicCount: 9,
        cardCount: 60,
        topics: [
          'Ores - Aluminum (Al)',
          'Ores - Boron & Be',
          'Ores - Ca, Sr, Ba, Ra',
          'Ores - Copper (Cu)',
          'Ores - Iron (Fe)',
          'Ores - Lead (Pb)',
          'Ores - Magnesium (Mg)',
          'Ores - Sodium (Na)',
          'Ores - Zinc (Zn)'
        ]
      },
      {
        id: 'fc_important_alloys',
        name: 'Important Alloys',
        displayName: 'Important Alloys',
        category: 'Inorganic Chemistry',
        topicCount: 6,
        cardCount: 48,
        topics: [
          'Alloys - Aluminium',
          'Alloys - Copper',
          'Alloys - Iron/Steel',
          'Alloys - Magnesium',
          'Alloys - Special',
          'Alloys - Zinc'
        ]
      },
      {
        id: 'fc_thermal_decomposition',
        name: 'Thermal decomposition of salts',
        displayName: 'Thermal Decomposition of Salts',
        category: 'Inorganic Chemistry',
        topicCount: 12,
        cardCount: 27,
        topics: [
          'Bicarbonates',
          'Carbonates',
          'Chlorates',
          'Color Change',
          'Dichromates',
          'Hydroxides',
          'Nitrates',
          'Oxides',
          'Perchlorates',
          'Permanganates',
          'Sulfates',
          'Sulfites'
        ]
      },
      {
        id: 'fc_important_compounds',
        name: 'Important Compounds of Inorganic',
        displayName: 'Important Inorganic Compounds',
        category: 'Inorganic Chemistry',
        topicCount: 23,
        cardCount: 183,
        topics: [
          'Acids',
          'Alcohols',
          'Bases',
          'Borates',
          'Chlorides',
          'Gases',
          'Hydrides',
          'Hydroxides',
          'Nitrates',
          'Oxides',
          'Salts',
          'Sulfates',
          'Vitriols'
        ]
      },
      {
        id: 'fc_p_block_13_14',
        name: 'p-block Group 13 & 14',
        displayName: 'P Block Elements (Group 13 & 14)',
        category: 'Inorganic Chemistry',
        topicCount: 16,
        cardCount: 121,
        topics: [
          'Aluminium & its compounds',
          'Borax',
          'Carbon & its compounds',
          'Chemical Properties of G13',
          'Chemical Properties of G14',
          'Physical Properties of G13',
          'Physical Properties of G14',
          'Boron',
          'Silicon',
          'Germanium'
        ]
      },
      {
        id: 'fc_inorganic_trends',
        name: 'Most Important Inorganic Trends',
        displayName: 'Important Inorganic Trends',
        category: 'Inorganic Chemistry',
        topicCount: 7,
        cardCount: 100,
        topics: [
          'Acidity & Basicity',
          'Atomic & Periodic Properties',
          'Chemical Bonding',
          'Physical Properties',
          'Redox & Electrochemistry',
          'Stability Trends',
          'Reactivity Trends'
        ]
      }
    ]
  },
  {
    id: 'jee_pyq',
    name: 'JEE PYQ',
    displayName: 'JEE Previous Year Questions',
    chapters: [
      {
        id: 'fc_jee_main_2026',
        name: 'JEE Main 2026',
        displayName: 'JEE Main 2026',
        category: 'JEE PYQ',
        topicCount: 2,
        cardCount: 30,
        topics: [
          '21 Jan - Morning',
          'General'
        ]
      }
    ]
  }
];

// Helper functions
export function getAllFlashcardChapters(): FlashcardChapter[] {
  return FLASHCARD_CATEGORIES.flatMap(cat => cat.chapters);
}

export function getFlashcardChaptersByCategory(categoryName: string): FlashcardChapter[] {
  const category = FLASHCARD_CATEGORIES.find(cat => cat.name === categoryName);
  return category?.chapters || [];
}

export function getFlashcardChapterById(chapterId: string): FlashcardChapter | undefined {
  return getAllFlashcardChapters().find(ch => ch.id === chapterId);
}

export function getFlashcardChapterByName(chapterName: string): FlashcardChapter | undefined {
  return getAllFlashcardChapters().find(ch => ch.name === chapterName);
}

export function getTotalFlashcardCount(): number {
  return getAllFlashcardChapters().reduce((sum, ch) => sum + ch.cardCount, 0);
}

// Category helpers
export function getCategoryNames(): string[] {
  return FLASHCARD_CATEGORIES.map(cat => cat.name);
}

export function getCategoryById(categoryId: string): FlashcardCategory | undefined {
  return FLASHCARD_CATEGORIES.find(cat => cat.id === categoryId);
}
