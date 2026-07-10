require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const book = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
  const pages = await db.collection('book_pages').find({ book_id: book, chapter_number: 7 })
    .sort({ page_number: 1 }).toArray();

  const SIM = new Set(['simulation']);
  let pub=0, draft=0, totalBlocks=0;
  const flags = [];
  const typeCount = {};
  let hasHinglishPages=0, hinglishEmptyImg=0;
  let altPlaceholder=0, audioBlocks=0, audioEmpty=0, simBlocks=0, practiceBlocks=0;

  const scan = (blocks, page, lang) => {
    for (const b of (blocks||[])) {
      if (!b || !b.type) continue;
      typeCount[b.type] = (typeCount[b.type]||0)+1;
      // empty media
      if (b.type==='image' && b.generation_prompt && (!b.src||b.src==='')) flags.push(`p${page.page_number} ${page.slug} [${lang}] image EMPTY src (blk ${String(b.id).slice(0,8)})`);
      if (b.type==='callout' && b.image_prompt && (!b.image_src||b.image_src==='')) flags.push(`p${page.page_number} ${page.slug} [${lang}] callout EMPTY image_src`);
      if (b.type==='image'){ if (typeof b.alt==='string' && /chatgpt image/i.test(b.alt)) altPlaceholder++; }
      if (b.type==='video' && (!b.url && !b.src)) flags.push(`p${page.page_number} ${page.slug} [${lang}] video EMPTY url`);
      if (b.audio_url!==undefined){ audioBlocks++; if(!b.audio_url) audioEmpty++; }
      if (b.type==='simulation'){ simBlocks++; if(!b.sim_id && !b.simId && !b.simulation_id) flags.push(`p${page.page_number} ${page.slug} simulation block missing sim id`); }
      if (b.type==='practice_bank'){ practiceBlocks++; const items=b.items||b.questions||[]; if(!items.length) flags.push(`p${page.page_number} practice_bank EMPTY`); }
      // stub markers in any text-ish field
      const txt = JSON.stringify(b);
      if (/NEEDS_REVIEW|TODO|PLACEHOLDER|TKTK|Lorem ipsum/i.test(txt)) flags.push(`p${page.page_number} ${page.slug} [${lang}] STUB marker in blk type=${b.type}`);
    }
  };

  for (const p of pages) {
    totalBlocks += (p.blocks||[]).length;
    p.published ? pub++ : draft++;
    scan(p.blocks, p, 'en');
    if (p.hinglish_blocks && p.hinglish_blocks.length){ hasHinglishPages++; 
      for (const b of p.hinglish_blocks){ if(b?.type==='image'&&b.generation_prompt&&(!b.src||b.src==='')) hinglishEmptyImg++; }
      scan(p.hinglish_blocks, p, 'hi');
    }
  }

  console.log(`=== Ch.7 Ionic Equilibrium audit ===`);
  console.log(`Pages: ${pages.length}  (published:${pub}  draft:${draft})`);
  console.log(`Total EN blocks: ${totalBlocks}`);
  console.log(`Pages with hinglish_blocks: ${hasHinglishPages}/${pages.length}  (empty hinglish images: ${hinglishEmptyImg})`);
  console.log(`audio blocks: ${audioBlocks} (empty audio_url: ${audioEmpty}) | simulation blocks: ${simBlocks} | practice_bank blocks: ${practiceBlocks}`);
  console.log(`alt-text still "ChatGPT Image..." placeholders: ${altPlaceholder}`);
  console.log(`\nBlock types:`, typeCount);
  console.log(`\n--- FLAGS (${flags.length}) ---`);
  flags.forEach(f=>console.log('  ⚠ '+f));
  if(!flags.length) console.log('  none');
  await mongoose.disconnect();
})().catch(e=>{console.error(e);process.exit(1);});
