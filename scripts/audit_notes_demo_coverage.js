// READ-ONLY audit: for each chemistry chapter that has handwritten notes AND
// a Crucible mapping, report whether the `is_demo_question: true` set covers
// every NCERT topic-order position — and what the student actually sees first
// when the side-by-side panel sorts by display_id.
//
// Source-of-truth files (do not edit here):
//   - apps/student/features/crucible/lib/ncertTopicOrder.ts (NCERT_TOPIC_ORDER)
//   - apps/student/features/notes/data/chapterMetadata.ts   (notes ↔ chapter_id)
//   - apps/student/app/api/v2/notes-quicktest/[chapterId]/route.ts (current sort)
//
// Usage:  node scripts/audit_notes_demo_coverage.js
//
// Output: prints a per-chapter markdown report to stdout.

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// Mirrors NCERT_TOPIC_ORDER from ncertTopicOrder.ts — only the chapters that
// also have handwritten notes (per chapterMetadata.ts crucibleChapterId).
const NCERT_TOPIC_ORDER = {
    ch11_mole: [
        ['tag_mole_1', 'Laws of Chemical Combination, Sig. Fig'],
        ['tag_mole_7', 'Mole Basics (Mass/Vol/Part)'],
        ['tag_mole_3', 'Empirical/Molecular Formula'],
        ['tag_mole_8', 'Stoichiometry & Analysis'],
        ['tag_mole_6', 'Limiting Reagent'],
        ['tag_mole_2', 'Concentration Units & Solution Concepts'],
        ['tag_mole_4', 'Equivalent Concept & n-factor'],
        ['tag_mole_5', 'Eudiometry (Gas Analysis)'],
    ],
    ch11_atom: [
        ['tag_atom_1', 'Sub-atomic Particles & Discovery'],
        ['tag_atom_2', 'Atomic Models (Thomson, Rutherford)'],
        ['tag_atom_4', 'EM Radiation & Planck'],
        ['tag_atom_5', 'Photoelectric Effect & BBR'],
        ['tag_atom_6', "Bohr's Model & Hydrogen Spectrum"],
        ['tag_atom_8', 'De-Broglie & Uncertainty'],
        ['tag_atom_3', 'Quantum Mechanical Model'],
        ['tag_atom_9', 'Wave function & Probability Graphs'],
        ['tag_atom_7', 'Quantum Numbers & Electronic Config'],
        ['tag_atom_10', 'Multi Concept'],
    ],
    ch11_periodic: [
        ['tag_periodic_1', 'Modern Periodic Law & IUPAC (Z>100)'],
        ['tag_periodic_7', 'Electronic Config of Atoms'],
        ['tag_periodic_2', 'Atomic & Ionic Radii Trends'],
        ['tag_periodic_3', 'IE / EA / EN Trends'],
        ['tag_periodic_4', 'Other Periodic Trends'],
        ['tag_periodic_6', 'Valency & Diagonal Relationship'],
        ['tag_periodic_5', 'Nature of Oxides'],
    ],
    ch11_bonding: [
        ['tag_bonding_2', 'Basics, Octet, Formal Charge'],
        ['tag_bonding_1', 'Ionic Bonding & Lattice Energy'],
        ['tag_bonding_9', 'Bond length/strength/angle & Resonance'],
        ['tag_bonding_3', 'Dipole Moment & Polarity'],
        ['tag_bonding_4', "Fajan's Rule & Covalent Character"],
        ['tag_bonding_6', 'VSEPR & Geometry'],
        ['tag_bonding_10', 'VBT and Hybridization'],
        ['tag_bonding_8', 'MOT'],
        ['tag_bonding_5', 'Hydrogen Bonding & Intermolecular Forces'],
        ['tag_bonding_7', 'Additional Concepts'],
    ],
    ch11_thermo: [
        ['tag_thermo_1', 'Basic Terms'],
        ['tag_thermo_8', 'Work & Heat'],
        ['tag_thermo_7', 'First Law & Internal Energy'],
        ['tag_thermo_4', 'Internal Energy & Enthalpy change'],
        ['tag_thermo_2', 'Calorimetry & Heat Capacity'],
        ['tag_thermo_3', "Thermochemistry & Hess's Law"],
        ['tag_thermo_5', 'Entropy & Second Law'],
        ['tag_thermo_6', 'Gibbs Free Energy & Spontaneity'],
        ['tag_thermo_10', 'Multi Concept'],
    ],
    ch11_ionic_eq: [
        ['tag_ionic_eq_7', 'Theories of Acid/Base & Ostwald'],
        ['tag_ionic_eq_6', 'Ionic Product of Water & pH'],
        ['tag_ionic_eq_4', 'pH Calc (Acids/Bases)'],
        ['tag_ionic_eq_1', 'Buffer Solutions'],
        ['tag_ionic_eq_2', 'Salt Hydrolysis'],
        ['tag_ionic_eq_5', 'Hydrolysis & pH'],
        ['tag_ionic_eq_3', 'Solubility Product (Ksp)'],
        ['tag_ionic_eq_8', 'Titrations & Indicators'],
    ],
    ch11_goc: [
        ['tag_goc_1', 'Classification & IUPAC Naming'],
        ['tag_goc_5', 'Electrophiles, Nucleophiles & Basics'],
        ['tag_goc_4', 'Reaction Intermediates'],
        ['tag_goc_2', 'Electronic Effects'],
        ['tag_goc_3', 'Acidity & Basicity'],
        ['tag_goc_10', "Huckel's Rule & Aromaticity"],
        ['tag_goc_6', 'Structural Isomerism & Tautomerism'],
        ['tag_goc_7', 'Geometrical Isomerism'],
        ['tag_goc_8', 'Optical Isomerism & Chirality'],
        ['tag_goc_9', 'Conformational Isomerism'],
        ['tag_goc_11', 'Allenes, Atropisomers, Spiro'],
    ],
    ch11_hydrocarbon: [
        ['tag_hydrocarbon_1', 'Alkanes — Prep & Properties'],
        ['tag_hydrocarbon_2', 'Alkenes — Prep & Addition'],
        ['tag_hydrocarbon_5', 'Alkene Oxidation'],
        ['tag_hydrocarbon_3', 'Alkynes — Acidity & Reactions'],
        ['tag_hydrocarbon_6', 'Benzene — Prep & Reactions'],
        ['tag_hydrocarbon_7', 'Aromatic Substitution (SEAr/SNAr)'],
    ],
    ch11_prac_org: [
        ['tag_prac_org_1', 'Purification Methods'],
        ['tag_prac_org_2', "Detection of Elements (Lassaigne's)"],
        ['tag_prac_org_3', 'Quantitative Analysis'],
        ['tag_prac_org_4', 'Tests for Unsaturation'],
        ['tag_prac_org_5', 'Tests for Hydroxyl Group'],
        ['tag_prac_org_6', 'Tests for Carbonyl & Carboxyl'],
        ['tag_prac_org_7', 'Tests for Amines'],
    ],
    ch12_solutions: [
        ['tag_solutions_2', 'Basics & Definitions'],
        ['tag_solutions_4', 'Concentration Terms'],
        ['tag_solutions_7', "Solubility & Henry's Law"],
        ['tag_solutions_3', "Raoult's Law"],
        ['tag_solutions_1', 'Vapour Pressure & RLVP'],
        ['tag_solutions_5', 'BP Elevation / FP Depression'],
        ['tag_solutions_6', "Osmotic Pressure & Van't Hoff Factor"],
    ],
    ch12_electrochem: [
        ['tag_electrochem_4', 'Electrode Potential & Galvanic Cell'],
        ['tag_electrochem_3', 'Electrochemical Series'],
        ['tag_electrochem_6', 'Nernst Equation & Latimer'],
        ['tag_electrochem_2', 'Conductance & Kohlrausch'],
        ['tag_electrochem_5', "Electrolysis & Faraday's Laws"],
        ['tag_electrochem_1', 'Batteries, Fuel Cells & Corrosion'],
        ['tag_electrochem_7', 'Multi-Concept'],
    ],
    ch12_kinetics: [
        ['tag_kinetics_5', 'Rate of Reactions & Factors'],
        ['tag_kinetics_4', 'Rate Law, Order, Molecularity'],
        ['tag_kinetics_7', 'Zero Order Reactions'],
        ['tag_kinetics_8', 'First Order Reactions'],
        ['tag_kinetics_1', 'Arrhenius & Activation Energy'],
        ['tag_kinetics_6', 'Reaction Mechanisms & Catalysis'],
        ['tag_kinetics_2', 'Complex Reactions'],
        ['tag_kinetics_3', 'Radioactive Decay'],
    ],
    ch12_pblock: [
        ['tag_pblock12_1', 'P-Block (general)'],
        ['tag_pblock12_8', 'Nitrogen Family Properties'],
        ['tag_pblock12_3', 'Compounds of Nitrogen'],
        ['tag_pblock12_4', 'Compounds of Phosphorus'],
        ['tag_pblock12_9', 'Oxygen Family Properties'],
        ['tag_pblock12_5', 'Compounds of Sulphur'],
        ['tag_pblock12_7', 'Halogens Properties'],
        ['tag_pblock12_2', 'Halide Compounds'],
        ['tag_pblock12_6', 'Noble Gases'],
    ],
    ch12_dblock: [
        ['tag_dblock_2', 'Electronic Config & Exceptions'],
        ['tag_dblock_7', 'Physical Properties'],
        ['tag_dblock_3', 'IE, Oxidation States, SRP'],
        ['tag_dblock_5', 'Magnetic & Colour'],
        ['tag_dblock_6', 'Oxides & Catalytic Properties'],
        ['tag_dblock_1', 'Reactions of Transition Metals'],
        ['tag_dblock_4', 'KMnO4 & K2Cr2O7'],
        ['tag_dblock_8', 'f-Block Elements'],
    ],
    ch12_coord: [
        ['tag_coord_9', "Werner's Theory"],
        ['tag_coord_1', 'Basic Defs & Ligands'],
        ['tag_coord_4', 'IUPAC Nomenclature'],
        ['tag_coord_5', 'Isomerism'],
        ['tag_coord_8', 'VBT'],
        ['tag_coord_3', 'CFT'],
        ['tag_coord_2', 'Colour & Magnetic'],
        ['tag_coord_7', 'Stability & Applications'],
        ['tag_coord_6', 'Metal Carbonyls & EAN'],
        ['tag_coord_10', 'Organometallics & Bioinorganic'],
    ],
    ch12_carbonyl: [
        ['tag_aldehydes_6', 'Nucleophilic Addition'],
        ['tag_aldehydes_1', 'Advanced Grignard'],
        ['tag_aldehydes_3', 'Reduction & Condensation'],
        ['tag_aldehydes_7', 'Oxidation & Reduction'],
        ['tag_aldehydes_2', 'Enolate & α-Carbon'],
        ['tag_aldehydes_5', 'Chemical Tests'],
        ['tag_ch12_aldehydes_1771659373017', 'Aromatic Aldehydes & Ketones'],
        ['tag_carboxylic_4', 'Carboxylic Prep'],
        ['tag_carboxylic_3', 'Carboxylic Name Reactions'],
        ['tag_carboxylic_1', 'Acid Derivatives'],
        ['tag_ch12_carboxylic_1771659384907', 'Aromatic Carboxylic Acids'],
    ],
    ch12_amines: [
        ['tag_amines_5', 'Amine Preparation'],
        ['tag_amines_3', 'Basicity of Amines'],
        ['tag_amines_1', 'Aliphatic Amine Reactions & Tests'],
        ['tag_ch12_amines_1771659399884', 'Aromatic Amines'],
        ['tag_amines_4', 'Diazonium Salts & Coupling'],
    ],
    ch12_biomolecules: [
        ['tag_biomolecules_1', 'Carbohydrates (Glucose)'],
        ['tag_biomolecules_3', 'Di & Polysaccharides'],
        ['tag_biomolecules_5', 'Proteins & Amino Acids'],
        ['tag_biomolecules_6', 'Vitamins & Enzymes'],
        ['tag_biomolecules_4', 'Nucleic Acids'],
        ['tag_biomolecules_2', 'Tests for Biomolecules'],
    ],
    ch12_salt: [
        ['tag_salt_14', 'Solubility Rules & Precipitate Colors'],
        ['tag_salt_13', 'Dry Tests (Flame/Borax)'],
        ['tag_salt_1', 'Anion Analysis (general)'],
        ['tag_salt_4', 'Anions: Dil H2SO4 Group'],
        ['tag_salt_3', 'Anions: Conc H2SO4 Group'],
        ['tag_salt_5', 'Anions: Special Group'],
        ['tag_salt_2', 'Cation Analysis (general)'],
        ['tag_salt_12', 'Cations: Zero Group (NH4+)'],
        ['tag_salt_6', 'Cations: Group I'],
        ['tag_salt_7', 'Cations: Group II'],
        ['tag_salt_8', 'Cations: Group III'],
        ['tag_salt_9', 'Cations: Group IV'],
        ['tag_salt_10', 'Cations: Group V'],
        ['tag_salt_11', 'Cations: Group VI'],
    ],
};

