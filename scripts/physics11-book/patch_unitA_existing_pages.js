'use strict';
/**
 * Unit A finishing patches to the two already-built pages that the founder's
 * framework widened.
 *
 *   p3  Rearranging Formulas  →  "Rearranging and Solving Equations"
 *       + a simultaneous-linear-equations section (framework item 2)
 *
 *   p9  Trigonometry for Physics  →  "Trigonometric Ratios and Standard Values"
 *       + cosec/sec/cot, the 37°/53° rows, the CAST rule and the reduction
 *         formulas (framework items 4.2/4.3). The old "Degrees and radians"
 *         section is REWRITTEN IN PLACE (not deleted) into the CAST section,
 *         because degrees vs radians now has its own page at p8.
 *
 * Purely additive in block count — no block is dropped, so the content-loss
 * guard stays satisfied without an override.
 *
 * Run:  node scripts/physics11-book/patch_unitA_existing_pages.js [--dry]
 */
const { savePage, withDb, computeReadingTime, computeContentTypes } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const dryRun = process.argv.includes('--dry');
const b = (type, extra) => ({ id: uuidv4(), type, order: 0, ...extra });
const q = (question, options, correct_index, explanation, difficulty_level) => ({
  id: uuidv4(), question, options, correct_index, explanation, difficulty_level,
});

// ── p3: the new simultaneous-equations section, spliced before the quiz ───────
const SIMULTANEOUS = [
  b('heading', {
    text: 'Two unknowns, two equations',
    level: 2,
    objective: 'Solve a pair of linear equations by substitution or elimination, and know which to reach for.',
  }),
  b('text', {
    markdown:
      'Sometimes one equation is not enough. If a question has **two** unknowns, you need **two** independent equations — and physics hands them to you all the time.\n\n' +
      'Two blocks connected by a string give you one equation per block, with the tension and the acceleration both unknown. Two bodies meeting give you one position equation each. The pattern is everywhere.\n\n' +
      'There are two standard ways out, and picking the right one saves real time.',
  }),
  b('table', {
    caption: 'Both methods always work. Choosing well is the difference between two lines and eight.',
    headers: ['Method', 'How it goes', 'Reach for it when'],
    rows: [
      ['**Substitution**', 'Make one letter the subject in one equation, then put that expression into the other', 'One equation already has a lonely letter, like $ x - y = 1 $'],
      ['**Elimination**', 'Add or subtract the two equations so one letter cancels', 'The same letter has a matching coefficient, or can be made to match'],
    ],
  }),
  b('worked_example', {
    label: 'Example 4',
    variant: 'solved_example',
    reveal_mode: 'tap_to_reveal',
    problem: 'Solve $ 3x + 2y = 16 $ and $ x - y = 2 $.',
    solution:
      'The second equation has a lonely $ x $, so substitution is quickest.\n\n' +
      'From the second: $ x = y + 2 $.\n\n' +
      'Put that into the first:\n\n' +
      '$ 3(y + 2) + 2y = 16 $\n\n' +
      '$ 3y + 6 + 2y = 16 \\;\\Rightarrow\\; 5y = 10 \\;\\Rightarrow\\; y = 2 $\n\n' +
      'And then $ x = y + 2 = 4 $.\n\n' +
      '**Check in the equation you did not use for the substitution:** $ 3(4) + 2(2) = 12 + 4 = 16 $. Correct.\n\n' +
      'That check costs five seconds and catches almost every arithmetic slip. Make it a habit.',
  }),
  b('worked_example', {
    label: 'Example 5',
    variant: 'solved_example',
    reveal_mode: 'tap_to_reveal',
    problem: 'Two blocks joined by a string give the equations $ T - 20 = 2a $ and $ 50 - T = 5a $. Find the tension $ T $ and the acceleration $ a $.',
    solution:
      'Look at the two equations before doing anything. $ T $ appears as $ +T $ in one and $ -T $ in the other — so simply **adding** them kills it. That is elimination at its cleanest.\n\n' +
      '$ (T - 20) + (50 - T) = 2a + 5a $\n\n' +
      '$ 30 = 7a \\;\\Rightarrow\\; a = \\dfrac{30}{7} \\approx 4.3\\ \\mathrm{m/s^2} $\n\n' +
      'Now put $ a $ back into either equation. Using the first:\n\n' +
      '$ T = 20 + 2a = 20 + \\dfrac{60}{7} \\approx 28.6\\ \\mathrm{N} $\n\n' +
      'This exact pair of equations will reappear in Laws of Motion, many times. The physics there will be new; the algebra will be this.',
  }),
  b('callout', {
    variant: 'exam_tip',
    title: 'Add or subtract? Look at the signs first',
    markdown:
      'If a letter appears with **opposite** signs in the two equations, **add** them — it cancels.\n\n' +
      'If it appears with the **same** sign, **subtract** them.\n\n' +
      'Spending three seconds on that decision routinely saves half a page of working.',
  }),
];

