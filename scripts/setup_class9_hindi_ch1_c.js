// Setup script: Class 9 Hindi गंगा — Chapter 1, ANALYSIS + PRACTICE pages 6–11.
// Page 6 मुहावरे · 7 पात्र-भाव · 8 कहानी का सौंदर्य · 9 विषयों से संवाद ·
// 10 सृजन व गतिविधियाँ · 11 अभ्यास (practice).
// Applies Kaveri quality lessons: every gloss/card has example; practice MCQs are
// concept-tagged + difficulty-spread + length-bias-checked; Grammar Gym apply_express
// kinds (transform/spot_error/form_select) for व्याकरण; lang:'hindi' on vocab + devices.
//
// Idempotent; re-wires chapter-1 page_ids by page_number. published:false.
// DB IMPACT: inserts up to 6 docs in `book_pages` + updates chapter-1 page_ids.
// Rollback: db.book_pages.deleteMany({book_id:<id>,chapter_number:1,page_number:{$in:[6,7,8,9,10,11]}}).

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'class9-hindi-ganga';
const CHAPTER_NO = 1;

// ─── helpers ───
let _o = 0;
const reset = () => { _o = 0; };
const hero = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: prompt });
const heading = (t, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text: t, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const table = (caption, headers, rows) => ({ id: uuidv4(), type: 'table', order: _o++, caption, headers, rows });
const reasoning = (prompt, reveal, difficulty = 3) => ({ id: uuidv4(), type: 'reasoning_prompt', order: _o++, reasoning_type: 'logical', prompt, reveal, difficulty_level: difficulty });
const quiz = (questions) => ({ id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold: 0.67, questions: questions.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why, ...(q.lvl ? { difficulty_level: q.lvl } : {}) })) });
const vcard = ([word, pronunciation, pos, meaning, english, example, memory_hook]) => ({ id: uuidv4(), word, pronunciation, audio_url: '', pos, meaning, english, example, ...(memory_hook ? { memory_hook } : {}) });
const vocab = (mode, intro, cards, self_check) => ({ id: uuidv4(), type: 'vocabulary_lab', order: _o++, mode, lang: 'hindi', intro, cards: cards.map(vcard), ...(self_check ? { self_check: self_check.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why })) } : {}) });
// idiom card: [idiom, meaning(सरल हिंदी — English), example]
const icard = ([word, meaning, example]) => ({ id: uuidv4(), word, pronunciation: '', audio_url: '', pos: 'मुहावरा', meaning, example });
const idioms = (intro, cards, self_check) => ({ id: uuidv4(), type: 'vocabulary_lab', order: _o++, mode: 'idioms', lang: 'hindi', intro, cards: cards.map(icard), ...(self_check ? { self_check: self_check.map(q => ({ id: uuidv4(), question: q.q, options: q.opts, correct_index: q.a, explanation: q.why })) } : {}) });
const characterMap = (title, characters, relationships) => ({ id: uuidv4(), type: 'character_map', order: _o++, title, characters, relationships });
const toneMeter = (segments) => ({ id: uuidv4(), type: 'tone_meter', order: _o++, segments: segments.map(([excerpt, emotion, intensity, note]) => ({ id: uuidv4(), excerpt, emotion, intensity, note })) });
const comparison = (title, columns) => ({ id: uuidv4(), type: 'comparison_card', order: _o++, title, columns });
const devices = (passage, devs) => ({ id: uuidv4(), type: 'literary_devices_highlighter', order: _o++, lang: 'hindi', passage, devices: devs.map(([device, matches]) => ({ id: uuidv4(), device, matches: matches.map(([t, ex]) => ({ text: t, explanation: ex })) })) });
const worked = (label, problem, solution) => ({ id: uuidv4(), type: 'worked_example', order: _o++, label, variant: 'ncert_intext', problem, solution, reveal_mode: 'tap_to_reveal' });
const contextCard = (reference, category, short_desc, detail, image_prompt) => ({ id: uuidv4(), type: 'cultural_context_card', order: _o++, reference, category, short_desc, detail, image_url: '', ...(image_prompt ? { image_prompt } : {}) });
const themeExplorer = (intro, themes) => ({ id: uuidv4(), type: 'theme_explorer', order: _o++, intro, themes: themes.map(([title, description, evidence, reflection_prompt]) => ({ id: uuidv4(), title, description, evidence, reflection_prompt })) });
const writing = (task, format, parts, tips) => ({ id: uuidv4(), type: 'writing_scaffold', order: _o++, task, format, model_parts: parts.map(([label, t, annotation]) => ({ id: uuidv4(), label, text: t, annotation })), ...(tips ? { tips } : {}) });
const debate = (scene, frames) => ({ id: uuidv4(), type: 'dialogue_role_play', order: _o++, mode: 'debate', scene_description: scene, characters: [{ id: 'paksh', name: 'पक्ष', color: 'emerald' }, { id: 'vipaksh', name: 'विपक्ष', color: 'rust' }], lines: [], debate_frames: frames });
const chapterPractice = (title, intro, questions) => ({ id: uuidv4(), type: 'chapter_practice', order: _o++, title, intro, chapter_number: CHAPTER_NO, session_size: 8, pass_threshold: 0.7, questions });
const applyExpress = (title, intro, variant, challenges) => ({ id: uuidv4(), type: 'apply_express', order: _o++, title, intro, chapter_number: CHAPTER_NO, variant, challenges });

const PAGES = [];

