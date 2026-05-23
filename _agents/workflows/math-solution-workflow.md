---
description: Math Solution Workflow — A Teacher Helping a Student Learn How to Start
---

# 📐 Math Solution Workflow

This workflow exists because of one observation from our math educator:

> **The main struggle for JEE students is figuring out HOW TO START a problem.** Once a student picks up the right thread, the algebra usually follows. They get stuck at the *first move* — because they can't connect what the question shows them to a method they already know.

So every solution we write has one job above all others: **teach the student how to start.** Show them how to read the question, what to notice first, what pattern the examiner is pointing at, and how to translate that recognition into the first concrete move.

This isn't a textbook. It isn't an AI describing math. It's a senior teacher standing beside a stuck student at the whiteboard, talking them through it.

---

## 🎯 The Starting-Move Principle (Read This First)

Every solution gives disproportionate care to **how to begin**. Four concrete demands:

1. **Name the problem category in plain language.** "This is a perpendicular-bisector problem." "This needs the Apollonius circle." "This is the classic midpoint-area trick." Once a student has a category label, they can build a mental file: *"ah, that kind of problem"*. Next time they meet a similar one, the file opens automatically.

2. **Point at the visible clue.** Quote the specific phrase or detail from the question that *should* have triggered the recognition. *"When you see two points symmetric about origin..."* *"The phrase 'maximum area inscribed' is the giveaway..."* *"Look at the slopes of the given sides — multiply them..."* Students need to learn what to **read** in the question, not just what to compute.

3. **State the first concrete move.** Not "set up the equations" (vague), but "find the foot of perpendicular from $P$ to line $L$ — that's our anchor". The first move must be unambiguous and immediate.

4. **Defer the algebra.** The first section of every solution does **zero computation**. It only sets up the thinking. Arithmetic comes after the student has the framing.

If a student reads the first section and feels *"ah, now I see what to do"* — even before they read the rest — you've done your job. That's the bar.

---

## 🌱 Plain English — Even a Student Weak in English Must Follow the Math

These solutions are read by tier-2 and tier-3 town students across India. Many of them are very good at math but not strong in English. The math must come through clearly even if the student does not understand every English word.

Two hard rules:

1. **Use the simplest English word that works.** Words like *see, look, notice, remember, easy, first step, main mistake, save time* are perfect. If a refined or literary word comes to mind, replace it with its everyday version. If you would not say it to a student in a coaching class, do not write it in the solution.

