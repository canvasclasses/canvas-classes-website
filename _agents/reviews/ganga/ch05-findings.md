# Chapter 5 review — आखिरी चट्टान तक (मोहन राकेश, यात्रा-वृत्तांत)

PDF CONFIRMED: source `ihga105.pdf` is Chapter 5 "आखिरी चट्टान तक" by मोहन राकेश — matches the corpus title, author, place (कन्याकुमारी) and content. No mismatch.

SUMMARY: The chapter is competently built and the vocabulary surfaces (triple-bridge cards, शब्द-संपदा coverage, idiom-free travelogue handled well) are largely faithful to NCERT's printed शब्द-संपदा list. But two systemic problems pull it down. (1) **The single `narrated_passage` that is supposed to carry प्रेमचंद-style verbatim text is NOT verbatim** — it is a rewritten, abridged paraphrase of मोहन राकेश's prose, and the material it silently dropped is exactly the passage NCERT's own exercise Q2 ("मैं कुछ देर भूला रहा कि मैं मैं ही हूँ") is built on. For a literary Live Book whose first rule is "the original text is sacred," this is the gravest fault. (2) **Two graded `chapter_practice` MCQs are mis-keyed** — `correct_index` points at a wrong option while the explanation describes a different (correct) option, so a student who reads the chapter and answers correctly is marked WRONG. The single biggest systemic weakness is that the "reading" pages never present राकेश's actual sentences — they present a teacher's retelling dressed as the text — so the chapter teaches *about* the travelogue without ever letting the student read it.

TOP 5 MOST IMPORTANT FINDINGS (ranked):
1. [CRITICAL] h5-pr-21 is mis-keyed: `correct_index: 1` selects "उसे थकान का बिलकुल पता नहीं चलता" but the explanation praises option 0 ("जिज्ञासा और दृढ़ता"). A correct answer is marked wrong.
2. [CRITICAL] h5-pr-23 is mis-keyed: `correct_index: 2` selects "भाव लिखना अनिवार्य नियम है" but the explanation describes option 0 ("पाठक यात्रा को आँखों से देखे और मन से महसूस करे"). A correct answer is marked wrong.
3. [CRITICAL] The PAGE 2 `narrated_passage` is a paraphrase, not राकेश's verbatim text — it rewrites the opening and DROPS the "एक जीवित व्यक्ति… मैं कुछ देर भूला रहा कि मैं मैं ही हूँ" passage that NCERT exercise Q2 directly tests.
4. [MAJOR] hyperbole (अतिशयोक्ति) is mis-assigned to "शक्ति का विस्तार, विस्तार की शक्ति" in the devices highlighter and inline quiz — that line is not exaggeration; it is a balanced/chiasmus phrase about vastness.
5. [MAJOR] `chapter_practice` intro "सही उत्तर चुनिए और कारण समझिए।" is byte-identical across ch02–ch12 (cloned boilerplate, verified).

---

## A. Source fidelity

[CRITICAL] PAGE 2 (ch5-yatra-bhag-1) › block #3 / narrated_passage — The "narrated passage" is a rewritten abridgement of राकेश's prose, not the verbatim original the workflow mandates (§5.1, §13 "All narrated_passage text matches NCERT verbatim — no rephrasing, no shortening"). The PDF (p.85) reads: *"केप होटल के आगे बने बाथ टैंक के बाईं तरफ़, समुद्र के अंदर से उभरी स्याह चट्टानों में से एक पर खड़ा होकर मैं देर तक भारत के स्थल-भाग की आखिरी चट्टान को देखता रहा। पृष्ठभूमि में कन्याकुमारी के मंदिर की लाल और सफेद लकीरें चमक रही थीं। अरब सागर, हिंद महासागर और बंगाल की खाड़ी—…"* The corpus collapses and reworders this into — EVIDENCE: `"text": "अरब सागर, हिंद महासागर और बंगाल की खाड़ी— इन तीनों के संगम-स्थल-सी वह चट्टान, जिस पर कभी स्वामी विवेकानंद ने समाधि लगाई थी, हर तरफ़ से पानी की मार सहती हुई स्वयं भी समाधिस्थ-सी लग रही थी।"` (the original sentence does not contain "इन तीनों के संगम-स्थल-सी" — that is authored). — FIX: replace the entire narrated passage with राकेश's exact sentences from p.85 (verbatim), keeping the glosses; do not paraphrase.

