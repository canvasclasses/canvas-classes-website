'use strict';
/**
 * Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
 * Page 8 — Double Fertilisation.
 *
 * Source of truth: NCERT Class 12 Ch.1 (lebo101.txt) §1.3 "Double Fertilisation"
 * (lines 761–773) plus the embryo-sac layout in §1.2.2 (lines 400–411) and the
 * pollen-tube entry described in §1.2.3 (lines 718–722). Rule 0: every fact,
 * name, ploidy figure and sequence here traces to that text; nothing invented.
 * NCERT Figures 1.12 (d,e) and 1.13 (a).
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'double-fertilisation',
  title: 'Double Fertilisation — Two Fusions, One Event',
  subtitle: "Inside one tiny embryo sac, two male gametes do two different jobs at once — one builds the baby plant, the other builds its food. This is the event that belongs to flowering plants alone.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['double-fertilisation', 'syngamy', 'triple-fusion', 'sexual-reproduction-in-flowering-plants'],
  glossary: [
    { term: 'double fertilisation', definition: 'The event, unique to flowering plants, where two fusions — syngamy and triple fusion — happen inside a single embryo sac.' },
    { term: 'syngamy', definition: 'The fusion of one male gamete with the egg cell, producing the diploid (2n) zygote.' },
    { term: 'triple fusion', definition: 'The fusion of the second male gamete with the two polar nuclei of the central cell, producing the triploid (3n) primary endosperm nucleus.' },
    { term: 'primary endosperm nucleus (PEN)', definition: 'The triploid (3n) nucleus formed by triple fusion; the central cell that holds it becomes the primary endosperm cell and develops into the endosperm.' },
    { term: 'primary endosperm cell (PEC)', definition: 'The central cell after triple fusion — it carries the triploid PEN and later develops into the endosperm, the food store of the seed.' },
    { term: 'porogamy', definition: "The usual route of pollen-tube entry into the ovule — through the micropyle. NCERT states the pollen tube enters the ovule via the micropyle." },
  ],
  blocks: [
    {
      id: '5bbcde98-7798-43c6-89a5-874caf1e76ed',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dusk close-up of a single flower with a glowing ovule at its base, warm light gathering at one point',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An extreme close-up of a single flower at dusk, the petals falling away out of focus, the focal point being the swollen base of the pistil where a single ovule glows softly from within with a warm amber light, as if two tiny sparks of life are being lit inside it at once. Everything else is deep dusk shadow; only that one point of warm light draws the eye, suggesting a quiet, hidden event happening inside the flower. Painterly and atmospheric, dark background tones throughout (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: 'be508397-7612-4cc6-a9d5-cab4ced84b05',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'A Trick No Other Plant Can Do',
      markdown: "Ferns fertilise. Mosses fertilise. Pine trees fertilise. But not one of them does what a flowering plant does — send **two** male gametes into a single embryo sac and put **both** of them to work at the same time. One fuses with the egg to start a new plant. The other fuses with two nuclei to build that plant's food supply. Two fusions, one event — and it happens **only** in flowering plants. That is why every angiosperm's pollen tube has to carry not one, but **two** male gametes.",
    },
    {
      id: '21dc73be-8477-401a-9a0f-4140db2fce33',
      type: 'text',
      order: 2,
      markdown: "By the time the pollen tube reaches the ovule, everything is already in position. The tube enters the ovule through the **micropyle** — the entry route botanists call **porogamy** — and then pushes into **one of the two synergids**, guided there by the synergid's filiform apparatus. Inside that synergid, the pollen tube does the one thing it was built to do: it bursts open and **releases its two male gametes** into the cytoplasm.\n\nNow watch where those two gametes go. They do not do the same job. They split up and head for two different targets sitting inside the same embryo sac — and that split is the whole story of this page.",
    },
    {
      id: '570e92b0-2233-48d0-848d-f62ab8140636',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'Two Gametes, Two Fusions — Syngamy and Triple Fusion',
      objective: "By the end of this you'll be able to say exactly which fusion makes the 2n zygote and which makes the 3n endosperm nucleus — without ever swapping them.",
    },
    {
      id: 'fbdf6150-a0a9-415b-8665-639180dc0311',
      type: 'text',
      order: 4,
      markdown: "**Fusion one — syngamy.** One male gamete moves towards the **egg cell** and fuses with its nucleus. This is **syngamy**, the fertilisation you'd expect from any organism: sperm meets egg. The result is a single **diploid cell — the zygote (2n)**. One haploid male gamete (n) plus one haploid egg (n) gives 2n. This zygote is the future **embryo**.\n\n**Fusion two — triple fusion.** The *other* male gamete does something no animal sperm ever does. It moves towards the **two polar nuclei** sitting in the large **central cell** and fuses with **both** of them at once. Because this fuses **three haploid nuclei together** — one male gamete plus two polar nuclei (n + n + n) — it is called **triple fusion**, and it produces a **triploid primary endosperm nucleus, the PEN (3n)**.\n\nSo inside one embryo sac, two fusions take place: syngamy and triple fusion. That is why the whole event is named **double fertilisation** — and it is found **only in flowering plants**. After triple fusion, the central cell becomes the **primary endosperm cell (PEC)**, which goes on to form the **endosperm** (the seed's food store), while the zygote develops into the **embryo**."
    },
    {
      id: '4c6ae253-75da-414d-a66e-65735a6d6afd',
      type: 'interactive_image',
      order: 5,
      src: '',
      alt: 'Double fertilisation inside the embryo sac: pollen tube entering a synergid and discharging two male gametes, one to the egg and one to the polar nuclei',
      caption: '📸 Tap each dot to follow both male gametes to their targets — and read off the ploidy',
      generation_prompt: "Scientific textbook illustration of double fertilisation inside an angiosperm embryo sac. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A large oval embryo sac oriented vertically, purple/violet nucleic-acid tones for the nuclei, pink/magenta for the soft-tissue cell outlines, clean white outlines throughout. At the lower (micropylar) end: a pollen tube (drawn as a pale tube) enters from the bottom through a small opening (the micropyle) and pushes into one of two synergid cells, its tip burst open. Two small round male gametes are shown discharged from the pollen tube tip. A thin white arrow shows one male gamete moving to the single egg cell (labelled region, lower centre) and merging with it. A second thin white arrow shows the other male gamete moving up to two small round polar nuclei that sit close together in the large central cell (middle of the sac). Three antipodal cells sit at the top (chalazal) end. No text or numeric labels baked into the image itself. Biologically accurate proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: [
        {
          id: 'eea03f2f-5555-42cb-a8a5-b6bdb31ae931',
          x: 0.32,
          y: 0.90,
          label: 'Pollen tube',
          detail: 'Enters the ovule through the **micropyle** (porogamy) and pushes into one of the two synergids. It carries the **two male gametes** the whole way here.',
          icon: 'circle',
        },
        {
          id: '5111b214-c4ae-49a2-9f7f-ce4c234440bb',
          x: 0.42,
          y: 0.74,
          label: 'Synergid (entry point)',
          detail: "The pollen tube enters **one** of the two synergids, guided by its filiform apparatus, and **bursts open here**, releasing both male gametes into the synergid's cytoplasm.",
          icon: 'circle',
        },
        {
          id: 'fd3780f3-4692-4051-8e94-86a714859adb',
          x: 0.34,
          y: 0.62,
          label: 'Male gamete 1 + egg → syngamy',
          detail: 'One male gamete fuses with the **egg cell**. This is **syngamy** — the classic sperm-meets-egg fusion. Two haploid nuclei (n + n) join.',
          icon: 'circle',
        },
        {
          id: '3cf41e49-e9d1-4d28-a274-3b63285c7cb8',
          x: 0.58,
          y: 0.66,
          label: 'Zygote (2n)',
          detail: 'The product of syngamy: a **diploid** cell, **2n**. This zygote develops into the **embryo** — the future new plant.',
          icon: 'circle',
        },
        {
          id: '7e34e2fd-971d-4270-b8ad-c5baf970de3a',
          x: 0.50,
          y: 0.46,
          label: 'Male gamete 2 + polar nuclei → triple fusion',
          detail: 'The second male gamete fuses with the **two polar nuclei** in the central cell. Because **three** haploid nuclei fuse (n + n + n), this is called **triple fusion**.',
          icon: 'circle',
        },
        {
          id: '5949e426-b59f-4b7e-a59b-fffddd5e31b0',
          x: 0.66,
          y: 0.38,
          label: 'Primary endosperm nucleus (3n)',
          detail: 'The product of triple fusion: a **triploid** primary endosperm nucleus, the **PEN (3n)**. The central cell becomes the **primary endosperm cell** and forms the **endosperm** — the food store for the growing embryo.',
          icon: 'circle',
        },
      ],
    },
    {
      id: 'fa8ff78d-ccd9-4d73-9b7c-9e290fed203d',
      type: 'reasoning_prompt',
      order: 6,
      reasoning_type: 'logical',
      prompt: 'The zygote and the primary endosperm nucleus both form inside the same embryo sac, at almost the same moment, from gametes carried by the same pollen tube. Yet the zygote is 2n and the PEN is 3n. What single fact explains why their ploidy is different?',
      options: [
        'The zygote forms from a diploid egg, while the PEN forms from a haploid male gamete',
        'The egg fuses with one male gamete (n + n = 2n), but the PEN forms by fusing three haploid nuclei — one male gamete and two polar nuclei (n + n + n = 3n)',
        'The pollen tube carries one diploid gamete for the egg and one triploid gamete for the polar nuclei',
        'The PEN doubles its chromosomes after fusion, while the zygote does not',
      ],
      reveal: "It comes down to how many haploid nuclei fuse. Syngamy joins just two — one male gamete (n) and the egg (n) — so the zygote is 2n. Triple fusion joins three — one male gamete (n) and the two polar nuclei (n + n) — so the PEN is 3n. Every nucleus involved is haploid to begin with; the egg is not diploid, and neither male gamete is triploid. Nothing 'doubles' afterwards — the difference is purely two nuclei fusing versus three.",
      difficulty_level: 2,
    },
    {
      id: '347fb5f8-4895-4e58-941d-8376ce1a1524',
      type: 'callout',
      order: 7,
      variant: 'remember',
      title: 'Never Swap These Two',
      markdown: "- **Syngamy** = male gamete **+ egg** → **zygote**, which is **diploid (2n)** → becomes the **embryo**.\n- **Triple fusion** = male gamete **+ two polar nuclei** → **primary endosperm nucleus (PEN)**, which is **triploid (3n)** → becomes the **endosperm**.\n- **Two fusions in one embryo sac = double fertilisation** — and it is **unique to flowering plants (angiosperms)**.\n- This is exactly why an angiosperm needs **two male gametes**, not one: one for syngamy, one for triple fusion.",
    },
    {
      id: '21f3c35e-c556-45af-b66d-fc0fb0464d57',
      type: 'callout',
      order: 8,
      variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Zygote is 2n, endosperm is 3n:** This is the single most tested ploidy fact from the chapter. The endosperm being **triploid** is the classic trap — students who write 2n for the endosperm lose the mark every time.\n\n**Triple fusion counts nuclei, not gametes:** NCERT is explicit — triple fusion involves the fusion of **three haploid nuclei** (one male gamete + two polar nuclei). That is where the 3n comes from.\n\n**Double fertilisation = the two fusions, not two sperms entering two eggs:** the name refers to **syngamy + triple fusion** happening in one embryo sac, an event **unique to flowering plants**. After triple fusion the central cell becomes the **primary endosperm cell (PEC)**.\n\n**Classic NEET question:** \"Triple fusion involves the fusion of a male gamete with ___?\" → the **two polar nuclei** of the central cell (giving the triploid PEN)."
    },
    {
      id: '174b1f40-4353-4399-860f-19ebf3a59f25',
      type: 'text',
      order: 9,
      markdown: "So the flower now holds two brand-new products in one sac: a **2n zygote** that will become the embryo, and a **3n primary endosperm cell** that will become its food. What happens to each of them next — how the endosperm forms first, and how the zygote grows into a tiny plant inside the seed — is the story of the post-fertilisation events on the next page.",
    },
    {
      id: '579442e3-3a0d-4fbf-9201-959f976efbe5',
      type: 'inline_quiz',
      order: 10,
      pass_threshold: 0.67,
      questions: [
        {
          id: '3a0a69b0-699a-4b11-b13c-7a7c0e246fe5',
          question: 'What is the ploidy of the primary endosperm nucleus (PEN) formed during double fertilisation?',
          options: ['Diploid (2n)', 'Haploid (n)', 'Triploid (3n)', 'Tetraploid (4n)'],
          correct_index: 2,
          explanation: "The PEN is triploid (3n) because triple fusion joins three haploid nuclei — one male gamete plus two polar nuclei (n + n + n). 2n is the zygote's ploidy, not the PEN's — that is the exact swap NEET tests. Haploid and tetraploid don't fit any nucleus in this event.",
          difficulty_level: 1,
        },
        {
          id: '8231353b-81b7-4145-a2a1-699a1e7f2d9d',
          question: 'Triple fusion takes place between one male gamete and which structure of the embryo sac?',
          options: [
            'The egg cell',
            'The two synergids',
            'The three antipodal cells',
            'The two polar nuclei in the central cell',
          ],
          correct_index: 3,
          explanation: "Triple fusion is the second male gamete fusing with the two polar nuclei in the central cell, giving the 3n PEN. Fusing with the egg cell is syngamy (that produces the zygote, not the PEN) — the tempting wrong choice. The synergids only guide and receive the pollen tube, and the antipodals take no part in either fusion.",
          difficulty_level: 2,
        },
        {
          id: '256badf8-08f1-4fd2-b6d1-3572d22b31a9',
          question: 'Double fertilisation is described as an event unique to flowering plants. Which pair of processes does the term "double" actually refer to?',
          options: [
            'Two male gametes each fertilising a separate egg cell',
            'Syngamy and triple fusion, both occurring in the same embryo sac',
            'Pollination followed by fertilisation',
            'Fertilisation of the egg followed by fertilisation of a synergid',
          ],
          correct_index: 1,
          explanation: "Double fertilisation means two fusions — syngamy and triple fusion — happening inside one embryo sac. There is only one egg, so it is not two eggs being fertilised, and no synergid gets fertilised. Pollination-then-fertilisation is a different sequence entirely, not what 'double' names here.",
          difficulty_level: 2,
        },
        {
          id: 'eba9c36e-1937-4460-9c3b-40c09716d297',
          question: 'After triple fusion, what does the central cell become, and what does it go on to form?',
          options: [
            'The primary endosperm cell (PEC), which develops into the endosperm',
            'The zygote, which develops into the embryo',
            'A second synergid, which guides the next pollen tube',
            'The seed coat, which protects the developing embryo',
          ],
          correct_index: 0,
          explanation: "Once triple fusion is done, the central cell (now carrying the 3n PEN) becomes the primary endosperm cell and develops into the endosperm, the embryo's food store. The zygote is the product of syngamy — a separate cell that becomes the embryo, not the central cell. Synergids and the seed coat form by entirely different routes.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
