'use strict';
/**
 * Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
 * Page 1 (lesson) — The Flower: Where Sexual Reproduction Happens.
 *
 * Source of truth: NCERT Class 12 Ch.1 (lebo101.txt) §1.1 "Flower – A
 * Fascinating Organ of Angiosperms" + the opening of §1.2 (androecium /
 * gynoecium differentiation, floral primordium, inflorescence). Rule 0: every
 * fact here traces to that text; nothing invented.
 *
 * Scope is deliberately narrow — the gentle on-ramp to the chapter. The
 * detailed build of stamen/anther/ovule/embryo-sac belongs to later pages.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-flower-site-of-sexual-reproduction',
  title: 'The Flower — Where Sexual Reproduction Happens',
  subtitle: "A flower looks like decoration, but to a biologist it is a reproductive organ. Here is how to read a typical flower and spot the two whorls that actually do the reproducing.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['sexual-reproduction-in-flowering-plants', 'flower', 'androecium', 'gynoecium'],
  glossary: [
    { term: 'angiosperm', definition: 'A flowering plant — one whose seeds develop enclosed inside a fruit. Every flowering plant reproduces sexually.' },
    { term: 'androecium', definition: 'The male part of a flower — the whorl of stamens. It produces pollen.' },
    { term: 'gynoecium', definition: 'The female part of a flower — the whorl of one or more pistils. It holds the egg and later becomes the fruit.' },
    { term: 'thalamus', definition: 'The swollen tip of the flower stalk to which all the floral parts — sepals, petals, stamens and pistil — are attached.' },
    { term: 'floral primordium', definition: 'The earliest bit of tissue from which a flower begins to develop, well before the flower is visible on the plant.' },
    { term: 'inflorescence', definition: 'The arrangement in which floral buds, and then flowers, are borne on a plant.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single open flower at dusk seen in soft profile, petals catching low warm light, the reproductive parts faintly visible at its centre',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single open flower seen in gentle side profile at dusk, positioned to the right of centre, its soft petals catching low warm golden light against a naturalistic dark background. At the very heart of the flower the slender reproductive parts are just faintly visible as pale upright structures, drawing the eye inward without being labelled. The rest of the frame falls away into soft out-of-focus dusk meadow and a low warm horizon glow on the left. Deep dusk lighting throughout, painterly and atmospheric, dark background tones overall (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'You Have Been Gardening For A Plant’s Sex Life',
      markdown: "People have loved flowers since forever — we hand them at weddings, lay them at funerals, and grow them just to look at. But a flower was never made for us. Its colours, its scent, its shape are all there for one job: helping the plant carry out **sexual reproduction**. To a biologist a flower isn't an ornament at all — it is a **morphological and embryological marvel**, and it is the site where the whole business of making the next generation takes place.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Every **angiosperm** — every flowering plant — reproduces sexually, and it does so inside the flower. That's worth pausing on, because it changes how you look at one. The soft petals and sweet smell that pull you (and a bee) toward a rose are advertising; the real work happens at the centre of the flower, where the male and female reproductive parts sit.\n\nYou have already met the parts of a flower in earlier classes. This page isn't about learning them from scratch — it's about looking at a flower the way a biologist does, so that when the chapter starts opening up the anther and the ovule in detail, you already know exactly *where* on the flower each of those things lives. So let's recall a typical flower, laid open.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Recall A Typical Flower — Laid Open In Section',
      objective: "By the end of this you can point to every whorl of a typical flower in a longitudinal section, and say which two of them do the reproducing.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Slice a typical flower straight down the middle — a **longitudinal section (L.S.)** — and its parts line up neatly on the stalk. Everything attaches to the swollen tip of the stalk called the **thalamus**. Working from the outside in, you find four sets of parts arranged in whorls:\n\n- the **sepals** — usually green, they wrap and protect the flower while it is still a bud;\n- the **petals** — the colourful, often scented whorl that attracts pollinators;\n- the **stamens** — the whorl that makes pollen;\n- the **pistil** — the central flask-shaped structure with a landing platform on top.\n\nThe first two whorls, sepals and petals, are the showy protective layers. It's the **inner two whorls — the stamens and the pistil — that carry out sexual reproduction.** Keep your eye on those two as you read the diagram below; they are the parts the rest of this chapter is built around.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Longitudinal section of a typical flower showing thalamus, sepal, petal, stamen, stigma and ovary',
      caption: '📸 Tap each dot to explore the parts of a typical flower in section — and spot the two reproductive whorls',
      generation_prompt: "Scientific textbook illustration of the longitudinal section (L.S.) of a typical flower. Flat 2D educational diagram on a dark background (#0a0a0a near-black). The flower is shown cut vertically down the middle and viewed side-on, symmetrical about a central vertical axis. At the base sits a swollen receptacle (thalamus) on a short stalk. Attached to it, from outside in: a pair of small green sepals at the very base flanking the flower; above them a pair of larger colourful petals flaring outward to the sides; inside the petals two upright stamens, each drawn as a slender filament topped by a bilobed anther, flanking the centre; and in the very centre a single tall flask-shaped pistil — a rounded swollen ovary at the base (with a few tiny ovules shown inside as small circles), a slender style rising from it, topped by a slightly expanded stigma. Clean white outlines throughout, green for the sepals, soft pink/magenta petals, functional muted colours. Biologically accurate proportions, no text or labels baked into the image itself, no photorealism, no cartoon. Matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.13, label: 'Stigma', icon: 'circle',
          detail: 'The tip of the **pistil** — a sticky landing platform that receives pollen. It sits at the very top of the female whorl (gynoecium).' },
        { id: uuid(), x: 0.34, y: 0.30, label: 'Stamen', icon: 'circle',
          detail: 'One unit of the **androecium**, the male whorl. Each stamen is a slender filament tipped by an anther, and it is the anther that makes pollen.' },
        { id: uuid(), x: 0.17, y: 0.42, label: 'Petal', icon: 'circle',
          detail: 'A member of the colourful, often scented whorl. Petals attract pollinators but do not themselves take part in reproduction.' },
        { id: uuid(), x: 0.26, y: 0.66, label: 'Sepal', icon: 'circle',
          detail: 'Usually green and leaf-like. Sepals wrap and protect the flower while it is still a bud, and are the outermost whorl.' },
        { id: uuid(), x: 0.5, y: 0.62, label: 'Ovary', icon: 'circle',
          detail: 'The swollen base of the **pistil**, the core of the **gynoecium** (female part). It holds the ovules and, after fertilisation, becomes the fruit.' },
        { id: uuid(), x: 0.5, y: 0.86, label: 'Thalamus', icon: 'circle',
          detail: 'The swollen tip of the flower stalk. Every floral whorl — sepals, petals, stamens and pistil — is attached to it.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "NCERT asks you this exact question after showing the flower: name the two parts of a flower in which the two most important units of sexual reproduction develop. Which pair is it?",
      options: [
        'The sepals and the petals',
        'The stamens (androecium) and the pistil (gynoecium)',
        'The thalamus and the sepals',
        'The petals and the stamens',
      ],
      correct_index: 1,
      reveal: "The two reproductive whorls are the **stamens** — together called the **androecium**, the male part — and the **pistil** — the **gynoecium**, the female part. Pollen (carrying the male units) develops in the stamens, and the egg (the female unit) develops inside the pistil. Sepals and petals are the tempting wrong answer because they are the most eye-catching parts of a flower, but they are only the protective and attracting whorls — they never produce gametes. 'Petals and stamens' fails for the same reason: it includes petals, which do no reproducing.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Decision To Flower Comes First',
      objective: 'By the end of this you can explain what has to happen inside a plant before a single flower is even visible.',
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Here's something easy to miss: a flower doesn't appear out of nowhere. **Much before the actual flower is seen on the plant, the decision that the plant is going to flower has already been made.** Several hormonal and structural changes get set off inside the plant, and these lead to the differentiation and development of the **floral primordium** — the first tiny cluster of tissue that will grow into a flower.\n\nFrom there, **inflorescences** form — the arrangement that bears first the floral buds and then the open flowers. And it is within the developing flower that the male and female reproductive structures take shape: the **androecium** and the **gynoecium** differentiate and develop side by side. Recall the two terms exactly: the **androecium is a whorl of stamens — the male reproductive organ**, and the **gynoecium is the female reproductive organ**. Those two are what the next several pages will open up, one at a time.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Lock These In Before You Move On',
      markdown: "- A **flower is the site of sexual reproduction** in angiosperms — to a biologist it is a reproductive organ, not decoration.\n- The **androecium** = the whorl of **stamens** = the **male** reproductive part.\n- The **gynoecium** = the **pistil(s)** = the **female** reproductive part.\n- **Sepals and petals do not reproduce** — they only protect and attract. Only the stamens and pistil carry the reproductive units.\n- The **decision to flower is taken long before the flower appears**: hormonal and structural changes → floral primordium → inflorescence → floral buds → flowers.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Androecium vs gynoecium:** NEET reliably tests the male/female labels of the two whorls. **Androecium → stamens → male; gynoecium → pistil → female.** A common swapped-term trap calls the gynoecium the male part — don't fall for it.\n\n**‘Where do the gametophytes develop?’** This chapter's very first NCERT exercise asks you to name the parts of a flower in which the male and female gametophytes develop. The answer traces straight back to this page: the **stamen (anther)** for the male side and the **pistil (ovule)** for the female side.\n\n**Classic NEET question:** “The androecium of a flower represents its — ?” → the **male reproductive organ (the whorl of stamens)**.",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the flower is set: the male whorl and the female whorl are in place, ready to build their gametes. Next we zoom right into the stamen — into the anther — to watch how the plant actually manufactures pollen.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'To a biologist, what is a flower, first and foremost?',
          options: [
            'A purely ornamental structure that exists for human enjoyment',
            'A food-storage organ that feeds the rest of the plant',
            'The site of sexual reproduction in an angiosperm',
            'A structure whose only role is to attract insects for defence',
          ],
          correct_index: 2,
          explanation: "NCERT is explicit that flowers are morphological and embryological marvels and the sites of sexual reproduction. The ornamental view is exactly the misconception the chapter corrects — the colour and scent are aids to reproduction, not the point of the flower. It is not a food-storage organ, and while flowers do attract pollinators, that attraction serves reproduction, not defence.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'The gynoecium of a flower represents which reproductive part, and what is it made of?',
          options: [
            'The female reproductive part, made of one or more pistils',
            'The male reproductive part, made of a whorl of stamens',
            'The female reproductive part, made of a whorl of stamens',
            'The male reproductive part, made of one or more pistils',
          ],
          correct_index: 0,
          explanation: "The gynoecium is the **female** reproductive part and is made of the **pistil(s)**. The tempting trap is the mirror-image statement about the androecium — that one is the male part made of stamens. Mixing the two (female + stamens, or male + pistils) is the classic swapped-term error NEET plants in the options.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In the longitudinal section of a typical flower, which structure is the swollen tip of the stalk that every floral whorl is attached to?',
          options: ['The stigma', 'The ovary', 'The style', 'The thalamus'],
          correct_index: 3,
          explanation: "All the whorls — sepals, petals, stamens and pistil — attach to the **thalamus**, the swollen tip of the flower stalk. The stigma, style and ovary are the three parts of the pistil itself, not the base it sits on, so they are correct flower structures placed as traps in the wrong role here.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which sequence correctly describes what happens before a flower is visible on a plant?',
          options: [
            'Open flower → inflorescence → floral primordium → hormonal changes',
            'Hormonal and structural changes → floral primordium → inflorescence with floral buds → flowers',
            'Floral buds → hormonal changes → floral primordium → inflorescence',
            'Inflorescence → flowers → floral primordium → hormonal changes',
          ],
          correct_index: 1,
          explanation: "NCERT gives the order plainly: the decision to flower triggers **hormonal and structural changes**, which produce the **floral primordium**, from which **inflorescences bearing floral buds** form, and then the **flowers**. The other options scramble that order — putting the open flower or the inflorescence first reverses the actual developmental sequence, which always runs from internal changes outward to the visible flower.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