// ── p9: rewritten CAST section + appended reduction table & example ───────────
const P9_HEADING_CAST = {
  text: 'The CAST rule — which ratios are positive where',
  level: 2,
  objective: 'Give the correct sign to any trigonometric ratio without a calculator.',
};

const P9_TEXT_CAST = {
  markdown:
    'Beyond 90°, the ratios start going negative — and knowing *which* ones is worth easy marks.\n\n' +
    'Split the circle into four quadrants and remember one word: **CAST**, read anticlockwise starting from the bottom-right.\n\n' +
    '- **1st quadrant (0°–90°): All** positive\n' +
    '- **2nd quadrant (90°–180°): Sine** positive (and cosec), the rest negative\n' +
    '- **3rd quadrant (180°–270°): Tangent** positive (and cot), the rest negative\n' +
    '- **4th quadrant (270°–360°): Cosine** positive (and sec), the rest negative\n\n' +
    'So $ \\sin 150° $ is positive, $ \\cos 210° $ is negative, and $ \\tan 210° $ is positive.\n\n' +
    'And for a negative angle, just turn the other way: $ \\cos(-\\theta) = \\cos\\theta $, while $ \\sin(-\\theta) = -\\sin\\theta $ and $ \\tan(-\\theta) = -\\tan\\theta $.',
};

