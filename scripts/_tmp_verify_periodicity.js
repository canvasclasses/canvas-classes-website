const d=require('dotenv');d.config({path:'.env.local'});const m=require('mongoose');
(async()=>{await m.connect(process.env.MONGODB_URI);
const c = m.connection.db.collection('flashcards');
const active = await c.countDocuments({ 'chapter.id': 'ch11_periodic', deleted_at: null });
const deleted = await c.countDocuments({ 'chapter.id': 'ch11_periodic', deleted_at: { $ne: null } });
const cat = await c.aggregate([
  { $match: { 'chapter.id': 'ch11_periodic', deleted_at: null } },
  { $group: { _id: '$chapter.category', n: { $sum: 1 } } }
]).toArray();
const mix = await c.aggregate([
  { $match: { 'chapter.id': 'ch11_periodic', deleted_at: null } },
  { $group: { _id: '$metadata.difficulty', n: { $sum: 1 } } }
]).toArray();
const lenStats = await c.aggregate([
  { $match: { 'chapter.id': 'ch11_periodic', deleted_at: null } },
  { $project: { aLen: { $strLenCP: '$answer' } } },
  { $group: { _id: null, avg: { $avg: '$aLen' }, max: { $max: '$aLen' } } }
]).toArray();
console.log('Active:', active, '| Soft-deleted:', deleted);
console.log('Category:', JSON.stringify(cat));
console.log('Difficulty mix:', JSON.stringify(mix));
console.log('Answer length: avg=' + Math.round(lenStats[0].avg) + ' max=' + lenStats[0].max);
// sample first new card
const s = await c.findOne({ 'chapter.id': 'ch11_periodic', flashcard_id: 'FLASH-INORG-0967' });
console.log('\nSample (FLASH-INORG-0967):');
console.log('Q:', s.question);
console.log('A:', s.answer);
await m.disconnect();})();
