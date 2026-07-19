'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'androecium-and-gynoecium',
  title: 'Androecium, Gynoecium, and Placentation',
  subtitle: "The two whorls of a flower that actually make seeds — how a stamen is built, how carpels fuse or stay apart, and the five ways an ovary can arrange its ovules. This is one of NEET's most-tested diagrams.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['morphology-of-flowering-plants', 'flower', 'androecium', 'gynoecium', 'placentation'],
  glossary: [
    { term: 'stamen', definition: "The male reproductive organ of a flower, made up of a filament and an anther." },
    { term: 'filament', definition: "The stalk of a stamen." },
    { term: 'anther', definition: "The part of a stamen that produces pollen grains; usually bilobed, with two pollen-sacs per lobe." },
    { term: 'pollen-sac', definition: "A chamber inside an anther lobe where pollen grains are produced. Each anther lobe has two." },
    { term: 'staminode', definition: "A sterile stamen — one that does not produce pollen." },
    { term: 'epipetalous', definition: "Stamens attached to the petals, as in brinjal." },
    { term: 'epiphyllous', definition: "Stamens attached to the perianth, as in lily." },
    { term: 'polyandrous', definition: "A condition where the stamens of a flower remain free from one another, not united into bundles." },
    { term: 'monoadelphous', definition: "Stamens united into one bunch or bundle, as in china rose." },
    { term: 'diadelphous', definition: "Stamens united into two bundles, as in pea." },
    { term: 'polyadelphous', definition: "Stamens united into more than two bundles, as in citrus." },
    { term: 'carpel', definition: "A unit of the gynoecium, made up of stigma, style, and ovary." },
    { term: 'ovary', definition: "The enlarged basal part of a carpel, bearing one or more ovules on a placenta." },
    { term: 'style', definition: "The elongated tube on top of the ovary that connects it to the stigma." },
    { term: 'stigma', definition: "Usually found at the tip of the style; the receptive surface for pollen grains." },
    { term: 'placenta', definition: "The flattened, cushion-like tissue inside an ovary to which ovules are attached." },
    { term: 'apocarpous', definition: "A gynoecium with more than one carpel, all of them free from one another, as in lotus and rose." },
    { term: 'syncarpous', definition: "A gynoecium with more than one carpel, fused together, as in mustard and tomato." },
    { term: 'placentation', definition: "The arrangement of ovules within an ovary." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark botanical cutaway of the centre of a flower showing a ring of stamens surrounding a central pistil with its ovary, style, and stigma',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A close, painterly botanical illustration of the very centre of an open flower at dusk: a ring of slender stamens, each a thin filament topped with a soft, pollen-dusted anther, arranged around a single central pistil rising taller in the middle — its swollen ovary at the base, a slender style reaching up, and a receptive stigma at the top catching the last warm light. Soft dusk lighting, one warm glow at the very centre of the flower, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no labels, no text, no diagram elements, no photorealism.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Flower, Two Jobs, Endless Variety',
      markdown: "Every flower that goes on to make a fruit is running two separate production lines at once — a pollen factory (the stamens) and a seed factory (the carpels) — sitting right next to each other in the same structure. But NCERT's whole point in this section is that these two parts are never built the same way twice: a citrus flower fuses its stamens into more than two bundles, a lotus keeps every carpel completely separate, and a mustard ovary hides a false wall that isn't even a real chamber. Learn the vocabulary here and a floral diagram stops being a puzzle.",
    },
    // ── 2 · Core concept — the two innermost whorls ───────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A flower's outer two whorls — calyx and corolla — just protect and attract. The inner two whorls are where reproduction actually happens: the **androecium**, the male part, made of stamens; and the **gynoecium**, the female part, made of carpels. Both whorls are described using very specific NCERT vocabulary about how their units attach, fuse, and hold their contents — and that vocabulary is exactly what NEET tests.",
    },
    // ── 3 · Heading — Androecium: structure of a stamen ───────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Androecium: The Stamens',
      objective: 'By the end of this you can name every part of a stamen and explain where pollen grains are actually produced.',
    },
    // ── 4 · Text — stamen structure ────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **androecium is composed of stamens**. Each stamen is the **male reproductive organ** of the flower, and it has two parts: a **stalk called the filament**, and an **anther** sitting at the top of it.\n\nAn anther is **usually bilobed** — built from two lobes. Each lobe carries **two chambers**, called **pollen-sacs**. This is the actual production site: **pollen grains are produced in the pollen-sacs**. So one typical anther has four pollen-sacs in total, two per lobe.\n\nNot every stamen makes pollen. A stamen that is **sterile** — one that produces no pollen at all — is called a **staminode**.",
    },
    // ── 5 · Text — attachment and fusion ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Stamens don't always sit on their own. They can be **united with other members of the flower** — attached to the petals or to the perianth — or **united among themselves**.\n\nWhen stamens are **attached to the petals**, they are called **epipetalous**, as in **brinjal**. When they are **attached to the perianth** instead, they are called **epiphyllous**, as in the flowers of **lily**.\n\nAmong themselves, stamens may stay completely **free** — this is called **polyandrous**. Or they may be **united in varying degrees**: into **one bunch or bundle**, called **monoadelphous**, as in **china rose**; into **two bundles**, called **diadelphous**, as in **pea**; or into **more than two bundles**, called **polyadelphous**, as in **citrus**.\n\nOne more detail NCERT flags: filament length isn't always uniform. Within a single flower, filaments can **vary in length**, as seen in **Salvia and mustard**.",
    },
    // ── 6 · Comparison card — stamen fusion terms ─────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'How Stamens Fuse: Four Terms, Four Examples',
      columns: [
        {
          heading: 'Polyandrous',
          points: [
            'Stamens remain completely free from one another',
            'No fusion into bundles at all',
          ],
        },
        {
          heading: 'Monoadelphous',
          points: [
            'Stamens united into one single bunch or bundle',
            'Example: china rose',
          ],
        },
        {
          heading: 'Diadelphous',
          points: [
            'Stamens united into two bundles',
            'Example: pea',
          ],
        },
        {
          heading: 'Polyadelphous',
          points: [
            'Stamens united into more than two bundles',
            'Example: citrus',
          ],
        },
      ],
    },
    // ── 7 · Reasoning prompt (mid-page) ────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A lily flower has its stamens attached to the tepals of its perianth, not to separate petals. A student labels this 'epipetalous' because tepals look petal-like. Is the student's label correct?",
      options: [
        "No — since the stamens are attached to the perianth rather than to petals specifically, this is epiphyllous, exactly the term NCERT uses for lily",
        "Yes — 'epipetalous' covers any petal-like structure, including tepals, so the label is correct for lily",
        "No — the flower should instead be called monoadelphous, since any attachment to a floral whorl counts as fusion into one bundle",
        "Yes — brinjal and lily both show epipetalous stamens, since both have stamens fused to a floral whorl",
      ],
      reveal: "The student's label is wrong. NCERT draws the line by exactly what the stamens are attached to: epipetalous means attached to petals, and its named example is brinjal — not lily. When stamens are attached to the perianth, the correct term is epiphyllous, and lily is NCERT's own example for it. Calling this monoadelphous is a different error altogether — monoadelphous is about stamens fusing among themselves into one bundle, not about attachment to another whorl. And lily is never given as an epipetalous example; brinjal and lily illustrate the two different terms, not the same one.",
      difficulty_level: 2,
    },
    // ── 8 · Heading — Gynoecium: structure of a carpel ─────────────────────
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Gynoecium: The Carpels',
      objective: 'By the end of this you can name the three parts of a carpel and tell apocarpous and syncarpous gynoecia apart.',
    },
    // ── 9 · Text — carpel parts + apocarpous/syncarpous ─────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "The **gynoecium is the female reproductive part** of the flower, and it is made up of **one or more carpels**. A single carpel has **three parts**: **stigma, style, and ovary**.\n\nThe **ovary is the enlarged basal part**. Sitting on top of it is an **elongated tube, the style**, which **connects the ovary to the stigma**. The **stigma is usually at the tip of the style**, and it is the **receptive surface for pollen grains** — the landing site pollen has to reach.\n\nInside, each **ovary bears one or more ovules**, and these are **attached to a flattened, cushion-like placenta**.\n\nWhen a flower has **more than one carpel**, they can relate to each other in two ways. If the carpels stay **free** from one another, the gynoecium is **apocarpous**, as in **lotus and rose**. If the carpels are **fused together**, it is **syncarpous**, as in **mustard and tomato**.\n\nAfter fertilisation, this is what the whole reproductive job was for: the **ovules develop into seeds**, and the **ovary matures into a fruit**.",
    },
    // ── 10 · Heading — Placentation ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Placentation: Where the Ovules Sit',
      objective: 'By the end of this you can name all five types of placentation, describe the ovule arrangement in each, and match each type to its NCERT example.',
    },
    // ── 11 · Text — placentation intro ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "The **arrangement of ovules within the ovary is called placentation**, and NCERT names **five types**: **marginal, axile, parietal, free central, and basal**.\n\nIn **marginal placentation**, the **placenta forms a ridge along the ventral suture** of the ovary, and the **ovules are borne on this ridge in two rows**, as in **pea**.\n\nIn **axile placentation**, the **placenta is axial** and the **ovules are attached to it inside a multilocular ovary** — one with several chambers — as in **china rose, tomato, and lemon**.\n\nIn **parietal placentation**, the **ovules develop on the inner wall of the ovary**, on its peripheral part. The **ovary is one-chambered**, but it **becomes two-chambered** because a **false septum** forms inside it — as in **mustard and Argemone**.\n\nIn **free central placentation**, the **ovules are borne on a central axis**, and **septa are absent**, as in **Dianthus and Primrose**.\n\nIn **basal placentation**, the **placenta develops at the base of the ovary**, and a **single ovule is attached to it**, as in **sunflower and marigold**.",
    },
    // ── 12 · Interactive image — five placentation types ────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 12, src: '',
      alt: 'Five separate ovary cross-sections arranged in a row, each showing a different placentation type — marginal, axile, parietal, free central, and basal',
      caption: '📸 Tap each ovary cross-section to see its placentation type',
      generation_prompt: "Scientific textbook illustration showing five separate ovary cross-sections arranged in a horizontal row on a dark background (#0a0a0a near-black), each a simplified oval or rounded outline representing an ovary sliced open, illustrating five distinct placentation patterns side by side: first, an oval ovary with a ridge of small round ovules running along one edge (the ventral suture) in two rows; second, a multi-chambered oval ovary divided into several wedge-like compartments by internal walls, with a central axial column bearing ovules reaching into each chamber; third, a single rounded ovary with ovules studded along the inner wall near the periphery, with one thin false partition visible inside; fourth, a rounded ovary with no internal walls at all, ovules attached directly to a free-standing central column; fifth, a small rounded ovary with just one single ovule attached at its very base. Clean white outlines, flat 2D educational diagram style, biologically accurate proportions, green tint for the ovule clusters, thin white leader lines from each cross-section to a label position below it (labels added separately by the app, do not render text in the image), no photorealism, no cartoon style, no mascots, matches standard biology textbook diagram conventions.",
      hotspots: [
        { id: uuid(), x: 0.10, y: 0.5, label: 'Marginal Placentation', detail: 'The **placenta forms a ridge along the ventral suture** of the ovary, and the **ovules are borne on this ridge, forming two rows**. Example: **pea**.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.5, label: 'Axile Placentation', detail: 'The **placenta is axial**, and the **ovules are attached to it in a multilocular ovary** (one with several chambers). Examples: **china rose, tomato, lemon**.', icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.5, label: 'Parietal Placentation', detail: 'The **ovules develop on the inner wall of the ovary**, on its peripheral part. The ovary is **one-chambered**, but becomes **two-chambered** due to a **false septum**. Examples: **mustard, Argemone**.', icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.5, label: 'Free Central Placentation', detail: 'The **ovules are borne on a central axis**, and **septa are absent**. Examples: **Dianthus, Primrose**.', icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.5, label: 'Basal Placentation', detail: 'The **placenta develops at the base of the ovary**, and a **single ovule is attached to it**. Examples: **sunflower, marigold**.', icon: 'circle' },
      ],
    },
    // ── 13 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Stamen** = filament (stalk) + anther. Anther usually bilobed, each lobe has 2 pollen-sacs, where pollen is made. Sterile stamen = **staminode**.\n- **Epipetalous** = attached to petals (brinjal). **Epiphyllous** = attached to perianth (lily).\n- **Polyandrous** = free stamens. **Monoadelphous** = 1 bundle (china rose). **Diadelphous** = 2 bundles (pea). **Polyadelphous** = >2 bundles (citrus).\n- **Carpel** = stigma + style + ovary. Ovary = basal, bears ovules on the placenta. Style connects ovary to stigma. Stigma = receptive surface for pollen.\n- **Apocarpous** = carpels free (lotus, rose). **Syncarpous** = carpels fused (mustard, tomato).\n- **Five placentation types:** marginal (pea), axile (china rose, tomato, lemon), parietal (mustard, Argemone), free central (Dianthus, Primrose), basal (sunflower, marigold).",
    },
    // ── 14 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Apocarpous vs syncarpous is a one-liner NEET loves:** lotus and rose keep their carpels free — **apocarpous**. Mustard and tomato fuse theirs — **syncarpous**. If a question names the plant and asks for the term, this pair of examples is usually all you need.\n\n**A clean way to hold all five placentation types together — go by what's genuinely different about each one:** marginal has ovules in **two rows on a ridge** (pea); axile has ovules inside a **multi-chambered** ovary (china rose, tomato, lemon); parietal has ovules on the **wall**, with a **false septum** splitting a one-chambered ovary into two (mustard, Argemone); free central has ovules on a **bare central axis with no septa** (Dianthus, Primrose); basal has just **one ovule at the base** (sunflower, marigold). NEET usually gives you the plant name and asks for the type — so drill the examples, not just the definitions.\n\n**Classic NEET question:** \"In which type of placentation does the ovary become two-chambered due to a false septum?\" → **parietal placentation**, as in mustard.",
    },
    // ── 15 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You now have every part of the androecium and gynoecium down — stamen structure, how stamens attach and fuse, carpel structure, and all five placentation types. After fertilisation, this whole apparatus has one job left: the ovary turning into a fruit, which is exactly where the next page picks up.",
    },
    // ── 16 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Each lobe of a bilobed anther has how many pollen-sacs, and what is produced inside them?",
          options: [
            'One pollen-sac per lobe, producing the filament',
            'Two pollen-sacs per lobe, producing pollen grains',
            'Two pollen-sacs per lobe, producing ovules',
            'Four pollen-sacs per lobe, producing pollen grains',
          ],
          correct_index: 1,
          explanation: "NCERT states each anther lobe has two chambers, the pollen-sacs, and that pollen grains are produced in the pollen-sacs. The filament is the stamen's stalk, not something produced inside an anther lobe. Ovules are produced inside the ovary of a carpel, not an anther — that is the gynoecium's structure, not the androecium's. And four pollen-sacs is the total for a whole bilobed anther (two lobes × two each), not the count per single lobe.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A pea flower has its stamens united into two separate bundles. What is this condition called?",
          options: [
            'Monoadelphous',
            'Polyandrous',
            'Diadelphous',
            'Polyadelphous',
          ],
          correct_index: 2,
          explanation: "NCERT names stamens united into two bundles as diadelphous, with pea as the example. Monoadelphous is one bundle (china rose); polyandrous means the stamens stay free, not united at all; polyadelphous is more than two bundles (citrus) — pea's two-bundle pattern doesn't match any of these three.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A lotus flower has several carpels, all of them completely separate from one another. What is this gynoecium called, and what is the term for carpels that fuse together instead?",
          options: [
            'Syncarpous when free; apocarpous when fused',
            'Apocarpous when free; syncarpous when fused, as in mustard and tomato',
            'Monoadelphous when free; diadelphous when fused',
            'Apocarpous when free; polyadelphous when fused',
          ],
          correct_index: 1,
          explanation: "NCERT is explicit: carpels that stay free, as in lotus and rose, make the gynoecium apocarpous; carpels that are fused, as in mustard and tomato, make it syncarpous. Monoadelphous, diadelphous, and polyadelphous are all terms for how stamens fuse in the androecium, not how carpels relate to each other in the gynoecium — they don't apply here at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A sunflower ovary has a placenta at its very base, with just a single ovule attached there. Which placentation type is this?",
          options: [
            'Free central placentation',
            'Parietal placentation',
            'Basal placentation',
            'Marginal placentation',
          ],
          correct_index: 2,
          explanation: "NCERT describes basal placentation as the placenta developing at the base of the ovary with a single ovule attached to it, naming sunflower and marigold as examples — an exact match. Free central placentation has ovules on a central axis with no septa (Dianthus, Primrose), not a single basal ovule. Parietal placentation has ovules on the ovary wall in a one-chambered ovary with a false septum (mustard, Argemone). Marginal placentation has ovules in two rows along a ridge on the ventral suture (pea) — neither matches a single ovule at the base.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
