'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Page 13.
 * "Expanded Octet — sp³d, sp³d² and Beyond" (sp³d / sp³d² / sp³d³ hybridisation,
 * its examples, and its limits — period-2 can't expand, PCl₅ solid is ionic, PH₅/BiCl₅).
 * Grounded in NCERT Class 11 Ch.4 + standard JEE treatment.
 * Voice: BOND-exemplars.md (student push-back "sir, PCl₅ banta hai to PH₅ kyon nahi?",
 * the PCl₅-solid trap, the on-air honesty register) + teacher-voice-profile.md.
 * published:false — founder reviews + generates the pending images, then publishes.
 * Idempotent. Run: node scripts/insert_bond_p13_expanded-octet.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 13;
const NEW_SLUG = 'expanded-octet-hybridisation';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A central atom surrounded by five, six and seven bonded atoms in trigonal-bipyramidal, octahedral and pentagonal-bipyramidal arrangements',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5) showing three glowing ball-and-stick molecular geometries side by side, progressing left to right: a trigonal bipyramid (five outer atoms around one central atom), an octahedron (six outer atoms), and a pentagonal bipyramid (seven outer atoms). Each central atom glows brighter, emphasising it holds more than the usual four bonds. A sense of the octet "rule" being stretched and exceeded. Cool blue-to-warm orange gradient lighting, luminous bonds. Clean scientific 3D illustration style. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Six Bonds On One Atom',
      markdown: "You were taught a firm rule: eight electrons in the outer shell, no more. Then along comes **sulfur hexafluoride**, $\\ce{SF6}$ — one sulfur atom holding **six** fluorine atoms at once, which means **twelve** electrons crowded around it. It is so stable that it is used as an insulating gas in high-voltage equipment. So how does sulfur quietly break the octet rule that boron and nitrogen never can? The answer is a set of empty rooms that only some atoms own — the **d-orbitals**." },

    // 2 — core concept text
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The octet rule says an atom is happiest with eight electrons in its outer shell. For the first two periods that is the ceiling — there is simply nowhere to put a ninth. But from **period 3 onward** (phosphorus, sulfur, chlorine, and below), the outer shell has empty **d-orbitals** sitting right next to the s and p. When a central atom needs to make more than four bonds, it can pull these empty d-orbitals into the mix and **expand its octet** — going to ten, twelve, even fourteen electrons.\n\n" +
      "Mixing d-orbitals in gives **three new hybridisations** beyond the $sp^3$ you already know:\n\n" +
      "- **$sp^3d$** → 5 electron positions → **trigonal bipyramidal**\n" +
      "- **$sp^3d^2$** → 6 electron positions → **octahedral**\n" +
      "- **$sp^3d^3$** → 7 electron positions → **pentagonal bipyramidal**\n\n" +
      "And the counting shortcut you already use does not change: **count the sigma ($\\sigma$) bonds plus the free lone pairs on the central atom.** If that total is 5, 6 or 7, the hybridisation is $sp^3d$, $sp^3d^2$ or $sp^3d^3$." },

    // 3 — heading: sp3d
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'sp³d — The Trigonal Bipyramid (5 positions)',
      objective: 'Recognise an $sp^3d$ centre from its 5 positions and read the shape lone pairs leave behind.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "When the central atom needs **five** positions ($\\sigma$ bonds + free lone pairs = 5), it uses $sp^3d$ hybridisation. The five positions point to the corners of a **trigonal bipyramid**: three in a flat triangle around the middle (**equatorial**) and two straight up and down (**axial**).\n\n" +
      "What you actually *see* depends on how many of those five positions are lone pairs:\n\n" +
      "- **0 lone pairs → $\\ce{PCl5}$** — all five are bonds, a perfect trigonal bipyramid.\n" +
      "- **1 lone pair → $\\ce{SF4}$** — the lone pair takes an equatorial spot (more room there), leaving a **see-saw** shape.\n" +
      "- **2 lone pairs → $\\ce{ClF3}$** — both lone pairs go equatorial, bending the molecule into a **T-shape**.\n" +
      "- **3 lone pairs → $\\ce{I3-}$** (the triiodide ion) — three equatorial lone pairs leave the two bonds axial, giving a **linear** ion.\n\n" +
      "**Lone pairs always take equatorial positions here** — the axial positions are more crowded, so the bulky lone pairs avoid them." },

    // 4 — heading: sp3d2
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'sp³d² — The Octahedron (6 positions)',
      objective: 'Recognise an $sp^3d^2$ centre and predict the shape from how many of its 6 positions are lone pairs.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "When the count reaches **six** ($\\sigma$ bonds + free lone pairs = 6), the atom uses $sp^3d^2$ hybridisation and the six positions point to the corners of a perfectly symmetric **octahedron** — all six equivalent.\n\n" +
      "- **0 lone pairs → $\\ce{SF6}$** — six bonds, a perfect octahedron. (Twelve electrons around sulfur — the molecule from the hook.)\n" +
      "- **1 lone pair → $\\ce{BrF5}$** — five bonds and one lone pair give a **square pyramidal** shape.\n" +
      "- **2 lone pairs → $\\ce{XeF4}$** — the two lone pairs sit opposite each other (top and bottom), leaving the four bonds in a flat **square planar** shape.\n\n" +
      "Because every position in an octahedron is equivalent, the *first* lone pair can go anywhere; the *second* one then sits directly across from it to stay as far away as possible." },

    // 5 — heading: sp3d3
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'sp³d³ — Pentagonal Bipyramid (7 positions)',
      objective: 'Identify the rare $sp^3d^3$ centre and explain why $\\ce{XeF6}$ is distorted.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The highest expansion you meet at this level is **seven** positions ($\\sigma$ bonds + free lone pairs = 7) → $sp^3d^3$ hybridisation → a **pentagonal bipyramid** (five atoms in a ring, plus one above and one below).\n\n" +
      "- **0 lone pairs → $\\ce{IF7}$** — seven bonds, a clean pentagonal bipyramid. The textbook example.\n" +
      "- **1 lone pair → $\\ce{XeF6}$** — six bonds and one lone pair. There is no \"comfortable\" seventh spot for a lone pair in this geometry, so the lone pair never settles — it keeps shifting, and the molecule comes out **distorted octahedral** rather than a tidy shape. Think of it as a lone pair with no fixed seat, drifting from one face to another." },

    // 6 — image: the three expanded geometries
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'The three expanded-octet geometries: trigonal bipyramidal sp3d, octahedral sp3d2, and pentagonal bipyramidal sp3d3, with example molecules labelled',
      caption: '📸 Five, six and seven positions — and the shapes lone pairs carve out of them',
      generation_prompt: 'A clean educational comparison diagram of the three expanded-octet geometries, arranged left to right as labelled ball-and-stick models. Left: trigonal bipyramidal, labelled "sp3d — 5 positions", with the example PCl5; show three equatorial and two axial bonds. Middle: octahedral, labelled "sp3d2 — 6 positions", with the example SF6; show all six bonds at right angles. Right: pentagonal bipyramidal, labelled "sp3d3 — 7 positions", with the example IF7; show five equatorial bonds in a ring plus one axial up and one down. Central atom rendered in a warm colour, terminal atoms cooler. Clear axis/angle hints. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 7 — heading: why period 2 can't expand
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Period 2 Cannot Expand — No d-Orbitals',
      objective: 'Explain in one line why $\\ce{NF5}$ and $\\ce{OF6}$ do not exist while $\\ce{PF5}$ and $\\ce{SF6}$ do.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Expanding the octet needs **empty d-orbitals to put the extra electrons in** — and d-orbitals first become available in the **third shell** (n = 3). So only **period 3 and below** can do it.\n\n" +
      "The second-period elements — **nitrogen, oxygen, fluorine** — have only 2s and 2p orbitals in their outer shell. There is no 2d subshell anywhere in nature. Eight electrons fill 2s and 2p completely, and after that there is **physically nowhere to put a ninth**.\n\n" +
      "That is why **$\\ce{NF5}$ and $\\ce{OF6}$ simply do not exist**, even though their heavier cousins $\\ce{PF5}$ and $\\ce{SF6}$ are perfectly stable. Nitrogen is locked at an octet; phosphorus, one row down, has the empty 3d-orbitals to break past it." },

    // 8 — reasoning_prompt (mid-page)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "Phosphorus forms $\\ce{PF5}$ quite happily, yet nitrogen — which sits directly above phosphorus and also has five valence electrons — cannot form $\\ce{NF5}$. Why?",
      options: [
        "Nitrogen is too electronegative to bond with five fluorine atoms",
        "Nitrogen's outer shell (n = 2) has only s and p orbitals and no d-orbitals, so it cannot hold more than eight electrons; phosphorus (n = 3) has empty 3d-orbitals to expand into",
        "Fluorine refuses to form five bonds to nitrogen because it is a small atom",
        "Nitrogen already has a complete octet in its free state, so it never bonds at all"
      ],
      correct_index: 1,
      reveal: "Expanding past an octet means parking the extra electrons in empty d-orbitals — and d-orbitals only appear from the third shell onward. Nitrogen lives in the second shell (n = 2), which has only 2s and 2p; eight electrons fill those completely and there is no 2d to expand into, so $\\ce{NF5}$ cannot exist. Phosphorus is one row down (n = 3) and owns empty 3d-orbitals, so it expands to $sp^3d$ and forms $\\ce{PF5}$. Electronegativity is not the deciding factor here — the missing d-subshell is." },

    // 9 — heading: the PCl5 solid-state trap
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The PCl₅ Trap — Its Hybridisation Changes Between Gas and Solid',
      objective: 'Know that solid $\\ce{PCl5}$ is ionic, so its hybridisation differs from the gas — a classic exam bait.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is one of the most-set traps in the whole chapter. Ask \"what is the hybridisation of phosphorus in $\\ce{PCl5}$?\" and the reflex answer is $sp^3d$. That is **only right for the gas (or vapour)**, where $\\ce{PCl5}$ exists as separate trigonal-bipyramidal molecules.\n\n" +
      "In the **solid state**, $\\ce{PCl5}$ is **ionic** — it rearranges itself into two different ions packed together:\n\n" +
      "- a **$\\ce{[PCl4]+}$** cation — four bonds, **tetrahedral**, so phosphorus here is **$sp^3$**\n" +
      "- a **$\\ce{[PCl6]-}$** anion — six bonds, **octahedral**, so phosphorus here is **$sp^3d^2$**\n\n" +
      "So the same compound has *three* different phosphorus environments depending on the state: $sp^3d$ in the gas, and both $sp^3$ and $sp^3d^2$ in the solid. The exam move is simple — **before you answer, check whether the question said gas or solid.** $\\ce{PBr5}$ pulls the same trick: in the solid it is $\\ce{[PBr4]+ Br-}$ (the bromide is too big to crowd six around phosphorus), so phosphorus there is just $sp^3$." },

    // 10 — heading: PH5 / BiCl5
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Sir, If PCl₅ Forms, Why Not PH₅?',
      objective: 'Explain why $\\ce{PH5}$ and $\\ce{BiCl5}$ are unstable while $\\ce{PCl5}$ is fine.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A sharp student always asks this: *\"Sir, phosphorus can clearly expand its octet — $\\ce{PCl5}$ exists. So why doesn't $\\ce{PH5}$?\"* Good question, because both would need phosphorus to make five bonds.\n\n" +
      "The catch is that those 3d-orbitals are *empty and large and floppy* — too spread out to overlap well unless something **pulls them in tighter**. **Highly electronegative chlorine** does exactly that: it tugs electron density away from phosphorus, which **contracts the d-orbitals** and makes them compact enough to bond. **Hydrogen is not electronegative enough** to pull that off — it can't shrink the d-orbitals into useful shape — so the fifth bond never becomes stable, and $\\ce{PH5}$ does not exist.\n\n" +
      "**$\\ce{BiCl5}$** fails for a different reason lower down: bismuth suffers the **inert-pair effect** — its outer s-electrons are reluctant to take part — so the +5 state is unstable, and $\\ce{BiCl5}$ is at best very unstable even though chlorine is there to help. The takeaway: expanding the octet needs *both* an atom with d-orbitals *and* electronegative neighbours to make those d-orbitals usable.\n\n" +
      "*One honest footnote:* the \"empty d-orbital\" picture is the standard teaching model and it is the framework JEE expects you to use. Advanced bonding theory actually debates **how much** these d-orbitals really participate — but for this exam, stick with the $sp^3d$ / $sp^3d^2$ / $sp^3d^3$ framework throughout." },

    // 11 — worked example 1
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Hybridisation by the Shortcut',
      problem: "Find the hybridisation of the central atom in each: (a) $\\ce{SF6}$, (b) $\\ce{XeF4}$, (c) $\\ce{IF7}$, (d) $\\ce{ClF3}$.",
      solution: "Use the shortcut: count $\\sigma$ bonds + free lone pairs on the central atom; that total gives the hybridisation (5 → $sp^3d$, 6 → $sp^3d^2$, 7 → $sp^3d^3$).\n\n" +
        "**(a) $\\ce{SF6}$** — sulfur makes 6 bonds, 0 lone pairs.\n\n" +
        "$6 + 0 = 6$ → **$sp^3d^2$** (octahedral).\n\n" +
        "**(b) $\\ce{XeF4}$** — xenon has 8 valence electrons; 4 go into bonds to F, leaving 4 as 2 lone pairs.\n\n" +
        "$4 + 2 = 6$ → **$sp^3d^2$** (square planar shape, octahedral geometry).\n\n" +
        "**(c) $\\ce{IF7}$** — iodine makes 7 bonds, 0 lone pairs.\n\n" +
        "$7 + 0 = 7$ → **$sp^3d^3$** (pentagonal bipyramidal).\n\n" +
        "**(d) $\\ce{ClF3}$** — chlorine has 7 valence electrons; 3 go into bonds, leaving 4 as 2 lone pairs.\n\n" +
        "$3 + 2 = 5$ → **$sp^3d$** (T-shape).\n\n" +
        "**Answer:** $\\ce{SF6}$ — $sp^3d^2$; $\\ce{XeF4}$ — $sp^3d^2$; $\\ce{IF7}$ — $sp^3d^3$; $\\ce{ClF3}$ — $sp^3d$." },

    // 12 — worked example 2 (the PCl5 gas-vs-solid case)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — The PCl₅ State Trap',
      problem: "What is the hybridisation of phosphorus in $\\ce{PCl5}$ (i) in the gaseous state and (ii) in the solid state?",
      solution: "The whole question turns on the **state** — the same formula, two different answers.\n\n" +
        "**(i) Gaseous $\\ce{PCl5}$** — exists as discrete molecules.\n\n" +
        "Phosphorus makes 5 bonds, 0 lone pairs: $5 + 0 = 5$.\n\n" +
        "→ **$sp^3d$** (trigonal bipyramidal).\n\n" +
        "**(ii) Solid $\\ce{PCl5}$** — is ionic, existing as $\\ce{[PCl4]+}$ and $\\ce{[PCl6]-}$.\n\n" +
        "In $\\ce{[PCl4]+}$: 4 bonds, 0 lone pairs → $4 + 0 = 4$ → **$sp^3$** (tetrahedral).\n\n" +
        "In $\\ce{[PCl6]-}$: 6 bonds, 0 lone pairs → $6 + 0 = 6$ → **$sp^3d^2$** (octahedral).\n\n" +
        "**Answer:** gas → $sp^3d$; solid → $sp^3$ (in the cation) and $sp^3d^2$ (in the anion). Always read whether the question says gas or solid before answering." },

    // 13 — table: hybridisation → geometry → positions → example
    { id: uuidv4(), order: n(), type: 'table', caption: 'Expanded-octet hybridisations at a glance',
      headers: ['Hybridisation', 'Positions', 'Geometry', 'Example (no lp)', 'With lone pairs'],
      rows: [
        ['$sp^3d$', '5', 'Trigonal bipyramidal', '$\\ce{PCl5}$', '$\\ce{SF4}$ (see-saw), $\\ce{ClF3}$ (T), $\\ce{I3-}$ (linear)'],
        ['$sp^3d^2$', '6', 'Octahedral', '$\\ce{SF6}$', '$\\ce{BrF5}$ (square pyramidal), $\\ce{XeF4}$ (square planar)'],
        ['$sp^3d^3$', '7', 'Pentagonal bipyramidal', '$\\ce{IF7}$', '$\\ce{XeF6}$ (distorted octahedral)'],
      ] },

    // 14 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Two Things To Lock In',
      markdown: "**1. Only period 3 and below can expand the octet** — they have empty d-orbitals to use. Period-2 atoms (N, O, F) have no d-orbitals, so they are capped at eight and $\\ce{NF5}$ / $\\ce{OF6}$ cannot exist.\n\n" +
        "**2. Solid $\\ce{PCl5}$ is ionic** — $\\ce{[PCl4]+}$ ($sp^3$, tetrahedral) and $\\ce{[PCl6]-}$ ($sp^3d^2$, octahedral) — so its hybridisation is *not* the same as gaseous $\\ce{PCl5}$ ($sp^3d$). Always check the state.\n\n" +
        "And the shortcut that ties it all together: **$\\sigma$ bonds + free lone pairs = 5 / 6 / 7 → $sp^3d$ / $sp^3d^2$ / $sp^3d^3$.**" },

    // 15 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The state trap:** if a question on $\\ce{PCl5}$ (or $\\ce{PBr5}$) doesn't make you check gas-vs-solid, it is testing exactly that. Gas $\\ce{PCl5}$ → $sp^3d$; solid → $sp^3$ and $sp^3d^2$.\n\n" +
        "**The \"does it exist?\" bait:** classic statement questions slip in $\\ce{NF5}$, $\\ce{OF6}$, $\\ce{PH5}$, or $\\ce{BiCl5}$ as if they were real. They are not — no d-orbitals for N/O; hydrogen can't contract phosphorus's d-orbitals for $\\ce{PH5}$; inert-pair effect kills $\\ce{BiCl5}$.\n\n" +
        "**Count, don't memorise shapes:** for any expanded species, get $\\sigma$ bonds + free lone pairs first, then read the geometry off the table. That single number answers hybridisation, geometry, *and* (with lone-pair count) the shape." },

    // 16 — inline_quiz (last block)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'Which condition must a central atom satisfy before it can expand its octet beyond eight electrons?',
          options: [
            'It must have empty d-orbitals available, which first appear from period 3 onward',
            'It must be one of the most electronegative elements in its period',
            'It must belong to the second period of the periodic table',
            'It must already carry a positive formal charge before bonding'
          ],
          correct_index: 0,
          explanation: 'Expanding the octet means parking extra electrons in empty d-orbitals, and d-orbitals only become available in the third shell (period 3) and below. This is exactly why period-2 atoms like N and O are capped at eight — they have no d-subshell to use.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'In the solid state, PCl₅ exists as two ions. What are the hybridisations of phosphorus in those two ions?',
          options: [
            'Both ions have $sp^3d$ phosphorus, the same as gaseous PCl₅',
            'The cation has $sp^3$ phosphorus and the anion has $sp^3d^2$ phosphorus',
            'The cation has $sp^3d^2$ phosphorus and the anion has $sp^3$ phosphorus',
            'Both ions have $sp^3d^3$ phosphorus because seven chlorines are shared'
          ],
          correct_index: 1,
          explanation: 'Solid PCl₅ is ionic: $\\ce{[PCl4]+}$ (4 bonds → tetrahedral → $sp^3$) and $\\ce{[PCl6]-}$ (6 bonds → octahedral → $sp^3d^2$). Only the gaseous molecule is $sp^3d$ — which is the whole reason the question specifies "solid state".' },
        { id: uuidv4(), difficulty_level: 3,
          question: 'PCl₅ is stable but PH₅ is not, even though both would need phosphorus to form five bonds. What is the best explanation?',
          options: [
            'Phosphorus can bond to chlorine but is chemically unable to bond to hydrogen at all',
            'Highly electronegative chlorine contracts phosphorus\'s diffuse d-orbitals enough for them to bond, whereas hydrogen is not electronegative enough to do so',
            'Hydrogen atoms are too large to fit five around a phosphorus atom',
            'PH₅ would violate the octet rule, but PCl₅ obeys it'
          ],
          correct_index: 1,
          explanation: 'Phosphorus\'s empty 3d-orbitals are large and diffuse — they only overlap well when an electronegative neighbour pulls electron density away and contracts them. Chlorine does this; hydrogen, with low electronegativity, cannot, so the fifth bond never stabilises and $\\ce{PH5}$ does not exist. Both species would actually exceed an octet, so "PCl₅ obeys the octet rule" is false.' },
      ] },

    // 17 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now read any expanded-octet molecule — five, six or seven positions, lone pairs and all. Next we put these shapes to work: whether a molecule is **polar or non-polar**, and how the bond dipoles add up (or cancel) to give the molecule's overall **dipole moment**.*" },
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
    slug: NEW_SLUG, title: 'Expanded Octet — sp³d, sp³d² and Beyond',
    subtitle: 'Period-3 atoms use empty d-orbitals to exceed an octet — giving sp³d, sp³d² and sp³d³, with their limits.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'hybridisation', 'expanded-octet', 'vsepr'],
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

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 13 (expanded octet)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
