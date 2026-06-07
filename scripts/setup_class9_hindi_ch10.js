// Setup script: Class 9 Hindi गंगा — Chapter 10 (भारति, जय, विजयकरे! — निराला).
// Genre: काव्य (छायावाद, संस्कृतनिष्ठ, समासयुक्त). India personified as Goddess Bharati;
// nature as her ornaments. VERBATIM poem from ihga110.pdf (image-verified). Poetry mix:
// narrated_passage (stanza=para, glossed) + tone_meter + devices lang:hindi (मानवीकरण/अनुप्रास/रूपक).
// Grammar: समास (समस्त पद/विग्रह). Slugs ch10-. published:false.
// Rollback: db.book_pages.deleteMany({book_id:<id>,chapter_number:10}).

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-hindi-ganga';
const CHAPTER_NO = 10;

let _o = 0;
const reset = () => { _o = 0; };
const hero = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: prompt });
const img = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'three_quarter', aspect_ratio: '16:9', generation_prompt: prompt });
const heading = (t, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text: t, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const tableB = (caption, headers, rows) => ({ id: uuidv4(), type: 'table', order: _o++, caption, headers, rows });
const author = (fields) => ({ id: uuidv4(), type: 'meet_a_scientist', order: _o++, ...fields });
const curiosity = (prompt, hint) => ({ id: uuidv4(), type: 'curiosity_prompt', order: _o++, prompt, ...(hint ? { hint } : {}) });
const reasoning = (prompt, reveal, difficulty = 3) => ({ id: uuidv4(), type: 'reasoning_prompt', order: _o++, reasoning_type: 'logical', prompt, reveal, difficulty_level: difficulty });
const worked = (label, problem, solution) => ({ id: uuidv4(), type: 'worked_example', order: _o++, label, variant: 'ncert_intext', problem, solution, reveal_mode: 'tap_to_reveal' });
const contextCard = (reference, category, short_desc, detail, image_prompt) => ({ id: uuidv4(), type: 'cultural_context_card', order: _o++, reference, category, short_desc, detail, image_url: '', ...(image_prompt ? { image_prompt } : {}) });
const themeExplorer = (intro, themes) => ({ id: uuidv4(), type: 'theme_explorer', order: _o++, intro, themes: themes.map(([title, description, evidence, reflection_prompt]) => ({ id: uuidv4(), title, description, evidence, reflection_prompt })) });
const devices = (passage, devs) => ({ id: uuidv4(), type: 'literary_devices_highlighter', order: _o++, lang: 'hindi', passage, devices: devs.map(([device, matches]) => ({ id: uuidv4(), device, matches: matches.map(([t, ex]) => ({ text: t, explanation: ex })) })) });
const toneMeter = (segments) => ({ id: uuidv4(), type: 'tone_meter', order: _o++, segments: segments.map(([excerpt, emotion, intensity, note]) => ({ id: uuidv4(), excerpt, emotion, intensity, note })) });
const quiz = (questions) => ({ id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67, questions: questions.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why, ...(q.lvl ? { difficulty_level: q.lvl } : {}) })) });
const g = (word, meaning, pos, example) => ({ word, meaning, pos, example });
const sen = (t, glosses) => ({ id: uuidv4(), text: t, audio_url: '', ...(glosses ? { glosses } : {}) });
const para = (sentences, commentary) => ({ id: uuidv4(), sentences, ...(commentary ? { hinglish_commentary: commentary } : {}) });
const narrated = (source_label, paragraphs) => ({ id: uuidv4(), type: 'narrated_passage', order: _o++, source_label, paragraphs });
const checkpoint = (intro, qs) => ({ id: uuidv4(), type: 'comprehension_checkpoint', order: _o++, ...(intro ? { intro } : {}), questions: qs.map(q => ({ id: uuidv4(), question: q.q, ...(q.opts ? { options: q.opts, correct_index: q.a } : {}), explanation: q.why })) });
const vcard = ([word, pronunciation, pos, meaning, english, example, memory_hook]) => ({ id: uuidv4(), word, pronunciation, audio_url: '', pos, meaning, english, example, ...(memory_hook ? { memory_hook } : {}) });
const vocab = (intro, cards, self_check) => ({ id: uuidv4(), type: 'vocabulary_lab', order: _o++, mode: 'flashcards', lang: 'hindi', intro, cards: cards.map(vcard), ...(self_check ? { self_check: self_check.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why })) } : {}) });
const chapterPractice = (title, intro, questions) => ({ id: uuidv4(), type: 'chapter_practice', order: _o++, title, intro, chapter_number: CHAPTER_NO, session_size: 8, pass_threshold: 0.7, questions });
const applyExpress = (title, intro, variant, challenges) => ({ id: uuidv4(), type: 'apply_express', order: _o++, title, intro, chapter_number: CHAPTER_NO, variant, challenges });

