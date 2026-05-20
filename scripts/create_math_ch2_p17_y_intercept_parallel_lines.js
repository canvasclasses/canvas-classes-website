'use strict';
// Class 9 Math — Ch 2 — Page 17: "y-Intercept and Parallel Lines"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'y-intercept-and-parallel-lines';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 17;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of three perfectly parallel railway tracks stretching into a starry horizon. Each track tilts at the same angle but starts from a different height — clearly evoking three lines with the same slope but different y-intercepts.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Three perfectly parallel railway tracks stretch from the lower-left toward the upper-right of the frame, vanishing into the deep navy starry horizon. The three tracks are at clearly different heights — bottom, middle, top — each tilting at exactly the same angle. Faint glowing labels appear next to each track: 'b = -1', 'b = 1', 'b = 5'. The tracks are bathed in warm golden-hour sunset light, and the foreground has a misty earthy texture. The image conveys: three lines that share the same slope but start from different heights remain forever parallel. Painterly cinematic illustration. Dark background. The only text labels are the three b-values."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Now we know the slope $a$ tells us how *tilted* a line is. **What does the second number, $b$, do *geometrically*?** When you draw $y = 2x - 1$, $y = 2x + 1$, and $y = 2x + 5$ on the same grid — same slope, three different values of $b$ — what shape do you expect?",
    hint: "All three lines have the same slope $a = 2$, so they tilt at exactly the same angle. Try plotting just one point of each (say at $x = 0$) and imagine continuing the lines.",
    reveal: "All three lines tilt at the same angle, so they march upward together — but each one *starts at a different height* on the $y$-axis. The result is **three parallel lines, each one shifted vertically from the others**. Specifically, $y = 2x - 1$ crosses the $y$-axis at $(0, -1)$; $y = 2x + 1$ crosses at $(0, 1)$; $y = 2x + 5$ crosses at $(0, 5)$. **The number $b$ controls *where* the line crosses the $y$-axis — and that point has a special name: the *y-intercept*.**"
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'सिद्धान्तशिरोमणि — भास्कराचार्य (११५० CE)',
    markdown: "_From Bhāskarāchārya's Siddhānta-Śiromaṇi — On Parallel Paths_\n\n### समान-नतयः मार्गाः परस्परम् असम्मिलिताः\n### तेषाम् मध्यम् सदा एव अन्तरम् नियतम् भवेत्॥\n\n*(samāna-natayaḥ mārgāḥ parasparam asammilitāḥ / teṣām madhyam sadā eva antaram niyataṃ bhavet)*\n\n---\n\n*'समान झुकाव वाले रास्ते कभी आपस में नहीं मिलते। उनके बीच की दूरी हमेशा एक जैसी रहती है।'*\n\n*'Paths with the same tilt never meet each other. The distance between them always stays exactly the same.'*\n\nBhāskarāchārya named exactly the property we are about to draw on this page. **Two paths (lines) with the same tilt (slope) are *parallel* — they never meet, and the gap between them stays constant forever.** It is a fact known to ancient Indian astronomers and surveyors long before modern algebra named the slope. Today the same fact lives in railway tracks, ruled notebook pages, and every linear pair where only the value of $b$ changes."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'A new word — *y-intercept*' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Take any line $y = ax + b$ and ask: *where does it cross the $y$-axis?* The $y$-axis is the vertical line where every point has $x = 0$. Substituting $x = 0$ into the rule:\n\n$$y = a(0) + b = b$$\n\nSo the crossing point on the $y$-axis is exactly $(0, b)$.\n\nThis crossing point — and the value $b$ that locates it — has a special name. **The number $b$ in $y = ax + b$ is called the *y-intercept* of the line.** \"Intercept\" is just an English word meaning *the place where the line is caught or cut off* — and it is *caught* by the $y$-axis at the point $(0, b)$.\n\n- The $y$-intercept of $y = 2x + 5$ is $5$. The line crosses the $y$-axis at $(0, 5)$.\n- The $y$-intercept of $y = 3x - 2$ is $-2$. The line crosses the $y$-axis at $(0, -2)$, which is $2$ units *below* the origin.\n- The $y$-intercept of $y = -7x$ is $0$. The line crosses the $y$-axis at the origin itself.\n\n**A quick way to spot the $y$-intercept of any equation in standard form:** it is the lone number, the one with no $x$ attached. (We have already used this fact many times in this chapter — but now it has a formal name.)"
  },
  { id: uid(), type: 'heading', order: 5, level: 2, text: 'Same slope, different y-intercept — parallel lines' },
  { id: uid(), type: 'text', order: 6,
    markdown: "Now for the geometric payoff. Draw the lines $y = 2x - 1$, $y = 2x + 1$, and $y = 2x + 5$ on a single set of axes.\n\nAll three have the same slope, $a = 2$. So they all tilt at exactly the same angle — every one of them rises by $2$ units for every $1$ unit you move to the right. The only difference among them is the value of $b$:\n\n- $y = 2x - 1$ has $b = -1$ → cuts $y$-axis at $(0, -1)$.\n- $y = 2x + 1$ has $b = 1$ → cuts $y$-axis at $(0, 1)$.\n- $y = 2x + 5$ has $b = 5$ → cuts $y$-axis at $(0, 5)$.\n\nWhen you plot all three, the lines turn out to be *exactly* parallel — they tilt at the same angle but never meet. They are spaced apart vertically: imagine taking $y = 2x + 1$ and sliding it $2$ units down to get $y = 2x - 1$, or $4$ units up to get $y = 2x + 5$. **The lines are the same shape, just slid up or down on the page.**\n\n**The big rule:** *two lines with the same slope but different y-intercepts are parallel.* They march in the same direction, at the same steepness, forever — never meeting, never diverging."
  },
  { id: uid(), type: 'simulation', order: 7, simulation_id: 'cartesian-plotter',
    title: 'Try It: Lock the Slope, Slide the Line — Watch the Parallels Form'
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: 'NCERT Example 16 — Three lines with the same slope', variant: 'ncert_intext',
    problem: "Draw the graphs of $y = 2x - 1$, $y = 2x + 1$, and $y = 2x + 5$, first individually and then on the same axes. What do you observe?",
    solution: "All three lines have slope $a = 2$. To plot each, find two satisfying points.\n\n**Line 1: $y = 2x - 1$.**\n- $x = 0$: $y = -1$. Point: $(0, -1)$.\n- $x = 2$: $y = 3$. Point: $(2, 3)$.\n- Draw the line through $(0, -1)$ and $(2, 3)$. It crosses the $y$-axis at $-1$.\n\n**Line 2: $y = 2x + 1$.**\n- $x = 0$: $y = 1$. Point: $(0, 1)$.\n- $x = 2$: $y = 5$. Point: $(2, 5)$.\n- Draw the line through $(0, 1)$ and $(2, 5)$. It crosses the $y$-axis at $1$.\n\n**Line 3: $y = 2x + 5$.**\n- $x = 0$: $y = 5$. Point: $(0, 5)$.\n- $x = -2$: $y = 1$. Point: $(-2, 1)$.\n- Draw the line through $(-2, 1)$ and $(0, 5)$. It crosses the $y$-axis at $5$.\n\n**On a single grid, what you observe:** All three lines tilt at the same $2$-up-for-every-$1$-right angle. They never cross each other. They are spaced apart vertically — exactly $2$ units between Line 1 and Line 2, and $4$ units between Line 2 and Line 3. **Three perfectly parallel lines, simply slid up or down by changing $b$.**\n\n*The lesson.* Once you fix the slope, the value of $b$ controls only the *vertical position* of the line — it slides the line up if $b$ is increased, down if $b$ is decreased. The line's tilt does not change."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example — Reading y-intercepts off three lines', variant: 'solved_example',
    problem: "Three lines are drawn on the same grid: $y = x + 3$, $y = 2x + 5$, and $y = 3x - 2$. **Find the point where each line cuts the $y$-axis. Are any of these lines parallel to each other?**",
    solution: "**Step 1 — Identify each $y$-intercept by reading off $b$.**\n\n- $y = x + 3$: $b = 3$, so the line cuts the $y$-axis at $(0, 3)$.\n- $y = 2x + 5$: $b = 5$, so the line cuts the $y$-axis at $(0, 5)$.\n- $y = 3x - 2$: $b = -2$, so the line cuts the $y$-axis at $(0, -2)$.\n\n**Step 2 — Compare slopes.** The slopes are $1, 2, 3$ — *all different*. \n\n**Step 3 — Are any parallel?** Two lines are parallel only when their slopes are equal. Since no two of the slopes $1, 2, 3$ are equal, **no two of these three lines are parallel.** Each tilts at a different angle.\n\n**Plain meaning.** All three lines pass through different points on the $y$-axis (heights $3$, $5$, $-2$) *and* tilt at different angles, so each one crosses the others somewhere on the grid — none of them run side-by-side."
  },
  { id: uid(), type: 'image', order: 10, src: '', width: 'full',
    caption: '📸 Fig. 2.17 — Three lines with the same slope $a = 2$ but different $y$-intercepts. They are perfectly parallel.',
    alt: "A diagram of a coordinate plane showing three straight lines, all tilting at the same upward angle (slope 2), but starting from three different points on the y-axis: -1, 1, and 5. The three lines never cross each other — they are clearly parallel.",
    generation_prompt: "A clean illustrative diagram for a Class 9 mathematics textbook. A green-tinted graph-paper grid fills the frame with x-axis labelled from -3 to 4 and y-axis from -3 to 7. Three perfectly parallel straight lines run diagonally upward to the right, each tilting at the same angle. The lowest line is labelled 'y = 2x - 1' and crosses the y-axis at -1. The middle line is labelled 'y = 2x + 1' and crosses the y-axis at 1. The top line is labelled 'y = 2x + 5' and crosses the y-axis at 5. Soft amber grid lines, dark indigo background. Style: warm illustrative children's textbook art."
  },
  { id: uid(), type: 'heading', order: 11, level: 2, text: 'The three observations — wrapping up everything about $a$ and $b$' },
  { id: uid(), type: 'text', order: 12,
    markdown: "After comparing all the lines we have drawn so far — varying $a$, varying $b$, and varying both — we can now state three rules that summarise *the entire role of the two constants in $y = ax + b$*:\n\n**Observation 1 — In the equation $y = ax + b$:**\n- the number $a$ is the **slope** of the line (controls the tilt),\n- the number $b$ is the **y-intercept** of the line (controls where it cuts the $y$-axis).\n\n**Observation 2 — Change $a$, keep $b$ fixed.** The slope changes (the line tilts differently) but the $y$-intercept stays the same. All such lines pass through the same point $(0, b)$ but fan out at different angles, like the spokes of a wheel rooted at $(0, b)$.\n\n**Observation 3 — Change $b$, keep $a$ fixed.** The slope stays the same (the line keeps the same tilt) but the line slides up or down. All such lines are *parallel* — same direction, same steepness, just different vertical positions.\n\n**Putting it in one sentence:** *the slope decides how the line tilts; the y-intercept decides how high or low it is.* Together, these two numbers determine the line completely — and any two pieces of information about the line let you recover them, exactly as we did on pages 13 and 14."
  },
  { id: uid(), type: 'reasoning_prompt', order: 13,
    reasoning_type: 'logical',
    prompt: "If you were told that two lines are *not* parallel, what is the *one* thing you can be absolutely certain about?",
    options: [
      "They have different y-intercepts",
      "**They have different slopes — because parallel-ness is decided entirely by the slope. Two non-parallel lines must therefore have unequal slopes, and as a consequence they will meet at exactly one point somewhere on the plane.**",
      "They both pass through the origin",
      "They both rise as you move right"
    ],
    reveal: "Parallelism is *defined* by equal slopes. So if two lines are *not* parallel, their slopes must be *unequal*. The y-intercepts could be the same or different — that is irrelevant to parallelism. **And here is a beautiful consequence:** any two non-parallel straight lines on the plane *must* meet at exactly one point. (They can never meet at zero points — that would make them parallel; and they can never meet at two or more points — two distinct points would force them to be the same line.) This is one of the deepest geometric facts in the whole chapter.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 14,
    title: 'Practice Yourself — y-Intercepts and Parallels',
    markdown: "**A. Read the $y$-intercept and the slope of each line, then say where the line cuts the $y$-axis.**\n\n1. $y = 4x + 7$\n2. $y = -3x - 5$\n3. $y = \\tfrac{1}{2}x$\n4. $y = -x + 9$\n5. $y = 6$ &nbsp; (slope $= 0$ — a horizontal line)\n\n**B. From each list of three lines, identify the parallel pairs (if any).**\n\n6. $y = 5x + 1$, &nbsp; $y = 5x - 4$, &nbsp; $y = 2x + 1$\n7. $y = -2x + 3$, &nbsp; $y = 2x + 3$, &nbsp; $y = -2x - 7$\n8. $y = 7x + 2$, &nbsp; $y = 8x + 2$, &nbsp; $y = 9x + 2$\n9. $y = -\\tfrac{1}{3}x + 4$, &nbsp; $y = -\\tfrac{1}{3}x - 1$, &nbsp; $y = \\tfrac{1}{3}x + 4$\n\n---\n\n**Answers:**  1. Slope $4$, $y$-intercept $7$, cuts at $(0, 7)$.  2. Slope $-3$, $y$-intercept $-5$, cuts at $(0, -5)$.  3. Slope $\\tfrac{1}{2}$, $y$-intercept $0$, cuts at the origin $(0, 0)$.  4. Slope $-1$, $y$-intercept $9$, cuts at $(0, 9)$.  5. Slope $0$, $y$-intercept $6$, cuts at $(0, 6)$ — horizontal line at height $6$.  6. *First two are parallel* (both slope $5$); the third is not.  7. *First and third are parallel* (both slope $-2$); the middle one is not.  8. *No parallels* — all three slopes ($7, 8, 9$) are different.  9. *First and second are parallel* (both slope $-\\tfrac{1}{3}$); the third is not."
  },
  { id: uid(), type: 'inline_quiz', order: 15, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "What is the $y$-intercept of the line $y = 4x - 9$?",
        options: ["$4$", "$-4$", "$9$", "$-9$"], correct_index: 3,
        explanation: "The $y$-intercept is the lone number $b$ in $y = ax + b$. Here $b = -9$, so the line cuts the $y$-axis at $(0, -9)$.",
        reasoning_level: 1 },
      { id: uid(), question: "Which of the following lines is **parallel** to $y = 3x + 5$?",
        options: ["$y = 5x + 3$", "$y = 3x - 7$", "$y = -3x + 5$", "$y = 2x + 5$"], correct_index: 1,
        explanation: "Two lines are parallel when their slopes are *equal*. The slope of $y = 3x + 5$ is $3$. Among the options, only $y = 3x - 7$ has slope $3$. (It has a different $y$-intercept, $-7$, but that is required for parallels — same slope, different $y$-intercept.)",
        reasoning_level: 2 },
      { id: uid(), question: "A line has $y$-intercept $4$ and slope $-2$. **What is its equation?**",
        options: ["$y = 4x - 2$", "$y = -2x + 4$", "$y = 2x - 4$", "$y = -4x + 2$"], correct_index: 1,
        explanation: "The standard form is $y = ax + b$, where $a$ is the slope and $b$ is the $y$-intercept. Plugging in $a = -2$ and $b = 4$ gives $y = -2x + 4$.",
        reasoning_level: 2 },
      { id: uid(), question: "Two lines with equation $y = ax + b$ and $y = ax + c$ have the *same* $a$ but $b \\ne c$. **Where, if anywhere, do they meet?**",
        options: [
          "They meet at the origin",
          "They meet on the $y$-axis at $(0, b)$",
          "**They never meet — same slope means they are parallel, and parallel lines never cross each other.**",
          "They meet at exactly one point but its location depends on $a$"
        ],
        correct_index: 2,
        explanation: "Equal slopes means the two lines tilt at exactly the same angle, so they are *parallel*. Parallel lines never meet. Algebraically, setting the two rules equal gives $ax + b = ax + c \\Rightarrow b = c$, but we said $b \\ne c$, so there is *no* value of $x$ that makes both rules give the same $y$. **No meeting point exists.** This is the formal statement of the parallel-lines rule.",
        reasoning_level: 4 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'y-Intercept and Parallel Lines',
  subtitle: "The number $b$ tells the line where to cross the $y$-axis — and lines that share a slope but not a $y$-intercept run parallel forever",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['y-intercept', 'parallel-lines', 'slope-intercept-form', 'NCERT-Example-16', 'practice'],
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
