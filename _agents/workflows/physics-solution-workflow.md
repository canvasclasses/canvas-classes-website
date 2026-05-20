---
description: Tiered Physics Solution Workflow — Depth scales with question nature, mobile-first
---

# ⚛️ Tiered Physics Solution Workflow

This workflow produces physics solutions that **match the question's difficulty and type** instead of forcing every problem through a one-size-fits-all template. The reader is on a phone. Every word costs scroll. Words that don't teach are noise.

**Core rule:** depth is decided by `metadata.questionNature` — never by intuition, never by chapter, never by feel. Look up the tag, pick the matching tier, follow the budget.

**Companion docs:**
- `chemistry-solution-workflow.md` — chemistry sibling (8 tiers, same voice rules)
- `math-solution-workflow.md` — math sibling (5-part deep structure)
- `PHYSICS_QUESTION_INGESTION_WORKFLOW.md` — where `questionNature` gets set during ingestion

---

## ✍️ Voice & Vocabulary — Write for a Tier-2 Indian Student

**Audience:** A Class 11/12 student in North India (Himachal, Uttarakhand, UP, Bihar, Punjab) for whom English is a second language. They study in Hinglish, watch coaching videos in Hinglish, and read NCERT in basic English. They are smart — they are not native English readers.

**Default register:** the voice of a coaching-class teacher at the whiteboard, not a textbook author at IIT-Delhi.

**Vocabulary rules:**
- Use the simplest word that says the thing. If two words mean the same, pick the shorter / more common one.
- **Sentence length:** target under 20 words per sentence; never go over 30. Break long sentences with full stops, not semicolons.
- Use **"you"** directly. Talk to the student.
- It is OK to use physics terms students definitely know: *velocity, acceleration, displacement, momentum, kinetic energy, work, power, impulse, free-fall, terminal velocity, projectile, retardation, deceleration*. These are subject vocabulary, not refined English.

**Banned register (replace with simple equivalents):**

| ❌ Avoid | ✅ Use instead |
|---|---|
| operand, weakest input | number, smaller value |
| bottleneck | smallest, weakest |
| manufacture precision | give more accuracy than the device has |
| calibrated | set right, adjusted |
| diagnose, evaluate | check |
| deterministic | fixed |
| ambiguous | not clear, unclear |
| intuition fails | feeling fools you |
| load-bearing | important |
| trivially, demonstrably, inherently | simply, clearly, naturally |
| dressed up to look careful | written to look careful |
| running diagnostics, the diagnostic | the check |
| in textbook fashion | clearly, exactly |
| meaningless / nonsense | wrong / not correct |

**Friendly phrasings to lean on:**
- "Many students mark this — but..."
- "The trick is..."
- "Don't get confused by..."
- "Notice that..."
- "Remember:"
- "This is the most common mistake."

The 🧠 section especially must sound like a teacher *saying* the line in class, not writing it for a journal.

---

## 🚫 The Anti-AI Rules (Strict Directives)

1. **NO META-OPENERS.** Banned phrasings (and any close paraphrase):
   - "When you are asked to…"
   - "Whenever you see a question…"
   - "When a question asks…"
   - "When you must determine…"
   - "Let's break this down / dive in / tackle this."
   - "It is crucial / important / interesting to note."

   The 🧠 section opens with a **physics insight specific to *this* problem**, not a meta-comment about the question type.

2. **NO PURPLE PROSE.** One adjective per sentence, max. Banned register: "trusty", "vastly", "wickedly", "the great validator", "ironclad", "victorious", "perfectly conserved", "a cocktail of". If you wrote it for flair, delete it.

3. **NO HASHTAG HEADINGS.** Use the emoji + bold-text pattern: `🧠 **Bespoke Title**`. Never `### 🧠 ...`.

4. **NO GENERIC SECTION TITLES.** Every 🧠 must have a *bespoke title* that names the specific trick/principle/trap. Compare:
   - ❌ `🧠 **The key insight**`
   - ❌ `💡 Use $a = v\,dv/dx$`
   - ✅ `🧠 **The 90° trick at max height**`
   - ✅ `🧠 **Why the kilogram catch matters here**`
   - ✅ `🧠 **Stopping distance scales with $v^2$**`

   The bespoke title is what the student remembers when they see the same trick on the next paper.

