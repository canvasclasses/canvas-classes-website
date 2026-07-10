# Chapter 3 review — संवादहीन (शेखर जोशी)

PDF confirmed: `ihga103.pdf` IS Chapter 3 "संवादहीन" by शेखर जोशी (ताई, मिट्टू, जगन मास्टर, गनपत, मास्टराइन; pp.45–56). Story content, author bio, and the अभ्यास families (रचना से संवाद / विधा से संवाद / विषयों से संवाद / सृजन) all match the corpus.

SUMMARY: The teaching surfaces are strong — narrated passages are verbatim-faithful to the NCERT text, the triple-bridge vocabulary is rich and well-glossed, the अलंकार/कहानी-का-सौंदर्य table mirrors NCERT's own, and the reasoning prompts stay genuinely open. But the graded `chapter_practice` bank contains **two answer-key bugs that will actively mis-mark a student who read the chapter** (h3-pr-21 and h3-pr-23 both have a `correct_index` that contradicts their own explanation and the chapter), which is the single most damaging class of defect a parent/teacher will catch. Secondary systemic weaknesses: the practice-page intro text and the `chapter_practice.intro` are **cloned boilerplate across ch2–ch12** (confirmed verbatim against ch2/ch4/ch5), one factual gloss/bio overreach, and a handful of distractors that are either implausible throwaways or defensible-as-correct. Answer-position balance and length-tells in the graded bank are clean.

TOP 5 MOST IMPORTANT FINDINGS (ranked):
1. **[CRITICAL]** h3-pr-21 (page ch3-abhyas, chapter_practice): marked answer (`correct_index:1` = "वह किसी से बात करना ही नहीं चाहती थी") is factually false and is contradicted by its own explanation, which describes option 0. A student who understood the story is marked wrong.
2. **[CRITICAL]** h3-pr-23 (page ch3-abhyas, chapter_practice): marked answer (`correct_index:2` = "बड़े परिवार हमेशा बुरे होते हैं") is wrong; the explanation describes option 0 ("व्यस्तता में अपनों को समय न देना…"). The keyed option is the opposite of the chapter's message.
3. **[MAJOR]** Cloned boilerplate: the ch3-abhyas intro ("अब अभ्यास का समय। पहले बहुविकल्पी प्रश्न…") and `chapter_practice.intro` ("सही उत्तर चुनिए और कारण समझिए।") are byte-identical across ch2, ch4, ch5 (and the whole book) — machine-stamped, flagged in the task.
4. **[MAJOR]** h3-pr-19 / reasoning-prompt (page ch3-vishayon / ch3-abhyas): the "मास्टराइन has no name = स्त्री की मिटती पहचान" reading is asserted as the answer, but NCERT's own exercise poses it as an **open question** ("लेखक ने ऐसा क्यों किया होगा?"). Hardening one interpretation into a keyed MCQ violates the "no single correct interpretation" bar.
5. **[MAJOR]** meet_a_scientist bio overreach: "मैथिलीशरण गुप्त सम्मान" — the PDF says **"श्रीलाल शुक्ल स्मृति इफको साहित्य पुरस्कार"**, not a Maithilisharan Gupt award; the corpus invented/swapped an award the source does not list.

---

FULL FINDINGS BY DIMENSION:

## A. Source fidelity
[MAJOR] PAGE ch3-parichay-shekhar-joshi › block#2/meet_a_scientist — fabricated award not in source. The PDF bio (p.45) lists three honours: "महावीर प्रसाद द्विवेदी पुरस्कार", "साहित्य भूषण सम्मान", and "श्रीलाल शुक्ल स्मृति इफको साहित्य पुरस्कार". The corpus writes a different third award. — EVIDENCE: `"fun_detail": "...\"मैथिलीशरण गुप्त सम्मान\" से सम्मानित किया गया।"` — FIX: replace "मैथिलीशरण गुप्त सम्मान" with "श्रीलाल शुक्ल स्मृति इफको साहित्य पुरस्कार" per the source.

