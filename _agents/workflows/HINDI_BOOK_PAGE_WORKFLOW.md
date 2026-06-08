# Hindi Book Page Builder — Canonical Workflow (Class 9 गंगा)

> Single source of truth for building digital book pages in the **Hindi** track of NCERT Simplified.
> **When building any Class 9 Hindi page, follow this document exactly.**
>
> This doc is a sibling to [`BOOK_PAGE_WORKFLOW.md`](./BOOK_PAGE_WORKFLOW.md) (Science / Math infrastructure) and to [`ENGLISH_BOOK_PAGE_WORKFLOW.md`](./ENGLISH_BOOK_PAGE_WORKFLOW.md) (the literature block engine).
>
> - **Infrastructure** (API endpoints, slug rules, page reorder, hero-banner mechanics, the dark-ground image lock, reading-surface palette) is inherited from `BOOK_PAGE_WORKFLOW.md`.
> - **The literature block engine** (`narrated_passage`, `vocabulary_lab`, `literary_devices_highlighter`, `character_map`, `theme_explorer`, `tone_meter`, `cultural_context_card`, `comprehension_checkpoint`, `writing_scaffold`, `dialogue_role_play`, `pronunciation_drill`, `chapter_practice`, `apply_express`) is shared with English and documented field-by-field in `ENGLISH_BOOK_PAGE_WORKFLOW.md` §4. **Read that section once** — this doc only states the Hindi *overrides*, it does not re-print every field.
>
> Where this document conflicts with either sibling on anything Hindi-specific, **this document wins**.
>
> **Project state** lives in [`_agents/state/LIVE_BOOKS_STATE.md`](../state/LIVE_BOOKS_STATE.md) — refresh with `node scripts/livebooks-state.js` after any content change.

---

## 0. BEFORE YOU BUILD — REQUIRED FOR EVERY HINDI PAGE

Before authoring any page:

1. **Vocabulary mastery is the mission, not chapter-completion.** The single measure of a गंगा page is: *did the student walk away owning Hindi words they can now use in daily life?* Finishing the chapter is secondary. Over-invest in the vocabulary and practice surfaces; under-invest nowhere else.
2. **Apply the scaffold flip on every hard word (see §3).** The target student speaks Hindi fluently at home but does **not** own the literary / *तत्सम* register (निरापद, पराकाष्ठा, सहिष्णुता, विषाद). For every such word, give the **triple bridge**: hard Hindi word → simple Hindi synonym → **English meaning** → memory hook. The English meaning is the anchor a modern teenager actually recognises — it is mandatory, not optional.
3. **You are not paraphrasing literature into worksheets.** गंगा is a literary textbook. प्रेमचंद's words are the centre of the page. Never rewrite a passage in "simpler" Hindi on the page itself — provide glosses and commentary instead. The original text is sacred.
4. **Do not "explain the one meaning of the story."** Literature opens doors. Reasoning prompts and theme cards must stay genuinely open.
5. **State which गंगा exercise family each page maps to.** Add a `ganga_section` tag to the page's `tags` array (e.g. `tags: ["ganga_section:bhasha_se_samvad"]`). Keeps authoring intent visible. The eight families are listed in §6.

If uncertain about scope, stop and ask. Do not pick silently.

---

## 1. What You Are Building

**गंगा** is the new NCERT Class 9 Hindi textbook (NEP 2020 + NCF-SE 2023, first edition March 2026). It is a fresh book — not a revision of *क्षितिज* — with a completely redesigned exercise philosophy (the eight families in §6). The source PDFs live in `Class 9 Hindi/` in the Downloads directory (`ihga1ps.pdf` = prelims, `ihga101.pdf … ihga112.pdf` = the twelve chapters).

**Track:** Class 9 Hindi — गंगा.

**Target reader:**
> A 14-year-old student in a tier-2/tier-3 town. Speaks Hindi (or a dialect) at home and on the street, fluently and confidently. But the Hindi they *own* is everyday-spoken Hindi — they trip on the literary and *तत्सम* register that academic Hindi runs on (निरापद, सहिष्णुता, पराकाष्ठा, विग्रह, अतिशयोक्ति). They have been told "Hindi literature is hard," which feels absurd to them because *they speak Hindi all day*. The gap is vocabulary and register, not the language itself. They light up when a hard Hindi word is unlocked with its plain-Hindi synonym **and** its English meaning — because now it connects to words they already use in both languages.

**The NCERT vision behind गंगा (from the आमुख / यह पुस्तक forewords):**
1. Hindi must move from "a subject you pass" to "the language you think and discuss in" — *"हिंदी उनके विमर्श और ज्ञान-विज्ञान की भाषा भी बन सके।"*
2. Kill rote learning — *"रटने पर आधारित पद्धतियों का त्याग।"* Make the Hindi period a joy — *"हिंदी की घंटी आनंददायी हो।"*
3. Push beyond the text into analytical, interdisciplinary, creative, language-play work (the eight exercise families).

A Live Book — tap-to-understand glosses, audio narration, a personal Word Vault, adaptive practice — is the ideal vehicle for all three.

**The promise of every गंगा page:**
1. You hear प्रेमचंद / रैदास / निराला's voice clearly, even where the words are old or literary.
2. You can tap any hard Hindi word and instantly get it in **simple Hindi + English** — without losing your reading momentum.
3. You leave the page owning 3–5 new Hindi words you could actually use tomorrow.

**Mindset shifts from the English (Kaveri) workflow:**

| English (Kaveri) | Hindi (गंगा) |
|---|---|
| Literature in English; Hindi gloss scaffolds the hard English word | Literature in Hindi; **English gloss + simple-Hindi synonym** scaffold the hard Hindi word — the **scaffold flips** |
| Reader's home language (Hindi) is the helper | Reader's home register (spoken Hindi) is *close but not enough*; the helper is **simple Hindi + English together** |
| Target gap: ~20% of literary English vocabulary | Target gap: the literary / *तत्सम* Hindi register + पुराने/देशज words (काँजीहौस, पगहिया, टिटकारना) |
| Goal: enjoy an English story | Goal: **gain mastery and comfort in Hindi** — own the words, use them in life |

---

## 2. Relationship to the Sibling Docs

