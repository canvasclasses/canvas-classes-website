'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 17.
 * "Molecular Orbital Theory — Electrons Belong to the Whole Molecule"
 * The IDEA of MOT: why we need it (VBT fails for O2 paramagnetism + theory-deficient
 * molecules), LCAO, bonding vs antibonding MOs, sigma & pi (and their starred forms),
 * conditions for AOs to combine. The APPLICATION (bond order, magnetism, the real
 * diatomics, the MO energy-level diagram + ordering) is the NEXT page.
 *
 * Grounded in Mittal §20.1 (MOT intro / LCAO / bonding-nonbonding-antibonding) + start
 * of §20.2, NCERT Class 11 Ch.4, and standard JEE treatment. Re-expressed in our voice,
 * not copied.
 *
 * Voice: BOND-exemplars.md (orbital = "the room where the electron lives"; AO vs MO
 * ownership; bonding MO = wall/shield with a smiley; antibonding = open street-fight;
 * EOS mnemonic; He2 "content atom") + teacher-voice-profile.md.
 *
 * published:false — founder reviews + generates the 2 pending images, then publishes.
 * Idempotent: skips if the slug already exists; appends page_id to ch4 (no shifting).
 * Run: node scripts/insert_bond_p17_mot.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 17;
const NEW_SLUG = 'molecular-orbital-theory';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'Two atomic orbitals merging into a single glowing cloud that spreads across both nuclei',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). Two separate atoms on the left and right, each with a faint spherical atomic-orbital cloud, merging in the centre into ONE continuous luminous electron cloud that stretches over BOTH nuclei — the visual idea that the electron now belongs to the whole molecule, not one atom. Show a bright build-up of electron density in the region directly between the two nuclei. Cool blue clouds with a warm orange glow concentrated between the nuclei. Clean scientific illustration style. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 1 — fun_fact hook (liquid oxygen on a magnet — VBT can't explain it)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Oxygen Sticks to a Magnet',
      markdown: "Pour **liquid oxygen** between the poles of a strong magnet and it does something water never would — it **clings there**, suspended, refusing to fall. That stickiness means $\\ce{O2}$ has **unpaired electrons** (it is *paramagnetic*). But the picture you have been drawing all chapter — oxygen with a tidy $\\ce{O=O}$ double bond and every electron neatly paired — predicts the exact opposite: that $\\ce{O2}$ should be diamagnetic and ignore the magnet. The double-bond picture is simply **wrong about $\\ce{O2}$**. To explain why liquid oxygen sticks, we need a deeper model of bonding." },

    // 2 — core concept text: why MOT, electrons belong to the molecule
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Everything so far in this chapter has used **Valence Bond Theory (VBT)** — a bond is a pair of electrons *shared between two specific atoms*, sitting in the overlap of their orbitals. VBT works beautifully for most molecules. But it has blind spots:\n\n" +
      "- It says $\\ce{O2}$ is diamagnetic. **Experiment says paramagnetic.** VBT is flatly wrong here.\n" +
      "- Some species don't even have enough electrons to draw a sensible Lewis structure, yet they exist and are stable — the so-called **electron-deficient** molecules. They aren't really short of electrons; the *theory* was just too weak to describe them. (Mittal calls these **\"theory-deficient molecules\"** — the molecule is fine, the theory is the problem.)\n\n" +
      "So we bring in a better model: **Molecular Orbital Theory (MOT).** Its one big shift in thinking is this. An **orbital is just the room where an electron lives.** In an atom, every electron is *claimed* — \"this is **my** electron, that one is **yours**.\" MOT throws that ownership away. When atoms join into a molecule, the electron is no longer the property of one atom — **it belongs to the whole molecule**, free to spread over all the nuclei. The rooms it lives in are now **molecular orbitals (MOs)**, not atomic orbitals (AOs)." },

    // 3 — heading: LCAO
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'LCAO — How Molecular Orbitals Are Built',
      objective: 'See how combining two atomic orbitals always produces two molecular orbitals — one helpful, one harmful.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "We don't build molecular orbitals from scratch. We **combine the atomic orbitals we already have** — a method called the **Linear Combination of Atomic Orbitals (LCAO)**.\n\n" +
      "The bookkeeping rule never changes: **orbitals are never lost.** If you combine **two** atomic orbitals, you must get **two** molecular orbitals back. You make one by *adding* the two AO waves, and the other by *subtracting* them:\n\n" +
      "- **Add the waves (constructive overlap)** → a **bonding MO**. The two waves reinforce, piling up electron density **right between the two nuclei**. This MO is **lower in energy** than the original AOs.\n" +
      "- **Subtract the waves (destructive overlap)** → an **antibonding MO**, marked with a star, e.g. $\\sigma^*$. The waves cancel between the nuclei, leaving a **node** (a plane of zero electron density) there. This MO is **higher in energy** than the original AOs.\n\n" +
      "So every pair of AOs gives a matched set: one bonding MO sitting *below* and one antibonding MO sitting *above* the atomic-orbital level." },

    // 4 — image: two AOs combining -> bonding MO (density between) + antibonding MO (node)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Two 1s atomic orbitals combining into a bonding MO with density between the nuclei and an antibonding MO with a node',
      caption: '📸 Add the waves and density builds between the nuclei (bonding); subtract them and a node appears (antibonding)',
      generation_prompt: 'Side-by-side comparison diagram. Centre-left: two identical spherical s atomic orbitals on two nuclei undergoing CONSTRUCTIVE (in-phase) overlap, merging into a single sigma BONDING molecular orbital with a bright concentration of electron density in the region BETWEEN the two nuclei — both nuclei shown as small dots inside the shared cloud. Centre-right: the same two s orbitals undergoing DESTRUCTIVE (out-of-phase) overlap, forming a sigma-star ANTIBONDING molecular orbital with a clear NODE (a flat plane of zero electron density, drawn as a dashed line) exactly between the two nuclei and the electron density pushed OUTSIDE, beyond each nucleus. Label the left result "bonding MO (lower energy)" and the right "antibonding MO* (node, higher energy)". Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 5 — heading: bonding vs antibonding (the wall/shield vs street-fight voice)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Bonding Holds and Antibonding Pushes Apart',
      objective: 'Understand from the electron density alone why one MO stabilises the molecule and the other tears it apart.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Two nuclei are both **positive** — left to themselves they repel and fly apart. The whole job of a bond is to stop that. Look at where the electrons sit in each MO and you can *see* whether the bond survives.\n\n" +
      "**Bonding MO — the wall between them.** The electron density piles up squarely *between* the two nuclei. That negative cloud sits like a **wall, a shield**, holding the two positive nuclei to it from both sides and keeping them from repelling each other. The molecule is stable — so stable that the founder, when he draws this MO on the board, puts a little **smiley face** on it. It is the happy orbital.\n\n" +
      "**Antibonding MO — the street-fight.** Here the node means there is **almost no electron density between the nuclei** — the electrons have been pushed out to the far sides. Now picture an open street-fight: the two positive nuclei are shoving at each other and **nobody is standing in the middle to stop them**. Repulsion runs unchecked. Putting electrons into an antibonding MO doesn't help the bond — it actively works to **break** the molecule apart.\n\n" +
      "There is a subtle but important fact here: the antibonding MO is destabilised *more* than the bonding MO is stabilised. That is exactly why **$\\ce{He2}$ does not exist** — its two electrons fill the bonding MO, but its other two fill the antibonding MO, and the antibonding push wins. The helium atoms were already content alone; forcing them together only raised the energy, so they refuse to bond." },

    // 6 — reasoning_prompt (mid-page): which MO is lower in energy, and why
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Two hydrogen 1s orbitals combine to give a bonding MO and an antibonding MO. The single electron pair of $\\ce{H2}$ goes into the lower-energy one. Which MO is lower in energy, and what is it about that MO that makes it lower?",
      options: [
        "The antibonding MO is lower, because pushing electron density to the outside of the molecule spreads it over more space",
        "The bonding MO is lower, because its electron density sits between the two nuclei, where the electrons are attracted to both positive nuclei at once",
        "Both MOs have exactly the same energy, since they were built from identical 1s orbitals",
        "The bonding MO is lower only because it was drawn at the bottom of the diagram by convention"
      ],
      correct_index: 1,
      reveal: "The bonding MO is the lower-energy one. Its electron density is concentrated *between* the nuclei, so those electrons are pulled on by BOTH positive nuclei simultaneously — and being attracted by two nuclei is a more stable, lower-energy situation than being near just one. That extra attraction is the bond. The antibonding MO is higher because its node leaves the electrons stranded on the outside, attracted to only one nucleus while the two nuclei repel freely. (The diagram puts the bonding MO at the bottom *because* it is lower — the convention follows the physics, not the other way round.)" },

    // 7 — heading: sigma and pi from s-s and p-p overlap
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Sigma and Pi — Naming MOs by How the Orbitals Met',
      objective: 'Tell a sigma MO from a pi MO by the way the parent orbitals overlapped — head-on or sideways.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "We name a molecular orbital by the **shape of the overlap** that made it.\n\n" +
      "**Sigma ($\\sigma$) MOs — head-on overlap.** When orbitals meet **end-to-end along the line joining the nuclei**, the resulting MO is cylindrically symmetric about that axis — spin it around the bond axis and it looks the same. This is **$\\sigma$ symmetry**. You get it from:\n" +
      "- two **s** orbitals overlapping ($s$–$s$), and\n" +
      "- two **p** orbitals pointing **head-on** at each other along the axis ($p$–$p$ end-on).\n\n" +
      "Each of these gives a bonding $\\sigma$ and an antibonding $\\sigma^*$.\n\n" +
      "**Pi ($\\pi$) MOs — sideways overlap.** The two p orbitals that *don't* point along the axis can only overlap **side-by-side**, lobe-above-lobe and lobe-below-lobe. The MO that forms is **not** symmetric about the bond axis — it has a nodal plane containing the axis. This is **$\\pi$ symmetry**, giving a bonding $\\pi$ and an antibonding $\\pi^*$. Because there are *two* such perpendicular p pairs, $\\pi$ MOs come as **degenerate pairs** (two at the same energy).\n\n" +
      "Head-on overlap is more effective than sideways overlap, so a $\\sigma$ bonding MO is generally **lower** in energy than a $\\pi$ bonding MO from the same shell — a fact we will lean on heavily when we draw the energy-level diagram on the next page." },

    // 8 — heading: the EOS conditions for LCAO
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'When CAN Two Orbitals Combine? — The EOS Conditions',
      objective: 'Apply the three EOS tests to decide whether any given pair of atomic orbitals can form a molecular orbital at all.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Not every pair of atomic orbitals is *allowed* to combine. Three conditions must all be met — remember them as **EOS**:\n\n" +
      "- **E — comparable Energy.** The two AOs must have **similar energies**. A very-low-energy orbital and a very-high-energy one barely mix. In practice this means **same-shell** orbitals combine: a 2s with a 2s, a 2p with a 2p — but *not*, say, a 3p with a 4s.\n" +
      "- **O — effective Overlap.** The orbitals must actually **overlap to a meaningful extent** — the atoms have to be close enough and the orbitals big enough for their clouds to meet. No overlap, no MO.\n" +
      "- **S — proper Symmetry.** The orbitals must overlap with the **right orientation**, in phase, along a sensible direction. If the positive lobe of one orbital overlaps *equally* with a positive and a negative lobe of the other, the overlap **cancels to zero** — no bonding or antibonding MO results at all (this is the third, neither-helpful-nor-harmful case).\n\n" +
      "Fail any one of E, O, or S and the two orbitals simply do not form a molecular orbital. Pass all three and you get your matched bonding/antibonding pair." },

    // 9 — worked_example: which pairs can combine by EOS
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Can These Orbitals Combine?',
      problem: "Using the EOS conditions, decide whether each pair of atomic orbitals can combine to form molecular orbitals, and if so what type ($\\sigma$ or $\\pi$). Take the **z-axis** as the internuclear (bond) axis.\n\n(a) $2s$ on atom A with $2s$ on atom B.\n\n(b) $2p_z$ on atom A with $2p_z$ on atom B.\n\n(c) $2p_x$ on atom A with $2p_x$ on atom B.\n\n(d) $2p_z$ on atom A with $2p_x$ on atom B.",
      solution: "Run each pair through **E** (comparable energy), **O** (effective overlap), **S** (proper symmetry).\n\n" +
        "**(a) $2s$ + $2s$** — same shell, so **E** is fine; they overlap head-on along the axis, so **O** and **S** are fine. They combine into a $\\sigma_{2s}$ (bonding) and a $\\sigma_{2s}^*$ (antibonding). **Allowed — $\\sigma$ type.**\n\n" +
        "**(b) $2p_z$ + $2p_z$** — both point **along** the z-axis (head-on). Same shell (**E** ok), good end-on overlap (**O** ok), correct symmetry (**S** ok). They form a $\\sigma_{2p}$ and a $\\sigma_{2p}^*$. **Allowed — $\\sigma$ type (head-on).**\n\n" +
        "**(c) $2p_x$ + $2p_x$** — both are perpendicular to the axis, so they overlap **side-by-side**. Same shell (**E** ok), sideways overlap (**O** ok), symmetry ok (**S**). They form a $\\pi_{2p}$ and a $\\pi_{2p}^*$. **Allowed — $\\pi$ type (sideways).**\n\n" +
        "**(d) $2p_z$ + $2p_x$** — one points **along** the axis, the other **across** it. The $p_z$ lobe overlaps **equally** with the positive and negative lobes of $p_x$, so the net overlap **cancels to zero** — this fails the **S** (symmetry) test. **Not allowed — no MO forms (zero overlap).**" },

    // 10 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Core of MOT in Three Lines',
      markdown: "**1. Electrons belong to the whole molecule, not to one atom** — that is the entire idea of MOT.\n\n" +
        "**2. LCAO:** two AOs → two MOs. A **bonding MO** (density *between* the nuclei → stable, lower energy) and an **antibonding MO\\*** (a *node* between the nuclei → destabilising, higher energy). Head-on overlap → $\\sigma$ / $\\sigma^*$; sideways overlap → $\\pi$ / $\\pi^*$.\n\n" +
        "**3. Orbitals only combine if they pass EOS** — comparable **E**nergy, effective **O**verlap, proper **S**ymmetry." },

    // 11 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Bonding vs antibonding is a guaranteed source of questions** — know it cold before the diagram even appears.\n\n" +
        "**Nodal-plane count (memorise this row — direct question bank):** $\\sigma$ bonding has **0** nodal planes, $\\sigma^*$ has **1**, $\\pi$ bonding has **1**, $\\pi^*$ has **2**. Examiners ask \"how many nodal planes in the $\\pi^*$ MO?\" verbatim.\n\n" +
        "**EOS is itself testable:** the classic trap gives a $p_z$ + $p_x$ pair (or a 3p + 4s pair) and asks if they bond — the answer is **no** (symmetry fails, or energy mismatch). \"Same-shell only\" disposes of the energy version instantly.\n\n" +
        "**Conceptual one-liner they love:** *more electrons in bonding MOs than in antibonding MOs ⇒ a bond exists.* If antibonding equals bonding (as in $\\ce{He2}$), the molecule falls apart. The actual counting — **bond order** — is the next page." },

    // 12 — inline_quiz (§3.6.1) — LAST content-test block
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'What is the central idea that sets Molecular Orbital Theory apart from Valence Bond Theory?',
          options: [
            'Each bonding electron stays the private property of one of the two bonded atoms',
            'Electrons in a molecule belong to the molecule as a whole and can spread over all its nuclei',
            'Only the inner-shell electrons take part in forming the bond',
            'Atomic orbitals disappear once a molecule forms and are replaced by brand-new orbitals'
          ],
          correct_index: 1,
          explanation: 'MOT drops the VBT idea of "my electron / your electron": once a molecule forms, an electron belongs to the whole molecule and lives in a molecular orbital spread over the nuclei. The atomic orbitals are not destroyed — they are *combined* (LCAO), and the number of orbitals is conserved, so the AOs are accounted for, not lost.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'A bonding molecular orbital is lower in energy and stabilises a molecule. What feature of its electron density is directly responsible for this?',
          options: [
            'A node lying exactly between the two nuclei',
            'Electron density built up between the two nuclei, attracting both positive nuclei toward it',
            'Electron density pushed to the far outside, beyond each nucleus',
            'An equal amount of constructive and destructive overlap, which cancels out'
          ],
          correct_index: 1,
          explanation: 'Constructive overlap piles electron density *between* the nuclei, where it is pulled on by both positive nuclei at once — acting like a wall that holds them together, which lowers the energy. A node between the nuclei (option A) and density pushed outside (option C) are the *antibonding* situation, which raises energy; equal constructive-and-destructive overlap (option D) gives zero net overlap and no MO at all.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Taking the z-axis as the internuclear axis, which pair of atomic orbitals will FAIL to form a molecular orbital because it breaks an EOS condition?',
          options: [
            'A $2s$ orbital combining with another $2s$ orbital',
            'A $2p_z$ orbital combining with another $2p_z$ orbital head-on',
            'A $2p_z$ orbital combining with a $2p_x$ orbital on the other atom',
            'A $2p_x$ orbital combining with another $2p_x$ orbital sideways'
          ],
          correct_index: 2,
          explanation: 'A $p_z$ (along the axis) and a $p_x$ (across the axis) overlap so that the $p_z$ lobe meets the positive and negative lobes of $p_x$ equally — the net overlap cancels to zero, failing the Symmetry condition, so no MO forms. The other three are all valid: $2s$+$2s$ and $2p_z$+$2p_z$ give $\\sigma$ MOs (head-on), and $2p_x$+$2p_x$ gives a $\\pi$ MO (sideways).' },
      ] },

    // 13 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You now have the framework — molecular orbitals built by LCAO, the bonding/antibonding split, $\\sigma$ and $\\pi$, and the EOS rules for which orbitals may combine. Next, we **fill** these orbitals (Aufbau, Pauli, Hund) on the real MO energy-level diagram — and out of it drop the two answers VBT could never give: the **bond order** of a molecule, and why **liquid oxygen sticks to a magnet.***" },
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
    slug: NEW_SLUG, title: 'Molecular Orbital Theory — Electrons Belong to the Whole Molecule',
    subtitle: 'Why VBT fails for O₂, and how LCAO builds bonding & antibonding molecular orbitals.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'molecular-orbital-theory', 'mot', 'lcao'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  // Wire into chapter 4 page_ids (append; no shifting of existing pages).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 17 (molecular orbital theory: the idea, LCAO, bonding/antibonding)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
