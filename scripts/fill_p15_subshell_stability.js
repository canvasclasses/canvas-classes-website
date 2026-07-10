// Fill the EMPTY placeholder page p15 (slug `stability-filled-halffilled-subshells`)
// of the ncert-simplified book, chapter 2, with the "exceptions & why" half of the
// electronic-configuration content: the chromium and copper anomalies, the extra
// stability of half-filled (d⁵) and completely filled (d¹⁰) sub-shells (symmetry +
// exchange energy), a predicted-vs-actual comparison card, a reasoning prompt
// (K vs Cu), an exam tip, and an inline quiz.
//
// CONTEXT (founder, 2026-06-24): the chapter ALREADY has this empty shell (0 blocks,
// pre-set title "Stability of Completely Filled and Half-Filled Subshells") and a
// sibling shell p14. We FILL the shell — we do NOT create a new page, and no
// chapter-linking is needed (the page is already in the chapter's page_ids).
//
// SAFETY (CLAUDE.md §0.6): writes ONLY through the sanctioned gateway
// scripts/lib/book-writer.js `savePage`, selected BY pageId (slugs are not globally
// unique). This is ADDITIVE (0 → N blocks) so the content-loss guard passes. Default
// is DRY-RUN; pass --apply to write. Affects exactly 1 document (book_pages).
// Rollback: a version snapshot is taken automatically on apply
// (bw.restorePageVersion), and the shell was empty so reverting is trivial.
//
//   node scripts/fill_p15_subshell_stability.js            # dry-run (default)
//   node scripts/fill_p15_subshell_stability.js --apply    # write

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bw = require('./lib/book-writer');

const SLUG = 'stability-filled-halffilled-subshells';
const SUBTITLE = 'Why chromium and copper break the pattern';
const APPLY = process.argv.includes('--apply');

