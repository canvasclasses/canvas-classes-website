// Setup script: Class 9 Hindi गंगा — Chapter 1 (दो बैलों की कथा).
// PILOT SLICE: builds Page 1 (परिचय / लेखक से मिलिए) and Page 5 (शब्द-संपदा),
// the vocabulary showcase where the triple-bridge "scaffold flip" renders live
// (vocabulary_lab lang:'hindi'). Pages 2–4 (कहानी) and 6–11 follow next.
//
// Idempotent: skips pages that already exist; re-wires chapter page_ids sorted
// by page_number so partial builds navigate in order.
// Source: ~/Downloads/Class 9 Hindi/ihga101.pdf. Workflow: HINDI_BOOK_PAGE_WORKFLOW.md.
// Plan: _agents/plans/GANGA_CH1_OUTLINE.md.
//
// DB IMPACT: inserts up to 2 docs in `book_pages` + updates chapter 1's page_ids
// on the single गंगा `books` doc. No questions_v2 writes. published:false.
// Rollback: db.book_pages.deleteMany({ book_id:<id>, chapter_number:1, page_number:{$in:[1,5]} }).

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-hindi-ganga';
const CHAPTER_NO = 1;

// ─── Block helpers ─────────────────────────────────────────────────────────
let _o = 0;
const reset = () => { _o = 0; };
const hero = (alt, prompt) => ({
  id: uuidv4(), type: 'image', order: _o++,
  src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: prompt,
});
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const heading = (t, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text: t, level });
const curiosity = (prompt, hint) => ({ id: uuidv4(), type: 'curiosity_prompt', order: _o++, prompt, ...(hint ? { hint } : {}) });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const author = (fields) => ({ id: uuidv4(), type: 'meet_a_scientist', order: _o++, ...fields });
const quiz = (questions) => ({
  id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67,
  questions: questions.map(q => ({
    id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a,
    explanation: q.why, ...(q.lvl ? { difficulty_level: q.lvl } : {}),
  })),
});
// Triple-bridge card: [word, pron, pos, meaning(सरल हिंदी), english, example, hook]
const vcard = ([word, pronunciation, pos, meaning, english, example, memory_hook]) => ({
  id: uuidv4(), word, pronunciation, audio_url: '', pos, meaning, english, example,
  ...(memory_hook ? { memory_hook } : {}),
});
const vocab = (mode, intro, cards, self_check) => ({
  id: uuidv4(), type: 'vocabulary_lab', order: _o++, mode, lang: 'hindi', intro,
  cards: cards.map(vcard),
  ...(self_check ? { self_check: self_check.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why })) } : {}),
});

