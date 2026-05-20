'use strict';
// Class 9 Math — Ch 2 — Page 10: "Growth & Decay in Action"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'growth-and-decay-in-action';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 10;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic three-pane vignette: on the left, a green sapling pushes upward through earth; in the centre, a smartphone with a faded value tag; on the right, a vibrant Indian village with people walking in a market square — all illuminated by the same warm sunset light",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio) split into three softly-divided vertical panels. Left panel: a healthy young green plant pushing upward out of rich brown earth, with a faint upward arrow tracing its growth. Centre panel: a modern smartphone resting on a wooden surface, with a small price tag attached showing '₹10,000 → ₹9,200 → ₹8,400 …' — the numbers fading to suggest decreasing value. Right panel: a vibrant Indian village square at sunset with people walking, a few houses with terracotta roofs, and a faint upward arrow showing population growth. All three panels share the same warm golden-hour sunset light. The image conveys: linear models describe growth and decay everywhere — from a single plant to a depreciating gadget to a whole village. Painterly cinematic illustration. Dark background. No text labels other than what's described."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "A village adds **50 people every year**. A phone loses **₹800 every year**. A plant grows **0.5 ft every month**. **They all change by a constant amount per unit time.** That tiny phrase — 'constant per unit time' — is the secret signature of every linear pattern in the world. **Where else can you spot it in your daily life?**",
    hint: "Think: monthly subscriptions, daily metro fares, weekly weight changes, hourly battery drain.",
    reveal: "Once you start looking, linear patterns are *everywhere*. ₹400 added to a savings account each month. 5% battery drained per hour during video playback. 100 mL of water lost per day from a leaky pipe. **The whole modern world runs on the algebra of constant-per-unit-time changes.** This page is your practice gym for setting up such models from scratch."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'A Subhāṣita on Growth and Decline',
    markdown: "_From the Subhāṣita-Ratna-Bhāṇḍāgāra_\n\n### वृद्धिः क्षयश्च मानवानां जीवनस्य लक्षणे\n### सम-कालेन सम-गत्या निःशब्दं फलम् भवेत्॥\n\n*(vṛddhiḥ kṣayaś ca mānavānāṃ jīvanasya lakṣaṇe / sama-kālena sama-gatyā niḥśabdaṃ phalam bhavet)*\n\n---\n\n*'वृद्धि (बढ़ना) और क्षय (घटना) — दोनों मनुष्य के जीवन के चिन्ह हैं। बराबर समय में, बराबर गति से — चुपचाप फल मिलता है।'*\n\n*'Vṛddhi (growth) and kṣaya (decay) — both are signs of human life. In equal time, at an equal pace, the result quietly comes.'*\n\nThe Sanskrit terms **vṛddhi** (वृद्धि, growth) and **kṣaya** (क्षय, decay) are still used today in Indian medicine, agriculture, and economics — to describe exactly the kind of steady, equal-step change that linear polynomials capture mathematically. **Algebra and Sanskrit agree: when something changes by an equal amount in equal time, you can predict its future.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: "NCERT Exercise Set 2.4 — three real-world models" },
  { id: uid(), type: 'simulation', order: 4, simulation_id: 'growth-decay-visualizer',
    title: "Try It: All Three Scenarios — and Find Where Things Break"
  },
  { id: uid(), type: 'worked_example', order: 5,
    label: 'Q1 (i) — Plant after 7 months (NCERT Ex Set 2.4, Q1)', variant: 'ncert_intext',
    problem: "A plant has height **1.75 feet** and grows by **0.5 feet each month**. **Find its height after 7 months.**",
    solution: "**Step 1 — Set up the linear function.**\n\n$$h(t) = 1.75 + 0.5t \\text{ feet}$$\n\nLeading coefficient $0.5$ (the per-month growth rate); constant term $1.75$ (the starting height).\n\n**Step 2 — Substitute $t = 7$.**\n\n$$h(7) = 1.75 + 0.5 \\times 7 = 1.75 + 3.5 = 5.25 \\text{ ft}$$\n\n**Answer:** After 7 months, the plant is **5.25 ft** tall.\n\n*Sense-check:* the plant has grown by $5.25 - 1.75 = 3.5$ ft in 7 months. That's $3.5/7 = 0.5$ ft per month. ✓"
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'Q1 (ii) — Plant table 0–10 months', variant: 'ncert_intext',
    problem: "Make a **table** of the plant's height for $t$ varying from 0 to 10 months.",
    solution: "Apply $h(t) = 1.75 + 0.5t$ for each value of $t$:\n\n| $t$ (months) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n| $h$ (ft) | 1.75 | 2.25 | 2.75 | 3.25 | 3.75 | 4.25 | 4.75 | 5.25 | 5.75 | 6.25 | 6.75 |\n\nNotice the **constant difference of 0.5 ft** between consecutive months. That's the per-step rate, exactly equal to the leading coefficient."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'Q1 (iii) — Why is this linear growth?', variant: 'ncert_intext',
    problem: "Find an expression that relates $h$ and $t$, and explain why it represents **linear growth**.",
    solution: "**Expression:** $h(t) = 1.75 + 0.5t$.\n\n**Why it represents linear growth:**\n\n1. **Linear** because the highest power of $t$ is 1 (degree 1) and the successive differences are constant.\n2. **Growth** because the leading coefficient $0.5$ is **positive** — the height *increases* by 0.5 ft for every unit increase in $t$.\n\nFormally: a function $f(t) = at + b$ represents linear growth iff $a > 0$. Here $a = 0.5 > 0$, so this is linear growth. ✓"
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'Q2 (i) — Mobile phone after 3 years (NCERT Q2)', variant: 'ncert_intext',
    problem: "A mobile phone is bought for **₹10{,}000**. Its value decreases by **₹800 every year**. **Find the value after 3 years.**",
    solution: "**Step 1 — Set up the function.**\n\n$$v(t) = 10000 - 800t \\text{ rupees}$$\n\nLeading coefficient $-800$ (negative because value is *decreasing*); constant term $10{,}000$ (the starting price).\n\n**Step 2 — Substitute $t = 3$.**\n\n$$v(3) = 10000 - 800 \\times 3 = 10000 - 2400 = ₹7{,}600$$\n\n**Answer:** After 3 years, the phone is worth **₹7,600** according to the linear model."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Q2 (ii) — Phone-value table 0-8 years', variant: 'ncert_intext',
    problem: "Make a **table** of the phone's value for $t$ varying from 0 to 8 years.",
    solution: "Apply $v(t) = 10000 - 800t$:\n\n| $t$ (years) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n|---|---|---|---|---|---|---|---|---|---|\n| $v$ (₹) | 10000 | 9200 | 8400 | 7600 | 6800 | 6000 | 5200 | 4400 | 3600 |\n\nConstant difference: **−₹800** per year. ✓\n\n*Domain note:* the formula gives $v = 0$ at $t = 12.5$ years. After that, it would give *negative* values — meaningless. The linear model is only realistic for the first ~12 years."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Q2 (iii) — Why is this linear decay?', variant: 'ncert_intext',
    problem: "Find an expression that relates $v$ and $t$, and explain why it represents **linear decay**.",
    solution: "**Expression:** $v(t) = 10000 - 800t$.\n\n**Why it represents linear decay:**\n\n1. **Linear** because the highest power of $t$ is 1 and successive differences are constant.\n2. **Decay** because the leading coefficient $-800$ is **negative** — the value *decreases* by ₹800 for every unit increase in $t$.\n\nFormally: $f(t) = at + b$ is linear decay iff $a < 0$. Here $a = -800 < 0$. ✓"
  },
  { id: uid(), type: 'worked_example', order: 11,
    label: 'Q3 (i) — Village population after 6 years (NCERT Q3)', variant: 'ncert_intext',
    problem: "The initial population of a village is **750**. Every year, **50 people move from a nearby city to the village**. **Find the population after 6 years.**",
    solution: "**Step 1 — Set up the function.**\n\n$$P(t) = 750 + 50t \\text{ people}$$\n\nLeading coefficient $+50$ (positive; population grows); constant term $750$ (starting population).\n\n**Step 2 — Substitute $t = 6$.**\n\n$$P(6) = 750 + 50 \\times 6 = 750 + 300 = 1050 \\text{ people}$$\n\n**Answer:** After 6 years, the village has **1,050 people**.\n\n*Lesson:* this is linear growth ($a = +50 > 0$). The model assumes the per-year migration stays exactly constant — in reality, populations rarely grow this cleanly, but the linear model is an excellent first approximation."
  },
  { id: uid(), type: 'reasoning_prompt', order: 12,
    reasoning_type: 'logical',
    prompt: "The mobile-phone model says $v(t) = 10000 - 800t$. **At what value of $t$ would the model give zero value? What does this tell us about the *limits* of the linear model?**",
    options: [
      "$t = 8$ — and the model is perfectly fine after that",
      "**$t = 12.5$ years — and beyond that the model gives *negative* phone values**, which is meaningless. So the linear-decay model has a natural domain of $0 \\le t \\le 12.5$. Beyond that, a more realistic model would say the phone has some small residual value or has long since stopped working — the linear model breaks down.",
      "$t = 100$ — phones never reach zero value",
      "Cannot be determined"
    ],
    reveal: "**Set $v(t) = 0$**: $10000 - 800t = 0 \\Rightarrow t = 12.5$ years. **Beyond $t = 12.5$, the formula gives negative values — clearly meaningless** (a phone can't have a *negative* worth in this scenario). This is one of the most important lessons in mathematical modelling: **every linear model has a natural domain, and outside that domain the model lies.** Real depreciation usually slows down as a phone ages (the phone keeps a small residual value); a more accurate model would be exponential or piecewise. The linear model is a *good first approximation* — but always know where it breaks.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 13,
    title: 'Practice Yourself — More Growth/Decay Models',
    markdown: "For each scenario, write the linear function $f(t)$, classify as growth/decay, and answer the question.\n\n1. **Gym membership balance:** starts at ₹6{,}000, decreases ₹500/month. *When does it run out?*\n2. **Tree:** 3 m tall, grows 0.4 m/year. *Height after 8 years?*\n3. **Library overdue fine:** ₹2 per day overdue (no fine before due date). *Fine for 7 days overdue?*\n4. **Car odometer:** reads 45{,}000 km, driven 80 km/day. *Reading after 30 days?*\n5. **Ice block:** 2 kg, melts 0.05 kg/min. *When does it disappear?*\n6. **Daily revenue of a stall:** ₹1{,}200 today, increases ₹40/day. *Revenue on day 25?*\n7. **Battery:** starts at 100% charge, drops 8% per hour during video playback. *When does it die?*\n8. **Bank fixed deposit (simple interest, very simplified):** ₹50{,}000 principal earning ₹250 interest per month. *Total amount after 18 months?*\n\n---\n\n**Answers:** 1. $f(t) = 6000 - 500t$; **decay**; runs out at $t = 12$ months. 2. $f(t) = 3 + 0.4t$; **growth**; $f(8) = 6.2$ m. 3. $f(t) = 2t$; **growth from zero**; $f(7) = ₹14$. 4. $f(t) = 45000 + 80t$; **growth**; $f(30) = 47{,}400$ km. 5. $f(t) = 2 - 0.05t$; **decay**; gone at $t = 40$ min. 6. $f(t) = 1200 + 40t$; **growth**; $f(25) = ₹2{,}200$. 7. $f(t) = 100 - 8t$; **decay**; dies at $t = 12.5$ hr. 8. $f(t) = 50000 + 250t$; **growth**; $f(18) = ₹54{,}500$."
  },
  { id: uid(), type: 'inline_quiz', order: 14, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "A plant has height $h(t) = 1.75 + 0.5t$ ft. **Height after 10 months?**",
        options: ["5.25 ft", "5.75 ft", "**6.75 ft**", "7.25 ft"], correct_index: 2,
        explanation: "$h(10) = 1.75 + 0.5 \\times 10 = 1.75 + 5.0 = 6.75$ ft.",
        reasoning_level: 1 },
      { id: uid(), question: "A mobile phone bought for ₹10{,}000 loses ₹800/year. **Value after 5 years?**",
        options: ["₹4{,}000", "₹5{,}000", "**₹6{,}000**", "₹7{,}000"], correct_index: 2,
        explanation: "$v(5) = 10000 - 800 \\times 5 = 10000 - 4000 = ₹6{,}000$.",
        reasoning_level: 1 },
      { id: uid(), question: "Village population: $P(t) = 750 + 50t$. **In how many years will the population reach 1{,}500?**",
        options: ["10", "**15**", "20", "30"], correct_index: 1,
        explanation: "Set $750 + 50t = 1500$. Then $50t = 750$, $t = 15$ years.",
        reasoning_level: 2 },
      { id: uid(), question: "An ice block weighs 2 kg and melts at 0.05 kg/min. **What does the linear model predict its mass to be at $t = 60$ minutes — and is that physically meaningful?**",
        options: [
          "$-1$ kg — and yes, this is fine",
          "**$-1$ kg — and no, this is not physically meaningful (mass can't be negative); the linear model has broken down because the ice was already gone at $t = 40$ minutes**",
          "0 kg — exactly what we'd expect",
          "1 kg — the ice is half its original mass"
        ],
        correct_index: 1,
        explanation: "$f(60) = 2 - 0.05 \\times 60 = 2 - 3 = -1$ kg. **A negative mass is meaningless** — the ice clearly can't weigh less than zero. The linear model is only valid up to $t = 40$ minutes (when the ice is gone). This is the lesson the reasoning prompt above also highlighted: **always check whether your linear model is operating inside its natural domain.**",
        reasoning_level: 4 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Growth & Decay in Action',
  subtitle: "A plant, a phone, and a village — three NCERT word problems modelled in three lines of algebra each",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['growth', 'decay', 'modelling', 'NCERT-Ex-Set-2.4', 'practice'],
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
