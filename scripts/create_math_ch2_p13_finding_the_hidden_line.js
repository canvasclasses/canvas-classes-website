'use strict';
// Class 9 Math — Ch 2 — Page 13: "Finding the Hidden Line — From Two Clues to y = ax + b"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'finding-the-hidden-line-from-two-clues';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 13;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic detective scene: a young Indian student sits at a wooden desk with two paper bills in front of her — one for ₹350 and one for ₹550 — connecting them with a chalk line drawn in the air, revealing a glowing equation 'y = ax + b' floating between them.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A young Indian student in a school uniform sits at a wooden desk in a softly-lit study room at evening. On the desk are two crisp paper telecom bills — one with the numbers '10 GB' and '₹350' visible, the other with '20 GB' and '₹550'. The student is leaning forward, holding a piece of yellow chalk in the air, drawing a translucent glowing line connecting the two bills. Above the line, a softly glowing golden equation 'y = ax + b' floats. The mood is curious detective work — uncovering a hidden rule from clues. Painterly cinematic illustration in the style of warm Indian domestic art. Dark wooden desk, warm amber lamp light, deep navy background. No text labels other than the numbers on the two bills and the floating equation."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "A friend tells you: *'My internet bill was ₹350 last month when I used 10 GB. The month before, when I used 20 GB, it was ₹550.'* You believe the bill follows a rule of the form $y = ax + b$, where $x$ is GB and $y$ is rupees. **From just these two numbers, can you find the exact $a$ and $b$?**",
    hint: "You have two pairs of $(x, y)$ values: $(10, 350)$ and $(20, 550)$. Each pair, when substituted into $y = ax + b$, gives you one equation. Two pairs → two equations → two unknowns. That is exactly the right number to solve for $a$ and $b$.",
    reveal: "Two clues are exactly enough. Substituting $(10, 350)$ gives the equation $350 = 10a + b$. Substituting $(20, 550)$ gives $550 = 20a + b$. Two equations, two unknowns — and we will see that solving them gives **$a = 20$ (₹ per GB) and $b = 150$ (the fixed monthly charge)**. So the bill rule is $y = 20x + 150$. **The two facts on this page combine into the entire rule.** Let us walk through the steps in detail."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'बीजगणित — भास्कराचार्य (११५० CE)',
    markdown: "_From Bhāskarāchārya's Bījagaṇita — On Solving for Two Unknowns_\n\n### द्वौ प्रश्नौ द्वे च समीकरणे द्विधा अव्यक्तम् च समाहितम्\n### एकस्यानेन निवृत्तेन शेषस्य च निरूपणम्॥\n\n*(dvau praśnau dve ca samīkaraṇe dvidhā avyaktam ca samāhitam / ekasyānena nivṛttena śeṣasya ca nirūpaṇam)*\n\n---\n\n*'दो प्रश्नों के लिए दो समीकरण होते हैं। एक अनजान को दूर हटाओ — फिर दूसरा अपने आप मिल जाता है।'*\n\n*'For two questions there are two equations. Remove one unknown — and the other reveals itself.'*\n\nThis is exactly the **substitution method** that we are going to use on this page. Bhāskarāchārya knew it nine centuries ago: when you have two unknowns and two equations, *write one unknown in terms of the other from the simpler equation, plug that into the second, and the second equation now has only one letter — which you can solve.* It is one of the oldest reliable techniques in algebra, and it is still the first thing every student learns."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'Why two clues is exactly the right number' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Whenever you are told *'this story follows the rule $y = ax + b$, but I won't tell you $a$ and $b$ directly'*, you are looking at a problem with **two unknowns**: the values of $a$ and $b$.\n\nA single fact — say, *'when $x = 10$, $y = 350$'* — is not enough on its own. Why? Because *infinitely many* lines pass through that one data point. The rule $y = 1 \\cdot x + 340$ fits it. So does $y = 5x + 300$. So does $y = 20x + 150$. With only one clue, we cannot pick the right line out of the crowd.\n\nBut **two clues is exactly enough.** Each clue gives us one equation, and two equations are exactly what we need to solve for two unknowns. Geometrically, two data points pin down one and only one straight-line rule between them. Algebraically, two equations let us eliminate one unknown and isolate the other.\n\n**The plan on this page is therefore very clean:**\n\n1. Substitute the first $(x, y)$ pair into $y = ax + b$ to get equation $\\#1$.\n2. Substitute the second $(x, y)$ pair into $y = ax + b$ to get equation $\\#2$.\n3. From equation $\\#1$, write $b$ in terms of $a$.\n4. Substitute that into equation $\\#2$. Now there is only one letter — solve for $a$.\n5. Plug $a$ back into equation $\\#1$ to find $b$.\n6. Write the final rule $y = ax + b$ using the values you found.\n\nDo this once and you will do it forever the same way. Let us watch it happen on the NCERT example."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'linear-pattern-explorer',
    title: 'Try It: Two Data Points Lock in One Linear Rule'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'NCERT Example 11 — The internet bill', variant: 'ncert_intext',
    problem: "A telecom company charges a fixed monthly fee plus an additional cost per GB of internet data used. A student observes that when she used **10 GB**, her bill was **₹350**. When she used **20 GB**, her bill was **₹550**. If the monthly bill $y$ depends on the data used $x$ (in GB) according to the relation $y = ax + b$, **find the values of $a$ and $b$**.",
    solution: "**Step 1 — Turn each fact into an equation.**\n\nSubstitute the first data point $(x, y) = (10, 350)$ into $y = ax + b$:\n\n$$350 = 10a + b \\qquad \\text{(equation 1)}$$\n\nSubstitute the second data point $(x, y) = (20, 550)$:\n\n$$550 = 20a + b \\qquad \\text{(equation 2)}$$\n\n**Step 2 — Make one unknown stand alone.** From equation $1$, isolate $b$:\n\n$$b = 350 - 10a$$\n\n**Step 3 — Substitute into the other equation.** Replace $b$ in equation $2$ with $350 - 10a$:\n\n$$550 = 20a + (350 - 10a)$$\n\nSimplify the right side: $20a - 10a = 10a$, so $550 = 10a + 350$.\n\n**Step 4 — Solve for $a$.** Subtract $350$ from both sides:\n\n$$10a = 200 \\quad \\Longrightarrow \\quad a = 20$$\n\n**Step 5 — Find $b$ using $b = 350 - 10a$.**\n\n$$b = 350 - 10(20) = 350 - 200 = 150$$\n\n**Step 6 — Write the final rule.**\n\n$$\\boxed{\\,y = 20x + 150\\,}$$\n\n**Step 7 — Always check both data points.**\n\n- At $x = 10$: $y = 20(10) + 150 = 350$ ✓\n- At $x = 20$: $y = 20(20) + 150 = 550$ ✓\n\nBoth match the original observations. The rule is correct."
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 7,
    title: 'Think and Reflect — what do $20$ and $150$ actually mean?',
    markdown: "We just found that the bill follows $y = 20x + 150$. Two numbers fell out of the algebra. **What do they mean in the real world?**\n\nUse what we learnt on the previous page about $a$ and $b$:\n\n- **$a = 20$ (₹ per GB).** This is the rate of change. For every extra $1$ GB of data you use, the bill rises by $₹20$. So the company's *per-GB charge is $₹20$.*\n- **$b = 150$ (₹).** This is the value of $y$ when $x = 0$. If you use *zero* GB of data in a month, the bill is still $₹150$. So $₹150$ is the **fixed monthly fee** — the amount you pay just to *keep the connection alive*, before any data is used.\n\n**Plain-English meaning of the rule:** *the company charges a flat ₹150 per month, plus ₹20 for every GB of data used.* That single sentence is the entire bill structure, and you discovered it from just two months of bills. **This is the real power of the two-equation method — it turns a few observations into a complete pricing rule.**"
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'Worked Example 2 — Auto fare from two trips', variant: 'solved_example',
    problem: "An auto-rickshaw driver charges a base fare plus a fixed amount per kilometre. A $4$-km trip cost ₹$110$. A $9$-km trip cost ₹$185$. Assuming the fare is given by $y = ax + b$, **find $a$ and $b$, and then find the fare for an $11$-km trip.**",
    solution: "**Step 1 — Two equations from the two trips.**\n\nSubstituting $(4, 110)$: $\\,110 = 4a + b \\quad (1)$\n\nSubstituting $(9, 185)$: $\\,185 = 9a + b \\quad (2)$\n\n**Step 2 — From equation $1$:** $b = 110 - 4a$.\n\n**Step 3 — Substitute into equation $2$:**\n\n$$185 = 9a + (110 - 4a) = 5a + 110$$\n\n**Step 4 — Solve for $a$.** Subtract $110$: $5a = 75$. Divide by $5$: $a = 15$.\n\n**Step 5 — Find $b$.** $b = 110 - 4(15) = 110 - 60 = 50$.\n\n**Step 6 — The rule.** $y = 15x + 50$.\n\n**Step 7 — Check.** $4$-km: $15(4) + 50 = 110$ ✓. $9$-km: $15(9) + 50 = 185$ ✓.\n\n**Step 8 — Use the rule for $x = 11$.** $y = 15(11) + 50 = 165 + 50 = ₹215$.\n\n**Answer:** Per-km charge $a = ₹15$, base fare $b = ₹50$. An $11$-km trip would cost **₹215.**"
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 3 — Tutoring fee from two months', variant: 'solved_example',
    problem: "A maths tutor charges a fixed registration fee plus a per-class fee. After attending **6 classes**, Anita has paid ₹$1{,}450$ in total. After attending **10 classes**, the total she has paid is ₹$2{,}050$. **Find the registration fee and the per-class fee.**",
    solution: "**Setup.** Let $y = ax + b$ where $x$ is the number of classes attended and $y$ is the total paid.\n\n**Two equations.**\n\n$1450 = 6a + b \\quad (1)$\n\n$2050 = 10a + b \\quad (2)$\n\n**Substitute.** From $(1)$, $b = 1450 - 6a$. Plug into $(2)$:\n\n$$2050 = 10a + 1450 - 6a = 4a + 1450$$\n\n**Solve for $a$.** $4a = 600 \\Rightarrow a = 150$. So the per-class fee is **₹150**.\n\n**Find $b$.** $b = 1450 - 6(150) = 1450 - 900 = 550$. So the registration fee is **₹550**.\n\n**Check.** $6$ classes: $150(6) + 550 = 1450$ ✓. $10$ classes: $150(10) + 550 = 2050$ ✓.\n\n**Plain meaning:** Anita paid ₹$550$ once (registration), plus ₹$150$ for every class attended. **The two-equation method turned two payment receipts into the tutor's full pricing model.**"
  },
  { id: uid(), type: 'reasoning_prompt', order: 10,
    reasoning_type: 'logical',
    prompt: "Imagine you are given two data points where **the $x$-values are equal** — say $(5, 12)$ and $(5, 30)$. Can you find a linear rule $y = ax + b$ that passes through both?",
    options: [
      "Yes, you can always find one",
      "Yes — you just take the average of the two $y$-values",
      "**No** — the two data points are *inconsistent*. A single $x$-value cannot have two different $y$-values under a function rule. So either the data was measured incorrectly, or the relationship is not a function of $x$ at all.",
      "Yes, but you need a third point as well"
    ],
    reveal: "A linear rule $y = ax + b$ is a *function of $x$* — feed in any $x$, and the rule outputs **one** specific $y$. So $x = 5$ cannot produce both $y = 12$ and $y = 30$. The two data points contradict each other. If you tried to substitute and solve, you would get $12 = 5a + b$ and $30 = 5a + b$, which would force $12 = 30$ — a clear absurdity. **Lesson:** the two-equation method only works when the two data points have *different* $x$-values. If you ever see a question where the $x$-values are equal but the $y$-values differ, the data is either wrong or the relationship cannot be linear.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 11,
    title: 'Practice Yourself — Find $a$ and $b$ from Two Data Points',
    markdown: "For each of the stories below, set up two equations, solve for $a$ and $b$, and write the rule $y = ax + b$. Then answer the follow-up question.\n\n1. **Coaching fees:** $4$ months cost ₹$8{,}000$, $7$ months cost ₹$13{,}250$. (Find the rule. What is the registration fee?)\n2. **Cake bakery:** A $1$-kg cake costs ₹$650$, a $3$-kg cake costs ₹$1{,}450$. (Find the rule. What is the rate per kg?)\n3. **Mobile data plan:** $5$ GB → ₹$300$, $12$ GB → ₹$510$. (What is the per-GB charge and the fixed monthly fee?)\n4. **Hostel charge:** $3$ days cost ₹$1{,}200$, $8$ days cost ₹$2{,}700$. (Find the rule. What is the per-day charge?)\n5. **Bus fare:** $5$-km ride costs ₹$60$, $11$-km ride costs ₹$120$. (Find the rule. What is the base fare?)\n\n---\n\n**Answers:**  1. Equations: $8000 = 4a + b$ and $13250 = 7a + b$. Solving: $a = 1750$, $b = 1000$. Rule: $y = 1750x + 1000$. Registration fee = ₹$1{,}000$.  2. Equations: $650 = a + b$ and $1450 = 3a + b$. Solving: $a = 400$, $b = 250$. Rule: $y = 400x + 250$. Rate per kg = ₹$400$.  3. Equations: $300 = 5a + b$ and $510 = 12a + b$. Solving: $a = 30$, $b = 150$. Rule: $y = 30x + 150$. Per-GB charge = ₹$30$, fixed fee = ₹$150$.  4. Equations: $1200 = 3a + b$ and $2700 = 8a + b$. Solving: $a = 300$, $b = 300$. Rule: $y = 300x + 300$. Per-day charge = ₹$300$.  5. Equations: $60 = 5a + b$ and $120 = 11a + b$. Solving: $a = 10$, $b = 10$. Rule: $y = 10x + 10$. Base fare = ₹$10$."
  },
  { id: uid(), type: 'inline_quiz', order: 12, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "If a linear rule $y = ax + b$ passes through $(2, 11)$ and $(5, 23)$, what is the value of $a$?",
        options: ["$3$", "$4$", "$6$", "$11$"], correct_index: 1,
        explanation: "Two equations: $11 = 2a + b$ and $23 = 5a + b$. Subtract the first from the second: $23 - 11 = (5a + b) - (2a + b)$, i.e. $12 = 3a$, so $a = 4$. (A nice shortcut: when both equations have a $b$, subtracting them removes $b$ instantly.)",
        reasoning_level: 2 },
      { id: uid(), question: "A tutor charges $y = ax + b$ rupees for $x$ classes. If $4$ classes cost ₹$1{,}300$ and $7$ classes cost ₹$2{,}050$, **what is the registration fee $b$?**",
        options: ["₹150", "₹250", "₹500", "₹600"], correct_index: 2,
        explanation: "Two equations: $1300 = 4a + b$ and $2050 = 7a + b$. Subtract: $750 = 3a \\Rightarrow a = 250$. Then $b = 1300 - 4(250) = 1300 - 1000 = ₹500$. So the registration fee is **₹500**.",
        reasoning_level: 2 },
      { id: uid(), question: "An internet plan follows $y = ax + b$, where $x$ is GB and $y$ is rupees. The two known points are $(8\\text{ GB}, ₹400)$ and $(15\\text{ GB}, ₹575)$. **What is the per-GB charge?**",
        options: ["₹15 per GB", "₹20 per GB", "₹25 per GB", "₹30 per GB"], correct_index: 2,
        explanation: "Equations: $400 = 8a + b$ and $575 = 15a + b$. Subtract: $175 = 7a \\Rightarrow a = 25$. The per-GB charge is **₹25**. (And the fixed fee, if you want it: $b = 400 - 8(25) = ₹200$.)",
        reasoning_level: 2 },
      { id: uid(), question: "Suppose someone tells you a rule is linear and passes through $(3, 10)$ — but gives you no second data point. **Why can't you find a unique $a$ and $b$?**",
        options: [
          "Because $a$ and $b$ are always equal",
          "**Because infinitely many linear rules can pass through a single data point — you have one equation $10 = 3a + b$, but two unknowns. One equation cannot pin down two unknowns; you need at least two data points to lock in both $a$ and $b$.**",
          "Because $b$ can never be zero",
          "Because the value $10$ is too small"
        ],
        correct_index: 1,
        explanation: "One equation in two unknowns has infinitely many solutions: $a = 1, b = 7$ works ($10 = 3 + 7$); so does $a = 2, b = 4$; so does $a = 3, b = 1$; and on and on. Only when you have a *second* equation (from a second data point) do these infinitely many possibilities collapse to one. **The number of equations must match the number of unknowns** — that is the heart of why exactly two data points are needed for a linear rule.",
        reasoning_level: 4 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Finding the Hidden Line: From Two Clues to $y = ax + b$',
  subtitle: "When two data points are all you have, two equations are exactly enough — the substitution method, step by step",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-relationship', 'substitution-method', 'two-equations-two-unknowns', 'NCERT-Example-11', 'practice'],
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
