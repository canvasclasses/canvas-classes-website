'use strict';
// Class 9 Math — Ch 2 — Page 25: "Chapter Summary — Looking Back"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'chapter-summary-looking-back';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 25;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of a young Indian student standing on a hilltop at sunset, looking back at a glowing path of footprints that traces a long winding journey through a starry valley — each footprint marked with a key idea: an expression, a polynomial, a tile pattern, a line, a slope.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A young Indian schoolgirl in uniform stands at the top of a gentle hill at sunset, looking back over a vast starry valley. A long winding path of glowing golden footprints traces her journey from the bottom of the valley to where she now stands. Each footprint is labelled with a small glowing icon: a $4x + 5y$ expression on the first, a tile pattern on the second, a fan of lines on the third, a parallel-line marker on the fourth, and so on. The mood is reflective and triumphant. Painterly cinematic illustration, deep navy starry sky, warm amber sunset light. The only text is on the footprint labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Twenty-four pages ago, this chapter began with a stationery shop and the question *'why do we use letters?'* — and now, here at the end, we have travelled through every kind of linear behaviour you will ever meet in school mathematics. **Look back. Which idea do you think mattered most?**",
    hint: "Was it the introduction of *variables*? The classification of polynomials by *degree*? The shape $y = ax + b$? The geometric meanings of slope and y-intercept? Each idea built on the one before it.",
    reveal: "Every idea on this page was a *step* in the chapter's larger journey: from variables (page 1) to expressions (page 2), to polynomial classification (page 3), to the linear special case (pages 4-7), to growth and decay (pages 9-11), to the standard form $y = ax + b$ (pages 12-15), to slope and y-intercept as geometric meanings (pages 16-18), to applications (pages 19-24). **The chapter's deepest single idea is this: many real-world relationships have the same algebraic skeleton, and once you can read that skeleton, the world becomes more predictable.** This page is a quick guided tour of all the ideas, in their natural order — your map of the territory you have just learned."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'A Closing Subhāṣita',
    markdown: "_From the Subhāṣita-Ratna-Bhāṇḍāgāra — On Looking Back at What We Have Learnt_\n\n### अध्ययनस्य अन्ते दृष्टिः कृतम् मार्गे सुदर्शनम्\n### तथैव पथ-गतिः ज्ञानम् दृढ़ीभवति निश्चयम्॥\n\n*(adhyayanasya ante dṛṣṭiḥ kṛtam mārge sudarśanam / tathaiva patha-gatiḥ jñānam dṛḍhī-bhavati niścayam)*\n\n---\n\n*'अध्ययन के अंत में पीछे देखना — रास्ते पर जो सीखा है, उसे फिर से देखना। इसी तरह पथ की यात्रा से ज्ञान दृढ़ (पक्का) होता है।'*\n\n*'At the end of study, looking back — to see again what was learnt along the way. By such walking-back, knowledge becomes firm and certain.'*\n\nIndian gurus have always taught that *recall and reflection at the end of a topic* is what *fixes* the learning. **You will retain ten times more from a chapter if you spend ten minutes recalling it than if you spend ten minutes re-reading it.** This page is your guided recall — every key idea, in order, with one short sentence of meaning."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'Algebraic expressions — the starting line' },
  { id: uid(), type: 'text', order: 4,
    markdown: "An **algebraic expression** combines numbers, variables, and operation symbols. For example, $2x^2 + 5xy - 3y^2$ is an algebraic expression in two variables, $x$ and $y$.\n\n- The **terms** of an expression are the parts separated by $+$ or $-$. In $2x^2 + 5xy - 3y^2$, the terms are $2x^2$, $5xy$, and $-3y^2$.\n- The **coefficient** of a term is the number multiplying the variable part. The coefficients above are $2$, $5$, and $-3$.\n- A **constant** term is one with no variable, e.g. the $7$ in $4x + 7$.\n- A **variable** is a letter that stands for a number — e.g. $x$ or $y$ above.\n\nThis vocabulary appeared on page $1$ of the chapter and has been with us ever since."
  },
  { id: uid(), type: 'heading', order: 5, level: 2, text: 'Polynomials and their degree' },
  { id: uid(), type: 'text', order: 6,
    markdown: "A **univariate polynomial** is an algebraic expression involving only *one* variable, with that variable raised to whole-number powers ($\\ge 0$). Examples: $x^2 + 5x + 3$, $3y^3 - 4y^2 + 5$, $-7$, $2x$.\n\n- The **degree** of a univariate polynomial is the highest power of the variable that appears with a non-zero coefficient. So $x^2 + 5x + 3$ has degree $2$; $3y^3 - 4y^2 + 5$ has degree $3$; $-7$ has degree $0$.\n- A **constant polynomial** has degree $0$ — e.g. $-7$ or $5$.\n- A **linear polynomial** has degree $1$ — e.g. $2x + 3$ or $5 - 4y$.\n- A **quadratic polynomial** has degree $2$, a **cubic** has degree $3$, and so on.\n\nThis chapter focused on the *linear* case (degree $1$). Higher-degree polynomials will be the subject of future chapters."
  },
  { id: uid(), type: 'heading', order: 7, level: 2, text: 'Linear patterns and the constant difference' },
  { id: uid(), type: 'text', order: 8,
    markdown: "A **linear pattern** is a sequence of numbers in which the **difference between consecutive terms is constant** — the same number is added (or subtracted) at every step.\n\n- Tile pattern $1, 3, 5, 7, \\ldots$ — constant difference $+2$ → linear.\n- Population $750, 800, 850, 900, \\ldots$ — constant difference $+50$ → linear (growth).\n- Recharge balance $600, 585, 570, 555, \\ldots$ — constant difference $-15$ → linear (decay).\n\n**Linear growth** is a pattern where the quantity *increases* by a fixed amount over equal intervals. **Linear decay** is the opposite: the quantity *decreases* by a fixed amount.\n\nThe rule for the $n$-th term of a linear pattern can always be written as a linear polynomial in $n$: $f(n) = an + b$, where $a$ is the constant step and $b$ is determined by the starting value."
  },
  { id: uid(), type: 'heading', order: 9, level: 2, text: 'Linear relationships and the form $y = ax + b$' },
  { id: uid(), type: 'text', order: 10,
    markdown: "A **linear relationship** between two variables $x$ and $y$ can always be written in the standard form\n\n$$y = ax + b$$\n\nwhere $a$ and $b$ are fixed numbers. This is the algebraic skeleton of nearly every linear story we have met:\n\n- **Auto fare:** $y = 15x + 40$ (₹$15$/km, ₹$40$ base fare).\n- **Recharge balance:** $y = -15x + 600$.\n- **Phone value:** $y = -800x + 10000$.\n- **Population:** $y = 50x + 750$.\n- **Bill:** $y = 20x + 150$ (₹$20$/GB + ₹$150$ fixed).\n- **Celsius from Fahrenheit:** $y = \\tfrac{5}{9}(x - 32)$.\n\nThe two numbers $a$ and $b$ have specific names and meanings:\n\n- $a$ is the **slope** of the line — the *rate of change* of $y$ per unit increase in $x$. Positive $a$ means the line rises (growth); negative $a$ means it falls (decay).\n- $b$ is the **y-intercept** of the line — the value of $y$ when $x = 0$, and the point where the graph crosses the $y$-axis (at $(0, b)$).\n\n**When $b = 0$**, the equation simplifies to $y = ax$ — a line that passes through the origin."
  },
  { id: uid(), type: 'heading', order: 11, level: 2, text: 'The geometric truths' },
  { id: uid(), type: 'text', order: 12,
    markdown: "Once you can read $a$ and $b$ from any linear equation (or compute them from two data points using the substitution method), three powerful geometric facts follow:\n\n1. **Linear growth** is a straight line tilting **upward** to the right (positive slope).\n2. **Linear decay** is a straight line tilting **downward** to the right (negative slope).\n3. **Parallel lines** are exactly the lines that share the same slope $a$ but have different y-intercepts $b$. They run forever side-by-side, never meeting.\n\nAnd the deeper fact: **two distinct numbers $a$ and $b$ together describe one and only one straight line.** Any two pieces of information about the line (two points, one point and a slope, etc.) are exactly enough to determine $a$ and $b$ uniquely. *Three or more pieces of information would be redundant — but a useful built-in check.*\n\nThis is the *single algebraic skeleton* underneath the entire chapter."
  },
  { id: uid(), type: 'simulation', order: 13, simulation_id: 'cartesian-plotter',
    title: 'Try It: Pull Together Everything You Have Learnt'
  },
  { id: uid(), type: 'heading', order: 14, level: 2, text: 'A connected map of the chapter' },
  { id: uid(), type: 'text', order: 15,
    markdown: "Here is the journey, in one paragraph:\n\n*A shopkeeper's pen-and-pencil problem teaches us why we use **letters** for unknowns. We learn the vocabulary — terms, coefficients, constants — that lets us name every part of an algebraic expression. From general expressions, we focus on **polynomials in one variable** and classify them by **degree**. The simplest non-trivial case is the **linear polynomial** $ax + b$ — and the rest of the chapter is dedicated to it. We meet **linear patterns** (constant differences) in tile staircases and growth-decay stories. We learn the **standard form** $y = ax + b$ for any linear relationship between two variables, and the meanings of $a$ (rate, slope) and $b$ (starting value, y-intercept). We learn to **find $a$ and $b$ from two data points**, to **plot** any linear equation as a straight line, and to recognise **parallel lines** by their equal slopes. Along the way, we apply this same algebra to bills, fares, savings, temperature scales, and physics relationships. By the end, what began as a question about letters has become a complete tool for describing constant-rate change in the world — a tool you will carry forward into every future chapter on equations, geometry, and beyond.*"
  },
  { id: uid(), type: 'reasoning_prompt', order: 16,
    reasoning_type: 'logical',
    prompt: "If a friend who has just started this chapter asks you for *one* sentence that captures what *every* page was really about, what would you say?",
    options: [
      "Algebra is about solving equations",
      "**Many real-world relationships have a constant rate of change, and whenever they do, the same simple algebraic skeleton — $y = ax + b$ — describes them and lets us predict, plot, and reason about them.**",
      "Mathematics is about numbers",
      "We use letters because variables are flexible"
    ],
    reveal: "Each statement is partially true, but the second captures the chapter most fully. **The whole chapter is the story of one shape — $y = ax + b$ — and how it appears, in slightly different costumes, in dozens of different real-world stories.** Once you can recognise that shape, your knowledge transfers immediately: the techniques that solved a phone-bill problem also solve a temperature conversion, a hexagon matchstick pattern, and a parallel-line geometry puzzle. **One algebraic skeleton, infinitely many lives.** This is the heart of mathematical *generality* — and it is the most lasting gift this chapter has given you.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 17,
    title: 'Self-Audit — Have You Mastered the Chapter?',
    markdown: "Test yourself on each of these. If you cannot answer fluently, revisit the suggested page.\n\n1. **Identify the terms, variables, coefficients, and constant** in $5x + 3y - 8$. *(Page 1.)*\n2. Write the **standard form** of a linear polynomial and explain what each constant means. *(Pages 12, 17.)*\n3. Find $f(4)$ if $f(x) = 3x - 5$. *(Page 5.)*\n4. Find the rule of the linear pattern $9, 14, 19, 24, \\ldots$ *(Pages 7-8.)*\n5. A bill is ₹$120$ for $4$ items and ₹$200$ for $8$ items. Find the per-item charge and the fixed fee. *(Pages 13-14.)*\n6. Plot the line $y = -2x + 5$ and identify its slope and y-intercept. *(Pages 15-16.)*\n7. Are the lines $3y = 9x - 12$ and $y = 3x + 5$ parallel? *(Pages 17, 20.)*\n8. Convert $323$ K to Fahrenheit. *(Page 21.)*\n9. Find a polynomial of degree $2$ in $x$ in which the $x$-coefficient is $-4$. *(Page 22.)*\n10. The linear pattern $7, 12, 17, 22, \\ldots$ — does it ever produce the value $200$? *(Page 23.)*\n\n---\n\n**Answers:**  1. Terms: $5x, 3y, -8$. Variables: $x, y$. Coefficients: $5$ (of $x$), $3$ (of $y$). Constant: $-8$.  2. $y = ax + b$; $a$ is the slope (rate of change), $b$ is the y-intercept (value at $x=0$).  3. $f(4) = 3(4) - 5 = 7$.  4. Constant difference $5$, starting from $9$ at $n=1$: rule is $f(n) = 5n + 4$.  5. $120 = 4a + b$, $200 = 8a + b$. Solve: $a = 20$ (per item), $b = 40$ (fixed fee).  6. Slope $-2$, y-intercept $5$. Plot $(0, 5)$ and $(1, 3)$, draw line.  7. Standard-form the first: $y = 3x - 4$. Both lines have slope $3$. Yes, parallel.  8. $\\tfrac{9}{5}(323 - 273) + 32 = \\tfrac{9}{5}(50) + 32 = 90 + 32 = 122\\degree$F.  9. Many possible: $x^2 - 4x + 1$ or $3x^2 - 4x$ — any degree-$2$ polynomial with $-4$ as the $x$-coefficient.  10. $5n + 2 = 200 \\Rightarrow n = 39.6$. No, $200$ is not a value in this pattern."
  },
  { id: uid(), type: 'inline_quiz', order: 18, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "What is the **degree** of the polynomial $4x^3 - 2x^2 + 7$?",
        options: ["$1$", "$2$", "$3$", "$7$"], correct_index: 2,
        explanation: "The degree is the highest power of $x$ with non-zero coefficient. The highest power here is $x^3$, so the degree is **$3$**.",
        reasoning_level: 1 },
      { id: uid(), question: "In the linear relationship $y = 6x - 11$, what is the **y-intercept**?",
        options: ["$6$", "$-6$", "$11$", "$-11$"], correct_index: 3,
        explanation: "The y-intercept is the value of $y$ when $x = 0$ — i.e., the constant $b$ in $y = ax + b$. Here $b = -11$.",
        reasoning_level: 1 },
      { id: uid(), question: "Two lines are parallel. Which of the following must be true about them?",
        options: [
          "They have the same y-intercept",
          "**They have the same slope**",
          "They cross at the origin",
          "They both pass through the same point"
        ],
        correct_index: 1,
        explanation: "Two lines are parallel exactly when their slopes are equal. The y-intercepts must be *different* (otherwise they would be the same line).",
        reasoning_level: 2 },
      { id: uid(), question: "A linear polynomial $p(x)$ satisfies $p(0) = -2$ and $p(3) = 7$. **What is $p(5)$?**",
        options: ["$10$", "$11$", "$12$", "$13$"], correct_index: 3,
        explanation: "$p(0) = b = -2$. $p(3) = 3a + b = 7 \\Rightarrow 3a = 9 \\Rightarrow a = 3$. So $p(x) = 3x - 2$. Then $p(5) = 15 - 2 = 13$.",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Chapter Summary — Looking Back',
  subtitle: "Twenty-four pages, one algebraic skeleton — every idea of this chapter, in its natural order, on a single page",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['summary', 'review', 'recap', 'self-audit', 'chapter-2-close'],
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
