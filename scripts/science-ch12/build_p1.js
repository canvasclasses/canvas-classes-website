'use strict';
/**
 * Class 9 Science · Chapter 12 "Patterns in Life: Diversity and Classification"
 * PILOT PAGE 1 — "Why Classify Living Things?" (slug why-classify-living-things)
 *
 * Source: NCERT-Simplified Ch.12 (iesc112.pdf) — §12.3 (Activity 12.1: the same
 *   organism falls into different groups depending on the criterion; Table 12.1/12.2),
 *   §12.3.1 (the criteria scientists use), §12.4 (the need for classification — the
 *   scattered-library image, Pakke Tiger Reserve case study, the ways classification
 *   helps), §12.3 India's Scientific Contributions callout (Sangam Tinai + sacred
 *   groves), and the §12.2 / Pause-and-Ponder idea that shared features hint at a
 *   shared ancestry. Every claim grounded in the source — no invention.
 *
 * Follows BOOK_PAGE_WORKFLOW §4B (Class 9 "Exploration" template): curiosity_prompt
 * block 1 (hero image block 0), a mid-page reasoning_prompt after the concept,
 * inline_quiz last (L1 recall → L2 application → L3 reasoning), ≥1 special callout.
 * §3.6.1 quiz rules: every distractor a real misconception, length-parity options,
 * difficulty-tagged, explanations teach the content (no "option B"). Positions are
 * spread later by quiz_balance. Teacher voice: plain classroom English, no AI-tells.
 *
 * Updates the existing stub page in place (published stays false).
 *   node scripts/science-ch12/build_p1.js [--dry]
 */
const { img, txt, h, cur, callout, reason, q, quiz, applyPages } = require('./_lib');

