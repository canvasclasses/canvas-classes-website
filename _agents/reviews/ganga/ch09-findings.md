# Chapter 9 review — राम-लक्ष्मण-परशुराम संवाद (तुलसीदास, अवधी)

SUMMARY: The PDF matches (बालकांड अंश, रामचरितमानस, तुलसीदास — confirmed). The chapter is materially stronger than a typical AI build: the अवधी verse it *does* quote is verbatim, अलंकार labels (अनुप्रास/अतिशयोक्ति/रूपक) are correct and trace to NCERT's own सौंदर्य table, the तुलसीदास bio is accurate, and the chapter_practice bank is genuinely position-balanced (7/6/6/5 across A/B/C/D) and reasoning-heavy. The single biggest systemic weakness is **source-completeness, not source-fidelity**: the `narrated_passage` blocks silently drop ~half the printed चौपाइयों — including the entire opening sequence (जेहि सुभायँ…, आसिष दीन्हि…, बिस्वामित्रु मिले…, रामु लखनु…, रामहि चितइ…), the दोहा बहुरि बिलोकि…, and the whole back half of the dialogue (सुनहु राम जेहि…, बेगि देखाउ मूढ़…, सुर मुनि नाग…, मन पछिताति सीय महतारी…) — so a student "reading the poem" on these pages is reading a heavily abridged version with no flag that text is missing. Two factual/quiz errors compound this (a mislabeled explanation on h9-pr-23 and a wrong-key reasoning on h9-pr-21). The corpus is also only 8 pages vs the workflow's काव्य template, with no idioms/मुहावरे surface despite NCERT's लोकोक्ति exercise.

TOP 5 MOST IMPORTANT FINDINGS (ranked):
1. [CRITICAL] h9-pr-23: explanation contradicts the keyed answer — `correct_index:2` ("राजा क्रोध नहीं करते") but the explanation describes option A (ईर्ष्यालु राजाओं का मन-ही-मन प्रसन्न होना). The keyed answer is factually wrong AND the stem's correct answer is option A. Mis-marks every student who answers correctly.
2. [CRITICAL] h9-pr-21: `correct_index:1` ("कि दोनों भाई आपस में दुश्मन थे") is a factually false option keyed as correct; the explanation describes option A ("संयम और निडरता के दो अलग… स्वभाव"). Wrong key + the keyed option is an actual misreading the chapter exists to prevent.
3. [MAJOR] `narrated_passage` (Pages 2–3) silently omits the majority of the printed verse with no "अंश/excerpt" flag — violates the workflow's verbatim-and-no-silent-shortening rule and leaves the शब्द-संपदा/अलंकार pages quoting lines (देखे चापखंड…, सहसबाहु सम…, मन पछिताति सीय महतारी…) that the student never actually read on a reading page.
4. [MAJOR] Mission floors missed: no मुहावरे/idioms `vocabulary_lab` (NCERT prints a "लोक में भाषा" लोकोक्ति exercise — मन के जीते जीत…); ~33 vocab cards vs the §8 floor of ≥40; only 8 pages vs काव्य template — the two ⭐ mastery surfaces are under-built.
5. [MINOR/MAJOR] भाषा संगम table is for "धनुष" but mixes scripts inconsistently and drops the source's own काव्य-line anchor; several glosses over-compress (memory_hook fields are just the English word + "।", e.g. "anger।", "dreadful।") — not memory hooks, just the english field repeated.

---

## A. Source fidelity

[MAJOR] ch9-kavita-bhag-1 › #3/narrated_passage — Silent omission of printed verse. The PDF prints, in order between "पितु समेत…" and "समाचार कहि…": **जेहि सुभायँ चितवहिं हितु जानी। सो जानइ जनु आइ खुटानी॥ / जनक बहोरि आइ सिरु नावा। सीय बोलाइ प्रनामु करावा॥ / आसिष दीन्हि सखीं हरषानीं… / बिस्वामित्रु मिले पुनि आई। पद सरोज मेले दोउ भाई॥ / रामु लखनु दसरथ के ढोटा… / रामहि चितइ रहे थकि लोचन… / (दोहा) बहुरि बिलोकि बिदेह सन…**. The corpus keeps only देखत…, पितु समेत…, and जनक बहोरि… — dropping ~7 lines including the दोहा — with no excerpt marker. — EVIDENCE: passage jumps from "जनक बहोरि आइ सिरु नावा। सीय बोलाइ प्रनामु करावा॥" straight to a new paragraph "समाचार कहि जनक सुनाए।" — FIX: either restore the omitted चौपाइयों verbatim, or add an explicit "(चयनित अंश)" label so the student knows lines are skipped.

