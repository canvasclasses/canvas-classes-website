/**
 * reclassify_question.js
 * 
 * Safely moves a question from one chapter to another.
 * Updates: chapter_id, display_id (new prefix + sequence), tags (clears chapter-specific ones).
 * Does NOT change: _id (UUID), R2 asset paths, audit logs, question content.
 * 
 * Usage:
 *   node scripts/reclassify_question.js <display_id> <new_chapter_id> [new_tags_json]
 * 
 * Examples:
 *   node scripts/reclassify_question.js ATOM-235 chapter_classification_of_elements
 *   node scripts/reclassify_question.js ATOM-235 chapter_classification_of_elements '[{"tag_id":"tag_periodic_1","weight":1}]'
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

// Chapter prefix map (mirrors chaptersConfig.ts)
const CHAPTER_PREFIXES = {
  'chapter_some_basic_concepts':          'MOLE',
  'chapter_structure_of_atom':            'ATOM',
  'chapter_states_of_matter':             'GAS',
  'chapter_thermodynamics':               'THER',
  'chapter_equilibrium':                  'EQUI',
  'chapter_classification_of_elements':   'PERI',
  'chapter_chemical_bonding':             'BOND',
  'chapter_hydrogen':                     'H2',
  'chapter_s_block':                      'SBLO',
  'chapter_p_block_11':                   'PB11',
  'chapter_organic_chemistry_basic':      'GOC',
  'chapter_hydrocarbons':                 'HC',
  'chapter_environmental_chemistry':      'ENV',
  'chapter_solutions':                    'SOLN',
  'chapter_electrochemistry':             'ELEC',
  'chapter_chemical_kinetics':            'KINE',
  'chapter_surface_chemistry':            'SURF',
  'chapter_general_principles_processes': 'META',
  'chapter_p_block_12':                   'PB12',
  'chapter_d_f_block':                    'DFBL',
  'chapter_coordination_compounds':       'COOR',
  'chapter_haloalkanes_haloarenes':       'HALO',
  'chapter_alcohols_phenols_ethers':      'ALCO',
  'chapter_aldehydes_ketones':            'CARB',
  'chapter_amines':                       'AMIN',
  'chapter_biomolecules':                 'BIO',
  'chapter_polymers':                     'POLY',
  'chapter_chemistry_everyday_life':      'DAIL',
  'chapter_salt_analysis':                'SALT',
  'chapter_stereochemistry':              'STER',
  'chapter_aromatic_compounds':           'AROM',
  'chapter_redox_reactions':              'REDX',
  'chapter_ionic_equilibrium':            'ION',
};

async function reclassify(displayId, newChapterId, newTagsJson) {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  // 1. Find the question
  const question = await db.collection('questions_v2').findOne({ display_id: displayId });
  if (!question) {
    console.error(`❌ Question "${displayId}" not found`);
    process.exit(1);
  }
  const oldChapterId = question.metadata.chapter_id;
  console.log(`\n📋 Question: ${displayId}`);
  console.log(`   Current chapter: ${oldChapterId}`);
  console.log(`   New chapter:     ${newChapterId}`);

  if (oldChapterId === newChapterId) {
    console.log('⚠️  Same chapter — nothing to do.');
    process.exit(0);
  }

  // 2. Validate new chapter exists in DB
  const newChapter = await db.collection('chapters').findOne({ _id: newChapterId });
  if (!newChapter) {
    console.error(`❌ Chapter "${newChapterId}" not found in DB. Create it first.`);
    process.exit(1);
  }

  // 3. Generate new display_id
  const prefix = CHAPTER_PREFIXES[newChapterId];
  if (!prefix) {
    console.error(`❌ No prefix defined for chapter "${newChapterId}". Add it to CHAPTER_PREFIXES in this script.`);
    process.exit(1);
  }
  const newSequence = (newChapter.question_sequence || 0) + 1;
  const newDisplayId = `${prefix}-${String(newSequence).padStart(3, '0')}`;

  // 4. Check new display_id doesn't already exist
  const conflict = await db.collection('questions_v2').findOne({ display_id: newDisplayId });
  if (conflict) {
    console.error(`❌ display_id "${newDisplayId}" already exists. Chapter sequence may be out of sync.`);
    process.exit(1);
  }

  // 5. Parse new tags (optional — if not supplied, clear chapter-specific tags)
  let newTags = [];
  if (newTagsJson) {
    try {
      newTags = JSON.parse(newTagsJson);
    } catch (e) {
      console.error('❌ Invalid JSON for tags');
      process.exit(1);
    }
  } else {
    console.log('⚠️  No tags supplied — tags will be cleared. Pass tags as 3rd argument if needed.');
  }

  console.log(`\n🔄 Changes to apply:`);
  console.log(`   display_id:          ${displayId} → ${newDisplayId}`);
  console.log(`   metadata.chapter_id: ${oldChapterId} → ${newChapterId}`);
  console.log(`   metadata.tags:       ${JSON.stringify(newTags)}`);
  console.log(`   Old chapter stats:   total_questions -1`);
  console.log(`   New chapter stats:   total_questions +1, question_sequence → ${newSequence}`);

  // 6. Confirm
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve => rl.question('\nProceed? (yes/no): ', answer => {
    rl.close();
    if (answer.trim().toLowerCase() !== 'yes') {
      console.log('Aborted.');
      process.exit(0);
    }
    resolve();
  }));

  // 7. Apply all changes atomically (as much as Mongo allows without transactions)
  // Update question
  await db.collection('questions_v2').updateOne(
    { _id: question._id },
    {
      $set: {
        display_id: newDisplayId,
        'metadata.chapter_id': newChapterId,
        'metadata.tags': newTags,
        updated_at: new Date(),
        updated_by: 'admin-reclassify-script',
      }
    }
  );

  // Update old chapter stats
  await db.collection('chapters').updateOne(
    { _id: oldChapterId },
    {
      $inc: {
        'stats.total_questions': -1,
        'stats.published_questions': question.status === 'published' ? -1 : 0,
        'stats.draft_questions': question.status === 'draft' ? -1 : 0,
      }
    }
  );

  // Update new chapter stats + advance sequence
  await db.collection('chapters').updateOne(
    { _id: newChapterId },
    {
      $inc: {
        question_sequence: 1,
        'stats.total_questions': 1,
        'stats.published_questions': question.status === 'published' ? 1 : 0,
        'stats.draft_questions': question.status === 'draft' ? 1 : 0,
      }
    }
  );

  // 8. Write audit log
  const { v4: uuidv4 } = require('uuid');
  await db.collection('auditlogs').insertOne({
    _id: uuidv4(),
    entity_type: 'question',
    entity_id: question._id,
    action: 'reclassify',
    changes: [
      { field: 'display_id', old_value: displayId, new_value: newDisplayId },
      { field: 'metadata.chapter_id', old_value: oldChapterId, new_value: newChapterId },
      { field: 'metadata.tags', old_value: question.metadata.tags, new_value: newTags },
    ],
    user_id: 'admin',
    user_email: 'admin@canvasclasses.com',
    timestamp: new Date(),
    can_rollback: true,
  });

  console.log(`\n✅ Done!`);
  console.log(`   Question is now: ${newDisplayId} in chapter ${newChapterId}`);
  console.log(`   R2 assets are unaffected (they use the internal UUID, not display_id)`);
  console.log(`   Refresh the admin page to see the change.`);

  process.exit(0);
}

const [,, displayId, newChapterId, newTagsJson] = process.argv;
if (!displayId || !newChapterId) {
  console.log('Usage: node scripts/reclassify_question.js <display_id> <new_chapter_id> [new_tags_json]');
  console.log('Example: node scripts/reclassify_question.js ATOM-235 chapter_classification_of_elements');
  process.exit(1);
}

reclassify(displayId, newChapterId, newTagsJson).catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
