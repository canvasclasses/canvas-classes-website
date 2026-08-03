'use strict';
/**
 * Shared scaffold for the Class 12 Physics Live Book — electromagnetism block.
 *
 * Book: "Class 12 Physics" (subject: physics, grade 12, board ncert).
 * Chapters follow the CRUCIBLE PHYSICS TAXONOMY order and titles verbatim
 * (BOOK_PAGE_WORKFLOW §18) — not the source book's order, not NCERT's:
 *
 *   1  Electrostatics                  ph12_electrostatics
 *   2  Capacitance                     ph12_capacitance
 *   3  Current Electricity             ph12_current
 *   4  Magnetic Properties of Matter   ph12_mag_matter
 *   5  Magnetic Effects of Current     ph12_moving_charges
 *
 * Plan: _agents/plans/PHYSICS12_EM_LIVEBOOK_PLAN.md
 *
 * Sources (Rule 0 — every fact, number and exercise is transcribed from these,
 * never generated from memory):
 *   • "Understanding Physics — Electricity and Magnetism" (founder-supplied).
 *     Pedagogy + depth spine. Per the standing no-third-party-attribution rule
 *     it is NEVER named in student-facing text and never used as a source badge;
 *     items adapted from it carry source 'mcq' (no badge).
 *   • NCERT Exemplar Physics Class 12, chapters 1–5. Badged 'ncert_exemplar'.
 *
 * Everything is created UNPUBLISHED. Every write is additive + idempotent
 * (matched by slug); no page is ever hard-deleted (CLAUDE.md §0.6).
 */
const { computeReadingTime, computeContentTypes, withDb } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK = {
  slug: 'class12-physics',
  title: 'Class 12 Physics',
  subject: 'physics',
  grade: 12,
  board: 'ncert',
};

/** Chapter registry — titles are byte-identical to the Crucible taxonomy. */
const CHAPTERS = {
  1: {
    number: 1,
    title: 'Electrostatics',
    slug: 'electrostatics',
    crucible_chapter_id: 'ph12_electrostatics',
    description:
      'Charge is the one property that makes matter push and pull without touching. Coulomb\'s law and '
      + 'superposition, the electric field and its lines, fields from spread-out charge, the dipole, '
      + 'and then flux and Gauss\'s law — the shortcut that turns a hard integral into one line of symmetry.',
  },
  2: {
    number: 2,
    title: 'Capacitance',
    slug: 'capacitance',
    crucible_chapter_id: 'ph12_capacitance',
    description:
      'The same electrostatics, now told with energy instead of force. Potential energy and potential, '
      + 'equipotential surfaces, what a conductor does to a field — and then the device that stores charge '
      + 'on purpose: capacitors, their combinations, dielectrics, the energy in the field, and C-R circuits.',
  },
  3: {
    number: 3,
    title: 'Current Electricity',
    slug: 'current-electricity',
    crucible_chapter_id: 'ph12_current',
    description:
      'Charge on the move. Drift velocity and why a bulb lights instantly, resistance and resistivity, '
      + 'cells and their internal resistance, Kirchhoff\'s two laws and how to read a circuit you have never '
      + 'seen before, heating effects, and the three null-method instruments: bridge, meter bridge, potentiometer.',
  },
  4: {
    number: 4,
    title: 'Magnetic Properties of Matter',
    slug: 'magnetic-properties-of-matter',
    crucible_chapter_id: 'ph12_mag_matter',
    description:
      'Why a magnet is a magnet. Poles that never come alone, the magnetic dipole moment and its exact '
      + 'parallel with the electric dipole, the Earth as one big magnet, and the three ways matter answers '
      + 'a magnetic field — diamagnetic, paramagnetic, ferromagnetic — ending at the hysteresis loop.',
  },
  5: {
    number: 5,
    title: 'Magnetic Effects of Current',
    slug: 'magnetic-effects-of-current',
    crucible_chapter_id: 'ph12_moving_charges',
    description:
      'A current is a magnet, and a magnetic field pushes a current. The force on a moving charge and the '
      + 'paths it makes, the cyclotron, forces on wires and between wires, Biot-Savart and Ampere\'s law for '
      + 'building fields, and finally the current loop as a magnetic dipole — and the meter built from it.',
  },
  6: {
    number: 6,
    title: 'Electromagnetic Induction',
    slug: 'electromagnetic-induction',
    crucible_chapter_id: 'ph12_emi',
    description:
      'Chapters 1-5 asked what a current does. This one asks what MAKES a current — and the answer is a '
      + 'changing magnetic flux. Faraday\'s law and the minus sign Lenz put in front of it, motional EMF, '
      + 'eddy currents, self and mutual inductance, the L-R circuit, and the generator behind every socket.',
  },
  7: {
    number: 7,
    title: 'Alternating Current',
    slug: 'alternating-current',
    crucible_chapter_id: 'ph12_ac',
    description:
      'The generator of Chapter 6 makes a current that reverses fifty times a second, and every rule you '
      + 'learned for steady current needs re-deriving. RMS values, phasors, what L and C do to an AC signal, '
      + 'the series LCR circuit and its resonance, power factor — and the transformer that made the grid possible.',
  },
  8: {
    number: 8,
    title: 'Electromagnetic Waves',
    slug: 'electromagnetic-waves',
    crucible_chapter_id: 'ph12_em_waves',
    description:
      'The capstone. Ampere\'s law turns out to be incomplete; the missing piece is a changing electric field. '
      + 'Patch it, collect all four laws of this book into Maxwell\'s equations, and out falls a wave travelling '
      + 'at a speed built from two benchtop constants — the speed of light. Then the spectrum it all describes.',
  },
};

