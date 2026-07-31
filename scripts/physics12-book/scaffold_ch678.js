'use strict';
/**
 * Scaffold chapters 6-8 of the Class 12 Physics Live Book — Electromagnetic
 * Induction, Alternating Current, Electromagnetic Waves — and each chapter's
 * opener page (§15.1).
 *
 * Same shape as scaffold.js (which did chapters 1-5); kept as a separate file
 * so re-running it cannot touch the five reviewed chapters.
 *
 * Plan: _agents/plans/PHYSICS12_EMI_AC_EMWAVES_PLAN.md
 *
 * Idempotent — safe to re-run. Everything unpublished.
 *
 * Run: node scripts/physics12-book/scaffold_ch678.js
 */
const { CHAPTERS, b, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

const OPENERS = {
  6: {
    subtitle:
      'For five chapters a current has needed a battery. Then Faraday moved a magnet near a coil of wire — '
      + 'no battery anywhere — and the needle jumped. Everything that generates electricity starts here.',
    hero:
      'Wide cinematic 21:9 hero, near-black background (#0B0C0F). A bar magnet at left with warm amber and '
      + 'cool blue ends, mid-motion toward a coil of thin glowing orange wire at centre, with faint motion '
      + 'streaks behind it. Dim orange flux lines thread through the coil loops. A soft amber glow in the '
      + 'wire suggests induced current. No text, no labels. Dark, premium, scientific.',
    outcomes: [
      'Compute magnetic flux, and name which of the three ways it is changing',
      'Get the direction of an induced current right, every time, using Lenz\'s law as a method',
      'Derive motional EMF two independent ways — and see why they must agree',
      'Handle self and mutual inductance, and the energy an inductor stores',
      'Read an L-R circuit as the exact mirror of the C-R circuit from Chapter 2',
    ],
  },
  7: {
    subtitle:
      'The generator you just built does not make a steady current — it makes one that reverses fifty times '
      + 'a second. Every rule you learned for steady current now needs re-deriving. This is that rebuild.',
    hero:
      'Wide cinematic 21:9 hero, near-black background (#0B0C0F). A smooth amber sine wave sweeping across '
      + 'the frame, with a second cool-blue sine wave shifted a quarter-cycle behind it. At left, a faint '
      + 'rotating vector diagram — two arrows at right angles on a dim circle — showing where the waves come '
      + 'from. Thin circuit symbols for a coil and a capacitor suggested at the edges. No text, no labels. '
      + 'Dark, premium, scientific.',
    outcomes: [
      'Explain why the average of an AC current is zero but its RMS value is not',
      'Use phasors to turn a calculus problem into a triangle',
      'Say what an inductor and a capacitor each do to the phase, and why neither dissipates power',
      'Find impedance, phase angle and the resonant frequency of a series LCR circuit',
      'Work out a power factor — and why the grid runs on transformers',
    ],
  },
  8: {
    subtitle:
      'Ampere\'s law, which you have used since Chapter 5, is wrong. Not slightly — it contradicts itself for '
      + 'a charging capacitor. Fixing it produces a wave that travels at the speed of light. Nobody put that in.',
    hero:
      'Wide cinematic 21:9 hero, near-black background (#0B0C0F). A wave travelling left to right: an amber '
      + 'sinusoid oscillating vertically and a cool-blue sinusoid oscillating horizontally, exactly in phase '
      + 'and at right angles, sharing a common dim axis arrow. Behind them a faint band of graded colour from '
      + 'deep red to violet suggesting the spectrum. No text, no labels. Dark, premium, scientific.',
    outcomes: [
      'Say exactly where Ampere\'s law breaks, and what displacement current repairs',
      'State Maxwell\'s four equations, and point to the chapter each one came from',
      'Show that the speed of an electromagnetic wave is fixed by two benchtop constants',
      'Work with the energy, intensity, momentum and radiation pressure of a wave',
      'Place any wavelength on the spectrum, and name what makes it and what it does',
    ],
  },
};

async function main() {
  await withDb(async (db) => {
    for (const n of [6, 7, 8]) {
      const CH = CHAPTERS[n];
      console.log(`\n── Chapter ${n}: ${CH.title} ──`);
      const bookId = await ensureBookAndChapter(db, n);
      const o = OPENERS[n];
      await upsertPages(db, bookId, n, [{
        page_number: 0,
        slug: `chapter-${n}-overview`,
        title: CH.title,
        subtitle: o.subtitle,
        page_type: 'chapter_opener',
        blocks: [
          b('image', 0, {
            src: '', alt: `${CH.title} — chapter opener`,
            width: 'full', aspect_ratio: '21:9',
            generation_prompt: o.hero,
          }),
          b('text', 1, { markdown: o.outcomes.map((s) => `- ${s}`).join('\n') }),
        ],
      }]);
    }
  });
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
