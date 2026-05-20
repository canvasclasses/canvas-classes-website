'use strict';
// Class 9 Math — Ch 2 — Page 16: "Slope: The Geometric Meaning of a"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'slope-the-geometric-meaning-of-a';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 16;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of two glowing slopes carved into a starry hillside — one rising to the right (a smiling boy walking up), the other falling to the right (a girl gently sliding down) — both meeting at the centre of the frame on a glowing coordinate axis.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vast hillside set against a deep navy starry sky. Two softly glowing diagonal slopes rise out of a misty valley: on the left half, an upward slope rising gently to the right with a young Indian boy in school uniform walking up its surface; on the right half, a downward slope falling to the right with a young Indian girl in school uniform sliding down its surface. Both slopes converge at the centre of the frame, where a glowing coordinate axis (x and y arrows) marks the origin. The whole scene is bathed in warm golden-hour sunset light. The image conveys: the slope of a line — positive lifts you up, negative carries you down. Painterly cinematic illustration. Dark background. No text labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "On the previous page we learnt that the number $a$ in $y = ax + b$ is called the *slope* of the line. So far we have only drawn lines where $a$ is positive — lines that rise as we move to the right. **What does a line look like when $a$ is negative? And how does its steepness change as we make $a$ more or less negative?**",
    hint: "Try a small experiment in your head. Plot $y = -x$. At $x = 1$, $y = -1$. At $x = 2$, $y = -2$. As $x$ goes up, $y$ goes *down*. Now compare with $y = -3x$ — same idea, but does it fall faster or slower?",
    reveal: "A line with negative slope **falls** as we move to the right. The bigger the *size* of the negative number, the *faster* the fall — so $y = -3x$ drops three times as steeply as $y = -x$. On this page, we draw three negative-slope lines side by side, see how they tilt downward, and lock in one of the most important rules in the whole chapter: **positive slope $\\Rightarrow$ growth (line rises); negative slope $\\Rightarrow$ decay (line falls).**"
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'A Subhāṣita on Two Directions',
    markdown: "_From the Subhāṣita-Ratna-Bhāṇḍāgāra — On Rising and Falling_\n\n### उन्नतिश्च अवनतिश्च गतीनां द्विविधा सदा\n### एका मार्गात् ऊर्ध्वगा अन्या तस्मात् अधोगता॥\n\n*(unnatiś ca avanatiś ca gatīnāṃ dvividhā sadā / ekā mārgāt ūrdhva-gā anyā tasmāt adho-gatā)*\n\n---\n\n*'गतियाँ सदा दो प्रकार की होती हैं — एक उन्नति (ऊपर की ओर) और दूसरी अवनति (नीचे की ओर)। एक ही रास्ते पर एक ऊपर जाती है, और दूसरी उसी से नीचे।'*\n\n*'Movements are always of two kinds — rising and falling. On the same path, one goes upward, and the other downward.'*\n\nThis old Sanskrit verse names exactly the duality this page is about. Sanskrit has separate words for upward motion (*unnati*) and downward motion (*avanati*), just as we now have *positive slope* and *negative slope* — same path (a straight line), opposite directions of travel. **The line itself does not change shape; only the sign of the slope changes its tilt.**"
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'A quick recap of what slope means' },
  { id: uid(), type: 'text', order: 4,
    markdown: "From the previous page, we know that the number $a$ in $y = ax + b$ has a special name — the **slope** — and a clear meaning: it is *the amount by which $y$ changes when $x$ increases by $1$*.\n\n- If $a = 2$, then a one-step move to the right makes $y$ go up by $2$. The line *rises* and we call this **positive slope**.\n- If $a = \\tfrac{1}{2}$, then a one-step move to the right makes $y$ go up by only $\\tfrac{1}{2}$. The line still rises but more gently.\n- If $a = -2$, then a one-step move to the right makes $y$ go *down* by $2$. The line *falls*. This is **negative slope**.\n\n**Two simple rules to remember:**\n\n1. **Sign of $a$ tells you the direction.** Positive $a$ → line tilts upward as you move right (linear growth). Negative $a$ → line tilts downward as you move right (linear decay). Zero $a$ would give a perfectly flat horizontal line.\n2. **Size of $a$ tells you the steepness.** A line with slope $5$ is steeper than a line with slope $2$. A line with slope $-5$ is also steeper than a line with slope $-2$ — only this time the steepness is downward. **It is the *size* of $a$ (ignoring the sign) that decides how steep, while the *sign* decides up or down.**\n\nWe drew three positive-slope lines on the previous page ($y = \\tfrac{1}{2}x$, $y = x$, $y = 2x$). On this page, we draw three *negative-slope* lines and watch the same pattern play out — only mirrored downward."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'cartesian-plotter',
    title: 'Try It: Flip the Sign of the Slope and Watch the Line Tilt'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'NCERT Example 15 — Three negative-slope lines', variant: 'ncert_intext',
    problem: "Draw the lines $y = -\\tfrac{1}{3}x$, $\\,y = -x$, and $y = -3x$ on the same coordinate plane by selecting suitable points. Compare their tilts.",
    solution: "Each of these has $b = 0$, so each line passes through the origin $(0, 0)$. We just need *one more* point per line.\n\n**Line 1: $y = -\\tfrac{1}{3}x$.** Pick $x = 3$. Then $y = -\\tfrac{1}{3}(3) = -1$. Second point: $(3, -1)$. Draw a gently-falling line from $(0, 0)$ through $(3, -1)$.\n\n**Line 2: $y = -x$.** Pick $x = 3$. Then $y = -3$. Second point: $(3, -3)$. Draw a $45\\degree$-falling line from $(0, 0)$ through $(3, -3)$.\n\n**Line 3: $y = -3x$.** Pick $x = 1$. Then $y = -3$. Second point: $(1, -3)$. Draw a steeply-falling line from $(0, 0)$ through $(1, -3)$.\n\n**Comparing all three on one grid.**\n\n- The slope $-\\tfrac{1}{3}$ has the smallest *size*, so $y = -\\tfrac{1}{3}x$ is the *gentlest* — it drops slowly as $x$ moves right.\n- The slope $-1$ falls at exactly $45\\degree$ — every step right means one step down.\n- The slope $-3$ has the *largest* size, so $y = -3x$ is the *steepest* — it plunges down quickly.\n\n**The lesson.** Just like the positive-slope lines on the previous page formed a fan opening upward to the right, these three lines form a fan opening downward to the right. **Same fan, mirror-flipped.**"
  },
  { id: uid(), type: 'image', order: 7, src: '', width: 'full',
    caption: '📸 Fig. 2.16 — Three negative-slope lines through the origin: $y = -\\tfrac{1}{3}x$, $y = -x$, $y = -3x$. The bigger the size of the slope, the steeper the fall.',
    alt: "A diagram of a coordinate plane with three straight lines all starting from the origin and falling toward the lower right. The shallowest line (labelled y = -1/3 x) goes only slightly down. The middle line (y = -x) falls at 45 degrees. The steepest line (y = -3x) plunges sharply downward.",
    generation_prompt: "A clean illustrative diagram for a Class 9 mathematics textbook, drawn in the warm hand-painted style of a children's textbook. A green-tinted graph-paper grid fills the frame with x-axis labelled from -4 to 4 and y-axis labelled from -4 to 4. Three straight lines all originate from the origin (0,0) and fall toward the lower-right corner: a shallow blue line labelled 'y = -1/3 x' (gently sloping down), a red line at 45° labelled 'y = -x', and a steep amber line labelled 'y = -3x' (plunging downward sharply). Each label sits next to its line. Style: warm illustrative, dark indigo background outside the grid, soft amber grid lines. No extra elements."
  },
  { id: uid(), type: 'heading', order: 8, level: 2, text: 'Comparing a positive-slope line with its negative-slope twin' },
  { id: uid(), type: 'text', order: 9,
    markdown: "Pick any pair of lines that differ only by the sign of $a$ — for example $y = 3x + 1$ and $y = -3x + 1$. Both have the same $b = 1$, so both cross the $y$-axis at the same point $(0, 1)$. But the slopes are exactly opposite: $+3$ and $-3$.\n\n- $y = 3x + 1$ rises by $3$ for every step right. It tilts upward steeply.\n- $y = -3x + 1$ falls by $3$ for every step right. It tilts downward steeply — at the *same* steepness, just in the opposite direction.\n\nIf you draw both on the same grid, they form an X-shape that crosses at $(0, 1)$ — a perfect mirror image of each other across the horizontal direction. **Two lines with slopes equal in size but opposite in sign are reflections of each other through the horizontal.**\n\nThis is the *deepest visual meaning* of the sign of $a$: it decides which direction the line travels as you move right. Flip the sign, and the line flips upside-down (across its $y$-intercept)."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example — Same y-intercept, opposite slopes', variant: 'solved_example',
    problem: "Without plotting, predict the shape of the lines $y = 3x + 1$ and $y = -3x + 1$ on a single grid. At what point do they cross?",
    solution: "**Step 1 — Find the slopes and intercepts.** Both have $b = 1$, so both cross the $y$-axis at $(0, 1)$. Their slopes are $+3$ and $-3$.\n\n**Step 2 — Direction.** $y = 3x + 1$ rises (positive slope, growth). $y = -3x + 1$ falls (negative slope, decay).\n\n**Step 3 — Steepness.** Both have slope of size $3$, so they are *equally steep* — just tilted in opposite directions.\n\n**Step 4 — Crossing point.** Two lines with the same $b$ both pass through $(0, b)$. So they meet at $(0, 1)$, on the $y$-axis itself.\n\n**Step 5 — Confirm.** Set the two rules equal: $3x + 1 = -3x + 1 \\Rightarrow 6x = 0 \\Rightarrow x = 0$. At $x = 0$, both rules give $y = 1$. ✓\n\n**Conclusion.** The two lines form a perfect X centred at $(0, 1)$, opening symmetrically — one tilting up to the right, the other tilting down to the right, at the same steepness. **Same starting point, opposite slopes — that is the visual signature of a sign flip.**"
  },
  { id: uid(), type: 'reasoning_prompt', order: 11,
    reasoning_type: 'logical',
    prompt: "If two linear rules have the same value of $b$ but slopes of *opposite signs*, the lines cross on the $y$-axis. **What can you say about where two lines with the same slope but different values of $b$ will cross?**",
    options: [
      "They cross at the origin",
      "They cross on the $x$-axis",
      "**They never cross — because they have the same slope, they tilt at the same angle, so they run parallel forever and never meet.**",
      "They cross at the $y$-intercept"
    ],
    reveal: "Two lines tilt at the same angle exactly when their slopes are equal. Imagine two slanted rulers tilted at exactly $45\\degree$, but slid up or down on the page: they will never meet, no matter how far you extend them. Algebraically, if you tried to set $ax + b_1 = ax + b_2$ to find a crossing point, the $ax$ terms cancel and you get $b_1 = b_2$ — but we said they are *different*, so this is impossible. **Lines with the same slope but different y-intercepts are *parallel* — they never cross.** This will be the core idea of the next page.",
    difficulty_level: 3
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 12,
    title: 'Practice Yourself — Sign and Size of Slope',
    markdown: "For each of the following, say (a) the slope, (b) whether the line rises or falls as you move right, and (c) which of each pair is steeper.\n\n1. $y = 4x$\n2. $y = -4x$\n3. $y = \\tfrac{1}{5}x$\n4. $y = -\\tfrac{1}{5}x$\n5. $y = 7x - 2$\n6. $y = -10x + 9$\n\n**Steepness comparisons** — without plotting, decide which of each pair is steeper:\n\n7. $y = 2x$ vs $y = 5x$\n8. $y = -3x$ vs $y = -8x$\n9. $y = 4x + 1$ vs $y = -6x + 1$\n10. $y = \\tfrac{1}{4}x$ vs $y = -\\tfrac{1}{4}x$\n\n---\n\n**Answers:**  1. Slope $4$; rises; rule of thumb — large.  2. Slope $-4$; falls; same size as #1, opposite direction.  3. Slope $\\tfrac{1}{5}$; rises gently.  4. Slope $-\\tfrac{1}{5}$; falls gently.  5. Slope $7$; rises; quite steep.  6. Slope $-10$; falls; very steep.  **7.** $y = 5x$ — bigger size of slope.  **8.** $y = -8x$ — bigger size ($|-8| = 8 > 3$).  **9.** $y = -6x + 1$ — bigger size ($6 > 4$).  **10.** *Equally steep* — both have slope size $\\tfrac{1}{4}$; only the direction differs."
  },
  { id: uid(), type: 'inline_quiz', order: 13, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "What is the slope of the line $y = -7x + 4$?",
        options: ["$7$", "$-7$", "$4$", "$-4$"], correct_index: 1,
        explanation: "The slope is the number multiplying $x$, including its sign. In $-7x + 4$, the number multiplying $x$ is $-7$. So the slope is $-7$.",
        reasoning_level: 1 },
      { id: uid(), question: "Which of these lines tilts *downward* as you move from left to right?",
        options: ["$y = 5x + 2$", "$y = \\tfrac{1}{2}x - 7$", "$y = -3x + 1$", "$y = x$"], correct_index: 2,
        explanation: "A line tilts downward when its slope is negative. The slopes here are $5$, $\\tfrac{1}{2}$, $-3$, and $1$. Only $-3$ is negative, so $y = -3x + 1$ is the one that falls.",
        reasoning_level: 1 },
      { id: uid(), question: "Which line is the *steepest*?",
        options: ["$y = 3x$", "$y = -5x$", "$y = \\tfrac{1}{2}x$", "$y = -2x$"], correct_index: 1,
        explanation: "Steepness is decided by the *size* of the slope (ignore the sign). The slope sizes here are $3, 5, \\tfrac{1}{2}, 2$. The biggest is $5$, so $y = -5x$ is the steepest. (It tilts down, not up — but steepness is about *how much* the line tilts, not which way.)",
        reasoning_level: 2 },
      { id: uid(), question: "Two lines $y = 4x + 3$ and $y = -4x + 3$ are drawn on the same grid. **What can you say about them?**",
        options: [
          "They are parallel",
          "They both rise as you move right",
          "**They cross each other at the point $(0, 3)$, and they tilt at exactly the same steepness but in opposite directions — one rising, the other falling.**",
          "They are the same line"
        ],
        correct_index: 2,
        explanation: "Both lines have $b = 3$, so both cross the $y$-axis at $(0, 3)$. Their slopes are $+4$ and $-4$ — same size ($4$), opposite signs. So they tilt equally steeply but in opposite directions: one rises (the positive-slope one), the other falls (the negative-slope one). Together they form a perfect X centred on the $y$-axis at $(0, 3)$.",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Slope: The Geometric Meaning of $a$',
  subtitle: 'When the slope flips sign, the line flips direction — same steepness, opposite tilt',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['slope', 'negative-slope', 'positive-slope', 'NCERT-Example-15', 'practice'],
  published: false, created_at: new Date(), updated_at: new Date()
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    if (await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: SLUG })) {
      console.log(`⚠️  ${SLUG} exists`); return;
    }
    await db.collection('book_pages').insertOne(page);
    await db.collection('books').updateOne(
      { _id: BOOK_ID, 'chapters.number': CHAPTER_NUMBER },
      { $push: { 'chapters.$.page_ids': page._id } }
    );
    console.log(`✅ Math Ch${CHAPTER_NUMBER} P${PAGE_NUMBER}: ${page.title}  (${blocks.length} blocks)`);
  } finally { await client.close(); }
}
main().catch(e => { console.error('❌', e.message); process.exit(1); });
