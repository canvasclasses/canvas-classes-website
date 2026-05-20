'use strict';
// Class 9 Math — Ch 2 — Page 15: "Drawing the Line — Plotting y = ax + b"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'drawing-the-line-plotting-y-equals-ax-plus-b';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 15;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of a glowing coordinate grid floating above a dark indigo sky. On the grid, three softly-coloured straight lines fan out from the origin at different angles — one gentle, one diagonal, one steep — each labelled with its own equation. A young Indian student stands on the grid, holding a chalk, looking up at the lines with wonder.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vast green-tinted graph-paper grid floats horizontally in space against a deep indigo starry background. The grid has clearly marked x-axis and y-axis with numbered ticks. Three straight glowing lines fan out from the origin: a soft blue gentle-slope line labelled 'y = ½x', a soft red diagonal line at 45° labelled 'y = x', and a soft amber steep line labelled 'y = 2x'. A young Indian student in a school uniform stands at the origin of the grid, holding a piece of chalk, looking upward at the lines with a curious expression. The mood is wonder at the way numbers become geometry. Painterly cinematic illustration, warm yet mathematical. Dark background. The only text labels are the three line equations."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Until now we have written linear rules as numbers and tables. Today let us **draw them**. Pick any rule like $y = 2x + 1$ and find a few $(x, y)$ pairs: $(0, 1)$, $(1, 3)$, $(2, 5)$, $(3, 7)$. **If you mark these as dots on graph paper, what shape will they make?**",
    hint: "Try plotting the four pairs on a grid. Are the dots scattered randomly, or do they line up?",
    reveal: "**Every one of those four dots lies on the same straight line.** And not just those four — *every* $(x, y)$ pair that satisfies $y = 2x + 1$ sits on that same line. This is the most beautiful fact of the entire chapter: a linear rule and a straight line are *the same thing*, just written in two different languages — algebra and geometry. **On this page we will learn exactly how to translate from one to the other.**"
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'आर्यभटीय — आर्यभट (४९९ CE)',
    markdown: "_From Āryabhaṭa's Āryabhaṭīya — On Diagrams in Mathematics_\n\n### क्षेत्रगणितदृष्टान्ते रूपं ज्ञाय्यते स्फुटम्\n### अदृष्टं संख्यया साध्यं दृश्यं चित्रेण निश्चितम्॥\n\n*(kṣetra-gaṇita-dṛṣṭānte rūpaṃ jñāyyate sphuṭam / adṛṣṭaṃ saṃkhyayā sādhyaṃ dṛśyaṃ citreṇa niścitam)*\n\n---\n\n*'क्षेत्रगणित (ज्यामिति) के उदाहरण से रूप साफ-साफ दिखता है। जो संख्या से अनदेखा रहता है, वह चित्र से निश्चित हो जाता है।'*\n\n*'In a geometric example, the form is clearly seen. What remains hidden in numbers becomes certain in a picture.'*\n\nĀryabhaṭa wrote this in $499$ CE — the same century in which the modern decimal system itself was being formalised in India. He noticed something we are about to use directly: **a picture often shows what a list of numbers cannot.** A table of $(x, y)$ values for a rule is informative but quiet; a *graph* of those same values immediately reveals their straightness, their slope, their starting point. **From this page on, every linear rule will be both an algebraic formula and a geometric line — two different windows on the same idea.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'A quick reminder about the coordinate plane' },
  { id: uid(), type: 'text', order: 4,
    markdown: "From your earlier chapter on the Cartesian plane, recall: a *coordinate plane* is two number lines crossing at right angles — the horizontal one is the **$x$-axis**, the vertical one is the **$y$-axis**, and the point where they cross is the **origin** $(0, 0)$.\n\nEvery point on the plane is named by an **ordered pair** $(x, y)$. The first number tells you how far to the right of the origin (negative means *left*), and the second number tells you how far above the origin (negative means *below*). For instance, $(3, 7)$ means *go right $3$ units, then up $7$ units*; the dot you reach is the point with coordinates $(3, 7)$.\n\nAn *ordered pair* satisfies a linear rule if substituting it into the rule produces a true equation. For the rule $y = 2x + 1$, the point $(3, 7)$ satisfies it because $7 = 2(3) + 1$. The point $(3, 8)$ does *not* satisfy it because $8 \\ne 2(3) + 1 = 7$.\n\n**The big idea of this page** is that *the set of all points $(x, y)$ that satisfy a linear rule forms a straight line on the coordinate plane.* So to *draw* the line, we just need to find a few satisfying points and join them."
  },
  { id: uid(), type: 'heading', order: 5, level: 2, text: 'Two points are enough to draw a line' },
  { id: uid(), type: 'text', order: 6,
    markdown: "A truly remarkable fact of geometry: **any two distinct points decide one and only one straight line.** You can imagine this physically — hold a ruler so it touches two marked dots on a paper; there is exactly one position for the ruler. So once we have two satisfying points, we can lay a ruler across them and draw the entire line — and *every* other point on that ruler also satisfies the rule.\n\n**The recipe to plot $y = ax + b$ from scratch:**\n\n1. Pick any two convenient values of $x$ — usually $x = 0$ and one other small number.\n2. For each, compute $y$ from the rule. You now have two ordered pairs.\n3. Mark both pairs on the coordinate plane as dots.\n4. Lay a ruler across them and draw a line passing through both, extending in both directions.\n\nThat is it. No matter what $a$ and $b$ are, four small steps give you the full line.\n\n**A worked walkthrough.** Plot $y = 2x + 1$.\n\n- Choose $x = 0$. Then $y = 2(0) + 1 = 1$. So $(0, 1)$ is a satisfying point.\n- Choose $x = 3$. Then $y = 2(3) + 1 = 7$. So $(3, 7)$ is another satisfying point.\n- Mark $(0, 1)$ and $(3, 7)$ on the plane and draw a straight line through them.\n\nNow you can read off any other point on this line — for example, $(1, 3)$ and $(2, 5)$ both lie on the same line, and substituting confirms $3 = 2(1) + 1$ and $5 = 2(2) + 1$. **Once the line is drawn, the entire rule has been visualised.**"
  },
  { id: uid(), type: 'simulation', order: 7, simulation_id: 'cartesian-plotter',
    title: 'Try It: Pick Points, Draw Lines, See the Algebra Become Geometry'
  },
  { id: uid(), type: 'image', order: 8, src: '', width: 'full',
    caption: '📸 Fig. 2.15 — The line $y = 2x + 1$ plotted from two satisfying points.',
    alt: "A diagram of a coordinate plane with x-axis labelled from -3 to 5 and y-axis from -2 to 8. Two points are clearly marked: A(0, 1) and B(3, 7). A straight line passes through both, extending in both directions, with the label 'y = 2x + 1' above the line. The grid lines are soft, and the line and points are highlighted in warm colours.",
    generation_prompt: "A clean illustrative diagram for a Class 9 mathematics textbook, drawn in the warm hand-painted style of a children's textbook. A green-tinted graph-paper grid fills the frame, with the x-axis (horizontal) labelled from -3 to 5 and the y-axis (vertical) labelled from -2 to 8. Two prominent dots are placed: A at coordinates (0, 1) and B at coordinates (3, 7), each marked with a small filled circle in warm orange and labelled clearly. A straight blue line passes through both dots and extends to the edges of the grid in both directions, with the label 'y = 2x + 1' floating just above the upper-right portion of the line. Style: warm illustrative, dark indigo background outside the grid, soft amber grid lines."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 1 — Plot $y = 3x - 2$', variant: 'solved_example',
    problem: "Plot the line $y = 3x - 2$ on a coordinate plane. List the steps clearly.",
    solution: "**Step 1 — Pick two convenient $x$-values.** $x = 0$ and $x = 2$ are easy choices.\n\n**Step 2 — Compute $y$ for each.**\n- $x = 0$: $y = 3(0) - 2 = -2$. Point: $(0, -2)$.\n- $x = 2$: $y = 3(2) - 2 = 4$. Point: $(2, 4)$.\n\n**Step 3 — Mark and draw.** Mark $(0, -2)$ at $2$ units below the origin on the $y$-axis. Mark $(2, 4)$ at $2$ units right of the origin and $4$ units up. Lay a ruler across them and draw the line.\n\n**Step 4 — Verify a third point as a check.** Pick $x = 1$: the rule predicts $y = 3(1) - 2 = 1$, i.e. $(1, 1)$. If you place a dot at $(1, 1)$ on your drawn line, it should land *exactly on the line*. ✓\n\n*Reading the diagram.* The line slopes upward (because $a = 3 > 0$, growth) and crosses the $y$-axis at $-2$ (because $b = -2$). Both observations match what we said about $a$ and $b$ on the *Meet $y = ax + b$* page."
  },
  { id: uid(), type: 'heading', order: 10, level: 2, text: 'Going the other way — read the rule from the points' },
  { id: uid(), type: 'text', order: 11,
    markdown: "Now the reverse direction: someone hands you a few plotted points and tells you they all lie on a single line. Can you write down the equation of that line?\n\nYes — and the trick is exactly the **two-point method** from pages 13 and 14. Pick *any two* of the given points, treat them as $(x_1, y_1)$ and $(x_2, y_2)$, and run the same routine: substitute, eliminate $b$, find $a$, then $b$. The line's equation comes out the other end.\n\nLet us do this on the two NCERT examples that the chapter offers."
  },
  { id: uid(), type: 'worked_example', order: 12,
    label: 'NCERT Example 12 — Find the rule from given points', variant: 'ncert_intext',
    problem: "Five points are plotted on a graph and they all lie on a single straight line: $(-1, -3)$, $(0, 0)$, $(1, 3)$, $(3, 9)$, $(4, 12)$. **What is the equation of this line?**",
    solution: "**Quick observation.** Look at the $y$-coordinate of each point and compare with its $x$-coordinate. $y = 3x$ in every single case: $-3 = 3(-1)$, $0 = 3(0)$, $3 = 3(1)$, $9 = 3(3)$, $12 = 3(4)$. So the rule is\n\n$$\\boxed{\\,y = 3x\\,}$$\n\n**Same answer using the two-equation method.** Pick the two easiest points, say $(0, 0)$ and $(1, 3)$. Set up:\n\n$0 = 0 \\cdot a + b \\quad \\Rightarrow \\quad b = 0$\n\n$3 = 1 \\cdot a + b \\quad \\Rightarrow \\quad a = 3$\n\n(both methods agree). The line is $y = 3x$.\n\n*Reading off $a$ and $b$.* Here $a = 3$ (every step right makes $y$ rise by $3$) and $b = 0$ (the line passes through the origin). Lines that pass through the origin always have $b = 0$, and we recognise them by the simpler form $y = ax$."
  },
  { id: uid(), type: 'worked_example', order: 13,
    label: 'NCERT Example 13 — A line that slopes downward', variant: 'ncert_intext',
    problem: "Six points lie on a single straight line: $(-3, 6)$, $(-2, 4)$, $(0, 0)$, $(1, -2)$, $(2, -4)$, $(3, -6)$. **What is the equation of the line?**",
    solution: "**Look at the pattern.** For each point, the $y$-coordinate is exactly $-2$ times the $x$-coordinate: $6 = -2(-3)$, $4 = -2(-2)$, $0 = -2(0)$, $-2 = -2(1)$, $-4 = -2(2)$, $-6 = -2(3)$. So\n\n$$y = -2x$$\n\n**Two-equation check using $(1, -2)$ and $(2, -4)$.**\n\n$-2 = 1 \\cdot a + b$ &nbsp; and &nbsp; $-4 = 2 \\cdot a + b$. Subtract: $-2 = a$. Then $b = -2 - 1(-2) = 0$. So $y = -2x + 0 = -2x$. ✓\n\n*Reading off $a$ and $b$.* Here $a = -2$ — *negative*, so the line slopes *downward* as we move right (every step right makes $y$ fall by $2$). And $b = 0$ — the line again passes through the origin. **A negative $a$ tilts the line downward; a positive $a$ tilts it upward; a zero $a$ would make a perfectly flat horizontal line.**"
  },
  { id: uid(), type: 'heading', order: 14, level: 2, text: 'How $a$ controls the steepness of the line' },
  { id: uid(), type: 'text', order: 15,
    markdown: "Now that we can both *plot* and *read* lines, let's use this skill to *see* what we already know about $a$.\n\nConsider three lines that all pass through the origin: $y = \\frac{1}{2}x$, $y = x$, and $y = 2x$. They share the same $b = 0$ — so they all start at the same place — but their values of $a$ differ: $\\frac{1}{2}, 1, 2$.\n\n- $y = \\frac{1}{2}x$ — for every step right, $y$ rises by only $\\frac{1}{2}$. The line is *gentle*, almost lazy.\n- $y = x$ — for every step right, $y$ rises by exactly $1$. The line tilts at a clean $45\\degree$.\n- $y = 2x$ — for every step right, $y$ rises by $2$. The line is *steep*, climbing fast.\n\n**The bigger the value of $a$, the steeper the line.** This is the geometric meaning of *rate of change* that we met algebraically before. A line with $a = 100$ would shoot up almost vertically; a line with $a = 0.01$ would barely tilt.\n\nIf the rule is decay (negative $a$), the same idea applies in the *downward* direction — $y = -\\frac{1}{2}x$ slopes gently down, $y = -2x$ slopes steeply down."
  },
  { id: uid(), type: 'worked_example', order: 16,
    label: 'NCERT Example 14 — Compare three lines through the origin', variant: 'ncert_intext',
    problem: "Draw the lines $y = \\tfrac{1}{2}x$, $y = x$, and $y = 2x$ on the same set of axes by choosing a couple of suitable points on each.",
    solution: "All three lines pass through the origin (since $b = 0$). To draw each, we just need *one more* satisfying point — pick a small $x$ and compute $y$.\n\n**Line 1: $y = \\tfrac{1}{2}x$.** Pick $x = 4$ (so the answer is whole). Then $y = \\tfrac{1}{2}(4) = 2$. Second point: $(4, 2)$. Draw a straight line from $(0, 0)$ through $(4, 2)$.\n\n**Line 2: $y = x$.** Pick $x = 3$. Then $y = 3$. Second point: $(3, 3)$. Draw a $45\\degree$ line from $(0, 0)$ through $(3, 3)$.\n\n**Line 3: $y = 2x$.** Pick $x = 3$. Then $y = 6$. Second point: $(3, 6)$. Draw a steeper line from $(0, 0)$ through $(3, 6)$.\n\n**Comparing the three.** All three lines fan out from the origin. The $\\tfrac{1}{2}x$ line is the gentlest (climbs slowly). The $y = x$ line is in the middle ($45\\degree$). The $y = 2x$ line is the steepest (climbs fastest). **The number $a$ visibly controls how tilted the line is** — exactly as the previous text block predicted."
  },
  { id: uid(), type: 'reasoning_prompt', order: 17,
    reasoning_type: 'logical',
    prompt: "Two friends draw two lines on the same graph paper. Riya's line passes through $(0, 5)$ and rises by $3$ units every $1$ unit to the right. Aman's line passes through $(0, 5)$ and rises by $3$ units every $1$ unit to the right too. **Are their two lines the same line, two different lines, or impossible to tell?**",
    options: [
      "They could be different lines",
      "They are the **same line** — when two linear rules share both their starting value (the value of $b$) and their rate of change (the value of $a$), the rules are identical, and identical rules produce identical lines on the graph.",
      "They are different — same starting point, but the rest can differ",
      "Cannot be decided without more data"
    ],
    reveal: "Riya's line has $b = 5$ (passes through $(0, 5)$) and $a = 3$ (rises $3$ per step right). Aman's line has the same $b = 5$ and same $a = 3$. So both rules are $y = 3x + 5$. **A linear rule is *completely* determined by its two numbers $a$ and $b$** — fix those two, and the line is fixed forever. There is exactly one line through any given point with a given slope. (Equivalently: there is exactly one line through any *two* given points, which is the same fact in slightly different language.)",
    difficulty_level: 3
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 18,
    title: 'Practice Yourself — Plot, Read, and Compare',
    markdown: "**A. Plot each line by finding two satisfying points.**\n\n1. $y = x + 2$\n2. $y = -x + 3$\n3. $y = 4x$\n4. $y = \\tfrac{1}{2}x - 1$\n\n**B. From the list of plotted points, write the rule $y = ax + b$.**\n\n5. $(0, 4), (1, 6), (2, 8), (3, 10)$\n6. $(-2, 8), (0, 4), (1, 2), (3, -2)$\n7. $(-1, -5), (0, -3), (2, 1), (4, 5)$\n\n**C. Compare and decide.** Without plotting, say which line is *steeper* in each pair.\n\n8. $y = 4x + 1$ vs $y = 7x + 1$\n9. $y = 0.3x$ vs $y = -2x$ (look at the *size* of the rate, not the sign)\n10. $y = -5x + 2$ vs $y = 5x + 2$\n\n---\n\n**Answers:**  1. Two points: $(0, 2), (1, 3)$. Line slopes up gently, crosses $y$-axis at $2$.  2. $(0, 3), (1, 2)$. Line slopes *down*.  3. $(0, 0), (1, 4)$. Steep line through the origin.  4. $(0, -1), (2, 0)$. Gentle line crossing $y$-axis at $-1$.  5. Differences are $+2, +2, +2$, so $a = 2$. At $x = 0$, $y = 4$, so $b = 4$. **Rule: $y = 2x + 4$.**  6. $a = -2$ (consecutive differences are $-4$ over $2$ steps), $b = 4$. **Rule: $y = -2x + 4$.**  7. $a = 2$, $b = -3$. **Rule: $y = 2x - 3$.**  8. $y = 7x + 1$ is steeper ($7 > 4$).  9. $y = -2x$ is steeper (the size $|-2| = 2 > 0.3$, regardless of sign).  10. *Equally steep* — the sizes $|-5|$ and $|5|$ are both $5$. They tilt in opposite directions, but at the same angle."
  },
  { id: uid(), type: 'inline_quiz', order: 19, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "Which of the following points lies on the line $y = 2x + 3$?",
        options: ["$(1, 4)$", "$(2, 7)$", "$(3, 8)$", "$(4, 12)$"], correct_index: 1,
        explanation: "Test each: at $(2, 7)$, $2(2) + 3 = 7$ ✓. (Others: $(1, 4)$ gives $2(1) + 3 = 5 \\ne 4$; $(3, 8)$ gives $9 \\ne 8$; $(4, 12)$ gives $11 \\ne 12$.)",
        reasoning_level: 1 },
      { id: uid(), question: "To draw the line $y = 5x - 2$, the easiest first point to mark is the one with $x = 0$. **What is that point?**",
        options: ["$(0, 0)$", "$(0, -2)$", "$(0, 5)$", "$(0, 2)$"], correct_index: 1,
        explanation: "At $x = 0$, $y = 5(0) - 2 = -2$. So the point is $(0, -2)$. (This point is always the *y-intercept* — the spot where the line crosses the $y$-axis — and it equals $b$ in every linear rule.)",
        reasoning_level: 1 },
      { id: uid(), question: "Four points $(-2, 0)$, $(0, 4)$, $(1, 6)$, $(3, 10)$ lie on a single straight line. **What is its equation?**",
        options: ["$y = 2x + 4$", "$y = 2x - 4$", "$y = 4x + 2$", "$y = x + 4$"], correct_index: 0,
        explanation: "From $(0, 4)$, $b = 4$. From $(-2, 0)$ and $(0, 4)$, the rate is $\\frac{4 - 0}{0 - (-2)} = \\frac{4}{2} = 2$, so $a = 2$. Rule: $y = 2x + 4$. Check $(1, 6)$: $2(1) + 4 = 6$ ✓. Check $(3, 10)$: $2(3) + 4 = 10$ ✓.",
        reasoning_level: 2 },
      { id: uid(), question: "Three lines pass through the origin: $y = 0.5x$, $y = x$, and $y = 3x$. **Order them from gentlest slope to steepest slope.**",
        options: [
          "$y = 3x$, $y = x$, $y = 0.5x$",
          "$y = 0.5x$, $y = x$, $y = 3x$",
          "$y = x$, $y = 0.5x$, $y = 3x$",
          "All three are equally steep"
        ],
        correct_index: 1,
        explanation: "The size of $a$ controls the steepness. The values are $0.5, 1, 3$. Smallest to largest: $0.5 < 1 < 3$. So gentlest to steepest: **$y = 0.5x$, then $y = x$, then $y = 3x$.** This is the same fact NCERT Example 14 asked you to verify by drawing — the bigger the rate, the steeper the line.",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Drawing the Line: Plotting $y = ax + b$',
  subtitle: 'Two satisfying points, a ruler, and a graph — the moment a linear rule becomes a straight line',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-relationship', 'coordinate-plane', 'plotting', 'slope', 'NCERT-Section-2.6', 'practice'],
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
