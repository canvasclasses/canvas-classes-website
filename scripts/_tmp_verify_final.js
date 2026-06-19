const d=require('dotenv');d.config({path:'.env.local'});const m=require('mongoose');
(async()=>{await m.connect(process.env.MONGODB_URI);
const c = m.connection.db.collection('flashcards');
const chapters = ['ch11_mole','ch11_ionic_eq','ch11_chem_eq','ch11_bonding','ch11_thermo','ch11_redox','ch11_periodic','ch11_hydrocarbon'];
let total = 0; let totalLen = 0;
console.log('Chapter             Active  AvgLen  MaxLen  Mix');
console.log('────────────────────────────────────────────────────────');
for (const id of chapters) {
  const n = await c.countDocuments({ 'chapter.id': id, deleted_at: null });
  const stats = await c.aggregate([
    { $match: { 'chapter.id': id, deleted_at: null } },
    { $project: { aLen: { $strLenCP: '$answer' }, d: '$metadata.difficulty' } },
    { $group: { _id: null, avg: { $avg: '$aLen' }, max: { $max: '$aLen' } } }
  ]).toArray();
  const mix = await c.aggregate([
    { $match: { 'chapter.id': id, deleted_at: null } },
    { $group: { _id: '$metadata.difficulty', n: { $sum: 1 } } }
  ]).toArray();
  const mm = mix.reduce((a,r)=>{a[r._id]=r.n;return a;},{});
  const avg = stats[0] ? Math.round(stats[0].avg) : 0;
  const max = stats[0] ? stats[0].max : 0;
  console.log(`${id.padEnd(20)} ${String(n).padStart(3)}    ${String(avg).padStart(4)}    ${String(max).padStart(4)}    E${mm.easy||0}/M${mm.medium||0}/H${mm.hard||0}`);
  total += n;
}
console.log(`\nTotal Class-11 chemistry: ${total} cards`);
const totalDeck = await c.countDocuments({ deleted_at: null });
console.log(`Whole library now: ${totalDeck} active flashcards`);
await m.disconnect();})();