// ═══ PAGE 6 — मुहावरे ═══
reset();
PAGES.push({
  slug: 'muhavare', title: 'भाषा गढ़ते मुहावरे', page_number: 6, tags: ['ganga_section:bhasha_se_samvad'],
  blocks: [
    hero('मुहावरों की दुनिया', 'Watercolour 16:5 banner — playful folk-art collage of Hindi idioms coming alive: a hand washing off (जान से हाथ धोना), sweating teeth, a brick meeting a stone, glowing on a dark ground with Madhubani line accents. Loose washes, paper grain. No text.'),
    text('मुहावरे ही भाषा को जीवंत बनाते हैं। "दो बैलों की कथा" मुहावरों से भरी है। हर कार्ड पलटिए — मुहावरे का **अर्थ (सरल हिंदी + English)** और कहानी/जीवन से जुड़ा **प्रयोग** मिलेगा। फिर नीचे ख़ुद अपने वाक्य बनाइए।'),
    idioms('कहानी के मुहावरे — टैप कर के पलटिए।', [
      ['मन फीका करना', 'उदास/निराश होकर लौटना — to be disheartened', 'ख़रीदार न मिलने पर लोग मन फीका करके चले जाते थे।'],
      ['जान से हाथ धोना', 'मर जाना, प्राण गँवाना — to lose one’s life', 'बैरी पर वार करते-करते वह जान से हाथ धो बैठा।'],
      ['ईंट का जवाब पत्थर से देना', 'कड़ा प्रत्युत्तर देना — to give a crushing reply', 'अगर वे ईंट का जवाब पत्थर से देना सीख जाते, तो सभ्य कहलाते।'],
      ['दाँतों पसीना आना', 'बहुत कठिन परिश्रम करना — to sweat blood; toil terribly', 'गोई ले जाने में झूरी के साले को दाँतों पसीना आ गया।'],
      ['जी तोड़कर काम करना', 'पूरी शक्ति लगाकर काम करना — to work to the bone', 'गधे जी तोड़कर काम करते हैं, फिर भी बदनाम हैं।'],
      ['गम खा जाना', 'सहकर चुप रह जाना — to swallow one’s anger', 'चार बातें सुनकर भी वे गम खा जाते हैं।'],
      ['नौ-दो-ग्यारह होना', 'भाग जाना, चंपत हो जाना — to take to one’s heels', 'मौक़ा पाकर दोनों मित्र नौ-दो-ग्यारह हो गए।'],
      ['दिल भारी होना', 'दुखी/उदास होना — to be heavy-hearted', 'अपना घर छूटते ही दोनों का दिल भारी हो गया।'],
    ], [
      { q: '"जान से हाथ धोना" का अर्थ है —', opts: ['हाथ धोना', 'मर जाना', 'थक जाना', 'डर जाना'], a: 1, why: 'यह मुहावरा "मर जाना / प्राण गँवाना" के अर्थ में आता है।' },
      { q: 'बहुत मेहनत करने के लिए कौन-सा मुहावरा सही है?', opts: ['गम खा जाना', 'दाँतों पसीना आना', 'मन फीका करना', 'नौ-दो-ग्यारह होना'], a: 1, why: '"दाँतों पसीना आना" = बहुत कठिन परिश्रम करना।' },
    ]),
    applyExpress('अब अपना वाक्य बनाइए', 'नीचे दिए मुहावरे का प्रयोग करते हुए अपना एक वाक्य लिखिए।', 'apply', [
      { id: 'h1-id-01', kind: 'sentence_compose', concept_tag: 'vocab_in_context', difficulty: 3, word: 'ईंट का जवाब पत्थर से देना', instruction: 'इस मुहावरे का प्रयोग करते हुए अपना एक वाक्य लिखिए।', rubric: ['मैंने मुहावरे का प्रयोग किया', 'अर्थ सही निकलता है (कड़ा जवाब देना)', 'वाक्य पूरा है'], model_answer: 'जब गुंडों ने गाँव को धमकाया, तो लोगों ने एकजुट होकर ईंट का जवाब पत्थर से दिया।', min_words: 6 },
      { id: 'h1-id-02', kind: 'sentence_compose', concept_tag: 'vocab_in_context', difficulty: 3, word: 'दिल भारी होना', instruction: 'इस मुहावरे से अपना एक वाक्य बनाइए।', rubric: ['मुहावरे का प्रयोग किया', 'अर्थ सही (उदास होना)', 'वाक्य पूरा है'], model_answer: 'दोस्त के दूसरे शहर जाने की ख़बर सुनकर मेरा दिल भारी हो गया।', min_words: 6 },
    ]),
    quiz([
      { q: '"मन फीका करके चले जाते" — यहाँ "मन फीका करना" का भाव है —', opts: ['निराश-उदास होकर लौटना', 'मन-ही-मन बहुत खुश होना', 'किसी पर ग़ुस्सा करना', 'ज़ोर से हँसना'], a: 0, why: 'मन फीका करना = निराश होकर लौटना।', lvl: 1 },
      { q: 'किस मुहावरे का अर्थ "चुपचाप सह लेना" है?', opts: ['गम खा जाना', 'जान से हाथ धोना', 'दाँतों पसीना आना', 'दिल भारी होना'], a: 0, why: '"गम खा जाना" = क्रोध/दुख सहकर चुप रह जाना।', lvl: 2 },
      { q: '"अगर वे भी ईंट का जवाब पत्थर से देना सीख जाते, तो सभ्य कहलाते" — लेखक किस पर व्यंग्य कर रहे हैं?', opts: ['सहनशीलता को कमज़ोरी मानने की सोच पर', 'खेतों में दिन-रात जुतते बैलों की ताक़त पर', 'गाँव के सीधे-सादे ग़रीब किसानों पर', 'हर साल बदलते कठोर मौसम पर'], a: 0, why: 'लेखक व्यंग्य करते हैं कि दुनिया सहनशीलता को कमज़ोरी और हिंसा को "सभ्यता" मान बैठती है।', lvl: 3 },
    ]),
  ],
});

