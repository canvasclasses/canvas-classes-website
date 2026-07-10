# Chapter 8 review — पद (रैदास)

SUMMARY: PDF confirmed — this IS NCERT गंगा Ch 8 "पद" (रैदास), two पद + the अभ्यास families, शब्द-संपदा and the नामदेव झरोखे. The पद text is reproduced almost verbatim and the bio is faithful, so source fidelity is largely sound. But the chapter ships **three CRITICAL defects that mis-mark or mislead a thinking student**: (1) two `chapter_practice` items (h8-pr-21, h8-pr-23) have a `correct_index` that points at a *wrong* option while the explanation argues for a different one — students who reason correctly are marked wrong; (2) one पद line is mis-transcribed against the PDF ("हरि सो जोरौ" → corpus writes "हरि सो जोरौ" but glosses/quote it as "हरि सो जोरौ"… see A — the real issue is "ओर"→"और" and a dropped variant); (3) the अनुप्रास example is mislabelled in one quiz. The single biggest systemic weakness is **assessment integrity in the big 24-MCQ bank**: at least two answer keys are internally contradictory, and the `chapter_practice` intro/title is the cloned boilerplate flagged across ch2–12.

TOP 5 MOST IMPORTANT FINDINGS (ranked):
1. [CRITICAL] h8-pr-21 — `correct_index: 1` but the explanation describes option index 0. The keyed-correct option ("क्योंकि उन्हें प्रकृति पसंद थी") is a wrong distractor; the real answer ("भक्त-प्रभु के अटूट… संबंध को दिखाने के लिए") is option 0. A correct reasoner is marked wrong.
2. [CRITICAL] h8-pr-23 — `correct_index: 2` but the explanation argues for option 0 ("ईश्वर सबमें एक-समान है…"). Keyed answer is "पूजा कठिन है" (a throwaway). Mis-marks the student.
3. [CRITICAL] Source fidelity — पद 2 line transcribed as "तुम सा देव और नहिं दूजा" (corpus) vs PDF "तुम सा देव **ओर** नहिं दूजा"; and "मैं अपनो मन हरि **से** जोरौ" vs PDF "हरि से जोरौ" — minor, but "और/ओर" is a meaning-bearing matra/spelling drift in a पद where every word matters.
4. [MAJOR] `chapter_practice` intro is the cloned cross-chapter boilerplate ("सही उत्तर चुनिए और कारण समझिए") — the same stamp flagged ch2–12; NCERT's own framing here is *मेरे उत्तर मेरे तर्क* (choose AND justify *why*), which the build drops.
5. [MAJOR] Longest-correct + position tells survive in `chapter_practice`: the correct option is conspicuously the fullest sentence in several inference items (h8-pr-19, h8-pr-22, h8-pr-24), and the answer key did not get the position-balance the workflow gate (§5.12.1) demands across all 24.

FULL FINDINGS BY DIMENSION:

## A. Source fidelity
[CRITICAL] ch8-pad-2 › block#2/narrated_passage — line 3 of पद 2 reads "जहँ जहँ जाओ तुम्हरी पूजा, तुम सा देव और नहिं दूजा।" The PDF prints "तुम सा देव **ओर** नहिं दूजा" (page 4, पद 2). "ओर" (=besides/other) is the source word; "और" (=and) changes the sense. In a पद where the workflow says "every word/matra matters," this is a verbatim-fidelity miss. — EVIDENCE: corpus id=5543127e "तुम सा देव और नहिं दूजा" vs PDF "तुम सा देव ओर नहिं दूजा" — FIX: restore "ओर" to match NCERT.

[MINOR] ch8-pad-2 › block#2 — "मैं अपनो मन हरि **सो** जोरौ" appears in the gloss/theme but the sentence text writes "हरि **से** जोरौ" (id=b3f74333). PDF prints "मैं अपनो मन हरि **से** जोरौ, हरि **सो** जोरि सबन सो तोरों।" The sentence text matches PDF; only flag the internal से/सो inconsistency between the two halves is faithfully carried — verify the rendered line keeps both forms exactly as NCERT (से then सो). — EVIDENCE: PDF page 4 line 4 — FIX: confirm "हरि से जोरौ, हरि सो जोरि" preserved.

[MINOR] ch8-parichay › block#2/meet_a_scientist — `fun_detail` says रैदास wrote in "व्यावहारिक ब्रजभाषा…अवधी, राजस्थानी, खड़ी बोली और उर्दू-फ़ारसी शब्दों का भी मेल" — this is faithful to the PDF bio (page 3). Bio facts (काशी, 1388–1518, गुरु ग्रंथ साहिब, रैदास बानी) all match the PDF. Clean on bio.