// ── block + item factories ───────────────────────────────────────────────────

/** b(type, order, extra) → { id, type, order, ...extra } */
const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });

/**
 * Deterministic answer-position spreader.
 *
 * WHY THIS EXISTS: authors naturally write the correct option second or third.
 * The defect has recurred three times on this platform (Social Science, Math,
 * Class 11 Physics Ch.1 at 12/43/49/20 across A/B/C/D). Rather than hand-
 * shuffling hundreds of items, every MCQ factory rotates its options by an
 * amount derived from a stable hash of the question text (or item id).
 * Deterministic → a rebuild reproduces the book exactly; rotation (not shuffle)
 * → option sets that read as a sequence still read sensibly.
 *
 * HARD REQUIREMENT: an explanation must never name an option by position
 * ("the first option is the trap"). Reference the option's CONTENT instead.
 */
const rotateHash = (seed) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};
const spread = (options, correct_index, seed) => {
  if (!Array.isArray(options) || options.length !== 4) return { options, correct_index };
  const k = rotateHash(seed) % 4;
  if (k === 0) return { options, correct_index };
  const rotated = options.slice(k).concat(options.slice(0, k));
  return { options: rotated, correct_index: (correct_index - k + 4) % 4 };
};

/** inline_quiz question. difficulty_level 1–3 only (§17.6 rule 8). */
const q = (question, options, correct_index, explanation, difficulty_level) => {
  const s = spread(options, correct_index, question);
  return { id: uuidv4(), question, options: s.options, correct_index: s.correct_index, explanation, difficulty_level };
};

/** step_solver step. `check` gates the step behind a micro-interaction. */
const st = (math, say, extra) => ({ id: uuidv4(), math, say, ...(extra || {}) });

/**
 * practice_bank items.
 * `source` may only be 'ncert_exercise' | 'ncert_exemplar' | 'cbse_pyq' |
 * 'jee_neet' | 'mcq'. Items adapted from the founder's third-party spine use
 * 'mcq' (no badge) — never a third-party attribution.
 */
const PRACTICE_SOURCES = ['ncert_exercise', 'ncert_exemplar', 'cbse_pyq', 'jee_neet', 'mcq'];

/**
 * Fail loudly at build time on a bad `source`.
 *
 * WHY: `mcq()` takes source as its 6th argument while the inline-quiz factory
 * `q()` takes difficulty_level there. Muscle memory put a number in the source
 * slot nine times in one file, which Mongo accepted happily and only the Zod
 * validator caught afterwards. A throw here turns a silent bad write into an
 * immediate, located build failure.
 */
const checkSource = (id, source) => {
  if (!PRACTICE_SOURCES.includes(source)) {
    throw new Error(
      `practice item "${id}": invalid source ${JSON.stringify(source)}. `
      + `Expected one of ${PRACTICE_SOURCES.join(', ')}. `
      + '(A number here usually means a difficulty_level was passed by mistake — '
      + 'practice_bank items do not take one.)',
    );
  }
};

const mcq = (id, prompt, options, correct_index, explanation, source = 'mcq', source_label) => {
  checkSource(id, source);
  const s = spread(options, correct_index, id);
  return {
    kind: 'mcq', id, source, ...(source_label ? { source_label } : {}),
    prompt, options: s.options, correct_index: s.correct_index, explanation,
  };
};