// ═══ PAGE 7 — पात्र व भाव-यात्रा ═══
reset();
PAGES.push({
  slug: 'patra-bhav', title: 'पात्र और भाव-यात्रा', page_number: 7, tags: ['ganga_section:rachna_se_samvad'],
  blocks: [
    hero('हीरा और मोती — दो स्वभाव', 'Watercolour 16:5 banner — close double portrait of two white oxen heads touching foreheads, one calm and gentle, one fierce and fiery-eyed. Dark warm ground, soft light. Loose washes, paper grain. No text.'),
    text('कहानी के पात्रों को पहचानिए और देखिए कि कहानी के दौरान बैलों का **भाव** कैसे बदलता है — अपनापन से अपमान, फिर विद्रोह, फिर आज़ादी का उल्लास।'),
    characterMap('दो बैलों की कथा के पात्र', [
      { id: 'hira', name: 'हीरा', role: 'सह-नायक', bio: 'शांत, धैर्यवान और विवेकी बैल। मर्यादा में विश्वास रखता है — "गिरे हुए बैरी पर सींग न चलाना चाहिए"।', traits: ['धैर्यवान', 'विवेकी', 'सहनशील'], portrait_url: '', portrait_prompt: 'Watercolour portrait of a calm gentle white ox, soft eyes, dark ground.' },
      { id: 'moti', name: 'मोती', role: 'सह-नायक', bio: 'जोशीला, स्वाभिमानी और थोड़ा उग्र बैल — पर मित्रता में अडिग; हीरा को संकट में कभी अकेला नहीं छोड़ता।', traits: ['स्वाभिमानी', 'जोशीला', 'वफ़ादार'], portrait_url: '', portrait_prompt: 'Watercolour portrait of a fierce fiery-eyed white ox, dark ground.' },
      { id: 'jhuri', name: 'झूरी', role: 'मालिक', bio: 'दयालु किसान, बैलों से सच्चा स्नेह रखता है; उन्हें फूल की छड़ी से भी नहीं छूता।', traits: ['स्नेही', 'दयालु'], portrait_url: '', portrait_prompt: '' },
      { id: 'gaya', name: 'गया', role: 'झूरी का साला', bio: 'झूरी का साला, जिसके यहाँ बैल भेजे जाते हैं; कठोर बरताव करता है, मारता और सूखा भूसा देता है।', traits: ['कठोर', 'निर्दयी'], portrait_url: '', portrait_prompt: '' },
      { id: 'ladki', name: 'छोटी लड़की (भैरो की बेटी)', role: 'सहायक पात्र', bio: 'अनाथ बच्ची जिसे सौतेली माँ मारती है; बैलों को रोटियाँ खिलाती और रस्सी खोलकर भगाती है।', traits: ['दयालु', 'सहानुभूतिशील'], portrait_url: '', portrait_prompt: '' },
      { id: 'stri', name: 'झूरी की स्त्री', role: 'सहायक पात्र', bio: 'बैलों के लौटने पर उन्हें "नमक-हराम" कहकर सूखा भूसा दिलवाती है।', traits: ['कठोर-वचन'], portrait_url: '', portrait_prompt: '' },
    ], [
      { from: 'hira', to: 'moti', label: 'अभिन्न मित्र' },
      { from: 'jhuri', to: 'hira', label: 'स्नेही मालिक' },
      { from: 'gaya', to: 'moti', label: 'कठोर स्वामी' },
      { from: 'ladki', to: 'hira', label: 'दयालु रक्षक' },
      { from: 'stri', to: 'hira', label: 'कठोर वचन' },
    ]),
    heading('भाव-यात्रा — कहानी का मूड कैसे बदला', 2),
    toneMeter([
      ['बहुत दिनों साथ रहते-रहते दोनों में भाईचारा हो गया था।', 'आत्मीयता', 2, 'कहानी प्रेम और अपनेपन से शुरू होती है।'],
      ['जिसे उन्होंने अपना घर समझ रखा था, वह आज उनसे छूट गया था।', 'विषाद', 4, 'बिकने/घर छूटने का गहरा दुख।'],
      ['दोनों बैलों का ऐसा अपमान कभी न हुआ था।', 'अपमान', 4, 'गया का कठोर बरताव — आहत स्वाभिमान।'],
      ['दोनों की आँखों में, रोम-रोम में विद्रोह भरा हुआ था।', 'विद्रोह', 5, 'भाव अपने चरम पर — बग़ावत।'],
      ['दोनों उन्मत्त होकर बछड़ों की भाँति कुलेलें करने लगे।', 'उल्लास', 5, 'आज़ादी का मस्ती-भरा आनंद।'],
      ['मालकिन ने आकर दोनों के माथे चूम लिए।', 'करुणा', 3, 'घर-वापसी की कोमल, प्यार-भरी समाप्ति।'],
    ]),
    comparison('हीरा बनाम मोती', [
      { heading: 'हीरा', color: '#34d399', points: ['अधिक शांत और सहनशील', 'विवेक से काम लेता है', 'मर्यादा में विश्वास — गिरे शत्रु पर वार नहीं', 'गाड़ी को खाई में गिरने से सँभाल लेता है'] },
      { heading: 'मोती', color: '#f87171', points: ['अधिक जोशीला और उग्र', 'अन्याय पर तुरंत भड़कता है', 'स्वाभिमान सबसे ऊपर', 'मित्र के लिए अपनी जान जोखिम में डालता है'] },
    ]),
    reasoning(
      'हीरा और मोती के स्वभाव अलग हैं, फिर भी वे अभिन्न मित्र हैं। उनकी ये भिन्नताएँ एक-दूसरे को कैसे पूरा करती हैं?',
      'हीरा का धैर्य मोती के जोश को सँभालता है (साँड़-युद्ध में रणनीति, गाड़ी सँभालना), और मोती का जोश हीरा के संघर्ष को ताक़त देता है (दीवार तोड़ने पर साथ देना, मित्र को न छोड़ना)। शांति + जोश मिलकर वह संतुलन बनाते हैं जो अकेले किसी में नहीं — यही सच्ची दोस्ती और सहयोग की ताक़त है।',
      3
    ),
    quiz([
      { q: 'इन दोनों में अधिक सहनशील कौन है?', opts: ['हीरा', 'जोशीला मोती', 'साला गया', 'मालिक झूरी'], a: 0, why: 'पाठ कहता है हीरा "ज़्यादा सहनशील था" — वही गाड़ी सँभालता और मोती को समझाता है।', lvl: 1 },
      { q: 'कहानी की भाव-यात्रा का सही क्रम कौन-सा है?', opts: ['आत्मीयता → विषाद/अपमान → विद्रोह → उल्लास', 'विद्रोह → आत्मीयता → विषाद → भय', 'उल्लास → आत्मीयता → विषाद → अपमान', 'अपमान → उल्लास → आत्मीयता → विद्रोह'], a: 0, why: 'कहानी प्रेम से शुरू होकर दुख-अपमान, फिर विद्रोह, और अंत में आज़ादी के उल्लास तक जाती है।', lvl: 2 },
      { q: 'मोती का चरित्र हीरा से किस रूप में भिन्न पर पूरक है?', opts: ['मोती का जोश हीरा के धैर्य से संतुलन बनाता है', 'दोनों का स्वभाव और व्यवहार बिलकुल एक जैसा है', 'मोती हर हाल में डरपोक और कायर है', 'मोती हमेशा अपने मालिक से डरता है'], a: 0, why: 'मोती का जोश और हीरा का विवेक एक-दूसरे की कमी पूरी करते हैं — यही उनकी मित्रता की ताक़त है।', lvl: 3 },
    ]),
  ],
});

