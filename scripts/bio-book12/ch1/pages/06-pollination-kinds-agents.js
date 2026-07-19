'use strict';
/**
 * Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
 * Page 6 — Pollination: Its Kinds and Who Carries It Out.
 *
 * Source of truth: NCERT Class 12 Ch.1 (lebo101.txt), section 1.2.3
 * "Pollination" — Kinds of Pollination (autogamy incl. chasmogamy/
 * cleistogamy, geitonogamy, xenogamy) and Agents of Pollination (abiotic:
 * wind, water; biotic: animals, incl. Amorphophallus and the Yucca–moth
 * mutualism). Rule 0: every fact here traces to that text; nothing invented.
 * The Greek names anemophily / hydrophily / entomophily are the standard
 * technical labels for the wind / water / insect pollination NCERT describes.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'pollination-kinds-and-agents',
  title: 'Pollination — Its Kinds and Who Carries It Out',
  subtitle: "Pollen can't walk and the egg can't move — so the plant hires a courier. Here are the three kinds of pollination by source, and the wind, water and animals that do the carrying.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['pollination', 'autogamy', 'geitonogamy', 'xenogamy', 'sexual-reproduction-in-flowering-plants'],
  glossary: [
    { term: 'pollination', definition: 'The transfer of pollen grains, shed from the anther, to the stigma of a pistil. It has to happen before fertilisation can.' },
    { term: 'autogamy', definition: 'Self-pollination in the strictest sense — pollen lands on the stigma of the same flower it came from.' },
    { term: 'geitonogamy', definition: 'Pollen moves from the anther of one flower to the stigma of another flower on the same plant. It needs an agent, but genetically the pollen is still from the same plant.' },
    { term: 'xenogamy', definition: 'Pollen is carried from the anther of one plant to the stigma of a different plant — the only kind of pollination that brings genetically different pollen to a stigma.' },
    { term: 'anemophily', definition: 'Pollination by wind — the technical name for wind pollination.' },
    { term: 'hydrophily', definition: 'Pollination by water — the technical name for water pollination, found in only about 30 genera, mostly monocots.' },
    { term: 'entomophily', definition: 'Pollination by insects — the technical name for the insect (and wider animal) pollination that most flowering plants rely on.' },
  ],
  blocks: [
    {
      id: '21601d36-e400-4f73-b21d-07573bc35eda',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dusk pond where a bee crosses open flowers on one bank while pollen drifts on the water surface toward a submerged bloom',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet freshwater pond at dusk seen from the side. On the near bank, a few open flowers with a single bee drifting between them, barely visible. On the water surface, faint specks of pollen float in a slow current toward a small pale female flower held just at the waterline on a long stalk. In the warm low light, wind carries a faint haze of pollen through the air above the reeds behind. Every method of carrying pollen — insect, water and wind — quietly present in one scene, none of them the sharp focal subject. Deep dusk lighting throughout, painterly and atmospheric, dark background tones overall (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: 'bb0452a0-5b7a-4a41-bbb4-fe8750b3c36e',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'A Flower That Rides the Current',
      markdown: "In **Vallisneria**, a freshwater plant, the female flower sits on a long stalk that grows all the way up to the surface of the water and waits there. The male flowers, meanwhile, break off and float free — released right onto the water's surface — and drift wherever the current takes them. Most go nowhere. But a few bump into a waiting female flower and pollinate it. The plant doesn't move its pollen at all; it just lets the water do the delivery and plays the odds.",
    },
    {
      id: '740e45ea-7fc8-486b-9280-5640cdab99fc',
      type: 'text',
      order: 2,
      markdown: "Here's the problem every flowering plant has to solve. The male gamete sits inside the pollen grain, the female gamete sits inside the embryo sac deep in the ovule — and **neither one can move on its own**. They're non-motile. For fertilisation to happen, the pollen has to physically reach the stigma. That transfer has a name: **pollination** is the movement of pollen grains, shed from the anther, onto the stigma of a pistil.\n\nSince the pollen can't travel by itself, the plant uses an outside courier — wind, water, or an animal. And in the ones that rely on wind or water, whether a pollen grain actually lands on a stigma is largely down to chance. To make up for all the pollen that misses, these plants churn out **enormous amounts of it** compared to the small number of ovules waiting to be fertilised.",
    },
    {
      id: 'd25dbfb3-8c21-4edd-9b14-5ceb633bf866',
      type: 'heading',
      order: 3,
      level: 2,
      text: "Three Kinds of Pollination — Sorted by Where the Pollen Comes From",
      objective: "By the end of this you can tell autogamy, geitonogamy and xenogamy apart — and say for each one whether the pollen is genetically the same or different.",
    },
    {
      id: '6718f14a-a909-4b04-9880-8058e0e8a6c0',
      type: 'text',
      order: 4,
      markdown: "The three kinds differ by one thing only: **the source of the pollen**.\n\n**Autogamy** is self-pollination in the strictest sense — pollen lands on the stigma of the *same flower* it came from. In an ordinary flower that opens up and exposes its anthers and stigma, this is actually rare: it needs the pollen to be released exactly when the stigma is ready, and the anther and stigma have to sit close together. Some plants, like *Viola* (the common pansy), *Oxalis* and *Commelina*, hedge their bets by making two kinds of flowers. **Chasmogamous** flowers open normally with exposed anthers and stigma. **Cleistogamous** flowers never open at all — the anther and stigma stay pressed together inside the closed bud, so when the anther bursts, its pollen falls straight onto the stigma. Because no outside pollen can ever get in, cleistogamous flowers are *always* self-pollinated and give an assured seed set even when no pollinator shows up.\n\n**Geitonogamy** is the transfer of pollen from the anther of one flower to the stigma of *another flower on the same plant*. This one is the classic trap, so hold onto it: it looks like cross-pollination — it needs a pollinating agent to carry the pollen between two separate flowers — but because both flowers belong to the same plant, the pollen is genetically identical to self-pollen. Functionally cross, genetically self.\n\n**Xenogamy** is the transfer of pollen from the anther of one plant to the stigma of a *different plant*. This is the only kind of pollination that brings **genetically different** pollen grains to a stigma.",
    },
    {
      id: '90501048-5979-470e-8211-223422a576f2',
      type: 'comparison_card',
      order: 5,
      title: 'Autogamy vs Geitonogamy vs Xenogamy',
      columns: [
        {
          heading: 'Autogamy',
          points: [
            'Pollen source: the same flower.',
            'Agent needed: usually none — anther and stigma sit close.',
            'Genetically: same plant → self.',
            'Guaranteed version: cleistogamous flowers (never open), e.g. Viola, Oxalis, Commelina.',
          ],
        },
        {
          heading: 'Geitonogamy',
          points: [
            'Pollen source: a different flower on the same plant.',
            'Agent needed: yes — a pollinator must carry it between flowers.',
            'Genetically: same plant → still self.',
            'The trap: functionally cross-pollination, but genetically identical to autogamy.',
          ],
        },
        {
          heading: 'Xenogamy',
          points: [
            'Pollen source: a different plant.',
            'Agent needed: yes — an outside courier.',
            'Genetically: different plant → different.',
            'The only kind that brings genetically different pollen to the stigma.',
          ],
        },
      ],
    },
    {
      id: 'c44e02ed-a81f-4f23-9848-100a41ca36eb',
      type: 'reasoning_prompt',
      order: 6,
      reasoning_type: 'logical',
      prompt: "A bee flies from one flower of a mango tree to a second flower on the very same tree, dropping pollen from the first onto the stigma of the second. This clearly needed the bee to happen. So why do biologists say this event is genetically the same as self-pollination?",
      options: [
        "Because the bee only visited one tree, the pollen never actually left the anther",
        "Because both flowers belong to the same plant, so their pollen carries identical genetic information — the same as if it had self-pollinated",
        "Because a bee is an animal, and all animal pollination counts as self-pollination",
        "Because the two flowers opened at different times, so no real transfer took place",
      ],
      correct_index: 1,
      reveal: "This is geitonogamy. The giveaway is the source of the pollen, not the involvement of the bee. Both flowers are parts of the same plant, so the pollen is genetically identical to the stigma's own — genetically it's self-pollination, exactly like autogamy. The tempting wrong answer is the first one: yes an agent (the bee) was involved and the pollen did move between two flowers, so functionally it looks like cross-pollination — but 'functionally cross' and 'genetically self' are two different questions, and the genetics is decided purely by whether the pollen came from the same plant.",
      difficulty_level: 2,
    },
    {
      id: '4610cfc1-5522-4af2-9ce4-d0512caf190a',
      type: 'heading',
      order: 7,
      level: 2,
      text: "The Agents — Who Actually Carries the Pollen",
      objective: "By the end of this you can match wind, water and animal pollination to the flower features each one shaped.",
    },
    {
      id: '7565648d-94c3-4d11-b989-a8fb27a95ec1',
      type: 'text',
      order: 8,
      markdown: "Plants use two **abiotic** (non-living) agents — wind and water — and one **biotic** (living) agent — animals. Most flowering plants go with animals; only a small share rely on wind or water. The Greek names you'll meet are just labels for these: wind pollination is **anemophily**, water pollination is **hydrophily**, and insect pollination is **entomophily**.\n\n**Wind (anemophily)** is the commoner of the two abiotic routes. It only works if the pollen is **light and non-sticky** so air currents can carry it. Wind-pollinated flowers push their **stamens well out** into the breeze and carry a **large, often feathery stigma** to catch drifting grains. They tend to have a single ovule per ovary but pack many flowers into an inflorescence — the corn cob is the classic case, where the silky 'ears' you see are nothing but stigmas and styles waving in the wind. Wind pollination is very common in grasses.\n\n**Water (hydrophily)** is genuinely rare — only about **30 genera**, mostly monocots. Examples are *Vallisneria* and *Hydrilla* in fresh water and the marine sea-grass *Zostera*. Don't assume every water plant uses it: water hyacinth and water lily lift their flowers *above* the water and are pollinated by insects or wind like land plants. In sea-grasses the pollen is long and ribbon-like and drifts inside the water itself; in most water-pollinated species the pollen is wrapped in a **mucilaginous covering** that keeps it from getting wet. Both wind- and water-pollinated flowers are dull-coloured and make no nectar — there's no animal to impress.\n\n**Animals (entomophily and beyond)** do the pollinating for most flowering plants. Bees, butterflies, flies, beetles, wasps, ants, moths, birds like sunbirds and hummingbirds, and bats all take part, with **bees the dominant pollinators**. Even some primates, tree-dwelling rodents and reptiles have been recorded doing it. Animal-pollinated flowers are usually **large, colourful, fragrant and rich in nectar** (small ones cluster into a showy inflorescence), and their pollen is sticky so it clings to a visiting body. The reward is usually **nectar and pollen** — though sometimes it's a safe place to lay eggs, as in the giant *Amorphophallus*, or the tight partnership between a moth and *Yucca*.",
    },
    {
      id: 'bd2136a9-9cbb-48aa-beb6-891fb082bc8f',
      type: 'interactive_image',
      order: 9,
      src: '',
      alt: 'A wind-pollinated grass flower beside an insect-pollinated flower, showing the different features each one evolved',
      caption: '📸 Tap each dot to explore what wind pollination and insect pollination each shaped a flower into.',
      generation_prompt: "Scientific textbook illustration comparing two flower types side by side. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. LEFT HALF: a dull green-and-tan wind-pollinated grass flower — long stamens dangling well outside the flower on thin filaments, a large feathery brush-like stigma spread wide, and a faint scatter of tiny light pollen specks drifting to the right in an air current; no bright petals. RIGHT HALF: a colourful insect-pollinated flower — broad magenta-pink petals, a visible droplet of nectar deep at the centre, sticky clumped pollen on the anthers, and a small bee approaching with pollen clinging to its body. Green for living plant tissue, magenta-pink for the showy petals, pale yellow for pollen. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: 'df5883e1-727c-4285-9c3b-56375d5ed14b', x: 0.14, y: 0.30, label: 'Feathery stigma (wind)', detail: 'A large, spread-out feathery stigma gives the wind-pollinated flower the biggest possible net to trap grains drifting past on the air.', icon: 'circle' },
        { id: '5ae4196b-65a9-449b-82f9-05f6a13dd53c', x: 0.22, y: 0.68, label: 'Well-exposed stamens (wind)', detail: 'The stamens hang far out of the flower so the breeze can lift the pollen straight off them. Grasses like the corn plant do this.', icon: 'circle' },
        { id: 'a7b0bb75-0a81-4707-8d3e-1642047b9bd0', x: 0.40, y: 0.20, label: 'Light, non-sticky pollen (wind)', detail: 'Wind-carried pollen is light and dry so air currents can move it. The plant makes it in huge amounts because most grains never reach a stigma.', icon: 'circle' },
        { id: 'e1294b91-4a4d-48b6-945f-02e213bf7fdf', x: 0.68, y: 0.35, label: 'Colourful petals (insect)', detail: 'Bright, large petals are an advertisement — colour and fragrance pull animals in. Wind- and water-pollinated flowers never bother with this.', icon: 'circle' },
        { id: '718c93b0-e5ca-428c-91a2-f6b7c1d40a43', x: 0.72, y: 0.72, label: 'Nectar reward (insect)', detail: 'A store of sugary nectar deep in the flower is the payment. To reach it the animal has to brush past the anthers and stigma, carrying pollen along.', icon: 'circle' },
        { id: 'b5e92e02-cd7e-4e9f-a14a-7b05721fbe3b', x: 0.90, y: 0.30, label: 'Sticky pollen on the visitor (insect)', detail: 'In animal-pollinated flowers the pollen is sticky, so it clings to the visiting body and gets carried to the next flower the animal lands on.', icon: 'circle' },
      ],
    },
    {
      id: 'ace0c30d-0dcf-4754-8a7e-a5ac5f151dc5',
      type: 'comparison_card',
      order: 10,
      title: 'Wind vs Water vs Insect — What Each Agent Shaped the Flower Into',
      columns: [
        {
          heading: 'Wind (anemophily)',
          points: [
            'Pollen: light, non-sticky, made in huge amounts.',
            'Stamens well-exposed; stigma large and feathery.',
            'Flowers dull, no nectar; often one ovule per ovary, many flowers per inflorescence.',
            'Examples: grasses, the corn cob.',
          ],
        },
        {
          heading: 'Water (hydrophily)',
          points: [
            'Rare — about 30 genera, mostly monocots.',
            'Pollen often long and ribbon-like, wrapped in a mucilaginous coat against wetting.',
            'Flowers dull, no nectar.',
            'Examples: Vallisneria, Hydrilla (fresh water), Zostera (marine sea-grass).',
          ],
        },
        {
          heading: 'Insect / animal (entomophily)',
          points: [
            'Pollen sticky, so it clings to the visitor.',
            'Flowers large, colourful, fragrant, rich in nectar (small ones cluster).',
            'Reward: nectar and pollen — or a safe egg-laying site.',
            'Examples: bees (dominant), Amorphophallus, the Yucca–moth pair.',
          ],
        },
      ],
    },
    {
      id: '8895172d-7542-45de-910d-fd0a7060799f',
      type: 'callout',
      order: 11,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "1. **Source decides the kind:** autogamy = same flower; geitonogamy = different flower, *same plant*; xenogamy = *different plant*.\n2. **Geitonogamy is the split case** — functionally cross-pollination (needs an agent), but genetically the same as autogamy.\n3. **Only xenogamy** brings genetically different pollen to a stigma.\n4. **Cleistogamous flowers never open**, so they're always autogamous and set seed even with no pollinator around.\n5. **Wind- and water-pollinated flowers are dull and make no nectar**, and produce pollen in enormous quantities to beat the odds.\n6. **Water pollination is rare** (~30 genera, mostly monocots): *Vallisneria*, *Hydrilla*, *Zostera*.",
    },
    {
      id: '9fbbc678-1ce0-49cd-8123-6bb20b222806',
      type: 'callout',
      order: 12,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Geitonogamy:** the single most-tested trap here — functionally cross-pollination (a pollinator moves pollen between two flowers) but genetically identical to autogamy, because both flowers are on the same plant.\n\n**Xenogamy:** remember it as the *only* mode that brings genetically different pollen grains to a stigma.\n\n**Hydrophily is rare and monocot-heavy:** *Vallisneria* and *Hydrilla* (fresh water) and *Zostera* (marine sea-grass) are the go-to examples. Beware the trap that 'aquatic plant = water-pollinated' — water hyacinth and water lily are pollinated by insects or wind.\n\n**Yucca–moth:** a classic obligate mutualism — neither the moth nor the *Yucca* can complete its life cycle without the other; the moth lays eggs in the ovary and pollinates the flower in the process.\n\n**Classic NEET question:** \"Which is the only mode of pollination that brings genetically different pollen grains to the stigma?\" → **Xenogamy.**",
    },
    {
      id: '6a0298e6-f72c-45a8-bad0-61bded3f2e95',
      type: 'text',
      order: 13,
      markdown: "Getting compatible pollen onto the right stigma is only the doorway. What the pistil does next — recognising that pollen, then growing a tube down to the ovule — is the story of pollen-pistil interaction, coming up next.",
    },
    {
      id: 'c59f011e-66ca-47d1-84ef-96b2dffc7ef6',
      type: 'inline_quiz',
      order: 14,
      pass_threshold: 0.67,
      questions: [
        {
          id: '8eac9305-376d-42bd-be0d-e3108c740b9d',
          question: "Pollen is carried by a pollinator from one flower to a second flower on the same plant. What is this called, and what is its genetic outcome?",
          options: [
            "Xenogamy — genetically different pollen reaches the stigma",
            "Autogamy — but it happens between two separate flowers",
            "Geitonogamy — functionally cross-pollination, but genetically the same as self-pollination",
            "Hydrophily — the pollen must have been carried by water",
          ],
          correct_index: 2,
          explanation: "Two flowers, same plant, carried by an agent — that's geitonogamy: it looks like cross-pollination but the pollen is genetically identical to self-pollen. It isn't xenogamy, which needs the pollen to come from a different plant, and it isn't plain autogamy, which is strictly within a single flower.",
          difficulty_level: 1,
        },
        {
          id: '3fb17c5b-1361-4e78-b724-1e96c13c1742',
          question: "Which one of these is the only kind of pollination that brings genetically different pollen grains to a stigma?",
          options: [
            "Xenogamy",
            "Geitonogamy",
            "Autogamy",
            "Cleistogamy",
          ],
          correct_index: 0,
          explanation: "Only xenogamy moves pollen from one plant to a different plant, so only it delivers genetically different pollen. Geitonogamy and autogamy both keep the pollen within the same plant, and cleistogamy is an extreme form of autogamy in flowers that never open — all three are genetically self.",
          difficulty_level: 2,
        },
        {
          id: 'da87030a-b8df-4272-80a3-1b0c5ce8110f',
          question: "A flower has dull colours, no nectar, well-exposed dangling stamens and a large feathery stigma. What pollinates it?",
          options: [
            "Insects, drawn in by the feathery stigma",
            "Water, which the exposed stamens are shaped to float on",
            "Wind, caught by the feathery stigma and shed from the exposed stamens",
            "Birds such as sunbirds, attracted by the large stigma",
          ],
          correct_index: 2,
          explanation: "Dull, nectarless flowers with exposed stamens and a feathery stigma are the signature of wind pollination — the stamens release light pollen into the breeze and the feathery stigma nets what drifts by. Insect- and bird-pollinated flowers would instead be colourful, fragrant and nectar-rich, so those options don't fit.",
          difficulty_level: 2,
        },
        {
          id: '938c5f5d-21da-4064-9530-559adf9fb2d9',
          question: "Which statement about water pollination (hydrophily) matches NCERT?",
          options: [
            "All aquatic flowering plants are pollinated by water",
            "It is rare, seen in about 30 genera that are mostly monocots, such as Vallisneria and Zostera",
            "Water-pollinated flowers are brightly coloured and rich in nectar to attract fish",
            "Wheat and rice are the standard examples of water-pollinated crops",
          ],
          correct_index: 1,
          explanation: "NCERT calls water pollination rare — about 30 genera, mostly monocots — with Vallisneria, Hydrilla and the sea-grass Zostera as examples. Not every water plant uses it (water hyacinth and water lily are pollinated by insects or wind), water-pollinated flowers are dull and nectarless, and wheat and rice are wind-pollinated cereals, not water-pollinated.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
