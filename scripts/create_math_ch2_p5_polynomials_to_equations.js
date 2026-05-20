'use strict';
// Class 9 Math — Ch 2 — Page 5: "From Polynomials to Equations: Solving for the Unknown"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'polynomials-to-equations-solving-for-x';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 5;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic depiction of a brass mechanical input-output machine with a number being dropped in at the top, gears spinning inside, and a different number emerging from a slot on the side',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vintage brass and copper mechanical input-output machine fills the centre of the frame. At the top, a glowing tag with the number '4' is being dropped into a funnel. Visible through a clear panel in the middle, several brass gears with engraved formulas turn slowly. From a slot on the right side, another glowing tag emerges showing the number '11'. The machine sits on a heavy wooden table in a softly-lit Victorian-style mathematical workshop, with chalk-drawn equations on a blackboard in the background. The image conveys: a polynomial is a machine — input goes in, output comes out, the rule never changes. Painterly cinematic illustration. Dark background. No text labels other than the numbers on the input and output tags."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "**Two numbers add up to 64. One is 10 more than the other. What are the two numbers?**\n\nMost students try numbers — \"is it 30 and 34? No, 30+34 = 64 but the difference is only 4. Maybe 27 and 37?\" — and *eventually* land on the answer. **Is there a way to skip all the trial-and-error?**",
    hint: "Give the smaller number a name — say, $x$. What's the larger one in terms of $x$? Now translate the sentence 'they add up to 64' into algebra.",
    reveal: "Let the smaller number be $x$. The larger is $x + 10$. Their sum: $x + (x + 10) = 64$, i.e. $2x + 10 = 64$. Solving: $2x = 54$, so $x = 27$. The two numbers are **27 and 37**. **No guessing — just one equation, two algebraic moves.** This is the power of setting a polynomial equal to a value: the answer becomes findable by routine steps."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'बीजगणित — भास्कराचार्य (११५० CE)',
    markdown: "_From Bhāskarāchārya's Bījagaṇita — On the Unknown_\n\n### अव्यक्तं नाम राशिं तं यद् आरम्भे अदृश्यते\n### क्रियायाः अन्ते एव यत् व्यक्तं रूपेण दृश्यते॥\n\n*(avyaktaṃ nāma rāśiṃ taṃ yad ārambhe adṛśyate / kriyāyāḥ ante eva yat vyaktaṃ rūpeṇa dṛśyate)*\n\n---\n\n*'अव्यक्त (अनजानी) राशि वो है जो शुरुआत में नहीं दिखती — पर हिसाब के अंत में अपने असली रूप में सामने आ जाती है।'*\n\n*'The avyakta (unknown) is that quantity which is not visible at the start — but reveals its true form at the end of the calculation.'*\n\nBhāskarāchārya II's *Bījagaṇita* (1150 CE) is **the foundational Sanskrit text on algebra**. The very word *bījagaṇita* means *the mathematics of seeds* — symbolic seeds (variables) that grow into solved equations. Bhāskara taught the Indian world to treat the unknown $x$ as something you can multiply, add, subtract, and rearrange — *just like an ordinary number*. Every line of algebra you write today carries his fingerprint."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'From a polynomial to an equation' },
  { id: uid(), type: 'text', order: 4,
    markdown: "So far in this chapter we've treated a linear polynomial like $50m + 200$ as a *rule* — \"plug in any $m$, get out a value\". But sometimes the question runs the other way: **\"What value of $m$ would give a particular output?\"** That's a question about *equations*, not just polynomials.\n\nWhen we set a linear polynomial equal to a constant, we get a **linear equation**:\n\n$$50m + 200 = 750 \\quad\\Longleftrightarrow\\quad \\text{a linear equation in } m$$\n\nA value of the variable that makes the equation **true** is called a **solution** (or a **root**) of the equation. Solving the equation means *finding* that value.\n\n**Standard recipe for solving a linear equation:**\n\n1. Move all the variable terms to one side, all the constants to the other.\n2. Combine like terms.\n3. Divide by the coefficient of the variable.\n\nThat's it. Three moves. Always works."
  },
  { id: uid(), type: 'worked_example', order: 5,
    label: 'Worked Example 1 — Sum of two numbers (NCERT Ex 6)', variant: 'ncert_intext',
    problem: "The sum of two numbers is 64. One is 10 more than the other. **What are the two numbers?**",
    solution: "**Step 1 — Name the unknown.**\n\nLet the smaller number be $x$. Then the larger is $x + 10$.\n\n**Step 2 — Translate the sentence.**\n\n*'Their sum is 64'* becomes:\n\n$$x + (x + 10) = 64$$\n\nSimplify the left side: $2x + 10 = 64$. **This is a linear equation in $x$.**\n\n**Step 3 — Solve.**\n\n- Subtract 10 from both sides: $2x = 54$.\n- Divide both sides by 2: $x = 27$.\n\n**Step 4 — Answer the original question.**\n\nSmaller number: $x = 27$. Larger number: $x + 10 = 37$.\n\n**Step 5 — Check.** $27 + 37 = 64$ ✓ and $37 - 27 = 10$ ✓.\n\n**Answer:** The two numbers are **27 and 37**."
  },
  { id: uid(), type: 'simulation', order: 6, simulation_id: 'input-output-machine',
    title: 'Try It: Polynomials as Input–Output Machines'
  },
  { id: uid(), type: 'heading', order: 7, level: 2, text: 'Polynomials as input–output machines (functions)' },
  { id: uid(), type: 'text', order: 8,
    markdown: "There is another, equally powerful way to think about a polynomial: as an **input-output machine** (a *function*).\n\nConsider the linear polynomial $f(x) = 2x + 3$. For every value you put in for $x$, the polynomial gives back a unique value:\n\n- Input $x = 4$ → $2(4) + 3 = 11$. *Output: 11.*\n- Input $x = -6$ → $2(-6) + 3 = -9$. *Output: −9.*\n- Input $x = 0$ → $2(0) + 3 = 3$. *Output: 3.* (Notice — when the input is zero, the output is the constant term.)\n\nWe write $f(4) = 11$ and $f(-6) = -9$ and $f(0) = 3$. The notation **$f(\\text{input})$** means *\"the output of the machine $f$ when fed this input\"*.\n\n**Forward direction (substitute):** given an input, compute the output.\n**Reverse direction (solve):** given an output, find the input that produces it.\n\nThe forward direction is *just arithmetic* — substitute and simplify. The reverse direction is *algebra* — set up an equation and solve it. **Both are useful, and you'll switch between them constantly.**"
  },
  { id: uid(), type: 'image', order: 9, src: '', width: 'full',
    caption: '📸 Fig. 2.3 — The function $y = 2x + 3$ as an input-output machine. Input $x = 4$ → Output $y = 11$.',
    alt: "An input-output machine illustration. At the top is a small label 'x = 4' attached to a tag dropped into a funnel. The body of the machine, drawn as a metal box with two dials and a small screen, contains the rule 'y = 2x + 3' displayed clearly. At the bottom-right, the machine outputs another tag labelled 'y = 11'.",
    generation_prompt: "An illustration of a stylised input-output machine, drawn in the warm hand-painted style of a children's mathematics textbook. At the top: a small wooden tag labelled 'x = 4' is being dropped through a funnel into the machine. The machine itself is a metallic grey box with two dials, a red button, and a digital display in the middle showing the formula 'y = 2x + 3' in glowing teal letters. At the bottom-right of the machine, an output slot delivers a different wooden tag labelled 'y = 11'. Style: warm illustrative, slightly cartoonish but precise. Dark background, orange accent labels, clean technical illustration style."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 2 — Find the value (NCERT Ex Set 2.2, Q1)', variant: 'ncert_intext',
    problem: "Find the value of the linear polynomial $5x - 3$ if (i) $x = 0$ &nbsp;(ii) $x = -1$ &nbsp;(iii) $x = 2$.",
    solution: "**(i) $x = 0$:**  $5(0) - 3 = -3$.\n\n**(ii) $x = -1$:**  $5(-1) - 3 = -5 - 3 = -8$.\n\n**(iii) $x = 2$:**  $5(2) - 3 = 10 - 3 = 7$.\n\n*Side observation:* in (i), the value at $x = 0$ is exactly the **constant term** $-3$. (Always true.) Notice how the output goes from $-3$ to $-8$ to $7$ — and the per-unit change in $x$ produces a per-unit change of $5$ in the output (the leading coefficient). E.g., from $x = 0$ to $x = 2$, output went from $-3$ to $7$, a jump of $10 = 5 \\times 2$. ✓"
  },
  { id: uid(), type: 'worked_example', order: 11,
    label: 'Worked Example 3 — Substitute into a quadratic (NCERT Q2)', variant: 'ncert_intext',
    problem: "Find the value of the quadratic polynomial $7s^2 - 4s + 6$ if (i) $s = 0$ &nbsp;(ii) $s = -3$ &nbsp;(iii) $s = 4$.",
    solution: "Substitution works for *any* polynomial — not just linear ones.\n\n**(i) $s = 0$:**  $7(0)^2 - 4(0) + 6 = 0 - 0 + 6 = 6$. (Constant term, as expected.)\n\n**(ii) $s = -3$:**  $7(-3)^2 - 4(-3) + 6 = 7(9) + 12 + 6 = 63 + 12 + 6 = 81$.\n\n**(iii) $s = 4$:**  $7(4)^2 - 4(4) + 6 = 7(16) - 16 + 6 = 112 - 16 + 6 = 102$.\n\n**Important contrast with linear case:** the per-unit change here is *not* constant. From $s = 0$ to $s = 4$, output jumped by $96$. From $s = 4$ to $s = 8$, the jump would be much bigger. This is the signature of a quadratic — *the rate of change itself changes*."
  },
  { id: uid(), type: 'worked_example', order: 12,
    label: 'Worked Example 4 — Solve a linear equation', variant: 'solved_example',
    problem: "Solve $3x - 5 = 16$.",
    solution: "**Step 1 — Move the constant.** Add 5 to both sides:\n\n$$3x = 21$$\n\n**Step 2 — Divide by the coefficient.** Divide both sides by 3:\n\n$$x = 7$$\n\n**Step 3 — Check.** $3(7) - 5 = 21 - 5 = 16$. ✓\n\n**Answer:** $x = 7$."
  },
  { id: uid(), type: 'worked_example', order: 13,
    label: 'Worked Example 5 — Linear equation with a fraction', variant: 'solved_example',
    problem: "Solve $\\dfrac{x}{2} + 7 = 12$.",
    solution: "**Step 1 — Subtract 7:** $\\dfrac{x}{2} = 5$.\n\n**Step 2 — Multiply by 2:** $x = 10$.\n\n**Check:** $\\dfrac{10}{2} + 7 = 5 + 7 = 12$. ✓"
  },
  { id: uid(), type: 'worked_example', order: 14,
    label: 'Worked Example 6 — Auto fare word problem', variant: 'solved_example',
    problem: "An auto-rickshaw charges a base fare of ₹40 plus ₹15 per kilometre. **How many kilometres can you travel for ₹130?**",
    solution: "**Step 1 — Set up the function.** Let $d$ = distance in km. Cost = $40 + 15d$.\n\n**Step 2 — Set the cost equal to ₹130.**\n\n$$40 + 15d = 130$$\n\n**Step 3 — Solve.**\n- Subtract 40: $15d = 90$.\n- Divide by 15: $d = 6$.\n\n**Step 4 — Check.** $40 + 15(6) = 40 + 90 = 130$ ✓.\n\n**Answer:** You can travel **6 km** for ₹130."
  },
  { id: uid(), type: 'reasoning_prompt', order: 15,
    reasoning_type: 'logical',
    prompt: "Can two **different** inputs to a linear polynomial $f(x) = 2x + 3$ ever produce the **same** output? What about for a quadratic like $g(x) = x^2$?",
    options: [
      "Yes, for both — different inputs can always give the same output",
      "No for the linear, yes for the quadratic — every linear polynomial $ax + b$ is **one-to-one** (each output comes from exactly one input), but $g(x) = x^2$ gives the same output for $x$ and $-x$ (e.g., $g(2) = g(-2) = 4$)",
      "Yes for the linear, no for the quadratic",
      "No for both"
    ],
    reveal: "**Linear polynomials are one-to-one.** If $2x_1 + 3 = 2x_2 + 3$, subtract 3 and divide by 2: $x_1 = x_2$. So different inputs *cannot* give the same output. But for $g(x) = x^2$, both $x = 2$ and $x = -2$ give $g = 4$ — *two different inputs producing the same output*. This means the *reverse* problem (\"given output, find input\") has a unique answer for linear polynomials but possibly multiple answers for higher-degree ones. **It is one of the deepest reasons we focus this chapter entirely on the linear case** — the algebra is unambiguous.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 16,
    title: 'Practice Yourself — Substitute and Solve',
    markdown: "**A. Substitute (forward direction):**\n\n1. Find $f(3)$ if $f(x) = 4x - 7$.\n2. Find $g(-2)$ if $g(y) = -3y + 5$.\n3. Find $h(0)$ if $h(t) = 9t + 11$.\n4. Find $p(10)$ if $p(n) = 50n + 200$.\n\n**B. Solve (reverse direction):**\n\n5. $4x + 5 = 21$.\n6. $7y - 3 = 25$.\n7. $\\dfrac{m}{4} + 1 = 6$.\n8. $-2x + 9 = 1$.\n\n**C. Word problems:**\n\n9. The cost of $n$ tickets is given by $T(n) = 80n + 50$. How many tickets cost ₹530?\n10. A taxi charges ₹100 base + ₹14 per km. How many km can you travel for ₹254?\n\n---\n\n**Answers:**  1. 5  ·  2. 11  ·  3. 11 (the constant term)  ·  4. 700  ·  5. $x = 4$  ·  6. $y = 4$  ·  7. $m = 20$  ·  8. $x = 4$  ·  9. 6 tickets  ·  10. 11 km."
  },
  { id: uid(), type: 'inline_quiz', order: 17, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "If $f(x) = 5x - 3$, what is $f(2)$?",
        options: ["7", "10", "13", "−13"], correct_index: 0,
        explanation: "$f(2) = 5(2) - 3 = 10 - 3 = 7$. (Substitute $x = 2$ into the rule.)",
        reasoning_level: 1 },
      { id: uid(), question: "Solve the linear equation $3x + 4 = 19$.",
        options: ["$x = 3$", "$x = 5$", "$x = 7$", "$x = 15$"], correct_index: 1,
        explanation: "Subtract 4: $3x = 15$. Divide by 3: $x = 5$. **Check:** $3(5) + 4 = 19$ ✓.",
        reasoning_level: 1 },
      { id: uid(), question: "A chess club charges ₹200 + ₹50 per match. **A player paid ₹600. How many matches did he play?**",
        options: ["6", "8", "10", "12"], correct_index: 1,
        explanation: "Set $50m + 200 = 600$. Subtract 200: $50m = 400$. Divide by 50: $m = 8$. He played **8 matches**.",
        reasoning_level: 2 },
      { id: uid(), question: "If $f$ is a linear polynomial and $f(0) = 7$ and $f(1) = 10$, what is $f(2)$?",
        options: ["11", "12", "13", "Need more information"], correct_index: 2,
        explanation: "For a linear polynomial, the *constant difference* per unit step is fixed. From $f(0) = 7$ to $f(1) = 10$ is a step of $+3$. So $f(2) = 10 + 3 = 13$. (You can verify: $f(x) = 3x + 7$ has $f(0) = 7$, $f(1) = 10$, $f(2) = 13$.)",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'From Polynomials to Equations: Solving for the Unknown',
  subtitle: 'Run a polynomial forwards and you get a value; run it backwards and you solve an equation',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-equation', 'function', 'input-output', 'substitute', 'solve', 'practice'],
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