/**
 * An MCQ whose option ORDER is meaningful and must NOT be rotated — assertion-
 * reason items, where (a)-(d) are a fixed rubric, and any item whose options
 * are an ordered sequence the prompt refers to.
 */
const mcqFixed = (id, prompt, options, correct_index, explanation, source = 'mcq', source_label) => {
  checkSource(id, source);
  return { kind: 'mcq', id, source, ...(source_label ? { source_label } : {}), prompt, options, correct_index, explanation };
};

const num = (id, prompt, answer, solution, source = 'mcq', source_label) => {
  checkSource(id, source);
  return { kind: 'numerical', id, source, ...(source_label ? { source_label } : {}), prompt, answer, solution };
};

// ── db helpers ───────────────────────────────────────────────────────────────

/** Create the book if absent; add the chapter if absent. Idempotent. */
async function ensureBookAndChapter(db, chapterNumber) {
  const CH = CHAPTERS[chapterNumber];
  if (!CH) throw new Error(`unknown chapter ${chapterNumber}`);
  const books = db.collection('books');
  const now = new Date();
  let book = await books.findOne({ slug: BOOK.slug });
  if (!book) {
    book = {
      _id: uuidv4(), slug: BOOK.slug, title: BOOK.title,
      subject: BOOK.subject, grade: BOOK.grade, board: BOOK.board,
      chapters: [], is_published: false,
      deleted_at: null, created_at: now, updated_at: now,
    };
    await books.insertOne(book);
    console.log('created book:', BOOK.slug, book._id);
  }
  if (!book.chapters.some((c) => c.slug === CH.slug)) {
    await books.updateOne({ _id: book._id }, {
      $push: {
        chapters: {
          number: CH.number, title: CH.title, slug: CH.slug, page_ids: [],
          description: CH.description, crucible_chapter_id: CH.crucible_chapter_id,
          is_published: false,
        },
      },
      $set: { updated_at: now },
    });
    console.log('added chapter:', CH.number, CH.title);
  } else {
    // keep the taxonomy link + description fresh even on a re-run
    await books.updateOne(
      { _id: book._id, 'chapters.slug': CH.slug },
      {
        $set: {
          'chapters.$.title': CH.title,
          'chapters.$.description': CH.description,
          'chapters.$.crucible_chapter_id': CH.crucible_chapter_id,
          updated_at: now,
        },
      },
    );
    console.log('chapter exists:', CH.number, CH.title);
  }
  return book._id;
}

/**
 * Insert — or replace-in-place when the slug already exists — the given pages,
 * then RESET the chapter's page_ids to ALL non-deleted pages ordered by
 * page_number.
 *
 * §0.6 note: this only ever creates or replaces the blocks of a page this same
 * script authored. It never deletes a page and never touches another chapter.
 * Re-running is safe and idempotent.
 */
/**
 * Carry `correct_index` (and the option ORDER it indexes into) from the live
 * page onto an incoming rebuild of the same page.
 *
 * WHY THIS EXISTS. `reasoning_prompt` blocks in chapters 1-6 were given their
 * `correct_index` by a one-off pass (`_apply_reasoning_answers.js`) AFTER those
 * chapters were authored, so the build scripts themselves never carried the
 * field. Because `b()` mints a fresh `uuidv4()` on every call, re-running any
 * ch1-6 build script rewrote the page and silently dropped `correct_index` —
 * which in turn made the reader stop marking the student right or wrong, and
 * made the answer-position gate blind to those items again. That is exactly the
 * defect the apply-pass had just fixed, so a routine edit could quietly undo it.
 *
 * Matching is by PROMPT TEXT (block ids are not stable across runs), and the
 * carry-over only happens when the incoming block's option SET is unchanged —
 * if an author deliberately reworded the options, the stored index may no longer
 * point at the right one, so we deliberately do NOT preserve it and let
 * `_hygiene.js` flag the now-missing `correct_index` for a human decision.
 *
 * An incoming block that sets its own `correct_index` always wins; new blocks
 * are therefore authored normally and are unaffected by any of this.
 */
