# Build Contract — Class 12 Ch.5 "The d- and f-Block Elements"

Book `ncert-simplified-12`, chapter **number 5**, slug `d-and-f-block-elements`. All pages `published:false`.
Toolkit: `scripts/livebook-dblock/` (content) + `scripts/practice-dblock/` (practice bank). Helpers: `scripts/ceq/_helpers.js`.
Source PDF: `iCloud Drive (Archive)/Documents/chemistry/ncert books/class 11 & 12/12th - D & F block.pdf` (NCERT Unit 8, 28 pages).

## Non-negotiable rules (founder's inorganic rule)
1. **NCERT word-by-word.** Transcribe NCERT's sentences, equations, numbers and tables faithfully — same meaning, same wording. Simplify phrasing only where NCERT is genuinely terse, and then **add** the gloss alongside, never replacing the NCERT line. Never invent facts/numbers from training knowledge. If unsure of a value, read the PDF page again.
2. **Enrichment only in callouts.** Anything beyond NCERT (memory tricks, shortcuts) goes in an `exam_tip` callout titled "Exam Point — …", never in body text.
3. **Existing block types only** (image, text, heading, callout, worked_example, table, inline_quiz, simulation, group_elements, practice_bank). No new block types.
4. **The approved pilot is the gold standard for voice & layout:** `scripts/livebook-dblock/pages/p06_oxidation-states.js`. Match its tone, block order, recap style and quiz style exactly.
5. **LaTeX (book convention):** inline `$...$`, display `$$...$$`; chemical formulae in `\ce{...}` (e.g. `$\ce{KMnO4}$`, `$\ce{Cr2O7^{2-}}$`). Even number of `$` per line; every `{` closed.
6. Every content page ends with **`h.recap([...])`** then **`h.quiz([...])`**. Hero image is block 0 (`src:''`, detailed `generation_prompt`, new house style: hand-drawn coloured illustration on deep-charcoal `#121316`, muted earthy palette, no glow/neon/3D).

## Two devices woven through the chapter
**🔍 Decode This** (on every page that has an NCERT statement+reason pair) — a `callout('note', '🔍 Decode This — turn an NCERT line into an exam question', …)` that quotes NCERT's fact line + reason line, reassembles them as an Assertion–Reason question, gives the answer, and reminds the student of the rule *"X because Y" → A=X, R=Y*. See the pilot for the exact format.

**🏛️ Exam Vault** (on high-yield pages where a clean verified PYQ exists) — a `worked('🏛️ Exam Vault · <EXAM> <YEAR> (PYQ)', 'solved_example', stem+options, answer+why+"this is NCERT's line …")`. Pick a PYQ from `/private/tmp/claude-501/-Users-CanvasClasses-Desktop-canvas/562afe3c-212f-4fdc-b3a6-2c7830214660/scratchpad/_pyq_pool.json` (keyed by theme), **verify its answer yourself against NCERT before using it**, and point out the NCERT sentence it maps to. Skip if no clean fit — Decode This is mandatory, Exam Vault is where it fits.

## Quiz rules (§3.6.1)
4 options, every one a real trap; never reveal the answer by length/grammar; `correct_index` balanced across A/B/C/D over the page's 5–6 questions; include at least one real assertion–reason or "which statement is correct" item per page where the topic supports it; explanation teaches why the key is right and why the tempting distractor is wrong (reference option *content*, not letters).

## Page map (22 pages; p6 already built)