// ─── शब्द-संपदा data (from ihga101.pdf pp. 28–29 + GANGA_CH1_OUTLINE.md) ──────
// Block A — core 28
const CARDS_A = [
  ['निरापद','ni-raa-pad','विशेषण','सुरक्षित, निर्विघ्न, आपत्ति से रहित','safe; free from danger','क़िले की मोटी दीवारों के भीतर राजा ख़ुद को निरापद महसूस करता था।','नि (बिना) + आपद (विपत्ति) = बिना-विपत्ति।'],
  ['सहिष्णुता','sa-hish-nu-taa','संज्ञा','सहनशीलता, क्षमा','tolerance; forbearance','अलग-अलग विचारों के प्रति सहिष्णुता ही अच्छे समाज की पहचान है।','सहन + शीलता; "सहना" से।'],
  ['विषाद','vi-shaad','संज्ञा','उदासी, अवसाद, मन का उचट जाना','sadness; gloom; dejection','परीक्षा बिगड़ने पर उसके चेहरे पर गहरा विषाद छा गया।','आह्लाद (खुशी) का उलटा।'],
  ['पराकाष्ठा','pa-raa-kaash-thaa','संज्ञा','अंतिम सीमा, चरम कोटि','the highest limit; peak; climax','उसकी मेहनत त्याग की पराकाष्ठा थी।','परा (परे) + काष्ठा (सीमा) = सीमा के परे।'],
  ['कदाचित्','ka-daa-chit','क्रिया-विशेषण','कभी, शायद','perhaps; possibly','कदाचित् वह कल लौट आए।','"कदा" (कब) से — कभी-न-कभी।'],
  ['चौकस','chau-kas','विशेषण','चौकन्ना, सावधान','alert; watchful; careful','अच्छा पहरेदार हमेशा चौकस रहता है।','"चौकी" (पहरा) से।'],
  ['डील','deel','संज्ञा','कद, देह, शरीर की ऊँचाई-चौड़ाई','build; physique; bodily frame','पहलवान की डील देखते ही बनती थी।','डील-डौल = body size।'],
  ['विग्रह','vig-rah','संज्ञा','अलगाव, फूट, झगड़ा','conflict; split; discord','दो गुटों में विग्रह बढ़ता ही गया।','वि (अलग) + ग्रह (पकड़) = अलग खींचना।'],
  ['विनोद','vi-nod','संज्ञा','हँसी-मज़ाक, मनोरंजन, क्रीड़ा','fun; playful amusement','बैल विग्रह के नाते नहीं, केवल विनोद के भाव से सींग मिलाते थे।','"विनोदी" = मज़ाकिया।'],
  ['आत्मीयता','aat-mee-ya-taa','संज्ञा','अपनापन, मैत्री','closeness; affection; sense of belonging','बरसों साथ रहने से दोनों में गहरी आत्मीयता हो गई।','आत्मा + ईयता = "अपनेपन" का भाव।'],
  ['नाँद','naand','संज्ञा','पशुओं को चारा-पानी देने का बड़ा चौड़ा बर्तन','feeding trough (for cattle)','बैलों ने नाँद में मुँह डाला तो चारा फीका लगा।','गाँव का शब्द — animal’s bowl।'],
  ['गोई','go-ee','संज्ञा','खेल का साथी, सखी','playmate; companion','बचपन की गोई आज भी याद आती है।','"गुइयाँ" = संगी-साथी।'],
  ['पगहिया','pag-hi-yaa','संज्ञा','पशु बाँधने की रस्सी','tether rope (for cattle)','खूँटे से पगहिया खोलकर बैल को ले चला।','"पग" (पैर) के पास बँधी रस्सी।'],
  ['कनखियों से','kan-khi-yon-se','क्रिया-विशेषण','तिरछी निगाह से, आँख के इशारे से','out of the corner of the eye; a sidelong glance','दोनों ने एक-दूसरे को कनखियों से देखा और लेट गए।','कान + आँख की कोर = side-look।'],
  ['चरनी','char-nee','संज्ञा','चबूतरा जिस पर गाय-बैल को चारा दिया जाता है','cattle feeding-platform; manger','सुबह बैल चरनी पर खड़े मिले।','"चरना" (to graze) से।'],
  ['गराँव','ga-raanv','संज्ञा','बैल के गले की फंदेदार रस्सी','neck-noose rope (for an ox)','दोनों की गरदनों में आधा-आधा गराँव लटक रहा था।','"गर" = गला; गले की रस्सी।'],
  ['प्रतिवाद','pra-ti-vaad','संज्ञा','विरोध, खंडन','objection; rebuttal; contradiction','किसी ने उसके कथन का प्रतिवाद करने का साहस न किया।','प्रति (विरुद्ध) + वाद (कथन) = counter-argument।'],
  ['ताकीद','taa-keed','संज्ञा','बार-बार चेताने/कहने की क्रिया','firm, repeated warning; insistence','माँ ने ताकीद की कि देर न करना।','उर्दू मूल — strong reminder।'],
  ['टिटकारना','tit-kaar-naa','क्रिया','"टिक-टिक" करके पशु को चलने के लिए उकसाना','to urge cattle on with a clicking sound','हाँकने वाले ने टिटकार कर बैल आगे बढ़ाए।','ध्वनि-शब्द — "टिक्-टिक्" से।'],
  ['तेवर','te-var','संज्ञा','क्रोधभरी तिरछी नज़र, भौंह का भाव','an angry, menacing expression','उसके तेवर देखकर सब समझ गए कि टालना ही ठीक है।','चेहरे का mood।'],
  ['थान','thaan','संज्ञा','पशुओं के बाँधे जाने की जगह','a cattle’s tethering spot/stall','शाम को बैल थान पर बाँध दिए गए।','पशु का "घर"।'],
  ['बरकत','bar-kat','संज्ञा','वृद्धि, बढ़ती, लाभ, सौभाग्य','increase; blessing; prosperity','प्रेम के इस प्रसाद की बरकत थी कि बैल दुर्बल न हुए।','उर्दू — "बढ़ोतरी, भलाई"।'],
  ['बेतहाशा','be-ta-haa-shaa','क्रिया-विशेषण','बिना सोचे, बदहवास होकर, बहुत तेज़','recklessly; headlong; frantically','वह बेतहाशा भागा और गिरते-गिरते बचा।','बे (बिना) + तहाशा (होश)।'],
  ['व्याकुल','vyaa-kul','विशेषण','घबराया हुआ, बेचैन, व्यग्र','restless; agitated; anxious','भूख से दोनों बैल व्याकुल हो रहे थे।','वि + आकुल = "आकुल" का तीव्र रूप।'],
  ['गोदना','god-naa','क्रिया','सींग चुभाना; खदेड़ना','to gore/jab; to drive away','मोती ने साँड़ को बगल से सींग गोद दिया।','"गोदना" = poke deep।'],
  ['तजुरबा','ta-jur-baa','संज्ञा','अनुभव','experience','साँड़ को संगठित शत्रुओं से लड़ने का तजुरबा न था।','उर्दू "experience"।'],
  ['मल्लयुद्ध','mall-yuddh','संज्ञा','कुश्ती, बाहुयुद्ध','wrestling; hand-to-hand combat','वह एक ही शत्रु से मल्लयुद्ध का आदी था।','मल्ल (पहलवान) + युद्ध।'],
  ['ग्रास','graas','संज्ञा','कौर, निवाला; निगलना','a morsel; mouthful; to swallow up','अभी दो ही ग्रास खाए थे कि लाठियाँ पड़ीं।','"ग्रसना" (to seize) से।'],
];
// Block B — 15 more
const CARDS_B = [
  ['मेंड़','mend','संज्ञा','खेत की सीमा पर बना मिट्टी का घेरा','a raised field-boundary ridge','हीरा मेंड़ पर था, इसलिए निकल गया।','खेत की "दीवार"।'],
  ['खुर','khur','संज्ञा','पशु के पाँव का नख, टाप','hoof','मोती के खुर कीचड़ में धँस गए।','animal’s foot-nail।'],
  ['काँजीहौस','kaan-jee-haus','संज्ञा','आवारा पशुओं को बंद करने का सरकारी बाड़ा','a cattle pound (colonial "cow-house")','प्रातःकाल दोनों मित्र काँजीहौस में बंद कर दिए गए।','अंग्रेज़ी "pound" का देसी रूप — कहानी में यह "जेल" का प्रतीक है।'],
  ['साबिका','saa-bi-kaa','संज्ञा','वास्ता, सरोकार, काम पड़ना','a dealing; an encounter; concern','जीवन में पहली बार उन्हें ऐसा साबिका पड़ा।','उर्दू — "to deal with"।'],
  ['तृप्ति','trip-ti','संज्ञा','भोजन आदि से उत्पन्न संतोष','satisfaction; contentment','सूखी मिट्टी चाटने से क्या तृप्ति होती?','"तृप्त" (satisfied) से।'],
  ['दहक','da-hak','संज्ञा','आग का दहकना, लपट, ज्वाला','a blaze; burning flame','हीरा के दिल में विद्रोह की ज्वाला दहक उठी।','"दहकना" (to blaze) से।'],
  ['उजड्डपन','uj-jadd-pan','संज्ञा','अशिष्टता, उद्दंडता','rudeness; unruliness; boorishness','हीरा का उजड्डपन देखकर चौकीदार ने डंडे जमाए।','"उजड्ड" + पन।'],
  ['बूता','boo-taa','संज्ञा','सामर्थ्य, बल, शक्ति','strength; capacity; might','अपने बूते-भर ज़ोर तो मार दिया।','"इस बूते पर" = on this strength।'],
  ['आज़माना','aaz-maa-naa','क्रिया','परीक्षा/जाँच के लिए प्रयोग करना','to test; to try out','दो घंटे की ज़ोर-आज़माई के बाद दीवार गिरी।','उर्दू — "to put to the test"।'],
  ['चेत','chet','संज्ञा','होश, सुध, जागरूकता','consciousness; senses; awareness','दीवार गिरते ही सब जानवर चेत उठे।','"चेतना" से।'],
  ['दुग्गी','dug-gee','संज्ञा','चमड़े से मढ़ा चौड़े मुँह का छोटा बाजा','a small wide-mouthed drum','बाड़े के सामने दुग्गी बजने लगी।','"डुग-डुग" ध्वनि से।'],
  ['उन्मत्त','un-matt','विशेषण','मतवाला, मस्त, सनकी','intoxicated; frenzied; wildly excited','दोनों उन्मत्त होकर बछड़ों की भाँति कुलेलें करने लगे।','उत् + मत्त (मतवाला)।'],
  ['नीलाम','nee-laam','संज्ञा','सबसे ऊँची बोली वाले को बेचने की रीति','an auction','ऐसे मृतक बैलों को नीलाम में कौन ख़रीदता?','highest-bid sale।'],
  ['अख़्तियार','akh-ti-yaar','संज्ञा','अधिकार, वश','authority; right; control','मेरे बैल नीलाम करने का किसी को क्या अख़्तियार है?','उर्दू — "to have authority"।'],
  ['पछाईं','pa-chhaaeen','विशेषण','उन्नत पश्चिमी नस्ल का','of the western region; (here) of fine breed','दोनों पछाईं जाति के थे — सुंदर और चौकस।','"पछाँह" (पश्चिम) से।'],
];

