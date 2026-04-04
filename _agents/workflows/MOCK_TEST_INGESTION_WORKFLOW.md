# MOCK TEST INGESTION WORKFLOW v1.0

> **Purpose:** Insert questions from a pre-curated paper (NEET / JEE) into an existing Mock Test Set in the Crucible database.
> This workflow is completely separate from the practice bank (questions_v2). Mock test questions live in the `mock_test_sets` collection and never appear in chapter practice.

---

## QUICK REFERENCE

**API endpoint:** `POST http://localhost:3000/api/v2/mock-tests/{SET_ID}/questions`

**Required headers on every request:**
```
Content-Type: application/json
x-admin-secret: canvas-admin-2024-secure
```

**Subject values:**
| Paper section | Use this value |
|---|---|
| Physics | `physics` |
| Chemistry | `chemistry` |
| Biology (Botany) | `biology` |
| Biology (Zoology) | `biology` |

**Type values:**
| Question format | Use this value |
|---|---|
| Single correct MCQ | `SCQ` |
| Multiple correct MCQ | `MCQ` |
| Numerical / integer answer | `NVT` |
| Assertion–Reason | `AR` |

---

## HOW TO START

### Step 1 — Identify the SET_ID

Call the list endpoint to get the UUID of the target set:

```bash
curl http://localhost:3000/api/v2/mock-tests \
  -H "x-admin-secret: canvas-admin-2024-secure"
```

Find the set by `title` and copy its `_id` field. It looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Step 2 — Confirm the set is empty (or check current count)

```bash
curl http://localhost:3000/api/v2/mock-tests/{SET_ID} \
  -H "x-admin-secret: canvas-admin-2024-secure" \
  | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const s=JSON.parse(d).data; console.log('Questions already in set:', s.questions.length);"
```

### Step 3 — Insert questions one by one

Send one POST per question. The server auto-assigns `question_number` sequentially (1, 2, 3…). Do not set it manually.

---

## BODY SHAPE

### SCQ (Single Correct — most common)

```json
{
  "question_text": {
    "markdown": "Which of the following is correct regarding mitosis? The answer involves $\\Delta G$ and $\\ce{ATP}$."
  },
  "type": "SCQ",
  "options": [
    { "id": "a", "text": "Option A text", "is_correct": false },
    { "id": "b", "text": "Option B text", "is_correct": false },
    { "id": "c", "text": "Option C text", "is_correct": true },
    { "id": "d", "text": "Option D text", "is_correct": false }
  ],
  "solution": {
    "text_markdown": "Step-by-step explanation. Option C is correct because..."
  },
  "metadata": {
    "subject": "biology",
    "difficultyLevel": 3,
    "section": "Section A",
    "topic_hint": "Zoology — Cell Division"
  }
}
```

### NVT (Numerical / Integer answer)

```json
{
  "question_text": {
    "markdown": "The number of ATP molecules produced is..."
  },
  "type": "NVT",
  "options": [],
  "answer": {
    "integer_value": 38
  },
  "solution": {
    "text_markdown": "Complete oxidation yields 38 ATP..."
  },
  "metadata": {
    "subject": "biology",
    "difficultyLevel": 4,
    "section": "Section B",
    "topic_hint": "Botany — Respiration"
  }
}
```

### MCQ (Multiple correct answers)

```json
{
  "question_text": {
    "markdown": "Which of the following statements are correct?"
  },
  "type": "MCQ",
  "options": [
    { "id": "a", "text": "Statement A", "is_correct": true },
    { "id": "b", "text": "Statement B", "is_correct": false },
    { "id": "c", "text": "Statement C", "is_correct": true },
    { "id": "d", "text": "Statement D", "is_correct": false }
  ],
  "solution": {
    "text_markdown": "A and C are correct because..."
  },
  "metadata": {
    "subject": "physics",
    "difficultyLevel": 4,
    "section": "Section B",
    "topic_hint": "Thermodynamics"
  }
}
```

---

## LATEX RULES (mandatory)

| Rule | Correct | Wrong |
|---|---|---|
| Inline math | `$x = 5$` | `$$x = 5$$` — never double dollar |
| Chemical formulas | `\ce{H2SO4}`, `\ce{Fe^{2+}}` | `H2SO4`, `H_2SO_4` |
| Fractions | `$\frac{a}{b}$` | `$\dfrac{a}{b}$` |
| Greek letters | `$\alpha$`, `$\Delta$`, `$\lambda$` | `α`, `Δ` outside math |
| Arrows | `$\rightarrow$`, `$\rightleftharpoons$` | raw `→` outside `$` |
| Space around `$` | `the value $ x = 5 $ is` | `the value $x=5$ is` |

