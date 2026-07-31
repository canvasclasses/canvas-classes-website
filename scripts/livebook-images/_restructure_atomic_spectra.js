'use strict';
/**
 * Restructure the "Atomic Spectra and the Hydrogen Spectrum" page (Class 11
 * Chemistry, Ch.2) to the founder-approved narrative sequence, and fix two
 * defects found during the 2026-07-30 content-flow review.
 *
 * SEQUENCE (founder-specified):
 *   classification image → how spectra are classified (TWO axes) → what atomic
 *   spectra are + how a gas discharge tube makes them → line spectrum defined
 *   → emission vs absorption (+ apparatus image, comparison card, reasoning
 *   MCQ) → fingerprint (+ new element-spectra sim) → hydrogen spectrum →
 *   Balmer → Rydberg → calculating wavelengths, series limits and the NUMBER
 *   of spectral lines → callouts → worked examples → quiz.
 *
 * DEFECTS FIXED:
 *   1. Crossed figure/caption. Block 8's text said "Figure below shows the
 *      apparatus and the line spectrum of atomic hydrogen ... mercury and
 *      strontium", but the figure below it is an emission-vs-absorption
 *      apparatus diagram (per its own generation_prompt), and it carried the
 *      hydrogen/mercury/strontium caption. Caption corrected to describe the
 *      figure that is actually there; the stale text reference is gone with
 *      the block-8 rewrite.
 *   2. Wrong Rydberg symbol, 13 occurrences page-wide. 109,677 cm^-1 is R_H
 *      (hydrogen, finite nuclear mass). R_INFINITY is 109,737 cm^-1. The page
 *      told students to memorise "R_infinity = 109,677" in the exam-tip
 *      callout and asked for it in quiz Q2 — while the hydrogen-spectrum-
 *      decoder simulation three blocks below correctly used R_H. Now R_H
 *      throughout, with a one-line note on the distinction.
 *
 * ADDITIONS: continuous-spectrum beat, discharge-tube mechanism, the two
 * orthogonal classification axes, series-limit + number-of-spectral-lines
 * section (+ worked example), the Sun/sodium reasoning MCQ, and the new
 * `element-spectra-lab` simulation on the fingerprint section.
 *
 * No block is dropped: every original block is either kept verbatim, kept with
 * its Rydberg symbol corrected, or (block 8 only) split into the three blocks
 * the founder asked for. Run with --dry to preview the diff.
 */
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('../lib/book-writer');

const PAGE_ID = 'e2f53c0a-b122-45d5-bda8-453beaba41e2';
const DRY = process.argv.includes('--dry');

// R_\infty -> R_H everywhere. 109,677 cm^-1 is the hydrogen value.
const fixRydberg = (s) =>
  typeof s === 'string' ? s.replace(/R_\\infty/g, 'R_H').replace(/R_{\\infty}/g, 'R_H') : s;

function fixBlockRydberg(b) {
  const out = { ...b };
  for (const k of ['markdown', 'text', 'latex', 'title', 'problem', 'solution', 'prompt', 'reveal']) {
    if (typeof out[k] === 'string') out[k] = fixRydberg(out[k]);
  }
  if (Array.isArray(out.questions)) {
    out.questions = out.questions.map((q) => ({
      ...q,
      question: fixRydberg(q.question),
      options: (q.options || []).map(fixRydberg),
      explanation: fixRydberg(q.explanation),
    }));
  }
  if (Array.isArray(out.columns)) {
    out.columns = out.columns.map((c) => ({
      ...c,
      points: (c.points || []).map(fixRydberg),
    }));
  }
  return out;
}

