/**
 * Question Analysis and Tagging Script
 * Assigns concept tags and question types to all questions in the database
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in .env.local');
    process.exit(1);
}

// Concept Tags organized by chapter - mapping taxonomy IDs to keywords
const CHAPTER_CONCEPT_MAP = {
    // Structure of Atom
    'chapter_structure_of_atom': [
        { id: 'TAG_ATOM_QUANTUM_NUMBERS', name: 'Quantum Numbers', keywords: ['quantum number', 'principal quantum', 'azimuthal', 'magnetic quantum', 'spin quantum', 'n l m s', 'orbital'] },
        { id: 'TAG_ATOM_ELECTRONIC_CONFIG', name: 'Electronic Configuration', keywords: ['electronic configuration', 'aufbau principle', 'hund rule', 'pauli exclusion', 'filling of orbitals'] },
        { id: 'TAG_ATOM_SPECTRA', name: 'Atomic Spectra', keywords: ['spectra', 'emission', 'absorption', 'balmer', 'lyman', 'paschen', 'wavelength', 'frequency'] },
        { id: 'TAG_ATOM_DEBROGLIE', name: 'de Broglie Hypothesis', keywords: ['de broglie', 'matter wave', 'wavelength', 'dual nature'] },
        { id: 'TAG_ATOM_HEISENBERG', name: 'Heisenberg Uncertainty', keywords: ['heisenberg', 'uncertainty principle', 'position momentum'] },
        { id: 'TAG_ATOM_RADIAL_NODES', name: 'Radial & Angular Nodes', keywords: ['node', 'radial node', 'angular node', 'nodal plane'] },
        { id: 'TAG_ATOM_ATOMIC_MODELS', name: 'Atomic Models', keywords: ['rutherford', 'bohr model', 'thomson', 'nuclear model'] },
    ],
    // Mole Concept
    'chapter_some_basic_concepts': [
        { id: 'TAG_MOLE_MOLE_CONCEPT', name: 'Mole Concept', keywords: ['mole', 'molar mass', 'molecular mass', 'gram atom', 'gram molecule', 'avogadro'] },
        { id: 'TAG_MOLE_EMP_FORMULA', name: 'Empirical & Molecular Formula', keywords: ['empirical formula', 'molecular formula', 'percentage composition'] },
        { id: 'TAG_MOLE_STOICHIOMETRY', name: 'Stoichiometry', keywords: ['stoichiometry', 'limiting reagent', 'excess reagent', 'yield'] },
        { id: 'TAG_MOLE_CONC_TERMS', name: 'Concentration Terms', keywords: ['molarity', 'molality', 'normality', 'mole fraction', 'ppm', 'percentage'] },
        { id: 'TAG_MOLE_REDOX_TITRATIONS', name: 'Redox Titrations', keywords: ['titration', 'equivalent', 'n-factor', 'redox'] },
    ],
    // Thermodynamics
    'chapter_thermodynamics': [
        { id: 'TAG_THERMO_FIRST_LAW', name: 'First Law of Thermodynamics', keywords: ['first law', 'internal energy', 'enthalpy', 'heat', 'work'] },
        { id: 'TAG_THERMO_HESS_LAW', name: "Hess's Law", keywords: ['hess law', 'enthalpy of reaction', 'formation', 'combustion'] },
        { id: 'TAG_THERMO_ENTROPY', name: 'Entropy', keywords: ['entropy', 'disorder', 'spontaneous', 'second law'] },
        { id: 'TAG_THERMO_GIBBS_FREE_ENERGY', name: 'Gibbs Free Energy', keywords: ['gibbs', 'free energy', 'spontaneity', 'equilibrium constant'] },
        { id: 'TAG_THERMO_BOND_ENTHALPY', name: 'Bond Enthalpy', keywords: ['bond energy', 'bond dissociation', 'enthalpy'] },
    ],
    // Equilibrium
    'chapter_equilibrium': [
        { id: 'TAG_EQUIL_KC_KP', name: 'Equilibrium Constant (Kc & Kp)', keywords: ['kc', 'kp', 'equilibrium constant', 'law of mass action'] },
        { id: 'TAG_EQUIL_LE_CHATELIER', name: "Le Chatelier's Principle", keywords: ['le chatelier', 'effect of concentration', 'effect of pressure', 'effect of temperature'] },
        { id: 'TAG_EQUIL_P_H', name: 'pH and pOH', keywords: ['ph', 'poh', 'acid dissociation', 'ka', 'kb', 'pk'] },
        { id: 'TAG_EQUIL_BUFFER', name: 'Buffer Solutions', keywords: ['buffer', 'henderson hasselbalch'] },
        { id: 'TAG_EQUIL_SOLUBILITY', name: 'Solubility Product', keywords: ['solubility product', 'ksp', 'solubility'] },
        { id: 'TAG_EQUIL_HYDROLYSIS', name: 'Salt Hydrolysis', keywords: ['hydrolysis', 'degree of hydrolysis'] },
    ],
    // Classification of Elements
    'chapter_classification_of_elements': [
        { id: 'TAG_PERIODIC_PERIODIC_TRENDS', name: 'Periodic Trends', keywords: ['atomic radius', 'ionic radius', 'ionization energy', 'electron affinity', 'electronegativity'] },
        { id: 'TAG_PERIODIC_EFF_NUC_CHARGE', name: 'Effective Nuclear Charge', keywords: ['effective nuclear charge', 'shielding', 'penetration'] },
        { id: 'TAG_PERIODIC_PERIODIC_TABLE', name: 'Periodic Table', keywords: ['periodic table', 'groups', 'periods', 'blocks', 's-block', 'p-block', 'd-block', 'f-block'] },
    ],
    // Chemical Bonding
    'chapter_chemical_bonding': [
        { id: 'TAG_BOND_VSEPR', name: 'VSEPR Theory', keywords: ['vsepr', 'molecular geometry', 'shape', 'bond angle', 'linear', 'tetrahedral'] },
        { id: 'TAG_BOND_HYBRIDIZATION', name: 'Hybridization', keywords: ['hybridization', 'sp3', 'sp2', 'sp', 'dsp2', 'd2sp3', 'sp3d'] },
        { id: 'TAG_BOND_MOT', name: 'Molecular Orbital Theory', keywords: ['molecular orbital', 'bonding', 'antibonding', 'mo diagram', 'bond order'] },
        { id: 'TAG_BOND_DIPOLE', name: 'Dipole Moment', keywords: ['dipole moment', 'polarity', 'percent ionic character'] },
        { id: 'TAG_BOND_HYDROGEN_BOND', name: 'Hydrogen Bonding', keywords: ['hydrogen bond', 'intermolecular', 'intramolecular', 'van der waals'] },
        { id: 'TAG_BOND_COVALENT_BOND', name: 'Covalent Bond', keywords: ['covalent bond', 'sigma bond', 'pi bond', 'coordinate bond'] },
        { id: 'TAG_BOND_IONIC_BOND', name: 'Ionic Bond', keywords: ['ionic bond', 'lattice energy', 'fajan rule'] },
    ],
    // Organic Chemistry Basic
    'chapter_organic_chemistry_basic': [
        { id: 'TAG_GOC_IUPAC_NOMENCLATURE', name: 'IUPAC Nomenclature', keywords: ['iupac', 'nomenclature', 'naming', 'common name'] },
        { id: 'TAG_GOC_INDUCTIVE_EFFECT', name: 'Inductive Effect', keywords: ['inductive effect', 'electronegativity', 'electron donating', 'electron withdrawing'] },
        { id: 'TAG_GOC_RESONANCE', name: 'Resonance', keywords: ['resonance', 'resonating structure', 'mesomeric effect'] },
        { id: 'TAG_GOC_HYPERCONJUGATION', name: 'Hyperconjugation', keywords: ['hyperconjugation', 'alpha hydrogen'] },
        { id: 'TAG_GOC_ISOMERISM', name: 'Isomerism', keywords: ['isomerism', 'structural isomer', 'geometrical isomer', 'optical isomer', 'tautomerism'] },
        { id: 'TAG_GOC_REACTION_MECHANISM', name: 'Reaction Mechanism', keywords: ['reaction mechanism', 'intermediate', 'transition state', 'carbocation', 'carbanion', 'free radical'] },
    ],
    // Hydrocarbons
    'chapter_hydrocarbons': [
        { id: 'TAG_HYDRO_ALKANES', name: 'Alkanes', keywords: ['alkane', 'saturated', 'methane', 'ethane', 'free radical substitution'] },
        { id: 'TAG_HYDRO_ALKENES', name: 'Alkenes', keywords: ['alkene', 'ethene', 'propene', 'addition', 'markovnikov', 'anti-markovnikov'] },
        { id: 'TAG_HYDRO_ALKYNES', name: 'Alkynes', keywords: ['alkyne', 'acetylene', 'ethyne', 'terminal alkyne'] },
        { id: 'TAG_HYDRO_AROMATIC', name: 'Aromatic Compounds', keywords: ['aromatic', 'benzene', 'huckel rule', 'aromaticity', 'resonance energy'] },
    ],
    // Solutions
    'chapter_solutions': [
        { id: 'TAG_SOLN_VAPOUR_PRESSURE', name: 'Vapour Pressure', keywords: ['vapour pressure', 'raoult law', 'dalton law'] },
        { id: 'TAG_SOLN_COLLIGATIVE', name: 'Colligative Properties', keywords: ['colligative', 'elevation in boiling point', 'depression in freezing point', 'osmotic pressure'] },
        { id: 'TAG_SOLN_AZETROPES', name: 'Azeotropes', keywords: ['azeotrope', 'minimum boiling', 'maximum boiling'] },
        { id: 'TAG_SOLN_VAN_HOFF_FACTOR', name: 'Van Hoff Factor', keywords: ['van hoff factor', 'degree of dissociation', 'association'] },
    ],
    // Electrochemistry
    'chapter_electrochemistry': [
        { id: 'TAG_ELECTRO_CELL_POTENTIAL', name: 'Cell Potential & Nernst Equation', keywords: ['cell potential', 'emf', 'nernst equation', 'electrode potential'] },
        { id: 'TAG_ELECTRO_GALVANIC_CELL', name: 'Galvanic Cell', keywords: ['galvanic cell', 'electrolytic cell', 'anode', 'cathode', 'salt bridge'] },
        { id: 'TAG_ELECTRO_ELECTROLYSIS', name: 'Electrolysis', keywords: ['electrolysis', 'faraday law', 'electrochemical cell'] },
        { id: 'TAG_ELECTRO_CONDUCTANCE', name: 'Conductance', keywords: ['conductance', 'conductivity', 'molar conductivity', 'kohlrausch law'] },
        { id: 'TAG_ELECTRO_NERNST_EQUATION', name: 'Nernst Equation & Applications', keywords: ['nernst', 'equilibrium constant', 'concentration cell'] },
    ],
    // Chemical Kinetics
    'chapter_chemical_kinetics': [
        { id: 'TAG_KINETICS_RATE_LAW', name: 'Rate Law', keywords: ['rate law', 'rate constant', 'order of reaction', 'molecularity'] },
        { id: 'TAG_KINETICS_INTEGRATED', name: 'Integrated Rate Laws', keywords: ['integrated rate', 'half life', 'first order', 'second order', 'zero order'] },
        { id: 'TAG_KINETICS_COLLISION', name: 'Collision Theory', keywords: ['collision theory', 'activation energy', 'arrhenius equation'] },
        { id: 'TAG_KINETICS_TEMPERATURE', name: 'Effect of Temperature', keywords: ['temperature effect', 'arrhenius', 'activation energy'] },
    ],
    // p-Block 11 (Group 13-14)
    'chapter_p_block_11': [
        { id: 'TAG_P_BORON_FAMILY', name: 'Boron Family (Group 13)', keywords: ['boron', 'aluminium', 'gallium', 'indium', 'thallium', 'borax', 'boric acid'] },
        { id: 'TAG_P_CARBON_FAMILY', name: 'Carbon Family (Group 14)', keywords: ['carbon', 'silicon', 'germanium', 'tin', 'lead', 'silicates', 'zeolites'] },
    ],
    // p-Block 12 (Group 15-18)
    'chapter_p_block_12': [
        { id: 'TAG_P_NITROGEN_FAMILY', name: 'Nitrogen Family (Group 15)', keywords: ['nitrogen', 'phosphorus', 'ammonia', 'nitric acid', 'phosphine'] },
        { id: 'TAG_P_OXYGEN_FAMILY', name: 'Oxygen Family (Group 16)', keywords: ['oxygen', 'sulphur', 'ozone', 'sulphuric acid', 'h2so4'] },
        { id: 'TAG_P_HALOGENS', name: 'Halogens (Group 17)', keywords: ['halogen', 'fluorine', 'chlorine', 'bromine', 'iodine', 'interhalogen'] },
        { id: 'TAG_P_NOBLE_GASES', name: 'Noble Gases (Group 18)', keywords: ['noble gas', 'helium', 'neon', 'argon', 'xenon', 'krypton', 'radon'] },
    ],
    // d & f Block
    'chapter_d_f_block': [
        { id: 'TAG_D_ELECTRONIC_CONFIG', name: 'Electronic Configuration', keywords: ['electronic configuration', 'transition element', 'lanthanide', 'actinide'] },
        { id: 'TAG_D_PROPERTIES', name: 'Properties of Transition Elements', keywords: ['transition metal', 'oxidation state', 'ionization energy', 'density'] },
        { id: 'TAG_D_COLOUR_MAGNETIC', name: 'Colour & Magnetic Properties', keywords: ['colour', 'magnetic', 'paramagnetic', 'diamagnetic', 'unpaired electron'] },
        { id: 'TAG_D_KMNO4_K2CR2O7', name: 'KMnO4 and K2Cr2O7', keywords: ['kmno4', 'k2cr2o7', 'potassium permanganate', 'potassium dichromate'] },
    ],
    // Coordination Compounds
    'chapter_coordination_compounds': [
        { id: 'TAG_COORD_WERNERS_THEORY', name: "Werner's Theory", keywords: ['werner theory', 'primary valency', 'secondary valency', 'coordination number'] },
        { id: 'TAG_COORD_NOMENCLATURE', name: 'Nomenclature', keywords: ['coordination compound', 'ligand', 'complex', 'nomenclature'] },
        { id: 'TAG_COORD_ISOMERISM', name: 'Isomerism in Coordination Compounds', keywords: ['isomerism', 'geometrical isomerism', 'optical isomerism', 'linkage isomerism'] },
        { id: 'TAG_COORD_VBCT', name: 'Valence Bond Crystal Field Theory', keywords: ['vbt', 'cft', 'crystal field', 'crystal field splitting', 'strong field', 'weak field'] },
    ],
    // Haloalkanes and Haloarenes
    'chapter_haloalkanes_haloarenes': [
        { id: 'TAG_HALO_PREPARATION', name: 'Preparation', keywords: ['haloalkane preparation', 'haloarene preparation', 'from alcohol', 'from hydrocarbon'] },
        { id: 'TAG_HALO_REACTIONS', name: 'Reactions', keywords: ['sn1', 'sn2', 'nucleophilic substitution', 'elimination', 'wurtz reaction', 'fridel craft'] },
        { id: 'TAG_HALO_MECHANISM', name: 'Reaction Mechanisms', keywords: ['mechanism', 'carbocation', 'transition state', 'backside attack'] },
    ],
    // Alcohols, Phenols, Ethers
    'chapter_alcohols_phenols_ethers': [
        { id: 'TAG_ALCOHOL_PREPARATION', name: 'Preparation of Alcohols', keywords: ['alcohol preparation', 'from grignard', 'from alkene', 'fermentation'] },
        { id: 'TAG_ALCOHOL_REACTIONS', name: 'Reactions of Alcohols', keywords: ['alcohol reaction', 'dehydration', 'oxidation', 'esterification'] },
        { id: 'TAG_PHENOL_PREPARATION', name: 'Preparation & Reactions of Phenols', keywords: ['phenol', 'dow process', 'coupling', 'electrophilic substitution'] },
        { id: 'TAG_ETHER_PREPARATION', name: 'Preparation & Reactions of Ethers', keywords: ['ether', 'williamson synthesis', 'cleavage'] },
    ],
    // Aldehydes, Ketones
    'chapter_aldehydes_ketones': [
        { id: 'TAG_ALDE_PREPARATION', name: 'Preparation', keywords: ['aldehyde preparation', 'ketone preparation', 'ozonolysis', 'oxidation', 'reduction'] },
        { id: 'TAG_ALDE_NUCLEOPHILIC', name: 'Nucleophilic Addition', keywords: ['nucleophilic addition', 'cyanohydrin', 'bisulphite', 'addition product'] },
        { id: 'TAG_ALDE_OXIDATION', name: 'Oxidation & Reduction', keywords: ['oxidation', 'reduction', 'tollen', 'fehling', 'benedict', 'clemmensen', 'wolf kishner'] },
        { id: 'TAG_ALDE_NAME_REACTIONS', name: 'Name Reactions', keywords: ['aldol', 'cannizzaro', 'perkin', 'haloform', 'claisen', 'grignard'] },
    ],
    // Amines
    'chapter_amines': [
        { id: 'TAG_AMINE_PREPARATION', name: 'Preparation', keywords: ['amine preparation', 'reduction', 'hofmann degradation', 'ammonolysis'] },
        { id: 'TAG_AMINE_BASICITY', name: 'Basicity', keywords: ['basicity', 'kb', 'ph of solution', 'basic strength'] },
        { id: 'TAG_AMINE_REACTIONS', name: 'Reactions', keywords: ['amine reaction', 'diazotization', 'coupling', 'carbylamine', 'hinsberg'] },
    ],
    // Biomolecules
    'chapter_biomolecules': [
        { id: 'TAG_BIO_CARBOHYDRATES', name: 'Carbohydrates', keywords: ['carbohydrate', 'glucose', 'fructose', 'sucrose', 'maltose', 'lactose', 'polysaccharide', 'starch', 'cellulose'] },
        { id: 'TAG_BIO_PROTEINS', name: 'Proteins', keywords: ['protein', 'amino acid', 'peptide', 'primary structure', 'secondary structure', 'tertiary structure', 'denaturation'] },
        { id: 'TAG_BIO_NUCLEIC_ACIDS', name: 'Nucleic Acids', keywords: ['dna', 'rna', 'nucleotide', 'nucleoside', 'genetic code', 'replication'] },
        { id: 'TAG_BIO_ENZYMES', name: 'Enzymes', keywords: ['enzyme', 'catalyst', 'lock and key', 'induced fit', 'enzyme activity'] },
        { id: 'TAG_BIO_VITAMINS', name: 'Vitamins & Hormones', keywords: ['vitamin', 'hormone', 'deficiency disease'] },
    ],
};

// Default tags for chapters not fully mapped
const DEFAULT_TAGS = [
    { id: 'tag_basic_concepts', name: 'Basic Concepts', keywords: ['basic', 'fundamental'] },
    { id: 'tag_numerical_problem', name: 'Numerical Problem', keywords: ['calculate', 'find', 'determine', 'compute'] },
    { id: 'tag_theory_concept', name: 'Theory & Concepts', keywords: ['explain', 'define', 'describe', 'which of'] },
];

/**
 * Determine question type based on content analysis
 */
