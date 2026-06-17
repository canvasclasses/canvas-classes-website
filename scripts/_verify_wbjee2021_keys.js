require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// Official answer key (WBJEE_2021_PCM.pdf p.17), keyed by display_id.
const KEY = {
  // Physics
  'ROPY-266':'d','WVOP-140':'c','ATPH-133':'c','ATPH-134':'a','SEMI-010':'a','SEMI-011':'c','NLM-215':'a','WEP-136':'a','K1D-144':'c','SHM-145':'a',
  'K2D-126':'b','ROT-271':'d','COM-142':'a','FLUI-186':'b','FLUI-187':'b','TDYN-191':'d','KTG-149':'b','THPR-133':'b','ELST-272':'d','ELST-273':'a',
  'ELST-274':'b','ELST-275':'c','MVCH-292':'b','MVCH-293':'d','MAGM-056':'d','ACUR-156':'d','SEMI-012':'c','ACUR-157':'c','ROPY-267':'c','EMW-006':'b',
  'CURR-387':'c','ROT-272':'b','KTG-150':'b','FLUI-188':'b','EMI-163':['b','c'],'DUAL-153':['a','b'],'TDYN-192':['b','c'],'SHM-146':['b','c'],'MVCH-294':['a','d'],
  // Chemistry
  'GOC-813':'b','BOND-437':'d','BOND-438':'a','GOC-814':'b','GOC-815':'c','GOC-816':'d','POC-212':'d','ALDO-396':'d','THERMO-280':'c','RDX-158':'b',
  'MOLE-350':'d','SOL-242':'a','CEQ-122':'a','CK-233':'a','EC-243':'d','PB12-641':'b','IEQ-183':'d','IEQ-184':'d','EC-244':'c','IEQ-185':'d',
  'SALT-231':'c','PB12-642':'b','PB12-643':'d','BOND-439':'a','BOND-440':'b','ATOM-331':'b','PB12-644':'a','CORD-388':'a','CORD-389':'d','HALO-225':'a',
  'ALCO-246':'c','ATOM-332':'a','SOL-243':'a','ATOM-333':'d','HC-359':['b','c'],'HALO-226':'d','IEQ-186':['c','d'],'PB12-645':['b','c'],'PB12-646':['b','c','d'],
  // Maths
  'LIMS-108':'c','AODV-215':'b','ININ-070':'c','DFIN-251':'c','DFIN-252':'b','DFIN-253':'c','DFIN-254':'c','DFEQ-213':'c','DFEQ-214':'b','DFEQ-215':'a',
  'AUC-132':'d','DFIN-255':'c','AODV-216':'b','AODV-217':'c','VCAL-216':'b','AODV-218':'c','BOMA-016':'d','SQSR-254':'a','CMPL-167':'d','CMPL-168':'c',
  'QUAD-142':'c','BNML-213':'d','PMCM-157':'c','PMCM-158':'c','SQSR-255':'a','MTRX-166':'c','MTRX-167':'c','MTRX-168':'c','DTRM-162':'d','STRL-097':'a',
  'MTRX-169':'b','PROB-188':'d','PROB-189':'a','ITF-068':'b','AODV-219':'a','PRBL-118':'a','STLN-152':'b','PRBL-119':'a','STLN-153':'b','CRCL-135':'a',
  'PRBL-120':'b','TDGM-308':'b','ELPS-095':'b','CRCL-136':'b','TDGM-309':'c','ITF-069':'b','FUNC-184':'c','FUNC-185':'c','QUAD-143':'c','CTDF-118':'b',
  'DFIN-256':'b','DFIN-257':'c','DIFF-055':'a','FUNC-186':'b','LIMS-109':'c','AUC-133':'a','VCAL-217':'c','AODV-220':'b','BNML-214':'d','SQSR-256':'c',
  'DTRM-163':'b','STRL-098':'b','TDGM-310':'d','ELPS-096':'c','DFIN-258':'a','CMPL-169':['b','c'],'DTRM-164':'d','SQSR-257':'b','DFIN-259':['c','d'],'TDGM-311':['a','c'],
  'CRCL-137':'a','LIMS-110':'a','CTDF-119':['a','d'],'AODV-221':['b','c'],'FUNC-187':'d',
};

const APPLY = process.argv[2] === '--fix';

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const mism = [];
  for (const [display_id, exp] of Object.entries(KEY)) {
    const doc = await col.findOne({ display_id }, { projection: { type: 1, options: 1, answer: 1 } });
    if (!doc) { mism.push({ display_id, issue: 'NOT FOUND' }); continue; }
    const expArr = Array.isArray(exp) ? [...exp].sort() : [exp];
    const stored = doc.type === 'MCQ' ? [...(doc.answer?.correct_options || [])].sort() : [doc.answer?.correct_option].filter(Boolean);
    const flagged = (doc.options || []).filter(o => o.is_correct).map(o => o.id).sort();
    const ok = JSON.stringify(stored) === JSON.stringify(expArr) && JSON.stringify(flagged) === JSON.stringify(expArr);
    if (!ok) {
      mism.push({ display_id, type: doc.type, stored: stored.join(','), flagged: flagged.join(','), expected: expArr.join(',') });
      if (APPLY) {
        const newOpts = doc.options.map(o => ({ ...o, is_correct: expArr.includes(o.id) }));
        const ansSet = doc.type === 'MCQ' ? { 'answer.correct_options': expArr } : { 'answer.correct_option': expArr[0] };
        const unset = doc.type === 'MCQ' ? { 'answer.correct_option': '' } : { 'answer.correct_options': '' };
        await col.updateOne({ display_id }, { $set: { options: newOpts, ...ansSet, updated_at: new Date(), updated_by: 'wbjee2021-keyfix' }, $unset: unset, $inc: { version: 1 } });
      }
    }
  }
  console.log(`Checked ${Object.keys(KEY).length} questions against official key.`);
  if (mism.length === 0) console.log('✅ All answers match the official key.');
  else { console.log(`${APPLY ? 'FIXED' : 'MISMATCHES'} (${mism.length}):`); mism.forEach(m => console.log('  ' + JSON.stringify(m))); }
  await client.close();
}
main().catch(e => { console.error(e); process.exit(1); });
