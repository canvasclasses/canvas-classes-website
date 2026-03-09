/**
 * One-time migration script to import flashcards from Google Sheets CSV to MongoDB
 * 
 * Usage: npx tsx scripts/migrate-flashcards.ts
 */

import mongoose from 'mongoose';
import Flashcard from '../lib/models/Flashcard';

const MONGODB_URI = process.env.MONGODB_URI;
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vToP-1ka1fN88OCt814c56-7Etbpg9lAjMdknGamiCFwqIRrwtxB6qMcKVz22kWgRJtbeAZvhXF_0E5/pub?output=csv';

// Chapter ID mapping (aligned with your taxonomy)
const CHAPTER_ID_MAP: Record<string, string> = {
  'JEE Main 2026': 'jee_pyq_2026',
  'Solutions': 'ch12_solutions',
  'Electrochemistry': 'ch12_electrochemistry',
  'Chemical Kinetics': 'ch12_kinetics',
  'Surface Chemistry': 'ch12_surface',
  'Solid State': 'ch12_solid_state',
  'Coordination Compounds': 'ch12_coordination',
  'D & F Block': 'ch12_dblock',
  'P Block elements G15-18': 'ch12_pblock',
  'Salt analysis': 'ch12_salt_analysis',
  'Haloalkanes': 'ch12_haloalkanes',
  'Alcohols, Phenols & ethers': 'ch12_alcohols',
  'Aldehydes, Ketones & Acids': 'ch12_carbonyl',
  'Amines': 'ch12_amines',
  'Biomolecules': 'ch12_biomolecules',
  'Stereochemistry': 'ch12_stereochemistry',
  'GOC and POC': 'ch12_goc',
  'Metallurgy': 'ch12_metallurgy',
  'Atomic Structure': 'ch11_atom',
  'Important Ores': 'ch12_ores',
  'Important Alloys': 'ch12_alloys',
  'Most Important Inorganic Trends': 'ch12_inorganic_trends',
};

// Robust CSV Parser (handles multiline fields)
function parseCSVRobust(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(current);
      result.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current);
    result.push(row);
  }
  return result;
}

// Generate flashcard ID
function generateFlashcardId(index: number, category: string): string {
  const prefix = category === 'JEE PYQ' ? 'JEEPYQ' : 
                 category === 'Physical Chemistry' ? 'PHY' :
                 category === 'Organic Chemistry' ? 'ORG' : 'INORG';
  return `FLASH-${prefix}-${String(index).padStart(4, '0')}`;
}

// Get chapter ID from name
function getChapterId(chapterName: string): string {
  return CHAPTER_ID_MAP[chapterName] || chapterName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

async function migrateFlashcards() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  console.log('🔄 Starting flashcards migration...\n');

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Fetch CSV data
    console.log('📥 Fetching flashcards from Google Sheets...');
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    console.log(`✅ Fetched CSV data (${csvText.length} bytes)\n`);

    // Parse CSV
    console.log('🔍 Parsing CSV data...');
    const rows = parseCSVRobust(csvText);
    const dataRows = rows.slice(1); // Skip header
    console.log(`✅ Parsed ${dataRows.length} flashcards\n`);

    // Category counters
    const categoryCounters: Record<string, number> = {
      'JEE PYQ': 1,
      'Physical Chemistry': 1,
      'Organic Chemistry': 1,
      'Inorganic Chemistry': 1,
    };

    // Transform to MongoDB documents
    console.log('🔄 Transforming data...');
    const flashcards = dataRows.map((row) => {
      const [id, classNum, category, chapterName, question, answer, topicName] = row;

      const flashcard_id = generateFlashcardId(categoryCounters[category] || 1, category);
      categoryCounters[category] = (categoryCounters[category] || 1) + 1;

      return {
        flashcard_id,
        chapter: {
          id: getChapterId(chapterName),
          name: chapterName,
          category: category || 'Physical Chemistry',
        },
        topic: {
          name: topicName || 'General',
          order: 0,
        },
        question: question || '',
        answer: answer || '',
        metadata: {
          difficulty: 'medium' as const,
          tags: [topicName, chapterName].filter(Boolean),
          source: category === 'JEE PYQ' ? 'JEE Main' : 'NCERT',
          class_num: parseInt(classNum) || 12,
          created_at: new Date(),
          updated_at: new Date(),
        },
        deleted_at: null,
      };
    });

    console.log(`✅ Transformed ${flashcards.length} flashcards\n`);

    // Check for existing flashcards
    console.log('🔍 Checking for existing flashcards...');
    const existingCount = await Flashcard.countDocuments();
    
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing flashcards in database`);
      console.log('❌ Migration aborted to prevent duplicates');
      console.log('💡 To re-run migration, manually delete existing flashcards first\n');
      await mongoose.disconnect();
      process.exit(1);
    }

    // Insert flashcards in batches
    console.log('💾 Inserting flashcards into MongoDB...');
    const BATCH_SIZE = 100;
    let inserted = 0;

    for (let i = 0; i < flashcards.length; i += BATCH_SIZE) {
      const batch = flashcards.slice(i, i + BATCH_SIZE);
      await Flashcard.insertMany(batch, { ordered: false });
      inserted += batch.length;
      console.log(`  ✓ Inserted ${inserted}/${flashcards.length} flashcards`);
    }

    console.log(`\n✅ Successfully migrated ${inserted} flashcards!\n`);

    // Summary by category
    console.log('📊 Summary by Category:');
    const categories = ['JEE PYQ', 'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'];
    
    for (const category of categories) {
      const count = await Flashcard.countDocuments({ 'chapter.category': category, deleted_at: null });
      console.log(`  ${category}: ${count} flashcards`);
    }

    // Summary by chapter
    console.log('\n📚 Summary by Chapter (top 10):');
    const chapterCounts = await Flashcard.aggregate([
      { $match: { deleted_at: null } },
      { $group: { _id: '$chapter.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    chapterCounts.forEach((chapter) => {
      console.log(`  ${chapter._id}: ${chapter.count} flashcards`);
    });

    console.log('\n✅ Migration completed successfully!');
    console.log('💡 Google Sheets CSV can now be kept as backup\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run migration
migrateFlashcards();