const blocks = [
  cur(
    'It is past midnight in a forest. An owl, a bat, and a moth are all wide awake, and all three can fly. Put them in a box labelled "active at night" — they all belong together. Now empty the box and sort again by "has feathers" — and suddenly the owl is alone, while the bat ends up closer to a mouse than to the owl it was just sitting beside. Same three creatures. Completely different piles. So is there one *correct* way to sort all of life — or does it just depend on which question you ask?',
    'Try sorting the same three creatures a third way — by "lays eggs" — and watch the piles change yet again.',
    'There is no single sorting that is "the only right one" — every grouping depends on the feature you pick. That is exactly the problem scientists had to solve: out of dozens of features, which ones should decide how we group every living thing on Earth? This page is about how they answered that.'
  ),
  img(
    'A huge, varied crowd of living things — trees, birds, fish, insects, mushrooms and tiny microbes — being gently sorted into glowing groups',
    'Ultra-wide cinematic banner (16:5 ratio). A vast gathering of wildly different living things drifting across the frame — a towering tree, a soaring eagle, a leaping fish, a beetle, a cluster of mushrooms, a coiled snake, and a swirl of tiny glowing microscopic specks — slowly arranging themselves into separate softly glowing clusters, as if an invisible hand is sorting all of life into groups. Conveys the wonder and the challenge of organising the staggering variety of life. Warm rim lighting against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
  ),
  callout('fun_fact', 'A Quarter of India\'s Birds in One Forest',
`India is home to about **1,300 kinds of birds**. Now here is the surprising part: a single forest — the **Pakke Tiger Reserve** in Arunachal Pradesh — shelters nearly **300 of them**. That is almost one in every four bird species in the whole country, packed into one stretch of forest. When that much life is crowded into one place, scientists need a clear way to keep track of it all — otherwise the variety becomes a blur.`),
  h('The Same Animal Fits Into Many Boxes', 'See why a single creature can belong to several different groups at once.'),
  txt(
`Picture all the animals of a forest spread out in front of you, and someone asks you to put them into groups. Where do you even begin?

You could group them by **where they live** — up in the trees, down on the forest floor, in the water. You could group them by **when they are active** — by day, by night, or both. Or you could group them by **what they eat** — meat-eaters in one pile, plant-eaters in another.

Here is the catch. A leopard lives in the trees *and* hunts for meat. So it belongs in the "tree" group *and* in the "meat-eater" group at the same time. Change the question, and the same leopard jumps to a different box. The animal did not change — your *criterion* did.`),
  txt(
`So scientists faced a real question: if every animal can be sorted in so many ways, which features should we actually use? Over time they settled on a set of features that are studied carefully, such as:

- **Body features** — shape, size, and how the body is built.
- **What it eats** — does it make its own food, or depend on others?
- **Inside the body** — does it have a skeleton, organs, different tissues?
- **The cell** — one cell or many; a true nucleus or not; a cell wall or not.
- **Its role in nature** — does it produce food, consume it, or break down waste?
- **How it reproduces**, and how similar its inherited features (its **DNA**) are to others.

When two living things share many of these deeper features, it is a strong hint that they came from the same ancestors long ago. **Classification** is this scientific system of grouping living things by their shared features and differences.`),
  reason('logical',
    'A classmate groups a bat with the eagle and the parrot, simply because all three can fly. Using the idea of a good grouping criterion, what is the soundest reason this grouping may be misleading?',
    [
      'Flying is just one surface feature; a sound grouping weighs many shared features together, not a single obvious one',
      'Flying is not a real feature, so it can never be used to group animals',
      'A bat is too unusual an animal to be placed in any group at all',
      'Only animals that look exactly alike are allowed to share a group',
    ],
    0,
    'Grouping by one eye-catching feature like "can fly" can throw very different animals into the same pile. Scientists look at many features together — body build, what it eats, its cells, how it reproduces. The tempting wrong idea is that animals must "look exactly alike" to share a group; in fact, grouping rests on shared deeper features, not on looking identical.',
    2),
  h('Why Bother Sorting Life At All?', 'Understand what classification gives us that a giant unsorted pile never could.'),
  txt(
`Imagine walking into a huge library where thousands of books are dumped in a heap on the floor. You want one particular book. Without shelves, sections, or any order, you could search for days and still not find it.

Earth is exactly like that library, except it holds **millions of kinds of living things**. Sorting them into sensible groups is what makes the whole collection usable. This is why scientists build a shared system of grouping, called **biological classification**.`),
  callout('india_science', 'India\'s Own Way of Reading the Land',
`Long before modern biology, Tamil **Sangam literature** described a system called **Tinai** — it sorted the land itself into types such as hills, forests, farmland, and coast, each with its own plants, animals, and ways of life. Alongside this, communities across India protected patches of forest as **sacred groves**, which quietly preserved local plants and animals for generations. These traditions show a careful, organised understanding of living diversity — centuries before it was written down as formal science.`),
  txt(
`A shared system of classification does a lot of work for us:

- It keeps the study of living things **organised**, so anyone can find their way around it.
- It shows us how organisms are **similar, different, and related** to one another.
- It helps scientists **name and recognise newly discovered** organisms.
- It supports **conservation**, by flagging which living things are under threat.
- And because everyone uses the same system, scientists anywhere in the world can **discuss the same organism** without confusion.`),
  callout('threads_of_curiosity', 'A Clue Hidden in the Similarities',
`Here is something to sit with. When two animals share many deep features — the same kind of skeleton, the same body plan, the same sort of cells — it is rarely a coincidence. It often means they share an **ancestor** far back in time. So the groups we make are not just tidy boxes; they may be quietly tracing family trees that stretch back millions of years. If that is true, then how far back might two very different-looking animals still turn out to be related?`),
  quiz([
    q('Biological classification is best described as —',
      [
        'grouping living things by their shared features and differences',
        'giving every living thing a two-part name in Latin',
        'counting how many kinds of living things exist on Earth',
        'keeping living things alive and healthy inside a laboratory',
      ], 0,
      'Classification means sorting living things into groups based on what they share and how they differ. Giving a two-part Latin name is a separate idea (naming, which comes later) — students often mix the two up, but naming an organism is not the same as classifying it.',
      1),
    q('You sort a forest\'s animals first by "where they live" and then by "what they eat". A leopard lives in the trees, and it also hunts and eats meat. What does this show?',
      [
        'The same animal can fall into different groups depending on the feature you choose',
        'An animal can only ever belong to one single correct group and to no other',
        '"Where it lives" and "what it eats" always sort animals the same way',
        'The leopard has been wrongly identified and is not really one animal',
      ], 0,
      'The leopard lands in the "tree" group and the "meat-eater" group at once — the criterion changed, not the animal. The common slip is to think each animal has just one correct group; in fact, which group it falls into depends on the feature you sort by.',
      2),
    q('Hari says the small creature in the garden is an insect; Meena says it is an earthworm. Both creatures have bodies divided into segments. Which single feature would settle the argument in Hari\'s favour?',
      [
        'It has jointed legs',
        'It has a long, soft body',
        'Its body is divided into segments',
        'It moves slowly along the ground',
      ], 0,
      'Insects belong to a group whose defining feature is jointed legs, which an earthworm does not have — so jointed legs would prove Hari right. Segmentation is the trap here: both insects and earthworms have segmented bodies, so it cannot decide the argument either way.',
      3),
  ]),
];

applyPages([{
  slug: 'why-classify-living-things',
  subtitle: 'The same creature can be sorted ten different ways — so how do scientists decide which grouping counts?',
  blocks,
}]).catch((e) => { console.error(e); process.exit(1); });
