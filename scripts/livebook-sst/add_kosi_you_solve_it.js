'use strict';
// Chapter 2 flagship "You Solve It" (2026-07-10, founder design): the Kosi / Bihar
// floods — a real, unsolved Indian problem with real proposals on the table.
// Inserted on the rivers page as its capstone (after the reasoning check, before
// the quiz): content -> reason -> SOLVE a real problem -> quiz.
//
// Every fact web-verified before authoring (see source_note): "Sorrow of Bihar";
// ~21,000 km2 flooded annually; Aug 2008 Kusaha embankment breach, river jumped to
// a channel abandoned 100+ yrs earlier, 3M+ displaced; ~3,800 km of embankments
// over ~70 yrs during which flood-prone area GREW; Saptakosi/Barahkshetra high dam;
// Dinesh Kumar Mishra (Barh Mukti Abhiyan) + Ganga Flood Control Commission
// channel-restoration proposal. No image is removed; one you_solve_it block added.
const crypto = require('crypto');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const SLUG = 'rivers-waterfalls-meanders-and-deltas';
const AFTER_BLOCK_ID = '19d7f77f-63d5-4e34-8d27-3c9fe2a6515f'; // the reasoning_prompt

const BLOCK = {
  id: crypto.randomUUID(),
  type: 'you_solve_it',
  title: "The Sorrow of Bihar — Can the Kosi's Floods Ever Be Stopped?",
  problem:
    "Every single monsoon, the Kosi river floods North Bihar — so reliably that people have called " +
    "it the **‘Sorrow of Bihar’** for generations. Its floods spread across roughly " +
    "**21,000 square kilometres** of some of India's most fertile farmland, ruining crops and homes. " +
    "In **2008**, the Kosi smashed through its embankment at Kusaha, near the Nepal border, and " +
    "leapt into an old channel it had abandoned *more than a hundred years earlier* — displacing " +
    "over **3 million people** in a matter of days. For the families of the Kosi plains, this isn't " +
    "history in a textbook. It is most years of their lives.",
  why_hard:
    "Here is what makes the Kosi so hard to tame. It races down from the steep Nepal Himalaya " +
    "carrying one of the **heaviest loads of silt of any river on Earth**. When it reaches the flat " +
    "plains of Bihar and slows down, all that silt settles on the riverbed — raising the bed " +
    "higher and higher, year after year. Eventually the river is flowing *above* the level of the " +
    "farmland around it, straining against whatever walls we build. Worse still: when engineers " +
    "built long embankments to hold it in, the silt got trapped between the walls and the bed rose " +
    "*even faster* — so the very 'solution' quietly made the next flood bigger.",
  image_src: '',
  image_prompt:
    "A clean cross-section diagram of the Kosi river on the Bihar plains: the riverbed raised high " +
    "above the surrounding farmland, thick sediment layers building up between two embankment walls, " +
    "the water level straining above the fields on either side. Labels: raised riverbed, trapped " +
    "silt, embankment wall, farmland below river level. Dark background, orange accent labels, clean " +
    "technical illustration style.",
  image_caption:
    "Why the Kosi is so dangerous: trapped silt raises its bed above the surrounding land (illustration).",
  source_note:
    "Grounded in documented reporting on the Kosi (‘Sorrow of Bihar’, ~21,000 km² " +
    "flooded annually) and the 18 August 2008 Kusaha embankment breach that displaced 3 million+ " +
    "people, and in analyses of Bihar's embankment programme (~3,800 km built over ~70 years, during " +
    "which the flood-prone area rose rather than fell) — including the work of engineer Dinesh " +
    "Kumar Mishra of the Barh Mukti Abhiyan and the Ganga Flood Control Commission's channel-" +
    "restoration proposals.",
  solutions: [
    {
      id: crypto.randomUUID(),
      label: "Build a giant high dam upstream in Nepal (the Saptakosi / Barahkshetra dam)",
      upside:
        "A huge dam in the mountains could hold back floodwater during the monsoon, and also " +
        "generate electricity and store irrigation water — benefiting both India and Nepal.",
      tradeoff:
        "It would cost an enormous amount, sit in a high earthquake-risk zone, and hinge on a " +
        "cross-border agreement with Nepal that has been discussed for over 50 years without being " +
        "built. Many engineers also warn the reservoir would simply *fill up* with the Kosi's heavy " +
        "silt and lose its flood-holding power within a few decades.",
    },
    {
      id: crypto.randomUUID(),
      label: "Keep building the embankments higher and stronger",
      upside:
        "Embankments are the approach India already uses, and a taller, well-maintained wall can " +
        "hold back a bigger flood — buying time and shielding the towns directly behind it.",
      tradeoff:
        "This is exactly what has been tried for 70 years across ~3,800 km — and the flood-prone " +
        "area actually *grew*, because trapped silt keeps raising the riverbed. When a raised river " +
        "finally bursts a wall, the flood is far more sudden and destructive than an open flood " +
        "would have been.",
    },
    {
      id: crypto.randomUUID(),
      label: "Give the river room — desilt and reopen its old channels",
      upside:
        "Instead of squeezing the river into one narrow channel, reconnect it to its old abandoned " +
        "channels and ponds through sluice gates, and desilt them, so a flood spreads out thin, low " +
        "and short instead of piling up behind a wall. The spread silt even refreshes the farmland.",
      tradeoff:
        "It means deliberately handing land back to the river, and relocating or compensating the " +
        "people who farm there — a hard political and social ask, even where the engineering is " +
        "sound.",
    },
    {
      id: crypto.randomUUID(),
      label: "Stop trying to stop the flood — forecast it and move people in time",
      upside:
        "Accept that the Kosi will flood, and invest instead in accurate early-warning systems, " +
        "raised flood shelters, and planned evacuation — the cheapest and fastest way to save " +
        "lives.",
      tradeoff:
        "It protects people but not their homes, land or crops — the flood still arrives every " +
        "year. On its own it manages the disaster rather than reducing it.",
    },
  ],
  prompt:
    "If the decision were yours, which would you back to protect the people of the Kosi plains " +
    "— and, just as importantly, what is the single strongest objection to your *own* choice?",
  reality_check:
    "There is no settled answer — that is the honest truth. India still leans heavily on " +
    "embankments, even as the evidence that they backfired becomes harder to ignore. The high dam " +
    "has been debated for over half a century without being built. The 'give the river room' " +
    "approach is winning more support among river scientists, but asking people to surrender land " +
    "is politically brutal. Real flood policy usually ends up a messy blend — some embankments, " +
    "some forecasting, endless argument over the dam. You have just reasoned your way through a " +
    "problem that the country's own engineers, politicians and villagers are *still* arguing about.",
};

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: SLUG });
    if (!page) throw new Error('page not found: ' + SLUG);

    const out = [];
    let inserted = false;
    for (const b of page.blocks) {
      out.push(b);
      if (b.id === AFTER_BLOCK_ID) { out.push({ ...BLOCK }); inserted = true; }
    }
    if (!inserted) throw new Error('anchor block not found: ' + AFTER_BLOCK_ID);

    // guard: no media dropped
    for (const t of ['image', 'gallery', 'video']) {
      const before = page.blocks.filter((x) => x.type === t).length;
      const after = out.filter((x) => x.type === t).length;
      if (after < before) throw new Error(`ABORT: ${t} dropped (${before} -> ${after})`);
    }

    const reindexed = out.map((b, i) => ({ ...b, order: i }));
    const res = await bw.savePage(db, { slug: SLUG }, reindexed, {
      author: 'agent',
      summary:
        'Added Chapter 2 flagship "You Solve It" — the Kosi / Bihar floods, a real unsolved problem ' +
        'with real debated solutions (high dam / raise embankments / room-for-river / forecast). ' +
        'Web-verified facts, source cited. Inserted as page capstone; all media preserved.',
    });
    console.log(`✓ ${SLUG} saved (v${res.version || '?'}) — ${reindexed.length} blocks; you_solve_it added`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
