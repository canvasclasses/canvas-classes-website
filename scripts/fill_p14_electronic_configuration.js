// Fill the EMPTY placeholder page p14 (slug `filling-orbitals-electronic-configuration`)
// of the ncert-simplified book, chapter 2, with the "filling mechanics" half of the
// electronic-configuration content: Aufbau / (n+l) rule, Pauli, Hund, the
// electron-configuration-builder simulation, a worked example (Fe), a reasoning
// prompt, and an inline quiz.
//
// CONTEXT (founder, 2026-06-24): the chapter ALREADY has this empty shell (0 blocks,
// pre-set title "Filling of Orbitals and Electronic Configuration") and a sibling
// shell p15. We FILL the shell — we do NOT create a new page, and no chapter-linking
// is needed (the page is already in the chapter's page_ids).
//
// SAFETY (CLAUDE.md §0.6): writes ONLY through the sanctioned gateway
// scripts/lib/book-writer.js `savePage`, selected BY pageId (slugs are not globally
// unique). This is ADDITIVE (0 → N blocks) so the content-loss guard passes. Default
// is DRY-RUN; pass --apply to write. Affects exactly 1 document (book_pages).
// Rollback: a version snapshot is taken automatically on apply
// (bw.restorePageVersion), and the shell was empty so reverting is trivial.
//
//   node scripts/fill_p14_electronic_configuration.js            # dry-run (default)
//   node scripts/fill_p14_electronic_configuration.js --apply    # write

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bw = require('./lib/book-writer');

const SLUG = 'filling-orbitals-electronic-configuration';
const SUBTITLE = 'Aufbau, Pauli and Hund — how electrons fill an atom';
const APPLY = process.argv.includes('--apply');

