const { MongoClient } = require('mongodb');
require('dotenv').config();

async function initializeNewDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not found');
  }

  const client = new MongoClient(uri);

  try {
    console.log('🚀 Initializing New Crucible Database Architecture...\n');
    await client.connect();
    console.log('✓ Connected to MongoDB\n');

    const db = client.db('canvas_classes');

    // ============================================
    // 1. CREATE QUESTIONS_V2 COLLECTION
    // ============================================
    console.log('📝 Creating questions_v2 collection...');
    
    try {
      await db.createCollection('questions_v2', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'display_id', 'question_text', 'type', 'solution', 'metadata', 'status'],
            properties: {
              _id: { 
                bsonType: 'string',
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
              },
              display_id: { 
                bsonType: 'string',
                pattern: '^[A-Z]{4}-\\d{3}$'
              },
              type: { 
                enum: ['SCQ', 'MCQ', 'NVT', 'AR', 'MST', 'MTC'] 
              },
              status: { 
                enum: ['draft', 'review', 'published', 'archived'] 
              }
            }
          }
        }
      });
      console.log('✓ questions_v2 collection created');
    } catch (error) {
      if (error.code === 48) {
        console.log('✓ questions_v2 collection already exists');
      } else {
        throw error;
      }
    }

    // Create indexes for questions_v2
    console.log('  Creating indexes...');
    const questionsCollection = db.collection('questions_v2');
    await questionsCollection.createIndex({ display_id: 1 }, { unique: true });
    await questionsCollection.createIndex({ 'metadata.chapter_id': 1, status: 1 });
    await questionsCollection.createIndex({ 'metadata.tags.tag_id': 1 });
    await questionsCollection.createIndex({ status: 1, created_at: -1 });
    await questionsCollection.createIndex({ deleted_at: 1 });
    await questionsCollection.createIndex({ 'metadata.exam_source.year': 1, 'metadata.exam_source.exam': 1 });
    console.log('✓ Indexes created for questions_v2\n');

    // ============================================
    // 2. CREATE ASSETS COLLECTION
    // ============================================
    console.log('🎨 Creating assets collection...');
    
    try {
      await db.createCollection('assets', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'type', 'file', 'used_in'],
            properties: {
              _id: { 
                bsonType: 'string',
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
              },
              type: { 
                enum: ['image', 'svg', 'audio', 'video'] 
              },
              processing_status: { 
                enum: ['pending', 'processing', 'completed', 'failed'] 
              }
            }
          }
        }
      });
      console.log('✓ assets collection created');
    } catch (error) {
      if (error.code === 48) {
        console.log('✓ assets collection already exists');
      } else {
        throw error;
      }
    }

    // Create indexes for assets
    console.log('  Creating indexes...');
    const assetsCollection = db.collection('assets');
    await assetsCollection.createIndex({ 'used_in.questions': 1 });
    await assetsCollection.createIndex({ type: 1, deleted_at: 1 });
    await assetsCollection.createIndex({ 'file.checksum': 1 });
    await assetsCollection.createIndex({ created_at: -1 });
    await assetsCollection.createIndex({ processing_status: 1 });
    console.log('✓ Indexes created for assets\n');

    // ============================================
    // 3. CREATE AUDIT_LOGS COLLECTION
    // ============================================
    console.log('📋 Creating audit_logs collection...');
    
    try {
      await db.createCollection('audit_logs', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'entity_type', 'entity_id', 'action', 'user_id', 'timestamp'],
            properties: {
              _id: { 
                bsonType: 'string',
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
              },
              entity_type: { 
                enum: ['question', 'asset', 'tag', 'chapter'] 
              },
              action: { 
                enum: ['create', 'update', 'delete', 'restore'] 
              }
            }
          }
        }
      });
      console.log('✓ audit_logs collection created');
    } catch (error) {
      if (error.code === 48) {
        console.log('✓ audit_logs collection already exists');
      } else {
        throw error;
      }
    }

    // Create indexes for audit_logs
    console.log('  Creating indexes...');
    const auditLogsCollection = db.collection('audit_logs');
    await auditLogsCollection.createIndex({ entity_id: 1, timestamp: -1 });
    await auditLogsCollection.createIndex({ user_id: 1, timestamp: -1 });
    await auditLogsCollection.createIndex({ timestamp: -1 });
    await auditLogsCollection.createIndex({ entity_type: 1, action: 1 });
    // TTL index - automatically delete logs older than 2 years
    await auditLogsCollection.createIndex({ timestamp: 1 }, { expireAfterSeconds: 63072000 });
    console.log('✓ Indexes created for audit_logs\n');

    // ============================================
    // 4. CREATE CHAPTERS COLLECTION
    // ============================================
    console.log('📚 Creating chapters collection...');
    
    try {
      await db.createCollection('chapters', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'name', 'display_order', 'class_level', 'subject'],
            properties: {
              _id: { 
                bsonType: 'string',
                pattern: '^chapter_[a-z_]+$'
              },
              class_level: { 
                enum: ['11', '12'] 
              }
            }
          }
        }
      });
      console.log('✓ chapters collection created');
    } catch (error) {
      if (error.code === 48) {
        console.log('✓ chapters collection already exists');
      } else {
        throw error;
      }
    }

    // Create indexes for chapters
    console.log('  Creating indexes...');
    const chaptersCollection = db.collection('chapters');
    await chaptersCollection.createIndex({ display_order: 1 });
    await chaptersCollection.createIndex({ class_level: 1, subject: 1 });
    await chaptersCollection.createIndex({ is_active: 1 });
    console.log('✓ Indexes created for chapters\n');

    // ============================================
    // 5. SEED INITIAL CHAPTERS
    // ============================================
    console.log('🌱 Seeding initial chapters...');
    
    const initialChapters = [
      {
        _id: 'chapter_atomic_structure',
        name: 'Atomic Structure',
        display_order: 1,
        question_sequence: 0,
        class_level: '11',
        subject: 'Chemistry',
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
      },
      {
        _id: 'chapter_basic_concepts_mole_concept',
        name: 'Basic Concepts & Mole Concept',
        display_order: 2,
        question_sequence: 0,
        class_level: '11',
        subject: 'Chemistry',
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
      },
      {
        _id: 'chapter_chemical_equilibrium',
        name: 'Chemical Equilibrium',
        display_order: 3,
        question_sequence: 0,
        class_level: '11',
        subject: 'Chemistry',
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
      },
      {
        _id: 'chapter_thermodynamics',
        name: 'Thermodynamics',
        display_order: 4,
        question_sequence: 0,
        class_level: '11',
        subject: 'Chemistry',
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
      }
    ];

    for (const chapter of initialChapters) {
      await chaptersCollection.updateOne(
        { _id: chapter._id },
        { $setOnInsert: chapter },
        { upsert: true }
      );
    }
    console.log(`✓ Seeded ${initialChapters.length} initial chapters\n`);

    // ============================================
    // 6. VERIFICATION
    // ============================================
    console.log('🔍 Verifying setup...');
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const requiredCollections = ['questions_v2', 'assets', 'audit_logs', 'chapters'];
    const allPresent = requiredCollections.every(name => collectionNames.includes(name));
    
    if (allPresent) {
      console.log('✓ All required collections present');
    } else {
      console.log('⚠ Some collections missing');
    }

    // Count documents
    const questionCount = await questionsCollection.countDocuments();
    const assetCount = await assetsCollection.countDocuments();
    const auditLogCount = await auditLogsCollection.countDocuments();
    const chapterCount = await chaptersCollection.countDocuments();

    console.log('\n📊 Current Database State:');
    console.log(`  Questions: ${questionCount}`);
    console.log(`  Assets: ${assetCount}`);
    console.log(`  Audit Logs: ${auditLogCount}`);
    console.log(`  Chapters: ${chapterCount}`);

    console.log('\n✅ Database initialization complete!');
    console.log('\n🎯 Next Steps:');
    console.log('  1. Configure asset storage (Cloudflare R2 or AWS S3)');
    console.log('  2. Update API routes to use new models');
    console.log('  3. Update admin panel UI');
    console.log('  4. Start adding questions through the new system');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    await client.close();
  }
}

initializeNewDatabase().catch(console.error);
