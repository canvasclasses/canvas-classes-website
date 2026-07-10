# Chapter 1 review — दो बैलों की कथा (प्रेमचंद)

**PDF match confirmed.** The source PDF `ihga101.pdf` IS "दो बैलों की कथा" by प्रेमचंद, गद्य खंड chapter 1 of गंगा. All character names (हीरा, मोती, झूरी, गया, भैरो की बेटी), plot beats, and the अभ्यास families (रचना से संवाद, विधा से संवाद, विषयों से संवाद, सृजन, भाषा से संवाद, गतिविधियाँ, भाषा संगम) line up with the corpus build. Only Part १ of the printed story (pp. 4–15) was available in the 26 PDF pages I could read; the अभ्यास section (pp. 16–26) was fully readable and cross-checked.

SUMMARY: This is a strong, carefully-built chapter — narrated passages are verbatim-faithful to प्रेमचंद, the triple-bridge vocabulary is rich (43 cards + 8 idioms, clearing the §8 floors), and the reasoning prompts stay genuinely interpretive. But it ships with **one outright broken graded MCQ** (the correct_index points at a nonsensical option while the explanation describes a different option — a student who understood the chapter is marked wrong), **a fabricated/mis-sensed dictionary gloss** (गोई glossed as "playmate" when the chapter uses it to mean the brother-in-law's household), **a duplicated narration error copied straight from the source into authored commentary** ("स्थायी विषाद स्थायी रूप से"), and **a grammar drill teaching a contestable rule as fact** (सींग = स्त्रीलिंग). The single biggest systemic weakness is **assessment integrity in the graded `chapter_practice` bank**: beyond the broken item, several "inference/interpretation" stems are answerable by pure elimination (three throwaway distractors against one obviously-right option), so the bank is easier to game than the §5.12.1 rubric intends.

TOP 5 MOST IMPORTANT FINDINGS (ranked):
1. **[CRITICAL]** `abhyas › block#2/chapter_practice` item `h1-pr-23`: `correct_index: 2` selects **"खेती करना समय की बर्बादी है"** but the explanation describes option 0 ("संगठित विरोध का संदेश"). The keyed answer is wrong AND absurd — the chapter never says farming is a waste of time. A student who read the chapter is marked wrong. Must be fixed before publish.
2. **[CRITICAL]** `shabd-sampada › block#2/vocabulary_lab` card "गोई": glossed "खेल का साथी, सखी — playmate; companion". In THIS chapter गोई is not used in that sense — the PDF reads "झूरी ने एक बार **गोई** के ससुराल भेज दिया" (the brother-in-law / गया's household). The card teaches a meaning that does not fit the only place the word occurs in the text.
3. **[MAJOR]** `kahani-bhag-1 › block#3/narrated_passage`: the sentence "उसके चेहरे पर एक स्थायी विषाद **स्थायी रूप से** छाया रहता है।" duplicates "स्थायी". The PDF prints "उसके चेहरे पर एक स्थायी विषाद छाया रहता है।" — a verbatim passage was corrupted; this is a source-fidelity break in the sacred narrated text.
4. **[MAJOR]** `srijan-gatividhiyan › block#5/apply_express` item `h1-gr-07`: keys "मोती ने साँड़ को सींग **मारी**" and teaches "'सींग' यहाँ स्त्रीलिंग" as a hard rule. सींग is standardly masculine ("सींग मारा", as the corpus itself writes elsewhere in `h1-pr-...` and the PDF's "सींग मारा/चुभा दिया"). Teaching a contestable/wrong gender agreement as the graded answer mis-educates.
5. **[MAJOR]** Graded-bank gameability (`abhyas › block#2`): multiple high-difficulty "inference"/"interpretation" items pair one plainly-correct option with three throwaway distractors, so they're solvable without reading (e.g. `h1-pr-22`, `h1-pr-24`). This undercuts the §5.12.1 promise that the practice page is "impossible to pass without having read the chapter."

---

## A. Source fidelity

[MAJOR] `kahani-bhag-1 › block#3/narrated_passage` (sentence `aa32f4fe`) — verbatim story text corrupted with a duplicated word. EVIDENCE: corpus "उसके चेहरे पर एक स्थायी विषाद **स्थायी रूप से** छाया रहता है।" vs PDF p4 "उसके चेहरे पर एक स्थायी विषाद छाया रहता है।" — FIX: delete "स्थायी रूप से"; restore the printed line exactly.

[CRITICAL] `shabd-sampada › block#2/vocabulary_lab` (card "गोई") — dictionary gloss gives a sense that does not match the chapter's usage. EVIDENCE: card meaning "खेल का साथी, सखी — playmate; companion", example "बचपन की गोई आज भी याद आती है।"; but the chapter's only use is PDF p5 "झूरी ने एक बार **गोई** के ससुराल भेज दिया" (= the brother-in-law's house, i.e. गया). A student tapping this word in context is taught the wrong meaning. — FIX: either gloss गोई in the contextual sense actually used (साला/बहनोई के घर का संदर्भ) or drop the card; do not teach "playmate" for a word the chapter uses otherwise.

[MINOR] `parichay-premchand › block#2/meet_a_scientist` — author bio is accurate to the PDF (लमही, 1880–1936, उपन्यास सम्राट, मानसरोवर, गोदान, असहयोग आंदोलन resignation all match PDF p3). Note: the bio lists "सेवासदन" while the PDF prints the same set plus "प्रेमाश्रम, कायाकल्प, कर्मभूमि" — the corpus drops a few titles but invents none. Clean (no fabrication); the omission is acceptable.

The narrated passages on pages 2–4 (the आरंभ, घर की वापसी, दो रोटियाँ, साँड़ से युद्ध, दीवार, घर की राह beats) otherwise match the PDF verbatim, including punctuation-level details like "विग्रह के नाते से नहीं, केवल विनोद के भाव से, आत्मीयता के भाव से" and "विद्रोहमय स्नेह". Quoted lines in `tone_meter`, `theme_explorer`, and `literary_devices_highlighter` are all real PDF text. No invented characters, no renamed relationships (गया IS correctly झूरी's साला per PDF p5/p7), no fabricated plot.

## B. Pedagogical depth & scaffolding

[MINOR] `kahani-bhag-1 › block#3/narrated_passage` gloss "पछाईं" = "उन्नत पश्चिमी नस्ल का — of fine western breed". This is an interpretive stretch: पछाईं derives from पछाँह/पश्चिम (a regional breed from the west, as the शब्द-संपदा card correctly hedges "(here) of fine breed"). Calling it "western breed" risks a student reading it as European/foreign. — FIX: align the story gloss with the more careful शब्द-संपदा wording ("पश्चिमी क्षेत्र की उन्नत नस्ल").

[MINOR] `kahani-bhag-2-3 › block#3` gloss "सौतेली माँ — stepmother" glosses an everyday word the target reader already owns; mild redundancy against the §5.1 rule "do not gloss everyday words." Low cost. — FIX: drop or replace with a genuinely hard word from the beat.

Otherwise scaffolding is a strength: gloss density (~1 per 40 words), the triple bridge is honoured on every story gloss (simple Hindi — English in the `meaning` field), and the reasoning prompts (`viद्रोहमय स्नेह`, the साँड़ unity prompt, the असहयोग prompt) are genuinely interpretive with open `reveal`s, not recall in disguise. Concepts are introduced before they're tested (काँजीहौस pre-taught on page 1 and page 5 before the प्रतीक quiz on page 9).

## C. Assessment integrity

[CRITICAL] `abhyas › block#2/chapter_practice` item `h1-pr-23` — keyed answer is wrong and nonsensical. EVIDENCE: question "प्रेमचंद ने बैलों के माध्यम से मनुष्य-समाज पर क्या व्यंग्य किया है?", options[2] = "खेती करना समय की बर्बादी है", `correct_index: 2`, explanation "बैलों की एकता और प्रतिरोध के ज़रिए लेखक संगठित विरोध का संदेश देते हैं।" — the explanation matches option 0 ("अन्याय सहने से बेहतर है मिलकर उसका विरोध करना"), not option 2. — FIX: set `correct_index: 0`.

[MAJOR] `abhyas › block#2/chapter_practice` — gameable items where one option is plainly right and the other three are throwaway (not "real, defensible mistakes" per §5.12.1.B.1). EVIDENCE: `h1-pr-22` "पूरी कहानी का केंद्रीय भाव क्या है?" — distractors "धन का सबसे अधिक महत्त्व / खेती के तरीक़े / बदलते मौसम का असर" are unrelated to the story; `h1-pr-24` distractors "खाने-पीने भर की / धन कमाने की / गाँव के त्योहार की" likewise. A student can pick the answer by elimination without reading. — FIX: replace ≥2 throwaway distractors per item with near-miss readings (e.g. for `h1-pr-22`: "मालिक के प्रति वफ़ादारी सबसे बड़ा मूल्य है" — a defensible-but-wrong theme).

[MAJOR] Length-tell on the graded bank. EVIDENCE: `h1-pr-15` correct option "बिकना उन्हें अपना अपमान लगा" sits among shorter distractors; `h1-pr-23`'s intended-correct option 0 "अन्याय सहने से बेहतर है मिलकर उसका विरोध करना" is the longest by a clear margin; the pattern (correct option = fullest sentence) recurs. The §5.12.1 rule is zero items where correct > 1.3× next-longest distractor (graphemes). — FIX: run `node scripts/hindi-fix/practice_topup.js` / hand-lengthen distractors; do not trim the correct option.

[MINOR] `kahani-ka-saundarya › block#5/inline_quiz` item `2f351ade` (the "संवादात्मकता" question) — `correct_index: 1` ("संवादात्मकता") is right, but option 2 "आँखों के सामने खिंचती चित्रात्मकता" is a *defensible* second answer for a passage carried by descriptive narration; acceptable but watch the near-miss. No fix required; flagged for awareness.

[MINOR] Answer-position spread across the graded bank looks varied (A/B/C/D all used: e.g. pr-01=B, pr-02=D, pr-03=A, pr-04=C, pr-23 currently=C), which is good — but verify with `node scripts/hindi-fix/validate.mjs 1` after fixing pr-23, since flipping it to A changes the distribution.

## D. AI-slop / authenticity

[MINOR] `kahani-bhag-1 › block#3` `hinglish_commentary` and several `note`/`annotation` fields lean on a repeated "यही कहानी की जान/चाबी है" beat. EVIDENCE: page 2 "यही व्यंग्य आगे बैलों पर भी लागू होगा" + "इस एक वाक्य में पूरी कहानी की चाबी है"; page 3 "यह कहानी का एक नैतिक केंद्र है"; page 4 "घर ... की उम्मीद ही उनमें नई जान भर देती है". The "this one line is the key to the whole story" framing recurs enough to read formulaic across beats. — FIX: vary the closer; let one or two beats end without a thesis-stamp.

[MINOR] Cross-page uniformity: every page is image(hero) → text(intro) → [core blocks] → inline_quiz(3 Qs, स्मरण→समझ→व्याख्या), and most intros open with a near-identical "अब …" / "नीचे …" pointer ("नीचे के संदर्भ…", "नीचे का आदर्श…", "नीचे दिए मुहावरे…"). Passes individually; reads machine-stamped in aggregate. — FIX: rotate 2–3 intro openings.

The Hindi itself is **not** translated-feeling — syntax is natural spoken Hindi, register is appropriately सहज (तुम/सोचिए/देखो), and there is no English-mirrored word order. No banned-word problem (English list doesn't apply). This dimension is largely clean; findings are polish-level.

## E. Literary & linguistic accuracy

[MAJOR] `srijan-gatividhiyan › block#5/apply_express` `h1-gr-07` — teaches a contestable gender rule as fact. EVIDENCE: `fix: "मारी"`, rule "'सींग' यहाँ स्त्रीलिंग के अनुरूप — 'मोती ने साँड़ को सींग मारी'". सींग is standardly masculine; the PDF and the corpus's own narrated text use "सींग मारा / सींग चुभा दिया". Keying "मारी" as the only correct form mis-teaches grammar on the graded surface. — FIX: drop this item or change to an uncontested agreement (e.g. लाठी/रस्सी, genuinely feminine).

[MINOR] `kahani-ka-saundarya › block#2/literary_devices_highlighter` — device labels are defensible but the chapter's most famous device is under-served. The highlighter tags imagery/vyangya/virodhabhas/hyperbole correctly, and the NCERT सौंदर्य table (PDF p19–20: चित्रात्मक भाषा, संवादात्मकता, व्यंग्य, विरोधाभास, संघर्ष, अतिशयोक्ति, संदेह) is faithfully mirrored in the `table` block. BUT **मानवीकरण / personification** — bulls speaking in मूक-भाषा, the single most pervasive device in this allegory — is never named as a device anywhere on the सौंदर्य page. — FIX: add a मानवीकरण (`personification`) entry to the highlighter or table; it's the chapter's signature device.

[MINOR] `kahani-ka-saundarya › block#2` virodhabhas explanation labels झूरी's स्नेह vs स्त्री's क्रोध as "विरोधाभास". This is really a *contrast of two characters' reactions*, not a true विरोधाभास (paradox = self-contradictory statement). NCERT's own table (PDF p20) does list this pair under विरोधाभास, so the corpus is faithfully following the source — acceptable, but a sharp teacher would note it's contrast, not paradox. No fix needed (defer to NCERT).

Devanagari/matra in the authored commentary is clean throughout — no spelling errors found beyond the duplicated-word fidelity break in A. Transliterations in vocab cards follow the §12 scheme correctly (ni-raa-pad, sa-hish-nu-taa, etc.).

## F. Completeness & consistency

[MINOR] `vishayon-se-samvad › block#0/image` and several others carry `image_url: ""` / empty `portrait_url`/`portrait_prompt` on character_map entries (झूरी, गया, लड़की, स्त्री have empty portrait fields). Per §11 audio is intentionally TTS-empty, and hero `src`s ARE populated (R2 URLs present), so this is mostly fine — but the cultural_context_card for स्वतंत्रता संग्राम and the 4 character portraits ship imageless. — FIX (low priority): either populate or confirm the renderer degrades gracefully.

[MINOR] §8 vocabulary floor check: 28 (शब्द-संपदा pt1) + 15 (pt2) = 43 flashcards + 8 idioms + a grammar workshop + a भाषा संगम table. **Meets every §8 floor** (≥40 words, ≥8 idioms, ≥1 grammar, ≥1 भाषा संगम). Clean.

[MINOR] §5.12 bank-size check: `chapter_practice` has exactly 24 MCQs spanning comprehension/vocab_in_context/grammar/interpretation/inference (all 5 concept_tags present), difficulty 1–5 present. **Meets the mechanical floor** — but see C for the broken item and gameability that the mechanical validator won't catch. — FIX: re-run `validate.mjs 1` after the pr-23 fix.

[MINOR] `abhyas › block#7/callout[threads_of_curiosity]` — खोजबीन links are YouTube *search* URLs ("youtube.com/results?search_query=…"), not the NCERT-printed QR/official links. The PDF p3 shows a real QR code and p23 prints the official भारतीय सांकेतिक भाषा links (youtube.com/@JSLRTC, islrtc.nic.in) — those official links are NOT carried into the खोजबीन callout. — FIX: use the NCERT-printed official links rather than generic search queries.

STATS: pages reviewed=11, critical=2, major=4, minor=14
