
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface MergeOperation {
    targetName: string;
    targetId: string;
    sources: string[];
}

const MERGES: MergeOperation[] = [
    {
        targetName: "Basic Concepts of Chemistry (Mole Concept)",
        targetId: "chapter_basic_concepts_mole_concept",
        sources: ["chapter_some_basic_concepts_of_chemistry", "chapter_mole_concept"]
    },
    {
        targetName: "Chemical Bonding",
        targetId: "chapter_chemical_bonding",
        sources: ["chapter_chemical_bonding_and_molecular_structure"]
    },
    {
        targetName: "Periodic Properties",
        targetId: "chapter_periodic_properties",
        sources: ["chapter_classification_of_elements_and_periodicity_in_properties"]
    },
    {
        targetName: "Atomic Structure",
        targetId: "chapter_atomic_structure",
        sources: ["chapter_structure_of_atom"]
    }
];

const DELETES = [
    "chapter_aldehydes_ketones_and_carboxylic_acids"
];

async function refineTaxonomy() {
    console.log("Starting Taxonomy Refinement...");

    // 1. Process Merges
    for (const merge of MERGES) {
        console.log(`\nProcessing Merge: "${merge.targetName}" <- ${merge.sources.join(', ')}`);

        // A. Ensure Target Exists
        const { error: upsertError } = await supabase.from('taxonomy').upsert({
            id: merge.targetId,
            name: merge.targetName,
            type: 'chapter',
            parent_id: null
        });

        if (upsertError) {
            console.error(`❌ Failed to upsert target ${merge.targetName}:`, upsertError.message);
            continue;
        }
        console.log(`✅ Target upserted: ${merge.targetName}`);

        // B. Move Questions
        const { error: qError } = await supabase
            .from('questions')
            .update({ chapter_id: merge.targetId })
            .in('chapter_id', merge.sources);

        if (qError) console.error(`❌ Failed to move questions:`, qError.message);
        else console.log(`✅ Questions moved.`);

        // C. Move Tags (Taxonomy Nodes where parent_id is source)
        const { error: tError } = await supabase
            .from('taxonomy')
            .update({ parent_id: merge.targetId })
            .in('parent_id', merge.sources);

        if (tError) console.error(`❌ Failed to move tags:`, tError.message);
        else console.log(`✅ Tags moved.`);

        // D. Delete Sources
        const { error: dError } = await supabase
            .from('taxonomy')
            .delete()
            .in('id', merge.sources);

        if (dError) console.error(`❌ Failed to delete sources:`, dError.message);
        else console.log(`✅ Sources deleted.`);
    }

    // 2. Process Deletes
    console.log(`\nProcessing Deletes: ${DELETES.join(', ')}`);
    for (const id of DELETES) {
        // Check for questions first
        const { count, error: countError } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('chapter_id', id);

        if (countError) {
            console.error(`❌ Error checking questions for ${id}:`, countError.message);
            continue;
        }

        if (count && count > 0) {
            console.warn(`⚠️ Warning: Chapter ${id} has ${count} questions. NOT deleting to prevent data loss.`);
        } else {
            // Delete child tags first to avoid FK violation
            const { error: tError } = await supabase.from('taxonomy').delete().eq('parent_id', id);
            if (tError) console.error(`❌ Failed to delete child tags for ${id}:`, tError.message);
            else console.log(`✅ Deleted child tags for ${id}`);

            const { error: dError } = await supabase.from('taxonomy').delete().eq('id', id);
            if (dError) console.error(`❌ Failed to delete ${id}:`, dError.message);
            else console.log(`✅ Deleted: ${id}`);
        }
    }

    console.log("\nRefinement Complete.");
}

refineTaxonomy().catch(console.error);