// ─── Pages ─────────────────────────────────────────────────────────────────
const PAGES = [];

// Page 1 — परिचय / लेखक से मिलिए
reset();
PAGES.push({
  slug: 'parichay-premchand', title: 'परिचय — लेखक से मिलिए', page_number: 1, tags: [],
  blocks: [
    hero(
      'मुंशी प्रेमचंद का जलरंग चित्र',
      'Watercolour bust-portrait of Munshi Premchand (Hindi writer), early-20th-century North India, simple kurta and round spectacles, a thoughtful expression, warm lamplight on a dark neutral ground. Loose luminous washes, soft bleeding edges, pigment granulation, visible paper grain. No text.'
    ),
    curiosity(
      'क्या आपने कभी किसी जानवर — कुत्ते, बैल या गाय — से ऐसा अपनापन महसूस किया है कि लगे वह आपकी बात समझता है? उस एक पल को याद कीजिए और सोचिए — क्या जानवर भी हमारी तरह सुख-दुख महसूस करते होंगे?',
      'अपने या आस-पास के किसी पालतू जानवर के बारे में सोचिए।'
    ),
    author({
      name: 'प्रेमचंद',
      years: '1880–1936',
      nationality: 'भारतीय — लमही, वाराणसी (उत्तर प्रदेश)',
      portrait_src: '',
      portrait_prompt: 'Watercolour bust-portrait of Munshi Premchand, simple kurta, round spectacles, warm lamplight on a dark ground. Loose washes, paper grain. No text.',
      contribution: 'हिंदी-उर्दू के सबसे बड़े कथाकार — "उपन्यास सम्राट"। उनकी कहानियाँ **मानसरोवर** के आठ भागों में संकलित हैं; **गोदान**, सेवासदन, रंगभूमि, निर्मला और गबन उनके प्रमुख उपन्यास हैं। किसान, मज़दूर, दलित, स्त्री और स्वाधीनता-आंदोलन उनकी रचनाओं के मूल विषय हैं।',
      connection: '"दो बैलों की कथा" में उन्होंने पशुओं के बहाने यह दिखाया कि स्वतंत्रता सहज नहीं मिलती — उसके लिए बार-बार संघर्ष करना पड़ता है।',
      fun_detail: 'शिक्षा-विभाग की सरकारी नौकरी उन्होंने असहयोग आंदोलन में कूदने के लिए छोड़ दी और कलम को ही अपना हथियार बना लिया।',
      learn_more: 'कहानी-संग्रह "मानसरोवर" (आठ भाग) और उपन्यास "गोदान"।',
    }),
    callout('india_voice', 'पंचतंत्र की परंपरा में',
      'प्रेमचंद ने इस कहानी में **"पंचतंत्र"** और **"हितोपदेश"** जैसी पशु-कथाओं की पुरानी भारतीय परंपरा को अपनाया और आगे बढ़ाया। फ़र्क़ बस इतना है कि यहाँ पशु केवल नीति नहीं सिखाते — वे आज़ादी की पूरी लड़ाई का प्रतीक बन जाते हैं।'),
    text('इस कहानी के दो नायक हैं — **हीरा** और **मोती**, झूरी किसान के दो बैल। ऊपर से यह दो बैलों की दोस्ती की कहानी है, पर भीतर-भीतर यह उस हर इंसान की कहानी है जो ग़ुलामी के सामने सिर नहीं झुकाता। पढ़ते समय एक बात पर ध्यान रखिए — बैल कब-कब इंसानों की तरह सोचते, बोलते और महसूस करते हैं।\n\nआगे बढ़ने से पहले, कहानी के कुछ कठिन शब्द पहले से जान लीजिए — ताकि पढ़ते समय रुकना न पड़े।'),
    vocab('flashcards',
      'इन आठ शब्दों को कहानी में आप बार-बार मिलेंगे। हर कार्ड पर टैप कर के पलटिए — सरल हिंदी अर्थ के साथ उसका **English** मतलब भी मिलेगा।',
      [
        ['निरापद','ni-raa-pad','विशेषण','सुरक्षित, निर्विघ्न','safe; free from danger','गधे की निरापद सहनशीलता ही उसे बेवक़ूफ़ कहलवाती है।','नि (बिना) + आपद (विपत्ति)।'],
        ['सहिष्णुता','sa-hish-nu-taa','संज्ञा','सहनशीलता, क्षमा','tolerance; forbearance','गधे में ऋषियों-जैसी सहिष्णुता है।','सहन + शीलता।'],
        ['विषाद','vi-shaad','संज्ञा','उदासी, मन का उचट जाना','sadness; gloom','गधे के चेहरे पर एक स्थायी विषाद छाया रहता है।','आह्लाद (खुशी) का उलटा।'],
        ['आत्मीयता','aat-mee-ya-taa','संज्ञा','अपनापन, मैत्री','closeness; affection','हीरा-मोती में गहरी आत्मीयता थी।','आत्मा + ईयता।'],
        ['विग्रह','vig-rah','संज्ञा','फूट, झगड़ा','conflict; discord','वे विग्रह के नाते नहीं, विनोद से सींग मिलाते थे।','वि (अलग) + ग्रह (पकड़)।'],
        ['व्याकुल','vyaa-kul','विशेषण','घबराया, बेचैन','restless; anxious','भूख से दोनों बैल व्याकुल हो रहे थे।','वि + आकुल।'],
        ['काँजीहौस','kaan-jee-haus','संज्ञा','आवारा पशुओं का सरकारी बाड़ा','a cattle pound (jail-like)','दोनों मित्र काँजीहौस में बंद कर दिए गए।','कहानी में यह "जेल" का प्रतीक है।'],
        ['नीलाम','nee-laam','संज्ञा','ऊँची बोली पर बेचना','an auction','मृतक-से बैलों को नीलाम में कौन ख़रीदता?','highest-bid sale।'],
      ]
    ),
    quiz([
      { q: 'प्रेमचंद को किस उपाधि से जाना जाता है?', opts: ['कविता सम्राट','उपन्यास सम्राट','नाटक सम्राट','कहानी सम्राट'], a: 1, why: 'उनके विशाल और प्रभावशाली उपन्यास-लेखन के कारण उन्हें "उपन्यास सम्राट" कहा जाता है।', lvl: 1 },
      { q: '"दो बैलों की कथा" किस पुरानी भारतीय परंपरा को आगे बढ़ाती है?', opts: ['रामायण-महाभारत','पंचतंत्र और हितोपदेश','वेद','ग़ज़ल'], a: 1, why: 'यह पशु-कथाओं की पंचतंत्र-हितोपदेश परंपरा से जुड़ी है, जहाँ पशुओं के माध्यम से बड़ी बात कही जाती है।', lvl: 2 },
      { q: 'इस कहानी में हीरा और मोती असल में किसके प्रतीक माने जाते हैं?', opts: ['अमीर किसानों के','अंग्रेज़ शासकों के','ग़ुलामी से लड़ने वाली भारतीय जनता के','आलसी लोगों के'], a: 2, why: 'बैलों का बार-बार संघर्ष और लौटना स्वतंत्रता-आंदोलन की भावना का प्रतीक है — आज़ादी सहज नहीं मिलती।', lvl: 3 },
    ]),
  ],
});

