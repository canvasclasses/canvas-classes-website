# Chemical Equilibrium (Ch.6) — Live Book Build Contract

> **Status:** 🟢 ALL 17 PAGES BUILT (0–16), `published:false` — awaiting founder review. **`le-chatelier-lab` flagship sim BUILT + embedded (p13) + preview-verified.** **ALL 33 page images GENERATED + UPLOADED (2026-06-26)** — every `image` block now has a live R2 `src` (0 pending). Practice bank still to come.
> **Book:** `ncert-simplified` (Class 11 Chemistry) · **Chapter:** 6 "Chemical Equilibrium" (existed as an empty 0-page shell; pages created fresh, `published:false`).
> **Last touched:** 2026-06-25 · **Owner:** agent build, founder review.

## Sources (read before authoring any page)
- **Voice (MANDATORY):** `_agents/voice/teacher-voice-profile.md` + `_agents/voice/CEQ-exemplars.md` (his actual analogies — use them, never invent). BOOK_PAGE_WORKFLOW §5.V + §5.X (anti-AI-tell rules).
- **Content:** founder's crash-course notes `~/Downloads/chemical-equilibrium-notes.pdf` (54 pp, NCERT-aligned, comprehensive) + the CEQ exemplar question bank. Ground in **NCERT + standard JEE Main** (Mittal Vol. 2 not supplied → no reference-first for this chapter).
- **Format:** BOOK_PAGE_WORKFLOW §4A (Class 11–12 template), §4D (one sub-topic per page, ≤18 blocks), §15 (objectives, mid-page reasoning checkpoint, predict-first sims, page-end bridge).

## Finding: the notes are NEAR-COMPLETE for NCERT+JEE Main
Gaps to ADD (not in notes / thin): **units of Kc·Kp**, **Contact process (SO₃)** alongside Haber, *(optional)* coupled/simultaneous equilibria (JEE-Adv — founder de-prioritises for Main).
Note: `free-energy-and-equilibrium` already exists in Ch.5 (Thermodynamics) — page 10 here cross-links, does not duplicate.

