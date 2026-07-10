'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Arc B, Page 10.
 * "The Gallery of Shapes — From Linear to Pentagonal Bipyramidal"
 * Every VSEPR shape from steric number 2 to 7, including the lone-pair-distorted ones,
 * plus the JEE-critical TBP placement rules (lp/multiple bonds equatorial; more
 * electronegative atom axial; axial bonds longer & weaker).
 *
 * Inserts at chapter_number 4, page_number 10 (Arc B build). published:false — founder
 * reviews + generates the pending images (hero + the labelled shape-gallery grid), then
 * publishes. Idempotent (skips if slug exists); appends to ch4 page_ids; snapshotVersion.
 *
 * Reuses the founder's existing VSEPR simulator via simulation_id 'vsepr-shape-lab'
 * (registered in apps/student/features/books/components/reader/BookReader.tsx →
 * app/inorganic-chemistry-hub/VSEPRSimulator.tsx, the founder's own component).
 *
 * Voice: BOND-exemplars.md (jhoola/see-saw §A, awara lone pair §A, TBP placement §B,
 * BrF4⁻ square planar / I3⁻ vs I3⁺ / square pyramidal traps §C) + teacher-voice-profile.md.
 * Grounded in NCERT Class 11 Ch.4 (VSEPR) + standard JEE treatment. Every angle/example
 * verified against NCERT + standard reference; nothing fabricated.
 * Run: node scripts/insert_bond_p10_shapes-gallery.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 10;
const NEW_SLUG = 'molecular-shapes-gallery';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A gallery of molecular shapes — linear, trigonal planar, tetrahedral, see-saw, T-shape, octahedral and pentagonal bipyramidal — arranged like sculptures',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5) styled like a sculpture gallery of molecular shapes. From left to right, a sequence of glowing 3D ball-and-stick molecular geometries on pedestals: a straight linear molecule, a flat trigonal-planar triangle, a tetrahedron, a trigonal bipyramid, a see-saw shape, a T-shape, an octahedron, and a pentagonal bipyramid. Central atoms glow orange; bonded atoms cool blue; a faint translucent lobe marks a lone pair on one or two of them. A sense of progression from simple to complex. Clean scientific 3D illustration style. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style. No dense text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'One Skeleton, Three Faces',
      markdown: "Take five electron pairs around a central atom — the trigonal bipyramidal skeleton. Now play a game: keep all five as bonds and you get $\\ce{PCl5}$. Turn **one** into a lone pair and the molecule bends into a **see-saw** ($\\ce{SF4}$). Turn **two** into lone pairs and it flattens into a **T** ($\\ce{ClF3}$). Turn **three** into lone pairs and it snaps **dead straight** again ($\\ce{XeF2}$). Same five-pair skeleton — four completely different shapes, decided only by how many of those pairs are lonely." },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "On the last few pages you learned the engine of VSEPR: count the **steric number** of the central atom (number of bonded atoms + number of lone pairs), and electron pairs spread out to get as far from each other as possible. That single number fixes the **base geometry**.\n\n" +
      "But the *shape* we actually see — the shape an X-ray would show — is the arrangement of the **atoms only**. A lone pair takes a seat in the geometry, then becomes invisible in the name. So **geometry counts the lone pair; shape forgets it.** Water has a tetrahedral *geometry* (4 pairs) but a *bent* shape, because two of those four seats hold lone pairs you cannot see.\n\n" +
      "So every shape on this page is set by **two** things: the steric number (which sets the skeleton) **and** how many of those positions are lone pairs (which decides which corners go empty). This page is the full gallery — every shape from steric number 2 to 7. Master these structures once and you can answer shape, bond angle, hybridisation, dipole, and lone-pair questions from the same picture." },

    // 3 — heading: SN 2, 3, 4
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Steric Numbers 2, 3 and 4 — the Everyday Shapes',
      objective: 'Read off the shape for steric number 2, 3 and 4, and see how each lone pair bends the molecule.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "**Steric number 2 — linear, $120^\\circ$? No, $180^\\circ$.** Two positions sit on opposite sides of the central atom, as far apart as possible. $\\ce{BeCl2}$ (2 bonds, no lone pair) and $\\ce{CO2}$ (the two double bonds each count as **one** position) are both straight lines at $180^\\circ$.\n\n" +
      "**Steric number 3 — trigonal planar, $120^\\circ$.** Three positions point to the corners of a flat triangle. $\\ce{BF3}$ (3 bonds, no lone pair) is the clean case. Now make one position a lone pair: $\\ce{SO2}$ (2 bonds + 1 lone pair) keeps the triangular *geometry* but its shape is **bent**, and the lone pair's extra push squeezes the angle down to about $119^\\circ$.\n\n" +
      "**Steric number 4 — tetrahedral, $109.5^\\circ$.** Four positions point to the corners of a tetrahedron — and note, this is a 3D spread, **not** a flat $90^\\circ$ cross. $\\ce{CH4}$ (4 bonds) is the perfect tetrahedron at $109.5^\\circ$. Replace one bond with a lone pair → $\\ce{NH3}$, **trigonal pyramidal**, angle pushed down to $107^\\circ$. Replace two bonds with two lone pairs → $\\ce{H2O}$, **bent**, squeezed further to $104.5^\\circ$. The pattern is clear: each lone pair pushes harder than a bond, so every lone pair you add shrinks the bond angle." },

    // 4 — heading: SN 5
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Steric Number 5 — the See-Saw, the T, and Back to Straight',
      objective: 'Work through all four steric-5 shapes and learn why a lone pair always takes an equatorial seat.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Steric number 5 gives the **trigonal bipyramidal** skeleton — and this is where shapes get interesting, because the five seats are **not** all equal. Three of them sit around the middle (the **equatorial** seats, $120^\\circ$ apart) and two stick out top and bottom (the **axial** seats, at $90^\\circ$ to the equatorial ring).\n\n" +
      "**No lone pairs → $\\ce{PCl5}$, trigonal bipyramidal.** All five seats are bonds.\n\n" +
      "**1 lone pair → $\\ce{SF4}$, see-saw.** The lone pair grabs an **equatorial** seat (more room there — explained below), leaving four S–F bonds in a shape that looks exactly like a playground swing: two friends sitting on a *jhoola*, one on each side, swinging. That image — the see-saw — is how you'll remember $\\ce{SF4}$ forever.\n\n" +
      "**2 lone pairs → $\\ce{ClF3}$, T-shape.** Both lone pairs take equatorial seats; the three Cl–F bonds are left in a flat **T**.\n\n" +
      "**3 lone pairs → $\\ce{XeF2}$ (and $\\ce{I3-}$), linear.** All three equatorial seats become lone pairs, leaving the two bonds in the two axial seats — a perfectly straight line at $180^\\circ$. So steric number 5 *ends* linear, just like steric number 2 began." },

    // 5 — reasoning_prompt (mid-page; the signature equatorial-lone-pair logic)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 3,
      prompt: "In $\\ce{SF4}$ (steric number 5, one lone pair) the lone pair sits in an EQUATORIAL position, never axial. Why does equatorial win?",
      options: [
        "An axial seat is physically closer to the central atom, so the lone pair cannot fit there",
        "An axial lone pair would face three nearby bonds at $90^\\circ$, while an equatorial lone pair faces only two at $90^\\circ$ — fewer close repulsions, so equatorial is the lower-energy seat",
        "Equatorial seats always hold the most electronegative atoms, and a lone pair counts as electronegative",
        "The lone pair is attracted to the equatorial plane by the molecule's overall dipole"
      ],
      correct_index: 1,
      reveal: "The deciding rule is: minimise the strongest repulsions, which are the ones at $90^\\circ$. An **axial** position has three neighbours at $90^\\circ$ (the three equatorial seats). An **equatorial** position has only two neighbours at $90^\\circ$ (the two axial seats) — the other two equatorial seats sit comfortably far at $120^\\circ$. A lone pair is fat and pushy (lp repulsion > bp repulsion), so it takes the roomier equatorial seat to make the fewest close enemies. That is exactly why $\\ce{SF4}$ is a see-saw and not the other way round — and the same logic puts every lone pair (and every multiple bond) in an equatorial seat." },

    // 6 — TBP placement rules text (the JEE-critical drill)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "That same crowding logic gives the three **TBP placement rules** examiners love to test:\n\n" +
      "1. **Lone pairs go equatorial.** Equatorial seats are roomier (two $90^\\circ$ neighbours, not three), so the bulky lone pairs sit there — the rule behind see-saw, T-shape and linear above.\n" +
      "2. **Multiple bonds go equatorial too.** A double or triple bond is electron-rich and pushy, just like a lone pair, so it also claims an equatorial seat.\n" +
      "3. **The more electronegative atom goes axial.** An electronegative atom pulls bonding electrons toward itself, thinning the cloud near the central atom — that thinner cloud can tolerate the more crowded axial seat. So in mixed molecules like $\\ce{PCl3F2}$, the fluorines sit axial.\n\n" +
      "One more fact that follows: in a trigonal bipyramid the **axial bonds are slightly longer and therefore weaker** than the equatorial ones (the axial bonds face more $90^\\circ$ repulsion). That is why, when you heat $\\ce{PCl5}$, the **axial** P–Cl bonds break first." },

    // 7 — image: labelled shape gallery grid (the heart's companion)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'A labelled grid of every VSEPR shape from steric number 2 to 7, each with its example molecule, bond angle and lone-pair count',
      caption: '📸 The full gallery — every shape, its example, and its angle in one frame',
      generation_prompt: 'A neat labelled grid (gallery) of 3D ball-and-stick molecular geometries, one cell per shape, arranged by steric number. Cells, in order: (SN2) linear — BeCl2, 180°; (SN3) trigonal planar — BF3, 120°, and bent — SO2, ~119°; (SN4) tetrahedral — CH4, 109.5°, trigonal pyramidal — NH3, 107°, and bent — H2O, 104.5°; (SN5) trigonal bipyramidal — PCl5, see-saw — SF4, T-shape — ClF3, and linear — XeF2; (SN6) octahedral — SF6, square pyramidal — BrF5, and square planar — XeF4; (SN7) pentagonal bipyramidal — IF7. Each geometry shows the central atom in orange, bonded atoms in cool blue, and any lone pair as a faint translucent lobe. Small clean labels under each cell give the shape name, example molecule and angle. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 8 — simulation: founder's VSEPR sim, predict-first (placed after SN-5 shapes)
    { id: uuidv4(), order: n(), type: 'simulation', simulation_id: 'vsepr-shape-lab',
      title: 'VSEPR Shape Lab — rotate and explore every shape',
      prediction: {
        prompt: 'SF₄ has 4 bonded F atoms and 1 lone pair on sulfur (steric number 5). What shape results?',
        options: ['Trigonal bipyramidal', 'See-saw', 'Square planar', 'Tetrahedral'],
        reveal_after: 'See-saw. With steric number 5 the base geometry is trigonal bipyramidal, but the lone pair takes an EQUATORIAL position (more room there), leaving the four S–F bonds in a see-saw arrangement — like two friends on a swing. Putting the lone pair axial would crowd it against three equatorial bonds at 90°, which is why equatorial wins.'
      } },

    // 9 — heading: SN 6 and 7
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Steric Numbers 6 and 7 — the Square Shapes and the Big One',
      objective: 'Finish the gallery: octahedral down to square planar, and the seven-seat pentagonal bipyramid.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "**Steric number 6 — octahedral, $90^\\circ$.** Six positions point to the six corners of an octahedron, all $90^\\circ$ apart and all equivalent. $\\ce{SF6}$ (6 bonds, no lone pair) is the clean octahedron.\n\n" +
      "**1 lone pair → $\\ce{BrF5}$ (and $\\ce{IF5}$), square pyramidal.** Five bonds plus one lone pair. The lone pair takes one corner; the five F atoms are left as a square base with one F at the apex — a pyramid on a square. **Square pyramidal always means 5 bonds + 1 lone pair** ($\\ce{IF5}$, $\\ce{BrF5}$, $\\ce{ClF5}$, $\\ce{XeOF4}$).\n\n" +
      "**2 lone pairs → $\\ce{XeF4}$ (and $\\ce{BrF4-}$), square planar.** Now the two lone pairs sit **opposite** each other (trans, $180^\\circ$ apart — as far from each other as possible), leaving the four F atoms in a flat square. Those two lone pairs are the *awara* (wandering) pairs with no special corner to call home — but pinned opposite each other, they let the four bonds settle into a perfect plane.\n\n" +
      "**Steric number 7 — pentagonal bipyramidal, $\\ce{IF7}$.** Seven bonds: five F atoms in a flat pentagon around the middle ($72^\\circ$ apart) and two more axial, top and bottom. This is the largest common shape you'll meet in Class 11." },

    // 10 — table: the heart of the page — SN → bonds/lp → shape → angle → example
    { id: uuidv4(), order: n(), type: 'table', caption: 'The master VSEPR table — steric number and lone-pair count fix every shape',
      headers: ['Steric no.', 'Bonds', 'Lone pairs', 'Shape', 'Angle', 'Example'],
      rows: [
        ['2', '2', '0', 'Linear', '180°', 'BeCl₂, CO₂'],
        ['3', '3', '0', 'Trigonal planar', '120°', 'BF₃'],
        ['3', '2', '1', 'Bent', '~119°', 'SO₂'],
        ['4', '4', '0', 'Tetrahedral', '109.5°', 'CH₄'],
        ['4', '3', '1', 'Trigonal pyramidal', '107°', 'NH₃'],
        ['4', '2', '2', 'Bent', '104.5°', 'H₂O'],
        ['5', '5', '0', 'Trigonal bipyramidal', '120° / 90°', 'PCl₅'],
        ['5', '4', '1', 'See-saw', '~178° / ~102°', 'SF₄'],
        ['5', '3', '2', 'T-shape', '~87.5°', 'ClF₃'],
        ['5', '2', '3', 'Linear', '180°', 'XeF₂, I₃⁻'],
        ['6', '6', '0', 'Octahedral', '90°', 'SF₆'],
        ['6', '5', '1', 'Square pyramidal', '~85°', 'BrF₅, IF₅'],
        ['6', '4', '2', 'Square planar', '90°', 'XeF₄, BrF₄⁻'],
        ['7', '7', '0', 'Pentagonal bipyramidal', '72° / 90°', 'IF₇'],
      ] },

    // 11 — worked example 1: ClF3
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Shape of ClF₃',
      problem: "Predict the shape of chlorine trifluoride, $\\ce{ClF3}$, and explain why it is not a flat triangle like $\\ce{BF3}$.",
      solution: "Find the steric number of the central chlorine, then place the lone pairs.\n\n" +
        "**Count valence electrons on Cl:** chlorine has 7.\n\n" +
        "**Bonds used:** three Cl–F single bonds use 3 electrons, leaving 4.\n\n" +
        "**Lone pairs:** those 4 leftover electrons make **2 lone pairs**.\n\n" +
        "**Steric number** $= 3 \\text{ bonds} + 2 \\text{ lone pairs} = 5$ → trigonal bipyramidal skeleton.\n\n" +
        "**Place the lone pairs:** both go **equatorial** (roomier seats — the rule from above). That leaves the three Cl–F bonds in the two axial seats plus one equatorial seat.\n\n" +
        "**Shape: T-shaped.** The two equatorial lone pairs push the axial F atoms slightly inward, so the angle is about $87.5^\\circ$, not a clean $90^\\circ$.\n\n" +
        "It is **not** a flat triangle like $\\ce{BF3}$ because $\\ce{BF3}$ has steric number 3 (no lone pairs); $\\ce{ClF3}$ has two extra lone pairs that change the whole skeleton from a triangle to a trigonal bipyramid." },

    // 12 — worked example 2: XeF4
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Shape of XeF₄',
      problem: "Predict the shape of xenon tetrafluoride, $\\ce{XeF4}$. A student guesses tetrahedral, like $\\ce{CH4}$. Where do they go wrong?",
      solution: "Count the steric number of xenon, then place the lone pairs.\n\n" +
        "**Valence electrons on Xe:** xenon has 8.\n\n" +
        "**Bonds used:** four Xe–F single bonds use 4 electrons, leaving 4.\n\n" +
        "**Lone pairs:** those 4 leftover electrons make **2 lone pairs**.\n\n" +
        "**Steric number** $= 4 \\text{ bonds} + 2 \\text{ lone pairs} = 6$ → octahedral skeleton.\n\n" +
        "**Place the lone pairs:** in an octahedron the two lone pairs go **opposite** each other (trans, $180^\\circ$ apart) to stay as far from each other as possible. That leaves the four F atoms in a flat square.\n\n" +
        "**Shape: square planar**, with $90^\\circ$ F–Xe–F angles.\n\n" +
        "The student went wrong by counting only the bonds. Four bonds *looks* like $\\ce{CH4}$, but $\\ce{CH4}$ has **no** lone pairs (steric number 4), while $\\ce{XeF4}$ has **two** (steric number 6). Those two extra lone pairs flatten it from a tetrahedron into a square plane." },

    // 13 — remember callout (geometry vs shape recap; equatorial lone pairs)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'Geometry vs Shape — The One Idea',
      markdown: "**Steric number sets the geometry; lone pairs decide the shape.**\n\n" +
        "- **Geometry counts the lone pairs; shape forgets them.** $\\ce{H2O}$ has tetrahedral *geometry* but a *bent* shape.\n" +
        "- **Each lone pair shrinks the bond angle** (lp–lp > lp–bp > bp–bp repulsion): $\\ce{CH4}$ $109.5^\\circ$ → $\\ce{NH3}$ $107^\\circ$ → $\\ce{H2O}$ $104.5^\\circ$.\n" +
        "- **In a trigonal bipyramid, lone pairs and multiple bonds always take the roomier equatorial seats.** That single rule generates see-saw, T-shape and linear from the same five-seat skeleton." },

    // 14 — exam_tip callout (JEE traps)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "The shapes that catch students out are almost always the lone-pair ones. Memorise these reflexes:\n\n" +
        "**$\\ce{BrF4-}$ is square planar, not pyramidal.** Bromine in $\\ce{BrF4-}$ carries the extra negative charge → 8 valence electrons → 4 bonds + 2 lone pairs → square planar, *just like* $\\ce{XeF4}$. The bait answer is \"pyramidal\".\n\n" +
        "**$\\ce{I3-}$ is linear, but $\\ce{I3+}$ is bent.** Two electrons fewer in $\\ce{I3+}$ means the central iodine has 2 bonds + **2** lone pairs (steric number 4) → bent. Don't carry the linear $\\ce{I3-}$ picture over.\n\n" +
        "**Square pyramidal = 5 bonds + 1 lone pair**, always ($\\ce{IF5}$, $\\ce{BrF5}$, $\\ce{ClF5}$, $\\ce{XeOF4}$). If a species has 4 bonds + 2 lone pairs it is square *planar*, not pyramidal.\n\n" +
        "**Axial bonds in a TBP are longer and weaker** than equatorial ones — the classic \"incorrect statement\" bait is \"axial bonds are stronger\". They are not; that is why $\\ce{PCl5}$ loses its axial bonds first on heating." },

    // 15 — inline_quiz (§3.6.1), LAST
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'A central atom has a steric number of 5 with no lone pairs. What is its shape?',
          options: [
            'Square pyramidal',
            'Trigonal bipyramidal',
            'Octahedral',
            'Pentagonal bipyramidal'
          ],
          correct_index: 1,
          explanation: 'Steric number 5 with all five positions used as bonds gives a trigonal bipyramid (e.g. PCl₅). Square pyramidal and octahedral belong to steric number 6, and pentagonal bipyramidal to steric number 7 — each has more positions than five.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'In a trigonal bipyramidal arrangement, why does a lone pair always occupy an equatorial position rather than an axial one?',
          options: [
            'An axial position is closer to the nucleus, so a lone pair cannot fit there',
            'An equatorial lone pair has only two neighbours at $90^\\circ$, whereas an axial one has three — fewer strong repulsions, so equatorial is lower in energy',
            'Equatorial positions are reserved for the most electronegative atoms',
            'A lone pair carries no charge, so its position makes no difference to the energy'
          ],
          correct_index: 1,
          explanation: 'The strongest repulsions are the $90^\\circ$ ones. An axial seat faces three $90^\\circ$ neighbours; an equatorial seat faces only two (the rest sit far away at $120^\\circ$). A bulky lone pair therefore takes the roomier equatorial seat — the rule that produces the see-saw, T-shape and linear shapes.' },
        { id: uuidv4(), difficulty_level: 3,
          question: 'Which of these species is square planar?',
          options: [
            'BrF₅, because it has five bonds and one lone pair',
            'XeF₄, because xenon has 4 bonds and 2 lone pairs (steric number 6) with the lone pairs trans to each other',
            'SF₄, because the lone pair sits equatorial in a trigonal bipyramid',
            'ClF₃, because its two lone pairs flatten it into a plane'
          ],
          correct_index: 1,
          explanation: 'XeF₄ has steric number 6 (4 bonds + 2 lone pairs); the two lone pairs sit opposite each other, leaving the four F atoms in a flat square — square planar. BrF₅ (5 bonds + 1 lp) is square pyramidal; SF₄ (4 bonds + 1 lp) is see-saw; ClF₃ (3 bonds + 2 lp) is T-shaped — none of these is square planar.' },
      ] },

    // 16 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now name every shape from a steric number and a lone-pair count. But notice the angles aren't always the textbook ideals — $\\ce{NH3}$ is $107^\\circ$, $\\ce{H2O}$ is $104.5^\\circ$, $\\ce{PH3}$ is far lower. What fine-tunes the **exact** angle? Next we meet the two rules that explain those last few degrees — **Bent's rule** and **Drago's rule**.*" },
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
    slug: NEW_SLUG, title: 'The Gallery of Shapes — From Linear to Pentagonal Bipyramidal',
    subtitle: 'Every VSEPR shape from steric number 2 to 7 — set by the steric number AND how many pairs are lone.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'vsepr', 'molecular-shape', 'geometry'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 10 (gallery of molecular shapes)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
