'use strict';
// Class 9 Math — Ch 2 — Page 7: "Linear Patterns: Discovering the Constant Step"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'linear-patterns-discovering-the-constant-step';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 7;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic visualisation of an L-shaped staircase made of glowing amber tiles growing into the distance, each stage adding two more tiles than the previous',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An L-shaped staircase made of glowing amber-coloured square tiles rises and extends into the distance, getting wider and taller stage by stage. Each new stage of the staircase adds exactly two more tiles than the previous — one on top, one on the side. The staircase emerges from a dark misty foreground and ascends into a deep starry navy sky. The image conveys: every new stage adds the same fixed amount — the visual signature of a linear pattern. Painterly cinematic illustration. Dark background. No text labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Stage 1 of a tile pattern has **1 tile**. Stage 2 has **3 tiles**. Stage 3 has **5 tiles**. Stage 4 has **7 tiles**. **How many tiles in stage 100? In stage 1,000?**",
    hint: "Each stage adds exactly 2 more tiles than the previous. Can you find a formula in $n$ that gives the count for stage $n$ directly?",
    reveal: "Stage $n$ has $2n - 1$ tiles. So stage 100 has $2(100) - 1 = 199$ tiles, and stage 1,000 has $1{,}999$ tiles. **No need to draw 100 stages — the formula gives the answer instantly.** This page is about how a *picture* (a growing pattern) becomes an *algebraic formula* (a linear polynomial in $n$)."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'गणितसारसङ्ग्रह — महावीर (९वीं शताब्दी)',
    markdown: "_From Mahāvīra's Gaṇita-sāra-saṅgraha — On Figurate Numbers_\n\n### एकद्व्यादिक्रमेण आसन् वर्धमानानां यथा\n### ता एव सङ्ख्या त्रिकोणाः चतुष्कोणाः च गण्यन्ते॥\n\n*(eka-dvy-ādi-krameṇa āsan vardhamānānāṃ yathā / tā eva saṃkhyā tri-koṇāḥ catuṣ-koṇāḥ ca gaṇyante)*\n\n---\n\n*'जो संख्याएँ एक-दो-तीन के क्रम में बढ़ती हैं — उन्हीं को त्रिकोणीय (triangular) और चतुष्कोणीय (square) संख्याएँ कहते हैं।'*\n\n*'Numbers that grow in the order one, two, three — these very numbers are called triangular and square (figurate) numbers.'*\n\nMahāvīra's *Gaṇita-sāra-saṅgraha* (c. 850 CE) had a whole chapter on **figurate numbers** — numbers that arise from arrangements of dots, tiles, or pebbles in geometric shapes. Triangular numbers ($1, 3, 6, 10, \\ldots$), square numbers ($1, 4, 9, 16, \\ldots$), pentagonal numbers — Indian mathematicians counted them all, **800 years before Pascal's triangle reached Europe**. The L-staircase you'll meet on this page is in the same family: a *growing pattern* whose count follows a simple algebraic rule."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'The growing L-staircase' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Look at the four stages of the tile pattern:\n\n- **Stage 1:** 1 square.\n- **Stage 2:** 3 squares (an L-shape).\n- **Stage 3:** 5 squares.\n- **Stage 4:** 7 squares.\n\nThe sequence of counts is $1, 3, 5, 7, \\ldots$ — the odd numbers.\n\n**How is each stage built from the previous one?** Look carefully: each stage takes the previous shape and adds **exactly 2 squares** — one on top of the vertical column, one on the right of the horizontal row. The pattern grows in a steady L-shape rhythm, and the count goes up by 2 every stage."
  },
  { id: uid(), type: 'image', order: 5, src: '', width: 'full',
    caption: '📸 Fig. 2.4 — The growing L-staircase. Stages 1-4 with 1, 3, 5, 7 tiles.',
    alt: 'Four stages of a tile pattern shown side by side. Stage 1: a single square at the bottom. Stage 2: an L of three squares (one base square plus one to the right and one above). Stage 3: an L of five squares. Stage 4: an L of seven squares. The squares are pale orange-pink with darker outlines, sitting on a dotted baseline labelled "Stage 1, Stage 2, Stage 3, Stage 4" beneath each.',
    generation_prompt: "Educational mathematics illustration showing four stages of a growing tile pattern, side by side, evenly spaced. Stage 1: a single pale-orange square at the baseline. Stage 2: three pale-orange squares forming an L-tromino — the base square plus one square to its right and one square stacked on top. Stage 3: five pale-orange squares forming a larger L. Stage 4: seven pale-orange squares forming an even larger L. Each square has a thin darker orange border. Below each L is a centred caption: 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'. Style: clean educational textbook illustration. Dark background, orange accent labels, clean technical illustration style."
  },
  { id: uid(), type: 'simulation', order: 6, simulation_id: 'tile-pattern-explorer',
    title: 'Try It: Grow the L-Staircase Stage by Stage'
  },
  { id: uid(), type: 'heading', order: 7, level: 2, text: 'From "next is +2" to "the nth term is $2n - 1$"' },
  { id: uid(), type: 'text', order: 8,
    markdown: "Knowing each stage is *2 more* than the previous lets us continue the sequence: $1, 3, 5, 7, 9, 11, 13, \\ldots$. But this is not enough by itself — to find stage 100, we'd still have to count 100 jumps of 2.\n\n**We want a formula that gives the count *directly* in terms of the stage number $n$.** Let's hunt for it:\n\n| Stage $n$ | Count | Pattern |\n|---|---|---|\n| 1 | 1 | $2 \\times 1 - 1 = 1$ ✓ |\n| 2 | 3 | $2 \\times 2 - 1 = 3$ ✓ |\n| 3 | 5 | $2 \\times 3 - 1 = 5$ ✓ |\n| 4 | 7 | $2 \\times 4 - 1 = 7$ ✓ |\n| 5 | 9 | $2 \\times 5 - 1 = 9$ ✓ |\n\nThe rule is **count = $2n - 1$**. This is a **linear polynomial in $n$**: degree 1, leading coefficient 2, constant term $-1$.\n\nThe **constant difference** of 2 between consecutive counts and the **leading coefficient** 2 in the formula are the *same number* — that's no coincidence. The leading coefficient of a linear polynomial is exactly the per-step change."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 1 — Predict next three stages (NCERT Think-Reflect)', variant: 'ncert_intext',
    problem: "Predict the number of squares in **stages 5, 6, and 7** of the L-staircase pattern.",
    solution: "**Method 1 (use the +2 rule).** From stage 4 (which has 7 tiles), add 2 each time:\n\n- Stage 5: $7 + 2 = 9$\n- Stage 6: $9 + 2 = 11$\n- Stage 7: $11 + 2 = 13$\n\n**Method 2 (use the formula $2n - 1$).**\n\n- Stage 5: $2(5) - 1 = 9$ ✓\n- Stage 6: $2(6) - 1 = 11$ ✓\n- Stage 7: $2(7) - 1 = 13$ ✓\n\nFull sequence to stage 7: **1, 3, 5, 7, 9, 11, 13**."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 2 — Stage 15 and Stage 26 (NCERT Think-Reflect)', variant: 'ncert_intext',
    problem: "Use the formula $2n - 1$ to find the number of tiles in **stage 15** and **stage 26**.",
    solution: "**Stage 15:** $2(15) - 1 = 30 - 1 = 29$ tiles.\n\n**Stage 26:** $2(26) - 1 = 52 - 1 = 51$ tiles.\n\n**Notice the leverage of the formula.** To find stage 26 by counting jumps of 2, you'd have to add 25 twos. Using the formula, it's a single multiplication and a subtraction. **This is exactly the kind of leverage algebra gives you.**"
  },
  { id: uid(), type: 'worked_example', order: 11,
    label: 'Worked Example 3 — Which stage has 21 tiles? (NCERT Think-Reflect)', variant: 'ncert_intext',
    problem: "**Which stage** of the L-staircase contains exactly **21 tiles**?",
    solution: "**Method (set the polynomial equal to 21 and solve).**\n\nWe want $n$ such that $2n - 1 = 21$.\n\n- Add 1: $2n = 22$.\n- Divide by 2: $n = 11$.\n\n**Answer:** Stage **11**.\n\n**Check:** $2(11) - 1 = 21$ ✓.\n\n*Notice the pattern:* asking *forward* (\"how many tiles at stage 11?\") substitutes 11 into the formula. Asking *reverse* (\"which stage has 21 tiles?\") solves a linear equation. **Polynomial → equation = the same direction-flip you saw on Page 5.**"
  },
  { id: uid(), type: 'worked_example', order: 12,
    label: 'Worked Example 4 — Which stage has 47 tiles? (NCERT Think-Reflect)', variant: 'ncert_intext',
    problem: "Which stage of the L-staircase contains **47 tiles**?",
    solution: "Solve $2n - 1 = 47$:\n\n- Add 1: $2n = 48$.\n- Divide by 2: $n = 24$.\n\n**Answer:** Stage **24**.\n\n**Check:** $2(24) - 1 = 48 - 1 = 47$ ✓."
  },
  { id: uid(), type: 'reasoning_prompt', order: 13,
    reasoning_type: 'spatial',
    prompt: "Looking at the *picture* of the L-staircase, what tells you the formula must have a **+1 step per stage** (linear), rather than (say) a **×2 step per stage** (geometric, like 1, 2, 4, 8, …)?",
    options: [
      "Nothing in the picture tells you — you have to compute the differences",
      "**The picture itself shows that every new stage adds exactly 2 squares** (one on top, one on the side) — the *same number* added every time. A 'multiply by 2' pattern would have stage 2 = 2 squares (not 3), stage 3 = 4 (not 5), etc. The visual rhythm of *constant addition* is the linear signature.",
      "Because the squares are all the same size",
      "Because the L is symmetric"
    ],
    reveal: "**The picture itself reveals the linearity.** At every stage, exactly *2 new squares* are added — one on top of the vertical column, one to the right of the horizontal row. Constant addition = linear pattern. If instead each stage *doubled* the previous count (a *multiplicative* growth), we'd see exponential, not linear, behaviour. **Looking at how a pattern grows visually often tells you what kind of polynomial governs it.** Constant additions → linear. Constantly-growing additions (3, 5, 7, …) → quadratic. Doublings → exponential.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 14,
    title: 'Practice Yourself — Find the nth Term',
    markdown: "Each sequence is a linear pattern. Find the **nth-term formula** (an expression in $n$) and use it to compute the **20th term**. Cover the answers and try.\n\n1. $4, 7, 10, 13, 16, \\ldots$\n2. $100, 92, 84, 76, 68, \\ldots$\n3. $-3, 0, 3, 6, 9, \\ldots$\n4. $1, 5, 9, 13, 17, \\ldots$\n5. $50, 45, 40, 35, 30, \\ldots$\n6. $7, 7, 7, 7, 7, \\ldots$  *(constant pattern)*\n\n---\n\n**Answers:** 1. $f(n) = 3n + 1$, $f(20) = 61$. 2. $f(n) = -8n + 108$, $f(20) = -52$. 3. $f(n) = 3n - 6$, $f(20) = 54$. 4. $f(n) = 4n - 3$, $f(20) = 77$. 5. $f(n) = -5n + 55$, $f(20) = -45$. 6. $f(n) = 7$ (constant — degree 0, technically *not* linear but the constant-difference test still works with difference 0).\n\n**Recipe:** the leading coefficient is the constant difference. The constant term is found by checking $f(1)$: if $f(1) = a + b$ and we want this to match the first term, then $b = (\\text{first term}) - a$."
  },
  { id: uid(), type: 'inline_quiz', order: 15, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "If a linear pattern has nth term $5n + 3$, what is the **20th term**?",
        options: ["100", "103", "105", "120"], correct_index: 1,
        explanation: "$f(20) = 5(20) + 3 = 103$. (Substitute $n = 20$.)",
        reasoning_level: 1 },
      { id: uid(), question: "Which sequence is **not** a linear pattern?",
        options: ["3, 7, 11, 15, 19, …", "100, 90, 80, 70, 60, …", "**1, 4, 9, 16, 25, …**", "−5, 0, 5, 10, 15, …"],
        correct_index: 2,
        explanation: "1, 4, 9, 16, 25, … are squares ($n^2$), and the *differences* between consecutive terms (3, 5, 7, 9, …) are *not constant*. So this is **not linear** — it's a quadratic pattern. The other three sequences all have constant successive differences (4, −10, 5 respectively).",
        reasoning_level: 2 },
      { id: uid(), question: "The L-staircase pattern has nth term $2n - 1$. **Which stage has 99 tiles?**",
        options: ["49", "50", "**50**", "100"], correct_index: 2,
        explanation: "Solve $2n - 1 = 99$: $2n = 100$, $n = 50$. **Stage 50**. (Check: $2(50) - 1 = 99$ ✓.)",
        reasoning_level: 2 },
      { id: uid(), question: "A pattern starts $7, 12, 17, 22, \\ldots$. What is its **nth-term formula**?",
        options: ["$f(n) = 5n + 2$", "$f(n) = 5n - 2$", "$f(n) = 5n + 7$", "$f(n) = 7n + 5$"], correct_index: 0,
        explanation: "Constant difference is $5$, so leading coefficient $a = 5$. To match $f(1) = 7$: $5(1) + b = 7$ gives $b = 2$. So $f(n) = 5n + 2$. (Check: $f(2) = 12$ ✓, $f(3) = 17$ ✓.)",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Linear Patterns: Discovering the Constant Step',
  subtitle: 'Watch a tile pattern grow, count the new tiles, and discover the formula 2n − 1 hiding in the picture',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-pattern', 'figurate-numbers', 'nth-term', 'tile-pattern', 'practice'],
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