(async () => {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ _id: PAGE_ID });
    if (!page) throw new Error('page not found');
    const B = page.blocks;
    const at = (i) => fixBlockRydberg(B[i]);

    // ── NEW BLOCKS ────────────────────────────────────────────────────────

    // The classification section now names BOTH axes. Students routinely fuse
    // them ("line = emission"), which the old single-axis heading encouraged.
    const classifyHeading = {
      ...B[6],                     // reuse id: this is a RETITLE, not a new block
      order: 0, type: 'heading', level: 2,
      text: 'How Spectra Are Classified',
    };

    const classifyText = {
      id: uuidv4(), order: 0, type: 'text',
      markdown: [
        'Spectra are sorted along **two independent questions**, and mixing them up is the single most common mistake on this topic.',
        '',
        '**1. What does it look like?**',
        '',
        '- A **continuous spectrum** is an unbroken rainbow — every wavelength present, one colour blending into the next. A hot, dense source (the tungsten filament in a bulb, molten iron, the Sun\'s interior) radiates at *all* wavelengths, so nothing is missing.',
        '- A **line spectrum** is a handful of sharp, isolated lines separated by darkness. Only a few specific wavelengths appear.',
        '',
        '**2. What is the light doing?**',
        '',
        '- An **emission spectrum** is light the sample gives out.',
        '- An **absorption spectrum** is what survives after light passes *through* a sample.',
        '',
        'These two questions are answered independently. A tungsten bulb gives a *continuous emission* spectrum. Hydrogen in a discharge tube gives a *line emission* spectrum. The Sun gives a *continuous spectrum crossed by absorption lines*. So "line" does not mean "emission" — keep the two axes separate and every spectrum you meet has a clear address.',
      ].join('\n'),
    };

    // The founder's core gap: the page said "electrically excited gaseous
    // atoms" without ever explaining how the excitation happens.
    const dischargeHeading = {
      id: uuidv4(), order: 0, type: 'heading', level: 2,
      text: 'How an Atomic Spectrum Is Made — The Discharge Tube',
    };

    const dischargeText = {
      id: uuidv4(), order: 0, type: 'text',
      markdown: [
        'To get a spectrum from *atoms* rather than from a hot solid, you need the atoms free and far apart — so the source is a **gas discharge tube**: a sealed glass tube holding a small amount of a gas at **low pressure**, with a metal electrode at each end.',
        '',
        'Here is the chain of events:',
        '',
        '1. A **high voltage** across the electrodes rips a few electrons loose from the gas, and those free electrons are accelerated down the tube.',
        '2. Racing electrons **collide with gas atoms** and transfer energy to them. The atom\'s own electron is knocked from its normal low-energy state up to a higher one — the atom is now **excited**.',
        '3. An excited atom is unstable. Within roughly $10^{-8}$ s the electron **falls back down**, and the energy it loses leaves the atom as a **photon** of light.',
        '4. The tube glows. Passing that glow through a slit and a prism spreads it out into its component wavelengths.',
        '',
        'The **low pressure** matters: the atoms must be far enough apart that each one emits on its own, uninfluenced by its neighbours. Compress the gas and the sharp lines smear into a continuous band — which is exactly why a dense hot solid gives a rainbow and a thin hot gas does not.',
        '',
        'You have already met this apparatus: the same discharge tube that gave us **cathode rays** and the electron. Fill it with hydrogen instead and it becomes a light source that reveals the atom\'s internal structure.',
      ].join('\n'),
    };

    // Block 8 rewritten: now ONLY establishes line/atomic spectra. The stale
    // "figure below shows ... mercury and strontium" reference is dropped
    // (that figure is not on this page — see the header note).
    const lineSpectrumText = {
      id: B[8].id,                 // reuse id: block 8 lives on as this block
      order: 0, type: 'text',
      markdown: [
        'Send sunlight through a prism and you get a rainbow. Send the light from a hydrogen discharge tube through the same prism and you get something startlingly different: **a few sharp bright lines at specific wavelengths, and darkness everywhere else**.',
        '',
        'This is a **line spectrum**. Because it comes from individual atoms, it is also called an **atomic spectrum** — and it is always a line spectrum, never a rainbow. Atomic hydrogen produces four lines in the visible region; mercury, sodium and neon each produce their own distinct set.',
        '',
        'That single observation is the whole puzzle. If an atom could lose *any* amount of energy, it would emit *every* wavelength and we would see a continuous band. Instead it emits only a fixed menu of wavelengths — so it can only lose a fixed menu of energies. The study of these spectra is called **spectroscopy**.',
      ].join('\n'),
    };

    const emAbsHeading = {
      id: uuidv4(), order: 0, type: 'heading', level: 2,
      text: 'Emission and Absorption Spectra',
    };

    const emAbsText = {
      id: uuidv4(), order: 0, type: 'text',
      markdown: [
        'The same atom can produce two spectra that look like opposites — and they carry exactly the same information.',
        '',
        '**Emission spectrum.** Excite the atoms first (discharge, flame, UV), then look at the light they give out. Electrons falling to lower levels release photons, so you see **bright lines on a dark background** — one line for each energy drop the atom is capable of.',
        '',
        '**Absorption spectrum.** Take white light — every wavelength present — and pass it through the *same element as a cool gas*. The atoms absorb precisely the photons whose energies match their own jumps, using them to climb to higher levels. Everything else passes straight through. What emerges is a **full rainbow with dark gaps** where those wavelengths were removed.',
        '',
        'Now the key point: **the dark lines fall at exactly the same wavelengths as the bright ones**. An energy gap that an atom can emit is an energy gap it can absorb — it is the same jump, run in reverse. This is why the absorption spectrum is called the *photographic negative* of the emission spectrum, and why either one identifies the element equally well.',
      ].join('\n'),
    };

    // Reasoning MCQ — forces the student to combine continuous + absorption +
    // fingerprint, and pays off the helium fun-fact at the top of the page.
    const reasoningMCQ = {
      id: uuidv4(), order: 0, type: 'reasoning_prompt',
      reasoning_type: 'logical',
      prompt: [
        "The Sun's spectrum is a continuous rainbow crossed by dark lines, and one pair of those dark lines sits at 589 nm. A sodium street lamp shows *bright* yellow lines at that very same 589 nm, on an otherwise dark background.",
        '',
        'Sodium is responsible in both cases. Why does it show up dark in one and bright in the other?',
      ].join('\n'),
      options: [
        'Sodium in the Sun is far hotter, and hot atoms absorb light while cool atoms emit it',
        "In the Sun, cooler sodium vapour lies in front of a hot source that is already producing every wavelength, so the sodium subtracts 589 nm from the beam reaching us. The street lamp has no background source, so we see only the light the sodium itself emits",
        'The Sun contains sodium ions while the lamp contains neutral sodium atoms, and ions absorb whereas atoms emit',
        "The enormous pressure inside the Sun broadens sodium's lines until they appear dark",
      ],
      correct_index: 1,
      reveal: [
        'What decides bright-or-dark is not the sodium — it is **what is behind the sodium**.',
        '',
        "The Sun's dense interior is a hot continuous source radiating every wavelength. Its cooler outer atmosphere contains sodium vapour, which absorbs 589 nm out of that beam on its way to us — leaving a gap: a **dark line on a bright background**. In the street lamp there is no continuous source behind the vapour, so the only light reaching you is what excited sodium atoms emit: **a bright line on a dark background**.",
        '',
        'Both are the same 589 nm jump, seen against different backgrounds. This is precisely how **Fraunhofer lines** work, and it is how helium was found in the Sun in 1868 — 27 years before anyone isolated it on Earth.',
        '',
        'Why the others fail: temperature does not decide whether an atom absorbs or emits (option a) — a hot atom emits *and* absorbs. Ions and neutral atoms both do both (c). Pressure broadening does widen lines, but widening is not the same as reversing them from bright to dark (d).',
      ].join('\n'),
      difficulty_level: 3,
    };

    // The new fingerprint-section simulation (built in this same pass).
    const elementSim = {
      id: uuidv4(), order: 0, type: 'simulation',
      simulation_id: 'element-spectra-lab',
      title: 'Identify the Unknown Element',
      caption: 'Match an unknown spectrum against reference fingerprints — then flip it to absorption and watch the same lines invert.',
      prediction: {
        prompt: 'An unknown glowing gas shows bright lines at 447, 502, 588 and 668 nm. You have reference spectra for hydrogen, helium, sodium and mercury. How many of those references do you need to check before you can be certain?',
        options: [
          'Just one — the first element whose spectrum has a line near 588 nm',
          'All of them — a match is only certain once every other element has been ruled out at every line',
          'Two — any two elements sharing a line are indistinguishable',
        ],
        reveal_after: 'A single shared line proves nothing: sodium, helium and neon all have lines near 588 nm. Identification requires the *whole pattern* to match and the others to fail somewhere. That is what makes a spectrum a fingerprint rather than just a colour.',
      },
    };

    const calcHeading = {
      id: uuidv4(), order: 0, type: 'heading', level: 2,
      text: 'Calculating Spectral Lines',
    };

    const calcText = {
      id: uuidv4(), order: 0, type: 'text',
      markdown: [
        'Two calculations come up again and again in JEE and NEET. Both fall straight out of the Rydberg formula.',
        '',
        '**1. The wavelength of a given line.** Put $n_1$ (the level the electron lands on, fixed by the series) and $n_2$ (the level it starts from) into the Rydberg formula to get the wavenumber $\\bar{\\nu}$, then invert it for the wavelength: $\\lambda = 1/\\bar{\\nu}$. Remember that $\\bar{\\nu}$ comes out in $\\text{cm}^{-1}$, so $\\lambda$ arrives in **cm** — multiply by $10^7$ for nanometres.',
        '',
        '**2. The series limit.** Every series has a shortest-wavelength line, reached when the electron falls from $n_2 \\to \\infty$. The $1/n_2^2$ term vanishes and the formula collapses to:',
      ].join('\n'),
    };

    const seriesLimitLatex = {
      id: uuidv4(), order: 0, type: 'latex_block',
      latex: '\\bar{\\nu}_{\\text{limit}} = \\frac{R_H}{n_1^2}',
    };

    const seriesLimitText = {
      id: uuidv4(), order: 0, type: 'text',
      markdown: [
        'Beyond that limit the electron is no longer bound to the atom at all, and the discrete lines merge into a **continuum**. The series limit is therefore also the **ionisation energy from level $n_1$**. For the Lyman series ($n_1 = 1$) this gives 91.2 nm; for Balmer ($n_1 = 2$), 364.6 nm.',
        '',
        '**3. How many spectral lines appear?** A single atom makes one jump and emits one photon. But a *sample* contains countless atoms, and excited electrons take every available route down — so a sample excited to level $n$ produces every possible downward transition at once.',
        '',
        'From level $n$ all the way down to the ground state, the number of distinct lines is:',
      ].join('\n'),
    };

    const lineCountLatex = {
      id: uuidv4(), order: 0, type: 'latex_block',
      latex: '\\text{Number of lines} = \\frac{n(n-1)}{2}',
    };

    const lineCountText = {
      id: uuidv4(), order: 0, type: 'text',
      markdown: [
        'So an electron excited to $n = 4$ can produce $\\dfrac{4 \\times 3}{2} = 6$ lines: $4\\!\\to\\!3$, $4\\!\\to\\!2$, $4\\!\\to\\!1$, $3\\!\\to\\!2$, $3\\!\\to\\!1$ and $2\\!\\to\\!1$.',
        '',
        'If the electron falls only from $n_2$ down to $n_1$ (not all the way to the ground state), count only the levels in that window:',
      ].join('\n'),
    };

    const lineCountLatex2 = {
      id: uuidv4(), order: 0, type: 'latex_block',
      latex: '\\text{Number of lines} = \\frac{(n_2 - n_1)(n_2 - n_1 + 1)}{2}',
    };

    const lineCountTrap = {
      id: uuidv4(), order: 0, type: 'callout',
      variant: 'remember',
      title: 'The trap in "number of spectral lines" questions',
      markdown: [
        'Read whether the electron returns **to the ground state** or only **to a stated level**.',
        '',
        '- "An electron in $n = 5$ returns to the ground state" — use $\\dfrac{n(n-1)}{2} = \\dfrac{5 \\times 4}{2} = 10$ lines.',
        '- "An electron falls from $n = 5$ to $n = 2$" — use $\\dfrac{(n_2-n_1)(n_2-n_1+1)}{2} = \\dfrac{3 \\times 4}{2} = 6$ lines.',
        '',
        'Same starting level, different answers. The first formula is just the second one with $n_1 = 1$.',
      ].join('\n'),
    };

    const lineCountExample = {
      id: uuidv4(), order: 0, type: 'worked_example',
      label: 'Example — Counting the Lines Emitted',
      variant: 'solved_example',
      problem: [
        'The electrons in a sample of hydrogen atoms are excited to the $n = 6$ level. When they return to the ground state, the maximum number of spectral lines observed is:',
        '',
        '(a) 6',
        '',
        '(b) 10',
        '',
        '(c) 15',
        '',
        '(d) 21',
      ].join('\n'),
      solution: [
        '**Answer: (c) 15**',
        '',
        'The electron returns all the way to the ground state, so use:',
        '',
        '$$\\text{Number of lines} = \\frac{n(n-1)}{2}$$',
        '',
        'With $n = 6$:',
        '',
        '$$\\frac{6 \\times 5}{2} = 15$$',
        '',
        '**Why it is not 5.** A common mistake is to count only the jumps *from* $n=6$: $6\\!\\to\\!5$, $6\\!\\to\\!4$, $6\\!\\to\\!3$, $6\\!\\to\\!2$, $6\\!\\to\\!1$ — five lines. But the sample holds a huge number of atoms, and an electron that stops at $n=4$ on the way down will jump again from there. Every pair of levels between 1 and 6 contributes a line, and the number of such pairs is $\\binom{6}{2} = 15$.',
        '',
        '**Watch the wording.** Had the question said "falls from $n=6$ to $n=3$", the window would be levels 3 to 6 only, giving $\\dfrac{(6-3)(6-3+1)}{2} = \\dfrac{3 \\times 4}{2} = 6$ lines.',
      ].join('\n'),
      reveal_mode: 'tap_to_reveal',
    };

    // ── Corrected caption on the emission/absorption apparatus figure ──────
    const emAbsImage = {
      ...at(9),
      caption: 'Fig — How the two spectra are produced. (a) Emission: excited atoms give out light, which the prism spreads into bright lines on a dark background. (b) Absorption: white light passes through the same element as a cool gas, which removes those exact wavelengths, leaving dark gaps in the rainbow.',
    };

    // Note appended to the exam-tip callout explaining the R_H vs R_infinity
    // distinction, since the corrected symbol now appears throughout.
    const examTip = at(24);
    examTip.markdown = examTip.markdown.replace(
      '**Rydberg constant value:** $R_H = 109{,}677 \\text{ cm}^{-1}$ — memorise this.',
      '**Rydberg constant value:** $R_H = 109{,}677 \\text{ cm}^{-1}$ — memorise this. (Written $R_H$ because it is the value for *hydrogen*. The related constant $R_\\infty = 109{,}737 \\text{ cm}^{-1}$ assumes an infinitely heavy nucleus; NCERT and every JEE question use the hydrogen value.)'
    );

    // ── Extra quiz question (the two-axes idea) ───────────────────────────
    const quiz = at(31);
    quiz.questions = [
      ...quiz.questions,
      {
        id: uuidv4(),
        question: 'A tungsten filament bulb produces a continuous spectrum. Hydrogen in a discharge tube produces a line spectrum. Both are emission spectra. What does this show?',
        options: [
          'Whether a spectrum is continuous or line-type is decided separately from whether it is an emission or absorption spectrum',
          'Tungsten atoms have more energy levels than hydrogen atoms',
          'A continuous spectrum can only ever be an emission spectrum',
          'The discharge tube produces an absorption spectrum, not an emission spectrum',
        ],
        correct_index: 0,
        explanation:
          'The two classifications are independent axes. Continuous-vs-line describes what the spectrum looks like and depends on the source being a dense solid or a thin gas; emission-vs-absorption describes whether you are seeing light given out or light removed. All four combinations exist — the Sun, for instance, is a continuous spectrum with absorption lines.',
        difficulty_level: 2,
      },
      {
        id: uuidv4(),
        question: 'A sample of hydrogen atoms is excited to the $n = 4$ level. How many distinct spectral lines can be observed as the electrons return to the ground state?',
        options: ['3', '4', '6', '10'],
        correct_index: 2,
        explanation:
          'Use $\\frac{n(n-1)}{2} = \\frac{4 \\times 3}{2} = 6$. The six transitions are $4\\to3$, $4\\to2$, $4\\to1$, $3\\to2$, $3\\to1$ and $2\\to1$. Counting only the jumps starting at $n=4$ gives 3 and is the usual mistake — electrons that stop at an intermediate level jump again from there.',
        difficulty_level: 2,
      },
    ];

    // ── ASSEMBLE ──────────────────────────────────────────────────────────
    let blocks = [
      at(0),               // hero image
      at(1),               // helium fun fact
      at(2),               // prism image
      at(3),               // sodium line spectra image
      at(4),               // audio note
      at(5),               // intro text
      classifyHeading,     // ⟵ retitled from "Two Types of Spectra"
      at(7),               // classification image
      classifyText,        // NEW — the two axes + continuous spectrum
      dischargeHeading,    // NEW
      dischargeText,       // NEW — the founder's core gap
      lineSpectrumText,    // block 8, rewritten to cover ONLY line/atomic spectra
      emAbsHeading,        // NEW
      emAbsImage,          // block 9 with the corrected caption
      emAbsText,           // NEW — emission & absorption, properly separated
      at(10),              // comparison card
      reasoningMCQ,        // NEW — the Sun/sodium reasoning question
      at(11),              // H2 fingerprint
      at(12),              // fingerprint text
      elementSim,          // NEW — element-spectra-lab
      at(13),              // H2 hydrogen spectrum
      at(14),              // energy-level diagram
      at(15),              // H3 Balmer
      at(16),              // Balmer text
      at(17),              // Balmer latex
      at(18),              // Rydberg text
      at(19),              // Rydberg latex
      at(20),              // series table
      at(21),              // n1/n2 callout
      at(22),              // hydrogen-spectrum-decoder sim
      calcHeading,         // NEW
      calcText,            // NEW
      seriesLimitLatex,    // NEW
      seriesLimitText,     // NEW
      lineCountLatex,      // NEW
      lineCountText,       // NEW
      lineCountLatex2,     // NEW
      lineCountTrap,       // NEW
      at(23),              // "why specific lines" callout
      examTip,             // exam tip, with the R_H note
      at(25),              // H2 Worked Examples
      at(26), at(27), at(28), at(29), at(30),
      lineCountExample,    // NEW worked example
      quiz,                // quiz + 2 new questions
    ];
    blocks = blocks.map((b, i) => ({ ...b, order: i }));

    const dry = await bw.savePage(db, { pageId: PAGE_ID }, blocks, { dryRun: true });
    console.log('DRY RUN DIFF:', JSON.stringify(dry.diff, null, 2));
    console.log(`\nblocks: ${B.length} -> ${blocks.length}`);

    if (DRY) { console.log('\n--dry set, nothing written.'); return; }

    await bw.savePage(db, { pageId: PAGE_ID }, blocks, {
      author: 'agent',
      summary:
        'Restructure to founder-approved sequence (classification -> discharge tube -> line spectra -> emission/absorption -> fingerprint -> hydrogen -> Balmer -> Rydberg -> calculations); fix crossed figure caption on the emission/absorption diagram; correct R_infinity -> R_H (13 occurrences); add series-limit + number-of-spectral-lines section, reasoning MCQ, element-spectra-lab sim, 1 worked example and 2 quiz questions.',
    });
    console.log('\nSAVED.');
  });
})().catch((e) => { console.error(e); process.exit(1); });
