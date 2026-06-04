# Kaveri Chapter 1 — Page-by-Page Build Outline

> **Status:** BUILT. All 16 pages shipped to `class9-english-kaveri` Ch1 (published). This doc is now the historical design record.
> **Source:** `Class 9 English/iebe101.pdf` (NCERT Kaveri, Class 9, First Edition January 2026).
> **No JSON in this doc.** Each page is described as a block sequence + content notes + image-prompt seeds.
>
> ⚠️ **Image style note (2026-06-03):** The "painterly" wording in the image-prompt seeds below is SUPERSEDED. The house style for all Kaveri images is **watercolour painting** — see [`ENGLISH_BOOK_PAGE_WORKFLOW.md`](../workflows/ENGLISH_BOOK_PAGE_WORKFLOW.md) §7. The live DB prompts have already been converted (via `scripts/convert_kaveri_images_to_watercolour.js`); the seeds here are left as originally drafted for the historical record.

---

## 0. Unit 1 — One Unit, Two Pieces

Kaveri Unit 1 contains two related works bound under one chapter:

| Piece | Form | Author | Pages in our build |
|---|---|---|---|
| Piece A — How I Taught My Grandmother to Read | Prose | Sudha Murty | Pages 1–10 |
| Piece B — Bharat Our Land | Poem | Subramania Bharati | Pages 11–15 |
| Shared closer — About the Authors | — | — | Page 16 |

**Total: 16 digital pages for Unit 1.** Longer than the §5.11 baseline of 10–13 because the unit bundles a poem alongside the prose. Chapters with prose-only run shorter.

**Slug convention for this unit:** `unit-1-{slug}` where `{slug}` is a kebab-case label of the section. The page slug *is* the URL — so it must read well.

**`chapter_number` for every page in Unit 1 is `1`.** `page_number` runs 1–16 in the order below.

**`tags` on every page must include:**
- `kaveri_section:<section_id>` — see each page below
- `kaveri_piece:prose` or `kaveri_piece:poetry`
- `kaveri_chapter:1`

---

## Piece A — How I Taught My Grandmother to Read

### Page 1 — Reflect and Respond
- **Slug:** `unit-1-reflect-and-respond-grandmother`
- **Title:** Before You Read: Voices We Almost Lost
- **Subtitle:** A door into Sudha Murty's village
- **Kaveri section tag:** `reflect_and_respond`

**Block sequence:**
1. `image` (hero, 16:5) — A 12-year-old girl reading a magazine aloud to an older woman by lamplight in a tiled-roof village house, north Karnataka, evening warmth.
   - *Prompt seed:* "Painterly cinematic banner (16:5). Young girl in a simple cotton frock seated cross-legged on a verandah, reading from a Kannada magazine to an older woman in a traditional sari. Brass oil lamp between them. Tiled roof, mud-plastered wall behind. Dark warm twilight, soft amber glow on both faces, visible brushwork, earth tones. No text."
2. `curiosity_prompt` — *Have you ever taught someone older than you how to do something — even something small like using a phone? What was that moment like, for both of you?*
3. `callout[fun_fact]` — Triveni was a pen-name. Anasuya Shankar chose a male-sounding name to be taken seriously as a writer in 1960s Karnataka. The grandmother in this story is reading a magazine written by a woman who hid her name.
4. `text` — One paragraph: Sudha Murty is one of India's most-read authors today. She writes the way teachers talk — clearly, warmly, with one idea per sentence. This story is from her own life. Watch what happens when a 12-year-old girl is suddenly the teacher.
5. `vocabulary_lab` (mode: flashcards) — Kaveri's printed pre-teach exercise becomes 8 flashcards:
   - protagonist, debate, episode, community, concentration, eagerly, convincing, guided
   - Each: word, pronunciation, POS, meaning, Hindi gloss, example, optional hook
   - `self_check`: the 8-word matching exercise from Kaveri rendered as 3 MCQs
6. `inline_quiz` — 3 questions (recall on "what is a pen-name?", comprehension on "who is the protagonist of this Reflect and Respond?", interpretation on "why might Anasuya Shankar have chosen a male name?")

---

### Page 2 — Reading for Meaning, Part I (story opening)
- **Slug:** `unit-1-story-part-1-the-magazine-and-the-grandmother`
- **Title:** Part I: The Magazine and the Grandmother
- **Subtitle:** A girl reads aloud; a grandmother waits
- **Kaveri section tag:** `reading_for_meaning_part_1`

