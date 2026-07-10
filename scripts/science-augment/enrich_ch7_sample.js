'use strict';
/**
 * Ch7 PROSE-ENRICHMENT pilot — SAMPLE: p144 only ("work-scientific-definition").
 *
 * Demonstrates the proposed bar: NCERT-grounded (iesc107.pdf §7.1), classroom-
 * teacher prose at grade-9 depth, with the body expanded around the EXISTING
 * scaffolding. Expansion only — every existing scaffolding block (curiosity,
 * image, worked_example, reasoning, quiz, callout) is preserved by id; the one
 * latex_block is recast from the above-grade `W=F cosθ·d` to the NCERT headline
 * `W = F × s`, and the angle form is folded into a "higher grades" callout so
 * nothing is dropped. published stays false. Pass --dry to preview.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-science';
const CH = 7;
const SLUG = 'work-scientific-definition';
const uid = () => crypto.randomUUID();
const txt = (markdown) => ({ type: 'text', markdown });
const callout = (variant, title, markdown) => ({ type: 'callout', variant, title, markdown });

// scaffolding types that must never be silently lost
const SCAFFOLD = new Set(['curiosity_prompt', 'image', 'reasoning_prompt', 'inline_quiz', 'worked_example', 'table', 'comparison_card']);

async function main() {
  const DRY = process.argv.includes('--dry');
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    const col = db.collection('book_pages');
    const page = await col.findOne({ book_id: String(book._id), chapter_number: CH, slug: SLUG });
    if (!page) throw new Error('page not found');
    const E = (page.blocks || []).map((b) => ({ ...b }));

    const one = (type, pred) => E.find((b) => b.type === type && (!pred || pred(b)));
    const hook = one('curiosity_prompt');
    const hero = E.filter((b) => b.type === 'image')[0];
    const diagram = E.filter((b) => b.type === 'image')[1] || null;
    const funFact = one('callout', (b) => b.variant === 'fun_fact');
    const heading = one('heading');
    const latex = one('latex_block');
    const worked = one('worked_example');
    const reasoning = one('reasoning_prompt');
    const quiz = one('inline_quiz');

    // recast the latex headline to the NCERT definition (content change, not removal)
    const latexFixed = latex ? { ...latex, latex: 'W = F \\times s' } : null;

    // ── enriched NCERT-grounded prose (iesc107 §7.1) ──────────────────────────
    const intro = txt(
`We use the word "work" all the time — homework, housework, a hard day's work. In science it means something far more exact, and the difference is worth slowing down for.

Picture a 5 kg bag of wheat resting on the floor. Gravity pulls it down with a force equal to its weight. To lift it gently to a shelf 1 metre up, you must push **up** on it with that same force, through that 1 metre. In everyday language you'd say you *did some work* — and in physics, you did.

Now watch how the work changes:

- **Lift three such bags, one after another, to the same shelf.** You've done the same job three times, so you've done **three times the work** — and a machine doing it for you would burn three times the fuel.
- **Lift all three bags together** to that shelf. Now you push with three times the force, over the same 1 metre — again, **three times the work**. A bigger force over the same distance means proportionally more work.
- **Lift a single bag three times as high (to 3 metres).** Same force, three times the distance — once more, **three times the work**.

Two things, then, decide how much work is done: the **force** you apply, and the **distance** the object moves in the direction of that force.`
    );

    const definition = txt(
`That gives us the scientific definition:

> **Work done by a constant force = force applied × displacement in the direction of the force.**

In symbols, $ W = F \\times s $, where $ F $ is the force in newtons (N) and $ s $ is the displacement in metres (m).

The SI unit of work is the **joule (J)**. One joule is the work done when a force of **1 newton** moves an object **1 metre** in the force's direction:

$$ 1\\ \\text{J} = 1\\ \\text{N} \\times 1\\ \\text{m} $$

So lifting that 5 kg wheat bag (weight ≈ 50 N) up by 1 m takes about 50 J of work.`
    );

    const cases = txt(
`Whether work is **positive, negative, or zero** depends on how the force and the motion line up:

- **Same direction → positive work.** Push a wheelchair forward and it rolls forward; your force and the motion agree, so you do positive work on it.
- **Opposite direction → negative work.** A goalkeeper's hands push *back* on a ball moving *towards* them. Force and motion oppose, so the keeper does negative work on the ball — taking energy out of it and slowing it down.
- **No motion, or motion at right angles → zero work.** Press hard on a wall: you tire, but the wall doesn't move, so the work done on it is **zero**. Carry a heavy school bag while walking on level ground and it's the same story — you hold the bag *up* while it moves *forward*, two directions at right angles, so you do no work on the bag even though your shoulders disagree.

This is the surprise the question at the top of the page points to: you can strain every muscle and still, in the scientific sense, do **no work** — because work needs both a force *and* movement in that force's direction.`
    );

    const higherGrades = callout(
      'bridging_science',
      'In higher grades: when the force is at an angle',
      'Here the force and the motion are along the same line, so $ W = F \\times s $. When a force pushes at an *angle* $ \\theta $ to the motion — like pulling a loaded cart by a slanted rope — only the part of the force along the motion does work, and the fuller formula becomes $ W = F\\cos\\theta \\times s $. You will meet this in higher grades; for now, the straight-line version is all you need.'
    );

    // ── assemble (preserve order: hook, hero, fun_fact, heading, then enriched body) ──
    const out = [
      hook,
      hero,
      funFact,
      heading,
      intro,
      latexFixed,
      definition,
      cases,
      higherGrades,
      worked,
      diagram,
      reasoning,
      quiz,
    ].filter(Boolean);

    // ── safety: no scaffolding block dropped ──────────────────────────────────
    const keptIds = new Set(out.map((b) => b.id).filter(Boolean));
    const lost = E.filter((b) => SCAFFOLD.has(b.type) && b.id && !keptIds.has(b.id));
    if (lost.length) {
      throw new Error(`ABORT — would drop scaffolding: ${lost.map((b) => b.type).join(', ')}`);
    }

    const seq = out.map((b, i) => ({ id: b.id || uid(), ...b, order: i }));
    console.log(`\np${page.page_number} ${SLUG} — ${E.length}→${seq.length} blocks`);
    console.log(seq.map((b) => b.type).join(' → '));
    if (DRY) { console.log('\n[dry run] no write.'); return; }
    await col.updateOne({ _id: page._id }, { $set: { blocks: seq, updated_at: new Date() } });
    console.log(`  ✅ written (published stays ${page.published})`);
  } finally { await client.close(); }
}
main().catch((e) => { console.error(e); process.exit(1); });