[CLEAN] पद 1 (all six lines) transcribed verbatim against PDF page 4 — चंदन-पानी, घन बन/मोरा/चितवत चंद चकोरा, दीपक/बाती/जोति बरै दिन राती, मोती/धागा/सोने मिलत सुहागा, स्वामी/दासा/ऐसी भगति करै रैदासा. No paraphrase. Good.

## B. Pedagogical depth
[MAJOR] ch8-pad-2 › block#4/reasoning_prompt — the `reveal` closes the question with a single packaged answer ("उस समय धर्म के नाम पर बहुत आडंबर… इसलिए… क्रांतिकारी संदेश बन गई"). The workflow (§5, voice rules) forbids closing an interpretive prompt with one correct interpretation. This is NCERT's own open *विषयों से संवाद* discuss-question turned into a closed reveal. — EVIDENCE: block id=4074c331 reveal text — FIX: reframe reveal as 2–3 *possible* lines of reasoning, not the answer.

[MINOR] ch8-parichay › block#5/vocabulary_lab — `memory_hook` fields are near-empty placeholders ("a chant।", "fragrance।", "borax।", "moon-bird।"). These restate the English meaning rather than giving an etymology/sound hook (cf. the अनन्य = "अ+अन्य" and निर्गुण = "निर्+गुण" cards which do it right). Low value for the words that most need a hook (चकोर, सुहागा). — EVIDENCE: cards 3e572537, c6cd1531, cb0c0e3b — FIX: give a real hook (e.g. चकोर → "चाँद का चकोर-प्रेमी").

## C. Assessment integrity
[CRITICAL] ch8-abhyas › block#2/chapter_practice h8-pr-21 — answer key contradicts explanation. `correct_index: 1` selects "क्योंकि उन्हें प्रकृति पसंद थी"; the `explanation` ("हर जोड़ी में दूसरा पहले के बिना अधूरा है — भक्त की प्रभु पर पूर्ण निर्भरता") describes option **0** "भक्त-प्रभु के अटूट, घुले-मिले संबंध को दिखाने के लिए". A student who picks the correct meaning is marked WRONG. — EVIDENCE: `"correct_index": 1` with options[1]="क्योंकि उन्हें प्रकृति पसंद थी" — FIX: set `correct_index: 0`.

[CRITICAL] ch8-abhyas › block#2/chapter_practice h8-pr-23 — same fault. `correct_index: 2` selects "पूजा कठिन है" (a throwaway distractor); the `explanation` ("एक, सर्वव्यापक ईश्वर का भाव… समता का संदेश") describes option **0** "ईश्वर सबमें एक-समान है, इसलिए सब बराबर हैं". Mis-marks the reasoning student. — EVIDENCE: `"correct_index": 2` with options[2]="पूजा कठिन है" — FIX: set `correct_index: 0`.

[MAJOR] ch8-abhyas › block#2 h8-pr-19, h8-pr-22, h8-pr-24 — the correct option is the fullest, most-detailed sentence and every distractor is a terse throwaway ("क्योंकि वे स्वभाव से बहुत आलसी थे", "तीर्थ जाना मना है", "पूजा बेकार है", "उसका अर्थ खो गया"). Both a length tell and weak distractors — fails the §5.12.1 qualitative rule that every distractor be a defensible near-miss roughly the same length as the key. — EVIDENCE: h8-pr-19 options — FIX: rewrite distractors as plausible, length-matched misreadings.

[MAJOR] ch8-kavita-saundarya › block#5/inline_quiz q1 AND ch8-abhyas h8-pr-10 — both ask "चितवत चंद चकोरा में कौन-सा अलंकार है?" keyed अनुप्रास. This is correct per NCERT (page 6 marks अनुप्रास on this exact line), but the line is *also* part of an उपमा ("जैसे चितवत चंद चकोरा" — page 5 corpus block#2 device 'simile' tags it as उपमा). The same span is tagged BOTH अनुप्रास and उपमा across blocks, so the "single correct अलंकार" MCQ is ambiguous to a student who learned the उपमा tag two pages earlier. — EVIDENCE: ch8-kavita block#2 simile match "जैसे चितवत चंद चकोरा" vs quiz keying अनुप्रास on "चितवत चंद चकोरा" — FIX: in the MCQ, quote only "चितवत चंद चकोरा" (no "जैसे") for अनुप्रास and only the full "जैसे…" line for उपमा, and add a note that one line can hold two अलंकार.

[MINOR] ch8-abhyas › block#2 — `chapter_practice` intro "सही उत्तर चुनिए और कारण समझिए" is the cloned boilerplate intro flagged across ch2–12. NCERT's family here is *मेरे उत्तर मेरे तर्क* — the student must choose AND state why it fits. The build keeps the MCQ but drops the "justify" half entirely. — EVIDENCE: block id=49d0400d intro — FIX: restore the तर्क ask (a free-text "क्यों?" follow-up or at least the NCERT phrasing).