[CRITICAL] PAGE 2 › block #3 / narrated_passage — The original passage that the NCERT exercise turns on is OMITTED entirely. PDF p.85: *"तीनों ओर के क्षितिज को आँखों में समेटता मैं कुछ देर भूला रहा कि मैं मैं ही हूँ, एक जीवित व्यक्ति, दूर से आया यात्री, एक दर्शक। उस दृश्य के बीच में जैसे दृश्य का एक हिस्सा बनकर खड़ा रहा—"* NCERT exercise (p.90, मेरे उत्तर मेरे तर्क Q2) asks: *"मैं कुछ देर भूला रहा कि मैं मैं ही हूँ" यह कथन लेखक की किस मन:स्थिति को दर्शाता है?* — the corpus never shows the student this line anywhere in the reading. EVIDENCE: block #3 jumps straight from "शक्ति का विस्तार, विस्तार की शक्ति" to PAGE 3's sand-hill beat; the "भूला रहा कि मैं मैं ही हूँ" sentence appears in NO block. — FIX: restore this sentence into the narrated passage; without it the chapter cannot prepare the NCERT Q2 it claims to map to.

[MAJOR] PAGE 4 (ch5-yatra-bhag-3) › block #2 / narrated_passage — abridged again. PDF p.89 gives a richer source ("हम आठ आदमी… चार मल्लाह थे जो एक छोटी-सी मछुआ नाव में हमें वहाँ लाए थे। नाव क्या थी, रबड़ पेड़ के तीन तनों को साथ-साथ जोड़ लिया गया था…"); the corpus compresses to one line and drops the boat-of-tied-logs detail that its OWN page-4 image prompt ("a small fishing boat of tied logs") depends on. EVIDENCE: `"text": "सूर्योदय। हम आठ आदमी \"विवेकानंद चट्टान\" पर बैठे थे, जहाँ बंगाल की खाड़ी की भौगोलिक सीमा समाप्त होती है।"` then jumps to the graduate-youth line. — FIX: present राकेश's paragraph verbatim; the dropped detail is both literary and load-bearing for the illustration.

[MINOR] PAGE 1 › block #2 / meet_a_scientist — author bio is accurate against the PDF परिचय (जन्म 1925 अमृतसर; निधन 1972, 48 वर्ष; आषाढ़ का एक दिन → संगीत नाटक अकादमी; सारिका संपादन). "1925–1972" and the Sahitya/Sangeet Natak detail all check out. Clean on fact; flagged only to confirm it was verified, not assumed.

[clean] No invented characters or fabricated plot points. "विवेकानंद ने समाधि लगाई" is faithful (PDF p.85 says exactly this). Population "आठ हज़ार की आबादी" is dropped but not contradicted.

## B. Pedagogical depth & scaffolding

[MAJOR] PAGE 5 (ch5-shabd-sampada) › block #2 / vocabulary_lab — card "बेकारी" duplicates the PAGE 1 pre-teach card (same word, same meaning "बेरोज़गारी / unemployment"), and "चट्टान" / "विस्तार" / "भव्यता" are everyday or already-glossed words being recounted as new शब्द-संपदा. The §5.2 protocol says cards must come from NCERT's printed शब्द-संपदा list (p.99) and not pad with words the student already owns. "चट्टान" (= शिला) is on NCERT's list, so defensible, but "विस्तार"/"भव्यता" are author-added everyday words. EVIDENCE: `"word": "चट्टान" … "meaning": "बड़ी शिला"` listed as a vocabulary card. — FIX: drop the everyday duplicates; NCERT's list has richer untapped words (कडल-काक = a bird species, बाइनाक्यूलर्ज़) that are absent from the cards.

