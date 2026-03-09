import mongoose from 'mongoose';
import Flashcard from '../lib/models/Flashcard';

const MONGODB_URI = process.env.MONGODB_URI;

// Chapter name fixes - remove quotes and normalize
const CHAPTER_FIXES: Record<string, string> = {
  '"Alcohols': 'Alcohols, Phenols & ethers',
  '"Aldehydes': 'Aldehydes, Ketones & Acids',
  'Important Compounds of Inorganic ': 'Important Compounds of Inorganic',
};

async function fixChapterNames() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  console.log('🔄 Starting chapter name fixes...\n');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all unique chapter names
    const chapters = await Flashcard.distinct('chapter.name');
    console.log('📊 Found chapters:', chapters);
    console.log('');

    // Fix each problematic chapter
    for (const [oldName, newName] of Object.entries(CHAPTER_FIXES)) {
      console.log(`🔄 Fixing: "${oldName}" → "${newName}"`);
      
      const result = await Flashcard.updateMany(
        { 'chapter.name': oldName },
        { 
          $set: { 
            'chapter.name': newName,
            'chapter.id': newName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            'metadata.updated_at': new Date()
          } 
        }
      );
      
      console.log(`  ✓ Updated ${result.modifiedCount} flashcards`);
    }

    console.log('\n✅ Chapter name fixes completed!');
    
    // Show updated chapter list
    const updatedChapters = await Flashcard.distinct('chapter.name');
    console.log('\n📊 Updated chapter list:');
    updatedChapters.sort().forEach(ch => console.log(`  - ${ch}`));

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixChapterNames();
