// Setup script: Class 9 Hindi गंगा — Chapter 1 (दो बैलों की कथा), STORY pages 2–4.
// narrated_passage text = VERBATIM प्रेमचंद excerpts transcribed from ihga101.pdf
// pp.4–15 (image-verified; the PDF text layer is mangled). Orientation `text`
// blocks are the author's (clearly-authorial) bridging voice. Every gloss carries
// an `example` (Kaveri quality lesson). lang/hindi: glosses encode "सरल हिंदी — English".
//
// Idempotent: skips existing pages; re-wires chapter 1 page_ids sorted by page_number.
// DB IMPACT: inserts up to 3 docs in `book_pages` + updates chapter-1 page_ids. published:false.
// Rollback: db.book_pages.deleteMany({ book_id:<id>, chapter_number:1, page_number:{$in:[2,3,4]} }).

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
const hero = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: prompt });
const img = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'three_quarter', aspect_ratio: '16:9', generation_prompt: prompt });
const heading = (t, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text: t, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
// gloss: meaning carries "सरल हिंदी — English"; always include example.
const g = (word, meaning, pos, example) => ({ word, meaning, pos, example });
const s = (text, glosses) => ({ id: uuidv4(), text, audio_url: '', ...(glosses ? { glosses } : {}) });
const para = (sentences, commentary) => ({ id: uuidv4(), sentences, ...(commentary ? { hinglish_commentary: commentary } : {}) });
const narrated = (source_label, paragraphs) => ({ id: uuidv4(), type: 'narrated_passage', order: _o++, source_label, paragraphs });
const checkpoint = (intro, qs) => ({ id: uuidv4(), type: 'comprehension_checkpoint', order: _o++, ...(intro ? { intro } : {}), questions: qs.map(q => ({ id: uuidv4(), question: q.q, ...(q.opts ? { options: q.opts, correct_index: q.a } : {}), explanation: q.why })) });
const reasoning = (prompt, reveal, difficulty = 3) => ({ id: uuidv4(), type: 'reasoning_prompt', order: _o++, reasoning_type: 'logical', prompt, reveal, difficulty_level: difficulty });
const quiz = (questions) => ({ id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67, questions: questions.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why, ...(q.lvl ? { difficulty_level: q.lvl } : {}) })) });

const PAGES = [];

