'use strict';
const path=require('path');require('dotenv').config({path:path.join(__dirname,'..','..','.env.local')});
const {MongoClient}=require('mongodb');
(async()=>{
  const c=new MongoClient(process.env.MONGODB_URI);await c.connect();const db=c.db('crucible');
  const o=await db.collection('book_pages').findOne({slug:'chapter-1-overview'});
  console.log('BLOCKS of mole chapter opener:');
  (o.blocks||[]).forEach((b,i)=>console.log(`[${i}] `+JSON.stringify(b,null,1).slice(0,700)));
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