// ═══ PAGE 8 — कहानी का सौंदर्य ═══
reset();
PAGES.push({
  slug: 'kahani-ka-saundarya', title: 'कहानी का सौंदर्य', page_number: 8, tags: ['ganga_section:vidha_se_samvad'],
  blocks: [
    hero('कहानी की भाषा का सौंदर्य', 'Watercolour 16:5 banner — abstract evocative composition suggesting storytelling craft: a quill, flowing Devanagari strokes turning into images of oxen and a village, glowing on a dark ground with folk-art accents. Loose washes, paper grain. No text.'),
    text('प्रेमचंद की भाषा कई विशेषताओं से सजी है — चित्रात्मकता, व्यंग्य, विरोधाभास, अतिशयोक्ति। नीचे के गद्यांश में ऊपर दी विशेषता पर टैप करें — उसके सभी उदाहरण रेखांकित हो जाएँगे।'),
    devices(
      'घुटने तक पाँव कीचड़ से भरे हैं। अगर वे भी ईंट का जवाब पत्थर से देना सीख जाते, तो शायद सभ्य कहलाने लगते। झूरी बैलों को देखकर स्नेह से गद्गद हो गया; झूरी की स्त्री ने बैलों को देखा, तो जल उठी। झूरी इन्हें फूल की छड़ी से भी न छूता था।',
      [
        ['imagery', [['घुटने तक पाँव कीचड़ से भरे हैं।', 'शब्दों से आँखों के सामने जीवंत चित्र खिंच जाता है — यही चित्रात्मकता (बिंब) है।']]],
        ['vyangya', [['अगर वे भी ईंट का जवाब पत्थर से देना सीख जाते, तो शायद सभ्य कहलाने लगते।', 'चुभता हुआ व्यंग्य — दुनिया हिंसा को "सभ्यता" और सहनशीलता को कमज़ोरी मानती है।']]],
        ['virodhabhas', [['स्नेह से गद्गद हो गया', 'एक ही दृश्य पर दो विरोधी भाव — झूरी का स्नेह...'], ['जल उठी', '...और स्त्री का क्रोध। यही विरोधाभास है।']]],
        ['hyperbole', [['फूल की छड़ी से भी न छूता था', 'बात को बढ़ा-चढ़ाकर कहना — अत्यधिक कोमल व्यवहार दिखाने को अतिशयोक्ति।']]],
      ]
    ),
    table('कहानी का सौंदर्य — एक नज़र में', ['विशेषता', 'अर्थ', 'उदाहरण'], [
      ['चित्रात्मकता', 'शब्दों से जीवंत चित्र बनाना (imagery)', 'घुटने तक पाँव कीचड़ से भरे हैं।'],
      ['संवादात्मकता', 'पात्रों की बातचीत से कथा आगे बढ़ना (dialogue-driven)', '"मर जाऊँगा, पर उसके काम तो न आऊँगा।"'],
      ['व्यंग्य', 'चुभते संकेत से दोष/पाखंड दिखाना (satire)', 'अगर वे ईंट का जवाब पत्थर से देना सीख जाते...'],
      ['विरोधाभास', 'दो विरोधी बातें साथ (paradox)', 'झूरी गद्गद हुआ; स्त्री जल उठी।'],
      ['अतिशयोक्ति', 'बढ़ा-चढ़ाकर कहना (hyperbole)', 'फूल की छड़ी से भी न छूता था।'],
    ]),
    worked('कहानी की रचना — मुख्य बिंदु', 'इस कहानी की शुरुआत में ही ऐसे कौन-से संकेत मिलते हैं जो आगे की कथा (पात्र, भाषा, मुख्य भाव) की ओर इशारा करते हैं? कम-से-कम तीन बिंदु सोचिए, फिर उत्तर देखिए।', '**मुख्य पात्र:** आरंभ में ही गधे की "निरापद सहिष्णुता" की बात आती है — यही सहनशीलता आगे बैलों का केंद्रीय गुण बनती है।\n\n**भाषा/शैली:** पहले ही पन्ने पर व्यंग्य (अफ़्रीका, अमरीका, जापान के उदाहरण) मिलता है — पूरी कहानी इसी व्यंग्यात्मक-संवेदनशील शैली में चलती है।\n\n**मुख्य भाव:** "बेवक़ूफ़ बनाम स्वाभिमानी सहनशील" का द्वंद्व शुरू में ही रखा गया है — यही आगे "ग़ुलामी बनाम आज़ादी" बन जाता है।'),
    quiz([
      { q: '"घुटने तक पाँव कीचड़ से भरे हैं" — यह भाषा की कौन-सी विशेषता है?', opts: ['सीधी चित्रात्मकता', 'बढ़ा-चढ़ाकर कही अतिशयोक्ति', 'चुभता हुआ व्यंग्य', 'पंक्ति की तुक'], a: 0, why: 'शब्दों से आँखों के सामने दृश्य खिंच जाता है — यह चित्रात्मकता (imagery) है।', lvl: 1 },
      { q: '"झूरी गद्गद हुआ; उसकी स्त्री जल उठी" — एक ही घटना पर दो उलटे भाव — यह क्या कहलाता है?', opts: ['विरोधाभास', 'शब्दों का अनुप्रास', 'कोई सुंदर उपमा', 'साधारण संवाद'], a: 0, why: 'दो विरोधी बातों का साथ आना विरोधाभास (paradox) है।', lvl: 2 },
      { q: 'पूरी कहानी अधिकतर पात्रों की बातचीत ("मूक-भाषा" के संवाद) से आगे बढ़ती है। यह विशेषता क्या कहलाती है?', opts: ['संवादात्मकता', 'बढ़ा-चढ़ाकर कही अतिशयोक्ति', 'आँखों के सामने खिंचती चित्रात्मकता', 'चुभता व्यंग्य'], a: 0, why: 'कथा का संवादों के माध्यम से आगे बढ़ना संवादात्मकता है।', lvl: 3 },
    ]),
  ],
});

