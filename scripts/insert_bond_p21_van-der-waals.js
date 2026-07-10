'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — FINAL PAGE (Page 21).
 * "Van der Waals Forces — The Weak Bonds That Decide Everything"
 * (intermolecular forces: ion–dipole, dipole–dipole, London dispersion; boiling-point trends;
 *  why noble gases liquefy; why I2 is a solid but F2 a gas). Hydrogen bonding is cross-referenced,
 *  not re-derived (it lives on the previous page).
 * Grounded in Mittal §21.4 (Forces between molecules — dipole-dipole attraction, evidence from
 *  noble gases, how van der Waals forces arise via instantaneous induced dipoles, size→boiling-point
 *  trend in Group VII and alkanes) + NCERT Class 11 Ch.4 + standard JEE treatment.
 * Voice: BOND-exemplars.md + teacher-voice-profile.md.
 * Inserts at page_number 21, appends to ch4 page_ids. published:false — founder reviews + generates
 *  the pending images, then publishes.
 * Run: node scripts/insert_bond_p21_van-der-waals.js   (DO NOT auto-run — founder review pending)
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 21;
const NEW_SLUG = 'van-der-waals-forces';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'Separate finished molecules drifting near each other, held by faint glowing threads of attraction',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). Several complete, separate molecules (already fully bonded — shown as small clusters of joined spheres) drifting close to one another in space, with very faint, thin, glowing threads of attraction stretching between them — not the thick strong bonds inside each molecule, but delicate whisper-thin links between molecules. Convey "weak pull between finished things". Like skydivers in free-fall briefly reaching toward each other before drifting apart. Cool blue space with subtle warm glow on the faint inter-molecular threads. Clean scientific illustration style. Dark background (#0a0a0a or near-black). No text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Even "Nothing" Is a Little Sticky',
      markdown: "Helium is the ultimate loner. Its outer shell is already full, it forms no bonds with anything, and it floats around as a single atom that wants nothing to do with the world. And yet — cool it down far enough (about $ -269\\ ^{\\circ}\\text{C} $) and helium **becomes a liquid**. Something must be pulling those aloof atoms together. If even helium, the atom that bonds with nobody, has a faint stickiness, then *every* substance must have it. That faint pull is what this whole page is about." },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The rest of this chapter was about the **strong** bonds *inside* a molecule — ionic, covalent, the ones that hold atoms together to make $ \\ce{H2O} $ or $ \\ce{HCl} $ in the first place. This page is about something completely different: the **weak** forces *between* finished molecules.\n\n" +
      "Think of skydivers in free-fall. Each one is a complete person (a finished molecule). They aren't joined the way your bones are joined — but they can still reach out and briefly hold hands as they fall. That grip is nothing like the strength holding *their own body* together. It's loose, it forms and breaks easily — but it's real. Those between-the-skydivers grips are **intermolecular forces** (also called **van der Waals forces**).\n\n" +
      "How weak? For solid chlorine, the energy to pull the $ \\ce{Cl2} $ molecules *apart from each other* is about $ 25\\ \\text{kJ/mol} $ — but the energy to break the $ \\ce{Cl-Cl} $ bond *inside* a molecule is about $ 244\\ \\text{kJ/mol} $, roughly **ten times** more. As a rule, intermolecular forces are about one-tenth to one-hundredth the strength of a real chemical bond.\n\n" +
      "So why give a whole page to forces this feeble? Because they decide the things you actually *see*: whether a substance is a **solid, liquid or gas** at room temperature, its **melting and boiling points**, and how well it **dissolves**. The strong bonds decide what the molecule *is*; the weak ones decide how it *behaves in a crowd*." },

    // 3 — heading: ion–dipole and dipole–dipole
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Permanent Pulls: Ion–Dipole and Dipole–Dipole',
      objective: 'Recognise the two attractions that need a built-in lopsided charge, and rank their strength.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Start with the two forces that need a **permanent** uneven charge to exist.\n\n" +
      "**Ion–dipole** — the strongest of the whole family. It happens when a full ion sits next to a polar molecule. Drop table salt in water: each $ \\ce{Na+} $ is surrounded by water molecules turning their slightly-negative oxygen ends toward it, and each $ \\ce{Cl-} $ is surrounded by water molecules turning their slightly-positive hydrogen ends toward it. That ion–dipole grip is exactly why salt dissolves. (You met this idea as *hydration* earlier in the chapter.)\n\n" +
      "**Dipole–dipole** — between two **polar molecules**, each of which carries a permanent positive end and a permanent negative end. The positive end of one molecule lines up next to the negative end of its neighbour, like tiny bar magnets settling head-to-tail. This is the force holding polar liquids like $ \\ce{HCl} $, acetone and chloroform together.\n\n" +
      "One special case you've already met: when the positive end is a **hydrogen atom bonded to N, O or F**, the dipole–dipole pull becomes unusually strong and gets its own name — the **hydrogen bond** (covered on the previous page). Think of it as the muscular cousin of dipole–dipole, not a separate species." },

    // 4 — heading: London dispersion — present in everything
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'London Forces — The Pull That Lives in Everything',
      objective: 'Understand how even a non-polar atom develops a fleeting dipole, and why this force is universal.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Now the deepest one — and the only force a non-polar substance has at all.\n\n" +
      "Here's the puzzle Mittal raises: a noble-gas atom has no permanent dipole and forms no bond. So what on earth holds liquid neon or solid argon together? The answer is **London dispersion forces** (after Fritz London).\n\n" +
      "The electrons in any atom are in constant motion. At any one instant they aren't perfectly evenly spread — by pure chance there's a little more electron cloud on one side than the other. For that **instant**, the atom has a tiny lopsided charge: an **instantaneous dipole**. That fleeting dipole nudges the electron cloud of the atom next door, *inducing* a matching dipole in it — positive end facing negative end. The two briefly attract. A heartbeat later the electrons have shuffled and the dipole has vanished — but it reappears somewhere else, again and again. Averaged over time every atom looks perfectly neutral, yet at every single instant there is a real, tiny attraction.\n\n" +
      "This is the honest truth behind the loner-atom puzzle: even two atoms that 'want nothing to do with each other' still feel a faint pull, because their electrons can never sit perfectly still. **London forces are present in absolutely everything** — polar or non-polar, atom or molecule. In non-polar substances and the noble gases, they are the *only* force there is. That is why helium, given a cold enough day, finally gives in and becomes a liquid." },

    // 5 — image: the three force types / London formation
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Three intermolecular forces side by side: ion-dipole, dipole-dipole, and an instantaneous induced dipole in London forces',
      caption: '📸 The intermolecular family — and how a fleeting dipole creates London forces',
      generation_prompt: 'Educational diagram, three panels side by side. Panel 1 "Ion-dipole": a positive ion (labelled Na+) with several polar water molecules around it, each turning its negative (oxygen) end toward the ion; show partial-charge labels delta-plus / delta-minus. Panel 2 "Dipole-dipole": two polar HCl molecules lined up head-to-tail, positive end of one near negative end of the other, with delta-plus and delta-minus labels and a faint attraction line between them. Panel 3 "London dispersion": two neutral atoms; the left atom shown with its electron cloud momentarily bunched to one side (an instantaneous dipole, delta- on the bunched side), inducing a matching dipole in the right atom; a small "instant" / "next moment" arrow hinting the dipole is fleeting. Keep the inter-molecular attraction lines visibly thin/faint compared to any internal bonds. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 6 — heading: boiling-point trends
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Bigger Means Stronger: The Boiling-Point Trends',
      objective: 'Predict which substance boils higher by judging the size, electron count, and shape of its molecules.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "London forces are weak per contact — but they grow in a way you can predict, and this controls a huge amount of everyday chemistry.\n\n" +
      "**1. More electrons (bigger molecule) → stronger London forces.** A bigger electron cloud is *softer*, easier to distort, so its instantaneous dipoles are larger. More electrons = a more easily disturbed cloud = more **polarisability**. That means more energy is needed to pull the molecules apart, so the **boiling point rises**. Watch it march down two groups:\n\n" +
      "- Noble gases: $ \\text{He} < \\text{Ne} < \\text{Ar} < \\text{Kr} < \\text{Xe} $ — boiling point climbs steadily as the atoms get bigger.\n" +
      "- Halogens: $ \\ce{F2} < \\ce{Cl2} < \\ce{Br2} < \\ce{I2} $ — same story, and it's dramatic. At room temperature $ \\ce{F2} $ is a **gas**, $ \\ce{Br2} $ is a **liquid**, and $ \\ce{I2} $ is a **solid**. Same kind of molecule, same kind of force — but iodine's huge electron cloud makes its London forces strong enough to lock the molecules into a solid, while fluorine's tiny cloud barely holds on.\n\n" +
      "**2. More surface contact → stronger London forces.** Two molecules attract along wherever they touch, so shape matters. Compare two alkanes with the *same* formula $ \\ce{C5H12} $: straight-chain **pentane** is a long rod that lies flat against its neighbours (lots of contact) and boils at $ 36\\ ^{\\circ}\\text{C} $; its branched twin **neopentane** is a compact ball that touches far less and boils at only $ 9\\ ^{\\circ}\\text{C} $. More surface contact, more grip, higher boiling point — branching lowers it." },

    // 7 — reasoning_prompt (mid-page, after the trends concept)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Iodine ($ \\ce{I2} $) and fluorine ($ \\ce{F2} $) are both non-polar diatomic molecules from the same group. Yet $ \\ce{I2} $ is a solid at room temperature while $ \\ce{F2} $ is a gas. What is the real reason?",
      options: [
        "Iodine forms hydrogen bonds between its molecules, which fluorine cannot",
        "Iodine is far more electronegative than fluorine, so its molecules attract more strongly",
        "Iodine has many more electrons than fluorine, so its larger, softer electron cloud gives much stronger London forces — strong enough to hold the molecules as a solid",
        "Iodine molecules are polar while fluorine molecules are non-polar"
      ],
      correct_index: 2,
      reveal: "Both are non-polar, so the only force either has is London dispersion — that rules out hydrogen bonds and dipole effects. The deciding factor is electron count: iodine's cloud is huge and easily distorted (high polarisability), so its instantaneous dipoles are large and its London forces are strong enough to lock the molecules into a solid. Fluorine's tiny cloud barely holds on, so it stays a gas. (And note — fluorine is the *more* electronegative one, so that option is a trap, not the answer.)" },

    // 8 — worked example: rank by boiling point
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Ranking by Boiling Point',
      problem: "Arrange these four substances in **increasing** order of boiling point, and give the reason for each step: argon ($ \\text{Ar} $), hydrogen chloride ($ \\ce{HCl} $), water ($ \\ce{H2O} $), and chlorine ($ \\ce{Cl2} $).",
      solution: "Identify the strongest intermolecular force each one has — that's what sets the boiling point.\n\n" +
        "**Argon (Ar):** a single non-polar atom. Only **London forces**, and a small electron cloud at that. Weakest grip → **lowest** boiling point.\n\n" +
        "**Chlorine ($ \\ce{Cl2} $):** non-polar, so again only London forces — but $ \\ce{Cl2} $ has many more electrons than one argon atom, so its London forces are stronger. Boils higher than argon.\n\n" +
        "**Hydrogen chloride ($ \\ce{HCl} $):** a **polar** molecule, so it has **dipole–dipole** forces *on top of* its London forces. That permanent pull beats $ \\ce{Cl2} $'s London-only attraction.\n\n" +
        "**Water ($ \\ce{H2O} $):** has $ \\ce{H} $ bonded to $ \\ce{O} $, so it forms strong **hydrogen bonds** — the muscular form of dipole–dipole. Strongest grip → **highest** boiling point.\n\n" +
        "**Answer:** $ \\text{Ar} < \\ce{Cl2} < \\ce{HCl} < \\ce{H2O} $.\n\n" +
        "The thinking is the whole job here — once you name each molecule's strongest force, the order writes itself." },

    // 9 — table: force type → present in → relative strength → example
    { id: uuidv4(), order: n(), type: 'table', caption: 'The intermolecular-force family at a glance',
      headers: ['Force', 'Present in', 'Relative strength', 'Example'],
      rows: [
        ['Ion–dipole', 'An ion next to a polar molecule', 'Strongest of the family', 'Na⁺ / Cl⁻ surrounded by water'],
        ['Hydrogen bond', 'H bonded to N, O or F (special dipole–dipole)', 'Very strong (for this family)', 'H₂O, HF, NH₃'],
        ['Dipole–dipole', 'Between polar molecules', 'Moderate', 'HCl, acetone'],
        ['London dispersion', 'EVERY molecule (only force in non-polar / noble gases)', 'Weakest, but grows with size & electrons', 'He, Ar, Cl₂, I₂'],
      ] },

    // 10 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Three Things to Carry Forward',
      markdown: "**1. London dispersion forces are in everything** — and they are the *only* force holding non-polar substances and noble gases together. They get stronger as a molecule gets bigger / has more electrons (higher polarisability) and as it has more surface contact.\n\n" +
        "**2. Ion–dipole is the strongest** member of the family; **hydrogen bonding** is the strong special case of dipole–dipole (H on N, O or F).\n\n" +
        "**3. These weak forces decide the visible behaviour** — state of matter, melting/boiling points, solubility — even though they are a tenth or less of a real chemical bond." },

    // 11 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Boiling-point ordering is a recurring question — and the trick is always to name each molecule's *strongest* intermolecular force first.** Climb the ladder: London only (non-polar) < dipole–dipole (polar) < hydrogen bond (H–N/O/F) < ion–dipole. Then break ties *within* a level by size/electron count.\n\n" +
        "**Down a group of similar molecules** (noble gases, halogens, $ \\ce{HCl}\\!\\to\\!\\ce{HI} $), boiling point rises because the molecules get bigger and London forces grow — *don't* reach for electronegativity here; it's the **electron count** that's doing the work.\n\n" +
        "**Branched vs straight chain:** the straight chain boils higher (more surface contact). The classic trap option flips this — pick the **straight** isomer for the higher boiling point.\n\n" +
        "**Watch out:** a common mistake is calling fluorine's higher reactivity or electronegativity the reason $ \\ce{I2} $ is a solid. It is not — for non-polar molecules only *London forces* (size / polarisability) set the state of matter." },

    // 12 — inline_quiz (§3.6.1) — LAST interactive block
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'Which intermolecular force is present in every single molecular substance, including the noble gases?',
          options: [
            'Hydrogen bonding',
            'Ion–dipole attraction',
            'London dispersion forces',
            'Dipole–dipole attraction'
          ],
          correct_index: 2,
          explanation: 'London dispersion forces arise from the constant motion of electrons, which produces fleeting instantaneous dipoles in any atom or molecule — so they exist everywhere. Hydrogen bonding needs H on N/O/F, dipole–dipole needs a permanent dipole, and ion–dipole needs an ion present; none of those are universal.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'The boiling points of the noble gases increase in the order He < Ne < Ar < Kr < Xe. What best explains this trend?',
          options: [
            'Larger atoms have more electrons and a more easily distorted cloud, giving stronger London forces',
            'Larger atoms are more electronegative, so they attract each other more',
            'Larger atoms form weak hydrogen bonds with one another',
            'Larger atoms become polar, adding dipole–dipole attraction'
          ],
          correct_index: 0,
          explanation: 'Going down the group, each atom has more electrons and a bigger, softer (more polarisable) cloud, so its instantaneous dipoles are larger and its London forces stronger — raising the boiling point. Noble gases are non-polar and form no hydrogen bonds, and electronegativity does not drive this trend.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Pentane (a straight chain) and neopentane (a compact, branched isomer) have the same formula C₅H₁₂, yet pentane boils higher. Why?',
          options: [
            'Pentane is a polar molecule while neopentane is non-polar',
            'The straight chain has more surface contact with its neighbours, giving stronger London forces',
            'Pentane forms hydrogen bonds that neopentane cannot',
            'Neopentane has more electrons, so it boils lower'
          ],
          correct_index: 1,
          explanation: 'Both isomers have identical formula and electron count, so the difference is shape. The long straight chain lies flat against its neighbours with lots of surface contact, strengthening its London forces; the compact branched ball touches less and so boils lower. There are no polar groups or hydrogen bonds in either.' },
      ] },

    // 13 — chapter-closing wrap (per task: AFTER the quiz; closes the chapter)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*And that closes the chapter. You started by asking **why atoms bond at all** — the chase for a stable, full outer shell — and walked through every kind of strong bond that builds a molecule: ionic, covalent, the shapes they take, and the orbital pictures behind them. This final page added the last, faintest layer: the **weak forces between finished molecules** that quietly decide whether a substance is a gas you breathe, a liquid you pour, or a solid you hold. From the strongest bond inside a molecule to the gentlest pull between them, you now have the full bonding toolkit.*" },
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
    slug: NEW_SLUG, title: 'Van der Waals Forces — The Weak Bonds That Decide Everything',
    subtitle: 'The weak forces between finished molecules — ion–dipole, dipole–dipole and London dispersion — that decide states of matter, boiling points and solubility.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'intermolecular-forces', 'van-der-waals', 'london-dispersion'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  // Wire into chapter 4 page_ids (append at the end — this is the final page).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 21 (van der Waals & intermolecular forces, chapter close)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
