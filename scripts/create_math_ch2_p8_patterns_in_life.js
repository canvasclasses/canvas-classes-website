'use strict';
// Class 9 Math — Ch 2 — Page 8: "Linear Patterns in Daily Life"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'linear-patterns-in-daily-life';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 8;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic split-frame image — on the left, a girl removes a small ₹5 note from a clay piggy bank; on the right, a green-and-yellow Indian auto-rickshaw moves through a sunlit street with its meter visible',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio) with a soft visual split. Left half: a young girl in school uniform reaches into a clay piggy bank on a wooden table and removes a small ₹5 currency note; on the table beside the bank, a small chalkboard reads '₹100 → ₹95 → ₹90 → ₹85'. Right half: a green-and-yellow Indian auto-rickshaw moves through a sunlit Indian street, with its meter visible at the front showing '₹40' — and a faint paper sign on the side reading '₹25 base + ₹15/km'. Both halves are unified by a warm late-afternoon golden light. The image conveys: linear patterns are not abstract mathematics — they are everywhere in daily Indian life. Painterly cinematic illustration. Dark background. No additional text labels other than what's described."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Bela starts the month with **₹100** of pocket money. She spends **₹5 each day**. After how many days will she have only **₹40** left?\n\n**Notice:** her money *decreases* by a constant amount each day. Is this still a 'linear pattern' — even though it's going *down*, not up?",
    hint: "Linear patterns can go up *or* down — only the *step size* needs to be constant. A constant negative step is just as 'linear' as a constant positive step.",
    reveal: "After $n$ days, Bela has $100 - 5n$ rupees left. Setting this equal to 40: $100 - 5n = 40$, so $5n = 60$, so $n = 12$ days. Yes, this is **linear** — the step is *negative* but it is *constant*. Linear patterns include both growth (like the chess fee) and decay (like Bela's pocket money). On this page you'll meet a *spending* pattern, an *auto-rickshaw fare* pattern, and the formal NCERT definition of linear pattern."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'A Sanskrit Subhāṣita on Steady Habits',
    markdown: "_From the Subhāṣita-Ratna-Bhāṇḍāgāra (a classical Sanskrit anthology)_\n\n### अल्पम् अल्पम् त्यजेद् वित्तं पुण्यार्थम् बुद्धि-पूर्वकम्\n### अल्पम् अल्पम् च गृह्णीयाद् अध्ययनं नित्य-नूतनम्॥\n\n*(alpam alpam tyajed vittaṃ puṇyārtham buddhi-pūrvakam / alpam alpam ca gṛhṇīyād adhyayanam nitya-nūtanam)*\n\n---\n\n*'थोड़ा-थोड़ा करके धन को (अच्छे काम के लिए) सोच-समझकर खर्च करो; और थोड़ा-थोड़ा करके हर दिन कुछ नया सीखो।'*\n\n*'Spend wealth in small amounts, mindfully, for good purposes. Take in learning in small amounts — but every single day.'*\n\nThe Sanskrit verse celebrates **steady, equal-step change** — exactly what makes a pattern *linear*. ₹5 spent each day, one new fact learnt each day — these are the rhythms of slow, reliable change. The mathematics of this page is the algebra of that quiet daily discipline."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: "Bela's pocket money — a decreasing linear pattern" },
  { id: uid(), type: 'worked_example', order: 4,
    label: 'Worked Example 1 — Bela starts with ₹100, spends ₹5/day (NCERT Ex 7)', variant: 'ncert_intext',
    problem: "Bela has **₹100** for pocket money. She spends **₹5 every day**. After how many days will she be left with **₹40**?",
    solution: "**Step 1 — Set up a table.**\n\n| Day $n$ | 0 | 1 | 2 | 3 | 4 | … |\n|---|---|---|---|---|---|---|\n| Amount left (₹) | 100 | $100 - 5 \\times 1 = 95$ | $100 - 5 \\times 2 = 90$ | $100 - 5 \\times 3 = 85$ | $100 - 5 \\times 4 = 80$ | … |\n\n**Step 2 — General formula.** On day $n$:\n\n$$\\text{Amount left} = 100 - 5n \\text{ rupees}$$\n\nThis is a linear polynomial in $n$ — leading coefficient $-5$ (note the *negative* sign, because money is *decreasing*), constant term $100$.\n\n**Step 3 — Set the formula equal to ₹40 and solve.**\n\n$$100 - 5n = 40$$\n\nSubtract 100: $-5n = -60$. Divide by $-5$: $n = 12$.\n\n**Answer:** Bela will have ₹40 left after **12 days**. (Check: $100 - 5 \\times 12 = 100 - 60 = 40$ ✓.)"
  },
  { id: uid(), type: 'worked_example', order: 5,
    label: 'Worked Example 2 — Bela on day 15, and when she runs out (NCERT Think-Reflect)', variant: 'ncert_intext',
    problem: "(a) What amount will Bela have on the **15th day**? (b) On which day will she have **spent everything**?",
    solution: "**(a) Day 15.** Substitute $n = 15$:\n\n$$100 - 5 \\times 15 = 100 - 75 = ₹25$$\n\nBela has ₹25 left on day 15.\n\n**(b) When does she run out?** Set the amount to 0:\n\n$$100 - 5n = 0 \\Rightarrow n = 20$$\n\nOn day **20**, Bela will have spent her entire ₹100. (After that, the formula gives negative values — which would mean she'd be in *debt*; the model breaks down beyond the natural domain.)"
  },
  { id: uid(), type: 'simulation', order: 6, simulation_id: 'linear-pattern-explorer',
    title: "Try It: Watch Bela, the Auto Fare, and Other Patterns Live"
  },
  { id: uid(), type: 'heading', order: 7, level: 2, text: 'The auto-rickshaw fare — an increasing linear pattern' },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'Worked Example 3 — Auto-rickshaw fare (NCERT Ex 8)', variant: 'ncert_intext',
    problem: "An auto-rickshaw fare starts at **₹25** for the **first 2 km**. After that, it increases by **₹15 per kilometre**. What is the fare for a **10-km** journey? Find a formula for the fare for any $n$ km, when $n \\ge 2$.",
    solution: "**Step 1 — Build the table for 1-6 km.**\n\n| Km | 1 | 2 | 3 | 4 | 5 | 6 |\n|---|---|---|---|---|---|---|\n| Fare (₹) | 25 | 25 | $25 + 1(15) = 40$ | $25 + 2(15) = 55$ | $25 + 3(15) = 70$ | $25 + 4(15) = 85$ |\n\n**Step 2 — Direct calculation for 10 km.**\n\nFor a 10-km journey, the first 2 km cost ₹25 (flat). The remaining $10 - 2 = 8$ km cost $8 \\times 15 = ₹120$. So total $= 25 + 120 = ₹145$.\n\n**Step 3 — General formula for $n$ km, $n \\ge 2$.**\n\nFare $= 25 + 15(n - 2) = 25 + 15n - 30 = 15n - 5$.\n\n$$\\text{Fare}(n) = 15n - 5 \\quad (n \\ge 2)$$\n\n**Check:** $n = 10 \\Rightarrow 15(10) - 5 = 150 - 5 = 145$ ✓.\n\n**Answer:** Fare for 10 km is ₹**145**. General formula: $15n - 5$ rupees for $n \\ge 2$ km."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 4 — Auto fare = ₹130, find the distance (NCERT Think-Reflect)', variant: 'ncert_intext',
    problem: "**For how many kilometres is the auto-rickshaw fare ₹130?**",
    solution: "Set the formula equal to 130:\n\n$$15n - 5 = 130$$\n\nAdd 5: $15n = 135$. Divide by 15: $n = 9$.\n\n**Answer:** Fare is ₹130 for a **9 km** journey. (Check: $15(9) - 5 = 135 - 5 = 130$ ✓.)"
  },
  { id: uid(), type: 'heading', order: 10, level: 2, text: 'Linear pattern — the formal definition' },
  { id: uid(), type: 'text', order: 11,
    markdown: "After two examples — Bela's *decreasing* pocket money and the *increasing* auto fare — we can now write down the formal definition.\n\n**A linear pattern is a sequence of numbers in which the difference between two consecutive terms is constant.**\n\nIf the constant difference is $d$ and the first term is $f(1) = a + d$ (i.e., the underlying linear polynomial is $f(n) = dn + a$), then:\n\n- $d > 0$ → linear **growth** (each term is larger than the previous one)\n- $d < 0$ → linear **decay** (each term is smaller than the previous one)\n- $d = 0$ → constant pattern (technically not 'linear' since the polynomial reduces to a constant, but the test still works)\n\n**Linear patterns will return as 'arithmetic progressions' (APs) in a later chapter on Sequences and Progressions.** What you're learning here — the constant-difference signature, the nth-term formula — is the algebraic core of arithmetic progressions."
  },
  { id: uid(), type: 'heading', order: 12, level: 2, text: 'Exercise Set 2.3 — five practice scenarios' },
  { id: uid(), type: 'worked_example', order: 13,
    label: 'Q1 — Student savings account (NCERT Ex Set 2.3, Q1)', variant: 'ncert_intext',
    problem: "A student has **₹500** in her savings bank account. She gets **₹150 every month** as pocket money. **How much money will she have at the end of every month from the second month onwards? Find a linear expression for the amount she will have in the nth month.**",
    solution: "**Pattern setup.** At the end of month 1: $500 + 150 = ₹650$. End of month 2: $650 + 150 = ₹800$. End of month 3: ₹950. Etc.\n\n| End of month $n$ | 1 | 2 | 3 | 4 | 5 |\n|---|---|---|---|---|---|\n| Amount (₹) | 650 | 800 | 950 | 1100 | 1250 |\n\n**Constant difference:** $150$. So $f(n) = 150n + b$. To match $f(1) = 650$: $150 + b = 650$, so $b = 500$.\n\n**Linear expression:** $f(n) = 150n + 500$ rupees.\n\n**Answer:** Amount in nth month = ₹$(150n + 500)$. (Check: $f(2) = 800$ ✓.)"
  },
  { id: uid(), type: 'worked_example', order: 14,
    label: 'Q2 — Rally with members dropping out (NCERT Q2)', variant: 'ncert_intext',
    problem: "A rally starts with **120 members**. Each hour, **9 members drop out**. **How many members will remain after 1, 2, 3, … hours? Find a linear expression for the number of members at the end of the nth hour.**",
    solution: "**Pattern setup.** Hour 1: $120 - 9 = 111$. Hour 2: $111 - 9 = 102$. Hour 3: 93. Etc.\n\n**Constant difference:** $-9$. So $f(n) = -9n + b$. To match $f(1) = 111$: $-9 + b = 111$, so $b = 120$.\n\n**Linear expression:** $f(n) = 120 - 9n$ members.\n\n*Domain note:* this formula gives 0 members when $n = \\frac{120}{9} \\approx 13.33$, so realistically the rally is over after about 13 hours (the 14th hour would give a negative count, which is meaningless)."
  },
  { id: uid(), type: 'worked_example', order: 15,
    label: 'Q3 — Rectangle with fixed length 13 (NCERT Q3)', variant: 'ncert_intext',
    problem: "Suppose the **length** of a rectangle is **13 cm**. Find the **area** if the breadth is (i) 12 cm, (ii) 10 cm, (iii) 8 cm. Find the linear pattern representing the area as a function of breadth.",
    solution: "**Areas:**\n- (i) $13 \\times 12 = 156$ sq cm\n- (ii) $13 \\times 10 = 130$ sq cm\n- (iii) $13 \\times 8 = 104$ sq cm\n\n**Linear pattern:** Area is $A = 13b$ where $b$ is the breadth.\n\n*Why is this linear?* The length 13 is *fixed*, so $A = 13b$ is a linear polynomial in $b$ (leading coefficient 13, constant 0). If *both* length and breadth varied (as $A = lb$), it would *not* be a polynomial in one variable at all."
  },
  { id: uid(), type: 'worked_example', order: 16,
    label: 'Q4 — Box with fixed length and breadth (NCERT Q4)', variant: 'ncert_intext',
    problem: "Suppose a rectangular box has **length 7 cm** and **breadth 11 cm**. Find the **volume** if the height is (i) 5 cm, (ii) 9 cm, (iii) 13 cm. Find the linear pattern for the volume.",
    solution: "**Volumes:**\n- (i) $7 \\times 11 \\times 5 = 385$ cu cm\n- (ii) $7 \\times 11 \\times 9 = 693$ cu cm\n- (iii) $7 \\times 11 \\times 13 = 1001$ cu cm\n\n**Linear pattern:** Volume is $V = 77h$ where $h$ is the height.\n\nLeading coefficient is $77 = 7 \\times 11$ — the area of the fixed base. Since the base is fixed, volume scales **linearly** with height."
  },
  { id: uid(), type: 'worked_example', order: 17,
    label: 'Q5 — Sarita reading a 500-page book (NCERT Q5)', variant: 'ncert_intext',
    problem: "**Sarita** is reading a book of **500 pages**. She reads **20 pages every day**. **How many pages will be left after 15 days? Express this as a linear pattern.**",
    solution: "**Pattern.** After day 1: $500 - 20 = 480$ pages left. Day 2: $460$. Etc.\n\n**Linear expression:** Pages left after day $n$: $f(n) = 500 - 20n$.\n\n**After 15 days:** $f(15) = 500 - 20 \\times 15 = 500 - 300 = 200$ pages left.\n\n**Domain:** Sarita finishes the book when $f(n) = 0$, i.e. $n = 25$ days. After that, the formula would give negative pages — meaningless."
  },
  { id: uid(), type: 'reasoning_prompt', order: 18,
    reasoning_type: 'logical',
    prompt: "In Q3 above, the rectangle has length **fixed** at 13 cm. The area is $A = 13b$ — linear in the breadth $b$. If you let the **length and breadth both vary**, the area becomes $A = lb$ — a product of two variables. **Is $lb$ a polynomial in one variable? Why or why not?**",
    options: [
      "Yes, $lb$ is linear in both $l$ and $b$",
      "**No** — a polynomial 'in one variable' means *exactly one* letter changes. The expression $lb$ has *two* variables changing simultaneously, so it doesn't fit the one-variable polynomial definition. It is sometimes called a 'polynomial in two variables', but it is *not* a polynomial in one variable.",
      "Yes, because both $l$ and $b$ are real numbers",
      "No — because a product of two letters can never form a polynomial"
    ],
    reveal: "**$lb$ is not a polynomial in one variable.** Polynomials in *one* variable have exactly one letter changing — like $13b$, $7\\cdot 11\\cdot h$, or $5x + 2$. The product $lb$ has *two* letters changing at once. There's a more general object called a 'polynomial in two variables' that handles such expressions, but **the linear-pattern test (constant successive differences) only applies cleanly when there's one input variable**. By fixing one quantity and letting the other vary, problems Q3 and Q4 turn an essentially two-variable formula into a clean one-variable linear pattern. **This 'fix one, vary the other' move is one of the most useful tricks in applied mathematics.**",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 19,
    title: 'Practice Yourself — Real-World Linear Patterns',
    markdown: "Find the linear expression $f(n)$ and answer the question.\n\n1. A water tank starts with **2000 L** and loses **150 L per day** to evaporation. How much water is left after 10 days? When does it run dry?\n2. A library charges **₹50** for a membership and **₹5 per book** borrowed. Cost for 12 books?\n3. A bus has **44 seats** and **6 passengers** get on at each stop (it starts empty). At which stop does the bus first become full?\n4. A weight-loss programme: a person starts at **80 kg**, loses **0.5 kg per week**. Their weight after 16 weeks?\n5. A rope of **30 m** is cut into pieces of **2 m** each. Length remaining after $n$ cuts?\n6. A plant is **15 cm** tall and grows **2 cm per week**. Its height after $n$ weeks?\n\n---\n\n**Answers:** 1. $f(n) = 2000 - 150n$; after 10 days ${} = 500$ L; runs dry on day $\\dfrac{2000}{150} \\approx 13.3$, so day **14**. 2. $f(b) = 5b + 50$; for 12 books ${} = ₹110$. 3. $f(s) = 6s$; full when $6s = 44 \\Rightarrow s \\approx 7.3$, so the **8th** stop. 4. $f(w) = 80 - 0.5w$; at $w = 16$, weight = 72 kg. 5. $f(n) = 30 - 2n$ m. 6. $f(n) = 2n + 15$ cm."
  },
  { id: uid(), type: 'inline_quiz', order: 20, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "Bela starts with ₹100 and spends ₹5 a day. The amount left on day $n$ is $100 - 5n$. **What is the leading coefficient of this linear polynomial, and what does its sign tell you?**",
        options: ["Coefficient $5$; positive means money is being added", "**Coefficient $-5$; negative means money is decreasing each day**", "Coefficient $100$; that's the starting amount", "Coefficient $-100$; the amount goes negative"],
        correct_index: 1,
        explanation: "Rewriting $100 - 5n$ as $-5n + 100$, the leading coefficient is **$-5$**. The negative sign means the value goes *down* by 5 each step — linear decay. The constant term $100$ is the starting amount.",
        reasoning_level: 2 },
      { id: uid(), question: "An auto-rickshaw fare for $n$ km (with $n \\ge 2$) is $15n - 5$ rupees. **What is the fare for 12 km?**",
        options: ["₹150", "₹175", "₹190", "₹200"], correct_index: 1,
        explanation: "$f(12) = 15(12) - 5 = 180 - 5 = 175$. So the fare for 12 km is **₹175**.",
        reasoning_level: 1 },
      { id: uid(), question: "The pages left in a 500-page book after $n$ days of reading 20 pages/day is $500 - 20n$. **On which day does Sarita finish the book** (i.e., 0 pages left)?",
        options: ["20", "25", "30", "Cannot finish in finite time"], correct_index: 1,
        explanation: "Set $500 - 20n = 0$. Solve: $20n = 500$, $n = 25$. **Day 25.** After day 25, the formula gives negative pages, which is meaningless — the model only applies up to day 25.",
        reasoning_level: 2 },
      { id: uid(), question: "A box of fixed dimensions $4 \\times 5 = 20$ sq cm base, varying height $h$. The volume is $V = 20h$. **By how much does the volume increase when $h$ goes up by 1 cm?**",
        options: ["By 4 cu cm", "By 5 cu cm", "By 20 cu cm", "By 100 cu cm"], correct_index: 2,
        explanation: "The leading coefficient is $20$, so the per-step change is **20 cu cm**. (This is the area of the fixed base — a one-cm-tall slab on top of the existing box has volume $20 \\times 1 = 20$ cu cm. Geometric intuition matches algebraic intuition.)",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Linear Patterns in Daily Life',
  subtitle: "Pocket money, an auto fare, a library fee, a reading plan — the same linear algebra hides in every one",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['linear-pattern', 'real-world', 'NCERT-Ex-7-8', 'Ex-Set-2.3', 'practice'],
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
