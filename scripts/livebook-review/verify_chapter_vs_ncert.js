// READ-ONLY. Cross-checks a class11-biology chapter's published pages against
// the real NCERT source text: (1) every numeric token with a unit/count carries
// a real fact — flag any with no match in the source; (2) every bolded key term
// should be real NCERT vocabulary — flag any with no match.
// Usage: node verify_chapter_vs_ncert.js <chapterNumber>
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const ch = Number(process.argv[2]);
const pdfFile = path.join(__dirname, '..', 'bio-book', '_ncert_pdfs', `kebo1${String(ch).padStart(2, '0')}.txt`);
if (!fs.existsSync(pdfFile)) { console.error('no source file for ch' + ch); process.exit(1); }
const ncertRaw = fs.readFileSync(pdfFile, 'utf8');
const ncertNorm = ncertRaw.replace(/[–—−]/g, '-').replace(/\s+/g, ' ').toLowerCase();
const ncertPlain = ncertRaw.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ');

const strip = (s) => String(s || '').replace(/```[\s\S]*?```/g, ' ').replace(/[*_`#>]/g, '');

const NUM = /(?<![\w.])(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(%|per ?cent|mL|ml|litres?|liters?|L\b|µm|um|μm|nm|mm|cm|\bm\b|kg|\bg\b|mg|ATP|NADH|FADH2|NADPH|bones?|carbon|kcal|mmHg|mm Hg|°C|beats|times|molecules?|pairs?|chambers?|classes?|phyla|kingdoms?|species|years?)/g;

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const book = await db.collection('books').findOne({ slug: 'class11-biology' });
  const pages = await db.collection('book_pages').find({ book_id: book._id, chapter_number: ch, deleted_at: null }).sort({ page_number: 1 }).toArray();

  const numFindings = [];
  const boldTotal = { checked: 0, hit: 0 };
  const boldMiss = {};

  for (const p of pages) {
    const prose = (p.blocks || []).map(b => strip(
      [b.markdown, b.text, b.title, b.caption,
        ...(b.columns || []).flatMap(x => [x.heading, ...(x.points || [])]),
        ...(b.rows || []).flat(), ...(b.headers || []),
        ...(b.hotspots || []).flatMap(h => [h.label, h.detail]),
        ...(b.questions || []).flatMap(q => [q.question, ...(q.options || []), q.explanation]),
      ].filter(x => typeof x === 'string').join(' ')
    )).join(' ');
    const text = prose.replace(/[–—−]/g, '-').replace(/\s+/g, ' ');

    // numeric check
    const seen = new Set();
    let m;
    NUM.lastIndex = 0;
    while ((m = NUM.exec(text))) {
      const raw = m[0], num = m[1].replace(/,/g, '');
      const key = num + '|' + m[2].toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const variants = [num, m[1], Number(num).toLocaleString('en-IN'), Number(num).toLocaleString('en-US')];
      const hit = variants.some(v => ncertNorm.includes(String(v).toLowerCase()));
      if (!hit) {
        const i = m.index;
        numFindings.push({ slug: p.slug, token: raw.trim(), context: text.slice(Math.max(0, i - 90), i + 70).replace(/\s+/g, ' ') });
      }
    }

    // bolded-term check
    for (const b of (p.blocks || [])) {
      if (b.type !== 'text' && b.type !== 'callout') continue;
      const bolds = [...String(b.markdown || '').matchAll(/\*\*([^*]{2,60})\*\*/g)].map(mm => mm[1]);
      for (const t of bolds) {
        const k = t.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
        if (!k || k.length < 3 || /^[0-9 ]+$/.test(k)) continue;
        boldTotal.checked++;
        if (ncertPlain.includes(k)) boldTotal.hit++;
        else boldMiss[k] = (boldMiss[k] || 0) + 1;
      }
    }
  }

  console.log(`=== CH${ch}: ${pages.length} pages ===`);
  console.log('numeric tokens with NO match in NCERT source:', numFindings.length);
  numFindings.forEach(f => console.log(`  [${f.token}] ${f.slug}\n     …${f.context}…`));
  console.log(`\nbolded key terms: ${boldTotal.checked} checked, ${boldTotal.hit} verbatim in NCERT (${boldTotal.checked ? (100 * boldTotal.hit / boldTotal.checked).toFixed(1) : 0}%)`);
  const topMiss = Object.entries(boldMiss).sort((a, b) => b[1] - a[1]).slice(0, 20);
  console.log('top bolded phrases NOT found (mostly connective phrasing, but check for real errors):');
  topMiss.forEach(([k, n]) => console.log(`  ${n}x  ${k}`));

  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
