
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const CHAPTER_ID = 'chapter_equilibrium';

async function deleteChapter() {
    console.log(`Starting deletion of chapter: ${CHAPTER_ID}...`);

    // 1. Unlink Questions (Set chapter_id to NULL)
    const { data: unlinkedQuestions, error: qError } = await supabase
        .from('questions')
        .update({ chapter_id: null })
        .eq('chapter_id', CHAPTER_ID)
        .select('id');

    if (qError) {
        console.error("❌ Failed to unlink questions:", qError.message);
        return;
    }
    console.log(`✅ Unlinked ${unlinkedQuestions?.length || 0} questions from ${CHAPTER_ID}.`);

    // 2. Delete Child Tags
    const { count: tCount, error: tError } = await supabase
        .from('taxonomy')
        .delete({ count: 'exact' })
        .eq('parent_id', CHAPTER_ID);

    if (tError) {
        console.error("❌ Failed to delete child tags:", tError.message);
        return;
    }
    console.log(`✅ Deleted ${tCount} child tags.`);

    // 3. Delete Chapter
    const { error: dError } = await supabase
        .from('taxonomy')
        .delete()
        .eq('id', CHAPTER_ID);

    if (dError) {
        console.error("❌ Failed to delete chapter:", dError.message);
        return;
    }
    console.log(`✅ Successfully deleted chapter: ${CHAPTER_ID}`);
}

deleteChapter().catch(console.error);
