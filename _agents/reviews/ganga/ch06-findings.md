# Chapter 6 review — रीढ़ की हड्डी (जगदीशचंद्र माथुर, एकांकी)

SUMMARY: The PDF confirms the chapter is "रीढ़ की हड्डी," a one-act play by जगदीशचंद्र माथुर — the corpus matches the source on author, characters, plot, and the title's double meaning. Author bio, character map, and theme work are accurate, and the dialogue blocks quote the play verbatim (no paraphrase-passed-off-as-text). The chapter is genuinely strong on the literature side. BUT the assessment surface carries two CRITICAL defects that mislead/mis-mark students: (1) two `chapter_practice` items have explanations that contradict their own `correct_index` (a marked-wrong-when-right and an explanation pointing at a different option), and (2) the final inline-quiz item on page 8 ("बाप सेर तो लड़का सवा सेर") gives a textbook-incorrect gloss as the keyed answer. The single biggest systemic weakness is **quiz-key correctness on the practice page** — the literature is faithful, but the graded layer was not proofread against its own keys, exactly the surface a parent/top-school teacher judges.

TOP 5 MOST IMPORTANT FINDINGS (ranked):
1. [CRITICAL] `ch6-abhyas › block#2 / chapter_practice` q `h6-pr-23`: explanation describes option (क) but `correct_index` is 2 (option ग "सब कुछ भुला देता है") — the keyed-correct answer is itself the wrong reading, and a thinking student is mis-marked. (Dimension C)
2. [CRITICAL] `ch6-abhyas › block#2 / chapter_practice` q `h6-pr-21`: stem asks why उमा's speaking out was *साहसिक*; `correct_index` is 1 ("क्योंकि वह बहुत ग़ुस्सैल थी") but the explanation justifies option (क) "तब स्त्रियों का निडर बोलना दुर्लभ था". Correct option is keyed wrong. (Dimension C)
3. [CRITICAL] `ch6-srijan-vyakaran › block#9 / inline_quiz` q `381c5d1b`: keys "बाप सेर तो लड़का सवा सेर" as "बेटा पिता से भी बढ़कर निकलना" (correct_index 1) — but in this play NCERT/the text use it with a **negative/ironic** sense (the boy is *worse* — equally regressive), and the chapter's own apply_express (`h6-gr-04`) treats the positive sense as a deliberate *re-use*. The keyed gloss is presented as the plain meaning and is misleading. (Dimension C/E)
4. [MAJOR] Cross-page: the same ~6 vocab/idiom items (तालीम, दकियानूसी, फितरती, बेबस, मुँह फुलाना, सिर चढ़ाना, इज्ज़त उतारना) are re-tested almost verbatim across `ch6-shabd-sampada` self_check, `ch6-srijan-vyakaran` self_check + inline_quiz, and `ch6-abhyas` h6-pr-06..12 — padding the count and lowering the bar (a student who did page 5 auto-passes page 9's vocab slice). (Dimension F)
5. [MAJOR] `ch6-shabd-sampada` omits NCERT शब्द-संपदा words actually printed in the glossary (गंदुमी, डाट, करीने, दस्तक, खीस निपोरना/खीस निकालना) and substitutes invented entries (परिवेश, समाधान, दिखावा, टिप्पणी) that are NOT in NCERT's list — violating the workflow rule that cards be "sourced from the chapter's शब्द-संपदा list (not invented)." (Dimension A/F)

FULL FINDINGS BY DIMENSION:

## A. Source fidelity
[CRITICAL→demoted to MAJOR] Dialogue is verbatim — clean overall. Spot-checks against the PDF (बाबू/रामस्वरूप's "अरे धीरे-धीरे चल… अब तख़्त को उधर मोड़ दे", गोपालप्रसाद's "मोर के पंख होते हैं, मोरनी के नहीं; शेर के बाल होते हैं, शेरनी के नहीं", उमा's "जब कुर्सी-मेज बिकती है तब दुकानदार…" and "रीढ़ की हड्डी… यानी बैकबोन, बैकबोन!") all match the source lines exactly. No fabricated plot points. Good.

[MAJOR] `ch6-shabd-sampada › block#2/#3` — invented vocabulary not in NCERT's शब्द-संपदा. NCERT page 119 lists 24 words: अधेड़, तख़्त, गंदुमी, डाट, जंजाल, ठठोली, करीने/करीना, दकियानूसी, तालीम, चौपट, दस्तक, फितरती, खीस निपोरना/खीस निकालना, खासियत, तशरीफ़, मार्जिन, बालाई, तकल्लुफ़, माफ़िक, मुखातिब, निहायत, जायचा, अर्ज़, अधीर. The corpus DROPS गंदुमी, डाट, करीने, दस्तक, खीस निपोरना, मार्जिन and ADDS रूढ़िवादी, दहेज, कुरीति, आत्मसम्मान, बेबस, कायरता, ख़रीदार, व्यंग्य, नैतिक, दृढ़ता, सशक्त, टिप्पणी, परिवेश, समाधान, दिखावा — most of which are commentary/theme words, not the देशज/उर्दू register words NCERT flagged as hard. EVIDENCE: card `faa1ebc5…` "परिवेश … माहौल"; `143a79c2…` "समाधान"; `d15b0ca2…` "टिप्पणी". FIX: restore the dropped NCERT glossary words (esp. गंदुमी, डाट, करीने, दस्तक, खीस निपोरना — the genuinely-hard ones); move theme words to commentary, not vocab cards.

[MINOR] `ch6-parichay › meet_a_scientist` author bio is accurate to the PDF (1917 शाहजहाँपुर, ICS, कोणार्क सर्वाधिक चर्चित, 1978 निधन, रचनावली चार खंड). The inline_quiz distractors "आधे-अधूरे / आषाढ़ का एक दिन" are by मोहन राकेश and "अंधेर नगरी" by भारतेंदु — fair, real misconception distractors. Clean.

## B. Pedagogical depth & scaffolding
[MAJOR] `ch6-parichay › curiosity_prompt` carries the answer in the prompt. "क्या आपने कभी देखा है कि लोग बाहर से \"आधुनिक\" होने का दिखावा करते हैं, पर भीतर से पुरानी सोच रखते हैं" pre-states the play's exact thesis (रामस्वरूप = आधुनिक दिखावा/भीतर रूढ़िवादी) before the student has read a line — it should open from the student's life, not hand them the interpretation. EVIDENCE: block#1 prompt. FIX: open with the felt experience only ("क्या किसी ने तुमसे कहा है 'लड़की ज़्यादा पढ़ी न हो'? तब कैसा लगा?") and let the दिखावा theme emerge during reading.

[MINOR] reasoning_prompts (pages 2, 3, 4, 7) are genuinely interpretive and the `reveal` text teaches well (esp. the page-4 double-meaning of रीढ़ की हड्डी). Good — these are the strongest blocks in the chapter.

[MINOR] Gloss density: the तत्सम/उर्दू words the play actually trips students on (गंदुमी = wheat-coloured, खीस निपोरना, सिटिंग, मार्जिन-in-context) are NOT glossed inside the dialogue blocks — the role-play lines have no per-word glosses at all, so a weak reader hits गंदुमी/फितरती/तशरीफ़ cold. FIX: add story glosses on the role-play lines for the hard words, per workflow §5.1 (the शब्द-संपदा page alone isn't the reading-moment support).

## C. Assessment integrity
[CRITICAL] `ch6-abhyas › block#2 / chapter_practice` q `h6-pr-23` — key/explanation mismatch, and the keyed answer is wrong. Stem: "एकांकी का सुखद-व्यंग्यपूर्ण अंत (\"मक्खन!\") पाठक पर क्या प्रभाव डालता है?" `correct_index: 2` = option (ग) "सब कुछ भुला देता है". The `explanation` says "हास्य-व्यंग्यपूर्ण अंत गंभीर संदेश को रोचक बनाकर मन में और गहरे बैठा देता है" — which describes option (क) "गंभीर मुद्दे को हल्के-व्यंग्य से और गहरा कर देता है". A student who reads correctly picks (क) and is marked wrong. FIX: set `correct_index: 0`.

[CRITICAL] `ch6-abhyas › block#2 / chapter_practice` q `h6-pr-21` — key/explanation mismatch. Stem: "उमा का खुलकर बोल पड़ना उस समय के समाज के लिए क्यों साहसिक कदम था?" `correct_index: 1` = "क्योंकि वह बहुत ग़ुस्सैल थी". The `explanation` ("1939 के समाज में एक स्त्री का अन्याय के सामने निर्भीक बोलना बड़ा साहस था") justifies option (क) "तब स्त्रियों का इस तरह निडर होकर बोलना दुर्लभ था". Correct answer is (क); the key points at a distractor that is itself a mild character-smear. FIX: set `correct_index: 0`.

[CRITICAL] `ch6-srijan-vyakaran › block#9 / inline_quiz` q `381c5d1b` — "बाप सेर तो लड़का सवा सेर" keyed to "बेटा पिता से भी बढ़कर निकलना" (correct_index 1) as if that's the meaning here. In the play रामस्वरूप uses it of गोपालप्रसाद→शंकर **ironically/negatively** (the son is just as bad), and NCERT's संदर्भ-में-शब्द task (p117) explicitly says "इस कहावत का प्रयोग … नकारात्मक प्रवृत्ति का उल्लेख करने के लिए किया गया है." The corpus's own explanation even concedes "(यहाँ नकारात्मक भाव में, पर सकारात्मक भी हो सकता है)" — yet keys the bare positive gloss as correct. A student who learned the chapter's actual usage is misled. FIX: reword stem to "इस एकांकी में रामस्वरूप ने इसे किस भाव में कहा?" and key the ironic/negative sense.

[MAJOR] Length tell on page 2 comprehension_checkpoint `f1de20a6`. Correct option "कि वह बहुत पढ़ी-लिखी (B.A. पास) है" is materially longer + more specified than the three terse distractors ("कि वह बीमार है" / "कि वह बहुत ग़रीब है" / "कि वह बहुत बड़ी है"). Same pattern at `ch6-ekanki-bhag-3 › comprehension_checkpoint 5c87893f` (correct option a full clause, distractors 2–4 words). FIX: length-match distractors (workflow §5.12.1 rule 5 applies to comprehension_checkpoint too).

[MAJOR] Distractor weakness — throwaway options. Several items use silly, non-misconception distractors a half-reader would never pick: `h6-pr-15` "क्योंकि उसे घर का फर्नीचर बहुत पसंद है"; page-3 checkpoint "क्योंकि वह व्यापारी है"; `h6-pr-06` तालीम distractors "स्वादिष्ट भोजन / मधुर संगीत / लंबी यात्रा". These make the vocab/comprehension slice gameable by elimination. FIX: replace with near-miss distractors (e.g. for तालीम: "तालमेल / तालाब / ताल — सुर" sound-alikes that a guesser actually confuses).

[MAJOR] Redundant re-testing across pages (also a Dimension F count-pad). The vocab items तालीम, दकियानूसी, फितरती, बेबस and the idioms मुँह फुलाना, सिर चढ़ाना, इज्ज़त उतारना are each tested 2–3× with near-identical stems: `ch6-shabd-sampada` self_check (दकियानूसी/तालीम/फितरती) ≈ `ch6-abhyas` h6-pr-06/07/09; `ch6-srijan-vyakaran` self_check (मुँह फुलाना/इज्ज़त उतारना) ≈ same page inline_quiz ≈ h6-pr-10/12. A student who did page 5/8 passes page 9's first ~7 MCQs without re-reading. FIX: make the practice-bank vocab items context-in-sentence ("इस वाक्य में 'तालीम' का अर्थ…") rather than bare dictionary recall already drilled on page 5.

[MINOR] Answer-position spread on the 24-item practice bank is healthy (positions used: index 0,1,2,3 mixed; correct_index values across h6-pr-01..24 are 1,3,0,2,2,0,3,1,1,3,0,2,2,0,3,1,1,3,0,2,3,0,2,0). No "always-A" tell. Good — the past systemic bug is not present here.

## D. AI-slop / authenticity
[MINOR] `ch6-vishayon-se-samvad › callout literature_in_life` mild AI-closer cadence: "अगली बार किसी के साथ \"लड़का-लड़की\" का भेदभाव देखें, तो उमा की \"रीढ़ की हड्डी\" याद रखिए।" — borderline patronising-uplift, but specific to the text, so acceptable. No banned words (delve/crucial/tapestry etc.) found anywhere in the chapter. 

[MINOR] Cross-page uniformity is low-risk here: pages legitimately differ (read → vocab → idioms → character/vidha → theme → सृजन → practice) and don't read machine-stamped. No "not X but Y" / triple-repetition tells detected. Clean.

## E. Literary & linguistic accuracy
[MAJOR] See Dimension C — the "बाप सेर तो लड़का सवा सेर" gloss is a literary-usage error (ironic usage in-text mis-taught as the literal positive sense).

[MINOR] `ch6-patra-vidha › character_map` relationships accurate (रामस्वरूप पिता of उमा, गोपालप्रसाद पिता of शंकर, उमा→shankar व्यंग्य-प्रहार, गोपाल→ram दगे का आरोप — all supported by the text). traits accurate. Clean.

[MINOR] `ch6-patra-vidha › timeline` "एकांकी के मुख्य तत्व" mirrors NCERT's own 10-point विधा list (p115: एकांकी का नाम, लेखक, पात्र, परिवेश/देश-काल, रंग-निर्देश, संवाद-निर्देश, समस्या, संवाद, मुख्य विचार, समाधान/परिणाम) — well-aligned to source. Good.

[MINOR] भाषा संगम table (मक्खन) matches NCERT p118 (नवनीतम् Sanskrit, लोणी Marathi, वेन्न Telugu, etc.) — faithful. Clean.

## F. Completeness & consistency
[MAJOR] `chapter_practice` intro CLONE — confirmed and flagged. `ch6-abhyas › block#2` intro "सही उत्तर चुनिए और कारण समझिए।" + the page text "पहले बहुविकल्पी प्रश्न (हर प्रश्न के साथ कारण) हल कीजिए, फिर रचनात्मक चुनौतियाँ।" is the same boilerplate scaffolding the rubric warns is cloned across ch2–12. Note the chapter does NOT actually deliver a per-question "कारण/justify" field (NCERT's मेरे उत्तर मेरे तर्क asks the student to *say why* the answer fits) — the intro promises a justify step the block doesn't implement. FIX: either add a justify/reasoning field per question (matches NCERT's मेरे उत्तर मेरे तर्क family) or drop the "कारण" promise from the cloned intro.

[MAJOR] Vocabulary floor at risk. Workflow §8 floor = ≥40 triple-bridge words. Corpus has ~18 (page1) + 18+17 (page5) cards but with heavy duplication (तालीम, दकियानूसी, सशक्त, बेबस, व्यंग्य, रूढ़िवादी, दहेज, आत्मसम्मान all appear twice across page1 and page5). De-duplicated unique count is ~33, and several are invented commentary words rather than the NCERT-flagged hard register. Net: the chapter likely misses the 40-genuine-hard-word floor. FIX: restore the dropped NCERT glossary words to reach 40 genuine register words; remove duplicates.

[MINOR] Idioms floor: workflow §8 wants ≥8 मुहावरे; corpus delivers 7 (`b7b8cc30` cards) — one short. NCERT's भाषा में मुहावरे task (p117) lists 8 source sentences (भीगी बिल्ली, मुँह फुलाना, मर्ज़ की दवा, सिर चढ़ाना, सब-कुछ उगलना, काँटों में घसीटना, इज्ज़त उतारना, मुँह छिपाकर भागना) — the corpus dropped "किस मर्ज़ की दवा होना". FIX: add the 8th idiom to hit the floor and match NCERT's set.

[MINOR] Image src present on all hero blocks (R2 URLs non-empty); audio_url "" throughout (correct, TTS-first per §11); no stub blocks. Page count = 9 (≤11, OK).

[MINOR] Missing NCERT exercise coverage: NCERT's सृजन "एकांकी का विस्तार" (write the next scene after परदा गिरना) and गतिविधियाँ "आप भी संवाददाता / live report" are present in source (p116–118) but only partially surfaced (writing_scaffold is a टिप्पणी, not the next-scene extension; the live-report/interview गतिविधि is absent). FIX: add a writing_scaffold for "परदा दोबारा उठे तो अगला दृश्य" and a dialogue_role_play/भाषण for the संवाददाता activity to fully cover NCERT's families.

STATS: pages reviewed=9, critical=3, major=9, minor=12
