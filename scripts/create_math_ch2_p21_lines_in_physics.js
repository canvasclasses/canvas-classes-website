'use strict';
// Class 9 Math — Ch 2 — Page 21: "Lines in Physics — Temperature and Work"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'lines-in-physics-temperature-and-work';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 21;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic split-scene illustration: on the left, a glowing laboratory thermometer marked with both Kelvin and Fahrenheit scales side by side; on the right, a young Indian student pushing a wooden box across a polished floor with a force arrow above and a measuring tape unrolling behind it. Both halves of the image lit by warm physics-lab amber light.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio), softly split into two halves by a thin vertical line of light. Left half: a tall scientific laboratory thermometer drawn in close-up, mercury rising up the bulb, marked with two parallel scales — Kelvin (273, 313, ...) on the left side of the tube and Fahrenheit (32, 104, ...) on the right side. Right half: a young Indian schoolboy pushing a sturdy wooden box across a polished tiled floor; a translucent green arrow above the box labelled 'F' indicates the constant force, and a measuring tape unrolls behind the box showing the distance travelled. Both halves are bathed in warm amber physics-lab light against a dark deep-navy background. The image conveys: linear equations live in physics — temperature scales convert linearly, and work is a linear function of distance at constant force. Painterly cinematic illustration. Dark background. The only text is the numbers on the thermometer."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Two completely different physics ideas — *converting between Kelvin and Fahrenheit temperature scales* and *calculating the work done by a constant force* — both turn out to be **linear equations**. **Why does the same algebraic shape ($y = ax + b$) keep appearing in physics?**",
    hint: "Think about what is staying constant in each scenario. In a temperature conversion, the rule between K and F is fixed by physics. In work, if the force does not change, then work depends only on distance — and at a constant rate.",
    reveal: "Linear equations appear *all over physics* whenever two quantities are connected by a *constant rate of change*. Temperature scales are linear because the size of one degree on one scale always equals the same fixed size on the other. Work-at-constant-force is linear because the work done is proportional to the distance travelled, with the force as the constant rate. **On this page we use the same linear-equation tools we already know to solve two real physics problems** — without learning any new physics."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'आर्यभटीय — आर्यभट (४९९ CE)',
    markdown: "_From Āryabhaṭa's Āryabhaṭīya — On Universal Relationships_\n\n### प्रकृतेः नियमाः सर्वे संख्यया एव गण्यन्ते\n### गणितं विज्ञानयोः मूलं भौतिकयोः च तत्त्वतः॥\n\n*(prakṛteḥ niyamāḥ sarve saṃkhyayā eva gaṇyante / gaṇitaṃ vijñānayoḥ mūlaṃ bhautikayoś ca tattvataḥ)*\n\n---\n\n*'प्रकृति के सब नियम संख्या से ही गिने जाते हैं। गणित विज्ञान का मूल है — और भौतिकी का भी।'*\n\n*'All the laws of nature are counted by numbers alone. Mathematics is the root of science — and of physics in particular.'*\n\nĀryabhaṭa knew that the language of physical nature is mathematics. **Linear equations are the simplest of those languages** — they describe constant-rate relationships between two quantities, and constant-rate relationships are everywhere in nature once you know to look. The two problems on this page are nothing more than physics ideas wearing the algebra of $y = ax + b$ that we have practised all chapter."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'Part 1 — Kelvin and Fahrenheit, two scales for the same temperature' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Temperature can be measured on different scales. Three of the most common are:\n\n- **Celsius (°C)** — the everyday Indian scale; ice melts at $0\\degree$C, water boils at $100\\degree$C.\n- **Fahrenheit (°F)** — used in some countries (notably the US); ice melts at $32\\degree$F, water boils at $212\\degree$F.\n- **Kelvin (K)** — the scientific scale; absolute zero is $0$ K, and water freezes at $273$ K, boils at $373$ K.\n\nBecause every degree on one scale corresponds to a fixed-size step on every other scale, the conversion between any two scales is a **linear equation**. The relationship between Kelvin ($x$ K) and Fahrenheit ($y\\degree$F) is given by:\n\n$$y = \\tfrac{9}{5}(x - 273) + 32$$\n\nThis is in the form $y = ax + b$ once we expand: $y = \\tfrac{9}{5}x - \\tfrac{9}{5}(273) + 32 = \\tfrac{9}{5}x - 491.4 + 32 = \\tfrac{9}{5}x - 459.4$. Slope $\\tfrac{9}{5}$, $y$-intercept $-459.4$. **But for solving problems, the form given by NCERT is more convenient — let us use it as-is.**\n\nThe linear-equation routine for *substitute* and *solve* still applies:\n\n- **Forward direction:** given Kelvin, find Fahrenheit by substituting and simplifying.\n- **Reverse direction:** given Fahrenheit, find Kelvin by setting up the equation and solving."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'cartesian-plotter',
    title: 'Try It: Plot the Conversion Lines on a Coordinate Grid'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'End-of-Chapter Q8 (i) — From Kelvin to Fahrenheit', variant: 'ncert_intext',
    problem: "If the temperature of a liquid is **$313$ K**, find the temperature in **Fahrenheit**.",
    solution: "**Use the conversion rule:** $y = \\tfrac{9}{5}(x - 273) + 32$, with $x = 313$.\n\n**Step 1 — Compute $x - 273$:** $313 - 273 = 40$.\n\n**Step 2 — Multiply by $\\tfrac{9}{5}$:** $\\tfrac{9}{5} \\times 40 = \\tfrac{360}{5} = 72$.\n\n**Step 3 — Add $32$:** $72 + 32 = 104$.\n\n**Answer:** $313$ K $= 104\\degree$F.\n\n*A sense-check.* $313$ K is $40\\degree$C (subtract $273$). And from the previous chapter we know $40\\degree$C $\\approx 104\\degree$F. ✓ A warm afternoon temperature."
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'End-of-Chapter Q8 (ii) — From Fahrenheit to Kelvin', variant: 'ncert_intext',
    problem: "If the temperature is **$158\\degree$F**, find the temperature in **Kelvin**.",
    solution: "**Use the rule** $y = \\tfrac{9}{5}(x - 273) + 32$, but now we know $y = 158$ and need to find $x$.\n\n**Step 1 — Substitute the known value of $y$.**\n\n$$158 = \\tfrac{9}{5}(x - 273) + 32$$\n\n**Step 2 — Subtract $32$ from both sides:**\n\n$$126 = \\tfrac{9}{5}(x - 273)$$\n\n**Step 3 — Multiply both sides by $\\tfrac{5}{9}$ to undo the $\\tfrac{9}{5}$:**\n\n$$x - 273 = 126 \\times \\tfrac{5}{9} = \\tfrac{630}{9} = 70$$\n\n**Step 4 — Add $273$ to both sides:**\n\n$$x = 70 + 273 = 343$$\n\n**Answer:** $158\\degree$F $= 343$ K.\n\n*The pattern.* Forward direction is plain substitution. Reverse direction is solving a small linear equation — exactly the *substitute and solve* dance we have been doing since page 5 of this chapter."
  },
  { id: uid(), type: 'heading', order: 8, level: 2, text: 'Part 2 — Work, force, and distance' },
  { id: uid(), type: 'text', order: 9,
    markdown: "Now a different physics idea — but still a linear equation underneath.\n\n**Work-energy fact.** When a body is pushed by a *constant* force in the direction of its motion, the **work** done equals the *force* times the *distance* travelled:\n\n$$W = F \\times d$$\n\nThis is one of the most-used formulas in your physics chapter on energy. Now look at it through the lens of algebra.\n\n- $F$ (the force) is given as a *fixed constant* — say, $3$ units. (NCERT uses unitless numbers for simplicity here; in real life this would be $3$ newtons or so.)\n- $W$ depends on $d$ — and only $d$, since $F$ is fixed.\n\nSubstituting $F = 3$:\n\n$$W = 3d$$\n\nIf we let $d$ play the role of $x$ and $W$ the role of $y$, this is the linear equation:\n\n$$y = 3x \\quad\\text{(with $b = 0$)}$$\n\n**Recognise the shape?** It is $y = ax$ with slope $3$ and $y$-intercept $0$ — a line that passes through the origin and rises by $3$ units of work for every $1$ unit of distance. Plotting this on a coordinate grid (work on the vertical axis, distance on the horizontal) gives a straight line through the origin with slope $3$.\n\n*The physical meaning of slope here.* The slope $a = 3$ is exactly the constant force itself. **The slope of a work-distance line equals the magnitude of the constant force.** Different forces would give different slopes — twice the force, twice the steepness."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'End-of-Chapter Q9 — Work as a linear equation', variant: 'ncert_intext',
    problem: "The work done by a body on the application of a constant force is the product of the constant force and the distance travelled. Express this as a linear equation in two variables (work $W$ and distance $d$), and draw its graph by taking the constant force as $3$ units. **What is the work done when the distance travelled is $2$ units? Verify by reading off the graph.**",
    solution: "**Step 1 — Write the linear equation.** With $F = 3$:\n\n$$W = 3d$$\n\nThis is in the form $y = ax + b$ with $a = 3$ and $b = 0$.\n\n**Step 2 — Find two satisfying points to draw the line.**\n\n- $d = 0$: $W = 3 \\times 0 = 0$. Point: $(0, 0)$.\n- $d = 1$: $W = 3 \\times 1 = 3$. Point: $(1, 3)$.\n\nDraw a straight line through $(0, 0)$ and $(1, 3)$ on a grid with $d$ on the horizontal axis and $W$ on the vertical axis. The line passes through the origin and tilts upward steeply (slope $3$).\n\n**Step 3 — Read the work for $d = 2$.** Substitute into the equation:\n\n$$W = 3(2) = 6$$\n\n**Verify by graph.** Locate $d = 2$ on the horizontal axis, move straight up to the line, and read the vertical coordinate — it should be $6$. Confirmed. ✓\n\n**Answer:** With force $3$ units applied over a distance of $2$ units, the work done is **$6$ units**.\n\n*A wider lesson.* The same equation $W = 3d$ tells you the work for *any* distance you might choose. Plug in $d = 5$ to get $W = 15$. Plug in $d = 10$ to get $W = 30$. Each new distance gives a new work value with no more effort than a single multiplication. **Linear equations are powerful precisely because one rule covers infinitely many cases.**"
  },
  { id: uid(), type: 'reasoning_prompt', order: 11,
    reasoning_type: 'logical',
    prompt: "In the work problem above, we got $W = 3d$ — a line through the origin. **What would happen to the line if the constant force were doubled (force $= 6$ instead of $3$), and how would this change show up on the graph?**",
    options: [
      "The line would shift upward by $6$ units",
      "**The slope would double from $3$ to $6$, making the line *twice as steep*. The line would still pass through the origin (because $b$ is still zero), but for any given distance, the work done would be twice as large. Geometrically, doubling the force tilts the work-distance line further upward.**",
      "The line would shift sideways",
      "Nothing would change"
    ],
    reveal: "With $F = 6$, the new equation is $W = 6d$ — slope $6$, $y$-intercept $0$. **The slope (force) doubled, so the line tilts more steeply.** Both lines still pass through the origin (no work has been done before any distance is travelled), but for any positive distance, the new line gives twice as much work. **This is the physical meaning of slope showing up directly: in the work-distance line, the slope *is* the force.** Different physical setups produce different slopes; the algebra and the physics agree.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 12,
    title: 'Practice Yourself — Physics with Linear Equations',
    markdown: "**A. Temperature scales** — use the rule $y = \\tfrac{9}{5}(x - 273) + 32$, where $x$ is K and $y$ is °F.\n\n1. Convert $273$ K to °F. (This is the freezing point of water.)\n2. Convert $373$ K to °F. (Boiling point of water.)\n3. Convert $300$ K to °F. (A pleasantly warm room.)\n4. A pharmacist's fridge stores a vaccine at $-4\\degree$F. What is this in K? &nbsp;*(Set up the reverse equation.)*\n\n**B. Work-distance** — use $W = F \\cdot d$ for the given constant force.\n\n5. With force $5$ units, find the work done over distance $4$ units.\n6. With force $7$ units, what distance is needed to do $42$ units of work? *(reverse direction — solve for $d$.)*\n7. The work-distance line for a constant force is $W = 8d$. **What is the value of the force?**\n8. Two different forces produce work-distance lines $W = 3d$ and $W = 7d$. *Without plotting*, which line is steeper, and which force is bigger?\n\n---\n\n**Answers:**  1. $\\tfrac{9}{5}(0) + 32 = 32\\degree$F. ✓  2. $\\tfrac{9}{5}(100) + 32 = 180 + 32 = 212\\degree$F. ✓  3. $\\tfrac{9}{5}(27) + 32 = 48.6 + 32 = 80.6\\degree$F.  4. $-4 = \\tfrac{9}{5}(x-273) + 32 \\Rightarrow -36 = \\tfrac{9}{5}(x - 273) \\Rightarrow x - 273 = -20 \\Rightarrow x = 253$ K.  5. $W = 5 \\times 4 = 20$ units.  6. $7d = 42 \\Rightarrow d = 6$ units.  7. The slope of the work-distance line equals the force, so the force is $8$ units.  8. The line $W = 7d$ is steeper (slope $7$ > slope $3$); the larger force is $7$ units."
  },
  { id: uid(), type: 'inline_quiz', order: 13, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "Using the rule $y = \\tfrac{9}{5}(x - 273) + 32$, what is **$273$ K** in Fahrenheit?",
        options: ["$0\\degree$F", "$32\\degree$F", "$100\\degree$F", "$273\\degree$F"], correct_index: 1,
        explanation: "$y = \\tfrac{9}{5}(273 - 273) + 32 = \\tfrac{9}{5}(0) + 32 = 32\\degree$F. (And indeed, $273$ K is $0\\degree$C, the freezing point of water — and that is $32\\degree$F.)",
        reasoning_level: 1 },
      { id: uid(), question: "A constant force of $4$ units acts on a body. **How much work is done over a distance of $9$ units?**",
        options: ["$13$ units", "$5$ units", "$36$ units", "$\\tfrac{9}{4}$ units"], correct_index: 2,
        explanation: "$W = F \\times d = 4 \\times 9 = 36$ units of work.",
        reasoning_level: 1 },
      { id: uid(), question: "The work-distance line for a particular force is $W = 12d$. **The constant force is:**",
        options: ["$1$ unit", "$2$ units", "$6$ units", "$12$ units"], correct_index: 3,
        explanation: "In the work-distance equation $W = F d$, the slope equals the force itself. So if the slope is $12$, the force is $12$ units.",
        reasoning_level: 2 },
      { id: uid(), question: "If the temperature in Fahrenheit is $50\\degree$F, what is it in Kelvin? &nbsp;(Use $y = \\tfrac{9}{5}(x - 273) + 32$.)",
        options: [
          "$273$ K",
          "$283$ K",
          "$293$ K",
          "$303$ K"
        ],
        correct_index: 1,
        explanation: "$50 = \\tfrac{9}{5}(x - 273) + 32 \\Rightarrow 18 = \\tfrac{9}{5}(x - 273) \\Rightarrow x - 273 = 18 \\times \\tfrac{5}{9} = 10 \\Rightarrow x = 283$ K. (Sense-check: $50\\degree$F $= 10\\degree$C; in Kelvin, $10 + 273 = 283$ K. ✓)",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Lines in Physics — Temperature and Work',
  subtitle: "Two completely different physics ideas — Kelvin↔Fahrenheit and Work = Force × Distance — both wear the same algebraic skeleton $y = ax + b$",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['physics', 'kelvin-fahrenheit', 'work-force-distance', 'linear-equation', 'NCERT-end-of-chapter-Q8-Q9'],
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