[MAJOR] शब्द-संपदा omission — NCERT's printed glossary (p.99) lists **कडल-काक** ("पक्षियों की एक प्रजाति") and **बाइनाक्यूलर्ज़** ("दूरबीन, द्विनेत्री"); both appear in the text ("बहुत-से कडल-काक हमारे आस-पास तैर रहे थे"; "अपने बाइनाक्यूलर्ज़ से सूर्य-दर्शन") yet neither is a vocabulary card or gloss. The §8 floor requires harvesting NCERT's own list. EVIDENCE: no card with `"word": "कडल-काक"` or `"बाइनाक्यूलर्ज़"` anywhere in PAGE 5. — FIX: add both as cards; they are exactly the देशज/borrowed words the track exists to unlock.

[MINOR] §8 quantitative floor — the chapter ships ~28 distinct vocabulary cards (8 pre-teach + ~20 शब्द-संपदा) plus passage glosses. The §8 floor is "≥40 vocabulary words" and "≥8 मुहावरे." This is a travelogue with essentially no idioms (NCERT prints none), so the idiom floor is genuinely N/A — but the word count is short of 40. EVIDENCE: PAGE 1 block #5 (8 cards) + PAGE 5 blocks #2/#3 (~20 cards). — FIX: top up from the passage (अनाम, सार्थकता, सिहरन etc. are glossed but several शब्द-संपदा words like सुरमई, अर्घ्य, सिर धुनना are present; add कडल-काक, बाइनाक्यूलर्ज़, झुरमुट's neighbours) to reach the floor honestly.

[clean] Glosses inside the passages are pitched correctly (तत्सम/literary words only — स्याह, बलखाती, समाधिस्थ, चेतना, भौगोलिक — not everyday words). Reasoning prompts on pages 2/3/4 are genuinely interpretive and open (क्षणभंगुरता, आदर्श-यथार्थ द्वंद्व), not recall in disguise.

## C. Assessment integrity

[CRITICAL] PAGE 9 (ch5-abhyas) › block #2 / chapter_practice / h5-pr-21 — mis-keyed answer marks a correct student wrong. EVIDENCE: options are `["अंत तक देखने-जानने की गहरी जिज्ञासा और दृढ़ता", "उसे थकान का बिलकुल पता नहीं चलता", "वह बहुत डरपोक था", "उसे समुद्र पसंद नहीं था"]`, `"correct_index": 1`, `"explanation": "\"आखिरी चट्टान तक\" जाने की ज़िद यात्री की जिज्ञासा और संकल्प दिखाती है।"` — the explanation describes option 0, not option 1. — FIX: set `correct_index: 0`.

[CRITICAL] PAGE 9 › block #2 / chapter_practice / h5-pr-23 — mis-keyed answer. EVIDENCE: options are `["ताकि पाठक यात्रा को आँखों से देखे और मन से महसूस करे", "क्योंकि दृश्य याद नहीं रहते", "भाव लिखना अनिवार्य नियम है", "इससे लेख छोटा हो जाता है"]`, `"correct_index": 2`, `"explanation": "दृश्य + भीतरी अनुभव का मेल ही यात्रा-वृत्तांत को जीवंत और आत्मीय बनाता है।"` — the explanation describes option 0; option 2 ("भाव लिखना अनिवार्य नियम है") is in fact a wrong/throwaway answer. — FIX: set `correct_index: 0`.

[MAJOR] PAGE 9 › block #2 / chapter_practice — answer-position skew toward C/D fails the §5.12.1 Rule 4 spirit ("no position > 40%"). Across the 24 graded MCQs, `correct_index` lands heavily on index 1 and 3, and indices for the comprehension slice (h5-pr-01..05) cluster at 1/3/0/2/2. More important, the two mis-keys above mean the *intended* distribution and the *actual* distribution differ — run `node scripts/hindi-fix/validate.mjs 5` after fixing the keys, because the position-balance check currently passes on wrong data. — FIX: fix the two keys first, then re-validate position balance.