const P9_APPEND = [
  b('heading', {
    text: 'Reducing any angle to an acute one',
    level: 2,
    objective: 'Evaluate ratios of angles beyond 90° using the two reduction rules.',
  }),
  b('text', {
    markdown:
      'Every angle can be brought back to something in your standard table. There are only two rules, and the choice between them depends on what you write the angle as.\n\n' +
      '**Rule 1 — around $ 180° $ or $ 360° $ (that is, $ n\\pi \\pm \\theta $): the function stays the same.** Only the sign may change, and CAST tells you the sign.\n\n' +
      '**Rule 2 — around $ 90° $ or $ 270° $ (that is, $ (2n+1)\\dfrac{\\pi}{2} \\pm \\theta $): the function switches to its co-function.** Sine becomes cosine, tangent becomes cotangent, and so on. Again CAST fixes the sign.\n\n' +
      'In practice, always try to write the angle using 180° or 360° — then the function never changes and you only have to get the sign right.',
  }),
  b('table', {
    caption: 'Worked through with the two rules. Cover the right-hand column and try them yourself.',
    headers: ['Expression', 'Written as', 'Becomes'],
    rows: [
      ['$ \\sin 150° $', '$ \\sin(180° - 30°) $', '$ +\\sin 30° = \\dfrac{1}{2} $ · 2nd quadrant, sine positive'],
      ['$ \\cos 120° $', '$ \\cos(180° - 60°) $', '$ -\\cos 60° = -\\dfrac{1}{2} $ · 2nd quadrant, cosine negative'],
      ['$ \\tan 210° $', '$ \\tan(180° + 30°) $', '$ +\\tan 30° = \\dfrac{1}{\\sqrt{3}} $ · 3rd quadrant, tangent positive'],
      ['$ \\sin 300° $', '$ \\sin(360° - 60°) $', '$ -\\sin 60° = -\\dfrac{\\sqrt{3}}{2} $ · 4th quadrant, sine negative'],
      ['$ \\cos(-60°) $', '$ \\cos 60° $', '$ +\\dfrac{1}{2} $ · cosine ignores the sign of the angle'],
    ],
  }),
  b('worked_example', {
    label: 'Example 2',
    variant: 'solved_example',
    reveal_mode: 'tap_to_reveal',
    problem: 'Find the values of (i) $ \\cos(-60°) $  (ii) $ \\tan 210° $  (iii) $ \\sin 300° $  (iv) $ \\cos 120° $.',
    solution:
      'Take them one at a time. For each: rewrite the angle around 180° or 360°, keep the function, then fix the sign with CAST.\n\n' +
      '**(i) $ \\cos(-60°) $** — a negative angle just means measured clockwise. Cosine is unaffected by that:\n\n' +
      '$ \\cos(-60°) = \\cos 60° = \\dfrac{1}{2} $\n\n' +
      '**(ii) $ \\tan 210° $** — write it as $ 180° + 30° $. That is the third quadrant, where tangent is positive:\n\n' +
      '$ \\tan 210° = +\\tan 30° = \\dfrac{1}{\\sqrt{3}} $\n\n' +
      '**(iii) $ \\sin 300° $** — write it as $ 360° - 60° $. Fourth quadrant, where sine is negative:\n\n' +
      '$ \\sin 300° = -\\sin 60° = -\\dfrac{\\sqrt{3}}{2} $\n\n' +
      '**(iv) $ \\cos 120° $** — write it as $ 180° - 60° $. Second quadrant, where cosine is negative:\n\n' +
      '$ \\cos 120° = -\\cos 60° = -\\dfrac{1}{2} $\n\n' +
      'Watch-out: the single commonest error is getting the *value* right and the *sign* wrong. Decide the quadrant before you write anything down.',
  }),
  b('callout', {
    variant: 'remember',
    title: 'The 3-4-5 angles are worth real marks',
    markdown:
      'Alongside 30°, 45° and 60°, mechanics leans constantly on the 3-4-5 right triangle:\n\n' +
      '$ \\sin 37° = \\dfrac{3}{5} = 0.6 \\qquad \\cos 37° = \\dfrac{4}{5} = 0.8 \\qquad \\tan 37° = \\dfrac{3}{4} $\n\n' +
      '$ \\sin 53° = \\dfrac{4}{5} = 0.8 \\qquad \\cos 53° = \\dfrac{3}{5} = 0.6 \\qquad \\tan 53° = \\dfrac{4}{3} $\n\n' +
      'These are not in the NCERT table, but question-setters use them constantly precisely because they give clean numbers. If a problem mentions 37° or 53°, it is telling you a 3-4-5 triangle is hiding in the diagram.',
  }),
];

