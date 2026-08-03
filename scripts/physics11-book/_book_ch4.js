'use strict';
/**
 * Shared scaffold for the Class 11 Physics Live Book — Chapter 4, "Laws of Motion".
 *
 * PURELY ADDITIVE + idempotent (matches by slug). Everything is created
 * UNPUBLISHED — nothing reaches students until the founder reviews and
 * publishes in the admin books editor.
 *
 * Plan: _agents/plans/PHYSICS_CH4_LAWS_OF_MOTION_PLAN.md
 *
 * ── FOUNDER DIRECTIVE THIS BUILD FOLLOWS (2026-07-31, verbatim) ─────────────
 * "Laws of motion is a very important and big chapter, and we need dedicated
 * pages for friction as well as for free body diagram for constrained motion...
 * in every scenario we will require multiple worked examples also to be
 * included. That is why they all deserve a dedicated page. And this chapter
 * has to be more about visuals and interactions because simply applying a
 * formula won't give you answers in this chapter." Simulations are explicitly
 * DEFERRED to a follow-up pass — this build treats every page's visual as a
 * hand-drawn SVG figure (Ch.3's pipeline), never a `simulation`/`vector_board`
 * block. Two sim candidates are flagged in the plan (§2) for that later pass.
 *
 * ── WHY EACH TOPIC IS SPLIT ACROSS SEVERAL PAGES (plan §1) ──────────────────
 * NCERT's own chapter is scenario-light — only two of its worked examples
 * touch connected bodies, and it never shows a pulley-constraint derivation,
 * a wedge, or friction combined with an incline. Every scenario family here
 * comes from "Mechanics Vol. 1" ch.8 (Types of Forces, FBD, Equilibrium,
 * Newton's Laws, Constraint Equations Type 1/2, Pseudo Force, Friction) and
 * ch.10 §10.3–10.5 (circular dynamics), with "Concepts of Physics" Pt.1 ch.5/6
 * as the pedagogy layer. Per the standing no-third-party-attribution rule,
 * these two are NEVER named in student-facing text or a practice-item badge.
 *
 * ── SYMBOL SET (carried from Ch.0–Ch.3, no drift) ───────────────────────────
 *   g = 9.8 m/s² is the teaching default. Use 10 only where a problem states
 *   it explicitly (NCERT's own Ch.4 EXERCISES section prints "take g = 10
 *   m/s²" at its head, so problems built on those exercises say so too) —
 *   and always print which value is in play.
 *   μ_s / μ_k  static / kinetic coefficient of friction  ·  λ  angle of friction
 *   θ  angle of an incline or of projection (context-dependent, always stated)
 */
const { computeReadingTime, computeContentTypes, withDb } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK = { slug: 'class11-physics' };

const CH = {
  number: 4,
  title: 'Laws of Motion',
  slug: 'laws-of-motion',
  crucible_chapter_id: 'ph11_nlm',
  description:
    'Chapter 2 and 3 described how things move. This chapter explains why — inertia, F = ma, and action-reaction, '
    + 'then the two skills that make or break every hard problem from here on: drawing the free body diagram of a '
    + 'connected or constrained system, and reading a friction diagram correctly. Pseudo force for the frames where '
    + 'F = ma alone lies to you, and circular motion done properly, with the force that causes it named at last.',
};

// block factory: b(type, order, extra) → { id, type, order, ...extra }
const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });

/**
 * PAGE-OPENING HERO IMAGES — same convention as Ch.3 (founder direction,
 * 2026-07-30): every content page opens with a real-life APPLICATION of that
 * page's concept, as a flat-geometric vector illustration on a dark theme.
 * These are AI-generated art (`generation_prompt`, no `figure_key`). Technical
 * figures are hand-drawn SVG (`figure_key`, NEVER a `generation_prompt` — the
 * reader prints any prompt it finds verbatim with a "Copy prompt" button).
 *
 * All 13 content-page heroes are defined here up front (Ch.3 precedent), even
 * though this wave only builds p1–p6 — later waves just look them up by slug.
 */
