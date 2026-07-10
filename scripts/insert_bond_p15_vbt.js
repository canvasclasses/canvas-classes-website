'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 15.
 * "Valence Bond Theory — Bonds by Orbital Overlap".
 * Covers the VBT core idea (a covalent bond = overlap of two half-filled atomic
 * orbitals; greater overlap → stronger bond; electrons stay localised), the sigma
 * bond (head-on / axial overlap, cylindrically symmetric, always the first bond),
 * the pi bond (sideways / lateral overlap of parallel p-orbitals, weaker, the 2nd
 * and 3rd bonds), counting σ/π in single/double/triple bonds, the strength /
 * extent-of-overlap order, and a one-line bridge to MOT (O₂ paramagnetism, electron-
 * deficient species) which VBT cannot explain.
 *
 * Grounded in Shishir Mittal Physical Chemistry §19.5 (Valence Bond Theory) +
 * NCERT Class 11 Ch.4 + standard JEE treatment. Re-expressed in our voice — not copied.
 * Voice: BOND-exemplars.md (lobe-direction mismatch §A; σ/π overlap; "first bond is
 * always σ, the rest are π") + teacher-voice-profile.md (FORMAT v2).
 *
 * Inserts at page_number 15 and appends to ch4 page_ids (no shifting). published:false —
 * founder reviews + generates the 1 pending image, then publishes.
 * NO simulation block (per spec).
 * Run: node scripts/insert_bond_p15_vbt.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 15;
const NEW_SLUG = 'valence-bond-theory';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'Two atomic orbitals reaching toward each other and overlapping in the region between two nuclei to form a bond',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). Two atoms on either side, each shown as a nucleus with a single glowing dumbbell-shaped p-orbital lobe reaching toward the centre. In the middle, the two lobes meet head-on and merge into one bright shared region of electron density sitting directly on the line joining the two nuclei — visually conveying "a bond is where two orbitals overlap." A faint second pair of parallel lobes hints at sideways overlap above and below. Glowing, technical, scientific illustration style. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style. No large text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Not All Bonds Are Equal',
      markdown: "A carbon–carbon **double bond** looks like two identical lines on paper — but the two bonds inside it are **not the same kind**. One is strong and hard to break; the other is weaker and far easier to snap. That is exactly why a C=C double bond is so reactive: chemistry attacks the *easy* one and leaves the tough one alone. By the end of this page you'll know which is which — and why a triple bond hides one strong bond and two weak ones." },

    // 2 — core concept text (the overlap idea)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "So far we've drawn bonds as a shared pair of dots between two atoms. **Valence Bond Theory (VBT)** tells us what that shared pair actually *is*.\n\n" +
      "The idea is simple: a covalent bond forms when a **half-filled orbital** of one atom **overlaps** with a half-filled orbital of another atom. The two single electrons pair up in the region where the orbitals merge, and that shared electron cloud — sitting between the two nuclei — is the bond. It pulls on both nuclei at once, holding them together.\n\n" +
      "Two consequences follow, and they run through the whole page:\n\n" +
      "1. **More overlap → stronger bond.** The more the two orbitals dive into each other, the denser the shared cloud, the tighter the grip.\n" +
      "2. **The electrons stay put — localised between the two atoms.** In VBT each bonding pair belongs to *its own two atoms*. (Hold on to this. Two pages from now, **Molecular Orbital Theory** will say the electrons belong to the *whole molecule* instead — and that disagreement is where VBT starts to crack.)" },

    // 3 — heading: sigma bond
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Sigma (σ) Bond — Head-On Overlap',
      objective: 'See how orbitals meeting along the bond axis make the strongest, most symmetric bond.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "When two orbitals overlap **end-to-end, along the line joining the two nuclei** (the bond axis), the bond is a **sigma ($\\sigma$) bond**.\n\n" +
      "The shared electron cloud sits *directly on* that axis — its density is **maximum along the line joining the nuclei**. Because the overlap is head-on, a σ bond is **cylindrically symmetric**: spin the molecule about the bond axis and the bond looks exactly the same from every angle.\n\n" +
      "Sigma bonds form by several kinds of axial overlap:\n\n" +
      "- **s–s overlap** — two s orbitals meet, as in H–H (the $\\ce{H2}$ molecule).\n" +
      "- **s–p overlap** — an s orbital meets a p orbital end-on, as in H–Cl.\n" +
      "- **p–p overlap** — two p orbitals meet head-on along their long axis.\n\n" +
      "Head-on overlap is the most effective kind, so the σ bond is **strong**. And here is the rule worth drilling: **the very first bond between any two atoms is always a $\\sigma$ bond.** A single bond *is* one σ bond — nothing else." },

    // 4 — heading: pi bond
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Pi (π) Bond — Sideways Overlap',
      objective: 'See why parallel p-orbitals overlapping side-on make a weaker, second-and-third bond.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Once two atoms are already joined by a σ bond, any *extra* bond between them cannot be head-on — the axis is taken. The leftover p orbitals on each atom now lie **parallel** to each other, sticking out sideways. They overlap **side-on**, above and below the bond axis. This is a **pi ($\\pi$) bond**.\n\n" +
      "A π bond looks completely different from a σ bond:\n\n" +
      "- The shared cloud sits in **two regions — one above and one below** the bond axis, *not* on the axis itself.\n" +
      "- Along the line joining the two nuclei, the electron density is actually **zero** (there is a nodal plane right through it).\n" +
      "- Sideways overlap is **less effective** than head-on overlap, so a $\\pi$ bond is **weaker than a $\\sigma$ bond.**\n\n" +
      "Sideways overlap also explains a quiet trap. A p orbital points in a fixed direction — its two lobes stick out one way. A π bond can only form where those lobes **actually point**: the two p orbitals must be parallel and lined up. *You may want the bond here, but if the lobe points there, it won't form.* Twist one atom and the parallel overlap is lost — which is exactly why double bonds can't rotate freely.\n\n" +
      "The pattern: **the second and third bonds between two atoms are always $\\pi$ bonds.**" },

    // 5 — image: head-on σ vs sideways π
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Side-by-side comparison of head-on sigma overlap along the axis versus sideways pi overlap of two parallel p-orbitals above and below the axis',
      caption: '📸 Sigma: overlap on the axis. Pi: overlap above and below it, weaker.',
      generation_prompt: 'Two-panel chemical bonding diagram comparing sigma and pi bonds. LEFT PANEL labelled "σ bond (head-on)": two p-orbital dumbbell lobes pointing toward each other along a horizontal axis, overlapping end-to-end in one dense region sitting directly on the line joining the two nuclei; show the two nuclei as dots on that axis; cloud is cylindrically symmetric about the axis. RIGHT PANEL labelled "π bond (sideways)": two p-orbital dumbbells oriented vertically and parallel to each other on two adjacent atoms, overlapping side-on to form two separate cloud regions — one above and one below the horizontal bond axis — with a clearly marked nodal plane (zero density) along the axis between the nuclei. Label axis, nuclei, overlap regions, nodal plane. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 6 — heading: counting σ and π
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Counting σ and π in Single, Double, Triple Bonds',
      objective: 'Learn the fixed σ/π count for every bond order so you can read any structure instantly.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Put the two rules together — *first bond is σ, the rest are π* — and the count of every bond falls out automatically:\n\n" +
      "- **Single bond** = **1 σ** (just the head-on bond).\n" +
      "- **Double bond** = **1 σ + 1 π** (the head-on bond, plus one sideways bond).\n" +
      "- **Triple bond** = **1 σ + 2 π** (the head-on bond, plus two sideways bonds using two perpendicular pairs of p orbitals).\n\n" +
      "This is pure bookkeeping, and it never changes. To count the total σ and π bonds in a molecule, just walk through every bond: each line of a bond contributes one σ for the bond and one π for every *extra* line beyond the first." },

    // 7 — reasoning_prompt (mid-page, after counting concept) — N₂ triple bond
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Nitrogen gas is N₂, with a triple bond between the two nitrogen atoms (N≡N). How many σ bonds and how many π bonds hold the two atoms together?",
      options: [
        "3 σ bonds and 0 π bonds — a triple bond is just three head-on overlaps",
        "1 σ bond and 2 π bonds — the first bond is head-on, the other two are sideways",
        "2 σ bonds and 1 π bond — two head-on bonds plus one sideways bond",
        "0 σ bonds and 3 π bonds — all three are sideways p-orbital overlaps"
      ],
      correct_index: 1,
      reveal: "The first bond between any two atoms is always a σ bond (head-on overlap), and every bond after it must be a π bond (sideways overlap), because the axis is already used. So a triple bond is **1 σ + 2 π** — never three σ. In N₂ the two atoms share one head-on σ bond and two side-on π bonds (from two perpendicular pairs of p orbitals). The σ bond is the strong backbone; the two π bonds are the weaker, more exposed bonds." },

    // 8 — heading: strength & extent of overlap
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Strength and the Extent of Overlap',
      objective: 'Rank overlap types by how much the orbitals merge, and connect that to bond strength.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "VBT's single most useful prediction: **the more two orbitals overlap, the stronger the bond.** Bond strength is just a measure of how deeply the electron clouds merge.\n\n" +
      "That instantly explains why **σ > π in strength** — head-on overlap simply puts more orbital into the shared region than sideways overlap can. It also ranks the σ overlaps themselves. Among s–s, s–p and p–p head-on overlaps, the order of effectiveness (and hence bond strength) is:\n\n" +
      "$ s\\text{–}s < s\\text{–}p < p\\text{–}p $\n\n" +
      "p–p overlap is the most directional — both lobes point straight at each other — so it overlaps the most. s–s is the least effective because an s orbital is a diffuse sphere with no direction to aim.\n\n" +
      "This is also why **direction matters so much**. An s orbital is a ball — it overlaps the same from every side. But a p orbital is a directed dumbbell: it overlaps well only when the other orbital meets it *along the direction the lobe points*. Aim it wrong and the overlap — and the bond — fails." },

    // 9 — worked_example 1: count σ/π in ethene (C₂H₄)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Counting σ and π in ethene (C₂H₄)',
      problem: "Ethene (ethylene), C₂H₄, has the structure H₂C=CH₂: a carbon–carbon double bond, with two C–H single bonds on each carbon. Count the total number of σ bonds and π bonds in the molecule.",
      solution: "Go bond by bond, using *first bond = σ, the rest = π*.\n\n" +
        "**The four C–H bonds:** each is a single bond → each is **1 σ**. That gives **4 σ** bonds.\n\n" +
        "**The C=C double bond:** a double bond = **1 σ + 1 π**.\n\n" +
        "**Add them up:**\n\n" +
        "σ bonds = 4 (C–H) + 1 (C=C) = **5 σ**\n\n" +
        "π bonds = **1 π** (the second line of the C=C).\n\n" +
        "**Answer: 5 σ bonds and 1 π bond.** Notice the π bond is the weak link — it is the bond that breaks when ethene reacts (for example, when it adds bromine across the double bond)." },

    // 10 — worked_example 2: count σ/π in CO₂
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Counting σ and π in carbon dioxide (CO₂)',
      problem: "Carbon dioxide is O=C=O — the carbon is joined to each oxygen by a double bond. Count the total number of σ bonds and π bonds in CO₂.",
      solution: "There are two double bonds, one on each side of the carbon.\n\n" +
        "**Each C=O double bond:** = **1 σ + 1 π**.\n\n" +
        "**Two of them:**\n\n" +
        "σ bonds = 1 + 1 = **2 σ**\n\n" +
        "π bonds = 1 + 1 = **2 π**\n\n" +
        "**Answer: 2 σ bonds and 2 π bonds.** Both σ bonds are the strong head-on backbone of the molecule; the two π bonds are the weaker, more reactive bonds sitting sideways above and below the O=C=O axis." },

    // 11 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Two Rules That Decode Every Bond',
      markdown: "**1. The first bond between two atoms is always a $\\sigma$ bond (head-on overlap). Every bond after it is a $\\pi$ bond (sideways overlap).** So single = 1σ, double = 1σ + 1π, triple = 1σ + 2π.\n\n" +
        "**2. More overlap = stronger bond.** Head-on beats sideways, so $\\sigma > \\pi$ in strength — which is why the $\\pi$ bond is the weak, reactive part of every double and triple bond." },

    // 12 — exam_tip callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**\"Count the σ and π bonds in this molecule\" is a guaranteed exam question.** Method: every bond contributes one σ; every *extra* line beyond the first contributes one π. Walk the structure once and tally — don't guess.\n\n" +
        "**Why π is weaker AND more reactive:** sideways overlap is poorer than head-on, so the π bond holds less tightly. That same exposed, above-and-below cloud is easy for other molecules to attack — so reactions of double/triple bonds break the **π** bond first, leaving the σ backbone intact.\n\n" +
        "**Classic traps:** (i) a triple bond is **1σ + 2π**, *not* 3σ — examiners bait the \"3 σ\" reflex; (ii) σ bonds are cylindrically symmetric, π bonds are not — a single bond is symmetric about the axis, a double bond is not." },

    // 13 — inline_quiz (LAST block) — §3.6.1
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'According to Valence Bond Theory, a covalent bond forms when:',
          options: [
            'Two completely filled orbitals of two atoms overlap and exchange electrons',
            'A half-filled orbital of one atom overlaps a half-filled orbital of another atom, and the electrons pair in the shared region',
            'One atom completely transfers an electron to the other atom',
            'Two empty orbitals of two atoms point toward each other along the bond axis'
          ],
          correct_index: 1,
          explanation: 'VBT describes a covalent bond as the overlap of two half-filled atomic orbitals; the single electrons pair up in the overlapping region, and that shared cloud between the nuclei is the bond. Filled orbitals have no unpaired electron to share, empty orbitals have no electrons at all, and complete transfer describes an ionic bond, not VBT covalent overlap.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Which statement correctly compares the sigma (σ) and pi (π) bonds in a carbon–carbon double bond?',
          options: [
            'Both are equally strong because they share the same two atoms',
            'The π bond is stronger because it has electron density on both sides of the axis',
            'The σ bond is stronger because head-on overlap is more effective than the sideways overlap of the π bond',
            'The σ bond is weaker because its electron density lies directly between the repelling nuclei'
          ],
          correct_index: 2,
          explanation: 'A σ bond is formed by head-on (axial) overlap, which merges the orbitals more deeply than the side-on overlap of a π bond. More overlap means a stronger bond, so σ > π. In a double bond the π bond is the weaker, more reactive partner — which is why reactions attack it first.' },
        { id: uuidv4(), difficulty_level: 3,
          question: 'A molecule contains one C≡C triple bond and four C–H single bonds (it is C₂H₂... plus extra hydrogens — treat the listed bonds literally). Counting only the bonds listed, how many σ and π bonds are present?',
          options: [
            '7 σ and 0 π bonds — every bond drawn counts as one σ',
            '5 σ and 2 π bonds — the triple bond is 1σ + 2π, plus four C–H σ bonds',
            '3 σ and 4 π bonds — the triple bond contributes three bonds and each C–H adds a π',
            '6 σ and 1 π bonds — a triple bond is 2σ + 1π plus the four C–H σ bonds'
          ],
          correct_index: 1,
          explanation: 'Use "first bond = σ, the rest = π". The C≡C triple bond is 1 σ + 2 π. Each of the four C–H single bonds is 1 σ. Total σ = 1 + 4 = 5; total π = 2. A triple bond is never 3 σ (option a/d traps), and single bonds never contain π bonds (option c trap).' },
      ] },

    // 14 — bridge to next page (back bonding)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "VBT gives us a beautifully physical picture — bonds as overlapping orbitals, σ for the first, π for the rest. But it has blind spots. It cannot explain why **oxygen ($\\ce{O2}$) is paramagnetic** (it has unpaired electrons that a simple shared-pair picture hides), and it struggles with **electron-deficient species**. Those failures are what push us toward **Molecular Orbital Theory**, two pages ahead.\n\n" +
      "*First, though, one more overlap story VBT handles brilliantly: what happens when one atom has a lone pair to spare and its neighbour has an empty orbital begging to be filled? That sideways donation is called **back bonding** — and it's next.*" },
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
    slug: NEW_SLUG, title: 'Valence Bond Theory — Bonds by Orbital Overlap',
    subtitle: 'A covalent bond is the overlap of two half-filled orbitals: σ head-on, π sideways — more overlap, stronger bond.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'valence-bond-theory', 'sigma-bond', 'pi-bond', 'orbital-overlap'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 15 (valence bond theory)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