[MAJOR] ch9-kavita-bhag-2 › #2/narrated_passage — Same omission downstream. After "अरि करनी करि करिअ लराई॥" the PDF continues सुनहु राम जेहि सिवधनु तोरा। सहसबाहु सम सो रिपु मोरा॥ / सो बिलगाउ बिहाइ समाजा… / सुनि मुनि बचन लखन मुसुकाने… — the corpus skips सुनहु राम… and सो बिलगाउ… and lands on सुनि मुनि बचन…. The "रे नृप बालक…" दोहा is then only quoted inside a `text` block (#3), not in the narrated passage. — EVIDENCE: passage goes "…अरि करनी करि करिअ लराई॥" → next paragraph "सुनि मुनि बचन लखन मुसुकाने।" — FIX: restore the intervening lines or flag as excerpt; the दोहा belongs in the narrated passage, not paraphrased prose.

[CLEAN-fidelity] Every अवधी line that IS quoted matches the PDF letter-for-letter (देखत भृगुपति बेषु कराला, अति रिस बोले बचन कठोरा, कहु जड़ जनक धनुष कै तोरा, कुटिल भूप हरषे मन माहीं, अरध निमेष कलप सम बीता, हृदयँ न हरषु बिषादु, नाथ संभुधनु भंजनिहारा, बहु धनुहीं तोरीं लरिकाईं, रे नृप बालक काल बस…). No paraphrase-as-quote in the quoted lines. तुलसीदास bio (1532–1623, रामचरितमानस in अवधी, विनयपत्रिका/कवितावली ब्रजभाषा, काशी में देहावसान) matches the PDF परिचय exactly.

[MINOR] ch9-shabd-sampada › #2/vocabulary_lab card "सहसबाहु" — gloss says "हज़ार भुजाओं वाला शत्रु"; NCERT's own शब्द-संपदा says "सहस्रबाहु, बाणासुर, शिव, स्कंद का एक अनुचर". The "thousand-armed enemy" reading is defensible in context (सहसबाहु सम सो रिपु मोरा) but NCERT's printed gloss is broader/different — flag the divergence from the source glossary the workflow says to source from. — FIX: align with NCERT's शब्द-संपदा wording or note the contextual reading.

## B. Pedagogical depth & scaffolding

[MAJOR] Chapter has no मुहावरे/idioms page at all. NCERT prints a "लोक में भाषा" exercise (कोष्ठक: मन, राम, राजा, बात, सिरु; उदाहरण लोकोक्ति "मन के जीते जीत है, मन के हारे हार") — the workflow §8 floor is ≥8 idioms with अर्थ + प्रयोग. The corpus surfaces only ONE लोकोक्ति, buried as a single `sentence_compose` challenge (h9-gr-05), not a vocabulary_lab idioms surface. — EVIDENCE: no `mode:"idioms"` block anywhere; §8 mandate "≥ 8 मुहावरे on the idioms page" unmet. — FIX: add an idioms page sourced from the लोक-में-भाषा कोष्ठक words.

[MAJOR] Vocab count below the §8 floor. flashcards भाग-१ (21 cards) + भाग-२ (15 cards) + परिचय pre-teach (8) but with heavy overlap (भृगुपति, कराला, रिस, भुआला, कोही, तिपुरारि, लरिकाईं, भंजनिहारा all repeat). Distinct words ≈ 33, vs floor ≥40. NCERT's शब्द-संपदा prints ~37 entries (भृगुपति…तिपुरारि across two pages) — several are unused: सुभायँ, चितवहिं, खुटानी, जोटा, अनत, लहि, बिलोके, बिलगाउ, बिहाइ, जैहहिं, परसुधरहि. — FIX: add the missing शब्द-संपदा entries to reach the floor.