**Block sequence:**
1. `image` (hero) — Wide shot of the bus arriving at a small village stop with packets of newspapers and magazines being unloaded; a few villagers waiting. Dusk light, dust motes in beam of bus headlight.
2. `heading[2]` — "Part I — Where the story begins"
3. `text` — One-line orientation: *The narrator is a 12-year-old girl. She is staying with her grandparents in a small village in north Karnataka. The year is around 1960. There is no television, no internet. The newspaper comes on the bus, one day late.*
4. `cultural_context_card` — Reference: "1960s village life in north Karnataka." Category: place. Short_desc: "The world before phones — paper, post, and the bus." Detail explaining what daily life looked like.
5. `narrated_passage` — Kaveri's Part I opening, verbatim. Roughly 8–10 paragraphs covering: village in north Karnataka → bus brings the paper → Triveni the writer → *Kashi Yatre* the novel about an old woman wanting to go to Kashi → grandmother Krishtakka listening intently every week → grandmother is illiterate.
   - **Glosses to add (target ~1 per 50 words):** *eagerly, popular, complex, psychological, ordinary, novel, magazine, instalments, illiterate, fascinating, fortunate, deserve, fortune, sacred, ultimate, punya, pilgrimage, devout.*
   - Two Hinglish commentary paragraphs: one after the Triveni intro, one after the Krishtakka introduction.
6. `cultural_context_card` — Reference: "Kashi (Varanasi)." Category: place. Detail explaining the religious significance for elderly Hindu villagers.
7. `cultural_context_card` — Reference: "Triveni / Karmaveera magazine." Category: person+tradition. Detail on the regional-language literary world.
8. `image` — Painterly close-up of the grandmother's hands resting on the edge of a magazine she cannot read, eyes faraway.
9. `comprehension_checkpoint` — One MCQ + one open question:
   - "Why does the grandmother wait so eagerly for the magazine each week?"
   - Open: "What does it tell you about the grandmother that she has memorised every detail of someone else's story?"
10. `reasoning_prompt` (interpretive, level 2) — The narrator says her grandmother *deserved* to go to Kashi but never had the *fortune* to go. Sudha Murty places those two words side by side. What does the contrast tell you about how the narrator feels for her grandmother?
11. `inline_quiz` — 3 questions on Part I.

---

### Page 3 — Reading for Meaning, Part II (the turning point)
- **Slug:** `unit-1-story-part-2-the-tears-and-the-resolve`
- **Title:** Part II: Tears and a Resolve
- **Subtitle:** A wedding, a separation, and what the narrator finds when she returns
- **Kaveri section tag:** `reading_for_meaning_part_2`

**Block sequence:**
1. `image` (hero) — A young girl approaching her grandmother who is sitting silently on a terrace at night under a full moon, holding a magazine. The girl's silhouette in the foreground, grandmother in soft moonlight.
2. `heading[2]` — "Part II — The grandmother decides"
3. `text` — Orientation: *The narrator goes away to a cousin's wedding. When she returns, she finds her grandmother weeping silently — holding the magazine. The story shifts here. Watch what the grandmother asks for.*
4. `narrated_passage` — Kaveri's Part II, verbatim. Covers: the wedding trip → returning home → grandmother in tears → grandmother asks the narrator to teach her the Kannada alphabet → grandmother sets Saraswati Puja as her deadline → grandmother declares *"For learning there is no age bar."*
   - **Glosses:** *immensely, terrace, affectionate, sixty-two, weeping, alphabet, embarrassed, novel, determination, wrinkled, spectacles, childishly, obstacle, age bar.*
   - Hinglish commentary paragraph after grandmother's resolve speech.
5. `image` — The grandmother touching the narrator's feet — a gesture of formal respect that here is shocking (the grandmother is older, the narrator is twelve). Painterly close-up, both pairs of hands and feet, no faces shown.
6. `comprehension_checkpoint` — Two MCQs:
   - "Why does the grandmother stop attending the temple gathering once the narrator leaves?"
   - "When the grandmother touches the narrator's feet, what is she signalling?" (multiple plausible options)
7. `cultural_context_card` — Reference: "Touching feet (*charan sparsh*)." Category: tradition. Explains the gesture's meaning — typically younger to older. The grandmother inverting it changes the story.
8. `reasoning_prompt` (interpretive, level 3) — Sudha Murty writes: *"I saw the determination on her face. Yet I laughed at her."* Why does the narrator laugh? What is she laughing AT — and what does the laughter reveal about her, not her grandmother?
9. `inline_quiz` — 3 questions on Part II.

