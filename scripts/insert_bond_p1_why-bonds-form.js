'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Arc A, Page 1.
 * "Why Atoms Bond — The Octet Idea" (Kössel–Lewis approach, octet rule, Lewis symbols).
 * Chapter 4 is currently empty (0 page_ids), so this inserts at page_number 1 and
 * appends to ch4 page_ids (no shifting). published:false — founder reviews + generates
 * the 2 pending images, then publishes.
 * Voice: BOND-exemplars.md (carbon-the-negotiator) + teacher-voice-profile.md (FORMAT v2).
 * Grounded in NCERT Class 11 Ch.4 (Kössel–Lewis) + standard JEE treatment.
 * Run: node scripts/insert_bond_p1_why-bonds-form.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 1;
const NEW_SLUG = 'why-atoms-bond';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'Lone noble-gas atoms drifting apart while reactive atoms rush together to form bonds',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). On the left, a few isolated glowing single atoms drifting alone and content (suggesting noble gases). On the right, many atoms rushing toward each other and joining into small molecules with luminous bonds forming between them. A visual sense of "alone vs joined", stability through union. Cool blue-to-warm gradient lighting. Clean scientific illustration style. Dark background (#0a0a0a or near-black). No text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Loner Elements',
      markdown: "Look at the air around you. The nitrogen and oxygen in it travel as **pairs** — N₂ and O₂ — never as lone atoms. But helium, neon and argon float around **completely alone**, refusing to join anything. Why are a handful of elements happy by themselves while almost every other atom in the universe is desperate to pair up? That one question is the whole of chemical bonding." },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Everything in chemistry — every reaction, every material, every drug — comes down to atoms **joining together**. The force that holds two atoms in a molecule is a **chemical bond**.\n\n" +
      "But atoms don't bond because they \"want to\". They bond for one cold reason: **a bonded atom is at lower energy than a free atom.** Nature always slides toward lower energy, the way a ball rolls downhill. When two atoms come together and the combined system has *less* energy than the two separate atoms, a bond forms and that extra energy is released. Pull them apart and you have to *pay back* exactly that energy.\n\n" +
      "So the real question becomes: **which arrangement gives an atom the lowest energy?** And here the noble gases give us the clue." },

    // 3 — heading: octet rule
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Octet Rule',
      objective: 'See why a full outer shell of eight electrons is the stable target every atom chases.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The noble gases (He, Ne, Ar, Kr…) are the unreactive loners. What do they have in common? A **completely filled outermost shell** — 8 electrons for all of them except helium, which is full at 2. That filled shell is the most stable, lowest-energy electron arrangement there is.\n\n" +
      "In 1916, **Kössel and Lewis** turned this observation into a rule: *atoms react in order to attain the stable electron configuration of the nearest noble gas — usually **eight electrons in the outermost shell.*** This is the **octet rule**.\n\n" +
      "Only the **valence electrons** (the outermost-shell electrons) take part. The inner electrons stay out of it. So bonding is really a game of rearranging valence electrons until everyone reaches an octet (or a **duplet** — 2 electrons — for the small ones: H, Li, Be that aim for helium's configuration)." },

    // 4 — image: octet idea
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Sodium losing one electron and chlorine gaining one, both reaching a noble-gas octet',
      caption: '📸 Both atoms end up with a full outer shell — the noble-gas target',
      generation_prompt: 'Chemical bonding concept diagram. Left: a sodium atom (Na) shown as shells, with a single outer-shell electron being transferred by an arrow to the right. Right: a chlorine atom (Cl) shown as shells with seven outer electrons receiving that electron to complete eight. Below each, show the resulting Na⁺ and Cl⁻ each with a complete stable outer shell highlighted. Arrows indicate electron transfer. Label: Na, Cl, electron transfer, complete octet. Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 5 — heading: three ways to complete the octet (carbon-negotiator voice)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Three Ways to Reach the Octet',
      objective: 'Learn the three routes — lose, gain, or share electrons — and why an atom picks one.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "An atom short of a full octet has exactly three options:\n\n" +
      "1. **Lose** its few outer electrons → becomes a positive ion (**cation**). Sodium has 1 lonely outer electron; dropping it is easy, and Na⁺ now has a neon octet.\n" +
      "2. **Gain** electrons to fill the shell → becomes a negative ion (**anion**). Chlorine needs just 1 more; it grabs one and Cl⁻ reaches an argon octet.\n" +
      "3. **Share** electrons with another atom → a **covalent bond**, where both atoms count the shared pair toward their own octet.\n\n" +
      "Which route? It depends on how many electrons stand between the atom and a full shell. Think of **carbon**, sitting in the middle with 4 outer electrons. To lose 4 is expensive; to gain 4 is just as hard. So carbon makes the sensible decision a smart negotiator would: *neither giving away everything nor demanding everything — \"I will rather **share**. I put my four electrons on the table, you put yours, and we both get to claim all eight.\"* That single choice — sharing rather than transferring — is why carbon builds the millions of molecules that make up all of life." },

    // 6 — reasoning_prompt (mid-page, after the lose/gain/share concept)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Magnesium has 2 outer electrons; fluorine has 7. When magnesium fluoride forms, why does magnesium *lose* electrons rather than *share* them?",
      options: [
        "Magnesium shares its 2 electrons with one fluorine, completing both octets at once",
        "Losing 2 electrons takes magnesium straight to a stable neon octet, which is far easier than sharing or gaining 6 — so it transfers them to fluorine atoms that each need just one",
        "Magnesium gains 6 electrons to complete its own octet directly",
        "Magnesium and fluorine are both metals, so they pool their electrons"
      ],
      correct_index: 1,
      reveal: "An atom takes the cheapest route to a full shell. For magnesium, dropping its 2 outer electrons reaches a neon octet immediately — much easier than trying to gain 6. Each fluorine needs only 1 electron, so two fluorines happily take one each. The result is Mg²⁺ and two F⁻ ions: an ionic compound, MgF₂. Sharing is what atoms do when *both* find losing or gaining too expensive — like carbon." },

    // 7 — heading: Lewis dot symbols
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Lewis Dot Symbols — Bookkeeping for Electrons',
      objective: 'Draw the dot symbol for any main-group element so you can track its valence electrons.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Before we can show *how* atoms bond, we need a simple way to draw the electrons that do the bonding. **G.N. Lewis** gave us one: write the element's symbol, then place one dot for each **valence electron** around it — on the four sides, singly first, then pairing up.\n\n" +
      "For a main-group element, the number of valence electrons is just its **group number** (old notation): Na (group 1) → 1 dot, C (group 14 / IVA) → 4 dots, O (group 16 / VIA) → 6 dots, Cl (group 17 / VIIA) → 7 dots.\n\n" +
      "These dot symbols are the building blocks for everything ahead — bonds, lone pairs, and the full structures you'll draw on the next page." },

    // 8 — worked example: Lewis symbols
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Writing Lewis Symbols',
      problem: "Write the Lewis dot symbol for: (a) nitrogen (N), (b) magnesium (Mg), (c) chlorine (Cl), (d) the oxide ion, O²⁻.",
      solution: "Count valence electrons (= group number), then place the dots.\n\n" +
        "**(a) N** — group 15, so **5** valence electrons: three single dots and one pair around N. (Those three unpaired dots are why nitrogen forms three bonds.)\n\n" +
        "**(b) Mg** — group 2, so **2** valence electrons: two single dots beside Mg.\n\n" +
        "**(c) Cl** — group 17, so **7** valence electrons: three pairs and one single dot. (That one unpaired dot is the electron chlorine wants to pair up — so it forms one bond.)\n\n" +
        "**(d) O²⁻** — oxygen has 6 valence electrons; the 2− charge adds **2 more = 8**. Draw O with four complete pairs (a full octet) and write the whole thing in brackets with a 2− charge outside: a complete, stable shell." },

    // 9 — table: element → valence → symbol → typical ion
    { id: uuidv4(), order: n(), type: 'table', caption: 'Valence electrons decide the route to the octet',
      headers: ['Element', 'Group', 'Valence e⁻', 'Easiest route', 'Result'],
      rows: [
        ['Na', '1', '1', 'lose 1', 'Na⁺ (Ne octet)'],
        ['Mg', '2', '2', 'lose 2', 'Mg²⁺ (Ne octet)'],
        ['C', '14', '4', 'share 4', 'covalent bonds'],
        ['N', '15', '5', 'share 3 / gain 3', 'N³⁻ or 3 bonds'],
        ['O', '16', '6', 'gain 2 / share 2', 'O²⁻ or 2 bonds'],
        ['Cl', '17', '7', 'gain 1 / share 1', 'Cl⁻ or 1 bond'],
      ] },

    // 10 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The One Idea Behind Everything',
      markdown: "**Atoms bond to reach a noble-gas electron configuration — an octet (8) in the outer shell, or a duplet (2) for H, Li, Be — because that is the lowest-energy, most stable arrangement.** Lose, gain, or share: every bond you will ever draw is just one of these three routes to a full shell." },

    // 11 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The octet rule is a guide, not a law — and exams test its exceptions.** Three classic failures you'll meet later in this chapter:\n\n" +
        "**Incomplete octet:** central atoms like B and Be settle for fewer than 8 — BF₃ leaves boron with only 6.\n\n" +
        "**Expanded octet:** period-3 elements onward can exceed 8 using d-orbitals — PCl₅ (10), SF₆ (12).\n\n" +
        "**Odd-electron species:** molecules with an odd electron count, like NO and NO₂, simply can't pair everything up.\n\n" +
        "**Classic question:** *\"Which of these does NOT obey the octet rule?\"* → spot the electron-deficient (BF₃), the expanded (SF₆), or the odd-electron (NO) species." },

    // 12 — inline_quiz (§3.6.1)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'According to the octet rule, atoms form chemical bonds mainly to achieve which of the following?',
          options: [
            'The maximum possible number of electrons in the outer shell',
            'An electron arrangement identical to the nearest noble gas — a filled outer shell',
            'An equal number of protons and neutrons in the nucleus',
            'The highest possible positive charge'
          ],
          correct_index: 1,
          explanation: 'Bonding drives an atom toward the stable, low-energy configuration of the nearest noble gas — typically eight electrons in the outermost shell. It is not about maximising electrons (a filled shell is the target, not "as many as possible"), and the nucleus plays no part in bonding.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Aluminium (group 13, 3 valence electrons) and oxygen (group 16, 6 valence electrons) form a compound. What is each atom\'s most likely route to an octet?',
          options: [
            'Aluminium gains 5 electrons; oxygen gains 2',
            'Both atoms share electrons to form purely covalent bonds',
            'Aluminium loses 3 electrons; oxygen gains 2 electrons',
            'Aluminium loses 3 electrons; oxygen loses 6 electrons'
          ],
          correct_index: 2,
          explanation: 'Aluminium reaches a neon octet most cheaply by losing its 3 outer electrons (→ Al³⁺); oxygen needs only 2 more, so it gains them (→ O²⁻). Gaining 5 or losing 6 are far more expensive routes, which is why neither happens.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Why does carbon form covalent bonds by sharing rather than by losing or gaining four electrons?',
          options: [
            'Carbon has no valence electrons to lose',
            'Losing or gaining four electrons is energetically very costly, so sharing is the cheaper route to eight',
            'Carbon already has a complete octet and does not need to bond',
            'Sharing lets carbon keep a positive charge, which it prefers'
          ],
          correct_index: 1,
          explanation: 'With 4 valence electrons, carbon would have to remove or acquire four to reach an octet — both very expensive. Sharing lets carbon count the shared pairs toward its own octet without paying that price, which is exactly why carbon builds so many stable molecules.' },
      ] },

    // 13 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You now know **why** atoms bond and the three routes they take. Next, we'll turn dot symbols into full **Lewis structures** — and use **formal charge** to decide which structure of a molecule is the right one.*" },
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
    slug: NEW_SLUG, title: 'Why Atoms Bond — The Octet Idea',
    subtitle: 'Atoms bond to reach a noble-gas octet — by losing, gaining, or sharing electrons.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'octet-rule', 'lewis'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  // Wire into chapter 4 page_ids (append; ch4 was empty).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 1 (why atoms bond)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
