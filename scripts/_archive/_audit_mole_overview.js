require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const total = await col.countDocuments({ 'metadata.chapter_id': 'ch11_mole', deleted_at: null });
  console.log('Total ch11_mole (not deleted):', total);

  // breakdown by status
  const byStatus = await col.aggregate([
    { $match: { 'metadata.chapter_id': 'ch11_mole', deleted_at: null } },
    { $group: { _id: '$status', n: { $sum: 1 } } }
  ]).toArray();
  console.log('By status:', byStatus);

  // breakdown of difficultyLevel
  const byDL = await col.aggregate([
    { $match: { 'metadata.chapter_id': 'ch11_mole', deleted_at: null } },
    { $group: { _id: '$metadata.difficultyLevel', n: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).toArray();
  console.log('By difficultyLevel:', byDL);

  // primary topic tag distribution (taking first tag)
  const byTag = await col.aggregate([
    { $match: { 'metadata.chapter_id': 'ch11_mole', deleted_at: null } },
    { $project: { primary: { $arrayElemAt: ['$metadata.tags.tag_id', 0] }, microConcept: '$metadata.microConcept' } },
    { $group: { _id: '$primary', n: { $sum: 1 } } },
    { $sort: { n: -1 } }
  ]).toArray();
  console.log('By primary tag (first tag_id):', byTag);

  // questions WITHOUT any tags
  const noTags = await col.countDocuments({
    'metadata.chapter_id': 'ch11_mole',
    deleted_at: null,
    $or: [ { 'metadata.tags': { $exists: false } }, { 'metadata.tags': { $size: 0 } } ]
  });
  console.log('No tags at all:', noTags);

  // missing microConcept
  const noMicro = await col.countDocuments({
    'metadata.chapter_id': 'ch11_mole', deleted_at: null,
    $or: [ { 'metadata.microConcept': { $exists: false } }, { 'metadata.microConcept': null }, { 'metadata.microConcept': '' } ]
  });
  console.log('Missing microConcept:', noMicro);

  // missing questionNature
  const noQN = await col.countDocuments({
    'metadata.chapter_id': 'ch11_mole', deleted_at: null,
    $or: [ { 'metadata.questionNature': { $exists: false } }, { 'metadata.questionNature': null }, { 'metadata.questionNature': '' } ]
  });
  console.log('Missing questionNature:', noQN);

  // PYQs and their metadata completeness
  const pyqCount = await col.countDocuments({
    'metadata.chapter_id': 'ch11_mole', deleted_at: null, 'metadata.sourceType': 'PYQ'
  });
  console.log('sourceType=PYQ:', pyqCount);
  const pyqMissingYear = await col.countDocuments({
    'metadata.chapter_id': 'ch11_mole', deleted_at: null, 'metadata.sourceType': 'PYQ',
    $or: [ { 'metadata.examDetails.year': { $exists: false } }, { 'metadata.examDetails.year': null } ]
  });
  console.log('PYQ missing examDetails.year:', pyqMissingYear);
  const pyqMissingExam = await col.countDocuments({
    'metadata.chapter_id': 'ch11_mole', deleted_at: null, 'metadata.sourceType': 'PYQ',
    $or: [ { 'metadata.examDetails.exam': { $exists: false } }, { 'metadata.examDetails.exam': null } ]
  });
  console.log('PYQ missing examDetails.exam:', pyqMissingExam);

  // JEE Main PYQs missing month/shift
  const jeeMainPyqMissingMonth = await col.countDocuments({
    'metadata.chapter_id': 'ch11_mole', deleted_at: null, 'metadata.sourceType': 'PYQ',
    'metadata.examDetails.exam': 'JEE_Main',
    $or: [ { 'metadata.examDetails.month': { $exists: false } }, { 'metadata.examDetails.month': null } ]
  });
  console.log('JEE_Main PYQ missing month:', jeeMainPyqMissingMonth);
  const jeeMainPyqMissingShift = await col.countDocuments({
    'metadata.chapter_id': 'ch11_mole', deleted_at: null, 'metadata.sourceType': 'PYQ',
    'metadata.examDetails.exam': 'JEE_Main',
    $or: [ { 'metadata.examDetails.shift': { $exists: false } }, { 'metadata.examDetails.shift': null } ]
  });
  console.log('JEE_Main PYQ missing shift:', jeeMainPyqMissingShift);

  // sourceType breakdown
  const bySrc = await col.aggregate([
    { $match: { 'metadata.chapter_id': 'ch11_mole', deleted_at: null } },
    { $group: { _id: '$metadata.sourceType', n: { $sum: 1 } } }
  ]).toArray();
  console.log('By sourceType:', bySrc);

  // questionNature breakdown
  const byQN = await col.aggregate([
    { $match: { 'metadata.chapter_id': 'ch11_mole', deleted_at: null } },
    { $group: { _id: '$metadata.questionNature', n: { $sum: 1 } } }
  ]).toArray();
  console.log('By questionNature:', byQN);

  // questions where primary tag is missing or doesn't match ch11_mole prefix
  const badPrimary = await col.aggregate([
    { $match: { 'metadata.chapter_id': 'ch11_mole', deleted_at: null } },
    { $project: { display_id: 1, primary: { $arrayElemAt: ['$metadata.tags.tag_id', 0] } } },
    { $match: { $or: [ { primary: null }, { primary: { $not: { $regex: '^tag_mole_' } } } ] } },
    { $limit: 10 }
  ]).toArray();
  console.log('Primary tag not tag_mole_*:', badPrimary);

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
