'use strict';
// Class 9 Math — Ch 2 — Page 14: "Three Real-World Lines (NCERT Exercise Set 2.5)"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'three-real-world-lines-ncert-set-2-5';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 14;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic three-pane scene: on the left, a young Indian student watching a learning module on a laptop with a digital bill receipt next to her; in the centre, two friends playing badminton in a brightly lit indoor court; on the right, a thermometer showing both Celsius and Fahrenheit scales side by side, with ice cubes at one end and steaming water at the other.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio) split into three softly-divided vertical panels by thin lines of light. Left panel: a young Indian student in casual clothes watching an online learning module on a sleek laptop screen, with a digital bill icon glowing on the screen showing '₹400'. Centre panel: two Indian teenagers in athletic wear playing badminton on a brightly-lit indoor court, mid-shuttlecock-strike, with a small clock on the wall showing time elapsed. Right panel: a tall mercury thermometer drawn in close-up, marked with both Celsius and Fahrenheit scales side by side, ice cubes resting at the bottom-left and steam rising from the top-right. All three panels share warm golden indoor light. The image conveys: three completely different real-world stories — bills, gym hours, temperature — yet all of them follow the same linear rule. Painterly cinematic illustration. Dark background. No text labels other than what is already on the laptop screen and the thermometer."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "**Three completely different stories — a learning app's bill, a gym's hourly charge, and the Celsius–Fahrenheit temperature scales — all hide the same kind of rule inside them.** Same algebra, same method, three answers. **Can you finish all three in one sitting?**",
    hint: "Each story gives you two specific data points and asks you to find $a$ and $b$ in $y = ax + b$. Use exactly the routine from the previous page: turn each data point into an equation, eliminate $b$, find $a$, then find $b$.",
    reveal: "Yes, all three are solvable with the same method we learnt on the previous page. The first comes out to $a = 25$, $b = 150$ (₹$25$ per module + ₹$150$ fixed fee). The second to $a = 60$, $b = 200$ (₹$60$ per hour + ₹$200$ fixed fee). The third — the *most beautiful* of the three — gives the famous Celsius-Fahrenheit relation $\\degree\\text{C} = \\frac{5}{9}\\degree\\text{F} - \\frac{160}{9}$. **Three different worlds, one shared mathematical skeleton.**"
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'गणितसारसङ्ग्रह — महावीर (९वीं शताब्दी)',
    markdown: "_From Mahāvīra's Gaṇita-sāra-saṅgraha — On Practical Algebra_\n\n### व्यवहारेषु जातेषु प्रश्नेषु बहुधा नृणाम्\n### एकमेव गणितं स्यात् मूलं सर्वस्य कर्मणः॥\n\n*(vyavahāreṣu jāteṣu praśneṣu bahudhā nṛṇām / ekam eva gaṇitaṃ syāt mūlaṃ sarvasya karmaṇaḥ)*\n\n---\n\n*'मनुष्यों के व्यवहार में अनेक तरह के प्रश्न उठते हैं — पर सब के पीछे एक ही गणित होता है।'*\n\n*'Many kinds of questions arise in human dealings — but behind all of them stands one and the same mathematics.'*\n\nMahāvīra's *Gaṇita-sāra-saṅgraha* (c. $850$ CE) was a *practical* algebra book — written for shopkeepers, builders, and travellers, not just scholars. It made the same point this page makes: **the same algebraic method solves problems from completely different walks of life.** A bill, a fee, a temperature scale — they all bow to one technique. **One method, many lives.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'A reusable 5-step routine' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Each problem on this page asks the same thing: given two data points, find the linear rule $y = ax + b$. We will use exactly the same five steps for all three.\n\n**The 5-step routine:**\n\n1. **Read the story.** Identify which quantity is $x$ (the input) and which is $y$ (the output). Write down the two data points as ordered pairs $(x_1, y_1)$ and $(x_2, y_2)$.\n2. **Two equations.** Substitute each pair into $y = ax + b$ to get two linear equations in $a$ and $b$.\n3. **Eliminate $b$.** Subtract the first equation from the second — the $b$ disappears, leaving a single equation in $a$ alone. Solve for $a$.\n4. **Find $b$.** Plug the value of $a$ back into either of the two original equations to find $b$.\n5. **Write the rule and check.** Write $y = ax + b$ with your numbers, then verify that *both* original data points satisfy the rule.\n\nNotice we are using a small variation of the substitution trick from the previous page: *'subtract one equation from the other'* eliminates $b$ in one move, and is a touch faster than the *'isolate-then-substitute'* form. Both methods give the same answer — pick whichever feels easier.\n\nLet's apply this routine three times in a row."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'linear-pattern-explorer',
    title: 'Try It: Three Stories, Three Sets of Numbers, One Method'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'Q1 — The learning platform (NCERT Ex Set 2.5)', variant: 'ncert_intext',
    problem: "A learning platform charges a fixed monthly fee plus an additional cost per digital learning module accessed. A student observes that when she accessed **10 modules**, her bill was **₹400**. When she accessed **14 modules**, her bill was **₹500**. If the monthly bill $y$ depends on the number of modules accessed $x$, according to the relation $y = ax + b$, **find the values of $a$ and $b$**.",
    solution: "**Step 1 — Read.** $x$ = modules accessed, $y$ = bill in ₹. Two data points: $(10, 400)$ and $(14, 500)$.\n\n**Step 2 — Two equations.** Substitute each pair into $y = ax + b$:\n\n$$400 = 10a + b \\quad (1)$$\n\n$$500 = 14a + b \\quad (2)$$\n\n**Step 3 — Eliminate $b$.** Subtract $(1)$ from $(2)$:\n\n$$500 - 400 = (14a + b) - (10a + b)$$\n$$100 = 4a \\quad \\Longrightarrow \\quad a = 25$$\n\n**Step 4 — Find $b$.** Plug $a = 25$ into $(1)$:\n\n$$400 = 10(25) + b = 250 + b \\quad \\Longrightarrow \\quad b = 150$$\n\n**Step 5 — Final rule and check.** $y = 25x + 150$.\n\n- $x = 10$: $25(10) + 150 = 400$ ✓\n- $x = 14$: $25(14) + 150 = 500$ ✓\n\n**Answer:** $a = 25$, $b = 150$. The rule is $y = 25x + 150$. **Plain meaning:** the platform charges ₹$150$ as a fixed monthly fee plus ₹$25$ per module accessed."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'Q2 — The gym badminton court (NCERT Ex Set 2.5)', variant: 'ncert_intext',
    problem: "A gym charges a fixed monthly fee plus an additional cost per hour for using the badminton court. A student using the gym observed that when she used the badminton court for **10 hours**, her bill was **₹800**. When she used it for **15 hours**, her bill was **₹1{,}100**. If the monthly bill $y$ depends on the hours of use $x$ according to the relation $y = ax + b$, **find the values of $a$ and $b$**.",
    solution: "**Step 1 — Read.** $x$ = hours of court use, $y$ = bill in ₹. Data points: $(10, 800)$ and $(15, 1100)$.\n\n**Step 2 — Two equations.**\n\n$$800 = 10a + b \\quad (1)$$\n\n$$1100 = 15a + b \\quad (2)$$\n\n**Step 3 — Eliminate $b$.** Subtract $(1)$ from $(2)$:\n\n$$1100 - 800 = 15a - 10a$$\n$$300 = 5a \\quad \\Longrightarrow \\quad a = 60$$\n\n**Step 4 — Find $b$.** Plug $a = 60$ into $(1)$:\n\n$$800 = 10(60) + b = 600 + b \\quad \\Longrightarrow \\quad b = 200$$\n\n**Step 5 — Final rule and check.** $y = 60x + 200$.\n\n- $x = 10$: $60(10) + 200 = 800$ ✓\n- $x = 15$: $60(15) + 200 = 1100$ ✓\n\n**Answer:** $a = 60$, $b = 200$. The rule is $y = 60x + 200$. **Plain meaning:** the gym charges ₹$200$ as a fixed monthly fee plus ₹$60$ per hour of badminton court use."
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'Q3 — Celsius and Fahrenheit (NCERT Ex Set 2.5)', variant: 'ncert_intext',
    problem: "Consider the relationship between temperature measured in degrees Celsius (°C) and degrees Fahrenheit (°F), given by **°C $= a$ · °F $+ b$**. Find $a$ and $b$, given that ice melts at **$0$°C and $32$°F**, and water boils at **$100$°C and $212$°F**.",
    solution: "**Step 1 — Read.** Here the input is °F and the output is °C. So $x$ corresponds to °F and $y$ corresponds to °C.\n\nData points: ice → $(32, 0)$ and water boiling → $(212, 100)$.\n\n**Step 2 — Two equations.** Substitute into °C $= a$ · °F $+ b$:\n\n$$0 = 32a + b \\quad (1)$$\n\n$$100 = 212a + b \\quad (2)$$\n\n**Step 3 — Eliminate $b$.** Subtract $(1)$ from $(2)$:\n\n$$100 - 0 = (212a + b) - (32a + b)$$\n$$100 = 180a \\quad \\Longrightarrow \\quad a = \\frac{100}{180} = \\frac{5}{9}$$\n\n**Step 4 — Find $b$.** Plug $a = \\frac{5}{9}$ into $(1)$:\n\n$$0 = 32 \\cdot \\tfrac{5}{9} + b \\quad \\Longrightarrow \\quad b = -\\tfrac{160}{9}$$\n\n**Step 5 — Final rule and check.**\n\n$$\\degree\\text{C} = \\tfrac{5}{9}\\degree\\text{F} - \\tfrac{160}{9}$$\n\nA cleaner-looking form (factor out $\\tfrac{5}{9}$): $\\,\\degree\\text{C} = \\tfrac{5}{9}(\\degree\\text{F} - 32)$. Both forms describe the *same* line.\n\n**Check both data points.**\n- $\\degree\\text{F} = 32$: $\\tfrac{5}{9}(32 - 32) = 0$. ✓ (ice)\n- $\\degree\\text{F} = 212$: $\\tfrac{5}{9}(212 - 32) = \\tfrac{5}{9}(180) = 100$. ✓ (boiling water)\n\n**Answer:** $a = \\tfrac{5}{9}$ and $b = -\\tfrac{160}{9}$. The temperature conversion rule is **$\\degree\\text{C} = \\tfrac{5}{9}(\\degree\\text{F} - 32)$**.\n\n*A small note on what we just did.* This is the same Celsius-to-Fahrenheit conversion formula your science book uses — and *we just derived it from algebra* using only two known facts about water. Two data points, one method, and the entire planet's temperature-conversion rule fell out of the page."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example — Reverse use of the rule', variant: 'solved_example',
    problem: "Using the rule $\\degree\\text{C} = \\tfrac{5}{9}(\\degree\\text{F} - 32)$ that we just derived, **find what $50\\degree$F is in Celsius**, and **find what $25\\degree$C is in Fahrenheit**.",
    solution: "**Part A — F to C (forward direction).** Substitute $\\degree\\text{F} = 50$:\n\n$$\\degree\\text{C} = \\tfrac{5}{9}(50 - 32) = \\tfrac{5}{9}(18) = 10$$\n\nSo $50\\degree\\text{F} = 10\\degree\\text{C}$. (A pleasant cool day.)\n\n**Part B — C to F (reverse direction).** Now we know $\\degree\\text{C} = 25$ and we want $\\degree\\text{F}$. Set up the equation and solve:\n\n$$25 = \\tfrac{5}{9}(\\degree\\text{F} - 32)$$\n\nMultiply both sides by $\\tfrac{9}{5}$: $\\degree\\text{F} - 32 = 25 \\cdot \\tfrac{9}{5} = 45$. So $\\degree\\text{F} = 45 + 32 = 77$.\n\nSo $25\\degree\\text{C} = 77\\degree\\text{F}$. (A warm Indian afternoon.)\n\n**Lesson.** Once you have the rule, *both directions* — F to C and C to F — are easy. The forward direction is plain substitution. The reverse direction is solving a tiny linear equation. We have already practised both kinds in the chapter."
  },
  { id: uid(), type: 'reasoning_prompt', order: 10,
    reasoning_type: 'logical',
    prompt: "Look at the three rules we just derived: $y = 25x + 150$, $y = 60x + 200$, and $y = \\tfrac{5}{9}x - \\tfrac{160}{9}$. **What single feature did all three problems share that made the same method work for all of them?**",
    options: [
      "All three problems involved money",
      "All three problems gave us **exactly two data points and stated that the relationship was of the form $y = ax + b$**. Once those two conditions are met, the substitution-and-eliminate routine works no matter what the actual story is — bills, hours, or temperatures. *The story decorates the algebra; it does not change it.*",
      "All three rules had whole-number values of $a$ and $b$",
      "All three problems were about Indian everyday life"
    ],
    reveal: "The two essential ingredients are: **(1) the relationship must be linear** — i.e., a straight-line rule $y = ax + b$ — and **(2) you must be given exactly two data points**. Nothing else matters: the units could be rupees, hours, degrees, kilograms, anything; the values of $a$ and $b$ could be whole, fractional, or even negative. The same five-step routine grinds out the answer in every case. **This is what mathematicians mean when they say algebra is *general*:** one technique covers a vast number of situations, because the technique works on the *form* of the equation, not the meaning of the variables.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 11,
    title: 'Practice Yourself — Six More Two-Point Problems',
    markdown: "Use the 5-step routine on each. Set up two equations, eliminate one unknown, find $a$ and $b$, write the rule, and check.\n\n1. **Plumber's bill:** A 2-hour visit cost ₹$650$, a 5-hour visit cost ₹$1{,}250$. Find $y = ax + b$. What is the call-out fee (the part you pay even before any work begins)?\n2. **Bicycle rental:** $3$ days cost ₹$180$, $8$ days cost ₹$430$. Find the rule. What is the per-day rental?\n3. **Phone-data plan:** $4$ GB → ₹$220$, $10$ GB → ₹$340$. Find the rule. What is the fixed monthly fee?\n4. **Movie loyalty card:** After $3$ tickets, total spent is ₹$650$; after $7$ tickets, total spent is ₹$1{,}150$. Find the rule. What was the one-time card fee?\n5. **Salary scheme:** A salesperson earns ₹$15{,}000$ in a month with $20$ items sold and ₹$18{,}000$ in a month with $32$ items sold. Find the rule. What is the fixed base salary?\n6. **Distance ↔ time on a steady road trip:** After $2$ hours of driving, a car has covered $130$ km; after $5$ hours, $280$ km. (The rule is $y = ax + b$ where $x$ is hours and $y$ is km.) Find the rule. What does $b$ mean here, physically?\n\n---\n\n**Answers:**  1. Equations: $650 = 2a + b$, $1250 = 5a + b$. $a = 200$, $b = 250$. Rule: $y = 200x + 250$. Call-out fee = ₹$250$.  2. $180 = 3a + b$, $430 = 8a + b$. $a = 50$, $b = 30$. Rule: $y = 50x + 30$. Per-day rental = ₹$50$.  3. $220 = 4a + b$, $340 = 10a + b$. $a = 20$, $b = 140$. Rule: $y = 20x + 140$. Fixed fee = ₹$140$.  4. $650 = 3a + b$, $1150 = 7a + b$. $a = 125$, $b = 275$. Rule: $y = 125x + 275$. Card fee = ₹$275$.  5. $15000 = 20a + b$, $18000 = 32a + b$. $a = 250$, $b = 10{,}000$. Rule: $y = 250x + 10000$. Base salary = ₹$10{,}000$.  6. $130 = 2a + b$, $280 = 5a + b$. $a = 50$, $b = 30$. Rule: $y = 50x + 30$. Here $b = 30$ km is the *distance already covered when the recording started* — i.e., the car was already $30$ km along the road at hour zero."
  },
  { id: uid(), type: 'inline_quiz', order: 12, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "A linear rule $y = ax + b$ passes through $(2, 14)$ and $(6, 38)$. **Find $a$.**",
        options: ["$3$", "$5$", "$6$", "$8$"], correct_index: 2,
        explanation: "Two equations: $14 = 2a + b$ and $38 = 6a + b$. Subtract: $24 = 4a \\Rightarrow a = 6$.",
        reasoning_level: 1 },
      { id: uid(), question: "A learning platform charges $y = ax + b$ rupees for $x$ modules. If $5$ modules cost ₹$300$ and $9$ modules cost ₹$420$, **what is the per-module charge $a$?**",
        options: ["₹15", "₹25", "₹30", "₹40"], correct_index: 2,
        explanation: "$300 = 5a + b$ and $420 = 9a + b$. Subtract: $120 = 4a \\Rightarrow a = 30$. Per-module charge = ₹$30$.",
        reasoning_level: 2 },
      { id: uid(), question: "Using the conversion rule $\\degree\\text{C} = \\tfrac{5}{9}(\\degree\\text{F} - 32)$, **what is $98.6\\degree$F (a healthy body temperature) in Celsius?**",
        options: ["$36\\degree$C", "$37\\degree$C", "$38\\degree$C", "$40\\degree$C"], correct_index: 1,
        explanation: "$\\degree\\text{C} = \\tfrac{5}{9}(98.6 - 32) = \\tfrac{5}{9}(66.6) = 37$. So $98.6\\degree\\text{F} = 37\\degree\\text{C}$ — exactly the body temperature you read on a Celsius thermometer.",
        reasoning_level: 2 },
      { id: uid(), question: "A gym's bill rule turns out to be $y = 60x + 200$, where $x$ is hours of court use. **Two students, A and B, both used the court this month. A's bill was ₹$680$ and B's bill was ₹$1{,}040$. How many *more hours* did B use the court compared to A?**",
        options: [
          "$4$ hours",
          "$6$ hours",
          "$8$ hours",
          "$10$ hours"
        ],
        correct_index: 1,
        explanation: "Find each student's hours by solving $60x + 200 = $ bill. A: $60x_A + 200 = 680 \\Rightarrow x_A = 8$. B: $60x_B + 200 = 1040 \\Rightarrow x_B = 14$. Difference: $14 - 8 = 6$ hours. **A faster way (no need to find $x_A, x_B$ separately):** the difference in bills is $1040 - 680 = 360$, and each extra hour costs ₹$60$. So extra hours = $360 \\div 60 = 6$. The fixed fee $b = 200$ cancels out when you take the difference — only $a$ matters.",
        reasoning_level: 4 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Three Real-World Lines (NCERT Exercise Set 2.5)',
  subtitle: 'A learning app, a badminton court, and the Celsius–Fahrenheit scales — three different stories solved by one shared 5-step routine',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-relationship', 'two-point-method', 'NCERT-Ex-Set-2.5', 'celsius-fahrenheit', 'practice'],
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
