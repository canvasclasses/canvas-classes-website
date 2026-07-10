# Book Page Builder — Canonical Workflow

> Single source of truth for building digital book pages in the NCERT Simplified platform.
> **When building any book page, follow this document exactly.**

> **Project state lives in [`_agents/state/LIVE_BOOKS_STATE.md`](../state/LIVE_BOOKS_STATE.md).**
> Read it at the START of any Live Books task to see what content already exists
> (books, chapters, page counts, publish status, Hinglish coverage) without
> re-querying Mongo. After ANY content change — new page, `hinglish_blocks`,
> publish toggle, chapter restructure — run `node scripts/livebooks-state.js` to
> refresh that file's inventory, then add one dated line to its Changelog. This is
> a required final step, not optional housekeeping.

> **REFERENCE-FIRST (project decision 2026-06-14).** Before designing any page, **check [`_agents/reference-books/REFERENCE_LIBRARY.md`](../reference-books/REFERENCE_LIBRARY.md)** for an authored textbook covering the topic. If one exists, read its mapped section in the PDF *before* writing, and design the page's depth, sequencing, analogies, worked examples and questions around the book — it outranks the agent's training knowledge for what to cover and how to teach it. Re-express in our voice (never copy prose verbatim — copyright), and record which book/section informed the page in the `LIVE_BOOKS_STATE.md` changelog line. The first indexed book is Shishir Mittal's *Physical Chemistry* (Class 11–12 chemistry).

> **CONTENT PROTECTION — NO DESTRUCTIVE OPS WITHOUT CONSENT (project decision 2026-06-14, CLAUDE.md §0.6).** Book content is founder-authored and irreplaceable. **Never hard-delete a page or silently drop blocks/asset refs.** All mutations go through **`scripts/lib/book-writer.js`** (`savePage`/`softDeletePage`/`restorePageVersion`) — it version-snapshots the prior state, runs a content-loss guard, soft-deletes (never erases), and audits. Any change that removes a block, unlinks a `src`/`url`/`audio_url`, drops a `page_id`, or sharply shrinks a page is **blocked** unless the founder explicitly approved that removal this session (pass `allowContentLoss` + a reason). R2 asset files are never deleted on block removal. Full system: [`_agents/plans/CONTENT_PROTECTION.md`](../plans/CONTENT_PROTECTION.md).

---

## 1. What You Are Building

A **BookPage** is a focused, self-contained lesson page inside a digital textbook.

**This workflow governs two distinct tracks:**

| Track | Classes | Philosophy | Template |
|---|---|---|---|
| **NCERT "Exploration" — Vedic Fusion** | 9 & 10 | Science begins with questions. Indian Vedic knowledge and modern scientific inquiry meet as equal traditions. Students build moral values alongside conceptual understanding. | §4B + §4C |
| **JEE/NEET Prep** | 11 & 12 | Clarity first, then depth. Exam-ready. | §4A |

**Class 9 & 10 target reader:** A North Indian student in an English-medium school who is encountering secondary science for the first time. Smart, curious, but easily lost in academic English. They need wonder first, definitions second, and a sense that science is connected to who they are — not just a subject to pass.

**Class 11–12 target reader:** Student preparing for JEE/NEET. Smart, busy, and slightly intimidated. They need clarity first, then depth.

---

## 1.5 Reading-Surface Palette (eye-comfort standard — project decision 2026-06-04)

Live Books are **read for long stretches**, so the reading surface is NOT the platform's deepest near-black. Pure black (`#050505`) + white text causes *halation* (text smears for the ~30–50% of readers with astigmatism) and runs ~21:1 contrast — far past WCAG AAA's 7:1, which fatigues the eye. Following Google Material's "don't use pure black; elevate surfaces lighter" guidance, reading surfaces use a **lifted** palette:

| Surface | Value | Notes |
|---|---|---|
| Reading page background | **`#121316`** | the dominant surface behind page content (was `#050505`) |
| Reading chrome / cards | **`#181A21`** | header, sidebar, footer, dropdowns, modal cards (was `#0B0F15`) — *lighter* than the page = Material-style elevation |
| Body text | off-white (e.g. `rgba(255,255,255,0.88)`) | not pure white; narrated-passage text already uses this |
| Modal backdrop scrims | keep `#050505/80` | scrims *should* dim the page behind a popup |

**Rules for any new reading UI:**
- Never use `bg-[#050505]` or pure black for a reading surface, and don't hardcode the lifted hexes either — drive the background from the theme variables: **`bg-[var(--book-bg)]`** for the page, **`bg-[var(--book-surface)]`** for chrome/cards. These resolve to whichever dark variant the reader picked (see the toggle below). Avoid Tailwind opacity modifiers on these vars (`/95` etc.) — convert to solid + `backdrop-blur` instead.
- This palette is applied in the reader shell (`apps/student/features/books/components/**`, the two `loading.tsx` skeletons) and the admin **books-editor preview pane** (`apps/admin/.../books-editor/BookWorkspace.tsx`) so the preview matches the student reader. The global `#050505`/`#0B0F15` tokens in `CLAUDE.md` §7 are unchanged for Crucible/admin shell — this is reading-surface-only.
**Reading-mode toggle (shipped 2026-06-04).** A `ReaderThemeControl` in the reader header lets the student pick one of **three dark variants** — the choice persists per-device and applies to every reading surface:

| Variant | `--book-bg` | `--book-surface` |
|---|---|---|
| **Midnight** | `#0B0C0F` | `#141620` |
| **Charcoal** (default) | `#121316` | `#181A21` |
| **Slate** | `#1A1C22` | `#22242E` |

How it works: `useBookTheme` (`apps/student/features/books/hooks/useBookTheme.ts`) reads `localStorage[canvas_book_theme]` and writes the two vars onto `<html>`; every reading surface uses `bg-[var(--book-bg)]`. Defaults live in `apps/student/app/globals.css` `:root` (Charcoal → no SSR flash). Each client reading surface calls `useBookTheme()` to apply the saved choice; the control is mounted only in the reader header. **Light/sepia are intentionally NOT offered** — the platform is dark-native (all generated images have dark backgrounds + light content), so only *how dark* varies; text and images are untouched.

- **Not yet migrated:** content-block card internals (callout, comparison, narrated-passage popover, code blocks) and simulation canvases still use a hardcoded `#0B0F15` — fine on Midnight/Charcoal, a touch dark on Slate (acceptable inset). Folding them into `var(--book-surface)` is the remaining follow-up. The admin books-editor **preview pane** stays hardcoded at Charcoal (it shows the default reader; the toggle is a per-student preference, not an admin one).

---

## 2. API — How to Create a Page

```
POST http://localhost:3000/api/v2/books/ncert-simplified/pages
Content-Type: application/json
```

Required body fields:
```json
{
  "title": "Page Title",
  "subtitle": "One-line hook — what they'll understand after reading",
  "slug": "url-safe-lowercase-with-hyphens",
  "chapter_number": 1,
  "page_number": N,
  "blocks": [ ...block array... ],
  "tags": []
}
```

**`page_number`** must be the correct position for the new page. Always query existing pages first:
```bash
curl http://localhost:3000/api/v2/books/ncert-simplified/pages
```

### Inserting a page mid-sequence (CRITICAL — follow exactly)

If the new page goes between existing pages, you MUST shift the existing pages first using the
reorder endpoint before creating the new page. **Never use PUT with only metadata to shift pages —
it wipes blocks.** Use PATCH /reorder instead:

```bash
# Step 1 — shift affected pages up (highest page_number first to avoid conflicts)
curl -X PATCH http://localhost:3000/api/v2/books/ncert-simplified/pages/reorder \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"slug": "last-page-slug",   "page_number": 5},
      {"slug": "middle-page-slug", "page_number": 4},
      {"slug": "target-slug",      "page_number": 3}
    ]
  }'

# Step 2 — create the new page at the now-free position
curl -X POST http://localhost:3000/api/v2/books/ncert-simplified/pages \
  -H "Content-Type: application/json" \
  -d '{ "page_number": 2, ... }'
```

The reorder endpoint updates ONLY `page_number` and `chapter_number` — blocks and all content
are completely untouched. It is safe to use for page reordering and chapter reassignment.

**`slug`** rules: lowercase, alphanumeric, hyphens only. No underscores. No spaces. E.g. `chromatography`, `qualitative-analysis`, `quantitative-nitrogen`.

---

## 3. Block Reference — All Types

Every block has `id` (UUID v4), `type`, `order` (0-indexed).

### 3.1 `text`
```json
{
  "id": "uuid",
  "type": "text",
  "order": 0,
  "markdown": "Markdown content with **bold**, *italic*, lists, inline $LaTeX$."
}
```
- Markdown headings (`##`, `###`) are valid inside text blocks
- Use `**bold**` for key terms on first introduction
- Use numbered lists for processes, bullet lists for properties

#### 3.1.1 Inline images inside a text block

Text blocks can embed inline images using extended markdown syntax. Use these when a paragraph needs a visual **alongside** the prose — a photo, a small apparatus detail, a labelled close-up. For the **main** diagram of a concept, keep using a standalone `image` block (§3.4).

**Syntax:**
```
![alt text](src "position|caption")
```

**Position values:**

| Position | Behaviour |
|---|---|
| *(omitted)* | Full-width block, stands alone |
| `right` | Floats right, text wraps left (default for side visuals) |
| `left` | Floats left, text wraps right |
| `right-sm` / `left-sm` | Narrower float (~¼ column width) |
| `center-half` | Centred block at half width |

On mobile (< md) all floats collapse to full-width stacks.

**Rule — every inline image must ship with a generation prompt.** When you decide a paragraph warrants an inline image and the image has not yet been uploaded:

1. Write the inline markdown with a meaningful `alt`, a chosen `position`, and an optional caption
2. Set `src` to a placeholder of the form `PENDING:<short-slug>` (e.g. `PENDING:rust-flake`)
3. Append an `IMAGE_GENERATION_PROMPTS` HTML comment at the **end** of the text block's markdown that lists every pending slug with a full prompt using the §3.4.1 template

**Example inside a text block's `markdown`:**
```
Rust is not just discolouration — it actively eats the iron beneath.
![red-brown rust on an iron nail](PENDING:rust-flake "right|Rust flakes, exposing fresh metal")
Over weeks the oxide layer flakes off, exposing fresh iron to the air — so the attack never stops.

<!--
IMAGE_GENERATION_PROMPTS:
PENDING:rust-flake — Close-up macro photograph of red-brown rust flakes on the surface of an iron nail. Visible texture of cracked, peeling iron oxide layered over metal. Natural side lighting, shallow depth of field. Dark neutral background, crisp focus, editorial photography style.
-->
```

The §3.4.1 quality bar applies equally to inline prompts. Never write vague prompts like `diagram of rust` — be specific, visual, and technical. The agent that writes the paragraph owns both the text **and** the image spec.

### 3.2 `heading`
```json
{
  "id": "uuid",
  "type": "heading",
  "order": 1,
  "text": "Section Title",
  "level": 2
}
```
- `level: 2` for main sub-sections (renders as h3)
- `level: 3` for sub-sub-sections (renders as h4)
- Never use level 1 — page title already uses it

### 3.3 `callout`
```json
{
  "id": "uuid",
  "type": "callout",
  "order": 2,
  "variant": "exam_tip",
  "title": "JEE / NEET Exam Insight",
  "markdown": "Bullet-point facts relevant to competitive exams."
}
```

Variants and when to use them:
| Variant | Purpose | Placement |
|---|---|---|
| `fun_fact` | Real-life hook to open the page | Block 0 for 11–12; Block 1 for Class 9 |
| `exam_tip` | JEE/NEET facts, tricky distinctions, what exams actually ask | Near end, before quiz (11–12 only) |
| `remember` | Critical definitions or rules the student must not get wrong | After relevant explanation |
| `note` | Additional context, not examinable | Optional |
| `warning` | Common mistakes / misconceptions | Optional |

**Class 9 NCERT "Exploration" callout variants** — each maps to a named feature of the textbook:

| Variant | NCERT Feature | Purpose | Placement |
|---|---|---|---|
| `threads_of_curiosity` | Threads of Curiosity | Enriching tangents, fascinating side-facts, observations that deepen wonder | Mid-page, after the concept is established |
| `bridging_science` | Bridging Science and Society | How this specific science has solved a real human problem — health, environment, technology | Near end, after core content |
| `india_science` | India's Scientific Contributions | Indian scientists, institutions, or inventions directly connected to the concept — ancient to present | Woven in naturally near the relevant concept |
| `what_if` | What if… | Open-ended hypothetical or ethical scenario — encourages creative and morally aware thinking | Near end, before quiz |
| `quest_continues` | The Quest Continues | An unanswered question where science is still actively working — frames science as ongoing, not closed | Near end, before quiz |
| `ready_to_go_beyond` | Ready to Go Beyond | Advanced extension — applies the concept to a deeper context or higher-grade content | Optional, near end |

**Writing rules for each Class 9 variant:**

`threads_of_curiosity` — Start with an observation or fact that seems strange or surprising given what the student just learned. Do not explain it fully — let it dangle. End with a question or incomplete thought that invites the student to keep wondering.

`bridging_science` — Name a specific, concrete problem science solved (not "science helps us" vagueness). One problem, one solution, one human impact. Keep under 4 sentences.

`india_science` — Name one specific Indian scientist, institution, or traditional knowledge system. One contribution, one impact. Never generic ("Indians contributed to science"). Never forced — if no natural Indian connection exists for this concept, skip this variant.

`what_if` — Present a single hypothetical scenario or ethical dilemma in 2–3 sentences. It must be genuinely open-ended — there is no single correct answer. Avoid scenarios that collapse into a factual question.

`quest_continues` — Name the specific unanswered question, not a vague "much is still unknown." Ground it in what scientists are actively doing now. End with a line that makes the student feel science is a live process, not a completed archive.

`ready_to_go_beyond` — Only use when there is a genuine extension. Name the higher-grade concept explicitly (e.g. "In Class 10, you will study..."). Never use this as a dumping ground for content that should be in the main text.

**`exam_tip` format (Class 11–12 only):**
```
**Key term or question:** Explanation.

**Another key term:** Explanation.

**Classic exam question:** "..." → Answer.
```

