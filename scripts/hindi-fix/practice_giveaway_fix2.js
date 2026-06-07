'use strict';
/** Lengthen ONE distractor in each new top-up question whose correct option was
 * still > 1.3× the next-longest — making it a fuller, more plausible distractor.
 * Correct option + positions untouched. Reversible.
 *   node scripts/hindi-fix/practice_giveaway_fix2.js [--write|--rollback] */
const fs = require('fs');
const { withBook, savePageBlocks } = require('./_lib');
const WRITE = process.argv.includes('--write'), ROLLBACK = process.argv.includes('--rollback');
const BACKUP = 'scripts/hindi-fix/_giveaway_fix2_backup.json';
const FIX = {
  'h1-pr-24': ['केवल दो पशुओं के खाने-पीने की', 'केवल दो पालतू पशुओं के खाने-पीने भर की'],
  'h2-pr-22': ['कठिन और भारी शब्दों पर', 'बहुत कठिन और भारी-भरकम शब्दों पर'],
  'h2-pr-24': ['केवल बड़े लोग ही लिख सकते हैं', 'केवल बड़े और प्रसिद्ध लोग ही लिख सकते हैं'],
  'h3-pr-22': ['वह घर की रखवाली करता था', 'वह घर की रखवाली करने में बहुत काम आता था'],
  'h3-pr-24': ['वे बहुत महँगे पड़ते हैं', 'वे जेब पर बहुत महँगे और बोझिल पड़ते हैं'],
  'h4-pr-22': ['किसी की मदद नहीं करनी चाहिए', 'किसी अनजान की किसी भी हाल में मदद नहीं करनी चाहिए'],
  'h4-pr-24': ['ऐसी बातें कभी नहीं होतीं', 'ऐसी अनोखी बातें असल ज़िंदगी में कभी नहीं होतीं'],
  'h5-pr-22': ['पानी बेकार है, यह विचार', 'समुद्र का इतना सारा पानी बेकार है, यह विचार'],
  'h5-pr-24': ['यथार्थ का कोई मूल्य नहीं', 'इस जीवन के कठोर-कड़वे यथार्थ का कोई मोल या मूल्य नहीं होता'],
  'h6-pr-22': ['खेती के पुराने तरीक़ों पर', 'गाँव की खेती के पुराने और घिसे-पिटे तरीक़ों पर'],
  'h6-pr-24': ['अब ऐसी कोई समस्या नहीं रही', 'आज के समाज में अब ऐसी कोई समस्या ही नहीं रही'],
  'h7-pr-22': ['क्योंकि नारे लगाना ही काफ़ी है', 'क्योंकि देश के लिए बस नारे लगाना ही काफ़ी है'],
  'h7-pr-24': ['देश का व्यक्ति से कोई नाता नहीं', 'देश का अपने एक नागरिक से कोई नाता ही नहीं'],
  'h8-pr-22': ['भक्ति केवल विद्वानों के लिए है', 'भक्ति केवल पढ़े-लिखे विद्वानों के लिए ही है'],
  'h8-pr-24': ['वह केवल पंडितों तक सिमटी', 'वह केवल कुछ पंडितों-विद्वानों तक सिमट गई'],
  'h9-pr-22': ['और तेज़ क्रोध से', 'राम द्वारा और भी अधिक तेज़ क्रोध दिखाने से'],
  'h9-pr-24': ['हर बात पर लड़ पड़ना', 'छोटी-छोटी हर बात पर तुरंत भिड़ और लड़ पड़ना'],
  'h10-pr-22': ['पहाड़-नदियाँ केवल सजावट हैं', 'पहाड़ और नदियाँ तो केवल बाहरी सजावट हैं'],
  'h10-pr-24': ['इसका आज से कोई नाता नहीं', 'इसका आज के हमारे समय से कोई नाता ही नहीं है'],
  'h11-pr-22': ['केवल ग़रीबों का गुस्सा', 'केवल ग़रीब और मज़दूर लोगों का गुस्सा'],
  'h11-pr-24': ['लड़कियों को घर में रहना चाहिए', 'लड़कियों को बस घर की चारदीवारी में रहना चाहिए'],
  'h12-pr-22': ['पूरी तरह कठोर और निर्दयी', 'भीतर से भी पूरी तरह कठोर और निर्दयी इंसान'],
  'h12-pr-24': ['इससे कविता कठिन हो जाती है', 'इससे पूरी कविता उलझी और कठिन हो जाती है'],
};
const len = s => String(s).length;
(async () => { await withBook(async ({ pages, allPages }) => {
  if (ROLLBACK) { if (!fs.existsSync(BACKUP)) { console.log('No backup.'); return; }
    const o = JSON.parse(fs.readFileSync(BACKUP, 'utf8')); let n = 0; const t = new Set();
    for (const p of allPages) { let d = false; for (const b of p.blocks || []) if (b.type === 'chapter_practice') for (const q of b.questions || []) if (o[q.id]) { q.options = o[q.id]; n++; d = true; }
      if (d) { t.add(p._id); await savePageBlocks(pages, p._id, p.blocks); } }
    console.log(`Rolled back ${n} across ${t.size} pages.`); return; }
  const backup = {}; const dirty = new Map(); let applied = 0; const miss = []; const resid = [];
  for (const p of allPages) for (const b of p.blocks || []) { if (b.type !== 'chapter_practice') continue;
    for (const q of b.questions || []) { const f = FIX[q.id]; if (!f) continue;
      const k = q.options.indexOf(f[0]); if (k === -1) { miss.push(q.id); continue; }
      if (k === q.correct_index) { miss.push(q.id + '(=correct!)'); continue; }
      backup[q.id] = q.options.slice(); q.options[k] = f[1]; applied++; dirty.set(p._id, p);
      const others = q.options.map(len).filter((_, i) => i !== q.correct_index);
      if (len(q.options[q.correct_index]) > 1.3 * Math.max(...others)) resid.push(`${q.id} still ${len(q.options[q.correct_index])}/${Math.max(...others)}`);
    } }
  console.log(`Applied ${applied}/${Object.keys(FIX).length} | misses: ${miss.join(',') || 'none'} | still-over-1.3x: ${resid.join(' | ') || 'none'}`);
  if (!WRITE) { console.log('(dry run)'); return; }
  fs.writeFileSync(BACKUP, JSON.stringify(backup), 'utf8');
  for (const [, p] of dirty) await savePageBlocks(pages, p._id, p.blocks);
  console.log('✅ Applied.');
}); })().catch(e => { console.error(e); process.exit(1); });
