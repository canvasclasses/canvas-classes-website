
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log("URL:", supabaseUrl ? "Found" : "Missing");
console.log("Key:", supabaseKey ? "Found" : "Missing");

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking Supabase connectivity...");

    // 1. Check Questions table (Known good)
    const { error: qError } = await supabase.from('questions').select('id').limit(1);
    if (qError) console.log("Questions table check failed:", qError.message);
    else console.log("Questions table check passed.");

    // 2. Check Taxonomy table stats
    console.log("Checking Taxonomy table...");

    // Count total
    const { count, error: countError } = await supabase.from('taxonomy').select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("❌ Error accessing taxonomy table:", countError.message);
    } else {
        console.log(`✅ Total Rows: ${count}`);
    }

    // Check Chapters
    const { data: chapters, error: chapterError } = await supabase
        .from('taxonomy')
        .select('id, name, sequence_order')
        .eq('type', 'chapter')
        .order('sequence_order', { ascending: true });

    if (chapterError) console.error("Error fetching chapters:", chapterError.message);
    else {
        console.log(`Found ${chapters.length} chapters (Sorted):`);
        chapters.forEach(c => console.log(`- [${c.sequence_order}] "${c.name}" (${c.id})`));
    }
}

check().catch(console.error);
