'use strict';
const path=require('path');require('dotenv').config({path:path.join(__dirname,'..','..','.env.local')});
const {MongoClient}=require('mongodb');
(async()=>{
  const c=new MongoClient(process.env.MONGODB_URI);await c.connect();const db=c.db('crucible');
  const slugs=['class9-science','class9-mathematics','class9-english-kaveri','class9-hindi-ganga','class9-ict','life-skills-class-9','ncert-simplified-12'];
  for(const bslug of slugs){
    const book=await db.collection('books').findOne({slug:bslug});
    if(!book){console.log(bslug,'NOT FOUND');continue;}
    const ch=(book.chapters||[]).find(x=>true);
    // first chapter with content
    let target=null;
    for(const chap of book.chapters||[]){
      const lessons=await db.collection('book_pages').find({book_id:book._id,chapter_number:chap.number,deleted_at:null,page_type:{$ne:'chapter_opener'}}).sort({page_number:1}).toArray();
      if(lessons.length){target={chap,lessons};break;}
    }
    if(!target){console.log(bslug,'no content');continue;}
    const {chap,lessons}=target;
    const first=lessons[0];
    const cur=(first.blocks||[]).find(b=>b.type==='curiosity_prompt');
    const firstText=(first.blocks||[]).find(b=>b.type==='text'||b.type==='narrated_passage');
    console.log(`\n■ ${bslug} (subj=${book.subject}) Ch${chap.number} "${chap.title}"`);
    console.log(`  chapter.description: ${JSON.stringify((chap.description||'').slice(0,160))}`);
    console.log(`  first lesson: "${first.title}" | subtitle: ${JSON.stringify((first.subtitle||'').slice(0,120))}`);
    console.log(`  curiosity_prompt: ${cur?JSON.stringify((cur.prompt||'').slice(0,220)):'(none)'}`);
    console.log(`  lesson titles: ${lessons.map(l=>l.title).slice(0,6).join(' | ')}`);
  }
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
