'use strict';
/**
 * Ch.11 pages 2–4: asexual-reproduction, sexual-reproduction, flower-anatomy.
 * Source: iesc111.pdf §11.1 (p209-212), §11.2 / §11.2.1 (p212-214), §11.2.2 (p214-215).
 * All claims grounded in source. Strong non-obvious hook + reasoning block + tricky
 * balanced quiz per page (§4B / §3.6.1). Run: node scripts/science-ch11/build_p2_4.js [--dry]
 */
const { img, txt, h, h3, cur, callout, cmp, table, reason, q, quiz, applyPages } = require('./_lib');

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2 — Asexual Reproduction
// ─────────────────────────────────────────────────────────────────────────────
const p2 = {
  slug: 'asexual-reproduction',
  subtitle: 'How a single parent — and sometimes a single leaf — can make a whole crowd of copies',
  blocks: [
    cur(
      'Take a single leaf of a plant, lay it on damp soil, and walk away. Come back a few weeks later and you find a tiny row of baby plants growing straight out of the edges of that one leaf — no seed, no flower, not a second plant anywhere in sight. One leaf has quietly become many plants. How is that even possible?',
      'The baby plants are not a mix of two parents. They came from one.',
      'You have just met reproduction at its simplest — one parent, no partner needed. Let us see how many clever tricks living things use to pull this off.'
    ),
    img(
      'A Bryophyllum leaf lying on soil with tiny plantlets sprouting along its notched edges, alongside a budding yeast cell, a hydra with a bud, and bread mould',
      'Wide 16:5 banner, dark background. Left: a Bryophyllum (sprout-leaf) lying on dark soil with a neat row of tiny green plantlets growing out of the notches along its edge. Middle: a microscope-style view of a single yeast cell with a small round bud bulging from its side. Right: a green hydra with a small bud growing out of its body, and a patch of fuzzy grey-black bread mould. Clean, labelled-diagram feel, soft natural colours. No text.'
    ),
    callout('fun_fact', 'Every Banana Is a Twin',
`Here is a strange thought for your next fruit break. Almost every banana sold in the world is a **clone**. They are all grown from cuttings of the same kind of plant, so they share the exact same genes — no seeds needed. That makes them easy to grow, but it hides a danger: because the plants are all identical, a single disease that can kill one can wipe out whole plantations at once. Sameness is convenient, but it is risky.`),
    h('Making New Life With Just One Parent', 'See what makes asexual reproduction different from having two parents.'),
    txt(
`In **asexual reproduction**, there is only **one parent**. No partner, no mixing. The new individuals are near-exact copies of that single parent, so we call them **clones**.

This is the everyday way of life for many simple living things — bacteria, *Amoeba*, yeast, *Hydra*, sponges — and for a great many plants too. There is no flower, no seed, and no waiting for a partner to come along.`),
    h('Three Ways Nature Makes Copies'),
    txt(
`Plants are masters of this. Many simply grow a brand-new plant from a part of themselves — a process called **vegetative propagation**. The "eyes" on a potato, the knobs on ginger, a cut piece of money-plant or sugarcane stem, even the leaf you read about above (*Bryophyllum*) — each can grow into a full new plant. Because there is only one parent, every new plant is genetically identical to it.`),
    txt(
`Tiny living things have their own methods. In **budding**, a small bump grows on the parent and then breaks off as a new individual — this is how yeast multiplies, and how a *Hydra* grows little buds along its body. In **spore formation**, the fuzzy mould on stale bread (*Rhizopus*, *Aspergillus*) makes thousands of tiny **spores** packed in a little sac. The spores are so light they float away on the air, and any that land on something moist grow into new mould.`),
    table('Three natural ways of asexual reproduction',
      ['Method', 'What happens', 'Seen in'],
      [
        ['Vegetative propagation', 'A new plant grows from a root, stem, or leaf', 'Potato, ginger, money plant, Bryophyllum'],
        ['Budding', 'A bump grows on the parent and detaches', 'Yeast, Hydra'],
        ['Spore formation', 'Many light spores form, float off, and grow', 'Bread moulds (Rhizopus, Aspergillus)'],
      ]),
    txt(
`Underneath all three is the same engine: ordinary cell division (**mitosis**) that copies a cell into two identical ones. Because nothing is mixed in from a second parent, the offspring are clones. The big advantage is **speed** — one parent can flood a place with copies very fast, which works beautifully when conditions are good.`),
    reason('logical',
      'Bread mould makes millions of tiny, light spores that drift in the air. A mango tree makes far fewer, heavier seeds. If both just want to make more of their own kind, why would the mould "bother" making millions of cheap spores instead of a few well-stocked ones?',
      [
        'Because spores are alive while seeds are not',
        'Because most spores land somewhere unsuitable and die, so making millions raises the chance that a few survive',
        'Because mould is not able to build large structures like seeds',
        'Because each spore later turns into a seed',
      ], 1,
      'A floating spore has no say in where it lands — most will dry out, get eaten, or fall on bare ground. By making millions of cheap, light spores, the mould plays a numbers game: even if almost all fail, a few will land on damp bread or fruit and grow. It is quantity over care. (You will see plants play the very same numbers game with pollen later in this chapter.)',
      3),
    callout('bridging_science', 'How Farmers Borrowed Nature\'s Trick',
`Farmers and gardeners copied asexual reproduction to grow exactly the plants they want. **Cutting, grafting, layering,** and **tissue culture** all make identical copies of a chosen plant. Banana growers, for example, use tissue culture to mass-produce healthy, disease-free plants from a single good one. To spread these skills, **Krishi Vigyan Kendras** run by the **Indian Council of Agricultural Research (ICAR)** train farmers across India in grafting and modern propagation.`),
    quiz([
      q('In asexual reproduction, the new individuals are —',
        [
          'exact genetic copies of the single parent',
          'a mix of features from two parents',
          'always larger and stronger than the parent',
          'unable to reproduce when they grow up',
        ], 0,
        'One parent, no mixing, so the offspring are genetic copies (clones). Option B describes sexual reproduction. Size and strength have nothing to do with it — that is the slip in C and D.',
        1),
      q('A farmer wants to quickly fill a field with plants identical to one excellent sugarcane plant. Which method should he choose?',
        [
          'Plant the seeds from its flowers',
          'Plant stem cuttings taken from that plant',
          'Cross it with a wild sugarcane variety',
          'Wait for spores to spread from it',
        ], 1,
        'Stem cuttings are asexual, so each new plant is an identical copy — the excellent quality is kept. Seeds (A) and crossing (C) both involve mixing, so the offspring may differ. And sugarcane does not use spores (D) — that is the mould\'s trick, not a flowering plant\'s.',
        2),
      q('Why can one new disease sometimes destroy an entire field grown by vegetative propagation, while a field grown from seeds may partly survive?',
        [
          'Seed-grown plants grow faster and outrun the disease',
          'Seeds carry natural medicines that protect the plants',
          'Vegetatively grown plants are weaker because they have one parent',
          'They are all identical, so every plant shares the same weakness',
        ], 3,
        'Vegetatively grown plants are clones — identical strengths and identical weaknesses. If the disease can beat one, it can beat them all. Seed-grown plants vary, so some may happen to resist. Note C\'s trap: clones are not "weaker", they are simply the same.',
        3),
    ]),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3 — Sexual Reproduction
// ─────────────────────────────────────────────────────────────────────────────
const p3 = {
  slug: 'sexual-reproduction',
  subtitle: 'Two parents, a clever halving trick, and why no two people are ever quite the same',
  blocks: [
    cur(
      'Your parents could have had millions of different children — and only one of them is you. Every other possible brother or sister, with a slightly different face, height, or nature, simply never got made. You are one single winning combination out of a staggering number that never happened. Where do all these possible-but-never-born siblings come from?',
      'It has to do with how features from two parents get shuffled together.',
      'That shuffling is the whole point of sexual reproduction. Let us find out how two parents mix their instructions — and why nature went to so much trouble to do it.'
    ),
    img(
      'A family where each of four children clearly looks different from the others, beside a diagram of coloured bead pairs being mixed into new combinations',
      'Wide 16:5 banner, dark background. Left half: a warm family scene with two parents and four children who each look distinctly different — different heights, hair, faces. Right half: three pairs of coloured beads (green, blue, red) with dotted lines showing one bead from each pair combining into a new row at the bottom, illustrating random combinations. Clean, friendly diagram style. No text.'
    ),
    callout('fun_fact', 'More Combinations Than People on Earth',
`From just the shuffling of chromosomes, a single couple could produce over **80 lakh** (8 million) genetically different children — and that is before other kinds of mixing are even counted. This is why, identical twins aside, **no two people who have ever lived are genetically the same**. The person sitting next to you is, genetically, a one-time-only event in the history of the planet.`),
    h('Why Bother With Two Parents?', 'Understand the one big advantage two parents give that one parent cannot.'),
    txt(
`**Sexual reproduction** needs **two parents**, and both hand over some of their genetic instructions to the child. The child ends up with a **mix** of features from both — which is exactly why brothers and sisters resemble their parents in some ways but are never copies of them, or of each other.

This mixing is the great strength of sexual reproduction. Instead of clones, it produces **variety** — and variety, as we will see, is what helps a whole kind of living thing survive when the world changes.`),
    h('The Doubling Problem — and Its Clever Fix'),
    txt(
`But mixing two parents hides a maths trap. Your body cells each carry **46 chromosomes** — thread-like structures in the nucleus that hold your genetic instructions, arranged as **23 pairs**, one of each pair from each parent. Now, if a child got a full set of 46 from the mother *and* a full 46 from the father, it would have 92. Its child would have 184. The number would double every generation — clearly impossible.

Nature solves this with a special kind of cell division called **meiosis**. Meiosis makes the sex cells, or **gametes**, and it **halves** the chromosome number while doing so. So a human gamete carries just **23** chromosomes, not 46. The male gamete is the **sperm**; the female gamete is the **egg**. (In plants, the **pollen grain** carries the male gamete and the **ovule** holds the female gamete.)`),
    table('How meiosis keeps the chromosome number steady (humans)',
      ['Cell', 'Chromosomes', 'Made by'],
      [
        ['Ordinary body cell', '46 (23 pairs)', 'Mitosis'],
        ['Gamete (sperm or egg)', '23', 'Meiosis (halving)'],
        ['Zygote (sperm + egg join)', '46 again', 'Fertilisation'],
      ]),
    reason('logical',
      'Suppose meiosis did not exist, and every sperm and every egg carried the full 46 chromosomes, just like an ordinary body cell. What would happen to the human chromosome number over a few generations?',
      [
        'It would stay at 46, because the body corrects it automatically',
        'It would double each generation — 46, then 92, then 184, and so on',
        'It would fall by half in each new generation',
        'It would jump around randomly with no pattern',
      ], 1,
      'A zygote adds the chromosomes from both gametes together. If each gamete brought a full 46, the child would have 92, the next child 184, and so on — doubling forever, which life could not handle. Meiosis prevents this by halving the count when gametes form (46 → 23), so that sperm (23) + egg (23) restores exactly 46. That is the whole reason meiosis exists.',
      3),
    h('Why Being Different Is a Superpower'),
    txt(
`When gametes form, the pairs of chromosomes are split up **at random**, so each gamete gets its own mix. With only 3 pairs you could already make 8 different combinations; with all 23 pairs the number runs into millions. That is why every child is a fresh, unique blend.

Now stretch this across thousands of generations. Some of these varied offspring will, by chance, cope better with a new challenge — a hotter climate, a new disease. They survive and pass on their version. Slowly, the whole kind of living thing changes. This is how variation feeds **evolution**.`),
    callout('threads_of_curiosity', 'Hidden Human Superpowers',
`Some people can drink milk their whole lives with no trouble, while others feel sick from it as adults. Some communities have lived for thousands of years high in the mountains, where the air is thin, and their bodies cope with the low oxygen just fine. None of this is magic — it is **variation**, mixed and passed down and built up over many generations. What other quiet superpowers might be hiding in the human family, waiting for the right moment to matter?`),
    quiz([
      q('Meiosis is a special type of cell division that —',
        [
          'halves the number of chromosomes to make gametes',
          'doubles the number of chromosomes in a cell',
          'copies a cell exactly, as in asexual reproduction',
          'joins a sperm and an egg into a zygote',
        ], 0,
        'Meiosis halves the chromosome number so that gametes carry half a set (23 in humans). Doubling (B) is the opposite. Exact copying (C) is mitosis, and joining gametes (D) is fertilisation — both easy to mix up with meiosis.',
        1),
      q('A human sperm carries 23 chromosomes and a human egg carries 23. How many will the zygote have, and why?',
        [
          '23, because only the stronger gamete\'s chromosomes survive',
          '46, because the chromosomes from both gametes add together',
          '92, because each gamete\'s set is doubled when they join',
          '23, because the two half-sets cancel each other out',
        ], 1,
        '23 from the sperm plus 23 from the egg gives 46 — the full body-cell number is restored. Nothing is doubled at joining (that is C\'s trap) and nothing cancels out (D). This is exactly why meiosis halved the count in the first place.',
        2),
      q('Apart from identical twins, why is it almost impossible for two people to be genetically exactly the same?',
        [
          'Because everyone eats different food while growing up',
          'Because each person has a slightly different number of chromosomes',
          'Because the mixing in sexual reproduction allows a huge number of combinations',
          'Because a person\'s chromosomes keep changing randomly through life',
        ], 2,
        'The random shuffle of chromosomes during meiosis can produce millions of combinations, so each child is a unique blend. Option A confuses genes with environment (food affects you, but it is not your genes). B and D are simply false — chromosome number is fixed and does not drift through life.',
        3),
    ]),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4 — Flower Anatomy
// ─────────────────────────────────────────────────────────────────────────────
const p4 = {
  slug: 'flower-anatomy',
  subtitle: 'A flower is not decoration — it is a reproductive organ running a clever advertising campaign',
  blocks: [
    cur(
      'We grow flowers because they look pretty and smell sweet. But here is the twist: the plant did not make that bright colour and that perfume for us — it does not care about us at all. A flower is an advertisement, and it is aimed at someone very specific. Who is the flower really trying to attract, and what does it want from them?',
      'Think about who visits a flower and what they carry away on their bodies.',
      'A flower is the reproductive organ of a plant, and every part of it has a job. Once you see those jobs, the colours and smells suddenly make perfect sense.'
    ),
    img(
      'A large labelled cut-away of a flower showing sepal, petal, stamen with anther and filament, and pistil with stigma, style, ovary and ovules',
      'Wide 16:5 banner, dark background. A clean, large botanical cut-away (longitudinal section) of a single bright flower, clearly showing: green sepals at the base, coloured petals, the stamen (a thin filament topped by an anther), and the central pistil (sticky stigma at the top, a slender style, and a swollen ovary at the bottom containing small round ovules). Crisp textbook-diagram style with soft colours. No text labels in the image itself.'
    ),
    callout('fun_fact', 'You Have Eaten a Flower\'s Private Parts',
`The world\'s costliest spice, **saffron** (*kesar*), is nothing but the dried **stigmas** — the female part — of a small crocus flower. Each flower gives only three tiny threads, all picked by hand, so it takes around **1,50,000 flowers** to make a single kilogram. The next time saffron colours your kheer or biryani, remember: you are eating the reproductive parts of a flower.`),
    h('A Flower Is a Reproductive Organ', 'See why a flower\'s beauty is really a tool for reproduction.'),
    txt(
`A flower is the **reproductive organ** of a flowering plant. Its bright petals, its colours, and its scent are not there to please us — they are **advertising**, meant to pull in the helpers (insects, birds) that the plant needs to reproduce. Even the nectar is a reward offered in exchange for that help.

A **complete flower** has four kinds of parts. Reading from the outside in, they are the sepals, the petals, the stamens, and the pistil.`),
    h('The Four Parts, From Outside In'),
    txt(
`The outermost ring is the **sepals** — usually small and green. They wrap and protect the flower while it is still a tight bud. Just inside them are the **petals**, the showy, coloured parts that do the advertising.

Inside the petals sit the reproductive parts themselves. The **stamen** is the **male** part: a thin stalk (the **filament**) holding up an **anther**, where **pollen grains** are made. At the centre stands the **pistil**, the **female** part, which has three sections — a **stigma** at the top (often flat and sticky), a long tube called the **style**, and a swollen **ovary** at the base that holds the **ovules**. Each ovule contains an egg.`),
    table('The four parts of a flower',
      ['Part', 'Male / female / other', 'Its job'],
      [
        ['Sepal', 'Other (protective)', 'Green; protects the flower in the bud stage'],
        ['Petal', 'Other (attractive)', 'Coloured; attracts insects and birds'],
        ['Stamen (anther + filament)', 'Male', 'Anther makes pollen, which carries male gametes'],
        ['Pistil (stigma + style + ovary)', 'Female', 'Holds ovules with eggs; receives pollen at the stigma'],
      ]),
    reason('logical',
      'The stigma at the top of the pistil is often sticky or feathery, rather than smooth and dry. For a part whose whole job is to receive pollen, why would being sticky or feathery be so useful?',
      [
        'It helps the flower stand upright in the wind',
        'It traps and holds onto pollen grains that arrive, instead of letting them blow away',
        'It makes the flower smell stronger to insects',
        'It stores extra food for the growing ovules',
      ], 1,
      'Pollen arrives loose — carried on a bee\'s body or drifting on the wind — and could easily be lost again. A sticky or feathery stigma acts like a trap, catching and holding the pollen the moment it lands, so the next step of reproduction can begin. The other options describe jobs that belong to other parts.',
      2),
    callout('threads_of_curiosity', 'The Lonely Papaya Tree',
`Not every flower has all four parts. Some have stamens but no pistil; others have a pistil but no stamens. A **papaya** tree can even be "male" or "female", carrying only one kind of flower. Now think it through: if a flower has no pistil, it has no ovary — so can it ever form a fruit? And what does that mean for a male papaya tree standing all alone in a field?`),
    quiz([
      q('Which part of a flower is the male reproductive part?',
        ['Pistil', 'Stamen', 'Sepal', 'Petal'], 1,
        'The stamen (its anther) makes pollen, which carries the male gametes. The pistil is the female part; sepals protect the bud and petals attract pollinators — neither is reproductive in the male sense.',
        1),
      q('A scientist carefully removes the entire pistil from a flower but leaves every other part untouched. Which job can this flower no longer do?',
        [
          'Attract insects with its colour and scent',
          'Make pollen inside its anthers',
          'Produce ovules and form seeds',
          'Protect itself as a bud with sepals',
        ], 2,
        'The pistil holds the ovary and ovules, so without it the flower cannot make ovules or form seeds. Colour (petals), pollen (stamen), and protection (sepals) all stay — those parts were left in place. That is what makes this question trickier than it first looks.',
        2),
      q('The stigma sits sticky at the very top of the pistil, while the ovary stays hidden at the bottom. Why is this "sticky top, protected bottom" arrangement useful?',
        [
          'The sticky top traps pollen, while the deep ovary keeps future seeds safe',
          'The sticky top stores the flower\'s food, while the ovary gives it colour',
          'The sticky top drives insects away, while the ovary makes the pollen',
          'The sticky top and the hidden ovary both help the petals grow bigger',
        ], 0,
        'The stigma\'s stickiness catches incoming pollen right where it is needed, while the ovary\'s tucked-away position shelters the ovules that will become seeds. The other options hand these parts jobs that belong elsewhere (food store, colour, pollen-making, petal growth).',
        3),
    ]),
  ],
};

applyPages([p2, p3, p4]);