[MINOR] PAGE ch3-parichay › block#2/meet_a_scientist — `contribution` lists "हलवाहा" and "मेरा पहाड़" but the PDF prints the work titles as "हलवाहा, नौरंगी बीमारी है, आदमी का डर, डांगरी वाले, मेरा पहाड़ (कहानी संग्रह), एक पेड़ की याद (शब्दचित्र-संग्रह), स्मृति में रहें वे (संस्मरण), न रोको उन्हें शुभा (कविता संग्रह), मेरा ओलिया गाँव (आत्मवृत्त)". The corpus's "साथ के लोग, दाज्यू, हलवाहा, मेरा पहाड़ आदि" is a loose subset — acceptable as a sample, but "दाज्यू" is a single story, not listed among the संग्रह titles on this page. — EVIDENCE: `"...अन्य रचनाएँ — साथ के लोग, दाज्यू, हलवाहा, मेरा पहाड़ आदि।"` — FIX: align the sample list to the titles the PDF actually prints.

[CLEAN — narrated passages] All three `narrated_passage` blocks (ch3-kahani-bhag-1/2/3) are **verbatim** against the PDF (pp.46–51): e.g. "गहरी साँस लेकर ताई कहतीं, 'भगवान! कैसे नैया पार लगेगी?'…" (p.46), "जगन मास्टर दूसरे मिजाज के आदमी थे। स्वतंत्र विचारों के आदमी थे।" (p.49), "ताई अपने मिट्टू को गुहार कर थक गईं लेकिन उनके सूनेपन का साथी न जाने किन अमराइयों में घूम रहा होगा।" (p.51). No silent simplification detected.

## B. Pedagogical depth & scaffolding
[MINOR] PAGE ch3-shabd-sampada › block#2/vocabulary_lab — three cards (कुशाग्र, निहाल, रोबीला, तुनकमिजाज) are drawn from the ताई-reminisces paragraph that describes the **ज़मींदार**, not the core ताई–मिट्टू line; they are real chapter words (good) but the `example` for तुनकमिजाज ("ज़मींदार साहब बड़े तुनकमिजाज थे") and रोबीला ("ज़मींदार साहब का रोबीला चेहरा") lean on a character the reader meets only in one passing sentence — mild context thinness, not an error. — FIX: optionally swap to examples the reader has stronger footing in.

[MINOR] PAGE ch3-kahani-bhag-1 › block#3 gloss "मोह" glossed as "लगाव, ममता — attachment" — fine, but "ममता" is itself glossed elsewhere as "माँ का स्नेह"; using ममता inside the gloss for मोह slightly muddies the two. — FIX: gloss मोह as "लगाव — attachment" only.