// ═══ PAGE 2 — भाग १: गधा-बैल · हीरा-मोती · पहली बार बिके और भाग आए ═══
reset();
PAGES.push({
  slug: 'kahani-bhag-1', title: 'कहानी — भाग १', page_number: 2, tags: [],
  blocks: [
    hero('हीरा और मोती — झूरी के दो बैल', 'Watercolour 16:5 banner — two white oxen, हीरा and मोती, yoked together in a North-Indian village courtyard at dusk, a kachcha house with tiled roof behind, a नाँद (mud feeding trough) in the foreground, a boy with a green fodder bundle. Dark atmospheric ground, warm rim light. Loose luminous washes, visible paper grain. No text.'),
    heading('भाग १ — दो दोस्तों की कथा', 2),
    text('कहानी की शुरुआत प्रेमचंद एक मज़ेदार बहस से करते हैं — कि गधा सचमुच बेवक़ूफ़ है, या उसकी **सहनशीलता** ही उसे यह नाम दिला देती है? इसी बहस से वे हमें बैल — हीरा और मोती — तक ले आते हैं।'),
    narrated('भाग १ · आरंभ', [
      para([
        s('जानवरों में गधा सबसे ज़्यादा बुद्धिहीन समझा जाता है। हम जब किसी आदमी को परले दरजे का बेवक़ूफ़ कहना चाहते हैं, तो उसे गधा कहते हैं।'),
        s('गधा सचमुच बेवक़ूफ़ है, या उसके सीधेपन, उसकी निरापद सहिष्णुता ने उसे यह पदवी दे दी है, इसका निश्चय नहीं किया जा सकता।', [
          g('निरापद', 'सुरक्षित, आपत्ति से रहित — safe, free from danger', 'विशेषण', 'क़िले की मोटी दीवारों के भीतर राजा ख़ुद को निरापद महसूस करता था।'),
          g('सहिष्णुता', 'सहनशीलता, क्षमा — tolerance; forbearance', 'संज्ञा', 'अलग-अलग विचारों के प्रति सहिष्णुता अच्छे समाज की पहचान है।'),
        ]),
        s('उसके चेहरे पर एक स्थायी विषाद स्थायी रूप से छाया रहता है।', [
          g('विषाद', 'उदासी, मन का उचट जाना — sadness; gloom', 'संज्ञा', 'परीक्षा बिगड़ने पर उसके चेहरे पर गहरा विषाद छा गया।'),
        ]),
      ], 'देखो — प्रेमचंद गधे की "बेवक़ूफ़ी" का मज़ाक उड़ाते-उड़ाते असल में उसकी सहनशीलता की तारीफ़ कर रहे हैं। यही व्यंग्य आगे बैलों पर भी लागू होगा।'),
      para([
        s('झूरी के दोनों बैलों के नाम थे हीरा और मोती। दोनों पछाईं जाति के थे— देखने में सुंदर, काम में चौकस, डील में ऊँचे।', [
          g('पछाईं', 'उन्नत पश्चिमी नस्ल का — of fine western breed', 'विशेषण', 'दोनों पछाईं जाति के थे, इसलिए ख़ूब हट्टे-कट्टे थे।'),
          g('चौकस', 'सावधान, चौकन्ना — alert; careful', 'विशेषण', 'अच्छा पहरेदार हमेशा चौकस रहता है।'),
          g('डील', 'कद, देह — build; physique', 'संज्ञा', 'पहलवान की डील देखते ही बनती थी।'),
        ]),
        s('दोनों एक-दूसरे को चाटकर और सूँघकर अपना प्रेम प्रकट करते, कभी-कभी दोनों सींग भी मिला लिया करते थे— विग्रह के नाते से नहीं, केवल विनोद के भाव से, आत्मीयता के भाव से।', [
          g('विग्रह', 'झगड़ा, फूट — conflict; discord', 'संज्ञा', 'दो गुटों में विग्रह बढ़ता ही गया।'),
          g('विनोद', 'हँसी-मज़ाक, क्रीड़ा — fun; playful amusement', 'संज्ञा', 'बच्चे विनोद के भाव से एक-दूसरे को छेड़ते रहे।'),
          g('आत्मीयता', 'अपनापन, मैत्री — closeness; affection', 'संज्ञा', 'बरसों साथ रहने से दोनों में गहरी आत्मीयता हो गई।'),
        ]),
      ]),
    ]),
    checkpoint('रुकिए और सोचिए —', [
      { q: 'हीरा और मोती आपस में सींग क्यों मिलाते थे?', opts: ['झगड़े और दुश्मनी से', 'केवल विनोद और आत्मीयता के भाव से', 'मालिक के कहने पर', 'डर के मारे'], a: 1, why: 'पाठ कहता है — "विग्रह के नाते से नहीं, केवल विनोद के भाव से" — यानी दोस्ती और मस्ती में।' },
    ]),
    text('फिर एक दिन झूरी ने दोनों को अपने साले **गया** के घर भेज दिया। बैलों को यह "अपना बेचा जाना" जैसा लगा — और वे पहली रात ही रस्सी तुड़ाकर अपने घर लौट आए।'),
    narrated('भाग १ · घर की वापसी', [
      para([
        s('संध्या समय दोनों बैल अपने नए स्थान पर पहुँचे। दिन-भर के भूखे थे, लेकिन जब नाँद में लगाए गए, तो एक ने भी उसमें मुँह न डाला।', [
          g('नाँद', 'पशुओं का चारा-पानी देने का बड़ा बर्तन — a cattle feeding trough', 'संज्ञा', 'बैलों ने नाँद में मुँह डाला तो चारा फीका लगा।'),
        ]),
        s('दिल भारी हो रहा था। जिसे उन्होंने अपना घर समझ रखा था, वह आज उनसे छूट गया था।'),
      ]),
      para([
        s('जब गाँव में सोता पड़ गया, तो दोनों ने ज़ोर मारकर पगहे तुड़ा डाले और घर की तरफ़ चले।', [
          g('पगहे', 'पशु बाँधने की रस्सी (पगहा) — the tether ropes', 'संज्ञा', 'खूँटे से पगहा खोलकर बैल को ले चला।'),
        ]),
        s('झूरी प्रातःकाल सोकर उठा, तो देखा कि दोनों बैल चरनी पर खड़े हैं। दोनों की गरदनों में आधा-आधा गराँव लटक रहा है और दोनों की आँखों में विद्रोहमय स्नेह झलक रहा है।', [
          g('चरनी', 'गाय-बैल को चारा देने का चबूतरा — cattle feeding-platform', 'संज्ञा', 'सुबह बैल चरनी पर खड़े मिले।'),
          g('गराँव', 'बैल के गले की फंदेदार रस्सी — neck-noose rope', 'संज्ञा', 'दोनों की गरदनों में आधा-आधा गराँव लटक रहा था।'),
        ]),
      ], 'इस एक वाक्य में पूरी कहानी की चाबी है — "विद्रोहमय स्नेह"। बैल मालिक से प्यार भी करते हैं और उसकी ग़ुलामी से बग़ावत भी। यही द्वंद्व आगे बढ़ता जाएगा।'),
    ]),
    img('झूरी अपने लौटे हुए बैलों को गले लगाता हुआ', 'Watercolour — an old farmer झूरी joyfully embracing his two returned white oxen at dawn in a village courtyard, village children clapping around them, half-broken neck-ropes hanging. Dark warm ground, soft morning light. Loose washes, paper grain. No text.'),
    reasoning(
      '"दोनों की आँखों में विद्रोहमय स्नेह झलक रहा है।" — स्नेह (प्यार) और विद्रोह (बग़ावत) तो उलटी बातें हैं। प्रेमचंद ने इन्हें एक साथ क्यों रखा? बैलों के मन में क्या चल रहा होगा?',
      'दोनों भाव एक साथ सच हैं — बैल झूरी से प्यार करते हैं (इसलिए लौट आए), पर बिकने/ग़ुलामी के ख़िलाफ़ उनका मन बग़ावत करता है (इसलिए रस्सी तोड़ी)। यही "विद्रोहमय स्नेह" इंसान की आज़ादी की चाह जैसा है — अपनों से जुड़ाव, पर पराधीनता से इनकार।',
      3
    ),
    quiz([
      { q: 'झूरी ने दोनों बैलों को किसके यहाँ भेजा था?', opts: ['अपने साले गया के यहाँ', 'अपने बड़े बेटे के पास', 'गाँव के पड़ोसी के घर', 'किसी दूर के व्यापारी को'], a: 0, why: 'झूरी ने बैलों को अपने साले गया के यहाँ भेज दिया था।', lvl: 1 },
      { q: 'नए स्थान पर पहुँचकर बैलों ने नाँद में मुँह क्यों नहीं डाला?', opts: ['अपना घर छूटने का दुख', 'चारा गंदा और सड़ा हुआ था', 'पेट पहले से ही भरा हुआ था', 'वे दोनों बहुत बीमार थे'], a: 0, why: 'अपना घर छूट जाने का दुख इतना गहरा था कि भूखे होकर भी उन्होंने चारा नहीं खाया।', lvl: 2 },
      { q: '"विद्रोहमय स्नेह" से प्रेमचंद बैलों के किस भाव की ओर इशारा करते हैं?', opts: ['प्यार और बग़ावत, दोनों एक साथ', 'मालिक के प्रति सिर्फ़ गहरे गुस्से', 'नए घर के प्रति सिर्फ़ डर', 'सिर्फ़ भूख और थकान'], a: 0, why: 'बैल मालिक से जुड़ाव भी रखते हैं और ग़ुलामी के विरुद्ध बग़ावत भी — यही द्वंद्व इस वाक्य में है।', lvl: 3 },
    ]),
  ],
});

