# Class 12 Physics Live Book — Chapters 6–8 (EMI · AC · EM Waves) — Plan

**Status:** 🟢 **BUILT end-to-end 2026-07-31 — 46 pages across 3 chapters, all unpublished.** Sibling plan to [`PHYSICS12_EM_LIVEBOOK_PLAN.md`](PHYSICS12_EM_LIVEBOOK_PLAN.md) (Ch.1–5). The book is now **135 pages / 8 chapters** and the electromagnetism block is complete.

**Built vs planned:** Ch.6 18 pp (planned 18) · Ch.7 16 pp (16) · Ch.8 12 pp (12) — the page budget in §3 held exactly, with no splits or merges needed during authoring. Whole-book gate: `_hygiene.js` 0 findings · `_validate.mts` 135/135 · `_latex_check.js` 11,984 expressions 0 findings · `validate-taxonomy-link.js` 0 errors. **198 of the book's 487 practice items are real NCERT exercises**; §5's pre-build figure audit proved accurate — exactly the 2 predicted skips (6.1, 6.2) and no others.

**Standardised status header**
- **Owner:** agent-maintained, founder-directed
- **Book:** existing — `class12-physics` (subject `physics`, grade 12, board `ncert`). Adds chapters 6, 7, 8 to the five already built.
- **Scope of this plan:** **Electromagnetic Induction → Alternating Current → Electromagnetic Waves.** These three complete the electromagnetism block; Ray Optics onward is out of scope here.
- **Sources:** see §2. All source material is **already on the founder's drive — no NCERT website fetch is required.**
- **Next action:** founder sign-off on §8's three open calls, then build Ch.6 in the order given in §7.
- **Blocked on:** nothing.

---

## 1. Chapter sequence — and the one place we knowingly leave the taxonomy

Taken verbatim from `packages/data/taxonomy/taxonomyData_from_csv.ts`:

| Book ch | `crucible_chapter_id` | Title (byte-identical, §18) | `sequence_order` | Topic tags |
|---|---|---|---|---|
| 6 | `ph12_emi` | **Electromagnetic Induction** | 122 | `tag_emi_1..5` |
| 7 | `ph12_ac` | **Alternating Current** | 123 | `tag_ac_1..5` |
| 8 | `ph12_em_waves` | **Electromagnetic Waves** | **129** | `tag_emw_1..4` |

### The EM Waves placement — a deliberate departure, founder-approved 2026-07-31

The taxonomy's `sequence_order` for EM Waves is **129**, which puts it *after* Ray Optics (124), Wave Optics (125), Dual Nature (126), Atoms (127) and Nuclei (128). Chapter 124 — the literal "next" chapter — is **Ray Optics**.

We are building **EM Waves as book chapter 8 instead**, because:

1. Its own `chapterType` is **`electromagnetism`**, the same family as chapters 1–7. At 129 it sits marooned in the middle of optics and modern physics, away from every chapter it depends on.
2. It is **unbuildable without chapters 1, 5 and 6** and trivial with them: displacement current patches Ampère's law (Ch.5), and Maxwell's four equations are just Gauss (Ch.1) + Gauss-for-magnetism (Ch.4) + Faraday (Ch.6) + Ampère–Maxwell (Ch.5 + Ch.8) collected on one page. Teaching it after optics would mean re-teaching all four.
3. NCERT itself places it here — its chapter 8, immediately after AC.
4. Ray Optics needs sources this batch does not have to hand: its NCERT chapter would have to be fetched, and its spine is *DC Pandey Optics and Modern Physics*, not the attached *Electricity and Magnetism*.

