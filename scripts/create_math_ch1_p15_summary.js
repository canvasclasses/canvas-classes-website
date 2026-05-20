'use strict';
/**
 * Class 9 Math — Chapter 1 — Page 15
 * "Chapter Summary & The Road Ahead"
 * Closing page. Includes the NCERT Chapter Summary, restructured as a concept
 * map, plus a forward look at Class 10/11/12 extensions and applications.
 *
 * Run: node scripts/create_math_ch1_p15_summary.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'chapter-summary-and-the-road-ahead';
const CHAPTER_NUMBER = 1;
const PAGE_NUMBER = 15;
function uid() { return randomUUID(); }

const blocks = [
  {
    id: uid(), type: 'image', order: 0,
    src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic vista of a long mountain road at dawn — winding gracefully towards distant peaks under a star-flecked sky, with faint coordinate-grid lines etched onto the road surface, suggesting a journey that has begun and continues outward into more advanced mathematics',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A long mountain road at dawn winds gracefully toward distant Himalayan peaks. Above the peaks, a deep navy sky still holds a few of the brightest stars. Faint, almost-invisible coordinate grid lines are etched onto the road's surface, slowly fading as the road extends to the horizon. The image conveys: this chapter has set you onto a road that continues into Class 10, Class 11, and far beyond. Painterly cinematic illustration in the style of Indian dawn-mountain art. Dark background. No text, no labels."
  },
  {
    id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Look at how far you have travelled.\n\nYou began this chapter without a single formula. Now you can pin down any point in a plane with two numbers, find the distance between any two of them, halve a segment, reflect a shape, write the equation of a circle, and decide whether three points lie on a single line — all using nothing more than arithmetic and the Baudhāyana–Pythagoras theorem.\n\n**What is the *single most important* idea you take away?**",
    hint: "Look back at the chapter's Indian-mathematical thread: from Mohenjo-daro's grid through Baudhāyana, Āryabhaṭa, Brahmagupta, Bhāskara, Al-Bīrūnī, and finally Descartes.",
    reveal: "It is this: **algebra and geometry are two languages for the same things.** A point is a pair of numbers. A circle is an equation. A reflection is a sign-flip. A line is a degenerate triangle. The whole power of coordinate geometry — and of every higher mathematics built on it — comes from being able to switch fluently between the two languages. Whatever you struggled to picture, you could compute. Whatever you struggled to compute, you could picture. **Two languages, one mathematics.**"
  },
  {
    id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'ब्रह्मोपनिषद् — परम्परा-वाक्यम्',
    markdown: "_On the Continuity of Knowledge_\n\n### यद् पूर्वैः अधिगतम् ज्ञानम्\n### तद् नूतनैः परिवर्धितम् भवति।\n### एका परम्परा अव्यवच्छिन्ना\n### ज्ञानस्य गङ्गा प्रवहति॥\n\n*(yad pūrvaiḥ adhigataṃ jñānam /  tad nūtanaiḥ parivardhitam bhavati /  ekā paramparā avyavacchinnā /  jñānasya gaṅgā pravahati)*\n\n---\n\n*'जो ज्ञान पुरखों ने पाया, वही नये लोग आगे बढ़ाते हैं — एक धारा, अटूट, ज्ञान की गंगा बहती रहती है।'*\n\n*'What the ancients discovered, the new generation extends — one unbroken stream, the Ganges of knowledge, ever flowing.'*\n\nYou are now part of that stream. Every formula you learned in this chapter has roots in someone — Baudhāyana laying out an altar, Brahmagupta defining zero, Descartes drawing two perpendicular axes — and branches into whoever you become. **Mathematics is the most polite of inheritances:** you receive freely, and you may extend if you wish."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'The whole chapter, in one map' },
  {
    id: uid(), type: 'text', order: 4,
    markdown: "Here is the entire chapter, restated in 12 bullet points. **If you can explain each one to a friend in plain English, you own this chapter.**\n\n**1. Why coordinates exist.** A coordinate system gives every point in space a unique numerical address using a fixed reference, perpendicular axes, and a unit of measurement.\n\n**2. The 2-D Cartesian plane.** Two perpendicular number lines — the **x-axis** (horizontal) and the **y-axis** (vertical) — meet at the **origin** $O = (0, 0)$. A point P in the plane is described by an **ordered pair** $P(x, y)$.\n\n**3. The four quadrants.** The axes divide the plane into four regions, numbered anti-clockwise from the upper-right. Sign rules: Q I $(+,+)$, Q II $(-,+)$, Q III $(-,-)$, Q IV $(+,-)$. Points on an axis are not in any quadrant.\n\n**4. Points on the axes.** $(x, 0)$ lies on the x-axis; $(0, y)$ lies on the y-axis; $(0, 0)$ is the origin.\n\n**5. Order matters.** $(x, y) = (y, x)$ if and only if $x = y$. Otherwise the two points are different.\n\n**6. Distance along an axis.** Distance between $(x_1, y)$ and $(x_2, y)$ is $|x_2 - x_1|$. Same idea vertically.\n\n**7. The distance formula.** For arbitrary points $(x_1, y_1)$ and $(x_2, y_2)$ — by Baudhāyana–Pythagoras — the distance is $\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.\n\n**8. The midpoint formula.** The midpoint of $(x_1, y_1)$ and $(x_2, y_2)$ is $\\left( \\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2} \\right)$.\n\n**9. Reflections.** $(x, y) \\to (x, -y)$ in x-axis, $(x, y) \\to (-x, y)$ in y-axis, $(x, y) \\to (-x, -y)$ through origin. All preserve every length and angle.\n\n**10. Equation of a circle.** $(x - h)^2 + (y - k)^2 = r^2$ — the locus of points at distance $r$ from $(h, k)$.\n\n**11. Inside / on / outside a circle.** Compare $(x_0 - h)^2 + (y_0 - k)^2$ to $r^2$.\n\n**12. Collinearity test.** Three points are collinear iff the largest pair-distance equals the sum of the other two."
  },
  { id: uid(), type: 'heading', order: 5, level: 2, text: 'The Indian thread, in one timeline' },
  {
    id: uid(), type: 'timeline', order: 6,
    items: [
      { date: 'c. 3000 BCE', title: 'Sindhu-Sarasvatī cities', body: 'Mohenjo-daro, Dholavira, and Lothal were laid out on a north-south, east-west grid — the world\'s first urban-scale coordinate system.' },
      { date: 'c. 800 BCE', title: 'Baudhāyana — the Śulba-sūtra', body: 'First written statement of $a^2 + b^2 = c^2$ — the theorem that powers the distance formula. Used to lay out perfectly square Vedic altars.' },
      { date: 'c. 4th c. BCE', title: 'Ujjayinī — the prime meridian', body: 'The early Siddhāntas declared Ujjayinī the central longitude reference for India and much of Asia.' },
      { date: 'c. 499 CE', title: 'Āryabhaṭa — sines and stellar coordinates', body: 'Replaced Greek chords with sines, making the calculation of celestial coordinates much easier. Wrote the Āryabhaṭīya.' },
      { date: 'c. 628 CE', title: 'Brahmagupta — zero and negative numbers', body: 'In the Brahmasphuṭa-siddhānta, gave the first complete rules for arithmetic with zero and negatives. Without him, no four-quadrant Cartesian plane.' },
      { date: 'c. 1000 CE', title: 'Al-Bīrūnī — the astrolabe', body: 'Persian polymath who travelled to India, learned Sanskrit, used Indian methods to compute the coordinates of cities across Asia.' },
      { date: 'c. 1150 CE', title: 'Bhāskarāchārya — the Līlāvatī', body: 'Restated and extended Indian results in elegant verse. The Līlāvatī remained an Indian mathematics textbook for centuries.' },
      { date: '1637 CE', title: 'René Descartes — La Géométrie', body: 'Formalised the Cartesian coordinate plane in modern symbols. Synthesised 2,500 years of geometric thinking, much of it Indian, into the form you used in this chapter.' },
    ],
  },
  { id: uid(), type: 'heading', order: 7, level: 2, text: 'What you can now do' },
  {
    id: uid(), type: 'text', order: 8,
    markdown: "After this chapter, you can:\n\n- **Locate any point** in a 2-D plane and read its coordinates.\n- **Classify a point** by quadrant (or as on-axis) at a glance.\n- **Plot a point** given its coordinates, on graph paper or on a screen.\n- **Compute distance** between any two points, including diagonal segments via Pythagoras.\n- **Find the midpoint** of any segment.\n- **Reflect** any shape across the x-axis, the y-axis, or the origin.\n- **Write the equation** of a circle given its centre and radius.\n- **Decide** whether a given point lies inside, on, or outside a given circle.\n- **Test** whether three points are collinear, using only the distance formula.\n- **Verify** classical shapes (square, rectangle, isosceles or right-angled triangle) directly from coordinates.\n\nThis is a genuinely big toolkit. Almost every problem in coordinate geometry — through Class 10 and most of Class 11 — uses some combination of just these ten skills."
  },
  { id: uid(), type: 'heading', order: 9, level: 2, text: 'The road ahead' },
  {
    id: uid(), type: 'text', order: 10,
    markdown: "**In Class 10**, you will meet:\n\n- **The section formula** — generalises the midpoint formula. The point dividing a segment in ratio $m : n$ has coordinates $\\left( \\dfrac{m x_2 + n x_1}{m + n}, \\dfrac{m y_2 + n y_1}{m + n} \\right)$. The midpoint formula is the case $m : n = 1 : 1$.\n- **The area of a triangle from coordinates** — using a single neat formula. Setting it equal to zero gives a *cleaner* collinearity test.\n- **Slope of a line** — the rate at which y changes per unit x. Two lines are parallel when their slopes are equal; perpendicular when their slopes multiply to $-1$.\n- **The equation of a straight line** — three forms (slope-intercept, point-slope, two-point), all powered by coordinate ideas you already know.\n\n**In Class 11**, you will go to higher dimensions:\n\n- **3-D coordinates** $(x, y, z)$ — a third axis perpendicular to the first two. The distance formula extends to $\\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$.\n- **Polar coordinates** $(r, \\theta)$ — describe a point by distance from the origin and angle from a reference direction. Perfect for circles and stars.\n- **Conic sections** — circles, ellipses, parabolas, hyperbolas — each defined as a locus and described by a coordinate equation.\n\n**In Class 12 and beyond**:\n\n- **Calculus** — slopes become *derivatives*, areas become *integrals*. Coordinate geometry is the underlying language.\n- **Linear algebra** — points and vectors generalise to *n* dimensions; the same distance formula applies.\n- **Computer graphics, machine learning, robotics, GPS, satellite navigation, video-game physics, medical imaging** — all run on coordinate geometry, often in many more than 2 or 3 dimensions.\n\nThe chapter you have just finished is the foundation of every one of these. **Hold on to it.**"
  },
  {
    id: uid(), type: 'callout', variant: 'india_science', order: 11,
    title: "India's Continuing Contributions",
    markdown: "The Indian thread of this chapter does not stop with Bhāskarāchārya in 1150 CE. **Modern Indian mathematicians and institutions** continue to extend it:\n\n- **Srinivasa Ramanujan** (1887–1920) discovered remarkable identities involving sums and series — many used today in computer science and cryptography. His notebooks remain a living research project a century after his death.\n- **The Indian Statistical Institute** (founded by P.C. Mahalanobis in 1931) developed the **Mahalanobis distance** — a generalisation of the distance formula used heavily in machine learning to measure how similar two data points are.\n- **ISRO's NavIC system** (2018-) gives India its own satellite-navigation coordinate system, with seven satellites broadcasting position data to phones and vehicles across the subcontinent. A direct descendant of the same coordinate idea you just learned.\n- **Indian researchers in AI, robotics, and computational geometry** — at IITs, IISc, and TIFR — extend coordinate methods to dimensions in the millions.\n\nWhen you next open a navigation app, you are using a tool whose mathematical bones were laid in the Indus Valley 5,000 years ago, formalised in Sanskrit by Brahmagupta in the 7th century, and is still being extended by Indian scientists today. **The Ganges of knowledge keeps flowing.**"
  },
  {
    id: uid(), type: 'callout', variant: 'ready_to_go_beyond', order: 12,
    title: 'Ready to Go Beyond — Three Open Problems for the Curious',
    markdown: "If you have enjoyed this chapter, here are three questions to keep with you. None has a simple answer; each opens a door.\n\n1. **The closest pair problem.** Given $n$ points in the plane, find the two that are closest together. The brute-force approach checks all $n^2$ pairs — but a clever divide-and-conquer algorithm does it in $n \\log n$ time. (You'll meet this in computer science, around Class 11–12.)\n2. **The travelling salesman problem.** Given $n$ cities (each at known coordinates), find the shortest route that visits every city exactly once and returns home. **Nobody knows a fast algorithm.** This problem is the most famous *unsolved* puzzle in computer science and is worth millions of dollars to anyone who cracks it.\n3. **Higher dimensions.** What does the *distance formula* look like in **4-dimensional spacetime**? (Hint: it has a *minus* sign in it. Einstein's special relativity is built on this strange-but-beautiful generalisation. The minus sign is what allows time to be 'real, but different' from space.)\n\nThe coordinate geometry you have just learned is not the end of anything. It is the **start of every mathematical story you will ever read.**"
  },
  {
    id: uid(), type: 'inline_quiz', order: 13,
    pass_threshold: 0.6,
    questions: [
      {
        id: uid(),
        question: "Across the entire chapter, the **single most-used theorem** is:",
        options: [
          "The triangle inequality",
          "**The Baudhāyana–Pythagoras theorem** — written down in India around 800 BCE. It powers the distance formula, the equation of a circle, and the collinearity test, among others",
          "The reflection rule",
          "The midpoint formula"
        ],
        correct_index: 1,
        explanation: "Baudhāyana's statement that the square on the diagonal of a rectangle equals the sum of the squares on the sides is the seed of: the distance formula, the equation of a circle, the collinearity test, the verification of a square or rectangle, and the proof that reflection preserves distance. It is the single most reused theorem in this chapter.",
        reasoning_level: 1
      },
      {
        id: uid(),
        question: "If a point's coordinates are $(x, y)$ with $x \\ne 0$ and $y \\ne 0$, the point is:",
        options: [
          "Always at the origin",
          "Always in Quadrant I",
          "**In one of the four quadrants — never on an axis**",
          "Either on the x-axis or on the y-axis"
        ],
        correct_index: 2,
        explanation: "Both coordinates are non-zero, so the point cannot be on either axis. It must lie in exactly one of the four quadrants — which one depends on the signs of $x$ and $y$ (Q I if both +, Q II if x is − and y is +, Q III if both −, Q IV if x is + and y is −).",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "Brahmagupta's formal acceptance of **zero and negative numbers** in 628 CE was essential to coordinate geometry because:",
        options: [
          "It made arithmetic faster",
          "**Without zero there is no origin, and without negative numbers only the upper-right quadrant exists. Both ideas together are required for the four-quadrant Cartesian plane to be a valid mathematical object**",
          "It allowed Indians to translate Greek mathematics",
          "It introduced the decimal point"
        ],
        correct_index: 1,
        explanation: "The origin has coordinates $(0, 0)$ — without zero, there is no origin. The three quadrants involving negative coordinates (Q II, Q III, Q IV) require negative numbers to be valid mathematical objects — without negatives, only Quadrant I exists. Brahmagupta provided exactly these two foundations in 628 CE, making the four-quadrant plane mathematically possible. This is why some authors write Brahmagupta's name into the foundations of coordinate geometry.",
        reasoning_level: 3
      },
      {
        id: uid(),
        question: "Choose the statement that best summarises **the deep idea** of this chapter.",
        options: [
          "Coordinate geometry is a faster way to do arithmetic",
          "**Algebra and geometry are two languages for the same mathematical reality — every point in the plane is an ordered pair of numbers, every shape is an equation, and every geometric property has an algebraic translation**",
          "Coordinate geometry is only useful in real life",
          "The Pythagoras theorem is the most important result"
        ],
        correct_index: 1,
        explanation: "This is the central insight of coordinate geometry — and the reason Descartes's 1637 work was a turning point in mathematical history. By naming every point with two numbers, an entire branch of mathematics (geometry) becomes translatable into another (algebra). What is hard in one language often becomes easy in the other. Every higher mathematics — calculus, linear algebra, differential geometry, computer graphics, machine learning — extends this same idea. The chapter you just finished planted that seed.",
        reasoning_level: 5
      }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Chapter Summary & The Road Ahead',
  subtitle: 'Closing the chapter with a concept map, a 5,000-year timeline, and a forward look at where coordinate geometry takes you next',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['summary', 'recap', 'timeline', 'roadmap', 'india-science'],
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