### 3.4 `image`
```json
{
  "id": "uuid",
  "type": "image",
  "order": 3,
  "src": "",
  "alt": "Descriptive alt text for accessibility",
  "caption": "📸 Caption text describing the diagram",
  "width": "full",
  "generation_prompt": "Detailed AI image generation prompt — see Section 3.4.1 below"
}
```
- Always `width: "full"` unless explicitly told otherwise
- **Always set `aspect_ratio`** so the reader reserves the box and blur-up-fades the image in — never a loading "void" (§15.6). Every image is tap-to-zoom. For 2–4 images on one concept use a `gallery`, not a vertical stack (§15.6).
- **`src` should be empty string `""`** when the image has not been uploaded yet
- **Always include `generation_prompt`** — this is what the user will copy into an AI image generator
- Caption always starts with `📸 `
- The renderer shows the generation prompt as a copyable placeholder when `src` is empty
- When `src` is filled with an R2 URL later, the image renders normally

### 3.4.1 Hero Banner — Block 0 on Every Page

Every page opens with a **hero banner image** as its very first block (order: 0). This is a wide, cinematic image that sets the stage visually before any text is read. It is not a diagram — it is an evocative visual that communicates the emotional and intellectual theme of the page.

```json
{
  "id": "uuid",
  "type": "image",
  "order": 0,
  "src": "",
  "alt": "Descriptive alt text",
  "caption": "",
  "width": "full",
  "aspect_ratio": "16:5",
  "generation_prompt": "Ultra-wide cinematic banner (16:5 ratio). ..."
}
```

**Key rules:**
- `aspect_ratio: "16:5"` — always set this on the hero banner. This is wider than 16:9; think of it as a cinematic letterbox crop that spans the full page width without consuming vertical space.
- `caption: ""` — hero banners have no caption. They speak visually.
- `src: ""` — leave empty until uploaded. The renderer shows the generation prompt as a copyable placeholder.
- The image does **not** need labels or annotations. No text overlay. No arrows.
- If you have a genuinely strong idea for the image, write a full prompt. If you are uncertain, write a partial prompt or leave `generation_prompt: "PENDING"` — the author will fill it in.

**Hero banner generation prompt structure:**
```
Ultra-wide cinematic banner (16:5 ratio). [Scene description — what is depicted, spatial layout, 
subject in foreground, background context]. [What the image conveys emotionally or intellectually 
— the theme of the page]. [Lighting and atmosphere]. [Style: painterly illustration / 
photorealistic / epic Indian art / etc.]. Dark background. No text.
```

**Style by class:**
| Class | Preferred style |
|---|---|
| 9 & 10 | Painterly illustration, cinematic Indian art, atmospheric and evocative — not a diagram |
| 11 & 12 | Clean technical illustration or photorealistic — the visual supports the concept directly |

**What makes a good hero banner idea:**
- It captures the *intellectual or emotional essence* of the page — not just the topic
- It can be understood without reading anything — a first-time viewer should feel something
- It creates a question in the viewer's mind that the page answers
- It is wide and sparse — not crowded with elements

**What not to do:**
- ❌ Don't depict a diagram (use a regular image block later in the page for that)
- ❌ Don't add text, labels, or callout arrows in the image
- ❌ Don't use a generic "students studying" or "laboratory equipment" stock image aesthetic
- ❌ Don't use 16:9 for hero banners — it takes too much vertical space. Always 16:5.

---

### 3.4.2 Writing a good `generation_prompt`

A generation prompt should be **specific, visual, and technical**. It tells an AI image generator exactly what to draw.

**🔒 PLATFORM-WIDE STYLE LOCK — DARK BACKGROUNDS, ALL SUBJECTS, NO EXCEPTIONS.**

Every `generation_prompt` on every page — chemistry, physics, biology, hero banners, scientist portraits, scene illustrations, apparatus diagrams — **must specify a dark background**. The Canvas reader uses a dark theme. Light/cream/white backgrounds break visual consistency across the platform. This rule overrides any temptation to mimic the printed-book aesthetic.

- Physics/chemistry/biology technical illustrations: end with `Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.`
- Class 9 hero banners (painterly): use `Dark cinematic background, atmospheric Indian-illustration style, no text overlay.` — never bright daylight or sterile white.
- Class 9 scene illustrations (athlete on a track, car on a highway, marble in a ring): keep characters in colour, but set them against a **dark, twilight, or near-black backdrop** with subtle orange/warm rim lighting — never a bright blue sky or daylight setting.
- Image-generation engine: write prompts for **ChatGPT image 2.0** style — it handles integrated labels, leader lines, and consistent illustration style well.

**Prompts written for light/white backgrounds will be rejected on review.**



Structure: `[Name] + [Spatial layout of components] + [Process arrows] + [Label list] + [Inset if useful] + [Style]`

**Template:**
```
[Technique name] apparatus diagram. [Describe each component spatially — name it, 
describe its position, and any visible internal detail]. Show arrows indicating 
[what moves where — vapour/liquid/current/flow]. Label: [Component1], [Component2], 
[Component3], [Observable result]. [Inset diagram showing [variations or related 
forms] — optional, use only when notable variants exist]. Dark background, orange 
accent labels, clean technical illustration style.
```

**Rules for each clause:**

- **Opening line:** `[Technique] apparatus diagram.` — never use "Scientific diagram of"
- **Spatial layout:** Name every component, describe its position relative to others, and call out internal detail (e.g. "beads visible", "packed with silica gel")
- **Process arrows:** Always include for dynamic processes (distillation, chromatography, extraction). Write exactly what moves and in which direction. Omit only for purely static diagrams (crystal structure, molecular model).
- **Label list:** `Label: X, Y, Z.` — list the 3–5 most important labelled parts by name
- **Inset diagram:** Add `Inset diagram showing [X, Y, Z].` when there are meaningful variants worth showing (e.g. column types, solvent systems). Skip if there are no notable variants.
- **Style:** Always end with `Dark background, orange accent labels, clean technical illustration style.` — this matches the Canvas reader theme exactly. Never use "educational poster style" or "white labels".

**Good example** (fractional distillation):
> "Fractional distillation apparatus diagram. A round-bottom flask on a heat source, with a tall fractionating column (packed column with beads visible) fitted above it, connected at the top to a condenser leading to a collection flask. Show arrows indicating vapour rising up the column and liquid falling back down. Label: Round-bottom flask, Fractionating column, Condenser, Distillate. Inset diagram showing different types of fractionating columns (Vigreux, packed, spiral). Dark background, orange accent labels, clean technical illustration style."

**Every page must have at least one image block with a generation_prompt.** Use your chemistry knowledge to decide the best visual for each concept:
- Purification techniques → apparatus setup diagram with process arrows
- Qualitative tests → test tube colour change sequence, label each tube with reagent and observation
- Quantitative estimation → multi-stage apparatus diagram with labelled collection vessels
- Formulas/calculations → do NOT generate images for these; use `latex_block` instead

### 3.5 `worked_example`
```json
{
  "id": "uuid",
  "type": "worked_example",
  "order": 4,
  "label": "Problem 12.20",
  "variant": "ncert_intext",
  "problem": "Markdown statement of the problem with $LaTeX$ as needed.",
  "solution": "Step-by-step solution in markdown.\n\n**Step 1:** ...\n\n**Step 2:** ...\n\n**Answer:** ...",
  "reveal_mode": "tap_to_reveal"
}
```
- `variant`: `"ncert_intext"` for NCERT in-text problems; `"solved_example"` for other worked examples
- `reveal_mode`: always `"tap_to_reveal"` so students attempt before seeing answer
- `problem` and `solution` support full markdown + LaTeX
- Format solution as clear numbered/bold steps, ending with boxed answer

### 3.6 `inline_quiz`
```json
{
  "id": "uuid",
  "type": "inline_quiz",
  "order": 5,
  "pass_threshold": 0.67,
  "questions": [
    {
      "id": "uuid",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 2,
      "explanation": "Why C is correct, and why the others are wrong."
    }
  ]
}
```
- Always **last block** on the page
- Minimum 2 questions, maximum 5 questions
- `pass_threshold`: 1.0 for 1 question; 0.67 for 2–3 questions; 0.6 for 4–5 questions
- `correct_index` is 0-based
- Explanation must be educational — explain the concept, not just "C is correct because C"
- Options: always exactly 4, and **every option must obey §3.6.1**
- Questions should test understanding, not just memorisation
- Tag each question with `difficulty_level` (1 = recall, 2 = application, 3 = reasoning) — the actual schema field (the older `reasoning_level` name is deprecated; write `difficulty_level`)

### 3.6.1 Option-Design Rules — every distractor must be a real trap

> Added 2026-06-06. Applies to **every** multiple-choice block: `inline_quiz`, `chapter_practice`, `reasoning_prompt`, and `comprehension_checkpoint`. The single most common quality failure in auto-generated quizzes is the *giveaway*: three throwaway options and one obviously-correct one, so a student who never read the page still scores by elimination. These rules exist to kill that.

