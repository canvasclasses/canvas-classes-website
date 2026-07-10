'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Arc A, Page 2.
 * "Lewis Structures & Formal Charge" — the step-by-step method to draw electron-dot
 * structures, plus formal-charge bookkeeping to pick the best one.
 * This is a GAP page: the founder's crash course skips the drawing mechanics, but JEE
 * needs them. Chapter 4 already has page 1 (why-atoms-bond); this inserts at page_number 2
 * and appends to ch4 page_ids (no shifting — it sits after page 1).
 * published:false — founder reviews + generates the pending images, then publishes.
 * Voice: teacher-voice-profile.md (FORMAT v2 — voice is the arc, not catchphrases;
 *   ledger/ownership framing for formal charge; at most one student-voice "sir,…?").
 * Grounded in NCERT Class 11 Ch.4 (Lewis/Kössel) + standard JEE treatment.
 * Run: node scripts/insert_bond_p2_lewis-structures.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 2;
const NEW_SLUG = 'lewis-structures-formal-charge';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A carbon dioxide molecule drawn as an electron-dot structure, dots and bonds glowing',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A large, elegant electron-dot (Lewis) structure of a carbon dioxide molecule, O=C=O, drawn as glowing atoms connected by shared electron pairs shown as small luminous dots, with lone pairs around the oxygen atoms. The structure looks like a clean blueprint or technical schematic floating in space. A faint grid or drafting-table feel suggesting "drawing the structure step by step". Orange and cyan accent glow on the bonds. Clean scientific illustration style. Dark background (#0a0a0a or near-black). No text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'A Picture Worth a Hundred Marks',
      markdown: "Almost every shape, polarity and reactivity question in your exam starts the same way: **draw the structure first.** Get the electron-dot picture right and the rest falls out — geometry, bond angles, which atom is the electron-hungry one. Get it wrong at step one and every answer after it is wrong too. This one skill quietly decides a huge slice of your bonding marks." },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "On the last page you learned the dot symbol for a single atom. Now we join atoms together into a full molecule and draw a **Lewis structure** (also called an **electron-dot structure**) — a map that shows *every* valence electron: which ones are shared as **bonds** (shown as a line, or a pair of dots, between two atoms) and which sit alone as **lone pairs**.\n\n" +
      "The good news: there is a fixed, five-step recipe. It looks fiddly the very first time — but after you draw three molecules it becomes mechanical, the same moves every single time. Let's lock in the steps." },

    // 3 — heading: the five-step method
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Five-Step Method',
      objective: 'Follow a fixed recipe that turns any small molecule or ion into a correct electron-dot structure.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "**Step 1 — Count the total valence electrons.** Add up the valence electrons (= group number) of every atom. Then adjust for charge: an ion with a **negative** charge has *extra* electrons, so **add** one for each unit of negative charge; a **positive** ion is missing electrons, so **subtract** one for each unit of positive charge.\n\n" +
      "*(This is exactly where students slip — they forget to add electrons for the negative charge on an ion. For $\\ce{CO3^2-}$, the 2− means **two extra** electrons. Miss that and your whole structure is two electrons short.)*\n\n" +
      "**Step 2 — Pick the central atom.** The central atom is usually the **least electronegative** one, and it's usually the atom written first in the formula. **Hydrogen and fluorine are never central** — H can hold only one bond, and F is too electronegative to share with several neighbours.\n\n" +
      "**Step 3 — Connect with single bonds.** Draw one single bond (one shared pair) from the central atom to each surrounding atom. Each bond uses 2 of your electrons — subtract them from the total.\n\n" +
      "**Step 4 — Complete the octets of the outer atoms first.** Spread the electrons you have left as **lone pairs** on the **terminal (outer) atoms** until each one has eight (hydrogen is happy at two). Outer atoms get fed before the centre.\n\n" +
      "**Step 5 — Fix the centre with multiple bonds if needed.** If the central atom is still short of an octet, pull a lone pair from a neighbouring atom into the gap to form a **double or triple bond** — that shared pair now counts for *both* atoms. Keep going until the centre also reaches eight." },

    // 4 — image: the 5-step build of CO2
    { id: uuidv4(), order: n(), type: 'image', width: 'two_third', src: '', aspect_ratio: '4:3',
      alt: 'Five-step build of the carbon dioxide Lewis structure, from electron count to final O=C=O',
      caption: 'Building $\\ce{CO2}$ one step at a time — count, connect, fill, then double-bond',
      generation_prompt: 'A clean five-panel step-by-step instructional diagram showing how to build the Lewis structure of carbon dioxide (CO2). Panel 1: "Count electrons" — C with 4 plus two O with 6 each = 16 total valence electrons. Panel 2: "Connect" — O–C–O with single bonds. Panel 3: "Fill outer octets" — lone-pair dots placed around both oxygen atoms. Panel 4: "Check the centre" — carbon shown as electron-deficient, highlighted. Panel 5: "Form double bonds" — final O=C=O structure with two double bonds and two lone pairs on each oxygen, every atom satisfied. Numbered panels left to right, electrons shown as small dots, bonds as lines. Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 5 — heading: worked walk-throughs (CO2, CO3^2-)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Two Walk-Throughs — a Molecule and an Ion',
      objective: 'Run the five steps end-to-end on carbon dioxide, then on a charged polyatomic ion.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Let's run the recipe twice. First $\\ce{CO2}$, a neutral molecule. Then $\\ce{CO3^2-}$ (carbonate), a polyatomic **ion** — so you also see the bracket-and-charge convention exams expect." },

    // 6 — worked example: CO2
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Walk-Through 1 — Carbon Dioxide ($\\ce{CO2}$)',
      problem: "Draw the Lewis structure of carbon dioxide, $\\ce{CO2}$.",
      solution: "**Step 1 — count.** Carbon gives 4, each oxygen gives 6. Total $ = 4 + 2 \\times 6 = 16 $ valence electrons.\n\n" +
        "**Step 2 — central atom.** Carbon is less electronegative than oxygen, so C goes in the middle: O C O.\n\n" +
        "**Step 3 — single bonds.** Draw O–C–O. Two single bonds use $ 2 \\times 2 = 4 $ electrons, leaving $ 16 - 4 = 12 $.\n\n" +
        "**Step 4 — fill the outer atoms.** Put those 12 electrons as lone pairs on the two oxygens: that's 3 lone pairs (6 electrons) on each oxygen. Both oxygens now have 8. But carbon has only 4 (its two single bonds) — short of an octet.\n\n" +
        "**Step 5 — multiple bonds.** Move one lone pair from *each* oxygen into a bond with carbon, making two double bonds. Now carbon shares 8 electrons and each oxygen keeps 2 lone pairs.\n\n" +
        "**Answer:** $ \\ce{O=C=O} $ — two C=O double bonds, two lone pairs on each oxygen. Every atom has a full octet. ✅" },

    // 7 — worked example: CO3^2-
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Walk-Through 2 — Carbonate Ion ($\\ce{CO3^2-}$)',
      problem: "Draw the Lewis structure of the carbonate ion, $\\ce{CO3^2-}$.",
      solution: "**Step 1 — count, and mind the charge.** Carbon gives 4, three oxygens give $ 3 \\times 6 = 18 $. The 2− charge **adds 2 more**. Total $ = 4 + 18 + 2 = 24 $ valence electrons. *(Forget those 2 and you'll end up 2 electrons short — the classic slip.)*\n\n" +
        "**Step 2 — central atom.** Carbon is least electronegative → C in the centre with three oxygens around it.\n\n" +
        "**Step 3 — single bonds.** Three C–O single bonds use $ 3 \\times 2 = 6 $ electrons, leaving $ 24 - 6 = 18 $.\n\n" +
        "**Step 4 — fill the outer atoms.** Place those 18 electrons as lone pairs on the three oxygens (3 lone pairs each). All three oxygens reach 8, but carbon has only 6 — short by 2.\n\n" +
        "**Step 5 — one double bond.** Move one lone pair from *one* oxygen into a double bond with carbon. Carbon now has 8; that oxygen keeps 2 lone pairs.\n\n" +
        "**Answer:** carbon double-bonded to one oxygen and single-bonded to the other two, with the whole thing inside brackets carrying a 2− charge written outside: $ [\\ce{CO3}]^{2-} $. The two single-bonded oxygens carry the negative charge. ✅\n\n" +
        "*(Notice the double bond could have gone to **any** of the three oxygens — three equally good structures. Hold that thought.)*" },

    // 8 — heading: formal charge
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Formal Charge — Electron Bookkeeping',
      objective: 'Compute formal charge to decide which of several possible structures is the best one.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Sometimes the recipe gives you more than one valid-looking structure. How do you tell which is *right*? You do a quick audit of **who really owns how many electrons.** That audit is the **formal charge**.\n\n" +
      "Think of it as bookkeeping. Every atom came to the molecule with a certain number of valence electrons — that's what it *should* own. Now count what it *actually* keeps in the finished structure: it keeps **all** of its lone-pair (non-bonding) electrons, but only **half** of each bonding pair (the other half belongs to its partner). The difference between what it brought and what it keeps is its formal charge — and there's one clean formula for it:" },

    // 9 — latex_block: formal charge formula
    { id: uuidv4(), order: n(), type: 'latex_block',
      latex: 'FC = (\\text{valence electrons}) - (\\text{non-bonding electrons}) - \\tfrac{1}{2}(\\text{bonding electrons})',
      label: 'Formal Charge',
      note: 'Valence e⁻ = what the atom brought (group number). Non-bonding = its lone-pair electrons. Bonding = all electrons in its bonds; it keeps half.' },

    // 10 — text: why formal charge matters + the rule
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Why bother? Because formal charge picks the winner. The **best Lewis structure** is the one where:\n\n" +
      "- the formal charges are **as close to zero as possible**, and\n" +
      "- any **negative** formal charge sits on the **most electronegative** atom (the atom that genuinely pulls electrons hardest).\n\n" +
      "A structure dripping with large + and − formal charges is nature telling you it's the wrong picture." },

    // 11 — reasoning_prompt (mid-page, after formal charge is taught)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "For the carbon dioxide structure $ \\ce{O=C=O} $, what is the formal charge on the central carbon atom? (Carbon brought 4 valence electrons; it has 0 lone-pair electrons and 8 electrons in its four bonds.)",
      options: [
        "+2, because carbon is sharing eight electrons it doesn't fully own",
        "0, because 4 − 0 − ½(8) = 0",
        "−2, because carbon gained four extra shared electrons",
        "+4, equal to its group number"
      ],
      correct_index: 1,
      reveal: "Plug into the formula: $ FC = 4 - 0 - \\tfrac{1}{2}(8) = 4 - 0 - 4 = 0 $. Carbon keeps half of its 8 bonding electrons (= 4), exactly what it brought, so its formal charge is zero. Run the same audit on each oxygen — 6 − 4 − ½(4) = 0 — and every atom in $ \\ce{O=C=O} $ comes out at zero. All-zero formal charges is a strong signal this is the right structure." },

    // 12 — worked example: formal charge picks CO structure / the CO case
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Worked Example — Formal Charge in Carbon Monoxide ($\\ce{CO}$)',
      problem: "Carbon monoxide is drawn with a triple bond: $ \\ce{:C#O:} $ — carbon has one lone pair, oxygen has one lone pair, and three shared bonds between them. Find the formal charge on each atom, and say what they tell you.",
      solution: "Audit each atom with $ FC = V - (\\text{lone-pair e}^-) - \\tfrac{1}{2}(\\text{bonding e}^-) $.\n\n" +
        "**Carbon:** brought 4. It has 1 lone pair (2 electrons) and 6 bonding electrons (the triple bond).\n\n" +
        "$ FC_C = 4 - 2 - \\tfrac{1}{2}(6) = 4 - 2 - 3 = -1 $\n\n" +
        "**Oxygen:** brought 6. It also has 1 lone pair (2 electrons) and the same 6 bonding electrons.\n\n" +
        "$ FC_O = 6 - 2 - \\tfrac{1}{2}(6) = 6 - 2 - 3 = +1 $\n\n" +
        "**Reading the result:** the charges sum to $ -1 + (+1) = 0 $, matching the neutral molecule — a good check. But notice the oddity: the **negative** formal charge sits on **carbon**, even though oxygen is the more electronegative atom. That mismatch is exactly why carbon monoxide is unusual and reactive — it's the famous textbook case where formal charge and electronegativity disagree.\n\n" +
        "**Answer:** $ FC_C = -1 $, $ FC_O = +1 $. ✅" },

    // 13 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Recipe + The Audit',
      markdown: "**Drawing:** count valence electrons (add for −, subtract for +) → least-electronegative atom in the centre (never H or F) → single bonds → fill the *outer* atoms' octets first → multiple-bond the centre if it's still short.\n\n" +
        "**Choosing:** the best structure has formal charges nearest zero, with any negative charge on the most electronegative atom. $ FC = V - (\\text{non-bonding e}^-) - \\tfrac{1}{2}(\\text{bonding e}^-) $." },

    // 14 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Examiners test formal charge as the tiebreaker.** Three ways it shows up:\n\n" +
        "**\"Which structure is most stable / contributes most?\"** → compute formal charges and pick the one nearest zero, with any negative charge on the more electronegative atom.\n\n" +
        "**\"Find the formal charge on the underlined atom.\"** → straight plug-in of $ V - (\\text{lone-pair e}^-) - \\tfrac{1}{2}(\\text{bonding e}^-) $. The single biggest error is double-counting bonding electrons — remember the atom keeps only **half**.\n\n" +
        "**The carbon monoxide trick:** they love asking why $ \\ce{CO} $ carries a negative formal charge on carbon, not oxygen — because the triple bond forces it, even though oxygen is more electronegative." },

    // 15 — inline_quiz (§3.6.1) — LAST content-test block
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'When drawing the Lewis structure of a negatively charged ion such as $\\ce{NO3^-}$, how do you adjust the total valence-electron count for the charge?',
          options: [
            'Subtract one electron for each unit of negative charge',
            'Add one electron for each unit of negative charge',
            'Leave the count unchanged — charge does not affect electrons',
            'Double the electron count for any charged species'
          ],
          correct_index: 1,
          explanation: 'A negative charge means the ion carries extra electrons, so you add one electron per unit of negative charge. Subtracting is the rule for positive ions; ignoring the charge (the most common slip) leaves the structure short of electrons.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'In the sulfate ion, an oxygen atom is bonded to sulfur by a single bond and carries three lone pairs. What is the formal charge on that oxygen? (Oxygen brought 6 valence electrons.)',
          options: [
            '+1, because it is sharing electrons with sulfur',
            '0, because all its electrons are paired',
            '−1, because 6 − 6 − ½(2) = −1',
            '−2, because it holds three lone pairs'
          ],
          correct_index: 2,
          explanation: 'Apply $ FC = 6 - 6 - \\tfrac{1}{2}(2) = 6 - 6 - 1 = -1 $: six non-bonding electrons (three lone pairs) and one bonding pair, of which it keeps half. The −2 answer wrongly counts the lone pairs as the charge; charge comes from the full formula, not the lone-pair count.' },
        { id: uuidv4(), difficulty_level: 3,
          question: 'Two Lewis structures are proposed for the same molecule. Structure X has every atom at formal charge zero; structure Y has a +1 on one atom and a −1 on a less electronegative atom. Which is the better structure, and why?',
          options: [
            'Structure Y, because separating charge always makes a molecule more stable',
            'Structure X, because formal charges closest to zero indicate the most stable, preferred structure',
            'Both are equally good, since formal charge has no bearing on stability',
            'Structure Y, because the negative charge sits on the less electronegative atom'
          ],
          correct_index: 1,
          explanation: 'The preferred structure keeps formal charges as near zero as possible, so the all-zero structure X wins. Structure Y is doubly bad: it separates charge, and it parks the negative charge on the *less* electronegative atom — the opposite of what a good structure does.' },
      ] },

    // 16 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*Remember the carbonate ion, where the double bond could sit on any of three oxygens — three equally good structures, each with the same formal charges? When one Lewis picture isn't enough and the real molecule is a blend of several, that's **resonance** — and it's exactly where we go next.*" },
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
    slug: NEW_SLUG, title: 'Lewis Structures & Formal Charge',
    subtitle: 'A five-step recipe for any electron-dot structure, plus formal-charge bookkeeping to pick the best one.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'lewis-structures', 'formal-charge'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  // Wire into chapter 4 page_ids (append; page 2 sits after page 1).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 2 (lewis structures & formal charge)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
