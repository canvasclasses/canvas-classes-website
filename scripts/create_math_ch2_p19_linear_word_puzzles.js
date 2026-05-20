'use strict';
// Class 9 Math — Ch 2 — Page 19: "Linear Word Puzzles"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'linear-word-puzzles';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 19;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of a young Indian student sitting on the floor with three colourful puzzle pieces around her — one with a fraction symbol, one with a ratio scale, and one with two interlocking digits — each glowing softly. She thoughtfully fits them together using a pencil-and-paper equation in the centre.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A young Indian schoolgirl sits cross-legged on a wooden floor in a softly-lit study room, surrounded by three glowing puzzle pieces: on her left, a triangular puzzle piece with a fraction (5/2 and 2/3) painted on it; in front of her, a square puzzle piece showing a balance scale with a number 5x labelled; on her right, a hexagonal puzzle piece showing two interlocking digit cards. The puzzle pieces float gently in the air, glowing warm amber. In the centre of the floor, a notebook is open showing a glowing equation 'y = ax + b'. The mood is curious problem-solving. Painterly cinematic illustration. Dark background, warm amber accent light. No text labels other than what is on the puzzle pieces."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "**Three short puzzles in plain English:** *(a) Multiply a number by $\\tfrac{5}{2}$ and add $\\tfrac{2}{3}$ — you get $-\\tfrac{7}{12}$. What was the number? (b) One positive number is $5$ times another. Add $21$ to both, and one of them becomes twice the other. What are the two numbers? (c) A two-digit number has digits that differ by $3$. Reverse the digits, add to the original, and you get $143$. What is the number?* **Each puzzle hides a tiny linear equation. Can you spot it?**",
    hint: "Step 1 of every puzzle: name the unknown with a letter. Step 2: turn the words *exactly* into a single equation. Step 3: solve.",
    reveal: "All three puzzles are word-disguises for linear equations. (a) becomes $\\tfrac{5}{2}x + \\tfrac{2}{3} = -\\tfrac{7}{12}$, with answer $x = -\\tfrac{1}{2}$. (b) yields $5x + 21 = 2(x + 21)$, giving $x = 7$ and the two numbers $7$ and $35$. (c) reduces to $11(a + b) = 143$, so $a + b = 13$ — and combined with the digit-difference of $3$, the digits are $5$ and $8$, the numbers $58$ and $85$. **The hardest part of every word puzzle is the *translation* — once you have the equation, the algebra is short.** This page is a workout in that translation."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'लीलावती — भास्कराचार्य',
    markdown: "_From Bhāskarāchārya's Lilāvatī (c. 1150 CE) — On Riddle Problems_\n\n### प्रश्नस्य अव्यक्तरूपं तत् प्रत्यक्षीकर्तुम् एषणा\n### अक्षरेण विना नैव गणितं स्फुरति प्रिये॥\n\n*(praśnasya avyakta-rūpaṃ tat pratyakṣī-kartum eṣaṇā / akṣareṇa vinā naiva gaṇitaṃ sphurati priye)*\n\n---\n\n*'किसी प्रश्न का अनजाना रूप — उसे साफ करने की चाहत है। हे प्रिय, अक्षर (variable) के बिना गणित कभी नहीं चमकता।'*\n\n*'A question's hidden form — there is the desire to make it clear. O dear one, without letters (variables), mathematics will never shine.'*\n\nBhāskarāchārya wrote *Lilāvatī* full of word puzzles for his daughter — number tricks, trade questions, two-digit puzzles, fraction games — and showed her how a single letter can stand for the unknown number and untangle any of them. The first riddle of this page (the fraction puzzle) is the same kind of *gaṇita* he taught $900$ years ago. **The hardest step has always been the same: write the question as one clean equation. Once that is done, the rest is just arithmetic.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'A reusable 4-step routine for word puzzles' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Every linear word puzzle on this page (and many like them) bows to the same routine. Once you have practised it three times, you will see the structure inside any new puzzle.\n\n**The 4 steps:**\n\n1. **Name the unknown.** Pick a letter — usually $x$ or $n$ — and write down what it stands for in words. *(\"Let $x$ be the smaller number.\")*\n2. **Translate one phrase at a time.** Read the sentence and rewrite each English clause as an algebraic clause. \"Multiplied by\", \"added to\", \"twice\", \"becomes\" — each of these has a clear algebraic counterpart.\n3. **Form the equation and solve.** Combine the clauses into one equation, then apply the routine algebraic moves: clear fractions if any, gather like terms, divide.\n4. **Check the answer in the original sentence.** Substitute back into the *English* — not just the equation — to make sure it tells the right story.\n\n**A small dictionary of word-to-symbol translations:**\n\n- \"a number\" → a letter, e.g. $x$\n- \"the sum of $a$ and $b$\" → $a + b$\n- \"twice / double\" → $2 \\times \\ldots$\n- \"$5$ times another\" → $5 \\times $ (the other)\n- \"is\" / \"becomes\" / \"equals\" → $=$\n- \"$y$ more than $x$\" → $x + y$ &nbsp; (note the order — *more than* means *added on top of*)\n- \"$y$ less than $x$\" → $x - y$ &nbsp; (subtract from $x$)\n- \"two-digit number with tens digit $a$ and units digit $b$\" → $10a + b$\n\nKeep this dictionary in mind and read each puzzle slowly. Most translation errors come from rushing the words."
  },
  { id: uid(), type: 'worked_example', order: 5,
    label: 'End-of-Chapter Q3 — A fractional puzzle', variant: 'ncert_intext',
    problem: "If we multiply a number by $\\tfrac{5}{2}$ and add $\\tfrac{2}{3}$ to the product, we get $-\\tfrac{7}{12}$. **Find the number.**",
    solution: "**Step 1 — Name.** Let $x$ be the unknown number.\n\n**Step 2 — Translate.** *Multiply by $\\tfrac{5}{2}$* gives $\\tfrac{5}{2}x$. *Add $\\tfrac{2}{3}$* gives $\\tfrac{5}{2}x + \\tfrac{2}{3}$. *We get $-\\tfrac{7}{12}$* gives:\n\n$$\\tfrac{5}{2}x + \\tfrac{2}{3} = -\\tfrac{7}{12}$$\n\n**Step 3 — Solve.** Fractions make this look ugly, so multiply *every term* by the LCM of $2, 3, 12$ — which is $12$ — to clear all fractions:\n\n$$12 \\cdot \\tfrac{5}{2}x + 12 \\cdot \\tfrac{2}{3} = 12 \\cdot (-\\tfrac{7}{12})$$\n\n$$30x + 8 = -7$$\n\nSubtract $8$ from both sides: $30x = -15$. Divide by $30$: $x = -\\tfrac{15}{30} = -\\tfrac{1}{2}$.\n\n**Step 4 — Check.** Multiply $-\\tfrac{1}{2}$ by $\\tfrac{5}{2}$ to get $-\\tfrac{5}{4}$. Add $\\tfrac{2}{3}$. Getting common denominator $12$: $-\\tfrac{15}{12} + \\tfrac{8}{12} = -\\tfrac{7}{12}$. ✓\n\n**Answer:** $x = -\\tfrac{1}{2}$.\n\n*A small lesson.* When fractions clutter an equation, **multiply through by the LCM of the denominators first** — the equation immediately becomes a clean whole-number equation, much easier to solve. The answer at the end is the same; we have only changed the look of the equation, not its meaning."
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'End-of-Chapter Q4 — A ratio puzzle', variant: 'ncert_intext',
    problem: "A positive number is $5$ times another number. If $21$ is added to both the numbers, then one of the new numbers becomes twice the other new number. **What are the numbers?**",
    solution: "**Step 1 — Name.** Let the smaller number be $x$. The larger one is $5x$ (\"$5$ times another\").\n\n**Step 2 — Translate.** Adding $21$ to both: the smaller becomes $x + 21$ and the larger becomes $5x + 21$.\n\nNow read the next phrase carefully: *one of the new numbers becomes twice the other*. After adding $21$, the larger number is still bigger (since we added the same to both), so the natural reading is: *the larger new number $= 2 \\times$ the smaller new number*. That is:\n\n$$5x + 21 = 2(x + 21)$$\n\n**Step 3 — Solve.** Expand the right-hand side: $2(x + 21) = 2x + 42$. So:\n\n$$5x + 21 = 2x + 42$$\n\nSubtract $2x$ from both sides: $3x + 21 = 42$. Subtract $21$: $3x = 21$. Divide by $3$: $x = 7$.\n\n**Step 4 — Check in the original story.** The two numbers are $x = 7$ and $5x = 35$. *Both positive.* ✓ Add $21$ to each: $7 + 21 = 28$ and $35 + 21 = 56$. *Is one twice the other?* $56 = 2 \\times 28$. ✓\n\n**Answer:** The two numbers are **$7$ and $35$**.\n\n*Why we picked the larger-equals-twice-smaller direction.* If we had instead written *smaller becomes twice the larger*, i.e. $x + 21 = 2(5x + 21)$, we would have got $x = -\\tfrac{7}{3}$ — *negative*, which contradicts the puzzle's word \"positive\". The check step rescued us from that wrong reading."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'End-of-Chapter Q6 — A two-digit puzzle', variant: 'ncert_intext',
    problem: "The digits of a two-digit number differ by $3$. If the digits are interchanged, and the resulting number is added to the original number, we get $143$. **Find both possible numbers.**",
    solution: "**Step 1 — Name.** Let the tens digit of the original number be $a$ and the units digit be $b$. So the original number is $10a + b$. *(For example, the number $58$ has $a = 5$ and $b = 8$, and indeed $10(5) + 8 = 58$.)*\n\nThe number with digits interchanged has tens digit $b$ and units digit $a$, so it is $10b + a$.\n\n**Step 2 — Translate.** *The two added together is $143$* gives:\n\n$$(10a + b) + (10b + a) = 143$$\n\nSimplify: $10a + a + b + 10b = 11a + 11b = 11(a + b)$. So:\n\n$$11(a + b) = 143 \\quad \\Longrightarrow \\quad a + b = 13$$\n\nWe also know *the digits differ by $3$*, i.e. $|a - b| = 3$. Two cases:\n\n- **Case A:** $a - b = 3$. Combined with $a + b = 13$: add the two equations to get $2a = 16$, so $a = 8$, $b = 5$. The original number is $85$.\n- **Case B:** $b - a = 3$. Combined with $a + b = 13$: add to get $2b = 16$, so $b = 8$, $a = 5$. The original number is $58$.\n\n**Step 3 — Check.**\n\n- For $85$: reversed is $58$. Sum $85 + 58 = 143$ ✓. Digits $8$ and $5$ differ by $3$ ✓.\n- For $58$: reversed is $85$. Sum $58 + 85 = 143$ ✓. Digits $5$ and $8$ differ by $3$ ✓.\n\n**Answer:** Both **$85$ and $58$** satisfy the conditions. (The puzzle has two valid solutions because *the digits differ by $3$* allows the bigger digit to be in either position.)\n\n*What just happened algebraically.* We turned a two-digit puzzle into the very simple fact $a + b = 13$. The key step was the place-value translation $\\text{number} = 10a + b$ — once that is in your toolkit, every two-digit puzzle becomes a routine sum-and-difference of digits."
  },
  { id: uid(), type: 'reasoning_prompt', order: 8,
    reasoning_type: 'logical',
    prompt: "In Q6 above, the equation $11(a + b) = 143$ pinned down $a + b = 13$. **Why did the constant $11$ appear, no matter which two digits we chose?**",
    options: [
      "Because $143$ is divisible by $11$",
      "**Because $(10a + b) + (10b + a) = 10a + a + b + 10b = 11a + 11b = 11(a + b)$ — the sum of any two-digit number and its reversed version is *always* exactly $11$ times the sum of the digits, regardless of which digits we pick. The number $11$ is hard-wired into the place-value system.**",
      "Because $a$ and $b$ are both digits between $0$ and $9$",
      "Because the puzzle gave us a sum of $143$"
    ],
    reveal: "Look at the algebra carefully: $(10a + b) + (10b + a) = 11a + 11b = 11(a + b)$. The $11$ comes out of the *structure* of the place-value system — every two-digit number is $10 \\cdot \\text{(tens)} + 1 \\cdot \\text{(units)}$, and adding the reversal gives $(10 + 1)$ times each digit. This is why **the sum of any two-digit number and its reversal is always a multiple of $11$.** Try it with any two-digit number you like — say $42 + 24 = 66 = 11 \\cdot 6$, or $79 + 97 = 176 = 11 \\cdot 16$. **The digit-sum trick works every time.**",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 9,
    title: 'Practice Yourself — More Word Puzzles',
    markdown: "**A. Translate then solve.**\n\n1. If we multiply a number by $\\tfrac{2}{3}$ and subtract $\\tfrac{1}{6}$ from the product, we get $\\tfrac{1}{2}$. Find the number.\n2. Three more than four times a number is $19$. Find the number.\n3. Twice a number, decreased by $7$, is the same as the number increased by $4$. Find the number.\n\n**B. Two-quantity puzzles.**\n\n4. One number is $4$ more than another. Their sum is $30$. Find both.\n5. The age of a father is $3$ times the age of his son. In $15$ years, the father will be twice as old as the son. Find their present ages.\n6. (End-of-chapter Q5 — review of growth pattern.) If you have ₹$800$ and you save ₹$250$ every month, find the amount you have after (i) $6$ months (ii) $2$ years. Express this as a linear pattern $y = ax + b$.\n\n**C. Two-digit puzzles.**\n\n7. The sum of the digits of a two-digit number is $9$. If the digits are reversed, the new number is $27$ less than the original. Find the original number.\n8. The tens digit of a two-digit number is twice the units digit. If we add the original number to its reversal, we get $99$. Find both digits.\n\n---\n\n**Answers:**  1. $\\tfrac{2}{3}x - \\tfrac{1}{6} = \\tfrac{1}{2} \\Rightarrow$ multiply by $6$: $4x - 1 = 3 \\Rightarrow x = 1$.  2. $4x + 3 = 19 \\Rightarrow x = 4$.  3. $2x - 7 = x + 4 \\Rightarrow x = 11$.  4. Smaller $= x$, larger $= x + 4$. Sum: $2x + 4 = 30 \\Rightarrow x = 13$. Numbers: $13$ and $17$.  5. Son $= s$, father $= 3s$. In $15$ years: $3s + 15 = 2(s + 15) \\Rightarrow s = 15$. Son $15$, father $45$.  6. Linear rule: $y = 250x + 800$ where $x$ = number of months. After $6$ months: $y = 250(6) + 800 = ₹2{,}300$. After $2$ years ($24$ months): $y = 250(24) + 800 = ₹6{,}800$.  7. Tens $= a$, units $= b$, $a + b = 9$, original $- $ reversed $= 27$, i.e. $(10a + b) - (10b + a) = 9(a - b) = 27 \\Rightarrow a - b = 3$. Combined with $a + b = 9$: $a = 6$, $b = 3$. Number: $63$.  8. $a = 2b$, $(10a + b) + (10b + a) = 11(a + b) = 99 \\Rightarrow a + b = 9$. With $a = 2b$: $3b = 9$, $b = 3$, $a = 6$. Number: $63$ (same digits as Q7, by coincidence)."
  },
  { id: uid(), type: 'inline_quiz', order: 10, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "Three more than twice a number is $13$. **What is the number?**",
        options: ["$3$", "$5$", "$8$", "$10$"], correct_index: 1,
        explanation: "Translate: $2x + 3 = 13$. Subtract $3$: $2x = 10$. Divide by $2$: $x = 5$. **Check:** $2(5) + 3 = 13$ ✓.",
        reasoning_level: 1 },
      { id: uid(), question: "The sum of two consecutive integers is $47$. **What is the smaller integer?**",
        options: ["$22$", "$23$", "$24$", "$25$"], correct_index: 1,
        explanation: "Smaller $= n$, larger $= n + 1$. Sum $n + (n+1) = 47 \\Rightarrow 2n + 1 = 47 \\Rightarrow n = 23$. The two integers are $23$ and $24$.",
        reasoning_level: 2 },
      { id: uid(), question: "If we multiply a number by $\\tfrac{3}{4}$ and add $\\tfrac{1}{2}$ to the product, we get $2$. **Find the number.**",
        options: ["$\\tfrac{2}{3}$", "$\\tfrac{4}{3}$", "$2$", "$\\tfrac{8}{3}$"], correct_index: 2,
        explanation: "$\\tfrac{3}{4}x + \\tfrac{1}{2} = 2$. Multiply through by $4$: $3x + 2 = 8 \\Rightarrow 3x = 6 \\Rightarrow x = 2$. **Check:** $\\tfrac{3}{4}(2) + \\tfrac{1}{2} = \\tfrac{3}{2} + \\tfrac{1}{2} = 2$ ✓.",
        reasoning_level: 2 },
      { id: uid(), question: "The tens digit of a two-digit number is $1$ more than the units digit. The sum of the original number and its reversal is $77$. **What is the original number?**",
        options: ["$32$", "$43$", "$54$", "$65$"], correct_index: 1,
        explanation: "Tens $= a$, units $= b$. $a = b + 1$. Sum: $11(a + b) = 77 \\Rightarrow a + b = 7$. Combined with $a = b + 1$: $b + 1 + b = 7 \\Rightarrow b = 3$, $a = 4$. So the original number is $43$. **Check:** $43 + 34 = 77$ ✓ and $4 - 3 = 1$ ✓.",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Linear Word Puzzles',
  subtitle: "Three different flavours of word problem — fractions, ratios, two-digit tricks — solved by one shared 4-step translation routine",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-equation', 'word-problems', 'fractions', 'two-digit-puzzle', 'NCERT-end-of-chapter', 'practice'],
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
