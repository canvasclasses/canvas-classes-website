---
description: Tiered Chemistry Solution Workflow — Depth scales with question nature, mobile-first
---

# 🧪 Tiered Chemistry Solution Workflow

This workflow produces solutions that **match the question's difficulty and type** instead of forcing every problem through a one-size-fits-all 5-part template. The reader is on a phone. Every word costs scroll. Words that don't teach are noise.

**Core rule:** depth is decided by `metadata.questionNature` — never by intuition, never by chapter, never by feel. Look up the tag, pick the matching tier, follow the budget.

---

## ✍️ Voice & Vocabulary — Write for a Tier-2 Indian Student

**Audience:** A Class 11/12 student in North India (Himachal, Uttarakhand, UP, Bihar, Punjab) for whom English is a second language. They study in Hinglish, watch coaching videos in Hinglish, and read NCERT in basic English. They are smart — they are not native English readers.

**Default register:** the voice of a coaching-class teacher at the whiteboard, not a textbook author at IIT-Delhi.

**Vocabulary rules:**
- Use the simplest word that says the thing. If two words mean the same, pick the shorter / more common one.
- **Sentence length:** target under 20 words per sentence; never go over 30. Break long sentences with full stops, not semicolons.
- Use **"you"** directly. Talk to the student.
- It is OK to use a few NCERT terms students definitely know: *atomic weight, molar mass, density, oxidation state, equivalent weight, atomicity, mole, STP*. These are not "refined English" — they are subject vocabulary.

**Banned register (replace with simple equivalents):**

| ❌ Avoid | ✅ Use instead |
|---|---|
| operand, weakest input | number, smaller value |
| captive zero | sandwiched zero / zero between non-zero digits |
| bottleneck | smallest, weakest |
| manufacture precision | give more accuracy than the device has |
| calibrated | set right, adjusted |
| diagnose, evaluate | check |
| deterministic | fixed |
| ambiguous | not clear, unclear |
| filler (for zeros) | just placeholders |
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

   The 🧠 section opens with a **chemistry insight specific to *this* problem**, not a meta-comment about the question type.

2. **NO PURPLE PROSE.** One adjective per sentence, max. Banned register: "trusty", "vastly", "wickedly", "the great validator", "ironclad", "victorious", "perfectly conserved", "a cocktail of". If you wrote it for flair, delete it.

3. **NO HASHTAG HEADINGS.** Use the emoji + bold-text pattern: `🧠 **Bespoke Title**`. Never `### 🧠 ...`.

4. **WHITEBOARD VOICE.** Talk like a teacher mid-derivation. Vary sentence length. Bridge with "Now…", "Notice…", "Hold on…". But: be brief. A whiteboard derivation has 5 sentences, not 25.

5. **NO BULLET BLOAT.** Use prose for derivations. Bullets only for genuine enumeration (e.g., 6 sig-fig rules, 3 distinct compounds).

---

## 🗂 Formatting & Style Rules

- **Math delimiters:** `$...$` inline, `$$...$$` for display blocks. Never use double-dollar inline.
- **Chemical formulas:** `\ce{H2SO4}`. For coordination compounds with `[...]`, use `\mathrm{}` instead (renderer breaks `\ce{[...]}`).
- **Fractions:** `\frac{}{}` only — never `\dfrac` (oversized render).
- **Boxed answer:** every solution ends with `$$\boxed{\text{Answer: (Option)}}$$` or `$$\boxed{\text{Answer: [Value]}}$$`.

---

## 🎚️ The Eight Tiers (selected by `metadata.questionNature`)

Each tier specifies: **which sections appear**, **a hard word budget**, and **the structural shape**. Stay inside the budget. If a thought won't fit, cut adjectives before cutting content.

> **Reading the budget:** numbers exclude LaTeX delimiters and math content; they target the prose words a student actually reads. Going 10–15% over is acceptable for genuinely complex cases. Going 30%+ over is a workflow violation — write tighter.

---

### Tier 1 — `Recall` (60–100 words)

Single-fact retrieval. The student either knows the fact or doesn't; no derivation will help.

**Sections:**
- 🧠 **One-line hook** stating the rule/fact being tested (1–2 sentences max).
- ⚠️ **Common Trap** — only if there is a *real* confusion (similar law, easy mistake). Skip if no genuine trap exists; do not invent one.
- Boxed answer.

**No 🗺️. No ⚡. No 💡.**

**Example shape:**
> 🧠 **The Conservation Statement**
> The reaction balances 4 Fe atoms and 3 O₂ molecules into 2 Fe₂O₃ — total mass on each side is identical. That's the Law of Conservation of Mass; option (a) states it precisely.
>
> Options (c)/(d) confuse this with limiting-reagent yield, and (b) misnames it as Multiple Proportions.
>
> $$\boxed{\text{Answer: (a)}}$$

