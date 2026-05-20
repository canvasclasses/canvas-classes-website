'use strict';
// Class 9 Math — Ch 2 — Page 1: "Why We Use Letters: Algebraic Expressions"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'why-we-use-letters-algebraic-expressions';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 1;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A bustling Indian neighbourhood stationery shop counter at sunset, with colourful sealed boxes of pens and pencils stacked behind the counter and a young customer reaching out for one',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). The interior of a small Indian neighbourhood stationery shop at warm sunset, viewed from across the wooden counter. Behind the counter are colourful stacked sealed boxes — bright red boxes of pens and deep blue boxes of pencils — neatly arranged on wooden shelves. A young schoolboy in uniform reaches across the counter, his hand resting on a single red box. The scene conveys: every shopkeeper does algebra without writing a single equation. Painterly cinematic illustration in the style of warm Indian domestic art. Dark background. No text, no labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "A shopkeeper says: *'Every red box has 4 pens, every blue box has 5 pencils.'* You buy *some* red boxes and *some* blue ones. **How would you write down a single rule for the total — without knowing how many of each you bought yet?**",
    hint: "What if you used *one letter* for 'how many red boxes' and *another letter* for 'how many blue ones'?",
    reveal: "If $x$ stands for the number of red boxes and $y$ for blue ones, then the total is $4x + 5y$. The two letters let you write **one rule** that works for *every* combination — 1 red + 2 blue, 5 red + 7 blue, anything. This is the entire idea of algebra: *letters stand for numbers we don't know yet.*"
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'लीलावती — भास्कराचार्य',
    markdown: "_From Bhāskarāchārya's Lilāvatī (1150 CE) — On Practical Trade Problems_\n\n### क्रयविक्रयलाभार्थं संख्यया गणितं विना\n### व्यापारः मूकवत् भवेत् कथं तत्र विचारणा॥\n\n*(krayavikraya-lābhārthaṃ saṃkhyayā gaṇitaṃ vinā / vyāpāraḥ mūkavat bhavet kathaṃ tatra vicāraṇā)*\n\n---\n\n*'खरीद-बिक्री और फायदे की बातें — अगर गणित न हो तो व्यापार गूँगा हो जाए। फिर हिसाब कैसे होगा?'*\n\n*'For matters of buying, selling and profit — without numerical reasoning, trade would be mute. How then would calculation happen?'*\n\nBhāskara II's *Lilāvatī* — written for his daughter — is full of trade puzzles like Raju's pen-and-pencil problem. The book taught Indian merchants algebra through everyday situations: pearls in a necklace, fruits in a basket, monkeys on a tree. **Algebra was always meant to be practical. The letters stand for the numbers your shopkeeper hasn't told you yet.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: "Raju's shop and the magic of letters" },
  { id: uid(), type: 'text', order: 4,
    markdown: "**Raju goes to a stationery shop.** The shopkeeper tells him:\n\n- Every **red** box has **4 pens** inside.\n- Every **blue** box has **5 pencils** inside.\n\nRaju decides to buy some boxes — but how many of each? Let's not commit yet. We'll just *call* his choices by letters:\n\n- $x$ = the number of red boxes Raju picks\n- $y$ = the number of blue boxes Raju picks\n\nNow we can compute the total:\n\n- $x$ red boxes hold $4 \\times x = 4x$ pens.\n- $y$ blue boxes hold $5 \\times y = 5y$ pencils.\n- The shopkeeper also gives **3 free pens** as a bonus.\n\nAdd them up:\n\n$$\\text{Total items} = 4x + 5y + 3$$\n\nNotice what just happened. **The same single expression works for every choice Raju could make.** If he buys 2 red and 3 blue, total = $4(2) + 5(3) + 3 = 26$. If he buys 5 red and 1 blue, total = $4(5) + 5(1) + 3 = 28$. The expression $4x + 5y + 3$ doesn't depend on the *specific* numbers — it captures *every possible* answer.\n\nThis power — to write one rule that handles infinitely many cases — is the entire point of algebra."
  },
  { id: uid(), type: 'image', order: 5, src: '', width: 'full',
    caption: '📸 Fig. 2.1 — Sealed boxes Raju sees in the shop. Red = pens, blue = pencils.',
    alt: "A close-up of two stacked sealed boxes side by side: the left is a tall red box labelled 'PENS' with several black-and-blue pens visible at the top; the right is a smaller blue box labelled 'Pencils' with sharpened yellow pencils sticking out.",
    generation_prompt: "Close-up product illustration of two sealed cardboard boxes standing side by side on a wooden surface. The left box is bright red, taller, with the word 'PENS' printed on a white horizontal label in the middle, and several black, blue, and grey pens sticking out from the open top. The right box is deep blue, slightly shorter, with 'Pencils' printed on two white labels, and sharpened yellow pencils with pink erasers sticking out. The boxes are drawn in the warm, hand-painted illustrative style of an Indian children's textbook. Dark background, orange accent labels, clean technical illustration style."
  },
  { id: uid(), type: 'heading', order: 6, level: 2, text: 'The four parts of an algebraic expression' },
  { id: uid(), type: 'text', order: 7,
    markdown: "Look at the expression $4x + 5y + 3$ again. Let's name each piece carefully — these names will come up in every chapter from now on:\n\n- **Terms** are the parts separated by $+$ or $-$. In $4x + 5y + 3$, the three terms are **$4x$, $5y$, and $3$**.\n- **Variables** (sometimes called *letter-numbers*) are the letters that can change. Here the variables are **$x$ and $y$**.\n- **Coefficients** are the numbers multiplying a variable. In $4x$, the coefficient is **$4$**; in $5y$, the coefficient is **$5$**.\n- A **constant** is a stand-alone number with no variable attached. In $4x + 5y + 3$, the constant is **$3$** — the free pens that Raju got regardless of how many boxes he bought.\n\n**Quick mental check.** Coefficient ≠ term. *Coefficient* is just the number; *term* is the whole piece including the variable. So in $4x$, the coefficient is $4$, but the term is $4x$. And neither is the same as the *variable* $x$ alone. These three are different objects — get the names right and the rest of the chapter is easy."
  },
  { id: uid(), type: 'simulation', order: 8, simulation_id: 'expression-builder',
    title: "Try It: Build & Label an Expression"
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 1', variant: 'solved_example',
    problem: "For the expression $-7p + 2$, identify: (a) the terms, (b) the variable, (c) the coefficient of $p$, (d) the constant.",
    solution: "**Step 1 — Spot the terms.** Terms are separated by $+$ or $-$. The expression has **two terms: $-7p$ and $2$**.\n\n**Step 2 — Spot the variable.** The only letter is $p$, so the **variable is $p$**.\n\n**Step 3 — Coefficient of $p$.** The number multiplying $p$ in the term $-7p$ is **$-7$**. (Not $7$ — the sign belongs with the coefficient.)\n\n**Step 4 — Constant.** The stand-alone number is **$2$**.\n\n**Answer:** terms $\\{-7p, 2\\}$; variable $p$; coefficient of $p$ is $-7$; constant $2$."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 2', variant: 'solved_example',
    problem: "For the expression $3a + 5b - 8$, identify: (a) the number of terms, (b) the variables, (c) the coefficient of $b$, (d) the constant.",
    solution: "**(a)** Three terms: $3a$, $5b$, $-8$.\n\n**(b)** Two variables: $a$ and $b$.\n\n**(c)** Coefficient of $b$: $5$.\n\n**(d)** Constant: $-8$. (The $-$ belongs with the constant.)"
  },
  { id: uid(), type: 'worked_example', order: 11,
    label: 'Worked Example 3', variant: 'solved_example',
    problem: "For the expression $\\frac{1}{2}m + 9$, identify: (a) the variable, (b) the coefficient of $m$, (c) the constant.",
    solution: "**(a)** Variable: $m$.\n\n**(b)** Coefficient of $m$: $\\frac{1}{2}$. **Coefficients can be fractions, not just whole numbers.**\n\n**(c)** Constant: $9$."
  },
  { id: uid(), type: 'worked_example', order: 12,
    label: 'Worked Example 4', variant: 'solved_example',
    problem: "Evaluate the expression $4x + 5y + 3$ if Raju buys **2 red boxes and 3 blue boxes**.",
    solution: "**Step 1 — Substitute the values.**\n\nWith $x = 2$ and $y = 3$:\n\n$$4x + 5y + 3 = 4(2) + 5(3) + 3$$\n\n**Step 2 — Simplify, one term at a time.**\n\n$$= 8 + 15 + 3 = 26$$\n\n**Answer:** Raju walks home with **26 items** total — 8 pens from the red boxes, 15 pencils from the blue boxes, and 3 free pens."
  },
  { id: uid(), type: 'reasoning_prompt', order: 13,
    reasoning_type: 'logical',
    prompt: "What is the difference between the expressions $4x$ and $4 + x$? Both contain a $4$ and an $x$ — are they the same?",
    options: [
      "Yes — they're the same, since both contain a 4 and an x",
      "No — $4x$ means **4 multiplied by x** (a single term, with 4 as the coefficient and x as the variable), while $4 + x$ means **4 added to x** (two separate terms, with 4 as the constant and x as a separate variable term). They take very different values for almost every x.",
      "$4x$ is a sum and $4 + x$ is a product",
      "They are the same only when x = 0"
    ],
    reveal: "$4x$ and $4 + x$ are completely different expressions. **Try $x = 5$:** $4x = 20$ but $4 + x = 9$. They only happen to agree when $4x = 4 + x$, i.e. $3x = 4$, i.e. $x = 4/3$ — exactly *one* value out of infinitely many. The lesson: **algebraic notation is precise**. The placement of an operation symbol changes everything. Coefficient (a number stuck to a variable by multiplication) ≠ constant (a number standing alone, added or subtracted).",
    difficulty_level: 2
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 14,
    title: 'Practice Yourself — Spot the Parts',
    markdown: "For each expression, list the **terms**, **variable(s)**, **coefficients**, and **constant** (if any). Cover the answers and check.\n\n1. $7x + 11$\n2. $-2y - 6$\n3. $5a + 3b - 9$\n4. $\\frac{2}{3}p$\n5. $12$\n6. $-x + 1$\n7. $0.5t - 4.2$\n8. $3m + 2n + 7$\n\n---\n\n**Answers:**  1. terms $\\{7x, 11\\}$, var $x$, coeff $7$, const $11$.  2. terms $\\{-2y, -6\\}$, var $y$, coeff $-2$, const $-6$.  3. terms $\\{5a, 3b, -9\\}$, vars $\\{a, b\\}$, coeffs $\\{5, 3\\}$, const $-9$.  4. one term $\\frac{2}{3}p$, var $p$, coeff $\\frac{2}{3}$, no constant (or constant $= 0$).  5. one term $12$, no variable, the whole thing is a constant $12$.  6. terms $\\{-x, 1\\}$, var $x$, coeff $-1$ (the unwritten 1!), const $1$.  7. terms $\\{0.5t, -4.2\\}$, var $t$, coeff $0.5$, const $-4.2$.  8. terms $\\{3m, 2n, 7\\}$, vars $\\{m, n\\}$, coeffs $\\{3, 2\\}$, const $7$."
  },
  { id: uid(), type: 'inline_quiz', order: 15, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "In the expression $6y - 8$, what is the **coefficient of $y$**?",
        options: ["6", "−6", "8", "−8"], correct_index: 0,
        explanation: "The coefficient is the number multiplying the variable. In $6y$, the number multiplying $y$ is **6**. (The $-8$ is a separate term — that's the constant.)",
        reasoning_level: 1 },
      { id: uid(), question: "An expression has the terms $4x$, $-3y$, and $7$. What is the **constant**?",
        options: ["4", "−3", "7", "There is no constant"], correct_index: 2,
        explanation: "A constant is a term with **no variable** attached. Of $4x$, $-3y$, $7$, only **$7$** has no variable, so the constant is $7$.",
        reasoning_level: 1 },
      { id: uid(), question: "Which of the following is the **coefficient of $x$** in the expression $-x + 5$?",
        options: ["1", "−1", "5", "−5"], correct_index: 1,
        explanation: "The term $-x$ is shorthand for $-1 \\cdot x$. The coefficient is **$-1$** (not just 1, and not 5 — that's the constant). When you see a variable with no number written, an invisible $1$ (or $-1$ if there's a minus sign) is multiplying it.",
        reasoning_level: 2 },
      { id: uid(), question: "Raju picks $x$ red boxes ($4$ pens each) and $y$ blue boxes ($5$ pencils each), and gets $3$ free pens. If he buys **3 red and 4 blue boxes**, how many items in total?",
        options: ["12", "20", "32", "35"], correct_index: 3,
        explanation: "Use the expression $4x + 5y + 3$ with $x = 3$, $y = 4$: $4(3) + 5(4) + 3 = 12 + 20 + 3 = 35$. (Try the simulation above with these slider values to see it live.)",
        reasoning_level: 2 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Why We Use Letters: Algebraic Expressions',
  subtitle: 'How a single line of algebra can describe every possible trip to the stationery shop',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['algebra', 'expressions', 'terms', 'variables', 'coefficients', 'constants'],
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
