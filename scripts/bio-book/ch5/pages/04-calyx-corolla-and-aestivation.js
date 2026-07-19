'use strict';
const { v4: uuid } = require('uuid');

const aestivationHotspots = [
  {
    id: uuid(), x: 0.13, y: 0.55, label: 'Valvate', icon: 'circle',
    detail: "Sepals or petals in the whorl just **touch one another at the margin, without overlapping** — like slices meeting edge to edge. Seen in **Calotropis**.",
  },
  {
    id: uuid(), x: 0.38, y: 0.55, label: 'Twisted', icon: 'circle',
    detail: "**One margin of each petal overlaps the next one, and so on**, all the way round the whorl — the overlap runs in one consistent direction. Seen in **china rose, lady's finger, and cotton**.",
  },
  {
    id: uuid(), x: 0.63, y: 0.55, label: 'Imbricate', icon: 'circle',
    detail: "Margins **overlap one another, but not in any particular direction** — overlap is present, just with no fixed rotational pattern. Seen in **Cassia and gulmohur**.",
  },
  {
    id: uuid(), x: 0.88, y: 0.55, label: 'Vexillary (Papilionaceous)', icon: 'circle',
    detail: "Five petals: the largest (the **standard**) overlaps the two lateral petals (the **wings**), which in turn overlap the two smallest, innermost petals (the **keel**). Seen in **pea and bean flowers**.",
  },
];

