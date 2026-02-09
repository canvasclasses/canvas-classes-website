
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { CHAPTER_CONCEPT_MAP, GENERIC_TAGS } from '../app/the-crucible/taxonomy/chapter-concepts';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3puUwydA1VIxVHZeryvOBQerMiwjdzG40FcgvVz1u2aDfdHQiRhAVwycdMYjEIlOFQkO6PIavbBjj/pub?output=csv';

// --- CSV Helper Functions (Inlined to avoid import issues) ---
function parseCSV(csvText: string): Record<string, string>[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    const headers = parseCSVLine(lines[0]);
    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const row: Record<string, string> = {};
        headers.forEach((header, i) => {
            row[header.trim()] = values[i]?.trim() || '';
        });
        return row;
    });
}

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
        else current += char;
    }
    result.push(current);
    return result;
}

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

async function migrateTaxonomy() {
    console.log('Starting Taxonomy Migration (Merged Mode)...');

    // 1. Insert Generic Tags
    console.log('Migrating Generic Tags...');
    for (const tag of GENERIC_TAGS) {
        await supabase.from('taxonomy').upsert({
            id: tag.id,
            name: tag.name,
            type: 'topic',
            parent_id: null
        }, { onConflict: 'id' });
    }

    // 2. Fetch Master Chapter List from CSV
    console.log('Fetching Master Chapter List from Google Sheets...');
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    // Unique chapters from CSV
    const csvChapters = new Set<string>();
    rows.forEach(row => {
        if (row['Chapter Name']) csvChapters.add(row['Chapter Name']);
    });

    console.log(`Found ${csvChapters.size} chapters in CSV.`);

    // 3. Migrate Chapters (CSV + Existing Map)
    const allChapters = new Set([...csvChapters, ...Object.keys(CHAPTER_CONCEPT_MAP)]);
    const chapterIdMap = new Map<string, string>(); // Name -> ID

    for (const chapterName of allChapters) {
        const chapterId = `chapter_${slugify(chapterName)}`;
        chapterIdMap.set(chapterName, chapterId);

        // Insert Chapter
        const { error } = await supabase.from('taxonomy').upsert({
            id: chapterId,
            name: chapterName,
            type: 'chapter',
            parent_id: null
        }, { onConflict: 'id' });

        if (error) console.error(`Error saving chapter ${chapterName}:`, error.message);
        else console.log(`Saved Chapter: ${chapterName}`);
    }

    // 4. Migrate Tags (Map Tags to Chapters)
    console.log('Linking Tags to Chapters...');
    for (const [chapterName, tags] of Object.entries(CHAPTER_CONCEPT_MAP)) {
        // Find ID (Direct match or try to find a similar one from CSV?)
        // For now, we assume the keys in CHAPTER_CONCEPT_MAP match the CSV names roughly, 
        // or we use the ID we just generated for them.
        const chapterId = chapterIdMap.get(chapterName);

        if (!chapterId) {
            console.warn(`Skipping tags for unknown chapter: ${chapterName}`);
            continue;
        }

        for (const tag of tags) {
            const { error } = await supabase.from('taxonomy').upsert({
                id: tag.id,
                name: tag.name,
                type: 'topic',
                parent_id: chapterId
            }, { onConflict: 'id' });

            if (error) console.error(`Error saving tag ${tag.name}:`, error.message);
        }
    }

    console.log('Taxonomy Migration Complete!');
}

migrateTaxonomy().catch(console.error);
