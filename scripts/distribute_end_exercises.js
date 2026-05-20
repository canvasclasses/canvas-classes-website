'use strict';
/**
 * Back-distributes the single-concept End-of-Chapter exercises (Q1, Q2, Q4,
 * Q5, Q14) to their respective concept pages. Each becomes a worked_example
 * block inserted just before that page's inline_quiz.
 *
 * Idempotent: skips an insert if a worked_example with the same label already
 * exists on the target page.
 *
 * Run: node scripts/distribute_end_exercises.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';

const INSERTIONS = [
  {
    slug: 'where-am-i-the-need-for-coordinates',
    label: 'End-of-Chapter Q14 — A city grid',
    block: {
      type: 'worked_example',
      variant: 'ncert_intext',
      label: 'End-of-Chapter Q14 — A city grid',
      problem: "A city has two main roads crossing at the city centre — one running North-South, the other East-West. All other streets run parallel to these, spaced 200 m apart, with **10 streets in each direction**.\n\nDraw this on graph paper using the scale 1 cm = 200 m, with the central crossing as the origin. A street intersection is referred to as $(a, b)$ when the **a-th N-S street** meets the **b-th E-W street**. Using this convention:\n\n(a) How many street intersections can be referred to as $(4, 3)$?\n(b) How many street intersections can be referred to as $(3, 4)$?",
      problem_statement: '',
      solution: "**Setup.** With 10 streets in each direction and the central crossing at $(0, 0)$, the N-S streets are numbered from $-5$ to $+5$ and the E-W streets are numbered from $-5$ to $+5$ (giving 10 streets, 11 distinct numbers — but the central street is shared and counted once). Following the NCERT convention, the *a-th N-S street* and the *b-th E-W street* each refer to a *single* line; their intersection is a *single* point.\n\n**Step 1 — Read the convention carefully.** A street intersection labelled $(a, b)$ is the unique point where the $a$-th N-S street meets the $b$-th E-W street. So for any specific $(a, b)$, **there is exactly one intersection.**\n\n**(a) $(4, 3)$.** This is the intersection of the 4th N-S street with the 3rd E-W street. **Exactly one** such intersection.\n\n**(b) $(3, 4)$.** This is the intersection of the 3rd N-S street with the 4th E-W street. **Exactly one** such intersection — and it is a *different* point from $(4, 3)$. Like all coordinates, the order matters.\n\n**Answer:** Exactly **one** intersection in each case. The two are *different* points, illustrating once again the **ordered-pair rule** — $(4, 3) \\ne (3, 4)$.\n\n*Connection to Page 1.* This question is the modern echo of Mohenjo-daro's grid: an entire city built on a coordinate system, where every shop and every junction is locatable by two numbers from a chosen origin. The mathematical idea is **5,000 years old**; the city in this problem is using the same idea today.",
      reveal_mode: 'tap_to_reveal',
    },
  },
  {
    slug: 'bharat-coordinate-heritage',
    label: 'End-of-Chapter Q5 — A world without negatives',
    block: {
      type: 'worked_example',
      variant: 'ncert_intext',
      label: 'End-of-Chapter Q5 — A world without negative numbers',
      problem: "**What would a system of coordinates be like if we did not have negative numbers? Would such a system allow us to locate all the points on a 2-D plane?**",
      solution: "**A historical thought experiment.** Before Brahmagupta wrote down the rules of arithmetic with negative numbers in 628 CE, no consistent mathematical framework allowed negative numbers as 'real' quantities. Greek mathematicians (Euclid, Pythagoras) did all geometry without negatives. What would the coordinate plane look like under those rules?\n\n**Step 1 — What survives without negatives.**\n\n- The two axes still exist as half-lines starting from $0$ and extending in one direction (right and up). The *positive* x-axis and the *positive* y-axis only.\n- Points $(x, y)$ with $x \\ge 0$ and $y \\ge 0$ — i.e., points in **Quadrant I and on its boundary axes** — are well-defined.\n- The distance formula and Pythagoras work fine *within* Quadrant I.\n\n**Step 2 — What collapses without negatives.**\n\n- No origin in the modern sense — at most a single 'starting point' from which only positive distances are measured.\n- **Quadrants II, III, IV simply do not exist.** A point that is 'to the left of $0$' or 'below $0$' has no representation.\n- The whole notion of *reflection across the y-axis* (which sends $(3, 4)$ to $(-3, 4)$) is mathematically impossible.\n- A negative coordinate cannot appear in any equation, so no equation like $(x - 5)^2 + (y + 3)^2 = 9$ can be cleanly stated.\n\n**Step 3 — Can such a system locate all points on a 2-D plane?**\n\n**No.** Only **a single quadrant's worth of points** can be located — the upper-right region where both coordinates are non-negative. **Three-quarters of the plane is unreachable.**\n\n**Step 4 — Why this matters.**\n\nThis is the historical reason Brahmagupta's contribution is foundational. It is also why some historians of mathematics describe the **four-quadrant Cartesian plane** as resting on Indian shoulders: the geometry is older (Baudhāyana, Greek), but the *symmetric arithmetic* that makes the four-quadrant plane possible is Indian.\n\n**Answer:** Without negative numbers, a coordinate system would only be able to locate points in **Quadrant I (and the positive halves of the axes)**. Three of the four quadrants — three-quarters of the plane — would simply have no coordinate description. **Negative numbers are not optional for coordinate geometry; they are essential.**",
      reveal_mode: 'tap_to_reveal',
    },
  },
  {
    slug: 'two-axes-four-quadrants-cartesian-plane',
    label: 'End-of-Chapter Q1 — Coordinates of the origin',
    block: {
      type: 'worked_example',
      variant: 'ncert_intext',
      label: 'End-of-Chapter Q1 — Coordinates of the origin',
      problem: "What are the **x-coordinate** and **y-coordinate** of the **point of intersection of the two axes**?",
      solution: "**Setup.** The point of intersection of the x-axis and the y-axis is the **origin**, written as $O$.\n\n**Step 1 — x-coordinate.** Any point on the y-axis has $x = 0$ (it sits zero units away from the y-axis itself). The origin lies on the y-axis, so $O_x = 0$.\n\n**Step 2 — y-coordinate.** Any point on the x-axis has $y = 0$. The origin lies on the x-axis, so $O_y = 0$.\n\n**Step 3 — Combine.** The origin is the *unique* point lying on **both** axes simultaneously, so both its coordinates are zero.\n\n**Answer:** The x-coordinate of the origin is **0**; the y-coordinate is also **0**. The origin is denoted $O = (0, 0)$.",
      reveal_mode: 'tap_to_reveal',
    },
  },
  {
    slug: 'four-quadrants-where-every-point-lives',
    label: 'End-of-Chapter Q2 — Point H parallel to the y-axis',
    block: {
      type: 'worked_example',
      variant: 'ncert_intext',
      label: 'End-of-Chapter Q2 — Predicting the locus of H',
      problem: "Point $W$ has x-coordinate equal to $-5$. Can you predict the **coordinates of point $H$** which is on the line through $W$ parallel to the y-axis? **Which quadrants can $H$ lie in?**",
      solution: "**Step 1 — Locate the line through $W$ parallel to the y-axis.**\n\n$W$ has $x = -5$. A line through $W$ *parallel to the y-axis* is **vertical** — it consists of all points sharing the same x-coordinate as $W$. So the line is $\\{(x, y) : x = -5\\}$, i.e., **the vertical line $x = -5$**.\n\n**Step 2 — What can $H$'s coordinates be?**\n\nIf $H$ lies on this line, its x-coordinate is forced: $H_x = -5$. Its y-coordinate, however, is *free* — $H$ could be at $(-5, 100)$ or $(-5, -3.7)$ or anywhere else on the line.\n\nSo: $H = (-5, y)$ for **any** real $y$.\n\n**Step 3 — Which quadrants?**\n\nQuadrant identification depends on the signs of $H$'s coordinates:\n\n- $H_x = -5 < 0$ — fixed (negative).\n- $H_y$ depends on where on the line $H$ sits.\n\nIf $H_y > 0$: $H$ is in **Quadrant II** ($-, +$).\nIf $H_y < 0$: $H$ is in **Quadrant III** ($-, -$).\nIf $H_y = 0$: $H$ lies on the **negative x-axis** — not in any quadrant.\n\n**Answer:** $H = (-5, y)$ for any real $y$. $H$ can lie in **Quadrant II** (when $y > 0$) or **Quadrant III** (when $y < 0$); when $y = 0$, $H$ sits on the negative x-axis and belongs to no quadrant.",
      reveal_mode: 'tap_to_reveal',
    },
  },
  {
    slug: 'distance-between-two-points',
    label: 'End-of-Chapter Q4 — Right triangle IZN',
    block: {
      type: 'worked_example',
      variant: 'ncert_intext',
      label: 'End-of-Chapter Q4 — Plot Z and build a right-angled triangle',
      problem: "Plot the point $Z(5, -6)$ on the Cartesian plane. **Construct a right-angled triangle $IZN$** and find the lengths of its three sides.\n\n*Note:* The choice of $I$ and $N$ is up to you — different students can choose differently. Pick any two points $I$ and $N$ such that triangle $IZN$ is right-angled at $Z$.",
      solution: "**Setup.** $Z = (5, -6)$ — Quadrant IV (positive x, negative y). We need to choose two more points $I$ and $N$ so that $\\angle IZN = 90°$.\n\n**Strategy.** The simplest construction: pick $I$ directly **above** $Z$ on a vertical line, and $N$ directly **to the right of** $Z$ on a horizontal line. Then $ZI$ runs up and $ZN$ runs right — they are perpendicular.\n\n**Step 1 — Choose $I$ and $N$.**\n\nLet me pick:\n- $I = (5, 0)$ — directly above $Z$ on the line $x = 5$.\n- $N = (10, -6)$ — directly to the right of $Z$ on the line $y = -6$.\n\n(Many other choices work; this one keeps the arithmetic clean.)\n\n**Step 2 — Verify perpendicularity.**\n\n- Side $ZI$: from $(5, -6)$ to $(5, 0)$. Both points share $x = 5$ — vertical segment.\n- Side $ZN$: from $(5, -6)$ to $(10, -6)$. Both points share $y = -6$ — horizontal segment.\n- Vertical and horizontal segments are perpendicular ⇒ $\\angle IZN = 90°$. ✓\n\n**Step 3 — Compute the three side lengths.**\n\n- $ZI = |0 - (-6)| = 6$ (vertical leg).\n- $ZN = |10 - 5| = 5$ (horizontal leg).\n- $IN = \\sqrt{(10 - 5)^2 + (-6 - 0)^2} = \\sqrt{25 + 36} = \\sqrt{61}$ (hypotenuse).\n\n**Step 4 — Sanity check.**\n\nBy Baudhāyana–Pythagoras: $IZ^2 + ZN^2 = 36 + 25 = 61 = IN^2$. ✓\n\n**Answer (one valid choice):** $I(5, 0)$, $N(10, -6)$, $Z(5, -6)$. Sides $ZI = 6$, $ZN = 5$, $IN = \\sqrt{61} \\approx 7.81$. The triangle is right-angled at $Z$.\n\n*(Other valid choices include $I(5, 0)$ and $N(0, -6)$, giving sides $6, 5, \\sqrt{61}$ — same triangle, mirrored. Or you could place $I$ and $N$ along non-axis directions, as long as the angle at $Z$ is $90°$.)*",
      reveal_mode: 'tap_to_reveal',
    },
  },
];

function insertBeforeQuiz(blocks, blockBase, label) {
  if (blocks.some(b => b.type === 'worked_example' && b.label === label)) {
    return { blocks, inserted: false, reason: 'already present' };
  }
  // Find the inline_quiz block
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const quizIdx = sorted.findIndex(b => b.type === 'inline_quiz');
  if (quizIdx === -1) {
    return { blocks, inserted: false, reason: 'no inline_quiz found' };
  }
  const quizOrder = sorted[quizIdx].order;
  const newBlock = { id: randomUUID(), order: quizOrder, ...blockBase };
  const out = blocks.map(b => b.order >= quizOrder ? { ...b, order: b.order + 1 } : b);
  out.push(newBlock);
  out.sort((a, b) => a.order - b.order);
  return { blocks: out, inserted: true };
}

async function main() {
  if (!process.env.MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');

    for (const ins of INSERTIONS) {
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: ins.slug });
      if (!page) {
        console.log(`⚠️  Page not found: ${ins.slug}`);
        continue;
      }
      const result = insertBeforeQuiz(page.blocks || [], ins.block, ins.label);
      if (!result.inserted) {
        console.log(`= ${ins.slug} — skipped (${result.reason})`);
        continue;
      }
      await db.collection('book_pages').updateOne(
        { _id: page._id },
        { $set: { blocks: result.blocks, updated_at: new Date() } }
      );
      console.log(`✅ ${ins.slug} — inserted "${ins.label}" (${result.blocks.length} blocks total)`);
    }
  } finally { await client.close(); }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
