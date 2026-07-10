'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 7.
 * "Fajans' Rules — When Ionic Turns Covalent" (polarisation, covalent character in ionic bonds).
 * Inserts at page_number 7 and appends to ch4 page_ids. published:false — founder reviews +
 * generates the 2 pending images, then publishes.
 * Voice: BOND-exemplars.md (§A four-friends/influencer, black hole, anion "bhai sahab",
 *   §4 "anion is common — compare the cations", §22 AgCl pseudo-noble-gas, §C7 KCl/NaCl m.p. trap)
 *   + teacher-voice-profile.md (written-register translation rules).
 * Grounded in NCERT Class 11 Ch.4 + standard JEE treatment of Fajans' rules / polarisation.
 * Run: node scripts/insert_bond_p7_fajans.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 7;
const NEW_SLUG = 'fajans-rules-covalent-character';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A small dense cation pulling and stretching the round electron cloud of a large anion, the sphere distorting toward the cation',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). On the right, a large soft spherical electron cloud (an anion) shown as a glowing translucent sphere. On the left, a tiny intensely bright dense positive point (a small cation) pulling the anion\'s cloud toward it, so the sphere stretches and distorts into a teardrop / egg shape, with electron density visibly piling up in the gap between the two — the visual of an ionic bond gaining covalent character. A spectrum from "perfectly round = ionic" on the right to "stretched/shared = covalent" near the centre. Clean scientific illustration style. Dark background (#0a0a0a or near-black), orange accent glow on the cation and labels. No text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The "Salt" That Dissolves in Petrol',
      markdown: "We write aluminium chloride as $\\ce{AlCl3}$ — looks like a salt, a metal joined to a non-metal. Yet it does almost nothing a salt should. It **sublimes** (turns straight to vapour) at a gentle temperature, it travels as covalent $\\ce{Al2Cl6}$ molecules, and it happily dissolves in **organic solvents like benzene** and other oily, non-polar liquids while ordinary table salt won't touch them. An \"ionic\" compound behaving like a covalent one — how? That gap between the formula and the behaviour is exactly what Fajans' rules explain." },

    // 2 — core concept text (the continuum + polarisation)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the truth that the neat \"ionic vs covalent\" boxes hide: **no bond is 100% ionic, and none is 100% covalent.** Every bond sits somewhere on a continuum between the two. Even \"pure\" $\\ce{NaCl}$ carries a little covalent character; even a covalent bond between two different atoms carries a little ionic character.\n\n" +
      "So why does an \"ionic\" bond pick up covalent character? Because of **polarisation**. When a cation and an anion sit next to each other, the cation's positive charge **pulls on the anion's electron cloud** and drags some of that electron density into the space between the two nuclei. The anion's cloud, which was a neat round sphere, gets **distorted** — squeezed toward the cation. And electron density shared *in between two nuclei* is exactly what a covalent bond is.\n\n" +
      "**The more the cation distorts the anion, the more covalent character the bond gains.** That single sentence is the whole of Fajans' rules. Everything below is just *which* cations distort hardest and *which* anions distort easiest." },

    // 3 — heading: polarising power vs polarisability
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Polarising Power vs Polarisability',
      objective: 'Tell apart the cation\'s power to distort and the anion\'s ease of being distorted — the two halves of polarisation.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Two different jobs are going on, and you must keep them apart:\n\n" +
      "- **Polarising power** belongs to the **cation**. It is *how strongly the cation pulls* on the other atom's electrons.\n" +
      "- **Polarisability** belongs to the **anion**. It is *how easily the anion's cloud gets pulled* out of shape.\n\n" +
      "Picture a group of four friends. One of them is the **influencer** — when he says something, the other three go along with it. The cation is that influencer: it has the **polarising power**. The anion is the easily-swayed friend whose cloud bends to whatever the cation wants — it is **polarisable**.\n\n" +
      "What makes a cation a strong influencer? A **small size with a high positive charge** — its charge is packed into a tiny volume, so its pull at close range is fierce. A small, dense, highly-charged cation acts almost **like a black hole**: tiny, but with a pulling field so concentrated that nearby electron clouds can't keep their shape.\n\n" +
      "And the anion was perfectly content as a round, symmetric cloud — until this cation, the *bhai sahab*, arrives and starts dragging the anion's electron density toward himself. That distortion **is** the covalent character." },

    // 4 — image: before/after polarisation of an anion
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Two panels: a round undistorted ion pair on the left, and a stretched, distorted anion cloud with shared density in between on the right',
      caption: '📸 Left: ideal ionic, round anion. Right: the cation polarises the anion — density piles up between the nuclei (covalent character).',
      generation_prompt: 'Two-panel chemical bonding diagram, side by side. LEFT PANEL labelled "Ideal ionic": a small positive cation as a tiny sphere next to a large anion drawn as a perfectly round, symmetric electron cloud — no overlap, two clean separate ions. RIGHT PANEL labelled "Polarised (covalent character)": the same small cation, but now the large anion\'s electron cloud is visibly stretched and distorted toward the cation, with electron density piling up in the region BETWEEN the two nuclei (shown as a brighter bridge of density). Arrows show the cation pulling the cloud. Make the contrast between "round" and "stretched" obvious. Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 5 — heading: the five Fajans rules
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: "Fajans' Five Rules — When Covalent Character Goes Up",
      objective: 'Use the five size/charge/configuration rules to rank how covalent an ionic bond is.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Covalent character in an \"ionic\" bond **increases** when:\n\n" +
      "1. **The cation is small.** A small cation has its charge crammed into a tiny space, so its pull (polarising power) is high. $\\ce{Li+}$ distorts more than $\\ce{Na+}$, which distorts more than $\\ce{K+}$.\n" +
      "2. **The cation's charge is high.** More positive charge means a harder pull. $\\ce{Al^3+}$ pulls far harder than $\\ce{Mg^2+}$, which pulls harder than $\\ce{Na+}$.\n" +
      "3. **The anion is large.** A big anion holds its outer electrons loosely, far from its nucleus, so they are easy to drag away — it is highly polarisable. $\\ce{I-}$ is distorted more easily than $\\ce{Br-}$, then $\\ce{Cl-}$, then $\\ce{F-}$.\n" +
      "4. **The anion's charge is high.** A higher negative charge means a bigger, looser, more easily-distorted cloud. $\\ce{N^3-}$ is more polarisable than $\\ce{O^2-}$, which beats $\\ce{F-}$.\n" +
      "5. **The cation has a pseudo-noble-gas (18-electron) configuration.** This is the subtle one. A cation like $\\ce{Ag+}$, $\\ce{Cu+}$ or $\\ce{Zn^2+}$ ends in an $18$-electron outer shell instead of a noble-gas $8$. Those $d$-electrons shield the nucleus poorly, so the cation's *effective* pull is stronger than a noble-gas-type cation of the **same size and charge**. That is why $\\ce{Ag+}$ polarises far more than $\\ce{Na+}$, even though the two are almost the same size.\n\n" +
      "Rules 1 and 2 describe the cation's **polarising power**; rules 3 and 4 describe the anion's **polarisability**; rule 5 is the hidden boost that catches students out." },

    // 6 — reasoning_prompt (mid-page: compare cations, anion is common)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Among $\\ce{NaCl}$, $\\ce{MgCl2}$ and $\\ce{AlCl3}$, which has the MOST covalent character? Notice what every option has in common before you compare.",
      options: [
        "$\\ce{NaCl}$, because sodium is the most reactive metal of the three",
        "$\\ce{MgCl2}$, because it sits in the middle of the charge range",
        "$\\ce{AlCl3}$, because $\\ce{Al^3+}$ is the smallest cation with the highest charge, so it polarises the chloride most",
        "All three are equally covalent because they all contain the chloride ion"
      ],
      correct_index: 2,
      reveal: "The move to make every time: **the anion ($\\ce{Cl-}$) is common to all three — so stop comparing what is the same, and compare the cations.** Going $\\ce{Na+} \\to \\ce{Mg^2+} \\to \\ce{Al^3+}$, the charge climbs ($+1 \\to +2 \\to +3$) and the size shrinks. Both changes pump up polarising power. So covalent character rises $\\ce{NaCl} < \\ce{MgCl2} < \\ce{AlCl3}$, and $\\ce{AlCl3}$ wins — which is exactly why it behaves like a covalent molecule." },

    // 7 — heading: consequences
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'What More Covalent Character Does',
      objective: 'Predict the physical clues — melting point, solubility, colour — that reveal a more covalent "ionic" compound.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Once you know a compound has high covalent character, you can predict how it behaves:\n\n" +
      "- **Lower melting and boiling points.** Covalent character means discrete molecules with weaker forces between them, so less heat is needed to melt them than a truly ionic lattice would need.\n" +
      "- **Less soluble in water, more soluble in non-polar solvents.** Polar water loves genuine ions; a more covalent compound prefers oily, non-polar liquids ($\\ce{AlCl3}$ in benzene or $\\ce{CCl4}$).\n" +
      "- **Often coloured.** Strong polarisation distorts the electron cloud enough to absorb visible light — one reason $\\ce{AgI}$ (yellow) is coloured while $\\ce{NaCl}$ is white.\n" +
      "- **More directional.** A genuine ionic bond pulls equally in all directions; covalent character introduces direction, the start of a real molecular shape." },

    // 8 — worked example 1: covalent-character ordering (size/charge)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Ordering Covalent Character',
      problem: "Arrange $\\ce{LiCl}$, $\\ce{NaCl}$ and $\\ce{KCl}$ in increasing order of **covalent character**.",
      solution: "The anion is the same chloride in all three, so compare only the cations.\n\n" +
        "All three cations carry the same $+1$ charge — so charge can't decide it. Look at **size** instead.\n\n" +
        "Cation size grows down the group: $\\ce{Li+} < \\ce{Na+} < \\ce{K+}$.\n\n" +
        "Smaller cation $\\Rightarrow$ higher polarising power $\\Rightarrow$ more covalent character. So the smallest, $\\ce{Li+}$, polarises chloride the most.\n\n" +
        "**Increasing covalent character:** $\\ce{KCl} < \\ce{NaCl} < \\ce{LiCl}$.\n\n" +
        "(So $\\ce{LiCl}$ is the most covalent of the three — and indeed it is the one most soluble in organic solvents.)" },

    // 9 — worked example 2: AgCl vs NaCl pseudo-noble-gas (exemplar #22)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — The $\\ce{AgCl}$ Surprise',
      problem: "$\\ce{Na+}$ and $\\ce{Ag+}$ are almost the same size. Yet $\\ce{AgCl}$ is far **less** ionic (more covalent) than $\\ce{NaCl}$. Why?",
      solution: "Same anion ($\\ce{Cl-}$), same cation charge ($+1$), nearly the same cation size — so rules 1 to 4 say the two should be alike. They are not. The deciding factor is **rule 5: the cation's configuration.**\n\n" +
        "$\\ce{Na+}$ ends in a clean noble-gas octet ($2,8$).\n\n" +
        "$\\ce{Ag+}$ ends in an **18-electron (pseudo-noble-gas) shell** — those outer $d$-electrons shield the nucleus poorly.\n\n" +
        "Poor shielding means $\\ce{Ag+}$ pulls with a stronger *effective* charge than $\\ce{Na+}$ of the same size — so it distorts the chloride far more.\n\n" +
        "**Result:** $\\ce{AgCl}$ has much more covalent character (the least ionic of the common chlorides), which is why it is famously **insoluble in water** — a genuinely ionic salt of that size would dissolve.\n\n" +
        "**Watch out:** never decide this one from charge and size alone — they tie. The pseudo-noble-gas configuration is the whole answer." },

    // 10 — table: the 5 rules → effect
    { id: uuidv4(), order: n(), type: 'table', caption: "Fajans' rules — what raises covalent character",
      headers: ['Factor', 'For more covalent character', 'Why', 'Example'],
      rows: [
        ['Cation size', 'smaller', 'charge packed tighter → stronger pull', '$\\ce{Li+} > \\ce{Na+} > \\ce{K+}$'],
        ['Cation charge', 'higher', 'more positive charge → harder pull', '$\\ce{Al^3+} > \\ce{Mg^2+} > \\ce{Na+}$'],
        ['Anion size', 'larger', 'loose outer electrons, easy to distort', '$\\ce{I-} > \\ce{Br-} > \\ce{Cl-} > \\ce{F-}$'],
        ['Anion charge', 'higher', 'bigger, looser cloud', '$\\ce{N^3-} > \\ce{O^2-} > \\ce{F-}$'],
        ['Cation configuration', 'pseudo-noble-gas (18 e⁻)', 'poor shielding → stronger effective pull', '$\\ce{Ag+}, \\ce{Cu+}, \\ce{Zn^2+}$ beat $\\ce{Na+}, \\ce{K+}$'],
      ] },

    // 11 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The One Line to Carry Out',
      markdown: "**Covalent character in an \"ionic\" bond goes up with a small, highly-charged cation + a large, highly-charged anion + a pseudo-noble-gas cation.** In short: a strong-pulling cation meeting an easily-distorted anion. The harder the cation distorts the anion's cloud, the more covalent the bond." },

    // 12 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The single most-tested skill here is ranking covalent character.** Three things to lock in:\n\n" +
        "**The reflex move:** when the question lists compounds that share an anion (or share a cation), *don't compare the part that's common — compare the part that changes.* In $\\ce{FeCl2}$ / $\\ce{SnCl2}$ / $\\ce{AlCl3}$ / $\\ce{MgCl2}$, chloride is common; the highest-charge, smallest cation wins.\n\n" +
        "**$\\ce{AgCl}$ is the classic least-ionic answer** — when size and charge tie, the pseudo-noble-gas cation ($\\ce{Ag+}$, $\\ce{Cu+}$, $\\ce{Zn^2+}$) breaks the tie. Solubility is a good cross-check: a more covalent salt is less water-soluble.\n\n" +
        "**The trap:** do **NOT** use Fajans' rules to compare the **melting points of $\\ce{NaCl}$ and $\\ce{KCl}$.** Melting point is governed by **lattice energy** ($\\propto q_1 q_2 / r^2$), so $\\ce{NaCl}$ (smaller ion, $801\\,°\\text{C}$) melts higher than $\\ce{KCl}$ ($770\\,°\\text{C}$) — see the lattice-energy page. Fajans tells you about *covalent character*, not melting point." },

    // 13 — inline_quiz (LAST content block; §3.6.1)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: "According to Fajans' rules, which combination produces the MOST covalent character?",
          options: [
            'A large, low-charge cation with a small, low-charge anion',
            'A small, high-charge cation with a large, high-charge anion',
            'A large, low-charge cation with a large, high-charge anion',
            'A small, low-charge cation with a small, low-charge anion'
          ],
          correct_index: 1,
          explanation: "Covalent character is highest when the cation pulls hardest (small + high charge = high polarising power) and the anion is easiest to distort (large + high charge = high polarisability). The other combinations weaken one or both halves of the polarisation." },
        { id: uuidv4(), difficulty_level: 2,
          question: "$\\ce{NaCl}$ and $\\ce{AgCl}$ have cations of almost identical size and the same $+1$ charge, yet $\\ce{AgCl}$ is far more covalent. The best explanation is that:",
          options: [
            'Chloride behaves differently in the two compounds',
            'Silver carries a higher positive charge than sodium',
            'Silver is a much larger cation than sodium',
            "$\\ce{Ag+}$ has a pseudo-noble-gas (18-electron) shell whose poor shielding gives it a stronger effective pull than $\\ce{Na+}$"
          ],
          correct_index: 3,
          explanation: "Size and charge are matched, so they cannot be the cause. Rule 5 decides it: $\\ce{Ag+}$'s 18-electron outer shell shields the nucleus poorly, so it polarises chloride more strongly than the noble-gas-type $\\ce{Na+}$ — making $\\ce{AgCl}$ the more covalent (less soluble) of the two." },
        { id: uuidv4(), difficulty_level: 3,
          question: "A student claims $\\ce{KCl}$ must have a higher melting point than $\\ce{NaCl}$ \"because $\\ce{K+}$ is bigger, so $\\ce{KCl}$ is more ionic by Fajans' rules.\" What is wrong with this reasoning?",
          options: [
            "Nothing is wrong; $\\ce{KCl}$ does melt higher than $\\ce{NaCl}$",
            "Melting point is set by lattice energy ($\\propto q_1q_2/r^2$), not by Fajans' covalent character; the smaller $\\ce{Na+}$ gives $\\ce{NaCl}$ the higher lattice energy and the higher melting point",
            "$\\ce{K+}$ is actually smaller than $\\ce{Na+}$, so the premise is backwards",
            "Fajans' rules apply only to anions, never to cations"
          ],
          correct_index: 1,
          explanation: "Fajans' rules predict *covalent character*, not melting point. Melting point tracks lattice energy, which rises as ionic radius falls — so $\\ce{NaCl}$ ($801\\,°\\text{C}$) melts higher than $\\ce{KCl}$ ($770\\,°\\text{C}$). Using Fajans here is the classic trap." },
      ] },

    // 14 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now read the covalent character hidden inside any \"ionic\" bond. But there's a deeper energy story behind whether an ionic compound even forms and dissolves at all — the tug-of-war between the **lattice energy** holding the crystal together and the **hydration energy** released when water pulls the ions apart. That balance, and what it means for solubility, is the next page.*" },
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
    slug: NEW_SLUG, title: "Fajans' Rules — When Ionic Turns Covalent",
    subtitle: 'No bond is purely ionic — a small, strong cation distorts the anion and gives an "ionic" bond covalent character.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'fajans-rules', 'polarisation', 'covalent-character'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 7 (Fajans rules / covalent character)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
