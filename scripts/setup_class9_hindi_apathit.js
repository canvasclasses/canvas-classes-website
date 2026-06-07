'use strict';
/**
 * गंगा — अपठित बोध (Unseen Comprehension) module — CBSE Class 9 Hindi A Reading section (Section अ, 14 marks).
 * A strategy page + original unseen गद्यांश (prose) and काव्यांश (poetry) passages, each with
 * BASIC-understanding questions (mcq / assertion_reason / short_answer). Friendly North-Indian-
 * classroom teacher voice. Competitive-hard items live in Crucible, not here (founder decision 2026-06-07).
 * Reuses the shared `reading_comprehension` block (shipped by the Kaveri team).
 *
 * Idempotent by slug. Adds गंगा chapter #13. Run: node scripts/setup_class9_hindi_apathit.js [--rollback]
 * Docs affected: up to 5 book_pages (upsert) + 1 book.chapters entry (#13). published:false (book in review).
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_SLUG = 'class9-hindi-ganga';
const CHAPTER = 13;
const uid = () => randomUUID();
const hero = (alt, prompt) => ({ id: uid(), type: 'image', order: 0, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: prompt });

// ════════════════════════ PASSAGES ════════════════════════

// गद्यांश-1 (discursive) — छोटी आदतें
const GADYA1 = `हम अकसर सोचते हैं कि बड़ी सफलता के लिए कोई बड़ा काम करना ज़रूरी है। हमें लगता है कि कक्षा में पहला आने वाला विद्यार्थी रोज़ दस घंटे पढ़ता होगा। पर जो लोग सचमुच आगे बढ़ते हैं, उनका रहस्य कोई एक बड़ा प्रयास नहीं होता — बल्कि एक छोटी-सी आदत होती है, जिसे वे हर दिन बिना नागा दोहराते हैं।

मान लो कोई विद्यार्थी एक ही रात में हज़ार शब्द रटना चाहे। सुबह तक वह अधिकतर भूल जाएगा और थककर निराश हो जाएगा। पर जो रोज़ सिर्फ़ पाँच नए शब्द सीखता है, वह एक साल में अठारह सौ से ज़्यादा शब्द सीख लेता है — बिना किसी रात जागे, बिना थके।

छोटी आदत की यही शांत ताक़त है। एक छोटा काम इतना मामूली लगता है कि लोग उसे छोड़ देते हैं; उन्हें तुरंत नतीजा चाहिए होता है। पर आदतें बैंक के ब्याज की तरह होती हैं — हर छोटी जमा बेकार लगती है, जब तक समय उसे चुपचाप बड़ा नहीं बना देता।

इसलिए जब कोई बड़ा लक्ष्य तुम्हें डराए, तो बड़ा प्रयास मत ढूँढो। आज जो सबसे छोटा कदम उठा सको, वही उठाओ — और कल फिर वही दोहराओ। धीरे-धीरे, लगभग बिना जाने, तुम वही बन जाओगे जो तुम बनना चाहते थे।`;

const GADYA1_Q = [
  { kind: 'mcq', id: 'ap-g1-q1', question: 'गद्यांश के अनुसार, आगे बढ़ने वाले लोगों का असली रहस्य क्या है?', options: ['जन्मजात बुद्धि और प्रतिभा', 'रोज़ दस घंटे की कठोर पढ़ाई', 'हर दिन दोहराई गई एक छोटी आदत', 'सही समय पर किया गया एक बड़ा प्रयास'], correct_index: 2, explanation: 'देखो, गद्यांश साफ़ कहता है कि उनका रहस्य कोई बड़ा प्रयास नहीं, बल्कि "एक छोटी-सी आदत, जिसे वे हर दिन बिना नागा दोहराते हैं।"' },
  { kind: 'mcq', id: 'ap-g1-q2', question: 'रोज़ पाँच शब्द सीखने वाला उदाहरण मुख्यतः किस बात को सिद्ध करने के लिए दिया गया है?', options: ['कि अंग्रेज़ी सीखना बहुत कठिन है', 'कि छोटा पर नियमित प्रयास समय के साथ बहुत बड़ा बन जाता है', 'कि रात में पढ़ना सबसे अच्छा है', 'कि एक रात में हज़ार शब्द रट लेना सबसे अच्छा है'], correct_index: 1, explanation: 'पाँच शब्द रोज़ → साल में अठारह सौ से ज़्यादा। लेखक इससे दिखाता है कि छोटा-नियमित प्रयास जुड़कर बहुत बड़ा हो जाता है।' },
  { kind: 'mcq', id: 'ap-g1-q3', question: 'गद्यांश में "बिना नागा" का अर्थ है —', options: ['बिना छोड़े, लगातार', 'बहुत धीरे-धीरे', 'मन लगाकर', 'बिना थके हुए'], correct_index: 0, explanation: '"बिना नागा दोहराना" यानी एक भी दिन छोड़े बिना, लगातार करना।' },
  { kind: 'assertion_reason', id: 'ap-g1-q4', assertion: 'बहुत-से लोग छोटी आदतें बीच में ही छोड़ देते हैं।', reason: 'छोटा काम मामूली लगता है और लोग तुरंत नतीजा चाहते हैं।', correct_index: 0, explanation: 'दोनों कथन सही हैं — और R ही बताता है कि लोग क्यों छोड़ते हैं (काम मामूली लगता है, नतीजा तुरंत चाहिए)। इसलिए R, A की सही व्याख्या है।' },
  { kind: 'mcq', id: 'ap-g1-q5', question: '"आदतें बैंक के ब्याज की तरह होती हैं" — इस तुलना से लेखक का आशय है कि —', options: ['पैसे बचाना पढ़ाई-लिखाई की मेहनत से भी कहीं ज़्यादा उपयोगी है', 'अच्छी आदतें डालना बहुत महँगा पड़ता है', 'हर छोटा प्रयास मामूली लगता है, पर समय के साथ बड़ा बन जाता है', 'बैंक अच्छी आदतों से अधिक सुरक्षित होते हैं'], correct_index: 2, explanation: 'जैसे छोटी-छोटी जमा ब्याज से बड़ी हो जाती है, वैसे ही हर छोटा प्रयास "समय के साथ चुपचाप बड़ा बन जाता है।"' },
  { kind: 'short_answer', id: 'ap-g1-q6', question: 'अपने शब्दों में लिखिए कि बहुत-से लोग छोटी आदतें क्यों छोड़ देते हैं?', model_answer: 'क्योंकि कोई छोटा काम इतना मामूली लगता है कि वे उसे महत्वहीन समझ बैठते हैं, और उन्हें तुरंत नतीजा चाहिए होता है। जब बदलाव जल्दी नहीं दिखता, तो वे धीरज खोकर उसे छोड़ देते हैं।', hint: 'उस अनुच्छेद को देखो जहाँ "लोग उसे छोड़ देते हैं" लिखा है।' },
];

// गद्यांश-2 (case_based, with table) — हरियाली अभियान
const GADYA2 = `पिछले साल एक छोटे क़स्बे के तीन स्कूलों ने मिलकर एक हरियाली अभियान चलाया। हर विद्यार्थी से कहा गया कि वह कम-से-कम एक पौधा लगाए और साल भर उसकी देखभाल करे। साल के अंत में लगाए गए और जीवित बचे पौधों की गिनती की गई, जो नीचे दी गई है।

| स्कूल | लगाए गए पौधे | जीवित बचे पौधे |
|---|---|---|
| स्कूल अ | 200 | 150 |
| स्कूल ब | 180 | 162 |
| स्कूल स | 220 | 110 |

शिक्षकों ने पाया कि जिन स्कूलों में बच्चों ने नियमित रूप से पानी दिया और निराई-गुड़ाई की, वहाँ ज़्यादा पौधे बचे। स्कूल ब में सबसे कम पौधे लगाए गए, फिर भी सबसे ज़्यादा बचे — क्योंकि वहाँ देखभाल सबसे अच्छी थी। स्कूल स में सबसे ज़्यादा पौधे लगे, पर आधे भी न बच सके, क्योंकि लगाने के बाद उन्हें भुला दिया गया।

इस अभियान ने सिखाया कि सिर्फ़ पौधा लगा देना काफ़ी नहीं — असली काम तो उसे पालना है। पेड़ उगाना धीरज और लगातार देखभाल माँगता है, ठीक वैसे ही जैसे कोई अच्छी आदत।`;

const GADYA2_Q = [
  { kind: 'mcq', id: 'ap-g2-q1', question: 'तालिका के अनुसार, किस स्कूल में सबसे अधिक पौधे जीवित बचे?', options: ['स्कूल अ', 'स्कूल स', 'तीनों में बराबर', 'स्कूल ब'], correct_index: 3, explanation: 'तालिका देखो — स्कूल ब में 162 पौधे बचे, जो तीनों में सबसे ज़्यादा हैं।' },
  { kind: 'mcq', id: 'ap-g2-q2', question: 'सबसे अधिक पौधे किस स्कूल ने लगाए थे?', options: ['स्कूल अ ने (200)', 'स्कूल ब ने (180)', 'स्कूल स ने (220)', 'किसी ने भी नहीं'], correct_index: 2, explanation: 'तालिका में स्कूल स ने 220 पौधे लगाए — सबसे अधिक; पर उनकी देखभाल न होने से आधे भी न बचे।' },
  { kind: 'mcq', id: 'ap-g2-q3', question: 'स्कूल ब ने सबसे कम पौधे लगाकर भी सबसे ज़्यादा क्यों बचाए?', options: ['क्योंकि वहाँ की मिट्टी सबसे उपजाऊ थी', 'क्योंकि वहाँ बारिश सबसे ज़्यादा हुई', 'क्योंकि वहाँ पौधों की देखभाल सबसे अच्छी हुई', 'क्योंकि वहाँ पौधे सबसे महँगे थे'], correct_index: 2, explanation: 'गद्यांश कहता है — वहाँ देखभाल सबसे अच्छी थी, इसलिए कम लगाकर भी सबसे ज़्यादा बचे।' },
  { kind: 'assertion_reason', id: 'ap-g2-q4', assertion: 'स्कूल स में लगाए गए आधे पौधे भी जीवित न रह सके।', reason: 'स्कूल स में तीनों में सबसे कम पौधे लगाए गए थे।', correct_index: 2, explanation: 'A सही है (220 में से केवल 110 बचे)। पर R ग़लत है — स्कूल स ने तो सबसे ज़्यादा (220) पौधे लगाए थे, सबसे कम नहीं। इसलिए सही उत्तर है: A सही, पर R ग़लत।' },
  { kind: 'mcq', id: 'ap-g2-q5', question: 'इस अभियान की मुख्य सीख क्या है?', options: ['सिर्फ़ पौधा लगाना नहीं, उसकी लगातार देखभाल करना ज़रूरी है', 'जितने ज़्यादा पौधे लगाओगे, परिणाम उतना ही अच्छा होगा', 'पौधे केवल बड़े स्कूल ही लगा सकते हैं', 'पेड़ लगाना समय की बर्बादी है'], correct_index: 0, explanation: 'अंत में लेखक कहता है — "सिर्फ़ पौधा लगा देना काफ़ी नहीं; असली काम तो उसे पालना है।"' },
  { kind: 'short_answer', id: 'ap-g2-q6', question: 'गद्यांश में पेड़ उगाने की तुलना किससे की गई है, और क्यों?', model_answer: 'पेड़ उगाने की तुलना एक अच्छी आदत डालने से की गई है, क्योंकि दोनों ही धीरज और लगातार देखभाल माँगते हैं — एक बार शुरू कर देना काफ़ी नहीं, उसे निरंतर निभाना पड़ता है।', hint: 'गद्यांश की आख़िरी पंक्ति पढ़ो।' },
];

// गद्यांश-3 (discursive) — समय का महत्व
const GADYA3 = `धन खो जाए तो दोबारा कमाया जा सकता है, पर बीता हुआ समय कभी लौटकर नहीं आता। यही कारण है कि समझदार लोग समय को सबसे बड़ा धन मानते हैं। एक-एक पल बहुमूल्य है, फिर भी हम अकसर उसे यूँ ही बहा देते हैं — कभी आलस में, तो कभी "बाद में कर लेंगे" कहकर।

जो विद्यार्थी रोज़ थोड़ा-थोड़ा पढ़ता है, परीक्षा के समय वह शांत रहता है। पर जो पूरे साल समय गँवाकर अंतिम रात पर सब कुछ छोड़ देता है, वह घबरा जाता है। समय बीत जाने पर पछताने से कुछ नहीं मिलता।

समय का सही उपयोग कोई कठिन काम नहीं। बस हर दिन का एक छोटा-सा ढाँचा बना लो — कब पढ़ना है, कब खेलना है, कब आराम करना है। जब समय बँधा होता है, तो वह हमारा साथ देता है; और जब बिखरा होता है, तो हाथ से रेत की तरह फिसल जाता है। जिसने समय को सँभालना सीख लिया, समझो उसने जीवन की सबसे बड़ी कला सीख ली।`;

const GADYA3_Q = [
  { kind: 'mcq', id: 'ap-g3-q1', question: 'समझदार लोग किसे सबसे बड़ा धन मानते हैं?', options: ['सोने-चाँदी को', 'अच्छी किताबों को', 'सच्चे मित्रों को', 'समय को'], correct_index: 3, explanation: 'गद्यांश कहता है — बीता समय लौटता नहीं, इसलिए समझदार लोग "समय को सबसे बड़ा धन मानते हैं।"' },
  { kind: 'mcq', id: 'ap-g3-q2', question: 'परीक्षा के समय कैसा विद्यार्थी शांत रहता है?', options: ['जो रोज़ थोड़ा-थोड़ा नियमित पढ़ता है', 'जो साल भर खेलता रहता है', 'जो केवल अंतिम रात पढ़ता है', 'जो कभी नहीं पढ़ता'], correct_index: 0, explanation: '"जो रोज़ थोड़ा-थोड़ा पढ़ता है, परीक्षा के समय वह शांत रहता है" — गद्यांश में सीधे लिखा है।' },
  { kind: 'mcq', id: 'ap-g3-q3', question: 'गद्यांश में "बहुमूल्य" शब्द का अर्थ है —', options: ['बहुत भारी', 'बहुत क़ीमती', 'बहुत पुराना', 'बहुत थोड़ा'], correct_index: 1, explanation: '"बहुमूल्य" यानी जिसका मूल्य बहुत हो — बहुत क़ीमती।' },
  { kind: 'mcq', id: 'ap-g3-q4', question: '"समय बँधा हो तो साथ देता है, बिखरा हो तो फिसल जाता है" — इसका आशय है कि —', options: ['समय को रस्सी से बाँधा जा सकता है', 'समय की योजना बनाकर चलने से ही उसका लाभ मिलता है', 'बिखरी चीज़ें ज़्यादा अच्छी होती हैं', 'समय तो कभी भी किसी इंसान का साथ नहीं देता'], correct_index: 1, explanation: '"बँधा समय" यानी योजना-भरा समय; योजना बनाकर चलोगे तो समय का पूरा लाभ मिलेगा, वरना वह फिसल जाएगा।' },
  { kind: 'assertion_reason', id: 'ap-g3-q5', assertion: 'समझदार लोग समय को सबसे बड़ा धन मानते हैं।', reason: 'बीता हुआ समय दोबारा लौटकर कभी नहीं आता।', correct_index: 0, explanation: 'दोनों कथन सही हैं, और R ही A का कारण बताता है — चूँकि समय लौटता नहीं (R), इसीलिए वह सबसे बड़ा धन माना जाता है (A)। R, A की सही व्याख्या है।' },
  { kind: 'short_answer', id: 'ap-g3-q6', question: 'गद्यांश के अनुसार समय का सही उपयोग करने का सरल तरीक़ा क्या है?', model_answer: 'हर दिन का एक छोटा-सा ढाँचा या योजना बना लेना — यह तय कर लेना कि कब पढ़ना है, कब खेलना है और कब आराम करना है। जब समय इस तरह बँधा होता है, तभी वह हमारा साथ देता है।', hint: 'तीसरा अनुच्छेद देखो — "हर दिन का एक छोटा-सा ढाँचा..."।' },
];

// काव्यांश-1 (literary) — नया सवेरा
const KAVYA1 = `रोज़ सुबह जब सूरज आता,
नई किरन एक संदेश है लाता —
बीती बातें भूल यहाँ तू,
फिर से नया सवेरा पा तू।

गिरना-उठना जीवन-राही,
हर ठोकर है कुछ सिखलाती।
मेहनत का जो दामन थामे,
मंज़िल ख़ुद उसके घर आती॥`;

const KAVYA1_Q = [
  { kind: 'mcq', id: 'ap-k1-q1', question: 'सूरज की नई किरन कवि के अनुसार क्या संदेश लाती है?', options: ['कि अब आराम करने का समय है', 'कि दिन बहुत गरम होगा', 'कि अब खेलने का समय है', 'कि बीती बातें भूलकर नई शुरुआत करो'], correct_index: 3, explanation: '"बीती बातें भूल यहाँ तू, फिर से नया सवेरा पा तू" — किरन नई शुरुआत का संदेश देती है।' },
  { kind: 'mcq', id: 'ap-k1-q2', question: '"हर ठोकर है कुछ सिखलाती" पंक्ति का भाव है —', options: ['हर असफलता या कठिनाई से कुछ-न-कुछ सीख मिलती है', 'जीवन के रास्ते में कभी कोई पत्थर नहीं होना चाहिए', 'चलते समय गिरना नहीं चाहिए', 'ठोकर लगना अच्छा शगुन है'], correct_index: 0, explanation: 'कवि कहता है कि जीवन में हर गिरावट/कठिनाई हमें कोई सीख देकर जाती है।' },
  { kind: 'mcq', id: 'ap-k1-q3', question: 'काव्यांश में "राही" शब्द का अर्थ है —', options: ['राजा', 'नदी', 'यात्री/पथिक', 'किसान'], correct_index: 2, explanation: '"राही" यानी राह पर चलने वाला — यात्री या पथिक।' },
  { kind: 'assertion_reason', id: 'ap-k1-q4', assertion: 'यह एक प्रेरक (हौसला बढ़ाने वाली) कविता है।', reason: 'कविता में "सूरज", "किरन" और "राही" जैसे शब्द आए हैं।', correct_index: 1, explanation: 'A सही है — कविता सचमुच हौसला बढ़ाती है। R भी सही है (ये शब्द कविता में हैं)। पर केवल इन शब्दों का होना यह नहीं समझाता कि कविता प्रेरक क्यों है — वह तो उसके भाव (मेहनत, नई शुरुआत) से है। इसलिए दोनों सही, पर R, A की व्याख्या नहीं करता।' },
  { kind: 'short_answer', id: 'ap-k1-q5', question: 'कविता के अनुसार मंज़िल किसके घर ख़ुद चलकर आती है, और यह हमें क्या सिखाता है?', model_answer: 'मंज़िल उसके घर ख़ुद चलकर आती है जो मेहनत का दामन थामे रखता है, यानी जो लगातार परिश्रम करता है। यह सिखाता है कि सफलता परिश्रम से ही मिलती है — उसके पीछे भागना नहीं पड़ता, मेहनत करने पर वह स्वयं मिल जाती है।', hint: 'आख़िरी दो पंक्तियाँ पढ़ो।' },
];

// काव्यांश-2 (literary) — माँ
const KAVYA2 = `माँ की गोदी सबसे प्यारी,
जैसे ठंडी छाँव दुलारी।
थककर जब भी पास मैं आऊँ,
सारी थकन वहीं बिसराऊँ।

बिन बोले मेरी सुन लेती,
आँखों से ही सब कह देती।
उसके जैसा कौन सहारा,
माँ ही तो है जग में न्यारा॥`;

const KAVYA2_Q = [
  { kind: 'mcq', id: 'ap-k2-q1', question: 'कवि ने माँ की गोदी को किसके समान बताया है?', options: ['ऊँचे पहाड़ के', 'बहती नदी के', 'ठंडी छाँव के', 'जलते दीये के'], correct_index: 2, explanation: '"माँ की गोदी सबसे प्यारी, जैसे ठंडी छाँव दुलारी" — गोदी की तुलना ठंडी, स्नेह-भरी छाँव से की गई है।' },
  { kind: 'mcq', id: 'ap-k2-q2', question: '"बिन बोले मेरी सुन लेती, आँखों से ही सब कह देती" का भाव है —', options: ['माँ बहुत कम बोलती है', 'माँ बिना कहे ही बच्चे के मन की बात समझ लेती है', 'माँ को सुनाई कम देता है', 'माँ हमेशा केवल अपनी आँखों से ही बात करती है'], correct_index: 1, explanation: 'इसका भाव है कि माँ और बच्चे के बीच ऐसा गहरा प्रेम है कि बिना शब्दों के भी माँ बच्चे की भावना समझ लेती है।' },
  { kind: 'mcq', id: 'ap-k2-q3', question: 'काव्यांश में "बिसराऊँ" शब्द का अर्थ है —', options: ['सँभाल लूँ', 'याद कर लूँ', 'बढ़ा लूँ', 'भूल जाऊँ'], correct_index: 3, explanation: '"सारी थकन वहीं बिसराऊँ" यानी माँ की गोद में सारी थकान भूल जाऊँ। "बिसराना" = भूलना।' },
  { kind: 'assertion_reason', id: 'ap-k2-q4', assertion: 'कवि के अनुसार माँ बच्चे की बात तभी समझती है जब बच्चा बोलकर बताए।', reason: 'माँ बिना कहे ही, केवल आँखों से, बच्चे के मन की बात समझ लेती है।', correct_index: 3, explanation: 'R सही है — कविता कहती है "बिन बोले मेरी सुन लेती"। पर A ग़लत है, क्योंकि माँ को बताने की ज़रूरत ही नहीं पड़ती। इसलिए: A ग़लत, पर R सही।' },
  { kind: 'short_answer', id: 'ap-k2-q5', question: 'कवि माँ को "जग में न्यारा" (संसार में अनोखा) सहारा क्यों कहता है?', model_answer: 'क्योंकि माँ की गोद में सारी थकान मिट जाती है, और माँ बिना कहे ही बच्चे के मन की बात आँखों से समझ लेती है। ऐसा निःस्वार्थ और समझदार प्रेम किसी और से नहीं मिलता, इसलिए कवि उसे संसार में सबसे अनोखा सहारा कहता है।', hint: 'पूरी कविता में माँ के जो गुण बताए गए हैं, उन्हें जोड़ो।' },
];

// ════════════════════════ PAGES ════════════════════════
function strategyPlusGadya1() {
  let o = 0; const b = [];
  b.push(hero('अपठित बोध — पढ़कर समझना', 'Watercolour 16:5 banner — a calm student reading an open page with a magnifying glass, words gently glowing and lifting off the page, a warm "aha" moment. Dark neutral ground, soft luminous washes, paper grain, Madhubani accent border. No text.'));
  b.push({ id: uid(), type: 'heading', order: o++, level: 1, text: 'अपठित बोध — गद्यांश-काव्यांश का रहस्य' });
  b.push({ id: uid(), type: 'text', order: o++, markdown: 'परीक्षा में एक हिस्सा ऐसा होता है जो तुम्हारी पाठ्यपुस्तक से **बिलकुल नहीं** आता। परीक्षक तुम्हें एक ऐसा गद्यांश या काव्यांश देता है जिसे तुमने **पहले कभी नहीं पढ़ा** — और उस पर प्रश्न पूछता है। इसे **अपठित बोध** कहते हैं, और यह अच्छे-ख़ासे अंक रखता है (खंड "अ", 14 अंक)।\n\nपर घबराने की कोई बात नहीं! इसमें एक ख़ुशख़बरी छिपी है: तुम्हें कुछ **याद** नहीं रखना पड़ता। हर जवाब इन्हीं पंक्तियों में, तुम्हारी आँखों के सामने बैठा होता है। बस ध्यान से पढ़ना है और ढूँढ लेना है।' });
  b.push({ id: uid(), type: 'callout', order: o++, variant: 'india_voice', title: '"अपठित" से डरो मत', markdown: 'अपठित गद्यांश कोई जाल नहीं है। ध्यान से पढ़ने वाले के लिए यह **पूरे पेपर के सबसे आसान अंक** हैं — क्योंकि यहाँ जवाब भाग नहीं सकते। वे इन्हीं पंक्तियों में छिपे होते हैं।' });
  b.push({ id: uid(), type: 'callout', order: o++, variant: 'threads_of_curiosity', title: 'किसी भी अपठित को हल करने के 4 कदम', markdown: '1. **पूरा गद्यांश एक बार शांति से पढ़ो।** हर कठिन शब्द पर मत अटको — पहले पूरी बात का अंदाज़ा लो।\n2. **अब प्रश्न पढ़ो।** अब तुम्हें पता है कि क्या ढूँढना है।\n3. **वापस जाकर हर जवाब पंक्तियों में ढूँढो** और उसके नीचे लाइन खींच दो। गद्यांश ही तुम्हारी "उत्तर-कुंजी" है।\n4. **जवाब गद्यांश से लिखो, अपने मन से नहीं।** भले तुम असहमत हो, वही लिखो जो गद्यांश कहता है। अपनी राय मत जोड़ो।' });
  b.push({ id: uid(), type: 'heading', order: o++, level: 2, text: 'चलो, पहला गद्यांश आज़माते हैं' });
  b.push({ id: uid(), type: 'text', order: o++, markdown: 'नीचे एक गद्यांश दिया है। इसे ठीक वैसे ही पढ़ो जैसे अभी सीखा — **पहले पूरा, फिर जवाब।** कोई जल्दी नहीं।' });
  b.push({ id: uid(), type: 'reading_comprehension', order: o++, lang: 'hindi', passage_type: 'discursive', title: 'छोटी आदतें, बड़ा बदलाव', intro: 'गद्यांश को ध्यान से पढ़िए, फिर प्रश्नों के उत्तर दीजिए। याद रखो — हर जवाब इसी गद्यांश के अंदर है।', passage: GADYA1, numbered: true, word_count: 190, questions: GADYA1_Q });
  return b;
}

function passagePage(opts) {
  let o = 0; const b = [];
  b.push(hero(opts.alt, opts.prompt));
  b.push({ id: uid(), type: 'heading', order: o++, level: 1, text: opts.pageHeading });
  if (opts.lead) b.push({ id: uid(), type: 'text', order: o++, markdown: opts.lead });
  if (opts.tip) b.push({ id: uid(), type: 'callout', order: o++, variant: 'threads_of_curiosity', title: opts.tip.title, markdown: opts.tip.body });
  b.push({ id: uid(), type: 'reading_comprehension', order: o++, lang: 'hindi', passage_type: opts.passage_type, title: opts.title, intro: opts.intro, passage: opts.passage, numbered: opts.numbered, word_count: opts.word_count, questions: opts.questions });
  return b;
}

const PAGES = [
  { slug: 'apathit-rananeeti-gadyansh-1', title: 'अपठित बोध — रणनीति और पहला गद्यांश', subtitle: 'जवाब इन्हीं पंक्तियों में छिपा है', blocks: strategyPlusGadya1() },
  { slug: 'apathit-gadyansh-2-case', title: 'अपठित गद्यांश-2 — तालिका के साथ', subtitle: 'शब्दों के साथ-साथ तालिका भी ध्यान से पढ़ो', blocks: passagePage({
      alt: 'हरियाली अभियान', prompt: 'Watercolour 16:5 banner — schoolchildren planting and watering saplings in a row, a small chalk tally-chart beside them, hopeful green shoots. Dark warm ground, luminous washes, paper grain, folk-art border. No text.',
      pageHeading: 'अपठित गद्यांश — एक तालिका के साथ', lead: 'इस बार गद्यांश में कुछ **आँकड़े** हैं — एक छोटी तालिका। ऐसे प्रश्न संख्याओं से प्यार करते हैं, इसलिए तालिका को भी शब्दों जितने ध्यान से पढ़ो।',
      tip: { title: 'तालिका पढ़ने का मंत्र', body: 'पहले देखो तालिका किस-किस चीज़ की गिनती दिखा रही है (यहाँ — कौन-से स्कूल, कितने पौधे लगे, कितने बचे)। फिर हर पंक्ति को आपस में मिलाकर देखो — सबसे ज़्यादा कौन, सबसे कम कौन। आधे जवाब तो इसी से मिल जाएँगे।' },
      passage_type: 'case_based', title: 'तीन स्कूलों का हरियाली अभियान', intro: 'गद्यांश और तालिका — दोनों पढ़कर उत्तर दीजिए। तालिका में भी जवाब छिपे हैं।', passage: GADYA2, numbered: true, word_count: 170, questions: GADYA2_Q }) },
  { slug: 'apathit-kavyansh-1', title: 'अपठित काव्यांश-1', subtitle: 'कविता का केंद्रीय भाव पकड़ो', blocks: passagePage({
      alt: 'नया सवेरा', prompt: 'Watercolour 16:5 banner — a rising sun spilling golden rays over a quiet path, a lone traveller stepping forward with hope, dew on grass. Dark warm ground, luminous washes, paper grain, folk-art accent. No text.',
      pageHeading: 'अपठित काव्यांश — कविता को समझना', lead: 'अब एक **काव्यांश** (कविता का अंश)। कविता में हर शब्द का अर्थ रटने की ज़रूरत नहीं — बस उसका **केंद्रीय भाव** (मुख्य बात) पकड़ो: कवि क्या कहना चाहता है?',
      tip: { title: 'काव्यांश कैसे पढ़ें', body: 'कविता को **दो बार** पढ़ो — पहली बार लय के लिए, दूसरी बार अर्थ के लिए। ख़ुद से पूछो: "कवि किस भाव की बात कर रहा है — उम्मीद, मेहनत, प्रेम?" वही भाव अधिकतर प्रश्नों का जवाब होता है।' },
      passage_type: 'literary', title: 'नया सवेरा', intro: 'काव्यांश को दो बार पढ़िए — पहले लय के लिए, फिर अर्थ के लिए — और प्रश्नों के उत्तर दीजिए।', passage: KAVYA1, numbered: false, word_count: 40, questions: KAVYA1_Q }) },
  { slug: 'apathit-gadyansh-3', title: 'अपठित गद्यांश-3 — समय', subtitle: 'मुख्य भाव और शब्दार्थ पर ध्यान', blocks: passagePage({
      alt: 'समय का महत्व', prompt: 'Watercolour 16:5 banner — an hourglass with golden sand beside an open study book and a small daily-routine planner, warm focused light. Dark neutral ground, luminous washes, paper grain, folk-art border. No text.',
      pageHeading: 'अपठित गद्यांश — समय का धन', lead: 'एक और गद्यांश। याद रखो — पहले पूरा पढ़ो, फिर प्रश्न देखो, फिर पंक्तियों में जवाब ढूँढो।',
      passage_type: 'discursive', title: 'समय सबसे बड़ा धन', intro: 'गद्यांश को ध्यान से पढ़िए, फिर उत्तर दीजिए। हर जवाब इन्हीं पंक्तियों में है।', passage: GADYA3, numbered: true, word_count: 180, questions: GADYA3_Q }) },
  { slug: 'apathit-kavyansh-2', title: 'अपठित काव्यांश-2 — माँ', subtitle: 'भाव और प्रतीक पहचानो', blocks: passagePage({
      alt: 'माँ का प्यार', prompt: 'Watercolour 16:5 banner — a child resting peacefully in a mother’s lap under soft shade, warm tender light, a sense of calm. Dark warm ground, luminous washes, paper grain, folk-art accent. No text.',
      pageHeading: 'अपठित काव्यांश — माँ', lead: 'अंतिम अभ्यास — माँ के स्नेह पर एक काव्यांश। केंद्रीय भाव पकड़ो और शब्दों के अर्थ संदर्भ से समझो।',
      passage_type: 'literary', title: 'माँ', intro: 'काव्यांश को दो बार पढ़िए और प्रश्नों के उत्तर दीजिए।', passage: KAVYA2, numbered: false, word_count: 38, questions: KAVYA2_Q }) },
];

// ════════════════════════ INSERT ════════════════════════
(async () => {
  const rollback = process.argv.includes('--rollback');
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const db = c.db('crucible');
  const books = db.collection('books');
  const pages = db.collection('book_pages');
  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error(`Book ${BOOK_SLUG} not found`);
  const bookId = String(book._id);

  if (rollback) {
    const slugs = PAGES.map((p) => p.slug);
    const existing = await pages.find({ book_id: bookId, slug: { $in: slugs } }).toArray();
    if (existing.length) await pages.deleteMany({ _id: { $in: existing.map((e) => e._id) } });
    await books.updateOne({ _id: book._id }, { $pull: { chapters: { number: CHAPTER } } });
    console.log(`Rolled back: removed ${existing.length} अपठित pages and chapter ${CHAPTER}.`);
    await c.close(); return;
  }

  const contentTypes = (blocks) => [...new Set(blocks.map((b) => b.type))];
  const pageIds = [];
  for (let i = 0; i < PAGES.length; i++) {
    const def = PAGES[i];
    const existing = await pages.findOne({ book_id: bookId, slug: def.slug });
    const _id = existing ? existing._id : uid();
    pageIds.push(_id);
    const doc = {
      _id, book_id: bookId, chapter_number: CHAPTER, page_number: i + 1,
      slug: def.slug, title: def.title, subtitle: def.subtitle,
      blocks: def.blocks, hinglish_blocks: existing?.hinglish_blocks ?? [],
      tags: ['ganga_chapter:13', 'ganga_section:apathit_bodh'],
      published: false, reading_time_min: 7, content_types: contentTypes(def.blocks), updated_at: new Date(),
    };
    if (existing) { await pages.updateOne({ _id }, { $set: doc }); console.log(`  ✓ Updated ${def.slug}`); }
    else { doc.created_at = new Date(); await pages.insertOne(doc); console.log(`  ✓ Inserted ${def.slug} (${def.blocks.length} blocks)`); }
  }

  const chapterEntry = { number: CHAPTER, title: 'अपठित बोध — पठन अभ्यास', slug: 'apathit-bodh', page_ids: pageIds, is_published: false };
  const hasChapter = (book.chapters || []).some((ch) => ch.number === CHAPTER);
  if (hasChapter) { await books.updateOne({ _id: book._id, 'chapters.number': CHAPTER }, { $set: { 'chapters.$': chapterEntry } }); console.log(`✓ Updated chapter ${CHAPTER} (${pageIds.length} pages).`); }
  else { await books.updateOne({ _id: book._id }, { $push: { chapters: chapterEntry } }); console.log(`✓ Added chapter ${CHAPTER} "अपठित बोध" with ${pageIds.length} pages.`); }
  await c.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
