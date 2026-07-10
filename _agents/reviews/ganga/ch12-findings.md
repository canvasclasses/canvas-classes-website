# Chapter 12 review — घर की याद (भवानीप्रसाद मिश्र)

SUMMARY: The PDF is correctly identified — Chapter 12 "घर की याद" by भवानीप्रसाद मिश्र, the closing काव्य chapter of गंगा. The teaching surfaces (narrated passages, triple-bridge vocab, tone-meter, devices page) are competent and the bio is factually sound. But the chapter has **two CRITICAL graded-quiz scoring bugs** where the marked `correct_index` points at a throwaway/wrong option while the explanation describes a *different* option — a student who reasons correctly is mis-marked. Beyond that, the single biggest systemic weakness is **assessment integrity in the अभ्यास bank**: it is ~50% pure vocab/grammar recall (well past the rubric's ~15% cap), several "interpretation/inference" items are near-duplicates of each other, and the अलंकार labelling on the सौंदर्य page contains a debatable रूपक/मानवीकरण call. There is also a **verbatim fidelity slip** (उनसे vs source उससे) and the standard **cloned chapter_practice intro** carried across the book.

TOP 5 MOST IMPORTANT FINDINGS (ranked):
1. [CRITICAL] ch12-abhyas › block#2 q `h12-pr-23` — marked answer is "घमंड का" (pride) but the explanation describes निःस्वार्थ प्रेम (option 0). A correct student is marked wrong.
2. [CRITICAL] ch12-abhyas › block#2 q `h12-pr-21` — marked answer is the throwaway "उसे और कोई काम नहीं था" but the explanation describes "अकेलापन याद को तीव्र कर देता है" (option 0). Mis-marked.
3. [MAJOR] ch12-abhyas › block#2 — vocab/grammar recall is ~50% of a 24-Q bank (rubric cap for pure recall ≈15%); several recall items duplicate the inline quizzes verbatim.
4. [MAJOR] ch12-kavita-bhag-1 › block#3 — narrated text reads "किंतु **उनसे** यह न कहना"; the NCERT page prints "किंतु **उससे** यह न कहना" — a verbatim slip in sacred text. (Plus "बहिन" is printed "बहिन" in source but rendered consistently — OK.)
5. [MAJOR] ch12-kavita-saundarya › block#5 — the highlighter calls "वज्र-भुज" रूपक and "हे सजीले हरे सावन" `apostrophe`; the सावन address is also (and more saliently) मानवीकरण per the workflow's own device map, and the explanation buries it in parentheses. The label set a CBSE examiner would mark differs.

FULL FINDINGS BY DIMENSION:

## A. Source fidelity
[MAJOR] ch12-kavita-bhag-1 › block#3/narrated_passage — In the सावन-संदेश block (page 4, id `c54723cf...`) the line is rendered "किंतु उनसे यह न कहना, उन्हें देते धीर रहना,". The NCERT page (p.198) prints "किंतु **उससे** यह न कहना, / उन्हें देते धीर रहना,". EVIDENCE: corpus "text": "किंतु उनसे यह न कहना, उन्हें देते धीर रहना," vs PDF "किंतु उससे यह न कहना". FIX: change उनसे → उससे to match source.

[MINOR] ch12-parichay › block#2/meet_a_scientist — Bio is accurate (1913 होशंगाबाद/नर्मदापुरम; गीत-फ़रोश, बुनी हुई रस्सी → साहित्य अकादमी; भारत छोड़ो आंदोलन, जेल, three-year कारावास; संपूर्ण गांधी वाङ्मय संपादन) — all match the PDF's परिचय box. EVIDENCE: PDF p.194 "बुनी हुई रस्सी (कविता संग्रह) पर उन्हें साहित्य अकादमी पुरस्कार मिला है". Clean.

[MINOR] ch12-shabd-sampada — Sampled cards (परिताप, चतुर्दिक्, वज्र, नवनीत, उर, झंझा, लरजना, मूठ, धीर, क्षितिज, तृषा, अश्रु, हास, क्लेश, बड़, विरस, कातना, अस्त, तिरना, घनेरा) all trace to the NCERT शब्द-संपदा glossary (PDF pp.204-205). The simple-Hindi meanings agree with the printed glossary. Source-faithful — good.

## B. Pedagogical depth & scaffolding
[MAJOR] ch12-parichay › block#5 & ch12-shabd-sampada — The §8 vocabulary floor is **≥40 triple-bridge words**; this chapter ships ~8 (परिचय pre-teach) + ~20 (शब्द-संपदा part 1) + ~14 (part 2) ≈ 42 cards, which clears the floor, but **there is no idioms (मुहावरे) page and no ≥8-idiom block**. The §8 mandate ("≥ 8 मुहावरे") is simply absent for this chapter. This is a poetry chapter and the source has few idioms, but the floor is not met and not flagged. EVIDENCE: no `vocabulary_lab` with `mode: "idioms"` anywhere in the 8 pages. FIX: either source मुहावरे from the poem's regional phrasing or explicitly waive the idioms floor for काव्य chapters in the workflow.

[MAJOR] ch12-shabd-sampada › block#3 — Several "भाव/काव्य-कला" cards are **meta-vocabulary about the lesson, not words from the poem** (संबोधन, ध्वन्यात्मक, बिंब, स्मृति, त्याग, संयम, बहुआयामी). These are authoring-commentary terms, not the तत्सम/देशज words the scaffold-flip exists to unlock. The §5.2 protocol says cards must come from the chapter's शब्द-संपदा list, "Do not invent a different list." EVIDENCE: card "बहुआयामी" / "multi-faceted" — this word is not in the poem; it is the reviewer's own analytical label. FIX: replace meta-terms with real poem words still ungloss­ed (व्यापा, बिचकें, लुनाई, सुस्थिर, ख़म, मगन, छटपटाना).

[MINOR] ch12-shabd-sampada › block#2 card "मूठ" — gloss "मुट्ठी-भर; दस्ता" with example "मूठ उनकी मिला लेकर" is correct, but the poem's "मूठ उनकी मिला लेकर" (joining hands/grip while exercising with मुगदर) is opaque; the everyday example "a handful; a hilt" does not disambiguate which sense applies in the verse. Minor — gloss is defensible.

[MINOR] ch12-kavita-bhag-1 › block#3 — Gloss density is fine and words chosen (परिताप, तिरना) are genuinely hard. The glosses are whole-पद ("बहुत पानी गिर रहा", "घर नज़र में तिर रहा") rather than single words — acceptable for poetry where the line is the unit, but it drifts from the §5.1 "exact substring (the hard Hindi word)" guidance. Defensible for verse.

## C. Assessment integrity
[CRITICAL] ch12-abhyas › block#2/chapter_practice q `h12-pr-23` — `correct_index: 2` selects "घमंड का" (pride), but the `explanation` reads "अपनी तकलीफ़ दबाकर अपनों को बचाना — यही त्यागपूर्ण, निःस्वार्थ प्रेम का चरम है" — which is option **0** ("अपनों को दुख से बचाने वाले निःस्वार्थ प्रेम का"). The marked answer and the taught answer disagree; the engine will mark the correct student wrong. EVIDENCE: "correct_index": 2 … options[2]="घमंड का" … "explanation": "...निःस्वार्थ प्रेम का चरम है". FIX: set correct_index to 0.

[CRITICAL] ch12-abhyas › block#2/chapter_practice q `h12-pr-21` — `correct_index: 1` selects "उसे और कोई काम नहीं था" (a throwaway distractor), but the `explanation` reads "कारावास का अकेलापन हर अपने की याद को और तीव्र कर देता है" — which is option **0** ("दूरी और अकेलापन हर रिश्ते की कमी को गहरा कर देते हैं"). Mis-marked. EVIDENCE: "correct_index": 1 … options[1]="उसे और कोई काम नहीं था" … "explanation": "...अकेलापन... याद को... तीव्र कर देता है". FIX: set correct_index to 0.

[MAJOR] ch12-abhyas › block#2 — **Recall over-weight.** Of 24 Qs, the vocab slice (pr-06 वज्र, pr-07 नवनीत, pr-08 उर, pr-09 परिताप) + grammar slice (pr-10 ध्वन्यात्मक, pr-11 रूपक, pr-12 उपमा, pr-13 पानी=संज्ञा, pr-14 छिन=क्षण) = 9 pure-recall items (~38%), and the "comprehension" slice (pr-01..pr-05) is also recall (rachayitaa, where-written, messenger, माँ-image, what-he-says). Effective fact-recall is ~50%+, far past the rubric's "Pure fact-recall ≤ ~15%". EVIDENCE: pr-01 "इस कविता के रचयिता कौन हैं?" / pr-08 "\"उर\" का अर्थ है —". FIX: convert ~6 recall items into "क्यों/किस भाव" reasoning items.

[MAJOR] ch12-abhyas › block#2 — **Cross-surface duplication.** pr-06/07/08 (वज्र/नवनीत/उर meanings) duplicate the शब्द-संपदा `self_check` and the page-5 inline_quiz; pr-15 ("वज्र-भुज नवनीत-सा उर से पिता की छवि") duplicates the page-3 comprehension_checkpoint q `8bd76674`; pr-17 duplicates page-4 inline q `6fe7e1d3`; pr-18 duplicates page-4 checkpoint `3daea686`; pr-22 duplicates the page-3 reasoning_prompt. The graded bank is largely a re-pour of the reading quizzes, so a student who did the pages can pass without new thinking. FIX: reserve the chapter_practice bank for fresh stems.

[MAJOR] ch12-abhyas › block#2 — **Length tell on the answer.** Several "interpretation/inference" correct options are the long, fully-worded one against terse distractors. e.g. pr-19 correct "अपनों के लिए अपनी पीड़ा छिपा लेना" vs distractor "सावन रोक देना"; pr-24 correct "प्रकृति और मन के भाव एक-दूसरे में घुल-मिल जाते हैं" vs "इसका कोई अर्थ नहीं". The rubric requires distractors length-matched and plausible; "सावन रोक देना" / "इसका कोई अर्थ नहीं" are throwaway. FIX: rewrite the throwaway distractors as defensible near-misses of comparable length.

[MAJOR] ch12-abhyas › block#2 — **Answer-position imbalance (manual count).** correct_index across the 24 Qs: index 0 appears for pr-03, pr-06, pr-19, pr-23(buggy), pr-24; index 1 for pr-01, pr-16, pr-17, pr-21(buggy); index 2 for pr-04, pr-05, pr-13, pr-14, pr-22; index 3 for pr-02, pr-07, pr-10, pr-11(should be 0), pr-12, pr-15, pr-18, pr-20. Index 3 ≈ 33% (8/24) — within the 40% cap, so it passes, but after the two bug fixes (both move to 0) index-0 climbs to ~7/24 ≈ 29%; still OK. Note for the author: re-run `validate.mjs 12` after fixing the two scoring bugs, since reorders may be needed.

[MAJOR] ch12-abhyas › block#2 q `h12-pr-11` — `correct_index: 0` (रूपक) for "वज्र-भुज" is internally consistent with the page-6 highlighter, but see finding E below: "वज्र-भुज" is more standardly taught as **उपमालुप्त/रूपक** ambiguously, and the *adjacent* distractor here is उपमा — which the same chapter's pr-12 marks correct for "नवनीत-सा उर". A student who learned "सा = उपमा, direct = रूपक" will get both, but the सौंदर्य-page रूपक call on वज्र-भुज is debatable (a compound वज्र-भुज = "वज्र जैसी भुज" reads as उपमा/लुप्तोपमा to many examiners). Flagging as ambiguous, not wrong.

[MINOR] ch12-abhyas › block#2 q `h12-pr-09` — distractors "पेट की तेज़ भूख" / "गहरी नींद" for परिताप are silly throwaways (not real misconceptions). FIX: use plausible near-synonyms (पश्चाताप, संताप-vs-परिताप).

## D. AI-slop / authenticity
[MINOR] ch12-kavita-bhag-2 › block#4/reasoning_prompt reveal — "यह विरोधी गुणों का मेल पिता को एक **पूर्ण, सच्चा इंसान** बना देता है" then "असली ताक़त यही है — कि कोई बहुत मज़बूत होकर भी अपनों के लिए उतना ही कोमल हो।" This is mild "not just X but Y" reveal-framing rhetoric. Acceptable, but the reveal closes an interpretive prompt with a single resolved reading ("इसीलिए पिता का यह चित्र इतना जीवंत और प्रिय लगता है") — borderline against §9's "don't close an interpretive prompt with one correct answer." FIX: end the reveal with an outward question, not a verdict.

[MINOR] ch12-abhyas › block#4/callout (threads_of_curiosity) — closing line "यह \"गंगा\" का अंतिम पाठ है — पूरी पुस्तक का सफ़र पूरा हुआ। 🪔" is a mild patronising closer / chapter-completion flourish; the workflow's emphasis is mastery-not-completion. Minor; harmless.

[MINOR] Cross-page uniformity — every page ends image → … → inline_quiz of exactly 3 (स्मरण/समझ/व्याख्या), and three of the four reading inline-quizzes test the SAME three beats (माँ image, छिपी पीड़ा, त्याग). The chapter reads slightly machine-stamped because the comprehension_checkpoint, the inline_quiz, and the chapter_practice all circle the identical 3-4 ideas (परिताप-घर, वज्र-नवनीत पिता, दुख-छिपाना, घर=रिश्ते). Name it: low idea-diversity across surfaces.

## E. Literary & linguistic accuracy
[MAJOR] ch12-kavita-saundarya › block#5/literary_devices_highlighter — "हे सजीले हरे सावन" is tagged `device: apostrophe` with explanation "...संबोधन (और मानवीकरण)". Per the workflow's own §5.3 अलंकार map, the live Hindi labels are संबोधन/मानवीकरण; मानवीकरण (`personification`) is the examiner-expected अलंकार here (सावन is addressed AND asked to act/carry a message), and `apostrophe` is not in the workflow's Hindi label table at all. The chapter teaches the right idea in prose but tags it with an off-list enum. EVIDENCE: "device": "apostrophe" … "हे सजीले हरे सावन". FIX: use `personification` (मानवीकरण) as the primary device key; keep संबोधन in the explanation.

[MINOR] ch12-kavita-saundarya › block#5 — "वज्र-भुज" → `metaphor` (रूपक) and "नवनीत-सा उर" → `simile` (उपमा) are each defensible, but "वज्र-भुज" without "सा/समान" is commonly read as लुप्तोपमा (elided simile) rather than clean रूपक. The explanation "भुजाओं को सीधे वज्र कह देना (अभेद) — रूपक" is the stronger reading and OK to keep; just be aware a CBSE key may accept either. Flag as defensible-but-contestable.

[MINOR] ch12-kavita-bhag-1 › block#3 gloss — "मायके में बहिन आई" glossed "बहन मायके (बाप के घर) आई है". The source's next line is "बहिन आई बाप के घर". Correct. But the §5.4 note about not translating proper nouns is respected and Devanagari/matra throughout the sampled passages is clean (बहिन spelled as source spells it). Clean.

[MINOR] ch12-vishay-vyakaran › block#5/table — "चुआ" glossed "छू लिया / चुरा लिया (touched/stole)". The source line is "आज सबका मन चुआ होगा" — here चुआ = "छू लिया / द्रवित कर दिया (moved/touched the heart)", NOT "चुरा लिया (stole)". The "stole" sense is wrong for this context and could mislead. EVIDENCE: table row "चुआ" → "छू लिया / चुरा लिया (touched/stole)". FIX: drop the "चुरा लिया/stole" sense; keep "मन को छू लिया / द्रवित किया".

## F. Completeness & consistency
[MAJOR] ch12-abhyas › block#2/chapter_practice — `intro`: "सही उत्तर चुनिए और कारण समझिए।" and the page-1 `text` "पहले बहुविकल्पी प्रश्न (हर प्रश्न के साथ कारण)…" — this is the **cloned chapter_practice intro flagged as carried across ch2–12**. Confirmed present and generic here too. FIX (book-wide): differentiate per chapter or accept as boilerplate, but it is the repeated stamp the task asked to verify.

[MAJOR] Idioms floor unmet — see B above: no मुहावरे page; §8 "≥ 8 मुहावरे" not satisfied and not waived in-page.

[MINOR] ch12-vishay-vyakaran › block#8/table (भाषा संगम "घर") — the corpus list (हिंदी, संस्कृत, पंजाबी, उर्दू, मराठी, गुजराती, बांग्ला, नेपाली, ओडिआ, तेलुगु, तमिल, कन्नड़) is a reasonable subset of the NCERT भाषा संगम box (PDF p.204), but **omits the कश्मीरी "गॉर", सिंधी, कोंकणी, असमिया, मणिपुरी "युम", मलयालम "वीडु/इल्लम"** that the source prints, and adds नेपाली/नेपाली which is fine. Not wrong, just a trimmed list. FIX: optionally align to the source's eighth-schedule set.

[MINOR] All `src`/`audio_url` fields are empty strings as expected for a TTS-first, image-pending build — consistent with the workflow (audio_fallback tts; images generated later). Not a defect; noted for completeness.

[MINOR] ch12-kavita-bhag-3 → page count = 8 (≤11) ✓; every page opens with `image` block#0 ✓; every page closes with a 3-Q inline_quiz ✓; tone_meter present on a reading page ✓; literary_devices_highlighter present ✓. Structural checklist passes.

STATS: pages reviewed=8, critical=2, major=11, minor=12
