'use strict';
/**
 * Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
 * Page 9 — Post-fertilisation: Endosperm, Embryo, Seed & Fruit.
 *
 * Source of truth: NCERT Class 12 Ch.1, §1.4 "Post-fertilisation: Structures
 * and Events" (lebo101.txt lines 782–918), Figs 1.12–1.15. Rule 0: every fact,
 * name, example and sequence here traces to that text; nothing invented.
 * (testa is used per NCERT's own "integument and testa" exercise pairing;
 *  tegmen/hilum are NOT introduced — NCERT does not name them in this section.)
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'post-fertilisation-endosperm-embryo-seed-and-fruit',
  title: 'After Fertilisation — Endosperm, Embryo, Seed & Fruit',
  subtitle: "Double fertilisation is over. Now the ovule quietly becomes a seed and the ovary becomes a fruit. Here's exactly which old part turns into which new one.",
  page_number: 9,
  page_type: 'lesson',
  tags: [
    'post-fertilisation',
    'endosperm',
    'embryo',
    'seed',
    'fruit',
    'sexual-reproduction-in-flowering-plants',
  ],
  glossary: [
    { term: 'endosperm', definition: 'The triploid (3n) nutritive tissue formed from the primary endosperm cell after double fertilisation. It stores reserve food and feeds the developing embryo.' },
    { term: 'cotyledon', definition: 'The "seed leaf" of the embryo — thick and swollen with stored food. A dicot embryo has two, a monocot has one.' },
    { term: 'radicle', definition: 'The embryonic root tip. It sits at the lower end of the hypocotyl and is covered by a root cap.' },
    { term: 'plumule', definition: 'The embryonic shoot tip. It sits at the upper end of the epicotyl.' },
    { term: 'scutellum', definition: 'The single, shield-shaped cotyledon of a grass (monocot) embryo, attached to one side of the embryonal axis.' },
    { term: 'coleoptile', definition: 'The hollow, protective foliar sheath that covers the shoot apex and young leaves of a monocot (grass) embryo.' },
    { term: 'testa', definition: 'The tough protective outer seed coat, formed when the integuments of the ovule harden.' },
    { term: 'pericarp', definition: 'The wall of the fruit, formed from the wall of the ovary as the ovary ripens.' },
    { term: 'parthenocarpy', definition: 'The formation of a fruit without fertilisation (e.g. banana). Such fruits are seedless and can be induced with growth hormones.' },
  ],
  blocks: [
    // 0 — hero
    {
      id: 'a09bd2d4-555b-4c89-8c07-da42d6705855',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A ripening fruit on a branch at dusk, sliced open to hint at the seeds forming inside',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single ripening fruit hanging from a branch at dusk, its skin catching the last warm low light, one side softly opened to suggest the seeds quietly forming within — the seeds glowing faintly as the focal warm point. Around it, a few spent, withered petals and drying floral parts falling away, hinting that the flower has finished its job and is transforming. Deep dusk lighting throughout, painterly and atmospheric, dark background tones overall (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    // 1 — fun_fact
    {
      id: '3c42f3d2-0a19-4f04-94de-f5966a9669bc',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: "You've Already Drunk an Endosperm",
      markdown: "Crack open a tender coconut and drink the water. That sweet liquid isn't juice — it's **free-nuclear endosperm**, a tissue made of thousands of nuclei floating in a common space, still without cell walls between them. Keep the coconut a little longer and that liquid starts turning into the soft white kernel you eat: the same endosperm, now with walls laid down around each nucleus — the **cellular endosperm**. So the coconut lets you watch a single tissue caught in the act of becoming solid.",
    },
    // 2 — text: overview
    {
      id: '4ac15456-89f4-4d09-8944-030c01e2b032',
      type: 'text',
      order: 2,
      markdown: "Double fertilisation leaves two products sitting inside the embryo sac: a **zygote** (2n) that will become the embryo, and a **primary endosperm cell** (3n) that will become the food store. Everything that happens from here — the endosperm forming, the embryo growing, the ovule ripening into a **seed**, and the ovary ripening into a **fruit** — is grouped together as **post-fertilisation events**.\n\nHold on to one simple mapping, because the whole page hangs on it: the **ovule becomes the seed**, and the **ovary becomes the fruit**. These two changes happen at the same time, side by side.",
    },
    // 3 — heading: endosperm
    {
      id: '7dfcd093-7148-42fa-a214-6ad585915cf2',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'Endosperm — The Food Is Packed First',
      objective: "Work out why the plant builds the pantry (endosperm) before it builds the baby (embryo).",
    },
    // 4 — text: endosperm
    {
      id: '83d9c711-a91c-431e-8c3a-8fc02b9e2957',
      type: 'text',
      order: 4,
      markdown: "**Endosperm development happens before embryo development** — and that ordering is deliberate. The primary endosperm cell divides again and again to build a **triploid (3n) endosperm tissue**, and its cells fill up with reserve food. That food is what nourishes the growing embryo, so the plant stocks the pantry first, then lets the baby start growing into it.\n\nIn the commonest pattern, the primary endosperm nucleus first undergoes repeated **nuclear divisions without cell walls** — this is the **free-nuclear endosperm** stage (the coconut water). Only afterwards do cell walls form and the tissue becomes **cellular** (the coconut kernel).\n\nWhat happens to all this food later splits seeds into two groups. In some plants the endosperm is **completely eaten up by the embryo** before the seed is even mature — pea, groundnut and beans. In others it **stays on in the mature seed** and is used up only during germination — castor and coconut.",
    },
    // 5 — heading: embryo
    {
      id: 'ffd9c8fd-546d-4d70-954a-067d2604ba8f',
      type: 'heading',
      order: 5,
      level: 2,
      text: 'Embryo — From a Ball of Cells to a Tiny Plant',
      objective: "Name every part of a dicot and a monocot embryo, and place each one correctly on the axis.",
    },
    // 6 — text: embryo
    {
      id: '9f00ae1e-8e7a-47d1-95b5-5de2e8ee3932',
      type: 'text',
      order: 6,
      markdown: "The embryo grows at the **micropylar end** of the embryo sac, where the zygote sits. Notice the timing: most zygotes wait to divide until a decent amount of endosperm has already formed — assured food before growth. This early growth, called **embryogeny**, looks the same in both dicots and monocots at first. The zygote becomes a **proembryo**, then passes through a **globular** stage, a **heart-shaped** stage, and finally the mature embryo.\n\n**A typical dicot embryo** has an **embryonal axis** and **two cotyledons**. Split the axis at the level of the cotyledons:\n- Above them is the **epicotyl**, ending in the **plumule** (the future shoot tip).\n- Below them is the **hypocotyl**, ending in the **radicle** (the future root tip), which is capped by a **root cap**.\n\n**A monocot embryo** (grasses) has just **one cotyledon**, called the **scutellum**, set to one side of the axis. At the lower end, the radicle and root cap are wrapped in a sheath called the **coleorrhiza**. Above the scutellum's attachment is the epicotyl, whose shoot apex and young leaves are enclosed in a hollow sheath, the **coleoptile**.",
    },
    // 7 — interactive_image: dicot embryo / seed
    {
      id: '0e69fc31-60ba-4c81-8d9f-e3d2aeea6c3f',
      type: 'interactive_image',
      order: 7,
      src: '',
      alt: 'Labelled diagram of a typical dicotyledonous embryo inside its seed, showing the embryonal axis, two cotyledons and the seed coat',
      caption: '📸 Tap each dot to explore the parts of a dicot embryo and its seed (NCERT Figs 1.13–1.14).',
      generation_prompt: "Scientific textbook illustration of a typical dicotyledonous embryo shown inside a longitudinal section of its seed. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. A tough outer seed coat (testa) drawn in brown/tan encloses the embryo. Two large, thick, swollen cotyledons in pale green fill the middle. Between the cotyledons runs a straight embryonal axis: at the top a small pointed shoot tip (plumule) sitting on a short epicotyl; below the cotyledon level a cylindrical hypocotyl leading down to a pointed root tip (radicle) covered by a small root cap. A small pore (micropyle) marked as a tiny gap in the seed coat near the radicle end. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: '75e42db3-e176-4b9f-a2f0-fcd1256c737d', x: 0.5, y: 0.16, label: 'Plumule', detail: 'The embryonic **shoot tip** — the future stem. It caps the upper end of the epicotyl.', icon: 'circle' },
        { id: '88dab34f-ebd6-42c8-983b-145c58ead674', x: 0.57, y: 0.34, label: 'Epicotyl', detail: 'The part of the embryonal axis **above the cotyledons**. It terminates in the plumule.', icon: 'circle' },
        { id: '40c1095a-a6ca-4564-b787-0b24e1793cd7', x: 0.34, y: 0.47, label: 'Cotyledons (two)', detail: "The dicot's **two seed leaves** — thick and swollen with stored food (very obvious in legumes).", icon: 'circle' },
        { id: '3786498e-8337-4381-9d7b-bff1e69a3fb2', x: 0.52, y: 0.63, label: 'Hypocotyl', detail: 'The cylindrical part of the axis **below the cotyledons**. It ends in the radicle.', icon: 'circle' },
        { id: '1c7df0c0-9a9e-4c7c-b96e-8a6a637082e8', x: 0.5, y: 0.83, label: 'Radicle', detail: 'The embryonic **root tip** — the future root. Its tip is covered by a **root cap**.', icon: 'circle' },
        { id: '7284ee67-54b3-4432-99dd-a3588f6ef3a8', x: 0.15, y: 0.5, label: 'Seed coat (testa)', detail: "The **integuments** of the ovule harden into this tough protective coat, shielding the young embryo.", icon: 'circle' },
        { id: '83289c20-c428-49c0-908c-919ac584e154', x: 0.33, y: 0.88, label: 'Micropyle', detail: 'A small pore left in the seed coat. It lets **oxygen and water** enter the seed during germination.', icon: 'circle' },
      ],
    },
    // 8 — comparison_card: dicot vs monocot embryo
    {
      id: 'adad53f1-df7a-471a-8185-3ef115fa38e0',
      type: 'comparison_card',
      order: 8,
      title: 'Dicot vs Monocot Embryo',
      columns: [
        {
          heading: 'Dicot embryo',
          points: [
            'Two cotyledons on the embryonal axis',
            'Epicotyl ends in the plumule (shoot tip)',
            'Hypocotyl ends in the radicle (root tip) with a root cap',
            'No coleoptile or coleorrhiza',
          ],
        },
        {
          heading: 'Monocot (grass) embryo',
          points: [
            'One cotyledon, called the scutellum, set to one side',
            'Shoot apex + young leaves enclosed in a hollow coleoptile',
            'Radicle + root cap enclosed in a sheath, the coleorrhiza',
            'Scutellum is lateral to the axis',
          ],
        },
      ],
    },
    // 9 — reasoning_prompt (after endosperm + embryo)
    {
      id: '443aabce-8ace-4730-a78c-df5d7f14923f',
      type: 'reasoning_prompt',
      order: 9,
      reasoning_type: 'logical',
      prompt: "Endosperm development starts and races ahead before the zygote even bothers to divide into an embryo. Most zygotes wait until a good amount of endosperm has already formed. What is the plant achieving by running things in this order?",
      options: [
        "The endosperm has to be triploid, and it can only become triploid if it divides before the diploid zygote does",
        "Building the food store first guarantees the embryo has ready nourishment the moment it begins to grow — assured nutrition",
        "The embryo physically cannot divide until the free nuclei of the endosperm have turned cellular",
        "The endosperm must be completely used up before the embryo is allowed to start forming",
      ],
      correct_index: 1,
      reveal: "The point is timing for nutrition. The endosperm is the embryo's food supply, so the plant packs the pantry first; NCERT calls the zygote's delayed division 'an adaptation to provide assured nutrition to the developing embryo.' The triploid claim is a distractor — ploidy is fixed at fertilisation, not by which tissue divides first. And the embryo does not wait for the endosperm to turn cellular or to be used up; in many seeds (pea, groundnut) the embryo eats the endosperm as it grows.",
      difficulty_level: 2,
    },
    // 10 — heading: seed
    {
      id: '4b7fbdad-b9d4-486e-bcc9-3b41161af805',
      type: 'heading',
      order: 10,
      level: 2,
      text: 'Seed — The Ripened Ovule',
      objective: "Trace which ovule part becomes which seed part, and tell an albuminous seed from a non-albuminous one.",
    },
    // 11 — text: seed
    {
      id: '49f44d86-eaa9-437f-aa3f-e26a105085b3',
      type: 'text',
      order: 11,
      markdown: "A **seed is a fertilised, ripened ovule** — the final product of sexual reproduction, and it forms inside the fruit. A typical seed has three things: a **seed coat**, one or more **cotyledons**, and the **embryo axis**. As the ovule matures, its **integuments harden into the tough seed coat** (the outer coat is the **testa**), and the old **micropyle stays on as a tiny pore** — the doorway through which oxygen and water enter the seed at germination.\n\nSeeds fall into two groups depending on whether the endosperm survives:\n- **Non-albuminous (ex-albuminous)** seeds keep **no endosperm** — the embryo ate all of it during development. Examples: **pea, groundnut**.\n- **Albuminous** seeds **retain part of the endosperm** into the mature seed. Examples: **wheat, maize, barley, castor**.\n\nA rare third structure: in seeds like **black pepper and beet**, a bit of the **nucellus** persists. This leftover nucellus is called the **perisperm**. As a seed matures it dries down to about **10–15% moisture**, its metabolism slows, and it may enter **dormancy** until conditions are right to germinate.",
    },
    // 12 — comparison_card: albuminous vs non-albuminous
    {
      id: '9f0d1f81-5d2f-4360-867e-9b626c40d314',
      type: 'comparison_card',
      order: 12,
      title: 'Albuminous vs Non-albuminous Seed',
      columns: [
        {
          heading: 'Albuminous (endospermic)',
          points: [
            'Retains part of the endosperm in the mature seed',
            'Endosperm not fully used up during embryo development',
            'Used up later, during germination',
            'Examples: wheat, maize, barley, castor',
          ],
        },
        {
          heading: 'Non-albuminous (ex-albuminous)',
          points: [
            'No residual endosperm in the mature seed',
            'Endosperm completely consumed during embryo development',
            'Food is stored instead in the swollen cotyledons',
            'Examples: pea, groundnut',
          ],
        },
      ],
    },
    // 13 — heading: fruit
    {
      id: 'f8d55b35-6d1b-40b4-ab5f-0c4711ee41ce',
      type: 'heading',
      order: 13,
      level: 2,
      text: 'Fruit — The Ripened Ovary',
      objective: "Separate a true fruit from a false one, and see how a fruit can form with no fertilisation at all.",
    },
    // 14 — text: fruit + bridge
    {
      id: '53f141dc-6008-4c51-b13f-2026dd5083c6',
      type: 'text',
      order: 14,
      markdown: "As the ovules turn into seeds, the whole **ovary turns into a fruit** — the two changes run together. The **wall of the ovary becomes the wall of the fruit**, called the **pericarp**, which may be **fleshy** (guava, orange, mango) or **dry** (groundnut, mustard). Usually the other floral parts wither and drop off once the fruit is set.\n\nBut not always. In **apple, strawberry and cashew**, the **thalamus** also swells and joins in — so these are called **false fruits**. When a fruit develops **only from the ovary**, it's a **true fruit**.\n\nOne more twist: a few plants form fruits **without any fertilisation** at all — **parthenocarpic fruits**, like **banana**. These are **seedless**, and parthenocarpy can be induced on purpose by applying growth hormones. That closes the flower's whole story — from a grain of pollen to a ripe fruit. Next we meet the exception that skips the story entirely: seeds made with no fertilisation, in **apomixis**.",
    },
    // 15 — remember: the mapping
    {
      id: '349e3f9e-cb78-4805-905c-39a3415b45f7',
      type: 'callout',
      order: 15,
      variant: 'remember',
      title: 'Old Part → New Part (Memorise This Map)',
      markdown: "- **Ovule → Seed**\n- **Ovary → Fruit**\n- **Integuments → Seed coat (outer = testa)**\n- **Ovary wall → Pericarp (fruit wall)**\n- **Zygote (2n) → Embryo**\n- **Primary endosperm cell (3n) → Endosperm**\n- **Nucellus remnant (rare) → Perisperm**\n\nThe endosperm is **triploid (3n)**; the embryo is **diploid (2n)**. Don't swap them.",
    },
    // 16 — exam_tip
    {
      id: '50f4ddce-99bb-4a47-b6ef-b915c1d66bc4',
      type: 'callout',
      order: 16,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Endosperm order:** NCERT states plainly that \"endosperm development precedes embryo development\" — a favourite one-liner. The delay in the zygote's division is \"an adaptation to provide assured nutrition to the developing embryo.\"\n\n**Coconut trap:** coconut **water = free-nuclear endosperm**; white **kernel = cellular endosperm**. Both are endosperm — don't call the water \"juice.\"\n\n**Albuminous vs non-albuminous:** wheat, maize, barley, castor **retain** endosperm (albuminous); pea and groundnut do **not** (non-albuminous). Castor is the classic albuminous example.\n\n**True vs false fruit:** false fruit = **thalamus** contributes → **apple, strawberry, cashew**. **Parthenocarpic** fruit = formed **without fertilisation** and **seedless** → **banana**.\n\n**Classic NEET question:** \"The perisperm is a remnant of which structure?\" → the **nucellus** (seen in black pepper and beet).",
    },
    // 17 — inline_quiz (last)
    {
      id: '1bc3e429-6ac8-4836-bb74-73dc8c2ad7c0',
      type: 'inline_quiz',
      order: 17,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'ff3fc228-dc6f-4b71-a4af-f79850558465',
          question: 'The water inside a tender coconut is best described as which stage of which tissue?',
          options: [
            'Cellular endosperm — cell walls have formed around each nucleus',
            'Cellular embryo tissue at the heart-shaped stage',
            'Free-nuclear endosperm — many nuclei with no cell walls yet',
            'Liquid perisperm derived from the nucellus',
          ],
          correct_index: 2,
          explanation: "Coconut water is free-nuclear endosperm — thousands of nuclei sharing a common space before any cell walls form. The white kernel that appears later is the cellular endosperm, so 'cellular endosperm' describes the kernel, not the water. It is endosperm, not embryo tissue, and it comes from the primary endosperm cell, not from the nucellus (which would make it perisperm).",
          difficulty_level: 1,
        },
        {
          id: '50900668-3947-451f-94c4-1d6c992ef2c9',
          question: 'In a typical dicot embryo, the cylindrical part of the embryonal axis below the level of the cotyledons, ending in the radicle, is the:',
          options: [
            'Hypocotyl',
            'Epicotyl',
            'Coleoptile',
            'Coleorrhiza',
          ],
          correct_index: 0,
          explanation: "Below the cotyledons is the hypocotyl, which terminates in the radicle (root tip). The epicotyl is the opposite end — above the cotyledons, ending in the plumule. Coleoptile and coleorrhiza are monocot-only sheaths (covering the shoot and the root respectively) and do not belong to a dicot embryo at all.",
          difficulty_level: 2,
        },
        {
          id: 'ed109982-60d9-4734-89e0-8ce9b93993bb',
          question: 'Which group of seeds retains part of its endosperm in the mature seed (albuminous seeds)?',
          options: [
            'Pea and groundnut',
            'Pea and bean',
            'Groundnut and pea',
            'Wheat, maize and castor',
          ],
          correct_index: 3,
          explanation: "Albuminous (endospermic) seeds keep some endosperm into maturity — wheat, maize, barley and castor. Pea, bean and groundnut are non-albuminous: their embryos consume the endosperm entirely during development and store food in the cotyledons instead, so every option built from pea/groundnut/bean is the opposite category.",
          difficulty_level: 2,
        },
        {
          id: 'f10ace5e-1b54-4031-8de6-4fdcb70ed5d5',
          question: 'The persistent remnant of the nucellus, seen in seeds such as black pepper and beet, is called the:',
          options: [
            'Pericarp',
            'Perisperm',
            'Endosperm',
            'Testa',
          ],
          correct_index: 1,
          explanation: "That leftover nucellus is the perisperm. The pericarp is the fruit wall (from the ovary wall), the endosperm is the triploid tissue from the primary endosperm cell, and the testa is the outer seed coat from the integuments — none of which come from the nucellus, which is the specific origin of the perisperm.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