5. **WHITEBOARD VOICE.** Talk like a teacher mid-derivation. Vary sentence length. Bridge with "Now…", "Notice…", "Hold on…". But: be brief. A whiteboard derivation has 5 sentences, not 25.

6. **NO BULLET BLOAT.** Use prose for derivations. Bullets only for genuine enumeration (e.g., 3 distinct cases, 4 forces on a free-body diagram).

7. **NO UNCERTAINTY LEAKAGE.** Never write "Wait — re-read", "Let's try...", "If we assume...", "For the related standard problem", "Standard problem with answer x = 5 gives...". If you're unsure, re-solve and rewrite. Solutions show the answer, not the search.

---

## 🗂 Formatting & Style Rules

- **Math delimiters:** `$...$` inline only. **Never** `$$...$$` (centers output and breaks left-aligned reading).
- **Vectors:** `$\vec{v}$`, `$\hat{i}$`, `$\hat{j}$`, `$\hat{k}$`. Components written as `$v_x$, $v_y$, $v_z$`.
- **Fractions:** `\frac{}{}` only — never `\dfrac` (oversized render).
- **Units in math mode:** `\mathrm{m\,s^{-1}}` not m/s when inside `$...$`. Outside math, plain text "m/s" is fine.
- **Greek letters & arrows:** always inside `$...$`. Never bare `Δ`, `α`, `→` in the prose.
- **Boxed answer:** every solution ends with `$\boxed{\text{Answer: ...}}$` (single `$`, never `$$`).
- **Convention statements:** when sign conventions matter, state them once at the start of ✏️: *"Take upward as positive."* Then stick to it.

---

## 🎚️ The Four Tiers (selected by `metadata.questionNature`)

Physics has four canonical `questionNature` tags. Each maps to exactly one tier. Each tier specifies: **which sections appear**, **a hard word budget**, and **the structural shape**.

> **Reading the budget:** numbers exclude LaTeX delimiters and math content; they target the prose words a student actually reads. Going 10–15% over is acceptable for genuinely complex cases (multi-step integrations, projectile + relative motion). Going 30%+ over is a workflow violation — write tighter.

| Tag (`questionNature`) | Tier | Budget |
|---|---|---|
| `Rule_Application` | Tier 1 | 100–150 words |
| `Numerical` | Tier 2 | 150–250 words |
| `Conceptual` | Tier 3 | 150–250 words |
| `Graphical` | Tier 4 | 120–200 words |

---

### Tier 1 — `Rule_Application` (100–150 words)

Single formula plug. Derivative/integral of a position function, $v = u + at$, $F = ma$, single dimensional analysis, single-axis kinematic calc.

**Sections:**
- 🧠 **The operative principle** (1 bespoke-title sentence — name the formula/rule).
- ✏️ **The plug** — substitute, compute, state answer. Prose between equations.
- ⚠️ **Trap** — only if there's a *real* sign or unit pitfall.
- Boxed answer.

**No ⚡. No 💡.** If a Rule_Application question is taking 200+ words, you've mis-tiered it — promote to `Numerical`.

**Example shape:**

> 🧠 **Acceleration along $x$ when force is mixed**
> Only the $x$-component of the force contributes to $x$-acceleration. The $\hat{j}$ part affects the $y$-motion separately. So $a_x = F_x / m$.
>
> ✏️
> $a_x = \frac{20}{2} = 10\,\mathrm{m\,s^{-2}}$.
>
> From rest: $x = \frac{1}{2}a_x t^2 = \frac{1}{2}(10)(100) = 500$ m.
>
> $\boxed{\text{Answer: } 500\,\mathrm{m}}$

---

### Tier 2 — `Numerical` (150–250 words)

Multi-step calculation. **Default tier for kinematics, work-energy, momentum, and most JEE Main numerics.** Two or more formulas chained, or one formula plus unit conversion plus quadratic.

**Sections:**
- 🧠 **What the calculation actually tracks** — the conserved quantity, the scaling principle, or the geometric setup. Bespoke title required.
- ✏️ **The working** — state convention if needed, then equations with brief prose. Don't restate the question; the question is already shown above.
- ⚡ **Speed shortcut** — only if a genuine option-elimination, symmetry, or dimensional shortcut exists. Skip if the math itself is already short.
- ⚠️ **Trap** — only if real (sign convention slip, km/h vs m/s, $g = 9.8$ vs $10$, missing factor of 2).
- Boxed answer.