| Concern | Where it lives |
|---|---|
| API endpoint, request body, page reorder, slug rules | `BOOK_PAGE_WORKFLOW.md` §2 — unchanged |
| Reading-surface palette (`#121316` page / `#181A21` chrome, not pure black) | `BOOK_PAGE_WORKFLOW.md` §1.5 — inherited |
| Hero banner mechanics (16:5, dark ground, no caption) | `BOOK_PAGE_WORKFLOW.md` §3.4.1 — inherited; Hindi uses watercolour, see §10 |
| One page = one sub-topic | `BOOK_PAGE_WORKFLOW.md` §4D — inherited, strictly enforced |
| The 13 literature block types — full field reference | `ENGLISH_BOOK_PAGE_WORKFLOW.md` §4 — **read once**; Hindi overrides are in §5 below |
| Re-used base blocks (`text`, `heading`, `callout`, `image`, `comparison_card`, `timeline`, `table`, `inline_quiz`, `worked_example`, `curiosity_prompt`, `reasoning_prompt`, `meet_a_scientist`, `section`) | Inherited; Hindi mapping in §4 below |
| Blocks NOT used (`simulation`, `latex_block`, `molecule_2d/3d`, `interactive_image`, `classify_exercise`, `animation`, `practice_link`) | Not used on Hindi pages |
| **The scaffold flip — the core design principle** | §3 below |
| Hindi block overrides (glosses, triple-bridge vocab, Hindi devices) | §5 below |
| The eight गंगा exercise families → blocks crosswalk | §6 below |
| Page templates (गद्य and काव्य) | §7 below |
| Vocabulary & language-mastery mandate (quantitative targets) | §8 below |
| Voice & tone for Hindi | §9 below |
| Image style | §10 below |
| Audio (Hindi TTS-first) | §11 below |
| Devanagari & transliteration rules | §12 below |
| Pre-publish checklist | §13 below |
| Schema work accompanying this doc (the small code changes) | §14 below |
| Building the गंगा book record + chapter list | §15 below |

---

## 3. THE SCAFFOLD FLIP — The Core Design Principle

This is the heart of the Hindi track. Everything else serves it.

In the English book, a Hindi gloss helps a Hindi-speaking kid decode a hard *English* word. In the Hindi book we **flip the direction**: we help a Hindi-speaking kid decode a hard *Hindi* word using the two anchors they actually hold — **simple everyday Hindi** and **English**.

Every hard word gets the **triple bridge**:

```
निरापद   →   सुरक्षित, निर्विघ्न   →   "safe, free from danger"   →   नि (बिना) + आपद (विपत्ति) = बिना-विपत्ति
(hard word)   (simple Hindi)          (English anchor)               (memory hook)
```

**Why English is mandatory, not decoration:** the modern teenager recognises "safe" instantly. From "safe" they reach back and lock in निरापद. Without the English anchor, a Hindi-only synonym (सुरक्षित) sometimes lands — but for the hardest *तत्सम* words even the "simple" synonym is unfamiliar, and English is the only rope the kid can grab. Give both anchors every time; the student takes whichever they need.

**Where the triple bridge appears:**
- Inside `narrated_passage` glosses (tap a hard word in the story → simple-Hindi + English popover). See §5.1.
- On every `vocabulary_lab` card (the dedicated word-workshop pages). See §5.2.
- This is non-negotiable on both surfaces.

**Transliteration is a fourth, smaller bridge.** Many target students read Devanagari slowly. A light Roman transliteration (`ni-raa-pad`) in the `pronunciation` field both speeds recognition and fixes the correct pronunciation. Always include it for vocabulary cards; optional inside story glosses. Scheme in §12.

---

## 4. Re-used Base Blocks — Hindi Mapping

Same blocks as the science/English workflows. Hindi-specific notes:

| Block | Hindi use |
|---|---|
| `meet_a_scientist` | Rendered as **"लेखक से मिलिए"** (Meet the Author). One per chapter, on the परिचय page. Populate: `name`, `years`, `contribution` (bold the best-known work, e.g. **गोदान**), `connection` (one line tying the author to *this* chapter — mandatory), `fun_detail` (humanising — प्रेमचंद resigned a government job for the असहयोग आंदोलन), `learn_more`. |
| `curiosity_prompt` | Block 1 on every परिचय page. An open question, no jargon, personal connection ("क्या आपने कभी किसी जानवर से दोस्ती महसूस की है?"). |
| `reasoning_prompt` | **Always interpretive** on Hindi pages (carrier value `reasoning_type: 'logical'`; the UI doesn't surface the type). Ask the student to justify a reading *from the text*. Never "कहानी की सीख क्या है?" (closed). Instead "मोती बार-बार लौट आता है — लेखक इससे आज़ादी के बारे में क्या कहना चाहते हैं?" |
| `inline_quiz` | Closes every page. 3 questions: स्मरण (recall) → समझ (comprehension) → व्याख्या (interpretation). |
| `worked_example` | For the "कहानी की रचना" / model-answer items. `variant: 'ncert_intext'`, `reveal: 'tap_to_reveal'` — student attempts before revealing. |
| `comparison_card` | हीरा vs मोती; कहानी के आरंभ vs अंत में पात्र का भाव; दो कविताओं की तुलना. Max 3 columns. |
| `table` | Reused for the भाषा संगम word-across-languages list and as the fallback for the गद्य "कहानी का सौंदर्य" device table (see §5.3). **Body cells render at body-paragraph size (`text-[17px]`) — never author or introduce a smaller-print table. See BOOK_PAGE_WORKFLOW §3.8.** |
| `callout` | Variants below. |

**Callout variants for Hindi** (on top of the science set):

| Variant | Hindi purpose |
|---|---|
| `india_voice` | Deepen Indian context — the author's युग, a contemporary writing the same theme, a भक्तिकाल/स्वतंत्रता-आंदोलन connection. (Reused from English; relabel न करें — the content is Indian by default.) |
| `sahitya_aur_jeevan` *(≈ `literature_in_life`)* | How the human situation plays out in the student's life today. Place near the end of a भाव/विषय page. Use the existing `literature_in_life` variant key. |
| `fun_fact` | A striking line, a fact about the author, a related दोहा/लोकोक्ति. |
| `threads_of_curiosity` | Literary trivia + the खोजबीन links (NCERT video/audio links go here). |
| `remember` | A key term to internalise (मुहावरा, अलंकार, व्यंग्य). |
| `warning` | Common reading mistake ("लेखक और पात्र को एक मत समझिए")। |

`exam_tip` is **skipped** on Class 9 Hindi — exam framing dilutes literary engagement.

---

## 5. Hindi Block Overrides

Only the deltas from `ENGLISH_BOOK_PAGE_WORKFLOW.md` §4 are listed. Everything not mentioned is identical.

### 5.1 `narrated_passage` — glosses run the scaffold flip

The heart of every reading page. प्रेमचंद's text, verbatim, with tap-for-meaning glosses and per-sentence audio.

**Override — the gloss shape carries simple Hindi + English:**

```json
{
  "word": "निरापद",
  "meaning": "सुरक्षित, निर्विघ्न — safe, free from danger",
  "pos": "विशेषण",
  "example": "क़िले की मोटी दीवारों के भीतर राजा ख़ुद को निरापद महसूस करता था।"
}
```

- `word` — exact substring of the sentence text (the hard Hindi word).
- `meaning` — the triple bridge in one field: **simple Hindi synonym — English meaning**, em-dash separated. This renders cleanly in the existing gloss popover with **no renderer change** (the popover shows `pos` + `meaning` + `example`). The simple Hindi comes first (the kid's home register), the English anchor after the em-dash.
- `pos` — व्याकरण कोटि in Hindi (संज्ञा, विशेषण, क्रिया, क्रिया-विशेषण, मुहावरा).
- `hindi` field — **leave empty** on Hindi glosses. We do not repurpose it; combining both anchors in `meaning` avoids the "हिंदी:" label mismatch entirely and needs zero code.
- `example` — a *new everyday sentence* using the word (different from प्रेमचंद's, so the student sees it transferred to modern life).

> The dedicated `vocabulary_lab` cards (§5.2) get the *labelled* triple bridge (separate **सरल अर्थ** / **English** lines) via the `lang: 'hindi'` switch. Story glosses use the lighter combined-`meaning` form above — same information, no popover code change.

**Gloss budget:** 1–3 per sentence, ~1 per 40 words of passage (slightly denser than English — the *तत्सम* gap is real). Gloss only words a fluent Hindi *speaker* would still miss in writing: तत्सम/literary words (निरापद, सहिष्णुता), पुराने/देशज words (काँजीहौस, पगहिया, टिटकार, गोई), and shifted-meaning words. Do **not** gloss everyday words.

`hinglish_commentary` (the teacher-voice paragraph under each story beat) is **optional** for Hindi and used sparingly — the text is already Hindi, so the kid doesn't need a re-telling, only the occasional one-line context nudge ("देखो — यहाँ बैल इंसानों की तरह सोच रहे हैं; यही कहानी की जान है"). One per block maximum; often zero.

Passage length, splitting, and image-pairing rules: same as English §4.1.

### 5.2 `vocabulary_lab` — the triple-bridge word workshop (THE centrepiece)

This block is where the vocabulary mission lives. Author it richer than any other block.

**Triple-bridge card shape (mode `flashcards`):**

```json
{
  "id": "uuid",
  "word": "निरापद",
  "pronunciation": "ni-raa-pad",
  "audio_url": "",
  "pos": "विशेषण",
  "meaning": "सुरक्षित; आपत्ति या ख़तरे से रहित",
  "english": "safe; free from danger",
  "example": "क़िले की मोटी दीवारों के भीतर राजा ख़ुद को निरापद महसूस करता था।",
  "memory_hook": "नि (बिना) + आपद (विपत्ति) = बिना-विपत्ति = सुरक्षित।"
}
```

**Card semantics (Hindi mode):**
- Front: the hard Hindi `word` (large, Devanagari) + `pronunciation` (transliteration) + `pos`.
- Back: **सरल अर्थ** = `meaning` (simple Hindi) · **English** = `english` · **उदाहरण** = `example` · **याद रखें** = `memory_hook`.

This requires one small schema addition — a new optional `english` field on the vocab card and a `lang: 'hindi'` flag on the block that swaps the back-of-card labels. See §14. (The user has approved this small build.) Author all Hindi vocab cards with the `english` field populated now.

**The शब्द-संपदा extraction protocol (do this for every chapter):**
1. Open the chapter's **शब्द-संपदा** glossary (NCERT prints it at the end of every chapter — e.g. दो बैलों की कथा lists ~50 words with Hindi meanings). This is your pre-selected word list — NCERT already chose the exact words students trip on. Do not invent a different list.
2. For each word, NCERT gives you the **simple-Hindi meaning** for free → that is the `meaning` field.
3. **You add**: the `english` meaning, the `pronunciation` (transliteration), a fresh everyday `example`, and a `memory_hook` (etymology split, sound-alike, or vivid image — skip if forced).
4. Also harvest words glossed inside the `narrated_passage` so the workshop and the story agree.
5. Split a ~50-word glossary across the chapter: ~25–30 on the dedicated शब्द-संपदा vocabulary page, the rest surfaced as story glosses + a self-check.

**Modes for Hindi:**
- `flashcards` — the शब्द-संपदा words. Default, mandatory, every chapter.
- `idioms` — **मुहावरे**. Every चैप्टर of गंगा is idiom-rich (दो बैलों की कथा alone: मन फीका करना, जान से हाथ धोना, ईंट का जवाब पत्थर से, दाँतों पसीना आना). Card shows the मुहावरा, its अर्थ (simple Hindi + English), and a प्रयोग sentence. Mandatory on the idioms page.
- `affixes` — **उपसर्ग / प्रत्यय**. Card shows मूल शब्द + उपसर्ग/प्रत्यय + नया शब्द + अर्थ (e.g. अप + मान = अपमान). Use when the chapter's भाषा से संवाद covers word-formation.
- `binomials` — rarely needed for Hindi; skip unless a chapter warrants it.

**`self_check`** — up to 3 MCQs per vocab block ("किस शब्द का अर्थ *सुरक्षित* है?"). Always include on the main शब्द-संपदा page so the word sticks immediately.

**Word Vault:** every card carries a "+ शब्दकोश में जोड़ें" save button (the existing Word Vault). Across all 12 chapters the student builds a personal Hindi word-bank they can revise — this *is* the "use it in daily life" mechanism. Author every card assuming it will be revised out of context, so `meaning` + `english` must stand alone.

### 5.3 `literary_devices_highlighter` — Hindi अलंकार & narrative features

Two uses, split by खंड:

**(a) काव्य (poetry, chapters 8–12) — classical अलंकार.** The highlighter shines here: highlight the अलंकार span in a दोहा/पंक्ति and explain it. Use a **Hindi display-label layer** over the existing English device enum (no enum change needed):

| Devanagari label | Existing enum key |
|---|---|
| अनुप्रास | `alliteration` |
| उपमा | `simile` |
| रूपक | `metaphor` |
| मानवीकरण | `personification` |
| अतिशयोक्ति | `hyperbole` |
| बिंब / चित्रात्मकता | `imagery` |
| प्रतीक | `symbolism` |
| तुक | `rhyme` |
| ध्वन्यात्मकता | `onomatopoeia` |

At least one highlighter on every poetry page.

**(b) गद्य (prose) — narrative features ("कहानी का सौंदर्य").** NCERT's own table names चित्रात्मक भाषा, संवादात्मकता, विरोधाभास, व्यंग्य, संघर्ष, अतिशयोक्ति, संदेह — with two examples each. चित्रात्मक भाषा and अतिशयोक्ति map to the enum; the rest (व्यंग्य, विरोधाभास, संवादात्मकता, संदेह) do **not**. Two paths:
- **Recommended:** extend the device enum with Hindi narrative keys `vyangya`, `virodhabhas`, `samvadatmakta`, `sandeh` + their Hindi labels (small §14 addition). Then the highlighter works for prose too — and NCERT's "उदाहरण खोजकर लिखिए" task becomes a tap-to-highlight game.
- **Zero-code fallback:** render the device table as a `table` block (विशेषता | अर्थ | उदाहरण), exactly as NCERT prints it, and turn "find a second example" into a `comprehension_checkpoint` or `apply_express` item.

For Chapter 1, author it **both ways is overkill** — pick the highlighter-with-extension if §14 ships before the device page, else the table fallback. Flag the choice in the page outline.

### 5.4 `character_map` — पात्र परिचय

Same as English §4.4. हीरा, मोती, झूरी, गया, झूरी की स्त्री, छोटी लड़की (भैरो की). `bio` in simple Hindi; `traits` 2–4 concrete adjectives (धैर्यवान, सहनशील, स्वाभिमानी, क्रोधी). One per chapter on the पात्र page (skip for chapters with ≤2 characters — but दो बैलों की कथा warrants one). Portraits: watercolour, dark ground (§10).

### 5.5 `theme_explorer` — भाव / विषय

Same as English §4.5. For दो बैलों की कथा: "स्वतंत्रता सहज नहीं मिलती — उसके लिए बार-बार संघर्ष करना पड़ता है", "मित्रता और सहयोग की शक्ति", "अन्याय सहना भी अन्याय में भागीदारी है". `title` = phrase, `description` = neutral 1–2 sentences, `evidence` = 1–3 verbatim quotes, `reflection_prompt` = points outward to the student's life. 2–4 themes. Place on the भाव/विषय page.

### 5.6 `tone_meter` — भाव-यात्रा

Same as English §4.6. Especially strong for दो बैलों की कथा's rebellion arc (आत्मीयता → अपमान → विद्रोह → आज़ादी का उल्लास → बंदी का विषाद → घर वापसी का सुख) and **mandatory on every poetry page** (झाँसी की रानी's मूड swings, घर की याद's longing). `emotion` = one Hindi word you want internalised (आत्मीयता, विषाद, विद्रोह, उल्लास, करुणा, ओज). 4–8 segments.

### 5.7 `cultural_context_card` — संदर्भ

Same as English §4.7. For गंगा the references are historical/social/agricultural rather than Western: **काँजीहौस** (the colonial cattle-pound = jail metaphor), the **स्वतंत्रता आंदोलन / असहयोग आंदोलन** behind the allegory, **कृषि-संस्कृति** (बैल, हल, नाँद), **पशुओं के अधिकार / कानून**. Also the natural home for **भाषा संगम** when it needs an image; for a plain word-list use a `table` instead. Categories: `place`, `person`, `event`, `concept`, `tradition`. Max 3 per page.

### 5.8 `comprehension_checkpoint` — बीच-बीच में जाँच

Same as English §4.8. Drop between `narrated_passage` beats in a long story so reading stays active. 1–2 questions; open-ended allowed.

### 5.9 `writing_scaffold` — सृजन

Same as English §4.9. गंगा's सृजन + गतिविधियाँ families are rich: **डायरी** (हीरा/मोती की डायरी), **समाचार** (news report of the escape), **पत्र** (थानाध्यक्ष को शिकायती पत्र, अभिनंदन-पत्र), **कहानी का नया अंत**, **भाषण** ('पशुओं के अधिकार' पर). `format` enum already covers `letter`, `diary_entry`, `speech`, `paragraph`, `essay`, `dialogue`, `notice`. Each gives a full annotated **model** in Hindi (the model answer is Hindi — that's the lesson) with `annotation` = *यह क्यों अच्छा है*. Always show a complete model, never a fill-in-the-blank worksheet.

### 5.10 `dialogue_role_play` — संवाद / भाषण

Same as English §4.10. Two big uses in गंगा:
- **Chapter 6 रीढ़ की हड्डी is a one-act play (एकांकी)** — heavy `dialogue_role_play` in `dialogue` mode; the student plays a character.
- **Chapter 9 राम-लक्ष्मण-परशुराम संवाद** is a dialogue — role-play the परशुराम–लक्ष्मण exchange.
- **Debate mode** for गतिविधियाँ ("पशुओं को काम पर लगाना उचित है — पक्ष/विपक्ष") with Hindi sentence frames.

### 5.11 `apply_express` — productive Hindi practice (incl. grammar)

Same engine as English §4.x (the productive challenge block). This is the second pillar of the practice system — the student *produces*, not just clicks. Hindi mapping of the existing challenge kinds:

| Challenge kind | Hindi use |
|---|---|
| `fill_blank` | रिक्त स्थान — लिंग/वचन परिवर्तन, संधि-विच्छेद (विद्या + आलय → ____), क्रिया रूप |
| `word_builder` | उपसर्ग/प्रत्यय निर्माण (अप + मान → अपमान; मानव + ता → मानवता) |
| `sentence_compose` | मुहावरे/नए शब्द से अपना वाक्य बनाओ (the production goal) |
| `unscramble` | कहानी की यादगार पंक्ति को क्रम में लगाओ |
| `predict_word` | अगला शब्द पहचानो |

For समास-पहचान and other classification, use `chapter_practice` MCQs. Optional future kinds (`sandhi_join`, `samas_identify`) are noted in §14 but **not required for Chapter 1** — reuse the existing kinds first.

### 5.12 `chapter_practice` — adaptive अभ्यास

Same as English. The adaptive MCQ bank that anchors every chapter's practice page. Author **at least 24 MCQs** (target 24–26) per chapter spanning समझ (comprehension), शब्द-अर्थ (vocab-in-context), व्याकरण (grammar), व्याख्या (interpretation), अनुमान (inference). NCERT's *मेरे उत्तर मेरे तर्क* MCQs (which ask the student to also justify *why* the answer fits) seed the comprehension + interpretation slices. `session_size` 8, `pass_threshold` 0.7.

#### 5.12.1 Question-quality rubric — MANDATORY (the gate the whole book is judged by)

> **This page is the graded "make it stick" surface a parent or top-school teacher will judge the product by. It must be genuinely hard to game and impossible to pass without having read the chapter.** Added 2026-06-06 after an audit of the first build found that **a student tapping the *first* option every time scored 98%** (594 of 608 MCQs had the answer at position A) and the inline reading-quiz correct answer was the *longest* option ~73% of the time. Mirrors the Kaveri rubric (`ENGLISH_BOOK_PAGE_WORKFLOW.md §4.15`). The lesson: balance **answer position** and **option length** *as you author*, never default `correct_index` to 0.

**A. Mechanical rules — enforced by `node scripts/hindi-fix/validate.mjs [chapter]`. A chapter is NOT done until it PASSES (exit 0).**

| # | Rule | Threshold |
|---|---|---|
| 1 | **Bank size** | ≥ 24 questions (target 24–26) |
| 2 | **Concept coverage** | all 5 `concept_tag`s present; each ≥ 2 (target ≥ 4) |
| 3 | **Difficulty spread** | levels 1–5 all present; no single level > 50% of the bank |
| 4 | **Answer-position balance** | correct answer spread across A/B/C/D; **no position > 40%** and **none ever 0%**. Vary `correct_index` as you write — never default to 0/A. ("Always pick the first option" must score no better than chance.) |
| 5 | **Length tell** | ZERO questions where the correct option is > 1.3× the next-longest distractor, measured in **rendered grapheme clusters** (`Intl.Segmenter`), not `String.length` — Devanagari matras inflate code-unit length, so a code-unit count over-flags. Options under 12 graphemes are exempt (a 4-grapheme grammar term can't be a "visible" tell). "Correct-is-longest" > 40% is a warning. |
| 6 | **Option hygiene** | exactly **4 options** per question; no duplicate option texts; `correct_index` in range |
| 7 | **Reasoning share** | ≥ 60% of the "content" questions (i.e. excluding the vocab + grammar slices) must be genuine higher-order Qs — `interpretation`/`inference` or a "क्यों/कैसे/किस भाव/क्या दर्शाता है" that makes the student *explain*, not just recall. |

**B. Qualitative rules — the machine can't judge these; the authoring agent must, every question.**

1. **Every distractor is a real, defensible mistake** a student who half-read the chapter could pick — and **roughly the same length as the correct option** (a terse wrong option next to a full-sentence right one is both a length tell *and* a weak distractor). No throwaway/joke options, no "सभी सही/कोई नहीं". Aim for ≥ 1 near-miss distractor per vocab/inference question.
2. **Test thinking, not memory.** Turn facts into reasoning: don't ask *what* a detail is, ask *why the writer included it* or *what it shows*. Pure fact-recall ≤ ~15% of the bank, only for genuinely foundational facts.
3. **Factual grounding (anti-hallucination).** Every question, answer, and premise traces to the actual chapter text (गद्य/पद). Never harden a shaky claim into a question.
4. **Voice.** Plain Hindi for tier-2/3 town students (§9). Explanations *teach* in 1–2 sentences — they don't restate the answer.
5. **Both halves.** If a chapter has both prose and poem (or play + glossary), the bank tests both.

The same **answer-position + length-tell** discipline applies to the smaller MCQ surfaces too — `inline_quiz`, `comprehension_checkpoint.options`, `vocabulary_lab.self_check`, and `apply_express.form_select`. The validator checks answer-position on all of them, gates the graded `chapter_practice` banks on the full rubric, **and (as of 2026-06-06) also hard-gates the `inline_quiz` blocks on zero >1.3× length giveaways** — the full गंगा book was hand-cleared to that bar (distractors rewritten fuller, never the correct option trimmed). When you write a new inline quiz, length-match the distractors to the correct option so it stays clean. Tip from that pass: Devanagari grapheme counts run a few clusters longer than they look, so give a rewritten distractor ~5 graphemes of headroom past the `correct ÷ 1.3` target.

#### 5.12.2 The fix / audit toolchain (`scripts/hindi-fix/`)

If you (re)build or inherit a chapter that fails the gate, these reversible tools fix it (each writes a backup; `--rollback` restores; dry-run is the default):

```bash
node scripts/hindi-fix/validate.mjs [ch]            # the gate — run FIRST and LAST
node scripts/hindi-fix/balance_positions.js --write # spread correct answer A/B/C/D across ALL MCQ surfaces (reorder only, never changes text; reorders form_select option_reasons in parallel)
node scripts/hindi-fix/inline_lengthfix.js --write  # strip English-gloss parentheticals off correct inline options (the one provably-safe length trim)
node scripts/hindi-fix/practice_topup.js --write    # fix graded-bank length giveaways + top a bank up to ≥24 with reasoning Qs
```

**Best practice: author it right the first time** — vary `correct_index`, keep distractors length-matched and plausible — so you never need the fixers. Run `validate.mjs <ch>` before considering a chapter done. Note: `balance_positions.js` assumes explanations reference option **content**, not a letter/position ("विकल्प अ", "पहला विकल्प") — never write those.

---

## 6. The Eight गंगा Exercise Families → Block Crosswalk

NCERT replaced the old "प्रश्न-अभ्यास" with eight named families. This table is the mechanical crosswalk — when you build a page, find the family and use the mapped blocks. Tag the page with the family's `ganga_section` key.

| # | Family (NCERT) | `ganga_section` tag | Maps to blocks |
|---|---|---|---|
| 1 | **रचना से संवाद** — *मेरे उत्तर मेरे तर्क* (MCQ + justify), *मेरी समझ मेरे विचार* (discuss), *मेरी कल्पना मेरे अनुमान* (imagine), *मेरे अनुभव मेरे विचार* (personal) | `rachna_se_samvad` | `chapter_practice` (the justified MCQs) + `reasoning_prompt` (समझ/विचार) + `theme_explorer.reflection_prompt` (अनुभव) + `comprehension_checkpoint` |
| 2 | **विधा से संवाद** — *कहानी की पड़ताल*, *कहानी का सौंदर्य* (devices), *कहानी की रचना* | `vidha_se_samvad` | `literary_devices_highlighter` or `table` (सौंदर्य) + `worked_example` (रचना) + `reasoning_prompt` |
| 3 | **विषयों से संवाद** — interdisciplinary (इतिहास/स्वतंत्रता, पशुओं के लिए कानून, धरोहर-संस्कृति, अलग-अलग और साथ-साथ) | `vishayon_se_samvad` | `cultural_context_card` + `theme_explorer` + `reasoning_prompt` + `comparison_card` |
| 4 | **सृजन** — डायरी, समाचार, नया अंत, चित्रकथा | `srijan` | `writing_scaffold` + `apply_express` |
| 5 | **भाषा से संवाद** — *मेरे शब्द* (vocab), *भाषा गढ़ते मुहावरे* (idioms), व्याकरण, भारतीय सांकेतिक भाषा | `bhasha_se_samvad` | **`vocabulary_lab`** (flashcards triple-bridge + idioms mode) + `apply_express` (grammar) — the mastery core |
| 6 | **गतिविधियाँ** — कविता/अभिनंदन-पत्र, भाषण, शीर्षक, पहेली | `gatividhiyan` | `writing_scaffold` (पत्र/भाषण) + `dialogue_role_play` + `apply_express` |
| 7 | **भाषा संगम** — एक शब्द अनेक भारतीय भाषाओं में (बैल → वृषभ/बलद/गोरु/एड्दु…) | `bhasha_sangam` | `table` (word × language) or `cultural_context_card` (category: tradition) |
| 8 | **खोजबीन** — ऑडियो/वीडियो/प्रिंट links | `khojbeen` | `callout[threads_of_curiosity]` with the links, or a `video` block |
| — | **शब्द-संपदा** glossary (every chapter end) | `bhasha_se_samvad` | **`vocabulary_lab`** flashcards — the extraction source (§5.2) |

---

## 7. Page Templates

One चैप्टर ≈ **9–11 pages**, one page = one purpose. Order roughly follows: परिचय → कहानी (read) → शब्द/मुहावरे (vocab) → पात्र/भाव → सौंदर्य → विषय → सृजन → अभ्यास.

### गद्य (prose) chapter — e.g. दो बैलों की कथा

| Page | Purpose | `ganga_section` | Block sequence |
|---|---|---|---|
| 1 | **परिचय / लेखक से मिलिए** | (front) | image(hero) · curiosity_prompt · meet_a_scientist("लेखक से मिलिए") · callout[india_voice] · vocabulary_lab(flashcards, pre-teach 6–8 words) · inline_quiz |
| 2–4 | **कहानी (one per story beat / NCERT भाग)** | — | image(hero, scene) · heading[2] · text(orientation) · cultural_context_card? · narrated_passage · comprehension_checkpoint · narrated_passage? · image(scene) · reasoning_prompt · inline_quiz |
| 5 | **शब्द-संपदा (vocabulary)** ⭐ | `bhasha_se_samvad` | image(hero) · text(intro) · vocabulary_lab(flashcards, 25–30 triple-bridge cards, with self_check) · inline_quiz |
| 6 | **मुहावरे (idioms)** | `bhasha_se_samvad` | image(hero) · text(intro) · vocabulary_lab(idioms) · apply_express(sentence_compose with idioms) · inline_quiz |
| 7 | **पात्र व भाव-यात्रा** | `rachna_se_samvad` | image(hero) · character_map · tone_meter · comparison_card(हीरा vs मोती) · reasoning_prompt · inline_quiz |
| 8 | **कहानी का सौंदर्य (devices)** | `vidha_se_samvad` | image(hero) · text · literary_devices_highlighter (or table) · worked_example(कहानी की रचना) · inline_quiz |
| 9 | **विषयों से संवाद** | `vishayon_se_samvad` | image(hero) · cultural_context_card(काँजीहौस / स्वतंत्रता / कृषि) · theme_explorer · callout[sahitya_aur_jeevan] · reasoning_prompt · inline_quiz |
| 10 | **सृजन व गतिविधियाँ** | `srijan` | image(hero) · writing_scaffold(डायरी or समाचार) · apply_express(grammar: उपसर्ग/प्रत्यय) · dialogue_role_play(भाषण/debate) · inline_quiz |
| 11 | **अभ्यास / Practice** ⭐ | `rachna_se_samvad` | image(hero) · chapter_practice(20–25 MCQs) · apply_express(mixed productive) · table(भाषा संगम) · callout[threads_of_curiosity](खोजबीन links) |

The two ⭐ pages (vocabulary, practice) carry the mission — over-invest there.

### काव्य (poetry) chapter — e.g. झाँसी की रानी

| Page | Purpose | Block sequence |
|---|---|---|
| 1 | **परिचय / कवि से मिलिए** | image · curiosity_prompt · meet_a_scientist("कवि से मिलिए") · callout[india_voice] · inline_quiz |
| 2–3 | **कविता (read)** | image · narrated_passage(paragraph = छंद/पद, audio per line) · tone_meter(**mandatory**) · literary_devices_highlighter(अलंकार, **mandatory**) · reasoning_prompt · inline_quiz |
| 4 | **शब्द-संपदा** ⭐ | vocabulary_lab(flashcards triple-bridge) · self_check · inline_quiz |
| 5 | **भाव व अलंकार** | theme_explorer · literary_devices_highlighter · comparison_card · reasoning_prompt · inline_quiz |
| 6 | **सृजन व अभ्यास** ⭐ | writing_scaffold · apply_express · chapter_practice · भाषा संगम |

Genre-driven tweaks: **एकांकी (Ch 6 रीढ़ की हड्डी)** → lead with `dialogue_role_play`; **साक्षात्कार (Ch 4 लता मंगेशकर)** → the passage is Q&A, use `narrated_passage` with speaker labels + `dialogue_role_play`.

---

## 8. Vocabulary & Language-Mastery Mandate (quantitative)

Because mastery — not completion — is the goal, every chapter must hit these floors:

- **≥ 40 vocabulary words** delivered with the full triple bridge (≈ the शब्द-संपदा list + story glosses). Split: ~25–30 on the dedicated शब्द-संपदा page, the rest as story glosses.
- **≥ 8 मुहावरे** on the idioms page, each with अर्थ (Hindi + English) + प्रयोग.
- **≥ 1 grammar workshop** via `apply_express` (उपसर्ग/प्रत्यय/समास/संधि as the chapter's भाषा से संवाद dictates).
- **≥ 1 भाषा संगम** word-across-Indian-languages table.
- **Every vocab card has a Word Vault save button** — the cross-chapter revision bank.
- **Every vocab/idiom page ends with a `self_check`** so the word locks immediately.
- **20–25 adaptive practice MCQs** + a productive `apply_express` set on the practice page.

If a chapter's शब्द-संपदा list is shorter than 40, top up from words glossed in the passage — never pad with everyday words the student already owns.

---

## 9. Voice & Tone for Hindi

**Authoring voice (in `text`, `intro`, `annotation`, `meaning` fields):**
- **Second person, सहज (informal-respectful) register** — *तुम पढ़ते हो*, *तुमने देखा*, *सोचो*. Warm, like a favourite teacher.
- **Write the commentary in simple, spoken Hindi — do NOT out-Sanskritise the textbook.** The whole point is to *bridge* the literary register, not add to it. If your own sentence needs a गलोस, rewrite it.
- **English is allowed and encouraged in the gloss/meaning fields** (that's the scaffold), but keep the body commentary primarily Hindi — code-switch only for the anchor word.
- **Name the भाव.** When a passage turns to विषाद or विद्रोह, say so — the student isn't always sure when the mood shifts.
- **Lead with what the student already feels.** A town teenager knows what अपमान and दोस्ती feel like. Open there, not with "इस पाठ में हम प्रतीकात्मकता का अध्ययन करेंगे।"

**What NOT to do:**
- ❌ Don't rewrite प्रेमचंद's passage into "easier Hindi" on the page. Original verbatim; glosses do the work.
- ❌ Don't give a Hindi-only gloss with no English anchor for a *तत्सम* word — that's the exact failure this track exists to fix.
- ❌ Don't close an interpretive prompt with one correct answer ("कहानी की सीख यह है कि…").
- ❌ Don't end a page with "क्या यह कहानी प्रेरणादायक नहीं थी?" — patronising. End with the inline_quiz.
- ❌ Don't translate proper nouns (हीरा, मोती, झूरी, काशी stay as printed).
- ❌ Don't over-Sanskritise the commentary to "sound literary." Plain Hindi + English anchor wins.

---

## 10. Image Style — Watercolour (inherited), with folk-art accents allowed

Inherit the **watercolour house style** from `ENGLISH_BOOK_PAGE_WORKFLOW.md` §7 — loose luminous washes, soft wet-on-wet bleeds, granulation, visible paper grain, **glowing against a DARK ground** (the platform dark-ground lock from `BOOK_PAGE_WORKFLOW.md` §3.4.2 is absolute). This keeps all Live Books visually consistent.

Hindi-specific:
- Subjects are Indian village / historical / devotional scenes — प्रेमचंद's गाँव (kachcha houses, नाँद, बैल, खलिहान), झाँसी की रानी's battlefield, रैदास's भक्ति setting. Default to Indian visual culture; never Western.
- **Folk-art motif accents are allowed** (Madhubani / Warli line borders, the warm-orange गंगा palette) as long as the core image stays watercolour-on-dark-ground. Use motifs as accents, not as the whole image.
- Author/poet portraits: watercolour bust portraits, dignified, period-appropriate, warm light on dark ground.
- No text/labels on scenes.

Use the hero-banner, portrait, and cultural-context prompt templates from English §7 verbatim, swapping the scene.

---

## 11. Audio — Hindi TTS-first

Unlike English (which ships recorded human voice, fallback `hide`), the Hindi book can lean on **browser Hindi TTS (`hi-IN`)**, which is acceptable quality for Devanagari. Therefore:

- Set the गंगा book's `audio_fallback: 'tts'`.
- Author all `audio_url` fields as `""` — the renderer falls back to `hi-IN` speech synthesis (per-sentence, per-word, per-line).
- Recorded human voice is the eventual upgrade (same author→record→upload pipeline as English §8), but **TTS-first is the shipping default** — do not block chapter delivery on recordings.

For vocabulary cards the TTS reads the Devanagari `word`; for narrated passages, the sentence. Confirm the renderer passes `hi-IN` as the utterance lang when the book subject is `hindi` (small §14 item — currently the vocab renderer uses default lang).

---

## 12. Devanagari & Transliteration Rules

- **Transliteration scheme (the `pronunciation` field):** light Roman, syllable-hyphenated, **not IPA, not strict IAST diacritics** (students don't read ā/ṛ/ṣ). Rules: long vowels doubled (`aa`, `ee`, `oo`), श/ष = `sh`, च = `ch`, ज्ञ = `gya`, ऋ = `ri`, anusvara/nasal = `n`/`m` by sound, schwa dropped where Hindi drops it. Examples: निरापद → `ni-raa-pad`, सहिष्णुता → `sa-hish-nu-taa`, पराकाष्ठा → `pa-raa-kaash-thaa`, काँजीहौस → `kaan-jee-haus`.
- **Devanagari is the body script** — all literature, glosses, headings, commentary in Devanagari. English appears only in the `english` anchor field, transliteration, and UI labels.
- Use proper मात्रा and नुक़्ता where the source does (ख़, ग़, ज़, फ़, क़) — प्रेमचंद's text uses them.
- Keep numerals as the source prints (गंगा uses Devanagari भाग numbers १–५ in headings; Arabic numerals are fine in our UI chrome).

---

## 13. Per-Page Pre-Publish Checklist

**Structure**
- [ ] Page maps to exactly one purpose; `ganga_section` tag set (§6)
- [ ] Block 0 is `image` (hero, 16:5, watercolour, dark ground)
- [ ] Page closes with `inline_quiz` of 3 questions (स्मरण → समझ → व्याख्या)
- [ ] Reading page has ≥1 `narrated_passage`; poetry page has `tone_meter` + `literary_devices_highlighter`
- [ ] Chapter page count ≤ 11

**Question quality (§5.12.1) — run `node scripts/hindi-fix/validate.mjs <ch>`; chapter not done until it PASSES**
- [ ] `chapter_practice` bank ≥ 24 Qs; all 5 `concept_tag`s (each ≥2); difficulty 1–5 present, none >50%
- [ ] `correct_index` **varied across A/B/C/D** on every MCQ surface — never defaulted to 0/A (the #1 past bug)
- [ ] No question's correct option is > 1.3× the next-longest distractor (grapheme count); distractors length-matched + plausible
- [ ] ≥ 60% of graded-bank content questions are reasoning (व्याख्या/अनुमान/क्यों-कैसे), not recall
- [ ] Explanations reference option **content**, never "विकल्प अ / पहला विकल्प"

**Literature**
- [ ] All `narrated_passage` text matches NCERT verbatim (no rephrasing, no shortening)
- [ ] Hard *तत्सम*/देशज words glossed; everyday words not glossed
- [ ] No reasoning prompt closes with a single correct interpretation
- [ ] Proper nouns preserved exactly

**The scaffold flip (mission-critical)**
- [ ] Every gloss and every vocab card carries **simple Hindi + English** (triple bridge)
- [ ] Vocabulary cards sourced from the chapter's शब्द-संपदा list (not invented)
- [ ] `english` field populated on every vocab card; `pronunciation` (transliteration) present
- [ ] Chapter hits the §8 floors (≥40 words, ≥8 idioms, ≥1 grammar workshop, ≥1 भाषा संगम)
- [ ] Every vocab/idiom page has a `self_check`; every card has the Word Vault save

**Voice / image / audio**
- [ ] Second person, सहज register; commentary in plain Hindi (not over-Sanskritised)
- [ ] Hero + all images watercolour, dark ground, Indian subjects
- [ ] `audio_url` fields `""`; book `audio_fallback: 'tts'`

---

## 14. Schema Work Accompanying This Doc

Small, contained code changes the Hindi track needs. None adds a model or a route.

1. **`Book.subject` enum — add `'hindi'`.** Two mirrors confirmed:
   - [`packages/data/models/Book.ts:30`](../../packages/data/models/Book.ts)
   - [`packages/data/types/books.ts:756`](../../packages/data/types/books.ts)
   - Plus any Book Zod schema in [`packages/data/books/schemas.ts`](../../packages/data/books/schemas.ts) — grep `social_science` and add `'hindi'` to every list found.
2. **Triple-bridge vocabulary (the approved small build):**
   - Add optional `english?: string` to `VocabCard` (types + Zod in `schemas.ts`).
   - Add optional `lang?: 'english' | 'hindi'` to `VocabularyLabBlock` (default `'english'` — English book unaffected).
   - In [`VocabularyLabRenderer.tsx`](../../packages/book-renderer/blocks/english/VocabularyLabRenderer.tsx): when `block.lang === 'hindi'`, swap the back-of-card labels to **सरल अर्थ** (`meaning`), **English** (`english`), **उदाहरण** (`example`), **याद रखें** (`memory_hook`); and pass `hi-IN` to the `SpeechSynthesisUtterance`.
3. **Story glosses need no code** — the triple bridge is encoded in the gloss `meaning` field (`simple Hindi — English`), so the existing popover renders it correctly. The `hindi` field stays empty on Hindi glosses. (Decided 2026-06-06; simpler than threading book subject into the renderer.)
4. **`literary_devices_highlighter` Hindi support:** device enum extended with `vyangya`, `virodhabhas`, `samvadatmakta`, `sandeh` (done — types + Zod). The renderer needs a Hindi display-label map for both the new keys and the existing अलंकार keys (§5.3) — wire when the Ch1 सौंदर्य page is built.
5. **(Optional, not for Ch1) `apply_express` Hindi kinds:** `sandhi_join`, `samas_identify` — only if reusing `fill_blank`/MCQ proves insufficient.

Keep every change behind the `lang`/subject switch so the English book is byte-for-byte unaffected. This satisfies the project "simplicity constraint."

---

## 15. Building the गंगा Book Record

Create the book document once before any page is POSTed:

```json
{
  "slug": "class9-hindi-ganga",
  "title": "गंगा — कक्षा 9 हिंदी (NCERT)",
  "subject": "hindi",
  "grade": 9,
  "board": "ncert",
  "cover_image": "",
  "audio_fallback": "tts",
  "chapters": [
    { "number": 1,  "title": "दो बैलों की कथा", "slug": "do-bailon-ki-katha", "page_ids": [], "is_published": false },
    { "number": 2,  "title": "क्या लिखूँ?", "slug": "kya-likhun", "page_ids": [], "is_published": false },
    { "number": 3,  "title": "संवादहीन", "slug": "samvadheen", "page_ids": [], "is_published": false },
    { "number": 4,  "title": "ऐसी भी बातें होती हैं", "slug": "aisi-bhi-baaten-hoti-hain", "page_ids": [], "is_published": false },
    { "number": 5,  "title": "आखिरी चट्टान तक", "slug": "aakhiri-chattan-tak", "page_ids": [], "is_published": false },
    { "number": 6,  "title": "रीढ़ की हड्डी", "slug": "reedh-ki-haddi", "page_ids": [], "is_published": false },
    { "number": 7,  "title": "मैं और मेरा देश", "slug": "main-aur-mera-desh", "page_ids": [], "is_published": false },
    { "number": 8,  "title": "पद (रैदास)", "slug": "pad-raidas", "page_ids": [], "is_published": false },
    { "number": 9,  "title": "राम-लक्ष्मण-परशुराम संवाद", "slug": "ram-lakshman-parshuram-samvad", "page_ids": [], "is_published": false },
    { "number": 10, "title": "भारति, जय, विजयकरे!", "slug": "bharti-jai-vijaykare", "page_ids": [], "is_published": false },
    { "number": 11, "title": "झाँसी की रानी", "slug": "jhansi-ki-rani", "page_ids": [], "is_published": false },
    { "number": 12, "title": "घर की याद", "slug": "ghar-ki-yaad", "page_ids": [], "is_published": false }
  ]
}
```

गद्य खंड = chapters 1–7 (+ साथ-साथ पढ़ें: निर्मल जीत सिंह सेखों). काव्य खंड = chapters 8–12 (+ साथ-साथ पढ़ें: तब याद तुम्हारी आती है — रामनरेश त्रिपाठी). The साथ-साथ पढ़ें supplementary pieces can be appended as extra pages on the last chapter of each खंड, or skipped for v1.

---

## 16. Worked Example — Chapter 1 Outline

After this doc is approved, a block-by-block outline for **दो बैलों की कथा** is written at `_agents/plans/GANGA_CH1_OUTLINE.md` (block sequence + content notes + image prompts + the full triple-bridge शब्द-संपदा card list). It is the proof-of-workflow; chapters 2–12 follow the same outline approach once Chapter 1 ships and is reviewed.

---

## 17. Open Questions Flagged for Review

1. **Prose device highlighting** — extend the `literary_devices_highlighter` enum with Hindi narrative keys (richer, small code) vs `table` fallback (zero code). Recommend deciding when the Ch1 सौंदर्य page is built.
2. **साथ-साथ पढ़ें pieces** — build as extra pages now or defer to v2. Recommend defer.
3. **Recorded audio** — TTS-first ships now; schedule human recording after the first 2–3 chapters are validated.
4. **Folk-art intensity** — how heavily to lean on Madhubani/Warli motifs vs plain watercolour. Recommend light accents only; revisit after seeing Ch1 heroes.
</content>
</invoke>