// ═══ PAGE 9 — विषयों से संवाद ═══
reset();
PAGES.push({
  slug: 'vishayon-se-samvad', title: 'विषयों से संवाद', page_number: 9, tags: ['ganga_section:vishayon_se_samvad'],
  blocks: [
    hero('आज़ादी की कहानी', 'Watercolour 16:5 banner — a freedom-era Indian village scene subtly merging with the bars of a pound/cage, symbolic of the स्वतंत्रता संग्राम. Dark ground, subtle tricolour-tinted dawn light. Loose washes, paper grain. No text.'),
    text('यह कहानी सिर्फ़ दो बैलों की नहीं — इतिहास, समाज और मानवीय मूल्यों से जुड़ी है। नीचे के संदर्भ कहानी की गहराई खोलते हैं।'),
    contextCard('काँजीहौस', 'concept', 'आवारा या दूसरे का खेत चरने वाले पशुओं को बंद करने का सरकारी बाड़ा।', 'अंग्रेज़ी शासन में आवारा पशुओं को पकड़कर **काँजीहौस** ("cattle pound") में बंद कर दिया जाता था; दंड लेकर या नीलाम करके छोड़ा जाता। कहानी में यह **जेल और ग़ुलामी का प्रतीक** है — जहाँ बेक़सूर बंद हैं, भूखे हैं, और आज़ादी के लिए दीवार तोड़नी पड़ती है।', 'Watercolour of a colonial-era mud-walled cattle pound at dusk, animals penned inside, a watchman with a lantern. Dark ground, faint light. Loose washes, paper grain. No text.'),
    contextCard('स्वतंत्रता संग्राम', 'event', 'अंग्रेज़ी शासन से भारत की आज़ादी की लड़ाई — असहयोग और सत्याग्रह का युग।', 'कहानी जिस समय लिखी गई, भारत पर अंग्रेज़ों का दमनकारी शासन था। हीरा-मोती की बार-बार बग़ावत, "अन्यायी की सेवा न करना" और काँजीहौस तोड़ना — यह **असहयोग और सत्याग्रह** की भावना का परोक्ष चित्र है। बैल = भारतीय जनता; उनका संघर्ष = आज़ादी की लड़ाई।'),
    themeExplorer('कहानी के मुख्य भाव — हर कार्ड पर टैप कीजिए।', [
      ['स्वतंत्रता सहज नहीं मिलती', 'आज़ादी पाने के लिए बार-बार संघर्ष करना पड़ता है; एक बार में नहीं मिलती।', ['"दोनों की आँखों में, रोम-रोम में विद्रोह भरा हुआ था।"', '"जोर तो मारता ही जाऊँगा, चाहे कितने ही बंधन पड़ते जाएँ।"'], 'अपने जीवन में किसी ऐसी चीज़ के बारे में सोचिए जो बार-बार कोशिश के बाद ही मिली। उस संघर्ष से आपने क्या सीखा?'],
      ['मित्रता और सहयोग की शक्ति', 'अकेले कमज़ोर, पर मिलकर बड़ी ताक़त को भी हराया जा सकता है।', ['"साँड़ को संगठित शत्रुओं से लड़ने का तजुरबा न था।"', '"फँसेंगे तो दोनों फँसेंगे।"'], 'किसी मुश्किल का सामना आपने किसी मित्र के साथ मिलकर कब किया? साथ होने से क्या फ़र्क़ पड़ा?'],
      ['अन्याय सहना भी अन्याय में भागीदारी है', 'अन्याय के आगे चुप रहना भी ग़लत है; मर्यादा के साथ विरोध ज़रूरी है।', ['"अब तो नहीं सहा जाता, हीरा!"', '"मर जाऊँगा; पर उसके काम तो न आऊँगा।"'], 'क्या आप इस बात से सहमत हैं कि अन्याय चुपचाप सहना भी एक तरह से उसका साथ देना है? अपने उत्तर का कारण बताइए।'],
    ]),
    callout('literature_in_life', 'कहानी और आपका जीवन', 'हीरा-मोती की मूक-भाषा हमें याद दिलाती है कि **अपनापन और स्वाभिमान** हर प्राणी में होता है। आज भी पशु-क्रूरता के विरुद्ध क़ानून हैं, और "अन्यायी का सहयोग न करना" किसी भी अन्याय — स्कूल हो या समाज — के विरुद्ध खड़े होने का रास्ता है।'),
    reasoning(
      '"मर जाऊँगा; पर उसके काम तो न आऊँगा।" — यह एक बैल का कथन है। इसे महात्मा गांधी के असहयोग आंदोलन से जोड़कर समझाइए।',
      'असहयोग का मूल मंत्र यही है — अन्यायी शासन को हथियार से नहीं, उसका सहयोग बंद करके हराना। बैल कहता है कि चाहे जान चली जाए, वह ज़ालिम की सेवा नहीं करेगा — यही "मरूँगा पर ग़ुलामी/सहयोग नहीं करूँगा" की सत्याग्रही भावना है, जिससे भारतीय जनता ने अंग्रेज़ी शासन को कमज़ोर किया।',
      4
    ),
    quiz([
      { q: 'कहानी में काँजीहौस किसका प्रतीक है?', opts: ['जेल और ग़ुलामी का', 'गाँव के पुराने स्कूल का', 'भीड़-भरे खुले बाज़ार का', 'गाँव के मंदिर का'], a: 0, why: 'बेक़सूर पशुओं को बंद करने वाला काँजीहौस जेल/ग़ुलामी का प्रतीक है।', lvl: 1 },
      { q: 'कहानी के अनुसार बड़ी ताक़त को कैसे हराया जा सकता है?', opts: ['एकता और सहयोग से', 'अकेले डटकर लड़ने से', 'मैदान छोड़कर भाग जाने से', 'डरकर चुप रह जाने से'], a: 0, why: 'संगठित होकर लड़ने से ही साँड़ (बड़ी ताक़त) हारता है — एकता की शक्ति।', lvl: 2 },
      { q: 'बैलों का "अन्यायी की सेवा न करना" किस ऐतिहासिक भावना से मेल खाता है?', opts: ['असहयोग और सत्याग्रह', 'लाभ-हानि देखकर किया व्यापार', 'सोच-समझकर बनाई युद्ध-नीति', 'गाँव-गाँव से कर-वसूली'], a: 0, why: 'अन्यायी का सहयोग बंद कर देना ही असहयोग-सत्याग्रह की आत्मा है।', lvl: 3 },
    ]),
  ],
});

