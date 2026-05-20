'use strict';
/**
 * Class 9 Math — Chapter 1 — Page 11
 * "Reflections in the Axes"
 * Covers NCERT page 11 (triangle AMD reflected in y-axis, distances preserved).
 *
 * Run: node scripts/create_math_ch1_p11_reflections.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'reflections-in-the-axes';
const CHAPTER_NUMBER = 1;
const PAGE_NUMBER = 11;
function uid() { return randomUUID(); }

const blocks = [
  // 0: hero
  {
    id: uid(), type: 'image', order: 0,
    src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic view of a mirror-still lake at dawn — a single triangular sail boat above the water, its inverted reflection perfectly mirrored below; the water surface acts as the x-axis, suggesting the geometry of reflection across an axis',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A perfectly still mountain lake at dawn. A single triangular-sailed boat sits above the water on the upper half of the frame; below, the water surface acts as a mirror, returning a perfect inverted reflection of the same boat. The water line through the centre of the frame is razor-sharp — it is, in effect, the x-axis. Cool dawn light, atmospheric mist hanging over the water. The image conveys: nature performs reflections constantly; mathematics names them and writes them as coordinate transformations. Painterly cinematic illustration. Dark background. No text, no labels."
  },
  // 1: curiosity
  {
    id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "When you stand in front of a mirror and lift your **right** hand, your reflection lifts what looks like its **left** hand. Lengths and angles are unchanged — the reflection is the same height, the same shape, the same proportions — but **left and right have swapped**.\n\nNow take this idea to the coordinate plane. If you reflect a point across the **y-axis**, what happens to its coordinates? What stays the same — and what flips?",
    hint: "Try a specific point, say $(3, 4)$. The y-axis is the vertical line $x = 0$. Imagine folding the page along that line. Where does $(3, 4)$ land?",
    reveal: "The point $(3, 4)$ folds onto $(-3, 4)$. The y-coordinate stays the same; the x-coordinate flips its sign. **Reflecting in the y-axis flips x; reflecting in the x-axis flips y; reflecting through the origin flips both.** On this page you'll prove these rules and confirm — using the distance formula — that all the side lengths of any shape are perfectly preserved by a reflection."
  },
  // 2: fun_fact verse
  {
    id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'भगवद्गीता — २.२२ (परावर्तन का दृष्टान्त)',
    markdown: "_On Mirrored Forms_\n\n### वासांसि जीर्णानि यथा विहाय\n### नवानि गृह्णाति नरोऽपराणि।\n### तथा शरीराणि विहाय जीर्णान्\n### अन्यानि संयाति नवानि देही॥\n\n---\n\n*'जैसे मनुष्य पुराने कपड़े उतार कर नये पहन लेता है, वैसे ही आत्मा एक रूप छोड़ कर दूसरा रूप ले लेती है।'*\n\n*'As a person sheds worn-out garments and puts on new ones, so the self leaves one form and takes another.'*\n\nThe Gita's image of *form-changing-while-essence-stays* is exactly the geometry of a reflection: every coordinate of a shape may change, but **lengths, angles, and the shape itself are preserved**. The garment changes; what was real about it does not."
  },
  // 3: heading
  { id: uid(), type: 'heading', order: 3, level: 2, text: "Reflecting triangle ADM in the y-axis" },
  // 4: text
  {
    id: uid(), type: 'text', order: 4,
    markdown: "Recall the triangle from Page 9: $A(3, 4)$, $D(7, 1)$, $M(9, 6)$ — all three points in Quadrant I. Now imagine **folding the coordinate plane along the y-axis**. Each vertex lands at its mirror image on the *other* side of the y-axis. Specifically:\n\n- $A(3, 4) \\to A'(-3, 4)$\n- $D(7, 1) \\to D'(-7, 1)$\n- $M(9, 6) \\to M'(-9, 6)$\n\nNotice the pattern: **the y-coordinate stays the same; the x-coordinate switches its sign.** The image triangle $A'D'M'$ now lives in Quadrant II — a perfect mirror copy of the original.\n\nIt is natural to ask: are the three side lengths of the *image* triangle the same as the three side lengths of the *original*? Or has reflection somehow stretched, shrunk, or warped the triangle?"
  },
  // 5: image — Fig 1.9
  {
    id: uid(), type: 'image', order: 5,
    src: '', width: 'full',
    caption: "📸 Fig. 1.9 — Triangle ADM in Quadrant I, reflected across the y-axis to give triangle A'D'M' in Quadrant II.",
    alt: "Cartesian plane with two triangles. The right triangle in Quadrant I has vertices A(3,4), D(7,1), M(9,6). The left triangle in Quadrant II is the y-axis-reflection: A'(-3,4), D'(-7,1), M'(-9,6). Each pair of corresponding vertices sits at the same height, on opposite sides of the y-axis. Faint dashed horizontal lines connect each pair across the y-axis. Tick marks from -9 to +9 on the x-axis and 0 to +6 on the y-axis.",
    generation_prompt: "Cartesian plane diagram on green graph paper over a dark background. The y-axis is drawn slightly thicker (highlighted) to emphasise that it is the reflection axis. In Quadrant I, three points labelled A(3,4), D(7,1), M(9,6) form a triangle (light orange). In Quadrant II, three points labelled A'(-3,4), D'(-7,1), M'(-9,6) form the mirror triangle (light green). Faint dashed horizontal lines connect each pair of corresponding points across the y-axis to emphasise the reflection. Tick marks at every integer from −9 to +9 on the x-axis and from 0 to +6 on the y-axis. Style: clean educational mathematics illustration. Dark background, orange/green accent labels, clean technical illustration style."
  },
  // 6: simulation — reflection-explorer
  {
    id: uid(), type: 'simulation', order: 6,
    simulation_id: 'reflection-explorer',
    title: 'Try It: Reflect Any Triangle in Any Axis',
  },
  // 7: heading
  { id: uid(), type: 'heading', order: 7, level: 2, text: 'Lengths are preserved — three checks' },
  // 8: worked_example 1 — A'D'
  {
    id: uid(), type: 'worked_example', order: 8,
    label: 'Worked Example 1 — A′D′ vs AD',
    variant: 'solved_example',
    problem: "Compute $A'D'$ where $A'(-3, 4)$ and $D'(-7, 1)$, and compare it to the original $AD = 5$.",
    solution: "**Step 1 — Apply the distance formula.**\n\n$$A'D' = \\sqrt{(-7 - (-3))^2 + (1 - 4)^2} = \\sqrt{(-4)^2 + (-3)^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5$$\n\n**Step 2 — Compare.**\n\nOriginal $AD = 5$ (computed on Page 9).  Reflected $A'D' = 5$.  **Identical.**\n\n*Why?* The differences inside the formula are $(-7) - (-3) = -4$ and $1 - 4 = -3$. Compare with the original differences $7 - 3 = 4$ and $1 - 4 = -3$. The y-difference is unchanged (since y is preserved by a y-axis reflection); the x-difference flipped sign — but the formula squares it, so the sign is irrelevant. **Squaring kills the sign — that is why reflection preserves length.**\n\n**Answer:** $A'D' = 5$ — same as $AD$."
  },
  // 9: worked_example 2 — D'M'
  {
    id: uid(), type: 'worked_example', order: 9,
    label: "Worked Example 2 — D′M′ vs DM",
    variant: 'solved_example',
    problem: "Compute $D'M'$ where $D'(-7, 1)$ and $M'(-9, 6)$, and compare with the original $DM = \\sqrt{29}$.",
    solution: "**Step 1 — Apply the distance formula.**\n\n$$D'M' = \\sqrt{(-9 - (-7))^2 + (6 - 1)^2} = \\sqrt{(-2)^2 + 5^2} = \\sqrt{4 + 25} = \\sqrt{29}$$\n\n**Step 2 — Compare.**\n\n$DM = \\sqrt{29}$ on Page 9.  $D'M' = \\sqrt{29}$.  **Identical.**\n\n**Answer:** $D'M' = \\sqrt{29}$ — same as $DM$."
  },
  // 10: worked_example 3 — M'A'
  {
    id: uid(), type: 'worked_example', order: 10,
    label: "Worked Example 3 — M′A′ vs MA",
    variant: 'solved_example',
    problem: "Compute $M'A'$ where $M'(-9, 6)$ and $A'(-3, 4)$, and compare with the original $MA = \\sqrt{40}$.",
    solution: "**Step 1 — Apply the distance formula.**\n\n$$M'A' = \\sqrt{(-3 - (-9))^2 + (4 - 6)^2} = \\sqrt{6^2 + (-2)^2} = \\sqrt{36 + 4} = \\sqrt{40}$$\n\n**Step 2 — Compare.**\n\n$MA = \\sqrt{40}$ on Page 9.  $M'A' = \\sqrt{40}$.  **Identical.**\n\n**The reflected triangle has exactly the same three side-lengths as the original.**\n\n**Answer:** $M'A' = \\sqrt{40}$ — same as $MA$. Reflection across the y-axis preserves every side length."
  },
  // 11: heading
  { id: uid(), type: 'heading', order: 11, level: 2, text: 'The three rules — coordinate-by-coordinate' },
  // 12: text — generalise
  {
    id: uid(), type: 'text', order: 12,
    markdown: "What we showed for the triangle works for **any** point in the plane. Let me state the three rules cleanly.\n\nFor a point $P(x, y)$:\n\n- **Reflection in the y-axis** (the line $x = 0$): $P' = (-x, y)$. *The x-coordinate flips; y stays.*\n- **Reflection in the x-axis** (the line $y = 0$): $P' = (x, -y)$. *The y-coordinate flips; x stays.*\n- **Reflection through the origin** (point reflection): $P' = (-x, -y)$. *Both coordinates flip.*\n\n**What is preserved?** Every distance between every pair of points. Every angle. Every area. Every shape. (Mathematicians call any transformation with this property an **isometry** — *iso* = same, *metry* = measure.)\n\n**What is reversed?** **Orientation.** A clockwise-labelled triangle becomes anti-clockwise-labelled after a single reflection — just like raising your right hand turns into your reflection raising its left.\n\n*Special case:* if you reflect twice (e.g., once in the y-axis, then once in the x-axis), the orientation reverses twice — and you end up with the **origin reflection**, which preserves orientation. Two reflections compose into a rotation."
  },
  // 13: reasoning_prompt
  {
    id: uid(), type: 'reasoning_prompt', order: 13,
    reasoning_type: 'spatial',
    prompt: "Consider triangle $ADM$ from Page 9 reflected through the **origin** instead of the y-axis. The new vertices are $A''(-3, -4)$, $D''(-7, -1)$, $M''(-9, -6)$.\n\nWill the side lengths of triangle $A''D''M''$ be the same as the side lengths of the original triangle $ADM$?",
    options: [
      "No — origin reflection flips both coordinates, so the lengths must double",
      "Yes — every coordinate difference $(x_2 - x_1)$ becomes $-(x_2 - x_1)$ when both x's flip, but the formula squares the difference; the same is true for y. **Squaring kills the sign**, so each side length is unchanged. Origin reflection is an isometry — like axis-reflection, it preserves all distances",
      "Only the side parallel to an axis is preserved; the others may change",
      "Cannot be decided without computing each side"
    ],
    reveal: "Reflection through the origin sends $(x_1, y_1) \\to (-x_1, -y_1)$ and $(x_2, y_2) \\to (-x_2, -y_2)$. The differences become $(-x_2) - (-x_1) = -(x_2 - x_1)$ and similarly $-(y_2 - y_1)$. The distance formula squares these — $(-d)^2 = d^2$ — so the sum inside the square root is exactly the same as for the original. **Every side length is preserved.** The same logic applies to **any** axis-reflection or origin-reflection: as long as the transformation flips signs but does not change *which* coordinate-difference appears in the formula, distances are preserved. This is why all three reflections (in x-axis, in y-axis, through origin) are isometries.",
    difficulty_level: 4
  },
  // 14: callout — practice list (also includes the NCERT Think and Reflect questions from p.11)
  {
    id: uid(), type: 'callout', variant: 'remember', order: 14,
    title: 'Practice Yourself — Reflections',
    markdown: "**A. Quick reflections.** For each point, write its image under the three reflections (in y-axis, in x-axis, through origin):\n\n1. $(2, 5)$ → ?, ?, ?\n2. $(-3, 4)$ → ?, ?, ?\n3. $(0, 7)$ → ?, ?, ?\n4. $(-6, -2)$ → ?, ?, ?\n5. $(5, 0)$ → ?, ?, ?\n\n**B. Triangle work.** Triangle $PQR$ has vertices $P(2, 3)$, $Q(5, 1)$, $R(4, 6)$. \n\n6. Find the coordinates of the y-axis reflection $P'Q'R'$.\n7. Find the side lengths $PQ$, $QR$, $RP$.\n8. Find the side lengths $P'Q'$, $Q'R'$, $R'P'$. Confirm they match.\n\n**C. NCERT Think and Reflect (p. 11).** \n\n9. *What has remained the same and what has changed under reflection?* Lengths, angles, areas — all unchanged. Orientation (clockwise vs anti-clockwise labelling) is **reversed**. Coordinates of every point are different.\n10. *Would the same observations be true if triangle $ADM$ is reflected in the **x-axis** instead of the y-axis?* Yes — every reflection (in any axis or through any point) is an isometry; lengths and angles are always preserved.\n\n---\n\n**Answers (A):**  1. $(-2, 5), (2, -5), (-2, -5)$  · 2. $(3, 4), (-3, -4), (3, -4)$  · 3. $(0, 7), (0, -7), (0, -7)$  · 4. $(6, -2), (-6, 2), (6, 2)$  · 5. $(-5, 0), (5, 0), (-5, 0)$.   **(B)** 6. $P'(-2, 3), Q'(-5, 1), R'(-4, 6)$. 7. $PQ = \\sqrt{13}$, $QR = \\sqrt{26}$, $RP = \\sqrt{13}$. 8. Identical to (7) — reflection preserves all three."
  },
  // 15: ready_to_go_beyond
  {
    id: uid(), type: 'callout', variant: 'ready_to_go_beyond', order: 15,
    title: 'Ready to Go Beyond',
    markdown: "Reflections are part of a much larger family of **plane transformations** you'll meet in higher mathematics:\n\n- **Translations** — slide every point by the same $(a, b)$ ⇒ $(x + a, y + b)$. (Class 10.)\n- **Rotations** — rotate every point by an angle $\\theta$ around a centre. Two reflections compose to give a rotation. (Class 11.)\n- **Scaling / homothety** — multiply every coordinate by a factor $k$. *Not* an isometry — distances change.\n\nIn computer graphics, *every* manipulation of a 2-D image (translate, scale, rotate, mirror) is built from these primitives. The same is true in 3-D for game engines, animation, and CAD."
  },
  // 16: inline_quiz
  {
    id: uid(), type: 'inline_quiz', order: 16,
    pass_threshold: 0.6,
    questions: [
      {
        id: uid(),
        question: "What is the image of $(7, -2)$ under reflection in the **x-axis**?",
        options: ["$(-7, -2)$", "$(7, 2)$", "$(-7, 2)$", "$(7, -2)$ — unchanged"],
        correct_index: 1,
        explanation: "Reflection in the x-axis flips the y-coordinate's sign and leaves x unchanged. So $(7, -2) \\to (7, +2)$.",
        reasoning_level: 1
      },
      {
        id: uid(),
        question: "A point lies on the **y-axis**. What happens to it under a reflection in the y-axis?",
        options: [
          "It moves to the x-axis",
          "It moves to its mirror image in the other half of the plane",
          "It stays exactly where it is — points on the axis of reflection are *fixed*",
          "It moves to the origin"
        ],
        correct_index: 2,
        explanation: "A point on the y-axis has $x = 0$. Reflecting in the y-axis takes $(0, y) \\to (-0, y) = (0, y)$. Every point on the axis of reflection is fixed by the reflection — it is its own image. (Geometrically: when you fold along the y-axis, points already on the fold don't move.)",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "A triangle has vertices $A(2, 3), B(5, 7), C(8, 4)$. After reflection in the **origin**, what is the coordinate of the image of $C$?",
        options: ["$(8, -4)$", "$(-8, 4)$", "$(-8, -4)$", "$(4, 8)$"],
        correct_index: 2,
        explanation: "Reflection through the origin flips **both** signs: $(x, y) \\to (-x, -y)$. So $C(8, 4) \\to C'(-8, -4)$.",
        reasoning_level: 2
      },
      {
        id: uid(),
        question: "If a shape is reflected first in the **x-axis** and then in the **y-axis**, what is the net effect?",
        options: [
          "It returns to its original position",
          "It is reflected in the y-axis only",
          "It is **rotated by 180° about the origin** — equivalently, reflected through the origin",
          "It is translated diagonally"
        ],
        correct_index: 2,
        explanation: "Reflection in the x-axis: $(x, y) \\to (x, -y)$. Then reflection in the y-axis: $(x, -y) \\to (-x, -y)$. The net effect $(x, y) \\to (-x, -y)$ is **reflection through the origin**, which is the same as a 180° rotation about the origin. (This is a beautiful result: two perpendicular axis-reflections compose into a half-turn rotation.)",
        reasoning_level: 4
      }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Reflections in the Axes',
  subtitle: 'Mirroring shapes across the x-axis, the y-axis, and the origin — and why every length is preserved',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['reflection', 'isometry', 'symmetry', 'distance-formula', 'practice'],
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
