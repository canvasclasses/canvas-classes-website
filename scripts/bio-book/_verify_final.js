'use strict';
const path=require('path');require('dotenv').config({path:path.join(__dirname,'..','..','.env.local')});
const {MongoClient}=require('mongodb');
(async()=>{const c=new MongoClient(process.env.MONGODB_URI);await c.connect();const db=c.db('crucible');
const book=await db.collection('books').findOne({slug:'class11-biology'});
console.log('Total chapters:',book.chapters.length);
let sum=0;
for(const ch of book.chapters.sort((a,b)=>a.number-b.number)){
const ps=await db.collection('book_pages').find({_id:{$in:ch.page_ids},deleted_at:null}).project({_id:1}).toArray();
sum+=ps.length;
if(ch.number>=17) console.log(`  Ch${ch.number} "${ch.title}": ${ch.page_ids.length} wired, ${ps.length} live`);}
const total=await db.collection('book_pages').countDocuments({book_id:String(book._id),deleted_at:null});
console.log('Total live pages in class11-biology:',total,'(sum via chapters:',sum,')');
const pub=await db.collection('book_pages').countDocuments({book_id:String(book._id),deleted_at:null,published:true});
console.log('Published:',pub);
await c.close();})().catch(e=>{console.error(e);process.exit(1);});