const CARDS_A = [
  ['भारति', 'bhaa-ra-ti', 'संज्ञा', 'सरस्वती/भारतमाता (वाणी की देवी)', 'Goddess Bharati (Saraswati / Mother India)', '"भारति, जय, विजयकरे!"', 'सरस्वती/भारतमाता।'],
  ['कनक', 'ka-nak', 'संज्ञा', 'सोना', 'gold', '"कनक-शस्य..." सोने जैसी फसलें।', 'gold।'],
  ['शस्य', 'shas-ya', 'संज्ञा', 'फसल, अन्न, धान्य', 'crops; grain', 'कनक-शस्य = सोने जैसी फसलें।', 'crops।'],
  ['कमलधरे', 'ka-mal-dha-re', 'विशेषण', 'कमल धारण करने वाली', 'lotus-bearing', '"कनक-शस्य-कमलधरे!" (हे कमल धारण करने वाली)।', 'कमल + धरे।'],
  ['पदतल', 'pad-tal', 'संज्ञा', 'पैरों के नीचे, तलवा', 'beneath the feet; sole', '"लंका पदतल शतदल।" (लंका उसके चरणों का कमल)।', 'पद + तल।'],
  ['शतदल', 'shat-dal', 'संज्ञा', 'कमल (सौ पंखुड़ियों वाला)', 'the lotus', '"लंका पदतल शतदल।"', 'सौ दल वाला = कमल।'],
  ['गर्जितोर्मि', 'gar-ji-tor-mi', 'संज्ञा', 'गरजती लहरें', 'roaring waves', '"गर्जितोर्मि सागर-जल।"', 'गर्जित + ऊर्मि (लहर)।'],
  ['शुचि', 'shu-chi', 'विशेषण', 'पवित्र, शुद्ध, श्वेत', 'pure; sacred', '"धोता शुचि चरण युगल।" (पवित्र चरण)।', 'pure।'],
  ['युगल', 'yu-gal', 'संज्ञा', 'जोड़ा, युग्म', 'a pair', '"शुचि चरण युगल" — दोनों पवित्र चरण।', 'a pair।'],
  ['स्तव', 'stav', 'संज्ञा', 'स्तुति, प्रशंसा, स्तोत्र', 'praise; a hymn', '"स्तव कर बहु-अर्थ-भरे!"', 'a hymn।'],
  ['तरु', 'ta-ru', 'संज्ञा', 'वृक्ष, पेड़', 'a tree', '"तरु-तृण-वन-लता वसन।"', 'a tree।'],
  ['तृण', 'trin', 'संज्ञा', 'घास, तिनका', 'grass; a blade', 'तरु-तृण = पेड़ और घास।', 'grass।'],
  ['वसन', 'va-san', 'संज्ञा', 'वस्त्र, आवरण', 'a garment; robe', '"...लता वसन।" (वन-लता ही उसके वस्त्र)।', 'a garment।'],
  ['अंचल', 'an-chal', 'संज्ञा', 'आँचल, किनारा, प्रांत', 'the hem/border; a region', '"अंचल में खचित सुमन।" (आँचल में जड़े फूल)।', 'border/region।'],
  ['खचित', 'kha-chit', 'विशेषण', 'जड़ा हुआ, अंकित', 'studded; inlaid', '"अंचल में खचित सुमन।"', 'studded।'],
  ['सुमन', 'su-man', 'संज्ञा', 'फूल, पुष्प', 'a flower', 'आँचल में खचित (जड़े) सुमन (फूल)।', 'a flower।'],
  ['ज्योतिर्जल', 'jyo-tir-jal', 'संज्ञा', 'प्रकाश-भरा जल', 'light-filled water', '"गंगा ज्योतिर्जल-कण।"', 'ज्योति + जल।'],
  ['धवल', 'dha-val', 'विशेषण', 'श्वेत, उजला, निर्मल', 'white; bright', '"धवल धार हार गले।" (गंगा की श्वेत धारा गले का हार)।', 'white।'],
  ['मुकुट', 'mu-kut', 'संज्ञा', 'ताज', 'a crown', '"मुकुट शुभ्र हिम-तुषार।" (हिमालय की बर्फ़ उसका मुकुट)।', 'a crown।'],
  ['शुभ्र', 'shubhr', 'विशेषण', 'उज्ज्वल, श्वेत, चमकीला', 'bright; white', '"मुकुट शुभ्र हिम-तुषार।"', 'bright-white।'],
];
const CARDS_B = [
  ['हिम-तुषार', 'him-tu-shaar', 'संज्ञा', 'बर्फ़, हिम-कण, ओस', 'snow; frost', 'हिमालय की हिम-तुषार (बर्फ़) भारत का मुकुट है।', 'snow/frost।'],
  ['प्राण', 'praan', 'संज्ञा', 'साँस, जीवन, वायु', 'life-breath; life', '"प्राण प्रणव ओंकार।"', 'life-breath।'],
  ['प्रणव', 'pra-nav', 'संज्ञा', 'ओंकार, ओम्', 'the sacred Om', 'भारत के प्राण ओम् (प्रणव) की ध्वनि हैं।', 'the Om।'],
  ['ओंकार', 'on-kaar', 'संज्ञा', "'ओम्' मंत्र, आरंभ", 'the syllable Om', '"प्राण प्रणव ओंकार।"', 'the Om।'],
  ['उदार', 'u-daar', 'विशेषण', 'दानशील, दयालु, विशाल', 'generous; magnanimous', '"ध्वनित दिशाएँ उदार।" (उदार दिशाएँ गूँज रही हैं)।', 'generous।'],
  ['ध्वनित', 'dhva-nit', 'विशेषण', 'गूँजती हुई', 'resounding', 'दिशाएँ ओम् से ध्वनित (गूँजित) हैं।', '"ध्वनि" से।'],
  ['शतमुख', 'shat-mukh', 'संज्ञा', 'सौ मुख', 'a hundred mouths', '"शतमुख-शतरव-मुखरे!"', 'शत (सौ) + मुख।'],
  ['शतरव', 'shat-rav', 'संज्ञा', 'सौ ध्वनियाँ, शोर', 'a hundred sounds', 'शतमुख-शतरव = सौ मुखों की सौ ध्वनियाँ।', 'शत + रव (ध्वनि)।'],
  ['मुखर', 'mu-khar', 'विशेषण', 'बोलता/गूँजता हुआ, शब्द करता', 'sonorous; vocal', '"...शतरव-मुखरे!" (सौ ध्वनियों से मुखरित)।', 'vocal/loud।'],
  ['मानवीकरण', 'maan-vee-ka-ran', 'संज्ञा', 'निर्जीव को मनुष्य-सा दिखाना', 'personification', 'भारत को देवी (मनुष्य) रूप में दिखाना मानवीकरण है।', 'personification।'],
  ['छायावाद', 'chhaa-yaa-vaad', 'संज्ञा', 'हिंदी काव्य का एक युग (कल्पना-प्रकृति प्रधान)', 'the Chhayavad (Romantic) era', 'निराला छायावाद के प्रमुख कवि हैं।', 'Romantic era।'],
  ['मुक्त छंद', 'mukt-chhand', 'संज्ञा', 'बंधन-रहित छंद', 'free verse', 'निराला ने पहले मुक्त छंद का प्रयोग किया।', 'free verse।'],
  ['समस्त पद', 'sa-mast-pad', 'संज्ञा', 'समास से बना एक शब्द', 'a compound word', '"कनक-शस्य" एक समस्त पद है।', 'compound word।'],
  ['संस्कृतनिष्ठ', 'sans-krit-nishth', 'विशेषण', 'संस्कृत-प्रधान (भाषा)', 'Sanskrit-rich', 'यह कविता संस्कृतनिष्ठ भाषा में है।', 'Sanskrit-based।'],
  ['संपन्नता', 'sam-pan-na-taa', 'संज्ञा', 'समृद्धि, धन-धान्य', 'prosperity; abundance', '"कनक-शस्य" भारत की कृषि-संपन्नता दिखाता है।', 'prosperity।'],
];

const POEM = [
  ['भारति, जय, विजयकरे!', [g('विजयकरे', 'विजय देने वाली — bestower of victory', 'विशेषण', 'हे विजय देने वाली भारति, तुम्हारी जय हो!')]],
  ['कनक-शस्य-कमलधरे!', [g('कनक-शस्य-कमलधरे', 'सोने जैसी फसलें और कमल धारण करने वाली — bearer of golden crops and lotus', 'समस्त पद', 'भारत की कृषि-संपन्नता और सौंदर्य का प्रतीक।')]],
  ['लंका पदतल शतदल,', [g('लंका पदतल शतदल', 'लंका जिसके चरण-कमल (पदतल) के नीचे है — Lanka beneath her lotus-feet', 'पद', 'दक्षिण में लंका तक उसका विस्तार।')]],
  ['गर्जितोर्मि सागर-जल', [g('गर्जितोर्मि', 'गरजती लहरें — roaring waves', 'समस्त पद', 'गरजती लहरों वाला सागर-जल।')]],
  ['धोता शुचि चरण युगल', [g('धोता शुचि चरण युगल', 'सागर उसके पवित्र दोनों चरण धोता है — the sea washes her two sacred feet', 'पद', 'समुद्र चरण धोता है — मानवीकरण।')]],
  ['तरु-तृण-वन-लता वसन,', [g('तरु-तृण-वन-लता वसन', 'पेड़-घास-वन-लता ही उसके वस्त्र — trees, grass, forests are her garments', 'समस्त पद', 'प्रकृति ही भारत के वस्त्र।')]],
  ['अंचल में खचित सुमन;', [g('अंचल में खचित सुमन', 'आँचल में जड़े हुए फूल — flowers studded on her hem', 'पद', 'फूल उसके आँचल के आभूषण।')]],
  ['गंगा ज्योतिर्जल-कण', [g('गंगा ज्योतिर्जल-कण', 'गंगा के प्रकाशमय जल-कण — Ganga’s luminous water-drops', 'समस्त पद', 'गंगा की धवल धारा।')]],
  ['धवल धार हार गले।', [g('धवल धार हार गले', 'श्वेत धारा गले का हार — the white stream is a necklace at her throat', 'रूपक', 'गंगा उसके गले का हार।')]],
  ['मुकुट शुभ्र हिम-तुषार,', [g('मुकुट शुभ्र हिम-तुषार', 'श्वेत बर्फ़ (हिमालय) उसका मुकुट — the white Himalayan snow is her crown', 'रूपक', 'हिमालय भारत का मुकुट।')]],
  ['प्राण प्रणव ओंकार,', [g('प्राण प्रणव ओंकार', 'ओम् की ध्वनि उसके प्राण — the Om-sound is her life-breath', 'पद', 'भारत के प्राण ओंकार में।')]],
  ['ध्वनित दिशाएँ उदार,', [g('ध्वनित दिशाएँ उदार', 'उदार दिशाएँ (ओम् से) गूँज रही हैं — the generous directions resound', 'पद', 'सब दिशाएँ ओम् से गूँजती हैं।')]],
  ['शतमुख-शतरव-मुखरे!', [g('शतमुख-शतरव-मुखरे', 'सौ मुखों की सौ ध्वनियों से मुखरित — vocal with a hundred mouths and sounds', 'समस्त पद', 'भारत की विविधता — सौ स्वर एक साथ।')]],
];

