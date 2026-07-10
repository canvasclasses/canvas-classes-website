'use strict';
/**
 * Retrofits the 10 existing lesson pages (Ch.2 Skeletal + Ch.3 Heart) to the canonical
 * A&P template (ANATOMY_PHYSIOLOGY_BOOK.md) by ADDING, per page, the three new beats:
 *   • micro / histology view   (image, src:""+generation_prompt, 4:3)   — where it fits
 *   • clinical "what goes wrong" (callout variant 'warning', titled)     — where it fits
 *   • "in real life / in movement" section (heading + text)             — every page
 * (plus a reasoning_prompt on the one page that lacked one.)
 *
 * SAFETY (CLAUDE.md §0.6): purely ADDITIVE. Each page's existing blocks are read, the new
 * blocks (fresh uuids) are spliced in BEFORE the closing cluster, and the whole thing is
 * written via book-writer.savePage — which snapshots + runs the content-loss guard. We
 * never drop a block id, unlink a src, or shrink the page (reading time only grows), so the
 * guard stays green. `order` is renumbered (allowed — not a content loss). Pages stay
 * published:false. Run with --dry to preview diffs without writing.
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const DRY = process.argv.includes('--dry');
const u = () => uuidv4();
const blk = (type, extra) => ({ id: u(), type, ...extra }); // order assigned at splice time

// ── beat builders ───────────────────────────────────────────────────────────
const micro = (alt, caption, prompt) => blk('image', { src: '', alt, caption, width: 'full', aspect_ratio: '4:3', generation_prompt: prompt });
const clinical = (title, markdown) => blk('callout', { variant: 'warning', title, markdown });
const real = (heading, objective, markdown) => [
  blk('heading', { text: heading, level: 2, objective }),
  blk('text', { markdown }),
];
const reason = (reasoning_type, prompt, options, reveal, difficulty_level) =>
  blk('reasoning_prompt', { reasoning_type, prompt, options, reveal, difficulty_level });

// ── per-page new beats (in reading order) ────────────────────────────────────
const RETRO = {
  // ───────── CH.2 SKELETAL ─────────
  'what-your-skeleton-does': () => [
    micro('Red bone marrow under a microscope, full of developing blood cells',
      '📸 Down a microscope: red bone marrow, the blood-cell factory packed inside many bones.',
      'Microscope-style histology illustration of red bone marrow: a dense field of developing blood cells of ' +
      'different sizes and colours (red blood cells, white blood cells, platelets forming) packed between thin ' +
      'bony struts, with a few fat spaces. White labels with thin leader lines (developing red cells, white ' +
      'cells, bony strut). Soft reds, pinks and purples on a dark background (#0a0a0a), clean histology-textbook ' +
      'style, anatomically accurate, no stylisation.'),
    clinical('When It Goes Wrong — A Broken Bone',
      'Because bone is **living tissue** laced with blood vessels, a **fracture** (a crack or break) is an ' +
      'injury that can **heal itself**. Bone-building cells rush to the break, lay down a soft bridge, then ' +
      'harden it into new bone over weeks — which is why a cast simply holds the pieces still while the body ' +
      'does the repair. A dead, dry stick could never do that.'),
    ...real('In real life: your skeleton at work', 'Connect the five functions to everyday actions.',
      'You feel all five jobs of the skeleton every single day:\n\n' +
      '- **Standing and walking** lean on *support* (the scaffold holds you up) and *movement* (bones act as ' +
      'levers for your muscles).\n' +
      '- **A bike helmet or seatbelt** works *with* your skeleton’s *protection* job — adding armour where the ' +
      'skull and ribs already shield the brain and heart.\n' +
      '- **Weight-bearing exercise** (walking, dancing, lifting) tells your bones to stay dense and strong; ' +
      'bones you never load slowly weaken.\n' +
      '- Even while you sit still, your *marrow* is making **millions of blood cells a second** and your bones ' +
      'are topping up the blood’s **calcium**.'),
    reason('logical',
      'A long-term astronaut in zero gravity loses bone strength, even though nothing is broken. Using the idea that bone is living tissue, why might that happen?',
      [
        'In weightlessness the bones are barely loaded, so the body stops maintaining bone it seems not to need',
        'Bones dissolve in space because of the cold',
        'Astronauts simply stop having a skeleton',
        'Bone is dead material, so space cannot affect it',
      ],
      'Living bone constantly rebuilds itself in response to the loads it carries — the “use it or lose it” rule. ' +
      'In zero gravity there is almost no load, so the body quietly removes bone it thinks is unneeded, and ' +
      'astronauts return weaker. The same logic is why weight-bearing exercise keeps bones strong on Earth.',
      3),
  ],

  'inside-a-bone': () => [
    micro('Compact bone under a microscope showing circular osteons',
      '📸 Down a microscope: compact bone is built from tubes called osteons, each a bull’s-eye of rings around a central canal.',
      'Microscope-style histology illustration of compact (cortical) bone in cross-section, showing several ' +
      '**osteons** (Haversian systems): concentric rings (lamellae) arranged like tree-rings around a central ' +
      'canal that carries a blood vessel, with small dark bone-cell spaces (lacunae) between the rings. White ' +
      'labels with thin leader lines (osteon, central canal, lamellae, lacuna). Ivory and tan tones on a dark ' +
      'background (#0a0a0a), clean histology-textbook style, anatomically accurate, no stylisation.'),
    clinical('When It Goes Wrong — When the Marrow Factory Fails',
      'The soft **red marrow** inside bones is the body’s blood-cell factory. If it is damaged or crowded out — ' +
      'for example in **leukaemia**, a cancer of the blood-forming cells — it makes too few healthy red cells, ' +
      'white cells or platelets. The result can be **tiredness** (too few oxygen-carrying red cells), frequent ' +
      '**infections** (too few white cells), and easy **bruising** (too few platelets). It shows how much the ' +
      'rest of the body depends on this hidden factory.'),
    ...real('In real life: light, strong, and shock-absorbing', 'Explain why bone’s two textures suit how you move.',
      'The compact-plus-spongy design is engineering you use constantly:\n\n' +
      '- **Spongy bone keeps you light.** A solid skeleton would be far too heavy to move; the airy lattice at ' +
      'the bone ends gives strength for a fraction of the weight (the same trick that lets birds fly).\n' +
      '- **It absorbs impact.** When you jump and land, the spongy ends of the femur and shin spread the shock ' +
      'so the bone doesn’t shatter — like a crumple zone.\n' +
      '- **The hollow shaft is a strength trick.** A tube resists bending almost as well as a solid rod for much ' +
      'less material — which is also why scaffolding poles are hollow.'),
  ],

  'the-chemistry-of-bone': () => [
    clinical('When It Goes Wrong — Osteoporosis',
      'Bone is a living balance between building up and breaking down. With age — especially after menopause — ' +
      'the breaking-down can outpace the building, draining the **calcium mineral** until bones turn porous and ' +
      'brittle. This is **osteoporosis** (“porous bone”), and it makes fractures of the hip, wrist and spine far ' +
      'more likely from a small fall. It is largely silent until a bone breaks, which is why building strong ' +
      'bone *young* matters so much.'),
    ...real('In real life: feeding and loading your bones', 'Link bone chemistry to diet and exercise choices.',
      'You can actually influence the chemistry on this page:\n\n' +
      '- **Calcium in food** (milk, curd, leafy greens, ragi) supplies the raw mineral your bones store.\n' +
      '- **Vitamin D** (from sunlight and food) is the key that lets your gut absorb that calcium — without it, ' +
      'the calcium never arrives.\n' +
      '- **Weight-bearing exercise** signals bone-building cells to add mineral, raising bone density.\n' +
      '- The reverse is just as real: **long bed-rest or spaceflight** removes the load and bone is lost — proof ' +
      'that bone chemistry responds to how you live.'),
  ],

  'axial-and-appendicular': () => [
    clinical('When It Goes Wrong — A Curved Spine (Scoliosis)',
      'The **axial** skeleton’s job is to be the body’s straight central pillar. In **scoliosis**, the spine ' +
      'curves sideways into an S or C shape, often appearing during the growth spurts of childhood. A mild curve ' +
      'may need only watching, but a large one can twist the rib cage and crowd the lungs — a reminder that the ' +
      'axial skeleton isn’t just a stack of bones, it’s the alignment everything else hangs from.'),
    ...real('In real life: which bones take the hits', 'Predict which bones are most at risk in everyday falls.',
      'Knowing the two groups tells you where injuries land:\n\n' +
      '- **Put a hand out to break a fall** and you load the **appendicular** skeleton — the **wrist** and ' +
      '**collarbone** are among the most commonly broken bones for exactly this reason.\n' +
      '- **A helmet** guards the **axial** skull; a back brace or good lifting form protects the **axial** spine, ' +
      'which carries your whole upper-body weight all day.\n' +
      '- **The pelvic girdle** (appendicular) bears your weight every time you sit, stand and walk — which is why ' +
      'a hip fracture is so serious in older people.'),
  ],

  'joints-where-bones-meet': () => [
    micro('Joint cartilage under a microscope showing cells in small spaces',
      '📸 Down a microscope: the glassy cartilage that caps a joint, its cells (chondrocytes) sitting in tiny pockets.',
      'Microscope-style histology illustration of hyaline (joint) cartilage: a smooth, glassy matrix with ' +
      'rounded cells (chondrocytes) sitting singly and in small pairs inside little spaces (lacunae), arranged ' +
      'in rough columns from the surface down toward the bone. White labels with thin leader lines (smooth ' +
      'surface, chondrocyte, lacuna, matrix). Soft blue-white and pale tones on a dark background (#0a0a0a), ' +
      'clean histology-textbook style, anatomically accurate, no stylisation.'),
    clinical('When It Goes Wrong — Arthritis',
      'A freely movable joint glides because slippery **cartilage** caps the bone ends and **synovial fluid** ' +
      'oils them. In **osteoarthritis**, that cartilage slowly wears away with years of use, until bone rubs on ' +
      'bone — causing the stiffness, swelling and pain of arthritis, most often in the knees, hips and hands. It ' +
      'is the price of a lifetime of movement, and why worn joints are sometimes replaced with metal-and-plastic ones.'),
    ...real('In real life: joints in motion', 'Match joint shapes to the movements they allow in sport and daily life.',
      'Different joint shapes unlock different moves:\n\n' +
      '- The **ball-and-socket shoulder** swings in every direction — perfect for **throwing** a ball or bowling.\n' +
      '- The **hinge** knee and elbow swing one way like a door — built for **walking, kicking and lifting**.\n' +
      '- **Warming up** before sport gets the **synovial fluid** flowing, so the joint moves smoothly and is ' +
      'less likely to be hurt.\n' +
      '- Overstretch the **ligaments** that strap a joint together — a twisted ankle — and you get a **sprain**.'),
  ],

  // ───────── CH.3 HEART ─────────
  'what-the-heart-does': () => [
    micro('Cardiac muscle under a microscope showing branching striped fibres',
      '📸 Down a microscope: cardiac muscle — striped, branching fibres joined end to end so they beat as one.',
      'Microscope-style histology illustration of cardiac (heart) muscle: branching, striped (striated) muscle ' +
      'fibres joined end to end by dark cross-lines (intercalated discs), each fibre with a central nucleus. ' +
      'White labels with thin leader lines (striations, branching fibre, intercalated disc, nucleus). Warm pink ' +
      'and red tones on a dark background (#0a0a0a), clean histology-textbook style, anatomically accurate, no ' +
      'stylisation.'),
    clinical('When It Goes Wrong — A Heart Attack',
      'The heart muscle has its own blood supply — the **coronary arteries** — feeding it oxygen so it can beat ' +
      'non-stop. If one gets blocked (often by a fatty clot), the muscle beyond it is starved of oxygen and ' +
      'starts to die: a **heart attack**. This is why chest pain is taken so seriously, and why the muscle that ' +
      'pumps blood to everyone else cannot survive without its own.'),
    ...real('In real life: feeling your heart rate', 'Explain why heart rate changes with what you are doing.',
      'Your heart constantly adjusts to demand:\n\n' +
      '- **At rest** it beats about **70 times a minute**; **sprint or climb stairs** and it races toward ' +
      '**150+** to rush more oxygen to working muscles.\n' +
      '- **Fear or excitement** speeds it up too — that pounding chest before an exam is your heart pre-loading ' +
      'for action.\n' +
      '- **Fit athletes** often have a **lower** resting rate (sometimes 40–50): a stronger heart pushes more ' +
      'blood per beat, so it needs fewer beats.\n' +
      '- Press two fingers to your wrist or neck and you can **feel** each beat as a pulse.'),
  ],

  'the-four-chambers': () => [
    clinical('When It Goes Wrong — A Hole in the Heart',
      'The **septum** exists to keep oxygen-poor blood (right side) from mixing with oxygen-rich blood (left ' +
      'side). Some babies are born with a **hole in the septum** (a “hole in the heart”), letting the two mix so ' +
      'the body gets less oxygen than it should. Small holes may close on their own; larger ones are repaired — ' +
      'a vivid demonstration of *why* the wall has to be complete.'),
    ...real('In real life: the athlete’s stronger heart', 'Relate chamber wall thickness to training and effort.',
      'Wall thickness is a living record of work done:\n\n' +
      '- The **left ventricle** is the thickest chamber because it pushes blood around the **whole body** — the ' +
      'farthest journey.\n' +
      '- With **endurance training**, the heart muscle (especially the left ventricle) grows **stronger and ' +
      'thicker**, pumping more blood per beat — the “athlete’s heart”.\n' +
      '- It’s the same principle as the biceps growing with exercise: a muscle that works harder builds more ' +
      'muscle. The heart is, after all, a muscle.'),
  ],

  'heart-valves': () => [
    clinical('When It Goes Wrong — A Heart Murmur',
      'A healthy valve seals tightly, so blood only moves forward. If a valve becomes **leaky** (won’t close ' +
      'fully) or **narrowed** (won’t open fully), blood squirts or struggles through and makes an extra ' +
      'whooshing sound — a **murmur** — that a doctor hears through a stethoscope. Many murmurs are harmless, but ' +
      'a serious one can overwork the heart, and a badly damaged valve can be **replaced** with an artificial one.'),
    ...real('In real life: listening to your heart', 'Connect the valves to what a doctor hears and does.',
      'The valves are why a heartbeat is something you can hear and check:\n\n' +
      '- That **“lub-dub”** through a stethoscope is the valves **snapping shut** — a quick check that they’re ' +
      'closing on time.\n' +
      '- A **murmur** (an extra whoosh) is the clue a doctor listens for to find a leaky or narrowed valve.\n' +
      '- People with a worn-out valve can receive a **replacement** — a mechanical valve or one made from ' +
      'specially treated animal tissue — and go back to normal life.'),
  ],

  'follow-a-drop-of-blood': () => [
    clinical('When It Goes Wrong — A “Blue Baby”',
      'Double circulation works only if the oxygen-poor and oxygen-rich loops stay separate. Some babies are ' +
      'born with a heart defect that lets the two **mix**, so blood reaching the body carries too little oxygen ' +
      'and the skin and lips look **bluish** — a “blue baby”. Surgeons can often re-route or patch the heart to ' +
      'restore the two clean loops, underlining why the design keeps them apart.'),
    ...real('In real life: why you puff going uphill', 'Explain breathing and pulse changes using the two loops.',
      'The double loop speeds up the moment your cells need more:\n\n' +
      '- **Climbing stairs**, your muscles burn oxygen fast, so the **systemic loop** rushes more red blood to ' +
      'them and the **pulmonary loop** sends more blue blood to the lungs — you **breathe harder and your heart ' +
      'pounds** to keep both loops fed.\n' +
      '- **High in the mountains**, thin air means each breath carries less oxygen, so the body makes **more red ' +
      'blood cells** over time to carry what it can.\n' +
      '- When you **donate blood**, your body simply rebuilds the lost red cells over the following weeks.'),
  ],

  'blood-vessels': () => [
    clinical('When It Goes Wrong — Varicose Veins',
      'Veins carry blood back to the heart at **low pressure**, relying on small **one-way valves** to stop it ' +
      'sliding backward. If those valves weaken — often in the legs, after years of standing — blood **pools** ' +
      'and stretches the veins into the bulging, twisted ropes called **varicose veins**. It is the vein’s ' +
      'valve, the very feature from this page, failing at its one job.'),
    ...real('In real life: your pulse, and why legs swell', 'Apply artery and vein structure to everyday body signals.',
      'You can feel and see these vessels at work:\n\n' +
      '- **Your pulse** is the high-pressure surge from the heart stretching an **artery** with each beat — feel ' +
      'it at your wrist or neck.\n' +
      '- **Standing still all day** lets blood pool in the leg **veins** (low pressure), which is why feet swell; ' +
      '**walking** helps because the leg muscles squeeze the veins and push blood upward (the “muscle pump”).\n' +
      '- **Blood pressure** readings measure the push inside your arteries — too high, over years, strains both ' +
      'the arteries and the heart.'),
  ],
};

// ── splice: insert new beats just before the trailing closing cluster ─────────
// Closing cluster = the run of {inline_quiz, reasoning_prompt, callout(remember|exam_tip)}
// at the very end of the page. We insert immediately before it so the page still ends
// reasoning → remember → quiz.
function clusterStart(blocks) {
  const isCluster = (b) =>
    b.type === 'inline_quiz' ||
    b.type === 'reasoning_prompt' ||
    (b.type === 'callout' && (b.variant === 'remember' || b.variant === 'exam_tip'));
  let i = blocks.length;
  while (i > 0 && isCluster(blocks[i - 1])) i--;
  return i;
}

(async () => {
  await bw.withDb(async (db) => {
    let okAll = true;
    for (const [slug, build] of Object.entries(RETRO)) {
      const cur = await db.collection('book_pages').findOne({ slug });
      if (!cur) { console.log(`✗ ${slug} — NOT FOUND`); okAll = false; continue; }
      const blocks = [...cur.blocks];
      const at = clusterStart(blocks);
      const inserts = build();
      const merged = [...blocks.slice(0, at), ...inserts, ...blocks.slice(at)]
        .map((b, idx) => ({ ...b, order: idx }));
      const res = await bw.savePage(db, { slug }, merged, {
        author: 'agent', summary: `A&P retrofit: +${inserts.length} beats (micro/clinical/in-real-life) before closing cluster`,
        dryRun: DRY,
      });
      if (DRY) {
        console.log(`~ ${slug}: insert ${inserts.length} at order ${at} · ${cur.blocks.length}→${merged.length} blocks · wouldBlock=${res.wouldBlock} · added=${res.diff.addedBlockIds.length} removed=${res.diff.removedBlockIds.length} rt ${res.diff.rtOld}→${res.diff.rtNew}`);
      } else {
        console.log(`✓ ${slug}: ${cur.blocks.length}→${merged.length} blocks (v${res.version}) · added ${res.diff.addedBlockIds.length}, removed ${res.diff.removedBlockIds.length}`);
      }
    }
    console.log(okAll ? `\n${DRY ? 'DRY-RUN' : 'RETROFIT'} complete.` : '\nSOME PAGES MISSING ❌');
  });
})().catch((e) => { console.error(e); process.exit(1); });