---

### Tier 2 — `Rule_Application` (100–150 words)

One rule, plugged once. Sig fig counts, oxidation-state assignment, periodic-trend lookup, single-formula plug.

**Sections:**
- 🧠 **The operative rule** (1 sentence — name the rule).
- 🗺️ **Compact application** — apply the rule to each input. Prose, not bullets, unless enumerating distinct items.
- ⚠️ **Trap** — only if real.
- Boxed answer.

---

### Tier 3 — `Numerical` (150–250 words)

Multi-step, formula-driven calculation. **Default tier for physical-chemistry numerics.**

**Sections:**
- 🧠 **What the calculation actually tracks** (the conserved quantity, the limiting variable, the scaling principle).
- 🗺️ **The calculation** — show the formula, substitute, arrive at the answer. Prose between equations.
- ⚡ **Speed shortcut** — only if a genuine option-elimination or dimensional shortcut exists. Skip if the math itself is already short.
- ⚠️ **Trap** — only if real (sign error, unit slip, wrong base unit, etc.).
- Boxed answer.

---

### Tier 4 — `Comparative` (120–200 words)

Order or rank 3+ items by some property.

**Sections:**
- 🧠 **The deciding property** — name the single factor that determines the order (e.g. "stability of conjugate base", "atomic size", "lattice energy").
- 🗺️ **The ranking** — walk through each item briefly with its score on the deciding factor. A short table is fine here if items > 3.
- ⚠️ **Trap** — typical pitfall (e.g. forgetting that one option breaks the trend).
- Boxed answer.

---

### Tier 5 — `Graphical` (120–200 words)

Reading or interpreting a plot/chart/profile.

**Sections:**
- 🧠 **What the axes mean** — translate the graph into chemistry (slope = rate constant, intercept = activation energy, etc.).
- 🗺️ **The reading** — extract the specific values or shapes the question asks for.
- ⚠️ **Trap** — common misreads (log vs linear axis, intercept-vs-slope confusion).
- Boxed answer.

---

### Tier 6 — `Conceptual` (150–250 words)

Multi-statement reasoning. Assertion-Reason, "which is correct/incorrect", Statement I/II.

**Sections:**
- 🧠 **The unifying concept** under test — one sentence.
- 🗺️ **Per-option dissection** — evaluate each statement's truth value with a one-line reason. Prose preferred; numbered lines if 4+ statements.
- ⚠️ **Trap** — flag the option that's *almost* right.
- Boxed answer.

---

### Tier 7 — `Mechanistic` (200–350 words)

Organic arrow-pushing, intermediate stability, reaction-step reasoning.

**Sections:** full original 5-part structure.
- 🧠 **Pattern recognition** — what mechanism class this is.
- 🗺️ **Step-by-step arrow flow** — explain *why* each arrow goes where it does.
- ⚡ **Speed scan** — option-elimination based on stability/regiochem rules.
- 💡 **Alternate angle** — only if a second viable mechanistic interpretation exists.
- ⚠️ **Trap** — common stereochemistry/regiochem error.
- Boxed answer.

---

### Tier 8 — `Synthesis` (250–400 words)

Multi-step retrosynthesis or precursor → target chains.

**Sections:** full 5-part. Same shape as Tier 7 but the 🗺️ section walks the full synthetic chain. The 💡 alternate-route section is now **mandatory** — there is almost always a second valid synthesis worth mentioning.

---

## 🧱 The Mandatory 5-Part Structure (legacy reference)

Tiers 7 and 8 still use this. All other tiers are subsets. The five sections, in order, are:
1. 🧠 The "Aha!" Moment / pattern recognition
2. 🗺️ Standard rigorous approach
3. ⚡ Speed shortcut
4. 💡 Alternate angle
5. ⚠️ Common traps

Sections 3–5 are **conditional** in Tiers 1–6. Include them only when they earn their words.

---

## ✅ Pre-Submit Checklist

Before saving any solution:

1. Did I look up `metadata.questionNature` and select the matching tier?
2. Is my word count within the tier's budget (count prose words, not LaTeX)?
3. Does my 🧠 open with chemistry — not a meta-comment about the question type?
4. Did I delete every adjective that wasn't load-bearing?
5. Is every `$` paired? Every `{` paired? No `\dfrac`?
6. Does the solution end with `$$\boxed{\text{Answer: ...}}$$`?

If `questionNature` is missing on the question, **stop** and tag it first per the decision tree in `QUESTION_INGESTION_WORKFLOW.md`. Never write a solution against an untagged question.

---

**Document Version:** 2.1 | **Last Updated:** 2026-04-25 (added Voice & Vocabulary rules — simple Hinglish-friendly English for tier-2 Indian students)
