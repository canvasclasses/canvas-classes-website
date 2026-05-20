'use strict';
// Class 9 Math — Ch 2 — Page 9: "Linear Growth & Linear Decay"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'linear-growth-and-linear-decay';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 9;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic split image — on the left, a small green plant grows steadily upwards in a clay pot, with faint upward arrows showing its progress; on the right, a tall lit candle slowly melts down into a shorter stub, with faint downward arrows showing its decline',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio) split into two halves with a soft vertical divider. Left half: a small bright green plant in a brown clay pot, growing upward with several leaves and a tall central stem; faint glowing upward arrows trace its growth alongside a vertical scale labelled '0, 1, 2, 3' (months). Right half: a tall white candle on a brass holder, half-melted, its flame burning brightly; wax pools at its base; faint glowing downward arrows trace the descending wax line alongside a vertical scale labelled '0, 1, 2, 3' (months). Both halves share the same warm twilight ambient lighting. The image conveys: linear growth and linear decay are the same algebra running in opposite directions. Painterly cinematic illustration. Dark background. No additional text labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "A village adds **50 people every year**. A mobile phone loses **₹800 in value every year**. **Both change by a constant per year.** So why does one feel like 'growth' and the other like 'loss'?",
    hint: "Look at the *sign* of the per-year change. What's different between $+50$ and $-800$?",
    reveal: "Both are **linear** patterns — the per-step change is constant in each. The difference is the **sign** of that constant. **Positive** per-step change ⇒ **linear growth**. **Negative** per-step change ⇒ **linear decay**. They're the same algebra; the sign of the leading coefficient changes the *story*."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'ब्रह्मस्फुटसिद्धान्त — ब्रह्मगुप्त (६२८ CE)',
    markdown: "_From Brahmagupta's Brahmasphuṭa-siddhānta — Dhana and Ṛṇa_\n\n### धनयोः धनं भवति ऋणयोः ऋणम् एव हि\n### ऋण-धन-योगे शून्यं — एवं संख्याः गण्यन्ते॥\n\n*(dhanayoḥ dhanaṃ bhavati ṛṇayoḥ ṛṇam eva hi / ṛṇa-dhana-yoge śūnyaṃ — evaṃ saṃkhyāḥ gaṇyante)*\n\n---\n\n*'दो धन (positive) मिलाने पर धन ही मिलता है। दो ऋण (negative) मिलाने पर ऋण मिलता है। बराबर के धन-ऋण को जोड़ दो — तो शून्य बनता है। संख्याओं का यही नियम है।'*\n\n*'Two positives (dhana) added give a positive. Two negatives (ṛṇa) added give a negative. Equal positive and negative cancel into zero. This is the law of numbers.'*\n\nIn 628 CE, Brahmagupta did something revolutionary: he treated **negative numbers as full citizens of mathematics** — and named them after *debt* (ṛṇa, ऋण), in contrast to *wealth* (dhana, धन). On this page, *positive* leading coefficient $a > 0$ is **dhana** — wealth, growth. *Negative* $a < 0$ is **ṛṇa** — debt, decay. **The Sanskrit terminology is exactly the modern terminology of growth and decay.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'Linear growth — Example 9 (NCERT cost-of-journey)' },
  { id: uid(), type: 'text', order: 4,
    markdown: "**Linear expressions model situations where a quantity increases (grows) or decreases (decays) by a constant amount per unit time.**\n\nConsider the linear function for the cost of a journey:\n\n$$C(d) = 100 + 60d$$\n\nwhere $C$ is the cost in rupees and $d$ is the distance in kilometres.\n\n| $d$ (km) | 0 | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|---|\n| $C$ (₹) | 100 | 160 | 220 | 280 | 340 | 400 |\n\nFor every 1 km increase in $d$, the cost $C$ rises by exactly **₹60**. **This is the per-step rule of every linear polynomial — the leading coefficient is the per-step change.** Because $a = +60 > 0$, this is **linear growth**.\n\nA real-world image of this: a taxi meter ticking up steadily as the car covers ground."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'growth-decay-visualizer',
    title: 'Try It: Watch Growth or Decay Animate Step by Step'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'Worked Example 1 — Cost for 15 km (NCERT Think-Reflect)', variant: 'ncert_intext',
    problem: "Using $C(d) = 100 + 60d$: (a) **What is the cost for travelling 15 km?** (b) **For how many kilometres will the cost be ₹700?**",
    solution: "**(a) Cost for 15 km.** Substitute $d = 15$:\n\n$$C(15) = 100 + 60 \\times 15 = 100 + 900 = ₹1{,}000$$\n\n**(b) Distance for ₹700.** Set $C(d) = 700$ and solve:\n\n$$100 + 60d = 700$$\n\nSubtract 100: $60d = 600$. Divide by 60: $d = 10$.\n\n**Answer:** Cost for 15 km is **₹1,000**. Cost reaches ₹700 at **10 km**."
  },
  { id: uid(), type: 'heading', order: 7, level: 2, text: 'Linear decay — Example 10 (NCERT water tank)' },
  { id: uid(), type: 'text', order: 8,
    markdown: "Now consider a linear function for the height of water in a cylindrical tank:\n\n$$h(t) = 3 - 0.5t$$\n\nwhere $h$ is the height in metres and $t$ is the number of months since the start of summer.\n\n| $t$ (months) | 0 | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|---|\n| $h$ (m) | 3 | 2.5 | 2 | 1.5 | 1 |\n\nFor every 1-month increase in $t$, the height $h$ **decreases** by exactly **0.5 m**. Because the leading coefficient is $a = -0.5 < 0$, this is **linear decay**.\n\nA real-world image of this: water evaporating from an open tank in steady weekly amounts.\n\n**Same algebra, opposite story.** The cost-of-journey was linear *growth* ($a = +60$). The water tank is linear *decay* ($a = -0.5$). Both follow $f(t) = at + b$ — the only difference is the **sign of $a$**."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 2 — Water tank after 5 months (NCERT Think-Reflect)', variant: 'ncert_intext',
    problem: "Using $h(t) = 3 - 0.5t$: **What will the height of water be at the end of 5 months?**",
    solution: "Substitute $t = 5$:\n\n$$h(5) = 3 - 0.5 \\times 5 = 3 - 2.5 = 0.5 \\text{ m}$$\n\n**Answer:** Height is **0.5 m** after 5 months. (At $t = 6$, the formula gives $0$ — the tank is empty. After that, the formula gives negative values, which is meaningless physically. The model has a natural domain $0 \\le t \\le 6$.)"
  },
  { id: uid(), type: 'heading', order: 10, level: 2, text: 'Formal definitions' },
  { id: uid(), type: 'callout', variant: 'remember', order: 11,
    title: 'Linear Growth and Linear Decay — Definitions',
    markdown: "**A linear pattern $f(t) = at + b$ describes:**\n\n| Sign of $a$ | Behaviour | Verbal name |\n|---|---|---|\n| $a > 0$ | Increases by $a$ per step | **Linear growth** |\n| $a < 0$ | Decreases by $|a|$ per step | **Linear decay** |\n| $a = 0$ | Constant — doesn't change | (constant pattern, not 'linear') |\n\n**The leading coefficient $a$ is also called the *growth rate* (when positive) or the *decay rate* (when negative, with magnitude $|a|$).**\n\n**Sanity-check trick.** A linear-growth pattern *eventually exceeds any number*. A linear-decay pattern *eventually drops below any number* — including zero. So most decay models have a *natural domain* (e.g., the water tank can only be modelled until the water runs out at $t = 6$). When you set up a real-world model, always think: *'where does this break down?'*"
  },
  { id: uid(), type: 'worked_example', order: 12,
    label: 'Worked Example 3 — Plant grows 2 cm a week', variant: 'solved_example',
    problem: "A plant is **15 cm tall** today and grows **2 cm per week**. (a) Write the linear function $h(t)$ for its height after $t$ weeks. (b) When will it reach **39 cm**? (c) Is this growth or decay?",
    solution: "**(a)** $h(t) = 15 + 2t$ cm. (Starting height 15, plus 2 per week.)\n\n**(b)** Set $15 + 2t = 39$. Subtract 15: $2t = 24$, so $t = 12$ weeks.\n\n**(c)** Leading coefficient is $a = +2 > 0$, so this is **linear growth** — the plant gets taller week after week."
  },
  { id: uid(), type: 'worked_example', order: 13,
    label: 'Worked Example 4 — A bucket leaks ₹0.20 of water per minute', variant: 'solved_example',
    problem: "A bucket holds **10 litres** of water and leaks **0.2 L per minute**. (a) Write $V(t)$ for volume after $t$ minutes. (b) When does the bucket run dry? (c) Is this growth or decay?",
    solution: "**(a)** $V(t) = 10 - 0.2t$ litres. (Starting volume 10, minus 0.2 per minute.)\n\n**(b)** Set $10 - 0.2t = 0$. Then $0.2t = 10$, so $t = 50$ minutes.\n\n**(c)** Leading coefficient is $a = -0.2 < 0$, so this is **linear decay**.\n\n**Domain:** the model is valid for $0 \\le t \\le 50$. Beyond $t = 50$, the formula gives negative volumes, which is physically meaningless."
  },
  { id: uid(), type: 'reasoning_prompt', order: 14,
    reasoning_type: 'logical',
    prompt: "Plant A grows linearly: starts at **5 cm**, grows **0.5 cm per week**. Plant B also grows linearly: starts at **2 cm**, grows **1 cm per week**. **Will plant B ever catch up to plant A in height? If so, when?**",
    options: [
      "No, B starts shorter and stays shorter forever",
      "**Yes.** Set $h_A(t) = h_B(t)$: $5 + 0.5t = 2 + t \\Rightarrow 3 = 0.5t \\Rightarrow t = 6$. At week 6, both plants are 8 cm tall, and after that B overtakes A — because B's growth rate (1 cm/wk) is faster than A's (0.5 cm/wk).",
      "Yes — at week 12, when both reach 10 cm",
      "Cannot be determined without more information"
    ],
    reveal: "**Set the two functions equal and solve for $t$.** $5 + 0.5t = 2 + t$ ⇒ $3 = 0.5t$ ⇒ $t = 6$ weeks. At that point both are at $5 + 0.5(6) = 8$ cm. Beyond $t = 6$, plant B's faster growth rate (1 cm/wk vs 0.5 cm/wk) means B exceeds A. **Lesson:** the *starting value* (b) only matters at $t = 0$. The *growth rate* (a) determines who wins in the long run. **A larger growth rate always overtakes a smaller one eventually**, regardless of starting value.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 15,
    title: 'Practice Yourself — Spot Growth or Decay',
    markdown: "For each scenario: (a) write the linear function $f(t)$; (b) classify as growth, decay, or constant; (c) answer the asked question. Cover the answers and try.\n\n1. A gym membership balance starts at **₹6{,}000**, decreasing **₹500 per month**. When does it run out?\n2. A tree is **3 m tall** and grows **0.4 m per year**. Height after 8 years?\n3. Daily revenue of a stall is **₹1{,}200** and increases **₹40 per day**. Revenue on day 25?\n4. An ice block weighs **2 kg** and melts **0.05 kg per minute**. When is it gone?\n5. A library book is checked out and **₹2 fine** is added per day overdue. Total fine after 7 days overdue?\n6. A car's odometer reads **45{,}000 km**. The car is driven **80 km per day**. Reading after 30 days?\n\n---\n\n**Answers:** 1. $f(t) = 6000 - 500t$; **decay**; runs out at $t = 12$ months. 2. $f(t) = 3 + 0.4t$; **growth**; $f(8) = 6.2$ m. 3. $f(t) = 1200 + 40t$; **growth**; $f(25) = 2200$ ₹. 4. $f(t) = 2 - 0.05t$; **decay**; gone at $t = 40$ min. 5. $f(t) = 2t$; **growth** (from zero); $f(7) = ₹14$. 6. $f(t) = 45000 + 80t$; **growth**; $f(30) = 47{,}400$ km."
  },
  { id: uid(), type: 'inline_quiz', order: 16, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "The water tank height $h(t) = 3 - 0.5t$ describes:",
        options: ["Linear growth", "**Linear decay**", "Constant", "Quadratic decay"], correct_index: 1,
        explanation: "Leading coefficient is $-0.5 < 0$. Negative slope means the value decreases with each step — **linear decay**.",
        reasoning_level: 1 },
      { id: uid(), question: "A village has 750 people and grows by 50 people per year. **Population after 6 years?**",
        options: ["750", "1000", "**1050**", "1100"], correct_index: 2,
        explanation: "Use $P(t) = 750 + 50t$. At $t = 6$: $P = 750 + 300 = 1050$.",
        reasoning_level: 1 },
      { id: uid(), question: "A mobile phone bought for **₹10{,}000** loses **₹800** in value each year. **In how many years will it be worth zero according to the model?**",
        options: ["10", "12", "**12.5**", "15"], correct_index: 2,
        explanation: "Use $V(t) = 10000 - 800t$. Set $V = 0$: $t = 10000/800 = 12.5$ years. **Of course, in real life a working phone has some residual value beyond what the linear model predicts** — the model breaks down for large $t$.",
        reasoning_level: 2 },
      { id: uid(), question: "Plant A starts at 10 cm and grows 1 cm/week. Plant B starts at 4 cm and grows 2 cm/week. **In which week will plant B catch up to plant A?**",
        options: ["Week 4", "**Week 6**", "Week 10", "Plant B never catches up"], correct_index: 1,
        explanation: "Set the heights equal: $10 + t = 4 + 2t$, so $6 = t$, week **6**. (Heights at week 6: both 16 cm. After that, B exceeds A because B grows faster.)",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Linear Growth and Linear Decay',
  subtitle: 'When the leading coefficient is positive, you have growth. When it is negative, you have decay. Same algebra, opposite story.',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-growth', 'linear-decay', 'rate-of-change', 'modelling', 'practice'],
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
