# Class 9 Social Science — Book Build Ledger

> **Resumable progress tracker for building the Class 9 Social Science Live Book one chapter at a
> time.** Any session resuming this work reads THIS file first to find the exact next page to
> build. Companion to `_agents/state/LIVE_BOOKS_STATE.md` (DB inventory) — this file holds the
> *plan and the resume point*. After building pages, update both: tick pages here, and run
> `node scripts/livebooks-state.js` + add a Changelog line there.
>
> **📐 The canonical HOW (structure, voice, mechanic palette, discipline adaptations, image style)
> lives in [`_agents/workflows/SOCIAL_SCIENCE_BOOK_WORKFLOW.md`](../workflows/SOCIAL_SCIENCE_BOOK_WORKFLOW.md)
> — read it before authoring any page. THIS file is the WHAT/WHERE (which chapter/page is next).**

- **Book**: `class9-social-science` · BOOK_ID `a60d142c-c96b-48cc-ba72-e68d71d83802`
- **Source**: NCERT *"Understanding Society: India and Beyond" — Social Science Textbook for
  Grade 9, Part 1* (new 2026 integrated Social Science curriculum — replaces the old separate
  History/Geography/Political Science/Economics books with one merged text, 9 chapters).
- **Track**: Class 9 "Exploration" template (BOOK_PAGE_WORKFLOW.md §4B), **adapted for humanities**
  (see "Template adaptation" below) — this is the first non-science subject to use §4B.
- **Build settings (locked 2026-07-04, mirrors class9-ict/class9-mathematics precedent)**:
  English-only (`hinglish_blocks: []`) · images as `src:''` + `generation_prompt` (filled later via
  `scripts/livebook-images/`) · `published: false` on every new page.
- **Per-page script pattern**: `scripts/create_sst_ch{N}_p{M}_{slug}.js` (direct Mongo insert +
  `$push` into `books.chapters.$.page_ids`), mirroring `create_math_ch*` / `create_ict_ch*`.
- **Cadence**: per chapter — (A) draft page plan below → user approves → (B) build all pages →
  (C) refresh state + changelog, user reviews chapter.

---

## Template adaptation for Social Science (proposed, flag for user confirmation)

BOOK_PAGE_WORKFLOW.md §4B was written for science chapters. Reusable as-is:
`curiosity_prompt` (Block 1), `reasoning_prompt` (mid-page), `inline_quiz` (last block), hero
banner, `text`/`heading`/`callout`/`image`/`table`/`comparison_card`/`timeline`/`interactive_image`.

Two blocks need a humanities relabelling of intent (not a schema change — same JSON shape):
- **`india_science` callout** → used here for India's civilisational/intellectual/policy
  contributions (Arthaśhāstra, Panchayati Raj, Pañchamahābhūtas, Mādhava-style traditions of
  reasoning) rather than strictly "scientific" ones. Same field names, broader subject.
- **`meet_a_scientist` block** → used for a historical/political/economic thinker (e.g. Kautilya,
  Ambedkar) when a page has a genuine one-person story. Same fields (`name`, `contribution`,
  `connection`, `fun_detail`), the "scientist" framing is just the block's legacy name.
- **`simulation` / `worked_example`** — skipped where the chapter has no numerical/mechanistic
  content (most of History/Political Science/Geography-descriptive pages). Kept for Geography
  physical-process chapters (Ch2 landform shaping, Ch3 climate) and Economics (Ch8–9 have real
  numerical reasoning — demand curves, opportunity cost trade-offs).

If this reads wrong once you see Chapter 1 built, say so and we'll adjust before Chapter 2.

**Standing rule added 2026-07-05 (founder, after reviewing Ch1+Ch2): image-rich + step-by-step
interactive reveals, wherever a natural fit exists.** Applies going forward to every chapter AND
retroactively to Ch1/Ch2 (still drafts). Concretely:
- Every page should carry more than just the hero — a real supporting diagram/image wherever the
  content has something visual to show (a process, a labelled structure, a comparison).
