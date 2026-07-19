'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-fruit-and-the-seed',
  title: 'The Fruit and the Seed',
  subtitle: "Every mango you've eaten is a fully labelled diagram — epicarp, mesocarp, endocarp. Learn to read the fruit and the seed inside it, dicot or monocot, and two of NEET's favourite swap-traps stop being traps.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['morphology-of-flowering-plants', 'fruit', 'seed'],
  glossary: [
    { term: 'parthenocarpic fruit', definition: 'A fruit that forms without fertilisation of the ovary — so it develops without seeds.' },
    { term: 'pericarp', definition: 'The wall of the fruit, formed from the wall of the ovary. May stay dry or become fleshy.' },
    { term: 'epicarp', definition: 'The outer layer of a thick, fleshy pericarp — e.g. the thin outer skin of a mango.' },
    { term: 'mesocarp', definition: 'The middle layer of a thick, fleshy pericarp — e.g. the fleshy edible part of a mango, or the fibrous layer of a coconut.' },
    { term: 'endocarp', definition: 'The innermost layer of a thick, fleshy pericarp — e.g. the stony hard layer around the seed in a mango.' },
    { term: 'drupe', definition: 'A one-seeded fruit that develops from a monocarpellary superior ovary, with a pericarp differentiated into epicarp, mesocarp and endocarp — e.g. mango, coconut.' },
    { term: 'seed coat', definition: "The outermost covering of a seed, made of an outer testa and an inner tegmen." },
    { term: 'hilum', definition: 'A scar on the seed coat marking where the seed was attached to the fruit.' },
    { term: 'micropyle', definition: 'A small pore on the seed coat, just above the hilum.' },
    { term: 'endospermic seed', definition: 'A seed that retains endosperm, a food-storing tissue formed by double fertilisation, at maturity — e.g. castor.' },
    { term: 'non-endospermous seed', definition: 'A seed in which the endosperm is used up during development and is absent at maturity — e.g. bean, gram, pea.' },
    { term: 'scutellum', definition: 'The single large, shield-shaped cotyledon of a monocot embryo, e.g. in maize.' },
    { term: 'aleurone layer', definition: 'A proteinous layer on the outer covering of the endosperm in a monocot seed, separating the endosperm from the embryo.' },
    { term: 'coleoptile', definition: 'The sheath enclosing the plumule of a monocot embryo.' },
    { term: 'coleorhiza', definition: 'The sheath enclosing the radicle of a monocot embryo.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A ripe mango sliced open at dusk revealing its layered flesh and stony seed, beside a cracked coconut on dark soil',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A ripe mango sliced cleanly in half in the foreground at dusk, its layered flesh visible — thin skin, soft golden flesh, and a pale stony seed at the centre — resting on dark soil. Beside it, a coconut cracked open showing its fibrous husk and hard inner shell. Warm amber side-lighting picking out the cut surfaces, deep shadowed background fading into near-black. Painterly illustration style, atmospheric, dark naturalistic background throughout (#0a0a0a base tones), no people, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'You Have Been Looking at a Labelled Diagram Your Whole Life',
      markdown: "Every time you've peeled a mango, you've handled a **drupe** — a fruit with three distinct layers stacked around the seed. The thin skin you peel off, the soft flesh you eat, and the hard stony bit you spit out are not random parts. They have names — **epicarp, mesocarp, endocarp** — and once you know them, a mango stops being just fruit and starts being a diagram you can label from memory.",
    },
    // ── 1 · The Fruit ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'The Fruit',
      objective: "By the end of this you'll know exactly what a fruit is, what a parthenocarpic fruit is, and how to name the three layers of a fleshy pericarp using mango and coconut.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "The **fruit is a characteristic feature of flowering plants** — no other group of plants produces one. A fruit is a **mature or ripened ovary**, developed **after fertilisation**. That last part matters: if a fruit forms **without fertilisation** of the ovary, it is called a **parthenocarpic fruit**. It looks like a normal fruit from the outside, but nothing fertilised it into existence.\n\nA fruit generally has two parts: the **wall, or pericarp**, and the **seeds** inside it. The pericarp can stay **dry**, or it can become **fleshy**. When it's thick and fleshy, it differentiates into three distinct layers — the outer **epicarp**, the middle **mesocarp**, and the inner **endocarp**. These aren't three separate structures glued together; they're one wall that has split into three regions as it matured.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Mango and coconut are both examples of a **drupe** — a fruit that develops from a **monocarpellary superior ovary** and is **one-seeded**. In **mango**, the pericarp is well differentiated: a **thin outer epicarp**, a **fleshy edible mesocarp** (the part you actually eat), and an **inner stony hard endocarp** (the part enclosing the seed, which you throw away). **Coconut is also a drupe**, built the same way — except here the **mesocarp is fibrous** rather than fleshy, which is exactly why a coconut husk is stringy instead of juicy.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "A mango and a coconut are both classified as drupes, meaning both have a pericarp differentiated into epicarp, mesocarp and endocarp. So why does biting into a mango give you soft juicy flesh, while a coconut gives you a tough fibrous husk instead?",
      options: [
        "Coconut is not actually a drupe, so the comparison with mango doesn't apply",
        "In coconut the endocarp is fleshy while in mango it is stony, which reverses the texture",
        "Both fruits have the identical three-layer structure, but in coconut the mesocarp is fibrous, while in mango the mesocarp is fleshy and edible — the difference is in that one middle layer",
        "Coconut has no epicarp at all, so its outer layer feels rough instead of smooth",
      ],
      reveal: "Both mango and coconut are drupes with the same three-layer plan — epicarp, mesocarp, endocarp — because both develop from a monocarpellary superior ovary and are one-seeded. The texture difference comes down to just the **mesocarp**: in mango it's fleshy and edible, in coconut it's fibrous. The endocarp is stony hard in both (that's the seed's protective shell), and coconut does have a thin epicarp, it's just not what you notice first because the fibrous mesocarp beneath it is so much thicker.",
      difficulty_level: 2,
    },
    // ── 2 · The Seed / Dicot seed ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Structure of a Dicotyledonous Seed',
      objective: "By the end of this you'll be able to label every part of a dicot seed — seed coat, hilum, micropyle, cotyledons, radicle, plumule — and tell an endospermic seed from a non-endospermous one.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "After fertilisation, the **ovules develop into seeds**. A seed is made up of a **seed coat** and an **embryo**. The embryo itself is made of a **radicle**, an **embryonal axis**, and either **one cotyledon** (as in wheat and maize) or **two cotyledons** (as in gram and pea). That single number — one cotyledon or two — is the split that runs through the rest of this page: dicot seeds and monocot seeds are built on the same basic plan, but arranged very differently.\n\nThe **outermost covering of a seed is the seed coat**, and it has **two layers**: the **outer testa** and the **inner tegmen**. On the seed coat you'll find the **hilum** — a **scar** marking exactly where the developing seed was attached to the fruit. **Just above the hilum** sits a **small pore called the micropyle**.\n\nInside the seed coat is the **embryo**, made of an **embryonal axis and two cotyledons**. The cotyledons are usually **fleshy and full of reserve food**, which is why a soaked gram or pea seed splits so easily into two halves. At the **two ends of the embryonal axis** sit the **radicle** and the **plumule**.\n\nSome seeds still carry **endosperm** at maturity — a **food-storing tissue formed by double fertilisation** — as in **castor**. These are called **endospermic seeds**. In others, like **bean, gram and pea**, the endosperm is **not present in the mature seed** — it gets used up during development — and these are called **non-endospermous** seeds.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Cutaway of a dicotyledonous seed labelled with seed coat, hilum, micropyle, two cotyledons, plumule and radicle',
      caption: '📸 Tap each dot to explore the structure of a dicotyledonous seed',
      generation_prompt: "Scientific textbook illustration of a dicotyledonous seed, longitudinal cutaway view (based on NCERT Figure 5.14). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single oval seed shown split open lengthwise: a thin outer seed coat wrapping the whole seed; on the lower edge a small notch-like hilum with a tiny pore just above it (the micropyle); inside, two large fleshy cotyledon halves filling most of the seed's volume; between them, a short embryonal axis with a pointed radicle at the bottom end and a small plumule with tiny embryonic leaves at the top end. Clean white outlines, biologically accurate proportions, tan/brown for the seed coat, pale cream for the cotyledons, thin white leader lines but NO baked-in text labels. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.14, y: 0.5, label: 'Seed coat', icon: 'circle',
          detail: 'The outermost covering of the seed. Has **two layers**: the outer **testa** and the inner **tegmen**.' },
        { id: uuid(), x: 0.22, y: 0.82, label: 'Hilum', icon: 'circle',
          detail: 'A **scar** on the seed coat, marking where the developing seed was **attached to the fruit**.' },
        { id: uuid(), x: 0.26, y: 0.70, label: 'Micropyle', icon: 'circle',
          detail: 'A **small pore**, sitting **just above the hilum**, on the seed coat.' },
        { id: uuid(), x: 0.40, y: 0.42, label: 'Cotyledons (two)', icon: 'circle',
          detail: 'Part of the embryo. **Two cotyledons** in a dicot seed, usually **fleshy and full of reserve food materials**.' },
        { id: uuid(), x: 0.55, y: 0.20, label: 'Plumule', icon: 'circle',
          detail: 'Sits at one end of the embryonal axis. Develops into the **shoot** of the seedling.' },
        { id: uuid(), x: 0.55, y: 0.68, label: 'Radicle', icon: 'circle',
          detail: 'Sits at the other end of the embryonal axis. Develops into the **root** of the seedling.' },
      ],
    },
    // ── 3 · Monocot seed ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Structure of a Monocotyledonous Seed',
      objective: "By the end of this you'll be able to label a monocot seed like maize — endosperm, aleurone layer, scutellum, coleoptile, coleorhiza — and stop mixing up which sheath covers which part.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "**Monocotyledonous seeds are generally endospermic**, though a few — **orchids**, for instance — are **non-endospermic**. Take a **cereal like maize** as the working example. Here the **seed coat is membranous** and is **generally fused with the fruit wall**, so you can't peel the two apart the way you can in a dicot seed. The **endosperm is bulky and stores food** — it's the largest part of the seed by far. The **outer covering of the endosperm** carries a **proteinous layer called the aleurone layer**, which **separates the endosperm from the embryo**.\n\nThe **embryo itself is small**, tucked into a **groove at one end of the endosperm**. It has **one large, shield-shaped cotyledon called the scutellum**, plus a **short axis bearing a plumule and a radicle**. Both of these are enclosed in protective sheaths: the **plumule is enclosed in the coleoptile**, and the **radicle is enclosed in the coleorhiza**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 11, src: '',
      alt: 'Cutaway of a monocotyledonous maize seed labelled with endosperm, aleurone layer, scutellum, plumule, radicle, coleoptile and coleorhiza',
      caption: '📸 Tap each dot to explore the structure of a monocotyledonous (maize) seed',
      generation_prompt: "Scientific textbook illustration of a monocotyledonous seed (maize), longitudinal cutaway view (based on NCERT Figure 5.15). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single oblong seed shown split open lengthwise: a thin membranous seed coat fused to the outer fruit wall running around the whole seed; a large bulky endosperm filling most of the seed's volume, with a thin proteinous aleurone layer as a distinct band along its outer edge; tucked into a groove at one end of the endosperm, a small embryo showing one large shield-shaped scutellum pressed against the endosperm, and a short embryonal axis with a plumule enclosed in a tubular sheath (coleoptile) and a radicle enclosed in a shorter sheath (coleorhiza) pointing the opposite direction. Clean white outlines, biologically accurate proportions, pale cream for the endosperm, tan for the aleurone layer, soft green-tan for the embryo/scutellum, thin white leader lines but NO baked-in text labels. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.5, label: 'Seed coat + fruit wall', icon: 'circle',
          detail: 'The seed coat here is **membranous** and **generally fused with the fruit wall** — you can\'t separate them.' },
        { id: uuid(), x: 0.45, y: 0.35, label: 'Endosperm', icon: 'circle',
          detail: 'Bulky, and **stores food** — the biggest part of the seed. Maize seeds are **generally endospermic**.' },
        { id: uuid(), x: 0.30, y: 0.62, label: 'Aleurone layer', icon: 'circle',
          detail: 'A **proteinous layer** on the outer covering of the endosperm, **separating the endosperm from the embryo**.' },
        { id: uuid(), x: 0.72, y: 0.55, label: 'Scutellum', icon: 'circle',
          detail: 'The embryo\'s **single large, shield-shaped cotyledon** — the monocot equivalent of the dicot\'s two cotyledons.' },
        { id: uuid(), x: 0.85, y: 0.30, label: 'Coleoptile', icon: 'circle',
          detail: 'The **sheath enclosing the plumule**. Say it slowly: "coleo-PTILE" pairs with "PLumule."' },
        { id: uuid(), x: 0.85, y: 0.75, label: 'Coleorhiza', icon: 'circle',
          detail: 'The **sheath enclosing the radicle**. "Coleo-RHIZA" pairs with "Radicle" — rhiza is Greek for root.' },
      ],
    },
    {
      id: uuid(), type: 'comparison_card', order: 12, title: 'Dicot Seed vs Monocot Seed',
      columns: [
        { heading: 'Dicotyledonous Seed', points: [
          'TWO cotyledons in the embryo',
          'Seed coat has two layers: testa (outer) + tegmen (inner), separate from the fruit wall',
          'No scutellum, no coleoptile, no coleorhiza',
          'Often NON-ENDOSPERMOUS at maturity (e.g. bean, gram, pea) — though some, like castor, are endospermic',
        ] },
        { heading: 'Monocotyledonous Seed', points: [
          'ONE large, shield-shaped cotyledon — the scutellum',
          'Seed coat is membranous, generally FUSED with the fruit wall',
          'Plumule enclosed in coleoptile; radicle enclosed in coleorhiza',
          'Generally ENDOSPERMIC (e.g. maize) — though some, like orchids, are non-endospermic',
        ] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember', title: 'The Facts You Cannot Get Wrong',
      markdown: "- A fruit is a **mature, fertilised ovary**; without fertilisation it's a **parthenocarpic fruit**.\n- Fleshy pericarp = **epicarp (outer) + mesocarp (middle) + endocarp (inner)**.\n- **Mango and coconut are both drupes** — mango's mesocarp is fleshy, coconut's mesocarp is fibrous.\n- Seed coat = **testa (outer) + tegmen (inner)**; **hilum** = attachment scar; **micropyle** = pore just above the hilum.\n- **Endospermic** = endosperm present at maturity (castor). **Non-endospermous** = endosperm used up (bean, gram, pea).\n- Monocot (e.g. maize): **scutellum** = the one cotyledon; **coleoptile** sheaths the **plumule**; **coleorhiza** sheaths the **radicle**.",
    },
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Drupe structure, mango-style:** epicarp = thin skin, mesocarp = fleshy edible part, endocarp = stony hard shell around the seed. NEET loves asking which layer is which in mango or coconut — anchor it to the fruit you already know.\n\n**Coleoptile vs coleorhiza — the classic swap:** the **coleoptile sheaths the plumule** (shoot side), the **coleorhiza sheaths the radicle** (root side). If you're unsure, match the letters: coleoPTILE ↔ Plumule, coleoRHIZA ↔ Radicle (rhiza = root in Greek).\n\n**Endospermic vs non-endospermous:** **castor is endospermic** (endosperm survives to maturity); **bean, gram, pea are non-endospermous** (endosperm used up before maturity). Most monocots (maize) are endospermic; a monocot exception is orchids, which are non-endospermic.\n\n**Classic NEET question:** \"In a maize grain, the structure enclosing the radicle is called ___.\" → **Coleorhiza**.",
    },
    // ── 4 · Quiz ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'A fruit develops from an ovary without any fertilisation taking place. What is this fruit called?',
          options: ['A drupe', 'A parthenocarpic fruit', 'An endospermic fruit', 'A pericarp fruit'],
          correct_index: 1,
          explanation: "A fruit that forms without fertilisation is a parthenocarpic fruit. A drupe describes a fruit's structural type (like mango or coconut), not whether it was fertilised; 'endospermic' describes a seed's food storage, and 'pericarp fruit' isn't a real term — pericarp is just the fruit wall.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In a mango, which layer of the pericarp is the fleshy, edible part that you eat?',
          options: ['Mesocarp', 'Epicarp', 'Endocarp', 'Testa'],
          correct_index: 0,
          explanation: "The mesocarp is the middle layer, and in mango it is fleshy and edible. The epicarp is the thin outer skin you peel off, the endocarp is the stony hard layer around the seed that you discard, and testa is a seed-coat layer, not a pericarp layer at all.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Castor seeds retain their endosperm at maturity, while gram and pea seeds do not. What are castor-type seeds called?',
          options: ['Non-endospermous seeds', 'Parthenocarpic seeds', 'Endospermic seeds', 'Monocotyledonous seeds'],
          correct_index: 2,
          explanation: "Seeds that retain endosperm — formed by double fertilisation — at maturity are called endospermic seeds, as in castor. Non-endospermous describes the opposite case (bean, gram, pea); 'parthenocarpic' describes a fruit formed without fertilisation, not a seed's food storage; and being endospermic isn't tied to cotyledon number — dicots like castor can be endospermic too.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In a maize seed, the embryo has a short axis bearing a plumule and a radicle. Which sheath encloses the radicle?',
          options: ['Coleoptile', 'Aleurone layer', 'Scutellum', 'Coleorhiza'],
          correct_index: 3,
          explanation: "The coleorhiza encloses the radicle (root side). The coleoptile is the sheath around the plumule instead — the exact swap this question is testing. The aleurone layer is a proteinous layer separating the endosperm from the embryo, and the scutellum is the single shield-shaped cotyledon, not a sheath at all.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};

// Bridge to the next page: with the fruit and the seed labelled, the next step is putting
// a whole flowering plant into words — the semi-technical description that names every
// part in one clean sequence, root to flower.