module.exports = {
  slug: 'calyx-corolla-and-aestivation',
  title: 'Calyx, Corolla, and Aestivation',
  subtitle: "The two outer whorls of a flower — one green and protective, one coloured and inviting — and the four fixed ways their members fold shut inside the bud.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['morphology-of-flowering-plants', 'flower', 'calyx', 'corolla'],
  glossary: [
    { term: 'sepal', definition: 'An individual member of the calyx, usually green and leaf-like, protecting the flower in the bud stage.' },
    { term: 'petal', definition: 'An individual member of the corolla, usually brightly coloured to attract insects for pollination.' },
    { term: 'gamosepalous', definition: 'A calyx whose sepals are united (joined together).' },
    { term: 'polysepalous', definition: 'A calyx whose sepals are free from one another.' },
    { term: 'gamopetalous', definition: 'A corolla whose petals are united (joined together).' },
    { term: 'polypetalous', definition: 'A corolla whose petals are free from one another.' },
    { term: 'aestivation', definition: 'The mode of arrangement of sepals or petals in the floral bud with respect to the other members of the same whorl.' },
    { term: 'valvate', definition: 'Aestivation where sepals or petals just touch one another at the margin, without overlapping, as in Calotropis.' },
    { term: 'twisted', definition: "Aestivation where one margin of each petal overlaps the next one, and so on, as in china rose, lady's finger and cotton." },
    { term: 'imbricate', definition: 'Aestivation where the margins of sepals or petals overlap one another but not in any particular direction, as in Cassia and gulmohur.' },
    { term: 'vexillary (papilionaceous)', definition: 'Aestivation of pea and bean flowers, where the largest petal (standard) overlaps two lateral petals (wings), which in turn overlap the two smallest petals (keel).' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk garden of flowers in bud and in bloom, petals unfurling from tightly folded buds',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dusk garden scene at close range: in the foreground, several unopened flower buds, tightly closed and wrapped in green sepals, sit beside a few fully open flowers with bright unfurled petals in warm pink, magenta and amber tones. One flower in the centre is caught mid-opening, its petals just beginning to loosen from their folded arrangement, hinting at the pattern they were packed in. A soft-focus moth or bee approaches one of the open blooms in the background. Warm dusk light rakes across the scene from one side. Deep, painterly illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Every Bud Folds Shut The Same Few Ways',
      markdown: "Long before a flower opens, its sepals and petals are already folded shut inside the bud — and that folding follows a fixed pattern. NCERT calls this pattern **aestivation**, and there are only **four main types** of it: valvate, twisted, imbricate, and vexillary. Learn to tell these four apart, and you can read almost any labelled flower-bud diagram NEET puts in front of you.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Every flower normally has four floral whorls, arranged one inside the other: **calyx, corolla, androecium, and gynoecium** — shown together in Figure 5.10. The outer two whorls, calyx and corolla, are what you notice first: the green parts and the coloured parts of a flower. The inner two, androecium and gynoecium, are the reproductive whorls — stamens and carpels — and you'll meet them on the next page.\n\nThis page is about getting the outer two whorls completely sorted: what each one is made of, what job it does, and the exact pattern its members fold into inside the bud.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Calyx — The Outermost Whorl',
      objective: "By the end you'll know what the calyx is for, what its members are called, and the difference between gamosepalous and polysepalous.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **calyx** is the outermost whorl of the flower. Its individual members are called **sepals**. Sepals are generally **green and leaf-like** — which fits their job: they **protect the flower while it is still in the bud stage**, before it opens.\n\nLike every whorl in a flower, the sepals can either stay joined or stay separate, and NCERT gives each arrangement its own name. When the sepals are **united**, the calyx is called **gamosepalous**. When the sepals are **free** from one another, the calyx is called **polysepalous**.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Corolla — Petals, Colour, and Shape',
      objective: "By the end you'll know what the corolla is for, the gamopetalous/polypetalous split, and the four corolla shapes NCERT names.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The **corolla** is composed of **petals**. Unlike sepals, petals are usually **brightly coloured** — and that colour has a job: it **attracts insects for pollination**.\n\nThe same united-or-free choice from the calyx applies here too. When the petals are joined together, the corolla is **gamopetalous**; when the petals are free from one another, it is **polypetalous**.\n\nThe shape and colour of the corolla vary greatly from plant to plant. NCERT names four common shapes a corolla can take: **tubular, bell-shaped, funnel-shaped, or wheel-shaped**.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 7, title: 'United vs Free — Same Idea, Two Whorls',
      columns: [
        { heading: 'Gamosepalous (Calyx)', points: ['Sepals are united — joined together', 'Term applies to the calyx whorl'] },
        { heading: 'Polysepalous (Calyx)', points: ['Sepals are free from one another', 'Term applies to the calyx whorl'] },
        { heading: 'Gamopetalous (Corolla)', points: ['Petals are united — joined together', 'Term applies to the corolla whorl'] },
        { heading: 'Polypetalous (Corolla)', points: ['Petals are free from one another', 'Term applies to the corolla whorl'] },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Aestivation — How the Bud Packs Its Petals',
      objective: "By the end you'll be able to name any of the four aestivation types just from a description of how the sepals or petals overlap — and never mix up twisted with imbricate again.",
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "**Aestivation** is the mode of arrangement of sepals or petals in the floral bud, with respect to the other members of the same whorl. In other words: once the bud is closed, how are the sepals (or petals) sitting against each other — just touching, overlapping in one direction, overlapping every which way, or wrapped in a specific order?\n\nNCERT names four main types: **valvate, twisted, imbricate, and vexillary** (Figure 5.11). Tap through the diagram below to see exactly how each one looks, and which flowers show it.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 10, src: '',
      alt: 'Four floral bud cross-sections side by side, showing valvate, twisted, imbricate, and vexillary aestivation',
      caption: '📸 Tap each dot to explore Figure 5.11 — the four types of aestivation in corolla',
      hotspots: aestivationHotspots,
      generation_prompt: "Scientific textbook illustration of four floral bud cross-sections arranged in a row, labelled (a) through (d) as in NCERT Figure 5.11. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, biologically accurate proportions, petals rendered in soft pink tones. Panel (a) Valvate: a circular cross-section with petals arranged edge to edge around the centre, just touching at their margins with no overlap at all, like slices of a pie. Panel (b) Twisted: a circular cross-section where each petal's margin overlaps the next petal in the same rotational direction all the way around, like a pinwheel. Panel (c) Imbricate: a circular cross-section where petals overlap each other at mixed, inconsistent directions with no repeating pattern. Panel (d) Vexillary (papilionaceous): five petals shown with one large outer petal (the standard) wrapped around two lateral petals (the wings), which in turn wrap around two small innermost petals (the keel). Small (a) (b) (c) (d) labels beneath each panel matching NCERT figure convention, no other text baked into the image. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A flower bud is cut open. Its petals clearly overlap each other, but the overlap doesn't follow any consistent direction — some petals overlap the one on their left, others overlap the one on their right, with no repeating pattern around the whorl. Which aestivation type is this, and why isn't it twisted?",
      options: [
        "Twisted — margins overlap consistently in one direction all the way round, exactly like imbricate aestivation",
        "Imbricate — overlap is present, but twisted specifically requires each margin to overlap the next one in the same direction all the way around, which isn't happening here",
        "Valvate — the petals are only touching at the edges without overlapping",
        "Vexillary — any five petals showing overlap indicate a standard-wings-keel arrangement",
      ],
      reveal: "This is imbricate aestivation — margins overlap, as in Cassia and gulmohur, but not in any particular direction. Twisted aestivation also has overlap, but the key difference is direction: in twisted, one margin overlaps the next one, and so on, consistently in the same direction all the way round the whorl, as in china rose, lady's finger and cotton. Valvate is wrong because valvate means the members only touch at the margin with no overlap at all. Vexillary is wrong because that specific standard-wings-keel pattern only applies to pea and bean type flowers with exactly five petals in that particular overlap order — not any five-petalled flower that happens to show overlap.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: 'The Outer Two Whorls — In One Line Each',
      markdown: "- **Calyx** = outermost whorl, members are **sepals**, usually green and leaf-like, protects the flower in the bud stage. **Gamosepalous** = sepals united; **polysepalous** = sepals free.\n- **Corolla** = petals, usually brightly coloured to attract pollinating insects. **Gamopetalous** = petals united; **polypetalous** = petals free. Shapes: tubular, bell-shaped, funnel-shaped, wheel-shaped.\n- **Aestivation** = arrangement of sepals/petals in the bud, relative to each other in the same whorl. Four types: **valvate** (touch, no overlap — Calotropis), **twisted** (overlap, one direction — china rose, lady's finger, cotton), **imbricate** (overlap, no fixed direction — Cassia, gulmohur), **vexillary/papilionaceous** (standard overlaps wings, wings overlap keel — pea, bean).",
    },
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Twisted vs imbricate — the classic mix-up:** both types have overlapping margins, which is exactly why students confuse them. The test is *direction*. Twisted overlaps in **one consistent direction** all the way round the whorl (china rose, lady's finger, cotton). Imbricate overlaps too, but with **no fixed direction** (Cassia, gulmohur).\n\n**Vexillary/papilionaceous — a NEET favourite:** five petals, always tied to the pea family. Learn the three names in order: **standard** (outermost, largest) → **wings** (two lateral) → **keel** (two innermost, smallest), each overlapping the next.\n\n**Classic NEET question:** \"The aestivation found in the pea flower is ___\" → **vexillary (papilionaceous).**",
    },
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "You now have both outer whorls fully mapped — calyx protecting the bud, corolla attracting pollinators, and four fixed ways their members can be arranged inside that bud. Next comes the flower's third whorl, the androecium, built entirely out of stamens.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'The calyx is the outermost floral whorl. What are its members called, and what is their usual protective role?',
          options: [
            'Petals — usually brightly coloured to attract insects',
            'Sepals — usually green and leaf-like, protect the bud',
            'Stamens — the male reproductive whorl bearing pollen',
            'Carpels — the female whorl enclosing the ovule',
          ],
          correct_index: 1,
          explanation: "The calyx's members are sepals — generally green and leaf-like, protecting the flower in the bud stage. Petals belong to the corolla, one whorl in; stamens (androecium) and carpels (gynoecium) are the two innermost, reproductive whorls, not the outermost protective one.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Petals are usually brightly coloured. What is the reason for this colouration?',
          options: [
            'To store food reserves for the growing embryo',
            'To shield the sepals from strong sunlight',
            'To absorb extra water during the bud stage',
            'To attract insects that carry out pollination',
          ],
          correct_index: 3,
          explanation: "Bright petal colour attracts insects for pollination — that's the corolla's job. Petals don't store food for the embryo (that's the seed's job later), don't shield sepals (sepals sit outside the petals, not the reverse), and colour has nothing to do with absorbing water.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'A flower has five petals. The largest one clearly overlaps two lateral petals, and those two in turn overlap the two smallest, innermost petals. Which aestivation is this, and where is it typically seen?',
          options: [
            'Vexillary — the standard overlaps two wings, which overlap the keel, as in pea and bean',
            "Twisted — one petal margin overlaps the next all the way round, as in china rose and cotton",
            'Imbricate — petals overlap each other with no fixed direction, as in Cassia and gulmohur',
            'Valvate — petal margins merely touch without any overlap, as in Calotropis',
          ],
          correct_index: 0,
          explanation: "The standard-overlaps-wings-overlaps-keel pattern, in a five-petalled flower, is the exact definition of vexillary (papilionaceous) aestivation — seen in pea and bean flowers. Twisted and imbricate both involve overlap but without this specific standard/wing/keel structure, and valvate has no overlap at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'In a Calotropis flower bud, the petal margins simply touch one another with no overlap at all. Which aestivation is this, and how does it differ from imbricate?',
          options: [
            'Twisted — margins overlap consistently in one direction, exactly like imbricate aestivation',
            'Imbricate — margins touch but never actually overlap, exactly like valvate aestivation',
            'Valvate — margins just touch with no overlap, unlike imbricate which does overlap',
            'Vexillary — Calotropis belongs to the pea family with standard, wing and keel petals',
          ],
          correct_index: 2,
          explanation: "This is valvate aestivation — sepals or petals just touch at the margin without overlapping, as in Calotropis. Imbricate is different precisely because its margins do overlap, just with no fixed direction. Twisted also involves overlap (in one direction), and Calotropis isn't a pea-family flower, so vexillary doesn't apply.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