---

### Page 4 — Characters
- **Slug:** `unit-1-characters-narrator-and-avva`
- **Title:** The Two Women in the Story
- **Subtitle:** A 12-year-old and her 62-year-old grandmother — and how their roles flip
- **Kaveri section tag:** `characters`

**Block sequence:**
1. `image` (hero) — Two figures on a terrace at sunset, one young one old, sitting side by side, both looking at the same magazine.
2. `text` — One paragraph: There are only two main people in this story — the narrator and her grandmother. But what happens between them is a complete shift in roles. Tap each character to see who they are at the start; then read on to see who they become.
3. `character_map` — Two characters:
   - Narrator (Sudha) — 12 years old, granddaughter. Role: storyteller, then teacher.
   - Krishtakka (Avva) — 62 years old, grandmother. Role: listener, then student.
   - Relationship labels: "granddaughter of" → "becomes teacher to" (mirrored)
4. `comparison_card` — "How Their Roles Change" — Column 1: Start of story. Column 2: End of story.
   - Narrator: reads to grandmother / is the teacher
   - Grandmother: cannot read, listens / wants to read, learns
   - Both: tied by family / tied by learning
5. `reasoning_prompt` (interpretive, level 3) — Across the story, the narrator learns something too. What does the grandmother teach the narrator, even though the narrator is the one giving the alphabet lessons?
6. `inline_quiz` — 3 questions.

---

### Page 5 — Themes
- **Slug:** `unit-1-themes-grandmother-story`
- **Title:** What the Story Says Without Saying
- **Subtitle:** Three themes hidden in plain sight
- **Kaveri section tag:** `themes`

**Block sequence:**
1. `image` (hero) — A weathered hand holding a pencil, writing a Kannada letter for the first time. Close shot, lamp light.
2. `text` — One paragraph: A good story carries more than one idea. The story you just read says nothing directly about "the importance of education" — but it shows three different things. Tap each theme to explore.
3. `theme_explorer` — Three themes:
   - **Learning has no expiry date.** Evidence: *"For learning there is no age bar."* / Krishtakka begins at 62. Reflection: Think of someone in your family who didn't get to study. What's one thing you could teach them this month?
   - **The dignity of self-sufficiency.** Evidence: *"I want to be independent."* — the grandmother does not just want to *read*; she wants to stop *depending*. Reflection: When was the last time you wanted to do something yourself instead of asking for help? Why?
   - **Roles in a family are not fixed.** Evidence: The grandmother touches the narrator's feet — a reversal of expected respect. Reflection: Have you ever felt yourself becoming a teacher to someone older?
4. `callout[literature_in_life]` — India today has roughly 250 million adult illiterates. Most of them are women like Krishtakka. The story you just read is happening right now in millions of homes — and so is the choice the narrator faced: laugh, or teach.
5. `reasoning_prompt` (interpretive, level 3) — The story never uses the word "education." Why might Sudha Murty have chosen to keep that word out — and what does it mean that we feel the importance of education anyway?
6. `inline_quiz` — 3 questions on themes.

---

### Page 6 — Working with the Text
- **Slug:** `unit-1-working-with-text-grandmother`
- **Title:** Read Closely, Answer Carefully
- **Subtitle:** Kaveri's comprehension questions — with model answers you reveal one by one
- **Kaveri section tag:** `working_with_text`