**The four-intelligent-options rule (non-negotiable).** Every one of the four options must be something a *half-prepared* student could genuinely pick. Each wrong option is a specific, nameable mistake — a real misconception, a believable misreading, or a realistic calculation slip — **never filler**. Test: if you can tell which option is correct *without knowing the topic* (because it's the longest, the most detailed, the only specific one, or the only grammatical fit), the question has failed — rewrite the distractors, not the key.

Banned option patterns:

| Pattern | Why it leaks the answer | Fix |
|---|---|---|
| **Length / detail tell** — the key is the long, careful, qualified option; the other three are short and blunt | Students learn "pick the wordy one". | Match all four in length and grammatical shape. If the key needs a clause, give the distractors clauses too. |
| **Near-duplicate of the key** — a distractor that is the correct answer with one word softened (`always`→`usually`), sitting beside two absurd options | Signals the two "serious" options; flags the rest as filler. | Make all four mutually exclusive and individually defensible. Never pad with a reworded twin of the key. |
| **Joke / odd-one-out option** — "the teacher made a mistake", "magic", "none of the above" | Eliminated instantly, raising the guess rate to 1-in-3. | Replace with a real misconception. No "all/none of the above". |
| **Grammatical mismatch** — only the key fits the stem (a/an, singular/plural, tense) | Grammar, not physics, reveals the answer. | Make every option a clean grammatical fit for the stem. |
| **Giveaway specificity** — only the key carries a number/unit/name; distractors are vague | The specific option obviously *is* the real answer. | Give distractors equally specific — but wrong — numbers/units/names. |

**Physics distractor sources — build wrong options from the misconceptions the chapter is actually fighting:**
- "A moving object needs a continuous force to keep moving" (pre-Galilean intuition).
- "Heavier objects fall faster" / "g depends on mass".
- "Action and reaction cancel out, so nothing moves" (forgetting they act on *different* objects).
- "Net force is the larger force" (instead of the *difference* of two opposing forces).
- "Friction always opposes motion" (forgetting friction is what lets you walk and drives the wheel forward).
- "Force points the same way as velocity" (instead of force → *acceleration*).
- Quantity confusion: weight vs mass, newton vs kilogram, speed vs velocity.

**Numerical distractor sources — for any calculated key, build the three wrong options from the actual paths a student takes to a wrong number, each landing on a clean value:**
- Used the applied force instead of the *net* force (forgot to subtract friction).
- Used mass where weight (`mg`) was needed, or vice versa.
- Sign / direction error (treated a deceleration as positive).
- Used `g = 10` where the key uses `9.8` (or vice versa) — only when the gap is pedagogically meaningful, never as the *only* difference between two options.
- Off-by-unit (cm vs m, g vs kg, km/h vs m/s).
- Never invent round-number decoys that match no real error path — they read as filler.

**Mechanical floor (enforced by validators for *both* `chapter_practice` and `inline_quiz` — see the toolchains below; do not eyeball it):**
- Exactly **4 options**; no duplicate or near-duplicate option texts; `correct_index` in range.
- The key is *uniquely the longest* in **≤ 40%** of a bank, and **never** more than **1.3×** the next-longest option.
- Across a bank, the key is spread over A/B/C/D: **no position > 40%**, and **none ever 0%**. Author with explanations that reference option *content* (never "option B"), then run the balancer.
- Every question carries a `difficulty_level` (`inline_quiz`: 1/2/3) or `difficulty` (`chapter_practice`: 1–5).

**Explanation rule.** The `explanation` teaches: state why the key is right **and name why the most tempting distractor is wrong**, in one or two plain sentences. Never "Option C is correct because it is C."

#### 3.6.1.1 Toolchains — run these, don't hand-check

Two scripted pipelines enforce the rules above. Both match questions by `(page_slug, block_id, q_id)` so re-running is exact and idempotent.

- **Page `inline_quiz`s — including fixing existing/published quizzes — `scripts/science-quiz/`:**
  1. `node scripts/science-quiz/quiz_extract.js <ch>` → dumps the chapter's quizzes to `_ch<N>_quiz.json`.
  2. Rewrite the options/explanations in that file (length-parity, real misconceptions, **de-reference any "option B"-style letters** from explanations or the next step will skip the question).
  3. `node scripts/science-quiz/quiz_balance.js <ch> --write` → spreads the key across A/B/C/D deterministically.
  4. `node scripts/science-quiz/quiz_apply.js <ch>` → writes the questions back into `book_pages`.
  5. `node scripts/science-quiz/quiz_validate.js <ch|all>` → the gate (4 options · no dupes · length-tell ≤ 40% · no position > 40% / none 0% · every question difficulty-tagged). Must print PASS.
- **Chapter-end `chapter_practice` banks — `scripts/science-practice/`:** see §4F.3 (`balance_positions.js` → `practice_build.js` → `practice_validate.js`).

> **Why this exists (finding, 2026-06-06):** a book-wide audit of the live Class 9 Science quizzes found them highly guessable — 290 questions with a **58% length tell** and the **correct answer = "B" 57% of the time**, only 10% difficulty-tagged. Running the `science-quiz` pipeline across all five live chapters (232 questions) cut the length tell to **7%**, the most-common answer position to **24%**, and difficulty-tagging to **90%**. When you build or touch a chapter, run `quiz_validate.js all` before considering it done.

### 3.7 `simulation`
```json
{
  "id": "uuid",
  "type": "simulation",
  "order": 6,
  "simulation_id": "fractional-distillation",
  "title": "Descriptive title"
}
```
- Only use if a simulation component exists at `components/books/renderer/blocks/simulations/`
- `simulation_id` must match an existing component registered in `SimulationBlockRenderer.tsx`
- **Every simulation MUST carry a `prediction` (predict→reveal gate) — no bare simulators. See §15.4 and the `prediction` shape in §4B.**

#### 3.7.1 Biology — use `interactive_image` instead of `simulation`

For **biology pages (Class 9 & 10 Science chapters on living systems)**, simulations are generally avoided. The reasons:
- Biological processes resist faithful animation — every simplification risks introducing wrong mental models (cells don't actually look like neat hexagons; mitosis isn't a clean four-step process; a neuron firing doesn't look like a glowing wire).
- Anatomical accuracy demands real reference imagery, not procedurally generated visuals.

Instead, biology uses the **`interactive_image`** block — a multi-image display that lets students explore the same concept through several views, click to zoom, or step through a timeline. See §3.13.

Use `simulation` in biology only when the topic is genuinely physics-flavoured (e.g., osmosis as a thermodynamic process, transpiration pull as a fluid mechanics problem). For all anatomy, histology, organ-system, and developmental biology pages, default to `interactive_image`.

### 3.8 `table`
```json
{
  "id": "uuid",
  "type": "table",
  "order": 7,
  "caption": "Table title",
  "headers": ["Column 1", "Column 2", "Column 3"],
  "rows": [
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
  ]
}
```
- Use for comparison data — reaction products, test results, properties side by side
- Keep tables narrow (2–4 columns)
- **Font-size rule (do not break):** table **body cells must render at the same size as body paragraph text — `text-[17px]`** so a table doesn't read as "smaller print" next to the prose above it. This is already baked into the shared renderers (`packages/book-renderer/blocks/TableBlockRenderer.tsx` and the markdown-table override in `TextBlockRenderer.tsx`) — you author `headers`/`rows` as plain content and never set sizes, so just **don't introduce a new table component or a `text-[14px]`/`text-sm` table** anywhere in book-renderer. Header eyebrow labels stay deliberately small (uppercase 11px); only the body content matches the paragraph.

### 3.9 `comparison_card`
```json
{
  "id": "uuid",
  "type": "comparison_card",
  "order": 8,
  "title": "X vs Y",
  "columns": [
    { "heading": "Method A", "points": ["Point 1", "Point 2"] },
    { "heading": "Method B", "points": ["Point 1", "Point 2"] }
  ]
}
```
- Use when comparing two methods/techniques — exams love "distinguish between" questions
- Max 3 columns; 3–6 points per column

### 3.10 `latex_block`
```json
{
  "id": "uuid",
  "type": "latex_block",
  "order": 9,
  "latex": "\\frac{12 \\times m_2}{44 \\times m} \\times 100",
  "label": "Equation 12.1",
  "note": "Where m = mass of compound, m₂ = mass of CO₂"
}
```
- Use for display equations — important formulas that deserve their own line
- `latex` field: raw LaTeX without `$` delimiters
- JSON escaping: `\\frac`, `\\times` (double backslash in JSON = single `\` in LaTeX)

### 3.11 `meet_a_scientist`

Brief biography of a scientist directly connected to the concept on this page. Maps to the NCERT "Meet a Scientist" feature.

```json
{
  "id": "uuid",
  "type": "meet_a_scientist",
  "order": 8,
  "name": "C.V. Raman",
  "years": "1888–1970",
  "nationality": "Indian",
  "portrait_prompt": "Portrait illustration of C.V. Raman, Indian physicist, Nobel laureate. Formal attire, confident expression, neutral dark background. Clean editorial illustration style, orange accent.",
  "portrait_src": "",
  "contribution": "Discovered the **Raman Effect** in 1928 — when light passes through a transparent material, a small fraction scatters at a different wavelength. This scattering reveals the molecular structure of the material.",
  "connection": "Every time you see a solution scatter a beam of light in this chapter's experiment, you are observing the same phenomenon Raman studied.",
  "fun_detail": "Raman made his discovery using sunlight and simple prisms — not expensive lab equipment. He won the Nobel Prize in Physics in 1930, the first Asian scientist to do so.",
  "learn_more": "Raman Research Institute, Bangalore (founded by C.V. Raman) continues this work today."
}
```

**Field rules:**
- `name` — full name as commonly known
- `years` — birth–death or birth–present
- `nationality` — one word; for Indians always `"Indian"`
- `portrait_src` — empty string until uploaded; renderer shows `portrait_prompt` as placeholder
- `contribution` — 2–3 sentences: what they discovered/invented and why it matters. Bold the key term.
- `connection` — 1 sentence bridging their work to the exact concept on *this page*. This is mandatory — never include a scientist whose work has no direct connection.
- `fun_detail` — 1–2 sentences of humanising detail: the instrument used, a surprising fact, the context of discovery. Not awards — unless the award has a good story.
- `learn_more` — Optional. One institution, journal, or resource the student can actually look up.

**When to use:**
- Use when a specific scientist's story is directly relevant to the concept being taught — not just tangentially related to the field.
- Prefer Indian scientists where genuinely relevant. Never force an Indian scientist if the direct contribution came from elsewhere.
- Maximum one `meet_a_scientist` block per page.

---

### 3.12 `curiosity_prompt`

Open-ended curiosity hook. **Block 0 on Class 9 pages.** Primes the student's thinking before the concept is introduced — zero prior knowledge required. There is no "correct answer", no MCQ, no grading. It sets a scene and asks the student to wonder.

```json
{
  "id": "uuid",
  "type": "curiosity_prompt",
  "order": 0,
  "prompt": "Look at a glass of tap water. Do you think you're drinking pure H₂O — or something else? What's actually in there?",
  "hint": "Optional — one short line to nudge thinking if the student is stuck.",
  "reveal": "Optional — a short teacher-voice reflection shown after tapping 'Show reflection'. Frame it as 'here's what's interesting about this question', not 'here's the answer'."
}
```

**Rules:**
- **No `options` array.** `curiosity_prompt` is never an MCQ. For MCQ-style reasoning, use `reasoning_prompt` (§4B), placed mid-page after the concept is introduced.
- The `prompt` must be ponderable by a 9th grader with **zero prior knowledge** of the page's topic. If the student needs definitions first, the question belongs in `reasoning_prompt`, not here.
- `reveal` is optional. Use it only when a short reflection genuinely adds something; otherwise the act of wondering is the whole point.
- **Class 9:** only ever used at **Block 0** (the "Think It Over" opener); never mid-page.
- **Class 11–12 — "food for thought" lesson opener (founder decision 2026-06-21).** A lesson page may open with **one or two `curiosity_prompt` cards in the opening cluster** — after the hero (and optional `callout[fun_fact]` hook) but **before the first concept** — to *build curiosity instead of starting cold on a definition*. Rules: each prompt must be ponderable without the page's content; give each a `reveal` that points toward the idea the page is about to teach; keep them at the **top** (don't scatter `curiosity_prompt`s mid-lesson — the post-concept check is still a `reasoning_prompt`, §15.3). A `callout[fun_fact]` opener is still fine when a curiosity prompt doesn't fit. **The chapter-opener page itself does NOT carry food-for-thought** — it follows §15.1 strictly (hero image + subtitle intro + optional outcome bullets; the journey/page-list is auto-derived). Reference build: Ch.4 Chemical Bonding (`why-atoms-bond` opens with two stardust food-for-thought prompts; the opener `chapter-4-stardust-opener` stays minimal).

---

### 3.13 `interactive_image` — Biology's Primary Visual Block

For biology pages (anatomy, histology, organ systems, developmental biology), animation almost always introduces inaccuracy. The `interactive_image` block lets a student **click on labelled regions of a single high-quality diagram** to reveal detail — a perfect fit for histology cross-sections, neuron anatomy, joint diagrams, and organ overviews where every part deserves its own micro-explanation.

```json
{
  "id": "uuid",
  "type": "interactive_image",
  "order": 5,
  "src": "",
  "alt": "Cross-section of a sunflower stem showing all tissue types",
  "caption": "📸 Tap each dot to explore the tissues",
  "hotspots": [
    {
      "id": "uuid",
      "x": 0.18,
      "y": 0.22,
      "label": "Epidermis",
      "detail": "The outermost protective layer. A single layer of tightly packed flat cells covered with **cuticle** — a waxy coating that prevents water loss.",
      "icon": "circle"
    },
    {
      "id": "uuid",
      "x": 0.34,
      "y": 0.55,
      "label": "Xylem",
      "detail": "Conducts water and minerals from roots upward. Most of its cells are **dead** at maturity — the empty tubes are what carries water.",
      "icon": "circle"
    }
  ],
  "generation_prompt": "Cross-sectional botanical illustration of a sunflower (Helianthus annuus) stem showing all tissue types ... [§3.4.2 prompt rules, §3.14 biology style]"
}
```

**Field rules:**
- `src` — empty string until uploaded; the renderer shows the `generation_prompt` as a placeholder
- `hotspots` — minimum 2, maximum 10. Each is a clickable dot at relative coordinates (`x`, `y` ∈ [0,1]) with a label and a detail popup
- `detail` supports inline markdown (bold, italic, inline math)
- `icon` — `"circle"`, `"pin"`, or `"plus"` (default circle)
- `generation_prompt` — required when `src` is empty; follows §3.4.2 + §3.14 (biology image-style standards)

**When to use `interactive_image`:**
- Densely labelled histology / anatomy diagrams (sunflower T.S., neuron structure, components of blood, types of joints on a skeleton)
- Any place a Class 9 biology page would otherwise need a long list of "Label A is X. Label B is Y. Label C is Z."
- One per page is the norm; never more than two

**When NOT to use `interactive_image`:**
- For a **comparison** of distinct types side-by-side (parenchyma vs. collenchyma vs. sclerenchyma) — use a `comparison_card` plus a single `image` block showing all three panels.
- For a **process** that progresses through stages (Steward's carrot experiment) — use a `timeline` block (§3.8).

### 3.13.1 Biology page — block-type decision tree

| The concept is… | Use this block |
|---|---|
| A single rich anatomical diagram with many labelled parts | `interactive_image` |
| 2–4 distinct types being compared | `comparison_card` + one `image` block with side-by-side panels |
| A multi-stage process or experiment | `timeline` (text-based) OR `timeline` + a separate `image` block |
| A single concept with one diagram and ≤ 3 labels | regular `image` block |
| A self-experience activity (like Activity 3.3 in the chapter) | `table` block |

**Rule:** Every biology page on Class 9 should have at least one of `interactive_image`, `comparison_card`, or `timeline` — these are the equivalents of "simulation" for the biology track.

---

### 3.14 Biology Image-Style Standards (Class 9 Tissues, Reproduction, Diversity, Earth as a System)

All biology image prompts — whether in `image` blocks, inline images, or `interactive_image` items — follow a single house style:

**The standard prompt scaffold:**
> *"Scientific textbook illustration of [subject]. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Soft natural colours appropriate to the tissue type — greens for living plant tissue, pinks/magentas for phloem and animal soft tissue, browns/tan for woody and dead lignified tissue, ivory for bone, deep red for blood. No photorealism, no artistic shading, no decorative elements, no stylised characters. Match standard biology textbook illustration conventions."*

**Hard rules every biology image prompt must enforce:**
1. **Dark background** — `#0a0a0a` or near-black, never white. Matches reader theme.
2. **White (or near-white) labels and leader lines** — never orange or coloured text on biology diagrams; orange is reserved for chemistry/physics. Exception: small subtle orange accents on a single highlighted region are fine.
3. **Anatomical accuracy first** — cell shapes, layer counts, organ proportions must match real biology.
4. **No stylisation** — no anime, no cartoon mascots, no smiling cells, no anthropomorphism.
5. **Functional colour palette** — green = living photosynthetic, pink/magenta = phloem/animal soft tissue, brown/tan = xylem/dead lignified, blue = water, red = blood, ivory = bone.
6. **Composition serves comprehension** — central subject large, no busy backgrounds, leader lines never cross, scale bars where relevant.
7. **For comparison panels** (e.g. parenchyma vs. collenchyma vs. sclerenchyma), specify side-by-side layouts with **identical scale and viewing angle** so the student can actually compare.
8. **For process diagrams**, arrows are labelled with the action happening at each step, not just decorative.

**Hero banner — biology variant.** For Class 9 biology pages, hero banners stay painterly and atmospheric (per §3.4.1) — but use **dark, naturalistic settings**: a microscope lab in evening light, a forest canopy at dusk, a cross-section of bark catching low light. Never bright white or sterile.

---

## 4. Standard Page Structure

### 4A. Class 11–12 (JEE / NEET) — Default Template

> **Apply §15 (Experience Standards) on top of this template.** In particular for 11–12: every `heading[2]` gets an `objective` (§15.2); add a **mid-page** `reasoning_prompt`/micro-check after each major concept, not just the closing quiz (§15.3); every `simulation` is predict-first (§15.4); end with a one-line bridge to the next page (§15.10); and split rather than exceed ~18 blocks / one sub-topic (§15.8).

Every page should follow this flow. Adjust as needed but don't skip the hook or the exam tip.

```
Block 0:  image[hero banner]  ← Wide 16:5 hero image — sets the visual stage (aspect_ratio: "16:5", caption: "")
Block 1:  callout[fun_fact]   ← Real-life hook. Opens curiosity.
Block 2:  text                ← Core concept: what it is, why it matters
Block 3:  heading[2]          ← Sub-section: first major part
Block 3:  text                ← Explanation with steps / mechanism
Block 4:  image               ← Diagram — ALWAYS include; src="" + generation_prompt if not yet uploaded
Block 5:  heading[2]          ← Sub-section: second major part (if exists)
Block 6:  text                ← Explanation
Block 7:  image               ← Second diagram if section warrants one
Block 8:  worked_example      ← NCERT solved example (if exists in source)
Block 9:  comparison_card     ← (optional) if two methods being compared
Block 10: callout[exam_tip]   ← JEE/NEET exam insight
Block 11: inline_quiz         ← 2–4 questions, always last
```

**Images are mandatory.** Every page must have at least one image block.  
- If no real image is available: use `src: ""` with a detailed `generation_prompt` — the renderer shows it as a copyable placeholder.
- Never omit images — they are part of the content structure.
- **If content is simple:** fewer blocks is fine, but the image block stays.
- **If no worked example exists in source:** skip it entirely.

---

### 4B. Class 9 — NCERT "Exploration" Template

#### Philosophy First

This template is built around the NCF-SE 2023 vision: **science begins with questions, not definitions.** Every page should feel like it is unfolding something — not delivering a package.

Three mindset shifts from the 11–12 template:
- **Questions before answers.** Lead with wonder. Establish concepts. Then deepen.
- **India is woven in, not tacked on.** Indian scientists, contexts, and examples belong naturally near the relevant concept, not in a standalone box that reads as an afterthought.
- **Science is ongoing.** Every page has at least one beat acknowledging what we do not know yet. The textbook is not the last word.

#### Mandatory Features (every Class 9 & 10 page must have all four)

| Block | Type | NCERT Equivalent |
|---|---|---|
| Block 0 | `image` hero banner (16:5, no caption) | Visual stage-setter |
| Block 1 | `curiosity_prompt` | Think It Over |
| Mid-page (after concept) | `reasoning_prompt` | Pause and Ponder |
| Last block | `inline_quiz` | Revise, Reflect, Refine |

#### Required Minimum — at least one per page

Every page must include at least one of the following. Choose what fits the concept most naturally — never force:

| Type | NCERT Equivalent | Pick when |
|---|---|---|
| `callout[threads_of_curiosity]` | Threads of Curiosity | A genuinely interesting side-fact or strange observation exists |
| `callout[india_science]` | India's Scientific Contributions | A specific Indian scientist, institution, or traditional knowledge is directly relevant |
| `callout[bridging_science]` | Bridging Science and Society | The concept has solved or is solving a concrete human problem |
| `callout[quest_continues]` | The Quest Continues | A real unanswered question exists in this topic area |
| `callout[what_if]` | What if… | The concept opens a genuine ethical or hypothetical angle |

If multiple fit, include the one that is most content-rich. Two is fine if both genuinely strengthen the page. Three or more on a single page will feel crowded — cut to the strongest.

#### Optional (use when natural, never force)

| Type | NCERT Equivalent | Notes |
|---|---|---|
| `meet_a_scientist` | Meet a Scientist | Only when a specific scientist's story directly illustrates the concept |
| `callout[ready_to_go_beyond]` | Ready to Go Beyond | Only when there is a real Class 10+ extension — not a dumping ground |
| `simulation` | Think as a Scientist | Where a meaningful prediction challenge exists |
| `worked_example` | Solved examples | For pages with numerical content |

#### Standard Block Order

```
Block 0:  image (hero banner, 16:5)       ← Wide cinematic image — sets the visual and emotional stage
Block 1:  curiosity_prompt                ← "Think It Over" — open-ended, zero prior knowledge required
Block 2:  callout[fun_fact]               ← Vedic verse (Gita / Upanishads / Vedas) — three-part format
Block 3:  text                            ← Core concept: definitions, what it IS
Block 3:  heading[2]                      ← First sub-concept
Block 4:  text                            ← Explanation / mechanism
Block 5:  reasoning_prompt                ← "Pause and Ponder" — student now has vocabulary to reason with
Block 6:  image                           ← Diagram (mandatory — src="" + generation_prompt if not uploaded)
Block 7:  callout[threads_of_curiosity]   ← OR india_science / bridging_science (one required, place after concept)
Block 8:  heading[2]                      ← Second sub-concept (if exists)
Block 9:  text                            ← Explanation
Block 10: image                           ← Second diagram (if the second sub-concept warrants one)
Block 11: simulation                      ← "Think as a Scientist" — with prediction challenge (where applicable)
Block 12: meet_a_scientist                ← "Meet a Scientist" (where applicable)
Block 13: worked_example                  ← NCERT solved example (if source contains one)
Block 14: callout[quest_continues]        ← "The Quest Continues" — what is still unknown (required unless already in Block 7)
Block 15: callout[what_if]               ← Hypothetical / ethical scenario (optional)
Block 16: callout[ready_to_go_beyond]    ← Advanced extension (optional)
Block 17: inline_quiz                     ← "Revise, Reflect, Refine" — 3 questions, always last
```

Not every position will be occupied. The non-negotiables are Block 0, at least one `reasoning_prompt`, and `inline_quiz` as the last block. Everything else appears only when warranted by the content.

#### curiosity_prompt — Block 0 rules

See §3.11 for the full block schema. Key constraints:
- **Answerable with zero prior knowledge** of the page's topic. If the student must know definitions first, the question belongs in `reasoning_prompt` instead.
- Open-ended tone, no options, no graded commit.
- One per page, always at `order: 0`.

#### reasoning_prompt — Class 9 rules

```json
{
  "id": "uuid",
  "type": "reasoning_prompt",
  "order": 5,
  "reasoning_type": "logical",
  "prompt": "You mix iron filings with sulfur powder. One classmate says the result is a compound of iron and sulfur. Another says it's just a mixture. Without doing any experiment, how would you decide who is right?",
  "options": [
    "The first classmate is right — combining any two substances always makes a compound",
    "You need to test whether the properties changed — a mixture keeps the individual properties of its components, while a compound has entirely new properties",
    "The second classmate is right — mixing never forms compounds under any condition",
    "You need a microscope to see whether the particles combined"
  ],
  "reveal": "A mixture retains the properties of its components — iron is still magnetic, sulfur still yellow and brittle. A compound has new properties — iron sulfide (FeS) is black, non-magnetic, and doesn't behave like either element. The answer isn't in the act of mixing; it's in what changed.",
  "difficulty_level": 2
}
```

**Placement rule — never skip.** A `reasoning_prompt` must appear **after** the text block(s) that introduce every concept the student needs to answer it. Test your placement: read the blocks above your `reasoning_prompt` as if you know nothing else. If you cannot answer the prompt from what's above, move the prompt later.

- ❌ **Never Block 0.** A reasoning MCQ before any content is a coin flip, not reasoning.
- ❌ **Never right after `curiosity_prompt` and `fun_fact`** — the student still has no concepts to apply.
- ✅ **After the first or second `text` block** that defines the concept — the student now has the vocabulary and mechanism to reason with.
- ✅ **Maximum one per page.** If a page has two distinct concepts that each warrant a reasoning check, place two `reasoning_prompt` blocks, each after its relevant concept.

**reasoning_type values and when to use:**
| Type | Use when | Example |
|---|---|---|
| `logical` | If-then relationships, cause and effect, identifying flawed reasoning | "If X, does Y always follow?" |
| `spatial` | Spatial relationships, diagrams, geometry, structures | "What shape will the shadow be?" |
| `quantitative` | Reasoning with numbers — NOT calculation, but estimation / plausibility | "Which is larger, and by roughly how much?" |
| `analogical` | Structural similarities between different domains | "How is this like a [different system]?" |

**difficulty_level guide for Class 9:**
- Level 1 (Comprehension): Recall a fact and state it. Minimum bar.
- Level 2 (Application): Apply a concept to a new but similar situation.
- Level 3 (Analysis): Break down a scenario, identify what is and isn't true.
- Level 4 (Evaluation): Evaluate a claim, identify the flaw, or construct a counter-argument.
- Level 5 (Pattern/Analogy): Identify a structural similarity across domains. Use sparingly.

Start with Level 2 on most pages. Level 3 when the concept naturally produces a testable prediction. Reserve Level 4–5 for chapters where the concept is well established and the student has had practice.

#### inline_quiz — Class 9 question mix

The final quiz on every Class 9 page must have exactly 3 questions in this order:
1. **Recall** (Level 1) — confirms the student read the page
2. **Application** (Level 2) — applies the concept to a new scenario
3. **Reasoning** (Level 3) — requires the student to think, not remember

Tag each question with `difficulty_level` (1 = recall, 2 = application, 3 = reasoning) — this is the real schema field; the older `reasoning_level` name is deprecated, do not write it:
```json
{ "id": "uuid", "question": "...", "options": [...], "correct_index": 0, "explanation": "...", "difficulty_level": 1 }
```

**Every one of the 3 questions must obey the option-design rules in §3.6.1** — all four options a real trap, no length/specificity/grammar tell, no near-duplicate-of-key padding. A 3-question page quiz where "the long one is always right" is a failed quiz even if the content is correct.

#### simulation prediction — when to use

Add `prediction` to a simulation block only when:
- There is a non-obvious outcome that the student can meaningfully predict
- The prediction has a concrete, observable answer in the simulation
- Getting it wrong teaches something (not just a trivial guess)

Do NOT add prediction to exploratory simulations (e.g., sliders that just visualise a formula).

```json
{
  "id": "uuid",
  "type": "simulation",
  "order": 6,
  "simulation_id": "free-fall-gravity",
  "title": "Free Fall Simulator",
  "prediction": {
    "prompt": "A 1 kg ball and a 10 kg ball are dropped from the same height at the same time. Which lands first?",
    "options": ["The 10 kg ball lands first", "The 1 kg ball lands first", "Both land at exactly the same time"],
    "reveal_after": "Both balls land at the same time. Gravitational acceleration (g = 9.8 m/s²) is independent of mass — every object in free fall accelerates identically. The only reason a feather falls slower on Earth is air resistance, not gravity. On the Moon, with no atmosphere, a feather and a hammer fall together."
  }
}
```

---

## 4C. Class 9 — Per-Page Consistency Checklist

Before submitting any Class 9 page, verify every item. This checklist enforces the NCERT "Exploration" vision across every author and every page.

### Structure checks
- [ ] Block 0 is `curiosity_prompt` — answerable with zero prior knowledge, no options array
- [ ] At least one `reasoning_prompt` appears **after** the text blocks that establish the concept it tests
- [ ] `inline_quiz` is the last block with exactly 3 questions (recall → application → reasoning)
- [ ] At least one of: `threads_of_curiosity`, `india_science`, `bridging_science`, `quest_continues`, `what_if`
- [ ] Every `heading[2]` that starts a sub-section has at least one `text` block below it

### Content checks
- [ ] No page starts with a definition — the `curiosity_prompt` leads
- [ ] `india_science` callout (if used) names a **specific** scientist or institution, not "Indians contributed"
- [ ] `quest_continues` names the **specific** unanswered question — not "much is still being explored"
- [ ] `what_if` scenario is genuinely open-ended — no single correct answer collapses it into a factual question
- [ ] `meet_a_scientist` (if used) has a `connection` field that ties directly to **this page's concept**
- [ ] Images have `generation_prompt` — never left empty when `src: ""`

### Tone checks
- [ ] Second person throughout (`you`, `your`) — not `students` or `learners`
- [ ] No sentence begins with "In this section, we will learn..."
- [ ] No passive constructions: "it is observed" → "you observe"
- [ ] At least one analogy from everyday life appears in the first two `text` blocks
- [ ] The page does not feel like an exam-prep page — it feels like exploring something

### Cross-subject integration (where natural)
The "Exploration" textbook explicitly integrates biology, chemistry, physics, earth science, and social sciences. When a concept connects naturally to another subject, name it:
- A chemistry concept that explains a biology process → one sentence in a `text` block
- A physics principle underlying a chemistry reaction → mention in the `threads_of_curiosity` or `bridging_science` callout
- A mathematical pattern in a scientific observation → a `reasoning_prompt` of type `quantitative`

Do not force cross-subject links. One natural connection is better than three strained ones.

---

## 4D. Topic Containment — One Page, One Sub-Topic, Fully Closed

**The single most important structural rule.** Every page is a self-contained learning unit. A student who reads only this page should leave with one sub-topic *fully understood and tested*. Nothing carries over.

> **Hard guardrail (§15.8):** if a page exceeds **~18 blocks** OR covers **2+ distinct sub-topics**, split it — even if every block is good. A mega-page is a flow failure and bloats the right-rail exam box into a wall.

### The Rule

- **One page = one sub-topic.** Pick the smallest coherent idea that can be taught and tested in a single sitting.
- **Finish what you start on the page itself.** All worked examples, all sub-cases, all definitions, and the closing quiz for *this* sub-topic must live on this page. Never split a sub-topic across two pages — never write *"we'll see this in the next page"* mid-explanation.
- **Never carry content forward.** If a NCERT exercise has 4 parts and they all belong to the same sub-topic, all 4 parts must appear on the same page. If parts (i) and (ii) belong to a different sub-topic than (iii) and (iv), they belong on different pages — but each page still closes its own sub-topic completely.
- **Every page ends with an `inline_quiz` that tests *this page's* sub-topic.** The quiz is the page's closure mechanism: it confirms the learner has finished the sub-topic before they move on.

### Source images are a flow guide, not a page count

When working from NCERT (or other) source images, treat them as a *map of the chapter's flow*, not a 1-to-1 page-count specification. **The book may take 2 source pages to cover a sub-topic, or 1 source page may contain 3 distinct sub-topics — split or merge as the topic demands.** Our digital pages are organised by *concept boundary*, not by where a printed page break happens to fall.

### How to pick a sub-topic boundary

Ask:
1. *Can this idea be taught in 8–15 blocks without referring to "what comes next"?*
2. *Can a learner pass a 3–4 question quiz on it after reading just this page?*
3. *Does it have a clear opening question and a clear closing answer?*

If yes to all three — it's one sub-topic, one page. If the answer to #1 is "no", split it into two sub-topics, two pages. If the answer to #2 is "no", you are mixing two sub-topics — separate them.

### Examples (right vs wrong)

| ❌ Wrong | ✅ Right |
|---|---|
| Page 13 introduces $y = ax + b$ and starts solving Example 11; Page 14 finishes Example 11 and starts Exercise Set 2.5 | Page 13: Finding $a, b$ from two points — full method + Example 11 + 2 more worked examples + quiz. Page 14: Practice on Exercise Set 2.5 — its own sub-topic, its own quiz. |
| A page on growth/decay covers Q1, Q2, Q3 (i) and stops. Q3 (ii), (iii) and Q4 spill onto the next page. | Either the next page covers Q3 (ii)+(iii)+Q4 as one cohesive sub-topic ("Population tables & telecom decay") with its own quiz, or Q3 fits entirely on the previous page. Never split one NCERT question across pages. |

---

## 4E. Simulation Reuse — Prefer Existing Components

Building a new simulation component is expensive and adds maintenance surface. **Default to reusing existing simulations.**

### The Rule

1. **Before proposing a new simulation, scan `components/books/renderer/blocks/simulations/` for an existing component that can be repurposed** — even loosely. A "linear pattern explorer" can serve "linear relationship builder" duties; a "Cartesian plotter" can serve "line graphing" duties; a "growth-decay visualizer" can serve any constant-step decay problem.
2. **If an existing sim is a 70% fit, reuse it.** Cite the topic that contextualises it on the page (in the simulation block's `title` field) — the same component can headline different lessons.
3. **Build a new simulation only if** the existing library has *nothing* that demonstrates the core mechanic the page is teaching, AND the page would be substantively weaker without an interactive element.
4. **A page does not need a simulation** if no existing sim fits and a new one is not strictly necessary. A strong worked example + reasoning prompt + quiz is sufficient.

When in doubt, reuse — and lean on the page's text and worked examples to carry the conceptual load.

### Science simulation catalogue — built, registered, mostly UNUSED (finding 2026-06-06)

A book-wide scan found a large library of physics/chemistry sims already registered in `packages/book-renderer/blocks/SimulationBlockRenderer.tsx` (and built in `…/blocks/simulations/`) that are placed on **zero** pages. **Before building anything, check the registry and wire an existing one in.** Physics components seen unused include: `ForceBalanceSim` (`force-balance`), `FrictionExplorerSim` (`friction-explorer`), `FreeFallSim`, `CircularMotionSim` (`circular-motion`), `GravitationalForceSim`, `EnergyConservationSim`, `EquationsOfMotionSim`, `DistanceDisplacementSim`. The renderer is the source of truth for each `simulation_id` — confirm there before placing a `simulation` block.

**New 2026-06-07: `newtons-motion-lab` (`NewtonsMotionLab.tsx`)** — a real-time motion lab on Ch6 `balanced-and-unbalanced-forces`. Set a net force + mass, press Play, and *watch* the object accelerate: the cart moves on a scrolling track while a live **velocity–time graph** draws itself and a state-aware insight line explains what's happening. It targets the deepest misconception a static figure cannot fix — that a force gives *speed* (it gives *acceleration*) — plus the counterintuitive Newton's-first-law "coast forever" case (force off + friction off → constant velocity). Presets: Steady push · Let go (coast) · Friction stop · Heavy load. **This is the standard a science sim should meet** (see below); it replaced an earlier slider-only "free-body" game that the founder flagged as too basic/common-sense.

> **Sim design lesson (2026-06-07):** don't build "common sense in action" (e.g. "push harder than friction → it moves"). Build sims that show what a textbook image *can't* — change over **time**, an emergent graph, or a counterintuitive outcome. Use the `dynamic(..., { ssr:false })` registration; drive animation with `setInterval` + real-elapsed `dt` (not bare `requestAnimationFrame`) so the physics is time-correct and keeps advancing if the tab is briefly backgrounded. **Verify in the preview before reporting done** — note that the preview tab is `visibilityState:hidden`, which *pauses* `requestAnimationFrame` entirely (0 frames) and throttles `setInterval`, so confirm motion via DOM polling of the live readouts and a deterministic Node test of the physics, not just a screenshot.
>
> **🚨 LABEL OVERLAP RULE — mandatory, founder-flagged recurring issue.** Physics sims keep shipping with text labels overlapping each other, the moving object, or arrows. **Default rule: put NO text labels on the SVG animation canvas at all** — except a single short label on the central object (e.g. `4 kg`). Force arrows draw from the **object's edge** outward in their colour, and every name + numeric value lives in a **colour-keyed legend BELOW the canvas**. This way arrows can shrink to 0 px (small force) or grow off-screen (clamped) without any label ever colliding.
>
> **Mandatory pre-ship check — run in the preview and report the result:**
>
> ```js
> // Programmatic overlap test — paste into preview_eval.
> (() => {
>   const svg = [...document.querySelectorAll('svg')].find(s => /\bkg\b/.test(s.textContent || ''));
>   if (!svg) return { ok: false, reason: 'sim canvas not found' };
>   const texts = [...svg.querySelectorAll('text')];
>   const cart = texts.find(t => /kg$/.test(t.textContent || ''));
>   const others = texts.filter(t => t !== cart);
>   const overlap = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
>   const collisions = others.flatMap((t, i) =>
>     others.slice(i + 1).filter(u => overlap(t.getBoundingClientRect(), u.getBoundingClientRect())).map(u => `${t.textContent} / ${u.textContent}`)
>   );
>   const cartCollisions = cart ? others.filter(t => overlap(cart.getBoundingClientRect(), t.getBoundingClientRect())).map(t => t.textContent) : [];
>   return { ok: collisions.length === 0 && cartCollisions.length === 0, canvasTextCount: texts.length, collisions, cartCollisions };
> })()
> ```
>
> Run this at **rest state, mid-animation, and small/extreme parameter values** (where arrows shrink or grow). The expected pass is `{ ok: true, canvasTextCount: 1, ... }` — exactly one text label (the object's mass/name), zero collisions. **Do not report a sim "done" until this prints `ok: true` and a screenshot confirms it.**

### Gamification patterns for science (prefer these to plain text)

Three engagement patterns need **no new components** — only authoring:
1. **`simulation` + `prediction`** — make a sim pose a predict-then-reveal question first (see §4B "simulation prediction"). Turns a passive widget into a problem.
2. **`classify_exercise` (sorting game)** — drag/label items into categories. Unused in science but ideal for: contact vs non-contact forces, balanced vs unbalanced, physical vs chemical change, element / compound / mixture, conductor vs insulator.
3. **`apply_express`** on the Practice & Mastery page — `fill_blank` (with tap-to-choose `choices`), `unscramble` (order a law/derivation), `sentence_compose`. See §4F.2.

---

## 4F. Chapter-End Practice & Mastery (Science) — the graded question bank

> Added 2026-06-06. Science chapters had **no** end-of-chapter bank before this; §4F is the science counterpart of the English workflow's §4.15. Every Class 9 & 10 science chapter ends with a **Practice & Mastery** page (tag `science_section:practice`), rendered by the shared `PracticeHub`: a `chapter_practice` adaptive bank plus an optional `apply_express` set. The `chapter_practice` / `apply_express` blocks and the adaptive selector are book-agnostic — the same infrastructure English uses.

**This page is the surface a parent or a top-school teacher judges the book by.** It must be impossible to pass without having read the chapter, and impossible to game by option-elimination (§3.6.1). The rules below are mandatory, not aspirational.

### 4F.1 The bank — `chapter_practice`

| # | Rule | Threshold |
|---|---|---|
| 1 | **Bank size** | 24–28 questions (target 26) |
| 2 | **Concept coverage** | use the science `concept_tag`s — `recall`, `concept`, `application`, `numerical`, `reasoning`. All five present; each ≥ 4. A low-maths chapter may shift weight off `numerical`, but `numerical` ≥ 2. |
| 3 | **Difficulty spread** | levels 1–5 all present; no single level > 50% of the bank |
| 4 | **Answer-position balance** | key spread across A/B/C/D; **no position > 40%**, none ever 0% |
| 5 | **Length tell** | key uniquely longest in ≤ 40%; **zero** questions where the key > 1.3× the next-longest option |
| 6 | **Option hygiene** | exactly 4 options; no duplicate/near-duplicate texts; `correct_index` in range |
| 7 | **Option design** | every question obeys **§3.6.1** (qualitative — the author's job, not the validator's) |
| 8 | **Guess-resistance** | ≥ 40% of questions need a specific fact / number / law / worked result from *this* chapter, not general common sense |
| 9 | **Grounding** | every question, key, and premise traces to the actual chapter text — definitions, activities, worked Examples, and the end-of-chapter exercises. Never invent a number or scenario the chapter doesn't support. |

**Mining order:** the end-of-chapter exercises (e.g. "Revise, Reflect, Refine"), the worked **Examples**, and the **Pause and Ponder** items are the richest, already-curriculum-aligned source — adapt those first, then fill gaps from the section text. **id convention:** `ch<N>-pr-01`, `ch<N>-pr-02`, …

### 4F.2 Productive practice — `apply_express` (optional but encouraged)

A small set (~8–12) of non-MCQ challenges for active recall. The useful kinds from the shared engine for science:
- `fill_blank` — a law statement or formula with one blank; add a `choices: [...]` chip array so the reader **taps** instead of typing (kills spelling false-negatives, mobile-friendly).
- `unscramble` — reorder tokens into a correct statement (e.g. Newton's first law) or the ordered steps of a short derivation.
- `sentence_compose` — "In one line, explain why a rocket lifts off" with a `rubric` + `model_answer`.

Use `variant: 'apply'`. The grammar kinds (`transform` / `spot_error` / `form_select`) are English-only.

### 4F.3 Build → balance → validate

Author `scripts/science-practice/_ch<N>_practice.json`, then run **in this order**:

```bash
node scripts/science-practice/balance_positions.js <N> --write   # spread the key across A/B/C/D
node scripts/science-practice/practice_build.js <N>              # build the Practice page (idempotent, 1 doc)
node scripts/science-practice/practice_validate.js <N>          # MUST print PASS before the chapter ships
```

- `balance_positions.js` reorders options only (never changes text) and is deterministic + idempotent. **Before running it, confirm explanations reference option *content*, not a letter** — reordering would break "option B" references.
- `practice_validate.js` is the **mechanical floor** (rules 1–6 above). Passing it does **not** excuse the qualitative rules (7–9) — those are the author's responsibility, every question.

---

## 5. Tone & Style Guide

### Voice
- **Second person:** "When you heat this mixture…", "You've probably seen…", "Think about…"
- **Conversational but accurate:** Explain like a smart tutor, not a textbook
- **Analogy first:** Always lead with a real-world analogy before the technical definition
- **No fluff:** Every sentence earns its place. Cut anything that doesn't add understanding.

### 5.V — The Founder's Voice (teacher-voice system, 2026-06-12) — MANDATORY for chemistry pages

The "smart tutor" above is not a generic tutor — it is **Paaras sir**, and his voice is now
documented from his own lecture transcripts. Founder decision: Live Books pages and Crucible
solutions must be **in sync with his video lectures** — a student who watches the lecture and
then reads the page should hear the same teacher.

Before writing or rewriting ANY chemistry book page:

1. **Read [`_agents/voice/teacher-voice-profile.md`](../voice/teacher-voice-profile.md)** —
   his teaching DNA: the self-dialogue engine (voice the student's doubt as *"sir, ...?"*
   and answer it), analogy-at-the-confusion-point placement, trap-dramatization, rationed
   memorization ("derive what's derivable, ratta only the high-leverage constants"), honest
   difficulty calibration, NCERT doctrine ("read NCERT like chemistry, not history").
2. **Read the chapter's `_agents/voice/<PREFIX>-exemplars.md` if it exists** — and **use HIS
   actual analogies for the concepts on the page** (the namkeen packet for quantization, the
   ₹500/₹300-book for work function, the khargosh stairs for energy levels...). Never invent
   a new analogy for a concept he already has one for — that breaks lecture↔book sync.
3. **Anti-parody guardrails apply** (profile §2): moves over tics, no fabricated quotes or
   classroom memories, no session signoffs in page text. Page register stays the workflow's
   simple English / Hinglish rules (§12) — the voice transfers as *moves*, not transliteration.
4. If the chapter's exemplar file doesn't exist yet, apply the profile alone and flag the
   chapter in `_agents/workflows/TEACHER_VOICE_SYSTEM.md` (the distillation queue).
5. **NCERT grounding (if `_agents/ncert/chemistry/<PREFIX>-ncert.md` exists).** Use it as the
   citable source of NCERT's exact wording, values, and section/page numbers — faster and more
   reliable than re-extracting from source images, and it flags which lines examiners reuse
   ("question hooks"). Still **rephrase in simpler English** (§ "What NOT to do" — never copy
   NCERT prose verbatim); the index is for grounding + accurate values, not for lifting text.
   It also makes the per-page "NCERT §x.y alignment" cross-reference (noted as a future option
   in §1.x) trivial to populate. See `_agents/ncert/NCERT_INDEX.md`.

### Bold text
- Bold key terms on **first use only**
- Bold important numbers or thresholds
- Bold "wrong" vs "right" distinctions in exam_tip callouts

### Lists
- Use **numbered lists** for processes that have a fixed order
- Use **bullet lists** for properties, conditions, or items without a fixed order
- Keep list items concise — one idea per bullet

### What NOT to do
- ❌ Don't start with "In this section, we will learn..."
- ❌ Don't copy NCERT prose verbatim — rephrase in simpler English
- ❌ Don't use passive voice ("It is observed that...") — use active ("You observe...")
- ❌ Don't add LaTeX for things that don't need it — `25°C` not `$25°C$`
- ❌ Don't add emoji to body text — only in image captions
- ❌ Don't fabricate NCERT content — if unsure, write NEEDS_REVIEW

---

### 5.X — Sounds Like a Teacher, Not Like ChatGPT

Real student feedback on early Class 11 pages flagged passages that "felt written by AI". The patterns below are the named tells reviewers spotted. **Every text block must pass these checks before publish.**

#### Banned patterns

| Pattern | Example caught | Why it's banned | Fix |
|---|---|---|---|
| **"Not X. It was Y." emphasis pair** | "This wasn't early curiosity. It was already chemistry." | Parallel construction for forced drama. The previous paragraph already made the point — the pair is editorial padding. | Delete the pair. If sentence N+1 is genuinely needed for clarity, fold it into sentence N. |
| **Intensifier adverbs** | "by chemistry alone", "fully and literally", "in any dismissive sense", "purely chemistry", "exactly the same" | Adverb-stacking to defend a claim against a strawman objection nobody raised. | Delete the adverb. The verb already carries the meaning. |
| **Triple repetition for rhythm** | "*specific* molecules released in *specific* amounts by *specific* organs" / "the things you can touch / things you can't" | Three uses of the same word for drama. Sounds rehearsed. | Pick one use. Vary the others or cut them. |
| **"The secret / the truth is" reveal framing** | "This is the secret chemistry tells you when you open a textbook for the first time" | TED-talk reveal voice. A teacher states facts; they don't unveil them. | Drop the reveal phrasing. State the fact directly. |
| **Internal contradiction within the same callout / paragraph** | "India was doing chemistry before there was a word for it" → next sentence cites the Sanskrit word *Rasāyana* | Each sentence written in isolation; nobody reread N+1 against N. | Read your paragraph end-to-end before committing. If sentence N+1 contradicts N, one of them is wrong. |
| **Universal "you" / "every" assumption** | "The blanket you pushed off this morning — a synthetic polymer engineered to…" (half the readers have wool/cotton) | Treats one possibility as universal; readers who don't fit silently disengage. | Hedge: "If your blanket's synthetic…" / "Many of the things around you…" / "Some of you…" |
| **Example that doesn't demonstrate the claim** | Claim: "chemistry is a layer of reality you don't notice." Example: alarm-clock sound (acoustics, not chemistry — the LCD glow IS the visible chemistry but got skipped) | AI pattern-matches on theme keywords ("alarm clock = morning routine") rather than on the actual concept lock. | Re-read the claim. Pick the example that demonstrates *that exact* concept, not a tangentially related one. |
| **Em-dash rhythm — heavy use of em-dashes — for dramatic pauses — overused throughout** | "every one of them traces back to specific molecules — released in specific amounts — by specific organs — in your body" | AI overuses em-dashes. A teacher uses periods. | **Cap at one em-dash per paragraph.** If you've got two, the second is rephrasable as a comma, a period, or a parenthetical. |

#### Friendly-teacher tone — what TO do

- **Say it once.** If you've made the point clearly, stop. Trust the reader.
- **Concrete > abstract.** "Serotonin, dopamine, cortisol" beats "specific molecules". Naming things beats describing categories of things.
- **Plain construction.** Subject-verb-object. Lists with commas. Stop trying to land emotional beats.
- **The teacher's "you" is permissive, not declarative.** "If you've ever…" instead of "you've all…". "Some of you may have…" instead of "every one of you has…".
- **A line that sounds beautiful out loud is suspect.** AI writes for ear-rhythm. Re-read silently for *meaning*. If the line is mostly cadence, cut it.

#### Voice-audit checklist — run before every page publish

Read each text block aloud and tick:

- [ ] No "not X. It is Y." parallel pairs
- [ ] No intensifier adverbs (alone, fully, literally, exactly, purely, completely)
- [ ] No word repeated 3× in 2 sentences
- [ ] No "the secret is / the truth is / what most people don't realise" reveal phrasing
- [ ] Sentence N+1 doesn't contradict sentence N (re-read paragraph end-to-end)
- [ ] No universal "you" / "every" / "the X you used" that won't apply to ~half the readers
- [ ] Every illustrative example demonstrates the *exact* claim it's attached to
- [ ] ≤ 1 em-dash per paragraph
- [ ] Specific nouns (serotonin, dopamine) beat category-words (molecules, neurotransmitters)
- [ ] Out loud, the prose sounds like a teacher explaining, not a TED talk performing

---

## 6. LaTeX Rules (Book Page Context)

The renderer uses **KaTeX** with **mhchem** extension loaded. Both `$...$` (inline) and `$$...$$` (display/block) are supported. `\ce{}` works for chemical formulas.

### 6.1 Correct delimiters

| Use case | Correct | Wrong |
|---|---|---|
| Inline math in text | `$x = 5$` | bare `x = 5` |
| Display (centred) equation | `$$\frac{a}{b}$$` | do not use display for simple inline values |
| Chemical formula | `$\ce{H2SO4}$` | `H₂SO₄` (unicode) or `$H_2SO_4$` |
| Fraction | `$\frac{a}{b}$` | `$\dfrac{a}{b}$` — causes oversized render |
| Greek letters | `$\alpha$`, `$\Delta$` | `α`, `Δ` (unicode outside `$`) |
| Reaction arrow | `$\rightarrow$` | `→` (unicode outside `$`) |
| Equilibrium arrow | `$\rightleftharpoons$` | `⇌` |
| Superscript ion | `$\ce{Fe^{2+}}$` | `Fe²⁺` |
| Subscript in formula | `$\ce{CuSO4.5H2O}$` | `CuSO₄·5H₂O` |
| Reaction equation | `$\ce{A + B -> C + D}$` | raw text |

### 6.2 mhchem `\ce{}` syntax (use this for all chemistry)

```
$\ce{H2SO4}$           → H₂SO₄
$\ce{Fe^{2+}}$         → Fe²⁺
$\ce{CuSO4.5H2O}$      → CuSO₄·5H₂O
$\ce{Na + C + N -> NaCN}$    → reaction with arrow
$\ce{2Na + S ->[\Delta] Na2S}$  → with heat symbol above arrow
$\ce{CO2 + Ca(OH)2 -> CaCO3 v + H2O}$  → with precipitate arrow
$\ce{[Fe(CN)6]^{4-}}$  → complex ion
```

### 6.3 JSON string escaping

In JavaScript string literals (single or double quoted), one backslash = `\\`:
```js
// In JS string:  "$\\ce{H2O}$"   →  stored in DB as:  "$\ce{H2O}$"  ✓
// In JS string:  "$\\frac{a}{b}$"  →  stored in DB as:  "$\frac{a}{b}$"  ✓
```

**Rule:** Always use `\\` before every LaTeX command in JavaScript strings.
- `"$\\ce{H2SO4}$"` ✓
- `"$\\frac{12}{44}$"` ✓
- `"$\\Delta H$"` ✓
- `"$\\text{CO}_2$"` ✓

**Display equations in text blocks** — put `$$...$$` on its own line inside the markdown string:
```js
markdown: 'Formula:\n\n$$\\frac{12 \\times m_2}{44 \\times m} \\times 100$$\n\nwhere...'
```

### 6.4 DO NOT use unicode chemistry outside math
```
❌  "water is H₂O"          →  use "water is $\\ce{H2O}$"
❌  "ΔH = -286 kJ"          →  use "$\\Delta H = -286$ kJ"
❌  "Fe²⁺ ions"             →  use "$\\ce{Fe^{2+}}$ ions"
❌  "CO₂ is absorbed"       →  use "$\\ce{CO2}$ is absorbed"
```

### 6.5 What NOT to do
- ❌ `\dfrac` — oversized rendering, use `\frac`
- ❌ Using `\text{CO}_2` instead of `\ce{CO2}` — mhchem is available, always use `\ce{}`
- ❌ Nested `$` delimiters — every `$` must be paired
- ❌ Missing backslash-escape in JS strings — `"\ce{H2O}"` is wrong, `"\\ce{H2O}"` is right

---

## 7. Worked Examples — Extraction Rules

When the source PDF contains a "Problem X.XX" with a "Solution":

1. Extract problem statement verbatim (clean up OCR artefacts)
2. Format solution as markdown steps: `**Step 1:** ...`, `**Step 2:** ...`
3. Final answer on its own line: `**Answer:** value with units`
4. Use `label: "Problem 12.XX"` matching the NCERT numbering
5. Place the `worked_example` block immediately after the concept it illustrates

---

## 8. Qualitative Analysis Pages — Special Pattern

For Lassaigne's test and element detection pages, use this additional block types:
- `table` block for test summary (element → reagent → positive result)
- `callout[remember]` for the sodium fusion reactions

---

## 9. Quantitative Estimation Pages — Special Pattern

For pages covering carbon/hydrogen/nitrogen/halogen estimation:
- Lead with what is being measured and why
- Show the formula as a `latex_block` OR inside a `text` block
- `worked_example` block for each NCERT Problem in the section
- `comparison_card` to compare two methods (e.g. Dumas vs Kjeldahl)
- `exam_tip` must include: formula, what each symbol means, and typical exam calculation trap

---

## 10. Page Inventory — Practical Organic Chemistry Chapter

| # | Slug | Title | Source Section | Status |
|---|------|--------|----------------|--------|
| 1 | sublimation | Sublimation | 12.8.1 | ✅ Done |
| 2 | crystallisation | Crystallisation | 12.8.2 | ✅ Done |
| 3 | distillation-basics | Distillation | 12.8.3 | ✅ Done |
| 4 | fractional-distillation | Fractional Distillation | 12.8.3 | ✅ Done |
| 5 | distillation-special-techniques | Special Distillation Techniques | 12.8.3 | ✅ Done |
| 6 | differential-extraction | Differential Extraction | 12.8.4 | ✅ Done |
| 7 | chromatography | Chromatography | 12.8.5 | ⬜ Next |
| 8 | qualitative-analysis | Qualitative Analysis | 12.9–12.9.2 | ⬜ |
| 9 | quantitative-ch | Estimation of C & H | 12.10.1 | ⬜ |
| 10 | quantitative-nitrogen | Estimation of Nitrogen | 12.10.2 | ⬜ |
| 11 | quantitative-halogens-sulphur | Estimation of Halogens & Sulphur | 12.10.3–12.10.4 | ⬜ |
| 12 | quantitative-phosphorus-oxygen | Estimation of P & O | 12.10.5–12.10.6 | ⬜ |

---

## 11. Anti-Hallucination Rule

> Before writing any chemistry content, quote the exact NCERT source text (or confirm from PDF extraction) for every factual claim. If you cannot verify a fact from the source, write `NEEDS_REVIEW: [reason]`.
>
> Never invent reactions, test results, reagent names, or numerical values. All chemistry must come from the source PDF or verified NCERT Class 11 Chemistry content.

---

## 12. Hinglish Authoring — All Live Books (Class 9–12)

**Every Live Book page — across Class 9, 10, 11 and 12 — ships with a parallel `hinglish_blocks` array** so the student can toggle between English and Hinglish. The shared goal is the same in every class: a North Indian student (Himachal / Uttarakhand / Punjab belt) in an English-medium school who doesn't fully follow academic English should be able to flip the page into the way a teacher would actually explain it out loud, and grasp it fast.

The **voice is the same across all classes** — a friendly North-Indian classroom teacher, casual (never formal/literary Hindi), explaining to students in front of them. What changes between tracks is only the imagined teacher's level and the source material:

| Track | Classes | Reader | Imagined teacher |
|---|---|---|---|
| **NCERT "Exploration" — Vedic Fusion** | 9 & 10 | First time meeting secondary science; easily lost in academic English | A Class 9 Science teacher (e.g. Sharma sir, Dehradun) — scene-building, wonder-first |
| **JEE/NEET Prep** | 11 & 12 | Preparing for JEE/NEET; smart, busy, slightly intimidated | A JEE/NEET coaching teacher — warm but efficient, gets to the point, still talks like a person |

Both use the **same register** (§12.2): second-person *tum*, technical/common words stay English, Hindi carries the rhythm and emotional connective tissue. Class 11–12 pages do **not** carry Vedic verse openers, so §12.8 (Gita shlok) applies only to the Class 9 & 10 Vedic-Fusion track — everything else in this section applies to all classes.

**What gets a Hinglish version:** only `text`-type blocks. Everything else (`heading`, `callout`, `image`, `worked_example`, `inline_quiz`, `timeline`, `table`, `comparison_card`, `simulation`, `reasoning_prompt`) renders in English in both modes.

### 12.1 The Core Rule — Re-explain, Do Not Translate

This is the most important rule in this section. Read it twice.

> **Close the English version mentally. Read it once for the concept only. Then re-explain that concept from scratch as a Hindi-medium teacher would — in your own sentence structure, your own rhythm, your own idioms.**

Translation keeps English clause structure, em-dash placement, and rhetorical patterns while swapping words. The result is Hinglish that *sounds like translated English*, not like a teacher actually talking. That is the failure mode to avoid.

Signs you've slipped into translation mode:
- Your Hinglish sentence has the same number of clauses, in the same order, as the English.
- You used an em-dash in the exact spot the English did.
- You translated a word literally when a well-known Hindi idiom would land better.
- Your closing line is a word-for-word mirror of the English closing line.

Signs you're re-explaining:
- Your Hinglish has more short sentences than the English did.
- You used idioms (*ratta maarna*, *dimaag lagao*) the English didn't contain.
- You reordered — started the paragraph with a different sentence than the English did, because Hindi rhythm wants it that way.
- A Hindi reader would read it and think "yes, this is how my teacher would say it," not "this is translated from English."

### 12.2 Voice — Pick One Teacher and Stay There

Imagine a single specific teacher and let every Hinglish block on a page come from that one voice. Match the teacher to the track:
- **Class 9 & 10:** a Sharma sir, 40, teaches Science to a Class 9 section in Dehradun, explains things with scene-building and the occasional *zara socho*.
- **Class 11 & 12 (JEE/NEET):** a coaching teacher who's seen a thousand students panic before mains — warm, efficient, cuts to the insight, but still talks like a person in the room, not a textbook. Less scene-building, more "*dekho, yeh cheez actually simple hai*" and "*yahaan students phaste hain*".

Either way, it is one consistent voice across the whole page.

**Do not oscillate** between:
- Formal literary Hindi (*vigyan ek prakriya hai*) and casual chat (*science basically ek process hai*) within the same page
- Second-person affectionate (*tum*) and lecturer-mode (*aap*)
- English-heavy (*scientists ne observe kiya*) and Hindi-heavy (*vaigyanikon ne avlokan kiya*) within the same paragraph

Pick the register and hold it across the whole page. The default register for this book:
- Second person **tum** (never aap, never tu)
- **Keep in English every word the student already understands — not just technical terms, but everyday words too.** This covers (a) all scientific/technical vocabulary (*scientist, theory, experiment, atom, electron, reaction, battery, hypothesis, result*) **and** (b) ordinary content words a tier-2/3 English-medium student knows at a glance: **metal & material names** (*iron, copper, zinc* — never *loha / taamba*), **everyday objects** (*phone, car, aeroplane, window* — never *hawai jahaz / khidki*), **plain adjectives** (*slow, fast, cheap, clean, quiet, dirty, thin, tiny* — never *dheema*), **common places/nouns** (*city, street, road, sky, air, smoke*), and **simple numbers, fractions & ordinals** (*one-fourth, half, double, third* — never *chauthai / aadha / dugna / teesra*). Swapping these into Hindi makes the page read like a translation, not a teacher talking. The per-word test: *would the student already understand this English word at a glance?* If yes, leave it in English.
- **Hindi does exactly three jobs — never swapping an easy word:** (1) the **connective glue and teacher rhythm** (*dekho, yani, zara, iska hal hai, jaan lo, matlab, chupke-chupke*); (2) **action & feeling verbs and idioms** (*badal deti hai, khaa jaati hai, ruk ke poochha, baith gaya, samajh aa gayi*, plus the §12.4 idioms); and (3) **re-saying a genuinely hard or abstract *non-scientific* English word** in simpler terms (*harnessed, restless, pitched as, one-stop, routinely*). If a word fails the test above, simplify it — otherwise keep it English.
- Sanskrit-origin Hindi only when the concept demands it: *dharma, gyaan-parampara, prakriti, parmanu* — and only with a short gloss if it's technical

### 12.3 Subheadings Stay in English

Bold subheadings inside a text block — anything written as `**Title.**` at the start of a section — are **kept in the original English**, exactly as written, even in Hinglish mode. They render in the accent colour and serve as visual anchors; a Hinglish version would be inconsistent across pages and loses the visual rhythm.

Only the prose paragraphs under each subheading are rewritten in Hinglish.

Example from page 1:
```
**The battlefield was silent.**        ← stays in English

Zara scene dekho. Kurukshetra ka       ← prose is Hinglish
maidan. Do foujein aamne-saamne...
```

### 12.4 Cultural Idiom Library

Use these instead of their direct translations. They land as "the way a teacher actually talks."

| Concept | Use this | Not this |
|---|---|---|
| Memorise / rote-learn | **ratta maarna** | yaad karna |
| Think hard / apply your mind | **dimaag lagao** | socho |
| Consider for a second | **zara socho** | ek minute socho |
| Straight up / honestly | **seedhi baat** | sachchi baat |
| Just this much / that's it | **bas itni si baat hai** | yeh hi baat hai |
| Got it? / Does it click? | **samajh aaya?** | samjhe? |
| Stick with it / hold on to it | **tike rehna / ade rehna** | rahna / ruka rehna |
| Quick dismissal | **"chhodo, pata nahi"** | "mujhe nahi maloom" |
| Pretending to know | **drama kar leta** | dikhawa karta |
| Scene-set opener | **zara scene dekho** | dekhiye / imagine karo |
| First stirring / opening | **pehli aahat** | shuruaat |
| A quick easy answer | **jhatpat-sa jawaab** | turant uttar |
| Nothing special about it | **isme kya baat hai** | koi baat nahi |

Add to this list as patterns repeat. Don't force an idiom where it doesn't fit — but when a concept has one of these natural Hinglish forms, use it. **These idioms are *connective* phrasing — they carry rhythm, not content. Use them to glue and pace sentences, never as an excuse to translate an everyday English content word that the student already knows (see §12.2).**

### 12.5 Preserve the Conceptually Important Phrases

Some English phrases carry the actual point of the paragraph. If you drop them, the paragraph becomes a summary instead of an explanation. Before you finalise a Hinglish paragraph, check:

1. **What's the one thing this paragraph teaches?**
2. **Is that thing still explicit in my Hinglish version, or did I compress it away?**

Example from page 1, Marie Curie sentence:

> **English:** "Marie Curie asked *'what is this strange radiation?'* **rather than setting it aside as unexplained.**"

The bold half is the whole lesson — the *courage to not move on*. A translated version that said *"Marie Curie ne poochha 'yeh strange radiation kya hai?' aur matter ki samajh badal di"* would lose it.

Correct version:
> *"Marie Curie ne ek ajeeb sa radiation dekha. Usko 'pata nahi kya hai, chhodo' bol ke aage nahi badhi. Usne poochha 'yeh hai kya cheez?' — aur matter ki poori samajh hi badal di."*

The *"chhodo, pata nahi bol ke aage nahi badhi"* line is how you carry the concept into Hinglish rhythm.

### 12.6 Closing Lines — Engineer for Hinglish Rhythm

The last line of a block lands hardest. Do not translate it; design it separately.

- English closing lines lean on parallel structure: *"You are not here to memorise the answers. You are here to learn how to ask."*
- Hinglish closing lines lean on clipped rhythm and a small emotional turn: *"Tum yahaan facts ratta maarne nahi aaye ho. Tum yahaan seekhne aaye ho ki sawaal kaise poochha jaata hai."*

A good closing line test: read your closing Hinglish sentence aloud. If it sounds like a textbook paraphrase, rewrite. If it sounds like how a teacher ends a thought before moving on, keep it.

### 12.7 Sentence Structure — De-mirror the English

- **Break long English compound sentences into two or three short Hindi sentences.** Hindi rhythm prefers short. "When Newton asked why the apple falls rather than simply accepting it does, he was doing what Arjuna did." → four short sentences in Hinglish.
- **Use em-dashes sparingly.** English prose uses them for pace; Hindi prose uses commas and fresh sentences.
- **Vary openers.** If the English paragraph opens with a noun phrase, try opening the Hinglish with a verb or a scene-set: *"Zara scene dekho..."*, *"Duniya ke jitne bhi bade thinkers..."*, *"Arjuna ko ladna aata tha."*
- **Preserve italic emphasis** — when English uses `*italic*` for a quoted thought or question, keep it italic in the Hinglish too.

### 12.8 Gita Shlok — Three-Part Format (Class 9 & 10 Vedic-Fusion track only)

> Applies only to the Class 9 & 10 Vedic-Fusion track. Class 11–12 JEE/NEET pages do not open with verse callouts, so skip this subsection for them.

When a page opens with a `fun_fact` callout containing a Gita verse (or any verse from Indian knowledge tradition), the markdown must have **three parts in this order**:

```
Sanskrit verse (Devanagari, italic)

Hindi rendering in Devanagari — simpler, conversational words a 9th grader
actually uses. Not literary Hindi. Not Sanskritised. If the Sanskrit word
has an everyday Hindi equivalent, use it.

English translation — a tight 1–2 sentence rendering focused on the idea,
not a word-for-word equivalent.
```

This block is the same in English and Hinglish mode — callouts do not get Hinglish versions. The Hindi line is written once, carefully, for the 9th grader reader.

Bad Hindi line (too literary):
> *"Yogasthaḥ kuru karmāṇi — yoga mein sthit hokar samatā-bhāv se karma karo."*

Good Hindi line (everyday words):
> *"Kaam mann laga ke karo, par result ki chinta chhod do — yahi yoga hai."*

### 12.9 Authoring Checklist — Run Before Saving

Before committing a Hinglish block, check every item:

- [ ] Same `id` as the English TextBlock (renderer matches on id)
- [ ] `type: "text"` and same `order` as the English block
- [ ] Every `**bold subheading**` is identical to the English — not translated
- [ ] Inline LaTeX / `\ce{}` formulas preserved exactly
- [ ] Italic quotes (`*...*`) preserved where they appear in English
- [ ] I closed the English mentally and re-explained, not substituted words
- [ ] Voice is one consistent teacher across the whole page
- [ ] **Every everyday word the student already knows is in English** — metal/material names, everyday objects, plain adjectives, common places — Hindi is only glue, verbs/idioms, and genuinely hard non-scientific words (§12.2)
- [ ] Cultural idioms from §12.4 appear where they land **naturally** — not forced into every paragraph
- [ ] The conceptually important phrase (§12.5) is still explicit, not compressed away
- [ ] Closing line is engineered, not translated
- [ ] Read aloud — sounds like a teacher, not a translated textbook

### 12.10 Reference Implementations

Open the page that matches your track and read the Hinglish alongside the English to calibrate:

- **Class 9 & 10 (Vedic-Fusion voice):** page 1 of Chapter 0 of Class 9 Science — `what-is-science`. Both text blocks (`0e4f59ae-…` and `22fd127d-…`) are the proof-of-concept.
- **Class 11 & 12 (JEE/NEET voice):** Class 11 Chemistry, Ch.1 — `how-chemistry-began` (4 blocks) and `importance-of-chemistry` (6 blocks). These are the calibration set for the coaching-teacher register: *tum*, technical words in English, `**Title.**` openers kept in English.

---

## 13. Vedic Fusion — Class 9 & 10 Only

Every Class 9 and 10 page is a **fusion of two traditions**: NCERT modern science and Indian Vedic wisdom. These are not in opposition — they are complementary. Indian thinkers asked the same deep questions about nature centuries before Western science codified the answers. Our pages make that lineage visible.

The goal is not patriotism. The goal is to make a student from Dehradun or Shimla feel that science is not a foreign subject — it is an extension of a tradition of inquiry they already belong to.

### 13.1 The Opening — Vedic Verse as Block 1

Every Class 9 and 10 page opens with a `callout[fun_fact]` at Block 1 that contains a Vedic verse. This is the page's spiritual and philosophical anchor.

**Sources (in order of preference):**
1. **Bhagavad Gita** — for verses on action, knowledge, observation, duty, impermanence
2. **Upanishads** — for verses on the nature of matter, reality, consciousness, the cosmos
3. **Vedas** (Rigveda, Atharvaveda) — for verses on nature, elements, the sky, the earth
4. **Yoga Sutras of Patanjali** — for verses on mind, focus, discipline, perception
5. **Arthashastra** (Kautilya) — for verses on observation, strategy, empirical thinking
6. **Aryabhatiya** (Aryabhata) or other Indian scientific texts — when the chapter directly connects to math, astronomy, or measurement

**How to pick the right verse:** The verse must connect to the *intellectual virtue* the page is teaching, not just the scientific topic. A page on mixtures is not just about chemistry — it is about discernment (*viveka*). A page on motion is about cause and effect (*karma*). A page on cells is about the interconnectedness of all living things.

**Three-part format (mandatory):**
```
*Sanskrit verse in Devanagari script, italic*

Hindi rendering — simpler, conversational words. Not literary Sanskrit-inflected Hindi.
If the Sanskrit word has an everyday Hindi equivalent, use it. Written for a 9th grader.

English translation — 1–2 tight sentences focused on the idea, not word-for-word.
```

This block is identical in English and Hinglish mode. Callouts do not get Hinglish versions.

**Bad Hindi (too literary):**
> *"Yogasthaḥ kuru karmāṇi — yoga mein sthit hokar samatā-bhāv se karma karo."*

**Good Hindi (everyday words):**
> *"Kaam mann laga ke karo, par result ki chinta chhod do — yahi yoga hai."*

### 13.2 Weaving Vedic Thought into the Body

The verse at Block 1 sets a theme. That theme should echo once or twice in the body text — not as a lecture, but as a quiet reappearance.

**Pattern: Open with the modern observation → draw the ancient parallel → return to the science.**

Example (a page on observation in science):
> "Before Newton named gravity, before Galileo timed falling objects, there was a tradition that watched the world with equal intensity. The Rigveda asks: *ṛtaṁ ca satyaṁ cābhīddhāt* — from truth and cosmic order, the universe was kindled. The question of why things fall, why seasons return, why fire rises — these were never just scientific questions. They were questions about the order underneath everything. Newton and the Vedic seer were asking the same thing in different languages."

This does not need to appear in every text block. Once per page — in the most natural location — is enough. Do not force it.

### 13.3 Indian Scientists in the Body

The `india_science` callout ensures Indian contributions are visible. But Indian scientists should also appear naturally in the body text when they directly contributed to the concept:

- **Aryabhata** — astronomy, zero, place-value system, planetary motion
- **Brahmagupta** — mathematics, gravity (described objects falling toward Earth's centre)
- **Charaka / Sushruta** — biology, medicine, anatomy
- **C.V. Raman** — light scattering, molecular structure
- **Homi Bhabha / Vikram Sarabhai** — atomic energy, space science
- **S. Ramanujan** — mathematics, number theory
- **Meghnad Saha** — stellar physics, ionisation
- **Jagadish Chandra Bose** — plant response, radio waves

Do not manufacture contributions. Only cite an Indian scientist when their work directly connects to the concept on the page.

### 13.4 Moral Values — Emergent, Not Instructional

The Vedic fusion is not a moral education insert. Do not write: "This teaches us that honesty is important in science." The moral value must emerge from the story of science itself.

**Values that emerge naturally from scientific inquiry:**
- **Intellectual humility** — a scientist who admits uncertainty. A wrong hypothesis that led to the right discovery.
- **Patience and persistence** — Marie Curie's years of isolation, Raman's work with simple instruments.
- **Non-attachment to results** (*nishkama karma*) — the scientist who publishes findings that contradict their own earlier work.
- **Respect for the natural world** — chemistry that describes the very matter students and all living things are made of.
- **Curiosity as duty** — the `quest_continues` callout carries this naturally.

The `what_if` callout is the best place for an ethical dimension when the science itself raises one.

### 13.5 Vedic Fusion Checklist — Run Before Saving

- [ ] Block 1 has a `callout[fun_fact]` with a Vedic verse in the three-part format (Sanskrit → Hindi → English)
- [ ] The verse connects to the *intellectual virtue* of the page, not just the topic
- [ ] The Hindi rendering uses everyday words, not literary Sanskrit-inflected Hindi
- [ ] The Vedic theme echoes once in the body (not forced — only where natural)
- [ ] If an Indian scientist directly contributed, they appear in the body text or `india_science` callout
- [ ] No moral value is stated explicitly — it emerges from the story
- [ ] The page does not feel like a religion class — it feels like science with roots

---

## 14. Audience Tier Tagging (`tier` field) — Phase 0

Every block carries an optional `tier` field on `BaseBlock`: `'core' | 'competitive'` (absent = `core`). It marks who the content is for, so the platform can later offer **Core (CBSE/all)** and **Competitive (NEET/JEE)** plans from one book without authoring separate versions. Full rationale: GBrain decision `2026-05-30-livebooks-leveling-and-pricing`.

**Phase 0 = tag only.** The tag is stored and editable in the admin editor (the Core/Comp pill on each block's header), but the reader does **not** filter or lock anything yet. Enforcement (paywall + the Crucible gate) is a later phase that needs the payments system, which does not exist yet.

### Rules for assigning `tier`
- **Default is `core` — leave it off.** ~85–90% of every page is core (the concept, explanations, diagrams, the basic worked examples). Untagged = core = visible to everyone. **Tag only the exceptions.**
- **Set `tier: 'competitive'` on** blocks that only a NEET/JEE aspirant needs and a board student can skip — typically:
  - Harder `worked_example` blocks (multi-concept, exam-trap numericals).
  - A `text`/`heading` pair that forms a competitive-only sub-section (tag the heading **and** its body together so they stay a unit).
  - `exam_tip` callouts that are purely competitive.
  - Whole competitive-only topics (e.g. oleum %-labelling, volume strength) — tag their content blocks competitive.
- **Do NOT tag** the hero image, the opening hook, core definitions, or anything a CBSE student needs for basic understanding.
- **No "advanced" tier.** There are only two values. Genuinely JEE-Advanced-only material is not authored into these books at all (it's pruned in review).
- **Batch scripts** that write directly to Mongo can set `tier` on the block object like any other field (it bypasses the Zod route but the field is in `BaseBlockSchema`, so the admin editor and API both preserve it).

When building a new page, assign `tier` as you write — it is near-zero cost at authoring time and saves a large retroactive pass once the paywall ships.

---

## 15. Experience Standards — the Apple-Books bar (2026-06-10)

> **Why this section exists.** Our inspiration is Apple Books — specifically the *Life on Earth* series — where the *execution* (pacing, imagery, motion, calm chrome) is the product, not an afterthought. A page-by-page editorial review of Class 11 Chemistry Ch.1 found the content and art are strong but the **experience** lagged: ideas repeated in 2–3 formats back-to-back, a 44-block mega-page, image "voids" while assets loaded, media bars breaking the reading rhythm, no chapter on-ramp, and recall only at the very end. This section is the standard that closes that gap. **It applies to every new book and every new page. When it conflicts with an older section here, §15 wins.** Several items below name a `page_type`/field/block that the reader implements in phases — author to the spec even where the renderer is still catching up; the data will be correct when the feature lands.

### 15.1 Chapter opener — every chapter starts with one (auto-generated)

A chapter must never begin cold on page 1. Each chapter opens with a dedicated **chapter-opener page** — a full-bleed cover moment plus a visual map of the journey ahead — whose job is to *motivate the student to tap in*.

- **It is a special page**, `page_type: 'chapter_opener'`, sorted first in the chapter. It is **not** a lesson: it carries no quiz, is **not** quiz-gated, and is not counted in the "N of M complete" progress.
- **Author writes only a little** (the rest is derived):
  - a **full-bleed hero** image (edge-to-edge cover, not boxed in the content column — see §15.6) with `generation_prompt` per §3.4.2;
  - the chapter eyebrow + title (from the chapter record);
  - a **1–2 sentence "why this chapter matters"** intro (the hook for the whole unit);
  - optional **"What you'll master"** — 3–5 outcome bullets.
- **Everything else is auto-derived from the chapter's pages — never hand-maintained:**
  - the **journey**: the ordered list of content pages (title + subtitle), each shown as a step/card;
  - per-page **badges** computed from that page's blocks: number of `simulation`, of `worked_example`, of checks (`inline_quiz` + `reasoning_prompt`);
  - **chapter totals** ("4 simulations · 9 worked examples · 12 checks · ~35 min read") and an estimated time;
  - a **"Start →"** CTA into the first content page.
- **Voice:** inviting, second-person, a promise — "By the end of this chapter you'll count particles you can't see." Not a syllabus dump.

> Implementation: the reader detects `page_type:'chapter_opener'` and renders the bespoke layout, deriving the journey/counts live from the chapter's pages. Authors supply hero + intro (+ optional outcomes) only.

**Authoring recipe (live since 2026-06-10).** Create the opener as a normal `book_pages` doc with:
> - `page_type: 'chapter_opener'`, `page_number: 0`, `published: true`, `slug` like `chapter-1-overview`;
> - `title` = the clean chapter title (no "Ch. N |" prefix — the reader adds the "Chapter N" eyebrow);
> - `subtitle` = the 1–2-sentence "why this chapter matters" intro;
> - `blocks`: **(1)** a full-bleed hero `image` block (`aspect_ratio:'21:9'`, `width:'full'`, `src:''` + a §3.4.2 `generation_prompt`), and **(2)** an optional `text` block whose markdown is a `- bullet` list → rendered as the "What you'll master" outcomes.
> Then **prepend the opener's `_id` to that chapter's `chapters[].page_ids`**. The journey map, per-page badges (sims / worked-examples / checks), totals and reading-time are computed by the route — never authored. Reader files: `ChapterOpener.tsx`, the `/class-11/chemistry/[pageSlug]` route (journey computation), `BookReader.tsx` (detection + opener excluded from progress/sidebar). The opener is reachable at its slug; linking it from the grade/TOC landing is a follow-up.

### 15.2 Per-section objective — orient before you teach

Every major section (`heading[2]` that opens a sub-topic) carries a **one-line objective or driving question** so the reader always knows *why they're here*.

- Representation: the `heading` block gains an optional **`objective`** string, rendered as a muted italic line just under the heading.
- Make it **outcome-based and concrete** — "By the end of this you can convert any length unit in one step" or a driving question "Why does 1 cm³ equal 1 mL but 1 cm doesn't equal 1 mm?" — **never** "In this section we will learn…".
- **Section headings render as a band, automatically.** Level-1 and level-2 headings (the sub-topic openers) draw with a **left accent bar (sky) + a tint that fades to the right**, with the heading (white) and its objective inside — so a new sub-topic is unmistakable instead of blending into the prose below. Level-3 headings stay plain sky text (sub-sub-section). This is the same visual language as the worked-example panels but in **sky** (vs the worked-example **amber**), giving a consistent taxonomy: *blue bar = section heading, amber bar = worked example.* No authoring needed — `HeadingBlockRenderer` applies it by level. (Page titles additionally use a subtle white→warm gradient.)

### 15.3 Active-recall cadence — check mid-page, not just at the end

A page must not save all testing for the closing quiz.

- After **each major concept**, place a quick check **soon after** the text that teaches it: a **`reasoning_prompt`** (predict / spot-the-flaw / why) or a 1–2-question micro `inline_quiz`.
- **Class 11–12 now use the `reasoning_prompt` machinery** (schema in §3.12, placement rules in §4B) that was previously Class-9-only. Same rules: never before the concept; one per concept; placed right after the establishing text.
- Target ≥ 1 mid-page check per ~2 major headings, **plus** the closing quiz. The closing quiz still tests the whole page (§3.6.1 option rules apply everywhere).

### 15.4 Simulations are predict-first — always

Every `simulation` block **must** carry a `prediction` (the predict→reveal gate; the reader already enforces it). **No bare simulators.**

- The prediction targets the **exact misconception** the sim fixes (e.g. "Which is bigger — 1 cm³ or 1 mL?", "A 1 kg and a 10 kg ball are dropped together — which lands first?").
- See §4B "simulation prediction" for the shape and the "only when the outcome is non-obvious" rule.

### 15.5 Media lane — bite-size audio & video live in the rail

Audio notes and videos are **support for the reading, not interruptions to it.**

- Keep them **bite-size and single-idea**: audio ≤ ~3 min, video short; each with a **clear title + duration**.
- **Media stays INLINE at its recorded section position** *and* is **mirrored in the rail's "Watch & Listen" tab** (the **first/left** rail tab; "Exam Insight" — the exam_tip callout — is the right tab). Audio/video are recorded *for specific sections*, so the inline copy is what tells the student "play this here, about this concept"; the rail is the skip-the-text playlist for someone who'd rather watch/listen than read. Both point at the same media.
- Authoring: place each `audio_note`/`video` block in body order at the section it explains; write a descriptive `label`/`caption` + a real duration. The reader handles the rail mirroring automatically.

### 15.6 Image experience — never a void, always zoomable

- **Tap-to-zoom (lightbox) on every image.** Tapping any image opens it full-screen and dims everything else — essential for dense infographics and for **portrait images** that otherwise eat vertical space. Reader-level behavior; no per-block authoring needed.
- **Because every image is tap-to-zoom, display images SMALLER inline to cut scroll.** Don't default every figure to `width:"full"` — use a narrower preset (`two_third`, `half`, `two_fifth`) for diagrams/infographics so the page scrolls less; the student taps for full detail. Reserve full-width for the hero and the rare image that must be read in place. A long vertical run of large images is a scroll tax the lightbox now lets you avoid.
- **Blur-up + aspect-locked skeleton — no black voids.** Always set **`aspect_ratio`** on image blocks so the layout reserves the exact box and the image fades in from a blurred placeholder. An empty rectangle while loading is the single biggest "cheap web page" tell; this kills it.
- **Full-bleed for cover moments.** Chapter-opener heroes (and, sparingly, a chapter's signature image) bleed edge-to-edge beyond the content column. Regular figures stay in-column.
- **`gallery` block for multi-image-per-concept (live since 2026-06-10).** When **one** concept needs **several** images, use a **swipeable `gallery`** instead of stacking them vertically. This is *not* "an image per section" — it's specifically the 2-to-4-images-for-one-idea case (e.g. three apparatus variants, a before/during/after triptych). One tall vertical stack of portrait images is an anti-pattern — gallery it, or rely on tap-to-zoom. **Authoring:** in the admin editor, *Add Block → Media → Gallery (swipe)*; add 2–6 images (upload or URL) each with alt + optional caption, pick one shared frame aspect ratio. Reader shows arrows + dots + counter, each slide tap-to-zoom. Shape: `{type:'gallery', items:[{id,src,alt,caption?}], aspect_ratio?}` (`GalleryBlockRenderer`).

### 15.7 No-redundancy rule — say it once, in its strongest form

Never deliver the **same** concept in two or more formats back-to-back (e.g. body prose **and** a `comparison_card` **and** a full infographic image all covering "physical vs chemical"). Pick the **single strongest** treatment and cut the rest. Repetition for *reinforcement after a gap* is fine; *immediate* re-statement in another widget is padding.

### 15.8 Page-size guardrail — reinforces §4D

One page = one sub-topic, fully closed (§4D). Concretely: **if a page exceeds ~18 blocks OR covers 2+ distinct sub-topics, split it.** A mega-page is a flow failure even when every block is good — it also bloats the right-rail exam box into a wall. Split on the natural concept boundary, give each page its own hook, its own mid-page check(s), and its own closing quiz.

### 15.9 Tappable glossary terms

Key terms (the ones you bold on first use) should be **tappable for an inline definition popover**.

- Mechanism: the page carries a **`glossary: [{ term, definition }]`** array; the reader makes the **first occurrence** of each term tappable. Keep each definition to **1–2 plain sentences** in the page's voice.
- Author by listing the page's load-bearing terms in `glossary` — don't define everything, only the terms a student would genuinely stop on.

### 15.10 Narrative bridge — thread the chapter into a story

End **every** content page with a **one-line hand-off to the next page** ("Next: now that you can measure matter, let's meet the laws it obeys."). This is what turns a stack of pages into a *book*. The bridge is the last thing before the closing quiz (or the quiz's closing note).

### 15.11 Per-page experience checklist — run before POST

- [ ] (Chapter's first page only is the **chapter opener**; lessons don't start cold.)
- [ ] Every `heading[2]` has an `objective` (outcome or driving question, not "we will learn").
- [ ] At least one **mid-page** check (`reasoning_prompt` or micro-quiz) after each major concept — not only the end quiz.
- [ ] Every `simulation` has a `prediction`.
- [ ] Audio/video are bite-size with titles + durations (they'll land in the rail's Watch & Listen tab; body shows a compact chip).
- [ ] Every `image` has `aspect_ratio` set; multi-image-for-one-concept uses a `gallery`; no tall stacks of portrait images.
- [ ] No concept is delivered in 2+ formats back-to-back (§15.7).
- [ ] Page is ≤ ~18 blocks and one sub-topic (§15.8) — otherwise split.
- [ ] Load-bearing terms are listed in `glossary`.
- [ ] Page ends with a one-line bridge to the next page.

---

## 16. Figure / Table / Equation Numbering (2026-06-10)

> **The principle that makes this painless: never hand-type a number into a caption.** Store a stable *key*, let the finaliser assign the *number*, and reference figures by key. Numbers become a computed view over the content, so you can "number last" — insert a figure on page 2 and everything downstream renumbers itself (captions *and* in-text references) with zero manual edits. The old pain (some captions say "Fig 1.3", some don't) is the symptom of numbers living inside caption text; §16 moves the number out.

### 16.1 What gets numbered
Three **chapter-relative** series, each its own counter, reset every chapter, counted in **reading order** (page_number asc → block order). The chapter opener (page 0) is skipped.
- **Figures → `Fig. C.N`** — `image` (non-decorative) + `gallery`.
- **Tables → `Table C.N`** — `table` blocks. *(A markdown table written inside a `text` block is NOT a `table` block and won't be numbered — use a real `table` block for anything you want numbered.)*
- **Equations → `Eq. C.N`** — `latex_block` **only when it has a `figure_key`** (opt-in; most display equations don't need a number).

### 16.2 Figure vs decorative
A **figure is something you can cite**; a decorative image is not.
- **Numbered:** labelled diagrams, infographics, charts, apparatus — anything the text refers to or that carries instructional content.
- **Not numbered:** page **hero banners** and the chapter-opener cover. Mark them `decorative: true` (the admin Image editor has a checkbox). The finaliser also auto-detects a hero (wide aspect `16:5`/`21:9` + no caption) as decorative, but the explicit flag wins.

### 16.3 Captions & keys
- **Never type the number into the caption.** Write only the descriptive sentence; the renderer prepends a bold **`Fig. 1.3`** / **`Table 1.2`** label from the assigned `figure_number`. (Drop the old `📸` prefix.)
- Each figure has a `figure_key` (a slug, e.g. `atoms-diagram`). Set it in the editor for figures you'll reference; the finaliser auto-slugs one from the alt/caption if blank.
- **Galleries** = one figure with lettered panels: `Fig. 1.3 (a)(b)(c)`.

### 16.4 In-text references
Reference a figure in prose with a token: `… as shown in {fig:atoms-diagram}.` The reader resolves it to "Fig. 1.3" using the chapter's `figure_refs` map. Before numbering (draft), it falls back to "the figure". Because you reference by key, renumbering updates the in-text mention automatically — never write "Figure 1.3" literally in prose. *(Resolution currently runs in `text` blocks; callouts/worked-examples are a follow-up.)*

### 16.5 The finaliser — run only when the chapter is content-complete
```
node scripts/number-figures.js <bookSlug> <chapterNumber> [--dry]
# e.g. node scripts/number-figures.js ncert-simplified 1
```
It is **idempotent** — re-run any time content changes and numbers + references re-sync. It assigns numbers, ensures keys, **strips any hard-typed "Fig 1.3 —"/"Table 1.1 —"/leading emoji** from captions, writes `figure_refs` onto every page, and **reports duplicate keys + dangling `{fig:…}` references**. Use `--dry` to preview. Numbers only "exist" after you run it, which is exactly the point: draft churn-free, finalise on confirmation.

### 16.6 Topics / sub-topics are NOT numbered (decision 2026-06-10)
Unlike NCERT (`1.4.2`), our Live Books are an Apple-Books-style *journey*, not a linear reference. Sub-topics have **titles + a position in the chapter-opener journey map (lessons 1…N) + the section objective line** — that's the wayfinding. No `1.4.2.1` heading prefixes (they'd drag the experience back toward a dry textbook). **Figures are the exception that must be numbered** because an image has no title to refer to. *(Optional future: a subtle per-page "NCERT §1.4" alignment chip for exam cross-reference — not built.)*
