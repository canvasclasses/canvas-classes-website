'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');

// recompute the sim formulas to sanity-check them
function checkMath() {
  const R = 8.314e-3;
  // consecutive A->I->P intermediate peak
  const A0 = 100;
  const interI = (k1, k2, t) => Math.abs(k1 - k2) < 1e-3
    ? A0 * k1 * t * Math.exp(-k1 * t)
    : A0 * (k1 / (k2 - k1)) * (Math.exp(-k1 * t) - Math.exp(-k2 * t));
  const peakI = (k1, k2) => { let b = 0; for (let i = 0; i <= 2000; i++) { const t = i / 2000 * (6 / Math.min(k1, k2)); b = Math.max(b, interI(k1, k2, t)); } return b; };
  console.log('CONSECUTIVE intermediate peak:');
  console.log('  k1=k2=0.5  peak ≈', peakI(0.5, 0.5).toFixed(1), '(expect ~36.8 = A0/e)');
  console.log('  k1=0.5 k2=2.0 (k2>>k1) peak ≈', peakI(0.5, 2.0).toFixed(1), '(expect low, <30)');
  console.log('  k1=2.0 k2=0.2 (k1>>k2 build-up) peak ≈', peakI(2.0, 0.2).toFixed(1), '(expect high, >60)');
  // M-B fraction
  console.log('MAXWELL-BOLTZMANN fraction e^(-Ea/RT):');
  console.log('  Ea=50,T=400 ->', Math.exp(-50 / (R * 400)).toExponential(2), '(expect ~3e-7)');
  console.log('  rate ratio 400K vs 300K (Ea=50) ->', (Math.exp(-50 / (R * 400)) / Math.exp(-50 / (R * 300))).toFixed(0), '×');
  // order shortcuts
  console.log('ORDER zero 20%/interval -> values:', [0, 1, 2, 3, 4, 5].map(n => Math.max(0, 100 - 20 * n)).join(','), '(completes at 5)');
  console.log('ORDER first 50%/interval -> values:', [0, 1, 2, 3, 4].map(n => (100 * Math.pow(0.5, n)).toFixed(1)).join(','), '(never 0)');
  // energy profile catalyst speedup
  console.log('CATALYST speedup e^(ΔEa/RT) lower 30 @300K ->', Math.exp(30 / (R * 300)).toExponential(1), '×');
}

(async () => {
  checkMath();
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const db = c.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'ncert-simplified-12' });
  const pages = await db.collection('book_pages')
    .find({ book_id: book._id, chapter_number: 3 }).sort({ page_number: 1 }).toArray();
  console.log('\nSIMULATION EMBEDS:');
  let n = 0;
  for (const p of pages) {
    for (const b of p.blocks) {
      if (b.type !== 'simulation') continue;
      n++;
      const pr = b.prediction;
      const ok = pr && pr.prompt && Array.isArray(pr.options) && pr.options.length >= 2 && pr.reveal_after;
      console.log(`  p${p.page_number} ${p.slug}: ${b.simulation_id}  predict=${ok ? `ok(${pr.options.length} opts)` : 'MISSING'}`);
    }
  }
  console.log(`\nTotal simulation blocks: ${n}`);
  await c.close();
})().catch((e) => { console.error(e); process.exit(1); });