function buildBlocks() {
  let _o = 0;
  const n = () => _o++;
  return [
    // ── 0 ── fun_fact opener — one rule builds the whole periodic table
    {
      id: uuidv4(), type: 'callout', order: n(),
      variant: 'fun_fact',
      title: 'One Rule Builds the Whole Periodic Table',
      markdown: [
        'Every element in the periodic table — all 118 of them — is just hydrogen with more electrons',
        'packed in, one at a time, following the **same three rules**.',
        'Learn how that packing works and you can write the electron arrangement of *any* atom',
        'from memory, predict how it bonds, and explain where it sits in the table.',
        'Three rules. That is the whole game.',
      ].join(' '),
    },

    // ── 1 ── intro text — what electronic configuration is + why it's the payoff
    {
      id: uuidv4(), type: 'text', order: n(),
      markdown: [
        'An atom’s **electronic configuration** is simply the list of which orbitals its electrons sit in —',
        'written like $1s^2\\,2s^2\\,2p^6$, where the big number is the shell $(n)$, the letter is the',
        'sub-shell $(s, p, d, f)$, and the superscript is how many electrons are in it.\n\n',
        'This is the **payoff** of everything you have learned about quantum numbers and orbital shapes.',
        'Once you can write an atom’s configuration, you can read off its **valence electrons** (the outer',
        'ones that do chemistry), predict the **ions** it forms, and place it in the right **block** of the',
        'periodic table. So the question now is purely practical: when you add electrons to an atom,',
        '**which orbital does each new electron go into, and in what order?**',
      ].join(' '),
    },

    // ── 2 ── heading — the three rules
    {
      id: uuidv4(), type: 'heading', order: n(), level: 2,
      text: 'The Three Rules That Fill Every Atom',
    },

    // ── 3 ── Aufbau + (n+l) rule text
    {
      id: uuidv4(), type: 'text', order: n(),
      markdown: [
        '**Rule 1 — The Aufbau Principle (“building up”).** Electrons fill the orbitals with the',
        '**lowest energy first**, then move up. Fill the cheapest seats before the expensive ones.\n\n',
        'But here is the catch students trip over: the orbitals do **not** fill in plain number order.',
        '$4s$ fills *before* $3d$, even though 4 is bigger than 3. To get the order right, use the',
        '**$(n + l)$ rule** (also called the Madelung rule):\n',
        '- Fill the orbital with the **lowest $(n + l)$ value first**.\n',
        '- If two orbitals have the **same $(n + l)$**, fill the one with the **lower $n$** first.\n\n',
        'Worked the right way, this gives the famous filling order:\n\n',
        '$$1s\\,2s\\,2p\\,3s\\,3p\\,4s\\,3d\\,4p\\,5s\\,4d\\,5p\\,6s\\,4f\\,5d\\,6p\\,7s$$\n\n',
        'Check the cross-over for yourself: for $4s$, $(n+l) = 4 + 0 = 4$; for $3d$, $(n+l) = 3 + 2 = 5$.',
        'Since $4 < 5$, **$4s$ fills first** — exactly what we see in potassium and calcium.',
      ].join(' '),
    },

    // ── 4 ── remember callout — filling order + why 4s before 3d
    {
      id: uuidv4(), type: 'callout', order: n(),
      variant: 'remember',
      title: 'The Filling Order — and Why 4s Beats 3d',
      markdown: [
        '| Orbital | $n$ | $l$ | $n + l$ | Fills… |\n',
        '|---|---|---|---|---|\n',
        '| $4s$ | 4 | 0 | **4** | first |\n',
        '| $3d$ | 3 | 2 | **5** | after $4s$ |\n\n',
        '**Lower $(n+l)$ = lower energy = fills first.** A bigger shell number does *not* automatically',
        'mean higher energy — the sub-shell letter ($l$) matters just as much. That single idea is why',
        '$4s$ sneaks in before $3d$, and it is the root of almost every transition-metal surprise.',
      ].join(''),
    },

    // ── 5 ── Pauli text
    {
      id: uuidv4(), type: 'text', order: n(),
      markdown: [
        '**Rule 2 — The Pauli Exclusion Principle.** No two electrons in the same atom can have all',
        'four quantum numbers identical. The practical consequence: **an orbital holds at most two',
        'electrons, and they must have opposite spins** (one “spin-up” $\\uparrow$, one “spin-down”',
        '$\\downarrow$). This is exactly why an $s$ sub-shell (1 orbital) maxes out at 2 electrons, a',
        '$p$ sub-shell (3 orbitals) at 6, and a $d$ sub-shell (5 orbitals) at 10.',
      ].join(' '),
    },

    // ── 6 ── Hund text
    {
      id: uuidv4(), type: 'text', order: n(),
      markdown: [
        '**Rule 3 — Hund’s Rule of Maximum Multiplicity.** When you fill a sub-shell that has several',
        'orbitals of the **same energy** (the three $p$ orbitals, the five $d$ orbitals), electrons go in',
        '**one to each orbital first, all with parallel spins**, before any orbital gets a second electron.\n\n',
        'Think of passengers boarding an empty bus: everyone takes their own empty row before anyone',
        'doubles up. Electrons repel each other, so spreading out into separate orbitals keeps them',
        'farther apart and lowers the energy. Only once every orbital in the sub-shell has one electron',
        'do they start pairing up. This rule is what decides the number of **unpaired electrons** —',
        'which in turn controls magnetism and a lot of bonding behaviour.',
      ].join(' '),
    },

    // ── 7 ── simulation block — the centrepiece (predict-observe-explain)
    {
      id: uuidv4(), type: 'simulation', order: n(),
      simulation_id: 'electron-configuration-builder',
      title: 'Build the Configuration — Fill an Atom Yourself',
      prediction: {
        prompt: 'Before you build it — when you fill iron (Fe, 26 electrons), which sub-shell receives electrons LAST: the 4s or the 3d?',
        options: [
          'The 4s — it has the higher shell number, so it fills last',
          'The 3d — it sits higher in energy than 4s, so it fills after 4s is done',
          'They fill at exactly the same time',
        ],
        reveal_after:
          'The 3d fills AFTER the 4s. By the $(n+l)$ rule, $4s$ ($n+l = 4$) is lower in energy than $3d$ ($n+l = 5$), so the two 4s electrons go in first; only then do electrons start landing in 3d. Build iron in the simulator and watch the 4s box fill before the 3d boxes — and notice Hund’s rule spreading the 3d electrons out one per box before any pair up.',
      },
    },

    // ── 8 ── worked_example — Fe (Z=26)
    {
      id: uuidv4(), type: 'worked_example', order: n(),
      variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Configuration of Iron (Z = 26)',
      problem: 'Write the full and condensed electronic configuration of iron, Fe (atomic number 26). How many unpaired electrons does it have?',
      solution: [
        'Add 26 electrons in the $(n+l)$ filling order, respecting Pauli (max 2 per orbital) and Hund',
        '(spread out before pairing).\n\n',
        '**Full:** $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,4s^2\\,3d^6$. Count the superscripts:',
        '$2+2+6+2+6+2+6 = 26$. ✓\n\n',
        '**Condensed:** the part up to argon ($1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6$, 18 electrons) is exactly',
        'the noble gas argon, so we shorten it to $[\\text{Ar}]$:\n\n',
        '$$\\text{Fe} = [\\text{Ar}]\\,3d^6\\,4s^2$$\n\n',
        '**Unpaired electrons:** the five $3d$ orbitals get 6 electrons. By Hund’s rule the first five go',
        'in singly (one per orbital), then the sixth pairs up with one of them. That leaves',
        '**4 orbitals with a single (unpaired) electron** → Fe has **4 unpaired electrons**.\n\n',
        '*(Note the conventional write-up puts $3d$ before $4s$ even though $4s$ filled first — both forms',
        'are accepted; the energy ordering and the box-counting are what matter.)*',
      ].join(' '),
    },

    // ── 9 ── reasoning_prompt — why 4s fills before 3d (the (n+l) logic)
    {
      id: uuidv4(), type: 'reasoning_prompt', order: n(),
      reasoning_type: 'logical', difficulty_level: 2,
      prompt: 'The 4s orbital is in shell number 4 and the 3d orbital is in shell number 3. So why on earth does the 4s fill with electrons FIRST?',
      options: [
        'Because a smaller shell number always means a higher-energy orbital',
        'Because what sets an orbital’s energy is the combination $(n + l)$, not $n$ alone — and $4s$ has $(n+l)=4$ while $3d$ has $(n+l)=5$, so $4s$ is actually the lower-energy seat and fills first',
        'Because the 3d orbital does not exist until the 4s is completely full',
        'Because electrons prefer orbitals whose letter comes earlier in the alphabet',
      ],
      correct_index: 1,
      reveal: 'Energy order is set by $(n + l)$, not by the shell number on its own. For $4s$, $(n+l) = 4 + 0 = 4$; for $3d$, $(n+l) = 3 + 2 = 5$. Lower $(n+l)$ means lower energy, so the $4s$ seat is genuinely cheaper than the $3d$ one — and electrons always take the cheapest seat first (Aufbau). That is the whole reason $4s$ fills before $3d$, and why the transition metals begin the way they do.',
    },

    // ── 10 ── inline_quiz — filling: (n+l) ordering, Fe²⁺ trap, Hund counting
    {
      id: uuidv4(), type: 'inline_quiz', order: n(),
      pass_threshold: 0.6,
      questions: [
        {
          id: uuidv4(),
          question: 'Using the $(n+l)$ rule, which of these orbitals fills with electrons FIRST?',
          options: ['$3d$', '$4s$', '$4p$', '$5s$'],
          correct_index: 1,
          explanation: '$4s$ has $(n+l) = 4$, the lowest of the four. $3d$ has $5$, $4p$ has $5$, and $5s$ has $5$. Lowest $(n+l)$ fills first, so $4s$ wins.',
        },
        {
          id: uuidv4(),
          question: 'Neutral iron is $[\\text{Ar}]\\,3d^6\\,4s^2$. When it loses two electrons to become Fe²⁺, which electrons leave first?',
          options: [
            'The two $3d$ electrons, because $3d$ filled last',
            'The two $4s$ electrons — electrons are removed from the highest principal shell ($n=4$) first',
            'One electron from $4s$ and one from $3d$',
            'No electrons can be removed from iron',
          ],
          correct_index: 1,
          explanation: 'This is the classic cation trap. Although $4s$ FILLS before $3d$, once both are occupied the $4s$ electrons (higher $n$) are the outermost and leave FIRST. So Fe²⁺ = $[\\text{Ar}]\\,3d^6$ — the 4s is emptied, the 3d is untouched.',
        },
        {
          id: uuidv4(),
          question: 'A nitrogen atom has the configuration $1s^2\\,2s^2\\,2p^3$. By Hund’s rule, how many unpaired electrons are in its $2p$ sub-shell?',
          options: ['1', '2', '3', '0'],
          correct_index: 2,
          explanation: 'The $2p$ sub-shell has three orbitals of equal energy. By Hund’s rule the three $2p$ electrons go in one per orbital, all with parallel spins, before any pair up. That gives 3 separate orbitals each with a single electron → **3 unpaired electrons**.',
        },
        {
          id: uuidv4(),
          question: 'Which statement about the Pauli exclusion principle is correct?',
          options: [
            'An orbital can hold up to four electrons',
            'Two electrons in the same orbital must have the same spin',
            'An orbital holds at most two electrons, and they must have opposite spins',
            'Every electron in an atom must be in a different shell',
          ],
          correct_index: 2,
          explanation: 'Pauli says no two electrons can share all four quantum numbers. In practice that caps an orbital at two electrons, and those two must have opposite spins ($\\uparrow\\downarrow$). This is why $s$ holds 2, $p$ holds 6, and $d$ holds 10.',
        },
      ],
    },
  ];
}

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');

  try {
    const cur = await db.collection('book_pages').findOne({ slug: SLUG, deleted_at: null });
    if (!cur) { console.error(`page "${SLUG}" not found`); return; }

    const newBlocks = buildBlocks();

    // Block map preview
    console.log(`page "${SLUG}" (id ${cur._id}) — ${(cur.blocks || []).length} blocks currently`);
    console.log('\nBlock map (p14):');
    for (const b of newBlocks) {
      const label = (b.text || b.title || b.label || b.simulation_id || b.prompt || (b.markdown || '').slice(0, 55) || '')
        .toString().replace(/\s+/g, ' ').slice(0, 60);
      console.log(`  [${String(b.order).padStart(2, '0')}] ${b.type.padEnd(16)} ${label}`);
    }
    console.log(`\nblock count: ${(cur.blocks || []).length} → ${newBlocks.length} (additive)`);

    const res = await bw.savePage(
      db,
      { pageId: cur._id },
      newBlocks,
      {
        author: 'agent:econfig',
        summary: 'Fill empty p14 shell — filling mechanics (Aufbau/(n+l), Pauli, Hund, sim, Fe worked example, reasoning, quiz)',
        dryRun: !APPLY,
        extraSet: { subtitle: SUBTITLE },
      }
    );

    if (!APPLY) {
      console.log(`\nDRY-RUN — nothing written. wouldBlock=${res.wouldBlock}`);
      console.log('Re-run with --apply to write.');
    } else {
      console.log(`\n✓ APPLIED. version snapshot=${res.version}. blocks now ${newBlocks.length}.`);
    }
  } finally {
    await client.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
