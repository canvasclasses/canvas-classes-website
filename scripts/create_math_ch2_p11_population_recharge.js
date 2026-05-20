'use strict';
// Class 9 Math — Ch 2 — Page 11: "Population Tables & Telecom Recharge"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'population-tables-and-telecom-recharge';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 11;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic split scene: on the left, a small Indian village square with rows of tidy houses and people walking; on the right, a hand holding a smartphone with a glowing recharge balance counter slowly ticking down. Both halves bathed in warm golden-hour light.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio), softly split into two halves by a thin vertical line of light. Left half: a small North Indian village square at golden hour — terracotta-roofed houses, a few fruit-sellers, kids playing, an old peepal tree casting long shadows. Tiny upward-pointing arrows hover faintly above to suggest steady population growth. Right half: a close-up of a hand holding a modern smartphone screen-up; the screen shows a glowing prepaid balance counter '₹600 → ₹585 → ₹570 …' fading downward, with small downward-pointing arrows. Both halves share the same warm golden sunset light. The image conveys: two stories, one rule — *something changes by the same amount in equal time*. Painterly cinematic illustration. Dark background. No text labels other than the rupee numbers on the phone."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "A village adds **50 new people every year**. A prepaid recharge **loses ₹15 every day**. **If you wrote down the population each year, or the balance each day, what kind of pattern would you see in the numbers?**",
    hint: "Try the village: start at 750, add 50, add 50, add 50… Then try the recharge: start at ₹600, subtract 15, subtract 15, subtract 15… What stays *exactly the same* between every pair of consecutive numbers?",
    reveal: "In both lists, the **gap between any two neighbouring numbers is the same** — 50 in the village list, 15 in the balance list. That fixed gap is the heart of every linear pattern. On this page we'll write out these two real NCERT problems as full tables, find the day the balance hits zero, and check that the linear-decay rule never fails us along the way."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'A Subhāṣita on Daily Habits',
    markdown: "_From the Subhāṣita-Ratna-Bhāṇḍāgāra — On Steady Effort_\n\n### बिन्दुशः पूर्यते कुम्भः धीरे धीरे महार्णवः\n### तथैव विद्या धर्मश्च क्रमेणैव प्रवर्धते॥\n\n*(bindu-śaḥ pūryate kumbhaḥ dhīre dhīre mahārṇavaḥ / tathaiva vidyā dharmaś ca krameṇaiva pravardhate)*\n\n---\n\n*'घड़ा बूँद-बूँद से भरता है, समुद्र भी धीरे-धीरे बनता है। उसी तरह विद्या और धर्म भी थोड़े-थोड़े करके बढ़ते हैं।'*\n\n*'A pot fills drop by drop; even the great ocean grows slowly. In the same way, knowledge and goodness grow only step by step.'*\n\nThis verse is exactly the spirit of a linear pattern — *the same small amount, added again and again, becomes something large over time.* A village gains 50 people each year and slowly grows into a town. A recharge loses ₹15 each day and silently runs out. **The ancient Indian poets noticed this rhythm long before algebra named it.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'Part 1 — The village population year by year' },
  { id: uid(), type: 'text', order: 4,
    markdown: "On the previous page, we already met the village. Its starting population is $750$, and **every year, $50$ new people move in from a nearby city.** We wrote down the rule:\n\n$$P(t) = 750 + 50t$$\n\nHere $t$ stands for *the number of years since today*, and $P(t)$ is the population at that moment.\n\n**Why is this called a *linear* rule?** Because the variable $t$ appears with the simplest possible power — power $1$ — and nothing more complicated. No $t^2$, no $\\sqrt{t}$, no $1/t$. Just $50t$ added to a constant. That is the *exact* shape of every linear polynomial: a number times the variable, plus another number.\n\nLet's do something the formula alone can't do — let's *see* the population grow, year by year, in a table."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'growth-decay-visualizer',
    title: 'Try It: Watch the Village Grow and the Balance Drop'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'Q3 (ii) — Population table for 0–10 years (NCERT Ex Set 2.4)', variant: 'ncert_intext',
    problem: "Make a **table** of the population $P$ for values of $t$ from $0$ to $10$ years. Show how the population changes each year.",
    solution: "Apply the rule $P(t) = 750 + 50t$ for each value of $t$:\n\n| $t$ (years) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n| $P$ (people) | 750 | 800 | 850 | 900 | 950 | 1000 | 1050 | 1100 | 1150 | 1200 | 1250 |\n\n**Look at the gap between any two neighbouring numbers** — it is always exactly $50$. That gap is not a coincidence. It is the leading coefficient of our rule, and it tells us the *speed of change*: the village adds $50$ people for every $1$ year that passes. **No year is faster, no year is slower.** That steady, equal-step rhythm is the visible fingerprint of every linear relationship."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'Q3 (iii) — Why is this linear growth? (NCERT Ex Set 2.4)', variant: 'ncert_intext',
    problem: "Find an expression that links the population $P$ and the time $t$, and explain why it represents **linear growth**.",
    solution: "**Expression:** $P(t) = 750 + 50t$.\n\n**Why this is *linear*:** The variable $t$ appears with power $1$ only. There are no $t^2$ or higher terms. So $P(t)$ is a polynomial of degree $1$ — a *linear* polynomial.\n\n**Why this is *growth* (not decay):** The leading coefficient is $+50$, which is **positive**. A positive leading coefficient means the population *increases* with each unit increase of $t$. We call any rule of the form $f(t) = at + b$ with $a > 0$ a **linear growth** rule.\n\n*A simple test you can apply to any rule:* if the variable's power is $1$ **and** the leading coefficient is positive, you have linear growth. If the power is $1$ but the leading coefficient is negative, you have linear decay. We will use that test again in Part 2 below."
  },
  { id: uid(), type: 'heading', order: 8, level: 2, text: 'Part 2 — The recharge balance day by day' },
  { id: uid(), type: 'text', order: 9,
    markdown: "Now for the second story. A telecom company sells a recharge for **₹600**, and the **prepaid balance reduces by ₹15 each day** until it runs out.\n\nLet $x$ be the number of days since the recharge, and let $b(x)$ be the balance left at that moment. The starting balance is $₹600$, and each day takes away $₹15$. So:\n\n$$b(x) = 600 - 15x \\text{ rupees}$$\n\nNotice the **minus sign** in front of the $15x$. This single sign is the only difference between a growth story and a decay story. The variable $x$ still appears with power $1$ — so this is still linear — but because the leading coefficient is $-15$ (a negative number), the balance *falls* instead of rises. Same algebra, opposite direction.\n\nWith the rule in hand, two natural questions appear:\n- **When does the balance run out?** That is, for what value of $x$ does $b(x)$ become zero?\n- **What does the balance look like over the first ten days?** Let us answer both."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Q4 (i) — Set up and classify (NCERT Ex Set 2.4, Q4)', variant: 'ncert_intext',
    problem: "A telecom company charges **₹600** for a recharge scheme. The prepaid balance reduces by **₹15 each day** after the recharge. Write an equation for the remaining balance $b(x)$ after $x$ days. Explain why it represents **linear decay**.",
    solution: "**Equation:**\n\n$$b(x) = 600 - 15x$$\n\nThe constant term $600$ is the starting balance — the amount on day zero, before a single day has passed. The coefficient $-15$ is what each day subtracts from that starting amount.\n\n**Why this is *linear*:** $x$ has power $1$ and nothing higher.\n\n**Why this is *decay* (not growth):** The leading coefficient is $-15$, a **negative** number. A negative leading coefficient means that as $x$ increases, $b(x)$ goes *down*. That is the defining feature of linear decay. (The same rule we wrote in the box above: $a < 0 \\Rightarrow$ linear decay.)"
  },
  { id: uid(), type: 'worked_example', order: 11,
    label: 'Q4 (ii) — When does the balance run out? (NCERT)', variant: 'ncert_intext',
    problem: "After **how many days** will the prepaid balance run out completely?",
    solution: "*Running out* means the balance reaches zero. So we need the value of $x$ that makes $b(x) = 0$.\n\n**Step 1 — Set up the equation.**\n\n$$600 - 15x = 0$$\n\n**Step 2 — Move $15x$ to the other side.** Add $15x$ to both sides:\n\n$$600 = 15x$$\n\n**Step 3 — Divide both sides by $15$.**\n\n$$x = \\frac{600}{15} = 40$$\n\n**Answer:** The balance runs out on **day 40**.\n\n*Quick sense-check.* Forty days $\\times$ ₹15 per day $= ₹600$ — exactly the starting amount. So day 40 is correct."
  },
  { id: uid(), type: 'worked_example', order: 12,
    label: 'Q4 (iii) — Balance table for the first 10 days (NCERT)', variant: 'ncert_intext',
    problem: "Make a **table** of the balance $b(x)$ for values of $x$ from $1$ to $10$ days, and show how the balance reduces day by day.",
    solution: "Apply $b(x) = 600 - 15x$ for each value of $x$:\n\n| $x$ (days) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n|---|---|---|---|---|---|---|---|---|---|---|\n| $b(x)$ (₹) | 585 | 570 | 555 | 540 | 525 | 510 | 495 | 480 | 465 | 450 |\n\n**Look at the gap between any two neighbouring values** — it is always exactly $-15$ (i.e. each day's balance is $15$ less than the previous day's). That fixed *negative* step is the visible fingerprint of linear decay, exactly the way the $+50$ step was the fingerprint of growth in Part 1.\n\n*One small observation.* On day $40$ the balance becomes $0$. From day $41$ onwards, the *formula* gives a negative number — but a real recharge cannot go below zero. So the formula is only meaningful for $0 \\le x \\le 40$. This is the same lesson we met at the bottom of the previous page: **every linear model has a domain where it makes sense, and outside that domain it stops describing reality.**"
  },
  { id: uid(), type: 'reasoning_prompt', order: 13,
    reasoning_type: 'logical',
    prompt: "Look at the *first differences* in each table — that is, what you get by subtracting each value from the next. The village table gives $+50, +50, +50, \\ldots$ The recharge table gives $-15, -15, -15, \\ldots$ **What does this tell us about every linear rule of the form $f(t) = at + b$, no matter what $a$ and $b$ are?**",
    options: [
      "The first differences are always positive",
      "The first differences are always equal to each other, and equal to the leading coefficient $a$ — so the *constant first difference* is the test for linearity. If a table's first differences are *not* the same value, the underlying rule is not linear.",
      "The first differences keep getting bigger over time",
      "The first differences depend on the constant term $b$"
    ],
    reveal: "Whenever you compute $f(t+1) - f(t)$ for a linear rule $f(t) = at + b$, the constant $b$ cancels out and the result is just $a$. So **every step of size $1$ in $t$ produces a step of size $a$ in $f(t)$, no matter what $t$ you started from.** That is why the first differences in the village table are all $+50$ and in the balance table are all $-15$. **This is also a quick test you can run on any table given to you:** compute the first differences. If they are all the same number, the data is linear and that number is your leading coefficient $a$. If they vary, the relation is not linear.",
    difficulty_level: 3
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 14,
    title: 'Practice Yourself — Tables and End-Points',
    markdown: "For each scenario, (a) write the linear rule, (b) say whether it is growth or decay, (c) make a small table for the first $5$ steps, and (d) find the value where the rule reaches zero (if it ever does).\n\n1. **Library book pile** — a librarian starts with $200$ books to shelve and shelves $25$ each hour.\n2. **School fund** — a school's PTA fund starts at ₹$1{,}500$ and grows by ₹$300$ each week.\n3. **Petrol in a generator** — starts at $40$ litres, burns $4$ litres per hour of running.\n4. **Newspaper subscriber count** — a town newspaper starts with $4{,}000$ subscribers and gains $80$ new ones every month.\n5. **Mountain snow depth in spring** — starts at $90$ cm and melts at $6$ cm per day.\n6. **Auto-rickshaw odometer** — reads $52{,}000$ km today, the driver covers $90$ km per day.\n\n---\n\n**Answers:**  1. $B(h) = 200 - 25h$, *decay*; first 5 hours: $175, 150, 125, 100, 75$; reaches zero at $h = 8$ hr.  2. $F(w) = 1500 + 300w$, *growth*; first 5 weeks: $1800, 2100, 2400, 2700, 3000$; never reaches zero — only grows.  3. $P(h) = 40 - 4h$, *decay*; first 5 hours: $36, 32, 28, 24, 20$; reaches zero at $h = 10$ hr.  4. $S(m) = 4000 + 80m$, *growth*; first 5 months: $4080, 4160, 4240, 4320, 4400$; never reaches zero.  5. $D(d) = 90 - 6d$, *decay*; first 5 days: $84, 78, 72, 66, 60$; reaches zero at $d = 15$ days.  6. $K(d) = 52000 + 90d$, *growth*; first 5 days: $52090, 52180, 52270, 52360, 52450$; never reaches zero — odometers only go up."
  },
  { id: uid(), type: 'inline_quiz', order: 15, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "A village population follows $P(t) = 750 + 50t$. **What is the population in year $t = 10$?**",
        options: ["1{,}050", "1{,}100", "1{,}250", "1{,}500"], correct_index: 2,
        explanation: "$P(10) = 750 + 50 \\times 10 = 750 + 500 = 1{,}250$.",
        reasoning_level: 1 },
      { id: uid(), question: "A recharge balance follows $b(x) = 600 - 15x$. **What is the balance after $5$ days?**",
        options: ["₹525", "₹540", "₹555", "₹575"], correct_index: 0,
        explanation: "$b(5) = 600 - 15 \\times 5 = 600 - 75 = ₹525$.",
        reasoning_level: 1 },
      { id: uid(), question: "A recharge starts at **₹450** and loses **₹18** per day. **On which day does the balance reach zero?**",
        options: ["Day 20", "Day 25", "Day 30", "Day 36"], correct_index: 1,
        explanation: "Set $450 - 18x = 0 \\Rightarrow 18x = 450 \\Rightarrow x = 25$. The balance reaches zero on **day 25**. (Quick check: $25 \\times 18 = 450$.)",
        reasoning_level: 2 },
      { id: uid(), question: "Someone hands you the table $\\{12, 19, 26, 33, 40\\}$ for $x = 1, 2, 3, 4, 5$. **Is this a linear rule, and if yes, what is its leading coefficient?**",
        options: [
          "Not linear",
          "Linear with leading coefficient $5$",
          "Linear with leading coefficient $7$ — the first differences are all $+7$, so the rule is $f(x) = 7x + 5$",
          "Linear with leading coefficient $12$"
        ],
        correct_index: 2,
        explanation: "Compute the first differences: $19 - 12 = 7$, $26 - 19 = 7$, $33 - 26 = 7$, $40 - 33 = 7$. All equal — so yes, linear, and the step is $+7$. To find the constant, work backwards: at $x = 1$ the value is $12$, so $f(x) = 7x + b$ with $7(1) + b = 12 \\Rightarrow b = 5$. The rule is $f(x) = 7x + 5$.",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Population Tables & Telecom Recharge',
  subtitle: 'Two real NCERT stories of constant change — one growing, one shrinking — both told end-to-end with full tables and the day the balance hits zero',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-growth', 'linear-decay', 'tables', 'first-differences', 'NCERT-Ex-Set-2.4', 'practice'],
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
