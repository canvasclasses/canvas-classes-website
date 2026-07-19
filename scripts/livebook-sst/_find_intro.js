'use strict';
const path=require('path');require('dotenv').config({path:path.join(__dirname,'..','..','.env.local')});
const {MongoClient}=require('mongodb');
(async()=>{
  const c=new MongoClient(process.env.MONGODB_URI);await c.connect();const db=c.db('crucible');
  const types=await db.collection('book_pages').distinct('page_type');
  console.log('page_type values:',JSON.stringify(types));
  const molePages=await db.collection('book_pages').find({$or:[{slug:/mole/i},{title:/mole/i}]}).project({slug:1,title:1,page_type:1,chapter_number:1,book_id:1}).limit(30).toArray();
  console.log('\nmole pages:');molePages.forEach(p=>console.log('  type='+p.page_type,'| ch'+p.chapter_number,'|',p.slug,'|',p.title));
  // intro-type pages
  const introPages=await db.collection('book_pages').find({page_type:{$in:['intro','chapter_intro','opener','overview']}}).project({slug:1,title:1,page_type:1,book_id:1}).limit(20).toArray();
  console.log('\nintro-type pages ('+introPages.length+'):');introPages.forEach(p=>console.log('  type='+p.page_type,'|',p.slug,'|',p.title));
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
