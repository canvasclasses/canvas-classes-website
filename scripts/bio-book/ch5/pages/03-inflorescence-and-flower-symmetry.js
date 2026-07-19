'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'inflorescence-and-flower-symmetry',
  title: 'Inflorescence and Flower Symmetry',
  subtitle: "Learn to read any flower cluster as racemose or cymose, and any single flower — its whorls, its symmetry, and exactly where its ovary sits — the way NCERT's most-tested diagram, Figure 5.9, demands.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['morphology-of-flowering-plants', 'inflorescence', 'flower'],
  glossary: [
    { term: 'inflorescence', definition: 'The arrangement of flowers on the floral axis.' },
    { term: 'racemose', definition: 'An inflorescence in which the main axis keeps growing and flowers are borne laterally in acropetal succession — oldest flowers near the base, youngest nearest the still-growing tip.' },
    { term: 'cymose', definition: 'An inflorescence in which the main axis itself terminates in a flower, so growth is limited; flowers are borne in basipetal order — the terminal flower forms first, younger flowers appear below it.' },
    { term: 'thalamus (receptacle)', definition: "The swollen tip of a flower's stalk (pedicel) on which all four floral whorls are arranged." },
    { term: 'perianth', definition: 'The term used when a flower’s calyx and corolla are not distinct from each other, as in lily.' },
    { term: 'actinomorphic', definition: 'Radially symmetric — a flower that can be divided into two equal halves along any radial plane through its centre, e.g. mustard, datura, chilli.' },
    { term: 'zygomorphic', definition: 'Bilaterally symmetric — a flower that can be divided into two similar halves along only one particular vertical plane, e.g. pea, gulmohur, bean, Cassia.' },
    { term: 'hypogynous', definition: 'A flower in which the gynoecium sits highest, above the other whorls, giving a superior ovary — e.g. mustard, china rose, brinjal.' },
    { term: 'perigynous', definition: 'A flower in which the gynoecium sits centrally with the other whorls on the rim of the thalamus at almost the same level, giving a half inferior ovary — e.g. plum, rose, peach.' },
    { term: 'epigynous', definition: 'A flower in which the thalamus grows upward and fuses around the ovary, enclosing it below the other whorls, giving an inferior ovary — e.g. guava, cucumber, sunflower ray florets.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Two flowering branches at dusk — one a tall spike still budding at its growing tip, the other capped by a single large terminal flower with smaller buds below it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single dusk garden scene showing two flowering plant branches growing side by side from soil at the bottom of the frame. On the left, a tall flowering spike with several open blossoms spaced up its long stem, its growing tip still capped with a soft unopened bud at the very top, suggesting the stem keeps extending upward. On the right, a shorter branch capped by one large, fully open central flower, with a few smaller flower buds emerging just beneath it, its growth visibly stopped at the top by that first bloom. Soft warm amber dusk light glows behind both branches, tying the two halves of the scene together. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Flower Is a Shoot That Stopped Making Leaves',
      markdown: "Every flower you've ever picked started out as an ordinary growing shoot tip — the same kind of tip that would otherwise keep pushing out leaves, one after another. At some point that tip switches jobs: instead of leaves, it starts laying down sepals, petals, stamens and carpels instead, and the tiny stretches of stem between each one refuse to lengthen. That's why a flower looks like a tightly packed bundle instead of a spread-out branch — and it's also the reason a cluster of flowers can be built in two completely different ways, depending on whether that growing tip ever turns into a flower itself.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A flower is a **modified shoot**. Its shoot apical meristem — the growing tip that would normally keep adding stem and leaves — changes into a **floral meristem** instead. Two things happen together. First, the **internodes stop elongating** and the whole axis **condenses**, which is why every floral part ends up sitting almost on top of the next instead of spread along a long stem. Second, the apex stops producing leaves and instead lays down **different kinds of floral appendages, one after another at successive nodes**. Whenever a shoot tip itself turns into a flower this way, that flower is always **solitary** — a single flower on its own, not part of a cluster.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Racemose vs Cymose — Reading the Inflorescence',
      objective: "By the end of this you can look at a flower cluster and tell whether it's racemose or cymose, and say which end holds the oldest flowers.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Most flowers are not solitary the way a shoot-tip flower is — they sit in a cluster instead, and the **arrangement of flowers on the floral axis** is called the **inflorescence**. Which of two shapes that cluster takes depends on one question: does the growing tip of the axis ever turn into a flower and stop, or does it keep growing?\n\nIf the **main axis keeps growing**, the flowers are borne laterally along it as growth continues — this is a **racemose** inflorescence (Figure 5.7). Because the tip is never used up making a flower, new flowers keep appearing closest to the still-growing tip while the older ones are left behind lower down. NCERT records this order as **acropetal succession**.\n\nIf the **main axis itself terminates in a flower**, growth is **limited** — once the tip becomes a flower, the axis can't extend any further. This is a **cymose** inflorescence (Figure 5.8). Here the flowers are borne in **basipetal order**: the terminal flower caps the axis first, and every flower that follows has to appear below it.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 5, title: 'Racemose vs Cymose Inflorescence',
      columns: [
        { heading: 'Racemose', points: [
          'Main axis keeps growing — it never turns into a flower itself',
          'Growth is indefinite; the tip stays free to keep adding flowers',
          'Flowers borne laterally along the axis',
          'Order: acropetal succession',
          'See Figure 5.7',
        ] },
        { heading: 'Cymose', points: [
          'Main axis itself terminates in a flower',
          'Growth is limited — once the tip becomes a flower, it stops extending',
          'The terminal flower caps the axis; later flowers appear below it',
          'Order: basipetal order',
          'See Figure 5.8',
        ] },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Flower — Whorls, Symmetry, and Merosity',
      objective: "By the end of this you can name a flower's four whorls in order, and read its symmetry and merosity straight off a diagram.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The **flower is the reproductive unit of angiosperms** — its job is sexual reproduction. A typical flower carries **four different kinds of whorls**, arranged one after another on the swollen tip of the stalk, called the **thalamus** or **receptacle**: the **calyx**, the **corolla**, the **androecium**, and the **gynoecium**. Calyx and corolla are the **accessory organs**; androecium and gynoecium are the **reproductive organs**. In some flowers, like lily, the calyx and corolla aren't kept visually distinct — together they're simply called the **perianth**.\n\nWhether a flower can reproduce on its own depends on which reproductive whorls it carries. A flower with **both androecium and gynoecium** is **bisexual**. A flower with **only stamens or only carpels** is **unisexual**.\n\nEvery flower also has a shape you can read at a glance — its **symmetry**. If it can be split into two equal radial halves along *any* plane through its centre, it's **actinomorphic** — mustard, datura, and chilli all show this. If it can only be split into two similar halves along *one particular* vertical plane, it's **zygomorphic** — pea, gulmohur, bean, and Cassia are the examples. And if it **cannot** be split into two similar halves by any vertical plane at all, it's **asymmetric (irregular)** — canna is NCERT's example.\n\nTwo more labels round out how a flower is described. If its floral appendages come in multiples of 3, 4, or 5, the flower is **trimerous**, **tetramerous**, or **pentamerous** respectively. And a flower may carry a **bract** — a reduced leaf at the base of the pedicel — which makes it **bracteate**; without one, it's **ebracteate**.",
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Where the Ovary Sits — Hypogynous, Perigynous, Epigynous',
      objective: "By the end of this you can look at any named flower or fruit and say whether its ovary is superior, half inferior, or inferior.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "NCERT describes flowers one more way: by **where the calyx, corolla, and androecium sit relative to the ovary on the thalamus** (Figure 5.9). This gives three positions.\n\nIn a **hypogynous** flower, the **gynoecium occupies the highest position**, with every other whorl attached below it. Because the ovary sits above everything else, it is called **superior** — mustard, china rose, and brinjal show this.\n\nIn a **perigynous** flower, the **gynoecium sits in the centre**, and the other whorls are attached around it on the rim of the thalamus, at almost the same level as the ovary. The ovary here is **half inferior** — plum, rose, and peach are the examples.\n\nIn an **epigynous** flower, the **margin of the thalamus grows upward**, encloses the ovary completely, and **fuses with it**, so the other whorls end up arising **above** the ovary. Because the ovary is now enclosed below everything else, it is called **inferior** — guava, cucumber, and the ray florets of the sunflower are all epigynous.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 10, src: '',
      alt: 'Three flower cross-sections showing the ovary sitting above, level with, and enclosed below the other floral whorls',
      caption: '📸 Tap each flower to see where its ovary sits, and whether it’s superior, half inferior, or inferior',
      generation_prompt: "Scientific textbook illustration comparing the position of floral parts on the thalamus. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Three flower cross-sections shown side by side on a common baseline, each built on a central thalamus/receptacle with sepals and petals in white outline attached around a central ovary coloured pink/magenta. LEFT (Hypogynous): the ovary sits clearly above and higher than the other whorls, which are attached low on the thalamus, well below the ovary's base — the ovary fully exposed above everything else. MIDDLE (Perigynous): the ovary sits level in the centre of a cup-shaped thalamus, with the other whorls attached around its rim at almost the same height as the ovary itself. RIGHT (Epigynous): the thalamus has grown upward and fused completely around the ovary, burying it below the point where the other whorls attach, so only the very top of the ovary is visible and the other whorls arise from above it. Clean white outlines, thin white leader lines, biologically accurate proportions, pink/magenta = ovary/reproductive tissue, green = sepals. No photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.42, label: 'Hypogynous', icon: 'circle',
          detail: "The **gynoecium sits highest**, above every other whorl. The ovary is **superior**. Example: **mustard, china rose, brinjal**." },
        { id: uuid(), x: 0.5, y: 0.52, label: 'Perigynous', icon: 'circle',
          detail: "The **gynoecium sits in the centre**, with the other whorls attached on the rim of the thalamus at almost the same level. The ovary is **half inferior**. Example: **plum, rose, peach**." },
        { id: uuid(), x: 0.84, y: 0.62, label: 'Epigynous', icon: 'circle',
          detail: "The thalamus margin grows upward and **fuses completely around the ovary**; the other whorls arise **above** it. The ovary is **inferior**. Example: **guava, cucumber, sunflower ray florets**." },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A guava flower has its calyx, corolla, and stamens attached to the rim of a thalamus that has grown upward and fused completely around the ovary, so the ovary sits enclosed below everything else. What position is this flower's ovary in, and what is it correctly called?",
      options: [
        'Hypogynous, with a superior ovary',
        'Perigynous, with a half inferior ovary',
        'Epigynous, with an inferior ovary',
        'Epigynous, with a superior ovary',
      ],
      correct_index: 2,
      reveal: "The description matches epigynous exactly: the thalamus margin has grown upward, fused completely with the ovary, and the other whorls now arise above it — NCERT names guava as one of its epigynous examples. Because the ovary ends up enclosed below the other parts, it is called **inferior**. A hypogynous flower has the ovary sitting *highest*, above the other whorls, giving a superior ovary — the opposite of what's described here. A perigynous flower keeps the other whorls level with the ovary on the rim of a cup-shaped thalamus, giving a half inferior ovary, which also doesn't match since here the thalamus has fully fused around the ovary rather than just surrounding it at the same level. And 'epigynous with a superior ovary' pairs the right position with the wrong ovary term — epigynous always pairs with inferior, never superior.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: 'Lock These In',
      markdown: "- **Hypogynous → superior ovary** (gynoecium highest; mustard, china rose, brinjal). **Perigynous → half inferior ovary** (gynoecium central, other whorls level with it on the rim; plum, rose, peach). **Epigynous → inferior ovary** (thalamus fuses around and encloses the ovary; guava, cucumber, sunflower ray florets).\n- **Racemose** = main axis keeps growing, flowers in **acropetal** succession. **Cymose** = main axis ends in a flower, flowers in **basipetal** order.\n- **Calyx + corolla = accessory organs. Androecium + gynoecium = reproductive organs.** Lily's calyx and corolla aren't distinct — together they're the **perianth**.\n- **Actinomorphic** = radial symmetry, any plane (mustard, datura, chilli). **Zygomorphic** = bilateral symmetry, one plane only (pea, gulmohur, bean, Cassia). **Asymmetric** = no plane of symmetry at all (canna).",
    },
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Ovary position ↔ ovary term — the single highest-yield fact on this page:** Hypogynous → **superior**. Perigynous → **half inferior**. Epigynous → **inferior**. NEET names a flower or fruit (mustard, china rose, brinjal / plum, rose, peach / guava, cucumber, sunflower ray florets) and asks for the position or the ovary term — know both directions cold.\n\n**Acropetal vs basipetal:** racemose = **acropetal** (main axis keeps growing). Cymose = **basipetal** (main axis ends in a flower). Any option that swaps these two is the trap.\n\n**Solitary flower ≠ inflorescence:** when a shoot tip itself becomes a flower, it's always solitary — that's different from an inflorescence, which is flowers arranged along a growing or terminating axis.\n\n**Classic NEET question:** \"In which of these is the ovary described as half inferior?\" → **Perigynous** (plum, rose, peach).",
    },
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now have the vocabulary to place any flower — racemose or cymose, actinomorphic or zygomorphic, hypogynous or epigynous. Next, you'll open the flower up whorl by whorl, starting with the calyx and corolla.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In a racemose inflorescence, which end of the floral axis carries the flowers that formed most recently?',
          options: [
            'Nearest the growing tip, since the main axis keeps growing and adds new flowers there',
            'Nearest the base, since the tip stopped growing early',
            'It cannot be determined without seeing the plant',
            'The middle of the axis, since flowers form outward from the centre',
          ],
          correct_index: 0,
          explanation: "A racemose inflorescence keeps its main axis growing indefinitely, so flowers are added in acropetal succession — the newest flowers sit closest to the still-growing tip, while the oldest are left lower down. 'Nearest the base' describes the opposite pattern, basipetal order, which belongs to cymose inflorescences instead — and flowers don't form outward from a central point in either type.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A rose flower has its gynoecium sitting in the centre of a cup-shaped thalamus, with its calyx, corolla, and stamens attached around the rim at almost the same height as the ovary. What is this ovary correctly called?',
          options: ['Superior', 'Half inferior', 'Inferior', 'Accessory'],
          correct_index: 1,
          explanation: "This is the perigynous arrangement NCERT describes for plum, rose, and peach — gynoecium central, other whorls on the rim at nearly the same level — and that arrangement gives a half inferior ovary. Superior belongs to hypogynous flowers, where the ovary sits highest above everything else; inferior belongs to epigynous flowers, where the ovary is enclosed below the other whorls. 'Accessory' isn't an ovary position at all — it describes the calyx and corolla as organs, not the ovary.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which pair of flowers does NCERT give as examples of zygomorphic (bilateral) symmetry?',
          options: ['Mustard and datura', 'Pea and gulmohur', 'Guava and cucumber', 'Plum and peach'],
          correct_index: 1,
          explanation: "Pea and gulmohur, along with bean and Cassia, are NCERT's examples of zygomorphic flowers — divisible into two similar halves along only one particular vertical plane. Mustard and datura are actinomorphic examples instead; guava and cucumber are epigynous examples, about ovary position rather than symmetry; and plum and peach are perigynous examples — none of those three answer the symmetry question asked.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A flower has stamens but no carpels, floral parts in multiples of four, and a small reduced leaf at the base of its pedicel. How would this flower correctly be described?',
          options: [
            'Bisexual, tetramerous, ebracteate',
            'Unisexual, tetramerous, bracteate',
            'Unisexual, trimerous, bracteate',
            'Bisexual, pentamerous, bracteate',
          ],
          correct_index: 1,
          explanation: "Carrying only stamens and no carpels makes the flower unisexual, not bisexual, which needs both androecium and gynoecium. Floral parts in multiples of four make it tetramerous, not trimerous (multiples of 3) or pentamerous (multiples of 5). And a reduced leaf at the base of the pedicel is a bract, which makes the flower bracteate, not ebracteate — so only 'unisexual, tetramerous, bracteate' matches every detail given.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