// Page 5 — शब्द-संपदा (the vocabulary showcase)
reset();
PAGES.push({
  slug: 'shabd-sampada', title: 'शब्द-संपदा', page_number: 5, tags: ['ganga_section:bhasha_se_samvad'],
  blocks: [
    hero(
      'पुरानी हिंदी पुस्तक से उड़ते देवनागरी अक्षर',
      'Watercolour 16:5 banner — an open old Hindi book with Devanagari letters lifting off the page as glowing amber motes, a brass oil lamp beside it. Dark atmospheric ground, warm light, subtle Madhubani line-border accents. Loose luminous washes, visible paper grain. No text.'
    ),
    text('कहानी के सबसे कठिन शब्द यहाँ एक जगह हैं। हर कार्ड पर टैप कर के पलटिए — आपको मिलेगा **सरल हिंदी अर्थ**, उसका **English** मतलब, एक रोज़मर्रा का उदाहरण और याद रखने की एक ट्रिक। जो शब्द अपना बनाना चाहें, उसे **"+ शब्दकोश में जोड़ें"** से अपने Word Vault में सहेज लीजिए — वहाँ से बाद में दोहरा सकते हैं।'),
    vocab('flashcards',
      'भाग १: कहानी के मूल शब्द (28)।',
      CARDS_A,
      [
        { q: 'इनमें से किस शब्द का अर्थ "सुरक्षित" है?', opts: ['विषाद','निरापद','प्रतिवाद','उजड्डपन'], a: 1, why: 'निरापद = आपत्ति से रहित, सुरक्षित (safe)।' },
        { q: '"नाँद" किसे कहते हैं?', opts: ['गले की रस्सी','पशुओं का चारा-पानी देने का बड़ा बर्तन','खेत की सीमा','छोटा बाजा'], a: 1, why: 'नाँद = feeding trough — पशुओं को चारा-पानी देने का बड़ा चौड़ा बर्तन।' },
        { q: '"तजुरबा" का अर्थ क्या है?', opts: ['अनुभव','क्रोध','थकान','भूख'], a: 0, why: 'तजुरबा = experience, अनुभव।' },
      ]
    ),
    vocab('flashcards',
      'भाग २: काँजीहौस और आज़ादी वाले हिस्से के शब्द (15)।',
      CARDS_B
    ),
    quiz([
      { q: '"बेतहाशा भागना" का सबसे सटीक अर्थ है —', opts: ['धीरे-धीरे चलना','बिना सोचे, बदहवास होकर तेज़ भागना','रुक-रुक कर चलना','पीछे लौटना'], a: 1, why: 'बेतहाशा = बिना होश, बदहवास होकर — recklessly/headlong।', lvl: 1 },
      { q: 'कहानी में "काँजीहौस" किसका प्रतीक बनकर आता है?', opts: ['घर का','खेत का','जेल/ग़ुलामी का','बाज़ार का'], a: 2, why: 'आवारा पशुओं को बंद करने वाला यह बाड़ा कहानी में जेल और ग़ुलामी का प्रतीक है।', lvl: 2 },
      { q: '"अख़्तियार" शब्द झूरी के किस भाव को दिखाता है जब वह कहता है "मेरे बैल नीलाम करने का किसी को क्या अख़्तियार है"?', opts: ['डर','अपने हक़ और मालिकाना अधिकार का','दया का','मज़ाक का'], a: 1, why: 'अख़्तियार = अधिकार/हक़। झूरी अपने बैलों पर अपने अधिकार का दावा कर रहा है।', lvl: 3 },
    ]),
  ],
});