const PAGES = [];

// ═══ PAGE 1 — परिचय ═══
reset();
PAGES.push({
  slug: 'ch10-parichay', title: 'परिचय — कवि से मिलिए', page_number: 1, tags: [],
  blocks: [
    hero('सूर्यकांत त्रिपाठी निराला', 'Watercolour bust-portrait of poet Suryakant Tripathi Nirala, a strong bearded face with intense eyes, warm lamplight on a dark neutral ground. Loose washes, soft bleeding edges, paper grain. No text.'),
    curiosity('अगर आपको अपने देश "भारत" को एक जीवित व्यक्ति — एक देवी या देवता — के रूप में कल्पना करनी हो, तो आप उसका मुकुट किसे बनाएँगे, हार किसे, और वस्त्र किसे? सोचिए — भारत की कौन-सी प्राकृतिक चीज़ें उसका "गहना" बन सकती हैं?', 'भारत के पहाड़, नदियाँ, जंगल, फूल — इन्हें "आभूषण" की तरह सोचिए।'),
    author({
      name: "सूर्यकांत त्रिपाठी 'निराला'", years: '1899–1961', nationality: 'भारतीय — गढ़ाकोला (उन्नाव), उत्तर प्रदेश', portrait_src: '', portrait_prompt: 'Watercolour portrait of poet Nirala, bearded, intense, dark ground.',
      contribution: '**छायावाद** के प्रमुख कवि — जिन्होंने हिंदी में सबसे पहले **मुक्त छंद (free verse)** का प्रयोग किया। प्रमुख काव्य — **अनामिका**, परिमल, गीतिका, कुकुरमुत्ता, नए पत्ते। उनकी रचनाओं में दार्शनिकता, विद्रोह, क्रांति, प्रेम और प्रकृति का विराट चित्र है।',
      connection: '"भारति, जय, विजयकरे!" में निराला भारत को एक देवी (भारतमाता/सरस्वती) के रूप में देखते हैं, जिसके आभूषण उसकी अपनी प्रकृति है — हिमालय मुकुट, गंगा हार, वन-लता वस्त्र।',
      fun_detail: 'उन्होंने औपचारिक शिक्षा केवल नौवीं तक पाई, पर स्वाध्याय (self-study) से संस्कृत, बांग्ला और अंग्रेज़ी का गहरा ज्ञान अर्जित किया। उपेक्षितों के प्रति उनकी गहरी सहानुभूति थी।',
      learn_more: 'काव्य-संग्रह "अनामिका" और कविता "वर दे, वीणावादिनि वर दे!"।',
    }),
    callout('india_voice', 'छायावाद और मुक्त छंद', '**छायावाद** हिंदी कविता का वह युग है जिसमें कल्पना, प्रकृति-सौंदर्य, सूक्ष्म भाव और रहस्य की प्रधानता रही। निराला ने **मुक्त छंद** चलाया — यानी ऐसी कविता जो तुक और मात्रा के कठोर बंधन से मुक्त हो। यह कविता **संस्कृतनिष्ठ और समासयुक्त** (compound-rich) भाषा में है — इसलिए शब्द गहरे और भव्य लगते हैं।'),
    text('इस कविता में भारत एक **चेतन सत्ता (देवी)** है। पढ़ने से पहले इसके संस्कृतनिष्ठ शब्द जान लें — फिर हर पंक्ति का भव्य चित्र आँखों के सामने खुल जाएगा।'),
    vocab('कविता के शब्द — हर कार्ड पलटिए।', [
      ['भारति', 'bhaa-ra-ti', 'संज्ञा', 'सरस्वती/भारतमाता', 'Goddess Bharati', 'भारति की जय हो!', 'सरस्वती/भारतमाता।'],
      ['कनक', 'ka-nak', 'संज्ञा', 'सोना', 'gold', 'कनक जैसी फसलें।', 'gold।'],
      ['शस्य', 'shas-ya', 'संज्ञा', 'फसल, अन्न', 'crops; grain', 'कनक-शस्य = सोने जैसी फसलें।', 'crops।'],
      ['शतदल', 'shat-dal', 'संज्ञा', 'कमल', 'the lotus', 'चरणों का शतदल (कमल)।', 'सौ दल = कमल।'],
      ['धवल', 'dha-val', 'विशेषण', 'श्वेत, उजला', 'white; bright', 'गंगा की धवल धारा।', 'white।'],
      ['शुभ्र', 'shubhr', 'विशेषण', 'उज्ज्वल, श्वेत', 'bright-white', 'मुकुट शुभ्र हिम।', 'bright।'],
      ['प्रणव', 'pra-nav', 'संज्ञा', 'ओम्, ओंकार', 'the sacred Om', 'प्राण प्रणव ओंकार।', 'the Om।'],
      ['शतमुख', 'shat-mukh', 'संज्ञा', 'सौ मुख', 'a hundred mouths', 'शतमुख-शतरव।', 'शत+मुख।'],
    ]),
    quiz([
      { q: 'निराला हिंदी कविता के किस युग के प्रमुख कवि हैं?', opts: ['छायावाद', 'भक्तिकाल', 'रीतिकाल', 'वीरगाथा काल'], a: 0, why: 'निराला छायावाद के प्रमुख कवि हैं।', lvl: 1 },
      { q: 'निराला ने हिंदी में सबसे पहले किसका प्रयोग किया?', opts: ['मुक्त छंद (free verse)', 'दोहा', 'चौपाई', 'सॉनेट'], a: 0, why: 'छायावादी कवियों में निराला ने सबसे पहले मुक्त छंद का प्रयोग किया।', lvl: 2 },
      { q: 'इस कविता में भारत को किस रूप में प्रस्तुत किया गया है?', opts: ['एक चेतन सत्ता (देवी) के रूप में', 'एक मानचित्र के रूप में', 'एक कारख़ाने के रूप में', 'एक बाज़ार के रूप में'], a: 0, why: 'भारत को एक देवी (भारतमाता/भारति) के रूप में देखा गया है, जिसके आभूषण उसकी प्रकृति है।', lvl: 1 },
    ]),
  ],
});

