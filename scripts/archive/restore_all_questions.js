const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

// --- Configuration ---
const MONGODB_URI = process.env.MONGODB_URI;
const DATA_DIR = path.join(__dirname, '../data/questions');
const APP_DIR = path.join(__dirname, '../app/the-crucible');

// --- Prefix Map ---
const PREFIX_MAP = {
    "chapter_basic_concepts_mole_concept": "MOLE",
    "chapter_atomic_structure": "ATOM",
    "chapter_thermodynamics": "THERMO",
    "chapter_chemical_equilibrium": "EQUIL",
    "chapter_ionic_equilibrium": "IONIC",
    "chapter_redox_reactions": "REDOX",
    "chapter_solid_state": "SOLID",
    "chapter_solutions": "SOLN",
    "chapter_electrochemistry": "ELECTRO",
    "chapter_chemical_kinetics": "KINETICS",
    "chapter_surface_chemistry": "SURFACE",
    "chapter_gaseous_state": "GAS",
    "chapter_periodic_properties": "PERIODIC",
    "chapter_chemical_bonding": "BONDING",
    "chapter_d_and_f_block": "DNF",
    "chapter_coordination_compounds": "COORD",
    "chapter_general_organic_chemistry": "GOC",
    "chapter_hydrocarbons": "HYDRO",
    "chapter_haloalkanes_and_haloarenes": "HALIDES",
    "chapter_alcohols_phenols_and_ethers": "ALCOHOLS",
    "chapter_aldehydes_ketones_and_carboxylic_acids": "CARBOXYLIC",
    "chapter_amines": "AMINES",
    "chapter_biomolecules": "BIO",
    "chapter_polymers": "POLY",
    "chapter_chemistry_in_everyday_life": "DAILY",
    "chapter_environmental_chemistry": "ENV",
    "chapter_principles_of_isolation": "METALLURGY",
    "chapter_p_block_elements": "PBLOCK",
    "chapter_s_block_elements": "SBLOCK",
    "chapter_hydrogen": "HYDROGEN",
    "chapter_states_of_matter": "STATES",
    "chapter_structure_of_atom": "ATOM",
    "chapter_classification_of_elements": "PERIODIC",
    "chapter_chemical_bonding_and_molecular_structure": "BONDING",
    "chapter_salt_analysis": "SALT",
    "chapter_stereochemistry": "STEREO",
    "chapter_aromatic_compounds": "AROMATIC",
    "chapter_uncategorized": "UNCAT"
};

// --- Reverse Map for Human Names ---
const HUMAN_TO_ID_MAP = {
    "Mole Concept": "chapter_basic_concepts_mole_concept",
    "Atomic Structure": "chapter_atomic_structure",
    "Thermodynamics": "chapter_thermodynamics",
    "Chemical Equilibrium": "chapter_chemical_equilibrium",
    "Ionic Equilibrium": "chapter_ionic_equilibrium",
    "Redox Reactions": "chapter_redox_reactions",
    "Solid State": "chapter_solid_state",
    "Solutions": "chapter_solutions",
    "Electrochemistry": "chapter_electrochemistry",
    "Chemical Kinetics": "chapter_chemical_kinetics",
    "Surface Chemistry": "chapter_surface_chemistry",
    "Gaseous State": "chapter_gaseous_state",
    "Periodic Properties": "chapter_periodic_properties",
    "Chemical Bonding": "chapter_chemical_bonding",
    "D & F Block": "chapter_d_and_f_block",
    "Coordination Compounds": "chapter_coordination_compounds",
    "GOC": "chapter_general_organic_chemistry",
    "Hydrocarbons": "chapter_hydrocarbons",
    "Haloalkanes & Haloarenes": "chapter_haloalkanes_and_haloarenes",
    "Alcohols, Phenols & Ethers": "chapter_alcohols_phenols_and_ethers",
    "Aldehydes & Ketones": "chapter_aldehydes_ketones_and_carboxylic_acids",
    "Amines": "chapter_amines",
    "Biomolecules": "chapter_biomolecules",
    "Polymers": "chapter_polymers",
    "Chemistry in Everyday Life": "chapter_chemistry_in_everyday_life",
    "Environmental Chemistry": "chapter_environmental_chemistry",
    "Metallurgy": "chapter_principles_of_isolation",
    "P Block": "chapter_p_block_elements",
    "S Block": "chapter_s_block_elements",
    "Hydrogen": "chapter_hydrogen",
    "States of Matter": "chapter_states_of_matter",
    "Structure of Atom": "chapter_atomic_structure",
    "Classification of Elements": "chapter_periodic_properties",
    "Chemical Bonding and Molecular Structure": "chapter_chemical_bonding",
    "Salt Analysis": "chapter_salt_analysis",
    "S-Block Elements": "chapter_s_block_elements",
    "P-Block Elements": "chapter_p_block_elements",
    "d- and f- Block Elements": "chapter_d_and_f_block",
    "General Principles and Processes of Isolation of Elements": "chapter_principles_of_isolation",
    "Stereochemistry": "chapter_stereochemistry",
    "Aromatic Compounds": "chapter_aromatic_compounds"
};

