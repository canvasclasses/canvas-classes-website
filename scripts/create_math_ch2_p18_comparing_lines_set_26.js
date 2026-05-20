'use strict';
// Class 9 Math — Ch 2 — Page 18: "Comparing Lines on One Grid (NCERT Exercise Set 2.6)"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'comparing-lines-on-one-grid-ncert-set-2-6';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 18;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of a glowing coordinate grid filling the frame, with five different fans of straight lines spreading out from various points — a beautiful tapestry of slopes and intercepts.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vast green-tinted graph-paper grid fills the frame against a deep navy starry sky. Across the grid, five distinct families of straight lines are drawn — some passing through the origin, some shifted up or down. The lines come in five colour groups (warm amber, soft red, blue, violet, teal) — three lines per group — fanning out at different angles. The composition gives an impression of a beautiful mathematical tapestry: many lines, each with its own personality of slope and y-intercept. The image conveys: the same coordinate plane holds infinitely many lines, and each one is fully described by its $a$ and $b$. Painterly cinematic illustration, warm yet mathematical. Dark background. No text labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Now we know what slope and $y$-intercept mean. Let us put both ideas to work in a single practice page. **Five small line-drawing tasks lie ahead. After each one, ask yourself: *what stayed the same and what changed?* The answers reveal everything about $a$ and $b$ in one clean session.**",
    hint: "If three lines all start at $(0, 0)$ but have different slopes, they fan out from a single point. If three lines have the same slope but different $y$-intercepts, they run parallel. Your job is to spot which pattern appears in each task.",
    reveal: "On this page we will draw and compare five sets of lines from NCERT Exercise Set $2.6$. **Each set isolates exactly one variable** — sometimes only the slope is changing, sometimes only the $y$-intercept, sometimes both. By the end of the page, you should be able to look at any equation $y = ax + b$ and *imagine* its line on the grid before lifting your pen."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'गणितसारसङ्ग्रह — महावीर (९वीं शताब्दी)',
    markdown: "_From Mahāvīra's Gaṇita-sāra-saṅgraha — On Practice and Pattern_\n\n### अभ्यासेन प्रकाशेत बुद्धिः सर्वस्य कर्मणः\n### एकविधौ कृते कार्ये अनेकत्र फलं भवेत्॥\n\n*(abhyāsena prakāśeta buddhiḥ sarvasya karmaṇaḥ / eka-vidhau kṛte kārye anekatra phalaṃ bhavet)*\n\n---\n\n*'अभ्यास से बुद्धि चमकती है, सब कर्मों में। एक तरीके से एक काम करने पर — कई जगह उसका फल मिलता है।'*\n\n*'Through practice, intelligence shines in every kind of work. When one task is done one way, its fruit appears in many places.'*\n\nThis page is exactly that idea. We will draw five small sets of lines using the same method we already know — *find two points, lay a ruler, draw the line* — and the same single technique will reveal five different patterns about slopes and $y$-intercepts. **One method, five different lessons.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'A reminder before we begin' },
  { id: uid(), type: 'text', order: 4,
    markdown: "For each line we want to draw, the routine is the same as before:\n\n1. Pick two convenient values of $x$ (often $x = 0$ and one other small number).\n2. Compute the matching $y$ for each.\n3. Mark both points on the coordinate plane and join them with a ruler.\n\nFor lines passing through the origin (those with $b = 0$), one of the two points is automatically $(0, 0)$ — so you only need to compute one more.\n\nFor each set of three lines we draw, we will reflect on **what stayed the same and what changed** between them. That reflection is where the lesson lives.\n\n*Tip — choose convenient $x$-values.* For a line like $y = -\\tfrac{1}{3}x$, picking $x = 3$ gives a clean whole-number $y = -1$. Picking $x = 1$ would give $y = -\\tfrac{1}{3}$, which is awkward to plot precisely. **A small bit of arithmetic foresight saves a lot of plotting headache.**"
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'cartesian-plotter',
    title: 'Try It: Plot Each Set of Lines and Spot the Pattern'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'Q1 (i) — y = 4x, y = 2x, y = x', variant: 'ncert_intext',
    problem: "Draw the graphs of $y = 4x$, $y = 2x$, and $y = x$ on the same axes. Reflect on the role of $a$ and $b$.",
    solution: "All three lines have $b = 0$, so all three pass through the origin $(0, 0)$.\n\n- $y = 4x$: at $x = 1$, $y = 4$. Pass through $(0, 0)$ and $(1, 4)$.\n- $y = 2x$: at $x = 1$, $y = 2$. Pass through $(0, 0)$ and $(1, 2)$.\n- $y = x$: at $x = 1$, $y = 1$. Pass through $(0, 0)$ and $(1, 1)$.\n\n**What stayed the same?** All three have $y$-intercept $0$. They all start at the origin.\n\n**What changed?** The slope ($a$ values $4, 2, 1$) — so the lines fan out at three different upward angles.\n\n**Conclusion.** When *only* $a$ changes (and $b$ is fixed), the lines all share a common point on the $y$-axis but tilt at different angles. **The bigger $a$ is, the steeper the climb** — $y = 4x$ is steepest, $y = x$ is gentlest, $y = 2x$ sits in between."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'Q1 (ii) — y = -6x, y = -3x, y = -x', variant: 'ncert_intext',
    problem: "Draw the graphs of $y = -6x$, $y = -3x$, and $y = -x$ on the same axes. Reflect on the role of $a$ and $b$.",
    solution: "All three lines have $b = 0$ — all pass through the origin. Pick one extra point each.\n\n- $y = -6x$: at $x = 1$, $y = -6$.\n- $y = -3x$: at $x = 1$, $y = -3$.\n- $y = -x$: at $x = 1$, $y = -1$.\n\n**What stayed the same?** All three have $y$-intercept $0$. All start at the origin and *fall* to the right (negative slopes).\n\n**What changed?** The size of the slope — $|-6| = 6$ is the biggest, then $|-3| = 3$, then $|-1| = 1$.\n\n**Conclusion.** This is exactly the mirror image of Q1 (i). All three lines fan downward to the right from the origin. The bigger the *size* of the slope, the steeper the fall — $y = -6x$ plunges fastest, $y = -x$ falls gently, $y = -3x$ sits between them."
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'Q1 (iii) — y = 5x and y = -5x', variant: 'ncert_intext',
    problem: "Draw the graphs of $y = 5x$ and $y = -5x$ on the same axes. Reflect on the role of $a$ and $b$.",
    solution: "Both lines pass through the origin (both have $b = 0$).\n\n- $y = 5x$: at $x = 1$, $y = 5$. Passes through $(0, 0)$ and $(1, 5)$.\n- $y = -5x$: at $x = 1$, $y = -5$. Passes through $(0, 0)$ and $(1, -5)$.\n\n**What stayed the same?** Both lines pass through the origin; both have *the same size* of slope, $5$.\n\n**What changed?** The *sign* of the slope — one is $+5$, the other is $-5$.\n\n**Conclusion.** The two lines tilt at exactly the same steepness but in opposite directions. They form a perfect X-shape centred at the origin. **Same size of slope, opposite signs — the lines are mirror images of each other through the horizontal $x$-axis.** This is the same idea we met on page 16: the sign of $a$ flips a line up-down."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Q1 (iv) — y = 3x - 1, y = 3x, y = 3x + 1', variant: 'ncert_intext',
    problem: "Draw the graphs of $y = 3x - 1$, $y = 3x$, and $y = 3x + 1$ on the same axes. Reflect on the role of $a$ and $b$.",
    solution: "All three lines have *the same slope* $a = 3$ but different $y$-intercepts: $b = -1, 0, 1$.\n\n- $y = 3x - 1$: at $x = 0$, $y = -1$. Cuts $y$-axis at $(0, -1)$.\n- $y = 3x$: at $x = 0$, $y = 0$. Passes through the origin.\n- $y = 3x + 1$: at $x = 0$, $y = 1$. Cuts $y$-axis at $(0, 1)$.\n\nFor a second point of each line, pick $x = 1$: $y = 2$, $y = 3$, $y = 4$ respectively. All three lines tilt upward at the same angle (rise of $3$ per unit $x$).\n\n**What stayed the same?** The slope. All three lines tilt at the same angle.\n\n**What changed?** The $y$-intercept. The lines cross the $y$-axis at three different heights ($-1, 0, 1$).\n\n**Conclusion.** When *only* $b$ changes (and $a$ is fixed), the lines run **parallel** to each other — same direction, same steepness, just slid up or down on the page. This is the parallel-lines rule we met on the previous page, now visible in Q1 (iv)."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Q1 (v) — y = -2x - 3, y = -2x, y = 2x + 3', variant: 'ncert_intext',
    problem: "Draw the graphs of $y = -2x - 3$, $y = -2x$, and $y = 2x + 3$ on the same axes. Reflect on the role of $a$ and $b$.",
    solution: "Now the slopes and $y$-intercepts are *both* changing — let us read each line carefully.\n\n- $y = -2x - 3$: slope $-2$, $y$-intercept $-3$. Falls to the right; cuts $y$-axis at $(0, -3)$.\n- $y = -2x$: slope $-2$, $y$-intercept $0$. Falls to the right; passes through the origin.\n- $y = 2x + 3$: slope $+2$, $y$-intercept $3$. Rises to the right; cuts $y$-axis at $(0, 3)$.\n\n**What is the same?** The first two lines have the *same slope* ($-2$). They are parallel to each other — both falling at the same angle.\n\n**What is different?** The third line has slope $+2$, opposite in sign to the first two. So the third line *rises* while the first two *fall*. And the third line has the same *size* of slope ($2$) as the first two — so it's tilted equally, but in the opposite direction.\n\n**Conclusion.** Q1 (v) mixes both behaviours: a parallel pair (the two with slope $-2$) and a third line that tilts at the same steepness but opposite direction. *This is a small reminder that whenever you read a line equation, the slope tells the tilt and the $y$-intercept tells the height — both must be checked, both decide the line.*"
  },
  { id: uid(), type: 'reasoning_prompt', order: 11,
    reasoning_type: 'logical',
    prompt: "Looking back at all five sets of lines on this page, **what *one* fact have we proved over and over again about the equation $y = ax + b$?**",
    options: [
      "All linear graphs pass through the origin",
      "**The two numbers $a$ and $b$ together fully describe a line — $a$ alone decides the tilt (slope, including its sign and size) and $b$ alone decides the height (the $y$-intercept). Once you know both, the line is fixed in one and only one position.**",
      "Lines never cross each other",
      "Negative slopes always make horizontal lines"
    ],
    reveal: "Across the five tasks, every set we drew was simply varying $a$ alone, $b$ alone, or both — and each time, the line responded predictably: tilt for $a$, height for $b$. **No other quantity is needed to describe a straight line.** This is the central truth of the entire chapter: a linear polynomial in one variable is determined completely by exactly two numbers, $a$ and $b$. Two numbers, one line — and once you can read $a$ and $b$, you can imagine the line without ever lifting your pen.",
    difficulty_level: 3
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 12,
    title: 'Practice Yourself — Predict First, Then Plot',
    markdown: "**Without plotting**, predict whether each pair of lines will be (P) parallel, (X) crossing somewhere, or (C) coincident (the same line).\n\n1. $y = 4x + 1$ &nbsp; and &nbsp; $y = 4x + 5$\n2. $y = 2x - 3$ &nbsp; and &nbsp; $y = -2x - 3$\n3. $y = 3x + 7$ &nbsp; and &nbsp; $y = 3x + 7$\n4. $y = -x + 4$ &nbsp; and &nbsp; $y = -x - 6$\n5. $y = 5x$ &nbsp; and &nbsp; $y = 6x$\n6. $y = \\tfrac{1}{2}x + 1$ &nbsp; and &nbsp; $y = \\tfrac{1}{2}x + 1$\n7. $y = -7x + 2$ &nbsp; and &nbsp; $y = 7x + 2$\n\n**Spot the pattern.**\n\n8. Draw and compare $y = x + 2$, $y = 2x + 2$, $y = 3x + 2$. What did you fix and what did you vary?\n9. Draw and compare $y = 2x + 1$, $y = 2x - 4$, $y = 2x + 6$. What did you fix and what did you vary?\n10. Draw and compare $y = 2x$ and $y = -2x$. How are these two lines related?\n\n---\n\n**Answers:**  1. **P** (same slope $4$, different $b$).  2. **X** (different slopes $2$ and $-2$; meet on $y$-axis at $(0, -3)$).  3. **C** (same slope and same $y$-intercept).  4. **P**.  5. **X** (slopes $5$ and $6$ differ).  6. **C**.  7. **X** (slopes $\\pm 7$; meet on $y$-axis at $(0, 2)$).  **8.** Fixed $b = 2$; varied slopes $1, 2, 3$. All three lines pass through $(0, 2)$ and fan upward.  **9.** Fixed slope $2$; varied $b$ values $1, -4, 6$. Three parallel lines.  **10.** Same size of slope ($2$), opposite signs. They form a perfect X centred at the origin."
  },
  { id: uid(), type: 'inline_quiz', order: 13, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "Three lines all pass through the origin: $y = 7x$, $y = -2x$, $y = x$. Which is the *steepest*?",
        options: ["$y = 7x$", "$y = -2x$", "$y = x$", "All equally steep"], correct_index: 0,
        explanation: "Steepness is decided by the *size* of the slope. Sizes are $7, 2, 1$. The biggest is $7$, so $y = 7x$ is the steepest.",
        reasoning_level: 1 },
      { id: uid(), question: "Two lines, $y = -3x + 6$ and $y = -3x - 2$, are drawn. What is true about them?",
        options: [
          "They are perpendicular",
          "**They are parallel — they share slope $-3$ but have different $y$-intercepts ($6$ and $-2$), so they tilt the same but at different heights.**",
          "They both pass through the origin",
          "They cross at the origin"
        ],
        correct_index: 1,
        explanation: "Equal slopes guarantee parallelism. Both lines have slope $-3$, but their $y$-intercepts ($6$ and $-2$) are different, so they are two distinct parallel lines — they never meet.",
        reasoning_level: 2 },
      { id: uid(), question: "Three lines $y = 5x + 3$, $y = 5x - 1$, $y = 5x + 8$ are drawn. **What is the gap between consecutive parallel lines, measured along the $y$-axis, between the lowest and middle, and between the middle and highest?**",
        options: [
          "Always $1$ unit",
          "Lowest-to-middle is $4$ units; middle-to-highest is $5$ units (because the $y$-intercepts go $-1, 3, 8$ → gaps of $4$ and $5$)",
          "Lowest-to-middle is $5$ units; middle-to-highest is $5$ units",
          "The gaps depend on the slope"
        ],
        correct_index: 1,
        explanation: "Order the $y$-intercepts: $-1, 3, 8$. Gap from $-1$ to $3$ is $4$. Gap from $3$ to $8$ is $5$. Since the slopes are equal, the *vertical gap* between any two parallel lines is exactly the difference in their $y$-intercepts — independent of where you measure on the grid.",
        reasoning_level: 3 },
      { id: uid(), question: "Lines $y = 6x + 5$ and $y = 6x + 5$ are written down by two different students. **What can you conclude?**",
        options: [
          "The two lines are parallel but distinct",
          "**The two equations describe the *same* line — same slope ($6$), same $y$-intercept ($5$). Two equations with identical $a$ and $b$ produce one and only one line.**",
          "They cross at the origin",
          "They cannot be compared"
        ],
        correct_index: 1,
        explanation: "A line is fully determined by its slope and $y$-intercept. If both are equal, the lines are identical — they overlap completely, point for point. We sometimes call this *coincident* lines: not two parallel lines with no gap, but literally the same line drawn twice. **One line, two equations.**",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Comparing Lines on One Grid (NCERT Exercise Set 2.6)',
  subtitle: "Five small sets of lines, five different patterns — same method, five distinct lessons about $a$ and $b$",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['slope', 'y-intercept', 'parallel-lines', 'NCERT-Ex-Set-2.6', 'practice'],
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
