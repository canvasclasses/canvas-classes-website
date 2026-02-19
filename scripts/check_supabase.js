const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
    console.log("Checking Supabase Question Count...");

    const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Supabase Error:", error);
    } else {
        console.log(`Total questions in Supabase: ${count}`);
    }
}

checkSupabase();
