// Mapping between Lecture Slugs and NCERT Chapter Names
// Keys are the slugs from the lecture URL/Data
// Values can be a single string OR an array of strings for combined chapters

export const ncertChapterMapping: Record<string, string | string[]> = {
    // Class 11
    'mole-concept': 'Some Basic Concepts of Chemistry',
    'atomic-structure': 'Structure of Atom',
    'periodic-properties': 'Classification of Elements and Periodicity in Properties',
    'chemical-bonding': 'Chemical Bonding and Molecular Structure',
    'thermodynamics': 'Thermodynamics',
    'equilibrium': 'Equilibrium',
    'redox-reactions': 'Redox Reactions',
    'redox': 'Redox Reactions',
    'hydrogen': 'Hydrogen',
    's-block': 'The s-Block Elements',
    'p-block': 'The p-Block Elements',
    'goc': 'Organic Chemistry – Some Basic Principles and Techniques',
    'general-organic-chemistry': 'Organic Chemistry – Some Basic Principles and Techniques',
    'hydrocarbons': 'Hydrocarbons',
    'environmental-chemistry': 'Environmental Chemistry',

    // Class 12
    'solutions': 'Solutions',
    'electrochemistry': 'Electrochemistry',
    'chemical-kinetics': 'Chemical Kinetics',
    'surface-chemistry': 'Surface Chemistry',
    'd-and-f-block': 'The d-and f-Block Elements',
    'coordination-compounds': 'Coordination Compounds',
    'haloalkanes-and-haloarenes': 'Haloalkanes and Haloarenes',
    'alcohols-phenols-ethers': 'Alcohols, Phenols and Ethers',
    'aldehydes-ketones-carboxylic-acids': 'Aldehydes, Ketones and Carboxylic Acids',
    'amines': 'Amines',
    'biomolecules': 'Biomolecules',
    'polymers': 'Polymers',
    'chemistry-in-everyday-life': 'Chemistry in Everyday Life',

    // COMBINED CHAPTERS: One lecture covering multiple NCERT chapters
    'haloalkanes-alcohols-ethers': ['Haloalkanes and Haloarenes', 'Alcohols, Phenols and Ethers'],
};

// Returns an array of NCERT chapter names for a given lecture slug
// This allows a single lecture to map to multiple NCERT chapters
export const getNcertChapterNames = (chapterSlug: string): string[] | null => {
    const mapping = ncertChapterMapping[chapterSlug];
    if (!mapping) return null;
    return Array.isArray(mapping) ? mapping : [mapping];
};

// Legacy function for backward compatibility
export const getNcertChapterName = (chapterSlug: string): string | null => {
    const names = getNcertChapterNames(chapterSlug);
    return names ? names[0] : null;
};
