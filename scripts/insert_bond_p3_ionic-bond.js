'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Arc A, Page 3.
 * "The Ionic Bond & Lattice Enthalpy" (electron transfer, non-directional 3D lattice,
 * lattice energy ∝ q₁q₂/r, NaCl vs MgO charge effect, NaCl/KCl/CsCl size effect,
 * properties of ionic compounds, and the NaCl>KCl melting-point trap).
 * Inserts at page_number 3 (page 1 = why-atoms-bond, page 2 = lewis-structures already in place).
 * Appends to ch4 page_ids (no shifting). published:false — founder reviews + generates
 * the pending images, then publishes.
 * Voice: BOND-exemplars.md (non-directional doorway test, small-cation black hole,
 * compare-only-what-differs) + teacher-voice-profile.md (FORMAT v2).
 * Grounded in NCERT Class 11 Ch.4 (Kössel–Lewis ionic bond, lattice enthalpy) + standard JEE.
 * Run: node scripts/insert_bond_p3_ionic-bond.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 3;
const NEW_SLUG = 'ionic-bond-lattice-enthalpy';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A sodium atom handing one electron to a chlorine atom, the resulting ions snapping into a vast 3D cubic salt lattice',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). On the left, a single sodium atom transferring one glowing electron to a chlorine atom (a clear electron-transfer arrow between them). On the right, the resulting positive and negative ions (Na⁺ smaller, Cl⁻ larger) snapping outward in every direction into a vast, orderly 3D cubic crystal lattice that recedes into the distance, alternating positive and negative spheres held by lines of electrostatic attraction radiating in all directions. Convey "one transfer becomes an infinite repeating crystal". Cool blue ions, warm orange attraction lines. Clean scientific illustration style. Dark background (#0a0a0a or near-black). No text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Rock on Your Dinner Table',
      markdown: "The table salt you sprinkle on food is, quite literally, a **rock**. Every grain is a single crystal where billions of sodium and chloride ions are locked in a perfect, repeating 3D grid. That grid is so tightly bound that you have to heat salt to **801 °C** — hotter than flowing lava — before it finally melts. What kind of glue holds ions together that firmly? The answer is just plain electrical attraction — and how *strong* that glue is, is the whole story of this page." },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "On the last pages you saw the three routes to an octet: lose, gain, or share. The **ionic bond** is what you get from the first two happening *together*.\n\n" +
      "Take sodium and chlorine. Sodium is a metal with a **low ionisation energy** — its one outer electron is loosely held and cheap to remove. Chlorine is a non-metal with a **high electron affinity** — it badly wants one more electron to complete its octet. So the obvious deal happens: sodium **hands over** its electron, chlorine **takes** it. Now sodium is Na⁺ (a neon octet) and chlorine is Cl⁻ (an argon octet).\n\n" +
      "But the transfer is only half the bond. The instant it happens you have a **positive ion and a negative ion sitting next to each other** — and opposite charges attract. That **electrostatic attraction between the cation and the anion is the ionic (electrovalent) bond.** No electrons are shared; they have simply changed owners, and the two charged ions now cling together by pure electrical pull." },

    // 3 — heading: non-directional
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why an Ionic Bond Has No Direction',
      objective: 'See why an ion pulls on every neighbour around it — building a 3D crystal instead of a single molecule.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the feature that makes ionic bonding so different from covalent bonding: **an ionic bond is non-directional.**\n\n" +
      "Think about what a Na⁺ ion actually is — a tiny ball of positive charge. Its electric field points outward **equally in every direction**. So it does not pull on *one* particular chloride; it pulls on **every** chloride around it, from above, below, left, right, front and back. A useful test: a covalent bond is like a handshake that only works face-on — twist the overlap and it breaks. The ionic attraction has no such fussiness. A chloride approaching the sodium ion will be pulled in **whether it comes from the front or from the side** — the bond does not care about the angle.\n\n" +
      "Because every ion attracts oppositely-charged ions from all directions, the ions don't pair off into separate \"NaCl molecules\". They stack into a giant **three-dimensional lattice** — a repeating grid where each Na⁺ is surrounded by six Cl⁻ and each Cl⁻ by six Na⁺. There is no such thing as one sodium chloride molecule; a salt crystal is **one enormous ionic compound**. (This is exactly why a covalent bond, which *is* directional, gives you discrete molecules with definite shapes — the topic of the next pages.)" },

    // 4 — image: electron transfer + 3D rock-salt lattice
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Left: Na transfers an electron to Cl forming Na⁺ and Cl⁻. Right: the rock-salt cubic lattice with 6:6 coordination.',
      caption: '📸 One electron transfer, then attraction in every direction builds the whole crystal',
      generation_prompt: 'Two-panel chemistry diagram. Left panel: a sodium atom (shells drawn) transferring its single outer electron along a curved arrow to a chlorine atom (seven outer electrons), producing a smaller Na⁺ ion and a larger Cl⁻ ion, each with a completed outer shell highlighted. Right panel: the sodium chloride (rock-salt) crystal — a 3D cubic lattice of alternating small purple Na⁺ spheres and larger green Cl⁻ spheres, with thin lines showing each ion bonded to its six nearest opposite-charge neighbours (6:6 coordination), the lattice repeating into the distance. Label: Na, Cl, electron transfer, Na⁺, Cl⁻, 3D lattice, 6 neighbours. Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 5 — heading: lattice enthalpy
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Lattice Enthalpy — Measuring the Glue',
      objective: 'Define lattice enthalpy and read it as the single number that tells you how strong an ionic crystal is.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "We keep saying ionic crystals are \"strongly\" held. **Lattice enthalpy** (or lattice energy) is how we put a number on that strength.\n\n" +
      "**Lattice enthalpy is the energy released when one mole of a solid ionic crystal is formed from its separated gaseous ions.** For sodium chloride:\n\n" +
      "$ \\text{Na}^+(g) + \\text{Cl}^-(g) \\rightarrow \\text{NaCl}(s) $ — and a large amount of energy is *given out* (about 788 kJ per mole for NaCl).\n\n" +
      "A quick note on signs, because it trips students up. **NCERT defines lattice enthalpy the other way round** — as the energy *required to separate* one mole of the solid back into its gaseous ions (which is endothermic, a positive number). The two are simply the same quantity with opposite sign. On this page we'll talk about the **energy released on formation**, and treat \"larger lattice energy\" as meaning \"a stronger, more tightly bound crystal\" — that direction is the intuitive one and it's what every comparison below uses. Just stay consistent: bigger magnitude = stronger bonding, either way you state it.\n\n" +
      "You don't need to memorise the value 788. What matters is what *controls* it — because that one rule explains melting points, hardness, and more." },

    // 6 — latex_block: lattice energy ∝ q1 q2 / r
    { id: uuidv4(), order: n(), type: 'latex_block',
      latex: 'U \\;\\propto\\; \\dfrac{q_1 \\, q_2}{r}',
      label: 'Lattice energy',
      note: 'q₁, q₂ = the charges on the two ions; r = the inter-ionic distance (sum of the ionic radii). Bigger charges and smaller ions → larger lattice energy → stronger crystal.' },

    // 7 — text: how to read the proportionality (compare-only-what-differs)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Read that relation slowly, because it does almost all the work in this topic:\n\n" +
      "- **Charges on top.** Higher ionic charges → bigger numerator → much larger lattice energy.\n" +
      "- **Size on the bottom.** Smaller ions sit closer together (smaller $ r $) → bigger fraction → larger lattice energy. A small, dense cation pulls the anion in close, like a little black hole of positive charge — and a tighter grip means a stronger crystal.\n\n" +
      "And here is the move that makes comparisons fast: **compare only what differs, ignore what's common.** When two compounds share an ion, that shared ion contributes the same to both — so it **cancels out** of the comparison. You're left judging the difference by the *other* ion alone. Keep that trick in mind for every example below." },

    // 8 — reasoning_prompt (mid-page, after lattice energy is taught)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "NaCl and MgO have ions of almost the same size, and both form the same kind of cubic lattice. Yet MgO's lattice energy is about four times that of NaCl. What single factor is responsible?",
      options: [
        "Magnesium is a heavier atom than sodium, so its lattice is held together by gravity as well",
        "The ions in MgO carry charges of 2+ and 2− versus 1+ and 1− in NaCl, and lattice energy depends on the product of the charges (q₁q₂)",
        "Oxygen is more electronegative than chlorine, so MgO is more covalent and therefore stronger",
        "MgO has more ions packed per unit volume, so there are simply more bonds to break"
      ],
      correct_index: 1,
      reveal: "Since the sizes (and so r) are nearly the same, r barely changes between the two — cancel it from the comparison. What's left is the charge product. NaCl is (1)(1) = 1; MgO is (2)(2) = 4. So MgO's lattice energy is roughly four times larger, which is why MgO (m.p. ~2850 °C) is far harder and higher-melting than NaCl (801 °C). Mass and gravity play no role at this scale, and the strength here comes from charge, not from any covalent character." },

    // 9 — heading: properties of ionic compounds
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'What Strong Lattices Do — Properties of Ionic Compounds',
      objective: 'Predict the physical behaviour of an ionic compound straight from the strength of its lattice.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Once you accept that an ionic solid is a single giant lattice held by strong electrostatic forces, its everyday properties almost write themselves:\n\n" +
      "- **High melting and boiling points.** To melt the solid you must overcome the attraction between *every* ion and its neighbours at once. That takes a lot of heat — hence 801 °C for NaCl and far more for high-charge solids like MgO.\n" +
      "- **Hard, but brittle.** The rigid grid resists scratching, so the crystal is hard. But hit it sharply and a layer of ions slides just enough to bring like charges face-to-face; they repel violently and the crystal **cleaves cleanly** — strong yet brittle.\n" +
      "- **Conduct electricity only when molten or dissolved — not when solid.** Conduction needs *free-moving* charges. In the solid, every ion is locked in place, so it can't carry current. Melt it or dissolve it in water and the ions break free and move — now it conducts.\n" +
      "- **Generally soluble in water.** Water molecules are polar and can surround and pull individual ions out of the lattice. *(Exactly when a compound dissolves — the tug-of-war between the lattice and the water — is its own story, which we'll open on the next page.)*" },

    // 10 — worked_example: order by lattice energy / melting point
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Ordering by Lattice Energy',
      problem: "Arrange each set in **increasing** order of lattice energy (and hence melting point), giving your reasoning:\n\n**(a)** NaCl, KCl, CsCl\n\n**(b)** NaCl, MgO\n\nIonic radii to use: Na⁺ < K⁺ < Cs⁺.",
      solution: "Use $ U \\propto q_1 q_2 / r $, and compare only what differs.\n\n" +
        "**(a) NaCl vs KCl vs CsCl.** The anion (Cl⁻) is common to all three, so it cancels — judge by the cation alone. The charges are all 1+ and 1−, so the charge product is the same too. The *only* thing that differs is cation size:\n\n" +
        "Na⁺ < K⁺ < Cs⁺ in size, so the inter-ionic distance $ r $ goes NaCl < KCl < CsCl.\n\n" +
        "Smaller $ r $ → larger $ U $. So lattice energy **decreases** as the cation grows.\n\n" +
        "**Increasing order:** CsCl < KCl < NaCl. (NaCl has the smallest cation, the shortest $ r $, and so the strongest lattice and highest melting point of the three.)\n\n" +
        "**(b) NaCl vs MgO.** Here the ions are about the same size, so $ r $ is roughly equal — cancel it. Now charges differ: NaCl is (1)(1) = 1, MgO is (2)(2) = 4.\n\n" +
        "Larger charge product → far larger $ U $.\n\n" +
        "**Increasing order:** NaCl < MgO — and the gap is huge (about four-fold), which is why MgO is used to line furnaces while NaCl melts in a kitchen flame." },

    // 11 — table: compound → charges → ~ inter-ionic size → melting point
    { id: uuidv4(), order: n(), type: 'table', caption: 'Charge and size set the lattice energy — and the melting point follows',
      headers: ['Compound', 'Charges (q₁ × q₂)', 'Relative ion size', 'Lattice energy', 'Melting point'],
      rows: [
        ['MgO', '2 × 2 = 4', 'small ions', 'very high', '≈ 2852 °C'],
        ['NaCl', '1 × 1 = 1', 'small cation', 'high', '801 °C'],
        ['KCl', '1 × 1 = 1', 'larger cation', 'lower', '770 °C'],
        ['CsCl', '1 × 1 = 1', 'largest cation', 'lowest of these', '645 °C'],
      ] },

    // 12 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The One Rule to Carry Forward',
      markdown: "**An ionic bond is the electrostatic attraction between a cation and an anion — it has no direction, so it builds a 3D crystal, not a molecule.** How strong that crystal is, is captured by the **lattice energy**, and lattice energy follows one relation: $ U \\propto q_1 q_2 / r $. **Higher charges and smaller ions → stronger lattice → higher melting point and greater hardness.** When you compare two compounds, cancel the ion they share and judge by the one that differs." },

    // 13 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The classic trap: \"NaCl vs KCl — which melts higher?\"** Many students reach for Fajans / ionic-character reasoning and conclude KCl (more ionic) should melt higher. **That is the wrong tool here.** Melting point is governed by **lattice energy**, and lattice energy $ \\propto q_1 q_2 / r $. The chloride cancels, the charges are equal, so the smaller cation wins: Na⁺ is smaller than K⁺ → shorter $ r $ → stronger lattice → **NaCl (801 °C) melts higher than KCl (770 °C).** Do *not* argue this one from ionic character.\n\n" +
        "Two more high-yield reflexes:\n\n" +
        "**Charge beats size when charges differ.** For NaCl vs MgO, doubling both charges quadruples the lattice energy — MgO wins easily.\n\n" +
        "**Conductivity timing.** Ionic solids conduct **only when molten or dissolved**, never as a solid — a favourite one-line statement question. The reason: ions must be free to move." },

    // 14 — inline_quiz (§3.6.1) — LAST content block
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'Why is an ionic bond described as non-directional?',
          options: [
            'The shared electron pair can point along any of the bond axes equally',
            'Each ion\'s charge attracts oppositely-charged ions equally from every direction, not along one fixed line',
            'The bond can be bent to any angle without weakening, unlike a metal wire',
            'Ions are too small for direction to have any physical meaning'
          ],
          correct_index: 1,
          explanation: 'An ion\'s electric field spreads out equally in all directions, so it pulls on every oppositely-charged neighbour around it — that is why ionic compounds form 3D lattices rather than discrete molecules. There is no shared pair in an ionic bond (that is the covalent case), and "size" is not the reason.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Using lattice energy ∝ q₁q₂ / r, which of these is expected to have the highest melting point?',
          options: [
            'KCl, because K⁺ is larger and so holds Cl⁻ over a greater area',
            'CsCl, because caesium is the heaviest of the metals listed',
            'NaCl, because Na⁺ is the smallest cation here, giving the shortest inter-ionic distance and strongest lattice',
            'All three melt at the same temperature since each has singly-charged ions'
          ],
          correct_index: 2,
          explanation: 'The chloride is common and the charges are all 1×1, so only cation size differs. The smallest cation (Na⁺) gives the shortest r and the largest lattice energy, hence the highest melting point: NaCl (801 °C) > KCl (770 °C) > CsCl (645 °C). A larger or heavier cation lowers lattice energy, it does not raise it.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A solid ionic compound does not conduct electricity, but the same compound conducts well once it is melted. What is the reason?',
          options: [
            'In the solid the ions are locked in the lattice, but on melting the ions are freed to move and carry charge',
            'Melting converts the ionic bonds into metallic bonds that carry current',
            'Heat adds electrons to the compound, and these new electrons carry the current',
            'The solid is a poor conductor only because its surface is dry; melting simply adds moisture'
          ],
          correct_index: 0,
          explanation: 'Conduction needs mobile charge carriers. In the rigid solid lattice every ion is fixed, so no charge can flow; melting (or dissolving) frees the ions to move, and the moving ions carry the current. No bonds change type and no new electrons are created.' },
      ] },

    // 15 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You now know how ionic bonds form, why they have no direction, and how lattice energy decides a crystal's strength. But where does that 788 kJ actually come from — and is forming NaCl even worth the energy spent ripping the electron off sodium in the first place? Next, the **Born–Haber cycle** lets us add up every step and find out.*" },
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
    slug: NEW_SLUG, title: 'The Ionic Bond & Lattice Enthalpy',
    subtitle: 'Electron transfer makes ions; their non-directional attraction builds a 3D crystal whose strength is the lattice energy (∝ q₁q₂/r).',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'ionic-bond', 'lattice-enthalpy', 'electrovalent'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 3 (ionic bond & lattice enthalpy)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
