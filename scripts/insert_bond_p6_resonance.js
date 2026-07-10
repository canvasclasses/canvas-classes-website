'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 6.
 * "Resonance — One Molecule, Many Pictures" (resonance structures, resonance
 * hybrid, resonance energy, bond order from resonance).
 * Inserts at chapter_number 4, page_number 6, appends to ch4 page_ids.
 * published:false — founder reviews + generates the 2 pending images, then publishes.
 * Voice: BOND-exemplars.md (the "danda" rant §A; bond-order counting chant §B,
 * exemplars #8, #21) + teacher-voice-profile.md (FORMAT v2).
 * Grounded in NCERT Class 11 Ch.4 (resonance) + standard JEE treatment.
 * Run: node scripts/insert_bond_p6_resonance.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 6;
const NEW_SLUG = 'resonance';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'Several faint Lewis structures of the same molecule overlapping and blending into one glowing real structure',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). Several faint, ghostly Lewis-structure line drawings of the same triangular molecule, each slightly different, overlapping and fading into one single bright, solid, glowing molecule in the centre — the idea that many drawings blend into one real thing. A large double-headed arrow motif connecting the faint versions. Sense of "many pictures, one truth", calm and luminous. Cool blue ghost outlines resolving into a warm orange-lit solid core. Clean scientific illustration style. Dark background (#0a0a0a or near-black). No text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Molecule That Won\'t Sit Still for Its Portrait',
      markdown: "Draw the structure of ozone, $\\ce{O3}$, and you are forced into a choice: one $\\ce{O-O}$ single bond on the left and one $\\ce{O=O}$ double bond on the right — or the other way round. Either way, your drawing says one bond should be **long** and the other **short**. But when scientists actually measure ozone, **both** $\\ce{O-O}$ bonds come out *exactly the same length* — sitting neatly between a single and a double bond. The molecule simply refuses to fit either drawing. That refusal is what this whole page is about." },

    // 2 — core concept text (the problem + resonance hybrid + kill the flip misconception)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Some molecules — $\\ce{O3}$, the carbonate ion $\\ce{CO3^2-}$, the nitrate ion $\\ce{NO3^-}$, benzene — can be drawn as **more than one** perfectly valid Lewis structure. Each single drawing is honest but **incomplete**: it predicts unequal bonds, while the real molecule has *equal* ones.\n\n" +
      "The fix is **resonance**. We draw all the valid structures and join them with a special **double-headed arrow** ($\\leftrightarrow$). These individual drawings are called **resonance structures** (or contributing structures). The real molecule is none of them on its own — it is a single, blended, lower-energy structure called the **resonance hybrid**.\n\n" +
      "**Here is the misconception almost every student carries — kill it now:** people picture the molecule *rapidly flipping* between the two structures, like a switch flicking back and forth. **It does not.** The molecule is **one** fixed structure, all the time — the average, the blend. A classic analogy: a rhinoceros is not an animal that flips between being a unicorn and being a dragon; it is its own single real thing that we can only *describe* by borrowing from creatures we already know. Resonance structures are our borrowed descriptions. The hybrid is the rhinoceros." },

    // 3 — heading: what resonance is + the rules
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'What Counts as a Valid Resonance Structure',
      objective: 'Be able to look at two drawings and decide whether they are genuine resonance structures or two different molecules.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Resonance structures are **not** free to be anything you like. They differ from each other in **one way only: the positions of electrons.** The skeleton stays frozen. Three rules tell you whether a set of drawings qualifies:\n\n" +
      "1. **Same positions of atoms.** Every structure must have the atoms in the *identical* arrangement. If an atom moves, you have drawn a different molecule (an isomer), not a resonance structure.\n" +
      "2. **Same number of paired and unpaired electrons.** The total electron count — and how many are unpaired — must match across all structures.\n" +
      "3. **Only π electrons and lone pairs move.** The σ-bond framework (the single bonds holding the skeleton together) never moves. You are only allowed to shuffle the **π bonds** and the **lone pairs** around.\n\n" +
      "So in ozone, the two $\\ce{O3}$ drawings have the *same* bent skeleton; only the double bond (a π bond) and a lone pair shift from one side to the other. Same atoms, same electrons, only π/lone-pair movement — genuine resonance." },

    // 4 — image: ozone + carbonate resonance ↔ hybrid
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:9',
      alt: 'Two resonance structures of ozone and three of carbonate, each set joined by double-headed arrows, blending into a single hybrid with equal partial bonds',
      caption: 'The contributing structures (left) and the real resonance hybrid (right), where every equivalent bond is identical',
      generation_prompt: 'Chemistry resonance concept diagram, two rows. Top row: ozone (O3) shown as two bent Lewis structures — one with the double bond on the left O-O and single on the right, the other reversed — joined by a large double-headed resonance arrow, then an equals-style arrow leading to a single hybrid drawing of bent ozone where BOTH O-O bonds are shown identical (one solid line plus a dashed partial line each, indicating a bond order of 1.5). Bottom row: carbonate ion CO3^2- shown as three equivalent Lewis structures (the C=O double bond rotating between the three oxygens) joined by double-headed resonance arrows, then leading to one hybrid drawing where all three C-O bonds are identical partial double bonds, with the 2- charge shown. Label: resonance structures, double-headed arrow, resonance hybrid, equal bonds. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 5 — heading: resonance energy
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Resonance Energy — Why the Blend Is More Stable',
      objective: 'Explain why a molecule that resonates is harder to pull apart than any single drawing suggests.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Resonance is not just a drawing trick — it changes the **energy** of the molecule, and always in the same direction: **the real hybrid is more stable (lower in energy) than *any single* contributing structure.**\n\n" +
      "The gap between the energy of the actual molecule and the energy of its most stable single drawing is called the **resonance energy**. The bigger that gap, the more stability resonance has handed the molecule. Benzene is the famous case: it is far less reactive than its \"three double bonds\" drawing predicts, precisely because resonance energy locks it down.\n\n" +
      "Two quick rules of thumb you can use:\n\n" +
      "- **More resonance structures → generally more stable** (the electrons have more room to spread out, and spreading out lowers energy).\n" +
      "- **Equivalent (identical-energy) resonance structures stabilise the most.** $\\ce{CO3^2-}$ has three *equivalent* structures, which is why it is so stable and why all three bonds end up identical." },

    // 6 — reasoning_prompt (mid-page, tests the flip misconception)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "If you could freeze ozone, $\\ce{O3}$, at a single instant in time and measure its two $\\ce{O-O}$ bonds, what would you find?",
      options: [
        "One short double bond and one longer single bond — caught at the moment before it flips to the other structure",
        "Two identical bonds, each partway between a single and a double bond — because the molecule is one fixed hybrid, not flipping between drawings",
        "Two single bonds, because freezing it stops all the electron motion",
        "It depends on which instant you pick — sometimes the double bond is on the left, sometimes on the right"
      ],
      correct_index: 1,
      reveal: "The molecule is **not** flipping between two structures and getting caught mid-flip — that picture is the misconception. The resonance hybrid is **one** unchanging structure at every instant, so freezing it changes nothing: you always find two *identical* $\\ce{O-O}$ bonds, each a partial double bond (bond order 1.5). The two Lewis drawings are limitations of OUR notebook, not states the molecule actually visits." },

    // 7 — heading: bond order from resonance (the danda rant lives here)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Bond Order from Resonance — Count, Don\'t Memorise',
      objective: 'Work out the bond order of any resonating ion in seconds by counting bonds and dividing — no formula to memorise.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the part students panic about: the answer comes out as **1.5** or **1.33** or **1.75**, and a fractional bond feels *wrong* — like a weird exception to be feared.\n\n" +
      "So get this straight first. **There are no actual little sticks inside a molecule.** When you draw one line or two lines between two atoms, those lines are *your* bookkeeping — the molecule has no idea whether you drew one danda (stick) or two. A bond of strength \"one-and-a-half\" is not an exception or a glitch; it is simply the real bond, and the whole numbers 1, 2, 3 are the limitation of OUR way of drawing. The molecule is perfectly happy with whatever bond it has.\n\n" +
      "Once you stop fearing the fraction, the arithmetic is trivial — the formula is in the box just below. And the trick to get it right is to **count out loud** and divide. Don't reach for a memorised value — point at each bond, count it, and divide by the number of equivalent positions. The worked examples below show exactly that count." },

    // 8 — latex_block: the bond-order-from-resonance formula on its own line
    { id: uuidv4(), order: n(), type: 'latex_block',
      latex: '\\text{Bond order} = \\frac{\\text{total bonds across the equivalent positions}}{\\text{number of equivalent positions}}',
      label: 'Bond order from resonance',
      note: 'Count the bonds (single = 1, double = 2) across the equivalent bond positions, then divide by how many such positions there are.' },

    // 9 — worked example 1: CO3^2-
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Worked Example — Bond Order in Carbonate, $\\ce{CO3^2-}$',
      problem: "Find the $\\ce{C-O}$ bond order in the carbonate ion, $\\ce{CO3^2-}$.",
      solution: "Draw one valid structure first. Carbon sits in the middle bonded to three oxygens: **one** of them is a double bond ($\\ce{C=O}$) and the **other two** are single bonds ($\\ce{C-O}$).\n\n" +
        "Now count the bonds across the three equivalent $\\ce{C-O}$ positions, out loud:\n\n" +
        "- the double bond → **two**\n" +
        "- first single bond → **three**\n" +
        "- second single bond → **four**\n\n" +
        "So there are **4 bonds** spread over **3 equivalent positions** (the double bond can sit on any of the three oxygens — three equivalent resonance structures).\n\n" +
        "$\\text{Bond order} = \\dfrac{4}{3} \\approx 1.33$\n\n" +
        "Every $\\ce{C-O}$ bond in carbonate is identical, with a bond order of $\\tfrac{4}{3}$. (The nitrate ion $\\ce{NO3^-}$ is built the exact same way — one double, two singles, three equivalent positions — so its bond order is also $\\tfrac{4}{3} \\approx 1.33$.)" },

    // 10 — worked example 2: ClO4^-
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Worked Example — Bond Order in Perchlorate, $\\ce{ClO4^-}$',
      problem: "Find the $\\ce{Cl-O}$ bond order in the perchlorate ion, $\\ce{ClO4^-}$.",
      solution: "Chlorine sits in the centre bonded to four oxygens. In the standard expanded-octet structure it forms **three** double bonds ($\\ce{Cl=O}$) and **one** single bond ($\\ce{Cl-O}$).\n\n" +
        "Count the bonds across the four equivalent $\\ce{Cl-O}$ positions, out loud:\n\n" +
        "- first double bond → **two**\n" +
        "- second double bond → **four**\n" +
        "- third double bond → **six**\n" +
        "- the single bond → **seven**\n\n" +
        "So there are **7 bonds** spread over **4 equivalent positions**.\n\n" +
        "$\\text{Bond order} = \\dfrac{7}{4} = 1.75$\n\n" +
        "Run the same chant on the chlorate ion $\\ce{ClO3^-}$ (two doubles + one single = **five** bonds over **three** positions) and you get $\\tfrac{5}{3} \\approx 1.67$. Same method, every time — count and divide." },

    // 11 — table: bond order from resonance at a glance
    { id: uuidv4(), order: n(), type: 'table', caption: 'Bond order = total bonds ÷ equivalent positions',
      headers: ['Species', 'Bonds counted', 'Equivalent positions', 'Bond order'],
      rows: [
        ['O₃', '3 (one single + one double)', '2', '3/2 = 1.5'],
        ['CO₃²⁻', '4 (one double + two single)', '3', '4/3 ≈ 1.33'],
        ['NO₃⁻', '4 (one double + two single)', '3', '4/3 ≈ 1.33'],
        ['ClO₃⁻', '5 (two double + one single)', '3', '5/3 ≈ 1.67'],
        ['ClO₄⁻', '7 (three double + one single)', '4', '7/4 = 1.75'],
        ['Benzene C–C', '9 (across the ring)', '6', '~1.5'],
      ] },

    // 12 — text: benzene as the classic example
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "**Benzene** ($\\ce{C6H6}$) is the textbook trophy of resonance. You can draw it two ways — with the three double bonds in one set of positions, or shifted to the alternate set (the two **Kekulé structures**). Reality refuses to choose: all six $\\ce{C-C}$ bonds in benzene are **exactly equal in length**, each a partial double bond with a bond order of about **1.5** — longer than a true double bond, shorter than a true single. The ring is one stable resonance hybrid, and its large resonance energy is why benzene behaves so differently from ordinary alkenes." },

    // 13 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Two Things to Lock In',
      markdown: "**1. The resonance hybrid is ONE real structure** — a single, lower-energy blend of all the contributing drawings. The molecule is *not* flipping between them; that is the most common wrong idea. The double-headed arrow ($\\leftrightarrow$) means \"blend of\", never \"turns into\".\n\n" +
        "**2. Bond order from resonance = (total bonds across the equivalent positions) ÷ (number of equivalent positions).** A fractional answer like 1.33 or 1.75 is the *correct* bond, not an exception — there are no whole-number \"sticks\" inside a molecule." },

    // 14 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Bond order from resonance is a guaranteed scorer — if you count instead of memorising.**\n\n" +
        "**The method:** draw one valid structure, count the bonds across the equivalent positions, divide by the number of positions. $\\ce{CO3^2-}$ and $\\ce{NO3^-}$ → $\\tfrac{4}{3}$; $\\ce{ClO3^-}$ → $\\tfrac{5}{3}$; $\\ce{ClO4^-}$ → $\\tfrac{7}{4}$; $\\ce{O3}$ and benzene → $1.5$.\n\n" +
        "**Stability questions:** \"Which species is most stable / has the most resonance structures?\" → more contributing structures, and especially more *equivalent* ones, means greater stability (larger resonance energy).\n\n" +
        "**The trap they love:** an option claiming the molecule \"oscillates\" or \"flips rapidly\" between resonance structures. It is always **wrong** — the molecule is one fixed hybrid. Also watch the bond-order arithmetic landing on a suspiciously clean whole number: recount, because resonance answers are usually fractions." },

    // 15 — inline_quiz (§3.6.1) — LAST graded block
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'What does the double-headed arrow ($\\leftrightarrow$) between two resonance structures actually mean?',
          options: [
            'The molecule rapidly switches back and forth between the two structures',
            'The real molecule is a single, fixed blend (hybrid) of the structures shown',
            'The two structures are in chemical equilibrium with each other',
            'One structure converts permanently into the other over time'
          ],
          correct_index: 1,
          explanation: 'The double-headed arrow means "blend of" — the actual molecule is one unchanging resonance hybrid that the separate drawings only approximate. It does NOT mean the molecule flips between them (that is the classic misconception) and it is not an equilibrium (which uses a different, two-half-arrow symbol).' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'The nitrate ion $\\ce{NO3^-}$ has one $\\ce{N=O}$ double bond and two $\\ce{N-O}$ single bonds, with the double bond able to sit on any of the three oxygens. What is its $\\ce{N-O}$ bond order?',
          options: [
            '5/3 ≈ 1.67',
            '4/3 ≈ 1.33',
            '3/2 = 1.5',
            '2 (it has a double bond)'
          ],
          correct_index: 1,
          explanation: 'Count the bonds across the three equivalent positions: two (the double) + three + four = 4 bonds, over 3 equivalent positions, so 4/3 ≈ 1.33. Picking 2 ignores resonance entirely; 5/3 and 3/2 come from miscounting the bonds or the positions.' },
        { id: uuidv4(), difficulty_level: 3,
          question: 'A fractional bond order such as 1.5 for ozone tells us that the bond is:',
          options: [
            'An unstable, temporary state the bond passes through while flipping',
            'A real, stable bond intermediate in strength between a single and a double bond — the whole numbers are just a limitation of our drawings',
            'A drawing error, since bonds can only be whole numbers',
            'Weaker than a single bond, because it is less than 2'
          ],
          correct_index: 1,
          explanation: 'A bond order of 1.5 is a genuine, stable bond stronger than a single and weaker than a double — there are no literal whole-number "sticks" inside a molecule, so the fraction is the truth and the integers 1/2/3 are our bookkeeping. It is not a transient flipping state, not an error, and 1.5 is stronger (not weaker) than a single bond.' },
      ] },

    // 16 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You have now seen that a single Lewis drawing isn't always the whole truth — sometimes the real bond is a blend. Next, we push that idea into the **ionic** world: **Fajans' rules**, which explain how even an \"ionic\" bond can take on covalent character when one ion pulls hard enough on another's electrons.*" },
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
    slug: NEW_SLUG, title: 'Resonance — One Molecule, Many Pictures',
    subtitle: 'When one Lewis structure can\'t describe a molecule, the real thing is a single, lower-energy blend — and its bond order is just bonds ÷ positions.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'resonance', 'bond-order', 'resonance-energy'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  // Wire into chapter 4 page_ids (append).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 6 (resonance)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