**Block sequence:**
1. `image` (hero) — A student's hand writing in a notebook, the printed Kaveri textbook open beside it, warm desk-lamp light.
2. `text` — Short instruction: *Read each question. Attempt the answer in your head — or write it in your notebook. Only then tap to reveal the model answer. The model is one of many possible good answers; yours might be just as strong if it is rooted in the text.*
3. `comprehension_checkpoint` — The 3 true/false statements + 3 more from Kaveri's "Check Your Understanding" rendered as a single checkpoint.
4. `worked_example` (variant: ncert_intext, reveal: tap_to_reveal) — Critical Reflection extract 1 (the "never seen her cry" passage). Each of Kaveri's 5 sub-questions becomes its own micro-reveal inside this block's `solution` field. Use bold sub-headers for each part.
5. `worked_example` — Critical Reflection extract 2 (the "I want to be independent" passage), same structure.
6. `worked_example` — Working with the Text Q1: *Why did the grandmother feel embarrassed to ask someone else to read to her while the narrator was away?*
7. `worked_example` — Q2: *Why does the narrator initially laugh at her grandmother's determination to learn at the age of sixty-two?*
8. `worked_example` — Q3: *What significance does the story of Kashi Yatre have in both the grandmother's life and the story?*
9. `worked_example` — Q4: *What does the grandmother's desire to learn the Kannada alphabet reflect about her?*
10. `worked_example` — Q5: *What lessons can we infer from the grandmother's action of touching the narrator's feet?*
11. `worked_example` — Q6: *What does 'For a good cause if you are determined, you can overcome any obstacle' tell us about the broader theme?*
12. `worked_example` — Q7: *How effectively does the story highlight the value of education in supporting personal independence?*
13. `reasoning_prompt` (interpretive, level 2) — One synthesis question.
14. `inline_quiz` — 3 closure questions.

---

### Page 7 — Vocabulary and Structures in Context
- **Slug:** `unit-1-vocabulary-binomials-and-prefixes`
- **Title:** Words That Travel in Pairs, Words That Flip
- **Subtitle:** Binomials and prefix word formation, drawn from the story
- **Kaveri section tag:** `vocabulary_structures`

**Block sequence:**
1. `image` (hero) — A page from a worn dictionary with two words underlined and arrows connecting them. Soft lamp light.
2. `text` — Two-paragraph intro:
   - Paragraph 1: Some English expressions always travel in pairs — *sink or swim, mix and match, hide and seek.* These are called **binomials**. The order is fixed; you can never say *seek and hide.*
   - Paragraph 2: Other times, English flips the meaning of a word by adding a small piece in front — *happy → unhappy, possible → impossible.* These are called **prefixes** (or, more generally, *affixes*). Both make English easier when you know the pattern.
3. `vocabulary_lab` (mode: binomials) — Kaveri's 8 binomials as cards + 5-question self-check that matches Kaveri's Column 1 / Column 2 exercise:
   - sink or swim, on and off, mix and match, all or nothing, part and parcel, pick and choose, sooner or later, leaps and bounds
4. `vocabulary_lab` (mode: affixes) — Kaveri's 6 starter words (popular, belief, important, respect, fortune, regard) + their negative-prefix forms (un-, im-, in-, dis-, mis-, extra-). Each card explains the prefix's effect.
5. `comprehension_checkpoint` — One small drill: "Make a sentence using *sink or swim*." Open-ended, the answer reveals 2 model sentences.
6. `inline_quiz` — 3 questions on binomial/affix patterns.

---

### Page 8 — Listening and Speaking (Debate)
- **Slug:** `unit-1-debate-can-students-promote-literacy`
- **Title:** Take a Side, Sound Convincing
- **Subtitle:** Debate practice with sentence frames the printed book gives you
- **Kaveri section tag:** `listening_speaking`

**Block sequence:**
1. `image` (hero) — Two students at a podium in a school auditorium, one mid-gesture, the audience faces in dim foreground.
2. `text` — Intro: Speaking up in English isn't about big words. It's about knowing the *frames* — the small phrases that signal you are arguing, agreeing, disagreeing, or summing up. Kaveri gives you a list of these frames for both sides of a debate. Pick a side and try them.
3. `pronunciation_drill` — 6 words from this debate's vocabulary that Hindi speakers commonly mispronounce: *adamant, contrary, particularly, awareness, organisation, significantly.*
4. `dialogue_role_play` (mode: debate) — Topic: *"Students should be required to volunteer in adult literacy camps."* Sentence frames from Kaveri verbatim:
   - **For** side: 9 frames including *"To begin with, I would like to speak 'for' the topic…", "My first argument in favour of…", "Most importantly I want to mention that…", "In addition to that, I feel…", "I am pretty sure that…", "I have a reason to believe…", "If I could make a point here…", "There's no doubt that…", "So, to put it in a few words…"*
   - **Against** side: 8 frames from Kaveri.
5. `reasoning_prompt` (interpretive, level 2) — *Which side did you find harder to argue, and why? (There is no correct answer.)*
6. `inline_quiz` — 3 questions on debate frames + tone.

---

### Page 9 — Writing Task (Letter to the Editor)
- **Slug:** `unit-1-writing-letter-to-editor`
- **Title:** Write Like You Want to Be Read
- **Subtitle:** A letter to the editor on student-led adult literacy
- **Kaveri section tag:** `writing`