## Approved page structure (~17 pages, 4 arcs) — `[N]`=from notes · `[+]`=added · `[Sim]`=predict-first sim
**Arc A — What equilibrium is**
- 0. Opener — "The Reaction That Never Finishes" `[N]` (chapter_opener cover)
- 1. Reversible vs irreversible reactions `[N]`
- 2. Dynamic equilibrium `[N]` `[Sim: Equilibrium Approach]`
- 3. Equilibrium = minimum Gibbs energy `[N]`
- 4. Physical equilibria — phase changes (solid-liq / liq-vap / solid-vap) `[N]`
- 5. Physical equilibria — dissolution (solids & gases in liquids, Henry's law) `[N]`

**Arc B — Quantifying (Kc, Kp, Q)**
- 6. The equilibrium constant Kc (law of chemical eq, H₂+I₂ table) `[N]`
- 7. Kp & the Kc–Kp relationship + **units of K** `[N]` `[+]`
- 8. Reaction quotient Q & predicting direction `[N]` `[Sim: Q-vs-K, light]`
- 9. Characteristics of K + manipulating equilibria (1/K, Kⁿ, K₁·K₂; homo/hetero; pure solids=1) `[N]`
- 10. K & Gibbs energy (ΔG°=−RT ln K) `[N]` — cross-links Ch.5 free-energy page

**Arc C — Dissociation numerics**
- 11. Degree of dissociation α & the ICE method `[N]`
- 12. Vapour density & dissociation (D/d = 1+(n−1)α) `[N]`

**Arc D — Le Chatelier**
- 13. Le Chatelier — master idea + concentration `[N]` `[Sim: Le Chatelier Lab — FLAGSHIP]`
- 14. Pressure, volume & inert gas (const V vs const P trap) `[N]`
- 15. Temperature & catalyst (van't Hoff, log K vs 1/T) `[N]`
- 16. Equilibrium in industry — Haber + **Contact process** `[N]` `[+]`
- *(17. optional) Coupled/simultaneous equilibria — JEE-Adv, flagged optional*

## Simulators (founder decision 2026-06-25: build flagships, decide rest later)
- **Le Chatelier Lab** (page 13) — FLAGSHIP. Push concentration / pressure-volume / temperature / inert-gas (V vs P) / catalyst; watch the shift + Q-vs-K respond.
- **Equilibrium Approach** (page 2) — rates & concentrations converge from either start side (N₂O₄/NO₂).
- Others (Q-vs-K) optional.

## NCERT source (read during the build) — `~/iCloud Drive (Archive)/Documents/chemistry/ncert books/class 11 & 12/11th - Equilibrium.pdf`
NCERT Unit 7 "Equilibrium" = BOTH chemical + ionic (46 pp). Contains **28 in-text solved Problems** (7.1–7.11 chemical, 7.12–7.28 ionic — each fully solved) and **73 end-of-chapter Exercises** (7.1–7.73). No separate "Intext Questions". Corrections to earlier gap analysis: **"factors affecting acid strength" (§7.11.7) and di-/polybasic acids (§7.11.6) ARE NCERT** (not adds); NCERT buffer is deliberately light (JEE depth is the add). Preserve special features: Student's-Activity (dynamic eq), "Units of K" box, the two "An experiment" boxes (conc, temp), "Hydronium & Hydroxyl Ions" box, scientist bios (Faraday, Arrhenius → `meet_a_scientist`).

### Solved Problems → page map (insert as `worked_example`, tap-to-reveal, during each page's build)
| Problems | Topic | Page |
|---|---|---|
| 7.1, 7.2, 7.3 | writing Kc | p6 |
| 7.5 | Kp from Kc | p7 |
| 7.6 | heterogeneous Kp | p9 |
| 7.7 | Q vs K, direction | p8 |
| 7.4, 7.8, 7.9 | ICE / equilibrium concentrations | p11 (rename: "α + calculating equilibrium concentrations (ICE)" — owns §7.6.3) |
| 7.10, 7.11 | ΔG° ↔ K | p10 |
| 7.12, 7.13, 7.14 | conjugate pairs | Ionic p5 |
| 7.15 | Lewis classification | Ionic p6 |
| 7.16 | pH | Ionic p10 |
| 7.17, 7.18, 7.19, 7.20, 7.21, 7.23 | weak acid/base pH (+ water contribution) | Ionic p11 |
| 7.22, 7.24 | buffer pH | Ionic p15 |
| 7.25 | WA/WB salt pH | Ionic p14 |
| 7.26, 7.27 | Ksp & solubility | Ionic p17 |
| 7.28 | common-ion on solubility | Ionic p18 |

## End-of-chapter PRACTICE BANK — design (founder, 2026-06-25) — build AFTER teaching pages
Applies to BOTH Chemical Eq and Ionic Eq (one Practice page each). **Self-sufficient / in-book** (founder chose in-book over Crucible). Separate from the Crucible Question Bank.
- **Structure:** one end-of-chapter **Practice page** per chapter, divided into **4–5 sub-topic sections** (Chem Eq draft sections: A. Equilibrium & Kc/Kp/units · B. Reaction quotient, direction & ICE concentrations · C. Le Chatelier & factors · D. ΔG–K & industrial applications. Ionic Eq draft: A. Theories & conjugate pairs · B. Ionization, Ka/Kb, pH · C. Hydrolysis & buffers · D. Titration & indicators · E. Solubility & Ksp).
- **Each section = a MIXED bank** for that sub-topic: the NCERT exercises that belong to it **+** extra CBSE PYQs + MCQs on the same sub-topic. Every item carries a **source tag**: `NCERT Exercise`, `CBSE PYQ <year>`, `MCQ`.
- **UI:** two-pane — **left = section list**, click a section → its bank opens on the right; each question badged with its source tag. Serves CBSE-only AND JEE/NEET students.
- **Question kinds are mixed:** NCERT numericals (worked solution, tap-to-reveal) + gradable MCQs. The component must handle both.
- **Maintainability:** NCERT portion frozen once added; PYQ/MCQ portion refreshed yearly — per section, per source. JSON-backed (e.g. `scripts/equilibrium/_practice_<chapter>_<section>.json`), idempotent build.
- **Open at build time:** new sectioned practice **component/block** (the left-nav two-pane is custom — likely a new block type rendered by a dedicated component, NOT the flat `chapter_practice`); how NCERT-numerical items render alongside MCQs; exact section boundaries; where the CBSE PYQ/MCQ content comes from (founder bank vs authored).

## Build mechanics
- New pages via the `createPage13` pattern (raw `insertOne` + append `_id` to `book.chapters[ch6].page_ids`; idempotent: update-blocks-only if slug exists). `published:false`. Hero images `src:""` + `generation_prompt` (founder generates via the ChatGPT-in-Chrome pipeline, dark hand-drawn house style — see [[livebook_image_style]]).
- Pilot script: `scripts/build_ceq_pilot.js` (pages 0–2).

## Changelog
- 2026-06-25 — Plan approved (structure as-is, flagships-later, Chemical Equilibrium first). Built voice-calibration pilot pages 0–2. Awaiting founder voice sign-off before Arcs A(rest)/B/C/D.
- 2026-06-25 — Read full NCERT Unit 7 PDF; catalogued 28 solved Problems (→ page map above) + 73 Exercises. Founder defined the end-of-chapter **practice bank** design: section-navigated, source-tagged mixed bank (NCERT + CBSE PYQ + MCQ), two-pane UI, in-book, built AFTER teaching pages. Recorded above.
- 2026-06-25 — **CHAPTER COMPLETE: pages 3–16 built (founder green-lit the full build).** Authored via 7 parallel subagents (tight voice briefing → the approved pilot as gold standard), each writing a `scripts/ceq/pages/pNN_*.js` module; orchestrated by `scripts/ceq/build_chapter.js` (+ shared `scripts/ceq/_helpers.js`) in one race-free pass. Ch.6 now **17 pages (0–16), 185 blocks, published:false**. All 11 NCERT chemical-eq solved Problems (7.1–7.11) folded as `worked_example` (tap-to-reveal) at their mapped pages; Problem 7.5's NCERT arithmetic misprint (0.033 vs ≈3.3×10⁻⁴) caught + corrected in-page. Voice-audited (grep + manual): fixed leaked "two-way traffic"/"living" metaphors (founder had rejected these) in p04 caption + p16 wrap, and a double-em-dash in p08. Hero/diagram images are `src:''` + dark hand-drawn `generation_prompt` (founder's pipeline). NEXT: founder reviews the 14 new pages → then Ionic Equilibrium (same machinery), the practice bank, and the Le Chatelier Lab sim.
- 2026-06-25 — **VOICE CALIBRATION (founder review of pilot):** founder flagged the opener's 2nd paragraph as "off" — it had the banned **"Not X. It is Y." drama pair** ("It is not a dead end. It is a living, two-way traffic…") + stacked metaphors. Rewrote it plain; also fixed a second hidden "Not X. It is Y." pair on p1 (CaCO₃ line). **Carry chapter-wide: hard-enforce §5.X — no "Not X. It is Y." pairs, no stacked metaphors in framing prose, say-it-once, plain SVO.** Founder also wants **concrete visuals paired with conceptual content** → added an NO₂ ⇌ N₂O₄ sealed-tube "reaches equilibrium" image on p1 (under the callout that describes it). Re-ran `build_ceq_pilot.js --apply` (idempotent update).
- 2026-06-26 — **ALL 33 PAGE IMAGES GENERATED + UPLOADED.** Drove ChatGPT-in-Chrome (`scripts/livebook-images/` pipeline) in 3 founder-reviewed batches (16 + 15 + 2); each image content-verified on-screen, downloaded, then compressed (cwebp -q42) + R2-uploaded + block `src` written via `ingest.js`. ch6 now **0 pending images** (was 33). House style held across banners AND label-heavy diagrams (graphs, ICE table, Kc/Kp panels, Fe-SCN tubes, Haber flow). **Symbol-rendering trick confirmed:** spelling Greek out in the prompt ("Delta G-naught" → ΔG°, "Delta n-g" → Δng) renders math labels reliably — applied to all ΔG°/Δng prompts (a mechanical rendering fix, NOT a prompt rewrite per [[feedback_livebook_image_quality]]). Caught + fixed one mid-run ordering slip (skipped the p6 Kc-graph block `50902b11`, regenerated before any upload). File→block maps saved at `scripts/livebook-images/_ceq_b{1,2,3}_map.json`. NEXT: founder reviews the 17 pages with images in-context → then Ionic Equilibrium, the practice bank, and (already built) the Le Chatelier Lab sim.
