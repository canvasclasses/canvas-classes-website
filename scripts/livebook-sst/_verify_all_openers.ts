import 'dotenv/config';
import mongoose from 'mongoose';
import { validateBlocks } from '../../packages/data/books/schemas';
async function main(){
  await mongoose.connect(process.env.MONGODB_URI!);
  const db=mongoose.connection.db!;
  const books=await db.collection('books').find({}).project({slug:1,chapters:1}).toArray();
  let totalOpeners=0, invalid=0, dupChapters=0, contentChaptersNoOpener=0;
  for(const b of books){
    for(const ch of (b.chapters||[]) as any[]){
      const pages=await db.collection('book_pages').find({book_id:b._id,chapter_number:ch.number,deleted_at:null}).toArray();
      const lessons=pages.filter(p=>p.page_type!=='chapter_opener');
      const openers=pages.filter(p=>p.page_type==='chapter_opener');
      if(lessons.length===0) continue;
      if(openers.length===0){contentChaptersNoOpener++; console.log(`  ✗ NO opener: ${b.slug} ch${ch.number}`);}
      if(openers.length>1){dupChapters++; console.log(`  ⚠ ${openers.length} openers: ${b.slug} ch${ch.number}`);}
      for(const o of openers){
        totalOpeners++;
        const r=validateBlocks(o.blocks);
        if(!r.ok){invalid++; console.log(`  ❌ invalid: ${o.slug} — ${JSON.stringify((r as any).error).slice(0,120)}`);}
      }
    }
  }
  console.log(`\nTotal openers: ${totalOpeners} | invalid: ${invalid} | chapters w/ >1 opener: ${dupChapters} | content-chapters missing opener: ${contentChaptersNoOpener}`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
