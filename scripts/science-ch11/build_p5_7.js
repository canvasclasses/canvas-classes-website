'use strict';
/**
 * Ch.11 pages 5-7: pollination, fertilisation-in-plants, seed-dispersal.
 * Source: iesc111.pdf §11.2.3/§11.2.4 (p216-217), §11.2.5 (p216), Pause&Ponder +
 * Fig 11.16 (p217), "The Journey Beyond" Seed Village Programme (p227).
 * Run: node scripts/science-ch11/build_p5_7.js [--dry]
 */
const { img, txt, h, h3, cur, callout, cmp, table, reason, q, quiz, applyPages } = require('./_lib');

// ── PAGE 5 — Pollination ──────────────────────────────────────────────────────
const p5 = {
  slug: 'pollination',
  subtitle: 'A plant is stuck in one spot for life — so how does it deliver pollen to a partner far away?',
  blocks: [
    cur(
      'A plant is rooted to one spot for its entire life. It can never walk over to another plant to reproduce. And yet a wheat plant in one corner of a field can become a parent with a plant in the far corner. With no legs, no hands, and no way to move an inch, how does a plant get its pollen across all that distance to another flower?',
      'It cannot move — so it has to hire a delivery service. Who works for free?',
      'The answer is pollination, and plants have signed up some surprising couriers: the wind, the water, and a whole army of insects and birds.'
    ),
    img(
      'A bee dusted with yellow pollen on a bright flower, with wind carrying pollen from grass flowers and a diagram of self versus cross pollination',
      'Wide 16:5 banner, dark background. Centre-left: a honeybee covered in yellow pollen sitting on a bright orange flower. Right: thin grass flowers releasing a cloud of fine pollen into the wind, with dotted arrows showing pollen travelling to another flower. A small inset shows two diagrams labelled by arrows (pollen moving within one flower vs pollen moving between two separate plants). Clean botanical style, soft colours. No text.'
    ),
    callout('fun_fact', 'Your Spring Sneeze Is Plant Pollen',
`When your nose runs and your eyes itch in spring, you can blame plant reproduction. That fine yellow dust that coats cars and windowsills is **pollen** — male plant cells flung into the air by the million, each one hoping to land on the right stigma. The vast majority never will. Your sneeze is just you getting caught in the crossfire of a plant trying to reproduce.`),
    h('Pollination: Pollen in the Right Place', 'Learn what pollination is and why it must happen before any seed can form.'),
    txt(
`**Pollination** is the transfer of pollen grains from the **anther** (the male part) to the **stigma** (the top of the female part). Nothing happens in a flower's reproduction until this transfer is made — no pollination, no seeds, no fruit.

There are two kinds, depending on where the pollen comes from.`),
    h('Self or Cross?'),
    txt(
`In **self-pollination**, pollen lands on the stigma of the **same flower**, or another flower on the **same plant**. The "parents" are really one plant, so there is little mixing.

In **cross-pollination**, pollen from one plant reaches the stigma of a **different plant** of the same kind. Because two separate plants are involved, their features get mixed — so cross-pollination brings the variety that sexual reproduction is famous for.`),
    h('The Delivery Service: Pollinators'),
    txt(
`Since a plant cannot carry its own pollen anywhere, it relies on outside helpers called **pollinators** — wind, water, insects, and birds. And here is the clever part: the design of a flower tells you which courier it has hired.`),
    table('Who carries the pollen — and how the flower is built for it',
      ['Pollinator', 'How the flower is suited to it', 'Examples'],
      [
        ['Wind', 'Light, dry pollen in huge amounts; long feathery stigma to catch it', 'Wheat, maize, rice'],
        ['Water', 'Pollen carried along by water currents', 'Vallisneria, Hydrilla'],
        ['Insects (bees, butterflies)', 'Bright colour, scent, nectar; large sticky or spiny pollen', 'Sunflower, hibiscus, marigold'],
        ['Birds (sunbird, Indian white-eye)', 'Bright flowers with plenty of nectar', 'Coral tree, hibiscus'],
      ]),
    reason('logical',
      'A farmer plants two different varieties of maize right next to each other. Pollen from one variety blows across and lands on the stigmas of the other. What kind of pollination is this, and what is one likely result for the seeds that form?',
      [
        'Self-pollination; the seeds will be exact copies of one plant',
        'Cross-pollination; the seeds may carry a mix of features from both varieties',
        'Self-pollination; no seeds will form at all',
        'Cross-pollination; the seeds will copy only the variety the pollen came from',
      ], 1,
      'The pollen travelled from one plant to a different plant of the same kind, so this is cross-pollination. The two varieties\' features get mixed, so the seeds — and the plants they grow into — can carry a blend of both. This mixing is exactly why cross-pollination adds variety, while self-pollination tends to keep things the same.',
      2),
    callout('bridging_science', 'No Bees, No Apples',
`In the lower Himalayas, apple farmers have a quiet worry: the wild bees and insects that pollinate their trees are vanishing, and fewer pollinators means fewer apples set on the branches. Some farmers now keep **bee colonies** right in their orchards — they harvest honey, and the bees, by moving flower to flower, push up the apple crop. A tiny insect turns out to be a key worker behind a harvest worth crores.`),
    quiz([
      q('Pollination is the transfer of pollen grains from the —',
        ['stigma to the anther', 'anther to the stigma', 'ovary to the ovule', 'petal to the sepal'], 1,
        'Pollen is made in the anther and must reach the stigma — anther to stigma. Option A reverses this, which is the most common slip. The ovary and ovule come into play later, during fertilisation, not pollination.',
        1),
      q('A plant has small, dull flowers with no scent and no nectar, but it pours out huge amounts of very light, dry pollen. Which pollinator does it most likely depend on?',
        ['Insects such as bees', 'Birds such as sunbirds', 'Wind', 'Water currents'], 2,
        'No colour, scent, or nectar means there is nothing to attract insects or birds — so the flower is not built for them. Light, dry pollen made in huge amounts is the classic sign of wind pollination, where most pollen is lost and only sheer numbers ensure success.',
        2),
      q('A wind-pollinated grass makes lakhs of pollen grains per flower, while an insect-pollinated flower makes far fewer yet still forms plenty of seeds. Why can the insect-pollinated plant get away with making so little pollen?',
        [
          'Insects carry pollen straight from one flower to another, so very little is wasted',
          'Insect pollen is much heavier, so it makes more seeds',
          'Insects lay eggs that grow into the plant\'s seeds',
          'Wind-pollinated plants do not really need their pollen',
        ], 0,
        'An insect is a targeted courier — it carries pollen directly to the next flower, so little is lost. Wind is a blind scatter, so a grass must make enormous amounts just so a few grains land correctly. Pollen weight (B) does not make seeds, and insects certainly do not lay the plant\'s seeds (C).',
        3),
    ]),
  ],
};