// ═══ PAGE 2 — कविता ═══
reset();
PAGES.push({
  slug: 'ch10-kavita', title: 'कविता — भारति, जय, विजयकरे!', page_number: 2, tags: [],
  blocks: [
    hero('प्रकृति की देवी भारत', 'Watercolour 16:5 banner — India personified as a serene goddess whose crown is the snowy Himalayas, necklace the white Ganga, robe the forests, while the sea washes her feet, golden crop-fields and lotuses around. Dark warm luminous ground. Loose washes, paper grain. No text.'),
    text('इस छोटी पर भव्य कविता में निराला भारत को देवी रूप में सजाते हैं — हर पंक्ति में एक प्राकृतिक आभूषण। हर पंक्ति पर टैप कर अर्थ खोलिए।'),
    narrated('भारति, जय, विजयकरे! · निराला', [
      para(POEM.slice(0, 2).map(([line, glosses]) => sen(line, glosses)),
        'आरंभ में ही कवि "भारति, जय, विजयकरे!" कहकर भारत की विजय की कामना करते हैं और उसे "कनक-शस्य-कमलधरे" — सोने जैसी फसलें और कमल धारण करने वाली — कहकर उसकी कृषि-संपन्नता और सौंदर्य की प्रशंसा करते हैं।'),
      para(POEM.slice(2, 6).map(([line, glosses]) => sen(line, glosses)),
        'देखो — दक्षिण में लंका तक भारत का विस्तार है, और गरजती लहरों वाला सागर उसके "पवित्र चरण" धोता है। यानी समुद्र भी देवी-रूपी भारत के चरण पखारता है — यह सुंदर मानवीकरण है।'),
      para(POEM.slice(6, 9).map(([line, glosses]) => sen(line, glosses)),
        'अब आभूषण: पेड़-घास-वन-लता उसके वस्त्र हैं, आँचल में फूल जड़े हैं, और गंगा की श्वेत (धवल) चमकती धारा उसके गले का हार है। प्रकृति ही भारत के गहने बन जाती है।'),
      para(POEM.slice(9).map(([line, glosses]) => sen(line, glosses)),
        'अंत में सबसे भव्य चित्र — हिमालय की श्वेत बर्फ़ उसका मुकुट है, ओम् की ध्वनि उसके प्राण, और सौ मुखों की सौ ध्वनियों से सब दिशाएँ गूँज रही हैं — यानी भारत की अनेकता, विविधता और ज्ञान-परंपरा का गुणगान।'),
    ]),
    heading('कविता की भाव-यात्रा', 2),
    toneMeter([
      ['भारति, जय, विजयकरे!', 'गौरव', 5, 'विजय की कामना के साथ देशगौरव का उद्घोष।'],
      ['कनक-शस्य-कमलधरे!', 'समृद्धि', 4, 'कृषि-संपन्नता और सौंदर्य की प्रशंसा।'],
      ['धोता शुचि चरण युगल', 'भव्यता', 4, 'सागर भी देवी के चरण पखारता है।'],
      ['धवल धार हार गले', 'सौंदर्य', 4, 'गंगा का हार — प्रकृति आभूषण बन गई।'],
      ['शतमुख-शतरव-मुखरे!', 'विविधता-उल्लास', 5, 'सौ स्वर — भारत की अनेकता का चरम गुणगान।'],
    ]),
    checkpoint('रुकिए और सोचिए —', [
      { q: 'कविता में हिमालय, गंगा और वन-लता को क्या बताया गया है?', opts: ['देवी-रूपी भारत के आभूषण/वस्त्र (मुकुट, हार, वसन)', 'दूर के पहाड़ और नदियाँ भर', 'युद्ध के हथियार', 'खेती के साधन'], a: 0, why: 'हिमालय = मुकुट, गंगा = हार, वन-लता = वस्त्र — भारत की प्रकृति उसके आभूषण बन जाती है।' },
    ]),
    quiz([
      { q: '"कनक-शस्य-कमलधरे" पंक्ति भारत की किस विशेषता की ओर संकेत करती है?', opts: ['कृषि (धन-धान्य) संपन्नता', 'सैन्य शक्ति', 'औद्योगिक विकास', 'खनिज पदार्थ'], a: 0, why: 'सोने जैसी फसलें (कनक-शस्य) भारत की कृषि-समृद्धि का प्रतीक हैं।', lvl: 2 },
      { q: '"मुकुट शुभ्र हिम-तुषार" में हिमालय को भारत का मुकुट क्यों कहा गया?', opts: ['वह सबसे ऊँचा है और भारत के "सिर" पर श्वेत ताज-सा सजा है', 'वह बहुत दूर है', 'वहाँ बर्फ़ गिरती है', 'वह बहुत ठंडा है'], a: 0, why: 'हिमालय भारत के उत्तर में सबसे ऊँचा है — श्वेत बर्फ़ से ढका, मानो भारत के सिर पर सजा भव्य मुकुट।', lvl: 3 },
      { q: '"शतमुख-शतरव-मुखरे" किस बात का प्रतीक है?', opts: ['भारत की विविधता — सौ स्वर/भाषाएँ/संस्कृतियाँ एक साथ', 'बहुत शोर', 'सौ नदियाँ', 'सौ पहाड़'], a: 0, why: 'सौ मुखों की सौ ध्वनियाँ — भारत की अनेकता में एकता और सांस्कृतिक विविधता का प्रतीक।', lvl: 3 },
    ]),
  ],
});

// ═══ PAGE 3 — शब्द-संपदा ═══
reset();
PAGES.push({
  slug: 'ch10-shabd-sampada', title: 'शब्द-संपदा', page_number: 3, tags: ['ganga_section:bhasha_se_samvad'],
  blocks: [
    hero('शब्दों का ख़ज़ाना', 'Watercolour 16:5 banner — an open Hindi book with Devanagari letters lifting off as glowing motes beside a lotus-and-mountain motif, dark ground, Madhubani accents. Loose washes, paper grain. No text.'),
    text('इस संस्कृतनिष्ठ कविता के कठिन शब्द यहाँ एक जगह हैं। हर कार्ड पलटिए — **सरल हिंदी अर्थ**, **English**, उदाहरण और ट्रिक। पसंद के शब्द Word Vault में सहेजिए।'),
    vocab('भाग १: कविता के मूल शब्द।', CARDS_A, [
      { q: '"शस्य" शब्द का अर्थ है —', opts: ['फसल, अन्न', 'सोने का गहना', 'समुद्र', 'पहाड़'], a: 0, why: 'शस्य = crops/grain, फसल-अन्न।' },
      { q: '"शतदल" किसे कहते हैं?', opts: ['कमल', 'सौ पहाड़', 'सौ नदियाँ', 'सौ फूलों का गुच्छा'], a: 0, why: 'शतदल (सौ पंखुड़ियों वाला) = कमल।' },
      { q: '"धवल" का अर्थ है —', opts: ['श्वेत, उजला', 'काला', 'लाल', 'हरा'], a: 0, why: 'धवल = white/bright, श्वेत।' },
    ]),
    vocab('भाग २: कविता और काव्य-कला से जुड़े शब्द।', CARDS_B),
    quiz([
      { q: '"प्रणव/ओंकार" किसे कहते हैं?', opts: ["'ओम्' मंत्र की ध्वनि", 'एक नदी', 'एक पहाड़', 'एक फूल'], a: 0, why: 'प्रणव/ओंकार = the sacred Om syllable।', lvl: 1 },
      { q: '"शतमुख-शतरव" का अर्थ है —', opts: ['सौ मुखों की सौ ध्वनियाँ', 'एक तेज़ आवाज़', 'गहरी चुप्पी', 'एक मीठा गीत'], a: 0, why: 'शत (सौ) मुख + शत रव (ध्वनि) — विविधता का प्रतीक।', lvl: 2 },
      { q: '"मानवीकरण" अलंकार किसे कहते हैं?', opts: ['निर्जीव/प्रकृति को मनुष्य-सा दिखाना', 'शब्द दोहराना', 'बढ़ा-चढ़ाकर कहना', 'समानता दिखाना'], a: 0, why: 'मानवीकरण = personification, जैसे "सागर चरण धोता है"।', lvl: 2 },
    ]),
  ],
});