function determineQuestionType(question) {
    const text = question.text_markdown.toLowerCase();
    const options = question.options || [];
    
    // Check for Numerical Value Type
    if (text.includes('numerical') || 
        text.includes('integer') || 
        text.includes('numerical answer') ||
        (options.length === 0 && question.integer_answer)) {
        return 'NVT';
    }
    
    // Check for Assertion-Reason
    if ((text.includes('assertion') && text.includes('reason')) ||
        (text.includes('statement i') && text.includes('statement ii')) ||
        text.match(/assertion\s*:/i)) {
        return 'AR';
    }
    
    // Check for Multiple Statement Type
    const statementMatches = text.match(/statement\s+[a-d]/gi) || 
                            text.match(/\([a-d]\)/g) ||
                            text.match(/\n[a-d][\.\)]/g);
    
    if (statementMatches && statementMatches.length >= 2) {
        // Check if options mention combinations like "a and b", "a, b, c"
        const optionTexts = options.map(o => o.text.toLowerCase()).join(' ');
        if (optionTexts.match(/(a|b|c|d).*and.*(a|b|c|d)/) ||
            optionTexts.match(/(a|b|c|d).*,.*(a|b|c|d)/) ||
            optionTexts.includes('both') ||
            optionTexts.includes('all of')) {
            return 'MST';
        }
    }
    
    // Check if multiple options can be correct (MCQ vs SCQ)
    const correctOptions = options.filter(o => o.isCorrect);
    if (correctOptions.length > 1) {
        return 'MCQ';
    }
    
    // Default to Single Choice Question
    return 'SCQ';
}

