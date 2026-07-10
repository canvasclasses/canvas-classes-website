/**
 * Create the "Electronic Configuration of Atoms" page — the finale of
 * Chapter 2 (Structure of Atom) in the Class 11 Chemistry Live Book
 * (book slug: ncert-simplified).
 *
 * This page hosts the already-built `electron-configuration-builder` simulator
 * and teaches the three filling rules (Aufbau / (n+l), Pauli, Hund), the two
 * exceptions within Z ≤ 36 (Cr, Cu), a worked example (Fe, Z=26), a reasoning
 * beat, an exam-tip callout, and a tricky inline quiz.
 *
 * Modelled EXACTLY on createPage13() in scripts/add_quantum_sims.js:
 *   - page doc shape, insertOne, and chapter page_ids linking are identical
 *   - idempotent on slug: if the page already exists, only blocks are updated
 *   - chapter-linking is guarded so a re-run never adds the id twice
 *
 *   node scripts/create_electron_configuration_page.js
 *
 * Affects exactly 1 document in book_pages (slug 'electron-configuration') and
 * appends one id to chapter 2's page_ids in the books doc. Additive only.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠ FOUNDER NOTE — READ BEFORE RUNNING (page-number collision):
 * Chapter 2 already contains two EMPTY placeholder pages (0 blocks each):
 *     p14  filling-orbitals-electronic-configuration
 *     p15  stability-filled-halffilled-subshells
 * So page_number 14 is currently OCCUPIED by an empty shell. This script does
 * NOT overwrite or delete that shell (content-protection §0.6). Instead, if
 * page_number 14 is taken by a different slug, it places this new page at the
 * next free page_number and prints a loud warning, so you can decide whether to
 * (a) keep this as a new page, or (b) instead pour these blocks into the empty
 * shell. The script never creates two pages sharing the same page_number.
 * ────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const PAGE_SLUG = 'electron-configuration';
const CHAPTER_NUMBER = 2;
const PREFERRED_PAGE_NUMBER = 14;

// ─────────────────────────────────────────────────────────────────────────────
// Blocks
// ─────────────────────────────────────────────────────────────────────────────

function buildBlocks() {
  return [
    // ── 0 ── fun_fact opener (the hook)
    {
      id: uuidv4(), type: 'callout', order: 0,
      variant: 'fun_fact',
      title: 'One Rule Builds the Whole Periodic Table',
      markdown: [
        'Look at the periodic table on your wall. Why does it have those exact blocks —',
        '2 columns on the left, 6 on the right, a 10-wide slab of transition metals in the middle?',
        'It is not a design choice. That entire shape falls out of **one idea**: the order in which',
        'electrons fill into an atom. Get the electronic configuration of an element right, and you can',
        'predict its valency, the group it sits in, and a lot of how it will react —',
        'before you have done a single experiment. This one topic ties the whole chapter together.',
      ].join(' '),
    },

    // ── 1 ── intro text — what electronic configuration means + why it is the payoff
    {
      id: uuidv4(), type: 'text', order: 1,
      markdown: [
        'The **electronic configuration** of an atom is simply the *address list* of its electrons:',
        'which orbitals they sit in, and how many are in each. We write it as a string like',
        '$1s^2\\, 2s^2\\, 2p^6$ — the big number is the shell $(n)$, the letter is the subshell $(s, p, d, f)$,',
        'and the superscript is how many electrons are parked there.\n\n',
        'Everything you built up across this chapter — shells, subshells, the four quantum numbers,',
        'the shapes of orbitals — was leading here. Configuration is the payoff. The outermost electrons',
        '(the **valence** electrons) decide an element’s chemistry: how many bonds it forms, whether it',
        'gives away electrons or grabs them, which group of the periodic table it belongs to.',
        'Sodium reacts the way it does because of *one* lonely electron in $3s$. That is the power of getting',
        'the configuration right.\n\n',
        'So how do electrons decide where to sit? They are not random. They obey **three rules**, every single time.',
      ].join(' '),
    },

    // ── 2 ── heading: the three rules
    {
      id: uuidv4(), type: 'heading', order: 2,
      text: 'The Three Rules That Fill Every Atom',
      level: 2,
    },

    // ── 3 ── text: Aufbau + (n+l) rule
    {
      id: uuidv4(), type: 'text', order: 3,
      markdown: [
        '**Rule 1 — the Aufbau Principle.** *Aufbau* is German for "building up". Electrons fill the',
        '**lowest-energy orbital available first**, then the next lowest, and so on — like water filling',
        'a tank from the bottom. The only catch: the energy order is not the same as the simple number order.',
        '$4s$ actually fills **before** $3d$, even though 3 is smaller than 4. That surprises every student',
        'the first time.\n\n',
        'There is a clean shortcut to get the order right — the **$(n + l)$ rule** (also called the',
        'Bohr–Bury or Madelung rule):\n',
        '- An orbital with a **lower $(n + l)$ value fills first**.\n',
        '- If two orbitals have the **same $(n + l)$**, the one with the **lower $n$** fills first.\n\n',
        'Let us settle the famous $4s$ vs $3d$ fight with it:\n',
        '- For $4s$: $n + l = 4 + 0 = 4$\n',
        '- For $3d$: $n + l = 3 + 2 = 5$\n\n',
        '$4s$ has the smaller sum $(4 < 5)$, so **$4s$ fills first**. No memorising needed — you can derive it.',
      ].join(' '),
    },

    // ── 4 ── remember callout: the filling order
    {
      id: uuidv4(), type: 'callout', order: 4,
      variant: 'remember',
      title: 'The Filling Order — Burn It In',
      markdown: [
        'Using the $(n+l)$ rule on every orbital gives this exact filling sequence:\n\n',
        '$$1s\\;\\; 2s\\;\\; 2p\\;\\; 3s\\;\\; 3p\\;\\; 4s\\;\\; 3d\\;\\; 4p\\;\\; 5s\\;\\; 4d\\;\\; 5p\\;\\; 6s\\;\\; 4f\\;\\; 5d\\;\\; 6p\\;\\; 7s$$\n\n',
        'Read it left to right and you fill any atom. Notice the "jumps" the $(n+l)$ rule predicts:',
        '$4s$ before $3d$, then $5s$ before $4d$, then $6s$ before $4f$ before $5d$.\n\n',
        '| Orbital | $n$ | $l$ | $n+l$ |\n',
        '|---|---|---|---|\n',
        '| $4s$ | 4 | 0 | **4** |\n',
        '| $3d$ | 3 | 2 | **5** |\n',
        '| $4p$ | 4 | 1 | **5** |\n\n',
        'For the tie between $3d$ and $4p$ (both $n+l=5$), the **lower $n$ wins** — so $3d$ fills before $4p$. ✓',
      ].join(''),
    },

    // ── 5 ── text: Pauli exclusion
    {
      id: uuidv4(), type: 'text', order: 5,
      markdown: [
        '**Rule 2 — the Pauli Exclusion Principle.** Wolfgang Pauli’s rule says:',
        '**no two electrons in the same atom can have all four quantum numbers identical.**\n\n',
        'Think about what that forces. An orbital already fixes three quantum numbers $(n, l, m_l)$.',
        'So the only thing two electrons sharing one orbital can differ in is the **fourth** number — the',
        'spin $m_s$, which has just two values: $+\\tfrac{1}{2}$ (call it spin-up $\\uparrow$) and',
        '$-\\tfrac{1}{2}$ (spin-down $\\downarrow$).\n\n',
        'The consequence is the single most useful fact in this whole topic:',
        '**one orbital holds a maximum of 2 electrons, and they must have opposite spins** $(\\uparrow\\downarrow)$.',
        'That is why the subshell capacities are what they are: $s$ has 1 orbital ($2$ electrons),',
        '$p$ has 3 orbitals ($6$), $d$ has 5 orbitals ($10$), $f$ has 7 orbitals ($14$).',
      ].join(' '),
    },

    // ── 6 ── text: Hund's rule
    {
      id: uuidv4(), type: 'text', order: 6,
      markdown: [
        '**Rule 3 — Hund’s Rule of Maximum Multiplicity.** This one decides what happens *inside* a',
        'subshell that has several orbitals of equal energy (the three $p$ boxes, the five $d$ boxes).',
        'The rule: **electrons occupy the orbitals singly first, all with parallel spins, before any orbital',
        'gets a second electron.**\n\n',
        'The everyday picture students remember is the **empty bus seats**. When you board an empty bus,',
        'you don’t squeeze in next to a stranger — you take an empty double-seat to yourself. Only once',
        'every double-seat has one person do people start pairing up. Electrons do exactly this. They are',
        'all negatively charged and repel each other, so spreading out one-per-orbital keeps them as far',
        'apart as possible. **Lower repulsion means lower energy means more stability.**\n\n',
        'So for nitrogen’s three $2p$ electrons, you get $\\uparrow\\;\\uparrow\\;\\uparrow$ (one in each box,',
        'all parallel) — **never** $\\uparrow\\downarrow\\;\\uparrow\\;\\,$ with one box doubled up and one empty.',
        'Use the simulator below to watch this play out box by box.',
      ].join(' '),
    },

    // ── 7 ── THE SIMULATION (predict-observe-explain)
    {
      id: uuidv4(), type: 'simulation', order: 7,
      simulation_id: 'electron-configuration-builder',
      title: 'Electron Configuration Builder',
      prediction: {
        prompt: 'Vanadium (Z = 23) is [Ar] with 3 more electrons going into the five 3d boxes. How do those 3 electrons arrange themselves?',
        options: [
          'All three crammed into the first 3d box (paired up tight)',
          'One electron in each of three different boxes, all spins parallel ↑ ↑ ↑',
          'Two paired in one box, the third alone in another',
        ],
        reveal_after:
          'Hund’s rule wins: one electron goes into each of three separate 3d boxes, all with parallel spins — [Ar] 3d³ 4s² has three UNPAIRED electrons (↑ ↑ ↑ _ _). Electrons spread out before they pair, because spreading out keeps repulsion lowest. Step through the builder to Z = 23 and watch the boxes fill one at a time.',
      },
    },

    // ── 8 ── heading: exceptions
    {
      id: uuidv4(), type: 'heading', order: 8,
      text: 'When the Rules Bend — Chromium and Copper',
      level: 2,
    },

    // ── 9 ── text: the two exceptions + reason
    {
      id: uuidv4(), type: 'text', order: 9,
      markdown: [
        'Within the first 30 elements, the Aufbau order works perfectly — with **exactly two famous exceptions**:',
        '**chromium (Cr, Z = 24)** and **copper (Cu, Z = 29)**. Learn these two; do not invent any others.\n\n',
        '**Chromium (Z = 24).** Plain Aufbau predicts $[Ar]\\, 3d^4\\, 4s^2$. The actual configuration is',
        '$[Ar]\\, 3d^5\\, 4s^1$ — one $4s$ electron has slipped into $3d$.\n\n',
        '**Copper (Z = 29).** Plain Aufbau predicts $[Ar]\\, 3d^9\\, 4s^2$. The actual configuration is',
        '$[Ar]\\, 3d^{10}\\, 4s^1$ — again, one $4s$ electron moves into $3d$.\n\n',
        '**Why?** A subshell that is **exactly half-filled $(d^5)$** or **completely filled $(d^{10})$** is',
        'unusually stable. Two effects cause this extra stability: the electron cloud is **symmetrically',
        'distributed**, and there is more **exchange energy** (a quantum bonus that grows with the number',
        'of parallel-spin electrons that can swap places). The tiny cost of promoting one $4s$ electron is',
        'more than repaid by the stability of reaching $d^5$ or $d^{10}$ — so the atom takes the deal.',
      ].join(' '),
    },

    // ── 10 ── comparison_card: predicted vs actual for Cr and Cu
    {
      id: uuidv4(), type: 'comparison_card', order: 10,
      title: 'Predicted vs Actual — The Two Exceptions',
      columns: [
        {
          heading: 'What Aufbau Predicts',
          points: [
            'Cr (24): [Ar] 3d⁴ 4s²',
            'Cu (29): [Ar] 3d⁹ 4s²',
            'Follows the filling order literally',
            'Neither subshell reaches a stable d⁵ or d¹⁰',
          ],
        },
        {
          heading: 'What Actually Happens',
          points: [
            'Cr (24): [Ar] 3d⁵ 4s¹  → half-filled d⁵',
            'Cu (29): [Ar] 3d¹⁰ 4s¹ → fully-filled d¹⁰',
            'One 4s electron is promoted into 3d',
            'Extra stability: symmetry + exchange energy',
          ],
        },
      ],
    },

    // ── 11 ── worked_example: Fe (Z=26), tap to reveal
    {
      id: uuidv4(), type: 'worked_example', order: 11,
      label: 'Solved Example — Iron (Fe, Z = 26)',
      variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: [
        'Write the full electronic configuration of **iron (Fe)**, atomic number $Z = 26$.',
        'Then write it in noble-gas shorthand. Is iron one of the exceptions?',
      ].join(' '),
      solution: [
        '**Step 1 — how many electrons?** A neutral iron atom has $Z = 26$ electrons to place.\n\n',
        '**Step 2 — fill in $(n+l)$ order**, stopping when we have used all 26:\n',
        '- $1s^2$ → 2 used (2 total)\n',
        '- $2s^2$ → 4\n',
        '- $2p^6$ → 10\n',
        '- $3s^2$ → 12\n',
        '- $3p^6$ → 18\n',
        '- $4s^2$ → 20  *(remember: $4s$ before $3d$)*\n',
        '- $3d^6$ → 26  ✓ all electrons placed\n\n',
        '**Full configuration:**\n',
        '$$1s^2\\, 2s^2\\, 2p^6\\, 3s^2\\, 3p^6\\, 4s^2\\, 3d^6$$\n\n',
        '**Noble-gas shorthand:** the first 18 electrons are exactly the configuration of argon, so we write',
        'them as $[Ar]$:\n',
        '$$\\text{Fe} = [Ar]\\, 3d^6\\, 4s^2$$\n\n',
        '**Is iron an exception?** No. Only **Cr** and **Cu** deviate in this region. Iron’s $3d^6$ is neither',
        'a half-filled $d^5$ nor a full $d^{10}$, so there is no stability bonus to chase — it follows plain',
        'Aufbau. (A common slip is to "fix" $3d^6\\,4s^2$ into $3d^7\\,4s^1$; that is wrong — don’t do it.)',
      ].join(''),
    },

    // ── 12 ── reasoning_prompt: the genuine "why" beat
    {
      id: uuidv4(), type: 'reasoning_prompt', order: 12,
      reasoning_type: 'logical',
      difficulty_level: 4,
      prompt: [
        'Both potassium (K, $Z = 19$) and copper (Cu, $Z = 29$) end their configurations in $4s^1$.',
        'Yet that lonely $4s^1$ is "normal" for potassium but the result of a special stability rule for copper.',
        'Why the difference?',
      ].join(' '),
      options: [
        'They are the same situation — both just follow Aufbau',
        'Potassium reaches 4s¹ by normal filling; copper had to promote a 4s electron into 3d to reach a stable d¹⁰',
        'Copper is normal and potassium is the exception',
        'Both are exceptions to the Aufbau principle',
      ],
      reveal: [
        'Notice *where the atom is* in the filling order. Potassium has only 19 electrons — it fills',
        '$\\ldots 3p^6\\, 4s^1$ and simply **hasn’t reached $3d$ yet**. Its $4s^1$ is plain Aufbau, nothing special.',
        'Copper has 29 electrons; Aufbau would give $[Ar]\\,3d^9\\,4s^2$, but the atom **borrows one $4s$ electron',
        'to complete $3d^{10}$** — a fully-filled, extra-stable subshell — leaving $4s^1$ behind. Same ending,',
        'completely different reason: K’s $4s^1$ is a starting point, Cu’s $4s^1$ is what’s left after a trade.',
      ].join(' '),
    },

    // ── 13 ── exam_tip callout
    {
      id: uuidv4(), type: 'callout', order: 13,
      variant: 'exam_tip',
      title: 'JEE / NEET — Electronic Configuration',
      markdown: [
        '**The traps that cost marks every year:**\n\n',
        '- **Cr & Cu are the only Z ≤ 30 exceptions.** $Cr = [Ar]\\,3d^5\\,4s^1$, $Cu = [Ar]\\,3d^{10}\\,4s^1$.',
        'Do not invent others (Mo and Ag follow the same pattern higher up, but in the 3d series it is just these two).\n\n',
        '- **Filling vs emptying are different orders.** $4s$ fills **before** $3d$, but when an atom forms a',
        '**cation**, electrons leave from the **highest $n$ first** — so the $4s$ electrons go **before** the $3d$.',
        'That is why $Fe^{2+}$ is $[Ar]\\,3d^6$, **not** $[Ar]\\,3d^4\\,4s^2$. Removing the two $4s$ electrons from',
        '$[Ar]\\,3d^6\\,4s^2$ leaves $3d^6$. This is the single most-tested trap in the chapter.\n\n',
        '- **Half-filled and fully-filled stability** $(d^5, d^{10}, p^3, f^7, f^{14})$ is the reason behind the',
        'exceptions — expect a "why is Cr $3d^5 4s^1$?" question.\n\n',
        '- **Counting unpaired electrons** (for magnetic moment / paramagnetism) comes straight from Hund’s rule —',
        'draw the boxes, fill singly first, then count the lone $\\uparrow$ arrows.',
      ].join(''),
    },

    // ── 14 ── inline_quiz (tricky, misconception-targeting)
    {
      id: uuidv4(), type: 'inline_quiz', order: 14,
      pass_threshold: 0.6,
      questions: [
        {
          id: uuidv4(),
          question: 'What is the correct ground-state electronic configuration of chromium (Cr, $Z = 24$)?',
          options: [
            '$[Ar]\\, 3d^4\\, 4s^2$',
            '$[Ar]\\, 3d^5\\, 4s^1$',
            '$[Ar]\\, 3d^6$',
            '$[Ar]\\, 4s^2\\, 4p^4$',
          ],
          correct_index: 1,
          explanation: 'Plain Aufbau predicts $[Ar]\\,3d^4\\,4s^2$, but chromium promotes one $4s$ electron into $3d$ to reach a half-filled $d^5$ subshell, which is extra stable (symmetry + exchange energy). So $Cr = [Ar]\\,3d^5\\,4s^1$.',
        },
        {
          id: uuidv4(),
          question: 'Why does the $4s$ orbital fill before the $3d$ orbital?',
          options: [
            'Because 4 is larger than 3',
            'Because $4s$ has a lower $(n+l)$ value: $4+0 = 4$, versus $3d$ at $3+2 = 5$',
            'Because $3d$ orbitals do not exist until period 4',
            'Because $s$ orbitals are always lower in energy than $d$ orbitals in every shell',
          ],
          correct_index: 1,
          explanation: 'By the $(n+l)$ rule, the orbital with the lower sum fills first. $4s$ has $n+l = 4+0 = 4$ while $3d$ has $n+l = 3+2 = 5$. Since $4 < 5$, $4s$ fills first — despite the higher principal quantum number.',
        },
        {
          id: uuidv4(),
          question: 'The configuration of iron is $[Ar]\\,3d^6\\,4s^2$. What is the configuration of the $Fe^{2+}$ ion?',
          options: [
            '$[Ar]\\, 3d^4\\, 4s^2$',
            '$[Ar]\\, 3d^6$',
            '$[Ar]\\, 3d^5\\, 4s^1$',
            '$[Ar]\\, 3d^8$',
          ],
          correct_index: 1,
          explanation: 'When a transition metal forms a cation, electrons leave from the highest principal shell first — so the two $4s$ electrons go before any $3d$ electron. Removing both $4s$ electrons from $[Ar]\\,3d^6\\,4s^2$ leaves $Fe^{2+} = [Ar]\\,3d^6$. A classic trap is to remove from $3d$ and write $3d^4\\,4s^2$ — that is wrong.',
        },
        {
          id: uuidv4(),
          question: 'How many unpaired electrons are there in a ground-state nitrogen atom (N, $Z = 7$)?',
          options: ['0', '1', '2', '3'],
          correct_index: 3,
          explanation: 'Nitrogen is $1s^2\\,2s^2\\,2p^3$. By Hund’s rule, the three $2p$ electrons occupy the three separate $2p$ boxes singly with parallel spins ($\\uparrow\\;\\uparrow\\;\\uparrow$) before any pairing. That gives **3 unpaired electrons**.',
        },
      ],
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Create / update the page (modelled on createPage13)
// ─────────────────────────────────────────────────────────────────────────────

async function createPage(db) {
  const booksCol = db.collection('books');
  const pagesCol = db.collection('book_pages');

  const book = await booksCol.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error(`Book "${BOOK_SLUG}" not found`);

  const blocks = buildBlocks();
  const READING_TIME_MIN = 11;

  // ── Idempotency: update blocks only if the page already exists ──────────────
  const existing = await pagesCol.findOne({ book_id: String(book._id), slug: PAGE_SLUG });
  if (existing) {
    console.log(`  Page "${PAGE_SLUG}" already exists — updating blocks only`);
    const result = await pagesCol.updateOne(
      { _id: existing._id },
      { $set: { blocks, reading_time_min: READING_TIME_MIN, updated_at: new Date() } }
    );
    console.log(`  ✓ updated: ${blocks.length} blocks`);
    console.log(`    matched: ${result.matchedCount}, modified: ${result.modifiedCount}`);
    // Make sure it is linked into chapter 2 (guarded against double-add).
    await linkPageToChapter(booksCol, book, existing._id);
    printBlockMap(blocks);
    return;
  }

  // ── Decide a non-colliding page_number ──────────────────────────────────────
  // PREFERRED is 14, but Ch.2 already has empty shell pages occupying 14 & 15.
  // We never create two pages with the same page_number, and we never touch the
  // shells (content protection §0.6).
  let pageNumber = PREFERRED_PAGE_NUMBER;
  const occupant = await pagesCol.findOne({
    book_id: String(book._id),
    chapter_number: CHAPTER_NUMBER,
    page_number: PREFERRED_PAGE_NUMBER,
  });
  if (occupant) {
    const maxDoc = await pagesCol
      .find({ book_id: String(book._id), chapter_number: CHAPTER_NUMBER })
      .sort({ page_number: -1 })
      .limit(1)
      .next();
    pageNumber = (maxDoc?.page_number || PREFERRED_PAGE_NUMBER) + 1;
    console.log('  ⚠ ──────────────────────────────────────────────────────────');
    console.log(`  ⚠ page_number ${PREFERRED_PAGE_NUMBER} is already taken by an existing page:`);
    console.log(`  ⚠     "${occupant.slug}" (blocks: ${(occupant.blocks || []).length})`);
    console.log(`  ⚠ To avoid a page-number collision, this new page is being placed at`);
    console.log(`  ⚠ page_number ${pageNumber} instead. The existing page was NOT modified.`);
    console.log(`  ⚠ If you intended these blocks to fill that empty shell instead, stop`);
    console.log(`  ⚠ and re-target the script at slug "${occupant.slug}".`);
    console.log('  ⚠ ──────────────────────────────────────────────────────────');
  }

  const pageId = uuidv4();
  const newPage = {
    _id: pageId,
    book_id: String(book._id),
    chapter_number: CHAPTER_NUMBER,
    page_number: pageNumber,
    slug: PAGE_SLUG,
    title: 'Electronic Configuration of Atoms',
    subtitle: 'The three rules that fill every atom — and why chromium and copper break them',
    blocks,
    tags: [],
    published: true,
    reading_time_min: READING_TIME_MIN,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await pagesCol.insertOne(newPage);
  console.log(`  ✓ created: "${newPage.title}" — ${blocks.length} blocks (page_number ${pageNumber})`);

  await linkPageToChapter(booksCol, book, pageId);
  printBlockMap(blocks);
}

// Append a page id to chapter 2's page_ids — guarded so re-runs never duplicate.
async function linkPageToChapter(booksCol, book, pageId) {
  const chapterIndex = (book.chapters || []).findIndex((c) => c.number === CHAPTER_NUMBER);
  if (chapterIndex === -1) {
    console.log(`  ⚠ Chapter ${CHAPTER_NUMBER} not found in book.chapters — page created but not linked`);
    return;
  }
  const current = book.chapters[chapterIndex].page_ids || [];
  if (current.includes(pageId)) {
    console.log(`  ✓ Chapter ${CHAPTER_NUMBER} already links this page (no change)`);
    return;
  }
  const pageIds = [...current, pageId];
  await booksCol.updateOne(
    { _id: book._id },
    { $set: { [`chapters.${chapterIndex}.page_ids`]: pageIds, updated_at: new Date() } }
  );
  console.log(`  ✓ Added page to chapter ${CHAPTER_NUMBER} page_ids (now ${pageIds.length} pages)`);
}

function printBlockMap(blocks) {
  console.log('\n  Block map (electron-configuration):');
  for (const b of blocks) {
    const label = (b.text || b.title || b.label || b.simulation_id || (b.markdown || b.prompt || '').slice(0, 50) || '')
      .replace(/\n/g, ' ')
      .slice(0, 55);
    console.log(`    [${String(b.order).padStart(2, '0')}] ${b.type.padEnd(16)} ${label}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log('Connected to MongoDB\n');

  const db = client.db('crucible');

  try {
    console.log('── Create page: Electronic Configuration of Atoms (Ch.2) ──');
    await createPage(db);
  } finally {
    await client.close();
    console.log('\nDone.');
  }
}

main().catch((err) => {
  console.error('ERROR:', err);
  process.exit(1);
});
