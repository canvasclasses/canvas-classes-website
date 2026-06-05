# English Book Page Builder — Canonical Workflow (Class 9 Kaveri)

> Single source of truth for building digital book pages in the **English** track of NCERT Simplified.
> **When building any Class 9 English page, follow this document exactly.**
>
> This doc is a sibling to [`BOOK_PAGE_WORKFLOW.md`](./BOOK_PAGE_WORKFLOW.md) (which governs Science and Math). Anything that is **not** explicitly overridden here is inherited from that doc — API endpoints, slug rules, page reorder, hero-banner aesthetic rules, image-generation prompt template (§3.4.1, §3.4.2 — dark-background style lock), one-page-one-sub-topic rule (§4D), and the Hinglish authoring philosophy (§12).
>
> Where the two docs conflict on anything English-specific, **this document wins**.
>
> **Project state** lives in [`_agents/state/LIVE_BOOKS_STATE.md`](../state/LIVE_BOOKS_STATE.md) — refresh with `node scripts/livebooks-state.js` after any content change, exactly as the Science workflow demands.

---

## 0. BEFORE YOU BUILD — REQUIRED FOR EVERY ENGLISH PAGE

Before authoring any page:

1. **You are not paraphrasing literature into worksheets.** Kaveri is a literary textbook. The author's words are the centre of the page — your job is to make them accessible, not to replace them. Never rewrite a passage in "simpler" English on the page itself; provide glosses and Hinglish commentary instead.
2. **Hold the non-native reader in mind at every block.** The target student speaks Hindi at home and Hindi-influenced English at school. They can decode most everyday English but lose 15–25% of the literary vocabulary, almost all idiomatic phrasing, and most cultural references. Every block must add a handhold, not a hurdle.
3. **Do not "explain the meaning of the story."** Literature is not a science experiment with a single correct interpretation. Your reasoning prompts and theme cards open doors — they do not close them.
4. **State explicitly which Kaveri section each page maps to.** Add a `kaveri_section` field to the page's `tags` array (e.g. `tags: ["kaveri_section:reflect_and_respond"]`). This keeps the authoring intent visible to future agents.

If uncertain about scope, stop and ask. Do not pick silently.

---

## 1. What You Are Building

**Kaveri** is the NCERT Class 9 English textbook (NCF-SE 2023 curriculum, first edition January 2026). It replaces the older "Beehive" textbook. Cover, contents, eight units, prelims, and an appendix are in the `Class 9 English/` folder of the Downloads directory.

**Track:** Class 9 English — Kaveri.

**Target reader:**
> A 14-year-old North Indian student in a tier-2/tier-3 English-medium school. Hindi or a regional language at home. Reads everyday English fluently but stumbles on literary diction (*tedious, deftly, pittance*), abstract idiom (*sink or swim, leaps and bounds*), and Western cultural reference (*lake isle, wattles, Beethoven*). Has been told English literature is "difficult" by older siblings. Wants to enjoy a story but feels guilty pausing for every unfamiliar word.

**The promise of every Kaveri page:**
1. You hear the author's voice clearly, even where the words are hard.
2. You can tap any word you don't know without losing your reading momentum.
3. You leave the page feeling that *this story is partly yours* — Indian characters, Indian places, Indian feelings, written in English.

**Three mindset shifts from the Science workflow:**

| Science (Class 9 Exploration) | English (Class 9 Kaveri) |
|---|---|
| Begin with wonder ("Why does iron rust?") | Begin with personal connection ("Have you taught someone older than you?") |
| The text reveals an **invisible mechanism** | The text reveals a **human feeling** |
| Correct answers exist; reasoning checks confirm them | Multiple readings are valid; reasoning opens conversation |
| Indian connection added via `india_science` callout | Indian voice is the **default** — author, characters, setting, idiom |

---

## 2. Relationship to BOOK_PAGE_WORKFLOW.md

| Concern | Where it lives |
|---|---|
| API endpoint, request body, page reorder | `BOOK_PAGE_WORKFLOW.md` §2 — unchanged |
| Slug rules | `BOOK_PAGE_WORKFLOW.md` §2 — unchanged |
| Reading-surface palette (eye-comfort: `#121316` page / `#181A21` chrome, NOT pure black) | `BOOK_PAGE_WORKFLOW.md` §1.5 — inherited; applies to every Kaveri reading surface |
| Hero banner aesthetic (16:5, dark background, no caption) | `BOOK_PAGE_WORKFLOW.md` §3.4.1 — unchanged; English uses **watercolour painting** style (see §7 below) |
| Generic image-generation prompt template | `BOOK_PAGE_WORKFLOW.md` §3.4.2 — inherited; English overrides label colour and style (see §7 below) |
| Hinglish authoring philosophy (teacher voice, *tum* register, English-stays-English for technical words) | `BOOK_PAGE_WORKFLOW.md` §12 — inherited with one critical override (see §9 below) |
| One page = one sub-topic | `BOOK_PAGE_WORKFLOW.md` §4D — inherited and **strictly enforced** for English |
| Block types `text`, `heading`, `image`, `callout`, `comparison_card`, `timeline`, `table`, `inline_quiz`, `worked_example`, `curiosity_prompt`, `reasoning_prompt`, `meet_a_scientist`, `section` | Inherited and reused. `meet_a_scientist` is reused **as is** but populated with authors. See §3.2 below for the mapping. |
| Block types `simulation`, `latex_block`, `molecule_2d`, `molecule_3d`, `interactive_image`, `classify_exercise`, `animation`, `practice_link` | **Not used** on English pages |
| New block types `narrated_passage`, `vocabulary_lab`, `literary_devices_highlighter`, `character_map`, `theme_explorer`, `tone_meter`, `cultural_context_card`, `comprehension_checkpoint`, `writing_scaffold`, `dialogue_role_play`, `pronunciation_drill` | Defined in **§4 below** |
| New callout variants `india_voice`, `literature_in_life` | Defined in **§3.1 below** |
| Page structure templates per Kaveri section | Defined in **§5 below** |
| Voice and tone rules | Defined in **§6 below** |
| Image style for English | Defined in **§7 below** |
| Audio handling (pre-recorded human voice) | Defined in **§8 below** |
| Hinglish nuance for literature (the literature stays English; the commentary translates) | Defined in **§9 below** |
| India-as-default rather than India-as-callout | Defined in **§10 below** |
| Pre-publish checklist | Defined in **§11 below** |

---

## 3. Re-used Block Types — How They Map to English

### 3.1 `callout` — variants extended

Two new variants are added on top of the existing set in `BOOK_PAGE_WORKFLOW.md` §3.3:

| Variant | Purpose | Placement |
|---|---|---|
| `india_voice` | Indian author, Indian translator, Indian-English literary tradition, Indian context behind a Western reference | Near the top of an "About the Author" page; or beside a culturally-specific passage |
| `literature_in_life` | How the human situation in this text plays out in modern life — concrete, not vague. *Replaces* the science-doc `bridging_science`. | Near end of a "Themes" or "Working with the Text" page |

The following variants from the science workflow **are still available** for English, with the noted use:

| Variant | English use |
|---|---|
| `fun_fact` | Striking line from the chapter, a piece of trivia about the author, a Sanskrit/Indian-language verse on the same theme |
| `threads_of_curiosity` | A piece of literary trivia or surprising context (e.g. "Triveni was the pen-name of Anasuya Shankar — she chose a male-sounding name to be taken seriously as a writer in 1960s Karnataka") |
| `what_if` | A genuine open question about a character's choice or the story's premise |
| `remember` | A key literary term (e.g. *narrative voice*, *binomial*) the student must internalise |
| `note` | Side context that adds depth but isn't tested |
| `warning` | Common reading mistake — e.g. "Don't confuse the narrator with the author" |
| `exam_tip` | **Skip** on Class 9 English — exam framing dilutes literary engagement |

