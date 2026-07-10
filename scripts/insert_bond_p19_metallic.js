'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 19.
 * "Metallic Bonding — The Sea of Electrons" (electron-sea / electron-gas model,
 * metallic properties, bond-strength factors, band theory: conductor / semiconductor / insulator).
 * Inserts at page_number 19 and appends to ch4 page_ids. published:false — founder reviews +
 * generates the 2 pending images, then publishes.
 * Voice: teacher-voice-profile.md (FORMAT v2 moves; no BOND chapter exemplar bank entry —
 * §2 translation rules applied: everyday analogy at the confusion point, honest calibration).
 * Grounded in: Shishir Mittal §19.3 (Metallic Bond) re-expressed in our voice +
 * NCERT Class 11 Ch.4 + standard JEE treatment of band theory (Mittal is thin on bands).
 * Run: node scripts/insert_bond_p19_metallic.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 19;
const NEW_SLUG = 'metallic-bonding-band-theory';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A lattice of metal cations bathed in a glowing, flowing sea of delocalised electrons',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5 ratio). A regular three-dimensional lattice of identical positive metal ions (small glowing orange spheres marked with a + sign) arranged in neat rows, completely immersed in a luminous, flowing blue sea of tiny electrons that drift freely through every gap between the ions. Convey the idea of fixed positive cores held together by a shared, mobile ocean of negative charge. Soft motion blur on the electron sea to show flow. Cool blue glow against warm orange ion cores. Clean technical illustration style. Dark background (#0a0a0a or near-black). No text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Bend It vs Break It',
      markdown: "A single gram of gold can be hammered into a sheet so thin you can almost see light through it — and you can keep hammering without it ever snapping. Yet tap a crystal of common salt with a hammer and it **shatters** into pieces. Both are solids held together by strong forces. So why does the metal bend and flow while the salt crystal cracks? The answer is a completely different *kind* of bond — one where the electrons don't belong to anyone." },

    // 2 — core concept text (electron-sea model)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "In a metal, the outermost (valence) electrons are held very loosely. So loosely, in fact, that they let go of their parent atoms altogether and start wandering through the whole piece of metal. What's left behind is a neat, regular lattice of **positive metal ions** (the cations), and washing over and around them is a **\"sea\" of free, mobile electrons**.\n\n" +
      "This is the **electron-sea model** (also called the **electron-gas model**). The metallic bond is simply the **electrostatic attraction between the fixed positive ions and the shared sea of negative electrons** that surrounds them. No electron belongs to any one atom — they are **delocalised**, free to drift across the entire crystal.\n\n" +
      "Picture a tray of marbles set in a slab of jelly, with a thin layer of water flowing freely through every gap: the marbles (cations) stay in place, but the water (electrons) moves everywhere and glues the whole thing together. That shared, flowing pool of electrons is the single idea that explains almost everything a metal does." },

    // 3 — heading: the electron-sea model
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Electron-Sea Model',
      objective: 'Picture a metal as fixed positive ions in a shared sea of mobile electrons — and see why that one image is the whole bond.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Why do metal atoms behave this way? Because metals sit on the **left of the periodic table** — they have few valence electrons and low ionisation energies, so giving up those outer electrons costs very little. But there is no electron-hungry non-metal nearby to *take* them (as in ionic bonding). So instead of transferring, every atom simply **contributes its valence electrons to a common pool** that all the ions share.\n\n" +
      "The result is held together because each positive ion is attracted to the negative electron sea in *every* direction at once. Crucially, this attraction is **non-directional** — the bond doesn't point one specific way the way a covalent bond does. That single feature, non-directional bonding, is what makes metals so different from the brittle, directional ionic and covalent solids you met earlier in this chapter." },

    // 4 — image: electron-sea model
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '4:3',
      alt: 'Cross-section of a metal lattice: positive ions in fixed positions surrounded by a sea of free electrons',
      caption: '📸 Fixed positive ions, bathed in a shared sea of free electrons — the metallic bond',
      generation_prompt: 'Electron-sea model of a metallic bond, cross-sectional diagram. A regular square grid of identical positive metal ions, each drawn as a sphere labelled with a + sign, sitting in fixed lattice positions. Filling all the space between and around the ions, draw many small free electrons (labelled e⁻) with light motion trails to show they drift freely throughout the metal. Add a small arrow and label pointing to the attraction between a + ion and the surrounding electrons, labelled "metallic bond = ion ↔ electron-sea attraction". Label: Positive metal ions (cations), Sea of delocalised electrons (e⁻), Metallic bond. Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 5 — heading: explaining metallic properties
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Metals Behave Like Metals',
      objective: 'Use the one electron-sea picture to explain conductivity, malleability, lustre and high melting points all at once.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Almost every familiar property of a metal falls straight out of the electron-sea picture:\n\n" +
      "1. **Electrical & thermal conductivity.** The electrons are free to move. Apply a voltage and the whole sea drifts in one direction — that flow *is* an electric current. Heat one end and the fast-moving electrons carry that energy quickly to the other end. (This is why ionic solids, where charges are locked in the lattice, do **not** conduct in the solid state — there are no free charges to move.)\n\n" +
      "2. **Malleability & ductility.** Hammer a metal and one layer of ions slides over the next. Because the electron sea is everywhere and the bond is non-directional, the bonding survives the slide — the sea just flows to fill the new arrangement and keeps holding the ions together. So the metal **bends and reshapes instead of breaking**.\n\n" +
      "   Contrast an **ionic crystal**: push one layer and you suddenly line up like charges next to like charges (+ next to +). They violently repel and the crystal **shatters**. That is the difference between the bendable gold sheet and the shattering salt crystal from the start of this page.\n\n" +
      "3. **Metallic lustre.** The mobile electrons absorb light of all wavelengths and re-emit it, giving metals their characteristic shine.\n\n" +
      "4. **High melting points (for most metals).** Pulling the lattice apart means fighting the strong, all-around attraction between the ions and the electron sea, which usually takes a lot of energy." },

    // 6 — reasoning_prompt (mid-page, after the properties section)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'causal', difficulty_level: 2,
      prompt: "Solid sodium chloride does not conduct electricity, but a block of solid copper does. Both are held together by strong forces. What is the real reason for the difference?",
      options: [
        "Copper has stronger bonds than NaCl, and stronger bonds always conduct",
        "In copper the valence electrons are delocalised and free to move, so they can carry current; in solid NaCl every charge is locked into a fixed lattice position with nothing free to move",
        "NaCl has no charged particles at all, so there is nothing to carry a current",
        "Copper is a much larger crystal, and bigger crystals always conduct"
      ],
      correct_index: 1,
      reveal: "Conduction needs **free, mobile charges**. A metal like copper has a sea of delocalised electrons that drift freely — apply a voltage and that flow is the current. Solid NaCl is full of charges (Na⁺ and Cl⁻ ions), but they are clamped into fixed lattice sites, so nothing can move and it stays an insulator. Melt it or dissolve it and the ions are freed — *then* it conducts. Bond strength and crystal size are not the point; **mobile charge is**." },

    // 7 — heading: bond-strength factors
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'What Makes a Metallic Bond Strong?',
      objective: 'Predict from valence-electron count and ion size why sodium is soft and low-melting while iron is hard and high-melting.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Not all metallic bonds are equally strong. Two factors decide the strength:\n\n" +
      "1. **Number of delocalised electrons per atom.** The more valence electrons each atom throws into the sea, the denser the electron pool and the stronger the attraction. Sodium contributes just **1** electron per atom; a transition metal like iron contributes **several**. A denser sea grips the ions far more tightly.\n\n" +
      "2. **Charge and size of the cation.** A smaller, more highly charged ion sits closer to the electron sea and pulls on it harder. A large ion (like Na⁺) holds the sea more weakly.\n\n" +
      "Put together: **sodium** — one electron per atom, a fairly large ion — has a *weak* metallic bond. It is soft enough to cut with a knife and melts at just 98 °C. **Transition metals** like iron or tungsten — many electrons in the sea, small highly-charged ions — have *very strong* bonds, so they are hard and melt at thousands of degrees. The trend in melting points and hardness across the metals is really a trend in how tightly the electron sea is held." },

    // 8 — worked example: explain malleability (tap to reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Why Metals Bend but Salts Crack',
      problem: "Using the electron-sea model, explain why a copper wire can be bent and drawn into a thin strand without breaking, while a crystal of $ \\ce{NaCl} $ shatters when struck.",
      solution: "Compare what happens when one layer of particles slides over the next.\n\n" +
        "**Copper (metallic bond).** The bond is the attraction between fixed positive ions and a *non-directional* sea of free electrons. When a layer of copper ions slides, the electron sea simply flows along and keeps surrounding the ions — the attraction is still there in every direction.\n\n" +
        "So the bond is **not broken** by the slide; the metal just takes a new shape. This is malleability (sheets) and ductility (wires).\n\n" +
        "**Sodium chloride (ionic bond).** Here the bond is the attraction between alternating Na⁺ and Cl⁻ ions in a rigid, *directional* arrangement. Strike it hard enough to slide one layer, and now Na⁺ ends up facing Na⁺ and Cl⁻ faces Cl⁻.\n\n" +
        "Like charges **repel violently**, the layers fly apart, and the crystal **shatters** along clean planes.\n\n" +
        "**Answer:** Copper bends because the mobile, non-directional electron sea survives the slide; $ \\ce{NaCl} $ shatters because sliding forces like charges together and they repel. **Same idea — non-directional bonding — explains the whole difference.**" },

    // 9 — heading: band theory
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Band Theory — The Deeper Picture',
      objective: 'See how merged atomic orbitals form energy bands, and how the band gap decides conductor, semiconductor or insulator.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The electron-sea model explains the *what* beautifully. **Band theory** explains the *why* at the level of orbitals — and it's what lets us tell a conductor, a semiconductor and an insulator apart.\n\n" +
      "When two atoms come close, their atomic orbitals combine into molecular orbitals. Now bring **billions** of atoms together in a metal crystal: those orbitals merge into so many closely-spaced energy levels that they blur into near-continuous **bands** of allowed energy. Two bands matter:\n\n" +
      "- the **valence band** — the lower band, filled with the bonded (valence) electrons; and\n" +
      "- the **conduction band** — a higher band where electrons are free to move and carry current.\n\n" +
      "Between them can lie a forbidden zone with no allowed energies: the **band gap**. The key idea: an electron can only carry current once it reaches the conduction band — and the **band gap is the size of the jump it must make to get there.** Whether that jump is zero, small, or huge is what sorts every solid into one of three classes.\n\n" +
      "**Conductor (a metal).** The valence and conduction bands **overlap** — there is no gap at all. Electrons spill into the conduction band freely, so current flows easily. (Heating a metal actually makes it conduct slightly *worse*, because the jiggling ions get in the electrons' way.)\n\n" +
      "**Insulator.** The band gap is **very large**. Electrons simply cannot get the energy to jump to the conduction band, so no current flows — think of diamond or rubber.\n\n" +
      "**Semiconductor.** The band gap is **small**. At low temperature almost no electrons can cross it, so it barely conducts. But add a little energy — heat or light — and some electrons make the jump. So unlike a metal, a semiconductor's conductivity **rises as temperature rises**. Silicon ( $ \\ce{Si} $ ) and germanium ( $ \\ce{Ge} $ ) are the classic examples. Adding tiny amounts of an impurity — called **doping** — tunes them further: a donor impurity gives **n-type** (extra electrons), an acceptor gives **p-type** (extra positive \"holes\"), and that control is the foundation of every chip and transistor." },

    // 10 — image: band-gap diagram
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '4:3',
      alt: 'Band diagrams for a conductor, semiconductor and insulator showing valence band, conduction band and band gap',
      caption: '📸 The band gap decides everything: overlap → conductor, small gap → semiconductor, large gap → insulator',
      generation_prompt: 'Band theory comparison diagram showing three vertical energy-band charts side by side, labelled Conductor (metal), Semiconductor, and Insulator. In each chart show a lower filled band labelled "Valence band" and an upper band labelled "Conduction band", with energy increasing upward. For the Conductor: the valence and conduction bands overlap with no gap. For the Semiconductor: a small empty space between them labelled "small band gap", with a couple of electrons drawn jumping the gap. For the Insulator: a tall empty space between them labelled "large band gap" that electrons cannot cross. Use a vertical arrow on the left labelled "Energy". Label: Valence band, Conduction band, Band gap, Energy. Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 11 — table: conductor vs semiconductor vs insulator
    { id: uuidv4(), order: n(), type: 'table', caption: 'The band gap sorts every solid into one of three classes',
      headers: ['Property', 'Conductor (metal)', 'Semiconductor', 'Insulator'],
      rows: [
        ['Band gap', 'None — bands overlap', 'Small', 'Very large'],
        ['Conductivity', 'High', 'Moderate / tunable', 'Negligible'],
        ['Effect of heating', 'Conductivity falls', 'Conductivity rises', 'Stays non-conducting'],
        ['Example', 'Copper, iron', 'Silicon, germanium', 'Diamond, rubber'],
      ] },

    // 12 — worked example: classify by band gap (tap to reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Classify by Band Gap',
      problem: "Three solids have band gaps of (i) effectively 0 (bands overlap), (ii) about 1.1 eV, and (iii) about 5.5 eV. Classify each as a conductor, semiconductor or insulator, and say how each one's conductivity changes when you heat it.",
      solution: "Match each band gap to its class, then reason about heating.\n\n" +
        "**(i) Gap ≈ 0 (overlap) → Conductor.** Electrons reach the conduction band freely, so it conducts well at once. On heating, the conductivity **falls slightly** — the vibrating ions scatter the moving electrons.\n\n" +
        "**(ii) Gap ≈ 1.1 eV → Semiconductor** (this is silicon's gap). The gap is small, so a little heat or light lets some electrons jump across. On heating, **conductivity rises** — more electrons make the jump.\n\n" +
        "**(iii) Gap ≈ 5.5 eV → Insulator** (this is diamond's gap). The gap is far too wide for electrons to cross under ordinary conditions, so it does **not** conduct, and heating does not meaningfully change that.\n\n" +
        "**Answer:** (i) conductor, conductivity falls on heating; (ii) semiconductor, conductivity rises on heating; (iii) insulator, stays non-conducting. **The temperature behaviour is the giveaway: a metal gets *worse* with heat, a semiconductor gets *better*.**" },

    // 13 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Two Ideas to Keep',
      markdown: "**1. Electron sea.** A metal is positive ions in a shared sea of free, delocalised electrons. That one picture gives you everything: **mobile electrons → conductivity and lustre; non-directional bond → malleability and ductility** (layers slide without breaking, unlike brittle ionic crystals).\n\n" +
        "**2. Band gap.** Atomic orbitals merge into a filled **valence band** and an empty **conduction band**. **Overlap → conductor, small gap → semiconductor, large gap → insulator.** The band gap is just the size of the jump an electron must make to start carrying current." },

    // 14 — exam_tip callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Property questions are really electron-sea questions.** If a question asks *why* a metal conducts, is malleable, or has lustre — trace it back to free, delocalised electrons and the non-directional bond. Bond-strength comparisons (Na soft vs W hard) come down to **number of delocalised electrons + cation size/charge**.\n\n" +
        "**Band-gap classification is a guaranteed pattern.** No gap / overlap = conductor, small gap = semiconductor, large gap = insulator. Know $ \\ce{Si} $ and $ \\ce{Ge} $ as the semiconductor examples and doping (n-type / p-type) as a one-line fact.\n\n" +
        "**The favourite trap: temperature dependence.** A metal's conductivity **decreases** with temperature; a semiconductor's **increases**. Examiners love *\"a substance whose conductivity increases on heating is…\"* → semiconductor, never a metal. Don't mix these up." },

    // 15 — inline_quiz (§3.6.1) — LAST content/test block before bridge
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'In the electron-sea model of a metallic bond, what holds the metal together?',
          options: [
            'The electrostatic attraction between fixed positive metal ions and a shared sea of mobile electrons',
            'Pairs of electrons shared directionally between two neighbouring metal atoms',
            'Complete transfer of electrons from one metal atom to another, forming ions of opposite charge',
            'Hydrogen bonds linking the surfaces of neighbouring metal atoms'
          ],
          correct_index: 0,
          explanation: 'A metal is a lattice of positive ions immersed in a sea of delocalised electrons; the bond is the all-around attraction between the two. Directional shared pairs describe a covalent bond, full transfer describes an ionic bond, and hydrogen bonding is a weak intermolecular force — none of which is the metallic bond.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A metal can be hammered into a thin sheet without breaking, but an ionic crystal shatters when struck. The best explanation is that:',
          options: [
            'Metallic bonds are far weaker than ionic bonds, so the metal simply gives way',
            'In a metal, sliding layers stay bonded because the non-directional electron sea flows with them; in an ionic crystal, sliding brings like charges together and they repel',
            'Ionic crystals contain no bonds along the planes where they crack',
            'Metals have no fixed structure, so their atoms can be rearranged freely with no resistance'
          ],
          correct_index: 1,
          explanation: 'Because the electron sea is non-directional, sliding one layer of metal ions over another keeps the bonding intact, so the metal deforms instead of breaking. In an ionic solid, sliding lines up like charges (+ next to +), which repel and split the crystal. It is not about overall bond strength, and metals do have a fixed lattice.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A certain pure solid barely conducts electricity at room temperature, but its conductivity clearly increases as it is heated. Based on band theory, this solid is most likely a:',
          options: [
            'Conductor, because all solids conduct better when hot',
            'Insulator, because its band gap is far too large for any electrons to cross',
            'Semiconductor, because its small band gap lets more electrons jump into the conduction band as temperature rises',
            'Conductor, because heating closes the overlap between its bands'
          ],
          correct_index: 2,
          explanation: 'Conductivity that rises with temperature is the signature of a semiconductor: its small band gap means extra heat pushes more electrons across into the conduction band. A metal does the opposite (its conductivity falls when heated, as vibrating ions scatter the electrons), and an insulator stays non-conducting because its gap is too wide to cross.' },
      ] },

    // 16 — bridge to next page (Hydrogen bonding)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You've now met all the strong bonds — ionic, covalent and metallic — the forces that build molecules and materials from the inside. Next, we step **between** molecules to a weaker but astonishing force that boils water, shapes DNA, and lets ice float: **hydrogen bonding.***" },
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
    slug: NEW_SLUG, title: 'Metallic Bonding — The Sea of Electrons',
    subtitle: 'Positive ions in a shared sea of free electrons — and how the band gap sorts conductors, semiconductors and insulators.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'metallic-bond', 'band-theory', 'semiconductor'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 19 (metallic bonding & band theory)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
