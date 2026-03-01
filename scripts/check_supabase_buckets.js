const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.log('Supabase not configured — no URL or key in .env.local');
    process.exit(0);
}

console.log('Supabase URL:', url);

const supabase = createClient(url, key);

async function main() {
    // List all buckets
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    if (bErr) {
        console.log('Error listing buckets:', bErr.message);
        return;
    }

    console.log('\n=== SUPABASE STORAGE BUCKETS ===');
    if (!buckets || buckets.length === 0) {
        console.log('No buckets found — storage is completely empty.');
        return;
    }

    console.log(`Found ${buckets.length} bucket(s)\n`);

    for (const bucket of buckets) {
        console.log(`📦 Bucket: "${bucket.name}" | Public: ${bucket.public} | Created: ${bucket.created_at}`);

        // List files in root of each bucket
        const { data: files, error: fErr } = await supabase.storage
            .from(bucket.name)
            .list('', { limit: 30 });

        if (fErr) {
            console.log(`  ⚠️ Error listing files: ${fErr.message}`);
            continue;
        }

        if (!files || files.length === 0) {
            console.log('  📭 EMPTY — no files in this bucket');
        } else {
            let totalFiles = 0;
            for (const f of files) {
                if (f.id) {
                    // It's a file
                    totalFiles++;
                    const size = f.metadata && f.metadata.size ? f.metadata.size : 'unknown';
                    console.log(`    📄 ${f.name} | ${size} bytes | ${f.updated_at || ''}`);
                } else {
                    // It's a folder — check inside
                    const { data: subFiles } = await supabase.storage
                        .from(bucket.name)
                        .list(f.name, { limit: 100 });
                    const count = subFiles ? subFiles.length : 0;
                    totalFiles += count;
                    console.log(`    📁 ${f.name}/ (${count} items inside)`);
                }
            }
            console.log(`  Total items: ~${totalFiles}`);
        }
        console.log('');
    }
}

main().catch(err => console.error('Script error:', err));