// ── PAGE 6 — Fertilisation in Plants ──────────────────────────────────────────
const p6 = {
  slug: 'fertilisation-in-plants',
  subtitle: 'The single hidden event that turns a flower into a fruit',
  blocks: [
    cur(
      'Every fruit you have ever eaten — the mango, the apple, the tomato in your sabzi — was once part of a flower. The juicy part you bite into grew out of one particular part of that flower, but only after a single hidden event took place deep inside it. What is the event that turns an ordinary flower into a fruit?',
      'Pollination gets pollen to the stigma. But something still has to happen after that.',
      'That hidden event is fertilisation. Once you see it, you will never look at a fruit the same way again.'
    ),
    img(
      'A pollen tube growing down through the style into the ovary to reach an ovule, beside a flower\'s ovary transforming into a ripe tomato',
      'Wide 16:5 banner, dark background. Left: a clear cut-away of a flower\'s pistil showing a pollen grain on the stigma sending a long pollen tube growing down through the style into the ovary, reaching a round ovule with an egg inside. Right: a sequence of three small pictures showing a flower\'s ovary swelling and ripening into a red tomato cut open to show seeds. Clean botanical-diagram style, soft colours. No text.'
    ),
    callout('fun_fact', 'Your "Vegetables" Are Mostly Fruits',
`Here is a fact to win an argument with: the **tomato, brinjal, chilli, cucumber,** and **lady\'s finger** in your kitchen are all, scientifically, **fruits**. Each one grew from a flower\'s ovary and carries seeds inside — and that is the actual definition of a fruit. A real vegetable, like spinach leaves or a potato, never grew from a flower\'s ovary at all.`),
    h('From Pollen to Fertilisation', 'Trace how the male gamete reaches the egg buried deep inside the ovary.'),
    txt(
`Once a pollen grain lands on a **compatible** stigma, a remarkable thing happens. The pollen grows a tiny living tube — the **pollen tube** — that pushes its way **down through the style** and into the ovary. Through this tube, the **male gamete** travels down to an **ovule**, where it meets and fuses with the **egg**.

This fusing of the male gamete with the egg is called **fertilisation**.`),
    txt(
`The fertilised egg is now called a **zygote**, and it is the very first cell of a new plant. The zygote begins to divide and grows into an **embryo** — a tiny baby plant packed with the instructions to become a full plant one day.`),
    h('How a Flower Becomes a Fruit'),
    txt(
`After fertilisation, the flower quietly transforms. The **ovary** swells and ripens into the **fruit**, while the **ovules** inside it harden into **seeds**. The fruit is really just a box built around the seeds. Later, when a seed lands somewhere with enough water, air, and warmth, it **germinates** and grows into a brand-new plant — one that carries a fresh mix of features, ready to face its own world.`),
    table('What each flower part becomes after fertilisation',
      ['Before fertilisation', 'After fertilisation'],
      [
        ['Egg (inside the ovule)', 'Zygote, which grows into an embryo'],
        ['Ovule', 'Seed'],
        ['Ovary', 'Fruit'],
      ]),
    reason('logical',
      'In an experiment, a student removes the stamens from a flower bud and ties a bag around it so no insect can reach it. The flower opens, but no fruit ever forms on it. From this result, what can the student safely conclude about fruit formation?',
      [
        'Fruits can form without any pollen at all',
        'Pollen must reach the stigma for a fruit to form',
        'Petals are the part that actually makes the fruit',
        'Removing the stamens kills the whole flower',
      ], 1,
      'With the stamens gone, the flower has no pollen of its own; with the bag on, no pollen can arrive from outside either. So no pollen reaches the stigma — and no fruit forms. A flower left with its stamens, or one insects can visit, does form fruit. The experiment therefore shows that pollen reaching the stigma is necessary before a fruit can form.',
      3),
    callout('threads_of_curiosity', 'Why Fruits Are Sweet but Seeds Are Not',
`Have you noticed that a fruit is sweet and brightly coloured, while the seeds tucked inside are hard and often bitter? That is no accident. The plant is striking a deal with animals: *eat my sweet fruit, and carry my seeds far away from me.* The sweetness is a payment — for a delivery service. And that delivery is exactly what the next page is about.`),
    quiz([
      q('After fertilisation in a flowering plant, the ovary develops into the —',
        ['seed', 'fruit', 'flower', 'root'], 1,
        'The ovary becomes the fruit; it is the ovule inside it that becomes the seed. Mixing up ovary and ovule (choosing "seed") is the classic trap here — keep them straight: ovary to fruit, ovule to seed.',
        1),
      q('Pollen lands on the stigma, but the egg sits deep inside the ovary, far below. How does the male gamete reach the egg?',
        [
          'The pollen grows a tube down the style, carrying its gamete to the ovule',
          'Rainwater slowly washes the gamete down into the ovary',
          'An insect pushes its long tongue down to deliver the gamete',
          'A gust of wind blows the gamete down through the style',
        ], 0,
        'The pollen grain grows a pollen tube that tunnels down through the style to the ovule, delivering the male gamete right to the egg. The plant builds its own bridge — it does not rely on rain, an insect\'s tongue, or wind to make that final journey inside the flower.',
        2),
      q('A flower is pollinated, but soon after, all of its ovules are damaged and die, while the ovary itself stays unharmed. What is the most likely result?',
        [
          'A normal fruit packed with healthy seeds',
          'The flower simply turns back into a bud',
          'A fruit may still form, but it will hold no living seeds',
          'The stigma itself swells up into a new fruit',
        ], 2,
        'Seeds come from ovules — so if the ovules die, there can be no living seeds, even though the ovary may still swell into a (seedless) fruit. This is why keeping ovary and ovule separate in your mind matters: they have different fates and can be affected separately.',
        3),
    ]),
  ],
};

