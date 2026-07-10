'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
function allText(page){
  const parts=[];
  for(const b of page.blocks||[]){
    for(const k of ['markdown','text','title','prompt','hint','reveal','body','event_context','why_hard','problem','reality_check','synthesis','role_frame','caption','subtitle']) if(b[k]) parts.push(b[k]);
    for(const arr of ['steps','options','solutions','events','careers','questions','items','columns']) if(Array.isArray(b[arr])) for(const s of b[arr]) parts.push(JSON.stringify(s));
  }
  return (page.title+' '+(page.subtitle||'')+' '+parts.join(' ')).toLowerCase();
}
(async()=>{
  const c=new MongoClient(process.env.MONGODB_URI);await c.connect();
  const db=c.db('crucible');
  const CHECKS={
    3:['counter-pressure','ionosphere','torrid','temperate','frigid','arctic circle','arthashastra','nakshatra','mission mausam','kalidasa','meghadutam','insolation','sea breeze','land breeze','calm','light breeze','storm','tropic of cancer','ozone','aurora','30 years'],
    4:['brahmi','sumerian','akkadian','assyrian','babylonian','ziggurat','hammurabi','cuneiform','hieroglyph','rosetta','mummification','pharaoh','pyramid','oracle bone','great wall','silk route','gilgamesh','mandate of heaven','social hierarchy','meluhha','dilmun','magan','wheeled cart','papyrus','cleopatra','homo habilis','homo erectus','neanderthal','homo sapiens','old world','extra-corporal','zebu','lothal','dholavira','olduvai','attirampakkam','isampur','bhimbetka']
  };
  for(const chap of [3,4]){
    const pages=await db.collection('book_pages').find({book_id:BOOK_ID,chapter_number:chap}).toArray();
    const corpus=pages.map(allText).join(' ');
    console.log(`\n═══ CH${chap} coverage ═══`);
    const missing=CHECKS[chap].filter(t=>!corpus.includes(t));
    const present=CHECKS[chap].filter(t=>corpus.includes(t));
    console.log(`  PRESENT (${present.length}): ${present.join(', ')}`);
    console.log(`  ✗ MISSING (${missing.length}): ${missing.join(', ') || '(none)'}`);
  }
  await c.close();
})().catch(e=>{console.error(e);process.exit(1);});