> **✅ RESOLVED 2026-07-31 — the taxonomy has been renumbered, founder-authorised.** `ph12_em_waves` having `chapterType: 'electromagnetism'` while sitting at `sequence_order: 129` was an ordering slip, not an intent. Fixed in `packages/data/taxonomy/taxonomyData_from_csv.ts`:
>
> | Chapter | was | now |
> |---|---|---|
> | `ph12_em_waves` Electromagnetic Waves | 129 | **124** |
> | `ph12_ray_optics` Ray Optics | 124 | 125 |
> | `ph12_wave_optics` Wave Optics | 125 | 126 |
> | `ph12_dual_nature` Dual Nature of Matter | 126 | 127 |
> | `ph12_atoms` Atomic Physics | 127 | 128 |
> | `ph12_nuclei` Nuclear Physics | 128 | 129 |
>
> The Crucible class-12 physics order is now Electrostatics → … → AC → **EM Waves** → Ray Optics → Wave Optics → Dual Nature → Atoms → Nuclei → Semiconductors → Communication → Experimental, and the book's chapter numbering matches the taxonomy exactly with no departure left to document.
>
> **Why this was safe:** `sequence_order` is used *only* for display ordering — `packages/services/chapters.ts` sorts on it and maps it to `display_order`, as do the study-planner catalog, the Crucible server actions and `chapterCounts.ts`. Every cross-reference to a chapter (question `metadata.chapter_id`, the Live Book's `crucible_chapter_id`, topic-tag `parent_id`) is by **`id`**, which was not touched — so no question re-tagging or data migration was required. Verified after the edit: exactly 6 lines changed and nothing else (diff against a pre-edit snapshot), file still compiles (2730 nodes / 136 chapters intact), zero `class_level`+`sequence_order` collisions, and `validate-taxonomy-link.js class12-physics` passes with 0 errors.
>
> **One cosmetic follow-on:** `POST /api/v2/taxonomy/save` sorts nodes by `sequence_order` when it regenerates this file, so the next save from the admin taxonomy dashboard will physically move the EM Waves line up to sit after AC. That is line-order only — no value changes — and the loader/writer formats (`sequence_order: <n>`) match this manual edit byte-for-byte, so the round-trip is safe.

### The narrative payoff this ordering buys

Chapter 8 is the **capstone of the whole book**, and it should be written as one:

> Ch.1 gave you Gauss's law. Ch.4 gave you "no magnetic monopoles." Ch.6 gives you Faraday's law. Ch.5 gave you Ampère's law — and Ch.8 shows Ampère's law was *incomplete*, patches it, and the four together turn out to predict light itself, at a speed nobody put in by hand.

No other chapter in this book closes a loop that wide. §4's Ch.8 map is built around it.

---

## 2. Sources and how each may be used

**Correction to the original brief: nothing needs fetching from the NCERT website.** All three NCERT chapters were already on the drive; they were found during the Ch.1–5 NCERT-exercises pass.

| Source | Location | Role | Student-visible attribution |
|---|---|---|---|
| **NCERT Class 12** — `EMI.pdf`, `AC.pdf`, `EM Waves.pdf` | `~/iCloud Drive (Archive)/Kindle Converter/physics/ncert/` | **The spine of what must be covered.** Section order, worked examples, and the end-of-chapter exercises transcribed verbatim onto a dedicated page per chapter. | `source: 'ncert_exercise'` — badged. |
| *Understanding Physics — Electricity and Magnetism*, DC Pandey (Arihant) | founder-supplied PDF (attached) | **Pedagogy + JEE depth.** Covers **ch.27 EMI (pp.455–560)** and **ch.28 AC (pp.561–607)**. Contributes the material NCERT omits — see the table below. | **NEVER named.** Items adapted from it use `source: 'mcq'`, no badge ([[feedback_no_third_party_book_attribution]]). |
| *Understanding Physics — Optics and Modern Physics*, DC Pandey | same folder | **ch.29 Electromagnetic Waves (pp.1–19)** — the only DC Pandey coverage of Ch.8. A thin chapter; it confirms EM Waves is low-yield for JEE and should stay compact. | As above — never named. |
| **HC Verma, *Concepts of Physics*** | `~/…/physics/H C Verma.pdf` (958 pp, both volumes) | **ch.38 EMI · ch.39 AC · ch.40 EM Waves.** Conceptual framing and the famously good motional-EMF treatment. | Never named — `source: 'mcq'`. |
| **Pre-extracted HCV bank** | `_agents/question-banks/physics-hcv/chapters/ch38.json`, `ch39.json`, `ch40.json` | **Ready-made input, already parsed.** 31 MCQs + 24 worked examples across the three chapters, already sectioned. Use directly rather than re-extracting from the PDF. | Never named — `source: 'mcq'`. |

### What DC Pandey and HCV add that NCERT does not

This is the whole reason the reference books are in the loop. Each of these is a real gap in NCERT that JEE tests:

| Topic | NCERT | DC Pandey | Decision |
|---|---|---|---|
| **Growth & decay of current in an L-R circuit** | absent | §27.8 | **Include** (Ch.6 p13). It is the exact mirror of the C-R circuit already taught in Ch.2 p16 — the callback is free pedagogy. |
| **Induced (non-conservative) electric field** | one paragraph | §27.10 | **Include** (Ch.6 p14), marked `tier: 'competitive'`. JEE Advanced; the "E-field with no charges, whose loop integral isn't zero" idea genuinely disturbs students and is worth the page. |
| **Phasor algebra** | §7.3, lightly | §28.4 | **Include** (Ch.7 p4) — it is the tool that makes every later LCR page tractable. |
| **Series L-R and C-R as separate steps** | jumps straight to LCR (§7.6) | §28.5, §28.6 | **Include** (Ch.7 p8). NCERT's jump to three elements at once is the single steepest cliff in the chapter. |
| **LC oscillations** | §7.8 (in AC) | §27.9 (in EMI) | **Place at the START of Ch.7** — see §4's note. |
| **Eddy currents** | §6.8 | absent | Keep NCERT's treatment; DC Pandey skips it as low-yield, but the taxonomy has `tag_emi_5` for it and CBSE asks. |
| **AC generator** | §6.10 | absent | Keep, as the Ch.6 → Ch.7 bridge. |
| **Transformers** | §7.9 | absent | Keep — `tag_ac_5` exists and CBSE asks every year. |

---

## 3. Page budget and the shape of a page

Same rules as Ch.1–5: a page is **one sub-topic, ≤ ~18 blocks** (§15.8). Every content page carries a hook → core text → `heading[2]` blocks each with an `objective` → ≥1 **mid-page** check per major concept → worked examples (`worked_example`, or `step_solver` where the *method* is the lesson) → an anchor formula as a highlighted `latex_block` → a `real_world` card where there is a genuine story → a closing `inline_quiz` → a one-line bridge to the next page. Load-bearing terms go in `glossary`. Every page has ≥1 image block (`src: ''` + a dark-background `generation_prompt`).

| Ch | Title | Content pages | Opener | Practice & Mastery | NCERT Exercises | **Total** |
|---|---|---|---|---|---|---|
| 6 | Electromagnetic Induction | 15 | 1 | 1 | 1 | **18** |
| 7 | Alternating Current | 13 | 1 | 1 | 1 | **16** |
| 8 | Electromagnetic Waves | 9 | 1 | 1 | 1 | **12** |
| | **Total** | **37** | **3** | **3** | **3** | **46** |

Book goes 89 → **135 pages**.

### Two process changes carried over from the Ch.1–5 build

1. **The NCERT Exercises page is planned in from the start**, not bolted on afterwards. Last time it was a second pass over five finished chapters; folding it into the per-chapter build is strictly cheaper and keeps each chapter shippable on its own.
2. **Every page slug is chapter-prefixed from page 0** — e.g. `emi-ncert-exercises`, not `ncert-exercises`. `book_pages` has a unique index on `{book_id, slug}` that is **book-wide, not chapter-scoped**; generic slugs collided three times during the last build. This is now a rule, not a discovery.

---

## 4. Per-chapter page maps

### Ch.6 — Electromagnetic Induction (15 content pages)

| # | Page | Core content | Tag |
|---|---|---|---|
| 1 | The Experiment That Started It | Faraday & Henry; magnet moving toward a coil deflects a galvanometer; the *relative motion* is what matters; a current with no battery | — |
| 2 | Magnetic Flux | `Φ = B·A = BA cos θ`; the weber; flux through N turns; flux is a *scalar* with a sign; why flux and not field | `tag_emi_1` |
| 3 | Faraday's Law of Induction | `ε = −N dΦ/dt`; the **three** ways to change flux (change B, change A, change θ) — the organising idea of the whole chapter | `tag_emi_1` |
| 4 | Lenz's Law | The minus sign made physical; induced effect opposes the **change**, not the flux; the conservation-of-energy argument for why it must | `tag_emi_2` |
| 5 | Reading a Lenz's Law Situation | The method: find Φ direction → is it growing or shrinking → induced current opposes *that* → force/pole follows. Magnet-into-coil, coil-approaching, loop-leaving-a-field | `tag_emi_2` |
| 6 | Motional EMF | Rod on rails; `ε = Bvl`, derived **twice** — from the Lorentz force on carriers, and from `dΦ/dt` — and why the two must agree | `tag_emi_2` |
| 7 | Motional EMF in Other Geometries | Rotating rod `ε = ½Bωl²`; rod at an angle; the rotating disc; which length is "the" length | `tag_emi_2` |
| 8 | The Energy Account | Retarding force `F = B²l²v/R`; power supplied by the agent = power dissipated in R; induction never gives something for nothing (NCERT §6.7) | `tag_emi_2` |
| 9 | Eddy Currents | Induced loops in bulk metal; damping and magnetic braking; the induction furnace and hob; **why transformer cores are laminated** | `tag_emi_5` |
| 10 | Self-Inductance | `ε = −L di/dt`; the henry; L of a long solenoid derived; inductance as "electrical inertia" | `tag_emi_3` |
| 11 | Mutual Inductance | `ε₂ = −M di₁/dt`; `M` of two coaxial solenoids; `M₁₂ = M₂₁`; coefficient of coupling | `tag_emi_3` |
| 12 | Energy Stored in an Inductor | `U = ½Li²`; energy density `u = B²/2μ₀` — set beside Ch.2's `u = ½ε₀E²`, because the pair is the point | `tag_emi_4` |
| 13 | The L-R Circuit | Growth `i = i₀(1 − e^{−t/τ})`, decay, `τ = L/R`; **explicit callback to the C-R circuit of Ch.2 p16** — same shape, different physics. *Beyond NCERT (DC Pandey §27.8).* | `tag_emi_4` |
| 14 | The Induced Electric Field | A changing B makes an **E field with no charge anywhere**; `∮E·dl = −dΦ/dt ≠ 0`, so this E is **non-conservative** and has no potential. *Beyond NCERT (DC Pandey §27.10); all blocks `tier: 'competitive'`.* | `tag_emi_1` |
| 15 | The AC Generator | The payoff: rotate a coil in a field → `ε = ε₀ sin ωt`; slip rings; where mains electricity actually comes from. **Bridges directly into Ch.7** | `tag_emi_1` |
| 16 | Practice & Mastery | `practice_bank`, ~36 items | — |
| 17 | Practice — NCERT Exercises | 6.1–6.17, verbatim + fully solved (see §5 on the two skips) | — |

### Ch.7 — Alternating Current (13 content pages)

**LC oscillations opens this chapter rather than closing it.** NCERT puts it at §7.8 and DC Pandey at §27.9 (inside EMI); both work, but placing it *first* makes it the bridge: the student has just met inductors (Ch.6 p10–13), so "energy sloshing between L and C, exactly like a mass on a spring" motivates *why* an oscillating current is worth a whole chapter — and its `ω = 1/√(LC)` is the same number that reappears as resonance on p10, which lands as a payoff instead of a coincidence.

| # | Page | Core content | Tag |
|---|---|---|---|
| 1 | LC Oscillations | Charged C discharges through L, energy sloshes back and forth; `ω = 1/√(LC)`; the **exact** SHM analogy (q↔x, i↔v, L↔m, 1/C↔k); why a real circuit damps | `tag_ac_3` |
| 2 | What Alternating Current Is | `v = v₀ sin ωt`; frequency, period, why the world standardised on AC (transformers — forward-promise to p13) | `tag_ac_1` |
| 3 | RMS and Peak Values | Mean of a sine over a cycle is zero → mean of the *square* isn't; `I_rms = I₀/√2`; "220 V" is rms; what an AC ammeter reads | `tag_ac_1` |
| 4 | Phasors | The rotating-vector picture; projection = instantaneous value; phase differences become **angles between arrows**. The tool the rest of the chapter runs on | `tag_ac_1` |
| 5 | AC Through a Resistor | V and I in phase; `P_avg = V_rms I_rms` | `tag_ac_2` |
| 6 | AC Through an Inductor | Current **lags** by 90°; `X_L = ωL`; L blocks high frequency; average power is **zero** and why that isn't a paradox | `tag_ac_2` |
| 7 | AC Through a Capacitor | Current **leads** by 90°; `X_C = 1/ωC`; C blocks DC, passes high frequency; average power zero again | `tag_ac_2` |
| 8 | Two Elements at a Time — L-R and C-R | `Z = √(R² + X²)`, `tan φ = X/R`; the impedance triangle. *The step NCERT skips (DC Pandey §28.5–28.6)* | `tag_ac_2` |
| 9 | The Series LCR Circuit | `Z = √(R² + (X_L − X_C)²)`; phase angle; the full phasor diagram; when the circuit looks inductive vs capacitive | `tag_ac_3` |
| 10 | Resonance | `X_L = X_C` → `ω_r = 1/√(LC)` — **the same ω as p1**; Z minimum, current maximum, circuit looks purely resistive; tuning a radio | `tag_ac_3` |
| 11 | Sharpness of Resonance | Q-factor, bandwidth, selectivity; why a high-Q circuit is a better tuner but a worse amplifier of anything off-resonance | `tag_ac_3` |
| 12 | Power in an AC Circuit | `P = V_rms I_rms cos φ`; the power factor; **wattless current**; why industry is fined for a poor power factor | `tag_ac_4` |
| 13 | Transformers | `V_s/V_p = N_s/N_p`; step up/down; the four losses (copper, eddy, hysteresis, flux leakage) and the fix for each; why high-voltage transmission wins | `tag_ac_5` |
| 14 | Practice & Mastery | `practice_bank`, ~36 items | — |
| 15 | Practice — NCERT Exercises | 7.1–7.26, verbatim + fully solved | — |

### Ch.8 — Electromagnetic Waves (9 content pages)

| # | Page | Core content | Tag |
|---|---|---|---|
| 1 | The Crack in Ampère's Law | Charging capacitor: same loop, two surfaces, two different answers for `∮B·dl`. A law contradicting itself — set up as a genuine crisis before the fix | `tag_emw_1` |
| 2 | Displacement Current | `i_d = ε₀ dΦ_E/dt`; the Ampère–**Maxwell** law; a *changing electric field* is as good as a current at making B; the junction rule survives | `tag_emw_1` |
| 3 | Maxwell's Four Equations | **The capstone.** All four collected — Gauss (Ch.1), no monopoles (Ch.4), Faraday (Ch.6), Ampère–Maxwell (Ch.5 + p2). Stated, read in words, not derived | `tag_emw_1` |
| 4 | Light | `c = 1/√(μ₀ε₀)` from two constants measured in benchtop electricity experiments — and it comes out at the speed of light. The best moment in the book | `tag_emw_2` |
| 5 | The Structure of an EM Wave | E ⊥ B ⊥ direction of travel; **in phase**; `E₀/B₀ = c`; transverse; needs no medium | `tag_emw_2` |
| 6 | Energy and Intensity | Energy density split equally between the E and B halves; intensity `I = ½ε₀E₀²c`; inverse-square falloff from a point source | `tag_emw_2` |
| 7 | Momentum and Radiation Pressure | `p = U/c`; pressure `I/c` (absorbed) vs `2I/c` (reflected); solar sails; why a comet's tail points away from the Sun | `tag_emw_2` |
| 8 | Making and Catching EM Waves | Only **accelerating** charges radiate; the LC oscillator → antenna; dipole antenna reception; why the antenna length is tied to λ | `tag_emw_4` |
| 9 | The Electromagnetic Spectrum | Radio → micro → IR → visible → UV → X → γ, with real λ and f; what makes each; uses; ozone and the greenhouse effect as the two that matter | `tag_emw_3` |
| 10 | Practice & Mastery | `practice_bank`, ~30 items | — |
| 11 | Practice — NCERT Exercises | 8.1–8.15, verbatim + fully solved | — |

---

## 5. NCERT exercises — coverage known in advance

58 exercises across the three chapters. Unlike the Ch.1–5 pass, the figure-dependency audit is done **before** the build, so the skip list is not a mid-build discovery:

| Ch | Exercises | Figure-blocked — skip | Figure-referenced but fully specified in words — **include** |
|---|---|---|---|
| 6 EMI | 6.1–6.17 (17) | **6.1** (Fig 6.18a–f: six loop/magnet configurations that must be *seen*) · **6.2** (Fig 6.19: same) | 6.14 (rod on rails — all of l, B, R, v given) · 6.16 (wire + square loop — standard geometry, x and a given) · 6.17 (charged wheel — B field given algebraically) |
| 7 AC | 7.1–7.26 (26) | none | 7.11 (series LCR — L, C, R and source all given) |
| 8 EM Waves | 8.1–8.15 (15) | none | 8.1, 8.2 (parallel-plate capacitors — all dimensions given) |
| | **58** | **2** | — |

**56 of 58 expected to land.** Both skips are in Ch.6 and both are "predict the direction of the induced current in these six pictures" items — genuinely unanswerable without the pictures, and exactly the kind that must be flagged in-page via a `callout` rather than guessed at. If the founder supplies Fig 6.18 and 6.19 as images, both become buildable and the chapter goes to 17/17.

---

## 6. Cross-cutting authoring rules for this batch

Everything in [`PHYSICS12_EM_LIVEBOOK_PLAN.md`](PHYSICS12_EM_LIVEBOOK_PLAN.md) §5 still applies. Additions specific to these three chapters:

1. **Sign conventions are the whole game in Ch.6.** Fix one convention on p2 (flux positive along the chosen normal; `ε = −dΦ/dt`) and never silently switch it. Most student error here is sign error, not physics error.
2. **Lenz's law is a *method*, not a fact.** p5 exists to make it procedural. Use `step_solver` for the four-step routine, not prose.
3. **Reuse the Ch.2 ↔ Ch.6 mirror explicitly.** C-R (Ch.2 p16) and L-R (Ch.6 p13); `u = ½ε₀E²` (Ch.2 p14) and `u = B²/2μ₀` (Ch.6 p12). Both pages should *name* their partner and link the idea, so the book reads as one argument rather than eight.
4. **Phasors before LCR, always.** Any page from Ch.7 p9 onward may assume the phasor picture from p4.
5. **`tier: 'competitive'` is a per-BLOCK field** (it lives on `BaseBlockSchema`), so marking Ch.6 p14 competitive means stamping every block on it — there is no page-level flag.
6. **Ch.8 is short and must stay short.** Both reference books treat it as low-yield; the temptation is to pad it to match Ch.6's length. Resist. Nine content pages is right.
7. **Answer positions** run through the deterministic `spread()` hash in `_book.js`, as before. `checkSource()` already guards the `mcq()`/`q()` argument-order trap.

---

## 7. Build order and definition of done

Build **Ch.6 → Ch.7 → Ch.8**, in that order — Ch.7 p1 depends on Ch.6's inductor pages, and Ch.8 p2–3 depend on both.

Per chapter, in one pass:
1. Content pages in 3–4 script files (`build_ch6_a_*.js` … ), following the existing `scripts/physics12-book/` conventions and importing the unchanged `_book.js`.
2. Practice & Mastery page (~36 items, Exemplar-badged where genuine, else `source: 'mcq'`).
3. NCERT Exercises page (verbatim, fully solved, `source: 'ncert_exercise'`, chapter-prefixed slug).
4. Gate: `node scripts/physics12-book/_hygiene.js <n>` → `npx tsx scripts/physics12-book/_validate.mts` → `node scripts/physics12-book/_latex_check.js`. **All three must report 0 findings** before the chapter is called done.
5. `node scripts/livebooks-state.js`, then the §0.5 check-out ritual (state changelog + cockpit row).

**Definition of done for the batch:** 46 new pages, all `published: false`; three QA tools clean across all 135 pages; taxonomy link verified by `validate-taxonomy-link.js`; every page carrying image slots with authored dark-background prompts; **no simulations built** (§ below).

---

## 8. Open calls for the founder

1. ~~**Renumber `ph12_em_waves` from 129 → 124 in the taxonomy?**~~ — **✅ DONE 2026-07-31, founder-authorised.** See §1 for the full before/after table, the safety argument, and the verification. The taxonomy and the book now agree; there is no departure left.
2. **Supply NCERT Fig 6.18 and Fig 6.19?** (§5.) Two images unlock the only two exercises we cannot otherwise build, taking Ch.6 to 17/17. *Still open — non-blocking.*
3. **Is `tier: 'competitive'` right for Ch.6 p14 (induced electric field)?** It is genuinely JEE-Advanced-only. The alternative is dropping the page entirely; the recommendation is to keep it marked rather than lose it, since it is the conceptual key to *why* Faraday's law is a field law and not a circuit law. *Still open — built as `competitive` in the meantime, trivially reversible.*

## 9. Simulation slots — reserved, not built

Per the standing instruction, **no `simulation` block is authored in this pass** (an unbuilt `simulation_id` renders as a dead block). Pages are shaped so a sim drops in later without restructuring:

| Ch | Page | Reserved sim |
|---|---|---|
| 6 | p2 Magnetic Flux | Flux explorer — tilt/resize a loop in a field, watch `BA cos θ` |
| 6 | p5 Reading a Lenz's Law Situation | Magnet-through-coil bench — drag a magnet, see induced current and the opposing pole |
| 6 | p6 Motional EMF | Rod-on-rails bench — drag the rod, read ε, force and power live |
| 6 | p9 Eddy Currents | Eddy-brake — solid vs slotted plate swinging through a field |
| 7 | p4 Phasors | Phasor bench — rotating vectors alongside the waveform they generate |
| 7 | p10 Resonance | LCR sweep — drag the drive frequency, watch Z dip and current peak |
| 7 | p13 Transformers | Transformer bench — turns ratio in, voltage/current out, losses visible |
| 8 | p2 Displacement Current | Charging-capacitor viz — the two surfaces of the same loop |
| 8 | p5 Structure of an EM Wave | 3-D E⊥B⊥k propagation |
| 8 | p9 The Spectrum | Spectrum explorer — scrub λ, see f, energy, source and use |