// ═══ PAGE 3 — भाग २–३: छोटी लड़की · भाग निकलना · साँड़ से युद्ध ═══
reset();
PAGES.push({
  slug: 'kahani-bhag-2-3', title: 'कहानी — भाग २–३', page_number: 3, tags: [],
  blocks: [
    hero('खुले खेतों में दौड़ते दो बैल', 'Watercolour 16:5 banner — two white oxen running free across open night fields, dust rising, a fierce bull silhouetted in the distance under a dark moonlit sky. Dark ground, warm moonlit rim light. Loose washes, granulation, paper grain. No text.'),
    heading('भाग २ — अपमान, और एक छोटी-सी दोस्त', 2),
    text('गया अब बैलों से कड़ा बरताव करता है — मारता है, सूखा भूसा देता है। बैलों का स्वाभिमान आहत होता है। इसी बीच उन्हें एक नन्ही दोस्त मिलती है — भैरो की बेटी, जिसकी माँ मर चुकी है।'),
    narrated('भाग २ · दो रोटियाँ', [
      para([
        s('हीरा ने मूक-भाषा में कहा– "भागना व्यर्थ है।" मोती ने उत्तर दिया– "तुम्हारी तो इसने जान ही ले ली थी।"', [
          g('मूक-भाषा', 'बिना बोले, इशारों की भाषा — silent/wordless language', 'संज्ञा', 'दोनों दोस्त मूक-भाषा में ही सब समझ लेते थे।'),
        ]),
        s('उस वक़्त एक छोटी-सी लड़की दो रोटियाँ लिए निकली और दोनों के मुँह में देकर चली गई।'),
        s('लड़की भैरो की थी। उसकी माँ मर चुकी थी। सौतेली माँ उसे मारती रहती थी, इसलिए इन बैलों से उसे एक प्रकार की आत्मीयता हो गई थी।', [
          g('सौतेली माँ', 'पिता की दूसरी पत्नी — stepmother', 'संज्ञा', 'सौतेली माँ उस अनाथ लड़की पर दया नहीं करती थी।'),
        ]),
      ], 'ध्यान दो — दुखी और अकेली लड़की को इन दुखी बैलों से अपनापन महसूस होता है। प्रेमचंद दिखाते हैं कि दर्द एक-दूसरे को पहचान लेता है।'),
    ]),
    checkpoint(null, [
      { q: 'छोटी लड़की को बैलों से अपनापन क्यों महसूस हुआ?', opts: ['वह बैलों की मालिक थी', 'वह भी दुखी और अकेली थी — सौतेली माँ उसे मारती थी', 'उसे बैल पालना पसंद था', 'मालिक ने कहा था'], a: 1, why: 'अनाथ और प्रताड़ित लड़की का दुख बैलों के दुख से जा मिला — इसी साझे दर्द से आत्मीयता बनी।' },
    ]),
    text('एक रात वही लड़की उनकी रस्सी खोल देती है ताकि वे भाग सकें। दोनों भागते हैं — पर रास्ता भटक जाते हैं। तभी सामने एक **साँड़** आ जाता है।'),
    narrated('भाग ३ · साँड़ से युद्ध', [
      para([
        s('मोती ने मूक-भाषा में कहा– "बुरे फँसे। जान बचेगी? कोई उपाय सोचो।" हीरा ने चिंतित स्वर में कहा– "अपने घमंड में भूला हुआ है। आरज़ू-विनती न सुनेगा।"', [
          g('आरज़ू-विनती', 'गिड़गिड़ाना, प्रार्थना — pleading; entreaty', 'संज्ञा', 'कितनी ही आरज़ू-विनती की, पर उसने एक न सुनी।'),
        ]),
        s('"भाग क्यों न चलें?" "भागना कायरता है।"', [
          g('कायरता', 'डरपोकपन — cowardice', 'संज्ञा', 'मैदान छोड़कर भाग जाना कायरता है।'),
        ]),
        s('"उपाय यही है कि उस पर दोनों जने एक साथ चोट करें। मैं आगे से रगेदता हूँ, तुम पीछे से रगेदो, दोहरी मार पड़ेगी, तो भाग खड़ा होगा।"', [
          g('रगेदना', 'खदेड़ना, सींग से दौड़ाना — to drive/charge at', 'क्रिया', 'मोती ने साँड़ को बगल से रगेद दिया।'),
        ]),
      ]),
      para([
        s('साँड़ को संगठित शत्रुओं से लड़ने का तजुरबा न था। वह तो एक ही शत्रु से मल्लयुद्ध करने का आदी था।', [
          g('तजुरबा', 'अनुभव — experience', 'संज्ञा', 'नए खिलाड़ी को बड़े मैच का तजुरबा न था।'),
          g('मल्लयुद्ध', 'कुश्ती, बाहुयुद्ध — wrestling; combat', 'संज्ञा', 'दोनों पहलवान मल्लयुद्ध में जुट गए।'),
        ]),
        s('मोती ने अपनी सांकेतिक भाषा में कहा– "मेरा जी तो चाहता था कि बच्चा को मार ही डालूँ।" हीरा ने तिरस्कार किया– "गिरे हुए बैरी पर सींग न चलाना चाहिए।"', [
          g('तिरस्कार', 'धिक्कार, अनादर — rebuke; scorn', 'संज्ञा', 'झूठ बोलने पर सबने उसका तिरस्कार किया।'),
          g('बैरी', 'शत्रु, दुश्मन — an enemy', 'संज्ञा', 'गिरे हुए बैरी पर वार करना वीरता नहीं।'),
        ]),
      ], 'यहाँ हीरा एक ऊँचा मूल्य रखता है — गिरे हुए दुश्मन पर वार मत करो। यह कहानी का एक नैतिक केंद्र है: ताक़त से बड़ी चीज़ है मर्यादा।'),
    ]),
    img('दो बैल मिलकर एक साँड़ का सामना करते हुए', 'Watercolour — two white oxen fighting off a large bull together in a dark open field, one charging from the front and one from the side, dust and motion. Dark ground, dramatic warm rim light. Loose washes, paper grain. No text.'),
    reasoning(
      'साँड़ अकेला और ताक़तवर था, फिर भी हीरा-मोती जीत गए। प्रेमचंद इससे आज़ादी की लड़ाई के बारे में क्या संकेत दे रहे हैं?',
      'अकेला-अकेला कमज़ोर भी, जब "संगठित" होकर लड़ता है, तो बड़ी ताक़त को हरा देता है। साँड़ "एक ही शत्रु से लड़ने का आदी" था — यानी अकेली ताक़त। एकता और सहयोग ही गुलामी जैसी बड़ी ताक़त को हराने का रास्ता है — यही स्वतंत्रता-आंदोलन का सबक़ भी है।',
      4
    ),
    quiz([
      { q: 'बैलों को आज़ाद होने में किसने मदद की?', opts: ['भैरो की छोटी बेटी ने', 'मालिक गया ने ख़ुद', 'किसान झूरी ने', 'काँजीहौस के चौकीदार ने'], a: 0, why: 'अनाथ लड़की ने रात में उनकी रस्सी खोल दी ताकि वे भाग सकें।', lvl: 1 },
      { q: 'साँड़ क्यों हार गया?', opts: ['उसे संगठित शत्रुओं से लड़ने का तजुरबा न था', 'वह स्वभाव से बहुत कमज़ोर था', 'वह डरकर भाग खड़ा हुआ', 'बैल आकार में बहुत बड़े थे'], a: 0, why: 'साँड़ अकेले शत्रु से लड़ने का आदी था; दो बैलों की संगठित दोहरी मार उसके लिए नई थी।', lvl: 2 },
      { q: '"गिरे हुए बैरी पर सींग न चलाना चाहिए" — हीरा का यह कथन किस मूल्य को दिखाता है?', opts: ['युद्ध में भी मर्यादा', 'मैदान छोड़ने की कायरता', 'अपनी ताक़त का घमंड', 'और पाने का लालच'], a: 0, why: 'हीरा हारे हुए दुश्मन पर वार करना अनुचित मानता है — यह वीरता के साथ मर्यादा का मूल्य है।', lvl: 3 },
    ]),
  ],
});