| # | slug | title | NCERT § (PDF pp.) | Examples / In-text | Founder highlights to keep verbatim | Special |
|---|---|---|---|---|---|---|
| 1 | `dblock-introduction` | The d- and f-Block Elements | intro + 8.1 (1–3) | — | "f-block … 4f and 5f progressively filled … formal members of group 3"; transition-metal definition; Zn/Cd/Hg (d¹⁰) not transition | **group_elements** Sc→Zn strip; Decode: Zn/Cd/Hg not transition |
| 2 | `electronic-configurations` | Electronic Configurations of the d-Block | 8.2 (2–3) | **Ex 8.1**, **Intext 8.1** | Cr = 3d⁵4s¹, Cu = 3d¹⁰4s¹; "d orbitals project to periphery … ions of a given dⁿ (n=1–9) have similar magnetic/electronic properties" | Table 8.1; Decode: Cr/Cu anomaly; Vault: config |
| 3 | `physical-properties` | Physical Properties & Metallic Character | 8.3.1 (4) | **Ex 8.2**, **Intext 8.2** | "With the exceptions of Zn, Cd, Hg and Mn, they have one or more typical metallic structures"; melting point max at d⁵ | Fig 8.1/8.2 diagrams; Decode: m.p. max at d⁵ |
| 4 | `atomic-ionic-sizes` | Variation in Atomic & Ionic Sizes | 8.3.2 (5–6) | — | "progressive decrease in radius … shielding of a d electron is not that effective … variation within a series quite small"; "filling of 4f before 5d … Lanthanoid contraction"; "second and third d series similar radii (Zr 160 pm, Hf 159 pm)" | **sim** periodic-trends-explorer; Table 8.2; Decode: Zr≈Hf; Vault: radii |
| 5 | `ionisation-enthalpies` | Ionisation Enthalpies | 8.3.3 (7) | **Intext 8.5** | irregular 1st IE (4s/3d reorganisation, exchange energy); 3rd IE high for d⁵(Mn²⁺)/d¹⁰(Zn²⁺), break between Mn²⁺ and Fe²⁺; "Cu, Ni, Zn … difficult to obtain O.S. greater than two" | Decode: high 2nd IE of Cr/Cu |
| 6 | `oxidation-states` | Oxidation States | 8.3.4 (8) | **Ex 8.3**, **add Intext 8.3** | DONE — add Intext 8.3 (which 3d metal shows most O.S. → Mn) | BUILT (gold standard) |
| 7 | `electrode-potentials` | Standard Electrode Potentials (M²⁺/M, M³⁺/M²⁺) | 8.3.5+8.3.6 (9–10) | **Ex 8.4**, **Intext 8.4**, **Intext 8.9** | "unique behaviour of Cu, having a positive E°, accounts for its inability to liberate H₂ from acids" | Fig 8.4; Table 8.4; Decode: Ex 8.4 Cr²⁺/Mn³⁺; Vault: electrode_potential |
| 8 | `higher-oxidation-states` | Stability of Higher Oxidation States | 8.3.7 (10–11) | **Ex 8.5**, **Intext 8.6** | "ability of oxygen to stabilise the highest oxidation state is demonstrated in the oxides"; "Mn₂O₇ … each Mn tetrahedrally surrounded by O's including a Mn–O–Mn bridge"; Cu(I) disproportionation; "stability of Cu²⁺(aq) … more negative ΔhydH" | Tables 8.5/8.6; Decode: MnF₄ vs Mn₂O₇ |
| 9 | `chemical-reactivity` | Chemical Reactivity & E° Values | 8.3.8 (12) | **Ex 8.6**, **Ex 8.7**, **Intext 8.7** | E° for Mn, Ni, Zn more negative than expected (d⁵, d¹⁰, hydration) | Decode: Mn/Ni/Zn anomaly; Vault: electrode_potential |
| 10 | `magnetic-properties` | Magnetic Properties | 8.3.9 (13–14) | **Ex 8.8**, **Intext 8.8** | spin-only $\mu=\sqrt{n(n+2)}$; Table 8.7 | **μ↔n↔ion ladder** table; Vault: magnetic_moment (HIGH-YIELD); Decode |
| 11 | `coloured-ions-complexes` | Coloured Ions & Complex Formation | 8.3.10+8.3.11 (15–16) | — | Table 8.8 colours; "colour due to d-d transition / complementary colour"; Sc³⁺, Zn²⁺ colourless | **Colour table** (Table 8.8) + memory hook; Vault: colour (HIGH-YIELD); Decode |
| 12 | `catalytic-interstitial-alloys` | Catalysis, Interstitial Compounds & Alloys | 8.3.12+8.3.13+8.3.14 (16–17) | — | "iron(III) catalyses the reaction between iodide and persulphate" | Decode: why good catalysts; Vault: catalytic |
| 13 | `oxides-oxoanions` | Oxides & Oxoanions of Metals | 8.4.1 (17–18) | **Ex 8.9** | "as oxidation number increases, ionic character decreases"; Mn₂O₇ covalent green oil | Table 8.6; Decode: O.N.↑ → covalent↑ |
| 14 | `potassium-dichromate` | Potassium Dichromate K₂Cr₂O₇ | 8.4 (18–19) | — | "the oxidation state of chromium in chromate and dichromate is the same"; chromate⇌dichromate with pH; Cr–O–Cr 126° | structure diagram; oxidising half-reactions; Vault: k2cr2o7 (HIGH-YIELD) |
| 15 | `potassium-permanganate` | Potassium Permanganate KMnO₄ | 8.4 (19–21) | — | prep (MnO₂→manganate→permanganate); green K₂MnO₄ disproportionates; "favourite oxidant in preparative organic chemistry" | manganate/permanganate diagram; acid/neutral/alkaline half-reactions; Vault: kmno4 (HIGH-YIELD) |
| 16 | `lanthanoids-configuration-sizes` | The Lanthanoids — Configuration & Sizes | 8.5 intro+8.5.1+8.5.2 (21–22) | — | inner-transition (f-block) intro; "lanthanoid contraction"; 4fⁿ; consequences (Zr/Hf) | Table 8.9; Decode: radii decrease; Vault: lanthanoid |
| 17 | `lanthanoids-oxidation-characteristics` | Lanthanoids — Oxidation States & Characteristics | 8.5.3+8.5.4 (22–23) | **Ex 8.10** | predominant +3; Ce⁴⁺ oxidant (f⁰), Eu²⁺/Yb²⁺ reductants (f⁷/f¹⁴); colour from f electrons | Fig 8.7 reactions; Decode: Ce⁴⁺/Eu²⁺; Vault: lanthanoid |
| 18 | `actinoids-configuration-sizes` | The Actinoids — Configuration & Sizes | 8.6 intro+8.6.1+8.6.2 (23–24) | — | radioactive; 5f/6d; "actinoid contraction … greater … poorer shielding by 5f" | Table 8.10; Decode: actinoid contraction |
| 19 | `actinoids-oxidation-comparison` | Actinoids — Oxidation States & Comparison | 8.6.3+8.6.4 (24–25) | **Intext 8.10** | greater range of O.S. (5f,6d,7s comparable); +3 general; compare with lanthanoids | Table 8.11; Decode: more O.S. than Ln; Vault: actinoid |
| 20 | `applications` | Applications of d- and f-Block Elements | 8.7 (25–26) | — | V₂O₅ (contact), TiCl₄/Al(CH₃)₃ Ziegler, Fe Haber, Ni hydrogenation, PdCl₂ Wacker, AgBr photography, coinage metals, mischmetal | multi-statement quiz; Vault: catalytic |
| 21 | `chapter-recap-exam-decoder` | Chapter Recap & Exam Decoder | whole chapter | — | the founder's revision-tools hub | colour table + μ-ladder + oxidation map + **exceptions list** + lanthanoid-contraction consequences + the "Decode This — the skill" summary + mixed quiz |
| 22 | `d-and-f-block-practice` | Practice — NCERT Exercises | exercises 8.1–8.38 | all 38 | — | **practice_bank**, 5 sections (below) |

