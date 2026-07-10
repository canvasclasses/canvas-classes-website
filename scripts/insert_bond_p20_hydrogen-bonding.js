'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 20.
 * "Hydrogen Bonding — Why Water Breaks the Rules"
 * Covers: what an H-bond is (H on F/O/N + an F/O/N lone pair), the donor/acceptor
 * requirement, intermolecular vs intramolecular (HF chains/water/dimers vs
 * ortho-nitrophenol/salicylaldehyde), and the consequences — anomalous boiling points
 * (H2O/HF/NH3), ice less dense than water, high solubility, DNA/proteins, plus the HF
 * zigzag chain. published:false — founder reviews + generates the pending images, then publishes.
 *
 * Reference-first: grounded in Shishir Mittal Physical Chemistry §21.5 (Hydrogen Bonding —
 * strength, the Group VI/V/VII boiling-point anomaly, inter vs intra) + NCERT Class 11 Ch.4
 * + standard JEE treatment. Re-expressed in our voice (BOND-exemplars.md), not copied.
 * Voice: BOND-exemplars.md (HF zigzag "write & practise it once"; inter vs intra trap;
 * OCH3-can't-donate trap) + teacher-voice-profile.md.
 *
 * Run: node scripts/insert_bond_p20_hydrogen-bonding.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 20;
const NEW_SLUG = 'hydrogen-bonding';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A steel needle resting on the surface of water and an ice cube floating, with faint dotted hydrogen bonds linking water molecules',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A serene scene of liquid water: a steel sewing needle resting on top of the water surface without sinking on the left, and a clear ice cube floating in the same water on the right. Around and beneath the surface, a faint network of water molecules connected by glowing dotted lines (hydrogen bonds) forming an open lattice. The visual idea is "water breaks the rules" — surface tension holding the needle, ice floating. Cool blue lighting with a few warm highlights. Clean scientific illustration style. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Solid That Floats',
      markdown: "Almost every solid sinks in its own liquid — drop solid wax into melted wax and it goes straight down. Water does the **opposite**: ice floats. That one oddity is why a frozen lake freezes from the **top**, leaving liquid water underneath where fish survive the winter. The reason is a single weak attraction — the **hydrogen bond** — and the same bond is why water boils far hotter than its tiny size should allow, and why a needle can rest on its surface." },

    // 2 — core concept text (what an H-bond is + the F/O/N requirement)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A **hydrogen bond** is the attraction between a hydrogen atom that is **already covalently bonded to a small, highly electronegative atom** — and there are only three that qualify: **fluorine, oxygen, nitrogen ( F, O, N )** — and a **lone pair** sitting on another electronegative atom nearby.\n\n" +
      "Here is why only F, O and N work. They are so electronegative that they pull the shared electrons hard toward themselves, leaving the hydrogen almost bare — a tiny, exposed positive proton. That exposed H is then strongly drawn to a lone pair on the next molecule's F, O or N. Write it as $ \\ce{X-H \\bond{...} :Y} $, where X and Y are F, O or N, and the dotted line is the hydrogen bond.\n\n" +
      "How strong is it? **In between.** A hydrogen bond is much **stronger than an ordinary van der Waals attraction**, but much **weaker than a real covalent bond** — roughly a tenth of a covalent bond's strength. Strong enough to change boiling points and freeze lakes from the top; weak enough to break and re-form constantly in liquid water." },

    // 3 — heading: what it is & requirements
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Two Things You Need: a Donor and an Acceptor',
      objective: 'Decide whether a molecule can hydrogen-bond by checking for an H on F/O/N (donor) and an F/O/N lone pair (acceptor).' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Every hydrogen bond needs **two partners**:\n\n" +
      "- A **donor** — a molecule that supplies the special hydrogen, i.e. an **H atom bonded to F, O or N**. The donor brings the bare proton.\n" +
      "- An **acceptor** — a molecule that supplies a **lone pair on F, O or N** for that proton to grab onto.\n\n" +
      "Most molecules with F, O or N can play both roles. Water $ \\ce{H2O} $ has two O–H bonds (donor) **and** two lone pairs on oxygen (acceptor) — which is why one water molecule can form up to **four** hydrogen bonds.\n\n" +
      "**The trap that catches everyone:** having an oxygen is **not enough** to donate. Look at the $ \\ce{-OCH3} $ (methoxy) group. It has an oxygen, so it can **accept** a hydrogen bond — but its hydrogens sit on carbon, not on the oxygen. No H on the O means **it cannot donate**. Put two $ \\ce{-OCH3} $ groups facing each other and there is no hydrogen bond at all. Compare this to $ \\ce{-NH2} $ (amine): it has nitrogen **and** an H sitting right on that nitrogen, so it can both donate and accept. *Always ask: is the H actually on the F, O or N?*" },

    // 4 — image: HF zigzag chain (the founder's "draw and practise it once" structure)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'The zigzag chain structure of hydrogen fluoride, with fluorine atoms at the corners and hydrogen atoms at the bends, joined by dotted hydrogen bonds at about 120 degrees',
      caption: '📸 The HF zigzag chain — F at the corners, H at the bends (~120°). Draw it once by hand.',
      generation_prompt: 'Chemical structure diagram of solid/liquid hydrogen fluoride (HF) drawn as a long zigzag chain. Fluorine atoms (F) sit at the corners/points of the zigzag and hydrogen atoms (H) sit at the bends between them. Each F is connected to one H by a solid covalent line and to the next H by a dotted hydrogen-bond line. Mark the bend angle as approximately 120 degrees. Label one covalent H–F bond as "covalent" and one dotted line as "hydrogen bond". Show at least four F atoms so the repeating zigzag is obvious. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 5 — reasoning_prompt (mid-page) — why HF boils higher than HCl
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "HCl is a heavier molecule than HF, yet HF boils at about 20 °C while HCl boils at about −85 °C — HF boils far higher. Why does the lighter molecule boil hotter?",
      options: [
        "HCl is heavier, so it should and does boil higher — the values in the question are reversed",
        "Fluorine is small and highly electronegative, so HF forms strong hydrogen bonds (H on F + F lone pair); chlorine is larger and less electronegative, so HCl cannot — extra energy is needed to break HF's hydrogen bonds before it boils",
        "HF is ionic and HCl is covalent, so HF needs more energy to boil",
        "HCl molecules repel each other, which lowers their boiling point below HF"
      ],
      correct_index: 1,
      reveal: "Boiling means pulling molecules apart, so whatever holds them together sets the boiling point. HF molecules are locked together by hydrogen bonds — H bonded to tiny, very electronegative fluorine, attracted to fluorine's lone pair on the next molecule. Breaking those bonds costs real energy, so HF boils high. Chlorine is bigger and less electronegative, so H–Cl does not meet the F/O/N requirement — no hydrogen bonding, only weak van der Waals forces, so HCl boils far lower despite being heavier. (Same logic explains why H₂O outboils H₂S and NH₃ outboils PH₃.)" },

    // 6 — heading: intermolecular vs intramolecular
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Two Addresses: Between Molecules vs Within One',
      objective: 'Tell apart intermolecular and intramolecular hydrogen bonding and predict how each changes boiling point.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Hydrogen bonds come in two kinds, depending on **where** the donor and acceptor live:\n\n" +
      "**Intermolecular** — the bond forms **between two separate molecules**. This is the common one: $ \\ce{HF} $ chains, liquid water, $ \\ce{NH3} $, alcohols, and the famous **dimers** of carboxylic acids (two acetic acid molecules clip together through two hydrogen bonds). Because intermolecular bonds **link molecules together**, they make the substance harder to pull apart — so they **raise** the boiling point.\n\n" +
      "**Intramolecular** — the bond forms **inside a single molecule**, when a donor and an acceptor on the *same* molecule are close enough to reach each other. The classic example is **ortho-nitrophenol**, where the –OH and the neighbouring –NO₂ group fold into a little ring. Because the molecule's H is now busy bonding to *itself*, it is **not** available to link to its neighbours — so intramolecular bonding often **lowers** the boiling point compared with an isomer that bonds between molecules.\n\n" +
      "**The trap examiners love to swap:** ortho-nitrophenol is **INTRA**molecular (the bond is within one molecule). An HF–HF link is **INTER**molecular (between two molecules). Statement questions deliberately flip these labels — read which way the bond points." },

    // 7 — image: ortho-nitrophenol intramolecular ring
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Ortho-nitrophenol showing an intramolecular hydrogen bond folding the OH group toward the neighbouring nitro group into a six-membered ring',
      caption: '📸 Ortho-nitrophenol — the –OH bonds to the next-door –NO₂ within the same molecule (intramolecular)',
      generation_prompt: 'Chemical structure diagram of ortho-nitrophenol: a benzene ring with an –OH group on one carbon and an –NO2 (nitro) group on the carbon right next to it (ortho position). Show a dotted hydrogen-bond line running from the hydrogen of the –OH to an oxygen of the –NO2, folding them together into a small six-membered ring, all WITHIN the single molecule. Label "intramolecular hydrogen bond" pointing at the dotted line. Beside it, a small inset showing two separate HF molecules joined by a dotted line labelled "intermolecular" for contrast. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 8 — worked_example 1: which molecules can hydrogen-bond (the OCH3 trap)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Which of These Can Hydrogen-Bond?',
      problem: "For each substance, decide whether it can form significant intermolecular hydrogen bonds (molecule-to-molecule): (a) $ \\ce{HF} $, (b) $ \\ce{CH3OH} $ (methanol), (c) $ \\ce{CH3-O-CH3} $ (dimethyl ether), (d) $ \\ce{CH4} $ (methane).",
      solution: "Run the one test every time: **is there an H sitting on an F, O or N (a donor), and an F/O/N lone pair to accept it?**\n\n" +
        "**(a) $ \\ce{HF} $ — YES.** H is bonded directly to fluorine (donor), and fluorine carries lone pairs (acceptor). Strong hydrogen bonding — this is the textbook case.\n\n" +
        "**(b) $ \\ce{CH3OH} $ — YES.** The O–H group means a hydrogen is sitting on oxygen (donor), and oxygen's lone pairs accept. Alcohols hydrogen-bond, which is why methanol mixes with water.\n\n" +
        "**(c) $ \\ce{CH3-O-CH3} $ — NO (cannot donate).** This is the $ \\ce{-OCH3} $ trap in disguise. There **is** an oxygen, so it can *accept* a hydrogen bond — but every hydrogen sits on **carbon**, not on the oxygen. With no H on the O, it cannot **donate**, so two ether molecules cannot hydrogen-bond to each other. (This is exactly why dimethyl ether boils far below its isomer ethanol.)\n\n" +
        "**(d) $ \\ce{CH4} $ — NO.** No F, O or N anywhere, and all H sit on carbon. Only weak van der Waals forces. No hydrogen bonding." },

    // 9 — worked_example 2: inter vs intra in a given pair
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Intermolecular or Intramolecular?',
      problem: "Label each case as intermolecular or intramolecular hydrogen bonding, and say what it does to the boiling point: (a) two $ \\ce{HF} $ molecules joined in a chain, (b) ortho-nitrophenol (–OH next to –NO₂ on the ring), (c) para-nitrophenol (–OH and –NO₂ on opposite sides of the ring).",
      solution: "Ask the single question: **is the bond within one molecule, or between two?**\n\n" +
        "**(a) HF chain — INTERmolecular.** The bond runs from one HF molecule to the next. It links molecules together, so it **raises** the boiling point.\n\n" +
        "**(b) ortho-nitrophenol — INTRAmolecular.** The –OH and the –NO₂ are right next to each other, so the H folds in and bonds within the *same* molecule. That H is now used up, so it cannot link to neighbours — the molecule is more 'self-contained' and **more volatile** (lower boiling point, it is even steam-volatile).\n\n" +
        "**(c) para-nitrophenol — INTERmolecular.** The two groups are too far apart to reach each other inside the molecule, so the –OH bonds to *other* molecules instead. That links molecules together and gives para-nitrophenol the **higher** boiling point of the two.\n\n" +
        "**Verdict:** ortho is intra (lower b.p.), para is inter (higher b.p.) — a JEE favourite. The position of the second group decides everything." },

    // 10 — table: intermolecular vs intramolecular
    { id: uuidv4(), order: n(), type: 'table', caption: 'Intermolecular vs intramolecular hydrogen bonding',
      headers: ['Feature', 'Intermolecular', 'Intramolecular'],
      rows: [
        ['Where the bond forms', 'Between two separate molecules', 'Within a single molecule'],
        ['Examples', 'HF chains, water, NH₃, alcohols, carboxylic-acid dimers', 'ortho-nitrophenol, salicylaldehyde'],
        ['Effect on boiling point', 'Raises it (molecules linked together)', 'Often lowers it (H used up internally)'],
        ['Effect on solubility in water', 'Increases it (can bond to water)', 'Decreases it (H not free for water)'],
      ] },

    // 11 — heading: consequences
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Water Breaks the Rules',
      objective: 'Connect hydrogen bonding to water\'s anomalies — high boiling point, floating ice, and high solubility of alcohols and sugars.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Now the famous oddities all line up behind one cause:\n\n" +
      "**The boiling-point anomaly.** Plot the boiling points of the hydrides going down each group and you expect them to *rise* with size (heavier = harder to boil). They do — except the first member of groups with F, O and N jumps way up. $ \\ce{H2O} $ boils far hotter than $ \\ce{H2S} $, $ \\ce{HF} $ far hotter than $ \\ce{HCl} $, $ \\ce{NH3} $ far hotter than $ \\ce{PH3} $. The extra energy goes into breaking hydrogen bonds. This is the graph every exam shows.\n\n" +
      "**Ice floats.** In liquid water, molecules hydrogen-bond in a jumbled, close-packed way. When water freezes, the hydrogen bonds lock every molecule into an **open, cage-like lattice** with gaps in it — so ice takes up *more* room than the same mass of liquid water. Lower density means ice **floats**, and lakes freeze top-down.\n\n" +
      "**High solubility.** Alcohols and sugars dissolve readily in water because their –OH groups hydrogen-bond to water molecules. The substance is 'welcomed in' by water's hydrogen-bond network.\n\n" +
      "**Life itself.** Hydrogen bonds hold the two strands of **DNA** together (so they can be unzipped and copied) and fold **proteins** into their working shapes — weak enough to break on demand, strong enough to hold structure." },

    // 12 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Rules You Must Not Mix Up',
      markdown: "**The H must be on F, O or N — nothing else qualifies.** An oxygen alone is not enough: $ \\ce{-OCH3} $ can accept but cannot donate (its H is on carbon); $ \\ce{-NH2} $ can do both.\n\n" +
        "**Intermolecular** bonding **raises** the boiling point (molecules get linked together). **Intramolecular** bonding **often lowers** it (the H is used up inside one molecule and can't link to neighbours).\n\n" +
        "Strength order: **van der Waals < hydrogen bond < covalent bond.**" },

    // 13 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Three things examiners test almost every year:**\n\n" +
        "**ortho vs para nitrophenol.** *ortho*-nitrophenol has **intramolecular** H-bonding (–OH next to –NO₂), so it is more volatile / lower-boiling / steam-volatile. *para*-nitrophenol has **intermolecular** H-bonding, so it boils higher. Don't swap the labels.\n\n" +
        "**The anomaly trio.** $ \\ce{H2O} $, $ \\ce{HF} $ and $ \\ce{NH3} $ boil far higher than their group neighbours because of hydrogen bonding. Order of H-bond strength: $ \\ce{HF} > \\ce{H2O} > \\ce{NH3} $ (F most electronegative), but water has the highest boiling point because each molecule makes more H-bonds.\n\n" +
        "**The donor trap.** $ \\ce{-OCH3} $ (and ethers, esters) **cannot donate** an H-bond — oxygen is present but no H sits on it. Put two such groups together and there is no hydrogen bonding.\n\n" +
        "**The HF zigzag** is asked directly. Draw it once by hand: **F at the corners, H at the bends, ~120°** — write and practise it once or you will not remember it in the exam." },

    // 14 — inline_quiz (§3.6.1) — LAST content block before the bridge
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'For a hydrogen bond to form, the hydrogen atom must already be covalently bonded to which kind of atom?',
          options: [
            'Any non-metal atom, such as carbon, sulfur, or chlorine',
            'A small, highly electronegative atom — fluorine, oxygen, or nitrogen',
            'A metal atom such as sodium or magnesium',
            'Another hydrogen atom, as in the H₂ molecule'
          ],
          correct_index: 1,
          explanation: 'Only F, O and N are small and electronegative enough to strip the hydrogen nearly bare, creating the exposed proton a hydrogen bond needs. Carbon, sulfur and chlorine are too weakly electronegative (or too large), so an H on them does not hydrogen-bond.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Dimethyl ether (CH₃–O–CH₃) and ethanol (C₂H₅OH) have the same molecular formula, yet ethanol boils far higher. Why?',
          options: [
            'Ethanol is heavier, so it naturally boils higher',
            'Dimethyl ether is ionic while ethanol is covalent',
            'Ethanol has an O–H group so it can donate hydrogen bonds; dimethyl ether has an oxygen but no H on it, so it cannot donate and barely hydrogen-bonds',
            'Dimethyl ether forms stronger hydrogen bonds, which lower its boiling point'
          ],
          correct_index: 2,
          explanation: 'Ethanol has its H sitting on oxygen (O–H), so it is a hydrogen-bond donor and its molecules link together, raising the boiling point. Dimethyl ether has oxygen but all its hydrogens are on carbon — it can accept but not donate, so it cannot build an H-bond network. They weigh the same, so mass is not the reason.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'ortho-nitrophenol is more volatile (boils lower) than para-nitrophenol. The best explanation is:',
          options: [
            'ortho-nitrophenol has intramolecular hydrogen bonding, so its –OH hydrogen is tied up within the molecule and not available to link neighbours; para-nitrophenol bonds between molecules and so boils higher',
            'para-nitrophenol is a heavier molecule than ortho-nitrophenol',
            'ortho-nitrophenol has intermolecular hydrogen bonding while para-nitrophenol has intramolecular',
            'Neither isomer can form hydrogen bonds at all'
          ],
          correct_index: 0,
          explanation: 'In the ortho isomer the –OH and –NO₂ sit side by side, so the hydrogen folds in and bonds within the same molecule (intramolecular) — that H can no longer link to other molecules, so the substance is more volatile. In the para isomer the groups are too far apart to reach each other, so the –OH bonds between molecules (intermolecular), linking them and raising the boiling point. Note the labels are the exact opposite of option three.' },
      ] },

    // 15 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*The hydrogen bond is the strongest member of a bigger family — the **intermolecular forces** that act between all molecules. Next, we'll meet the whole family of **van der Waals forces** (dipole–dipole, dipole–induced-dipole, and the London dispersion forces even noble gases feel) and see how they set melting points, boiling points, and why anything condenses at all.*" },
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
    slug: NEW_SLUG, title: 'Hydrogen Bonding — Why Water Breaks the Rules',
    subtitle: 'An H on F, O or N + an F/O/N lone pair — the weak bond behind floating ice and water\'s strange boiling point.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'hydrogen-bonding', 'intermolecular-forces'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 20 (hydrogen bonding)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
