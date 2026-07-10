'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Arc A, Page 8 (SIGNATURE PAGE).
 * "Will It Dissolve? Lattice vs Hydration Energy" — the energy ledger behind
 * solubility, thermal stability, and why Al makes Al³⁺ not Al⁺.
 *
 * Built around the founder's chapter-defining "pocket-money ledger" analogy
 * (BOND-exemplars.md §A): lattice energy = the money you SPEND to break the
 * crystal; hydration energy = the REFUND water gives when it wraps the ions;
 * dissolve only if the refund ≥ the spend ("return higher than investment = profit").
 *
 * NOTE: a future "Lattice-vs-Hydration Ledger" interactive simulation is planned
 * but NOT built yet, so NO `simulation` block is added — the worked examples
 * (tap_to_reveal) carry the interactivity instead.
 *
 * Voice: BOND-exemplars.md (pocket-money ledger, thermal-decomposition hassle,
 * Al³⁺ businessman) + teacher-voice-profile.md (FORMAT v2 — honest difficulty,
 * "compare only what differs"). Grounded in NCERT Class 11 Ch.4 + standard JEE.
 * Run: node scripts/insert_bond_p8_lattice-hydration.js   (DO NOT auto-run)
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 8;
const NEW_SLUG = 'lattice-vs-hydration-solubility';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'An ionic crystal lattice breaking apart on the left while water molecules surround the freed ions on the right',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). On the left, a rigid cubic ionic crystal lattice (alternating large and small spheres) is shown cracking and pulling apart — chunks separating, suggesting energy being SPENT to break it. On the right, the now-freed individual positive and negative ions float separately, each completely surrounded by a shell of small bent water molecules pointing toward them (the oxygen/hydrogen ends oriented correctly), suggesting energy being RELEASED as the water wraps them. A visual sense of "spend, then refund". Clean scientific illustration style. Dark background (#0a0a0a or near-black), orange accent labels and arrows. No text.' },

    // 1 — fun_fact hook
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Same Label, Opposite Fate',
      markdown: "Drop a spoon of table salt ($\\ce{NaCl}$) into a glass of water and it vanishes in seconds. Drop a chip of chalk or marble ($\\ce{CaCO3}$) into the same glass and it just sits there, year after year. Both are labelled \"ionic solids\" — yet one dissolves and one refuses. The label isn't lying. The difference isn't *what kind* of bonding it is — it's an **energy ledger**: how much it costs to pull the crystal apart versus how much water pays back for taking the ions in. This page is that ledger." },

    // 2 — core concept text (the two-step dissolving + the ledger rule)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "To dissolve an ionic solid, water has to do **two jobs**, and they pull in opposite directions on your energy budget.\n\n" +
      "**Step 1 — break the lattice (you SPEND).** The crystal is a tight grid of $\\ce{+}$ and $\\ce{-}$ ions locked together by strong attraction. To free them, you must rip that grid apart into separate gaseous ions. That costs energy — the **lattice energy** — and it is *endothermic* (energy goes in). Think of it as money leaving your pocket: *\"₹500 lag gaye.\"*\n\n" +
      "**Step 2 — water wraps the ions (you get a REFUND).** The freed ions don't stay bare. Water molecules — slightly $\\ce{+}$ at the hydrogens, slightly $\\ce{-}$ at the oxygen — crowd around each ion and cling to it. This **hydration** releases energy — it is *exothermic* (energy comes out). That's the refund landing back in your pocket: *\"₹450 wapas aa gaye, so the real cost was only ₹50.\"*\n\n" +
      "Now the whole question of \"will it dissolve?\" becomes a simple piece of accounting: **was the refund bigger than the spend?**" },

    // 3 — heading: the energy ledger
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Energy Ledger — Spend vs Refund',
      objective: 'Decide whether any ionic solid dissolves by comparing the lattice energy spent against the hydration energy refunded.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Put the two steps on one balance sheet. The overall heat of dissolving is just the spend plus the refund:\n\n" +
      "$ \\Delta H_{solution} = \\Delta H_{lattice} + \\Delta H_{hydration} $\n\n" +
      "**State the sign convention clearly (it is where most students slip):** here $ \\Delta H_{lattice} $ is the energy needed to *break* the lattice into gaseous ions, so it is **positive** (you spend it). $ \\Delta H_{hydration} $ is the energy *released* when water surrounds those ions, so it is **negative** (the refund). Add them:\n\n" +
      "- If the refund out-weighs the spend, $ \\Delta H_{solution} $ comes out **negative (or only slightly positive)** → the solid **dissolves**. *Profit. Exothermic.*\n" +
      "- If the spend dominates the refund, $ \\Delta H_{solution} $ is **large and positive** → the solid stays largely **insoluble**. *Loss. Not worth it.*\n\n" +
      "That's the founder's one-line rule for the whole topic: **the return should be higher than the investment — only then are you in profit.** Refund ≥ spend, and it dissolves." },

    // 4 — image: lattice breaking → ions hydrated (the spend-then-refund picture)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Three-panel sequence: intact ionic lattice, lattice pulled apart into separate gaseous ions, then each ion surrounded by water molecules',
      caption: '📸 Spend to break the lattice, then collect the refund as water wraps each ion',
      generation_prompt: 'Three-panel left-to-right sequence diagram of dissolving an ionic solid. Panel 1: an intact cubic ionic lattice of alternating large negative ions and small positive ions, tightly packed, labelled "1. Intact crystal". Panel 2: the same lattice pulled apart into separated, isolated gaseous ions floating with gaps between them, with an upward arrow labelled "lattice energy SPENT (endothermic)". Panel 3: each separated ion now individually surrounded by a shell of small bent water molecules whose hydrogen ends point to negative ions and oxygen ends point to positive ions, with a downward arrow labelled "hydration energy REFUNDED (exothermic)". Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 5 — reasoning_prompt (mid-page, predict: given values, will it dissolve?)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'quantitative', difficulty_level: 2,
      prompt: "For an imaginary salt, breaking the lattice costs +700 kJ/mol and the hydration of its ions releases 740 kJ/mol. Using $ \\Delta H_{solution} = \\Delta H_{lattice} + \\Delta H_{hydration} $, decide whether it dissolves.",
      options: [
        "It stays insoluble, because the lattice energy (700) is large and large lattice energy always means insoluble",
        "It dissolves: spend +700 and refund −740 give $ \\Delta H_{solution} = -40 $ kJ/mol — the refund beats the spend, so the process is exothermic (profit)",
        "It dissolves: $ \\Delta H_{solution} = +700 + 740 = +1440 $ kJ/mol, and a large positive value means easy dissolving",
        "Nothing can be decided without also knowing the temperature of the water"
      ],
      correct_index: 1,
      reveal: "Write hydration as the refund — a negative number: −740. Then $ \\Delta H_{solution} = (+700) + (-740) = -40 $ kJ/mol. The refund out-weighs the spend by 40, so the books close in profit (exothermic) and the salt dissolves. The trap in option 3 is adding both as positive — hydration must carry its negative sign. And it is never \"large lattice energy ⇒ insoluble\" on its own (option 1): a big spend can still be repaid by a bigger refund. You compare the two numbers, you don't fear one of them." },

    // 6 — heading: solubility trends
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Solubility Trends — When Both Numbers Are Big',
      objective: 'Explain why some sulphates dissolve and others do not by tracking which energy — lattice or hydration — falls faster down a group.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Small, highly-charged ions pack tightly and pull water hard — so they have **both** a high lattice energy *and* a high hydration energy. The two giants partly cancel, and solubility is decided by **which one wins**, not by either number alone.\n\n" +
      "The cleanest example is the **Group 2 sulphates** ($\\ce{BeSO4}, \\ce{MgSO4}, \\ce{CaSO4}, \\ce{SrSO4}, \\ce{BaSO4}$). Going *down* the group, the cation gets bigger — so **both** energies fall. But they don't fall at the same speed. The sulphate ion ($\\ce{SO4^2-}$) is large; next to it the cation size barely changes the lattice energy, so **lattice energy falls slowly**. Hydration energy, though, depends sharply on cation size, so it **falls fast**. The refund shrinks faster than the spend.\n\n" +
      "Result: at the top, $\\ce{MgSO4}$ and $\\ce{BeSO4}$ get a big enough refund to dissolve; by the bottom, $\\ce{BaSO4}$'s refund has collapsed while its spend is still high — so $\\ce{BaSO4}$ is famously **insoluble**. **Group 2 sulphate solubility decreases down the group.**\n\n" +
      "*(The Group 2 hydroxides do the **opposite** — solubility *increases* down the group — because there the hydroxide is small, so the lattice energy now falls faster than hydration. Same ledger, different winner. The move that matters is always: compare only what differs.)*" },

    // 7 — worked_example #1: dissolve-or-not from given energies
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Read the Ledger',
      problem: "For salt X, the lattice energy is +780 kJ/mol and the total hydration energy of its ions is −800 kJ/mol. For salt Y, the lattice energy is +780 kJ/mol and the hydration energy is −700 kJ/mol. Which salt dissolves more readily?",
      solution: "Same spend for both (+780), so compare only what differs — the refund.\n\n" +
        "**Salt X:** $ \\Delta H_{solution} = (+780) + (-800) = -20 $ kJ/mol.\n\n" +
        "Refund beats spend → negative → **dissolves (exothermic, profit).**\n\n" +
        "**Salt Y:** $ \\Delta H_{solution} = (+780) + (-700) = +80 $ kJ/mol.\n\n" +
        "Spend beats refund → positive → **largely insoluble (loss).**\n\n" +
        "**Salt X dissolves more readily.** Notice we never had to fear the +780 — it was identical in both, so it could not be the deciding factor. The only thing that moved the answer was the size of the refund. Compare what differs; ignore what is shared." },

    // 8 — worked_example #2: group solubility trend reasoning
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Why BaSO₄ Won\'t Dissolve',
      problem: "$\\ce{MgSO4}$ is freely soluble in water, but $\\ce{BaSO4}$ is essentially insoluble — even though both are Group 2 sulphates. Explain using the energy ledger.",
      solution: "Going from $\\ce{Mg^2+}$ down to $\\ce{Ba^2+}$, the cation gets bigger. Both energies fall — but at different speeds.\n\n" +
        "**Lattice energy (the spend):** the partner anion $\\ce{SO4^2-}$ is large, so changing the cation size barely moves it.\n\n" +
        "Lattice energy falls **slowly** down the group.\n\n" +
        "**Hydration energy (the refund):** depends sharply on how small and dense the cation is.\n\n" +
        "Hydration energy falls **fast** down the group.\n\n" +
        "**For $\\ce{MgSO4}$:** small $\\ce{Mg^2+}$ pulls water hard → large refund → refund covers the spend → dissolves.\n\n" +
        "**For $\\ce{BaSO4}$:** big $\\ce{Ba^2+}$ pulls water weakly → refund has collapsed, while the spend is still high → spend wins → insoluble.\n\n" +
        "So **Group 2 sulphate solubility decreases down the group** because the refund (hydration) shrinks faster than the spend (lattice)." },

    // 9 — heading: thermal stability (same accounting idea)
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Thermal Stability — The Same Ledger, Different Question',
      objective: 'Use the lattice-energy payoff to predict why bigger cations make carbonates harder to decompose down a group.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Heating a carbonate like $\\ce{CaCO3}$ can break it down: $\\ce{CaCO3 -> CaO + CO2}$. Whether it bothers to decompose is, again, an energy ledger — just a different transaction.\n\n" +
      "When the big carbonate ion ($\\ce{CO3^2-}$) is thrown out and replaced by the small oxide ion ($\\ce{O^2-}$), the metal builds a **new, tighter oxide lattice** — and a tighter lattice means a **big lattice-energy gain**. That gain is the *reward* for going through the trouble of decomposing. So the real question the compound \"asks\" is: **is the reward worth the hassle?**\n\n" +
      "*Who would go through all that hassle — break everything, rebuild a whole new crystal — for a tiny payoff? Nobody.* A reaction only happens when the energy payoff is genuinely worth the trouble.\n\n" +
      "Now run it down **Group 2**. The **smaller** cations ($\\ce{Mg^2+}, \\ce{Ca^2+}$) form a *much* tighter, higher-energy oxide than they had as a carbonate — so the reward is large, the hassle is worth it, and they decompose **easily** (at lower temperature). The **bigger** cations ($\\ce{Sr^2+}, \\ce{Ba^2+}$) are too large to gain much by switching to the small oxide — the reward is marginal, *not worth the trouble* — so they resist decomposing. That is exactly why **Group 2 carbonate thermal stability increases down the group.**" },

    // 10 — worked_example #3: thermal stability trend
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Which Carbonate Decomposes First?',
      problem: "Arrange $\\ce{MgCO3}$, $\\ce{CaCO3}$ and $\\ce{BaCO3}$ in order of *increasing* thermal stability, and say which one decomposes at the lowest temperature.",
      solution: "Decomposition = swap the big $\\ce{CO3^2-}$ for the small $\\ce{O^2-}$ and pocket the lattice-energy reward. The smaller the cation, the bigger that reward.\n\n" +
        "**$\\ce{Mg^2+}$ (smallest):** switching to the tiny oxide gives a huge lattice-energy gain → big reward → decomposes most easily, at the **lowest** temperature.\n\n" +
        "**$\\ce{Ba^2+}$ (largest):** gains very little by switching to the oxide → marginal reward → *not worth the hassle* → most stable, needs the **highest** temperature.\n\n" +
        "**Increasing thermal stability:** $\\ce{MgCO3} < \\ce{CaCO3} < \\ce{BaCO3}$.\n\n" +
        "$\\ce{MgCO3}$ decomposes at the lowest temperature. So **thermal stability increases down Group 2** — the bigger the cation, the smaller the payoff for decomposing." },

    // 11 — heading: Al³⁺ insight
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Why Aluminium Forms Al³⁺, Not Al⁺',
      objective: 'See how a very high hydration/lattice energy of the 3+ ion repays the steep cost of removing three electrons.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Removing electrons costs energy (ionisation energy), and the *third* electron costs a lot. So why does aluminium go all the way to $\\ce{Al^3+}$ instead of stopping cheaply at $\\ce{Al^+}$?\n\n" +
      "Because it's the same ledger again — spend versus return. Yes, making $\\ce{Al^3+}$ has a **high spend** (three ionisation steps). But a $3+$ ion is small and triple-charged, so it pulls water and packs into lattices ferociously: its **hydration energy and lattice energy are enormous** — a **huge return**. That return more than repays the steep ionisation cost.\n\n" +
      "It's pure businessman logic: *\"I spent more, but my returns are also excellent — I took a bigger risk and got a bigger profit.\"* $\\ce{Al^+}$ would be the timid, low-risk choice — small spend, but a small, $1+$-sized return that leaves aluminium worse off overall. So nature picks $\\ce{Al^3+}$: high spend, high return, net profit.\n\n" +
      "*(An interactive \"Lattice-vs-Hydration Ledger\" — where you slide the spend and the refund and watch the salt dissolve or refuse — is on the way. For now, the worked examples above are your ledger to play with.)*" },

    // 12 — latex_block: the master equation
    { id: uuidv4(), order: n(), type: 'latex_block',
      latex: "\\Delta H_{solution} = \\Delta H_{lattice} + \\Delta H_{hydration}",
      label: 'The dissolving ledger',
      note: 'ΔH_lattice = energy SPENT to break the crystal into gaseous ions (positive, endothermic); ΔH_hydration = energy REFUNDED when water surrounds the ions (negative, exothermic). Negative ΔH_solution ⇒ dissolves.' },

    // 13 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The One Rule Behind Everything Here',
      markdown: "**Refund ≥ spend → it dissolves.** Lattice energy is the money you SPEND to break the crystal; hydration energy is the REFUND water gives when it wraps the freed ions. If the refund is at least as big as the spend, $ \\Delta H_{solution} $ is negative (or barely positive) and the solid dissolves. If the spend wins, it stays insoluble. The very same \"is the payoff worth it?\" accounting decides **thermal stability** and **why aluminium chooses $\\ce{Al^3+}$**." },

    // 14 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**This page is a question factory — three reflexes the examiner tests:**\n\n" +
        "**Sign reasoning on $ \\Delta H_{solution} $:** the classic trap is adding hydration as a positive number. Lattice is **+** (spend), hydration is **−** (refund). $ \\Delta H_{solution} = \\Delta H_{lattice} + \\Delta H_{hydration} $; **negative ⇒ soluble.**\n\n" +
        "**Group trends — know the winner, not just the direction:** Group 2 **sulphate solubility decreases** down the group (hydration falls faster than lattice); Group 2 **hydroxide solubility increases** down the group (lattice falls faster); Group 2 **carbonate thermal stability increases** down the group (bigger cation ⇒ smaller decomposition payoff).\n\n" +
        "**The $\\ce{Al^3+}$ logic:** \"high spend, high return\" — high ionisation energy is repaid by very high hydration/lattice energy of the small $3+$ ion. Same reasoning explains why most metals form the higher, not the lower, oxidation state.\n\n" +
        "**The decisive move:** when two salts share a spend (or a refund), *compare only what differs* — don't waste time on the common term." },

    // 15 — inline_quiz (§3.6.1) — LAST content quiz
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'In the ledger $ \\Delta H_{solution} = \\Delta H_{lattice} + \\Delta H_{hydration} $, an ionic solid dissolves most readily when:',
          options: [
            'the hydration energy released is at least as large as the lattice energy spent, making ΔH_solution negative or only slightly positive',
            'the lattice energy is as large as possible, because a strong crystal is easier to break',
            'both the lattice energy and the hydration energy are as small as possible',
            'the lattice energy spent is much larger than the hydration energy released'
          ],
          correct_index: 0,
          explanation: 'Dissolving needs the refund (hydration) to cover the spend (lattice) so ΔH_solution comes out negative. A large lattice energy on its own makes the crystal harder, not easier, to break — and option 4 describes exactly the insoluble case where the spend wins.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Group 2 sulphate solubility decreases down the group (MgSO₄ soluble → BaSO₄ insoluble). The best reason is:',
          options: [
            'lattice energy increases sharply down the group while hydration energy stays constant',
            'down the group hydration energy falls faster than lattice energy, because the large sulphate ion makes lattice energy almost insensitive to cation size',
            'barium is more metallic than magnesium, so its sulphate cannot dissolve in a polar solvent',
            'sulphate ions become larger down the group, raising the lattice energy each time'
          ],
          correct_index: 1,
          explanation: 'The anion (SO₄²⁻) is fixed and large, so lattice energy barely changes with cation size and falls slowly; hydration energy depends strongly on cation size and falls fast. The refund collapses faster than the spend, so the heavier sulphates stop dissolving. The metallic-character idea (option 3) plays no role in this ledger.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Aluminium forms Al³⁺ rather than the cheaper Al⁺. Why is the extra ionisation cost worth paying?',
          options: [
            'Al⁺ is impossible to form because aluminium has no electrons in its outermost shell',
            'the small, triple-charged Al³⁺ has very high hydration and lattice energy, and that large return more than repays the high ionisation cost',
            'removing three electrons actually releases energy, so Al³⁺ costs nothing to make',
            'Al³⁺ and Al⁺ release the same energy, so aluminium simply forms the one with more charge'
          ],
          correct_index: 1,
          explanation: 'Making Al³⁺ has a high spend (three ionisation steps) but the tiny, triple-charged ion pulls water and packs into lattices ferociously, giving an enormous return that nets a profit — Al⁺ would be a small spend for a far smaller return. Ionisation always costs energy (it never releases it), so option 3 is wrong.' },
      ] },

    // 16 — bridge: close Arc A, preview Arc B (VSEPR / molecular shape)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*That closes **Arc A**: you now know **why** atoms bond, the three routes to an octet, and the energy ledger that decides whether an ionic solid dissolves, how stable it is to heat, and which ion an atom chooses to become. Every bit of it came down to one habit — weigh the spend against the return, and compare only what differs.*\n\n" +
      "*Next, in **Arc B**, we leave energy behind and ask a new question: once atoms have bonded, **what shape does the molecule take?** We'll use **VSEPR** — the idea that electron pairs push each other as far apart as they can — to predict the actual three-dimensional shape of any molecule.*" },
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
    slug: NEW_SLUG, title: 'Will It Dissolve? Lattice vs Hydration Energy',
    subtitle: 'Dissolving is an energy ledger — spend lattice energy to break the crystal, get hydration energy back as a refund; refund ≥ spend means it dissolves.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'lattice-energy', 'hydration-energy', 'solubility', 'thermal-stability'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  // Wire into chapter 4 page_ids (append in sequence).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 8 (lattice vs hydration, solubility & thermal stability)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