The following variants are **dropped** on English pages:
- `bridging_science` — replaced by `literature_in_life`
- `india_science` — replaced by `india_voice`
- `quest_continues` — open literary questions go inside `reasoning_prompt` or `theme_explorer`, not a callout
- `ready_to_go_beyond` — Class 10 English pages will handle this themselves

### 3.2 `meet_a_scientist` — used as "Meet the Author"

The schema is unchanged; the label rendered in the UI for English pages is **"Meet the Author"** (the renderer will accept a `display_label` override, or — preferred — we add an alias `meet_the_author` whose payload is identical and the renderer treats them as one). Treat all fields the same way:
- `name`, `years`, `nationality` — author's basics
- `contribution` — what the author is known for, in 2–3 sentences. Bold their best-known work.
- `connection` — single sentence tying their work to *this Kaveri chapter*. Mandatory.
- `fun_detail` — humanising fact (Sudha Murty walked into Tata as the first female engineer; R.K. Narayan wrote Malgudi from a single café table in Mysore).
- `learn_more` — institution / collected works / a single accessible book.

One per chapter, on the "About the Author" page.

### 3.3 `curiosity_prompt` — Block 0 on every "Reflect and Respond" page

Kaveri's own "Reflect and Respond" section is functionally identical to the Science doc's `curiosity_prompt` philosophy: an open question, zero prior knowledge required, no MCQ. Use `curiosity_prompt` as Block 1 (after the hero banner) on every Reflect and Respond page. Re-phrase Kaveri's discussion questions into a single open question if the printed book lists several.

### 3.4 `reasoning_prompt` — interpretive, not logical