**Block sequence:**
1. `image` (hero) — A vintage typewriter or a newspaper office desk with a letter half-typed, lit by an angled desk lamp.
2. `text` — Short intro: A letter to the editor is the most powerful single-page format in journalism. It is read by the editor, often the editor's staff, and a small but influential set of readers. The format below — copied from Kaveri's points to remember — is what editors expect.
3. `writing_scaffold` (format: letter) — Full annotated model letter on the Kaveri topic (student participation in adult literacy camps). 8 annotated parts: sender's address, date, recipient's address, subject line, salutation, paragraph 1 (state the problem), paragraph 2 (analyse), paragraph 3 (suggest solutions), closing.
4. `reasoning_prompt` (interpretive, level 2) — *Look again at paragraph 2 of the model. Which single specific detail makes it persuasive? Could a generic version of the same paragraph achieve the same effect?*
5. `inline_quiz` — 3 questions on the format (not on the topic).

---

### Page 10 — About the Author (Sudha Murty)
- **Slug:** `unit-1-about-sudha-murty`
- **Title:** Sudha Murty: The First Woman on the Tata Engineering Shop Floor
- **Subtitle:** Engineer, author, philanthropist — and a granddaughter herself, once
- **Kaveri section tag:** `about_the_author`

**Block sequence:**
1. `image` (hero) — Painterly portrait scene: a woman in a simple cotton saree at a wooden desk with books, late afternoon Bengaluru window light.
2. `text` — One-paragraph orientation: *You just read a story Sudha Murty took from her own childhood. The grandmother in it is real. The village is real. The 12-year-old narrator is Sudha herself. The story you read is autobiography, lightly held.*
3. `meet_a_scientist` (used as "Meet the Author"):
   - Name: Sudha Murty
   - Years: 1950–present
   - Nationality: Indian
   - Portrait prompt (painterly bust portrait, dignified, dark background per §7)
   - Contribution: Indian author and engineer. Was the **first female engineer** hired at TELCO (Tata Motors) — having written directly to JRD Tata about the company's male-only hiring policy. Today she is one of India's most widely-read English-language and Kannada authors.
   - Connection: This unit's story is from her own childhood with her grandmother in Shiggaon, Karnataka. Her teaching style — clear, warm, one idea per sentence — is what you read in the story.
   - Fun_detail: She funded the Infosys Foundation's literacy programmes for women across India — making the Kashi Yatre story she wrote about in this unit a programme she now runs in real life.
   - Learn_more: *Wise and Otherwise* (her best-selling story collection, available in most Indian languages)
4. `callout[india_voice]` — On Triveni: *Anasuya Shankar, who wrote under the pen-name Triveni, was a 1950s–60s Kannada novelist whose stories of women's inner lives sold out of every weekly magazine they appeared in. She died at 35. Sudha Murty calls Triveni's voice the one that taught her grandmother to ask for the alphabet.*
5. `callout[threads_of_curiosity]` — Sudha Murty's husband, N. R. Narayana Murthy, co-founded Infosys. When Infosys was struggling in 1981, Sudha gave him her savings of ₹10,000 as the company's seed money. The same hands that wrote this story signed that cheque.
6. `inline_quiz` — 3 questions about author + style.

---

## Piece B — Bharat Our Land (Poem)

### Page 11 — Reflect and Respond (poem)
- **Slug:** `unit-1-reflect-and-respond-bharat`
- **Title:** Before You Read: India in a National Anthem
- **Subtitle:** Tagore named our rivers; this poet names our mountains
- **Kaveri section tag:** `reflect_and_respond_poem`

**Block sequence:**
1. `image` (hero) — A painterly composite: silhouette of the Himalayas in the background, a river winding through plains, faint outline of a temple spire. Dusk light. Dark blue and amber palette.
2. `curiosity_prompt` — *Recite the National Anthem in your head. Which states, mountains, and rivers does it name? What do you think the writer wanted you to *feel* when those names land in your ears?*
3. `text` — Short orientation: Subramania Bharati was writing this poem in Tamil, not English. The English version you'll read is a translation. Watch what he names — and what he does NOT name.
4. `cultural_context_card` — Reference: "जय हे (Jaya He)." Category: concept. Explains the phrase from the National Anthem the Reflect and Respond section asks about.
5. `vocabulary_lab` (mode: flashcards) — 4 odd-one-out items from Kaveri's exercise become 4 vocabulary cards: peerless / sanctified / auspicious / hoary antiquity.
6. `inline_quiz` — 3 questions on the pre-reading vocabulary and the Reflect and Respond connection.

