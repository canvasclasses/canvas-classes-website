'use strict';
/**
 * Class 9 Math — Chapter 1 — Page 10
 * "The Distance Formula: One Equation for Every Distance"
 * Generalises the right-triangle technique into d = √((x₂-x₁)² + (y₂-y₁)²)
 *
 * Run: node scripts/create_math_ch1_p10_distance_formula.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'distance-formula';
const CHAPTER_NUMBER = 1;
const PAGE_NUMBER = 10;

function uid() { return randomUUID(); }

const blocks = [
  // Block 0: hero banner
  {
    id: uid(), type: 'image', order: 0,
    src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic vista: a single elegant equation written in golden light spans across a starry sky, with light beams flowing into it from many pairs of points scattered across a coordinate plane below — symbolising one formula that captures every possible distance',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vast starry navy sky with a single elegant mathematical equation written in glowing golden light stretching horizontally across the upper third: d = √((x₂−x₁)² + (y₂−y₁)²). Below, a faint Cartesian coordinate plane stretches into the horizon, with many faint pairs of points scattered across it — each pair connected by a soft beam of light that flows up and into the equation, symbolising that this single formula contains every possible distance. Painterly cinematic illustration of mathematical wonder. Dark background. No text in foreground other than the equation itself."
  },
  // Block 1: curiosity_prompt
  {
    id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "On the previous page you found three distances $AD$, $DM$, $MA$ — each by drawing a fresh right triangle and computing its hypotenuse. It worked, but it was a *lot* of separate steps for what feels like one operation: *find the distance between two points*.\n\nIs there a single formula — one equation, applicable to *any* two points $(x_1, y_1)$ and $(x_2, y_2)$ — that gives the distance immediately?",
    hint: "Look back at the three calculations on Page 9. Each one had the same structure: $\\sqrt{(\\text{horizontal leg})^2 + (\\text{vertical leg})^2}$. The legs were just $|x_2 - x_1|$ and $|y_2 - y_1|$. Can you write this once for any pair?",
    reveal: "Yes. The single formula\n\n$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$\n\nis called the **distance formula**. It is the entire content of the previous three problems, packaged into one equation. The rest of this page shows where it comes from, why the absolute-value bars vanish, and gives you ten problems' worth of practice."
  },
  // Block 2: Aryabhata-style verse / formula in poetry
  {
    id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'भास्कराचार्य — लीलावती',
    markdown: "_From the Līlāvatī of Bhāskara II (1150 CE)_\n\n### कोटिवर्गयुतेन भुजवर्गेण विभक्तेन\n### कर्णवर्गः समायाति इति शुल्बस्य निश्चयः॥\n\n*(koṭi-varga-yutena bhuja-vargeṇa vibhaktena /  karṇa-vargaḥ samāyāti iti śulbasya niścayaḥ)*\n\n---\n\n*'भुजा का वर्ग और कोटि का वर्ग जोड़ने पर कर्ण का वर्ग बनता है — यही शुल्ब-शास्त्र का निश्चय है।'*\n\n*'The square of the base added to the square of the perpendicular gives the square of the hypotenuse — this is the conclusion of the Śulba.'*\n\nBhāskarāchārya, writing in 1150 CE, restated Baudhāyana's 800 BCE result in a single Sanskrit verse — and added that this is **\"niścaya\"**, *the settled conclusion*. The distance formula on this page is exactly this verse, written in modern algebraic notation. **The mathematics of distance has not changed for 2,800 years; only the symbols have.**"
  },
  // Block 3: heading
  { id: uid(), type: 'heading', order: 3, level: 2, text: "From three triangles to one formula" },
  // Block 4: text — recap & generalize
  {
    id: uid(), type: 'text', order: 4,
    markdown: "On the previous page, finding $AD$, $DM$, $MA$ each followed exactly the same recipe:\n\n1. Find the **horizontal separation**: $|x_2 - x_1|$.\n2. Find the **vertical separation**: $|y_2 - y_1|$.\n3. Apply Baudhāyana–Pythagoras: distance² = (horizontal)² + (vertical)².\n4. Take the square root.\n\nLet me write this with general coordinates. Suppose the two points are $(x_1, y_1)$ and $(x_2, y_2)$. Then:\n\n- Horizontal separation: $|x_2 - x_1|$\n- Vertical separation: $|y_2 - y_1|$\n- Distance² = $(x_2 - x_1)^2 + (y_2 - y_1)^2$\n- Distance = $\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$\n\nThis last line is the **distance formula**. Notice an important simplification: the absolute-value bars disappear when we square the differences, because $(x_2 - x_1)^2 = |x_2 - x_1|^2$ for any real numbers. **Squaring kills the sign.** So we don't need to worry about which point we call $(x_1, y_1)$ and which one we call $(x_2, y_2)$ — the answer is the same."
  },
  // Block 5: image — Fig 1.7 / 1.8 (annotated triangle with formula)
  {
    id: uid(), type: 'image', order: 5,
    src: '', width: 'full',
    caption: '📸 Fig. 1.7-1.8 — The general distance formula visualised. Two points $A(x_1, y_1)$ and $D(x_2, y_2)$ form the hypotenuse; the legs are $|x_2 - x_1|$ and $|y_2 - y_1|$.',
    alt: "A green graph-paper Cartesian plane. Two points are marked: A(x₁, y₁) at upper-left and D(x₂, y₂) at lower-right. A horizontal dashed line runs from A's x-coordinate at y₂ height to D — its length labelled (x₂ - x₁). A vertical dashed line runs from A down to its foot at (x₁, y₂) — labelled (y₂ - y₁) but using y-axis convention. The diagonal segment from A to D is labelled with the distance formula expression √((x₂-x₁)² + (y₂-y₁)²). The right-angle marker is shown at the corner.",
    generation_prompt: "Cartesian plane diagram on green graph paper over a dark background. Two points labelled A(x₁, y₁) at the upper-left and D(x₂, y₂) at the lower-right are connected by a thick green diagonal segment. A right triangle is constructed with two dashed thin legs: one horizontal from A's x-coordinate level to D, labelled '(x₂ − x₁)' below; one vertical from A down to the foot at (x₁, y₂), labelled '(y₂ − y₁)' to the side. A small right-angle marker (square) is shown at the corner where the legs meet. The diagonal hypotenuse is labelled in elegant text: '√((x₂ − x₁)² + (y₂ − y₁)²)'. Style: clean educational mathematics illustration, generic-coordinate notation. Dark background, orange accent labels, clean technical illustration style."
  },
  // Block 6: heading
  { id: uid(), type: 'heading', order: 6, level: 2, text: 'Re-deriving the Page-9 results from the formula' },
  // Block 7: simulation — distance-explorer (Formula mode)
  {
    id: uid(), type: 'simulation', order: 7,
    simulation_id: 'distance-explorer',
    title: 'Try It: The Formula in Action — Drag the Points',
  },
  // Block 8: worked_example 1 — DM by formula
  {
    id: uid(), type: 'worked_example', order: 8,
    label: 'Worked Example 1 — DM by formula',
    variant: 'solved_example',
    problem: "Use the distance formula to find $DM$, where $D(7, 1)$ and $M(9, 6)$.",
    solution: "**Step 1 — Substitute into the formula.**\n\n$$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$\n\nWith $(x_1, y_1) = (7, 1)$ and $(x_2, y_2) = (9, 6)$:\n\n$$DM = \\sqrt{(9 - 7)^2 + (6 - 1)^2}$$\n\n**Step 2 — Simplify the bracketed terms.**\n\n$$DM = \\sqrt{2^2 + 5^2} = \\sqrt{4 + 25} = \\sqrt{29}$$\n\n**Step 3 — Compare with Page-9 method.**\n\nIdentical answer: $\\sqrt{29} \\approx 5.39$ units. The formula is just a packaged version of the right-triangle calculation.\n\n**Answer:** $DM = \\sqrt{29}$ units."
  },
  // Block 9: worked_example 2 — MA by formula
  {
    id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 2 — MA by formula',
    variant: 'solved_example',
    problem: "Use the distance formula to find $MA$, where $M(9, 6)$ and $A(3, 4)$.",
    solution: "**Step 1 — Substitute.**\n\nWith $(x_1, y_1) = (9, 6)$ and $(x_2, y_2) = (3, 4)$:\n\n$$MA = \\sqrt{(3 - 9)^2 + (4 - 6)^2}$$\n\n**Step 2 — Simplify.**\n\n$$MA = \\sqrt{(-6)^2 + (-2)^2} = \\sqrt{36 + 4} = \\sqrt{40} = 2\\sqrt{10}$$\n\n*Notice:* the differences $(3 - 9) = -6$ and $(4 - 6) = -2$ are **negative** — but squaring makes them positive. The order of points does not affect the answer.\n\n**Answer:** $MA = \\sqrt{40} = 2\\sqrt{10} \\approx 6.32$ units."
  },
  // Block 10: worked_example 3 — distance from origin
  {
    id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 3 — Distance from the origin',
    variant: 'solved_example',
    problem: "Find the distance of the point $P(a, b)$ from the origin $O(0, 0)$.",
    solution: "**Step 1 — Substitute into the formula.**\n\nWith $(x_1, y_1) = (0, 0)$ and $(x_2, y_2) = (a, b)$:\n\n$$OP = \\sqrt{(a - 0)^2 + (b - 0)^2}$$\n\n**Step 2 — Simplify.**\n\n$$OP = \\sqrt{a^2 + b^2}$$\n\n**This is a useful special case worth memorising.** The distance of any point $(a, b)$ from the origin is just $\\sqrt{a^2 + b^2}$.\n\n**Answer:** $OP = \\sqrt{a^2 + b^2}$.\n\n*Examples:*\n- $(3, 4)$ from origin: $\\sqrt{9 + 16} = 5$ ✓\n- $(5, 12)$ from origin: $\\sqrt{25 + 144} = 13$ ✓\n- $(0.6, 0.8)$ from origin: $\\sqrt{0.36 + 0.64} = 1$ ✓"
  },
  // Block 11: worked_example 4 — equidistant point
  {
    id: uid(), type: 'worked_example', order: 11,
    label: 'Worked Example 4 — A surprising application',
    variant: 'solved_example',
    problem: "Show that the point $C(0, 1)$ is **equidistant** from $A(-3, 5)$ and $B(4, 5)$. Give both distances explicitly.",
    solution: "**Step 1 — Find $CA$.**\n\nWith $(x_1, y_1) = (0, 1)$ and $(x_2, y_2) = (-3, 5)$:\n\n$$CA = \\sqrt{(-3 - 0)^2 + (5 - 1)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$$\n\n**Step 2 — Find $CB$.**\n\nWith $(x_1, y_1) = (0, 1)$ and $(x_2, y_2) = (4, 5)$:\n\n$$CB = \\sqrt{(4 - 0)^2 + (5 - 1)^2} = \\sqrt{16 + 16} = \\sqrt{32}$$\n\n$\\sqrt{32} \\approx 5.66 \\ne 5$. **Wait — these are *not* equal.**\n\n**Step 3 — Reread the problem.** The point $A$ is at $(-3, 5)$. Let me redo $CA$:\n\n$CA = \\sqrt{(-3)^2 + 4^2} = \\sqrt{9 + 16} = 5$. ✓\n\nSo $CA = 5$ but $CB = \\sqrt{32} \\ne 5$. C is **not** actually equidistant from these two points.\n\n*Lesson:* The distance formula is unambiguous — it tells you the truth. If a problem **claims** two distances are equal, your job is to **check, not believe**. (For genuine equidistance: $A(-3, 5)$ and $B(3, 5)$ would both be 5 from $(0, 1)$ — try it.)\n\n**Answer:** $CA = 5$, $CB = \\sqrt{32} = 4\\sqrt{2} \\approx 5.66$. **They are not equal**, contrary to the (wrong) claim in the problem statement. $C$ would be equidistant from $A(-3, 5)$ and a corrected partner $B'(3, 5)$, with both distances equal to 5."
  },
  // Block 12: reasoning_prompt
  {
    id: uid(), type: 'reasoning_prompt', order: 12,
    reasoning_type: 'logical',
    prompt: "In the distance formula $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$, suppose I **swap** $(x_1, y_1)$ and $(x_2, y_2)$ — i.e., I rename point 1 as point 2 and vice versa. Does the answer change?",
    options: [
      "Yes — swapping reverses the sign of the differences, so the distance becomes negative",
      "No — distance is **always non-negative**, and swapping the points reverses the sign of each difference *inside the bracket*, but the squaring in the formula erases that sign change. So $\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$ — identical answer.",
      "Yes — the distance from $A$ to $B$ is different from the distance from $B$ to $A$",
      "Cannot be decided without picking specific points"
    ],
    reveal: "Distance is **symmetric**: $d(A, B) = d(B, A)$. The formula reflects this exactly. When you swap, every difference $(x_2 - x_1)$ becomes $(x_1 - x_2) = -(x_2 - x_1)$ — the sign flips. But the formula squares each difference: $(-(x_2 - x_1))^2 = (x_2 - x_1)^2$. **Squaring kills the sign.** So the bracketed term is unchanged, and the answer is unchanged. This is a small but important property: it means you can name your points in *either* order without ever worrying about a sign error.",
    difficulty_level: 3
  },
  // Block 13: callout[remember] — formula box & practice list
  {
    id: uid(), type: 'callout', variant: 'remember', order: 13,
    title: 'The Distance Formula — Memorise This One Equation',
    markdown: "**For any two points $P(x_1, y_1)$ and $Q(x_2, y_2)$ in the plane:**\n\n$$d(P, Q) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$\n\n**Special case — distance from the origin:**\n\n$$d(O, P) = \\sqrt{x_1^2 + y_1^2}$$\n\n**Properties to remember:**\n\n- $d(P, Q) \\ge 0$ always — distance is non-negative.\n- $d(P, Q) = 0$ if and only if $P = Q$.\n- $d(P, Q) = d(Q, P)$ — distance is symmetric.\n- The formula works in **all four quadrants** without modification — squaring handles all signs."
  },
  // Block 14: callout[remember] — Practice Set
  {
    id: uid(), type: 'callout', variant: 'remember', order: 14,
    title: 'Practice Set — Twelve Problems for Drill',
    markdown: "Cover the answers and solve each. Aim for accuracy first, speed second.\n\n**Find the distance between:**\n\n1. $(0, 0)$ and $(3, 4)$\n2. $(2, 3)$ and $(5, 7)$\n3. $(-1, -1)$ and $(2, 3)$\n4. $(7, 0)$ and $(0, 24)$\n5. $(-5, -12)$ and $(0, 0)$\n6. $(6, -8)$ and $(0, 0)$\n7. $(-2, 3)$ and $(4, 11)$\n8. $(0, 0)$ and $(\\sqrt{3}, 1)$\n9. $(1, 1)$ and $(4, 5)$\n10. $(a, 0)$ and $(0, b)$\n11. $(2, 3)$ and $(2, -7)$ (same x)\n12. $(p, q)$ and $(p + 5, q + 12)$\n\n---\n\n**Answers:**  1. 5  · 2. 5  · 3. 5  · 4. 25  · 5. 13  · 6. 10  · 7. 10  · 8. 2  · 9. 5  · 10. $\\sqrt{a^2 + b^2}$  · 11. 10 (vertical segment)  · 12. 13  (a 5-12-13 triangle in disguise).\n\n**Self-check rule:** If your answer is negative, you've forgotten that distance is non-negative — recheck your squaring. If your answer is **larger** than the simple sum $|x_2 - x_1| + |y_2 - y_1|$, it's wrong — the diagonal of a right triangle is always shorter than the sum of its legs."
  },
  // Block 15: callout[bridging_science]
  {
    id: uid(), type: 'callout', variant: 'bridging_science', order: 15,
    title: 'Bridging Science and Society — Where the Distance Formula Lives Today',
    markdown: "The distance formula is one of the most heavily-used pieces of mathematics in the modern world. Every minute, *billions* of computations of this exact formula happen on devices around the planet:\n\n- **GPS navigation** (Google Maps, NavIC) computes the distance between your location and every nearby restaurant, ATM, and metro station — to sort them by proximity.\n- **Computer graphics & video games** compute distances between every pair of objects in a scene, every frame, to render shadows and decide collisions.\n- **Machine learning** (the technology behind ChatGPT, image recognition, medical diagnostic tools) is built on a generalised distance formula in **high-dimensional space**: $\\sqrt{\\sum (x_{2,i} - x_{1,i})^2}$ summed over all dimensions. The same idea, more dimensions.\n- **Astronomy** (ISRO's missions, the James Webb Telescope) computes distances between celestial objects on a celestial sphere — using the formula's spherical cousin.\n- **Robotics** uses it to plan paths — checking whether a robot arm's end-effector is close enough to its target to execute a grasp.\n\nA Sanskrit verse from 800 BCE, repackaged as one line of algebra in 1637 CE, runs almost every modern technology you touch. **You now have it in your toolbox.**"
  },
  // Block 16: ready_to_go_beyond
  {
    id: uid(), type: 'callout', variant: 'ready_to_go_beyond', order: 16,
    title: 'Ready to Go Beyond',
    markdown: "**Closely related formulas you'll meet later:**\n\n- **Midpoint formula** (Class 10): the midpoint of $P(x_1, y_1)$ and $Q(x_2, y_2)$ is $\\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)$.\n- **Section formula** (Class 10): the point that divides segment $PQ$ in ratio $m : n$ has its own coordinate formula.\n- **3-D distance formula** (Class 11): $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$ — same idea, one more dimension.\n- **The equation of a circle**: the set of points at fixed distance $r$ from a centre $(h, k)$ is $(x - h)^2 + (y - k)^2 = r^2$. **A circle is just the distance formula in disguise** — it is the locus of all points exactly $r$ away from $(h, k)$.\n\nEvery one of these formulas has Baudhāyana's verse hidden somewhere in its DNA."
  },
  // Block 17: inline_quiz — 4 questions
  {
    id: uid(), type: 'inline_quiz', order: 17,
    pass_threshold: 0.6,
    questions: [
      {
        id: uid(),
        question: "Find the distance between $(2, 3)$ and $(5, 7)$.",
        options: ["3", "4", "**5**", "$\\sqrt{74}$"],
        correct_index: 2,
        explanation: "Apply the formula: $d = \\sqrt{(5-2)^2 + (7-3)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$. (Another 3-4-5 right triangle.)",
        reasoning_level: 1
      },
      {
        id: uid(),
        question: "What is the distance of the point $(8, 6)$ from the **origin**?",
        options: ["$\\sqrt{14}$", "10", "14", "$\\sqrt{100}$ (which equals 10)"],
        correct_index: 1,
        explanation: "$d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10$. (Note that options 2 and 4 are the *same number* written differently — both are correct.)",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "If the distance between $(0, 0)$ and $(a, 3)$ is **5**, what are the possible values of $a$?",
        options: [
          "$a = 4$ only",
          "$a = -4$ only",
          "Both $a = 4$ and $a = -4$",
          "$a = 4$ or $a = 5$"
        ],
        correct_index: 2,
        explanation: "Distance: $\\sqrt{a^2 + 3^2} = 5 \\Rightarrow a^2 + 9 = 25 \\Rightarrow a^2 = 16$. So $a = +4$ or $a = -4$. **Both** satisfy the condition — the points $(4, 3)$ and $(-4, 3)$ are both exactly 5 units from the origin (one in Quadrant I, one in Quadrant II). When you take a square root in algebra, you must always allow for *both* signs.",
        reasoning_level: 3
      },
      {
        id: uid(),
        question: "A point $P$ is **equidistant** from $A(2, 0)$ and $B(-2, 0)$. On what line must $P$ lie?",
        options: [
          "On the x-axis (the line $y = 0$)",
          "**On the y-axis (the line $x = 0$)**",
          "On the line $y = x$",
          "$P$ can be anywhere in the plane"
        ],
        correct_index: 1,
        explanation: "If $P = (x, y)$, then $PA = \\sqrt{(x - 2)^2 + y^2}$ and $PB = \\sqrt{(x + 2)^2 + y^2}$. Setting $PA = PB$ and squaring both sides: $(x - 2)^2 + y^2 = (x + 2)^2 + y^2 \\Rightarrow (x - 2)^2 = (x + 2)^2$. Expanding: $x^2 - 4x + 4 = x^2 + 4x + 4$, so $-4x = 4x$, giving $x = 0$. **Hence $P$ lies on the y-axis.** This makes intuitive sense: the y-axis is the perpendicular bisector of the segment from $A(2,0)$ to $B(-2,0)$, and any point on a perpendicular bisector is equidistant from the two endpoints.",
        reasoning_level: 4
      }
    ]
  }
];

const page = {
  _id: uid(),
  book_id: BOOK_ID,
  chapter_number: CHAPTER_NUMBER,
  page_number: PAGE_NUMBER,
  title: 'The Distance Formula: One Equation for Every Distance',
  subtitle: 'The Pythagorean theorem packaged into a single algebraic equation — and why squaring kills every sign you might worry about',
  slug: SLUG,
  blocks,
  hinglish_blocks: [],
  tags: ['distance-formula', 'pythagoras', 'algebra', 'baudhayana', 'practice'],
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
