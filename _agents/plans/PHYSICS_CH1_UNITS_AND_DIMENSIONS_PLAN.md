# Class 11 Physics — Chapter 1: "Units and Dimensions" — build plan

**Status:** 🟡 Planned, not built (2026-07-29). Awaiting founder approval of scope + the four open decisions in §7.

**Standardised status header**
- **Owner:** agent-maintained, founder-directed
- **Chapter title:** **"Units and Dimensions"** (founder decision — matches the Crucible physics taxonomy prefix `UNIT`; NCERT's own title is "Units and Measurement").
- **Book:** `class11-physics` · `chapter_number: 1` (sorts after Ch.0 "Mathematics in Physics")
- **Sources read end-to-end for this plan:**
  1. **NCERT Class 11 Physics, Ch.1 "Units and Measurement"** — rationalised 2026-27 reprint, 12 pp. (`~/iCloud Drive (Archive)/…/Class 11 Physics NCERT/CH 1 - UNITS AND MEASUREMENT.pdf`). **This is the structural spine.**
  2. **"Units, Dimensions and Error Analysis"**, *Objective Physics* Vol. 1, ch.1, 31 pp. (founder-supplied). **Enrichment + problem layer only.** Per the standing no-third-party-attribution rule, **no student-facing badge ever names this book**; only NCERT / NCERT Exemplar / CBSE PYQ / JEE PYQ may be labelled.
- **House rules inherited (non-negotiable):** [`PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md`](PHYSICS_CH0_HCVERMA_GAP_ANALYSIS.md) §4A (a)–(g) and §6. This chapter is authored to them **from page one** rather than reworked into them.
- **Next action:** build (approved 2026-07-29).
- **Blocked on:** nothing.

> **FOUNDER DECISIONS — 2026-07-29 (these supersede §7 as originally drafted):**
> 1. **Vernier callipers and the screw gauge are OUT of this chapter** — they move to a dedicated **Experimental Physics** chapter. Reason: dropping instrument practicals on students in the opening weeks of the year does not land well; this chapter stays on fundamentals. The **Measurement Lab sim is cancelled** and the two instrument pages are cut.
> 2. **16 pages**, firm. The chapter is not to be inflated.
> 3. **Dimension Lab is a required build** — the one simulation in the chapter. It must let students *practise and visualise how a dimensional formula is defined and how it changes across quantities*, and it must **solve a real problem, not be a fancy interface**.
> 4. **Visual brief:** no boxes · elegant, professional · no very-bright and no very-dull colours · optimised font size · **few distinct font sizes** · text colours must not be dull.
> 5. After the pages are built, the agent runs its **own page-by-page, feature-by-feature review** and reports the gaps — especially where more questions are needed, and especially on the simulation.

---

## 1. What each source actually contains

### 1.1 NCERT (the spine) — and what it quietly dropped

| § | Content | Notes |
|---|---|---|
| 1.1 | Measurement = comparison with a unit; base vs derived units; system of units | 1 column of text |
| 1.2 | CGS/FPS/MKS → SI; the **seven base units with their 2019 fixed-constant definitions** (Table 1.1); radian + steradian as dimensionless supplements; **Table 1.2** non-SI units retained (min, h, d, y, degree, litre, tonne, carat, bar, curie, roentgen, quintal, barn, are, hectare, atm); prefixes → Appendix A2 | NCERT prints a footnote on Table 1.1: the definition values *"need not be remembered or asked in a test."* We honour that. |
| 1.3 | Significant figures: reliable digits + first uncertain digit; 5 counting rules; the trailing-zero ambiguity; scientific notation `a × 10^b` as the fix; **order of magnitude**; exact numbers have infinite sig figs | |
| 1.3.1 | Arithmetic: ×/÷ → fewest **significant figures**; +/− → fewest **decimal places** | Examples 1.1, 1.2 |
| 1.3.2 | Rounding, incl. the **round-half-to-even** convention (2.745→2.74, 2.735→2.74); keep one extra digit in intermediate steps (the 1/9.58 worked demo) | |
| 1.3.3 | Uncertainty in calculated results — `l = 16.2 ± 0.1 cm` → `lb = 164 ± 3 cm²`; relative error depends on both n and the value (1.02 g vs 9.89 g) | **This is the only error content that survives.** |
| 1.4 | Dimensions; the seven base dimensions `[L][M][T][A][K][cd][mol]` | |
| 1.5 | Dimensional formulae and dimensional equations | |
| 1.6 | Dimensional analysis: **1.6.1** checking consistency (principle of homogeneity; *dimensionally correct ≠ correct*; args of trig/log/exp must be dimensionless), **1.6.2** deducing relations — the pendulum `T = k√(l/g)` | Examples 1.3, 1.4, 1.5 |
| — | Summary (11 points) + **Exercises 1.1–1.17** | 17 exercises, all usable verbatim |

**What the rationalised edition removed** (present in the pre-2022 book, still fully examined in JEE/NEET):
- the whole *Measurement of Length / Mass / Time* section — parallax, vernier callipers, screw gauge, least count;
- the standalone *Accuracy, Precision and Errors in Measurement* section — systematic vs random error, absolute / mean-absolute / relative / percentage error, and **combination of errors for products, quotients and powers**.

That deletion is the single biggest reason this chapter needs a second source.

### 1.2 Objective Physics — what it adds that NCERT no longer has

| # | Addition | Exam weight | Where it lands |
|---|---|---|---|
| A1 | **Full error analysis** — systematic vs random; absolute, mean absolute, relative, percentage error; **combination of errors** for `a ± b`, `ab`, `a/b`, and `x = aⁿ/bᵐ → Δx/x = n(Δa/a) + m(Δb/b)`, each with a derivation | Very high | p10–p12 |
| A2 | **Least count** — vernier `LC = 1 MSD − 1 VSD`, screw gauge `LC = pitch / CSD`, least-count error, zero error | Very high — **8 of the 20 Entrance-Gallery PYQs (2011–14) are vernier / screw-gauge / Searle's** | p8–p9 |
| A3 | **Conversion between unit systems** — `n₁[M₁ᵃL₁ᵇT₁ᶜ] = n₂[M₂ᵃL₂ᵇT₂ᶜ]`, worked on G (SI→CGS), the calorie `4.2 α⁻¹β⁻²γ²`, "1 J in a new system" | High; NCERT gives the *idea*, never the machinery | p4 |
| A4 | **A 37-row dimensional-formula table** reaching into electricity, magnetism and heat (ε₀, resistance, capacitance, inductance, magnetic field, Planck, Boltzmann, gas constant, Stefan, Wien, viscosity, thermal conductivity) | High — the raw material for every "same dimensions?" question | p13 reference table |
| A5 | **Practical units + order-of-magnitude tables** — Å 10⁻¹⁰, fermi 10⁻¹⁵, AU 1.496×10¹¹ m, light-year 9.46×10¹⁵ m, parsec 3.08×10¹⁶ m; length 10²⁶→10⁻¹⁵ m, mass 10³⁰→10⁻³⁰ kg, time 10¹⁷→10⁻²⁴ s | Medium-high | p3 |
| A6 | **Limitations of dimensional analysis**, stated as three explicit rules; dimensional vs non-dimensional constants; the `F = ma` "looks dimensionally wrong" subtlety | High | p14 |
| A7 | **Derivation with three unknowns** — stretched-string frequency `f = (1/2l)√(F/µ)`, centripetal force `F = mv²/r`, the river-stone `m ∝ v⁶` | High | p14 |
| A8 | **Problem families we have none of** (see §5) | — | p15, p18 |

**Problem pool available:** 15 in-section examples + 16 additional examples + 19 NCERT-selected solved + 90 Level-1 objectives + 45 Level-2 (20 single-correct, 3 multi-correct, 17 assertion-reason, 5 match-the-columns) + 20 Entrance-Gallery PYQs (2011–2014) ≈ **205 items**, plus NCERT's own 17 exercises ≈ **222 total**.

### 1.3 Source conflicts found while reading — resolved here, before authoring

These are recorded so no page author has to re-litigate them, and so nothing wrong reaches a student.

| # | Conflict | Resolution |
|---|---|---|
| C1 | Objective Physics gives the **pre-2019 SI definitions** (kilogram = the Sèvres prototype cylinder; kelvin = 1/273.16 of the triple point of water; ampere = force between two wires; mole = atoms in 12 g of C-12). NCERT's current reprint uses the **2019 fixed-constant definitions** (h, Δν_Cs, e, k, N_A). | **NCERT wins — teach the modern definition.** The old form appears once, in a short "what older books say" note, because students will meet it in coaching material. |
| C2 | Objective Physics Level-2 Q4: random error in the mean of 100 observations is `x`; for 400 observations the book answers **`x/4`**. Standard error of the mean falls as `1/√N`, so 4× the readings → **`x/2`**. | **The book's answer is wrong. The item is excluded**, and the correct `1/√N` statement is taught on p10 with a small table. |
| C3 | Objective Physics Level-1 Q90: is `sₙ = u + a(2n−1)/2` dimensionally correct? The book's key says "both dimensionally and numerically correct." The expression as printed adds a velocity to an acceleration; it is only consistent once the implicit `1 s` factors are restored. | **Not used as a graded MCQ.** It becomes a `reasoning_prompt` discussion item on p14 — it is an excellent illustration of *why* dimensional bookkeeping needs the hidden unit factors. |
| C4 | Objective Physics carries `1 ly = 9.46×10¹⁵ m`; NCERT carries `1 y = 365.25 d = 3.156×10⁷ s`. | No conflict — both used, cross-checked (`3×10⁸ × 3.156×10⁷ ≈ 9.5×10¹⁵ m` ✓). Shown as a consistency check on p3. |

**Rule 0 applies throughout:** every question, table row and numeric value is transcribed from the source PDF, never generated from memory. Anything that cannot be read cleanly is marked `NEEDS_REVIEW` rather than reconstructed.

---

## 2. Design principles specific to this chapter

1. **This chapter is where a physics student learns to be honest about numbers.** The through-line is one sentence, stated on p1 and paid off on p12: *a measurement is a number, a unit, and an admission of how much you don't know.*
2. **Two spines, clearly separated.** Pages 1–12 are *measurement* (units → sig figs → instruments → errors). Pages 13–15 are *dimensions*. The founder's title, "Units and Dimensions", names both.
3. **Every JEE-only addition is bracketed.** A1, A2, A3, A6, A7 are not in the rationalised NCERT. Each gets the same "Note on Scope" callout the Math book uses, plus `tier: 'competitive'` where a board-only student can safely skip.
4. **`step_solver` is the default teaching vehicle.** `worked_example` is reference-only. Target: ≥22 `step_solver` blocks in the chapter, ≤6 `worked_example`.
5. **Exposition caps at ~120 words between practice items** and the rule arrives as a conclusion, not an announcement (house rules §4A(a), §6).
6. **Nothing is asserted that can be derived in three lines** (§4A(c)) — the ± error rule, the product rule and the power rule are each three gated steps, not a formula box.

---

## 3. Page-by-page design (19 pages)

Legend for blocks: `SS` = `step_solver`, `YSI` = end-of-page "You solve it" strip (a one-section `practice_bank`, see §4.3), `IQ` = `inline_quiz`, `RP` = `reasoning_prompt`, `CE` = `classify_exercise`, `GE` = `group_elements`, `SIM` = `simulation`.

| # | Page | Opens with (the situation) | The rule that falls out | Source | Interactives | Practice |
|---|---|---|---|---|---|---|
| 0 | Chapter opener | auto per §15.1 | — | — | — | — |
| 1 | **A Number Is Half an Answer** | Two students measure the same desk in hand-spans and get 7 and 9. Neither is wrong. | Measurement = comparison to an agreed unit; **`n × u = constant`** — halve the unit and the number doubles. This one relation returns on p4 as the conversion engine. | NCERT §1.1 | — | 1 SS + IQ ×3 + YSI ×4 |
| 2 | **Seven Is Enough** | A list of 12 quantities; student marks which ones could be defined without borrowing another. | Base vs derived quantities; **the seven SI base units** + symbols and writing conventions (`10 kg` not `10 kgs`, `K` not `°K`, no plural on symbols); radian & steradian as dimensionless supplements. 2019 definitions in one plain line each, with NCERT's own "need not be memorised" note. C1 note on older books. | NCERT §1.2, Table 1.1, Fig 1.1 | `CE` base vs derived | 2 SS + CE + IQ ×3 + YSI ×4 |
| 3 | **From a Proton to the Universe** | The scale strip: 10⁻¹⁵ m → 10²⁶ m on one line. | SI prefixes; the non-SI survivors (litre, tonne, bar, atm, hectare, barn, curie, carat); practical units Å / fermi / AU / light-year / parsec; **order of magnitude** (round `a` to 1 if `a ≤ 5`, else to 10) and NCERT's "earth is 17 orders of magnitude wider than a hydrogen atom". C4 cross-check. | NCERT §1.2 Table 1.2, §1.3 order-of-magnitude; OP A5 | **`unit-conversion-arena`** (already built — prefix ladder + the cm³ cube trap) | 2 SS + IQ ×3 + YSI ×4 |
| 4 | **Changing the Ruler** | "G = 6.67×10⁻¹¹ in SI. What is it in CGS?" — asked before any method is given. | `n₁u₁ = n₂u₂` generalised: `n₂ = n₁[M₁/M₂]ᵃ[L₁/L₂]ᵇ[T₁/T₂]ᶜ`. Worked on G, on the calorie (`4.2 α⁻¹β⁻²γ²`, NCERT Ex 1.3), and on "1 J in a 10 kg / 1 km / 1 min system". | OP A3; NCERT Ex 1.3 | — | 3 SS + IQ ×3 + YSI ×5 · **`tier: competitive`** partial |
| 5 | **The Doubtful Digit** | A metre scale against an object whose end sits between the 10.4 and 10.5 cm marks. You split the millimetre by eye and write 10.46 — the 6 is a *guess*. | The last digit of any measurement is a judgement call. **That is where significant figures are born** (house rule §4A(f)) — so the counting rules arrive as a formalisation of something already felt, not as a list. Trailing-zero ambiguity (4700 mm) and scientific notation as its cure; *changing the unit cannot change the count*; exact numbers (the 2 in `r = d/2`, the 2π in `T = 2π√(L/g)`) have infinite sig figs. Precision vs accuracy separated at the end. | NCERT §1.3 opening + rules (1)–(6); OP Rules 1–7 | `CE` "which zeros count" | 2 SS + CE + RP + IQ ×3 + YSI ×5 |
| 6 | **Arithmetic Without Lying** | `4.237 g / 2.51 cm³` on a calculator = 1.68804780876. Why is writing all of that a *mistake*? | ×/÷ keep the fewest **significant figures**; +/− keep the fewest **decimal places**; rounding, incl. **round-half-to-even**; carry one extra digit through intermediate steps. | NCERT §1.3.1–1.3.2, Ex 1.1, 1.2; OP Ex 1.7–1.10 | — | 3 SS + IQ ×3 + YSI ×5 |
| 7 | **Where Errors Come From** | Five real readings of one wire: 2.620, 2.625, 2.630, 2.628, 2.626 cm. They disagree. Now what? | Systematic vs random error; mean as best estimate; **absolute → mean absolute → relative → percentage error**; why more readings help, and that the gain goes as `1/√N` (C2 corrected). | OP §1.3, Ex 1.1, Additional Ex 8, 15 | — | 2 SS + IQ ×3 + YSI ×5 |
| 8 | **When Errors Combine — Sums and Products** | `V₁ = 10.2 ± 0.02`, `V₂ = 6.4 ± 0.01`. What is `V₁ + V₂`, error and all? | Derived, not asserted (3 gated steps each): **for `a ± b` the absolute errors add; for `ab` and `a/b` the relative errors add.** | OP "Combination of Errors" (i)–(iii), Ex 1.2, 1.3 | — | 3 SS + IQ ×3 + YSI ×5 |
| 9 | **When Errors Combine — Powers** | `T = 2π√(L/g)`. You measure L to 1% and T to 2%. How wrong is g? | `x = aⁿ/bᵐ ⇒ Δx/x = n(Δa/a) + m(Δb/b)`; the exponent is a **multiplier on your carelessness**; therefore *which measurement should you improve first?* | OP (iv), Ex 1.4, 1.5, 1.6; NCERT §1.3.3 | — | 3 SS + IQ ×3 + YSI ×6 · **`tier: competitive`** |
| 10 | **What a Quantity Is Made Of** | Density = mass / length³. Strip the numbers away — what's left? | Dimensions; `[M L T A K mol cd]`; dimensional formula vs dimensional **equation**; dimensionless quantities (angle, strain, refractive index); dimensional vs non-dimensional constants. Ships the **reference table** (mechanics rows first; electricity/heat rows `tier: competitive`). | NCERT §1.4–1.5; OP Table 1.8 + p.9 table | **Dimension Lab — Build + Match** (new, §4.1) | 2 SS + SIM + IQ ×3 + YSI ×5 |
| 11 | **Three Things Dimensions Let You Do** | `½mv² = mgh` — true or false, without knowing any mechanics? | (1) **Check homogeneity** (and the trig/log/exp argument rule); (2) **convert systems** (callback to p4); (3) **derive a relation** — the pendulum, then the stretched string `f = (k/l)√(F/µ)` with three unknowns. Then the **three limitations**, honestly (§4A(g)). C3 lives here as the `RP`. | NCERT §1.6, Ex 1.3–1.5; OP A6, A7 | **Dimension Lab — Check mode** | 4 SS + SIM + RP + IQ ×3 + YSI ×6 |
| 12 | **The Patterns Examiners Reuse** | Four expressions; find the two that must have the same dimensions. | The recurring families: work / energy / torque; pressure / stress / Young's modulus / energy density; impulse / momentum; Planck's constant / angular momentum; `L/R`, `CR`, `√(LC)` all = time. Plus the *"find `a` and `b` in `F = at + bt²`"* and *"the argument of a sine must be dimensionless"* templates. | OP Level-1 Q10–57, Level-2, Match-the-Columns | `GE` matching game | 2 SS + GE + IQ ×4 + YSI ×6 · **`tier: competitive`** |
| 13 | **Recap** | — | Retrieval only — `mind_map` + a formula table + 2 reasoning self-checks + an 8-Q integrative quiz. **Zero summary paragraphs** (Dunlosky et al. 2013), matching the Class-12 Bio recap pilot. | — | `mind_map` | 8-Q quiz |
| 14 | **Practice — NCERT Exercises** | — | All **17 NCERT exercises verbatim** (Rule 0), regrouped into 4 themes, each a tap-to-reveal worked solution in teacher voice. | NCERT Exercises 1.1–1.17 | — | 17 items |
| 15 | **Practice — JEE & NEET Drill** | — | ~45-item bank in 5 sections: sig figs & rounding · units, conversion & order of magnitude · error propagation · dimensional formulae · dimensional analysis & traps. | Reworded from OP Level 1/2 (**no source badge**) + Entrance-Gallery items (**labelled by exam + year only**) | — | ~45 items |

**Page count: 16 (p0–p15), per the founder's decision.** Reached from the drafted 19 by cutting the two instrument pages (→ Experimental Physics) and merging the doubtful-digit page into significant figures — which is a better page anyway, because it lets the counting rules arrive as the formalisation of the metre-scale act rather than as a separate rule list.

**Instrument content explicitly deferred to the Experimental Physics chapter:** vernier callipers (`LC = 1 MSD − 1 VSD`, MSR + VSD×LC, zero error), screw gauge (pitch, `LC = pitch/CSD`, zero error), Searle's method, and the 8 instrument PYQs from the Entrance Gallery (2011–14). The **least count of a plain metre scale stays** on p5 — it is the origin of the doubtful digit, not an instrument practical.

---

## 4. Interactives — what to build, what to reuse, what to skip

Governed by §4E: *don't build a sim unless the page would be substantively weaker without one.*

### 4.1 BUILD — "Dimension Lab" (`simulation_id: dimension-lab`) — the chapter's only sim

**The problem it solves.** Students memorise `[ML²T⁻²]` as a string of symbols. They cannot *derive* it, so under exam pressure they misremember an exponent's sign, and they cannot see why torque and work land on the same triple. The sim attacks exactly those three failures, one mode each. It is a drill instrument, not a display.

| Mode | Page | What the student does | The failure it fixes |
|---|---|---|---|
| **Build** | p10 | Pick a quantity. Its **defining equation** appears (force = mass × acceleration). Tap each factor in turn; that factor's dimensions drop into a live **M / L / T exponent ledger**, and the running formula rewrites itself after every tap. Nothing is pre-filled — the formula is *assembled by the student's own taps*. | "Where does `[MLT⁻²]` come from?" — replaces memorising with deriving. The exponent arithmetic (`T⁻¹` twice → `T⁻²`) happens in front of them. |
| **Match** | p10 | Given a quantity name, set the three exponent steppers to its dimensional formula and check. Wrong answers say **which exponent is off and in which direction**, never just "wrong". On a correct answer the sim names **every other quantity sharing that triple** ("this is also torque, and energy"). | Recall speed + the same-dimensions families, learned by collision rather than by table-reading. Feeds p12 directly. |
| **Check** | p11 | An equation with 2–4 terms. Tap a term → its dimensions are computed and shown on a shared baseline. The term that does not match the others is exposed by comparison, not by being coloured in advance. Includes the trig/log/exp-argument cases. | The principle of homogeneity, performed instead of stated. This is the actual JEE skill in "rule out the wrong formula" items. |

**Content:** ~30 quantities across mechanics (the p10 core) and electricity/heat (`tier: competitive`), each carrying its defining equation, its factor breakdown, and its exponent triple, sourced from NCERT §1.5 and the objective book's dimensional table. ~10 homogeneity equations for Check mode, including two that are dimensionally correct but physically wrong — because "dimensionally correct ≠ correct" is a NCERT point that only lands if the student meets a counterexample.

**Visual brief (founder, 2026-07-29) — binding:**
- **No boxes.** No bordered cards, no pill chrome, no panel outlines. Structure comes from whitespace and hairline dividers only. Mode switching uses the underline tab pattern (`SimTabs`, §4g), not boxed buttons.
- **Exactly three type sizes** across the whole component: a display size for the assembling formula, a base size for prose and controls, and one small caps label size. No fourth size.
- **Colour:** one primary accent + one secondary (the two-colour rule), both light-tier — the second axis here is genuinely real (the *equation* vs the *ledger it feeds*). Pass/fail uses the sanctioned `OK`/`BAD` pair only.
- **Text colours must not be dull.** Body text sits at `TEXT.primary`/`TEXT.secondary`; the `TEXT.muted` tier is used only for true micro-labels, never for anything a student has to read.

Composes the `_shared` chrome (`SimShell`, `SimHeader`, `SimTabs`, `SectionLabel`) so it cannot drift from the design system, and must pass `npm run lint:sims`.

### 4.2 CANCELLED — "Measurement Lab"

Designed as the chapter flagship (metre scale → vernier → screw gauge) and **cancelled by the founder on 2026-07-29** along with the instrument pages. The rationale for building it — 8 of the 20 Entrance-Gallery PYQs are instrument items — **still holds, but for the Experimental Physics chapter**, where it should be revived. Recording it here so the analysis is not lost: the argument for interactivity is that reading a vernier is a spatial pattern-match learned by *hunting* for the aligned division, which a printed diagram cannot teach because it has already done the hunting.

### 4.3 REUSE — zero new code

| Need | Existing asset |
|---|---|
| SI prefixes, the cm³ cube trap | **`unit-conversion-arena`** — already built for Class 11 Chemistry Ch.1, drops straight onto p3 |
| Base vs derived, "which zeros count" | `classify_exercise` |
| "Same dimensions?" matching | `group_elements` |
| Every worked derivation | `step_solver` (with `check` gating + `now_you_try`) |
| End-of-page "You solve it" strip | a one-section **`practice_bank`** block placed at page end — the §4A recommendation-3 strip needs **no new block type**. (Note: the existing `you_solve_it` block is the Social-Science trade-off mechanic and is *not* this.) |
| Chapter recap | `mind_map` |

### 4.4 SKIP

A dedicated significant-figures sim, and a dedicated error-propagation sim beyond mode (c) above. Both are symbolic-rule skills; `step_solver` plus volume of drill teaches them better than a canvas would.

---

## 5. Problem-type coverage (the sharper gap, per §4 of the gap analysis)

The chapter must carry all of these families, not just definition-restatement:

1. **Read-the-instrument** — given MSR/VSR/pitch/CSD, produce the reading. (Entrance Gallery 2011–13.)
2. **Reverse / constraint** — "which device is most precise?", "a student wrote 3.50 cm; which instrument did they use?" (NCERT Ex 1.6; JEE Main 2014.)
3. **Error-chain** — momentum error +100% → KE error 300%; parallel-resistor error; `Q = A³B³/(C√D)`; Searle's *which measurement dominates*.
4. **Dimensional detective** — `F = at + bt²`; `p = (a − t²)/bx`; `y = a sin(2πt/T)` rule-out-the-wrong-formula; `√(hc/G)` → a mass.
5. **New-system-of-units** — energy/velocity/force as fundamentals → `[m] = [E v⁻²]`; "1 N in a quintal–km–hour system".
6. **Estimation / order-of-magnitude** — molar volume ÷ atomic volume ≈ 7×10⁴ and *why*; density of the Sun; SONAR distance; quasar distance. (NCERT Ex 1.14–1.17.)
7. **"Can you…?" conceptual probes** — can a quantity have a unit but no dimensions (yes: angle)? Neither unit nor dimension (yes: strain)? These become `reasoning_prompt`s with no auto-answer.
8. **Assertion–reason** — 17 available; a JEE-Main-shaped format worth carrying in the p18 bank.

---

## 6. Practice budget and hygiene

| Vehicle | Count | Action required before an answer? |
|---|---|---|
| `step_solver` steps with a `check` gate | ~22 blocks × ~3 gated steps | ✅ |
| `step_solver.now_you_try` | ~22 | ✅ |
| End-of-page `YSI` strips | 15 pages × 4–6 = ~72 | ✅ |
| `inline_quiz` | ~48 | ✅ |
| `classify_exercise` / `group_elements` | 4 | ✅ |
| `reasoning_prompt` | ~6 | ✅ (no auto-answer) |
| NCERT exercises (p17) | 17 | tap-to-reveal |
| JEE/NEET bank (p18) | ~45 | ✅ |
| `worked_example` (reference only) | ≤6 | ❌ |

**≈ 240 items, ~95% action-gated** — against Ch.0's launch state of ~39 items at 13%. This is the number that matters.

**Hygiene gates before any insert** (each has burned us before):
- Tally `correct_index` frequency across the whole chapter **before** insertion — target an even A/B/C/D spread. (Recurred twice: Social Science, Math.)
- Zero length-tells — the correct option must not be the longest.
- Every quiz question carries a `difficulty_level`.
- Distractors are real misconceptions: the decade slip, linear-instead-of-cubic, adding relative errors where absolute belong, forgetting the exponent multiplier, `1 MSD` mistaken for `LC`.
- No `null` in any block field (the Zod `.optional()` trap).
- No third-party book badge anywhere; `source: 'jee_neet'` only on genuine PYQs, labelled by exam + year.

---

## 7. Decisions — RESOLVED 2026-07-29

All four open decisions were settled by the founder; see the block in the status header. Summary: **16 pages** · **instruments out** (→ Experimental Physics, sim cancelled) · **Dimension Lab built** to the visual brief in §4.1 · **Ch.1 built now**, ahead of the Ch.0 rework.

---

## 8. Build sequence

**Wave 1 — Dimension Lab.** Build and register the sim first, so pages 10–11 are authored around a component that actually works (the Ch.0 lesson: 8 defects were found only by driving the UI).

**Wave 2 — the measurement spine (p0–p9).** No engine needed; `unit-conversion-arena` reused on p3.

**Wave 3 — dimensions + close-out (p10–p15).**

**Wave 4 — self-review.** Page-by-page, feature-by-feature, per the founder's instruction: where are more questions needed, and does the simulation solve a problem or merely decorate one.

Every wave: all writes through `scripts/lib/book-writer.js` (versioned, content-loss-guarded, soft-delete only) per §0.6; every page `_validate.mts`-clean; `published:false` pending founder review; `LIVE_BOOKS_STATE.md` + `PROJECTS.md` refreshed at wave end.
