// Applies two reviewed fixes to Class 12 Electrochemistry, via the sanctioned
// book-writer gateway (versioned snapshot + content-loss guard + audit).
//   1. p22 — relabel the two water half-reactions as REDUCTION potentials
//      (fixes the +0.82 V "oxidation" mislabel that clashed with p24), and the
//      matching JEE-insight callout line.
//   2. p9  — quiz-hygiene SAMPLE: rebalance correct-answer positions to A/B/C/D,
//      break the length-tell on Q3, and add difficulty tags to all 4 questions.
// Edits are made by block/question id on the live document; no block or asset is
// removed. Run with `--apply` to write; default is a dry-run preview.
const bw = require('../lib/book-writer');

const APPLY = process.argv.includes('--apply');

// helper: assert a condition or throw (never silently mis-edit)
const must = (cond, msg) => { if (!cond) throw new Error('SAFETY: ' + msg); };

(async () => {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');

    // ─────────────────────────────────────────────────────────── p22 (F4) ───
    {
      const p = await pages.findOne({ slug: 'predicting-products-molten-salts-and-water' });
      must(p, 'p22 not found');
      const blocks = JSON.parse(JSON.stringify(p.blocks));

      const latex = blocks.find((b) => b.type === 'latex_block' && /two water half-reactions/i.test(b.label || ''));
      must(latex && /\+0\.82/.test(latex.latex), 'p22 water-half-reactions latex_block not found / already changed');
      console.log('\n[p22] latex BEFORE:\n ', latex.latex);
      latex.latex =
        '\\begin{aligned} ' +
        '\\text{Reduction of oxygen:} \\quad & \\ce{O2 + 4H+ + 4e- -> 2H2O} && E = +0.82\\text{ V} \\\\ ' +
        '\\text{Reduction of water:} \\quad & \\ce{2H2O + 2e- -> H2 + 2OH-} && E = -0.42\\text{ V} ' +
        '\\end{aligned}';
      latex.note =
        'Both are reduction potentials at pH 7, so they slot straight into the electrochemical series. ' +
        'The standard (1 M) values are +1.23 V for the oxygen couple and −0.83 V for water reduction.';
      console.log('[p22] latex AFTER:\n ', latex.latex);

      const callout = blocks.find((b) => b.type === 'callout' && /Aqueous salt:.*water competes/s.test(b.markdown || ''));
      must(callout, 'p22 aqueous-salt callout not found');
      const oldLine = 'memorise its half-reactions: reduction $E = -0.42$ V, oxidation $E = +0.82$ V (at pH 7).';
      const newLine = 'memorise its reduction potentials: the $\\ce{O2}$/$\\ce{H2O}$ couple $+0.82$ V and $\\ce{H2O}$/$\\ce{H2}$ $-0.42$ V (at pH 7).';
      must(callout.markdown.includes(oldLine), 'p22 callout target line not found (already changed?)');
      callout.markdown = callout.markdown.replace(oldLine, newLine);
      console.log('[p22] callout line updated to reduction-potential wording.');

      console.log('\n[p22] dry-run guard:', JSON.stringify((await bw.savePage(db, { slug: p.slug }, blocks, { dryRun: true })).diff.reasons));
      if (APPLY) {
        const r = await bw.savePage(db, { slug: p.slug }, blocks, {
          author: 'agent:chem-review', summary: 'F4: relabel water half-reactions as reduction potentials (p22↔p24 convention fix)',
        });
        console.log('[p22] SAVED version', r.version);
      }
    }

    // ──────────────────────────────────────────────────────────── p9 (quiz) ─
    {
      const p = await pages.findOne({ slug: 'electrochemical-series-and-its-uses' });
      must(p, 'p9 not found');
      const blocks = JSON.parse(JSON.stringify(p.blocks));
      const quiz = blocks.find((b) => b.type === 'inline_quiz' && Array.isArray(b.questions));
      must(quiz && quiz.questions.length === 4, 'p9 inline_quiz (4 Qs) not found');
      const byId = Object.fromEntries(quiz.questions.map((q) => [q.id, q]));

      // Q0 — strongest reducing agent → correct = Li, move to A (idx 0). No length tell.
      const q0 = byId['565ca803-5be9-4c3e-b09b-...'] || quiz.questions.find((q) => /strongest reducing agent/i.test(q.question));
      must(q0, 'p9 Q0 not found');
      q0.options = ['$\\ce{Li}$ ($E° = -3.05$ V)', '$\\ce{F2}$ ($E° = +2.87$ V)', '$\\ce{Cu^{2+}}$ ($E° = +0.34$ V)', '$\\ce{H2}$ ($E° = 0.00$ V)'];
      q0.correct_index = 0; q0.difficulty_level = 1;

      // Q1 — will NOT displace hydrogen → correct = Cu, move to B (idx 1). No length tell.
      const q1 = quiz.questions.find((q) => /NOT displace hydrogen/i.test(q.question));
      must(q1, 'p9 Q1 not found');
      q1.options = ['Zn ($-0.76$ V)', 'Cu ($+0.34$ V)', 'Fe ($-0.44$ V)', 'Mg ($-2.37$ V)'];
      q1.correct_index = 1; q1.difficulty_level = 2;

      // Q2 — E°cell (Ni anode, Ag cathode) → correct = +1.05, move to C (idx 2). No length tell.
      const q2 = quiz.questions.find((q) => /E°?_?\{?cell/i.test(q.question) || /Ni as anode and Ag/i.test(q.question));
      must(q2, 'p9 Q2 not found');
      q2.options = ['$+0.55$ V', '$-1.05$ V', '$+1.05$ V', '$+0.80$ V'];
      q2.correct_index = 2; q2.difficulty_level = 2;

      // Q3 — storage rule → correct = the reasoning option, move to D (idx 3) AND
      // break the length-tell by padding distractors + trimming the correct one.
      const q3 = quiz.questions.find((q) => /stored safely in a copper vessel/i.test(q.question));
      must(q3, 'p9 Q3 not found');
      q3.options = [
        'Zinc is physically harder and denser than copper, so a zinc container simply resists chemical corrosion far better than a copper one',
        'Zinc lies above copper in the electrochemical series, making it the more noble metal, so it can never be attacked by $\\ce{Cu^{2+}}$ ions',
        'Both salts are equally safe stored in either metal; the real choice is only about cost, weight and how easily the vessel is made',
        'Copper’s SRP is higher, so it can’t displace $\\ce{Zn^{2+}}$; zinc’s is lower, so it displaces $\\ce{Cu^{2+}}$ and corrodes',
      ];
      q3.correct_index = 3; q3.difficulty_level = 3;

      // report new answer-position spread + length check for the sample
      const pos = quiz.questions.map((q) => 'ABCD'[q.correct_index]).join(' ');
      const tell = quiz.questions.map((q) => {
        const lens = q.options.map((o) => o.length);
        const others = lens.filter((_, i) => i !== q.correct_index);
        // flag ONLY if the correct option is the strict unique longest
        return lens[q.correct_index] > Math.max(...others) ? 'LONGEST' : 'ok';
      }).join(' ');
      console.log('\n[p9] new correct positions:', pos, '| length-tell per Q:', tell);
      console.log('[p9] difficulty tags:', quiz.questions.map((q) => q.difficulty_level).join(' '));

      console.log('[p9] dry-run guard:', JSON.stringify((await bw.savePage(db, { slug: p.slug }, blocks, { dryRun: true })).diff.reasons));
      if (APPLY) {
        const r = await bw.savePage(db, { slug: p.slug }, blocks, {
          author: 'agent:chem-review', summary: 'Quiz-hygiene sample: rebalance answer positions A/B/C/D, break length-tell on Q3, add difficulty tags',
        });
        console.log('[p9] SAVED version', r.version);
      }
    }

    console.log(APPLY ? '\n✅ Applied.' : '\n(dry-run only — re-run with --apply to write)');
  });
})().catch((e) => { console.error('\n❌', e.message); process.exit(1); });