// ═══ PAGE 10 — सृजन व गतिविधियाँ ═══
reset();
PAGES.push({
  slug: 'srijan-gatividhiyan', title: 'सृजन और गतिविधियाँ', page_number: 10, tags: ['ganga_section:srijan'],
  blocks: [
    hero('अपनी कलम से', 'Watercolour 16:5 banner — an open diary and a quill beside a small lamp, faint images of two oxen rising from the page, on a dark ground with folk accents. Loose washes, paper grain. No text.'),
    text('अब आपकी बारी — कल्पना और भाषा दोनों का प्रयोग कीजिए। नीचे का आदर्श (model) पढ़िए, फिर अपनी डायरी और भाषण लिखिए।'),
    writing('कल्पना कीजिए कि हीरा या मोती लिख-पढ़ सकते हैं। उस दिन की डायरी लिखिए जब उन्हें काँजीहौस ले जाया गया।', 'diary_entry', [
      ['तिथि व आरंभ', 'आज का दिन — काँजीहौस\n\nआज हमें इस अँधेरे बाड़े में बंद कर दिया गया।', 'डायरी "आज का दिन..." से शुरू कीजिए और स्थान बताइए — पाठक तुरंत जुड़ जाता है।'],
      ['भावनाएँ', 'भूख से पेट जल रहा है — सारा दिन एक तिनका तक न मिला। मोती चुप है, पर उसकी आँखों में वही पुराना विद्रोह दहक रहा है। मुझे अपमान से ज़्यादा इस बात का दुख है कि इतने सारे बेक़सूर जानवर यहाँ क़ैद हैं।', 'अपने मन के भाव — भूख, गुस्सा, दर्द — खुलकर लिखिए। डायरी में "मैं" की आवाज़ ही उसकी जान है।'],
      ['आशा/संकल्प', 'पर मुझे विश्वास है — यह दीवार कच्ची है, और मेरे सींग मज़बूत। आज रात मैं इसे तोड़ूँगा, चाहे मार ही क्यों न पड़े। झूरी हमें ज़रूर वापस ले जाएगा।', 'अंत आशा या संकल्प पर कीजिए — इससे डायरी कमज़ोरी नहीं, हिम्मत की कहानी बन जाती है।'],
    ], ['"मैं" में लिखिए — यह आपकी अपनी आवाज़ है।', 'भाव असली रखिए — बनावटी मत कीजिए।', 'अंत आशा/संकल्प पर कीजिए।']),
    writing('बाल-सभा ने आपको हीरा-मोती के लौटने पर "पशुओं के अधिकार" विषय पर भाषण देने बुलाया है। अपना भाषण लिखिए।', 'speech', [
      ['संबोधन', 'आदरणीय अध्यक्ष महोदय, शिक्षकगण और मेरे प्यारे साथियो!', 'भाषण की शुरुआत आदरपूर्ण संबोधन से कीजिए।'],
      ['मुद्दा उठाना', 'आज मैं उन साथियों की बात करना चाहता हूँ जो बोल नहीं सकते — हमारे पशु। हीरा और मोती की कथा हमें सिखाती है कि पशुओं में भी अपनापन, स्वाभिमान और दर्द होता है।', 'एक ठोस उदाहरण (हीरा-मोती) से बात शुरू कीजिए — इससे श्रोता जुड़ जाते हैं।'],
      ['समाधान/अपील', 'हमें उन्हें भूख, मार और क्रूरता से बचाना चाहिए — यही सच्ची मानवता है। आइए, प्रण लें कि किसी बेज़ुबान पर अत्याचार नहीं होने देंगे।', 'अंत एक स्पष्ट अपील/प्रण पर कीजिए — भाषण याद रह जाता है।'],
    ], ['सरल, सीधे वाक्य बोलिए।', 'एक उदाहरण ज़रूर दीजिए।', 'अंत एक अपील पर कीजिए।']),
    heading('व्याकरण व्यायामशाला', 2),
    applyExpress('व्याकरण व्यायामशाला', 'शब्द-रचना और रूप-परिवर्तन का अभ्यास कीजिए।', 'grammar', [
      { id: 'h1-gr-01', kind: 'word_builder', concept_tag: 'grammar', difficulty: 2, base: 'मान', affixes: ['अप', 'सम्', 'अनु', 'प्र'], correct: 'अप', target: 'अपमान', position: 'prefix', meaning_hint: 'आदर का उलटा — insult', explanation: 'उपसर्ग "अप" जुड़कर "मान" (आदर) को उलट देता है → अपमान।' },
      { id: 'h1-gr-02', kind: 'word_builder', concept_tag: 'grammar', difficulty: 2, base: 'मानव', affixes: ['ता', 'पन', 'त्व', 'इक'], correct: 'ता', target: 'मानवता', position: 'suffix', meaning_hint: 'इंसानियत — humanity', explanation: 'प्रत्यय "ता" भाववाचक संज्ञा बनाता है → मानवता।' },
      { id: 'h1-gr-03', kind: 'fill_blank', concept_tag: 'grammar', difficulty: 3, prompt: 'संधि कीजिए — विद्या + आलय = ______', answers: [['विद्यालय']], hint: 'आ + आ = आ (दीर्घ संधि)।', explanation: 'विद्या के "आ" और आलय के "आ" मिलकर एक दीर्घ "आ" बनाते हैं → विद्यालय।' },
      { id: 'h1-gr-04', kind: 'transform', concept_tag: 'grammar', difficulty: 2, source: 'लड़का', instruction: 'इस शब्द का स्त्रीलिंग रूप लिखिए।', answers: ['लड़की'], rule: 'पुल्लिंग "लड़का" → स्त्रीलिंग "लड़की" (आ → ई)।' },
      { id: 'h1-gr-05', kind: 'transform', concept_tag: 'grammar', difficulty: 3, source: 'बैल खेत में था।', instruction: 'इस वाक्य को बहुवचन में बदलिए।', answers: ['बैल खेत में थे।', 'बैल खेतों में थे।'], hint: '"था" → "थे"।', rule: 'एकवचन क्रिया "था" बहुवचन में "थे" हो जाती है।' },
      { id: 'h1-gr-06', kind: 'form_select', concept_tag: 'grammar', difficulty: 3, prompt: 'सही वाक्य चुनिए —', options: ['बैलों ने पगहा तोड़ दिया।', 'बैल ने पगहा तोड़ दिए।', 'बैलों ने पगहा तोड़ दिया है था।'], correct_index: 0, option_reasons: ['सही — कर्ता बहुवचन "बैलों ने", क्रिया उचित।', 'अशुद्ध — कर्ता-क्रिया मेल नहीं।', 'अशुद्ध — काल-रूप ग़लत।'] },
      { id: 'h1-gr-07', kind: 'spot_error', concept_tag: 'grammar', difficulty: 4, tokens: ['मोती', 'ने', 'साँड़', 'को', 'सींग', 'मारा'], error_index: 5, fix: 'मारी', fix_options: ['मारी', 'मारे', 'मारता'], rule: '"सींग" यहाँ स्त्रीलिंग के अनुरूप — "मोती ने साँड़ को सींग मारी" (लिंग-अनुरूपता)।' },
    ]),
    debate('विषय — "पशुओं को काम (हल/गाड़ी) में जोतना उचित है।" अपनी ओर के वाक्य-साँचों से बहस तैयार कीजिए।', {
      for: ['सबसे पहले मैं इस पक्ष में कहना चाहूँगा कि...', 'मेरा पहला तर्क यह है कि खेती में बैल सदियों से सहायक रहे हैं...', 'इसके अतिरिक्त, उचित देखभाल के साथ यह दोनों के लिए लाभकारी है...'],
      against: ['इसके विपरीत, मैं मानता हूँ कि...', 'हीरा-मोती की कथा दिखाती है कि क्रूर बरताव अन्याय है...', 'इसलिए पशुओं के अधिकार और दया सर्वोपरि होने चाहिए...'],
    }),
    quiz([
      { q: '"मानव" में कौन-सा प्रत्यय जोड़ने से "मानवता" बनता है?', opts: ['पन', 'ता', 'इक', 'त्व'], a: 1, why: 'भाववाचक प्रत्यय "ता" से मानव → मानवता।', lvl: 1 },
      { q: '"विद्या + आलय" की संधि से कौन-सा शब्द बनता है?', opts: ['विद्यालय', 'विद्याआलय', 'विद्यालयः', 'विद्यलय'], a: 0, why: 'दीर्घ संधि (आ + आ = आ) से विद्यालय बनता है।', lvl: 2 },
      { q: '"लड़का" का स्त्रीलिंग रूप क्या है?', opts: ['लड़की', 'लड़कियाँ', 'लड़कपन', 'लड़के'], a: 0, why: 'पुल्लिंग लड़का → स्त्रीलिंग लड़की (आ → ई)।', lvl: 2 },
    ]),
  ],
});

