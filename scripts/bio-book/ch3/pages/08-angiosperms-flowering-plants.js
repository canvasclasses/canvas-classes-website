'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'angiosperms-flowering-plants',
  title: 'Angiosperms: Flowers, Fruits & Seeds',
  subtitle: "Gymnosperms leave their seeds out in the open; angiosperms wrap theirs inside a fruit and pack the whole reproductive job into a flower. That one difference — naked seed vs enclosed seed — is the whole story of this group.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['angiosperms', 'flowering-plants', 'dicotyledons', 'monocotyledons', 'plant-kingdom'],
  glossary: [
    { term: 'angiosperm', definition: 'A flowering plant. Its pollen grains and ovules develop inside a flower, and its seeds are enclosed inside a fruit.' },
    { term: 'flower', definition: 'The specialised structure of an angiosperm in which the pollen grains and ovules are produced.' },
    { term: 'fruit', definition: 'The structure that encloses the seeds of an angiosperm — the feature that separates them from the naked-seeded gymnosperms.' },
    { term: 'cotyledon', definition: 'The seed leaf inside a seed. The number of cotyledons — one or two — is what splits angiosperms into their two classes.' },
    { term: 'dicotyledon', definition: 'The class of angiosperms whose seeds contain two cotyledons (e.g. mango).' },
    { term: 'monocotyledon', definition: 'The class of angiosperms whose seeds contain one cotyledon (e.g. wheat).' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk meadow rising from tiny floating plants on a pond to a grove of towering trees, flowers scattered across the middle',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk landscape showing the enormous size range of flowering plants: on the far left, the still surface of a small pond dotted with minute floating green specks (tiny aquatic plants), the water opening into a wide flowering meadow in the middle of the frame where scattered wildflowers catch the last light, and on the far right the meadow giving way to a grove of immensely tall, slender trees soaring far above the horizon line. A single soft warm amber glow low behind the distant trees ties the whole scene together. No text, no labels, no diagram elements. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones).",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'From a Speck on a Pond to a 100-Metre Giant',
      markdown: "The flowering plants are not a small, tidy group — they run the full range of size a plant can reach. The **smallest** of them is **Wolffia**, a floating plant so tiny it can sit on the surface of a pond as a green speck. At the other end stand the **Eucalyptus** trees, which grow to **over 100 metres** tall. Same group, same basic plan — one flower, seeds tucked inside a fruit — stretched across almost the entire scale of plant life on land and water.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You just met the **gymnosperms**, where the **ovules sit naked** — out in the open, with no wall around the seed. **Angiosperms**, the **flowering plants**, do the opposite. In an angiosperm, the **pollen grains and ovules are produced inside specialised structures called flowers**, and after fertilisation the **seeds are enclosed inside fruits**. That is the single line that separates the two: gymnosperm seeds are naked, angiosperm seeds are wrapped in a fruit.\n\nAngiosperms are an **exceptionally large group of plants**, found across a **wide range of habitats** — which is why their size runs all the way from the tiny **Wolffia** to the towering **Eucalyptus** (over 100 metres). They are also the group we lean on most: they **provide us with food, fodder, fuel, medicines, and several other commercially important products**. Because the group is so vast, it is split into two classes based on one simple feature inside the seed — the number of **cotyledons** (seed leaves)."
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Two Classes: Dicots & Monocots',
      objective: "By the end of this you can split any angiosperm into its class the moment you know one thing — how many cotyledons its seed carries.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The angiosperms are **divided into two classes**: the **dicotyledons** and the **monocotyledons**. The word itself tells you the rule. *Di-* means two, *mono-* means one, and a **cotyledon** is the **seed leaf** stored inside a seed. So the whole division rests on one count — the **number of cotyledons the seed contains**. A seed with **two** cotyledons is a **dicotyledon** (a dicot); a seed with **one** cotyledon is a **monocotyledon** (a monocot). That is the classification NCERT draws here, and it is enough to place a flowering plant into its class."
    },
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Dicotyledons vs Monocotyledons',
      columns: [
        {
          heading: 'Dicotyledons (Dicots)',
          points: [
            'Number of cotyledons in the seed: TWO',
            'Prefix di- = two seed leaves',
            'NCERT example: Mango (Mangifera indica)',
          ],
        },
        {
          heading: 'Monocotyledons (Monocots)',
          points: [
            'Number of cotyledons in the seed: ONE',
            'Prefix mono- = one seed leaf',
            'NCERT example: Wheat (Triticum aestivum)',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'A dicot seedling with two cotyledons beside a monocot seedling with one cotyledon, and a flower whose base holds a fruit enclosing seeds',
      caption: '📸 Tap each dot to explore what makes a plant an angiosperm — and which class it belongs to',
      generation_prompt: "Scientific textbook illustration contrasting the two classes of angiosperms plus the enclosed-seed feature. Flat 2D educational diagram on a dark background (#0a0a0a near-black). LEFT: a young germinating seedling shown emerging from a split seed that has TWO plump rounded seed leaves (cotyledons) flanking a central shoot, coloured green for the living seedling with pale tan seed halves. CENTRE-RIGHT: a second young germinating seedling emerging from a seed that has only ONE narrow elongated seed leaf (cotyledon) with a single slender first shoot, again green seedling with a pale tan seed. RIGHT: a simple open flower with a few petals, and directly below the flower a rounded fruit shown in cutaway so that small seeds are clearly visible ENCLOSED inside the wall of the fruit — the fruit wall drawn in tan/brown, the enclosed seeds as small pale ovals inside. Clean white outlines, thin white leader lines, biologically accurate proportions, green for living seedling tissue, tan/brown for seed coats and fruit wall. No text or labels baked into the image itself. No photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.55, label: 'Dicot seedling — two cotyledons', icon: 'circle',
          detail: 'This seed splits into **two** seed leaves (cotyledons). Two cotyledons = a **dicotyledon**. NCERT example: mango.' },
        { id: uuid(), x: 0.44, y: 0.55, label: 'Monocot seedling — one cotyledon', icon: 'circle',
          detail: 'This seed carries just **one** seed leaf (cotyledon). One cotyledon = a **monocotyledon**. NCERT example: wheat.' },
        { id: uuid(), x: 0.80, y: 0.24, label: 'Flower', icon: 'circle',
          detail: 'The **specialised structure** where an angiosperm produces its **pollen grains and ovules**. Having a flower is what makes a plant a flowering plant.' },
        { id: uuid(), x: 0.80, y: 0.70, label: 'Fruit enclosing seeds', icon: 'circle',
          detail: 'After fertilisation the **seeds are enclosed inside a fruit**. This wrapped, protected seed is the feature that sets angiosperms apart from the naked-seeded gymnosperms.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A cycad (a gymnosperm) and a mango tree (an angiosperm) both produce true seeds — so both are seed plants. Yet botanists still place them in two separate groups. What is the single feature that most cleanly justifies keeping them apart?",
      options: [
        "The mango is much taller than the cycad, and height is used to separate the two groups",
        "In the gymnosperm the ovules and seeds are naked, while in the angiosperm the ovules develop inside a flower and the seeds are enclosed in a fruit",
        "Only the cycad makes seeds; the mango reproduces without seeds of any kind",
        "The cycad has one cotyledon and the mango has two, and cotyledon number separates gymnosperms from angiosperms",
      ],
      correct_index: 1,
      reveal: "Both plants do make seeds, so 'has seeds or not' can't be the dividing line. The real split is **naked vs enclosed**: a gymnosperm leaves its **ovules and seeds naked**, with no wall around them, while an angiosperm develops its ovules **inside a flower** and ends up with its **seeds enclosed in a fruit**. Height is irrelevant (a tiny Wolffia is still an angiosperm), the mango certainly does make seeds, and cotyledon number (one vs two) splits angiosperms into monocots and dicots — it does *not* separate gymnosperms from angiosperms.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'Lock These In',
      markdown: "- **Angiosperm = flowering plant:** pollen grains and ovules develop inside **flowers**, and the **seeds are enclosed in fruits**.\n- **The gymnosperm contrast:** gymnosperm seeds are **naked**; angiosperm seeds are **enclosed**. That is the defining difference.\n- **Two classes, split by cotyledon number:** **dicotyledons** = **two** cotyledons; **monocotyledons** = **one** cotyledon.\n- **Size extremes:** smallest is **Wolffia**; tallest is **Eucalyptus** (over **100 metres**).\n- **Uses:** food, fodder, fuel, medicines, and other commercial products.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Angiosperm vs gymnosperm:** the one-word answer NEET wants is **enclosed vs naked seed**. Angiosperm seeds are enclosed in a fruit; gymnosperm ovules and seeds are naked. Don't let a question tempt you into 'angiosperms have seeds, gymnosperms don't' — both are seed plants.\n\n**Dicot vs monocot:** the basis is the **number of cotyledons** — **two** for dicots, **one** for monocots. This is the split *within* angiosperms, never the split between angiosperms and gymnosperms.\n\n**Size extremes:** **Wolffia** = smallest angiosperm; **Eucalyptus** (over 100 m) = tallest. These two names are the classic 'range of size' fill-in-the-blank.\n\n**Classic NEET question:** \"The seeds of angiosperms differ from those of gymnosperms in being ___\" → **enclosed within a fruit.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'The single feature that separates angiosperms from gymnosperms is that in angiosperms the:',
          options: [
            'Plants produce no seeds at all',
            'Seeds are enclosed within a fruit, while gymnosperm seeds are naked',
            'Seeds always contain exactly one cotyledon',
            'Ovules develop on the surface of exposed leaves',
          ],
          correct_index: 1,
          explanation: "Both groups make seeds, so the dividing line is enclosed vs naked: angiosperm seeds are enclosed in a fruit while gymnosperm ovules and seeds are naked. 'No seeds at all' is false for a seed plant, 'exactly one cotyledon' describes only monocots (not all angiosperms), and it is the gymnosperms whose ovules sit exposed — not the angiosperms.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Angiosperms are divided into dicotyledons and monocotyledons on the basis of the:',
          options: [
            'Height reached by the mature plant',
            'Number of cotyledons present in the seed',
            'Presence or absence of a flower',
            'Whether the seed is naked or enclosed',
          ],
          correct_index: 1,
          explanation: "NCERT splits the two classes by the number of cotyledons in the seed — two for dicots, one for monocots. Height varies wildly within angiosperms (Wolffia to Eucalyptus) and isn't the basis; every angiosperm has flowers, so a flower can't separate the two classes; and naked-vs-enclosed distinguishes gymnosperms from angiosperms, not dicots from monocots.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A seed is found to contain a single cotyledon. The plant it grows into is a:',
          options: [
            'Dicotyledon, because one seed leaf means the di- group',
            'Gymnosperm, because only gymnosperms have cotyledons',
            'Monocotyledon, because one cotyledon means the mono- group',
            'Bryophyte, which produces single-cotyledon seeds',
          ],
          correct_index: 2,
          explanation: "One cotyledon means mono- (monocotyledon); two cotyledons would make it a dicotyledon, so the first option swaps the prefixes. Cotyledon number is a feature used to classify angiosperms, not a gymnosperm marker, and bryophytes make no seeds at all — they reproduce by spores.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which pair correctly names the smallest and the tallest angiosperms mentioned by NCERT?',
          options: [
            'Smallest — Eucalyptus; tallest — Wolffia',
            'Smallest — Wolffia; tallest — Eucalyptus',
            'Smallest — Sphagnum; tallest — Cycas',
            'Smallest — Wolffia; tallest — Pinus',
          ],
          correct_index: 1,
          explanation: "NCERT names Wolffia as the smallest angiosperm and Eucalyptus (over 100 m) as the tallest — the second option has them the right way round. The first option reverses them; Sphagnum is a moss and Cycas and Pinus are gymnosperms, so those two pairs bring in plants that aren't even angiosperms.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