- Any time a page lists 3–5 named sub-types/categories/stages (e.g. "three types of weathering,"
  "four historical evidence types," "the four plate boundary types," "five Panchamahabhuta
  elements") — convert that list into a step-by-step reveal instead of flat prose/bullets/a table.
  Reuse existing platform blocks rather than inventing new ones: `guided_reveal` (paced click/key-
  advance slide-build, built for Life Skills, content-driven + reusable platform-wide — the best
  fit for reveal-by-category content with no real diagram yet) and `interactive_image`
  (click-hotspots-on-a-diagram — best once a real multi-part diagram exists, e.g. Earth's interior
  layers). See the codebase for exact schemas before authoring — check `packages/data/types/books.ts`
  / `packages/data/books/schemas.ts` and the renderer registration in `BlockRenderer.tsx`.

---

## Source mapping — NCERT "Understanding Society: India and Beyond", Grade 9 Part 1

Source folder: `/Users/CanvasClasses/Downloads/Class 9 Social science/`

| Source PDF | Src # | Source title | Pages | DB chapter | Discipline | DB status |
|---|---|---|---|---|---|---|
| iest101 | 1 | Understanding Social Science | 12 | Ch1 Understanding Social Science | Foundational/all four | ✅ built (9p) |
| iest102 | 2 | Shaping of the Earth's Surface | 26 | Ch2 Shaping of the Earth's Surface | Geography | ✅ built (12p) |
| iest103 | 3 | Atmosphere and Climate | 22 | Ch3 Atmosphere and Climate | Geography | ⬜ not started |
| iest104 | 4 | Early Humans and Beginning of Civilisation | 34 | Ch4 Early Humans and Beginning of Civilisation | History | ⬜ not started |
| iest105 | 5 | State and Society up to 1000 CE | 42 | Ch5 State and Society up to 1000 CE | History | ⬜ not started |
| iest106 | 6 | Democracy | 24 | Ch6 Democracy | Political Science | ⬜ not started |
| iest107 | 7 | Elections | 22 | Ch7 Elections | Political Science | ⬜ not started |
| iest108 | 8 | Building Blocks in Economics: The Problem of Choice | 12 | Ch8 Building Blocks in Economics | Economics | ⬜ not started |
| iest109 | 9 | The Price Puzzle: What Drives the Market | 26 | Ch9 The Price Puzzle | Economics | ⬜ not started |

`iest1ps.pdf` (24pp) = Prelims/front matter only (title page, foreword, ISBN) — not a content
chapter, no action needed.

---

## Chapter 1 — Understanding Social Science (source: iest101.pdf, 12pp)   [✅ COMPLETE 2026-07-05 — 9/9 pages]

**Role in the book:** orientation/overview chapter — not a deep-dive topic. Introduces what Social
Science is, its roots in Indian intellectual tradition, and previews the four disciplines
(Geography, History, Political Science, Economics) the student will study over Grades 9–10.
Closest analogue in the existing library: `class9-science` Ch1 "Exploration: Entering the World of
Secondary Science" (8 pages) and `class9-ict` Ch1 "Introduction to ICT" (6 pages) — both orientation
chapters for a new subject.

Source section flow: (1) What is Social Science + everyday-life examples + "Let's Analyse"
activity · (2) Understanding Society through Time and Traditions — Pañchamahābhūtas, vasudhaiva
kuṭumbakam, Arthaśhāstra/Kauṭilya · (3) Social Science as a Study of Disciplines — drought example,
naming the 4 core disciplines + the wider family (Sociology, Philosophy, Anthropology, Psychology)
· (4) Geography deep-dive + "Let's Explore" (NCERT Bhuvan portal) + 2-year topic preview · (5)
History deep-dive — itihāsa-purāṇa tradition, modern historiography, empirical evidence + 2-year
preview · (6) How historians know the past — four source types: Literary, Archaeological,
Epigraphic, Numismatic (9 figures: manuscripts, terracotta figurine, sculptures, inscriptions,
coins) · (7) Political Science deep-dive — Panchayati Raj, dharma/artha/rājadharma, Arthaśhāstra as
political text + 2-year preview · (8) Economics deep-dive — India's economic history, colonial
disruption, post-independence rebuilding, current challenges + 2-year preview · (9) Why Should We
Study Social Science? · (10) The Future of Social Science · (11) Secondary-Stage Social Science:
Your Two-Year Learning Journey (closing synthesis + book roadmap).

No numbered worked examples/simulations in this chapter (pure orientation prose + 2 activities:
"Let's Analyse", "Let's Explore"). Richest visual opportunity: the four-source-types page (9
figures in source) — strong `interactive_image` or `comparison_card` candidate.

| # | slug | sub-topic (one page = one closed idea) | source | status |
|---|---|---|---|---|
| 1 | what-is-social-science | Definition; everyday life is built from SS systems (house, food, roads, school, power); "Let's Analyse" activity reframed as the page's curiosity_prompt/reasoning_prompt | intro, "Let's Analyse" | ✅ 07-05 |
| 2 | indias-roots-in-social-thinking | Pañchamahābhūtas (environment-society interconnection), vasudhaiva kuṭumbakam, Arthaśhāstra/Kauṭilya — systematic social thought predates modern academic disciplines by millennia | "Understanding Society through Time and Traditions" | ✅ 07-05 |
| 3 | four-disciplines-one-society | SS is a family of disciplines, not one subject; the drought example (environment+economy+politics+society+culture in one event); names the 4 core + wider family (Sociology, Philosophy, Anthropology, Psychology) | "Social Science as a Study of Disciplines" | ✅ 07-05 |
| 4 | geography-the-study-of-place | What Geography studies; spatial+temporal lens; India's coastline/global-hub example; tools (maps, GIS, Bhuvan); "Let's Explore" activity; 2-year preview | "Geography" section | ✅ 07-05 |
| 5 | history-the-study-of-the-past | What History studies; itihāsa-purāṇa tradition; modern historiography (empirical evidence, carbon-14, genetics); 2-year preview (Greco-Roman → Industrial Revolution → colonialism) | "History" section (pre-sources) | ✅ 07-05 |
| 6 | how-historians-know-the-past | The four evidence types: Literary, Archaeological, Epigraphic, Numismatic sources — what each is + example figures (Sāmaveda ms, Tirukkuṟaḷ palm-leaf, Sindhu-Sarasvatī terracotta, Viṣhṇu sculpture, Brahmi/Kannada inscriptions, Samudragupta/Jahangir coins) | "History" sources subsection, Figs 1.2–1.9 | ✅ 07-05 |
| 7 | political-science-power-and-governance | What Political Science studies; Panchayati Raj as grassroots democracy; ancient roots (dharma/artha/rājadharma, Arthaśhāstra as governance text); 2-year preview (democracy, elections, governance) | "Political Science" section | ✅ 07-05 |
| 8 | economics-choices-and-resources | What Economics studies; consumers/producers/government decisions; India's economic history (pre-colonial strength → colonial disruption → post-independence rebuilding → present challenges); 2-year preview | "Economics" section | ✅ 07-05 |
| 9 | why-social-science-matters | Why Study SS (civic participation, understanding diversity+unity, shared challenges) + The Future of SS (climate, sustainable development, technology) + Two-Year Learning Journey (closing roadmap, sets reader expectations for the rest of the book) | closing 3 sections | ✅ 07-05 |

_~9 pages for a 12pp source chapter — denser than a typical topic chapter because it previews 4
full disciplines, each with its own India-context story. Comparable to `class9-science` Ch1 (8
pages) and richer than `class9-ict` Ch1 (6 pages, single discipline). Heaviest pages: 6 (9 figures),
2 and 8 (dense India-history content). Adjust on approval._

**Anti-hallucination note (Rule 0):** every fact above (Pañchamahābhūtas, vasudhaiva kuṭumbakam,
Arthaśhāstra/Kauṭilya dating "~2,300 years ago", the 4 source types + all 9 figure captions, the
Panchayati Raj framing, India's economic-history narrative) is quoted/paraphrased directly from
`iest101.pdf` — nothing added from training knowledge. Two glossary sidebars in the source
("Empirical evidence", "Genealogical records") were noted but are folded into page 5's prose rather
than given their own callout, since they're short one-line NCERT margin defs, not standalone
teaching points.

---

## Chapter 2 — Shaping of the Earth's Surface (source: iest102.pdf, 26pp)   [✅ COMPLETE 2026-07-05 — 12/12 pages, ✅ IMAGES 2026-07-08 — 26/26 ingested]

Physical geography — far denser than Ch1: ~30 named landform types across 5 gradation agents
(running water, waves/currents, glaciers, wind, groundwater), plus plate tectonics, weathering,
erosion, and 4 disaster types (landslides, avalanches, GLOFs, dust storms). 30 figures in source.

Source flow: Plate tectonics (Earth's layers, plate types, convection, Fig 2.1–2.3, Let's Map) →
plate boundaries (convergent/divergent/transform, Fig 2.4, Ring of Fire) → India earthquake risk
(Gujarat 2001, Fig 2.5) + ancient Indian seismology (Bṛihatsaṁhitā/Varāhamihira) → volcanic
deposition (Fig 2.6) + Baratang mud volcano (Fig 2.7) → Weathering (physical/chemical/biological,
Fig 2.8) → Erosion (water/wind/glacial/coastal, Fig 2.9) + effects on livelihoods + ancient Indian
water conservation (Sindhu-Sarasvatī contouring/bunding/terracing, Arthaśhāstra, Zabo system
Nagaland) → Agents of gradation overview + landforms-shaped-history (Ganga/Nile/Indus, Himalayas,
Thar/Silk Route, south Indian coastal kingdoms) → Running water (course stages, waterfall Fig 2.10,
meander Fig 2.11 + Grand Anicut, delta Fig 2.12 + Sundarbans Fig 2.13) → Waves/currents (beach
Fig 2.14, coastal erosion landforms Fig 2.15–2.16) → Glaciers (erosional landforms Fig 2.17–2.18,
moraines Fig 2.19, Chamoli flood 2021) → Wind (erosional landforms Fig 2.21, oasis Fig 2.22, dunes
Fig 2.23) → Underground water/karst (cave Fig 2.24, sinkholes Fig 2.25, underground river Fig 2.26)
→ Landforms and Disasters (landslides/avalanches/GLOFs/dust storms, Fig 2.27–2.30) → closing recap.

No existing simulation is a clean fit for plate tectonics/erosion (§4E) — diagrams (regenerated in
house style from the 30 source figures) + text carry the content, matching the math-chapter
precedent for image-heavy, non-numerical topics. No worked_examples (no calculations in this
chapter).

| # | slug | sub-topic | source | status |
|---|---|---|---|---|
| 1 | plate-tectonics-earths-moving-crust | Earth's layers (crust/mantle/core/lithosphere/asthenosphere); plate types; convection currents driving movement | Plate Tectonics intro, Fig 2.1–2.3 | ✅ |
| 2 | plate-boundaries-earthquakes-and-volcanoes | 3 boundary types + resulting features; Ring of Fire; India's earthquake risk (Gujarat 2001); ancient Indian seismology; Baratang mud volcano | Fig 2.4–2.7 | ✅ |
| 3 | weathering-breaking-rock-in-place | Physical, chemical, biological weathering | Weathering, Fig 2.8 | ✅ |
| 4 | erosion-and-indias-ancient-water-wisdom | Erosion types; effects on farming/coasts/construction/tourism; Sindhu-Sarasvatī/Arthaśhāstra/Zabo water conservation | Erosion, Fig 2.9 | ✅ |
| 5 | agents-of-gradation-and-landforms-in-history | 5 agents overview; how rivers/mountains/deserts/coasts shaped human history | Agents of Gradation | ✅ |
| 6 | rivers-waterfalls-meanders-and-deltas | A river's journey (upper/middle/lower course); waterfall; meander + Grand Anicut; delta + Sundarbans | Running Water, Fig 2.10–2.13 | ✅ |
| 7 | coastal-landforms-beaches-cliffs-and-stacks | Beach formation; coastal erosion landforms (cliffs, wave-cut platforms, caves, arches, stacks) | Waves and Currents, Fig 2.14–2.16 | ✅ |
| 8 | glacial-landforms-and-moraines | Glacial erosion landforms (U-valleys, cirques, aretes, hanging valleys, fjords); moraines; Chamoli flood | Glaciers, Fig 2.17–2.20 | ✅ |
| 9 | wind-landforms-deserts-dunes-and-oases | Wind erosion landforms (yardangs, ventifacts, deflation hollows, desert pavements); oasis; dune types | Wind, Fig 2.21–2.23 | ✅ |
| 10 | underground-water-caves-and-karst-landscapes | Karst topography: caves, stalactites, stalagmites, sinkholes, underground rivers | Underground Water, Fig 2.24–2.26 | ✅ |
| 11 | landforms-and-disasters | Landslides, avalanches, GLOFs, dust storms — causes of each | Landforms and Disasters, Fig 2.27–2.30 | ✅ |
| 12 | shaping-the-earths-surface-toolkit | Synthesis: internal vs external forces recap; chapter mastery quiz | Before We Move On | ✅ |

_12 pages for a 26pp source chapter — denser than Ch1 (9p/12pp) because of the sheer number of
named landform categories._

**Post-build quality pass (2026-07-05):** attempting to author quiz balance "from the start" this
time still wasn't enough — the auto-check found 24 of 36 questions with length-tell risk (short
bare-term distractors next to one long descriptive correct answer; worst cases ratio 11.75× and
4.47×) even though position spread landed perfectly (25/25/25/25 by design, cycling correct_index
0-1-2-3 across all 36 questions). Also missed the required-minimum callout on
`rivers-waterfalls-meanders-and-deltas` entirely. All fixed via `book-writer.savePage` (versioned,
no content-loss flag needed — only option text lengthened + one callout inserted): lengthened every
flagged distractor into a comparably-detailed real trap, added the missing callout, reindexed block
order after the insert. Final state: 0 structural issues, 0 length-tell warnings, 25/25/25/25
position spread. **Lesson for Ch3 onward: author full-sentence distractors for EVERY question from
the first draft, including short factual-recall questions — the bare-term-vs-full-sentence pattern
is the recurring failure mode, not just the position cycling.**

**Enrichment pass (2026-07-05, founder request) — image-rich + interactive step-reveals, applied
to Ch1+Ch2 retroactively.** See the standing rule above (Template adaptation section) and the
`LIVE_BOOKS_STATE.md` changelog for full detail. Summary: added `guided_reveal` blocks (paced
click-to-advance) to 17 pages covering every "3–5 named sub-types" list in both chapters (Panchamahabhutas'
5 elements, the 4 disciplines, geography's 5 tools, the 4 historical evidence types, dharma/artha/
rajadharma, the 3 plate types, the 3 boundary types, the 3 weathering types, the 4 erosion types,
the 5 gradation agents, the 3 moraine types, the 4 dune types, the 5 karst landforms, the 4
disasters, internal-vs-external forces), `timeline` blocks to 3 pages for genuinely sequential
content (India's economic journey, a river's course, cliff→stack coastal erosion), and 6 more
supporting images. Two static tables were replaced outright with `guided_reveal` (same content,
richer engagement). Scripts: `scripts/livebook-sst/enrich_ch{1,2}.js`. All 21 pages re-verified:
0 structural issues, every guided_reveal/timeline schema-valid, all ≤18 blocks.

**Engagement retrofit (2026-07-08, founder request) — audit against Singapore MOE Humanities +
Nordic phenomenon-based pedagogy, then a Tier 1 content-only fix.** Founder asked why social
science reads as boring and wanted concrete international-benchmark backing before touching
anything. Three parallel research passes: (1) a page-by-page audit of all 21 pages — found only
2/21 anchor on a named, dated, current real event (Cyclone Fani 2019 on Ch1 p3, Chamoli flood
Feb 2021 on Ch2 p8/p11), 6/21 lean on ancient-India trivia or a generic one-line hook with no
named place, and 0/21 mention a real profession that uses the knowledge; (2) Singapore MOE Social
Studies/Geography syllabi — "Issue Investigation" (chapters organized around a real unresolved
issue, not a topic list) and the Source-Based Case Study exam format (inference/comparison/
reliability questions on real, possibly-unseen sources, scored on reasoning quality not recall);
(3) Finland/Nordic phenomenon-based learning (`monialainen oppimiskokonaisuus` — a real
cross-subject anchor, student-chosen sub-angle, formative-first assessment, depth over coverage).
Synthesized into 4 principles (relevance as the opening beat not the closer; reasoning over
recall; content resolves to a named real place; name the job this becomes) and a 3-tier rollout
(Tier 1 retrofit now / Tier 2 new lightweight mechanisms / Tier 3 a phenomenon-anchored
cross-chapter module, deferred until Ch3–9 exist). Full write-up delivered as an artifact.

**Tier 1 executed same session** — `scripts/livebook-sst/tier1_engagement_retrofit.js`, all via
`book-writer.savePage` (versioned, content-loss guard never triggered — every edit is additive).
9 pages touched, 101 total blocks after, 0 structural issues, all schema-valid against the real
Zod `validateBlocks`:
- Named-place/current-event hook added to the 6 audited-thin pages: BIS seismic zoning (plate-
  boundaries), Taj Mahal marble "cancer" (weathering — was the single weakest page), Bhadla Solar
  Park in the Thar Desert (agents-of-gradation), Thar Desert kunds/tankas water-harvesting (wind-
  landforms, which hadn't named the Thar Desert despite using it two pages earlier), Meghalaya's
  karst caves (underground-water/karst), plus hands-on-observation hints filled into two existing
  `curiosity_prompt` blocks (how-historians-know-the-past, weathering).
- Two new **schema-level callout variants** added to `packages/data/books/schemas.ts`:
  `career_spotlight` and `evidence_pack` — both route through the existing default `NoteCallout`
  renderer (no new component needed; same renderer `india_science`/`bridging_science` already use).
- **`career_spotlight`** added to both chapter-closing pages (why-social-science-matters,
  shaping-the-earths-surface-toolkit) — names real professions per discipline (GIS analyst via
  Bhuvan, archivist, UPSC civil servant, RBI/NITI Aayog economist, seismologist at the National
  Center for Seismology, NDMA disaster officer, hydrologist, geotechnical engineer).
- **`evidence_pack`** (Tier 2, prototyped without a new block type) — one per chapter: "Three
  Clues, One Village" on how-historians-know-the-past (a 3-source reliability/inference task built
  from the page's own evidence taxonomy, not an external fact needing verification), and "Three
  Signals Before the Flood" on glacial-landforms-and-moraines (satellite/seismic/river-gauge
  reasoning task built on the page's existing Chamoli callout) — each paired with a
  `reasoning_prompt` whose `reveal` explains the reasoning process, not just the answer.

**New block type: `perspective_scenario` (2026-07-08, founder design) — a genuinely new mechanic,
not a reuse.** Founder's ask: real Indian disaster/policy events where students choose between
several options that are each a different valid perspective, none objectively correct — every
choice should lead to a more engaging discussion, not a right-answer hunt. Unlike `evidence_pack`
(converges on one well-reasoned conclusion), this never converges — the synthesis explicitly
avoids declaring a winner. Founder additionally required every instance be grounded in a real,
citable documented case (an actual institutional report/debate), not an invented hypothetical —
facts were verified via web search before writing, not drawn from memory alone.

Required real engineering (not just a callout-variant reuse, since it needs branching pick →
reveal → unlock-the-others interaction): new TS interface + `BlockType` entry in
`packages/data/types/books.ts`, new Zod schema in `packages/data/books/schemas.ts` (added to both
`ChildContentBlockSchema` and the top-level `ContentBlockSchema` unions), and a new renderer
`packages/book-renderer/blocks/PerspectiveScenarioRenderer.tsx` registered in `BlockRenderer.tsx`.
Visual identity: cool slate/indigo accent, deliberately distinct from curiosity_prompt (teal) and
reasoning_prompt's per-type colours, since nothing here should read as "correct." `tsc --noEmit`
clean on both `packages/data` and `packages/book-renderer`.

Fields: `title`, `role_frame` ("you're advising..."), `event_context` (the real documented
background, markdown), `source_note` (explicit citation, always visible to the student — not
optional, per founder's authority requirement), `prompt`, `options[]` (each with `label`,
`real_position` — which real report/stakeholder this represents — and `perspective`, that
position's real reasoning + tradeoff), `synthesis` (closing note, explicitly not a verdict).

First instance, on `landforms-and-disasters`: "How Much of the Western Ghats Should Be
Protected?" — grounded in two real Government of India expert panel reports verified via web
search before writing: the Western Ghats Ecology Expert Panel ("Gadgil Committee," constituted
4 Mar 2010 by the Ministry of Environment and Forests, chaired by ecologist Madhav Gadgil, report
submitted 31 Aug 2011, recommended the large majority of the range as an Ecologically Sensitive
Area) vs. the High-Level Working Group ("Kasturirangan Committee," constituted 2012 to reconsider
it, chaired by K. Kasturirangan, 2013 report recommending ~37% as ESA) — plus a third real
position (state governments/local industry pushing for delay + state-by-state exemptions).
Gadgil's claim that the 2018 Kerala floods were worsened by non-implementation is attributed to
him explicitly, not presented as settled fact. `scripts/livebook-sst/add_perspective_scenario.js`.
Re-validated all 21 Ch1+Ch2 pages against the real Zod `validateBlocks` after the schema change —
21/21 still pass, 0 failures.

**Founder decision confirmed (2026-07-08): stay fully-real, precisely citable** (not composite
hypotheticals) — applied immediately to the second instance below, facts verified via web search
before writing, same as the first.

**Second `perspective_scenario` instance + infographics added same session.** Founder asked for
two more things: (1) a second real instance, and (2) images for real-event blocks kept as
infographics specifically — offloading comparative/timeline facts (who proposed what, when, which
% ) from prose into the visual, so text stays short and precise. This required adding
`image_src`/`image_prompt`/`image_caption` to the `perspective_scenario` schema (it had none) —
follows the same empty-src-placeholder convention as `ImageBlock` and `CalloutBlock`.
`scripts/livebook-sst/add_scenario_images_and_second_instance.js`:
- **Western Ghats instance** — `event_context` trimmed (the exact %/date facts now live in the
  infographic instead of the prose) + `image_prompt` added: a map of the six-state range with two
  overlaid shaded zones (Gadgil vs. Kasturirangan coverage) and a 2010→2013 timeline strip.
- **Second instance, on `glacial-landforms-and-moraines`** (deepens the Chamoli thread already
  central to Ch2, rather than a scattered new event): "Should Hydropower Construction Continue
  Here?" — grounded in three real, verified positions after the Feb 2021 Chamoli disaster: the
  Ministry of Environment, Forest and Climate Change's actual Aug 2021 Supreme Court affidavit
  (continue 7 hydropower projects), the actual position of petitioners incl. a CPI-ML leader in
  the Supreme Court case against the Tapovan-Vishnugad project (require fresh safety review), and
  Hemant Dhyani's public position as a member of the Court's own Char Dham High Power Committee
  (halt construction in the zone, citing the 2013 Kedarnath precedent). Image_prompt: the same
  valley with three branching arrows to three real positions.
- **Images also added to both `evidence_pack` callouts** (these already supported `image_src`/
  `image_prompt` via `CalloutBlockSchema`, no schema change needed): "Three Clues, One Village"
  (coin/oral-tradition/silt-layer icons) and "Three Signals Before the Flood"
  (satellite/seismic/river-gauge icons).
- **Style decision (flagged, not unilaterally resolved):** all new infographic prompts continue
  the existing "dark background, orange accent labels, clean technical illustration style" used by
  every other Ch2 diagram, for internal page consistency — same open question as the Ch1/Ch2 hero
  images (task_28b3702b) about whether to switch to the platform's current locked style; kept
  consistent with immediate neighbours rather than introducing a third look mid-chapter.
- Re-validated all 21 Ch1+Ch2 pages against the real Zod `validateBlocks` after the schema
  addition — 21/21 pass. Block counts: `landforms-and-disasters` 15, `glacial-landforms-and-moraines`
  13, `how-historians-know-the-past` 10 — all well under the 18 cap.
- **All 5 new `image_prompt` fields are still placeholders** (empty `src`) — need to go through the
  same ChatGPT-generation + `ingest.js` pipeline used for the rest of the book before they render.

**`career_spotlight` promoted from a `callout` variant to its own dedicated block type (2026-07-08,
founder feedback).** Founder flagged (with a screenshot) that the shared `NoteCallout` renderer put
all four professions in one dense paragraph — no bullets, no visual separation, the actual list of
jobs got buried. Rather than reformatting the same markdown field as a bullet list (the shared
renderer has no custom `ul`/`li` styling, so that would've fallen back to unstyled default browser
bullets), promoted it to a real structured block: new `CareerSpotlightBlock` interface + `BlockType`
entry (`types/books.ts`), new Zod schema registered in both discriminated-union arrays and removed
from the `callout` variant enum (`schemas.ts`), and a dedicated renderer
`CareerSpotlightRenderer.tsx` — each profession is its own row (bolded role + description, dot
marker, hairline dividers between rows), warm bronze/gold accent distinct from every other block
family. Fields: `title`, `intro?`, `careers[]` (`role` + `description`, 2-6 entries), `closing?`.

Also had to keep TWO independent reading-time helpers in sync (`packages/data/books/utils.ts` — the
TS copy the app uses — and `scripts/lib/book-writer.js`'s ported JS copy used by the content-loss
guard) — both updated to count `career_spotlight` words, mirroring how `callout` was already
counted, so the guard's shrink-detection stays accurate for this block type.

Migrated both existing instances (`why-social-science-matters`, `shaping-the-earths-surface-toolkit`)
via `scripts/livebook-sst/migrate_career_spotlight.js` — **reused each block's original id** (same
conceptual block, restructured, not a new one) so the content-loss guard's removed-block check never
fired. `tsc --noEmit` clean on `packages/data` and `packages/book-renderer`; all 21 Ch1+Ch2 pages
re-validated against the real Zod `validateBlocks` after the schema change — 21/21 pass.

**Real-event images moved from illustrated style to hyper-realistic photo + infographic overlay
(2026-07-08, founder feedback via screenshot).** Founder flagged the `landforms-and-disasters` hero
— page content centres on the real Feb 2021 Chamoli disaster, but the hero was a generic 4-disaster
mood illustration with no real imagery or damage-extent data. Founder confirmed scope: apply to ALL
real-event images in the book (not just this hero), explicitly ruled out "fancy AI-generated"
illustrated style for these specifically. New consistent language across all 4: a photorealistic
documentary-style shot of the *actual real place* (no people shown, to stay respectful/appropriate
for a Class 9 reader — avoids depicting anyone in distress), with a clean infographic data panel
overlaid (dates, cause, comparison %s, timeline) — the prompt never claims to literally be a news
photo of the event; each `image_caption` says "an illustrative rendering... not an actual
photograph" for reader transparency.
- `landforms-and-disasters` hero — **already generated + ingested** in the illustrated style;
  deliberately cleared (`src: ''`) via `allowContentLoss: true` + an explicit reason, since leaving
  the old mismatched image live while the prompt no longer describes it would be worse than a
  pending placeholder. New prompt: Chamoli valley/hydropower-damage scene + infographic panel
  (date, location, cause, affected).
- The 3 already-placeholder prompts (Ch2's "Three Signals Before the Flood," "Should Hydropower
  Construction Continue Here?," and the Western Ghats map) were rewritten in place — nothing to
  regenerate since none had been generated yet.
- **Explicitly NOT changed:** "Three Clues, One Village" (the historian evidence_pack) stays in the
  illustrated diagram style — it's a hypothetical teaching scenario, not a real named event, so it's
  outside this scope by design.
- `scripts/livebook-sst/rewrite_real_event_images.js`. All 21 pages re-validated — 21/21 pass.
- **Still pending:** all 4 of these prompts need to actually go through the ChatGPT-generation +
  `ingest.js` pipeline before they render — nothing has been generated in the new style yet.

**Real-photo gallery added for the 4 disaster types (2026-07-08, founder request) — first use of
REAL sourced photos instead of AI generation.** Founder: the Landslides/Avalanches/GLOFs/Dust Storms
sections had zero supporting imagery ("the text feels very boring"), and — separately — that not
every image needs ChatGPT generation; free/real image sources should be used first, ChatGPT reserved
for what can't be found that way. All 4 of these are common, well-documented phenomena with genuine
open-licensed photography available, so this was the right case to test that workflow.

Sourced from Wikimedia Commons, license verified per-image before download (not assumed):
- **Landslide** — real photo, Nagaland, India. Ganesh Mohan T, CC BY-SA 4.0.
- **Avalanche** — a real powder-snow avalanche, Himalayas near Everest. Ilan Adler, **public
  domain** (first candidate found — a snow-mass-in-a-river photo — was visually ambiguous as
  "avalanche" and rejected in favour of this one; verified by actually viewing both, not just
  reading metadata).
- **GLOF** — real before/after Sentinel-2 satellite pair (5 → 10 May 2022) showing the actual
  glacial lake at Shishpar glacier, Pakistan, physically draining. Copernicus Programme (EU) —
  attribution "Contains modified Copernicus Sentinel data 2022" required, not a Creative Commons
  license.
- **Dust storm** — real photo, a dust wall approaching BITS Pilani, Rajasthan, India. Sanyam.wikime,
  CC BY-SA 4.0.

Since the block schemas have no dedicated photo-credit field, each required attribution is folded
into that item's `caption` text (visible to readers) rather than dropped. One `gallery` block (4
items, not 4 separate `image` blocks) to stay under the page's 18-block convention — inserted right
after the fourth disaster-type text section, before `guided_reveal`. Downloaded via `curl`,
compressed with the same `cwebp -q 42` calibration as the rest of the pipeline, uploaded to R2
directly (no ChatGPT/browser automation involved this time). All 4 R2 URLs verified live (HTTP 200).
`scripts/livebook-sst/add_disaster_gallery.js`. Page now 16 blocks; all 21 re-validated — 21/21 pass.

**Batch 2 real-photo sweep across 11 pages (2026-07-08, founder request) — "what more images can be
swapped, add galleries, use historic images of India."** Full audit of every image/callout-image
across all 21 Ch1+Ch2 pages, then sourced, license-verified, and VISUALLY verified 24 real photos
(all Wikimedia Commons, licenses read off the actual file page via WebFetch, not inferred from
search snippets or filenames). Two real photos were caught and swapped out after visual review —
research reported them as clean, but looking at the actual pixels disagreed: a first "avalanche"
candidate that only showed a snow mass sitting in a river (swapped for a genuine public-domain
powder-avalanche photo near Everest), and an earthquake-damage photo whose agent-reported "no
people" claim was wrong (two people visible in frame; swapped for a verified people-free backup
image of the same 2015 Nepal earthquake). `scripts/livebook-sst/add_real_photos_batch2.js`.

**5 illustrated composite images → real-photo galleries** (same block id kept in each case — same
conceptual block, restructured, not a new one; `allowContentLoss:true` + an explicit reason each
time, since the old illustrated asset is deliberately unlinked in favour of the real photos):
- `how-historians-know-the-past` — manuscript/inscription/figurine/coin (Tirukkural palm-leaf,
  Hampi Virupaksha inscription, Harappan figurine, Mauryan Ashoka punch-marked coin)
- `weathering-breaking-rock-in-place` — physical (granite exfoliation) / chemical (dissolved
  limestone) / biological (a real root splitting rock, Biligirirangans, India)
- `wind-landforms-deserts-dunes-and-oases` — barchan (Namibia) / transverse (NASA satellite,
  Rub' al Khali) / star (Deadvlei "Big Daddy," Namibia)
- `glacial-landforms-and-moraines` — arête (Skye) / cirque+tarn (Wyoming) / **U-shaped valley —
  genuine Ladakh, India**
- `erosion-and-indias-ancient-water-wisdom` — water erosion (the real Chambal ravines, Rajasthan) /
  wind erosion (yardangs, White Sands, USA — no clean Indian yardang photo found, reported honestly
  rather than forced)

**4 single illustrated images → real photos** (same additive/content-loss pattern):
- `underground-water-caves-and-karst-landscapes` hero → the real Mawsmai Cave, Meghalaya
- `plate-boundaries-earthquakes-and-volcanoes` → the real USGS tectonic-plate map (no reason to
  illustrate a map that already exists as real public data) + a real, verified people-free 2015
  Nepal earthquake damage photo
- `rivers-waterfalls-meanders-and-deltas` hero → the real Jog Falls, Karnataka

**3 new additions** (pure historic-India authenticity, nothing removed):
- `indias-roots-in-social-thinking` — the real Ashoka Pillar remains at Sarnath
- `political-science-power-and-governance` — a real Gram Sabha meeting, Mendha Lekha, Maharashtra
  (sourced once, used only here — not duplicated onto `why-social-science-matters` to avoid
  repeating the same photo twice within one chapter)
- `economics-choices-and-resources` — a new 3-item real-photo gallery tied to the existing economic-
  history timeline: colonial-era Calcutta (Burra Bazaar, 1887-89) → Nehru inspecting Bhakra Dam
  construction (1953) → Amazon's modern Hyderabad campus. A clearly-licensed 1991-liberalization-era
  photo could not be found and was honestly reported as missing rather than forced.

All 12 page writes succeeded with 0 content-loss guard surprises. All 24 R2 URLs spot-checked live
(HTTP 200). All 21 Ch1+Ch2 pages re-validated against the real Zod `validateBlocks` — 21/21 pass.
Every image caption states its real license/photographer per Commons attribution requirements,
since no block schema has a dedicated photo-credit field.

**Founder-provided Chamoli disaster overview gallery (2026-07-08) — added right at the top of
`glacial-landforms-and-moraines`.** Founder had already generated and downloaded 3 infographic
images himself (`chamoli 1/2/3.png` in Downloads) — an overview/facts card (date, location, cause,
source), a downstream-path map (Ronti Peak → Rishiganga → Dhauliganga → Reni → Tapovan →
Joshimath), and a damage & impact card (200+ killed/missing, Tapovan Vishnugad hydropower project
damaged, 13 villages' bridge access lost, ₹1,500 crore loss) — same dark/orange-accent labeled
style already used platform-wide, all facts cross-checked against the same real Chamoli research
done earlier this session. These are the founder's own generated assets, not third-party sourced —
no external license/attribution needed. Inserted as a new 3-item `gallery` immediately after the
hero, before the `curiosity_prompt` (i.e. literally the first content a reader sees on the page).
Distinct from the 2 still-pending placeholder prompts already on this same page (the "Three
Signals" detection diagram and the hydropower-debate diagram) — those cover narrower content and
remain pending for a future ChatGPT-generation pass; this gallery was not meant to fill them.
`scripts/livebook-sst/add_chamoli_overview_gallery.js`. Page now 14 blocks; all 3 R2 URLs verified
live; all 21 pages re-validated — 21/21 pass.

**Two founder-feedback fixes, same review pass (2026-07-08) — one real bug, one photo swap, one
gallery-ordering change.**

**Bug found and fixed: `TimelineBlockRenderer.tsx` was rendering the `icon` field as raw text**
instead of an actual icon glyph — screenshots showed literal words ("ship", "trending-down",
"hammer", "trending-up") printed next to each timeline entry on `economics-choices-and-resources`'s
"India's Economic Journey" timeline. Root cause: the renderer did `{event.icon}` directly with no
name→component mapping ever implemented — a pre-existing platform bug, not something introduced
this session, affecting every timeline in the book that uses the `icon` field (11 distinct icon
names found across all Ch1+Ch2 timelines: `ship`, `trending-down`, `trending-up`, `hammer`,
`triangle`, `circle`, `square`, `mountain`, `waves`, `droplet`, `arch`). Fixed by adding a proper
`ICON_MAP` to `lucide-react` components — all 10 names map directly to real Lucide icons; `arch`
has no Lucide equivalent and was mapped to `Landmark` as the closest fit. Fixed in both the
vertical and horizontal timeline layouts. `tsc --noEmit` clean on `packages/book-renderer`. This
fix applies platform-wide (any book using `timeline` with icons), not just Social Science.

**Ashoka Pillar photo swapped for the Lion Capital of Ashoka.** Founder found the original photo
(the real, broken pillar remains still at the Sarnath site, in a protective fenced pit) confusing
without context — accurate to what the monument actually looks like today, but not recognizable.
Swapped for the Lion Capital of Ashoka at the Sarnath Museum — India's national emblem, carved for
the same pillar, far more instantly recognizable, and thematically still exactly on-topic (Mauryan
era, the same page's Kautilya/governance content). Real photo, verified CC0, Apurv013.

**Weathering gallery reordered — the original AI-illustrated composite restored as the first
image, ahead of the 3 real photos.** Founder wanted to keep showing "all three types together"
first before the real individual examples. The original illustration's R2 asset was never actually
deleted (the platform never deletes on unlink, per content-protection policy) — recovered its URL
from `book_page_versions` (v5, the last version before the gallery conversion) instead of
regenerating anything. Gallery is now 4 items: illustration (all 3 types) → physical (exfoliation)
→ chemical (dissolved limestone) → biological (root-split rock, India).

`scripts/livebook-sst/fix_ashoka_and_weathering_gallery.js`. All 21 pages re-validated — 21/21 pass.

---

## Chapter 3 — Atmosphere and Climate (source: iest103.pdf, 22pp)   [🟡 PLAN DRAFTED 2026-07-10 — awaiting founder approval before build]

Geography (physical) — maps cleanly onto the proven template. Full NCERT read done (pp.39–60).
Section flow: intro (atmosphere = gravity-held blanket; shields radiation; regulates temp; holds
weather) + margin *Gravity* · **Composition** (N₂78/O₂21/Ar0.93/CO₂0.04/others; water vapour
0.1–0.4%, dust; Fig 3.2 pie; Let's Recall nitrogen) · **Structure/Layers** (troposphere→stratosphere
[ozone,planes]→mesosphere [meteors]→thermosphere [ionosphere/radio, auroras]→exosphere; Fig 3.3;
margin *Altitude*; DMO temp-drops-only-in-tropo+meso; Aurora box; body-pressure-cancels Fig 3.5) ·
**Weather vs Climate** (hour/day vs 30-yr avg) · **Elements** (temperature+insolation+zones Fig 3.6;
humidity; precipitation; atmospheric pressure H/L Fig 3.7; wind, named-from-direction, Table 3.1
speeds, local sea/land breeze Fig 3.8; margin *Insolation*) · **Seasons** (IMD 4 seasons; traditional
6 Ṛtu Table 3.2; DMO Arthaśhāstra rainfall; ragas) · **Monsoon** (word origin *mausim*; SW summer
reversal — unequal land/sea heating → low over land → sea-to-land moist winds, advancing Fig 3.10;
NE winter, retreating Fig 3.11, SE-coast/TN rain; margins *Monsoon*, *nakṣhatras*; DMO
Kṛiṣhiparāśhara/Bṛihatsaṁhitā prediction; DMO Kālidāsa *Meghadūtam*; DMO National Monsoon Mission /
Mission Mausam) · **Climate Change** (human causes, greenhouse gases, effects; margin *Carbon
footprint*; "My Carbon Footprint" self-assessment) · **Punjab Floods 2025 case study** (rivers
Satluj/Beas/Ravi/Ghaggar; natural causes = extreme monsoon + western disturbances; human causes =
weak old *dhussi bāndh* embankments, building on floodplains, silted rivers, late warnings; effects;
Classroom Discussion = natural-vs-human, better planning, NDMA, youth role; Fig 3.12–3.13) · **Before
we move on** recap + Questions (incl. the Table 3.3 / Fig 3.14 climograph exercise, 10 stations).

**Proposed page plan (10 pages; monsoon may split to 2 → 11):**

| # | slug | sub-topic | signature interactive |
|---|---|---|---|
| 1 | the-blanket-of-air | What the atmosphere is (gravity-held, shields, regulates) + composition (the gas mix + water vapour/dust) | composition pie image |
| 2 | layers-of-the-atmosphere | The 5 layers troposphere→exosphere; temp behaviour; ozone; ionosphere/radio; auroras | **`interactive_image`** on the layer diagram (5 hotspots) — the standout |
| 3 | weather-climate-and-temperature | Weather vs climate; Temperature element (insolation, equator→poles, temperature zones) | temperature-zones diagram |
| 4 | humidity-and-precipitation | Humidity (water vapour, why muggy days feel bad) + precipitation (saturation→condensation, forms) | diagram |
| 5 | air-pressure-and-winds | Atmospheric pressure H/L; wind = air H→L; named-from-direction; wind-speed table; sea/land breeze | sea/land-breeze diagram (poss. mini-sim) |
| 6 | seasons-of-india | IMD 4 seasons + traditional 6 Ṛtu; Arthaśhāstra rainfall; ragas | `guided_reveal` (4 seasons) + Ṛtu table |
| 7 | the-monsoon | Monsoon = seasonal wind reversal; SW summer + NE winter mechanism; why it rules India's farms/economy; Mission Mausam | **monsoon `simulation`** (reversal) — *option, flag* |
| 8 | climate-change-and-carbon-footprint | Climate change causes/greenhouse gases/effects + carbon footprint + self-assessment | carbon-footprint self-assessment (interactive) |
| 9 | **punjab-floods-2025** | 2025 Punjab floods: natural + human causes, effects — **the chapter FLAGSHIP** | `you_solve_it` OR `perspective_scenario` — *flag: overlaps Ch2 Kosi; differentiate on climate/monsoon-adaptation lens* |
| 10 | atmosphere-and-climate-toolkit | Recap + mastery quiz + "read a climograph" skill (Table 3.3/Fig 3.14) + `career_spotlight` (IMD meteorologist, climatologist, NDMA officer) | climograph read |

**Open decisions flagged to founder (before build):** (a) **flagship overlap** — NCERT's built-in
case study is Punjab Floods 2025, but Ch2's flagship is already the Kosi/Bihar floods; either frame
Punjab on a distinct *climate-change/monsoon-adaptation + disaster-preparedness (NDMA)* lens, or pick
a non-flood Ch3 flagship (urban heat / carbon action) and keep Punjab as a plain case-study section;
(b) **monsoon simulation** — build a new Geography sim for the SW/NE reversal (like the river sim; real
effort) or use an animated diagram; (c) page count 10 vs split monsoon → 11. All facts (esp. Punjab
2025) to be **web-verified at build** per the workflow spec.

**✅ FOUNDER DECISIONS (2026-07-10):** (a) flagship = **Punjab Floods 2025 with a climate-change /
monsoon-adaptation + disaster-preparedness (NDMA) lens**, deliberately distinct from Ch2's Kosi
river-engineering flagship; (b) monsoon page 7 = **animated diagram / guided-reveal, NOT a new
simulation**; (c) 10-page plan approved. **Build greenlit.** Next: web-verify Punjab 2025 facts, then
build pages via a `build_ch3.js`-style inserter (mirrors `build_ch2.js`: insert into `book_pages` +
`$push` page_ids into the Ch3 chapter shell), `published: false`, validate all pages after each batch.

## Chapters 4–9 — not yet started

---

## Changelog
<!-- Newest first: `- YYYY-MM-DD — what changed` -->
- 2026-07-10 (chapter intro/opener pages for Ch1–4) — Founder: build chapter intro pages like the Class 11 Chemistry mole book. Found the template = `page_type: 'chapter_opener'` (e.g. `chapter-1-overview` in the `ncert-simplified` book), rendered by `apps/student/features/books/components/reader/ChapterOpener.tsx`. Structure: `page_number: 0` (before the lessons); `subtitle` = the "promise"/intro shown on the cover; `blocks[0]` = full-bleed hero `image`; `blocks[1]` = a `text` block whose markdown bullet list becomes the "by the end you'll be able to…" **outcomes**; the reader auto-computes the lesson **journey** list + Start CTA from the chapter's other pages. Built openers for all 4 built chapters (`build_ss_chapter_openers.js`, 4/4 valid, `published:false`, linked first in `page_ids`): `understanding-social-science-opener`, `shaping-the-earths-surface-opener`, `atmosphere-and-climate-opener`, `early-humans-and-civilisation-opener` — each with an authored curiosity-promise subtitle (mole-style voice), a 21:9 hero generation-prompt (placeholder src — founder adds images later), and 4 concrete learning outcomes. Idempotent + content-safe. SS book now: Ch1–4 built with lesson pages + openers; images still pending.
- 2026-07-10 (Ch3+Ch4 quality audit + fixes — coverage, quizzes, scenarios) — Founder asked for a deep check of Ch3/Ch4 vs NCERT + quiz quality + scenarios (ignore images). Built reusable audit scripts (`_audit_ch34.js` quiz length-tell/position + scenario structure; `_coverage_check.js` NCERT-term presence). **Findings + fixes:** (1) **Quiz length-tell was systematic** — the correct option was the longest in 19/31 Ch3 and 29/34 Ch4 questions (ratios up to 2.7×; a "pick the longest" strategy scored ~74%), and option D was under-used (~10%). Rebalanced EVERY quiz (`fix_ch3_quiz_balance.js` + `fix_ch4_quiz_balance.js` + a 2-question trim): all options now within a tight length band, correct answer never the giveaway, and correct_index spread evened to ~26/26/23/23 (A/B/C/D). **Result: 0 length-tells in both chapters.** (2) **Coverage gaps** — most flagged items were false alarms (diacritics: Arthaśhāstra/nakṣhatras/Kālidāsa/Meghadūtam; the wind-speed table; "thirty years"). Genuine gaps filled additively (`fix_ch34_coverage_gaps.js`): Ch3 air-pressure counter-pressure; Ch4 Brahmi/Ashoka script (p1), the "Old World" term (p2), the four Mesopotamian civilisations (Sumerian/Akkadian/Assyrian/Babylonian) + Epic of Gilgamesh + Zhou "mandate of heaven" in the world-civilisations comparison_card, and a new social-hierarchy + Cleopatra text block (p9). No whole section was ever missing — core content was complete; these are secondary details. (3) **Scenarios** — the Ch3 `you_solve_it` (Punjab, 4 solutions w/ upside+catch, source, reality-check) and Ch4 `perspective_scenario` (Harappan decline, 4 web-verified positions, synthesis, source) are structurally sound and fact-verified; no changes needed. All 21 Ch3+Ch4 pages re-validate (10/10, 11/11). Images still pending (founder handling separately).
- 2026-07-10 (Ch4 COMPLETE — 11/11 pages; first History chapter done) — Read the rest of `iest104.pdf` (pp.73–94) and built the final 5 pages (`build_ch4.js`, 11/11 valid): `the-first-indian-villages` (Mehrgarh ~7000 BCE, Chalcolithic copper, Kalibangan double-crop ploughed field), `the-sindhu-sarasvati-civilisation` (Early→Mature→Late Harappan **timeline**, planned cities, seals/undeciphered script, standard binary weights, Dholavira/Lothal water engineering), `cities-along-the-great-rivers` (Mesopotamia/Egypt/China via a 3-column **`comparison_card`** — cuneiform/ziggurats/Hammurabi, Nile/pyramids/hieroglyphics/Rosetta, dynasties/oracle-bones/Great-Wall/silk — + "why rivers"), `when-worlds-connected-and-faded` (Meluhha–Dilmun–Magan trade + Silk Route, then the **`perspective_scenario` FLAGSHIP** "Why Did the Harappan Cities Fade Away?" — 4 web-verified scholarly positions: weakening monsoon / drying Ghaggar-Sarasvatī / trade collapse / gradual de-urbanisation [Upinder Singh], invasion theory noted as discredited; synthesis = combination + slow fade, callback to the undeciphered script from p1), `early-humans-toolkit` (recap `guided_reveal` + `career_spotlight`: archaeologist/historian/epigraphist/curator + mastery quiz). History adaptations fully exercised: timelines, comparison_cards, perspective_scenario flagship, evidence-first framing, cause/effect reasoning, narrative voice, zero physical sims. Added `careerSpotlight`/`perspectiveScenario` helpers to build_ch4. **Ch4 DONE (11 pages), all `published:false`.** SS book now: Ch1 (9p, fixed), Ch2 (12p, rewritten), Ch3 (10p), Ch4 (11p) built; Ch5–9 not started. All images across Ch3/Ch4 are still `src:''` placeholders (generation-prompt ready) — need the ChatGPT-image pipeline before render. Founder to review.
- 2026-07-10 (Ch4 batch 2, pages 4–6 + live preview verification) — Built Ch4 **pages 4–6** from already-read source (`build_ch4.js`, 6/6 valid): `the-first-hunters` (Palaeolithic India — Attirampakkam/Isampur, tools, first art/beads), `the-mesolithic-and-the-first-art` (12kya warming → population explosion, microliths, Bhimbetka rock art), `the-neolithic-revolution` (domestication, first villages, a **`timeline`** of where farming began — West Asia/India/China — + the "biggest trade-off in history" reflection). Ch4 now **6/~13 pages**. **Live preview verification** (founder asked): stood up a throwaway dev route (`apps/student/app/sstpreview/[pageSlug]`, since the student reader hard-gates `published:true`) rendering pages through the real `PageRenderer`; **confirmed the `you_solve_it` flagship renders and is fully interactive** (pick a solution → options hide, "✓ Your call" badge, "Where the Debate Actually Stands" reveals, "Rethink" resets; reality-check correctly hidden pre-pick) and the **History `timeline` renders** (all 4 Homo events). Content verified present + connected via DOM/SSR. NOTE: preview `screenshot` returned blank frames and the throwaway route's `@canvas/book-renderer` barrel import hit an intermittent Next-dev webpack chunk race (`undefined.call` 500) — both are **dev-tooling/throwaway-route issues, NOT book content** (pages render correctly when the chunk loads; switched to the direct `@canvas/book-renderer/PageRenderer` import to reduce it). Throwaway route removed + server stopped after. **For final visual sign-off, the founder's own admin editor (localhost:3001) renders reliably.** PENDING Ch4: read pp.73–94, build civilisations pages (Sindhu–Sarasvatī + world), the `perspective_scenario` flagship, toolkit.
- 2026-07-10 (Ch4 build started — batch 1, pages 1–3; History adaptations proven) — Founder: build Ch3 + Ch4, review at end. After finishing Ch3, started **Chapter 4 "Early Humans & Beginning of Civilisation" (History, 34pp)** — the FIRST History chapter, testing the spec's §6 History adaptations. Read the source in thirds (built from pp.61–72 so far; pp.73–94 still to read). `build_ch4.js` created (mirrors build_ch3 + adds `timeline`/`comparisonCard` helpers), inserted **pages 1–3** (`published:false`, 3/3 valid against real Zod): `a-history-with-no-books` (how we know the pre-writing past — archaeology/experimental archaeology/fossils; the before/after-writing divide via a **`comparison_card`**; ties back to Ch1's source types; india_science on the undeciphered Sindhu script) · `the-human-family-tree` (biological vs cultural evolution; a **vertical `timeline`** habilis→erectus→neanderthalensis→sapiens; out-of-Africa migration + map) · `the-stone-age` (dividing history by technology; a **horizontal `timeline`** of the ages Palaeolithic→Iron; the Neolithic Revolution set up). **History adaptations confirmed working:** timelines + comparison_card + evidence framing + narrative voice all validate; no physical sims used; flagship will be a `perspective_scenario` on later content (Harappan decline / civilisational interaction) once pp.73–94 are read. **PENDING Ch4 (next batches):** read pp.73–94, then build Palaeolithic/Mesolithic/Neolithic pages, the Sindhu–Sarasvatī + world civilisations pages, the `perspective_scenario` flagship, and the toolkit. Ch4 ≈ 3/~13 pages done.
- 2026-07-10 (Ch3 COMPLETE — 10/10 pages; publish bug fixed; Ajanta/Ellora) — Founder: "build the entire chapter 3 and also chapter 4, I'll review at the end." **Chapter 3 finished** via `build_ch3.js` (all 10 pages, `published:false`, 10/10 valid against real Zod): the-blanket-of-air · layers-of-the-atmosphere · weather-climate-and-temperature · humidity-and-precipitation · air-pressure-and-winds (incl. wind-speed `table` + sea/land-breeze) · seasons-of-india (IMD 4 + 6 Ṛtu `table` + Arthaśhāstra/rāgas) · the-monsoon (SW/NE reversal = sea-breeze-scaled-up callback; nakṣhatra/Kālidāsa/Mission Mausam) · climate-change-and-carbon-footprint (greenhouse "thicker blanket" callback to p1; carbon-footprint self-audit) · **punjab-floods-2025 flagship `you_solve_it`** (climate-adaptation lens per founder decision — WebSearch-verified Aug-2025 facts: ~1,400 villages, 350k+ affected, 148k+ ha, 30+ lives, weak Dhussi Bandhs + floodplain encroachment + 24% surplus monsoon/western disturbances + Bhakra/Pong/Ranjit Sagar releases; 4 debated solutions; source cited) · atmosphere-and-climate-toolkit (recap + climograph skill + `career_spotlight`). All re-taught per golden rule with running callbacks between pages. Added `table`/`heroReal`/`youSolveIt`/`careerSpotlight` helpers to build_ch3. **Also fixed a real publish bug** (founder hit "Failed to toggle chapter publish state"): the book's `subject` was stored `social-science` (hyphen) but the Book schema enum wants `social_science` (underscore) → `book.save()` on publish failed validation. Corrected the data (`_fix_book_subject_enum.js`, only this book of 10 affected), fixed the setup-script typo, verified the book now satisfies every Book-schema constraint. **Also (founder requests):** added an Ajanta/Ellora `india_science` callout to Ch2 karst page framed as human-carved-vs-water-dissolved contrast (web-verified), then moved the founder's Ajanta/Ellora photos out of the top natural-cave gallery into a new gallery beside that callout (no asset lost). **NEXT: Chapter 4 (Early Humans & Beginning of Civilisation, History, 34pp)** — first History stress-test of the spec's History adaptations (timelines, evidence framing, `perspective_scenario` flagship not `you_solve_it`, no physical sims).
- 2026-07-10 (Ch3 build kickoff — batch 1, pages 1–2) — **Spec finalised + Ch3 build started.** Wrote the canonical [`_agents/workflows/SOCIAL_SCIENCE_BOOK_WORKFLOW.md`](../workflows/SOCIAL_SCIENCE_BOOK_WORKFLOW.md) (golden rule "re-teach not reword", page skeleton, mechanic palette + when-to-use, one-flagship-per-chapter, quiz rule, **History-vs-Geography adaptations**, image style, safety) — founder signed off. Read all of `iest103.pdf` (Ch3, 22pp), drafted the 10-page plan, founder approved + locked decisions (Punjab-floods flagship on a climate-adaptation lens; monsoon = animated diagram not a new sim). Built **`scripts/livebook-sst/build_ch3.js`** (mirrors `build_ch2.js`) and inserted **pages 1–2**: `the-blanket-of-air` (10 blocks — what the atmosphere is + composition, `guided_reveal` on the gas mix) and `layers-of-the-atmosphere` (9 blocks — the 5 layers, `guided_reveal` + aurora/temperature-pattern callouts). Both re-taught per the golden rule (Moon-vs-Earth hook, "blanket/sunscreen" framing, climb-through-the-layers reveal); `published:false`; validated ✅ 2/2 against the real Zod `validateBlocks` (`scripts/livebook-sst/_validate_ch3.ts`). **Two build-pattern lessons for the remaining batches (important):** (1) set the Mongo client `{ ignoreUndefined: true }` — otherwise optional undefined fields (e.g. `guided_reveal.outro`) serialize to **null** and fail Zod (`optional()` rejects null); (2) valid `aspect_ratio` enum is only `16:9|16:5|4:3|3:2|1:1|21:9` — **no portrait ratios** (used `4:3` for the tall layers diagram). Also gave build_ch3 **stable top-level block ids** (`${slug}__bN`) so re-running doesn't churn ids / trip the content-loss guard. (First insert had those 2 bugs; the 2 asset-free just-created drafts were removed + re-inserted clean — guard-checked 0 assets, `published:false`, agent-authored, not founder content.) **PENDING: Ch3 pages 3–10** (append to `build_ch3.js` PAGES; page 9 Punjab-floods flagship needs web-verified 2025 facts before authoring), then generate images + founder review. Ch3 batch 1 done.
- 2026-07-10 (You Solve It editor + Kosi infographic) — **Root-caused why the founder couldn't see/edit the You-Solve-It (and perspective_scenario / career_spotlight) blocks in the admin editor:** `BlockCard.tsx`'s `renderEditor()` switch has `default: return null`, so any block type without an explicit case draws NO edit form — just the collapsed "(type)" header. All the newer Social Science engagement blocks were script-authored only and had no editor component. **Fix:** built `apps/admin/features/admin/books-editor/blocks/YouSolveItEditor.tsx` (title, problem, why_hard, infographic upload via `onUpload`, image caption/prompt, source_note, the solutions array with add/remove [min2/max4] + label/upside/tradeoff, prompt, reality_check) and wired it into BlockCard (import + `case 'you_solve_it'` + summary case). Also **completed the pre-existing incomplete `BLOCK_LABELS`/`BLOCK_ICONS` `Record<BlockType,string>` maps** — they were missing 9 blocks (guided_practice, reflection_journal, habit_tracker, focus_game, attention_xray, self_experiment, guided_reveal, perspective_scenario, career_spotlight), a real pre-existing TS2740 error; now every block shows a proper name/icon in the editor instead of a bare "(type)" row. `tsc -p apps/admin` clean on the touched files (the TS2740 is gone). **Note:** perspective_scenario & career_spotlight now show proper labels/icons but still have no edit FORM (still script-authored) — offer to build those editors if the founder wants in-UI editing. **Also attached the founder's downloaded Kosi infographic** ("kosi river floods in Bihar.png") to the Kosi you_solve_it block: `add_kosi_infographic.js` (cwebp -q42 → 3.02MB→0.16MB → R2 → image_src set; URL HTTP 200 verified; rivers page v49).
- 2026-07-10 (NCERT quality audit → concept-rewrite pass + new `you_solve_it` block) — **Founder flagged that Ch2 body text "literally just copied NCERT" and missed sections "like Sundarbans."** Read all of `iest102.pdf` (Ch2, pp.13–38) and diffed it against the live manuscript. Verdict: correct — the value-add blocks (curiosity/reasoning prompts, Taj/BIS/Chamoli callouts, guided_reveals, scenarios) are genuinely original, but the core "what is X" **`text` blocks are lightly-reworded NCERT** (meander/weathering/delta/karst are near-verbatim), plus real omissions: **Sundarbans** taught as one line (NCERT invites depth via a Let's-Explore box); **inner vs outer core** collapsed into "innermost layer, extremely hot and heavy"; **volcanic deposition** (Fig 2.6) absent; layer depths + heat-transport nuance dropped. **(1) EXEMPLAR rewrite** of the deltas page (`rivers-waterfalls-meanders-and-deltas`, v36): rewrote the river-course/waterfall/meander/delta paragraphs into richer teacher-English that explains *mechanism + why* (river energy vs slope; fast-outer/slow-inner bank; why a river dumps its load at the sea) and added a real **Sundarbans teaching block** (`india_science` callout: world's largest mangrove delta, tidal, mangrove roots as a cyclone wall, swimming Royal Bengal tiger, UNESCO) replacing the one-line echo. All images/galleries/video preserved (guard-checked 3/2/1). Founder approved the voice → rollout across Ch2's remaining pages + Ch1 is the pending content track (use exemplar voice as the standard). **(2) NEW block type `you_solve_it`** (founder design — "add deep-thought/problem-solving on real Indian issues, e.g. Bihar floods; student reasons to the correct solution"). Distinct from `perspective_scenario` (which never asks for a solution): this drops the student into a real *unsolved* problem, lays out the actual debated fixes each with a real upside+catch (all visible — weighing them is the exercise), and asks them to commit + name their own pick's weakness, then unlocks a reality-check reveal (grounded, explicitly not "the answer"). Full build mirrored on `perspective_scenario`: interface + `BlockType` (`types/books.ts`), Zod schema in both discriminated unions (`schemas.ts`), renderer `YouSolveItRenderer.tsx` (amber accent, distinct from indigo perspective) registered in `BlockRenderer.tsx`, and both reading-time helpers (`utils.ts` + `book-writer.js`) updated to count it so the content-loss guard stays accurate. `tsc --noEmit` clean on `packages/book-renderer` (0 errors); the lone `packages/data` error is the pre-existing unrelated `models/Tenant.ts` `_id` string/ObjectId issue. **Dosage decision: one flagship `you_solve_it` per chapter.** **(3) Ch2 flagship authored:** the **Kosi / "Sorrow of Bihar" floods** on the rivers page (v37, 19 blocks) — 4 real debated solutions (Saptakosi/Barahkshetra high dam / raise embankments / room-for-river desilting / forecast+evacuate), every fact WebSearch-verified before writing (21,000 km² flooded annually; Aug 2008 Kusaha breach displaced 3M+; ~3,800 km embankments over 70 yrs during which flood-prone area *grew*; Dinesh Kumar Mishra / Barh Mukti Abhiyan + Ganga Flood Control Commission channel-restoration proposal) with a visible `source_note`. Placeholder `image_prompt` (raised-riverbed cross-section) pending the image pipeline. 21/21 pages re-validate against the real Zod `validateBlocks` (which exercises the new schema). **(4) Ch2 concept-rewrite COMPLETED same turn** — batch 1 (`rewrite_ch2_batch1_process.js`: plate-tectonics [+inner/outer core fix], plate-boundaries [+volcanic deposition / Deccan Traps], weathering, erosion, agents-of-gradation) + batch 2 (`rewrite_ch2_batch2_landforms.js`: coastal [+cliff→stack sequence restored in prose, backfilling the removed sea-stack timeline], glacial, wind, karst, the 4 disaster paragraphs, toolkit recap). All 12 Ch2 pages now re-taught in mechanism-explaining teacher English (onion/honey/fingernails/soup-pot/sandpaper analogies); touched ONLY `text` blocks; every image/gallery/video preserved (guard-checked per page). **(5) Ch1 flagship `you_solve_it` added** — Delhi winter air / stubble burning on `four-disciplines-one-society` (v4), chosen as a four-discipline knot (geography+economics+politics+society) that reinforces that page's thesis; web-verified (Happy Seeder, Pusa Bio-Decomposer, MSP-paddy diversification, CAQM, ~3-week harvest window, NASA farm-fire decline), source cited. Ch1 prose was left as-is: it's the discursive orientation chapter, already original teacher-voice, not NCERT-tracking (offered founder a diff-check vs iest101 if desired). 21/21 valid throughout. **PENDING (next):** generate the 2 new infographics (Kosi raised-riverbed cross-section + Delhi four-discipline map) via the image pipeline; **Phase 2 = write the finalized Social Science structure & style spec** (canonical doc: page skeleton, block/mechanic palette + when-to-use, the genuine-re-teaching voice rule, one-flagship-per-chapter, image style, History-vs-Geography adaptations) for founder sign-off; **Phase 3 = build Ch3 (Atmosphere & Climate) → Ch4 (Early Humans) → Ch5 (State & Society)**, each with a page-plan gate first. Real-Indian-issue map for future chapters sketched (Bengaluru water, coastal erosion, electoral & economic debates).
- 2026-07-09 (river sim verified + sea-stack timeline removed) — **Visually verified the refined river simulator (founder granted explicit preview permission).** Temporarily repurposed the throwaway `apps/student/app/simtest/page.tsx` to render `<BlockRenderer>` with a `river-journey` simulation block, started the student dev server via the preview tool (autoPort → 59627, no clash with the founder's own server), screenshotted `/simtest`, then restored the page + stopped the server. **The refined version renders well:** layered hazy mountains + snow cap, a glowing blue water ribbon that widens downstream, the waterfall with its label + mist, the oxbow-lake loop, the delta fanning into a filled sea, sun glow, green floodplain, stage markers, and the droplet at the source — a clear step up from the flat-shapes v1. **Also removed the "How a Headland Becomes a Sea Stack" horizontal timeline on page 7** (`coastal-landforms-beaches-cliffs-and-stacks`) at founder request ("remove this section, its better to add a video or infographic here") — `scripts/livebook-sst/remove_seastack_timeline.js`, `allowContentLoss` + reason (the cliff→cave→arch→stack sequence stays fully described in the page text; only the visual timeline removed). **Confirmed book-wide there are now only 2 timelines left: the vertical "India's Economic Journey" (Ch.1 economics) and nothing else horizontal** — the founder's "another such section" almost certainly refers to the river "A River's Journey" timeline, which is ALREADY gone (replaced by the river-journey simulator). Flagged this back to the founder. 21/21 pages re-validated.
- 2026-07-09 (river sim v2 — visual refinement) — Founder reviewed the river-journey simulator live in-editor (videos/CSP fix confirmed working) and asked to lift it from "basic geometric shapes" to something more refined. Rebuilt only the SVG scene (all interaction logic unchanged): layered atmospheric landscape (hazy far mountain range + near mountain with snow cap + green floodplain, via SVG gradients + `feGaussianBlur` for depth/haze — native filters, not a library), a proper water ribbon (soft outer glow + gradient body + specular sheen + animated flow shimmer, replacing the bare dashed line) that visibly widens toward the sea via a lower-course underlay, a real waterfall cascade with animated fall + spray mist, pronounced meander loops with a cut-off oxbow lake, a delta fanning into a filled sea with a horizon and animated waves, a sky gradient + warm sun glow, and per-stage feature annotations (waterfall/oxbow/delta) that fade in only for the active stage. Slowed the drop journey 9s→11s. `tsc --noEmit` clean. Still built without a live visual preview (§5.2) — founder to review the refined version and flag further tuning.
- 2026-07-09 (river sim) — **First interactive SIMULATOR in this book (and the first for a non-science subject on the platform): "A River's Journey".** Founder found the static 3-dot "A River's Journey" horizontal timeline boring and asked for something interactive/dynamic with motion graphics. Built a new self-contained simulator `RiverJourneySim.tsx` (`simulation_id: 'river-journey'`), registered in `packages/book-renderer/blocks/SimulationBlockRenderer.tsx`, following the mandatory `SIMULATION_DESIGN_WORKFLOW.md` (dark `#0d1117` root, indigo/amber/emerald palette, CSS `@keyframes` + `requestAnimationFrame` only — no animation libraries). It's an animated side-on landscape: water flows continuously downstream (animated `stroke-dashoffset` shimmer), a mountain source feeds a river that drops over a waterfall, meanders through the middle course (with an oxbow lake), and fans into a delta at the sea. A **"Follow a drop"** button sends a glowing droplet along the actual river path (via `getPointAtLength` on the SVG spine, driven by rAF), and as it passes each stage the zone lights up and an info panel updates — gradient, water speed, dominant process (erosion → transport → deposition), and the landforms built there. Three underline tabs (Upper/Middle/Lower) let the reader jump to any stage. **Anti-hallucination gate honoured:** every fact is taken verbatim from this page's own NCERT-sourced "A River's Journey" text (steep/erosion/V-valleys+waterfalls+rapids → meander/oxbow+floodplain → delta/levee/alluvial-fan), cited in a code comment. Replaced the timeline in place (same page position, right after the intro naming the three courses) via `scripts/livebook-sst/replace_river_timeline_with_sim.js` (`allowContentLoss` + reason — same facts, now interactive; no information lost). Self-contained, so it renders in BOTH the student reader and the admin editor preview. `tsc --noEmit` clean on `packages/book-renderer`; 21/21 pages re-validated (corrected validator). **⚠ Built without a visual preview** (preview server is off-limits per CLAUDE.md §5.2) — geometry is carefully proportioned but the exact river curve / delta / oxbow / waterfall placement may want visual nudging once the founder sees it live. Flagged as a first version to review + iterate. **This proves the platform's simulation system works for geography/humanities, not just science — a reusable pattern for future Social Science interactives.**
- 2026-07-09 (video hook) — **First real video content in this book: a Yellowstone-supervolcano curiosity hook opens `plate-tectonics-earths-moving-crust`, plus 3 more videos across pages 1 and 2, using the platform's existing `video` block (`youtube_nocookie` provider — stores only an 11-char video ID, no download/R2 storage, streams from YouTube's own servers).** Founder asked whether video (vs. static images) would better convey moving natural phenomena like glaciers, and specifically wanted Yellowstone's supervolcano + colourful geysers to open the chapter as an exciting hook. Researched the copyright question first: embedding via YouTube's own iframe player (what this platform already does) is legally distinct from downloading/rehosting — covered by YouTube's own Terms of Service sublicense (case law: *Richardson v. Townsquare Media*) — so long as the source isn't obviously-infringing content. Flagged one real problem in the founder's picks: the Yellowstone video ("YELLOWSTONE: Il Giorno in cui l'America Potrebbe Spezzarsi") is Italian-narrated — confirmed via cross-posts to Italian TikTok/news sites — unsuitable as the sole source for an English-medium book. Founder's call: keep it as the visual hook anyway, and add an English-language National Geographic documentary as a "watch deeper" recommendation instead of a replacement.

  **`plate-tectonics-earths-moving-crust`** (page 1, now 17 blocks): rewrote the opening `curiosity_prompt` around Yellowstone — its hot springs/geysers, the supervolcano beneath it, and *why it's in that specific spot* (a hotspot: a stationary ~600km-deep mantle plume, with the North American plate having drifted over it for millions of years, leaving a trail of extinct volcanoes from Nevada to Yellowstone) — every fact WebSearch-verified before writing, per this project's anti-hallucination discipline. This directly sets up the chapter's real subject (plates move) rather than just being a fun aside. Added 3 video blocks: the founder's Yellowstone video right after the curiosity_prompt (the hook payoff); an Esri "Animated Maps: Tectonic Plate Movement" animation (English, 550M years of real plate movement, explicitly shows India colliding with Asia to form the Himalaya — verified 88 seconds long) right after the convection-currents section, positioned directly before the existing Himalaya-formation callout it echoes; and the National Geographic "Did You Know There Was A Volcano Under Yellowstone?" documentary (X-Ray Earth, verified 44 min) as an optional "watch deeper" recommendation just before the closing quiz.

  **`plate-boundaries-earthquakes-and-volcanoes`** (page 2, now 16 blocks): added real 2021 Fagradalsfjalli eruption drone footage from Iceland (4K, flying through active lava) right after the tectonic-plate map — tied specifically to the page's existing Mid-Atlantic Ridge / divergent-boundary content, since Iceland is one of the only places that exact boundary type sits above sea level.

  `scripts/livebook-sst/add_ch2_videos.js`. All `order` fields reassigned sequentially across the full block array on every insert (the exact bug from earlier tonight — not repeating it). 21/21 pages re-validated with the corrected validator.
- 2026-07-09 (content quality) — **Full manuscript read of both chapters (all 21 pages, every text/callout/guided_reveal/curiosity_prompt) to check simple-English scaffolding, prompted by a founder question: "have we explained glaciers anywhere before page 8?"** Built a dump script (`scripts/livebook-sst/_dump_manuscript.js`) and read the whole thing end to end. **Confirmed the founder's specific concern as real:** "glacier" is used 3 times across Ch.2 (erosion page's "glacial erosion (moving ice)", the agents-of-gradation overview's "glaciers scrape and carve U-shaped valleys", and `glacial-landforms-and-moraines`'s opening) without ever once defining what a glacier actually is — describing only what it *does*, never what it *is*. This matters more than for river/wind/wave, since most Indian Class 9 students have seen a river or the sea but never a glacier. Checked the rest of both chapters against the same bar (does a new technical term get a plain-English definition at/near first use?) and found this was genuinely isolated — every other core term (crust/mantle/core, the three weathering types, dharma/artha/rajadharma, the four historical evidence types) already gets a concrete definition close to first use, mostly via `guided_reveal` cards or in-line em-dash asides. **Fixed:** added a real definition ("a giant, slow-moving river of ice... forms where snow piles up faster than it melts, year after year, in very cold or very high places like the Himalaya") in two places — the agents-of-gradation overview (both its main text and its `guided_reveal` card for "Glaciers") and a new opening sentence on `glacial-landforms-and-moraines` before it dives into glacial erosion. `scripts/livebook-sst/fix_glacier_definition_gap.js`. 21/21 pages re-validated. No other comparable gap found — everything else in the manuscript read as solid, concrete, well-scaffolded Class 9 English.
- 2026-07-09 (image round complete) — **Last 2 of the 4 originally-pending AI images generated and ingested — image backlog for Ch.1+Ch.2 is now zero.** Generated via the standard ChatGPT pipeline (Claude-in-Chrome driving the browser, prompts pasted verbatim from `scripts/livebook-images/_queue.json`), with the founder taking over the actual downloads partway through after browser automation hit friction (consistent with the earlier-noted pattern of Chrome sometimes blocking/complicating repeated download-button clicks). Both images visually verified against their prompts before ingesting: "Three Clues, One Village" (`how-historians-know-the-past`, Ch.1) — copper coin / oral-tradition speech-bubble / silt-layer soil cross-section, connected by orange lines; "Three Signals Before the Flood" (`glacial-landforms-and-moraines`, Ch.2) — a Himalayan river-valley monitoring station at dusk (seismograph, satellite dish, river gauge) with a 4-icon labeled sequence overlay (Satellite images → Seismic sensors → River gauge data → Flood-warning). `scripts/livebook-sst/ingest_final_two_images.js`. Both R2 URLs verified live, 21/21 pages re-validated.
- 2026-07-09 (even later) — **Both page 6 and page 8 heroes swapped again, per explicit founder direction (clarified via AskUserQuestion since the requests were ambiguous on their own).** Page 6 (`rivers-waterfalls-meanders-and-deltas`): founder renamed a file "Hero, page 6.jpg" in Downloads and said to use it directly — a sunset plunge waterfall — replacing the real-photo Jog Falls, Karnataka hero set earlier this session. Page 8 (`glacial-landforms-and-moraines`): founder confirmed via AskUserQuestion to use Pangong Lake as the hero instead of the just-set Kashmir glacier photo, and to keep Kashmir glacier in the gallery unchanged — Pangong Lake's own gallery item was removed as now-redundant with the hero (reused the same already-uploaded R2 asset for the hero, no re-upload). Gallery is now 5 items (diagram, Kashmir, France, Zanskar, Iceland). `scripts/livebook-sst/swap_page6_page8_heroes.js`, `allowContentLoss:true` + explicit reason each (old heroes unlinked, not deleted from R2). Also confirmed for the founder: every image uploaded this session (all scripts) used `cwebp -q 42`, no exceptions — verified via grep across every upload script. All new/reused URLs verified live, 21/21 pages re-validated.
- 2026-07-09 (later) — **Pages 6 and 8 (Ch.2) image round: 2 pending scenario slots filled, a new delta gallery, and page 8's hero + gallery rebuilt with founder-provided real photos.** Founder downloaded 11 new images overnight, split across two clear matches and a genuine design decision (resolved via AskUserQuestion):
  - **Clear matches, executed immediately:** "Should Hydropower Construction Continue Here?.png" → the pending `perspective_scenario` image on `glacial-landforms-and-moraines` (real Himalayan hydropower dam + 3-branch decision diagram) — 3rd of 4 pending image slots now filled, 2 remain (both `evidence_pack` illustrations). Two real aerial delta photos (a dendritic Iceland delta, a braided-channel aerial) → a new 2-item gallery on `rivers-waterfalls-meanders-and-deltas`, inserted right after the "Deltas" heading (block[10]), which previously had no image at all. `scripts/livebook-sst/add_delta_gallery_and_hydropower_image.js`.
  - **Page 8 hero + gallery rebuild (design decision, confirmed via AskUserQuestion):** founder also downloaded a new labeled "Glacial Landforms & Moraines" diagram (2-panel: cirque/arête/horn/U-valley/hanging valley + the 4 moraine types) and 5 real mountain/glacier photos (Kashmir glacier, French Alps, Zanskar frozen lake, Pangong Lake, an Iceland-style glacier scene). Founder's combined answer: prepend the diagram to the gallery, swap the hero from its AI illustration to a real photo, and **replace** (not append to) the existing 3-photo gallery (Skye arête/Wyoming cirque/Ladakh U-valley — founder: "not great") with the new diagram + all 5 real photos. Hero → the Kashmir glacier photo (most literally on-topic — an actual visible glacier — and Indian, closest match to the original hero's "dusk, cold-toned" mood). Gallery → 6 items: diagram, Kashmir, French Alps, Zanskar, Pangong Lake, Iceland glacier. `scripts/livebook-sst/rebuild_glacial_hero_and_gallery.js`, `allowContentLoss:true` + explicit reason (old hero + old 3 gallery photos unlinked, not deleted from R2). Also caught and fixed a stray `aspect_ratio: 16:9` left on this gallery from before the natural-sizing fix (missed by the earlier sweep) — stripped it directly. All new R2 URLs verified live. 21/21 pages re-validated.
- 2026-07-09 — **IMPORTANT: found and fixed a broken validator that had been silently reporting "21/21 valid" all session regardless of actual validity, then fixed the 15 real schema violations it had been hiding.** Founder hit a real error in the admin editor: "Invalid block payload: 9.order: Invalid input" when changing the meander gallery's aspect ratio on `rivers-waterfalls-meanders-and-deltas`. Investigating traced to `scripts/livebook-sst/_validate_all21.ts`: `validateBlocks()` returns `{ok: false, ...}` on failure rather than throwing, but the script's `try/catch` only caught thrown exceptions — so every "21/21 valid, 0 failed" claim printed this entire session (many changelog entries above say this) was never actually checking anything. Fixed the validator to check `result.ok` properly, then ran it for real: **15 of 21 pages actually failed schema validation**, across 4 distinct issue classes:
  1. **`order` missing on 3 galleries** (`underground-water-caves-and-karst-landscapes`[0], `landforms-and-disasters`[0], `rivers-waterfalls-meanders-and-deltas`[9]) — MY fault, from tonight's 3 gallery-rebuild scripts (cave gallery, Chamoli gallery, meander gallery), which built new block objects as `{id, type, items}` without preserving/setting the required `order` field. This is the exact bug the founder hit.
  2. **`id` missing on 3 blocks** (the economic-history gallery on `economics-choices-and-resources`, the Lion Capital of Ashoka image on `indias-roots-in-social-thinking`, the Gram Sabha photo on `political-science-power-and-governance`) — also MY fault, traced to the earlier batch-2 real-photo sweep script, which built these 3 new block objects without a top-level `id`.
  3. **`hint`/`reveal` set to `null` on the `curiosity_prompt` block (always block[1]) on 12 pages** — PRE-EXISTING, traces to the original `build_ch1.js`/`build_ch2.js` scripts (2026-07-04/05), predates this session entirely. Confirmed zero visual impact before fixing: the renderer already treats `null` and `undefined` identically (`{block.hint && ...}`), so removing the fields is pure data hygiene.
  4. **`learn_more: ""` on the Kautilya `meet_a_scientist` block** on `indias-roots-in-social-thinking` — PRE-EXISTING, same original-build origin. Unlike `hint`/`reveal`, this field is REQUIRED (`z.string().min(1)`), so it needed real content, not just unsetting. Filled with a WebSearch-verified fact matching the field's established "real, still-existing institution" pattern used elsewhere in the platform: R. Shamasastry rediscovered the Arthashastra manuscript in 1905 at the Oriental Research Institute, Mysore (then the Mysore Oriental Library), which still preserves the original palm-leaf manuscript today.

  All fixed via `scripts/livebook-sst/fix_schema_validation_issues.js` (19 `book-writer.savePage` calls, additive/repair only — no content removed). Re-ran the corrected validator: **genuinely 21/21 valid now** (confirmed twice, once via pass/fail count and once via a full per-issue dump that printed zero remaining issues). **Lesson for future sessions: never trust a validator script without first confirming it actually fails on a known-bad input** — this one looked correct (imported the real Zod schema, called the real function) but had a silent return-vs-throw mismatch that made every check a no-op for the length of an entire session.
- 2026-07-08 (latest+3) — **Western Ghats scenario image ingested — 1 of the 4 pending AI-image slots now filled.** Founder had generated `western ghat.png` (Downloads) matching the pending `image_prompt` on the "How Much of the Western Ghats Should Be Protected?" `perspective_scenario` block exactly: aerial Western Ghats photo + Gadgil (2011, orange) vs. Kasturirangan (2013, ~37%, green) zone map + 2010→2013 timeline strip. `scripts/livebook-sst/add_western_ghats_image.js`. URL verified live, 21/21 pages re-validated. **3 pending image slots remain:** "Three Clues, One Village" and "Three Signals Before the Flood" (`evidence_pack` callout images), and "Should Hydropower Construction Continue Here?" (the second `perspective_scenario` instance, on `glacial-landforms-and-moraines`).
- 2026-07-08 (latest+2) — **Meander gallery added on `rivers-waterfalls-meanders-and-deltas`, founder-provided real photos.** Founder screenshot the labeled "A meander" illustration and asked for 3 more images, "the latest ones in my downloads folder" — 3 real aerial river-meander photos (a Virginia salt marsh's tidal channel network, a wetlands river showing clear erosion/deposition colour contrast between banks, a snowy meander loop near Rochester, Minnesota). Converted the single illustration into a 4-item gallery: the original labeled diagram kept first (its Oxbow lake/Steep bank/River/Bar labels are genuinely useful pedagogically, unlike a plain photo), then the 3 real photos. No `aspect_ratio` set — natural per-slide sizing. `scripts/livebook-sst/add_meander_gallery.js`. All 4 R2 URLs verified live. 21/21 pages re-validated.
- 2026-07-08 (latest+1) — **PLATFORM BUG FIX (2nd one found in `TimelineBlockRenderer.tsx`): the horizontal timeline's connector line never actually reached the next dot.** Founder screenshot of "A River's Journey" (rivers-waterfalls-meanders-and-deltas) showed 3 steps that looked like disconnected clusters rather than one flowing journey — icons were rendering correctly (the earlier icon-glyph fix held), but the connecting line between steps was broken. Root cause: the horizontal layout's connector was a fixed `w-16` (64px) line absolutely positioned right next to each dot, with no relationship to the actual content width or gap to the next item — on any real multi-word label it fell far short of reaching the next dot. There was also a second, fully dead connector div (`hidden` hardcoded, never rendered under any condition). Fixed by restructuring the horizontal layout into a proper step-and-connector flex row: each step (dot + centered content) is `shrink-0`, and a `flex-1` line sits between consecutive steps so it always spans however much space is actually available, with a `min-w-[24px]` floor. Content moved from beside-the-dot to centered-below-the-dot (the standard horizontal-stepper pattern), which is what makes a working flex-grow connector possible in the first place. Removed the dead vertical connector. `tsc --noEmit` clean. Platform-wide fix (any book's horizontal timeline benefits), not book-specific. **Confirmed which pages were affected:** `rivers-waterfalls-meanders-and-deltas` ("A River's Journey," 3 events) and `coastal-landforms-beaches-cliffs-and-stacks` ("How a Headland Becomes a Sea Stack," 4 events) — both `orientation: 'horizontal'`. `economics-choices-and-resources`'s "India's Economic Journey" is `orientation: 'vertical'` and was never affected (its connector is a real CSS border, always continuous). Pure renderer fix — no content/DB change needed, block data was always correct. 21/21 pages re-validated.
- 2026-07-08 (latest) — **Removed the `landforms-and-disasters` hero image entirely, on founder instruction.** Founder, viewing the just-sourced Chamoli rescue-tunnel photo (SDRF team + JCB clearing mud/debris, PIB CC0): "remove this section." Confirmed scope via AskUserQuestion — delete the block entirely (not just clear its `src`), since the 3-image Chamoli overview gallery already sits right below it and now serves as the page's opening visual. `scripts/livebook-sst/remove_chamoli_hero_block.js`, `allowContentLoss` + explicit reason (R2 asset not deleted). This is now the one page in the book without a `block[0]` hero banner, by deliberate founder choice — noted here so a future session doesn't "fix" it back in as a perceived gap. Page now 16 blocks. 21/21 pages re-validated.
- 2026-07-08 (even later) — **Corrected a misplacement: the founder-provided 3-image Chamoli overview gallery (overview/downstream-path/damage-impact) had been put on the wrong page earlier this session.** Founder: "for chamoli disaster i had given u 3 images from my downloads folder, use those. chamoli 1,2, and 3." Checked live DB state and confirmed those exact 3 images (same R2 URLs) were sitting on `glacial-landforms-and-moraines` (a secondary Chamoli mention via the hydropower-debate `perspective_scenario`), not on `landforms-and-disasters` (the actual "Chamoli Disaster page," whose real case study centres on it — and whose hero I'd separately just replaced with a sourced PIB rescue photo). Fixed: inserted the gallery on the correct page, right after the hero (mirroring the exact placement pattern already used), reusing the already-uploaded R2 URLs — no re-upload. Then asked the founder via AskUserQuestion whether to also remove the duplicate copy from the wrong page; founder chose removal, so it was taken out there (`allowContentLoss` + explicit reason citing the founder's confirmed answer — R2 asset not deleted). Scripts: `scripts/livebook-sst/add_chamoli_gallery_correct_page.js`, `scripts/livebook-sst/remove_duplicate_chamoli_gallery.js`. `landforms-and-disasters` now 17 blocks, `glacial-landforms-and-moraines` now 13 blocks. 21/21 pages re-validated.
- 2026-07-08 (later) — **Fixed 3 founder-reported regressions from screenshot review, plus a
  platform-wide code bug in gallery images.**
  1. **`GalleryBlockRenderer.tsx` code fix (real bug, not content):** the renderer always forced a
     locked aspect-ratio box (default `3:2` even when `aspect_ratio` was unset on the block) and
     always cropped every slide via `object-cover` — unlike `ImageBlockRenderer.tsx`, which already
     had a correct natural-size fallback. Fixed: when `aspect_ratio` is unset, the carousel now
     sizes itself to the CURRENT slide's own natural width/height ratio (captured on image load,
     clamped to [0.66, 2.2] so a stray portrait/panorama can't produce a sliver or a skyscraper) and
     renders with `object-contain` instead of `object-cover`. Explicit `aspect_ratio` on a block still
     wins (locked box + crop) for any future case that wants it. `tsc --noEmit` clean.
  2. **Stripped forced `aspect_ratio` from 21 body-content blocks** (single images + galleries)
     across all 21 pages via `scripts/livebook-sst/strip_body_aspect_ratio.js` — content-only fix,
     no code change needed for single images since `ImageBlockRenderer` already falls back to
     natural sizing when the field is absent. **Left `aspect_ratio: '16:5'` on every hero-banner
     block (block[0]) untouched** — confirmed via a research agent that this is a documented,
     platform-wide convention (`BOOK_PAGE_WORKFLOW.md` §3.4.1, "always 16:5 for hero banners"),
     independently in use across 9 other Live Books, not something invented for this book. 21/21
     pages re-validated clean.
  3. **`landforms-and-disasters` hero fixed** — was stuck on "IMAGE PENDING" (src cleared at an
     earlier version awaiting a hyper-realistic regeneration that never happened — a real regression
     from the founder's view: "these images have been undone"). Replaced with a real, verified photo
     of the actual 7 Feb 2021 Chamoli/Tapovan disaster: SDRF rescue teams clearing debris inside the
     Tapovan tunnel, taken 8 Feb 2021 (Press Information Bureau, Government of India — CC0, verified
     via the Commons file page and visually confirmed). This is closer to the founder's original ask
     (real imagery, not another AI attempt) than the abandoned illustration path.
  4. **`underground-water-caves-and-karst-landscapes` hero rebuilt into a 4-item gallery** — founder
     disliked the single Mawsmai Cave photo as too dark/murky. New gallery: (a) the original
     AI-illustrated cave entrance, recovered from `book_page_versions` v4 (R2 asset was never
     deleted, still live — same recovery pattern as the weathering-gallery fix), (b) a much
     better-lit Mawsmai Cave stalactite/flowstone close-up (Dhruva Punde, CC BY-SA 4.0 — same site,
     replaces the poor original), (c) Borra Caves, Andhra Pradesh (Bhim Chawhan, CC BY-SA 4.0), (d)
     Carlsbad Caverns "Big Room", USA (Daniel Mayer, CC BY-SA 3.0). No `aspect_ratio` set — uses the
     new natural-per-slide sizing. Old dark Mawsmai photo asset unlinked (not deleted from R2) with
     founder's own words as consent per CLAUDE.md §0.6 ("i didn't like the cave pic you added").
     Considered and rejected a Belum Caves candidate mid-process after visual inspection showed it
     was a narrow rock crevice, not the clear illuminated-formations shot its filename implied.
  Scripts: `scripts/livebook-sst/strip_body_aspect_ratio.js`,
  `scripts/livebook-sst/fix_chamoli_hero_and_cave_gallery.js`. All via `book-writer.savePage`
  (versioned). 21/21 pages re-validated after each write. NEXT: generate the remaining 5 AI-image
  prompts via the ChatGPT pipeline; founder decision on Singapore/Nordic engagement lens for other
  Class 9 subjects; green-light to start Chapter 3 planning.
- 2026-07-05 — **Chapter 1 COMPLETE — 9/9 pages built** via `scripts/livebook-sst/build_ch1.js`
  (teacher-voice, simple English, per founder request). Structural gate clean on all 9: hero
  16:5, `curiosity_prompt` at Block 1, ≥1 required-minimum callout, mid-page `reasoning_prompt`
  after the concept it tests, `inline_quiz` last with exactly 3 Qs (recall/application/reasoning).
  **Caught + fixed a real quiz-quality bug post-build:** hand-authoring put the correct answer at
  option B 89% of the time with severe length-tell (correct answer routinely 1.3–4.3× longer than
  distractors) — the exact guessable pattern §3.6.1 exists to kill. Fixed in three passes, all via
  `book-writer.savePage` (versioned, no content-loss flag needed since only the `inline_quiz`
  block's `questions` field changed in place): lengthened every short distractor into a real,
  comparably-detailed trap (a plausible misconception, not filler), then rotated 4 questions'
  option order to spread the key off option B. Final: position spread 22/26/22/30% (cap is 40%,
  floor is >0% — both satisfied), zero remaining length-tell warnings. All 9 pages `published:false`
  pending founder review. Template-adaptation call (india_science/meet_a_scientist reuse) applied
  as proposed — flag if it reads wrong once reviewed. NEXT: founder review → then draft the
  Chapter 2 plan (`iest102.pdf`, Shaping of the Earth's Surface) the same way (Phase A gate first).
- 2026-07-04 — Ledger created. Ran `setup_class9_social_science_book.js`: created book
  `class9-social-science` (BOOK_ID `a60d142c-c96b-48cc-ba72-e68d71d83802`) with 9 empty chapter
  shells matching the NCERT Grade 9 Part 1 source sequence (1:1, no re-sequencing needed — unlike
  Math). Mapped all 9 source PDFs → DB chapters. Read `iest101.pdf` (Ch1, 12pp) in full and drafted
  a 9-page plan. Flagged one open design question for the founder: how `india_science` and
  `meet_a_scientist` blocks (named for science) should be reused for humanities content — proposed
  reusing them as-is with broadened intent, no schema change. Awaiting plan approval before
  building Chapter 1 pages.
