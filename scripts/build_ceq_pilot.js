// Chemical Equilibrium (Ch.6) — VOICE-CALIBRATION PILOT: pages 0, 1, 2.
// Creates the opener + "Reversible vs Irreversible" + "Dynamic Equilibrium" in
// the ncert-simplified book, chapter 6 (currently 0 pages), published:false.
//
// Pattern: mirrors createPage13 in add_quantum_sims.js — raw insertOne for a NEW
// page + append _id to book.chapters[ch6].page_ids. Idempotent (slug exists ⇒
// update blocks only). ADDITIVE (new pages; nothing removed) so no content-loss
// risk. Dry-run by default; pass --apply to write.
//   node scripts/build_ceq_pilot.js            # dry-run (prints plan)
//   node scripts/build_ceq_pilot.js --apply    # write
// Rollback: delete the 3 created pages by slug + pull their ids from ch6.page_ids
// (slugs: chemical-equilibrium-opener, reversible-irreversible-reactions,
//  dynamic-equilibrium).
//
// Voice: teacher-voice-profile + CEQ-exemplars (his analogies: 99%-stuck download,
// four-steps-forward, "CO2 doesn't wait for anyone"). Anti-AI-tell rules (§5.X):
// say-it-once, ≤1 em-dash/para, no "not X it's Y" pairs, no reveal framing.

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 6;
const APPLY = process.argv.includes('--apply');

// ── block helpers ───────────────────────────────────────────────────────────
let _o = 0;
const reset = () => { _o = 0; };
const img = (generation_prompt, aspect_ratio = '16:9', caption = '') =>
  ({ id: uuidv4(), type: 'image', order: _o++, src: '', aspect_ratio, caption, generation_prompt });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const heading = (t, objective) => ({ id: uuidv4(), type: 'heading', order: _o++, text: t, level: 2, ...(objective ? { objective } : {}) });
const callout = (variant, title, markdown) => ({ id: uuidv4(), type: 'callout', order: _o++, variant, title, markdown });
const curiosity = (prompt, hint, reveal) => ({ id: uuidv4(), type: 'curiosity_prompt', order: _o++, prompt, ...(hint ? { hint } : {}), ...(reveal ? { reveal } : {}) });
const reasoning = (reasoning_type, prompt, options, reveal, difficulty_level) =>
  ({ id: uuidv4(), type: 'reasoning_prompt', order: _o++, reasoning_type, prompt, options, reveal, difficulty_level });
const quiz = (questions, pass_threshold = 0.6) =>
  ({ id: uuidv4(), type: 'inline_quiz', order: _o++, pass_threshold, questions: questions.map(q => ({ id: uuidv4(), ...q })) });

// ── PAGE 0 — Chapter opener ─────────────────────────────────────────────────
function buildOpener() {
  reset();
  return [
    img('Ultra-wide cinematic 16:5 banner, hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. A vibrant coral reef on the left half slowly fading to a bleached, dissolving reef on the right half; rising bubbles of CO2 dissolving into the seawater; faint hand-lettered equilibrium arrows CO2 + H2O <=> H2CO3 <=> H+ + HCO3- drawn into the water like a chemist sketched them. Calm, uncluttered, scientific-poster feel. No large text blocks.', '16:5'),
    text(
      "Every chemical reaction really asks three separate questions. **What** happens, and in what ratio? **How fast** does it happen? That second question is chemical kinetics. And **how far** does the reaction go before it stops? This chapter is about that third question, and the answer catches most students off guard: the great majority of reactions never actually finish.\n\n" +
      "Instead, they run partway and stall while plenty of reactant is still left in the flask. From the outside the reaction looks finished: reactant and product are both present, and their amounts have stopped changing. This balance point is called **equilibrium**, and learning to control it is what lets you explain why a sealed soft drink keeps its fizz, why the oceans are slowly turning acidic, and how a fertiliser plant gets the most ammonia from nitrogen and hydrogen.\n\n" +
      "By the end of this chapter you will be able to:\n" +
      "- Tell a reversible reaction from a one-way one, and say what makes the difference\n" +
      "- Write the equilibrium constant for any reaction and read what its size tells you\n" +
      "- Predict which way a reaction will move using the reaction quotient $Q$\n" +
      "- Use **Le Chatelier's principle** to push an equilibrium where you want it"
    ),
    curiosity(
      "A sealed tube of brown nitrogen dioxide gas sits on a shelf for years and the colour never changes. Is anything still going on inside the tube, or has the reaction simply stopped?",
      "If two opposite reactions ran at exactly the same speed, what would you see from the outside?",
      "From outside, nothing seems to move. Inside, NO2 molecules are still pairing up into colourless N2O4 and N2O4 is still splitting back into brown NO2 — at exactly matching rates. The colour holds steady not because the reaction stopped, but because both directions are running neck and neck. That is the whole idea of dynamic equilibrium, and the rest of the chapter is built on it."
    ),
    curiosity(
      "Open a cold soft drink and it fizzes politely. Open a warm one and it erupts. The bottle was sealed the same way both times — so what does temperature have to do with how much gas the liquid was holding?",
      "Was the dissolved CO2 in the warm bottle at the same equilibrium as in the cold one?"
    ),
  ];
}