## Practice bank — 5 sections, NCERT exercises 8.1–8.38 assigned
Mirror `scripts/practice-pblock/` (item = `{kind:'numerical', id, source:'ncert_exercise', source_label:'NCERT 8.x', prompt (verbatim), solution, answer?}`). Transcribe each stem verbatim from PDF pp.26–28; **write each solution by hand from NCERT content and verify it** (flag any doubtful answer inline rather than guessing).

- **S1 — Position, electronic configuration & general characteristics of the d-block:** 8.1, 8.8, 8.9, 8.34, 8.35, 8.37 (6)
- **S2 — Oxidation states, redox & electrode potentials:** 8.2, 8.3, 8.4, 8.5, 8.6, 8.13, 8.17, 8.19, 8.21, 8.22, 8.23, 8.25 (12)
- **S3 — Magnetic, colour, catalytic, interstitial, alloys & important compounds (K₂Cr₂O₇, KMnO₄):** 8.11, 8.12, 8.14, 8.15, 8.16, 8.18, 8.24, 8.26, 8.36, 8.38 (10)
- **S4 — The lanthanoids & lanthanoid contraction:** 8.7, 8.10, 8.27, 8.31, 8.32 (5)
- **S5 — The actinoids & comparison with lanthanoids:** 8.20, 8.28, 8.29, 8.30, 8.33 (5)

(38 total. Section S2 is heaviest — oxidation states is the chapter's core.)

## Per-page block-order recipe (from the pilot)
hero `img` → NCERT intro `text` → (`group_elements`/`sim` if specified) → `heading`(+objective) → NCERT `text` (properties as bullets / bold-label + equations) → `img` diagram(s) where NCERT has a figure → `exam_tip` callout(s) for enrichment → `worked` blocks for Examples/In-text at their section → **🔍 Decode This** callout → **🏛️ Exam Vault** worked (if a verified PYQ fits) → `h.recap([...])` → `h.quiz([...], 0.6)`.

## Build & validate
`node scripts/livebook-dblock/build.js` (dry-run) → `--apply`. Practice: `node scripts/practice-dblock/build.js --apply`. Then spot-check fidelity vs the PDF and balance quiz keys.