// ═══ PAGE 4 — कविता का सौंदर्य ═══
reset();
PAGES.push({
  slug: 'ch10-kavita-saundarya', title: 'कविता का सौंदर्य', page_number: 4, tags: ['ganga_section:vidha_se_samvad'],
  blocks: [
    hero('काव्य का सौंदर्य', 'Watercolour 16:5 banner — Devanagari verse turning into images of a crown, a necklace and a robe made of mountains, river and forests, glowing on a dark ground. Loose washes, paper grain. No text.'),
    text('निराला की यह कविता **मानवीकरण** (प्रकृति को मनुष्य-सा दिखाना), **अलंकार** और **समासयुक्त संस्कृतनिष्ठ भाषा** से सजी है। नीचे किसी विशेषता पर टैप करें।'),
    devices(
      'धोता शुचि चरण युगल। मुकुट शुभ्र हिम-तुषार। धवल धार हार गले। शतमुख-शतरव-मुखरे।',
      [
        ['personification', [['धोता शुचि चरण युगल', 'सागर का देवी-रूपी भारत के "पवित्र चरण धोना" — निर्जीव सागर को मनुष्य-सा दिखाना, मानवीकरण।']]],
        ['metaphor', [['मुकुट शुभ्र हिम-तुषार', 'हिमालय की बर्फ़ को सीधे "मुकुट" कह देना (अभेद) — रूपक अलंकार।'], ['धवल धार हार गले', 'गंगा की धारा को सीधे "हार" कह देना — रूपक अलंकार।']]],
        ['alliteration', [['शतमुख-शतरव-मुखरे', '"श"/"म" वर्णों की बार-बार आवृत्ति — अनुप्रास अलंकार।']]],
      ]
    ),
    tableB('कविता की विशेषताएँ', ['विशेषता', 'उदाहरण'], [
      ['प्रकृति का मानवीकरण', 'सागर "चरण धोता है"; हिमालय "मुकुट"।'],
      ['आलंकारिक प्रयोग', 'रूपक — "धवल धार हार गले"।'],
      ['समस्त/सामासिक पद', 'कनक-शस्य, ज्योतिर्जल, शतमुख-शतरव।'],
      ['संस्कृतनिष्ठ भाषा', 'शुचि, शुभ्र, प्रणव, धवल, स्तव।'],
      ['चित्रात्मकता', 'भारतभूमि का मनोरम चित्र आँखों के सामने।'],
    ]),
    worked('कविता में "मानवीकरण" कैसे काम करता है?', 'कविता में बार-बार प्रकृति को मनुष्य-सा (देवी-सा) दिखाया गया है। यह "मानवीकरण" कविता में क्या जादू पैदा करता है? सोचिए, फिर उत्तर देखिए।', '**मानवीकरण** का अर्थ है — निर्जीव वस्तु या प्रकृति को मनुष्य की तरह भाव और क्रिया करते दिखाना।\n\nइस कविता में पूरा भारत एक **जीवित देवी** बन जाता है: सागर उसके चरण "धोता" है, हिमालय उसका "मुकुट", गंगा उसका "हार", वन-लता उसके "वस्त्र"। इससे भारत एक सूखा भौगोलिक नक़्शा नहीं रहता — वह एक **पूज्य, भव्य और जीवंत माँ/देवी** बन जाता है, जिससे पाठक के मन में गहरा प्रेम और सम्मान (देशभक्ति) जाग उठता है। यही मानवीकरण का जादू है।'),
    quiz([
      { q: '"धोता शुचि चरण युगल" (सागर चरण धोता है) में कौन-सा अलंकार है?', opts: ['मानवीकरण', 'अतिशयोक्ति', 'अनुप्रास', 'तुक'], a: 0, why: 'निर्जीव सागर को मनुष्य-सा (चरण धोते) दिखाना — मानवीकरण।', lvl: 1 },
      { q: '"मुकुट शुभ्र हिम-तुषार" में कौन-सा अलंकार है?', opts: ['रूपक (हिमालय = मुकुट)', 'उपमा', 'अनुप्रास', 'पुनरुक्ति'], a: 0, why: 'हिमालय की बर्फ़ को सीधे "मुकुट" कहना (अभेद) — रूपक अलंकार।', lvl: 2 },
      { q: 'मानवीकरण से भारत की छवि कैसी बन जाती है?', opts: ['एक जीवंत, पूज्य देवी/माँ की', 'एक सूखे नक़्शे की', 'एक कारख़ाने की', 'एक बाज़ार की'], a: 0, why: 'भारत एक भव्य, जीवंत देवी बन जाता है — जिससे प्रेम और सम्मान जागता है।', lvl: 3 },
    ]),
  ],
});