// ═══ PAGE 4 — भाग ४–५: काँजीहौस · दीवार · नीलाम · घर वापसी ═══
reset();
PAGES.push({
  slug: 'kahani-bhag-4-5', title: 'कहानी — भाग ४–५', page_number: 4, tags: [],
  blocks: [
    hero('काँजीहौस की टूटती दीवार से भागते जानवर', 'Watercolour 16:5 banner — the mud wall of a colonial cattle-pound (kanjihaus) half-broken at night, frightened animals escaping through the gap into the dark, a strong ox lowering its horns against the wall. Dark ground, faint dawn light at the horizon. Loose washes, paper grain. No text.'),
    heading('भाग ४–५ — काँजीहौस, और सच्ची आज़ादी', 2),
    text('मटर के खेत में चरते समय मोती पकड़ा जाता है; हीरा साथ नहीं छोड़ता और ख़ुद भी पकड़ा जाता है। दोनों **काँजीहौस** (आवारा पशुओं की "जेल") में बंद कर दिए जाते हैं। यहीं कहानी अपने सबसे ऊँचे भाव तक पहुँचती है।'),
    narrated('भाग ४ · दीवार', [
      para([
        s('दोनों मित्रों को जीवन में पहली बार ऐसा साबिका पड़ा कि सारा दिन बीत गया और खाने को एक तिनका भी न मिला।', [
          g('साबिका', 'वास्ता, सरोकार — a dealing; an encounter', 'संज्ञा', 'जीवन में पहली बार उन्हें ऐसा साबिका पड़ा।'),
        ]),
        s('रात को भी जब कुछ भोजन न मिला, तो हीरा के दिल में विद्रोह की ज्वाला दहक उठी।', [
          g('दहक उठी', 'भड़क उठी, जल उठी (दहक) — blazed up', 'क्रिया', 'अन्याय देखकर उसके मन में गुस्सा दहक उठा।'),
        ]),
      ]),
      para([
        s('बाड़े की दीवार कच्ची थी। हीरा मज़बूत तो था ही, अपने नुकीले सींग दीवार में गड़ा दिए और ज़ोर मारा, तो मिट्टी का एक चिप्पड़ निकल आया। फिर तो उसका साहस बढ़ा।', [
          g('चिप्पड़', 'मिट्टी का टुकड़ा/पपड़ी — a clod/flake of earth', 'संज्ञा', 'हर चोट में दीवार से थोड़ी-थोड़ी मिट्टी गिरने लगी।'),
        ]),
        s('मोती ने पड़े-पड़े कहा– "आख़िर मार खाई, क्या मिला?" "जोर तो मारता ही जाऊँगा, चाहे कितने ही बंधन पड़ते जाएँ।" "जान से हाथ धोना पड़ेगा।" "कुछ परवाह नहीं। सोचो, दीवार खुद जाती तो कितनी जानें बच जातीं।"'),
      ], 'हीरा अपने लिए नहीं, बाक़ी बंद जानवरों के लिए दीवार तोड़ रहा है। मार खाकर भी वह रुकता नहीं — यह आज़ादी के लिए किया गया निःस्वार्थ संघर्ष है।'),
    ]),
    checkpoint('रुकिए और सोचिए —', [
      { q: 'हीरा दीवार क्यों तोड़ रहा था?', opts: ['सिर्फ़ अपने भागने के लिए', 'सबकी — नौ-दस बंद जानवरों की — जान बचाने के लिए', 'गुस्से में', 'खेल के लिए'], a: 1, why: 'हीरा कहता है "दीवार खुद जाती तो कितनी जानें बच जातीं" — उसका संघर्ष निःस्वार्थ है, सबके लिए है।' },
    ]),
    text('हीरा आधी दीवार गिरा देता है। बाक़ी जानवर भाग निकलते हैं, पर मोती हीरा को अकेला छोड़कर नहीं जाता। चौकीदार आकर हीरा को मोटी रस्सी से बाँध देता है। फिर एक हफ़्ते बाद दोनों **नीलाम** कर दिए जाते हैं — एक कठोर दढ़ियल ख़रीदार के हाथ।'),
    narrated('भाग ५ · घर की राह', [
      para([
        s('मोती गर्व से बोला– "जिस अपराध के लिए तुम्हारे गले में बंधन पड़ा, उसके लिए अगर मुझ पर मार पड़े, तो क्या चिंता? इतना तो हो ही गया कि नौ-दस प्राणियों की जान बच गई। वे सब तो आशीर्वाद देंगे।"', [
          g('अपराध', 'क़सूर, ग़लती — a crime; fault', 'संज्ञा', 'उसने ऐसा कौन-सा अपराध किया जो इतनी सज़ा मिली?'),
        ]),
        s('नीलाम हो जाने के बाद दोनों मित्र उस दढ़ियल के साथ चले।', [
          g('नीलाम', 'ऊँची बोली पर बेचना — an auction', 'संज्ञा', 'मृतक-से बैलों को नीलाम में कौन ख़रीदता?'),
          g('दढ़ियल', 'घनी दाढ़ी वाला (यहाँ — कठोर ख़रीदार) — a bearded man (here, the harsh buyer)', 'संज्ञा', 'दढ़ियल की आँखें लाल और मुद्रा कठोर थी।'),
        ]),
      ]),
      para([
        s('सहसा दोनों को ऐसा मालूम हुआ कि यह परिचित राह है। वही खेत, वही बाग़, वही गाँव मिलने लगे। प्रतिक्षण उनकी चाल तेज़ होने लगी। सारी थकान, सारी दुर्बलता ग़ायब हो गई।', [
          g('सहसा', 'अचानक — suddenly', 'क्रिया-विशेषण', 'सहसा बादल गरजने लगे।'),
          g('दुर्बलता', 'कमज़ोरी — weakness', 'संज्ञा', 'भूख से उनकी दुर्बलता बढ़ गई थी।'),
        ]),
        s('दोनों उन्मत्त होकर बछड़ों की भाँति कुलेलें करते हुए घर की ओर दौड़े।', [
          g('उन्मत्त', 'मतवाला, मस्त — wildly excited; frenzied', 'विशेषण', 'जीत की ख़ुशी में खिलाड़ी उन्मत्त हो उठे।'),
          g('कुलेलें', 'उछल-कूद, अठखेलियाँ — frolicking leaps', 'संज्ञा', 'बछड़े मैदान में कुलेलें करने लगे।'),
        ]),
      ], 'अपनी राह पहचानते ही उनकी सारी थकान उड़ जाती है। घर — यानी अपनापन और आज़ादी — की उम्मीद ही उनमें नई जान भर देती है।'),
    ]),
    img('झूरी के द्वार पर लौटे बैल, मालकिन माथा चूमती हुई', 'Watercolour — the two oxen back at झूरी’s doorway at sunset, झूरी embracing them, the mistress of the house kissing their foreheads, village boys watching joyfully. Dark warm ground, golden light. Loose washes, paper grain. No text.'),
    reasoning(
      'दढ़ियल कठोर ख़रीदार के सामने मोती कहता है — "मर जाऊँगा; पर उसके काम तो न आऊँगा।" यह एक बैल का कथन है, पर इसमें स्वतंत्रता-आंदोलन की कौन-सी भावना छिपी है?',
      '"मर जाऊँगा, पर ज़ालिम की सेवा/ग़ुलामी नहीं करूँगा" — यह असहयोग और सत्याग्रह की आत्मा है। बैल हथियार से नहीं, इनकार से लड़ता है: अन्यायी की मदद करने से साफ़ मना कर देना। यही भारतीय जनता का अंग्रेज़ी शासन के प्रति बढ़ता विद्रोह है।',
      4
    ),
    quiz([
      { q: 'काँजीहौस से छूटने के बाद दोनों मित्र किसके हाथ नीलाम हुए?', opts: ['एक कठोर दढ़ियल ख़रीदार के', 'अपने पुराने मालिक झूरी के', 'झूरी के साले गया के', 'रोटी देने वाली लड़की के पिता भैरो के'], a: 0, why: 'लाल आँखों और कठोर मुद्रा वाला दढ़ियल आदमी उन्हें नीलाम में ख़रीद ले जाता है।', lvl: 1 },
      { q: 'अपनी परिचित राह पहचानते ही बैलों में क्या बदलाव आया?', opts: ['थकान ग़ायब हुई, चाल तेज़ हो गई', 'वे और भी अधिक थक गए', 'वे डरकर रुक गए', 'वे बीमार पड़ गए'], a: 0, why: 'घर लौटने की उम्मीद ने उनमें नई ऊर्जा भर दी — सारी दुर्बलता ग़ायब हो गई।', lvl: 2 },
      { q: 'पूरी कहानी में बैलों का बार-बार लौटना और संघर्ष करना किसका प्रतीक है?', opts: ['आज़ादी के लिए लगातार संघर्ष', 'मालिक के प्रति गहरे डर', 'पेट की भूख', 'स्वभाव के आलस्य'], a: 0, why: 'बार-बार बिकना, बग़ावत और लौटना — आज़ादी सहज नहीं मिलती, उसके लिए निरंतर संघर्ष करना पड़ता है।', lvl: 3 },
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
        _id: pageId, book_id: String(book._id), chapter_number: CHAPTER_NO, page_number: p.page_number,
        slug: p.slug, title: p.title, blocks: p.blocks, hinglish_blocks: [], tags: p.tags || [],
        published: false, reading_time_min: 6, content_types: contentTypes(p.blocks),
        created_at: new Date(), updated_at: new Date(),
      });
      console.log(`  ✓ Created page ${p.page_number}: ${p.slug} (${p.blocks.length} blocks)`);
    }
    const chPages = await pages.find({ book_id: String(book._id), chapter_number: CHAPTER_NO }).project({ _id: 1, page_number: 1 }).toArray();
    chPages.sort((a, b) => a.page_number - b.page_number);
    const orderedIds = chPages.map(p => String(p._id));
    await books.updateOne({ _id: book._id, 'chapters.number': CHAPTER_NO }, { $set: { 'chapters.$.page_ids': orderedIds, updated_at: new Date() } });
    console.log(`✓ Wired ${orderedIds.length} page(s) into chapter ${CHAPTER_NO} (sorted by page_number).`);
  } finally { await client.close(); }
}
export { PAGES };
if (process.argv[1] && process.argv[1].endsWith('setup_class9_hindi_ch1_b.js')) {
  main().catch(err => { console.error(err); process.exit(1); });
}