// ── PAGE 7 — Seed Dispersal ───────────────────────────────────────────────────
const p7 = {
  slug: 'seed-dispersal',
  subtitle: 'Why a plant works so hard to throw its own children as far away as possible',
  blocks: [
    cur(
      'Most parents want to keep their children close. Plants do the exact opposite — they go to astonishing lengths to fling their seeds as far away from themselves as they can. A coconut can float across an entire ocean; a single dandelion seed can ride the wind for kilometres. Why would a plant try so hard to get rid of its own seeds?',
      'Think about what would happen if hundreds of seeds all sprouted right under the parent tree.',
      'Sending seeds away is called dispersal, and the shapes of seeds are full of clever tricks for catching a ride.'
    ),
    img(
      'Dandelion parachute seeds blowing in the wind, silky madar seeds drifting, a coconut floating on water, and burr seeds hooked onto animal fur',
      'Wide 16:5 banner, dark background. Left: a dandelion head releasing fluffy parachute seeds into the breeze. Middle: silky white madar (Calotropis) seeds drifting, and a coconut floating on rippling water. Right: a close-up of spiky burr seeds hooked onto the fur of a passing animal. Clean nature-illustration style, soft colours. No text.'
    ),
    callout('fun_fact', 'Velcro Was Copied From a Seed',
`The sticky strips of **Velcro** on your bag and shoes were invented because of seed dispersal. An engineer out walking noticed how prickly burr seeds clung to his dog\'s fur using thousands of tiny hooks. He copied those hooks — and a billion-dollar product was born. Those hooks are simply a plant\'s way of hitching a free ride to a new home.`),
    h('Why Seeds Need to Travel', 'Work out the problem that dispersal solves for a plant.'),
    txt(
`Imagine if every seed from a tree just dropped and sprouted right underneath it. Hundreds of tiny plants would be packed into the parent\'s shadow, all fighting one another — and the parent — for the same light, water, and patch of soil. Most would lose.

**Dispersal** solves this. By spreading seeds away from the parent, a plant gives its offspring room to grow, fresh ground to settle, and a chance to reach brand-new places. The plant cannot move — but its seeds can.`),
    h('Four Ways to Catch a Ride'),
    txt(
`A seed\'s shape and weight reveal how it travels. **Wind** carries seeds that are light, winged, or fitted with parachute-like hairs. **Water** carries seeds that float and have waterproof coats. **Animals** help in two ways: they eat sweet fruits and drop the tough seeds far away, or they unknowingly carry hooked, sticky seeds stuck to their fur.`),
    table('How seeds travel — and how they are built for it',
      ['Carrier', 'Seed feature', 'Example'],
      [
        ['Wind', 'Light, with hairs or wings to catch the air', 'Dandelion, madar (Calotropis)'],
        ['Water', 'Floats; tough waterproof coat', 'Coconut'],
        ['Animals (eaten)', 'Sweet fruit; hard seed survives being eaten', 'Guava, ber'],
        ['Animals (hitch-hiking)', 'Tiny hooks or sticky surface to cling to fur', 'Burr seeds (Xanthium)'],
      ]),
    reason('spatial',
      'Look closely at a dandelion seed: it is tiny, dry, and topped with a tuft of fine hairs spread out like a little parachute. From its design alone, how is this seed most likely carried away, and why?',
      [
        'By water, because the hairs help it float on the surface',
        'By wind, because it is light and the spread-out hairs catch the air like a parachute',
        'By animals, because the soft hairs stick firmly to fur',
        'By bursting out of its pod and shooting through the air',
      ], 1,
      'The clues are in the design: very light, and topped with fine, spread-out hairs. Those hairs act exactly like a parachute, catching even a gentle breeze and keeping the tiny seed aloft for a long time. Smooth floating seeds suit water, and hooked or sticky seeds suit fur — but a feathery parachute is built for the wind.',
      2),
    callout('india_science', 'Saving India\'s Own Seeds',
`India runs a **Seed Village Programme (Beej Gram Yojana)** to help farmers store and share good-quality **indigenous (local) seeds** within their own villages. Saving native seeds protects local crop varieties — many of them perfectly suited to the local soil and weather — from disappearing, and frees farmers from having to buy fresh seed every single season.`),
    quiz([
      q('Seed dispersal mainly helps a plant by —',
        [
          'making its seeds heavier and stronger',
          'spreading its seeds away from the crowded parent plant',
          'stopping its seeds from ever germinating',
          'turning its seeds directly into fruits',
        ], 1,
        'Dispersal spreads seeds out so they are not all crammed under the parent, competing for the same light, water, and soil. It does not change a seed\'s weight, and it certainly does not stop germination or turn seeds into fruits.',
        1),
      q('A seed is fairly large, has a tough waterproof shell, and can float for weeks. Which method of dispersal is it best built for?',
        [
          'By water, because it floats and its shell keeps the inside dry',
          'By wind, because the shell helps it fly',
          'By sticking to the fur of passing animals',
          'By being eaten by small birds',
        ], 0,
        'A floating, waterproof seed (like a coconut) is clearly built for water travel — the shell keeps the seed inside safe and dry on a long voyage. It is far too heavy for wind, has no hooks for fur, and is too big for small birds to eat.',
        2),
      q('Why might seeds that simply fall and sprout right below the parent tree do worse than seeds carried far away?',
        [
          'Seeds near the parent are too heavy to germinate',
          'Seeds far away are watered and fed by the parent tree',
          'Seeds near the parent crowd together and fight the parent for light, water and space',
          'Seeds near the parent are always the first to be eaten',
        ], 2,
        'Seeds packed under the parent must compete with each other and with the big parent tree for the same light, water, and soil — so most struggle. Seeds carried away find their own space. The parent does not water distant seeds (B), and the problem is competition, not weight or being eaten.',
        3),
    ]),
  ],
};

applyPages([p5, p6, p7]);