function buildBlocks() {
  let _o = 0;
  const n = () => _o++;
  return [
    // ── 0 ── fun_fact / opener hook — chromium and copper "cheat" the rule
    {
      id: uuidv4(), type: 'callout', order: n(),
      variant: 'fun_fact',
      title: 'Two Elements That Cheat the Rule',
      markdown: [
        'You just learned the Aufbau filling order — fill $4s$ before $3d$. It works perfectly…',
        'until you reach **chromium** and **copper**, which flatly refuse to obey it.',
        'Each one quietly steals an electron out of its $4s$ orbital and parks it in $3d$ instead.',
        'They are not breaking the rules randomly — they are chasing something the simple Aufbau',
        'order misses: the special **stability of half-filled and completely-filled sub-shells**.',
        'Of every element up to atomic number 36, these are the only two that pull this trick.',
      ].join(' '),
    },

    // ── 1 ── heading
    {
      id: uuidv4(), type: 'heading', order: n(), level: 2,
      text: 'The Chromium and Copper Anomalies',
    },

    // ── 2 ── text — Cr and Cu actual configurations
    {
      id: uuidv4(), type: 'text', order: n(),
      markdown: [
        'If we blindly followed the Aufbau order, we would predict:\n',
        '- **Chromium (Z = 24):** $[\\text{Ar}]\\,3d^4\\,4s^2$\n',
        '- **Copper (Z = 29):** $[\\text{Ar}]\\,3d^9\\,4s^2$\n\n',
        'But experiment shows the **actual** configurations are different — one $4s$ electron has',
        'jumped into $3d$ in each case:\n\n',
        '$$\\text{Cr} = [\\text{Ar}]\\,3d^5\\,4s^1 \\qquad \\text{Cu} = [\\text{Ar}]\\,3d^{10}\\,4s^1$$\n\n',
        'Look at what the atom gains by doing this. Chromium reaches a **half-filled** $3d$ sub-shell',
        '($3d^5$ — one electron in each of the five $d$ orbitals). Copper reaches a **completely filled**',
        '$3d$ sub-shell ($3d^{10}$ — every $d$ orbital full). Both of these arrangements are unusually',
        'stable, and the tiny cost of promoting one $4s$ electron is more than repaid by the stability',
        'the atom gains. These are the only two deviations among all elements with $Z \\le 36$.',
      ].join(' '),
    },

    // ── 3 ── heading — why
    {
      id: uuidv4(), type: 'heading', order: n(), level: 2,
      text: 'Why Are Half-Filled and Full Sub-Shells So Stable?',
    },

    // ── 4 ── text — symmetry + exchange energy
    {
      id: uuidv4(), type: 'text', order: n(),
      markdown: [
        'Two effects work together to make exactly-half-filled ($d^5$) and completely-filled ($d^{10}$)',
        'sub-shells extra stable:\n\n',
        '**1. Symmetrical distribution.** When every orbital in a sub-shell holds the same number of',
        'electrons (one each in $d^5$, two each in $d^{10}$), the electron cloud is **perfectly symmetric**',
        'around the nucleus. A balanced, even distribution is lower in energy than a lopsided one.\n\n',
        '**2. Exchange energy.** This is the bigger reason. Whenever two electrons with the **same spin**',
        'sit in **different orbitals of the same sub-shell**, they can “swap places.” Each possible swap',
        'releases a little energy and stabilises the atom — a purely quantum effect with no everyday',
        'analogy. The more same-spin electrons you have spread across the orbitals, the **more swaps**',
        'are possible, and the more exchange energy you bank.\n\n',
        'A half-filled $d^5$ has five parallel-spin electrons — the maximum number of mutual swaps',
        'possible — so its exchange energy is at a peak. That is why an atom will pay the small price of',
        'moving a $4s$ electron into $3d$ to *reach* $d^5$ (chromium) or $d^{10}$ (copper): the exchange-energy',
        'and symmetry payoff is worth more than the cost.',
      ].join(' '),
    },

    // ── 5 ── comparison_card — predicted vs actual for Cr & Cu
    {
      id: uuidv4(), type: 'comparison_card', order: n(),
      title: 'Predicted vs Actual — the Two Anomalies',
      columns: [
        {
          heading: 'What Aufbau predicts',
          color: 'red',
          points: [
            'Chromium → $[\\text{Ar}]\\,3d^4\\,4s^2$',
            'Copper → $[\\text{Ar}]\\,3d^9\\,4s^2$',
            'Fills $4s$ fully, then adds to $3d$',
            'Ignores the stability of $d^5$ and $d^{10}$',
          ],
        },
        {
          heading: 'What actually happens',
          color: 'green',
          points: [
            'Chromium → $[\\text{Ar}]\\,3d^5\\,4s^1$ — half-filled $d$',
            'Copper → $[\\text{Ar}]\\,3d^{10}\\,4s^1$ — full $d$',
            'One $4s$ electron is promoted into $3d$',
            'Buys extra symmetry + exchange-energy stability',
          ],
        },
      ],
    },

    // ── 6 ── reasoning_prompt — K vs Cu (both end in 4s¹)
    {
      id: uuidv4(), type: 'reasoning_prompt', order: n(),
      reasoning_type: 'logical', difficulty_level: 3,
      prompt: 'Potassium (K) ends in $4s^1$ and copper (Cu) also ends in $4s^1$. But these two single $4s$ electrons got there for completely different reasons. What is the difference?',
      options: [
        'There is no real difference — both simply followed the Aufbau order',
        'In potassium the $4s^1$ is just the next electron Aufbau adds (the $3d$ orbitals are still empty and unreached); in copper the $4s^1$ is the leftover after one $4s$ electron was promoted INTO $3d$ to complete a stable $3d^{10}$',
        'Copper reached $4s^1$ first, and potassium copied it',
        'Both atoms lost a $4s$ electron to form ions',
      ],
      correct_index: 1,
      reveal: 'Potassium ($Z=19$) is $[\\text{Ar}]\\,4s^1$ — the $4s^1$ is simply the 19th electron, dropped into the lowest free seat by normal Aufbau filling; its $3d$ orbitals are completely empty and have not even been started. Copper ($Z=29$) is $[\\text{Ar}]\\,3d^{10}\\,4s^1$ — here the atom has already filled $3d$ and then *promoted* one of its two $4s$ electrons into $3d$ to complete the extra-stable $3d^{10}$, leaving just one electron behind in $4s$. Same-looking ending, opposite stories: one is a starting point, the other is the result of an electron jumping for stability.',
    },

    // ── 7 ── exam_tip callout — JEE/NEET points
    {
      id: uuidv4(), type: 'callout', order: n(),
      variant: 'exam_tip',
      title: 'JEE / NEET — Stability & Exceptions',
      markdown: [
        '**Memorise the two anomalies cold:**\n',
        '- $\\text{Cr} = [\\text{Ar}]\\,3d^5\\,4s^1$ (half-filled $d$)\n',
        '- $\\text{Cu} = [\\text{Ar}]\\,3d^{10}\\,4s^1$ (fully-filled $d$)\n\n',
        '**Key facts examiners love:**\n',
        '- Extra stability comes from **(a) symmetrical electron distribution** and **(b) exchange energy** — exchange energy is the *more important* of the two.\n',
        '- Exchange energy is maximised when a sub-shell is exactly half-filled (most parallel-spin electrons → most possible swaps).\n',
        '- These are the **only two** exceptions for $Z \\le 36$ — do not invent others.\n\n',
        '**Common trap:** asked for Cr³⁺ or Cu²⁺? Remember to remove the **$4s$ electron(s) first**, then $3d$. So Cr³⁺ = $[\\text{Ar}]\\,3d^3$ and Cu²⁺ = $[\\text{Ar}]\\,3d^9$.',
      ].join(''),
    },

    // ── 8 ── inline_quiz — exceptions + stability reasoning (3 Qs)
    {
      id: uuidv4(), type: 'inline_quiz', order: n(),
      pass_threshold: 0.6,
      questions: [
        {
          id: uuidv4(),
          question: 'What is the correct ground-state electronic configuration of chromium (Z = 24)?',
          options: [
            '$[\\text{Ar}]\\,3d^4\\,4s^2$',
            '$[\\text{Ar}]\\,3d^5\\,4s^1$',
            '$[\\text{Ar}]\\,3d^6$',
            '$[\\text{Ar}]\\,3d^3\\,4s^2\\,4p^1$',
          ],
          correct_index: 1,
          explanation: 'Chromium promotes one $4s$ electron into $3d$ to reach a half-filled $3d^5\\,4s^1$. The half-filled $d$ sub-shell gains extra stability from symmetry and (mainly) exchange energy, which outweighs the small promotion cost.',
        },
        {
          id: uuidv4(),
          question: 'Which factor is the MORE important reason that half-filled and completely-filled sub-shells are extra stable?',
          options: [
            'Symmetrical distribution of electrons',
            'Exchange energy',
            'The Pauli exclusion principle',
            'Lower nuclear charge',
          ],
          correct_index: 1,
          explanation: 'Both symmetry and exchange energy contribute, but **exchange energy** is the dominant factor. It is released each time two same-spin electrons in different orbitals of a sub-shell swap places — and a half-filled sub-shell has the maximum number of such parallel-spin swaps.',
        },
        {
          id: uuidv4(),
          question: 'Copper is $[\\text{Ar}]\\,3d^{10}\\,4s^1$. What is the configuration of the Cu²⁺ ion?',
          options: [
            '$[\\text{Ar}]\\,3d^{10}$',
            '$[\\text{Ar}]\\,3d^9$',
            '$[\\text{Ar}]\\,3d^8\\,4s^1$',
            '$[\\text{Ar}]\\,3d^{10}\\,4s^{-1}$',
          ],
          correct_index: 1,
          explanation: 'Remove the $4s$ electron FIRST (the outermost, highest-$n$ electron), then one $3d$ electron. Cu = $3d^{10}\\,4s^1$ → remove the single $4s$ electron and one $3d$ electron → Cu²⁺ = $[\\text{Ar}]\\,3d^9$.',
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
    console.log('\nBlock map (p15):');
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
        summary: 'Fill empty p15 shell — sub-shell stability (Cr/Cu anomalies, symmetry + exchange energy, comparison card, K vs Cu reasoning, exam tip, quiz)',
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