---

### Page 12 — Reading for Appreciation (the poem itself)
- **Slug:** `unit-1-poem-bharat-our-land`
- **Title:** Bharat Our Land
- **Subtitle:** A 12-line tribute that names what makes a place sacred
- **Kaveri section tag:** `reading_for_appreciation`

**Block sequence:**
1. `image` (hero) — Painterly landscape: the Himalaya as a mighty silhouette, the Ganga curling at its base, a small temple. Dawn light just touching the snowy peaks, dark sky.
2. `text` — Two sentences: *The full poem is below. Tap any line to hear it read aloud. Tap a word to see its meaning. Notice the repeating line — Bharati uses it the way a song uses a refrain.*
3. `narrated_passage` — The full poem, treated as one passage with three paragraphs = three stanzas, each line as a separate sentence.
   - **Glosses:** *mighty, Himavant, equal, generous, grace, sacred, Upanishads, scriptures, peerless, gallant, warriors, sanctified, divinest, auspicious, Brahma-knowledge, dhamma, hoary, antiquity.*
   - One Hinglish commentary line per stanza — short.
4. `tone_meter` — 6 segments tracking the rising pride / reverence across the poem:
   - "The mighty Himavant is ours" — pride (4)
   - "The generous Ganga is ours" — affection (4)
   - "The sacred Upanishads are ours" — reverence (5)
   - "Gallant warriors have lived here" — pride (4)
   - "The divinest music has been heard here" — wonder (4)
   - "Of hoary antiquity is Bharat" — solemnity (5)
5. `literary_devices_highlighter` — passage = the full poem. Devices to highlight:
   - **Personification**: "The generous Ganga…which other river can match her grace?" (Ganga as a woman)
   - **Metaphor**: "sunny golden land" (India as gold), "Of hoary antiquity is Bharat" (Bharat as an aged sage)
   - **Imagery**: "sunny golden land", "mighty Himavant"
   - **Symbolism**: Himavant, Ganga, Upanishads as symbols of physical, life-giving, and spiritual India respectively
   - **Refrain**: "she's peerless, let's praise her!" (recurring closing pattern)
6. `comprehension_checkpoint` — Kaveri's fill-in-the-blanks summary exercise rendered as a single 10-blank checkpoint with reveal.
7. `inline_quiz` — 3 questions on imagery and structure.

---

### Page 13 — Themes & Poetic Features
- **Slug:** `unit-1-poem-themes-and-features`
- **Title:** What the Poem Honours
- **Subtitle:** Mood, tone, rhyme, and the work of the refrain
- **Kaveri section tag:** `poem_themes`

**Block sequence:**
1. `image` (hero) — A composite painterly image of three icons stacked vertically: snow peaks, river, an open palm-leaf scripture. Dark amber background.
2. `text` — Short intro: Bharati does not argue that India is great. He *names* what is great, and lets the names do the work. That is the craft of this poem.
3. `theme_explorer` — Three themes:
   - **What you name, you honour.** Evidence: Himavant, Ganga, Upanishads, Buddha, Brahma-knowledge. Reflection: Which single thing about your home town would you put in your own version of this poem?
   - **Reverence without exclusion.** Evidence: The poem names *Brahma-knowledge* and *Buddha's dhamma* in adjacent lines. Reflection: What is Bharati saying about India by placing those two traditions in the same breath?
   - **The refrain as a heartbeat.** Evidence: *"she's peerless, let's praise her!"* recurs as a closing pattern. Reflection: A refrain is what you remember after you forget the rest. Why might Bharati have chosen this particular line?
4. `worked_example` (variant: ncert_intext, reveal: tap_to_reveal) — Kaveri's "Complete the following features about the poem":
   - Mood: reveal model answer
   - Tone: reveal model answer
   - Rhyme scheme: reveal model answer
   - Examples of personification: reveal model answer
5. `worked_example` — Kaveri's open question: *What is the impact of the refrain 'she's peerless, let's praise her!'?*
6. `worked_example` — Kaveri's metaphor question: *India is metaphorically described as 'this sunny golden land'…*
7. `reasoning_prompt` (interpretive, level 3) — Bharati was writing this poem in 1900-something Tamil Nadu, before Indian independence. Why might he have chosen to name what India *has* rather than what India *needs*?
8. `inline_quiz` — 3 questions.