const HERO_STYLE = 'Wide cinematic vector illustration, flat-geometric style with clean crisp edges, '
  + 'strong silhouettes and minimal interior detail. ';
const HERO_TAIL = ' Minimal and elegant with generous negative space. Very dark near-black background '
  + 'with orange and amber accents only. No text, labels, numbers or arrows with letters.';

const HEROES = {
  'newtons-first-and-third-law': {
    alt: 'Two ice skaters at night pushing off against each other and gliding apart in opposite directions across a rink.',
    scene: 'Two ice skaters on an outdoor rink at night, captured at the instant their palms meet and they push apart; '
      + 'faint dotted trails behind each show them gliding away from each other in opposite directions across the ice. '
      + 'Soft floodlights and a dark tree line behind the rink.',
  },
  'newtons-second-law-and-equilibrium': {
    alt: 'A sprinter exploding out of the starting blocks at night under stadium floodlights, body driving low and forward.',
    scene: 'A sprinter captured at the instant of leaving the starting blocks under stadium floodlights at night, body '
      + 'low and driving forward, legs mid-drive against the blocks. A faint dotted line traces the forward path just '
      + 'begun. Empty lanes and distant stands as simple dark geometry.',
  },
  'free-body-diagrams': {
    alt: 'A single shipping crate hanging from a crane hook over a dock at night, isolated in a pool of floodlight.',
    scene: 'A single shipping crate suspended from a crane hook, hanging in a pool of floodlight over an otherwise dark '
      + 'dockside at night; the hook cable is the only line connecting it to anything else in the frame. Distant crane '
      + 'gantries and stacked containers as faint silhouettes at the edges.',
  },
  'connected-bodies': {
    alt: 'A line of freight wagons coupled behind a locomotive, pulling away down a straight night-time track.',
    scene: 'A goods locomotive at the head of a line of coupled freight wagons, seen from low beside the track at night, '
      + 'pulling away with a single headlamp cutting the dark; the couplings between each wagon are just visible. '
      + 'Straight rails converging to a point in the distance.',
  },
  'constraint-equations-fixed-pulley': {
    alt: 'A window-washing platform on one side of a rooftop pulley rising as a counterweight on the other side descends, at night.',
    scene: 'A building facade at night, a window-washing platform rigged on one side of a rooftop pulley wheel and a '
      + 'counterweight block on the other side of the same rope; the platform is shown risen while the counterweight '
      + 'has descended an equal length of rope. Lit office windows as a faint grid on the facade.',
  },
  'constraint-equations-movable-pulleys-and-wedges': {
    alt: 'A garage engine hoist, block-and-tackle pulleys lifting an engine block, the hand-pulled rope end much longer than the lift.',
    scene: 'A workshop garage at night, an engine block lifted clear of a car by a block-and-tackle hoist with two '
      + 'pulley wheels; the rope\'s free end trails down much further than the engine has risen, showing the '
      + 'mechanical advantage. A single hanging work lamp as the only light source.',
  },
  'friction-basics': {
    alt: 'Workers straining ropes to drag a massive stone block across sand at dusk, in the manner of ancient monument-building.',
    scene: 'A line of workers in silhouette straining on ropes to drag a massive rectangular stone block across sand at '
      + 'dusk, the block barely moving, in the manner of ancient monument-building; a few wooden rollers are just '
      + 'visible under the leading edge of the block. Low warm sun behind distant dunes.',
  },
  'friction-pulling-pushing-and-stacked-blocks': {
    alt: 'A worker pulling a heavily loaded handcart by a rope angled upward from the front, at night on a warehouse floor.',
    scene: 'A warehouse worker at night pulling a heavily loaded two-wheeled handcart, the rope running from the cart '
      + 'up to the worker\'s shoulder at a clear angle rather than straight along the ground; stacked crates form the '
      + 'cart\'s load. Rows of warehouse shelving fade into darkness behind.',
  },
  'friction-walls-wedges-and-minimum-force': {
    alt: 'A rock climber wedged sideways between two narrow canyon walls at night, pressing outward with hands and feet to stay up.',
    scene: 'A rock climber in silhouette wedged between two narrow, near-vertical canyon walls at night, arms and legs '
      + 'braced outward against the opposing rock faces to stay suspended above a dark drop below. A sliver of '
      + 'moonlight down the crack between the walls.',
  },
  'pseudo-force-and-lift-problems': {
    alt: 'The interior of a rising lift at night, a hanging pendant light swinging slightly as the lift accelerates upward.',
    scene: 'The interior of a lift cabin at night, seen through its closing doors as it begins to rise; a pendant lamp '
      + 'hanging from the ceiling is caught mid-swing, tilted slightly backward from vertical. Floor-indicator lights '
      + 'glowing faintly above the doors.',
  },
  'pseudo-force-wedges-vehicles-and-pendulums': {
    alt: 'A small ornament pendulum hanging from a car rearview mirror, swung back at an angle as the car accelerates at night.',
    scene: 'The view from inside a car at night, dashboard lights glowing faintly, a small pendulum ornament hanging '
      + 'from the rearview mirror caught swung backward at a clear angle as the car accelerates away from a signal; '
      + 'the road ahead streaked with the blur of oncoming headlights.',
  },
  'circular-dynamics-vertical-circle-and-conical-pendulum': {
    alt: 'A fairground swing ride at night, chairs and chains flared outward in a wide cone as the ride spins.',
    scene: 'A fairground chair-swing ride at night, riders\' chairs and chains flared outward into a wide cone shape as '
      + 'the ride spins at full speed, strings of coloured lights tracing the circle they sweep. The central tower and '
      + 'motor housing as a simple dark silhouette.',
  },
  'circular-dynamics-banking-of-roads': {
    alt: 'A low aerial view of a banked racetrack curve at night, a car\'s headlights sweeping through the tilted bend.',
    scene: 'A low aerial view of a steeply banked racetrack curve at night, the track surface visibly tilted like the '
      + 'inside of a bowl; a single car\'s headlights sweep through the bend, leaving a light-trail along its line. '
      + 'Floodlight towers as sparse points beyond the track edge.',
  },
};

