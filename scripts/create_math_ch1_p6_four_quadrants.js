'use strict';
/**
 * Class 9 Math — Chapter 1 — Page 6
 * "The Four Quadrants: Where Every Point Lives"
 *
 * Run: node scripts/create_math_ch1_p6_four_quadrants.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'four-quadrants-where-every-point-lives';
const CHAPTER_NUMBER = 1;
const PAGE_NUMBER = 6;

function uid() { return randomUUID(); }

const blocks = [
  // Block 0: hero banner
  {
    id: uid(), type: 'image', order: 0,
    src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic view of a 2-D plane painted in four softly-coloured quadrants, with two perpendicular axes glowing through them, evoking a divided yet unified mathematical universe',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). The Cartesian plane visualised as a vast, glowing landscape divided into four softly tinted quadrants — upper-right (warm gold), upper-left (cool blue), lower-left (deep red), lower-right (royal violet). Two glowing perpendicular axes intersect at a luminous origin in the centre. Faint constellation-like dot patterns suggest infinite points scattered across each region. The image conveys: every point in the plane belongs to one of four worlds, and the signs of its coordinates reveal which. Painterly cinematic illustration. Dark background. No text, no labels."
  },
  // Block 1: curiosity_prompt
  {
    id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "On the previous page you met the Cartesian plane and learned that any point can be written as $(x, y)$. Two numbers, two signs.\n\nNow think: how many *qualitatively different* kinds of point are there? A point with both coordinates positive feels different from one with both negative, doesn't it? How many distinct *regions* does the plane split into?",
    hint: "Each coordinate can be positive, negative, or zero. How many combinations give you 'real' regions (excluding the axes themselves)?",
    reveal: "Four. The two axes carve the plane into **four equal regions**, called **quadrants**. Each quadrant has its own characteristic sign pattern: (+,+), (−,+), (−,−), (+,−). On this page you will give each region a name, learn its sign rule, and become quick at classifying any point."
  },
  // Block 2: Bhaskara II / Lilavati verse
  {
    id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'लीलावती — भास्कराचार्य',
    markdown: "_On the Four Cardinal Directions_\n\n### चत्वारि अंशानि भुवो विभक्ते\n### दिशि दिशि गणितस्य निर्णयः सिद्ध्यति॥\n\n*(catvāri aṃśāni bhuvo vibhakte / diśi diśi gaṇitasya nirṇayaḥ siddhyati)*\n\n---\n\n*'धरती चार हिस्सों में बँटी है — हर दिशा में, अपना अलग गणित है।'*\n\n*'The earth is divided into four parts — in every direction, mathematics finds its own answer.'*\n\nBhāskarāchārya (1150 CE) wrote about how surveying problems split into four directional cases. The four quadrants you are about to study are the same idea, written in modern notation: each direction has its own sign rule, and the same point looks different through each one."
  },
  // Block 3: heading
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'The four regions of the plane' },
  // Block 4: text — quadrants
  {
    id: uid(), type: 'text', order: 4,
    markdown: "So far we have looked at points lying *on* the two coordinate axes. What about every point that is **not** on an axis?\n\nThe plane in which the axes are drawn is called the **Cartesian plane** — also known as the **coordinate plane** or the **xy-plane**. The two axes divide it into **four regions**, called **quadrants**. By convention they are numbered **anti-clockwise**, starting from the upper-right.\n\n**Each quadrant has a distinct sign pattern:**\n\n- **Quadrant I** (upper-right): both $x > 0$ and $y > 0$\n- **Quadrant II** (upper-left): $x < 0$ and $y > 0$\n- **Quadrant III** (lower-left): both $x < 0$ and $y < 0$\n- **Quadrant IV** (lower-right): $x > 0$ and $y < 0$\n\nThe quadrant of a point is determined entirely by **the signs of its two coordinates**, nothing else. The size of $x$ and $y$ does not matter — $(0.1, 0.1)$ and $(99, 99)$ both lie in Quadrant I."
  },
  // Block 5: image — Fig 1.4
  {
    id: uid(), type: 'image', order: 5,
    src: '', width: 'full',
    caption: '📸 Fig. 1.4 — The Cartesian plane with the four quadrants labelled. Q(−5, 3) lies in Quadrant II; S(3, −5) lies in Quadrant IV.',
    alt: 'A green-graph-paper Cartesian plane on a dark background. The four quadrants are labelled in their corners: Quadrant I (upper-right), Quadrant II (upper-left), Quadrant III (lower-left), Quadrant IV (lower-right). The x-axis is labelled with integers from −8 to 7; the y-axis from −5 to +4. Two points are plotted: Q(−5, 3) in Quadrant II and S(3, −5) in Quadrant IV. The origin O = (0, 0) is at the centre.',
    generation_prompt: "Cartesian plane diagram on green graph paper over a dark background. Two thick green axes meet at the origin O = (0, 0). The horizontal axis is labelled 'x-axis' to the right; the vertical axis is labelled 'y-axis' upward. Tick marks at every integer from −8 to +7 on the x-axis, from −5 to +4 on the y-axis. The four corners of the visible plane carry labels: 'Quadrant I' (upper-right), 'Quadrant II' (upper-left), 'Quadrant III' (lower-left), 'Quadrant IV' (lower-right). Two points are plotted as small dark dots with labels: 'Q(−5, 3)' in Quadrant II and 'S(3, −5)' in Quadrant IV. Style: clean educational mathematics illustration. Dark background, orange accent labels, clean technical illustration style."
  },
  // Block 6: heading
  { id: uid(), type: 'heading', order: 6, level: 2, text: 'The sign-rule table' },
  // Block 7: table — quadrants
  {
    id: uid(), type: 'table', order: 7,
    caption: 'The sign of each coordinate in each quadrant',
    headers: ['Quadrant', 'x-sign', 'y-sign', 'Example point'],
    rows: [
      ['I',   '+', '+', '(3, 4)'],
      ['II',  '−', '+', '(−5, 3)'],
      ['III', '−', '−', '(−2, −7)'],
      ['IV',  '+', '−', '(3, −5)'],
    ],
  },
  // Block 8: text — perpendicular distance / coordinate naming
  {
    id: uid(), type: 'text', order: 8,
    markdown: "Now you can read any point's coordinates with full confidence. In general, the coordinates of a point P in 2-D space are written as $(x, y)$, where:\n\n- $x$ is the **perpendicular distance of P from the y-axis**, measured along the x-axis. We call $x$ the **x-coordinate** (sometimes called the *abscissa*).\n- $y$ is the **perpendicular distance of P from the x-axis**, measured along the y-axis. We call $y$ the **y-coordinate** (sometimes called the *ordinate*).\n\nAnd note an important shortcut. **Points on an axis have one coordinate equal to zero:**\n\n- A point of the form $(x, 0)$ lies on the **x-axis**. (Its perpendicular distance from the x-axis is zero.)\n- A point of the form $(0, y)$ lies on the **y-axis**. (Its perpendicular distance from the y-axis is zero.)\n- The single point that lies on **both** axes is the **origin** $O = (0, 0)$.\n\nThe axes themselves do **not** belong to any of the four quadrants — they are the borders between them."
  },
  // Block 9: simulation — quadrant-classifier
  {
    id: uid(), type: 'simulation', order: 9,
    simulation_id: 'quadrant-classifier',
    title: 'Try It: Classify Quadrants — Practice Mode',
  },
  // Block 10: worked_example 1
  {
    id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 1',
    variant: 'solved_example',
    problem: "In which quadrant does the point $Q(-5, 3)$ lie?",
    solution: "**Step 1 — Read the signs.**\n\nThe x-coordinate is $-5$ (negative); the y-coordinate is $+3$ (positive).\n\n**Step 2 — Match to the sign-rule table.**\n\n$x < 0$ and $y > 0$ ⇒ **Quadrant II** (upper-left).\n\n**Answer:** Q lies in **Quadrant II**."
  },
  // Block 11: worked_example 2
  {
    id: uid(), type: 'worked_example', order: 11,
    label: 'Worked Example 2',
    variant: 'solved_example',
    problem: "In which quadrant does the point $S(3, -5)$ lie?",
    solution: "**Step 1 — Read the signs.**\n\nThe x-coordinate is $+3$ (positive); the y-coordinate is $-5$ (negative).\n\n**Step 2 — Match to the sign-rule table.**\n\n$x > 0$ and $y < 0$ ⇒ **Quadrant IV** (lower-right).\n\n**Answer:** S lies in **Quadrant IV**."
  },
  // Block 12: worked_example 3 — point on axis
  {
    id: uid(), type: 'worked_example', order: 12,
    label: 'Worked Example 3',
    variant: 'solved_example',
    problem: "A point P has coordinates $(0, -7)$. In which quadrant does P lie?",
    solution: "**Step 1 — Check whether either coordinate is zero.**\n\nThe x-coordinate is $0$. So P lies *on* the y-axis — **not in any quadrant**.\n\n**Step 2 — Refine: which part of the y-axis?**\n\nSince $y = -7 < 0$, P lies on the **negative** part of the y-axis (below the origin).\n\n**Answer:** P lies on the **y-axis**, below the origin. It is *not* in any of the four quadrants — the axes themselves are the borders between quadrants."
  },
  // Block 13: worked_example 4 — predict the migration on sign-flip
  {
    id: uid(), type: 'worked_example', order: 13,
    label: 'Worked Example 4',
    variant: 'solved_example',
    problem: "The point $A(4, 7)$ lies in Quadrant I. If I flip the sign of *only* its x-coordinate, where does it go? What if I flip the sign of *only* its y-coordinate?",
    solution: "**Step 1 — Flipping the x-sign.**\n\n$A(4, 7)$ becomes $A'(-4, 7)$. Now $x < 0$ and $y > 0$ ⇒ Quadrant II.\n\n**Step 2 — Flipping the y-sign.**\n\nFrom $A(4, 7)$ we get $A''(4, -7)$. Now $x > 0$ and $y < 0$ ⇒ Quadrant IV.\n\n**Step 3 — Pattern observation.**\n\nFlipping the x-sign of any point in Quadrant I sends it to Quadrant II. Flipping the y-sign sends it to Quadrant IV. Flipping *both* signs (the **negative** of the point) sends it to Quadrant III. **Each sign-flip is a reflection across an axis.**\n\n**Answer:** The point migrates to Quadrant II (x-flip) and Quadrant IV (y-flip)."
  },
  // Block 14: reasoning_prompt
  {
    id: uid(), type: 'reasoning_prompt', order: 14,
    reasoning_type: 'logical',
    prompt: "A friend claims: *'The points $(3, 7)$ and $(7, 3)$ are the same point — both pairs use the same numbers and both lie in Quadrant I.'* Is this claim correct?",
    options: [
      "Yes — both pairs use the numbers 3 and 7, both x and y are positive, so they are the same point",
      "No — coordinates are an **ordered pair**: the first number is x (horizontal) and the second is y (vertical). $(3, 7)$ is 3 right, 7 up; $(7, 3)$ is 7 right, 3 up — they live in different spots inside the same Quadrant I",
      "Yes — they are the same point only when the two coordinates are equal",
      "Cannot be decided without knowing the unit on the axes"
    ],
    reveal: "Coordinates are an **ordered pair**. Even when both points sit in the *same* quadrant, swapping x and y moves you to a different location — unless x = y. In general, $(a, b) = (b, a)$ if and only if $a = b$. This is one of the four 'Think and Reflect' questions in the NCERT text — it is a small claim with a sharp consequence: ordering carries information.",
    difficulty_level: 3
  },
  // Block 15: callout[remember] — sign rules + practice list
  {
    id: uid(), type: 'callout', variant: 'remember', order: 15,
    title: 'Practice Yourself — Quick-Fire Drill',
    markdown: "Cover the answers and classify each point. (Answers below.)\n\n1. $(2, 3)$\n2. $(-1, 6)$\n3. $(-4, -2)$\n4. $(3, -8)$\n5. $(0, 5)$\n6. $(-9, 0)$\n7. $(0, 0)$\n8. $(-7, 7)$\n9. $(11, -11)$\n10. $(0.5, -0.001)$\n\n---\n\n**Answers:** 1. Q I  · 2. Q II  · 3. Q III  · 4. Q IV  · 5. y-axis (positive)  · 6. x-axis (negative)  · 7. origin  · 8. Q II  · 9. Q IV  · 10. Q IV. _If you scored 9+/10 you have it. If you scored less, the trick is the signs of the two coordinates — nothing else._"
  },
  // Block 16: ready_to_go_beyond
  {
    id: uid(), type: 'callout', variant: 'ready_to_go_beyond', order: 16,
    title: 'Ready to Go Beyond',
    markdown: "In **3-D space** (which you will study in Class 11), the three coordinate planes carve space into **8 octants**, each with its own sign pattern $(\\pm, \\pm, \\pm)$. The pattern continues: $n$ axes split $n$-D space into $2^n$ regions. Quadrants are the $n=2$ case of a much wider mathematical idea."
  },
  // Block 17: inline_quiz — 4 questions
  {
    id: uid(), type: 'inline_quiz', order: 17,
    pass_threshold: 0.6,
    questions: [
      {
        id: uid(),
        question: "Point P has coordinates $(-2, -7)$. Which quadrant?",
        options: ["I", "II", "III", "IV"],
        correct_index: 2,
        explanation: "$x = -2 < 0$ and $y = -7 < 0$ — both negative — so P is in **Quadrant III** (lower-left). The size of the numbers does not matter; only the signs do.",
        reasoning_level: 1
      },
      {
        id: uid(),
        question: "Where does the point $(0, -3)$ lie?",
        options: [
          "Quadrant III",
          "Quadrant IV",
          "On the **negative y-axis** (not in any quadrant)",
          "At the origin"
        ],
        correct_index: 2,
        explanation: "Any point of the form $(0, y)$ lies on the y-axis — its perpendicular distance from the y-axis is zero. Since $y = -3 < 0$, it lies on the **negative** part of the y-axis (below O). The axes are the *borders* between quadrants and don't belong to any of them.",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "Which transformation takes the point $(5, 2)$ from **Quadrant I** to **Quadrant III**?",
        options: [
          "Flip the sign of just the x-coordinate",
          "Flip the sign of just the y-coordinate",
          "Flip the signs of **both** coordinates",
          "Add 1 to both coordinates"
        ],
        correct_index: 2,
        explanation: "Quadrant III has $x < 0$ and $y < 0$ — *both* coordinates negative. Starting from $(5, 2)$ in Q I (both positive), flipping just one sign would move us to Q II or Q IV; flipping both signs gives $(-5, -2)$, which is in Q III. (This is the same as **reflecting through the origin**.)",
        reasoning_level: 3
      },
      {
        id: uid(),
        question: "If $x \\neq y$, then $(x, y) \\neq (y, x)$. The two coincide only when $x = y$. **Is this claim true?**",
        options: [
          "Yes — coordinates are ordered, so $(3, 7)$ and $(7, 3)$ are different points; only when $x = y$ does swapping the order leave the point unchanged",
          "No — coordinates are just unordered pairs of numbers, so $(x, y)$ and $(y, x)$ are always the same point",
          "Only true in Quadrant I",
          "Cannot be determined without knowing the unit on the axes"
        ],
        correct_index: 0,
        explanation: "This is one of NCERT's 'Think and Reflect' claims, and it is **true**. Coordinates are an **ordered pair** — order carries information. When you swap to get $(y, x)$ you move horizontally and vertically by different amounts, landing on a different point — unless $x$ and $y$ happen to be equal, in which case the swap leaves you exactly where you started. The points on the line $y = x$ are precisely the ones that satisfy $(x, y) = (y, x)$.",
        reasoning_level: 3
      }
    ]
  }
];

const page = {
  _id: uid(),
  book_id: BOOK_ID,
  chapter_number: CHAPTER_NUMBER,
  page_number: PAGE_NUMBER,
  title: 'The Four Quadrants: Where Every Point Lives',
  subtitle: 'How two axes and two signs partition the plane into four worlds — and how to name any point at a glance',
  slug: SLUG,
  blocks,
  hinglish_blocks: [],
  tags: ['quadrants', 'sign-rules', 'cartesian-plane', 'classification', 'practice'],
  published: false,
  created_at: new Date(),
  updated_at: new Date()
};

async function main() {
  if (!process.env.MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const existing = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: SLUG });
    if (existing) { console.log(`⚠️  Page "${SLUG}" already exists.`); return; }
    await db.collection('book_pages').insertOne(page);
    await db.collection('books').updateOne(
      { _id: BOOK_ID, 'chapters.number': CHAPTER_NUMBER },
      { $push: { 'chapters.$.page_ids': page._id } }
    );
    console.log(`✅ Created Math Ch${CHAPTER_NUMBER} P${PAGE_NUMBER}: ${page.title}`);
    console.log(`   ${blocks.length} blocks · ${blocks[blocks.length - 1].questions.length} quiz Qs`);
  } finally { await client.close(); }
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
