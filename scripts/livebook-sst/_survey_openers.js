'use strict';
const path=require('path');require('dotenv').config({path:path.join(__dirname,'..','..','.env.local')});
const {MongoClient}=require('mongodb');
(async()=>{
  const c=new MongoClient(process.env.MONGODB_URI);await c.connect();const db=c.db('crucible');
  const books=await db.collection('books').find({}).project({slug:1,title:1,subject:1,grade:1,chapters:1}).toArray();
  let totalNeed=0, totalHave=0, totalChaptersWithContent=0;
  console.log('BOOK'.padEnd(34),'| chapters(with content) | with-opener | MISSING');
  for(const b of books){
    const chapters=b.chapters||[];
    let need=0, have=0, withContent=0;
    for(const ch of chapters){
      // count real content pages (lesson type) in this chapter
      const pages=await db.collection('book_pages').find({book_id:b._id,chapter_number:ch.number,deleted_at:null}).project({page_type:1}).toArray();
      const lessons=pages.filter(p=>p.page_type!=='chapter_opener');
      const opener=pages.find(p=>p.page_type==='chapter_opener');
      if(lessons.length===0) continue; // empty shell — skip
      withContent++;
      if(opener) have++; else need++;
    }
    totalNeed+=need; totalHave+=have; totalChaptersWithContent+=withContent;
    if(withContent>0) console.log((b.slug||b._id.slice(0,10)).padEnd(34),'|',String(withContent).padStart(20),'|',String(have).padStart(11),'|',String(need).padStart(7), need>0?' ⬅':'');
  }
  console.log('\nTOTALS: '+totalChaptersWithContent+' chapters with content | '+totalHave+' have openers | '+totalNeed+' MISSING openers');
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
