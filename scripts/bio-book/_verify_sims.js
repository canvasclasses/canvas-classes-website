'use strict';
const path=require('path');require('dotenv').config({path:path.join(__dirname,'..','..','.env.local')});
const {MongoClient}=require('mongodb');
(async()=>{const c=new MongoClient(process.env.MONGODB_URI);await c.connect();const db=c.db('crucible');
const book=await db.collection('books').findOne({slug:'class11-biology'});
const pages=await db.collection('book_pages').find({book_id:String(book._id),deleted_at:null,'blocks.type':'simulation'}).project({slug:1,chapter_number:1,blocks:1}).toArray();
console.log('Pages with an embedded simulation:',pages.length);
for(const p of pages.sort((a,b)=>a.chapter_number-b.chapter_number)){
const sims=p.blocks.filter(b=>b.type==='simulation').map(b=>b.simulation_id);
console.log(`  Ch${p.chapter_number} ${p.slug} → [${sims.join(', ')}]`);}
await c.close();})().catch(e=>{console.error(e);process.exit(1);});