function pad(s, n) { return String(s).padEnd(n); }

(async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) { console.error('MONGODB_URI missing'); process.exit(1); }
    const client = new MongoClient(uri);
    await client.connect();
    const col = client.db('crucible').collection('questions_v2');

    const summary = [];
    console.log('\n# Notes Side-by-Side — Demo-Set Coverage Audit');
    console.log(`_Generated: ${new Date().toISOString()}_\n`);
    console.log('Question: for each chapter with notes, does the `is_demo_question: true` set');
    console.log('cover the early-chapter primary concepts? And what would the student see first');
    console.log('with the current display_id sort vs the proposed NCERT-order sort?\n');

    for (const [chapterId, order] of Object.entries(NCERT_TOPIC_ORDER)) {
        const docs = await col.find({
            'metadata.chapter_id': chapterId,
            'metadata.is_demo_question': true,
            status: 'published',
            deleted_at: null,
        }, {
            projection: { display_id: 1, 'metadata.tags': 1 }
        }).sort({ display_id: 1 }).toArray();

        // Group by primary tag
        const byPrimary = {};
        for (const d of docs) {
            const primary = d.metadata?.tags?.[0]?.tag_id || '(no tag)';
            (byPrimary[primary] ||= []).push(d.display_id);
        }

        const total = docs.length;
        const positionsCovered = order.filter(([tagId]) => byPrimary[tagId]?.length).length;
        const earlyMissing = order.slice(0, 3).filter(([tagId]) => !byPrimary[tagId]?.length).length;

        console.log(`\n## ${chapterId} — ${total} demo qs, ${positionsCovered}/${order.length} concepts covered`);

        if (total === 0) {
            console.log('_No demo questions flagged. Side-by-side panel will be empty._');
            summary.push({ chapterId, total, coverage: 0, earlyMissing: 0, note: 'EMPTY' });
            continue;
        }

        // Per-concept coverage in NCERT order
        console.log('\n| # | Tag ID | Concept | Demo qs |');
        console.log('|---|---|---|---|');
        for (let i = 0; i < order.length; i++) {
            const [tagId, name] = order[i];
            const ids = byPrimary[tagId] || [];
            const mark = ids.length ? '✓' : '—';
            const sample = ids.slice(0, 4).join(', ') + (ids.length > 4 ? ` +${ids.length - 4}` : '');
            console.log(`| ${i + 1} | ${tagId} | ${name} | ${mark} ${ids.length} ${sample ? `· ${sample}` : ''} |`);
        }

        // Unmapped tags (primary tags on demo qs that aren't in NCERT_TOPIC_ORDER)
        const unmapped = Object.entries(byPrimary)
            .filter(([t]) => !order.some(([tagId]) => tagId === t))
            .map(([t, ids]) => `${t} (${ids.length})`);
        if (unmapped.length) {
            console.log(`\n_Unmapped primary tags found:_ ${unmapped.join(', ')}`);
        }

        // Show what the student sees today (display_id sort) vs proposed (NCERT order)
        const todaysFirst5 = docs.slice(0, 5).map(d => {
            const p = d.metadata?.tags?.[0]?.tag_id || '?';
            return `${d.display_id} [${p}]`;
        });
        const orderIndex = {};
        order.forEach(([t], i) => orderIndex[t] = i);
        const proposedFirst5 = [...docs].sort((a, b) => {
            const ai = orderIndex[a.metadata?.tags?.[0]?.tag_id];
            const bi = orderIndex[b.metadata?.tags?.[0]?.tag_id];
            return (ai ?? 999) - (bi ?? 999) || a.display_id.localeCompare(b.display_id);
        }).slice(0, 5).map(d => {
            const p = d.metadata?.tags?.[0]?.tag_id || '?';
            return `${d.display_id} [${p}]`;
        });
        console.log(`\n**Today (display_id sort):** ${todaysFirst5.join(' → ')}`);
        console.log(`**Proposed (NCERT order):** ${proposedFirst5.join(' → ')}`);

        summary.push({
            chapterId, total,
            coverage: positionsCovered,
            ofTotal: order.length,
            earlyMissing,
        });
    }

    // Summary table
    console.log('\n\n## Summary\n');
    console.log('| Chapter | Demo qs | Concepts covered | Early gaps (first 3 positions) |');
    console.log('|---|---|---|---|');
    for (const s of summary) {
        if (s.note === 'EMPTY') {
            console.log(`| ${s.chapterId} | 0 | — | EMPTY |`);
        } else {
            const gap = s.earlyMissing === 0 ? '✓ none' : `⚠ ${s.earlyMissing} missing`;
            console.log(`| ${s.chapterId} | ${s.total} | ${s.coverage}/${s.ofTotal} | ${gap} |`);
        }
    }

    await client.close();
})().catch(e => { console.error(e); process.exit(1); });
