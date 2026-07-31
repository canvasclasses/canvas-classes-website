'use strict';
/**
 * Class 11 Chemistry (ncert-simplified), Chapter 1 "Some Basic Concepts of
 * Chemistry" — a NEW page: "Principle of Atom Conservation (POAC)"
 * (founder-requested, 2026-07-25).
 *
 * WHAT THIS IS: a competitive-exam-only stoichiometry shortcut (not NCERT
 * syllabus). Inserted right after 'equivalent-concept' and right before
 * 'percentage-labelling-oleum' — the two pages immediately following this one
 * are themselves classic POAC applications, so this page is deliberately the
 * technique lesson that sets those two up.
 *
 * The whole page is tagged tier: 'competitive' on every block (including the
 * hero/intro) per BOOK_PAGE_WORKFLOW.md §14's explicit "whole competitive-
 * only topics — tag their content blocks competitive" rule. A visible
 * scope-note callout (matching the precedent set by the Math book's "JEE
 * enrichment" scope notes, see scripts/math11-book/reconcile_ch4_syllabus_note.js)
 * makes this legible to students immediately, since tier enforcement itself
 * is Phase 0 (tagged, not yet filtered/paywalled).
 *
 * CONTENT SOURCE: the founder supplied three worked problems from a
 * copyrighted JEE reference book (photographed pages) — the exact problems
 * (compounds, given numbers) are reused as explicitly requested ("examples
 * which must be solved using this same method"), but every explanation and
 * solution below was independently re-derived and re-verified from scratch
 * this session and written in this book's own voice/structure — none of the
 * source book's prose, phrasing, or exposition was copied. All three answers
 * were checked against the founder's reference and match: 1.14 g, 11.6 g,
 * 0.55 g (see chat verification). LaTeX uses single `$...$` only per
 * CLAUDE.md §4; no ALL-CAPS emphasis per BOOK_PAGE_WORKFLOW.md §3.5 (bold
 * instead).
 *
 * Purely additive: a brand-new page + one new entry SPLICED (not appended)
 * into the book's chapter-1 page_ids array, right after 'equivalent-concept'.
 * Idempotent (skip-if-exists by slug).
 * Run: node scripts/insert_ch1_poac_page.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CHAPTER_NUMBER = 1;
const PAGE_SLUG = 'principle-of-atom-conservation';
const ANCHOR_SLUG = 'equivalent-concept'; // new page is inserted right after this one

const T = 'competitive';
const b = (type, order, extra) => ({ id: uuidv4(), type, order, tier: T, ...(extra || {}) });
const worked = (order, label, problem, solution) =>
  b('worked_example', order, { label, variant: 'solved_example', problem, solution, reveal_mode: 'tap_to_reveal' });

const blocks = [
  b('image', 0, {
    src: '', alt: 'A single row of identical small spheres flowing unchanged through abstract vessel shapes, entering one molecular cluster and emerging as part of a different one',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Hand-drawn technical illustration in muted earthy tones (ochre, teal, sage green, indigo, cream) on a deep ' +
      'charcoal near-black background with a warm orange accent glow. A single row of small identical spheres ' +
      '(representing one type of atom) flows unchanged through a sequence of three abstract flask/vessel silhouettes ' +
      'connected by a dotted path, entering as part of one molecular cluster shape on the left and re-emerging as ' +
      'part of a different molecular cluster shape on the right — the same number of spheres highlighted with a thin ' +
      'orange outline at both ends to show they are conserved. Clean, flat, textbook-illustration style, no glow ' +
      'bloom, no neon, no 3D-render look, no readable text or numbers.',
  }),
  b('text', 1, {
    markdown:
      "Every stoichiometry problem you've solved so far has followed the same routine: write the balanced equation, " +
      'read off the mole ratio, then convert to mass or volume. That works, but it has a hidden cost — you need the ' +
      'full balanced equation every time, even when a problem quietly hides two or three reactions inside one question.\n\n' +
      "There's a shortcut that skips this entirely. It rests on one simple fact: atoms don't get created or destroyed " +
      'in a chemical change, they only get rearranged. If an element walks into a reaction — or a whole chain of ' +
      'reactions — as part of one compound, and walks out as part of another, the **number of atoms** of that element ' +
      'is exactly the same at both ends, even if you never write down, or even know, what happened in between.\n\n' +
      'This is the **Principle of Atom Conservation**, usually shortened to **POAC**. It turns a multi-step ' +
      'stoichiometry problem into a single line: moles of an element in what you start with equal moles of that same ' +
      'element in what you end with. No balancing, no reaction pathway, no intermediate compounds to track.',
  }),
  b('callout', 2, {
    variant: 'note',
    title: 'A Note on Scope',
    markdown:
      'POAC is a **competitive-exam technique** — it shows up constantly in JEE and NEET stoichiometry problems, ' +
      'especially ones that chain two or three reactions together or hide a mixture inside the question. It is not ' +
      "part of the NCERT syllabus and won't appear in a board exam. If boards are your only target right now, you can " +
      "skip this page entirely — nothing later in this book assumes you've read it. If you're preparing for JEE/NEET, " +
      "it's worth the extra half hour: the two pages right after this one (oleum and $\\ce{H2O2}$ strength) both lean " +
      'on exactly this trick.',
  }),
  b('heading', 3, { text: "The Idea: Atoms Don't Disappear", level: 2 }),
  b('text', 4, {
    markdown:
      'Take a simple decomposition: $\\ce{KClO3 ->[\\Delta] KCl + O2}$. Suppose you know a certain mass of ' +
      '$\\ce{KClO3}$ was decomposed and you want the mass of $\\ce{KCl}$ produced — but you don\'t want to balance ' +
      'the equation with coefficients or think about how much $\\ce{O2}$ comes out along the way.\n\n' +
      'Look only at the potassium. Every $\\ce{K}$ atom that starts inside $\\ce{KClO3}$ ends up inside $\\ce{KCl}$ — ' +
      'none is lost, none is created, and no other product in this reaction contains potassium. So:\n\n' +
      '$\\text{moles of K in } \\ce{KClO3} = \\text{moles of K in } \\ce{KCl}$\n\n' +
      'Since each formula unit of $\\ce{KClO3}$ carries exactly one $\\ce{K}$ atom, and each formula unit of ' +
      '$\\ce{KCl}$ also carries exactly one, this becomes a direct statement about the compounds themselves:\n\n' +
      '$\\text{moles of } \\ce{KClO3} = \\text{moles of } \\ce{KCl}$\n\n' +
      '$\\frac{w(\\ce{KClO3})}{M(\\ce{KClO3})} = \\frac{w(\\ce{KCl})}{M(\\ce{KCl})}$\n\n' +
      'That one line gives you the full weight relationship between reactant and product — without ever writing a ' +
      'stoichiometric coefficient.',
  }),
  b('text', 5, {
    markdown:
      'Now apply the same idea to oxygen — but this time each side carries a **different** number of $\\ce{O}$ atoms ' +
      'per formula unit, so the moles have to be weighted accordingly. $\\ce{KClO3}$ carries 3 oxygens; $\\ce{O2}$ ' +
      'carries 2.\n\n' +
      '$\\text{moles of O in } \\ce{KClO3} = \\text{moles of O in } \\ce{O2}$\n\n' +
      '$3 \\times \\text{moles of } \\ce{KClO3} = 2 \\times \\text{moles of } \\ce{O2}$\n\n' +
      '$3 \\times \\frac{w(\\ce{KClO3})}{M(\\ce{KClO3})} = 2 \\times \\frac{V(\\ce{O2})\\ \\text{at NTP}}{22400\\ \\text{mL}}$\n\n' +
      'Same trick, but now it links a mass to a **gas volume** instead of another mass. Whichever atom you choose to ' +
      'track, the setup always has the same shape: (atoms of that element per formula unit) × (moles of the compound), ' +
      'set equal on both sides.',
  }),
  b('callout', 6, {
    variant: 'remember',
    title: 'The General Rule',
    markdown:
      'For any element that appears somewhere in what you start with and somewhere in what you end with — no matter ' +
      'how many reactions or unnamed intermediate compounds sit in between — moles of that element are conserved:\n\n' +
      '$\\text{(atoms per formula unit)} \\times \\text{moles of starting compound} = \\text{(atoms per formula unit)} ' +
      '\\times \\text{moles of ending compound}$\n\n' +
      'Pick an element that survives the whole journey unchanged in identity — never split across two different ' +
      'products, never merged in from a second source — and this one line replaces the entire balanced equation.',
  }),
  b('heading', 7, { text: 'Why POAC Often Beats the Full Method', level: 2 }),
  b('text', 8, {
    markdown:
      'The full mole-ratio method needs three things: a balanced equation, the right stoichiometric coefficients, and ' +
      '(if the reaction happens in several steps) every intermediate equation balanced too. POAC needs only one: an ' +
      'element that survives, unchanged in identity, from your starting compound to your final compound.\n\n' +
      "That difference matters most in three situations you'll meet constantly in JEE/NEET numericals: when a problem " +
      'hides two or three reactions inside one question and never asks you to find the intermediate compound; when a ' +
      'mixture of two substances is converted to one product and you\'d otherwise need two separate stoichiometric ' +
      "setups; and when you're simply asked to jump from one compound's mass to another's, with no interest in " +
      'anything that happened between them. In all three, balancing every equation is extra work POAC lets you skip.',
  }),
  worked(
    9,
    'Example — Mass of NaH₂PO₄ from a Gravimetric Phosphorus Determination',
    'In a gravimetric determination of phosphorus, a solution containing $\\ce{H2PO4-}$ ions is treated with ' +
      'magnesium and ammonium ions to precipitate $\\ce{Mg(NH4)PO4 . 6H2O}$. This precipitate is then heated and ' +
      'decomposed to magnesium pyrophosphate, $\\ce{Mg2P2O7}$, which is weighed. A solution of $\\ce{NaH2PO4}$ ' +
      'yielded $1.054$ g of $\\ce{Mg2P2O7}$. What mass of $\\ce{NaH2PO4}$ was present originally?\n\n' +
      '(Na = 23, H = 1, P = 31, O = 16, Mg = 24)',
    '**Step 1 — Find the one atom that survives the whole journey.**\n\n' +
      'Phosphorus starts inside $\\ce{NaH2PO4}$, moves through the precipitate $\\ce{Mg(NH4)PO4 . 6H2O}$, and ends up ' +
      'inside $\\ce{Mg2P2O7}$ — every step keeps it as phosphorus, never splitting it between two separate products. ' +
      'You don\'t need to balance any of those intermediate reactions; you just need $\\ce{P}$ conserved from first ' +
      'compound to last.\n\n' +
      '**Step 2 — Count P atoms per formula unit on each side.**\n\n' +
      '$\\ce{NaH2PO4}$ carries $1$ phosphorus atom per formula unit. $\\ce{Mg2P2O7}$ carries $2$.\n\n' +
      '**Step 3 — Apply POAC.**\n\n' +
      '$\\text{moles of P in } \\ce{NaH2PO4} = \\text{moles of P in } \\ce{Mg2P2O7}$\n\n' +
      '$1 \\times \\text{moles of } \\ce{NaH2PO4} = 2 \\times \\text{moles of } \\ce{Mg2P2O7}$\n\n' +
      '**Step 4 — Plug in molar masses and solve.**\n\n' +
      'Molar mass of $\\ce{NaH2PO4} = 23 + 2(1) + 31 + 4(16) = 120\\ \\text{g/mol}$; molar mass of $\\ce{Mg2P2O7} = ' +
      '2(24) + 2(31) + 7(16) = 222\\ \\text{g/mol}$.\n\n' +
      '$\\frac{w(\\ce{NaH2PO4})}{120} = 2 \\times \\frac{1.054}{222}$\n\n' +
      '$w(\\ce{NaH2PO4}) = 2 \\times \\frac{1.054}{222} \\times 120 = \\boxed{1.14\\ \\text{g}}$\n\n' +
      "**Why this matters:** you never had to write, let alone balance, the precipitation reaction or the " +
      "decomposition reaction. Phosphorus was the thread running through both, and that's all POAC needed.",
  ),
  worked(
    10,
    'Example — Weight of Product from Converting All the Carbon in K₂CO₃',
    '$27.6$ g of $\\ce{K2CO3}$ was treated by a series of reagents so as to convert all of its carbon to ' +
      '$\\ce{K2Zn3[Fe(CN)6]2}$. Calculate the weight of the product.\n\n' +
      '(Molar mass of $\\ce{K2CO3} = 138$ g/mol; molar mass of $\\ce{K2Zn3[Fe(CN)6]2} = 698$ g/mol)',
    '**Step 1 — Find the atom that survives.**\n\n' +
      'The problem tells you directly: **all** of the carbon in $\\ce{K2CO3}$ ends up in $\\ce{K2Zn3[Fe(CN)6]2}$ — ' +
      "carbon is the thread, however many reagents and unnamed reactions the 'series' actually involved.\n\n" +
      '**Step 2 — Count C atoms per formula unit on each side.**\n\n' +
      '$\\ce{K2CO3}$ carries $1$ carbon atom. $\\ce{K2Zn3[Fe(CN)6]2}$ carries $2 \\times 6 = 12$ carbon atoms — two ' +
      '$\\ce{Fe(CN)6}$ units, each with $6$ cyanide carbons.\n\n' +
      '**Step 3 — Apply POAC.**\n\n' +
      '$\\text{moles of C in } \\ce{K2CO3} = \\text{moles of C in } \\ce{K2Zn3[Fe(CN)6]2}$\n\n' +
      '$1 \\times \\text{moles of } \\ce{K2CO3} = 12 \\times \\text{moles of } \\ce{K2Zn3[Fe(CN)6]2}$\n\n' +
      '**Step 4 — Plug in and solve.**\n\n' +
      '$\\text{moles of } \\ce{K2CO3} = \\frac{27.6}{138} = 0.200\\ \\text{mol}$\n\n' +
      '$\\text{moles of product} = \\frac{0.200}{12} = 0.01667\\ \\text{mol}$\n\n' +
      '$w(\\text{product}) = 0.01667 \\times 698 = \\boxed{11.6\\ \\text{g}}$\n\n' +
      '**Why this matters:** counting cyanide carbons correctly (12 per formula unit, not 6) is the only place this ' +
      'problem can trip you up — get that count right, and the rest is a one-line ratio.',
  ),
  worked(
    11,
    'Example — Splitting a CuO–Cu₂O Mixture Using the Copper It All Becomes',
    'A $1$-g mixture of cuprous oxide ($\\ce{Cu2O}$) and cupric oxide ($\\ce{CuO}$) was quantitatively reduced to ' +
      '$0.839$ g of metallic copper. What was the mass of cupric oxide in the original sample?\n\n(Cu = 63.5, O = 16)',
    "**Reading the question — what do we actually have, and what's the plan?**\n\n" +
      '- Given: a $1$ g mixture of two copper oxides, $\\ce{CuO}$ and $\\ce{Cu2O}$, mixed in an unknown ratio; ' +
      'reducing the whole mixture gives $0.839$ g of pure metallic copper.\n' +
      '- Asked: the mass of $\\ce{CuO}$ alone inside that original 1 g.\n' +
      '- The connection: every copper atom, from **both** oxides, ends up in the same product — metallic Cu. That ' +
      'means POAC applies to the two oxides together: (Cu from $\\ce{CuO}$) + (Cu from $\\ce{Cu2O}$) = (Cu in the ' +
      'final metal). Since $\\ce{CuO}$ carries 1 Cu per formula unit and $\\ce{Cu2O}$ carries 2, this becomes one ' +
      'equation in one unknown once you let $x$ be the mass of $\\ce{CuO}$.\n' +
      '- The plan: (1) let $x$ = mass of $\\ce{CuO}$, so $(1-x)$ = mass of $\\ce{Cu2O}$; (2) write POAC for copper as ' +
      'a sum of two contributions; (3) solve the resulting linear equation for $x$.\n\n' +
      '**Step 1 — Set up the two unknowns.**\n\n' +
      'Let $x$ = mass of $\\ce{CuO}$ in grams, so mass of $\\ce{Cu2O}$ = $(1-x)$ g.\n\n' +
      '**Step 2 — Apply POAC for copper, combining both sources.**\n\n' +
      '$1 \\times \\text{moles of } \\ce{CuO} + 2 \\times \\text{moles of } \\ce{Cu2O} = \\text{moles of Cu in the product}$\n\n' +
      '**Step 3 — Plug in molar masses.**\n\n' +
      'Molar mass of $\\ce{CuO} = 63.5 + 16 = 79.5\\ \\text{g/mol}$; molar mass of $\\ce{Cu2O} = 2(63.5) + 16 = ' +
      '143\\ \\text{g/mol}$.\n\n' +
      '$\\frac{x}{79.5} + \\frac{2(1-x)}{143} = \\frac{0.839}{63.5}$\n\n' +
      '**Step 4 — Solve for x.**\n\n' +
      'Multiply through by $79.5 \\times 143 = 11368.5$ to clear both denominators:\n\n' +
      '$143x + 159(1-x) = \\frac{0.839}{63.5} \\times 11368.5 \\approx 150.2$\n\n' +
      '$143x + 159 - 159x = 150.2$\n\n' +
      '$-16x = -8.8 \\implies x = \\boxed{0.55\\ \\text{g of } \\ce{CuO}}$\n\n' +
      '**Why this matters:** whenever a mixture of two substances is reduced (or converted) to a single common ' +
      'product, POAC lets you add their contributions to that one product directly — one equation, one unknown — ' +
      'instead of setting up two separate mole-ratio reactions and solving them as a system.',
  ),
  b('callout', 12, {
    variant: 'note',
    title: 'Where You\'ll Use This Next',
    markdown:
      'Keep POAC close by for the next two pages. **Percentage labelling of oleum** and **volume strength of ' +
      '$\\ce{H2O2}$** are both, underneath the specific vocabulary, ordinary POAC problems — an element that survives ' +
      'a reaction chain unchanged, tracked from a starting mass to a final one.',
  }),
  b('inline_quiz', 13, {
    pass_threshold: 0.67,
    questions: [
      {
        id: uuidv4(),
        question: 'POAC lets you skip balancing the full chemical equation because...',
        options: [
          'atoms of a chosen element are neither created nor destroyed, so their mole count is the same at the start and end of the whole reaction chain',
          'all chemical reactions have the same mole ratio between reactants and products',
          'mass is only conserved for gases, not solids',
          'POAC only works when the reaction is already balanced',
        ],
        correct_index: 0,
        explanation: 'POAC works because moles of a specific element are conserved from start to end, not because of any special property of the reaction itself.',
        difficulty_level: 1,
      },
      {
        id: uuidv4(),
        question: 'Which element would you track with POAC to solve: "$\\ce{Na2CO3}$ is converted, through several unnamed steps, entirely into $\\ce{NaCl}$ — find the mass of $\\ce{NaCl}$ produced from a given mass of $\\ce{Na2CO3}$"?',
        options: [
          'Sodium (Na) — it appears in both the starting and ending compound, unsplit',
          'Carbon (C) — because it started in the reactant',
          'Oxygen (O) — because $\\ce{Na2CO3}$ has the most oxygen atoms',
          'Chlorine (Cl) — because it appears in the final product',
        ],
        correct_index: 0,
        explanation: "Carbon and oxygen are lost as CO2 somewhere along the way and don't appear in NaCl, so tracking them would break the conservation chain. Chlorine only appears in the product, not the reactant, so there's nothing to conserve it against. Sodium is the only element present, unsplit, in both compounds.",
        difficulty_level: 2,
      },
      {
        id: uuidv4(),
        question: 'A mixture of two metal carbonates is fully converted to $\\ce{CO2}$. To find the total moles of $\\ce{CO2}$ released using POAC, what must be true?',
        options: [
          'Each carbonate releases exactly one $\\ce{CO2}$ per formula unit, so total moles of carbonate (from both) equal total moles of $\\ce{CO2}$',
          'The two carbonates must have the same molar mass',
          'Only the carbonate present in the larger amount contributes to the $\\ce{CO2}$ produced',
          'You must know the exact reaction pathway for each carbonate separately',
        ],
        correct_index: 0,
        explanation: 'As long as each carbonate contributes carbon 1:1 to the CO2 produced, POAC lets you add their mole contributions directly — no need to track each carbonate\'s own reaction pathway separately, and their molar masses don\'t need to match.',
        difficulty_level: 3,
      },
    ],
  }),
];

async function main() {
  await bw.withDb(async (db) => {
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const now = new Date();

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book not found: ${BOOK_SLUG}`);

    const existing = await pages.findOne({ book_id: book._id, slug: PAGE_SLUG });
    if (existing) { console.log('page already exists — skipping (idempotent):', PAGE_SLUG); return; }

    const maxPageNumber = await pages
      .find({ book_id: book._id, chapter_number: CHAPTER_NUMBER }, { projection: { page_number: 1 } })
      .sort({ page_number: -1 }).limit(1).toArray();
    const pageNumber = (maxPageNumber[0]?.page_number ?? -1) + 1;

    const doc = {
      _id: uuidv4(),
      book_id: book._id,
      chapter_number: CHAPTER_NUMBER,
      page_number: pageNumber,
      slug: PAGE_SLUG,
      title: 'Principle of Atom Conservation (POAC)',
      subtitle: 'A competitive-exam-only shortcut: track one element through an entire reaction chain and skip ' +
        'balancing every equation. Not required for boards.',
      blocks,
      page_type: 'lesson',
      published: true,
      reading_time_min: bw.computeReadingTime(blocks),
      content_types: bw.computeContentTypes(blocks),
      tags: ['poac', 'competitive', 'stoichiometry-technique', 'atom-conservation'],
      deleted_at: null,
      created_at: now,
      updated_at: now,
    };
    await pages.insertOne(doc);
    console.log('created page', pageNumber, '·', PAGE_SLUG, '·', doc.reading_time_min, 'min ·', blocks.length, 'blocks');

    const anchorPage = await pages.findOne({ book_id: book._id, slug: ANCHOR_SLUG }, { projection: { _id: 1 } });
    if (!anchorPage) throw new Error(`anchor page not found: ${ANCHOR_SLUG}`);

    const chapter = book.chapters.find((c) => c.number === CHAPTER_NUMBER);
    if (!chapter) throw new Error(`chapter not found: ${CHAPTER_NUMBER}`);

    const anchorIdx = chapter.page_ids.indexOf(anchorPage._id);
    if (anchorIdx === -1) throw new Error(`anchor page id not found in chapter.page_ids: ${ANCHOR_SLUG}`);

    const newPageIds = [...chapter.page_ids];
    newPageIds.splice(anchorIdx + 1, 0, doc._id);

    await books.updateOne(
      { _id: book._id, 'chapters.number': CHAPTER_NUMBER },
      { $set: { 'chapters.$.page_ids': newPageIds, updated_at: now } },
    );
    console.log('spliced into chapter', CHAPTER_NUMBER, 'page_ids at index', anchorIdx + 1, '(right after', ANCHOR_SLUG + ')');
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