// ── PAGE 1 — Reversible vs Irreversible ─────────────────────────────────────
function buildReversible() {
  reset();
  return [
    img('Hand-drawn coloured illustration, deep charcoal background, warm muted palette, ink line work + gouache fills, no glow/neon. Split panel. LEFT: a sealed glass tube of brown gas with a curved double arrow (forward and back) and the label "runs both ways", brown fading to colourless and back. RIGHT: an open beaker where a gas escapes upward into the air with a single one-way arrow and a white precipitate settling at the bottom, label "no way back". Clean science-notebook style, hand-lettered labels.', '16:9'),
    callout('fun_fact', 'The Reaction That Changes Its Mind',
      "Seal some brown nitrogen dioxide gas in a tube and cool it. The brown colour fades as the gas pairs up into colourless $N_2O_4$. Warm the tube and the brown comes back. You can run this trick back and forth all day. The reaction has no fixed finish line, and it goes whichever way the conditions push it."),
    img('Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. A single sealed glass test tube shown at three moments in time, left to right. At t=0 the tube is full of deep reddish-brown gas (pure NO2). A little later the brown has faded to a medium brown as some gas pairs up. At equilibrium the tube holds a steady pale-brown mixture whose colour no longer changes. A small hand-drawn molecular inset shows two bent brown NO2 molecules joining into one colourless N2O4 molecule. Hand-lettered reaction "2NO2 (brown) <=> N2O4 (colourless)" above the tubes, and a label "colour stops changing = equilibrium" under the last tube. Clean science-notebook feel, neat hand-lettered labels.',
      '16:9',
      'Sealed in a tube, brown NO₂ keeps pairing into colourless N₂O₄ until the colour settles to a steady shade — that steady point is equilibrium.'),
    text(
      "You have probably watched a download crawl to 99% and freeze there. Frustrating, but it is exactly how most chemical reactions behave. They do not run cleanly to 100% products. They reach some point and stall, with both reactants and products still sitting in the flask.\n\n" +
      "The reason is that the products can react back. A **reversible reaction** runs in both directions at once, written with a double arrow $\\rightleftharpoons$. The left-to-right change is the **forward reaction**; the right-to-left change is the **backward reaction**. Some everyday examples:\n" +
      "- $N_2O_4 \\rightleftharpoons 2NO_2$\n" +
      "- $H_2 + I_2 \\rightleftharpoons 2HI$\n" +
      "- $N_2 + 3H_2 \\rightleftharpoons 2NH_3$ (the ammonia synthesis)\n" +
      "- $PCl_5 \\rightleftharpoons PCl_3 + Cl_2$\n" +
      "- $CaCO_3(s) \\rightleftharpoons CaO(s) + CO_2(g)$, in a closed container\n\n" +
      "A handful of reactions really do go to completion. We call those **irreversible**, written with a single arrow $\\rightarrow$."
    ),
    heading('What makes a reaction one-way?', 'Identify why a reaction is irreversible and recognise that equilibrium needs a closed system.'),
    text(
      "A reaction can only reach equilibrium if the products stay in the pot, ready to react back. Take that chance away and the reaction is forced one way:\n\n" +
      "1. **A product escapes as a gas.** Heat potassium chlorate in an open dish and the oxygen leaves the moment it forms: $2KClO_3 \\rightarrow 2KCl + 3O_2\\uparrow$. The gas does not wait for anyone. Once it is gone, there is nothing left to run the reaction backward.\n" +
      "2. **A product drops out as a precipitate.** $BaCl_2 + Na_2SO_4 \\rightarrow BaSO_4\\downarrow + 2NaCl$. The barium sulphate falls out of solution as a solid and is no longer free to react.\n" +
      "3. **A very stable product forms**, like water in a neutralisation: $H_2SO_4 + 2NaOH \\rightarrow Na_2SO_4 + 2H_2O$.\n\n" +
      "Notice the same $CaCO_3$ reaction is reversible in a sealed tube but one-way in an open kiln, where the $CO_2$ drifts off. So reversibility depends not just on the chemicals, but on whether the container is closed."
    ),
    reasoning('logical',
      "Without doing any calculation, which of these reactions can settle into an equilibrium, and which is forced to run only one way?\n\n(i) $AgNO_3(aq) + NaCl(aq) \\rightarrow AgCl\\downarrow + NaNO_3(aq)$\n(ii) $H_2(g) + I_2(g) \\rightleftharpoons 2HI(g)$ in a sealed flask\n(iii) $Zn(s) + 2HCl(aq) \\rightarrow ZnCl_2(aq) + H_2\\uparrow$ in an open beaker",
      [
        "All three can reach equilibrium, because every reaction is reversible in principle",
        "Only (ii) — (i) loses a product as a solid and (iii) loses one as an escaping gas, so both are forced one-way",
        "Only (i) and (iii), because making a gas or a solid is what equilibrium means",
        "None of them, because all are written with mixed arrows",
      ], 1,
      "Look for an escape route for the products. In (i) the AgCl leaves the solution as a precipitate; in (iii) the hydrogen gas bubbles away from an open beaker. In both, the products cannot react back, so the reaction goes to completion. Only (ii) keeps everything trapped together in a closed flask, so the forward and backward reactions can balance and reach equilibrium.", 2),
    callout('exam_tip', 'JEE / NEET — Spotting a Reversible Reaction',
      "**The one rule:** a reaction can reach equilibrium only in a **closed system**, where no product can escape.\n\n" +
      "- A reaction that throws out a **gas** (open vessel) or a **precipitate** runs to completion.\n" +
      "- An all-aqueous reaction with no precipitate, and a gas-phase reaction in a **sealed** vessel, can reach equilibrium.\n" +
      "- **Classic trap:** $CaCO_3 \\rightleftharpoons CaO + CO_2$ is given as reversible. It is — but only if the container is closed. Examiners switch 'closed' to 'open' to flip the answer. Read the vessel, not just the equation."),
    quiz([
      {
        question: "Which statement about a reversible reaction is correct?",
        options: [
          "The forward reaction stops once the backward reaction begins",
          "Both forward and backward reactions occur at the same time",
          "It always goes 100% to products",
          "It can only happen in an open container",
        ], correct_index: 1,
        explanation: "In a reversible reaction the forward and backward changes happen together, in the same vessel, at the same time. Neither one waits for the other to finish.",
      },
      {
        question: "Why does $2KClO_3 \\rightarrow 2KCl + 3O_2\\uparrow$ in an open dish go to completion?",
        options: [
          "Because potassium chlorate is a very weak compound",
          "Because the oxygen gas escapes, so the products cannot react back",
          "Because solids can never reach equilibrium",
          "Because the reaction is exothermic",
        ], correct_index: 1,
        explanation: "The oxygen leaves the open dish as it forms. With a product gone, there is nothing to drive the backward reaction, so the change is one-way. In a sealed vessel the same reaction could reach equilibrium.",
      },
      {
        question: "A reaction reaches equilibrium only when it is carried out in a:",
        options: ["open system", "closed system", "vacuum", "very large vessel"], correct_index: 1,
        explanation: "Equilibrium needs every species kept together so the backward reaction has reactants to work with. That requires a closed system — nothing added, nothing allowed to escape.",
      },
    ]),
  ];
}

