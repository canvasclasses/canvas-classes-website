'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 9.
 * "VSEPR Theory — Why Molecules Take Shape" (the careful theory page; the full
 * gallery of every shape type is the NEXT page).
 * Covers: the core repulsion idea, the VSEPR postulates, electron-pair geometry vs
 * molecular shape, steric number, the repulsion order (lp-lp > lp-bp > bp-bp) and the
 * CH₄→NH₃→H₂O angle-shrink series, and the founder's fixed shape-prediction thought-chain.
 * Inserts at page_number 9 and appends to ch4 page_ids. published:false — founder reviews
 * + generates the pending images, then publishes.
 * Voice: BOND-exemplars.md (§B shape-prediction thought-chain + §C traps) +
 * teacher-voice-profile.md (FORMAT v2). Grounded in NCERT Class 11 Ch.4 + standard JEE.
 * Run: node scripts/insert_bond_p9_vsepr.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 9;
const NEW_SLUG = 'vsepr-theory';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'Electron pairs around a central atom pushing apart to point at the corners of a tetrahedron',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A single glowing central atom in the middle, with four luminous electron-pair clouds emerging from it and pushing as far away from each other as possible, their tips reaching toward the corners of an implied tetrahedron. A sense of mutual repulsion and balanced spacing — clouds shoving each other apart to find equilibrium. Cool blue cloud glow with warm orange edges. Clean scientific illustration style. Dark background (#0a0a0a or near-black). No text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Same Recipe, Different Shape',
      markdown: "Water (H₂O) and carbon dioxide (CO₂) look like the same recipe written twice: **one atom in the middle, two atoms on the sides.** So why is CO₂ a perfectly straight rod (O=C=O, 180°) while water is bent like a boomerang (104.5°)? They should be twins — but they aren't. The shape of a molecule is **not** something you can read off its formula. There is a hidden rule deciding it. That rule is VSEPR." },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "By now you can draw a Lewis structure — you know which atoms are joined and where the lone pairs sit. But a Lewis structure is **flat**, drawn on paper. A real molecule lives in **3D**, and its shape decides almost everything about it: whether it is polar, how it reacts, even whether it dissolves.\n\n" +
      "**VSEPR** stands for **Valence Shell Electron Pair Repulsion**. The whole theory rests on one stubbornly simple idea:\n\n" +
      "> **The electron pairs in the outer (valence) shell of the central atom all carry negative charge, so they repel each other. They arrange themselves as FAR APART as possible — the arrangement of minimum repulsion. That arrangement fixes the shape of the molecule.**\n\n" +
      "Count *both* the bonding pairs (the pairs shared in bonds) **and** the lone pairs (the unshared pairs sitting on the central atom). Every pair wants its own personal space. Push them apart until they can't get any further, and the molecule's geometry falls out automatically." },

    // 3 — heading: the postulates
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Postulates of VSEPR',
      objective: 'List the core rules VSEPR uses to turn an electron count into a 3D shape.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "VSEPR is a small set of rules. Learn these and you can predict the shape of almost any simple molecule:\n\n" +
      "1. **The shape is decided by the electron pairs around the *central* atom** — both bonding pairs and lone pairs.\n" +
      "2. **Electron pairs repel one another** (like charges) and so settle into the arrangement that keeps them as far apart as possible — the one with **minimum repulsion**.\n" +
      "3. **Not all repulsions are equal.** A lone pair takes up more room than a bonding pair, so the repulsions rank: **lone pair–lone pair > lone pair–bond pair > bond pair–bond pair.** (More on this below — it is what bends molecules.)\n" +
      "4. **A multiple bond (double or triple) counts as ONE region of electron density** — one position — even though it holds more electrons. It is still attached in a single direction.\n" +
      "5. **The shape we name describes only the positions of the *atoms*** — the lone pairs are invisible in the final shape name, even though they were fully counted in deciding it.\n\n" +
      "Postulates 4 and 5 are exactly where students slip. The next two sections nail them down." },

    // 4 — heading: steric number
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Steric Number — Counting the Positions',
      objective: 'Compute the steric number — the count that selects the basic geometry of any central atom.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "To use VSEPR you first count how many **regions of electron density** sit around the central atom. That count has a name: the **steric number**.\n\n" +
      "$ \\text{Steric number} = (\\text{number of atoms bonded to the central atom}) + (\\text{number of lone pairs on the central atom}) $\n\n" +
      "The one trap: **a bond is a bond — single, double or triple, it is ONE position.** A C=O double bond and a C–H single bond each count as exactly **one** toward the steric number, because each points in just one direction. You are counting *directions of electron density*, not electrons.\n\n" +
      "The steric number alone selects the basic spread (the electron-pair geometry):\n\n" +
      "- **2** → linear (180°)\n" +
      "- **3** → trigonal planar (120°)\n" +
      "- **4** → tetrahedral (109.5°)\n" +
      "- **5** → trigonal bipyramidal\n" +
      "- **6** → octahedral\n\n" +
      "That is the skeleton. What you *see* depends on how many of those positions are lone pairs — which brings us to the single biggest source of confusion in this chapter." },

    // 5 — heading: geometry vs shape (the #1 confusion)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Electron-Pair Geometry vs Molecular Shape',
      objective: 'Separate the two ideas cleanly — geometry counts every pair; shape forgets the lone pairs.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the distinction that decides half the marks on this topic. Two different questions are hiding inside one molecule:\n\n" +
      "**Electron-pair geometry** — how do *all* the electron pairs (bonding + lone) arrange themselves around the central atom? This counts **every** pair.\n\n" +
      "**Molecular shape** — where do the *atoms* sit? This describes only the positions of the bonded atoms. **When you name the shape, you forget the lone pairs are there** — \"lone pair ko bhool jao.\"\n\n" +
      "The lone pairs are not gone. They were fully counted in fixing the geometry, and they are still physically present, still pushing on the bonds. We simply don't *name* them, because a shape describes where the atoms are — and a lone pair has no atom on the end of it.\n\n" +
      "**Water is the perfect example.** Oxygen has 2 bonded H atoms and 2 lone pairs → steric number 4 → the four pairs point to the corners of a **tetrahedron** (that is the electron-pair *geometry*). But two of those corners hold only lone pairs, with no atom. So the **shape** — the part you can see, the two O–H bonds — is **bent**. Same molecule: geometry tetrahedral, shape bent. Get this split clear and VSEPR becomes easy." },

    // 6 — image: angle-shrink series CH4 -> NH3 -> H2O
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:9',
      alt: 'CH4, NH3 and H2O side by side showing bond angles shrinking from 109.5 to 107 to 104.5 degrees as lone pairs are added',
      caption: '📸 Add lone pairs, and the bond angle shrinks: CH₄ 109.5° → NH₃ 107° → H₂O 104.5°',
      generation_prompt: 'Chemistry concept diagram, three molecules in a row for comparison at identical scale. Left: methane CH₄ — central carbon with four bonds to hydrogen pointing to tetrahedral corners, labelled bond angle 109.5°, no lone pairs. Middle: ammonia NH₃ — central nitrogen with three bonds to hydrogen and ONE lone pair shown as a faint electron cloud on top pushing the bonds down, labelled bond angle 107°. Right: water H₂O — central oxygen with two bonds to hydrogen and TWO lone pairs shown as faint clouds pushing the bonds closer together, labelled bond angle 104.5°. Show the lone-pair clouds visibly larger and pressing inward on the bonds. Label: CH₄ 109.5°, NH₃ 107°, H₂O 104.5°, lone pair. Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 7 — heading: the repulsion order
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Angles Shrink — The Repulsion Order',
      objective: 'Use the lp–lp > lp–bp > bp–bp rule to explain why real angles fall below the ideal.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "If electron pairs simply repelled equally, every steric-number-4 molecule would sit at a clean 109.5°. But they don't all repel equally. A **lone pair** is held by only one nucleus, so its cloud is fatter and spreads wider; a **bonding pair** is pulled tight between two nuclei, so it is slimmer and takes less room.\n\n" +
      "That gives the repulsion ranking that runs the whole chapter:\n\n" +
      "$ \\text{lone pair–lone pair} > \\text{lone pair–bond pair} > \\text{bond pair–bond pair} $\n\n" +
      "A fat lone pair shoves the bonding pairs closer together, so the bond angle **shrinks below the ideal**. The more lone pairs, the harder the squeeze. Watch it happen across three molecules with the *same* steric number (4):\n\n" +
      "- **CH₄** — 4 bonds, **0 lone pairs.** Nothing to squeeze the bonds. Perfect tetrahedral, $ 109.5^\\circ $.\n" +
      "- **NH₃** — 3 bonds, **1 lone pair.** That one lone pair presses the three N–H bonds down. Angle drops to $ 107^\\circ $.\n" +
      "- **H₂O** — 2 bonds, **2 lone pairs.** Two lone pairs squeeze even harder. Angle drops further to $ 104.5^\\circ $.\n\n" +
      "Same skeleton, three different angles — and the difference is entirely the lone-pair count. Whenever you see an angle below the ideal, the reason is an extra unbalanced repulsion from a lone pair." },

    // 8 — heading: the prediction method (the spine)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Method — Predicting Any Shape',
      objective: 'Run the fixed seven-beat thought-chain that turns any formula into a predicted shape.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the fixed routine. Do it in this exact order every single time and you will never be lost:\n\n" +
      "1. **Pick the central atom** (usually the least electronegative, written in the middle).\n" +
      "2. **Find its valence electrons** (its group number).\n" +
      "3. **See how many bonds it makes** — how many atoms are attached to it.\n" +
      "4. **The leftover electrons pair up into lone pairs** on the central atom.\n" +
      "5. **Steric number = bonds + lone pairs.**\n" +
      "6. **Look up the geometry** that steric number gives (linear / trigonal planar / tetrahedral / …).\n" +
      "7. **Name the shape** by where the *atoms* sit — forget the lone pairs.\n\n" +
      "**One extra move for ions:** if the species carries a charge, **put that charge on the central atom before you count.** A negative charge means one extra electron to place; a positive charge means one fewer. Imagine the charge sitting on the central atom and proceed exactly as above.\n\n" +
      "That's the spine of the entire topic. Once you trust this chain, shape, bond angle, hybridisation and polarity all follow from the same one structure. Now test the most important case before we run the worked examples." },

    // 9 — simulation block (predict-first), after the method is taught
    { id: uuidv4(), order: n(), type: 'simulation', simulation_id: 'vsepr-shape-lab',
      title: 'VSEPR Shape Lab — build the molecule, see the geometry',
      prediction: {
        prompt: 'Water (H₂O) has 2 bonded H atoms and 2 lone pairs on oxygen (steric number 4). What shape will the MOLECULE take?',
        options: ['Linear (180°)', 'Bent / V-shaped (~104.5°)', 'Trigonal planar (120°)', 'Tetrahedral (109.5°)'],
        reveal_after: 'Bent. The four electron pairs point to the corners of a tetrahedron (electron-pair geometry = tetrahedral), but we only "see" the two O–H bonds, so the SHAPE is bent. The two lone pairs push the bonds closer, squeezing the angle from 109.5° down to 104.5°.'
      } },

    // 10 — reasoning_prompt (mid-page check, on geometry vs shape using NH3)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'spatial', difficulty_level: 2,
      prompt: "Ammonia (NH₃) has nitrogen with 3 bonded H atoms and 1 lone pair (steric number 4). Its electron-pair geometry is tetrahedral. So what is the molecular SHAPE of NH₃?",
      options: [
        "Tetrahedral — the geometry and the shape are always the same name",
        "Trigonal planar — three bonds means a flat triangle",
        "Trigonal pyramidal — the three N–H bonds form the base of a pyramid with the lone pair at the apex; we name the shape from the atoms only, so the lone pair is not in the name",
        "Bent — the lone pair forces the three bonds into a V"
      ],
      correct_index: 2,
      reveal: "Steric number 4 gives a tetrahedral electron-pair geometry, but one corner holds a lone pair, not an atom. Naming the shape, we forget the lone pair and look only at where the atoms sit: three H atoms spreading from N like the base of a pyramid, with the lone pair sitting on top. That is trigonal pyramidal. Tetrahedral would be the answer only if all four corners held atoms (like CH₄)." },

    // 11 — worked example: NH3 and SO2 via the thought-chain
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Predicting Shape with the Thought-Chain',
      problem: "Using the VSEPR thought-chain, predict the shape of (a) ammonia, NH₃, and (b) sulfur dioxide, SO₂.",
      solution: "Run the same seven steps each time.\n\n" +
        "**(a) NH₃**\n\n" +
        "Central atom = N (group 15 → 5 valence electrons).\n\n" +
        "Bonds: 3 N–H bonds → 3 bonding pairs (uses 3 electrons).\n\n" +
        "Leftover: $ 5 - 3 = 2 $ electrons → 1 lone pair.\n\n" +
        "Steric number $ = 3 + 1 = 4 $ → tetrahedral electron-pair geometry.\n\n" +
        "Forget the lone pair and name the atoms' positions → **trigonal pyramidal**. The lone pair presses the bonds in, so the angle is $ 107^\\circ $ (just under the ideal $ 109.5^\\circ $).\n\n" +
        "**(b) SO₂**\n\n" +
        "Central atom = S. It forms bonds to 2 oxygen atoms and is left with 1 lone pair.\n\n" +
        "Remember: a double bond is still **one position**. So even though S=O involves a double bond, it counts as a single region of electron density.\n\n" +
        "Steric number $ = 2 \\text{ (bonded atoms)} + 1 \\text{ (lone pair)} = 3 $ → trigonal planar electron-pair geometry.\n\n" +
        "Forget the lone pair and name the atoms' positions → **bent (V-shaped)**, with an angle near $ 119^\\circ $ — close to the ideal $ 120^\\circ $ but pulled in slightly by the lone pair." },

    // 12 — worked example 2: a quick ion (the charge-on-central-atom move)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — An Ion (Putting the Charge on the Central Atom)',
      problem: "Predict the shape of the hydronium ion, H₃O⁺.",
      solution: "An ion is no harder — just place the charge on the central atom first.\n\n" +
        "Central atom = O (group 16 → 6 valence electrons).\n\n" +
        "The ion is **+1**, so the central atom has **one fewer** electron: $ 6 - 1 = 5 $ electrons to work with.\n\n" +
        "Bonds: 3 O–H bonds → 3 bonding pairs (uses 3 electrons).\n\n" +
        "Leftover: $ 5 - 3 = 2 $ electrons → 1 lone pair.\n\n" +
        "Steric number $ = 3 + 1 = 4 $ → tetrahedral electron-pair geometry.\n\n" +
        "Forget the lone pair → **trigonal pyramidal** (the same shape as NH₃, which makes sense — both are steric number 4 with one lone pair)." },

    // 13 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Two Rules That Run Everything',
      markdown: "**1. Geometry counts the lone pairs; the shape forgets them.** Electron-pair geometry uses *every* pair (bonding + lone) to fix the arrangement. The molecular shape names only where the *atoms* sit. Same molecule, often two different names — H₂O is tetrahedral geometry but bent shape.\n\n" +
        "**2. Repulsion order: lone pair–lone pair > lone pair–bond pair > bond pair–bond pair.** A fat lone pair squeezes the bonds closer, so the angle drops below the ideal — which is exactly why CH₄ (0 lp) is $ 109.5^\\circ $, NH₃ (1 lp) is $ 107^\\circ $, and H₂O (2 lp) is $ 104.5^\\circ $." },

    // 14 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**VSEPR questions almost always ask for the shape, the bond angle, or both — and the traps are predictable.**\n\n" +
        "**Multiple bond = one position.** A favourite trap is a molecule with a double or triple bond (CO₂, SO₂, NO₂⁻). Count it as a single region of electron density — never as two.\n\n" +
        "**The angle order they love:** $ \\text{CH}_4 (109.5^\\circ) > \\text{NH}_3 (107^\\circ) > \\text{H}_2\\text{O} (104.5^\\circ) $ — more lone pairs, smaller angle. Be ready to extend it to PH₃ (~94°), where the angle drops even further.\n\n" +
        "**Don't confuse geometry with shape.** \"What is the geometry of H₂O?\" (tetrahedral) is a *different* question from \"What is the shape of H₂O?\" (bent). Read which one is asked.\n\n" +
        "**For ions, put the charge on the central atom first** — then count exactly as usual. NH₄⁺, H₃O⁺ and ClO₃⁻ all reward this one move." },

    // 15 — inline_quiz (§3.6.1)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'In VSEPR theory, the shape of a molecule is decided mainly by which of the following?',
          options: [
            'The total number of protons in the central atom',
            'The arrangement of all electron pairs around the central atom that keeps repulsion to a minimum',
            'The number of neutrons shared between the bonded atoms',
            'The colour and physical state of the molecule at room temperature'
          ],
          correct_index: 1,
          explanation: 'VSEPR says the valence-shell electron pairs (bonding and lone) repel each other and settle into the arrangement of minimum repulsion — that arrangement fixes the shape. The number of protons or neutrons plays no part in shape, and physical properties are a result of shape, not a cause of it.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Water (H₂O) has a steric number of 4 around oxygen, yet its molecular shape is "bent" rather than "tetrahedral". Why?',
          options: [
            'The electron-pair geometry is tetrahedral, but two of the four positions are lone pairs, so the shape — named from the atoms only — is bent',
            'Water actually has a steric number of 2, which gives a bent shape directly',
            'The two O–H bonds repel so strongly that they fold the molecule in half',
            'Oxygen forms a double bond to one hydrogen, which bends the molecule'
          ],
          correct_index: 0,
          explanation: 'Steric number 4 makes the electron-pair geometry tetrahedral, but two corners hold lone pairs with no atom on the end. Since the shape names only where the atoms sit, the visible result is bent. The steric number is genuinely 4 (2 bonds + 2 lone pairs), and hydrogen never forms a double bond.' },
        { id: uuidv4(), difficulty_level: 3,
          question: 'The bond angle falls in the order CH₄ (109.5°) > NH₃ (107°) > H₂O (104.5°), even though all three have a steric number of 4. What best explains this trend?',
          options: [
            'The central atoms get lighter from carbon to oxygen, so the bonds shrink',
            'Each molecule has more bonds than the next, pulling the angle down',
            'As lone pairs increase from 0 to 1 to 2, their stronger repulsion squeezes the bonding pairs closer, shrinking the angle each time',
            'The bonds become more ionic across the series, which reduces the angle'
          ],
          correct_index: 2,
          explanation: 'All three are steric number 4, but lone-pair repulsion is stronger than bond-pair repulsion (lp–lp > lp–bp > bp–bp). CH₄ has 0 lone pairs (full 109.5°), NH₃ has 1 (pressed to 107°), and H₂O has 2 (pressed further to 104.5°). The trend is driven by lone-pair count, not atomic mass, bond number, or ionic character.' },
      ] },

    // 16 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You now own the engine: count the steric number, fix the geometry, forget the lone pairs to name the shape, and let the repulsion order explain every shrunken angle. Next, we'll run that engine across the **full gallery of shapes** — including the trickier high-steric-number ones like **see-saw**, **T-shape**, and **square planar** — so you can name any molecule on sight.*" },
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
    slug: NEW_SLUG, title: 'VSEPR Theory — Why Molecules Take Shape',
    subtitle: 'Electron pairs repel and spread out as far as they can — and that arrangement fixes the shape of the molecule.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'vsepr', 'molecular-shape', 'bond-angle'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  // Wire into chapter 4 page_ids (append at end).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 9 (VSEPR theory)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