[MAJOR] PAGE 9 › block #2 / h5-pr-20 vs h5-pr-23 vs h5-pr-25(none) — "longest-correct" tell. In several interpretation items the correct option is the fully-spelled-out conceptual sentence while distractors are terse ("गणित का अभ्यास", "पैसे की कमी", "भूख और थकान"). E.g. h5-pr-20 correct = "यात्रा को जीवन की अनुभूतियों से जोड़कर" sits among short throwaways; h5-pr-18 correct = "भव्यता और रोज़मर्रा के यथार्थ का" vs "दिन और रात के बदलने का". A student picking the longest/most-abstract option scores above chance. EVIDENCE: h5-pr-17 distractors `["गहरी भूख और रास्ते की थकान", "रास्ता भटक जाने का डर", "पैसे की कमी"]` vs correct `"सुंदरता की क्षणभंगुरता"`. — FIX: lengthen distractors into plausible near-misses (e.g. for क्षणभंगुरता, a distractor like "थकान के बाद की हल्की निराशा" is a real misread) and length-match.

[MAJOR] PAGE 9 › block #2 / h5-pr-24 — distractor is silly, not a real misconception (§5.12.1 B-1). EVIDENCE: options include `"प्रकृति झूठी होती है"` and `"लेखक को कुछ समझ नहीं आता"` — neither is a defensible half-read student error. — FIX: replace with plausible misreadings of the आदर्श-यथार्थ theme.

[MINOR] PAGE 2 › block #6 vs PAGE 9 › h5-pr-15 — same stem ("शक्ति का विस्तार, विस्तार की शक्ति' किसका वर्णन/बोध है") asked nearly verbatim twice with the same answer. Recall reuse, not new assessment. — FIX: vary the second into a "why does the chiasmus repeat the two words?" interpretive item.

## D. AI-slop / authenticity

[MINOR] PAGE 1 › block #1 / curiosity_prompt — em-dash stacking and the "विस्मय, छोटापन, या किसी 'बड़ी शक्ति' का एहसास" triple-list reads machine-cadenced. EVIDENCE: `"…मन में कैसे-कैसे भाव उठते होंगे — विस्मय, छोटापन, या किसी \"बड़ी शक्ति\" का एहसास?"` — FIX: trim to one concrete prompt.

[MINOR] Cross-page formulaic uniformity — every reading page (2,3,4) is built on the identical beat: image → text orientation → narrated_passage → comprehension_checkpoint → reasoning_prompt → inline_quiz, and each reasoning_prompt `reveal` ends on the same "यही यात्रा-वृत्तांत में … है" formula. EVIDENCE: page 2 reveal ends "यही यात्रा-वृत्तांत में 'आत्म-चेतना' और प्रकृति से संवाद है।"; page 3 reveal ends "यही यात्रा-वृत्तांत में जीवन-दर्शन की गहराई है।" — same closing stamp. — FIX: vary the closers; let at least one reveal end on a genuinely open question.

[MINOR] PAGE 6 › block #6 explanation / hyperbole — "बढ़ा-चढ़ाकर" framing is the AI device-label reflex (see E below for the accuracy fault).

## E. Literary & linguistic accuracy

[MAJOR] PAGE 6 (ch5-bhav-saundarya) › block #6 / literary_devices_highlighter — अलंकार mis-identification. "शक्ति का विस्तार, विस्तार की शक्ति" is tagged `device: "hyperbole"` (अतिशयोक्ति) with explanation "समुद्र की शक्ति को बढ़ा-चढ़ाकर… व्यक्त करना।" This is wrong: the line is a **chiasmus / यमक-वत् पदावृत्ति** (the same two words reversed) expressing vastness — there is no exaggeration of a quantity. EVIDENCE: `{"device": "hyperbole", "matches": [{"text": "शक्ति का विस्तार, विस्तार की शक्ति", "explanation": "समुद्र की शक्ति को बढ़ा-चढ़ाकर, गहन रूप में व्यक्त करना।"}]}`. — FIX: retag as पुनरुक्ति/शब्द-व्युत्क्रम (or drop the device claim); reserve अतिशयोक्ति for an actually exaggerated line ("ऐसे जैसे… संसार की सबसे ऊँची चोटी… सर किया हो" is the real अतिशयोक्ति in this text).