// ── PAGE 2 — Dynamic Equilibrium ────────────────────────────────────────────
function buildDynamic() {
  reset();
  return [
    img('Hand-drawn coloured illustration, deep charcoal background, warm muted palette, ink + gouache, no glow. Centre: a single figure shown mid-stride walking four steps right then four steps left, faint motion trails both ways, ending back where it started, with a small "net displacement = 0" hand-note. Around it, tiny molecule icons converting both directions (reactant->product and product->reactant) along matching arrows of equal thickness. Science-notebook feel, hand-lettered.', '16:9'),
    callout('fun_fact', 'Four Steps Forward, Four Steps Back',
      "Walk four steps forward, then four steps back, over and over. How far have you travelled? Zero. Were you ever standing still? Not for a second. A reaction at equilibrium is doing exactly this — busy in both directions, going nowhere on the outside."),
    text(
      "Start a reversible reaction with only reactants in the flask. At that first instant the forward reaction is fast (plenty of reactant) and the backward reaction is zero (no product yet). As products build up, two things happen together: the forward reaction slows down because reactant is being used up, and the backward reaction speeds up because there is now product to react. Sooner or later the two rates become equal.\n\n" +
      "That meeting point is **equilibrium**. From here, the forward and backward reactions run at the **same rate**, so the amount of every substance stops changing. The reaction has not stopped. It is converting reactant to product and product back to reactant at matching speeds, so the books always balance."
    ),
    img('Two side-by-side line graphs, hand-drawn on deep charcoal, clean axes, hand-lettered labels, warm colours. LEFT graph "Rate vs Time": a forward-rate curve starting high and falling, a backward-rate curve starting at zero and rising, the two meeting and then running together as one flat line, with the meeting point labelled "equilibrium: rate_forward = rate_backward". RIGHT graph "Concentration vs Time": reactant curve falling and product curve rising, both levelling off to constant (but different) heights, with a dashed vertical line marking where they flatten, labelled "concentrations constant, not equal".', '16:9'),
    heading('Why we call it "dynamic"', 'Explain what is still happening at equilibrium and read rate and concentration graphs.'),
    text(
      "**Dynamic** means moving. At equilibrium the molecules never freeze. If you could tag one molecule and follow it, you would watch it flip from reactant to product and back again, many times over. Experiments with labelled atoms confirm this: the conversions keep going long after the concentrations have settled.\n\n" +
      "So the calm you see is a busy stalemate. The forward and backward reactions are both running flat out. They just happen to be perfectly matched, so nothing is left over on either side and the overall amounts hold steady."
    ),
    reasoning('logical',
      "At equilibrium for $H_2 + I_2 \\rightleftharpoons 2HI$, a student claims the flask must contain equal amounts of $H_2$, $I_2$ and $HI$ because the reaction has 'balanced'. Are they right?",
      [
        "Yes — equilibrium means the concentrations of reactants and products are equal",
        "No — equilibrium means the forward and backward rates are equal; the concentrations are merely constant, and are usually not equal to each other",
        "Yes, but only for gas-phase reactions",
        "No — at equilibrium all the reactant has been used up",
      ], 1,
      "This is the most common slip in the chapter. 'Balanced' refers to the rates, not the amounts. At equilibrium the forward rate equals the backward rate, which makes every concentration constant — but those constant values are almost always different from one another. Equal rates, not equal amounts.", 2),
    callout('exam_tip', 'JEE / NEET — Reading Equilibrium',
      "- At equilibrium, **rate(forward) = rate(backward)**. This is the definition. Equal **rates**, not equal **concentrations**.\n" +
      "- Concentrations become **constant**, and are generally **unequal**.\n" +
      "- On a **rate-vs-time** graph the two curves must **meet and merge**. On a **concentration-vs-time** graph the curves **flatten** at different heights.\n" +
      "- Equilibrium can be reached from **either side** — start with pure reactant or pure product and you land at the same equilibrium mixture (same temperature).\n" +
      "- A catalyst makes equilibrium arrive **sooner** but does not change where it sits."),
    quiz([
      {
        question: "At equilibrium, which quantities are equal?",
        options: [
          "The concentrations of reactants and products",
          "The rates of the forward and backward reactions",
          "The masses of reactants and products",
          "Nothing — everything has stopped",
        ], correct_index: 1,
        explanation: "Equilibrium is defined by equal forward and backward rates. That keeps concentrations constant, but those constant concentrations are usually not equal to each other.",
      },
      {
        question: "Which best describes the word 'dynamic' in dynamic equilibrium?",
        options: [
          "The reaction has completely stopped",
          "Only the forward reaction is still running",
          "Forward and backward reactions both keep running, at equal rates",
          "The temperature keeps changing",
        ], correct_index: 2,
        explanation: "Dynamic means both reactions are still going. They run at the same rate, so the visible amounts hold steady even though molecules are constantly converting both ways.",
      },
      {
        question: "On a graph of reaction rate versus time, equilibrium is the point where:",
        options: [
          "both rate curves drop to zero",
          "the forward and backward rate curves meet and then stay together",
          "the forward rate becomes maximum",
          "the curves cross and then move apart",
        ], correct_index: 1,
        explanation: "The forward rate falls and the backward rate rises until they become equal. From that moment the two curves run together as one steady line — that is equilibrium.",
      },
    ]),
  ];
}

