'use strict';
/**
 * Class 9 Math — Chapter 1 — Page 9
 * "Distance Between Two Points: From Axes to Diagonals"
 * Section 1.4 intro — Triangle ADM example, axis-aligned subtraction →
 * diagonal via Baudhāyana–Pythagoras, leading naturally to AD = 5.
 *
 * Run: node scripts/create_math_ch1_p9_distance_between_points.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'distance-between-two-points';
const CHAPTER_NUMBER = 1;
const PAGE_NUMBER = 9;

function uid() { return randomUUID(); }

const blocks = [
  // Block 0: hero banner
  {
    id: uid(), type: 'image', order: 0,
    src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic visualisation: a single straight line of golden light cuts diagonally across a deep starry sky, with two faint pillars of light extending from its endpoints — one horizontal, one vertical — meeting at a right angle below it, evoking the secret triangle hidden inside any diagonal',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single straight line of bright golden light cuts diagonally across a deep, starry navy sky. From each endpoint of this diagonal, a faint pillar of light extends — one horizontal, one vertical — meeting at a right angle just below the diagonal, forming a perfect right triangle visible only as overlapping beams of light. The image conveys: the distance between two points in a plane is just the hypotenuse of a hidden right triangle. Painterly cinematic illustration in the style of mathematical wonder. Dark background. No text, no labels."
  },
  // Block 1: curiosity_prompt
  {
    id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Two points sit on the same horizontal line at $(2, 5)$ and $(7, 5)$. The distance between them is **5 units** — you found this on a previous page just by subtracting the x-coordinates.\n\nNow let me move one of those points slightly: $(2, 5)$ stays, but the other becomes $(7, 1)$. The two points are no longer on the same line. **What is the distance between them now?**\n\nIs it still 5? More? Less? And how would you compute it without a ruler?",
    hint: "If you draw a horizontal line from one point and a vertical line from the other, you build a right triangle. The diagonal you want is its hypotenuse.",
    reveal: "The distance is exactly **5 units** — but for a different reason. The new pair forms a 3-4-5 right triangle, and Baudhāyana wrote down the rule for finding hypotenuses 2,800 years ago. On this page you'll see how that ancient rule turns into the **distance formula** of modern coordinate geometry."
  },
  // Block 2: Baudhayana fun_fact verse
  {
    id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'बौधायन शुल्बसूत्र — १.१२',
    markdown: "_The Baudhāyana–Pythagoras Theorem_\n\n### दीर्घचतुरस्रस्य अक्ष्णयारज्जुः\n### पार्श्वमानी तिर्यङ्मानी च\n### यत् पृथग् भूते कुरुतः तदुभयं करोति॥\n\n*(dīrghacaturasrasya akṣṇayārajjuḥ /  pārśvamānī tiryaṅmānī ca /  yat pṛthag bhūte kurutaḥ tadubhayaṃ karoti)*\n\n---\n\n*'किसी आयत के विकर्ण-पर बना वर्ग, उसकी दोनों भुजाओं पर बने वर्गों के योग के बराबर होता है।'*\n\n*'The square on the diagonal of a rectangle equals the sum of the squares on the two sides.'*\n\n**This is the Pythagoras theorem.** Baudhāyana wrote it down in the *Śulba-sūtra* around **800 BCE** — over 300 years before Pythagoras. In modern symbols: $a^2 + b^2 = c^2$. You will use this verse, exactly, on every problem on this page."
  },
  // Block 3: heading
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'Easy distances first: along an axis or parallel to it' },
  // Block 4: text
  {
    id: uid(), type: 'text', order: 4,
    markdown: "On previous pages you found distances between points whenever the segment between them was **parallel to one of the axes**. The rule was simple subtraction:\n\n- Two points $(x_1, y)$ and $(x_2, y)$ on the **same horizontal line** (same y-coordinate): the distance is $|x_2 - x_1|$.\n- Two points $(x, y_1)$ and $(x, y_2)$ on the **same vertical line** (same x-coordinate): the distance is $|y_2 - y_1|$.\n\nFor example, in Reiaan's room (Page 5), the room door $D_1(7.5, 0)$ to $R_1(11.5, 0)$ is horizontal — its width is $|11.5 - 7.5| = 4$ ft. Easy.\n\n**But the segment from $(2, 5)$ to $(7, 1)$ is *not* parallel to either axis.** Subtracting the x-coordinates gives 5, subtracting the y-coordinates gives 4 — neither of these is the distance between the two points. They are something else: the **legs** of a right triangle whose hypotenuse is the distance we want.\n\nThis is the moment Baudhāyana's theorem becomes a tool of coordinate geometry."
  },
  // Block 5: heading
  { id: uid(), type: 'heading', order: 5, level: 2, text: 'Triangle ADM: the worked example' },
  // Block 6: text — set up triangle ADM
  {
    id: uid(), type: 'text', order: 6,
    markdown: "Consider three points in Quadrant I:\n\n- $A = (3, 4)$\n- $D = (7, 1)$\n- $M = (9, 6)$\n\nDraw segments $AD$, $DM$, $MA$ on graph paper. The result is a triangle entirely inside Quadrant I. **Triangle ADM is acute-angled** (all three angles are less than 90°). Now we ask the obvious question: how long are its sides $AD$, $DM$, $MA$?\n\nNone of these segments is parallel to an axis. Plain subtraction will not give us any of the three side lengths directly. But we can build a **right triangle** for each side, where the side is the hypotenuse and the legs are parallel to the axes."
  },
  // Block 7: image — Fig 1.6 triangle ADM
  {
    id: uid(), type: 'image', order: 7,
    src: '', width: 'full',
    caption: '📸 Fig. 1.6 — Triangle ADM with $A(3, 4)$, $D(7, 1)$, $M(9, 6)$, drawn entirely inside Quadrant I.',
    alt: 'A green graph-paper Cartesian plane on a dark background. Three points are plotted in Quadrant I: A = (3, 4), D = (7, 1), M = (9, 6). Each is labelled with its coordinates. The three points are connected by line segments AD, DM, MA, forming a triangle that lies entirely in the upper-right region. The x-axis is labelled with integers from −1 to 10; the y-axis from 0 to 6.',
    generation_prompt: "Cartesian plane diagram on green graph paper over a dark background. Two thick green axes meet at the origin. Tick marks at every integer from −1 to +10 on x-axis and from 0 to +6 on y-axis. Three points plotted as small dark dots, each labelled with both name and coordinates: A(3, 4), D(7, 1), M(9, 6). Three green line segments connect them to form an acute-angled triangle ADM in Quadrant I. Style: clean educational mathematics illustration. Dark background, orange accent labels, clean technical illustration style."
  },
  // Block 8: text — set up the right triangle for AD
  {
    id: uid(), type: 'text', order: 8,
    markdown: "**Focus on side $AD$** first. The endpoints are $A(3, 4)$ and $D(7, 1)$. To find $AD$:\n\n1. Drop a vertical line from $A$ down to the level of $D$ (i.e. to $y = 1$). Call the foot $C$. Then $C = (3, 1)$.\n2. Now we have three points: $A(3, 4)$, $C(3, 1)$, $D(7, 1)$. Notice that $\\angle ACD = 90°$ — $C$ is directly below $A$ and directly left of $D$, so the segment $AC$ is vertical and the segment $CD$ is horizontal. **Triangle $ACD$ is right-angled at $C$.**\n3. Now compute the two legs by simple subtraction:\n   - $CD$ = horizontal distance = $|7 - 3| = 4$\n   - $AC$ = vertical distance = $|4 - 1| = 3$\n4. By Baudhāyana–Pythagoras: $AD^2 = AC^2 + CD^2 = 3^2 + 4^2 = 9 + 16 = 25$, so $AD = \\sqrt{25} = 5$.\n\nThe diagonal distance from $A(3, 4)$ to $D(7, 1)$ is exactly **5 units**. This is the same 3-4-5 right triangle Baudhāyana would have used to lay out a perfect right angle on the ground 2,800 years ago — *and it works because of the same theorem he proved*.\n\nThe pattern is so important it deserves a name. **The distance between two points in a plane is the hypotenuse of the right triangle whose legs are parallel to the axes.**"
  },
  // Block 9: simulation — distance-explorer (Triangle View)
  {
    id: uid(), type: 'simulation', order: 9,
    simulation_id: 'distance-explorer',
    title: 'Try It: Build the Right Triangle for Any Two Points',
  },
  // Block 10: worked_example 1 — AD = 5 by Pythagoras
  {
    id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 1 — Find AD',
    variant: 'solved_example',
    problem: "Find the length of the segment from $A(3, 4)$ to $D(7, 1)$.",
    solution: "**Step 1 — Find the legs of the right triangle.**\n\n- Horizontal leg = $|x_D - x_A| = |7 - 3| = 4$\n- Vertical leg = $|y_A - y_D| = |4 - 1| = 3$\n\n**Step 2 — Apply Baudhāyana–Pythagoras.**\n\n$$AD^2 = 4^2 + 3^2 = 16 + 9 = 25$$\n\n**Step 3 — Take the square root.**\n\n$$AD = \\sqrt{25} = 5$$\n\n**Answer:** $AD = 5$ units."
  },
  // Block 11: reasoning_prompt
  {
    id: uid(), type: 'reasoning_prompt', order: 11,
    reasoning_type: 'logical',
    prompt: "Notice that for $A(3, 4)$ and $D(7, 1)$, both **simple coordinate subtractions** give: $|7 - 3| = 4$ and $|4 - 1| = 3$. Neither of these is the distance $AD = 5$.\n\nWhy is the distance not just one of these subtractions, the way it was for points on a horizontal or vertical line?",
    options: [
      "Because the distance formula gets harder for diagonal segments — the answer is hidden in random ways",
      "Because $A$ and $D$ do not share an axis; $|x_2 - x_1|$ alone tells you the **horizontal** distance, $|y_2 - y_1|$ alone tells you the **vertical** distance, and the **diagonal** distance is the *hypotenuse* of the right triangle whose legs are these two — combining them by Baudhāyana–Pythagoras",
      "Because subtraction does not work in Quadrant I",
      "Because coordinates are unreliable when both differ"
    ],
    reveal: "The two simple subtractions give you the two **legs** of a right triangle — the horizontal and vertical separations of the two points. But the *actual distance* between the points is the **diagonal** (hypotenuse) of that triangle. The hypotenuse of a 3-4 right triangle is **not** 3, **not** 4, and **not** 7. By Baudhāyana–Pythagoras, it is $\\sqrt{3^2 + 4^2} = 5$. **When the segment is parallel to an axis, one of the legs is zero, so the hypotenuse equals the other leg — that's why simple subtraction worked there.** When neither leg is zero, you need the full theorem.",
    difficulty_level: 3
  },
  // Block 12: worked_example 2 — DM
  {
    id: uid(), type: 'worked_example', order: 12,
    label: 'Worked Example 2 — Find DM',
    variant: 'solved_example',
    problem: "Find the length of the segment from $D(7, 1)$ to $M(9, 6)$.",
    solution: "**Step 1 — Find the legs.**\n\n- Horizontal leg = $|x_M - x_D| = |9 - 7| = 2$\n- Vertical leg = $|y_M - y_D| = |6 - 1| = 5$\n\n**Step 2 — Apply Baudhāyana–Pythagoras.**\n\n$$DM^2 = 2^2 + 5^2 = 4 + 25 = 29$$\n\n**Step 3 — Take the square root.**\n\n$$DM = \\sqrt{29} \\approx 5.39$$\n\n**Answer:** $DM = \\sqrt{29}$ units (≈ 5.39 units).\n\n*Note:* Unlike the previous problem, $\\sqrt{29}$ is not a whole number — it is **irrational**. This is normal in coordinate geometry. Most distances between integer-coordinate points are irrational; only certain special pairs (like 3-4-5, 5-12-13) give nice whole-number hypotenuses."
  },
  // Block 13: worked_example 3 — MA
  {
    id: uid(), type: 'worked_example', order: 13,
    label: 'Worked Example 3 — Find MA',
    variant: 'solved_example',
    problem: "Find the length of the segment from $M(9, 6)$ to $A(3, 4)$.",
    solution: "**Step 1 — Find the legs.**\n\n- Horizontal leg = $|x_A - x_M| = |3 - 9| = 6$\n- Vertical leg = $|y_A - y_M| = |4 - 6| = 2$\n\n**Step 2 — Apply Baudhāyana–Pythagoras.**\n\n$$MA^2 = 6^2 + 2^2 = 36 + 4 = 40$$\n\n**Step 3 — Take the square root.**\n\n$$MA = \\sqrt{40} = 2\\sqrt{10} \\approx 6.32$$\n\n**Answer:** $MA = \\sqrt{40} = 2\\sqrt{10}$ units (≈ 6.32 units).\n\n**Triangle ADM has sides:** $AD = 5$, $DM = \\sqrt{29} \\approx 5.39$, $MA = 2\\sqrt{10} \\approx 6.32$. Notice all three are different — this is a **scalene** triangle, and (since no side² equals the sum of the other two squared) it is **acute-angled**. ✓"
  },
  // Block 14: callout[india_science]
  {
    id: uid(), type: 'callout', variant: 'india_science', order: 14,
    title: "India's Scientific Contributions — Baudhāyana, the Original Source",
    markdown: "Baudhāyana, who lived around **800 BCE**, wrote the *Śulba-sūtra* — *'the rules of the cord'* — as a manual for laying down sacred Vedic fire-altars. Hidden inside that practical text is the earliest known statement of the theorem we now call **Pythagoras' theorem**.\n\nThe Pythagoras you may have heard of (a Greek philosopher) lived around **570–495 BCE** — **about 300 years after Baudhāyana**. The theorem reached Greece by trade and translation, but the result itself was Indian first. Some historians of mathematics now write \"the Baudhāyana–Pythagoras theorem\" precisely to acknowledge this lineage.\n\nEvery time you compute a distance in coordinate geometry, you are using a result that an Indian priest wrote down 2,800 years ago to make sure the corner of an altar was square. **The mathematics has not changed; the names have.**"
  },
  // Block 15: callout[remember] — practice list
  {
    id: uid(), type: 'callout', variant: 'remember', order: 15,
    title: 'Practice Yourself — Distances by Pythagoras',
    markdown: "Find the distance between each pair of points. Cover the answers and try it.\n\n1. $(0, 0)$ and $(3, 4)$\n2. $(1, 2)$ and $(4, 6)$\n3. $(-2, 1)$ and $(1, 5)$\n4. $(-3, -4)$ and $(0, 0)$\n5. $(5, 12)$ and $(0, 0)$\n6. $(2, 7)$ and $(2, 12)$\n7. $(-1, 3)$ and $(7, 9)$\n8. $(0, 0)$ and $(8, 15)$\n9. $(6, 0)$ and $(0, 8)$\n10. $(-3, 2)$ and $(3, 2)$\n\n---\n\n**Answers:** 1. 5  · 2. 5  · 3. 5  · 4. 5  · 5. 13  · 6. 5 (parallel to y-axis)  · 7. 10  · 8. 17  · 9. 10  · 10. 6 (parallel to x-axis).\n\n*Notice:* Six of these involve **3-4-5**, **5-12-13**, **6-8-10**, or **8-15-17** Pythagorean triples — these are favourites in textbook problems because they give whole-number answers. Other pairs give $\\sqrt{}$ answers, which are equally valid."
  },
  // Block 16: ready_to_go_beyond
  {
    id: uid(), type: 'callout', variant: 'ready_to_go_beyond', order: 16,
    title: 'Ready to Go Beyond',
    markdown: "On the **next page** the same right-triangle technique becomes a single, named formula — the **distance formula** — that lets you compute the distance between any two points without redrawing the triangle each time. In **Class 10** you'll meet the **midpoint formula** and the **section formula**, both close cousins. In **3-D** (Class 11), the formula extends naturally to $\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$ — same idea, one more dimension.\n\nThe theorem Baudhāyana wrote in 800 BCE has not stopped working."
  },
  // Block 17: inline_quiz — 4 questions
  {
    id: uid(), type: 'inline_quiz', order: 17,
    pass_threshold: 0.6,
    questions: [
      {
        id: uid(),
        question: "Two points are at $(3, 0)$ and $(8, 0)$. What is the distance between them?",
        options: ["3", "5", "8", "$\\sqrt{73}$"],
        correct_index: 1,
        explanation: "Both points have $y = 0$ — they lie on the x-axis. The segment between them is **horizontal**, so the distance is just the difference of x-coordinates: $|8 - 3| = 5$. (No Pythagoras needed when one of the legs is zero.)",
        reasoning_level: 1
      },
      {
        id: uid(),
        question: "Find the distance from $(1, 2)$ to $(4, 6)$.",
        options: ["3", "4", "**5**", "7"],
        correct_index: 2,
        explanation: "Horizontal leg $= |4 - 1| = 3$. Vertical leg $= |6 - 2| = 4$. By Pythagoras: $\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$. (This is the classic 3-4-5 right triangle.)",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "Two points $A$ and $B$ are at $(2, 5)$ and $(2, 12)$ respectively. **Without** computing a hypotenuse, find $AB$.",
        options: ["$\\sqrt{49}$", "**7**", "$\\sqrt{169}$", "Not enough information"],
        correct_index: 1,
        explanation: "Both points share $x = 2$ — they lie on the same **vertical** line. The horizontal leg is $|2 - 2| = 0$, so the distance is just the vertical leg: $|12 - 5| = 7$. The Pythagorean shortcut gives $\\sqrt{0^2 + 7^2} = \\sqrt{49} = 7$ — the same answer, but you don't need to take a square root if you notice the alignment.",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "A flying drone moves from $(0, 0)$ to $(6, 8)$ in a straight line. **How far has it travelled?**",
        options: [
          "$6 + 8 = 14$ units (sum of horizontal and vertical movement)",
          "**10 units**, by Pythagoras: $\\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$",
          "14 units, the *taxicab* distance",
          "Cannot be determined without the speed of the drone"
        ],
        correct_index: 1,
        explanation: "The drone moves in a **straight line** — the diagonal of a right triangle with legs 6 and 8. By Baudhāyana-Pythagoras: $\\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$ units. (The 6 + 8 = 14 figure would be the *taxicab distance* — the distance you'd travel if you could only move along axes — and it shows up in city-block navigation, not in straight-line flight.)",
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
  title: 'Distance Between Two Points: From Axes to Diagonals',
  subtitle: 'How a 2,800-year-old theorem turns coordinate subtraction into the distance between any two points',
  slug: SLUG,
  blocks,
  hinglish_blocks: [],
  tags: ['distance', 'pythagoras', 'baudhayana', 'right-triangle', 'practice'],
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