// ═══ PAGE 11 — अभ्यास (Practice) ═══
reset();
// 22 MCQs — concept tags spread (comprehension/vocab_in_context/grammar/interpretation/
// inference), difficulty 1–5 not clustered, option lengths varied (no length tell).
// Option order is balanced so the correct answer is NOT systematically the longest
// (Kaveri length-bias lesson). Distractors are plausible misreadings, not throwaways.
const PR = [
  { id: 'h1-pr-01', q: 'झूरी के दोनों बैलों के नाम क्या थे?', opts: ['हीरा और मोती', 'गया और भैरो, दोनों सगे भाई', 'राम तथा श्याम नाम के बैल', 'सोना और चाँदी'], a: 0, t: 'comprehension', d: 1, e: 'झूरी के दोनों बैल हीरा और मोती थे।' },
  { id: 'h1-pr-02', q: 'जानवरों में सबसे बुद्धिहीन किसे कहा गया है?', opts: ['गधा', 'हल खींचने वाला बैल', 'तेज़ दौड़ने वाला घोड़ा', 'वफ़ादार कुत्ता'], a: 0, t: 'comprehension', d: 1, e: 'कहानी के आरंभ में गधे को सबसे बुद्धिहीन कहा गया है।' },
  { id: 'h1-pr-03', q: 'बैलों को पहली बार किसके यहाँ भेजा गया?', opts: ['गया के यहाँ', 'गाँव के मुखिया के यहाँ', 'किसी व्यापारी सेठ के घर', 'पड़ोसी भैरो के यहाँ'], a: 0, t: 'comprehension', d: 1, e: 'झूरी ने बैलों को अपने साले गया के यहाँ भेजा।' },
  { id: 'h1-pr-04', q: 'काँजीहौस से बाक़ी जानवरों को निकालने के लिए हीरा ने क्या किया?', opts: ['सींगों से कच्ची दीवार तोड़ी', 'चौकीदार से चाबी माँगी', 'ज़ोर-ज़ोर से शोर मचाया', 'गेट खोला'], a: 0, t: 'comprehension', d: 2, e: 'हीरा ने अपने नुकीले सींगों से कच्ची दीवार तोड़कर सबको भगाया।' },
  { id: 'h1-pr-05', q: 'बैलों को रोटियाँ कौन खिलाती थी?', opts: ['भैरो की अनाथ बेटी', 'झूरी की पत्नी रोज़ शाम को', 'गया की पत्नी चुपके से', 'मुंशी जी'], a: 0, t: 'comprehension', d: 2, e: 'सौतेली माँ से प्रताड़ित, भैरो की छोटी बेटी उन्हें रोटियाँ खिलाती थी।' },
  { id: 'h1-pr-06', q: 'अंत में मालकिन ने लौटे हुए बैलों के साथ क्या किया?', opts: ['दोनों के माथे चूम लिए', 'नमक-हराम कहकर डाँटा', 'फिर से बेच देने की ठानी', 'बाँध दिया'], a: 0, t: 'comprehension', d: 2, e: 'घर लौटने पर मालकिन ने स्नेह से दोनों के माथे चूम लिए।' },
  { id: 'h1-pr-07', q: '"निरापद" शब्द का अर्थ है —', opts: ['सुरक्षित', 'आपत्ति से भरा हुआ ख़तरनाक', 'बहुत तेज़ चलने वाला', 'देखने में सुंदर'], a: 0, t: 'vocab_in_context', d: 2, e: 'निरापद = आपत्ति से रहित, सुरक्षित।' },
  { id: 'h1-pr-08', q: '"तजुरबा" किसका पर्याय है?', opts: ['अनुभव', 'भीतर भरा हुआ क्रोध', 'दिन-भर की थकान', 'मन का घमंड'], a: 0, t: 'vocab_in_context', d: 2, e: 'तजुरबा = अनुभव (experience)।' },
  { id: 'h1-pr-09', q: '"नाँद" क्या है?', opts: ['पशुओं का चारा-पानी का बर्तन', 'गले में बाँधने की रस्सी', 'खेत के चारों ओर की सीमा', 'चमड़े का छोटा बाजा'], a: 0, t: 'vocab_in_context', d: 2, e: 'नाँद = feeding trough, पशुओं का चारा-पानी का बर्तन।' },
  { id: 'h1-pr-10', q: '"व्याकुल" का सबसे निकट अर्थ है —', opts: ['बेचैन', 'पूरी तरह शांत और स्थिर', 'मन-ही-मन बहुत प्रसन्न', 'थका हुआ'], a: 0, t: 'vocab_in_context', d: 3, e: 'व्याकुल = बेचैन, घबराया हुआ।' },
  { id: 'h1-pr-11', q: '"अप" उपसर्ग "मान" में जोड़ने से कौन-सा शब्द बनता है?', opts: ['अपमान', 'सम्मान (आदर का भाव)', 'अनुमान लगाना', 'परिमाण'], a: 0, t: 'grammar', d: 2, e: 'उपसर्ग "अप" + मान = अपमान।' },
  { id: 'h1-pr-12', q: '"मानवता" में मूल शब्द और प्रत्यय कौन-से हैं?', opts: ['मानव + ता', 'मान शब्द में "वता" प्रत्यय', '"मा" मूल में "नवता"', 'मानवत + अ'], a: 0, t: 'grammar', d: 3, e: 'मानव (मूल) + ता (प्रत्यय) = मानवता।' },
  { id: 'h1-pr-13', q: '"बैल खेत में था।" — इसका शुद्ध बहुवचन रूप है —', opts: ['बैल खेत में थे।', 'बैल खेत में हैं था।', 'बैलों खेत में था।', 'बैल खेत था में।'], a: 0, t: 'grammar', d: 3, e: 'एकवचन "था" बहुवचन में "थे" होता है; बाक़ी विकल्पों में रूप/क्रम अशुद्ध है।' },
  { id: 'h1-pr-14', q: '"टिटकारना" शब्द किस प्रकार बना है?', opts: ['"टिक-टिक" ध्वनि के अनुकरण से', 'किसी उपसर्ग के जुड़ने से', 'दो शब्दों के समास से', 'विदेशी मूल से'], a: 0, t: 'grammar', d: 4, e: '"टिक-टिक" ध्वनि के अनुकरण से बना अनुकरणात्मक शब्द है।' },
  { id: 'h1-pr-15', q: 'हीरा-मोती ने नए मालिक के यहाँ काम करने से इनकार क्यों किया?', opts: ['बिकना उन्हें अपना अपमान लगा', 'वे स्वभाव से आलसी थे', 'वहाँ चारा बहुत कम मिलता था', 'रास्ता लंबा था'], a: 0, t: 'interpretation', d: 3, e: 'मालिक ने बेच दिया — यह सोचकर उन्हें गहरा अपमान महसूस हुआ, इसलिए असहयोग किया।' },
  { id: 'h1-pr-16', q: '"गिरे हुए बैरी पर सींग न चलाना चाहिए" — हीरा का यह कथन क्या दर्शाता है?', opts: ['युद्ध में भी मर्यादा', 'लड़ने से बचने की कायरता', 'अपनी ताक़त का घमंड', 'सोच की मूर्खता'], a: 0, t: 'interpretation', d: 3, e: 'हारे हुए शत्रु पर वार न करना — वीरता के साथ मर्यादा का मूल्य।' },
  { id: 'h1-pr-17', q: 'मोती द्वारा दोनों गधों को भी बाहर निकालना उसके किस गुण को दिखाता है?', opts: ['त्याग और करुणा', 'अपने भले का स्वार्थ', 'मार से बचने का डर', 'अधिक पाने का लालच'], a: 0, t: 'interpretation', d: 4, e: 'अपनी मार की परवाह किए बिना दूसरों की जान बचाना — त्याग और करुणा।' },
  { id: 'h1-pr-18', q: 'कहानी को स्वतंत्रता आंदोलन से जोड़ें तो "काँजीहौस" किसका प्रतीक है?', opts: ['पराधीनता/जेल', 'समृद्ध भारतीय गाँव', 'खुले बाज़ार का व्यापार', 'कोई लोक-त्योहार'], a: 0, t: 'interpretation', d: 4, e: 'बेक़सूरों को बंद करने वाला काँजीहौस पराधीनता/जेल का प्रतीक है।' },
  { id: 'h1-pr-19', q: '"मर जाऊँगा; पर उसके काम तो न आऊँगा।" — यह किस भावना से मेल खाता है?', opts: ['असहयोग और सत्याग्रह', 'लाभ-हानि का व्यापार', 'मन में बैठा गहरा भय', 'धन का लोभ'], a: 0, t: 'interpretation', d: 5, e: 'अन्यायी का सहयोग न करना — यही असहयोग-सत्याग्रह की आत्मा है।' },
  { id: 'h1-pr-20', q: 'साँड़ के अकेले हारने से क्या निष्कर्ष निकलता है?', opts: ['संगठित एकता बड़ी ताक़त को भी हरा देती है', 'साँड़ शुरू से कमज़ोर था', 'दोनों बैल जादुई थे', 'युद्ध करना बेकार है'], a: 0, t: 'inference', d: 4, e: 'साँड़ अकेले लड़ने का आदी था; संगठित दो बैलों से हारा — एकता बड़ी ताक़त को भी हराती है।' },
  { id: 'h1-pr-21', q: 'अनाथ लड़की के बैलों से जुड़ाव से लेखक क्या संकेत देते हैं?', opts: ['दुख, दुख को पहचान लेता है', 'वह लड़की बहुत अमीर थी', 'बैल असल में पालतू थे', 'मालिक बहुत भला था'], a: 0, t: 'inference', d: 5, e: 'प्रताड़ित लड़की और दुखी बैल — साझा दर्द ही आत्मीयता का आधार बनता है।' },
  { id: 'h1-pr-22', q: 'पूरी कहानी का केंद्रीय भाव क्या है?', opts: ['आज़ादी संघर्ष से मिलती है', 'जीवन में धन का सबसे अधिक महत्त्व', 'खेती के पुराने-नए तरीक़े', 'बदलते मौसम का असर'], a: 0, t: 'inference', d: 5, e: 'बार-बार बग़ावत और लौटना — आज़ादी सहज नहीं, निरंतर संघर्ष से मिलती है।' },
].map(x => ({ id: x.id, question: x.q, options: x.opts, correct_index: x.a, explanation: x.e, concept_tag: x.t, difficulty: x.d }));