withDb(async (db) => {
  const pages = db.collection('book_pages');

  // ── p3 ─────────────────────────────────────────────────────────────────────
  const p3 = await pages.findOne({ slug: 'rearranging-formulas' });
  if (!p3) throw new Error('rearranging-formulas not found');
  if (p3.blocks.some((x) => x.type === 'heading' && /Two unknowns/.test(x.text || ''))) {
    console.log('  p3 already patched — skipping');
  } else {
    const keep = [...p3.blocks].sort((a, c) => a.order - c.order);
    const quizIdx = keep.findIndex((x) => x.type === 'inline_quiz');
    const head = keep.slice(0, quizIdx);
    const tail = keep.slice(quizIdx);
    const merged = [...head, ...SIMULTANEOUS, ...tail].map((blk, i) => ({ ...blk, order: i }));
    const res = await savePage(db, { slug: p3.slug }, merged, {
      author: 'unitA-patch', summary: 'Add simultaneous linear equations section', dryRun,
      extraSet: {
        title: 'Rearranging and Solving Equations',
        subtitle: 'Getting the letter you want on its own — and handling two at once',
        reading_time_min: computeReadingTime(merged),
        content_types: computeContentTypes(merged),
      },
    });
    console.log(`  p3: ${dryRun ? (res.wouldBlock ? '!! WOULD BLOCK ' + JSON.stringify(res.diff.reasons) : 'ok') : 'saved'} (${p3.blocks.length} → ${merged.length} blocks)`);
  }

  // ── p9 ─────────────────────────────────────────────────────────────────────
  const p9 = await pages.findOne({ slug: 'trigonometry-for-physics' });
  if (!p9) throw new Error('trigonometry-for-physics not found');
  if (p9.blocks.some((x) => x.type === 'heading' && /CAST/.test(x.text || ''))) {
    console.log('  p9 already patched — skipping');
  } else {
    const keep = [...p9.blocks].sort((a, c) => a.order - c.order);

    // Rewrite the old degrees/radians pair IN PLACE (that topic now owns p8).
    const hIdx = keep.findIndex((x) => x.type === 'heading' && /Degrees and radians/i.test(x.text || ''));
    if (hIdx < 0) throw new Error('p9: expected "Degrees and radians" heading — inspect before patching');
    keep[hIdx] = { ...keep[hIdx], ...P9_HEADING_CAST };
    keep[hIdx + 1] = { ...keep[hIdx + 1], ...P9_TEXT_CAST };

    // Widen the six-ratio definition and the standard-value table.
    const ratioHead = keep.findIndex((x) => x.type === 'heading' && /three ratios/i.test(x.text || ''));
    if (ratioHead >= 0) {
      keep[ratioHead] = { ...keep[ratioHead], text: 'The six ratios' };
      keep[ratioHead + 1] = {
        ...keep[ratioHead + 1],
        markdown:
          (keep[ratioHead + 1].markdown || '') +
          '\n\nThree more ratios are simply these turned upside down, and differentiation uses them constantly:\n\n' +
          '$ \\mathrm{cosec}\\,\\theta = \\dfrac{1}{\\sin\\theta} \\qquad \\sec\\theta = \\dfrac{1}{\\cos\\theta} \\qquad \\cot\\theta = \\dfrac{1}{\\tan\\theta} $\n\n' +
          'Note the pairing, because it is not the obvious one: **sec** goes with **cos**, and **cosec** goes with **sin**.',
      };
    }
    // The standard-value table is ANGLES-AS-COLUMNS (headers: θ, 0°, 30°, 45°,
    // 60°, 90°), so 37° and 53° go in as new columns, not new rows.
    const tbl = keep.find((x) => x.type === 'table');
    if (tbl && Array.isArray(tbl.headers) && !tbl.headers.some((h) => String(h).includes('37'))) {
      const idx = keep.indexOf(tbl);
      const col30 = tbl.headers.findIndex((h) => String(h).includes('30'));
      const col45 = tbl.headers.findIndex((h) => String(h).includes('45'));
      if (col30 < 0 || col45 < 0) throw new Error('p9 table: expected 30° and 45° columns — inspect before patching');
      // Splice 37° right after 30°, then 53° right after 45° (whose index has
      // shifted by one because of the first insert).
      const splice2 = (arr, a, bVal) => {
        const out = [...arr];
        out.splice(col30 + 1, 0, a);
        out.splice(col45 + 2, 0, bVal);
        return out;
      };
      const headers = splice2(tbl.headers, '37°', '53°');
      const byRatio = { 'sin': ['0.6', '0.8'], 'cos': ['0.8', '0.6'], 'tan': ['0.75', '1.33'] };
      const rows = tbl.rows.map((r) => {
        const key = Object.keys(byRatio).find((k) => String(r[0]).toLowerCase().includes(k));
        if (!key) throw new Error(`p9 table: unrecognised row label "${r[0]}"`);
        return splice2(r, byRatio[key][0], byRatio[key][1]);
      });
      keep[idx] = {
        ...tbl, headers, rows,
        caption: (tbl.caption || '') + ' The 37° and 53° columns come from the 3-4-5 triangle and appear constantly in mechanics.',
      };
    }

    const merged = [...keep, ...P9_APPEND].map((blk, i) => ({ ...blk, order: i }));
    const res = await savePage(db, { slug: p9.slug }, merged, {
      author: 'unitA-patch', summary: 'Six ratios, 37/53 values, CAST rule, reduction formulas', dryRun,
      extraSet: {
        title: 'Trigonometric Ratios and Standard Values',
        subtitle: 'The table you must know cold, and how to handle any angle',
        reading_time_min: computeReadingTime(merged),
        content_types: computeContentTypes(merged),
      },
    });
    console.log(`  p9: ${dryRun ? (res.wouldBlock ? '!! WOULD BLOCK ' + JSON.stringify(res.diff.reasons) : 'ok') : 'saved'} (${p9.blocks.length} → ${merged.length} blocks)`);
  }
}).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