---

### Page 14 — Vocabulary in Context (poem)
- **Slug:** `unit-1-poem-vocabulary-in-context`
- **Title:** The Words Bharati Chose
- **Subtitle:** A close look at the poem's most powerful words
- **Kaveri section tag:** `vocabulary_in_context_poem`

**Block sequence:**
1. `image` (hero) — A page of the poem with one line highlighted in warm light, the rest in shadow.
2. `text` — One-paragraph intro: Poems live or die on word choice. Bharati had hundreds of options — he chose *Himavant*, not *Himalaya*; *peerless*, not *unmatched*; *hoary antiquity*, not *very old*. Each word carries weight. Tap each to feel the weight.
3. `vocabulary_lab` (mode: flashcards) — 8 power words from the poem: Himavant, generous, sacred, peerless, gallant, sanctified, divinest, hoary.
4. `vocabulary_lab` (mode: idioms) — 3 cultural-literary phrases: *hoary antiquity, divine music, sunny golden land.*
5. `inline_quiz` — 3 questions.

---

### Page 15 — Speaking & Writing (poem)
- **Slug:** `unit-1-poem-speaking-and-writing`
- **Title:** Speak the Poem, Write Your Own
- **Subtitle:** Recite, then write a short tribute to your own place
- **Kaveri section tag:** `speaking_writing_poem`

**Block sequence:**
1. `image` (hero) — A student in a school assembly reciting a poem, hands open, peers listening.
2. `text` — Two-paragraph intro:
   - Paragraph 1: A poem like *Bharat Our Land* is meant to be heard, not just read. Recitation gives you the rhythm Bharati built into it.
   - Paragraph 2: After you hear it, write your own short tribute — but to your town, your river, your hill. Use the format below.
3. `pronunciation_drill` — 4 words from the poem most likely to stumble: *Himavant, Upanishads, sanctified, antiquity.*
4. `dialogue_role_play` (mode: dialogue) — A short two-character scene where one student helps another rehearse the refrain. (Optional — depends on whether Kaveri's printed Speaking Activity for the poem includes a dialogue; if it's solo recitation, replace with a single-character `narrated_passage` of the refrain alone with audio.)
5. `writing_scaffold` (format: paragraph) — Short annotated model: *"My Town in 8 Lines"* — a Bharati-inspired tribute to a small Indian town, 4 lines of imagery + a refrain. The annotation shows the student how to pick three names that matter, two adjectives that don't sound like a tourism brochure, and one repeating line.
6. `inline_quiz` — 3 questions.

---

### Page 16 — About the Poet (Subramania Bharati)
- **Slug:** `unit-1-about-subramania-bharati`
- **Title:** Subramania Bharati: A Tamil Poet Who Wrote India
- **Subtitle:** Revolutionary, journalist, poet — dead at 39, immortal in Tamil literature
- **Kaveri section tag:** `about_the_poet`

**Block sequence:**
1. `image` (hero) — Painterly: a man in a turban with a thick moustache, seated at a low writing desk by lamplight, sheets of paper spread, the year 1908.
2. `text` — One paragraph: *Subramania Bharati wrote this poem in Tamil. The English translation you read keeps the shape but not the music. To hear the music you would have to learn Tamil — and many have, for him.*
3. `meet_a_scientist` (used as "Meet the Author"):
   - Name: Subramania Bharati
   - Years: 1882–1921
   - Nationality: Indian (Tamil)
   - Portrait prompt: painterly bust portrait, early 1900s Tamil dress, turban, dignified, dark background per §7
   - Contribution: Tamil poet, journalist, and freedom-movement figure. Wrote what became Tamil Nadu's most-loved patriotic poems. Pioneered modern Tamil free verse. Died at 39.
   - Connection: *Bharat Our Land* is his most-anthologised English-translated piece. The original Tamil — *"Vande Mataram"* in spirit — was sung at independence meetings before independence existed.
   - Fun_detail: He was once arrested for sedition; he ran the journal *India* out of Pondicherry to evade British censorship. His wife, Chellamma, kept his poems alive after his death by reciting them from memory.
   - Learn_more: *Bharati Padalgal* (his collected Tamil works); for English readers, *Selected Translations* by Usha Rajagopalan.
