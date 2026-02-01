// Mapping between Lecture Slugs and NCERT Chapter Names
// Keys are the slugs from the lecture URL/Data
// Values are the exact "chapter" field string in the NCERT CSV/API

export const ncertChapterMapping: Record<string, string> = {
    // Class 11
    'mole-concept': 'Some Basic Concepts of Chemistry',
    'atomic-structure': 'Structure of Atom',
    'periodic-properties': 'Classification of Elements and Periodicity in Properties',
    'chemical-bonding': 'Chemical Bonding and Molecular Structure',
    'thermodynamics': 'Thermodynamics',
    'equilibrium': 'Equilibrium',
    'redox-reactions': 'Redox Reactions',
    'redox': 'Redox Reactions',
    'hydrogen': 'Hydrogen', // Note: Hydrogen might not be in the grep list, checking if it's missing or just not in the partial data? It was not in the grep list. Deleted syllabus?
    's-block': 'The s-Block Elements', // Not in grep list
    'p-block': 'The p-Block Elements', // Not in grep list
    'goc': 'Organic Chemistry – Some Basic Principles and Techniques',
    'general-organic-chemistry': 'Organic Chemistry – Some Basic Principles and Techniques',
    'hydrocarbons': 'Hydrocarbons',
    'environmental-chemistry': 'Environmental Chemistry', // Not in grep list

    // Class 12
    'solutions': 'Solutions',
    'electrochemistry': 'Electrochemistry',
    'chemical-kinetics': 'Chemical Kinetics',
    'surface-chemistry': 'Surface Chemistry', // Not in grep list
    'd-and-f-block': 'The d-and f-Block Elements',
    'coordination-compounds': 'Coordination Compounds',
    'haloalkanes-and-haloarenes': 'Haloalkanes and Haloarenes',
    'alcohols-phenols-ethers': 'Alcohols, Phenols and Ethers',
    'aldehydes-ketones-carboxylic-acids': 'Aldehydes, Ketones and Carboxylic Acids',
    'amines': 'Amines',
    'biomolecules': 'Biomolecules',
    'polymers': 'Polymers', // Not in grep list
    'chemistry-in-everyday-life': 'Chemistry in Everyday Life', // Not in grep list
};

export const getNcertChapterName = (chapterSlug: string): string | null => {
    return ncertChapterMapping[chapterSlug] || null;
};