// ── page descriptors ────────────────────────────────────────────────────────
const PAGES = [
  { page_number: 0, slug: 'chemical-equilibrium-opener', page_type: 'chapter_opener',
    title: 'Chemical Equilibrium',
    subtitle: "Most reactions never reach the finish line. They stall halfway, in a tense and living balance that quietly runs everything from the fizz in a soft drink to the oxygen in your blood.",
    build: buildOpener },
  { page_number: 1, slug: 'reversible-irreversible-reactions', page_type: 'lesson',
    title: 'Reversible and Irreversible Reactions',
    subtitle: 'Why some reactions can run backwards, and some can never go home.',
    build: buildReversible },
  { page_number: 2, slug: 'dynamic-equilibrium', page_type: 'lesson',
    title: 'Dynamic Equilibrium',
    subtitle: "At equilibrium nothing looks like it is happening, and everything is.",
    build: buildDynamic },
];

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const booksCol = db.collection('books');
  const pagesCol = db.collection('book_pages');

  const book = await booksCol.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
  const chapterIndex = (book.chapters || []).findIndex(c => c.number === CH);
  if (chapterIndex === -1) throw new Error(`chapter ${CH} not found in book.chapters`);

  console.log(`Book ${BOOK_SLUG} · Chapter ${CH} "${book.chapters[chapterIndex].title}" — currently ${(book.chapters[chapterIndex].page_ids || []).length} pages`);
  console.log(APPLY ? '\n=== APPLY ===' : '\n=== DRY-RUN (pass --apply to write) ===');

  let pageIds = [...(book.chapters[chapterIndex].page_ids || [])];

  for (const P of PAGES) {
    const blocks = P.build();
    const existing = await pagesCol.findOne({ book_id: String(book._id), slug: P.slug });
    console.log(`\n— p${P.page_number} "${P.slug}" (${P.page_type}) — ${blocks.length} blocks${existing ? ' [EXISTS → would update blocks]' : ' [NEW]'}`);
    blocks.forEach(b => console.log(`    [${String(b.order).padStart(2)}] ${b.type}${b.variant ? '/' + b.variant : ''} :: ${(b.title || b.text || b.prompt || (b.markdown || '').slice(0, 50) || b.generation_prompt || '').toString().replace(/\s+/g, ' ').slice(0, 52)}`));

    if (!APPLY) continue;

    if (existing) {
      await pagesCol.updateOne({ _id: existing._id }, { $set: { blocks, title: P.title, subtitle: P.subtitle, page_type: P.page_type, updated_at: new Date() } });
      console.log(`    ✓ updated ${existing._id}`);
      if (!pageIds.includes(existing._id)) pageIds.push(existing._id);
    } else {
      const _id = uuidv4();
      await pagesCol.insertOne({
        _id, book_id: String(book._id), chapter_number: CH, page_number: P.page_number,
        slug: P.slug, title: P.title, subtitle: P.subtitle, page_type: P.page_type,
        blocks, tags: [], published: false, reading_time_min: Math.max(2, Math.round(blocks.length * 0.8)),
        created_at: new Date(), updated_at: new Date(),
      });
      pageIds.push(_id);
      console.log(`    ✓ created ${_id}`);
    }
  }

  if (APPLY) {
    await booksCol.updateOne({ _id: book._id }, { $set: { [`chapters.${chapterIndex}.page_ids`]: pageIds, updated_at: new Date() } });
    console.log(`\n✓ chapter ${CH} now linked to ${pageIds.length} page(s).`);
  } else {
    console.log('\nDRY-RUN complete. Re-run with --apply to create the pages (published:false).');
  }
  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