/**
 * Match question to concept tags based on keywords
 */
function matchConceptTags(question, chapterId) {
    const text = question.text_markdown.toLowerCase();
    const solution = (question.solution?.text_latex || '').toLowerCase();
    const combined = text + ' ' + solution;
    
    const tags = [];
    const chapterTags = CHAPTER_CONCEPT_MAP[chapterId] || DEFAULT_TAGS;
    
    for (const tag of chapterTags) {
        let matchScore = 0;
        for (const keyword of tag.keywords) {
            const regex = new RegExp(keyword.toLowerCase(), 'g');
            const matches = combined.match(regex);
            if (matches) {
                matchScore += matches.length;
            }
        }
        
        if (matchScore > 0) {
            tags.push({
                tag_id: tag.id,
                weight: Math.min(matchScore * 0.3, 1.0)
            });
        }
    }
    
    // Sort by weight and return top 3
    tags.sort((a, b) => b.weight - a.weight);
    return tags.slice(0, 3);
}

/**
 * Generate a solution for questions missing one
 */
function generateSolution(question) {
    const text = question.text_markdown;
    const chapterId = question.chapter_id || '';
    const options = question.options || [];
    const correctOption = options.find(o => o.isCorrect);
    
    // Check if it's a basic conceptual question
    if (text.toLowerCase().includes('which of the following') || 
        text.toLowerCase().includes('select the correct')) {
        let solution = '**Solution:**\\n\\n';
        
        if (correctOption) {
            solution += `The correct answer is **Option ${correctOption.id.toUpperCase()}**.\\n\\n`;
            solution += `**Explanation:** ${correctOption.text}\\n\\n`;
        }
        
        // Add reasoning based on chapter
        if (chapterId.includes('structure_of_atom')) {
            solution += 'This question is based on the fundamental concepts of atomic structure and quantum mechanics. ';
            solution += 'Understanding the principles discussed in NCERT will help solve such problems.';
        } else if (chapterId.includes('mole') || chapterId.includes('basic_concepts')) {
            solution += 'This problem involves applying the mole concept and stoichiometric calculations. ';
            solution += 'Practice with various numerical problems to strengthen your understanding.';
        }
        
        return solution;
    }
    
    // For numerical problems
    if (question.type === 'NVT' || question.integer_answer) {
        return '**Solution:**\\n\\nThis is a numerical value type question.\\n\\n**Step-by-step approach:**\\n1. Identify the given values and what needs to be found\\n2. Apply the relevant formula from the chapter\\n3. Perform the calculation carefully\\n4. Check units and significant figures\\n\\n**Answer:** ' + (question.integer_answer || '[Calculate using appropriate formula]');
    }
    
    return null; // Cannot auto-generate
}

