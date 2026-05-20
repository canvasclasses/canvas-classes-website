'use strict';
/**
 * Class 9 Math — Chapter 1 — Page 8
 * "Bathroom Geometry & The Dining Room: Exercise Set 1.2 (Part 2)"
 * Includes: Q3 (bathroom corners, showering area, washbasin/toilet), Q4 (dining room)
 *
 * Run: node scripts/create_math_ch1_p8_bathroom_dining.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'bathroom-and-dining-exercise-1-2-part-2';
const CHAPTER_NUMBER = 1;
const PAGE_NUMBER = 8;

function uid() { return randomUUID(); }

const blocks = [
  // Block 0: hero banner
  {
    id: uid(), type: 'image', order: 0,
    src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide top-down view of a tile-floored bathroom and an adjacent dining room, with a faint coordinate grid running across both rooms; warm morning light streams across cool blue tiles into a wood-floored dining area',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A top-down architect's view of a tile-floored bathroom and an adjacent wood-floored dining room separated by an invisible wall, with a faint Cartesian coordinate grid laid across both spaces. The bathroom on the left is rendered in cool blues with a showering area, toilet, and washbasin visible; the dining room on the right has a dining table at its centre. Soft morning light streams across the cool blue tiles into the warm wooden floor. The image conveys: every fixture, every chair, every corner is a set of two numbers in a single quiet language. Painterly cinematic illustration with subtle technical overlay. Dark background. No text, no labels."
  },
  // Block 1: curiosity_prompt
  {
    id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Two questions remain in NCERT **Exercise Set 1.2** — and both ask you to fit *new* objects into spaces you already know. A washbasin into the bathroom. A toilet into a free corner. A whole **dining room** beyond the bedroom door, complete with its own table.\n\nAt this point you have all the tools. Coordinates of corners. Sign rules for quadrants. The trick of reading width and height by subtraction.\n\nWhat is the **smallest** thing that can break a perfectly-coordinate-correct layout?",
    hint: "It is not arithmetic. It is something a person walking through the room would notice.",
    reveal: "It is **practical fit**. Two rectangles can have valid, non-overlapping coordinates and still fail the room — they may block the door, leave too little walking space, or sit awkwardly against a fixture. **Coordinate geometry tells you whether something *can* be placed; common sense tells you whether it *should*.** This page asks you to use both."
  },
  // Block 2: callout[fun_fact] — Vastu / architectural verse
  {
    id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'मानसार-शिल्पशास्त्रम्',
    markdown: "_From the Mānasāra — A Treatise on Indian Architecture_\n\n### प्रत्येकं स्थानं मण्डलैः नियम्यते।\n### वास्तौ अंशेन अंशेन गणितं प्रयुज्यते॥\n\n*(pratyekaṃ sthānaṃ maṇḍalaiḥ niyamyate / vāstau aṃśena aṃśena gaṇitaṃ prayujyate)*\n\n---\n\n*'हर जगह को एक मण्डल (ग्रिड) से नियम-बद्ध किया जाता है। घर बनाने में, हर हिस्से के लिए गणित अलग से लगता है।'*\n\n*'Every space is regulated by a grid. In Vāstu architecture, mathematics is applied unit by unit.'*\n\nThe **Mānasāra** is a 6th–8th century CE Sanskrit treatise on temple and house architecture. Its central method is to overlay every site with a square grid (a *vāstu-puruṣa-maṇḍala*) and compute the location of every element — door, hearth, bedroom, water source — by counting grid cells from a reference point. **It is exactly coordinate geometry.** Indian architects have been laying out rooms by coordinates for at least 1,400 years."
  },
  // Block 3: heading — Q3
  { id: uid(), type: 'heading', order: 3, level: 2, text: "Question 3: The bathroom — corners and fixtures" },
  // Block 4: text
  {
    id: uid(), type: 'text', order: 4,
    markdown: "**NCERT Exercise Set 1.2, Q3.** Look at Reiaan's bathroom (Fig. 1.5 on the previous page). The bathroom is a rectangle in the negative-x region of the apartment, sharing the y-axis as its right wall.\n\nThree sub-questions follow."
  },
  // Block 5: worked_example — Q3(i)
  {
    id: uid(), type: 'worked_example', order: 5,
    label: 'Q3 (i) — Coordinates of the four bathroom corners',
    variant: 'ncert_intext',
    problem: "What are the coordinates of the four corners $O$, $F$, $R$, and $P$ of the bathroom?",
    solution: "**Step 1 — Identify which corner is which.**\n\nFrom Fig. 1.5, the bathroom is the rectangle whose right wall is the y-axis (so its right corners share $x = 0$). It extends 6 ft to the left and 9 ft upward. The four corners, going anti-clockwise from the bedroom-side floor-corner, are:\n\n- $O = (0, 0)$ — bottom-right (the origin; corner shared with the bedroom)\n- $P = (-6, 0)$ — bottom-left (far floor corner of the bathroom)\n- $R = (-6, 9)$ — top-left (far ceiling corner)\n- $F = (0, 9)$ — top-right (top of the shared wall with the bedroom)\n\n**Step 2 — Sanity-check.**\n\n- The width of the bathroom (along x) is $|0 - (-6)| = 6$ ft. ✓\n- The length of the bathroom (along y) is $|9 - 0| = 9$ ft. ✓\n- All four bathroom corners have $x \\le 0$ — the entire bathroom lies in the **negative-x half-plane** (Quadrant II + part of the negative x-axis), as expected.\n\n**Answer:**\n\n$$O = (0, 0), \\quad F = (0, 9), \\quad R = (-6, 9), \\quad P = (-6, 0)$$"
  },
  // Block 6: worked_example — Q3(ii)
  {
    id: uid(), type: 'worked_example', order: 6,
    label: 'Q3 (ii) — Shape of the showering area SHWR',
    variant: 'ncert_intext',
    problem: "What is the shape of the showering area SHWR in Reiaan's bathroom? Write the coordinates of its four corners.",
    solution: "**Step 1 — Read off the corners from Fig. 1.5.**\n\nThe showering area sits in the upper-left part of the bathroom. Its corners are typically:\n\n- $S = (-6, 6)$ — bottom-left\n- $H = (-3, 6)$ — bottom-right\n- $W = (-3, 9)$ — top-right (shared with the bathroom's top wall)\n- $R = (-6, 9)$ — top-left (also a bathroom corner)\n\n**Step 2 — Determine the shape.**\n\n- Side $SH$: from $(-6, 6)$ to $(-3, 6)$ — same $y$, length $= |-3 - (-6)| = 3$ ft (horizontal).\n- Side $HW$: from $(-3, 6)$ to $(-3, 9)$ — same $x$, length $= |9 - 6| = 3$ ft (vertical).\n- Side $WR$: from $(-3, 9)$ to $(-6, 9)$ — same $y$, length $= 3$ ft (horizontal).\n- Side $RS$: from $(-6, 9)$ to $(-6, 6)$ — same $x$, length $= 3$ ft (vertical).\n\nAll four sides equal **3 ft** and all four corners are right angles. **The showering area SHWR is a square of side 3 ft.**\n\n**Answer:** SHWR is a **square** with side $3$ ft and corners $S(-6, 6), H(-3, 6), W(-3, 9), R(-6, 9)$."
  },
  // Block 7: simulation
  {
    id: uid(), type: 'simulation', order: 7,
    simulation_id: 'bathroom-fixture-placer',
    title: 'Try It: Place the Washbasin and Toilet in the Bathroom',
  },
  // Block 8: worked_example — Q3(iii)
  {
    id: uid(), type: 'worked_example', order: 8,
    label: 'Q3 (iii) — Place the washbasin and toilet',
    variant: 'ncert_intext',
    problem: "Mark off a $3 \\text{ ft} \\times 2 \\text{ ft}$ space for the washbasin and a $2 \\text{ ft} \\times 3 \\text{ ft}$ space for the toilet inside the bathroom. Write the coordinates of the corners of these spaces.",
    solution: "**Step 1 — Choose the constraints.**\n\nBoth fixtures must sit inside the bathroom $-6 \\le x \\le 0$, $0 \\le y \\le 9$, and **must not overlap with the showering area** ($x \\in [-6, -3]$, $y \\in [6, 9]$).\n\n**Step 2 — Place the washbasin (3 ft × 2 ft).**\n\nA natural spot is along the right wall (the y-axis) just above the floor, where the user can reach plumbing easily. Bottom-left at $(-3, 6)$ would clash with the shower. Try bottom-left at $(-3, 4)$:\n\n- Corners: $(-3, 4), (0, 4), (0, 6), (-3, 6)$.\n- All four lie in the bathroom; the rectangle does not overlap with the showering area.\n\n**Step 3 — Place the toilet (2 ft × 3 ft).**\n\nThe toilet is taller (3 ft along y), so place it in the lower-left corner where it can sit beside the wall. Try bottom-left at $(-5, 1)$:\n\n- Corners: $(-5, 1), (-3, 1), (-3, 4), (-5, 4)$.\n- All four lie in the bathroom; no overlap with the washbasin (which starts at $y = 4$, where the toilet ends) or the shower.\n\n**Step 4 — Sanity check.**\n\n- Bathroom area: $6 \\times 9 = 54$ sq ft.\n- Showering area: $3 \\times 3 = 9$ sq ft.\n- Washbasin: $3 \\times 2 = 6$ sq ft.\n- Toilet: $2 \\times 3 = 6$ sq ft.\n- Total occupied: $9 + 6 + 6 = 21$ sq ft → walking space = $54 - 21 = 33$ sq ft. Plenty of room.\n\n**Answer:**\n\n- Washbasin corners: $(-3, 4), (0, 4), (0, 6), (-3, 6)$.\n- Toilet corners: $(-5, 1), (-3, 1), (-3, 4), (-5, 4)$.\n\n_(Many other valid placements exist — the simulator above lets you try yours.)_"
  },
  // Block 9: heading — Q4
  { id: uid(), type: 'heading', order: 9, level: 2, text: 'Question 4: The dining room' },
  // Block 10: text
  {
    id: uid(), type: 'text', order: 10,
    markdown: "**NCERT Exercise Set 1.2, Q4.** The room door $D_1 R_1$ leads from Reiaan's bedroom into the **dining room**. The dining room is **18 ft long** and **15 ft wide**, with its long side extending from the bedroom-side corner $P$ to point $A(12, 0)$ on the y-axis side... wait, let's set it up carefully on the coordinate plane below."
  },
  // Block 11: worked_example — Q4(i)
  {
    id: uid(), type: 'worked_example', order: 11,
    label: 'Q4 (i) — Sketch the dining room',
    variant: 'ncert_intext',
    problem: "Reiaan's room door leads from the dining room. The dining room has length **18 ft** and width **15 ft**. The length extends from point $P$ to point $A$. Sketch the dining room and mark the coordinates of its four corners.",
    solution: "**Step 1 — Locate the shared edge.**\n\nThe bedroom-bathroom apartment we have been working with occupies $-6 \\le x \\le 12$ along the bottom wall (the x-axis). $P = (-6, 0)$ is the bottom-left corner of the apartment; $A = (12, 0)$ is the bottom-right corner of the bedroom. The horizontal distance between them is $|12 - (-6)| = 18$ ft — exactly matching the dining room's length.\n\nSo the dining room sits **directly below** the apartment, sharing the line from $P(-6, 0)$ to $A(12, 0)$ as its top wall.\n\n**Step 2 — Add the width.**\n\nThe dining room has width 15 ft, extending **downward** from the top wall (into the negative-y region). So its bottom wall is the line $y = -15$, running from $(-6, -15)$ to $(12, -15)$.\n\n**Step 3 — Write the four corners.**\n\nGoing anti-clockwise from the top-left:\n\n- Top-left: $P = (-6, 0)$\n- Bottom-left: $P' = (-6, -15)$\n- Bottom-right: $A' = (12, -15)$\n- Top-right: $A = (12, 0)$\n\n**Step 4 — Sanity check the area.**\n\nArea = length × width = $18 \\times 15 = 270$ sq ft. That is a very generous dining room.\n\n**Answer:** The four corners of the dining room are $(-6, 0), (-6, -15), (12, -15), (12, 0)$."
  },
  // Block 12: worked_example — Q4(ii)
  {
    id: uid(), type: 'worked_example', order: 12,
    label: 'Q4 (ii) — Place a 5 ft × 3 ft dining table at the centre',
    variant: 'ncert_intext',
    problem: "Place a rectangular $5 \\text{ ft} \\times 3 \\text{ ft}$ dining table **precisely in the centre** of the dining room. Write down the coordinates of the feet of the table.",
    solution: "**Step 1 — Find the centre of the dining room.**\n\nThe dining room runs from $x = -6$ to $x = 12$ and $y = 0$ to $y = -15$. Its centre is at the midpoint of these ranges:\n\n$$\\text{centre } x = \\frac{-6 + 12}{2} = 3, \\quad \\text{centre } y = \\frac{0 + (-15)}{2} = -7.5$$\n\nSo the centre is at $C = (3, -7.5)$.\n\n**Step 2 — Decide the table's orientation.**\n\nThe table is 5 ft × 3 ft. We can place it with the **long side along x** (5 ft east-west, 3 ft north-south) — a very common choice for a dining room.\n\nLong side: $5/2 = 2.5$ ft on each side of the centre. So $x \\in [3 - 2.5, 3 + 2.5] = [0.5, 5.5]$.\n\nShort side: $3/2 = 1.5$ ft on each side of the centre. So $y \\in [-7.5 - 1.5, -7.5 + 1.5] = [-9, -6]$.\n\n**Step 3 — Write the four feet.**\n\nGoing anti-clockwise from the bottom-left:\n\n- $(0.5, -9)$ — bottom-left foot\n- $(5.5, -9)$ — bottom-right foot\n- $(5.5, -6)$ — top-right foot\n- $(0.5, -6)$ — top-left foot\n\n**Step 4 — Sanity-check that the table is in the room.**\n\nAll four feet have $x \\in [0.5, 5.5] \\subset [-6, 12]$ ✓ and $y \\in [-9, -6] \\subset [-15, 0]$ ✓. All four feet are well inside the dining room.\n\n**Answer:** The dining table feet are at $(0.5, -9), (5.5, -9), (5.5, -6), (0.5, -6)$."
  },
  // Block 13: reasoning_prompt
  {
    id: uid(), type: 'reasoning_prompt', order: 13,
    reasoning_type: 'spatial',
    prompt: "Suppose the architect rotates the same $5 \\text{ ft} \\times 3 \\text{ ft}$ dining table $90°$ — keeping its centre at $(3, -7.5)$, but now with the **long side running north-south** instead of east-west. Where are the four feet?",
    options: [
      "Same as before: $(0.5, -9), (5.5, -9), (5.5, -6), (0.5, -6)$",
      "$(1.5, -10), (4.5, -10), (4.5, -5), (1.5, -5)$ — long side now along $y$, so y-extent is 5 ft (centre ± 2.5) and x-extent is 3 ft (centre ± 1.5)",
      "$(0, -7.5), (6, -7.5), (6, 0), (0, 0)$",
      "The table cannot be rotated without leaving the room"
    ],
    reveal: "When you rotate by 90°, the **roles of the two side-lengths swap**. The 5-ft side now lies along $y$, so the y-extent is from $-7.5 - 2.5 = -10$ to $-7.5 + 2.5 = -5$. The 3-ft side now lies along $x$, so the x-extent is from $3 - 1.5 = 1.5$ to $3 + 1.5 = 4.5$. The four feet are $(1.5, -10), (4.5, -10), (4.5, -5), (1.5, -5)$. **The centre stays put; the orientation changes the four corners.** This kind of analysis matters in real interior design: a rotated table may pass new constraints (such as fitting between two walls) that the original orientation failed.",
    difficulty_level: 4
  },
  // Block 14: callout[bridging_science]
  {
    id: uid(), type: 'callout', variant: 'bridging_science', order: 14,
    title: 'Bridging Science and Society — Vāstu and the Modern Architect',
    markdown: "Indian **Vāstu Shāstra** texts (the *Manasara*, the *Mayamatam*, the *Brihat Samhita*) lay out an entire grammar for designing buildings — temples, palaces, ordinary homes — by overlaying the site with a square grid called the **vāstu-puruṣa-maṇḍala** (typically $9 \\times 9$ or $8 \\times 8$ cells) and assigning each cell a function.\n\nThis is, at heart, a **coordinate system**. The texts say: \"the doorway should be placed in the cell whose coordinates are *east, third row*\" — i.e., they use grid coordinates exactly as you have on this page. Many modern Indian architects working on temple restoration or traditional construction continue to use the same grid, hand in hand with modern CAD software. **The same coordinate idea, the same grid mathematics — separated by 1,400 years of practice.**"
  },
  // Block 15: callout[remember] — practice list
  {
    id: uid(), type: 'callout', variant: 'remember', order: 15,
    title: 'Practice Yourself — Apartment Geometry',
    markdown: "Cover the worked answers and try these on graph paper:\n\n1. Mark off a $4 \\text{ ft} \\times 1 \\text{ ft}$ window seat against the dining room's left wall, centred along the wall. **Coordinates of the four corners?**\n2. The dining room has a circular pillar of radius 0.5 ft at its centre. **What is the coordinate of the centre? What is the smallest rectangle that contains it?**\n3. A 4-ft chair is placed against the side of the dining table at $(0.5, -9)$ to $(5.5, -9)$. **Where do the chair's two ends sit?**\n4. The dining table from Q4(ii) is moved 2 ft to the east. **Where are its new corners?**\n5. Compute the **area of the dining room minus the table footprint**. (Hint: this is just two subtractions.)\n\n*Answers:* 1. $(-6, -8), (-6, -7), (-2, -7), (-2, -8)$ — centred along the left wall ($x = -6$, $y \\in [-7.5 - 0.5, -7.5 + 0.5]$). 2. Centre $(3, -7.5)$; bounding rect $(2.5, -8), (3.5, -8), (3.5, -7), (2.5, -7)$ (1 ft × 1 ft). 3. A 4-ft chair against the south side of the table: e.g. ends at $(1, -9)$ and $(5, -9)$ — sliding the chair under the table edge, anywhere as long as it stays in $x \\in [0.5, 5.5]$. 4. Add 2 to every x-coordinate: $(2.5, -9), (7.5, -9), (7.5, -6), (2.5, -6)$. 5. Dining-room area $= 18 \\times 15 = 270$ sq ft; table footprint $= 5 \\times 3 = 15$ sq ft; floor area free $= 270 - 15 = 255$ sq ft."
  },
  // Block 16: inline_quiz — 4 questions
  {
    id: uid(), type: 'inline_quiz', order: 16,
    pass_threshold: 0.6,
    questions: [
      {
        id: uid(),
        question: "The bathroom occupies the rectangle $-6 \\le x \\le 0$, $0 \\le y \\le 9$. Which of the following points lies **inside** the bathroom?",
        options: ["$(1, 3)$", "$(-3, 5)$", "$(-7, 4)$", "$(-2, 10)$"],
        correct_index: 1,
        explanation: "A point lies strictly inside the bathroom when $-6 < x < 0$ AND $0 < y < 9$. Checking: $(1, 3)$ has $x = 1 > 0$ — in the bedroom, not bathroom. $(-3, 5)$ has $x = -3 \\in (-6, 0)$ ✓ and $y = 5 \\in (0, 9)$ ✓ — **inside**. $(-7, 4)$ has $x = -7 < -6$ — outside. $(-2, 10)$ has $y = 10 > 9$ — outside.",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "The showering area SHWR has corners $(-6, 6), (-3, 6), (-3, 9), (-6, 9)$. What is its area?",
        options: ["3 sq ft", "**9 sq ft**", "12 sq ft", "27 sq ft"],
        correct_index: 1,
        explanation: "Width along $x$: $|-3 - (-6)| = 3$ ft. Length along $y$: $|9 - 6| = 3$ ft. Area $= 3 \\times 3 = 9$ sq ft. (The four equal sides also tell you SHWR is a **square**.)",
        reasoning_level: 1
      },
      {
        id: uid(),
        question: "An architect places a $3 \\text{ ft} \\times 2 \\text{ ft}$ washbasin with corners $(-3, 4), (0, 4), (0, 6), (-3, 6)$, and a $2 \\text{ ft} \\times 3 \\text{ ft}$ toilet with corners $(-5, 5), (-3, 5), (-3, 8), (-5, 8)$. **Do they overlap?**",
        options: [
          "Yes — they share the segment from $(-3, 5)$ to $(-3, 6)$, where their boundaries meet, but their *interiors* still overlap because the toilet's region $x \\in [-5, -3]$, $y \\in [5, 8]$ and the basin's region $x \\in [-3, 0]$, $y \\in [4, 6]$ touch only at $x = -3$ — actually, they touch along an edge but do not overlap in area",
          "Yes — there is a 1 sq ft overlap region",
          "No — the toilet is to the left of $x = -3$ and the basin is to the right of $x = -3$; their interiors do not overlap (they share only an edge along the line $x = -3$)",
          "Cannot decide without measuring"
        ],
        correct_index: 2,
        explanation: "The toilet occupies $x \\in [-5, -3]$ and the washbasin occupies $x \\in [-3, 0]$. Both pieces use the line $x = -3$ as a boundary, but the **interiors** are on opposite sides of that line. So they share only an edge — no overlapping area. (In design language: 'flush against' is OK; 'overlapping' is not.)",
        reasoning_level: 3
      },
      {
        id: uid(),
        question: "If an architect places a square pillar at the centre of a dining room which spans $x \\in [-6, 12]$ and $y \\in [-15, 0]$, **where is the pillar's centre**?",
        options: [
          "$(0, 0)$",
          "$(3, -7.5)$",
          "$(6, -15)$",
          "$(0, -7.5)$"
        ],
        correct_index: 1,
        explanation: "The centre of a rectangle is at the **midpoint of each coordinate range**. Midpoint of $x \\in [-6, 12]$ is $(-6 + 12)/2 = 3$. Midpoint of $y \\in [-15, 0]$ is $(-15 + 0)/2 = -7.5$. So the centre is $(3, -7.5)$. (You will use this same midpoint idea throughout coordinate geometry — it has its own formula, the **midpoint formula**, which you'll meet in Class 10.)",
        reasoning_level: 2
      }
    ]
  }
];

const page = {
  _id: uid(),
  book_id: BOOK_ID,
  chapter_number: CHAPTER_NUMBER,
  page_number: PAGE_NUMBER,
  title: 'Bathroom Geometry & The Dining Room: Exercise Set 1.2 (Part 2)',
  subtitle: 'Fitting fixtures inside a bathroom and a dining table inside a room — every corner is a coordinate, every fit is arithmetic',
  slug: SLUG,
  blocks,
  hinglish_blocks: [],
  tags: ['exercise', 'reiaan', 'bathroom', 'dining-room', 'fixtures', 'practice', 'vastu'],
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
