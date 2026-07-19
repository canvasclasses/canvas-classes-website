'use strict';
/**
 * Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
 * Page 0 — Chapter opener.
 *
 * Source of truth: NCERT Class 12 Ch.1 (lebo101.txt) — the unit opener
 * paragraph, the chapter intro, and the section list 1.1–1.5. Rule 0: every
 * fact here traces to that text; nothing invented.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'chapter-1-overview',
  title: 'Sexual Reproduction in Flowering Plants',
  subtitle: "The colours, scents and shapes of every flower exist for one reason — sexual reproduction. This chapter walks that whole story, from a grain of pollen to a ripe fruit.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['sexual-reproduction-in-flowering-plants', 'angiosperms', 'chapter-overview'],
  glossary: [
    { term: 'angiosperm', definition: 'A flowering plant — a plant whose seeds develop enclosed inside a fruit. Every flowering plant reproduces sexually.' },
    { term: 'androecium', definition: 'The male part of a flower — the whorl of stamens that makes pollen.' },
    { term: 'gynoecium', definition: 'The female part of a flower — the structure that holds the egg and, after fertilisation, becomes the fruit.' },
    { term: 'double fertilisation', definition: 'The event, found only in flowering plants, where one flower ends up carrying out two fusions at once — one making the embryo, the other feeding it.' },
  ],
  blocks: [
    {
      id: '3f9a1c2e-7d84-4b1a-9c6f-2e5a8d0b41f7',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dusk meadow of open flowers with insects drifting between blooms, warm light low on the horizon',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet meadow at dusk, filled with open flowers of many kinds — soft petals catching the last warm light of the day, a single low golden sun near the horizon. A few insects drift between the blooms, barely visible, suggesting the quiet work of pollination rather than being the focal subject. Pollen hangs faintly in the warm air as tiny out-of-focus specks lit by the low sun. Deep dusk lighting throughout, painterly and atmospheric, dark background tones overall (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: 'a1c7e930-5b62-4f8d-8a11-6d4c9e2f0b83',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'The Flower Was Never For Us',
      markdown: "The colours you love in a rose, the scent of jasmine at night, the sweetness that pulls a bee across a field — none of it is really for you. Every one of those features is an advertisement, evolved to get pollen from one flower onto another. A flower is a plant's setup for sex, dressed up so well that we ended up gardening for it. All flowering plants reproduce this way, and the end products of all that colour and scent are the two things the plant actually wants: **fruits and seeds**.",
    },
    {
      id: '7e2d4a91-c308-4f6b-b52a-91f7c6d380e4',
      type: 'text',
      order: 2,
      markdown: "Why does a plant bother with all this at all? Because individual organisms die — every single one — but a **species** can carry on for millions of years. The only thing that keeps a species going is reproduction, and the sexual kind does something extra: it shuffles the deck each generation, creating new variants, so the offspring aren't just copies. That variety is a survival advantage when conditions change.\n\nIn a flowering plant (an **angiosperm**), all of this happens inside the flower. To a biologist the flower isn't decoration — it's the site of sexual reproduction, and both of the players it needs develop right there. The male part, the **androecium**, is a whorl of stamens that makes pollen. The female part, the **gynoecium**, holds the egg and later becomes the fruit. Everything else in this chapter is the story of how these two parts are built, how they meet, and what they produce.",
    },
    {
      id: '2b9f6c1d-84a7-4e30-9f5c-3a6b1d8e70c2',
      type: 'text',
      order: 3,
      markdown: "Here's the arc you're about to walk. First you'll look closely at the **flower itself** — the organ where all of it takes place. Then comes the run-up to fertilisation: how the plant **makes pollen** inside the anther, and how it **makes the egg** inside the ovule. Once both are ready, they have to be brought together — that's **pollination**, moving pollen to the right place. What happens next is a twist unique to flowering plants, **double fertilisation**, where one flower carries out two fusions at once — one builds the embryo, the other builds its food supply. After fertilisation the flower transforms: the ovule becomes the **seed** and the ovary becomes the **fruit**. And right at the end you'll meet the exception that proves the rule — **apomixis**, where a plant makes seeds without any fertilisation at all.",
    },
    {
      id: 'd4e81a67-2c95-4b03-8e7f-5a1c9b6d240f',
      type: 'callout',
      order: 4,
      variant: 'remember',
      title: 'The Five Stops in This Chapter',
      markdown: "1. **Flower — A Fascinating Organ of Angiosperms:** the flower as the site of sexual reproduction, and where the male and female parts sit.\n2. **Pre-fertilisation — Structures and Events:** building the pollen grain (male gamete) and the embryo sac (female gamete), then pollination bringing them together.\n3. **Double Fertilisation:** the two-fusion event found only in flowering plants.\n4. **Post-fertilisation — Structures and Events:** the ovule turning into a seed and the ovary into a fruit.\n5. **Apomixis and Polyembryony:** seeds formed without fertilisation, and more than one embryo in a single seed.",
    },
  ],
};
