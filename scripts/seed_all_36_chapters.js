const { MongoClient } = require('mongodb');
require('dotenv').config();

async function seedAll36Chapters() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not found');
  }

  const client = new MongoClient(uri);

  try {
    console.log('🌱 Seeding all 36 JEE Chemistry chapters...\n');
    await client.connect();

    const db = client.db('canvas_classes');
    const chaptersCollection = db.collection('chapters');

    // Complete JEE Chemistry syllabus - 36 chapters
    const allChapters = [
      // Class 11 - Physical Chemistry
      { name: 'Some Basic Concepts of Chemistry', class_level: '11', subject: 'Physical Chemistry', order: 1 },
      { name: 'Structure of Atom', class_level: '11', subject: 'Physical Chemistry', order: 2 },
      { name: 'Classification of Elements and Periodicity', class_level: '11', subject: 'Physical Chemistry', order: 3 },
      { name: 'Chemical Bonding and Molecular Structure', class_level: '11', subject: 'Physical Chemistry', order: 4 },
      { name: 'States of Matter', class_level: '11', subject: 'Physical Chemistry', order: 5 },
      { name: 'Thermodynamics', class_level: '11', subject: 'Physical Chemistry', order: 6 },
      { name: 'Equilibrium', class_level: '11', subject: 'Physical Chemistry', order: 7 },
      { name: 'Redox Reactions', class_level: '11', subject: 'Physical Chemistry', order: 8 },
      
      // Class 11 - Inorganic Chemistry
      { name: 'Hydrogen', class_level: '11', subject: 'Inorganic Chemistry', order: 9 },
      { name: 's-Block Elements', class_level: '11', subject: 'Inorganic Chemistry', order: 10 },
      { name: 'p-Block Elements', class_level: '11', subject: 'Inorganic Chemistry', order: 11 },
      
      // Class 11 - Organic Chemistry
      { name: 'Organic Chemistry - Basic Principles', class_level: '11', subject: 'Organic Chemistry', order: 12 },
      { name: 'Hydrocarbons', class_level: '11', subject: 'Organic Chemistry', order: 13 },
      { name: 'Environmental Chemistry', class_level: '11', subject: 'Organic Chemistry', order: 14 },
      
      // Class 12 - Physical Chemistry
      { name: 'Solid State', class_level: '12', subject: 'Physical Chemistry', order: 15 },
      { name: 'Solutions', class_level: '12', subject: 'Physical Chemistry', order: 16 },
      { name: 'Electrochemistry', class_level: '12', subject: 'Physical Chemistry', order: 17 },
      { name: 'Chemical Kinetics', class_level: '12', subject: 'Physical Chemistry', order: 18 },
      { name: 'Surface Chemistry', class_level: '12', subject: 'Physical Chemistry', order: 19 },
      
      // Class 12 - Inorganic Chemistry
      { name: 'General Principles and Processes of Isolation of Elements', class_level: '12', subject: 'Inorganic Chemistry', order: 20 },
      { name: 'p-Block Elements (Group 15-18)', class_level: '12', subject: 'Inorganic Chemistry', order: 21 },
      { name: 'd and f Block Elements', class_level: '12', subject: 'Inorganic Chemistry', order: 22 },
      { name: 'Coordination Compounds', class_level: '12', subject: 'Inorganic Chemistry', order: 23 },
      
      // Class 12 - Organic Chemistry
      { name: 'Haloalkanes and Haloarenes', class_level: '12', subject: 'Organic Chemistry', order: 24 },
      { name: 'Alcohols, Phenols and Ethers', class_level: '12', subject: 'Organic Chemistry', order: 25 },
      { name: 'Aldehydes, Ketones and Carboxylic Acids', class_level: '12', subject: 'Organic Chemistry', order: 26 },
      { name: 'Amines', class_level: '12', subject: 'Organic Chemistry', order: 27 },
      { name: 'Biomolecules', class_level: '12', subject: 'Organic Chemistry', order: 28 },
      { name: 'Polymers', class_level: '12', subject: 'Organic Chemistry', order: 29 },
      { name: 'Chemistry in Everyday Life', class_level: '12', subject: 'Organic Chemistry', order: 30 },
      
      // Additional Important Topics
      { name: 'Atomic Structure', class_level: '11', subject: 'Physical Chemistry', order: 31 },
      { name: 'Mole Concept', class_level: '11', subject: 'Physical Chemistry', order: 32 },
      { name: 'Stoichiometry', class_level: '11', subject: 'Physical Chemistry', order: 33 },
      { name: 'Gaseous State', class_level: '11', subject: 'Physical Chemistry', order: 34 },
      { name: 'Ionic Equilibrium', class_level: '11', subject: 'Physical Chemistry', order: 35 },
      { name: 'Chemical Equilibrium', class_level: '11', subject: 'Physical Chemistry', order: 36 }
    ];

    console.log(`Preparing to seed ${allChapters.length} chapters...\n`);

    const chapterDocuments = allChapters.map((ch, index) => {
      // Create clean chapter ID (only lowercase letters and underscores)
      const chapterId = `chapter_${ch.name.toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z_]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')}`;
      
      return {
        _id: chapterId,
        name: ch.name,
        display_order: ch.order,
        question_sequence: 0,
        class_level: ch.class_level,
        subject: ch.subject,
        stats: {
          total_questions: 0,
          published_questions: 0,
          draft_questions: 0,
          avg_difficulty: 'Medium',
          pyq_count: 0
        },
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };
    });

    // Delete existing chapters
    console.log('Removing existing chapters...');
    await chaptersCollection.deleteMany({});
    console.log('✓ Cleared existing chapters\n');

    // Insert all chapters
    console.log('Inserting 36 chapters...');
    await chaptersCollection.insertMany(chapterDocuments);
    console.log('✓ Inserted all chapters\n');

    // Verify
    const count = await chaptersCollection.countDocuments();
    console.log(`📊 Verification: ${count} chapters in database\n`);

    // Display by class and subject
    console.log('📚 Chapter Organization:\n');
    
    const class11Physical = chapterDocuments.filter(ch => ch.class_level === '11' && ch.subject === 'Physical Chemistry');
    const class11Inorganic = chapterDocuments.filter(ch => ch.class_level === '11' && ch.subject === 'Inorganic Chemistry');
    const class11Organic = chapterDocuments.filter(ch => ch.class_level === '11' && ch.subject === 'Organic Chemistry');
    const class12Physical = chapterDocuments.filter(ch => ch.class_level === '12' && ch.subject === 'Physical Chemistry');
    const class12Inorganic = chapterDocuments.filter(ch => ch.class_level === '12' && ch.subject === 'Inorganic Chemistry');
    const class12Organic = chapterDocuments.filter(ch => ch.class_level === '12' && ch.subject === 'Organic Chemistry');

    console.log('Class 11 - Physical Chemistry:', class11Physical.length);
    console.log('Class 11 - Inorganic Chemistry:', class11Inorganic.length);
    console.log('Class 11 - Organic Chemistry:', class11Organic.length);
    console.log('Class 12 - Physical Chemistry:', class12Physical.length);
    console.log('Class 12 - Inorganic Chemistry:', class12Inorganic.length);
    console.log('Class 12 - Organic Chemistry:', class12Organic.length);

    console.log('\n✅ All 36 chapters seeded successfully!');

    // Save to JSON for reference
    const fs = require('fs');
    const path = require('path');
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dataDir, 'all_36_chapters.json'),
      JSON.stringify(chapterDocuments, null, 2)
    );
    console.log('✓ Saved to data/all_36_chapters.json');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await client.close();
  }
}

seedAll36Chapters().catch(console.error);