/** The page-opening hero image block for a page, looked up by its slug. */
const hero = (slug) => {
  const h = HEROES[slug];
  if (!h) throw new Error(`hero(): no hero defined for page slug "${slug}"`);
  return b('image', 0, {
    src: '',
    alt: h.alt,
    aspect_ratio: '16:5',
    generation_prompt: HERO_STYLE + h.scene + HERO_TAIL,
  });
};

/**
 * Deterministic answer-position spreader — carried over UNCHANGED from Ch.3
 * (the "rotate to an absolute target" fix). See _book_ch3.js for the full
 * history; the short version: rotating BY a hashed offset still lets the
 * author's own index bias show through, rotating TO `hash % 4` does not.
 *
 * HARD REQUIREMENT: an explanation must never refer to an option by position
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
  const target = rotateHash(seed) % 4;
  const k = (correct_index - target + 4) % 4;
  if (k === 0) return { options, correct_index: target };
  const rotated = options.slice(k).concat(options.slice(0, k));
  return { options: rotated, correct_index: target };
};

/**
 * quiz-question factory. `difficulty_level` is REQUIRED by chapter hygiene.
 * GUARD (Ch.2 → Ch.12 lesson): 5th positional arg here is `difficulty_level`,
 * but on `mcq()` below the 6th is `source` — passing a source string here
 * silently wrote bad docs on an earlier chapter, so throw instead.
 */
const q = (question, options, correct_index, explanation, difficulty_level) => {
  if (difficulty_level !== undefined && typeof difficulty_level !== 'number') {
    throw new Error(`q(): difficulty_level must be a number, got ${JSON.stringify(difficulty_level)} — `
      + `did you mean mcq()? (question: ${String(question).slice(0, 60)})`);
  }
  const s = spread(options, correct_index, question);
  return { id: uuidv4(), question, options: s.options, correct_index: s.correct_index, explanation, difficulty_level };
};

