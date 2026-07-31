'use strict';
/**
 * Scaffold the Class 12 Physics Live Book: create the book, all five
 * electromagnetism chapters (Crucible-taxonomy titles + crucible_chapter_id),
 * and each chapter's opener page (§15.1).
 *
 * Idempotent — safe to re-run. Everything unpublished.
 *
 * Run: node scripts/physics12-book/scaffold.js
 */
const { CHAPTERS, b, ensureBookAndChapter, upsertPages, withDb } = require('./_book');

/**
 * Chapter openers. Author supplies only: hero image (placeholder + prompt),
 * the "why this chapter matters" subtitle, and the "What you'll master"
 * bullets. The journey map, per-page badges, totals and reading time are all
 * derived by the reader from the chapter's pages — never hand-maintained.
 */
const OPENERS = {
  1: {
    subtitle:
      'Rub a balloon on your sleeve and it sticks to a wall. That is the same force that holds every atom '
      + 'in your body together. This chapter is about learning to calculate it.',
    hero:
      'Wide cinematic 21:9 hero, near-black background (#0B0C0F). A single glowing amber sphere at left, '
      + 'radiating fine orange field lines that curve outward across the frame and bend sharply around a '
      + 'smaller cool-blue sphere at right. Faint dashed circular equipotential rings in dim grey. '
      + 'No text, no labels. Dark, premium, scientific — like a physics visualisation, not a clipart diagram.',
    outcomes: [
      'Work out the force between any set of point charges, in any medium',
      'Draw and read electric field lines, and find the point where the field vanishes',
      'Handle a dipole — its field, the torque on it, and its energy',
      'Use Gauss\'s law to get a field in one line where an integral would take a page',
      'Say exactly what happens to the field inside a conductor, and why',
    ],
  },
  2: {
    subtitle:
      'A camera flash stores energy for an hour and releases it in a millisecond. Nothing was created — '
      + 'charge was just moved uphill and allowed to fall back. This chapter is that story, told in energy.',
    hero:
      'Wide cinematic 21:9 hero, near-black background (#0B0C0F). Two parallel metal plates seen edge-on, '
      + 'one warm amber and one cool blue, with straight orange field lines running between them and a '
      + 'translucent slab partly slid in between. Soft glow at the plate edges. Faint stacked equipotential '
      + 'planes in dim grey. No text, no labels. Dark, premium, scientific.',
    outcomes: [
      'Move from force to energy — and see why potential is easier to work with than field',
      'Read equipotential surfaces, and get the field back out of them',
      'Explain what a conductor does to a field, and why a car is safe in lightning',
      'Find the equivalent capacitance of a network by looking at what is shared',
      'Say what changes and what does not when a dielectric slides in — battery on, and battery off',
    ],
  },
  3: {
    subtitle:
      'Flick a switch and the bulb lights instantly — yet the electrons inside the wire crawl slower than '
      + 'an ant. Both facts are true. This chapter shows you why.',
    hero:
      'Wide cinematic 21:9 hero, near-black background (#0B0C0F). A glowing amber circuit loop drawn as '
      + 'clean thin lines across the frame — a cell, a resistor rendered as a warm zigzag, and a junction '
      + 'where the current splits into two branches of different brightness. Tiny drifting blue points along '
      + 'the wire suggesting slow electron motion. No text, no labels. Dark, premium, scientific.',
    outcomes: [
      'Connect current, drift velocity and current density — and resolve the "instant light" puzzle',
      'Predict how resistance changes when a wire is stretched, or heated',
      'Tell EMF from terminal voltage, and use internal resistance correctly',
      'Redraw an unfamiliar circuit into one you recognise, then solve it with Kirchhoff',
      'Explain why a potentiometer measures EMF when a voltmeter cannot',
    ],
  },
  4: {
    subtitle:
      'Break a magnet in half and you do not get a north piece and a south piece — you get two smaller '
      + 'magnets. That stubborn fact is where this chapter starts, and where it ends up is inside the iron.',
    hero:
      'Wide cinematic 21:9 hero, near-black background (#0B0C0F). A bar magnet at centre-left with warm '
      + 'amber and cool blue ends, wrapped in smooth closed field-line loops in dim orange that run right '
      + 'across the frame. At right, a faint translucent globe with its own tilted dipole field, suggesting '
      + 'the Earth. No text, no labels. Dark, premium, scientific.',
    outcomes: [
      'Use the magnetic dipole moment exactly as you used the electric one',
      'Find the axial and equatorial field of a bar magnet, and the torque on it',
      'Work with declination, dip and the horizontal component of the Earth\'s field',
      'Separate the three H\'s — magnetising field, magnetisation and magnetic field',
      'Tell diamagnetic, paramagnetic and ferromagnetic apart by behaviour, not by memory',
    ],
  },
  5: {
    subtitle:
      'Oersted put a compass near a wire, switched on the current, and the needle turned. Electricity and '
      + 'magnetism stopped being two subjects that afternoon. This chapter is what followed.',
    hero:
      'Wide cinematic 21:9 hero, near-black background (#0B0C0F). A straight glowing amber wire running '
      + 'diagonally, encircled by concentric dim-orange rings of magnetic field. A cool-blue charged particle '
      + 'traces a bright helical path around one region. At the edge, a tightly wound coil suggested in thin '
      + 'warm lines. No text, no labels. Dark, premium, scientific.',
    outcomes: [
      'Get the direction of a magnetic force right every time, for either sign of charge',
      'Predict whether a particle goes straight, circles, or spirals — and find the pitch',
      'Compute the force on a wire, and between two wires',
      'Build a field from Biot-Savart for wires, arcs and loops',
      'Use Ampere\'s law where symmetry allows, and read a galvanometer as a dipole in a field',
    ],
  },
};

async function main() {
  await withDb(async (db) => {
    for (const n of [1, 2, 3, 4, 5]) {
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