**JSON escaping:** In JSON strings, backslash must be doubled: `\\ce{H2O}`, `\\frac{a}{b}`, `\\Delta`

---

## ANTI-HALLUCINATION RULE

Before inserting any question, quote the first 8 words of the question verbatim from the source paper. If you cannot quote them from the source, stop and flag the question as `NEEDS_REVIEW`. Never generate question content from training knowledge.

---

## SECTION CONVENTIONS

### NEET (200 questions total)
| Section | Subject | Questions | Type |
|---|---|---|---|
| Section A | Physics | Q1–35 | SCQ |
| Section B | Physics | Q36–45 | SCQ (attempt any 10 of 15) |
| Section A | Chemistry | Q46–80 | SCQ |
| Section B | Chemistry | Q81–90 | SCQ (attempt any 10 of 15) |
| Section A | Biology | Q91–160 | SCQ |
| Section B | Biology | Q161–200 | SCQ (attempt any 10 of 15) |

Use `"section": "Section A"` or `"section": "Section B"` accordingly.

### JEE Main (90 questions typical)
| Section | Subject | Questions | Type |
|---|---|---|---|
| Section A | Physics | Q1–20 | SCQ |
| Section B | Physics | Q21–25 | NVT |
| Section A | Chemistry | Q26–45 | SCQ |
| Section B | Chemistry | Q46–50 | NVT |
| Section A | Maths | Q51–70 | SCQ |
| Section B | Maths | Q71–75 | NVT |

---

## TOPIC_HINT CONVENTIONS

Use free-text. Be descriptive. Examples:

**Biology:**
- `"Botany — Photosynthesis"`
- `"Botany — Plant Hormones"`
- `"Botany — Reproduction in Flowering Plants"`
- `"Zoology — Human Digestive System"`
- `"Zoology — Genetics and Evolution"`
- `"Zoology — Human Reproduction"`
- `"Zoology — Ecosystem"`

**Physics:**
- `"Mechanics — Laws of Motion"`
- `"Electrostatics — Capacitors"`
- `"Modern Physics — Photoelectric Effect"`
- `"Optics — Ray Optics"`
- `"Thermodynamics — Carnot Engine"`

**Chemistry:**
- `"Organic — Aldehydes and Ketones"`
- `"Physical — Electrochemistry"`
- `"Inorganic — p-Block Elements"`

---

## SCRIPT TEMPLATE

Use this Node.js script pattern. Save as `scripts/insert_mock_{set_name}_b{N}.js`:

```javascript
require('dotenv').config({ path: '.env.local' });

const SET_ID = 'PASTE_UUID_HERE';
const BASE_URL = 'http://localhost:3000';
const HEADERS = {
  'Content-Type': 'application/json',
  'x-admin-secret': process.env.ADMIN_SECRET,
};

const questions = [
  // PASTE QUESTION OBJECTS HERE
  // Each object follows the body shapes above
];

async function insertQuestions() {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    try {
      const res = await fetch(`${BASE_URL}/api/v2/mock-tests/${SET_ID}/questions`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(q),
      });
      const data = await res.json();
      if (data.success) {
        success++;
        console.log(`✓ Q${i + 1} inserted (server Q#${data.data.question_number})`);
      } else {
        failed++;
        console.error(`✗ Q${i + 1} failed:`, data.error);
      }
    } catch (err) {
      failed++;
      console.error(`✗ Q${i + 1} network error:`, err.message);
    }

    // Small delay to avoid overwhelming the server
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\nDone: ${success} inserted, ${failed} failed out of ${questions.length} total.`);
}

insertQuestions();
```

Run with:
```bash
node scripts/insert_mock_neet_001_b1.js
```

---

## AFTER INSERTION

1. Open the admin panel at `http://localhost:3000/crucible/admin`
2. Click **Mock Tests** tab
3. Select "NEET Mock Test - 001" from the left panel
4. Verify question count in the middle panel matches expected total
5. Click through a few questions to verify text and options rendered correctly
6. When satisfied, click the **DRAFT** badge on the set to flip it to **LIVE**

---

## WHAT NOT TO DO

- ❌ Do not set `question_number` manually — the server assigns it
- ❌ Do not use `chapter_id` or `tag_id` — these fields do not exist on mock test questions
- ❌ Do not use `$$...$$` double dollar math delimiters
- ❌ Do not batch multiple questions in a single POST — one question per request
- ❌ Do not fabricate question content from training knowledge — source verbatim from the paper
- ❌ Do not run this script against production — always `localhost:3000` during ingestion
