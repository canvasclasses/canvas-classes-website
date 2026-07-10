'use strict';
/**
 * Ch8 (Journey Inside the Atom) PROSE-ENRICHMENT — same bar/approach as Ch7.
 * Grounded in iesc108.pdf. Founder decision (carried from Ch7): KEEP ALL content,
 * only enrich the prose. Mechanism: in-place text substitution — every existing
 * `text` block's markdown is replaced with richer NCERT-grounded classroom prose;
 * ALL other blocks (curiosity/image/heading/callout/table/comparison_card/
 * worked_example/reasoning/quiz) pass through untouched, so scaffolding is
 * preserved by construction. The `texts` array per page MUST have exactly one
 * entry per existing text block, in order (engine aborts on mismatch).
 * published stays false. Pass --dry to preview.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-science';
const CH = 8;

const PAGES = [
  { slug: 'what-is-an-atom', texts: [
`Look around you — a brick, a house, the air you breathe, your own body. Take any of them and divide, and divide again, and you always arrive at the same place: the **atom**, the smallest particle of an element that still behaves like that element. Break a gold atom apart and you no longer have gold.

The word itself is more than two thousand years old. It comes from the Greek *atomos*, meaning "uncuttable" — the point past which, people once believed, nothing could be split. For most of history that was a *philosophical* idea, argued by thinkers who had no way to test it. Only in the last two centuries did careful experiments turn the atom from a guess into one of the best-understood objects in all of science.`,
`The modern picture of the atom did not arrive in a single flash of insight. It was built up over centuries, each scientist correcting the one before — a perfect example of how science really moves: one careful step at a time.

- **~600 BCE:** Acharya Kanad in India and Democritus in Greece, working entirely separately, both reasoned that matter must be made of tiny indivisible particles.
- **1808:** John Dalton turned the idea into the first *scientific* atomic theory, backed by experiment.
- **1897:** J.J. Thomson discovered the electron — proof that the "uncuttable" atom had parts inside it.
- **1911:** Rutherford found the nucleus.
- **1913:** Bohr explained how the electrons are arranged.
- **1932:** Chadwick discovered the neutron, completing the basic picture.

Every name on that list is a page in this chapter. Let us walk it.`,
  ]},

  { slug: 'acharya-kanads-parmanu', texts: [
`Kanad set down his thinking in the *Vaisesika Sutras* — the "Aphorisms on Particulars," one of the great texts of Indian philosophy. Strip away the ancient language and his claims are strikingly modern:

1. All matter (*dravya*) is built from *parmanu* — particles so small they cannot be divided any further.
2. These *parmanu* are eternal: they can be neither created nor destroyed.
3. They join together — two combining into a dyad, three into a triad, and so on — and it is out of these combinations that the whole material world, living bodies included, is built.

He had no laboratory and no instruments — only reasoning. Yet the shape of his idea (matter built from indivisible particles that combine in groups) is the shape modern chemistry would confirm more than two thousand years later. The one thing his account could not give was *how much* of each *parmanu* combines — a gap experiment would later fill.`,
`What makes this moment in history remarkable is that it happened *twice*, independently. In India, Kanad reasoned his way to *parmanu*. In Greece, a little later, Leucippus and his student Democritus arrived at almost the same conclusion and gave us the word *atomos*. Two civilisations, thousands of kilometres apart with no contact between them, asked the same question — "what is everything made of?" — and reached the same daring answer.

Neither had experimental proof; both were working from pure thought. But both pointed science in exactly the direction it would eventually travel.`,
  ]},

  { slug: 'thomsons-model', texts: [
`By the 1890s, scientists were experimenting with **cathode ray tubes** — sealed glass tubes with the air pumped out and a high voltage applied across two metal plates. A mysterious ray streamed from the negative plate (the **cathode**) towards the positive one (the **anode**).

In 1897, **J.J. Thomson** set out to discover what that ray actually was. He applied electric and magnetic fields across it and measured how far it bent. From the bending he worked out something astonishing: the ray was made of particles more than a thousand times *lighter* than the lightest atom, hydrogen. And it made no difference which metal or gas he used — the particles were always identical.

These tiny negative particles — later named **electrons** — had to be coming from *inside* the atoms themselves. The "uncuttable" atom clearly had smaller pieces within it. It was the first crack in the ancient idea.`,
`Thomson now faced a puzzle. He had found negatively charged electrons inside atoms — yet atoms as a whole carry no charge. Something positive had to be balancing all that negative.

His answer (1904) was the **Plum Pudding Model**: picture the atom as a ball of positive charge with the tiny negative electrons dotted all through it, like plums in a pudding — or, more familiar to us, like seeds scattered through the red flesh of a watermelon. The positive "pudding" and the negative "plums" exactly cancel, so the whole atom stays neutral.

It was the first genuine attempt to explain *how* an atom's charges are arranged. It turned out to be wrong — but being wrong in a *testable* way is exactly what let the next experiment prove it so.`,
  ]},

  { slug: 'rutherfords-model', texts: [
`To test Thomson's pudding, **Geiger and Marsden** — working under Ernest Rutherford — set up one of the most famous experiments in all of science. They fired a narrow beam of **alpha particles** (tiny, fast, positively charged particles, $\\ce{He^{2+}}$, thrown out by certain radioactive elements) straight at a sheet of gold foil only a few atoms thick. A glowing screen around the foil flashed wherever a particle struck, so they could see exactly where each one ended up.

If Thomson were right — positive charge spread thinly everywhere — every alpha particle should sail through with only the gentlest nudge. Most did exactly that. But a few were knocked aside at sharp angles, and a tiny number bounced almost straight back. This bouncing-off is called **scattering**, which is why the gold-foil experiment is also known as the alpha-ray scattering experiment.

That a heavy, fast alpha particle could be thrown backwards was a result so unexpected it stunned the team — like firing a cannonball at tissue paper and watching it rebound.`,
`From those few bounced-back particles, Rutherford drew a bold conclusion (1911): the atom's positive charge is not spread out at all. It is packed into a tiny, dense lump at the very centre — the **nucleus**.

1. At the heart of the atom sits a minute, dense, positively charged nucleus.
2. That nucleus carries essentially all the atom's positive charge and almost all of its mass.
3. The electrons circle far outside it, like planets around the Sun — which is why this is called the **planetary model**.

And the scale is staggering. The nucleus is about a hundred thousand times smaller than the whole atom. If an atom were blown up to the size of a cricket ground, the nucleus would be a single grain of pepper at the centre spot. Almost all of an atom — and therefore almost all of *you* — is empty space.`,
  ]},

  { slug: 'bohrs-model', texts: [
`Rutherford's planetary atom had a fatal flaw. By the laws of physics, a charged particle moving in a circle should constantly leak energy — so a circling electron ought to spiral into the nucleus and the atom should collapse in a fraction of a second. Atoms plainly do not do this. In 1913, a 27-year-old Dane named **Niels Bohr** fixed the problem with a few bold rules:

- **Electrons travel only in certain fixed orbits** — called **shells** or **energy levels** — never in between them.
- Each shell holds a **definite amount of energy**, which is why shells are also called energy levels. Shells nearer the nucleus have lower energy; those farther out have more.
- **While an electron stays in its shell, it does not lose any energy.** This is the key idea — it is what stops the atom from collapsing.
- An electron can **jump** from one shell to another only by absorbing or releasing a fixed packet of energy, exactly equal to the gap between the two shells.

The shells are labelled **K, L, M, N…** counting outward, or numbered **n = 1, 2, 3, 4…**`,
`There is a limit to how many electrons each shell can hold, and it follows a neat pattern:

| Shell | Symbol | n | Maximum electrons |
|---|---|---|---|
| First | K | 1 | 2 |
| Second | L | 2 | 8 |
| Third | M | 3 | 18 |
| Fourth | N | 4 | 32 |

The rule behind the numbers is simple: a shell numbered *n* can hold at most **2n²** electrons (2×1²=2, 2×2²=8, 2×3²=18, and so on). There is one more rule that matters for the lighter elements you will meet most often — the *outermost* shell never holds more than **8**. That single fact, as the next pages show, is the secret behind almost all of chemistry.`,
  ]},

  { slug: 'subatomic-particles', texts: [
`With the electron, the proton, and finally the neutron all discovered, the atom's three building blocks were known. A few facts tie them together:

- The **protons** (positive) and **neutrons** (no charge) sit packed together in the central **nucleus** — together they are called **nucleons**.
- The **electrons** (negative) move around the nucleus in shells, far outside it.
- An atom carries **no overall charge** because it holds exactly as many protons as electrons — the positives and negatives cancel out.
- Nearly all of the atom's **mass** lives in the nucleus, because a proton or neutron is about 1,800 times heavier than an electron. The electrons add almost nothing to the weight.`,
  ]},

  { slug: 'electron-distribution', texts: [
`Electrons are not scattered at random among the shells — they fill up in a strict, predictable order. Once you know that order, you can write the arrangement for any of the first twenty elements.

1. **Fill from the inside out.** The K shell (closest to the nucleus, lowest energy) fills first, then L, then M — an electron always takes the lowest empty seat available.
2. **Respect each shell's capacity:** K holds 2, L holds 8, M holds up to 18 — though for the lighter elements it pauses at 8 before the next shell begins.
3. **The outermost shell never exceeds 8.** This "rule of eight" is what shapes how every element behaves.

This arrangement — the count of electrons in each shell, written out shell by shell — is called the **electronic configuration** of the atom.`,
  ]},

  { slug: 'valence-electrons-and-valency', texts: [
`Of all an atom's electrons, only a handful do the real work of chemistry: the ones in the **outermost shell**. These are the **valence electrons**, and they are the part of the atom that actually meets and reacts with other atoms.

- Sodium (2,8,1) has **1** valence electron.
- Magnesium (2,8,2) has **2**.
- Aluminium (2,8,3) has **3**.
- Chlorine (2,8,7) has **7**.

Everything an element does in a reaction — whether it is violently reactive like sodium or completely inert like neon — traces back to how many electrons sit in that one outer shell.`,
`Atoms are at their most stable when their outermost shell is **full** — 8 electrons for most elements (an **octet**), or 2 for the very smallest, hydrogen and helium. The noble gases already have this, which is why they barely react at all. Every other atom is, in a sense, trying to reach the same comfortable state — by losing, gaining, or sharing electrons.

The number of electrons an atom must lose, gain, or share to complete its outer shell is its **valency** — its combining capacity.

- With **fewer than four** valence electrons, it is easier to *give them away*. Sodium (2,8,1) loses its single outer electron → valency **1**.
- With **more than four**, it is easier to *grab a few*. Oxygen (2,6) pulls in two electrons → valency **2**.
- With exactly four, carbon (2,4) neither gives nor takes easily — it **shares**, giving it a valency of **4**.

This one idea — atoms chasing a full outer shell — is the foundation of every chemical bond you will ever study.`,
  ]},

  { slug: 'atomic-number-and-mass-number', texts: [
`Of all the numbers you can attach to an atom, one is special: it decides *which element the atom is*. That number is the **atomic number (Z)** — simply the count of **protons** in the nucleus.

- It is the atom's identity card. Six protons means carbon — always. Add one proton and it becomes nitrogen; remove one and it is boron. Change Z and you change the element itself.
- In a neutral atom, the number of electrons equals the atomic number too.

Examples: H (Z=1), C (Z=6), O (Z=8), Na (Z=11), Fe (Z=26).`,
`The protons decide *what* the atom is; the protons **and** neutrons together decide how *heavy* it is. The **mass number (A)** is the total count of protons plus neutrons in the nucleus:

$$ A = Z + N $$

where N is the number of neutrons. Rearranging gives a result you will use constantly:

**Number of neutrons = A − Z**

We write an element with its mass number on top and its atomic number below — for example $^{12}_{6}\\text{C}$, carbon, with 6 protons and a mass number of 12 (and therefore 6 neutrons).`,
  ]},

  { slug: 'isotopes', texts: [
`Dalton had assumed that every atom of an element was an identical twin — same mass, same everything. He was *almost* right. Atoms of the same element always have the same number of protons (the same atomic number) — but they can carry **different numbers of neutrons**, which gives them different masses.

These same-element-different-mass versions are called **isotopes**. Because they have identical proton (and electron) counts, all isotopes of an element share the **same chemical behaviour** — they react in exactly the same way — but differ in their **mass** and slightly in physical properties such as boiling and melting points.

Hydrogen is the textbook case. It comes as three isotopes: protium (no neutrons, ~99.98%), deuterium (1 neutron), and tritium (2 neutrons) — all still hydrogen, because all still have a single proton.`,
`Because isotopes behave chemically like the ordinary element but can be detected or are radioactive, they have become quietly essential to modern India:

- **Iodine-131** treats thyroid cancer and an overactive thyroid — the gland naturally soaks up iodine, so the isotope is delivered straight to where it is needed.
- **Technetium-99m**, the most widely used medical isotope of all, lights up bone scans, heart scans, and cancer checks.
- **Cobalt-60** powers the radiation machines used to treat tumours.
- **Carbon-14** lets archaeologists read the age of ancient bones and artefacts.

Same chemistry, different mass — and a tool that saves lives.`,
  ]},

  { slug: 'isobars', texts: [
`Isotopes are *same element, different mass*. **Isobars** are the mirror image: **different elements that happen to share the same mass number**.

How can that be? Remember that mass number = protons + neutrons. Two different elements have different proton counts — but if their neutron counts make up the difference, the totals can still match.

The classic trio is **calcium** (20 protons), **potassium** (19), and **argon** (18). They are three completely different elements with completely different chemistry, yet each has a mass number of **40** — because as the proton count drops, the neutron count rises to compensate. Same total nucleons, different elements: that is an isobar.`,
  ]},

  { slug: 'iupac-symbols', texts: [
`Imagine writing out "two atoms of hydrogen joined to one of oxygen" every single time you meant water. Chemistry needed shorthand. John Dalton tried first, in 1803, with little **pictorial symbols** — a circle for oxygen, a dotted circle for hydrogen. They were charming but hopeless to draw and remember.

In 1813, Berzelius gave us the system we still use: a letter or two taken from the element's name. Today the **International Union of Pure and Applied Chemistry (IUPAC)** sets the official names and symbols, so that a chemist in Japan and one in Brazil both write "Na" for sodium. The rules are simple:

- The symbol is usually the first letter, or the first two letters, of the name.
- The first letter is always a **capital**; the second (if there is one) is **lowercase** — H, He, Ca, Cl (not CL).
- Some symbols come from older Latin, Greek, or German names — which is why iron is **Fe** (*ferrum*), sodium **Na** (*natrium*), and tungsten **W** (*wolfram*).`,
  ]},

  { slug: 'atomic-mass-unit', texts: [
`A single proton weighs about 0.00000000000000000000000000167 kilograms. Printing that next to every element on the periodic table would be absurd. So chemists invented a unit sized for atoms: the **atomic mass unit (u)**.

**1 atomic mass unit = one-twelfth of the mass of a single carbon-12 atom.** (In everyday units, 1 u ≈ 1.66 × 10⁻²⁷ kg.)

On this scale the numbers become friendly:

- a proton weighs about **1 u**,
- a neutron also about **1 u**,
- and an electron only about 0.0005 u — so light that it is treated as **negligible**.

(You may also see the older abbreviation "amu" used for the same unit.)`,
`Here is a subtlety. Most elements occur in nature as a *mixture* of isotopes, each with its own mass. So what single mass do we print on the periodic table? We use the **relative atomic mass** — the **weighted average** of all the isotopes, counting each one according to how common it is.

Chlorine is the perfect example. It comes as two isotopes — ³⁵Cl (about 75%) and ³⁷Cl (about 25%). A plain average would give 36, but that ignores how much of each there is. Weighting by abundance:

$$ \\left(35 \\times \\tfrac{75}{100}\\right) + \\left(37 \\times \\tfrac{25}{100}\\right) = 35.5\\ \\text{u} $$

That is why chlorine's mass reads 35.5 — not because any single chlorine atom weighs 35.5 u (none does), but because that is the average of the mixture as it actually occurs in nature.`,
  ]},

  { slug: 'indian-scientists-atomic-science', texts: [
`India's atomic story has a clear founder: **Homi Jehangir Bhabha (1909–1966)**. He studied physics at Cambridge, won the prestigious Adams Prize, and then chose to come home. In 1944 — before independence — he wrote to the Sir Dorabji Tata Trust proposing a world-class nuclear research institute, and won the funding to build it. From almost nothing, he laid the foundations of India's entire nuclear programme, founding the Tata Institute of Fundamental Research (TIFR) and the centre that now carries his name, the Bhabha Atomic Research Centre (BARC). He is rightly remembered as the father of India's nuclear programme.`,
`Atomic science is not locked away in laboratories — it runs quietly through everyday Indian life:

- **Power:** India's nuclear reactors feed thousands of megawatts of electricity into the national grid, with capacity being expanded for the decades ahead.
- **Medicine:** BARC produces the medical isotopes that power cancer treatment and diagnostic scans in hospitals across the country.
- **Agriculture:** radiation is used to breed hardier, higher-yielding crop varieties and to keep stored food from spoiling.

From a standing start in 1947, India built all of this within a single generation — a direct descendant of the very questions about the atom that this chapter has been asking.`,
  ]},

  { slug: 'journey-inside-the-atom', texts: [
`Imagine a machine that could shrink you to the size of an atom and set you down on the surface of a single copper atom — about 0.13 nanometres across. What would you find?

**At the atom's scale**, you would be surrounded by a blur — the electron cloud, a fuzzy region where copper's 29 electrons move at a sizeable fraction of the speed of light. The outermost one is held only loosely, which is exactly why copper carries electricity so well.

**Then you would travel inward** — and travel, and travel. The nucleus is so tiny compared with the atom that almost the whole journey is through empty space. Only at the very centre would you finally reach it: a dense knot of protons and neutrons holding nearly all the atom's mass in a space tens of thousands of times smaller than the atom itself.`,
`Step back, and the atom overturns some of our deepest everyday assumptions about matter:

- **Solid things are mostly empty.** Your body, this book, the chair you are sitting on — each is more than 99.99% empty space. What *feels* solid is really electric forces pushing back, not matter filling the gap.
- **Forces, not tiny solid balls, decide what matter does.** Whether a substance is a metal, a gas, or a living cell comes down to how its electrons are arranged and how they pull and push on one another.
- **The same few particles build everything.** Just protons, neutrons, and electrons, combined in different numbers, make every one of the hundred-plus elements — and so every object in the universe.`,
`**Try this thought:** every carbon atom in your body was forged inside a star that lived and died long before the Sun existed. The iron in your blood was made in a supernova. Every element heavier than iron was born in a stellar explosion and flung across space — and some of it eventually became *you*. You are, quite literally, made of stardust.`,
  ]},

  { slug: 'frontier-understanding-atom', texts: [
`After more than two centuries of work, our picture of the atom is extraordinarily sharp. We can:

- count and place the protons, neutrons, and electrons in any atom;
- measure the energy of each electron shell to many decimal places;
- describe the forces that bind the nucleus together with great precision.

The atom is one of the best-understood objects in all of science. And yet — it still keeps secrets.`,
`Push to the edges, and profound questions remain:

**What is most of the universe made of?** Everything this chapter describes — atoms, you, stars, galaxies — adds up to only about 5% of the universe. Roughly 27% is **dark matter**, which has gravity but does not seem to be made of atoms at all, and the rest is the even stranger **dark energy**. We can feel their effects; we do not yet know what they are.

**Can the atom be split further?** Protons and neutrons are themselves built from smaller particles called **quarks**. Are quarks truly fundamental, or is there another layer below them? Nobody yet knows.

**Why is the quantum world so strange?** At the atomic scale, an electron has no definite position until it is measured, and two particles can be linked across distance in ways that defy common sense. The rules clearly *work* — they power every modern device — but what they *mean* is still debated.`,
`**The frontier question for you:** Is it possible to ever *completely* understand everything that happens inside an atom?

This is one of the open-ended goals of the new curriculum — and it is deliberately a question without a tidy answer. It is here to remind you that science is never "finished." Every answer opens new questions, and the journey inside the atom — begun by Kanad with nothing but careful reasoning — is still very much underway. The next discovery might be yours.`,
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
    let okCount = 0;
    for (const spec of PAGES) {
      const page = await col.findOne({ book_id: String(book._id), chapter_number: CH, slug: spec.slug });
      if (!page) { console.log(`❌ not found: ${spec.slug}`); continue; }
      const E = (page.blocks || []).map((b) => ({ ...b }));
      const textIdx = E.map((b, i) => (b.type === 'text' ? i : -1)).filter((i) => i >= 0);
      if (textIdx.length !== spec.texts.length) {
        console.log(`❌ ${spec.slug}: has ${textIdx.length} text blocks but ${spec.texts.length} replacements — SKIP`);
        continue;
      }
      let t = 0;
      const out = E.map((b) => (b.type === 'text' ? { ...b, markdown: spec.texts[t++] } : b))
                   .map((b, i) => ({ ...b, order: i }));
      console.log(`p${page.page_number} ${spec.slug} — ${textIdx.length} text blocks rewritten (${E.length} blocks, scaffolding intact)`);
      if (DRY) continue;
      await col.updateOne({ _id: page._id }, { $set: { blocks: out, updated_at: new Date() } });
      console.log(`  ✅ written (published stays ${page.published})`);
      okCount++;
    }
    if (DRY) console.log('\n[dry run] no writes performed.');
    else console.log(`\nDone: ${okCount}/${PAGES.length} pages enriched.`);
  } finally { await client.close(); }
}
main().catch((e) => { console.error(e); process.exit(1); });
