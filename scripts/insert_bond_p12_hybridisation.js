'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 12.
 * "Hybridisation — Mixing Orbitals to Explain Shape" (sp, sp², sp³).
 * Inserts at chapter_number 4, page_number 12. published:false — founder reviews,
 * generates the 2 pending images (hero + orbital-mixing diagram), then publishes.
 * Voice: BOND-exemplars.md §B (the founder's OWN hybridisation shortcut — sigma bonds
 *   + FREE lone pairs; fluorine ALWAYS single; oxygen two singles or one double) +
 *   teacher-voice-profile.md (count-it-don't-memorise stance, honest calibration).
 * Grounded in NCERT Class 11 Ch.4 (hybridisation) + standard JEE treatment.
 * Run: node scripts/insert_bond_p12_hybridisation.js   (DO NOT auto-run)
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 12;
const NEW_SLUG = 'hybridisation';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'One s orbital and three p orbitals merging into four identical hybrid orbitals pointing to the corners of a tetrahedron',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). On the left, one spherical s orbital and three dumbbell-shaped p orbitals (along x, y, z axes) shown separately, clearly different shapes. A glowing transformation arrow points right. On the right, four identical teardrop-shaped hybrid orbitals emerging, spreading symmetrically toward the corners of a tetrahedron, all equal in size and shape. A clear visual sense of "unequal orbitals mixing into equal ones". Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Four Identical Bonds Puzzle',
      markdown: "In a molecule of methane ($ \\ce{CH4} $), all **four** carbon–hydrogen bonds are perfectly identical — same length, same strength, same $ 109.5^\\circ $ angle between every pair. But look at the cupboard carbon was working with: **one** $ 2s $ orbital and **three** $ 2p $ orbitals — and those are *not* identical. The $ s $ is a round ball; the three $ p $'s are dumbbells pointing at $ 90^\\circ $. So here is the puzzle: how do four **unequal** orbitals end up making four **equal** bonds?" },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The honest answer is that carbon does not use its orbitals in their raw, separate form. Just before bonding, the orbitals **mix together** and re-emerge as a fresh set of **identical** orbitals. This mixing is called **hybridisation**.\n\n" +
      "Think of it like this: you take one $ s $ and three $ p $ orbitals of similar energy, pour them into one pot, and pour back out **four** new orbitals that are all exactly the same shape, the same energy, and spread out as far from each other as possible. These new orbitals are called **hybrid orbitals**, and the number you get out always equals the number you put in.\n\n" +
      "Why bother? Because pure atomic orbitals sit at the wrong angles ($ 90^\\circ $ for the $ p $'s) and have the wrong shapes to explain the geometries we actually measure. Hybridisation is the model that fixes that — it gives orbitals pointing in the right directions, at the right angles, to build the real shape." },

    // 3 — heading: sp
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'sp Hybridisation — Linear, 180°',
      objective: 'Mix one s with one p to get two orbitals pointing exactly opposite — and see why that means a straight line.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Mix **one** $ s $ orbital with **one** $ p $ orbital and you get **two** identical $ sp $ hybrid orbitals. To stay as far apart as possible, they point in exactly opposite directions — a $ 180^\\circ $ angle. The shape is **linear**.\n\n" +
      "Each $ sp $ orbital is built from one $ s $ and one $ p $, so it is **50% s-character** — the highest of the three types we meet here. That high $ s $-character matters later.\n\n" +
      "**Examples:** $ \\ce{BeCl2} $ (beryllium in the centre), $ \\ce{C2H2} $ (acetylene — each carbon is $ sp $), and $ \\ce{CO2} $ (the central carbon is $ sp $)." },

    // 4 — heading: sp2
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'sp² Hybridisation — Trigonal Planar, 120°',
      objective: 'Mix one s with two p orbitals to get three orbitals in a flat triangle — and read off the angle.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Mix **one** $ s $ with **two** $ p $ orbitals and you get **three** identical $ sp^2 $ hybrids. They spread out in one flat plane, $ 120^\\circ $ apart, pointing to the corners of a triangle. The shape is **trigonal planar**.\n\n" +
      "Each $ sp^2 $ orbital is built from one $ s $ and two $ p $'s, so it is **about 33% s-character**.\n\n" +
      "**Examples:** $ \\ce{BF3} $ (boron in the centre), $ \\ce{C2H4} $ (ethene — each carbon is $ sp^2 $), and the carbonate ion $ \\ce{CO3^{2-}} $ (central carbon is $ sp^2 $)." },

    // 5 — heading: sp3
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'sp³ Hybridisation — Tetrahedral, 109.5°',
      objective: 'Mix one s with all three p orbitals to get four orbitals in 3-D — the shape that finally explains methane.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Mix **one** $ s $ with **all three** $ p $ orbitals and you get **four** identical $ sp^3 $ hybrids. Four orbitals cannot stay far apart in a flat plane, so they go fully three-dimensional, pointing to the corners of a **tetrahedron** at $ 109.5^\\circ $. This is exactly the geometry of methane — puzzle solved.\n\n" +
      "Each $ sp^3 $ orbital is built from one $ s $ and three $ p $'s, so it is **25% s-character** — the lowest of the three.\n\n" +
      "**Examples:** $ \\ce{CH4} $, $ \\ce{NH3} $, $ \\ce{H2O} $, and the ammonium ion $ \\ce{NH4+} $ — in every one of these the central atom is $ sp^3 $. (In $ \\ce{NH3} $ and $ \\ce{H2O} $ a lone pair sits in one of the hybrid orbitals, which is why their angles dip a little below $ 109.5^\\circ $ — but the hybridisation is still $ sp^3 $.)" },

    // 6 — image: orbital mixing into sp / sp² / sp³
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'One s and p orbitals mixing into sp (linear), sp² (trigonal planar), and sp³ (tetrahedral) hybrid sets',
      caption: '📸 Same ingredients, three recipes — the number of p orbitals you add decides the shape',
      generation_prompt: 'Educational chemistry diagram with three labelled rows. Row 1 (sp): one spherical s orbital + one dumbbell p orbital combining into two identical hybrid orbitals pointing in opposite directions, labelled "linear, 180°, 50% s". Row 2 (sp²): one s + two p orbitals combining into three identical hybrid orbitals in a flat plane forming a triangle, labelled "trigonal planar, 120°, 33% s". Row 3 (sp³): one s + three p orbitals combining into four identical hybrid orbitals pointing to the corners of a tetrahedron, labelled "tetrahedral, 109.5°, 25% s". Each row shows the "before" atomic orbitals, an arrow, then the "after" hybrid set. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 7 — heading: the founder's shortcut (centrepiece)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Shortcut — Count, Don\'t Memorise',
      objective: 'Find the hybridisation of any central atom in seconds, without drawing a single orbital diagram.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Now my own method — a bit of a shortcut, but it always works. You do **not** need to draw orbital boxes or remember a table. Just look at the **central atom** and count two things:\n\n" +
      "**(number of sigma bonds) + (number of free lone pairs) on the central atom**\n\n" +
      "Then read off the answer:\n\n" +
      "- count $ = 2 $ → $ sp $\n" +
      "- count $ = 3 $ → $ sp^2 $\n" +
      "- count $ = 4 $ → $ sp^3 $\n\n" +
      "Two rules make the count clean:\n\n" +
      "1. **A multiple bond counts as only ONE sigma.** A double or triple bond is still *one* connection to the neighbour — the extra lines are pi bonds, and pi bonds do **not** add to the count. So the central carbon in $ \\ce{CO2} $ ($ \\ce{O=C=O} $) has 2 sigma bonds, 0 lone pairs → count 2 → $ sp $.\n" +
      "2. **\"Free\" lone pairs only.** A lone pair that is tied up in resonance (delocalised) does not count as free. Count only the lone pairs that genuinely sit on the central atom.\n\n" +
      "The same counting keeps going for the bigger ones — $ 5 \\rightarrow sp^3d $, $ 6 \\rightarrow sp^3d^2 $, $ 7 \\rightarrow sp^3d^3 $ — but those need an *expanded octet* and d-orbitals, so they get their own page next. For now, master 2/3/4." },

    // 8 — heading: s-character → bond strength + angle
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'More s-Character → Stronger, Shorter Bonds',
      objective: 'See the single trend that links sp, sp², sp³ to bond length, bond strength, and bond angle.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The $ s $ orbital sits closer to the nucleus than the $ p $. So the more $ s $-character a hybrid orbital has, the more tightly it is held near the nucleus — and that has three consequences that all move together:\n\n" +
      "**More $ s $-character → shorter bond, stronger bond, and larger bond angle.**\n\n" +
      "Reading down our three types, $ s $-character falls ($ sp $ 50% > $ sp^2 $ 33% > $ sp^3 $ 25%), so:\n\n" +
      "- bonds get **longer and weaker** ($ sp $ shortest/strongest → $ sp^3 $ longest/weakest), and\n" +
      "- angles get **smaller** ($ 180^\\circ \\rightarrow 120^\\circ \\rightarrow 109.5^\\circ $).\n\n" +
      "This is why a $ \\ce{C#C} $ triple-bonded carbon ($ sp $) holds its hydrogens more tightly than an $ sp^3 $ carbon does — a fact JEE leans on constantly." },

    // 9 — reasoning_prompt (mid-page; apply the shortcut to CO2's carbon)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Carbon dioxide is $ \\ce{O=C=O} $ — the central carbon has two double bonds and no lone pairs. Using the shortcut, what is the hybridisation of that carbon?",
      options: [
        "$ sp^2 $ — because there are two double bonds, and each double bond counts as one position, giving 2... wait, that gives sp, so it must round up to sp²",
        "$ sp $ — each double bond is still just ONE sigma bond, so 2 sigma + 0 free lone pairs = 2 → sp",
        "$ sp^3 $ — count all four lines in the two double bonds, giving 4 positions",
        "$ sp^2 $ — count the two double bonds as 2 and add 1 for the central atom itself, giving 3"
      ],
      correct_index: 1,
      reveal: "The whole trick is rule 1: a multiple bond contributes only ONE sigma. The carbon has two neighbours, so two sigma bonds; the extra lines in $ \\ce{O=C=O} $ are pi bonds and do not count. There are no lone pairs on carbon. So the count is $ 2 + 0 = 2 \\rightarrow sp $. Carbon dioxide is linear at $ 180^\\circ $ — exactly what $ sp $ predicts." },

    // 10 — worked example 1: BF3 and H2O
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Apply the Shortcut',
      problem: "Find the hybridisation of the central atom in (a) $ \\ce{BF3} $ and (b) $ \\ce{H2O} $, using sigma bonds + free lone pairs.",
      solution: "Count sigma bonds and free lone pairs on the central atom, then map 2/3/4 → $ sp $/$ sp^2 $/$ sp^3 $.\n\n" +
        "**(a) $ \\ce{BF3} $** — boron is central.\n\n" +
        "Fluorine always forms a single bond, so boron has **3 sigma bonds** (one to each F).\n\n" +
        "Boron has **no lone pair** (it is electron-deficient — an incomplete octet).\n\n" +
        "Count $ = 3 + 0 = 3 \\rightarrow \\boxed{sp^2} $. Shape: trigonal planar, $ 120^\\circ $.\n\n" +
        "**(b) $ \\ce{H2O} $** — oxygen is central.\n\n" +
        "Oxygen forms **2 sigma bonds** (one to each H).\n\n" +
        "Oxygen has **2 free lone pairs**.\n\n" +
        "Count $ = 2 + 2 = 4 \\rightarrow \\boxed{sp^3} $. (The two lone pairs squeeze the angle to $ 104.5^\\circ $, but it is still $ sp^3 $.)" },

    // 11 — worked example 2: HCN
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — A Triple-Bond Trap',
      problem: "Find the hybridisation of the carbon in hydrogen cyanide, $ \\ce{H-C#N} $.",
      solution: "Look only at carbon, and remember a multiple bond is one sigma.\n\n" +
        "Carbon has a single bond to H — that is **1 sigma**.\n\n" +
        "Carbon has a triple bond to N. A triple bond is still just **1 sigma** (the other two lines are pi bonds — they do not count).\n\n" +
        "So carbon has $ 1 + 1 = 2 $ sigma bonds, and **no lone pairs**.\n\n" +
        "Count $ = 2 + 0 = 2 \\rightarrow \\boxed{sp} $. The H–C–N skeleton is linear at $ 180^\\circ $.\n\n" +
        "**Watch out:** the trap is counting the three lines of the triple bond as three positions. They are one connection — one sigma." },

    // 12 — table: hybridisation summary
    { id: uuidv4(), order: n(), type: 'table', caption: 'The whole page in one table — read it across each row',
      headers: ['Hybridisation', 's-character', 'Geometry', 'Bond angle', 'Example'],
      rows: [
        ['$ sp $', '50%', 'Linear', '$ 180^\\circ $', '$ \\ce{BeCl2} $, $ \\ce{CO2} $'],
        ['$ sp^2 $', '33%', 'Trigonal planar', '$ 120^\\circ $', '$ \\ce{BF3} $, $ \\ce{C2H4} $'],
        ['$ sp^3 $', '25%', 'Tetrahedral', '$ 109.5^\\circ $', '$ \\ce{CH4} $, $ \\ce{NH4+} $'],
      ] },

    // 13 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The One Shortcut to Carry',
      markdown: "**Count (sigma bonds) + (free lone pairs) on the central atom: $ 2 \\rightarrow sp $, $ 3 \\rightarrow sp^2 $, $ 4 \\rightarrow sp^3 $.** A multiple bond counts as only ONE sigma. And remember the trend: **more $ s $-character means a shorter, stronger bond and a larger angle** ($ sp $ wins on all three)." },

    // 14 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Hybridisation questions are pure speed once you trust the shortcut — don't draw orbital diagrams under time pressure.**\n\n" +
        "**Count, never memorise:** sigma bonds + free lone pairs → 2/3/4 = $ sp $/$ sp^2 $/$ sp^3 $. Practise it until it is instant.\n\n" +
        "**The classic trap:** a multiple bond is **one** sigma — examiners load questions with double and triple bonds hoping you over-count.\n\n" +
        "**The trend question:** \"Which C–H bond is shortest/strongest?\" or \"arrange the bond angles\" → answer by $ s $-character ($ sp > sp^2 > sp^3 $). More $ s $-character = shorter, stronger bond, bigger angle." },

    // 15 — inline_quiz (§3.6.1) — LAST
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'Using the shortcut, what is the hybridisation of nitrogen in ammonia, $ \\ce{NH3} $ (3 sigma bonds, 1 lone pair)?',
          options: [
            '$ sp $, because nitrogen forms three bonds',
            '$ sp^2 $, because the lone pair is not counted',
            '$ sp^3 $, because 3 sigma bonds + 1 free lone pair = 4',
            '$ sp^3d $, because nitrogen expands its octet'
          ],
          correct_index: 2,
          explanation: 'The shortcut counts sigma bonds AND free lone pairs: $ 3 + 1 = 4 \\rightarrow sp^3 $. The lone pair must be counted (which is the whole point of "+ free lone pairs"), and nitrogen — a period-2 element — cannot expand its octet, so $ sp^3d $ is impossible.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'In which species is the central atom $ sp^2 $ hybridised?',
          options: [
            '$ \\ce{CH4} $ — four sigma bonds, no lone pairs',
            '$ \\ce{BF3} $ — three sigma bonds, no lone pairs on boron',
            '$ \\ce{CO2} $ — the carbon has two double bonds',
            '$ \\ce{H2O} $ — two sigma bonds and two lone pairs'
          ],
          correct_index: 1,
          explanation: 'Boron in $ \\ce{BF3} $: 3 sigma (F is always single) + 0 lone pairs = 3 → $ sp^2 $. $ \\ce{CH4} $ and $ \\ce{H2O} $ both give a count of 4 ($ sp^3 $), and $ \\ce{CO2} $ gives 2 ($ sp $) because each double bond is only one sigma.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'An $ sp $ carbon and an $ sp^3 $ carbon each bond to hydrogen. Which C–H bond is shorter and stronger, and why?',
          options: [
            'The $ sp^3 $ C–H bond, because $ sp^3 $ orbitals are larger and reach further',
            'The $ sp $ C–H bond, because higher $ s $-character holds the bonding electrons closer to the nucleus',
            'They are identical, because a C–H bond is always the same regardless of hybridisation',
            'The $ sp^3 $ C–H bond, because it has a wider $ 109.5^\\circ $ angle'
          ],
          correct_index: 1,
          explanation: 'An $ sp $ orbital is 50% $ s $-character versus 25% for $ sp^3 $. More $ s $-character pulls the bonding pair closer to the nucleus, giving a shorter, stronger bond. Bond angle ($ 109.5^\\circ $ vs $ 180^\\circ $) does not set bond length, and C–H bonds are not all identical.' },
      ] },

    // 16 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now find $ sp $, $ sp^2 $, and $ sp^3 $ for almost any molecule by counting. But what happens when the count comes out as **5, 6, or 7** — like in $ \\ce{PCl5} $ or $ \\ce{SF6} $? Those atoms break the octet and borrow d-orbitals, giving $ sp^3d $, $ sp^3d^2 $, and $ sp^3d^3 $. That expanded world is the next page.*" },
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
    slug: NEW_SLUG, title: 'Hybridisation — Mixing Orbitals to Explain Shape',
    subtitle: 'Orbitals mix into equal hybrids — and a shortcut (sigma bonds + free lone pairs) names them.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'hybridisation', 'vbt', 'molecular-geometry'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 12 (hybridisation sp/sp2/sp3)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
