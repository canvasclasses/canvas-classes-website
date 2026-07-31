'use strict';
/**
 * Shared scaffold for the Class 11 Physics Live Book — Chapter 3,
 * "Motion in Two Dimensions".
 *
 * TITLE NOTE (§18): NCERT calls this chapter "Motion in a Plane". The Crucible
 * physics taxonomy calls it "Motion in Two Dimensions" (`ph11_kinematics2d`),
 * and the Live Book title must be byte-identical to the Crucible one. So the
 * Crucible title wins — same rule that renamed Ch.1 and Ch.2.
 *
 * PURELY ADDITIVE + idempotent (matches by slug). Everything is created
 * UNPUBLISHED — nothing reaches students until the founder reviews and
 * publishes in the admin books editor.
 *
 * Plan: _agents/plans/PHYSICS_CH3_MOTION_IN_TWO_DIMENSIONS_PLAN.md
 *
 * ── THE THREE §7 DECISIONS THIS BUILD PROCEEDS UNDER ────────────────────────
 * The founder said "continue building Chapter 3" without answering §7, so the
 * build takes the plan's own recommendation on each. All three are reversible.
 *   1. SIMS: built sim-free (recommendation (b)). The founder's Ch.2 instruction
 *      — "avoid the simulation part, I am getting simulation engines designed
 *      for the entire mechanics" — is a standing one, and `ProjectilePlayground`
 *      / `CircularArena` have had no founder browser-QA pass. Reserved slots are
 *      listed in plan §6.1, so inserting them later is a placement decision.
 *   2. INCLINED PLANE: kept as a full page (p9), `tier: 'competitive'`.
 *   3. CIRCULAR BOUNDARY: stops at a_c = v²/r. Centripetal FORCE, banked roads,
 *      the conical pendulum and vertical circles go to Laws of Motion. p11
 *      carries an explicit "Note on Scope" callout so a student who has seen
 *      banked roads in coaching is not confused by their absence.
 *
 * ── NO VECTOR SECTION, NO VECTOR RECAP (founder decision 2026-07-29) ────────
 * Six of NCERT Ch.3's ten sections are pure vector algebra, all of which Ch.0
 * Unit C already teaches in more depth. This chapter opens on p1 with the
 * physics, and vector technique is revised IN SITU inside the step-solvers, per
 * the four authoring rules in plan §1:
 *   • a step_solver whose first move is a resolution makes that resolution its
 *     own gated step, with the trig shown;
 *   • any vector subtraction draws the triangle and names the rule;
 *   • î/ĵ is used without ceremony, but the FIRST extraction on each page is
 *     shown in full;
 *   • a vector identity the student may have forgotten is stated in the step
 *     that uses it, in one line.
 *
 * ── SYMBOL SET, FIXED HERE SO NO PAGE DRIFTS (plan C2) ──────────────────────
 *   θ  angle of projection (NCERT's symbol; the reference books use α)
 *   β  angle of an inclined plane
 *   ω  angular velocity   ·  α  angular acceleration
 *   g = 9.8 m/s² is the teaching default. Use 10 only where a problem states
 *   it, and ALWAYS print which value is in play.
 *
 * Sources (Rule 0 — every fact, number and exercise is transcribed from these,
 * never generated from memory):
 *   • NCERT Class 11 Physics Ch.3 "Motion in a Plane", rationalised 2026-27
 *     reprint (the structural spine).
 *   • "Mechanics Vol. 1" ch.6 §6.8/§6.10, ch.7 in full, ch.10 §10.1–10.2 —
 *     problem layer + the JEE-only extensions.
 *   • "Concepts of Physics" Pt.1 ch.3 §3.7–3.9 — pedagogy layer.
 * Per the standing no-third-party-attribution rule the last two books are NEVER
 * named in student-facing text or in any practice-item source badge.
 */
const { computeReadingTime, computeContentTypes, withDb } = require('../lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK = { slug: 'class11-physics' };

const CH = {
  number: 3,
  title: 'Motion in Two Dimensions',
  slug: 'motion-in-two-dimensions',
  crucible_chapter_id: 'ph11_kinematics2d',
  description:
    'A motion in a plane is two one-dimensional motions happening at the same time and ignoring each '
    + 'other — so every problem in this chapter is two Chapter 2 problems sharing a clock. Projectiles '
    + 'and why the path is a parabola, the range formula and the condition it hides, going round in a '
    + 'circle, and what the world looks like from a boat, a train or a plane that is itself moving.',
};

// block factory: b(type, order, extra) → { id, type, order, ...extra }
const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });

