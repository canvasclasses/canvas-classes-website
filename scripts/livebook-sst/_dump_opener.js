'use strict';
const path=require('path');require('dotenv').config({path:path.join(__dirname,'..','..','.env.local')});
const {MongoClient}=require('mongodb');
(async()=>{
  const c=new MongoClient(process.env.MONGODB_URI);await c.connect();const db=c.db('crucible');
  // the book that holds mole-concept
  const molePage=await db.collection('book_pages').findOne({slug:'mole-concept'});
  const book=await db.collection('books').findOne({_id:molePage.book_id});
  console.log('BOOK:',book.slug,'| grade',book.grade,'| subj',book.subject);
  // its chapter 1 shell
  const ch1=(book.chapters||[]).find(c=>c.number===molePage.chapter_number);
  console.log('CH'+ch1.number,':',ch1.title,'| opener fields on chapter:',JSON.stringify(Object.keys(ch1)));
  console.log('  chapter.intro:',JSON.stringify(ch1.intro||ch1.opener_intro||ch1.description||null));
  console.log('  chapter.hero:',JSON.stringify(ch1.hero_src||ch1.opener_hero||ch1.cover||null));
  console.log('  chapter.outcomes:',JSON.stringify(ch1.outcomes||ch1.learning_outcomes||null));
  // find a chapter_opener page
  const opener=await db.collection('book_pages').findOne({book_id:molePage.book_id,page_type:'chapter_opener'});
  if(opener){
    console.log('\nCHAPTER_OPENER PAGE:',opener.slug,'| ch',opener.chapter_number);
    console.log('  keys:',JSON.stringify(Object.keys(opener)));
    console.log('  title:',opener.title,'| subtitle:',opener.subtitle);
    console.log('  intro:',JSON.stringify(opener.intro||opener.opener_intro||null));
    console.log('  outcomes:',JSON.stringify(opener.outcomes||opener.learning_outcomes||null));
    console.log('  blocks:',(opener.blocks||[]).length,(opener.blocks||[]).map(b=>b.type).join(','));
    console.log('  full doc (trimmed):',JSON.stringify(opener,(k,v)=>k==='blocks'?`[${(v||[]).length} blocks]`:v).slice(0,1500));
  } else console.log('\n(no chapter_opener page in this book)');
  // any chapter_opener anywhere
  const anyOpeners=await db.collection('book_pages').find({page_type:'chapter_opener'}).project({slug:1,book_id:1,chapter_number:1}).limit(10).toArray();
  console.log('\nALL chapter_opener pages ('+anyOpeners.length+' shown):');anyOpeners.forEach(p=>console.log('  ',p.slug,'| ch'+p.chapter_number,'| book',p.book_id.slice(0,8)));
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
