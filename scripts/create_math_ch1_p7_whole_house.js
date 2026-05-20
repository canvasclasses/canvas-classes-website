'use strict';
/**
 * Class 9 Math — Chapter 1 — Page 7
 * "Reiaan's Whole House: Exercise Set 1.2 (Part 1)"
 *  Includes: Q1 (study table), Q2 (bathroom door swing collision)
 *
 * Run: node scripts/create_math_ch1_p7_whole_house.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'reiaan-whole-house-exercise-1-2-part-1';
const CHAPTER_NUMBER = 1;
const PAGE_NUMBER = 7;

function uid() { return randomUUID(); }

const blocks = [
  // Block 0: hero banner
  {
    id: uid(), type: 'image', order: 0,
    src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A top-down architect's view of Reiaan's whole apartment — bedroom on the right, bathroom on the left in the negative-x region, with a faint Cartesian grid overlaid and dawn light pouring through invisible windows",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A top-down architectural view of Reiaan's whole apartment — bedroom on the right side of the frame, bathroom (with showering area, toilet, washbasin) on the left side, both rendered in warm wood and cool tile colours. A faint Cartesian coordinate grid is overlaid on the entire space, with the origin at the meeting corner of the two rooms. Soft dawn light streams across the floor. The image conveys: an architect's plan is a coordinate plane in disguise. Painterly cinematic illustration with subtle technical overlay. Dark background. No text, no labels."
  },
  // Block 1: curiosity_prompt
  {
    id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Real architects and designers do their work on coordinate paper. Every door, every window, every piece of furniture is a set of numbers before it is anything else.\n\nNow that you have learned about all four quadrants, **a whole house** opens up. Reiaan's bathroom is to the *left* of the bedroom — in the **negative-x** region. The same room, the same coordinates, just a wider Cartesian plane.\n\nIf the bathroom door swings into the bedroom, **how do you check whether it will hit the wardrobe**?",
    hint: "A door is a line segment with one fixed end (the hinge) and one moving end (the free end). As it opens, the free end traces a circular arc. The question becomes: does that arc cross the wardrobe's rectangle?",
    reveal: "This page works through the first two questions of NCERT **Exercise Set 1.2** — placing a study table and analysing the bathroom door's swing — using nothing more than coordinates, subtraction, and a little geometric reasoning. The interactive simulator below lets you adjust the door yourself."
  },
  // Block 2: Aryabhata-style verse on careful work
  {
    id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'सूत्रात्मक सिद्धांत',
    markdown: "_From the Indian Mathematical Tradition — On Careful Surveying_\n\n### प्रत्येकं स्थानं संख्यया वेदितव्यम्।\n### एकस्य अपि क्षेपः सर्वम् असत्यं करोति॥\n\n*(pratyekaṃ sthānaṃ saṃkhyayā veditavyam / ekasya api kṣepaḥ sarvam asatyaṃ karoti)*\n\n---\n\n*'हर जगह को संख्या से जानना चाहिए। एक भी ग़लती सब कुछ बिगाड़ देती है।'*\n\n*'Every position must be known by its number. Even one error throws everything off.'*\n\nIndian survey manuals from the Sulba-sutra tradition warned that *one* miscounted unit could ruin an entire layout. The same is true today: an architect who mis-places one corner of a wardrobe by 30 cm may design a door that does not open. Coordinate geometry is the discipline of being right about every single number."
  },
  // Block 3: heading
  { id: uid(), type: 'heading', order: 3, level: 2, text: "Reiaan's apartment — the whole grid" },
  // Block 4: text — describing the layout
  {
    id: uid(), type: 'text', order: 4,
    markdown: "On the previous pages we worked only with the bedroom — the rectangle from $(0, 0)$ to $(12, 10)$. The full apartment, shown below, **adds a bathroom in the negative-x region**: the rectangle from $(-6, 0)$ to $(0, 9)$, attached to the bedroom along the y-axis.\n\nKey labelled points (units: 1 grid step = 1 foot):\n\n- $O = (0, 0)$ — corner where bedroom meets bathroom (origin)\n- $A = (12, 0)$, $B = (12, 10)$, $C = (0, 10)$ — three other bedroom corners\n- $W_1, W_2, W_3, W_4$ — corners of the wardrobe\n- $S_1, S_2, S_3, S_4$ — corners of the bed\n- $B_1 = (0, 1.5)$ and $B_2 = (0, 4)$ — endpoints of the bathroom door (a vertical segment on the y-axis)\n- $D_1, R_1$ — endpoints of the room (entrance) door, on the bottom wall\n- $F$ — top-left corner of the bathroom; $H$ — left wall corner; $P, R$ — far corners of the bathroom in the negative-x region\n\nUsing this single coordinate plane, we can now answer **NCERT Exercise Set 1.2 Questions 1 and 2** with no measuring tape — just arithmetic."
  },
  // Block 5: image — Fig 1.5 (whole house)
  {
    id: uid(), type: 'image', order: 5,
    src: '', width: 'full',
    caption: "📸 Fig. 1.5 — Reiaan's whole apartment. Bedroom in $x \\geq 0$, bathroom in $x \\leq 0$. Origin at the bedroom-bathroom corner. Each grid step is 1 foot.",
    alt: 'A top-down floor plan of an apartment drawn on a Cartesian grid. The bedroom is a 12 ft × 10 ft rectangle in the right half (positive x), with the y-axis as its left wall. Inside the bedroom: a bed labelled with corners S1, S2, S3, S4 against the upper-left wall; a wardrobe (4 ft × 2 ft) on the lower-middle wall with corners W1, W2, W3, W4. The room door has endpoints D1 and R1 on the bottom wall. The bathroom is a 6 ft × 9 ft rectangle in the left half (negative x), with the y-axis as its right wall. Inside the bathroom: a showering area, a toilet, a washbasin, and corner labels F, H, R, P. Two bathroom door endpoints B1 = (0, 1.5) and B2 = (0, 4) are marked on the y-axis itself. A potted plant sits in the upper-right of the bedroom.',
    generation_prompt: "Top-down architectural floor plan of an apartment drawn on a Cartesian coordinate grid. Two rooms share the y-axis as a wall: the bedroom occupies the rectangle from (0, 0) to (12, 10) on the right (warm beige); the bathroom occupies the rectangle from (-6, 0) to (0, 9) on the left (cool blue tile). Origin O = (0, 0) labelled at the bedroom-bathroom corner. Other corners labelled: A = (12, 0) bottom-right, B = (12, 10) top-right, C = (0, 10) top-left of bedroom; F = (0, 9) top of shared wall; bathroom corners labelled R, P. Bedroom interior: a bed in the upper-left with corners S1, S2, S3, S4; a wardrobe (4 ft × 2 ft) on the lower wall with corners W1, W2, W3, W4. Bathroom interior: a showering area in the upper-left (with shower head and SHWR label); a toilet in the lower-left; a washbasin labelled. Two bathroom door endpoints labelled B1 (lower) and B2 (upper) on the y-axis itself. Tick marks at every integer from −6 to +12 on x-axis, +1 to +10 on y-axis. Style: clean architectural illustration. Dark background, orange accent labels, clean technical illustration style."
  },
  // Block 6: heading — Q1
  { id: uid(), type: 'heading', order: 6, level: 2, text: 'Question 1: Where does the study table go?' },
  // Block 7: text
  {
    id: uid(), type: 'text', order: 7,
    markdown: "**NCERT Exercise Set 1.2, Q1.** Place Reiaan's *rectangular* study table with three of its feet at the points $(8, 9)$, $(11, 9)$ and $(11, 7)$. Answer the three sub-questions below."
  },
  // Block 8: worked_example — Q1(i)
  {
    id: uid(), type: 'worked_example', order: 8,
    label: 'Q1 (i) — Where will the fourth foot be?',
    variant: 'ncert_intext',
    problem: "Three feet of a rectangular table are at $(8, 9)$, $(11, 9)$, $(11, 7)$. Where is the fourth foot?",
    solution: "**Step 1 — Identify the rectangle.**\n\nA rectangle has four corners; opposite sides are equal and parallel to each other. Let me name the three given corners $T_1(8, 9)$, $T_2(11, 9)$, $T_3(11, 7)$.\n\n**Step 2 — Spot the right-angle.**\n\n- $T_1 \\to T_2$: same y-coordinate (9), so this side is horizontal of length $|11 - 8| = 3$.\n- $T_2 \\to T_3$: same x-coordinate (11), so this side is vertical of length $|9 - 7| = 2$.\n\nSo the right angle of the rectangle is at $T_2(11, 9)$. The remaining corner $T_4$ must be diagonally opposite to it.\n\n**Step 3 — Place the fourth corner.**\n\nThe fourth corner sits below $T_1$ and to the left of $T_3$. Its x-coordinate matches $T_1$'s x ($x = 8$); its y-coordinate matches $T_3$'s y ($y = 7$). So:\n\n$$T_4 = (8, 7)$$\n\n**Answer:** The fourth foot is at $(8, 7)$."
  },
  // Block 9: worked_example — Q1(ii)
  {
    id: uid(), type: 'worked_example', order: 9,
    label: 'Q1 (ii) — Is this a good spot for the table?',
    variant: 'ncert_intext',
    problem: "Is the table at $(8, 9), (11, 9), (11, 7), (8, 7)$ in a good spot inside Reiaan's bedroom?",
    solution: "**Step 1 — Check the bounds.**\n\nThe bedroom occupies $0 \\le x \\le 12$ and $0 \\le y \\le 10$. All four feet are within these bounds, so the table fits.\n\n**Step 2 — Check for collisions with other furniture.**\n\n- **Bed** corners (from Fig. 1.5): roughly $S_1(1, 5)$ to $S_3(7, 9)$. The bed's region is $x \\in [1, 7]$, $y \\in [5, 9]$. Our table's region is $x \\in [8, 11]$, $y \\in [7, 9]$. The two regions do **not** overlap (the table starts at $x = 8$, beyond the bed's right edge at $x = 7$). ✓\n\n- **Wardrobe** corners (from Fig. 1.5): $W_1(3, 1)$ to $W_3(7, 3)$. The wardrobe is far below the table and far to its left. ✓\n\n**Step 3 — Practical reasoning.**\n\nThe table sits in the **upper-right** corner of the bedroom, against the right wall and just below the back wall. This is a typical workspace placement — close to the window (top-right), away from the door (bottom-right), enough room behind the chair. **Yes, this is a sensible spot.**\n\n**Answer:** Yes, the table fits inside the bedroom and does not collide with the bed or wardrobe — it is a reasonable spot."
  },
  // Block 10: worked_example — Q1(iii)
  {
    id: uid(), type: 'worked_example', order: 10,
    label: 'Q1 (iii) — Width? Length? Height?',
    variant: 'ncert_intext',
    problem: "What is the width of the table? The length? Can you make out the height of the table from the floor plan?",
    solution: "**Step 1 — Width and length from coordinates.**\n\nUsing the corners $(8, 7), (11, 7), (11, 9), (8, 9)$:\n\n- Horizontal sides (along x): length $= |11 - 8| = 3$ feet.\n- Vertical sides (along y): length $= |9 - 7| = 2$ feet.\n\nBy convention, the **longer** side is the *length* and the **shorter** side is the *width*. So:\n\n- **Length = 3 feet** (≈ 91 cm)\n- **Width = 2 feet** (≈ 61 cm)\n\n**Step 2 — Height?**\n\nThe floor plan is a **2-D coordinate map**. It captures only east-west and north-south position. **Height is the third dimension** (up from the floor) — it cannot be read off a 2-D plan. To know the table's height, we would need either a side-view *elevation* drawing or a 3-D coordinate $(x, y, z)$ for each foot.\n\n**Answer:** Length = **3 ft**, Width = **2 ft**. The **height cannot be determined** from a 2-D floor plan."
  },
  // Block 11: heading — Q2
  { id: uid(), type: 'heading', order: 11, level: 2, text: 'Question 2: Will the bathroom door hit the wardrobe?' },
  // Block 12: text
  {
    id: uid(), type: 'text', order: 12,
    markdown: "**NCERT Exercise Set 1.2, Q2.** The bathroom door is hinged at $B_1 = (0, 1.5)$ and opens *into* the bedroom. The door's free end (initially at $B_2 = (0, 4)$ when closed) sweeps through an arc as it opens. **Will it hit the wardrobe?** And what would you suggest if the door were made wider?\n\nThis is a real architectural question — and now you have the tools to settle it without ever stepping into the room."
  },
  // Block 13: simulation
  {
    id: uid(), type: 'simulation', order: 13,
    simulation_id: 'door-swing-checker',
    title: 'Try It: Drag the Door Through Its Swing',
  },
  // Block 14: worked_example — Q2 analysis
  {
    id: uid(), type: 'worked_example', order: 14,
    label: 'Q2 — Door-swing analysis',
    variant: 'ncert_intext',
    problem: "The bathroom door is a segment of length $|B_2 - B_1| = |4 - 1.5| = 2.5$ ft, hinged at $B_1(0, 1.5)$. When fully open into the bedroom, the door points along the **positive x-axis** from $B_1$. Will the door's swept arc hit the wardrobe (corners $W_1(3, 1), W_2(7, 1), W_3(7, 3), W_4(3, 3)$)?",
    solution: "**Step 1 — How far can the door reach?**\n\nThe door is rigid and 2.5 ft long. As it pivots around $B_1(0, 1.5)$, every point on the door stays within 2.5 ft of $B_1$. So the door's swept region is a **circular sector** of radius 2.5 ft centred at $B_1$.\n\n**Step 2 — How close is the wardrobe to $B_1$?**\n\nThe wardrobe occupies $x \\in [3, 7]$ and $y \\in [1, 3]$. The closest corner to $B_1(0, 1.5)$ is $W_1(3, 1)$:\n\n$$\\text{distance}(B_1, W_1) = \\sqrt{(3 - 0)^2 + (1 - 1.5)^2} = \\sqrt{9 + 0.25} = \\sqrt{9.25} \\approx 3.04 \\text{ ft}$$\n\n(You will study this distance formula formally on the next two pages.)\n\n**Step 3 — Compare door reach to wardrobe distance.**\n\nDoor reach = **2.5 ft**.   Closest wardrobe corner = **≈ 3.04 ft** away.\n\nSince $2.5 < 3.04$, **the door does not reach the wardrobe** at *any* swing angle. The arc of swept points stays entirely inside the disk of radius 2.5 ft around $B_1$, and the wardrobe lies outside this disk.\n\n**Step 4 — Suggestion if the door were widened.**\n\nIf the door is made wider — say $w$ ft — it will start hitting the wardrobe as soon as $w \\ge 3.04$ ft (≈ 93 cm). The cleanest fix is to **move the hinge upward** (closer to $B_2$) so that the door's swept disk shifts away from the wardrobe.\n\n**Answer:** No, the 2.5-ft door does **not** hit the wardrobe at any swing angle. If the door were widened past about 3 ft, the hinge would need to be raised to keep the swept arc clear."
  },
  // Block 15: reasoning_prompt
  {
    id: uid(), type: 'reasoning_prompt', order: 15,
    reasoning_type: 'spatial',
    prompt: "An architect designs a wider bathroom door — width 4 ft — hinged at the same point $B_1(0, 1.5)$. The wardrobe stays at the same position. The architect insists, *'The door is fine. It only hits the wardrobe at one specific angle, so we just won't open it that far.'* Why is this argument unsound?",
    options: [
      "Because doors must always be opened to 90° in real homes",
      "Because to enter or leave the bathroom, the door must swing through a continuous range of angles — if the door collides with the wardrobe at *any* angle in that range, the user cannot pass through without the door striking the wardrobe; the swept region is what must be free, not just one final position",
      "Because the architect did not include a measuring tape in the plan",
      "Because a 4-ft door cannot fit through a 2.5-ft gap"
    ],
    reveal: "Doors are operated **continuously** — a person pushes the door open, walks through, and lets it close. The door has to be free of obstruction across **the entire range of its swing**, not just at the final position. If the swept *arc* (the full sector traced by the door's free end) crosses the wardrobe at any angle, the door will hit the wardrobe during normal use. This is the difference between a *final-position* check and a **swept-region** check — a subtle distinction with real consequences. Engineers call this *clearance analysis*, and it shows up everywhere: in robotics, machine design, vehicle suspension, and yes, bathroom doors.",
    difficulty_level: 4
  },
  // Block 16: callout[bridging_science]
  {
    id: uid(), type: 'callout', variant: 'bridging_science', order: 16,
    title: 'Bridging Science and Society — Architectural CAD',
    markdown: "Modern architectural CAD software (such as **AutoCAD**, **Revit**, or India's **BharatCAD**) automatically performs the door-swing collision check we just did by hand. Every door object in the software carries a *swept-region* polygon, and the software flags any collision with another object in the room as soon as a piece of furniture is dragged within range.\n\nYour analysis on this page — distance from hinge, comparison to door length, swept arc — is exactly what the software does internally. The mathematics of $(x, y)$ coordinates plus the Pythagoras theorem (which you will formalise on the next page) is the entire foundation of every CAD program in the world."
  },
  // Block 17: callout[remember] — practice list
  {
    id: uid(), type: 'callout', variant: 'remember', order: 17,
    title: 'Practice Yourself — More Coordinate Geometry of the House',
    markdown: "Try these on graph paper before peeking at hints:\n\n1. The corners of the bed are $S_1(1, 5)$, $S_2(7, 5)$, $S_3(7, 9)$, $S_4(1, 9)$. **Find its length and width.**\n2. A new bookshelf is to be placed with corners at $(9, 1), (11, 1), (11, 4), (9, 4)$. **Will it overlap with the wardrobe** (whose corners are $W_1(3, 1), W_2(7, 1), W_3(7, 3), W_4(3, 3)$)?\n3. Reiaan's school chair is placed at $(9, 5), (10, 5), (10, 6), (9, 6)$. **What is the chair's footprint area?**\n4. The **diagonal** of the bed connects $S_1(1, 5)$ to $S_3(7, 9)$. **How long is this diagonal?** (Hint: this needs the distance formula — you'll meet it on the next page.)\n5. A new entry mat lies along the bottom wall from $(5, 0)$ to $(8, 0)$. **What part of the room door $D_1 R_1$ does the mat cover?**\n\n*Worked answers:* 1. length = 4 ft, width = 6 ft.   2. Both occupy the strip $y \\in [1, 3]$ but the bookshelf is at $x \\in [9, 11]$ while the wardrobe is at $x \\in [3, 7]$ — **no overlap**.   3. 1 sq ft.   4. $\\sqrt{(7-1)^2 + (9-5)^2} = \\sqrt{36 + 16} = \\sqrt{52} \\approx 7.21$ ft.   5. The room door covers $x \\in [7.5, 11.5]$ and the mat covers $[5, 8]$, so the **overlap** is $x \\in [7.5, 8]$ — half a foot."
  },
  // Block 18: inline_quiz — 4 questions
  {
    id: uid(), type: 'inline_quiz', order: 18,
    pass_threshold: 0.6,
    questions: [
      {
        id: uid(),
        question: "Three corners of a rectangle are $(2, 1)$, $(7, 1)$, and $(7, 5)$. Where is the fourth corner?",
        options: ["$(2, 5)$", "$(5, 5)$", "$(2, 7)$", "$(5, 1)$"],
        correct_index: 0,
        explanation: "The right-angle of the rectangle is at $(7, 1)$ (where a horizontal side meets a vertical side). The fourth corner is opposite to $(7, 1)$ and shares one coordinate with each of the other two corners — so $x = 2$ (matching the bottom-left corner) and $y = 5$ (matching the top-right). Hence the fourth corner is $(2, 5)$.",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "A 2.5-ft door is hinged at $(0, 1.5)$ and swings into a room. The closest piece of furniture has a corner at $(3, 1)$. Will the door hit the furniture?",
        options: [
          "Yes, definitely — they are both near the y-axis",
          "No — the door's reach is 2.5 ft, but the furniture corner is √(9 + 0.25) ≈ 3.04 ft from the hinge, beyond the door's reach",
          "Yes — because the door always swings 180°",
          "Cannot be decided without knowing the door's thickness"
        ],
        correct_index: 1,
        explanation: "The door's swept region is a disk of radius 2.5 ft around the hinge $(0, 1.5)$. The distance from the hinge to the furniture corner $(3, 1)$ is $\\sqrt{(3-0)^2 + (1-1.5)^2} = \\sqrt{9.25} \\approx 3.04$ ft. Since $2.5 < 3.04$, the door cannot reach the corner at any angle.",
        reasoning_level: 3
      },
      {
        id: uid(),
        question: "If a rectangular table has corners $(8, 9), (11, 9), (11, 7), (8, 7)$, what is its **footprint area** in square feet?",
        options: ["3 sq ft", "5 sq ft", "**6 sq ft**", "9 sq ft"],
        correct_index: 2,
        explanation: "The horizontal side is $|11 - 8| = 3$ ft, the vertical side is $|9 - 7| = 2$ ft. Area = length × width = $3 \\times 2 = 6$ sq ft. (Notice we do **not** need a measuring tape — only subtraction of coordinates.)",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "A 2-D floor plan can describe a piece of furniture's **width and length**, but not its **height**. Why?",
        options: [
          "Because the floor plan is too small to show heights",
          "Because the architect was lazy",
          "Because a 2-D coordinate plane has only two independent directions of variation; height is a third independent direction, which a 2-D plane cannot capture — you need a 3-D coordinate system $(x, y, z)$ or a separate side-view *elevation*",
          "Because heights are always 1 metre"
        ],
        correct_index: 2,
        explanation: "A 2-D floor plan describes points using two coordinates $(x, y)$. The height of an object is a third independent quantity that simply cannot be read from a 2-D plan — it has been *projected away* in the top-down view. Architects therefore draw both **plans** (top-down 2-D) and **elevations** (side-view 2-D) to capture all three dimensions.",
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
  title: "Reiaan's Whole House: Exercise Set 1.2 (Part 1)",
  subtitle: 'Placing a study table and analysing a swinging door — pure coordinate geometry, no measuring tape needed',
  slug: SLUG,
  blocks,
  hinglish_blocks: [],
  tags: ['exercise', 'reiaan', 'whole-house', 'door-swing', 'rectangle', 'practice'],
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