/** step_solver step factory. `check` gates the step behind a micro-interaction. */
const st = (math, say, extra) => ({ id: uuidv4(), math, say, ...(extra || {}) });

// practice-bank item factories. `source`: only 'ncert_exercise' | 'ncert_exemplar'
// | 'cbse_pyq' | 'jee_neet' | 'mcq' are permitted. Items adapted from the two
// reference books use 'mcq' (no badge) — never a third-party attribution.
const mcq = (id, prompt, options, correct_index, explanation, source = 'mcq', source_label) => {
  const s = spread(options, correct_index, id);
  return {
    kind: 'mcq', id, source, ...(source_label ? { source_label } : {}),
    prompt, options: s.options, correct_index: s.correct_index, explanation,
  };
};

/** An MCQ whose option ORDER is meaningful (e.g. assertion–reason) — never rotated. */
const mcqFixed = (id, prompt, options, correct_index, explanation, source = 'mcq', source_label) => ({
  kind: 'mcq', id, source, ...(source_label ? { source_label } : {}), prompt, options, correct_index, explanation,
});

const num = (id, prompt, answer, solution, source = 'mcq', source_label) => ({
  kind: 'numerical', id, source, ...(source_label ? { source_label } : {}), prompt, answer, solution,
});

async function ensureChapter(db) {
  const books = db.collection('books');
  const now = new Date();
  const book = await books.findOne({ slug: BOOK.slug });
  if (!book) throw new Error('book class11-physics not found — build Ch.0 first');
  if (!book.chapters.some((c) => c.slug === CH.slug)) {
    await books.updateOne({ _id: book._id }, {
      $push: {
        chapters: {
          number: CH.number, title: CH.title, slug: CH.slug, page_ids: [],
          description: CH.description, is_published: false,
          crucible_chapter_id: CH.crucible_chapter_id,
        },
      },
      $set: { updated_at: now },
    });
    console.log('added chapter:', CH.number, CH.title);
  } else {
    await books.updateOne(
      { _id: book._id, 'chapters.slug': CH.slug },
      { $set: { 'chapters.$.crucible_chapter_id': CH.crucible_chapter_id, 'chapters.$.title': CH.title, updated_at: now } },
    );
    console.log('chapter exists:', CH.title, '(taxonomy link reasserted)');
  }
  return book._id;
}

/**
 * Insert (or update-in-place if the slug already exists) the given pages, then
 * RESET the chapter's page_ids to ALL non-deleted pages ordered by page_number.
 * §0.6 note: only ever creates or REPLACES the blocks of a page THIS script
 * authored. Never deletes a page, never touches another chapter. Idempotent.
 */
async function upsertPages(db, bookId, pageList) {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const now = new Date();
  for (const p of pageList) {
    const existing = await pages.findOne({ book_id: bookId, chapter_number: CH.number, slug: p.slug });
    // Re-index block.order from array position — the renderer sorts on this
    // field, so the array is the source of truth (Ch.2/Ch.3 lesson).
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
      console.log('  updated page', p.page_number, '·', p.slug, '·', common.reading_time_min, 'min');
    } else {
      await pages.insertOne({
        _id: uuidv4(), book_id: bookId, slug: p.slug, ...common,
        tags: [], deleted_at: null, created_at: now,
      });
      console.log('  created page', p.page_number, '·', p.slug, '·', common.reading_time_min, 'min');
    }
  }
  const all = await pages.find({ book_id: bookId, chapter_number: CH.number, deleted_at: null }, { projection: { _id: 1, page_number: 1 } }).toArray();
  all.sort((a, c) => a.page_number - c.page_number);
  await books.updateOne(
    { _id: bookId, 'chapters.slug': CH.slug },
    { $set: { 'chapters.$.page_ids': all.map((x) => x._id), updated_at: now } },
  );
  console.log('  chapter page_ids set:', all.length, 'pages');
}

module.exports = { BOOK, CH, b, q, st, mcq, mcqFixed, num, hero, HEROES, ensureChapter, upsertPages, withDb };