**Example shape:**

> 🧠 **Tower throw symmetry: $H = \frac{1}{2}g\,t_1 t_2$**
> Ball thrown up at $u$ takes $t_1$ to hit the ground. Ball thrown *down* at the same $u$ takes $t_2$. These are the two roots of the same quadratic — and Vieta's product gives you $H$ directly, without ever finding $u$.
>
> ✏️
> Up throw (down = +): $H = -ut_1 + \frac{1}{2}gt_1^2$ — root $t_1$.
> Down throw: $H = ut_2 + \frac{1}{2}gt_2^2$ — root $t_2$.
>
> Product of roots: $t_1 t_2 = \frac{2H}{g}$, so $H = \frac{1}{2}g\,t_1 t_2$.
>
> Dropped ball: $t = \sqrt{\frac{2H}{g}} = \sqrt{t_1 t_2} = \sqrt{6 \times 1.5} = 3\,\mathrm{s}$.
>
> ⚠️ **Trap** Many students solve for $u$ and $H$ separately — a full minute lost. The product formula is the whole point.
>
> $\boxed{\text{Answer: } 3\,\mathrm{s}}$

---

### Tier 3 — `Conceptual` (150–250 words)

Multi-statement reasoning. Assertion-Reason. Statement I / Statement II. "Which of the following is correct/incorrect." Identification-style questions where the work is qualitative, not arithmetic.

**Sections:**
- 🧠 **The unifying physics concept under test** — one bespoke-title sentence.
- ✏️ **Per-option / per-statement dissection** — evaluate each statement's truth value with a one-line reason. Prose preferred; numbered lines if 4+ statements.
- ⚠️ **Trap** — flag the option that's *almost* right (this is mandatory for Conceptual — there is almost always a tempting wrong choice).
- Boxed answer.

**Example shape:**

> 🧠 **Apparent weight depends on the elevator's acceleration, not its velocity**
> Normal force is $N = m(g - a_\text{down})$. Constant velocity → $a = 0$ → $N = mg$, no change felt. Weight loss means $N < mg$, which needs *acceleration* directed downward.
>
> ✏️
> - Elevator accelerating downward: $N = m(g-a) < mg$ — **weight loss** ✓
> - Elevator accelerating upward: $N = m(g+a) > mg$ — feels heavier
> - Constant velocity (either direction): $N = mg$ — no change
>
> ⚠️ **Trap** Many students mark "elevator moving downward at constant velocity" because *downward motion* sounds like *weight loss*. But constant velocity gives zero net acceleration — there's no change in apparent weight, no matter which way the elevator is moving.
>
> $\boxed{\text{Answer: When the elevator accelerates downward}}$

---

### Tier 4 — `Graphical` (120–200 words)

Reading or sketching a plot — $v$-$t$, $x$-$t$, $a$-$x$, $v^2$-$x$, $F$-$x$, $p$-$h$, etc. Either *interpret* (area = displacement, slope = velocity) or *match* (given one graph, pick the consistent other graph).

**Sections:**
- 🧠 **What the axes mean physically** — translate the graph into physics (slope = $v$, area = $\Delta x$, slope of $v^2$-$x$ = $2a$, etc.). Bespoke title required.
- ✏️ **The reading** — extract specific values, slopes, or shapes the question asks for. Walk through each segment if piecewise.
- ⚠️ **Trap** — common misreads: confusing slope vs area, mistaking $v$-axis label for $a$-axis label, forgetting that area below $t$-axis is negative displacement.
- Boxed answer.

**Example shape:**

> 🧠 **Slope of $v^2$-$x$ is $2a$, not $a$**
> From $v^2 = u^2 + 2ax$, plotting $v^2$ against $x$ gives a straight line with slope $2a$. So $a = \frac{\text{slope}}{2}$.
>
> ✏️
> From the graph: slope $= \frac{80 - 40}{30 - 10} = \frac{40}{20} = 2$.
>
> $a = \frac{2}{2} = 1\,\mathrm{m\,s^{-2}}$.
>
> ⚠️ **Trap** A common mistake is to read the slope as $a$ directly. The factor of 2 from $v^2 = u^2 + 2ax$ is easy to drop — many students mark $2\,\mathrm{m\,s^{-2}}$.
>
> $\boxed{\text{Answer: } a = 1\,\mathrm{m\,s^{-2}}}$

