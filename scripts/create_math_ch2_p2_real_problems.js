'use strict';
// Class 9 Math — Ch 2 — Page 2: "Building Expressions from Real Problems"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'building-expressions-from-real-problems';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 2;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic view of an Indian rural garden with a wooden picket fence on its long sides and a wire fence on its short sides; rows of vegetables and flowers stretch into a soft golden distance',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A peaceful Indian rural garden at golden hour, viewed from a low angle. The garden is rectangular, with a tall wooden picket fence running along the two long sides and a thinner wire fence on the two short sides. Inside, neat rows of vegetables and yellow marigolds stretch into the soft golden distance. A small white farmhouse and a few trees sit in the background. The atmosphere conveys: every fence, every plot, every measurement is secretly an algebraic expression. Painterly cinematic illustration in the style of warm rural Indian art. Dark background. No text, no labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "A wire of length **20 cm** is bent into a rectangle. Different bends give different rectangles — long-and-thin, almost-square, etc. **Can you write a single expression that gives the area of *any* such rectangle, depending on how you bend the wire?**",
    hint: "If you call the length $x$, the width is forced — the four sides must add up to 20.",
    reveal: "If the length is $x$, then length + width + length + width = 20, so width = $10 - x$. The area is $x \\cdot (10 - x) = 10x - x^2$. This **single expression** captures every possible rectangle the wire can make — from the long-and-thin shapes near $x = 1$ to the perfect square at $x = 5$. **One expression, infinitely many rectangles.**"
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'गणितसारसङ्ग्रह — महावीर (९वीं शताब्दी)',
    markdown: "_From Mahāvīra's Gaṇita-sāra-saṅgraha (c. 850 CE) — On Practical Calculation_\n\n### क्षेत्रस्य परिमाणं वा मूल्यं वा निश्चयेन ज्ञेयम्\n### अक्षरैरेव संख्यया च — एतद् गणितस्य सार्थकता॥\n\n*(kṣetrasya parimāṇaṃ vā mūlyaṃ vā niścayena jñeyam / akṣarair eva saṃkhyayā ca — etad gaṇitasya sārthakatā)*\n\n---\n\n*'किसी ज़मीन का नाप हो या कीमत — दोनों को अक्षरों और संख्याओं से ठीक-ठीक जाना जा सकता है। यही गणित का मतलब है।'*\n\n*'Whether it is the measurement of land or its price — both can be known precisely through letters and numbers. This is the meaning of mathematics.'*\n\nMahāvīra, a Jain mathematician, wrote the *Gaṇita-sāra-saṅgraha* — one of the great Indian medieval algebra texts. He showed how everyday land-measurement, fencing, and pricing problems all become a few lines of algebra. The garden problem on this page is exactly the kind of thing his students worked through 1,200 years ago."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'A garden of length $l$ and width $w$' },
  { id: uid(), type: 'text', order: 4,
    markdown: "**A rectangular garden** of length $l$ metres and width $w$ metres needs three things:\n\n1. A **wire fence** along the two **length** sides — costs ₹100 per metre.\n2. A **wooden fence** along the two **width** sides — costs ₹80 per metre.\n3. **Special seeds** to be sown throughout the garden — costs ₹50 per square metre of area.\n\nLet's compute the total cost step by step:\n\n- Length of wire fencing needed = $2l$ metres. Cost = $2l \\times 100 = ₹200l$.\n- Length of wooden fencing needed = $2w$ metres. Cost = $2w \\times 80 = ₹160w$.\n- Area to be sown = $l \\times w$ square metres. Seed cost = $50 \\times l \\times w = ₹50lw$.\n\nAdding them up:\n\n$$\\text{Total cost} = 200l + 160w + 50lw$$\n\nThis expression has **three terms**: $200l$, $160w$, and $50lw$. **Two variables**: $l$ and $w$. **No constant** (because every bit of the cost depends on the size of the garden).\n\n*Notice the term $50lw$ — it has *both* variables multiplied together. We'll meet such terms again when you formally study quadratic and higher-degree polynomials in later chapters.*"
  },
  { id: uid(), type: 'image', order: 5, src: '', width: 'full',
    caption: '📸 Fig. 2.2 — A rectangular garden of length $l$ and width $w$, with both fences and seeds visible.',
    alt: "A painted top-and-side view of a rectangular vegetable garden with a wooden picket fence on its long sides and a wire fence on its short sides. Length labelled 'l metres' along the long sides; width labelled 'w metres' along the short sides. Inside the garden are rows of marigolds and small huts in the background suggesting an Indian rural setting.",
    generation_prompt: "Painted illustration of a rectangular vegetable garden viewed slightly from above. Two long sides have a tall wooden picket fence; two short sides have a thinner wire mesh fence. Length of long sides labelled 'l metres' twice (once on each long side, with a thin red double-headed arrow); width of short sides labelled 'w metres' twice. Inside the garden: neat rows of yellow marigolds and small green vegetable plants. Background shows a small white farmhouse and trees, soft blue sky with white clouds. Style: warm hand-painted Indian textbook illustration. Dark background, orange accent labels, clean technical illustration style."
  },
  { id: uid(), type: 'simulation', order: 6, simulation_id: 'wire-rectangle-explorer',
    title: 'Try It: Bend a 20-cm Wire into Different Rectangles'
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'Worked Example 1', variant: 'solved_example',
    problem: "For the cost expression $200l + 160w + 50lw$, identify: (a) the number of terms, (b) the variables, (c) the coefficient of $lw$, (d) is there a constant?",
    solution: "**(a)** Three terms: $200l$, $160w$, $50lw$.\n\n**(b)** Two variables: $l$ and $w$.\n\n**(c)** Coefficient of $lw$: $50$.\n\n**(d)** No constant. Every term contains at least one variable — the cost is zero when the garden is zero-sized.\n\n**Compare with Page 1's expression $4x + 5y + 3$:** that one *had* a constant ($3$, the free pens). The garden expression doesn't, because no part of the cost is *independent* of the garden's dimensions."
  },
  { id: uid(), type: 'heading', order: 8, level: 2, text: "From two variables to one — bending a wire" },
  { id: uid(), type: 'text', order: 9,
    markdown: "Now consider a different problem.\n\n**A wire of length 20 cm** is bent into a rectangle. The wire goes around the rectangle's perimeter, so:\n\n$$2 \\cdot \\text{length} + 2 \\cdot \\text{width} = 20$$\n\nDividing by 2: length + width = $10$. So if the length is $x$ cm, the width must be $(10 - x)$ cm. The area is:\n\n$$\\text{Area} = x \\cdot (10 - x) = 10x - x^2 \\text{ sq cm}$$\n\nNotice what just changed: this expression has **only one variable**, $x$. The garden expression had two ($l$ and $w$). The shop expression on Page 1 had two ($x$ and $y$). **This one has one.**\n\nSingle-variable expressions are special enough to deserve their own name. We'll meet that name on the next page: *polynomials*."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 2', variant: 'solved_example',
    problem: "For the area expression $10x - x^2$, identify: (a) the number of terms, (b) the variable, (c) the coefficient of $x$, (d) the coefficient of $x^2$.",
    solution: "**(a)** Two terms: $10x$ and $-x^2$.\n\n**(b)** Variable: $x$.\n\n**(c)** Coefficient of $x$: $10$ (from the term $10x$).\n\n**(d)** Coefficient of $x^2$: $-1$ (from the term $-x^2 = -1 \\cdot x^2$). **Don't miss the negative sign or the implicit 1.**\n\n*Compare:* the shop expression $4x + 5y + 3$ from Page 1 used **two variables** ($x, y$). The area expression here uses **one variable** ($x$) — this is the key feature that makes it a *polynomial in one variable*."
  },
  { id: uid(), type: 'worked_example', order: 11,
    label: 'Worked Example 3', variant: 'solved_example',
    problem: "Use $\\text{Area} = 10x - x^2$ to find the area of the rectangle when the length is $x = 3$ cm. Then find the area when $x = 7$ cm. What do you notice?",
    solution: "**Step 1 — Substitute $x = 3$.**\n\n$$10(3) - (3)^2 = 30 - 9 = 21 \\text{ sq cm}$$\n\nThe rectangle is 3 cm × 7 cm — area 21 sq cm. ✓\n\n**Step 2 — Substitute $x = 7$.**\n\n$$10(7) - (7)^2 = 70 - 49 = 21 \\text{ sq cm}$$\n\nThe rectangle is 7 cm × 3 cm — area 21 sq cm. ✓\n\n**What do you notice?** Both choices of $x$ give the *same* area! Why? Because the rectangles 3×7 and 7×3 are the *same* rectangle — just rotated 90°. The expression $10x - x^2$ is **symmetric** around $x = 5$: as $x$ moves from 5, the area drops the same amount whether you go up or down."
  },
  { id: uid(), type: 'worked_example', order: 12,
    label: 'Worked Example 4', variant: 'solved_example',
    problem: "Write an algebraic expression for the **total cost** of an auto-rickshaw ride: a base fare of ₹40 plus ₹15 per kilometre. Then evaluate the cost for a 7 km ride.",
    solution: "**Step 1 — Define the variable.**\n\nLet $d$ = distance travelled in kilometres.\n\n**Step 2 — Write the expression.**\n\nBase fare is constant: ₹40. Per-km cost adds $15d$. So:\n\n$$\\text{Cost} = 15d + 40$$\n\nThis is a **one-variable** expression (only $d$). The coefficient of $d$ is $15$. The constant is $40$.\n\n**Step 3 — Evaluate at $d = 7$.**\n\n$$15(7) + 40 = 105 + 40 = ₹145$$\n\n**Answer:** Cost = $15d + 40$. For 7 km, the fare is ₹145."
  },
  { id: uid(), type: 'reasoning_prompt', order: 13,
    reasoning_type: 'logical',
    prompt: "Compare three expressions: (A) $4x + 5y + 3$ from the shop, (B) $200l + 160w + 50lw$ from the garden, (C) $10x - x^2$ from the bent wire. **Which one is fundamentally different from the other two, and why?**",
    options: [
      "(A) is different — it's the only one with a constant term",
      "(B) is different — it's the only one with three terms",
      "(C) is different — it's the only one with **only one variable**, which makes it a *polynomial in one variable*; the other two have two variables each",
      "All three are essentially the same"
    ],
    reveal: "(C) is the odd one out. Both (A) and (B) involve **two** unknowns each ($x$ and $y$; $l$ and $w$), but (C) involves only $x$. This single-variable property is so important it earns its own name: a **polynomial in one variable**. Almost the entire rest of this chapter studies these — and especially the simplest non-trivial case, the *linear* polynomial. So (C) is the bridge into the central topic of the chapter.",
    difficulty_level: 2
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 14,
    title: 'Practice Yourself — Translate the Story into Algebra',
    markdown: "For each scenario, write an algebraic expression. Cover the answers and try.\n\n1. A taxi charges ₹50 base fare plus ₹12 per km. Distance = $d$ km.\n2. A mobile data plan: ₹200 fixed + ₹2 per MB used. MB used = $m$.\n3. A rectangular room of length $l$ m and width $w$ m needs paint costing ₹15 per square metre.\n4. A piggy bank has $x$ ₹2 coins and $y$ ₹5 coins. What is the total amount in rupees?\n5. A train moves at 80 km/h for $t$ hours. Distance covered (km)?\n6. A pen costs ₹15. You buy $p$ pens and pay ₹100, getting some change back. Express the change.\n7. A square has side length $s$ cm. Express its perimeter.\n8. A square has side length $s$ cm. Express its area. *(Is this a polynomial in one variable?)*\n\n---\n\n**Answers:** 1. $12d + 50$ &nbsp;·&nbsp; 2. $2m + 200$ &nbsp;·&nbsp; 3. $15lw$ &nbsp;·&nbsp; 4. $2x + 5y$ &nbsp;·&nbsp; 5. $80t$ &nbsp;·&nbsp; 6. $100 - 15p$ &nbsp;·&nbsp; 7. $4s$ &nbsp;·&nbsp; 8. $s^2$ — yes, a polynomial in *one* variable, but **not linear** (it has $s^2$, so it's quadratic)."
  },
  { id: uid(), type: 'inline_quiz', order: 15, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "How many **variables** does the expression $7p + 11q - 4$ have?",
        options: ["1", "2", "3", "4"], correct_index: 1,
        explanation: "Look at the letters: $p$ and $q$. That's **2 variables**. The numbers $7$, $11$, $-4$ are coefficients/constants, not variables.",
        reasoning_level: 1 },
      { id: uid(), question: "A wire of total length 30 cm is bent into a rectangle of length $x$ cm. What is the **width** in terms of $x$?",
        options: ["$30 - x$", "$15 - x$", "$x - 15$", "$\\frac{30}{x}$"], correct_index: 1,
        explanation: "The perimeter is $2 \\cdot \\text{length} + 2 \\cdot \\text{width} = 30$. Dividing by 2: length + width = 15. So width = $15 - x$. (For 20 cm of wire it was $10 - x$; for 30 cm of wire it's $15 - x$ — same idea.)",
        reasoning_level: 2 },
      { id: uid(), question: "A garden of length $l$ m and width $w$ m needs grass costing ₹40 per sq m. Which expression gives the cost?",
        options: ["$40 + l + w$", "$40(l + w)$", "$40lw$", "$80(l + w)$"], correct_index: 2,
        explanation: "*Area* of the rectangular garden is $l \\times w$ sq m. At ₹40 per sq m, the cost is $40 \\times l \\times w = 40lw$. The other options confuse area with perimeter or sum.",
        reasoning_level: 2 },
      { id: uid(), question: "Look at the expression $3x^2 - 2x + 5$. How many **terms** does it have, and is it a polynomial in one variable?",
        options: ["2 terms; not a polynomial", "3 terms; polynomial in one variable ($x$)", "5 terms; polynomial in two variables", "1 term; polynomial in one variable"],
        correct_index: 1,
        explanation: "**3 terms** ($3x^2$, $-2x$, $5$, separated by $+$ and $-$). Only one variable ($x$) appears, so it is a **polynomial in one variable**. (You'll meet the formal definition of polynomial on the very next page — and you'll learn that this one has degree 2, making it a quadratic.)",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Building Expressions from Real Problems',
  subtitle: 'A garden, a bent wire, and the moment one variable becomes special',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['expressions', 'one-variable', 'two-variables', 'modelling', 'practice'],
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
