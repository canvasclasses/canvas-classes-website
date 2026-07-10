# p-Block Elements (Class 12, Ch.4) — Build Contract

Book `ncert-simplified-12`, chapter **4** ("The p-Block Elements", NCERT Unit 7, Groups 15–18). Orchestrator: `scripts/livebook-pblock/build.js` (creates the chapter, globs `pages/*.js`, upserts + links, `--apply`). Page modules live in `scripts/livebook-pblock/pages/pNN_<slug>.js`.

**Gold-standard pilots (READ THESE FIRST, mirror them exactly):**
`scripts/livebook-pblock/pages/p02_group15.js` (group-opener format) and `scripts/livebook-pblock/pages/p05_ammonia.js` (compound-page format).

---

## 0. Founder's rules (non-negotiable)

1. **NCERT word-by-word.** This is inorganic — JEE/NEET ask NCERT lines verbatim. Transcribe NCERT's sentences and equations faithfully; keep its language. Only **elaborate where NCERT is terse**, and only add interest via clearly-separate **"Exam Point" callouts** — never by rewriting NCERT prose. Do NOT apply the usual teacher-voice rewrite.
2. **Properties as bullets.** Physical properties → a clean markdown bullet list. Chemical properties → **bold-labeled points** (`**Reacts with X.**` then its equation as a `$$…$$` display block underneath). Never a long property paragraph.
3. **Quick Recap via `h.recap([...])`** at the end of every content page — organised, spaced, labelled groups (not a dense dump).
4. **Quiz** (`h.quiz`) at the very end of every content page: 5–6 questions from textbook content, real-trap distractors (§3.6.1), and **balance the answer positions across A/B/C/D** (do NOT leave them all at index 0).
5. **All NCERT solved Examples + In-text Questions** placed at their exact sections (see the map in §4), as `h.worked(...)` blocks.
6. Enrichment from the founder's notes (§5) goes ONLY in `exam_tip` callouts.

---

## 1. Helper API (`h`, from scripts/ceq/_helpers.js — passed into `build(h)`)

