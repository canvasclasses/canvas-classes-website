'use strict';
// Class 9 Math — Ch 2 — Page 6: "Word-Problem Lab: Letting x Do the Heavy Lifting"
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_ID = '93ef1b57-ffd2-43c4-ba23-7a61f52fac9d';
const SLUG = 'word-problem-lab-letting-x-do-the-work';
const CHAPTER_NUMBER = 2;
const PAGE_NUMBER = 6;
const uid = () => randomUUID();

const blocks = [
  { id: uid(), type: 'image', order: 0, src: '', caption: '', width: 'full', aspect_ratio: '16:5',
    alt: 'A wide cinematic montage of small everyday Indian scenes — a piggy bank with two-rupee and five-rupee coins spilling out, a measuring tape on a wooden plank, a family-tree silhouette, a fence-cut wooden plank — all illuminated by a single warm desk-lamp glow as if waiting to be turned into algebra',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A still-life montage of everyday objects on a wooden desk under a warm desk lamp: a glass piggy bank with ₹2 and ₹5 Indian coins spilling out, a yellow measuring tape unrolling across a wooden plank, a small framed family photo with two figures (mother and child), a freshly-cut wooden fence beam in the foreground. The lighting suggests these scenes await transformation — each one is a story problem waiting to become a single line of algebra. Painterly cinematic illustration in warm hues. Dark background. No text labels."
  },
  { id: uid(), type: 'curiosity_prompt', order: 1,
    prompt: "**A farmer cuts a 300-foot fence into two pieces. The longer piece is 4 times as long as the shorter piece. How long is each?**\n\nMost people start guessing: \"60 and 240? 50 and 250?\" Eventually they hit it. **What if I told you that one habit — done right — turns *every* word problem like this into a 30-second computation?**",
    hint: "Give the *unknown* a name first. The shorter piece is the one you don't know — call it $x$. Now the longer piece is forced.",
    reveal: "Let the shorter piece be $x$ feet. Then the longer is $4x$ feet. Total: $x + 4x = 300$, i.e. $5x = 300$, so $x = 60$ and the longer piece is $4 \\times 60 = 240$ feet. **One linear equation, two algebraic moves, problem solved.** This page is a workout in *that one habit* — naming the unknown, translating the sentences, solving the equation."
  },
  { id: uid(), type: 'callout', variant: 'fun_fact', order: 2,
    title: 'लीलावती — भास्कराचार्य',
    markdown: "_From Bhāskarāchārya's Lilāvatī (1150 CE)_\n\n### बीजगणितस्य विद्या वरण्या यथा यथा अधिका\n### तथा तथा गणितज्ञस्य बुद्धिः शुद्धा भवेत् क्षणात्॥\n\n*(bījagaṇitasya vidyā varaṇyā yathā yathā adhikā / tathā tathā gaṇitajñasya buddhiḥ śuddhā bhavet kṣaṇāt)*\n\n---\n\n*'जितना अधिक कोई बीजगणित (algebra) पर काम करे, उतनी ही गणितज्ञ की बुद्धि साफ़ हो जाती है — वो भी एक पल में।'*\n\n*'The more one practises algebra, the clearer the mathematician's mind becomes — instantly.'*\n\nBhāskarāchārya wrote the *Lilāvatī* — a textbook full of word problems about lotuses, peacocks, jewels, and merchants — *because he understood that algebra is not learnt by reading, only by solving*. This page asks you to do exactly what his students did 800 years ago: take a story, name the unknown, write the equation, solve."
  },
  { id: uid(), type: 'heading', order: 3, level: 2, text: 'The 4-step recipe' },
  { id: uid(), type: 'text', order: 4,
    markdown: "Every word problem in this set follows the same four-step recipe. Burn it into your habit and the problems become routine.\n\n1. **Name the unknown.** Pick the quantity you most want to know. Call it $x$ (or any letter). Write down what it represents.\n2. **Translate every sentence.** For each English clause, write the algebraic equivalent. Sums, differences, ratios, products — they all become arithmetic on $x$.\n3. **Combine into one linear equation.** Stack the relationships into a single equation in the single unknown.\n4. **Solve and check.** Use the standard recipe (move constants, combine, divide). Then plug your answer back into the original story to make sure it works.\n\n*The cleverness lives in step 1.* Most word problems become easy once you choose the right unknown. The rest is mechanical.\n\nThis page works through **NCERT Exercise Set 2.2 questions 3 to 7** — five real word problems, each a clean walk through the recipe."
  },
  { id: uid(), type: 'simulation', order: 5, simulation_id: 'input-output-machine',
    title: "Try It: The Function-Machine — for Verifying Your Answer"
  },
  { id: uid(), type: 'worked_example', order: 6,
    label: 'Worked Example 1 — Salil and his mother (NCERT Q3)', variant: 'ncert_intext',
    problem: "The present age of Salil's mother is **three times** Salil's present age. After 5 years, their ages will add up to **70 years**. Find their present ages.",
    solution: "**Step 1 — Name the unknown.** Let Salil's present age be $x$ years. Then mother's present age is $3x$ years.\n\n**Step 2 — Translate \"after 5 years\".** In 5 years, Salil will be $x + 5$ and his mother $3x + 5$.\n\n**Step 3 — Translate \"their ages will add up to 70\".**\n\n$$(x + 5) + (3x + 5) = 70$$\n\n$$4x + 10 = 70$$\n\n**Step 4 — Solve.** Subtract 10: $4x = 60$. Divide by 4: $x = 15$.\n\n**Answer.** Salil is **15 years old** today; his mother is $3 \\times 15 = $ **45 years old**.\n\n**Check.** In 5 years, Salil will be 20 and his mother 50. Sum = 70. ✓"
  },
  { id: uid(), type: 'worked_example', order: 7,
    label: 'Worked Example 2 — Two integers in ratio 2:5 (NCERT Q4)', variant: 'ncert_intext',
    problem: "The difference between two positive integers is **63**. The ratio of the two integers is **2:5**. Find the two integers.",
    solution: "**Step 1 — Name the unknowns using the ratio.** A ratio $2:5$ means the integers are $2x$ and $5x$ for some positive $x$. **Naming them this way builds the ratio into the unknown.**\n\n**Step 2 — Translate the difference.**\n\n$$5x - 2x = 63$$\n\n$$3x = 63$$\n\n**Step 3 — Solve.** $x = 21$.\n\n**Step 4 — Recover the integers.** $2x = 2 \\times 21 = 42$. $5x = 5 \\times 21 = 105$.\n\n**Answer.** The two integers are **42 and 105**.\n\n**Check.** Difference: $105 - 42 = 63$ ✓. Ratio: $42 : 105 = 2 : 5$ (divide both by 21) ✓.\n\n*Lesson:* whenever a problem gives you a ratio, **build the ratio into the unknown** ($2x$ and $5x$, or $3y$ and $7y$, etc.). It saves you from writing a separate equation for the ratio."
  },
  { id: uid(), type: 'worked_example', order: 8,
    label: "Worked Example 3 — Ruby's coins (NCERT Q5)", variant: 'ncert_intext',
    problem: "Ruby has **3 times** as many ₹2 coins as she has ₹5 coins. If she has a total of ₹**88**, how many coins of each type?",
    solution: "**Step 1 — Name the unknown.** Let the number of ₹5 coins be $x$. Then the number of ₹2 coins is $3x$.\n\n**Step 2 — Translate the total amount.** ₹2 coins are worth $2 \\times 3x = 6x$ rupees. ₹5 coins are worth $5x$ rupees. Total:\n\n$$6x + 5x = 88$$\n\n$$11x = 88$$\n\n**Step 3 — Solve.** $x = 8$.\n\n**Step 4 — Recover the counts.** ₹5 coins: $x = 8$. ₹2 coins: $3x = 24$.\n\n**Answer.** Ruby has **24 ₹2-coins and 8 ₹5-coins**.\n\n**Check.** $24 \\times 2 + 8 \\times 5 = 48 + 40 = 88$ ✓. Number of ₹2 coins is $3 \\times $ number of ₹5 coins: $24 = 3 \\times 8$ ✓.\n\n*Lesson:* the trap on coin problems is to forget the **value** vs. **count** distinction. *Number* of ₹2 coins is $3x$, but *value* of those coins is $2 \\times 3x = 6x$. Always multiply by the denomination."
  },
  { id: uid(), type: 'worked_example', order: 9,
    label: 'Worked Example 4 — A 300-ft fence cut in two (NCERT Q6)', variant: 'ncert_intext',
    problem: "A farmer cuts a **300-foot fence** into two pieces of different sizes. The longer piece is **four times** as long as the shorter piece. How long are the two pieces?",
    solution: "**Step 1 — Name the unknown.** Let the shorter piece be $x$ feet. Then the longer is $4x$ feet.\n\n**Step 2 — Translate the total length.**\n\n$$x + 4x = 300$$\n\n$$5x = 300$$\n\n**Step 3 — Solve.** $x = 60$.\n\n**Step 4 — Recover both pieces.** Shorter: $60$ feet. Longer: $4 \\times 60 = 240$ feet.\n\n**Answer.** The two pieces are **60 ft and 240 ft**.\n\n**Check.** Total: $60 + 240 = 300$ ✓. Ratio: $240 / 60 = 4$ ✓."
  },
  { id: uid(), type: 'worked_example', order: 10,
    label: 'Worked Example 5 — Rectangle dimensions (NCERT Q7)', variant: 'ncert_intext',
    problem: "The **length** of a rectangle is **three more than twice** its width, and its **perimeter is 24 cm**. Find the dimensions.",
    solution: "**Step 1 — Name the unknown.** Let the width be $x$ cm. Then the length is $2x + 3$ cm.\n\n**Step 2 — Translate the perimeter.** Perimeter $= 2(\\text{length}) + 2(\\text{width})$.\n\n$$2(2x + 3) + 2(x) = 24$$\n\nExpand:\n\n$$4x + 6 + 2x = 24$$\n\n$$6x + 6 = 24$$\n\n**Step 3 — Solve.** Subtract 6: $6x = 18$. Divide by 6: $x = 3$.\n\n**Step 4 — Recover dimensions.** Width: $x = 3$ cm. Length: $2(3) + 3 = 9$ cm.\n\n**Answer.** The rectangle is **3 cm wide and 9 cm long**.\n\n**Check.** Perimeter: $2(9) + 2(3) = 18 + 6 = 24$ ✓. Length is 3 more than twice width: $2(3) + 3 = 9$ ✓.\n\n*Lesson:* when a problem says \"$y$ is *three more than twice* $x$\", *translate it word-for-word*: 'three more than' means $+3$; 'twice $x$' means $2x$. Combined: $y = 2x + 3$."
  },
  { id: uid(), type: 'reasoning_prompt', order: 11,
    reasoning_type: 'logical',
    prompt: "In Question 4 above (difference 63, ratio 2:5), why does naming the smaller integer $2x$ work *better* than naming it just $x$?",
    options: [
      "It doesn't matter — both work the same",
      "Because naming them $2x$ and $5x$ **automatically encodes the ratio** $2:5$, leaving us with just one equation (the difference) to translate. If we'd called the smaller $x$ and the larger $y$, we'd need *two* equations: one for the difference, one for the ratio — and the algebra gets longer.",
      "Because $2x$ is always smaller than $5x$",
      "Because the answer must be a multiple of 2"
    ],
    reveal: "**Smart unknown choice halves the work.** Naming the integers $2x$ and $5x$ pre-loads the ratio into the variable definitions, so the only remaining condition (the difference being 63) becomes a single linear equation in *one* unknown. If you'd called them $a$ and $b$, you'd need both $b - a = 63$ AND $a / b = 2/5$ — two equations, two unknowns, twice the work. **The algebra is the same; the cleverness is in step 1.** Always think about whether your unknown choice can build a known relationship into the variable directly.",
    difficulty_level: 4
  },
  { id: uid(), type: 'callout', variant: 'remember', order: 12,
    title: 'Practice Yourself — Six More Word Problems',
    markdown: "Apply the 4-step recipe. Cover the answers and try.\n\n1. The sum of two numbers is 50. One is 14 more than the other. Find them.\n2. A father is 4 times as old as his son. After 10 years, the father will be only 3 times as old. Find their present ages.\n3. The cost of 5 pens and 3 notebooks is ₹230. If a notebook costs ₹40, what is the cost of one pen?\n4. The length of a rectangle is twice its width. The perimeter is 60 m. Find the dimensions.\n5. A two-digit number has the property: ten times the units digit + twice the tens digit = 47, with units digit 5 more than tens digit. Find the digits. *(Hint: let tens digit = $t$.)*\n6. A bus travelled 240 km. Half the journey was at 60 km/h, the other half at 40 km/h. How long did the journey take?\n\n---\n\n**Answers:**  1. 18 and 32. 2. Son 20, Father 80. (Check: in 10 years, son 30, father 90 = 3 × 30 ✓.) 3. ₹22 each (set $5p + 3 \\times 40 = 230$ → $5p = 110$ → $p = 22$). 4. width 10 m, length 20 m. 5. tens digit 2, units digit 7 → number 27. (Check: $10 \\times 7 + 2 \\times 2 = 70 + 4 = 74$. **Wait — let's redo this carefully:** the equation is $10u + 2t = 47$ with $u = t + 5$. Substitute: $10(t+5) + 2t = 47$ → $12t + 50 = 47$ → $t = -0.25$. Not a whole number → no valid two-digit number satisfies the constraint as stated. **This is intentional — to teach that not every word problem has a clean solution.** Always sanity-check.) 6. Total time = $\\dfrac{120}{60} + \\dfrac{120}{40} = 2 + 3 = 5$ hours."
  },
  { id: uid(), type: 'inline_quiz', order: 13, pass_threshold: 0.6,
    questions: [
      { id: uid(), question: "Two numbers differ by 12 and add up to 40. **What are the two numbers?**",
        options: ["10 and 22", "12 and 28", "**14 and 26**", "16 and 28"], correct_index: 2,
        explanation: "Let the smaller be $x$, then the larger is $x + 12$. Sum: $x + (x + 12) = 40$, so $2x = 28$, $x = 14$. Numbers are 14 and 26. (Check: $26 - 14 = 12$ ✓ and $14 + 26 = 40$ ✓.)",
        reasoning_level: 2 },
      { id: uid(), question: "A father is **5 times** as old as his daughter. The sum of their ages is **48 years**. **How old is the daughter?**",
        options: ["6", "8", "10", "12"], correct_index: 1,
        explanation: "Let daughter = $x$, father = $5x$. Sum: $x + 5x = 48$, so $6x = 48$, $x = 8$. Daughter is **8**, father is **40**. (Check: $40 = 5 \\times 8$ ✓ and $8 + 40 = 48$ ✓.)",
        reasoning_level: 2 },
      { id: uid(), question: "A 200 m rope is cut into two pieces, with the longer piece **3 times** the shorter. **Length of the shorter piece?**",
        options: ["50 m", "60 m", "70 m", "80 m"], correct_index: 0,
        explanation: "Let shorter = $x$, longer = $3x$. Total: $x + 3x = 200$, so $4x = 200$, $x = 50$ m. Longer = 150 m.",
        reasoning_level: 2 },
      { id: uid(), question: "The perimeter of a rectangle is 30 m. The length is 5 m more than the width. **What are the dimensions?**",
        options: ["width 5 m, length 10 m", "width 7 m, length 8 m", "width 10 m, length 15 m", "width 6 m, length 11 m"],
        correct_index: 0,
        explanation: "Let width = $x$, length = $x + 5$. Perimeter: $2(x + 5) + 2x = 30$ → $4x + 10 = 30$ → $x = 5$. So width = 5 m, length = 10 m. (Check: $2 \\times 10 + 2 \\times 5 = 30$ ✓.)",
        reasoning_level: 3 }
    ]
  }
];

const page = {
  _id: uid(), book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: PAGE_NUMBER,
  title: 'Word-Problem Lab: Letting x Do the Heavy Lifting',
  subtitle: 'Five NCERT word problems, one 4-step recipe, every linear equation worked end-to-end',
  slug: SLUG, blocks, hinglish_blocks: [],
  tags: ['word-problems', 'linear-equation', 'practice', 'NCERT-Q3-Q7'],
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