PAGES.push({
  slug: 'abhyas', title: 'अभ्यास — Practice', page_number: 11, tags: ['ganga_section:rachna_se_samvad'],
  blocks: [
    hero('अभ्यास', 'Watercolour 16:5 banner — a warm study nook with an open Hindi book, a lamp, and faint oxen motifs, inviting practice. Dark ground, folk accents. Loose washes, paper grain. No text.'),
    text('अब अभ्यास का समय। पहले बहुविकल्पी प्रश्न हल कीजिए — हर प्रश्न के साथ **तर्क (कारण)** भी दिया है। फिर रचनात्मक चुनौतियाँ कीजिए, और अंत में "बैल" शब्द को भारतीय भाषाओं में देखिए।'),
    chapterPractice('अध्याय 1 — अभ्यास प्रश्न', 'सही उत्तर चुनिए और कारण समझिए। प्रश्न आपके स्तर के अनुसार आते जाएँगे।', PR),
    applyExpress('रचना से संवाद — अपना उत्तर रचिए', 'पढ़ने के बाद अब रचना कीजिए।', 'apply', [
      { id: 'h1-ap-01', kind: 'unscramble', concept_tag: 'comprehension', difficulty: 3, tokens: ['मर', 'जाऊँगा', 'पर', 'उसके', 'काम', 'तो', 'न', 'आऊँगा'], answer: 'मर जाऊँगा पर उसके काम तो न आऊँगा' },
      { id: 'h1-ap-02', kind: 'predict_word', concept_tag: 'comprehension', difficulty: 2, lead: 'गिरे हुए बैरी पर सींग न चलाना', answers: ['चाहिए'], full_line: 'गिरे हुए बैरी पर सींग न चलाना चाहिए।' },
      { id: 'h1-ap-03', kind: 'sentence_compose', concept_tag: 'vocab_in_context', difficulty: 3, word: 'आत्मीयता', instruction: '"आत्मीयता" शब्द से अपना एक वाक्य लिखिए।', rubric: ['शब्द का प्रयोग किया', 'अर्थ सही (अपनापन)', 'वाक्य पूरा है'], model_answer: 'नए स्कूल में पहले ही दिन एक सहपाठी से ऐसी आत्मीयता हुई कि अजनबीपन ग़ायब हो गया।', min_words: 6 },
    ]),
    heading('भाषा संगम — एक शब्द, अनेक भारतीय भाषाएँ', 2),
    text('"बैल" शब्द संविधान की आठवीं अनुसूची की भाषाओं में कैसे कहा जाता है? अपनी मातृभाषा का शब्द भी जोड़िए।'),
    table('"बैल" — भारतीय भाषाओं में', ['भाषा', 'शब्द'], [
      ['हिंदी', 'बैल'], ['संस्कृत', 'वृषभ'], ['पंजाबी', 'बलद'], ['मराठी', 'बैल'], ['गुजराती', 'બળદ (बळद)'], ['नेपाली', 'गोरु'], ['बांग्ला', 'বলদ (बलद)'], ['ओडिआ', 'ବଳଦ (बलद)'], ['तेलुगु', 'ఎద్దు (एद्दु)'], ['तमिल', 'காளை (काळै)'], ['कन्नड़', 'ಎತ್ತು (एत्तु)'], ['मलयालम', 'കാള (काळ)'],
    ]),
    callout('threads_of_curiosity', 'खोजबीन — और आगे', 'इन्हें देखिए/सुनिए और कहानी को और गहराई से समझिए:\n\n- दो बैलों की कथा (NCERT आधिकारिक वाचन) — *youtube.com/results?search_query=दो+बैलों+की+कथा+NCERT*\n- कथा सम्राट प्रेमचंद — उनका जीवन और कहानियाँ\n- प्रेमचंद का बचपन और बच्चों की कहानियाँ\n\nखोजिए — और किन कहानियों में प्रेमचंद ने पशुओं को इंसानों जैसा दिखाया है?'),
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
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found. Run setup_class9_hindi_book.js first.`);
    console.log(`✓ Found book: ${book.title} (${book._id})`);
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: String(book._id), slug: p.slug });
      if (existing) { console.log(`  ⤷ Page "${p.slug}" already exists — skipping.`); continue; }
      const pageId = uuidv4();
      await pages.insertOne({
        _id: pageId, book_id: String(book._id), chapter_number: CHAPTER_NO, page_number: p.page_number,
        slug: p.slug, title: p.title, blocks: p.blocks, hinglish_blocks: [], tags: p.tags || [],
        published: false, reading_time_min: 7, content_types: contentTypes(p.blocks),
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
if (process.argv[1] && process.argv[1].endsWith('setup_class9_hindi_ch1_c.js')) {
  main().catch(err => { console.error(err); process.exit(1); });
}