- `h.img(generation_prompt, aspect_ratio, caption)` → image block, `src:''` (founder's pipeline fills it). Use a **dark hand-drawn** prompt: "hand-drawn coloured science illustration on a deep charcoal (#121316) background, muted earthy palette, no glow/neon". Hero per page + structure diagrams as needed.
- `h.groupElements(title, intro, [symbols])` → interactive element-card strip (group openers only). e.g. `['O','S','Se','Te','Po']`.
- `h.sim(simulation_id, title, prediction?)` → embed a sim. Use `'periodic-trends-explorer'` on each group's trends section (optional `prediction = {prompt, options:[…], reveal_after:true}`).
- `h.heading(text, objective?)` → section heading (objective = one-line learning aim, optional).
- `h.text(markdown)` → markdown ( `$…$` inline, `$$…$$` display, `\ce{}` for formulas).
- `h.callout(variant, title, markdown)` → variant ∈ `fun_fact|remember|exam_tip|note|warning`. Use **`exam_tip`** titled "Exam Point — …" for notes-enrichment.
- `h.worked(label, variant, problem, solution)` → Examples: `label:'NCERT Example 7.X', variant:'solved_example'`; In-text: `label:'In-text Question 7.X', variant:'ncert_intext'`. Tap-to-reveal.
- `h.table(headers, rows, caption)` → headers `string[]`, rows `string[][]` (equal width). Use for NCERT property tables (compact key rows; unicode superscripts like `2s²2p³` are fine in cells).
- `h.recap([{label, text}])` → the Quick Recap callout.
- `h.quiz([{question, options:[4], correct_index, explanation}], 0.6)`.

**Page module shape:**
```js
module.exports = {
  page_number: N, chapter: 4, slug: 'kebab-slug',
  title: 'Title', subtitle: '…', tags: ['p-block', 'group-15', …], reading_time_min: 6,
  build: (h) => [ /* blocks in order */ ],
};
```
`node --check` must pass. LaTeX: even `$`, even `$$`, matched braces, **`\frac` not `\dfrac`**.

**Standard page skeleton (compound page):** hero img → short NCERT intro → `h.heading('Preparation', …)` + bulleted/labeled content + equations → Example/Intext at their spot → `h.heading('Properties', …)` (physical bullets + chemical bold-labeled points) → structure img if relevant → `exam_tip` callout(s) from notes → `h.heading('Uses')` → `h.recap([...])` → `h.quiz([...])`.
**Group-opener skeleton:** hero img → `h.groupElements(...)` (card strip at TOP) → NCERT intro → Occurrence → `h.heading('Atomic & Physical Trends')` + `h.sim('periodic-trends-explorer', …)` + faithful trends text + `exam_tip` → Physical properties (bullets) → key NCERT property `h.table` → `h.recap` → `h.quiz`.

---

## 2. Full page list (build all except p2, p5 which are DONE)

| pg | slug | title | NCERT § | interactive | Examples | In-text Qs |
|----|------|-------|---------|-------------|----------|------------|
| 1 | `p-block-introduction` | The p-Block Elements (intro) | chapter intro (groups 13–18 recap, `ns²np¹⁻⁶`, what's ahead: Groups 15–18) | `h.sim('periodic-table-builder', …)` optional | — | — |
| 2 | `group-15-nitrogen-family` | Group 15 — The Nitrogen Family | 7.1.1–7.1.6 | ✅ DONE | — | — |
| 3 | `group-15-chemical-properties` | Group 15 — Chemical Properties | 7.1.7 (oxidation states, disproportionation, anomalous N, reactivity → H/O/halogens/metals), Table 7.2 (hydrides) | — | 7.1, 7.2 | 7.1, 7.2 |
| 4 | `dinitrogen` | Dinitrogen | 7.2 | — | 7.3 | 7.3 |
| 5 | `ammonia` | Ammonia | 7.3 | ✅ DONE | 7.4 | 7.4, 7.5 |
| 6 | `oxides-of-nitrogen` | Oxides of Nitrogen | 7.4, Tables 7.3 & 7.4 | — | 7.5 | 7.6 |
| 7 | `nitric-acid` | Nitric Acid | 7.5 (Ostwald, redox w/ Cu & Zn dil/conc, brown-ring test, uses) | — | — | — |
| 8 | `phosphorus-allotropes` | Phosphorus — Allotropic Forms | 7.6 (white/red/black) | — | — | 7.7, 7.8 |
| 9 | `phosphine` | Phosphine | 7.7 | — | 7.6 | — |
| 10 | `phosphorus-halides` | Phosphorus Halides (PCl₃, PCl₅) | 7.8 | — | 7.7, 7.8 | 7.9, 7.10 |
| 11 | `oxoacids-of-phosphorus` | Oxoacids of Phosphorus | 7.9, Table 7.5 | — | 7.9 | 7.11, 7.12 |
| 12 | `group-16-oxygen-family` | Group 16 — The Oxygen Family | 7.10 (all sub-secs incl chemical), Table 7.6 & 7.7 | `h.groupElements('Group 16 …', …, ['O','S','Se','Te','Po'])` + trends sim | 7.10, 7.11 | 7.13, 7.14, 7.15 |
| 13 | `dioxygen-and-simple-oxides` | Dioxygen & Simple Oxides | 7.11 + 7.12 | — | — | 7.16, 7.17 |
| 14 | `ozone` | Ozone | 7.13 | — | — | 7.18, 7.19 |
| 15 | `sulphur-and-sulphur-dioxide` | Sulphur & Sulphur Dioxide | 7.14 + 7.15, Fig 7.5 | — | 7.12 | 7.20, 7.21, 7.22 |
| 16 | `oxoacids-of-sulphur-and-sulphuric-acid` | Oxoacids of Sulphur & Sulphuric Acid | 7.16 + 7.17 (Contact process), Fig 7.6 & 7.7 | — | — | 7.23, 7.24, 7.25 |
| 17 | `group-17-halogens` | Group 17 — The Halogens | 7.18 (all sub-secs incl chemical), Table 7.8 & 7.9 | `h.groupElements('Group 17 …', …, ['F','Cl','Br','I','At'])` + trends sim | 7.14, 7.15, 7.16 | 7.26, 7.27, 7.28 |
| 18 | `chlorine` | Chlorine | 7.19 (+ bleaching powder) | — | 7.17 | 7.29, 7.30 |
| 19 | `hydrogen-chloride` | Hydrogen Chloride | 7.20 (aqua regia) | — | 7.18 | — |
| 20 | `oxoacids-of-halogens-and-interhalogens` | Oxoacids of Halogens & Interhalogen Compounds | 7.21 + 7.22, Table 7.10 & 7.11 | — | 7.19 | 7.31 |
| 21 | `noble-gases` | Group 18 — The Noble Gases | 7.23 (trends + Xe compounds), Table 7.12, Fig 7.9 | `h.groupElements('Group 18 …', …, ['He','Ne','Ar','Kr','Xe','Rn'])` + trends sim | 7.20, 7.21, 7.22 | 7.32, 7.33, 7.34 |
| 22 | `p-block-quick-recap` | Quick Recap — The p-Block Elements | — (revision page from notes) | — | — | — |

**NCERT source:** `/Users/CanvasClasses/iCloud Drive (Archive)/Documents/chemistry/ncert books/class 11 & 12/12th - P Block.pdf` (44 pp). Read your sections (max 20 pp/call). Approx page map: 7.1–7.7 ≈ pp.1–12 · 7.8–7.9 ≈ pp.12–15 · 7.10–7.13 ≈ pp.15–20 · 7.14–7.17 ≈ pp.20–25 · 7.18–7.22 ≈ pp.25–34 · 7.23 ≈ pp.34–38 · Summary+Exercises ≈ pp.39–44. **Confirm the actual Example/In-text numbers from the PDF** — note: solved Examples appear to run 7.1–7.12 then **7.14** (no 7.13); verify and use the printed numbers.

---

## 4. Example & In-text answers
Examples: NCERT prints the full solution in the box — transcribe it. In-text Questions: give the correct answer (NCERT prints answers for some in the end-of-chapter "Answers to Some Intext Questions"; author a correct, concise answer for the rest). Keep them faithful and short.

---

## 5. Founder's notes — enrichment digest (use in `exam_tip` callouts + the Recap page)

**Group 15:** Half-filled p³ extra-stable → high IE. IE₂/IE₃ dip to Sb then ↑. m.p. ↑ to As then ↓; b.p. ↑ to Sb then ↓. Bi³⁺ > Bi⁵⁺ (inert pair). Oxides: N₂O₃,P₂O₃ acidic · As₂O₃,Sb₂O₃ amphoteric · Bi₂O₃ basic. Except NF₃, N-trihalides unstable; all trihalides covalent except BiF₃. **N–N single bond weaker than P–P** (interelectron repulsion) → N catenation weak. **Hydrides:** stability/basicity NH₃>PH₃>AsH₃>SbH₃>BiH₃; **bond angle** NH₃(107.8°)>PH₃(93.6°)>AsH₃(91.8°)>SbH₃(91.3°) — "NH₃ sp³; rest use ~pure p-orbitals (no hybridisation)"; b.p. PH₃<AsH₃<NH₃<SbH₃<BiH₃ (NH₃ H-bond anomaly). Cu²⁺+NH₃ → deep-blue ★★★; brown-ring test; Cu/Zn × dil/conc HNO₃ product matrix. **PCl₅ solid = [PCl₄]⁺[PCl₆]⁻ (sp³ / sp³d²); axial P–Cl 240 pm > equatorial 202 pm.** Oxoacids of P: count P–H bonds = reducing/basicity cue (H₃PO₂ two P–H = good reducing agent; H₃PO₃ one; H₃PO₄ none). 4H₃PO₃ → 3H₃PO₄ + PH₃ (disproportionation).

**Group 16:** Hydride **acidity H₂O<H₂S<H₂Se<H₂Te**; **thermal stability H₂O>H₂S>H₂Se>H₂Te**; all hydrides except H₂O are reducing (↑ down); **bond angle 104°>92°>91°>90°**; H₂O m.p./b.p. highest (H-bond). O less −ve EA than S (compact). m.p./b.p. ↑ to Te then ↓. **Ozone:** 3O₂→2O₃ ΔH=+142 kJ/mol; powerful oxidiser (O₃→O₂+O); NO depletes O₃; 117° angular. **Sulphur:** rhombic(α)→(369 K)→monoclinic(β); S₈ crown (107°); **S₂ paramagnetic like O₂** ★. **SO₂:** moist SO₂ is a reducing agent (Fe³⁺→Fe²⁺, MnO₄⁻→Mn²⁺) ★★★. Oxoacids of S: H₂SO₃, H₂SO₄, **H₂S₂O₈ peroxodisulphuric (O–O)**, **H₂S₂O₇ pyrosulphuric/oleum (S–O–S)**.

**Group 17:** **EA Cl>F>Br>I** (F anomaly); **bond enthalpy Cl₂>Br₂>F₂>I₂** (F₂ low); **oxidising power F₂>Cl₂>Br₂>I₂** (E° 2.87/1.36/1.09/0.54); F₂ displaces all, Cl₂ displaces Br⁻/I⁻, Br₂ displaces I⁻. Colours F₂ yellow, Cl₂ greenish-yellow, Br₂ red, I₂ violet. **HX acidity HF<HCl<HBr<HI**; **reducing power HI>HBr>HCl**; b.p. HCl<HBr<HI<HF (HF H-bond). **F forms OF₂/O₂F₂ (fluorides, not oxides — F more EN than O).** Cl₂+cold dil NaOH→NaCl+NaOCl; Cl₂+hot conc NaOH→NaCl+NaClO₃ (disproportionation pair). **Bleaching powder Ca(OCl)₂·CaCl₂·Ca(OH)₂·2H₂O**; bleaching via [O] (HOCl→HCl+[O]). **Aqua regia 3 HCl:1 HNO₃** dissolves Au, Pt. **Interhalogen hydrolysis: XX′→HX′+HOX** — bigger/less-EN halogen → +1 (HOX), smaller/more-EN → −1 (HX′). Shapes XX₃ bent-T, XX₅ square pyramidal, IF₇ pentagonal bipyramidal.

**Group 18:** Largest (vdW) radius in period; very high IE; +ve ΔH_eg (max endothermic Ne). Ar ≈1% of air; He lowest b.p. (4.2 K). **O₂ and Xe have almost identical IE₁ (1175 vs 1170) → basis of XePtF₆** ★. **Xe-F hydrolysis:** XeF₂→Xe+HF+O₂; XeF₄→Xe+XeO₃+HF+O₂; XeF₆ (complete)→XeO₃+HF; **XeF₆ partial: + H₂O→XeOF₄+HF; +2H₂O→XeO₂F₂+HF** ★. Shapes: XeF₂ linear, XeF₄ square planar, XeF₆ distorted octahedral, XeOF₄ square pyramidal, XeO₃ pyramidal.

---

## 6. The Recap page (p22)
A revision page from the notes digest above: organised, scannable. Use `h.heading` per group, `h.table` for the high-value trend orderings (hydride basicity/acidity/thermal-stability/bond-angle, halogen EA/BE/oxidising-power/HX acidity), and `exam_tip`/`recap` callouts for the ★ traps (inert pair, PCl₅ ionic, S₂ paramagnetic, Xe/O₂ IE, XeF₆ partial hydrolysis, interhalogen-hydrolysis rule, Cu²⁺ deep-blue, brown-ring, conc-vs-dil HNO₃). No quiz needed (it's a pure recap), but a short `h.quiz` of mixed high-yield Qs is welcome.
