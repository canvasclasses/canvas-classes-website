const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
    const APPLY_CHANGES = process.argv.includes('--apply');

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        console.log(`Mode: ${APPLY_CHANGES ? 'APPLY' : 'DRY RUN'}`);

        const untagged = await db.collection('questions').find({
            $or: [{ tag_id: { $exists: false } }, { tag_id: null }, { tag_id: '' }]
        }).toArray();

        const taxonomy = await db.collection('taxonomy').find({}).toArray();

        const chapterById = {};
        const chapterByName = {};
        taxonomy.filter(n => n.type === 'chapter').forEach(c => {
            chapterById[c._id] = c;
            const lowerName = c.name.toLowerCase();
            chapterByName[lowerName] = c;
            chapterByName[lowerName.split(' (')[0]] = c;
        });

        const tagsByParentId = {};
        taxonomy.filter(n => n.type === 'topic').forEach(t => {
            if (!tagsByParentId[t.parent_id]) tagsByParentId[t.parent_id] = [];
            tagsByParentId[t.parent_id].push(t);
        });

        const qidToTag = {
            'MC_LRY': 'TAG_MOLE_LIMITING_REAGENT',
            'MC_STO': 'TAG_MOLE_STOICHIOMETRY',
            'MC_MIX': 'TAG_MOLE_STOICHIOMETRY',
            'MC_CON': 'TAG_MOLE_CONCENTRATIONS',
            'MC_MOL': 'TAG_MOLE_BASICS',
            'MC_MVD': 'TAG_MOLE_BASICS',
            'MC_SIG': 'TAG_MOLE_BASICS',
            'MC_ABT': 'TAG_MOLE_BASICS',
            'MC_EQV': 'TAG_MOLE_EQUIVALENT',
            'MC_VOL': 'TAG_MOLE_EQUIVALENT',
            'MC_RDX': 'TAG_REDO_BALANCING_OF_REDOX_REACTIONS', // Redox balancing
            'MC_EMP': 'TAG_MOLE_EMPIRICAL',
            'MC_EMF': 'TAG_MOLE_EMPIRICAL',
            'MC_EUD': 'TAG_MOLE_EUDIOMETRY'
        };

        const chapterKeywords = {
            'chapter_atomic_structure': ['atomic structure', 'bohr', 'orbital', 'quantum', 'electron', 'proton', 'neutron', 'spectrum', 'heisenberg', 'de broglie', 'photoelectric', '$\\psi$', 'quantum number', 'R_H', 'rydberg'],
            'chapter_thermodynamics': ['enthalpy', 'entropy', 'heat', 'internal energy', 'gibbs', 'isothermal', 'adiabatic', 'thermodynamics', '$\\\\Delta H$', '$\\\\Delta S$', '$\\\\Delta G$', 'reversible expansion'],
            'chapter_chemical_kinetics': ['rate of reaction', 'activation energy', 'order of reaction', 'arrhenius', 'kinetics', 'half life', 'rate constant', 'first order', 'zero order'],
            'chapter_solutions': ['vapour pressure', 'osmotic', 'elevation in boiling', 'depression in freezing', 'raoult', 'henry', 'solutions', 'colligative', 'van\'t hoff', 'rlvp', 'henry\'s law'],
            'chapter_electrochemistry': ['electrode', 'galvanic', 'electrolytic', 'conductance', 'nernst', 'electrochemistry', 'faraday', 'salt bridge', 'kohlrausch', 'daniell cell'],
            'chapter_chemical_bonding': ['covalent', 'ionic', 'hybridization', 'molecular orbital', 'bonding', 'dipole moment', 'vsepr', 'fajan', 'bond order', 'resonance structure', 'formal charge', 'hno3'],
            'chapter_mole_concept': ['mole', 'molar', 'mass', 'molecular weight', 'stoichiometry', 'concentration', 'limiting reagent', 'empirical formula', 'avogadro', 'titration', 'normality'],
            'chapter_coordination_compounds': ['coordination', 'ligand', 'complex', 'cft', 'crystal field', 'nomenclature of coordination', 'verner', 't2g', 'eg', 'synergic', 'spin octahedral'],
            'chapter_d_f_block': ['transition metal', 'lanthanoid', 'actinoid', 'd-block', 'f-block', 'kmno4', 'k2cr2o7', 'magnetic moment', 'spin only', 'lanthanide contraction'],
            'chapter_salt_analysis': ['salt analysis', 'qualitative analysis', 'group reagent', 'precipitate', 'ion detection', 'color of flame', 'borax bead', 'nessler'],
            'chapter_general_organic_chemistry_goc': ['resonance', 'inductive', 'hyperconjugation', 'aromaticity', 'mesomeric', 'electrophile', 'nucleophile', 'goc', 'stability of carbocation', 'acidity', 'basicity'],
            'chapter_hydrocarbons': ['alkane', 'alkene', 'alkyne', 'benzene', 'hydrocarbon', 'polymerization', 'cracking', 'markovnikov', 'ozonolysis'],
            'chapter_biomolecules': ['glucose', 'amino acid', 'protein', 'carbohydrate', 'dna', 'rna', 'sugar', 'enzyme', 'vitamins', 'peptide', 'zwitterion', 'sucrose', 'levorotation', 'hydrolysis of sucrose'],
            'chapter_periodic_properties': ['ionization energy', 'electronegativity', 'atomic radius', 'periodicity', 'electron gain enthalpy', 'metallic character', 'shielding effect', 'bond dissociation enthalpy', 'order of first ionization'],
            'chapter_amines': ['amines', 'aniline', 'diazonium', 'hinsberg', 'carbylamine', 'hoffmann', '$Br_2/HO$'],
            'chapter_haloalkanes_and_haloarenes': ['haloalkane', 'haloarene', 'alkyl halide', 'benzyl halide', '$S_N1$', '$S_N2$', 'nucleophilic substitution', 'chlorobenzene', 'benzyl halides', 'reactivity of benzyl halides'],
            'chapter_p_block_12th': ['group 15', 'group 16', 'group 17', 'group 18', 'nitrogen family', 'oxygen family', 'halogen family', 'noble gas', 'p-block', 'bond dissociation enthalpy', '$EF_3$', 'XF_3'],
            'chapter_aromatic_compounds': ['phenol', 'reimer-tiemann', '$CHCl_3 / aq. KOH$', 'benzyl alcohol', 'cross-aldol', 'nitrobenzene', 'aniline']
        };

        const updates = [];
        const results = { success: 0, fail: 0 };

        for (const q of untagged) {
            const qText = ((q.text_markdown || '') + ' ' + (q.solution?.text_latex || '')).toLowerCase();
            const parts = q._id.split('_');
            const prefix = parts.length >= 2 ? parts[0] + '_' + parts[1] : null;

            let resolvedChNode = chapterById[q.chapter_id] || chapterByName[(q.chapter_id || '').toLowerCase()];
            let resolvedTag = null;

            if (qidToTag[prefix]) {
                resolvedTag = taxonomy.find(t => t._id === qidToTag[prefix]);
                if (resolvedTag && !resolvedChNode) {
                    resolvedChNode = chapterById[resolvedTag.parent_id];
                }
            }

            if (!resolvedChNode) {
                for (const [chId, keywords] of Object.entries(chapterKeywords)) {
                    if (keywords.some(k => qText.includes(k))) {
                        resolvedChNode = chapterById[chId];
                        break;
                    }
                }
            }

            if (resolvedChNode && !resolvedTag) {
                const possibleTags = tagsByParentId[resolvedChNode._id] || [];
                for (const tag of possibleTags) {
                    const tagNameLower = tag.name.toLowerCase();
                    // Try both full word and presence
                    const regex = new RegExp('\\b' + tagNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
                    if (regex.test(qText)) {
                        resolvedTag = tag;
                        break;
                    }
                }
            }

            if (resolvedChNode) {
                updates.push({
                    qId: q._id,
                    originalCh: q.chapter_id,
                    newChId: resolvedChNode._id,
                    newTagName: resolvedTag ? resolvedTag.name : 'None',
                    newTagId: resolvedTag ? resolvedTag._id : null,
                    reason: resolvedTag ? 'Tag Matched' : 'Chapter Matched'
                });
                results.success++;
            } else {
                results.fail++;
            }
        }

        console.log('--- AUTO-TAG SUMMARY ---');
        console.log(`Total Untagged: ${untagged.length}`);
        console.log(`Analyzed: ${updates.length}`);
        console.log(`Tags Assigned: ${updates.filter(u => u.newTagId).length}`);
        console.log(`Remaining: ${results.fail}`);
        console.log('-------------------------');

        if (APPLY_CHANGES) {
            console.log(`Applying updates for ${updates.length} questions...`);
            const updateOps = updates.map(u => {
                const setDoc = { chapter_id: u.newChId };
                if (u.newTagId) setDoc.tag_id = u.newTagId;
                return {
                    updateOne: {
                        filter: { _id: u.qId },
                        update: { $set: setDoc }
                    }
                };
            });

            const bulkResult = await db.collection('questions').bulkWrite(updateOps);
            console.log('Bulk write result:', bulkResult.modifiedCount, 'questions updated.');
        } else {
            console.log(JSON.stringify(updates.slice(0, 30), null, 2));
            console.log('\nRun with --apply to commit changes.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

run();