// ═══ PAGE 5 — विषयों से संवाद ═══
reset();
PAGES.push({
  slug: 'ch10-vishayon-se-samvad', title: 'विषयों से संवाद', page_number: 5, tags: ['ganga_section:vishayon_se_samvad'],
  blocks: [
    hero('एक भारत, श्रेष्ठ भारत', 'Watercolour 16:5 banner — a tapestry of Indian landscapes — Himalayas, Ganga, forests, fields — united under one warm dawn, suggesting unity in diversity. Dark warm ground. Loose washes, paper grain. No text.'),
    text('यह कविता देशप्रेम के साथ-साथ प्रकृति-संरक्षण और "एक भारत, श्रेष्ठ भारत" का संदेश भी देती है।'),
    contextCard('एक भारत, श्रेष्ठ भारत', 'concept', 'अनेकता में एकता — विविध भाषा, पर्व, संस्कृति वाला एक भारत।', 'कविता की पंक्ति **"शतमुख-शतरव-मुखरे"** (सौ मुखों की सौ ध्वनियाँ) भारत की **विविधता में एकता** को साकार करती है — अनेक भाषाएँ, पर्व, रीति-रिवाज और संस्कृतियाँ, पर सब मिलकर **एक भारत**। यही "एक भारत, श्रेष्ठ भारत" की भावना है — कि हमारी विविधता ही हमारी सबसे बड़ी ताक़त है, कमज़ोरी नहीं।'),
    themeExplorer('कविता के मुख्य भाव — हर कार्ड पर टैप कीजिए।', [
      ['देशप्रेम और राष्ट्रीयता', 'भारत को देवी मानकर उसकी जय और गौरव का उद्घोष।', ['"भारति, जय, विजयकरे!"', '"प्राण प्रणव ओंकार।"'], 'अपने देश के लिए गर्व का कोई एक कारण लिखिए — और उसे और बढ़ाने के लिए आप क्या करेंगे?'],
      ['प्रकृति ही भारत का सौंदर्य', 'हिमालय, गंगा, वन-लता — भारत की प्रकृति ही उसका असली आभूषण है।', ['"मुकुट शुभ्र हिम-तुषार।"', '"गंगा... धवल धार हार गले।"'], 'अगर प्रकृति भारत का "गहना" है, तो प्रदूषण/गंदगी क्या है? इसे रोकने के लिए आप क्या कर सकते हैं?'],
      ['विविधता में एकता', 'अनेक भाषा-संस्कृति, पर एक भारत — विविधता ही शक्ति है।', ['"शतमुख-शतरव-मुखरे!"'], 'अपनी कक्षा/मोहल्ले की "विविधता" (अलग भाषा, खान-पान, त्योहार) को आप एकता में कैसे बदल सकते हैं?'],
    ]),
    callout('literature_in_life', 'कविता और आपका जीवन', 'अगर हिमालय भारत का मुकुट और गंगा उसका हार है, तो उन्हें गंदा करना अपनी "माँ के गहने" तोड़ने जैसा है। पेड़ न काटना, नदी में कचरा न डालना — यही इस कविता की सच्ची देशभक्ति है।'),
    reasoning(
      'यह कविता स्वतंत्रता-पूर्व लिखी गई, जब भारत के "शक्ति-बोध" और गौरव को जगाना ज़रूरी था। आज, स्वतंत्र भारत में, बढ़ते प्रदूषण और जलवायु-परिवर्तन के बीच इस कविता का संदेश और भी क्यों ज़रूरी हो गया है?',
      'कविता भारत की प्रकृति (हिमालय, गंगा, वन) को उसका "आभूषण" और "शरीर" बताती है। आज वही आभूषण ख़तरे में हैं — हिमालय के ग्लेशियर पिघल रहे हैं, गंगा प्रदूषित है, वन घट रहे हैं। इसलिए कविता का संदेश अब दोगुना ज़रूरी है: देशभक्ति सिर्फ़ "जय" बोलना नहीं, बल्कि भारत की प्रकृति की रक्षा करना है। अगर हम उसके "मुकुट" और "हार" को बचा लें, तभी सच्चे अर्थ में "भारति, जय" सार्थक होगा — प्रकृति का संरक्षण ही आज की सबसे बड़ी देशभक्ति है।',
      5
    ),
    quiz([
      { q: 'इस कविता में कवि की मुख्यतः कौन-सी भावना अभिव्यक्त हुई है?', opts: ['देशप्रेम और राष्ट्रीयता', 'व्यापार का लालच', 'युद्ध का रोमांच', 'व्यक्तिगत दुख'], a: 0, why: 'भारत को देवी मानकर उसका गौरव-गान — गहरा देशप्रेम और राष्ट्रीयता।', lvl: 1 },
      { q: 'कविता के अनुसार भारत का असली सौंदर्य/आभूषण क्या है?', opts: ['उसकी प्रकृति (हिमालय, गंगा, वन)', 'उसके कारख़ाने', 'उसका धन', 'उसके बाज़ार'], a: 0, why: 'हिमालय मुकुट, गंगा हार, वन-लता वस्त्र — प्रकृति ही भारत का आभूषण है।', lvl: 2 },
      { q: 'आज इस कविता का संदेश और ज़रूरी क्यों है?', opts: ['क्योंकि भारत के प्राकृतिक "आभूषण" (हिमालय/गंगा/वन) ख़तरे में हैं', 'क्योंकि कविता पुरानी है', 'क्योंकि भाषा कठिन है', 'क्योंकि भारत बड़ा है'], a: 0, why: 'प्रदूषण-जलवायु से वही प्रकृति ख़तरे में है — इसलिए उसकी रक्षा ही आज की देशभक्ति है।', lvl: 3 },
    ]),
  ],
});

// ═══ PAGE 6 — व्याकरण (समास) ═══
reset();
PAGES.push({
  slug: 'ch10-vyakaran', title: 'व्याकरण — समास', page_number: 6, tags: ['ganga_section:bhasha_se_samvad'],
  blocks: [
    hero('समास — शब्दों का मेल', 'Watercolour 16:5 banner — two words merging into one glowing compound word, with verse motifs, on a dark ground with folk accents. Loose washes, paper grain. No text.'),
    text('यह कविता **समास** (दो शब्दों के मेल से बने शब्द) से भरी है — कनक-शस्य, ज्योतिर्जल, शतमुख। समास खोलने को **समास-विग्रह** कहते हैं। नीचे अभ्यास कीजिए।'),
    tableB('कविता के समस्त पद और उनका विग्रह', ['समस्त पद', 'समास-विग्रह'], [
      ['कनक-शस्य', 'कनक (सोने) जैसी शस्य (फसल)'],
      ['कमलधरे', 'कमल को धारण करने वाली'],
      ['शतदल', 'सौ दल (पंखुड़ियों) वाला — कमल'],
      ['ज्योतिर्जल', 'ज्योति (प्रकाश) से युक्त जल'],
      ['सागरजल', 'सागर का जल'],
      ['शतमुख', 'सौ मुख'],
    ]),
    applyExpress('व्याकरण व्यायामशाला — समास', 'समास-विग्रह और पहचान का अभ्यास कीजिए।', 'grammar', [
      { id: 'h10-gr-01', kind: 'transform', concept_tag: 'grammar', difficulty: 3, source: 'सागरजल', instruction: 'इस समस्त पद का समास-विग्रह कीजिए।', answers: ['सागर का जल'], rule: 'तत्पुरुष — सागर का जल।' },
      { id: 'h10-gr-02', kind: 'transform', concept_tag: 'grammar', difficulty: 3, source: 'शतदल', instruction: 'इस समस्त पद का समास-विग्रह कीजिए (अर्थ — कमल)।', answers: ['सौ दल वाला', 'सौ दलों वाला'], rule: 'सौ दल (पंखुड़ियों) वाला = कमल।' },
      { id: 'h10-gr-03', kind: 'form_select', concept_tag: 'grammar', difficulty: 3, prompt: '"शतमुख" (सौ मुख) में पूर्वपद "शत" किस प्रकार का है?', options: ['संख्यावाची (द्विगु समास)', 'विशेषण (कर्मधारय)', 'क्रिया', 'अव्यय'], correct_index: 0, option_reasons: ['सही — "शत" (सौ) संख्यावाची है — द्विगु समास।', 'ग़लत।', 'ग़लत।', 'ग़लत।'] },
      { id: 'h10-gr-04', kind: 'transform', concept_tag: 'grammar', difficulty: 3, source: 'ज्योतिर्जल', instruction: 'इस समस्त पद का विग्रह कीजिए।', answers: ['ज्योति से युक्त जल', 'ज्योति वाला जल'], rule: 'ज्योति (प्रकाश) से युक्त जल।' },
      { id: 'h10-gr-05', kind: 'sentence_compose', concept_tag: 'vocab_in_context', difficulty: 3, word: 'मानवीकरण', instruction: '"मानवीकरण" शब्द से अपना एक वाक्य लिखिए।', rubric: ['शब्द का प्रयोग किया', 'अर्थ सही (प्रकृति को मनुष्य-सा दिखाना)', 'वाक्य पूरा है'], model_answer: 'कविता में "हवा गुनगुनाती है" कहना मानवीकरण का एक सुंदर उदाहरण है।', min_words: 7 },
      { id: 'h10-gr-06', kind: 'sentence_compose', concept_tag: 'interpretation', difficulty: 4, word: 'प्रकृति-संरक्षण', instruction: '"प्रकृति की रक्षा ही सच्ची देशभक्ति है" — इस विचार पर अपना एक वाक्य लिखिए।', rubric: ['विचार स्पष्ट है', 'अपनी बात जोड़ी', 'वाक्य पूरा है'], model_answer: 'पेड़ बचाना और नदियों को साफ़ रखना भी उतनी ही बड़ी देशभक्ति है जितनी सीमा पर देश की रक्षा करना।', min_words: 9 },
    ]),
    heading('भाषा संगम — "शस्य/उपज" अनेक भारतीय भाषाओं में', 2),
    tableB('"उपज (शस्य/फसल)" — भारतीय भाषाओं में', ['भाषा', 'शब्द'], [
      ['हिंदी', 'उपज/पैदावार'], ['संस्कृत', 'शस्यम्'], ['पंजाबी', 'पैदावार'], ['उर्दू', 'पैदावार'], ['मराठी', 'पीक'], ['गुजराती', 'ઊપજ (ऊपज)'], ['बांग्ला', 'ফসল (फसल)'], ['नेपाली', 'फसल'], ['ओडिआ', 'ଫସଲ (फसल)'], ['तेलुगु', 'పంట (पंट)'], ['तमिल', 'விளைச்சல் (विळैच्चल)'], ['कन्नड़', 'ಬೆಳೆ (बेळे)'],
    ]),
    quiz([
      { q: '"सागरजल" का समास-विग्रह क्या होगा?', opts: ['सागर का जल', 'सागर और जल', 'सागर जैसा जल', 'सागर में जल'], a: 0, why: 'सागरजल = सागर का जल (तत्पुरुष समास)।', lvl: 1 },
      { q: '"शतमुख" में "शत" (सौ) किस प्रकार का पद है?', opts: ['संख्यावाची (द्विगु)', 'विशेषण (कर्मधारय)', 'क्रिया', 'अव्यय'], a: 0, why: '"शत" (सौ) संख्यावाची है — यह द्विगु समास का उदाहरण है।', lvl: 2 },
      { q: '"ज्योतिर्जल" का विग्रह है —', opts: ['ज्योति से युक्त जल', 'ज्योति और जल', 'ज्योति में जल', 'जल जैसी ज्योति'], a: 0, why: 'ज्योतिर्जल = ज्योति (प्रकाश) से युक्त जल।', lvl: 2 },
    ]),
  ],
});