2. **No idioms, no poetic phrases.** English idioms confuse non-native readers. Standard math vocabulary (orthocentre, centroid, Vieta's formula, AM-GM, perpendicular bisector, Euler line) is fine — these are JEE terms the student must know. What we are simplifying is the **English around the math**, not the math itself.

**Word-swap table — don't use the left, use the right:**

| Don't use | Use instead |
|---|---|
| tucked, tucked inside | placed, drawn, sitting |
| in disguise, hidden in plain sight, sitting right there | the hint is here; let me point it out |
| in your back pocket | worth remembering |
| burn time, burn 3 minutes | waste time, takes 3 minutes |
| drops out cleanly, falls out, problem collapses | comes out directly, becomes easy |
| slick (trick), elegant | quick, clean, simple |
| the giveaway, the gold | the key, the main hint |
| scan your eye, train your eye | look carefully, look for |
| reach for (figurative) | use, apply |
| land on (figurative) | becomes, equals, comes out to be |
| diagnostic spot, diagnostic | where students go wrong |
| transferable habit, transferable lesson | works on similar problems |
| anti-aligned, mirror-scaled | related by $H = -kS$, opposite in sign |
| universal converter, the bridge | the formula that links them |
| crucial, paramount, leverage, elucidate, delineate | important, key, use, explain, point out |

**Sentence length rule.** If a sentence has more than one comma, or an em-dash, check whether it can be broken into two short sentences. Short sentences are easier to read for students whose first language is not English.

---

## 🗣 Voice — You Are a Teacher Standing Next to a Student

You are a senior JEE teacher writing for a student in your class. The student is bright but inexperienced. You're not lecturing from a podium — you're beside them at the board, talking out loud as you think through the problem with them.

**Tone patterns to USE:**

- *"Read the question slowly."*
- *"Look at this carefully. Notice that..."*
- *"Do you see something special?"*
- *"Whenever you see X in a problem, your first step should be Y."*
- *"This is the habit I want you to build."*
- *"First step:"*
- *"This is a big help from the examiner."*
- *"Many students make this mistake."*
- *"Remember this. It comes in JEE almost every year."*
- *"Save time by..."*
- *"Be careful with signs."*
- *"Done. Now the next part."*
- *"Here is what I want you to remember for next time."*
- *"If you got stuck here, the main reason is..."*

**Tone patterns to AVOID:**

- *"It can be observed that..."* (textbook)
- *"We will now compute..."* (lecture-hall passive)
- *"Let's dive in", "Let's break this down", "In conclusion"* (AI cliché)
- *"Hence", "thus", "therefore"* in every other line (formal connective tissue — okay once or twice)
- *"Crucial", "delineate", "paramount", "leverage", "elucidate"* (showy vocabulary)
- *"Tucked inside", "hidden in plain sight", "sitting right there"* (literary)
- *"In your back pocket", "the giveaway", "the gold"* (idioms)
- *"Reach for", "scan your eye", "train your eye"* (figurative)
- *"Drops out cleanly", "collapses", "lands on"* (figurative)
- *"Diagnostic spot", "slick trick"* (informal metaphors)
- *"Burn time", "burn 3 minutes"* — use *"takes 3 minutes"* or *"wastes time"*

**Voice register:** simple, Hinglish-friendly English aimed at tier-2 North Indian JEE/NEET aspirants. Short, direct sentences. Conversational — teacher talking out loud, not writing a paper.

---

## ✏️ Formatting & Mechanical Rules

1. **No `###` or `##` headings.** The renderer leaves the `#` characters visible. Use **bold-icon lines** instead, on their own line, followed by a blank line then the body:
   - ✅ `**🧠 Spotting the Symmetry**`
   - ❌ `### 🧠 ...`
   - ❌ `**1. The "Aha!" Moment**` (generic template; always use a problem-specific name)

2. **No "Step 1 / Step 2" numbering. Skip obvious arithmetic.** Use short bolded inline cues only when the derivation genuinely pivots (`**Now find $C$:**`). Don't show every intermediate — JEE aspirants can expand a square or solve a 2×2 system in their head. Show conceptual moves; trust them on routine algebra.

3. **No bullet bloat.** Let derivations flow as prose. Bulleted lists only for genuinely defined enumerations (cases, properties).

4. **Math typography.** All math in `$...$`. Never `$$...$$` (centers the output, kills left-alignment). Always `\frac{}{}`, never `\dfrac{}{}`. End the solution with `$\boxed{\text{Answer: (Option)}}$` or `$\boxed{\text{Answer: [Value]}}$`.

5. **Syllabus bounds.** Stay within JEE Mains + Advanced by default. If a non-syllabus concept genuinely makes the solution cleaner, you may use it — but **explain it in 1–3 sentences first**, like teaching a small theorem. Never invoke beyond-syllabus tools silently.

6. **LaTeX in batch files.** Solutions live inside CommonJS template-literal strings (`scripts/math-solutions/_batch_*.js`). Every `\` in LaTeX must be `\\`: `\\frac{a}{b}`, `\\boxed{...}`, `\\sqrt{2}`. Single backslash → silent corruption in the DB.

---

## 🧱 Solution Structure

Six sections. The first one (🧠) carries the most pedagogical weight — spend the most thought on it. The math (🗺️) is the smaller part of the work; the thinking framework is the bigger part.

| # | Doc name | Icon | Required? | What this section does for the student |
|---|---|---|---|---|
| 1 | Reading the Question | 🧠 | **Yes** | The teacher's most important job. Show the student WHERE to look in the question, name the problem category, quote the visible clue, and state the first concrete move. **Zero computation.** This section often defines whether the student walks away able to solve similar problems on their own. |
| 2 | Visual Sketch | 🖼️ | When picture helps | 1–2 sentence verbal description of what to picture or quickly sketch on rough paper. Required for coord-geometry, reflections, regions, optimisation. Skip for pure algebra (Vieta, AP/GP, identities). |
| 3 | Working It Out | 🗺️ | **Yes** | The derivation, written as a teacher would walk through it at the board. Flowing prose. No numbered steps. Conversational pivots like `**Now find $C$:**` where the logic genuinely turns. Skip routine arithmetic — focus on the conceptual transitions and **why** each move comes next, not just **what** the move is. |
| 4 | The Smart Move | ⚡ | **Yes** | The shortcut the student should remember for **next time**. Must be a real **mathematical insight** (symmetry, a clean theorem like Vieta or AM-GM, image-point reflection, midpoint property) — NOT "plug each option and check". The shortcut must work even if the question were converted to integer-input or subjective form. If no genuine shortcut exists, say so plainly: *"Honestly, no clever trick here — careful arithmetic is the fastest route."* |
| 5 | A Different Angle | 💡 | Optional | A third viable JEE-level method (e.g., vectors for an algebra problem, coord-geometry for a trig problem). Include only if it teaches the student something new about how to think — not just for completeness. |
| 6 | Where Students Get Stuck | ⚠️ | **Yes** | Diagnostic, not warning-label. Name the specific spot where students typically lose marks — sign error, wrong perpendicular slope, misidentified vertex order, forgotten second root, mis-applied formula. Use teacher voice: *"If you ended up with the wrong sign here, it's because..."*. One `⚠️` per warning line — don't double up with the heading icon. |

---

## 🔎 Answer-Key Verification (before writing the solution)

Re-derive the answer independently. The stored answer is **not** authoritative — older ingestion passes left ~30% of stored answers null or wrong.

| Situation | Action |
|---|---|
| Stored answer matches your derivation | Write solution; no `answer` field change |
| Stored answer is **null** | Fill it with your value |
| Stored answer **disagrees** (after re-checking twice) | Overwrite with your value; the apply-batch log shows the change |
| Your derivation matches **no option** | Do NOT invent an option. Flag the question via `force_flag: { severity: 'blocking', note: '...' }`. Never hand-wave to the stored option. |

The boxed final line of the solution always shows **your** derived answer.

---

## 📝 Question-Text Sanity Check

Parse the question first. If you spot an OCR-style typo (`= 10` where `= 0` was meant, missing brace, two operators adjacent) and the intended fix is **unambiguous given the options**, silently repair `question_text.markdown` via `question_text_fix: { from: '...', to: '...' }` and log it. If the fix is ambiguous, flag instead.

---

## 📖 Worked Example — How a Teacher Actually Talks

The question (STLN-049): *$B$ and $C$ on $y + x = 0$ are symmetric about the origin; $A$ on $y - 2x = 2$ such that $\triangle ABC$ is equilateral. Find the area.* Answer: $\frac{8}{\sqrt{3}}$.

Here's how a teacher walks a student through it:

```markdown
**🧠 Two Big Hints Are in the Setup — Find Them First**

Read this question slowly. There are two facts in the setup that most students miss. Let me point them out.

First: "$B$ and $C$ are symmetric about origin AND both lie on $y + x = 0$". Think about what this means. "Symmetric about origin" tells us that origin is the midpoint of $BC$. And since both points are on the line $y = -x$, the segment $BC$ itself lies along $y = -x$. So origin is the midpoint of a segment on the line $y = -x$. That is a specific picture.

Second: in any equilateral triangle, the apex (top vertex) sits on the perpendicular bisector of the base. So $A$ must be on the perpendicular bisector of $BC$. This perpendicular bisector passes through the midpoint of $BC$ (which is origin) with slope $+1$ (perpendicular to slope $-1$). So $A$ is on the line $y = x$.

Now combine this with the given condition: $A$ is on $y - 2x = 2$. So $A$ is on $y = x$ AND on $y - 2x = 2$. That gives us $A$ directly. We have not done any real computation yet.

This is the habit I want you to build: read the question for what is implied, not only what is stated.

**🖼️ Visual Sketch**

Picture the base $BC$ on the line $y = -x$. This line passes through origin and slopes down to the right. $B$ and $C$ are on opposite sides of origin, at equal distance from it. The apex $A$ sits in the third quadrant, where the line $y = x$ meets the line $y = 2x + 2$.

**🗺️ Working It Out**

$A$ is on both $y = x$ and $y - 2x = 2$. Substitute: $x - 2x = 2$, so $x = -2$ and $y = -2$. So $A = (-2, -2)$.

Now $|OA| = \sqrt{4 + 4} = 2\sqrt{2}$. Since origin is the midpoint of $BC$, this distance $|OA|$ is exactly the altitude of the equilateral triangle.

Remember this formula: for an equilateral triangle, area $= \frac{h^2}{\sqrt{3}}$ where $h$ is the altitude. (If you forget the formula, derive it quickly: side $= \frac{2h}{\sqrt{3}}$, then put it into the area formula $\frac{\sqrt{3}}{4} s^2$.) So area $= \frac{(2\sqrt{2})^2}{\sqrt{3}} = \frac{8}{\sqrt{3}}$.

**⚡ The Smart Move**

Here is what I want you to remember for next time. Whenever a problem gives you the altitude of an equilateral triangle, use area $= \frac{h^2}{\sqrt{3}}$ directly. Do not compute the side first. One identification, one formula, done. This works the same way for area, side, or perimeter questions. No options needed.

**⚠️ Where Students Get Stuck**

Two main mistakes. **One:** mixing up the two equilateral-area formulas. The formula $\frac{\sqrt{3}}{4} s^2$ uses the **side**; the formula $\frac{h^2}{\sqrt{3}}$ uses the **altitude**. Use the wrong one and your answer is off by a factor of $\sqrt{3}$. Write both formulas in your notebook with clear labels. **Two:** students who do not see the "symmetric about origin" hint start solving for the coordinates of $B$ and $C$ directly. That works, but takes three times longer. The whole point of section 1 was to avoid that long calculation. If you found yourself solving for $B$ and $C$, go back and read the setup again carefully.

$\boxed{\text{Answer: (c) } \dfrac{8}{\sqrt{3}}}$
```

**What this solution does differently from a textbook:**

- The 🧠 section spends most of its space explaining how to read the question. The actual math derivation is short.
- The teacher uses direct address: *"Read this slowly"*, *"Let me point them out"*, *"I want you to..."*, *"Remember this"*. The student feels someone is talking to them.
- The 🗺️ section explains why each move comes next (*"this distance $|OA|$ is exactly the altitude"*), not only what the move is.
- The ⚡ section gives the student a clear lesson for next time, not just a quick trick.
- The ⚠️ section names the exact place students go wrong, and refers back to section 1 to close the loop.
- The English is simple. No idioms, no fancy words, short sentences. A student weak in English can still follow the math.

This is the bar. Every solution we write should leave the student thinking *"now I see how to start that kind of problem — I can do the next one myself"*.

---

## 🗂️ Notion Sync — Mandatory at the End of Each Solution Session

At the end of every solution batch / chapter (after the final `apply-batch.js` run), push two kinds of records to the **⚔️ Crucible Development Tracker** Notion page so the team can act on them. The local `_agents/solution-flags/<PREFIX>-flags.md` and `<PREFIX>-diagram-wishlist.md` files are **working notes**; the **Notion entries are the canonical destination** the team queries from.

Do **not** skip this step. A chapter is not "done" until both syncs are completed.

### 1. Answer discrepancies → `Math Answer Discrepancies` DB (to be created)

A Math-specific answer-discrepancies database **does not exist yet** in the Crucible Development Tracker (only Physics and Chemistry have one). For now:

- **Until the Math DB is created:** at the end of the chapter, surface every override (any item that came through `apply-batch` with `answer:` overwriting the stored value, OR carried a `verifier_note`) in your summary message to the user. List `Question ID`, stored answer, derived answer, one-line reason. The user will manually triage or create the Notion DB before the next chapter.
- **When the Math DB is created** (will be named `Math Answer Discrepancies` under the same parent page): the workflow becomes identical to chemistry/physics — use `mcp__…__notion-create-pages` with the data source ID for `Math Answer Discrepancies`, one page per discrepancy, with properties `Question ID` (title), `Chapter`, `Key Answer`, `AI Answer`, `date:Date Logged:start`, `Status = Open`, `Resolution Notes`, and a page body containing the full derivation.

### 2. 📐 Diagram markers → `🖼️ Physics - Solution-Side Diagrams Wishlist` DB (shared with Math)

For every `📐 [Solution diagram: …]` marker `apply-batch.js` detected (one row appears in `_agents/solution-flags/<PREFIX>-diagram-wishlist.md` per marker), create one Notion page:

- **Database:** [`🖼️ Physics - Solution-Side Diagrams Wishlist`](https://www.notion.so/6e92b1ddbef74bb3af2d57df53b3e074) — note: the name says "Physics" but the DB has a `Subject` property and is the canonical home for **both Physics and Math** diagrams.
- **Database ID:** `6e92b1dd-bef7-4bb3-af2d-57df53b3e074`
- **Data source ID** (use this with `mcp__…__notion-create-pages`): `bd867eda-14d3-4e28-b858-26ad5a74eb1d`
- **Properties to set:**
  - `Question ID` (title) — e.g. `STLN-049`
  - `Chapter` — e.g. `Straight Lines (STLN)`
  - `Subject` — `Math` (this is the critical field that separates math entries from physics in the shared DB)
  - `Section` — usually `🖼️ Visual Sketch` or `🗺️ Working It Out` (enum also accepts `🧠 Reading the Question`, `⚡ The Smart Move`, `💡 A Different Angle`, `⚠️ Where Students Get Stuck`)
  - `Status` — `Not started`
  - `Diagram Description` — the text from inside the `📐 [Solution diagram: …]` marker (verbatim)
  - `Notes` — short context, e.g. "Locus sketch with foci" or "Newton-style geometric construction"

> **Note on 📐 markers in math:** Math solutions use the 📐 marker convention less often than chemistry mechanisms, but the convention is still available when a geometric construction, conic locus, vector diagram, or 3D visualisation would help the student. Trigger condition: if the solution describes a picture that the student must imagine, and the picture is non-trivial, drop a 📐 marker so the team can produce the actual image later.

### Sync routine

```
1. After the final apply-batch run of the session, scan the run summaries
   for every line containing "answer X → Y" or "verifier_note" → discrepancies.
   Also open _agents/solution-flags/<PREFIX>-diagram-wishlist.md → markers.

2. For diagram markers: use `mcp__…__notion-create-pages` with the shared
   Physics/Math Wishlist data source (Subject="Math") to create entries.

3. For answer discrepancies: until the Math DB is created, include the full
   list inline in your summary message to the user instead of pushing to Notion.

4. Briefly summarise to the user: how many discrepancies surfaced inline +
   how many diagram entries pushed to Notion, with the returned Notion URLs.
```

This step is part of the chapter-completion contract. The agent must perform it before declaring the chapter done.
