/**
 * rewrite_hinglish_chapter0_remaining.js
 *
 * Rewrites Hinglish for the remaining 4 Chapter 0 pages using
 * the re-explanation methodology (not translation).
 *
 * Pages: how-scientific-knowledge-grows, science-and-you,
 *        indias-scientific-heritage, how-to-use-this-book
 *
 * Run: node scripts/rewrite_hinglish_chapter0_remaining.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const BOOK_ID = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';

const updates = [

  // ── how-scientific-knowledge-grows ──────────────────────────────────────────

  {
    slug: 'how-scientific-knowledge-grows',
    id: '02dc368b-d5b6-4bce-98bd-07dd5e4b21a0',
    markdown: `Socho — 1800s mein chemistry ka har professor ek hi cheez padhata tha: *atom sabse chota particle hai. Toot nahi sakta. Divide nahi ho sakta.* Yeh theory pakki thi. Kisi ko doubt nahi tha.

Phir J.J. Thomson ne ek experiment kiya. Ek glass tube mein gas bhari, doosre side se electricity pass ki — aur kuch shoot hua jo atom se bhi chota tha. Atom ke andar bhi kuch tha. Jo "indivisible" tha woh actually divide ho sakta tha.

**This is how scientific progress actually works.** Koi ek din baitha aur suddenly sab kuch samajh gaya — aisa nahi hota. Progress hoti hai ek ajeeb result se. Ek aisi observation se jo existing theory mein fit nahi hoti. Isse *anomaly* kehte hain.

Yahan samajhne wali baat yeh hai: jab koi scientist kuch aisa dekhe jo fit nahi ho raha — aur woh usse "yeh toh koi galti hogi" bol ke ignore na kare, balki ruk ke pooche *"yeh kya ho raha hai?"* — tabhi actual discovery shuru hoti hai. Anomaly problem nahi hoti. Woh ek invitation hoti hai.

Acharya **Kanad** ne hazaar saal Thomson se pehle ek alag raaste se same cheez sochi thi. Unhone kaha — agar tum kisi bhi cheez ko baar baar divide karte jao, toh ek aise point pe pahunchoge jab aur divide nahi hoga. Usne uss smallest particle ka naam diya — *Parmanu* (परमाणु). Method alag tha, instrument alag tha, zamana alag tha — lekin spirit ek hi thi: jo dikhta hai, us ke neeche aur kuch zaroor hai.`,
  },

  {
    slug: 'how-scientific-knowledge-grows',
    id: '1af05559-0ece-45df-b180-46c7d9cd4ee4',
    markdown: `Acha, toh science kaise aage badhti hai? Seedhi line mein nahi — ek spiral ki tarah. Ek hi tarah ke sawaal baar baar aate hain, lekin har baar thodi aur gehrai ke saath.

**Observe** — Kuch ajeeb hota hai. Koi reading predict ki gayi value se match nahi karti. Koi plant unexpected direction mein badh raha hai. Koi reaction jo honi chahiye thi, nahi hoti.

**Question** — *Kyun?* Kya hum galat hain? Kya current explanation poori nahi hai?

**Hypothesize** — Ek jawaab guess karo — lekin ek specific, testable jawaab. "Agar meri hypothesis sahi hai, toh is experiment ka result exactly yeh hona chahiye." Dhyan raho — agar tumhara jawaab test hi nahi kiya ja sakta, toh woh science nahi, sirf opinion hai.

**Test** — Experiment karo. Phir dobara karo. Phir kisi doosri lab mein kisi aur se karwao. Agar sirf tumhare haath mein hi kaam karta hai toh kuch toh gadbad hai.

**Publish and Critique** — Apna kaam doosre scientists ke saamne rakho. Woh method pe sawaal karenge, assumptions challenge karenge, khud reproduce karne ki koshish karenge. Isse **peer review** kehte hain — yeh gatekeeping nahi hai, yeh quality check hai. Sabse cutting sawaal tumhare dushman nahi poochte — fellow scientists poochte hain. Yeh bug nahi, yeh feature hai.

**Refine or Revise** — Agar experiment baar baar hold kare, hypothesis slowly ek *theory* banti hai — ek aisi explanation jiske paas predictive power ho, jo test ke baad bhi khadi rahe. Nahi toh wapas jaao, modify karo ya chhod do.

Phir spiral aur gehri hoti jaati hai.`,
  },

  {
    slug: 'how-scientific-knowledge-grows',
    id: 'fd33ae92-0316-4ff0-b687-f2ff7c17f82f',
    markdown: `Ek cheez clear kar lete hain — koi bhi scientist akela nahi hota. Newton bhi nahi.

Newton ko log imagine karte hain akele baithe ek tree ke neeche — apple gira, eureka. Lekin Newton ne khud Robert Hooke ko ek letter mein likha tha: *"Agar main aage dekh paaya, toh isliye ki main giants ke kaandhon pe khada tha."* Yeh humility nahi thi — yeh sachchi baat thi. Woh pehle waalon ka kaam aage le ja raha tha.

Isliye har scientific paper ke end mein ek **References** section hota hai — woh tamam papers, books, experiments jinke bina woh kaam possible nahi tha. Yeh formality nahi hai. Yeh acknowledgment hai ki knowledge ek akele insaan ki property nahi hoti — woh centuries mein build hoti hai.

Is book mein jab bhi tum koi formula dekhte ho — Newton ka second law ho, Aryabhata ki pi ki value ho, ya mole concept — zara ruko. Yeh sirf ek line nahi hai. Yeh centuries ki mehnat ka nichodna hai. Kitne log is ek line tak pahunchne mein lage the, kitne experiments fail hue, kitni theories badli.

Tum koi dead fact ratta nahi maar rahe. **Tum ek aisi baatchiit mein shaamil ho rahe ho jo abhi bhi chal rahi hai.**

**Aur India mein yeh baatchiit usse kahin zyada purani hai jitna log samajhte hain.** Vedic astronomers ne geometric precision se taaaron ki positions calculate ki. Ayurvedic physicians ne body ke systems classify kiye. Panini ne Sanskrit ki poori grammar ek formal system mein likh di — pehli baar aisa kisi ne kiya. Alag vocabulary, alag zamana, alag instruments — lekin ek hi drive: yeh duniya actually kaise kaam karti hai, yeh samajhna.`,
  },

  {
    slug: 'how-scientific-knowledge-grows',
    id: '71599f59-8d8f-4bcd-bfe7-45501569548c',
    markdown: `- Scientific knowledge complete theory ki form mein nahi aati. Woh badhti hai ek continuous cycle se — observation, sawaal, hypothesis, test, peer review, revision. Baar baar.

- **Anomalies** — woh results jo existing explanation mein fit nahi hote — errors nahi hain dismiss karne ke liye. Woh exactly wahi hain jahan discovery shuru hoti hai.

- **Paradigm shift** tab hota hai jab sirf ek theory nahi, poori woh framework badalti hai jis pe saari theories khadi thi. Science mein yeh baar baar hua hai. Aur aage bhi hoga.

- Koi bhi scientist akela nahi hota. Knowledge **cumulative aur collaborative** hai — har scientist un logon ka kaam aage le jaata hai jo pehle aye. Yeh conversation India ke scientists bhi hazaaron saalon se karte aa rahe hain.

- **Science ka apna mind badalna kamzori nahi hai. Yahi uski sabse badi taqat hai.** Jo cheez kabhi update hi na ho, woh zyada reliable nahi hoti — woh sirf sach se door rehne mein zyada mahir hoti hai.`,
  },

  // ── science-and-you ──────────────────────────────────────────────────────────

  {
    slug: 'science-and-you',
    id: 'c453a042-c0ba-461f-a09f-7017b8e1cf88',
    markdown: `Ek baat socho — tum subah uthte ho, brush karte ho. Woh toothpaste mein fluoride hai, jiska cavity-prevention mechanism dentists aur chemists ne decades tak study karke find kiya. Ghar ki light on karte ho — woh electricity Faraday aur Maxwell ke electromagnetic principles pe chalti hai, jo 19th century mein describe kiye gaye the, aur 20th century mein Indian engineers ne aage le gaye. Plate mein khana — uski yield, shelf life, nutrition — agricultural science aur plant genetics ka result hai. Aur agar kabhi severe infection ho, doctor antibiotic deta hai — woh ek discovery hai 1928 ki. Pehle woh exist hi nahi karti thi. Log infections se marte the jo aaj teen din mein theek ho jaate hain.

Yeh interesting facts ki list nahi hai. Yeh ek map hai — tumhare scientific knowledge pe kitna dependence hai, us ka.

**Science koi aisi cheez nahi jo laboratories mein hoti hai aur phir saalon baad textbooks mein aati hai. Yeh woh operating system hai jis pe tumhari duniya chalti hai.**

Lekin abhi tum sirf iska output use karte ho — toothpaste use karo, antibiotic lo, light on karo. Asli shift tab hoti hai jab tum **passive consumer** se aage jaate ho. Jab tum scientific claims evaluate kar sako. Jab tum methods samjho. Jab tum un conversations mein participate kar sako jo decide karti hain ki yeh knowledge kahan aur kaise use hogi.

Woh shift shuru hoti hai yeh samajhne se ki science kaam kaise karti hai. Aur issi ke baare mein yeh chapter hai.`,
  },

  {
    slug: 'science-and-you',
    id: 'e9181bea-9653-421b-a7fd-21fa3ad9290e',
    markdown: `Aane waale decades mein India ko kuch aisi problems face karni hongi jinke jawaab science ke bina possible hi nahi hain.

Climate change Bharat ke monsoon patterns badlega — aur woh kheti jo in patterns pe depend karti hai, usse kya hoga? Us sawaal ka jawaab jo policy banayega usse science samajhni padegi — aur jo citizens policy par dabaaw daalne wale honge, unhe bhi. Antibiotic resistance ek slow-motion emergency hai — livestock mein antibiotics ki overuse aur loosely regulated medical practice ki wajah se. Paani ki killi abhi Rajasthan, Maharashtra, Tamil Nadu, peninsular India ke bade hisson mein real problem hai. Aur phir hain naye technologies — AI, gene editing, synthetic biology, nuclear energy — jinke possibilities aur risks dono evaluate karne padhenge.

Yeh sab kaun decide karega? Policy makers. Lekin policy makers ek informed public ke dabaaw mein kaam karte hain. Jis citizen ko vaccines ki science samajh mein aati hai, woh alag choice leta hai. Jis voter ko climate models pata hain, woh alag vote karta hai. Jis community ko water chemistry samajh aati hai, woh municipality se better demand kar sakti hai.

**Scientific literacy sirf ek professional skill nahi hai. Yeh ek civic skill hai.** Society ka collective intelligence seedha depend karta hai ki kitne log scientifically soch sakte hain — un topics pe bhi jo kisi formal syllabus mein nahi hain.`,
  },

  {
    slug: 'science-and-you',
    id: 'e916f2a9-8818-462f-89a9-06031f9efe72',
    markdown: `Science practice karne ke liye lab ki zaroorat nahi.

Dekho — tum notice karte ho ki winter mein phone battery jaldi khatam ho jaati hai. Bas itna hi kaafi hai shuruwaat ke liye. Tumne observe kiya — woh science ka pehla step tha. Phir tumne poochha *"kyun hota hai aisa?"* — sawaal poochha, science ka doosra step. Phir mechanism dhundha — *cold, lithium-ion battery mein electrochemical reactions slow kar deti hai.* Phir test kiya — phone ko warm room mein laao, battery thodi recover hoti hai ya nahi? Hoti hai. Ek choti si battery observation se tum ignorance se understanding tak aa gaye. Koi lab nahi tha, koi equipment nahi thi.

Scientific thinking waalon aur baaki logon mein difference intelligence ka nahi hai. **Woh ek habit ka hai: pehla comfortable explanation mil gaya, accept nahi karna — balki poochhhna: *"lekin kyun?"***

Aur yeh habit sirf chemistry mein kaam nahi aati. News mein koi headline aaye — yeh habit kaam aati hai. Koi health claim sunne mein — kaam aati hai. Political argument samajhne mein — kaam aati hai. Apni zindagi ke baare mein koi bada decision lene mein — kaam aati hai.

Tum already curious ho — warna yeh padh nahi rahe hote. Yeh book usi curiosity ko ek disciplined skill mein dhalta hai. Aisi skill jo tumhe scientific wala professionally nahi banana chahti — balki zyada careful, zyada accurate, zyada capable thinker banana chahti hai — kisi bhi field mein.`,
  },

  {
    slug: 'science-and-you',
    id: '2035ed51-bc14-4b43-a3a2-0bea88f41eda',
    markdown: `- Science sirf laboratories tak nahi hai. Woh tumhari subah ki toothpaste mein hai, ghar ki electricity mein hai, plate ke khane mein hai, aur us antibiotic mein bhi jo doctor ne di thi. Yeh sab science ka output hai.

- **Scientific literacy ek civic skill hai**, sirf professional nahi. Jo citizens science samajhte hain woh health, environment, technology, aur governance ke baare mein better collective decisions lete hain.

- India ki is generation ko — climate adaptation, antibiotic resistance, water scarcity, emerging technologies — aise challenges face karne hain jo fundamentally scientific hain. Science optional nahi hai.

- ORS ki story yeh batati hai ki scientific knowledge duniya tab badlti hai jab woh un logon tak pahunche jo usse trust aur use kar sakein. Literacy, widely distributed, ek force multiplier hai.

- **Scientific thinking ke liye lab ki zaroorat nahi.** Observe karo, *kyun* poochho, hypothesis banao, test karo, revise karo — yeh method kisi bhi cheez pe apply hota hai. Sabse bada scientific instrument tumhara woh habit hai — bina pooche mat maano.`,
  },

  // ── indias-scientific-heritage ───────────────────────────────────────────────

  {
    slug: 'indias-scientific-heritage',
    id: 'f3cf5f16-336b-4420-8bd8-d1b9f431b79d',
    markdown: `*Rishi* — yeh word Sanskrit se aaya hai. Matlab hai **dekhna**. Sirf dekhna. Believe karna nahi, worship karna nahi, blindly follow karna nahi — directly, clearly dekhna. Hazaron saalon tak India mein aisi parampara rahi jisme log poori zindagi laga dete the sirf isi ek kaam mein: reality ko seedha samajhna. Simple zindagi jeete the — is liye nahi ki koi rule tha, balki isliye ki simplicity se inner noise clear hoti hai aur observation ki quality badhti hai.

---

Aaj modern neuroscience confirm kar rahi hai jo Rishis pehle se jaante the: **tumhare observation ki quality seedha depend karti hai tumhare attention ki quality pe — aur attention ki quality depend karti hai tumhari inner state pe.** Ek anxious, distracted mind ek blurred lens ki tarah hai. Blurred lens se jo picture aati hai woh sharp nahi hoti.

Isliye Rishis yoga aur meditation karte the. Religion ke liye nahi — **instrument calibration ke liye.** Jaise koi scientist apna equipment calibrate karta hai experiment se pehle, Rishi apni awareness calibrate karta tha observation se pehle.

---

Inner aur outer — yeh do alag cheezein nahi hain. Cosmos aur consciousness ek hi reality ke do pehlu hain. Ek ko sach mein samajhna mushkil hai agar doosre ko ignore karo. Yeh koi mystical claim nahi hai — yeh ek sophisticated position hai jis tak modern science cognitive science aur neurophenomenology jaise fields se slowly pahunch rahi hai. Rishis simply wahan pehle the.`,
  },

  {
    slug: 'indias-scientific-heritage',
    id: '4edbf907-cf40-4477-95a2-84e32c901af3',
    markdown: `In tamam logon ko — Aryabhata, Kanad, Pingala, Brahmagupta, Panini — ek cheez unite karti hai. Woh religion nahi hai.

Woh ek commitment hai: seedhi jaanch karo, systematic tarike se socho, aur jo mila woh honestly bolo. Yahi modern science ka foundation bhi hai — kisi bhi tradition mein, kisi bhi zamane mein. Vedic parampara aur baad ki European science mein difference inquiry ki *quality* ka nahi tha — difference tha us baat ka ki kya legitimate subject of investigation mana jaata tha. Rishis outer world ke saath inner world ko bhi study karte the — kyunki unke liye dono ek hi reality ke part the.

Modern science abhi slowly usi position pe pahunch rahi hai. Rishis bas pehle wahan the.`,
  },

  {
    slug: 'indias-scientific-heritage',
    id: '24801fb0-47d2-4c70-9de6-319e54816377',
    markdown: `Ancient India ke Rishis narrow sense mein religious figures nahi the. Woh total reality ke investigators the — bahar ki bhi, andar ki bhi. Mathematics, astronomy, medicine, linguistics, atomic theory — inme jo discoveries unhone ki woh unhe human history ke sabse bade scientific minds mein jagah deti hain.

Yeh book unki legacy honor karti hai — unke kaam ko sacred aur untouchable banaa ke nahi, balki exactly wahi karke jo unhone kiya: mushkil sawaal poochh ke, honestly investigate karke, aur evidence jahan bhi le jaaye wahan tak jaake.`,
  },

  // ── how-to-use-this-book ─────────────────────────────────────────────────────

  {
    slug: 'how-to-use-this-book',
    id: 'a438a191-e408-440d-b918-3cbe6e0f5277',
    markdown: `Is book ka har page ek hi structure follow karta hai — aur yeh structure randomly choose nahi kiya gaya. Har element ek specific kaam karta hai.

**Gita Verse (fun_fact block)** — Har page ke top pe, Bhagavad Gita ya India ki kisi aur gyaan-parampara ka ek shlok. Decoration ke liye nahi — ek sawaal ki tarah. Sawaal yeh: is ancient observation aur modern science ki discovery mein kya connection hai?

**Opening Question** — Ek aisa sawaal jo immediately answer nahi karna. Use page ke saath *saath carry* karna hai — pockets mein rakho, aage padhte jao. Woh "pata nahi abhi" wali feeling — understanding ka engine hai woh.

**Text and Heading blocks** — Yeh is page ka main content hai. Yeh blocks tumhe yeh nahi batate ki "kya hai" — yeh batate hain ki *"kyun hai"* aur *"kaise kaam karta hai."* Yeh ek argument build karte hain, list nahi. Inhe essay ki tarah padho — line by line reasoning follow karo.

**Callout blocks** — Alag border ke saath highlighted cards. Inke type ke hisaab se content alag hota hai: history ya supporting detail (note), exam mein kya aata hai (exam_tip), kya galti mat karna (warning), ya Vedic wisdom ka connection (fun_fact).

**Manana Moment** — Sanskrit *manana* (मनन) se aaya hai — matlab hai reflect karna, kisi cheez ko chaba-chaba ke digest karna. Yeh har page ka **sabse important hissa** hai. Yeh tumse woh karne ko kehta hai jo hardest hai: jo padha, use apni thinking pe lagao. Mastery dikhane ke liye nahi — sach mein socho.

**What This Page Teaches Us** — Key insights ka bullet summary. Revision ke waqt kaam aata hai, lekin yeh poora page padhne ka substitute nahi hai.`,
  },

  {
    slug: 'how-to-use-this-book',
    id: 'fcb54e14-a80f-46a8-9b31-2b71c2c4fc7c',
    markdown: `Textbook padhna aur science samajhna — yeh do alag kaam hain. Is book ko use karne ka tarika thoda different hai.

**Don't skim.** Har text block ek argument build karta hai — ek ke baad ek reasoning chalti hai. Skim karoge toh isolated words milenge, lekin woh logic miss ho jaayegi jo unhe connect karti hai. Aur knowledge *useful* hoti hai logic se — vocabulary se nahi.

**Pause at the Opening Question.** Page padhne se pehle, opening question ke saath thirty seconds baitho. Jawab dhundhne ki zaroorat nahi. Khud ko *"pata nahi"* ki state mein rehne do. Woh state problem nahi hai — woh learning ke liye zaruri starting condition hai.

**Engage with the Manana Moment.** Yeh formality nahi hai, skip mat karo. Woh sawaal jo wahan poochha gaya hai, woh is page ka sabse important sawaal hai. Agar tum page padh ke Manana Moment ignore kar dete ho, toh tumne information absorb ki — understanding mein convert nahi ki.

**Find the connection in the Gita verse.** Jab connection immediately obvious na ho, phir bhi ek minute ruko aur dhundhne ki koshish karo. Ancient wisdom ko modern science se connect karna ek practice hai *integrative thinking* ki — yeh rare bhi hai aur valuable bhi.

**Use this book alongside The Crucible.** Har page ke baad, practice platform pe jaao aur same topic ke questions attempt karo. Attempt karna — kuch galat karna, explanation padhna, samajhna *kyun* tumhari thinking galat thi — yeh baar baar same page dobara padhne se kahin zyada effectively understanding fix karta hai. Isse retrieval practice kehte hain. Cognitive science iske baare mein clearly bolta hai ki yeh kaam karta hai.`,
  },

  {
    slug: 'how-to-use-this-book',
    id: '3d34b428-0d03-4beb-8cf1-901a448df7b8',
    markdown: `Yeh book ek cheez karti hai jo zyataar science textbooks nahi karte: India ki ancient knowledge traditions ko modern scientific discoveries ke saath ek hi page pe rakhti hai.

Yeh nostalgia nahi hai. Nationalism nahi hai. **Yeh historical accuracy hai.**

Rishis — India ke scientist-philosophers — ne human knowledge mein real, documented contributions diye. Aryabhata ne Earth ki circumference calculate ki aur heliocentrism propose kiya — Copernicus se ek hazaar saal pehle. Kanad ne atomic theory articulate ki — Dalton se almost do hazaar saal pehle. Pingala ne binary mathematics develop ki — Boolean algebra exist karne se pehle. Brahmagupta ne zero pe arithmetic operations formalize kiye. Aur Panini ki Sanskrit grammar human history ki pehli formal generative grammar hai — Chomsky se 2,500 saal pehle.

Yeh myths nahi hain. Yeh documented historical facts hain — jinke texts ka time established hai, jinki mathematical content verify ki gayi hai.

In sab ko modern science ke saath rakhne ka ek specific purpose hai Indian students ke liye: science tumhe kisi foreign discovery jaisi nahi lagti. Woh tumhari apni intellectual inheritance ka **living part** lagti hai. Tum kisi bahar ki baatchiit mein join nahi ho rahe. **Tum ek aisi baatchiit continue kar rahe ho jismein tumhari civilization hazaron saalon se share rahi hai.**

Ancient aur modern mein se choose nahi karna. Scientific temperament — curiosity, careful observation, testing, honest revision — woh thread hai jo dono ko ek sootre mein perotaa hai. Aur yeh book usi thread se buni hai.`,
  },

  {
    slug: 'how-to-use-this-book',
    id: '67e77224-aee5-472a-9814-3a510d7c8adf',
    markdown: `- Is book ka har page ek hi architecture follow karta hai: Gita verse, Opening Question, narrative, callouts, Manana Moment, aur summary. Har cheez ka ek reason hai — kuch bhi decoration ke liye nahi.

- **Manana Moment** har page ka sabse important hissa hai. Yeh tumse woh karne ko kehta hai jo learning mein sabse mushkil hai: jo padha use apni thinking pe apply karo — sirf read karke aage mat badh jaao.

- Science padhna ek active kaam hai — arguments follow karo, sawaalon pe pause karo, connections dhundho. Skimming se words milte hain; padhne se samajh.

- **The Crucible practice platform** best kaam karta hai jab page ke immediately baad use karo. Retrieval practice — questions attempt karna jab material abhi fresh aur slightly uncertain ho — cognitive science ke sabse backed learning strategies mein se ek hai.

- Yeh book Indian knowledge traditions ko modern science ke saath isliye rakhti hai kyunki **scientific temperament — curiosity, observation, testing, honest revision — woh thread hai jo dono ko connect karta hai**. Tum kisi foreign tradition mein join nahi ho rahe. Tum apni hi tradition continue kar rahe ho.`,
  },

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('book_pages');

  const slugGroups = {};
  for (const u of updates) {
    if (!slugGroups[u.slug]) slugGroups[u.slug] = [];
    slugGroups[u.slug].push(u);
  }

  let updated = 0;
  for (const [slug, blocks] of Object.entries(slugGroups)) {
    console.log(`\n── ${slug}`);
    for (const { id, markdown } of blocks) {
      const result = await col.updateOne(
        { book_id: BOOK_ID, slug, 'hinglish_blocks.id': id },
        { $set: { 'hinglish_blocks.$.markdown': markdown } }
      );
      if (result.modifiedCount > 0) {
        console.log(`  ✅  [${id.slice(0, 8)}…]`);
        updated++;
      } else {
        console.warn(`  ⚠️   [${id.slice(0, 8)}…] — not found or unchanged`);
      }
    }
  }

  console.log(`\nDone. ${updated} / ${updates.length} blocks updated.`);
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