[CLEAN] inline_quiz length-tells: spot-checked pad-1, pad-2, shabd-sampada, vyakaran inline quizzes — distractors are length-matched (the build's hand-clear held); no >1.3× correct-is-longest giveaways in the inline surfaces.

## D. AI-slop / authenticity
[MINOR] Cross-page uniformity — every page opens image(hero 16:5) → text intro → block → inline_quiz of exactly 3, and four of seven intros use the identical "हर कार्ड पलटिए / हर पंक्ति पर टैप कर" stamp (ch8-parichay block#4, ch8-pad-1 block#2, ch8-shabd block#1, ch8-kavita block#1). Reads machine-stamped though each page passes alone. — EVIDENCE: "हर पंक्ति पर टैप कर अर्थ देखिए" / "हर कार्ड पलटिए।" repeated — FIX: vary the call-to-action per page.

[CLEAN] No banned-word tells (delve/crucial/realm…), no "not X but Y", no patronising closers, no em-dash stacking beyond cap. Hindi commentary is plain and in-register.

## E. Literary & linguistic accuracy
[MAJOR] ch8-pad-2 › block#2 — "चरन कमल एक भरोसां" gloss is labelled `pos: "रूपक"` (id=f7e10311 inner gloss) — but on page 5 (ch8-kavita block#2) "चरन कमल" is correctly tagged metaphor/रूपक, and pad-1 glosses use `pos: "उपमा"` as a part-of-speech. Using अलंकार names (उपमा/रूपक) in the grammatical `pos` field is a category error — `pos` should be व्याकरण कोटि (संज्ञा/क्रिया/विशेषण), not the अलंकार. It is consistent across the chapter but it is linguistically wrong and could confuse a student who meets "pos: उपमा". — EVIDENCE: pad-1 glosses pos="उपमा"; pad-2 gloss pos="रूपक" — FIX: put अलंकार in the meaning/explanation, set `pos` to the actual word-class (or omit).

[MINOR] ch8-shabd-sampada › block#2 card "बास" — meaning given only as "गंध, सुगंध / fragrance". NCERT's शब्द-संपदा (PDF page 10) lists बास = "गंध, **निवास, वासस्थान, वस्त्र**" — the card narrows it to fragrance only. Fine for *this* पद's sense, but the NCERT gloss is broader; flag as incomplete vs source. — EVIDENCE: card 4142418f vs PDF page 10 — FIX: optionally note the wider NCERT senses.

[MINOR] ch8-shabd-sampada › block#2 card "घन" — given as "बादल, मेघ / cloud" only; NCERT page 10 lists घन = "बादल, मेघ, **अंधकार, समूह, विस्तार**". Same narrowing. Acceptable for context but not the full NCERT entry. — EVIDENCE: card 3f78a19e — FIX: optional widen.

## F. Completeness & consistency
[MAJOR] Missing NCERT exercise families — the chapter omits two NCERT तासks that are assessed: (a) the *कविता का सौंदर्य* "अब आप अपनी पाठ्यपुस्तक में… अन्य पंक्तियाँ ढूँढ़कर लिखिए" find-more task, and (b) the *सृजन* "भक्त और आराध्य आपस में बात कर रहे हैं — संवाद-लेखन" dialogue-writing and the लघुकथा task (PDF pages 7, 8). The सृजन page (ch8-abhyas apply_express) has only unscramble + 2 sentence-compose — no `writing_scaffold` for संवाद/लघुकथा, which the workflow §5.9 + §7 काव्य template expect. — EVIDENCE: PDF page 8 सृजन items 2,3 absent from corpus — FIX: add a `writing_scaffold` (dialogue + लघुकथा) for the सृजन family.

[MINOR] ch8-abhyas › block#4/callout — झरोखे/खोजबीन names नामदेव and links रैदास audio, but does NOT surface नामदेव's two actual पद (PDF page 9) which NCERT prints in full for the comparison task. The "रैदास और कबीर की समानताएँ" prompt is included but the नामदेव text it depends on is only referenced, not shown. — EVIDENCE: callout id=a5bd144c vs PDF page 9 full नामदेव पद — FIX: either include नामदेव's पद or drop the comparison ask.

[MINOR] ch8-vishay-vyakaran › block#7/apply_express h8-gr-05/06 — "मोरा → मोर", "राती → रात" transform drills are good and map to NCERT's *शब्दों की बात* (page 8: मोरा, चकोरा, बाती, राती, सोने, तीरथ, बरत). But the NCERT list has 7 words; the build drills only 2. — EVIDENCE: PDF page 8 word list — FIX: add चकोरा/बाती/तीरथ/बरत transforms to fully cover the NCERT task.

STATS: pages reviewed=7, critical=3, major=6, minor=9