[MAJOR] PAGE 6 › block #10 / inline_quiz q3 (id f61cb22a) — same अतिशयोक्ति error propagated into the graded quiz is NOT here, but PAGE 2 inline_quiz q3 and PAGE 9 h5-pr-15 both lean on the "शक्ति का विस्तार" line being "वर्णन of समुद्र की व्यापकता" — that reading is fine; the device LABEL is the only fault, isolated to the highlighter. Cross-checked: NCERT's own शैलीगत table (p.92) lists "दृश्यात्मकता, रूपक, उपमा, प्रतीक, रंगों का भावात्मक प्रयोग" and does NOT call this line अतिशयोक्ति — confirming the corpus invented the label. EVIDENCE: PDF p.92 box 5 "शैलीगत विशेषताएँ". — FIX: align the highlighter to NCERT's own named features.

[MINOR] PAGE 1 › block #5 / vocabulary_lab card "बेकारी" — memory_hook "बे + कारी" is etymologically loose (the word is बे- + कार/काम), and "उर्दू — black" style hooks ("स्याह", "मद्धिम", "वीरान") are correct in origin but the hook adds nothing the meaning didn't. EVIDENCE: `"memory_hook": "बे + कारी।"` — FIX: either give a real split (बे = बिना, कार = काम) or drop.

[clean] Transliterations follow §12 (kshi-tij, sa-maa-dhisth, be-kaa-ree). Devanagari मात्रा/नुक़्ता correct throughout (ख़तरा, ज़्यादा, फ़ोटो preserved). Proper nouns (कन्याकुमारी, विवेकानंद, मोहन राकेश) preserved.

## F. Completeness & consistency

[MAJOR] PAGE 9 › block #2 / chapter_practice — intro is cloned boilerplate across the whole book. EVIDENCE: `"intro": "सही उत्तर चुनिए और कारण समझिए।"` is byte-identical in ch02, ch03, ch04, ch05, ch06 (and title format "अध्याय N — अभ्यास प्रश्न" likewise) — verified by grep across ch02–ch12. — FIX: this is acceptable as a fixed instruction, but per the review brief it is flagged: if a unique framing is wanted per chapter, vary it; otherwise treat as intentional template.

[MAJOR] §5.12.1 Rule 1 — graded bank is exactly 24 questions (meets ≥24), but **only 4 concept_tags are present** (comprehension, vocab_in_context, grammar, interpretation, inference — actually 5; counting: h5-pr 01-05 comprehension, 06-09 vocab, 10-14 grammar, 15-18+22+24 interpretation, 19-23 inference). On recount all 5 tags ARE present. EVIDENCE: concept_tags span comprehension/vocab_in_context/grammar/interpretation/inference. — [clean on coverage] — but note the two mis-keyed items live in the `inference` slice, so the validator's reasoning-share check is computing on broken keys.

[MINOR] PAGE 8 (ch5-srijan-vyakaran) › block #8 / भाषा संगम table — the corpus table for "नाव" lists 12 languages; NCERT's printed भाषा संगम (p.96–97) lists more (कश्मीरी, सिंधी, कोंकणी, मणिपुरी, मलयालम also) and the corpus omits several while NCERT includes them. Not wrong, but under-uses NCERT's own richer list. EVIDENCE: corpus rows stop at कन्नड़; PDF p.97 adds नौ (कश्मीरी), होड़ी (सिंधी), बहड़ी (कोंकणी), हि (मणिपुरी), ओडम् (मलयालम). — FIX: extend the table to NCERT's full set.

[MINOR] PAGE 9 › block #4 / threads_of_curiosity — खोजबीन links: the corpus gives the right two topics (विवेकानंद, राष्ट्रीय युवा दिवस) and the झरोखे-से निर्मल वर्मा "प्रयाग: 1976" excerpt is correctly named, matching PDF p.97. The NCERT-printed government URLs (haryanarajbhavan.gov.in, pib.gov.in) are NOT carried, only described — acceptable (they were colophon links), flagged only for completeness. — FIX: optional; add the two gov links if khojbeen is meant to be clickable.

[clean] Page count = 9 (≤11). Every page closes with a 3-question inline_quiz (स्मरण→समझ→व्याख्या). Block-0-is-image holds on all 9 pages. ganga_section tags not visible in corpus dump but structure follows the गद्य template.

STATS: pages reviewed=9, critical=3, major=9, minor=11