4. `callout[india_voice]` — On Tamil literary tradition: Tamil is one of the world's oldest continuously-written languages. When Bharati wrote *Brahma-knowledge has taken root* in the same line as *the Buddha preached his dhamma here*, he was placing himself in a 2,000-year-old conversation across Sanskrit, Pali, and Tamil literatures.
5. `callout[threads_of_curiosity]` — Bharati used to feed an elephant at the local temple in Triplicane, Madras. One day the elephant knocked him down and stepped on him. He survived but never fully recovered; the injury contributed to his death three months later. His final poems were dictated from bed.
6. `inline_quiz` — 3 questions on Bharati + style.

---

## Cross-Page Hinglish Plan

For Unit 1's first ship, populate `hinglish_blocks` (and the equivalent Hinglish parallel fields on non-text blocks) on:
- **Page 1** (Reflect and Respond — prose): full Hinglish parallels on every text block.
- **Pages 2 and 3** (Reading for Meaning): `hinglish_commentary` on every paragraph of `narrated_passage` (~6–10 paragraphs total). Glosses are bilingual by default.
- **Page 11** (Reflect and Respond — poem): full Hinglish parallels.
- **Page 12** (the poem): `hinglish_commentary` per stanza in `narrated_passage`.

For pages 4–10 and 13–16, ship in English only. Hinglish parallels added in a follow-up pass once Page 1–3 and 11–12 are reviewed and the Hinglish voice for literature is locked.

---

## Cross-Page Audio Recording Plan

For Unit 1 to ship fully featured, the recording session will produce:

| Page | Block(s) | Files |
|---|---|---|
| 1 | vocabulary_lab | 8 single-word files |
| 2 | narrated_passage | ~30 sentence files |
| 3 | narrated_passage | ~25 sentence files |
| 7 | vocabulary_lab × 2 | 8 binomial + 6 affix files |
| 8 | pronunciation_drill, dialogue_role_play | 6 pronunciation + 0 dialogue (debate frames don't need recording) |
| 11 | vocabulary_lab | 4 single-word files |
| 12 | narrated_passage (poem) | 12 line files |
| 14 | vocabulary_lab × 2 | 8 + 3 files |
| 15 | pronunciation_drill, dialogue_role_play | 4 pronunciation + 4 dialogue lines |

**Total for Unit 1: roughly 120 audio files.**

Recording sheet generator script (`scripts/kaveri-audio/generate-recording-sheet.js`) will produce this list automatically once pages exist in the DB.

---

## Build Order for Unit 1

After workflow doc is approved:

1. **Renderer foundations** — implement the 11 new block components in `packages/book-renderer/blocks/english/` with placeholder UI. Add a router entry per block type in `BlockRenderer.tsx`. Test render with a hand-written JSON fixture before authoring real pages.
2. **Book record** — create the Class 9 English Kaveri book in MongoDB with `slug: 'class9-english-kaveri'`, subject `'english'`, `audio_fallback: 'hide'`.
3. **Page 1** (Reflect and Respond — prose) — author the page; review in browser.
4. **Page 2** (Part I) — author the page; review the `narrated_passage` block UX with real text.
5. **Iterate** on `narrated_passage` based on Page 2 feedback before authoring Pages 3–10.
6. **Page 3 → Page 10** — author the rest of Piece A.
7. **Page 11 → Page 16** — author Piece B.
8. **Audio recording session** — once all pages exist, generate the recording sheet, record, upload, backfill URLs.
9. **Refresh state** — `node scripts/livebooks-state.js` after every save. Add a Unit 1 entry to the LIVE_BOOKS_STATE changelog.

---

## Decisions Pending for Unit 1 Specifically

- **Page 15** (Speaking & Writing for the poem) — Kaveri's printed Speaking Activity for the poem may be a solo recitation, not a dialogue. The outline currently lists `dialogue_role_play` as optional. Decide when authoring whether to keep it or drop in favour of a recitation-focused `narrated_passage` block.
- **Image style for the poem hero banner** — Painterly Indian landscape is the default. If the poem hero risks looking like a tourism brochure, default to an abstract textural treatment instead (manuscript page, sacred geometry, lamp light) — both fit the §7 prompt template.
- **Translator credit** — *Bharat Our Land* is translated from Tamil. The translator is not named in Kaveri. Before publishing the poem page, verify whether to add a translator credit footer or follow Kaveri's silence on the matter.
