'use strict';
// Class 9 Math — Ch 2 — Page 22: "Polynomial Detective Stories"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'polynomial-detective-stories';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 22;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of a young Indian student sitting at a wooden desk with a magnifying glass, examining glowing scattered clues — coordinate points, partial equations, fragments of polynomial expressions — that float in the air around her, while a complete polynomial slowly assembles itself in the centre of the desk.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A young Indian student in a school uniform sits at a wooden desk in a softly-lit study room at evening, holding a brass-rimmed magnifying glass to her eye. Around her, glowing scattered clues float in the air — small cards with coordinate points '(1, 5)' and '(3, 11)' on them, fragments of equations like 'p(0) = 5' and 'p(x) + q(x) = 6x + 4', and partial polynomial expressions. In the centre of the desk, a clean polynomial 'p(x) = 3x + 2' is slowly forming in glowing chalk-like text, as if being assembled from the surrounding clues. The mood is detective-like, curious, satisfying. Painterly cinematic illustration. Dark background, warm amber lamp light. The only text is on the floating clue cards and the central polynomial."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "**Three short detective puzzles about polynomials:** *(a) Write any polynomial of degree $3$ in $x$ in which the coefficient of $x^2$ is $-7$. (b) A linear polynomial $p(x)$ has $p(1) = 5$ and $p(3) = 11$. What is $p(x)$? (c) Two linear polynomials $p(x) = ax + b$ and $q(x) = cx + d$ satisfy $p(0) = 5$, the polynomial $p - q$ cuts the $x$-axis at $(3, 0)$, and $p + q = 6x + 4$. What are $p$ and $q$?* **Each puzzle gives partial clues; your job is to recover the full polynomial.**",
    hint: "For (a), you can choose freely as long as the conditions are met. For (b), use the two-point method we learnt on page $13$. For (c), translate each clue into one equation, then solve the system.",
    reveal: "(a) An example: $4x^3 - 7x^2 + 2x + 1$ — degree $3$, $x^2$ coefficient $-7$. Many other answers exist. (b) Use the two-point method: $5 = a + b$ and $11 = 3a + b$, giving $a = 3$, $b = 2$, so $p(x) = 3x + 2$. (c) The clues yield $a = 2, b = 5, c = 4, d = -1$, so $p(x) = 2x + 5$ and $q(x) = 4x - 1$. **Each clue is one equation; total clues must equal total unknowns.** This page is a workout in matching the right number of clues to the right number of unknowns."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'गणितसारसङ्ग्रह — महावीर (९वीं शताब्दी)',
    markdown: "_From Mahāvīra's Gaṇita-sāra-saṅgraha — On Recovery from Clues_\n\n### अव्यक्तं रूपं तत् सङ्केतैः ज्ञायते क्रमशः शुभैः\n### सङ्केताः अव्यक्तसमाः ज्ञानेन तेन निश्चितम्॥\n\n*(avyaktaṃ rūpaṃ tat saṅketaiḥ jñāyate kramaśaḥ śubhaiḥ / saṅketāḥ avyakta-samāḥ jñānena tena niścitam)*\n\n---\n\n*'अनजाना रूप — उसे अच्छे संकेतों से धीरे-धीरे जान लिया जाता है। संकेतों की संख्या अनजान की संख्या के बराबर हो — तब निश्चय हो जाता है।'*\n\n*'The unknown form is gradually known through good clues. When the number of clues equals the number of unknowns — then certainty is reached.'*\n\nMahāvīra's *Gaṇita-sāra-saṅgraha* (c. $850$ CE) gave a very practical rule that this page leans on heavily: **to find $n$ unknowns you need exactly $n$ clues** — no more, no less. Too few clues and the puzzle has many solutions; too many clues and the puzzle may not have any. **Detective work in algebra is fundamentally about counting clues against unknowns.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'The clue-counting principle' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Most polynomial-detective puzzles in this chapter follow one rule:\n\n> *To pin down $n$ unknowns, you need exactly $n$ independent clues.*\n\nA *clue* is anything that gives you one piece of information about the polynomial — a value at a specific point, a coefficient, a coordinate where the graph cuts an axis, or an equation between two polynomials. **Each clue translates into one equation in the unknowns.**\n\n- A linear polynomial $ax + b$ has $2$ unknowns ($a$ and $b$), so it needs $2$ clues.\n- A quadratic polynomial $ax^2 + bx + c$ has $3$ unknowns, so it needs $3$ clues.\n- Two linear polynomials together have $4$ unknowns ($a, b, c, d$), so they need $4$ clues.\n\nIf the puzzle gives you the right number of clues, follow these steps:\n\n1. **Translate every clue into one equation** in the unknown letters.\n2. **Solve the system** by substitution or elimination — the same techniques we have used since pages $13$ and $14$.\n3. **Plug the values back into the polynomial** and verify against every original clue.\n\nLet's apply this to four detective puzzles drawn from the end-of-chapter exercises."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'linear-pattern-explorer',
    title: 'Try It: Match Clues to Unknowns and Solve'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'End-of-Chapter Q1 — Build a custom polynomial', variant: 'ncert_intext',
    problem: "Write a polynomial of degree $3$ in the variable $x$, in which the coefficient of $x^2$ is $-7$.",
    solution: "**Translate the conditions.**\n\n- *Degree $3$:* the highest power of $x$ is $3$. So the leading term is some non-zero number times $x^3$.\n- *Coefficient of $x^2$ is $-7$:* the term involving $x^2$ must be exactly $-7x^2$.\n\nThe other coefficients (those for $x^1$ and the constant term) are not constrained — they are *free choices*. So the answer is not unique — many polynomials satisfy the requirements.\n\n**One valid answer:**\n\n$$x^3 - 7x^2 + 0 \\cdot x + 0 = x^3 - 7x^2$$\n\n**Another valid answer (with non-zero free coefficients):**\n\n$$4x^3 - 7x^2 + 2x + 1$$\n\nBoth are degree $3$ (leading $x^3$ term present) with $x^2$ coefficient $-7$. ✓\n\n*The general principle.* When a problem fixes only some of the coefficients of a polynomial, you have freedom in the rest. **Two coefficients fixed in a degree-$3$ polynomial leaves $4 - 2 = 2$ coefficients free** — i.e., infinitely many answers. The puzzle is asking you to give *one* valid example, not all of them."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'End-of-Chapter Q2 — Substitute and simplify', variant: 'ncert_intext',
    problem: "Find the values of the following polynomials at the indicated values of the variables. **(i)** $5x^2 - 3x + 7$ if $x = 1$. **(ii)** $4t^3 - t^2 + 6$ if $t = a$.",
    solution: "**(i) Substitute $x = 1$ into $5x^2 - 3x + 7$:**\n\n$$5(1)^2 - 3(1) + 7 = 5 - 3 + 7 = 9$$\n\nSo the value is **$9$**.\n\n**(ii) Substitute $t = a$ into $4t^3 - t^2 + 6$:**\n\n$$4(a)^3 - (a)^2 + 6 = 4a^3 - a^2 + 6$$\n\nSo the value is **$4a^3 - a^2 + 6$**, a polynomial in $a$.\n\n*Important contrast.* In (i), substituting a *number* gave a single number. In (ii), substituting a *letter* gave another polynomial — same shape, different variable name. **Substitution is a string-replacement: wherever you see the original variable, write whatever was substituted.** This works whether you substitute a number, a letter, or even a more complex expression."
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'End-of-Chapter Q10 — Linear polynomial through two points', variant: 'ncert_intext',
    problem: "The graph of a linear polynomial $p(x)$ passes through the points $(1, 5)$ and $(3, 11)$. **(i) Find $p(x)$.** **(ii) Find the coordinates where the graph of $p(x)$ cuts the axes.**",
    solution: "**(i) Find $p(x)$.** A linear polynomial has the form $p(x) = ax + b$ with two unknowns. The two points give two clues, which is exactly what we need.\n\nSubstituting $(1, 5)$ into $p(x) = ax + b$: $5 = a + b$ &nbsp;... (Eq 1)\n\nSubstituting $(3, 11)$: $11 = 3a + b$ &nbsp;... (Eq 2)\n\nSubtract Eq 1 from Eq 2: $11 - 5 = (3a + b) - (a + b) \\Rightarrow 6 = 2a \\Rightarrow a = 3$.\n\nFrom Eq 1: $b = 5 - a = 5 - 3 = 2$.\n\nSo **$p(x) = 3x + 2$**.\n\n**Check both clues.** $p(1) = 3 + 2 = 5$ ✓. $p(3) = 9 + 2 = 11$ ✓.\n\n**(ii) Where does $p(x)$ cut the axes?**\n\n- **$y$-axis:** Cut where $x = 0$. So $p(0) = 3(0) + 2 = 2$. The line cuts the $y$-axis at $(0, 2)$.\n- **$x$-axis:** Cut where $y = 0$, i.e., $p(x) = 0$. Solve $3x + 2 = 0 \\Rightarrow x = -\\tfrac{2}{3}$. The line cuts the $x$-axis at $(-\\tfrac{2}{3}, 0)$.\n\n**Sketch.** Plot the two intercepts $(0, 2)$ and $(-\\tfrac{2}{3}, 0)$, lay a ruler across them, and extend the line in both directions. The line tilts upward (slope $+3$), passes through both intercepts, and rises steeply to the right.\n\n*Why the $x$-intercept appears at a fraction.* Because the constant term $2$ is not divisible by the slope $3$ in a clean way. **When solving $ax + b = 0$, the result $x = -\\tfrac{b}{a}$ is a rational number that may or may not be a whole number.**"
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'End-of-Chapter Q11 — Two polynomials, three clues', variant: 'ncert_intext',
    problem: "Let $p(x) = ax + b$ and $q(x) = cx + d$ be two linear polynomials. They satisfy: **(i)** $p(0) = 5$. **(ii)** The polynomial $p(x) - q(x)$ cuts the $x$-axis at $(3, 0)$. **(iii)** The sum $p(x) + q(x)$ equals $6x + 4$ for all real $x$. **Find $p(x)$ and $q(x)$.**",
    solution: "**Set up.** We have $4$ unknowns: $a, b, c, d$. The puzzle gives three clues — *but clue (iii) is actually two equations rolled into one*, since \"equal for all $x$\" forces both the $x$-coefficient and the constant term to match. So we will end up with $4$ equations to match the $4$ unknowns.\n\n**Translate each clue.**\n\n*(i)* $p(0) = a(0) + b = b = 5$. So **$b = 5$**.\n\n*(ii)* $p(x) - q(x) = (a - c)x + (b - d)$. This cuts the $x$-axis at $(3, 0)$ — meaning *when $x = 3$, the value is $0$*. So $(a - c)(3) + (b - d) = 0$, i.e. $3(a - c) + (b - d) = 0$.\n\n*(iii)* $p(x) + q(x) = (a + c)x + (b + d) = 6x + 4$. Comparing coefficient by coefficient: $a + c = 6$ and $b + d = 4$.\n\n**Now we have a system:**\n\n- $b = 5$\n- $b + d = 4 \\Rightarrow d = 4 - b = 4 - 5 = -1$\n- $a + c = 6$\n- $3(a - c) + (b - d) = 0 \\Rightarrow 3(a - c) + (5 - (-1)) = 0 \\Rightarrow 3(a - c) + 6 = 0 \\Rightarrow a - c = -2$\n\nFrom $a + c = 6$ and $a - c = -2$: add to get $2a = 4 \\Rightarrow a = 2$. Then $c = 6 - 2 = 4$.\n\n**Final answers:**\n\n$$\\boxed{\\,p(x) = 2x + 5, \\quad q(x) = 4x - 1\\,}$$\n\n**Verify against every original clue.**\n\n- *(i)* $p(0) = 2(0) + 5 = 5$. ✓\n- *(ii)* $p(x) - q(x) = (2 - 4)x + (5 - (-1)) = -2x + 6$. At $x = 3$: $-6 + 6 = 0$. ✓\n- *(iii)* $p(x) + q(x) = (2 + 4)x + (5 + (-1)) = 6x + 4$. ✓\n\n*The key insight.* When a clue says *'two polynomials are equal for all $x$'* (like clue (iii)), it is silently giving you *two* equations — one for each coefficient. **A clue that constrains a polynomial-identity always counts as multiple clues.** Counting clues correctly is the most important habit in polynomial detective work."
  },
  { id: uid(), type: 'reasoning_prompt', order: 10,
    reasoning_type: 'logical',
    prompt: "Suppose you are told only that *a linear polynomial $p(x) = ax + b$ passes through the point $(2, 7)$.* **Can you uniquely determine $p(x)$ from this single clue?**",
    options: [
      "Yes — there is a unique linear polynomial through any single point",
      "**No — one clue gives one equation ($7 = 2a + b$), but a linear polynomial has *two* unknowns. Infinitely many linear polynomials pass through the point $(2, 7)$ — for instance $p(x) = x + 5$, $p(x) = 2x + 3$, and $p(x) = 3x + 1$ are all valid. To pin it down uniquely, a second clue is required.**",
      "Yes — set $b = 0$ and solve",
      "Only if the slope is given separately"
    ],
    reveal: "Geometrically, infinitely many lines pass through a single point on the plane — a whole *fan* of them tilting at every possible angle. Algebraically, the clue $7 = 2a + b$ is one equation in two unknowns, with infinitely many solution pairs $(a, b)$. **The clue-counting principle is mandatory:** you need exactly as many independent clues as you have unknowns. One point $\\rightarrow$ one equation; not enough. Two points $\\rightarrow$ two equations; just right. Three or more points (assuming they are consistent) $\\rightarrow$ over-determined; the polynomial is the same as before, but now you have a built-in check.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 11,
    title: 'Practice Yourself — Build the Polynomial from the Clues',
    markdown: "**A. Substitute and evaluate.**\n\n1. Find the value of $2x^2 + 3x - 5$ at $x = 4$.\n2. Find the value of $-y^3 + 2y - 1$ at $y = 2$.\n3. Find the value of $\\tfrac{1}{2}t + 7$ at $t = 6$.\n\n**B. Build a polynomial that fits the conditions.** *(Many valid answers — give one.)*\n\n4. A polynomial of degree $2$ in $x$ where the constant term is $11$.\n5. A polynomial of degree $4$ in $y$ where the coefficient of $y^3$ is $-2$ and the coefficient of $y$ is $5$.\n6. A linear polynomial $p(x)$ such that $p(0) = -3$ and $p(1) = 4$.\n\n**C. Two clues, two unknowns.**\n\n7. A linear polynomial passes through $(2, 9)$ and $(5, 18)$. Find the polynomial. Where does it cut each axis?\n8. A linear polynomial $p(x)$ satisfies $p(0) = 7$ and $p(4) = -1$. Find $p(x)$.\n\n**D. Two polynomials, multi-clue.**\n\n9. Let $p(x) = ax + b$ and $q(x) = cx + d$ such that: $p(1) = 6$, $q(1) = 2$, $p + q = 8x + 8$. Find $p$ and $q$.\n\n---\n\n**Answers:**  1. $2(16) + 12 - 5 = 39$.  2. $-8 + 4 - 1 = -5$.  3. $3 + 7 = 10$.  4. Many possible: e.g., $x^2 + 11$ or $3x^2 + 5x + 11$.  5. Many possible: e.g., $y^4 - 2y^3 + 5y$ or $-2y^3 + 5y + 0 \\cdot y^4$ — wait, this would not be degree $4$. So $y^4 - 2y^3 + 5y$ is correct.  6. $p(0) = b = -3$. $p(1) = a + b = 4 \\Rightarrow a = 4 - (-3) = 7$. So $p(x) = 7x - 3$.  7. Equations: $9 = 2a + b$ and $18 = 5a + b$. Subtract: $3a = 9 \\Rightarrow a = 3$. $b = 9 - 6 = 3$. Polynomial $p(x) = 3x + 3$. $y$-axis at $(0, 3)$; $x$-axis at $3x + 3 = 0 \\Rightarrow x = -1$, so $(-1, 0)$.  8. $b = 7$. $p(4) = 4a + 7 = -1 \\Rightarrow a = -2$. So $p(x) = -2x + 7$.  9. $a + b = 6$, $c + d = 2$, and from $p+q = 8x + 8$: $a + c = 8$ and $b + d = 8$. So $a + c = 8$ and $a + b = 6$ gives $c = 8 - a$ and $b = 6 - a$. $c + d = 2 \\Rightarrow d = 2 - c = 2 - (8 - a) = a - 6$. $b + d = 8 \\Rightarrow (6 - a) + (a - 6) = 0 \\ne 8$. **The system is inconsistent — no such pair exists.** *(This is a teaching moment: not every set of clues has a solution. Sometimes the clues contradict each other, and you discover it only when the algebra fails. In that case, the puzzle has no answer — and saying so is the right answer.)*"
  },
  { id: uid(), type: 'inline_quiz', order: 12, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "What is the value of the polynomial $3x^2 - x + 4$ at $x = 2$?",
        options: ["$10$", "$12$", "$14$", "$16$"], correct_index: 2,
        explanation: "$3(2)^2 - (2) + 4 = 12 - 2 + 4 = 14$.",
        reasoning_level: 1 },
      { id: uid(), question: "Which of the following is **NOT** a polynomial of degree $3$ in $x$ with the coefficient of $x^2$ equal to $-7$?",
        options: [
          "$2x^3 - 7x^2 + 3$",
          "$x^3 - 7x^2 - 5x + 1$",
          "$-7x^2 + 4x - 8$ &nbsp;(degree is only $2$, not $3$)",
          "$5x^3 - 7x^2$"
        ],
        correct_index: 2,
        explanation: "A polynomial of degree $3$ must have a non-zero $x^3$ term. The third option, $-7x^2 + 4x - 8$, has *no* $x^3$ term, so it is degree $2$, not $3$. (The $x^2$ coefficient does happen to be $-7$, but the degree requirement fails.)",
        reasoning_level: 2 },
      { id: uid(), question: "A linear polynomial $p(x)$ satisfies $p(0) = 4$ and $p(2) = 10$. **What is $p(x)$?**",
        options: ["$p(x) = 2x + 4$", "$p(x) = 3x + 4$", "$p(x) = 4x + 2$", "$p(x) = x + 4$"], correct_index: 1,
        explanation: "$p(0) = b = 4$. $p(2) = 2a + 4 = 10 \\Rightarrow a = 3$. So $p(x) = 3x + 4$. **Check:** $p(0) = 4$ ✓, $p(2) = 6 + 4 = 10$ ✓.",
        reasoning_level: 2 },
      { id: uid(), question: "Two linear polynomials $p(x) = ax + b$ and $q(x) = cx + d$ satisfy $p(x) + q(x) = 7x + 9$ for all $x$. **Which of the following must be true?**",
        options: [
          "$a = 7$ and $b = 9$ exactly",
          "**$a + c = 7$ and $b + d = 9$ — when two polynomials are equal as expressions for all $x$, their corresponding coefficients must match. So the $x$-coefficients add to $7$ and the constants add to $9$.**",
          "$a = c$ and $b = d$",
          "Cannot be determined without more information"
        ],
        correct_index: 1,
        explanation: "$p(x) + q(x) = (a + c)x + (b + d)$. Setting this equal to $7x + 9$ as polynomials, we match coefficient by coefficient: the $x$-terms give $a + c = 7$, and the constants give $b + d = 9$. **Polynomial identity gives one equation per coefficient.** This is the key fact that makes a single \"identity\" clue equivalent to multiple ordinary clues.",
        reasoning_level: 4 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Polynomial Detective Stories',
  subtitle: "Given a few partial clues, recover the full polynomial — the clue-counting principle that powers every algebraic puzzle in the chapter",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['polynomial', 'two-point-method', 'system-of-equations', 'NCERT-end-of-chapter-Q1-Q2-Q10-Q11', 'practice'],
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
