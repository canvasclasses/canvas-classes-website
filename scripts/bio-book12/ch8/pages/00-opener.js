'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-8-overview',
  title: 'Microbes in Human Welfare',
  subtitle: "Chapter 7 showed you microbes that make us ill. This one flips the picture — the same invisible world sets your curd, brews your medicine, cleans your city's sewage, and feeds your fields.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['microbes-in-human-welfare'],
  glossary: [
    { term: 'microbe', definition: 'A micro-organism too small to see with the naked eye — protozoa, bacteria, fungi, and microscopic viruses, viroids and prions all count.' },
    { term: 'fermentation', definition: 'The chemical breakdown of a substance by microbes as they grow — the process that turns milk into curd, dough into risen bread, and fruit juice into wine.' },
    { term: 'inoculum', definition: 'A small starter amount of a microbe added to fresh material to kick off growth — like the spoon of curd (a starter) stirred into warm milk to set a whole new batch.' },
    { term: 'antibiotic', definition: 'A chemical produced by some microbes that can kill or slow the growth of other, disease-causing microbes — Penicillin being the first one discovered.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A single dark dusk scene weaving together a kitchen curd pot, a bubbling fermentor, a sewage aeration tank, a village biogas dome and a green field — all lit as one connected world',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk composition that flows left to right through the ways microbes quietly serve people, with no hard borders between scenes: on the far left a warm-lit village kitchen with an earthen pot of setting curd and a stack of dosa, blending into a tall industrial fermentor vessel glowing softly, then into the churning surface of a sewage aeration tank, then a rural biogas dome with a faint flame at a stove, and finally opening onto a green field of leguminous crops at dusk with faint root nodules suggested in the dark soil below. Everything sits under one continuous deep-dusk sky with a single warm horizon glow tying the whole panorama together, suggesting all these different scenes are really one invisible living world at work. Painterly, atmospheric illustration style, dark background tones throughout (#0a0a0a base), no people as focal subjects, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'You Already Ate Their Work Today',
      markdown: "The curd on your plate, the idli and dosa at breakfast, the bread in a sandwich, the slice of cheese — every one of them was made for you by micro-organisms you can't see. Widen the view a little and the same invisible workers are brewing antibiotics that once wiped out **plague and diphtheria**, cleaning the sewage of entire cities, and pulling nitrogen out of thin air to fertilise farmland. Microbes aren't just the villains of the last chapter — they're some of the hardest-working helpers we have.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "In the last chapter you read that microbes cause a long list of diseases in humans, animals, and plants. It would be easy to walk away thinking they're all enemies. They aren't. **Microbes** — protozoa, bacteria, fungi, and the microscopic viruses, viroids and prions — live absolutely everywhere: in soil, water, and air, inside our bodies, even in scalding thermal vents near 100 °C and under metres of snow. Most of them do us no harm at all, and a remarkable number are genuinely useful.\n\nThis chapter is about that useful side. Once you learn to grow microbes on a nutritive medium so their colonies become visible to the naked eye, you can put them to work — and humans have been doing exactly that, in kitchens, factories, treatment plants, and fields, for a very long time.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "The chapter walks through six different jobs microbes do for us, moving out from the home to the whole environment. First, the **household products** we make with them every day — curd, fermented idli and dosa dough, bread, and cheese. Then the same organisms scaled up for **industrial products**: fermented beverages, life-saving antibiotics like Penicillin, and useful chemicals and enzymes. From there the story widens outward — microbes doing the heavy work of **sewage treatment**, turning cellulose waste into **biogas** for cooking and lighting, acting as **biocontrol agents** that fight pests without toxic sprays, and finally serving as **biofertilisers** that enrich the soil in place of chemicals.",
    },
    {
      id: uuid(), type: 'callout', order: 4, variant: 'remember', title: 'Your Roadmap — The Six Jobs Microbes Do',
      markdown: "- **8.1 Household Products** — curd, idli/dosa dough, bread, toddy, cheese\n- **8.2 Industrial Products** — fermented beverages, antibiotics, and chemicals, enzymes & other bioactive molecules\n- **8.3 Sewage Treatment** — cleaning up municipal waste water\n- **8.4 Biogas** — methane-rich fuel from cattle dung and other bio-waste\n- **8.5 Biocontrol Agents** — fighting crop pests and diseases without chemicals\n- **8.6 Biofertilisers** — enriching soil nutrients naturally\n\nKeep this list in your head as a map — every page ahead is one of these six jobs, one at a time.",
    },
  ],
};
