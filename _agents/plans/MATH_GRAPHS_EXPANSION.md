# Math Live Book — "Meet the Graphs" expansion (from *Play with Graphs*)

> **STATUS UPDATE 2026-07-25 (later): BUILT.** Tier-1 (exp/log page in Ch.0) AND Tier-2 (the
> crown jewel) are both shipped. **NEW Chapter 6 "Transforming Graphs" (7 pages)** covers
> reflections + the 3 modulus transforms |f(x)|/f(|x|)/|y|=f(x) (animated) + solve-by-crossings +
> addition of ordinates + practice. Engine got **5 new archetypes** (`modulus-abs-f`,
> `modulus-inner-abs`, `modulus-abs-y`, `intersection-counter`, `exp-base-explorer`). A real-user
> visual QA pass verified every interactive renders (no overlaps) and fixed the aˣ-curve
> spec-slider-`^` bug (→ `exp-base-explorer`). Base-family rounding (cube-root/1/x²/{x}) was judged
> low-value/finicky and deferred. Details: `LIVE_BOOKS_STATE.md` 2026-07-25 changelog.

> **Original plan (2026-07-25):** Founder direction: keep it **tight (1–2 chapters, not 3)**,
> cover the **JEE-important graphs precisely**, **warm teacher + pen-narration** voice, and a
> **strong practice set after each graph**. Start with **Tier 1 (existing engine, no code)**.
> Source study: *Play with Graphs* (Amit M. Agarwal, Arihant), analysed page-by-page 2026-07-25.
> Companion: [`MATH_BOOK_PAGE_WORKFLOW.md`](../workflows/MATH_BOOK_PAGE_WORKFLOW.md),
> [`MATH_LIVEBOOK_PLAN.md`](MATH_LIVEBOOK_PLAN.md).

## 1. Why this exists
Our Ch.0 "Meet the Graphs" (9 pages) covers 6 base shapes (line, parabola/power, |x|, 1/x, √x) +
the 4 continuous transforms (a,b,h,k). *Play with Graphs* teaches ~3× the base library and a
**24-rule transformation catalog** — and it stops exactly where the distinctively-JEE "play"
content begins. We are **not building a replica** — we lift the gaps that (a) are JEE-important
and (b) have **no home in another existing chapter**.

## 2. What the rest of the math livebook already owns (do NOT duplicate)
Class 11 math book = Ch.0 Meet the Graphs · Ch.1 Sets · Ch.2 Relations & Functions ·
Ch.3 **Trigonometric Functions** · Ch.4 Complex Numbers · Ch.5 Linear Inequalities.
- **Trig graphs (sin/cos/tan/…)** → owned by **Ch.3** (unit-circle archetype). Skip.
- **Greatest-integer [x] & signum** → appear in **Ch.2 R&F**. Skip / cross-reference only.

## 3. Genuine gaps for "Meet the Graphs" (JEE-important, uncovered)
| Gap | Home? | Tier | Buildable today? |
|---|---|---|---|
| **Exponential eˣ / aˣ + Logarithm log x** (taught via reflection across y=x) | none | **1** | ✅ spec + sliders |
| **Fractional part {x}, cube-root, 1/x²** (round out the base family) | none | **1** | ✅ (cube-root needs `sign(x)·\|x\|^⅓`; {x} via step archetype) |
| **★ Modulus transforms `\|f(x)\|` (fold up), `f(\|x\|)` (mirror-discard), `\|y\|=f(x)` (reflect down)** | none | **2** | ❌ needs 3 new archetypes (fold animation) |
| **Solving equations graphically** (draw both sides, count intersections) | none | **2** | ❌ needs intersection-counter archetype |
| **Combining: max/min envelope, addition of ordinates (f+g)** | none | **2** | ❌ needs envelope / ordinate-stacker archetypes |
| Asymptotes / singular points / curve tracing / 2nd-deriv concavity | — | **defer** | later calculus module — NOT foundations |

## 4. Voice (founder decision)
Our FORMAT v2 **warmth** + the book's **"narrate the pen" board-teaching**, each construction step
stated **twice** (the book's "OR" reframing). Hinglish-friendly. Example beat:
*"Pehle base shape banao. Ab jo hissa neeche axis ke hai, use pakdo aur upar fold kar do — jaise
book band kar rahe ho. Dekha? Wahan corner ban gaya."* Every graph explanation is followed by a
**solid practice block** (the founder's explicit ask).

## 5. Build order
- **Tier 1 (now, no code):** add **Exponential & Logarithm** page (+ reflection-across-y=x) and a
  **base-family rounding** (cube-root, 1/x², {x}) into Ch.0. Each ends with a strong `practice_bank`.
- **Tier 2 (small engine ships → the crown jewel):** 3 modulus-transform archetypes + an
  intersection-counter + max/min & ordinate envelopes → a dedicated **"Transforming Graphs"** chapter
  (the acceptable 2nd chapter). This is where we decisively beat the paper book (fold animation,
  draggable root-counter, live envelope).
- **Defer:** all of Book Ch.3 (asymptotes/singular points/curve tracing).

## 6. Page-shape per new page (from MATH_BOOK_PAGE_WORKFLOW §2)
setup bullets ("Try this:") → interactive `math_graph` → `curiosity_prompt` → family/revision
figure → `callout[remember]` formula card → worked example (paired graph) → **practice_bank / quiz**
→ one-line bridge. First exposure ungated (Ch.0 promise); gates only where earned.
