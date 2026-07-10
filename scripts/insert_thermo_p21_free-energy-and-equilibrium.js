'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — Arc D (Free Energy), Page 21 — FINAL PAGE.
 * "Free Energy & Equilibrium" — the standard free energy change, its link to the
 * equilibrium constant (ΔG° = −RT ln K), and how the actual ΔG falls to zero at
 * equilibrium while ΔG° stays a fixed number tied to K. Closes the chapter.
 * Voice: teacher-voice-profile.md (FORMAT v2) + THERMO-exemplars.md ("moksh" / equilibrium).
 * Reference-first: Mittal §25.7.8–9.
 * published:false. node --check only — DO NOT RUN.
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 21;
const NEW_SLUG = 'free-energy-and-equilibrium';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5, full)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A ball rolling down a smooth valley and coming to rest at the lowest point, with a glowing curve marking the bottom of the dip',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A smooth glowing valley curve, like a slide, with a single luminous sphere having rolled down it and now resting motionless at the very bottom of the dip. The curve falls steeply at first, then flattens out where the sphere sits still. The idea: a reaction slides downhill, releasing free energy, and finally settles at the lowest point where it has none left to give — equilibrium. Deep near-black background (#0a0a0a), warm orange and amber glow along the curve and the resting sphere, soft cool shadows in the valley walls. Clean cinematic scientific-illustration style. No text, numbers, or labels.' },

    // 1 — fun_fact hook (callout)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'No Reaction Runs Forever',
      markdown: "No reaction runs forever. It slows, eases off, and finally settles at equilibrium — the point where it has no free energy left to release. At that exact point its $ \\Delta G $ is zero, and the forward and backward rates are perfectly matched. The mixture looks frozen, but underneath, both directions are still running at the same speed." },

    // 2 — core text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "On the last page you met the **Gibbs free energy** — the part of a reaction's energy that is actually free to do work. A reaction runs only as long as it still has some of that free energy to give. As products build up and reactants run low, the amount left to release shrinks. When it reaches zero, the reaction has nothing more to spend, and it stops changing. That resting point is **equilibrium**.\n\n" +
      "Think of free energy as a ball rolling down into a valley. It moves fast where the slope is steep, slows as the ground flattens, and comes to rest at the lowest point. At the bottom the free energy is at a minimum and the entropy at a maximum — the settled still point the reaction was always heading toward. There is nowhere lower to go, so it sits there." },

    // 3 — heading 1 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Standard Free Energy and the Reaction Quotient',
      objective: 'Separate the fixed standard free energy change from the actual free energy change that drifts as a reaction proceeds.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Two free-energy quantities look almost the same and are constantly mixed up. Keep them apart from the start.\n\n" +
      "The **standard free energy change** $ \\Delta G^\\circ $ is the value of $ \\Delta G $ when every species in the reaction is in its standard state — gases at 1 bar, solutions at 1 mol/L. It is a single fixed number for a given reaction at a given temperature. It does not change as the reaction runs.\n\n" +
      "The **actual free energy change** $ \\Delta G $ is what the reaction has to give *right now*, at the mixture you actually have. It depends on how far the reaction has gone, through the reaction quotient $ Q $:\n\n" +
      "$ \\Delta G = \\Delta G^\\circ + RT\\ln Q $\n\n" +
      "At the start $ Q $ is small and $ \\Delta G $ is strongly negative — the reaction has plenty to give. As products pile up, $ Q $ grows, $ \\Delta G $ climbs toward zero, and the reaction loses its push." },

    // 4 — image: free-energy-vs-reaction-progress curve (two_third, 16:9)
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '16:9',
      alt: 'A curve of free energy G against reaction progress that falls from the reactants side down to a minimum and then rises to the products side; the lowest point is marked as equilibrium',
      caption: '📸 G falls to a minimum at equilibrium — the lowest point, where it has nothing left to release',
      generation_prompt: 'A clean scientific line chart on a deep near-black background (#0a0a0a). Horizontal axis labelled "Reaction progress" running from "Reactants" on the left to "Products" on the right. Vertical axis labelled "Free energy, G". A smooth glowing orange-amber curve that starts high on the left (pure reactants), dips down into a clear single minimum somewhere in the middle, then rises again toward the right (pure products). At the bottom of the dip, a small glowing marker and a thin vertical guide line labelled "Equilibrium". A short arrow on the downhill slope pointing toward the minimum to suggest the reaction sliding down. Crisp white axis lines and minimal white labels only (Reactants, Products, Free energy G, Reaction progress, Equilibrium). No other text or numbers. Clean cinematic scientific-illustration style.' },

    // 5 — reasoning_prompt (mid-page, after the ΔG vs ΔG° distinction)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'conceptual', difficulty_level: 2,
      prompt: "A reaction has reached equilibrium. What is the value of its actual free energy change $ \\Delta G $ at this point — not the standard value $ \\Delta G^\\circ $?",
      options: [
        "It equals $ \\Delta G^\\circ $, since both describe the same reaction",
        "It is zero — the reaction has no free energy left to release, so forward and reverse tendencies balance",
        "It is a large negative number, because the reaction is still favourable",
        "It is positive, because the reverse reaction now dominates"
      ],
      correct_index: 1,
      reveal: "At equilibrium the reaction has slid to the bottom of its free-energy valley. There is nothing left to release in either direction, so $ \\Delta G = 0 $ and the forward and reverse drives are perfectly matched. It does not equal $ \\Delta G^\\circ $ — that is a fixed number set by $ K $, and it is usually *not* zero. And it cannot stay strongly negative: a strongly negative $ \\Delta G $ means the reaction still has a push and has not yet settled." },

    // 6 — heading 2 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Free Energy and the Equilibrium Constant',
      objective: 'Use the sign of the standard free energy change to read off whether products or reactants win at equilibrium.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Set $ \\Delta G = 0 $ and $ Q = K $ at equilibrium in the expression above, and the two ideas snap together into one of the most useful relations in the chapter:\n\n" +
      "$ \\Delta G^\\circ = -RT\\ln K = -2.303\\,RT\\log K $\n\n" +
      "This says the fixed standard value $ \\Delta G^\\circ $ and the equilibrium constant $ K $ carry the same information. Knowing one gives you the other. And the *sign* of $ \\Delta G^\\circ $ tells you, before any calculation, which side the reaction favours:\n\n" +
      "- $ \\Delta G^\\circ < 0 $ gives $ K > 1 $ — the equilibrium sits toward the **products**.\n" +
      "- $ \\Delta G^\\circ > 0 $ gives $ K < 1 $ — the equilibrium sits toward the **reactants**.\n" +
      "- $ \\Delta G^\\circ = 0 $ gives $ K = 1 $ — products and reactants are evenly balanced.\n\n" +
      "The more negative $ \\Delta G^\\circ $ is, the larger $ K $ becomes, and the more completely the reaction goes over to products." },

    // 7 — heading 3 + objective
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Reaching Equilibrium',
      objective: 'Track how the actual free energy change drifts to zero as a reaction approaches its resting state.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Picture the two numbers playing different roles as the reaction runs. $ \\Delta G^\\circ $ is fixed for the day — it never moves. $ \\Delta G $ is the live reading, and it changes every moment as $ Q $ climbs toward $ K $.\n\n" +
      "Far from equilibrium, $ Q $ is much smaller than $ K $, so $ \\Delta G $ is negative and the forward reaction runs. As products form, $ Q $ rises, $ \\Delta G $ creeps up toward zero, and the push fades. The instant $ Q $ equals $ K $, the live reading $ \\Delta G $ hits zero. The reaction has reached the bottom of its valley and stops changing — even though $ \\Delta G^\\circ $, the fixed number, is sitting wherever $ K $ put it the whole time." },

    // 8 — worked_example (solved_example, tap_to_reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — From K to Standard Free Energy',
      problem: "A reaction has an equilibrium constant $ K = 10^5 $ at 298 K. Find its standard free energy change $ \\Delta G^\\circ $. Take $ R = 8.314 $ J/(mol·K).",
      solution: "**Pick the formula.** $ K $ is given and $ \\Delta G^\\circ $ is asked, so use the relation that connects them.\n\n" +
        "$ \\Delta G^\\circ = -2.303\\,RT\\log K $\n\n" +
        "**Put in the values**, keeping $ T $ in Kelvin.\n\n" +
        "$ \\Delta G^\\circ = -2.303 \\times 8.314 \\times 298 \\times \\log(10^5) $\n\n" +
        "**Simplify the log.**\n\n" +
        "$ \\log(10^5) = 5 $\n\n" +
        "**Multiply it through.**\n\n" +
        "$ \\Delta G^\\circ = -2.303 \\times 8.314 \\times 298 \\times 5 $\n\n" +
        "$ \\Delta G^\\circ \\approx -28530 $ J $ \\approx -28.5 $ kJ/mol\n\n" +
        "**Check it makes sense.** A large $ K $ means products dominate, and a large negative $ \\Delta G^\\circ $ is exactly what that should give. The two agree.\n\n" +
        "$ \\boxed{\\Delta G^\\circ \\approx -28.5 \\text{ kJ/mol}} $" },

    // 9 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Relation to Carry Out of This Chapter',
      markdown: "$ \\Delta G^\\circ = -RT\\ln K = -2.303\\,RT\\log K $. The *actual* $ \\Delta G = 0 $ at equilibrium — never $ \\Delta G^\\circ $. And the sign reads the position: $ \\Delta G^\\circ < 0 $ means $ K > 1 $ (products favoured), $ \\Delta G^\\circ > 0 $ means $ K < 1 $ (reactants favoured), $ \\Delta G^\\circ = 0 $ means $ K = 1 $." },

    // 10 — exam_tip callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "The classic trap is mixing up $ \\Delta G $ and $ \\Delta G^\\circ $. Only the actual $ \\Delta G $ is zero at equilibrium; $ \\Delta G^\\circ $ is a fixed value tied to $ K $ and is usually not zero. Two habits save the marks: keep $ T $ in Kelvin every time, and mind the $ 2.303 $ factor when you switch between $ \\ln K $ and $ \\log K $ — drop it and your answer is off by more than double." },

    // 11 — inline_quiz (LAST block, 3 Qs, 0.67)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'For a reaction that has reached equilibrium, which quantity is exactly zero?',
          options: [
            'The standard free energy change $ \\Delta G^\\circ $',
            'The actual free energy change $ \\Delta G $',
            'The equilibrium constant $ K $',
            'The temperature $ T $'
          ],
          correct_index: 1,
          explanation: 'At equilibrium the reaction has no free energy left to release, so the actual $ \\Delta G $ is zero. The tempting choice $ \\Delta G^\\circ $ stays a fixed non-zero number set by $ K $, and $ K $ itself is never zero at equilibrium.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A reaction has a standard free energy change $ \\Delta G^\\circ $ that is strongly negative. What does this say about its equilibrium constant?',
          options: [
            '$ K $ is less than 1, so reactants are favoured',
            '$ K $ is much greater than 1, so products are favoured',
            '$ K $ is exactly 1, so the two sides are balanced',
            '$ K $ is negative, since $ \\Delta G^\\circ $ is negative'
          ],
          correct_index: 1,
          explanation: 'From $ \\Delta G^\\circ = -RT\\ln K $, a negative $ \\Delta G^\\circ $ forces $ K > 1 $, and a strongly negative one makes $ K $ very large — products dominate. The "less than 1" choice is the case for a positive $ \\Delta G^\\circ $, and $ K $ can never be negative.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Using $ \\Delta G^\\circ = -2.303\\,RT\\log K $ with $ R = 8.314 $ J/(mol·K) and $ T = 298 $ K, what is $ \\Delta G^\\circ $ for a reaction with $ K = 10 $?',
          options: [
            'About $ -5.7 $ kJ/mol',
            'About $ +5.7 $ kJ/mol',
            'About $ -2.5 $ kJ/mol',
            'About $ -57 $ kJ/mol'
          ],
          correct_index: 0,
          explanation: 'With $ \\log(10) = 1 $, $ \\Delta G^\\circ = -2.303 \\times 8.314 \\times 298 \\times 1 \\approx -5700 $ J, about $ -5.7 $ kJ/mol — and it is negative because $ K > 1 $. The $ +5.7 $ choice drops the minus sign, and the $ -57 $ choice slips a power of ten by treating $ \\log(10) $ as 10 instead of 1.' },
      ] },

    // 12 — bridge text (final page — close the chapter)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*Look at how far you have come. From two measured numbers — the enthalpy change $ \\Delta H $ and the entropy change $ \\Delta S $ — you can now predict whether any reaction in the universe will run, how far it will go, and where it will finally rest. That is the whole power of thermodynamics in one move. Next, in Chapter 6, Chemical Equilibrium, we study that settled resting state in full — what $ K $ really measures, and how the balance shifts when you disturb it.*" },
  ];
}

bw.withDb(async (db) => {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error('book not found');

  if (await pages.findOne({ book_id: book._id, slug: NEW_SLUG })) {
    console.log(`⚠  ${NEW_SLUG} already exists — skipping (idempotent).`);
    return;
  }

  const blocks = buildBlocks();
  const newId = uuidv4();
  const now = new Date();
  const doc = {
    _id: newId, book_id: book._id, chapter_number: CH, page_number: PAGE_NUMBER,
    slug: NEW_SLUG, title: 'Free Energy & Equilibrium',
    subtitle: 'A reaction runs only as long as it has free energy left to give. When that reaches zero, it has reached equilibrium.',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'free-energy', 'equilibrium-constant', 'delta-g-standard'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 5 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new thermo page 21 (free energy & equilibrium, final page)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