// ═══ PAGE 7 — अभ्यास ═══
reset();
const PR10 = [
  { id: 'h10-pr-01', q: 'इस कविता के रचयिता कौन हैं?', opts: ["सूर्यकांत त्रिपाठी 'निराला'", 'गोस्वामी तुलसीदास जी', 'भक्त-संत रैदास', 'सुभद्रा कुमारी चौहान'], a: 0, t: 'comprehension', d: 1, e: "कविता 'भारति, जय, विजयकरे!' निराला की है।" },
  { id: 'h10-pr-02', q: 'निराला किस काव्य-युग के प्रमुख कवि हैं?', opts: ['छायावाद', 'भक्तिकाल', 'रीतिकाल', 'आदिकाल'], a: 0, t: 'comprehension', d: 1, e: 'निराला छायावाद के प्रमुख कवि हैं।' },
  { id: 'h10-pr-03', q: 'इस कविता में भारत को किस रूप में देखा गया है?', opts: ['एक देवी (चेतन सत्ता) के रूप में', 'केवल एक भौगोलिक मानचित्र के रूप में', 'एक बड़े कारख़ाने के रूप में', 'एक बाज़ार के रूप में'], a: 0, t: 'comprehension', d: 2, e: 'भारत को देवी (भारतमाता/भारति) के रूप में, जिसके आभूषण प्रकृति है।' },
  { id: 'h10-pr-04', q: 'कविता में हिमालय को भारत का क्या बताया गया है?', opts: ['मुकुट (ताज)', 'गले में पहना हुआ हार', 'तन पर लिपटे वस्त्र', 'चरण'], a: 0, t: 'comprehension', d: 2, e: '"मुकुट शुभ्र हिम-तुषार" — हिमालय भारत का श्वेत मुकुट।' },
  { id: 'h10-pr-05', q: 'कविता में गंगा को भारत का क्या बताया गया है?', opts: ['गले का धवल (श्वेत) हार', 'सिर पर सजा हुआ मुकुट', 'पैरों के नीचे का तलवा', 'हाथ का कंगन'], a: 0, t: 'comprehension', d: 2, e: '"गंगा... धवल धार हार गले" — गंगा भारत के गले का हार।' },
  { id: 'h10-pr-06', q: '"शस्य" शब्द का अर्थ है —', opts: ['फसल, अन्न', 'सोने का गहना', 'गहरा समुद्र', 'ऊँचा पहाड़'], a: 0, t: 'vocab_in_context', d: 2, e: 'शस्य = crops/grain।' },
  { id: 'h10-pr-07', q: '"शतदल" किसे कहते हैं?', opts: ['कमल', 'सौ ऊँचे पहाड़', 'सौ बहती नदियाँ', 'सौ फूलों का गुच्छा'], a: 0, t: 'vocab_in_context', d: 2, e: 'शतदल (सौ पंखुड़ियों वाला) = कमल।' },
  { id: 'h10-pr-08', q: '"धवल" का सबसे सही अर्थ है —', opts: ['श्वेत, उजला', 'गहरा काला रंग', 'चमकीला लाल रंग', 'हरा-भरा'], a: 0, t: 'vocab_in_context', d: 2, e: 'धवल = white/bright।' },
  { id: 'h10-pr-09', q: '"प्रणव/ओंकार" से क्या तात्पर्य है?', opts: ["'ओम्' मंत्र की पवित्र ध्वनि", 'कोई एक पवित्र बहती नदी', 'कोई एक ऊँचा पर्वत', 'एक सुंदर फूल'], a: 0, t: 'vocab_in_context', d: 3, e: 'प्रणव/ओंकार = the sacred Om।' },
  { id: 'h10-pr-10', q: '"धोता शुचि चरण युगल" (सागर चरण धोता है) में कौन-सा अलंकार है?', opts: ['मानवीकरण', 'अतिशयोक्ति', 'अनुप्रास', 'तुक'], a: 0, t: 'grammar', d: 3, e: 'निर्जीव सागर को मनुष्य-सा दिखाना — मानवीकरण।' },
  { id: 'h10-pr-11', q: '"मुकुट शुभ्र हिम-तुषार" (हिमालय = मुकुट) में कौन-सा अलंकार है?', opts: ['रूपक', 'उपमा', 'अनुप्रास', 'पुनरुक्ति'], a: 0, t: 'grammar', d: 3, e: 'हिमालय को सीधे "मुकुट" कहना (अभेद) — रूपक।' },
  { id: 'h10-pr-12', q: '"शतमुख-शतरव-मुखरे" में कौन-सा अलंकार है?', opts: ['अनुप्रास', 'उपमा', 'रूपक', 'अतिशयोक्ति'], a: 0, t: 'grammar', d: 3, e: '"श"/"म" वर्णों की आवृत्ति — अनुप्रास।' },
  { id: 'h10-pr-13', q: '"सागरजल" का समास-विग्रह क्या है?', opts: ['सागर का जल', 'सागर और जल', 'सागर जैसा जल', 'सागर में जल'], a: 0, t: 'grammar', d: 3, e: 'सागरजल = सागर का जल (तत्पुरुष)।' },
  { id: 'h10-pr-14', q: '"शतमुख" में "शत" किस प्रकार का पद है?', opts: ['संख्यावाची (द्विगु समास)', 'गुण बताने वाला विशेषण', 'कोई क्रिया', 'अव्यय'], a: 0, t: 'grammar', d: 4, e: '"शत" (सौ) संख्यावाची — द्विगु समास।' },
  { id: 'h10-pr-15', q: '"कनक-शस्य-कमलधरे" पंक्ति भारत की किस विशेषता की ओर संकेत करती है?', opts: ['कृषि (धन-धान्य) संपन्नता', 'भारत की विशाल सैन्य शक्ति', 'भारत का औद्योगिक विकास', 'खनिज भंडार'], a: 0, t: 'interpretation', d: 3, e: 'सोने जैसी फसलें — भारत की कृषि-समृद्धि।' },
  { id: 'h10-pr-16', q: '"मुकुट शुभ्र हिम-तुषार" में हिमालय को मुकुट क्यों कहा गया?', opts: ['वह सबसे ऊँचा, भारत के सिर पर श्वेत ताज-सा है', 'वह भारत से बहुत दूर स्थित है', 'क्योंकि वहाँ बर्फ़ गिरती है', 'वह बहुत ठंडा है'], a: 0, t: 'interpretation', d: 3, e: 'हिमालय भारत के उत्तर में सबसे ऊँचा — श्वेत बर्फ़ से ढका भव्य मुकुट।' },
  { id: 'h10-pr-17', q: '"शतमुख-शतरव-मुखरे" किस संकल्पना को साकार करता है?', opts: ['एक भारत — विविधता में एकता', 'बहुत ज़्यादा कानफोड़ू शोर', 'सौ अलग-अलग बहती नदियाँ', 'सौ ऊँचे पहाड़'], a: 0, t: 'interpretation', d: 4, e: 'सौ स्वर/भाषाएँ/संस्कृतियाँ, पर एक भारत — विविधता में एकता।' },
  { id: 'h10-pr-18', q: 'भारत के वस्त्रों में वन-लता और गले में गंगा-धारा चित्रित कर कवि किस चेतना का संदेश देते हैं?', opts: ['राष्ट्रीयता और देशप्रेम', 'व्यापार और लाभ की होड़', 'युद्ध और हिंसा का रोमांच', 'धन का लालच'], a: 0, t: 'interpretation', d: 4, e: 'प्रकृति को भारत का आभूषण बताकर कवि गहरी राष्ट्रीयता/देशप्रेम जगाते हैं।' },
  { id: 'h10-pr-19', q: 'मानवीकरण के प्रयोग से भारत की छवि कैसी बन जाती है?', opts: ['एक जीवंत, पूज्य देवी/माँ की', 'केवल एक सूखे भौगोलिक नक़्शे की', 'एक टूटे-फूटे खंडहर की', 'एक मशीन की'], a: 0, t: 'inference', d: 5, e: 'प्रकृति-आभूषणों से सजी देवी — जिससे प्रेम और सम्मान जागता है।' },
  { id: 'h10-pr-20', q: 'कविता की भाषा-शैली किस विशेषता से संपन्न है?', opts: ['संस्कृतनिष्ठ और समासयुक्त', 'सरल बोल-चाल की रोज़मर्रा भाषा', 'हास्य-व्यंग्य से भरी भाषा', 'संवादात्मक'], a: 0, t: 'inference', d: 5, e: 'गहरे संस्कृत शब्द और समस्त पद — संस्कृतनिष्ठ, समासयुक्त भाषा।' },
].map(x => ({ id: x.id, question: x.q, options: x.opts, correct_index: x.a, explanation: x.e, concept_tag: x.t, difficulty: x.d }));

