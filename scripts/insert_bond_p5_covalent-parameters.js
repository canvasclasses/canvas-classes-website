'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 5.
 * "The Covalent Bond & Bond Parameters" (bond length, bond enthalpy, bond order, bond angle — overview).
 * Inserts at chapter_number 4, page_number 5. Appends to ch4 page_ids (no shifting needed
 * because this is the next page after the existing run). published:false — founder reviews +
 * generates the 2 pending images, then publishes.
 * Voice: BOND-exemplars.md (the "danda"/bond-line honesty; "compare only what differs";
 * honest difficulty calibration) + teacher-voice-profile.md (FORMAT v2).
 * Grounded in NCERT Class 11 Ch.4 (Bond Parameters section) + standard JEE treatment.
 * Run: node scripts/insert_bond_p5_covalent-parameters.js   ← DO NOT auto-run; founder runs.
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 5;
const NEW_SLUG = 'covalent-bond-parameters';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'Three carbon-carbon bonds side by side — single, double, triple — getting shorter and stronger from left to right',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). Three pairs of carbon atoms shown side by side, left to right: a single bond (one luminous line, atoms far apart), a double bond (two luminous lines, atoms closer), and a triple bond (three luminous lines, atoms closest). A subtle ruler/scale beneath visually shows the distance between nuclei SHRINKING from left to right, while a glowing strength gauge rises. A clear visual story of "more bonds → shorter and stronger". Clean scientific illustration style. Dark background (#0a0a0a or near-black), orange accent labels. No text other than faint tick marks.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Strongest Bond in the Air You Breathe',
      markdown: "Every breath you take is **78% nitrogen**, $\\ce{N2}$ — and that nitrogen does almost nothing. It won't burn, won't react, just drifts past. The reason is hidden in *one* number: the **triple bond** locking the two nitrogen atoms together is one of the strongest bonds in all of chemistry — around **945 kJ to break a single mole of it.** Prise that bond open even a little and you understand fertilisers, explosives, and why life had to invent special machinery just to use the nitrogen sitting right in front of it. A bond's *strength* and *length* aren't trivia — they decide what a molecule will and won't do." },

    // 2 — core concept text: the covalent bond
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "On the last pages you saw atoms reach an octet by **sharing** electrons. That shared arrangement is the **covalent bond**: a pair of electrons held *jointly* between two nuclei, counted by both atoms toward their own octet.\n\n" +
      "Atoms can share more than one pair:\n\n" +
      "- **One** shared pair → a **single bond**, drawn as one line. Example: $\\ce{H-H}$ in $\\ce{H2}$.\n" +
      "- **Two** shared pairs → a **double bond**, two lines. Example: $\\ce{O=O}$ in $\\ce{O2}$.\n" +
      "- **Three** shared pairs → a **triple bond**, three lines. Example: $\\ce{N#N}$ in $\\ce{N2}$.\n\n" +
      "A small preview you'll cash in later: the *first* shared pair forms a **sigma ($\\sigma$) bond** (a strong, head-on overlap), and any *extra* pairs form weaker **pi ($\\pi$) bonds** (a side-on overlap). So a double bond is one $\\sigma$ + one $\\pi$, and a triple bond is one $\\sigma$ + two $\\pi$. *Why* that is — and why $\\pi$ bonds are the reactive ones — is the full job of the bonding-theory (VBT) page ahead. For now we only need the headcount of shared pairs, because that count controls four measurable numbers that describe every covalent bond. Those four numbers are the **bond parameters**." },

    // 3 — heading: bond length
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Bond Length — How Far Apart the Nuclei Sit',
      objective: 'Predict which of two bonds is shorter from bond order and atomic size alone.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "**Bond length is the equilibrium distance between the nuclei of two bonded atoms** — the comfortable separation where attraction and repulsion balance. It is measured in **picometres (pm)** or **ångströms** ($1\\ \\text{Å} = 100\\ \\text{pm}$), using techniques like X-ray diffraction and spectroscopy.\n\n" +
      "Two things decide it:\n\n" +
      "1. **Bond order (number of shared pairs).** More shared pairs pull the nuclei *closer*. For carbon–carbon: $\\ce{C-C}$ is about **154 pm**, $\\ce{C=C}$ about **134 pm**, $\\ce{C#C}$ about **120 pm**. The same trend holds for $\\ce{C-O}$ vs $\\ce{C=O}$, $\\ce{N-N}$ vs $\\ce{N#N}$, and so on — *higher bond order, shorter bond.*\n" +
      "2. **Atomic size (and s-character).** Bigger atoms sit farther apart: $\\ce{H-H}$ is only ~74 pm, while $\\ce{Cl-Cl}$ is ~199 pm. (A finer effect — more *s-character* in the bonding orbital also shortens a bond — is something the hybridisation page will make precise.)\n\n" +
      "A handy idea: each kind of atom contributes a roughly fixed **covalent radius**, and a single-bond length is close to the *sum* of the two radii. So you can estimate a bond length before you ever measure it." },

    // 4 — image: C-C vs C=C vs C#C decreasing length / increasing strength
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Carbon-carbon single, double and triple bonds compared, showing decreasing length and increasing bond enthalpy',
      caption: '📸 More shared pairs pull the carbons closer AND make the bond harder to break',
      generation_prompt: 'Clean comparison diagram, three rows. Row 1: two carbon atoms joined by a SINGLE bond, labelled "C–C, 154 pm, 347 kJ/mol". Row 2: two carbon atoms joined by a DOUBLE bond, drawn closer together, labelled "C=C, 134 pm, 611 kJ/mol". Row 3: two carbon atoms joined by a TRIPLE bond, drawn closest, labelled "C≡C, 120 pm, 837 kJ/mol". A downward arrow on the left labelled "bond length decreases" and an upward arrow on the right labelled "bond strength increases". Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 5 — heading: bond enthalpy
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Bond Enthalpy — How Hard the Bond Is to Break',
      objective: 'Read bond enthalpy as the energy to break one mole of bonds, and rank single/double/triple by it.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "**Bond enthalpy (bond energy) is the energy needed to break one mole of a particular bond in the gas phase**, leaving the fragments as gaseous species. It is reported in $\\text{kJ}\\,\\text{mol}^{-1}$ and is always **positive** — breaking a bond *costs* energy (forming one *releases* it; recall from Page 1 that a bond exists only because the joined state is lower in energy).\n\n" +
      "Because extra shared pairs hold the atoms more tightly, bond enthalpy **rises with bond order**: for carbon–carbon, roughly $\\ce{C-C}$ **347**, $\\ce{C=C}$ **611**, $\\ce{C#C}$ **837** $\\text{kJ}\\,\\text{mol}^{-1}$. A larger bond enthalpy means a stronger, more stable, and usually less reactive bond.\n\n" +
      "One honesty note the exam likes to test: for a bond that appears many times (the four $\\ce{C-H}$ bonds in $\\ce{CH4}$, say), each one breaks at a slightly different energy. The tabulated value is a **mean (average) bond enthalpy** taken over many molecules — a representative figure, not the exact cost of one specific bond." },

    // 6 — heading: bond order
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Bond Order — Counting the Shared Pairs',
      objective: 'Define bond order and use it to compare length and strength in one move.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "**Bond order is simply the number of bonds (shared electron pairs) between two atoms.** Single = 1, double = 2, triple = 3. It ties the first three parameters together in one sentence:\n\n" +
      "> **Higher bond order → shorter bond → stronger bond (larger bond enthalpy).**\n\n" +
      "Here is the part that surprises students. A bond order doesn't *have* to be a whole number. Look at ozone, $\\ce{O3}$: experiment finds its **two** oxygen–oxygen bonds are **identical**, each sitting *between* a single and a double — a bond order of **1.5**. The carbonate ion $\\ce{CO3^2-}$ has three equal $\\ce{C-O}$ bonds, each a bond order of **4/3 ≈ 1.33**.\n\n" +
      "How can a bond be \"one-and-a-half\"? Because **the line you draw is *our* shorthand, not a real stick.** The molecule has no idea whether you sketched one line or two between those atoms — it just settles into its lowest-energy electron cloud, and sometimes that cloud is *spread evenly* over several positions. Those drawings-don't-fit cases are exactly what **resonance** explains, and that's the very next page. For now: a fractional bond order is not a mistake — it's the molecule being honest while our single drawing isn't." },

    // 7 — reasoning_prompt (mid-page, AFTER bond order vs length/strength is taught)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Without looking up any numbers, you are asked which has the shorter carbon–carbon bond: the C–C in ethane or the C≡C in ethyne (acetylene). How do you decide, and what is the answer?",
      options: [
        "Ethane's C–C is shorter, because a single bond has fewer electrons getting in the way of the nuclei",
        "Ethyne's C≡C is shorter, because higher bond order means more shared pairs pulling the nuclei closer together",
        "They are the same length, because both bonds join the same two carbon atoms",
        "You cannot decide without the exact picometre values from a data table"
      ],
      correct_index: 1,
      reveal: "Compare only what differs — both bonds join carbon to carbon, so atomic size is identical and drops out. The one thing that changes is bond order: ethyne's triple bond (order 3) shares three pairs versus ethane's single (order 1). More shared pairs pull the nuclei in tighter, so the triple bond is shorter (~120 pm vs ~154 pm) — and, by the same logic, stronger. You never needed the table; the trend gives the answer." },

    // 8 — heading: bond angle (preview VSEPR)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Bond Angle — The Geometry at the Central Atom',
      objective: 'Define bond angle and know which later tool (VSEPR) predicts it.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The first three parameters describe a *single* bond. The fourth describes how bonds are *arranged in space*. **Bond angle is the angle between two adjacent bonds at the central atom of a molecule.** Water's two $\\ce{O-H}$ bonds meet at about **104.5°**; methane's four $\\ce{C-H}$ bonds spread to **109.5°**; carbon dioxide is **linear**, 180°.\n\n" +
      "Bond angle is what gives a molecule its *shape*, and shape decides properties like polarity. What sets the angle? The electron pairs around the central atom — bonding pairs and lone pairs — push each other apart and settle into the arrangement of least repulsion. The tool that turns that idea into predicted angles is **VSEPR theory**, and it gets a full page of its own later in this chapter. Here, just file the definition.\n\n" +
      "*(One more parameter you'll meet soon — **bond polarity**, measured as a **dipole moment** — describes how *unevenly* a shared pair is held when the two atoms differ in electronegativity. We'll give it proper treatment on its own page; for now, note it exists.)*" },

    // 9 — comparison_card: single vs double vs triple
    { id: uuidv4(), order: n(), type: 'comparison_card', title: 'Single vs Double vs Triple Bond',
      columns: [
        { heading: 'Single bond',
          points: [
            'Bond order 1 — one shared pair',
            'Made of one σ bond',
            'Longest of the three (e.g. C–C ≈ 154 pm)',
            'Weakest — lowest bond enthalpy (C–C ≈ 347 kJ/mol)',
            'Can rotate freely about the bond axis',
          ] },
        { heading: 'Double bond',
          points: [
            'Bond order 2 — two shared pairs',
            'One σ + one π bond',
            'Shorter (e.g. C=C ≈ 134 pm)',
            'Stronger than single (C=C ≈ 611 kJ/mol)',
            'The π bond is the reactive, easily-attacked part',
          ] },
        { heading: 'Triple bond',
          points: [
            'Bond order 3 — three shared pairs',
            'One σ + two π bonds',
            'Shortest (e.g. C≡C ≈ 120 pm)',
            'Strongest — highest bond enthalpy (C≡C ≈ 837 kJ/mol)',
            'Very strong overall, but its π bonds stay reactive',
          ] },
      ] },

    // 10 — worked example 1: order by length / strength
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Ordering by Length and Strength',
      problem: "Arrange these carbon–carbon bonds in (i) increasing bond length and (ii) increasing bond strength: $\\ce{C-C}$, $\\ce{C=C}$, $\\ce{C#C}$.",
      solution: "Every bond here is carbon-to-carbon, so atomic size is the same in all three — the only thing that differs is **bond order**.\n\n" +
        "Use the master link: *higher bond order → shorter bond → stronger bond.*\n\n" +
        "Bond orders are $\\ce{C-C}$ (1), $\\ce{C=C}$ (2), $\\ce{C#C}$ (3).\n\n" +
        "**(i) Increasing length** (longest comes from the *lowest* bond order):\n\n" +
        "$\\ce{C#C} < \\ce{C=C} < \\ce{C-C}$\n\n" +
        "**(ii) Increasing strength** (weakest comes from the *lowest* bond order):\n\n" +
        "$\\ce{C-C} < \\ce{C=C} < \\ce{C#C}$\n\n" +
        "Notice the two orders are exact reverses of each other — short and strong always travel together. No data table needed." },

    // 11 — worked example 2: identify highest bond order / fractional
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Spotting a Fractional Bond Order',
      problem: "In the carbonate ion $\\ce{CO3^2-}$, all three carbon–oxygen bonds are found to be exactly equal in length. A student writes one structure with one $\\ce{C=O}$ and two $\\ce{C-O}$ bonds. Why doesn't that match the experiment, and what is the actual C–O bond order?",
      solution: "The student's single drawing says the three bonds are *not* alike — one double, two single. But measurement says all three are **identical**. A single Lewis drawing simply can't show that.\n\n" +
        "Count what is really shared. Across the three equivalent C–O positions there are, in total, **4** bonds' worth of shared pairs (one double + two single = 2 + 1 + 1 = 4) spread over **3** equal positions.\n\n" +
        "So each C–O bond order $= \\dfrac{4}{3} \\approx 1.33$ — between a single and a double, the same for all three.\n\n" +
        "The drawing isn't \"wrong\" so much as **incomplete**: the molecule's electron cloud is spread evenly over all three bonds, and one fixed line can't picture that. The full account of *why* — and how to handle it — is **resonance**, on the next page." },

    // 12 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The One Link to Remember',
      markdown: "**Higher bond order → shorter bond → stronger bond (higher bond enthalpy).** Tie all four parameters to this one chain: bond order is the cause; bond length and bond enthalpy follow from it; bond angle is the *separate* one (it describes shape, and VSEPR predicts it). When two bonds join the *same* pair of atoms, compare bond order and you're done — **compare only what differs.**" },

    // 13 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Bond parameters are a steady source of one-mark questions. Three patterns to recognise:\n\n" +
        "**\"Arrange by bond length / strength.\"** First check if the atoms are the same — if so, decide by **bond order** alone (no values needed). Only when the atoms differ do you bring in atomic size.\n\n" +
        "**Fractional bond order from resonance.** Be ready to compute it by counting: $\\ce{O3}$ = 1.5; $\\ce{CO3^2-}$ = 4/3; and ions like $\\ce{NO3^-}$, $\\ce{ClO4^-}$ follow the same *total bonds ÷ equal positions* count (you'll drill this on the resonance page).\n\n" +
        "**Isoelectronic species share a bond order.** Species with the same electron count tend to have the same bond order and similar bond length — e.g. $\\ce{CO}$, $\\ce{N2}$ and $\\ce{NO^+}$ all carry a triple bond (bond order 3). A preview of an MOT idea worth banking now." },

    // 14 — inline_quiz (§3.6.1) — always last quiz; correct indices spread B, D, A
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'What does the bond length of a covalent bond measure?',
          options: [
            'The total number of electrons shared between the two atoms',
            'The equilibrium distance between the nuclei of the two bonded atoms',
            'The energy released when the two atoms first come together',
            'The angle between this bond and the next bond at the central atom'
          ],
          correct_index: 1,
          explanation: 'Bond length is the equilibrium internuclear distance — the balance point where attraction and repulsion cancel. The count of shared pairs is bond order; the energy term is bond enthalpy; the angle between adjacent bonds is the bond angle.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'For the carbon–carbon bonds C–C, C=C and C≡C, which statement is correct?',
          options: [
            'C≡C is the longest and the weakest of the three',
            'All three have the same length because they join the same atoms',
            'C–C is the longest and C≡C has the highest bond enthalpy',
            'C=C is both the shortest and the strongest of the three'
          ],
          correct_index: 2,
          explanation: 'Higher bond order pulls the nuclei closer and binds them more tightly, so C–C (order 1) is the longest while C≡C (order 3) is the shortest and strongest. The atoms being identical means size cancels — but bond order still differs, so the lengths are not equal.' },
        { id: uuidv4(), difficulty_level: 3,
          question: 'In ozone (O₃) the two oxygen–oxygen bonds are found to be exactly equal, each with a bond order of 1.5. What does this tell you?',
          options: [
            'Each O–O bond is intermediate between a single and a double bond, because the shared electrons are spread evenly over both positions',
            'One bond is a true single bond and the other a true double bond, just drawn carelessly',
            'Ozone breaks the octet rule, so its bond order cannot be trusted',
            'The molecule is unstable and cannot really exist at room temperature'
          ],
          correct_index: 0,
          explanation: 'A bond order of 1.5 on both bonds means the electron cloud is shared evenly across the two equivalent positions — each bond sits between a single and a double. A single Lewis line cannot picture this; resonance is the proper account. The bonds are genuinely equal, and ozone is perfectly real and stable.' },
      ] },

    // 15 — bridge to next page (Resonance)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You now have the four numbers that describe any covalent bond — and you've twice run into bonds that a single drawing just can't capture ($\\ce{O3}$, $\\ce{CO3^2-}$). That's not a flaw in the molecule; it's a flaw in our one-picture shorthand. Next, we fix the picture: **resonance** — how to handle the molecules whose real electron cloud is spread across several structures at once.*" },
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
    slug: NEW_SLUG, title: 'The Covalent Bond & Bond Parameters',
    subtitle: 'Bond length, bond enthalpy, bond order and bond angle — the four numbers that describe every covalent bond.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'covalent-bond', 'bond-parameters', 'bond-order'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 5 (covalent bond & bond parameters)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