/**
 * PAGE-OPENING HERO IMAGES (founder direction, 2026-07-30).
 *
 * Every content page opens with a hero banner showing a REAL-LIFE APPLICATION of
 * that page's concept — not a diagram. Style is a beautiful vector illustration
 * (flat-geometric, strong silhouettes, generous negative space) on a dark theme.
 *
 * The division of labour, which matters:
 *   • THESE are AI-generated art. They carry a `generation_prompt` and no
 *     `figure_key`.
 *   • The TECHNICAL figures are hand-drawn SVG (svg/figures_ch3.js). They carry
 *     a `figure_key` and NEVER a `generation_prompt` — the reader-facing
 *     renderer prints any prompt it finds verbatim, with a "Copy prompt" button,
 *     so a placeholder string leaks straight onto the page.
 *
 * Per the standing house rule, every prompt ends on the dark-background +
 * orange/amber accent instruction, with no exceptions.
 */
const HERO_STYLE = 'Wide cinematic vector illustration, flat-geometric style with clean crisp edges, '
  + 'strong silhouettes and minimal interior detail. ';
const HERO_TAIL = ' Minimal and elegant with generous negative space. Very dark near-black background '
  + 'with orange and amber accents only. No text, labels, numbers or arrows with letters.';

const HEROES = {
  'two-motions-at-once': {
    alt: 'A cargo aeroplane flying level while a released supply pallet falls in a curve, staying directly beneath it.',
    scene: 'A cargo aeroplane flying level to the right at altitude; a supply pallet with a small parachute has just '
      + 'been released and is falling away in a curve, staying directly beneath the aircraft. A faint dotted trail '
      + 'traces the pallet\'s curved path. Far below, a small relief camp of tents on dark terrain.',
  },
  'position-velocity-acceleration-as-vectors': {
    alt: 'A car sweeping through a mountain hairpin at night, with faint lines showing its direction of travel and the pull toward the inside of the bend.',
    scene: 'A car seen from above and behind, sweeping through a hairpin bend on a mountain road at night; the road '
      + 'ribbon curves across the frame. One faint glowing line runs straight off the car\'s nose along its direction '
      + 'of travel, and a second faint line points inward toward the centre of the bend. Sparse pine silhouettes and '
      + 'layered dark ridges behind.',
  },
  'constant-acceleration-in-a-plane': {
    alt: 'A speedboat cutting diagonally across open water at night, its wake curving as it is pushed steadily sideways.',
    scene: 'A speedboat cutting diagonally across open water at night, throwing a clean V-shaped wake; the wake curves '
      + 'gently because the boat is being pushed steadily sideways as well as driven forward. A faint dotted curve '
      + 'traces its path back to the lower left. A distant shoreline as a flat silhouette.',
  },
  'projectile-motion-setting-it-up': {
    alt: 'A basketball player mid jump-shot in silhouette, the ball arcing toward the hoop along a faint dotted parabola.',
    scene: 'A basketball player captured mid jump-shot in silhouette, the ball just released and arcing toward a hoop '
      + 'at the right of the frame; a faint dotted parabola traces the ball\'s flight. Empty stadium seating suggested '
      + 'as simple dark bands behind.',
  },
  'time-of-flight-height-and-range': {
    alt: 'A javelin thrower at the instant of release, the javelin climbing away on a long shallow arc.',
    scene: 'A javelin thrower in silhouette at the instant of release, body fully extended, the javelin climbing away '
      + 'to the right on a long shallow arc traced by a faint dotted line. Stadium floodlights as small warm points, '
      + 'and the running track as clean curved bands.',
  },
  'the-equation-of-the-path': {
    alt: 'A row of fountain jets at night, each throwing a slender arc of water in a clean parabola over a still pool.',
    scene: 'A row of fountain jets at night, each throwing a slender arc of water that rises and falls in a clean '
      + 'parabola; the overlapping arcs make a rhythmic pattern across the frame. A still reflecting pool below with '
      + 'soft mirrored highlights.',
  },
  'thrown-from-a-height': {
    alt: 'A figure on a high clifftop at dusk having just thrown a stone out over the sea, its path arcing far down to the water.',
    scene: 'A figure standing in silhouette on a high clifftop at dusk, having just hurled a stone out over the sea; '
      + 'a faint dotted curve traces the stone\'s flight, arcing outward and then far down to the water below. Layered '
      + 'cliff faces and a low horizon, with a strong sense of great height.',
  },
  'projectile-problems-that-look-different': {
    alt: 'A firefighter directing a water jet up toward an upper window, the jet tracing a clean arc.',
    scene: 'A firefighter in silhouette on the ground directing a powerful water jet up toward an upper window of a '
      + 'building; the jet traces a clean arc across the frame. The building face as simple dark geometry with a '
      + 'single warm-lit window.',
  },
  'projectile-on-an-inclined-plane': {
    alt: 'A ski jumper in mid-flight above a steep snow-covered landing slope, the flight path curving down to the incline.',
    scene: 'A ski jumper in silhouette in mid-flight above a steep snow-covered landing slope, body angled forward; a '
      + 'faint dotted curve traces the flight path down toward the inclined hillside rather than to level ground. '
      + 'Layered mountain silhouettes behind and sparse floodlit towers.',
  },
  'going-round-in-a-circle': {
    alt: 'A close view of a bicycle rear sprocket cassette and chain at night, concentric rings of different radii clearly visible.',
    scene: 'A close, elegant view of a bicycle\'s rear sprocket cassette and chain at night, with the wheel spokes '
      + 'radiating behind it; concentric rings of clearly different radii are visible. Faint dotted arcs suggest '
      + 'rotation. Precise and mechanical.',
  },
  'centripetal-acceleration': {
    alt: 'A track cyclist leaning hard into the steep banking of a velodrome, with a faint arrow pointing inward toward the centre of the curve.',
    scene: 'A track cyclist leaning hard into the steep banking of a velodrome at night, seen from track level; the '
      + 'curved wooden banking sweeps up and away across the frame. A single faint arrow from the rider points '
      + 'horizontally inward toward the centre of the curve.',
  },
  'when-the-circle-speeds-up': {
    alt: 'A ceiling fan just after being switched on, its blades trailing progressively longer motion-blur arcs as the speed builds.',
    scene: 'A ceiling fan seen from slightly below just after being switched on, its blades caught mid-acceleration '
      + 'with progressively longer motion-blur arcs trailing each blade to show the speed building. Simple dark room '
      + 'geometry suggested beneath.',
  },
  'relative-velocity-in-two-dimensions': {
    alt: 'A view from a train window at night as a second train passes on the adjacent track, its lit windows smeared into streaks.',
    scene: 'An interior view from a train window at night, looking across at a second train passing on the adjacent '
      + 'track in the opposite direction; the near carriage frame is a dark silhouette while the passing carriage\'s '
      + 'windows are warm rectangles smeared into horizontal streaks by the relative motion.',
  },
  'crossing-a-river-and-walking-in-the-rain': {
    alt: 'A small ferry crossing a wide river at night, its bow angled upstream while its actual track runs straight across to a jetty.',
    scene: 'A small ferry crossing a wide river at night, its bow angled noticeably upstream while its actual track — '
      + 'a faint dotted line — runs straight across to a jetty on the far bank. The current suggested by long soft '
      + 'streaks in the water. The far bank as a flat silhouette with a few warm lights.',
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
 * Deterministic answer-position spreader — carried over from Ch.1/Ch.2 UNCHANGED.
 *
 * WHY THIS EXISTS: authors naturally write the correct option second or third.
 * Ch.1's first pass came out 12/43/49/20 across A/B/C/D — 74% of answers in B
 * or C, a guessable pattern, and the same defect had already recurred twice
 * (Social Science, Math). Every MCQ factory rotates its options by an amount
 * derived from a stable hash of the question text (or item id): deterministic,
 * so a rebuild reproduces the book exactly, and order-preserving, so option
 * sets that read as a sequence still read sensibly. Ch.2 landed at 53/50/44/50
 * across 197 MCQs with no hand-shuffling.
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
/**
 * IMPROVED FOR CH.3 — rotate to an ABSOLUTE TARGET, not by a hashed offset.
 *
 * Ch.1 and Ch.2 rotated BY `hash % 4`, which leaves the final position equal to
 * `(authored_index - k) mod 4`. That still depends on the author's own bias, and
 * Ch.3's first 111 MCQs came out 26/18/25/42 across A/B/C/D — 38% in D. The
 * rotation amount itself was near-uniform (26/26/35/24), so the skew was the
 * authored index (I reach for the second option) showing through the offset.
 *
 * Rotating to an absolute target makes the final position equal to `hash % 4`
 * OUTRIGHT, so authoring bias cannot reach the output at all. Still fully
 * deterministic — a rebuild reproduces the book exactly.
 *
 * NOT backported to _book_ch1.js / _book_ch2.js: those chapters are built and
 * their option orders are already reviewed, and Ch.2 landed at an acceptable
 * 53/50/44/50. Rewriting them would churn 197 reviewed items for no gain.
 *
 * HARD REQUIREMENT (unchanged): an explanation must never refer to an option by
 * position ("the first option is the trap"). Reference the option's CONTENT.
 */
const spread = (options, correct_index, seed) => {
  if (!Array.isArray(options) || options.length !== 4) return { options, correct_index };
  const target = rotateHash(seed) % 4;              // where the answer should END UP
  const k = (correct_index - target + 4) % 4;       // rotate by exactly this much
  if (k === 0) return { options, correct_index: target };
  const rotated = options.slice(k).concat(options.slice(0, k));
  return { options: rotated, correct_index: target };
};

/**
 * quiz-question factory. `difficulty_level` is REQUIRED by chapter hygiene —
 * an untagged question is a defect `_audit_ch3.js` flags.
 *
 * GUARD (Ch.2 → Ch.12 lesson): the 5th positional arg here is
 * `difficulty_level`, but on `mcq()` below the 6th is `source`. Passing a source
 * string here silently wrote 25 bad docs on the Class 12 EM book, so throw.
 */
const q = (question, options, correct_index, explanation, difficulty_level) => {
  if (difficulty_level !== undefined && typeof difficulty_level !== 'number') {
    throw new Error(`q(): difficulty_level must be a number, got ${JSON.stringify(difficulty_level)} — `
      + `did you mean mcq()? (question: ${String(question).slice(0, 60)})`);
  }
  const s = spread(options, correct_index, question);
  return { id: uuidv4(), question, options: s.options, correct_index: s.correct_index, explanation, difficulty_level };
};

/**
 * step_solver step factory.
 *
 * `check` gates the step behind a micro-interaction — that gating is the whole
 * point of the block (VanLehn step-based tutoring, d≈0.76 vs ~0.3 for
 * answer-only), so a step WITHOUT a check should be a deliberate choice.
 *
 * RENDERER NOTE: `math` is set in a large centred display size because it was
 * built for KaTeX equations. Do not put a long prose sentence in `math` — put
 * it in `say`.
 */
const st = (math, say, extra) => ({ id: uuidv4(), math, say, ...(extra || {}) });

// practice-bank item factories.
// NOTE ON `source`: only 'ncert_exercise' | 'ncert_exemplar' | 'cbse_pyq' |
// 'jee_neet' | 'mcq' are permitted. Items adapted from the two reference books
// use 'mcq' (no badge) — never a third-party attribution.
const mcq = (id, prompt, options, correct_index, explanation, source = 'mcq', source_label) => {
  const s = spread(options, correct_index, id);
  return {
    kind: 'mcq', id, source, ...(source_label ? { source_label } : {}),
    prompt, options: s.options, correct_index: s.correct_index, explanation,
  };
};

/**
 * An MCQ whose option ORDER is meaningful and must not be rotated.
 * Assertion–reason items are the case: options (a)–(d) are a fixed rubric, so
 * shuffling would destroy the format. Use `mcq` for everything else.
 */
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
    // §18: keep the taxonomy link true even if the chapter row predates it.
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
 *
 * §0.6 note: this only ever creates or REPLACES the blocks of a page this same
 * script authored. It never deletes a page and never touches another chapter.
 * Re-running is safe and idempotent.
 */
async function upsertPages(db, bookId, pageList) {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const now = new Date();
  for (const p of pageList) {
    const existing = await pages.findOne({ book_id: bookId, chapter_number: CH.number, slug: p.slug });
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
