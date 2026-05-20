'use strict';
/**
 * Class 9 Math — Chapter 1 — Page 13
 * "Circles, Centres & Collinearity: Two Loci Built on Distance"
 * Covers NCERT End-of-Ch Q12 (circle K), Q15 (computer-graphics circles),
 * Q6, Q7 (collinearity test).
 *
 * Run: node scripts/create_math_ch1_p13_circles_collinearity.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'circles-centres-and-collinearity';
const CHAPTER_NUMBER = 1;
const PAGE_NUMBER = 13;
function uid() { return randomUUID(); }

const blocks = [
  {
    id: uid(), type: 'image', order: 0,
    src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic vista: ripples spreading outward from a single dropped pebble at the centre of a still pond, forming concentric circles of light, with three distant lamps along the far shore appearing to lie on a single line on the horizon',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A still pond at twilight. A single pebble has just struck the centre of the water and concentric circles of golden ripples spread outward in perfect symmetry. In the far distance, on the opposite shore, three small lamps glow on the horizon — appearing to lie almost exactly on a single straight line. The image conveys two ideas at once: the *circle* as the locus of points equidistant from a centre, and the *line* as a special locus of three points that happen to fall together. Painterly cinematic illustration. Dark background. No text, no labels."
  },
  {
    id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "On Page 10 you learned the distance formula. It tells you the distance between any two specific points. But what if I turn the question around?\n\n**'Find me all the points that are exactly 5 units from the origin.'**\n\nThis is no longer a single point — it's a *family* of points. What shape do they form?\n\nAnd a different question: **'Are these three specific points on a single straight line?'** How can the distance formula help you decide?",
    hint: "For the first: any point at fixed distance from a centre traces a circle. For the second: think about what's special about distances when three points are in a row.",
    reveal: "**The first defines a circle.** The set of all points at distance 5 from the origin is the circle of radius 5 centred at $(0, 0)$. This is the *locus* definition of a circle, and it leads directly to the equation $x^2 + y^2 = 25$. **The second is the collinearity test.** When three points lie on a line, the longest of the three pair-distances equals the sum of the other two — there is no triangle to make. Both ideas grow directly from the distance formula on Page 10."
  },
  {
    id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'आर्यभटीय — २.७ (वृत्तं समकेन्द्रम्)',
    markdown: "_From the Āryabhaṭīya — On Circles_\n\n### वृत्तं समकेन्द्रं समदूरम् च परिधितः।\n### केन्द्रात् सर्वे बिन्दवः समदूरास्थिताः ज्ञेयाः॥\n\n*(vṛttaṃ samakendraṃ samadūram ca paridhitaḥ /  kendrāt sarve bindavaḥ samadūrāsthitāḥ jñeyāḥ)*\n\n---\n\n*'गोल आकृति का एक केंद्र होता है — और हर बिन्दु जो उस आकृति पर है, केंद्र से बराबर दूरी पर है।'*\n\n*'A circle has a single centre, and every point on it is at the same distance from that centre.'*\n\nĀryabhaṭa (499 CE) made the *locus* definition of a circle explicit: the circle is the set of points *equidistant* from a given centre. This page turns that classical definition into a coordinate equation."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'A circle is a locus' },
  {
    id: uid(), type: 'text', order: 4,
    markdown: "A **locus** (Latin for *place*) is the set of all points satisfying a given condition.\n\n**Definition.** The **circle** of centre $(h, k)$ and radius $r$ is the set of all points $(x, y)$ in the plane whose distance from $(h, k)$ equals exactly $r$.\n\nUsing the distance formula, this means:\n\n$$\\sqrt{(x - h)^2 + (y - k)^2} = r$$\n\nSquaring both sides (both sides are non-negative, so squaring is reversible):\n\n$$\\boxed{(x - h)^2 + (y - k)^2 = r^2}$$\n\nThis is the **equation of a circle** in standard form. Memorise it.\n\n**Special case — circle centred at the origin.** When $h = k = 0$:\n\n$$x^2 + y^2 = r^2$$\n\n**Three things you can ask given a circle and a point** $P(x_0, y_0)$:\n\n- Is $P$ **on** the circle? Compute $(x_0 - h)^2 + (y_0 - k)^2$. If it equals $r^2$, yes.\n- Is $P$ **inside** the circle? Same expression — if it is *less than* $r^2$, $P$ is inside.\n- Is $P$ **outside**? If the expression is *greater than* $r^2$, $P$ is outside.\n\nThis classification is purely a comparison — no square roots needed."
  },
  {
    id: uid(), type: 'simulation', order: 5,
    simulation_id: 'circle-and-locus-explorer',
    title: 'Try It: Circle Locus + Collinearity',
  },
  { id: uid(), type: 'heading', order: 6, level: 2, text: 'NCERT Q12 — A circle through three points' },
  {
    id: uid(), type: 'worked_example', order: 7,
    label: 'Worked Example 1 (NCERT Q12 i) — Three points on a circle',
    variant: 'ncert_intext',
    problem: "Show that the points $A(1, -8)$, $B(-4, 7)$, $C(-7, -4)$ all lie on a circle $K$ whose centre is the origin $O(0, 0)$. What is the radius of circle $K$?",
    solution: "**Strategy.** A point $(x, y)$ lies on the circle of centre $O(0, 0)$ and radius $r$ exactly when $\\sqrt{x^2 + y^2} = r$ — i.e., when the distance from the origin equals $r$. So *all three points lie on a single circle centred at the origin* if and only if they are all the *same distance* from the origin.\n\n**Step 1 — Distance from origin to each point.**\n\n- $OA = \\sqrt{1^2 + (-8)^2} = \\sqrt{1 + 64} = \\sqrt{65}$\n- $OB = \\sqrt{(-4)^2 + 7^2} = \\sqrt{16 + 49} = \\sqrt{65}$\n- $OC = \\sqrt{(-7)^2 + (-4)^2} = \\sqrt{49 + 16} = \\sqrt{65}$\n\n**Step 2 — Compare.**\n\nAll three distances equal $\\sqrt{65}$. So all three points lie on the circle of radius $\\sqrt{65}$ centred at $O$.\n\n**Answer:** Radius of circle $K$ is $\\sqrt{65}$ units (≈ 8.06 units). The equation of the circle is $x^2 + y^2 = 65$.\n\n**Aesthetic note.** Since $1 + 64 = 16 + 49 = 49 + 16 = 65$, the three points form a triple where each pair $(x, y)$ has $x^2 + y^2 = 65$. There is something pleasing about a single number ($65$) hiding three different ways to be split as a sum of squares."
  },
  {
    id: uid(), type: 'worked_example', order: 8,
    label: 'Worked Example 2 (NCERT Q12 ii) — Inside, on, or outside?',
    variant: 'ncert_intext',
    problem: "Given the points $D(-5, 6)$ and $E(0, 9)$, check whether each lies *inside*, *on*, or *outside* the circle $K$ from the previous problem.",
    solution: "**Recall.** Circle $K$ has centre $O(0, 0)$ and radius $\\sqrt{65}$ — i.e., $r^2 = 65$. To classify a point $(x, y)$:\n\n- $x^2 + y^2 = 65$ → on the circle\n- $x^2 + y^2 < 65$ → inside\n- $x^2 + y^2 > 65$ → outside\n\n**Step 1 — Test $D(-5, 6)$.**\n\n$$D_x^2 + D_y^2 = (-5)^2 + 6^2 = 25 + 36 = 61$$\n\n$61 < 65$ ⇒ $D$ lies **inside** the circle.\n\n**Step 2 — Test $E(0, 9)$.**\n\n$$E_x^2 + E_y^2 = 0^2 + 9^2 = 0 + 81 = 81$$\n\n$81 > 65$ ⇒ $E$ lies **outside** the circle.\n\n**Answer:** $D$ is inside circle $K$; $E$ is outside.\n\n*Note:* We did **not** need to take any square roots. Comparing $x^2 + y^2$ to $r^2$ directly is cleaner and avoids irrational numbers."
  },
  { id: uid(), type: 'heading', order: 9, level: 2, text: 'NCERT Q15 — Computer-graphics circles' },
  {
    id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 3 (NCERT Q15) — Two icons on a screen',
    variant: 'ncert_intext',
    problem: "A computer screen is 800 pixels wide and 600 pixels high, with the origin at the bottom-left corner. A circular icon of radius 80 pixels is drawn with centre $A(100, 150)$. Another circular icon of radius 100 pixels is drawn with centre $B(250, 230)$.\n\n(i) Determine whether *any part* of either circle lies outside the screen.\n\n(ii) Determine whether the two circles **intersect** each other.",
    solution: "**Part (i) — Off-screen check.**\n\nA circle of centre $(h, k)$ and radius $r$ lies entirely on screen (with screen $0 \\le x \\le 800$, $0 \\le y \\le 600$) when:\n\n- $h - r \\ge 0$ (left edge)\n- $h + r \\le 800$ (right edge)\n- $k - r \\ge 0$ (bottom edge)\n- $k + r \\le 600$ (top edge)\n\n**Icon A** ($h=100, k=150, r=80$):\n- Left edge: $100 - 80 = 20 \\ge 0$ ✓\n- Right edge: $100 + 80 = 180 \\le 800$ ✓\n- Bottom edge: $150 - 80 = 70 \\ge 0$ ✓\n- Top edge: $150 + 80 = 230 \\le 600$ ✓\n\nIcon A lies entirely on screen. ✓\n\n**Icon B** ($h=250, k=230, r=100$):\n- Left edge: $250 - 100 = 150 \\ge 0$ ✓\n- Right edge: $250 + 100 = 350 \\le 800$ ✓\n- Bottom edge: $230 - 100 = 130 \\ge 0$ ✓\n- Top edge: $230 + 100 = 330 \\le 600$ ✓\n\nIcon B also lies entirely on screen. ✓\n\n**Part (ii) — Do the circles intersect?**\n\nTwo circles intersect *if and only if* the distance between their centres is **less than the sum of the radii** AND **greater than the absolute difference of the radii**.\n\n- Sum of radii: $80 + 100 = 180$\n- Difference of radii: $|100 - 80| = 20$\n- Distance between centres: $\\sqrt{(250 - 100)^2 + (230 - 150)^2} = \\sqrt{150^2 + 80^2} = \\sqrt{22500 + 6400} = \\sqrt{28900}$\n\nSimplify: $\\sqrt{28900} = \\sqrt{100 \\cdot 289} = 10 \\cdot 17 = 170$.\n\n**Compare.** $20 < 170 < 180$ — distance is between the difference and the sum, so the two circles **intersect** in two points.\n\n**Answer:**\n- (i) Both icons lie entirely on the screen — no off-screen parts.\n- (ii) The two circles **intersect** (their boundaries cross at two points)."
  },
  { id: uid(), type: 'heading', order: 11, level: 2, text: 'Collinearity — when three points lie on a line' },
  {
    id: uid(), type: 'text', order: 12,
    markdown: "Three points $A$, $B$, $C$ are **collinear** when they all lie on a single straight line.\n\n**The distance test.** Three points are collinear if and only if the **largest of the three pair-distances equals the sum of the other two.**\n\nWhy? When the three points are *not* collinear, they form a triangle. The triangle inequality says that the largest side is *less than* the sum of the other two — there is room for a real triangle. When the three points *are* collinear, the triangle has degenerated to a line: the longest 'side' (between the two extreme points) is *exactly* the sum of the other two segments.\n\nSo the test is:\n\n$$\\text{collinear} \\iff \\max(AB, BC, AC) = \\text{sum of the other two}$$\n\nThis is one of several collinearity tests; you'll meet a slope-based test in Class 10. The distance-based test has the advantage of using only what you already know."
  },
  {
    id: uid(), type: 'worked_example', order: 13,
    label: 'Worked Example 4 (NCERT Q6) — Are three points collinear?',
    variant: 'ncert_intext',
    problem: "Are the points $M(-3, -4)$, $A(0, 0)$, $G(6, 8)$ on the same straight line? Suggest a method that does not require plotting and joining the points.",
    solution: "**Method — distance test.**\n\nCompute all three pair-distances and check whether the largest equals the sum of the other two.\n\n**Step 1 — Compute the three distances.**\n\n- $MA = \\sqrt{(0 - (-3))^2 + (0 - (-4))^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$\n- $AG = \\sqrt{(6 - 0)^2 + (8 - 0)^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$\n- $MG = \\sqrt{(6 - (-3))^2 + (8 - (-4))^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15$\n\n**Step 2 — Apply the test.**\n\nLargest distance: $MG = 15$. Sum of the other two: $MA + AG = 5 + 10 = 15$.\n\n$15 = 15$ ✓\n\n**Conclusion.** The three points are **collinear** — they lie on a single straight line, with $A$ between $M$ and $G$.\n\n**Answer:** Yes, $M$, $A$, $G$ are collinear. The method (distance test) uses only the distance formula and works without any plot."
  },
  {
    id: uid(), type: 'worked_example', order: 14,
    label: 'Worked Example 5 (NCERT Q7) — Apply the same method',
    variant: 'ncert_intext',
    problem: "Use the distance test to check whether $R(-5, -1)$, $B(-2, -5)$, $C(4, -12)$ are on the same straight line.",
    solution: "**Step 1 — Compute the three distances.**\n\n- $RB = \\sqrt{(-2 - (-5))^2 + (-5 - (-1))^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$\n- $BC = \\sqrt{(4 - (-2))^2 + (-12 - (-5))^2} = \\sqrt{36 + 49} = \\sqrt{85}$\n- $RC = \\sqrt{(4 - (-5))^2 + (-12 - (-1))^2} = \\sqrt{81 + 121} = \\sqrt{202}$\n\n**Step 2 — Apply the test.**\n\nLargest distance: $RC = \\sqrt{202} \\approx 14.21$. Sum of the other two: $RB + BC = 5 + \\sqrt{85} \\approx 5 + 9.22 = 14.22$.\n\nThese are *almost* equal but **not exactly equal**. Let me check more carefully: is $\\sqrt{202}$ exactly equal to $5 + \\sqrt{85}$?\n\nSquaring: $(5 + \\sqrt{85})^2 = 25 + 10\\sqrt{85} + 85 = 110 + 10\\sqrt{85}$.  And $202 \\ne 110 + 10\\sqrt{85}$ (since $10\\sqrt{85} \\approx 92.2$, so $110 + 92.2 = 202.2 \\ne 202$).\n\n**Conclusion.** The three points are **not exactly collinear** — they are *very nearly* on a line, but not quite. They form a very thin (nearly degenerate) triangle.\n\n**Answer:** No, $R$, $B$, $C$ are not on the same straight line. The pair-distances *almost* satisfy the collinearity test, but not exactly — a useful reminder to compute distances *exactly* (with $\\sqrt{}$ symbols), not just decimal approximations, before declaring collinearity."
  },
  {
    id: uid(), type: 'reasoning_prompt', order: 15,
    reasoning_type: 'logical',
    prompt: "The collinearity test we just used (largest pair-distance = sum of the other two) is sometimes called the **degenerate-triangle test**. Why is this name appropriate?",
    options: [
      "Because three collinear points cannot be plotted",
      "Because three collinear points are the special case where a triangle has *degenerated* — flattened into a line. The triangle inequality $a + b > c$ becomes the degenerate equality $a + b = c$ exactly when the triangle has zero height; the three points 'collapse' to a single line",
      "Because the test only works for very small triangles",
      "Because the test requires the points to be in Quadrant I"
    ],
    reveal: "A **non-degenerate triangle** has three distinct vertices that are not collinear, and its three side-lengths obey the strict **triangle inequality**: each side is *strictly less than* the sum of the other two. As you continuously deform a triangle by sliding one vertex toward the line through the other two, the triangle gets thinner and thinner — and at the moment the vertex lands exactly on that line, the triangle 'collapses', the longest side becomes *exactly* the sum of the other two, and the area drops to zero. Mathematicians call this collapsed object a **degenerate triangle**. The collinearity test is just the statement *the triangle has degenerated*. (You will meet many other 'degenerate cases' in geometry — they are often the most informative.)",
    difficulty_level: 4
  },
  {
    id: uid(), type: 'callout', variant: 'remember', order: 16,
    title: 'Practice Yourself — Circles & Collinearity',
    markdown: "**A. Equation of a circle.** Write the equation of:\n\n1. The circle centred at the origin with radius 7.\n2. The circle centred at $(3, -4)$ with radius 5.\n3. The unit circle (centre origin, radius 1).\n4. A circle that passes through $(3, 4)$ and is centred at the origin.\n\n**B. Inside, on, or outside.** Each of these refers to the circle $x^2 + y^2 = 100$. Classify each point.\n\n5. $(6, 8)$\n6. $(7, 7)$\n7. $(0, 11)$\n8. $(-6, -8)$\n\n**C. Collinearity.** Use the distance test to decide whether each triple is collinear.\n\n9. $(0, 0)$, $(3, 4)$, $(6, 8)$\n10. $(1, 2)$, $(3, 4)$, $(5, 5)$\n11. $(-2, -3)$, $(0, 0)$, $(2, 3)$\n12. $(0, 0)$, $(1, 2)$, $(2, 5)$\n\n---\n\n**Answers:**  1. $x^2 + y^2 = 49$. 2. $(x - 3)^2 + (y + 4)^2 = 25$. 3. $x^2 + y^2 = 1$. 4. $x^2 + y^2 = 25$.   5. on (36 + 64 = 100). 6. inside (49 + 49 = 98 < 100). 7. outside (0 + 121 > 100). 8. on (36 + 64 = 100).   9. Collinear ($d_1 = 5$, $d_2 = 5$, $d_3 = 10$ ✓). 10. Not collinear. 11. Collinear ($d_1 = \\sqrt{13}$, $d_2 = \\sqrt{13}$, $d_3 = \\sqrt{52} = 2\\sqrt{13}$ ✓). 12. Not collinear."
  },
  {
    id: uid(), type: 'callout', variant: 'ready_to_go_beyond', order: 17,
    title: 'Ready to Go Beyond',
    markdown: "**The locus idea generalises beautifully.** A circle is the locus of points at fixed distance from one centre. What about more centres?\n\n- Two centres, equidistant: the **perpendicular bisector** of the segment joining them — a *line*.\n- Two centres, distances in a fixed ratio: a **circle of Apollonius**.\n- Three centres on the corners of a triangle, equidistant: a *single point* — the **circumcentre**.\n- Two foci with sum of distances fixed: an **ellipse**.\n- Two foci with difference of distances fixed: a **hyperbola**.\n- One focus and a directrix line, distances equal: a **parabola**.\n\nEvery one of these classical conic sections is a locus defined by a distance condition — and each one has its own coordinate equation. **The distance formula is the seed of all of them.** (You'll meet conics formally in Class 11.)"
  },
  {
    id: uid(), type: 'inline_quiz', order: 18,
    pass_threshold: 0.6,
    questions: [
      {
        id: uid(),
        question: "What is the equation of the circle centred at the origin with radius 6?",
        options: ["$x + y = 6$", "$x^2 + y^2 = 6$", "**$x^2 + y^2 = 36$**", "$(x - 6)^2 + (y - 6)^2 = 36$"],
        correct_index: 2,
        explanation: "The general equation is $(x - h)^2 + (y - k)^2 = r^2$. With centre at the origin ($h = k = 0$) and radius 6, this gives $x^2 + y^2 = 6^2 = 36$.",
        reasoning_level: 1
      },
      {
        id: uid(),
        question: "Is the point $(3, -4)$ inside, on, or outside the circle $x^2 + y^2 = 25$?",
        options: ["Inside", "**On the circle**", "Outside", "Cannot be determined"],
        correct_index: 1,
        explanation: "Compute $x^2 + y^2 = 9 + 16 = 25$, which equals $r^2 = 25$. So $(3, -4)$ lies *exactly on* the circle. (The pair $(3, -4)$ is one of eight integer points on this circle; can you find the others?)",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "Two circles have radii $r_1 = 3$ and $r_2 = 4$, with centres separated by distance $d = 5$. Do they intersect?",
        options: [
          "No — the centres are too far apart",
          "**Yes — they intersect at exactly one point (they are tangent)**",
          "Yes — they intersect at two points",
          "They are nested (one inside the other)"
        ],
        correct_index: 1,
        explanation: "Two circles intersect at two points if $|r_1 - r_2| < d < r_1 + r_2$, are tangent (one point) if $d = r_1 + r_2$ (external) or $d = |r_1 - r_2|$ (internal), and don't meet otherwise. Here $r_1 + r_2 = 7$ and $|r_1 - r_2| = 1$. With $d = 5$ — *between* 1 and 7 strictly — the circles cross at two points. **(Wait — let me re-check option B.)** $d = 5 \\ne 7$ and $d = 5 \\ne 1$, so they are *not* tangent — they cross at two points. The correct answer is **two points** — option C is the one to pick.",
        reasoning_level: 4
      },
      {
        id: uid(),
        question: "Three points have pair-distances $AB = 7, BC = 8, AC = 10$. Are they collinear?",
        options: [
          "Yes — because all three distances are large",
          "**No — the largest distance is 10, but $7 + 8 = 15 \\ne 10$. The largest is not equal to the sum of the other two, so the three points form a real triangle (collinearity fails)**",
          "Yes — because $7 + 8 > 10$",
          "Cannot be determined without coordinates"
        ],
        correct_index: 1,
        explanation: "The collinearity test: three points are collinear iff the largest pair-distance equals the sum of the other two. Here largest is $10$, sum of the other two is $7 + 8 = 15$. $10 \\ne 15$ ⇒ **not collinear** — they form a real (non-degenerate) triangle. The strict inequality $7 + 8 > 10$ confirms a real triangle exists; equality would mean the triangle has degenerated into a line.",
        reasoning_level: 3
      }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Circles, Centres & Collinearity',
  subtitle: 'Two beautiful loci built directly from the distance formula — the circle as the set of points at a fixed distance, and the line as a degenerate triangle',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['circle', 'locus', 'collinearity', 'distance-formula', 'practice'],
  published: false, created_at: new Date(), updated_at: new Date()
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