[CLEAN — reasoning prompts] The interpretive prompts (ch3-kahani-bhag-1 block#7, bhag-2 block#5, bhag-3 block#4, ch3-patra-bhav block#6) are genuinely open and text-anchored (आदर्श vs यथार्थ, the "मर जा!" खीझ reading). Good higher-order work.

## C. Assessment integrity
[CRITICAL] PAGE ch3-abhyas › block#2/chapter_practice (id h3-pr-21) — **mis-keyed**. Stem: "कहानी का शीर्षक 'संवादहीन' होना ताई के जीवन के बारे में क्या कहता है?" Marked `correct_index:1` = "वह किसी से बात करना ही नहीं चाहती थी" — which is FALSE (ताई craves संवाद). The explanation describes option 0 instead. — EVIDENCE: `"correct_index": 1 … "explanation": "...अपनों के बीच भी सच्ची बातचीत का अभाव — ताई का अकेलापन।"` (option 0 = "भरे-पूरे घर में भी वह सच्चे संवाद को तरस गई"). — FIX: set `correct_index: 0`.

[CRITICAL] PAGE ch3-abhyas › block#2/chapter_practice (id h3-pr-23) — **mis-keyed**. Stem: "कहानी आज के 'एकल परिवार' और बुज़ुर्गों के बारे में क्या चेतावनी देती है?" Marked `correct_index:2` = "बड़े परिवार हमेशा बुरे होते हैं" — a throwaway-false option; the explanation describes option 0. — EVIDENCE: `"correct_index": 2 … "explanation": "...रिश्ते समय और सच्चे संवाद से ही जीवित रहते हैं।"` (option 0 = "व्यस्तता में अपनों को समय न देना अकेलापन पैदा करता है"). — FIX: set `correct_index: 0`.

[MAJOR] PAGE ch3-abhyas › block#2/chapter_practice (id h3-pr-04) — ambiguous distractor defensible as correct. Stem "जगन मास्टर ने मिट्टू का पिंजरा क्यों खोला?" Option (घ) "ताई के कहने पर" is the only fully-wrong one; but the marked answer "स्वतंत्रता देने के आदर्श से" and the explanation also invoke प्रायश्चित, while the chapter shows the trigger is "मिट्टू की यातना असह्य हो गई" — a thinking student could argue from compassion (करुणा), which is folded into the *interpretation* item h3-pr-16's correct answer ("करुणा और आज़ादी का आदर्श"). The two items partly contradict on what the "real" reason is. — FIX: make h3-pr-04 unambiguous (e.g. distractor set without an overlapping correct reading) or align the framing with h3-pr-16.

[MAJOR] PAGE ch3-vishayon-se-samvad › block#6/reasoning_prompt AND ch3-abhyas (h3-pr-19) — the same "मास्टराइन = erased female identity" reading appears as (a) an open reasoning_prompt (correct) and (b) a keyed single-answer MCQ + inline_quiz (ch3-vishayon block#7 q3). NCERT itself frames this as open ("आपके अनुसार... ऐसा क्यों किया गया होगा?"). Keying it as one correct answer marks a student who reads it differently (e.g. "to keep focus on ताई") as wrong. — EVIDENCE: h3-pr-19 `correct_index:0` "स्त्री की पहचान परिवार में खो जाना" presented as the only right reading. — FIX: keep it as reasoning/discussion; if it must be an MCQ, test the literal fact (she has no name) rather than the contested interpretation.

[MINOR] PAGE ch3-abhyas › h3-pr-23 distractor "बुज़ुर्गों को पक्षी पाल लेने चाहिए" and h3-pr-17 "कि पंछी कभी पालने ही नहीं चाहिए" — throwaway options no half-reader would pick; weakens the "every distractor is a real mistake" bar (§5.12.1 B.1). — FIX: replace with plausible near-misses.

[MINOR] PAGE ch3-kahani-bhag-1 › block#8/inline_quiz q1 distractors "जगन मास्टर ख़ुद", "मास्टराइन" for "मिट्टू को कौन लाया?" — defensible because both characters do appear; acceptable near-misses. Noting as borderline-good, not a fault.

[CLEAN — position/length] chapter_practice answer-position counts A/B/C/D = 7/6/6/5 of 24 (max 29%, none 0%) — passes §5.12.1 rule 4. No obvious correct-is-longest tell in the graded bank.

## D. AI-slop / authenticity
[MAJOR] Cross-chapter formulaic uniformity (named in task). The practice-page lead text and the graded-bank intro are cloned book-wide. — EVIDENCE: ch3 `"markdown": "अब अभ्यास का समय। पहले बहुविकल्पी प्रश्न (हर प्रश्न के साथ **कारण**) हल कीजिए, फिर रचनात्मक चुनौतियाँ…"` is byte-identical in ch2/ch4/ch5; `chapter_practice.intro: "सही उत्तर चुनिए और कारण समझिए।"` identical in ch2/ch3/ch4. — FIX: give each chapter a story-specific intro (e.g. name ताई/मिट्टू) so the practice page isn't machine-stamped.

[MINOR] PAGE ch3-kahani-bhag-2 › block#2 hinglish_commentary "हर आदर्श का असली जीवन में नतीजा वैसा ही अच्छा हो, ज़रूरी नहीं।" — slightly preachy "moral handed down" tone; the reasoning_prompt below already makes the point better. — FIX: trim the commentary to a context nudge, not the lesson.

[CLEAN] No banned-word tells ("delve/crucial/realm"), no "not X but Y" English slop pattern, no patronising "क्या यह प्रेरणादायक नहीं थी?" closers — pages close with inline_quiz as required.

## E. Literary & linguistic accuracy
[MAJOR] PAGE ch3-kahani-ka-saundarya › block#2/literary_devices_highlighter (id 5f18a3dc, device `hyperbole`) — **mis-labelled device**. "कैसे नैया पार लगेगी" is marked `hyperbole` (अतिशयोक्ति), but the explanation itself calls it a "बड़े रूपक" (metaphor) and it is in fact a **मुहावरा / रूपक**, not अतिशयोक्ति. Meanwhile the NCERT सौंदर्य table on the SAME concept lists a *different*, correct अतिशयोक्ति example ("रेलगाड़ी में उसका भी टिकट लगेगा"). The highlighter's अतिशयोक्ति tag is on the wrong line. — EVIDENCE: `"device": "hyperbole", "matches":[{"text":"कैसे नैया पार लगेगी","explanation":"...\"नैया पार लगना\" जैसे बड़े रूपक से..."}]` — FIX: retag this span as metaphor/मुहावरा (or drop it) and, if अतिशयोक्ति is wanted in the highlighter, use the टिकट line the table already cites.

[MINOR] PAGE ch3-shabd-sampada › block#2 card "वियोग" pronunciation "vi-yog" but block#3 card "वियोग" pronunciation "ve-yog" — same word transliterated two different ways within one page. Per §12 it should be "vi-yog". — EVIDENCE: card id feecd037 `"vi-yog"` vs card id 071bda85 `"ve-yog"`. — FIX: standardise to "vi-yog"; also वियोग is duplicated (two cards) — dedupe.

[MINOR] PAGE ch3-srijan-vyakaran › block#6 (h3-gr-07) treats "अपने मुँह मियाँ मिट्ठू बनना" as a chapter idiom, but this मुहावरा does NOT appear in the संवादहीन text — it's a themed add-on. Defensible (it puns on मिट्ठू/तोता) but presented as if from the पाठ. — FIX: label it as a related/themed idiom, not implied chapter content.

[CLEAN] मात्रा/नुक़्ता usage (ख़ुद, ज़ोर, फ़सल, बग़ीचा) correct and matches the source register; scaffold-flip (simple-Hindi — English) honoured on every gloss and vocab card; `lang:"hindi"` set on all vocab/highlighter blocks.

## F. Completeness & consistency
[MINOR] PAGE ch3-patra-bhav › block#4/tone_meter segment 3 excerpt "विदा के दिन ताई की आँसुओं की धार रुके न रुकती।" — this is a light paraphrase; the PDF (p.48) reads "विदा के दिन ताई की आँसुओं की धार रुके नहीं रुकती थी।" tone_meter `excerpt` fields should be verbatim like narrated passages. — FIX: quote the source line exactly.

[MINOR] PAGE ch3-srijan-vyakaran — the §8 idioms floor (≥8 मुहावरे on a dedicated idioms page with a self_check) is not met for this chapter: idioms are scattered (नैया पार लगना, हाथ पीले करना, पौ फटना, तिरछी आँख से, अपने मुँह मियाँ मिट्ठू) as story glosses + one apply_express item, with no idiom-mode vocabulary_lab. Acceptable for a 10-page प्रोज़ chapter but below the workflow's stated floor. — FIX: add an idioms `vocabulary_lab(mode:"idioms")` or relax the floor for short stories explicitly.

[CLEAN] 10 pages (≤11), every page opens with a hero `image` and closes with a 3-question `inline_quiz` (स्मरण→समझ→व्याख्या), all `audio_url` empty (TTS-first), graded bank has 24 Qs with all five concept_tags present and difficulty 1–5 spread. भाषा संगम table present.

STATS: pages reviewed=10, critical=2, major=5, minor=12
