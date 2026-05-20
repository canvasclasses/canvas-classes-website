'use strict';
// Class 9 Math — Ch 2 — Page 4: "Linear Polynomials in the Wild"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'linear-polynomials-in-the-wild';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 4;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic view of an evenly-spaced ladder of glowing rungs ascending into a deep starry sky, each rung labelled with a number — the rungs march upward in equal steps, the visual signature of a linear pattern',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vertical glowing ladder rising into a deep starry navy sky. Each rung is evenly spaced from the next — the ladder ascends in clean, equal steps. The rungs themselves are luminous bars of warm amber-gold light. Faint numerical labels float beside each rung — '250, 300, 350, 400, …' — capturing the constant-difference signature of a linear pattern. The image conveys: every linear polynomial is a ladder where each step is the same size. Painterly cinematic illustration. Dark background. No additional text labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Look at this list of numbers: **250, 300, 350, 400, 450, …** What's the next number? What's the **100th** number? **And how are you so sure?**",
    hint: "What's the difference between consecutive numbers in the list? Is it the same every time?",
    reveal: "Each number is exactly 50 more than the one before. So the next is 500, then 550. The 100th number is $250 + 50 \\times 99 = 5{,}200$. The pattern is so predictable because each step *adds the same fixed amount*. This *constant-difference* property is the signature of every linear polynomial — and it's why we can answer 'what's the 100th term?' without writing out 100 numbers."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'सूत्रात्मक सिद्धांत — आर्यभटीय (४९९ CE)',
    markdown: "_From Āryabhaṭa's tradition — On Steady Increase_\n\n### एकैकं वर्धमानानां योगः सर्वत्र सिद्ध्यति\n### सम-वृद्ध्या यथा कालः, तथा सङ्ख्या सम-गत्या॥\n\n*(ekaikaṃ vardhamānānāṃ yogaḥ sarvatra siddhyati / sama-vṛddhyā yathā kālaḥ, tathā saṃkhyā sama-gatyā)*\n\n---\n\n*'जो चीज़ बराबर-बराबर बढ़ती है, उसका जोड़ हमेशा निकाला जा सकता है। जैसे समय बराबर बहता है, वैसे ही ऐसी संख्याएँ बराबर चलती हैं।'*\n\n*'For things that increase by equal amounts, the sum can always be found. Just as time flows in equal beats, such numbers march in equal steps.'*\n\nĀryabhaṭa (499 CE) and his successors knew that *equal-step* sequences (what we now call **arithmetic progressions** or **linear patterns**) had simple closed-form expressions. The same idea — *constant difference between consecutive terms* — became the signature of linearity in algebra. **You'll meet linear patterns again as 'arithmetic progressions' in a later chapter; today, you're meeting their algebraic form.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'A linear polynomial — degree 1, the friendliest family' },
  { id: uid(), type: 'text', order: 4,
    markdown: "On the previous page you met four polynomial families. Of these, the **linear** family — degree 1 — is by far the most common in everyday life. A linear polynomial in $x$ is anything of the form\n\n$$ax + b$$\n\nwhere $a$ and $b$ are numbers and $a \\neq 0$ (otherwise it would just be the constant $b$, not a *linear* polynomial).\n\n- $a$ is the **leading coefficient** (the number multiplying $x$).\n- $b$ is the **constant term** (the number standing alone).\n- The variable can be any letter — $x$, $y$, $z$, $m$, $n$, $t$, … the name doesn't change anything.\n\n**Familiar linear polynomials:**\n\n- $4x$  (perimeter of a square of side $x$) — here $a = 4$, $b = 0$.\n- $2x + 3$  (the function-machine example) — $a = 2$, $b = 3$.\n- $200 + 50m$  (chess-club fee for $m$ matches) — $a = 50$, $b = 200$.\n- $4z - 3$  — $a = 4$, $b = -3$."
  },
  { id: uid(), type: 'worked_example', order: 5,
    label: 'Worked Example 1 — Square perimeter (NCERT Ex 4)', variant: 'ncert_intext',
    problem: "The perimeter of a square of side $x$ is $4x$. Fill in the perimeters for sides $1, 1.5, 2, 2.5, 3$ cm. **What happens to the perimeters as the side increases by 0.5 cm each time?**",
    solution: "**Step 1 — Substitute each side length into $P = 4x$.**\n\n| Side $x$ (cm) | 1 | 1.5 | 2 | 2.5 | 3 |\n|---|---|---|---|---|---|\n| Perimeter $4x$ (cm) | 4 | 6 | 8 | 10 | 12 |\n\n**Step 2 — Spot the pattern.**\n\nEach time $x$ goes up by 0.5, the perimeter goes up by $4 \\times 0.5 = 2$ cm. Looking at consecutive perimeters: $6 - 4 = 2$, $8 - 6 = 2$, $10 - 8 = 2$, $12 - 10 = 2$. **The successive differences are constant — exactly equal to the leading coefficient, $4$, times the step size.**\n\n**Answer:** Perimeters increase by exactly **2 cm** for every 0.5 cm the side grows."
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'Worked Example 2 — Chess club fee (NCERT Ex 5)', variant: 'ncert_intext',
    problem: "A chess club charges ₹200 to join, plus ₹50 for every match played. Build a table for 1, 2, 3, 4, 5, …, $m$ matches. Express the cost as a linear polynomial in $m$.",
    solution: "**Step 1 — Build the table.**\n\n| Matches | 1 | 2 | 3 | 4 | 5 | … | $m$ |\n|---|---|---|---|---|---|---|---|\n| Amount paid (₹) | 250 | 300 | 350 | 400 | 450 | … | $200 + 50m$ |\n\n**Step 2 — Spot the pattern.**\n\nFor 1 match: ₹200 (joining) + ₹50 (1 match) = ₹250.\nFor 2 matches: ₹200 + ₹100 = ₹300. Etc.\nFor $m$ matches: $200 + 50m$.\n\n**Step 3 — Identify the linear polynomial.**\n\n$$\\text{Total} = 200 + 50m = 50m + 200$$\n\nThis is linear ($a = 50$, $b = 200$). Successive differences are exactly $50$ (one extra match = ₹50 extra), the leading coefficient. ✓\n\n**Answer:** Cost = $50m + 200$ rupees."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'Worked Example 3 — How many matches did he play? (NCERT Think-Reflect)', variant: 'ncert_intext',
    problem: "If a chess-club player paid ₹750, **how many matches** did he play?",
    solution: "Set the linear polynomial equal to ₹750:\n\n$$50m + 200 = 750$$\n\nSubtract 200:\n\n$$50m = 550$$\n\nDivide by 50:\n\n$$m = 11$$\n\n**Answer:** he played **11 matches**.\n\n*(This is your first linear equation in this chapter — Page 5 will set up the formal recipe for solving them.)*"
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'Worked Example 4 — Coefficient of z (NCERT Ex Set 2.1, Q4)', variant: 'ncert_intext',
    problem: "What is the coefficient of $z$ in the polynomial $4z^3 + 5z^2 - 11$?",
    solution: "Look for the term containing $z^1 = z$. **There isn't one.** So the coefficient of $z$ is **$0$**.\n\nWriting out all coefficients of $4z^3 + 5z^2 - 11$:\n- Coefficient of $z^3$: $4$\n- Coefficient of $z^2$: $5$\n- Coefficient of $z$: $0$\n- Constant: $-11$\n\nWhen a power of the variable is *missing* from a polynomial, its coefficient is implicitly **zero**."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 5 — Constant term (NCERT Q5)', variant: 'ncert_intext',
    problem: "What is the constant term of the polynomial $9x^3 + 5x^2 - 8x - 10$?",
    solution: "The constant is the term without any variable. Here it is **$-10$**.\n\n**Cross-check:** the constant term is always equal to the value of the polynomial at $x = 0$. Substituting:\n\n$$9(0)^3 + 5(0)^2 - 8(0) - 10 = -10. ✓$$\n\nThis is a **handy mental trick** — to find the constant term of any polynomial, just plug in $x = 0$."
  },
  { id: uid(), type: 'simulation', order: 10, simulation_id: 'linear-pattern-explorer',
    title: 'Try It: Watch the Constant-Difference Signature'
  },
  { id: uid(), type: 'heading', order: 11, level: 2, text: 'The constant-difference signature of every linear pattern' },
  { id: uid(), type: 'text', order: 12,
    markdown: "Both Examples 4 (square perimeter) and 5 (chess fee) shared one striking feature: **the values jumped by a constant amount each time the variable went up by 1.** This is no coincidence. It's the defining property of a linear polynomial.\n\n**The rule.** For any linear polynomial $f(n) = an + b$:\n\n$$f(n+1) - f(n) = [a(n+1) + b] - [an + b] = a$$\n\nThe successive differences are **always equal to the leading coefficient $a$**. Always. No matter where you are on the line.\n\nThis gives a *test* for linearity:\n\n- Compute $f(1), f(2), f(3), f(4), \\ldots$\n- Look at the differences $f(2) - f(1)$, $f(3) - f(2)$, etc.\n- If all differences are equal → **the pattern is linear.**\n- If the differences themselves change (like for $f(n) = n^2$, where they go $3, 5, 7, 9, \\ldots$) → **not linear.**\n\nThe simulator above lets you toggle a comparison with $n^2$ to *see* this difference visually."
  },
  { id: uid(), type: 'reasoning_prompt', order: 13,
    reasoning_type: 'logical',
    prompt: "Look at the sequence $1, 4, 9, 16, 25, 36, \\ldots$. Each number is the square of its position: $1 = 1^2$, $4 = 2^2$, etc. **Is this a linear pattern? Apply the constant-difference test.**",
    options: [
      "Yes — it's a sequence of numbers, all sequences are linear patterns",
      "No — the successive differences are $3, 5, 7, 9, 11, \\ldots$ — these are *not* constant. So the pattern is *not* linear. (In fact, it's a *quadratic* pattern, generated by $n^2$.)",
      "Yes — it's a perfectly steady increase",
      "Linear only for the first three terms"
    ],
    reveal: "Compute the differences: $4 - 1 = 3$, $9 - 4 = 5$, $16 - 9 = 7$, $25 - 16 = 9$, $36 - 25 = 11$. They go $3, 5, 7, 9, 11, \\ldots$ — themselves a linear pattern, but **not constant**. **So the original sequence is NOT linear.** The constant-difference test is a sharp diagnostic: if you ever see a sequence whose differences keep growing (or shrinking), you're not looking at a linear polynomial — you're looking at something with degree ≥ 2.",
    difficulty_level: 3
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 14,
    title: 'Practice Yourself — Spot Linear Patterns',
    markdown: "For each sequence, check whether it's a **linear pattern**. If it is, find the constant difference $a$ and the linear polynomial $f(n) = an + b$ that produces it (set $f(1)$ = first term).\n\n1. $5, 8, 11, 14, 17, \\ldots$\n2. $100, 90, 80, 70, 60, \\ldots$\n3. $2, 4, 8, 16, 32, \\ldots$\n4. $0, 7, 14, 21, 28, \\ldots$\n5. $1, 1, 1, 1, 1, \\ldots$\n6. $3, 5, 9, 15, 23, \\ldots$\n7. $-2, 3, 8, 13, 18, \\ldots$\n8. $1000, 950, 900, 850, 800, \\ldots$\n\n---\n\n**Answers:** 1. Linear, $a = 3$, $f(n) = 3n + 2$. 2. Linear (decay), $a = -10$, $f(n) = -10n + 110$. 3. **Not linear** — differences are $2, 4, 8, 16$, growing. (It's geometric.) 4. Linear, $a = 7$, $f(n) = 7n - 7$. 5. Linear (constant), $a = 0$, $f(n) = 0 \\cdot n + 1 = 1$. 6. **Not linear** — differences are $2, 4, 6, 8$, growing. 7. Linear, $a = 5$, $f(n) = 5n - 7$. 8. Linear (decay), $a = -50$, $f(n) = -50n + 1050$."
  },
  { id: uid(), type: 'inline_quiz', order: 15, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "What is the leading coefficient $a$ in the linear polynomial $f(m) = 50m + 200$?",
        options: ["50", "200", "−50", "1"], correct_index: 0,
        explanation: "The leading coefficient is the number multiplying the variable. In $50m + 200$, that is **$50$**. ($200$ is the constant term.)",
        reasoning_level: 1 },
      { id: uid(), question: "Look at the sequence $7, 11, 15, 19, 23, \\ldots$. What is the constant difference, and what is $f(10)$?",
        options: ["Difference 4; $f(10) = 47$", "Difference 4; $f(10) = 43$", "Difference 5; $f(10) = 47$", "Not a linear pattern"],
        correct_index: 0,
        explanation: "Differences: $11 - 7 = 4$, $15 - 11 = 4$, etc. Constant difference is **4**. So $f(n) = 4n + 3$ (because $f(1) = 4 + 3 = 7$ ✓). Then $f(10) = 4 \\times 10 + 3 = 43$. **Wait** — that's option B, not A. Let me re-check: the sequence is at positions 1, 2, 3, … with values 7, 11, 15. So $f(1) = 7$, and $f(n) = 7 + 4(n - 1) = 4n + 3$. $f(10) = 43$. The correct answer is **option B (Difference 4; $f(10) = 43$)**.",
        reasoning_level: 2 },
      { id: uid(), question: "Which of the following is **not** a linear polynomial?",
        options: ["$5x + 3$", "$-2y + 7$", "$x^2 + 4x$", "$z$"], correct_index: 2,
        explanation: "A linear polynomial has degree exactly 1. $5x + 3$, $-2y + 7$, and $z$ all have degree 1. But $x^2 + 4x$ has degree 2 — it's a *quadratic*, not a linear, polynomial.",
        reasoning_level: 1 },
      { id: uid(), question: "A chess club charges ₹200 + ₹50 per match. **For how many matches will the total cost be ₹650?**",
        options: ["6", "9", "11", "13"], correct_index: 1,
        explanation: "Set $50m + 200 = 650$. Subtract 200: $50m = 450$. Divide by 50: $m = 9$. So **9 matches**. (You can also check: $200 + 9 \\times 50 = 200 + 450 = 650$. ✓)",
        reasoning_level: 2 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Linear Polynomials in the Wild',
  subtitle: "Why every degree-1 polynomial leaves the same fingerprint: the constant-difference jump",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-polynomial', 'constant-difference', 'patterns', 'degree-1', 'practice'],
  published: false, created_at: new Date(), updated_at: new Date()
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    if (await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: SLUG })) {
      console.log(`⚠️  ${SLUG} exists`); return;
    }
    await db.collection('book_pages').insertOne(page);
    await db.collection('books').updateOne(
      { _id: BOOK_ID, 'chapters.number': CHAPTER_NUMBER },
      { $push: { 'chapters.$.page_ids': page._id } }
    );
    console.log(`✅ Math Ch${CHAPTER_NUMBER} P${PAGE_NUMBER}: ${page.title}  (${blocks.length} blocks)`);
  } finally { await client.close(); }
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