---

## 📐 Physics-Specific Conventions

These appear often enough that getting them consistent matters:

- **Sign convention:** state it once at the top of ✏️ when it matters. *"Take upward as positive."* / *"Take A's direction as positive."* Don't re-derive it three times.
- **$g$ value:** match what the question gave you. If the question says $g = 10$, use 10 — never silently substitute 9.8. State it explicitly if multiple values appear in the problem.
- **Unit consistency:** convert all quantities to SI at the start of ✏️ if the question mixes km/h and m/s. Show the conversion once.
- **Vectors vs magnitudes:** use $\vec{v}$ when the direction matters in the working; switch to $v = |\vec{v}|$ once you're computing scalars.
- **Free-body sketches:** describe in one line ("Three forces on the block: weight $mg$ down, normal $N$ up, friction $f$ opposing motion"). Don't try to draw ASCII.
- **Convention for "speed observed from B":** use $v_{AB} = v_A - v_B$ (relative velocity of A as observed from B). State this if it could be ambiguous.

---

## 🧱 The Mandatory Section Order

Every physics solution, regardless of tier, follows this order:

1. 🧠 **Bespoke-title hook** (required, always)
2. ✏️ **Working** (required, always)
3. ⚡ **Shortcut** (Tier 2 only, conditional — only if a real shortcut exists)
4. ⚠️ **Trap** (mandatory for Tier 3 Conceptual; conditional elsewhere — only if real)
5. `$\boxed{\text{Answer: ...}}$` (required, always)

Sections that don't earn their words are **dropped, not filled**. A 🧠 with no real insight, or a ⚠️ that invents a fake trap, makes the solution worse, not better.

**Removed from the old physics template:** the 🎯 problem restatement. The question is shown directly above the solution in the UI — restating it eats words for no reader benefit.

---

## ✅ Pre-Submit Checklist

Before saving any solution:

1. Did I look up `metadata.questionNature` and select the matching tier?
2. Is my word count within the tier's budget (count prose words, not LaTeX)?
3. Does my 🧠 open with a **bespoke title** that names the specific principle/trick?
4. Does my 🧠 open with physics — not a meta-comment about the question type?
5. **Did I verify the boxed answer matches the `is_correct: true` option in the question's options array?** (This catches answer-key mismatches before they ship.)
6. Did I delete every adjective that wasn't load-bearing?
7. Is every `$` paired? Every `{` paired? No `$$`? No `\dfrac`?
8. Does the solution end with `$\boxed{\text{Answer: ...}}$`?
9. Is there any "Wait, let me re-read" / "Standard problem with answer..." / "If we assume..." uncertainty leakage? If yes, re-solve and rewrite.

If `questionNature` is missing on the question, **stop** and tag it first per the decision tree in `PHYSICS_QUESTION_INGESTION_WORKFLOW.md`. Never write a solution against an untagged question.

---

## 🔁 Consistency Across Subjects

This workflow mirrors `chemistry-solution-workflow.md` in structure (tier-based, bespoke titles, voice rules, anti-AI rules, pre-submit checklist). Differences are physics-specific:

| Aspect | Chemistry | Physics |
|---|---|---|
| Number of tiers | 8 (Recall → Synthesis) | 4 (matching the 4 `questionNature` tags used in physics) |
| Display math | `$$...$$` allowed for boxed answer | `$...$` only, never `$$` |
| Subject vocab | Oxidation states, ligand counts, $\ce{...}$ formulas | Vectors $\vec{v}$, sign conventions, units in $\mathrm{...}$ |
| Mechanistic/Synthesis tiers | Yes (Tier 7, Tier 8) | Not applicable — physics rarely chains 4+ mechanism steps |

When a section pattern (voice, anti-AI rules, checklist) is identical across both, the chemistry doc is the canonical source of intent. Edits to shared rules should update both files in the same commit.

---

**Document Version:** 1.0 | **Created:** 2026-05-17 | **Mirrors:** `chemistry-solution-workflow.md` v2.1
