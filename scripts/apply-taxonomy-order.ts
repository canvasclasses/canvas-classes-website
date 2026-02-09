
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Define standard JEE Sequence
// Items in this list will be ordered 1, 2, 3...
// Unmatched items will remain at default (9999) or be logged.
const STANDARD_SEQUENCE = [
    // --- Class 11 ---
    { name: "Basic Concepts of Chemistry (Mole Concept)", class: '11' },
    { name: "Mole Concept", class: '11' }, // Legacy/Alias
    { name: "Atomic Structure", class: '11' },
    { name: "Structure of Atom", class: '11' }, // Legacy/Alias
    { name: "Periodic Properties", class: '11' },
    { name: "Chemical Bonding", class: '11' },
    { name: "States of Matter", class: '11' },
    { name: "Thermodynamics", class: '11' },
    { name: "Chemical equilibrium", class: '11' },
    { name: "Ionic Equilibrium", class: '11' },
    { name: "Equilibrium", class: '11' }, // Generic
    { name: "Redox Reactions", class: '11' },
    { name: "Hydrogen", class: '11' },
    { name: "S Block", class: '11' },
    { name: "P Block (Group 13 & 14))", class: '11' }, // Note double paren in DB
    { name: "GOC", class: '11' },
    { name: "General Organic Chemistry", class: '11' },
    { name: "Stereochemistry", class: '11' }, // Usually late 11th or early 12th, placing here
    { name: "Hydrocarbons", class: '11' },
    { name: "Aromatic Compounds", class: '11' },
    { name: "Environmental Chemistry", class: '11' },

    // --- Class 12 ---
    { name: "Solid State", class: '12' },
    { name: "Solutions", class: '12' },
    { name: "Electrochemistry", class: '12' },
    { name: "Chemical Kinetics", class: '12' },
    { name: "Surface Chemistry", class: '12' },
    { name: "Metallurgy", class: '12' },
    { name: "P Block - 12th", class: '12' },
    { name: "D & F Block", class: '12' },
    { name: "Coordination Compounds", class: '12' },
    { name: "Haloalkanes and Haloarenes", class: '12' },
    { name: "Haloalkanes, Alcohols & Ethers", class: '12' }, // Legacy/Merged
    { name: "Alcohols, Phenols and Ethers", class: '12' },
    { name: "Aldehydes & Ketones", class: '12' },
    { name: "Carboxylic Acids & Derivatives", class: '12' },
    { name: "Amines", class: '12' },
    { name: "Biomolecules", class: '12' },
    { name: "Polymers", class: '12' },
    { name: "Chemistry in Everyday Life", class: '12' },
    { name: "Salt Analysis", class: '12' } // Practical, usually end
];

async function applyOrder() {
    console.log("Applying Taxonomy Order...");

    // 1. Fetch all chapters
    const { data: chapters, error } = await supabase
        .from('taxonomy')
        .select('*')
        .eq('type', 'chapter');

    if (error) {
        console.error("❌ Failed to fetch chapters:", error.message);
        return;
    }

    console.log(`Found ${chapters.length} chapters.`);

    // 2. Update each chapter
    let updatedCount = 0;
    for (const chapter of chapters) {
        const match = STANDARD_SEQUENCE.find(s => s.name.toLowerCase() === chapter.name.toLowerCase())
            || STANDARD_SEQUENCE.find(s => chapter.name.toLowerCase().includes(s.name.toLowerCase())); // Fuzzy match fallback

        if (match) {
            const index = STANDARD_SEQUENCE.indexOf(match) + 1; // 1-based index
            const { error: updateError } = await supabase
                .from('taxonomy')
                .update({
                    sequence_order: index,
                    class_level: match.class
                })
                .eq('id', chapter.id);

            if (updateError) {
                console.error(`❌ Failed to update ${chapter.name}:`, updateError.message);
            } else {
                console.log(`✅ Updated "${chapter.name}" -> Order: ${index}, Class: ${match.class}`);
                updatedCount++;
            }
        } else {
            console.warn(`⚠️ No match found for "${chapter.name}". Leaving at default order.`);
        }
    }

    console.log(`\nUpdate Complete. Updated ${updatedCount} / ${chapters.length} chapters.`);
}

applyOrder().catch(console.error);
