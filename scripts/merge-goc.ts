
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET = {
    id: 'chapter_general_organic_chemistry_goc',
    name: 'General Organic Chemistry (GOC)',
    type: 'chapter',
    sequence_order: 16, // Use GOC's slot
    class_level: '11'
};

const SOURCES = [
    'chapter_goc',
    'chapter_general_organic_chemistry'
];

async function mergeGOC() {
    console.log(`Starting merge of GOC chapters...`);

    // 1. Create Target Chapter
    const { error: tError } = await supabase
        .from('taxonomy')
        .upsert(TARGET, { onConflict: 'id' });

    if (tError) {
        console.error("❌ Failed to upsert target:", tError.message);
        return;
    }
    console.log(`✅ Upserted target: ${TARGET.name}`);

    // 2. Move Questions
    const { data: movedQuestions, error: qError } = await supabase
        .from('questions')
        .update({ chapter_id: TARGET.id })
        .in('chapter_id', SOURCES)
        .select('id');

    if (qError) {
        console.error("❌ Failed to move questions:", qError.message);
    } else {
        console.log(`✅ Moved ${movedQuestions?.length || 0} questions to ${TARGET.id}.`);
    }

    // 3. Move Tags (Update parent_id)
    const { data: movedTags, error: tagError } = await supabase
        .from('taxonomy')
        .update({ parent_id: TARGET.id })
        .in('parent_id', SOURCES)
        .select('id');

    if (tagError) {
        console.error("❌ Failed to move tags:", tagError.message);
    } else {
        console.log(`✅ Moved ${movedTags?.length || 0} tags to ${TARGET.id}.`);
    }

    // 4. Delete Sources
    // Ensure we don't delete if merge failed partially, but since we moved everything, it should be safe.
    // Also need to handle if TARGET.id collision (not likely here as it's new).

    // Safety check: Ensure no questions left in sources
    const { data: remainingQuestions } = await supabase
        .from('questions')
        .select('id')
        .in('chapter_id', SOURCES);

    if (remainingQuestions && remainingQuestions.length > 0) {
        console.error(`❌ Aborting delete: ${remainingQuestions.length} questions still remain in source chapters.`);
        return;
    }

    const { error: dError } = await supabase
        .from('taxonomy')
        .delete()
        .in('id', SOURCES);

    if (dError) {
        console.error("❌ Failed to delete sources:", dError.message);
    } else {
        console.log(`✅ Deleted sources: ${SOURCES.join(', ')}`);
    }

    console.log("Merge Complete.");
}

mergeGOC().catch(console.error);
