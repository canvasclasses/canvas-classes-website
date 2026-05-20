'use strict';
// Class 9 Math — Ch 2 — Page 20: "Reading Slope and y-intercept from Any Equation"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'reading-slope-and-y-intercept-from-any-equation';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 20;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of a young Indian student reshaping a tangled equation into a clean straight-line form, with floating algebraic symbols ( y, =, ax, +, b ) re-aligning themselves like magnetic pieces.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A young Indian student in a school uniform stands beside a glowing chalkboard. On the left side of the chalkboard is a tangled, complicated equation written in chalk: '2y = 4x + 7'. The student is reaching out with a piece of chalk, and from that gesture, glowing algebraic symbols ( y, =, 2x, +, 7/2 ) are gently floating away from the original equation and re-aligning themselves into the clean form 'y = 2x + 7/2' on the right side of the chalkboard. The mood is one of *clarification* — turning a messy expression into a recognisable shape. Painterly cinematic illustration. Dark background, warm amber chalk light. The only text on the chalkboard is the two equations described."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Sometimes a linear equation does not arrive in the friendly form $y = ax + b$. **For example:** $2y = 4x + 7$ — what is its slope? What is its $y$-intercept? Where does it cut the $y$-axis? **Can you read all three off the equation in its current shape?**",
    hint: "The equation $2y = 4x + 7$ has $2y$ on the left, but our slope-and-intercept rules need just *plain $y$* on the left. Can you divide both sides by something to change that?",
    reveal: "Divide both sides of $2y = 4x + 7$ by $2$ to get $y = 2x + \\tfrac{7}{2}$. **Now** the equation is in standard form, and we can read it off in one glance: slope $a = 2$, $y$-intercept $b = \\tfrac{7}{2}$, and the line cuts the $y$-axis at $(0, \\tfrac{7}{2})$. **The lesson of this page:** before you read off the slope and $y$-intercept, *first* arrange the equation into the form $y = ax + b$ — and then the rest is automatic."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'बीजगणित — भास्कराचार्य (११५० CE)',
    markdown: "_From Bhāskarāchārya's Bījagaṇita — On the Standard Form_\n\n### अनेकरूपं समीकरणं तत् एकरूपं विधीयते\n### एकेन रूपेण सर्वत्र अव्यक्तं स्फुटं भवेत्॥\n\n*(aneka-rūpaṃ samīkaraṇaṃ tat eka-rūpaṃ vidhīyate / ekena rūpeṇa sarvatra avyaktaṃ sphuṭaṃ bhavet)*\n\n---\n\n*'अनेक रूप वाले समीकरण को एक ही रूप में लाना चाहिए। एक रूप से ही अनजाना (अव्यक्त) हर जगह साफ हो जाता है।'*\n\n*'An equation that takes many forms should be brought into one standard form. From that one form, the unknown becomes clear everywhere.'*\n\nBhāskarāchārya's advice from $1150$ CE is *exactly* the strategy this page teaches. Once you bring any linear equation to its **standard form** $y = ax + b$, the unknowns (the slope and $y$-intercept) become obvious without effort. **The hardest part is not reading the equation — it is putting it into standard form first.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'The standard form is $y = ax + b$' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Throughout this chapter we have been writing linear equations as $y = ax + b$. This is called the **standard form** (or *slope-intercept form*) because as soon as the equation looks like this, you can *read off* both the slope $a$ and the $y$-intercept $b$ at a glance.\n\nBut equations sometimes appear in other shapes — multiplied through by a constant, or with the $y$-term on the right, or with the $x$-term and the constant grouped on the same side. **Before you can use the slope and $y$-intercept, you must first re-arrange the equation into standard form.**\n\nThe arithmetic moves you are allowed to use are the same ones that have served us all chapter:\n\n1. **Divide both sides** by a constant — useful when there is a number multiplying $y$.\n2. **Add or subtract** the same quantity from both sides — useful for moving terms across.\n3. **Combine like terms** — collect $x$-terms together, constants together.\n\nDo not change *what* the equation says — only *how* it looks. The line described stays exactly the same line; only the form of the equation changes.\n\n**Common shapes you will meet, with the standard-form move beside each:**\n\n| Shape you see | What to do | Result |\n|---|---|---|\n| $2y = 4x + 7$ | Divide by $2$ | $y = 2x + \\tfrac{7}{2}$ |\n| $5y = 6x - 10$ | Divide by $5$ | $y = \\tfrac{6}{5}x - 2$ |\n| $y - 3x = 4$ | Add $3x$ to both sides | $y = 3x + 4$ |\n| $4x + y = 7$ | Subtract $4x$ from both sides | $y = -4x + 7$ |\n| $3y = 6x - 11$ | Divide by $3$ | $y = 2x - \\tfrac{11}{3}$ |\n\n*Once* the equation has $y$ alone on the left and $ax + b$ on the right, you have your slope and $y$-intercept staring at you."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'cartesian-plotter',
    title: 'Try It: Re-shape Any Equation, Then Read Slope and y-Intercept'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'End-of-Chapter Q7 (i) — y = -3x + 4', variant: 'ncert_intext',
    problem: "For the line $y = -3x + 4$, identify the slope and $y$-intercept, and find the coordinates where it cuts the $y$-axis.",
    solution: "**Standard form check.** The equation is *already* in $y = ax + b$ form. So we can read off:\n\n- **Slope:** $a = -3$ (the line falls as we move right — linear decay).\n- **$y$-intercept:** $b = 4$.\n- **Where it cuts the $y$-axis:** at $x = 0$, $y = -3(0) + 4 = 4$. So the line cuts the $y$-axis at $(0, 4)$.\n\n**Two satisfying points to draw the line:** $(0, 4)$ and (pick $x = 1$) $(1, 1)$. Lay a ruler across them and draw."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'End-of-Chapter Q7 (ii) — 2y = 4x + 7', variant: 'ncert_intext',
    problem: "For the line $2y = 4x + 7$, identify the slope and $y$-intercept, and find the coordinates where it cuts the $y$-axis.",
    solution: "**Standard form first.** The left side is $2y$, not $y$. Divide *every term* by $2$ to isolate $y$:\n\n$$y = \\tfrac{4x}{2} + \\tfrac{7}{2} = 2x + \\tfrac{7}{2}$$\n\n**Now read off the values.**\n\n- **Slope:** $a = 2$ (linear growth).\n- **$y$-intercept:** $b = \\tfrac{7}{2}$ (or $3.5$).\n- **Cuts the $y$-axis at:** $(0, \\tfrac{7}{2})$ — i.e., $3.5$ units above the origin.\n\n*Important habit:* always divide *every* term, not just one. A common mistake is to write $y = 4x + \\tfrac{7}{2}$ — forgetting to divide the $4x$ by $2$. Re-check by mentally multiplying back by $2$: does it give back the original? Yes — $2 \\cdot (2x + \\tfrac{7}{2}) = 4x + 7$. ✓"
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'End-of-Chapter Q7 (iii) — 5y = 6x - 10', variant: 'ncert_intext',
    problem: "For the line $5y = 6x - 10$, identify the slope and $y$-intercept, and find the coordinates where it cuts the $y$-axis.",
    solution: "**Standard form first.** Divide every term by $5$:\n\n$$y = \\tfrac{6x}{5} - \\tfrac{10}{5} = \\tfrac{6}{5}x - 2$$\n\n**Read off.**\n\n- **Slope:** $a = \\tfrac{6}{5}$ (linear growth — gentle, just a little steeper than slope $1$).\n- **$y$-intercept:** $b = -2$.\n- **Cuts the $y$-axis at:** $(0, -2)$ — i.e., $2$ units *below* the origin.\n\n*Why $-\\tfrac{10}{5}$ became $-2$, but $\\tfrac{6}{5}$ stayed as a fraction.* Because $10$ is divisible by $5$ but $6$ is not. **Reduce wherever you can; leave fractions where division does not give whole numbers.**"
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'End-of-Chapter Q7 (iv) — 3y = 6x - 11 + the parallel-line check', variant: 'ncert_intext',
    problem: "For the line $3y = 6x - 11$, identify the slope, $y$-intercept, and the coordinates where it cuts the $y$-axis. **Then look back at parts (i)-(iv) of this question and check: are any of these four lines parallel to each other?**",
    solution: "**Standard form first.** Divide every term by $3$:\n\n$$y = \\tfrac{6x}{3} - \\tfrac{11}{3} = 2x - \\tfrac{11}{3}$$\n\n**Read off.**\n\n- **Slope:** $a = 2$ (linear growth).\n- **$y$-intercept:** $b = -\\tfrac{11}{3}$ (about $-3.67$).\n- **Cuts the $y$-axis at:** $(0, -\\tfrac{11}{3})$.\n\n**Now the parallel-line check.** Collect the slopes of all four lines from this question:\n\n- (i) $y = -3x + 4$: slope $-3$.\n- (ii) $y = 2x + \\tfrac{7}{2}$: slope $2$.\n- (iii) $y = \\tfrac{6}{5}x - 2$: slope $\\tfrac{6}{5}$.\n- (iv) $y = 2x - \\tfrac{11}{3}$: slope $2$.\n\nLines (ii) and (iv) **both have slope $2$** but different $y$-intercepts ($\\tfrac{7}{2}$ and $-\\tfrac{11}{3}$). So they are **parallel** to each other. The other two lines have unique slopes, so they are not parallel to anyone else.\n\n**Answer to the parallel question:** Lines (ii) and (iv) are parallel."
  },
  { id: uid(), type: 'reasoning_prompt', order: 10,
    reasoning_type: 'logical',
    prompt: "Two students each rewrite the equation $4x - 2y + 6 = 0$ in standard form. Riya gets $y = 2x + 3$. Aman gets $y = 2x - 3$. **Which one is correct, and what is the most likely mistake the other student made?**",
    options: [
      "Both are correct",
      "Aman is correct; Riya forgot a sign",
      "**Riya is correct; Aman likely flipped the sign of the constant when moving it across the equals sign. Starting from $4x - 2y + 6 = 0$, isolating $-2y$ gives $-2y = -4x - 6$. Dividing by $-2$ gives $y = 2x + 3$ (the negative signs cancel out as we divide by a negative). Aman probably divided the $-6$ by $2$ instead of by $-2$, missing the sign flip.**",
      "Both are wrong"
    ],
    reveal: "From $4x - 2y + 6 = 0$, move $4x$ and $6$ to the right: $-2y = -4x - 6$. Now divide every term by $-2$: $\\tfrac{-2y}{-2} = \\tfrac{-4x}{-2} + \\tfrac{-6}{-2}$, which simplifies to $y = 2x + 3$. **Riya is correct.** Aman almost certainly forgot that *dividing by a negative changes the signs of every term* — a very common mistake. **The fix:** when isolating $y$ from $-2y = \\ldots$, always note that you are dividing by $-2$ (negative), so every term on the right *flips its sign*. Build that as a reflex.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 11,
    title: 'Practice Yourself — Re-shape, Read, Compare',
    markdown: "**A. Rewrite each equation in standard form $y = ax + b$, then list the slope and $y$-intercept.**\n\n1. $4y = 8x + 12$\n2. $3y - 6x = 9$\n3. $2x + y = 7$\n4. $5y = -10x + 25$\n5. $y - x = 0$ &nbsp; (no constant — the line passes through the origin)\n6. $7x - 3y = 6$\n7. $-y = 5x + 2$ &nbsp; (the *minus* on $y$ is a small twist)\n8. $\\tfrac{y}{2} = 3x - 1$\n\n**B. Spot the parallel pairs (if any) among each list.**\n\n9. $y = 2x + 5$ &nbsp; and &nbsp; $4x - 2y = 6$\n10. $y = -3x + 1$ &nbsp; and &nbsp; $9x + 3y = 12$\n11. $2y = x + 4$ &nbsp; and &nbsp; $y = 2x + 4$\n\n---\n\n**Answers:**  1. $y = 2x + 3$; slope $2$, $y$-int $3$.  2. Add $6x$: $3y = 6x + 9 \\Rightarrow y = 2x + 3$; slope $2$, $y$-int $3$.  3. Subtract $2x$: $y = -2x + 7$; slope $-2$, $y$-int $7$.  4. $y = -2x + 5$; slope $-2$, $y$-int $5$.  5. $y = x$; slope $1$, $y$-int $0$.  6. Subtract $7x$: $-3y = -7x + 6$. Divide by $-3$: $y = \\tfrac{7}{3}x - 2$; slope $\\tfrac{7}{3}$, $y$-int $-2$.  7. Multiply by $-1$: $y = -5x - 2$; slope $-5$, $y$-int $-2$.  8. Multiply by $2$: $y = 6x - 2$; slope $6$, $y$-int $-2$.  **9.** $4x - 2y = 6 \\Rightarrow y = 2x - 3$. Both have slope $2$. **Parallel** ✓.  **10.** $9x + 3y = 12 \\Rightarrow y = -3x + 4$. Both have slope $-3$. **Parallel** ✓.  **11.** $2y = x + 4 \\Rightarrow y = \\tfrac{1}{2}x + 2$. Slopes $\\tfrac{1}{2}$ and $2$ — *not* parallel."
  },
  { id: uid(), type: 'inline_quiz', order: 12, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "What is the slope of the line $3y = 12x + 9$?",
        options: ["$3$", "$4$", "$9$", "$12$"], correct_index: 1,
        explanation: "Divide by $3$ first: $y = 4x + 3$. Now the slope is the number multiplying $x$, which is **$4$**.",
        reasoning_level: 1 },
      { id: uid(), question: "Where does the line $2x + y = 8$ cut the $y$-axis?",
        options: ["$(0, 2)$", "$(0, 4)$", "$(0, 8)$", "$(0, -8)$"], correct_index: 2,
        explanation: "Rewrite in standard form: subtract $2x$ from both sides to get $y = -2x + 8$. The $y$-intercept is $8$, so the line cuts the $y$-axis at $(0, 8)$.",
        reasoning_level: 2 },
      { id: uid(), question: "Which two of the following lines are **parallel**? (i) $y = 5x - 1$ &nbsp;(ii) $2y = 6x + 4$ &nbsp;(iii) $10x - 2y = 7$ &nbsp;(iv) $y - x = 9$",
        options: [
          "(i) and (ii)",
          "**(i) and (iii)** — both have slope $5$",
          "(ii) and (iv)",
          "(iii) and (iv)"
        ],
        correct_index: 1,
        explanation: "Standard-form each: (i) slope $5$; (ii) $y = 3x + 2$ slope $3$; (iii) $-2y = -10x + 7 \\Rightarrow y = 5x - \\tfrac{7}{2}$ slope $5$; (iv) $y = x + 9$ slope $1$. Slopes are $5, 3, 5, 1$. So **(i) and (iii) share slope $5$ — they are parallel.**",
        reasoning_level: 3 },
      { id: uid(), question: "Solving the equation $-2y = -6x + 8$ for $y$ gives:",
        options: [
          "$y = -3x + 4$",
          "$y = 3x - 4$",
          "**$y = 3x - 4$** — every term was divided by $-2$, which flipped the sign of each term on the right",
          "$y = -3x - 4$"
        ],
        correct_index: 2,
        explanation: "Divide every term by $-2$: $\\tfrac{-2y}{-2} = \\tfrac{-6x}{-2} + \\tfrac{8}{-2}$, giving $y = 3x - 4$. Notice how the $-6x$ became $+3x$ (negative $\\div$ negative $=$ positive) and the $+8$ became $-4$ (positive $\\div$ negative $=$ negative). **Dividing by a negative number flips the sign of *every* term on that side.**",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Reading Slope and y-Intercept from Any Equation',
  subtitle: "Not every linear equation arrives in standard form — re-arrange first, then read $a$ and $b$ in one glance",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['standard-form', 'slope', 'y-intercept', 'rearrangement', 'parallel-lines', 'NCERT-end-of-chapter-Q7', 'practice'],
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