For Science, `reasoning_prompt` is logical / spatial / quantitative / analogical. For English, **all reasoning prompts are interpretive** — they ask the student to read closely and justify a reading from the text. Use `reasoning_type: 'logical'` as the carrier value (we are not extending the enum; the UI doesn't surface it on English pages).

| Wrong | Right |
|---|---|
| "What is the lesson of this story?" (closed, moral-of-the-fable) | "When the grandmother touches the narrator's feet, the narrator is uncomfortable. What does that one gesture tell you about how the relationship has changed?" |
| "Is education important?" (rhetorical) | "Triveni wrote about an old woman wanting to reach Kashi. Krishtakka cannot finish reading that story. Why does Sudha Murty give us the same hunger in both characters — one fictional, one real?" |

`difficulty_level` still 1–5, but on English pages most prompts land at level 2 or 3.

### 3.5 `inline_quiz` — Class 9 English mix

The last block of every page is still `inline_quiz`. Question mix per page (3 questions):
1. **Recall** — confirm the student read the page (Level 1)
2. **Comprehension** — confirm they understood (Level 2)
3. **Interpretation** — open-style MCQ where all options are defensible but one is best-supported by the text (Level 3)

For poetry pages, the third question often asks about the function of a specific word, image, or line — not a "moral".

### 3.6 `comparison_card` — character vs character, poem vs poem

Reuse as-is. Max 3 columns. Useful for:
- Two characters in the same story (Margie vs Tommy)
- The narrator's point of view at the start vs end of the story
- Two poems on the same theme

### 3.7 `timeline` — story event chronology

Reuse as-is. One timeline per story page where event ordering is itself part of the lesson (rare — most stories are linear and don't need an external timeline; reserve for stories that flash back or skip across time).

### 3.8 `worked_example` — model-answer reveal

Reuse as-is for the **Working with the Text** page. Each NCERT-style comprehension question becomes a `worked_example` block with `variant: 'ncert_intext'`, the question in `problem`, and the model answer in `solution`. The reveal mode `tap_to_reveal` is mandatory — the student attempts before seeing the answer.

### 3.9 Blocks that are NOT used on English pages

| Block | Why |
|---|---|
| `simulation` | English does not have simulable mechanisms |
| `latex_block` | No equations |
| `molecule_2d`, `molecule_3d` | No chemistry |
| `interactive_image` | Replaced by `cultural_context_card` for places/landmarks and by `character_map` for relationships |
| `classify_exercise` | Replaced by `vocabulary_lab` pattern modes |
| `animation`, `practice_link` | Reserved for later |

---

## 4. New Block Types — Kaveri-Specific

Every block follows the standard `BaseBlock` contract: `id` (UUIDv4), `type`, `order` (0-indexed), optional `tier`.

### 4.1 `narrated_passage` — the heart of every literature page

The single most-used new block. Renders prose or a poem with three superpowers layered on top:
1. **Tap any tagged word** → glossary popover (meaning, part of speech, Hindi gloss, one example).
2. **Tap a sentence** → plays the pre-recorded audio (falls back to browser TTS if `audio_url` is empty).
3. **Toggle "Show Hinglish commentary"** → reveals a teacher-voice Hinglish explanation under each paragraph (the literature itself stays English; only the commentary is bilingual — see §9).

```json
{
  "id": "uuid",
  "type": "narrated_passage",
  "order": 3,
  "source_label": "Reading for Meaning · Part I",
  "paragraphs": [
    {
      "id": "uuid",
      "sentences": [
        {
          "id": "uuid",
          "text": "When I was a girl of about twelve, I used to stay in a village in north Karnataka with my grandparents.",
          "audio_url": "",
          "glosses": []
        },
        {
          "id": "uuid",
          "text": "All of us would wait eagerly for the bus, which used to come with the papers, weekly magazines and the post.",
          "audio_url": "",
          "glosses": [
            {
              "word": "eagerly",
              "meaning": "with strong interest and excitement",
              "pos": "adverb",
              "hindi": "बेसब्री से",
              "example": "The children waited eagerly for the school bell to ring."
            }
          ]
        }
      ],
      "hinglish_commentary": "Dekho — yeh paragraph hamein ek choti si ladki ki duniya mein le jaata hai. Village mein paper aur magazine bus se aate the — aaj ke jaisa phone-internet kuch nahi. Iska matlab hai padhna ek event tha, ek wait."
    }
  ]
}
```

**Field rules:**
- `source_label` — optional, used to anchor in-place (e.g. "Stanza 2" for poetry pages).
- `paragraphs[].sentences[].text` — the **original Kaveri text, verbatim**. Never paraphrase. Never simplify.
- `paragraphs[].sentences[].audio_url` — `""` until the human recording exists. The renderer hides the play button when empty (or uses browser TTS as silent fallback, configurable per book).
- `paragraphs[].sentences[].glosses[]` — only for words that a Hindi-medium tier-2/3 student is genuinely likely to miss. Default budget: **1–3 glosses per sentence, average 1 per 50 words of passage**. Over-glossing makes the passage look intimidating; under-glossing makes it unreadable.
- `glosses[].word` — must match the exact substring in `text`. If the word appears more than once in the sentence, add `occurrence: 2` to target the second occurrence.
- `glosses[].hindi` — Devanagari script. One-word or two-word translation. Skip if the English meaning is already clear without it.
- `glosses[].example` — a short, simple sentence using the word in an everyday context. Different from the Kaveri sentence so the student sees the word transferred to a new situation.
- `paragraphs[].hinglish_commentary` — optional. Use only on the first paragraph of each major story beat (not every paragraph — that drowns the reader in commentary). One per `narrated_passage` block is the norm; 2–3 maximum.

**Length rules:**
- One `narrated_passage` block per digital page is the norm. Two if the passage clearly splits into two beats.
- Aim for 150–300 words of passage per block. Longer than that, split into two blocks with a `comprehension_checkpoint` between them.

**Image accompaniment:** If a passage has a strong visual moment (the grandmother's tears, the riverbank where Sentila digs clay), pair the `narrated_passage` with an `image` block placed immediately after — watercolour painting style per §7.

### 4.2 `vocabulary_lab` — the multi-mode word workshop

Powers both Kaveri's "Vocabulary pre-teach" and its "Vocabulary and Structures in Context" exercises (binomials, prefixes, suffixes, word formation).

```json
{
  "id": "uuid",
  "type": "vocabulary_lab",
  "order": 4,
  "mode": "flashcards",
  "intro": "These are the words you'll meet in the story. Tap each card to flip it.",
  "cards": [
    {
      "id": "uuid",
      "word": "tedious",
      "pronunciation": "TEE-dee-us",
      "audio_url": "",
      "pos": "adjective",
      "meaning": "tiring and boring because it takes a long time",
      "hindi": "थकाऊ",
      "example": "Copying every page by hand was a tedious job.",
      "memory_hook": "Sounds like 'tee dee us' — the boring lecture you wish would end."
    }
  ],
  "self_check": [
    {
      "id": "uuid",
      "question": "Which job sounds most tedious?",
      "options": [
        "Riding a roller-coaster",
        "Sorting two hundred old letters by date",
        "Watching your favourite film",
        "Playing cricket in the park"
      ],
      "correct_index": 1,
      "explanation": "Tedious means long and boring. Sorting letters one by one fits exactly."
    }
  ]
}
```

**Modes:**
- `"flashcards"` — single-word vocabulary cards. Default for Kaveri's pre-reading vocab.
- `"binomials"` — pairs of words joined by *and/or* (sink or swim, mix and match). Cards show the binomial, the meaning, and an example sentence. Self-check matches binomial → meaning.
- `"affixes"` — prefix/suffix word formation (un-, im-, dis-, in-, mis-, extra-). Cards show the root word, the affix, the new word, and its meaning. Self-check asks which affix fits a given root.
- `"idioms"` — short idiomatic phrases (over the moon, by heart). Cards show the idiom, literal meaning, idiomatic meaning, and example.

**Field rules:**
- `cards[].pronunciation` — informal phonetic respelling (TEE-dee-us), not IPA. Hindi-speaking students don't read IPA fluently; respelling is friendlier.
- `cards[].audio_url` — `""` until recorded. Single-word audio (~1 second per word).
- `cards[].hindi` — Devanagari, one or two words.
- `cards[].memory_hook` — optional but encouraged. A sound-alike, a vivid image, or a personal-life anchor. Skip if forced.
- `self_check` — optional. Maximum 3 questions. Reuses the `InlineQuizQuestion` shape for code reuse.

### 4.3 `literary_devices_highlighter` — make figurative language visible

This is the closest English gets to a "simulator." Pass the passage in; specify which devices appear where; the renderer shows toggle chips (Simile, Metaphor, etc.) and highlights every matching span when a chip is active.

```json
{
  "id": "uuid",
  "type": "literary_devices_highlighter",
  "order": 5,
  "passage": "The tap, tap of the spatula on the clay was music to her ears as she watched in fascination the pot emerging out of a shapeless lump right in front of her eyes.",
  "devices": [
    {
      "id": "uuid",
      "device": "metaphor",
      "matches": [
        {
          "text": "music to her ears",
          "explanation": "The tapping is not actually music — but to Sentila, who loves pot-making, the rhythmic sound feels as pleasant as music. The metaphor tells you how she hears the world."
        }
      ]
    },
    {
      "id": "uuid",
      "device": "onomatopoeia",
      "matches": [
        {
          "text": "tap, tap",
          "explanation": "The word sounds like the action it names — the actual rhythm of the spatula on wet clay."
        }
      ]
    }
  ]
}
```

**Device enum:** `simile`, `metaphor`, `personification`, `imagery`, `alliteration`, `rhyme`, `symbolism`, `hyperbole`, `onomatopoeia`.

**Field rules:**
- `passage` — exact substring of the chapter text. Keep short (1–4 sentences for prose; 1 stanza for poetry).
- `devices[].matches[].text` — must be an exact substring of `passage`. The renderer wraps it in a highlight span.
- `devices[].matches[].explanation` — short. Two sentences max. Say *what kind of device this is* and *what reading it unlocks*.
- One `literary_devices_highlighter` per page is the norm. Maximum two.
- Use **at least one** on every poem page. Optional on prose pages.

### 4.4 `character_map` — relationships made visible

Interactive node graph: characters as circles, relationships as labelled arrows. Tap a character to see their bio card.

```json
{
  "id": "uuid",
  "type": "character_map",
  "order": 6,
  "title": "The Family in How I Taught My Grandmother to Read",
  "characters": [
    {
      "id": "narrator",
      "name": "Sudha (the narrator)",
      "role": "narrator",
      "bio": "A 12-year-old girl staying with her grandparents. Loves reading Triveni's stories aloud.",
      "traits": ["curious", "patient", "loving"],
      "portrait_url": "",
      "portrait_prompt": "Watercolour painting of a 12-year-old girl in a 1960s Karnataka village, reading from a Kannada magazine to an older woman. Warm lamplight, dark background, soft earth tones. Loose watercolour washes, soft bleeding edges, visible paper grain. No text."
    },
    {
      "id": "grandmother",
      "name": "Krishtakka (Avva)",
      "role": "co-protagonist",
      "bio": "A 62-year-old grandmother who never learned to read. Determined to learn Kannada at her age so she can read Triveni's stories herself.",
      "traits": ["determined", "humble", "loving"],
      "portrait_url": "",
      "portrait_prompt": "Watercolour painting of a 62-year-old grandmother in traditional Karnataka attire, holding a Kannada slate with the alphabet, late afternoon light, dark earthen background. Loose watercolour washes, soft bleeding edges, visible paper grain. No text."
    }
  ],
  "relationships": [
    { "from": "narrator", "to": "grandmother", "label": "granddaughter of" },
    { "from": "grandmother", "to": "narrator", "label": "teacher and student of" }
  ]
}
```

**Field rules:**
- `characters[].bio` — 1–3 sentences. Focus on motivation, not appearance.
- `characters[].traits` — 2–4 adjectives. Keep concrete.
- `characters[].portrait_prompt` — watercolour painting per §7. Empty string for `portrait_url` until generated.
- `relationships[].label` — short, specific. "best friend of" not just "knows".
- Minimum 2 characters; maximum 6. If the story has more, group minor characters.
- One per chapter. Place on the "Working with the Text" page or its own "Characters" page.

### 4.5 `theme_explorer` — themes as conversation, not as moral

Cards for each theme. Each card has: title, description, supporting evidence (quoted lines), and a reflection prompt.

```json
{
  "id": "uuid",
  "type": "theme_explorer",
  "order": 5,
  "intro": "A good story carries more than one idea. Tap each theme to explore.",
  "themes": [
    {
      "id": "uuid",
      "title": "Learning has no expiry date",
      "description": "Krishtakka begins her education at 62. The story refuses the idea that learning belongs to the young.",
      "evidence": [
        "'I want to learn the Kannada alphabet from you,' she said.",
        "'For a good cause if you are determined, you can overcome any obstacle.'"
      ],
      "reflection_prompt": "Think of someone in your family who didn't get a chance to study. What is one thing you could teach them this month?"
    }
  ]
}
```

**Field rules:**
- `themes[].title` — phrase, not a sentence. "Learning has no expiry date" not "The theme is that one can learn at any age."
- `themes[].description` — 1–2 sentences, neutral framing. Do not impose a moral.
- `themes[].evidence` — 1–3 short quotations from the text. Use the original Kaveri text verbatim.
- `themes[].reflection_prompt` — points outward, to the student's own life. Must be genuinely open. Do not collapse into a yes/no.
- 2–4 themes per page is the sweet spot. Five+ is overload.
- One `theme_explorer` per chapter. Place on the "Themes" page.

### 4.6 `tone_meter` — the emotional arc made visible

A horizontal scrubber showing how the dominant emotion shifts across the chapter. Especially useful for poems (where every line shifts mood) and short stories with clear emotional movement.

```json
{
  "id": "uuid",
  "type": "tone_meter",
  "order": 4,
  "segments": [
    {
      "id": "uuid",
      "excerpt": "I used to stay in a village in north Karnataka with my grandparents.",
      "emotion": "warmth",
      "intensity": 3,
      "note": "An everyday setting, written with affection. The story begins in a familiar register."
    },
    {
      "id": "uuid",
      "excerpt": "I saw my grandmother weeping silently, holding the magazine.",
      "emotion": "sorrow",
      "intensity": 5,
      "note": "The first emotional peak. The reader does not yet know what made her cry."
    }
  ]
}
```

**Field rules:**
- `segments[].excerpt` — short text from the passage. Exact substring.
- `segments[].emotion` — one word. Use the vocabulary you want the student to internalise (wonder, dread, regret, tenderness, defiance).
- `segments[].intensity` — 1 (faint) to 5 (overwhelming).
- `segments[].note` — one sentence on *why* this segment carries this emotion.
- 4–8 segments per chapter. The arc should be visible — if every segment is intensity 3, the meter is uninformative.
- Use on **every poem** and on prose chapters with clear emotional movement. Skip on prose chapters that are mostly informational.

### 4.7 `cultural_context_card` — context one tap away

A standalone block (not inline) for cultural, historical, or geographical references the student may not know. Examples from Kaveri Ch 1 alone: Kashi, Lord Vishweshwara, *Kashi Yatre*, Triveni (the pen-name), *Karmaveera* magazine.

```json
{
  "id": "uuid",
  "type": "cultural_context_card",
  "order": 2,
  "reference": "Kashi",
  "category": "place",
  "short_desc": "An ancient holy city in Uttar Pradesh, also called Varanasi or Banaras.",
  "detail": "Kashi (Varanasi) sits on the banks of the river Ganga. For Hindus it is the most sacred pilgrimage site of all — visiting Kashi and worshipping Lord Vishweshwara is believed to bring liberation (*moksha*). For an elderly south Indian villager in the 1960s, going to Kashi was the dream of a lifetime — often the journey of a final farewell.",
  "image_url": "",
  "image_prompt": "Watercolour painting of the ghats of Varanasi at dawn — wide stone steps descending into the Ganga, oil lamps on the water, faint silhouettes of pilgrims. Dark sky with the first warm light of sunrise. Loose watercolour washes, gentle colour bleeds, visible paper grain, luminous against the dark ground. No text."
}
```

**Categories:** `place`, `person`, `event`, `concept`, `tradition`.

**Field rules:**
- `short_desc` — one line, headline-style.
- `detail` — 2–4 sentences. Tell the student what they need to feel the story, not encyclopaedic facts. Bold the key term once.
- `image_url` / `image_prompt` — optional. Use for places and traditions where a visual genuinely helps; skip for abstract concepts.
- Place immediately after the `narrated_passage` block whose passage mentions the reference. Inline placement is also fine when the passage is long enough to wrap context cards around it.
- Maximum 3 per page; otherwise the context overwhelms the literature.

### 4.8 `comprehension_checkpoint` — Kaveri's "Check Your Understanding" mid-passage

Maps directly to Kaveri's printed **Check Your Understanding** mini-sections that appear *between* parts of a long passage. Lighter weight than `inline_quiz` (which is the page closure).

```json
{
  "id": "uuid",
  "type": "comprehension_checkpoint",
  "order": 5,
  "intro": "Pause and check before you read on.",
  "questions": [
    {
      "id": "uuid",
      "question": "Why did the grandmother stop coming to the temple?",
      "options": [
        "She had a fight with her friends",
        "She lost interest in religion",
        "The narrator went away to a wedding, so there was nobody to read the magazine to her",
        "The temple was closed for renovation"
      ],
      "correct_index": 2,
      "explanation": "The text tells us the narrator went away. The grandmother could not read the magazine herself — so she could no longer follow the story she had been waiting to hear."
    }
  ]
}
```

**Field rules:**
- 1–2 questions per checkpoint. Three is the absolute maximum.
- Questions can be open-ended (`options` omitted) — useful for Kaveri's reflective checkpoint questions like *"Do you think the narrator expected to see her grandmother weeping?"*
- Place mid-passage, exactly where Kaveri prints "Check Your Understanding".
- One checkpoint between each two `narrated_passage` blocks is the norm for long stories.
- The `intro` is optional but recommended — sets a softer tone than a quiz.

### 4.9 `writing_scaffold` — annotated model for the Writing Task

Kaveri's Writing Task gives a format (letter to editor, descriptive paragraph, dialogue, diary entry, speech) and points-to-remember. This block renders the full structure with an annotated model: each part of the model is a tappable region showing *why this works*.

```json
{
  "id": "uuid",
  "type": "writing_scaffold",
  "order": 4,
  "task": "Write a letter to the Editor of a local newspaper emphasising the importance of student participation in adult literacy camps.",
  "format": "letter",
  "model_parts": [
    {
      "id": "uuid",
      "label": "Sender's address & date",
      "text": "Rohan Sharma\n12-B, Civil Lines\nDehradun, Uttarakhand\n3rd June 2026",
      "annotation": "Always at the top-right of a formal letter. Name → address → date, each on its own line."
    },
    {
      "id": "uuid",
      "label": "Subject line",
      "text": "Subject: Students as Volunteers in Adult Literacy",
      "annotation": "Four to five words, title case. Tells the editor in one glance what the letter is about."
    },
    {
      "id": "uuid",
      "label": "Salutation",
      "text": "Sir / Madam,",
      "annotation": "Always formal. Never 'Dear Editor' for a letter to the editor."
    },
    {
      "id": "uuid",
      "label": "Paragraph 1 — state the problem",
      "text": "I write with reference to the article 'India's Literacy Gap' published in your newspaper on 28th May. As a concerned student, I want to draw your readers' attention to a quiet solution that already exists in our cities and villages — students themselves.",
      "annotation": "Open by referring to a published article or recent event. This earns the editor's attention and explains why you are writing now."
    },
    {
      "id": "uuid",
      "label": "Paragraph 2 — analyse the issue",
      "text": "Many adults around us never had the chance to study. Some are domestic workers, drivers, or grandparents — like the Krishtakka of Sudha Murty's story we read in school. They can teach us a great deal about life, but they cannot read a hospital prescription or a bank notice. School students, free for an hour after class, could change that. The cost is zero; the gain is dignity.",
      "annotation": "Build the case with a specific example — even a literary one. Specifics carry argument; vagueness loses it."
    },
    {
      "id": "uuid",
      "label": "Closing",
      "text": "Yours sincerely,\nRohan Sharma\nStudent, Class IX",
      "annotation": "End with the formal close + name + brief identifier."
    }
  ],
  "tips": [
    "Stick to the format. A letter to the editor that opens like a friendly chat will not be taken seriously.",
    "Use one specific example — a number, a story, a name. Generic appeals don't move readers.",
    "Keep the tone civil even when the issue is urgent."
  ]
}
```

**Format enum:** `letter`, `paragraph`, `essay`, `dialogue`, `diary_entry`, `speech`, `notice`.

**Field rules:**
- `task` — copied verbatim from Kaveri.
- `model_parts[].text` — a complete model answer broken into labelled parts. The student should be able to read the full model end-to-end without the annotations and still have a coherent piece.
- `model_parts[].annotation` — *why this works*, not *what this is*. Tap-to-reveal in the UI.
- `tips` — 2–4 practical writing tips, plain language.
- One `writing_scaffold` per Writing Task page.

### 4.10 `dialogue_role_play` — Listening & Speaking made interactive

Powers Kaveri's "Listening and Speaking" section in two modes: scripted dialogue role-play (student picks a character) or debate (student picks a side; pre-built sentence frames support them).

```json
{
  "id": "uuid",
  "type": "dialogue_role_play",
  "order": 4,
  "mode": "dialogue",
  "scene_description": "Sentila, 14, asks her mother Arenla why she will not teach her pot making.",
  "characters": [
    { "id": "sentila", "name": "Sentila", "color": "warm_amber" },
    { "id": "arenla",  "name": "Arenla (mother)", "color": "deep_clay" }
  ],
  "lines": [
    {
      "id": "uuid",
      "character_id": "sentila",
      "text": "Amma, you teach my cousins to weave. Why not me?",
      "audio_url": "",
      "stage_direction": "(quietly, looking at the loom)"
    },
    {
      "id": "uuid",
      "character_id": "arenla",
      "text": "Because pot making has given me nothing but tired arms and a few rupees. I want better for you.",
      "audio_url": "",
      "stage_direction": null
    }
  ],
  "debate_frames": null
}
```

For debate mode:
```json
{
  "mode": "debate",
  "scene_description": "Topic: \"Students should be required to volunteer in adult literacy camps.\"",
  "characters": [
    { "id": "for", "name": "For", "color": "emerald" },
    { "id": "against", "name": "Against", "color": "rust" }
  ],
  "lines": [],
  "debate_frames": {
    "for": [
      "To begin with, I would like to speak 'for' the topic…",
      "My first argument in favour of…",
      "Most importantly I want to mention that…",
      "In addition to that, I feel…"
    ],
    "against": [
      "On the contrary / On the other hand…",
      "There are two sides to this topic…",
      "There's no doubt that…",
      "Well, I am not sure whether you can really…"
    ]
  }
}
```

**Modes:** `dialogue`, `debate`.

**Field rules:**
- `mode: "dialogue"` — populate `lines`; leave `debate_frames` as `null`.
- `mode: "debate"` — populate `debate_frames`; `lines` can be `[]`.
- `characters[].color` — names map to dark-theme accents in the renderer; choose what fits the scene.
- `lines[].audio_url` — pre-recorded audio for that line, used when the student is NOT playing this character. Empty string → silent until recorded.
- `lines[].stage_direction` — optional, in italics in the UI, gives acting context.
- One `dialogue_role_play` per "Listening and Speaking" page.

### 4.11 `pronunciation_drill` — words that trip Hindi speakers

A focused workshop on words where Hindi-English speakers commonly mispronounce a syllable, swallow a final consonant, or mix up stress.

```json
{
  "id": "uuid",
  "type": "pronunciation_drill",
  "order": 5,
  "intro": "Hindi-speaking students often stumble on these. Tap to hear each one twice; then read it aloud.",
  "words": [
    {
      "id": "uuid",
      "word": "literature",
      "syllables": "LIT-ruh-cher",
      "ipa": "ˈlɪt.rə.tʃər",
      "audio_url": "",
      "context_sentence": "Kaveri is the new textbook of English literature for Class 9.",
      "common_mistake": "Often said as 'lit-rey-chur' — but the second syllable is a quick 'ruh', not 'rey'."
    }
  ]
}
```

**Field rules:**
- `syllables` — informal respelling with stress in CAPS. Friendlier than IPA for tier-2/3 students.
- `ipa` — optional, for students who want it.
- `common_mistake` — one specific Hindi-English mispronunciation pattern. Be concrete.
- 4–8 words per drill. More than 8 fatigues the student.
- One pronunciation drill per chapter, on the "Listening and Speaking" page or its own page.

---

## 5. Page Templates — One Per Kaveri Section

Every Kaveri chapter contains the same pedagogical sections. Each maps to one or more digital pages. The §4D one-page-one-sub-topic rule from the science workflow applies strictly — never carry a section's content across pages.

### 5.1 Reflect and Respond page (page 1 of every chapter)

```
Block 0:  image (hero banner, 16:5, watercolour)
Block 1:  curiosity_prompt                  ← rephrases Kaveri's discussion questions into one open question
Block 2:  callout[fun_fact]                 ← striking line from the chapter or a Sanskrit/Indian verse on the same theme
Block 3:  text                              ← short scene-set: who wrote this, why it matters to you, what to look for
Block 4:  vocabulary_lab (mode: flashcards) ← Kaveri's pre-teach vocabulary
Block 5:  inline_quiz                       ← 3 questions: recall, comprehension, interpretation
```

### 5.2 Reading for Meaning page(s) — usually 2–4 per chapter

Each "Reading for Meaning" digital page covers ONE coherent beat of the story (one Kaveri Part: I, II, III…). Long Parts can split into two digital pages with a `comprehension_checkpoint` between them.

```
Block 0:  image (hero banner, watercolour scene from this beat)
Block 1:  heading[2]                        ← "Part I: At the village" or similar
Block 2:  text                              ← one-line orientation: where in the story we are
Block 3:  cultural_context_card             ← optional, place if the passage opens with a reference
Block 4:  narrated_passage                  ← THE central block — original Kaveri text with glosses + audio
Block 5:  comprehension_checkpoint          ← Kaveri's "Check Your Understanding"
Block 6:  narrated_passage                  ← next beat of the story (if the page covers two beats)
Block 7:  image                             ← watercolour illustration of a key moment in this beat
Block 8:  reasoning_prompt                  ← interpretive, level 2 or 3
Block 9:  inline_quiz                       ← 3 questions on THIS page's beat
```

### 5.3 Characters page (when the story warrants it)

For stories with three or more meaningful characters, dedicate a page:

```
Block 0:  image (hero banner — group portrait scene)
Block 1:  text                              ← one-paragraph orientation
Block 2:  character_map                     ← the relationship graph
Block 3:  comparison_card                   ← compare two main characters (optional)
Block 4:  reasoning_prompt                  ← "Which character changes most across the story, and what causes the change?"
Block 5:  inline_quiz                       ← 3 questions
```

Skip this page entirely for chapters with 1–2 characters (the character work belongs in the Reading for Meaning pages instead).

### 5.4 Themes page

```
Block 0:  image (hero banner — symbolic / atmospheric)
Block 1:  text                              ← what a theme is, two-sentence intro
Block 2:  theme_explorer                    ← 2–4 themes with evidence + reflection prompts
Block 3:  callout[literature_in_life]       ← how the human situation plays out today
Block 4:  reasoning_prompt                  ← "The story does not say 'education is important.' How does it show it?"
Block 5:  inline_quiz                       ← 3 questions on themes
```

### 5.5 Poetry page (when the chapter contains a poem)

```
Block 0:  image (hero banner — atmospheric, evocative)
Block 1:  curiosity_prompt                  ← open question on the poem's theme, no jargon
Block 2:  text                              ← who wrote this poem, one-paragraph context
Block 3:  narrated_passage                  ← the full poem, paragraph = stanza, audio per line
Block 4:  tone_meter                        ← MANDATORY for every poem page
Block 5:  literary_devices_highlighter      ← MANDATORY for every poem page
Block 6:  theme_explorer                    ← 1–3 themes
Block 7:  reasoning_prompt                  ← interpretive on a specific word or image
Block 8:  inline_quiz                       ← 3 questions, third is interpretive
```

### 5.6 Working with the Text page

Renders Kaveri's comprehension questions as model-answer reveals.

```
Block 0:  image (hero banner)
Block 1:  text                              ← one-line intro: "Read the questions, attempt them in your head, then tap to see a model answer."
Block 2:  worked_example (variant: ncert_intext, reveal: tap_to_reveal)
Block 3:  worked_example
Block 4:  worked_example                    ← one block per Kaveri question (typically 5–7 per chapter)
Block 5:  reasoning_prompt                  ← one synthesis question on the chapter
Block 6:  inline_quiz                       ← 3 closure questions
```

### 5.7 Vocabulary and Structures in Context page

```
Block 0:  image (hero banner)
Block 1:  text                              ← short intro to the word-formation rule (binomials / prefixes / etc.)
Block 2:  vocabulary_lab (mode: binomials)  ← OR mode: affixes, idioms — match Kaveri's section
Block 3:  vocabulary_lab (mode: affixes)    ← second mode if the chapter covers two
Block 4:  inline_quiz                       ← 3 closure questions
```

### 5.8 Listening and Speaking page

```
Block 0:  image (hero banner — two people in conversation)
Block 1:  text                              ← intro: what skill we're practising
Block 2:  pronunciation_drill               ← MANDATORY if the chapter covers stress patterns or new vocabulary
Block 3:  dialogue_role_play (mode: dialogue OR debate, per Kaveri)
Block 4:  reasoning_prompt                  ← reflective: "Which side of the debate did you find harder to argue, and why?"
Block 5:  inline_quiz                       ← 3 questions
```

### 5.9 Writing page

```
Block 0:  image (hero banner)
Block 1:  text                              ← intro to the format (letter, paragraph, etc.)
Block 2:  writing_scaffold                  ← the annotated model
Block 3:  reasoning_prompt                  ← "Read paragraph 2 of the model. What one specific detail makes it persuasive?"
Block 4:  inline_quiz                       ← 3 questions on the format (not on the topic)
```

### 5.10 About the Author page

```
Block 0:  image (hero banner — atmospheric, place + period)
Block 1:  text                              ← one-paragraph orientation
Block 2:  meet_a_scientist                  ← reused as "Meet the Author"; populated with the author's bio
Block 3:  callout[india_voice]              ← Indian literary context — translator, contemporaries, tradition
Block 4:  callout[threads_of_curiosity]     ← a fascinating biographical detail
Block 5:  inline_quiz                       ← 3 questions on author + style
```

### 5.11 Page count expectation per chapter

For a typical Kaveri unit (Sudha Murty's chapter has 7 named sections + the story split into 4 parts):

| Page | Section | Notes |
|---|---|---|
| 1 | Reflect and Respond | Always page 1 |
| 2–5 | Reading for Meaning | One page per story Part |
| 6 | Characters | Skip if story has ≤2 characters |
| 7 | Themes | Mandatory |
| 8 | Working with the Text | Mandatory |
| 9 | Vocabulary and Structures in Context | Mandatory |
| 10 | Listening and Speaking | Mandatory |
| 11 | Writing | Mandatory |
| 12 | About the Author | Mandatory |

Typical chapter: **10–13 pages**. For the full Class 9 Kaveri (8 chapters): **~90 pages**. Comparable in size to the Class 9 Math book.

---

## 6. Voice & Tone Guide for Kaveri

### Voice (your authoring voice in `text`, `intro`, `annotation` fields)

- **Second person** — *you read*, *you notice*, *you might wonder*. Never *students* or *learners*.
- **Conversational but never breezy.** This is literature; the voice has dignity.
- **Lead with what the student already knows.** A 14-year-old in Dehradun knows what waiting for the bus feels like. Use that — *don't* lead with abstractions like "the narrative voice of the story".
- **Let the student feel before they analyse.** Most text blocks should sit BEFORE the literary-analysis blocks, not after.
- **Name the feeling.** When a paragraph turns sad, say so. Hindi-medium students aren't always sure when an English passage has shifted mood — the page should make that shift visible.

### Tone for non-native readers

- **No literary jargon without a definition the first time.** *Personification, simile, metaphor* — all defined inline on first appearance with a real example from the chapter.
- **Hindi gloss is a kindness, not a crutch.** Use it where the English word genuinely doesn't transfer (*pittance, tedious, deftly*). Skip it where the English is already clear from context.
- **One unfamiliar word per sentence, maximum.** When you write your own commentary, count the unfamiliar words a Hindi-medium 9th grader would hit. Two or more in a row, and the sentence has lost them.
- **Never quote a long line without breaking it.** *"For a good cause if you are determined, you can overcome any obstacle"* should be set apart visually (its own line, italics or callout), not buried mid-paragraph.

### What NOT to do

- ❌ Don't open a page with "In this lesson, we will learn about the theme of education." Open with a question, a striking line, or a scene.
- ❌ Don't paraphrase Kaveri's original text into "easier English" on the page. The original stays as written; glosses do the work.
- ❌ Don't tell the student what the story means. The story means what they read it to mean.
- ❌ Don't end a page with "Wasn't that an inspiring story?" Patronising. End with the inline quiz.
- ❌ Don't use exclamation marks in body text. Reserved for character dialogue when the text actually uses them.
- ❌ Don't write commentary that sounds like a teacher reading from a guide. Write commentary that sounds like a friend who has read the story three times.
- ❌ Don't translate proper nouns or place names. *Karnataka, Krishtakka, Kashi* stay as Kaveri prints them.

---

## 7. Image Style for English Pages — WATERCOLOUR

**The house style for every Class 9 Kaveri image is watercolour painting** (project decision, 2026-06-03). Every image-prompt field — hero banners, character portraits, author portraits, cultural-context illustrations, inline scene images — must specify a **loose, expressive watercolour style**: translucent washes, soft wet-on-wet colour bleeds, pigment granulation, and visible paper texture.

The platform-wide style lock from `BOOK_PAGE_WORKFLOW.md` §3.4.2 still applies — **dark backgrounds, no exceptions**. Watercolour is traditionally painted on white paper, so the two requirements are reconciled by specifying **luminous watercolour washes that glow against a dark ground** (think watercolour/gouache on toned dark paper). Keep all "dark background" phrasing; layer the watercolour technique on top of it.

| Concern | Science | English (Kaveri) |
|---|---|---|
| Style | Clean technical illustration / photorealistic | **Watercolour painting** — loose washes, soft bleeding edges, granulation, visible paper grain, luminous against a dark ground |
| Label colour | Orange (`#f97316`) | White or warm cream (`#f5f0e1`) when labels appear at all — but most English images have NO labels |
| Composition | Diagram-first (apparatus, mechanism) | Scene-first (a moment, a character, a place) |
| What it depicts | The mechanism the page explains | The *feeling* the page wants to leave |
| Labels / leader lines | Mandatory on diagrams | Almost never — scenes don't need labels |
| Author portraits | n/a | Watercolour bust portraits — dignified, period-appropriate, warm lighting on a dark ground |

**English hero-banner prompt template:**
```
Watercolour painting — an ultra-wide cinematic banner (16:5 ratio). [Scene — what is depicted, period and place].
[The emotional centre — what the viewer feels before reading]. Dark atmospheric background, warm rim lighting,
soft earth tones. Loose luminous watercolour washes, soft wet-on-wet colour bleeds, granulation and visible
paper grain, glowing against the dark ground. No text, no labels.
```

**Author portrait template (used by `meet_a_scientist` for English):**
```
Watercolour bust-portrait painting of [author name], [decade and country]. [Period-appropriate clothing and setting].
Warm lamplight on a dark neutral background. Dignified expression. Loose watercolour washes, soft bleeding edges,
pigment granulation, visible paper texture. No text.
```

**Cultural-context image template (used by `cultural_context_card`):**
```
Watercolour painting of [place or scene]. [Specific visual details]. [Time of day, lighting].
Dark atmospheric background, soft warm light. Loose watercolour washes, gentle colour bleeds, visible
paper grain, luminous against the dark ground. No text, no signage.
```

**Anti-patterns for English images:**
- ❌ Bright blue skies / daylight settings — break the dark-theme rule
- ❌ White or cream paper background — the wash must glow against a DARK ground (watercolour-on-toned-paper, not on-white)
- ❌ Photorealistic, 3D-rendered, or hard-edged digital-illustration looks — the medium is watercolour, always
- ❌ Cartoonish faces or stylised mascots — Kaveri is literary, not children's-book
- ❌ Floating text or labels on scenes (one exception: callout image_src thumbnails)
- ❌ Sci-fi or fantasy aesthetics on literary subjects
- ❌ Cluttered group portraits — keep one focal point per image

---

## 8. Audio Handling — Pre-Recorded Human Voice

Class 9 English ships with pre-recorded human audio (project decision, June 2026). The schemas already carry `audio_url` fields on `narrated_passage` sentences, `vocabulary_lab` cards, `dialogue_role_play` lines, and `pronunciation_drill` words.

### 8.1 Author–record–upload workflow

1. **Author** writes pages with all `audio_url` fields as empty strings (`""`). Pages ship immediately — the renderer hides the play button when `audio_url` is empty (or falls back to browser TTS if the book-level setting `audio_fallback: 'tts'` is enabled).
2. **Recording script generator** (`scripts/kaveri-audio/generate-recording-sheet.js` — to be built) reads a chapter's pages from MongoDB and produces a per-chapter recording sheet: every sentence to record, every vocab word, every dialogue line, every drill word — each with the exact filename the recorder should save.
3. **Voice talent** records in batches following the sheet. Files are saved with the canonical naming convention (see §8.3).
4. **Upload script** (`scripts/kaveri-audio/upload-batch.js` — to be built) uploads the batch to R2 under `kaveri/audio/ch{N}/` and runs a backfill script (`scripts/kaveri-audio/backfill-urls.js`) that populates `audio_url` fields on every matched block.

### 8.2 Recording specifications

| Block type | Recording unit | Approximate count per chapter |
|---|---|---|
| `narrated_passage` | One file per sentence | 60–120 sentences |
| `vocabulary_lab` (flashcards) | One file per word | 20–40 words |
| `vocabulary_lab` (binomials/idioms) | One file per binomial/idiom | 6–10 |
| `dialogue_role_play` (dialogue) | One file per line | 10–20 lines |
| `pronunciation_drill` | One file per word, recorded TWICE (back-to-back, in the same file, for drill repetition) | 4–8 words |

**Voice specification:**
- Indian-English accent, neutral register (not heavily-accented; not BBC-British).
- Adult voice. Female preferred for first-person narrators that are female in the source (Sudha Murty's chapter); male otherwise. We are not casting a different voice per character; the same narrator reads everyone.
- Pace: literary, not news-anchor-fast. ~150 words per minute.
- Recording quality: 48 kHz, mono, dynamic mic in a quiet room. Final files: 96 kbps mono MP3 (vocabulary) / 128 kbps mono MP3 (narrated passages).
- Two takes per sentence; keep the cleaner one.

### 8.3 File naming convention

```
kaveri/audio/ch{N}/
├── narrated/
│   └── ch{N}-p{page_number}-pg{paragraph_index}-s{sentence_index}.mp3
├── vocab/
│   └── ch{N}-vocab-{word_slug}.mp3
├── dialogue/
│   └── ch{N}-p{page_number}-l{line_index}.mp3
└── pron/
    └── ch{N}-pron-{word_slug}.mp3
```

Examples:
- `kaveri/audio/ch1/narrated/ch1-p3-pg1-s2.mp3`
- `kaveri/audio/ch1/vocab/ch1-vocab-tedious.mp3`

### 8.4 Browser TTS fallback (interim)

While recording is in progress, the renderer can fall back to the browser's built-in `SpeechSynthesis` API. Configure per book on the `Book` document with `audio_fallback: 'tts' | 'silent' | 'hide'`:
- `'tts'` — fall back to browser TTS. Sounds robotic but works.
- `'silent'` — show the play button but do nothing. Discourages a half-finished feel.
- `'hide'` — hide the play button entirely until audio exists. **Default for Kaveri** until first chapter's audio is recorded.

---

## 9. Hinglish Nuance for Literature

The §12 Hinglish authoring philosophy in `BOOK_PAGE_WORKFLOW.md` applies to English pages with **one critical override**:

> The literature itself never enters Hinglish mode. Only the commentary, explanation, vocabulary, and authoring voice do.

Concretely:

| Field | Hinglish behaviour |
|---|---|
| `narrated_passage.paragraphs[].sentences[].text` | **Always English, verbatim from Kaveri.** Never translated. |
| `narrated_passage.paragraphs[].hinglish_commentary` | **Hinglish.** This is the teacher-voice paragraph that lives BELOW the literature and explains it. |
| `narrated_passage.paragraphs[].sentences[].glosses[].hindi` | Devanagari one-word gloss. Independent of Hinglish toggle — always visible inside the popover when the student taps the word. |
| `narrated_passage.paragraphs[].sentences[].glosses[].example` | English. Shows the gloss-word in a new English context. |
| `vocabulary_lab.cards[].hindi` | Devanagari. Always visible. |
| `vocabulary_lab.cards[].example` | English. |
| `vocabulary_lab.cards[].memory_hook` | Author's choice — Hinglish if it lands better in Hindi rhythm; English otherwise. |
| `literary_devices_highlighter.passage` | English, verbatim. |
| `literary_devices_highlighter.devices[].matches[].explanation` | English in English mode; Hinglish in Hinglish mode (via parallel field — see §9.1). |
| `theme_explorer.themes[].description` and `reflection_prompt` | Hinglish parallel in Hinglish mode. |
| `character_map.characters[].bio` | Hinglish parallel in Hinglish mode. |
| `dialogue_role_play.lines[].text` | English. The literature is the literature. |
| `dialogue_role_play.scene_description` and stage directions | Hinglish parallel in Hinglish mode. |
| `writing_scaffold.model_parts[].text` | English (the model answer is in English — that's the lesson). |
| `writing_scaffold.model_parts[].annotation` and `tips` | Hinglish parallel in Hinglish mode. |
| `pronunciation_drill.words[].common_mistake` | Hinglish parallel — this is the diagnostic, and Hindi-speaking students follow it best in Hinglish. |

### 9.1 Storing Hinglish parallels for non-text blocks

For `text` blocks, the existing `hinglish_blocks` array on `BookPage` carries Hinglish twins keyed by block id. For non-text blocks with explainer fields (theme descriptions, gloss popovers, etc.), we extend the convention:

- For each new English block that has explainer fields, the Hinglish parallel lives in a sibling field with the `_hinglish` suffix when meaningful (e.g. `theme_explorer.themes[].description_hinglish`).
- Alternatively, the `hinglish_blocks` array can carry an entire shadow block of the same type with the same id but with explainer fields filled in Hinglish. The renderer prefers the shadow block when in Hinglish mode and the original block in English mode.
- **Decision pending review:** choose one of the two patterns when building the renderer. The schemas below leave both doors open.

### 9.2 What "teacher voice" means for Kaveri Hinglish commentary

Imagine an experienced school-teacher in Dehradun (UP / Uttarakhand belt) explaining a Sudha Murty story to a Hindi-medium class. They:
- Read the English sentence aloud first.
- Pause. Say *"dekho, isme keh raha hai…"*
- Re-tell the same sentence in their own Hinglish words, ~the same length.
- Sometimes add one sentence of context the printed book leaves out.

That's the commentary register. Not formal translation. Not dumbing-down. A friend explaining a story.

---

## 10. India-as-Default

Kaveri is overwhelmingly written by Indian authors about Indian characters and Indian places. Treat that as the **default**, not as a callout-shaped sticker. Concretely:

1. **Indian author bios are the norm, not the exception.** Use `meet_a_scientist` (rendered as "Meet the Author") on every chapter's About the Author page, populated with the Indian author.
2. **The `india_voice` callout** is for *deepening* India context, not announcing it. Use it for: the translator (Triveni was a pen-name; the magazine that first published the story; the regional language and what it meant in 1960s Karnataka); a contemporary Indian author working the same theme; or a Sanskrit/regional verse that the chapter's theme echoes.
3. **Never add an Indian connection to a chapter that doesn't have one organically.** If a Kaveri chapter is by a non-Indian author, skip the `india_voice` callout entirely. Do not fabricate.
4. **Place names, character names, regional words** — keep them as Kaveri prints them. Italicise on first appearance with a small inline gloss (e.g. *Avva* — Kannada for grandmother).
5. **The hero banners reflect Indian visual culture** — village courtyards, riverbanks, hill-station roads, brass lamps, handloom looms, kachcha houses with tiled roofs. Do not default to Western literary aesthetics (lake cabins, oak desks, English countryside) unless the chapter is set there.

---

## 11. Per-Page Pre-Publish Checklist

Before saving any Class 9 English page, verify every item. Use this in PR review and in the AI-author's self-check.

### Structure
- [ ] Page maps to exactly **one** Kaveri section (declared in `tags`)
- [ ] Block 0 is `image` (hero banner, 16:5, watercolour, dark)
- [ ] The page closes with `inline_quiz` of exactly 3 questions (recall → comprehension → interpretation)
- [ ] If this is a Reading for Meaning page, at least one `narrated_passage` block is present
- [ ] If this is a Poetry page, `tone_meter` and `literary_devices_highlighter` are both present
- [ ] Page count for this chapter, after this save, is ≤ 13

### Literature
- [ ] All passage text in `narrated_passage` matches Kaveri verbatim (no rephrasing, no shortening)
- [ ] At least one Hindi gloss appears on every paragraph of `narrated_passage` (for passages with ≥5 sentences)
- [ ] No reasoning prompt closes a literary question with a single correct interpretation
- [ ] No commentary text uses literary jargon without inline definition on first use

### Non-native reader handhold
- [ ] Every culturally-specific reference in the passage either has a `cultural_context_card` placed near it or is glossed inline
- [ ] The first commentary paragraph on the page is no more than 50 words (sets a low cognitive-load opening)
- [ ] No commentary sentence has more than one unfamiliar-to-Hindi-speaker word

### Voice
- [ ] Second person (*you*) throughout
- [ ] No "In this lesson, we will…" openings
- [ ] No "Wasn't that an inspiring story?" or other patronising closures
- [ ] Indian names, place names, and regional words preserved exactly as in Kaveri

### Audio
- [ ] `audio_url` fields are present (empty string `""` is fine for unrecorded pages)
- [ ] If this chapter's audio is recorded, every sentence / vocab word / dialogue line has a populated `audio_url`

### Image
- [ ] Hero banner `generation_prompt` follows §7 watercolour template
- [ ] All images specify a **watercolour painting** style (loose washes, soft bleeds, paper grain)
- [ ] All other images are dark-background, no labels (unless required)
- [ ] No image prompt would generate a light/cream/white background — the wash glows against a DARK ground

### Hinglish
- [ ] If `hinglish_blocks` is provided, the literature itself (passage text) is **not** translated — only the commentary fields are
- [ ] Hinglish commentary keeps English for technical/familiar words per §12 of `BOOK_PAGE_WORKFLOW.md`

---

## 12. Anti-Patterns Specific to English

These are the failure modes most likely to appear when an AI agent tries to author an English page. Watch for them.

| Anti-pattern | Why it fails | Fix |
|---|---|---|
| **"Simplifying" Kaveri's passage** | Kills the literature. The whole point is to make the original accessible, not to replace it. | Original verbatim in `narrated_passage.text`; glosses do the work. |
| **One-correct-interpretation reasoning prompts** | "What is the moral of the story?" closes the door literature opens. | Re-write as "Which line do you think shows…?" — multiple answers defensible. |
| **Western literary references dropped in** | Frost / Yeats / Beethoven name-drops feel performative when Kaveri is Indian-led. | Only reference Western authors when Kaveri's chapter does. Otherwise stay Indian. |
| **Vocabulary-card meanings that loop back to the word** | "Tedious: tedious work" — circular. | Define using everyday concrete language, give an unfamiliar-context example. |
| **Glosses on every other word** | Page looks like a dictionary, kills reading flow. | 1 gloss per 50 words of passage is the target. |
| **Hindi-only gloss with no example** | Student reads the translation, never internalises the English word. | Always pair Hindi gloss with an English example sentence. |
| **Treating the writing scaffold as a worksheet** | "Fill in the blanks" version of letter writing teaches nothing. | Always show a full annotated model the student can read end-to-end. |
| **Adding `simulation` blocks "for engagement"** | English isn't simulable. | Use `literary_devices_highlighter` — same engagement, actual pedagogical value. |
| **Translating proper nouns** | "Sudha Murty" → "Sudhā Mūrti" is wrong. | Names as Kaveri prints them. |
| **Patronising callouts ("did you know reading is important?")** | Insults the student. | If you can't write a callout that surprises a 14-year-old, drop it. |

---

## 13. Building the First Book

The Class 9 English Kaveri book lives in the `books` collection as a single document:

```json
{
  "slug": "class9-english-kaveri",
  "title": "Kaveri — Class 9 English (NCERT)",
  "subject": "english",
  "grade": 9,
  "board": "ncert",
  "cover_image": "",
  "chapters": [
    { "number": 1, "title": "How I Taught My Grandmother to Read", "slug": "how-i-taught-my-grandmother", "page_ids": [], "is_published": false },
    { "number": 2, "title": "The Pot Maker", "slug": "the-pot-maker", "page_ids": [], "is_published": false }
  ]
}
```

The book record must be created once before any page can be POSTed to its API endpoint. The chapters array is populated chapter-by-chapter as pages are built.

**Note:** `Book.subject` currently allows `'chemistry' | 'biology' | 'physics' | 'mathematics'`. Adding `'english'` is part of the schema work for this rollout (see the type and Zod schema additions accompanying this doc).

---

## 14. Worked Example — Chapter 1 Page Outline

A complete, block-by-block plan for Chapter 1 lives at [`_agents/plans/KAVERI_CH1_OUTLINE.md`](../plans/KAVERI_CH1_OUTLINE.md). Read it after this doc — it is the proof-of-workflow for the patterns above. The outline does not contain JSON; it contains the block sequence, content notes, and image prompts page by page.

After Chapter 1 ships and is reviewed, the same outline approach is used for Chapters 2–8.

---

## 15. Open Questions Flagged for Review

These remain undecided and need a call before the schemas are wired into the renderer:

1. **`hinglish_blocks` shape for non-text blocks** — sibling `_hinglish` field per explainer field, or shadow-block-by-id pattern (see §9.1). Both have trade-offs. Recommend deciding when the first non-text Hinglish parallel is authored, not before.
2. **Browser-TTS fallback default** — `Book.audio_fallback` should default to `'hide'` until the first chapter's audio is recorded. Confirm.
3. **One narrator vs voice-per-character** — current spec is single narrator for all blocks. If a future chapter has dramatic dialogue that benefits from multiple voices, we revisit.
4. **`meet_the_author` alias** — keep using `meet_a_scientist` (and let the renderer relabel based on the book subject), or introduce an alias type `meet_the_author` for clarity? Recommend the relabel approach (zero schema change), but flag for review.
