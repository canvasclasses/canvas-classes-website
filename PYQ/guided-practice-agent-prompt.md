# Claude IDE Agent Prompt: Adaptive Guided Practice System

## CONTEXT & MISSION

You are helping rebuild the **Guided Practice** flow of "The Crucible" — a chemistry question
practice platform for JEE students. The current flow serves 10 questions in batch, collects
coarse feedback, then serves the next batch. We are replacing this with a **one-question-at-a-time
adaptive engine** that learns from micro-feedback and implicit signals to personalize the session
in real time.

The existing design language is: **dark theme, near-black backgrounds (#0a0a0a), teal/green
accents for interactive elements, purple for organic chemistry, blue for physical, muted card
borders, clean sans-serif typography.** All new UI must match this exactly.

---

## WHAT ALREADY EXISTS (DO NOT REBUILD)

Before writing any code, locate and read these existing files:

1. The chapter selection component (currently used in Guided Practice flow)
2. The concept tag filter component (used in the question setup screen)
3. The question card component (used in the question feed screen)
4. The difficulty selector component
5. The user profile / session store (wherever session state and user progress are tracked)
6. Any existing API service files for fetching questions

Map the exact file paths, component names, prop interfaces, and state management patterns
before proceeding. Do not duplicate or recreate anything that already exists.

---

## WHAT NEEDS TO BE BUILT

### 1. DIAGNOSTIC WARM-UP MODULE
**File to create:** `components/guided-practice/DiagnosticWarmup.tsx`

**Purpose:** Replace the upfront questionnaire ("what are your struggles?") with a silent
5-question behavioral diagnostic. The system infers baseline from behavior, not self-report.

**Logic:**
- On session start, fetch exactly 1 question per major concept in the selected chapter,
  at Easy difficulty
- Present them one at a time using the existing question card component
- Do NOT show a progress bar or tell the student this is a diagnostic — it should feel
  like practice starting naturally
- After all 5 questions, compute a `conceptBaseline` map:
  ```
  type ConceptBaseline = {
    conceptId: string;
    attempted: boolean;
    correct: boolean | null;
    timeSpentMs: number;
    viewedSolutionBeforeAnswering: boolean;
  }[]
  ```
- Pass this baseline into the AdaptiveSession as initial state

---

### 2. MICRO-FEEDBACK COMPONENT
**File to create:** `components/guided-practice/MicroFeedback.tsx`

**Purpose:** One-tap confidence signal collected after every question attempt.

**UI Requirements:**
- Rendered directly below the question card, slides up after answer submission
- Three options only — no more, no less:
  - 😅 **Too Hard** — I didn't really get this
  - 👍 **Got It** — understood and solved correctly
  - 😴 **Too Easy** — I already knew this well
- Tapping any option immediately dismisses the feedback and loads the next question
- Must complete the tap-to-next-question transition in under 300ms — zero friction
- Visually: three pill buttons, subtle border, no background fill until hover/tap,
  consistent with existing button styles in the codebase

**Data emitted:**
```ts
type MicroFeedback = {
  questionId: string;
  response: 'too_hard' | 'got_it' | 'too_easy';
  answeredCorrectly: boolean;
  timeSpentMs: number;
  viewedSolutionBeforeAnswering: boolean;
}
```

---

### 3. ADAPTIVE QUESTION ENGINE (CORE LOGIC)
**File to create:** `lib/adaptiveEngine.ts`

**Purpose:** Pure function / service that decides the next question given session history.
No UI — this is logic only.

**Input:**
```ts
type AdaptiveEngineInput = {
  chapter: Chapter;
  sessionHistory: MicroFeedback[];
  conceptBaseline: ConceptBaseline[];
  availableQuestions: Question[];
  userGlobalProfile: UserConceptProfile; // from DB / existing profile store
}
```

**Decision rules to implement (in priority order):**

1. **Never repeat** a question already seen in this session or last 3 sessions globally
2. **Concept rotation:** If the last 2 questions were from the same concept, switch concept
3. **Confidence escalation:** If student marks "Too Easy" → next question from same concept
   at +1 difficulty. If already at Hard → mark concept as "mastered" for this session and
   rotate to next weak concept
4. **Struggle detection:** If student marks "Too Hard" twice on same concept → drop
   difficulty by 1 and add a bridging question (Easy → concept explanation question if
   available, else just Easy MCQ)
5. **Implicit signal override:** If `viewedSolutionBeforeAnswering = true` AND marked
   "Got It", treat as "Too Hard" signal — student is not being honest
6. **Proficiency cap:** Once a concept has 3+ "Got It" or "Too Easy" signals, deprioritize
   it for the rest of the session (surface at most 1 more Hard question from it)
7. **Fill with PYQ:** In the last 20% of the session, prefer PYQ questions the student
   hasn't seen, at their current proficiency level

**Output:**
```ts
type NextQuestionDecision = {
  question: Question;
  reason: string; // human-readable, shown subtly in UI e.g. "Trying a harder Chirality Q"
}
```

The `reason` string is important — it gets displayed in the UI (see Transparency Bar below).

---

### 4. ADAPTIVE SESSION CONTAINER
**File to create:** `components/guided-practice/AdaptiveSession.tsx`

**Purpose:** The main session orchestrator. Replaces the existing 10-question batch feed.

**State it manages:**
```ts
{
  sessionQuestions: Question[];         // questions served so far
  currentQuestion: Question | null;
  feedbackHistory: MicroFeedback[];
  conceptProfileDelta: ConceptDelta[];  // changes to profile this session
  sessionPhase: 'diagnostic' | 'practice' | 'complete';
  lastDecisionReason: string;           // from adaptive engine
}
```

**Flow:**
1. Phase 1 (Diagnostic): Mount DiagnosticWarmup, collect baseline
2. Phase 2 (Practice): Loop — show question → collect MicroFeedback → call adaptiveEngine
   → show next question → repeat
3. Phase 3 (Complete): Session ends when student clicks "End Session" OR 30 questions served
   (whichever comes first). Show SessionSummary.

**Session end trigger:** Add a persistent but unobtrusive "End Session" button in the
top-right corner. Never auto-end a session — let the student decide when they're done.

---

### 5. TRANSPARENCY BAR
**File to create:** `components/guided-practice/TransparencyBar.tsx`

**Purpose:** A subtle single line below the question number that shows the adaptive engine's
current reasoning. Makes the student feel the system is paying attention.

**UI:**
- Position: directly below the Q1/Q2/Q3 counter, above the question card
- Style: small text, muted color (~`#6b7280`), italic, max 60 chars
- Examples of what it shows:
  - *"You've nailed 3 Electronic Effects Qs — going harder now"*
  - *"Trying a simpler Chirality question to build the concept"*
  - *"Mixing in a PYQ from JEE Mains 2023"*
  - *"Good streak — switching to a new concept"*
- Updates with each new question
- Never shows during the diagnostic phase

---

### 6. SESSION SUMMARY SCREEN
**File to create:** `components/guided-practice/SessionSummary.tsx`

**Purpose:** End-of-session review that makes progress feel real and earned.

**Must show:**
- Total questions attempted
- Accuracy percentage
- Per-concept breakdown:
  - Concept name
  - Questions attempted
  - Visual proficiency delta (e.g. was Weak → now Medium, shown as a small change indicator)
- "Weakest area this session" highlighted with a suggestion: *"Revisit Chirality — try
  5 more questions next time"*
- Two CTAs:
  - **Continue Practicing** (takes user back to chapter select)
  - **Review Mistakes** (filters question feed to only wrong answers from this session)

**Data to write back to DB after session:**
```ts
type SessionResult = {
  userId: string;
  chapterId: string;
  sessionDate: Date;
  questionsAttempted: MicroFeedback[];
  conceptDeltas: ConceptDelta[];
  // conceptDeltas = array of { conceptId, previousLevel, newLevel }
}
```
Use the existing API/service pattern in the codebase for this write.

---

### 7. USER CONCEPT PROFILE (PERSISTENCE LAYER)
**File to create (or extend if exists):** `lib/userConceptProfile.ts`

**Purpose:** The student's global knowledge map. Persists across sessions.

**Schema:**
```ts
type UserConceptProfile = {
  userId: string;
  concepts: {
    [conceptId: string]: {
      level: 'unseen' | 'weak' | 'developing' | 'strong' | 'mastered';
      questionsAttempted: number;
      correctCount: number;
      lastPracticed: Date;
      sessionHistory: Array<{
        sessionDate: Date;
        feedbackSignals: MicroFeedback[];
      }>;
    }
  }
}
```

**Level transition rules:**
- `unseen` → `weak`: first attempt, regardless of outcome
- `weak` → `developing`: 2+ "Got It" with no "Too Hard" in last 5 attempts
- `developing` → `strong`: 3+ "Got It" at Medium/Hard difficulty
- `strong` → `mastered`: 2+ "Too Easy" at Hard difficulty
- Any "Too Hard" at a level → drop one level (but never below `weak`)

---

## ROUTING CHANGES

Update the existing Guided Practice routing so:

1. Mode Selection → Chapter Selection → Learning Path → **[NEW]** Concept Filter & Difficulty
   (existing screen, keep it) → **[NEW]** AdaptiveSession (replaces the old question feed)
2. The old 10-question batch feed route should be kept temporarily behind a feature flag
   `FEATURE_LEGACY_BATCH_PRACTICE = true/false` in your env config so you can A/B test

---

## WHAT NOT TO CHANGE

- The chapter selection screen (Image 2) — it works well, leave it
- The concept filter / difficulty selector screen (Image 4) — keep exactly as is
- The top navigation bar design
- The existing question card component rendering (Image 5) — only change what surrounds it
- Any existing Free Browse or Timed Test flows

---

## CODE QUALITY REQUIREMENTS

- TypeScript strict mode throughout
- Every new component must have a `// ADAPTIVE ENGINE:` comment block at the top explaining
  its role in the adaptive flow
- No hardcoded question counts — use named constants (`SESSION_DIAGNOSTIC_LENGTH = 5`,
  `SESSION_MAX_QUESTIONS = 30`, etc.) in a `constants/adaptivePractice.ts` file
- The adaptive engine (`lib/adaptiveEngine.ts`) must be a pure function with zero side
  effects — all state lives in the container
- Write one unit test per decision rule in the adaptive engine

---

## DELIVERABLE CHECKLIST

Before marking this task complete, verify:

- [ ] DiagnosticWarmup runs silently without telling student it's a diagnostic
- [ ] MicroFeedback appears and dismisses in under 300ms
- [ ] AdaptiveEngine never serves a repeated question
- [ ] TransparencyBar updates correctly with each question
- [ ] SessionSummary writes concept deltas back to the profile store
- [ ] Legacy batch mode still works behind feature flag
- [ ] All new components match existing dark theme exactly
- [ ] No existing components were unnecessarily rebuilt or duplicated