async function restoreAll() {
    console.log("Starting Full Recovery with CLEAN_WRITE mode...");

    // 1. Collect all questions from all sources
    let allQuestions = [];

    // Source A: User provided questions.json
    try {
        const qJsonPath = path.join(APP_DIR, 'questions.json');
        if (fs.existsSync(qJsonPath)) {
            const data = JSON.parse(fs.readFileSync(qJsonPath, 'utf8'));
            console.log(`Loaded ${data.length} from questions.json`);
            allQuestions = allQuestions.concat(data);
        }
    } catch (e) {
        console.error("Error reading questions.json:", e.message);
    }

    // Source B: User provided questions-migrated.json
    try {
        const qMigPath = path.join(APP_DIR, 'questions-migrated.json');
        if (fs.existsSync(qMigPath)) {
            const data = JSON.parse(fs.readFileSync(qMigPath, 'utf8'));
            console.log(`Loaded ${data.length} from questions-migrated.json`);
            allQuestions = allQuestions.concat(data);
        }
    } catch (e) {
        console.error("Error reading questions-migrated.json:", e.message);
    }

    // Source C: Existing files in data/questions/ (including splintered ones)
    try {
        if (fs.existsSync(DATA_DIR)) {
            const files = fs.readdirSync(DATA_DIR);
            for (const file of files) {
                if (!file.endsWith('.json')) continue;
                const filePath = path.join(DATA_DIR, file);
                try {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    if (Array.isArray(data)) {
                        console.log(`Loaded ${data.length} from ${file}`);
                        allQuestions = allQuestions.concat(data);
                    }
                } catch (err) {
                    console.error(`Error reading ${file}:`, err.message);
                }
            }
        }
    } catch (e) {
        console.error("Error reading data directory:", e.message);
    }

    console.log(`Total raw questions collected: ${allQuestions.length}`);

    // 2. Normalize and Deduplicate
    const uniqueQuestions = new Map();

    for (const q of allQuestions) {
        // Normalize Chapter ID
        let chId = q.chapterId || q.chapter_id;

        // Handle "Human Name" chapter IDs from Supabase/Split files
        if (HUMAN_TO_ID_MAP[chId]) {
            chId = HUMAN_TO_ID_MAP[chId];
        }

        // Handle undefined/null (assign to uncategorized)
        if (!chId) chId = "chapter_uncategorized";

        // Fix commonly misused IDs if any
        if (chId === "Mole Concept") chId = "chapter_basic_concepts_mole_concept";

        // Deduplication key: Text Content (stripped of whitespace)
        // Check both markdown text and question code if available
        const textKey = (q.textMarkdown || q.text || "").replace(/\s+/g, '').trim();

        if (!textKey) continue; // Skip empty questions

        if (uniqueQuestions.has(textKey)) {
            const existing = uniqueQuestions.get(textKey);

            // Prefer existing if it has a standardized ID and the new one doesn't
            const existingIsStandard = existing.id && existing.id.match(/^[A-Z]{3,}-\d{3}$/);
            const newIsStandard = q.id && q.id.match(/^[A-Z]{3,}-\d{3}$/);

            if (existingIsStandard && !newIsStandard) continue;
            if (!existingIsStandard && newIsStandard) {
                q.chapterId = chId; // Ensure chapter ID is normalized
                uniqueQuestions.set(textKey, q);
                continue;
            }

            // Prefer the one with solution
            if (!existing.solution && q.solution) {
                q.chapterId = chId;
                uniqueQuestions.set(textKey, q);
            }
        } else {
            q.chapterId = chId;
            uniqueQuestions.set(textKey, q);
        }
    }

    console.log(`Unique questions after deduplication: ${uniqueQuestions.size}`);

    // 3. Group by Chapter
    const grouped = {};
    for (const q of uniqueQuestions.values()) {
        const chId = q.chapterId;
        if (!grouped[chId]) grouped[chId] = [];
        grouped[chId].push(q);
    }

    // 4. Assign New Standard IDs and Write Files
    // CLEANUP: Remove old directory content to prevent stale files
    if (fs.existsSync(DATA_DIR)) {
        console.log("Cleaning DATA_DIR...");
        fs.rmSync(DATA_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DATA_DIR, { recursive: true });

    const usedPrefixes = new Set();

    for (const [chapterId, questions] of Object.entries(grouped)) {
        const standardQs = questions.filter(q => q.id && q.id.startsWith(PREFIX_MAP[chapterId] || "GEN"));
        const otherQs = questions.filter(q => !q.id || !q.id.startsWith(PREFIX_MAP[chapterId] || "GEN"));

        standardQs.sort((a, b) => a.id.localeCompare(b.id)); // Sort standard IDs

        // Generate Prefix
        let prefix = PREFIX_MAP[chapterId];
        if (!prefix) {
            // Fallback: Generate unique prefix from chapter name
            // e.g. "chapter_custom_name" -> "SCCU" (Short Code Custom Name)
            // Simple hash-like approach: Take first letter of each word in chapter name
            const parts = chapterId.replace('chapter_', '').split('_');
            let abbr = parts.map(p => p[0]).join('').toUpperCase();
            if (abbr.length < 3) abbr = abbr.padEnd(3, 'X');
            prefix = "GEN_" + abbr;
        }

        if (prefix === "GEN") {
            prefix = "GEN_" + chapterId.substring(0, 5).toUpperCase();
        }

        // Ensure uniqueness of prefix
        if (usedPrefixes.has(prefix)) {
            console.warn(`Prefix Collision Detected! ${prefix} for ${chapterId}. Generating random suffix.`);
            prefix = prefix + "_" + Math.floor(Math.random() * 1000);
        }
        usedPrefixes.add(prefix);

        console.log(`Processing Chapter: ${chapterId}, Count: ${questions.length}, Assigned Prefix: ${prefix}`);

        const finalQuestions = [];
        let index = 1;

        // Re-generate IDs for consistency
        [...standardQs, ...otherQs].forEach(q => {
            const newId = `${prefix}-${String(index).padStart(3, '0')}`;

            finalQuestions.push({
                id: newId,
                originalId: q.id || q.originalId,
                questionCode: q.questionCode || q.question_code,
                textMarkdown: q.textMarkdown || q.text || "",
                options: (q.options || []).map(o => ({
                    id: o.id,
                    text: o.text || "",
                    isCorrect: o.isCorrect || o.is_correct || false,
                    imageScale: o.imageScale
                })),
                integerAnswer: q.integerAnswer || q.integer_answer,
                solution: {
                    textSolutionLatex: q.solution?.textSolutionLatex || q.solution?.text_latex || "",
                    videoUrl: q.solution?.videoUrl || q.solution?.video_url,
                    audioExplanationUrl: q.solution?.audioExplanationUrl || q.solution?.audio_url,
                    handwrittenSolutionImageUrl: q.solution?.handwrittenSolutionImageUrl || q.solution?.image_url
                },
                difficulty: q.difficulty || q.meta?.difficulty || "Medium",
                chapterId: chapterId,
                examSource: q.examSource || q.meta?.exam,
                isPYQ: q.isPYQ || q.is_pyq || false,
                isTopPYQ: q.isTopPYQ || q.is_top_pyq || false,
                questionType: q.questionType || q.type || "SCQ",
                conceptTags: (q.conceptTags || []).map(t => ({
                    tagId: t.tagId || t.tag_id,
                    weight: t.weight || 1
                })),
                tagId: q.tagId || q.tag_id
            });
            index++;
        });

        const filePath = path.join(DATA_DIR, `${chapterId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(finalQuestions, null, 2));
    }

    // 5. Clean up "human name" files (Already handled by rmSync, but kept for logic structure)

    // 6. Sync to MongoDB
    console.log("Syncing to MongoDB...");
    try {
        await mongoose.connect(MONGODB_URI);
        const collection = mongoose.connection.db.collection('questions');
        await collection.deleteMany({}); // Start Fresh

        let totalInserted = 0;

        for (const file of fs.readdirSync(DATA_DIR)) {
            if (!file.endsWith('.json') || file === 'conversion_game_data.json') continue;
            const content = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));

            const docs = content.map(q => ({
                _id: q.id,
                question_code: q.questionCode,
                text_markdown: q.textMarkdown,
                type: q.questionType,
                options: q.options.map(o => ({
                    id: o.id,
                    text: o.text,
                    is_correct: o.isCorrect
                })),
                integer_answer: q.integerAnswer,
                tags: q.conceptTags.map(t => ({ tag_id: t.tagId, weight: t.weight })),
                meta: {
                    difficulty: q.difficulty,
                    exam: q.examSource
                },
                chapter_id: q.chapterId,
                is_pyq: q.isPYQ,
                is_top_pyq: q.isTopPYQ,
                exam_source: q.examSource,
                solution: {
                    text_latex: q.solution.textSolutionLatex,
                    video_url: q.solution.videoUrl,
                    audio_url: q.solution.audioExplanationUrl
                }
            }));

            const BATCH_SIZE = 100;
            for (let i = 0; i < docs.length; i += BATCH_SIZE) {
                const batch = docs.slice(i, i + BATCH_SIZE);
                if (batch.length > 0) {
                    await collection.insertMany(batch);
                    totalInserted += batch.length;
                }
            }
        }
        console.log(`MongoDB Sync Complete. Total Documents: ${totalInserted}`);

    } catch (err) {
        console.error("MongoDB Sync Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

restoreAll();
