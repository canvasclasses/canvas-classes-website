'use strict';
// Class 9 Math — Ch 2 — Page 24: "Two Linear Polynomials Together"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'two-linear-polynomials-together';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 24;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: "A wide cinematic illustration of two glowing parallel lines tilting upward across a starry coordinate grid, each line meeting the x-axis at a different point clearly marked, with a soft glowing point at (-1, 0) where many faint additional lines also pass through.",
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vast green-tinted graph-paper grid fills the frame against a deep indigo starry sky. Two prominent glowing lines tilt upward to the right at the same angle (parallel) — one labelled 'p(x) = 2x - 1' and the other labelled 'q(x) = 2x - 9'. Each line is marked where it crosses the x-axis: p at (1/2, 0), q at (9/2, 0). On the same grid, several softer additional lines (in muted colours) all pass through a single bright point at (-1, 0) — these represent a family of lines f(x) = ax + a for various positive a values. Painterly cinematic illustration. Dark background, warm amber accent on the bright point at (-1, 0). The labels are the only text."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "Two final puzzles to close the chapter. **Puzzle A:** Two linear polynomials, $p(x)$ and $q(x)$. We know that $p$ passes through $(2, 3)$ and $(6, 11)$; $q$ passes through $(4, -1)$; and $q$ is parallel to $p$. Find both polynomials. **Puzzle B:** Look at the family of linear functions $f(x) = ax + a$ where $a > 0$ (so $a$ is any positive number). Different values of $a$ give different lines. **What is the *one* thing every line in this family has in common?**",
    hint: "For Puzzle A, use the two-point method on $p$, then use the parallel rule (same slope) and the given point on $q$ to find $q$. For Puzzle B, plug in a few values of $a$ — say $a = 1, 2, 3$ — and look for a point that *all* the resulting lines pass through.",
    reveal: "**Puzzle A:** $p(x) = 2x - 1$ and $q(x) = 2x - 9$. Both lines have slope $2$ (parallel), but different $y$-intercepts. **Puzzle B:** Every line $f(x) = ax + a$ passes through the fixed point $(-1, 0)$ — because $f(-1) = -a + a = 0$, no matter what $a$ is. **An entire infinite family of lines, all rotating around one fixed point.** This is the chapter's last and quietest beauty."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'A Subhāṣita on Shared Origins',
    markdown: "_From the Subhāṣita-Ratna-Bhāṇḍāgāra — On a Single Source_\n\n### अनेकाः गतयः जातेः एकात् बीजात् प्रजायन्ते\n### एकम् मूलम् अनेकेषाम् फलानाम् हृदि नित्यदा॥\n\n*(anekāḥ gatayaḥ jāteḥ ekāt bījāt prajāyante / ekam mūlam anekeṣām phalānām hṛdi nityadā)*\n\n---\n\n*'अनेक रास्ते एक ही बीज से निकलते हैं। एक मूल, अनेक फलों के दिल में हमेशा रहता है।'*\n\n*'Many paths arise from a single seed. One root lives forever in the heart of many fruits.'*\n\nThis verse describes the second puzzle of this page beautifully. **An infinite family of straight lines, all rotating around one shared origin point.** Each line is different (different slopes, different y-intercepts), yet *all* of them must pass through the same fixed point $(-1, 0)$ — because that is built into their algebraic shape. *A single root holding many lines together.* It is one of the most elegant ideas you will meet in linear algebra."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'Puzzle A — Two parallel polynomials, find both' },
  { id: uid(), type: 'text', order: 4,
    markdown: "We have two unknown polynomials $p(x) = ax + b$ and $q(x) = cx + d$. That is **four unknowns** — $a, b, c, d$ — so we will need four pieces of information.\n\nThe puzzle gives us:\n- $p(x)$ passes through $(2, 3)$ → one equation about $a$ and $b$.\n- $p(x)$ passes through $(6, 11)$ → a second equation about $a$ and $b$.\n- $q(x)$ passes through $(4, -1)$ → one equation about $c$ and $d$.\n- $q(x)$ is parallel to $p(x)$ → one equation linking $c$ to $a$ (specifically $c = a$).\n\nThat is exactly four clues for four unknowns — perfectly determined. Let us solve in two stages: first find $p(x)$ entirely (using its two points), then use the parallel rule and $q$'s single point to find $q(x)$."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'cartesian-plotter',
    title: 'Try It: Two Parallel Polynomials and a Family of Rotating Lines'
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'End-of-Chapter Q13 — Find both polynomials and their x-intercepts', variant: 'ncert_intext',
    problem: "Let $p(x) = ax + b$ and $q(x) = cx + d$ be two linear polynomials. Given: **(i)** the graph of $p(x)$ passes through $(2, 3)$ and $(6, 11)$; **(ii)** the graph of $q(x)$ passes through $(4, -1)$; **(iii)** the graph of $q(x)$ is parallel to the graph of $p(x)$. **Find $p(x)$ and $q(x)$. Also find the coordinates where each line meets the $x$-axis.**",
    solution: "**Step 1 — Find $p(x)$ using the two-point method.**\n\n$3 = 2a + b$ &nbsp;... (Eq 1)\n\n$11 = 6a + b$ &nbsp;... (Eq 2)\n\nSubtract Eq 1 from Eq 2: $8 = 4a \\Rightarrow a = 2$. Then $b = 3 - 2(2) = -1$.\n\n**So $p(x) = 2x - 1$.**\n\n**Step 2 — Use the parallel rule to fix the slope of $q$.** Two parallel lines have equal slopes. So $c = a = 2$. Now $q(x) = 2x + d$ for some constant $d$.\n\n**Step 3 — Use the point $(4, -1)$ to find $d$.** Substitute:\n\n$$-1 = 2(4) + d = 8 + d \\quad \\Longrightarrow \\quad d = -9$$\n\n**So $q(x) = 2x - 9$.**\n\n**Step 4 — Where does each line meet the $x$-axis?** A line meets the $x$-axis where $y = 0$.\n\n- $p(x) = 0 \\Rightarrow 2x - 1 = 0 \\Rightarrow x = \\tfrac{1}{2}$. So $p$ meets the $x$-axis at $\\left(\\tfrac{1}{2}, 0\\right)$.\n- $q(x) = 0 \\Rightarrow 2x - 9 = 0 \\Rightarrow x = \\tfrac{9}{2}$. So $q$ meets the $x$-axis at $\\left(\\tfrac{9}{2}, 0\\right)$.\n\n**Verify the constraints.**\n- $p(2) = 4 - 1 = 3$ ✓ &nbsp; $p(6) = 12 - 1 = 11$ ✓\n- $q(4) = 8 - 9 = -1$ ✓\n- Both have slope $2$, so parallel ✓\n\n**Final answer:** $p(x) = 2x - 1$, &nbsp; $q(x) = 2x - 9$. They cross the $x$-axis at $\\left(\\tfrac{1}{2}, 0\\right)$ and $\\left(\\tfrac{9}{2}, 0\\right)$ respectively. The two lines are parallel (same slope $2$) and never meet."
  },
  { id: uid(), type: 'heading', order: 7, level: 2, text: 'Puzzle B — A family of lines that all share one point' },
  { id: uid(), type: 'text', order: 8,
    markdown: "The second puzzle is more reflective. Instead of one specific polynomial, we are looking at an *entire family* — every linear function of the shape $f(x) = ax + a$ where $a$ is some positive number.\n\nDifferent choices of $a$ give different lines:\n- $a = 1$: $f(x) = x + 1$.\n- $a = 2$: $f(x) = 2x + 2$.\n- $a = 3$: $f(x) = 3x + 3$.\n- $a = 0.5$: $f(x) = 0.5x + 0.5$.\n\nThese are all *different* lines — different slopes, different $y$-intercepts. **What could possibly be the one thing they all share?**\n\nLook at the algebraic shape carefully: the slope is $a$ and the $y$-intercept is *also* $a$. So in this family, **the slope and the $y$-intercept are equal** — that is one shared feature. But there is something even more remarkable, hiding at a single point on the grid."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'End-of-Chapter Q14 — What do all $f(x) = ax + a$, $a > 0$, have in common?', variant: 'ncert_intext',
    problem: "What do all linear functions of the form $f(x) = ax + a$, with $a > 0$, have in common?",
    solution: "**Try a few specific lines.** With $a = 1$: $f(x) = x + 1$. With $a = 2$: $f(x) = 2x + 2$. With $a = 3$: $f(x) = 3x + 3$.\n\n**Test the point $(-1, 0)$ in each.**\n- $f(-1) = -1 + 1 = 0$. ✓\n- $f(-1) = -2 + 2 = 0$. ✓\n- $f(-1) = -3 + 3 = 0$. ✓\n\nAll three lines pass through $(-1, 0)$.\n\n**Now prove this is true for *every* value of $a$, not just these three.** Substitute $x = -1$ into the general rule:\n\n$$f(-1) = a(-1) + a = -a + a = 0$$\n\nThe variable $a$ cancels out completely. So $f(-1) = 0$ no matter what value of $a$ we choose — *every* line in the family passes through the same point $(-1, 0)$.\n\n**Two answers, both correct.**\n\n1. **Algebraic feature:** the slope and the $y$-intercept are equal (both equal to $a$).\n2. **Geometric feature:** all lines in the family pass through the *fixed point* $(-1, 0)$ — i.e., every such line crosses the $x$-axis at $x = -1$.\n\n**The geometric picture.** Imagine a single dot at $(-1, 0)$. The family of lines $f(x) = ax + a$ behaves like a *fan* — every line in the family is *anchored* at $(-1, 0)$ but tilts at a different angle depending on the value of $a$. **A whole infinite family of lines, all rotating around one shared point.**"
  },
  { id: uid(), type: 'reasoning_prompt', order: 10,
    reasoning_type: 'logical',
    prompt: "We just discovered that every line $f(x) = ax + a$ passes through $(-1, 0)$ regardless of the value of $a$. **Could you design a similar family of lines that all pass through, say, $(2, 0)$?**",
    options: [
      "No — only $(-1, 0)$ works",
      "**Yes — any family $f(x) = a(x - 2)$ (i.e., $f(x) = ax - 2a$) will pass through $(2, 0)$ because $f(2) = a(0) = 0$, regardless of the value of $a$. This is the same algebraic trick — package the fixed point into the formula by letting the variable $a$ multiply a factor that vanishes at the fixed $x$-value.**",
      "Yes, but only if $a = 2$",
      "Yes, but only with vertical lines"
    ],
    reveal: "Notice the structure of the original family $f(x) = ax + a = a(x + 1)$. The factor $(x + 1)$ vanishes when $x = -1$, *killing* the entire output regardless of $a$. **To create a family anchored at $(c, 0)$, simply use $f(x) = a(x - c)$.** For $c = 2$: $f(x) = a(x - 2) = ax - 2a$. For *any* value of $a$, $f(2) = 0$. Three quick examples — $a=1$ gives $x - 2$; $a=3$ gives $3x - 6$; $a=-5$ gives $-5x + 10$. All three lines cross $(2, 0)$. **You have just discovered how to construct an entire family of lines through any chosen anchor point. This is the language of *line bundles* — and it is one of the deepest ideas in geometry, hiding inside an end-of-chapter exercise.**",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 11,
    title: 'Practice Yourself — Two Polynomials and Line Families',
    markdown: "**A. Two-polynomial puzzles.**\n\n1. $p(x) = ax + b$ and $q(x) = cx + d$. $p$ passes through $(0, -2)$ and $(3, 4)$; $q$ is parallel to $p$ and passes through $(1, 5)$. Find both, and the coordinates where each crosses the $x$-axis.\n2. Two linear polynomials $p$ and $q$. $p(2) = 7$, $q(2) = 3$, and $p + q = 4x + 6$. Find $p$ and $q$.\n\n**B. Line families.**\n\n3. Pick three values of $a$ and verify that each of the lines $f(x) = ax - 2a$ passes through $(2, 0)$.\n4. Find a fixed point that *every* line in the family $f(x) = ax + 3a$ passes through. *(Hint: factor the formula.)*\n5. Does every line in the family $f(x) = ax + a + 1$ share a single fixed point? Try a few values of $a$ and see.\n\n---\n\n**Answers:**  1. $p$: equations $-2 = b$ and $4 = 3a + b$. So $a = 2, b = -2$, $p(x) = 2x - 2$. Parallel $\\Rightarrow c = 2$. $q(1) = 2(1) + d = 5 \\Rightarrow d = 3$, so $q(x) = 2x + 3$. $p$ crosses $x$-axis at $(1, 0)$; $q$ at $\\left(-\\tfrac{3}{2}, 0\\right)$.  2. $p(x) = ax + b, q(x) = cx + d$. $p + q = (a + c)x + (b + d) = 4x + 6$, so $a + c = 4$ and $b + d = 6$. $p(2) = 2a + b = 7$ and $q(2) = 2c + d = 3$. Adding the last two: $2(a + c) + (b + d) = 10 \\Rightarrow 8 + 6 = 14 \\ne 10$. **Inconsistent — no such pair exists.** *(Real-life lesson: not every clue set has a solution. The system is over-determined here.)*  3. $f(2) = 2a - 2a = 0$ for any $a$. ✓  4. $f(x) = a(x + 3)$. $f(-3) = 0$ for any $a$. So every line passes through $(-3, 0)$.  5. Try $a = 1$: $f(x) = x + 2$. Try $a = 2$: $f(x) = 2x + 3$. Set them equal: $x + 2 = 2x + 3 \\Rightarrow x = -1$, $y = 1$. Check with $a = 3$: $f(-1) = -3 + 3 + 1 = 1$. ✓ So all lines in the family pass through $(-1, 1)$. (Algebraic proof: $f(-1) = -a + a + 1 = 1$ for any $a$.)"
  },
  { id: uid(), type: 'inline_quiz', order: 12, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "Two parallel linear polynomials have the same slope $5$. If one is $y = 5x + 2$, which of the following could be the other?",
        options: ["$y = 5x + 2$", "$y = -5x + 2$", "$y = 5x - 7$", "$y = 2x + 5$"], correct_index: 2,
        explanation: "Parallel lines have *equal slopes* but *different $y$-intercepts*. The first option is identical (not a different line), the second has slope $-5$, the fourth has slope $2$. Only $y = 5x - 7$ has slope $5$ and a different $y$-intercept ($-7$ vs $2$).",
        reasoning_level: 1 },
      { id: uid(), question: "A linear polynomial $p(x)$ passes through $(1, 4)$ and $(3, 10)$. Another linear polynomial $q(x)$ is parallel to $p(x)$ and passes through $(0, -1)$. **What is $q(x)$?**",
        options: ["$q(x) = 3x - 1$", "$q(x) = 3x + 1$", "$q(x) = -3x - 1$", "$q(x) = x - 1$"], correct_index: 0,
        explanation: "Find $p$ first: $4 = a + b$, $10 = 3a + b$. Subtract: $6 = 2a \\Rightarrow a = 3$. Then $b = 1$. So $p(x) = 3x + 1$. Since $q$ is parallel to $p$, $q$ has slope $3$. With $q(0) = -1$, $q(x) = 3x - 1$.",
        reasoning_level: 2 },
      { id: uid(), question: "Through which fixed point does *every* line of the family $f(x) = ax - 4a$ pass, regardless of the value of $a$?",
        options: ["$(0, -4)$", "$(0, 4)$", "$(4, 0)$", "$(-4, 0)$"], correct_index: 2,
        explanation: "Factor: $f(x) = a(x - 4)$. Plug in $x = 4$: $f(4) = a(0) = 0$, regardless of $a$. So every line in this family passes through $(4, 0)$.",
        reasoning_level: 3 },
      { id: uid(), question: "Consider the family $f(x) = ax + 5a$ with $a > 0$. **Which statement about this family is TRUE?**",
        options: [
          "Every line in the family has the same $y$-intercept",
          "**Every line in the family passes through the fixed point $(-5, 0)$ — because $f(-5) = -5a + 5a = 0$ for any value of $a$, the variable $a$ cancels out.**",
          "Every line is parallel to every other line",
          "Every line passes through the origin"
        ],
        correct_index: 1,
        explanation: "Factor: $f(x) = a(x + 5)$. At $x = -5$, $f(-5) = a \\cdot 0 = 0$ for any $a$. So all lines in this family pass through $(-5, 0)$. The $y$-intercepts are *not* the same — they equal $5a$, which varies with $a$. The lines are *not* parallel — they have different slopes (each is $a$). So only the fixed-point claim is correct.",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Two Linear Polynomials Together',
  subtitle: "A pair of parallel polynomials and a whole family of lines that share one fixed point — the chapter's quiet algebraic surprises",
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['parallel-lines', 'line-families', 'fixed-point', 'NCERT-end-of-chapter-Q13-Q14', 'practice'],
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
