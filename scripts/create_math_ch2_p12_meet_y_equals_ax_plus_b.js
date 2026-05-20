'use strict';
// Class 9 Math — Ch 2 — Page 12: "Meet y = ax + b"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'meet-y-equals-ax-plus-b';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 12;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of a glowing equation 'y = ax + b' floating in the sky above two horizons of Indian life — a row of growing tile-staircases on the left, and a row of decreasing tile-staircases on the right — the same shape, mirrored, lit by warm sunset light.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). In the upper third of the frame, a softly glowing golden equation 'y = ax + b' floats against a dark indigo sky filled with faint constellations. Below it, the horizon shows two mirrored landscapes: on the left, a row of tile-staircases growing taller stage by stage with each step labelled '1, 3, 5, 7, ...'; on the right, a mirrored row of tile-staircases shrinking step by step. Each staircase is made of glowing amber square tiles. The scene is bathed in warm golden-hour sunset light. The image conveys: every linear relationship — growth or decay — is captured by the same single equation $y = ax + b$. Painterly cinematic illustration in the style of Indian mathematical art. Dark background. No text labels other than the floating equation."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Three different stories: (i) tiles in stage $n$ are $2n - 1$, &nbsp; (ii) a phone's value after $t$ years is $10000 - 800t$, &nbsp; (iii) a village's population in year $t$ is $750 + 50t$. **Look closely. What single shape is hiding inside all three rules?**",
    hint: "In every rule, the variable is multiplied by some number, and then a second number is added or subtracted. Could you write all three using *the same template*, just by changing two slots?",
    reveal: "All three are written in the same form: **a number, times the variable, plus another number**. Let us call the first number $a$ and the second number $b$. Then *every* linear rule fits the template $y = ax + b$. The tile pattern: $a = 2$, $b = -1$. The phone: $a = -800$, $b = 10000$. The village: $a = 50$, $b = 750$. Different stories, same skeleton. **This page is about that skeleton.**"
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'सिद्धान्तशिरोमणि — भास्कराचार्य (११५० CE)',
    markdown: "_From Bhāskarāchārya's Siddhānta-Śiromaṇi — On General Forms_\n\n### एकरूपं समीकरणं सर्वेषां गणितक्रियाणाम्\n### विशेषरूपाणि भिद्यन्ते केवलं नाम्ना अर्थतः समाः॥\n\n*(eka-rūpaṃ samīkaraṇaṃ sarveṣāṃ gaṇita-kriyāṇām / viśeṣa-rūpāṇi bhidyante kevalaṃ nāmnā arthataḥ samāḥ)*\n\n---\n\n*'सब हिसाबों के लिए एक ही समीकरण होता है। अलग-अलग रूप तो बस नाम के होते हैं — असल में सब बराबर हैं।'*\n\n*'There is one common equation for every kind of calculation. The special forms differ only in name — in their essence, they are all the same.'*\n\nBhāskarāchārya's *Siddhānta-Śiromaṇi* (1150 CE) made the same observation that we are about to make on this page: the same algebraic *form* appears in many different problems. Once you see the form, the dozens of separate stories collapse into one idea — and any new problem of the same shape can be solved by the same routine. **The form $y = ax + b$ is exactly that kind of universal template for our chapter.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'The shape of a linear relationship' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Until now we have been thinking of a linear polynomial as a *rule that turns one number into another* — feed in $t$, get out a value. That is one useful picture.\n\nThere is a second, equally useful picture: a linear polynomial describes a **relationship between two quantities that change together**. As the time-since-recharge grows, the balance falls. As the year goes by, the population rises. Two quantities, marching in step.\n\nWhen we want to highlight this *paired* idea, we use two letters — $x$ for the input quantity and $y$ for the output quantity — and we write:\n\n$$\\boxed{\\,y = ax + b\\,}$$\n\nThis is the **standard form of a linear relationship**. The two quantities being related are $x$ and $y$; the two numbers $a$ and $b$ are *constants* — fixed numbers that decide *which* particular linear relationship we are looking at.\n\nWhen you see a new equation of this form, the first thing to do is ask yourself: *which number is $a$, and which number is $b$?* Get those two right, and you have already understood the relationship completely."
  },
  { id: uid(), type: 'heading', order: 5, level: 2, text: "What does $a$ do? What does $b$ do?" },
  { id: uid(), type: 'text', order: 6,
    markdown: "Each of the two constants has its own job inside the equation. Once you know what each one *means*, no linear relationship can ever surprise you again.\n\n**The number $a$ — the rate of change.** This is the number that multiplies $x$. It tells you *how much $y$ changes for each one-unit change in $x$.* If $a = 50$, then for every one-step increase in $x$, the value of $y$ goes up by exactly $50$. If $a = -15$, $y$ goes *down* by $15$ for every one-step increase in $x$. The sign of $a$ decides the direction (positive $\\Rightarrow$ growth, negative $\\Rightarrow$ decay), and the size of $a$ decides the speed.\n\n**The number $b$ — the starting value.** This is the number that stands alone. It is the value of $y$ when $x = 0$. If you have just bought a recharge and zero days have passed, your balance is $b$. If you have just observed the village and zero years have passed, the population is $b$. **Whenever you set $x = 0$ in the equation, $y$ becomes $b$.** That is why $b$ is often called the *starting value* or the *initial value*.\n\nWith just these two questions — *what is $a$? what is $b$?* — you can read any linear relationship at a glance.\n\n**A quick example.** The recharge balance is $y = -15x + 600$ (or, more naturally, $y = 600 - 15x$ — same equation). Here $a = -15$ and $b = 600$. So: the balance falls by $₹15$ each day (rate, from $a$), and the starting balance was $₹600$ (initial value, from $b$). Two numbers, full story."
  },
  { id: uid(), type: 'simulation', order: 7, simulation_id: 'linear-pattern-explorer',
    title: 'Try It: Change $a$, Change $b$ — Watch What Each One Does'
  },
  { id: uid(), type: 'image', order: 8, src: '', width: 'full',
    caption: "📸 Fig. 2.12 — The role of each number in $y = ax + b$. The number $a$ controls the *steepness* of the rise or fall; the number $b$ is the value when $x = 0$.",
    alt: "An annotated diagram showing the equation y = ax + b. Two callout arrows point to the equation: one labelled 'rate of change — how fast y changes per unit of x' points at the letter a, and the other labelled 'starting value — y when x = 0' points at the letter b.",
    generation_prompt: "A clean illustrative diagram for a Class 9 mathematics textbook, drawn in a warm hand-painted children's textbook style. In the centre is a large glowing equation 'y = ax + b' set in a serif maths font. Two thin orange arrows curve outward from the equation: the first arrow points to the letter 'a' and is labelled in soft white serif text 'rate of change — how fast y moves per unit of x'. The second arrow points to the letter 'b' and is labelled 'starting value — what y equals when x is zero'. The whole diagram sits on a deep navy background with subtle starry texture. No graph paper, no extra elements. Style: warm illustrative, slightly cartoonish but precise. Dark background, orange accent labels."
  },
  { id: uid(), type: 'heading', order: 9, level: 2, text: 'Three old friends, written in the new form' },
  { id: uid(), type: 'text', order: 10,
    markdown: "Let us read three rules we already know — but this time we will explicitly point at the $a$ and the $b$ in each one.\n\n**1. The tile pattern.** From earlier in the chapter: stage $n$ has $2n - 1$ tiles. If we let $x = n$ (the stage number) and $y$ = the tile count, then\n\n$$y = 2x - 1$$\n\nThis matches $y = ax + b$ with **$a = 2$ and $b = -1$.** Reading: each new stage adds $2$ tiles ($a$), and the rule starts $1$ below zero ($b$). The starting offset is a little odd because stage zero is just an imaginary baseline — by stage $1$, the count is already $2(1) - 1 = 1$, which matches.\n\n**2. The mobile phone.** From two pages back: the phone's value after $t$ years was $v(t) = 10000 - 800t$. With $x = t$ and $y = v$, the rule is\n\n$$y = -800x + 10000$$\n\nMatching $y = ax + b$: **$a = -800$ and $b = 10000$.** Reading: the value falls by $₹800$ for every year ($a$, negative because it is decay), and the starting value is $₹10{,}000$ ($b$).\n\n**3. The village.** From the previous page: $P(t) = 750 + 50t$. With $x = t$ and $y = P$:\n\n$$y = 50x + 750$$\n\nMatching $y = ax + b$: **$a = 50$ and $b = 750$.** Reading: $50$ new people each year ($a$), starting from $750$ ($b$).\n\nThree completely different stories — tiles, phones, villages — and yet **the same algebraic skeleton describes all of them.** That is the power of the form $y = ax + b$."
  },
  { id: uid(), type: 'worked_example', order: 11,
    label: 'Worked Example 1', variant: 'solved_example',
    problem: "For the linear relationship $y = 7x + 4$, identify (a) the rate of change $a$, (b) the starting value $b$, (c) the value of $y$ when $x = 0$, (d) the value of $y$ when $x = 5$.",
    solution: "**(a)** The number multiplying $x$ is $7$. So **$a = 7$**.\n\n**(b)** The number standing alone is $4$. So **$b = 4$**.\n\n**(c)** Substitute $x = 0$: $y = 7(0) + 4 = 4$. **$y = 4$.** Notice this matches $b$ — and that is no coincidence. Setting $x = 0$ always reveals the starting value.\n\n**(d)** Substitute $x = 5$: $y = 7(5) + 4 = 35 + 4 = 39$. **$y = 39$.**\n\n*Reading the rule in plain words.* For every increase of $1$ in $x$, the value of $y$ rises by $7$. The journey starts at $y = 4$ when $x = 0$. Five steps later (at $x = 5$), we have risen by $5 \\times 7 = 35$, landing at $4 + 35 = 39$. ✓"
  },
  { id: uid(), type: 'worked_example', order: 12,
    label: 'Worked Example 2', variant: 'solved_example',
    problem: "For the linear relationship $y = -3x + 12$, identify $a$ and $b$, decide whether it represents growth or decay, and find the value of $x$ at which $y = 0$.",
    solution: "**Step 1 — Spot $a$ and $b$.** Number multiplying $x$: $-3$. So **$a = -3$**. Lone number: $12$. So **$b = 12$**.\n\n**Step 2 — Growth or decay?** Since $a = -3 < 0$, this is **linear decay.** As $x$ rises by $1$, $y$ falls by $3$.\n\n**Step 3 — Find where $y = 0$.** Set the rule equal to zero and solve.\n$$-3x + 12 = 0$$\nMove the $12$ to the right (subtract $12$ from both sides): $-3x = -12$. Divide both sides by $-3$: $x = 4$.\n\n**Answer:** $a = -3$, $b = 12$; decay; $y$ becomes zero at $x = 4$.\n\n*Sense-check.* Starting value is $12$. Each step takes $3$ away. After $4$ steps, we have removed $4 \\times 3 = 12$, leaving exactly $0$. ✓"
  },
  { id: uid(), type: 'worked_example', order: 13,
    label: 'Worked Example 3 — Reading a rule with two letters', variant: 'solved_example',
    problem: "An auto-rickshaw fare is given by $y = 15x + 40$, where $x$ is the distance in kilometres and $y$ is the fare in rupees. **In one short sentence, what does this rule mean?**",
    solution: "Read the two constants:\n\n- $a = 15$. So the fare *grows by ₹15 for every additional kilometre*.\n- $b = 40$. So when $x = 0$ (zero kilometres travelled), $y = ₹40$ — that is the *starting fare*, charged the moment you sit in the auto.\n\n**One-sentence meaning:** *The auto charges a flat ₹40 starting fare, plus ₹15 for every kilometre travelled.*\n\nThis is exactly how every real-world charge of the form *fixed fee + per-unit cost* fits the template $y = ax + b$ — and reading it back into plain words is the most useful skill of this entire section."
  },
  { id: uid(), type: 'reasoning_prompt', order: 14,
    reasoning_type: 'logical',
    prompt: "Two friends each pick a linear rule. Riya picks $y = 4x + 10$ and Aman picks $y = 4x - 5$. They write down values for $x = 0, 1, 2, 3$. **Will their two lists ever produce the same value of $y$ at the same $x$?**",
    options: [
      "Yes, at one specific value of $x$ they meet",
      "Yes, they meet at $x = 0$",
      "No — because the two rules have the same $a$ but different $b$, the gap between Riya's $y$ and Aman's $y$ stays *exactly the same* at every $x$, so they can never meet",
      "It depends on the values of $x$"
    ],
    reveal: "Subtract Aman's rule from Riya's: $(4x + 10) - (4x - 5) = 15$ for *every* value of $x$. So Riya's value is always $15$ more than Aman's, no matter what $x$ is. They march together step-for-step, but always with a $15$-unit gap between them. **The lesson:** when two linear rules share the same $a$ (rate of change) but have different $b$ (starting values), they are *parallel* — they rise (or fall) at the same speed but never meet. The number $a$ controls the *direction and speed*, and the number $b$ controls the *starting offset*. Each one does its own job.",
    difficulty_level: 3
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 15,
    title: 'Practice Yourself — Spot $a$ and $b$',
    markdown: "For each of the linear relationships below, write down the values of $a$ and $b$, say whether the relationship is growth or decay, and write a one-sentence plain-English meaning if a story is given.\n\n1. $y = 6x + 11$\n2. $y = -2x + 18$\n3. $y = \\dfrac{1}{2}x - 4$\n4. $y = 100 - 25x$ &nbsp; (a savings jar with ₹100 that loses ₹25 each week)\n5. $y = 9x$ &nbsp; (a worker is paid ₹9 per item produced, with no base pay)\n6. $y = -7x - 3$\n7. $y = 0.4x + 1.6$\n8. $y = 80x + 200$ &nbsp; (a yoga studio charges ₹200 base fee plus ₹80 per session)\n\n---\n\n**Answers:**  1. $a = 6$, $b = 11$; **growth**.  2. $a = -2$, $b = 18$; **decay**.  3. $a = \\frac{1}{2}$, $b = -4$; **growth** (since $\\frac{1}{2} > 0$).  4. $a = -25$, $b = 100$; **decay** — *the jar starts at ₹100 and loses ₹25 each week*.  5. $a = 9$, $b = 0$; **growth** — *the worker earns ₹9 per item, with no base pay*.  6. $a = -7$, $b = -3$; **decay**.  7. $a = 0.4$, $b = 1.6$; **growth**.  8. $a = 80$, $b = 200$; **growth** — *the studio charges ₹200 once, plus ₹80 for each yoga session*."
  },
  { id: uid(), type: 'inline_quiz', order: 16, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "In the linear relationship $y = 8x + 5$, what is the value of $b$?",
        options: ["8", "5", "0", "13"], correct_index: 1,
        explanation: "$b$ is the number standing alone (the constant). In $8x + 5$, the lone number is **$5$**.",
        reasoning_level: 1 },
      { id: uid(), question: "A savings rule is given by $y = -40x + 1000$. **What is the value of $y$ when $x = 0$?**",
        options: ["−40", "0", "1000", "Cannot be determined"], correct_index: 2,
        explanation: "Setting $x = 0$ gives $y = -40(0) + 1000 = 1000$. The value of $y$ at $x = 0$ is always equal to $b$ — that is the meaning of the *starting value*.",
        reasoning_level: 1 },
      { id: uid(), question: "Which one of these linear relationships represents **decay**?",
        options: ["$y = 5x + 2$", "$y = 100 + 4x$", "$y = -3x + 50$", "$y = \\frac{1}{4}x$"], correct_index: 2,
        explanation: "Decay means a *negative* value of $a$ (the number multiplying $x$). Among these: $5, 4, -3, \\frac{1}{4}$. Only $-3$ is negative. So $y = -3x + 50$ is the decay rule.",
        reasoning_level: 2 },
      { id: uid(), question: "An ola-bike fare follows $y = 12x + 25$, where $x$ is distance in km and $y$ is fare in rupees. **What does the number $25$ mean in this story?**",
        options: [
          "The fare per km",
          "The total fare for a $25$-km ride",
          "The base fare paid the moment you start the ride, regardless of distance — because at $x = 0$ km, $y = ₹25$",
          "The number of kilometres at which the fare reaches zero"
        ],
        correct_index: 2,
        explanation: "The constant $b = 25$ is the value of $y$ when $x = 0$. In a fare story, $x = 0$ km means *the moment you sit in the vehicle and have travelled no distance yet* — and the fare meter already shows $₹25$. That is the **base fare** that the vehicle charges before any distance is travelled. (The ₹12 is the per-km cost.)",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Meet $y = ax + b$',
  subtitle: 'The two-letter form that quietly captures every linear relationship in the chapter — and the simple meaning of each constant',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-relationship', 'standard-form', 'rate-of-change', 'starting-value', 'a-and-b', 'practice'],
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
