'use strict';
/**
 * Class 11 Biology — Chapter 3 (Plant Kingdom)
 * Page 7 — "Gymnosperms: The Naked-Seeded Plants"
 *
 * Faithful to the 2023-rationalised NCERT text (kebo103.pdf §3.4, "Gymnosperms").
 * Rule 0: every fact traces to the supplied NCERT text — no outside additions.
 *
 * Exports a single page object. Does NOT touch the database — the orchestrator
 * validates and inserts.
 */
const { v4: uuid } = require('uuid');

const gymnoHotspots = [
  {
    id: uuid(), x: 0.30, y: 0.20, label: 'Male cone (microsporangiate)', icon: 'circle',
    detail: 'A male strobilus — a compact cone of **microsporophylls** bearing **microsporangia**. Inside these, microspores form and develop into pollen grains.',
  },
  {
    id: uuid(), x: 0.70, y: 0.16, label: 'Female cone (megasporangiate)', icon: 'circle',
    detail: 'A female strobilus — a cone of **megasporophylls** that carry the ovules (megasporangia). The ovules sit exposed on the scales, never sealed inside an ovary.',
  },
  {
    id: uuid(), x: 0.78, y: 0.30, label: 'Ovule (naked, on megasporophyll)', icon: 'circle',
    detail: "The **ovule** = the nucellus wrapped in protective envelopes. It stays **exposed** on the megasporophyll both before and after fertilisation — this is the whole reason these plants are called 'naked-seeded'.",
  },
  {
    id: uuid(), x: 0.24, y: 0.34, label: 'Pollen grain (reduced male gametophyte)', icon: 'circle',
    detail: 'A pollen grain is the **highly reduced male gametophyte**, cut down to just a few cells. It develops inside the microsporangium, then rides air currents to the ovule.',
  },
  {
    id: uuid(), x: 0.50, y: 0.52, label: 'Needle-like leaf (xerophytic)', icon: 'circle',
    detail: 'In conifers the **needle-like leaves** reduce surface area, and a **thick cuticle + sunken stomata** cut water loss — built to survive extremes of temperature, humidity and wind.',
  },
  {
    id: uuid(), x: 0.46, y: 0.86, label: 'Coralloid / mycorrhizal root', icon: 'circle',
    detail: 'Roots are generally tap roots. *Pinus* roots host a fungus (**mycorrhiza**); *Cycas* grows small specialised **coralloid roots** that house **N₂-fixing cyanobacteria**.',
  },
];