[CLEAN] Glosses correctly target only तत्सम/अवधी/देशज words (बेषु कराला, बिकल भुआला, दंड प्रनामा, महीप, जड़, कुटिल भूप, अरध निमेष कलप सम) and not everyday words. The triple-bridge meaning field (simple Hindi — English) is present on story glosses and vocab cards. reasoning_prompt blocks (Pages 3, 5) are genuinely interpretive and open ("किसी क्रोधी व्यक्ति को शांत करने के लिए कौन-सा रास्ता बेहतर है, और क्यों?").

## C. Assessment integrity

[CRITICAL] ch9-abhyas › #2/chapter_practice q "h9-pr-23" — keyed answer wrong + explanation mismatched. Stem: "कुटिल भूप हरषे मन माहीं मानव-स्वभाव की कौन-सी सच्चाई उजागर करता है?" `correct_index:2` points to "राजा क्रोध नहीं करते" (nonsense), but the explanation reads "राम-लक्ष्मण को संकट में देख ईर्ष्यालु राजाओं का मन-ही-मन प्रसन्न होना — मानव-कुटिलता" which is option A ("कुछ लोग दूसरों के संकट में भीतर-ही-भीतर ख़ुश होते हैं"). Correct key is 0. — EVIDENCE: `"correct_index": 2` + option[2]="राजा क्रोध नहीं करते" + explanation describes option[0]. — FIX: set `correct_index: 0`.

[CRITICAL] ch9-abhyas › #2/chapter_practice q "h9-pr-21" — keyed answer is a false statement; explanation describes a different option. Stem asks what the राम-विनम्रता vs लक्ष्मण-व्यंग्य contrast "उभारता है". `correct_index:1` = "कि दोनों भाई आपस में दुश्मन थे" (factually false, the opposite of the chapter's point). The explanation "दो भाइयों की भिन्न प्रतिक्रियाएँ मानव-स्वभाव की विविधता और दो मूल्यों को दिखाती हैं" matches option A ("संयम और निडरता के दो अलग, मानवीय स्वभाव"). Correct key is 0. — EVIDENCE: `"correct_index": 1` with that option text + mismatched explanation. — FIX: set `correct_index: 0`.

[MAJOR] ch9-kavita-bhag-3 (Page 3) › #8 inline_quiz q3 and ch9-kavita-bhag-2 #6 comprehension_checkpoint — distractor quality is uneven: some distractors are throwaways that a half-reader instantly eliminates, e.g. Page 2 inline_quiz q1 option "आपस में ही एक-दूसरे से ज़ोरदार युद्ध करने लगे" and q3 option "सभा में बैठे सभी राजा परशुराम के पुराने घनिष्ठ मित्र थे" — padded-long, implausible. These are *length-matched* (so they pass the mechanical gate) but are not "real, defensible mistakes" per §5.12.1-B.1. — FIX: replace with plausible near-miss distractors (e.g. "केवल जनक उठे", "चुपचाप बैठे रहे").

[MINOR] ch9-abhyas concept-tag drift: अलंकार items (h9-pr-10/11/12) and अवधी→खड़ी items (h9-pr-13/14) are tagged `grammar`, which is defensible, but several "comprehension" items (h9-pr-15) are really interpretation. Coverage still satisfies all 5 tags. Position balance is good (A=7,B=6,C=6,D=5; max 29%). No length giveaways spotted in the graded bank.

## D. AI-slop / authenticity

[MINOR] Cross-page formulaic uniformity is mild but present: every page is image(hero) → text → block → inline_quiz(3 Qs, threshold 0.67), and every inline_quiz difficulty runs 1→2→3 in lockstep. Reads slightly machine-stamped but each page is individually justified by the काव्य template. — FIX: vary the closing-quiz difficulty ordering.

