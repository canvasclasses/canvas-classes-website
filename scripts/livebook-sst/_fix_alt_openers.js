'use strict';
const bw=require('../lib/book-writer');
(async()=>{
  await bw.withDb(async(db)=>{
    for(const slug of ['chemical-equilibrium-opener','ionic-equilibrium-opener']){
      const p=await db.collection('book_pages').findOne({slug});
      if(!p){console.log('not found',slug);continue;}
      let changed=false;
      const blocks=p.blocks.map(b=>{ if(b.type==='image' && (b.alt==null)){changed=true; return {...b, alt: `${p.title} — chapter cover`};} return b; });
      if(!changed){console.log('no fix needed',slug);continue;}
      await bw.savePage(db,{slug},blocks,{author:'agent',summary:'Add missing alt on chapter-opener hero image (schema fix).'});
      console.log('✓ fixed alt on',slug);
    }
  });
})().catch(e=>{console.error(e);process.exit(1);});
