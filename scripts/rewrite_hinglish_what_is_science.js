/**
 * rewrite_hinglish_what_is_science.js
 *
 * Proof-of-concept rewrite for page 1 (`what-is-science`) using the
 * re-explanation methodology (not word-for-word translation).
 *
 * Run: node scripts/rewrite_hinglish_what_is_science.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const BOOK_ID = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';
const SLUG = 'what-is-science';

const updates = [
  {
    id: '0e4f59ae-a140-4901-8bec-fc4a02b4ba48',
    markdown: `**The battlefield was silent.**

Zara scene dekho. Kurukshetra ka maidan. Do foujein aamne-saamne khadi hain, bas ab ladai shuru honi hi hai. Arjuna apne rath mein khada hai, dhanush haath mein. Saamne dekhta hai — guru bhi hain, bhai bhi hain, bachpan ke dost bhi. Haath kaanpne lagte hain. Dhanush chhoot jaata hai. Arjuna baith jaata hai.

---

**He had the answer. He did not have the question.**

Arjuna ko ladna aata tha. Saari zindagi isi ek din ki tayyari mein lagayi thi. Skill thi, experience tha, hathiyar the — sab kuch tayyar tha. Phir bhi us chup-chaap moment mein uske andar kuch aur hi jaag gaya. Usne Krishna se yeh nahi poochha ki "bhagwaan, strategy kya ho?" Yeh bhi nahi poochha ki "jeetoon kaise?" Usne aisa sawaal poochha jo in sab se kahin zyada mushkil tha: *"Sahi kya hai? Dharma kya hai? Sach mein mujhe karna kya chahiye?"*

Yahi woh quality hai jo sab kuch badal deti hai. Sawaal yeh nahi hona chahiye ki *"mujhe apna result kaise milega?"* — sawaal yeh hona chahiye ki *"yahaan sach mein ho kya raha hai?"*

---

**The best questions are never about winning.**

Duniya ke jitne bhi bade thinkers hue hain — koi bhi culture ho, koi bhi zamana — ek cheez sab mein common hai. Unhone aasaan sawaal poochna chhod diya aur honest sawaal poochne lage. Aur honest sawaal ko tum ek jhatpat-sa jawaab de ke tala nahi sakte. Woh tumhe majboor karta hai ki aur gehrai mein jao, aur dhyaan se dekho — aur kabhi kabhi, jo tumhe pehle se pata tha, usko bhi chhodna pade.

---

**Science is born from exactly this kind of question.**

Newton ne apple neeche girte dekha. Baaki log bol dete — "girta hai toh girta hai, isme kya baat hai." Newton nahi maana. Usne poochha *"girta hi kyun hai?"* Yahi toh Arjuna waali baat hai — jo obvious dikhta hai usse bhi sawaal karna, samajhne pe ade rehna. Marie Curie ne ek ajeeb sa radiation dekha. Usko "pata nahi kya hai, chhodo" bol ke aage nahi badhi. Usne poochha *"yeh hai kya cheez?"* — aur matter ki poori samajh hi badal di. Har badi scientific khoj isi tarah shuru hoti hai: ek seedha, honest sawaal, jo koi aisa insaan poochhta hai jisme "abhi mujhe nahi pata" bolne ki himmat ho.

---

**Science is not a collection of facts. It is a method of questioning.**

Tum yahaan facts ratta maarne nahi aaye ho. Tum yahaan seekhne aaye ho ki sawaal kaise poochha jaata hai.`,
  },
  {
    id: '22fd127d-b044-4f6b-924c-b3108c010e9c',
    markdown: `Science aur Bharat ki gyaan-paramparaayein — dono ki jad ek hi hai: ek sachcha, honest sawaal, aise insaan ki taraf se jo seedhi baat bolne ko tayyar ho ki *"mujhe abhi nahi pata."*

Arjuna ne yeh nahi kiya ki "main toh sab samajhta hoon" ka drama kar leta. Zindagi ke sabse mushkil moment pe — teer ready, foujein intezaar mein — usne ruk ke poochha. Woh pause, woh himmat ki *"haan, main sach mein confused hoon, aur sach mein jaanna chahta hoon"* — asli seekh yaheen se shuru hoti hai.

Is course mein tumhe bahut saare facts milenge, formulas milenge, frameworks milenge. Lekin sabse gehri skill jo tum yahaan develop karoge, woh in sab se simple bhi hai aur puraani bhi: **aisa sawaal poochhne ki taaqat jiska jawaab sach mein tumhe nahi pata — aur us sawaal ke saath itni der tak tike rehne ki aadat, ki samajh khud chal ke aa jaaye.**

Bas yahi science hai. Aur yahi hai us poore safar ki pehli aahat.`,
  },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('book_pages');

  let updated = 0;
  for (const { id, markdown } of updates) {
    const result = await col.updateOne(
      { book_id: BOOK_ID, slug: SLUG, 'hinglish_blocks.id': id },
      { $set: { 'hinglish_blocks.$.markdown': markdown } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✅  ${SLUG} [${id.slice(0, 8)}…]`);
      updated++;
    } else {
      console.warn(`⚠️  ${SLUG} [${id.slice(0, 8)}…] — not found or unchanged`);
    }
  }

  console.log(`\nDone. ${updated} / ${updates.length} blocks updated.`);
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