/**
 * Main analysis function
 */
async function analyzeAndTagQuestions() {
    console.log('🔌 Connecting to MongoDB...');
    
    // Fix the connection string - ensure retryWrites has a proper value
    let uri = MONGODB_URI;
    if (uri.includes('retryWrites=') && !uri.match(/retryWrites=(true|false)/)) {
        uri = uri.replace(/retryWrites=?/, 'retryWrites=true');
    }
    
    await mongoose.connect(uri, {
        bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Define schemas inline (avoid TypeScript import issues)
    const QuestionSchema = new mongoose.Schema({
        _id: String,
        text_markdown: String,
        type: { type: String, default: 'SCQ' },
        options: [{ id: String, text: String, isCorrect: Boolean }],
        integer_answer: String,
        tags: [{ tag_id: String, weight: Number }],
        tag_id: String,
        chapter_id: String,
        solution: {
            text_latex: String,
            video_url: String,
            audio_url: String
        }
    }, { collection: 'questions' });
    
    const TaxonomySchema = new mongoose.Schema({
        _id: String,
        name: String,
        parent_id: String,
        type: String,
        chapter: String
    }, { collection: 'taxonomy' });
    
    const Question = mongoose.model('Question', QuestionSchema);
    const Taxonomy = mongoose.model('Taxonomy', TaxonomySchema);
    
    // Get all questions
    console.log('📚 Fetching questions...');
    const questions = await Question.find({}).lean();
    console.log(`Found ${questions.length} questions`);
    
    // Get taxonomy
    const taxonomy = await Taxonomy.find({}).lean();
    console.log(`Found ${taxonomy.length} taxonomy entries`);
    
    // Statistics
    let stats = {
        total: questions.length,
        tagged: 0,
        typeClassified: 0,
        solutionsAdded: 0,
        skipped: 0
    };
    
    // Process in batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
        const batch = questions.slice(i, i + BATCH_SIZE);
        console.log(`\n📦 Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(questions.length/BATCH_SIZE)}`);
        
        for (const question of batch) {
            const updates = {};
            let needsUpdate = false;
            
            // 1. Assign concept tags if missing
            if (!question.tags || question.tags.length === 0) {
                const matchedTags = matchConceptTags(question, question.chapter_id);
                if (matchedTags.length > 0) {
                    updates.tags = matchedTags;
                    updates.tag_id = matchedTags[0].tag_id;
                    needsUpdate = true;
                    stats.tagged++;
                }
            }
            
            // 2. Determine question type
            const detectedType = determineQuestionType(question);
            if (!question.type || question.type === 'SCQ' || question.type !== detectedType) {
                updates.type = detectedType;
                needsUpdate = true;
                stats.typeClassified++;
            }
            
            // 3. Generate solution if missing or placeholder
            const hasSolution = question.solution?.text_latex && 
                               question.solution.text_latex.length > 50 &&
                               !question.solution.text_latex.match(/wait for solution|coming soon|not available/i);
            
            if (!hasSolution) {
                const generated = generateSolution(question);
                if (generated) {
                    updates.solution = {
                        ...(question.solution || {}),
                        text_latex: generated
                    };
                    needsUpdate = true;
                    stats.solutionsAdded++;
                } else {
                    stats.skipped++;
                }
            }
            
            // Update the question
            if (needsUpdate) {
                await Question.updateOne(
                    { _id: question._id },
                    { $set: updates }
                );
            }
        }
        
        console.log(`  ✅ Tagged: ${stats.tagged}, Classified: ${stats.typeClassified}, Solutions: ${stats.solutionsAdded}`);
    }
    
    console.log('\n📊 Final Statistics:');
    console.log(`  Total questions: ${stats.total}`);
    console.log(`  Tagged with concepts: ${stats.tagged}`);
    console.log(`  Type classified: ${stats.typeClassified}`);
    console.log(`  Solutions added: ${stats.solutionsAdded}`);
    console.log(`  Skipped (no auto-solution): ${stats.skipped}`);
    
    // Show breakdown by type
    const typeBreakdown = await Question.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    console.log('\n📋 Question Type Breakdown:');
    typeBreakdown.forEach(t => console.log(`  ${t._id}: ${t.count}`));
    
    await mongoose.disconnect();
    console.log('\n✅ Done!');
}

// Run the analysis
analyzeAndTagQuestions().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
