'use strict';
// Class 9 Math — Ch 2 — Page 3: "What's a Polynomial? Degree & Family Tree"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'what-is-a-polynomial-degree-family-tree';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 3;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A vast cinematic 'family tree' rising into a starry sky — its trunk labelled 'Polynomial', branching into four glowing leaves: Constant, Linear, Quadratic, Cubic, each in a distinct colour",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A glowing genealogical 'family tree' rises out of a dark misty foreground into a deep starry navy sky. The trunk is labelled with a soft golden 'POLYNOMIAL' inscription that fades into branches. Four broad branches arc outward, each ending in a stylised glowing leaf in a distinct colour: pale grey for 'Constant', emerald green for 'Linear', sky blue for 'Quadratic', violet for 'Cubic'. Faint mathematical formulas float around each leaf. The image conveys: every algebraic expression in one variable belongs to one of these branches by its degree. Painterly cinematic illustration in the style of mathematical wonder. Dark background. No text labels other than what is described."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Look at four expressions: $4x$, $x^2 + 1$, $5y^3 + y^2 - 8$, $-9$. They all involve **one** variable. **Which is the simplest? Which is the most complicated? What rule could you use to compare their 'difficulty'?**",
    hint: "Notice the *highest power* of the variable in each — does that look like a useful ranking?",
    reveal: "The highest power of the variable is called the **degree** of the polynomial. $-9$ has no variable (degree 0). $4x$ has degree 1. $x^2 + 1$ has degree 2. $5y^3 + y^2 - 8$ has degree 3. The degree gives a clean way to organise polynomials into families: **constant, linear, quadratic, cubic, …** and so on. This page introduces all four families and shows how to spot each."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'ब्रह्मस्फुटसिद्धान्त — ब्रह्मगुप्त (६२८ CE)',
    markdown: "_From Brahmagupta's Brahmasphuṭa-siddhānta — On Classifying Equations_\n\n### एकवर्णसमीकरणम् वर्गसमीकरणं तथा\n### घनसमीकरणं चेति त्रिविधं समीक्ष्यताम्॥\n\n*(eka-varṇa-samīkaraṇam varga-samīkaraṇaṃ tathā / ghana-samīkaraṇaṃ ceti tri-vidhaṃ samīkṣyatām)*\n\n---\n\n*'समीकरण तीन प्रकार के होते हैं — सामान्य (एक चिन्ह), वर्ग (वर्गयुक्त), और घन (घनयुक्त)।'*\n\n*'Equations are of three kinds — *eka-varṇa* (linear, one symbol), *varga* (quadratic, with a square), and *ghana* (cubic, with a cube).'*\n\nIn 628 CE, Brahmagupta organised algebra by the *highest power of the unknown* — exactly the **degree-based classification** you'll learn on this page. The Sanskrit names — *eka-varṇa* for linear, *varga* for quadratic, *ghana* for cubic — appear in *every* Indian algebra text from then on. The English words *quadratic* (Latin *quadratus*, square) and *cubic* are direct translations of the Sanskrit. **Brahmagupta named the family tree we're about to draw.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'From algebraic expression to polynomial' },
  { id: uid(), type: 'text', order: 4,
    markdown: "On the previous page, you saw three kinds of expression — some with two variables ($4x + 5y + 3$, $200l + 160w + 50lw$) and one with just one ($10x - x^2$). **From now on, we focus on the one-variable case.**\n\nA **polynomial in one variable** (also called a *univariate polynomial*, or just *polynomial* when the context is clear) is an expression built from a single variable, its non-negative integer powers, and numbers — combined with addition, subtraction, and multiplication.\n\n**Examples that *are* polynomials:**\n\n- $4x$  &nbsp;·&nbsp;  $x^2 + 5x + 1$  &nbsp;·&nbsp;  $2y - 5$  &nbsp;·&nbsp;  $5y^3 + y^2 + 2y - 1$  &nbsp;·&nbsp;  $3z + 7$  &nbsp;·&nbsp;  $-9$\n\n**Examples that are *not* polynomials:**\n\n- $\\sqrt{x} + 1$ — it has $x^{1/2}$, a *fractional* power. Not allowed.\n- $\\frac{1}{x} + 5$ — it has $x^{-1}$, a *negative* power. Not allowed.\n- $2^x$ — the variable is in the *exponent*, not the base. Not allowed.\n\nIn a polynomial, the variable's **only** powers are 0, 1, 2, 3, 4, … (whole numbers ≥ 0)."
  },
  { id: uid(), type: 'heading', order: 5, level: 2, text: 'Degree — the highest power that appears' },
  { id: uid(), type: 'text', order: 6,
    markdown: "Every polynomial has a **degree** — the highest power of the variable that appears in any term. The degree is the single most important number describing a polynomial.\n\n- In $x^2 + 5x + 1$, the highest power of $x$ is **2**. Degree = 2.\n- In $5y^3 + y^2 - 8$, the highest power of $y$ is **3**. Degree = 3.\n- In $3z + 7 = 3z^1 + 7z^0$, the highest power of $z$ is **1**. Degree = 1.\n- In $8$, there is no variable — but we can write $8 = 8x^0$, so the highest power is **0**. Degree = 0.\n\n**Degree organises polynomials into families:**\n\n| Degree | Family name | Example |\n|---|---|---|\n| 0 | **constant** polynomial | $8$, $-9$, $\\frac{1}{2}$ |\n| 1 | **linear** polynomial | $3z + 7$, $4x$, $2n - 1$ |\n| 2 | **quadratic** polynomial | $x^2 + 5x + 1$, $7s^2 - 4s + 6$ |\n| 3 | **cubic** polynomial | $5y^3 + y^2 + 2y - 1$ |\n\nDegrees 4, 5, 6 and higher exist too — they don't have such friendly names, but you'll meet them later. **The rest of this chapter zooms entirely into the linear case (degree 1) — the simplest non-trivial family.**"
  },
  { id: uid(), type: 'simulation', order: 7, simulation_id: 'polynomial-classifier',
    title: 'Try It: Inspect or Quiz Yourself on Polynomials'
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'Worked Example 1 — Find the degree (NCERT Ex Set 2.1, Q1)', variant: 'ncert_intext',
    problem: "Find the degrees of: (i) $2x^2 - 5x + 3$ &nbsp;(ii) $y^3 + 2y - 1$ &nbsp;(iii) $-9$ &nbsp;(iv) $4z - 3$",
    solution: "**(i)** $2x^2 - 5x + 3$ — highest power of $x$ is **2**. Degree = 2 (quadratic).\n\n**(ii)** $y^3 + 2y - 1$ — highest power of $y$ is **3**. Degree = 3 (cubic).\n\n**(iii)** $-9$ — no variable; write as $-9 \\cdot x^0$. Degree = **0** (constant).\n\n**(iv)** $4z - 3$ — highest power of $z$ is **1**. Degree = 1 (linear)."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 2 — Write polynomials of given degrees (NCERT Q2)', variant: 'ncert_intext',
    problem: "Write polynomials of degrees 1, 2, and 3.",
    solution: "Many answers are possible. Some examples:\n\n- **Degree 1 (linear):** $3x + 7$, or $-2y + 1$, or $5z$.\n- **Degree 2 (quadratic):** $x^2 + 4x + 4$, or $-y^2 + 1$, or $7s^2$.\n- **Degree 3 (cubic):** $x^3 - x$, or $2y^3 + y^2 + 5$, or $z^3$.\n\n**Rule:** the highest power of the variable must be exactly the degree you want — *no higher*. So for a *linear* polynomial, you cannot include any $x^2$ or $x^3$ term."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 3 — Coefficients (NCERT Q3)', variant: 'ncert_intext',
    problem: "What are the coefficients of $x^2$ and $x^3$ in the polynomial $x^4 - 3x^3 + 6x^2 - 2x + 7$?",
    solution: "**Step 1 — Pick out the term containing $x^2$.** It is $6x^2$. Coefficient of $x^2$ is **$6$**.\n\n**Step 2 — Pick out the term containing $x^3$.** It is $-3x^3$. Coefficient of $x^3$ is **$-3$**. (The negative sign belongs with the coefficient.)\n\n*Bonus observations:* the polynomial has degree **4** (highest power $x^4$, coefficient $1$); the constant term is $7$; the coefficient of $x$ is $-2$."
  },
  { id: uid(), type: 'worked_example', order: 11,
    label: 'Worked Example 4 — Coefficient of z (NCERT Q4)', variant: 'ncert_intext',
    problem: "What is the coefficient of $z$ in the polynomial $4z^3 + 5z^2 - 11$?",
    solution: "Look for the term containing $z^1$. **There isn't one.** The polynomial is $4z^3 + 5z^2 + 0 \\cdot z - 11$. So the coefficient of $z$ is **$0$**.\n\n*Lesson:* a coefficient of zero means the term is *missing*. Coefficients exist for *every* power up to the degree, but some can be 0."
  },
  { id: uid(), type: 'worked_example', order: 12,
    label: 'Worked Example 5 — Constant term (NCERT Q5)', variant: 'ncert_intext',
    problem: "What is the constant term of the polynomial $9x^3 + 5x^2 - 8x - 10$?",
    solution: "The constant term is the one without any variable. Here it is **$-10$**. (Sign included.)\n\n*Quick observation:* The constant term is also the value of the polynomial at $x = 0$. Substitute $x = 0$: $9(0) + 5(0) - 8(0) - 10 = -10$. ✓ Always true: **constant term = value at $x = 0$**."
  },
  { id: uid(), type: 'reasoning_prompt', order: 13,
    reasoning_type: 'logical',
    prompt: "Is $\\sqrt{x} + 1$ a polynomial? Is $\\frac{1}{x} + 5$? **Why or why not?**",
    options: [
      "Both are polynomials, since both contain a variable",
      "Neither is a polynomial — $\\sqrt{x} = x^{1/2}$ has a *fractional* power and $\\frac{1}{x} = x^{-1}$ has a *negative* power, but a polynomial only allows whole-number (≥ 0) powers of the variable",
      "$\\sqrt{x} + 1$ is a polynomial (it has $+1$); $\\frac{1}{x} + 5$ is not",
      "Both are polynomials of degree 1"
    ],
    reveal: "**Neither is a polynomial.** The definition is strict: a polynomial in $x$ is a sum of terms of the form $(\\text{number}) \\times x^k$, where $k$ is a *whole number* — that is, $k \\in \\{0, 1, 2, 3, \\ldots\\}$. The expression $\\sqrt{x}$ is the same as $x^{1/2}$ — power $\\frac{1}{2}$ is *fractional*, not allowed. The expression $\\frac{1}{x}$ is the same as $x^{-1}$ — power $-1$ is *negative*, not allowed. **The 'whole-number-power' rule is what makes polynomials a clean, well-behaved family.** Other expressions are perfectly valid mathematics, but they're not polynomials.",
    difficulty_level: 3
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 14,
    title: 'Practice Yourself — Identify, Classify, Inspect',
    markdown: "For each polynomial: state the **degree**, the **family name**, and the **coefficient of the highest-power term** (the *leading coefficient*). Cover the answers and try.\n\n1. $7x + 4$\n2. $x^2 - 9$\n3. $-3y^3 + y$\n4. $5$\n5. $2x^4 - x^3 + x - 1$\n6. $-z^2$\n7. $\\frac{1}{2}x + 3$\n8. $11y$\n9. $x^3 + x^2 + x + 1$\n10. $-7$\n\n---\n\n**Answers:** 1. degree 1, linear, leading coeff 7. 2. degree 2, quadratic, leading coeff 1. 3. degree 3, cubic, leading coeff −3. 4. degree 0, constant, the constant *is* the leading coeff = 5. 5. degree 4, *no friendly name* (call it 'degree-4 polynomial'), leading coeff 2. 6. degree 2, quadratic, leading coeff −1. 7. degree 1, linear, leading coeff ½. 8. degree 1, linear, leading coeff 11. 9. degree 3, cubic, leading coeff 1. 10. degree 0, constant, leading coeff −7."
  },
  { id: uid(), type: 'inline_quiz', order: 15, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "What is the **degree** of the polynomial $4z - 3$?",
        options: ["0", "1", "2", "3"], correct_index: 1,
        explanation: "Highest power of $z$ in $4z - 3 = 4z^1 - 3$ is **1**. Degree = 1, so this is a **linear** polynomial.",
        reasoning_level: 1 },
      { id: uid(), question: "Which of these is a **cubic** polynomial?",
        options: ["$x^2 + 2x + 1$", "$5x + 7$", "$2y^3 - y + 4$", "$8$"], correct_index: 2,
        explanation: "A cubic polynomial has degree 3 — the highest power of its variable is 3. $2y^3 - y + 4$ has $y^3$ as its highest term. The others are quadratic (degree 2), linear (degree 1), and constant (degree 0).",
        reasoning_level: 1 },
      { id: uid(), question: "In the polynomial $x^4 - 3x^3 + 6x^2 - 2x + 7$, what is the coefficient of $x^3$?",
        options: ["3", "−3", "6", "−2"], correct_index: 1,
        explanation: "The term containing $x^3$ is $-3x^3$. The coefficient is **$-3$** — the negative sign is part of the coefficient. (You'd be wrong to ignore the sign and say 3.)",
        reasoning_level: 2 },
      { id: uid(), question: "Why is $\\frac{2}{x} + 5x$ **not** a polynomial?",
        options: [
          "It is — it contains a variable",
          "It is not — $\\frac{2}{x} = 2x^{-1}$ has a **negative power** of $x$; polynomials allow only non-negative integer powers",
          "It is not — fractions can never appear in polynomials",
          "It is — but only of degree 1"
        ],
        correct_index: 1,
        explanation: "$\\frac{2}{x}$ is the same as $2x^{-1}$ — and the exponent $-1$ is *negative*. A polynomial requires every power of the variable to be a non-negative integer ($0, 1, 2, 3, \\ldots$). The fraction $\\frac{2}{3}$ as a *coefficient* is fine; what is not allowed is a fractional or negative *power* of the variable.",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: "What's a Polynomial? Degree and Family Tree",
  subtitle: 'How a single number — the degree — sorts every one-variable expression into one of four named families',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['polynomial', 'degree', 'classification', 'linear', 'quadratic', 'cubic', 'constant', 'practice'],
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