const blocks = [
  {
    id: uuid(), type: 'image', order: 0, src: '',
    alt: 'A misty conifer forest at dusk, tall spire-shaped evergreen trees rising toward a glowing peak',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dense forest of tall, spire-shaped evergreen conifer trees at dusk, seen from a low angle so the trees tower upward and taper toward a misty, glowing sky near the top of the frame. One giant redwood stands noticeably taller than the rest, its crown lost in soft amber light breaking through cloud. Bare needle-covered branches and cones are faintly suggested in silhouette; a cool blue mist pools between the dark trunks at ground level. No people, no text, no labels, no diagram elements. Deep dusk lighting, atmospheric painterly illustration style, dark background tones throughout (#0a0a0a base).",
  },
  {
    id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Tallest Trees Alive Carry Naked Seeds',
    markdown: "The giant redwood **_Sequoia_** — one of the tallest tree species on Earth — is a gymnosperm. So is the pine outside on a cold hillside, and the *Cycas* that looks like a stubby palm. Despite their size, the seeds these giants make sit **out in the open**, uncovered, resting on the scales of a cone. No fruit, no shell, no ovary wrapped around them. That single fact — naked, exposed seeds — is what puts every one of these plants into the same group.",
  },
  {
    id: uuid(), type: 'text', order: 2,
    markdown: "The name says exactly what it means: **gymnos** = naked, **sperma** = seeds. **Gymnosperms** are plants in which the **ovules are not enclosed by any ovary wall** — they stay **exposed, both before and after fertilisation** — so the seeds that form afterwards are **naked**, not covered by anything.\n\nMost gymnosperms are **medium-sized to tall trees and shrubs**. The giant redwood *Sequoia* is one of the tallest tree species alive. Their **roots are generally tap roots**, and two of them do something clever underground: in *Pinus*, the roots partner with a fungus in the form of **mycorrhiza**, and in *Cycas*, small specialised **coralloid roots** house **nitrogen-fixing cyanobacteria** that pull usable nitrogen from the air. Stems are **unbranched in _Cycas_** but **branched in _Pinus_ and _Cedrus_**.\n\nThe leaves are built to survive hardship. They may be simple or compound — *Cycas* has **pinnate leaves that persist for years** — and they're **well-adapted to withstand extremes of temperature, humidity and wind**. In conifers the **needle-like leaves reduce the surface area**, and a **thick cuticle plus sunken stomata** cut down water loss. That's a plant dressed for cold, dry, windy mountains.",
  },
  {
    id: uuid(), type: 'heading', order: 3, level: 2,
    text: 'Cones, Pollen & Naked Seeds',
    objective: "By the end of this you'll trace a pollen grain from a male cone all the way to a naked seed — and see why the gametophytes never leave home.",
  },
  {
    id: uuid(), type: 'text', order: 4,
    markdown: "Gymnosperms are **heterosporous** — they make two different kinds of haploid spore: **microspores** and **megaspores**. Both are produced inside **sporangia** that sit on **sporophylls**, which are arranged spirally along an axis to form cones, also called **strobili**.\n\nThe two cones do different jobs. **Male strobili** (**microsporangiate**) carry **microsporophylls** with **microsporangia**; inside these, each microspore develops into a **male gametophyte** that is **highly reduced** — cut down to just a handful of cells. This reduced male gametophyte is the **pollen grain**, and it develops right inside the microsporangium. **Female strobili** (**macrosporangiate**) carry **megasporophylls** bearing the **ovules** (megasporangia). In *Pinus* both cones grow on the **same tree**; in *Cycas* the male cones and megasporophylls are on **different trees**.\n\nNow the female side. Inside the ovule, one cell of the **nucellus** becomes the **megaspore mother cell**, which divides **meiotically into four megaspores**. One of those megaspores — still enclosed within the megasporangium — grows into a **multicellular female gametophyte** bearing **two or more archegonia** (the female sex organs), and it stays **retained within the megasporangium**. The nucellus wrapped in its protective envelopes is what we call the **ovule**.\n\nHere's the part NEET loves. **Unlike bryophytes and pteridophytes, in gymnosperms neither gametophyte lives freely** — both the male and female gametophytes stay inside the sporangia, retained on the sporophyte parent. The pollen grain is **released from the microsporangium**, carried by **air currents**, and lands at the **opening of the ovule**. A **pollen tube** then grows out, carrying the male gametes toward the **archegonia**, and discharges them near the mouth of the archegonium. After fertilisation the **zygote becomes an embryo** and the **ovule becomes a seed** — and, true to the name, that seed is **not covered**.",
  },
  {
    id: uuid(), type: 'interactive_image', order: 5, src: '',
    alt: 'A pine-style gymnosperm showing male and female cones, a naked ovule, a pollen grain, a needle leaf, and a coralloid root',
    caption: '📸 Tap each dot to explore how a gymnosperm gets from pollen to a naked seed',
    generation_prompt: "Scientific textbook illustration of a Pinus-style gymnosperm (conifer). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, no text or labels baked into the image. Show a single conifer branch bearing: near the upper left, a small cluster of soft brown male cones (microsporangiate strobili) shedding a faint drift of tiny pale pollen grains; near the upper right, a larger woody green-brown female cone (megasporangiate strobilus) with visible open scales and a naked ovule resting exposed on one scale; along the branch, dark green needle-like leaves in tight bundles; and at the very bottom, the root system as a tap root with one short, knobbly, coral-like branched coralloid root highlighted. Functional colours: green for the living needles and cone, brown/tan for the woody cone scales and mature seeds, pale cream for pollen. No photorealism, no cartoon, no mascots, no labels — matches standard biology textbook illustration conventions.",
    hotspots: gymnoHotspots,
  },
  {
    id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
    prompt: "In a moss (a bryophyte) or a fern (a pteridophyte), the gametophyte is a small green plant you can find growing on its own on damp soil. In a gymnosperm, you will never find the gametophyte living on its own like that. Why not?",
    options: [
      "Gymnosperm gametophytes die instantly the moment they are formed, so they never get the chance to grow",
      "In gymnosperms the male and female gametophytes are retained inside the sporangia on the sporophyte and never have an independent free-living existence",
      "Gymnosperms have no gametophyte stage at all — they reproduce directly from spores to seeds",
      "The gametophytes float away in air currents, so they are simply too small to ever be seen",
    ],
    correct_index: 1,
    reveal: "In gymnosperms both gametophytes stay put — the reduced male gametophyte (the pollen grain) develops inside the microsporangium, and the female gametophyte is retained inside the megasporangium on the parent sporophyte. They never detach and live on their own, which is exactly what sets gymnosperms apart from bryophytes and pteridophytes, whose gametophytes DO live freely. They don't die instantly, and they aren't skipped — the gametophyte generation is very much present, just dependent and hidden inside the sporangia.",
    difficulty_level: 2,
  },
  {
    id: uuid(), type: 'comparison_card', order: 7, title: 'Male Cone vs Female Cone',
    columns: [
      {
        heading: 'Male cone (microsporangiate strobilus)',
        points: [
          'Bears microsporophylls carrying microsporangia',
          'Produces microspores',
          'Each microspore → a highly reduced male gametophyte = the pollen grain, formed inside the microsporangium',
          'Pollen is released and carried away by air currents',
        ],
      },
      {
        heading: 'Female cone (macrosporangiate strobilus)',
        points: [
          'Bears megasporophylls carrying ovules (megasporangia)',
          'Megaspore mother cell (from the nucellus) → 4 megaspores by meiosis',
          'One megaspore → a multicellular female gametophyte bearing 2 or more archegonia, retained in the megasporangium',
          'Receives the pollen; after fertilisation the ovule becomes a naked seed',
        ],
      },
    ],
  },
  {
    id: uuid(), type: 'callout', order: 8, variant: 'remember', title: "The Facts You Cannot Get Wrong",
    markdown: "- **Gymno = naked:** the ovules are exposed (no ovary wall) and the seeds that form are naked.\n- **_Sequoia_ (giant redwood)** = one of the tallest tree species.\n- **_Cycas_ = coralloid roots** hosting **N₂-fixing cyanobacteria**; **_Pinus_ = mycorrhiza** (fungal root partner).\n- **Gymnosperms are heterosporous** — microspores + megaspores.\n- The **pollen grain = the highly reduced male gametophyte** (develops inside the microsporangium).\n- **Neither gametophyte is free-living** — both stay inside the sporangia on the sporophyte (unlike bryophytes and pteridophytes).\n- A **pollen tube** carries the male gametes to the archegonia; there's no covered seed at the end.",
  },
  {
    id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
    markdown: "**Naked seed = naked ovule:** the defining test line is that ovules are **not enclosed by an ovary wall** and stay **exposed before and after fertilisation**. That single phrase separates gymnosperms from angiosperms.\n\n**Coralloid roots:** if a question names **coralloid roots + N₂-fixing cyanobacteria**, the answer is **_Cycas_** — don't confuse it with *Pinus*, whose roots carry **mycorrhiza** instead.\n\n**Reduced, dependent gametophytes:** gymnosperms are **heterosporous**; the gametophytes are **highly reduced** and **not free-living** — a favourite contrast with bryophytes/pteridophytes. The **pollen grain is the male gametophyte**, and the male gametes reach the archegonia through a **pollen tube**.\n\n**Same tree vs different trees:** in **_Pinus_ both cones are on the same tree**; in **_Cycas_ male cones and megasporophylls are on different trees**.\n\n**Classic NEET question:** \"In which gymnosperm are the roots associated with nitrogen-fixing cyanobacteria?\" → *Cycas* (coralloid roots).",
  },
  {
    id: uuid(), type: 'text', order: 10,
    markdown: "So gymnosperms solved the seed, but left it out in the open on a cone. The next group wraps the ovule inside a flower and the seed inside a fruit — that's the angiosperms, the flowering plants.",
  },
  {
    id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
    questions: [
      {
        id: uuid(), question: 'Why are gymnosperms called "naked-seeded" plants?',
        options: [
          'Their seeds have no stored food, so the embryo is left exposed and unprotected',
          'Their ovules are not enclosed by an ovary wall and stay exposed, so the seeds that form are not covered',
          'Their seeds germinate immediately without any dormant period',
          'Their seeds are enclosed inside a fruit that later peels away completely',
        ],
        correct_index: 1,
        explanation: "'Gymnos' means naked: the ovules sit exposed on the megasporophyll with no ovary wall around them, before and after fertilisation, so the resulting seeds are uncovered. It has nothing to do with stored food or germination timing. Seeds enclosed in a fruit describe angiosperms — the exact opposite group.",
        difficulty_level: 1,
      },
      {
        id: uuid(), question: 'In which gymnosperm do specialised coralloid roots house nitrogen-fixing cyanobacteria?',
        options: ['Pinus', 'Cedrus', 'Cycas', 'Sequoia'],
        correct_index: 2,
        explanation: "NCERT names Cycas for coralloid roots associated with N₂-fixing cyanobacteria. Pinus is the one with mycorrhiza (a fungal root partner), not cyanobacteria; Cedrus is only cited for having a branched stem, and Sequoia is cited as one of the tallest trees — neither is linked to coralloid roots.",
        difficulty_level: 2,
      },
      {
        id: uuid(), question: 'The pollen grain of a gymnosperm is best described as which of the following?',
        options: [
          'A microspore mother cell before meiosis has taken place',
          'The multicellular female gametophyte bearing archegonia',
          'A highly reduced male gametophyte that develops within the microsporangium',
          'A naked seed released directly from the male cone',
        ],
        correct_index: 2,
        explanation: "NCERT states the microspore develops into a highly reduced male gametophyte confined to a few cells — this reduced gametophyte is the pollen grain, formed inside the microsporangium. It is not a pre-meiotic mother cell, it is not the female gametophyte (that bears the archegonia and stays in the megasporangium), and it is certainly not a seed.",
        difficulty_level: 2,
      },
      {
        id: uuid(), question: 'How do the gametophytes of gymnosperms differ from those of bryophytes and pteridophytes?',
        options: [
          'Gymnosperm gametophytes are larger and photosynthetic, unlike the tiny ones in bryophytes',
          'Gymnosperm gametophytes are not free-living — they stay retained within the sporangia on the sporophyte',
          'Gymnosperms have only a male gametophyte and no female gametophyte at all',
          'Gymnosperm gametophytes live independently on damp soil, just like a fern prothallus',
        ],
        correct_index: 1,
        explanation: "Unlike bryophytes and pteridophytes, gymnosperm gametophytes have no independent free-living existence — both male and female gametophytes remain inside the sporangia, retained on the sporophyte. They are reduced (not larger), both sexes are present, and they specifically do NOT live independently the way a fern's free-living gametophyte does.",
        difficulty_level: 3,
      },
    ],
  },
];

module.exports = {
  slug: 'gymnosperms-naked-seeds',
  title: 'Gymnosperms: The Naked-Seeded Plants',
  subtitle: "The pine, the cycad, and the giant redwood all share one thing — seeds that sit out in the open on a cone. Here's how a naked seed is made, and why NEET keeps testing it.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['gymnosperms', 'plant-kingdom', 'naked-seeds', 'cones', 'heterosporous'],
  glossary: [
    { term: 'ovule', definition: 'The nucellus together with its protective envelopes; in gymnosperms it sits exposed on the megasporophyll and develops into a naked seed after fertilisation.' },
    { term: 'microsporophyll', definition: 'A modified leaf-like structure in a male cone that bears the microsporangia, where microspores (and thus pollen grains) are produced.' },
    { term: 'megasporophyll', definition: 'A modified leaf-like structure in a female cone that bears the ovules (megasporangia).' },
    { term: 'strobilus (cone)', definition: 'A compact or lax cluster of sporophylls arranged spirally along an axis; male strobili bear microsporangia, female strobili bear megasporangia.' },
    { term: 'pollen grain', definition: 'The highly reduced male gametophyte of a gymnosperm, confined to a few cells, which develops within the microsporangium.' },
    { term: 'coralloid root', definition: 'A small, specialised, coral-like root found in Cycas that houses nitrogen-fixing cyanobacteria.' },
    { term: 'nucellus', definition: 'The tissue of the ovule from which the megaspore mother cell differentiates; protected by envelopes to form the ovule.' },
    { term: 'heterosporous', definition: 'Producing two different kinds of spore — microspores and megaspores — as gymnosperms do.' },
  ],
  blocks,
};
