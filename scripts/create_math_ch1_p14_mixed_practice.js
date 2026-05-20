'use strict';
/**
 * Class 9 Math — Chapter 1 — Page 14
 * "Mixed Practice & Chapter Challenge"
 * Houses NCERT End-of-Ch Q3 (RAMP), Q8 (right-angled isosceles + isosceles
 * Q3-Q4 vertices), Q16 (Is ABCD a square?) plus several fresh integration
 * problems. The single-concept end-exercises (Q1, Q2, Q4, Q5, Q6, Q7, Q9-Q15)
 * are distributed to their concept pages by a separate script.
 *
 * Run: node scripts/create_math_ch1_p14_mixed_practice.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'mixed-practice-and-chapter-challenge';
const CHAPTER_NUMBER = 1;
const PAGE_NUMBER = 14;
function uid() { return randomUUID(); }

const blocks = [
  {
    id: uid(), type: 'image', order: 0,
    src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic vista: a vast workshop floor at dawn, with a coordinate grid faintly etched into the polished surface and a craftsperson assembling a small mechanical sculpture using rulers, compasses, and protractors — every tool the chapter has provided',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vast craftsperson's workshop at dawn, with morning light streaming in through tall windows. The polished wooden floor is faintly etched with a coordinate grid that fades softly into the wood grain. On a long workbench centred in the frame, a craftsperson is assembling a small mechanical sculpture from precise components — measuring with a ruler, marking with a compass, comparing angles with a protractor. The image conveys: every tool of this chapter — coordinates, distance, midpoints, reflections, circles — comes together in one craft. Painterly cinematic illustration. Dark background. No text, no labels."
  },
  {
    id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "You have now built a complete toolkit:\n\n- **Coordinates** to name any point in a plane\n- **Quadrants** to read a point at a glance\n- **Distance formula** to measure between any two points\n- **Midpoint formula** to find the halfway point of a segment\n- **Reflections** to mirror shapes\n- **Circles & loci** to describe sets of equidistant points\n\nThe questions on this page **don't tell you which tool to use**. That is exactly the point. The hardest part of mathematics is not applying a formula — it is *recognising which formula applies*. \n\nReady?",
    hint: "If a question mentions 'a square' — what tools can verify a square? (Equal sides via distance; right angles via... we'll see.)",
    reveal: "When a problem mixes concepts, the trick is to **translate the geometric statement into coordinate conditions, one at a time.** A square: four equal sides AND equal diagonals. A right-angled isosceles triangle: two equal sides AND one right angle. Once you list the conditions, each one becomes a small coordinate problem. The mixed-practice problems on this page are designed to give you that translating muscle."
  },
  {
    id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'भगवद्गीता — १८.७८',
    markdown: "_The Closing Verse of the Gītā_\n\n### यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।\n### तत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम॥\n\n---\n\n*'जहाँ ज्ञान (कृष्ण) और कार्य (अर्जुन) मिलते हैं, वहीं सच्ची विजय, समृद्धि और स्थिर बुद्धि होती है।'*\n\n*'Where knowledge meets action, there is sure victory, prosperity, and steady judgement.'*\n\nThe Gītā ends by joining knowledge (the *theory* you've learned across this chapter) and action (the *practice* on this page). Mathematics works the same way. **Knowing a formula and applying it under uncertainty are two different skills**; the second is what this page builds."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'NCERT Q3 — Reading a rectangle from coordinates' },
  {
    id: uid(), type: 'worked_example', order: 4,
    label: 'Worked Example 1 (NCERT End-of-Ch Q3) — RAMP rectangle',
    variant: 'ncert_intext',
    problem: "Consider the points $R(3, 0)$, $A(0, -2)$, $M(-5, -2)$, $P(-5, 2)$. If they are joined in the order R-A-M-P, predict:\n\n(i) Two sides of RAMP that are perpendicular to each other.\n(ii) One side of RAMP that is parallel to one of the axes.\n(iii) Two points that are mirror images of each other in one axis. Which axis?",
    solution: "**Setup.** The four sides of quadrilateral RAMP are $RA$, $AM$, $MP$, $PR$. Let me find each side's direction by looking at the change in coordinates.\n\n**Side RA:** $R(3, 0) \\to A(0, -2)$. Δx = −3, Δy = −2. Diagonal — neither horizontal nor vertical.\n\n**Side AM:** $A(0, -2) \\to M(-5, -2)$. Δx = −5, Δy = **0**. **Horizontal** segment (parallel to the x-axis), length 5.\n\n**Side MP:** $M(-5, -2) \\to P(-5, 2)$. Δx = **0**, Δy = 4. **Vertical** segment (parallel to the y-axis), length 4.\n\n**Side PR:** $P(-5, 2) \\to R(3, 0)$. Δx = 8, Δy = −2. Diagonal.\n\n**(i) Perpendicular sides.** $AM$ is horizontal and $MP$ is vertical — they are perpendicular. ✓\n\n**(ii) Side parallel to an axis.** Both $AM$ (parallel to x-axis) and $MP$ (parallel to y-axis) qualify.\n\n**(iii) Mirror-image pair.** Compare the four points:\n- Are any two related by *flipping x* (reflection in y-axis)? Need same y, opposite x. None match.\n- Are any two related by *flipping y* (reflection in x-axis)? Need same x, opposite y. **$M(-5, -2)$ and $P(-5, 2)$** match — same $x = -5$, opposite y-coordinates. ✓ They are mirror images in the **x-axis**.\n\n**Answer:**\n- (i) $AM$ and $MP$ are perpendicular.\n- (ii) $AM$ is parallel to the x-axis (and $MP$ is parallel to the y-axis).\n- (iii) $M$ and $P$ are mirror images in the **x-axis**.\n\nIs RAMP a rectangle? It has one right angle at $M$ and a pair of perpendicular sides — but checking the other angles requires more work. Try plotting: $R(3, 0), A(0, -2), M(-5, -2), P(-5, 2)$. The shape is *not* a rectangle — sides $RA$ and $PR$ are diagonal and don't form right angles with $AM$ and $MP$. RAMP is a general quadrilateral."
  },
  { id: uid(), type: 'heading', order: 5, level: 2, text: 'NCERT Q8 — Building special triangles by hand' },
  {
    id: uid(), type: 'worked_example', order: 6,
    label: 'Worked Example 2 (NCERT End-of-Ch Q8 i) — Right-angled isosceles triangle',
    variant: 'ncert_intext',
    problem: "Using the origin as one vertex, plot the vertices of a **right-angled isosceles triangle**.",
    solution: "**Strategy.** A right-angled isosceles triangle has *two* equal sides meeting at a right angle, plus a hypotenuse. We need three vertices, one of which is the origin.\n\n**Idea.** The simplest construction: place the right angle at the origin, with the two equal legs running along the positive x-axis and the positive y-axis.\n\n**Step 1 — Choose a leg length.** Pick any positive length, say 4 units.\n\n**Step 2 — Place the three vertices.**\n\n- $O(0, 0)$ — the right-angle corner.\n- $A(4, 0)$ — along the positive x-axis.\n- $B(0, 4)$ — along the positive y-axis.\n\n**Step 3 — Verify.**\n\n- $OA = 4$ (leg, along x-axis).\n- $OB = 4$ (leg, along y-axis).\n- $AB = \\sqrt{(4-0)^2 + (0-4)^2} = \\sqrt{32} = 4\\sqrt{2}$ (hypotenuse).\n- $\\angle AOB = 90°$ (axes are perpendicular). ✓\n- $OA = OB$ ⇒ legs equal ⇒ isosceles. ✓\n\n**Answer:** $O(0, 0)$, $A(4, 0)$, $B(0, 4)$ form a right-angled isosceles triangle.\n\n*(Note: there are infinitely many right-angled isosceles triangles with one vertex at the origin — you could pick any leg length, and you could place the legs along any two perpendicular directions.)*"
  },
  {
    id: uid(), type: 'worked_example', order: 7,
    label: 'Worked Example 3 (NCERT End-of-Ch Q8 ii) — Isosceles triangle in Q3 + Q4',
    variant: 'ncert_intext',
    problem: "Using the origin as one vertex, plot the vertices of an **isosceles triangle** with one vertex in **Quadrant III** and another in **Quadrant IV**.",
    solution: "**Strategy.** An isosceles triangle has at least two sides of equal length. The third vertex must be in Quadrant III ($x < 0, y < 0$); the other must be in Quadrant IV ($x > 0, y < 0$). The first vertex is the origin.\n\n**Idea.** If we make the *two sides from the origin* equal, the triangle is automatically isosceles. The simplest symmetric choice: place the two non-origin vertices as **mirror images of each other in the y-axis**, both in the lower half (negative y).\n\n**Step 1 — Pick a position for the Q-IV vertex.** Choose $A(3, -4)$ — in Quadrant IV (positive x, negative y).\n\n**Step 2 — Reflect across the y-axis to get the Q-III vertex.** $B = $ y-axis reflection of $A = (-3, -4)$ — in Quadrant III.\n\n**Step 3 — Verify.**\n\n- $OA = \\sqrt{9 + 16} = 5$.\n- $OB = \\sqrt{9 + 16} = 5$. ✓ ($OA = OB$, so isosceles.)\n- $AB = \\sqrt{(-3 - 3)^2 + (-4 - (-4))^2} = \\sqrt{36 + 0} = 6$ (the base, horizontal).\n- $A$ in Quadrant IV ($x = 3 > 0, y = -4 < 0$). ✓\n- $B$ in Quadrant III ($x = -3 < 0, y = -4 < 0$). ✓\n\n**Answer:** $O(0, 0)$, $A(3, -4)$, $B(-3, -4)$ — a 5-5-6 isosceles triangle with the origin at the apex and base running horizontally below the x-axis.\n\n*(Generalisation: any pair of points $(a, -b)$ and $(-a, -b)$ with $a, b > 0$ works.)*"
  },
  { id: uid(), type: 'heading', order: 8, level: 2, text: 'NCERT Q16 — When is a quadrilateral a square?' },
  {
    id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 4 (NCERT End-of-Ch Q16) — ABCD: square or not?',
    variant: 'ncert_intext',
    problem: "Plot the points $A(2, 1), B(-1, 2), C(-2, -1), D(1, -2)$. Is $ABCD$ a square? Justify. If yes, what is its area?",
    solution: "**Strategy.** A quadrilateral $ABCD$ is a **square** when:\n\n1. All four sides are equal: $AB = BC = CD = DA$.\n2. The two diagonals are equal: $AC = BD$.\n\n(Equivalently: equal sides + equal diagonals ⇒ all four angles are right angles ⇒ square. The condition is sufficient.)\n\n**Step 1 — Compute the four side lengths.**\n\n- $AB = \\sqrt{(-1 - 2)^2 + (2 - 1)^2} = \\sqrt{9 + 1} = \\sqrt{10}$\n- $BC = \\sqrt{(-2 - (-1))^2 + (-1 - 2)^2} = \\sqrt{1 + 9} = \\sqrt{10}$\n- $CD = \\sqrt{(1 - (-2))^2 + (-2 - (-1))^2} = \\sqrt{9 + 1} = \\sqrt{10}$\n- $DA = \\sqrt{(2 - 1)^2 + (1 - (-2))^2} = \\sqrt{1 + 9} = \\sqrt{10}$\n\nAll four sides equal $\\sqrt{10}$. ✓ (This makes ABCD at least a *rhombus*.)\n\n**Step 2 — Compute the two diagonals.**\n\n- $AC = \\sqrt{(-2 - 2)^2 + (-1 - 1)^2} = \\sqrt{16 + 4} = \\sqrt{20}$\n- $BD = \\sqrt{(1 - (-1))^2 + (-2 - 2)^2} = \\sqrt{4 + 16} = \\sqrt{20}$\n\nBoth diagonals equal $\\sqrt{20}$. ✓ (Combined with equal sides, this confirms ABCD is a **square**.)\n\n**Step 3 — Why does 'equal sides + equal diagonals' imply a square?**\n\nA quadrilateral with four equal sides is a *rhombus*. A rhombus with equal diagonals must have right angles (the diagonals of any rhombus bisect each other at right angles, and they are equal only when the rhombus is a square). So ABCD is a square.\n\n**Step 4 — Area.**\n\nFor a square of side $s$, the area is $s^2$.\n\n$$\\text{Area} = (\\sqrt{10})^2 = 10 \\text{ square units}$$\n\nAlternative check: the diagonals of a square cross at right angles, and the area equals $\\dfrac{1}{2} d_1 d_2$ where $d_1, d_2$ are the diagonals. Both diagonals are $\\sqrt{20}$, so area $= \\dfrac{1}{2} \\cdot \\sqrt{20} \\cdot \\sqrt{20} = \\dfrac{20}{2} = 10$. ✓\n\n**Answer:** Yes, $ABCD$ is a **square** with side length $\\sqrt{10}$ units and area **10 square units**."
  },
  { id: uid(), type: 'heading', order: 10, level: 2, text: 'Three fresh integration problems' },
  {
    id: uid(), type: 'worked_example', order: 11,
    label: 'Challenge 1 — Find a point at a given distance, on a given line',
    variant: 'solved_example',
    problem: "Find the coordinates of the point on the **x-axis** that is **5 units** from the point $P(3, 4)$.",
    solution: "**Setup.** A point on the x-axis has the form $(x, 0)$. We need $\\sqrt{(x - 3)^2 + (0 - 4)^2} = 5$.\n\n**Step 1 — Square both sides.**\n\n$(x - 3)^2 + 16 = 25$\n$(x - 3)^2 = 9$\n$x - 3 = \\pm 3$\n$x = 6$ or $x = 0$\n\n**Step 2 — Verify both solutions.**\n\n- $(6, 0)$: $\\sqrt{(6 - 3)^2 + (0 - 4)^2} = \\sqrt{9 + 16} = 5$ ✓\n- $(0, 0)$: $\\sqrt{(0 - 3)^2 + (0 - 4)^2} = \\sqrt{9 + 16} = 5$ ✓\n\n**Answer:** **Two points** — $(6, 0)$ and the origin $(0, 0)$.\n\n*Geometric meaning:* the circle of radius 5 centred at $(3, 4)$ crosses the x-axis at exactly two points. (When you draw it, this is obvious.) **Always allow two solutions when squaring** — you may have introduced an extraneous one, OR you may have found two genuine solutions, as here."
  },
  {
    id: uid(), type: 'worked_example', order: 12,
    label: 'Challenge 2 — Use midpoint and distance together',
    variant: 'solved_example',
    problem: "$M(-1, 4)$ is the midpoint of segment $AB$. If $A = (3, -2)$ and the **diagonal of segment $AB$** is part of a square $AXBY$ (a square whose diagonals are $AB$ and $XY$, crossing at $M$), find any one valid pair of coordinates for $X$ and $Y$.",
    solution: "**Strategy.** In a square, the two diagonals are equal in length and **perpendicular**, and they bisect each other at the centre $M$. So $X$ and $Y$ must:\n\n- Sit on the line through $M$ perpendicular to $AB$.\n- Be equidistant from $M$, with $MX = MY = \\dfrac{1}{2} \\cdot AB$.\n\n**Step 1 — Find $B$.**\n\nFrom $M$ midpoint and $A = (3, -2)$: $B_x = 2(-1) - 3 = -5$, $B_y = 2(4) - (-2) = 10$. So $B = (-5, 10)$.\n\n**Step 2 — Find $|AB|$.**\n\n$|AB| = \\sqrt{(-5 - 3)^2 + (10 - (-2))^2} = \\sqrt{64 + 144} = \\sqrt{208} = 4\\sqrt{13}$.\n\nHalf-diagonal: $|MX| = |MY| = 2\\sqrt{13}$.\n\n**Step 3 — Direction of AB.**\n\nFrom $A(3, -2)$ to $B(-5, 10)$: direction vector $(-8, 12)$, or normalised, $\\left( \\dfrac{-8}{4\\sqrt{13}}, \\dfrac{12}{4\\sqrt{13}} \\right) = \\left( \\dfrac{-2}{\\sqrt{13}}, \\dfrac{3}{\\sqrt{13}} \\right)$.\n\n**Step 4 — Perpendicular direction.**\n\nA 90°-rotation of $(-2, 3)$ is $(3, 2)$ (or $(-3, -2)$, the opposite). Length $\\sqrt{9 + 4} = \\sqrt{13}$, so unit vector $\\left( \\dfrac{3}{\\sqrt{13}}, \\dfrac{2}{\\sqrt{13}} \\right)$.\n\n**Step 5 — Position $X$ and $Y$.**\n\nFrom $M(-1, 4)$, move $2\\sqrt{13}$ in the perpendicular direction:\n\n$$X = M + 2\\sqrt{13} \\cdot \\left( \\frac{3}{\\sqrt{13}}, \\frac{2}{\\sqrt{13}} \\right) = (-1 + 6, 4 + 4) = (5, 8)$$\n$$Y = M - 2\\sqrt{13} \\cdot \\left( \\frac{3}{\\sqrt{13}}, \\frac{2}{\\sqrt{13}} \\right) = (-1 - 6, 4 - 4) = (-7, 0)$$\n\n**Step 6 — Verify.**\n\n- $|MX| = \\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$ ✓\n- $|MY| = \\sqrt{36 + 16} = 2\\sqrt{13}$ ✓\n- $|XY| = \\sqrt{144 + 64} = \\sqrt{208} = 4\\sqrt{13} = |AB|$ ✓ (equal diagonals)\n- $AB \\perp XY$? Direction of XY is $(-7-5, 0-8) = (-12, -8)$ — proportional to $(3, 2)$ but in the opposite sense. Direction of AB is $(-8, 12)$ — proportional to $(-2, 3)$. Dot product of $(3, 2)$ and $(-2, 3)$: $-6 + 6 = 0$ ✓ (perpendicular).\n\n**Answer:** $X = (5, 8)$, $Y = (-7, 0)$ — one of the two valid choices (the labels can be swapped)."
  },
  {
    id: uid(), type: 'worked_example', order: 13,
    label: 'Challenge 3 — Equation of a circle through three given points',
    variant: 'solved_example',
    problem: "Find the equation of the circle that passes through $A(0, 0)$, $B(6, 0)$, and $C(0, 8)$.",
    solution: "**Strategy.** Three (non-collinear) points uniquely determine a circle. Let the centre be $(h, k)$ and radius $r$. Then all three points are at distance $r$ from $(h, k)$.\n\n**Step 1 — Notice the special structure.** $A, B, C$ form a right triangle with the right angle at the origin (legs along the axes). For a circle passing through all three vertices of a right-angled triangle, the **hypotenuse is a diameter** (a classical theorem from Euclid). So the centre is the **midpoint of the hypotenuse $BC$**.\n\n**Step 2 — Find the centre.**\n\n$$M_{BC} = \\left( \\frac{6 + 0}{2}, \\frac{0 + 8}{2} \\right) = (3, 4)$$\n\n**Step 3 — Find the radius.**\n\nRadius = half the hypotenuse $BC$: $|BC| = \\sqrt{36 + 64} = 10$, so radius = 5.\n\nVerify: distance from $(3, 4)$ to $(0, 0)$ is $\\sqrt{9 + 16} = 5$ ✓. To $(6, 0)$: $\\sqrt{9 + 16} = 5$ ✓. To $(0, 8)$: $\\sqrt{9 + 16} = 5$ ✓.\n\n**Step 4 — Write the equation.**\n\n$$(x - 3)^2 + (y - 4)^2 = 25$$\n\n**Answer:** $(x - 3)^2 + (y - 4)^2 = 25$ — circle of centre $(3, 4)$ and radius 5."
  },
  {
    id: uid(), type: 'reasoning_prompt', order: 14,
    reasoning_type: 'analogical',
    prompt: "Across all 14 problems on this page (including the worked examples), the **same three formulas** keep showing up: distance, midpoint, and the equation of a circle. Why are these three so often enough?",
    options: [
      "Because mathematics is small — only three formulas exist",
      "Because Class 9 doesn't include other tools",
      "Because **distance, midpoint, and circle equation are the three most basic *coordinate translations* of the most basic geometric notions** — *separation*, *halfway*, and *fixed-distance*. Almost every classical geometric property (perpendicularity, congruence, parallelism, isometry) can be re-expressed using one or more of these three. The toolkit is small because the underlying geometric concepts are few — but each one carries enormous reach",
      "Because the problems were designed to use only these three"
    ],
    reveal: "The three formulas in this chapter cover three core geometric primitives: **how far apart**, **the halfway point**, and **the fixed-distance set (a circle)**. Every classical proposition you may meet — Pythagoras, the perpendicular bisector being a locus, the diameter-subtends-right-angle theorem you used in Challenge 3 — can be re-cast as a coordinate statement using these tools. This is exactly Descartes's revolution in 1637: he showed that *all* of plane geometry could be done with **two coordinates and a few formulas built from them**. You have just learned the most important of those formulas. Calculus, linear algebra, and computer graphics all extend this same toolkit — they don't replace it.",
    difficulty_level: 5
  },
  {
    id: uid(), type: 'callout', variant: 'remember', order: 15,
    title: 'Mixed Practice — Six More Problems',
    markdown: "1. Three vertices of a parallelogram are $(2, 1)$, $(5, 4)$, $(8, 1)$. Find the fourth vertex. (Two answers possible — find both.)\n2. Show that the points $(0, 0)$, $(3, 0)$, $(3, 4)$, $(0, 4)$ form a **rectangle**, and find its perimeter and area.\n3. Find the equation of the circle that has $A(2, 3)$ and $B(8, 11)$ as endpoints of a **diameter**.\n4. Triangle $PQR$ has vertices $P(0, 0)$, $Q(6, 0)$, $R(3, h)$. For what value of $h$ is the triangle equilateral? Justify.\n5. Reflect the triangle from Problem 4 (with $h = 3\\sqrt{3}$) across the **x-axis**. Find the area of the resulting triangle. Compare to the original.\n6. A circle has equation $(x - 3)^2 + (y - 4)^2 = 25$. The point $P(8, 4)$ lies on the circle (check). Find the coordinates of the point **diametrically opposite** $P$ on the circle.\n\n---\n\n**Answers:**\n1. Three possibilities depending on which pair are opposite: $(5, -2)$, $(-1, 4)$, or $(11, 4)$. The most natural choice (when the given vertices form three corners in order) is $(5, -2)$.\n2. Sides: $3, 4, 3, 4$. Diagonals: both $5$. Equal diagonals + equal opposite sides + right angle at $(0, 0)$ ⇒ rectangle. Perimeter = 14, area = 12.\n3. Centre = midpoint of $AB$ = $(5, 7)$. Radius = $|AB|/2 = \\sqrt{36+64}/2 = 5$. Equation: $(x - 5)^2 + (y - 7)^2 = 25$.\n4. Equilateral ⇒ all sides equal. $|PQ| = 6$, so we need $|PR| = |QR| = 6$. $|PR| = \\sqrt{9 + h^2}$. Setting $\\sqrt{9 + h^2} = 6$: $h^2 = 27$, $h = 3\\sqrt{3}$ (taking the positive root for the triangle above the x-axis).\n5. Reflected vertices: $(0, 0), (6, 0), (3, -3\\sqrt{3})$. Side lengths unchanged ⇒ same area as original = $\\frac{\\sqrt{3}}{4} \\cdot 6^2 = 9\\sqrt{3}$. Reflection preserves area exactly.\n6. Centre $(3, 4)$. The diametrically opposite point of $P(8, 4)$ is reflection of $P$ through the centre: $(2 \\cdot 3 - 8, 2 \\cdot 4 - 4) = (-2, 4)$."
  },
  {
    id: uid(), type: 'callout', variant: 'what_if', order: 16,
    title: 'What if…',
    markdown: "**What if** every map you have ever used had been built without coordinates?\n\nNo Google Maps. No GPS. No road navigation in unfamiliar cities. No Uber, no Ola, no Swiggy delivery, no school bus tracking. No air traffic control. No weather radar. No satellite imagery. No CAD-built building you've ever entered. No 2-D screen on which you read this page.\n\n*Now ask:* what would you replace these with? How would humanity organise space without the tool you have just spent fifteen pages learning?\n\nThere is no single correct answer. The question is meant to make you feel the **size** of what you now know."
  },
  {
    id: uid(), type: 'inline_quiz', order: 17,
    pass_threshold: 0.6,
    questions: [
      {
        id: uid(),
        question: "A quadrilateral has vertices $A(0, 0), B(4, 0), C(4, 4), D(0, 4)$. What kind of quadrilateral is it?",
        options: [
          "A rhombus, but not a square",
          "**A square** — all four sides equal $4$, both diagonals equal $4\\sqrt{2}$",
          "A general quadrilateral",
          "A right-angled trapezium"
        ],
        correct_index: 1,
        explanation: "All four sides have length 4. Both diagonals have length $\\sqrt{16 + 16} = 4\\sqrt{2}$. Equal sides + equal diagonals ⇒ square. (Equivalently, the four sides are along the two axes' directions and have a right angle at every corner.)",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "If the points $A(2, 3)$, $B(5, 7)$, $C(11, 15)$ are tested for collinearity, what is the result?",
        options: [
          "Not collinear — the three pair-distances do not satisfy the test",
          "**Collinear** — $|AB| = 5, |BC| = 10, |AC| = 15$, and $|AC| = |AB| + |BC|$, so $A$, $B$, $C$ are on a straight line with $B$ between $A$ and $C$",
          "Cannot decide without plotting",
          "Collinear only when projected onto the x-axis"
        ],
        correct_index: 1,
        explanation: "$|AB| = \\sqrt{9 + 16} = 5$. $|BC| = \\sqrt{36 + 64} = 10$. $|AC| = \\sqrt{81 + 144} = 15$. Largest distance $= 15$, sum of others $= 15$. Equality ⇒ collinear, with $B$ between $A$ and $C$.",
        reasoning_level: 3
      },
      {
        id: uid(),
        question: "The point $(3, 4)$ lies on the circle $x^2 + y^2 = 25$. The **diametrically opposite** point on this circle is:",
        options: ["$(4, 3)$", "$(-3, -4)$", "$(3, -4)$", "$(-4, -3)$"],
        correct_index: 1,
        explanation: "Centre of the circle is at the origin $(0, 0)$. The diametrically opposite point of $(3, 4)$ is the reflection through the centre — $(-3, -4)$. (You can also see this as: the centre is the midpoint of any diameter, so $(0, 0) = \\frac{(3, 4) + Q}{2}$ ⇒ $Q = (-3, -4)$.)",
        reasoning_level: 3
      },
      {
        id: uid(),
        question: "In a square $ABCD$ with vertex $A(0, 0)$ and the diagonal $AC$ along the **x-axis**, with $|AC| = 6$. Find the coordinates of $B$ and $D$.",
        options: [
          "$B = (3, 3), D = (3, -3)$",
          "$B = (6, 0), D = (0, 6)$",
          "$B = (0, 6), D = (6, 0)$",
          "**$B = (3, 3), D = (3, -3)$ — the diagonals of a square are perpendicular and equal; they bisect each other at the centre $(3, 0)$, so $B$ and $D$ are 3 units up and down from the centre**"
        ],
        correct_index: 3,
        explanation: "If $A = (0, 0)$ and the diagonal $AC$ lies along the positive x-axis with length 6, then $C = (6, 0)$. The two diagonals of a square are perpendicular and equal in length, and they share their midpoint. The midpoint of $AC$ is $(3, 0)$ — that's also the midpoint of $BD$. The diagonal $BD$ is perpendicular to $AC$, so it lies along the vertical line $x = 3$, and has the same length 6. Half-length 3 above and below the centre gives $B = (3, 3)$ and $D = (3, -3)$ (or labels swapped).",
        reasoning_level: 4
      }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Mixed Practice & Chapter Challenge',
  subtitle: 'Where the chapter\'s tools meet head-on — multi-concept problems that reward translating geometry into coordinate conditions',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['mixed-practice', 'integration', 'square', 'isosceles', 'collinearity', 'circle', 'midpoint', 'distance'],
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