// ─── Insert ────────────────────────────────────────────────────────────────
function contentTypes(blocks) { return [...new Set(blocks.map(b => b.type))]; }

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found. Run setup_class9_hindi_book.js first.`);
    console.log(`✓ Found book: ${book.title} (${book._id})`);

    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: String(book._id), slug: p.slug });
      if (existing) { console.log(`  ⤷ Page "${p.slug}" already exists — skipping.`); continue; }
      const pageId = uuidv4();
      await pages.insertOne({
        _id: pageId,
        book_id: String(book._id),
        chapter_number: CHAPTER_NO,
        page_number: p.page_number,
        slug: p.slug,
        title: p.title,
        blocks: p.blocks,
        hinglish_blocks: [],
        tags: p.tags || [],
        published: false,
        reading_time_min: 5,
        content_types: contentTypes(p.blocks),
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log(`  ✓ Created page ${p.page_number}: ${p.slug} (${p.blocks.length} blocks)`);
    }

    // Re-wire chapter 1 page_ids: ALL chapter-1 pages, sorted by page_number.
    const chPages = await pages.find({ book_id: String(book._id), chapter_number: CHAPTER_NO })
      .project({ _id: 1, page_number: 1 }).toArray();
    chPages.sort((a, b) => a.page_number - b.page_number);
    const orderedIds = chPages.map(p => String(p._id));
    await books.updateOne(
      { _id: book._id, 'chapters.number': CHAPTER_NO },
      { $set: { 'chapters.$.page_ids': orderedIds, updated_at: new Date() } }
    );
    console.log(`✓ Wired ${orderedIds.length} page(s) into chapter ${CHAPTER_NO} (sorted by page_number).`);
  } finally {
    await client.close();
  }
}

export { PAGES };

// Only connect + write when run directly (not when imported by the validator).
if (process.argv[1] && process.argv[1].endsWith('setup_class9_hindi_ch1.js')) {
  main().catch(err => { console.error(err); process.exit(1); });
}
