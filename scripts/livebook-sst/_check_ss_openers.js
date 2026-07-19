'use strict';
const path=require('path');require('dotenv').config({path:path.join(__dirname,'..','..','.env.local')});
const {MongoClient}=require('mongodb');
const BOOK='a60d142c-c96b-48cc-ba72-e68d71d83802';
(async()=>{
  const c=new MongoClient(process.env.MONGODB_URI);await c.connect();const db=c.db('crucible');
  const book=await db.collection('books').findOne({_id:BOOK});
  for(const ch of (book.chapters||[]).slice(0,4)){
    const opener=await db.collection('book_pages').findOne({book_id:BOOK,chapter_number:ch.number,page_type:'chapter_opener'});
    const pages=await db.collection('book_pages').find({book_id:BOOK,chapter_number:ch.number}).project({page_number:1,page_type:1}).toArray();
    const nums=pages.map(p=>p.page_number).sort((a,b)=>a-b);
    console.log(`Ch${ch.number} "${ch.title}" | ${pages.length} pages, page_numbers [${nums.join(',')}] | opener: ${opener?opener.slug:'NONE'} | page_ids: ${(ch.page_ids||[]).length}`);
  }
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
