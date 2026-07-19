import 'dotenv/config';
import mongoose from 'mongoose';
import { validateBlocks } from '../../packages/data/books/schemas';
async function main(){
  await mongoose.connect(process.env.MONGODB_URI!);
  const db=mongoose.connection.db!;
  const ops=await db.collection('book_pages').find({book_id:'a60d142c-c96b-48cc-ba72-e68d71d83802',page_type:'chapter_opener'}).toArray();
  let ok=0,fail=0;
  for(const p of ops.sort((a:any,b:any)=>a.chapter_number-b.chapter_number)){
    const r=validateBlocks(p.blocks);
    if(r.ok){ok++;console.log('✅ ch'+p.chapter_number,p.slug,`| ${p.blocks.length} blocks | published=${p.published}`);}
    else{fail++;console.log('❌',p.slug,'—',JSON.stringify((r as any).error).slice(0,200));}
  }
  console.log(`\n${ok}/${ok+fail} opener pages valid`);
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