PAGES.push({
  slug: 'ch10-abhyas', title: 'अभ्यास — Practice', page_number: 7, tags: ['ganga_section:rachna_se_samvad'],
  blocks: [
    hero('अभ्यास', 'Watercolour 16:5 banner — a warm study nook with an open Hindi poetry book, a quill and lamp, a faint mountain-and-river motif. Dark ground, folk accents. Loose washes, paper grain. No text.'),
    text('अब अभ्यास का समय। पहले बहुविकल्पी प्रश्न (हर प्रश्न के साथ **कारण**) हल कीजिए, फिर रचनात्मक चुनौतियाँ।'),
    chapterPractice('अध्याय 10 — अभ्यास प्रश्न', 'सही उत्तर चुनिए और कारण समझिए।', PR10),
    applyExpress('रचना से संवाद — अपना उत्तर रचिए', 'पढ़ने के बाद अब रचना कीजिए।', 'apply', [
      { id: 'h10-ap-01', kind: 'unscramble', concept_tag: 'comprehension', difficulty: 3, tokens: ['भारति', 'जय', 'विजयकरे', 'कनक', 'शस्य', 'कमलधरे'], answer: 'भारति जय विजयकरे कनक शस्य कमलधरे' },
      { id: 'h10-ap-02', kind: 'sentence_compose', concept_tag: 'vocab_in_context', difficulty: 3, word: 'राष्ट्रीयता', instruction: '"राष्ट्रीयता" शब्द से अपना एक वाक्य लिखिए।', rubric: ['शब्द का प्रयोग किया', 'अर्थ सही (देशभक्ति)', 'वाक्य पूरा है'], model_answer: 'सच्ची राष्ट्रीयता अपने देश की प्रकृति और संस्कृति दोनों की रक्षा करने में है।', min_words: 7 },
      { id: 'h10-ap-03', kind: 'sentence_compose', concept_tag: 'interpretation', difficulty: 4, word: 'भारत का सौंदर्य', instruction: 'अपने राज्य/क्षेत्र की किसी एक प्राकृतिक सुंदरता को "भारत का आभूषण" बताते हुए एक वाक्य लिखिए।', rubric: ['विचार स्पष्ट है', 'अपने क्षेत्र की बात', 'वाक्य पूरा है'], model_answer: 'जैसे निराला हिमालय को मुकुट कहते हैं, वैसे ही मेरे क्षेत्र के हरे-भरे खेत भी भारत-माता के सुनहरे आँचल का एक सुंदर हिस्सा हैं।', min_words: 10 },
    ]),
    callout('threads_of_curiosity', 'झरोखे से + खोजबीन', 'और पढ़िए-सुनिए:\n\n- **झरोखे से:** मैथिलीशरण गुप्त की कविता *"जय जय भारतमाता"* — भारत का एक और मनोरम गुणगान।\n- **खोजबीन:** निराला की संस्कृतनिष्ठ कविता *"वर दे, वीणावादिनि वर दे!"* खोजकर पढ़िए।\n- अन्य देशप्रेम की कविताएँ खोजकर कक्षा में सुनाइए।'),
  ],
});

// ─── Insert ───
function contentTypes(blocks) { return [...new Set(blocks.map(b => b.type))]; }
async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found.`);
    console.log(`✓ Found book: ${book.title} (${book._id})`);
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: String(book._id), slug: p.slug });
      if (existing) { console.log(`  ⤷ Page "${p.slug}" already exists — skipping.`); continue; }
      const pageId = uuidv4();
      await pages.insertOne({
        _id: pageId, book_id: String(book._id), chapter_number: CHAPTER_NO, page_number: p.page_number,
        slug: p.slug, title: p.title, blocks: p.blocks, hinglish_blocks: [], tags: p.tags || [],
        published: false, reading_time_min: 5, content_types: contentTypes(p.blocks),
        created_at: new Date(), updated_at: new Date(),
      });
      console.log(`  ✓ Created page ${p.page_number}: ${p.slug} (${p.blocks.length} blocks)`);
    }
    const chPages = await pages.find({ book_id: String(book._id), chapter_number: CHAPTER_NO }).project({ _id: 1, page_number: 1 }).toArray();
    chPages.sort((a, b) => a.page_number - b.page_number);
    const orderedIds = chPages.map(p => String(p._id));
    await books.updateOne({ _id: book._id, 'chapters.number': CHAPTER_NO }, { $set: { 'chapters.$.page_ids': orderedIds, updated_at: new Date() } });
    console.log(`✓ Wired ${orderedIds.length} page(s) into chapter ${CHAPTER_NO}.`);
  } finally { await client.close(); }
}
export { PAGES };
if (process.argv[1] && process.argv[1].endsWith('setup_class9_hindi_ch10.js')) {
  main().catch(err => { console.error(err); process.exit(1); });
}