function preserveReasoningAnswers(oldBlocks, newBlocks) {
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  const key = (o) => o.map(norm).slice().sort().join(' ¦ ');
  const prior = new Map();
  for (const b of oldBlocks) {
    if (b.type !== 'reasoning_prompt' || typeof b.correct_index !== 'number') continue;
    if (!Array.isArray(b.options) || !b.options.length) continue;
    prior.set(norm(b.prompt), b);
  }
  if (!prior.size) return;
  for (const b of newBlocks) {
    if (b.type !== 'reasoning_prompt') continue;
    if (typeof b.correct_index === 'number') continue;        // author was explicit — respect it
    if (!Array.isArray(b.options) || !b.options.length) continue;
    const was = prior.get(norm(b.prompt));
    if (!was) continue;                                        // genuinely new prompt
    if (key(was.options) !== key(b.options)) continue;         // options reworded — do not guess
    b.options = was.options.slice();                           // restore the spread order …
    b.correct_index = was.correct_index;                       // … and the index into it
  }
}

/**
 * Re-attach externally-placed interactive blocks that this build script does not
 * know about.
 *
 * WHY THIS EXISTS. The physics simulations (`field_bench`, `circuit_bench`) are
 * NOT authored in these build scripts — they are placed by a separate additive
 * pass, `scripts/physics-sims/insert_placements.js`, and so exist only in the
 * database. Because `upsertPages` writes `blocks` as a whole-array replacement,
 * re-running any build script silently deleted every simulation on the pages it
 * touched: no error, no warning, and (unlike `book-writer.savePage`) no §0.6
 * content-loss guard, because this helper uses the raw driver.
 *
 * That is not hypothetical — it destroyed 4 live simulations during a routine
 * content-fix pass before this guard existed. Anything carrying an `archetype`
 * is treated as externally owned: if the incoming page does not already contain
 * that archetype, the existing block is spliced back in at its original index.
 *
 * An incoming block with the same `archetype` always wins, so a build script may
 * still adopt a simulation deliberately.
 */
function preserveExternalBlocks(oldBlocks, newBlocks) {
  const incoming = new Set(newBlocks.map((b) => b && b.archetype).filter(Boolean));
  const orphans = [];
  oldBlocks.forEach((b, i) => {
    if (!b || !b.archetype || incoming.has(b.archetype)) return;
    orphans.push({ at: i, block: b });
  });
  if (!orphans.length) return [];
  // Splice back low-index-first so earlier restores do not shift later targets.
  for (const { at, block } of orphans) {
    newBlocks.splice(Math.min(at, newBlocks.length), 0, block);
  }
  return orphans.map((o) => `${o.block.type}/${o.block.archetype}`);
}

async function upsertPages(db, bookId, chapterNumber, pageList) {
  const CH = CHAPTERS[chapterNumber];
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const now = new Date();
  for (const p of pageList) {
    const existing = await pages.findOne({ book_id: bookId, chapter_number: CH.number, slug: p.slug });
    let restored = [];
    if (existing) {
      preserveReasoningAnswers(existing.blocks || [], p.blocks);
      restored = preserveExternalBlocks(existing.blocks || [], p.blocks);
    }
    // Re-index block.order from array position. Hand-maintained order numbers
    // break silently the moment a block is inserted mid-page, and the renderer
    // sorts on this field — so the array IS the source of truth.
    p.blocks.forEach((blk, i) => { blk.order = i; });
    const common = {
      chapter_number: CH.number, page_number: p.page_number,
      title: p.title, subtitle: p.subtitle || undefined,
      blocks: p.blocks,
      glossary: p.glossary || undefined,
      page_type: p.page_type || 'lesson', published: false,
      reading_time_min: computeReadingTime(p.blocks),
      content_types: computeContentTypes(p.blocks),
      updated_at: now,
    };
    if (existing) {
      await pages.updateOne({ _id: existing._id }, { $set: common });
      console.log('  updated page', p.page_number, '·', p.slug, '·', common.reading_time_min, 'min'
        + (restored.length ? `  [kept ${restored.join(', ')}]` : ''));
    } else {
      await pages.insertOne({
        _id: uuidv4(), book_id: bookId, slug: p.slug, ...common,
        tags: [], deleted_at: null, created_at: now,
      });
      console.log('  created page', p.page_number, '·', p.slug, '·', common.reading_time_min, 'min');
    }
  }
  const all = await pages
    .find({ book_id: bookId, chapter_number: CH.number, deleted_at: null }, { projection: { _id: 1, page_number: 1 } })
    .toArray();
  all.sort((a, c) => a.page_number - c.page_number);
  await books.updateOne(
    { _id: bookId, 'chapters.slug': CH.slug },
    { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: now } },
  );
  console.log('  chapter page_ids set:', all.length, 'pages');
}

module.exports = {
  BOOK, CHAPTERS, b, q, st, mcq, mcqFixed, num, spread,
  ensureBookAndChapter, upsertPages, withDb,
};