[MINOR] memory_hook fields on many vocab cards are not hooks — they just repeat the english field plus a danda: "anger।", "dreadful।", "Shiva।", "timid।", "childhood।", "a king।" (परिचय cards) and "fierce/dreadful।", "an axe।" (शब्द-संपदा). A memory_hook should be an etymology split or image (the doc's example: नि+आपद). Several DO this well (भृगु+पति, भू-पाल, चाप+खंड, भंजन+हारा), so the pattern exists — the lazy ones should match. — FIX: give etymology/sound hooks or drop the field rather than echo english.

[CLEAN] No "not X but Y" / "isn't just" / reveal-framing / banned-word tells found in the commentary. hinglish_commentary paragraphs are restrained and accurate ("परशुराम का कराल वेष… सब राजा भय से व्याकुल होकर उठ खड़े होते हैं").

## E. Literary & linguistic accuracy

[CLEAN] अलंकार labels are all correct and match NCERT's own सौंदर्य table (PDF p.161): अनुप्रास for "अरि करनी करि करिअ लराई" (क/र आवृत्ति ✓), अतिशयोक्ति for "अरध निमेष कलप सम बीता" ✓, रूपक for "पद सरोज" (अभेद आरोप ✓). The literary_devices_highlighter passage strings three real verse fragments and labels each correctly. tone_meter arc (भय → रौद्र → संयम → व्यंग्य → रौद्र चरम) is textually grounded.

[MINOR] ch9-patra-bhav › #3/table row "चिंता — सीता की माता (सुनयना)" anchored to "बिधि अब सँवरी बात बिगारी" — correct per NCERT's worked example, good. But the character_map lists राजा जनक as a पात्र with bio "मौन रहते हैं" while the verse line attributed to जनक's silence ("अति डरु उतरु देत नृपु नाहीं") sits in the omitted region (see A) — so a student meets जनक's defining moment only in the quiz, never in the read passage. — FIX: tied to the §A omission fix.

[MINOR] ch9-vishay-vyakaran › #7/table भाषा संगम "धनुष" — script inconsistency: Gujarati/Bangla/Odia/Telugu/Tamil/Kannada cells show native script + Devanagari paren, but Punjabi "धणुख" and Nepali "धनु" are Devanagari-only and Urdu "कमान" drops Nastaliq. NCERT's own list (PDF p.163) is richer (gives both कमान AND धनुः-type forms per language, e.g. सिंधी धनुष/कमान, कोंकणी धनुश). — FIX: align with the NCERT आठवीं-अनुसूची list and standardise the script+gloss format.

## F. Completeness & consistency

[MAJOR] Only 8 pages built. काव्य template (§7) is 6-page minimum but this is a long, exercise-rich chapter; NCERT carries 8 exercise families here (मेरे उत्तर मेरे तर्क, मेरी समझ, मेरी कल्पना, विधा से संवाद, विषयों से संवाद, सृजन, भाषा से संवाद, गतिविधियाँ, मेरी पहेली, भाषा संगम, खोजबीन). The सृजन family (NCERT: मौन संवाद between सीता-सुनयना; सीता के मन के भाव; अपना परिचय) is not built as a `writing_scaffold`. गतिविधियाँ (the कथन→पात्र matching table; मंचन; वाद-विवाद) is absent. — FIX: add a सृजन page (writing_scaffold) and fold the गतिविधियाँ matching table into apply_express/comprehension.

[MAJOR] `chapter_practice.intro` = "सही उत्तर चुनिए और कारण समझिए।" — verify whether this exact intro is cloned across ch2–12 (the review brief flags this). It is generic and reusable; on this chapter it is accurate but if identical across chapters it is boilerplate padding. CONFIRMED generic/cloneable wording; flag for cross-chapter dedup. — FIX: per-chapter intro tied to this poem, or accept as intentional shared chrome.

[MINOR] All `audio_url` are "" (correct, TTS-first) and all portrait_url/image generation fields are populated except janak `portrait_prompt:""` (empty stub) in character_map. — FIX: populate or drop the empty janak portrait field.

[CLEAN] dialogue_role_play is listed in the workflow §5.10 as a natural fit for THIS chapter ("role-play the परशुराम–लक्ष्मण exchange") but is not used. Not a defect per se, but a missed signature surface for a dialogue poem.

STATS: pages reviewed=8, critical=2, major=7, minor=8
