# Physics practice corpus (Live Books)

A ready-to-insert bank of **505 MCQs** and **406 worked examples** covering the full
Class 11 + 12 physics syllabus, organised as **47 chapter files**. Built to be dropped
into Live Book pages with one command per placement.

- **[INDEX.md](INDEX.md)** — the lookup table: which chapter file serves which NCERT chapter. Start here.
- **[manifest.json](manifest.json)** — the same data machine-readable.
- **chapters/chNN.json** — one file per source chapter, holding block payloads.

Both `INDEX.md` and `manifest.json` are generated — run
`node scripts/hcv-bank/build-manifest.js` after editing any chapter file.

---

## 1. What's in a chapter file

Each file holds two payloads, already in the exact shape the Live Books block
schema expects (`packages/data/books/schemas.ts`), so **no translation is needed
at insertion time**:

```
blocks.practice_bank      one practice_bank block: sectioned MCQs, source-tagged 'mcq'
blocks.worked_examples[]  an array of worked_example blocks: problem + solution, tap-to-reveal
```

Plus metadata: `hcv_chapter`, `hcv_title`, `ncert` (class + target chapter), `source_pages`,
and a `notes` field recording any caveat (see §5).

---

## 2. Inserting into a page

Everything goes through `scripts/hcv-bank/insert-blocks.js`, which **appends only** and
writes via `scripts/lib/book-writer.js` — so every insert is version-snapshotted,
content-loss-guarded and audit-logged per CLAUDE.md §0.6. It can never remove or
overwrite an existing block.

```bash
# 1. see what a chapter holds
node scripts/hcv-bank/insert-blocks.js --chapter 3 --list

# 2. preview the write (nothing is saved)
node scripts/hcv-bank/insert-blocks.js --chapter 3 --page kinematics-practice --what bank --dry

# 3. append the whole practice bank to a page
node scripts/hcv-bank/insert-blocks.js --chapter 3 --page kinematics-practice --what bank

# only some sections of the bank
node scripts/hcv-bank/insert-blocks.js --chapter 3 --page <slug> --what bank --sections projectile-motion,relative-motion

# specific worked examples, inline on a teaching page
node scripts/hcv-bank/insert-blocks.js --chapter 3 --page projectile-motion --what worked --only 5,6,7

# both at once
node scripts/hcv-bank/insert-blocks.js --chapter 3 --page <slug> --what all
```

`--page` takes a page **slug** or a page **id** (uuid). Block `order` is renumbered
densely across the whole page, and any block-id collision is auto-suffixed rather
than clobbering what is there.

### Typical placement pattern

| Where | What | Command |
|---|---|---|
| Concept page, beside the relevant idea | 1–3 worked examples | `--what worked --only 2,3` |
| End-of-chapter practice page | the whole practice bank | `--what bank` |
| A short revision page | one section of the bank | `--what bank --sections <id>` |

---

## 3. Checking the corpus

```bash
node scripts/hcv-bank/validate.js            # all chapters
node scripts/hcv-bank/validate.js 3 12       # just chapters 3 and 12
node scripts/hcv-bank/balance.js --check     # report answer-position spread, write nothing
node scripts/hcv-bank/balance.js             # rebalance + normalise \dfrac -> \frac
```

`validate.js` mirrors the Zod block schemas and additionally enforces the rules Zod
cannot see:

- **no third-party attribution anywhere** — the corpus must never name its source
- **no `null` values** — the save path Zod-rejects `null` on optional fields
- LaTeX: `$...$` only, never `$$`, delimiters balanced
- exactly 4 options per MCQ, `correct_index` in range, no duplicate option text
- **no option-letter references** in explanations (they break when options are reordered)
- **no self-correcting prose** — text that reads as the author reasoning in public
- answer-position spread held to 15–35% per letter
- length-tell warning when the correct option is conspicuously the longest

Current state: **0 errors, 0 warnings**; answer spread **27.3 / 27.3 / 25.1 / 20.2 %**.

---

## 4. Provenance and the attribution rule

Every item here was **rebuilt, not copied**. For each source item the physics
principle and difficulty were preserved while the scenario, the numbers, the option
set and all prose were written fresh. Worked examples were re-authored on the same
concepts with new values and our own solution voice.

This is deliberate and it is load-bearing:

- The source is a third-party book in copyright. A light paraphrase would not clear that bar; a genuine rebuild does.
- Per the standing platform rule, **no student-facing source badge is shown for any book except NCERT / Exemplar / CBSE PYQ / JEE Main PYQ.** Every item therefore carries `source: 'mcq'`, which renders as a neutral green "MCQ" chip and claims no provenance.
- `validate.js` fails the build if the source is named anywhere in the corpus.

The `source_pages` field in each chapter file is an **internal** editorial trace only.
It is never rendered.

---

## 5. Known caveats (carried in each file's `notes`)

| Chapter | Caveat |
|---|---|
| 21 Speed of Light | Source chapter has **no** Worked Out Examples section at all. Its 6 worked examples were authored on the chapter's own content (Fizeau, Michelson, Roemer) rather than adapted. |
| 23, 30, 35 | The source PDF's text layer is corrupt on these pages (a broken font that drops digits). Their objective sets and worked-example topics were read from **rendered page images** instead. |
| 33 Thermal & Chemical Effects | Thermoelectricity and Faraday's laws of electrolysis are largely **outside the current NCERT syllabus** — enrichment. |
| 41 Electric Current through Gases | Mostly **outside the current syllabus** (vacuum diodes, triodes, discharge tubes). Retained as enrichment / history. |
| 47 Special Relativity | Only $ E = mc^{2} $ is in the NCERT course (under Nuclei). The rest is enrichment. |
| Figure-dependent items | ~25 source items answered from a printed figure. Each was **re-cast verbally** so the corpus needs no diagrams at all. Where a figure was essential and unrecoverable, the item was replaced by one testing the same idea. |

## 6. What is deliberately *not* here

- The source's subjective **Exercises** (numerical problem sets)
- **Questions for Short Answer**
- **OBJECTIVE II** (multi-correct) — the reader's quiz surface is single-correct, so these were parked rather than mangled into a shape they do not fit

Any of the three can be added later as a second pass.
