'use strict';
/**
 * Ch7 PROSE-ENRICHMENT — remaining 11 pages (p145–p155).
 * Bar approved on the p144 sample: NCERT-grounded (iesc107.pdf), classroom-
 * teacher prose, grade-9 voice. Founder decision: KEEP ALL existing content
 * (six-machines framing, lever classes, charkha page, advanced formulas) and
 * only ENRICH the prose. So: every existing scaffolding block (curiosity, image,
 * heading, latex, callout, worked_example, table, reasoning, quiz) is preserved
 * by reference; only the thin `text` body blocks are replaced with rich prose.
 * Expansion only. published stays false. Pass --dry to preview block order.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-science';
const CH = 7;
const uid = () => crypto.randomUUID();
const txt = (markdown) => ({ type: 'text', markdown });
const SCAFFOLD = new Set(['curiosity_prompt', 'image', 'reasoning_prompt', 'inline_quiz', 'worked_example', 'table', 'comparison_card', 'latex_block', 'heading']);

// ── per-page builders. Each gets the existing blocks E and finder helpers,
//    and returns the new ordered block list. ───────────────────────────────────
const SPECS = [
  // ── p145 ────────────────────────────────────────────────────────────────────
  { slug: 'work-energy-theorem', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.H(0), F.latex,
    txt(
`When you do positive work on an object, it doesn't just move — it gains the *capacity to do work* later. That stored capacity is what we call **energy**, and work is the bridge that carries it across.

Watch it happen. A fielder throws a cricket ball at the stumps; the moving ball knocks the wickets flying. A gardener lifts a flowerpot onto a high ledge; days later it slips, falls, and cracks the floor below. In each case the object *did work on something else* — and it could only do so because work was done on it first (the throw, the lift). Energy was handed over, then spent.`
    ),
    txt(
`This is the **work–energy theorem**, and it is beautifully simple:

> **The net work done on an object equals the change in its energy.**

That one sentence is often a shortcut past a tangle of force-and-acceleration calculations. It even holds when the force keeps changing — which is exactly when Newton's laws get cumbersome to apply directly.`
    ),
    txt(
`The sign of the work tells you which way the energy flows:

- **Positive work speeds an object up** — energy goes *in*, its kinetic energy rises.
- **Negative work slows it down** — energy is taken *out*, kinetic energy falls.
- **Zero net work leaves the speed unchanged.**

This is why speed matters so much for safety. Because kinetic energy depends on speed *squared*, doubling a car's speed doesn't double the energy a crash must absorb — it quadruples it.`
    ),
    F.C('exam_tip'), F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p146 ────────────────────────────────────────────────────────────────────
  { slug: 'forms-of-energy', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.table,
    txt(
`Energy is the capacity to do work — but it wears many disguises. The sunlight pouring through a window, the electricity humming in a ceiling fan, the chemical energy locked in the dal and roti you ate, the heat of a *chulha*, the sound of a temple bell, the nuclear energy powering the Sun: all of these are energy, just in different forms.`
    ),
    txt(
`The real magic is **conversion** — energy slipping from one form into another. Trace a couple of everyday chains:

- **Sun → you → motion:** nuclear energy in the Sun → sunlight → chemical energy in plants (photosynthesis) → chemical energy in your food → mechanical energy in your muscles → the motion of you walking.
- **Coal → light bulb:** chemical energy in coal → heat → mechanical energy spinning a turbine → electrical energy → light and heat in your home.

At every hand-off the *total* energy is preserved, but a little always escapes as low-grade heat — which is why no machine is ever 100% efficient.`
    ),
    txt(
`Because they are all the same underlying thing, every form is measured in the same unit — the **joule (J)**. Of all these forms, we will now zoom in on **mechanical energy** (energy of motion and position), because it links directly to the forces and motion you have already studied.`
    ),
    F.C('summary'), F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p147 ────────────────────────────────────────────────────────────────────
  { slug: 'kinetic-energy', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.latex,
    txt(
`The energy an object has **because it is moving** is called its **kinetic energy**. A rolling ball, a flowing river, a speeding bus, a thrown stone — anything in motion carries it, and the faster and heavier it is, the more it has.`
    ),
    txt(
`Where does the formula come from? Picture an object of mass $ m $ starting from rest and pushed by a steady force $ F $ over a distance $ s $:

1. From the equations of motion, $ v^2 = 2as $, so $ s = \\dfrac{v^2}{2a} $.
2. The work done is $ W = F \\times s = ma \\times \\dfrac{v^2}{2a} = \\dfrac{1}{2}mv^2 $.
3. By the work–energy theorem, that work is stored as the object's kinetic energy.

$$ E_k = \\frac{1}{2}mv^2 $$`
    ),
    txt(
`Two relationships are worth fixing in your mind:

- **Double the mass → double the kinetic energy** (it depends on mass directly).
- **Double the speed → four times the kinetic energy** (it depends on speed *squared*).

That squared term is the dangerous one. A modest rise in speed makes a far bigger jump in the energy a vehicle carries — and in the damage it can do.`
    ),
    F.worked, F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p148 ────────────────────────────────────────────────────────────────────
  { slug: 'potential-energy', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.H(0), F.latex,
    txt(
`Kinetic energy is the energy of *moving*. But an object can also hold energy in reserve — stored, waiting to be released. That stored-up energy is **potential energy**, and an object gains it in two ways: by being **lifted** against gravity, or by being **deformed**, like a stretched bow or a compressed spring.`
    ),
    txt(
`Here is a quick activity that makes it visible. Drop a heavy ball into a bed of loose sand from a height of 1 metre, then from 2 metres. The deeper crater comes from the higher drop — proof that the ball stored *more* energy when it was raised higher. The greater the height, the greater the potential energy.`
    ),
    txt(
`We can pin down the amount. To raise a mass $ m $ slowly to a height $ h $, you must push up with a force equal to its weight, $ mg $, through that height $ h $. The work you do, $ mgh $, is stored as gravitational potential energy:

$$ U = mgh $$

It is always measured relative to some chosen level (the floor, the ground, the valley below) — what really matters is the *change* in height. Think of the water held high behind the Tehri dam: enormous stored energy, released through turbines the moment it is allowed to fall.`
    ),
    txt(
`Lifting isn't the only way to store energy. Stretch a slingshot (*gulel*) or bend a bow and you do work against the internal forces of the elastic material; that work is stored in its deformed shape as **elastic potential energy**, ready to fling the stone or arrow the instant you let go.`
    ),
    F.worked, F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p149 ────────────────────────────────────────────────────────────────────
  { slug: 'conservation-of-energy', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.H(0), F.C('summary'),
    txt(
`Kinetic and potential energy are not separate accounts — they trade back and forth, and their sum (the **mechanical energy**) stays put as long as no outside force like friction interferes. Energy is never created or destroyed; it only changes form.`
    ),
    txt(
`Free fall shows this perfectly. Drop a ball from a height $ h $:

| Position | Kinetic energy | Potential energy | Total |
|---|---|---|---|
| At the top (still) | 0 | $ mgh $ | $ mgh $ |
| Halfway down | $ \\tfrac{1}{2}mgh $ | $ \\tfrac{1}{2}mgh $ | $ mgh $ |
| Just before landing | $ mgh $ | 0 | $ mgh $ |

At every instant, kinetic + potential = $ mgh $. The form keeps shifting, the total never moves. That is why the ball arrives at the ground with speed $ v = \\sqrt{2gh} $.`
    ),
    txt(
`A simple pendulum tells the same story. Pull the bob to one side and release it: at the top of its swing it is all potential energy, at the bottom all kinetic, and it rises *almost* to its starting height on the far side. *Almost* — because friction at the pivot and air resistance quietly drain a little energy away as heat with each swing, until it finally stops. The total energy is still conserved; it has just spread into forms we can no longer use.`
    ),
    F.C('exam_tip'), F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p150 ────────────────────────────────────────────────────────────────────
  { slug: 'power', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.latex,
    txt(
`Two students carry identical bags up the same staircase. One sprints up in a minute; the other strolls up in five. They do exactly the same *work* — same weight, same height — yet the sprint clearly demands something more. That something is **power**: not how much work is done, but how *fast*.`
    ),
    txt(
`Power is the rate of doing work:

$$ P = \\frac{W}{t} $$

Its SI unit is the **watt (W)**, equal to one joule per second, named after James Watt. Bigger jobs are measured in kilowatts (1 kW = 1000 W) and megawatts (1 MW = a million W).`
    ),
    txt(
`The table below gives a feel for the scale, from a glowing LED to a rocket. And since work is force times distance, power can also be written as $ P = F \\times v $ (force × speed) — a handy form for something like a car cruising steadily down a road.`
    ),
    F.worked, F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p151 ────────────────────────────────────────────────────────────────────
  { slug: 'simple-machines', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.H(0),
    txt(
`Some jobs are simply too hard to do with bare hands — lifting a sack onto a cart, hauling a bucket from a deep well, shifting a boulder. A **simple machine** is a device that makes such a job *feel* easier. It does this not by creating energy, but by changing the **size or the direction** of the force you have to apply.`
    ),
    txt(
`Here is the rule that governs every machine ever built: **you get nothing for free.** The work that comes out can never be more than the work you put in — friction always takes its cut. So if a machine lets you push with a *smaller* force, it makes you push through a *longer* distance to compensate. Force traded for distance; the total work unchanged.`
    ),
    txt(
`Two words make the rest of this clear. The force *you* apply is the **effort**; the force you are trying to overcome (usually a weight) is the **load**. How much a machine multiplies your force is its **mechanical advantage**:

$$ \\text{Mechanical advantage} = \\frac{\\text{load}}{\\text{effort}} $$

If MA is greater than 1, the machine multiplies your force (you lift more than you push). If MA equals 1, it only redirects the force. If MA is less than 1, it trades force for speed or distance. The table below sorts the common simple machines by what they do best.`
    ),
    F.table, F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p152 ────────────────────────────────────────────────────────────────────
  { slug: 'levers', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.H(0),
    txt(
`A **lever** is the most familiar simple machine of all: a stiff bar that pivots about a fixed point. Push down on one end and the other end swings up to lift a load. A crowbar prising open a crate, a pair of scissors, the *sabbal* used to break hard ground, even a humble seesaw — every one of them is a lever.`
    ),
    txt(
`Every lever has three parts: the **fulcrum** (the pivot it turns about), the **load** (the force to be overcome), and the **effort** (the force you apply). The distance from the fulcrum to the effort is the **effort arm**; from the fulcrum to the load, the **load arm**. A lever balances when

$$ \\text{effort} \\times \\text{effort arm} = \\text{load} \\times \\text{load arm} $$

So a *small* effort acting on a *long* arm can balance a *large* load on a short arm. That is the secret of the long crowbar that shifts a rock — and of Archimedes' famous boast that, given a long enough lever, he could move the world.`
    ),
    txt(
`The seesaw shows it at a glance. A light child sitting far from the pivot can balance a heavier child sitting close in: a 15 kg child 2 m out balances a 30 kg child just 1 m from the centre, because $ 15 \\times 2 = 30 \\times 1 $. The lever's mechanical advantage is simply the effort arm divided by the load arm — lengthen the effort arm and you lift more with less.`
    ),
    F.worked, F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p153 ────────────────────────────────────────────────────────────────────
  { slug: 'pulleys', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.H(0),
    txt(
`A **pulley** is a grooved wheel with a rope running over it. The simplest kind — a **fixed pulley** bolted to a beam overhead — doesn't reduce the force you need *at all*. What it gives you is a change of *direction*: you pull *down* on the rope, and the load goes *up*. That small change is a big convenience, because you can lean your whole body weight into a downward pull. It is how a flag climbs a pole and how a bucket of water rises from a village well.`
    ),
    txt(
`A **movable pulley** is cleverer. Here the load hangs from the pulley itself, and the rope supports it from *both* sides — so you lift it with only about *half* the force. String several pulleys together into a block and tackle and the mechanical advantage climbs higher still. This is exactly how cranes on a construction site and the lift in a tall building raise huge loads with a manageable pull.`
    ),
    txt(
`But the golden rule never sleeps. A pulley system that halves your effort makes you haul *twice* the length of rope. Less force, more distance — the work done stays exactly the same.`
    ),
    F.C('summary'), F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p154 ────────────────────────────────────────────────────────────────────
  { slug: 'inclined-planes', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.H(0), F.latex,
    txt(
`Try to lift a heavy trunk straight up onto a truck and it fights you every centimetre. Lay a plank from the ground to the truck-bed and slide it up instead, and the same trunk suddenly feels manageable. That plank is an **inclined plane** — the simplest machine of all, and one of the oldest.`
    ),
    txt(
`Why does it help? To reach a height $ h $, you push the load along the slope's length $ L $. Because the slope is *longer* than the height is *tall*, the force you need is *smaller*:

$$ \\text{Mechanical advantage} = \\frac{L}{h} = \\frac{1}{\\sin\\theta} $$

A 5 m ramp rising to a 1 m platform has MA = 5 — you push with only a fifth of the trunk's weight. The catch, as always, is distance: you travel five metres along the slope to gain one metre of height. Push a small force over the long slope, and the work equals lifting the big weight straight up.`
    ),
    txt(
`Once you see it, the inclined plane is everywhere. Mountain roads wind around hillsides in long, gentle curves instead of climbing straight up, so vehicles need far less force. Wheelchair ramps use a very shallow slope so the smallest push will do. And a screw is nothing but an inclined plane wrapped round and round into a spiral.`
    ),
    F.C('exam_tip'), F.diagram, F.reasoning, F.quiz,
  ]},

  // ── p155 ── (off-NCERT India context — kept per founder; enriched conservatively)
  { slug: 'machines-in-indian-traditional-life', build: (F) => [
    F.hook, F.hero, F.C('fun_fact'), F.H(0),
    txt(
`India's villages were full of clever machines long before anyone wrote the word "physics". Take Gandhi's **charkha** — the spinning wheel he turned into a symbol of self-reliance. It is a textbook **wheel-and-axle**: a large, hand-turned wheel of radius $ R $ linked to a tiny spindle of radius $ r $. One slow turn of the big wheel spins the small spindle many times over, because its mechanical advantage is $ R/r $. A wheel of radius 30 cm driving a 1 cm spindle makes the spindle whirl about 30 times for every single turn of your hand. Notice what it multiplies — not *force*, but *speed*: exactly what spinning needs, since thread is drawn out and twisted by rapid rotation.`
    ),
    F.H(1),
    txt(
`The **chakki**, the hand grinding-stone, is just as ancient — versions turn up in Indus Valley sites from around 2000 BCE. A handle works as a wheel-and-axle to rotate the upper of two circular stones while the lower one stays still; grain caught between them is crushed by the squeezing and rubbing of stone against stone.

The village well used a machine too. A single fixed pulley over the **kuan** lets you pull *down* on the rope — leaning on your own weight — to draw the bucket *up*. Scale that idea up and you arrive at the **rhat**, the Persian wheel still seen in parts of Punjab and Rajasthan: an endless chain of buckets turned by a pair of oxen, lifting water from deep below in a steady, continuous stream.`
    ),
    F.C('summary'), F.diagram, F.reasoning, F.quiz,
  ]},
];

async function main() {
  const DRY = process.argv.includes('--dry');
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    const col = db.collection('book_pages');
    for (const spec of SPECS) {
      const page = await col.findOne({ book_id: String(book._id), chapter_number: CH, slug: spec.slug });
      if (!page) { console.log(`❌ not found: ${spec.slug}`); continue; }
      const E = (page.blocks || []).map((b) => ({ ...b }));
      const imgs = E.filter((b) => b.type === 'image');
      const F = {
        hook: E.find((b) => b.type === 'curiosity_prompt'),
        hero: imgs[0],
        diagram: imgs[1] || null,
        latex: E.find((b) => b.type === 'latex_block'),
        worked: E.find((b) => b.type === 'worked_example'),
        table: E.find((b) => b.type === 'table'),
        reasoning: E.find((b) => b.type === 'reasoning_prompt'),
        quiz: E.find((b) => b.type === 'inline_quiz'),
        H: (n = 0) => E.filter((b) => b.type === 'heading')[n],
        C: (variant) => E.find((b) => b.type === 'callout' && b.variant === variant),
      };
      const out = spec.build(F).filter(Boolean);

      // safety: no scaffolding block dropped
      const keptIds = new Set(out.map((b) => b.id).filter(Boolean));
      const lost = E.filter((b) => SCAFFOLD.has(b.type) && b.id && !keptIds.has(b.id));
      if (lost.length) { console.log(`❌ ${spec.slug} ABORT — would drop: ${lost.map((b) => b.type).join(', ')}`); continue; }

      const seq = out.map((b, i) => ({ id: b.id || uid(), ...b, order: i }));
      console.log(`\np${page.page_number} ${spec.slug} — ${E.length}→${seq.length} blocks`);
      console.log('  ' + seq.map((b) => b.type).join(' → '));
      if (DRY) continue;
      await col.updateOne({ _id: page._id }, { $set: { blocks: seq, updated_at: new Date() } });
      console.log(`  ✅ written (published stays ${page.published})`);
    }
    if (DRY) console.log('\n[dry run] no writes performed.');
  } finally { await client.close(); }
}
main().catch((e) => { console.error(e); process.exit(1); });
